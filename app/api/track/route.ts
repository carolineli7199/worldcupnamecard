import { NextRequest, NextResponse } from "next/server";

const VALID_EVENTS = new Set([
  "search_attempt",
  "search_miss",
  "premium_modal_view",
  "premium_cta_click",
  "login_gate_view",
  "login_gate_click",
]);

function redisCreds() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisPipeline(commands: (string | number)[][]) {
  const creds = redisCreds();
  if (!creds) return false;
  await fetch(`${creds.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  return true;
}

export async function POST(req: NextRequest) {
  let body: { e?: string; q?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const event = body.e ?? "";
  if (!VALID_EVENTS.has(event)) return new NextResponse(null, { status: 204 });

  const day = new Date().toISOString().slice(0, 10);
  const commands: (string | number)[][] = [
    ["HINCRBY", `events:${day}`, event, 1],
    ["HINCRBY", "events:total", event, 1],
  ];
  if (body.lang === "en" || body.lang === "zh") {
    commands.push(["HINCRBY", "events:total", `${event}:${body.lang}`, 1]);
  }
  if (event === "search_miss" && body.q) {
    const q = String(body.q).slice(0, 40).toLowerCase().trim();
    if (q) commands.push(["ZINCRBY", "missed_queries", 1, q]);
  }

  const stored = await redisPipeline(commands).catch(() => false);
  if (!stored) {
    // Redis 未配置时降级为日志，便于临时排查
    console.log("[track]", day, JSON.stringify(body));
  }
  return new NextResponse(null, { status: 204 });
}
