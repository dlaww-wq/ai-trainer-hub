import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** 지식 데이터를 시스템 프롬프트에 주입 */
export function buildSystemPrompt(
  basePrompt: string,
  knowledge: Record<string, string>
): string {
  let prompt = basePrompt;
  for (const [key, value] of Object.entries(knowledge)) {
    prompt = prompt.replace(`{${key}}`, value || "(미입력)");
  }
  return prompt;
}

/** 에이전트 채팅 */
export async function chatWithAgent(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  stream = false
) {
  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    temperature: 0.7,
    stream,
  });
}

/** 응답 품질 평가 (0-100) */
export async function evaluateResponse(
  question: string,
  answer: string,
  context: string
): Promise<number> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a quality evaluator. Rate the AI response from 0-100 based on relevance, accuracy, and helpfulness. Return only a number.",
      },
      {
        role: "user",
        content: `Context: ${context}\nQuestion: ${question}\nAnswer: ${answer}`,
      },
    ],
    temperature: 0,
  });
  const score = parseInt(res.choices[0].message.content || "70");
  return isNaN(score) ? 70 : Math.min(100, Math.max(0, score));
}
