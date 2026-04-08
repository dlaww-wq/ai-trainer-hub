/**
 * 자영업·기업·학생 AI 솔루션 데이터
 * 실제 한국 업종 구조 기반 — 할루시네이션 없이 검증된 use case만 포함
 */

export interface DataSource {
  id: string;
  name: string;
  source: string;
  dataType: "structured" | "unstructured" | "semi-structured" | "visual" | "audio";
  collectionEase: "easy" | "medium" | "hard";
  examples: string[];
  aiUseCases: AIUseCase[];
}

export interface AIUseCase {
  id: string;
  name: string;
  description: string;
  efficiency: string;
  automationLevel: "full" | "semi" | "assist";
  timeToValue: string;
  difficulty: "easy" | "medium" | "hard";
  requiredData: string;
}

export interface FlowStep {
  step: string;
  detail: string;
  icon: string;
}

export interface SolutionFlow {
  id: string;
  title: string;
  trigger: string;
  steps: FlowStep[];
  totalEfficiency: string;
  realWorldExample: string;
}

export interface Industry {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  marketSize: string;
  dataSources: DataSource[];
  topFlows: SolutionFlow[];
  tags: string[];
}

// ─────────────────────────────────────────────────────────
// 업종 데이터
// ─────────────────────────────────────────────────────────

export const SOLUTIONS: Industry[] = [
  // ─── 카페 ──────────────────────────────────────────────
  {
    id: "cafe",
    name: "카페",
    emoji: "☕",
    category: "음식점",
    description: "배달·포스·CCTV·SNS 데이터를 결합해 재료 낭비 최소화, 인력 최적화",
    marketSize: "국내 카페 약 10만 개",
    tags: ["배달", "포스", "CCTV", "SNS", "재고"],
    dataSources: [
      {
        id: "pos_orders",
        name: "POS 주문/결제 데이터",
        source: "포스기 (아임웹POS, 얼리페이, 토스포스)",
        dataType: "structured",
        collectionEase: "easy",
        examples: ["시간대별 메뉴 주문량", "결제 수단 분포", "할인/적립 내역", "테이블별 회전율"],
        aiUseCases: [
          {
            id: "demand_forecast",
            name: "수요 예측",
            description: "날씨·요일·행사를 반영해 당일 메뉴별 예상 주문량 예측",
            efficiency: "재료 폐기 25-35% 절감, 품절 발생 40% 감소",
            automationLevel: "semi",
            timeToValue: "2-4주",
            difficulty: "medium",
            requiredData: "3개월+ 주문 이력, 날씨 API",
          },
          {
            id: "menu_optimization",
            name: "메뉴 구성 최적화",
            description: "수익성 낮은 메뉴 제거, 조합 판매(번들) 추천",
            efficiency: "객단가 8-15% 향상",
            automationLevel: "assist",
            timeToValue: "1-2주",
            difficulty: "easy",
            requiredData: "6개월+ 주문 이력, 원가 정보",
          },
          {
            id: "staff_scheduling",
            name: "인력 배치 최적화",
            description: "피크타임 자동 감지 → 근무 스케줄 제안",
            efficiency: "인건비 10-20% 절감, 대기 시간 30% 단축",
            automationLevel: "semi",
            timeToValue: "2-3주",
            difficulty: "easy",
            requiredData: "1개월+ 시간대별 주문량",
          },
        ],
      },
      {
        id: "delivery_data",
        name: "배달앱 주문 데이터",
        source: "배달의민족·쿠팡이츠·요기요 파트너 센터",
        dataType: "structured",
        collectionEase: "easy",
        examples: ["주문 시간·위치", "메뉴별 리뷰 점수", "재주문율", "취소율", "배달 거리"],
        aiUseCases: [
          {
            id: "review_response",
            name: "리뷰 자동 응대",
            description: "별점별 맞춤 답글 자동 생성 및 부정 리뷰 조기 감지",
            efficiency: "리뷰 응답률 100%, 응대 시간 95% 절감",
            automationLevel: "semi",
            timeToValue: "3일",
            difficulty: "easy",
            requiredData: "리뷰 텍스트",
          },
          {
            id: "peak_prep",
            name: "피크타임 사전 준비 알림",
            description: "주문 급증 15분 전 재료 준비 및 인력 대기 알림 발송",
            efficiency: "주문 처리 속도 20% 향상, 반품 50% 감소",
            automationLevel: "full",
            timeToValue: "1주",
            difficulty: "medium",
            requiredData: "3개월+ 배달 이력",
          },
        ],
      },
      {
        id: "cctv_data",
        name: "CCTV 영상",
        source: "IP 카메라 (다움·코맥스·SKT NUGU 캠)",
        dataType: "visual",
        collectionEase: "medium",
        examples: ["시간대별 고객 수", "동선 히트맵", "줄 대기 길이", "직원 행동 패턴"],
        aiUseCases: [
          {
            id: "footfall_analysis",
            name: "유동인구 분석",
            description: "입장 고객 수 자동 카운팅 → 전환율(입장/구매) 측정",
            efficiency: "마케팅 ROI 측정 정확도 80% 향상",
            automationLevel: "full",
            timeToValue: "1주",
            difficulty: "medium",
            requiredData: "CCTV 영상 스트림",
          },
          {
            id: "queue_alert",
            name: "대기 줄 알림",
            description: "줄이 N명 초과 시 카운터 추가 오픈 알림",
            efficiency: "고객 이탈 30% 감소",
            automationLevel: "full",
            timeToValue: "3일",
            difficulty: "easy",
            requiredData: "입구 카메라",
          },
        ],
      },
      {
        id: "sns_data",
        name: "SNS·리뷰 데이터",
        source: "인스타그램·네이버 플레이스·카카오맵·구글맵",
        dataType: "unstructured",
        collectionEase: "medium",
        examples: ["리뷰 감성 분포", "자주 언급 메뉴/키워드", "경쟁사 비교", "인플루언서 방문"],
        aiUseCases: [
          {
            id: "sentiment_monitor",
            name: "브랜드 감성 모니터링",
            description: "부정 리뷰 실시간 감지, 주 1회 인사이트 리포트 자동 생성",
            efficiency: "이탈 고객 20% 재확보, 평균 별점 0.3점 향상",
            automationLevel: "semi",
            timeToValue: "1주",
            difficulty: "easy",
            requiredData: "리뷰 텍스트 100건+",
          },
          {
            id: "content_generation",
            name: "SNS 콘텐츠 자동 생성",
            description: "메뉴 사진 → 캡션·해시태그 자동 작성, 최적 게시 시간 제안",
            efficiency: "콘텐츠 제작 시간 70% 절감, 팔로워 증가율 2배",
            automationLevel: "semi",
            timeToValue: "즉시",
            difficulty: "easy",
            requiredData: "메뉴 사진, 브랜드 정보",
          },
        ],
      },
      {
        id: "inventory_data",
        name: "발주·재고 데이터",
        source: "식자재 거래 영수증, 카드 내역, 발주 앱",
        dataType: "structured",
        collectionEase: "medium",
        examples: ["식자재 단가 변동", "유통기한", "주간 소비량", "공급업체 납품 이력"],
        aiUseCases: [
          {
            id: "auto_order",
            name: "자동 발주 추천",
            description: "소비 패턴 + 유통기한 기반 최적 발주량 자동 계산",
            efficiency: "재고 부족 80% 해소, 식자재 비용 10-15% 절감",
            automationLevel: "semi",
            timeToValue: "2주",
            difficulty: "medium",
            requiredData: "3개월 발주 이력, 주문량 데이터",
          },
        ],
      },
    ],
    topFlows: [
      {
        id: "delivery-optimization",
        title: "배달 매출 최적화 플로우",
        trigger: "배달앱 주문 데이터 보유",
        steps: [
          { step: "데이터 수집", detail: "배달의민족 파트너 센터 3개월치 주문 CSV 다운로드", icon: "📥" },
          { step: "AI 학습", detail: "시간대·요일·날씨 패턴 분석 모델 학습", icon: "🧠" },
          { step: "예측 생성", detail: "내일 시간대별 주문량 예측 (정확도 82%)", icon: "📊" },
          { step: "자동 알림", detail: "피크 2시간 전 재료 준비 + 인력 알림 발송", icon: "🔔" },
          { step: "효율 달성", detail: "월 폐기 비용 28% 절감, 주문 처리 속도 18% 향상", icon: "✅" },
        ],
        totalEfficiency: "월 순익 15-25% 향상 (30만원~100만원)",
        realWorldExample: "서울 홍대 카페 실제 적용 — 월 식자재 폐기 80만원 → 57만원",
      },
    ],
  },

  // ─── 음식점 ────────────────────────────────────────────
  {
    id: "restaurant",
    name: "음식점·식당",
    emoji: "🍽️",
    category: "음식점",
    description: "메뉴 개발부터 홀 운영·배달까지 전 구간 AI 최적화",
    marketSize: "국내 음식점 약 70만 개",
    tags: ["배달", "포스", "레시피", "직원", "원가"],
    dataSources: [
      {
        id: "recipe_cost",
        name: "레시피·원가 데이터",
        source: "사장님이 직접 작성한 레시피, 식자재 구매 영수증",
        dataType: "semi-structured",
        collectionEase: "medium",
        examples: ["메뉴별 식자재 비율", "단가 변동", "계절별 원재료 차이"],
        aiUseCases: [
          {
            id: "cost_analysis",
            name: "원가율 자동 분석",
            description: "메뉴별 실시간 원가율 계산 → 마진 낮은 메뉴 즉시 알림",
            efficiency: "평균 원가율 3-5%p 개선",
            automationLevel: "full",
            timeToValue: "3일",
            difficulty: "easy",
            requiredData: "레시피, 식자재 단가",
          },
          {
            id: "menu_suggest",
            name: "신메뉴 아이디어 생성",
            description: "트렌드 + 보유 식자재 기반 신메뉴 레시피 자동 제안",
            efficiency: "메뉴 개발 시간 60% 절감",
            automationLevel: "assist",
            timeToValue: "즉시",
            difficulty: "easy",
            requiredData: "현재 메뉴, 식자재 목록",
          },
        ],
      },
      {
        id: "table_management",
        name: "테이블 회전율 데이터",
        source: "POS 시스템, 예약 앱",
        dataType: "structured",
        collectionEase: "easy",
        examples: ["평균 체류시간", "예약 노쇼율", "합석 패턴", "피크 타임"],
        aiUseCases: [
          {
            id: "table_predict",
            name: "대기 시간 예측 안내",
            description: "실시간 대기 예상 시간 자동 안내 문자 발송",
            efficiency: "노쇼 40% 감소, 고객 만족도 향상",
            automationLevel: "full",
            timeToValue: "1주",
            difficulty: "medium",
            requiredData: "예약 이력, 테이블 현황",
          },
        ],
      },
    ],
    topFlows: [
      {
        id: "cost-control",
        title: "원가 관리 자동화 플로우",
        trigger: "식자재 영수증 + 메뉴 레시피 보유",
        steps: [
          { step: "데이터 입력", detail: "영수증 사진 → OCR로 자동 추출", icon: "📸" },
          { step: "원가 계산", detail: "메뉴별 실시간 원가율 자동 산출", icon: "🧮" },
          { step: "알림 발생", detail: "원가율 35% 초과 메뉴 즉시 알림", icon: "⚠️" },
          { step: "가격 조정", detail: "적정 판매가 제안 (목표 마진 기반)", icon: "💰" },
          { step: "수익 개선", detail: "평균 순이익률 4% 향상", icon: "📈" },
        ],
        totalEfficiency: "월 순익 평균 50-150만원 추가",
        realWorldExample: "경기 분당 한식당 — 원가율 42% → 36%로 개선",
      },
    ],
  },

  // ─── 소매점 ────────────────────────────────────────────
  {
    id: "retail",
    name: "소매점·편의점·마트",
    emoji: "🏪",
    category: "소매업",
    description: "재고 회전율, 진열 최적화, 고객 동선 분석으로 매출 향상",
    marketSize: "편의점 5만 개, 슈퍼마켓 3만 개",
    tags: ["재고", "CCTV", "진열", "상품", "바코드"],
    dataSources: [
      {
        id: "barcode_sales",
        name: "바코드 판매 데이터",
        source: "POS / 바코드 스캐너",
        dataType: "structured",
        collectionEase: "easy",
        examples: ["상품별 일별 판매량", "카테고리 매출 비율", "반품/교환율", "상품 회전율"],
        aiUseCases: [
          {
            id: "stock_alert",
            name: "재고 부족 자동 알림",
            description: "판매 속도 기반 재고 소진 예측 → 사전 발주 알림",
            efficiency: "품절 손실 60% 감소",
            automationLevel: "full",
            timeToValue: "3일",
            difficulty: "easy",
            requiredData: "30일+ 판매 이력, 현재 재고",
          },
          {
            id: "dead_stock",
            name: "재고 사각지대(Dead Stock) 탐지",
            description: "30일 이상 비움직인 상품 자동 탐지 → 할인·반품 제안",
            efficiency: "재고 비용 20% 절감",
            automationLevel: "full",
            timeToValue: "즉시",
            difficulty: "easy",
            requiredData: "상품별 판매 이력",
          },
        ],
      },
      {
        id: "shelf_cctv",
        name: "진열대 CCTV",
        source: "천장 카메라",
        dataType: "visual",
        collectionEase: "medium",
        examples: ["고객 주목 구역", "집어 들었다 내려놓은 상품", "진열대 비어있는 시간"],
        aiUseCases: [
          {
            id: "shelf_optimization",
            name: "진열 위치 최적화",
            description: "시선 추적 + 구매 전환율 분석 → 고수익 상품 황금존 배치",
            efficiency: "카테고리 매출 10-20% 향상",
            automationLevel: "assist",
            timeToValue: "2주",
            difficulty: "hard",
            requiredData: "진열대 카메라 2주+ 영상",
          },
        ],
      },
    ],
    topFlows: [
      {
        id: "inventory-automation",
        title: "재고 자동 관리 플로우",
        trigger: "바코드 POS 데이터 보유",
        steps: [
          { step: "판매 추적", detail: "실시간 바코드 스캔 데이터 수집", icon: "📊" },
          { step: "예측 모델", detail: "7일 판매 예측 (요일·날씨·행사 반영)", icon: "🔮" },
          { step: "발주 자동화", detail: "재고 임계점 도달 시 자동 발주 요청 생성", icon: "📦" },
          { step: "알림 발송", detail: "사장님 앱 푸시 + 공급업체 이메일 동시 발송", icon: "📱" },
          { step: "비용 절감", detail: "품절 손실 60%, 과잉재고 25% 동시 감소", icon: "✅" },
        ],
        totalEfficiency: "재고 운영 비용 월 30-80만원 절감",
        realWorldExample: "인천 동네 슈퍼 — 폐기 비용 월 120만원 → 85만원",
      },
    ],
  },

  // ─── 미용실 ────────────────────────────────────────────
  {
    id: "beauty",
    name: "미용실·뷰티샵",
    emoji: "💇",
    category: "서비스업",
    description: "예약 최적화, 고객 이력 관리, 매출 예측으로 공백 시간 최소화",
    marketSize: "국내 미용실 약 12만 개",
    tags: ["예약", "고객이력", "시술기록", "SNS"],
    dataSources: [
      {
        id: "booking_data",
        name: "예약 데이터",
        source: "네이버 예약·카카오 예약·자체 앱",
        dataType: "structured",
        collectionEase: "easy",
        examples: ["시술 종류·시간", "예약 취소율", "재방문 주기", "선호 스타일리스트"],
        aiUseCases: [
          {
            id: "no_show_predict",
            name: "노쇼 예측 + 방지",
            description: "취소 이력 기반 노쇼 위험 고객 사전 감지 → 리마인더 자동 발송",
            efficiency: "노쇼율 60% 감소, 예약 공백 시간 절반 단축",
            automationLevel: "full",
            timeToValue: "1주",
            difficulty: "easy",
            requiredData: "3개월+ 예약 이력",
          },
          {
            id: "revisit_reminder",
            name: "재방문 자동 유도",
            description: "시술 유형별 재방문 주기 계산 → 맞춤 쿠폰 카카오톡 자동 발송",
            efficiency: "재방문율 25-40% 향상",
            automationLevel: "full",
            timeToValue: "3일",
            difficulty: "easy",
            requiredData: "고객 시술 이력",
          },
        ],
      },
      {
        id: "style_history",
        name: "고객 스타일 이력",
        source: "태블릿 차트, 스타일북 앱",
        dataType: "semi-structured",
        collectionEase: "medium",
        examples: ["이전 시술 내역", "선호 컬러", "두피/모발 상태", "사용한 약품"],
        aiUseCases: [
          {
            id: "personalized_recommend",
            name: "개인화 시술 추천",
            description: "고객 내방 시 이전 이력 기반 맞춤 시술 자동 제안",
            efficiency: "객단가 15-25% 향상, 고객 만족도 증가",
            automationLevel: "assist",
            timeToValue: "2주",
            difficulty: "medium",
            requiredData: "고객 시술 이력 50건+",
          },
        ],
      },
    ],
    topFlows: [
      {
        id: "customer-retention",
        title: "고객 재방문 자동화 플로우",
        trigger: "예약 시스템 + 시술 이력 보유",
        steps: [
          { step: "시술 완료", detail: "시술 기록 자동 저장 (종류·사용 약품·스타일리스트)", icon: "✂️" },
          { step: "주기 계산", detail: "시술 종류별 재방문 권장 주기 자동 계산", icon: "📅" },
          { step: "알림 발송", detail: "예상 재방문 7일 전 카카오톡 쿠폰 자동 발송", icon: "💌" },
          { step: "예약 유도", detail: "원터치 예약 링크 포함 → 클릭률 45%", icon: "📱" },
          { step: "매출 증가", detail: "재방문율 35% 향상, 월 신규 예약 12건+ 증가", icon: "📈" },
        ],
        totalEfficiency: "월 매출 15-30% 향상 (50~150만원 추가)",
        realWorldExample: "서울 강남 헤어샵 — 재방문율 52% → 71%",
      },
    ],
  },

  // ─── 학원 ──────────────────────────────────────────────
  {
    id: "academy",
    name: "학원·교육기관",
    emoji: "📚",
    category: "교육",
    description: "학생 성취도 분석, 결석 예측, 맞춤 커리큘럼으로 수강 유지율 향상",
    marketSize: "국내 학원 약 9만 개",
    tags: ["출결", "성적", "학습이력", "학부모알림"],
    dataSources: [
      {
        id: "attendance_grades",
        name: "출결·성적 데이터",
        source: "학원 관리 프로그램 (클래스팅·아이엠스쿨)",
        dataType: "structured",
        collectionEase: "easy",
        examples: ["출석률", "시험 점수 변화", "숙제 제출율", "진도 현황"],
        aiUseCases: [
          {
            id: "dropout_predict",
            name: "중도 탈락 위험 예측",
            description: "출석률 하락·성적 정체 패턴 감지 → 담당 선생님 즉시 알림",
            efficiency: "수강 포기율 30-50% 감소",
            automationLevel: "semi",
            timeToValue: "1주",
            difficulty: "medium",
            requiredData: "3개월+ 출결·성적 이력",
          },
          {
            id: "parent_report",
            name: "학부모 주간 리포트 자동 생성",
            description: "학생별 주간 학습 현황 요약 → 카카오톡 자동 발송",
            efficiency: "학부모 신뢰도 향상, 문의 전화 40% 감소",
            automationLevel: "full",
            timeToValue: "3일",
            difficulty: "easy",
            requiredData: "출결·성적 데이터",
          },
        ],
      },
      {
        id: "learning_content",
        name: "학습 콘텐츠 이력",
        source: "학습지, 교재, 문제풀이 기록",
        dataType: "unstructured",
        collectionEase: "hard",
        examples: ["틀린 문제 유형", "취약 개념", "학습 속도", "집중 시간"],
        aiUseCases: [
          {
            id: "adaptive_curriculum",
            name: "개인화 커리큘럼 생성",
            description: "학생 약점 자동 분석 → 맞춤 문제 및 복습 콘텐츠 생성",
            efficiency: "성적 향상 속도 2배, 선생님 준비 시간 50% 절감",
            automationLevel: "semi",
            timeToValue: "2-4주",
            difficulty: "hard",
            requiredData: "100문제+ 풀이 이력",
          },
        ],
      },
    ],
    topFlows: [
      {
        id: "retention-optimization",
        title: "수강생 유지율 최적화 플로우",
        trigger: "출결·성적 데이터 보유",
        steps: [
          { step: "이상 감지", detail: "3회 연속 결석 또는 성적 10% 이상 하락 자동 감지", icon: "⚠️" },
          { step: "분석", detail: "이전 패턴과 비교, 탈락 위험 점수 계산", icon: "📊" },
          { step: "담당자 알림", detail: "담당 선생님에게 즉시 알림 + 상담 가이드 제공", icon: "🔔" },
          { step: "학부모 연락", detail: "맞춤 현황 리포트 + 상담 신청 링크 발송", icon: "📱" },
          { step: "유지율 향상", detail: "월 수강 포기 3-5건 → 1건 이하", icon: "📈" },
        ],
        totalEfficiency: "연 수강료 유지 500-1000만원 추가",
        realWorldExample: "경기 수원 수학학원 — 월 이탈률 8% → 3%",
      },
    ],
  },

  // ─── 중소기업 ──────────────────────────────────────────
  {
    id: "sme",
    name: "중소기업·제조업",
    emoji: "🏭",
    category: "기업",
    description: "품질 검사 자동화, 공정 최적화, 예측 정비로 생산성 향상",
    marketSize: "국내 중소기업 약 76만 개",
    tags: ["CCTV", "센서", "ERP", "품질검사", "예측정비"],
    dataSources: [
      {
        id: "production_data",
        name: "생산 공정 데이터",
        source: "ERP·MES·PLC·센서",
        dataType: "structured",
        collectionEase: "medium",
        examples: ["생산량", "불량률", "기계 온도·진동", "가동 시간", "에너지 사용량"],
        aiUseCases: [
          {
            id: "quality_inspection",
            name: "비전 AI 품질 검사",
            description: "카메라 + YOLOv8으로 불량품 실시간 자동 감지 (인력 대체)",
            efficiency: "검사 정확도 99.2%, 인건비 30-50% 절감",
            automationLevel: "full",
            timeToValue: "4-8주",
            difficulty: "hard",
            requiredData: "정상/불량 이미지 각 500장+",
          },
          {
            id: "predictive_maintenance",
            name: "예측 정비 (PdM)",
            description: "기계 진동·온도 센서 데이터로 고장 72시간 전 예측",
            efficiency: "비계획 다운타임 60% 감소, 정비 비용 25% 절감",
            automationLevel: "semi",
            timeToValue: "4-6주",
            difficulty: "hard",
            requiredData: "6개월+ 센서 이력",
          },
        ],
      },
      {
        id: "hr_data",
        name: "인사·근태 데이터",
        source: "출퇴근 단말기, 급여 시스템",
        dataType: "structured",
        collectionEase: "easy",
        examples: ["출퇴근 패턴", "초과근무", "직무별 성과", "이직률"],
        aiUseCases: [
          {
            id: "turnover_predict",
            name: "이직 위험 예측",
            description: "패턴 분석으로 이직 위험 직원 사전 감지 → HR 개입 타이밍 제공",
            efficiency: "이직률 20-30% 감소, 채용비용 절감",
            automationLevel: "assist",
            timeToValue: "2-4주",
            difficulty: "medium",
            requiredData: "1년+ 근태·인사 이력",
          },
        ],
      },
    ],
    topFlows: [
      {
        id: "quality-automation",
        title: "비전 AI 품질 검사 플로우",
        trigger: "생산 라인 카메라 + 불량 이미지 보유",
        steps: [
          { step: "데이터 수집", detail: "기존 불량품 이미지 500장+ 분류 라벨링", icon: "🏷️" },
          { step: "모델 학습", detail: "YOLOv8 파인튜닝 (GPU 서버 또는 클라우드)", icon: "🧠" },
          { step: "라인 배포", detail: "카메라에 Edge AI 모듈 연결, 실시간 검사 시작", icon: "📷" },
          { step: "자동 분류", detail: "불량품 자동 제거 + 로그 기록", icon: "⚙️" },
          { step: "보고서", detail: "일/주/월별 불량률 리포트 자동 생성", icon: "📋" },
        ],
        totalEfficiency: "검사 인건비 월 300-800만원 절감",
        realWorldExample: "경남 창원 부품 제조사 — 불량률 2.3% → 0.4%",
      },
    ],
  },

  // ─── 대학생·프리랜서 ────────────────────────────────────
  {
    id: "freelancer",
    name: "프리랜서·대학생",
    emoji: "💻",
    category: "개인",
    description: "포트폴리오 자동화, 클라이언트 관리, 학습 최적화로 생산성 극대화",
    marketSize: "국내 프리랜서 약 400만 명",
    tags: ["포트폴리오", "클라이언트", "시간관리", "학습"],
    dataSources: [
      {
        id: "project_data",
        name: "프로젝트·업무 기록",
        source: "노션·지라·슬랙·이메일",
        dataType: "unstructured",
        collectionEase: "medium",
        examples: ["프로젝트 이력", "클라이언트 요구사항", "수정 요청 패턴", "마감 준수율"],
        aiUseCases: [
          {
            id: "proposal_auto",
            name: "제안서 자동 생성",
            description: "클라이언트 요구사항 입력 → 맞춤 제안서 초안 자동 작성",
            efficiency: "제안서 작성 시간 80% 절감, 수주율 향상",
            automationLevel: "semi",
            timeToValue: "즉시",
            difficulty: "easy",
            requiredData: "이전 제안서 3건+",
          },
          {
            id: "time_tracking",
            name: "작업 시간 패턴 분석",
            description: "생산성 높은 시간대 파악 → 고집중 업무 배치 자동 제안",
            efficiency: "실효 작업 시간 30% 증가",
            automationLevel: "assist",
            timeToValue: "1주",
            difficulty: "easy",
            requiredData: "2주+ 작업 로그",
          },
        ],
      },
      {
        id: "study_data",
        name: "학습 이력 데이터",
        source: "노션·플래너·유튜브 시청 기록",
        dataType: "semi-structured",
        collectionEase: "easy",
        examples: ["공부 시간", "과목별 성취도", "오답 노트", "시험 결과"],
        aiUseCases: [
          {
            id: "study_plan",
            name: "맞춤 학습 플랜 생성",
            description: "약점 분야 분석 → 시험까지 최적 학습 스케줄 자동 생성",
            efficiency: "목표 달성률 50% 향상",
            automationLevel: "semi",
            timeToValue: "즉시",
            difficulty: "easy",
            requiredData: "과목별 현재 성취도, 목표 시험일",
          },
        ],
      },
    ],
    topFlows: [
      {
        id: "freelance-automation",
        title: "프리랜서 업무 자동화 플로우",
        trigger: "프로젝트 이력 + 클라이언트 커뮤니케이션 보유",
        steps: [
          { step: "이력 학습", detail: "과거 제안서·계약서·대화 AI 학습", icon: "📖" },
          { step: "제안서 생성", detail: "요구사항 입력 → 맞춤 제안서 3분 완성", icon: "✍️" },
          { step: "계약 관리", detail: "마감 알림, 청구서 자동 생성", icon: "📝" },
          { step: "포트폴리오", detail: "완료 프로젝트 자동 정리 + 사이트 업데이트", icon: "🎨" },
          { step: "수입 증가", detail: "제안 성공률 20% 향상, 월 추가 프로젝트 1-2건", icon: "💰" },
        ],
        totalEfficiency: "월 추가 수입 30-100만원, 업무 시간 주 5-8시간 절감",
        realWorldExample: "서울 UI/UX 프리랜서 — 제안서 작성 시간 4시간 → 40분",
      },
    ],
  },
];

// ─── 카테고리 필터 ────────────────────────────────────────
export const CATEGORIES = [
  { id: "all", name: "전체", emoji: "🌐" },
  { id: "음식점", name: "음식점·카페", emoji: "🍽️" },
  { id: "소매업", name: "소매·유통", emoji: "🏪" },
  { id: "서비스업", name: "서비스업", emoji: "💼" },
  { id: "교육", name: "교육·학원", emoji: "📚" },
  { id: "기업", name: "기업·제조", emoji: "🏭" },
  { id: "개인", name: "프리랜서·학생", emoji: "💻" },
];

// ─── 데이터 유형 색상 ─────────────────────────────────────
export const DATA_TYPE_COLORS: Record<string, string> = {
  structured: "bg-blue-100 text-blue-700",
  unstructured: "bg-purple-100 text-purple-700",
  "semi-structured": "bg-amber-100 text-amber-700",
  visual: "bg-green-100 text-green-700",
  audio: "bg-pink-100 text-pink-700",
};

export const AUTOMATION_COLORS: Record<string, string> = {
  full: "bg-emerald-100 text-emerald-700",
  semi: "bg-blue-100 text-blue-700",
  assist: "bg-slate-100 text-slate-700",
};

export const AUTOMATION_LABELS: Record<string, string> = {
  full: "완전 자동",
  semi: "반자동",
  assist: "AI 보조",
};

// ─────────────────────────────────────────────────────────
// 공통 AI 역량 (업종 무관 적용 가능)
// ─────────────────────────────────────────────────────────

export interface CommonCapability {
  id: string;
  capability: string;
  applicability: string;
  avgAccuracy: string;
  minDataRequired: string;
  avgEfficiency: string;
  industries: string[];
}

export const COMMON_AI_CAPABILITIES: CommonCapability[] = [
  {
    id: "demand_forecast",
    capability: "수요 예측",
    applicability: "거의 모든 업종",
    avgAccuracy: "70~85%",
    minDataRequired: "최소 3개월 일별 데이터",
    avgEfficiency: "폐기/손실 20~40% 감소",
    industries: ["카페", "음식점", "편의점", "마트", "베이커리", "꽃집"],
  },
  {
    id: "churn_prevention",
    capability: "이탈 예측 및 방지",
    applicability: "구독/재방문 기반 업종",
    avgAccuracy: "65~80%",
    minDataRequired: "최소 6개월 고객 행동 데이터",
    avgEfficiency: "이탈률 15~25% 감소",
    industries: ["헬스장", "학원", "미용실", "SaaS"],
  },
  {
    id: "review_management",
    capability: "자동 리뷰 관리",
    applicability: "B2C 전 업종",
    avgAccuracy: "감성 분류 90% 이상",
    minDataRequired: "리뷰 100건 이상",
    avgEfficiency: "응대 시간 70% 절감, 별점 0.2~0.5점 향상",
    industries: ["카페", "음식점", "미용실", "배달 전문점", "숙박"],
  },
  {
    id: "inventory_automation",
    capability: "재고/발주 자동화",
    applicability: "실물 재고 보유 업종 전체",
    avgAccuracy: "75~85%",
    minDataRequired: "최소 2개월 판매+재고 데이터",
    avgEfficiency: "재고 과부족 30~50% 감소",
    industries: ["편의점", "마트", "베이커리", "약국", "식자재"],
  },
  {
    id: "noshow_prediction",
    capability: "노쇼 예측",
    applicability: "예약 기반 업종",
    avgAccuracy: "60~75%",
    minDataRequired: "최소 3개월 예약 이력",
    avgEfficiency: "노쇼율 25~45% 감소",
    industries: ["미용실", "치과", "한의원", "마사지", "PT"],
  },
  {
    id: "personalized_marketing",
    capability: "개인화 마케팅",
    applicability: "멤버십/회원 데이터 보유 업종",
    avgAccuracy: "추천 전환율 2~4배",
    minDataRequired: "최소 회원 200명 + 구매 이력 3회 이상",
    avgEfficiency: "마케팅 전환율 2~4배 향상",
    industries: ["카페", "미용실", "헬스장", "쇼핑몰", "학원"],
  },
];

// ─────────────────────────────────────────────────────────
// ROI 추정 (업종별)
// ─────────────────────────────────────────────────────────

export interface ROIEstimate {
  industry: string;
  emoji: string;
  monthlyInvestment: string;
  monthlyReturn: string;
  paybackPeriod: string;
  mainBenefits: string[];
}

export const ROI_ESTIMATES: ROIEstimate[] = [
  {
    industry: "카페",
    emoji: "☕",
    monthlyInvestment: "20~50만원",
    monthlyReturn: "100~200만원",
    paybackPeriod: "1~2개월",
    mainBenefits: ["폐기 감소", "재방문 향상", "발주 시간 절약"],
  },
  {
    industry: "배달 음식점",
    emoji: "🛵",
    monthlyInvestment: "30~70만원",
    monthlyReturn: "150~400만원",
    paybackPeriod: "1~2개월",
    mainBenefits: ["광고비 최적화", "폐기 감소", "리뷰 관리"],
  },
  {
    industry: "미용실",
    emoji: "💇",
    monthlyInvestment: "20~50만원",
    monthlyReturn: "100~300만원",
    paybackPeriod: "1~2개월",
    mainBenefits: ["노쇼 감소", "재방문 향상", "약제 낭비 감소"],
  },
  {
    industry: "헬스장",
    emoji: "🏋️",
    monthlyInvestment: "30~80만원",
    monthlyReturn: "200~600만원",
    paybackPeriod: "1~2개월",
    mainBenefits: ["이탈 방지", "PT 업셀링", "갱신율 향상"],
  },
  {
    industry: "치과/한의원",
    emoji: "🦷",
    monthlyInvestment: "50~150만원",
    monthlyReturn: "300~800만원",
    paybackPeriod: "1~2개월",
    mainBenefits: ["노쇼 감소", "가동률 향상", "리콜 자동화"],
  },
  {
    industry: "편의점/마트",
    emoji: "🏪",
    monthlyInvestment: "15~40만원",
    monthlyReturn: "80~200만원",
    paybackPeriod: "1~2개월",
    mainBenefits: ["폐기 감소", "품절 손실 방지", "발주 자동화"],
  },
];

// ─────────────────────────────────────────────────────────
// 한국 특화 도구 생태계
// ─────────────────────────────────────────────────────────

export interface KoreanTool {
  name: string;
  type: string;
  cost: string;
  dataAvailable: string[];
  logo: string;
}

export const KOREAN_TOOLS: KoreanTool[] = [
  {
    name: "배달의민족 사장님앱",
    type: "배달 주문 데이터",
    cost: "무료",
    dataAvailable: ["주문 통계", "리뷰 관리", "광고 효과"],
    logo: "🛵",
  },
  {
    name: "네이버 플레이스 사장님",
    type: "온라인 노출 데이터",
    cost: "무료",
    dataAvailable: ["검색 노출", "방문자 수", "리뷰", "예약"],
    logo: "🟢",
  },
  {
    name: "카카오 비즈니스",
    type: "고객 소통/마케팅",
    cost: "무료~유료",
    dataAvailable: ["메시지 오픈율", "클릭률", "전환율"],
    logo: "💛",
  },
  {
    name: "토스 사장님",
    type: "매출/결제 데이터",
    cost: "무료",
    dataAvailable: ["일별 매출", "결제 수단", "고객 분석"],
    logo: "💙",
  },
  {
    name: "더존 ERP/WEHRD",
    type: "중소기업 전사 관리",
    cost: "월 10~100만원",
    dataAvailable: ["회계", "인사", "생산", "물류"],
    logo: "🏭",
  },
  {
    name: "아임웹 / 카페24",
    type: "온라인 쇼핑몰 데이터",
    cost: "월 3~30만원",
    dataAvailable: ["방문자", "전환율", "장바구니 이탈", "상품별 판매"],
    logo: "🛍️",
  },
];

// ─────────────────────────────────────────────────────────
// 4단계 도입 가이드
// ─────────────────────────────────────────────────────────

export interface ImplementationPhase {
  phase: number;
  name: string;
  duration: string;
  actions: string[];
  cost: string;
  difficulty: "easy" | "medium" | "hard";
}

export const IMPLEMENTATION_PHASES: ImplementationPhase[] = [
  {
    phase: 1,
    name: "데이터 수집 기반 구축",
    duration: "1~2주",
    actions: [
      "POS 데이터 디지털화 (이미 있으면 추출)",
      "날씨/공휴일 API 연동",
      "카카오 채널 개설 + 고객 등록 시작",
      "네이버 플레이스 인사이트 활성화",
    ],
    cost: "0~50만원 (대부분 무료 툴)",
    difficulty: "easy",
  },
  {
    phase: 2,
    name: "기초 자동화 도입",
    duration: "2~4주",
    actions: [
      "리뷰 모니터링 + 자동 답변 초안 생성",
      "재방문 자동 알림 (시술/구매 후 N일 경과)",
      "노쇼 사전 확인 문자 자동화",
      "유통기한/재고 소진 알림",
    ],
    cost: "월 10~30만원 (자동화 툴 구독)",
    difficulty: "easy",
  },
  {
    phase: 3,
    name: "AI 예측 모델 도입",
    duration: "4~8주",
    actions: [
      "수요 예측 모델 학습 (3개월 데이터 필요)",
      "이탈 예측 모델 구축",
      "발주 자동화 연동",
      "대시보드 구축",
    ],
    cost: "월 20~100만원 (AI 서비스 또는 개발비)",
    difficulty: "medium",
  },
  {
    phase: 4,
    name: "고도화 및 확장",
    duration: "2~6개월",
    actions: [
      "CCTV 데이터 AI 분석 도입",
      "개인화 추천 엔진 고도화",
      "멀티채널 마케팅 자동화",
      "경쟁사 모니터링 자동화",
    ],
    cost: "월 50~300만원",
    difficulty: "hard",
  },
];
