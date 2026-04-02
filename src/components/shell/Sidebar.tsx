"use client";

import { useWorkspace } from "@/store/workspace";
import {
  Activity,
  Bot,
  TrendingUp,
  Zap,
  Brain,
  Eye,
  Mic,
  Globe,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

function HomeSidebar() {
  const agents = [
    { name: "브레인 에이전트", icon: Brain, status: "running", progress: 78 },
    { name: "인사이트 에이전트", icon: Eye, status: "running", progress: 92 },
    { name: "콘텐츠 에이전트", icon: Mic, status: "idle", progress: 100 },
    { name: "고객응대 에이전트", icon: Globe, status: "running", progress: 65 },
    { name: "성장 에이전트", icon: Sparkles, status: "idle", progress: 100 },
  ];

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">퍼포먼스</div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 rounded-lg p-2.5">
          <div className="text-lg font-bold text-emerald-400">42</div>
          <div className="text-[10px] text-gray-500">총 템플릿</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5">
          <div className="text-lg font-bold text-indigo-400">5</div>
          <div className="text-[10px] text-gray-500">활성 에이전트</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5">
          <div className="text-lg font-bold text-amber-400">89%</div>
          <div className="text-[10px] text-gray-500">가동률</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5">
          <div className="text-lg font-bold text-pink-400">2.1k</div>
          <div className="text-[10px] text-gray-500">오늘 처리</div>
        </div>
      </div>

      {/* Agent Status */}
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">에이전트 상태</div>
        <div className="space-y-2">
          {agents.map((a) => (
            <div key={a.name} className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
              <a.icon className="size-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-300 truncate">{a.name}</div>
                <Progress value={a.progress} className="h-1 mt-1 [&>div]:bg-indigo-500" />
              </div>
              <div className={`size-2 rounded-full shrink-0 ${
                a.status === "running" ? "bg-emerald-400 animate-pulse" : "bg-gray-600"
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">빠른 작업</div>
        <div className="space-y-1">
          {["새 학습 시작", "브리핑 생성", "리포트 내보내기"].map((action) => (
            <button
              key={action}
              className="w-full text-left text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded px-2 py-1.5 transition-colors"
            >
              <Zap className="size-3 inline mr-1.5" />
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateSidebar() {
  const categories = [
    "전체", "텍스트 학습", "이미지 학습", "이미지 생성", "영상/모션",
    "데이터 학습", "음성 학습", "음성 클로닝", "멀티모달", "AI 에이전트",
    "RAG", "파인튜닝", "Edge AI", "합성 데이터", "코드 생성", "행동 학습",
  ];
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">카테고리</div>
      <div className="space-y-0.5">
        {categories.map((c, i) => (
          <button
            key={c}
            className={`w-full text-left text-xs rounded px-2 py-1.5 transition-colors ${
              i === 0 ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function DefaultSidebar() {
  return (
    <div className="p-3 text-xs text-gray-500">
      <p>사이드바 콘텐츠</p>
    </div>
  );
}

export default function Sidebar() {
  const { activeView, sidebarCollapsed } = useWorkspace();

  if (sidebarCollapsed) return null;

  return (
    <div className="h-full bg-gray-900 border-r border-gray-800 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
      {activeView === "home" && <HomeSidebar />}
      {activeView === "templates" && <TemplateSidebar />}
      {activeView !== "home" && activeView !== "templates" && <HomeSidebar />}
    </div>
  );
}
