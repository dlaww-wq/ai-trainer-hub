/**
 * AI Trainer Hub — 워크플로우 세트 + 비즈니스 기획서
 *
 * 자영업자/학생/일반인 누구든 템플릿 세트 조합 →
 * 단계별 워크플로우 + 비즈니스 기획서 제공
 *
 * 리서치 기반:
 * - 한국어 AI 빌더 0개 (시장 공백)
 * - Stack AI 산업 특화 = 높은 전환율
 * - n8n 커뮤니티 워크플로우 모델
 * - Superpowers식 단계 강제 (건너뛰기 불가)
 * - gstack식 멀티 관점 검증
 */

/* ================================================================== */
/*  인터페이스                                                           */
/* ================================================================== */

export type TargetAudience = "self-employed" | "enterprise" | "student" | "general";
export type WorkflowDifficulty = "beginner" | "intermediate" | "advanced";

export interface WorkflowPhase {
  week: number;
  title: string;
  description: string;
  templateIds: string[];
  tasks: string[];
  milestone: string;
  checkpoint: string; // Superpowers식: 이 검증을 통과해야 다음 단계
}

export interface BusinessPlan {
  problem: string;
  solution: string;
  revenueModel: string;
  marketSize: string;
  breakEven: string;
  gtmStrategy: string;
  perspectives: {
    owner: string;   // 사업주 관점
    customer: string; // 고객 관점
    competitor: string; // 경쟁사 관점 (gstack식 멀티 관점)
  };
}

export interface WorkflowSet {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string; // lucide icon name
  illustration: string; // /images/workflows/xxx.svg
  gradient: string;
  audience: TargetAudience;
  difficulty: WorkflowDifficulty;
  estimatedWeeks: number;
  templateIds: string[];
  tags: string[];
  pricing: {
    monthlyCost: string;
    toolsCost: string;
    expectedROI: string;
  };
  phases: WorkflowPhase[];
  businessPlan: BusinessPlan;
  requiredTools: { name: string; cost: string; purpose: string }[];
  successMetrics: { metric: string; target: string }[];
}

/* ================================================================== */
/*  워크플로우 세트 데이터 (10개)                                         */
/* ================================================================== */

export const WORKFLOW_SETS: WorkflowSet[] = [

  /* ──────────────────────────────────────────────────────────────── */
  /*  1. 카페 완전 자동화 (자영업자)                                      */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-cafe-automation",
    name: "카페 완전 자동화",
    subtitle: "고객응대부터 리뷰 관리까지 카페 운영 AI 자동화",
    description: "카카오채널 자동응답, 메뉴 추천, 리뷰 답글, 매출 예측까지 — 사장님이 잠든 사이에도 카페가 돌아가게 만듭니다. 야간 CS 100% 커버, 월 CS비용 70% 절감.",
    icon: "Coffee",
    illustration: "/images/workflows/cafe.svg",
    gradient: "from-amber-500 to-orange-600",
    audience: "self-employed",
    difficulty: "beginner",
    estimatedWeeks: 4,
    templateIds: ["text-cs-cafe", "data-demand-restaurant", "image-food-grade"],
    tags: ["카페", "음식점", "자영업자", "카카오채널", "자동응답"],
    pricing: {
      monthlyCost: "₩25,000 (스타터 플랜)",
      toolsCost: "카카오 비즈니스 채널 무료 + AI API 월 ~₩10,000",
      expectedROI: "월 CS비용 70% 절감 → 손익분기 1.2개월",
    },
    phases: [
      {
        week: 1,
        title: "기본 고객응대 AI 세팅",
        description: "메뉴, 영업시간, 위치 등 기본 FAQ를 AI에 학습시킵니다",
        templateIds: ["text-cs-cafe"],
        tasks: [
          "메뉴판 전체 텍스트 입력 (이름, 가격, 알레르기)",
          "영업시간·위치·주차 정보 등록",
          "자주 묻는 질문 TOP 20 작성",
          "사장님 말투 예시 10문장 입력",
          "테스트: '메뉴 추천해줘', '몇시까지 해요?' 질문",
        ],
        milestone: "기본 FAQ 질문에 90% 정확도 달성",
        checkpoint: "AI가 메뉴·영업시간·위치 질문에 정확히 답변하는지 10문제 테스트 통과",
      },
      {
        week: 2,
        title: "카카오채널 연동 + 자동 에스컬레이션",
        description: "카카오톡 채널에 AI를 연결하고, 복잡한 문의는 사장님에게 알림",
        templateIds: ["text-cs-cafe"],
        tasks: [
          "카카오 비즈니스 채널 개설 (또는 기존 채널 연동)",
          "웹훅 URL 설정 → AI 자동응답 활성화",
          "에스컬레이션 기준 설정 (3회 불만, 환불 요청 등)",
          "이메일/카카오 알림 연동",
          "실제 고객 시뮬레이션 테스트",
        ],
        milestone: "카카오채널에서 실제 고객 자동 응대 가동",
        checkpoint: "카카오채널로 3가지 시나리오(메뉴문의/불만/예약) 전송 → AI 올바른 응답 확인",
      },
      {
        week: 3,
        title: "매출 예측 + 재고 최적화",
        description: "과거 매출 데이터로 수요를 예측하고 재료 발주를 최적화합니다",
        templateIds: ["data-demand-restaurant"],
        tasks: [
          "최근 3개월 일별 매출 데이터 입력 (POS 내보내기)",
          "요일/시간대별 패턴 분석",
          "날씨·이벤트 변수 연동 (선택)",
          "재료 발주량 자동 추천 설정",
          "1주일 예측 vs 실제 비교 검증",
        ],
        milestone: "수요 예측 정확도 85% 이상",
        checkpoint: "지난 1주 실제 매출과 예측값 오차율 15% 이내 확인",
      },
      {
        week: 4,
        title: "품질 관리 + 리뷰 자동 답글",
        description: "음식 사진으로 품질을 체크하고, 리뷰에 자동 답글을 생성합니다",
        templateIds: ["image-food-grade"],
        tasks: [
          "메뉴별 기준 사진 20장 등록",
          "품질 등급 기준 설정 (A/B/C)",
          "리뷰 자동 수집 연동 (네이버/카카오맵)",
          "별점별 답글 템플릿 설정",
          "전체 파이프라인 통합 테스트",
        ],
        milestone: "전체 자동화 파이프라인 가동 완료",
        checkpoint: "1일 동안 무인 운영 → 응대·예측·리뷰 모두 정상 동작 확인",
      },
    ],
    businessPlan: {
      problem: "소규모 카페 사장님은 CS, 재고, 리뷰 관리에 하루 3-4시간 소모. 야간/휴무일 응대 불가로 고객 이탈 발생.",
      solution: "AI가 24시간 고객 응대 + 수요 예측 + 리뷰 관리를 자동화. 사장님은 '만드는 일'에만 집중.",
      revenueModel: "월 ₩25,000 구독 + AI 처리 건수 기반 변동비 (100건 초과 시 건당 ₩50)",
      marketSize: "국내 카페 약 10만개 × 월 ₩25,000 = TAM ₩30억/년. 초기 서울 1% 타겟 = ₩3억/년",
      breakEven: "고객 120명 확보 시 (월 매출 ₩300만 = 서버·AI API 비용 충당). 약 3개월 소요 예상.",
      gtmStrategy: "네이버 플레이스 상위 카페 100곳 DM → 1개월 무료 체험 → 성공사례 콘텐츠 마케팅 → 카페 커뮤니티 입소문",
      perspectives: {
        owner: "야간에도 주문·문의 놓치지 않고, 재료 폐기율 30% 감소 → 월 50만원 이상 절약",
        customer: "24시간 즉시 응답, 개인 취향 기반 메뉴 추천 → 단골 전환율 증가",
        competitor: "수동 운영 카페 대비 응답속도 60배, 야간 커버리지 0→100% 격차",
      },
    },
    requiredTools: [
      { name: "카카오 비즈니스 채널", cost: "무료", purpose: "고객 채팅 채널" },
      { name: "AI Trainer Hub 스타터", cost: "₩25,000/월", purpose: "AI 학습·배포 플랫폼" },
      { name: "POS 데이터 내보내기", cost: "무료 (기존 POS)", purpose: "매출 데이터 입력" },
    ],
    successMetrics: [
      { metric: "FAQ 자동 응답 정확도", target: "90% 이상" },
      { metric: "야간 응대 커버리지", target: "100%" },
      { metric: "수요 예측 오차율", target: "15% 이내" },
      { metric: "월 CS 비용 절감", target: "70%" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  2. 쇼핑몰 CS 자동화 (자영업자)                                     */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-ecommerce-cs",
    name: "쇼핑몰 CS 자동화",
    subtitle: "주문·배송·환불 문의 AI가 24시간 처리",
    description: "스마트스토어/쿠팡 셀러를 위한 완전 자동 CS. 주문 상태 조회, 환불 규정 안내, 상품 추천까지 AI가 처리. 에스컬레이션 시 사장님에게 즉시 알림.",
    icon: "ShoppingCart",
    illustration: "/images/workflows/ecommerce.svg",
    gradient: "from-blue-500 to-cyan-600",
    audience: "self-employed",
    difficulty: "intermediate",
    estimatedWeeks: 4,
    templateIds: ["text-cs-ecommerce", "text-content-product", "data-demand-restaurant"],
    tags: ["쇼핑몰", "이커머스", "CS", "스마트스토어", "자동화"],
    pricing: {
      monthlyCost: "₩25,000 (스타터 플랜)",
      toolsCost: "카카오 비즈채널 무료 + AI API 월 ~₩15,000",
      expectedROI: "CS 인건비 월 150만원 절감 → 손익분기 즉시",
    },
    phases: [
      {
        week: 1,
        title: "CS 정책 학습 + 기본 응대",
        description: "환불/교환/배송 정책을 AI에 학습시키고 기본 CS를 자동화합니다",
        templateIds: ["text-cs-ecommerce"],
        tasks: [
          "환불/교환/배송 정책 문서 업로드",
          "상품 카테고리별 FAQ 100건 작성",
          "기존 CS 상담 기록 CSV 업로드",
          "금지 표현 목록 설정 (법적 리스크 방지)",
          "에스컬레이션 기준 설정 (금액, 불만 횟수)",
        ],
        milestone: "일반 CS 문의 80% 자동 처리",
        checkpoint: "실제 CS 시나리오 20건 테스트 → 16건 이상 정확 답변",
      },
      {
        week: 2,
        title: "상품 설명 자동 생성",
        description: "상품 정보로 매력적인 상세페이지 문구를 자동 생성합니다",
        templateIds: ["text-content-product"],
        tasks: [
          "주력 상품 10개 정보 입력 (스펙, USP, 타겟)",
          "기존 잘 팔리는 상세페이지 문구 5개 업로드",
          "톤앤매너 설정 (브랜드 가이드)",
          "SEO 키워드 연동",
          "A/B 테스트용 문구 2버전 생성",
        ],
        milestone: "상품 설명 자동 생성 파이프라인 구축",
        checkpoint: "신규 상품 1개 → 상세페이지 문구 자동 생성 → 기존 대비 품질 동등 이상",
      },
      {
        week: 3,
        title: "수요 예측 + 발주 최적화",
        description: "판매 데이터로 수요를 예측하고 재고 관리를 최적화합니다",
        templateIds: ["data-demand-restaurant"],
        tasks: [
          "최근 6개월 판매 데이터 입력",
          "시즌/이벤트 패턴 분석",
          "재고 부족·과잉 알림 임계값 설정",
          "자동 발주 추천 연동",
          "1주일 예측 검증",
        ],
        milestone: "재고 과잉/부족률 30% 감소",
        checkpoint: "2주간 예측 vs 실제 판매량 비교 → 오차율 20% 이내",
      },
      {
        week: 4,
        title: "통합 자동화 + 성과 대시보드",
        description: "CS·상품·재고를 통합 관리하고 성과를 모니터링합니다",
        templateIds: ["text-cs-ecommerce", "text-content-product"],
        tasks: [
          "카카오/네이버톡톡 채널 연동",
          "자동 응대 + 상품 추천 통합",
          "주간 성과 리포트 자동 생성",
          "에스컬레이션 알림 최적화",
          "전체 파이프라인 1주 무인 운영 테스트",
        ],
        milestone: "전체 CS 파이프라인 자동화 완료",
        checkpoint: "1주 무인 운영 → 고객 불만율 기존 대비 감소 확인",
      },
    ],
    businessPlan: {
      problem: "쇼핑몰 셀러는 CS 처리에 하루 4-6시간 소모. 야간/주말 미응답으로 별점 하락 → 매출 감소 악순환.",
      solution: "AI가 주문·배송·환불 문의를 24시간 자동 처리 + 상품 설명 자동 생성으로 리스팅 속도 3배 향상.",
      revenueModel: "월 ₩25,000 구독 + AI 처리 건수 기반 (500건 포함, 초과 시 건당 ₩30)",
      marketSize: "국내 온라인 셀러 약 100만명 × 1% 전환 × ₩25,000 = TAM ₩25억/년",
      breakEven: "고객 200명 확보 시 (월 매출 ₩500만). 약 4개월 소요 예상.",
      gtmStrategy: "스마트스토어 판매자 포럼 콘텐츠 마케팅 → 1개월 무료 체험 → 성공 셀러 인터뷰 바이럴",
      perspectives: {
        owner: "CS 인건비 월 150만원 절감, 상품 등록 속도 3배 → 더 많은 상품 취급 가능",
        customer: "24시간 즉각 응답, 정확한 배송 정보 → 구매 만족도 향상",
        competitor: "수동 CS 셀러 대비 응답 시간 30분→2초, 야간 미응답 0건",
      },
    },
    requiredTools: [
      { name: "카카오/네이버톡톡 채널", cost: "무료", purpose: "고객 소통 채널" },
      { name: "AI Trainer Hub 스타터", cost: "₩25,000/월", purpose: "AI 학습·배포" },
      { name: "스마트스토어/쿠팡 API", cost: "무료", purpose: "주문 데이터 연동" },
    ],
    successMetrics: [
      { metric: "CS 자동 처리율", target: "80% 이상" },
      { metric: "평균 응답 시간", target: "3초 이내" },
      { metric: "고객 만족도", target: "4.5/5.0 이상" },
      { metric: "CS 비용 절감", target: "월 150만원" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  3. 스마트팩토리 세트 (기업)                                         */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-smart-factory",
    name: "스마트팩토리 AI 세트",
    subtitle: "불량 검출 + 이상 탐지 + 생산 계획 최적화",
    description: "제조업 현장에 AI를 도입합니다. 카메라로 불량품을 실시간 검출하고, 센서 데이터로 설비 이상을 사전 감지하며, 수요 기반 생산 계획을 최적화합니다.",
    icon: "Factory",
    illustration: "/images/workflows/factory.svg",
    gradient: "from-slate-600 to-zinc-800",
    audience: "enterprise",
    difficulty: "advanced",
    estimatedWeeks: 8,
    templateIds: ["image-mfg-defect", "data-anomaly-factory", "data-mfg-planning"],
    tags: ["제조업", "스마트팩토리", "불량검출", "이상탐지", "생산계획"],
    pricing: {
      monthlyCost: "₩50,000 (프로 플랜)",
      toolsCost: "산업용 카메라 ₩200만 + 센서 키트 ₩50만 + AI API 월 ~₩30,000",
      expectedROI: "불량률 60% 감소 → 연간 ₩1.2억 절감 (중소제조업 기준)",
    },
    phases: [
      {
        week: 1,
        title: "불량 검출 AI 데이터 수집",
        description: "제품별 정상/불량 이미지를 수집하고 라벨링합니다",
        templateIds: ["image-mfg-defect"],
        tasks: [
          "검사 라인에 카메라 설치 (고정 앵글)",
          "정상 제품 이미지 500장 촬영",
          "불량 유형별 이미지 수집 (스크래치, 변형, 오염)",
          "라벨링 가이드라인 작성",
          "데이터 품질 검수 (조명·각도 일관성)",
        ],
        milestone: "학습용 데이터셋 1,000장 준비 완료",
        checkpoint: "정상 500장 + 불량 유형별 최소 100장 확보, 라벨링 정확도 95% 이상",
      },
      {
        week: 2,
        title: "불량 검출 모델 학습 + 배포",
        description: "수집된 이미지로 불량 검출 AI를 학습시키고 라인에 배포합니다",
        templateIds: ["image-mfg-defect"],
        tasks: [
          "데이터 증강 (회전, 밝기 변경 등)",
          "모델 학습 실행 (Fine-tuning)",
          "정확도·재현율 평가",
          "엣지 디바이스 배포 (Jetson/Raspberry Pi)",
          "실시간 판정 → 불량 알림 연동",
        ],
        milestone: "불량 검출 정확도 95% 이상 달성",
        checkpoint: "테스트셋 200장 → 정확도 95%, 재현율 90% 이상",
      },
      {
        week: 3,
        title: "센서 이상 탐지 시스템",
        description: "설비 센서 데이터로 이상 징후를 사전에 감지합니다",
        templateIds: ["data-anomaly-factory"],
        tasks: [
          "주요 설비에 IoT 센서 설치 (진동, 온도, 전류)",
          "정상 가동 데이터 2주 수집",
          "이상 탐지 모델 학습",
          "알림 임계값 설정 (경고/위험)",
          "설비 관리자 대시보드 구축",
        ],
        milestone: "이상 징후 사전 감지 시스템 가동",
        checkpoint: "인위적 이상 시나리오 3건 → 모두 감지 + 10분 이내 알림",
      },
      {
        week: 4,
        title: "생산 계획 최적화",
        description: "수요 예측 기반으로 생산 계획을 자동 최적화합니다",
        templateIds: ["data-mfg-planning"],
        tasks: [
          "과거 6개월 생산·판매 데이터 입력",
          "원자재 리드타임·비용 데이터 등록",
          "생산 라인 용량 제약 조건 설정",
          "최적 생산 스케줄 자동 생성",
          "실제 수요 대비 검증",
        ],
        milestone: "AI 기반 생산 계획 수립 체계 구축",
        checkpoint: "AI 추천 계획 vs 기존 계획 비교 → 원가 또는 납기 개선 확인",
      },
      {
        week: 5,
        title: "통합 모니터링 대시보드",
        description: "불량·이상·생산 데이터를 통합 대시보드로 관리합니다",
        templateIds: ["image-mfg-defect", "data-anomaly-factory", "data-mfg-planning"],
        tasks: [
          "실시간 불량률 모니터링 화면",
          "설비 상태 현황판",
          "생산 계획 달성률 트래킹",
          "이상 발생 시 자동 생산 조정 로직",
          "주간 리포트 자동 생성",
        ],
        milestone: "통합 모니터링 시스템 완성",
        checkpoint: "대시보드에서 3개 시스템 데이터 실시간 확인 가능",
      },
      {
        week: 6,
        title: "현장 운영 최적화 (1차)",
        description: "2주간 실제 운영하며 모델을 튜닝합니다",
        templateIds: ["image-mfg-defect", "data-anomaly-factory"],
        tasks: [
          "오탐(False Positive) 사례 수집 → 재학습",
          "미탐(False Negative) 사례 분석 → 데이터 보강",
          "알림 임계값 미세 조정",
          "현장 작업자 피드백 수렴",
          "모델 v2 배포",
        ],
        milestone: "실운영 기반 모델 정확도 97% 달성",
        checkpoint: "1주 운영 로그 → 오탐률 3% 이하, 미탐률 2% 이하",
      },
      {
        week: 7,
        title: "현장 운영 최적화 (2차) + 연동",
        description: "ERP/MES 시스템 연동으로 자동화 범위를 확장합니다",
        templateIds: ["data-mfg-planning"],
        tasks: [
          "ERP 시스템 API 연동 (자재 발주 자동화)",
          "MES 시스템 연동 (생산 실적 자동 수집)",
          "불량 발생 시 자동 생산라인 속도 조절",
          "원자재 자동 발주 로직 검증",
          "통합 데이터 정합성 검증",
        ],
        milestone: "ERP/MES 연동 완료",
        checkpoint: "자동 발주 1건 + 생산 실적 자동 수집 정상 동작",
      },
      {
        week: 8,
        title: "안정화 + 매뉴얼 + 이관",
        description: "시스템을 안정화하고 현장에 이관합니다",
        templateIds: [],
        tasks: [
          "운영 매뉴얼 작성 (관리자/작업자용)",
          "장애 대응 프로세스 수립",
          "백업·복구 체계 구축",
          "성과 리포트 작성",
          "현장 담당자 교육 (2시간)",
        ],
        milestone: "스마트팩토리 AI 시스템 정식 가동",
        checkpoint: "1주 무장애 운영 + 담당자 독립 운영 가능 확인",
      },
    ],
    businessPlan: {
      problem: "중소 제조업 불량률 평균 3-5%, 설비 돌발 정지로 연간 수억 손실. 숙련 검사공 부족 심화.",
      solution: "AI 비전 검사 + 예측 정비 + 생산 최적화 3종 세트로 품질·생산성·안정성 동시 개선.",
      revenueModel: "프로 플랜 월 ₩50,000 + 카메라/센서 설치 컨설팅 ₩300만 (1회) + 기술 지원 월 ₩10만",
      marketSize: "국내 제조업체 약 7만개 × 스마트팩토리 도입 의향 30% × ₩600만/년 = TAM ₩1,260억/년",
      breakEven: "기업 고객 50개 확보 시 (월 매출 ₩250만 + 컨설팅). 약 6개월 소요.",
      gtmStrategy: "스마트제조혁신센터 협력 → 정부 지원사업 연계 → 성공 사례 공장 견학 프로그램 → 제조업 협회 세미나",
      perspectives: {
        owner: "불량률 60% 감소 + 설비 돌발 정지 80% 예방 → 연간 1.2억원 절감",
        customer: "불량품 유출 차단 → 클레임 감소 → 납품 신뢰도 향상",
        competitor: "수작업 검사 대비 24시간 일관된 검사, 인력 의존도 탈피",
      },
    },
    requiredTools: [
      { name: "산업용 카메라", cost: "₩200만 (1회)", purpose: "제품 이미지 촬영" },
      { name: "IoT 센서 키트", cost: "₩50만 (1회)", purpose: "설비 모니터링" },
      { name: "AI Trainer Hub 프로", cost: "₩50,000/월", purpose: "AI 학습·배포" },
      { name: "엣지 디바이스", cost: "₩30만 (1회)", purpose: "실시간 추론" },
    ],
    successMetrics: [
      { metric: "불량 검출 정확도", target: "97% 이상" },
      { metric: "설비 이상 사전 감지율", target: "90% 이상" },
      { metric: "생산 계획 준수율", target: "95% 이상" },
      { metric: "연간 비용 절감", target: "₩1.2억 이상" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  4. AI 포트폴리오 세트 (학생)                                       */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-student-portfolio",
    name: "AI 포트폴리오 세트",
    subtitle: "취업용 AI 프로젝트 포트폴리오 4주 완성",
    description: "AI 엔지니어·데이터 사이언티스트 취업을 위한 실전 포트폴리오. 텍스트·이미지·데이터 3가지 AI를 직접 만들어 GitHub에 올리고 면접에서 어필하세요.",
    icon: "GraduationCap",
    illustration: "/images/workflows/portfolio.svg",
    gradient: "from-violet-500 to-purple-600",
    audience: "student",
    difficulty: "intermediate",
    estimatedWeeks: 4,
    templateIds: ["text-cs-cafe", "image-mfg-defect", "data-demand-restaurant", "text-edu-tutor"],
    tags: ["학생", "포트폴리오", "취업", "AI엔지니어", "프로젝트"],
    pricing: {
      monthlyCost: "₩0 (무료 플랜으로 시작)",
      toolsCost: "GitHub 무료 + Vercel 무료 + AI API 월 ~₩5,000",
      expectedROI: "AI 관련 취업 합격률 3배 향상 (포트폴리오 보유 시)",
    },
    phases: [
      {
        week: 1,
        title: "프로젝트 1: 챗봇 AI (NLP)",
        description: "RAG 기반 고객응대 챗봇을 처음부터 만듭니다",
        templateIds: ["text-cs-cafe"],
        tasks: [
          "프로젝트 구조 설계 (Next.js + Prisma + pgvector)",
          "텍스트 데이터 준비 → 청킹 → 벡터 임베딩",
          "RAG 파이프라인 구현 (검색 → 생성)",
          "에스컬레이션 로직 구현",
          "GitHub README.md 작성 (아키텍처 다이어그램 포함)",
        ],
        milestone: "RAG 챗봇 데모 배포 + GitHub 공개",
        checkpoint: "배포된 데모에서 10개 질문 정확 응답 + README 아키텍처 다이어그램 있음",
      },
      {
        week: 2,
        title: "프로젝트 2: 이미지 분류 AI (CV)",
        description: "불량 검출 또는 이미지 분류 모델을 학습시킵니다",
        templateIds: ["image-mfg-defect"],
        tasks: [
          "데이터셋 수집 + 전처리 (augmentation 포함)",
          "CNN 모델 설계 또는 사전학습 모델 Fine-tuning",
          "학습 과정 시각화 (loss/accuracy 그래프)",
          "추론 API 구현",
          "모델 성능 비교 표 작성",
        ],
        milestone: "이미지 분류 모델 95%+ 정확도 달성",
        checkpoint: "테스트셋 평가 정확도 95% 이상 + 학습 그래프 + 모델 비교표",
      },
      {
        week: 3,
        title: "프로젝트 3: 데이터 분석 + 예측 (ML)",
        description: "실제 데이터로 수요 예측 또는 이상 탐지 모델을 만듭니다",
        templateIds: ["data-demand-restaurant"],
        tasks: [
          "공개 데이터셋 선택 + EDA",
          "피처 엔지니어링",
          "여러 모델 비교 실험 (XGBoost, LSTM 등)",
          "Jupyter Notebook 정리",
          "인사이트 + 시각화 대시보드",
        ],
        milestone: "데이터 분석 노트북 + 예측 모델 완성",
        checkpoint: "EDA 시각화 5개 + 모델 3개 비교 + 최종 모델 성능 리포트",
      },
      {
        week: 4,
        title: "포트폴리오 사이트 + 면접 준비",
        description: "3개 프로젝트를 포트폴리오 사이트로 통합하고 면접을 준비합니다",
        templateIds: ["text-edu-tutor"],
        tasks: [
          "포트폴리오 웹사이트 제작 (Vercel 배포)",
          "각 프로젝트 기술 블로그 포스트 작성",
          "AI 면접 튜터로 모의 면접 연습",
          "프로젝트별 기술 질문 예상 답변 준비",
          "LinkedIn/원티드 프로필 업데이트",
        ],
        milestone: "완성된 AI 포트폴리오 사이트 + 면접 준비 완료",
        checkpoint: "3개 프로젝트 라이브 데모 + 블로그 + 모의 면접 3회 완료",
      },
    ],
    businessPlan: {
      problem: "AI 관련 취업 시 포트폴리오 필수이지만, 독학으로 실전 프로젝트 만들기 어려움. 부트캠프는 ₩300만+ 비용.",
      solution: "템플릿 기반 가이드로 4주 만에 3개 실전 프로젝트 완성. 부트캠프 대비 1/10 비용.",
      revenueModel: "무료 시작 → 프로 템플릿(상세 코드·해설) ₩25,000/월. 취업 성공 시 성과 보수 없음 (입소문 효과).",
      marketSize: "연간 AI 관련 취업 준비생 약 5만명 × 20% 전환 × ₩25,000 = TAM ₩25억/년",
      breakEven: "유료 전환 학생 500명 (월 매출 ₩1,250만). 약 3개월.",
      gtmStrategy: "대학 AI 동아리 협력 → 무료 워크숍 → 취업 성공 후기 바이럴 → 대학교 정규 과목 연계",
      perspectives: {
        owner: "수강생이 취업에 성공하면 자연스러운 바이럴 마케팅 효과",
        customer: "4주 만에 면접에서 보여줄 수 있는 실전 프로젝트 3개 확보",
        competitor: "부트캠프(₩300만, 12주) 대비 1/10 비용, 1/3 기간으로 유사 결과물",
      },
    },
    requiredTools: [
      { name: "GitHub", cost: "무료", purpose: "코드 관리 + 포트폴리오" },
      { name: "Vercel", cost: "무료 (개인)", purpose: "프로젝트 배포" },
      { name: "Google Colab", cost: "무료", purpose: "ML 모델 학습" },
    ],
    successMetrics: [
      { metric: "완성 프로젝트 수", target: "3개" },
      { metric: "GitHub 스타", target: "프로젝트당 10+" },
      { metric: "라이브 데모", target: "3개 모두 배포" },
      { metric: "면접 합격률", target: "기존 대비 3배" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  5. 1인 창업 MVP 세트 (일반인)                                      */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-solo-mvp",
    name: "1인 창업 MVP 세트",
    subtitle: "아이디어 → AI 제품 → 첫 매출까지 6주",
    description: "코딩 경험 없이도 AI SaaS 제품을 만들어 첫 매출을 올립니다. 아이디어 검증 → MVP 개발 → 런칭 → 첫 고객 확보까지 단계별로 안내합니다.",
    icon: "Rocket",
    illustration: "/images/workflows/solo-mvp.svg",
    gradient: "from-rose-500 to-pink-600",
    audience: "general",
    difficulty: "beginner",
    estimatedWeeks: 6,
    templateIds: ["text-cs-cafe", "text-content-sns", "text-content-product"],
    tags: ["1인창업", "MVP", "SaaS", "노코드", "부업"],
    pricing: {
      monthlyCost: "₩25,000 (스타터 플랜)",
      toolsCost: "도메인 ₩15,000/년 + AI API 월 ~₩10,000",
      expectedROI: "첫 달 매출 ₩30만 목표 → 3개월 내 월 ₩100만",
    },
    phases: [
      {
        week: 1,
        title: "아이디어 검증 + 시장 조사",
        description: "AI로 해결할 문제를 찾고 시장 가능성을 검증합니다",
        templateIds: [],
        tasks: [
          "내가 반복적으로 겪는 문제 10개 리스트업",
          "각 문제에 AI가 해결 가능한지 평가",
          "경쟁 서비스 5개 분석 (가격, 기능, 리뷰)",
          "잠재 고객 10명 인터뷰 (문제 공감 확인)",
          "MVP 기능 목록 확정 (핵심 1개만)",
        ],
        milestone: "검증된 아이디어 1개 + MVP 기능 정의",
        checkpoint: "잠재 고객 10명 중 7명 이상 '돈 내고 쓰겠다' 답변",
      },
      {
        week: 2,
        title: "AI 에이전트 제작",
        description: "핵심 기능을 수행하는 AI 에이전트를 만듭니다",
        templateIds: ["text-cs-cafe"],
        tasks: [
          "해결할 문제에 맞는 템플릿 선택",
          "도메인 지식 데이터 수집 (FAQ, 매뉴얼 등)",
          "AI 에이전트 학습 + 테스트",
          "응답 품질 20건 수동 검증",
          "에스컬레이션 로직 설정",
        ],
        milestone: "핵심 기능 AI 에이전트 동작 확인",
        checkpoint: "타겟 시나리오 20건 → 16건 이상 올바른 응답",
      },
      {
        week: 3,
        title: "랜딩 페이지 + 사전 신청",
        description: "랜딩 페이지를 만들고 사전 신청을 받습니다",
        templateIds: ["text-content-product"],
        tasks: [
          "랜딩 페이지 카피라이팅 (AI 활용)",
          "Tally/Typeform 사전 신청 폼 연동",
          "핵심 기능 데모 영상 30초 제작",
          "인스타그램/블로그에 티저 게시",
          "사전 신청 50건 목표 달성",
        ],
        milestone: "사전 신청 50건 이상 확보",
        checkpoint: "사전 신청 50건 + 이메일 주소 수집 완료",
      },
      {
        week: 4,
        title: "MVP 배포 + 결제 연동",
        description: "실제 사용 가능한 MVP를 배포하고 결제를 연동합니다",
        templateIds: ["text-cs-cafe"],
        tasks: [
          "Vercel/Railway 배포",
          "토스페이먼츠 결제 연동",
          "사용자 온보딩 플로우 설계",
          "기본 사용 가이드 작성",
          "베타 테스터 10명 초대",
        ],
        milestone: "결제 가능한 MVP 배포 완료",
        checkpoint: "베타 테스터 10명 가입 + 1건 이상 결제 성공",
      },
      {
        week: 5,
        title: "콘텐츠 마케팅 + 첫 고객",
        description: "SNS 콘텐츠로 첫 유료 고객을 확보합니다",
        templateIds: ["text-content-sns"],
        tasks: [
          "타겟 SNS 채널 선정 (인스타/블로그/유튜브)",
          "AI 활용 콘텐츠 10개 자동 생성",
          "사전 신청자에게 런칭 이메일 발송",
          "첫 유료 고객 후기 확보",
          "주간 성과 분석 (유입/전환/이탈)",
        ],
        milestone: "첫 유료 고객 10명 확보",
        checkpoint: "유료 결제 고객 10명 + 후기 3건 확보",
      },
      {
        week: 6,
        title: "피드백 반영 + 성장 루프 구축",
        description: "고객 피드백으로 개선하고 지속 성장 구조를 만듭니다",
        templateIds: ["text-cs-cafe", "text-content-sns"],
        tasks: [
          "고객 피드백 수집 + 우선순위 정리",
          "핵심 개선 1-2건 반영",
          "레퍼럴 프로그램 설계 (친구 초대 시 할인)",
          "자동 콘텐츠 발행 루프 구축",
          "월간 성과 리포트 작성",
        ],
        milestone: "지속 성장 가능한 비즈니스 구조 확립",
        checkpoint: "월 매출 ₩30만 이상 + 고객 이탈율 20% 이하",
      },
    ],
    businessPlan: {
      problem: "좋은 아이디어는 있지만 코딩/AI 기술이 없어 실행 못 함. 외주는 ₩500만+로 리스크 큼.",
      solution: "AI Trainer Hub 템플릿으로 코딩 없이 6주 만에 AI 기반 MVP 제작 → 시장 검증까지 완료.",
      revenueModel: "구독 ₩25,000/월. 제품 매출의 별도 수수료 없음 → 사용자 성장에 인센티브 정렬.",
      marketSize: "1인 창업 희망자 연간 약 100만명 × 5% AI 관심 × ₩25,000 = TAM ₩125억/년",
      breakEven: "첫 달 유료 고객 10명 × ₩25,000 = ₩25만. 3개월 차 100명 → 월 ₩250만.",
      gtmStrategy: "블로그/유튜브 '코딩 없이 AI 제품 만들기' 시리즈 → 성공 사례 인터뷰 → 1인 창업 커뮤니티 입소문",
      perspectives: {
        owner: "외주 없이 직접 AI 제품 제작, 아이디어에서 매출까지 6주 소요",
        customer: "전문적인 AI 서비스를 합리적 가격에 이용 가능",
        competitor: "외주 개발(₩500만, 2-3개월) 대비 1/20 비용, 1/2 기간",
      },
    },
    requiredTools: [
      { name: "AI Trainer Hub 스타터", cost: "₩25,000/월", purpose: "AI 에이전트 제작" },
      { name: "Vercel", cost: "무료", purpose: "MVP 배포" },
      { name: "토스페이먼츠", cost: "수수료 3.5%", purpose: "결제 처리" },
    ],
    successMetrics: [
      { metric: "MVP 배포", target: "6주 이내" },
      { metric: "사전 신청", target: "50건 이상" },
      { metric: "첫 달 유료 고객", target: "10명" },
      { metric: "3개월 차 월 매출", target: "₩100만" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  6. 부동산 AI 상담 세트 (자영업자)                                    */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-realestate-ai",
    name: "부동산 AI 상담 세트",
    subtitle: "매물 문의 24시간 자동 응대 + 시세 분석",
    description: "부동산 중개사를 위한 AI. 매물 정보 자동 안내, 시세 질문 응대, 방문 예약 자동화. 네이버 부동산/직방 매물 연동으로 항상 최신 정보 유지.",
    icon: "Building2",
    illustration: "/images/workflows/realestate.svg",
    gradient: "from-emerald-500 to-teal-600",
    audience: "self-employed",
    difficulty: "intermediate",
    estimatedWeeks: 4,
    templateIds: ["text-cs-realestate", "text-content-sns", "data-demand-restaurant"],
    tags: ["부동산", "중개사", "매물상담", "시세분석", "자동예약"],
    pricing: {
      monthlyCost: "₩25,000 (스타터 플랜)",
      toolsCost: "카카오채널 무료 + AI API 월 ~₩15,000",
      expectedROI: "야간 문의 대응으로 월 계약 2건 추가 → ₩200만+ 수수료",
    },
    phases: [
      {
        week: 1,
        title: "매물 데이터 학습 + 기본 상담",
        description: "현재 보유 매물과 지역 시세를 AI에 학습시킵니다",
        templateIds: ["text-cs-realestate"],
        tasks: [
          "현재 매물 리스트 입력 (면적, 가격, 특징)",
          "지역별 시세 데이터 등록",
          "대출/세금 관련 기본 FAQ 작성",
          "상담 어투 설정 (전문적이면서 친근하게)",
          "매물 추천 로직 테스트",
        ],
        milestone: "매물 문의 자동 응대 가능",
        checkpoint: "매물 조건 질문 10건 → 적절한 매물 추천 8건 이상",
      },
      {
        week: 2,
        title: "카카오채널 연동 + 방문 예약",
        description: "카카오톡으로 자동 상담하고 방문 예약을 잡습니다",
        templateIds: ["text-cs-realestate"],
        tasks: [
          "카카오 비즈니스 채널 연동",
          "자동 방문 예약 플로우 설계",
          "캘린더 연동 (Google Calendar)",
          "에스컬레이션 설정 (계약 관련 → 직접 상담)",
          "실제 시나리오 테스트",
        ],
        milestone: "카카오채널 자동 상담 + 예약 시스템 가동",
        checkpoint: "카카오 시뮬레이션 → 매물 추천 + 방문 예약까지 자동 완료",
      },
      {
        week: 3,
        title: "시세 분석 + 투자 인사이트",
        description: "지역 시세 트렌드를 분석하고 고객에게 인사이트를 제공합니다",
        templateIds: ["data-demand-restaurant"],
        tasks: [
          "실거래가 데이터 연동 (국토부 API)",
          "지역별 가격 트렌드 분석",
          "투자 수익률 시뮬레이션 로직",
          "주간 시세 리포트 자동 생성",
          "고객별 맞춤 시세 알림 설정",
        ],
        milestone: "AI 시세 분석 리포트 자동 발행",
        checkpoint: "주간 시세 리포트 1건 자동 생성 + 정확도 검증",
      },
      {
        week: 4,
        title: "마케팅 콘텐츠 + 고객 관리",
        description: "SNS 콘텐츠 자동 생성으로 신규 고객을 유입시킵니다",
        templateIds: ["text-content-sns"],
        tasks: [
          "매물 소개 콘텐츠 자동 생성 (블로그/인스타)",
          "지역 부동산 뉴스 큐레이션",
          "고객 DB 관리 + 매물 매칭 알림",
          "성과 대시보드 구축",
          "전체 워크플로우 통합 테스트",
        ],
        milestone: "부동산 AI 운영 시스템 완성",
        checkpoint: "1주 자동 운영 → 문의 응대 + 콘텐츠 발행 + 리포트 모두 정상",
      },
    ],
    businessPlan: {
      problem: "부동산 중개사는 야간/주말 문의 놓침 → 경쟁 중개사에 고객 유출. 매물 관리·마케팅도 수작업.",
      solution: "AI가 24시간 매물 상담 + 방문 예약 + 시세 리포트 + 마케팅 콘텐츠 자동화.",
      revenueModel: "스타터 ₩25,000/월 + 프리미엄 시세 분석 추가 ₩10,000/월",
      marketSize: "국내 공인중개사 약 12만명 × 5% × ₩35,000 = TAM ₩25억/년",
      breakEven: "고객 150명 확보 시 (월 매출 ₩525만). 약 4개월.",
      gtmStrategy: "부동산 중개사 협회 세미나 → 무료 체험 → 계약 성사 건수 기반 성공 사례 공유",
      perspectives: {
        owner: "야간 문의 대응으로 월 계약 2건 추가, 마케팅 시간 주 10시간 절약",
        customer: "언제든 즉시 매물 정보 확인, 맞춤 시세 알림으로 투자 판단 지원",
        competitor: "24시간 즉시 응대 vs 영업시간만 응대 → 고객 선점 효과",
      },
    },
    requiredTools: [
      { name: "카카오 비즈니스 채널", cost: "무료", purpose: "고객 상담" },
      { name: "AI Trainer Hub 스타터", cost: "₩25,000/월", purpose: "AI 학습·배포" },
      { name: "Google Calendar API", cost: "무료", purpose: "방문 예약 관리" },
    ],
    successMetrics: [
      { metric: "문의 자동 응대율", target: "85% 이상" },
      { metric: "야간 응대 커버리지", target: "100%" },
      { metric: "월 추가 계약 건수", target: "+2건" },
      { metric: "콘텐츠 자동 발행", target: "주 5건" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  7. 콜센터 AI 전환 세트 (기업)                                      */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-callcenter-ai",
    name: "콜센터 AI 전환",
    subtitle: "음성 분석 + 자동 응대 + 상담원 지원 AI",
    description: "기존 콜센터에 AI를 도입합니다. 고객 음성을 실시간 분석하고, 반복 문의는 AI가 처리하며, 복잡한 건은 상담원에게 실시간 정보를 제공합니다.",
    icon: "Headphones",
    illustration: "/images/workflows/callcenter.svg",
    gradient: "from-sky-500 to-blue-700",
    audience: "enterprise",
    difficulty: "advanced",
    estimatedWeeks: 6,
    templateIds: ["audio-callcenter-analysis", "text-cs-ecommerce", "audio-meeting-summary"],
    tags: ["콜센터", "음성AI", "STT", "상담원지원", "감정분석"],
    pricing: {
      monthlyCost: "₩50,000 (프로 플랜)",
      toolsCost: "STT API 월 ~₩50,000 + AI API 월 ~₩30,000",
      expectedROI: "상담원 1인당 처리량 40% 증가 → 인건비 연간 ₩3,600만 절감 (10석 기준)",
    },
    phases: [
      {
        week: 1,
        title: "통화 데이터 수집 + STT 파이프라인",
        description: "기존 통화 녹음을 텍스트로 변환하는 파이프라인을 구축합니다",
        templateIds: ["audio-callcenter-analysis"],
        tasks: [
          "기존 통화 녹음 100건 수집 (동의 확인)",
          "STT 엔진 선택 + 테스트 (Whisper/Clova)",
          "화자 분리 (상담원 vs 고객) 구현",
          "변환 정확도 검증 (수동 교차 확인)",
          "데이터 파이프라인 자동화",
        ],
        milestone: "STT 파이프라인 구축 + 정확도 95%",
        checkpoint: "통화 녹음 10건 → 텍스트 변환 정확도 95% 이상 (수동 비교)",
      },
      {
        week: 2,
        title: "FAQ 자동 응대 AI 학습",
        description: "반복 문의 패턴을 분석하고 자동 응대 AI를 만듭니다",
        templateIds: ["text-cs-ecommerce"],
        tasks: [
          "변환된 통화에서 반복 문의 패턴 추출",
          "FAQ 카테고리 분류 (주문/배송/환불/기타)",
          "자동 응대 AI 학습 (RAG 기반)",
          "IVR 시스템 연동 설계",
          "자동 응대 시나리오 20건 테스트",
        ],
        milestone: "반복 문의 60% 자동 처리 가능",
        checkpoint: "테스트 통화 20건 → 12건 이상 AI 자동 해결",
      },
      {
        week: 3,
        title: "실시간 상담원 지원 AI",
        description: "상담 중 실시간으로 정보를 제공하는 상담원 보조 AI를 만듭니다",
        templateIds: ["audio-callcenter-analysis", "text-cs-ecommerce"],
        tasks: [
          "실시간 STT + 키워드 감지",
          "고객 발화 기반 관련 정보 자동 팝업",
          "감정 분석 (불만 감지 → 관리자 알림)",
          "상담 스크립트 자동 추천",
          "상담원 화면 UI 설계",
        ],
        milestone: "실시간 상담원 보조 시스템 프로토타입",
        checkpoint: "시뮬레이션 통화 5건 → 관련 정보 자동 표시 + 불만 감지 정확",
      },
      {
        week: 4,
        title: "통화 요약 + 분석 대시보드",
        description: "모든 통화를 자동 요약하고 인사이트를 제공합니다",
        templateIds: ["audio-meeting-summary"],
        tasks: [
          "통화 종료 시 자동 요약 생성",
          "고객별 상담 히스토리 누적",
          "일별/주별 상담 통계 대시보드",
          "불만 키워드 트렌드 분석",
          "상담 품질 점수 자동 산출",
        ],
        milestone: "자동 요약 + 분석 대시보드 완성",
        checkpoint: "통화 10건 자동 요약 품질 확인 + 대시보드 데이터 정합성",
      },
      {
        week: 5,
        title: "파일럿 운영 + 튜닝",
        description: "실제 콜센터 5석에서 파일럿 운영합니다",
        templateIds: ["audio-callcenter-analysis", "text-cs-ecommerce"],
        tasks: [
          "파일럿 상담원 5명 교육",
          "실제 통화에 AI 적용 (보조 모드)",
          "상담원 피드백 수집",
          "오탐/미탐 사례 분석 → 재학습",
          "KPI 비교 (AI 적용 전 vs 후)",
        ],
        milestone: "파일럿 KPI 개선 확인",
        checkpoint: "2주 파일럿 → 평균 처리 시간 20% 감소 또는 고객 만족도 10% 향상",
      },
      {
        week: 6,
        title: "전체 확대 + 안정화",
        description: "전체 콜센터로 확대 적용하고 안정화합니다",
        templateIds: [],
        tasks: [
          "전체 상담원 교육",
          "점진적 확대 (5석→10석→전체)",
          "장애 대응 프로세스 수립",
          "성과 리포트 작성 (경영진 보고)",
          "운영 매뉴얼 + SOP 문서화",
        ],
        milestone: "콜센터 AI 전환 완료",
        checkpoint: "전체 적용 1주 → 안정 운영 + KPI 목표 달성",
      },
    ],
    businessPlan: {
      problem: "콜센터 인건비 상승 + 상담원 이직율 높음 + 야간/주말 운영 비용. 반복 문의가 전체 60%.",
      solution: "반복 문의 AI 자동 처리 + 상담원 실시간 보조 → 처리량 40% 증가, 상담 품질 향상.",
      revenueModel: "프로 ₩50,000/월/센터 + 좌석당 ₩10,000/월 + 구축 컨설팅 ₩500만 (1회)",
      marketSize: "국내 콜센터 약 5,000개 × ₩60만/년 = TAM ₩300억/년",
      breakEven: "기업 고객 30개 확보 시 (월 매출 ₩1,500만 + 컨설팅). 약 6개월.",
      gtmStrategy: "대형 이커머스 1곳 성공 사례 → KCCM(한국콜센터산업협회) 세미나 발표 → B2B 영업",
      perspectives: {
        owner: "상담원 10명 → 7명으로 같은 처리량, 야간 AI 무인 운영으로 비용 절감",
        customer: "대기 시간 50% 감소, 상담 품질 일관성 향상",
        competitor: "AI 미도입 콜센터 대비 처리 효율 40% 격차",
      },
    },
    requiredTools: [
      { name: "STT API (Whisper/Clova)", cost: "월 ~₩50,000", purpose: "음성→텍스트 변환" },
      { name: "AI Trainer Hub 프로", cost: "₩50,000/월", purpose: "AI 학습·배포" },
      { name: "콜센터 PBX 연동", cost: "기존 장비 활용", purpose: "통화 데이터 수집" },
    ],
    successMetrics: [
      { metric: "반복 문의 자동 처리율", target: "60% 이상" },
      { metric: "평균 처리 시간 감소", target: "20% 이상" },
      { metric: "고객 만족도", target: "10% 향상" },
      { metric: "연간 인건비 절감", target: "₩3,600만 (10석)" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  8. 법률 AI 어시스턴트 세트 (일반인/전문가)                           */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-legal-ai",
    name: "법률 AI 어시스턴트",
    subtitle: "계약서 검토 + 법률 상담 + 문서 자동 생성",
    description: "법률 사무소 또는 기업 법무팀을 위한 AI. 계약서를 자동 검토하고, 기본 법률 상담을 처리하며, 표준 계약서를 자동 생성합니다.",
    icon: "Scale",
    illustration: "/images/workflows/legal.svg",
    gradient: "from-indigo-600 to-blue-800",
    audience: "general",
    difficulty: "advanced",
    estimatedWeeks: 6,
    templateIds: ["text-cs-legal", "text-workflow-report", "text-content-product"],
    tags: ["법률", "계약서", "법무", "리걸테크", "문서자동화"],
    pricing: {
      monthlyCost: "₩50,000 (프로 플랜)",
      toolsCost: "AI API 월 ~₩20,000",
      expectedROI: "계약서 검토 시간 80% 절감 → 변호사 시간당 ₩30만 환산 시 월 ₩600만 절약",
    },
    phases: [
      {
        week: 1,
        title: "법률 도메인 지식 학습",
        description: "계약서 유형별 검토 포인트와 법률 FAQ를 학습시킵니다",
        templateIds: ["text-cs-legal"],
        tasks: [
          "주요 계약서 유형 10종 수집 (근로, 임대, NDA, 용역 등)",
          "각 유형별 필수 조항 체크리스트 작성",
          "독소 조항 패턴 100개 정리",
          "법률 FAQ 200건 작성 (민사/상사/노동)",
          "면책 조항 명확히 설정 (법률 자문 아닌 정보 제공)",
        ],
        milestone: "법률 기본 상담 AI 동작",
        checkpoint: "법률 시나리오 20건 → 정확한 정보 제공 16건 + 면책 표시 확인",
      },
      {
        week: 2,
        title: "계약서 자동 검토 시스템",
        description: "업로드된 계약서를 자동으로 검토하고 위험 조항을 표시합니다",
        templateIds: ["text-cs-legal", "text-workflow-report"],
        tasks: [
          "계약서 파싱 파이프라인 (PDF → 텍스트 추출)",
          "조항별 분석 로직 구현",
          "위험도 점수 산출 (상/중/하)",
          "검토 보고서 자동 생성",
          "기존 계약서 10건 검토 테스트",
        ],
        milestone: "계약서 자동 검토 + 보고서 생성 완료",
        checkpoint: "변호사가 수동 검토한 결과와 AI 검토 결과 비교 → 80% 이상 일치",
      },
      {
        week: 3,
        title: "표준 계약서 자동 생성",
        description: "조건 입력만으로 표준 계약서를 자동 생성합니다",
        templateIds: ["text-content-product"],
        tasks: [
          "계약서 유형별 템플릿 작성",
          "변수 입력 폼 설계 (당사자, 금액, 기간 등)",
          "조건부 조항 삽입 로직",
          "생성된 계약서 법적 검증",
          "Word/PDF 내보내기 기능",
        ],
        milestone: "계약서 자동 생성 5종 완성",
        checkpoint: "각 유형 1건씩 생성 → 법적 유효성 검토 통과",
      },
      {
        week: 4,
        title: "판례 검색 + 인용 시스템",
        description: "관련 판례를 자동 검색하고 상담 시 근거로 인용합니다",
        templateIds: ["text-cs-legal"],
        tasks: [
          "대법원 판례 데이터 연동 (API 또는 크롤링)",
          "판례 벡터화 + 유사도 검색",
          "상담 시 관련 판례 자동 인용",
          "판례 요약 자동 생성",
          "정확도 검증 (법률 전문가 확인)",
        ],
        milestone: "판례 기반 근거 제시 시스템 가동",
        checkpoint: "법률 질문 10건 → 관련 판례 적절히 인용 8건 이상",
      },
      {
        week: 5,
        title: "고객 포털 + 사건 관리",
        description: "의뢰인용 포털에서 사건 진행 상황을 관리합니다",
        templateIds: ["text-workflow-report"],
        tasks: [
          "의뢰인 로그인 포털 구축",
          "사건별 타임라인 + 문서 관리",
          "자동 진행 상황 알림",
          "상담 예약 시스템 연동",
          "보안 강화 (데이터 암호화, 접근 권한)",
        ],
        milestone: "의뢰인 포털 MVP 완성",
        checkpoint: "테스트 사건 3건 등록 → 타임라인 + 문서 + 알림 정상 동작",
      },
      {
        week: 6,
        title: "파일럿 + 피드백 + 안정화",
        description: "실제 업무에 적용하고 안정화합니다",
        templateIds: [],
        tasks: [
          "변호사/법무팀 5명 파일럿",
          "실제 계약서 검토에 AI 보조 적용",
          "정확도 모니터링 + 피드백 반영",
          "법적 리스크 리뷰 (면책 조항 재확인)",
          "운영 매뉴얼 + 교육 자료 작성",
        ],
        milestone: "법률 AI 시스템 정식 가동",
        checkpoint: "2주 파일럿 → 계약서 검토 시간 80% 절감 확인",
      },
    ],
    businessPlan: {
      problem: "계약서 검토에 변호사 시간 대량 소모. 소규모 사무소는 인력 부족, 기업은 법무팀 과부하.",
      solution: "AI가 계약서 1차 검토(5분) + 표준 문서 자동 생성 + 판례 기반 상담으로 법률 업무 생산성 3배.",
      revenueModel: "프로 ₩50,000/월 + 계약서 생성 건당 ₩1,000 (50건 포함)",
      marketSize: "법률 사무소 2.5만개 + 기업 법무팀 1만개 × ₩60만/년 = TAM ₩210억/년",
      breakEven: "기업 고객 50개 + 사무소 100개 (월 매출 ₩750만). 약 5개월.",
      gtmStrategy: "대형 로펌 1곳 파일럿 성공 → 법조인 컨퍼런스 발표 → 리걸테크 커뮤니티 마케팅",
      perspectives: {
        owner: "계약서 검토 시간 80% 절감 → 더 많은 의뢰 수임 가능",
        customer: "빠른 계약서 검토, 투명한 비용, 24시간 기본 상담",
        competitor: "AI 미도입 사무소 대비 계약서 처리 속도 5배",
      },
    },
    requiredTools: [
      { name: "AI Trainer Hub 프로", cost: "₩50,000/월", purpose: "AI 학습·배포" },
      { name: "대법원 판례 API", cost: "무료", purpose: "판례 검색" },
      { name: "PDF 파서", cost: "무료 (오픈소스)", purpose: "계약서 텍스트 추출" },
    ],
    successMetrics: [
      { metric: "계약서 검토 시간 절감", target: "80%" },
      { metric: "위험 조항 탐지율", target: "95% 이상" },
      { metric: "표준 계약서 생성 시간", target: "5분 이내" },
      { metric: "판례 인용 적합률", target: "80% 이상" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  9. 의료 AI 상담 세트 (전문가)                                      */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-medical-ai",
    name: "병원 AI 상담 세트",
    subtitle: "환자 문의 자동 응대 + 예약 + 사후 관리",
    description: "병원·의원을 위한 AI. 진료 안내, 예약 관리, 수술 후 관리 안내를 자동화합니다. 의료법 준수 면책 조항 내장. 환자 만족도 향상 + 행정 업무 50% 절감.",
    icon: "Stethoscope",
    illustration: "/images/workflows/medical.svg",
    gradient: "from-cyan-500 to-blue-600",
    audience: "self-employed",
    difficulty: "intermediate",
    estimatedWeeks: 5,
    templateIds: ["text-cs-medical", "text-content-sns", "audio-meeting-summary"],
    tags: ["병원", "의원", "환자상담", "예약", "의료AI"],
    pricing: {
      monthlyCost: "₩50,000 (프로 플랜)",
      toolsCost: "카카오채널 무료 + AI API 월 ~₩20,000",
      expectedROI: "행정 인력 50% 절감 + 노쇼율 30% 감소 → 월 ₩200만 효과",
    },
    phases: [
      {
        week: 1,
        title: "진료 안내 + FAQ 학습",
        description: "진료과목, 의료진, 비용, FAQ를 AI에 학습시킵니다",
        templateIds: ["text-cs-medical"],
        tasks: [
          "진료과목별 안내 정보 입력",
          "의료진 프로필 + 전문 분야 등록",
          "비급여 항목 가격표 입력",
          "환자 FAQ 100건 작성",
          "의료법 면책 조항 필수 삽입 ('의료 자문이 아닌 안내입니다')",
        ],
        milestone: "진료 안내 자동 응대 가동",
        checkpoint: "환자 시나리오 20건 → 정확한 안내 16건 + 면책 조항 표시 확인",
      },
      {
        week: 2,
        title: "예약 시스템 자동화",
        description: "카카오채널로 진료 예약을 자동으로 받습니다",
        templateIds: ["text-cs-medical"],
        tasks: [
          "카카오 비즈니스 채널 연동",
          "진료과/의사별 예약 슬롯 설정",
          "예약 확인/변경/취소 자동 처리",
          "예약 24시간 전 리마인더 자동 발송",
          "노쇼 방지 연속 부재 알림",
        ],
        milestone: "자동 예약 시스템 가동 + 노쇼 알림",
        checkpoint: "테스트 예약 10건 → 예약/변경/취소 모두 정상 + 리마인더 발송 확인",
      },
      {
        week: 3,
        title: "수술·시술 후 관리 안내",
        description: "시술별 사후 관리 안내를 자동으로 제공합니다",
        templateIds: ["text-cs-medical"],
        tasks: [
          "주요 시술별 사후 관리 가이드 작성",
          "시술 후 D+1/3/7/14일 자동 안내 메시지",
          "이상 증상 감지 시 즉시 내원 안내",
          "복약 리마인더 자동 발송",
          "환자 만족도 자동 설문",
        ],
        milestone: "사후 관리 자동 안내 시스템",
        checkpoint: "테스트 환자 5명 → D+1~14 메시지 정상 발송 + 이상 증상 알림 동작",
      },
      {
        week: 4,
        title: "마케팅 콘텐츠 + 리뷰 관리",
        description: "건강 정보 콘텐츠와 리뷰 답글을 자동 생성합니다",
        templateIds: ["text-content-sns"],
        tasks: [
          "진료과목별 건강 정보 콘텐츠 생성",
          "블로그/인스타 자동 포스팅",
          "네이버/카카오맵 리뷰 자동 답글",
          "신환 유입 경로 분석",
          "월간 마케팅 성과 리포트",
        ],
        milestone: "건강 콘텐츠 + 리뷰 관리 자동화",
        checkpoint: "주 3건 콘텐츠 자동 생성 + 리뷰 답글 자동 완료",
      },
      {
        week: 5,
        title: "통합 대시보드 + 안정화",
        description: "예약·상담·마케팅 데이터를 통합 관리합니다",
        templateIds: ["audio-meeting-summary"],
        tasks: [
          "진료 통계 대시보드 (예약률, 노쇼율, 만족도)",
          "상담 내용 자동 요약 (차트 기록 보조)",
          "환자 DB 관리 + 재진 알림",
          "전체 워크플로우 1주 무인 운영 테스트",
          "직원 교육 + 매뉴얼 작성",
        ],
        milestone: "병원 AI 운영 시스템 완성",
        checkpoint: "1주 운영 → 예약·상담·콘텐츠·리뷰 모두 자동 정상 동작",
      },
    ],
    businessPlan: {
      problem: "병원 전화 예약 → 통화 대기 → 환자 이탈. 행정 업무 과부하로 의료진 진료 집중 어려움.",
      solution: "AI가 예약·문의·사후관리·마케팅 자동화 → 의료진은 진료에만 집중.",
      revenueModel: "프로 ₩50,000/월 + 환자 메시지 발송 건당 ₩10 (1,000건 포함)",
      marketSize: "국내 의원 약 7만개 × 5% × ₩60만/년 = TAM ₩210억/년",
      breakEven: "병원 고객 80개 확보 시 (월 매출 ₩400만). 약 5개월.",
      gtmStrategy: "피부과/성형외과 타겟 (마케팅 니즈 높음) → 의료 IT 전시회 → 의사 커뮤니티 입소문",
      perspectives: {
        owner: "행정 업무 50% 절감, 노쇼율 30% 감소 → 월 200만원 효과",
        customer: "대기 없는 즉시 예약, 시술 후 맞춤 관리 → 만족도 향상",
        competitor: "24시간 예약 + 사후 관리 자동화 = 환자 경험 차별화",
      },
    },
    requiredTools: [
      { name: "카카오 비즈니스 채널", cost: "무료", purpose: "환자 소통" },
      { name: "AI Trainer Hub 프로", cost: "₩50,000/월", purpose: "AI 학습·배포" },
      { name: "EMR 연동 (선택)", cost: "별도 협의", purpose: "환자 데이터 연동" },
    ],
    successMetrics: [
      { metric: "문의 자동 응대율", target: "80% 이상" },
      { metric: "노쇼율 감소", target: "30%" },
      { metric: "환자 만족도", target: "4.5/5.0" },
      { metric: "행정 업무 절감", target: "50%" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  10. SNS 마케팅 자동화 세트 (일반인)                                 */
  /* ──────────────────────────────────────────────────────────────── */
  {
    id: "wf-sns-marketing",
    name: "SNS 마케팅 자동화",
    subtitle: "콘텐츠 생성 + 예약 발행 + 성과 분석 AI",
    description: "인스타그램, 블로그, 유튜브 콘텐츠를 AI가 자동 생성하고 예약 발행합니다. 트렌드 분석 → 콘텐츠 기획 → 작성 → 발행 → 성과 분석 전 과정 자동화.",
    icon: "Share2",
    illustration: "/images/workflows/sns-marketing.svg",
    gradient: "from-pink-500 to-rose-600",
    audience: "general",
    difficulty: "beginner",
    estimatedWeeks: 3,
    templateIds: ["text-content-sns", "text-content-product", "image-gen-product-photo"],
    tags: ["SNS", "마케팅", "콘텐츠", "인스타그램", "블로그"],
    pricing: {
      monthlyCost: "₩25,000 (스타터 플랜)",
      toolsCost: "AI API 월 ~₩10,000 + 이미지 생성 월 ~₩5,000",
      expectedROI: "콘텐츠 제작 시간 주 10시간 → 1시간, 팔로워 증가 속도 3배",
    },
    phases: [
      {
        week: 1,
        title: "콘텐츠 전략 수립 + AI 학습",
        description: "브랜드 톤·타겟·키워드를 설정하고 AI에 학습시킵니다",
        templateIds: ["text-content-sns"],
        tasks: [
          "브랜드 아이덴티티 정의 (톤, 페르소나, 금지어)",
          "타겟 고객 페르소나 3개 작성",
          "경쟁 계정 5개 분석 (콘텐츠 유형, 빈도, 반응)",
          "월간 콘텐츠 캘린더 AI 자동 생성",
          "키워드/해시태그 리스트 100개 준비",
        ],
        milestone: "콘텐츠 전략 + 월간 캘린더 완성",
        checkpoint: "월간 캘린더 30일치 + 콘텐츠 유형별 비율 확인",
      },
      {
        week: 2,
        title: "콘텐츠 자동 생성 + 이미지",
        description: "텍스트와 이미지 콘텐츠를 AI가 자동 생성합니다",
        templateIds: ["text-content-sns", "text-content-product", "image-gen-product-photo"],
        tasks: [
          "인스타 캡션 자동 생성 (해시태그 포함)",
          "블로그 포스트 자동 작성 (SEO 최적화)",
          "상품 사진 → AI 배경 합성/보정",
          "영상 스크립트 자동 작성 (유튜브 쇼츠)",
          "콘텐츠 20개 사전 생성 + 품질 검수",
        ],
        milestone: "2주치 콘텐츠 사전 생성 완료",
        checkpoint: "인스타 10개 + 블로그 5개 + 쇼츠 5개 = 총 20개 준비",
      },
      {
        week: 3,
        title: "예약 발행 + 성과 분석 자동화",
        description: "콘텐츠를 예약 발행하고 성과를 자동 분석합니다",
        templateIds: ["text-content-sns"],
        tasks: [
          "예약 발행 도구 연동 (Buffer/Later)",
          "최적 발행 시간 AI 분석",
          "성과 자동 수집 (좋아요, 댓글, 저장, 도달)",
          "주간 성과 리포트 자동 생성",
          "성과 기반 콘텐츠 전략 자동 조정",
        ],
        milestone: "콘텐츠 → 발행 → 분석 전 과정 자동화",
        checkpoint: "1주 자동 발행 → 예약 정상 + 성과 리포트 자동 생성 확인",
      },
    ],
    businessPlan: {
      problem: "SNS 마케팅에 주 10시간+ 소모. 콘텐츠 아이디어 고갈 + 일관성 유지 어려움 + 성과 분석 수작업.",
      solution: "AI가 콘텐츠 기획→생성→발행→분석 전 과정 자동화. 주 10시간 → 1시간으로 절감.",
      revenueModel: "스타터 ₩25,000/월 + 이미지 생성 크레딧 추가 구매 가능",
      marketSize: "SNS 마케팅 필요 사업자 약 50만명 × 10% × ₩25,000 = TAM ₩125억/년",
      breakEven: "고객 300명 (월 매출 ₩750만). 약 3개월.",
      gtmStrategy: "'인스타 자동화 3주 챌린지' 무료 이벤트 → 성과 인증 바이럴 → SNS 마케팅 커뮤니티 확산",
      perspectives: {
        owner: "콘텐츠 제작 시간 90% 절감, 일관된 브랜딩 유지",
        customer: "더 많은 유용한 콘텐츠를 일관되게 접함 → 브랜드 신뢰도 향상",
        competitor: "수동 운영 계정 대비 발행 빈도 3배, 데이터 기반 최적화",
      },
    },
    requiredTools: [
      { name: "AI Trainer Hub 스타터", cost: "₩25,000/월", purpose: "콘텐츠 AI 생성" },
      { name: "Buffer 또는 Later", cost: "무료~₩15,000/월", purpose: "예약 발행" },
      { name: "Canva (선택)", cost: "무료", purpose: "이미지 편집" },
    ],
    successMetrics: [
      { metric: "콘텐츠 제작 시간", target: "주 10시간 → 1시간" },
      { metric: "월 콘텐츠 발행 수", target: "30건 이상" },
      { metric: "팔로워 증가 속도", target: "기존 대비 3배" },
      { metric: "인게이지먼트율", target: "5% 이상" },
    ],
  },
];

/* ================================================================== */
/*  헬퍼 함수                                                           */
/* ================================================================== */

const AUDIENCE_LABELS: Record<TargetAudience, string> = {
  "self-employed": "자영업자",
  enterprise: "기업",
  student: "학생",
  general: "일반인",
};

const DIFFICULTY_LABELS: Record<WorkflowDifficulty, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export function getAudienceLabel(audience: TargetAudience): string {
  return AUDIENCE_LABELS[audience];
}

export function getDifficultyLabel(difficulty: WorkflowDifficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}

export function getWorkflowById(id: string): WorkflowSet | undefined {
  return WORKFLOW_SETS.find((w) => w.id === id);
}

export function getWorkflowsByAudience(audience: TargetAudience): WorkflowSet[] {
  return WORKFLOW_SETS.filter((w) => w.audience === audience);
}

export function searchWorkflows(query: string): WorkflowSet[] {
  const q = query.toLowerCase();
  return WORKFLOW_SETS.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.tags.some((t) => t.toLowerCase().includes(q))
  );
}
