"use client";

import { useEffect, useState } from "react";
import { SEASON_START } from "@/lib/dates";
import type { Dict } from "@/lib/i18n";

/**
 * Compte à rebours jusqu'au coup d'envoi.
 *
 * Rien n'est rendu tant que le composant n'est pas monté : l'heure du serveur
 * et celle du visiteur ne coïncident jamais exactement, et afficher une valeur
 * au rendu serveur garantirait un écart d'hydratation.
 */
export function Countdown({ t }: { t: Dict }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(SEASON_START.getTime() - Date.now());
    // Première mesure différée : mettre à jour l'état pendant le corps de
    // l'effet déclencherait un rendu en cascade.
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (left === null) return null;

  if (left <= 0) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full bg-jade/12 px-3 py-1 text-xs font-semibold text-jade ring-1 ring-jade/25">
        <span className="h-1.5 w-1.5 rounded-full bg-jade" aria-hidden />
        {t.kickoffNow}
      </p>
    );
  }

  const minutes = Math.floor(left / 60_000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  return (
    <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-mute shadow-sm">
      <span className="font-semibold">{t.kickoffIn}</span>
      <span className="font-mono font-black tabular-nums text-ink" dir="ltr">
        {days}
        {t.unitDays} {hours}
        {t.unitHours} {mins}
        {t.unitMinutes}
      </span>
    </p>
  );
}
