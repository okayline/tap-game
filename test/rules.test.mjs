import { test } from "node:test";
import assert from "node:assert/strict";
import { newGame, attack, place } from "../src/rules.js";

// a: webring 3/2, neon 1/2, counter 2/3. b: construction 1/3, divider 3/3, neon 1/2 (hand-set from STATS; one Neon a side, so no Glow).
const A = [{ name: "w", type: "webring" }, { name: "n", type: "neon" }, { name: "c", type: "counter" }];
const B = [{ name: "k", type: "construction" }, { name: "d", type: "divider" }, { name: "m", type: "neon" }];

test("each attacker's ping is placed on the defender's buttons; a button hits back the attacker that hit it; damage stays", () => {
  const g = newGame(A, B, "a");
  assert.equal(attack(g, "a", [0, 2]), "At most 1 can ping this turn."); // a won the flip: 1 on the first turn
  g.limit = 2; // as from the second turn on
  assert.equal(attack(g, "a", [0, 1, 2]), "At most 2 can ping this turn.");
  assert.equal(attack(g, "a", [0, 2]), null);      // webring 3 + counter 2 = 5
  assert.equal(place(g, "b", { 0: { 0: 2 }, 2: { 1: 2 } }), "Place exactly 5.");
  assert.equal(place(g, "b", { 0: { 0: 1 }, 2: { 1: 4 } }), "c only pings for 2.");
  assert.equal(place(g, "b", { 1: { 0: 5 } }), "That button isn't pinging.");
  // webring puts 2 on construction and 1 on divider; counter puts 2 on divider (3: out). Divider was hit by both: its 3 would knock
  // out either (webring 2 life, counter 3), so it hits the one with the least life left, webring
  assert.equal(place(g, "b", { 0: { 0: 2, 1: 1 }, 2: { 1: 2 } }), null);
  assert.deepEqual(g.sides.b.buttons.map((b) => b.out), [false, true, false]);
  // construction hits back webring for 1 and divider for 3: webring takes 2 (out, 2 lost); counter takes nothing; neon takes nothing
  assert.deepEqual(g.sides.a.buttons.map((b) => b.out), [true, false, false]);
  assert.equal(g.sides.a.buttons[2].damage, 0);
  assert.equal(g.winner, null);
  assert.equal(g.turn, "b");
  assert.equal(g.sides.b.buttons[0].damage, 2);      // damage stays
});

// the kind of each dealt button, in a fixed order, to compare two decks that hold the same kinds in different orders
const kinds = (deck) => deck.map((x) => [x.type, x.rarity, x.fx, x.extra].join()).sort();

test("decks: the same kinds on both sides in their own order; out spots fill from the top; one swap a turn with the top card", async () => {
  const { dealDecks, swap } = await import("../src/rules.js");
  const pool = [..."aaaa"].map((_, i) => ({ name: "n" + i, type: "neon" }))
    .concat([{ name: "d0", type: "divider" }, { name: "d1", type: "divider" }], [..."wwww"].map((_, i) => ({ name: "w" + i, type: "webring" })));
  let differ = false;
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(pool, 5);
    assert.deepEqual(kinds(a), kinds(b));
    if (a.map((x) => x.type).join() !== b.map((x) => x.type).join()) differ = true;
    assert.ok(a.filter((x) => x.type === "divider").length <= 1);
    assert.equal(new Set([...a, ...b]).size, a.length + b.length); // no button dealt twice
  }
  assert.ok(differ);   // the two orders aren't always the same
  // a booster-pack deck: 5 commons, 2 uncommons, 1 rare and a wildcard; the same kinds on both sides; no ultras
  const counts = { common: 8, uncommon: 4, rare: 4, prototype: 4, ultra: 4 };
  const pack = Object.entries(counts).flatMap(([rarity, n]) => ["neon", "webring", "counter"].flatMap((type) => [...Array(n)].map((_, i) => ({ name: `${rarity}-${type}-${i}`, type, rarity }))));
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(pack);
    assert.equal(a.length, 9);
    assert.deepEqual(kinds(a), kinds(b));
    const count = (r) => a.filter((x) => x.rarity === r).length;
    assert.equal(count("ultra"), 0);
    assert.ok(count("common") >= 5 && count("uncommon") >= 2 && count("rare") >= 1);
    assert.ok(count("prototype") <= 1 && count("common") + count("uncommon") + count("rare") + count("prototype") === 9);
    assert.equal(new Set([...a, ...b]).size, 18);
  }
  // a: 3 guestbooks on the field, then a divider and a neon in the deck (top first); b: 4 webrings
  const g = newGame([0, 1, 2].map((i) => ({ name: "n" + i, type: "guestbook" })).concat({ name: "d", type: "divider" }, { name: "e", type: "neon" }),
    [0, 1, 2, 3].map((i) => ({ name: "w" + i, type: "webring" })), "a");
  assert.equal(swap(g, "b", 0), "Only on your turn, before you ping.");
  assert.equal(swap(g, "a", 1), null);               // n1 to the bottom, d (the top) comes in
  assert.equal(g.sides.a.buttons[1].name, "d");
  assert.deepEqual(g.sides.a.deck.map((b) => b.name), ["e", "n1"]);
  assert.equal(swap(g, "a", 2), "One swap a turn.");
  assert.equal(attack(g, "a", [1]), "A button that came in this turn can't ping.");
  assert.equal(attack(g, "a", [0]), null);
  assert.equal(swap(g, "a", 2), "Only on your turn, before you ping."); // a is mid-attack
  // b puts the guestbook's 1 power on webring 0 (2 toughness, survives); hit back 3 takes guestbook 0 out
  assert.equal(place(g, "b", { 0: { 0: 1 } }), null);
  assert.equal(g.sides.a.buttons[0].out, true);
  g.limit = 2; attack(g, "b", []);                   // b passes; at the start of a's turn the top card fills the out spot
  assert.equal(g.sides.a.buttons[0].name, "e");
  assert.equal(g.sides.a.buttons[0].sick, true);
  assert.deepEqual(g.sides.a.gone.map((b) => b.name), ["n0"]);
  assert.equal(g.winner, null);
});

test("a button hit by both hits back: the one it can knock out, then the least life left, then the most damage on it", async () => {
  const { backAt } = await import("../src/rules.js");
  const a = (life) => ({ toughness: life, damage: 0, out: false });
  assert.equal(backAt(2, [[0, a(3), 1], [2, a(2), 1]]), 2);   // knocks out only the second
  assert.equal(backAt(1, [[0, a(2), 1], [2, a(3), 1]]), 0);   // knocks out neither: least life left
  assert.equal(backAt(3, [[0, a(2), 1], [2, a(2), 2]]), 2);   // knocks out both, same life: the most damage on it
  assert.equal(backAt(3, [[0, a(2), 1], [2, a(2), 1]]), 0);   // all the same: the first picked
});

test("the dummy places each attacker's ping", async () => {
  const { dummyPlace } = await import("../src/dummy.js");
  const g = newGame(A, B, "a");
  g.limit = 2; g.dummyTurn = 1;   // SCRIPT line 0: spread
  attack(g, "a", [0, 2]);
  assert.equal(place(g, "b", dummyPlace(g)), null);
  assert.equal(g.turn, "b");
});

test("rarity extras: rolled once per slot for both sides; Exalted, Exert and Phasing", async () => {
  const { dealDecks, EXTRA, settle } = await import("../src/rules.js");
  const counts = { common: 8, uncommon: 4, rare: 4, prototype: 4 };
  const pack = Object.entries(counts).flatMap(([rarity, n]) => ["neon", "webring", "counter"].flatMap((type) => [...Array(n)].map((_, i) => ({ name: `${rarity}-${type}-${i}`, type, rarity }))));
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(pack);
    assert.deepEqual(kinds(a), kinds(b));
    for (const x of a) assert.ok(EXTRA[x.rarity] ? EXTRA[x.rarity].includes(x.extra) : x.extra === undefined);   // commons and uncommons: none
  }
  // a: an exalted webring (3/2) alone; b: three guestbooks (1/3), untapped
  const W = [{ name: "w", type: "webring", extra: "exalted" }, { name: "n", type: "neon" }, { name: "c", type: "counter" }];
  const G = [0, 1, 2].map((i) => ({ name: "g" + i, type: "guestbook" }));
  let g = newGame(W, G, "a");
  assert.equal(attack(g, "a", [0]), null);
  assert.equal(g.sides.a.buttons[0].power, 4);              // +1/+0 for the ping
  assert.equal(place(g, "b", { 0: { 0: 3, 1: 1 } }), null);
  assert.equal(g.sides.a.buttons[0].damage, 1);             // 2 hit back, 1 stopped by its +1 toughness
  assert.equal(g.sides.a.buttons[0].power, 3);              // back to normal after the ping
  // Exert: counter (2/3) pings for 4 and stays tapped through a's next turn
  const X = [{ name: "x", type: "counter", extra: "exert" }, { name: "n", type: "neon" }, { name: "m", type: "neon" }];
  g = newGame(X, G, "a");
  assert.equal(attack(g, "a", [0], [0]), null);
  assert.match(g.log.at(-1), /pings for 4 with x \(overclocked\)/);
  assert.equal(place(g, "b", { 0: { 0: 3, 1: 1 } }), null);
  g.limit = 2; attack(g, "b", []);                          // b passes: a's turn, x stays tapped
  assert.equal(g.sides.a.buttons[0].tapped, true);
  attack(g, "a", []); attack(g, "b", []);                   // the turn after, it untaps
  assert.equal(g.sides.a.buttons[0].tapped, false);
  // Phasing: phased out at its side's next turn: it can't ping or take damage
  const P = [{ name: "p", type: "neon", extra: "phasing" }, { name: "n", type: "neon" }, { name: "m", type: "neon" }];
  g = newGame(G, P, "a");
  attack(g, "a", []);                                       // b's turn: p phases out
  assert.equal(g.sides.b.buttons[0].phased, true);
  assert.equal(attack(g, "b", [0]), "Only ready buttons can ping.");
  attack(g, "b", []);
  assert.equal(attack(g, "a", [0]), null);
  assert.equal(place(g, "b", { 0: { 0: 1 } }), "A button can't take that much.");
  assert.equal(place(g, "b", { 0: { 1: 1 } }), null);   // the turn passes to b: p phases back in
  assert.equal(g.sides.b.buttons[0].phased, false);
});

test("printed effects: a button keeps its own, so a slot's two buttons share the type, not the effect; printed Unicast is its only one", async () => {
  const { dealDecks, fxOf } = await import("../src/rules.js");
  const pool = [{ name: "a", type: "neon", effect: "glow" }, { name: "b", type: "neon", effect: "daemon" },
    { name: "u", type: "counter", rarity: "uncommon", effect: "exalted" }, { name: "v", type: "counter", rarity: "uncommon", effect: "online" }];
  const want = { a: ["glow", undefined], b: ["daemon", undefined], u: ["none", "exalted"], v: ["online", undefined] };
  for (let k = 0; k < 20; k++) {
    const [x, y] = dealDecks(pool);
    assert.ok(x.length >= 1);
    for (const d of [...x, ...y]) assert.deepEqual([fxOf(d), d.extra], want[d.name]);
    assert.deepEqual(x.map((d) => d.type).sort(), y.map((d) => d.type).sort());
  }
});

test("main effects: rolled once per slot for both sides, and they follow the button, not its type", async () => {
  const { dealDecks, FX, fxOf } = await import("../src/rules.js");
  const pool = ["neon", "webring", "counter", "divider"].flatMap((type) => [...Array(6)].map((_, i) => ({ name: `${type}-${i}`, type })));
  const seen = new Set();
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(pool);
    assert.deepEqual(kinds(a), kinds(b));
    for (const x of a) { assert.ok(FX.includes(x.fx)); seen.add(`${x.type}:${x.fx}`); }
  }
  assert.ok(seen.size > 4);                                  // a type isn't stuck with one effect
  assert.equal(fxOf({ type: "neon" }), "glow");              // a match from before v0.112 keeps the type's effect
  // a Neon with Daemon hits back for 1 while tapped; a Divider with Always Online doesn't tap when it pings
  const a = [{ name: "d", type: "divider", fx: "online" }, { name: "n", type: "neon" }, { name: "m", type: "neon" }];
  const b = [{ name: "k", type: "neon", fx: "daemon" }, { name: "x", type: "neon" }, { name: "y", type: "neon" }];
  const g = newGame(a, b, "b");
  g.locked = true; g.limit = 2;
  assert.equal(attack(g, "b", [0]), null);                   // k pings and taps
  assert.equal(place(g, "a", { 0: { 1: 1 } }), null);
  assert.equal(attack(g, "a", [0]), null);
  assert.equal(g.sides.a.buttons[0].tapped, false);           // Always Online
  assert.equal(place(g, "b", { 0: { 0: 1, 1: 2 } }), null);  // k (1 life left, tapped) and x (untapped)
  assert.equal(g.sides.a.buttons[0].damage, 2);               // tapped k hit back for 1 (Daemon), x for its 1
});

test("Virus knocks out what it damages; Read-Only can't ping and takes 1 less; Backup comes back once with 1 life", async () => {
  const { life, settle } = await import("../src/rules.js");
  // a: neon 1/2 Virus, guestbook 1/3 Read-Only, neon 1/2 Backup. b: three guestbooks 1/3 with no effect.
  const a = [{ name: "v", type: "neon", fx: "virus" }, { name: "r", type: "guestbook", fx: "readonly" }, { name: "k", type: "neon", fx: "backup" }];
  const b = ["x", "y", "z"].map((name) => ({ name, type: "guestbook", fx: "none" }));
  const g = newGame(a, b, "a");
  g.locked = true; g.limit = 2;
  const A_ = g.sides.a.buttons, B_ = g.sides.b.buttons;
  assert.equal(attack(g, "a", [1]), "A Read-Only button can't ping.");
  assert.equal(attack(g, "a", [0]), null);
  assert.equal(place(g, "b", { 0: { 0: 1 } }), null);
  assert.equal(B_[0].out, true);                       // 1 from the Virus: out (it had 3 life)
  assert.equal(A_[0].damage, 1);                       // x still hit back, for its 1
  assert.equal(attack(g, "b", [1]), null);             // y pings r for 1
  assert.equal(place(g, "a", { 1: { 1: 1 } }), null);
  assert.deepEqual([A_[1].damage, B_[1].damage], [0, 0]);   // Read-Only took 0, so it didn't hit back
  assert.equal(attack(g, "a", []), null);
  A_[2].damage = 1;                                    // k at 1 life
  assert.equal(attack(g, "b", [2]), null);
  assert.equal(place(g, "a", { 2: { 2: 1 } }), null);
  assert.deepEqual([A_[2].out, life(A_[2])], [false, 1]);   // Backup: back with 1 life
  A_[2].damage += 1; settle(g);
  assert.equal(A_[2].out, true);                       // only once
});

test("Glow and Webcounter count the other buttons of their own type", () => {
  const a = [{ name: "g", type: "webring", fx: "glow" }, { name: "w", type: "webring", fx: "none" }, { name: "n", type: "neon", fx: "none" }];
  const b = [{ name: "c", type: "guestbook", fx: "webcounter" }, { name: "d", type: "guestbook", fx: "none" }, { name: "e", type: "neon", fx: "glow" }];
  const g = newGame(a, b, "a");
  assert.equal(g.sides.a.buttons[0].bonus, 1);   // one other Webring; the Neon doesn't count
  assert.equal(g.sides.b.buttons[0].boost, 1);   // one other Guestbook, not itself
  assert.equal(g.sides.b.buttons[2].bonus, 0);   // the only Neon on its side
});
