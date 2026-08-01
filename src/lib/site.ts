/**
 * Identité du projet et de son auteur — source unique.
 *
 * Ces valeurs alimentent la page d'accueil, les métadonnées de partage et le
 * pied de page. Les modifier ici suffit.
 */
export const AUTHOR = {
  name: "Moatez Litaiem",
  email: "moatezlitaiem@gmail.com",
  github: "https://github.com/moatezLita",
  githubHandle: "@moatezLita",
  linkedin: "https://www.linkedin.com/in/litaiem-moatez/",
  linkedinHandle: "litaiem-moatez",
  repo: "https://github.com/moatezLita/league1-draw",
} as const;

/** Lien `mailto:` avec un objet pré-rempli — un frein de moins pour écrire. */
export const MAILTO = `mailto:${AUTHOR.email}?subject=${encodeURIComponent(
  "Contact via Tirage LP1",
)}`;
