// The rules, with no Cloudflare in them, so tests can run them directly.
// Seats are "a" and "b". A side is 3 buttons, and the buttons are its health: a side with no buttons left loses.
// A button has power and toughness, takes damage that stays for the whole match, and goes out when its damage
// reaches its toughness. It is untapped (ready) or tapped.
// Your turn: your buttons untap; you pick up to MAX_ATTACKERS ready buttons to attack and press attack (they tap).
// The other side then splits the attack's total power over its own buttons, any way it likes (no time limit).
// Each of its untapped buttons that takes damage hits back with its power, spread over the attackers in order.
// A button only untaps at the start of its own side's turn, so attacking with it means it can't hit back next turn.
// (kura, Nov 2: "the buttons are the HP !!!")
// Decks (kura, Nov 3): each side has DECK buttons, 3 on the field and the rest in its deck. Both decks hold the same types
// (dealDecks), so their stats match. A button that goes out stays in its spot, greyed, until its side brings in a deck button
// on its own turn (swap onto it); then it moves to its side's `gone` list (shown crossed out, in the deck row spot of the button that
// replaced it: `at`, see deckRow). Swaps (kura, Nov 3): before the
// first attack, as many as you like; after that, one per turn, on your turn before you attack (filling an out spot doesn't
// count). A swapped-out button keeps its damage. A button that comes in after the first attack (a swap, or onto an out spot)
// can't attack that turn ("summoning sickness", kura, Nov 3), but it can still hit back. You can't attack while you have an out spot and a deck to fill it from.
// A side loses when its field is all out and its deck is empty.

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

export const DECK = 9; // 3 on the field, 6 in the deck row (kura, Nov 3)
// Always Online (kura, Nov 3; Magic's "vigilance"): attacking doesn't tap a button of these types, so it can still hit back on the other side's turn.
export const ALWAYS_ONLINE = ["guestbook"];
// Broadband (kura, Nov 3; Magic's "haste"): a button of these types can attack the turn it comes in (no summoning sickness).
export const BROADBAND = ["webring"];
// Webcounter (kura, Nov 3): a button of these types gets +1/+0 each time it hits back, for the rest of the match.
export const WEBCOUNTER = ["counter"];
// Glow (kura, Nov 3): a button of these types gets +0/+1 for each other one of them on its side's field (b.bonus, kept by settle()).
export const GLOW = ["neon"];
// Lag Spike (kura, Nov 3; Magic's "first strike"): when an attack has one of these, a button the attack knocks out doesn't hit back.
// (kura, Nov 3: attacking is called "ping" on screen; the code still says attack.)
export const LAG_SPIKE = ["divider"];
// Daemon (kura, Nov 3; was Firewall, a name now taken by the side's total): a button of these types hits back for 1 even while
// tapped (an untapped one hits back with its power, like any).
export const DAEMON = ["construction"];
export const MAX_ATTACKERS = 2; // at most this many attack in a turn, so one button always stays home (kura, Nov 3)
// A coin flip decides who goes first, and that side attacks with only 1 on the match's first turn (kura, Nov 3).
// g.limit is how many may attack this turn.

// the names the log and the page use for the seats (kura, Nov 3): seat b is the dummy
export const NAMES = { a: "Player", b: "Guest #1337" };
export const other = (seat) => (seat === "a" ? "b" : "a");
export const life = (b) => (b.out ? 0 : b.toughness + (b.bonus ?? 0) - b.damage);
// how much of an attack the defender must place: all of it, or as much as its buttons can still take
export const toPlace = (g) => Math.min(
  g.attack.attackers.reduce((n, i) => n + g.sides[g.attack.by].buttons[i].power, 0),
  g.sides[other(g.attack.by)].buttons.reduce((n, b) => n + life(b), 0),
);

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

const fresh = (b) => { const [power, toughness] = STATS[b.type] ?? [1, 1]; return { ...b, power, toughness, damage: 0, tapped: false, out: false }; };

// deckA / deckB: a side's whole deck; the first 3 go on the field.
export function newGame(deckA, deckB, first = Math.random() < 0.5 ? "a" : "b") {
  const side = (list) => { const all = list.map(fresh); return { buttons: all.slice(0, 3), deck: all.slice(3) }; };
  const g = { turn: first, limit: 1, sides: { a: side(deckA), b: side(deckB) }, attack: null, winner: null, locked: false,
    log: [`coin flip: ${NAMES[first]} goes first, with 1 ping`, `${NAMES[first]}'s turn`] };
  settle(g);
  return g;
}

// Glow: give each field button its bonus toughness (deck buttons get none), then put out any field button whose life is gone, again
// until nothing changes (a Neon going out lowers the others' bonus).
export function settle(g) {
  for (let changed = true; changed;) {
    changed = false;
    for (const s of Object.values(g.sides)) {
      for (const b of s.deck ?? []) b.bonus = 0;
      const glow = s.buttons.filter((b) => !b.out && GLOW.includes(b.type)).length;
      for (const b of s.buttons) b.bonus = !b.out && GLOW.includes(b.type) ? glow - 1 : 0;
      for (const b of s.buttons) if (!b.out && life(b) <= 0) { b.out = true; g.log.push(`${b.name} is out`); changed = true; }
    }
  }
}

// Before the first attack: swap field button i with deck button j. Returns an error string or null.
// Swap field button i with deck button j: before the first attack, any number; after, on your turn before you attack.
// Onto an out button it brings the deck button in (free); onto a live one it is your one swap this turn.
export function swap(g, seat, i, j) {
  const s = g.sides[seat];
  s.deck ??= []; s.gone ??= [];
  if (!Number.isInteger(i) || !Number.isInteger(j) || !s.buttons[i] || !s.deck[j]) return "No such button.";
  if (g.locked && (g.winner || g.turn !== seat || g.attack)) return "Only on your turn, before you ping.";
  const [n] = s.deck.splice(j, 1), b = s.buttons[i];
  if (b.out) { b.at = deckRow(s).findIndex((x) => x.j === j); s.gone.push(b); s.buttons[i] = n; if (g.locked) n.sick = true; g.log.push(`${n.name} comes in`); settle(g); return null; }
  if (g.locked && g.swapped) { s.deck.splice(j, 0, n); return "One swap a turn."; }
  s.buttons[i] = n; s.deck.splice(j, 0, b);
  if (g.locked) { g.swapped = true; n.sick = true; g.log.push(`${NAMES[seat]} swaps ${b.name} for ${n.name}`); }
  settle(g);
  return null;
}

// A side's deck row as shown: its deck buttons in order ({ b, j }: deck index j) and its gone buttons ({ b, gone: true }) each in the
// spot of the deck button that replaced it (b.at, the row index then; kura, Nov 3: "could the knocked out card replace the card
// that the player clicks on"). The row keeps its length when a deck button comes in, since a gone one takes its spot. A gone
// button with no spot (an older match) goes at the end. The page has the same function.
export function deckRow(s) {
  const deck = s.deck ?? [], gone = s.gone ?? [], at = new Map(gone.filter((b) => b.at >= 0).map((b) => [b.at, b])), row = [];
  for (let k = 0, j = 0; j < deck.length || at.has(k); k++) row.push(at.has(k) ? { b: at.get(k), gone: true } : { b: deck[j], j: j++ });
  const shown = new Set(row.map((x) => x.b));
  return [...row, ...gone.filter((b) => !shown.has(b)).map((b) => ({ b, gone: true }))];
}

// A side with an out button and a deck left must bring one in before attacking.
export const mustFill = (g, seat) => (g.sides[seat].deck ?? []).length > 0 && g.sides[seat].buttons.some((b) => b.out);

// Bring in deck buttons, left first, for every out spot (the dummy does this at the start of its turn).
export function autoFill(g, seat) {
  const s = g.sides[seat];
  s.buttons.forEach((b, i) => { if (b.out && (s.deck ?? []).length) swap(g, seat, i, 0); });
}

const ready = (side, i) => side.buttons[i] && !side.buttons[i].out && !side.buttons[i].tapped;

// seat attacks with the buttons at idxs (may be empty, which just passes the turn). Returns an error string or null.
export function attack(g, seat, idxs) {
  if (g.winner) return "The game is over.";
  if (g.turn !== seat || g.attack) return "Not your turn.";
  const list = [...new Set(idxs)];
  if (!list.every((i) => ready(g.sides[seat], i))) return "Only ready buttons can ping.";
  if (list.length > g.limit) return `At most ${g.limit} can ping this turn.`;
  if (mustFill(g, seat)) return "Bring in a button first.";
  if (list.some((i) => g.sides[seat].buttons[i].sick && !BROADBAND.includes(g.sides[seat].buttons[i].type))) return "A button that came in this turn can't ping.";
  g.locked = true;
  if (!list.length) { g.log.push(`${NAMES[seat]} doesn't ping`); passTurn(g); return null; }
  for (const i of list) if (!ALWAYS_ONLINE.includes(g.sides[seat].buttons[i].type)) g.sides[seat].buttons[i].tapped = true;
  g.attack = { by: seat, attackers: list };
  const att = g.sides[seat].buttons;
  g.log.push(`${NAMES[seat]} pings for ${list.reduce((n, i) => n + att[i].power, 0)} with ${list.map((i) => att[i].name).join(", ")}`);
  return null;
}

// The defender places the attack: split is { buttonIndex: damage }, adding up to toPlace(g), no button past its life.
export function place(g, seat, split) {
  if (!g.attack || g.attack.by === seat) return "Nothing to take.";
  const by = g.attack.by, att = g.sides[by], def = g.sides[seat];
  const parts = Object.entries(split).map(([k, v]) => [Number(k), Number(v)]).filter(([, d]) => d > 0);
  if (!parts.every(([i, d]) => Number.isInteger(d) && def.buttons[i] && d <= life(def.buttons[i]))) return "A button can't take that much.";
  if (parts.reduce((n, [, d]) => n + d, 0) !== toPlace(g)) return `Place exactly ${toPlace(g)}.`;
  // hitting back: untapped buttons that take damage (and tapped Daemons, for 1), counted before anything goes out (it all happens at
  // once), except with Lag Spike in the attack, where a button this attack knocks out doesn't hit back
  const ping = g.attack.attackers.some((i) => LAG_SPIKE.includes(att.buttons[i].type));
  const backBy = (b) => (!b.tapped ? b.power : DAEMON.includes(b.type) ? 1 : 0);
  const hits = ([i, d]) => backBy(def.buttons[i]) > 0 && !(ping && d >= life(def.buttons[i]));
  let back = parts.filter(hits).reduce((n, [i]) => n + backBy(def.buttons[i]), 0);
  for (const [i, d] of parts) {
    const b = def.buttons[i], hit = hits([i, d]);
    b.damage += d;
    g.log.push(`${b.name} takes ${d}${hit ? `, hits back for ${backBy(b)}` : ""}`);
    if (life(b) <= 0) { b.out = true; g.log.push(`${b.name} is out`); }
    else if (hit && !b.tapped && WEBCOUNTER.includes(b.type)) { b.power++; b.boost = (b.boost ?? 0) + 1; g.log.push(`${b.name} gets +1/+0`); }   // after its hit back (counted above)
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
  settle(g);
  const empty = (s) => g.sides[s].buttons.every((b) => b.out) && !(g.sides[s].deck ?? []).length;
  if (empty(seat) || empty(by)) {
    g.winner = empty(seat) && empty(by) ? "draw" : empty(seat) ? by : seat;
    g.log.push(g.winner === "draw" ? "draw" : `${NAMES[g.winner]} wins`);
    return null;
  }
  passTurn(g);
  return null;
}

function passTurn(g) {
  g.turn = other(g.turn);
  g.limit = MAX_ATTACKERS;
  const s = g.sides[g.turn];
  s.deck ??= []; // a match started before decks (v0.35 or older) has none
  g.swapped = false;
  for (const b of s.buttons) b.sick = false;
  for (const b of g.sides[g.turn].buttons) if (!b.out) b.tapped = false;   // a knocked-out button stays as it went out, tapped or not (kura, Nov 3)
  g.log.push(`${NAMES[g.turn]}'s turn`);
}
