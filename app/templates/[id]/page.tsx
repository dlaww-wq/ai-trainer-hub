"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const template = TEMPLATES.find((t) => t.id === id);

  const [knowledge, setKnowledge] = useState<Record<string, string>>({});
  const [agentName, setAgentName] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [trained, setTrained] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);

  if (!template) return <div className="text-white p-8">템플릿을 찾을 수 없습니다.</div>;

  async function handleTrain() {
    setIsTraining(true);
    try {
      const res = await fetch("/api/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template!.id,
          name: agentName || `${template!.titleKo} 에이전트`,
          knowledge,
        }),
      });
      const data = await res.json();
      if (data.agent) {
        setAgentId(data.agent.id);
        setTrained(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTraining(false);
    }
  }

  if (trained && agentId) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">에이전트 학습 완료!</h2>
          <p className="text-gray-400 mb-8">이제 고객 응대를 시작할 수 있습니다.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push(`/chat/${agentId}`)}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              채팅 테스트
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              대시보드
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-4xl">{template.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{template.titleKo}</h1>
              {template.isPro && (
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/30">PRO</span>
              )}
            </div>
            <p className="text-gray-400">{template.description}</p>
          </div>
        </div>

        {/* Capabilities */}
        <div className="bg-gray-900 rounded-xl p-4 mb-8 border border-gray-800">
          <p className="text-sm text-gray-400 mb-2">포함된 기능</p>
          <div className="flex flex-wrap gap-2">
            {template.capabilities.map((cap) => (
              <span key={cap} className="bg-blue-500/10 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/20">
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Training Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">에이전트 이름</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder={`예: 우리 카페 CS 봇`}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {template.knowledgeFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-2">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={knowledge[field.key] || ""}
                  onChange={(e) => setKnowledge((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={knowledge[field.key] || ""}
                  onChange={(e) => setKnowledge((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          ))}

          <button
            onClick={handleTrain}
            disabled={isTraining}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed py-4 rounded-lg font-medium transition-colors text-lg"
          >
            {isTraining ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> 학습 중...
              </span>
            ) : (
              "AI 학습 시작 →"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
