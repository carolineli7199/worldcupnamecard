import { NextRequest, NextResponse } from "next/server";

function redisCreds() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisPipeline(commands: (string | number)[][]) {
  const creds = redisCreds();
  if (!creds) return null;
  const res = await fetch(`${creds.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as { result: unknown }[];
}

function toMap(arr: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (Array.isArray(arr)) {
    for (let i = 0; i < arr.length; i += 2) out[String(arr[i])] = Number(arr[i + 1]);
  }
  return out;
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.STATS_KEY || key !== process.env.STATS_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const days: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().slice(0, 10));
  }

  const commands: (string | number)[][] = [
    ["HGETALL", "events:total"],
    ["ZRANGE", "missed_queries", 0, 24, "REV", "WITHSCORES"],
    ...days.map((d) => ["HGETALL", `events:${d}`] as (string | number)[]),
  ];

  const results = await redisPipeline(commands);
  if (!results) {
    return NextResponse.json({
      error: "redis not configured",
      hint: "Set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN env vars.",
    });
  }

  const total = toMap((results[0] as { result: unknown }).result);
  const missedRaw = (results[1] as { result: unknown }).result;
  const topMissedQueries: { query: string; count: number }[] = [];
  if (Array.isArray(missedRaw)) {
    for (let i = 0; i < missedRaw.length; i += 2) {
      topMissedQueries.push({ query: String(missedRaw[i]), count: Number(missedRaw[i + 1]) });
    }
  }
  const daily: Record<string, Record<string, number>> = {};
  days.forEach((d, i) => {
    const m = toMap((results[i + 2] as { result: unknown }).result);
    if (Object.keys(m).length) daily[d] = m;
  });

  const attempts = total["search_attempt"] ?? 0;
  const miss = total["search_miss"] ?? 0;
  const modal = total["premium_modal_view"] ?? 0;
  const cta = total["premium_cta_click"] ?? 0;

  return NextResponse.json({
    funnel: {
      search_attempt: attempts,
      search_miss: miss,
      premium_modal_view: modal,
      premium_cta_click: cta,
      miss_rate: attempts ? `${((miss / attempts) * 100).toFixed(1)}%` : "n/a",
      modal_to_cta_rate: modal ? `${((cta / modal) * 100).toFixed(1)}%` : "n/a",
      miss_to_cta_rate: miss ? `${((cta / miss) * 100).toFixed(1)}%` : "n/a",
      search_to_cta_rate: attempts ? `${((cta / attempts) * 100).toFixed(1)}%` : "n/a",
    },
    loginGate: {
      gate_view: total["login_gate_view"] ?? 0,
      gate_click: total["login_gate_click"] ?? 0,
      gate_to_login_rate: (total["login_gate_view"] ?? 0)
        ? `${(((total["login_gate_click"] ?? 0) / (total["login_gate_view"] ?? 1)) * 100).toFixed(1)}%`
        : "n/a",
      premium_purchase: total["premium_purchase"] ?? 0,
    },
    byLanguage: {
      cta_en: total["premium_cta_click:en"] ?? 0,
      cta_zh: total["premium_cta_click:zh"] ?? 0,
      miss_en: total["search_miss:en"] ?? 0,
      miss_zh: total["search_miss:zh"] ?? 0,
    },
    topMissedQueries,
    daily,
    note: "Traffic (PV/UV/geo/device) lives in Vercel Web Analytics dashboard.",
  });
}
