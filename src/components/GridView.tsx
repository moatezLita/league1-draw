"use client";

import { useMemo, useState } from "react";
import { Crest } from "./Crest";
import { TEAMS } from "@/lib/teams";
import { teamName, type ViewProps } from "./shared";

/**
 * Grille des confrontations : ligne = club recevant, colonne = club visiteur.
 * La cellule donne la journée du match aller — et son survol met en évidence
 * la ligne et la colonne, ce qui rend la table lisible sur 16 × 16.
 */
export function GridView({ result, lang, t }: ViewProps) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  const cell = useMemo(() => {
    const map = new Map<string, { round: number; derby?: string }>();
    for (const m of result.matches) map.set(`${m.home}>${m.away}`, { round: m.round, derby: m.derby });
    return map;
  }, [result]);

  return (
    <div>
      <div className="panel overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <caption className="sr-only">{t.gridLegend}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky start-0 z-10 bg-surface p-2 text-xs text-mute">
                <span className="sr-only">{t.home}</span>
                <span aria-hidden>D ╲ E</span>
              </th>
              {TEAMS.map((a, c) => (
                <th
                  key={a.id}
                  scope="col"
                  title={teamName(a, lang)}
                  className={`p-1.5 transition ${hover?.c === c ? "bg-sunken" : ""}`}
                >
                  <Crest team={a} size={22} className="mx-auto" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEAMS.map((h, r) => (
              <tr key={h.id} className={hover?.r === r ? "bg-sunken/70" : ""}>
                <th
                  scope="row"
                  title={teamName(h, lang)}
                  className="sticky start-0 z-10 bg-surface p-1.5 text-start"
                >
                  <span className="flex items-center gap-1.5">
                    <Crest team={h} size={22} />
                    <span className="hidden text-[11px] font-semibold sm:inline">{h.abbr}</span>
                  </span>
                </th>
                {TEAMS.map((a, c) => {
                  if (h.id === a.id)
                    return (
                      <td key={a.id} className="bg-sunken p-1.5">
                        <span aria-hidden className="text-mute">
                          —
                        </span>
                      </td>
                    );
                  const info = cell.get(`${h.id}>${a.id}`);
                  return (
                    <td
                      key={a.id}
                      onMouseEnter={() => setHover({ r, c })}
                      onMouseLeave={() => setHover(null)}
                      className={`p-1.5 font-mono text-[11px] tabular-nums transition ${
                        info?.derby ? "font-bold text-gold" : "text-ink/75"
                      } ${hover?.c === c ? "bg-sunken" : ""}`}
                      title={`${teamName(h, lang)} – ${teamName(a, lang)} · ${t.round} ${info?.round}`}
                    >
                      {info?.round ?? "?"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-mute">{t.gridLegend}</p>
    </div>
  );
}
