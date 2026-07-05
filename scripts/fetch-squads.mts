/**
 * 从 Wikipedia「2026 FIFA World Cup squads」抓取全部参赛球员名单（仅姓名），
 * 生成 data/squads.json: { teamId: ["Player Name", ...] }
 * 用法: npx tsx scripts/fetch-squads.mts
 */
import { writeFileSync } from "node:fs";
import { allTeams } from "../data/index";

// Wikipedia 章节标题 → teamId（与 nameEn 不一致的变体）
const countryAliases: Record<string, string> = {
  "United States": "usa",
  "South Korea": "south-korea",
  "Korea Republic": "south-korea",
  Turkey: "turkiye",
  Türkiye: "turkiye",
  "Czech Republic": "czechia",
  Czechia: "czechia",
  "Ivory Coast": "ivory-coast",
  "Côte d'Ivoire": "ivory-coast",
  "DR Congo": "dr-congo",
  "Democratic Republic of the Congo": "dr-congo",
  "Bosnia and Herzegovina": "bosnia",
  "Cape Verde": "cape-verde",
  "Saudi Arabia": "saudi-arabia",
  "New Zealand": "new-zealand",
  "South Africa": "south-africa",
};

function countryToId(heading: string): string | null {
  const h = heading.trim();
  if (countryAliases[h]) return countryAliases[h];
  const team = allTeams.find((t) => t.nameEn === h);
  return team?.id ?? null;
}

const res = await fetch(
  "https://en.wikipedia.org/w/api.php?action=parse&page=2026_FIFA_World_Cup_squads&prop=wikitext&format=json&formatversion=2&origin=*",
  { headers: { "User-Agent": "wc26-flashcards/1.0 (personal study site)" } }
);
const json = (await res.json()) as { parse?: { wikitext?: string } };
const wikitext = json.parse?.wikitext ?? "";
if (!wikitext) throw new Error("Failed to fetch wikitext");

const squads: Record<string, string[]> = {};
let currentId: string | null = null;

for (const line of wikitext.split("\n")) {
  const heading = line.match(/^===\s*([^=]+?)\s*===$/);
  if (heading) {
    currentId = countryToId(heading[1].replace(/\[\[|\]\]/g, "").split("|").pop()!.trim());
    continue;
  }
  if (!currentId) continue;
  // {{nat fs g player|no=10|pos=FW|name=[[Lionel Messi]]|...}}
  const nameMatch = line.match(/\|\s*name\s*=\s*(.+?)(?:\|[a-z]+\s*=|}}\s*$)/i);
  if (nameMatch && /nat fs/i.test(line)) {
    let raw = nameMatch[1].trim();
    // [[Article|Display]] → Display; [[Name]] → Name
    raw = raw.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1");
    raw = raw.replace(/\{\{[^}]*\}\}/g, "").replace(/<[^>]+>/g, "").trim();
    if (raw && raw.length < 50) {
      (squads[currentId] ??= []).push(raw);
    }
  }
}

const counts = Object.entries(squads).map(([id, list]) => `${id}:${list.length}`);
const total = Object.values(squads).reduce((s, l) => s + l.length, 0);
const missingTeams = allTeams.filter((t) => !squads[t.id] || squads[t.id].length < 20);

writeFileSync(
  new URL("../data/squads.json", import.meta.url),
  JSON.stringify(squads)
);
console.log(`teams: ${Object.keys(squads).length}, players: ${total}`);
console.log(counts.join(" "));
if (missingTeams.length) {
  console.log("⚠️ incomplete:", missingTeams.map((t) => t.id).join(", "));
}
