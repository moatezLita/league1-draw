/* Faisabilité des réglages proposés dans l'interface. */
import { generateDraw, verifySchedule, type DrawOptions } from "../src/lib/draw";

const combos: Array<Partial<DrawOptions>> = [];
for (const secondLeg of ["reverse", "mirror"] as const)
  for (const maxSameMetroHome of [2, 3, 4, 5, 6])
    for (const protectOpeningAndFinale of [true, false])
      combos.push({ secondLeg, maxSameMetroHome, protectOpeningAndFinale });

console.log("leg      cap  protect  échecs/60   temps méd.  codes");
for (const c of combos) {
  let fail = 0;
  const times: number[] = [];
  const codes = new Map<string, number>();
  for (let s = 0; s < 60; s++) {
    const res = generateDraw(s * 104729 + 7, c);
    times.push(res.stats.computeMs);
    const hard = verifySchedule(res.rounds, res.options).violations.filter(
      (v) => v.severity === "hard",
    );
    if (hard.length) {
      fail++;
      for (const v of hard) codes.set(v.code, (codes.get(v.code) ?? 0) + 1);
    }
  }
  times.sort((a, b) => a - b);
  console.log(
    `${c.secondLeg!.padEnd(8)} ${String(c.maxSameMetroHome).padEnd(4)} ${String(c.protectOpeningAndFinale).padEnd(8)} ${String(fail).padStart(3)}/60      ${times[30].toFixed(1).padStart(6)} ms  ${[...codes.keys()].join(",")}`,
  );
}
