"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, User, Send, Phone, Clock, MapPin, Star,
  Brain, Loader2, MessageSquare, AlertCircle, CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  타입                                                                */
/* ------------------------------------------------------------------ */
interface Message {
  role: "user" | "ai" | "system";
  text: string;
  escalate?: boolean;
}

interface StoreInfo {
  name: string;
  category: string;
  address: string;
  hours: string;
  phone: string;
  rating: number;
  reviewCount: number;
  image: string;
  gradient: string;
  quickQuestions: string[];
}

/* ------------------------------------------------------------------ */
/*  데모 데이터 (DB 없을 때 fallback)                                   */
/* ------------------------------------------------------------------ */
const DEMO_STORES: Record<string, StoreInfo> = {
  soulbrew: {
    name: "소울브루 커피",
    category: "카페",
    address: "서울 마포구 연남로 27길 15",
    hours: "월~금 08:00-22:00 · 토일 09:00-21:00",
    phone: "02-1234-5678",
    rating: 4.7,
    reviewCount: 328,
    image: "☕",
    gradient: "from-orange-500 to-amber-500",
    quickQuestions: ["메뉴 추천해주세요", "주차 가능한가요?", "영업시간 알려주세요", "예약 가능한가요?"],
  },
  trendshop: {
    name: "트렌드샵",
    category: "쇼핑몰",
    address: "온라인",
    hours: "24시간",
    phone: "1588-0000",
    rating: 4.5,
    reviewCount: 1247,
    image: "🛍️",
    gradient: "from-pink-500 to-rose-500",
    quickQuestions: ["환불 가능한가요?", "배송 얼마나 걸려요?", "교환하고 싶어요", "쿠폰 있나요?"],
  },
};

const DEFAULT_STORE: StoreInfo = {
  name: "AI 안내 챗봇",
  category: "서비스",
  address: "",
  hours: "",
  phone: "",
  rating: 5.0,
  reviewCount: 0,
  image: "🤖",
  gradient: "from-violet-500 to-indigo-500",
  quickQuestions: ["무엇을 도와드릴까요?"],
};

/* ------------------------------------------------------------------ */
/*  메인 페이지                                                         */
/* ------------------------------------------------------------------ */
export default function StorePage() {
  const params = useParams();
  const slug = (params.slug as string) || "soulbrew";

  const [storeInfo, setStoreInfo] = useState<StoreInfo>(
    DEMO_STORES[slug] || DEFAULT_STORE
  );
  const [storeAgentId, setStoreAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalationSent, setEscalationSent] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── StoreAgent 조회 ─────────────────────────────────────
  useEffect(() => {
    fetch(`/api/store-agent?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: { agent?: { id: string; businessName: string; businessType: string } }) => {
        if (data.agent) {
          setStoreAgentId(data.agent.id);
          setStoreInfo((prev) => ({
            ...prev,
            name: data.agent!.businessName,
            category: data.agent!.businessType,
          }));
        }
        // 초기 인사 메시지
        const agentName = data.agent?.businessName || storeInfo.name;
        setMessages([
          {
            role: "ai",
            text: `안녕하세요! ${agentName} AI 안내원입니다 😊\n궁금하신 점을 편하게 물어보세요!`,
          },
        ]);
      })
      .catch(() => {
        setMessages([
          {
            role: "ai",
            text: `안녕하세요! ${storeInfo.name} AI 안내원입니다 😊\n궁금하신 점을 편하게 물어보세요!`,
          },
        ]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // ── 자동 스크롤 ─────────────────────────────────────────
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  // ── 메시지 전송 + 스트리밍 ──────────────────────────────
  const handleSend = useCallback(async (text?: string) => {
    const q = (text || input).trim();
    if (!q || isStreaming) return;

    setInput("");
    setShowEscalation(false);
    setEscalationSent(false);

    const userMsg: Message = { role: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // AI 응답 자리 추가 (스트리밍 중 업데이트)
    const aiMsgIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    try {
      const history = [...messages, userMsg]
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const res = await fetch("/api/chat/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          messages: history,
          sessionId,
        }),
      });

      if (!res.ok || !res.body) throw new Error("응답 오류");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // 스트리밍 중 메시지 업데이트
        setMessages((prev) => {
          const next = [...prev];
          const idx = prev.length - 1;
          if (idx >= 0 && next[idx].role === "ai") {
            next[idx] = { ...next[idx], text: fullText.replace("[ESCALATE]", "").trim() };
          }
          return next;
        });
      }

      // 에스컬레이션 감지
      if (fullText.includes("[ESCALATE]")) {
        setShowEscalation(true);
      }

    } catch (err) {
      console.error("[StorePage] 스트리밍 오류:", err);
      setMessages((prev) => {
        const next = [...prev];
        const idx = prev.length - 1;
        if (idx >= 0 && next[idx].role === "ai") {
          next[idx] = {
            ...next[idx],
            text: "죄송합니다, 잠시 오류가 발생했어요. 다시 시도해 주세요! 🙏",
          };
        }
        return next;
      });
    } finally {
      setIsStreaming(false);
      void aiMsgIndex; // suppress unused warning
      inputRef.current?.focus();
    }
  }, [input, isStreaming, messages, sessionId, slug]);

  // ── 에스컬레이션 요청 ────────────────────────────────────
  const handleEscalation = useCallback(async () => {
    setShowEscalation(false);
    setEscalationSent(true);

    // 사장님 알림 API 호출
    if (storeAgentId) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.text || "";
      const lastAiMsg = [...messages].reverse().find((m) => m.role === "ai")?.text || "";

      fetch("/api/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeAgentId,
          sessionId,
          customerMsg: lastUserMsg,
          aiResponse: lastAiMsg,
        }),
      }).catch(console.error);
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: "사장님이랑 직접 얘기하고 싶어요" },
      {
        role: "ai",
        text: `사장님께 알림을 보냈습니다! 📱\n\n잠시만 기다려 주시면 사장님이 직접 답변드릴 거예요.\n평균 응답 시간: 약 3분${storeInfo.phone ? `\n\n급하시면 📞 ${storeInfo.phone}` : ""}`,
      },
    ]);
  }, [storeAgentId, messages, sessionId, storeInfo.phone]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ── 매장 헤더 ─────────────────────────────────────── */}
      <div className={`bg-gradient-to-r ${storeInfo.gradient} text-white px-4 py-4 shrink-0`}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="text-4xl">{storeInfo.image}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold truncate">{storeInfo.name}</h1>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full shrink-0">
                {storeInfo.category}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-white/80 flex-wrap">
              {storeInfo.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="size-3 fill-yellow-300 text-yellow-300" />
                  {storeInfo.rating}
                  {storeInfo.reviewCount > 0 && ` (${storeInfo.reviewCount})`}
                </span>
              )}
              {storeInfo.address && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="size-3 shrink-0" />
                  {storeInfo.address.split(",")[0]}
                </span>
              )}
            </div>
          </div>
          {/* AI 뱃지 */}
          <div className="bg-white/20 rounded-full px-2 py-1 text-[10px] font-medium shrink-0 flex items-center gap-1">
            <Brain className="size-3" /> AI 응대
          </div>
        </div>
        {(storeInfo.hours || storeInfo.phone) && (
          <div className="max-w-lg mx-auto flex items-center gap-4 mt-2 text-xs text-white/70 flex-wrap">
            {storeInfo.hours && (
              <span className="flex items-center gap-1"><Clock className="size-3" />{storeInfo.hours.split("·")[0].trim()}</span>
            )}
            {storeInfo.phone && (
              <span className="flex items-center gap-1"><Phone className="size-3" />{storeInfo.phone}</span>
            )}
          </div>
        )}
      </div>

      {/* ── 채팅 영역 ─────────────────────────────────────── */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-3"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "ai" && (
              <div className={`size-8 rounded-full bg-gradient-to-br ${storeInfo.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                <Bot className="size-4 text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
              msg.role === "user"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-white text-gray-700 rounded-bl-sm border border-gray-100"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {msg.text}
                {/* 스트리밍 중 커서 */}
                {isStreaming && i === messages.length - 1 && msg.role === "ai" && (
                  <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </div>
            {msg.role === "user" && (
              <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <User className="size-4 text-gray-500" />
              </div>
            )}
          </motion.div>
        ))}

        {/* 스트리밍 로딩 (첫 청크 오기 전) */}
        <AnimatePresence>
          {isStreaming && messages[messages.length - 1]?.text === "" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <div className={`size-8 rounded-full bg-gradient-to-br ${storeInfo.gradient} flex items-center justify-center`}>
                <Brain className="size-4 text-white animate-pulse" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="size-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 에스컬레이션 버튼 */}
        <AnimatePresence>
          {showEscalation && !escalationSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
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

        {/* 에스컬레이션 완료 배너 */}
        <AnimatePresence>
          {escalationSent && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-2.5 text-xs"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              사장님께 알림을 보냈습니다. 잠시 기다려 주세요!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 빠른 질문 ─────────────────────────────────────── */}
      {storeInfo.quickQuestions.length > 0 && (
        <div className="px-4 pb-2 max-w-lg mx-auto w-full shrink-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {storeInfo.quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isStreaming}
                className="shrink-0 text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 입력창 ────────────────────────────────────────── */}
      <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100 max-w-lg mx-auto w-full shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); void handleSend(); }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder={isStreaming ? "응답 중..." : "궁금한 점을 물어보세요..."}
            className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="size-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 shrink-0 disabled:opacity-50 transition-colors"
          >
            {isStreaming ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1">
          <AlertCircle className="size-3" />
          AI가 학습된 데이터를 기반으로 답변합니다 · Powered by AI Trainer Hub
        </p>
      </div>
    </div>
  );
}
