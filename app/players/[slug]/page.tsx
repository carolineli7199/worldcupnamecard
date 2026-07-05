import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allTeams } from "@/data";
import { playerDetails } from "@/data/details";
import { playersEn } from "@/data/en";
import playerPhotosJson from "@/data/player-photos.json";
import { anglicize, trPosition, trClub, ratingMap } from "@/lib/i18n";
import { SITE_URL, playerSlugs } from "@/lib/seo";

const photos = playerPhotosJson as Record<string, string>;

export function generateStaticParams() {
  return [...playerSlugs.keys()].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = playerSlugs.get(slug);
  if (!p) return {};
  const name = anglicize(p.nameEn);
  const team = anglicize(allTeams.find((t) => t.id === p.teamId)?.nameEn ?? p.teamName);
  const pid = `${p.teamId}:${p.nameEn}`;
  const en = playersEn[pid];
  const photo = photos[pid];
  return {
    title: `${name} — ${team} World Cup 2026: Group ${p.group}, Ratings & Facts`,
    description: `${name} (${trPosition(p.position)}, ${anglicize(trClub(p.club))}) plays for ${team} in Group ${p.group} at the 2026 FIFA World Cup. ${en?.blurb ?? ""}`,
    alternates: { canonical: `${SITE_URL}/players/${slug}` },
    openGraph: {
      title: `${name} — World Cup 2026 Player Card`,
      description: en?.blurb,
      url: `${SITE_URL}/players/${slug}`,
      images: photo ? [{ url: `${SITE_URL}${photo}` }] : undefined,
    },
  };
}

function barColor(v: number) {
  if (v >= 85) return "bg-emerald-500";
  if (v >= 75) return "bg-sky-500";
  if (v >= 60) return "bg-amber-500";
  return "bg-zinc-500";
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = playerSlugs.get(slug);
  if (!p) notFound();
  const team = allTeams.find((t) => t.id === p.teamId);
  const pid = `${p.teamId}:${p.nameEn}`;
  const name = anglicize(p.nameEn);
  const teamNameEn = anglicize(team?.nameEn ?? p.teamName);
  const detail = playerDetails[pid];
  const en = playersEn[pid];
  const photo = photos[pid];
  const age = detail?.birthYear ? 2026 - detail.birthYear : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: "Professional footballer",
    nationality: teamNameEn,
    ...(photo ? { image: `${SITE_URL}${photo}` } : {}),
    memberOf: {
      "@type": "SportsTeam",
      name: `${teamNameEn} national football team`,
      url: `${SITE_URL}/teams/${p.teamId}`,
    },
    ...(detail?.birthYear ? { birthDate: String(detail.birthYear) } : {}),
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-xs text-zinc-500 mb-6 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-emerald-400">⚽️ Flashcards</Link>
        <span>/</span>
        <Link href="/players" className="hover:text-emerald-400">Players</Link>
        <span>/</span>
        <span className="text-zinc-300">{name}</span>
      </nav>

      <header className="flex items-center gap-4 mb-6">
        {photo ? (
          <span
            className="w-24 h-24 shrink-0 rounded-2xl bg-cover bg-top border border-zinc-700"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ) : (
          <span className="w-24 h-24 shrink-0 rounded-2xl bg-zinc-800 flex items-center justify-center text-4xl">
            {p.teamFlag}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {p.teamFlag}{" "}
            <Link href={`/teams/${p.teamId}`} className="hover:text-emerald-400 underline-offset-2 underline">
              {teamNameEn}
            </Link>{" "}
            · Group {p.group} · {trPosition(p.position)} · {anglicize(trClub(p.club))}
          </p>
          <p className="text-zinc-500 text-xs mt-1">
            {age ? `${age} years old` : ""}{age && detail?.height ? " · " : ""}
            {detail?.height ? `${detail.height} cm` : ""}
          </p>
        </div>
        {detail && (
          <span className="ml-auto shrink-0 w-16 h-16 rounded-xl bg-zinc-900 border border-emerald-500/40 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-emerald-400">{detail.overall}</span>
            <span className="text-[9px] font-bold text-zinc-500 tracking-wider">OVR</span>
          </span>
        )}
      </header>

      {detail && (
        <section className="mb-6 grid grid-cols-2 gap-x-6 gap-y-2 max-w-md">
          {detail.ratings.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-zinc-400">{ratingMap[r.label] ?? r.label}</span>
                <span className="font-bold text-zinc-200">{r.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className={`h-full rounded-full ${barColor(r.value)}`} style={{ width: `${r.value}%` }} />
              </div>
            </div>
          ))}
        </section>
      )}

      {en && (
        <>
          <section className="mb-5">
            <h2 className="text-base font-semibold text-emerald-400 mb-1">⚡ Playing Style</h2>
            <p className="text-zinc-300 leading-relaxed">{anglicize(en.blurb)}</p>
          </section>
          <section className="mb-5">
            <h2 className="text-base font-semibold text-emerald-400 mb-1">📋 Career</h2>
            <p className="text-zinc-300 leading-relaxed">{anglicize(en.background)}</p>
          </section>
          {en.funFact && (
            <section className="mb-8">
              <h2 className="text-base font-semibold text-amber-400 mb-1">💡 Fun Fact</h2>
              <p className="text-zinc-300 leading-relaxed">{anglicize(en.funFact)}</p>
            </section>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/?browse=player"
          className="inline-block px-5 py-3 rounded-2xl bg-emerald-500 text-zinc-950 font-semibold text-sm"
        >
          Study all players with flashcards →
        </Link>
        <Link
          href={`/teams/${p.teamId}`}
          className="inline-block px-5 py-3 rounded-2xl bg-zinc-800 text-zinc-200 font-semibold text-sm"
        >
          {p.teamFlag} {teamNameEn} team profile
        </Link>
      </div>
    </main>
  );
}
