import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { spawn } from "node:child_process";
import path from "node:path";

export const dynamic = "force-dynamic";
export const maxDuration = 200; // seconds — 엔진은 보통 30s 내 완료

/**
 * GET /api/contents/run
 * - 관리자 전용
 * - Python 서브프로세스로 ai_keyword_engine_v3.py 실행
 * - YouTube/Google CX API 키는 .env.local 에서 주입
 * - 표준 출력 마지막 8KB 를 클라이언트로 반환 (UI 로그 박스에 표시)
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
  const python = process.env.CONTENTS_PYTHON_BIN || "python3";

  return await new Promise<NextResponse>((resolve) => {
    const child = spawn(python, [enginePath], {
      env: {
        ...process.env,
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY ?? "",
        GOOGLE_CX: process.env.GOOGLE_CX ?? "",
        PYTHONIOENCODING: "utf-8",
      },
    });

    let out = "";
    let err = "";
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolve(
        NextResponse.json({ ok: false, error: "timeout", log: out.slice(-8000) }, { status: 504 }),
      );
    }, 180_000);

    child.stdout.on("data", (chunk) => {
      out += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      err += chunk.toString("utf8");
    });

    child.on("error", (e) => {
      clearTimeout(timeout);
      resolve(
        NextResponse.json({ ok: false, error: `spawn: ${e.message}` }, { status: 500 }),
      );
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      const log = (out + (err ? `\n[stderr]\n${err}` : "")).slice(-8000);
      if (code === 0) {
        resolve(NextResponse.json({ ok: true, log }));
      } else {
        resolve(NextResponse.json({ ok: false, error: `exit ${code}`, log }, { status: 500 }));
      }
    });
  });
}
