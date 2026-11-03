// The rules, with no Cloudflare in them, so tests can run them directly.
// Seats are "a" and "b". A side has hp and 3 buttons; a button is tapped (used) or untapped (ready).
// Your turn: all your buttons untap, then you may tap ready buttons to hit, one at a time.
// Each hit gives the other side a moment to tap one of its ready buttons to block it.
// A button only untaps at the start of its own side's turn, so hitting with it means it can't block next turn.
export const HP = 5;
export const BLOCK_MS = 4000;

export const other = (seat) => (seat === "a" ? "b" : "a");

export function newGame(buttonsA, buttonsB) {
  const side = (list) => ({ hp: HP, buttons: list.map((b) => ({ ...b, tapped: false })) });
  return { turn: "a", sides: { a: side(buttonsA), b: side(buttonsB) }, pending: null, winner: null, log: ["a's turn"] };
}

const ready = (side, i) => side.buttons[i] && !side.buttons[i].tapped;

// seat taps button i to hit. Returns an error string or null.
export function hit(g, seat, i) {
  if (g.winner) return "The game is over.";
  if (g.turn !== seat) return "Not your turn.";
  if (g.pending) return "Wait for the block.";
  if (!ready(g.sides[seat], i)) return "That button is tapped.";
  g.sides[seat].buttons[i].tapped = true;
  g.pending = { by: seat, button: i };
  g.log.push(`${seat} hits with ${g.sides[seat].buttons[i].name}`);
  return null;
}

// The defender answers a pending hit: block with button i, or i = null to take it.
export function answer(g, seat, i) {
  if (!g.pending || g.pending.by === seat) return "Nothing to block.";
  const def = g.sides[seat];
  if (i !== null) {
    if (!ready(def, i)) return "That button is tapped.";
    def.buttons[i].tapped = true;
    g.log.push(`${seat} blocks with ${def.buttons[i].name}`);
  } else {
    def.hp -= 1;
    g.log.push(`${seat} takes 1 (hp ${def.hp})`);
    if (def.hp <= 0) { g.winner = other(seat); g.log.push(`${g.winner} wins`); }
  }
  g.pending = null;
  return null;
}

export function endTurn(g, seat) {
  if (g.winner) return "The game is over.";
  if (g.turn !== seat) return "Not your turn.";
  if (g.pending) return "Wait for the block.";
  g.turn = other(seat);
  for (const b of g.sides[g.turn].buttons) b.tapped = false;
  g.log.push(`${g.turn}'s turn`);
  return null;
}
