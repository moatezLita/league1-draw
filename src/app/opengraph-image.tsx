import { ImageResponse } from "next/og";
import { TEAMS } from "@/lib/teams";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Tirage LP1 — calendrier Ligue 1 Tunisie 2026/2027";

/**
 * Vignette de partage, générée au build (donc servie comme un fichier statique :
 * aucun coût d'exécution). C'est elle qui s'affiche sur WhatsApp, Facebook et X.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1a0206 0%, #06070a 45%, #06070a 100%)",
          padding: 64,
          color: "#eef1f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#e70013",
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            1
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 22, fontWeight: 700 }}>Ligue Professionnelle 1</span>
            <span style={{ fontSize: 18, color: "#99a1ad" }}>Saison 2026 · 2027</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 900, lineHeight: 1.05 }}>
            Le calendrier tiré au sort
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 900, lineHeight: 1.05, color: "#ff3b46" }}>
            en moins de 50 millisecondes.
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#99a1ad", marginTop: 8 }}>
            16 clubs · 30 journées · 240 matchs · 0 conflit · gratuit et vérifiable
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {TEAMS.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 62,
                height: 62,
                borderRadius: 10,
                background: t.colors.primary,
                color: t.colors.text,
                border: "2px solid rgba(255,255,255,0.22)",
                fontSize: t.abbr.length > 3 ? 15 : 19,
                fontWeight: 800,
              }}
            >
              {t.abbr}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
