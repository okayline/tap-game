# tap-game Changelog

Newest first. Times are Hawaii time (HST).

---

## v0.4 "Declare Attackers"
**Mon Nov 2, 2026 · 11:24 PM HST** (no migration)
- kura: "the attack all at once way. the player taps or untaps the buttons then presses" ... "it should say "attack" !"; power/toughness balanced by how many of each type exist ("we have the most neon so that shouldn't be the most powerful button"); "have divider be 3/2"; a button that loses a fight "should leave the fight !"
- Changed: on your turn you click ready buttons to tap or untap them, then press attack (with none, it passes). The other side gets 6 seconds to block: click one of your ready buttons, then the attacker it blocks (click it again to undo), then block. Blocking doesn't tap. A blocked attacker and its blockers deal their power to each other; a button that takes its toughness or more is out of the match (faded). Unblocked attackers hit hp. Power/toughness by type (`STATS` in `src/rules.js`): neon 1/1, guestbook 1/2, construction 0/3, counter 2/2, webring 3/1, divider 3/2. The dummy's script lines are now how many it attacks with and how it blocks (always, never, or at most n). The one test now covers a whole attack.
- Removed: hitting one button at a time, the block per hit, "take the hit", "end turn", blocking tapping the blocker, and the dummy's per-hit script.
- Not checked: the live site; the page in a browser.

## v0.3 "Lights On"
**Mon Nov 2, 2026 · 11:12 PM HST** (no migration)
- kura: "could you make the buttons all start in an untapped / vertical position. when they are untapped could they be greyed out. then tapped, they turn on and are the normal button?"
- Changed: an untapped (ready) button now stands vertical (31x88) and grey; tapping it turns it sideways into the normal coloured 88x31 button.
- Removed: untapped buttons showing flat in full colour, and tapped ones showing sideways at 60% opacity.
- Not checked: the live site.

## v0.2 "Straight In"
**Mon Nov 2, 2026 · 11:08 PM HST** (no migration)
- kura: "can it just go into the "tap" main page instead of have the "play the dummy" page ? we dont need the friend link !"
- Changed: opening `/` starts a new match against the dummy straight away (it redirects to the match's own link). Every tab on a match link plays as you.
- Removed: the start page with its two links, `/new`, the friend link (`?vs=friend`, seat b for a second tab), watching from a third tab, and the `vs` setting on a match.
- Not checked: the live site after this change.

## v0.1 "First Tap"
**Mon Nov 2, 2026 · 11:02 PM HST** (no migration)
- kura: "can we build it please? just to work out some mechanics", with a preset second player for testing alone.
- Added: a Worker (`src/index.js`) with one Durable Object per match (`Match`) that holds the board and sends it to every open tab over a WebSocket. The rules (`src/rules.js`): 5 hp a side, 3 buttons each, picked at random from 88x31's commons in the shared item table (service binding `ITEMS` to dungeon-items). On your turn your buttons untap and you tap them to hit; each hit gives the other side 4 seconds to tap a ready button to block, or it lands for 1. Buttons only untap on their own side's turn. A tapped button shows sideways. `/new?vs=dummy` plays the scripted dummy (`src/dummy.js`, a looping list of turns: how many hits, and how it blocks); `/new?vs=friend` lets a second tab take seat b; a third tab watches. One test.
- Removed: nothing (new repo).
- Not checked: any of it running. npm was unreachable from the build workspace, so wrangler wasn't installed, nothing was built or run, and there is no `package-lock.json`.
