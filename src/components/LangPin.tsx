"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { DIR } from "@/lib/i18n";

/**
 * Fixe la langue du document sur une page donnée.
 *
 * L'application de tirage écrit `lang` et `dir` sur l'élément racine, et une
 * navigation côté client ne les remet pas à zéro : après être passé en arabe
 * sur l'accueil, les pages éditoriales — pourtant en français — s'affichaient
 * de droite à gauche, en police arabe. Chaque page déclare donc sa langue.
 */
export function LangPin({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = DIR[lang];
  }, [lang]);

  return null;
}
