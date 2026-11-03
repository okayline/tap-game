import { test } from "node:test";
import assert from "node:assert/strict";
import { newGame, hit, answer, endTurn } from "../src/rules.js";

const three = (p) => [1, 2, 3].map((n) => ({ id: n, name: p + n }));

test("a button that hit stays tapped through the other turn, so it can't block", () => {
  const g = newGame(three("a"), three("b"));
  assert.equal(hit(g, "a", 0), null);
  assert.equal(answer(g, "b", null), null);
  assert.equal(g.sides.b.hp, 4);
  assert.equal(endTurn(g, "a"), null);
  assert.equal(hit(g, "b", 0), null);
  assert.equal(answer(g, "a", 0), "That button is tapped.");
  assert.equal(answer(g, "a", 1), null);
  assert.equal(g.sides.a.hp, 5);
});
