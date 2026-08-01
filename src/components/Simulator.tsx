"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Match } from "@/lib/draw";
import { TEAMS, TEAM_BY_ID } from "@/lib/teams";
import { Crest } from "./Crest";

type Outcome = "H" | "D" | "A";
type Results = Record<string, Outcome>;

const STORE_KEY = "lp1-simulateur-v1";
const key = (m: Match) => `${m.home}>${m.away}`;

/**
 * La grille du visiteur vit dans localStorage — un système extérieur à React.
 * On le lit donc avec `useSyncExternalStore` et on n'écrit que depuis les
 * gestionnaires d'événements : pas d'effet, pas de rendu en cascade, et le
 * rendu serveur reçoit un instantané vide (aucun écart d'hydratation).
 */
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function readSnapshot(): string {
  try {
    return localStorage.getItem(STORE_KEY) ?? "";
  } catch {
    return "";
  }
}

const EMPTY = "";
const readServerSnapshot = () => EMPTY;

function save(results: Results) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(results));
  } catch {
    /* quota ou navigation privée : la simulation marche, sans mémoire */
  }
  for (const fn of listeners) fn();
}

interface Row {
  id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

export function Simulator({ rounds }: { rounds: Match[][] }) {
  const [active, setActive] = useState(0);
  const raw = useSyncExternalStore(subscribe, readSnapshot, readServerSnapshot);

  const results = useMemo<Results>(() => {
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Results;
    } catch {
      return {};
    }
  }, [raw]);

  const table = useMemo(() => {
    const rows = new Map<string, Row>(
      TEAMS.map((t) => [t.id, { id: t.id, played: 0, won: 0, drawn: 0, lost: 0, points: 0 }]),
    );
    for (const round of rounds) {
      for (const m of round) {
        const r = results[key(m)];
        if (!r) continue;
        const h = rows.get(m.home)!;
        const a = rows.get(m.away)!;
        h.played++;
        a.played++;
        if (r === "H") {
          h.won++; h.points += 3; a.lost++;
        } else if (r === "A") {
          a.won++; a.points += 3; h.lost++;
        } else {
          h.drawn++; a.drawn++; h.points++; a.points++;
        }
      }
    }
    // Sans score, on départage aux points puis aux victoires — la différence
    // de buts n'existe pas dans ce simulateur, c'est assumé.
    return [...rows.values()].sort(
      (x, y) =>
        y.points - x.points ||
        y.won - x.won ||
        TEAM_BY_ID[x.id].name.localeCompare(TEAM_BY_ID[y.id].name),
    );
  }, [results, rounds]);

  const decided = Object.keys(results).length;
  const total = rounds.reduce((n, r) => n + r.length, 0);

  const setOutcome = (m: Match, o: Outcome) => {
    const next = { ...results };
    if (next[key(m)] === o) delete next[key(m)];
    else next[key(m)] = o;
    save(next);
  };

  const fillRandom = () => {
    const next: Results = {};
    for (const round of rounds)
      for (const m of round) {
        const r = Math.random();
        // Léger avantage au terrain, comme dans la vraie vie.
        next[key(m)] = r < 0.45 ? "H" : r < 0.72 ? "D" : "A";
      }
    save(next);
  };

  const round = rounds[active];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* ─── saisie des résultats ────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1">
            {rounds.map((r, i) => {
              const done = r.every((m) => results[key(m)]);
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold tabular-nums transition ${
                    i === active
                      ? "bg-flag text-white shadow-md shadow-flag/25"
                      : "bg-surface text-mute ring-1 ring-line hover:bg-sunken hover:text-ink"
                  }`}
                >
                  J{i + 1}
                  {done && i !== active && (
                    <span
                      className="absolute end-1 top-1 h-1.5 w-1.5 rounded-full bg-jade"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold">Journée {active + 1}</p>
          <span className="text-[11px] text-mute">
            {decided} / {total} matchs décidés
          </span>
          <span className="ms-auto flex gap-1.5">
            <button
              onClick={fillRandom}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-semibold shadow-sm transition hover:bg-sunken"
            >
              Remplir au hasard
            </button>
            <button
              onClick={() => save({})}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-semibold shadow-sm transition hover:bg-sunken"
            >
              Tout effacer
            </button>
          </span>
        </div>

        <ul className="mt-3 space-y-1.5">
          {round.map((m) => {
            const h = TEAM_BY_ID[m.home];
            const a = TEAM_BY_ID[m.away];
            const r = results[key(m)];
            if (!h || !a) return null;
            return (
              <li key={key(m)} className="panel flex items-center gap-2 p-2.5">
                <span className="flex min-w-0 flex-1 items-center justify-end gap-2 text-end">
                  <span className="truncate text-sm font-medium">{h.name}</span>
                  <Crest team={h} size={24} />
                </span>

                <span className="flex shrink-0 gap-1">
                  {(["H", "D", "A"] as Outcome[]).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOutcome(m, o)}
                      aria-pressed={r === o}
                      title={o === "H" ? "Victoire à domicile" : o === "D" ? "Match nul" : "Victoire à l'extérieur"}
                      className={`h-8 w-8 rounded-md text-xs font-bold transition ${
                        r === o
                          ? "bg-flag text-white shadow-sm"
                          : "bg-sunken text-mute hover:text-ink"
                      }`}
                    >
                      {o === "H" ? "1" : o === "D" ? "N" : "2"}
                    </button>
                  ))}
                </span>

                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <Crest team={a} size={24} />
                  <span className="truncate text-sm font-medium">{a.name}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ─── classement ──────────────────────────────────────────────────── */}
      <div className="panel h-fit p-4 lg:sticky lg:top-20">
        <h2 className="text-xs font-bold uppercase tracking-wider text-mute">Classement</h2>
        <table className="mt-3 w-full text-xs">
          <thead>
            <tr className="text-[10px] uppercase text-mute">
              <th className="w-6 text-start font-semibold">#</th>
              <th className="text-start font-semibold">Club</th>
              <th className="w-7 text-center font-semibold">J</th>
              <th className="w-7 text-center font-semibold">G</th>
              <th className="w-7 text-center font-semibold">N</th>
              <th className="w-7 text-center font-semibold">P</th>
              <th className="w-8 text-end font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => {
              const t = TEAM_BY_ID[row.id];
              return (
                <tr
                  key={row.id}
                  className={`border-t border-line ${
                    i === 0 ? "bg-jade/8" : i >= table.length - 3 ? "bg-flag/6" : ""
                  }`}
                >
                  <td className="py-1.5 font-mono tabular-nums text-mute">{i + 1}</td>
                  <td className="py-1.5">
                    <Link
                      href={`/clubs/${t.slug}`}
                      className="flex items-center gap-1.5 hover:text-flag"
                    >
                      <Crest team={t} size={16} />
                      <span className="font-semibold">{t.abbr}</span>
                    </Link>
                  </td>
                  <td className="text-center font-mono tabular-nums text-mute">{row.played}</td>
                  <td className="text-center font-mono tabular-nums text-mute">{row.won}</td>
                  <td className="text-center font-mono tabular-nums text-mute">{row.drawn}</td>
                  <td className="text-center font-mono tabular-nums text-mute">{row.lost}</td>
                  <td className="text-end font-mono font-black tabular-nums">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3 text-[10px] leading-relaxed text-mute">
          Trois points par victoire, un par nul. Sans score saisi, la différence de buts
          n&apos;existe pas : les ex æquo sont départagés aux victoires. Votre grille est
          conservée dans ce navigateur.
        </p>
      </div>
    </div>
  );
}
