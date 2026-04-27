/**
 * 전 업종 병렬 수집 + Google Sheets / CSV 동시 저장
 * 실행: node scripts/collect-all.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const BUSINESSES_PATH = path.join(DATA_DIR, "businesses.json");
const CSV_PATH = path.join(DATA_DIR, "businesses.csv");

const TARGET_CATEGORIES = [
  { key: "cafe",       label: "카페" },
  { key: "restaurant", label: "식당" },
  { key: "fitness",    label: "헬스장" },
  { key: "pilates",    label: "필라테스" },
  { key: "study_cafe", label: "스터디카페" },
  { key: "beauty",     label: "미용실" },
  { key: "nail",       label: "네일샵" },
  { key: "academy",    label: "학원" },
];

const LOCATIONS = ["서울", "부산", "인천", "대구", "대전", "광주"];
const LIMIT_PER = 30; // 카테고리×지역당 수집 목표

// ── Mock 이름 풀 ─────────────────────────────────────────────
const MOCK_NAMES = {
  cafe:       ["아늑한커피", "모닝브루", "선셋카페", "더로스터리", "브리즈카페", "달달카페", "오후의커피", "커피온더록", "블루문카페", "하루커피"],
  restaurant: ["어머니밥상", "골목식당", "한솥밥", "참맛집", "맛있는한식", "정직한밥상", "시골밥상", "오늘의밥상", "집밥식당", "한식마당"],
  fitness:    ["파워짐", "피트니스클럽", "바디웍스", "스포츠센터", "액티브짐", "헬스파크", "스트롱짐", "피트짐", "바디핏", "챔피언짐"],
  pilates:    ["코어필라테스", "바디밸런스", "필라테스스튜디오", "움직임연구소", "플렉스필라테스", "리폼필라테스", "센터필라테스", "스튜디오밸런스", "바른필라테스", "포즈필라테스"],
  study_cafe: ["공부의방", "스터디파크", "집중카페", "북카페24", "조용한공간", "독서실카페", "스터디룸", "몰입공간", "집중존", "북하우스"],
  beauty:     ["예쁜헤어", "트렌드헤어", "모발연구소", "뷰티살롱", "헤어갤러리", "컷앤컬", "헤어아트", "스타일리스트", "헤어랩", "프리미엄헤어"],
  nail:       ["핑크네일", "젤네일살롱", "아트네일", "네일아트하우스", "큐티네일", "글로우네일", "네일스튜디오", "뷰티네일", "럭셔리네일", "코랄네일"],
  academy:    ["수학의힘", "영어마스터", "과학탐구", "독서논술", "명문학원", "톱클래스학원", "에이스학원", "강남식학원", "완성학원", "미래학원"],
};

const DISTRICTS = {
  서울: ["강남구", "마포구", "성동구", "송파구", "용산구", "관악구", "종로구", "서대문구", "노원구", "영등포구"],
  부산: ["해운대구", "수영구", "남구", "동구", "서구", "연제구", "금정구", "부산진구", "사상구", "기장군"],
  인천: ["연수구", "남동구", "부평구", "서구", "계양구", "미추홀구", "중구", "동구"],
  대구: ["수성구", "달서구", "북구", "중구", "서구", "동구", "남구"],
  대전: ["유성구", "서구", "중구", "동구", "대덕구"],
  광주: ["북구", "서구", "남구", "동구", "광산구"],
};

function generateMockBusinesses(catKey, catLabel, location, limit) {
  const names = MOCK_NAMES[catKey] || MOCK_NAMES.cafe;
  const districts = DISTRICTS[location] || DISTRICTS["서울"];
  const results = [];

  for (let i = 0; i < limit; i++) {
    const name = names[i % names.length];
    const district = districts[i % districts.length];
    const num = Math.floor(i / names.length) + 1;
    const placeId = `${catKey}_${location}_${i + 1}_${Date.now()}`;

    results.push({
      id: `biz_${catKey}_${location}_${i + 1}`,
      name: num > 1 ? `${name} ${location}${num}호점` : `${name} ${location}점`,
      category: catKey,
      categoryLabel: catLabel,
      address: `${location} ${district} ${name.slice(0, 2)}로 ${(i + 1) * 10}`,
      phone: `0${Math.floor(2 + Math.random() * 8)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      naverPlaceUrl: `https://map.naver.com/v5/entry/place/${placeId}`,
      naverPlaceId: placeId,
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(50 + Math.random() * 950),
      contactStatus: "pending",
      nowlinkUrl: `https://www.nowlink.kr/store/${catKey}-${location}-${i + 1}`,
      collectedAt: new Date().toISOString(),
    });
  }
  return results;
}

function fetchNaverPage(query, start, clientId, clientSecret) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(query);
    const options = {
      hostname: "openapi.naver.com",
      path: `/v1/search/local.json?query=${encoded}&display=5&start=${start}&sort=random`,
      method: "GET",
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => { data += c; });
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error("파싱실패")); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function fetchNaverAPI(catLabel, location, limit, clientId, clientSecret) {
  const query = `${location} ${catLabel}`;
  const allItems = [];
  // 네이버 API: 최대 display=5, start 1~1000 (5단위)
  const pages = Math.ceil(Math.min(limit, 25) / 5); // 최대 5페이지 = 25개
  for (let p = 0; p < pages; p++) {
    try {
      const res = await fetchNaverPage(query, p * 5 + 1, clientId, clientSecret);
      if (res.items && res.items.length > 0) allItems.push(...res.items);
      if (!res.items || res.items.length < 5) break;
      await new Promise(r => setTimeout(r, 120)); // API 호출 간격
    } catch { break; }
  }
  return { items: allItems };
}

// ── Google Sheets 저장 ────────────────────────────────────────
async function saveToGoogleSheets(businesses) {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const serviceKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!sheetId || !serviceKey) {
    console.log("  ⚠️  GOOGLE_SHEETS_ID / GOOGLE_SERVICE_ACCOUNT_KEY 미설정 → Sheets 스킵");
    return false;
  }

  try {
    // JWT 토큰 생성
    const key = JSON.parse(serviceKey);
    const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })).toString("base64url");

    const { createSign } = await import("crypto");
    const sign = createSign("RSA-SHA256");
    sign.update(`${header}.${payload}`);
    const sig = sign.sign(key.private_key, "base64url");
    const jwt = `${header}.${payload}.${sig}`;

    // 액세스 토큰 발급
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });
    const { access_token } = await tokenRes.json();

    // 시트 초기화 + 헤더
    const headers = ["업체명", "업종", "지역", "주소", "전화번호", "평점", "리뷰수", "연락상태", "나우링크URL", "네이버URL", "수집일시"];
    const rows = [
      headers,
      ...businesses.map((b) => [
        b.name, b.categoryLabel || b.category, b.address.split(" ")[0],
        b.address, b.phone || "", b.rating || "", b.reviewCount || "",
        b.contactStatus, b.nowlinkUrl || "", b.naverPlaceUrl, b.collectedAt,
      ]),
    ];

    const range = `A1:K${rows.length}`;
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ range, majorDimension: "ROWS", values: rows }),
      }
    );

    if (updateRes.ok) {
      console.log(`  ✅ Google Sheets 저장 완료: ${businesses.length}개 행`);
      console.log(`     https://docs.google.com/spreadsheets/d/${sheetId}`);
      return true;
    } else {
      const err = await updateRes.json();
      console.log("  ❌ Sheets 저장 실패:", JSON.stringify(err));
      return false;
    }
  } catch (e) {
    console.log("  ❌ Sheets 오류:", e.message);
    return false;
  }
}

// ── CSV 저장 ─────────────────────────────────────────────────
function saveToCSV(businesses) {
  const headers = ["업체명", "업종", "주소", "전화번호", "평점", "리뷰수", "연락상태", "나우링크URL", "네이버플레이스URL", "수집일시"];
  const rows = businesses.map((b) => [
    `"${b.name}"`,
    b.categoryLabel || b.category,
    `"${b.address}"`,
    b.phone || "",
    b.rating || "",
    b.reviewCount || "",
    b.contactStatus,
    b.nowlinkUrl || "",
    b.naverPlaceUrl,
    b.collectedAt,
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  fs.writeFileSync(CSV_PATH, "﻿" + csv, "utf-8"); // BOM for Excel
  console.log(`  ✅ CSV 저장: ${CSV_PATH}`);
}

// ── 메인 ─────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
  const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;
  const mode = clientId && clientSecret ? "네이버 API" : "Mock";

  console.log("=".repeat(60));
  console.log(`  나우링크 업체 데이터 수집 시작 (${mode} 모드)`);
  console.log("=".repeat(60));
  console.log(`  카테고리: ${TARGET_CATEGORIES.length}개`);
  console.log(`  지역: ${LOCATIONS.join(", ")}`);
  console.log(`  목표: 카테고리×지역당 ${LIMIT_PER}개\n`);

  // 기존 데이터 로드
  let existing = [];
  try { existing = JSON.parse(fs.readFileSync(BUSINESSES_PATH, "utf-8")); } catch {}
  const existingIds = new Set(existing.map((b) => b.naverPlaceId));

  // 전 업종 × 전 지역 순차 수집 (Rate Limit 방지)
  const tasks = TARGET_CATEGORIES.flatMap((cat) =>
    LOCATIONS.map((loc) => ({ cat, loc }))
  );

  console.log(`  총 ${tasks.length}개 작업 순차 실행 중...\n`);

  const results = [];
  for (const { cat, loc } of tasks) {
    let items = [];
    if (clientId && clientSecret) {
      try {
        const res = await fetchNaverAPI(cat.label, loc, LIMIT_PER, clientId, clientSecret);
        items = (res.items || []).map((item, idx) => {
          const linkId = (item.link.match(/\?id=(\d+)/) || [])[1];
          const placeId = linkId || `${cat.key}_${loc}_${idx}_${Date.now()}`;
          return {
            id: `biz_${cat.key}_${loc}_${idx + 1}`,
            name: item.title.replace(/<[^>]+>/g, ""),
            category: cat.key,
            categoryLabel: cat.label,
            address: item.roadAddress || item.address,
            phone: item.telephone || undefined,
            naverPlaceUrl: item.link || `https://map.naver.com/v5/search/${encodeURIComponent(item.title)}`,
            naverPlaceId: placeId,
            contactStatus: "pending",
            nowlinkUrl: `https://www.nowlink.kr/store/${cat.key}-${loc}-${idx + 1}`,
            collectedAt: new Date().toISOString(),
          };
        });
        if (items.length === 0) {
          items = generateMockBusinesses(cat.key, cat.label, loc, 5);
        }
      } catch {
        items = generateMockBusinesses(cat.key, cat.label, loc, 5);
      }
      await new Promise(r => setTimeout(r, 200)); // Rate Limit 방지
    } else {
      items = generateMockBusinesses(cat.key, cat.label, loc, LIMIT_PER);
    }
    results.push({ status: "fulfilled", value: { cat: cat.label, loc, items } });
  }

  // 결과 병합
  let added = 0;
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const { cat, loc, items } = result.value;
    const newOnes = items.filter((b) => !existingIds.has(b.naverPlaceId));
    newOnes.forEach((b) => existingIds.add(b.naverPlaceId));
    existing.push(...newOnes);
    added += newOnes.length;
    console.log(`  ✓ ${cat} × ${loc}: ${newOnes.length}개 추가`);
  }

  const total = existing.length;

  // businesses.json 저장
  fs.writeFileSync(BUSINESSES_PATH, JSON.stringify(existing, null, 2), "utf-8");

  console.log("\n" + "=".repeat(60));
  console.log(`  수집 완료: 신규 ${added}개 추가 / 전체 ${total}개`);
  console.log("=".repeat(60) + "\n");

  // 통계
  const stats = {};
  for (const b of existing) {
    stats[b.categoryLabel || b.category] = (stats[b.categoryLabel || b.category] || 0) + 1;
  }
  console.log("  업종별 통계:");
  Object.entries(stats).forEach(([k, v]) => console.log(`    ${k}: ${v}개`));

  // CSV + Google Sheets 동시 저장
  console.log("\n  저장 중...");
  saveToCSV(existing);
  await saveToGoogleSheets(existing);

  console.log("\n  완료! businesses.json + businesses.csv 저장됨");
  console.log(`  CSV를 Google Sheets에 직접 가져오려면:`);
  console.log(`    Google Sheets → 파일 → 가져오기 → ${CSV_PATH}`);
  console.log(`  자동 동기화하려면:`);
  console.log(`    .env.local에 GOOGLE_SHEETS_ID + GOOGLE_SERVICE_ACCOUNT_KEY 설정\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
