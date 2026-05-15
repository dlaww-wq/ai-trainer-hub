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
  // NextAuth 내부 에러/경고/디버그를 인메모리 링 버퍼에 캡쳐.
  // /api/auth-debug?token=AUTH_DEBUG_TOKEN 으로 실시간 조회.
  debug: true,
  logger: {
    error(code, metadata) {
      pushAuthLog({
        level: "error",
        code,
        message: metadata instanceof Error ? metadata.message : `NextAuth error: ${code}`,
        meta: metadata instanceof Error ? { error: metadata } : (metadata as Record<string, unknown>),
      });
    },
    warn(code) {
      pushAuthLog({ level: "warn", code, message: `NextAuth warn: ${code}` });
    },
    debug(code, metadata) {
      pushAuthLog({
        level: "debug",
        code,
        message: `NextAuth debug: ${code}`,
        meta: (metadata as Record<string, unknown>) || undefined,
      });
    },
  },
  events: {
    async signIn(message) {
      pushAuthLog({
        level: "info",
        code: "signIn",
        message: `signIn ok provider=${message.account?.provider} email=${message.user?.email}`,
        meta: { isNewUser: message.isNewUser, provider: message.account?.provider },
      });
    },
    async signOut() {
      pushAuthLog({ level: "info", code: "signOut", message: "signOut" });
    },
    async createUser(message) {
      pushAuthLog({
        level: "info",
        code: "createUser",
        message: `createUser email=${message.user?.email}`,
      });
    },
    async linkAccount(message) {
      pushAuthLog({
        level: "info",
        code: "linkAccount",
        message: `linkAccount provider=${message.account?.provider} email=${message.user?.email}`,
      });
    },
  },
};
