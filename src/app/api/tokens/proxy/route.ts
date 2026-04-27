import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { proxyAnthropicCall, MODEL_PRICING } from "@/lib/token-broker";

/**
 * POST /api/tokens/proxy
 * 크레딧을 소모하여 AI API를 대신 호출하는 중매 엔드포인트
 *
 * Body:
 *   model?:       string   (default: claude-haiku-4-5-20251001)
 *   feature:      string   (용도 식별: chat | learn | agent | rag)
 *   messages:     Array<{role, content}>
 *   systemPrompt?: string
 *   maxTokens?:   number   (default: 1024)
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json() as {
      model?: string;
      feature: string;
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      systemPrompt?: string;
      maxTokens?: number;
    };

    const { model, feature, messages, systemPrompt, maxTokens } = body;

    if (!feature) {
      return NextResponse.json({ error: "feature 파라미터가 필요합니다." }, { status: 400 });
    }
    if (!messages?.length) {
      return NextResponse.json({ error: "messages가 비어 있습니다." }, { status: 400 });
    }

    const selectedModel = model && MODEL_PRICING[model] ? model : "claude-haiku-4-5-20251001";

    const result = await proxyAnthropicCall({
      userId,
      model: selectedModel,
      feature,
      messages,
      systemPrompt,
      maxTokens,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 402 }); // 402 Payment Required
    }

    return NextResponse.json({
      content: result.content,
      usage: {
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        costKrw: result.costKrw,
        remainingKrw: result.remainingKrw,
      },
      model: selectedModel,
      modelLabel: MODEL_PRICING[selectedModel]?.label,
    });
  } catch (error) {
    console.error("[tokens/proxy]", error);
    return NextResponse.json(
      { error: "API 호출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
