import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { pushAuthLog } from "@/lib/auth-debug-log";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  providers: [
    // ── 구글 ──────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── 네이버 ────────────────────────────────────────────
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),

    // ── 카카오 ────────────────────────────────────────────
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as typeof session.user & { id: string }).id = token.sub;
      }
      if (token.picture && session.user) {
        session.user.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },

  // ── 디버그 로깅 ─────────────────────────────────────────
  // error/warn만 캡쳐 (verbose debug 비활성화 — production OAuth flow 보호).
  // logger 콜백 내부는 try/catch로 감싸 NextAuth 본 흐름이 절대 깨지지 않게 한다.
  logger: {
    error(code, metadata) {
      try {
        pushAuthLog({
          level: "error",
          code,
          message: metadata instanceof Error ? metadata.message : `NextAuth error: ${code}`,
          meta: metadata instanceof Error ? { error: metadata } : (metadata as Record<string, unknown>),
        });
      } catch {}
    },
    warn(code) {
      try {
        pushAuthLog({ level: "warn", code, message: `NextAuth warn: ${code}` });
      } catch {}
    },
    debug() {
      /* noop — verbose 로그 비활성화 */
    },
  },
  events: {
    async signIn(message) {
      try {
        pushAuthLog({
          level: "info",
          code: "signIn",
          message: `signIn ok provider=${message.account?.provider} email=${message.user?.email}`,
        });
      } catch {}
    },
  },
};
