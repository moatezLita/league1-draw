import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { TunisiaMap, type MapClub } from "@/components/TunisiaMap";
import { TEAMS } from "@/lib/teams";
import { travelFor } from "@/lib/draw";
import { REFERENCE_DRAW } from "@/lib/season";
import { project } from "@/lib/tunisia-map";

export const metadata: Metadata = {
  title: "Carte des clubs de Ligue 1 tunisienne 2026-2027",
  description:
    "Les seize clubs de Ligue Professionnelle 1 situés sur la carte de la Tunisie, avec la distance parcourue par chacun sur une saison complète.",
  alternates: { canonical: "/carte" },
};

/**
 * Six clubs se partagent le Grand Tunis : projetés tels quels, leurs marqueurs
 * se recouvrent entièrement. On les répartit sur un petit cercle autour de la
 * ville, en gardant un point gris à l'emplacement réel et un trait de rappel.
 */
function spreadByMetro(): MapClub[] {
  const groups = new Map<string, typeof TEAMS>();
  for (const t of TEAMS) {
    const list = groups.get(t.metro) ?? [];
    list.push(t);
    groups.set(t.metro, list);
  }

  const out: MapClub[] = [];
  for (const [, clubs] of groups) {
    clubs.forEach((t, i) => {
      const { x, y } = project(t.lat, t.lon);
      const n = clubs.length;
      let mx = x;
      let my = y;
      if (n > 1) {
        // rayon croissant avec le nombre de clubs, départ vers la droite
        const radius = 34 + n * 9;
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        mx = x + Math.cos(angle) * radius * 1.6;
        my = y + Math.sin(angle) * radius;
      }
      out.push({
        id: t.id,
        abbr: t.abbr,
        name: t.name,
        city: t.city,
        stadium: t.stadium,
        slug: t.slug,
        color: t.colors.primary,
        x,
        y,
        mx,
        my,
        spread: n > 1,
        km: travelFor(REFERENCE_DRAW.rounds, t.id),
      });
    });
  }
  return out;
}

export default function CartePage() {
  const clubs = spreadByMetro();

  return (
    <>
      <SiteHeader active="/carte" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">La Ligue 1 sur la carte</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute">
          Seize clubs, mais une géographie très inégale : six d&apos;entre eux jouent dans le Grand
          Tunis, tandis qu&apos;un déplacement à Ben Guerdane représente près de 600 km. C&apos;est
          précisément ce que le moteur de tirage cherche à équilibrer.
        </p>

        <div className="mt-7">
          <TunisiaMap clubs={clubs} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
