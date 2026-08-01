"use client";

import { useMemo, useState } from "react";
import { Crest } from "./Crest";
import { fixturesFor, travelFor } from "@/lib/draw";
import { MATCHDAY_DATES, formatMatchday } from "@/lib/dates";
import { nf } from "@/lib/i18n";
import { TEAMS } from "@/lib/teams";
import {
  DerbyTag,
  HomeAwayDot,
  byId,
  teamCity,
  teamName,
  teamStadium,
  type ViewProps,
} from "./shared";

export function TeamView({ result, lang, t }: ViewProps) {
  const [teamId, setTeamId] = useState(TEAMS[0].id);
  const team = byId(teamId)!;

  const fixtures = useMemo(() => fixturesFor(result.rounds, teamId), [result, teamId]);
  const km = useMemo(() => travelFor(result.rounds, teamId), [result, teamId]);
  const homeCount = fixtures.filter((f) => f.home).length;

  return (
    <div>
      {/* sélecteur d'équipe */}
      <div
        className="no-print grid grid-cols-4 gap-1.5 sm:grid-cols-8"
        role="tablist"
        aria-label={t.chooseTeam}
      >
        {TEAMS.map((x) => {
          const on = x.id === teamId;
          return (
            <button
              key={x.id}
              role="tab"
              aria-selected={on}
              onClick={() => setTeamId(x.id)}
              title={teamName(x, lang)}
              className={`flex flex-col items-center gap-1 rounded-xl p-2 transition ${
                on
                  ? "bg-surface shadow-sm ring-1 ring-flag/50"
                  : "ring-1 ring-transparent hover:bg-sunken"
              }`}
            >
              <Crest team={x} size={on ? 34 : 30} />
              <span className={`text-[10px] font-semibold ${on ? "text-ink" : "text-mute"}`}>
                {x.abbr}
              </span>
            </button>
          );
        })}
      </div>

      {/* fiche club */}
      <div className="panel print-block mt-4 flex flex-wrap items-center gap-4 p-4">
        <Crest team={team} size={56} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold tracking-tight">{teamName(team, lang)}</h3>
          <p className="truncate text-xs text-mute">
            {teamStadium(team, lang)} · {teamCity(team, lang)} · {team.founded}
          </p>
        </div>
        <dl className="flex gap-5 text-center">
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-mute">{t.homeMatches}</dt>
            <dd className="font-mono text-xl font-bold tabular-nums">{nf(lang, homeCount)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-mute">{t.awayMatches}</dt>
            <dd className="font-mono text-xl font-bold tabular-nums">
              {nf(lang, fixtures.length - homeCount)}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-mute">{t.travelSeason}</dt>
            <dd className="font-mono text-xl font-bold tabular-nums">{nf(lang, km)} km</dd>
          </div>
        </dl>
      </div>

      {/* calendrier du club */}
      <ol className="mt-3 grid gap-1.5 md:grid-cols-2">
        {fixtures.map((f, i) => {
          const opp = byId(f.opponent);
          const date = MATCHDAY_DATES[f.round - 1];
          if (!opp) return null;
          return (
            <li
              key={f.round}
              className="panel lift print-block rise flex items-center gap-3 px-3 py-2"
              style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
            >
              <span className="w-8 shrink-0 font-mono text-xs text-mute tabular-nums">
                {t.roundShort}
                {f.round}
              </span>
              <HomeAwayDot home={f.home} />
              <Crest team={opp} size={24} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {teamName(opp, lang)}
              </span>
              {f.derby && <DerbyTag label={f.derby} />}
              <span className="hidden shrink-0 font-mono text-[10px] text-mute sm:inline">
                {date && formatMatchday(date, lang)}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-[11px] text-mute">
        <span className="font-semibold text-jade">D</span> = {t.home} ·{" "}
        <span className="font-semibold">E</span> = {t.away} — {t.approxDates}
      </p>
    </div>
  );
}
