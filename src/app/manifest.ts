import type { MetadataRoute } from "next";

/**
 * Manifeste d'application web.
 *
 * Tout le calcul se fait déjà dans le navigateur : rendre le site installable
 * ne coûte donc rien de plus qu'un fichier. Sur un téléphone, « Ajouter à
 * l'écran d'accueil » donne une icône et un lancement plein écran.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tirage LP1 — Calendrier Ligue 1 Tunisie",
    short_name: "Tirage LP1",
    description:
      "Générez un calendrier complet, équilibré et vérifiable de la Ligue Professionnelle 1 tunisienne, directement dans votre navigateur.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6fa",
    theme_color: "#f4f6fa",
    lang: "fr",
    dir: "ltr",
    categories: ["sports"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
