/* Banc d'essai du document imprimable : il est rendu côté client uniquement,
   donc invisible dans le HTML servi. On le rend ici hors navigateur pour
   vérifier qu'il contient bien la totalité du calendrier. */
import { renderToStaticMarkup } from "react-dom/server";
import { PrintSheet } from "../src/components/PrintSheet";
import { generateDraw } from "../src/lib/draw";
import { T } from "../src/lib/i18n";

const result = generateDraw(123456, undefined);
const html = renderToStaticMarkup(<PrintSheet result={result} lang="fr" t={T.fr} />);

const count = (re: RegExp) => (html.match(re) ?? []).length;

const rounds = count(/class="print-round"/g);
const rows = count(/class="print-home"/g);
const hasHead = /class="print-head"/.test(html);
const hasCols = /class="print-cols"/.test(html);
const hasFoot = /class="print-foot"/.test(html);

// Chaque nom de club doit apparaître 30 fois : 30 journées, un match par club.
const est = count(/Espérance Sportive de Tunis/g);
const ca = count(/Club Africain/g);

console.log("journées rendues     :", rounds, rounds === 30 ? "OK" : "ATTENDU 30");
console.log("lignes de match      :", rows, rows === 240 ? "OK" : "ATTENDU 240");
console.log("en-tête / colonnes / pied :", hasHead, hasCols, hasFoot);
console.log("EST présent 30 fois  :", est, est === 30 ? "OK" : "ATTENDU 30");
console.log("CA présent 30 fois   :", ca, ca === 30 ? "OK" : "ATTENDU 30");
console.log("taille du document   :", Math.round(html.length / 1024), "Ko");

const ok = rounds === 30 && rows === 240 && hasHead && hasCols && hasFoot && est === 30 && ca === 30;
console.log(ok ? "\nDocument imprimable : COMPLET" : "\nDocument imprimable : INCOMPLET");
process.exit(ok ? 0 : 1);
