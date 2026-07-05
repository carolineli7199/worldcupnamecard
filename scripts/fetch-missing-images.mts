/**
 * 对 player-photos.json 中缺失的球员，走 Wikidata P18（人物图片）兜底：
 * en.wiki 标题 → wikibase id → P18 文件名 → Commons 缩略图 → 本地 WebP
 * 用法: npx tsx scripts/fetch-missing-images.mts
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { allTeams } from "../data/index";
import { anglicize } from "../lib/i18n";

const UA = "wc26-flashcards/1.0 (personal study site)";
const photosPath = new URL("../data/player-photos.json", import.meta.url);
const outDir = fileURLToPath(new URL("../public/players", import.meta.url));
const local: Record<string, string> = JSON.parse(readFileSync(photosPath, "utf8"));

// 标题修正（与 fetch-player-images.mts 保持一致）
const titleOverrides: Record<string, string> = {
  Trezeguet: "Trezeguet (footballer, born 1994)",
  "Chris Wood": "Chris Wood (footballer, born 1991)",
  "Joe Bell": "Joe Bell (footballer)",
};

function slugify(id: string): string {
  return id
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getJson(url: string): Promise<any | null> {
  for (let a = 0; a < 4; a++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return res.json();
      if (res.status !== 429 && res.status < 500) return null;
    } catch {
      // 网络错误/超时：重试或放弃
    }
    await new Promise((r) => setTimeout(r, 2000 * (a + 1)));
  }
  return null;
}

async function wikidataImage(title: string): Promise<string | null> {
  const q = await getJson(
    "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1" +
      `&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(title)}`
  );
  const qid = q?.query?.pages?.[0]?.pageprops?.wikibase_item;
  if (!qid) return null;
  const wd = await getJson(
    `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qid}&property=P18&format=json&origin=*`
  );
  const file = wd?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!file) return null;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=640`;
}

// 其他语言维基的词条头图（阿语/西语/德语等维基常有英文维基没有的照片）
const FOREIGN_WIKIS = ["es", "ar", "de", "fr", "tr", "bs", "it", "pt", "nl"];

async function foreignWikiImage(name: string): Promise<string | null> {
  const normName = anglicize(name).toLowerCase();
  const parts = normName.split(" ");
  const surname = parts[parts.length - 1];
  const initial = parts[0]?.[0] ?? "";
  for (const wiki of FOREIGN_WIKIS) {
    // 先精确标题，再放宽为搜索+姓氏校验（防止认错人）
    for (const q of [`intitle:"${name}"`, name]) {
      const j = await getJson(
        `https://${wiki}.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*` +
          "&redirects=1&generator=search&gsrlimit=3&gsrnamespace=0" +
          "&prop=pageimages&piprop=thumbnail&pithumbsize=640" +
          `&gsrsearch=${encodeURIComponent(q)}`
      );
      const pages: { title: string; thumbnail?: { source: string } }[] = j?.query?.pages ?? [];
      const hit = pages.find((p) => {
        if (!p.thumbnail?.source) return false;
        const t = anglicize(p.title).toLowerCase();
        return t.includes(surname) && (initial === "" || t.startsWith(initial) || t.includes(parts[0]));
      });
      if (hit) {
        console.log(`  (found on ${wiki}.wikipedia: ${hit.title})`);
        return hit.thumbnail!.source;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return null;
}

function norm(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Commons 全文检索兜底：仅接受文件名包含球员全名的结果，避免同姓误配
async function commonsImage(nameEn: string): Promise<string | null> {
  const j = await getJson(
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*" +
      `&list=search&srnamespace=6&srlimit=8&srsearch=${encodeURIComponent(nameEn)}`
  );
  const hits: { title: string }[] = j?.query?.search ?? [];
  const target = norm(nameEn);
  const hit = hits.find(
    (h) => norm(h.title).includes(target) && /\.(jpe?g|png|webp)$/i.test(h.title)
  );
  if (!hit) return null;
  const file = hit.title.replace(/^File:/, "");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=640`;
}

let fixed = 0;
const { allPlayers } = await import("../data/index");
{
  for (const p of allPlayers) {
    const id = `${p.teamId}:${p.nameEn}`;
    if (local[id]) continue;
    const title = titleOverrides[p.nameEn] ?? p.nameEn;
    const url =
      (await wikidataImage(title)) ??
      (await commonsImage(p.nameEn)) ??
      (await foreignWikiImage(p.nameEn));
    if (!url) {
      console.log(`✗ ${id} — no Wikidata image`);
      continue;
    }
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const slug = slugify(id);
      const file = `${outDir}/${slug}.webp`;
      await sharp(buf)
        .resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(file);
      local[id] = `/players/${slug}.webp`;
      fixed++;
      console.log(`✓ ${id}`);
    } catch (e) {
      console.log(`✗ ${id}: ${(e as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, 800));
  }
}

writeFileSync(photosPath, JSON.stringify(local, null, 2));
const total = Object.keys(local).length;
console.log(`\nFixed ${fixed}, total local ${total}`);
