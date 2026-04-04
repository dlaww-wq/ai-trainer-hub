import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildSystemPrompt, evaluateResponse } from "@/lib/ai";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, agentId } = await req.json();

    if (!agentId || !messages) {
      return NextResponse.json({ error: "agentId, messages 필수" }, { status: 400 });
    }

    const agent = await db.agent.findUnique({ where: { id: agentId } });
    if (!agent) return NextResponse.json({ error: "에이전트 없음" }, { status: 404 });

    const systemMessage = buildSystemPrompt(
      agent.systemPrompt,
      agent.knowledge as Record<string, string>
    );

    const userMessage = messages[messages.length - 1].content;

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemMessage,
      messages: messages,
      async onFinish({ text }) {
        // Async Evaluation & Scoring
        evaluateResponse(userMessage, text, agent.systemPrompt).then((score) => {
          db.agent.update({
            where: { id: agentId },
            data: { accuracy: score },
          }).catch(() => {});
        });

        // Save conversation history to DB
        await db.conversation.create({
          data: {
            agentId,
            messages: [...messages, { role: "assistant", content: text }],
          },
        });
      },
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
