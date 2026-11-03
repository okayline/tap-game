import { test } from "node:test";
import assert from "node:assert/strict";
import { newGame, dealDecks, start, swap, hit } from "../src/rules.js";
import { dummyMove, REACT_MS } from "../src/dummy.js";

const btn = (name, type) => ({ name, type });

test("deal: same types on both sides, a 2-button type at most once, no button twice", () => {
  const pool = [0, 1, 2, 3].map((i) => btn("n" + i, "neon")).concat([btn("d0", "divider"), btn("d1", "divider")],
    [0, 1, 2, 3].map((i) => btn("w" + i, "webring")));
  for (let k = 0; k < 20; k++) {
    const [a, b] = dealDecks(pool, 5);
    assert.deepEqual(a.map((x) => x.type), b.map((x) => x.type));
    assert.ok(a.filter((x) => x.type === "divider").length <= 1);
    assert.equal(new Set([...a, ...b]).size, a.length + b.length);
  }
});

test("real time: hit, hit back only from untapped, cooldowns, knock-outs, bringing one in, winning", () => {
  // a: divider 3/3 (2.5 s), neon 1/2, neon 1/2, deck: neon. b: neon 1/2, webring 3/2 (3 s), neon 1/2, no deck.
  const g = newGame([btn("d", "divider"), btn("n1", "neon"), btn("n2", "neon"), btn("n3", "neon")],
    [btn("m1", "neon"), btn("w", "webring"), btn("m2", "neon")]);
  assert.equal(swap(g, "a", 1, 0), null);                       // before the start: free swaps
  assert.equal(g.sides.a.buttons[1].name, "n3");
  swap(g, "a", 1, 0);                                            // back
  assert.equal(hit(g, "a", 0, 0, 0), "Press start first.");
  start(g, 1000);
  assert.equal(swap(g, "a", 1, 0), "Once it starts, you can only bring one in where a button is out.");
  // divider hits the untapped webring: webring takes 3 (out), divider takes 3 back (out)
  assert.equal(hit(g, "a", 0, 1, 1000), null);
  assert.equal(g.sides.b.buttons[1].out, true);
  assert.equal(g.sides.a.buttons[0].out, true);
  // neon 1 hits neon m1 (untapped: takes 1 back); it is tapped for 4.5 s
  assert.equal(hit(g, "a", 1, 0, 1000), null);
  assert.equal(g.sides.a.buttons[1].damage, 1);
  assert.equal(hit(g, "a", 1, 2, 2000), "That button is still tapped.");
  assert.equal(hit(g, "a", 1, 2, 1000 + 4500), null);           // untapped again
  // m1 is tapped: neon 2 hits it and takes nothing back
  hit(g, "b", 0, 2, 1000); // m1 taps (hits a's neon 2 for 1; a's neon 2 is untapped, so m1 takes 1 back and goes out)
  assert.equal(g.sides.b.buttons[0].out, true);
  // bring in a's deck neon onto the divider's spot
  assert.equal(swap(g, "a", 0, 0), null);
  assert.equal(g.sides.a.buttons[0].name, "n3");
  assert.deepEqual(g.sides.a.gone.map((b) => b.name), ["d"]);
  // finish b: m2 is its last button
  hit(g, "a", 0, 2, 9000);
  hit(g, "a", 2, 2, 9000);
  assert.equal(g.winner, "a");
});

test("dummy: waits REACT_MS after untapping, prefers your tapped buttons", () => {
  const g = newGame([btn("n1", "neon"), btn("n2", "neon"), btn("n3", "neon")], [btn("m1", "neon"), btn("m2", "neon"), btn("m3", "neon")]);
  start(g, 0);
  assert.equal(dummyMove(g, REACT_MS - 1), null);
  hit(g, "a", 1, 2, 0);                                          // your n2 is now tapped
  assert.deepEqual(dummyMove(g, REACT_MS), [0, 1]);              // its first ready button hits your tapped n2
});
