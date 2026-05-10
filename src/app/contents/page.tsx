/**
 * /contents — 관리자 전용 콘텐츠 파이프라인.
 *
 * 메인: 키워드 파이프라인 SPA (iframe)
 * 서브: 우상단 [⚙] 버튼 → 시스템 정보 패널 (서버 구성·env·API·파일 경로 한눈에)
 */
import path from "node:path";
import fs from "node:fs";
import { getAdminEmails } from "@/lib/admin";
import SystemInfoPanel, { type SystemInfo } from "./SystemInfoPanel";

export const dynamic = "force-dynamic";

export default function ContentsPage() {
  const enginePath = path.resolve(
    process.cwd(),
    process.env.CONTENTS_ENGINE_PATH || "scripts/contents/ai_keyword_engine_v3.py",
  );
  const engineExists = fs.existsSync(enginePath);

  const envKeys = [
    "ADMIN_EMAILS",
    "YOUTUBE_API_KEY",
    "GOOGLE_CX",
    "CONTENTS_ENGINE_PATH",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "DATABASE_URL",
    "ANTHROPIC_API_KEY",
  ];
  const envPresence: Record<string, boolean> = {};
  for (const k of envKeys) envPresence[k] = !!process.env[k];

  const info: SystemInfo = {
    buildTime: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || "unknown",
    pageUrl: "/contents",
    iframeSrc: "/contents-app/index.html",
    enginePath,
    engineExists,
    envPresence,
    adminEmails: getAdminEmails(),
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/contents/health",
        desc: "관리자 + 엔진 파일 존재 여부 — 200 정상 / 403 비관리자",
      },
      {
        method: "GET",
        path: "/api/contents/run",
        desc: "Python 엔진 실행 (YouTube API 호출) — 30s 내 응답, 180s 타임아웃",
      },
    ],
    filePaths: [
      {
        label: "권한 게이팅",
        path: "src/app/contents/layout.tsx",
        desc: "비관리자 접근 시 404 응답 (notFound)",
      },
      {
        label: "관리자 헬퍼",
        path: "src/lib/admin.ts",
        desc: "isAdmin(email) — ADMIN_EMAILS env 화이트리스트 매칭",
      },
      {
        label: "메인 페이지",
        path: "src/app/contents/page.tsx",
        desc: "iframe 마운트 + 시스템 정보 패널 통합",
      },
      {
        label: "정보 패널 UI",
        path: "src/app/contents/SystemInfoPanel.tsx",
        desc: "우상단 ⚙ 토글 사이드바 (이 패널)",
      },
      {
        label: "API health",
        path: "src/app/api/contents/health/route.ts",
        desc: "관리자 + 엔진 존재 체크",
      },
      {
        label: "API run",
        path: "src/app/api/contents/run/route.ts",
        desc: "Python 서브프로세스 spawn",
      },
      {
        label: "파이프라인 SPA",
        path: "public/contents-app/index.html",
        desc: "기존 keyword-pipeline 그대로 (vanilla JS · 카피 작업장 · 본문 워크벤치 · Gemini 프롬프트 빌더)",
      },
      {
        label: "v3 엔진",
        path: "scripts/contents/ai_keyword_engine_v3.py",
        desc: "YouTube Data API + Google CSE + 자동완성 — Python 표준 라이브러리만",
      },
      {
        label: "Dockerfile",
        path: "Dockerfile",
        desc: "alpine + python3 + scripts/ COPY (Railway 빌드)",
      },
    ],
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      <iframe
        src="/contents-app/index.html"
        title="Contents Pipeline"
        className="h-full w-full border-0"
      />
      <SystemInfoPanel info={info} />
    </main>
  );
}
