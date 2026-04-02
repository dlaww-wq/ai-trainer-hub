"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Bot,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Target,
  BarChart3,
  Brain,
  Eye,
  Mic,
  Globe,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const metrics = [
  { label: "활성 에이전트", value: "5/5", change: "+2", trend: "up", icon: Bot, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { label: "오늘 처리 작업", value: "2,147", change: "+23%", trend: "up", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "평균 품질 점수", value: "87.3", change: "+4.2", trend: "up", icon: Target, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "활성 사용자", value: "342", change: "+18%", trend: "up", icon: Users, color: "text-pink-400", bg: "bg-pink-500/10" },
];

const recentActivity = [
  { time: "09:19", agent: "고객응대", action: "리뷰 답글 자동 생성", result: "3건 완료", status: "success" },
  { time: "09:18", agent: "인사이트", action: "경쟁사 가격 변동 감지", result: "-15% 할인 시작", status: "warning" },
  { time: "09:17", agent: "품질감사", action: "트렌드샵 품질 점수 갱신", result: "30→42점", status: "info" },
  { time: "09:16", agent: "브레인", action: "주간 브리핑 생성", result: "인사이트 5건", status: "success" },
  { time: "09:15", agent: "콘텐츠", action: "인스타 포스팅 예약", result: "오후 2시 게시", status: "success" },
  { time: "09:12", agent: "고객응대", action: "고객 문의 자동 응답", result: "12건 처리", status: "success" },
  { time: "09:10", agent: "인사이트", action: "트렌드 리포트 생성", result: "3개 키워드 발견", status: "info" },
  { time: "09:05", agent: "브레인", action: "신규 학습 데이터 인덱싱", result: "47개 문서", status: "success" },
];

const learningPacks = [
  { name: "해피카페 고객응대", level: 2, score: 62, progress: 50, status: "학습 중" },
  { name: "트렌드샵 상품설명", level: 1, score: 30, progress: 25, status: "학습 중" },
  { name: "법률상담 AI", level: 4, score: 93, progress: 100, status: "완료" },
  { name: "피트니스 자세교정", level: 3, score: 78, progress: 75, status: "학습 중" },
];

export default function HomeView() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">퍼포먼스 대시보드</h1>
          <p className="text-xs text-gray-500 mt-0.5">실시간 에이전트 운영 현황 · {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full">
            <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[11px] text-emerald-400 font-medium">전체 시스템 정상</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${m.bg}`}>
                <m.icon className={`size-4 ${m.color}`} />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${
                m.trend === "up" ? "text-emerald-400" : "text-red-400"
              }`}>
                {m.trend === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {m.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{m.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Recent Activity - 2/3 */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-indigo-400" />
              <span className="text-sm font-semibold text-white">실시간 에이전트 활동</span>
            </div>
            <span className="text-[10px] text-gray-500">최근 30분</span>
          </div>
          <div className="divide-y divide-gray-800/50">
            {recentActivity.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/30 transition-colors"
              >
                <span className="text-[10px] text-gray-600 font-mono w-10 shrink-0">{a.time}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  a.status === "success" ? "bg-emerald-500/10 text-emerald-400" :
                  a.status === "warning" ? "bg-amber-500/10 text-amber-400" :
                  "bg-blue-500/10 text-blue-400"
                }`}>{a.agent}</span>
                <span className="text-xs text-gray-300 flex-1">{a.action}</span>
                <span className="text-[11px] text-gray-500">{a.result}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Learning Packs - 1/3 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">학습 팩 현황</span>
            </div>
          </div>
          <div className="p-3 space-y-3">
            {learningPacks.map((pack, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-200">{pack.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    pack.status === "완료" ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                  }`}>{pack.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={pack.progress} className="flex-1 h-1.5 [&>div]:bg-indigo-500" />
                  <span className="text-[10px] text-gray-500">Lv.{pack.level}</span>
                  <span className="text-[10px] font-bold text-gray-400">{pack.score}점</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
