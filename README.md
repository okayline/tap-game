# tap-game

A tap/untap button duel with 88x31 buttons, to work out mechanics. One Cloudflare Worker, one Durable Object per match.

- `/` start a match: against the scripted dummy, or a friend link (open it in a second tab).
- The dummy's moves are in `src/dummy.js`; edit `SCRIPT` to try a situation.
- Needs the `dungeon-items` Worker deployed (the `ITEMS` service binding reads its item table).

Run locally: `npm install`, then `npx wrangler dev`. Deploy: connect this repo in Cloudflare (Workers), or `npx wrangler deploy`.
