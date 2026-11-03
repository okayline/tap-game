// The rules, with no Cloudflare in them, so tests can run them directly. Real time (kura, Nov 3): there are no turns.
// Seats are "a" and "b". Each side has a deck of DECK buttons: 3 on the field, the rest in its deck (both decks hold the same
// types, from dealDecks, so their stats match). A button has power and toughness, takes damage that stays for the whole match,
// and goes out when its damage reaches its toughness. (kura, Nov 2: "the buttons are the HP !!!")
// Before the match starts you may swap field and deck buttons as often as you like. Once it starts:
// - Any untapped button of yours can hit one of theirs at any moment: it deals its power to that button and taps.
// - If the button it hits is untapped, it hits back with its power. A tapped button can't hit back.
// - A tapped button untaps by itself after its type's COOLDOWN.
// - A button that goes out stays in its spot, crossed out, until its side drags a deck button onto it (any time); then it moves
//   to the side's `gone` list. A side loses when its field is all out and its deck is empty.
// Times are server milliseconds (Date.now()); a button is untapped when readyAt <= now.

// power / toughness by type: the more buttons of a type exist, the weaker it is (kura, Nov 2: counts from the live
// item table, all active 88x31 buttons: neon 32, guestbook 21, construction 19, counter 17, webring 13, divider 5).
// Every toughness +1 (kura, Nov 3: matches ended after 1 or 2 rounds).
export const STATS = {
  neon: [1, 2],
  guestbook: [1, 3],
  construction: [1, 3],
  counter: [2, 3],
  webring: [3, 2],
  divider: [3, 3],
};

// seconds a type stays tapped after it hits: weaker types take longer (kura, Nov 3: 4.5 s for 1/2 down to 2.5 s for 3/3)
export const COOLDOWN = {
  neon: 4.5,
  guestbook: 4,
  construction: 4,
  counter: 3.5,
  webring: 3,
  divider: 2.5,
};

export const DECK = 9; // 3 on the field, 6 in the deck row (kura, Nov 3)

export const other = (seat) => (seat === "a" ? "b" : "a");
export const life = (b) => (b.out ? 0 : b.toughness - b.damage);
export const ready = (b, now) => !b.out && b.readyAt <= now;

// Deal both decks from the pool: n times, pick a type (weighted by how many of its buttons are left) and give each side a
// different button of it. A type needs 2 buttons left to be picked, so a type with 2 in the pool comes up at most once.
export function dealDecks(pool, n = DECK, rand = Math.random) {
  const left = {};
  for (const b of pool) (left[b.type] ??= []).push(b);
  const take = (list) => list.splice(Math.floor(rand() * list.length), 1)[0];
  const a = [], b = [];
  for (let k = 0; k < n; k++) {
    const types = Object.keys(left).filter((t) => left[t].length >= 2);
    if (!types.length) break;
    let r = rand() * types.reduce((m, t) => m + left[t].length, 0), t = types[0];
    for (const x of types) { if (r < left[x].length) { t = x; break; } r -= left[x].length; }
    a.push(take(left[t])); b.push(take(left[t]));
  }
  return [a, b];
}

const fresh = (b) => {
  const [power, toughness] = STATS[b.type] ?? [1, 1];
  return { ...b, power, toughness, cooldown: (COOLDOWN[b.type] ?? 3) * 1000, damage: 0, readyAt: 0, out: false };
};

// deckA / deckB: a side's whole deck; the first 3 go on the field.
export function newGame(deckA, deckB) {
  const side = (list) => { const all = list.map(fresh); return { buttons: all.slice(0, 3), deck: all.slice(3), gone: [] }; };
  return { rt: true, started: null, sides: { a: side(deckA), b: side(deckB) }, winner: null, log: ["swap if you like, then start"] };
}

export function start(g, now) {
  if (g.started != null) return "Already started.";
  g.started = now;
  g.log.push("go!");
  return null;
}

// Field button i <- deck button j. Before the start: any swap. After: only onto an out button (bringing one in).
export function swap(g, seat, i, j) {
  const s = g.sides[seat];
  if (g.winner) return "The match is over.";
  if (!Number.isInteger(i) || !Number.isInteger(j) || !s.buttons[i] || !s.deck[j]) return "No such button.";
  const b = s.buttons[i];
  if (g.started != null && !b.out) return "Once it starts, you can only bring one in where a button is out.";
  const [n] = s.deck.splice(j, 1);
  if (b.out) { s.gone.push(b); s.buttons[i] = n; g.log.push(`${n.name} comes in`); }
  else { s.buttons[i] = n; s.deck.splice(j, 0, b); }
  return null;
}

// seat's field button i hits the other side's field button t.
export function hit(g, seat, i, t, now) {
  if (g.winner) return "The match is over.";
  if (g.started == null) return "Press start first.";
  const me = g.sides[seat].buttons[i], them = g.sides[other(seat)].buttons[t];
  if (!me || !them || !Number.isInteger(i) || !Number.isInteger(t)) return "No such button.";
  if (!ready(me, now)) return "That button is still tapped.";
  if (them.out) return "That one is already out.";
  const back = ready(them, now) ? them.power : 0; // counted before anything changes: it all happens at once
  me.readyAt = now + me.cooldown;
  them.damage += me.power;
  me.damage += back;
  g.log.push(`${me.name} hits ${them.name} for ${me.power}${back ? `, takes ${back} back` : ""}`);
  for (const b of [them, me]) if (!b.out && life(b) <= 0) { b.out = true; b.damage = b.toughness; g.log.push(`${b.name} is out`); }
  const lost = (s) => g.sides[s].buttons.every((b) => b.out) && !g.sides[s].deck.length;
  if (lost("a") || lost("b")) {
    g.winner = lost("a") && lost("b") ? "draw" : lost("a") ? "b" : "a";
    g.log.push(g.winner === "draw" ? "draw" : `${g.winner} wins`);
  }
  return null;
}

// Bring in deck buttons, left first, for every out spot (the dummy does this as soon as one goes out).
export function autoFill(g, seat) {
  const s = g.sides[seat];
  s.buttons.forEach((b, i) => { if (b.out && s.deck.length) swap(g, seat, i, 0); });
}
