import Link from "next/link";
import { T } from "@/lib/i18n";
import { LangPin } from "./LangPin";

/**
 * En-tête des pages éditoriales (fiches de club, carte, simulateur…).
 *
 * L'application de tirage garde son propre en-tête : c'est une console, elle a
 * besoin de ses outils, pas d'une navigation de site.
 */
// Libellés repris du dictionnaire français, pour que la barre soit rigoureusement
// identique à celle de l'application.
const NAV = [
  { href: "/clubs", label: T.fr.navClubs },
  { href: "/carte", label: T.fr.navMap },
  { href: "/derbys", label: T.fr.navDerbies },
  { href: "/simulateur", label: T.fr.navSimulator },
  { href: "/palmares", label: T.fr.navPalmares },
  { href: "/quiz", label: T.fr.navQuiz },
  { href: "/methode", label: T.fr.navMethod },
];

export function SiteHeader({ active }: { active?: string }) {
  return (
    // Mêmes classes que l'en-tête de l'application : même hauteur, mêmes
    // marges, pleine largeur. Contraint à max-w-5xl, il paraissait plus étroit
    // que celui de l'accueil et la barre « sautait » d'une page à l'autre.
    <header className="no-print sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-canvas/75 px-4 backdrop-blur-xl">
      {/* Ces pages sont en français : on le déclare, sinon le document garde
          la direction laissée par l'application (arabe = RTL). */}
      <LangPin lang="fr" />

      <Link href="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-80">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-flag text-sm font-black text-white">
          1
        </span>
        <span className="hidden min-w-0 md:block">
          <span className="block truncate text-sm font-bold leading-tight">Tirage LP1</span>
          <span className="block truncate text-[11px] leading-tight text-mute">
            Saison 2026 · 2027
          </span>
        </span>
      </Link>

      <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active === n.href ? "page" : undefined}
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              active === n.href ? "bg-sunken text-ink" : "text-mute hover:bg-sunken hover:text-ink"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <Link
        href="/"
        className="shrink-0 rounded-lg bg-flag px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-flag/25 transition hover:bg-flag-soft"
      >
        Lancer un tirage
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-8 text-[11px] leading-relaxed text-mute">
      <div className="mx-auto max-w-5xl px-4">
        <p>
          Projet citoyen indépendant, sans lien avec la FTF ou la LNFP. Les noms et emblèmes de
          clubs appartiennent à leurs propriétaires respectifs.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} Moatez Litaiem ·{" "}
          <Link href="/#contact" className="font-semibold hover:text-flag">
            Contact
          </Link>
        </p>
      </div>
    </footer>
  );
}
