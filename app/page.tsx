import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export default function Home() {
  const freeTemplates = TEMPLATES.filter((t) => !t.isPro);
  const proTemplates = TEMPLATES.filter((t) => t.isPro);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1 text-blue-400 text-sm mb-6">
          AI Trainer Hub — 산업별 AI 에이전트 플랫폼
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          내 비즈니스에 맞는<br />
          <span className="text-blue-400">AI 에이전트</span>를 5분 안에
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          6개 산업 템플릿 · 평균 정확도 88% · 지식 업로드 즉시 배포
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/templates"
            className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            템플릿 시작하기
          </Link>
          <Link
            href="/dashboard"
            className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            대시보드
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "87%", label: "평균 정확도" },
            { value: "6개", label: "산업 템플릿" },
            { value: "5분", label: "평균 배포 시간" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Templates */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">무료 템플릿</h2>
        <p className="text-gray-400 mb-8">바로 시작할 수 있는 3개 템플릿</p>
        <div className="grid md:grid-cols-3 gap-6">
          {freeTemplates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>

      {/* Pro Templates */}
      <section className="px-6 py-8 pb-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">PRO 템플릿</h2>
        <p className="text-gray-400 mb-8">고급 AI 기능이 포함된 전문 템플릿</p>
        <div className="grid md:grid-cols-3 gap-6">
          {proTemplates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>
    </main>
  );
}

function TemplateCard({ template }: { template: (typeof TEMPLATES)[0] }) {
  return (
    <Link href={`/templates/${template.id}`}>
      <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{template.icon}</span>
          {template.isPro && (
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/30">
              PRO
            </span>
          )}
        </div>
        <h3 className="font-semibold mb-1">{template.titleKo}</h3>
        <p className="text-gray-400 text-sm mb-4">{template.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {template.useCases.slice(0, 2).map((u) => (
              <span key={u} className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">
                {u}
              </span>
            ))}
          </div>
          <span className="text-green-400 text-sm font-medium">{template.accuracy}%</span>
        </div>
      </div>
    </Link>
  );
}
