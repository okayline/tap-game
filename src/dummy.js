// The scripted second player (seat b). Edit SCRIPT to try a situation; it loops.
// Each line is one of the dummy's turns:
//   attack: how many of its ready buttons it attacks with (left to right), at most the turn's limit (g.limit).
// How it places your pings isn't scripted: it reads the board (dummyPlace, below).
import { life, toPlace, fxOf, place } from "./rules.js";

export const SCRIPT = [
  { attack: 1 },
  { attack: 0 },
  { attack: 2 },
  { attack: 2 },
];

const line = (n) => SCRIPT[((n % SCRIPT.length) + SCRIPT.length) % SCRIPT.length];
const readyIdx = (side) => side.buttons.map((b, i) => (b.out || b.tapped || b.phased || fxOf(b) === "readonly" || (b.sick && fxOf(b) !== "broadband") ? -1 : i)).filter((i) => i >= 0);

// Its attackers this turn (it exerts every one that has Exert: index.js).
export const dummyAttack = (g) => readyIdx(g.sides.b).slice(0, Math.min(line(g.dummyTurn).attack, g.limit));
// Where each of its Prodigal Proxies among idxs zaps: your field button with the least life left (the first, if tied)
export function dummyZap(g, idxs) {
  const yours = g.sides.a.buttons.map((b, i) => [b, i]).filter(([b]) => !b.out && !b.phased).sort(([x], [y]) => life(x) - life(y));
  return yours.length ? Object.fromEntries(idxs.filter((i) => fxOf(g.sides.b.buttons[i]) === "proxy").map((i) => [i, yours[0][1]])) : {};
}

// What a side has left: 10 for each button still in, on the field or in the deck, plus its life left.
const worth = (s) => [...s.buttons, ...(s.deck ?? [])].reduce((n, b) => n + (b.out ? 0 : 10 + life(b)), 0);

// How it places your attack: { attackerIndex: { buttonIndex: damage } }. It tries every legal placement on a copy of the match with
// the game's own place(), so hit-back, Lag Spike, Virus, Backup and the rest count, and keeps the one that leaves its side best off
// against yours (worth: buttons still in first, then life). It looks one ping ahead only: not at swaps or your next turn.
// (kura, Nov 5: it used to place by a scripted "spread" or "focus".)
export function dummyPlace(g) {
  const bs = g.sides.b.buttons, att = g.sides[g.attack.by].buttons, atts = g.attack.attackers, total = toPlace(g);
  const room = bs.map((b) => (b.out || b.phased ? 0 : life(b)));
  const cells = atts.flatMap((a) => bs.map((_, i) => [a, i])).filter(([, i]) => room[i] > 0);
  let best = null, top = -Infinity;
  const split = {}, left = Object.fromEntries(atts.map((a) => [a, att[a].power])), used = bs.map(() => 0);
  const go = (k, rest) => {
    if (k === cells.length) {
      if (rest) return;
      const c = { ...g, log: [], attack: structuredClone(g.attack), sides: structuredClone(g.sides) };
      const s = JSON.parse(JSON.stringify(split));
      if (place(c, "b", s)) return;   // an error: not a legal placement
      const v = worth(c.sides.b) - worth(c.sides.a);
      if (v > top) { top = v; best = s; }
      return;
    }
    const [a, i] = cells[k];
    for (let d = Math.min(rest, left[a], room[i] - used[i]); d >= 0; d--) {
      if (d) (split[a] ??= {})[i] = d;
      left[a] -= d; used[i] += d;
      go(k + 1, rest - d);
      left[a] += d; used[i] -= d;
      if (d) { delete split[a][i]; if (!Object.keys(split[a]).length) delete split[a]; }
    }
  };
  go(0, total);
  return best ?? {};
}
