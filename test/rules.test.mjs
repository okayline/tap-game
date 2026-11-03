import { test } from "node:test";
import assert from "node:assert/strict";
import { newGame, attack, place } from "../src/rules.js";

// a: webring 3/2, neon 1/2, counter 2/3. b: construction 1/3, divider 3/3, neon 1/2 (hand-set from STATS; one Neon a side, so no Glow).
const A = [{ name: "w", type: "webring" }, { name: "n", type: "neon" }, { name: "c", type: "counter" }];
const B = [{ name: "k", type: "construction" }, { name: "d", type: "divider" }, { name: "m", type: "neon" }];

test("an attack is placed on the defender's buttons; untapped ones that take damage hit back; damage stays", () => {
  const g = newGame(A, B, "a");
  assert.equal(attack(g, "a", [0, 2]), "At most 1 can ping this turn."); // a won the flip: 1 on the first turn
  g.limit = 2; // as from the second turn on
  assert.equal(attack(g, "a", [0, 1, 2]), "At most 2 can ping this turn.");
  assert.equal(attack(g, "a", [0, 2]), null);      // webring 3 + counter 2 = 5
  assert.equal(place(g, "b", { 0: 2, 1: 2 }), "Place exactly 5.");
  // b puts 3 on construction (out) and 2 on divider (1 left); neon takes nothing
  assert.equal(place(g, "b", { 0: 3, 1: 2 }), null);
  assert.deepEqual(g.sides.b.buttons.map((b) => b.out), [true, false, false]);
  // hit back: construction 1 + divider 3 = 4 over the attackers in order: webring takes 2 (out), counter takes 2 (1 left)
  assert.deepEqual(g.sides.a.buttons.map((b) => b.out), [true, false, false]);
  assert.equal(g.sides.a.buttons[2].damage, 2);
  assert.equal(g.winner, null);
  assert.equal(g.turn, "b");
  assert.equal(g.sides.b.buttons[1].damage, 2);      // damage stays
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
  // the mystery slot: with rarer buttons in the pool, each deck gets exactly one, and the types still match
  const mixed = pool.concat([..."uuuu"].map((_, i) => ({ name: "r" + i, type: i % 2 ? "neon" : "webring", rarity: "rare" })));
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(mixed, 5);
    assert.deepEqual(a.map((x) => x.type), b.map((x) => x.type));
    assert.equal(a.filter((x) => x.rarity === "rare").length, 1);
    assert.equal(b.filter((x) => x.rarity === "rare").length, 1);
    assert.equal(new Set([...a, ...b]).size, a.length + b.length);
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
  assert.equal(place(g, "b", { 0: 1 }), null);
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
