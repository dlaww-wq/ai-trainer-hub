# 실제 학습 시스템 아키텍처 설계

(에이전트 API 한도로 중단됨 — 아래는 핵심 설계안)

## 전체 구조

```
사용자 데이터 입력 → 학습 파이프라인 → 벡터DB 저장 → 챗봇 배포
     ↓                    ↓                ↓              ↓
 텍스트/이미지/음성    임베딩 생성       pgvector      /store/[slug]
```

## 템플릿 타입별 구현 방법

### 1. 텍스트 학습 (고객응대, FAQ) — 즉시 구현 가능
```
사용자: 메뉴/FAQ/정책 텍스트 입력
→ /api/learn/text: 텍스트 청킹 (500토큰, 50 overlap)
→ OpenAI Embeddings API로 벡터 생성
→ pgvector (PostgreSQL)에 저장
→ /api/chat/[storeId]: 질문 → 벡터 검색 → 상위 5개 문맥 → Claude API에 전달
```

**비용**: 임베딩 $0.0001/1K토큰, Claude Haiku $0.25/1M입력토큰
**사용자 비용**: 월 1,000건 대화 ≈ **$1~3**

### 2. 이미지 학습 (분류/검출) — 즉시 구현 가능
```
사용자: 이미지 + 라벨 업로드
→ Claude Vision API로 이미지 분석 (few-shot)
→ 참조 이미지를 base64로 저장
→ 새 이미지 → Claude Vision에 참조와 함께 전달 → 분류
```

**대안**: Roboflow API ($0/무료 1000장), CLIP 임베딩 → 유사도 비교

### 3. 이미지 생성 (LoRA) — 외부 서비스
```
사용자: 참조 이미지 20장 업로드
→ /api/learn/image-gen: Replicate API 호출 (dreambooth 학습)
→ 학습 완료 → 커스텀 모델 엔드포인트 생성
→ 사용자: 프롬프트 입력 → 이미지 생성
```

**비용**: Replicate dreambooth 학습 1회 **$3~5**, 생성 **$0.02/장**

### 4. 음성 클로닝 — 외부 서비스
```
사용자: 음성 녹음 3~10분 업로드
→ /api/learn/voice: ElevenLabs API 호출
→ 음성 프로필 생성
→ 텍스트 입력 → 내 목소리로 TTS 생성
```

**비용**: ElevenLabs **$5/월** (30분 음성생성)

### 5. 동작 분석 — 브라우저 실행
```
사용자: 운동 참조 영상 업로드 OR 웹캠
→ 브라우저에서 MediaPipe Pose 실행 (서버 비용 0)
→ 관절 각도 추출 → 참조 각도와 비교
→ 실시간 피드백: "무릎 각도 75도 → 위험"
```

**비용**: **$0** (브라우저에서 실행)

### 6. RAG 시스템 — 즉시 구현 가능
```
사용자: PDF/DOCX/텍스트 업로드
→ /api/learn/rag: 파일 파싱 → 청킹 → 임베딩 → pgvector
→ 질문 → 벡터 검색 → Claude에 문맥 전달
```

## DB 스키마 추가 (Prisma)

```prisma
model Store {
  id          String @id @default(cuid())
  slug        String @unique  // URL 슬러그
  userId      String
  name        String
  category    String
  systemPrompt String
  greeting    String
  settings    String @default("{}")  // JSON

  user        User @relation(...)
  chunks      Chunk[]
  conversations Conversation[]
}

model Chunk {
  id        String @id @default(cuid())
  storeId   String
  content   String
  embedding Float[]  // pgvector
  metadata  String @default("{}")

  store     Store @relation(...)
}

model Conversation {
  id        String @id @default(cuid())
  storeId   String
  role      String  // user | ai | owner
  content   String
  createdAt DateTime @default(now())

  store     Store @relation(...)
}
```

## API 엔드포인트

| 엔드포인트 | 메서드 | 용도 |
|-----------|--------|------|
| /api/store/create | POST | 매장 생성 |
| /api/learn/text | POST | 텍스트 학습 (청킹→임베딩→저장) |
| /api/learn/rag | POST | 파일 업로드 → RAG 구축 |
| /api/chat/[storeId] | POST | 고객 대화 (RAG 검색→Claude 응답) |
| /api/store/[slug] | GET | 매장 정보 조회 |
| /api/escalation/[storeId] | POST | 사장님 연결 요청 |

## 배포 플로우

```
1. 사장님 회원가입 → 업종 선택
2. 데이터 입력 (메뉴/FAQ/정책)
3. "학습 시작" 클릭 → 30초 내 완료
4. 테스트 대화 → 만족하면 "배포"
5. URL 생성: yourplatform.com/store/소울브루커피
6. 네이버 플레이스 홈페이지 필드에 URL 입력
7. 고객이 네이버에서 클릭 → AI 자동 응대
```

## 예상 사용자별 월 비용

| 규모 | 월 대화 | API 비용 | 서버 | 합계 |
|------|---------|---------|------|------|
| 소규모 (카페) | 300건 | ~$1 | - | ~$1 |
| 중규모 (쇼핑몰) | 2,000건 | ~$5 | - | ~$5 |
| 대규모 (프랜차이즈) | 10,000건 | ~$25 | - | ~$25 |

→ 구독료 19,900~79,900원 대비 **마진 90%+**
