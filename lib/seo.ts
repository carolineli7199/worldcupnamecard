import { allPlayers, allTeams } from "@/data";
import { PlayerCard } from "@/lib/types";
import { anglicize } from "@/lib/i18n";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://worldcupnamecard.vercel.app";

export function slugify(s: string): string {
  return anglicize(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// 球员 slug → PlayerCard（重名时追加队伍 id 消歧）
const slugMap = new Map<string, PlayerCard>();
for (const p of allPlayers) {
  let slug = slugify(p.nameEn);
  if (slugMap.has(slug)) slug = `${slug}-${p.teamId}`;
  slugMap.set(slug, p);
}

export const playerSlugs: ReadonlyMap<string, PlayerCard> = slugMap;

export function playerSlug(p: PlayerCard): string {
  for (const [slug, player] of slugMap) {
    if (player.teamId === p.teamId && player.nameEn === p.nameEn) return slug;
  }
  return slugify(p.nameEn);
}

export function teamName(teamId: string): string {
  return anglicize(allTeams.find((t) => t.id === teamId)?.nameEn ?? teamId);
}
