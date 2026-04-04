"use client";

import { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";

export default function WidgetPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { agentId },
    initialMessages: [
      { id: "initial-msg", role: "assistant", content: "안녕하세요! 매장에 대해 무엇이든 물어보세요." },
    ],
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-center p-4 bg-slate-900 border-b border-slate-800 shadow-xl z-10 shrink-0">
        <h1 className="text-[17px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          AI 매니저 실시간 상담
        </h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-slate-950 to-slate-900">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-3xl p-[14px] shadow-lg leading-relaxed text-[15px] ${
                m.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm"
                  : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-4 rounded-bl-sm flex space-x-2 items-center h-12 shadow-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0 shadow-[0_-15px_25px_-5px_rgba(0,0,0,0.2)] pb-safe mb-2">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto relative group">
          <input
            type="text"
            className="flex-1 rounded-full bg-slate-800 border border-slate-700 px-6 py-3.5 text-slate-100 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 shadow-inner"
            placeholder="궁금한 메뉴나 시간을 물어보세요..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-30 disabled:bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] ml-[2px]">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
