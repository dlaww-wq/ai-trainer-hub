import { NextRequest, NextResponse } from "next/server";
import { getAuthLogs } from "@/lib/auth-debug-log";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth-debug?token=AUTH_DEBUG_TOKEN&limit=50&level=error
 *
 * NextAuth 인메모리 로그 조회 (실시간 디버깅).
 * - 환경변수 AUTH_DEBUG_TOKEN 으로 보호 (URL 파라미터 또는 X-Debug-Token 헤더).
 * - admin 게이팅이 아닌 별도 토큰 — 로그인 자체가 안 될 때도 접근 가능.
 *
 * 응답:
 * { ok: true, count: N, instance: "...", logs: [{ ts, level, code, message, meta }, ...] }
 */
export async function GET(request: NextRequest) {
  const expected = process.env.AUTH_DEBUG_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "AUTH_DEBUG_TOKEN 환경변수가 설정되지 않았습니다." },
      { status: 503 },
    );
  }
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || request.headers.get("x-debug-token") || "";
  if (token !== expected) {
    return NextResponse.json({ ok: false, error: "invalid token" }, { status: 401 });
  }

  const limitRaw = url.searchParams.get("limit");
  const level = url.searchParams.get("level");
  const limit = Math.min(Math.max(parseInt(limitRaw || "50", 10) || 50, 1), 100);
  let logs = getAuthLogs(limit);
  if (level) logs = logs.filter((l) => l.level === level);

  return NextResponse.json({
    ok: true,
    count: logs.length,
    instance: process.env.RAILWAY_REPLICA_ID || process.env.HOSTNAME || "local",
    nextauthUrl: process.env.NEXTAUTH_URL || null,
    nextauthSecretSet: !!process.env.NEXTAUTH_SECRET,
    googleClientIdSet: !!process.env.GOOGLE_CLIENT_ID,
    googleClientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    logs,
  });
}
