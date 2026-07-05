// 临时工具：打印受影响球队的官方名单（选替代球员用）
import { allTeams } from "../data/index";

const aliases: Record<string, string> = {
  "United States": "usa", "South Korea": "south-korea", "Korea Republic": "south-korea",
  Turkey: "turkiye", Türkiye: "turkiye", "Czech Republic": "czechia", Czechia: "czechia",
  "Ivory Coast": "ivory-coast", "Côte d'Ivoire": "ivory-coast",
  "DR Congo": "dr-congo", "Democratic Republic of the Congo": "dr-congo",
  "Bosnia and Herzegovina": "bosnia", "Cape Verde": "cape-verde",
  "Saudi Arabia": "saudi-arabia", "New Zealand": "new-zealand", "South Africa": "south-africa",
};
const want = new Set((process.env.TEAMS ?? "").split(","));

const res = await fetch(
  "https://en.wikipedia.org/w/api.php?action=parse&page=2026_FIFA_World_Cup_squads&prop=wikitext&format=json&formatversion=2&origin=*",
  { headers: { "User-Agent": "wc26-flashcards/1.0" } }
);
const wt = ((await res.json()) as { parse: { wikitext: string } }).parse.wikitext;

let cur: string | null = null;
const out: Record<string, string[]> = {};
for (const line of wt.split("\n")) {
  const h = line.match(/^===\s*([^=]+?)\s*===$/);
  if (h) {
    const name = h[1].replace(/\[\[|\]\]/g, "").split("|").pop()!.trim();
    cur = aliases[name] ?? allTeams.find((t) => t.nameEn === name)?.id ?? null;
    continue;
  }
  if (!cur || !want.has(cur)) continue;
  if (/nat fs/i.test(line) && /\|\s*name\s*=/.test(line)) {
    const nm = line.match(/\|\s*name\s*=\s*(?:\[\[(?:[^\]|]+\|)?([^\]]+)\]\]|([^|}]+))/);
    const cl = line.match(/\|\s*club\s*=\s*\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/);
    const ps = line.match(/\|\s*pos\s*=[^A-Z]*([A-Z]{2})/);
    const by2 = line.match(/[Bb]irth date and age2\s*\|\s*\d{4}\s*\|\s*\d{1,2}\s*\|\s*\d{1,2}\s*\|\s*(\d{4})/);
    const by1 = line.match(/[Bb]irth date and age\s*\|\s*(?:df\s*=\s*\w+\s*\|)?\s*(\d{4})/);
    const yr = (by2 ?? by1)?.[1] ?? "?";
    const name = (nm?.[1] ?? nm?.[2] ?? "").trim();
    if (name) (out[cur] ??= []).push(`${ps?.[1] ?? "??"} ${name} ${yr} (${cl?.[1] ?? "?"})`);
  }
}
for (const [team, list] of Object.entries(out)) {
  console.log(`\n== ${team} ==\n${list.join(" | ")}`);
}

// 附：打印指定队的 Head coach 原始行
if (process.env.COACHES) {
  const wantCoach = process.env.COACHES.split(",");
  let cur2 = "";
  for (const line of wt.split("\n")) {
    const h = line.match(/^===\s*(.+?)\s*===$/);
    if (h) cur2 = h[1];
    if (/head coach/i.test(line) && wantCoach.some((w) => cur2.includes(w)))
      console.log(cur2, "→", line.slice(0, 200));
  }
}
