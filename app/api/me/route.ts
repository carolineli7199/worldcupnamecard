import { NextResponse } from "next/server";
import { auth, isEmailLoginEnabled } from "@/lib/auth";
import { isPremium } from "@/lib/premium";

export async function GET() {
  // Google OAuth 未配置时优雅降级
  if (!process.env.AUTH_GOOGLE_ID) {
    return NextResponse.json({
      user: null, premium: false, authEnabled: false, emailEnabled: false,
    });
  }
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({
      user: null, premium: false, authEnabled: true, emailEnabled: isEmailLoginEnabled,
    });
  }
  const premium = await isPremium(email);
  return NextResponse.json({
    user: {
      name: session.user?.name ?? "",
      email,
      image: session.user?.image ?? "",
    },
    premium,
    authEnabled: true,
    emailEnabled: isEmailLoginEnabled,
  });
}
