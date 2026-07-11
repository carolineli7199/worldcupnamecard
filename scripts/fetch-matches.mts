/**
 * 抓取2026世界杯全部赛程 → data/matches.json
 * 来源: Wikipedia 各小组页 + 淘汰赛页的 {{#invoke:football box|main}} 块
 * 用法: npx tsx scripts/fetch-matches.mts （淘汰赛对阵更新后可随时重跑）
 */
import { writeFileSync } from "node:fs";

const UA = "wc26-flashcards/1.0 (personal study site)";

// FIFA 三字码 → teamId
const codeMap: Record<string, string> = {
  MEX: "mexico", RSA: "south-africa", KOR: "south-korea", CZE: "czechia",
  CAN: "canada", SUI: "switzerland", QAT: "qatar", BIH: "bosnia",
  BRA: "brazil", MAR: "morocco", SCO: "scotland", HAI: "haiti",
  USA: "usa", TUR: "turkiye", AUS: "australia", PAR: "paraguay",
  GER: "germany", ECU: "ecuador", CIV: "ivory-coast", CUW: "curacao",
  NED: "netherlands", JPN: "japan", SWE: "sweden", TUN: "tunisia",
  BEL: "belgium", IRN: "iran", EGY: "egypt", NZL: "new-zealand",
  ESP: "spain", URU: "uruguay", KSA: "saudi-arabia", CPV: "cape-verde",
  FRA: "france", SEN: "senegal", NOR: "norway", IRQ: "iraq",
  ARG: "argentina", AUT: "austria", ALG: "algeria", JOR: "jordan",
  POR: "portugal", COL: "colombia", UZB: "uzbekistan", COD: "dr-congo",
  ENG: "england", CRO: "croatia", GHA: "ghana", PAN: "panama",
};

interface Match {
  id: string;
  date: string;       // YYYY-MM-DD（球场当地日期）
  time: string;       // 当地开球 "HH:MM"
  utcOffset: string;  // 如 "-6"
  team1: string | null;
  team2: string | null;
  label1: string;     // 待定时的描述（"Winners Group A" 等）
  label2: string;
  score: string | null; // 已赛比分 "2–0"
  pens: string | null;  // 点球决胜比分 "3–4"（加时后仍平时才有）
  stage: string;
  venue: string;
}

async function getWikitext(page: string): Promise<string> {
  for (let a = 0; a < 5; a++) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json&formatversion=2&origin=*`,
        { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) }
      );
      const text = await res.text();
      if (text.startsWith("{")) {
        return (JSON.parse(text) as { parse?: { wikitext?: string } }).parse?.wikitext ?? "";
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 4000 * (a + 1)));
  }
  return "";
}

function clean(s: string): string {
  return s
    .replace(/\{\{#invoke:flag\|[^|]*\|([A-Z]{3})[^}]*\}\}/g, "$1")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function to24h(raw: string): string {
  const m = raw.match(/(\d{1,2})[:.](\d{2})\s*(?:&nbsp;|\s)*(a\.?m\.?|p\.?m\.?)?/i);
  if (!m) return "";
  let h = Number(m[1]);
  const isPM = /p/i.test(m[3] ?? "");
  const isAM = /a/i.test(m[3] ?? "");
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

// 各种写法 → 规范轮次名（与 lib/matches.ts 的 stageZh 对齐）
function normalizeStage(title: string): string {
  if (/round of 32/i.test(title)) return "Round of 32";
  if (/round of 16/i.test(title)) return "Round of 16";
  if (/quarter.?finals?/i.test(title)) return "Quarter-finals";
  if (/semi.?finals?/i.test(title)) return "Semi-finals";
  if (/third place/i.test(title)) return "Third place play-off";
  if (/bronze/i.test(title)) return "Third place play-off";
  if (/final/i.test(title)) return "Final";
  return title;
}

function parsePage(wikitext: string, stageOf: (sectionTitle: string) => string): Match[] {
  const out: Match[] = [];
  const sections: { idx: number; title: string }[] = [];
  // 只取二级标题（=== 小节是单场比赛名，不是轮次）
  const re = /^==([^=].*?)==\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(wikitext))) sections.push({ idx: m.index, title: m[1].replace(/\[\[|\]\]/g, "").trim() });

  const boxRe = /\{\{#invoke:football box\|main/gi;
  let bm: RegExpExecArray | null;
  while ((bm = boxRe.exec(wikitext))) {
    const start = bm.index;
    const block = wikitext.slice(start, start + 2500);
    const sec = [...sections].reverse().find((s) => s.idx < start)?.title ?? "";

    const field = (f: string) => {
      const mm = block.match(new RegExp(`\\|\\s*${f}\\s*=\\s*([^\\n]*)`));
      return mm ? mm[1].trim() : "";
    };
    const dm = block.match(/Start date\|(\d{4})\|(\d{1,2})\|(\d{1,2})/);
    if (!dm) continue;
    const date = `${dm[1]}-${dm[2].padStart(2, "0")}-${dm[3].padStart(2, "0")}`;
    const timeRaw = field("time");
    const offM = timeRaw.match(/UTC[−-](\d{1,2})/);
    const t1c = field("team1").match(/\|([A-Z]{3})\b/)?.[1];
    const t2c = field("team2").match(/\|([A-Z]{3})\b/)?.[1];
    const label1 = t1c ?? clean(field("team1"));
    const label2 = t2c ?? clean(field("team2"));
    const scoreM = field("score").match(/(\d+[–-]\d+)/);
    const pensM = field("penaltyscore").match(/(\d+[–-]\d+)/);
    const team1 = t1c ? codeMap[t1c] ?? null : null;
    const team2 = t2c ? codeMap[t2c] ?? null : null;
    if (!label1 || !label2) continue;
    out.push({
      id: `${date}-${(team1 ?? label1).slice(0, 14)}-${(team2 ?? label2).slice(0, 14)}`
        .toLowerCase().replace(/[^a-z0-9-]/g, ""),
      date,
      time: to24h(timeRaw),
      utcOffset: offM ? `-${offM[1]}` : "",
      team1, team2,
      label1: team1 ?? label1,
      label2: team2 ?? label2,
      score: scoreM ? scoreM[1] : null,
      pens: pensM ? pensM[1] : null,
      stage: stageOf(sec),
      venue: clean(field("stadium")),
    });
  }
  return out;
}

const all: Match[] = [];
for (const g of "ABCDEFGHIJKL") {
  const wt = await getWikitext(`2026 FIFA World Cup Group ${g}`);
  all.push(...parsePage(wt, () => `Group ${g}`));
  await new Promise((r) => setTimeout(r, 1500));
}
const koWt = await getWikitext("2026 FIFA World Cup knockout stage");
all.push(...parsePage(koWt, (sec) => normalizeStage(sec || "Knockout")));

// 已完赛的轮次会被搬到独立子页（主页面只留 {{#lst:}} 引用，wikitext 里看不到）
const subPages: [string, string][] = [
  ["2026 FIFA World Cup round of 32", "Round of 32"],
  ["2026 FIFA World Cup round of 16", "Round of 16"],
  ["2026 FIFA World Cup quarterfinals", "Quarter-finals"],
  ["2026 FIFA World Cup semifinals", "Semi-finals"],
  ["2026 FIFA World Cup final", "Final"],
];
for (const [page, stage] of subPages) {
  const wt = await getWikitext(page);
  if (wt) all.push(...parsePage(wt, () => stage));
  await new Promise((r) => setTimeout(r, 1500));
}

// 同一场比赛可能出现在主页面和子页面：按 (日期+对阵) 去重，优先保留有比分/已确定对阵的版本
const better = (a: Match, b: Match) =>
  (a.score ? 2 : 0) + (a.team1 && a.team2 ? 1 : 0) >= (b.score ? 2 : 0) + (b.team1 && b.team2 ? 1 : 0) ? a : b;
const byKey = new Map<string, Match>();
for (const x of all) {
  // 场馆在占位符→真实对阵的过渡期间也保持稳定
  const key = x.venue ? `${x.date}|${x.time}|${x.venue}` : `${x.date}|${x.time}|${x.label1}v${x.label2}`;
  const prev = byKey.get(key);
  byKey.set(key, prev ? better(x, prev) : x);
}
const deduped = [...byKey.values()];
all.length = 0;
all.push(...deduped);

all.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
writeFileSync(new URL("../data/matches.json", import.meta.url), JSON.stringify(all, null, 1));

console.log(`total: ${all.length} matches`);
console.log("dates:", all[0]?.date, "→", all[all.length - 1]?.date);
console.log("with score:", all.filter((x) => x.score).length, "| unresolved teams:", all.filter((x) => !x.team1 || !x.team2).length);
for (const x of all.filter((x) => x.date === "2026-06-12")) {
  console.log(` 6/12: ${x.time} UTC${x.utcOffset} ${x.label1} vs ${x.label2} [${x.stage}] @${x.venue} ${x.score ?? ""}`);
}