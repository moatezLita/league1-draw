/**
 * Générateur pseudo-aléatoire déterministe (mulberry32).
 *
 * Pourquoi pas Math.random() ? Parce que la transparence est tout l'intérêt du
 * projet : une même graine (« seed ») produit exactement le même calendrier,
 * partout, pour tout le monde. N'importe qui peut donc rejouer et vérifier un
 * tirage à partir de son seul identifiant.
 */
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Entier dans [0, n) */
export function randInt(rng: Rng, n: number): number {
  return Math.floor(rng() * n) % n;
}

/** Mélange de Fisher–Yates, en place. */
export function shuffle<T>(rng: Rng, arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(rng, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans I, O, 0, 1

/** Encode une graine numérique en code court lisible à voix haute (ex. « K7P-M2QX »). */
export function encodeSeed(seed: number): string {
  let n = seed >>> 0;
  let out = "";
  for (let i = 0; i < 7; i++) {
    out = ALPHABET[n % 32] + out;
    n = Math.floor(n / 32);
  }
  return out.slice(0, 3) + "-" + out.slice(3);
}

export function decodeSeed(code: string): number | null {
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (clean.length !== 7) return null;
  let n = 0;
  for (const ch of clean) {
    const idx = ALPHABET.indexOf(ch);
    if (idx === -1) return null;
    n = n * 32 + idx;
  }
  return n >>> 0;
}

/** Graine imprévisible pour un nouveau tirage (crypto si disponible). */
export function freshSeed(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] >>> 0;
  }
  return (Math.random() * 0xffffffff) >>> 0;
}
