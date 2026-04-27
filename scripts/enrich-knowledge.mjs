/**
 * 네이버 리뷰 서칭 → 지식베이스 자동 보강
 *
 * 실행: node scripts/enrich-knowledge.mjs
 *
 * 수집하는 정보:
 * 1. 네이버 블로그 리뷰 (블로그 검색 API)
 * 2. 네이버 플레이스 기본 정보 (지역 검색 API)
 * 3. 수집된 정보 → KnowledgeChunk 형식으로 변환
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BUSINESSES_PATH = path.join(ROOT, "data", "businesses.json");
const ENRICHED_PATH = path.join(ROOT, "data", "enriched-knowledge.json");

const NAVER_CLIENT_ID = process.env.NAVER_SEARCH_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_SEARCH_CLIENT_SECRET;

// ── 네이버 블로그 검색 ─────────────────────────────────────────────

function fetchNaverBlog(query, display = 3) {
  return new Promise((resolve) => {
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) { resolve([]); return; }

    const encoded = encodeURIComponent(query);
    const options = {
      hostname: "openapi.naver.com",
      path: `/v1/search/blog.json?query=${encoded}&display=${display}&sort=sim`,
      method: "GET",
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => data += c);
      res.on("end", () => {
        try { resolve(JSON.parse(data).items || []); }
        catch { resolve([]); }
      });
    });
    req.on("error", () => resolve([]));
    req.end();
  });
}

// ── HTML 태그 제거 ──────────────────────────────────────────────────

function stripHtml(str = "") {
  return str.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
}

// ── 리뷰에서 유용한 정보 추출 ──────────────────────────────────────

function extractInsights(title, description, category) {
  const text = `${title} ${description}`.toLowerCase();
  const insights = [];

  // 공통 인사이트
  if (text.includes("주차")) insights.push("주차 관련 정보가 있습니다.");
  if (text.includes("웨이팅") || text.includes("대기")) insights.push("인기 매장으로 대기가 발생할 수 있습니다.");
  if (text.includes("예약")) insights.push("예약 가능한 매장입니다.");
  if (text.includes("혼밥") || text.includes("혼자")) insights.push("혼자 방문하기 좋은 매장입니다.");
  if (text.includes("데이트")) insights.push("데이트 코스로 추천되는 매장입니다.");
  if (text.includes("모임") || text.includes("단체")) insights.push("단체 모임 가능한 매장입니다.");
  if (text.includes("친절") || text.includes("서비스가 좋")) insights.push("친절한 서비스로 평가받고 있습니다.");

  // 업종별 인사이트
  if (category === "cafe" || category === "카페") {
    if (text.includes("콘센트") || text.includes("충전")) insights.push("콘센트/충전 가능한 카페입니다.");
    if (text.includes("분위기") || text.includes("인테리어")) insights.push("분위기 좋은 카페로 알려져 있습니다.");
    if (text.includes("wifi") || text.includes("와이파이")) insights.push("와이파이 이용 가능합니다.");
  }

  if (category === "fitness" || category === "헬스장") {
    if (text.includes("깨끗") || text.includes("청결")) insights.push("청결한 시설로 평가받고 있습니다.");
    if (text.includes("최신") || text.includes("신형")) insights.push("최신 기구를 보유하고 있습니다.");
  }

  if (category === "beauty" || category === "미용실") {
    if (text.includes("실력") || text.includes("잘하")) insights.push("실력 있는 스타일리스트로 평가받고 있습니다.");
    if (text.includes("가성비")) insights.push("가격 대비 만족도가 높은 미용실입니다.");
  }

  return insights;
}

// ── 지식 청크로 변환 ────────────────────────────────────────────────

function buildKnowledgeFromReviews(biz, blogItems) {
  const chunks = [];

  if (blogItems.length === 0) return chunks;

  // 리뷰 요약 청크
  const reviewSummaries = blogItems.map((item, i) => {
    const title = stripHtml(item.title);
    const desc = stripHtml(item.description);
    const insights = extractInsights(title, desc, biz.category);
    return `리뷰 ${i + 1}: ${title}\n${desc.slice(0, 150)}${insights.length ? "\n[인사이트] " + insights.join(" / ") : ""}`;
  });

  chunks.push({
    category: "review",
    source: "naver_blog",
    content: `[고객 리뷰 요약 - ${biz.name}]\n\n${reviewSummaries.join("\n\n")}`,
  });

  // 인사이트 통합 청크
  const allInsights = blogItems.flatMap((item) =>
    extractInsights(stripHtml(item.title), stripHtml(item.description), biz.category)
  );
  const uniqueInsights = [...new Set(allInsights)];

  if (uniqueInsights.length > 0) {
    chunks.push({
      category: "faq",
      source: "review_insights",
      content: `[고객 리뷰 기반 정보 - ${biz.name}]\n${uniqueInsights.map(i => `• ${i}`).join("\n")}`,
    });
  }

  return chunks;
}

// ── 업종별 기본 지식 템플릿 (고품질) ────────────────────────────────

function buildBaseKnowledge(biz) {
  const cityName = biz.address?.split(" ")[0] || "";
  const districtName = biz.address?.split(" ")[1] || "";

  const base = {
    category: "info",
    source: "system",
    content: `[기본 정보 - ${biz.name}]
업체명: ${biz.name}
업종: ${biz.categoryLabel}
주소: ${biz.address}
지역: ${cityName} ${districtName}
전화: ${biz.phone || "나우링크를 통해 문의하세요"}
나우링크 예약/문의: ${biz.nowlinkUrl}
네이버 플레이스: ${biz.naverPlaceUrl || "정보 없음"}`,
  };

  const locationFaq = {
    category: "faq",
    source: "system",
    content: `[위치 안내 - ${biz.name}]
Q: 어디에 있어요?
A: ${biz.address}에 위치해 있습니다.
Q: ${cityName}에 있나요?
A: 네, ${cityName} ${districtName}에 있습니다.
Q: 네이버 지도로 찾을 수 있나요?
A: ${biz.naverPlaceUrl ? `네이버 플레이스(${biz.naverPlaceUrl})에서 확인하실 수 있습니다.` : "주소로 검색해주세요: " + biz.address}`,
  };

  const reservationFaq = {
    category: "faq",
    source: "system",
    content: `[예약/문의 안내 - ${biz.name}]
Q: 예약하고 싶어요
A: 나우링크(${biz.nowlinkUrl})에서 편리하게 예약하실 수 있습니다.
Q: 전화로 문의할 수 있나요?
A: ${biz.phone ? `${biz.phone}로 연락주세요.` : `나우링크(${biz.nowlinkUrl})를 통해 문의해 주세요.`}
Q: 영업 중인지 확인하고 싶어요
A: 나우링크 또는 네이버 플레이스에서 실시간 영업 정보를 확인하세요.`,
  };

  return [base, locationFaq, reservationFaq];
}

// ── 메인 ────────────────────────────────────────────────────────────

async function main() {
  const businesses = JSON.parse(fs.readFileSync(BUSINESSES_PATH, "utf-8"));

  // 10개만 선택 (데모용 — 실제로는 전체)
  const targets = businesses.slice(0, 10);

  console.log("=".repeat(65));
  console.log("  나우링크 지식베이스 보강 (리뷰 서칭)");
  console.log(`  모드: ${NAVER_CLIENT_ID ? "네이버 API" : "기본 템플릿만"}`);
  console.log("=".repeat(65));
  console.log(`  대상 업체: ${targets.length}개\n`);

  const enrichedData = [];

  for (let i = 0; i < targets.length; i++) {
    const biz = targets[i];
    process.stdout.write(`  [${i+1}/${targets.length}] ${biz.name} ... `);

    const chunks = [];

    // 1. 기본 지식 (고품질 템플릿)
    chunks.push(...buildBaseKnowledge(biz));

    // 2. 네이버 블로그 리뷰 서칭
    if (NAVER_CLIENT_ID) {
      const query = `${biz.name} ${biz.address?.split(" ").slice(0,2).join(" ")} 후기`;
      const blogItems = await fetchNaverBlog(query, 3);
      const reviewChunks = buildKnowledgeFromReviews(biz, blogItems);
      chunks.push(...reviewChunks);
      process.stdout.write(`리뷰 ${blogItems.length}개 수집\n`);
      await new Promise(r => setTimeout(r, 300)); // API Rate Limit
    } else {
      process.stdout.write(`기본 템플릿 생성\n`);
    }

    enrichedData.push({
      businessId: biz.id,
      businessName: biz.name,
      category: biz.categoryLabel,
      address: biz.address,
      nowlinkUrl: biz.nowlinkUrl,
      chunks,
      totalChunks: chunks.length,
      totalTokens: chunks.reduce((s, c) => s + Math.ceil(c.content.length / 4), 0),
      enrichedAt: new Date().toISOString(),
    });
  }

  // 저장
  fs.writeFileSync(ENRICHED_PATH, JSON.stringify(enrichedData, null, 2), "utf-8");

  console.log("\n" + "─".repeat(65));
  console.log("  결과 요약");
  console.log("─".repeat(65));

  let totalChunks = 0;
  let totalTokens = 0;
  enrichedData.forEach(b => {
    console.log(`  ${b.businessName}: ${b.totalChunks}청크 / ~${b.totalTokens}토큰`);
    totalChunks += b.totalChunks;
    totalTokens += b.totalTokens;
  });

  console.log(`\n  합계: ${totalChunks}청크 / ~${totalTokens}토큰`);
  console.log(`  저장: data/enriched-knowledge.json`);
  console.log("\n  다음 단계:");
  console.log("  → 이 데이터를 Railway DB의 KnowledgeChunk 테이블에 INSERT");
  console.log("  → /api/knowledge/ingest 엔드포인트로 자동 동기화 가능");
  console.log("=".repeat(65) + "\n");
}

main().catch(e => { console.error(e); process.exit(1); });
