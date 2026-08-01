/**
 * Moteur de tirage — 100 % côté navigateur.
 *
 * Principe
 * ────────
 * 1. On part d'une table de Berger (méthode du cercle) : elle garantit
 *    mathématiquement un championnat aller complet, avec le nombre MINIMAL de
 *    « breaks » (deux réceptions ou deux déplacements de suite).
 * 2. Le hasard n'agit que sur l'affectation des 16 clubs aux 16 positions de
 *    cette table — 16! ≈ 2 × 10¹³ calendriers possibles. La structure, donc
 *    l'équité, est préservée quelle que soit la graine tirée.
 * 3. Une recherche locale (descente la plus profonde + relances) explore ces
 *    permutations pour éliminer les conflits durs (stade partagé, agglomération
 *    saturée, affiche en ouverture) et minimiser les pénalités souples.
 * 4. Le retour rejoue l'aller à l'envers, domicile et extérieur permutés : la
 *    jonction J15 → J16 ne peut donc jamais créer de troisième réception.
 *
 * Tout tient en quelques millisecondes, sans serveur, et n'importe qui peut
 * rejouer un tirage à partir de sa seule graine.
 */

import { DERBIES, TEAMS, distanceKm, type Team } from "./teams";
import { mulberry32, shuffle } from "./rng";

export interface Match {
  /** journée, 1-indexée */
  round: number;
  home: string;
  away: string;
  /** libellé d'affiche lorsque la rencontre est un derby ou un classico */
  derby?: string;
}

export interface DrawOptions {
  /** nombre maximal de clubs d'une même agglomération recevant la même journée */
  maxSameMetroHome: number;
  /** interdire une affiche majeure lors de la 1re et de la dernière journée */
  protectOpeningAndFinale: boolean;
  /** budget de calcul en ms — l'optimisation s'arrête net à l'échéance */
  timeBudgetMs: number;
  /** structure du retour */
  secondLeg: "reverse" | "mirror";
}

export const DEFAULT_OPTIONS: DrawOptions = {
  maxSameMetroHome: 4,
  protectOpeningAndFinale: true,
  timeBudgetMs: 22,
  secondLeg: "reverse",
};

export interface Violation {
  code: string;
  severity: "hard" | "soft";
  round?: number;
  message: string;
}

export interface DrawResult {
  seed: number;
  matches: Match[];
  rounds: Match[][];
  options: DrawOptions;
  stats: {
    computeMs: number;
    /** nombre de calendriers complets évalués */
    iterations: number;
    restarts: number;
    hardViolations: number;
    softCost: number;
    breaks: number;
    maxRun: number;
    longestTrip: number;
    totalTravelKm: number;
  };
}

/* ────────────────────────────── Table de Berger ───────────────────────────── */

/**
 * Championnat aller canonique pour n équipes (n pair).
 * Renvoie n-1 journées de n/2 rencontres exprimées en POSITIONS (0…n-1).
 * Le nombre de breaks obtenu est le minimum théorique : n-2.
 */
export function bergerRounds(n: number): Array<Array<[number, number]>> {
  const m = n - 1;
  const rounds: Array<Array<[number, number]>> = [];
  for (let r = 0; r < m; r++) {
    const round: Array<[number, number]> = [];
    // la position fixe (m) affronte la position r, en alternant strictement
    round.push(r % 2 === 0 ? [m, r] : [r, m]);
    for (let i = 1; i < n / 2; i++) {
      const a = (r + i) % m;
      const b = (r - i + m) % m;
      round.push(i % 2 === 0 ? [a, b] : [b, a]);
    }
    rounds.push(round);
  }
  return rounds;
}

/** Aller + retour : 2(n-1) journées. */
function fullSeason(
  n: number,
  mode: DrawOptions["secondLeg"],
): Array<Array<[number, number]>> {
  const first = bergerRounds(n);
  const m = first.length;
  const second: Array<Array<[number, number]>> = [];
  for (let r = 0; r < m; r++) {
    // "reverse" : la J16 rejoue la J15 inversée → jamais 3 réceptions à la
    //             charnière aller/retour.
    // "mirror"  : la J16 rejoue la J1 inversée (système classique).
    const src = mode === "reverse" ? first[m - 1 - r] : first[r];
    second.push(src.map(([h, a]) => [a, h] as [number, number]));
  }
  return [...first, ...second];
}

/* ─────────────────────────── Données précalculées ─────────────────────────── */

const N = TEAMS.length;
const HALF = N / 2;

const IDX: Record<string, number> = Object.fromEntries(
  TEAMS.map((t, i) => [t.id, i]),
);

const VENUE_IDS = [...new Set(TEAMS.map((t) => t.venue))];
const METRO_IDS = [...new Set(TEAMS.map((t) => t.metro))];
const VENUE_OF = Int8Array.from(TEAMS.map((t) => VENUE_IDS.indexOf(t.venue)));
const METRO_OF = Int8Array.from(TEAMS.map((t) => METRO_IDS.indexOf(t.metro)));

/** matrice des distances (km), aplatie pour la boucle chaude */
const DIST = new Int32Array(N * N);
TEAMS.forEach((a: Team, i) =>
  TEAMS.forEach((b: Team, j) => {
    DIST[i * N + j] = Math.round(distanceKm(a, b));
  }),
);

/** niveau d'affiche par paire d'équipes (0 = match ordinaire) */
const TIER = new Uint8Array(N * N);
const DERBY_LABEL = new Map<number, string>();
for (const d of DERBIES) {
  const a = IDX[d.a];
  const b = IDX[d.b];
  if (a === undefined || b === undefined) continue;
  TIER[a * N + b] = d.tier;
  TIER[b * N + a] = d.tier;
  DERBY_LABEL.set(a < b ? a * N + b : b * N + a, d.label);
}

const pairKey = (a: number, b: number) => (a < b ? a * N + b : b * N + a);

/** au-delà de cette distance, on évite d'enchaîner deux déplacements */
const LONG_TRIP_KM = 280;

/**
 * Structure du calendrier en « positions ». Elle ne dépend pas des clubs :
 * qui reçoit à quelle journée est figé, seule l'étiquette change. C'est ce qui
 * rend l'évaluation d'une permutation aussi rapide.
 */
interface Structure {
  rounds: number;
  homeSlot: Int8Array; // [r * HALF + k]
  awaySlot: Int8Array;
  oppOf: Int8Array; // [slot * rounds + r]
  isHome: Uint8Array;
  /** séries de 3+ réceptions/déplacements inhérentes à la structure */
  structuralHard: number;
  breaks: number;
}

function buildStructure(mode: DrawOptions["secondLeg"]): Structure {
  const season = fullSeason(N, mode);
  const R = season.length;
  const homeSlot = new Int8Array(R * HALF);
  const awaySlot = new Int8Array(R * HALF);
  const oppOf = new Int8Array(N * R);
  const isHome = new Uint8Array(N * R);

  for (let r = 0; r < R; r++) {
    season[r].forEach(([h, a], k) => {
      homeSlot[r * HALF + k] = h;
      awaySlot[r * HALF + k] = a;
      oppOf[h * R + r] = a;
      oppOf[a * R + r] = h;
      isHome[h * R + r] = 1;
    });
  }

  let structuralHard = 0;
  let breaks = 0;
  for (let s = 0; s < N; s++) {
    let run = 1;
    for (let r = 1; r < R; r++) {
      if (isHome[s * R + r] === isHome[s * R + r - 1]) {
        run++;
        breaks++;
        if (run > 2) structuralHard++;
      } else run = 1;
    }
  }
  return { rounds: R, homeSlot, awaySlot, oppOf, isHome, structuralHard, breaks };
}

const STRUCTURES: Record<DrawOptions["secondLeg"], Structure> = {
  reverse: buildStructure("reverse"),
  mirror: buildStructure("mirror"),
};

/* ──────────────────────────────── Évaluation ──────────────────────────────── */

/**
 * Fabrique un évaluateur sans allocation dans la boucle chaude.
 * `score()` renvoie `conflitsDurs × 100000 + pénalitésSouples` — une seule
 * valeur, pour que la recherche locale reste triviale.
 */
function makeEvaluator(opts: DrawOptions) {
  const st = STRUCTURES[opts.secondLeg];
  const R = st.rounds;
  const { homeSlot, awaySlot, oppOf, isHome } = st;
  const cap = opts.maxSameMetroHome;
  const protect = opts.protectOpeningAndFinale;

  // compteurs « estampillés » : pas de remise à zéro entre les journées
  const venueStamp = new Int32Array(VENUE_IDS.length).fill(-1);
  const venueCount = new Int32Array(VENUE_IDS.length);
  const metroStamp = new Int32Array(METRO_IDS.length).fill(-1);
  const metroCount = new Int32Array(METRO_IDS.length);
  let gen = 0;

  let lastHard = 0;
  let lastSoft = 0;

  function score(map: Int8Array): number {
    let hard = st.structuralHard;
    let soft = 0;

    for (let r = 0; r < R; r++) {
      gen++;
      let tier1 = 0;
      const edge = protect && (r === 0 || r === R - 1);

      for (let k = 0; k < HALF; k++) {
        const h = map[homeSlot[r * HALF + k]];
        const a = map[awaySlot[r * HALF + k]];

        // un stade ne peut pas accueillir deux matchs la même journée
        const v = VENUE_OF[h];
        if (venueStamp[v] === gen) {
          venueCount[v]++;
          hard++;
        } else {
          venueStamp[v] = gen;
          venueCount[v] = 1;
        }

        // saturation d'une agglomération : sécurité, transports, ordre public
        const mm = METRO_OF[h];
        if (metroStamp[mm] === gen) {
          const c = ++metroCount[mm];
          if (c > cap) hard++;
          else if (c === cap) soft += 6;
        } else {
          metroStamp[mm] = gen;
          metroCount[mm] = 1;
        }

        if (TIER[h * N + a] === 1) {
          tier1++;
          if (edge) hard++;
        }
      }
      // deux affiches majeures la même journée : désastre pour la diffusion
      if (tier1 > 1) soft += 40 * (tier1 - 1);
    }

    // contraintes propres à chaque club, parcourues en « positions »
    for (let s = 0; s < N; s++) {
      const t = map[s];
      const base = s * R;
      let prevDerby = -10;
      let prevTrip = 0;
      for (let r = 0; r < R; r++) {
        const o = map[oppOf[base + r]];
        if (TIER[t * N + o] !== 0) {
          const gap = r - prevDerby;
          if (gap <= 2) soft += 25;
          else if (gap <= 3) soft += 8;
          prevDerby = r;
        }
        if (isHome[base + r] === 0) {
          const trip = DIST[t * N + o];
          if (trip > LONG_TRIP_KM && prevTrip > LONG_TRIP_KM) soft += 12;
          prevTrip = trip;
        } else {
          prevTrip = 0;
        }
      }
    }

    lastHard = hard;
    lastSoft = soft;
    return hard * 100000 + soft;
  }

  return {
    score,
    structure: st,
    detail: () => ({ hard: lastHard, soft: lastSoft }),
  };
}

/* ─────────────────────────────── Optimisation ─────────────────────────────── */

function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

export function generateDraw(
  seed: number,
  userOptions: Partial<DrawOptions> = {},
): DrawResult {
  const opts: DrawOptions = { ...DEFAULT_OPTIONS, ...userOptions };
  const t0 = now();
  const rng = mulberry32(seed);
  const { score, structure } = makeEvaluator(opts);
  const R = structure.rounds;

  const current = new Int8Array(N);
  const best = new Int8Array(N);
  let bestScore = Infinity;
  let iterations = 0;
  let restarts = 0;

  const softDeadline = t0 + opts.timeBudgetMs;
  // Rallonge de secours, utilisée UNIQUEMENT s'il reste un conflit dur : sur un
  // appareil lent, mieux vaut un calendrier juste qu'un calendrier rapide. Sur
  // un poste normal la boucle sort bien avant, au budget nominal.
  const hardDeadline = t0 + Math.max(opts.timeBudgetMs * 6, 150);

  const setRandom = () => {
    const perm = shuffle(rng, [...Array(N).keys()]);
    for (let k = 0; k < N; k++) current[k] = perm[k];
  };

  do {
    restarts++;
    setRandom();
    let cur = score(current);
    iterations++;

    // descente la plus profonde : on teste les 120 échanges possibles et on
    // applique le meilleur, jusqu'à ce qu'aucun n'améliore le calendrier.
    for (;;) {
      let bi = -1;
      let bj = -1;
      let bs = cur;
      for (let i = 0; i < N - 1; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = current[i];
          current[i] = current[j];
          current[j] = a;
          const s = score(current);
          iterations++;
          const b = current[i];
          current[i] = current[j];
          current[j] = b;
          if (s < bs) {
            bs = s;
            bi = i;
            bj = j;
          }
        }
      }
      if (bi < 0) break;
      const a = current[bi];
      current[bi] = current[bj];
      current[bj] = a;
      cur = bs;
      if (now() >= hardDeadline) break;
    }

    if (cur < bestScore) {
      bestScore = cur;
      best.set(current);
    }

    const t = now();
    if (t >= hardDeadline) break;
    // On s'arrête dès qu'il ne reste plus que les conflits inhérents à la
    // structure choisie (zéro avec le retour inversé) : insister ne servirait
    // à rien, aucune permutation ne peut les faire disparaître.
    if (t >= softDeadline && bestScore < (structure.structuralHard + 1) * 100000) break;
  } while (true);

  // score final recalculé sur la meilleure permutation retenue
  const evaluator = makeEvaluator(opts);
  evaluator.score(best);
  const final = evaluator.detail();

  const rounds: Match[][] = [];
  const matches: Match[] = [];
  for (let r = 0; r < R; r++) {
    const round: Match[] = [];
    for (let k = 0; k < HALF; k++) {
      const h = best[structure.homeSlot[r * HALF + k]];
      const a = best[structure.awaySlot[r * HALF + k]];
      const m: Match = { round: r + 1, home: TEAMS[h].id, away: TEAMS[a].id };
      const label = DERBY_LABEL.get(pairKey(h, a));
      if (label) m.derby = label;
      round.push(m);
    }
    // affiches en tête pour l'affichage
    round.sort((x, y) => (y.derby ? 1 : 0) - (x.derby ? 1 : 0));
    rounds.push(round);
    matches.push(...round);
  }

  return {
    seed,
    matches,
    rounds,
    options: opts,
    stats: {
      computeMs: now() - t0,
      iterations,
      restarts,
      hardViolations: final.hard,
      softCost: final.soft,
      ...scheduleMetrics(rounds),
    },
  };
}

/* ───────────────────────── Vérification indépendante ──────────────────────── */

export interface Check {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
}

/**
 * Ré-audite un calendrier SANS rien supposer du générateur : ni table de
 * Berger, ni permutation, uniquement la liste des matchs produite. C'est ce
 * contrôle-là qui est affiché à l'utilisateur — si le moteur trichait, il le
 * dirait.
 */
export function verifySchedule(
  rounds: Match[][],
  opts: DrawOptions,
): { checks: Check[]; violations: Violation[] } {
  const violations: Violation[] = [];
  const nRounds = rounds.length;
  const played = new Map<string, number>();
  const homeCount = new Map<string, number>();
  const awayCount = new Map<string, number>();
  const perTeam = new Map<string, Array<"H" | "A">>();
  for (const t of TEAMS) perTeam.set(t.id, []);

  let roundsWellFormed = nRounds === (N - 1) * 2;

  for (let r = 0; r < nRounds; r++) {
    const seen = new Set<string>();
    const round = rounds[r];
    if (round.length !== HALF) roundsWellFormed = false;
    for (const m of round) {
      if (seen.has(m.home) || seen.has(m.away)) {
        roundsWellFormed = false;
        violations.push({
          code: "double-booking",
          severity: "hard",
          round: r + 1,
          message: `J${r + 1} : une équipe est programmée deux fois.`,
        });
      }
      if (m.home === m.away) roundsWellFormed = false;
      seen.add(m.home);
      seen.add(m.away);
      const key = `${m.home}>${m.away}`;
      played.set(key, (played.get(key) ?? 0) + 1);
      homeCount.set(m.home, (homeCount.get(m.home) ?? 0) + 1);
      awayCount.set(m.away, (awayCount.get(m.away) ?? 0) + 1);
      perTeam.get(m.home)?.push("H");
      perTeam.get(m.away)?.push("A");
    }
    if (seen.size !== N) roundsWellFormed = false;
  }

  // 1. chaque paire se rencontre exactement deux fois, une fois chez chacun
  let allPairsOk = true;
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const ti = TEAMS[i].id;
      const tj = TEAMS[j].id;
      if ((played.get(`${ti}>${tj}`) ?? 0) !== 1 || (played.get(`${tj}>${ti}`) ?? 0) !== 1) {
        allPairsOk = false;
        violations.push({
          code: "pair-imbalance",
          severity: "hard",
          message: `${TEAMS[i].name} / ${TEAMS[j].name} : double confrontation non respectée.`,
        });
      }
    }
  }

  // 2. équilibre réceptions / déplacements
  let balanceOk = true;
  for (const t of TEAMS) {
    const h = homeCount.get(t.id) ?? 0;
    const a = awayCount.get(t.id) ?? 0;
    if (h !== nRounds / 2 || a !== nRounds / 2) {
      balanceOk = false;
      violations.push({
        code: "home-away-balance",
        severity: "hard",
        message: `${t.name} : ${h} réceptions / ${a} déplacements.`,
      });
    }
  }

  // 3. séries de réceptions ou de déplacements
  let maxRun = 1;
  let breaks = 0;
  for (const t of TEAMS) {
    const seq = perTeam.get(t.id) ?? [];
    let run = 1;
    for (let r = 1; r < seq.length; r++) {
      if (seq[r] === seq[r - 1]) {
        run++;
        breaks++;
        if (run > maxRun) maxRun = run;
        if (run > 2) {
          violations.push({
            code: "long-run",
            severity: "hard",
            round: r + 1,
            message: `${t.name} : ${run} ${seq[r] === "H" ? "réceptions" : "déplacements"} de suite (J${r - run + 2} à J${r + 1}).`,
          });
        }
      } else run = 1;
    }
  }

  // 4. stades partagés et saturation d'une agglomération
  let venueOk = true;
  let metroOk = true;
  for (let r = 0; r < nRounds; r++) {
    const venues = new Map<string, string[]>();
    const metros = new Map<string, string[]>();
    for (const m of rounds[r]) {
      const t = TEAMS[IDX[m.home]];
      if (!t) continue;
      venues.set(t.stadium, [...(venues.get(t.stadium) ?? []), t.name]);
      metros.set(t.metro, [...(metros.get(t.metro) ?? []), t.name]);
    }
    for (const [v, list] of venues) {
      if (list.length > 1) {
        venueOk = false;
        violations.push({
          code: "shared-venue",
          severity: "hard",
          round: r + 1,
          message: `J${r + 1} : ${list.join(" et ")} reçoivent au même endroit (${v}).`,
        });
      }
    }
    for (const [mm, list] of metros) {
      if (list.length > opts.maxSameMetroHome) {
        metroOk = false;
        violations.push({
          code: "metro-overload",
          severity: "hard",
          round: r + 1,
          message: `J${r + 1} : ${list.length} réceptions simultanées à ${mm}.`,
        });
      }
    }
  }

  // 5. ouverture / clôture protégées
  let openingOk = true;
  if (opts.protectOpeningAndFinale && nRounds > 1) {
    for (const r of [0, nRounds - 1]) {
      for (const m of rounds[r]) {
        if (TIER[IDX[m.home] * N + IDX[m.away]] === 1) {
          openingOk = false;
          violations.push({
            code: "derby-edge",
            severity: "hard",
            round: r + 1,
            message: `J${r + 1} : affiche majeure (${m.derby}) en ouverture ou en clôture.`,
          });
        }
      }
    }
  }

  const checks: Check[] = [
    {
      id: "structure",
      label: "30 journées de 8 matchs, les 16 clubs engagés à chaque journée",
      ok: roundsWellFormed,
      detail: `${nRounds} journées · ${nRounds * HALF} matchs`,
    },
    {
      id: "pairs",
      label: "Chaque club affronte les 15 autres, une fois chez lui, une fois chez l'adversaire",
      ok: allPairsOk,
      detail: `${(N * (N - 1)) / 2} doubles confrontations vérifiées`,
    },
    {
      id: "balance",
      label: "15 réceptions et 15 déplacements pour tout le monde",
      ok: balanceOk,
      detail: "aucun club avantagé",
    },
    {
      id: "runs",
      label: "Jamais 3 réceptions ni 3 déplacements consécutifs",
      ok: maxRun <= 2,
      detail: `série maximale : ${maxRun} · ${breaks} breaks au total`,
    },
    {
      id: "venue",
      label: "Aucun stade partagé occupé deux fois la même journée",
      ok: venueOk,
      detail: "Radès : l'Espérance et le Club Africain alternent",
    },
    {
      id: "metro",
      label: `Au plus ${opts.maxSameMetroHome} réceptions simultanées par agglomération`,
      ok: metroOk,
      detail: "sécurité, transport, ordre public",
    },
    {
      id: "opening",
      label: "Aucune affiche majeure en ouverture ni en clôture",
      ok: openingOk,
      detail: opts.protectOpeningAndFinale ? "J1 et J30 protégées" : "contrainte désactivée",
    },
  ];

  return { checks, violations };
}

/* ──────────────────────────────── Statistiques ────────────────────────────── */

export function scheduleMetrics(rounds: Match[][]) {
  let breaks = 0;
  let maxRun = 1;
  let longestTrip = 0;
  let totalTravelKm = 0;
  const seq = new Map<string, Array<"H" | "A">>();
  for (const t of TEAMS) seq.set(t.id, []);

  for (const round of rounds) {
    for (const m of round) {
      seq.get(m.home)?.push("H");
      seq.get(m.away)?.push("A");
      const d = DIST[IDX[m.away] * N + IDX[m.home]];
      totalTravelKm += d * 2; // aller-retour du club visiteur
      if (d > longestTrip) longestTrip = d;
    }
  }
  for (const s of seq.values()) {
    let run = 1;
    for (let i = 1; i < s.length; i++) {
      if (s[i] === s[i - 1]) {
        run++;
        breaks++;
        if (run > maxRun) maxRun = run;
      } else run = 1;
    }
  }
  return { breaks, maxRun, longestTrip, totalTravelKm };
}

export interface Fixture {
  round: number;
  opponent: string;
  home: boolean;
  derby?: string;
}

/** Le calendrier d'un club, dans l'ordre des journées. */
export function fixturesFor(rounds: Match[][], teamId: string): Fixture[] {
  const out: Fixture[] = [];
  for (const round of rounds) {
    for (const m of round) {
      if (m.home === teamId)
        out.push({ round: m.round, opponent: m.away, home: true, derby: m.derby });
      else if (m.away === teamId)
        out.push({ round: m.round, opponent: m.home, home: false, derby: m.derby });
    }
  }
  return out.sort((a, b) => a.round - b.round);
}

/** Distance parcourue par un club sur la saison (aller-retour de chaque déplacement). */
export function travelFor(rounds: Match[][], teamId: string): number {
  let km = 0;
  const i = IDX[teamId];
  for (const round of rounds) {
    for (const m of round) {
      if (m.away === teamId) km += DIST[i * N + IDX[m.home]] * 2;
    }
  }
  return km;
}

export { pairKey, IDX as TEAM_INDEX, DIST as DISTANCE_MATRIX, N as TEAM_COUNT };
