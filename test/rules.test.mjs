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

test("decks: same types on both sides; swaps until the first attack; out buttons are replaced from the deck", async () => {
  const { dealDecks, swap } = await import("../src/rules.js");
  const pool = [..."aaaa"].map((_, i) => ({ name: "n" + i, type: "neon" }))
    .concat([{ name: "d0", type: "divider" }, { name: "d1", type: "divider" }], [..."wwww"].map((_, i) => ({ name: "w" + i, type: "webring" })));
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(pool, 5);
    assert.deepEqual(a.map((x) => x.type), b.map((x) => x.type));
    assert.ok(a.filter((x) => x.type === "divider").length <= 1);
    assert.equal(new Set([...a, ...b]).size, a.length + b.length); // no button dealt twice
  }
  // a booster-pack deck: 5 commons, 2 uncommons, 1 rare and a wildcard; same type and rarity in each slot on both sides; no ultras
  const kinds = { common: 8, uncommon: 4, rare: 4, prototype: 4, ultra: 4 };
  const pack = Object.entries(kinds).flatMap(([rarity, n]) => ["neon", "webring", "counter"].flatMap((type) => [...Array(n)].map((_, i) => ({ name: `${rarity}-${type}-${i}`, type, rarity }))));
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(pack);
    assert.equal(a.length, 9);
    assert.deepEqual(a.map((x) => [x.type, x.rarity]), b.map((x) => [x.type, x.rarity]));
    const count = (r) => a.filter((x) => x.rarity === r).length;
    assert.equal(count("ultra"), 0);
    assert.ok(count("common") >= 5 && count("uncommon") >= 2 && count("rare") >= 1);
    assert.ok(count("prototype") <= 1 && count("common") + count("uncommon") + count("rare") + count("prototype") === 9);
    assert.equal(new Set([...a, ...b]).size, 18);
  }
  // a: 3 guestbooks on the field, a divider in the deck; b: 3 webrings and one in the deck
  const g = newGame([0, 1, 2].map((i) => ({ name: "n" + i, type: "guestbook" })).concat({ name: "d", type: "divider" }),
    [0, 1, 2, 3].map((i) => ({ name: "w" + i, type: "webring" })), "a");
  assert.equal(swap(g, "a", 0, 0), null);
  assert.equal(g.sides.a.buttons[0].name, "d");
  assert.equal(g.sides.a.deck[0].name, "n0");
  swap(g, "a", 0, 0); // back
  assert.equal(attack(g, "a", [0]), null);
  assert.equal(swap(g, "a", 0, 0), "Only on your turn, before you ping."); // a is mid-attack
  // b puts the guestbook's 1 power on webring 0 (2 toughness, survives); hit back 3 takes guestbook 0 out
  assert.equal(place(g, "b", { 0: { 0: 1 } }), null);
  assert.equal(g.sides.a.buttons[0].out, true);
  g.limit = 2; attack(g, "b", []); // b passes; a's turn: the out button waits in its spot until a brings one in
  assert.equal(g.sides.a.buttons[0].out, true);
  assert.equal(attack(g, "a", [1]), "Bring in a button first.");
  assert.equal(swap(g, "a", 0, 0), null);           // filling doesn't use the turn's swap
  assert.equal(g.sides.a.buttons[0].name, "d");
  assert.deepEqual(g.sides.a.gone.map((b) => b.name), ["n0"]);
  assert.equal(g.winner, null);
  // one swap a turn, on your own turn: a has no deck left, so give it one to try
  g.sides.a.deck.push({ name: "x", type: "neon", power: 1, toughness: 2, damage: 0, tapped: false, out: false });
  assert.equal(swap(g, "a", 1, 0), null);
  assert.equal(swap(g, "a", 2, 0), "One swap a turn.");
  assert.equal(attack(g, "a", [1]), "A button that came in this turn can't ping.");
  assert.equal(swap(g, "b", 0, 0), "Only on your turn, before you ping.");
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
  const kinds = { common: 8, uncommon: 4, rare: 4, prototype: 4 };
  const pack = Object.entries(kinds).flatMap(([rarity, n]) => ["neon", "webring", "counter"].flatMap((type) => [...Array(n)].map((_, i) => ({ name: `${rarity}-${type}-${i}`, type, rarity }))));
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(pack);
    assert.deepEqual(a.map((x) => x.extra), b.map((x) => x.extra));
    for (const x of a) assert.ok(x.rarity === "common" ? x.extra === undefined : EXTRA[x.rarity].includes(x.extra));
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
  assert.match(g.log.at(-1), /pings for 4 with x \(exerted\)/);
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
