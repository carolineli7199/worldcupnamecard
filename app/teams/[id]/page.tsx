import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allTeams, tagColors } from "@/data";
import { playerDetails } from "@/data/details";
import { teamsEn, playersEn } from "@/data/en";
import squadsJson from "@/data/squads.json";
import playerPhotosJson from "@/data/player-photos.json";
import { anglicize, tagMap, confMap, trCoach, trPosition, trClub } from "@/lib/i18n";
import { SITE_URL, playerSlug } from "@/lib/seo";

const squads = squadsJson as Record<string, string[]>;
const photos = playerPhotosJson as Record<string, string>;

export function generateStaticParams() {
  return allTeams.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const team = allTeams.find((t) => t.id === id);
  if (!team) return {};
  const name = anglicize(team.nameEn);
  const en = teamsEn[team.id];
  return {
    title: `${name} World Cup 2026 — Group ${team.group}, Squad, Tactics & Key Players`,
    description: `${name} at the 2026 FIFA World Cup: Group ${team.group}, full 26-man squad, tactical profile, expectations and key players. ${en?.expectation.slice(0, 120) ?? ""}`,
    alternates: { canonical: `${SITE_URL}/teams/${team.id}` },
    openGraph: {
      title: `${team.flag} ${name} — World Cup 2026 Profile`,
      description: en?.style.slice(0, 160),
      url: `${SITE_URL}/teams/${team.id}`,
    },
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = allTeams.find((t) => t.id === id);
  if (!team) notFound();
  const en = teamsEn[team.id];
  const name = anglicize(team.nameEn);
  const roster = squads[team.id] ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: `${name} national football team`,
    sport: "Soccer",
    memberOf: { "@type": "SportsOrganization", name: "FIFA World Cup 2026" },
    coach: { "@type": "Person", name: trCoach(team.coach) },
    athlete: team.keyPlayers.map((p) => ({
      "@type": "Person",
      name: anglicize(p.nameEn),
      url: `${SITE_URL}/players/${playerSlug({ ...p, teamId: team.id, teamName: team.name, teamFlag: team.flag, group: team.group })}`,
    })),
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-xs text-zinc-500 mb-6 flex gap-2">
        <Link href="/" className="hover:text-emerald-400">⚽️ Flashcards</Link>
        <span>/</span>
        <Link href="/teams" className="hover:text-emerald-400">Teams</Link>
        <span>/</span>
        <span className="text-zinc-300">{name}</span>
      </nav>

      <header className="flex items-center gap-4 mb-6">
        <span className="text-6xl">{team.flag}</span>
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            World Cup 2026 · Group {team.group} · {confMap[team.confederation]} · FIFA Rank #{team.ranking}
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-6 text-xs">
        <span className={`px-3 py-1 rounded-full border ${tagColors[team.tag]}`}>
          {tagMap[team.tag]}
        </span>
        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
          Coach: {anglicize(trCoach(team.coach))}
        </span>
        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
          Best result: {en?.bestResult ?? team.bestResult}
        </span>
        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
          Appearance #{team.appearances}
        </span>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">⚙️ Tactical Profile</h2>
        <p className="text-zinc-300 leading-relaxed">{anglicize(en?.style ?? "")}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">🔮 Expectations</h2>
        <p className="text-zinc-300 leading-relaxed">{anglicize(en?.expectation ?? "")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-emerald-400 mb-3">⭐ Key Players</h2>
        <div className="grid gap-2">
          {team.keyPlayers.map((p) => {
            const pid = `${team.id}:${p.nameEn}`;
            const slug = playerSlug({
              ...p, teamId: team.id, teamName: team.name, teamFlag: team.flag, group: team.group,
            });
            const photo = photos[pid];
            const detail = playerDetails[pid];
            const pen = playersEn[pid];
            return (
              <Link
                key={pid}
                href={`/players/${slug}`}
                className="flex items-center gap-3 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 hover:border-emerald-500/50 transition"
              >
                {photo ? (
                  <span
                    className="w-12 h-12 shrink-0 rounded-full bg-cover bg-top border border-zinc-700"
                    style={{ backgroundImage: `url(${photo})` }}
                  />
                ) : (
                  <span className="w-12 h-12 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
                    {team.flag}
                  </span>
                )}
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold">{anglicize(p.nameEn)}</span>
                  <span className="block text-xs text-zinc-500 truncate">
                    {trPosition(p.position)} · {anglicize(trClub(p.club))} — {anglicize(pen?.blurb ?? "")}
                  </span>
                </span>
                {detail && (
                  <span className="shrink-0 w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-black text-emerald-400">
                    {detail.overall}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {roster.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-emerald-400 mb-3">
            📋 Full 26-Man Squad
          </h2>
          <p className="text-zinc-400 text-sm columns-2 sm:columns-3 gap-6 leading-relaxed">
            {roster.map((n) => (
              <span key={n} className="block">{anglicize(n)}</span>
            ))}
          </p>
        </section>
      )}

      <Link
        href="/?browse=team"
        className="inline-block px-5 py-3 rounded-2xl bg-emerald-500 text-zinc-950 font-semibold text-sm"
      >
        Study all 48 teams with flashcards →
      </Link>
    </main>
  );
}
