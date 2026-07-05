import matchesJson from "@/data/matches.json";

export interface Match {
  id: string;
  date: string;
  time: string;
  utcOffset: string;
  team1: string | null;
  team2: string | null;
  label1: string;
  label2: string;
  score: string | null;
  pens: string | null; // 点球决胜比分，如 "3–4"
  stage: string;
  venue: string;
}

export const allMatches = matchesJson as Match[];

// 比赛的 UTC 时刻（球场当地时间 + 偏移）
export function matchUTC(m: Match): Date | null {
  if (!m.time) return null;
  const off = m.utcOffset || "-5";
  const hh = String(Math.abs(Number(off))).padStart(2, "0");
  return new Date(`${m.date}T${m.time}:00-${hh}:00`);
}

// 用户本地日期字符串 YYYY-MM-DD
export function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 按用户本地日期分组某天的比赛
export function matchesOnLocalDate(dateStr: string): Match[] {
  return allMatches.filter((m) => {
    const utc = matchUTC(m);
    if (!utc) return m.date === dateStr;
    return localDateStr(utc) === dateStr; // utc Date 的本地表现由运行环境时区决定
  });
}

// 赛段名本地化
const stageZh: Record<string, string> = {
  "Round of 32": "32强",
  "Round of 16": "16强",
  "Quarter-finals": "四分之一决赛",
  "Semi-finals": "半决赛",
  "Third place play-off": "季军赛",
  Final: "决赛",
};

export function trStage(stage: string, lang: "en" | "zh"): string {
  if (lang === "en") return stage;
  const g = stage.match(/^Group ([A-L])$/);
  if (g) return `${g[1]}组`;
  return stageZh[stage] ?? stage;
}

// 用户本地的开球时间显示（带时区缩写，如 "5:00 PM EDT"）
export function localKickoff(m: Match, lang: "en" | "zh"): string {
  const utc = matchUTC(m);
  if (!utc) return m.time || "TBD";
  return utc.toLocaleTimeString(lang === "zh" ? "zh-CN" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

// 球场所在城镇 → 球迷熟悉的主办城市名
const hostCity: Record<string, { en: string; zh: string }> = {
  Arlington: { en: "Dallas", zh: "达拉斯" },
  Atlanta: { en: "Atlanta", zh: "亚特兰大" },
  "East Rutherford": { en: "New York", zh: "纽约" },
  Foxborough: { en: "Boston", zh: "波士顿" },
  Guadalupe: { en: "Monterrey", zh: "蒙特雷" },
  Houston: { en: "Houston", zh: "休斯顿" },
  Inglewood: { en: "Los Angeles", zh: "洛杉矶" },
  "Kansas City": { en: "Kansas City", zh: "堪萨斯城" },
  "Mexico City": { en: "Mexico City", zh: "墨西哥城" },
  "Miami Gardens": { en: "Miami", zh: "迈阿密" },
  Philadelphia: { en: "Philadelphia", zh: "费城" },
  "Santa Clara": { en: "San Francisco", zh: "旧金山" },
  Seattle: { en: "Seattle", zh: "西雅图" },
  Toronto: { en: "Toronto", zh: "多伦多" },
  Vancouver: { en: "Vancouver", zh: "温哥华" },
  Zapopan: { en: "Guadalajara", zh: "瓜达拉哈拉" },
};

export function matchCity(m: Match, lang: "en" | "zh"): string {
  const raw = m.venue.split(", ").pop() ?? "";
  const c = hostCity[raw];
  return c ? c[lang] : raw;
}
