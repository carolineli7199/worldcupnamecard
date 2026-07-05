import { Metadata } from "next";
import Link from "next/link";
import { allTeams, groups } from "@/data";
import { anglicize, tagMap } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All 48 Teams — World Cup 2026 Groups, Squads & Tactics",
  description:
    "Every team at the 2026 FIFA World Cup, organized by group: tactical profiles, expectations, full squads and key players for all 48 nations.",
  alternates: { canonical: `${SITE_URL}/teams` },
};

export default function TeamsIndex() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-emerald-400">⚽️ Flashcards</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">Teams</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">World Cup 2026 — All 48 Teams</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Tactical profiles, expectations, key players and full squads for every nation, group by group.
      </p>
      {groups.map((g) => (
        <section key={g} className="mb-6">
          <h2 className="text-sm font-semibold tracking-widest text-emerald-400 mb-2">
            GROUP {g}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allTeams
              .filter((t) => t.group === g)
              .map((t) => (
                <Link
                  key={t.id}
                  href={`/teams/${t.id}`}
                  className="flex items-center gap-3 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2.5 hover:border-emerald-500/50 transition"
                >
                  <span className="text-2xl">{t.flag}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{anglicize(t.nameEn)}</span>
                    <span className="block text-[10px] text-zinc-500">{tagMap[t.tag]}</span>
                  </span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
