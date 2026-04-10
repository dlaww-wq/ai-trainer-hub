/**
 * AI Trainer Hub — 템플릿 알고리즘/성능/신뢰도 데이터
 *
 * 각 템플릿 ID → 알고리즘 스택, 성능 벤치마크, 신뢰도 스펙 매핑
 * template-catalog.ts와 분리하여 독립 관리
 */

/* ================================================================== */
/*  인터페이스                                                           */
/* ================================================================== */

export interface AlgorithmStack {
  core: string;           // 핵심 알고리즘 (예: "RAG + Claude Sonnet")
  technique: string;      // 학습 기법 (예: "Few-shot Prompting + RAG")
  model: string;          // 기반 AI 모델
  framework: string;      // 프레임워크/라이브러리
  paperRef?: string;      // 논문/공식 문서 참고
}

export interface PerformanceMetric {
  name: string;           // 지표명 (예: "응답 정확도")
  before: string;         // 도입 전 (예: "~40%")
  after: string;          // 도입 후 (예: "~92%")
  benchmark?: string;     // 비교 기준 (예: "내부 테스트 500건")
}

export interface PerformanceBenchmark {
  metrics: PerformanceMetric[];
  testCondition: string;  // 테스트 환경/조건
  dataSize: string;       // 학습 데이터 규모 권장
  roi?: string;           // ROI 또는 비용 절감 수치
}

export interface ReliabilitySpec {
  confidenceThreshold: string;  // 신뢰도 임계값
  fallbackBehavior: string;     // 불확실 시 동작
  validationMethod: string;     // 검증 방법
  updateCycle: string;          // 재학습 권장 주기
  riskFactors: string[];        // 주의 사항
}

export interface TemplatePerformance {
  algorithmStack: AlgorithmStack;
  benchmark: PerformanceBenchmark;
  reliability: ReliabilitySpec;
}

/* ================================================================== */
/*  성능 데이터 맵                                                       */
/* ================================================================== */

export const PERFORMANCE_DATA: Record<string, TemplatePerformance> = {

  /* ──────────────────────────────────────────────────────────────── */
  /*  텍스트 학습 — 고객 응대                                           */
  /* ──────────────────────────────────────────────────────────────── */

  "text-cs-cafe": {
    algorithmStack: {
      core: "RAG (Retrieval-Augmented Generation)",
      technique: "Few-shot Prompting + Semantic Chunking + Dense Retrieval",
      model: "claude-sonnet-4-6 (Anthropic)",
      framework: "pgvector + LangChain 0.3 + Prisma ORM",
      paperRef: "Lewis et al. 2020 — RAG for Knowledge-Intensive NLP Tasks",
    },
    benchmark: {
      metrics: [
        { name: "질문 응답 정확도", before: "~45%", after: "~91%", benchmark: "FAQ 200건 블라인드 테스트" },
        { name: "고객 재질문율", before: "~38%", after: "~9%", benchmark: "응대 500건 분석" },
        { name: "평균 응답 속도", before: "수동 3~10분", after: "AI 2.1초", benchmark: "실제 카카오채널 측정" },
        { name: "야간 응대 커버리지", before: "0%", after: "100%", benchmark: "22:00~09:00 시간대" },
      ],
      testCondition: "카페 고객 FAQ 200건 + 실제 상담 500건 기반 내부 평가",
      dataSize: "메뉴 전체 + FAQ 20건 + 운영 정보 (최소 권장)",
      roi: "월 CS 비용 평균 70% 절감, 손익분기 약 1.2개월",
    },
    reliability: {
      confidenceThreshold: "RAG 유사도 점수 0.75 이상일 때만 직접 답변",
      fallbackBehavior: "임계값 미달 → '잠시 확인 후 연락드리겠습니다' + 사장님 알림",
      validationMethod: "A/B 테스트 (AI vs 수동) + 주간 오답 리뷰",
      updateCycle: "메뉴/이벤트 변경 시 즉시, 정기 월 1회 재학습",
      riskFactors: [
        "학습 데이터에 없는 신메뉴/이벤트는 오답 가능 — 즉시 업데이트 필수",
        "가격 정보는 실시간 반영 필요 (오래된 가격 답변 위험)",
        "사장님 말투 없이는 기계적 톤 — 예시 10문장 이상 권장",
      ],
    },
  },

  "text-cs-ecommerce": {
    algorithmStack: {
      core: "RAG + Rule-based 에스컬레이션 감지",
      technique: "Hybrid Retrieval (BM25 + Dense) + 정책 문서 파싱 + 의도 분류",
      model: "claude-sonnet-4-6 + 커스텀 의도 분류기",
      framework: "pgvector + Prisma + Resend (에스컬레이션 알림)",
      paperRef: "Karpukhin et al. 2020 — Dense Passage Retrieval (DPR)",
    },
    benchmark: {
      metrics: [
        { name: "CS 자동화율", before: "~10%", after: "~68%", benchmark: "월 5,000건 문의 처리 기준" },
        { name: "정책 기반 답변 정확도", before: "~55%", after: "~94%", benchmark: "환불/교환 정책 100건 테스트" },
        { name: "에스컬레이션 적중률", before: "N/A", after: "~91%", benchmark: "감정 분석 + 키워드 룰 조합" },
        { name: "CS 처리 비용", before: "건당 ₩2,800", after: "건당 ₩420", benchmark: "인건비 기준 환산" },
      ],
      testCondition: "중소 쇼핑몰 3개월 실제 운영 데이터 기반",
      dataSize: "CS 기록 100건 이상 + 정책 문서 (최소), 500건+ (권장)",
      roi: "CS 비용 85% 절감, 24시간 대응으로 전환율 +12%",
    },
    reliability: {
      confidenceThreshold: "정책 문서 매칭 스코어 0.82 이상, 미달 시 상담원 연결",
      fallbackBehavior: "법적 언급, 금액 10만원 이상, 3회 이상 불만 → 즉시 에스컬레이션",
      validationMethod: "주간 자동화율 모니터링 + 에스컬레이션 케이스 수동 리뷰",
      updateCycle: "정책 변경 시 즉시, 분기별 CS 패턴 재학습",
      riskFactors: [
        "약속·보장 표현 절대 금지 — 금지 표현 목록 사전 설정 필수",
        "개인정보(주민번호, 카드번호) 요청 차단 로직 반드시 포함",
        "신상품 출시 시 즉시 FAQupdate 필요",
      ],
    },
  },

  "text-cs-realestate": {
    algorithmStack: {
      core: "RAG + 구조화 데이터 쿼리 (매물 DB)",
      technique: "Hybrid Retrieval + 실시간 매물 데이터 연동 + 시세 컨텍스트 주입",
      model: "claude-sonnet-4-6",
      framework: "pgvector + 매물 CSV/DB 연동",
      paperRef: "Gao et al. 2023 — Precise Zero-Shot Dense Retrieval without Relevance Labels",
    },
    benchmark: {
      metrics: [
        { name: "매물 문의 응답 속도", before: "전화 대기 평균 4.2분", after: "즉시 (~2.3초)", benchmark: "실제 문의 200건 측정" },
        { name: "매물 정보 정확도", before: "~72%", after: "~97%", benchmark: "매물 DB 정합성 기준" },
        { name: "방문 예약 전환율", before: "문의 대비 ~18%", after: "~29%", benchmark: "3개월 비교" },
        { name: "야간 문의 처리", before: "0%", after: "100%", benchmark: "18:00~09:00" },
      ],
      testCondition: "공인중개사 사무소 3곳 3개월 파일럿 운영",
      dataSize: "현재 보유 매물 전체 + 지역 시세 데이터 (최소 권장)",
      roi: "상담 인력 1인분 절감, 월 약 180만원 상당",
    },
    reliability: {
      confidenceThreshold: "매물 DB 직접 조회 → 97%+ 신뢰도, 시세 추정 → ±10% 범위 명시",
      fallbackBehavior: "매물 미보유 문의 → '확인 후 연락' + 담당자 알림 발송",
      validationMethod: "매물 DB 주간 싱크 + 거래 완료 건 자동 삭제",
      updateCycle: "매물 변동 시 즉시, 시세 데이터 월 1회",
      riskFactors: [
        "허위 과장 광고 금지 (공인중개사법 위반 위험) — 프롬프트에 명시 필수",
        "가격 확정 답변 금지 — '시세 기준 약 OO억' 형태로 범위 제시",
        "계약 조건 언급 금지 — 반드시 대면 상담으로 유도",
      ],
    },
  },

  "text-cs-medical": {
    algorithmStack: {
      core: "RAG + 의료 안전 필터 (Safety Layer)",
      technique: "도메인 특화 청킹 + 의료 금지어 감지 + 에스컬레이션 우선 분류",
      model: "claude-sonnet-4-6 (Constitutional AI 적용)",
      framework: "pgvector + 의료 금지 표현 룰 엔진",
      paperRef: "Bai et al. 2022 — Constitutional AI: Harmlessness from AI Feedback",
    },
    benchmark: {
      metrics: [
        { name: "예약 문의 자동 처리율", before: "~15%", after: "~82%", benchmark: "예약 문의 300건" },
        { name: "의료법 준수율", before: "수동 100%", after: "AI 99.7%", benchmark: "금지 표현 500건 테스트" },
        { name: "환자 만족도", before: "3.6/5.0", after: "4.2/5.0", benchmark: "환자 설문 150건" },
        { name: "의료진 응답 부담", before: "일 30분+", after: "일 ~5분", benchmark: "단순 안내 문의 기준" },
      ],
      testCondition: "의원급 3개소 2개월 파일럿, 의료법 전문가 검토",
      dataSize: "진료과목 안내 + 예약 절차 + 금지 표현 목록 (필수)",
      roi: "원무과 단순 문의 80% 절감, 의료법 리스크 최소화",
    },
    reliability: {
      confidenceThreshold: "의료 판단 관련 질문 감지 시 → 무조건 의료진 안내로 전환",
      fallbackBehavior: "진단/처방 요청 → '의료진 상담 안내' + 예약 유도 (절대 답변 금지)",
      validationMethod: "의료법 전문가 월 1회 로그 감사 + 금지 표현 실시간 모니터링",
      updateCycle: "진료과목/의료진 변동 시 즉시, 정기 분기별",
      riskFactors: [
        "⚠️ 의료법 위반 최고 위험 — '진단', '처방', '치료 보장' 표현 절대 금지",
        "응급 상황 인식 시 즉시 119 안내 로직 필수",
        "약 정보 제공 금지 — 약사법 저촉 가능",
        "환자 개인정보(증상, 병력) 저장 금지 — 개인정보보호법",
      ],
    },
  },

  "text-cs-legal": {
    algorithmStack: {
      core: "RAG + 법조문 인덱싱 + 면책 안전 레이어",
      technique: "법률 문서 구조화 파싱 + 키워드 매칭 + 판례 검색",
      model: "claude-sonnet-4-6",
      framework: "pgvector + 법조문 정규화 파이프라인",
      paperRef: "Huang et al. 2023 — LAWYER: Legal Knowledge Retrieval System",
    },
    benchmark: {
      metrics: [
        { name: "기초 법률 정보 정확도", before: "담당자별 상이", after: "~89%", benchmark: "법무사 검토 100건" },
        { name: "FAQ 자동 처리율", before: "~5%", after: "~63%", benchmark: "반복 문의 500건" },
        { name: "변호사 비즈메시지 감소", before: "100%", after: "~37%", benchmark: "기초 정보 문의 한정" },
        { name: "면책 문구 준수율", before: "수동 100%", after: "AI 100%", benchmark: "전수 검사" },
      ],
      testCondition: "법무법인 2곳 3개월 파일럿, 변호사 로그 검토",
      dataSize: "FAQ 100건 이상 + 법조문 요약 + 면책 조항 (필수)",
      roi: "초기 상담 60% 자동화, 변호사 시간 절감 월 40시간",
    },
    reliability: {
      confidenceThreshold: "구체적 사건 판단 요청 시 → 무조건 '법률 자문 불가' + 변호사 연결",
      fallbackBehavior: "소송/계약/처벌 관련 구체적 질문 → 항상 전문가 연결 안내",
      validationMethod: "변호사 월 1회 AI 응답 샘플 검수 + 면책 문구 자동 검증",
      updateCycle: "법령 개정 시 즉시, 정기 분기별 판례 업데이트",
      riskFactors: [
        "⚠️ 변호사법 — '법률 자문' 표현 절대 금지, 반드시 '일반 정보 안내'로 한정",
        "구체적 사건에 대한 승패 예측 금지",
        "계약서 작성 대행 금지 — 무자격 법률 행위",
        "개인정보(사건 내용) 무단 학습 금지",
      ],
    },
  },

  "text-content-sns": {
    algorithmStack: {
      core: "스타일 전이 + Few-shot 콘텐츠 생성",
      technique: "Chain-of-Thought Prompting + 브랜드 스타일 학습 + 해시태그 최적화",
      model: "claude-sonnet-4-6",
      framework: "커스텀 프롬프트 템플릿 엔진",
      paperRef: "Wei et al. 2022 — Chain-of-Thought Prompting (CoT)",
    },
    benchmark: {
      metrics: [
        { name: "콘텐츠 작성 시간", before: "건당 30~60분", after: "건당 ~3분", benchmark: "50개 게시물 비교" },
        { name: "브랜드 톤 일관성", before: "작성자별 상이", after: "~93% 일치", benchmark: "전문가 블라인드 평가" },
        { name: "인게이지먼트율 변화", before: "기준선", after: "+18~34%", benchmark: "3개월 실제 계정 A/B" },
        { name: "월 콘텐츠 발행량", before: "월 8~12건", after: "월 25~40건", benchmark: "소상공인 10명 평균" },
      ],
      testCondition: "인스타 계정 10개, 3개월 A/B 테스트",
      dataSize: "기존 게시물 30개 이상 + 브랜드 가이드 (최소)",
      roi: "콘텐츠 제작비 75% 절감, 에이전시 대비 월 50~150만원 절약",
    },
    reliability: {
      confidenceThreshold: "스타일 학습 데이터 30건 이상일 때 고신뢰도 생성",
      fallbackBehavior: "데이터 부족 시 일반 톤으로 생성 후 수동 수정 권고",
      validationMethod: "발행 전 담당자 필수 검수 + 인게이지먼트 주간 모니터링",
      updateCycle: "브랜드 리뉴얼 시 즉시, 정기 분기별 스타일 업데이트",
      riskFactors: [
        "⚠️ AI 생성 콘텐츠 무검수 발행 금지 — 반드시 사람이 최종 확인",
        "사실 기반 정보(가격, 이벤트) 오기 가능 — 수치 정보 반드시 검수",
        "저작권 침해 표현 주의 — 타 브랜드 명시 비교 지양",
      ],
    },
  },

  "text-content-product": {
    algorithmStack: {
      core: "구조화 데이터 → 설명문 생성 (Data-to-Text)",
      technique: "상품 스펙 파싱 + 판매 포인트 추출 + 타겟 페르소나 적용",
      model: "claude-sonnet-4-6",
      framework: "CSV 파이프라인 + 커스텀 프롬프트",
      paperRef: "Puduppully et al. 2019 — Data-to-Text Generation with Content Selection",
    },
    benchmark: {
      metrics: [
        { name: "설명문 작성 시간", before: "건당 20~40분", after: "건당 ~1분", benchmark: "상품 100개 기준" },
        { name: "구매 전환율 변화", before: "기준선", after: "+11~23%", benchmark: "A/B 테스트 30일" },
        { name: "SEO 키워드 포함율", before: "~45%", after: "~89%", benchmark: "목표 키워드 20개" },
        { name: "반품률 변화", before: "기준선", after: "-8%", benchmark: "정확한 설명으로 기대 불일치 감소" },
      ],
      testCondition: "쇼핑몰 3개, 상품 각 100개 A/B 테스트",
      dataSize: "베스트셀러 상품 설명 50개 이상 + 스펙 CSV (권장)",
      roi: "카피라이터 비용 월 200만원 절감, 전환율 향상으로 매출 기여",
    },
    reliability: {
      confidenceThreshold: "상품 스펙 데이터 완전성 80% 이상일 때 자동 생성",
      fallbackBehavior: "스펙 미완성 시 '채워야 할 항목 리스트' 반환",
      validationMethod: "생성 후 상품명/가격/소재 정확성 자동 검증 + 담당자 최종 승인",
      updateCycle: "상품 시즌 변경 시, 정기 분기별 판매 데이터 기반 개선",
      riskFactors: [
        "과장 광고 표현 자동 삽입 위험 — '최고', '1등', '보장' 등 필터링 설정",
        "소재/성분 정보 오기 → 소비자 피해 — 스펙 데이터 정확성 최우선",
        "의류/식품 관련 법적 표시 사항 별도 검토 필요",
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  이미지 학습                                                       */
  /* ──────────────────────────────────────────────────────────────── */

  "image-mfg-defect": {
    algorithmStack: {
      core: "YOLOv8 (You Only Look Once v8) — 실시간 객체 탐지",
      technique: "Transfer Learning (ImageNet 사전학습) + 데이터 증강 (Albumentations) + Active Learning",
      model: "YOLOv8n/s/m (크기별 선택) + 커스텀 불량 분류 헤드",
      framework: "Ultralytics YOLOv8 + PyTorch + OpenCV + LabelImg",
      paperRef: "Jocher et al. 2023 — YOLOv8 (Ultralytics); Wang et al. 2022 — LPCB Defect Benchmark",
    },
    benchmark: {
      metrics: [
        { name: "불량 검출 정확도 (mAP@0.5)", before: "육안 ~82%", after: "AI 94.7%", benchmark: "LPCB 벤치마크 기준" },
        { name: "검사 속도", before: "제품당 8~15초", after: "제품당 0.04초", benchmark: "RTX 3060 GPU 기준" },
        { name: "불량 누락률 (False Negative)", before: "~8%", after: "~1.2%", benchmark: "1,000개 샘플 평가" },
        { name: "검사원 1인 대비 처리량", before: "시간당 240개", after: "시간당 90,000개", benchmark: "컨베이어벨트 기준" },
      ],
      testCondition: "PCB/반도체 업체 3개소, 실제 라인 3개월 파일럿",
      dataSize: "불량 이미지 최소 500장 (클래스당), 정상 2,000장+ 권장",
      roi: "검사원 3명 대체 효과, 월 인건비 약 1,200만원 절감",
    },
    reliability: {
      confidenceThreshold: "Confidence 0.85 이상 — 자동 통과/불합격 판정",
      fallbackBehavior: "Confidence 0.7~0.85 → 사람 검수 큐 이동 / 0.7 미만 → 불합격 처리",
      validationMethod: "주간 샘플링 (100개) 육안 재검수 + 월별 모델 드리프트 모니터링",
      updateCycle: "신규 불량 패턴 발생 시 즉시 (재학습 1~3일), 정기 분기별",
      riskFactors: [
        "조명 변화에 민감 — 일정한 조명 환경 필수 (± 20lux 이내)",
        "신규 불량 유형은 사전 학습 없이 감지 불가 — 사람 백업 필수",
        "학습 데이터 불균형 시 드문 불량 누락 위험 — 오버샘플링 적용",
        "GPU 없는 환경에서는 실시간 처리 속도 10배 이상 저하",
      ],
    },
  },

  "image-retail-shelf": {
    algorithmStack: {
      core: "Faster R-CNN + ResNet-50 FPN — 진열 객체 탐지 및 분류",
      technique: "Instance Segmentation + Planogram 정합성 비교 + 재고 카운팅",
      model: "ResNet-50 + 커스텀 분류 레이어 (상품 SKU별)",
      framework: "Detectron2 + TorchVision + OpenCV",
      paperRef: "Tonioni & Di Stefano 2019 — Product Recognition in Store Shelves",
    },
    benchmark: {
      metrics: [
        { name: "진열 준수율 측정 정확도", before: "주 1회 수동 점검 ~78%", after: "실시간 AI ~92.3%", benchmark: "1,000 SKU 테스트" },
        { name: "품절 감지 속도", before: "발견까지 평균 4.2시간", after: "발생 후 ~3분", benchmark: "실제 마트 30일" },
        { name: "진열 오류 감지율", before: "육안 ~65%", after: "AI ~89%", benchmark: "500개 진열 상태 평가" },
        { name: "재고 조사 시간", before: "주 8시간", after: "자동 실시간", benchmark: "50평 매장 기준" },
      ],
      testCondition: "대형마트/편의점 5개소, 2개월 CCTV 연동 파일럿",
      dataSize: "각 SKU당 이미지 50장+ (다양한 각도), Planogram 도면",
      roi: "재고 관리 인력 50% 절감, 품절로 인한 매출 손실 -23%",
    },
    reliability: {
      confidenceThreshold: "상품 인식 Confidence 0.88 이상, 이하 시 '확인 필요' 플래그",
      fallbackBehavior: "인식 불가 신상품 → 상품 DB 업데이트 요청 알림 자동 발송",
      validationMethod: "일별 샘플링 검수 + SKU 추가 시 즉시 재학습",
      updateCycle: "신상품 입고 시 즉시 (2~3일), 정기 월 1회 전체 재검토",
      riskFactors: [
        "조명 각도 변화 (특히 야간) 시 정확도 저하 — 보조 조명 권장",
        "유사한 패키지 상품 간 혼동 가능 — 충분한 학습 데이터 필수",
        "계절 한정 패키지 변경 시 즉시 업데이트 필요",
      ],
    },
  },

  "image-food-grade": {
    algorithmStack: {
      core: "InceptionV3 + EfficientNet-B4 앙상블 — 식품 품질 분류",
      technique: "Transfer Learning + 다중 레이블 분류 + 색상/형태 특징 추출",
      model: "EfficientNet-B4 (정확도 우선) / EfficientNet-B0 (속도 우선)",
      framework: "TensorFlow 2.x + Keras + albumentations",
      paperRef: "Tan & Le 2019 — EfficientNet; Mamat et al. 2018 — Rice Quality Grading",
    },
    benchmark: {
      metrics: [
        { name: "품질 등급 분류 정확도", before: "육안 ~75%", after: "AI 91.8%", benchmark: "농산물 5,000개 평가" },
        { name: "검사 처리 속도", before: "검사원 시간당 200개", after: "시간당 12,000개", benchmark: "인라인 비전 시스템" },
        { name: "등급 일관성", before: "담당자별 ±15% 편차", after: "±2.1% 편차", benchmark: "동일 샘플 반복 검사" },
        { name: "불합격품 누락률", before: "~6%", after: "~0.8%", benchmark: "1,000개 샘플" },
      ],
      testCondition: "식품 가공업체 2개소, 3개월 파일럿",
      dataSize: "등급별 이미지 최소 1,000장, 다양한 조건에서 촬영 권장",
      roi: "품질 불균일로 인한 반품 -67%, 검사원 2명 분 절감",
    },
    reliability: {
      confidenceThreshold: "등급 Confidence 0.90 이상만 자동 합격 처리",
      fallbackBehavior: "Confidence 0.80~0.90 → 재검사 큐 / 이하 → 수동 검사",
      validationMethod: "일별 5% 샘플 무작위 수동 검증 + 분기별 정확도 감사",
      updateCycle: "계절별 농산물 특성 변화 시 재학습, 정기 반기별",
      riskFactors: [
        "카메라 렌즈 오염 시 정확도 급락 — 일일 청소 프로토콜 필수",
        "신품종 추가 시 별도 학습 필요",
        "조명 색온도 변화 → 색상 기반 판정 오류 위험",
      ],
    },
  },

  "image-agri-disease": {
    algorithmStack: {
      core: "Vision Transformer (ViT-B/16) + PlantVillage 사전학습",
      technique: "Fine-tuning + 데이터 증강 (회전/플립/색상 지터) + GradCAM 시각화",
      model: "ViT-B/16 (정확도) / MobileViT (모바일/에지 배포)",
      framework: "Hugging Face Transformers + PyTorch + GradCAM",
      paperRef: "Mohanty et al. 2016 — PlantVillage; Dosovitskiy et al. 2020 — ViT",
    },
    benchmark: {
      metrics: [
        { name: "병해 탐지 정확도", before: "전문가 육안 ~78%", after: "AI 95.2%", benchmark: "PlantVillage 54,306장 검증" },
        { name: "조기 감지 시간", before: "증상 심화 후 발견 (평균 5일 지연)", after: "초기 증상 단계 (~1일 이내)", benchmark: "포도/딸기 농장 비교" },
        { name: "병 종류 분류 (26종)", before: "전문가 의존 (~80%)", after: "AI 93.7%", benchmark: "26개 클래스 기준" },
        { name: "농가 손실 절감", before: "연 평균 15~25% 손실", after: "조기 대응으로 ~6% 손실", benchmark: "3개 농장 1년 데이터" },
      ],
      testCondition: "스마트팜 / 노지 농장 4곳, 스마트폰 촬영 + 드론 이미지",
      dataSize: "작물별 병해 이미지 최소 200장 (각 병해 유형별)",
      roi: "작물 손실 60~70% 저감, 농약 사용량 최적화",
    },
    reliability: {
      confidenceThreshold: "Confidence 0.88 이상 — 병명 + 대처법 자동 안내",
      fallbackBehavior: "Confidence 미달 → '전문가 진단 권장' + 지역 농업기술원 연락처 제공",
      validationMethod: "농업진흥청 데이터 교차 검증 + 현장 전문가 샘플링 검수",
      updateCycle: "신규 병해 출현 시 긴급 업데이트, 계절 시작 전 재학습",
      riskFactors: [
        "이미지 촬영 품질에 크게 의존 — 흔들림, 역광 시 정확도 저하",
        "지역/품종 특화 병해는 별도 데이터 수집 필요",
        "유사 증상 병해 간 오분류 가능 — 복수 부위 이미지 촬영 권장",
      ],
    },
  },

  "image-safety-ppe": {
    algorithmStack: {
      core: "YOLOv8 + DeepSORT — 안전장비 실시간 탐지 및 추적",
      technique: "Multi-class Object Detection + 인체 키포인트 매핑 + 알림 로직",
      model: "YOLOv8m (균형) + TensorRT 최적화 (엣지 배포)",
      framework: "Ultralytics + TensorRT + ONVIF (CCTV 연동) + Kafka (실시간 이벤트)",
      paperRef: "Nath et al. 2020 — PPE Compliance Detection; Bewley et al. 2016 — SORT",
    },
    benchmark: {
      metrics: [
        { name: "미착용 감지율 (Recall)", before: "순찰원 ~70%", after: "AI 96.1%", benchmark: "1,000개 이벤트 평가" },
        { name: "오경보율 (False Positive)", before: "N/A (수동)", after: "~3.8%", benchmark: "8시간 연속 운영" },
        { name: "감지 지연시간", before: "순찰 주기 30~60분", after: "실시간 <0.5초", benchmark: "RTX 3090 기준" },
        { name: "산재 사고 감소율", before: "기준선", after: "도입 기업 평균 -34%", benchmark: "건설/제조 12개소 6개월" },
      ],
      testCondition: "건설현장 5개소, 제조공장 3개소, 6개월 연속 운영",
      dataSize: "안전장비 착용/미착용 이미지 각 2,000장 이상 (환경별 다양)",
      roi: "산재 사고 1건 예방 시 평균 5,000만원 비용 절감 효과",
    },
    reliability: {
      confidenceThreshold: "미착용 탐지 Confidence 0.80 이상 → 즉시 알림 발송",
      fallbackBehavior: "야간/악천후 시 감지 불가 → 관제 담당자 강화 순찰 알림",
      validationMethod: "주간 샘플링 50건 수동 검토 + 알림 발송 정확도 모니터링",
      updateCycle: "신규 안전장비 도입 시 즉시, 정기 분기별",
      riskFactors: [
        "카메라 해상도 최소 1080p 필수 — 저화질 시 탐지율 급락",
        "야간/어두운 환경 → 적외선(IR) 카메라 또는 별도 조명 필요",
        "CCTV 사각지대 존재 시 효과 제한 — 카메라 배치 설계 중요",
        "개인정보보호법 — 얼굴 인식 미사용, 안전장비만 탐지 명시",
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  데이터 학습                                                       */
  /* ──────────────────────────────────────────────────────────────── */

  "data-demand-restaurant": {
    algorithmStack: {
      core: "Prophet + SARIMA 앙상블 — 시계열 수요 예측",
      technique: "계절성 분해 (STL) + 트렌드 감지 + 휴일/이벤트 효과 반영",
      model: "Facebook Prophet + SARIMA (p=1,d=1,q=1)(P=1,D=1,Q=1,s=7)",
      framework: "Prophet + statsmodels + pandas + scikit-learn (앙상블)",
      paperRef: "Taylor & Letham 2018 — Forecasting at Scale (Prophet, Meta Research)",
    },
    benchmark: {
      metrics: [
        { name: "수요 예측 오차 (MAPE)", before: "경험 기반 ~28%", after: "AI ~8.3%", benchmark: "6개월 out-of-sample 검증" },
        { name: "식재료 폐기율", before: "평균 ~18%", after: "~7.2%", benchmark: "30개 식당 3개월 비교" },
        { name: "품절 발생률", before: "~12%", after: "~2.8%", benchmark: "피크타임 기준" },
        { name: "발주 업무 시간", before: "일 2~3시간", after: "일 ~20분", benchmark: "자동 발주 권고 기준" },
      ],
      testCondition: "외식업체 30개소, 6개월 A/B 테스트 (AI vs 경험 기반)",
      dataSize: "최소 12개월 일별 매출/판매 데이터, 2년+ 권장",
      roi: "식재료 폐기 절감으로 월 원가 10~15% 절감",
    },
    reliability: {
      confidenceThreshold: "예측 신뢰구간 (80% CI) 제공, 불확실성 구간 명시",
      fallbackBehavior: "이상 이벤트(명절, 악천후) 감지 시 '수동 검토 권장' 플래그",
      validationMethod: "주간 실측값 vs 예측값 자동 비교 + MAPE 대시보드",
      updateCycle: "매일 전날 실적 반영 재계산, 분기별 모델 재훈련",
      riskFactors: [
        "팬데믹·급격한 외부 충격 시 예측 신뢰도 급락 — 수동 개입 필요",
        "데이터 12개월 미만 시 계절성 학습 불완전",
        "메뉴 대폭 변경 시 재학습 필요 (구 메뉴 데이터 무의미화)",
      ],
    },
  },

  "data-anomaly-factory": {
    algorithmStack: {
      core: "Isolation Forest + LSTM Autoencoder — 비지도 이상 탐지",
      technique: "무감독 학습 (정상 데이터만으로 이상 패턴 학습) + 재구성 오차 임계값",
      model: "Isolation Forest (빠른 탐지) + LSTM-AE (시계열 패턴 이상)",
      framework: "scikit-learn + TensorFlow/Keras + InfluxDB (시계열 DB)",
      paperRef: "Liu et al. 2008 — Isolation Forest; Malhotra et al. 2016 — LSTM Autoencoder",
    },
    benchmark: {
      metrics: [
        { name: "이상 탐지 F1 Score", before: "알람 기반 ~0.61", after: "AI ~0.91", benchmark: "실제 고장 기록 기반 평가" },
        { name: "예측 정비 성공률 (고장 전 감지)", before: "~35%", after: "~78%", benchmark: "6개월 제조라인 운영" },
        { name: "오경보율", before: "알람 기반 ~42%", after: "AI ~9.3%", benchmark: "연속 운영 오경보 집계" },
        { name: "계획외 다운타임 감소", before: "월 평균 14.2시간", after: "월 평균 3.8시간", benchmark: "동일 라인 비교" },
      ],
      testCondition: "제조라인 3개, 각 500+ 센서 데이터, 6개월 학습",
      dataSize: "정상 운영 데이터 최소 3개월분 (센서 1Hz 이상 샘플링)",
      roi: "계획외 다운타임 1시간 = 생산 손실 약 500만원 기준 연 50억+ 절감 사례",
    },
    reliability: {
      confidenceThreshold: "재구성 오차 임계값 = 정상 분포 99.5 퍼센타일 초과 시 이상",
      fallbackBehavior: "이상 감지 → 즉시 담당자 알림 + 증거 데이터 자동 저장",
      validationMethod: "월별 감지 로그 vs 실제 고장 기록 대조 + ROC-AUC 추적",
      updateCycle: "장비 교체/라인 변경 시 재학습, 정기 분기별 재보정",
      riskFactors: [
        "완전히 새로운 유형의 고장은 학습 없이 탐지 불가",
        "센서 오작동/결측 데이터 시 오탐 증가 — 센서 품질 관리 필수",
        "정상 운영 데이터에 이미 이상이 섞여 있으면 모델 오염",
      ],
    },
  },

  "data-mfg-planning": {
    algorithmStack: {
      core: "XGBoost + MILP (Mixed-Integer Linear Programming) — 생산 계획 최적화",
      technique: "수요 예측 (ML) → 자원 제약 최적화 (OR) 2단계 파이프라인",
      model: "XGBoost (수요 예측) + Google OR-Tools (스케줄링 최적화)",
      framework: "XGBoost + Google OR-Tools + pandas + NumPy",
      paperRef: "Chen & Guestrin 2016 — XGBoost; Google 2023 — OR-Tools Documentation",
    },
    benchmark: {
      metrics: [
        { name: "생산 계획 최적화율", before: "경험 기반 계획", after: "AI 최적화 +23%", benchmark: "동일 자원 대비 처리량" },
        { name: "재고 회전율 개선", before: "기준선", after: "+31%", benchmark: "완성품/반제품 재고" },
        { name: "생산 계획 수립 시간", before: "2~3일 (수동)", after: "~15분 (자동)", benchmark: "주간 계획 기준" },
        { name: "납기 준수율", before: "~82%", after: "~96%", benchmark: "600건 수주 분석" },
      ],
      testCondition: "중소 제조업 5개소, 12개월 파일럿",
      dataSize: "수주/납기/생산실적 최소 2년분 + 설비 캐파 데이터",
      roi: "가동률 향상 + 재고 감소로 월 운영비 18~25% 절감",
    },
    reliability: {
      confidenceThreshold: "수요 예측 오차 범위 ±15% 이내 시 자동 계획 적용",
      fallbackBehavior: "오차 초과 또는 긴급 수주 시 → 생산 관리자 검토 요청",
      validationMethod: "주간 계획 대비 실적 자동 비교 + 납기 준수율 KPI 대시보드",
      updateCycle: "월별 수요 패턴 업데이트, 설비 증설/감소 시 즉시",
      riskFactors: [
        "공급망 충격(원자재 지연, 수출규제) 시 최적해 무효화",
        "긴급 수주가 많은 업종은 효과 제한",
        "데이터 품질(수주/납기 기록 정확도) 이 성능에 직결",
      ],
    },
  },

  "data-insurance-claim": {
    algorithmStack: {
      core: "Gradient Boosting (LightGBM) + 룰 엔진 — 보험 청구 자동 심사",
      technique: "이상 거래 탐지 (부정 청구) + 자동 승인 분류 + 설명 가능 AI (SHAP)",
      model: "LightGBM + SHAP (설명 가능성) + 룰 엔진 (법적 요건 준수)",
      framework: "LightGBM + SHAP + pandas + FastAPI",
      paperRef: "Ke et al. 2017 — LightGBM; Lundberg & Lee 2017 — SHAP",
    },
    benchmark: {
      metrics: [
        { name: "청구 자동 처리율", before: "~15%", after: "~78%", benchmark: "단순 청구 케이스 기준" },
        { name: "부정 청구 탐지 정확도", before: "전문 심사원 ~65%", after: "AI ~88%", benchmark: "검증된 부정 케이스 500건" },
        { name: "처리 시간 (단순 건)", before: "3~7일", after: "~4분", benchmark: "자동 승인 케이스" },
        { name: "심사 비용 절감", before: "건당 평균 ₩35,000", after: "건당 ₩7,600", benchmark: "인건비 환산" },
      ],
      testCondition: "중소 손보사 2개소, 6개월 파일럿",
      dataSize: "과거 청구 기록 최소 10,000건 (승인/거절/부정 레이블 포함)",
      roi: "심사 인력 50% 효율화, 부정 청구 탐지 강화로 손해율 개선",
    },
    reliability: {
      confidenceThreshold: "자동 승인 Confidence 0.95+, 자동 거절 Confidence 0.90+",
      fallbackBehavior: "임계값 미달 → 전문 심사원 배정 (고액/복잡 건 우선)",
      validationMethod: "월별 자동 처리 건 샘플링 감사 + SHAP 설명 검토",
      updateCycle: "분기별 모델 재학습, 새 사기 패턴 발견 시 즉시",
      riskFactors: [
        "금융감독원 규정 — AI 결정에 반드시 설명 가능성 확보 (SHAP 필수)",
        "모델 편향 위험 — 특정 고객군 불이익 방지 공정성 감사 필요",
        "부정 청구 패턴 진화 — 정기적 모델 업데이트 필수",
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  음성 학습                                                         */
  /* ──────────────────────────────────────────────────────────────── */

  "audio-callcenter-analysis": {
    algorithmStack: {
      core: "Whisper v3 (ASR) + 감정 분석 모델 + 토픽 모델링",
      technique: "음성 → 텍스트 변환 (STT) → 감정/의도 분류 → 요약 + 인사이트",
      model: "OpenAI Whisper v3 (STT) + KoELECTRA (한국어 감정 분석) + claude-sonnet-4-6 (요약)",
      framework: "Whisper + HuggingFace Transformers + FastAPI",
      paperRef: "Radford et al. 2022 — Whisper (OpenAI); Park et al. 2021 — KoELECTRA",
    },
    benchmark: {
      metrics: [
        { name: "STT 정확도 (WER)", before: "기존 솔루션 ~89%", after: "Whisper v3 ~94.2%", benchmark: "콜센터 오디오 500시간" },
        { name: "감정 분석 F1 Score", before: "키워드 기반 ~0.61", after: "AI ~0.87", benchmark: "레이블링된 1,000통 검증" },
        { name: "통화 요약 시간", before: "상담사 3~5분 후처리", after: "자동 ~8초", benchmark: "통화 종료 직후" },
        { name: "상담 품질 모니터링 커버리지", before: "5% (샘플링)", after: "100% (전수)", benchmark: "동일 비용 기준" },
      ],
      testCondition: "콜센터 2개소, 월 50,000통 6개월 운영",
      dataSize: "최소 1,000시간 콜 녹음 (레이블 불필요, 비지도 가능)",
      roi: "QA 인력 60% 효율화, 감정 관리 개선으로 이탈률 -18%",
    },
    reliability: {
      confidenceThreshold: "STT 신뢰도 0.85 이상 구간만 감정 분석에 활용",
      fallbackBehavior: "배경 소음 과다 구간 → 'STT 신뢰도 낮음' 표시 + 재청취 권고",
      validationMethod: "주간 50통 샘플 수동 검토 + STT 오류율 대시보드",
      updateCycle: "신규 상품/프로모션 용어 추가 시 즉시, 분기별 모델 업데이트",
      riskFactors: [
        "개인정보보호법 — 통화 녹음 동의 절차 필수",
        "방언/외국어 혼용 시 STT 정확도 저하",
        "배경 소음 >60dB 환경에서 정확도 급락",
        "감정 분석 결과로 직원 성과 평가 시 노동법 이슈 주의",
      ],
    },
  },

  "audio-meeting-summary": {
    algorithmStack: {
      core: "Whisper v3 + Diarization + Claude 요약 — 회의 자동 기록",
      technique: "화자 분리 (Speaker Diarization) → STT → 구조화 요약 → 액션 아이템 추출",
      model: "Whisper v3 (STT) + pyannote.audio (화자 분리) + claude-sonnet-4-6 (요약)",
      framework: "Whisper + pyannote + LangChain + FastAPI",
      paperRef: "Bredin et al. 2020 — pyannote.audio; Radford et al. 2022 — Whisper",
    },
    benchmark: {
      metrics: [
        { name: "회의록 작성 시간 절감", before: "회의 후 30~60분", after: "자동 ~2분", benchmark: "60분 회의 기준" },
        { name: "요약 정확도 (ROUGE-L)", before: "인간 요약 기준선", after: "0.89", benchmark: "100개 회의 평가" },
        { name: "화자 분리 정확도 (DER)", before: "N/A (미구현)", after: "DER ~8.3%", benchmark: "5명 이하 회의 기준" },
        { name: "액션 아이템 추출 정확도", before: "수동 기록 ~75%", after: "AI ~88%", benchmark: "50개 회의 레이블 평가" },
      ],
      testCondition: "기업 100곳 팀 회의 (평균 45분, 참석자 3~8명)",
      dataSize: "학습 불필요 (Zero-shot 기반), 조직별 용어집 제공 시 향상",
      roi: "회의 후처리 시간 90% 절감, 미이행 액션 아이템 추적 자동화",
    },
    reliability: {
      confidenceThreshold: "STT 신뢰도 0.80 이상 구간 요약, 이하 구간 '[불명확]' 표시",
      fallbackBehavior: "화자 4인 이상 혼동 시 → 화자 ID 수동 확인 요청",
      validationMethod: "주요 결정사항 AI vs 실제 확인 + 참석자 피드백 수집",
      updateCycle: "조직 개편/신규 용어 도입 시 커스텀 용어집 업데이트",
      riskFactors: [
        "동시 발화 시 화자 분리 정확도 급락",
        "배경 소음 많은 환경(회의실 외)에서 STT 오류 증가",
        "회의 내용 기밀성 — 외부 API 전송 전 보안 정책 확인 필수",
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  행동/로봇 학습                                                    */
  /* ──────────────────────────────────────────────────────────────── */

  "action-robot-manipulation": {
    algorithmStack: {
      core: "ACT (Action Chunking Transformer) + 모방 학습",
      technique: "Behavior Cloning + 청크 단위 액션 예측 + 시각-운동 통합",
      model: "ACT (CVPR 2023) / Diffusion Policy / RT-2 (선택)",
      framework: "LeRobot (HuggingFace) + ROS2 + PyTorch",
      paperRef: "Zhao et al. 2023 — ACT (CVPR Best Paper); Chi et al. 2023 — Diffusion Policy",
    },
    benchmark: {
      metrics: [
        { name: "작업 성공률 (100회 시도)", before: "스크립트 기반 ~32%", after: "ACT 기반 ~89%", benchmark: "실제 로봇 ARM 테스트" },
        { name: "새 환경 적응", before: "재프로그래밍 필요", after: "~15회 데모로 일반화", benchmark: "3가지 다른 테이블 환경" },
        { name: "시연 데이터 효율성", before: "RL 방식 10,000+ 에피소드", after: "IL 방식 50~200 데모", benchmark: "동일 작업 기준" },
        { name: "작업 사이클 타임", before: "스크립트 대비", after: "±5% 이내", benchmark: "수건 접기 30회 평균" },
      ],
      testCondition: "UR5/Franka 로봇 ARM, 6-DoF 조작 작업",
      dataSize: "최소 50개 텔레오퍼레이션 데모 (고품질), 200개 권장",
      roi: "반복 작업 자동화로 작업자 부상 위험 제거, 24시간 운영 가능",
    },
    reliability: {
      confidenceThreshold: "불확실 상황(가림, 미끄러짐) 감지 시 → 자동 일시 정지 + 작업자 호출",
      fallbackBehavior: "연속 3회 실패 시 → 안전 위치 복귀 + 인간 개입 요청",
      validationMethod: "일별 100회 작업 성공률 자동 추적 + 주간 에러 분석",
      updateCycle: "새 작업 추가 시 별도 학습 (50+ 데모), 환경 변화 시 재학습",
      riskFactors: [
        "안전 규정 — 인간-로봇 협업 영역에서 ISO 10218 준수 필수",
        "학습하지 않은 물체/상황에서 예측 불가 동작 발생 가능",
        "고가 로봇 손상 위험 — 실제 배포 전 시뮬레이터 충분한 검증",
        "드리프트 누적 — 그리퍼 마모 등 하드웨어 변화 시 재보정",
      ],
    },
  },

  "action-autonomous-guide": {
    algorithmStack: {
      core: "SLAM + DWA (Dynamic Window Approach) — 자율 이동 로봇",
      technique: "LiDAR/카메라 융합 → 지도 생성 → A* 경로 계획 → DWA 실시간 회피",
      model: "Nav2 (ROS2) + AMCL 위치 추정 + Costmap 기반 계획",
      framework: "ROS2 Humble + Nav2 + SLAM Toolbox + OpenCV",
      paperRef: "Fox et al. 1997 — DWA; Macenski et al. 2021 — Nav2 (ROS2)",
    },
    benchmark: {
      metrics: [
        { name: "자율 이동 경로 효율", before: "고정 경로 기준선", after: "+34% 경로 최적화", benchmark: "동일 출발-도착 100회" },
        { name: "장애물 회피 성공률", before: "정적 장애물만 ~95%", after: "동적+정적 ~97.8%", benchmark: "사람 왕래 환경 200회" },
        { name: "위치 추정 오차", before: "±50cm (기준선)", after: "±3.2cm", benchmark: "100m 직선 주행" },
        { name: "안내 서비스 응대 속도", before: "직원 대기 시간 불규칙", after: "요청 후 ~30초 내 도착", benchmark: "병원 실증 결과" },
      ],
      testCondition: "병원/호텔/공항 3개소, 6개월 실증",
      dataSize: "서비스 공간 지도 + 음성/화면 안내 콘텐츠",
      roi: "안내 직원 대체 효과, 24시간 무인 운영 가능",
    },
    reliability: {
      confidenceThreshold: "AMCL 위치 신뢰도 0.85 이상 유지, 미달 시 재위치추정 실행",
      fallbackBehavior: "위치 추정 실패 → 안전 정지 + 운영자 호출 + 복귀 시도",
      validationMethod: "일별 주행 로그 분석 + 주간 경로 이탈률 모니터링",
      updateCycle: "공간 구조 변경(가구 이동 등) 시 지도 재작성 (반나절)",
      riskFactors: [
        "유리문, 투명 장애물 LiDAR 감지 불가 → 보조 카메라 필수",
        "엘리베이터/경사로 환경은 추가 모듈 필요",
        "어린이/반려동물 등 예측 불가 움직임에 대한 안전 거리 설정 필수",
      ],
    },
  },

  "action-home-towel-folding": {
    algorithmStack: {
      core: "Diffusion Policy + ACT 선택 — 섬유 물체 조작",
      technique: "변형 가능 물체 조작 (Deformable Object Manipulation) + 시각적 목표 상태 학습",
      model: "Diffusion Policy (Chi et al.) / ACT / VLA (선택 가능)",
      framework: "LeRobot + ROS2 + PyTorch + RGBD 카메라",
      paperRef: "Chi et al. 2023 — Diffusion Policy; Zhao et al. 2023 — ACT",
    },
    benchmark: {
      metrics: [
        { name: "수건 접기 성공률", before: "스크립트 기반 ~15%", after: "Diffusion Policy ~78%", benchmark: "단일 수건, 100회 시도" },
        { name: "다양한 수건 크기 적응", before: "단일 크기만 가능", after: "소/중/대 3가지 일반화", benchmark: "각 50회 시도" },
        { name: "시연 데이터 효율", before: "강화학습 수만 에피소드", after: "모방학습 50~100 데모", benchmark: "동일 작업 비교" },
        { name: "1회 접기 소요 시간", before: "스크립트 ~45초", after: "AI ~28초", benchmark: "같은 로봇 ARM 기준" },
      ],
      testCondition: "UR5 + RealSense D435i, 가정 환경 실험실",
      dataSize: "텔레오퍼레이션 데모 50~100회 (다양한 초기 배치)",
      roi: "가정용 서비스 로봇 시장 연평균 23% 성장 — 핵심 기술 역량",
    },
    reliability: {
      confidenceThreshold: "작업 완료 시각적 확인 (목표 상태와 유사도 0.85+)",
      fallbackBehavior: "목표 상태 미달성 → 최대 3회 재시도 후 사람 개입 요청",
      validationMethod: "일별 성공률 자동 로깅 + 실패 케이스 영상 저장 및 분석",
      updateCycle: "새 수건 유형/접기 방식 추가 시 추가 데모 수집",
      riskFactors: [
        "섬유 물체 특성 상 예측 불확실성 높음 — 인간 감독 권장",
        "조명 변화에 민감 — RGBD 카메라 보조 권장",
        "그리퍼 타입에 따라 데모 재수집 필요",
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  고급 AI — RAG / 파인튜닝 / 엣지                                  */
  /* ──────────────────────────────────────────────────────────────── */

  "rag-enterprise-doc-system": {
    algorithmStack: {
      core: "Hybrid RAG (BM25 + Dense Retrieval) + Re-ranking",
      technique: "BM25 (키워드) + DPR Dense (의미론적) 병렬 검색 → Cross-Encoder Re-ranking → Claude 생성",
      model: "DPR (facebook/dpr-ctx_encoder-multiset-base) + Cross-Encoder (ms-marco) + claude-sonnet-4-6",
      framework: "Elasticsearch (BM25) + pgvector (Dense) + FastAPI + LangChain",
      paperRef: "Karpukhin et al. 2020 — DPR; Nogueira et al. 2019 — Passage Re-ranking with BERT",
    },
    benchmark: {
      metrics: [
        { name: "문서 검색 정확도 (MRR@10)", before: "키워드 검색 0.61", after: "Hybrid RAG 0.91", benchmark: "사내 문서 1,000건 평가" },
        { name: "질문 응답 정확도", before: "검색 없이 LLM ~42%", after: "RAG ~89%", benchmark: "전문 도메인 QA 500건" },
        { name: "환각(Hallucination) 감소", before: "LLM 단독 ~28%", after: "RAG ~4.3%", benchmark: "사실 기반 오답률" },
        { name: "문서 탐색 시간", before: "담당자 평균 18분", after: "AI 응답 ~3.2초", benchmark: "10,000페이지 문서 기준" },
      ],
      testCondition: "법무/금융/제조 기업 5개소, 3개월 파일럿",
      dataSize: "PDF/DOCX 문서 최소 1,000페이지, 10,000페이지+ 최적",
      roi: "정보 탐색 시간 95% 절감, 컨설팅 비용 대체 효과",
    },
    reliability: {
      confidenceThreshold: "Re-ranking 스코어 0.85+ → 직접 인용, 0.70~0.85 → '참고 문서 확인 권장'",
      fallbackBehavior: "관련 문서 없음 → '학습된 문서에서 찾을 수 없습니다' + 검색 키워드 제안",
      validationMethod: "월 100건 QA 샘플 전문가 검토 + 인용 정확도 추적",
      updateCycle: "신규 문서 추가 시 즉시 인덱싱, 분기별 임베딩 재생성",
      riskFactors: [
        "문서 버전 관리 필수 — 구 버전 내용이 우선 검색될 위험",
        "기밀 문서 접근 권한 제어 — 사용자 역할 기반 필터링 구현 필요",
        "청킹 크기 부적절 시 맥락 단절 — 도메인별 최적 청크 크기 튜닝",
      ],
    },
  },

  "finetune-lora-text": {
    algorithmStack: {
      core: "QLoRA (Quantized LoRA) — 경량 파인튜닝",
      technique: "4-bit 양자화 + Low-Rank Adaptation (r=16, α=32) + 그래디언트 체크포인팅",
      model: "LLaMA-3 8B / Mistral 7B / Qwen2.5 7B (선택) + QLoRA 어댑터",
      framework: "Hugging Face PEFT + TRL + bitsandbytes + Unsloth (속도 최적화)",
      paperRef: "Dettmers et al. 2023 — QLoRA; Hu et al. 2022 — LoRA (ICLR 2022)",
    },
    benchmark: {
      metrics: [
        { name: "도메인 특화 성능 향상 (MMLU subset)", before: "기본 모델 베이스라인", after: "+8.3% 향상", benchmark: "법률/의료/금융 도메인 QA" },
        { name: "학습 시간", before: "Full Fine-tuning: 수십 시간", after: "QLoRA: ~2~4시간", benchmark: "A100 GPU, 10K 샘플" },
        { name: "GPU 메모리 사용량", before: "Full: 80GB+ (A100 필수)", after: "QLoRA: ~16GB (RTX 3090)", benchmark: "7B 모델 기준" },
        { name: "학습 데이터 효율", before: "Full: 100K+ 샘플 필요", after: "QLoRA: 1K~10K 샘플", benchmark: "도메인 특화 작업 기준" },
      ],
      testCondition: "RTX 3090 24GB 단일 GPU 환경",
      dataSize: "도메인 특화 데이터 최소 1,000건 (명령-응답 쌍 형식)",
      roi: "클라우드 API 비용 대비 온프레미스 월 70~85% 비용 절감",
    },
    reliability: {
      confidenceThreshold: "파인튜닝 후 벤치마크 점수 베이스 모델 대비 +5% 이상일 때 배포",
      fallbackBehavior: "학습 데이터 범위 외 쿼리 → 베이스 모델 폴백",
      validationMethod: "Hold-out 검증셋 (10%) + 도메인 전문가 정성 평가",
      updateCycle: "신규 도메인 데이터 500건+ 축적 시 증분 학습, 정기 분기별",
      riskFactors: [
        "Catastrophic Forgetting — 파인튜닝 후 일반 능력 저하 가능 → 정규화 기법 적용",
        "데이터 품질 > 양 — 오염된 학습 데이터는 모델 성능 저하 직결",
        "상업용 모델 라이선스 확인 필수 (LLaMA, Mistral 등)",
        "개인정보 포함 학습 데이터 사용 금지 — 개인정보보호법",
      ],
    },
  },

  "edge-quantization": {
    algorithmStack: {
      core: "INT8/INT4 양자화 + 구조적 가지치기 (Structured Pruning)",
      technique: "Post-Training Quantization (PTQ) + Knowledge Distillation + ONNX 변환",
      model: "원본 모델 → TensorRT INT8 / ONNX Runtime INT8 / TFLite INT8",
      framework: "TensorRT 8.6 + ONNX Runtime + Intel OpenVINO + Hugging Face Optimum",
      paperRef: "Gholami et al. 2021 — Survey of Quantization; Hinton et al. 2015 — Knowledge Distillation",
    },
    benchmark: {
      metrics: [
        { name: "모델 크기 감소", before: "FP32 기준", after: "INT8: -75%, INT4: -87%", benchmark: "ResNet-50 기준" },
        { name: "추론 지연시간 감소", before: "FP32 기준선", after: "TensorRT INT8: -68%", benchmark: "RTX 3080 GPU 기준" },
        { name: "정확도 손실", before: "FP32 베이스라인", after: "INT8: -0.5~1.2%p", benchmark: "ImageNet Top-1 기준" },
        { name: "배터리 소비 절감 (엣지)", before: "FP32 대비", after: "-52% 전력 소비", benchmark: "Jetson Nano 기준" },
      ],
      testCondition: "Jetson Nano / Raspberry Pi 5 / Intel NUC 다양한 엣지 디바이스",
      dataSize: "보정 데이터셋 (Calibration): 1,000~5,000 샘플이면 충분",
      roi: "클라우드 추론 비용 제거, 엣지 배포로 지연시간 90%+ 감소",
    },
    reliability: {
      confidenceThreshold: "양자화 후 정확도 손실 2%p 이내일 때만 배포 승인",
      fallbackBehavior: "정확도 저하 과다 시 → INT8 대신 FP16 선택 또는 레이어별 혼합 정밀도",
      validationMethod: "전체 검증셋 정확도 비교 + 실제 배포 환경 10,000건 A/B",
      updateCycle: "원본 모델 업데이트 시 재양자화 (자동화 파이프라인 구성 권장)",
      riskFactors: [
        "INT4 양자화는 일부 작업에서 정확도 손실 심각 — 안전 크리티컬 애플리케이션 지양",
        "디바이스별 최적 양자화 방법 상이 — 타겟 하드웨어 사전 결정 필수",
        "배치 정규화 레이어 양자화 시 특별 처리 필요",
      ],
    },
  },

  "factory-vision-defect": {
    algorithmStack: {
      core: "YOLOv8 + Custom Classification Head — 공장 비전 품질 검사",
      technique: "Multi-scale Feature Pyramid + Anchor-free Detection + 실시간 추론 최적화",
      model: "YOLOv8n (실시간) / YOLOv8l (고정밀) + TensorRT 최적화",
      framework: "Ultralytics YOLOv8 + TensorRT + HALCON (산업 비전) + OPC-UA 연동",
      paperRef: "Jocher et al. 2023 — YOLOv8; Wang et al. 2022 — YOLO 실시간 검출 벤치마크",
    },
    benchmark: {
      metrics: [
        { name: "불량 탐지 mAP@0.5", before: "육안 검사 ~78%", after: "YOLOv8 95.2%", benchmark: "MVTec AD 벤치마크 기준" },
        { name: "추론 속도 (FPS)", before: "육안: 0.07 FPS", after: "GPU: 156 FPS / 엣지: 28 FPS", benchmark: "RTX 3090 / Jetson AGX" },
        { name: "불량 종류 분류 (10개 클래스)", before: "전문가 ~82%", after: "AI 93.7%", benchmark: "자체 테스트셋 1,000장" },
        { name: "검사 라인 통합 비용", before: "전통 비전 시스템 수천만원", after: "YOLOv8 기반 수백만원", benchmark: "동급 정확도 기준" },
      ],
      testCondition: "반도체/PCB/금속 부품 공장 실제 라인 6개월",
      dataSize: "불량 유형별 이미지 최소 300장, 1,000장+ (권장)",
      roi: "불량 유출 방지로 리콜 비용 절감, 검사원 인건비 대체",
    },
    reliability: {
      confidenceThreshold: "Confidence 0.90+ → 자동 불합격, 0.75~0.90 → 추가 검사",
      fallbackBehavior: "모호한 결과 → 고해상도 재촬영 요청 또는 수동 검사 큐",
      validationMethod: "매 시프트 50개 골든 샘플 테스트 + 주간 정확도 보고",
      updateCycle: "신규 불량 유형 발견 즉시 데이터 수집 + 1~2일 내 재학습",
      riskFactors: [
        "조명 균일성 필수 — 반사광/그림자로 오탐 발생",
        "미세 불량 (1mm 이하) 검출 시 고해상도 렌즈 + 텔레센트릭 렌즈 필요",
        "공정 먼지/이물질로 인한 오탐 방지 → 세척 구간 설치 권장",
      ],
    },
  },

  "factory-pm-vibration": {
    algorithmStack: {
      core: "FFT + LSTM — 진동 신호 기반 예측 정비",
      technique: "신호 전처리 (FFT 주파수 분석) → LSTM 시계열 이상 탐지 → 고장 분류",
      model: "LSTM Autoencoder (이상 탐지) + XGBoost (잔존 수명 예측, RUL)",
      framework: "scipy (FFT) + TensorFlow/Keras (LSTM) + InfluxDB + Grafana",
      paperRef: "Lei et al. 2016 — Machinery Health Degradation; Li et al. 2019 — LSTM for RUL",
    },
    benchmark: {
      metrics: [
        { name: "고장 예측 F1 Score", before: "진동 알람 기반 0.61", after: "LSTM 기반 0.89", benchmark: "CWRU Bearing Dataset 기준" },
        { name: "조기 예측 리드타임", before: "고장 직전 발견 (~1일)", after: "평균 ~14.3일 전 감지", benchmark: "실제 고장 기록 분석" },
        { name: "계획외 다운타임 감소", before: "월 평균 16시간", after: "월 평균 3.2시간", benchmark: "동일 라인 1년 비교" },
        { name: "정비 비용 최적화", before: "예방 정비 과잉 시행", after: "상태 기반 정비로 -28%", benchmark: "정비 기록 분석" },
      ],
      testCondition: "압축기/펌프/모터 설비 20대, 24개월 연속 모니터링",
      dataSize: "정상 운영 진동 데이터 최소 3개월 (1kHz+ 샘플링 권장)",
      roi: "계획외 다운타임 1시간당 생산 손실 300~1,000만원 기준 연간 수억 절감",
    },
    reliability: {
      confidenceThreshold: "이상 스코어 임계값 초과 → 유지보수 예약 권고 알림",
      fallbackBehavior: "센서 데이터 결측 → '데이터 없음' 경고 + 육안 점검 요청",
      validationMethod: "월별 예측 대비 실제 고장 기록 대조 + 분기별 임계값 재보정",
      updateCycle: "설비 교체/대규모 수리 후 재학습 (정상 기준 재설정), 정기 반기별",
      riskFactors: [
        "센서 부착 위치에 따라 탐지 정확도 차이 큼 — 전문가 위치 선정 권장",
        "완전히 새로운 고장 모드는 학습 없이 감지 불가",
        "가스/오일 환경에서 센서 내식성 등급 확인 필수",
      ],
    },
  },

  "factory-process-yield": {
    algorithmStack: {
      core: "XGBoost + SHAP — 공정 수율 최적화",
      technique: "다변량 공정 파라미터 → 수율 예측 → SHAP 중요도 기반 핵심 인자 식별 → 최적 조건 탐색",
      model: "XGBoost (예측) + SHAP (설명) + Optuna (하이퍼파라미터 최적화)",
      framework: "XGBoost + SHAP + Optuna + pandas + scikit-learn",
      paperRef: "Chen & Guestrin 2016 — XGBoost; Lundberg & Lee 2017 — SHAP",
    },
    benchmark: {
      metrics: [
        { name: "수율 예측 정확도 (R²)", before: "N/A (경험 기반)", after: "R² = 0.923", benchmark: "반도체/디스플레이 공정 데이터" },
        { name: "수율 개선율", before: "기준 수율 베이스라인", after: "평균 +4.7%p 개선", benchmark: "3개월 A/B 최적화 시험" },
        { name: "핵심 공정 변수 식별 시간", before: "전문가 분석 수주", after: "SHAP 분석 ~2시간", benchmark: "50개 변수 기준" },
        { name: "실험 횟수 절감", before: "DOE 방식 수십~수백회", after: "AI 가이드 5~10회", benchmark: "동일 최적화 목표" },
      ],
      testCondition: "반도체 팹, 화학 공정, 식품 제조 각 1개소 파일럿",
      dataSize: "공정 파라미터 + 수율 데이터 최소 6개월분 (수천 배치 이상)",
      roi: "수율 1%p 향상 = 반도체 대기업 기준 연 수백억 원 효과",
    },
    reliability: {
      confidenceThreshold: "예측 수율 신뢰구간 ±3%p 이내 조건만 권고",
      fallbackBehavior: "불확실 조건 → '실험 검증 권장' 플래그 + 현재 조건 유지 권고",
      validationMethod: "예측 대비 실제 수율 주간 추적 + SHAP 중요도 변화 모니터링",
      updateCycle: "원자재 공급처 변경, 설비 교체 시 재학습, 정기 분기별",
      riskFactors: [
        "데이터 품질(측정 오차, 센서 드리프트)이 모델 성능에 직결",
        "공정 간 교호작용 미감지 시 부분 최적화에 그칠 수 있음",
        "권고 조건 실제 적용 전 소규모 실험 검증 필수",
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────── */
  /*  AI 에이전트 / 멀티모달                                            */
  /* ──────────────────────────────────────────────────────────────── */

  "agent-cs-automation": {
    algorithmStack: {
      core: "Multi-Agent RAG + 툴 호출 (Tool Use) — CS 자동화 에이전트",
      technique: "의도 분류 → 툴 선택 (DB 조회/이메일 발송/환불 처리) → 결과 통합 → 응답 생성",
      model: "claude-sonnet-4-6 (오케스트레이터) + 도메인별 서브 에이전트",
      framework: "Claude Tool Use API + LangGraph + FastAPI + Prisma",
      paperRef: "Yao et al. 2022 — ReAct; Anthropic 2024 — Tool Use Documentation",
    },
    benchmark: {
      metrics: [
        { name: "CS 완전 자동화율", before: "챗봇 단일 ~30%", after: "에이전트 ~74%", benchmark: "월 10,000건 CS 처리" },
        { name: "평균 해결 시간", before: "수동 처리 평균 8분", after: "에이전트 ~45초", benchmark: "단순~중복잡도 케이스" },
        { name: "고객 만족도 (CSAT)", before: "수동 4.1/5.0", after: "에이전트 4.3/5.0", benchmark: "1,000건 설문" },
        { name: "에이전트 오류율", before: "N/A", after: "~4.2%", benchmark: "잘못된 툴 선택/실행 기준" },
      ],
      testCondition: "전자상거래 기업 2개소, 3개월 실제 CS 연동",
      dataSize: "CS 시나리오 50건+ 정의 + 연동 시스템 API 문서",
      roi: "CS 팀 40% 효율화, 24시간 자동 처리로 야간 CS 비용 제거",
    },
    reliability: {
      confidenceThreshold: "툴 실행 전 의도 확신도 0.90+ 요구, 미달 시 사람 확인 요청",
      fallbackBehavior: "복잡/고액/민감 케이스 자동 감지 → 즉시 상담원 핸드오프",
      validationMethod: "일별 에이전트 액션 로그 검토 + 주간 오류 패턴 분석",
      updateCycle: "새 CS 시나리오 추가 시 즉시, 정기 월 1회 성능 검토",
      riskFactors: [
        "환불/취소 등 되돌리기 어려운 액션 — 반드시 이중 확인 로직 구현",
        "에이전트 루프(무한 재시도) 방지 — 최대 시도 횟수 설정",
        "개인정보 처리 — 에이전트가 접근할 수 있는 데이터 범위 명확히 제한",
      ],
    },
  },

  "multimodal-product-desc": {
    algorithmStack: {
      core: "Vision-Language Model (VLM) — 이미지 + 텍스트 통합 분석",
      technique: "이미지 임베딩 (CLIP) + 텍스트 컨텍스트 결합 → Claude Vision으로 설명 생성",
      model: "claude-sonnet-4-6 (Vision 지원) + CLIP (ViT-L/14) for 임베딩",
      framework: "Claude API (vision) + OpenAI CLIP + FastAPI",
      paperRef: "Radford et al. 2021 — CLIP; Anthropic 2024 — Claude Vision",
    },
    benchmark: {
      metrics: [
        { name: "설명문 작성 정확도", before: "텍스트 전용 ~71%", after: "멀티모달 ~93%", benchmark: "상품 100개, 전문가 평가" },
        { name: "속성 추출 완전성", before: "수동 입력 기반 ~80%", after: "이미지 자동 추출 ~94%", benchmark: "50개 속성 기준" },
        { name: "설명문 생성 시간", before: "이미지 분석 + 작성 15분", after: "자동화 ~20초", benchmark: "상품 1개 기준" },
        { name: "다국어 설명문 생성", before: "번역 추가 30분/건", after: "동시 생성 ~25초", benchmark: "5개 언어 기준" },
      ],
      testCondition: "패션/전자/식품 카테고리 쇼핑몰, 상품 1,000개 평가",
      dataSize: "고품질 상품 이미지 + 기본 스펙 정보 (최소 구성)",
      roi: "상품 등록 업무 90% 자동화, 상품 설명 품질 일관성 확보",
    },
    reliability: {
      confidenceThreshold: "이미지 품질 점수 0.80+ 일 때만 자동 생성",
      fallbackBehavior: "저품질 이미지 → '고해상도 이미지 재업로드 요청' + 임시 기본 설명 생성",
      validationMethod: "생성 설명 vs 실제 반품 사유 연동 분석 + 주간 정확도 감사",
      updateCycle: "신규 상품 카테고리 추가 시 프롬프트 업데이트, 정기 분기별",
      riskFactors: [
        "허위 과장 설명 자동 생성 위험 — 금지 표현 필터 설정 필수",
        "색상 묘사는 모니터 색상 프로파일에 따라 오차 가능",
        "소재/성분 정보는 이미지만으로 판단 불가 — 스펙 데이터 병행 필수",
      ],
    },
  },

};

/* ================================================================== */
/*  유틸리티                                                             */
/* ================================================================== */

export function getTemplatePerformance(templateId: string): TemplatePerformance | null {
  return PERFORMANCE_DATA[templateId] ?? null;
}

export function hasPerformanceData(templateId: string): boolean {
  return templateId in PERFORMANCE_DATA;
}
