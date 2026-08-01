import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Crest } from "@/components/Crest";
import { DERBIES, TEAMS, TEAM_BY_ID, TEAM_BY_SLUG } from "@/lib/teams";
import { fixturesFor, travelFor } from "@/lib/draw";
import { REFERENCE_DRAW, REFERENCE_SEED } from "@/lib/season";
import { MATCHDAY_DATES, formatMatchday } from "@/lib/dates";
import { encodeSeed } from "@/lib/rng";

/** Les 16 fiches sont prérendues au build : aucun calcul à l'exécution. */
export function generateStaticParams() {
  return TEAMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = TEAM_BY_SLUG[slug];
  if (!team) return {};
  const title = `${team.name} — calendrier Ligue 1 tunisienne 2026-2027`;
  const description = `Calendrier complet du ${team.name} (${team.city}) pour la saison 2026-2027 de Ligue Professionnelle 1 : 30 journées, réceptions au ${team.stadium}, déplacements et distance parcourue.`;
  return {
    title,
    description,
    alternates: { canonical: `/clubs/${team.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = TEAM_BY_SLUG[slug];
  if (!team) notFound();

  const fixtures = fixturesFor(REFERENCE_DRAW.rounds, team.id);
  const km = travelFor(REFERENCE_DRAW.rounds, team.id);
  const homeCount = fixtures.filter((f) => f.home).length;
  const derbies = DERBIES.filter((d) => d.a === team.id || d.b === team.id);

  return (
    <>
      <SiteHeader active="/clubs" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <nav className="text-[11px] text-mute">
          <Link href="/clubs" className="font-semibold hover:text-flag">
            Clubs
          </Link>
          <span className="mx-1.5">›</span>
          <span>{team.name}</span>
        </nav>

        {/* ─── identité ──────────────────────────────────────────────────── */}
        <div className="panel mt-3 flex flex-wrap items-center gap-5 p-5 sm:p-6">
          <Crest team={team} size={72} />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{team.name}</h1>
            <p className="mt-1 text-lg text-mute" dir="rtl" lang="ar">
              {team.nameAr}
            </p>
            <p className="mt-2 text-sm text-mute">
              {team.stadium} · {team.city} · fondé en {team.founded}
            </p>
          </div>
        </div>

        {/* ─── mesures ───────────────────────────────────────────────────── */}
        <dl className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat label="Réceptions" value={String(homeCount)} />
          <Stat label="Déplacements" value={String(fixtures.length - homeCount)} />
          <Stat label="Kilomètres parcourus" value={`${km.toLocaleString("fr-FR")} km`} />
          <Stat label="Affiches" value={String(derbies.length)} />
        </dl>

        {derbies.length > 0 && (
          <p className="mt-3 text-xs text-mute">
            <span className="font-semibold text-ink">Affiches du club :</span>{" "}
            {derbies.map((d) => d.label).join(" · ")}
          </p>
        )}

        {/* ─── calendrier ────────────────────────────────────────────────── */}
        <section className="mt-9">
          <h2 className="text-xl font-black tracking-tight">Calendrier 2026-2027</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-mute">
            Calendrier de référence, tiré avec la graine{" "}
            <Link
              href={`/?s=${encodeSeed(REFERENCE_SEED)}`}
              className="font-mono font-semibold hover:text-flag"
            >
              {encodeSeed(REFERENCE_SEED)}
            </Link>{" "}
            — rejouable à l&apos;identique par n&apos;importe qui. Dates indicatives, susceptibles
            d&apos;être ajustées par la LNFP.
          </p>

          <ol className="mt-4 grid gap-1.5 md:grid-cols-2">
            {fixtures.map((f) => {
              const opp = TEAM_BY_ID[f.opponent];
              const date = MATCHDAY_DATES[f.round - 1];
              if (!opp) return null;
              return (
                <li key={f.round} className="panel flex items-center gap-3 px-3 py-2">
                  <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-mute">
                    J{f.round}
                  </span>
                  <span
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                      f.home
                        ? "bg-jade/12 text-jade ring-1 ring-jade/30"
                        : "bg-sunken text-mute ring-1 ring-line"
                    }`}
                    title={f.home ? "à domicile" : "à l'extérieur"}
                  >
                    {f.home ? "D" : "E"}
                  </span>
                  <Crest team={opp} size={24} />
                  <Link
                    href={`/clubs/${opp.slug}`}
                    className="min-w-0 flex-1 truncate text-sm font-medium hover:text-flag"
                  >
                    {opp.name}
                  </Link>
                  {f.derby && (
                    <span className="shrink-0 rounded-full bg-gold/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold ring-1 ring-gold/30">
                      ★
                    </span>
                  )}
                  <span className="hidden shrink-0 font-mono text-[10px] text-mute sm:inline">
                    {date && formatMatchday(date, "fr")}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ─── autres clubs ──────────────────────────────────────────────── */}
        <section className="mt-10 border-t border-line pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-mute">Les autres clubs</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {TEAMS.filter((x) => x.id !== team.id).map((x) => (
              <li key={x.id}>
                <Link
                  href={`/clubs/${x.slug}`}
                  title={x.name}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1.5 text-[11px] font-semibold shadow-sm transition hover:border-line-strong hover:bg-sunken"
                >
                  <Crest team={x} size={18} />
                  {x.abbr}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel px-4 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-mute">{label}</dt>
      <dd className="mt-0.5 font-mono text-xl font-black tabular-nums">{value}</dd>
    </div>
  );
}
