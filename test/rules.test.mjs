import { test } from "node:test";
import assert from "node:assert/strict";
import { newGame, attack, block } from "../src/rules.js";

// a: webring 3/1, neon 1/1, counter 2/2. b: construction 1/2, divider 3/2, neon 1/1 (hand-set from STATS).
const A = [{ name: "w", type: "webring" }, { name: "n", type: "neon" }, { name: "c", type: "counter" }];
const B = [{ name: "k", type: "construction" }, { name: "d", type: "divider" }, { name: "m", type: "neon" }];

test("an attack: blocked fights by power and toughness, unblocked hits hp, attackers stay tapped", () => {
  const g = newGame(A, B);
  assert.equal(attack(g, "a", [0, 1, 2]), null);
  // b: divider (3/2) blocks webring (3/1), construction (1/2) blocks counter (2/2); neon (1/1) gets through
  assert.equal(block(g, "b", { 1: 0, 0: 2 }), null);
  assert.equal(g.sides.a.buttons[0].out, true);  // webring takes 3, toughness 1
  assert.equal(g.sides.b.buttons[1].out, true);  // divider takes 3, toughness 2
  assert.equal(g.sides.a.buttons[2].out, false); // counter takes 1, toughness 2
  assert.equal(g.sides.b.buttons[0].out, true);  // construction takes 2, toughness 2
  assert.equal(g.sides.b.hp, 4);                 // neon's 1
  assert.deepEqual(g.last.hp, 1);
  assert.equal(g.turn, "b");
  assert.equal(g.sides.a.buttons[2].tapped, true);
});
