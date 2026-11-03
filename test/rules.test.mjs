import { test } from "node:test";
import assert from "node:assert/strict";
import { newGame, attack, place } from "../src/rules.js";

// a: webring 3/1, neon 1/1, counter 2/2. b: construction 1/2, divider 3/2, neon 1/1 (hand-set from STATS).
const A = [{ name: "w", type: "webring" }, { name: "n", type: "neon" }, { name: "c", type: "counter" }];
const B = [{ name: "k", type: "construction" }, { name: "d", type: "divider" }, { name: "m", type: "neon" }];

test("an attack is placed on the defender's buttons; untapped ones that take damage hit back; damage stays", () => {
  const g = newGame(A, B);
  assert.equal(attack(g, "a", [0, 1, 2]), "At most 2 can attack.");
  assert.equal(attack(g, "a", [0, 2]), null);      // webring 3 + counter 2 = 5
  assert.equal(place(g, "b", { 0: 2, 1: 2 }), "Place exactly 5.");
  // b puts 2 on construction, 2 on divider, 1 on neon: all three are out
  assert.equal(place(g, "b", { 0: 2, 1: 2, 2: 1 }), null);
  assert.deepEqual(g.sides.b.buttons.map((b) => b.out), [true, true, true]);
  // hit back: construction 1 + divider 3 + neon 1 = 5 over the attackers in order: webring takes 1 (out), counter takes 2 (out)
  assert.deepEqual(g.sides.a.buttons.map((b) => b.out), [true, false, true]);
  assert.equal(g.winner, "a");                       // b has no buttons left; a still has neon
});
