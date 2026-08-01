"use client";

import { useState } from "react";
import { TEAMS, type Team } from "@/lib/teams";
import { Crest } from "./Crest";

const ROUNDS = 10;

/**
 * Quatre familles de questions.
 *
 * L'écusson n'est jamais montré avec son logo officiel : ceux-ci portent le
 * nom du club écrit dessus, la question se lisait donc directement sur
 * l'image. On n'affiche que les couleurs, et on varie avec des questions
 * tirées des données (stade, ville, fondation).
 */
type Kind = "colors" | "stadium" | "city" | "founded";

interface Question {
  kind: Kind;
  answer: Team;
  choices: Team[];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const PROMPT: Record<Kind, (t: Team) => string> = {
  colors: () => "Quel club porte ces couleurs ?",
  stadium: (t) => `Quel club reçoit au ${t.stadium} ?`,
  city: (t) => `Quel club est basé à ${t.city} ?`,
  founded: (t) => `Quel club a été fondé en ${t.founded} ?`,
};

/**
 * Signature discriminante par type de question : deux clubs qui la partagent
 * rendent la question ambiguë.
 *
 * Le cas qui a motivé ce mécanisme : l'Espérance et le Club Africain reçoivent
 * tous deux à Radès, et six clubs se réclament du Grand Tunis. « Quel club
 * reçoit au stade Hammadi Agrebi ? » avait donc deux bonnes réponses.
 */
const SIGNATURE: Record<Kind, (t: Team) => string> = {
  colors: (t) => `${t.colors.primary}|${t.colors.secondary}`,
  stadium: (t) => t.venue,
  city: (t) => t.city,
  founded: (t) => String(t.founded),
};

/** Un club ne peut être la réponse que si sa signature est unique en Ligue 1. */
function eligibleKinds(team: Team): Kind[] {
  return (Object.keys(SIGNATURE) as Kind[]).filter((kind) => {
    const sig = SIGNATURE[kind](team);
    return !TEAMS.some((other) => other.id !== team.id && SIGNATURE[kind](other) === sig);
  });
}

/**
 * Dix clubs distincts, tirés une fois pour toutes : la version initiale tirait
 * au sort à chaque question et reposait donc régulièrement le même club.
 */
export function buildQuiz(): Question[] {
  const used = new Map<Kind, number>();

  return shuffle(TEAMS)
    .slice(0, ROUNDS)
    .map((answer) => {
      // Parmi les types possibles pour ce club, on prend le moins servi :
      // les questions restent variées sans jamais devenir ambiguës.
      const kinds = eligibleKinds(answer);
      const kind = shuffle(kinds).sort(
        (a, b) => (used.get(a) ?? 0) - (used.get(b) ?? 0),
      )[0];
      used.set(kind, (used.get(kind) ?? 0) + 1);

      const sig = SIGNATURE[kind](answer);
      const pool = TEAMS.filter(
        (t) => t.id !== answer.id && SIGNATURE[kind](t) !== sig,
      );
      return { kind, answer, choices: shuffle([answer, ...shuffle(pool).slice(0, 3)]) };
    });
}

export function Quiz() {
  const [quiz, setQuiz] = useState<Question[] | null>(null);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);

  // Le tirage a lieu sur un clic, jamais pendant le rendu : le hasard ferait
  // diverger le HTML du serveur de celui du client.
  const start = () => {
    setQuiz(buildQuiz());
    setScore(0);
    setStep(0);
    setChosen(null);
  };

  const answer = (id: string) => {
    if (chosen || !quiz) return;
    setChosen(id);
    if (id === quiz[step].answer.id) setScore((s) => s + 1);
  };

  const next = () => {
    setChosen(null);
    setStep((s) => s + 1);
  };

  if (!quiz) {
    return (
      <div className="panel mx-auto max-w-md p-8 text-center">
        <p className="text-sm leading-relaxed text-mute">
          Dix questions sur les seize clubs de Ligue 1 : couleurs, stades, villes et années de
          fondation. Chaque club n&apos;apparaît qu&apos;une fois.
        </p>
        <button
          onClick={start}
          className="mt-5 rounded-xl bg-flag px-6 py-3 text-sm font-bold text-white shadow-lg shadow-flag/25 transition hover:bg-flag-soft active:scale-[0.98]"
        >
          Commencer le quiz
        </button>
      </div>
    );
  }

  if (step >= ROUNDS) {
    const verdict =
      score === ROUNDS
        ? "Sans faute — vous connaissez votre championnat."
        : score >= 7
          ? "Solide."
          : score >= 4
            ? "Peut mieux faire."
            : "Il va falloir retourner au stade.";
    return (
      <div className="panel mx-auto max-w-md p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-mute">Résultat</p>
        <p className="mt-2 font-mono text-5xl font-black tabular-nums">
          {score}
          <span className="text-2xl text-mute">/{ROUNDS}</span>
        </p>
        <p className="mt-3 text-sm text-mute">{verdict}</p>
        <button
          onClick={start}
          className="mt-6 rounded-xl bg-flag px-6 py-3 text-sm font-bold text-white shadow-lg shadow-flag/25 transition hover:bg-flag-soft active:scale-[0.98]"
        >
          Rejouer
        </button>
      </div>
    );
  }

  const q = quiz[step];

  return (
    <div className="panel mx-auto max-w-md p-6 text-center">
      <div className="flex items-center justify-between text-[11px] font-semibold text-mute">
        <span>
          Question {step + 1} / {ROUNDS}
        </span>
        <span className="font-mono tabular-nums">{score} pt</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sunken">
        <div
          className="h-full rounded-full bg-flag transition-all"
          style={{ width: `${(step / ROUNDS) * 100}%` }}
        />
      </div>

      {/* L'écusson muet n'est montré que pour la question sur les couleurs :
          ailleurs il donnerait la réponse. */}
      {q.kind === "colors" && (
        <div className="mt-7 flex justify-center">
          <Crest team={q.answer} size={104} plain />
        </div>
      )}

      <p className={`text-sm font-semibold ${q.kind === "colors" ? "mt-4" : "mt-8"}`}>
        {PROMPT[q.kind](q.answer)}
      </p>

      <ul className="mt-5 grid gap-2">
        {q.choices.map((c) => {
          const isAnswer = c.id === q.answer.id;
          const isChosen = c.id === chosen;
          return (
            <li key={c.id}>
              <button
                onClick={() => answer(c.id)}
                disabled={!!chosen}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  !chosen
                    ? "border-line bg-surface shadow-sm hover:border-line-strong hover:bg-sunken"
                    : isAnswer
                      ? "border-jade/40 bg-jade/12 text-jade"
                      : isChosen
                        ? "border-flag/40 bg-flag/10 text-flag-soft"
                        : "border-line bg-surface text-mute opacity-60"
                }`}
              >
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>

      {chosen && (
        <button
          onClick={next}
          className="mt-5 w-full rounded-xl bg-flag px-6 py-3 text-sm font-bold text-white shadow-lg shadow-flag/25 transition hover:bg-flag-soft active:scale-[0.98]"
        >
          {step + 1 === ROUNDS ? "Voir le résultat" : "Question suivante"}
        </button>
      )}
    </div>
  );
}
