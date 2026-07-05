import { Metadata } from "next";
import Link from "next/link";
import { groups } from "@/data";
import { playerDetails } from "@/data/details";
import { anglicize, trPosition } from "@/lib/i18n";
import { SITE_URL, playerSlugs, teamName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All 264 Key Players — World Cup 2026 Profiles & Ratings",
  description:
    "Profiles, ratings, career backgrounds and fun facts for 264 key players at the 2026 FIFA World Cup, organized by group.",
  alternates: { canonical: `${SITE_URL}/players` },
};

export default function PlayersIndex() {
  const entries = [...playerSlugs.entries()];
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-emerald-400">⚽️ Flashcards</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">Players</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">World Cup 2026 — 264 Key Players</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Every key player at the tournament: ratings, playing styles, careers and fun facts.
      </p>
      {groups.map((g) => (
        <section key={g} className="mb-6">
          <h2 className="text-sm font-semibold tracking-widest text-emerald-400 mb-2">
            GROUP {g}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {entries
              .filter(([, p]) => p.group === g)
              .map(([slug, p]) => {
                const detail = playerDetails[`${p.teamId}:${p.nameEn}`];
                return (
                  <Link
                    key={slug}
                    href={`/players/${slug}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-900 transition text-sm"
                  >
                    <span>{p.teamFlag}</span>
                    <span className="flex-1 min-w-0 truncate">
                      {anglicize(p.nameEn)}
                      <span className="text-zinc-500 text-xs"> · {trPosition(p.position)} · {teamName(p.teamId)}</span>
                    </span>
                    {detail && (
                      <span className="text-xs font-bold text-zinc-400">{detail.overall}</span>
                    )}
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </main>
  );
}
