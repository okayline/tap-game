# UN/TAP Changelog

Newest first. Times are Hawaii time (HST).

---

## v0.158 "Quiet Fill" · Thu Nov 5, 3:20 AM
- A button coming in from the deck onto an out spot no longer writes a log line; its slide onto the field shows it. Removed: the "… comes in" log lines.

## v0.157 "No Wait" · Thu Nov 5, 3:18 AM
- A new log line starts sliding in as soon as it arrives; lines after it still come 0.45 s apart. Removed: the 0.35 s beat before a new line (v0.154).

## v0.156 "Every Line" · Thu Nov 5, 3:18 AM
- During a fight replay, the log's lines come in one at a time and slide in, like the others (after the 0.35 s beat, 0.45 s apart). Most lines come during a replay, which is why they still appeared at once. Removed: a replay beat showing all its lines at once.

## v0.155 "Even Decks" · Thu Nov 5, 3:16 AM
- Both deck rows spread their cards evenly across the panel's width, like the card rows. Removed: the deck cards bunching up on the left with a gap on the right.

## v0.154 "Breathing Room" · Thu Nov 5, 3:14 AM
- The log waits 0.35 s before it shows a new line. Your side has a little more room: 14px above your 3 cards (was 8px) and 18px between them and your deck (was 10px). The log has 5px above its top line (was 10px). Removed: new log lines showing the moment they arrive.

## v0.153 "Top Slide" · Thu Nov 5, 3:09 AM
- A new log line slides down into place from above the top edge, together with the lines below it, as it fades in. Removed: the new line appearing in place while only the lines below slid.

## v0.152 "A Bit Smaller" · Thu Nov 5, 3:07 AM
- The log's text is 16px. Removed: the 17px log text.

## v0.151 "Close Count" · Thu Nov 5, 3:06 AM
- "Turn X, move X" sits just right of the UN/TAP title, in white. Removed: it sitting at the far right of the title line in dim ink.

## v0.150 "Three Lines" · Thu Nov 5, 3:10 AM
- The log shows the 3 newest lines in bigger text (17px), the newest on top in bold, fading out towards the bottom like Rob's game. Removed: the 5-line log in 15px with each older line fainter, and the phone's own 3-line height (all screens are 3 lines now).

## v0.149 "Soft Scroll" · Thu Nov 5, 3:05 AM
- When a new line comes into the log, the lines below slide down over 0.3 s to make room and the new line fades in. Removed: the log's lines jumping down at once.

## v0.148 "Turn Lines" · Thu Nov 5, 3:05 AM
- A turn's line in the log reads "C:\> Turn 3. Player's turn." with the same number as the title's turn. Removed: the bare "Player's turn" line.

## v0.147 "Turn Count" · Thu Nov 5, 3:02 AM
- The title line shows "Turn X, move X" at the right. Every turn counts, both sides' (Magic style: whoever won the coin flip has Turn 1, the other side Turn 2). Move 1 is the ping, move 2 the other side placing it. Removed: nothing.

## v0.146 "Prodigal Proxy" · Thu Nov 5, 2:25 AM
- New printed effect, Prodigal Proxy (Magic's Prodigal Sorcerer): pick it to ping and click a guest card to aim it; it taps and deals 1 to that card at once, nothing hits it back, and there's nothing to place. It counts as one of the turn's pings and can't zap the turn it comes in. "ping" stays grey until every Proxy has a target, and its line goes only to its target. The guest aims its Proxies at your button with the least life. A zap that knocks out a side's last button wins. Removed: nothing.
- Fixed with it: a guest ping that arrives with damage already done (its Proxies' zaps) still draws its lines for you to place. Removed: the check that hid them after a replay.

## v0.145 "All Together" · Thu Nov 5, 2:02 AM
- Cards moving between the field and the deck rows slide at the same time again, 0.8 s. Removed: v0.141's one-at-a-time slides (kura: "take those off").

## v0.144 "Hands Off" · Thu Nov 5, 2:00 AM
- While you place the guest's ping, resting the mouse on a card doesn't open its big card. Pressing and holding on a touch screen still does. Removed: the mouse opening big cards while you place damage.

## v0.143 "Still Online" · Thu Nov 5, 2:00 AM
- An Always Online button's picture moves while you have it picked and while it pings, like a tapped one's, even though it doesn't tap. Removed: its picture staying still when picked.

## v0.142 "Flip First" · Thu Nov 5, 1:57 AM
- On a fresh match you can't pick a card or swap your top card until the coin flip has landed. Removed: picking a card (and sending its line out) before pressing "flip to start".

## v0.141 "One by One" · Thu Nov 5, 1:58 AM
- Cards moving between the field and the deck rows go one at a time, 0.8 s each: first every card leaving the field, then every card coming onto it. A deck row closing up moves with the first card coming in. Each card waits in its old place until its turn. Removed: all the moving cards sliding at the same time.

## v0.140 "Quick Close" · Thu Nov 5, 1:47 AM
- The fight replay's last beat holds 0.5 s after its glitch, so the turn passes (and the guest's ping comes) sooner. The damage number may still be rising when it does. Removed: the last beat's 1 s hold.

## v0.139 "Soft Untap" · Thu Nov 5, 1:50 AM
- When a side's turn starts, its tapped cards turn back up over 0.4 s instead of snapping. Tapping a card, and un-picking one you picked, still snap at once. The next board (such as the guest's ping) waits for the turn to finish, so its line starts from the card where it lands. Removed: cards snapping back up at the start of their turn.

## v0.138 "No Glow" · Wed Nov 4, 9:35 PM
- The panels and the log keep their soft dark shadow over the space. kura: "no glow please". Removed: the faint pink glow around their edges.

## v0.137 "Whole Sky" · Wed Nov 4, 9:28 PM
- The background is kura's whole space picture again (`public/space.jpg`, 2560 × 1440, 378 KB), with its bright orange stars and blue clouds. Removed: the upper-left crop (1800 × 1013).

## v0.136 "Deep Space" · Wed Nov 4, 9:26 PM
- The page's background is the upper-left corner of kura's space picture (`public/space.jpg`, 1800 × 1013, 171 KB), fixed behind everything, and the panels and the log float over it with a soft dark shadow and a faint pink glow. On a phone the panels float too, 6px in from the screen's edges, so the cards are a few pixels narrower. Removed: the flat midnight-blue background (it stays only as the colour shown until the picture loads), and the phone panels running edge to edge with square corners.

## v0.135 "Real Lines" · Wed Nov 4, 8:13 PM
- Every card's flavour line is now a real line from an old personal web page (mostly 1990s GeoCities pages, found on the oocities.org mirror, plus pages kura pasted in), with where each was found noted beside it in the code. 54 lines in all, 6 to 12 per button type. Neon, Construction and Counter share their lines with the blue game's cards. Removed: the 24 made-up lines (4 per type), such as "Best viewed in the dark." and "You are visitor #000042."

## v0.134 "Never Zero" · Wed Nov 4, 12:05 AM
- Read-Only still takes 1 less from a ping, but never less than 1, so a ping that lands on it always does something. Removed: Read-Only taking nothing from a 1-damage ping, which could leave a match stuck forever.

## v0.133 "Own Kind" · Tue Nov 3, 11:58 PM
- Glow and Webcounter count other buttons of their own type: a Webring with Glow gets +0/+1 for each other Webring on your field. Removed: Glow always counting Neons, and Webcounter always counting Guestbooks (itself included).

## v0.132 "Three More" · Tue Nov 3, 11:55 PM
- Three new printed effects: Virus (any damage it deals knocks a button out), Read-Only (can't ping; takes 1 less from each ping) and Backup (the first time it's knocked out, it's back with 1 life). No button has them yet. Removed: nothing.

## v0.131 "Printed" · Tue Nov 3, 11:25 PM
- Every common and uncommon button now has its own effect, printed on it: the same every match, like a Magic card. The two buttons in a deck slot still share a type, but their effects can differ. An uncommon has one effect, and Unicast can be it. Rares and up roll theirs, as before. Removed: commons and uncommons rolling a new effect every match, and uncommons always getting Unicast on top.

## v0.130 "Landed First" · Tue Nov 3, 8:40 PM
- Fixed (we think): a ping's line could start at the deck row. When your ping knocked out a guest card, its top card came in and started sliding up; if it had Broadband, the guest's ping with it could already be waiting, and its line was measured from the card mid-slide. The page now waits for every slide to land before it shows the next board. Removed: a new board being shown while cards were still sliding.

## v0.129 "Slow Slide" · Tue Nov 3, 8:20 PM
- Cards slide between the field and the deck rows slower: 0.8 s. Removed: the 0.5 s slide.

## v0.128 "Lit Flip" · Tue Nov 3, 8:19 PM
- The bar button stays lit pink while the coin flips (it still can't be pressed). Landing on "▼ you go first" keeps it pink until you pick a card and it becomes "ping"; landing on "▲ guest goes first" turns it grey. Removed: the flip and "▼ you go first" showing on a greyed-out button.

## v0.127 "Right Arrow" · Tue Nov 3, 8:17 PM
- Fixed: the coin flip's last arrow pointed at the loser (with 10 faces, the alternation ended on the wrong one), so it could land on ▼ and then say "▲ guest goes first". The flip now counts back from its last face, which is always the winner's. Removed: the arrow parity counted from the first face.

## v0.126 "Slower Flip" · Tue Nov 3, 8:15 PM
- The coin flip is slower (about 2.3 s), and after "▲ guest goes first" there's a beat (1 s, then the guest's own 1 s pause) before the guest pings. Removed: the 1.5 s flip, and the guest starting the moment the flip landed.

## v0.125 "Coin Flip" · Tue Nov 3, 8:15 PM
- A fresh match shows "flip to start" in the bar. Pressing it flips the button between ▲ (the guest, above the bar) and ▼ (you, below it), slowing down for about 1.5 s, and it lands on whoever goes first. If you won, it reads "▼ you go first" until you pick a card to ping with, then "ping". If the guest won, it reads "▲ guest goes first" and the guest pings. The winner is still decided when the match is made; the flip shows it. Removed: the "start" button (pressing flip to start now starts the guest's turn when it won) and its "start" text.

## v0.124 "Plain Title" · Tue Nov 3, 8:01 PM
- The UN/TAP title is plain text again (kura, Nov 3: a stray click shouldn't end a match, and no pop-ups); "new match" at the end of a match starts the next one. Removed: v0.123's title link.

## v0.123 "Title Link" · Tue Nov 3, 8:01 PM
- The UN/TAP title at the top left is a link to the main page, which starts a new match. It looks the same as before. Removed: nothing.

## v0.122 "Unicast, Overclock, Dial-Up" · Tue Nov 3, 7:58 PM
- The rarity extras have old-web names (kura, Nov 3): Exalted is now Unicast, Exert is Overclock, Phasing is Dial-Up. The log says "(unicast)" and "(overclocked)" on a ping, and a Dial-Up button "disconnects" and "reconnects". The rules are unchanged. Removed: the names Exalted, Exert and Phasing on screen, and "phases out" / "phases in" in the log.

## v0.121 "Tip" · Tue Nov 3, 7:57 PM
- A small line under your deck row says how to see a card up close: "Hold a card to see it up close." on a touch screen, "Hover over a card to see it up close." with a mouse. Removed: nothing.

## v0.120 "No Peek Mid-Fight" · Tue Nov 3, 7:55 PM
- With a mouse, the big card doesn't open from pressing ping or accept until the fight has played out, and one already open closes when you press them. Holding a card on a phone is unchanged, and you can still hover cards while you place the guest's ping. Removed: the big card popping up during a fight.

## v0.119 "Line Back" · Tue Nov 3, 7:52 PM
- Fixed: a ping that knocked out every button it hit drew no line and no glow (only the damage showed). Since v0.113 a knocked-out button's spot is filled from the top in the same update that ends the ping, and the replay looked for hit buttons on the field only, so it lost them; it now also looks in the deck and among the knocked-out buttons, and the knocked-out button shows its hit and goes out before the top card slides in. Removed: the replay looking only at the field.

## v0.118 "Slower Slide" · Tue Nov 3, 7:46 PM
- Cards slide between the field and the deck rows a little slower: 0.5 s. Removed: the 0.35 s slide.

## v0.117 "Slide" · Tue Nov 3, 7:48 PM
- Cards slide when they move between the field and a deck row (0.35 s): the top card grows from the deck into its field spot, a knocked-out or swapped-out button shrinks into its place in the deck row, and the deck closes up toward the left. Removed: cards jumping straight to their new place.

## v0.116 "Out To The Right" · Tue Nov 3, 7:43 PM
- In a deck row, knocked-out buttons always sit at the right, after the deck, and the deck closes up toward the left, so the top card is always the leftmost. Removed: a knocked-out button taking the spot of the card that replaced it.

## v0.115 "Longer Hover" · Tue Nov 3, 7:41 PM
- With a mouse, the big card opens once the mouse has stayed still on a card for 1.2 seconds. Holding on a phone is unchanged. Removed: the 1-second still wait.

## v0.114 "No Arrows" · Tue Nov 3, 7:40 PM
- While you place a ping, a button hit by both attackers shows only its damage; it still hits back the one the rule picks. Removed: the arrow (↖ ↑ ↗) pointing at the attacker it would hit back.

## v0.113 "Top Of The Deck" · Tue Nov 3, 7:45 PM
- Each side's deck is shuffled on its own, like a Magic library: both decks still hold the same kinds of buttons, in different orders, and the top 3 start on the field. A knocked-out spot is filled by the top card at the start of its side's next turn, with no choice (kura, Nov 3: "i don't really choose which button goes in anyways"). Your one swap a turn is now: drag your top card onto a field button; that button goes to the bottom of your deck. Your deck row shows your deck in order, top first; the guest's deck lies face down in the card back's stripes, and its knocked-out buttons stay face up.
- Removed: choosing which deck button fills a knocked-out spot (and the "bring in a button" step before pinging), swapping in any deck button, free swaps before the first ping, both decks in the same order, and seeing the guest's deck.

## v0.112 "Own Effects" · Tue Nov 3, 7:35 PM
- A button's main effect is its own, not its type's (kura, Nov 3: "it feels kind of stale having the same effects every game"; Magic prints an ability on each card): each deck slot rolls one of Always Online, Broadband, Webcounter, Glow, Lag Spike or Daemon when the decks are dealt, and both sides' buttons in that slot get it. Power and toughness still come from the type, and rarity extras still go on top. Glow counts the other Neons on your field and Webcounter the Guestbooks, whatever buttons have them. A match dealt before this keeps each type's old effect. Removed: each type always having the same effect.

## v0.111 "Rarity Effects" · Tue Nov 3, 7:30 PM
- Rarer buttons get an extra effect on top of their type's (kura, Nov 3: "more rare = more interesting effects"): uncommons get Exalted; rares get Exert or Exalted; prototypes get Phasing, Exert or Exalted. It's rolled when the decks are dealt, once per deck slot, so both sides' buttons in a slot get the same one. Commons are unchanged.
- Exalted: +1/+1 when it pings alone (its +1 toughness means it takes 1 less hit-back). Exert: click a picked button a second time to exert it (it shows ×2); it pings for double its power and stays tapped through your next turn. Phasing: at each of its side's turns it phases out or back in; phased out it's faded, and can't ping, take damage, hit back or count for Glow and Webcounter. The dummy exerts every attacker it can.
- The card's text box shows the second effect under the type's; on the big card a card with two effects has slightly smaller text so the flavour line still fits. The log says when a ping is exerted or exalted and when a button phases.
- Removed: rarity changing nothing in a match.

## v0.110 "Thinner Edge" · Tue Nov 3, 6:55 PM
- The big card's edge is thinner: 1 unit deep (1.5 was tried first, not released). Removed: the 2-unit edge.

## v0.109 "Half Turn Off" · Tue Nov 3, 6:53 PM
- With a mouse, an open big card now closes when it has turned a half turn (moving one small card's width sideways from where it opened), or when the mouse goes more than 16 px above or below the small card. Holding on a phone is unchanged. Removed: closing 16 px to the left or right of the small card.

## v0.108 "No Tooltips" · Tue Nov 3, 6:51 PM
- Resting the mouse on a card or deck button no longer brings up the browser's little name box (kura, Nov 3: the big card shows the card). Removed: the tooltips on field cards (name, or "came in this turn, can't ping"), deck buttons (name and power/life) and knocked-out deck buttons (name and "(out)").

## v0.107 "Wider Still" · Tue Nov 3, 6:50 PM
- With a mouse, an open big card stays open until the mouse is more than 16 px past the small card, which reaches a little into the next card. Resting still on that next card opens its own big card, and from then on the first card no longer turns or closes it. Removed: the 8 px range.

## v0.106 "Wider Turn" · Tue Nov 3, 6:49 PM
- With a mouse, an open big card stays open (and keeps turning) until the mouse is more than 8 px past the small card's edge, about as far as the next card's pink dotted outline. Removed: the big card closing as soon as the mouse left the small card.

## v0.105 "Thick Card" · Tue Nov 3, 6:46 PM
- The big card has a little thickness: turned, it shows an edge in a darker frame blue between front and back (2 units deep, made of 8 thin layers). Removed: the paper-thin turn, with front and back in the same plane.

## v0.104 "Blue Back" · Tue Nov 3, 6:44 PM
- The big card's back keeps club's diagonal stripes, now in the light blue of the card front's frame (that blue and a slightly darker one), so the front's edge seems to run round onto the back. Removed: the navy stripes, and the back's silver border (it broke the edge where front and back meet).

## v0.103 "Longer Still" · Tue Nov 3, 6:39 PM
- With a mouse, the big card opens once the mouse has stayed still on a card for 1 second; any move still starts the wait again. Holding on a phone is unchanged. Removed: the 0.8-second still wait.

## v0.102 "Slow Turn" · Tue Nov 3, 6:39 PM
- The big card turns at half the speed: on a phone a 240 px slide turns it to its back; with a mouse the small card's width is half a turn, so it never goes all the way round. Removed: the 120 px phone turn to the back, and a whole turn across the small card's width.

## v0.101 "Plain Back" · Tue Nov 3, 6:37 PM
- The big card's back is just club's navy stripes and silver border. Removed: the yellow "?" on it.

## v0.100 "Card Back" · Tue Nov 3, 6:33 PM
- The open big card turns as you move: on a phone, slide the finger you're holding with sideways (120 px turns it over); with a mouse, move across the small card (its width is a whole turn). Past a quarter turn you see its back, 88x31 club's face-down card: navy stripes and a yellow "?". Sliding a finger on a field card or deck button no longer counts as a pan, so it doesn't cancel the hold (pinch zoom still works). Removed: the big card only ever facing front.

## v0.99 "Still Hover" · Tue Nov 3, 6:30 PM
- With a mouse, the big card opens once the mouse has stayed still on a card for 0.8 seconds; any move over the card starts the wait again, so moving across it never opens it. Once open it stays until the mouse leaves the card. Holding on a phone is unchanged. Removed: the big card opening 1 second after the mouse entered a card, moving or not.

## v0.98 "Auto Hit-Back" · Tue Nov 3, 6:26 PM
- A button hit by both attackers picks whom it hits back by itself: the one its hit-back would knock out, if only one; otherwise the one with the least life left; otherwise the one that put the most damage on it; otherwise the first picked. The arrow on it still shows whom it will hit, and the dummy's buttons follow the same rule. Clicking your button only adds damage or clears it again. Removed: clicking a button hit by both to turn its arrow, and the dummy's buttons always hitting back the first attacker.

## v0.97 "Slower Hover" · Tue Nov 3, 6:17 PM
- With a mouse, the big card opens after resting on a card for 1 second; holding on a phone is unchanged (about half a second). Removed: the 0.8-second mouse hover.

## v0.96 "Slow Hover" · Tue Nov 3, 6:12 PM
- With a mouse, the big card opens after resting on a card for 0.8 seconds; holding on a phone still opens it after about half a second. The footer shows this version (v0.95 went out with the footer still saying v0.94). Removed: the half-second mouse hover, and the footer's old v0.94.

## v0.95 "Paired Hit-Back" · Tue Nov 3, 6:03 PM
- You place each attacker's ping on your buttons separately: click one of their attacking cards to pick whose ping you're placing (it moves on to the next one when it's all placed), then click your buttons as before. A button hits back the attacker that hit it. A button hit by both hits back only one of them, at its full power: an arrow on it points at that one, and clicking it once everything is placed turns it to the other (a second click clears it). Hit-back past an attacker's life is lost. The dummy places the same way, and a button of its hit by both hits back the first attacker. The log says whom each button hits back. Removed: one total to place for the whole ping, and hit-back pooled and spread over the attackers in order.

## v0.94 "Small Flavour" · Tue Nov 3, 10:15 AM
- The flavour line on the big card is a little smaller: 5.8 units instead of 6.8. Removed: the 6.8-unit flavour on the big card.

## v0.93 "Long Names" · Tue Nov 3, 10:30 AM
- Card names are 8.5 units again, and a name of 16 letters or more is 6.7. In Cinzel every seed name of 15 letters or fewer fits at 8.5, and the 8 longer ones (and "a mystery button") fit at 6.7; checked on a 390px phone and a 1280px desktop. Removed: v0.92's single 6.7 size for every name.

## v0.92 "Names Fit" · Tue Nov 3, 10:25 AM
- Every card name is 6.7 units, the largest size at which all 52 seed names and "a mystery button" fit the pink bar in Cinzel (checked with Cinzel loaded, on a 390px phone and a 1280px desktop). v0.87's check had used a fallback font, so 8 long names were cut off from v0.87 to v0.91. Removed: the 8.5-unit names.

## v0.91 "Big Card" · Tue Nov 3, 10:20 AM
- Hold a card or deck button still for about half a second (or rest the mouse on it) to see it as a big card in the middle of the screen, with its flavour line; letting go or moving off closes it. A hold doesn't also tap, swap or drop the button, and moving your finger first still drags as before. Long presses on cards and deck buttons open no menu. Removed: the flavour line (and the line above it) on the normal cards.

## v0.90 "Guestbook Count" · Tue Nov 3, 10:05 AM
- Webcounter (Counter) now reads "+1/+0 for each Guestbook on your field": a Counter's power is its base plus the Guestbooks on its side's field, going up or down as they come in or go out, and back to its base in the deck. Its first card that names another type. Removed: Webcounter's +1/+0 each time it hits back, and the "gets +1/+0" log line.

## v0.89 "Quick Load" · Tue Nov 3, 9:55 AM
- Faster loading on phones. The fonts (Cinzel and EB Garamond, latin only, from npm's @fontsource, with their Open Font License files) are served from this site's new public/ folder and kept for a year. The shared footer script is deferred, so the game connects without waiting for it. Button pictures come from this site's new /img/N, which fetches each one from 88x31 once, keeps it in Cloudflare's cache and lets the browser keep it for a day. Removed: Google Fonts, the footer script holding up the game, and pictures loaded from 88x31.app/api/img (a database lookup and a redirect on every request).

## v0.88 "Accept" · Tue Nov 3, 9:35 AM
- The button for taking a ping says "accept 1" instead of "take 1", and "port 2 more" instead of "place 2 more" while you're still choosing. Removed: the words "take" and "place" on that button.

## v0.87 "Name Size" · Tue Nov 3, 9:35 AM
- Card names are bigger: 8.5 units on every card, in the same 12-unit pink bar. All 52 button names and "a mystery button" still fit. Removed: v0.86's 7.5-unit names.

## v0.86 "Name Bar" · Tue Nov 3, 9:40 AM
- Every card's name is the same size, a little smaller (7.5 units, on phones and desktop), and the pink name bar is shorter (12 units instead of 15). All 52 button names and "a mystery button" fit at that size. Removed: names sized by their length (8.5 units for short names, smaller for long ones) and the 20% bigger names on phones.

## v0.85 "A Little Shorter" · Tue Nov 3, 9:30 AM
- On a phone the cards are shorter: 168 units tall instead of 184 (about 190px on a 390px-wide phone, was 208), with the card text 20% bigger than the desktop size instead of 30%, so the longest effect and flavour still fit. Removed: v0.84's 184-unit height and 30% bigger text.

## v0.84 "Big Text" · Tue Nov 3, 9:40 AM
- On a phone the card text is 30% bigger (name, effect, flavour and the P/T box; the type line keeps its size so the set sign fits), and every card is the same taller height, set so the longest effect and flavour fit: 184 units instead of 150 (about 208px tall on a 390px-wide phone). A long name still shrinks to fit. The log shows 3 lines on a phone instead of 5. Removed: the 150-unit card height and the 5-line log on phones.

## v0.83 "Edge to Edge" · Tue Nov 3, 9:25 AM
- On a phone the two panels run to the screen's edges (square corners, no side borders, 4px inside), so the cards are as wide as three across allows: about 122px on a 390px-wide phone. The deck row sits 4px further in, so its dashed outlines stay off the edges. The title, the button and the log keep a 6px margin. Removed: v0.82's 6px screen edges, 6px panel sides, panel side borders and rounded panel corners on phones.

## v0.82 "Phone Cards" · Tue Nov 3, 9:30 AM
- On a phone (500px wide or less) the space round the cards is trimmed, so the three cards fill the width: on a 390px-wide phone a card is about 115px wide instead of 99px. The deck row narrows to match. Removed: the 16px screen edges, 10px panel edges and 12px gaps between cards on phones (now 6px, 6px and 8px).

## v0.81 "Aim" · Tue Nov 3, 9:08 AM
- Tapping a card to ping draws its line out, forking into every guest card that can take damage; untapping takes it away. Pressing ping sends the glow down the branches to the cards hit, and the others turn grey. Lines lying on each other no longer look brighter. Removed: the line only appearing when you press ping, and one glow per line.

## v0.80 "Booster" · Tue Nov 3, 8:55 AM
- Decks are dealt like a booster pack: 5 commons, 2 uncommons, 1 rare and 1 wildcard, which is usually a common and sometimes something rarer. Uncommons show with their name and picture; rares and prototypes are still mystery buttons. Ultras aren't dealt. Removed: v0.79's one-mystery deck, and uncommons as mystery buttons.

## v0.79 "One Mystery" · Tue Nov 3, 8:41 AM
- Each deck has exactly one mystery button, and the other buttons are commons. Removed: decks where about half the buttons were mystery buttons.

## v0.78 "Daemon" · Tue Nov 3, 8:34 AM
- The guest's ping lines are blue (yours stay pink). The guest's deck row sits above its cards. Each side's total is called Firewall, with bigger, bold numbers. Construction's effect is renamed Daemon. Removed: the guest's pink ping lines, its deck row below its cards, the name Toughness, and Firewall as Construction's effect.

## v0.77 "Mystery Buttons" · Tue Nov 3, 8:20 AM
- Decks are dealt from 88x31 buttons of every rarity again. Buttons above common show up as mystery buttons: a "?" picture and no name or flavour, with their type, effect and stats as normal and the set sign in their rarity's colour. Removed: commons-only decks.

## v0.76 "Stay Down" · Tue Nov 3, 8:10 AM
- A button knocked out while tapped stays sideways until it's replaced. Removed: knocked-out buttons standing back up at the start of their side's turn.

## v0.75 "Glitch" · Tue Nov 3, 8:06 AM
- The ping line snakes around the button with right angles, so it's always in sight. When you take a ping, the branches to cards you didn't pick turn grey. A hit card glitches instead of shaking: one of tear, signal loss, glyph, mojibake or missing image, picked at random, and its damage number rises once the glitch is over. Each type has three subtypes, and a button always shows the same one. Removed: the line crossing over the button, the shake, and the single subtype per type (Neon is no longer a Sign).

## v0.74 "In Its Place" · Tue Nov 3, 7:41 AM
- When you bring a deck button in for a knocked-out one, the knocked-out one sits in the deck row where the new one was, instead of moving to the end. Removed: knocked-out buttons collecting at the right end of the deck row (older matches still show them there).

## v0.73 "Incoming" · Tue Nov 3, 7:38 AM
- When the guest pings you, its line forks into your cards and waits there while you choose; the glow only runs out, to the cards you picked, when you take. Removed: the glow running to all your cards as soon as the guest pinged.

## v0.72 "Ping" · Tue Nov 3, 7:31 AM
- A ping is drawn: a line runs at right angles from the pinging card to the cards it can reach, forking where it splits, and a glow runs out along it, bounces off the cards and comes back. Your ping goes to the cards it hit; the guest's ping goes to every card of yours that can take damage. Damage numbers (rising, while placing, and a hurt card's life) are one rose colour, and ping power is a matching blue. Removed: the darker red and the older blue for those numbers.

## v0.71 "Slower" · Tue Nov 3, 7:12 AM
- A fight's steps are a little slower: one second apart, and the damage numbers and shakes last longer. Removed: the quicker steps (0.7 seconds) and shorter numbers and shakes.

## v0.70 "Commons Again" · Tue Nov 3, 7:06 AM
- Decks are dealt from 88x31's common buttons only. This fixes the page stopping after two cards in v0.69. Cards snap sideways when they tap, as before v0.69. Removed: the other rarities in decks (v0.65), and the cards turning when they tap.

## v0.69 "Replay" · Tue Nov 3, 6:20 AM
- A fight plays out in steps instead of all at once: the attackers tap and light up, then the buttons that took damage shake and show how much, then the attackers that were hit back do the same, then the turn passes. The log keeps pace with each step. Cards turn when they tap and untap instead of jumping. Removed: the whole fight landing at once, and cards being redrawn from scratch on every change.

## v0.68 "Flavour Text" · Tue Nov 3, 5:55 AM
- Every card's text box has a made-up flavour line in quotes under its effect, after a thin line: one of four per type, picked by the button and the match, so it stays the same all match. The effect name is followed by a middle dot, and the card text is a little smaller so the flavour line clears the power/toughness box. Removed: the long dash after the effect name, and the bigger card text.

## v0.67 "Set Signs" · Tue Nov 3, 5:00 AM
- The sign at the right of the type line is the button's set: a globe for Series Alpha, a floppy disk for Series Beta, none for a button outside a series. It's coloured by rarity in pastel (common slate, uncommon aqua, rare butter, ultra pink, prototype silver). Removed: the same small button shape on every card, and its bright 88x31 colours.

## v0.66 "Type Line" · Tue Nov 3, 4:55 AM
- The type line reads like Magic's: the type and a made-up subtype (Neon — Sign, Guestbook — Entry, Construction — Site, Counter — Hits, Webring — Link, Divider — HR), and at the right a set and rarity symbol: a tiny button in 88x31's rarity colours (common ink, uncommon cyan, rare yellow, ultra magenta, prototype silver). Removed: "Button —" on every card.

## v0.65 "Every Rarity" · Tue Nov 3, 4:50 AM
- Decks are dealt from 88x31 buttons of every rarity (common, uncommon, rare, ultra, prototype), not only commons. Rarity changes nothing: power and toughness still come from the type. Removed: commons-only decks.

## v0.64 "PING" · Tue Nov 3, 4:45 AM
- Attacking is called pinging: the PING button, "Player pings for 3 with…" in the log, and the messages and card text. Divider's effect is renamed Lag Spike. Removed: the word "attack" on screen, and the name Ping for Divider's effect.

## v0.63 "Firewall Up" · Tue Nov 3, 4:40 AM
- Firewall changed: Construction can attack, tap and untap like any button again, and even tapped it hits back for 1 (Construction is 1/3 again). Removed: Construction not being able to attack, and its power of 2.

## v0.62 "UN/TAP" · Tue Nov 3, 4:35 AM
- The game is called UN/TAP. Removed: the name UN/CLICK (older entries below keep it).

## v0.61 "Hits Back for 2" · Tue Nov 3, 4:30 AM
- Firewall's card text says it hits back for 2. Removed: the shorter text "can't attack." alone.

## v0.60 "Glow, Ping, Firewall" · Tue Nov 3, 4:20 AM
- Neon has Glow: +0/+1 for each other Neon on your field (its life shows green when raised). Divider has Ping: when an attack has a Divider, a button the attack knocks out doesn't hit back. Construction has Firewall: it can't attack, and it hits back for 2 (Construction is now 2/3). All six types now have card text. Removed: Construction attacking, Construction's power of 1, and knocked-out buttons hitting back against a Divider's attack.

## v0.59 "Pastel Numbers" · Tue Nov 3, 4:10 AM
- The green (raised power) and red (damage) numbers in power/toughness boxes are lighter pastel shades. Removed: the darker green and red.

## v0.58 "C:\\>" · Tue Nov 3, 4:35 AM
- Each log line starts with a DOS prompt, C:\\>. Older log lines fade less: down to 50% for the bottom one. Removed: log lines with nothing before them, and the fade down to 25%.

## v0.57 "Guest #1337" · Tue Nov 3, 4:30 AM
- The dummy is called Guest #1337 and you are Player, on your panels and in the log (new matches). Removed: "dummy" and "you" on the panels, and the seat letters a and b in the log.

## v0.56 "Both Sides" · Tue Nov 3, 4:25 AM
- Toughness sits at the right of your top line, and the dummy gets its own at the right of its top line. Removed: toughness in the middle of your status line.

## v0.55 "Toughness" · Tue Nov 3, 4:20 AM
- Your status line also shows toughness: the life left on all your buttons still in the match (field and deck), out of all your buttons' toughness. A tapped card is shrunk a little more, so it no longer sticks out of the leftmost spot. Removed: tapped cards sticking out past their panel.

## v0.54 "Midnight" · Tue Nov 3, 4:15 AM
- The page background is midnight blue, and the footer is back to the shared footer's own light grey. Removed: the light sky-blue background, and this page's darker footer colour.

## v0.53 "Spotlight" · Tue Nov 3, 4:10 AM
- The panel of the side whose move it is stays lit and the other one dims: the side whose turn it is, or the defender while it places an attack. Neither is dimmed when the match is over. Removed: both panels always lit.

## v0.52 "Green and Red" · Tue Nov 3, 4:05 AM
- In a power/toughness box, the power is green when Webcounter has raised it, and the life left is red when the button has taken damage (field and deck row). Removed: all-dark numbers in every case.

## v0.51 "Broadband" · Tue Nov 3, 4:00 AM
- Webring buttons have Broadband: they can attack the turn they come in. Counter buttons have Webcounter: +1/+0 each time they hit back, for the rest of the match (their P/T box shows it). Both have card text. Removed: summoning sickness for Webrings, and Counters' fixed power.

## v0.50 "Always Online" · Tue Nov 3, 3:55 AM
- A card's picture only moves while the card is tapped (or picked to attack); a ready card shows a still picture in colour. Vigilant is renamed Always Online. Removed: moving pictures on ready cards, and the name Vigilant.

## v0.49 "Deck Boxes" · Tue Nov 3, 3:45 AM
- Deck row buttons show their power/toughness in a small box over the bottom-right corner of their picture, like the field cards. Removed: the numbers written under them.

## v0.48 "Vigilant" · Tue Nov 3, 3:40 AM
- Guestbook buttons are Vigilant: attacking doesn't tap them, so they can still hit back on the other side's turn. Their card text says so (the only card text so far). A picked Vigilant attacker is outlined instead of turned sideways. A knocked-out button's picture stops moving, on the field and in the deck row. Removed: Guestbook buttons tapping when they attack, and moving pictures on knocked-out buttons.

## v0.47 "Fit" · Tue Nov 3, 3:30 AM
- On a window too short for the whole screen, the screen shrinks to fit, like zooming out, so the cards stay full width. The footer line with the version number shows (it was light grey on the blue). Removed: cards shrinking on a short window.

## v0.46 "Grimoire Pastel" · Tue Nov 3, 3:35 AM
- New look: every button is a card like a Magic card (name bar, art, type line, an empty text box, power/toughness in a box on the text box's edge) in light pastel blue, pink and cream, with Cinzel and EB Garamond. Long names get a smaller font so they fit on one line. Cards shrink on a short window so the page still fits. Removed: the aura-farm look (purple glow, Impact, gradient buttons), and greyed-out ready buttons (all cards are in colour; tapped ones turn sideways).

## v0.45 "Summoning Sickness Too" · Tue Nov 3, 3:12 AM
- A button brought into a knocked-out spot after the first attack can't attack that turn either (it can still hit back), for you and the dummy. Removed: attacking with a button the same turn it came into a knocked-out spot.

## v0.44 "Tap In" · Tue Nov 3, 2:50 AM
- On your turn, when one of your buttons is knocked out, tapping a deck button brings it into that spot (dragging still works). Text on the game screen can't be selected any more. The log's older lines fade out, down to 25% for the bottom one. Removed: text selection on the game screen.

## v0.43 "Turns Again" · Tue Nov 3, 2:48 AM
- Back to turns: v0.41 as it was (decks of 9, attack and take, one swap a turn, summoning sickness). Removed: real time (tap yours then theirs, cooldowns, the grey-to-colour fade, the timed dummy). It's in git history as v0.42.

## v0.42 "Real Time" · Tue Nov 3, 2:44 AM
- No more turns. Press start, then tap one of your untapped buttons and one of theirs to hit it. If theirs is untapped, it hits back. A button that hits stays tapped for its type's cooldown (1/2: 4.5 s, 1/3: 4 s, 2/3: 3.5 s, 3/2: 3 s, 3/3: 2.5 s), shown counting down; a tapped button starts grey and fills back up with colour as it cools down, and a ready one is in full colour with a glow. Bring in a deck button onto a knocked-out spot any time. The dummy hits 0.7 s after one of its buttons untaps. Removed: turns, the coin flip, attacking with up to 2, placing damage, the attack and take buttons, one swap a turn, summoning sickness, and the dummy's script.

## v0.41 "Summoning Sickness" · Tue Nov 3, 2:33 AM
- A button you swap in during the match can't attack that turn (it can still hit back). Bringing one into a knocked-out spot, and swaps before the first attack, are not affected. Removed: swapping in and attacking in the same turn.

## v0.40 "X" · Tue Nov 3, 2:29 AM
- A knocked-out button on the field gets the X too, and loses its numbers. The X is half as long and fatter, on the field and in the deck row. Deck buttons you still have are in full colour; knocked-out ones stay greyed. Removed: the long thin X, the faded-out look of the whole spot, and the greyed-out deck row.

## v0.39 "Your Pick" · Tue Nov 3, 2:24 AM
- A knocked-out button stays greyed in its spot until you drag a deck button onto it on your turn ("bring in a button"); then it moves to the deck row, crossed out with no numbers. While attack is lit you can also make one swap a turn; a swapped-out button keeps its damage. The dummy still brings its next one in by itself. Removed: automatic refilling for you.

## v0.38 "Nine" · Tue Nov 3, 2:18 AM
- Decks are 9: 3 on the field, 6 in the deck row, which is now as wide as the field. Deck buttons are greyed out like ready buttons and show their power/toughness. Removed: decks of 6, and the coloured deck pictures.

## v0.37 "Old Matches" · Tue Nov 3, 2:15 AM
- A match started before v0.36 works again: its page drew nothing below the field (no take or attack button, no log) and its dummy would have stopped. Removed: nothing.

## v0.36 "Decks"
**Tue Nov 3, 2026 · 2:10 AM HST**
- Each side has a deck of 6: 3 on the field, the rest shown small below. Both decks have the same types. A button that's out is replaced from the deck at the start of your turn; you lose when field and deck are empty. Before the first attack, drag a deck button onto a field button to swap them. When the dummy goes first, press start. Removed: 3-button sides dealt at random.

## v0.35 "Short Notes" · Tue Nov 3, 12:28 AM
- Behind the scenes only: this changelog is now short. Removed: the long entries.

## v0.34 "No Rest" · Tue Nov 3, 12:22 AM
- Damage stays all match again. Removed: healing when buttons untap.

## v0.33 "Rest" · Tue Nov 3, 12:19 AM
- Buttons heal a little when they untap.

## v0.32 "Sturdier" · Tue Nov 3, 12:14 AM
- Every button is a bit tougher, so matches last longer.

## v0.31 "Five Lines" · Tue Nov 3, 12:10 AM
- The log shows the five newest lines. Removed: the longer, scrolling log.

## v0.30 "Coin Flip" · Tue Nov 3, 12:08 AM
- A coin flip decides who goes first, and the first turn is a little smaller. Removed: you always going first.

## v0.29 "Two Out" · Tue Nov 3, 12:05 AM
- At most two buttons attack a turn. Removed: attacking with all three.

## v0.28 "Smaller Stats" · Tue Nov 3, 12:04 AM
- Smaller numbers in the button corners.

## v0.27 "Level" · Mon Nov 2, 11:59 PM
- Corner numbers sit level with a soft glow. Removed: the tilt.

## v0.26 "Tilt" · Mon Nov 2, 11:58 PM
- Corner numbers smaller and tilted. Removed: their glow.

## v0.25 "Corner Stats" · Mon Nov 2, 11:56 PM
- Each button's numbers sit in its corner. Removed: the line under each button.

## v0.24 "Buttons Are HP" · Mon Nov 2, 11:55 PM
- Your buttons are your health: you place each attack on your own buttons, and some hit back. Removed: hit points and blocking.

## v0.23 "Always There" · Mon Nov 2, 11:51 PM
- The attack button stays on screen, greyed out while you wait. Removed: it vanishing.

## v0.22 "UN/CLICK" · Mon Nov 2, 11:49 PM
- The game is called UN/CLICK. Removed: the name "tap".

## v0.21 "Fixed Frame" · Mon Nov 2, 11:47 PM
- Shorter log; the page doesn't scroll. Removed: page scrolling.

## v0.20 "Again" · Mon Nov 2, 11:45 PM
- A new match button when a match ends.

## v0.19 "Ticker" · Mon Nov 2, 11:44 PM
- The log reads newest first, bigger, one line at a time.

## v0.18 "Quiet" · Mon Nov 2, 11:42 PM
- Removed: the attack result line.

## v0.17 "Right Side" · Mon Nov 2, 11:41 PM
- The result sits at the right, shorter.

## v0.16 "One Line" · Mon Nov 2, 11:40 PM
- Your status fits on one line.

## v0.15 "Status Area" · Mon Nov 2, 11:39 PM
- Your status moves into your panel.

## v0.14 "No Clock" · Mon Nov 2, 11:38 PM
- Removed: the time limit on defending.

## v0.13 "This Turn" · Mon Nov 2, 11:37 PM
- Your attack and defense for the turn show next to your name.

## v0.12 "Beat" · Mon Nov 2, 11:34 PM
- The dummy pauses a moment before it attacks.

## v0.11 "Result Line" · Mon Nov 2, 11:33 PM
- A line shows what the last attack did. Removed: the help text.

## v0.10 "Big Buttons" · Mon Nov 2, 11:29 PM
- Buttons twice as big.

## v0.9 "Hard Hat" · Mon Nov 2, 11:26 PM
- Construction buttons can hit now.

## v0.8 "Aura Glow" · Mon Nov 2, 11:23 PM
- New look, like aura-farm. Removed: the grey look.

## v0.7 "Stand Up" · Mon Nov 2, 11:22 PM
- Ready buttons lie flat; tapped ones stand up.

## v0.6 "No Mark" · Mon Nov 2, 11:19 PM
- Removed: the 🄯 in the footer.

## v0.5 "Version Line" · Mon Nov 2, 11:18 PM
- The footer with the version number.

## v0.4 "Declare Attackers" · Mon Nov 2, 11:16 PM
- Attack with several buttons at once; buttons have strength by type. Removed: one hit at a time.

## v0.3 "Lights On" · Mon Nov 2, 11:10 PM
- Ready buttons are grey; tapped ones light up.

## v0.2 "Straight In" · Mon Nov 2, 11:06 PM
- The main page starts a match. Removed: the start page and friend link.

## v0.1 "First Tap" · Mon Nov 2, 11:03 PM
- First version: a tap/untap duel with 88x31 buttons against a dummy.
