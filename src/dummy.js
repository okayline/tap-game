// The scripted second player. Edit SCRIPT to try a situation; it loops.
// Each line is one of the dummy's turns:
//   hits:  how many of its ready buttons it hits with that turn (left to right).
//   block: how it answers your hits until its next turn:
//          "always" = blocks while it has a ready button, "never" = takes every hit,
//          a number n = blocks only while it would still have more than n ready buttons (keeps n back).
export const SCRIPT = [
  { hits: 1, block: "always" },
  { hits: 0, block: "always" },
  { hits: 3, block: "never" },
  { hits: 2, block: 1 },
];

export const step = (g) => SCRIPT[g.dummyTurn % SCRIPT.length];

// Which button the dummy blocks with (its first ready one), or null to take the hit.
export function dummyBlock(g, seat) {
  const plan = SCRIPT[(g.dummyTurn + SCRIPT.length - 1) % SCRIPT.length]; // the turn it last played sets its stance
  const readyIdx = g.sides[seat].buttons.map((b, i) => (b.tapped ? -1 : i)).filter((i) => i >= 0);
  if (!readyIdx.length || plan.block === "never") return null;
  if (typeof plan.block === "number" && readyIdx.length <= plan.block) return null;
  return readyIdx[0];
}
