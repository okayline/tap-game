# tap-game

**UN/CLICK**: a real-time tap/untap button duel with 88x31 buttons, to work out mechanics. One Cloudflare Worker, one Durable Object per match.

- `/` starts a new match against the scripted dummy.
- The dummy is in `src/dummy.js`: it hits `REACT_MS` after one of its buttons untaps, preferring your tapped buttons.
- Needs the `dungeon-items` Worker deployed (the `ITEMS` service binding reads its item table).

Run locally: `npm install`, then `npx wrangler dev`. Deploy: connect this repo in Cloudflare (Workers), or `npx wrangler deploy`.
