"use client";

import { MATCHDAY_DATES, formatMatchday } from "@/lib/dates";
import { encodeSeed } from "@/lib/rng";
import { nf } from "@/lib/i18n";
import { byId, teamCity, type ViewProps } from "./shared";

/**
 * Document imprimable.
 *
 * L'application à l'écran n'est PAS imprimable : c'est une console, avec des
 * onglets, une zone qui défile et des boutons. L'impression produit donc un
 * document séparé — les 30 journées d'un coup, sur deux colonnes — et le reste
 * de l'interface est masqué (`.screen-only` / `.print-only` dans globals.css).
 *
 * C'est aussi ce qui sort en PDF : « Imprimer → Enregistrer au format PDF ».
 */
export function PrintSheet({ result, lang, t }: ViewProps) {
  const total = result.rounds.length;

  return (
    <div className="print-only">
      <header className="print-head">
        <h1>
          {t.league} — {t.season}
        </h1>
        <p className="print-sub">
          {t.heroHint} · {t.statSeed} <strong>{encodeSeed(result.seed)}</strong> ·{" "}
          {t.statConflicts}{" "}
          <strong>
            {result.stats.hardViolations === 0
              ? t.noConflict
              : nf(lang, result.stats.hardViolations)}
          </strong>
        </p>
      </header>

      <div className="print-cols">
        {result.rounds.map((round, i) => {
          const date = MATCHDAY_DATES[i];
          return (
            <section key={i} className="print-round">
              <h2>
                {t.round} {i + 1}
                <span className="print-leg">
                  {i < total / 2 ? t.firstLeg : t.secondLeg}
                  {date ? ` · ${formatMatchday(date, lang, true)}` : ""}
                </span>
              </h2>
              <table>
                <tbody>
                  {round.map((m) => {
                    const h = byId(m.home);
                    const a = byId(m.away);
                    if (!h || !a) return null;
                    return (
                      <tr key={`${m.home}-${m.away}`}>
                        <td className="print-home">{h.name}</td>
                        <td className="print-dash">–</td>
                        <td className="print-away">{a.name}</td>
                        <td className="print-venue">{teamCity(h, lang)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>

      <footer className="print-foot">
        <p>{t.approxDates}</p>
        <p>{t.footerNote}</p>
      </footer>
    </div>
  );
}
