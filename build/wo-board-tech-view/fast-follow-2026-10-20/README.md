# WO Board: Fast-follow (20 Oct 2026)

QA lead, 20 Oct 2026: every case blocked on SV-11522 / SV-11524 goes to a new folder "Fast-follow", out of the test run, kept
as a case. Fast follow = worked on after the release. Reference (Chris Ward, Slack, 20 Oct 2026 04:10 +04):
https://shopview.slack.com/archives/C0C41RV3T3L/p1792455057423139 — "I've labelled these 2 as fast-follows ... it's a bit late in
the game to make these changes and successfully make it through regression testing, and these do not impede the users functionality".
The same reference is the Fast-follow section's description in TestRail.

- Found by script: 27 cases whose AUTOMATION line or Known problem note names SV-11522 or SV-11524 (`candidates.json`), all ours.
- Folder: section 87347 "Fast-follow" under group 13204. All 27 moved; content unchanged (`move-log.json`).
- Run 498: 297 -> 270, only the 27 removed, no other test changed (`run-update-log.json`). Their tests and 116 results were saved
  first (`before/run498-results-27-cases.json`).
- QA lead chose "Move all 27, plus copies": 17 of the 27 also check things in this release; copies of those checks without the
  fast-follow step are proposed in `COPIES-PROPOSAL.md`, waiting for his go-ahead.
