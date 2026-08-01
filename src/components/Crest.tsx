"use client";

// `useId` est un hook client : la directive est nécessaire depuis que des
// pages rendues côté serveur (fiches de club, carte) affichent des écussons.
import { useId } from "react";
import type { Team } from "@/lib/teams";

const SHIELD = "M24 1.5 44.5 7.5 V27 C44.5 41.5 34.5 50.5 24 54.5 13.5 50.5 3.5 41.5 3.5 27 V7.5 Z";

/**
 * Écusson vectoriel généré à partir des couleurs du club.
 *
 * Aucun logo officiel n'est embarqué : ils sont protégés, et une image par club
 * coûterait des requêtes réseau sur chaque page. Pour utiliser de vrais
 * écussons, il suffit de renseigner `logo` dans `src/lib/teams.ts` et de
 * déposer le fichier dans `public/logos/`.
 */
export function Crest({
  team,
  size = 40,
  className = "",
  plain = false,
}: {
  team: Team;
  size?: number;
  className?: string;
  /**
   * Écusson muet : couleurs seules, ni logo officiel ni sigle. Le quiz en a
   * besoin — un vrai logo porte le nom du club écrit dessus, ce qui rend la
   * question sans intérêt.
   */
  plain?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const { primary, secondary, text } = team.colors;

  if (team.logo && !plain) {
    // Balise <img> volontaire : l'écusson est un fichier local déjà dimensionné,
    // l'optimiseur d'images de Next consommerait du quota Vercel pour rien.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={team.logo}
        alt=""
        width={size}
        height={Math.round(size * (56 / 48))}
        loading="lazy"
        decoding="async"
        className={`shrink-0 object-contain ${className}`}
        // Même boîte que l'écusson généré, sinon les lignes de match se
        // désalignent selon que le club a un logo ou non.
        style={{ width: size, height: size * (56 / 48) }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 48 56"
      width={size}
      height={size * (56 / 48)}
      role="img"
      aria-label={team.name}
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size * (56 / 48) }}
    >
      <defs>
        <clipPath id={`c${uid}`}>
          <path d={SHIELD} />
        </clipPath>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#c${uid})`}>
        <rect width="48" height="56" fill={primary} />
        <path d="M0 0 H48 V15 L0 25 Z" fill={secondary} />
        <rect width="48" height="56" fill={`url(#g${uid})`} />
      </g>
      {/* Double filet : un liseré clair à l'intérieur pour le relief, un trait
          sombre à l'extérieur pour que les écussons blancs ou très clairs
          restent détachés du fond de page. */}
      <path d={SHIELD} fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2.5" />
      <path d={SHIELD} fill="none" stroke="rgba(13,21,32,0.28)" strokeWidth="1.25" />
      {!plain && (
        <text
          x="24"
          y="41"
          textAnchor="middle"
          fill={text}
          fontSize={team.abbr.length > 3 ? 12 : 15}
          fontWeight="800"
          letterSpacing="-0.5"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {team.abbr}
        </text>
      )}
    </svg>
  );
}
