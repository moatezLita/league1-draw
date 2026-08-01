import { generateDraw } from "./draw";

/**
 * Calendrier de référence.
 *
 * Les fiches de club et le simulateur ont besoin d'un calendrier stable :
 * une page indexée par Google ne peut pas afficher des affiches différentes à
 * chaque visite. On fige donc une graine — le calendrier reste vérifiable
 * comme n'importe quel autre, il est simplement toujours le même.
 *
 * Il se rejoue à l'identique depuis l'accueil avec cette graine.
 */
export const REFERENCE_SEED = 20262027;

/** Calculé une seule fois par processus, au premier accès. */
export const REFERENCE_DRAW = generateDraw(REFERENCE_SEED);
