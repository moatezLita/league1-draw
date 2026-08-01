import { DrawApp } from "@/components/DrawApp";
import { TEAMS } from "@/lib/teams";

/**
 * La page est un Server Component : le HTML statique (dont le contenu SEO
 * ci-dessous) est prérendu au build, et seule l'application de tirage est
 * hydratée côté client. Rien n'est calculé sur le serveur à l'exécution, d'où
 * un hébergement gratuit qui encaisse n'importe quel pic de trafic.
 */
export default function Home() {
  return (
    <>
      <DrawApp />

      {/* Contenu indexable, invisible à l'écran : les moteurs de recherche
          voient la liste réelle des clubs engagés. */}
      <div className="sr-only">
        <h2>Ligue Professionnelle 1 tunisienne 2026-2027 — les 16 clubs</h2>
        <ul>
          {TEAMS.map((t) => (
            <li key={t.id}>
              {t.name} ({t.nameAr}) — {t.city}, {t.stadium}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
