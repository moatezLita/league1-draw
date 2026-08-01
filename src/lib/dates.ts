/**
 * Dates indicatives des journées.
 *
 * Le calendrier réel dépend des trêves internationales, des compétitions
 * africaines et de la Coupe de Tunisie. On produit ici une trame hebdomadaire
 * cohérente — clairement présentée comme indicative dans l'interface — pour que
 * l'export agenda (.ics) et l'affichage restent utiles.
 */

/** Coup d'envoi de la saison 2026-2027 : samedi 22 août 2026. */
export const SEASON_START = new Date(Date.UTC(2026, 7, 22));

/**
 * Semaines sans championnat, exprimées « après la journée n ».
 * Trêves FIFA, trêve hivernale et fenêtre CAF.
 */
const BREAKS: Record<number, number> = {
  4: 1, // trêve internationale de septembre
  8: 1, // trêve internationale d'octobre
  12: 1, // trêve internationale de novembre
  15: 3, // trêve hivernale
  20: 1, // fenêtre CAF
  26: 1, // trêve internationale de mars
};

export function matchdayDates(count = 30): Date[] {
  const out: Date[] = [];
  let week = 0;
  for (let r = 1; r <= count; r++) {
    const d = new Date(SEASON_START);
    d.setUTCDate(d.getUTCDate() + week * 7);
    out.push(d);
    week += 1 + (BREAKS[r] ?? 0);
  }
  return out;
}

export const MATCHDAY_DATES = matchdayDates(30);

const LOCALES: Record<string, string> = { fr: "fr-FR", ar: "ar-TN", en: "en-GB" };

export function formatMatchday(date: Date, lang: string, long = false): string {
  const locale = LOCALES[lang] ?? "fr-FR";
  return new Intl.DateTimeFormat(locale, {
    weekday: long ? "long" : undefined,
    day: "numeric",
    month: long ? "long" : "short",
    year: long ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(date);
}

/** Fenêtre du week-end : les matchs se jouent le samedi ou le dimanche. */
export function weekendRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setUTCHours(14, 0, 0, 0);
  const end = new Date(date);
  end.setUTCDate(end.getUTCDate() + 1);
  end.setUTCHours(20, 0, 0, 0);
  return { start, end };
}
