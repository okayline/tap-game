# UN/CLICK Changelog

Newest first. Times are Hawaii time (HST).

---

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
