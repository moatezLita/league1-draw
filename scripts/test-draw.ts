/* Banc d'essai du moteur : correction, contraintes, performance. */
import { generateDraw, verifySchedule, bergerRounds } from "../src/lib/draw";
import { TEAMS } from "../src/lib/teams";

// 1) la table de Berger seule est-elle bien un round-robin minimal ?
{
  const n = 16;
  const rounds = bergerRounds(n);
  const seen = new Set<string>();
  let breaks = 0;
  let maxRun = 1;
  const seq: string[][] = Array.from({ length: n }, () => []);
  for (const r of rounds) {
    const used = new Set<number>();
    for (const [h, a] of r) {
      if (used.has(h) || used.has(a)) throw new Error("doublon dans une journée");
      used.add(h);
      used.add(a);
      const key = h < a ? `${h}-${a}` : `${a}-${h}`;
      if (seen.has(key)) throw new Error("paire répétée: " + key);
      seen.add(key);
      seq[h].push("H");
      seq[a].push("A");
    }
    if (used.size !== n) throw new Error("journée incomplète");
  }
  for (const s of seq) {
    let run = 1;
    for (let i = 1; i < s.length; i++) {
      if (s[i] === s[i - 1]) { run++; breaks++; maxRun = Math.max(maxRun, run); }
      else run = 1;
    }
  }
  console.log(`Berger 16: ${rounds.length} journées, ${seen.size} paires, ${breaks} breaks (min théorique ${n - 2}), série max ${maxRun}`);
  if (seen.size !== (n * (n - 1)) / 2) throw new Error("round-robin incomplet");
}

// 2) 300 tirages : contraintes dures + temps de calcul
const times: number[] = [];
const iters: number[] = [];
let failures = 0;
const failureCodes = new Map<string, number>();

for (let s = 0; s < 300; s++) {
  const res = generateDraw(s * 7919 + 13);
  times.push(res.stats.computeMs);
  iters.push(res.stats.iterations);
  const { violations } = verifySchedule(res.rounds, res.options);
  const hard = violations.filter((v) => v.severity === "hard");
  if (hard.length) {
    failures++;
    for (const v of hard) failureCodes.set(v.code, (failureCodes.get(v.code) ?? 0) + 1);
    if (failures <= 3) console.log("  ↳ échec seed", res.seed, hard.slice(0, 4).map((v) => v.message));
  }
  if (res.stats.hardViolations !== hard.length) {
    console.log(`  ⚠ désaccord moteur/vérificateur (seed ${res.seed}): ${res.stats.hardViolations} vs ${hard.length}`);
  }
}

times.sort((a, b) => a - b);
const p = (q: number) => times[Math.floor(times.length * q)].toFixed(2);
console.log(`\n300 tirages — médiane ${p(0.5)} ms · p95 ${p(0.95)} ms · max ${times[times.length - 1].toFixed(2)} ms`);
console.log(`itérations médianes : ${iters.sort((a, b) => a - b)[150]}`);
console.log(`tirages avec conflit dur : ${failures}/300`);
if (failureCodes.size) console.log("codes :", Object.fromEntries(failureCodes));

// 3) un tirage détaillé
const demo = generateDraw(20262027);
const { checks } = verifySchedule(demo.rounds, demo.options);
console.log("\n— Tirage démo (seed 20262027) —");
for (const c of checks) console.log(`  ${c.ok ? "✔" : "�’✘"} ${c.label} (${c.detail})`);
console.log("  stats:", demo.stats);
console.log("  J1:", demo.rounds[0].map((m) => `${m.home}-${m.away}`).join(" "));
console.log("  J30:", demo.rounds[29].map((m) => `${m.home}-${m.away}`).join(" "));

// 4) déterminisme
const a1 = generateDraw(42);
const a2 = generateDraw(42);
console.log("\nDéterminisme :", JSON.stringify(a1.matches) === JSON.stringify(a2.matches) ? "OK" : "ÉCHEC");

// 5) diversité : deux graines proches donnent-elles des calendriers différents ?
const d1 = generateDraw(1);
const d2 = generateDraw(2);
const same = d1.matches.filter((m, i) => m.home === d2.matches[i].home && m.away === d2.matches[i].away).length;
console.log(`Diversité : ${same}/${d1.matches.length} matchs identiques entre seed 1 et seed 2`);
console.log(`Clubs chargés : ${TEAMS.length}`);
