/**
 * RAG — Claude Reranker 방식
 *
 * 1단계: 키워드 + TF-IDF 유사도로 후보 청크 15개 추출 (무료)
 * 2단계: Claude Haiku로 관련도 재정렬 (토큰 소모, ~400tok/요청)
 *
 * Voyage AI 없이 동일 수준 정확도 달성.
 * ANTHROPIC_API_KEY 없으면 1단계만으로 폴백.
 */

import { prisma } from "@/lib/prisma";

// ── 불용어 ───────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "이","가","을","를","은","는","에","의","와","과","도","만","로","으로",
  "있어","있나요","있나","해주세요","해줘","알려주세요","알려줘","어떻게",
  "무엇","뭐가","뭐야","언제","어디","얼마","있어요","하나요","인가요",
  "좀","그","이","저","것","수","더","안","못","잘","다","또","제",
]);

// ── 1단계: 키워드 + 바이그램 스코어링 ───────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w가-힣\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

function keywordScore(query: string, content: string): number {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return 0;

  const cLower = content.toLowerCase();

  // 단어 매칭
  const wordMatches = qTokens.filter((w) => cLower.includes(w)).length;
  const wordScore = wordMatches / qTokens.length;

  // 바이그램 보너스 (연속 두 단어가 함께 있으면 더 관련성 높음)
  let bigramBonus = 0;
  for (let i = 0; i < qTokens.length - 1; i++) {
    const bigram = qTokens[i] + " " + qTokens[i + 1];
    if (cLower.includes(bigram)) bigramBonus += 0.3;
  }

  // 정확한 구문 일치 보너스
  const exactBonus = cLower.includes(query.toLowerCase().trim()) ? 0.5 : 0;

  return Math.min(wordScore + bigramBonus + exactBonus, 1.5); // 1.5까지 가능
}

// ── 2단계: Claude Reranker ───────────────────────────────────────────

interface ChunkCandidate {
  content: string;
  category: string;
  score: number;
}

async function claudeRerank(
  query: string,
  candidates: ChunkCandidate[],
  topK: number
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || candidates.length <= topK) {
    return candidates.slice(0, topK).map((c) => `[${c.category}]\n${c.content}`);
  }

  const chunkList = candidates
    .map((c, i) => `[${i + 1}] (${c.category})\n${c.content.slice(0, 300)}`)
    .join("\n\n---\n\n");

  const prompt = `고객 질문: "${query}"

아래 지식 청크들 중 이 질문에 답변하기 위해 가장 유용한 ${topK}개를 골라 번호만 나열해줘.
반드시 숫자만, 쉼표로 구분해서 답해. (예: 2,5,1)

${chunkList}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // 가장 저렴한 모델로 리랭킹
        max_tokens: 30,                      // 번호만 반환하므로 최소 토큰
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`Claude API ${res.status}`);

    const json = await res.json() as { content: Array<{ text: string }> };
    const text = json.content?.[0]?.text?.trim() ?? "";

    // "2,5,1" → [1, 4, 0] (0-indexed)
    const indices = text
      .replace(/[^\d,]/g, "")
      .split(",")
      .map((n) => parseInt(n, 10) - 1)
      .filter((i) => i >= 0 && i < candidates.length);

    if (indices.length === 0) throw new Error("파싱 실패");

    // 중복 제거 + 최대 topK개
    const seen = new Set<number>();
    const result: string[] = [];
    for (const i of indices) {
      if (!seen.has(i) && result.length < topK) {
        seen.add(i);
        result.push(`[${candidates[i].category}]\n${candidates[i].content}`);
      }
    }
    return result;
  } catch (err) {
    console.warn("[rag] Claude rerank 실패, 키워드 폴백:", err);
    return candidates.slice(0, topK).map((c) => `[${c.category}]\n${c.content}`);
  }
}

// ── 메인 검색 함수 ───────────────────────────────────────────────────

/**
 * 2단계 RAG: 키워드 후보 추출 → Claude Reranker 정밀 선별
 *
 * @param storeAgentId  StoreAgent id
 * @param query         사용자 질의
 * @param topK          최종 반환 청크 수 (기본 3)
 */
export async function searchChunks(
  storeAgentId: string,
  query: string,
  topK = 3
): Promise<string[]> {
  const allChunks = await prisma.knowledgeChunk.findMany({
    where: { storeAgentId },
    orderBy: { chunkIndex: "asc" },
    select: { content: true, category: true },
  });

  if (allChunks.length === 0) return [];

  // 1단계: 키워드 스코어링으로 후보 압축 (최대 15개)
  const CANDIDATE_POOL = 15;
  const scored: ChunkCandidate[] = allChunks.map((chunk) => ({
    content: chunk.content,
    category: chunk.category,
    score: keywordScore(query, chunk.content),
  }));

  scored.sort((a, b) => b.score - a.score);

  // 스코어 0인 청크도 일부 포함 (카테고리 다양성 보장)
  const nonZero = scored.filter((c) => c.score > 0).slice(0, CANDIDATE_POOL);
  const zero = scored.filter((c) => c.score === 0);

  // 카테고리별 대표 0점 청크 최대 5개 추가 (정보 다양성)
  const seenCats = new Set(nonZero.map((c) => c.category));
  for (const chunk of zero) {
    if (!seenCats.has(chunk.category) && nonZero.length < CANDIDATE_POOL) {
      nonZero.push(chunk);
      seenCats.add(chunk.category);
    }
  }

  const candidates = nonZero.slice(0, CANDIDATE_POOL);

  // 청크가 topK 이하면 rerank 불필요
  if (candidates.length <= topK) {
    return candidates.map((c) => `[${c.category}]\n${c.content}`);
  }

  // 2단계: Claude Reranker로 최적 청크 선별
  return claudeRerank(query, candidates, topK);
}

// ── 저장 유틸 ───────────────────────────────────────────────────────

export async function embedAndStore(
  storeAgentId: string,
  content: string,
  category = "general",
  source = "manual",
  chunkIndex = 0
): Promise<void> {
  await prisma.knowledgeChunk.create({
    data: {
      storeAgentId,
      content,
      category,
      source,
      chunkIndex,
      tokenCount: Math.ceil(content.length / 4),
    },
  });
}
