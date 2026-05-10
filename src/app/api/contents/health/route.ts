import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import path from "node:path";
import fs from "node:fs";

/**
 * GET /api/contents/health
 * - 관리자 세션 검증
 * - v3 엔진 파일 존재 여부 확인
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const enginePath = path.resolve(
    process.cwd(),
    process.env.CONTENTS_ENGINE_PATH || "scripts/contents/ai_keyword_engine_v3.py",
  );
  const engineExists = fs.existsSync(enginePath);
  return NextResponse.json({ ok: true, engine: engineExists, enginePath });
}
