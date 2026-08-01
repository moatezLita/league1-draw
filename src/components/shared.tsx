"use client";

import type { DrawResult } from "@/lib/draw";
import type { Dict, Lang } from "@/lib/i18n";
import { TEAM_BY_ID, type Team } from "@/lib/teams";
import { Crest } from "./Crest";

export interface ViewProps {
  result: DrawResult;
  lang: Lang;
  t: Dict;
}

export function teamName(team: Team, lang: Lang) {
  return lang === "ar" ? team.nameAr : team.name;
}

export function teamCity(team: Team, lang: Lang) {
  return lang === "ar" ? team.cityAr : team.city;
}

export function teamStadium(team: Team, lang: Lang) {
  return lang === "ar" ? team.stadiumAr : team.stadium;
}

export function byId(id: string): Team | undefined {
  return TEAM_BY_ID[id];
}

/** Puce d'affiche (derby / classico). */
export function DerbyTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold ring-1 ring-gold/30">
      <span aria-hidden>★</span>
      {label}
    </span>
  );
}

/** Ligne de match : « domicile – extérieur » avec écussons. */
export function MatchLine({
  home,
  away,
  lang,
  compact = false,
}: {
  home: string;
  away: string;
  lang: Lang;
  compact?: boolean;
}) {
  const h = byId(home);
  const a = byId(away);
  if (!h || !a) return null;
  const size = compact ? 22 : 30;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
      <div className="flex min-w-0 items-center justify-end gap-2 text-end">
        <span className="truncate text-sm font-medium sm:text-[15px]">{teamName(h, lang)}</span>
        <Crest team={h} size={size} />
      </div>
      <span className="rounded-md bg-sunken px-1.5 py-0.5 font-mono text-[11px] text-mute">
        v
      </span>
      <div className="flex min-w-0 items-center gap-2">
        <Crest team={a} size={size} />
        <span className="truncate text-sm font-medium sm:text-[15px]">{teamName(a, lang)}</span>
      </div>
    </div>
  );
}

/** Indicateur compact « reçoit / se déplace ». */
export function HomeAwayDot({ home }: { home: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
        home ? "bg-jade/12 text-jade ring-1 ring-jade/30" : "bg-sunken text-mute ring-1 ring-line"
      }`}
      aria-hidden
    >
      {home ? "D" : "E"}
    </span>
  );
}

export function statOf(result: DrawResult) {
  return result.stats;
}
