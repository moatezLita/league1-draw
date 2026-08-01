import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { TEAMS } from "@/lib/teams";

/**
 * L'accueil est déclaré en trois langues (paramètre `lang`) pour que Google
 * n'y voie pas des doublons. Les autres pages sont en français.
 *
 * Les URLs de tirage (`?s=…`) sont volontairement absentes : elles sont
 * infinies et sans valeur d'indexation.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          fr: `${SITE_URL}/?lang=fr`,
          ar: `${SITE_URL}/?lang=ar`,
          en: `${SITE_URL}/?lang=en`,
        },
      },
    },
    { url: `${SITE_URL}/clubs`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...TEAMS.map((t) => ({
      url: `${SITE_URL}/clubs/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/carte`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/simulateur`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/palmares`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
