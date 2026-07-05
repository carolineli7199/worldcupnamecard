import { MetadataRoute } from "next";
import { allTeams } from "@/data";
import { SITE_URL, playerSlugs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/teams`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/players`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...allTeams.map((t) => ({
      url: `${SITE_URL}/teams/${t.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...[...playerSlugs.keys()].map((slug) => ({
      url: `${SITE_URL}/players/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
