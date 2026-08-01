import type { DrawResult, Match } from "./draw";
import { MATCHDAY_DATES } from "./dates";
import { TEAM_BY_ID } from "./teams";
import { encodeSeed } from "./rng";

const ymd = (d: Date) =>
  `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

function download(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // laisse le temps au navigateur de démarrer le téléchargement
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const csvCell = (v: string) => (/[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function toCsv(result: DrawResult, teamId?: string): string {
  const header = [
    "journee",
    "date",
    "domicile",
    "exterieur",
    "stade",
    "ville",
    "affiche",
  ];
  const lines = [header.join(";")];
  for (const m of result.matches) {
    if (teamId && m.home !== teamId && m.away !== teamId) continue;
    const home = TEAM_BY_ID[m.home];
    const away = TEAM_BY_ID[m.away];
    if (!home || !away) continue;
    lines.push(
      [
        String(m.round),
        MATCHDAY_DATES[m.round - 1]?.toISOString().slice(0, 10) ?? "",
        home.name,
        away.name,
        home.stadium,
        home.city,
        m.derby ?? "",
      ]
        .map(csvCell)
        .join(";"),
    );
  }
  return "﻿" + lines.join("\r\n"); // BOM : Excel ouvre l'UTF-8 correctement
}

export function downloadCsv(result: DrawResult, teamId?: string) {
  const suffix = teamId ? `-${teamId}` : "";
  download(
    `ligue1-2026-2027-${encodeSeed(result.seed)}${suffix}.csv`,
    "text/csv",
    toCsv(result, teamId),
  );
}

/** Échappement iCalendar (RFC 5545). */
const ics = (v: string) => v.replace(/[\\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");

export function toIcs(result: DrawResult, teamId?: string): string {
  const stamp = ymd(new Date()) + "T000000Z";
  const out = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//tirage-lp1//Ligue Professionnelle 1 2026-2027//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${ics("Ligue 1 Tunisie 2026-2027" + (teamId ? " — " + (TEAM_BY_ID[teamId]?.name ?? "") : ""))}`,
  ];
  let n = 0;
  for (const m of result.matches) {
    if (teamId && m.home !== teamId && m.away !== teamId) continue;
    const home = TEAM_BY_ID[m.home];
    const away = TEAM_BY_ID[m.away];
    const date = MATCHDAY_DATES[m.round - 1];
    if (!home || !away || !date) continue;
    const end = new Date(date);
    end.setUTCDate(end.getUTCDate() + 2); // week-end de match
    out.push(
      "BEGIN:VEVENT",
      `UID:${result.seed}-${m.round}-${m.home}-${m.away}@tirage-lp1`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(date)}`,
      `DTEND;VALUE=DATE:${ymd(end)}`,
      `SUMMARY:${ics(`${home.name} – ${away.name}`)}`,
      `LOCATION:${ics(`${home.stadium}, ${home.city}`)}`,
      `DESCRIPTION:${ics(`Journée ${m.round}${m.derby ? " · " + m.derby : ""} — date indicative`)}`,
      "END:VEVENT",
    );
    n++;
  }
  out.push("END:VCALENDAR");
  return n ? out.join("\r\n") : "";
}

export function downloadIcs(result: DrawResult, teamId?: string) {
  const suffix = teamId ? `-${teamId}` : "";
  download(
    `ligue1-2026-2027-${encodeSeed(result.seed)}${suffix}.ics`,
    "text/calendar",
    toIcs(result, teamId),
  );
}

export function matchLabel(m: Match): string {
  return `${TEAM_BY_ID[m.home]?.name ?? m.home} – ${TEAM_BY_ID[m.away]?.name ?? m.away}`;
}
