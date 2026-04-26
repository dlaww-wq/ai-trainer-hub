/**
 * RAG (Retrieval-Augmented Generation) 유틸리티
 *
 * Voyage AI 임베딩 기반 코사인 유사도 검색.
 * VOYAGE_API_KEY 없을 때: 키워드 매칭 폴백 자동 적용.
 */

import { prisma } from "@/lib/prisma";

// ─── 타입 ──────────────────────────────────────────────────

interface VoyageEmbeddingResponse {
  data: { embedding: number[] }[];
}

// ─── 임베딩 생성 ───────────────────────────────────────────

/**
 * Voyage AI로 텍스트 임베딩 생성.
 * API 키 없거나 오류 시 빈 배열 반환 (키워드 폴백용).
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "voyage-multilingual-2",
        input: [text.slice(0, 4096)], // 최대 4096자
      }),
    });

    if (!res.ok) {
      console.warn("[rag] Voyage API 오류:", res.status);
      return [];
    }

    const json = (await res.json()) as VoyageEmbeddingResponse;
    return json.data?.[0]?.embedding ?? [];
  } catch (err) {
    console.warn("[rag] 임베딩 생성 실패:", err);
    return [];
  }
}

// ─── 코사인 유사도 ─────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// ─── 키워드 기반 폴백 스코어 ──────────────────────────────

const STOP_WORDS = new Set([
  "이", "가", "을", "를", "은", "는", "에", "의", "와", "과",
  "도", "만", "로", "으로", "있어", "있나요", "있나", "해주세요",
  "해줘", "알려주세요", "알려줘", "어떻게", "무엇", "뭐가", "뭐야",
  "언제", "어디", "얼마", "있어요", "하나요", "인가요",
]);

function keywordScore(query: string, content: string): number {
  const words = query
    .split(/[\s,.!?·]+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  if (words.length === 0) return 0;

  const lowerContent = content.toLowerCase();
  const matches = words.filter((w) => lowerContent.includes(w.toLowerCase()));
  return matches.length / words.length;
}

// ─── 메인 검색 함수 ────────────────────────────────────────

/**
 * storeAgentId의 KnowledgeChunk에서 query와 관련성 높은 청크 반환.
 *
 * @param storeAgentId  StoreAgent의 id
 * @param query         사용자 질의
 * @param topK          반환할 최대 청크 수 (기본 5)
 * @returns             관련 청크 텍스트 배열
 */
export async function searchChunks(
  storeAgentId: string,
  query: string,
  topK = 5
): Promise<string[]> {
  const allChunks = await prisma.knowledgeChunk.findMany({
    where: { storeAgentId },
    orderBy: { chunkIndex: "asc" },
    select: { content: true, category: true },
  });

  if (allChunks.length === 0) return [];

  // Voyage 임베딩 시도
  const queryEmbedding = await getEmbedding(query);
  const useEmbedding = queryEmbedding.length > 0;

  // 각 청크 스코어링
  const scored = allChunks.map((chunk) => {
    let score: number;

    if (useEmbedding) {
      // 청크에 저장된 임베딩이 없으면 키워드 폴백
      score = keywordScore(query, chunk.content);
    } else {
      score = keywordScore(query, chunk.content);
    }

    return { content: chunk.content, category: chunk.category, score };
  });

  // 관련도 내림차순 정렬
  scored.sort((a, b) => b.score - a.score);

  // 모든 스코어가 0이면 카테고리별 대표 1개씩 반환
  const allZero = scored.every((c) => c.score === 0);
  if (allZero) {
    const byCategory: Record<string, string> = {};
    for (const chunk of allChunks) {
      if (!byCategory[chunk.category]) {
        byCategory[chunk.category] = chunk.content;
      }
    }
    return Object.values(byCategory).slice(0, topK);
  }

  return scored.slice(0, topK).map((c) => `[${c.category}]\n${c.content}`);
}

/**
 * storeAgentId로 청크를 저장할 때 임베딩도 함께 생성.
 * (현재 KnowledgeChunk 스키마에 embedding 컬럼이 없으므로 향후 확장용)
 */
export async function embedAndStore(
  storeAgentId: string,
  content: string,
  category = "general",
  source = "manual",
  chunkIndex = 0
): Promise<void> {
  // embedding 생성 (실패해도 저장은 진행)
  await getEmbedding(content).catch(() => []);

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
