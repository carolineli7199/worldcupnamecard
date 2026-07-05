/**
 * 为每位核心球员从 Wikipedia 抓取头图 URL，写入 data/player-images.json
 * 用法: npx tsx scripts/fetch-player-images.mts
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { allTeams } from "../data/index";

// 重名/特殊词条手动映射
const overrides: Record<string, string> = {
  Rodri: "Rodri (footballer, born 1996)",
  "Chris Wood": "Chris Wood (footballer, born 1991)",
  "Luis Díaz": "Luis Díaz (footballer, born 1997)",
  Trezeguet: "Trezeguet (footballer, born 1994)",
  "Nico Williams": "Nico Williams",
  "Joe Bell": "Joe Bell (footballer)",
  "Ali Olwan": "Ali Olwan",
  "Nuno Mendes": "Nuno Mendes (footballer, born 2002)",
};

const UA = "wc26-flashcards/1.0 (personal study site; contact: none)";

interface PageImagesResult {
  query?: {
    pages?: {
      title: string;
      thumbnail?: { source: string };
      pageprops?: { disambiguation?: string };
    }[];
  };
}

async function fetchJson(url: string, attempt = 0): Promise<unknown | null> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 3) return null;
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    return fetchJson(url, attempt + 1);
  }
  if (!res.ok) return null;
  return res.json();
}

async function imageByTitle(title: string): Promise<string | null> {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*" +
    "&redirects=1&prop=pageimages|pageprops&piprop=thumbnail&pithumbsize=900&ppprop=disambiguation" +
    `&titles=${encodeURIComponent(title)}`;
  const json = (await fetchJson(url)) as PageImagesResult | null;
  const page = json?.query?.pages?.[0];
  if (!page || page.pageprops?.disambiguation !== undefined) return null;
  return page.thumbnail?.source ?? null;
}

async function lookup(nameEn: string): Promise<string | null> {
  if (overrides[nameEn]) return imageByTitle(overrides[nameEn]);
  return (
    (await imageByTitle(nameEn)) ??
    (await imageByTitle(`${nameEn} (footballer)`)) ??
    (await imageByTitle(`${nameEn} (soccer)`))
  );
}

const outPath = new URL("../data/player-images.json", import.meta.url);
const result: Record<string, string> = existsSync(outPath)
  ? JSON.parse(readFileSync(outPath, "utf8"))
  : {};
const missing: string[] = [];

// 遍历全量球员（含 extraPlayers 补充名单）
const { allPlayers } = await import("../data/index");
const everyone = allPlayers.map((p) => ({ teamId: p.teamId, nameEn: p.nameEn }));
{
  for (const p of everyone) {
    const id = `${p.teamId}:${p.nameEn}`;
    if (result[id]) continue; // 增量：已有的跳过
    const img = await lookup(p.nameEn);
    if (img) {
      result[id] = img;
      console.log(`✓ ${id}`);
    } else {
      missing.push(id);
      console.log(`✗ ${id} — no image`);
    }
    await new Promise((r) => setTimeout(r, 600));
  }
}

writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(`\nDone: ${Object.keys(result).length} found, ${missing.length} missing`);
if (missing.length) console.log("Missing:", missing.join(", "));
