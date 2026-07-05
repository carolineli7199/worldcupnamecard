// 重数据包：首屏不需要的内容，客户端挂载后动态 import
import { allPlayers } from "./index";
import { anglicize } from "@/lib/i18n";
import squadsJson from "./squads.json";

export { playerDetails } from "./details";
export { playersEn, teamsEn } from "./en";

export interface SquadEntry {
  name: string;
  key: string; // anglicized lowercase
  teamId: string;
}

const deckPlayerKeys = new Set(allPlayers.map((p) => anglicize(p.nameEn).toLowerCase()));

// 官方1,247人名单索引（已排除卡组中的264人）
export const squadIndex: SquadEntry[] = Object.entries(
  squadsJson as Record<string, string[]>
).flatMap(([teamId, names]) =>
  names
    .map((name) => ({ name, key: anglicize(name).toLowerCase(), teamId }))
    .filter((s) => !deckPlayerKeys.has(s.key))
);
