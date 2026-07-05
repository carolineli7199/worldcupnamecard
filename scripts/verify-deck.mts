/**
 * 数据审计：将264张球员卡与 Wikipedia 官方26人名单逐项比对
 * 核查：① 是否在本届名单 ② 俱乐部 ③ 出生年份 ④ 位置大类 ⑤ 48队主教练
 * 用法: npx tsx scripts/verify-deck.mts
 */
import { allTeams } from "../data/index";
import { playerDetails } from "../data/details";
import { anglicize, clubMap, trCoach, posMap } from "../lib/i18n";

const countryAliases: Record<string, string> = {
  "United States": "usa", "South Korea": "south-korea", "Korea Republic": "south-korea",
  Turkey: "turkiye", Türkiye: "turkiye", "Czech Republic": "czechia", Czechia: "czechia",
  "Ivory Coast": "ivory-coast", "Côte d'Ivoire": "ivory-coast",
  "DR Congo": "dr-congo", "Democratic Republic of the Congo": "dr-congo",
  "Bosnia and Herzegovina": "bosnia", "Cape Verde": "cape-verde",
  "Saudi Arabia": "saudi-arabia", "New Zealand": "new-zealand", "South Africa": "south-africa",
};

interface SquadPlayer { name: string; key: string; pos: string; club: string; birthYear: number | null }
interface SquadTeam { players: SquadPlayer[]; coach: string | null }

function norm(s: string) { return anglicize(s).toLowerCase().replace(/[^a-z ]/g, "").trim(); }

const res = await fetch(
  "https://en.wikipedia.org/w/api.php?action=parse&page=2026_FIFA_World_Cup_squads&prop=wikitext&format=json&formatversion=2&origin=*",
  { headers: { "User-Agent": "wc26-flashcards/1.0 (personal study site)" } }
);
const wikitext = ((await res.json()) as { parse?: { wikitext?: string } }).parse?.wikitext ?? "";
if (!wikitext) throw new Error("fetch failed");

const squads: Record<string, SquadTeam> = {};
let cur: string | null = null;

for (const line of wikitext.split("\n")) {
  const heading = line.match(/^===\s*([^=]+?)\s*===$/);
  if (heading) {
    const h = heading[1].replace(/\[\[|\]\]/g, "").split("|").pop()!.trim();
    cur = countryAliases[h] ?? allTeams.find((t) => t.nameEn === h)?.id ?? null;
    if (cur) squads[cur] ??= { players: [], coach: null };
    continue;
  }
  if (!cur) continue;
  if (/head coach/i.test(line)) {
    const m = line.match(/[Hh]ead coach[^[]*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
    if (m) squads[cur].coach = (m[2] ?? m[1]).trim();
    continue;
  }
  if (/nat fs/i.test(line) && /\|\s*name\s*=/.test(line)) {
    const get = (field: string) => {
      const m = line.match(new RegExp(`\\|\\s*${field}\\s*=\\s*([^|}]+(?:\\[\\[[^\\]]*\\]\\][^|}]*)*)`));
      return m ? m[1].trim() : "";
    };
    let name = get("name")
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1")
      .replace(/\{\{[^}]*\}\}/g, "").replace(/<[^>]+>/g, "").trim();
    // club= 可能是 [[Article|Display]]，Article 可含括号，优先整体匹配 wikilink
    const clubLink = line.match(/\|\s*club\s*=\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
    let club = clubLink
      ? (clubLink[2] ?? clubLink[1]).trim()
      : get("club").replace(/\[\[|\]\]/g, "").trim();
    const pos = get("pos").replace(/[^A-Z]/g, "");
    // age2 模板格式 {{Birth date and age2|2026|6|11|YYYY|M|D}}：取第二组年份
    const by2 = line.match(/[Bb]irth date and age2\s*\|\s*\d{4}\s*\|\s*\d{1,2}\s*\|\s*\d{1,2}\s*\|\s*(\d{4})/);
    const by1 = line.match(/[Bb]irth date and age\s*\|\s*(?:df\s*=\s*\w+\s*\|)?\s*(\d{4})/);
    const by = by2 ?? by1;
    if (name) {
      squads[cur].players.push({
        name, key: norm(name), pos, club,
        birthYear: by ? Number(by[1]) : null,
      });
    }
  }
}

// ===== 比对 =====
const issues: string[] = [];
let checked = 0;

for (const team of allTeams) {
  const squad = squads[team.id];
  if (!squad || squad.players.length < 20) {
    issues.push(`⚠️ ${team.id}: squad parse incomplete (${squad?.players.length ?? 0})`);
    continue;
  }
  // 教练
  const myCoach = norm(trCoach(team.coach));
  if (squad.coach) {
    const wikiCoach = norm(squad.coach);
    const sur = (s: string) => s.split(" ").pop();
    if (wikiCoach !== myCoach && sur(wikiCoach) !== sur(myCoach)) {
      issues.push(`👔 COACH ${team.id}: ours="${trCoach(team.coach)}" wiki="${squad.coach}"`);
    }
  }
  for (const p of team.keyPlayers) {
    checked++;
    const key = norm(p.nameEn);
    const hit =
      squad.players.find((s) => s.key === key) ??
      squad.players.find((s) => s.key.includes(key) || key.includes(s.key)) ??
      squad.players.find((s) => {
        const a = key.split(" "), b = s.key.split(" ");
        return a[a.length - 1] === b[b.length - 1] && (a[0]?.[0] === b[0]?.[0]);
      });
    if (!hit) {
      issues.push(`❌ NOT IN SQUAD ${team.id}: ${p.nameEn}`);
      continue;
    }
    // 俱乐部
    const myClub = norm(clubMap[p.club] ?? p.club);
    const wikiClub = norm(hit.club);
    const clubOk =
      wikiClub.includes(myClub) || myClub.includes(wikiClub) ||
      myClub.split(" ").some((w) => w.length > 3 && wikiClub.includes(w)) ||
      /league|club|veteran|agent|overseas|americas|gulf|championship/.test(myClub);
    if (!clubOk) {
      issues.push(`🏟️ CLUB ${team.id}: ${p.nameEn} ours="${clubMap[p.club] ?? p.club}" wiki="${hit.club}"`);
    }
    // 出生年
    const detail = playerDetails[`${team.id}:${p.nameEn}`];
    if (detail?.birthYear && hit.birthYear && Math.abs(detail.birthYear - hit.birthYear) > 0) {
      issues.push(`🎂 BIRTH ${team.id}: ${p.nameEn} ours=${detail.birthYear} wiki=${hit.birthYear}`);
    }
    // 位置大类
    const posGroup: Record<string, string> = { 门将: "GK", 中后卫: "DF", 左后卫: "DF", 右后卫: "DF", 翼卫: "DF", 右翼卫: "DF" };
    const firstPos = p.position.split("/")[0];
    const myGroup = posGroup[firstPos] ?? (firstPos.includes("锋") ? "FW" : "MF");
    if (hit.pos && myGroup === "GK" && hit.pos !== "GK") {
      issues.push(`📍 POS ${team.id}: ${p.nameEn} ours=GK wiki=${hit.pos}`);
    }
    if (hit.pos === "GK" && myGroup !== "GK") {
      issues.push(`📍 POS ${team.id}: ${p.nameEn} ours=${myGroup} wiki=GK`);
    }
  }
}

console.log(`checked ${checked} players across ${allTeams.length} teams`);
console.log(`issues: ${issues.length}\n`);
issues.forEach((i) => console.log(i));
