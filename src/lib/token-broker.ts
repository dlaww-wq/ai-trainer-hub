/**
 * Token Broker — API 중매 시스템
 *
 * 역할: 사용자가 직접 API 키 없이 플랫폼을 통해 AI API를 사용할 수 있도록
 *       크레딧(KRW)을 차감하고, 플랫폼 마스터 키로 API를 대신 호출합니다.
 *
 * 가격 책정:
 *   - 원가: Anthropic/OpenAI 공식 단가 × 환율 1,400 KRW/USD
 *   - 사용자 청구: 원가 × 1.3 (30% 마진)
 *   - 단위: KRW per 1,000 tokens
 */

import { prisma as _prisma } from "./prisma";

// 새 모델(TokenCredit, TokenPurchase)은 `prisma generate` 후 타입이 생성됩니다.
// 그 전까지는 아래 캐스트를 사용합니다.
type ExtendedPrisma = typeof _prisma & {
  tokenCredit: {
    findUnique: (args: object) => Promise<{ balance: number } | null>;
    upsert: (args: object) => Promise<{ balance: number }>;
  };
  tokenPurchase: {
    create: (args: object) => Promise<{ id: string }>;
    findUnique: (args: object) => Promise<{ userId: string; packageId: string; credit: number; status: string } | null>;
    update: (args: object) => Promise<{ id: string }>;
    findMany: (args: object) => Promise<Array<{ id: string; packageId: string; amount: number; credit: number; bonus: number; createdAt: Date }>>;
  };
};
const prisma = _prisma as ExtendedPrisma;

// ─── 모델별 KRW 단가 (per 1,000 tokens) ──────────────────────

export const MODEL_PRICING: Record<
  string,
  { input: number; output: number; label: string }
> = {
  "claude-haiku-4-5-20251001": {
    input: 0.5,    // Anthropic $0.25/M → ₩0.35 → 마진 30% → ₩0.5
    output: 2.0,   // Anthropic $1.25/M → ₩1.75 → 마진 30% → ₩2.0
    label: "Claude Haiku 4.5",
  },
  "claude-sonnet-4-6": {
    input: 6.0,    // Anthropic $3/M → ₩4.2 → 마진 30% → ₩6.0
    output: 30.0,  // Anthropic $15/M → ₩21 → 마진 30% → ₩30.0
    label: "Claude Sonnet 4.6",
  },
  "claude-opus-4-7": {
    input: 30.0,   // Anthropic $15/M → ₩21 → 마진 30% → ₩30.0
    output: 140.0, // Anthropic $75/M → ₩105 → 마진 30% → ₩140.0
    label: "Claude Opus 4.7",
  },
  "gpt-4o-mini": {
    input: 0.4,    // OpenAI $0.15/M → ₩0.21 → 마진 30% → ₩0.4
    output: 1.6,   // OpenAI $0.60/M → ₩0.84 → 마진 30% → ₩1.6
    label: "GPT-4o mini",
  },
  "gpt-4o": {
    input: 7.0,    // OpenAI $2.50/M → ₩3.5 → 마진 30% → ₩7.0
    output: 28.0,  // OpenAI $10/M → ₩14 → 마진 30% → ₩28.0
    label: "GPT-4o",
  },
};

// ─── 크레딧 패키지 ─────────────────────────────────────────────

export const CREDIT_PACKAGES = {
  credit_1k: {
    id: "credit_1k",
    label: "입문",
    amount: 1000,    // 결제금액 (KRW)
    credit: 1000,    // 충전 크레딧 (KRW)
    bonus: 0,
    bonusPct: 0,
    description: "간단 테스트용",
    popular: false,
  },
  credit_5k: {
    id: "credit_5k",
    label: "기본",
    amount: 5000,
    credit: 5000,
    bonus: 0,
    bonusPct: 0,
    description: "Haiku 약 3,000회 대화",
    popular: false,
  },
  credit_10k: {
    id: "credit_10k",
    label: "스탠다드",
    amount: 10000,
    credit: 10500,   // 5% 보너스
    bonus: 500,
    bonusPct: 5,
    description: "Haiku 약 6,000회 대화 / Sonnet 60회 학습팩",
    popular: true,
  },
  credit_30k: {
    id: "credit_30k",
    label: "프로",
    amount: 30000,
    credit: 33000,   // 10% 보너스
    bonus: 3000,
    bonusPct: 10,
    description: "Sonnet 약 200회 학습팩 생성",
    popular: false,
  },
  credit_100k: {
    id: "credit_100k",
    label: "비즈니스",
    amount: 100000,
    credit: 120000,  // 20% 보너스
    bonus: 20000,
    bonusPct: 20,
    description: "대규모 사용 · 팀 단위",
    popular: false,
  },
} as const;

export type CreditPackageId = keyof typeof CREDIT_PACKAGES;

// ─── 비용 계산 ──────────────────────────────────────────────────

export function calcCostKrw(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[model] ?? MODEL_PRICING["claude-haiku-4-5-20251001"];
  const cost =
    (inputTokens / 1000) * pricing.input +
    (outputTokens / 1000) * pricing.output;
  return Math.ceil(cost * 10) / 10; // 소수점 1자리, 올림
}

// ─── 잔액 조회 ──────────────────────────────────────────────────

export async function getBalance(userId: string): Promise<number> {
  try {
    const credit = await prisma.tokenCredit.findUnique({ where: { userId } });
    return credit?.balance ?? 0;
  } catch {
    return 0;
  }
}

// ─── 잔액 차감 (원자적) ────────────────────────────────────────

export async function deductCredit(
  userId: string,
  costKrw: number,
  feature: string,
  model: string,
  inputTokens: number,
  outputTokens: number
): Promise<{ success: boolean; remaining: number; error?: string }> {
  try {
    const result = await prisma.$transaction(async (_tx) => {
      const tx = _tx as ExtendedPrisma;
      const credit = await tx.tokenCredit.findUnique({ where: { userId } });
      const balance = credit?.balance ?? 0;

      if (balance < costKrw) {
        throw new Error("INSUFFICIENT_CREDIT");
      }

      const updated = await tx.tokenCredit.upsert({
        where: { userId },
        update: { balance: { decrement: costKrw } },
        create: { userId, balance: 0 },
      });

      // 사용 내역 기록
      await tx.tokenUsage.create({
        data: {
          userId,
          feature,
          model,
          inputTokens,
          outputTokens,
          cost: costKrw / 1400, // USD 환산 저장 (기존 필드 호환)
        },
      });

      return updated.balance;
    });

    return { success: true, remaining: result };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "INSUFFICIENT_CREDIT") {
      return { success: false, remaining: 0, error: "잔액이 부족합니다. 크레딧을 충전해주세요." };
    }
    return { success: false, remaining: 0, error: "결제 처리 중 오류가 발생했습니다." };
  }
}

// ─── 크레딧 충전 ────────────────────────────────────────────────

export async function chargeCredit(
  userId: string,
  creditKrw: number
): Promise<void> {
  await prisma.tokenCredit.upsert({
    where: { userId },
    update: { balance: { increment: creditKrw } },
    create: { userId, balance: creditKrw },
  });
}

// ─── Anthropic API 프록시 호출 ──────────────────────────────────

export interface ProxyCallOptions {
  userId: string;
  model?: string;
  feature: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  systemPrompt?: string;
  maxTokens?: number;
}

export interface ProxyCallResult {
  success: boolean;
  content?: string;
  inputTokens?: number;
  outputTokens?: number;
  costKrw?: number;
  remainingKrw?: number;
  error?: string;
}

export async function proxyAnthropicCall(
  opts: ProxyCallOptions
): Promise<ProxyCallResult> {
  const model = opts.model ?? "claude-haiku-4-5-20251001";
  const maxTokens = opts.maxTokens ?? 1024;

  // 사전 잔액 확인 (예상 비용으로 가드)
  const balance = await getBalance(opts.userId);
  const minRequired = calcCostKrw(model, 500, maxTokens); // 최소 예상치
  if (balance < minRequired) {
    return {
      success: false,
      error: `잔액이 부족합니다. 현재 ₩${Math.floor(balance)}, 최소 필요 ₩${Math.ceil(minRequired)}`,
    };
  }

  // 실제 API 호출 (raw fetch — @ai-sdk/anthropic 프로젝트 컨벤션)
  const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: opts.systemPrompt,
      messages: opts.messages,
    }),
  });

  if (!apiRes.ok) {
    const err = await apiRes.text();
    return { success: false, error: `API 오류: ${err}` };
  }

  const response = await apiRes.json() as {
    content: Array<{ type: string; text: string }>;
    usage: { input_tokens: number; output_tokens: number };
  };

  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const costKrw = calcCostKrw(model, inputTokens, outputTokens);
  const content =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  // 실제 사용량으로 차감
  const deductResult = await deductCredit(
    opts.userId,
    costKrw,
    opts.feature,
    model,
    inputTokens,
    outputTokens
  );

  if (!deductResult.success) {
    return { success: false, error: deductResult.error };
  }

  return {
    success: true,
    content,
    inputTokens,
    outputTokens,
    costKrw,
    remainingKrw: deductResult.remaining,
  };
}
