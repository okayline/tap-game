# tap-game Changelog

Newest first. Times are Hawaii time (HST).

---

## v0.1 "First Tap"
**Mon Nov 2, 2026 · 11:10 PM HST** (no migration)
- kura: "can we build it please? just to work out some mechanics", with a preset second player for testing alone.
- Added: a Worker (`src/index.js`) with one Durable Object per match (`Match`) that holds the board and sends it to every open tab over a WebSocket. The rules (`src/rules.js`): 5 hp a side, 3 buttons each, picked at random from 88x31's commons in the shared item table (service binding `ITEMS` to dungeon-items). On your turn your buttons untap and you tap them to hit; each hit gives the other side 4 seconds to tap a ready button to block, or it lands for 1. Buttons only untap on their own side's turn. A tapped button shows sideways. `/new?vs=dummy` plays the scripted dummy (`src/dummy.js`, a looping list of turns: how many hits, and how it blocks); `/new?vs=friend` lets a second tab take seat b; a third tab watches. One test.
- Removed: nothing (new repo).
- Not checked: any of it running. npm was unreachable from the build workspace, so wrangler wasn't installed, nothing was built or run, and there is no `package-lock.json`.
