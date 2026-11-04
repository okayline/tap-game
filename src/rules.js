// The rules, with no Cloudflare in them, so tests can run them directly.
// Seats are "a" and "b". A side is 3 buttons, and the buttons are its health: a side with no buttons left loses.
// A button has power and toughness, takes damage that stays for the whole match, and goes out when its damage
// reaches its toughness. It is untapped (ready) or tapped.
// Your turn: your buttons untap; you pick up to MAX_ATTACKERS ready buttons to attack and press attack (they tap).
// The other side then places each attacker's power on its own buttons, any way it likes (no time limit).
// Each of its untapped buttons that takes damage hits back with its power, at the attacker that hit it; a button hit by both
// attackers hits back only one of them, picked by backAt(). Hit-back past an attacker's life is lost.
// A button only untaps at the start of its own side's turn, so attacking with it means it can't hit back next turn.
// (kura, Nov 2: "the buttons are the HP !!!")
// Decks (kura, Nov 3): each side has DECK buttons, 3 on the field and the rest in its deck. Both decks hold the same buttons' kinds
// (dealDecks), so their stats match, but each side's is shuffled on its own, like a Magic library (kura, Nov 3: "the sides are equal
// but the order will be mixed up"): the top 3 start on the field, and deck[0] is the top. A button that goes out stays in its spot,
// greyed, until the start of its side's next turn, when the top card comes in (fill, in passTurn; kura, Nov 3: "no choice"); it then
// moves to its side's `gone` list (shown crossed out at the right of its deck row, after the deck: kura, Nov 3).
// Swaps: one per turn, on your turn before you ping: a field button goes to the bottom of the deck and the top card comes in. A
// swapped-out button keeps its damage. A button that comes in (a swap, or onto an out spot) can't ping that turn ("summoning
// sickness", kura, Nov 3), but it can still hit back. A side loses when its field is all out and its deck is empty.

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
// A button's main effect (b.fx), rolled when the decks are dealt, once per deck slot for both sides (dealDecks), so it isn't tied to
// the type (kura, Nov 3: "it feels kind of stale having the same effects every game"; Magic prints an ability on each card).
//   online:     Always Online (Magic's vigilance): pinging doesn't tap it, so it can still hit back on the other side's turn
//   broadband:  Broadband (Magic's haste): it can ping the turn it comes in
//   webcounter: Webcounter: +1/+0 for each Guestbook on its side's field (b.boost, kept by settle()); it names a type, as Magic's
//               cards name creature types
//   glow:       Glow: +0/+1 for each other Neon on its side's field (b.bonus, kept by settle())
//   lagspike:   Lag Spike (Magic's first strike): when a ping has one, a button the ping knocks out doesn't hit back
//   daemon:     Daemon: hits back for 1 even while tapped (an untapped one hits back with its power, like any)
// (kura, Nov 3: attacking is called "ping" on screen; the code still says attack.)
export const FX = ["online", "broadband", "webcounter", "glow", "lagspike", "daemon"];
// each type's effect before v0.112, for a match dealt before then (its buttons have no fx)
const TYPE_FX = { guestbook: "online", webring: "broadband", counter: "webcounter", neon: "glow", divider: "lagspike", construction: "daemon" };
export const fxOf = (b) => b.fx ?? TYPE_FX[b.type];
// Extra effects by rarity (kura, Nov 3: "more rare = more interesting effects"; a button keeps its main effect too). A slot's extra is
// rolled when the decks are dealt, once for both sides (dealDecks), so both decks stay matched. Commons get none.
//   exalted: when it pings alone, +1/+1 for that ping (its +1 toughness: it takes 1 less hit-back, since damage stays)
//   exert:   when it pings, its side may exert it: its power counts double, and it doesn't untap at its side's next turn
//   phasing: at each of its side's turns it phases out or back in; phased out it can't ping, take damage, hit back or count for Glow
//            or Webcounter (Magic's phasing: it starts in, and goes out at its side's next turn)
export const EXTRA = { uncommon: ["exalted"], rare: ["exert", "exalted"], prototype: ["phasing", "exert", "exalted"] };
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
  g.sides[other(g.attack.by)].buttons.reduce((n, b) => n + (b.phased ? 0 : life(b)), 0),
);

// Deal both decks from the pool like a booster pack (kura, Nov 3: copy a Magic pack): the deck's 9 slots are 5 commons, 2 uncommons,
// 1 rare and 1 wildcard, in a shuffled order (the first 3 go on the field). A wildcard's rarity is drawn from WILD (prototypes only
// come from it). Each slot's rarity is the same for both sides; its type is picked weighted by how many buttons of that rarity are
// left, among types with 2 left, and each side gets a different button of it, so both decks keep the same types. A slot whose
// rarity has no pair left falls back to common. Ultras (and any other rarity) are never dealt. A button with no rarity is common.
export const SLOTS = ["common", "common", "common", "common", "common", "uncommon", "uncommon", "rare", "wild"];
export const WILD = { common: 60, uncommon: 25, rare: 10, prototype: 5 };   // a wildcard's odds, out of 100
export function dealDecks(pool, n = DECK, rand = Math.random) {
  const left = {};   // left[rarity][type]: buttons not yet dealt
  for (const b of pool) ((left[b.rarity ?? "common"] ??= {})[b.type] ??= []).push(b);
  const take = (list) => list.splice(Math.floor(rand() * list.length), 1)[0];
  const types = (r) => Object.keys(left[r] ?? {}).filter((t) => left[r][t].length >= 2);
  const wild = () => { let x = rand() * 100; for (const [r, w] of Object.entries(WILD)) { if (x < w) return r; x -= w; } return "common"; };
  const slots = [...SLOTS];
  for (let i = slots.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [slots[i], slots[j]] = [slots[j], slots[i]]; }
  const a = [], b = [];
  for (let k = 0; k < n; k++) {
    let r = slots[k % slots.length];
    if (r === "wild") r = wild();
    if (!types(r).length) r = "common";
    const ts = types(r);
    if (!ts.length) break;
    let x = rand() * ts.reduce((m, t) => m + left[r][t].length, 0), t = ts[0];
    for (const y of ts) { if (x < left[r][y].length) { t = y; break; } x -= left[r][y].length; }
    const ex = EXTRA[r], extra = ex ? ex[Math.floor(rand() * ex.length)] : undefined, fx = FX[Math.floor(rand() * FX.length)];
    a.push({ ...take(left[r][t]), fx, extra }); b.push({ ...take(left[r][t]), fx, extra });
  }
  const shuffle = (l) => { for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } return l; };
  return [shuffle(a), shuffle(b)];   // each side in its own order
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

// Glow and Webcounter: give each field button its bonus toughness and power (deck buttons get none), then put out any field button
// whose life is gone, again until nothing changes (a Neon going out lowers the others' bonus; a Guestbook going out lowers a Counter's power).
export function settle(g) {
  for (let changed = true; changed;) {
    changed = false;
    for (const s of Object.values(g.sides)) {
      for (const b of s.deck ?? []) { b.bonus = 0; b.boost = 0; b.power = STATS[b.type]?.[0] ?? 1; }
      const here = s.buttons.filter((b) => !b.out && !b.phased), books = here.filter((b) => b.type === "guestbook").length;
      for (const b of s.buttons) { b.boost = !b.out && fxOf(b) === "webcounter" ? books : 0; b.power = (STATS[b.type]?.[0] ?? 1) + b.boost + (b.temp ?? 0); }
      for (const b of s.buttons) b.bonus = !b.out && fxOf(b) === "glow" ? here.filter((x) => x !== b && x.type === "neon").length : 0;
      for (const b of s.buttons) if (!b.out && life(b) <= 0) { b.out = true; g.log.push(`${b.name} is out`); changed = true; }
    }
  }
}

// Your one swap a turn: field button i goes to the bottom of your deck and the top card comes in. Returns an error string or null.
export function swap(g, seat, i) {
  const s = g.sides[seat];
  s.deck ??= []; s.gone ??= [];
  if (g.winner || g.turn !== seat || g.attack) return "Only on your turn, before you ping.";
  if (!Number.isInteger(i) || !s.buttons[i] || s.buttons[i].out || !s.deck.length) return "No such button.";
  if (g.swapped) return "One swap a turn.";
  const n = s.deck.shift(), b = s.buttons[i];
  n.phased = false; n.sick = true;   // a button comes in phased in, and can't ping this turn
  s.buttons[i] = n; s.deck.push(b); g.swapped = true;
  g.log.push(`${NAMES[seat]} swaps ${b.name} for ${n.name}`);
  settle(g);
  return null;
}

// The start of seat's turn: the top card comes in onto each out spot, left first; the out button goes to `gone`.
function fill(g, seat) {
  const s = g.sides[seat];
  s.deck ??= []; s.gone ??= [];
  s.buttons.forEach((b, i) => {
    if (!b.out || !s.deck.length) return;
    const n = s.deck.shift();
    n.phased = false; n.sick = true;
    s.gone.push(b); s.buttons[i] = n; g.log.push(`${n.name} comes in`);
  });
  settle(g);
}


const ready = (side, i) => side.buttons[i] && !side.buttons[i].out && !side.buttons[i].tapped && !side.buttons[i].phased;

// seat attacks with the buttons at idxs (may be empty, which just passes the turn), exerting those of them in exert that have Exert.
// Returns an error string or null.
export function attack(g, seat, idxs, exert = []) {
  if (g.winner) return "The game is over.";
  if (g.turn !== seat || g.attack) return "Not your turn.";
  const list = [...new Set(idxs)];
  if (!list.every((i) => ready(g.sides[seat], i))) return "Only ready buttons can ping.";
  if (list.length > g.limit) return `At most ${g.limit} can ping this turn.`;
  if (list.some((i) => g.sides[seat].buttons[i].sick && fxOf(g.sides[seat].buttons[i]) !== "broadband")) return "A button that came in this turn can't ping.";
  g.locked = true;
  if (!list.length) { g.log.push(`${NAMES[seat]} doesn't ping`); passTurn(g); return null; }
  for (const i of list) if (fxOf(g.sides[seat].buttons[i]) !== "online") g.sides[seat].buttons[i].tapped = true;
  g.attack = { by: seat, attackers: list };
  const att = g.sides[seat].buttons, how = {};
  if (list.length === 1 && att[list[0]].extra === "exalted") { att[list[0]].temp = 1; att[list[0]].shield = 1; how[list[0]] = " (exalted)"; }
  for (const i of list) if (att[i].extra === "exert" && (Array.isArray(exert) ? exert : []).includes(i)) { att[i].temp = att[i].power; att[i].exerted = true; how[i] = " (exerted)"; }
  settle(g);
  g.log.push(`${NAMES[seat]} pings for ${list.reduce((n, i) => n + att[i].power, 0)} with ${list.map((i) => att[i].name + (how[i] ?? "")).join(", ")}`);
  return null;
}

// Which attacker a button hits back when more than one hit it (kura, Nov 3: chosen automatically, no click): the one its hit-back
// would knock out, if only one; else the one with the least life left; else the one that put the most damage on it; else the
// first picked. by: [attackerIndex, attacker, damage it put on this button], in the order they were picked; power: its hit-back.
export function backAt(power, by) {
  const out = by.filter(([, a]) => power >= life(a));
  const pool = out.length === 1 ? out : by;
  const low = Math.min(...pool.map(([, a]) => life(a)));
  const lows = pool.filter(([, a]) => life(a) === low);
  const most = Math.max(...lows.map(([, , d]) => d));
  return lows.find(([, , d]) => d === most)[0];
}

// The defender places the attack: split is { attackerIndex: { buttonIndex: damage } }, each attacker's part no more than its power,
// adding up to toPlace(g), no button past its life. A button hits back the attacker that hit it; one hit by more than one hits
// back the one backAt() picks.
export function place(g, seat, split) {
  if (!g.attack || g.attack.by === seat) return "Nothing to take.";
  const by = g.attack.by, att = g.sides[by], def = g.sides[seat];
  if (!split || typeof split !== "object") return "Nothing placed.";
  const from = {}, total = {};   // from[button]: the attackers that hit it; total[button]: its damage
  for (const [ka, part] of Object.entries(split)) {
    const a = Number(ka);
    if (!g.attack.attackers.includes(a) || !part || typeof part !== "object") return "That button isn't pinging.";
    let sum = 0;
    for (const [kb, v] of Object.entries(part)) {
      const i = Number(kb), d = Number(v);
      if (!Number.isInteger(d) || d < 0 || !def.buttons[i] || (d && def.buttons[i].phased)) return "A button can't take that much.";
      if (!d) continue;
      sum += d; total[i] = (total[i] ?? 0) + d; (from[i] ??= []).push(a);
    }
    if (sum > att.buttons[a].power) return `${att.buttons[a].name} only pings for ${att.buttons[a].power}.`;
  }
  const parts = Object.entries(total).map(([k, d]) => [Number(k), d]);
  if (!parts.every(([i, d]) => d <= life(def.buttons[i]))) return "A button can't take that much.";
  if (parts.reduce((n, [, d]) => n + d, 0) !== toPlace(g)) return `Place exactly ${toPlace(g)}.`;
  // hitting back: untapped buttons that take damage (and tapped Daemons, for 1), counted before anything goes out (it all happens at
  // once), except with Lag Spike in the attack, where a button this attack knocks out doesn't hit back
  const ping = g.attack.attackers.some((i) => fxOf(att.buttons[i]) === "lagspike");
  const backBy = (b) => (!b.tapped ? b.power : fxOf(b) === "daemon" ? 1 : 0);
  const hits = ([i, d]) => backBy(def.buttons[i]) > 0 && !(ping && d >= life(def.buttons[i]));
  const target = {};   // target[button]: the attacker it hits back
  for (const p of parts) if (hits(p)) target[p[0]] = backAt(backBy(def.buttons[p[0]]), from[p[0]].map((a) => [a, att.buttons[a], split[a][p[0]]]));
  const back = {};   // back[attacker]: hit-back aimed at it
  for (const [i, d] of parts) {
    const b = def.buttons[i], t = target[i];
    if (t !== undefined) back[t] = (back[t] ?? 0) + backBy(b);
    b.damage += d;
    g.log.push(`${b.name} takes ${d}${t !== undefined ? `, hits back ${att.buttons[t].name} for ${backBy(b)}` : ""}`);
    if (life(b) <= 0) { b.out = true; g.log.push(`${b.name} is out`); }
  }
  for (const i of g.attack.attackers) {
    const a = att.buttons[i], d = Math.min(Math.max(0, (back[i] ?? 0) - (a.shield ?? 0)), life(a));   // shield: Exalted's +1 toughness
    if (!d) continue;
    a.damage += d;
    g.log.push(`${a.name} takes ${d}`);
    if (life(a) <= 0) { a.out = true; g.log.push(`${a.name} is out`); }
  }
  for (const i of g.attack.attackers) { delete att.buttons[i].temp; delete att.buttons[i].shield; }   // Exalted and Exert last one ping
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
  for (const b of s.buttons) if (!b.out && b.extra === "phasing") { b.phased = !b.phased; g.log.push(`${b.name} phases ${b.phased ? "out" : "in"}`); }
  // a knocked-out button stays as it went out, tapped or not (kura, Nov 3); an exerted one stays tapped this once
  for (const b of s.buttons) if (!b.out) { if (b.exerted) b.exerted = false; else b.tapped = false; }
  settle(g);   // a phased button stops or starts counting for Glow and Webcounter
  fill(g, g.turn);
  g.log.push(`${NAMES[g.turn]}'s turn`);
}
