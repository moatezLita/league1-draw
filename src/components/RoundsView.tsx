"use client";

import { useEffect, useRef, useState } from "react";
import { MATCHDAY_DATES, formatMatchday } from "@/lib/dates";
import { DerbyTag, MatchLine, byId, teamCity, teamStadium, type ViewProps } from "./shared";

export function RoundsView({ result, lang, t }: ViewProps) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const total = result.rounds.length;

  // garde la pastille sélectionnée visible dans le ruban
  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>(`[data-md="${active}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  /**
   * Flèches du clavier : parcourir 30 journées à la souris est fastidieux, et
   * c'est le geste attendu quand chaque journée occupe un écran. On ignore la
   * frappe si l'utilisateur est en train de saisir la graine.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) return;
      if (e.key === "ArrowLeft") setActive((r) => Math.max(0, r - 1));
      else if (e.key === "ArrowRight") setActive((r) => Math.min(total - 1, r + 1));
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const round = result.rounds[active];
  const date = MATCHDAY_DATES[active];

  return (
    <div>
      {/* ruban des journées */}
      <div className="no-print flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActive((r) => Math.max(0, r - 1))}
          disabled={active === 0}
          aria-label="Journée précédente"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-mute shadow-sm transition hover:text-ink disabled:opacity-30 sm:flex rtl:rotate-180"
        >
          ‹
        </button>

        <div
          ref={stripRef}
          role="tablist"
          aria-label={t.round}
          className="flex flex-1 gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {result.rounds.map((r, i) => {
            const hasDerby = r.some((m) => m.derby);
            const selected = i === active;
            return (
              <button
                key={i}
                data-md={i}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={`relative shrink-0 rounded-lg px-3 py-2 text-xs font-semibold tabular-nums transition ${
                  selected
                    ? "bg-flag text-white shadow-md shadow-flag/25"
                    : "bg-surface text-mute ring-1 ring-line hover:bg-sunken hover:text-ink"
                }`}
              >
                {t.roundShort}
                {i + 1}
                {hasDerby && (
                  <span
                    className={`absolute end-1 top-1 h-1.5 w-1.5 rounded-full ${selected ? "bg-white" : "bg-gold"}`}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setActive((r) => Math.min(total - 1, r + 1))}
          disabled={active === total - 1}
          aria-label="Journée suivante"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-mute shadow-sm transition hover:text-ink disabled:opacity-30 sm:flex rtl:rotate-180"
        >
          ›
        </button>
      </div>

      {/* en-tête de journée */}
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-bold tracking-tight">
          {t.round} {active + 1}
          <span className="ms-2 text-sm font-medium text-mute">
            · {active < total / 2 ? t.firstLeg : t.secondLeg}
          </span>
        </h3>
        <p className="font-mono text-xs text-mute">{date && formatMatchday(date, lang, true)}</p>
      </div>

      {/* matchs */}
      <ul className="mt-3 grid gap-2 md:grid-cols-2">
        {round.map((m, i) => {
          const home = byId(m.home);
          return (
            <li
              key={`${m.home}-${m.away}`}
              className="panel lift print-block rise p-3 sm:p-4"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <MatchLine home={m.home} away={m.away} lang={lang} />
              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line pt-2.5">
                <p className="truncate text-[11px] text-mute">
                  {home && `${teamStadium(home, lang)} · ${teamCity(home, lang)}`}
                </p>
                {m.derby && <DerbyTag label={m.derby} />}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex flex-wrap items-center gap-x-2 text-[11px] text-mute">
        <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] shadow-sm">
          ←
        </kbd>
        <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] shadow-sm">
          →
        </kbd>
        <span>·</span>
        <span>{t.approxDates}</span>
      </p>
    </div>
  );
}
