# SV-11405 — Board View: card status uses the List's status pill with its red and blue counts

**Status: NOT POSTED YET. QA lead ruled 2026-10-18 (answer to the width question): "Not a fault" — width follows the column; cards have no column. Verdict PASSED. Staging redeployed 18 Oct to v26.40.19-31ad1e1 and the staging sign-in expired (401 sso_required), so the checks are re-run and a new film (no "needs a fix" narration) recorded on the new build before posting.** Film ready
(`/tmp/qa11310/vo05/sv11405-board-card-pill-staging-recording-voiceover.mp4`, ephemeral; data in `voiceover/`).

- Staging `v26.40.19-754919e`, 16–17 Oct 2026, window 1440 x 900; Production `v26.40.19-d2441a9` for List.
- Source: PRD 845185030 v64 S3-R5a, S3-R5, S6-R2a; ticket "How to check" (3 bullets).

## What passes (data/b05.json, b05c.json, st05.json)
- Pill height 22 px on every card at all three densities (compact 87 cards, regular 95, comfortable 77), same spot on
  each card (right inset 13/13/17 px, top 11/13/17 px by density), font 11 px / 600.
- Red service-action and blue parts-action counts with the List's tooltips — identical text on card and List for
  Estimate (S2-36237: "1 Line in Auth Req'd", "1 Part Requested"), Approved (S2-36736), In Progress (S2-17528:
  "5 Lines in Auth Req'd", "7 Parts Requested"), Ready For Review (S2-34941).
- Same label, background and text colour as List for Estimate, Approved, In Progress, Ready For Review, Complete,
  Invoiced; same width as List for all of those (67 / 72.4 / 80 / 114 / 71.5 / 64.2 px).

## The question (Paid width)
List's pill fills its Status column, so a pill's width follows the column, not the word: Paid is 58.5 px in List when
only Paid rows are on the page, 72.4 px otherwise (pw18.json; production List identical). Board View and Tech View draw
the pill at its own width: Paid 44.5 px. SV-11318 (already passed) applied S6-R2a "same widths as List's"; S2-R22 says
List is "narrower with only short statuses". Is the card's 44.5 px Paid pill correct, or must it match List's width?

## Still to do before posting (Rule 91 — not skipped)
- Board View cells not observed because the cards were off screen at capture: Ready For Review without counts
  (S2-36332) and Paid without counts (S2-36683). Observe both before the comment goes out.

## Gate
Not run (not posted).

## 2026-10-17/18 additions
- Hover text, both counts, card = List = Tech View: S2-34941 "1 Line in Auth Req'd" / "2 Parts Requested"; S2-17528 "5 Lines in Auth Req'd" / "7 Parts Requested" (`data/tips.log`).
- Mixed pages (`data/widths-mixed.json`): Tech View stretches every pill to its Status column like List (S2-363: Estimate, Approved, Paid all 114 px, column 130; S2-368: Complete and Approved 72.4, column 88.4). Board cards keep their own width (Estimate 67, Approved 72.4, Paid 44.5, Complete 71.5).
- Question put to the QA lead with those numbers; his answer: "Not a fault (Recommended)" — post SV-11405 PASSED, leave SV-11318 PASSED.
- Film v1 (`ev/sv11405-card-pill-staging-recording-voiceover.mp4`) says "still needs a fix" — superseded, not to be posted.

## 2026-10-19 — POSTED PASSED, comment 78951
- Re-check on v26.40.19-31ad1e1 (data/recheck-31ad1e1.json): 10 cards / 8 statuses — text, colours, counts identical to List and Tech View; hover text identical (S2-34941, S2-17528, both counts); pill 22 px; top 17 / right 17 px at Comfortable on 10/10 cards. S2-36332 and S2-36683 cards not found on screen (same statuses already covered).
- Film v2 (no "needs a fix" line; bridging captions after a first take showed a caption over a reloading page): 82.8 s → 39.6 s. Read back: green PASSED, 1024x351 + 1280x800, 7 table rows.
