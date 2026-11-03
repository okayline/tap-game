// The rules, with no Cloudflare in them, so tests can run them directly.
// Seats are "a" and "b". A side is 3 buttons, and the buttons are its health: a side with no buttons left loses.
// A button has power and toughness, takes damage that stays for the whole match, and goes out when its damage
// reaches its toughness. It is untapped (ready) or tapped.
// Your turn: your buttons untap; you pick up to MAX_ATTACKERS ready buttons to attack and press attack (they tap).
// The other side then splits the attack's total power over its own buttons, any way it likes (no time limit).
// Each of its untapped buttons that takes damage hits back with its power, spread over the attackers in order.
// A button only untaps at the start of its own side's turn, so attacking with it means it can't hit back next turn.
// (kura, Nov 2: "the buttons are the HP !!!")

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

export const MAX_ATTACKERS = 2; // at most this many attack in a turn, so one button always stays home (kura, Nov 3)

export const other = (seat) => (seat === "a" ? "b" : "a");
export const life = (b) => (b.out ? 0 : b.toughness - b.damage);
// how much of an attack the defender must place: all of it, or as much as its buttons can still take
export const toPlace = (g) => Math.min(
  g.attack.attackers.reduce((n, i) => n + g.sides[g.attack.by].buttons[i].power, 0),
  g.sides[other(g.attack.by)].buttons.reduce((n, b) => n + life(b), 0),
);

export function newGame(buttonsA, buttonsB) {
  const side = (list) => ({
    buttons: list.map((b) => {
      const [power, toughness] = STATS[b.type] ?? [1, 1];
      return { ...b, power, toughness, damage: 0, tapped: false, out: false };
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
  if (list.length > MAX_ATTACKERS) return `At most ${MAX_ATTACKERS} can attack.`;
  if (!list.length) { g.log.push(`${seat} doesn't attack`); passTurn(g); return null; }
  for (const i of list) g.sides[seat].buttons[i].tapped = true;
  g.attack = { by: seat, attackers: list };
  const att = g.sides[seat].buttons;
  g.log.push(`${seat} attacks for ${list.reduce((n, i) => n + att[i].power, 0)} with ${list.map((i) => att[i].name).join(", ")}`);
  return null;
}

// The defender places the attack: split is { buttonIndex: damage }, adding up to toPlace(g), no button past its life.
export function place(g, seat, split) {
  if (!g.attack || g.attack.by === seat) return "Nothing to take.";
  const by = g.attack.by, att = g.sides[by], def = g.sides[seat];
  const parts = Object.entries(split).map(([k, v]) => [Number(k), Number(v)]).filter(([, d]) => d > 0);
  if (!parts.every(([i, d]) => Number.isInteger(d) && def.buttons[i] && d <= life(def.buttons[i]))) return "A button can't take that much.";
  if (parts.reduce((n, [, d]) => n + d, 0) !== toPlace(g)) return `Place exactly ${toPlace(g)}.`;
  // hitting back: untapped buttons that take damage, counted before anything goes out (it all happens at once)
  let back = parts.filter(([i]) => !def.buttons[i].tapped).reduce((n, [i]) => n + def.buttons[i].power, 0);
  for (const [i, d] of parts) {
    const b = def.buttons[i];
    b.damage += d;
    g.log.push(`${b.name} takes ${d}${b.tapped ? "" : `, hits back for ${b.power}`}`);
    if (life(b) <= 0) { b.out = true; g.log.push(`${b.name} is out`); }
  }
  for (const i of g.attack.attackers) {
    const a = att.buttons[i], d = Math.min(back, life(a));
    if (!d) continue;
    back -= d;
    a.damage += d;
    g.log.push(`${a.name} takes ${d}`);
    if (life(a) <= 0) { a.out = true; g.log.push(`${a.name} is out`); }
  }
  g.attack = null;
  const empty = (s) => g.sides[s].buttons.every((b) => b.out);
  if (empty(seat) || empty(by)) {
    g.winner = empty(seat) && empty(by) ? "draw" : empty(seat) ? by : seat;
    g.log.push(g.winner === "draw" ? "draw" : `${g.winner} wins`);
    return null;
  }
  passTurn(g);
  return null;
}

function passTurn(g) {
  g.turn = other(g.turn);
  for (const b of g.sides[g.turn].buttons) b.tapped = false;
  g.log.push(`${g.turn}'s turn`);
}
