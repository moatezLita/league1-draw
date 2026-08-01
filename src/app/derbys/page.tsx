import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Crest } from "@/components/Crest";
import { DERBIES, TEAM_BY_ID, distanceKm } from "@/lib/teams";
import { REFERENCE_DRAW } from "@/lib/season";
import { MATCHDAY_DATES, formatMatchday } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Les derbys de la Ligue 1 tunisienne — affiches 2026-2027",
  description:
    "Derby de Tunis, Classico, derby du Sahel, derby de Sfax : les grandes affiches du championnat tunisien, et pourquoi elles pèsent autant sur la construction du calendrier.",
  alternates: { canonical: "/derbys" },
};

export default function DerbysPage() {
  // Où tombe chaque affiche dans le calendrier de référence.
  const rounds = new Map<string, number[]>();
  REFERENCE_DRAW.rounds.forEach((round, i) => {
    for (const m of round) {
      if (!m.derby) continue;
      const list = rounds.get(m.derby) ?? [];
      list.push(i + 1);
      rounds.set(m.derby, list);
    }
  });

  const tier1 = DERBIES.filter((d) => d.tier === 1);
  const tier2 = DERBIES.filter((d) => d.tier === 2);

  return (
    <>
      <SiteHeader active="/derbys" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Les derbys de la Ligue 1
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-mute">
          Une affiche n&apos;est pas un match comme les autres : elle mobilise les forces de
          l&apos;ordre, remplit un stade, et se négocie avec les diffuseurs. C&apos;est pourquoi le
          moteur de tirage les traite à part — jamais lors de la première ni de la dernière
          journée, et jamais deux grandes affiches le même week-end.
        </p>

        <Section
          title="Les grandes affiches"
          lead="Cinq rendez-vous que le calendrier protège en priorité."
          derbies={tier1}
          rounds={rounds}
        />
        <Section
          title="Les derbys régionaux"
          lead="Rivalités de proximité : deux clubs d'une même ville ou d'une même région."
          derbies={tier2}
          rounds={rounds}
        />

        <section className="mt-10 border-t border-line pt-6">
          <h2 className="text-xl font-black tracking-tight">Pourquoi ça complique le tirage</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute">
            Six clubs du Grand Tunis, deux d&apos;entre eux — l&apos;Espérance et le Club Africain —
            partageant le stade de Radès : la moindre affiche mal placée déclenche une réaction en
            chaîne. Il faut à la fois éviter deux réceptions simultanées dans la même
            agglomération, ne pas saturer un stade partagé, et répartir les affiches sur la saison.
            C&apos;est précisément le genre de contrainte qu&apos;un tirage manuel gère mal, et
            qu&apos;un solveur règle en 25 millisecondes.
          </p>
          <Link
            href="/methode"
            className="mt-4 inline-block rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold shadow-sm transition hover:border-line-strong hover:bg-sunken"
          >
            Comment le calendrier est construit →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  title,
  lead,
  derbies,
  rounds,
}: {
  title: string;
  lead: string;
  derbies: typeof DERBIES;
  rounds: Map<string, number[]>;
}) {
  return (
    <section className="mt-9">
      <h2 className="text-xl font-black tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-mute">{lead}</p>

      <ul className="mt-4 grid gap-2.5 md:grid-cols-2">
        {derbies.map((d) => {
          const a = TEAM_BY_ID[d.a];
          const b = TEAM_BY_ID[d.b];
          if (!a || !b) return null;
          const md = rounds.get(d.label) ?? [];
          const km = Math.round(distanceKm(a, b));
          return (
            <li key={d.label} className="panel lift p-4">
              <p className="text-sm font-black tracking-tight">{d.label}</p>

              <div className="mt-3 flex items-center gap-3">
                <Link href={`/clubs/${a.slug}`} className="flex min-w-0 items-center gap-2">
                  <Crest team={a} size={30} />
                  <span className="truncate text-xs font-semibold hover:text-flag">{a.abbr}</span>
                </Link>
                <span className="font-mono text-[11px] text-mute">vs</span>
                <Link href={`/clubs/${b.slug}`} className="flex min-w-0 items-center gap-2">
                  <Crest team={b} size={30} />
                  <span className="truncate text-xs font-semibold hover:text-flag">{b.abbr}</span>
                </Link>
              </div>

              <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-2.5 text-[11px] text-mute">
                <div className="flex gap-1.5">
                  <dt>Distance</dt>
                  <dd className="font-mono font-semibold text-ink">
                    {km === 0 ? "même ville" : `${km} km`}
                  </dd>
                </div>
                {md.length > 0 && (
                  <div className="flex gap-1.5">
                    <dt>Journées</dt>
                    <dd className="font-mono font-semibold text-ink">
                      {md.map((n) => `J${n}`).join(" et ")}
                    </dd>
                  </div>
                )}
                {md[0] && MATCHDAY_DATES[md[0] - 1] && (
                  <div className="flex gap-1.5">
                    <dt>Aller</dt>
                    <dd className="font-semibold text-ink">
                      {formatMatchday(MATCHDAY_DATES[md[0] - 1], "fr")}
                    </dd>
                  </div>
                )}
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
