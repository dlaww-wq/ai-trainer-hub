import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildSystemPrompt, chatWithAgent, evaluateResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { agentId, message, conversationHistory = [] } = await req.json();

    if (!agentId || !message) {
      return NextResponse.json({ error: "agentId, message 필수" }, { status: 400 });
    }

    const agent = await db.agent.findUnique({ where: { id: agentId } });
    if (!agent) return NextResponse.json({ error: "에이전트 없음" }, { status: 404 });

    const systemPrompt = buildSystemPrompt(
      agent.systemPrompt,
      agent.knowledge as Record<string, string>
    );

    const messages = [
      ...conversationHistory,
      { role: "user" as const, content: message },
    ];

    const completion = await chatWithAgent(systemPrompt, messages) as Awaited<ReturnType<typeof import("openai").default.prototype.chat.completions.create>>;
    const reply = (completion as { choices: { message: { content: string } }[] }).choices[0].message.content || "";

    // 품질 평가 (비동기, 결과 기다리지 않음)
    evaluateResponse(message, reply, agent.systemPrompt).then((score) => {
      db.agent.update({
        where: { id: agentId },
        data: { accuracy: score },
      }).catch(() => {});
    });

    // 대화 저장
    await db.conversation.create({
      data: {
        agentId,
        messages: [...messages, { role: "assistant", content: reply }],
      },
    });

    return NextResponse.json({ reply, agentId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
