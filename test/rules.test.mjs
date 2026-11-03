import { test } from "node:test";
import assert from "node:assert/strict";
import { newGame, attack, place } from "../src/rules.js";

// a: webring 3/2, neon 1/2, counter 2/3. b: construction 1/3, divider 3/3, neon 1/2 (hand-set from STATS).
const A = [{ name: "w", type: "webring" }, { name: "n", type: "neon" }, { name: "c", type: "counter" }];
const B = [{ name: "k", type: "construction" }, { name: "d", type: "divider" }, { name: "m", type: "neon" }];

test("an attack is placed on the defender's buttons; untapped ones that take damage hit back; damage stays", () => {
  const g = newGame(A, B, "a");
  assert.equal(attack(g, "a", [0, 2]), "At most 1 can attack this turn."); // a won the flip: 1 on the first turn
  g.limit = 2; // as from the second turn on
  assert.equal(attack(g, "a", [0, 1, 2]), "At most 2 can attack this turn.");
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
  assert.equal(g.sides.b.buttons[1].damage, 1);      // b's turn began: its divider untapped and healed 1 (2 -> 1)
});
