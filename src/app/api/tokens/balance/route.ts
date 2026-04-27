import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBalance, MODEL_PRICING, calcCostKrw } from "@/lib/token-broker";
import { prisma as _prisma } from "@/lib/prisma";

type UsageRow = { id: string; feature: string; model: string; inputTokens: number; outputTokens: number; cost: number; createdAt: Date };
type PurchaseRow = { id: string; packageId: string; amount: number; credit: number; bonus: number; createdAt: Date };
type EP = typeof _prisma & {
  tokenUsage: { findMany: (a: object) => Promise<UsageRow[]> };
  tokenPurchase: { findMany: (a: object) => Promise<PurchaseRow[]> };
};
const prisma = _prisma as EP;

/**
 * GET /api/tokens/balance
 * 현재 크레딧 잔액 + 최근 사용 내역 + 예상 사용 횟수 반환
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? request.nextUrl.searchParams.get("userId") ?? "demo-user";

  try {
    type UsageRow = { id: string; feature: string; model: string; inputTokens: number; outputTokens: number; cost: number; createdAt: Date };
    type PurchaseRow = { id: string; packageId: string; amount: number; credit: number; bonus: number; createdAt: Date };

    const [balance, recentUsages, purchases] = await Promise.all([
      getBalance(userId),
      prisma.tokenUsage.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.tokenPurchase.findMany({
        where: { userId, status: "confirmed" },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    // 이번 달 사용량 집계
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsages = recentUsages.filter((u: UsageRow) => u.createdAt >= startOfMonth);
    const monthlySpentKrw = monthlyUsages.reduce((s: number, u: UsageRow) => s + u.cost * 1400, 0);

    // 잔액으로 모델별 예상 가능 횟수
    const estimatedCalls: Record<string, number> = {};
    for (const [modelId, pricing] of Object.entries(MODEL_PRICING)) {
      const avgCostPerCall = calcCostKrw(modelId, 800, 600); // 일반 대화 기준
      estimatedCalls[modelId] = balance > 0 ? Math.floor(balance / avgCostPerCall) : 0;
    }

    return NextResponse.json({
      balance: Math.floor(balance * 10) / 10,
      balanceFormatted: `₩${Math.floor(balance).toLocaleString("ko-KR")}`,
      monthlySpentKrw: Math.round(monthlySpentKrw),
      estimatedCalls,
      recentUsages: recentUsages.slice(0, 10).map((u: UsageRow) => ({
        id: u.id,
        feature: u.feature,
        model: u.model,
        inputTokens: u.inputTokens,
        outputTokens: u.outputTokens,
        costKrw: Math.round(u.cost * 1400 * 10) / 10,
        createdAt: u.createdAt,
      })),
      recentPurchases: purchases.map((p: PurchaseRow) => ({
        id: p.id,
        packageId: p.packageId,
        amount: p.amount,
        credit: p.credit,
        bonus: p.bonus,
        createdAt: p.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({
      balance: 0,
      balanceFormatted: "₩0",
      monthlySpentKrw: 0,
      estimatedCalls: {},
      recentUsages: [],
      recentPurchases: [],
      mode: "mock",
    });
  }
}
