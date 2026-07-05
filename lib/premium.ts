// 会员状态存取（Upstash Redis REST）
function redisCreds() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisCmd(command: (string | number)[]): Promise<unknown> {
  const creds = redisCreds();
  if (!creds) return null;
  const res = await fetch(`${creds.url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { result: unknown };
  return json.result;
}

export async function isPremium(email: string): Promise<boolean> {
  const v = await redisCmd(["GET", `premium:${email.toLowerCase()}`]);
  return v !== null && v !== undefined;
}

export async function grantPremium(email: string, orderId: string): Promise<void> {
  const key = `premium:${email.toLowerCase()}`;
  await redisCmd(["SET", key, orderId]);
  await redisCmd(["HINCRBY", "events:total", "premium_purchase", 1]);
  const day = new Date().toISOString().slice(0, 10);
  await redisCmd(["HINCRBY", `events:${day}`, "premium_purchase", 1]);
}
