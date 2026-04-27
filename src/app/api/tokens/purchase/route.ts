import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CREDIT_PACKAGES, type CreditPackageId } from "@/lib/token-broker";
import { prisma as _prisma } from "@/lib/prisma";

type EP = typeof _prisma & { tokenPurchase: { create: (a: object) => Promise<{ id: string }> } };
const prisma = _prisma as EP;

/**
 * POST /api/tokens/purchase
 * 크레딧 패키지 구매 요청 → Toss 결제창 파라미터 반환
 *
 * Body: { packageId: CreditPackageId }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? "demo-user";

  try {
    const body = await request.json() as { packageId: string };
    const { packageId } = body;

    if (!packageId || !(packageId in CREDIT_PACKAGES)) {
      return NextResponse.json(
        { error: "유효하지 않은 패키지입니다." },
        { status: 400 }
      );
    }

    const pkg = CREDIT_PACKAGES[packageId as CreditPackageId];
    const orderId = `tkn_${userId}_${packageId}_${Date.now()}`;
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    // pending 구매 기록 생성
    try {
      await prisma.tokenPurchase.create({
        data: {
          userId,
          packageId,
          amount: pkg.amount,
          credit: pkg.credit,
          bonus: pkg.bonus,
          status: "pending",
          tossOrderId: orderId,
        },
      });
    } catch {
      // DB 없을 때 mock 응답
    }

    return NextResponse.json({
      ok: true,
      orderId,
      package: {
        id: pkg.id,
        label: pkg.label,
        amount: pkg.amount,
        credit: pkg.credit,
        bonus: pkg.bonus,
        bonusPct: pkg.bonusPct,
      },
      tossParams: {
        clientKey: process.env.TOSS_CLIENT_KEY ?? "test_ck_placeholder",
        orderId,
        orderName: `AI 토큰 크레딧 ${pkg.label} (₩${pkg.amount.toLocaleString("ko-KR")})`,
        amount: pkg.amount,
        successUrl: `${baseUrl}/api/payment/toss/tokens?status=success`,
        failUrl: `${baseUrl}/credits?status=fail`,
      },
    });
  } catch (error) {
    console.error("[tokens/purchase]", error);
    return NextResponse.json(
      { error: "결제 요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
