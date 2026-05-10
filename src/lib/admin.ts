/**
 * 관리자 권한 체크 헬퍼.
 *
 * 환경변수 `ADMIN_EMAILS` 에 콤마로 구분된 이메일 목록을 둔다.
 * 예: ADMIN_EMAILS=dlaww584@gmail.com,other@example.com
 *
 * 비관리자가 /contents 같은 보호된 라우트에 접근하면 layout.tsx 에서 notFound() 호출.
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdmin(email: string | null | undefined): boolean {
  // 개발 모드 한정 바이패스 — production 빌드에서는 절대 동작하지 않음.
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DEV_ADMIN_BYPASS === "1"
  ) {
    return true;
  }
  if (!email) return false;
  const list = getAdminEmails();
  return list.includes(email.toLowerCase());
}
