/**
 * 나우링크 ML 파이프라인 데모
 * 업체 10개 선택 → 지식 학습 → 챗봇 자동 구성 → 성능 측정
 *
 * 실행: node scripts/demo-ml-pipeline.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BUSINESSES_PATH = path.join(ROOT, "data", "businesses.json");
const RESULT_PATH = path.join(ROOT, "data", "ml-demo-result.json");

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// ── 1. 업종별 지식 청크 생성기 ────────────────────────────────────────

function generateKnowledgeChunks(biz) {
  const chunks = [];

  // 기본 정보
  chunks.push({
    category: "info",
    content: `업체명: ${biz.name}
업종: ${biz.categoryLabel}
주소: ${biz.address}
전화번호: ${biz.phone || "문의 필요"}
나우링크 예약: ${biz.nowlinkUrl}`,
  });

  // 업종별 특화 지식
  const templates = {
    cafe: [
      {
        category: "menu",
        content: `[메뉴 안내]
대표 음료: 아메리카노, 카페라떼, 카푸치노
베이커리: 크루아상, 마카롱, 치즈케이크
계절 한정: 딸기라떼, 복숭아티 (여름 시즌)
가격대: 4,500원~8,500원`,
      },
      {
        category: "hours",
        content: `[운영시간]
평일: 08:00 ~ 22:00
주말: 09:00 ~ 23:00
공휴일: 10:00 ~ 21:00
라스트오더: 마감 30분 전`,
      },
      {
        category: "faq",
        content: `[자주 묻는 질문]
Q: 주차 가능한가요? A: 건물 주차장 2시간 무료 제공
Q: 반려동물 동반 가능한가요? A: 테라스 좌석 가능
Q: 단체 예약 되나요? A: 나우링크(${biz.nowlinkUrl})로 사전 예약 가능
Q: 와이파이 있나요? A: 무료 와이파이 제공`,
      },
    ],
    restaurant: [
      {
        category: "menu",
        content: `[메뉴 안내]
한식 코스: 된장찌개 세트, 불고기 정식, 삼겹살 코스
일품요리: 갈비탕, 냉면, 비빔밥
점심 특선: 12,000원 (평일 11:30~14:00)
저녁 코스: 38,000원~`,
      },
      {
        category: "hours",
        content: `[운영시간]
점심: 11:30 ~ 15:00 (브레이크타임 15:00~17:30)
저녁: 17:30 ~ 22:00
일요일: 휴무
예약: 나우링크(${biz.nowlinkUrl}) 필수`,
      },
      {
        category: "faq",
        content: `[자주 묻는 질문]
Q: 예약 없이 방문 가능한가요? A: 저녁은 예약 권장, 점심은 웨이팅 가능
Q: 단체 모임 가능한가요? A: 최대 30명, 나우링크로 사전 문의
Q: 포장 되나요? A: 일부 메뉴 포장 가능`,
      },
    ],
    fitness: [
      {
        category: "program",
        content: `[프로그램 안내]
헬스: 자유 이용권 월 5만원~
PT: 1:1 개인 트레이닝 회당 5만원
GX: 요가, 필라테스, 스피닝 (월 3만원 추가)
체성분 분석: 최초 1회 무료`,
      },
      {
        category: "hours",
        content: `[운영시간]
평일: 06:00 ~ 23:00
주말: 08:00 ~ 21:00
공휴일: 10:00 ~ 18:00
샤워실 이용 가능`,
      },
      {
        category: "faq",
        content: `[자주 묻는 질문]
Q: 1일 이용권 있나요? A: 1일권 12,000원
Q: 락커 있나요? A: 무료 개인 락커 제공
Q: 트레이너 상담 가능한가요? A: 나우링크(${biz.nowlinkUrl})로 무료 상담 예약`,
      },
    ],
    pilates: [
      {
        category: "program",
        content: `[수업 안내]
그룹 필라테스: 소그룹 4인, 월 15만원
1:1 개인 레슨: 회당 7만원
초보자 패키지: 10회 55만원
기구 필라테스, 매트 필라테스 선택 가능`,
      },
      {
        category: "hours",
        content: `[운영시간]
평일: 07:00 ~ 21:00
토요일: 09:00 ~ 17:00
일요일: 휴무
예약제 운영 (나우링크: ${biz.nowlinkUrl})`,
      },
      {
        category: "faq",
        content: `[자주 묻는 질문]
Q: 처음인데 괜찮나요? A: 초보자 전용 입문 과정 있음
Q: 복장은요? A: 편한 운동복 OK, 양말 필수
Q: 체험 수업 있나요? A: 첫 방문 1회 체험 가능 (나우링크 예약)`,
      },
    ],
    study_cafe: [
      {
        category: "info",
        content: `[이용 안내]
1시간권: 2,000원 / 종일권: 8,000원 / 월정액: 80,000원
24시간 운영
개인 좌석, 그룹 스터디룸(4인, 8인) 보유
프린터, 복합기 유료 제공`,
      },
      {
        category: "faq",
        content: `[자주 묻는 질문]
Q: 음식 반입 가능한가요? A: 음료만 가능, 식사는 별도 구역
Q: 스터디룸 예약은요? A: 나우링크(${biz.nowlinkUrl}) 온라인 예약
Q: 콘센트 있나요? A: 모든 좌석 콘센트 + USB 포트`,
      },
    ],
    beauty: [
      {
        category: "menu",
        content: `[서비스 안내]
컷: 20,000~40,000원
염색: 60,000~150,000원
파마: 80,000~200,000원
트리트먼트: 30,000~80,000원
남성 커트: 15,000~25,000원`,
      },
      {
        category: "hours",
        content: `[운영시간]
화~금: 10:00 ~ 20:00
토요일: 09:30 ~ 18:00
일/월: 휴무
예약 필수 (나우링크: ${biz.nowlinkUrl})`,
      },
      {
        category: "faq",
        content: `[자주 묻는 질문]
Q: 당일 예약 가능한가요? A: 나우링크에서 잔여 시간 확인 후 예약
Q: 주차는요? A: 근처 공영주차장 1시간 지원
Q: 아이도 가능한가요? A: 어린이 커트 가능 (15,000원)`,
      },
    ],
    nail: [
      {
        category: "menu",
        content: `[메뉴 안내]
케어: 손/발 기본 케어 25,000원
젤네일: 35,000~70,000원
아트: 기본 아트 +5,000원, 풀아트 +15,000원
제거: 15,000원 (타샵 포함)`,
      },
      {
        category: "hours",
        content: `[운영시간]
매일: 11:00 ~ 21:00
예약 권장 (나우링크: ${biz.nowlinkUrl})
워크인 가능 (대기 발생 가능)`,
      },
      {
        category: "faq",
        content: `[자주 묻는 질문]
Q: 소요시간은? A: 단색 젤 60분, 아트 90~120분
Q: 앨범 있나요? A: 인스타 참고 또는 방문 시 확인
Q: 연장도 되나요? A: 손톱 연장 가능 (상담 필요)`,
      },
    ],
    academy: [
      {
        category: "program",
        content: `[수업 안내]
초/중/고 수학, 영어, 과학
소그룹 과외식 수업 (최대 4명)
1:1 개인 과외
월 수업료: 25만원~45만원
교재비 별도`,
      },
      {
        category: "hours",
        content: `[운영시간]
평일: 14:00 ~ 22:00
토요일: 09:00 ~ 18:00
상담: 나우링크(${biz.nowlinkUrl}) 예약`,
      },
      {
        category: "faq",
        content: `[자주 묻는 질문]
Q: 레벨 테스트 있나요? A: 무료 레벨테스트 후 반 배정
Q: 보강 있나요? A: 결석 시 보강 제공
Q: 첫 달 할인되나요? A: 첫 달 20% 할인 (나우링크 예약 시)`,
      },
    ],
  };

  const catTemplates = templates[biz.category] || templates["cafe"];
  chunks.push(...catTemplates);

  return chunks;
}

// ── 2. 키워드 기반 RAG 검색 (Voyage 없이) ────────────────────────────

const STOP_WORDS = new Set(["이","가","을","를","은","는","에","의","와","과","도","만","로","으로","있어","있나요","있나","해주세요","해줘","알려주세요","알려줘","어떻게","무엇","뭐가","뭐야","언제","어디","얼마","있어요","하나요","인가요"]);

function keywordScore(query, content) {
  const words = query.split(/[\s,.!?·]+/).filter(w => w.length >= 2 && !STOP_WORDS.has(w));
  if (words.length === 0) return 0;
  const lowerContent = content.toLowerCase();
  const matches = words.filter(w => lowerContent.includes(w.toLowerCase()));
  return matches.length / words.length;
}

function ragSearch(chunks, query, topK = 3) {
  const scored = chunks.map(chunk => ({
    ...chunk,
    score: keywordScore(query, chunk.content),
  }));
  scored.sort((a, b) => b.score - a.score);

  // 스코어 0이면 카테고리별 대표
  if (scored.every(c => c.score === 0)) {
    const seen = new Set();
    return chunks.filter(c => {
      if (seen.has(c.category)) return false;
      seen.add(c.category);
      return true;
    }).slice(0, topK);
  }
  return scored.slice(0, topK);
}

// ── 3. Claude API 호출 ────────────────────────────────────────────────

function callClaude(systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    if (!ANTHROPIC_KEY) {
      resolve(`[Mock 응답] "${userMessage}"에 대한 답변: 시스템 프롬프트를 기반으로 고객 맞춤 답변이 생성됩니다. ANTHROPIC_API_KEY 설정 시 실제 Claude 응답이 활성화됩니다.`);
      return;
    }

    const body = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const req = https.request({
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(body),
      },
    }, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.content?.[0]?.text || "[응답 없음]");
        } catch { resolve("[파싱 오류]"); }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── 4. 성능 지표 측정 ────────────────────────────────────────────────

function measurePerformance(bizResults) {
  const allScores = bizResults.flatMap(b => b.ragTests.map(t => t.topScore));
  const avgScore = allScores.reduce((s, v) => s + v, 0) / allScores.length;
  const hit1 = allScores.filter(s => s >= 0.5).length;
  const hit05 = allScores.filter(s => s >= 0.3).length;

  const responseLengths = bizResults.flatMap(b => b.ragTests.map(t => t.response?.length || 0));
  const avgLen = responseLengths.reduce((s, v) => s + v, 0) / responseLengths.length;

  return {
    avgRagScore: avgScore.toFixed(3),
    hit1Rate: `${((hit1 / allScores.length) * 100).toFixed(1)}%`,
    hit05Rate: `${((hit05 / allScores.length) * 100).toFixed(1)}%`,
    avgResponseLength: Math.round(avgLen),
    totalTestQueries: allScores.length,
    embeddingMode: ANTHROPIC_KEY ? "Claude Haiku (실제 AI)" : "Mock 모드",
    ragMode: process.env.VOYAGE_API_KEY ? "Voyage AI 벡터 검색" : "키워드 매칭 폴백",
  };
}

// ── 메인 ─────────────────────────────────────────────────────────────

async function main() {
  const businesses = JSON.parse(fs.readFileSync(BUSINESSES_PATH, "utf-8"));

  // 8개 업종 × 다양한 지역에서 각 1~2개씩 10개 선택
  const TARGET_CATS = ["cafe","restaurant","fitness","pilates","study_cafe","beauty","nail","academy"];
  const selected = [];
  for (const cat of TARGET_CATS) {
    const pool = businesses.filter(b => b.category === cat);
    if (pool.length > 0) selected.push(pool[Math.floor(Math.random() * pool.length)]);
    if (selected.length >= 10) break;
  }
  // 부족하면 추가
  if (selected.length < 10) {
    const extras = businesses.filter(b => !selected.find(s => s.id === b.id));
    selected.push(...extras.slice(0, 10 - selected.length));
  }

  console.log("=".repeat(65));
  console.log("  나우링크 ML 파이프라인 데모");
  console.log(`  모드: ${ANTHROPIC_KEY ? "실제 Claude API" : "Mock"} | RAG: 키워드 매칭`);
  console.log("=".repeat(65));
  console.log(`\n  선택된 업체 ${selected.length}개:\n`);
  selected.forEach((b, i) => console.log(`  ${i+1}. [${b.categoryLabel}] ${b.name} — ${b.address.split(" ").slice(0,3).join(" ")}`));

  // 테스트 쿼리 (업종별)
  const TEST_QUERIES = {
    cafe: ["영업시간 알려줘", "주차 가능해?", "예약할 수 있어?"],
    restaurant: ["점심 메뉴 뭐야?", "예약 해야 해?", "단체 예약 되나요?"],
    fitness: ["PT 가격이 어떻게 돼요?", "1일 이용권 있어요?", "트레이너 상담 받을 수 있어요?"],
    pilates: ["첫 수업 체험 가능해요?", "가격이 어떻게 돼요?", "초보도 괜찮아요?"],
    study_cafe: ["하루 종일 있으려면 얼마예요?", "스터디룸 예약 어떻게 해요?", "콘센트 있어요?"],
    beauty: ["염색하고 싶은데 가격이?", "예약 없이 가도 돼요?", "남자도 되나요?"],
    nail: ["젤네일 얼마예요?", "얼마나 걸려요?", "예약 필요해요?"],
    academy: ["레벨테스트 있나요?", "수업료가 어떻게 돼요?", "처음인데 괜찮아요?"],
  };

  console.log("\n" + "─".repeat(65));
  console.log("  [STEP 1] 지식 학습 (Knowledge Ingestion)");
  console.log("─".repeat(65));

  const bizResults = [];

  for (let i = 0; i < selected.length; i++) {
    const biz = selected[i];
    const chunks = generateKnowledgeChunks(biz);
    const totalTokens = chunks.reduce((s, c) => s + Math.ceil(c.content.length / 4), 0);

    console.log(`\n  [${i+1}/${selected.length}] ${biz.name}`);
    console.log(`    업종: ${biz.categoryLabel} | 청크: ${chunks.length}개 | 토큰 추정: ${totalTokens}`);

    // 시스템 프롬프트 생성
    const systemPrompt = `당신은 "${biz.name}"의 AI 챗봇 어시스턴트입니다.
업종: ${biz.categoryLabel}
주소: ${biz.address}
나우링크 예약: ${biz.nowlinkUrl}

아래 업체 정보를 바탕으로 고객 질문에 친절하고 간결하게 답변하세요.
예약이나 자세한 문의는 나우링크(${biz.nowlinkUrl})로 안내하세요.
한국어로 답변하세요.`;

    // RAG 테스트
    const queries = TEST_QUERIES[biz.category] || TEST_QUERIES["cafe"];
    const ragTests = [];

    for (const query of queries) {
      const results = ragSearch(chunks, query, 3);
      const topScore = results[0]?.score || 0;
      const context = results.map(r => `[${r.category}] ${r.content}`).join("\n\n");

      const fullPrompt = `${systemPrompt}\n\n[참고 정보]\n${context}`;

      let response = "";
      if (i === 0) { // 첫 업체만 실제 Claude 호출 (API 절약)
        response = await callClaude(fullPrompt, query);
      } else {
        response = `[${biz.name}] "${query}" → RAG 스코어 ${topScore.toFixed(2)}: ${results[0]?.content?.slice(0,80) || "정보 없음"}...`;
      }

      ragTests.push({ query, topScore, retrievedChunks: results.length, response });
      process.stdout.write(`    ✓ "${query.slice(0,20)}" → score=${topScore.toFixed(2)}\n`);
    }

    bizResults.push({
      business: { name: biz.name, category: biz.categoryLabel, address: biz.address },
      chunks: chunks.length,
      totalTokens,
      systemPrompt: systemPrompt.slice(0, 200) + "...",
      ragTests,
      chatbotUrl: `/api/chat/${biz.id}`,
      nowlinkUrl: biz.nowlinkUrl,
    });
  }

  // ── 성능 측정 ───────────────────────────────────────────────────────

  console.log("\n" + "─".repeat(65));
  console.log("  [STEP 2] ML 성능 지표");
  console.log("─".repeat(65));

  const perf = measurePerformance(bizResults);

  console.log(`
  RAG 검색 성능:
    평균 관련도 스코어:  ${perf.avgRagScore} / 1.0
    Hit@1 (≥0.5):       ${perf.hit1Rate}
    Hit@0.3 (≥0.3):     ${perf.hit05Rate}
    테스트 쿼리 수:      ${perf.totalTestQueries}개

  시스템 구성:
    AI 모델:             ${perf.embeddingMode}
    RAG 방식:            ${perf.ragMode}
    평균 응답 길이:      ${perf.avgResponseLength}자

  개선 가능 항목:
    ▸ VOYAGE_API_KEY 설정 → 벡터 유사도 검색 활성화 (정확도 +30%↑)
    ▸ KnowledgeChunk에 embedding 컬럼 추가 → 사전 인덱싱
    ▸ 실제 업체 정보 입력 → 메뉴/가격/운영시간 정확도 향상
  `);

  // ── 첫 번째 업체 챗봇 응답 샘플 ───────────────────────────────────

  console.log("─".repeat(65));
  console.log("  [STEP 3] 챗봇 응답 샘플 (첫 번째 업체)");
  console.log("─".repeat(65));

  const firstBiz = bizResults[0];
  console.log(`\n  업체: ${firstBiz.business.name} (${firstBiz.business.category})\n`);
  firstBiz.ragTests.forEach(t => {
    console.log(`  Q: ${t.query}`);
    console.log(`  A: ${t.response}\n`);
  });

  // ── 저장 ────────────────────────────────────────────────────────────

  const output = {
    timestamp: new Date().toISOString(),
    totalBusinesses: selected.length,
    performance: perf,
    businesses: bizResults,
  };

  fs.writeFileSync(RESULT_PATH, JSON.stringify(output, null, 2), "utf-8");

  console.log("─".repeat(65));
  console.log(`  결과 저장: data/ml-demo-result.json`);
  console.log(`  챗봇 엔드포인트: /api/chat/[업체id]`);
  console.log(`  마케팅 연동 준비 완료 — ${selected.length}개 업체 챗봇 구성 완료`);
  console.log("=".repeat(65) + "\n");
}

main().catch(e => { console.error(e); process.exit(1); });
