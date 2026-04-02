/**
 * AI Trainer Hub — 학습 템플릿 카탈로그
 *
 * 구조: 상위 카테고리(학습 방법) × 하위 템플릿(업종/기능)
 * - 상위: 이미지로 학습, 텍스트로 학습, 음성으로 학습, 데이터로 학습, 행동으로 학습
 * - 하위: 각 상위 아래 업종별/기능별 실전 템플릿
 * - 무료: 빈 캔버스 + 가이드라인
 * - 구독: 완성된 템플릿 (프롬프트 + 데이터 체크리스트 + Before/After)
 */

/* ================================================================== */
/*  상위 카테고리 — 학습 입력 방식별                                     */
/* ================================================================== */

export interface TopCategory {
  id: string;
  name: string;
  icon: string; // lucide icon name
  description: string;
  color: string;
  gradient: string;
  howItWorks: string;
  inputTypes: string[];
  keyPrinciple: string;
  researchBasis: string;
  freeFeature: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  industry: string;
  description: string;
  tier: "free" | "starter" | "pro";
  tags: string[];
  whatYouLearn: string;
  inputExample: string;
  outputExample: string;
  templates: LearnTemplate[];
}

export interface LearnTemplate {
  id: string;
  name: string;
  tier: "free" | "starter" | "pro";
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  dataRequirements: DataRequirement[];
  systemPromptPreview: string;
  beforeAfter: { before: string; after: string };
  guide: string[];
  keywords: string[];
}

export interface DataRequirement {
  item: string;
  type: "text" | "image" | "audio" | "file" | "data";
  required: boolean;
  description: string;
  example: string;
}

/* ================================================================== */
/*  전체 카탈로그                                                       */
/* ================================================================== */

export const CATALOG: TopCategory[] = [
  /* ============================================================== */
  /*  1. 텍스트로 학습하기                                             */
  /* ============================================================== */
  {
    id: "text-learning",
    name: "텍스트로 학습하기",
    icon: "FileText",
    description: "문서, 매뉴얼, FAQ, 대화 기록 등 텍스트 데이터로 AI를 학습시킵니다",
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
    howItWorks: "텍스트를 AI에게 제공하면, AI가 패턴·규칙·지식을 추출하여 학습합니다. 프롬프트 설정 → Knowledge 업로드 → RAG 구성 순서로 정확도가 올라갑니다.",
    inputTypes: ["문서 (PDF, DOCX)", "텍스트 입력", "FAQ 목록", "대화 기록", "매뉴얼", "웹페이지 URL"],
    keyPrinciple: "Garbage In, Garbage Out — 정제된 고품질 텍스트 100건이 정제 안 된 10,000건보다 낫습니다 (Phi 논문: 2.7B = 70B급)",
    researchBasis: "Brown et al. 2020 (Few-shot), Lewis et al. 2020 (RAG), Gunasekar et al. 2023 (Data Quality)",
    freeFeature: "빈 프롬프트 에디터 + 텍스트 입력 가이드라인",
    subcategories: [
      // --- 고객 응대 ---
      {
        id: "text-cs",
        name: "고객 응대 AI",
        industry: "전 업종",
        description: "FAQ, 정책 문서, 대화 기록으로 고객 응대 AI를 학습시킵니다",
        tier: "free",
        tags: ["고객응대", "CS", "챗봇", "FAQ"],
        whatYouLearn: "AI가 고객 질문에 정확하고 일관된 답변을 하도록 학습",
        inputExample: "환불 정책 PDF + FAQ 200개 + 기존 상담 기록",
        outputExample: "고객: '환불 가능한가요?' → AI: '수령 후 7일 이내 미개봉 제품은 환불 가능합니다. 개봉 제품은 교환만...'",
        templates: [
          {
            id: "text-cs-cafe",
            name: "카페/음식점 고객응대",
            tier: "free",
            description: "메뉴 문의, 예약, 불만 대응을 AI가 처리",
            difficulty: "beginner",
            estimatedTime: "15분",
            dataRequirements: [
              { item: "메뉴판 (이름, 가격, 알레르기 정보)", type: "text", required: true, description: "AI가 메뉴를 정확히 안내하려면 필수", example: "아메리카노 4,500원 / 카페라떼 5,000원 (우유 알레르기 주의)" },
              { item: "영업시간·위치·주차 정보", type: "text", required: true, description: "가장 많이 묻는 기본 정보", example: "평일 9:00-22:00, 주말 10:00-21:00, 지하1층 2시간 무료주차" },
              { item: "자주 묻는 질문 TOP 20", type: "text", required: true, description: "반복 질문을 미리 학습", example: "Q: 와이파이 비밀번호? A: cafe2024" },
              { item: "사장님 말투 예시 (10문장)", type: "text", required: false, description: "AI 답변 톤을 사장님 스타일로", example: "앗 감사해용~ 다음에 또 와주세용 🫶" },
              { item: "리뷰 답글 기존 예시 (20개)", type: "text", required: false, description: "리뷰 대응 패턴 학습", example: "별점5: '감사합니다~' / 별점1: '죄송합니다, 개선하겠습니다'" },
              { item: "현재 이벤트/프로모션", type: "text", required: false, description: "최신 정보 반영", example: "6월 한정: 딸기 라떼 20% 할인" },
            ],
            systemPromptPreview: "당신은 '{매장명}'의 친절한 AI 직원입니다. 메뉴, 영업시간, 위치 등 기본 정보를 정확히 안내하고, 고객 불만에는 공감하며 대응합니다...",
            beforeAfter: {
              before: "고객: 메뉴 추천해주세요 → AI: '저희 매장에는 다양한 메뉴가 있습니다.'",
              after: "고객: 메뉴 추천해주세요 → AI: '지금 인기 많은 건 시그니처 라떼예요! 달달한 거 좋아하시면 바닐라 라떼(5,500원)도 추천이에요~ 🫶'",
            },
            guide: [
              "1단계: 메뉴판 전체를 텍스트로 입력하세요 (가격, 옵션, 알레르기 정보 포함)",
              "2단계: 영업시간, 위치, 주차, 와이파이 등 기본 정보를 입력하세요",
              "3단계: 고객이 자주 묻는 질문 20개를 Q&A 형태로 입력하세요",
              "4단계: (선택) 사장님 말투 예시를 넣으면 톤이 자연스러워집니다",
              "5단계: 테스트에서 '메뉴 추천해줘', '몇시까지 해요?' 등을 물어보세요",
            ],
            keywords: ["카페 AI", "음식점 챗봇", "메뉴 안내", "리뷰 답글", "고객 응대 자동화"],
          },
          {
            id: "text-cs-ecommerce",
            name: "쇼핑몰/이커머스 CS",
            tier: "starter",
            description: "주문, 배송, 환불, 교환 문의를 AI가 처리",
            difficulty: "intermediate",
            estimatedTime: "30분",
            dataRequirements: [
              { item: "환불/교환/배송 정책 문서", type: "file", required: true, description: "정확한 규정 기반 답변 필수", example: "수령 7일 이내 미개봉 환불 가능, 개봉 시 교환만 가능" },
              { item: "상품 카테고리별 FAQ", type: "text", required: true, description: "상품별 자주 묻는 질문", example: "의류: 사이즈표, 세탁법 / 전자: 보증기간, AS" },
              { item: "기존 CS 상담 기록 (100건+)", type: "file", required: true, description: "실제 패턴 학습", example: "CSV: 질문, 답변, 카테고리, 해결여부" },
              { item: "금지 표현 목록", type: "text", required: false, description: "법적 문제 방지", example: "'100% 보장', '확실히', 가격 할인 약속 금지" },
              { item: "에스컬레이션 기준", type: "text", required: false, description: "사람에게 넘기는 기준", example: "3회 이상 불만, 법적 언급, 금액 10만원 이상" },
            ],
            systemPromptPreview: "당신은 '{쇼핑몰명}' 고객센터 AI입니다. 환불/교환 규정을 정확히 안내하고, 복잡한 건은 상담원에게 연결합니다...",
            beforeAfter: {
              before: "고객: 이거 환불되나요? → AI: '환불 관련 문의는 고객센터에 연락해주세요.'",
              after: "고객: 이거 환불되나요? → AI: '주문번호 알려주시면 확인해드릴게요! 수령 후 7일 이내 미개봉이시면 전액 환불 가능합니다. 혹시 개봉하셨나요?'",
            },
            guide: [
              "1단계: 환불/교환/배송 정책을 정확히 입력하세요 (법적 효력 있는 문서 기준)",
              "2단계: 기존 CS 기록에서 자주 묻는 질문 패턴을 추출하세요",
              "3단계: '하면 안 되는 말' 목록을 만드세요 (법적 리스크 방지)",
              "4단계: 사람에게 넘기는 기준을 명확히 설정하세요",
            ],
            keywords: ["쇼핑몰 CS", "이커머스 챗봇", "환불 자동화", "배송 문의", "고객센터 AI"],
          },
          {
            id: "text-cs-realestate",
            name: "부동산 매물 상담",
            tier: "starter",
            description: "매물 문의, 시세, 대출 상담을 AI가 안내",
            difficulty: "intermediate",
            estimatedTime: "25분",
            dataRequirements: [
              { item: "현재 매물 리스트 (면적, 가격, 위치, 특징)", type: "text", required: true, description: "매물 정보 정확 안내", example: "래미안 34평 남향 9.2억, 2호선 도보7분, OO초 300m" },
              { item: "지역 시세 데이터", type: "data", required: true, description: "시세 질문 대응", example: "강남구 평균 3.3㎡당 4,200만원 (2026.03 기준)" },
              { item: "대출/세금 기본 정보", type: "text", required: false, description: "금융 질문 기본 대응", example: "LTV 70%, DTI 40%, 취득세 1~3%" },
              { item: "지역 학군/교통/인프라 정보", type: "text", required: false, description: "입지 분석 질문 대응", example: "도보 5분 내 학교 3개, 대형마트 2개" },
            ],
            systemPromptPreview: "당신은 '{부동산명}' 전문 AI 상담사입니다. 매물 정보를 정확히 안내하고, 과장이나 허위 정보를 제공하지 않습니다...",
            beforeAfter: {
              before: "고객: 이 동네 시세 어때요? → AI: '부동산에 문의해주세요.'",
              after: "고객: 이 동네 시세 어때요? → AI: '현재 이 지역 34평 기준 평균 8.5~9.5억대입니다. 최근 실거래가 추이를 보면...'",
            },
            guide: [
              "1단계: 현재 보유 매물을 구조화된 형태로 입력하세요",
              "2단계: 지역 시세 데이터를 주기적으로 업데이트하세요",
              "3단계: '정확한 정보만, 과장 금지' 규칙을 반드시 설정하세요",
            ],
            keywords: ["부동산 AI", "매물 상담", "시세 분석", "공인중개사"],
          },
          {
            id: "text-cs-medical",
            name: "병원/의료 안내",
            tier: "pro",
            description: "진료 안내, 예약, 환자 교육 자료를 AI가 제공",
            difficulty: "advanced",
            estimatedTime: "45분",
            dataRequirements: [
              { item: "진료과목별 안내 문서", type: "file", required: true, description: "진료 범위와 절차 안내", example: "내과: 건강검진, 만성질환 관리 / 정형외과: 관절, 척추" },
              { item: "진료 예약 프로세스", type: "text", required: true, description: "예약 방법 안내", example: "온라인 예약 → 당일 접수 → 대기 → 진료 → 수납" },
              { item: "의료 금지 표현 목록", type: "text", required: true, description: "의료법 준수 필수", example: "'진단', '처방', '치료 보장' 표현 절대 금지. '~할 수 있습니다'도 주의" },
              { item: "환자 교육 자료 (질환별)", type: "file", required: false, description: "환자 교육 자동화", example: "고혈압 관리법, 당뇨 식이요법, 수술 전후 안내" },
            ],
            systemPromptPreview: "당신은 '{병원명}' 안내 AI입니다. 진료 안내와 예약을 돕지만, 절대 진단이나 처방을 하지 않습니다. 의학적 판단이 필요한 질문은 반드시 의료진 상담을 안내합니다...",
            beforeAfter: {
              before: "환자: 두통이 심한데 뭐 먹으면 돼요? → AI: '타이레놀을 드세요.' (← 의료법 위반!)",
              after: "환자: 두통이 심한데 뭐 먹으면 돼요? → AI: '두통이 심하시군요. 정확한 원인 파악을 위해 신경과 진료를 추천드립니다. 예약 도와드릴까요?'",
            },
            guide: [
              "1단계: 진료과목과 의료진 정보를 정확히 입력하세요",
              "2단계: ⚠️ 금지 표현 목록을 반드시 먼저 설정하세요 (의료법 준수)",
              "3단계: AI가 절대 진단/처방하지 않도록 규칙을 엄격히 설정하세요",
              "4단계: 환자 교육 자료를 추가하면 교육 콘텐츠 자동 생성 가능",
            ],
            keywords: ["병원 AI", "의료 챗봇", "진료 안내", "환자 교육", "의료 자동화"],
          },
          {
            id: "text-cs-legal",
            name: "법률 상담 보조",
            tier: "pro",
            description: "법률 FAQ, 절차 안내, 서류 가이드를 AI가 제공",
            difficulty: "advanced",
            estimatedTime: "60분",
            dataRequirements: [
              { item: "법률 분야별 FAQ (100건+)", type: "text", required: true, description: "자주 묻는 법률 질문", example: "이혼 절차, 상속 순위, 임대차 보증금 반환" },
              { item: "관련 판례/법조문 요약", type: "file", required: true, description: "법적 근거 기반 답변", example: "민법 제750조 불법행위, 주택임대차보호법 제3조" },
              { item: "법률 금지 표현/면책 조항", type: "text", required: true, description: "변호사법 준수", example: "'법률 자문' 대신 '일반적 정보 안내', 면책 문구 필수" },
            ],
            systemPromptPreview: "당신은 법률 정보 안내 AI입니다. 일반적인 법률 정보를 제공하지만, 이는 법률 자문이 아닙니다. 구체적 사안은 반드시 변호사 상담을 안내합니다...",
            beforeAfter: {
              before: "고객: 집주인이 보증금 안 줘요 → AI: '소송하세요.' (← 위험한 조언)",
              after: "고객: 집주인이 보증금 안 줘요 → AI: '주택임대차보호법에 따라 보증금 반환 청구가 가능합니다. 내용증명 → 임차권등기명령 → 지급명령 순서로 진행할 수 있어요. 구체적 진행은 변호사 상담을 추천드립니다.'",
            },
            guide: [
              "1단계: 분야별 FAQ를 법조문 근거와 함께 입력하세요",
              "2단계: ⚠️ 면책 조항과 금지 표현을 먼저 설정하세요",
              "3단계: '법률 자문이 아닌 일반 정보 제공' 원칙을 반드시 설정하세요",
            ],
            keywords: ["법률 AI", "법률 챗봇", "법률 상담", "판례 검색"],
          },
        ],
      },
      // --- 콘텐츠 생성 ---
      {
        id: "text-content",
        name: "콘텐츠 생성 AI",
        industry: "전 업종",
        description: "블로그, SNS, 상품설명, 대본 등을 AI가 작성",
        tier: "free",
        tags: ["콘텐츠", "마케팅", "SNS", "블로그", "카피라이팅"],
        whatYouLearn: "AI가 브랜드 톤에 맞는 콘텐츠를 일관되게 생성하도록 학습",
        inputExample: "기존 인기 게시물 50개 + 브랜드 가이드 + 타겟 고객 정보",
        outputExample: "매일 인스타 포스팅, 블로그 초안, 상품 설명이 자동 생성",
        templates: [
          {
            id: "text-content-sns",
            name: "SNS 콘텐츠 자동 생성",
            tier: "free",
            description: "인스타그램, 블로그, 유튜브 대본을 AI가 작성",
            difficulty: "beginner",
            estimatedTime: "20분",
            dataRequirements: [
              { item: "기존 인기 게시물/글 (30개+)", type: "text", required: true, description: "톤과 스타일 학습", example: "좋아요 100+ 게시물의 캡션 텍스트" },
              { item: "브랜드 톤앤매너 가이드", type: "text", required: true, description: "일관된 브랜드 목소리", example: "'친근하고 밝은 톤, 이모지 3개 이내, 해시태그 5~8개'" },
              { item: "타겟 고객 정보", type: "text", required: false, description: "맞춤형 콘텐츠", example: "25~35세 여성, 카페 좋아하는, 인스타 활발한" },
              { item: "경쟁사 콘텐츠 예시", type: "text", required: false, description: "차별화 포인트", example: "경쟁 카페 인기 게시물 패턴 분석" },
            ],
            systemPromptPreview: "당신은 '{브랜드명}'의 SNS 콘텐츠 크리에이터입니다. 브랜드 톤에 맞는 인스타 캡션, 해시태그, 스토리를 작성합니다...",
            beforeAfter: {
              before: "오늘의 메뉴입니다. #카페 #커피 #맛집 #좋아요 #일상",
              after: "비 오는 오후, 라떼 한 잔에 시간이 멈추다 ☔🍵\n시그니처 바닐라 라떼가 이 날씨에 딱이에요\n\n#비오는날카페 #시그니처라떼 #카페추천 #오후의여유",
            },
            guide: [
              "1단계: 기존 인기 게시물 30개의 텍스트를 수집하세요",
              "2단계: 브랜드 톤 가이드를 만드세요 (말투, 이모지 규칙, 금지어)",
              "3단계: AI에게 '이런 식으로 써줘'라고 예시와 함께 요청하세요",
              "⚠️ AI 글을 그대로 게시하지 마세요. 반드시 검수 후 게시!",
            ],
            keywords: ["인스타 자동화", "SNS 콘텐츠", "블로그 AI", "마케팅 AI", "카피라이팅"],
          },
          {
            id: "text-content-product",
            name: "상품 설명 자동 생성",
            tier: "starter",
            description: "쇼핑몰 상품 설명을 브랜드 톤에 맞게 자동 작성",
            difficulty: "intermediate",
            estimatedTime: "25분",
            dataRequirements: [
              { item: "베스트셀러 상품 설명 (50개+)", type: "text", required: true, description: "성공 패턴 학습", example: "잘 팔리는 상품의 설명문 전체 텍스트" },
              { item: "브랜드 톤앤매너 가이드", type: "file", required: true, description: "일관된 브랜드 표현", example: "10페이지 PDF: 톤, 금지어, 필수 포함 문구" },
              { item: "상품 스펙 데이터 (CSV)", type: "data", required: true, description: "정확한 정보 기반", example: "상품명, 소재, 사이즈, 가격, 특징" },
              { item: "타겟 고객 페르소나", type: "text", required: false, description: "타겟에 맞는 어필", example: "20대 여성, 가성비 중시, 트렌디한" },
            ],
            systemPromptPreview: "당신은 '{브랜드명}'의 상품 카피라이터입니다. 상품 스펙을 받으면 브랜드 톤에 맞는 매력적인 상품 설명을 작성합니다...",
            beforeAfter: {
              before: "면 소재 티셔츠입니다. 사이즈 S/M/L. 색상 화이트/블랙.",
              after: "매일 입고 싶은 데일리 티 ✨\n코튼 100%의 부드러운 촉감, 세탁해도 늘어나지 않는 탄탄한 원단.\n체형 커버 핏으로 누구나 편하게!\n\n📏 S(44) M(55) L(66)\n🎨 클린 화이트 / 모던 블랙",
            },
            guide: [
              "1단계: 잘 팔리는 상품의 설명문 50개를 수집하세요",
              "2단계: 브랜드 톤 가이드를 정리하세요",
              "3단계: 상품 스펙 CSV를 준비하세요 (이름, 소재, 사이즈, 가격)",
              "4단계: AI에게 스펙만 입력하면 설명이 자동 생성됩니다",
            ],
            keywords: ["상품설명 AI", "쇼핑몰 자동화", "카피라이팅", "상세페이지"],
          },
        ],
      },
      // --- 교육 ---
      {
        id: "text-education",
        name: "교육/학습 AI",
        industry: "교육",
        description: "커리큘럼, 문제 생성, 학생 Q&A를 AI가 처리",
        tier: "starter",
        tags: ["교육", "학원", "강의", "문제생성", "튜터링"],
        whatYouLearn: "AI가 교육자의 설명 방식으로 맞춤형 학습 콘텐츠를 생성",
        inputExample: "강의 스크립트 20개 + 수강생 Q&A 500개 + 교과서 내용",
        outputExample: "학생별 맞춤 문제, 설명, 피드백이 자동 생성",
        templates: [
          {
            id: "text-edu-tutor",
            name: "AI 튜터 (과외 선생님)",
            tier: "free",
            description: "학생 질문에 맞춤형으로 설명하는 AI 튜터",
            difficulty: "beginner",
            estimatedTime: "20분",
            dataRequirements: [
              { item: "교과 내용/교재 텍스트", type: "text", required: true, description: "교과 지식 기반", example: "수학 중2 교과서 '일차방정식' 챕터 전체" },
              { item: "선생님의 설명 방식 예시 (10개)", type: "text", required: true, description: "설명 스타일 학습", example: "'방정식은 저울이야. 양쪽이 같아야 해. 왼쪽에 3kg 올리면...'" },
              { item: "학생이 자주 틀리는 유형", type: "text", required: false, description: "오답 패턴 학습", example: "부호 실수, 이항할 때 부호 안 바꿈, 검산 안 함" },
            ],
            systemPromptPreview: "당신은 친절한 수학 튜터입니다. 학생이 이해할 수 있는 쉬운 비유로 설명하고, 틀린 부분은 왜 틀렸는지 차근차근 알려줍니다...",
            beforeAfter: {
              before: "학생: 2x + 3 = 7 어떻게 풀어요? → AI: 'x = 2입니다.' (답만 줌)",
              after: "학생: 2x + 3 = 7 어떻게 풀어요? → AI: '저울을 생각해봐! 양쪽이 같아야 하잖아. 오른쪽에서 3을 빼면 왼쪽에서도 3을 빼야 해. 그러면 2x = 4. 이제 2로 나누면?'",
            },
            guide: [
              "1단계: 가르칠 과목/단원의 교과 내용을 입력하세요",
              "2단계: 본인의 설명 방식 예시를 10개 이상 넣으세요",
              "3단계: 학생이 자주 틀리는 유형을 추가하면 맞춤 설명 가능",
            ],
            keywords: ["AI 튜터", "맞춤 학습", "수학 AI", "교육 AI", "문제 풀이"],
          },
        ],
      },
      // --- 업무 자동화 ---
      {
        id: "text-workflow",
        name: "업무 자동화 AI",
        industry: "전 업종",
        description: "보고서, 이메일, 회의록, 문서 작업을 AI가 처리",
        tier: "starter",
        tags: ["업무자동화", "보고서", "이메일", "회의록", "문서"],
        whatYouLearn: "AI가 회사의 문서 양식과 톤에 맞춰 업무 문서를 자동 생성",
        inputExample: "기존 보고서 양식 + 이메일 템플릿 + 회의록 샘플",
        outputExample: "보고서 초안, 이메일 답변, 회의 요약이 자동 생성",
        templates: [
          {
            id: "text-workflow-report",
            name: "보고서 자동 작성",
            tier: "starter",
            description: "데이터를 넣으면 회사 양식에 맞는 보고서 초안 생성",
            difficulty: "intermediate",
            estimatedTime: "30분",
            dataRequirements: [
              { item: "기존 보고서 샘플 (10개+)", type: "file", required: true, description: "양식과 톤 학습", example: "월간 실적 보고서, 프로젝트 진행 보고서 등" },
              { item: "보고서 양식/템플릿", type: "text", required: true, description: "구조 학습", example: "1.개요 2.실적 3.이슈 4.계획 5.건의사항" },
              { item: "데이터 소스 설명", type: "text", required: false, description: "숫자 해석 기준", example: "매출 데이터는 SAP에서, KPI는 OKR 시트에서" },
            ],
            systemPromptPreview: "당신은 '{회사명}'의 보고서 작성 AI입니다. 데이터를 받으면 회사 양식에 맞는 보고서 초안을 작성합니다...",
            beforeAfter: {
              before: "매출 데이터 → '매출이 증가했습니다.' (구체성 없음)",
              after: "매출 데이터 → '3월 매출 2.3억 (전월 대비 +12%, YoY +8%). 주요 요인: 신제품 A 런칭 효과(+15%). 리스크: 원가율 2%p 상승. 대응: 4월 프로모션으로 객단가 유지 전략 필요.'",
            },
            guide: [
              "1단계: 기존 보고서 10개를 업로드하세요 (양식과 톤 학습)",
              "2단계: 보고서 구조(목차)를 명확히 설정하세요",
              "3단계: 데이터를 넣고 '보고서 작성해줘'라고 요청하세요",
            ],
            keywords: ["보고서 AI", "업무 자동화", "비즈니스 AI", "문서 생성"],
          },
        ],
      },
      // --- 물류/배송 CS ---
      {
        id: "text-cs-logistics",
        name: "물류/배송 CS AI",
        industry: "물류/배송",
        description: "배송 상태 조회, 반품/교환 물류 문의를 AI가 실시간 안내",
        tier: "starter",
        tags: ["물류", "배송", "택배", "CS", "라스트마일"],
        whatYouLearn: "AI가 배송 상태 코드와 물류 프로세스를 이해하여 고객 문의에 즉시 응대",
        inputExample: "배송 상태 코드표 + 택배사 API 응답 + 자주 묻는 배송 질문 200개",
        outputExample: "고객: '내 택배 어디쯤이에요?' → AI: '주문번호 123456 현재 인천 허브 도착, 내일 오전 배송 예정이에요!'",
        templates: [
          {
            id: "text-logistics-delivery",
            name: "물류 배송 상태 안내 AI",
            tier: "starter",
            description: "배송 추적, 지연 안내, 반품/교환 물류 문의를 AI가 실시간 처리",
            difficulty: "intermediate",
            estimatedTime: "25분",
            dataRequirements: [
              { item: "배송 상태 코드표", type: "text", required: true, description: "각 배송 단계별 상태 코드와 의미를 AI가 정확히 이해", example: "10: 접수, 20: 집하, 30: 간선 이동, 40: 허브 도착, 50: 배송 출발, 60: 배송 완료" },
              { item: "택배사별 API 응답 포맷", type: "data", required: true, description: "택배사 조회 결과를 AI가 해석하는 기준", example: "CJ대한통운: {status: 'HUB_ARRIVAL', location: '인천HUB', time: '2026-03-31 14:30'}" },
              { item: "자주 묻는 배송 질문", type: "text", required: true, description: "반복되는 배송 문의 패턴 학습", example: "Q: 배송 언제 와요? / Q: 택배 분실된 것 같아요 / Q: 배송지 변경 가능한가요?" },
              { item: "반품/교환 물류 프로세스", type: "text", required: false, description: "역물류 프로세스 안내 자동화", example: "반품 접수 → 수거 예약 → 택배사 수거 → 검수 → 환불/교환 처리 (영업일 3~5일)" },
            ],
            systemPromptPreview: "당신은 '{회사명}' 물류 안내 AI입니다. 고객의 배송 상태를 실시간으로 조회하여 현재 위치, 예상 도착 시간을 안내합니다. 배송 지연 시 사유와 대안을 먼저 제시하고, 반품/교환 요청은 물류 프로세스에 따라 단계별로 안내합니다. 택배사별 상태 코드를 고객이 이해하기 쉬운 표현으로 변환합니다...",
            beforeAfter: {
              before: "배송 조회는 택배사 홈페이지에서...",
              after: "주문번호 123456 현재 인천 허브 도착, 내일 오전 배송 예정이에요! 부재 시 경비실 보관 원하시면 말씀해주세요",
            },
            guide: [
              "1단계: 사용 중인 택배사의 배송 상태 코드표를 정리하세요 (접수→집하→이동→도착→배송→완료)",
              "2단계: 택배사 API 응답 포맷을 등록하고, 각 필드의 의미를 설명하세요",
              "3단계: 고객이 자주 묻는 배송 관련 질문 50개 이상을 Q&A 형태로 입력하세요",
              "4단계: (선택) 반품/교환 물류 프로세스를 단계별로 정리하면 역물류 문의도 자동 처리",
              "5단계: 테스트에서 '내 택배 어디쯤이야?', '배송 언제 와?', '반품하고 싶어요' 등을 물어보세요",
            ],
            keywords: ["물류 AI", "배송 추적", "택배 CS", "라스트마일", "배송 상태 안내"],
          },
        ],
      },
      // --- HR/채용 ---
      {
        id: "text-hr",
        name: "이력서 스크리닝 AI",
        industry: "HR/인사",
        description: "이력서를 JD 기준으로 분석하여 적합도를 자동 평가",
        tier: "starter",
        tags: ["HR", "채용", "이력서", "스크리닝", "인사"],
        whatYouLearn: "AI가 직무기술서(JD) 기준으로 이력서를 분석하고 적합도를 점수화",
        inputExample: "직무기술서 + 평가 루브릭 + 이력서 100건",
        outputExample: "이력서 → 적합도 85점: '백엔드 3년 경력, Java/Spring 일치, AWS 경험 보유. 리더십 경험 보완 필요'",
        templates: [
          {
            id: "text-hr-screening",
            name: "이력서 스크리닝 AI",
            tier: "starter",
            description: "JD 기준으로 이력서를 자동 분석하여 적합도 점수와 추천 근거 제시",
            difficulty: "intermediate",
            estimatedTime: "30분",
            dataRequirements: [
              { item: "직무기술서 JD", type: "text", required: true, description: "채용 포지션의 필수/우대 요건 정의", example: "백엔드 개발자: Java/Spring 필수, AWS 경험 우대, 3년 이상 경력" },
              { item: "평가 기준 루브릭", type: "text", required: true, description: "이력서 평가 항목과 배점 기준", example: "기술 스택 일치(40점), 경력 연차(20점), 프로젝트 경험(25점), 학력(15점)" },
              { item: "기존 합격 이력서 패턴", type: "file", required: false, description: "실제 합격자의 이력서 패턴을 학습하여 정확도 향상", example: "최근 6개월 합격자 이력서 30건 (개인정보 마스킹)" },
              { item: "면접 질문 풀", type: "text", required: false, description: "적합 후보자에게 맞춤형 면접 질문 자동 생성", example: "기술 면접: '대규모 트래픽 처리 경험?', 컬처핏: '팀 갈등 해결 경험?'" },
            ],
            systemPromptPreview: "당신은 '{회사명}' 채용팀의 이력서 스크리닝 AI입니다. 직무기술서(JD)와 평가 루브릭을 기준으로 이력서를 분석합니다. 각 평가 항목별 점수를 산출하고, 적합/부적합 근거를 구체적으로 제시합니다. 개인의 성별, 나이, 출신 등 편향 요소는 평가에서 제외합니다...",
            beforeAfter: {
              before: "이력서 100건 수동 검토 → 3일",
              after: "AI가 JD 기준 적합도 점수 산출 → 상위 20명 1시간 내 추천",
            },
            guide: [
              "1단계: 채용 포지션의 직무기술서(JD)를 필수 요건과 우대 요건으로 구분하여 입력하세요",
              "2단계: 평가 루브릭을 만드세요 (항목별 배점, 커트라인 점수 설정)",
              "3단계: (선택) 기존 합격자 이력서를 업로드하면 AI가 합격 패턴을 학습합니다",
              "4단계: 이력서를 업로드하면 AI가 적합도 점수와 상세 평가 결과를 제시합니다",
              "5단계: ⚠️ AI 평가는 1차 스크리닝용이며, 최종 판단은 반드시 채용 담당자가 해야 합니다",
            ],
            keywords: ["채용 AI", "이력서 스크리닝", "HR 자동화", "인재 채용", "JD 매칭"],
          },
        ],
      },
      // --- 회계/재무 ---
      {
        id: "text-finance",
        name: "전표 자동 분류 AI",
        industry: "회계/재무",
        description: "영수증과 전표를 계정과목에 자동 분류하고 이상 거래를 탐지",
        tier: "pro",
        tags: ["회계", "재무", "전표", "경비", "세무"],
        whatYouLearn: "AI가 계정과목 체계를 학습하여 전표를 자동 분류하고 이상 패턴을 감지",
        inputExample: "계정과목 체계 + 전표 데이터 6개월 + 세무 규정 요약",
        outputExample: "영수증 → '복리후생비(급식비), 부가세 별도, 증빙 적합' / ⚠️ '동일 거래처 반복 결제 — 검토 필요'",
        templates: [
          {
            id: "text-finance-voucher",
            name: "전표 자동 분류 AI",
            tier: "pro",
            description: "영수증·전표를 계정과목에 자동 분류하고 이상 거래를 플래그",
            difficulty: "advanced",
            estimatedTime: "45분",
            dataRequirements: [
              { item: "계정과목 체계", type: "text", required: true, description: "회사의 계정과목 코드와 분류 기준", example: "4110 급여, 4210 복리후생비, 4310 여비교통비, 4410 통신비, 5110 소모품비" },
              { item: "기존 전표 데이터 6개월", type: "data", required: true, description: "실제 분류 패턴을 AI가 학습", example: "CSV: 일자, 적요, 금액, 거래처, 계정과목, 부서" },
              { item: "세무 규정 요약", type: "text", required: true, description: "증빙 요건과 세무 규칙 준수", example: "3만원 이상 적격증빙 필수, 접대비 한도, 부가세 매입세액 불공제 항목" },
              { item: "부서별 예산 기준", type: "data", required: false, description: "예산 초과 여부 자동 체크", example: "마케팅팀 월 광고비 500만원, 개발팀 월 클라우드 300만원" },
            ],
            systemPromptPreview: "당신은 '{회사명}' 경리/회계 AI입니다. 영수증과 전표 정보를 받으면 계정과목을 자동 분류합니다. 세무 규정에 따라 증빙 적합성을 판단하고, 이상 거래(동일 거래처 반복, 금액 이상치 등)를 자동으로 플래그합니다. 최종 승인은 반드시 담당자가 합니다...",
            beforeAfter: {
              before: "경비 전표 수동 분류 → 건당 2분",
              after: "AI가 영수증 → 계정과목 자동 분류 (정확도 94%), 이상 거래 자동 플래그",
            },
            guide: [
              "1단계: 회사의 계정과목 체계를 코드, 이름, 사용 기준과 함께 입력하세요",
              "2단계: 기존 6개월 전표 데이터를 CSV로 업로드하세요 (AI가 분류 패턴 학습)",
              "3단계: 세무 규정 요약을 입력하세요 (증빙 요건, 불공제 항목 등)",
              "4단계: (선택) 부서별 예산을 등록하면 예산 초과 건도 자동 경고",
              "5단계: 테스트로 영수증을 넣고 계정과목 분류와 이상 거래 탐지를 확인하세요",
            ],
            keywords: ["회계 AI", "전표 분류", "재무 자동화", "경비 처리", "세무 AI"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  2. 이미지로 학습하기                                             */
  /* ============================================================== */
  {
    id: "image-learning",
    name: "이미지로 학습하기",
    icon: "Image",
    description: "사진, 스크린샷, 도면, X-ray 등 이미지 데이터로 AI를 학습시킵니다",
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    howItWorks: "이미지에 라벨(정답)을 붙여서 AI에게 제공하면, AI가 시각적 패턴을 학습합니다. 이미지 분류, 객체 검출, 불량 판정, 스타일 분석 등에 활용됩니다.",
    inputTypes: ["사진 (JPG, PNG)", "스크린샷", "도면/설계도", "의료 이미지 (X-ray, CT)", "위성/항공 사진", "CCTV 영상 프레임"],
    keyPrinciple: "라벨이 곧 교사 — 이미지에 '이것은 불량', '이것은 양품'이라고 표시하는 사람이 AI의 선생님입니다. 라벨의 정확성 = AI의 정확성",
    researchBasis: "AlexNet 2012 (이미지 분류 혁명), YOLO (실시간 객체 검출), SAM (Segment Anything), GPT-4V (멀티모달)",
    freeFeature: "이미지 업로드 + AI 분석 결과 확인 (월 50장)",
    subcategories: [
      {
        id: "image-manufacturing",
        name: "제조/공장 불량 검출",
        industry: "제조업",
        description: "제품 사진으로 불량/양품을 AI가 판별",
        tier: "pro",
        tags: ["불량검출", "품질관리", "제조", "공장", "비전검사"],
        whatYouLearn: "AI가 제품 사진만 보고 불량 여부를 즉시 판단",
        inputExample: "양품 사진 500장 + 불량 사진 100장 (스크래치, 변색, 찍힘 등)",
        outputExample: "새 제품 사진 → 'NG: 표면 스크래치 (좌측 상단, 신뢰도 94%)'",
        templates: [
          {
            id: "image-mfg-defect",
            name: "제품 불량 검출 AI",
            tier: "pro",
            description: "제품 사진으로 불량/양품을 자동 분류",
            difficulty: "advanced",
            estimatedTime: "2시간+",
            dataRequirements: [
              { item: "양품 이미지 (500장+)", type: "image", required: true, description: "정상 기준 학습", example: "동일 조건(조명, 각도)에서 촬영한 양품 사진" },
              { item: "불량 이미지 (100장+ / 유형별)", type: "image", required: true, description: "불량 패턴 학습", example: "스크래치, 변색, 찍힘, 이물질 등 유형별 분류" },
              { item: "불량 유형 라벨링", type: "text", required: true, description: "불량 분류 기준", example: "A등급: 미세 스크래치, B등급: 변색, C등급: 형상 불량" },
              { item: "촬영 환경 설정", type: "text", required: false, description: "일관된 촬영 기준", example: "조명: 5000K, 거리: 30cm, 각도: 정면 90도" },
            ],
            systemPromptPreview: "당신은 품질 검사 AI입니다. 제품 이미지를 분석하여 양품/불량을 판별하고, 불량인 경우 유형과 위치를 보고합니다...",
            beforeAfter: {
              before: "사람이 육안으로 검사 → 1개당 30초, 피로 시 불량 누락률 15%",
              after: "AI 검사 → 1개당 0.5초, 불량 검출률 97%, 24시간 무중단",
            },
            guide: [
              "1단계: 양품 이미지를 동일 조건에서 500장 이상 촬영하세요",
              "2단계: 불량 이미지를 유형별로 분류하여 라벨링하세요",
              "3단계: AI 모델을 학습시키고, 테스트 이미지로 검증하세요",
              "⚠️ 이미지 품질(조명, 해상도, 각도)이 일관되어야 정확도가 올라갑니다",
            ],
            keywords: ["불량 검출 AI", "품질 검사", "비전 검사", "제조 AI", "스마트 팩토리"],
          },
        ],
      },
      {
        id: "image-retail",
        name: "유통/리테일 상품 인식",
        industry: "유통",
        description: "진열 상태 확인, 상품 분류, 재고 파악을 이미지로",
        tier: "pro",
        tags: ["유통", "리테일", "진열", "재고", "상품인식"],
        whatYouLearn: "AI가 매장 사진만 보고 진열 상태와 재고를 파악",
        inputExample: "매장 진열대 사진 + 상품별 라벨링",
        outputExample: "사진 → '3번 진열대 A상품 3개 남음, B상품 품절, C상품 진열 위치 이탈'",
        templates: [
          {
            id: "image-retail-shelf",
            name: "진열대 모니터링 AI",
            tier: "pro",
            description: "매장 진열 상태를 이미지로 자동 파악",
            difficulty: "advanced",
            estimatedTime: "3시간+",
            dataRequirements: [
              { item: "정상 진열 이미지 (200장+)", type: "image", required: true, description: "기준 진열 상태 학습", example: "SKU별 정상 위치 사진" },
              { item: "비정상 진열 이미지 (50장+)", type: "image", required: true, description: "문제 상황 학습", example: "품절, 위치 이탈, 뒤집힘 등" },
              { item: "상품 라벨 목록 (SKU)", type: "data", required: true, description: "상품 식별", example: "SKU별 상품명, 바코드, 진열 위치" },
            ],
            systemPromptPreview: "당신은 매장 진열 관리 AI입니다. 진열대 사진을 분석하여 품절, 위치 이탈, 진열 상태를 보고합니다...",
            beforeAfter: {
              before: "직원이 매장 순회 → 하루 2회, 놓치는 품절 다수",
              after: "CCTV/사진 → AI 실시간 감지: '3번 진열대 우유 품절, 보충 필요'",
            },
            guide: [
              "1단계: 정상 진열 상태를 다양한 각도에서 촬영하세요",
              "2단계: 각 상품의 위치와 수량을 라벨링하세요",
              "3단계: AI 모델을 학습시키고 비정상 상태 검출을 테스트하세요",
            ],
            keywords: ["진열 관리 AI", "리테일 AI", "재고 자동화", "매장 관리"],
          },
        ],
      },
      {
        id: "image-food",
        name: "식품 품질 검사",
        industry: "식품/농업",
        description: "식재료, 완성품의 품질을 이미지로 자동 판별",
        tier: "pro",
        tags: ["식품", "농업", "품질검사", "선별"],
        whatYouLearn: "AI가 농산물/식품 사진으로 등급을 자동 분류",
        inputExample: "사과 사진 1,000장 (특등~하 등급별 라벨링)",
        outputExample: "사진 → '특등: 크기 적합, 색상 균일, 상처 없음 (신뢰도 92%)'",
        templates: [
          {
            id: "image-food-grade",
            name: "농산물 등급 분류 AI",
            tier: "pro",
            description: "농산물 사진으로 등급을 자동 분류",
            difficulty: "advanced",
            estimatedTime: "3시간+",
            dataRequirements: [
              { item: "등급별 이미지 (등급당 200장+)", type: "image", required: true, description: "등급 기준 학습", example: "특등/상/중/하 각 200장" },
              { item: "등급 판정 기준 문서", type: "text", required: true, description: "판정 규칙", example: "크기, 색상, 상처, 형태 기준" },
            ],
            systemPromptPreview: "당신은 농산물 품질 검사 AI입니다. 이미지를 분석하여 등급을 판정하고 근거를 제시합니다...",
            beforeAfter: {
              before: "사람이 육안 선별 → 시간당 500개, 피로 시 오분류 20%",
              after: "AI 선별 → 시간당 5,000개, 오분류율 3%",
            },
            guide: [
              "1단계: 등급별 이미지를 최소 200장씩 수집하세요",
              "2단계: 등급 판정 기준을 문서화하세요",
              "3단계: AI 모델을 학습시키고 검증하세요",
            ],
            keywords: ["농산물 AI", "품질 분류", "스마트팜", "식품 검사"],
          },
        ],
      },
      // --- 농업/스마트팜 ---
      {
        id: "image-agriculture",
        name: "작물 질병 진단 AI",
        industry: "농업",
        description: "작물 잎 사진으로 질병을 즉시 진단하고 처방을 권장",
        tier: "pro",
        tags: ["농업", "스마트팜", "작물", "질병진단", "병해충"],
        whatYouLearn: "AI가 작물 잎 이미지에서 질병 패턴을 학습하여 초기 단계에서 진단",
        inputExample: "건강한 잎 이미지 300장 + 질병별 이미지 100장 + 질병 분류 가이드",
        outputExample: "사진 → '탄저병 초기 (신뢰도 91%), 이 농약 처방 권장. 주변 작물도 점검 필요'",
        templates: [
          {
            id: "image-agri-disease",
            name: "작물 질병 진단 AI",
            tier: "pro",
            description: "작물 잎 사진을 촬영하면 질병을 즉시 진단하고 대응 방법을 제안",
            difficulty: "advanced",
            estimatedTime: "3시간+",
            dataRequirements: [
              { item: "건강한 잎 이미지 300장+", type: "image", required: true, description: "정상 상태 기준 학습 (다양한 생장 단계, 조명 조건 포함)", example: "토마토 정상 잎: 생장 초기, 중기, 후기 각 100장, 자연광/흐린날 혼합" },
              { item: "질병별 이미지 100장+", type: "image", required: true, description: "질병 유형별 이미지 (초기/중기/후기 단계 포함)", example: "탄저병 100장, 역병 80장, 잎곰팡이 70장 — 각 단계별 촬영" },
              { item: "질병 분류 가이드", type: "text", required: true, description: "질병별 증상, 원인, 전파 경로, 대응 농약/처방", example: "탄저병: 갈색 반점, 고온다습 시 발생, 만코제브 살포 권장" },
              { item: "계절/환경 데이터", type: "data", required: false, description: "기온, 습도, 강수량과 질병 발생의 상관관계 분석", example: "CSV: 날짜, 기온, 습도, 강수량, 질병 발생 여부" },
            ],
            systemPromptPreview: "당신은 스마트팜 작물 진단 AI입니다. 작물 잎 이미지를 분석하여 질병 여부를 판단합니다. 질병이 감지되면 질병명, 진행 단계, 신뢰도를 제시하고, 권장 처방(농약, 관리법)을 안내합니다. 확실하지 않은 경우 반드시 '전문가 확인 권장'을 표시합니다...",
            beforeAfter: {
              before: "농부 육안 판단 → 질병 진행 후 발견, 수확량 30% 손실",
              after: "사진 촬영 → AI 즉시 진단: '탄저병 초기, 이 농약 처방 권장' → 수확량 손실 5%",
            },
            guide: [
              "1단계: 건강한 잎 이미지를 다양한 조건(생장 단계, 조명)에서 300장 이상 수집하세요",
              "2단계: 질병별 이미지를 초기/중기/후기 단계로 분류하여 라벨링하세요",
              "3단계: 질병 분류 가이드를 작성하세요 (증상, 원인, 처방 포함)",
              "4단계: (선택) 기상 데이터를 연동하면 질병 발생 위험 사전 경고 가능",
              "5단계: 실제 농장에서 촬영한 이미지로 진단 정확도를 검증하세요",
            ],
            keywords: ["스마트팜", "작물 질병", "농업 AI", "병해충 진단", "작물 진단"],
          },
        ],
      },
      // --- 건설/안전 ---
      {
        id: "image-safety",
        name: "안전장비 미착용 감지 AI",
        industry: "건설/안전",
        description: "CCTV 영상에서 안전모, 안전조끼 등 PPE 미착용을 실시간 감지",
        tier: "pro",
        tags: ["건설", "안전", "PPE", "CCTV", "감지"],
        whatYouLearn: "AI가 안전장비 착용/미착용 이미지를 학습하여 실시간 위험 감지",
        inputExample: "정상 착용 이미지 500장 + 미착용 이미지 200장 + 안전 규정 문서",
        outputExample: "CCTV 프레임 → '3번 구역 안전모 미착용 작업자 발견 (신뢰도 96%)' → 즉시 경고",
        templates: [
          {
            id: "image-safety-ppe",
            name: "안전장비 미착용 감지 AI",
            tier: "pro",
            description: "건설 현장 CCTV에서 안전모, 안전조끼, 안전화 미착용을 실시간 감지하여 경고",
            difficulty: "advanced",
            estimatedTime: "2시간+",
            dataRequirements: [
              { item: "정상 착용 이미지 500장+", type: "image", required: true, description: "안전모, 안전조끼, 안전화 정상 착용 상태 학습", example: "다양한 각도, 거리, 조명에서 촬영한 정상 착용 작업자 이미지" },
              { item: "미착용/불량 착용 이미지 200장+", type: "image", required: true, description: "안전모 미착용, 턱끈 미체결, 조끼 미착용 등 위반 패턴 학습", example: "안전모 미착용 80장, 턱끈 미체결 50장, 안전조끼 미착용 70장" },
              { item: "안전 규정 문서", type: "text", required: true, description: "현장별 안전장비 착용 기준과 위반 등급", example: "고소작업: 안전모+안전대 필수, 일반구역: 안전모+안전조끼 필수, 위반 시 즉시 작업 중지" },
              { item: "CCTV 설치 위치 정보", type: "text", required: false, description: "구역별 CCTV 위치와 감시 범위 매핑", example: "1번 카메라: 입구(4m 높이, 광각), 2번: 크레인 구역(6m, 줌), 3번: 자재 야적장" },
            ],
            systemPromptPreview: "당신은 건설 현장 안전 관리 AI입니다. CCTV 영상을 실시간으로 분석하여 안전장비(PPE) 미착용 작업자를 감지합니다. 감지 시 구역, 위반 유형, 신뢰도를 보고하고 즉시 경고를 발송합니다. 오탐(False Positive) 최소화를 위해 신뢰도 85% 이상만 경고합니다...",
            beforeAfter: {
              before: "안전 관리자 순회 → 하루 2회, 사각지대 다수",
              after: "CCTV AI 실시간 감지: '3번 구역 안전모 미착용 작업자 발견' → 즉시 경고",
            },
            guide: [
              "1단계: 정상 착용 이미지를 다양한 각도, 거리, 조명 조건에서 500장 이상 수집하세요",
              "2단계: 미착용/불량 착용 이미지를 위반 유형별로 분류하여 200장 이상 라벨링하세요",
              "3단계: 현장 안전 규정을 입력하고, 구역별 필수 장비를 설정하세요",
              "4단계: (선택) CCTV 위치와 감시 범위를 등록하면 구역별 맞춤 감지 가능",
              "5단계: 실제 CCTV 영상으로 감지 정확도를 테스트하고, 오탐률을 확인하세요",
            ],
            keywords: ["건설 AI", "안전 관리", "PPE 감지", "스마트 건설", "산업 안전"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  3. 데이터로 학습하기                                             */
  /* ============================================================== */
  {
    id: "data-learning",
    name: "데이터로 학습하기",
    icon: "BarChart3",
    description: "CSV, 엑셀, 매출 데이터, 센서 데이터 등 정형 데이터로 AI를 학습시킵니다",
    color: "text-amber-600",
    gradient: "from-amber-500 to-orange-600",
    howItWorks: "숫자, 테이블 데이터를 AI에게 제공하면 패턴을 찾고 예측합니다. 수요 예측, 이상 탐지, 고객 세분화, 가격 최적화 등에 활용됩니다.",
    inputTypes: ["CSV/Excel", "POS 데이터", "센서 데이터", "CRM 데이터", "재무 데이터", "로그 데이터"],
    keyPrinciple: "다양성이 일반화를 만든다 — 한쪽으로 편향된 데이터로 학습하면 AI도 편향됩니다. 다양한 시기, 조건의 데이터가 필수입니다.",
    researchBasis: "XGBoost (Kaggle 우승 알고리즘), Prophet (Facebook 시계열 예측), GPT-4 Code Interpreter",
    freeFeature: "CSV 업로드 + AI 자동 분석 리포트 (월 5건)",
    subcategories: [
      {
        id: "data-demand",
        name: "수요 예측 AI",
        industry: "유통/제조/요식업",
        description: "매출/주문 데이터로 미래 수요를 예측",
        tier: "starter",
        tags: ["수요예측", "매출분석", "재고관리", "발주"],
        whatYouLearn: "AI가 과거 패턴에서 미래 수요를 예측하여 재고/발주를 최적화",
        inputExample: "POS 데이터 6개월 + 날씨 데이터 + 행사 캘린더",
        outputExample: "'내일 비 예보 → 따뜻한 메뉴 30% 추가 발주 권장. 예상 폐기율 7%→3%'",
        templates: [
          {
            id: "data-demand-restaurant",
            name: "음식점 수요 예측",
            tier: "starter",
            description: "요일/날씨/시간대별 주문 패턴 분석 및 예측",
            difficulty: "intermediate",
            estimatedTime: "30분",
            dataRequirements: [
              { item: "POS 데이터 (3개월+)", type: "data", required: true, description: "매출 패턴 학습", example: "CSV: 날짜, 시간, 메뉴, 수량, 금액" },
              { item: "날씨 데이터", type: "data", required: false, description: "날씨 영향 분석", example: "기상청 CSV: 날짜, 기온, 강수량, 습도" },
              { item: "주변 행사/이벤트 정보", type: "text", required: false, description: "특이 수요 대비", example: "축제, 입학, 졸업, 공휴일 일정" },
            ],
            systemPromptPreview: "당신은 수요 예측 AI입니다. POS 데이터를 분석하여 요일/시간대/날씨별 주문 패턴을 찾고, 식재료 발주량을 추천합니다...",
            beforeAfter: {
              before: "매일 같은 양 발주 → 폐기율 15%, 품절 잦음",
              after: "'화요일+비 = 라면 수요 35%↑' → 사전 준비 → 폐기율 5%",
            },
            guide: [
              "1단계: POS 데이터를 CSV로 내보내세요 (최소 3개월)",
              "2단계: AI에게 업로드하고 '패턴을 분석해줘'라고 요청하세요",
              "3단계: 날씨 데이터를 추가하면 정확도가 크게 올라갑니다",
            ],
            keywords: ["수요 예측", "POS 분석", "재고 최적화", "음식점 AI", "발주 자동화"],
          },
        ],
      },
      {
        id: "data-anomaly",
        name: "이상 탐지 AI",
        industry: "제조/IT/금융",
        description: "센서, 로그, 거래 데이터에서 이상 패턴을 감지",
        tier: "pro",
        tags: ["이상탐지", "모니터링", "보안", "센서", "품질"],
        whatYouLearn: "AI가 정상 패턴을 학습하고, 이상(anomaly)을 실시간 감지",
        inputExample: "센서 데이터 6개월 (정상) + 이상 발생 기록",
        outputExample: "'3번 설비 진동 주파수 이상 — 정상 범위 대비 23% 초과. 예방 정비 권장'",
        templates: [
          {
            id: "data-anomaly-factory",
            name: "설비 이상 탐지",
            tier: "pro",
            description: "공장 센서 데이터로 설비 고장을 사전 감지",
            difficulty: "advanced",
            estimatedTime: "2시간+",
            dataRequirements: [
              { item: "센서 정상 데이터 (3개월+)", type: "data", required: true, description: "정상 패턴 학습", example: "CSV: 시각, 온도, 진동, 전류, 압력" },
              { item: "고장/이상 발생 기록", type: "data", required: true, description: "이상 패턴 학습", example: "날짜, 설비ID, 고장유형, 원인" },
              { item: "설비 스펙/정상 범위", type: "text", required: false, description: "기준값 설정", example: "온도 20~60℃, 진동 0~5mm/s" },
            ],
            systemPromptPreview: "당신은 설비 모니터링 AI입니다. 센서 데이터를 실시간 분석하여 정상 범위를 벗어나는 패턴을 감지하고 경고합니다...",
            beforeAfter: {
              before: "고장 나야 알아차림 → 비계획 정지 연 평균 72시간",
              after: "AI 사전 감지 → '3일 내 베어링 교체 권장' → 비계획 정지 80% 감소",
            },
            guide: [
              "1단계: 설비 센서 데이터를 3개월 이상 수집하세요",
              "2단계: 과거 고장 기록을 날짜와 함께 정리하세요",
              "3단계: AI가 정상 패턴을 학습하고 이상을 자동 감지합니다",
            ],
            keywords: ["설비 예지보전", "이상 탐지", "스마트 팩토리", "IoT AI", "예방 정비"],
          },
        ],
      },
      // --- 제조 공정관리 ---
      {
        id: "data-manufacturing",
        name: "생산계획 최적화 AI",
        industry: "제조업",
        description: "생산 실적, 설비 가동률, 주문 데이터로 최적 생산 스케줄을 자동 생성",
        tier: "pro",
        tags: ["제조", "생산계획", "MES", "스마트팩토리", "공정"],
        whatYouLearn: "AI가 과거 생산 패턴과 주문 수요를 분석하여 최적 스케줄링",
        inputExample: "생산 실적 데이터 6개월 + 설비 가동률 + 주문 데이터",
        outputExample: "'A라인 08:00~12:00 제품X 500개, B라인 09:00~15:00 제품Y 800개 → 가동률 85%, 납기 100% 충족'",
        templates: [
          {
            id: "data-mfg-planning",
            name: "생산계획 최적화 AI",
            tier: "pro",
            description: "설비, 인력, 주문 조건을 고려하여 최적 생산 스케줄을 자동 생성",
            difficulty: "advanced",
            estimatedTime: "2시간+",
            dataRequirements: [
              { item: "생산 실적 데이터 6개월+", type: "data", required: true, description: "제품별, 라인별 생산량과 소요 시간 패턴 학습", example: "CSV: 날짜, 라인, 제품, 생산량, 시작시간, 종료시간, 작업자수" },
              { item: "설비 가동률 데이터", type: "data", required: true, description: "설비별 가동/비가동 패턴과 정비 주기", example: "CSV: 설비ID, 날짜, 가동시간, 비가동시간, 비가동사유(정비/고장/대기)" },
              { item: "주문/수요 데이터", type: "data", required: true, description: "제품별 주문량, 납기일, 우선순위", example: "CSV: 주문번호, 제품, 수량, 납기일, 고객, 우선순위(긴급/일반)" },
              { item: "원자재 리드타임", type: "data", required: false, description: "원자재 조달 소요 시간을 고려한 생산 가능일 산출", example: "부품A: 국내 3일, 부품B: 해외 14일, 부품C: 안전재고 보유" },
              { item: "불량률 데이터", type: "data", required: false, description: "제품/라인별 불량률을 반영한 실제 양품 산출량 예측", example: "A라인 제품X 불량률 2.3%, B라인 제품Y 불량률 1.8%" },
            ],
            systemPromptPreview: "당신은 '{공장명}' 생산계획 AI입니다. 주문 데이터, 설비 가동률, 원자재 현황을 종합 분석하여 최적 생산 스케줄을 생성합니다. 납기 준수, 가동률 극대화, 재공재고 최소화를 동시에 추구합니다. 긴급 주문 발생 시 실시간 리스케줄링도 지원합니다...",
            beforeAfter: {
              before: "수동 생산계획 → 설비 가동률 65%, 납기 준수율 78%",
              after: "AI 최적 스케줄링 → 가동률 85%, 납기 준수율 96%, 재공재고 30% 감소",
            },
            guide: [
              "1단계: 생산 실적 데이터를 6개월 이상 CSV로 정리하세요 (라인별, 제품별)",
              "2단계: 설비 가동률과 정비 이력 데이터를 업로드하세요",
              "3단계: 현재 주문 데이터를 납기일, 우선순위와 함께 입력하세요",
              "4단계: (선택) 원자재 리드타임과 불량률을 추가하면 정확도가 크게 향상됩니다",
              "5단계: AI가 생성한 스케줄을 기존 방식과 비교하여 효과를 검증하세요",
            ],
            keywords: ["생산계획", "MES", "스마트팩토리", "공정 최적화", "제조 AI"],
          },
        ],
      },
      // --- 보험/금융 ---
      {
        id: "data-insurance",
        name: "보험금 청구 자동 심사 AI",
        industry: "보험/금융",
        description: "보험금 청구 데이터를 자동 심사하고 사기 의심 건을 탐지",
        tier: "pro",
        tags: ["보험", "금융", "심사", "사기탐지", "InsurTech"],
        whatYouLearn: "AI가 과거 청구 패턴과 사기 패턴을 학습하여 자동 심사 및 이상 탐지",
        inputExample: "과거 청구 데이터 1만건 + 심사 기준 매뉴얼 + 사기 의심 패턴",
        outputExample: "청구 → '자동 승인: 단순 외래진료, 기준 충족' / ⚠️ '사기 의심: 동일 사고 다중 청구 패턴 감지'",
        templates: [
          {
            id: "data-insurance-claim",
            name: "보험금 청구 자동 심사 AI",
            tier: "pro",
            description: "보험금 청구를 자동 심사하고, 사기 의심 건을 탐지하여 심사 효율을 극대화",
            difficulty: "advanced",
            estimatedTime: "3시간+",
            dataRequirements: [
              { item: "과거 청구 데이터 1만건+", type: "data", required: true, description: "정상/비정상 청구 패턴을 AI가 학습", example: "CSV: 청구번호, 보험종류, 사고유형, 청구금액, 진단코드, 병원, 심사결과, 지급액" },
              { item: "심사 기준 매뉴얼", type: "text", required: true, description: "보험 약관별 지급 기준과 심사 규칙", example: "실손보험: 급여항목 90% 지급, 비급여 80%, 통원 1회 한도 25만원" },
              { item: "사기 의심 패턴 데이터", type: "data", required: true, description: "과거 사기 적발 사례로 이상 패턴 학습", example: "동일인 반복 청구, 사고일-진료일 불일치, 과다 청구 병원 리스트" },
              { item: "의료비 기준표", type: "data", required: false, description: "적정 의료비 범위 판단 기준", example: "건강보험심사평가원 기준: MRI 평균 30만원, CT 평균 15만원" },
            ],
            systemPromptPreview: "당신은 '{보험사명}' 보험금 심사 AI입니다. 청구 데이터를 분석하여 약관 기준에 따라 지급 적합성을 판단합니다. 단순 건은 자동 승인 추천하고, 사기 의심 패턴(반복 청구, 금액 이상치, 진단-치료 불일치)을 감지하면 상세 심사를 요청합니다. 최종 심사 결정은 반드시 심사역이 합니다...",
            beforeAfter: {
              before: "심사역 수동 심사 → 건당 45분, 사기 탐지율 12%",
              after: "AI 자동 심사 → 건당 3분, 사기 탐지율 68%, 단순 건 자동 승인",
            },
            guide: [
              "1단계: 과거 보험금 청구 데이터를 1만건 이상 정리하세요 (심사 결과 포함)",
              "2단계: 보험 약관별 심사 기준을 구조화하여 입력하세요",
              "3단계: 과거 사기 적발 사례를 패턴별로 분류하여 입력하세요",
              "4단계: (선택) 의료비 기준표를 등록하면 과다 청구 자동 탐지 정확도 향상",
              "5단계: AI 심사 결과를 기존 심사역 판단과 비교하여 정확도를 검증하세요",
            ],
            keywords: ["보험 AI", "보험금 심사", "사기 탐지", "InsurTech", "보험 자동화"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  4. 음성으로 학습하기                                             */
  /* ============================================================== */
  {
    id: "audio-learning",
    name: "음성으로 학습하기",
    icon: "Mic",
    description: "음성 녹음, 전화 통화, 회의 녹음 등 오디오 데이터로 AI를 학습시킵니다",
    color: "text-purple-600",
    gradient: "from-purple-500 to-fuchsia-600",
    howItWorks: "음성을 텍스트로 변환(STT)한 뒤, 텍스트 학습 파이프라인에 연결합니다. 음성 특성(톤, 속도, 감정)까지 분석하여 더 풍부한 학습이 가능합니다.",
    inputTypes: ["음성 녹음 (MP3, WAV)", "전화 통화 녹음", "회의 녹음", "팟캐스트/강의", "고객 상담 녹음"],
    keyPrinciple: "음성에는 텍스트에 없는 정보가 있다 — 톤, 감정, 강조, 망설임. 이것까지 학습하면 더 자연스러운 AI가 됩니다.",
    researchBasis: "Whisper (OpenAI, 99개 언어 STT), Emotion Recognition, Voice Cloning",
    freeFeature: "음성 업로드 → 텍스트 변환 (월 30분)",
    subcategories: [
      {
        id: "audio-callcenter",
        name: "콜센터 AI 학습",
        industry: "전 업종",
        description: "상담 통화 녹음으로 AI 상담원을 학습",
        tier: "pro",
        tags: ["콜센터", "상담", "음성", "VOC", "고객경험"],
        whatYouLearn: "AI가 실제 상담 패턴을 학습하여 응대 품질을 향상",
        inputExample: "상담 녹음 500건 + 상담 매뉴얼 + 품질 평가 기준",
        outputExample: "AI가 상담 녹음을 분석하여 '긍정 톤 72%, 해결률 85%, 개선 포인트: 대기 시간 안내 부족'",
        templates: [
          {
            id: "audio-callcenter-analysis",
            name: "상담 품질 자동 분석",
            tier: "pro",
            description: "상담 녹음을 자동 분석하여 품질 점수와 개선점 제시",
            difficulty: "advanced",
            estimatedTime: "1시간+",
            dataRequirements: [
              { item: "상담 녹음 파일 (100건+)", type: "audio", required: true, description: "실제 상담 패턴 학습", example: "MP3/WAV, 건당 평균 5~10분" },
              { item: "상담 품질 평가 기준", type: "text", required: true, description: "평가 척도 설정", example: "인사 여부, 경청, 해결책 제시, 마무리 인사" },
              { item: "우수 상담 사례 (20건)", type: "audio", required: false, description: "모범 패턴 학습", example: "평가 A등급 받은 상담 녹음" },
            ],
            systemPromptPreview: "당신은 상담 품질 평가 AI입니다. 상담 녹음을 분석하여 평가 기준에 따른 점수와 구체적 개선점을 제시합니다...",
            beforeAfter: {
              before: "QA팀이 월 50건 샘플링 평가 → 전체의 2%만 검토",
              after: "AI가 전 건 자동 분석 → 100% 검토, 실시간 코칭 포인트 제공",
            },
            guide: [
              "1단계: 상담 녹음을 수집하세요 (개인정보 마스킹 필수!)",
              "2단계: 평가 기준을 문서화하세요 (인사, 경청, 해결, 마무리)",
              "3단계: AI가 녹음을 분석하고 점수와 개선점을 자동 제시합니다",
            ],
            keywords: ["콜센터 AI", "상담 품질", "VOC 분석", "음성 분석"],
          },
        ],
      },
      {
        id: "audio-meeting",
        name: "회의록 자동화",
        industry: "전 업종",
        description: "회의 녹음을 자동으로 요약하고 액션 아이템 추출",
        tier: "starter",
        tags: ["회의록", "회의", "요약", "액션아이템"],
        whatYouLearn: "AI가 회의 녹음에서 핵심 내용과 할 일을 자동 추출",
        inputExample: "회의 녹음 1시간 → AI가 5분 요약 + 담당자별 액션 아이템",
        outputExample: "'[결정사항] 4월 출시일 확정, [액션] 김팀장: 디자인 최종안 금요일까지, 박대리: 테스트 일정 공유'",
        templates: [
          {
            id: "audio-meeting-summary",
            name: "회의록 AI",
            tier: "starter",
            description: "회의 녹음 → 구조화된 요약 + 액션 아이템",
            difficulty: "beginner",
            estimatedTime: "10분",
            dataRequirements: [
              { item: "회의 녹음 파일", type: "audio", required: true, description: "녹음 필수", example: "MP3/WAV, 30분~2시간" },
              { item: "참석자 이름 목록", type: "text", required: false, description: "발화자 구분", example: "김팀장, 박대리, 이사원" },
              { item: "회의 양식 (원하는 형태)", type: "text", required: false, description: "출력 형식 설정", example: "1.안건 2.논의내용 3.결정사항 4.액션아이템" },
            ],
            systemPromptPreview: "당신은 회의록 작성 AI입니다. 회의 녹음을 분석하여 안건별 핵심 내용, 결정사항, 담당자별 액션 아이템을 구조화합니다...",
            beforeAfter: {
              before: "1시간 회의 → 누가 뭘 하기로 했더라...? 회의록 작성 30분 추가",
              after: "1시간 회의 → AI 자동 요약: 안건 3개, 결정사항 5개, 액션아이템 8개 (담당자+기한 포함)",
            },
            guide: [
              "1단계: 회의를 녹음하세요 (참석자 동의 필수)",
              "2단계: 녹음 파일을 업로드하세요",
              "3단계: AI가 자동으로 요약 + 액션 아이템을 추출합니다",
            ],
            keywords: ["회의록 AI", "회의 요약", "액션아이템", "업무 효율화"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  5. 행동으로 학습하기 (Physical AI)                               */
  /* ============================================================== */
  {
    id: "action-learning",
    name: "행동으로 학습하기",
    icon: "Cpu",
    description: "로봇, 자율주행, 게임 AI 등 물리 세계에서 행동하는 AI를 학습시킵니다",
    color: "text-red-600",
    gradient: "from-red-500 to-rose-600",
    howItWorks: "시뮬레이터에서 수백만 번 시행착오를 거치거나, 사람의 시범을 보고 모방합니다. Physical AI는 현재 가장 빠르게 성장하는 AI 학습 분야입니다.",
    inputTypes: ["시뮬레이션 환경", "시범 영상 (텔레오퍼레이션)", "센서 데이터 (카메라, LiDAR)", "보상 함수 설계"],
    keyPrinciple: "피드백이 진화를 만든다 — 시행착오 + 보상으로 최적 행동을 배웁니다. 테슬라 FSD: 주행→오류→수집→재학습 반복으로 오차가 수렴합니다.",
    researchBasis: "pi0 (Physical Intelligence), RT-2 (Google DeepMind), Open X-Embodiment (22개 로봇), Tesla FSD v12, LeRobot (HuggingFace)",
    freeFeature: "Physical AI 학습 가이드 + 시뮬레이션 환경 소개",
    subcategories: [
      {
        id: "action-robot",
        name: "로봇 조작 학습",
        industry: "로보틱스/제조",
        description: "로봇 팔의 물체 잡기, 조립, 이동을 AI로 학습",
        tier: "pro",
        tags: ["로봇", "매니퓰레이션", "모방학습", "Physical AI"],
        whatYouLearn: "로봇이 사람처럼 물체를 잡고, 옮기고, 조립하는 행동을 학습",
        inputExample: "텔레오퍼레이션 시범 50회 + 시뮬레이션 100만 에피소드",
        outputExample: "새로운 물체도 잡을 수 있는 범용 그리핑 AI",
        templates: [
          {
            id: "action-robot-manipulation",
            name: "로봇 매니퓰레이션 학습 가이드",
            tier: "pro",
            description: "로봇 팔의 물체 조작을 학습시키는 전체 가이드",
            difficulty: "advanced",
            estimatedTime: "프로젝트 단위",
            dataRequirements: [
              { item: "텔레오퍼레이션 시범 데이터 (50회+)", type: "file", required: true, description: "사람 시범으로 기본 행동 학습", example: "ACT 방식: 로봇을 직접 움직여서 시범" },
              { item: "시뮬레이션 환경 설정", type: "text", required: true, description: "대량 시행착오 훈련", example: "MuJoCo, Isaac Sim, PyBullet 중 선택" },
              { item: "보상 함수 설계", type: "text", required: true, description: "어떤 행동이 좋은지 정의", example: "물체 잡기 성공 +1, 떨어뜨리기 -0.5, 충돌 -1" },
              { item: "실제 로봇 하드웨어 정보", type: "text", required: false, description: "Sim-to-Real 전이", example: "UR5e, Franka Panda, Koch 등" },
            ],
            systemPromptPreview: "이 가이드는 로봇 매니퓰레이션 학습의 전체 파이프라인을 안내합니다: 모방학습(ACT) → 시뮬레이션 RL → Sim-to-Real 전이...",
            beforeAfter: {
              before: "로봇에게 '물체 잡기'를 수천 줄 코드로 프로그래밍 → 새 물체마다 재코딩",
              after: "10분 시범 + AI 학습 → 80~90% 성공률, 새 물체도 일반화 (ACT 논문, Zhao et al. 2023)",
            },
            guide: [
              "1단계: 학습 방법 선택 — 모방학습(ACT) vs 강화학습(RL) vs 하이브리드",
              "2단계: 모방학습이면 텔레오퍼레이션으로 50회 이상 시범을 수집하세요",
              "3단계: 시뮬레이터에서 대량 훈련 후 실제 로봇에 전이 (Sim-to-Real)",
              "4단계: 실제 환경에서 Fine-tuning",
              "참고: LeRobot (HuggingFace) — 오픈소스 로봇 학습 프레임워크 활용 가능",
              "참고: pi0 (Physical Intelligence) — 3B VLM + Flow Matching, 빨래 접기까지 가능",
            ],
            keywords: ["로봇 학습", "매니퓰레이션", "Physical AI", "모방학습", "ACT", "pi0"],
          },
        ],
      },
      {
        id: "action-autonomous",
        name: "자율주행 학습",
        industry: "자동차/모빌리티",
        description: "자율주행 AI의 학습 파이프라인과 원리를 이해",
        tier: "pro",
        tags: ["자율주행", "Tesla", "End-to-End", "시뮬레이션"],
        whatYouLearn: "카메라 영상 → 조향/가속/제동을 AI가 직접 학습하는 원리",
        inputExample: "카메라 영상 수십억 마일 + Shadow Mode 비교 데이터",
        outputExample: "Tesla FSD v12: 규칙 코딩 30만줄 → End-to-End 신경망 1개로 대체",
        templates: [
          {
            id: "action-autonomous-guide",
            name: "자율주행 학습 원리 가이드",
            tier: "pro",
            description: "Tesla FSD를 통해 이해하는 자율주행 학습의 모든 것",
            difficulty: "advanced",
            estimatedTime: "학습 자료",
            dataRequirements: [
              { item: "이 템플릿은 학습 가이드입니다", type: "text", required: true, description: "자율주행 AI 학습 원리를 단계별로 안내", example: "데이터 수집 → 라벨링 → 학습 → 검증 → 배포 → 피드백" },
            ],
            systemPromptPreview: "이 가이드는 자율주행 AI의 학습 파이프라인을 테슬라 사례로 설명합니다...",
            beforeAfter: {
              before: "규칙 기반: if 보행자 then 정지 (30만 줄, Edge Case마다 새 규칙)",
              after: "학습 기반: 카메라 → 신경망 → 조향/가속/제동 (End-to-End, 자동 Edge Case 처리)",
            },
            guide: [
              "1단계: 데이터 수집 — 600만 대 차량이 매일 주행 데이터를 생성",
              "2단계: 자동 라벨링 — 8개 카메라 + 센서로 3D 공간 재구성",
              "3단계: Shadow Mode — AI 판단 vs 사람 판단을 비교, 차이가 큰 케이스 수집",
              "4단계: 학습 — Dojo 슈퍼컴퓨터에서 Edge Case 집중 학습",
              "5단계: OTA 배포 — 전 차량에 새 모델 업데이트",
              "6단계: 반복 — 새 모델 → 새 Edge Case → 재학습 → 오차 수렴",
            ],
            keywords: ["자율주행", "Tesla FSD", "End-to-End", "Physical AI", "Shadow Mode"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  6. 이미지 생성 학습 (LoRA / DreamBooth)                         */
  /* ============================================================== */
  {
    id: "image-gen-learning",
    name: "이미지 생성 학습",
    icon: "Palette",
    description: "LoRA, DreamBooth 등으로 나만의 스타일/캐릭터/제품 이미지를 생성하는 AI를 학습시킵니다",
    color: "text-fuchsia-600",
    gradient: "from-fuchsia-500 to-pink-600",
    howItWorks: "내 사진 10~30장으로 AI 이미지 생성 모델을 파인튜닝합니다. LoRA는 저비용·빠른 학습, DreamBooth는 고품질 결과에 강합니다.",
    inputTypes: ["사진 (10~30장)", "스타일 참조 이미지", "프롬프트 예시", "부정 프롬프트"],
    keyPrinciple: "고품질 참조 이미지 20장이 저화질 100장보다 낫습니다. 배경·조명·각도가 다양할수록 일반화 성능이 올라갑니다.",
    researchBasis: "Hu et al. 2021 (LoRA), Ruiz et al. 2022 (DreamBooth), Rombach et al. 2022 (Stable Diffusion)",
    freeFeature: "프롬프트 가이드라인 + 이미지 준비 체크리스트",
    subcategories: [
      {
        id: "image-gen-product",
        name: "상품 사진 AI 생성",
        industry: "이커머스",
        description: "내 상품 사진 20장으로 다양한 배경·각도의 상품 이미지를 AI로 자동 생성",
        tier: "starter",
        tags: ["상품사진", "이커머스", "LoRA", "AI포토"],
        whatYouLearn: "상품 촬영 없이 다양한 컨셉의 상품 이미지를 AI로 무한 생성",
        inputExample: "흰 배경 상품사진 20장 + '미니멀 감성' 스타일 참조 5장",
        outputExample: "카페 배경, 숲속 배경, 크리스마스 컨셉 등 상품 이미지 무한 생성",
        templates: [
          {
            id: "image-gen-product-photo",
            name: "AI 상품 포토 생성",
            tier: "starter",
            description: "상품 사진을 학습시켜 다양한 배경/시즌별 상품 이미지 자동 생성",
            difficulty: "intermediate",
            estimatedTime: "45분",
            dataRequirements: [
              { item: "상품 사진 (다양한 각도, 20장+)", type: "image", required: true, description: "흰 배경 + 실제 사용 컷 혼합이 최적", example: "정면, 45도, 측면, 클로즈업, 사용 중 사진" },
              { item: "원하는 스타일 참조 이미지 (5장+)", type: "image", required: true, description: "AI가 생성할 느낌의 참조", example: "미니멀 스튜디오, 라이프스타일, 플랫레이 등" },
              { item: "프롬프트 가이드 (스타일 설명)", type: "text", required: true, description: "원하는 분위기를 텍스트로 설명", example: "clean minimal product shot, soft shadow, warm tone" },
              { item: "부정 프롬프트 (피할 요소)", type: "text", required: false, description: "생성 시 피할 요소", example: "blurry, low quality, distorted, watermark" },
            ],
            systemPromptPreview: "이 LoRA 모델은 '{상품명}'의 시각적 특징을 학습했습니다. 다양한 배경과 조명에서 일관된 상품 이미지를 생성합니다...",
            beforeAfter: {
              before: "상품사진 촬영 → 스튜디오 예약(50만원) → 촬영 반나절 → 보정 3일 → 컨셉당 5장",
              after: "AI 학습 1회 → '크리스마스 분위기로 생성' → 10초 만에 20장 → 무한 컨셉 변경 가능",
            },
            guide: [
              "1단계: 상품 사진 20장을 다양한 각도에서 촬영 (흰 배경 권장)",
              "2단계: 원하는 스타일의 참조 이미지를 5장 이상 수집",
              "3단계: LoRA 학습 실행 (약 20분 소요)",
              "4단계: 프롬프트로 다양한 배경/시즌/컨셉의 상품 이미지 생성",
              "5단계: 마음에 드는 이미지 선별 → 쇼핑몰/SNS에 업로드",
            ],
            keywords: ["AI 상품사진", "LoRA", "상품 이미지 생성", "이커머스 AI", "AI 포토"],
          },
        ],
      },
      {
        id: "image-gen-character",
        name: "캐릭터/아바타 AI 생성",
        industry: "크리에이터",
        description: "내 얼굴/캐릭터 사진으로 일관된 AI 아바타와 프로필 이미지를 생성",
        tier: "starter",
        tags: ["캐릭터", "아바타", "DreamBooth", "AI셀카"],
        whatYouLearn: "일관된 얼굴/캐릭터로 다양한 컨셉 이미지를 생성하는 AI",
        inputExample: "셀카 15장 (다양한 조명/각도) + '사이버펑크' 스타일",
        outputExample: "우주 비행사, 중세 기사, 애니메이션 스타일 등 나의 얼굴로 무한 생성",
        templates: [
          {
            id: "image-gen-avatar",
            name: "AI 프로필/아바타 생성",
            tier: "starter",
            description: "내 사진 15장으로 일관된 AI 프로필/아바타 무한 생성",
            difficulty: "beginner",
            estimatedTime: "30분",
            dataRequirements: [
              { item: "얼굴 사진 (다양한 각도/조명, 15장+)", type: "image", required: true, description: "정면, 좌우 45도, 다른 조명 3종 이상", example: "자연광 정면, 실내 좌측, 야외 우측 등" },
              { item: "원하는 스타일 참조", type: "text", required: true, description: "생성할 컨셉 설명", example: "사이버펑크, 르네상스 초상화, 지브리 스타일" },
            ],
            systemPromptPreview: "DreamBooth로 학습된 얼굴 특징을 유지하며 다양한 스타일의 이미지를 생성합니다...",
            beforeAfter: {
              before: "프로필 사진 = 셀카 1장, 모든 SNS에 동일한 사진 사용",
              after: "AI가 내 얼굴로 100가지 컨셉 생성: 비즈니스용, SNS용, 게임용, 크리스마스용...",
            },
            guide: [
              "1단계: 다양한 각도와 조명에서 셀카 15장 촬영",
              "2단계: DreamBooth 학습 (약 30분)",
              "3단계: '우주 비행사 스타일로 나를 그려줘' → AI 생성",
            ],
            keywords: ["AI 아바타", "DreamBooth", "AI 프로필", "AI 셀카", "캐릭터 생성"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  7. 영상/모션 학습                                               */
  /* ============================================================== */
  {
    id: "video-learning",
    name: "영상/모션으로 학습하기",
    icon: "Video",
    description: "영상 생성, 동작 인식, 제스처 학습 등 비디오 기반 AI를 학습시킵니다",
    color: "text-red-600",
    gradient: "from-red-500 to-orange-600",
    howItWorks: "참조 영상과 프롬프트로 AI가 새 영상을 생성하거나, 동작 패턴을 인식하도록 학습합니다. Sora, Runway, Pika 등의 모델이 이 방식입니다.",
    inputTypes: ["참조 영상", "동작 시퀀스", "모션 캡처 데이터", "텍스트 프롬프트"],
    keyPrinciple: "영상 AI는 시간축을 이해해야 합니다. 키프레임 지정과 모션 일관성이 품질을 결정합니다.",
    researchBasis: "Sora (OpenAI 2024), Gen-3 (Runway 2024), Kling (Kuaishou 2024), Pika 1.0 (2024)",
    freeFeature: "영상 프롬프트 가이드 + 참조 영상 체크리스트",
    subcategories: [
      {
        id: "video-gen",
        name: "AI 영상 생성",
        industry: "크리에이터/마케팅",
        description: "텍스트나 이미지를 입력하면 AI가 영상을 자동 생성",
        tier: "pro",
        tags: ["영상생성", "Sora", "Runway", "AI영상"],
        whatYouLearn: "프롬프트만으로 마케팅 영상, 제품 데모, SNS 릴스를 자동 생성",
        inputExample: "'카페에서 라떼를 만드는 과정, 시네마틱, 따뜻한 조명' + 참조 이미지 3장",
        outputExample: "15초 시네마틱 영상: 원두 그라인딩 → 에스프레소 추출 → 라떼아트 → 서빙",
        templates: [
          {
            id: "video-gen-marketing",
            name: "마케팅 영상 AI 생성",
            tier: "pro",
            description: "프롬프트+참조 이미지로 15~60초 마케팅 영상 자동 생성",
            difficulty: "intermediate",
            estimatedTime: "60분",
            dataRequirements: [
              { item: "상품/서비스 참조 이미지 (5장+)", type: "image", required: true, description: "AI가 영상에 반영할 시각적 참조", example: "상품 사진, 매장 인테리어, 브랜드 로고" },
              { item: "영상 스크립트/스토리보드", type: "text", required: true, description: "씬별 구성과 나레이션", example: "씬1: 원두 클로즈업(3초) / 씬2: 핸드드립 과정(5초) / ..." },
              { item: "참조 영상 스타일 (URL 또는 설명)", type: "text", required: true, description: "원하는 영상 분위기", example: "Apple 광고 스타일, 시네마틱, 슬로우모션" },
              { item: "배경음악 분위기", type: "text", required: false, description: "영상 BGM 스타일", example: "Lo-fi, acoustic, upbeat corporate" },
            ],
            systemPromptPreview: "시네마틱 마케팅 영상을 생성합니다. 참조 이미지와 스토리보드를 기반으로 일관된 브랜드 톤의 영상을 만듭니다...",
            beforeAfter: {
              before: "영상 제작 외주 → 견적 300만원 → 촬영 1일 → 편집 2주 → 수정 3회",
              after: "AI 생성 → 프롬프트 입력 5분 → 15초 영상 3분 → 무한 수정 → 비용 0원",
            },
            guide: [
              "1단계: 참조 이미지(상품, 매장)를 5장 이상 준비",
              "2단계: 씬별 스토리보드를 텍스트로 작성",
              "3단계: 원하는 스타일의 참조 영상을 지정",
              "4단계: AI가 영상 생성 (약 2~5분)",
              "5단계: 결과 확인 후 프롬프트 수정으로 재생성",
            ],
            keywords: ["AI 영상", "마케팅 영상", "Sora", "Runway", "영상 자동화"],
          },
        ],
      },
      {
        id: "video-motion",
        name: "동작/제스처 인식 AI",
        industry: "헬스케어/스포츠/제조",
        description: "영상에서 사람의 동작을 인식하고 분석하는 AI를 학습",
        tier: "pro",
        tags: ["동작인식", "포즈추정", "스포츠AI", "안전관리"],
        whatYouLearn: "자세 교정, 운동 폼 분석, 작업자 안전 모니터링 등 동작 기반 AI",
        inputExample: "운동 영상 100개 + 올바른/잘못된 자세 라벨링",
        outputExample: "실시간 자세 분석: '무릎이 발끝을 넘었습니다. 각도를 5도 줄여주세요'",
        templates: [
          {
            id: "video-motion-fitness",
            name: "운동 자세 교정 AI",
            tier: "pro",
            description: "운동 영상을 학습시켜 실시간으로 자세를 분석하고 교정하는 AI",
            difficulty: "advanced",
            estimatedTime: "2시간",
            dataRequirements: [
              { item: "올바른 자세 영상 (운동별 20개+)", type: "image", required: true, description: "전문 트레이너의 시범 영상", example: "스쿼트 정면/측면/후면, 데드리프트 측면 등" },
              { item: "잘못된 자세 예시 (운동별 10개+)", type: "image", required: true, description: "흔한 실수 패턴", example: "무릎 과신전, 허리 라운딩, 어깨 승모근 사용 등" },
              { item: "관절 각도 기준표", type: "text", required: true, description: "운동별 정상/위험 각도 범위", example: "스쿼트: 무릎각도 90~120도 정상, 70도 미만 위험" },
              { item: "교정 멘트 가이드", type: "text", required: false, description: "자세별 피드백 문구", example: "'무릎이 안쪽으로 모이고 있어요. 발끝 방향으로 밀어주세요'" },
            ],
            systemPromptPreview: "실시간 포즈 추정으로 관절 각도를 분석하고, 운동별 안전 범위를 벗어나면 즉시 교정 피드백을 제공합니다...",
            beforeAfter: {
              before: "PT 비용 월 40만원, 혼자 운동하면 자세 확인 불가 → 부상 위험",
              after: "AI가 실시간 자세 분석: '허리가 둥글어졌어요! 코어에 힘주고 가슴을 펴주세요' → 부상 70% 감소",
            },
            guide: [
              "1단계: 운동별 올바른/잘못된 자세 영상을 수집",
              "2단계: 관절 포인트 자동 추출 (MediaPipe/OpenPose)",
              "3단계: 정상/위험 각도 기준 라벨링",
              "4단계: 분류 모델 학습",
              "5단계: 실시간 웹캠 피드로 테스트",
            ],
            keywords: ["운동 AI", "자세 교정", "포즈 추정", "헬스 AI", "MediaPipe"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  8. 음성 클로닝/TTS 학습                                         */
  /* ============================================================== */
  {
    id: "voice-clone-learning",
    name: "음성 클로닝/TTS 학습",
    icon: "AudioLines",
    description: "내 목소리를 AI에게 학습시켜 텍스트를 내 음성으로 읽어주는 TTS를 만듭니다",
    color: "text-violet-600",
    gradient: "from-violet-500 to-purple-600",
    howItWorks: "음성 샘플 3~30분으로 내 목소리의 톤, 억양, 발음 패턴을 학습합니다. 학습 후 텍스트만 입력하면 내 목소리로 자동 생성됩니다.",
    inputTypes: ["음성 녹음 (WAV/MP3)", "대본 텍스트", "스타일 지시 (감정, 속도)"],
    keyPrinciple: "깨끗한 녹음 환경이 품질의 80%. 배경 소음 없는 3분 녹음이 소음 섞인 30분보다 낫습니다.",
    researchBasis: "VALL-E (Microsoft 2023), ElevenLabs, Coqui TTS, OpenAI TTS",
    freeFeature: "녹음 가이드라인 + 대본 템플릿",
    subcategories: [
      {
        id: "voice-clone-tts",
        name: "내 목소리 TTS",
        industry: "크리에이터/교육",
        description: "내 목소리로 유튜브 나레이션, 팟캐스트, 오디오북을 자동 생성",
        tier: "starter",
        tags: ["음성클로닝", "TTS", "나레이션", "팟캐스트"],
        whatYouLearn: "텍스트만 입력하면 내 목소리로 자동 읽어주는 AI TTS",
        inputExample: "내 목소리 녹음 10분 + 동일 대본 텍스트",
        outputExample: "블로그 글을 입력하면 내 목소리로 5분 팟캐스트 자동 생성",
        templates: [
          {
            id: "voice-clone-creator",
            name: "크리에이터 음성 클론",
            tier: "starter",
            description: "유튜브/팟캐스트 나레이션을 내 목소리 AI로 자동 생성",
            difficulty: "beginner",
            estimatedTime: "20분",
            dataRequirements: [
              { item: "깨끗한 음성 녹음 (3분+)", type: "audio", required: true, description: "조용한 환경, 일정한 거리, 자연스러운 톤", example: "마이크 20cm 거리, 배경소음 없이, 평소 말투로 대본 읽기" },
              { item: "녹음 대본 텍스트", type: "text", required: true, description: "녹음한 내용과 동일한 텍스트", example: "다양한 문장 구조 포함: 평서문, 의문문, 감탄문 등" },
              { item: "스타일 지시", type: "text", required: false, description: "원하는 음성 스타일", example: "밝고 에너지 있는 유튜버 톤 / 차분한 팟캐스트 톤" },
            ],
            systemPromptPreview: "학습된 화자의 음성 특성(톤, 피치, 속도, 억양)을 유지하며 새로운 텍스트를 음성으로 변환합니다...",
            beforeAfter: {
              before: "유튜브 나레이션 10분 → 녹음 30분 + 편집 1시간 + NG 재녹음",
              after: "대본 입력 → AI가 내 목소리로 10분 나레이션 → 30초 생성 → 감정/속도 조절 가능",
            },
            guide: [
              "1단계: 조용한 환경에서 제공된 대본을 자연스럽게 읽기 (3분)",
              "2단계: 녹음 파일 + 대본 텍스트 업로드",
              "3단계: AI 음성 모델 학습 (약 10분)",
              "4단계: 새 텍스트 입력 → 내 목소리로 자동 생성",
            ],
            keywords: ["음성 클로닝", "TTS", "AI 나레이션", "유튜브 음성", "팟캐스트 AI"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  9. 멀티모달 AI 학습                                             */
  /* ============================================================== */
  {
    id: "multimodal-learning",
    name: "멀티모달 AI 학습",
    icon: "Combine",
    description: "텍스트+이미지+음성을 통합 학습시켜 복합적인 이해와 생성이 가능한 AI를 만듭니다",
    color: "text-amber-600",
    gradient: "from-amber-500 to-orange-600",
    howItWorks: "여러 종류의 데이터(텍스트, 이미지, 음성, 비디오)를 동시에 학습시켜 AI가 맥락을 종합적으로 이해합니다. GPT-4V, Gemini, Claude의 핵심 기술입니다.",
    inputTypes: ["텍스트+이미지 쌍", "음성+텍스트 쌍", "영상+설명 쌍"],
    keyPrinciple: "모달리티 간 정렬(Alignment)이 핵심. 이미지와 설명이 정확히 매칭되어야 합니다.",
    researchBasis: "GPT-4V (OpenAI 2023), Gemini (Google 2024), Claude 3.5 (Anthropic 2024), LLaVA (2023)",
    freeFeature: "멀티모달 데이터 준비 가이드 + 정렬 체크리스트",
    subcategories: [
      {
        id: "multimodal-product",
        name: "멀티모달 상품 이해 AI",
        industry: "이커머스",
        description: "상품 사진+설명+리뷰를 통합 학습시켜 이미지만 보고 설명을 생성하는 AI",
        tier: "pro",
        tags: ["멀티모달", "상품설명", "이미지인식", "자동생성"],
        whatYouLearn: "상품 사진을 올리면 자동으로 상세 설명, SEO 키워드, SNS 캡션을 생성",
        inputExample: "상품 사진 100장 + 각 사진의 상세 설명 + 고객 리뷰",
        outputExample: "새 상품 사진 1장 올리면 → 상세페이지 설명 + 인스타 캡션 + 해시태그 자동 생성",
        templates: [
          {
            id: "multimodal-product-desc",
            name: "사진→상품설명 자동 생성",
            tier: "pro",
            description: "상품 사진만 올리면 상세 설명, SEO, SNS 콘텐츠까지 자동 생성",
            difficulty: "advanced",
            estimatedTime: "90분",
            dataRequirements: [
              { item: "상품 사진 + 설명 쌍 (50세트+)", type: "image", required: true, description: "사진과 대응하는 상세 설명이 정확히 매칭", example: "사진: 린넨 셔츠 정면 → 설명: '프리미엄 리넨 100%, 여름 통기성 최적...'" },
              { item: "카테고리별 설명 스타일 가이드", type: "text", required: true, description: "카테고리마다 강조 포인트 다름", example: "의류: 소재+핏+스타일링 / 가전: 스펙+기능+사용 시나리오" },
              { item: "SEO 키워드 목록", type: "text", required: false, description: "검색 최적화 키워드", example: "린넨셔츠, 여름셔츠, 남자린넨, 오버핏셔츠" },
            ],
            systemPromptPreview: "상품 이미지를 분석하여 소재, 색상, 디자인 특징을 파악하고, 브랜드 톤에 맞는 상세 설명을 자동 생성합니다...",
            beforeAfter: {
              before: "상품 100개 상세페이지 작성 → 카피라이터 2주 + 비용 200만원",
              after: "사진만 올리면 → 상세 설명 + SEO + SNS 캡션 자동 → 100개 1시간 완료",
            },
            guide: [
              "1단계: 기존 상품 사진+설명 50세트 준비",
              "2단계: 카테고리별 설명 스타일 가이드 작성",
              "3단계: 이미지-텍스트 정렬 검증",
              "4단계: 모델 학습",
              "5단계: 새 상품 사진으로 테스트",
            ],
            keywords: ["멀티모달 AI", "상품설명 자동화", "이미지→텍스트", "AI 상세페이지", "SEO 자동화"],
          },
        ],
      },
    ],
  },

  /* ============================================================== */
  /*  10. AI 에이전트 학습                                             */
  /* ============================================================== */
  {
    id: "agent-learning",
    name: "AI 에이전트 학습",
    icon: "Workflow",
    description: "자율적으로 도구를 사용하고, 판단하고, 실행하는 AI 에이전트를 만듭니다",
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    howItWorks: "AI에게 도구(검색, DB, API 등)를 연결하고, 언제 어떤 도구를 쓸지 학습시킵니다. N8N, LangChain, CrewAI 기반의 자동화 워크플로우입니다.",
    inputTypes: ["도구 정의 (API/함수)", "작업 지시서", "판단 기준 예시", "워크플로우 설계"],
    keyPrinciple: "에이전트의 핵심은 '판단력'입니다. 도구를 쓸지 말지, 어떤 순서로 쓸지를 결정하는 예시가 가장 중요합니다.",
    researchBasis: "ReAct (Yao et al. 2022), Toolformer (Schick et al. 2023), AutoGPT (2023), Claude MCP (2024)",
    freeFeature: "에이전트 설계 가이드 + 도구 연결 체크리스트",
    subcategories: [
      {
        id: "agent-business",
        name: "비즈니스 자동화 에이전트",
        industry: "전 업종",
        description: "이메일 답변, 데이터 수집, 리포트 생성 등을 자동으로 처리하는 AI 에이전트",
        tier: "pro",
        tags: ["AI에이전트", "자동화", "N8N", "워크플로우"],
        whatYouLearn: "사람의 개입 없이 반복 업무를 자동으로 판단하고 실행하는 AI",
        inputExample: "업무 프로세스 문서 + 사용할 도구(이메일, DB, 슬랙) + 판단 기준",
        outputExample: "고객 문의 → AI가 자동 분류 → 간단한 건 자동 답변 → 복잡한 건 담당자 슬랙 알림",
        templates: [
          {
            id: "agent-cs-automation",
            name: "고객 문의 자동 처리 에이전트",
            tier: "pro",
            description: "고객 문의를 자동 분류하고, 간단한 건 즉시 답변, 복잡한 건 담당자 배정",
            difficulty: "advanced",
            estimatedTime: "2시간",
            dataRequirements: [
              { item: "문의 분류 기준 (카테고리별 예시)", type: "text", required: true, description: "AI가 문의를 자동 분류하는 기준", example: "배송: '언제 오나요, 택배, 배송지' / 환불: '환불, 취소, 반품' / 상품: '사이즈, 색상, 재고'" },
              { item: "카테고리별 자동 답변 템플릿", type: "text", required: true, description: "분류 후 자동 답변할 내용", example: "배송 문의 → '주문번호 확인 후 배송 현황을 안내드리겠습니다'" },
              { item: "에스컬레이션 규칙", type: "text", required: true, description: "사람에게 넘기는 기준", example: "감정 부정 3회 이상, 금액 10만원+, 법적 언급" },
              { item: "연결할 도구 목록", type: "text", required: false, description: "에이전트가 사용할 외부 도구", example: "주문 DB 조회, 슬랙 알림, 이메일 발송, CRM 업데이트" },
            ],
            systemPromptPreview: "고객 문의를 분석하여 카테고리를 판단하고, 적절한 도구를 사용하여 자동 처리합니다. 복잡한 건은 담당자에게 배정합니다...",
            beforeAfter: {
              before: "CS 담당자가 하루 200건 수동 처리 → 평균 응답 4시간 → 야근 일상",
              after: "AI가 70% 자동 처리 → 평균 응답 30초 → 사람은 복잡한 30%만 집중 → 만족도 40% 상승",
            },
            guide: [
              "1단계: 기존 문의를 카테고리별로 분류 (최소 5개 카테고리)",
              "2단계: 카테고리별 자동 답변 템플릿 작성",
              "3단계: 에스컬레이션(사람 전달) 규칙 정의",
              "4단계: 도구 연결 (DB 조회, 슬랙, 이메일)",
              "5단계: 실제 문의로 테스트 → 피드백 → 규칙 개선",
            ],
            keywords: ["AI 에이전트", "CS 자동화", "워크플로우", "N8N", "자동 분류"],
          },
        ],
      },
    ],
  },
];

/* ================================================================== */
/*  유틸리티 함수                                                       */
/* ================================================================== */

/** 전체 템플릿 수 */
export function getTotalTemplateCount(): number {
  let count = 0;
  for (const cat of CATALOG) {
    for (const sub of cat.subcategories) {
      count += sub.templates.length;
    }
  }
  return count;
}

/** 무료 템플릿만 */
export function getFreeTemplates(): LearnTemplate[] {
  const result: LearnTemplate[] = [];
  for (const cat of CATALOG) {
    for (const sub of cat.subcategories) {
      for (const tpl of sub.templates) {
        if (tpl.tier === "free") result.push(tpl);
      }
    }
  }
  return result;
}

/** 키워드로 검색 */
export function searchTemplates(query: string): LearnTemplate[] {
  const q = query.toLowerCase();
  const result: LearnTemplate[] = [];
  for (const cat of CATALOG) {
    for (const sub of cat.subcategories) {
      for (const tpl of sub.templates) {
        const searchable = [tpl.name, tpl.description, ...tpl.keywords, ...sub.tags].join(" ").toLowerCase();
        if (searchable.includes(q)) result.push(tpl);
      }
    }
  }
  return result;
}

/** 상위 카테고리 ID로 하위 템플릿 전체 */
export function getTemplatesByCategory(categoryId: string): LearnTemplate[] {
  const cat = CATALOG.find((c) => c.id === categoryId);
  if (!cat) return [];
  const result: LearnTemplate[] = [];
  for (const sub of cat.subcategories) {
    result.push(...sub.templates);
  }
  return result;
}

/** 업종으로 필터 */
export function getTemplatesByIndustry(industry: string): LearnTemplate[] {
  const q = industry.toLowerCase();
  const result: LearnTemplate[] = [];
  for (const cat of CATALOG) {
    for (const sub of cat.subcategories) {
      if (sub.industry.toLowerCase().includes(q) || sub.industry === "전 업종") {
        result.push(...sub.templates);
      }
    }
  }
  return result;
}
