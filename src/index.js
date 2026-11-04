// The Worker: the page, a new match link, and one Durable Object (Match) per match that holds the true board.
//   GET /                 a new match against the scripted dummy (src/dummy.js): redirects to it
//   GET /m/<id>           the match page; GET /m/<id>/ws the match's WebSocket. You are seat a in every tab; the dummy is b.
//   GET /img/<n>          88x31 button n's GIF, from this site (img(), below)
import { DurableObject } from "cloudflare:workers";
import { newGame, attack, place, swap, dealDecks, autoFill } from "./rules.js";

const PAUSE_MS = 1000; // the dummy waits this long before it attacks
import { dummyAttack, dummyPlace } from "./dummy.js";
import PAGE from "./page.html";

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const im = url.pathname.match(/^\/img\/(\d+)$/);
    if (im) return img(im[1], req, ctx);
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

// 88x31's buttons of every rarity, from the shared item table's deal pool (dungeon-items' Registry entrypoint, through the REGISTRY
// service binding; kura, Nov 3: "all rarities show up", as mystery cards). The table keeps 88x31's non-commons secret: they come
// with their type, rarity and series but no name or picture, so here they get the name "a mystery button" (dungeon-items' own
// words for them) and a "?" picture. Uncommons come in full (kura, Nov 3: shown in UN/TAP only). Rarity changes nothing in a
// match: power and toughness come from the type.
const MYSTERY_IMG = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" viewBox="0 0 88 31"><rect width="88" height="31" fill="#2b3350"/>'
  + '<rect x="1.5" y="1.5" width="85" height="28" fill="none" stroke="#8fb6de" stroke-dasharray="3 2"/>'
  + '<text x="44" y="23" text-anchor="middle" font-family="monospace" font-size="20" font-weight="700" fill="#e98ab3">?</text></svg>');
async function buttons(env) {
  return (await env.REGISTRY.dealPool("88x31", { uncommons: true })).map((it) => (it.hidden
    ? { id: it.id, name: "a mystery button", type: it.type, rarity: it.rarity, series: it.series, image: MYSTERY_IMG, hidden: true }
    : { id: it.id, name: it.name, type: it.type, rarity: it.rarity, series: it.series, image: local(it.image) }));
}

// a button's picture comes from this site instead of 88x31.app (kura, Nov 3: the GIFs were very slow on a phone): 88x31's /api/img?d=N
// looks the button up in its database and redirects to the file, on another site, every time, and the deck row asks for its pictures again
// on every redraw. /img/N fetches it from 88x31 once, keeps it in Cloudflare's cache, and lets the browser keep it for a day, so a
// picture is one quick request on the game's own site. Any other picture address is left as it is.
const API_IMG = /^https:\/\/88x31\.app\/api\/img\?d=(\d+)$/;
const local = (image) => { const m = API_IMG.exec(image ?? ""); return m ? `/img/${m[1]}` : image; };
async function img(n, req, ctx) {
  const cache = caches.default, key = new Request(new URL(req.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  const r = await fetch(`https://88x31.app/api/img?d=${n}`);   // follows 88x31's redirect to the file
  if (!r.ok) return new Response(r.body, { status: r.status });
  const res = new Response(r.body, { headers: { "content-type": r.headers.get("content-type") ?? "image/gif", "cache-control": "public, max-age=86400" } });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
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
