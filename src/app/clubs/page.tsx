import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Crest } from "@/components/Crest";
import { TEAMS } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Les 16 clubs de la Ligue 1 tunisienne 2026-2027",
  description:
    "Les seize clubs engagés en Ligue Professionnelle 1 pour la saison 2026-2027 : stade, ville, année de fondation et calendrier complet de chacun.",
  alternates: { canonical: "/clubs" },
};

/** Regroupement par région, pour donner une lecture géographique immédiate. */
const REGION_LABEL: Record<string, string> = {
  "grand-tunis": "Grand Tunis",
  nord: "Nord",
  sahel: "Sahel",
  sfax: "Sfax",
  sud: "Sud",
  "sud-ouest": "Sud-Ouest",
};

export default function ClubsIndex() {
  const byRegion = new Map<string, typeof TEAMS>();
  for (const t of TEAMS) {
    const list = byRegion.get(t.region) ?? [];
    list.push(t);
    byRegion.set(t.region, list);
  }

  return (
    <>
      <SiteHeader active="/clubs" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Les 16 clubs de la Ligue 1
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute">
          Composition de la Ligue Professionnelle 1 pour la saison 2026-2027, après la montée de
          l&apos;ES Hammam Sousse, du PS Sakiet Eddaïer et du CS Hammam Lif. Chaque fiche donne le
          stade, la ville et le calendrier complet du club.
        </p>

        {[...byRegion.entries()].map(([region, clubs]) => (
          <section key={region} className="mt-9">
            <h2 className="text-xs font-bold uppercase tracking-wider text-mute">
              {REGION_LABEL[region] ?? region}
              <span className="ms-2 font-mono text-[11px] font-normal">{clubs.length}</span>
            </h2>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/clubs/${t.slug}`}
                    className="panel lift flex items-center gap-3 p-3.5"
                  >
                    <Crest team={t} size={38} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">{t.name}</span>
                      <span className="block truncate text-[11px] text-mute">
                        {t.city} · {t.founded}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
