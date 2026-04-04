"use client";
import { useState } from "react";
import Link from "next/link";
import { TEMPLATES, type TemplateCategory } from "@/lib/templates";

const CATEGORIES: { id: TemplateCategory | "all"; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "customer-service", label: "고객서비스" },
  { id: "consultation", label: "상담" },
  { id: "booking", label: "예약" },
  { id: "vision", label: "비전 AI" },
  { id: "generation", label: "생성 AI" },
];

export default function TemplatesPage() {
  const [filter, setFilter] = useState<TemplateCategory | "all">("all");

  const filtered =
    filter === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">AI 에이전트 템플릿</h1>
        <p className="text-gray-400 mb-8">
          산업별로 최적화된 템플릿을 선택하고 지식을 업로드하면 즉시 배포됩니다.
        </p>

        {/* Category Filter */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === c.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <Link key={t.id} href={`/templates/${t.id}`}>
              <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-6 h-full transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{t.icon}</span>
                  {t.isPro ? (
                    <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/30">
                      PRO
                    </span>
                  ) : (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                      무료
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{t.titleKo}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{t.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">정확도</span>
                    <span className="text-green-400 font-medium">{t.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-green-400 h-1.5 rounded-full"
                      style={{ width: `${t.accuracy}%` }}
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap pt-1">
                    {t.capabilities.slice(0, 2).map((cap) => (
                      <span key={cap} className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded border border-blue-500/20">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
