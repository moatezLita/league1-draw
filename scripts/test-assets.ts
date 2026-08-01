/* Vérifie les écussons : chaque club référencé a bien son fichier, et le
   contenu réel correspond à l'extension.

   Motif : un thumbnail Wikimedia d'un SVG s'appelle « …svg.png » et contient
   du PNG. Enregistré en « .svg », le navigateur reçoit un Content-Type
   image/svg+xml pour des octets PNG et n'affiche rien — en silence. */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { TEAMS } from "../src/lib/teams";

const dir = join(process.cwd(), "public", "logos");

/** Signature réelle du fichier, d'après ses premiers octets. */
function realFormat(file: string): string {
  const b = readFileSync(file).subarray(0, 5);
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "gif";
  const head = b.toString("utf8").trim().toLowerCase();
  if (head.startsWith("<svg") || head.startsWith("<?xml")) return "svg";
  return "inconnu";
}

let bad = 0;
let withLogo = 0;

for (const t of TEAMS) {
  if (!t.logo) {
    console.log(`${t.abbr.padEnd(5)} écusson généré (aucun fichier) — OK`);
    continue;
  }
  withLogo++;
  const file = join(process.cwd(), "public", t.logo.replace(/^\//, ""));
  if (!existsSync(file)) {
    console.log(`${t.abbr.padEnd(5)} MANQUANT : ${t.logo}`);
    bad++;
    continue;
  }
  const ext = t.logo.split(".").pop()!.toLowerCase();
  const real = realFormat(file);
  const okExt = ext === real || (ext === "jpeg" && real === "jpg");
  const ko = Math.round(readFileSync(file).length / 1024);
  console.log(
    `${t.abbr.padEnd(5)} ${t.logo.padEnd(22)} ${String(ko).padStart(3)} Ko  ` +
      (okExt ? "OK" : `INCOHÉRENT : extension .${ext} mais contenu ${real}`),
  );
  if (!okExt) bad++;
}

// Fichiers présents mais référencés par personne
const referenced = new Set(TEAMS.map((t) => t.logo?.split("/").pop()).filter(Boolean));
for (const f of readdirSync(dir)) {
  if (!referenced.has(f)) {
    console.log(`orphelin : public/logos/${f} n'est référencé par aucun club`);
    bad++;
  }
}

console.log(`\n${withLogo}/${TEAMS.length} clubs avec écusson officiel`);
console.log(bad === 0 ? "Écussons : OK" : `Écussons : ${bad} problème(s)`);
process.exit(bad === 0 ? 0 : 1);
