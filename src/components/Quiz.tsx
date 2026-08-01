"use client";

import { useCallback, useState } from "react";
import { TEAMS, type Team } from "@/lib/teams";
import { Crest } from "./Crest";

const ROUNDS = 10;

interface Question {
  answer: Team;
  choices: Team[];
}

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function makeQuestion(): Question {
  const [answer] = pick(TEAMS, 1);
  const others = pick(
    TEAMS.filter((t) => t.id !== answer.id),
    3,
  );
  return { answer, choices: pick([answer, ...others], 4) };
}

export function Quiz() {
  const [q, setQ] = useState<Question | null>(null);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);

  // La première question naît d'un clic, jamais du rendu : tirer au sort
  // pendant le rendu ferait diverger le HTML du serveur et celui du client.
  const start = () => {
    setScore(0);
    setStep(0);
    setChosen(null);
    setQ(makeQuestion());
  };

  const next = useCallback(() => {
    setChosen(null);
    setStep((s) => s + 1);
    setQ(makeQuestion());
  }, []);

  const answer = (id: string) => {
    if (chosen || !q) return;
    setChosen(id);
    if (id === q.answer.id) setScore((s) => s + 1);
  };

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

  if (!q) {
    return (
      <div className="panel mx-auto max-w-md p-8 text-center">
        <p className="text-sm leading-relaxed text-mute">
          Dix écussons, dix questions. Aucune limite de temps — seulement votre mémoire.
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

      <div className="mt-7 flex justify-center">
        <Crest team={q.answer} size={104} />
      </div>
      <p className="mt-4 text-sm font-semibold">Quel est ce club ?</p>

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
