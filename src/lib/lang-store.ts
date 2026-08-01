import { isLang, type Lang } from "./i18n";

/**
 * Langue choisie par le visiteur, conservée d'une page à l'autre.
 *
 * L'URL reste la source de vérité quand elle porte `?lang=`. Mais les pages
 * éditoriales sont en français et n'emportent pas ce paramètre : sans mémoire,
 * un visiteur arabophone repassait au français dès qu'il revenait à l'accueil.
 *
 * C'est un système extérieur à React : on le lit avec `useSyncExternalStore`,
 * et on n'écrit que depuis un gestionnaire d'événement.
 */
const KEY = "lp1-lang";
const listeners = new Set<() => void>();

export function subscribeLang(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(KEY);
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

/** Le serveur ne sait rien du visiteur : il rend la langue par défaut. */
export const readStoredLangOnServer = (): Lang | null => null;

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* navigation privée : la langue vaut alors pour la page courante */
  }
  for (const fn of listeners) fn();
}
