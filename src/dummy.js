// The scripted second player (seat b). Edit SCRIPT to try a situation; it loops.
// Each line is one of the dummy's turns:
//   attack: how many of its ready buttons it attacks with (left to right).
//   block:  how it blocks your next attack: "always" = one ready button on each attacker while it has any,
//           "never" = takes everything, a number n = blocks at most n of your attackers.
// Before its first turn it blocks by the last line.
export const SCRIPT = [
  { attack: 1, block: "always" },
  { attack: 0, block: "always" },
  { attack: 3, block: "never" },
  { attack: 2, block: 1 },
];

const line = (n) => SCRIPT[((n % SCRIPT.length) + SCRIPT.length) % SCRIPT.length];
const readyIdx = (side) => side.buttons.map((b, i) => (b.out || b.tapped ? -1 : i)).filter((i) => i >= 0);

// Its attackers this turn.
export const dummyAttack = (g) => readyIdx(g.sides.b).slice(0, line(g.dummyTurn).attack);

// Its blocks against your attack: { blockerIndex: attackerIndex }.
export function dummyBlocks(g) {
  const plan = line(g.dummyTurn - 1);
  const max = plan.block === "never" ? 0 : plan.block === "always" ? Infinity : plan.block;
  const free = readyIdx(g.sides.b), blocks = {};
  for (const ai of g.attack.attackers) {
    if (!free.length || Object.keys(blocks).length >= max) break;
    blocks[free.shift()] = ai;
  }
  return blocks;
}
