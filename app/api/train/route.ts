import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TEMPLATES } from "@/lib/templates";
import { buildSystemPrompt } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { templateId, name, knowledge, userId } = await req.json();

    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      return NextResponse.json({ error: "템플릿 없음" }, { status: 404 });
    }

    const systemPrompt = buildSystemPrompt(
      template.systemPromptBase,
      knowledge
    );

    // userId가 없으면 임시 게스트 유저 생성
    let user = await db.user.findUnique({ where: { id: userId || "guest" } });
    if (!user) {
      user = await db.user.create({
        data: {
          id: userId || `guest-${Date.now()}`,
          email: `guest-${Date.now()}@trainer.local`,
          name: "게스트",
        },
      });
    }

    const agent = await db.agent.create({
      data: {
        userId: user.id,
        templateId,
        name,
        knowledge,
        systemPrompt,
        accuracy: template.accuracy,
      },
    });

    await db.trainingSession.create({
      data: {
        agentId: agent.id,
        type: "initial",
        inputData: { templateId, knowledge },
        status: "completed",
        result: { systemPrompt },
        accuracy: template.accuracy,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ agent, success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "학습 실패" }, { status: 500 });
  }
}
