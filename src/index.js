// The Worker: the page, a new match link, and one Durable Object (Match) per match that holds the true board.
//   GET /                 a new match against the scripted dummy (src/dummy.js): redirects to it
//   GET /m/<id>           the match page; GET /m/<id>/ws the match's WebSocket. You are seat a in every tab; the dummy is b.
import { DurableObject } from "cloudflare:workers";
import { newGame, attack, place, swap, dealDecks, autoFill } from "./rules.js";

const PAUSE_MS = 1000; // the dummy waits this long before it attacks
import { dummyAttack, dummyPlace } from "./dummy.js";
import PAGE from "./page.html";

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      const id = env.MATCH.newUniqueId();
      await env.MATCH.get(id).setup(await buttons(env));
      return Response.redirect(`${url.origin}/m/${id}`, 302);
    }
    const m = url.pathname.match(/^\/m\/([0-9a-f]{64})(\/ws)?$/);
    if (m && m[2]) return env.MATCH.get(env.MATCH.idFromString(m[1])).fetch(req);
    if (m) return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8" } });
    return new Response("Not found", { status: 404 });
  },
};

// 88x31's buttons of every rarity, from the shared item table (dungeon-items, through the ITEMS service binding). Rarity changes
// nothing in a match: power and toughness come from the type (kura, Nov 3: rares "just show up").
async function buttons(env) {
  const r = await env.ITEMS.fetch("https://items/api/items?source=88x31");
  const { items } = await r.json();
  return items.map((it) => ({ id: it.id, name: it.name, type: it.type, rarity: it.rarity, series: it.extra?.series ?? null, image: it.image }));
}

export class Match extends DurableObject {
  async setup(pool) {
    const g = newGame(...dealDecks(pool));
    g.dummyTurn = 0; // if the dummy won the flip, it waits for you to press start (so you can swap first)
    await this.ctx.storage.put("g", g);
  }

  async fetch(req) {
    if (req.headers.get("Upgrade") !== "websocket") return new Response("Expected a WebSocket", { status: 426 });
    const g = await this.ctx.storage.get("g");
    if (!g) return new Response("No such match", { status: 404 });
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.send(JSON.stringify({ g }));
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, msg) {
    const seat = "a";
    const g = await this.ctx.storage.get("g");
    let a;
    try { a = JSON.parse(msg); } catch { return; }
    const err =
      a.do === "attack" && Array.isArray(a.idxs) ? attack(g, seat, a.idxs) :
      a.do === "take" && a.split && typeof a.split === "object" ? place(g, seat, a.split) :
      a.do === "swap" ? swap(g, seat, a.i, a.j) :
      a.do === "start" ? (g.locked || g.turn !== "b" ? "Nothing to start." : ((g.locked = true), null)) : "Unknown action.";
    if (err) return ws.send(JSON.stringify({ error: err }));
    await this.save(g);
  }

  // Save, run the dummy if it's its move, set its pause alarm, and send the board to everyone.
  async save(g) {
    this.dummy(g);
    await this.ctx.storage.put("g", g);
    if (g.dummyAt) await this.ctx.storage.setAlarm(g.dummyAt);
    for (const ws of this.ctx.getWebSockets()) ws.send(JSON.stringify({ g }));
  }

  // The dummy is seat b: it places your attack on its buttons at once; on its turn it waits PAUSE_MS (so you can read the result of
  // your attack), then attacks by SCRIPT and waits for you to place it.
  dummy(g) {
    if (g.winner) return;
    if (g.attack && g.attack.by === "a") place(g, "b", dummyPlace(g));
    if (g.winner || g.turn !== "b" || g.attack || g.locked === false) return; // false: waiting for start (older matches have no lock)
    if (!g.dummyAt) { g.dummyAt = Date.now() + PAUSE_MS; return; }
    if (Date.now() < g.dummyAt) return;
    g.dummyAt = null;
    autoFill(g, "b");
    attack(g, "b", dummyAttack(g));
    g.dummyTurn++;
  }

  // The alarm: the dummy's pause is over.
  async alarm() {
    const g = await this.ctx.storage.get("g");
    if (!g?.dummyAt || Date.now() < g.dummyAt) return;
    await this.save(g);
  }
}
