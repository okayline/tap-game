// The Worker: the page, a new match link, and one Durable Object (Match) per match that holds the true board and its clock.
//   GET /                 a new match against the dummy (src/dummy.js): redirects to it
//   GET /m/<id>           the match page; GET /m/<id>/ws the match's WebSocket. You are seat a in every tab; the dummy is b.
// Real time: every message to the page carries the server's clock (now), so the page can show cooldowns against it.
import { DurableObject } from "cloudflare:workers";
import { newGame, start, swap, hit, dealDecks, autoFill } from "./rules.js";
import { dummyNext, dummyMove } from "./dummy.js";
import PAGE from "./page.html";

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      const id = env.MATCH.newUniqueId();
      await env.MATCH.get(id).setup(await commons(env));
      return Response.redirect(`${url.origin}/m/${id}`, 302);
    }
    const m = url.pathname.match(/^\/m\/([0-9a-f]{64})(\/ws)?$/);
    if (m && m[2]) return env.MATCH.get(env.MATCH.idFromString(m[1])).fetch(req);
    if (m) return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8" } });
    return new Response("Not found", { status: 404 });
  },
};

// 88x31's common buttons, from the shared item table (dungeon-items, through the ITEMS service binding).
async function commons(env) {
  const r = await env.ITEMS.fetch("https://items/api/items?source=88x31&rarity=common");
  const { items } = await r.json();
  return items.map((it) => ({ id: it.id, name: it.name, type: it.type, image: it.image }));
}

export class Match extends DurableObject {
  async setup(pool) {
    await this.ctx.storage.put("g", newGame(...dealDecks(pool)));
  }

  async fetch(req) {
    if (req.headers.get("Upgrade") !== "websocket") return new Response("Expected a WebSocket", { status: 426 });
    const g = await this.ctx.storage.get("g");
    if (!g) return new Response("No such match", { status: 404 });
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.send(JSON.stringify({ g, now: Date.now() }));
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, msg) {
    const g = await this.ctx.storage.get("g");
    if (!g.rt) return ws.send(JSON.stringify({ error: "This match is from the turn-based version." }));
    let a;
    try { a = JSON.parse(msg); } catch { return; }
    const now = Date.now();
    const err =
      a.do === "start" ? start(g, now) :
      a.do === "swap" ? swap(g, "a", a.i, a.j) :
      a.do === "hit" ? hit(g, "a", a.i, a.t, now) : "Unknown action.";
    if (err) return ws.send(JSON.stringify({ error: err }));
    await this.save(g);
  }

  // Run the dummy for anything due, save, set the alarm for its next move, and send the board to everyone.
  async save(g) {
    const now = Date.now();
    autoFill(g, "b");
    for (let k = 0, mv; k < 3 && (mv = dummyMove(g, now)); k++) { hit(g, "b", mv[0], mv[1], now); autoFill(g, "b"); }
    await this.ctx.storage.put("g", g);
    const next = dummyNext(g);
    if (next) await this.ctx.storage.setAlarm(Math.max(next, now + 50));
    for (const ws of this.ctx.getWebSockets()) ws.send(JSON.stringify({ g, now }));
  }

  // The alarm: the dummy may have a move due.
  async alarm() {
    const g = await this.ctx.storage.get("g");
    if (g?.rt && g.started && !g.winner) await this.save(g);
  }
}
