"use client";

import Link from "next/link";
import type { Dict, Lang } from "@/lib/i18n";
import { TEAMS } from "@/lib/teams";
import { AUTHOR, MAILTO } from "@/lib/site";
import { Crest } from "./Crest";
import { Countdown } from "./Countdown";
import { teamCity, teamName } from "./shared";

const EXPLORE = [
  { href: "/clubs", key: "navClubs" as const },
  { href: "/carte", key: "navMap" as const },
  { href: "/derbys", key: "navDerbies" as const },
  { href: "/simulateur", key: "navSimulator" as const },
  { href: "/palmares", key: "navPalmares" as const },
  { href: "/methode", key: "navMethod" as const },
];

/**
 * Page d'accueil.
 *
 * Elle défile normalement, contrairement à la console de résultats : ici le
 * défilement est le mode de lecture attendu, et c'est la seule surface qui
 * travaille pour le référencement et pour la crédibilité du projet.
 */
export function Landing({
  lang,
  t,
  onDraw,
}: {
  lang: Lang;
  t: Dict;
  onDraw: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      {/* ─── héros ───────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-mute shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-flag" aria-hidden />
          {t.league} · {t.season}
        </p>

        <h1 className="mt-5 max-w-3xl text-[2.1rem] font-black leading-[1.06] tracking-tight sm:text-6xl">
          {t.heroTitle}{" "}
          <span className="bg-linear-to-r from-flag to-gold bg-clip-text text-transparent">
            {t.heroTitleAccent}
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-mute sm:text-base">
          {t.heroLead}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onDraw}
            className="rounded-xl bg-flag px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-flag/25 transition hover:bg-flag-soft active:scale-[0.98]"
          >
            {t.cta}
          </button>
          <span className="text-xs text-mute">{t.heroHint}</span>
        </div>

        <div className="mt-5">
          <Countdown t={t} />
        </div>

        <div className="mt-9 flex flex-wrap gap-2">
          {TEAMS.map((team) => (
            <span key={team.id} title={team.name}>
              <Crest team={team} size={30} />
            </span>
          ))}
        </div>

        {/* Les autres pages, juste sous le pli : enterrées en bas de page,
            elles n'existaient pour personne. */}
        <ul className="mt-9 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className="panel lift flex items-center justify-between gap-3 p-4 text-sm font-bold"
              >
                {t[e.key]}
                <span className="text-mute rtl:rotate-180" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── pourquoi ────────────────────────────────────────────────────── */}
      <section className="border-t border-line py-12 sm:py-16">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{t.whyTitle}</h2>
        <p className="mt-4 max-w-3xl border-s-2 border-flag ps-4 text-[15px] leading-relaxed text-mute">
          {t.whyBody}
        </p>

        <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {t.pillars.map((p) => (
            <li key={p.t} className="panel p-4">
              <p className="text-sm font-bold">{p.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-mute">{p.d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── comment ─────────────────────────────────────────────────────── */}
      <section className="border-t border-line py-12 sm:py-16">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{t.howTitle}</h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {t.howSteps.map((s, i) => (
            <li key={s.t} className="panel lift p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-flag/10 font-mono text-sm font-black text-flag ring-1 ring-flag/20">
                {i + 1}
              </span>
              <p className="mt-3 text-sm font-bold">{s.t}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-mute">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── les clubs ───────────────────────────────────────────────────── */}
      <section className="border-t border-line py-12 sm:py-16">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{t.clubsTitle}</h2>
        <p className="mt-2 text-sm text-mute">{t.clubsLead}</p>

        <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {TEAMS.map((team) => (
            <li key={team.id}>
              <Link
                href={`/clubs/${team.slug}`}
                className="panel lift flex items-center gap-3 p-3"
              >
                <Crest team={team} size={34} />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold">{teamName(team, lang)}</span>
                  <span className="block truncate text-[11px] text-mute">
                    {teamCity(team, lang)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── auteur / contact ────────────────────────────────────────────── */}
      <section id="contact" className="scroll-mt-16 border-t border-line py-12 sm:py-16">
        <div className="panel relative overflow-hidden p-6 sm:p-9">
          {/* halo discret, cohérent avec le fond de page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-flag/7 via-transparent to-gold/7"
          />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">
              {t.contactKicker}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              {t.contactTitle}
            </h2>

            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <p className="text-sm font-semibold text-mute">{t.contactRole}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-jade/12 px-3 py-1 text-xs font-semibold text-jade ring-1 ring-jade/25">
                <span className="h-1.5 w-1.5 rounded-full bg-jade" aria-hidden />
                {t.contactAvailable}
              </span>
            </div>

            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">
              {t.contactLead}
            </p>

            {/* L'appel à l'action : une seule fois, en bas, après la démonstration. */}
            <div className="mt-6 rounded-xl border border-flag/20 bg-flag/6 p-5">
              <p className="text-lg font-black tracking-tight">{t.ctaTitle}</p>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-mute">{t.ctaBody}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <a
                  href={MAILTO}
                  className="rounded-xl bg-flag px-5 py-3 text-sm font-bold text-white shadow-lg shadow-flag/25 transition hover:bg-flag-soft active:scale-[0.98]"
                >
                  {t.ctaAction}
                </a>
                <a
                  href={AUTHOR.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-line bg-surface px-5 py-3 text-sm font-bold shadow-sm transition hover:border-line-strong hover:bg-sunken"
                >
                  {t.contactLinkedin}
                </a>
                <a
                  href={AUTHOR.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-line bg-surface px-5 py-3 text-sm font-bold shadow-sm transition hover:border-line-strong hover:bg-sunken"
                >
                  {t.contactCode}
                </a>
              </div>
            </div>

            <dl className="mt-6 grid gap-x-8 gap-y-2 border-t border-line pt-5 text-xs sm:grid-cols-3">
              <div className="flex items-baseline gap-2">
                <dt className="shrink-0 text-mute">E-mail</dt>
                <dd className="min-w-0">
                  <a href={MAILTO} className="block truncate font-semibold hover:text-flag" dir="ltr">
                    {AUTHOR.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="shrink-0 text-mute">LinkedIn</dt>
                <dd className="min-w-0">
                  <a
                    href={AUTHOR.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate font-semibold hover:text-flag"
                    dir="ltr"
                  >
                    {AUTHOR.linkedinHandle}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="shrink-0 text-mute">GitHub</dt>
                <dd className="min-w-0">
                  <a
                    href={AUTHOR.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate font-semibold hover:text-flag"
                    dir="ltr"
                  >
                    {AUTHOR.githubHandle}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ─── pied de page ────────────────────────────────────────────────── */}
      <footer className="border-t border-line py-8 text-[11px] leading-relaxed text-mute">
        <p className="font-semibold text-ink">{t.aboutOpen}</p>
        <p className="mt-1.5">{t.footerData}</p>
        <p className="mt-1">{t.footerNote}</p>
        <p className="mt-3">
          © {new Date().getFullYear()} {AUTHOR.name}
        </p>
      </footer>
    </div>
  );
}
