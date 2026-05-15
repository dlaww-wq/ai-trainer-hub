/**
 * NextAuth 에러/이벤트를 인메모리 링 버퍼에 저장.
 * /api/auth-debug 로 토큰 인증 후 최근 로그 조회.
 *
 * 인메모리이므로 인스턴스 재시작 시 초기화됨 — 실시간 디버깅용.
 */

type LogLevel = "error" | "warn" | "debug" | "info";

export interface AuthLogEntry {
  ts: string; // ISO timestamp
  level: LogLevel;
  code?: string;
  message: string;
  meta?: Record<string, unknown>;
}

const RING_SIZE = 100;
const ring: AuthLogEntry[] = [];

function safeMeta(meta: unknown): Record<string, unknown> | undefined {
  if (!meta || typeof meta !== "object") return undefined;
  try {
    // 민감 정보 마스킹: secret/token/clientSecret 류 제외
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(meta as Record<string, unknown>)) {
      if (/secret|token|key|password/i.test(k)) {
        out[k] = "[REDACTED]";
        continue;
      }
      if (v instanceof Error) {
        out[k] = { name: v.name, message: v.message, stack: v.stack?.split("\n").slice(0, 6).join("\n") };
        continue;
      }
      try {
        JSON.stringify(v);
        out[k] = v;
      } catch {
        out[k] = String(v);
      }
    }
    return out;
  } catch {
    return undefined;
  }
}

export function pushAuthLog(entry: Omit<AuthLogEntry, "ts">): void {
  const item: AuthLogEntry = {
    ts: new Date().toISOString(),
    level: entry.level,
    code: entry.code,
    message: entry.message,
    meta: safeMeta(entry.meta),
  };
  ring.push(item);
  if (ring.length > RING_SIZE) ring.shift();
  // 서버 콘솔에도 출력 (Railway 로그 동시 보기)
  const prefix = `[auth:${entry.level}]${entry.code ? ` ${entry.code}` : ""}`;
  if (entry.level === "error") console.error(prefix, entry.message, item.meta || "");
  else if (entry.level === "warn") console.warn(prefix, entry.message, item.meta || "");
  else console.log(prefix, entry.message, item.meta || "");
}

export function getAuthLogs(limit = 50): AuthLogEntry[] {
  return ring.slice(-limit).reverse();
}
