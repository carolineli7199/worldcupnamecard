import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";

// 邮箱魔法链接登录需要 Resend key + Redis 存验证令牌；未配置时仅 Google
const emailEnabled = !!process.env.AUTH_RESEND_KEY;

const redis =
  emailEnabled && (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN!,
      })
    : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    ...(emailEnabled
      ? [Resend({ from: process.env.AUTH_EMAIL_FROM ?? "login@wc26cards.fyi" })]
      : []),
  ],
  ...(redis ? { adapter: UpstashRedisAdapter(redis) } : {}),
  session: { strategy: "jwt" },
  trustHost: true,
});

export const isEmailLoginEnabled = emailEnabled;
