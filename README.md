# tap-game

**UN/TAP**: a tap/untap button duel with 88x31 buttons, to work out mechanics. One Cloudflare Worker, one Durable Object per match.

- `/` starts a new match against the scripted dummy.
- The dummy's moves are in `src/dummy.js`: edit `SCRIPT` to set how many it pings with each turn; where it takes your pings, it works out from the board.
- Needs the `dungeon-items` Worker deployed first (the `REGISTRY` service binding deals from its item table: `dealPool`).

Run locally: `npm install`, then `npx wrangler dev`. Deploy: connect this repo in Cloudflare (Workers), or `npx wrangler deploy`.
