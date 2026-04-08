import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/tokens?userId=xxx
 * 토큰 사용량 통계 조회
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") || "demo-user";

  try {
    const usages = await prisma.tokenUsage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    type Usage = typeof usages[0];
    type ByFeature = Record<string, { input: number; output: number; cost: number; calls: number }>;

    const totalInput = usages.reduce((s: number, u: Usage) => s + u.inputTokens, 0);
    const totalOutput = usages.reduce((s: number, u: Usage) => s + u.outputTokens, 0);
    const totalCost = usages.reduce((s: number, u: Usage) => s + u.cost, 0);

    const byFeature = usages.reduce(
      (acc: ByFeature, u: Usage) => {
        if (!acc[u.feature]) acc[u.feature] = { input: 0, output: 0, cost: 0, calls: 0 };
        acc[u.feature].input += u.inputTokens;
        acc[u.feature].output += u.outputTokens;
        acc[u.feature].cost += u.cost;
        acc[u.feature].calls += 1;
        return acc;
      },
      {} as ByFeature
    );

    // 30일 일별 집계
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = usages.filter((u: Usage) => u.createdAt >= thirtyDaysAgo);
    const dailyCost = recent.reduce((s: number, u: Usage) => s + u.cost, 0);

    return NextResponse.json({
      summary: {
        totalInput,
        totalOutput,
        totalCost: Math.round(totalCost * 10000) / 10000,
        totalCalls: usages.length,
        dailyAvgCost: Math.round((dailyCost / 30) * 10000) / 10000,
      },
      byFeature,
      recent: usages.slice(0, 20),
    });
  } catch {
    return NextResponse.json({
      summary: { totalInput: 0, totalOutput: 0, totalCost: 0, totalCalls: 0 },
      byFeature: {},
      recent: [],
      mode: "mock",
    });
  }
}
