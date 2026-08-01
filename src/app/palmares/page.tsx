import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Crest } from "@/components/Crest";
import { CHAMPIONS, TITLES } from "@/lib/palmares";
import { TEAM_BY_ID } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Palmarès du championnat de Tunisie de football",
  description:
    "Tous les champions de Tunisie : le nombre de titres par club et les vainqueurs des 25 dernières saisons du championnat national.",
  alternates: { canonical: "/palmares" },
};

export default function PalmaresPage() {
  const max = TITLES[0].titles;

  return (
    <>
      <SiteHeader active="/palmares" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Palmarès du championnat
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute">
          Le championnat de Tunisie est l&apos;un des plus anciens d&apos;Afrique. Voici le nombre
          de titres par club, et les vainqueurs des vingt-cinq dernières saisons.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {/* ─── titres par club ───────────────────────────────────────────── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-mute">
              Titres par club
            </h2>
            <ul className="mt-3 space-y-1.5">
              {TITLES.map((t) => {
                const team = t.id ? TEAM_BY_ID[t.id] : undefined;
                return (
                  <li key={t.name} className="flex items-center gap-2.5">
                    <span className="w-7 shrink-0">
                      {team ? (
                        <Crest team={team} size={22} />
                      ) : (
                        <span
                          className="block h-[22px] w-[22px] rounded-md bg-sunken ring-1 ring-line"
                          aria-hidden
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      {team ? (
                        <Link
                          href={`/clubs/${team.slug}`}
                          className="block truncate text-xs font-semibold hover:text-flag"
                        >
                          {t.name}
                        </Link>
                      ) : (
                        <span className="block truncate text-xs text-mute">{t.name}</span>
                      )}
                    </span>
                    <span className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-sunken">
                      <span
                        className="block h-full rounded-full bg-flag/70"
                        style={{ width: `${(t.titles / max) * 100}%` }}
                      />
                    </span>
                    <span className="w-6 shrink-0 text-end font-mono text-xs font-black tabular-nums">
                      {t.titles}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ─── dernières saisons ─────────────────────────────────────────── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-mute">
              Les 25 dernières saisons
            </h2>
            <ul className="mt-3 space-y-1">
              {CHAMPIONS.map((c) => {
                const team = c.id ? TEAM_BY_ID[c.id] : undefined;
                return (
                  <li
                    key={c.season}
                    className="flex items-center gap-2.5 border-b border-line py-1.5 last:border-0"
                  >
                    <span className="w-20 shrink-0 font-mono text-[11px] tabular-nums text-mute">
                      {c.season}
                    </span>
                    {team ? <Crest team={team} size={20} /> : <span className="w-5" />}
                    <span className="min-w-0 flex-1 truncate text-xs font-semibold">{c.name}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <p className="mt-8 border-t border-line pt-5 text-[11px] leading-relaxed text-mute">
          Source : Wikipédia (fr), « Championnat de Tunisie de football ». Les palmarès anciens
          varient parfois d&apos;une source à l&apos;autre, et la saison 2025-2026 n&apos;est pas
          encore répertoriée ici. Une correction ?{" "}
          <Link href="/#contact" className="font-semibold hover:text-flag">
            Signalez-la
          </Link>
          , les données tiennent dans un seul fichier.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
