// The Worker: the page, a new match link, and one Durable Object (Match) per match that holds the true board.
//   GET /                 a new match against the scripted dummy (src/dummy.js): redirects to it
//   GET /m/<id>           the match page; GET /m/<id>/ws the match's WebSocket. You are seat a in every tab; the dummy is b.
import { DurableObject } from "cloudflare:workers";
import { newGame, attack, block, other, BLOCK_MS } from "./rules.js";

const PAUSE_MS = 1000; // the dummy waits this long before it attacks
import { dummyAttack, dummyBlocks } from "./dummy.js";
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

const pick = (list, n) => [...list].sort(() => Math.random() - 0.5).slice(0, n);

export class Match extends DurableObject {
  async setup(pool) {
    const g = newGame(pick(pool, 3), pick(pool, 3));
    g.dummyTurn = 0;
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
      a.do === "block" && a.blocks && typeof a.blocks === "object" ? block(g, seat, a.blocks) : "Unknown action.";
    if (err) return ws.send(JSON.stringify({ error: err }));
    await this.save(g);
  }

  // Save, run the dummy if it's its move, set the block timer, and send the board to everyone.
  async save(g) {
    this.dummy(g);
    if (g.attack && !g.attack.until) g.attack.until = Date.now() + BLOCK_MS;
    await this.ctx.storage.put("g", g);
    const next = g.attack ? g.attack.until : g.dummyAt;
    if (next) await this.ctx.storage.setAlarm(next);
    for (const ws of this.ctx.getWebSockets()) ws.send(JSON.stringify({ g }));
  }

  // The dummy is seat b: it blocks your attack at once; on its turn it waits PAUSE_MS (so you can read the result of
  // your attack), then attacks by SCRIPT and waits for your blocks.
  dummy(g) {
    if (g.winner) return;
    if (g.attack && g.attack.by === "a") block(g, "b", dummyBlocks(g));
    if (g.winner || g.turn !== "b" || g.attack) return;
    if (!g.dummyAt) { g.dummyAt = Date.now() + PAUSE_MS; return; }
    if (Date.now() < g.dummyAt) return;
    g.dummyAt = null;
    attack(g, "b", dummyAttack(g));
    g.dummyTurn++;
  }

  // An alarm: the block moment ran out (whatever wasn't blocked lands), or the dummy's pause is over.
  async alarm() {
    const g = await this.ctx.storage.get("g");
    if (!g) return;
    if (g.attack && Date.now() >= g.attack.until) block(g, other(g.attack.by), {});
    else if (!(g.dummyAt && Date.now() >= g.dummyAt)) return;
    await this.save(g);
  }
}
