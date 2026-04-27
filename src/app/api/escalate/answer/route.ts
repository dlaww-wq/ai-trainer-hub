/**
 * GET  /api/escalate/answer?id=XXX       — 사장님 답변 페이지 (간단 HTML)
 * POST /api/escalate/answer              — { id, answer } → KB 저장
 */

import { NextRequest, NextResponse } from "next/server";
import { saveOwnerAnswer } from "@/lib/escalation";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return new Response("잘못된 링크입니다.", { status: 400 });

  const event = await prisma.escalationEvent.findUnique({
    where: { id },
    include: { storeAgent: { select: { businessName: true } } },
  }).catch(() => null);

  if (!event) return new Response("이미 처리됐거나 존재하지 않는 요청입니다.", { status: 404 });

  const isResolved = event.status === "resolved";

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>챗봇 답변 등록 | 나우링크</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #f5f5f5; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 16px; padding: 28px; max-width: 480px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .logo { color: #6366f1; font-weight: 700; font-size: 18px; margin-bottom: 20px; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; padding: 3px 10px; border-radius: 999px; margin-bottom: 12px; }
    .badge.resolved { background: #d1fae5; color: #065f46; }
    .store-name { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 20px; }
    .section { background: #f8f8f8; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
    .label { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .question { font-size: 15px; color: #222; line-height: 1.5; }
    .ai-response { font-size: 13px; color: #666; line-height: 1.5; }
    textarea { width: 100%; border: 2px solid #e5e7eb; border-radius: 10px; padding: 12px; font-size: 15px; font-family: inherit; resize: vertical; min-height: 120px; outline: none; transition: border 0.2s; }
    textarea:focus { border-color: #6366f1; }
    button { width: 100%; background: #6366f1; color: white; border: none; border-radius: 10px; padding: 14px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 12px; transition: background 0.2s; }
    button:hover { background: #4f46e5; }
    button:disabled { background: #a5b4fc; cursor: not-allowed; }
    .success { background: #d1fae5; color: #065f46; border-radius: 10px; padding: 14px; text-align: center; font-weight: 600; margin-top: 12px; }
    .info { font-size: 13px; color: #888; text-align: center; margin-top: 12px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">나우링크</div>
    <div class="badge ${isResolved ? "resolved" : ""}">
      ${isResolved ? "✅ 처리 완료" : "⏳ 답변 대기"}
    </div>
    <div class="store-name">${event.storeAgent?.businessName ?? "매장"} 챗봇</div>

    <div class="section">
      <div class="label">고객 질문</div>
      <div class="question">${event.customerMsg}</div>
    </div>

    <div class="section">
      <div class="label">챗봇 응답 (미답변)</div>
      <div class="ai-response">${event.aiResponse?.slice(0, 120)}...</div>
    </div>

    ${isResolved
      ? `<div class="success">✅ 등록된 답변<br><br><em>${event.ownerAnswer}</em><br><br>챗봇에 저장됐습니다!</div>`
      : `<div>
          <div class="label" style="margin-bottom:8px">사장님 답변 입력</div>
          <textarea id="answer" placeholder="고객 질문에 대한 정확한 답변을 입력해주세요.
예) 영업시간은 평일 09:00~22:00, 주말 10:00~21:00입니다."></textarea>
          <button id="btn" onclick="submit()">💾 저장하고 챗봇에 학습시키기</button>
          <div id="msg"></div>
          <p class="info">입력한 답변은 즉시 챗봇 지식베이스에 저장되어<br>다음 동일 질문부터 자동으로 답변됩니다.</p>
        </div>`
    }
  </div>

  <script>
    async function submit() {
      const answer = document.getElementById('answer').value.trim();
      if (!answer) { alert('답변을 입력해주세요.'); return; }

      const btn = document.getElementById('btn');
      btn.disabled = true;
      btn.textContent = '저장 중...';

      try {
        const res = await fetch('/api/escalate/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: '${id}', answer }),
        });

        if (res.ok) {
          document.getElementById('msg').innerHTML = '<div class="success" style="margin-top:12px">✅ 저장 완료! 챗봇이 학습했습니다 🎉</div>';
          btn.style.display = 'none';
        } else {
          btn.disabled = false;
          btn.textContent = '💾 저장하고 챗봇에 학습시키기';
          alert('저장 실패. 다시 시도해주세요.');
        }
      } catch {
        btn.disabled = false;
        btn.textContent = '💾 저장하고 챗봇에 학습시키기';
        alert('네트워크 오류가 발생했습니다.');
      }
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { id, answer } = await request.json() as { id: string; answer: string };

    if (!id || !answer?.trim()) {
      return NextResponse.json({ error: "id와 answer가 필요합니다." }, { status: 400 });
    }

    const saved = await saveOwnerAnswer({ escalationId: id, answer: answer.trim() });

    if (!saved) {
      return NextResponse.json({ error: "저장 실패" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "KB에 저장 완료" });
  } catch (err) {
    console.error("[escalate/answer POST]", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
