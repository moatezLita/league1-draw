import Link from "next/link";

/**
 * En-tête des pages éditoriales (fiches de club, carte, simulateur…).
 *
 * L'application de tirage garde son propre en-tête : c'est une console, elle a
 * besoin de ses outils, pas d'une navigation de site.
 */
const NAV = [
  { href: "/clubs", label: "Clubs" },
  { href: "/carte", label: "Carte" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/palmares", label: "Palmarès" },
  { href: "/quiz", label: "Quiz" },
];

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-canvas/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-80">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-flag text-sm font-black text-white">
            1
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-bold leading-tight">Tirage LP1</span>
            <span className="block text-[11px] leading-tight text-mute">Saison 2026 · 2027</span>
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active === n.href ? "page" : undefined}
              className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                active === n.href
                  ? "bg-sunken text-ink"
                  : "text-mute hover:bg-sunken hover:text-ink"
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
      </div>
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
