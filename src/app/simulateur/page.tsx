import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Simulator } from "@/components/Simulator";
import { REFERENCE_DRAW, REFERENCE_SEED } from "@/lib/season";
import { encodeSeed } from "@/lib/rng";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Simulateur de saison — Ligue 1 tunisienne 2026-2027",
  description:
    "Choisissez le vainqueur des 240 matchs de la saison 2026-2027 et voyez le classement final se construire en direct. Qui sera champion de Ligue Professionnelle 1 ?",
  alternates: { canonical: "/simulateur" },
};

export default function SimulateurPage() {
  return (
    <>
      <SiteHeader active="/simulateur" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Simulateur de saison</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute">
          Désignez le vainqueur de chaque match — 1 pour le club recevant, N pour le nul, 2 pour le
          visiteur — et le classement se recalcule à chaque clic. Tout se passe dans votre
          navigateur, rien n&apos;est envoyé nulle part, et votre grille est conservée d&apos;une
          visite à l&apos;autre.
        </p>
        <p className="mt-2 text-xs text-mute">
          Basé sur le calendrier de référence, graine{" "}
          <Link href={`/?s=${encodeSeed(REFERENCE_SEED)}`} className="font-mono font-semibold hover:text-flag">
            {encodeSeed(REFERENCE_SEED)}
          </Link>
          .
        </p>

        <div className="mt-7">
          <Simulator rounds={REFERENCE_DRAW.rounds} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
