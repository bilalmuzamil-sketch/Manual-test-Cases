# WIP design-review Aug-20b — Rule-49 RE-CHECK QUEUE

**STATUS: OPEN.** Two cases carry `AUTOMATION: HOLD - needs one live build check`
because their behaviour (the tab-selection amber glow, and the two-row label wrap)
was **NOT** observed in the prior live evidence
(`build/report-suite/spec-deltas-2026-08-19/wip-story5-live-evidence-2026-08-20.md`,
which covered only the seven summary figures, tooltips, grouped math and tab counts),
and the authenticated staging session was **DEAD (401)** in this pass. Expected
behaviour is written from the design review (a document — Rule 57); it has not been
build-verified.

**Build at authoring:** v3.8-d0e135e (last-modified Wed 19 Aug 2026 13:27:07 GMT,
etag `aa6ea37f82dd0af1b3fe6da5dfd65573`) — no redeploy since the prior evidence.

**RE-CHECK TRIGGER:** the moment authenticated `.staging.shopview.com` cookies return.
Drive /reports/work-in-progress live, observe each row's behaviour, flip the marker to
`AUTOMATION: READY` (if present + matches) or the under-development treatment (if the
feature is genuinely not found — Rules 69/74), re-stamp Rule-54 sentence 2 with the
build marker + date, and close the row. **A row closes only when re-verified (Rule 17).**

| C-id | Title | What to confirm live | Marker now |
|---|---|---|---|
| [C43838](https://shopview.testrail.io/index.php?/cases/view/43838) | Selecting a bucket tab glows its composing summary widgets (amber) | Click each line-state tab; confirm a faded amber glow sits BEHIND the composing summary figure(s) per the mapping (Approved - Partially Completed -> both Open-Work-Orders figures; Approved - Not Started -> Work Orders Not Started; Completed -> Work Orders Ready to Invoice; Estimates -> Estimates), only the selected tab's figures glow, and pin the exact amber shade + glow style (outline/underline/shadow) — do not invent a hex. | HOLD - needs one live build check |
| [C43984](https://shopview.testrail.io/index.php?/cases/view/43984) | Long summary-figure and column labels wrap to a second row, no truncation | Confirm a long summary-figure label / column header wraps onto a second row (not mid-word truncation, no ellipsis) on the build. | HOLD - needs one live build check |
