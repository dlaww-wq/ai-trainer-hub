"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Phone, Clock, MapPin, Star, Brain, Loader2, MessageSquare } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  매장별 데모 데이터                                                   */
/* ------------------------------------------------------------------ */
interface StoreData {
  name: string;
  category: string;
  address: string;
  hours: string;
  phone: string;
  rating: number;
  reviewCount: number;
  image: string;
  color: string;
  gradient: string;
  greeting: string;
  quickQuestions: string[];
  responses: Record<string, string>;
  fallback: string;
}

const STORES: Record<string, StoreData> = {
  "soulbrew": {
    name: "소울브루 커피",
    category: "카페",
    address: "서울 마포구 연남로 27길 15, 2층",
    hours: "월~금 08:00-22:00 · 토 09:00-22:00 · 일 10:00-21:00",
    phone: "02-1234-5678",
    rating: 4.7,
    reviewCount: 328,
    image: "☕",
    color: "text-orange-600",
    gradient: "from-orange-500 to-amber-500",
    greeting: "안녕하세요! 소울브루 커피 AI입니다 ☕\n무엇이든 편하게 물어보세요!",
    quickQuestions: ["메뉴 추천해주세요", "주차 가능한가요?", "예약하고 싶어요", "비건 메뉴 있어요?", "오늘 영업하나요?"],
    responses: {
      "메뉴": `소울브루 메뉴 추천드릴게요! 😊

☕ **시그니처 라떼** (6,000원) — 제일 인기!
매일 아침 로스팅한 콜롬비아 수프리모 원두에 수제 바닐라시럽을 넣어요. 다른 카페에선 못 드시는 깊은 풍미!

달달한 거 좋으시면 **바닐라라떼** 추천 — 마다가스카르산 바닐라빈으로 직접 만든 시럽이라 기성품이랑 맛이 완전 달라요 ✨

커피를 못 드시면 **자몽에이드** (5,500원) — 생자몽 직접 착즙, 탄산 세기 조절 가능!

💡 **라떼 + 수제 마들렌 세트** 8,500원 (1,000원 할인) 같이 드시면 가성비 최고예요 🧁`,
      "주차": `네, 주차 가능합니다! 🚗

건물 뒤편에 주차장 3대 가능하고, 소울브루 이용 시 **1시간 무료**예요.
카운터에서 차량번호만 말씀해주시면 등록해드릴게요.

주말 점심에는 만차일 수 있어서, **연남동 공영주차장**(도보 3분)도 괜찮아요.
대중교통으로는 **홍대입구역 3번 출구** 도보 8분입니다! 🚶`,
      "예약": `예약 도와드릴게요! 📅

✅ 2인 이상 전화/카카오톡 예약 가능
✅ 주말은 최소 2일 전 예약 추천
✅ 2층 단체석: 최대 8인 (10인 이상 전체 대관 가능, 최소 주문 15만원)

원하시는 날짜, 시간, 인원 알려주시면 바로 확인해드릴게요!

아, 생일이시면 **케이크 반입 가능**하고, 촛불이랑 접시도 준비해드려요 🎂`,
      "비건": `비건 메뉴 안내드릴게요! 🌱

☕ **음료**
• 오트밀크 라떼 — 바리스타 오트밀크 사용, 거품도 잘 나요!
• 아메리카노 / 콜드브루 — 당연히 비건이죠 😄
• 자몽에이드 / 레몬에이드 — 생과일이라 안심하세요

🧁 비건 디저트는 현재 준비 중인데, 알러지 있으시면 미리 말씀해주시면 확인해드릴게요!

혹시 유제품만 피하시는 건지, 완전 비건이신지에 따라 추천이 달라질 수 있어요!`,
      "영업": `오늘 영업합니다! ⏰

📅 영업시간
• 월~금: 08:00 ~ 22:00
• 토요일: 09:00 ~ 22:00
• 일요일: 10:00 ~ 21:00
• 라스트오더: 마감 30분 전

정기휴무는 매월 **첫째, 셋째 월요일**이에요.
오시기 전에 주말 붐비는 시간(12~2시) 피하시면 여유롭게 즐기실 수 있어요 😊`,
    },
    fallback: "그 부분은 제가 정확히 답변드리기 어려워요 😅\n\n**사장님께 직접 여쭤볼까요?** 실시간으로 연결해드릴 수 있어요!\n아니면 전화(02-1234-5678)로 문의하셔도 됩니다.",
  },
  "trendshop": {
    name: "트렌드샵",
    category: "쇼핑몰",
    address: "온라인 쇼핑몰",
    hours: "24시간 운영",
    phone: "1588-0000",
    rating: 4.5,
    reviewCount: 1247,
    image: "🛍️",
    color: "text-pink-600",
    gradient: "from-pink-500 to-rose-500",
    greeting: "안녕하세요! 트렌드샵입니다 🛍️\n주문, 배송, 교환/환불 뭐든 물어보세요!",
    quickQuestions: ["환불 가능한가요?", "배송 얼마나 걸려요?", "사이즈 추천해주세요", "교환하고 싶어요", "쿠폰 있나요?"],
    responses: {
      "환불": `환불 도와드릴게요! 📦

주문번호 알려주시면 바로 확인해드리겠습니다.

기본 규정 안내:
• **미개봉 + 7일 이내** → 전액 환불 가능
• **개봉 후 7일 이내** → 교환 가능 (불량 제외)
• **불량품** → 30일 이내 전액 환불 + 반품비 무료

반품 접수하시면 평균 3~5영업일 내 환불 처리됩니다.
혹시 상품에 문제가 있으셨나요? 자세히 말씀해주시면 빠르게 처리해드리겠습니다 🙏`,
      "배송": `배송 안내드릴게요! 🚚

• **일반 배송**: 결제 후 1~3영업일 (무료, 3만원 이상)
• **빠른 배송**: 오후 2시 전 결제 → 다음날 도착 (+3,000원)
• **도서산간**: 2~5영업일 추가 소요

📦 배송 조회는 마이페이지에서 확인 가능해요!
주문번호 알려주시면 현재 상태도 바로 확인해드릴게요.`,
      "사이즈": `사이즈 도움드릴게요! 👕

어떤 상품 보고 계세요? 상품명이나 링크 알려주시면 정확한 사이즈표 안내해드릴게요.

일반적으로:
• **오버핏 상의**: 평소 사이즈 그대로 OK
• **슬림핏 상의**: 한 사이즈 업 추천
• **하의**: 허리/엉덩이/허벅지 중 가장 큰 부위 기준

키, 몸무게, 평소 사이즈 알려주시면 더 정확하게 추천드릴 수 있어요!`,
      "교환": `교환 신청 도와드릴게요! 🔄

주문번호와 교환 원하시는 사이즈/색상 알려주시면 바로 처리해드릴게요.

• **교환 가능 기간**: 수령 후 7일 이내
• **교환 배송비**: 단순 변심 시 3,000원 / 불량 시 무료
• **재고 없을 경우**: 환불 또는 다른 상품으로 변경 가능

교환품 수거 후 1~2일 내 새 상품 발송됩니다!`,
      "쿠폰": `현재 진행 중인 쿠폰/이벤트 안내해요! 🎉

🏷️ **4월 이벤트**
• 신규 가입: 3,000원 할인 쿠폰
• 첫 구매: 무료배송 쿠폰
• 5만원 이상: 10% 할인 (최대 5,000원)
• 리뷰 작성: 500 포인트 적립

마이페이지 → 쿠폰함에서 확인하실 수 있어요!
혹시 특정 상품 할인 정보가 궁금하시면 알려주세요 😊`,
    },
    fallback: "해당 문의는 제가 바로 답변드리기 어려워요.\n\n**담당자에게 연결해드릴까요?** 평균 5분 내 답변받으실 수 있어요!\n또는 1588-0000으로 전화하셔도 됩니다.",
  },
};

/* ------------------------------------------------------------------ */
/*  메인 페이지                                                         */
/* ------------------------------------------------------------------ */
export default function StorePage() {
  const params = useParams();
  const slug = (params.slug as string) || "soulbrew";
  const store = STORES[slug] || STORES["soulbrew"];

  const [messages, setMessages] = useState<{ role: "user" | "ai" | "system"; text: string }[]>([
    { role: "ai", text: store.greeting },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const getResponse = (question: string): string => {
    const q = question.toLowerCase();
    for (const [key, response] of Object.entries(store.responses)) {
      if (q.includes(key.toLowerCase()) || q.includes(key)) {
        return response;
      }
    }
    setShowEscalation(true);
    return store.fallback;
  };

  const handleSend = (text?: string) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput("");
    setShowEscalation(false);
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: getResponse(q) }]);
    }, 600 + Math.random() * 800);
  };

  const handleEscalation = () => {
    setShowEscalation(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "네, 사장님이랑 직접 얘기하고 싶어요" },
    ]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `사장님께 알림을 보냈습니다! 📱\n\n잠시만 기다려주시면 사장님이 직접 대화에 참여하실 거예요.\n평균 응답 시간: 약 3분\n\n급하시면 전화로도 연결 가능해요: ${store.phone}`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Store Header */}
      <div className={`bg-gradient-to-r ${store.gradient} text-white px-4 py-4`}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="text-4xl">{store.image}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{store.name}</h1>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{store.category}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-white/80">
              <span className="flex items-center gap-1">
                <Star className="size-3 fill-yellow-300 text-yellow-300" />
                {store.rating} ({store.reviewCount})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {store.address.split(",")[0]}
              </span>
            </div>
          </div>
        </div>
        <div className="max-w-lg mx-auto flex items-center gap-4 mt-3 text-xs text-white/70">
          <span className="flex items-center gap-1"><Clock className="size-3" />{store.hours.split("·")[0]}</span>
          <span className="flex items-center gap-1"><Phone className="size-3" />{store.phone}</span>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-3" style={{ scrollbarWidth: "thin" }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "ai" && (
              <div className={`size-8 rounded-full bg-gradient-to-br ${store.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                <Bot className="size-4 text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
              msg.role === "user"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-white text-gray-700 rounded-bl-sm border border-gray-100"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
            </div>
            {msg.role === "user" && (
              <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <User className="size-4 text-gray-500" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Escalation Button */}
        <AnimatePresence>
          {showEscalation && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <button
                onClick={handleEscalation}
                className="w-full flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                <MessageSquare className="size-4" />
                사장님께 직접 연결하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing */}
        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
              <div className={`size-8 rounded-full bg-gradient-to-br ${store.gradient} flex items-center justify-center`}>
                <Brain className="size-4 text-white animate-pulse" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm flex items-center gap-2">
                <Loader2 className="size-4 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-400">답변 작성 중...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Questions */}
      <div className="px-4 pb-2 max-w-lg mx-auto w-full">
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {store.quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="shrink-0 text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100 max-w-lg mx-auto w-full">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 점을 물어보세요..."
            className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button type="submit" className="size-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 shrink-0">
            <Send className="size-4" />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          AI가 학습된 데이터를 기반으로 답변합니다 · Powered by AI Trainer Hub
        </p>
      </div>
    </div>
  );
}
