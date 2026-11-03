// The rules, with no Cloudflare in them, so tests can run them directly.
// Seats are "a" and "b". A side has hp and 3 buttons. A button is untapped (ready) or tapped, and alive or out of the match.
// Your turn: your buttons untap; you pick any number of ready buttons to attack and press attack (they tap).
// The other side then has a moment to block: each of its ready buttons may block one attacker (blocking doesn't tap).
// Fights: a blocked attacker and its blockers deal their power to each other; a button that takes damage equal to
// its toughness or more is out of the match. An unblocked attacker deals its power to the other side's hp.
// A button only untaps at the start of its own side's turn, so attacking with it means it can't block next turn.
export const HP = 5;
export const BLOCK_MS = 6000;

// power / toughness by type: the more buttons of a type exist, the weaker it is (kura, Nov 2: counts from the live
// item table, all active 88x31 buttons: neon 32, guestbook 21, construction 19, counter 17, webring 13, divider 5).
export const STATS = {
  neon: [1, 1],
  guestbook: [1, 2],
  construction: [1, 2],
  counter: [2, 2],
  webring: [3, 1],
  divider: [3, 2],
};

export const other = (seat) => (seat === "a" ? "b" : "a");

export function newGame(buttonsA, buttonsB) {
  const side = (list) => ({
    hp: HP,
    buttons: list.map((b) => {
      const [power, toughness] = STATS[b.type] ?? [1, 1];
      return { ...b, power, toughness, tapped: false, out: false };
    }),
  });
  return { turn: "a", sides: { a: side(buttonsA), b: side(buttonsB) }, attack: null, winner: null, log: ["a's turn"] };
}

const ready = (side, i) => side.buttons[i] && !side.buttons[i].out && !side.buttons[i].tapped;

// seat attacks with the buttons at idxs (may be empty, which just passes the turn). Returns an error string or null.
export function attack(g, seat, idxs) {
  if (g.winner) return "The game is over.";
  if (g.turn !== seat || g.attack) return "Not your turn.";
  const list = [...new Set(idxs)];
  if (!list.every((i) => ready(g.sides[seat], i))) return "Only ready buttons can attack.";
  if (!list.length) { g.log.push(`${seat} doesn't attack`); passTurn(g); return null; }
  for (const i of list) g.sides[seat].buttons[i].tapped = true;
  g.attack = { by: seat, attackers: list };
  g.log.push(`${seat} attacks with ${list.map((i) => g.sides[seat].buttons[i].name).join(", ")}`);
  return null;
}

// The defender answers: blocks is { blockerIndex: attackerIndex }. An empty object takes everything.
export function block(g, seat, blocks) {
  if (!g.attack || g.attack.by === seat) return "Nothing to block.";
  const by = g.attack.by, att = g.sides[by], def = g.sides[seat];
  const on = new Map(); // attacker -> its blockers, in the order given
  for (const [k, v] of Object.entries(blocks)) {
    const bi = Number(k), ai = Number(v);
    if (!ready(def, bi)) return "Only ready buttons can block.";
    if (!g.attack.attackers.includes(ai)) return "That button isn't attacking.";
    on.set(ai, [...(on.get(ai) ?? []), bi]);
  }
  for (const ai of g.attack.attackers) {
    const a = att.buttons[ai], blockers = on.get(ai) ?? [];
    if (!blockers.length) {
      def.hp -= a.power;
      g.log.push(`${a.name} hits ${seat} for ${a.power} (hp ${def.hp})`);
      continue;
    }
    // the attacker spreads its power over its blockers in order; they all hit it back
    let left = a.power, back = 0;
    for (const bi of blockers) {
      const b = def.buttons[bi];
      const dealt = Math.min(left, b.toughness);
      left -= dealt;
      back += b.power;
      g.log.push(`${b.name} blocks ${a.name}`);
      if (dealt >= b.toughness) { b.out = true; g.log.push(`${b.name} is out`); }
    }
    if (back >= a.toughness) { a.out = true; g.log.push(`${a.name} is out`); }
  }
  g.attack = null;
  if (def.hp <= 0) { g.winner = by; g.log.push(`${by} wins`); return null; }
  passTurn(g);
  return null;
}

function passTurn(g) {
  g.turn = other(g.turn);
  for (const b of g.sides[g.turn].buttons) b.tapped = false;
  g.log.push(`${g.turn}'s turn`);
}
