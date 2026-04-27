import { NextRequest, NextResponse } from "next/server";
import { prisma as _prisma } from "@/lib/prisma";
import { chargeCredit, CREDIT_PACKAGES, type CreditPackageId } from "@/lib/token-broker";

type PurchaseRow = { userId: string; packageId: string; credit: number; status: string };
type EP = typeof _prisma & {
  tokenPurchase: {
    findUnique: (a: object) => Promise<PurchaseRow | null>;
    update: (a: object) => Promise<PurchaseRow>;
  };
};
const prisma = _prisma as EP;

/**
 * GET /api/payment/toss/tokens?status=success&orderId=xxx&paymentKey=xxx&amount=xxx
 * Toss 결제 성공 콜백 → 크레딧 충전 → /credits 리다이렉트
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = Number(searchParams.get("amount") ?? "0");
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  if (status !== "success" || !orderId) {
    return NextResponse.redirect(`${baseUrl}/credits?status=fail`);
  }

  try {
    // 1. Toss API로 결제 검증 (실서비스에서는 서버-서버 검증 필수)
    if (process.env.TOSS_SECRET_KEY) {
      const encoded = Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64");
      const verifyRes = await fetch(
        `https://api.tosspayments.com/v1/payments/confirm`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${encoded}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        }
      );
      if (!verifyRes.ok) {
        return NextResponse.redirect(`${baseUrl}/credits?status=fail&reason=verify`);
      }
    }

    // 2. 구매 기록 조회
    const purchase = await prisma.tokenPurchase.findUnique({
      where: { tossOrderId: orderId },
    });

    if (!purchase || purchase.status === "confirmed") {
      return NextResponse.redirect(`${baseUrl}/credits?status=already`);
    }

    // 3. 이중 충전 방지 + 상태 업데이트
    await prisma.tokenPurchase.update({
      where: { tossOrderId: orderId },
      data: { status: "confirmed", tossPaymentKey: paymentKey ?? "" },
    });

    // 4. 크레딧 충전 (보너스 포함)
    const pkg = CREDIT_PACKAGES[purchase.packageId as CreditPackageId];
    await chargeCredit(purchase.userId, pkg ? pkg.credit : purchase.credit);

    return NextResponse.redirect(
      `${baseUrl}/credits?status=success&charged=${Math.floor(purchase.credit)}`
    );
  } catch (error) {
    console.error("[payment/toss/tokens]", error);
    return NextResponse.redirect(`${baseUrl}/credits?status=fail&reason=server`);
  }
}
