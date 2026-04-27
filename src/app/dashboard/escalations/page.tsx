"use client";

/**
 * 사장님 대시보드 — 미답변 질문 관리
 * /dashboard/escalations
 */

import { useState, useEffect } from "react";

interface Escalation {
  id: string;
  customerMsg: string;
  aiResponse: string;
  status: string;
  ownerAnswer: string;
  savedToKb: boolean;
  createdAt: string;
  storeAgent: { businessName: string };
}

export default function EscalationsPage() {
  const [items, setItems] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/escalate")
      .then((r) => r.json())
      .then((d) => { setItems(d.escalations ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function submit(id: string) {
    const answer = answers[id]?.trim();
    if (!answer) return;

    setSaving((s) => ({ ...s, [id]: true }));
    const res = await fetch("/api/escalate/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, answer }),
    });

    if (res.ok) {
      setItems((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: "resolved", ownerAnswer: answer, savedToKb: true } : e
        )
      );
    }
    setSaving((s) => ({ ...s, [id]: false }));
  }

  const pending = items.filter((e) => e.status !== "resolved");
  const resolved = items.filter((e) => e.status === "resolved");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">미답변 질문 관리</h1>
      <p className="text-sm text-gray-500 mb-6">
        고객이 챗봇에 물었지만 답변 못한 질문들입니다. 답변 등록 시 즉시 챗봇이 학습합니다.
      </p>

      {loading && <p className="text-gray-400">불러오는 중...</p>}

      {/* 미처리 */}
      {pending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-orange-600">⏳ 답변 필요</span>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">{pending.length}</span>
          </div>
          <div className="space-y-4">
            {pending.map((e) => (
              <div key={e.id} className="border border-orange-200 rounded-xl p-4 bg-orange-50">
                <div className="text-xs text-gray-400 mb-2">
                  {e.storeAgent?.businessName} · {new Date(e.createdAt).toLocaleDateString("ko-KR")}
                </div>
                <div className="font-medium text-gray-900 mb-1">❓ {e.customerMsg}</div>
                <div className="text-sm text-gray-500 mb-3 italic">
                  챗봇: "{e.aiResponse?.slice(0, 80)}..."
                </div>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  rows={3}
                  placeholder="정확한 답변을 입력해주세요..."
                  value={answers[e.id] ?? ""}
                  onChange={(ev) => setAnswers((a) => ({ ...a, [e.id]: ev.target.value }))}
                />
                <button
                  onClick={() => submit(e.id)}
                  disabled={saving[e.id] || !answers[e.id]?.trim()}
                  className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-sm font-semibold py-2 rounded-lg transition"
                >
                  {saving[e.id] ? "저장 중..." : "💾 챗봇에 학습시키기"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 처리 완료 */}
      {resolved.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-green-600">✅ 처리 완료</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">{resolved.length}</span>
          </div>
          <div className="space-y-3">
            {resolved.map((e) => (
              <div key={e.id} className="border border-green-200 rounded-xl p-4 bg-green-50">
                <div className="text-xs text-gray-400 mb-1">{e.storeAgent?.businessName}</div>
                <div className="text-sm font-medium text-gray-700">Q: {e.customerMsg}</div>
                <div className="text-sm text-green-700 mt-1">A: {e.ownerAnswer}</div>
                <div className="text-xs text-green-500 mt-1">✓ 챗봇 KB 저장 완료</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🎉</div>
          <p className="font-medium">미답변 질문이 없습니다!</p>
          <p className="text-sm mt-1">챗봇이 모든 질문에 잘 답변하고 있어요.</p>
        </div>
      )}
    </div>
  );
}
