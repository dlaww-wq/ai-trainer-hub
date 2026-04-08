import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/learn/text
 * 텍스트 데이터를 청크로 분할 → KnowledgeChunk DB 저장
 *
 * Body:
 *   storeAgentId: string
 *   text: string          (원본 텍스트)
 *   category?: string     (menu | hours | faq | policy | general)
 *   source?: string       (manual | file | url)
 *   userId?: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      storeAgentId,
      text,
      category = "general",
      source = "manual",
      userId = "demo-user",
    } = body as {
      storeAgentId: string;
      text: string;
      category?: string;
      source?: string;
      userId?: string;
    };

    if (!storeAgentId || !text?.trim()) {
      return NextResponse.json(
        { error: "storeAgentId 와 text 가 필요합니다." },
        { status: 400 }
      );
    }

    // DB 없을 때 graceful fallback
    let agent;
    try {
      agent = await prisma.storeAgent.findUnique({
        where: { id: storeAgentId },
      });
    } catch {
      // DB 연결 없음 → in-memory mock 반환
      const chunks = chunkText(text);
      return NextResponse.json({
        ok: true,
        mode: "mock",
        chunksCreated: chunks.length,
        preview: chunks[0]?.slice(0, 80),
      });
    }

    if (!agent) {
      return NextResponse.json(
        { error: "StoreAgent 를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 텍스트 청킹 (500자 단위, 50자 오버랩)
    const chunks = chunkText(text);

    // 기존 해당 카테고리 청크 삭제 후 재저장 (업데이트 시)
    await prisma.knowledgeChunk.deleteMany({
      where: { storeAgentId, category, source },
    });

    const created = await prisma.knowledgeChunk.createMany({
      data: chunks.map((content, idx) => ({
        storeAgentId,
        content,
        category,
        source,
        chunkIndex: idx,
        tokenCount: Math.ceil(content.length / 4), // 한국어 기준 대략적 토큰 수
      })),
    });

    // 토큰 사용량 기록
    const totalTokens = chunks.reduce(
      (sum, c) => sum + Math.ceil(c.length / 4),
      0
    );
    try {
      await prisma.tokenUsage.create({
        data: {
          userId,
          feature: "learn",
          model: "text-processing",
          inputTokens: totalTokens,
          outputTokens: 0,
          cost: 0,
        },
      });
    } catch {
      // 토큰 기록 실패는 무시
    }

    return NextResponse.json({
      ok: true,
      chunksCreated: created.count,
      totalTokens,
      categories: [category],
      preview: chunks[0]?.slice(0, 80),
    });
  } catch (error) {
    console.error("[learn/text] 오류:", error);
    return NextResponse.json(
      { error: "텍스트 학습 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/learn/text?storeAgentId=xxx
 * 저장된 청크 목록 조회
 */
export async function GET(request: NextRequest) {
  const storeAgentId = request.nextUrl.searchParams.get("storeAgentId");
  const category = request.nextUrl.searchParams.get("category");

  if (!storeAgentId) {
    return NextResponse.json(
      { error: "storeAgentId 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const where: Record<string, string> = { storeAgentId };
    if (category) where.category = category;

    const chunks = await prisma.knowledgeChunk.findMany({
      where,
      orderBy: [{ category: "asc" }, { chunkIndex: "asc" }],
    });

    const summary = chunks.reduce(
      (acc: Record<string, number>, c: { category: string }) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({ chunks, summary, total: chunks.length });
  } catch {
    return NextResponse.json(
      { chunks: [], summary: {}, total: 0, mode: "mock" }
    );
  }
}

// ─── 텍스트 청킹 유틸 ──────────────────────────────────────

function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (normalized.length <= chunkSize) {
    return [normalized];
  }

  const chunks: string[] = [];

  // 문단 기준으로 먼저 분할
  const paragraphs = normalized.split(/\n\n+/);
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length <= chunkSize) {
      current = current ? current + "\n\n" + para : para;
    } else {
      if (current) {
        chunks.push(current.trim());
      }
      // 단일 문단이 chunkSize 초과 시 강제 분할
      if (para.length > chunkSize) {
        const subChunks = forceChunk(para, chunkSize, overlap);
        chunks.push(...subChunks.slice(0, -1));
        current = subChunks[subChunks.length - 1] || "";
      } else {
        current = para;
      }
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.filter((c) => c.length > 10);
}

function forceChunk(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }
  return chunks;
}
