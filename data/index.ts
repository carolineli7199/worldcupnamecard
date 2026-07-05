import { Team, PlayerCard } from "@/lib/types";
import { teamsAC } from "./teams-a-c";
import { teamsDF } from "./teams-d-f";
import { teamsGI } from "./teams-g-i";
import { teamsJL } from "./teams-j-l";
import { extraPlayers } from "./extra/extra-players";

export const allTeams: Team[] = [...teamsAC, ...teamsDF, ...teamsGI, ...teamsJL];

export const allPlayers: PlayerCard[] = allTeams.flatMap((team) => [
  ...team.keyPlayers.map((p) => ({
    ...p,
    teamId: team.id,
    teamName: team.name,
    teamFlag: team.flag,
    group: team.group,
  })),
  ...(extraPlayers[team.id] ?? []).map((p) => ({
    ...p,
    teamId: team.id,
    teamName: team.name,
    teamFlag: team.flag,
    group: team.group,
  })),
]);

export const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export const tagColors: Record<string, string> = {
  夺冠热门: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  潜在黑马: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  淘汰赛级别: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  小组赛搅局者: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  重在参与: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30",
};
