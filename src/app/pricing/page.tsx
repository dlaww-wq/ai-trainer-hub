"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  MessageSquare,
  BarChart3,
  Globe,
  Crown,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  플랜 데이터                                                         */
/* ------------------------------------------------------------------ */
const PLANS = [
  {
    id: "free",
    name: "무료",
    price: 0,
    period: "영구 무료",
    description: "시작하는 자영업자를 위한 플랜",
    monthlyChats: 100,
    icon: Sparkles,
    color: "from-slate-600 to-slate-700",
    border: "border-slate-700",
    popular: false,
    features: [
      "월 100건 AI 응대",
      "1개 매장 에이전트",
      "텍스트 학습 기능",
      "네이버 플레이스 연동",
      "기본 대화 이력",
    ],
    limits: ["카카오톡 채널 미지원", "에스컬레이션 알림 미지원"],
  },
  {
    id: "basic",
    name: "베이직",
    price: 19900,
    period: "월",
    description: "운영이 안정된 매장을 위한 플랜",
    monthlyChats: 500,
    icon: MessageSquare,
    color: "from-blue-600 to-indigo-600",
    border: "border-blue-500",
    popular: false,
    features: [
      "월 500건 AI 응대",
      "3개 매장 에이전트",
      "텍스트 + 이미지 학습",
      "에스컬레이션 이메일 알림",
      "대화 이력 30일",
      "토큰 사용량 대시보드",
    ],
    limits: ["카카오톡 채널 미지원"],
  },
  {
    id: "standard",
    name: "스탠다드",
    price: 39900,
    period: "월",
    description: "멀티채널 응대가 필요한 매장",
    monthlyChats: 2000,
    icon: Globe,
    color: "from-violet-600 to-purple-600",
    border: "border-violet-500",
    popular: true,
    features: [
      "월 2,000건 AI 응대",
      "10개 매장 에이전트",
      "전체 학습 기능",
      "카카오톡 채널 연동",
      "에스컬레이션 카카오 알림",
      "대화 이력 90일",
      "월간 인사이트 리포트",
    ],
    limits: [],
  },
  {
    id: "premium",
    name: "프리미엄",
    price: 79900,
    period: "월",
    description: "프랜차이즈 / 대형 매장",
    monthlyChats: 999999,
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    border: "border-amber-500",
    popular: false,
    features: [
      "무제한 AI 응대",
      "무제한 매장 에이전트",
      "전체 학습 기능 + 우선 처리",
      "카카오톡 + 인스타그램 DM",
      "에스컬레이션 실시간 알림",
      "대화 이력 무제한",
      "전담 온보딩 지원",
      "API 직접 연동",
    ],
    limits: [],
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

/* ------------------------------------------------------------------ */
/*  메인 컴포넌트 (useSearchParams를 위한 내부 컴포넌트)                 */
/* ------------------------------------------------------------------ */
function PricingContent() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("status");

  const [currentPlan] = useState<PlanId>("free");
  const [loading, setLoading] = useState<PlanId | null>(null);

  useEffect(() => {
    if (paymentStatus === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [paymentStatus]);

  const handleUpgrade = async (planId: PlanId) => {
    if (planId === "free" || planId === currentPlan) return;
    setLoading(planId);

    try {
      const res = await fetch("/api/payment/toss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, userId: "demo-user" }),
      });
      const data = await res.json() as {
        ok?: boolean;
        tossParams?: {
          clientKey: string;
          orderId: string;
          orderName: string;
          amount: number;
          successUrl: string;
          failUrl: string;
        };
      };

      if (data.tossParams) {
        // 토스페이먼츠 SDK가 없으면 직접 URL로 이동 (테스트용)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        if (typeof window !== "undefined" && win.TossPayments) {
          // 실제 SDK 사용
          const toss = win.TossPayments(data.tossParams.clientKey);
          await toss.requestPayment("카드", {
            orderId: data.tossParams.orderId,
            orderName: data.tossParams.orderName,
            amount: data.tossParams.amount,
            successUrl: data.tossParams.successUrl,
            failUrl: data.tossParams.failUrl,
            customerName: "사용자",
          });
        } else {
          // SDK 없을 때 → 테스트 결제 URL 안내
          alert(`결제 연동 준비 중입니다.\n\n주문 ID: ${data.tossParams.orderId}\n금액: ${data.tossParams.amount.toLocaleString()}원\n\n실제 서비스에서 토스페이먼츠 SDK를 통해 결제됩니다.`);
        }
      }
    } catch (err) {
      console.error("[pricing] 결제 오류:", err);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100">
      {/* 헤더 */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-6 text-center">
        {paymentStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-center gap-2 bg-emerald-900/30 border border-emerald-700/50 text-emerald-300 rounded-xl px-4 py-3 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            결제가 완료되었습니다! 플랜이 즉시 활성화됩니다.
          </motion.div>
        )}
        {paymentStatus === "fail" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-center gap-2 bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            결제가 취소되었습니다. 다시 시도해 주세요.
          </motion.div>
        )}

        <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/50 rounded-full px-4 py-1.5 text-xs text-violet-300 mb-4">
          <Zap className="w-3.5 h-3.5" />
          첫 달 무료 체험 · 언제든 해지 가능
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          내 매장에 맞는 플랜 선택
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          AI가 고객을 응대하고, 사장님은 더 중요한 일에 집중하세요.
          투자 대비 평균 5배 이상의 효과.
        </p>
      </div>

      {/* 플랜 카드 */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan, idx) => {
            const Icon = plan.icon;
            const isCurrent = plan.id === currentPlan;
            const isLoading = loading === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`relative rounded-2xl border ${plan.border} bg-slate-900/60 flex flex-col overflow-hidden ${
                  plan.popular ? "ring-2 ring-violet-500/60" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-violet-600 text-white text-[10px] font-bold text-center py-1.5 tracking-wider">
                    가장 인기
                  </div>
                )}

                <div className={`bg-gradient-to-br ${plan.color} p-5`}>
                  <Icon className="w-6 h-6 text-white/80 mb-2" />
                  <div className="font-bold text-white text-lg">{plan.name}</div>
                  <div className="text-white/70 text-xs mt-0.5">{plan.description}</div>
                  <div className="mt-3">
                    {plan.price === 0 ? (
                      <span className="text-2xl font-bold text-white">무료</span>
                    ) : (
                      <div>
                        <span className="text-2xl font-bold text-white">
                          {plan.price.toLocaleString()}원
                        </span>
                        <span className="text-white/70 text-xs ml-1">/{plan.period}</span>
                      </div>
                    )}
                    <div className="text-white/60 text-[11px] mt-1">
                      월 {plan.monthlyChats === 999999 ? "무제한" : `${plan.monthlyChats.toLocaleString()}건`} 응대
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.limits.map((l) => (
                      <li key={l} className="flex items-start gap-2 text-xs text-slate-500 line-through">
                        <span className="w-3.5 h-3.5 shrink-0 mt-0.5 flex items-center justify-center text-slate-600">✕</span>
                        {l}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => void handleUpgrade(plan.id)}
                    disabled={isCurrent || isLoading || plan.id === "free"}
                    className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      isCurrent
                        ? "bg-slate-700 text-slate-400 cursor-default"
                        : plan.id === "free"
                          ? "bg-slate-800 text-slate-400 cursor-default"
                          : isLoading
                            ? "bg-violet-700 text-white cursor-wait"
                            : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 active:scale-[0.98]`
                    }`}
                  >
                    {isCurrent ? (
                      "현재 플랜"
                    ) : plan.id === "free" ? (
                      "기본 플랜"
                    ) : isLoading ? (
                      <>처리 중...</>
                    ) : (
                      <>
                        업그레이드 <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ / 안내 */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: "🔒", title: "안전한 결제", desc: "토스페이먼츠 보안 결제\nPCI DSS 인증" },
            { icon: "🔄", title: "언제든 해지", desc: "약정 없음\n해지 즉시 반영" },
            { icon: "💬", title: "전담 지원", desc: "스탠다드 이상\n카카오톡 전담 채널" },
          ].map((item) => (
            <div key={item.title} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-white text-sm">{item.title}</div>
              <div className="text-xs text-slate-400 mt-1 whitespace-pre-line">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* 결제 안내 */}
        <div className="mt-6 bg-slate-800/30 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white text-sm mb-1">결제 연동 안내</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                토스페이먼츠 연동이 활성화되면 신용카드, 간편결제(카카오페이·네이버페이·토스페이) 등 모든 결제 수단을 지원합니다.{" "}
                <code className="bg-slate-700 px-1 py-0.5 rounded text-violet-300">TOSS_CLIENT_KEY</code>와{" "}
                <code className="bg-slate-700 px-1 py-0.5 rounded text-violet-300">TOSS_SECRET_KEY</code>를
                Railway Variables에 등록하면 즉시 활성화됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d1117]" />}>
      <PricingContent />
    </Suspense>
  );
}
