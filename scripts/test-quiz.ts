/* Banc d'essai du quiz.

   Le défaut corrigé ici : la version initiale tirait un club au hasard à
   chaque question, et reposait donc régulièrement le même. On vérifie sur un
   grand nombre de parties qu'un club n'apparaît jamais deux fois, que la bonne
   réponse figure bien parmi les choix, et qu'aucune question n'admet deux
   réponses correctes. */
import { buildQuiz } from "../src/components/Quiz";
import { TEAMS } from "../src/lib/teams";

const PARTIES = 2000;
let doublons = 0;
let mauvaisChoix = 0;
let ambigues = 0;
let mauvaiseTaille = 0;
const kinds = new Map<string, number>();

for (let n = 0; n < PARTIES; n++) {
  const quiz = buildQuiz();
  if (quiz.length !== 10) mauvaiseTaille++;

  const vus = new Set<string>();
  for (const q of quiz) {
    if (vus.has(q.answer.id)) doublons++;
    vus.add(q.answer.id);

    kinds.set(q.kind, (kinds.get(q.kind) ?? 0) + 1);

    if (q.choices.length !== 4) mauvaisChoix++;
    if (new Set(q.choices.map((c) => c.id)).size !== 4) mauvaisChoix++;
    if (!q.choices.some((c) => c.id === q.answer.id)) mauvaisChoix++;

    // Aucune question ne doit admettre deux réponses correctes — ni parmi les
    // propositions, ni dans le championnat entier (un connaisseur hésiterait).
    const sig = {
      colors: (t: (typeof q.choices)[number]) => `${t.colors.primary}|${t.colors.secondary}`,
      stadium: (t: (typeof q.choices)[number]) => t.venue,
      city: (t: (typeof q.choices)[number]) => t.city,
      founded: (t: (typeof q.choices)[number]) => String(t.founded),
    }[q.kind];

    if (q.choices.filter((c) => sig(c) === sig(q.answer)).length > 1) ambigues++;
    if (TEAMS.filter((t) => sig(t) === sig(q.answer)).length > 1) ambigues++;
  }
}

console.log(`parties jouées         : ${PARTIES}`);
console.log(`clubs répétés          : ${doublons}`);
console.log(`propositions invalides : ${mauvaisChoix}`);
console.log(`questions ambiguës     : ${ambigues}`);
console.log(`parties mal formées    : ${mauvaiseTaille}`);
console.log(`répartition des types  : ${[...kinds].map(([k, v]) => `${k}=${v}`).join(" ")}`);

const ok = doublons === 0 && mauvaisChoix === 0 && ambigues === 0 && mauvaiseTaille === 0;
console.log(ok ? "\nQuiz : OK" : "\nQuiz : DÉFAUTS DÉTECTÉS");
process.exit(ok ? 0 : 1);
