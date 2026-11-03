# tap-game Changelog

Newest first. Times are Hawaii time (HST).

---

## v0.13 "This Turn"
**Mon Nov 2, 2026 · 11:40 PM HST** (no migration)
- kura: "next to YOU . HP 4 could we put "THIS TURN: 2/2" (the amount of my attack and defense that turn), it should change as i tap/untap the buttons"
- Added: "this turn: attack/defense" after your hp. Attack is the power of your buttons tapped or picked to attack; defense is the toughness of your ready buttons left to block. It changes as you pick. Footer v0.13.
- Removed: nothing.
- Not checked: the live site.

## v0.12 "Beat"
**Mon Nov 2, 2026 · 11:37 PM HST** (no migration)
- kura: "yeah can we have it pause for 1 second please" (before the dummy attacks, so the result of your attack can be read).
- Changed: after your attack resolves, the dummy waits 1 second (`PAUSE_MS` in `src/index.js`, run by the Durable Object's alarm) before it attacks. Footer v0.12.
- Removed: the dummy attacking in the same moment your attack resolved.
- Not checked: the live site; alarms timing on Cloudflare.

## v0.11 "Result Line"
**Mon Nov 2, 2026 · 11:35 PM HST** (no migration)
- kura: "after i do my turn, all the next events happen at once and it's hard to tell what happened ... could we put a "-4 health" result somewhere on the game screen ... remove the explainer text over the attack button ... put a status line there that shows "-4 health" or the result of the round?"
- Changed: the line above attack/block now shows the last attack's result: "dummy -4 health" or "you -4 health" (or "no damage", or "didn't attack"), then which buttons went out. The game keeps that result (`g.last` in `src/rules.js`). Footer v0.11.
- Removed: the explainer lines ("your turn: click buttons…", "they attack: click your button…", "their turn").
- Not checked: the live site.

## v0.10 "Big Buttons"
**Mon Nov 2, 2026 · 11:30 PM HST** (no migration)
- kura: "could we show the buttons a lot bigger? like 2x bigger? under the button, can we remove the type. so it just says (name) (dot) 1/2"
- Changed: buttons show at 2x (176x62, standing up 62x176), smaller on a narrow screen so three still fit across; the page is up to 620px wide; the label under a button is "name · power/toughness" at 13px. Footer v0.10.
- Removed: the 88x31 size, the type in the label, the 430px page width.
- Not checked: the live site, phone widths.

## v0.9 "Hard Hat"
**Mon Nov 2, 2026 · 11:26 PM HST** (no migration)
- kura: "construction is 1/2 please" (a hand of two constructions and an out guestbook couldn't deal any damage).
- Changed: construction is 1/2 in `STATS`; the test's construction-blocks-counter fight now puts the construction out. Footer v0.9.
- Removed: construction 0/3.
- Not checked: the live site.

## v0.8 "Aura Glow"
**Mon Nov 2, 2026 · 11:27 PM HST** (no migration)
- kura: "could you theme the page like aura-farm please"
- Changed: the page uses aura-farm's look (its colours, copied from its `public/index.html`): near-black with purple light, Impact headings, rounded glowing panels, the purple-to-pink gradient for attack and block, glowing status and timer. Tapped buttons glow pink, the dummy's attackers cyan, your picked blocker pink. Footer v0.8.
- Removed: the grey Windows-style look (#c0c0c0, inset borders, monospace page font).
- Not checked: the live site.

## v0.7 "Stand Up"
**Mon Nov 2, 2026 · 11:23 PM HST** (no migration)
- kura: "to me it makes more sense for the horizontal position to be "block" and the vertical position to be "attack" ... start the buttons in the horizontal, block, greyed out, untapped position. and then click to tap/activate / colorize them even though it's sideways"
- Changed: an untapped button lies flat (88x31) and grey; tapping it stands it up (31x88) in colour. Footer v0.7.
- Removed: untapped buttons standing vertical, and tapped ones lying flat.
- Not checked: the live site.

## v0.6 "No Mark"
**Mon Nov 2, 2026 · 11:20 PM HST** (no migration)
- kura: "okay off please !" (the 🄯 in the footer, as on 88x31, since many buttons remix other people's open-licensed art and this page shows no credits).
- Changed: the footer has `data-copy="no"` and reads `~*~88x31~*~ · § ≡ v0.6`.
- Removed: the 🄯 from the footer.
- Not checked: the live site.

## v0.5 "Version Line"
**Mon Nov 2, 2026 · 11:21 PM HST** (no migration)
- kura: "could you put a version number on the game page please, and increment it every version"
- Added: the shared footer every game shows (`/footer.js` from dungeon-items, drawn into `<div id="ddfoot">` under the log), with `data-version="v0.5"` in `src/page.html`; raised every version.
- Removed: nothing.
- Not checked: the live site.

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
