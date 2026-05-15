import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

/**
 * /contents 와 그 하위 라우트는 관리자 전용.
 * - 비로그인 / 비관리자 모두 안내 페이지 표시 (server-side redirect ❌ — OAuth callback 흐름과 충돌 방지)
 * - 로그인 버튼은 클라이언트가 클릭해 직접 /api/auth/signin 으로 이동
 */
export default async function ContentsLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email || !isAdmin(email)) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#06060c", color: "#e6e6f0", fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <div style={{ maxWidth: 520, background: "#0e0e18", border: "1px solid #2a2a3a", borderRadius: 12, padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>관리자 전용 페이지</h1>
          <p style={{ fontSize: 13, color: "#9a9ab0", lineHeight: 1.6, marginBottom: 16 }}>
            {email ? (
              <>
                현재 로그인 계정 <code style={{ background: "#1a1a28", padding: "2px 6px", borderRadius: 4, color: "#FFD93D" }}>{email}</code>은 접근 권한이 없습니다.
                <br />Railway <code>ADMIN_EMAILS</code> 환경변수에 이 이메일을 추가하세요.
              </>
            ) : (
              <>로그인이 필요합니다.</>
            )}
          </p>
          <a href={email ? "/" : "/api/auth/signin?callbackUrl=%2Fcontents"} style={{ display: "inline-block", padding: "10px 18px", background: "#6C63FF", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            {email ? "← 홈으로" : "🔑 로그인하기"}
          </a>
        </div>
      </main>
    );
  }
  return <>{children}</>;
}

// 검색엔진/사이트맵 노출 차단
export const metadata = {
  title: "Contents Pipeline · NowLink",
  robots: { index: false, follow: false },
};
