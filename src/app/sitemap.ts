import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * Le site n'a qu'une seule page — mais trois langues, servies par le paramètre
 * `lang`. On les déclare en alternates pour que Google indexe la bonne version
 * selon le visiteur, au lieu de les traiter comme des doublons.
 *
 * Les URLs de tirage (`?s=…`) ne sont volontairement PAS listées : elles sont
 * infinies et sans valeur d'indexation.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
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
  ];
}
