/**
 * 미답변 감지 + 카카오 알림 + KB 자동 저장 시스템
 *
 * 흐름:
 * 1. Claude 응답에서 "모르겠습니다" 패턴 감지
 * 2. EscalationEvent DB 저장
 * 3. 사장님 카카오로 알림 전송
 * 4. 사장님 답변 → KnowledgeChunk 자동 저장
 */

import { prisma } from "@/lib/prisma";

// ── 미답변 감지 패턴 ────────────────────────────────────────────────

const UNANSWERED_PATTERNS = [
  /모르겠습니다/,
  /확인이 어렵/,
  /정확한 정보가 없/,
  /직접 문의/,
  /저도 잘 모르/,
  /안내해 드리기 어렵/,
  /학습된 정보에 없/,
  /정보를 가지고 있지 않/,
  /정보가 없어/,
  /알 수 없/,
];

export function isUnanswered(aiResponse: string): boolean {
  return UNANSWERED_PATTERNS.some((p) => p.test(aiResponse));
}

// ── 카카오 알림톡 전송 ──────────────────────────────────────────────

interface KakaoAlimtalkPayload {
  to: string;       // 수신자 전화번호
  templateCode: string;
  variables: Record<string, string>;
}

async function sendKakaoAlimtalk(payload: KakaoAlimtalkPayload): Promise<boolean> {
  const accessToken = process.env.KAKAO_CHANNEL_ACCESS_TOKEN;
  const senderKey = process.env.KAKAO_SENDER_KEY;

  if (!accessToken || !senderKey) {
    console.warn("[escalation] KAKAO_CHANNEL_ACCESS_TOKEN / KAKAO_SENDER_KEY 미설정 → 카카오 알림 스킵");
    return false;
  }

  try {
    const res = await fetch("https://kapi.kakao.com/v1/api/talk/friends/message/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        receiver_uuids: JSON.stringify([payload.to]),
        template_object: JSON.stringify({
          object_type: "text",
          text: buildKakaoMessage(payload.variables),
          link: {
            web_url: `${process.env.NEXTAUTH_URL}/dashboard/escalations`,
            mobile_web_url: `${process.env.NEXTAUTH_URL}/dashboard/escalations`,
          },
        }),
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("[escalation] 카카오 전송 실패:", err);
    return false;
  }
}

function buildKakaoMessage(vars: Record<string, string>): string {
  return `[나우링크] 챗봇 미답변 알림

📍 매장: ${vars.businessName}
❓ 고객 질문: ${vars.question}
🤖 AI 답변: ${vars.aiResponse?.slice(0, 80)}...

사장님께서 답변해 주시면 다음부터 챗봇이 자동으로 답변합니다!

👉 답변하기: ${vars.answerUrl}`;
}

// ── SMS 폴백 (솔라피 등) ────────────────────────────────────────────

async function sendSMS(phone: string, message: string): Promise<boolean> {
  const apiKey = process.env.SMS_API_KEY;
  const apiSecret = process.env.SMS_API_SECRET;
  const from = process.env.SMS_FROM_NUMBER;

  if (!apiKey || !from) {
    console.warn("[escalation] SMS API 미설정 → SMS 스킵");
    return false;
  }

  try {
    const res = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${new Date().toISOString()}, salt=${Math.random().toString(36).slice(2)}, signature=mock`,
      },
      body: JSON.stringify({
        message: { to: phone, from, text: message.slice(0, 90) },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── 에스컬레이션 저장 + 알림 ────────────────────────────────────────

export async function escalate(params: {
  storeAgentId: string;
  sessionId: string;
  customerMsg: string;
  aiResponse: string;
}): Promise<string | null> {
  const { storeAgentId, sessionId, customerMsg, aiResponse } = params;

  try {
    // 1. DB 저장
    const event = await prisma.escalationEvent.create({
      data: {
        storeAgentId,
        sessionId,
        customerMsg,
        aiResponse,
        status: "pending",
        notifyMethod: "none",
      },
    });

    // 2. 사장님 연락처 조회
    const store = await prisma.storeAgent.findUnique({
      where: { id: storeAgentId },
      select: { businessName: true, ownerPhone: true, ownerKakaoId: true },
    });

    if (!store) return event.id;

    const answerUrl = `${process.env.NEXTAUTH_URL}/api/escalate/answer?id=${event.id}`;

    // 3. 카카오 알림 (우선)
    if (store.ownerKakaoId) {
      const sent = await sendKakaoAlimtalk({
        to: store.ownerKakaoId,
        templateCode: "unanswered_v1",
        variables: {
          businessName: store.businessName,
          question: customerMsg,
          aiResponse,
          answerUrl,
        },
      });

      if (sent) {
        await prisma.escalationEvent.update({
          where: { id: event.id },
          data: { status: "notified", notifyMethod: "kakao" },
        });
        return event.id;
      }
    }

    // 4. SMS 폴백
    if (store.ownerPhone) {
      const msg = `[나우링크] 고객질문: "${customerMsg.slice(0, 30)}..." 답변 필요 → ${answerUrl}`;
      const sent = await sendSMS(store.ownerPhone, msg);

      if (sent) {
        await prisma.escalationEvent.update({
          where: { id: event.id },
          data: { status: "notified", notifyMethod: "sms" },
        });
      }
    }

    return event.id;
  } catch (err) {
    console.error("[escalation] DB 저장 실패:", err);
    return null;
  }
}

// ── 사장님 답변 → KnowledgeChunk 저장 ──────────────────────────────

export async function saveOwnerAnswer(params: {
  escalationId: string;
  answer: string;
}): Promise<boolean> {
  const { escalationId, answer } = params;

  try {
    const event = await prisma.escalationEvent.findUnique({
      where: { id: escalationId },
      include: { storeAgent: true },
    });

    if (!event) return false;

    // 기존 청크 수 조회
    const chunkCount = await prisma.knowledgeChunk.count({
      where: { storeAgentId: event.storeAgentId },
    });

    // 새 FAQ 청크 생성
    const content = `Q: ${event.customerMsg}\nA: ${answer}`;
    await prisma.knowledgeChunk.create({
      data: {
        storeAgentId: event.storeAgentId,
        content,
        category: "faq",
        source: "owner_answer",
        chunkIndex: chunkCount,
        tokenCount: Math.ceil(content.length / 4),
      },
    });

    // 에스컬레이션 완료 처리
    await prisma.escalationEvent.update({
      where: { id: escalationId },
      data: {
        ownerAnswer: answer,
        savedToKb: true,
        status: "resolved",
        resolvedAt: new Date(),
      },
    });

    return true;
  } catch (err) {
    console.error("[escalation] 답변 저장 실패:", err);
    return false;
  }
}

// ── 미처리 에스컬레이션 목록 ────────────────────────────────────────

export async function getPendingEscalations(storeAgentId: string) {
  return prisma.escalationEvent.findMany({
    where: { storeAgentId, status: { in: ["pending", "notified"] } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
