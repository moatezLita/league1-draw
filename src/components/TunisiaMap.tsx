"use client";

import { useState } from "react";
import Link from "next/link";
import { MAP_HEIGHT, MAP_WIDTH, TUNISIA_PATH } from "@/lib/tunisia-map";

export interface MapClub {
  id: string;
  abbr: string;
  name: string;
  city: string;
  stadium: string;
  slug: string;
  color: string;
  x: number;
  y: number;
  /** Position du marqueur, écartée du point réel si la ville est saturée. */
  mx: number;
  my: number;
  spread: boolean;
  km: number;
}

export function TunisiaMap({ clubs }: { clubs: MapClub[] }) {
  const [active, setActive] = useState<string | null>(null);
  const sel = clubs.find((c) => c.id === active) ?? null;

  const maxKm = Math.max(...clubs.map((c) => c.km));

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* ─── carte ───────────────────────────────────────────────────────── */}
      <div className="panel relative overflow-hidden p-3">
        <svg
          viewBox={`-40 -40 ${MAP_WIDTH + 80} ${MAP_HEIGHT + 80}`}
          // Le pays est très allongé : on borne la hauteur ET la largeur, sinon
          // la carte déborde en paysage sur téléphone.
          className="mx-auto block h-[62vh] max-h-180 w-auto max-w-full sm:h-[70vh]"
          role="img"
          aria-label="Carte des 16 clubs de Ligue 1 tunisienne"
        >
          <path
            d={TUNISIA_PATH}
            className="fill-sunken stroke-line-strong"
            strokeWidth={4}
            strokeLinejoin="round"
          />

          {clubs.map((c) => (
            <g key={c.id}>
              {/* trait de rappel quand le marqueur a été écarté de sa ville */}
              {c.spread && (
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={c.mx}
                  y2={c.my}
                  className="stroke-line-strong"
                  strokeWidth={2}
                />
              )}
              <circle cx={c.x} cy={c.y} r={5} className="fill-mute" />
              <g
                onMouseEnter={() => setActive(c.id)}
                onMouseLeave={() => setActive((a) => (a === c.id ? null : a))}
                onClick={() => setActive(c.id)}
                className="cursor-pointer"
              >
                {/* Pas de transition sur le rayon : un cercle qui grandit sous
                    le curseur repasse la frontière survol/non-survol pendant
                    l'animation. On marque la sélection par le contour. */}
                <circle
                  cx={c.mx}
                  cy={c.my}
                  r={26}
                  fill={c.color}
                  stroke={active === c.id ? "var(--color-ink)" : "white"}
                  strokeWidth={active === c.id ? 6 : 4}
                />
                <text
                  x={c.mx}
                  y={c.my + 6}
                  textAnchor="middle"
                  className="pointer-events-none select-none fill-white font-bold"
                  fontSize={c.abbr.length > 3 ? 13 : 16}
                >
                  {c.abbr}
                </text>
              </g>
            </g>
          ))}
        </svg>

        <p className="mt-1 text-center text-[11px] text-mute">
          Les clubs d&apos;une même agglomération sont légèrement écartés pour rester lisibles ;
          le point gris marque la ville réelle.
        </p>
      </div>

      {/* ─── panneau ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/**
         * Hauteur minimale figée. Sans elle, passer d'un état à l'autre change
         * la hauteur du panneau, ce qui décale la liste située en dessous : le
         * curseur se retrouve sur une autre ligne, la sélection change, le
         * panneau se redimensionne… et le tout clignote plusieurs fois par
         * seconde.
         */}
        <div className="panel min-h-58 p-4">
          {sel ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-mute">
                Club sélectionné
              </p>
              <h2 className="mt-1 text-lg font-black tracking-tight">{sel.name}</h2>
              <p className="mt-1 text-xs text-mute">
                {sel.stadium} · {sel.city}
              </p>
              <p className="mt-3 font-mono text-2xl font-black tabular-nums">
                {sel.km.toLocaleString("fr-FR")}
                <span className="ms-1 text-sm font-bold text-mute">km</span>
              </p>
              <p className="text-[11px] text-mute">parcourus sur la saison</p>
              <Link
                href={`/clubs/${sel.slug}`}
                className="mt-4 inline-block rounded-lg bg-flag px-4 py-2 text-xs font-bold text-white shadow-sm shadow-flag/25 transition hover:bg-flag-soft"
              >
                Voir la fiche du club
              </Link>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-mute">
              Survolez un club pour voir son stade et la distance qu&apos;il parcourt sur une
              saison complète.
            </p>
          )}
        </div>

        {/* classement des distances */}
        <div className="panel p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-mute">
            Kilomètres par saison
          </h2>
          <ul className="mt-3 space-y-1.5">
            {[...clubs]
              .sort((a, b) => b.km - a.km)
              .map((c) => (
                <li
                  key={c.id}
                  onMouseEnter={() => setActive(c.id)}
                  onMouseLeave={() => setActive((a) => (a === c.id ? null : a))}
                  className={`flex items-center gap-2 rounded-md px-1.5 py-1 transition ${
                    active === c.id ? "bg-sunken" : ""
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: c.color }}
                    aria-hidden
                  />
                  <span className="w-12 shrink-0 text-[11px] font-bold">{c.abbr}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
                    <span
                      className="block h-full rounded-full bg-flag/70"
                      style={{ width: `${(c.km / maxKm) * 100}%` }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-end font-mono text-[11px] tabular-nums text-mute">
                    {c.km.toLocaleString("fr-FR")}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
