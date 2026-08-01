# Tirage au sort — Ligue Professionnelle 1 (2026/2027)

Générateur de calendrier pour la Ligue Professionnelle 1 tunisienne : **16 clubs, 30 journées, 240 matchs**, calculés **entièrement dans le navigateur** en ~25 ms, sans serveur, sans base de données, sans coût.

Chaque visiteur peut générer un calendrier complet, vérifier lui-même qu'il respecte toutes les contraintes, et partager le résultat exact par un simple lien.

---

## Pourquoi

Le tirage du 29 juillet 2026 organisé par la FTF a été contesté publiquement : erreurs manuelles, opacité, coûts. Ce projet montre qu'un calendrier équilibré et sans conflit se calcule instantanément, gratuitement, et surtout de façon **vérifiable par n'importe qui**.

Le principe : le résultat n'est pas à croire, il est à contrôler. L'onglet **Audit** rejoue toutes les vérifications sous vos yeux.

---

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # build de production
npm run lint
```

Aucune variable d'environnement, aucun service externe.

---

## Comment le tirage fonctionne

1. **Structure de base — tables de Berger.** La méthode classique du round-robin, qui garantit que chaque club rencontre les 15 autres une fois à l'aller. Elle minimise aussi les *breaks* (deux réceptions ou deux déplacements consécutifs) : 28 pour 30 journées, ce qui est le minimum théorique.

2. **Retour inversé (`reverse`).** La J16 rejoue la J15 à l'envers, et ainsi de suite. C'est la **seule** structure qui empêche un club d'enchaîner trois réceptions à la charnière aller/retour — le retour « miroir » classique (J16 = J1) en produit toujours au moins une. Ce n'est pas une opinion : `scripts/test-options.ts` le mesure, le miroir échoue sur 60/60 tirages.

3. **Attribution aléatoire des clubs**, à partir d'une graine (*seed*) — un générateur déterministe, pas `Math.random()`.

4. **Optimisation sous budget de temps** (22 ms par défaut) : recherche locale qui réduit les coûts souples — déplacements, affiches sensibles, équilibre — et s'arrête net à l'échéance pour que l'expérience reste instantanée sur mobile.

5. **Vérification indépendante.** `verifySchedule()` relit le calendrier produit *sans rien savoir* de la façon dont il a été construit, et recontrôle chaque règle depuis zéro. C'est ce que l'onglet Audit affiche.

### Contraintes garanties (dures)

- Chaque paire de clubs se rencontre exactement deux fois, une fois chez chacun
- Un club joue une seule fois par journée
- Deux clubs partageant le même stade ne reçoivent jamais le même jour
- Jamais plus de 3 réceptions ou 3 déplacements consécutifs
- Plafond de matchs simultanés dans une même agglomération (réglable, 3 à 6)

**Mesuré sur 300 tirages : 0 violation dure, médiane 25 ms.**

### Réglages exposés

| Réglage | Valeurs | Défaut |
|---|---|---|
| Matchs simultanés dans une même ville | 3 – 6 | 4 |
| Protéger la 1re et la dernière journée des affiches majeures | oui / non | oui |

> Le plafond à 2 a été retiré de l'interface : il est **structurellement infaisable** avec la densité du Grand Tunis (60/60 échecs). Mieux vaut ne pas proposer un bouton qui ne peut pas fonctionner.

---

## Fonctionnalités

- **Console plein écran** : l'application tient dans la fenêtre. L'en-tête, les mesures et les onglets sont fixes, seule la zone de contenu défile — lancer un tirage ne renvoie jamais « plus bas dans la page »
- **4 vues** : par journée, par club (calendrier + distance parcourue), grille 16×16, et audit complet
- **Navigation au clavier** : `←` et `→` font défiler les 30 journées
- **3 langues** : français, العربية (RTL complet), English
- **Export** : CSV, ICS (agenda), et un vrai document imprimable / PDF (voir plus bas)
- **Partage** : l'URL contient la graine et les options, donc un lien reproduit **exactement** le même calendrier chez tout le monde
- **Écussons officiels** pour 15 clubs sur 16, avec repli automatique sur un écusson vectoriel généré
- **Déterministe** : même graine = même calendrier, toujours. Graines différentes = calendriers différents (4 matchs identiques sur 240 entre deux graines)

### Les pages du site

| Page | Contenu |
|---|---|
| `/` | Présentation, puis la console de tirage |
| `/clubs` | Les 16 clubs, groupés par région |
| `/clubs/[slug]` | Fiche par club : identité, stade, kilomètres, calendrier complet — 16 pages prérendues |
| `/carte` | Les clubs sur la carte de Tunisie + classement des distances |
| `/simulateur` | Choisir le vainqueur des 240 matchs, classement en direct |
| `/palmares` | Titres par club et 25 dernières saisons |
| `/quiz` | Reconnaître les écussons |

Toutes ces pages sont statiques : rien n'est calculé à l'exécution, l'hébergement reste gratuit. Le site est aussi installable (manifeste web).

Les pages autres que l'accueil sont en français uniquement — c'est la langue de recherche dominante pour le football tunisien, et cela évite de tripler des URLs indexées pour du contenu identique.

### Impression et PDF

Le bouton « Imprimer / PDF » ne met pas la page à l'échelle : il produit un **document distinct**, rendu par [`PrintSheet.tsx`](src/components/PrintSheet.tsx) — les 30 journées sur deux colonnes, en-tête avec la graine, environ 4 pages A4. L'interface (en-tête, onglets, boutons) est entièrement masquée à l'impression.

Pour un PDF : Imprimer → *Enregistrer au format PDF*.

### Paramètres d'URL

| Param | Rôle |
|---|---|
| `s` | graine du tirage |
| `m` | plafond de matchs par agglomération (3–6) |
| `p` | `0` pour désactiver la protection 1re/dernière journée |
| `lang` | `fr`, `ar`, `en` |

---

## Tests

```bash
npx tsx scripts/test-draw.ts      # 300 tirages : conflits, breaks, temps, déterminisme
npx tsx scripts/test-options.ts   # balayage de toutes les combinaisons de réglages
npx tsx scripts/test-print.tsx    # le document imprimable contient bien 30 journées / 240 matchs
npx tsx scripts/test-assets.ts    # écussons : fichier présent, format réel = extension, aucun orphelin
```

Le second script est celui qui a révélé les deux pièges corrigés plus haut (miroir et plafond à 2). Il vaut la peine de le relancer après toute modification du moteur.

---

## Corriger les données des clubs

**`src/lib/teams.ts` est la seule source de vérité.** Nom, nom arabe, ville, stade, couleurs, coordonnées GPS, agglomération : tout est là.

### Écussons

15 clubs sur 16 ont leur écusson officiel dans [`public/logos/`](public/logos/) (redimensionnés à 128 px, ~273 Ko au total, chargés en différé). La table `LOGOS` en bas de `teams.ts` associe l'identifiant du club au fichier. Le **PS Sakiet Eddaïer** n'a pas de source exploitable : il utilise l'écusson vectoriel généré à partir de ses couleurs — c'est précisément à quoi sert ce repli, et rien ne casse.

Pour en ajouter ou en remplacer un : déposer le fichier dans `public/logos/` et l'inscrire dans `LOGOS`.

> Ces emblèmes appartiennent aux clubs et sont repris ici à seule fin d'identification. Sources : Wikipédia FR/EN. Pour une exploitation commerciale, vérifiez les droits auprès des clubs.

Composition 2026/2027 retenue :
- **Relégués en LP2** : JS Kairouan, AS Soliman, AS Gabès
- **Promus de LP2** : ES Hammam Sousse, PS Sakiet Eddaïer, CS Hammam Lif (barrage)

Si la FTF publie une composition différente, corriger ce fichier suffit — rien d'autre dans le code ne dépend de la liste.

---

## Déploiement

Conçu pour le plan gratuit de Vercel : tout le calcul est côté client, le serveur ne fait que servir des fichiers statiques.

```bash
npx vercel
```

Aucune configuration, aucune fonction serverless, aucun quota à surveiller.

---

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · aucune dépendance d'exécution supplémentaire.

---

## Auteur

**Moatez Litaiem** — développeur full-stack.

- E-mail : [moatezlitaiem@gmail.com](mailto:moatezlitaiem@gmail.com)
- GitHub : [@moatezLita](https://github.com/moatezLita)
- Dépôt : [github.com/moatezLita/league1-draw](https://github.com/moatezLita/league1-draw)

Coordonnées centralisées dans [`src/lib/site.ts`](src/lib/site.ts) : la page d'accueil, les métadonnées de partage et le pied de page y puisent tous.
