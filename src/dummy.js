// The scripted second player (seat b). Edit SCRIPT to try a situation; it loops.
// Each line is one of the dummy's turns:
//   attack: how many of its ready buttons it attacks with (left to right), at most the turn's limit (g.limit).
//   take:   how it places your next attack on its buttons:
//           "spread" = one point at a time across its buttons, untapped ones first (so they hit back),
//           "focus"  = fills one button before the next, tapped ones first (sacrifices a button that can't hit back).
// Before its first turn it places by the last line.
import { life, toPlace } from "./rules.js";

export const SCRIPT = [
  { attack: 1, take: "spread" },
  { attack: 0, take: "spread" },
  { attack: 2, take: "focus" },
  { attack: 2, take: "focus" },
];

const line = (n) => SCRIPT[((n % SCRIPT.length) + SCRIPT.length) % SCRIPT.length];
const readyIdx = (side) => side.buttons.map((b, i) => (b.out || b.tapped || b.sick ? -1 : i)).filter((i) => i >= 0);

// Its attackers this turn.
export const dummyAttack = (g) => readyIdx(g.sides.b).slice(0, Math.min(line(g.dummyTurn).attack, g.limit));

// How it places your attack: { buttonIndex: damage }.
export function dummyPlace(g) {
  const plan = line(g.dummyTurn - 1), bs = g.sides.b.buttons;
  const alive = bs.map((b, i) => i).filter((i) => !bs[i].out);
  const order = alive.sort((x, y) => (bs[x].tapped - bs[y].tapped) * (plan.take === "focus" ? -1 : 1));
  const split = {};
  let left = toPlace(g);
  const room = (i) => life(bs[i]) - (split[i] ?? 0);
  if (plan.take === "focus") {
    for (const i of order) { const d = Math.min(left, room(i)); if (d) { split[i] = d; left -= d; } }
  } else {
    while (left > 0) for (const i of order) if (left > 0 && room(i) > 0) { split[i] = (split[i] ?? 0) + 1; left--; }
  }
  return split;
}
