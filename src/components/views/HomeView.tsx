"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Coffee,
  ShoppingBag,
  Stethoscope,
  Wrench,
  Dumbbell,
  Camera,
  ArrowRight,
  Bot,
  Database,
  Sparkles,
  MessageSquare,
  ChevronRight,
  PanelLeft,
  PanelLeftClose,
  Building2,
  ScanSearch,
  Cpu,
  Factory,
  Layers,
  FileText,
  Image,
  BarChart3,
  Mic,
  Palette,
  Video,
  AudioLines,
  Combine,
  Workflow,
  Code,
  Smartphone,
  FlaskConical,
  UploadCloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Assuming Avatar components are available
import { Button } from "@/components/ui/button"; // Assuming Button components are available
import { useWorkspace } from "@/store/workspace";
import { CATALOG, LearnTemplate, TopCategory, SubCategory } from "@/lib/template-catalog";


const CAT_ICONS: Record<string, React.ElementType> = {
  "text-learning": FileText,
  "image-learning": Image,
  "data-learning": BarChart3,
  "audio-learning": Mic,
  "action-learning": Cpu,
  "image-gen-learning": Palette,
  "video-learning": Video,
  "voice-clone-learning": AudioLines,
  "multimodal-learning": Combine,
  "agent-learning": Workflow,
  "rag-learning": Database,
  "finetune-learning": Wrench,
  "edge-learning": Smartphone,
  "synthetic-learning": FlaskConical,
  "code-learning": Code,
};

// Define the new props for IndustryCard
interface IndustryCardProps {
  template: LearnTemplate;
  index: number; // For animation delay
  // Styling props derived from TopCategory or SubCategory
  cardIcon: React.ElementType;
  cardColor: string;
  cardBorder: string;
  cardBg: string;
  cardBadgeText: string; // for the tag, e.g., "서비스", "기술"
}

// Refactored IndustryCard component
function IndustryCard({ template, index, cardIcon: Icon, cardColor, cardBorder, cardBg, cardBadgeText }: IndustryCardProps) {
  const router = useRouter();
  const [chatIdx, setChatIdx] = useState(0);

  // Derive whatYouLearnItems from template.description (LearnTemplate has a single description string)
  const whatYouLearnItems = template.description ? [template.description] : [];

  const inputsFormatted = template.dataRequirements.slice(0, 3).map(dr => ({
    label: dr.item,
    description: dr.description,
  }));

  const processFormatted = template.guide.slice(0, 3);

  // Derive chat examples from template.beforeAfter
  const chatExamples = template.beforeAfter
    ? [{ q: template.beforeAfter.before, a: template.beforeAfter.after }]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-xl border ${cardBorder} overflow-hidden hover:shadow-lg transition-all`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${cardBg}`}>
        <div className="flex items-center gap-2">
          <Icon className={`size-5 ${cardColor}`} />
          <span className="text-sm font-bold text-gray-800">{template.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] bg-white/80 text-gray-500">{cardBadgeText}</Badge>
          <Badge
            variant="secondary"
            className={`text-[10px] ${template.tier === "free" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
          >
            {template.tier === "free" ? "무료" : "프로"}
          </Badge>
        </div>
      </div>

      {/* Body: Left 50% + Right 50% — 모바일에서는 세로 스택 */}
      <div className="flex flex-col md:flex-row md:divide-x divide-gray-100">
        {/* LEFT: 학습 데이터 + 학습 과정 */}
        <div className="w-full md:w-1/2 p-4 space-y-3 border-b border-gray-100 md:border-b-0">
          {/* 학습 데이터 */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Database className="size-3.5 text-blue-500" />
              <span className="text-[11px] font-bold text-blue-600">학습 데이터</span>
            </div>
            <ul className="space-y-1">
              {inputsFormatted.map((input, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                  <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                  <span className="leading-snug">{input.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 학습 과정 */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="size-3.5 text-amber-500" />
              <span className="text-[11px] font-bold text-amber-600">학습 과정</span>
            </div>
            <ol className="space-y-1">
              {processFormatted.map((step, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                  <span className="text-amber-400 font-bold mt-0.5 shrink-0 text-[10px]">{i + 1}</span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* RIGHT: 결과 미리보기 (채팅) */}
        <div className="w-full md:w-1/2 p-4 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <MessageSquare className="size-3.5 text-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-600">결과 미리보기</span>
          </div>

          <div className="flex-1 space-y-2">
            {/* Question */}
            {chatExamples.length > 0 && (
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-br-sm px-3 py-1.5 max-w-[90%]">
                    <p className="text-[11px]">{chatExamples[chatIdx].q}</p>
                  </div>
                </div>
            )}

            {/* Answer */}
            {chatExamples.length > 0 && (
                <div className="flex gap-1.5">
                  <div className={`size-6 rounded-full ${cardBg} flex items-center justify-center shrink-0`}>
                    <Bot className={`size-3 ${cardColor}`} />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[90%]">
                    <p className="text-[11px] text-gray-700 leading-relaxed">{chatExamples[chatIdx].a}</p>
                  </div>
                </div>
            )}
          </div>

          {/* Chat toggle + CTA */}
          {chatExamples.length > 0 && (
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                <div className="flex gap-1">
                  {chatExamples.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setChatIdx(i)}
                      className={`size-5 rounded text-[9px] font-bold transition-colors ${
                        chatIdx === i ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { window.location.href = `/learn?template=${template.id}`; }}
                  className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  학습 시작 <ChevronRight className="size-3" />
                </button>
              </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ProcessedTemplateForCard {
  template: LearnTemplate;
  index: number; // For animation delay
  cardIcon: React.ElementType;
  cardColor: string;
  cardBorder: string;
  cardBg: string;
  cardBadgeText: string;
}

function getProcessedTemplatesForSection(
  catalog: typeof CATALOG,
  filterFn: (topCat: TopCategory, subCat: SubCategory, tpl: LearnTemplate) => boolean
): ProcessedTemplateForCard[] {
  const processed: ProcessedTemplateForCard[] = [];
  let index = 0;
  for (const topCat of catalog) {
    const CatIcon = CAT_ICONS[topCat.id] || FileText; // Get icon once per top category
    // Extract base color from topCat.color for border and background
    const baseColor = topCat.color.split('-')[1]; // e.g., "blue" from "text-blue-600"

    for (const subCat of topCat.subcategories) {
      for (const tpl of subCat.templates) {
        if (filterFn(topCat, subCat, tpl)) {
          processed.push({
            template: tpl,
            index: index++,
            cardIcon: CatIcon,
            cardColor: topCat.color,
            cardBorder: `border-${baseColor}-300`,
            cardBg: `bg-${baseColor}-50`,
            cardBadgeText: subCat.industry, // Or subCat.name if industry is too broad for these cards
          });
        }
      }
    }
  }
  return processed;
}


/* ------------------------------------------------------------------ */
/*  메인                                                               */
/* ------------------------------------------------------------------ */
export default function HomeView() {
  const { sidebarCollapsed, toggleSidebar } = useWorkspace();
  const router = useRouter();

  // 1. 기업·공장 특화 AI (Enterprise/Pro Tier)
  const enterpriseTemplates = getProcessedTemplatesForSection(CATALOG, (topCat, subCat, tpl) =>
    tpl.tier === "pro" && ["image-learning", "data-learning", "action-learning"].includes(topCat.id)
  );

  // 2. AI 대화 챗봇 (Text Learning, CS subcategory)
  const chatbotDemos = getProcessedTemplatesForSection(CATALOG, (topCat, subCat, tpl) =>
    topCat.id === "text-learning" && subCat.id === "text-cs"
  );

  // 3. 추천 학습 템플릿 (Featured: first templates from first three top categories)
  const featuredTemplates = CATALOG.slice(0, 3).map((topCat, i) => {
    const subCat = topCat.subcategories[0];
    const tpl = subCat?.templates[0];
    if (!tpl) return null;
    const baseColor = topCat.color.split('-')[1];

    return {
      template: tpl,
      index: i,
      cardIcon: CAT_ICONS[topCat.id] || FileText,
      cardColor: topCat.color,
      cardBorder: `border-${baseColor}-300`,
      cardBg: `bg-${baseColor}-50`,
      cardBadgeText: subCat.industry,
    };
  }).filter(Boolean) as ProcessedTemplateForCard[]; // Filter out nulls and assert type

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "thin" }}>

      {/* ── 헤더 ── */}
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            {/* 성과 패널 토글 — 데스크탑만 */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors text-xs font-medium"
              title={sidebarCollapsed ? "학습 성과 패널 열기" : "학습 성과 패널 닫기"}
            >
              {sidebarCollapsed ? <PanelLeft className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
              {sidebarCollapsed ? "성과 패널" : "패널 닫기"}
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">어떤 데이터든 AI로 학습시켜, 당신의 비즈니스에 도입하세요.</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5 hidden sm:block">
                네이버 플레이스부터 기업 현장까지, 업종별 최적화된 AI 학습 효과를 지금 바로 경험하고, 비용 절감 및 고객 만족도를 높여보세요.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] md:text-xs">무료 {CATALOG.filter(c => c.freeFeature).length}개</Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-500 text-[10px] md:text-xs">전체 {CATALOG.length}개 업종</Badge>
          </div>
        </div>
      </div>

      {/* ── 기업·공장 특화 AI ── */}
      <div className="px-4 md:px-6 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <Factory className="size-4 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-800">기업·공장 특화 AI</h2>
          <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">기술 특화</Badge>
          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] hidden sm:inline-flex">전체 무료</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enterpriseTemplates.map((props) => (
            <IndustryCard key={props.template.id} {...props} />
          ))}
        </div>
      </div>

      {/* ── AI 대화 챗봇 소개 ── */}
      <div className="px-4 md:px-6 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="size-4 text-emerald-500" />
          <h2 className="text-sm font-bold text-gray-800">AI 대화 챗봇: 하나의 AI로 다양한 비즈니스에 적용</h2>
        </div>
        <p className="text-xs md:text-sm text-gray-500 mt-1 mb-3">
          어떤 업종이든 고객 응대는 필수입니다. 저희 플랫폼의 AI 대화 챗봇 템플릿은 귀사의 고유한 데이터를 학습하여,
          카페 메뉴 추천부터 쇼핑몰 CS, 병원 예약 안내까지 맞춤형으로 진화합니다.
          아래 데모 사례들을 통해 하나의 AI가 얼마나 유연하게 활용될 수 있는지 확인해보세요.
        </p>
      </div>

      {/* ── 업종별 AI 데모 ── */}
      <div className="px-4 md:px-6 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-gray-800">업종별 AI 데모</h2>
          <Badge variant="secondary" className="text-[10px]">서비스·기술·동작</Badge>
        </div>
      </div>
      <div className="px-4 md:px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chatbotDemos.map((props) => (
            <IndustryCard key={props.template.id} {...props} />
          ))}
        </div>
      </div>

      {/* ── 추천 학습 템플릿 ── */}
      <div className="px-4 md:px-6 pb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-gray-800">추천 학습 템플릿</h2>
            <Badge className="bg-indigo-100 text-indigo-700 border-0 text-[10px] hidden sm:inline-flex">바로 시작 가능</Badge>
          </div>
          <button
            onClick={() => router.push("/templates")}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            전체 보기 <ChevronRight className="size-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTemplates.map((props) => (
            <IndustryCard key={props.template.id} {...props} />
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-4 md:px-6 pb-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">네이버 플레이스에 AI 상담을 연결하세요</h3>
            <p className="text-xs text-gray-500 mt-1">홈페이지 URL만 등록하면, 고객이 방문할 때 학습된 AI가 자동 응대합니다.</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shrink-0 w-full sm:w-auto">
            무료로 시작하기 <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
