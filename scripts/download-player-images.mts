/**
 * 将 data/player-images.json 中的远程图片下载到 public/players/，
 * 压缩为 640px WebP，并生成 data/player-photos.json（id → 本地路径）。
 * 用法: npx tsx scripts/download-player-images.mts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const remote: Record<string, string> = JSON.parse(
  readFileSync(new URL("../data/player-images.json", import.meta.url), "utf8")
);
const outDir = fileURLToPath(new URL("../public/players", import.meta.url));
mkdirSync(outDir, { recursive: true });

function slugify(id: string): string {
  return id
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Wikimedia 已禁止直接下载 commons 原图（429），必须走缩略图 URL
function toThumbUrl(url: string): string {
  const m = url.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/[^/]+)\/([0-9a-f])\/([0-9a-f]{2})\/([^/]+\.(?:jpe?g|png|gif))$/i
  );
  if (!m) return url; // 已是 /thumb/ 链接或其他来源
  // 宽度必须在 Wikimedia 白名单内（250/330/500…），500 是可用的最大档
  return `${m[1]}/thumb/${m[2]}/${m[3]}/${m[4]}/500px-${m[4]}`;
}

const local: Record<string, string> = {};
let done = 0;
let failed = 0;

for (const [id, url] of Object.entries(remote)) {
  const slug = slugify(id);
  const file = `${outDir}/${slug}.webp`;
  const publicPath = `/players/${slug}.webp`;
  if (existsSync(file)) {
    local[id] = publicPath;
    continue;
  }
  try {
    let res: Response | null = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      res = await fetch(toThumbUrl(url), {
        headers: { "User-Agent": "wc26-flashcards/1.0 (personal study site)" },
      });
      if (res.status !== 429 && res.status < 500) break;
      await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
    }
    if (!res || !res.ok) throw new Error(`HTTP ${res?.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(file);
    local[id] = publicPath;
    done++;
    console.log(`✓ ${id}`);
  } catch (e) {
    failed++;
    console.log(`✗ ${id}: ${(e as Error).message}`);
  }
  await new Promise((r) => setTimeout(r, 700));
}

writeFileSync(
  new URL("../data/player-photos.json", import.meta.url),
  JSON.stringify(local, null, 2)
);
console.log(`\nDone: ${done} downloaded, ${failed} failed, ${Object.keys(local).length} total local`);
