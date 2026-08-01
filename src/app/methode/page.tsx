import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { REFERENCE_DRAW, REFERENCE_SEED } from "@/lib/season";
import { encodeSeed } from "@/lib/rng";

export const metadata: Metadata = {
  title: "Comment un calendrier de championnat est construit",
  description:
    "Tables de Berger, breaks, stades partagés, retour inversé : la méthode complète derrière la génération d'un calendrier de Ligue 1 équilibré et sans conflit, expliquée pas à pas.",
  alternates: { canonical: "/methode" },
};

export default function MethodePage() {
  const s = REFERENCE_DRAW.stats;

  return (
    <>
      <SiteHeader active="/methode" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Comment on construit un calendrier de championnat
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-mute">
          Seize clubs, trente journées, deux cent quarante matchs. Posé comme ça, un calendrier de
          championnat ressemble à un problème de tirage au sort. C&apos;en est un — mais un tirage
          soumis à des contraintes qui, prises ensemble, éliminent l&apos;écrasante majorité des
          combinaisons possibles. Voici lesquelles, et comment on les satisfait toutes en
          25 millisecondes.
        </p>

        <Chapter n={1} title="Le squelette : les tables de Berger">
          <p>
            On ne part pas d&apos;une feuille blanche. Il existe une construction mathématique,
            connue depuis le XIX<sup>e</sup> siècle, qui garantit qu&apos;en <em>n−1</em> journées
            chaque équipe rencontre exactement une fois chacune des autres : la table de Berger.
            Avec seize clubs, cela donne quinze journées d&apos;aller, huit matchs par journée,
            aucun doublon, aucun oubli.
          </p>
          <p>
            Sa vertu cachée est ailleurs. Un <strong>break</strong>, c&apos;est le moment où un club
            enchaîne deux réceptions ou deux déplacements de suite. On ne peut pas les supprimer —
            la théorie dit qu&apos;il en faut au minimum <em>n−2</em>, soit quatorze par phase. La
            table de Berger atteint ce minimum. Notre calendrier de référence en compte{" "}
            <strong>{s.breaks}</strong> sur l&apos;ensemble de la saison, et jamais plus de deux
            matchs consécutifs à domicile.
          </p>
        </Chapter>

        <Chapter n={2} title="Le retour : inversé, pas en miroir">
          <p>
            La plupart des championnats jouent un retour « en miroir » : la J16 rejoue la J1 avec
            les terrains inversés. C&apos;est intuitif, et c&apos;est un piège. À la charnière entre
            l&apos;aller et le retour, le dernier match de la J15 et le premier de la J16 se
            suivent — et le miroir garantit qu&apos;au moins un club enchaîne trois réceptions.
          </p>
          <p>
            Le <strong>retour inversé</strong> évite ça : la J16 rejoue la J15 à l&apos;envers, la
            J17 la J14, et ainsi de suite. Ce n&apos;est pas une préférence esthétique. Nous avons
            testé les deux structures sur soixante tirages chacune : le miroir produit une série de
            trois réceptions dans <strong>60 cas sur 60</strong>, le retour inversé dans aucun.
          </p>
        </Chapter>

        <Chapter n={3} title="Les contraintes tunisiennes">
          <p>
            Vient ensuite ce qui ne figure dans aucun manuel, parce que c&apos;est propre au pays.
            Six des seize clubs jouent dans le Grand Tunis. L&apos;Espérance et le Club Africain
            partagent le stade de Radès : ils ne peuvent pas recevoir le même jour, jamais. Un
            déplacement à Ben Guerdane, c&apos;est près de six cents kilomètres.
          </p>
          <p>Le moteur applique donc cinq règles dures :</p>
          <ul>
            <li>chaque paire se rencontre deux fois, une fois chez chacun ;</li>
            <li>un club ne joue qu&apos;une fois par journée ;</li>
            <li>deux clubs d&apos;un même stade ne reçoivent jamais simultanément ;</li>
            <li>jamais plus de trois réceptions ou trois déplacements de suite ;</li>
            <li>un plafond de réceptions simultanées par agglomération.</li>
          </ul>
          <p>
            Ce dernier plafond a une limite basse instructive. À deux, le problème devient{" "}
            <strong>insoluble</strong> : six clubs tunisois ne peuvent pas se partager les journées
            sans dépasser deux réceptions simultanées. Nous l&apos;avons mesuré — soixante échecs
            sur soixante — puis retiré l&apos;option de l&apos;interface. Un réglage qui ne peut
            pas fonctionner n&apos;a pas à être proposé.
          </p>
        </Chapter>

        <Chapter n={4} title="Le hasard, et ce qu'il touche vraiment">
          <p>
            Le tirage ne porte pas sur les affiches. Il porte sur l&apos;<em>attribution</em> des
            seize clubs aux seize positions de la table de Berger. Seize factorielle, cela fait plus
            de vingt mille milliards de permutations — largement assez pour que personne ne puisse
            prédire le résultat.
          </p>
          <p>
            Le générateur aléatoire est <strong>déterministe</strong> : il part d&apos;une graine,
            un court code affiché à l&apos;écran. Même graine, même calendrier, sur n&apos;importe
            quel appareil, pour toujours. C&apos;est ce qui rend le tirage vérifiable :{" "}
            <Link href={`/?s=${encodeSeed(REFERENCE_SEED)}`} className="font-mono font-semibold">
              {encodeSeed(REFERENCE_SEED)}
            </Link>{" "}
            produira toujours exactement le calendrier de ce site.
          </p>
        </Chapter>

        <Chapter n={5} title="L'optimisation, sous contrainte de temps">
          <p>
            Une permutation tirée au hasard respecte rarement toutes les règles du premier coup. Une
            recherche locale échange alors des positions, mesure si le résultat s&apos;améliore, et
            recommence. Elle réduit les coûts « souples » : kilomètres parcourus, affiches mal
            placées, déséquilibres entre clubs.
          </p>
          <p>
            Elle s&apos;arrête net au bout de vingt-deux millisecondes. Pas parce que c&apos;est
            optimal — parce que l&apos;expérience doit rester instantanée sur un téléphone
            d&apos;entrée de gamme. Le calendrier de référence a été retenu après{" "}
            <strong>{s.iterations.toLocaleString("fr-FR")}</strong> configurations évaluées.
          </p>
        </Chapter>

        <Chapter n={6} title="La vérification, qui est le vrai sujet">
          <p>
            C&apos;est l&apos;étape qui distingue « faites-nous confiance » de « vérifiez
            vous-même ». Une fois le calendrier produit, un second programme le relit{" "}
            <strong>sans rien savoir</strong> de la façon dont il a été construit. Il ne reçoit que
            la liste des matchs, et recontrôle chaque règle depuis zéro.
          </p>
          <p>
            Le résultat s&apos;affiche dans l&apos;onglet Vérification, y compris en cas
            d&apos;échec. Sur trois cents tirages consécutifs, le moteur n&apos;a produit{" "}
            <strong>aucune violation dure</strong>, avec une médiane de vingt-cinq millisecondes.
            Un tirage dont on ne peut pas contrôler le résultat n&apos;est pas un tirage
            transparent, quelle que soit la cérémonie qui l&apos;entoure.
          </p>
        </Chapter>

        <div className="mt-10 rounded-xl border border-flag/20 bg-flag/6 p-5">
          <p className="text-lg font-black tracking-tight">Essayez vous-même</p>
          <p className="mt-1.5 text-sm leading-relaxed text-mute">
            Le code est ouvert, le calcul se fait dans votre navigateur, et chaque tirage est
            rejouable par n&apos;importe qui à partir de sa graine.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-flag px-5 py-3 text-sm font-bold text-white shadow-lg shadow-flag/25 transition hover:bg-flag-soft"
          >
            Lancer un tirage
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Chapter({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 border-t border-line pt-7">
      <h2 className="flex items-baseline gap-3 text-xl font-black tracking-tight">
        <span className="font-mono text-sm text-flag">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-mute [&_li]:ms-5 [&_li]:list-disc [&_strong]:text-ink [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
