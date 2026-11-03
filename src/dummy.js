// The dummy (seat b) in real time: REACT_MS after one of its buttons untaps, that button hits one of yours. It prefers a
// button of yours that is tapped (so it can't hit back), and among those the one with the least life; if all of yours are
// untapped it hits the one with the least life and takes the hit back. It brings in its next deck button as soon as one goes out.
import { life, ready } from "./rules.js";

export const REACT_MS = 700; // so it isn't faster than a person (kura can change it)

// When the dummy next wants to act: the soonest moment one of its live buttons is untapped and REACT_MS has passed.
export function dummyNext(g) {
  const live = g.sides.b.buttons.filter((b) => !b.out);
  if (g.started == null || g.winner || !live.length || g.sides.a.buttons.every((b) => b.out)) return null; // nothing to hit: wait for you
  return Math.min(...live.map((b) => Math.max(b.readyAt, g.started) + REACT_MS));
}

// The dummy's move at time now: [its button, your button], or null if nothing is due.
export function dummyMove(g, now) {
  const mine = g.sides.b.buttons, yours = g.sides.a.buttons;
  const i = mine.findIndex((b) => ready(b, now) && Math.max(b.readyAt, g.started) + REACT_MS <= now);
  const targets = yours.map((b, t) => [b, t]).filter(([b]) => !b.out);
  if (i < 0 || !targets.length) return null;
  targets.sort(([x], [y]) => (ready(x, now) - ready(y, now)) || (life(x) - life(y)));
  return [i, targets[0][1]];
}
