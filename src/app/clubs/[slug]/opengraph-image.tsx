import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TEAM_BY_SLUG, TEAMS } from "@/lib/teams";
import { fixturesFor, travelFor } from "@/lib/draw";
import { REFERENCE_DRAW } from "@/lib/season";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Une vignette par club, générée au build : servie comme un fichier statique. */
export function generateStaticParams() {
  return TEAMS.map((t) => ({ slug: t.slug }));
}

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = TEAM_BY_SLUG[slug];
  return [
    {
      id: "card",
      size,
      contentType,
      alt: `${team?.name ?? "Ligue 1"} — calendrier 2026-2027`,
    },
  ];
}

/**
 * Vignette de partage propre à chaque club.
 *
 * L'intérêt : un supporter partage SON club, pas un lien générique. La carte
 * porte donc l'écusson officiel — lu depuis `public/logos` au build et intégré
 * en data URI, car le moteur de rendu n'a pas accès au réseau.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = TEAM_BY_SLUG[slug];

  if (!team) {
    return new ImageResponse(<div style={{ display: "flex" }} />, size);
  }

  let logoData: string | null = null;
  if (team.logo) {
    try {
      const buf = await readFile(join(process.cwd(), "public", team.logo.replace(/^\//, "")));
      logoData = `data:image/png;base64,${buf.toString("base64")}`;
    } catch {
      // écusson absent ou illisible : on retombe sur la pastille de couleur
    }
  }

  const fixtures = fixturesFor(REFERENCE_DRAW.rounds, team.id);
  const home = fixtures.filter((f) => f.home).length;
  const km = travelFor(REFERENCE_DRAW.rounds, team.id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // Fond sombre franc plutôt qu'un dégradé teinté : le teinter aux
          // couleurs du club délavait la moitié de la carte et rendait le
          // texte secondaire illisible. La couleur du club passe par le filet
          // supérieur et le socle de l'écusson.
          background: "linear-gradient(135deg, #16181f 0%, #06070a 55%)",
          padding: 64,
          color: "#eef1f5",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 10,
            background: team.colors.primary,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#e70013",
              fontSize: 27,
              fontWeight: 900,
            }}
          >
            1
          </div>
          <span style={{ fontSize: 20, color: "#b6bdc9" }}>
            Ligue Professionnelle 1 · Saison 2026-2027
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {logoData ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 200,
                borderRadius: 28,
                background: "rgba(255,255,255,0.06)",
                border: `2px solid ${team.colors.primary}66`,
              }}
            >
              {/* `next/image` n'existe pas dans ImageResponse : le rendu est
                  fait par Satori, hors du navigateur, à partir d'un data URI. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoData} width={150} height={150} alt="" style={{ objectFit: "contain" }} />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 170,
                height: 170,
                borderRadius: 26,
                background: team.colors.primary,
                color: team.colors.text,
                border: "3px solid rgba(255,255,255,0.22)",
                fontSize: team.abbr.length > 3 ? 40 : 52,
                fontWeight: 800,
              }}
            >
              {team.abbr}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 800 }}>
            <div style={{ display: "flex", fontSize: 58, fontWeight: 900, lineHeight: 1.05 }}>
              {team.name}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#b6bdc9", marginTop: 12 }}>
              {team.stadium} · {team.city}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 56, alignItems: "flex-end" }}>
          <Metric value="30" label="journées" />
          <Metric value={String(home)} label="réceptions" />
          <Metric value={String(fixtures.length - home)} label="déplacements" />
          <Metric value={km.toLocaleString("fr-FR")} label="km parcourus" />
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              fontSize: 22,
              color: "#b6bdc9",
              alignItems: "flex-end",
            }}
          >
            calendrier complet, vérifiable, gratuit
          </div>
        </div>
      </div>
    ),
    size,
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 46, fontWeight: 900, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 19, color: "#b6bdc9", marginTop: 6 }}>{label}</span>
    </div>
  );
}
