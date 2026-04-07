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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/store/workspace";
import { CATALOG } from "@/lib/template-catalog";

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

/* ------------------------------------------------------------------ */
/*  업종별 데모 데이터 (3x2 = 6개, 서비스/기술/동작 혼합)                  */
/* ------------------------------------------------------------------ */
interface IndustryDemo {
  id: string;
  icon: React.ElementType;
  name: string;
  tag: string;
  color: string;
  bg: string;
  border: string;
  tier: "free" | "pro";
  inputs: string[];
  process: string[];
  chat: { q: string; a: string }[];
}

// 기업/공장 특화 템플릿 (최상단 노출)
const ENTERPRISE_INDUSTRIES: IndustryDemo[] = [
  {
    id: "cs-ai",
    icon: Building2,
    name: "기업 CS AI",
    tag: "기업/공장",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-300",
    tier: "free",
    inputs: [
      "제품 매뉴얼 & FAQ 데이터베이스",
      "이전 CS 상담 기록 500건+",
      "에스컬레이션 규칙 (담당자 연결 조건)",
      "SLA 기준 & 응대 정책 문서",
    ],
    process: [
      "제품 지식 전체 업로드",
      "CS 패턴 자동 분류 학습",
      "우선순위 자동 분류 설정",
      "멀티채널(이메일·채팅·전화) 연동",
    ],
    chat: [
      { q: "3호기 라인에서 이상음이 발생합니다", a: "이상음 유형을 알려주세요. 금속성 마찰음이면 베어링 점검, 진동음이면 체결 토크 확인이 필요합니다. 매뉴얼 7.3절 참고, 즉시 점검팀에 티켓 생성해드릴까요? 🔧" },
      { q: "AS 처리 기간이 얼마나 걸리나요?", a: "일반 부품 교체 2~3일, 해외 특주 부품은 7~14일입니다. 주문번호 알려주시면 현재 재고 즉시 확인해드립니다. 긴급 건은 우선처리 신청 가능합니다 ⚡" },
    ],
  },
  {
    id: "image-ai",
    icon: ScanSearch,
    name: "이미지 학습 AI",
    tag: "이미지학습",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-300",
    tier: "free",
    inputs: [
      "정상 제품 이미지 500장+ (다양한 각도)",
      "불량 유형별 이미지 (스크래치·변형·오염)",
      "라벨링 가이드 & 불량 기준서",
      "검사 환경 캘리브레이션 데이터",
    ],
    process: [
      "이미지 전처리 & 증강",
      "불량 유형 자동 라벨링",
      "CNN/ViT 분류 모델 학습",
      "실시간 카메라 검사 라인 배포",
    ],
    chat: [
      { q: "스크래치 불량률이 올라가고 있습니다", a: "최근 24시간 스크래치 불량 12.3% 감지. 3호기 조명각도 변경 후 증가 패턴 확인됩니다. 조명 재캘리브레이션 권장, 불량 이미지 샘플 추가 학습 진행할까요? 📊" },
      { q: "새로운 불량 패턴이 발견됐어요", a: "신규 불량 유형 등록 시작합니다. 이미지 20장 이상 업로드해주시면 즉시 모델에 추가 학습합니다. 보통 30분 이내 배포 완료됩니다 🔬" },
    ],
  },
  {
    id: "physical-ai",
    icon: Cpu,
    name: "피지컬 학습 AI",
    tag: "제조/IoT",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    tier: "free",
    inputs: [
      "센서 데이터 (온도·압력·진동·전류)",
      "정상 공정 파라미터 로그 (6개월+)",
      "설비 고장 이력 & 원인 분석 기록",
      "공정 레시피 & 설비 사양서",
    ],
    process: [
      "시계열 센서 데이터 수집",
      "이상 패턴 라벨링 & 피처 추출",
      "예측 정비 모델 학습 (LSTM)",
      "실시간 경보 & 예방 정비 스케줄 배포",
    ],
    chat: [
      { q: "2호기 진동값이 평소보다 높습니다", a: "진동 RMS 4.2mm/s → 경고 임계값 초과. 베어링 마모 확률 87% 예측. 다음 주 교체 권장, 지금 예방정비 일정 잡으면 긴급 고장 리스크 94% 감소합니다 ⚡" },
      { q: "이번 달 에너지 소비가 급등했어요", a: "3호기 압축기 효율 저하 감지됩니다. 냉각수 온도 +8°C 상승과 상관관계 확인. 냉각탑 청소 & 냉매 충전 권장. 예상 절감액 월 120만원 🌿" },
    ],
  },
];

const INDUSTRIES: IndustryDemo[] = [
  // 서비스직
  {
    id: "cafe",
    icon: Coffee,
    name: "카페 고객응대 AI",
    tag: "서비스",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    tier: "free",
    inputs: [
      "메뉴판 전체 (가격·재료·알레르기)",
      "영업시간 · 위치 · 주차 · 와이파이",
      "사장님 말투 예시 10문장",
      "리뷰 답글 가이드 (별점별)",
    ],
    process: [
      "역할 설정: 카페 AI 직원",
      "지식 업로드: 메뉴 + FAQ",
      "톤 학습: 사장님 말투 반영",
      "테스트 → 피드백 → 재학습",
    ],
    chat: [
      { q: "메뉴 추천해주세요", a: "시그니처 라떼 추천드려요! ☕ 매일 아침 로스팅한 콜롬비아 원두에 수제 바닐라시럽이 들어가요. 달달한 거 좋으시면 바닐라라떼도 추천! 라떼+마들렌 세트 8,500원이면 가성비 최고예요 🧁" },
      { q: "주차 가능한가요?", a: "네! 건물 뒤 3대 가능, 1시간 무료예요. 주말엔 연남동 공영주차장(도보 3분)도 추천드려요 🚗" },
    ],
  },
  // 기술직
  {
    id: "car",
    icon: Wrench,
    name: "자동차 정비 상담 AI",
    tag: "기술",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    tier: "free",
    inputs: [
      "정비 항목별 가격표 (엔진오일·브레이크·타이어)",
      "차종별 정비 매뉴얼 요약",
      "증상→원인 진단 가이드 50건",
      "예약 시스템 연동 정보",
    ],
    process: [
      "역할 설정: 정비소 상담 AI",
      "지식 업로드: 가격표 + 진단 가이드",
      "증상→원인 매칭 패턴 학습",
      "견적 자동 산출 로직 설정",
    ],
    chat: [
      { q: "엔진오일 교환 얼마예요?", a: "차종이 어떻게 되세요? 일반 합성유 7~9만원, 풀합성유 12~15만원이에요. 주행 1만km마다 추천! 지금 예약하시면 에어컨 필터 무료 점검 해드립니다 🔧" },
      { q: "브레이크에서 소리가 나요", a: "끼익 소리면 패드 마모 가능성이 높아요. 방치하면 디스크까지 손상될 수 있어서 빨리 점검 추천드려요. 패드 교환 5~8만원, 내일 오전 예약 가능합니다!" },
    ],
  },
  // 쇼핑몰
  {
    id: "shopping",
    icon: ShoppingBag,
    name: "쇼핑몰 CS 자동화 AI",
    tag: "서비스",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    tier: "free",
    inputs: [
      "환불·교환·배송 정책 문서",
      "상품 카탈로그 (사이즈·소재·가격)",
      "기존 CS 상담 기록 100건+",
      "에스컬레이션 기준 (담당자 연결 조건)",
    ],
    process: [
      "정책 문서 → 규칙 추출",
      "CS 기록 → FAQ 패턴 학습",
      "사이즈 추천 로직 설정",
      "자동 답변 + 담당자 연결 분기",
    ],
    chat: [
      { q: "환불 가능한가요?", a: "주문번호 알려주시면 바로 확인해드릴게요! 미개봉+7일 이내 전액 환불, 개봉 후엔 교환 가능해요. 불량이면 30일 이내 무료 반품이에요 📦" },
      { q: "M이랑 L 차이가요?", a: "오버핏이라 M도 넉넉해요! 키 175+ 이시면 L, 170 이하시면 M 추천. 평소 사이즈 알려주시면 더 정확히 안내드릴게요 👕" },
    ],
  },
  // 동작 분석
  {
    id: "fitness",
    icon: Dumbbell,
    name: "운동 자세 교정 AI",
    tag: "동작분석",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    tier: "pro",
    inputs: [
      "올바른 자세 영상 (운동별 20개+)",
      "잘못된 자세 예시 (운동별 10개+)",
      "관절 각도 기준표 (정상/위험 범위)",
      "교정 멘트 가이드 (자세별 피드백)",
    ],
    process: [
      "영상 → 관절 포인트 자동 추출",
      "정상/위험 각도 라벨링",
      "분류 모델 학습 (정상 vs 위험)",
      "실시간 웹캠 → 자세 피드백",
    ],
    chat: [
      { q: "스쿼트 자세 봐주세요", a: "무릎이 발끝보다 앞으로 나갔어요! 각도 75도 → 위험 구간. 엉덩이를 뒤로 더 빼고 무릎 각도 90도 이상 유지해주세요. 코어에 힘주는 것도 잊지 마세요 💪" },
      { q: "데드리프트 허리가 아파요", a: "허리가 둥글어지고 있을 가능성이 높아요. 가슴을 펴고 허리 중립 유지! 무게를 줄이고 폼부터 교정하는 게 안전해요. 영상 보내주시면 정확히 분석해드릴게요 🎯" },
    ],
  },
  // 의료
  {
    id: "medical",
    icon: Stethoscope,
    name: "병원 예약·안내 AI",
    tag: "서비스",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tier: "pro",
    inputs: [
      "진료과목·의료진 소개·전문 분야",
      "예약 가능 시간대 (실시간 연동)",
      "진료 전 준비사항·주의사항",
      "자주 묻는 질문 100건 + 의료 규정",
    ],
    process: [
      "의료 규정 학습 (진단·처방 금지)",
      "예약 시스템 API 연동",
      "증상→진료과 매칭 로직",
      "안전 답변 규칙 + 에스컬레이션",
    ],
    chat: [
      { q: "피부과 예약하고 싶어요", a: "어떤 시술이 궁금하세요? 여드름/기미/리프팅 등 분야별 전문의가 계세요. 초진은 상담 포함 30분, 이번 주 수목 오후 가능합니다. 원하시는 시간 알려주세요!" },
      { q: "두통이 계속돼요", a: "두통 증상이 지속되시면 신경과 진료를 추천드려요. 다만 정확한 진단은 의사 선생님이 직접 해주셔야 해요. 내일 오전 예약 도와드릴까요?" },
    ],
  },
  // 이미지 생성
  {
    id: "studio",
    icon: Camera,
    name: "AI 상품 사진 생성",
    tag: "이미지생성",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    tier: "pro",
    inputs: [
      "상품 사진 20장+ (다양한 각도·조명)",
      "원하는 스타일 참조 이미지 5장",
      "프롬프트: 'clean product shot, soft shadow'",
      "부정 프롬프트: 'blurry, distorted'",
    ],
    process: [
      "상품 사진 → LoRA 모델 학습 (20분)",
      "스타일 참조 → 톤·분위기 추출",
      "프롬프트 입력 → 이미지 생성",
      "시즌별 컨셉 무한 변경 가능",
    ],
    chat: [
      { q: "크리스마스 컨셉으로", a: "생성 완료! 빨간 리본 + 눈 배경 + 따뜻한 조명으로 상품 이미지 20장 만들었어요. 마음에 드는 것 골라주시면 고해상도로 내보내드릴게요 🎄" },
      { q: "카페 배경으로 바꿔줘", a: "원목 테이블 + 라떼아트 + 자연광 배경으로 변경했어요! 3가지 앵글(정면/45도/탑뷰) 중 선택하실 수 있어요 ☕📸" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  업종 카드 — 좌 50% 학습정보 / 우 50% 결과 미리보기                     */
/* ------------------------------------------------------------------ */
function IndustryCard({ demo, index }: { demo: IndustryDemo; index: number }) {
  const [chatIdx, setChatIdx] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-xl border ${demo.border} overflow-hidden hover:shadow-lg transition-all`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${demo.bg}`}>
        <div className="flex items-center gap-2">
          <demo.icon className={`size-5 ${demo.color}`} />
          <span className="text-sm font-bold text-gray-800">{demo.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] bg-white/80 text-gray-500">{demo.tag}</Badge>
          <Badge
            variant="secondary"
            className={`text-[10px] ${demo.tier === "free" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
          >
            {demo.tier === "free" ? "무료" : "프로"}
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
              {demo.inputs.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                  <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                  <span className="leading-snug">{item}</span>
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
              {demo.process.map((step, i) => (
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
            <div className="flex justify-end">
              <div className="bg-indigo-600 text-white rounded-2xl rounded-br-sm px-3 py-1.5 max-w-[90%]">
                <p className="text-[11px]">{demo.chat[chatIdx].q}</p>
              </div>
            </div>

            {/* Answer */}
            <div className="flex gap-1.5">
              <div className={`size-6 rounded-full ${demo.bg} flex items-center justify-center shrink-0`}>
                <Bot className={`size-3 ${demo.color}`} />
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[90%]">
                <p className="text-[11px] text-gray-700 leading-relaxed">{demo.chat[chatIdx].a}</p>
              </div>
            </div>
          </div>

          {/* Chat toggle + CTA */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            <div className="flex gap-1">
              {demo.chat.map((_, i) => (
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
              onClick={() => { window.location.href = `/learn?template=text-cs-${demo.id}`; }}
              className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              학습 시작 <ChevronRight className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  메인                                                               */
/* ------------------------------------------------------------------ */
export default function HomeView() {
  const { sidebarCollapsed, toggleSidebar } = useWorkspace();
  const router = useRouter();

  // 첫 3개 템플릿 추출 (카탈로그 첫 번째 카테고리의 첫 번째 서브카테고리 템플릿들)
  const featuredTemplates = CATALOG.slice(0, 3).map((cat) => {
    const firstSub = cat.subcategories[0];
    const firstTpl = firstSub?.templates[0];
    const CatIcon = CAT_ICONS[cat.id] || FileText;
    return { cat, sub: firstSub, tpl: firstTpl, CatIcon };
  }).filter((x) => x.tpl);

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
              <h1 className="text-lg md:text-xl font-bold text-gray-900">AI가 고객을 응대합니다</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5 hidden sm:block">
                업종별 학습 데이터 → 학습 과정 → AI 응답 결과를 바로 확인하세요.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] md:text-xs">무료 3개</Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-500 text-[10px] md:text-xs">전체 9개 업종</Badge>
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
          {ENTERPRISE_INDUSTRIES.map((demo, i) => (
            <IndustryCard key={demo.id} demo={demo} index={i} />
          ))}
        </div>
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
          {INDUSTRIES.map((demo, i) => (
            <IndustryCard key={demo.id} demo={demo} index={i} />
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
          {featuredTemplates.map(({ cat, tpl, CatIcon }) => (
            <div
              key={tpl!.id}
              className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => router.push(`/learn?template=${tpl!.id}`)}
            >
              {/* 헤더 */}
              <div className={`flex items-center justify-between px-4 py-2.5 bg-gradient-to-r ${cat.gradient} text-white`}>
                <div className="flex items-center gap-2 min-w-0">
                  <CatIcon className="size-4 shrink-0" />
                  <span className="text-sm font-bold truncate">{tpl!.name}</span>
                </div>
                <Badge className="bg-white/20 text-white border-0 text-[9px] shrink-0 ml-2">
                  {tpl!.tier === "free" ? "무료" : tpl!.tier === "starter" ? "스타터" : "프로"}
                </Badge>
              </div>
              {/* 바디 */}
              <div className="flex flex-col sm:flex-row sm:divide-x divide-gray-100">
                <div className="w-full sm:w-1/2 p-3 space-y-2 border-b border-gray-100 sm:border-b-0">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Database className="size-3 text-blue-500" />
                      <span className="text-[10px] font-bold text-blue-600">학습 데이터</span>
                    </div>
                    <ul className="space-y-0.5">
                      {tpl!.dataRequirements.slice(0, 3).map((r, i) => (
                        <li key={i} className="flex items-start gap-1 text-[10px] text-gray-500">
                          <span className={r.required ? "text-red-400" : "text-gray-300"}>•</span>
                          <span className="leading-snug line-clamp-1">{r.item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <MessageSquare className="size-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600">학습 후</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-snug line-clamp-3">{tpl!.beforeAfter.after}</p>
                </div>
              </div>
            </div>
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
