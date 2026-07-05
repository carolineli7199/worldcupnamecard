import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { grantPremium } from "@/lib/premium";

// Creem webhook：签名校验后，对已完成的支付事件授予会员
export async function POST(req: NextRequest) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("creem-signature") ?? "";
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: {
    eventType?: string;
    object?: {
      id?: string;
      status?: string;
      customer?: { email?: string };
      order?: { id?: string };
      metadata?: Record<string, string>;
    };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  const type = event.eventType ?? "";
  const obj = event.object ?? {};
  const email = obj.customer?.email ?? obj.metadata?.email;

  if (type === "checkout.completed" && obj.status === "completed" && email) {
    await grantPremium(email, obj.order?.id ?? obj.id ?? "unknown");
    console.log("[creem] premium granted:", email);
  }

  return NextResponse.json({ received: true });
}
