# SKATE — TODO

## Core Tasks (Next Up)

- [ ] Hook `TrickModal` to `allTricks` list and pass selected trick back to `GameScreen`
- [x] Show selected trick in middle of screen after choosing stance + trick
- [x] Update letters when player bails
- [x] Two goes when a player is on "E"
- [ ] End game when someone reaches S.K.A.T.E.

## Gameplay Logic

- [x] Turn switching (player ↔ opponent)
- [x] Opponent random trick + make/bail logic
- [ ] Trick should be removed from filteredTricks when landed
- [x] Player response logic (Make / Bail) adds letters correctly
- [ ] Save selected trick and stance for recap

## UI Polish

- [ ] NOT SURE I ACTUALLY LIKE THIS EARTHBOUND STYLE --- MAYBE CHANGE???
- [x] Background image + layout
- [ ] Animate TrickModal appearance/disappearance
- [ ] Add Earthbound-style typewriter text back later

## Notes

- `TrickModal` should only show tricks that include the chosen stance.
- After selecting a trick, close modal and show it in center text area.
- delete trick if landed
- Use `AsyncStorage` later for score saving.

---
