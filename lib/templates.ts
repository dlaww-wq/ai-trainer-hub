export type TemplateCategory =
  | "customer-service"
  | "consultation"
  | "booking"
  | "vision"
  | "generation";

export interface Template {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  isPro: boolean;
  accuracy: number;
  useCases: string[];
  systemPromptBase: string;
  knowledgeFields: KnowledgeField[];
  capabilities: string[];
}

export interface KnowledgeField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "file";
}

export const TEMPLATES: Template[] = [
  {
    id: "cafe-cs",
    title: "Café Customer Service",
    titleKo: "카페 고객서비스",
    description: "메뉴 추천, 영업시간, 주차 안내를 자동으로 응대합니다.",
    category: "customer-service",
    icon: "☕",
    isPro: false,
    accuracy: 91,
    useCases: ["메뉴 추천", "영업시간 안내", "주차 안내", "예약 응대"],
    systemPromptBase: `당신은 {businessName}의 친절한 카페 직원입니다.
메뉴: {menu}
영업시간: {hours}
위치/주차: {location}
항상 밝고 친근하게 응대하며, 메뉴 추천 시 고객의 취향을 먼저 파악하세요.`,
    knowledgeFields: [
      { key: "businessName", label: "카페 이름", placeholder: "예: 블루밍 카페", type: "text" },
      { key: "menu", label: "메뉴 목록", placeholder: "아메리카노 4,500원\n카페라떼 5,000원...", type: "textarea" },
      { key: "hours", label: "영업시간", placeholder: "평일 08:00-22:00, 주말 09:00-21:00", type: "text" },
      { key: "location", label: "위치/주차 안내", placeholder: "강남구 테헤란로 123, 건물 내 주차 2시간 무료", type: "textarea" },
    ],
    capabilities: ["자연어 메뉴 추천", "실시간 FAQ 응답", "네이버 플레이스 연동"],
  },
  {
    id: "auto-repair",
    title: "Auto Repair Consultation",
    titleKo: "자동차 수리 상담",
    description: "증상 진단 가이드, 예상 비용, 예약 일정을 안내합니다.",
    category: "consultation",
    icon: "🔧",
    isPro: false,
    accuracy: 88,
    useCases: ["증상 진단", "수리비 안내", "예약 일정", "부품 재고 확인"],
    systemPromptBase: `당신은 {shopName}의 전문 자동차 수리 상담사입니다.
전문 서비스: {services}
예상 가격표: {pricing}
예약 방법: {booking}
기술적 용어는 쉽게 설명하고, 안전과 관련된 문제는 즉시 입고를 권장하세요.`,
    knowledgeFields: [
      { key: "shopName", label: "정비소 이름", placeholder: "예: 스피드 오토", type: "text" },
      { key: "services", label: "제공 서비스", placeholder: "엔진오일 교환, 타이어 교체...", type: "textarea" },
      { key: "pricing", label: "가격표", placeholder: "엔진오일 교환: 50,000원~\n타이어 1개: 80,000원~", type: "textarea" },
      { key: "booking", label: "예약 방법", placeholder: "전화: 02-1234-5678 또는 카카오채널", type: "text" },
    ],
    capabilities: ["증상 기반 진단 가이드", "예상 비용 안내", "예약 자동화"],
  },
  {
    id: "mall-cs",
    title: "Shopping Mall CS",
    titleKo: "쇼핑몰 CS 자동화",
    description: "반품/교환, 사이즈 안내, 정책 설명을 자동 처리합니다.",
    category: "customer-service",
    icon: "🛍️",
    isPro: false,
    accuracy: 89,
    useCases: ["반품/교환 안내", "사이즈 추천", "배송 조회", "정책 설명"],
    systemPromptBase: `당신은 {mallName}의 CS 전문 상담사입니다.
반품/교환 정책: {returnPolicy}
사이즈 가이드: {sizeGuide}
배송 정책: {shippingPolicy}
고객 불만은 공감 먼저, 해결책 제시 순서로 응대하세요.`,
    knowledgeFields: [
      { key: "mallName", label: "쇼핑몰 이름", placeholder: "예: 트렌디몰", type: "text" },
      { key: "returnPolicy", label: "반품/교환 정책", placeholder: "수령 후 7일 이내 교환/반품 가능...", type: "textarea" },
      { key: "sizeGuide", label: "사이즈 가이드", placeholder: "S: 55사이즈 / M: 66사이즈...", type: "textarea" },
      { key: "shippingPolicy", label: "배송 정책", placeholder: "3만원 이상 무료배송, 평균 2-3일 소요", type: "text" },
    ],
    capabilities: ["반품/교환 자동 처리", "AI 사이즈 추천", "감성 분석 기반 응대"],
  },
  {
    id: "fitness-form",
    title: "Fitness Form Correction",
    titleKo: "피트니스 폼 교정",
    description: "웹캠 관절 각도 실시간 분석으로 운동 자세를 교정합니다.",
    category: "vision",
    icon: "💪",
    isPro: true,
    accuracy: 85,
    useCases: ["스쿼트 자세 분석", "데드리프트 교정", "푸시업 폼 체크", "관절 부상 위험 감지"],
    systemPromptBase: `당신은 전문 퍼스널 트레이너입니다.
트레이너 스타일: {trainerStyle}
집중 운동 종목: {focusExercises}
주의 고객 특성: {clientNotes}
관절 각도 데이터를 분석하여 정확하고 안전한 자세 교정 피드백을 제공하세요.`,
    knowledgeFields: [
      { key: "trainerStyle", label: "트레이너 스타일", placeholder: "엄격한 교정 vs 격려 위주", type: "text" },
      { key: "focusExercises", label: "집중 운동 종목", placeholder: "스쿼트, 벤치프레스, 데드리프트", type: "text" },
      { key: "clientNotes", label: "고객 특성/주의사항", placeholder: "무릎 부상 이력, 초보자 위주", type: "textarea" },
    ],
    capabilities: ["웹캠 관절 각도 분석", "실시간 자세 교정", "위험 범위 경고", "운동 기록 저장"],
  },
  {
    id: "hospital-booking",
    title: "Hospital Booking",
    titleKo: "병원 예약/안내",
    description: "진료과 매칭, 예약 일정, 의료 규정 준수 안내를 자동화합니다.",
    category: "booking",
    icon: "🏥",
    isPro: true,
    accuracy: 92,
    useCases: ["증상별 진료과 추천", "예약 일정 관리", "검사 전 주의사항", "의료진 안내"],
    systemPromptBase: `당신은 {hospitalName}의 의료 안내 전문 상담사입니다.
진료과 정보: {departments}
예약 방법: {bookingProcess}
주요 안내사항: {guidelines}
의학적 진단은 하지 않으며, 반드시 의사 상담을 권장하는 안전한 안내만 제공하세요.`,
    knowledgeFields: [
      { key: "hospitalName", label: "병원/의원 이름", placeholder: "예: 서울 건강의원", type: "text" },
      { key: "departments", label: "진료과 목록", placeholder: "내과, 외과, 피부과, 정형외과...", type: "textarea" },
      { key: "bookingProcess", label: "예약 프로세스", placeholder: "전화/앱 예약 → 당일 접수 → 진료", type: "textarea" },
      { key: "guidelines", label: "주요 안내사항", placeholder: "공복 검사 주의사항, 보험서류 안내 등", type: "textarea" },
    ],
    capabilities: ["증상 기반 진료과 매칭", "예약 자동화", "검사 전 안내", "의료법 준수"],
  },
  {
    id: "product-photo",
    title: "AI Product Photo",
    titleKo: "AI 상품사진 생성",
    description: "LoRA 모델 학습(20분)으로 브랜드 스타일의 상품 사진을 생성합니다.",
    category: "generation",
    icon: "📸",
    isPro: true,
    accuracy: 83,
    useCases: ["상품 배경 교체", "브랜드 스타일 적용", "다양한 컨셉 생성", "SNS용 이미지 제작"],
    systemPromptBase: `당신은 {brandName}의 상품 사진 생성 AI입니다.
브랜드 스타일: {brandStyle}
선호 배경/컨셉: {preferredConcepts}
금지 스타일: {prohibitedStyles}
항상 브랜드 아이덴티티를 유지하면서 창의적인 상품 이미지를 제안하세요.`,
    knowledgeFields: [
      { key: "brandName", label: "브랜드 이름", placeholder: "예: 미니멀 리빙", type: "text" },
      { key: "brandStyle", label: "브랜드 스타일", placeholder: "미니멀, 화이트톤, 고급스러운 느낌", type: "text" },
      { key: "preferredConcepts", label: "선호 배경/컨셉", placeholder: "자연광 스튜디오, 야외 라이프스타일", type: "textarea" },
      { key: "prohibitedStyles", label: "금지 스타일", placeholder: "과도한 편집, 어두운 배경", type: "text" },
    ],
    capabilities: ["LoRA 모델 파인튜닝", "브랜드 스타일 학습", "배치 이미지 생성", "스타일 가이드 준수"],
  },
];
