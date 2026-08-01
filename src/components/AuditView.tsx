"use client";

import { useMemo } from "react";
import { verifySchedule } from "@/lib/draw";
import { nf } from "@/lib/i18n";
import { encodeSeed } from "@/lib/rng";
import type { ViewProps } from "./shared";

export function AuditView({ result, lang, t }: ViewProps) {
  // l'audit est refait ici, à partir de la seule liste des matchs
  const { checks, violations } = useMemo(
    () => verifySchedule(result.rounds, result.options),
    [result],
  );
  const failed = violations.filter((v) => v.severity === "hard");

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="panel print-block p-5">
        <h3 className="text-lg font-bold tracking-tight">{t.auditTitle}</h3>
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-mute">{t.auditLead}</p>

        <ul className="mt-4 divide-y divide-line">
          {checks.map((c) => (
            <li key={c.id} className="flex items-start gap-3 py-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  c.ok ? "bg-jade/12 text-jade ring-1 ring-jade/30" : "bg-flag/10 text-flag-soft ring-1 ring-flag/40"
                }`}
                aria-hidden
              >
                {c.ok ? "✓" : "✕"}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{c.label}</p>
                <p className="mt-0.5 text-xs text-mute">
                  <span className={c.ok ? "text-jade" : "text-flag-soft"}>
                    {c.ok ? t.auditPassed : t.auditFailed}
                  </span>
                  {" · "}
                  {c.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            failed.length
              ? "bg-flag/10 text-flag-soft ring-1 ring-flag/30"
              : "bg-jade/10 text-jade ring-1 ring-jade/25"
          }`}
        >
          {failed.length ? `${nf(lang, failed.length)} ${t.auditProblem}` : t.auditAllGood}
        </div>

        {failed.length > 0 && (
          <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto text-xs text-mute">
            {failed.slice(0, 40).map((v, i) => (
              <li key={i}>• {v.message}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel print-block p-5">
        <h3 className="text-lg font-bold tracking-tight">{t.aboutTitle}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-mute">{t.aboutBody}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Stat label={t.statSeed} value={encodeSeed(result.seed)} mono />
          <Stat label={t.statCompute} value={`${result.stats.computeMs.toFixed(1)} ms`} mono />
          <Stat label={t.statIterations} value={nf(lang, result.stats.iterations)} mono />
          <Stat label={t.statBreaks} value={nf(lang, result.stats.breaks)} mono />
          <Stat
            label={t.statTravel}
            value={`${nf(lang, Math.round(result.stats.totalTravelKm / 1000))} 000 km`}
            mono
          />
          <Stat
            label={t.statConflicts}
            value={result.stats.hardViolations === 0 ? t.noConflict : nf(lang, result.stats.hardViolations)}
            tone={result.stats.hardViolations === 0 ? "good" : "bad"}
          />
        </dl>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "good" | "bad";
}) {
  return (
    <div className="rounded-lg bg-sunken px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wide text-mute">{label}</dt>
      <dd
        className={`mt-0.5 truncate text-sm font-bold ${mono ? "font-mono tabular-nums" : ""} ${
          tone === "good" ? "text-jade" : tone === "bad" ? "text-flag-soft" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
