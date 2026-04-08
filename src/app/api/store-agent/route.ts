import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/store-agent — 새 매장 에이전트 생성
 * GET  /api/store-agent?slug=xxx — 슬러그로 조회
 * GET  /api/store-agent?userId=xxx — 유저 전체 조회
 * PATCH /api/store-agent — 시스템 프롬프트 업데이트
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      businessName,
      businessType = "general",
      systemPrompt = "",
      userId = "demo-user",
    } = body as {
      slug: string;
      businessName: string;
      businessType?: string;
      systemPrompt?: string;
      userId?: string;
    };

    if (!slug || !businessName) {
      return NextResponse.json(
        { error: "slug 와 businessName 이 필요합니다." },
        { status: 400 }
      );
    }

    // slug 중복 체크
    const existing = await prisma.storeAgent.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "이미 사용 중인 슬러그입니다.", existing },
        { status: 409 }
      );
    }

    // 데모 유저 없으면 생성
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId, name: "데모 사용자", email: "demo@aitrainerhub.com" },
      });
    }

    const agent = await prisma.storeAgent.create({
      data: { slug, businessName, businessType, systemPrompt, userId },
    });

    return NextResponse.json({
      ok: true,
      agent,
      chatUrl: `/store/${slug}`,
    });
  } catch (error) {
    console.error("[store-agent POST] 오류:", error);
    return NextResponse.json(
      { error: "에이전트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const userId = request.nextUrl.searchParams.get("userId");

  try {
    if (slug) {
      const agent = await prisma.storeAgent.findUnique({
        where: { slug },
        include: {
          chunks: { orderBy: [{ category: "asc" }, { chunkIndex: "asc" }] },
          _count: { select: { convos: true } },
        },
      });

      if (!agent) {
        return NextResponse.json({ error: "에이전트를 찾을 수 없습니다." }, { status: 404 });
      }

      return NextResponse.json({ agent });
    }

    if (userId) {
      const agents = await prisma.storeAgent.findMany({
        where: { userId },
        include: { _count: { select: { chunks: true, convos: true } } },
        orderBy: { updatedAt: "desc" },
      });

      return NextResponse.json({ agents });
    }

    return NextResponse.json({ error: "slug 또는 userId 파라미터가 필요합니다." }, { status: 400 });
  } catch {
    return NextResponse.json({ agents: [], mode: "mock" });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, systemPrompt, status } = body as {
      slug: string;
      systemPrompt?: string;
      status?: string;
    };

    if (!slug) {
      return NextResponse.json({ error: "slug 가 필요합니다." }, { status: 400 });
    }

    const data: Record<string, string> = {};
    if (systemPrompt !== undefined) data.systemPrompt = systemPrompt;
    if (status !== undefined) data.status = status;

    const agent = await prisma.storeAgent.update({
      where: { slug },
      data,
    });

    return NextResponse.json({ ok: true, agent });
  } catch (error) {
    console.error("[store-agent PATCH] 오류:", error);
    return NextResponse.json(
      { error: "업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
