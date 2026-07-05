import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// 登录用户学习进度云同步：progress:{email} = { team, player, viewed }
function redisCreds() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisCmd(command: (string | number)[]): Promise<unknown> {
  const creds = redisCreds();
  if (!creds) return null;
  const res = await fetch(creds.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return ((await res.json()) as { result: unknown }).result;
}

interface Progress {
  team: string[];
  player: string[];
  viewed: number;
}

function sanitize(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.filter((x) => typeof x === "string" && x.length < 80))].slice(0, 2000);
}

async function readProgress(email: string): Promise<Progress> {
  const raw = (await redisCmd(["HGETALL", `progress:${email.toLowerCase()}`])) as
    | unknown[]
    | null;
  const map: Record<string, string> = {};
  if (Array.isArray(raw)) {
    for (let i = 0; i < raw.length; i += 2) map[String(raw[i])] = String(raw[i + 1]);
  }
  return {
    team: sanitize(JSON.parse(map.team ?? "[]")),
    player: sanitize(JSON.parse(map.player ?? "[]")),
    viewed: Number(map.viewed ?? 0) || 0,
  };
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await readProgress(email));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Partial<Progress>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  // 与云端取并集，避免多设备互相覆盖
  const current = await readProgress(email);
  const merged: Progress = {
    team: sanitize([...current.team, ...(body.team ?? [])]),
    player: sanitize([...current.player, ...(body.player ?? [])]),
    viewed: Math.max(current.viewed, Number(body.viewed ?? 0) || 0),
  };

  await redisCmd([
    "HSET",
    `progress:${email.toLowerCase()}`,
    "team", JSON.stringify(merged.team),
    "player", JSON.stringify(merged.player),
    "viewed", merged.viewed,
  ]);
  return NextResponse.json(merged);
}
