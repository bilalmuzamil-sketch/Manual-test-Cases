# Filters — Rule-49 re-check queue, re-armed 5 August 2026

**STATUS: OPEN.**

**Why it is open:** the QA branch `sv8785` has **not been declared final** by engineering. Under Standing
Rule 49 every observation taken from a non-final build is **PROVISIONAL**, however carefully it was made.

**Build this queue is armed against:** `v3.4.2-d00239b` · `index.html` last-modified **Tue, 04 Aug 2026
22:51:02 GMT** · etag `b9ab1d41718b5e871432064ed914e2e7` · sha256 of `index.html`
`d4845701337c6836b3513eb8be4c6d08f78ecd8a9ce8765bd0732e5789d480cd`. Read at **13:22:10Z, 14:13:35Z and
14:25:10Z** — byte-identical all three times.

**When to re-run:** at every session start; before and after any Filters work; and **immediately** when
the branch is declared final, when the app-version marker changes, or when a sign-in dies early (a dead
session on this estate usually means either the ordinary ~24 h expiry or a deploy).

**How to check for a deploy in one line:**
`curl -sS -D- -o/dev/null https://sv8785.qa.shopview.com/index.html` and compare `etag` against
`b9ab1d41718b5e871432064ed914e2e7`.

## Queues this one supersedes

- `cleanup-2026-08-05/RECHECK-QUEUE.md` — **CLOSED by this pass.** Its 8 phone rows were the whole
  reason it existed, and all 8 were observed live at a 390 × 844 viewport. Their markers moved off HOLD
  and their provenance is now state 2.
- `recheck-2026-08-05/RECHECK-QUEUE.md` — still open on the same grounds (branch not final); its 110
  rows are folded into the table below.

## The rows

All **110** cases are in the queue, because all 110 have a verdict taken from a non-final build. The
priority column says which ones would actually change if the build moved.

| Priority | Cases | What must be re-confirmed |
|---|---|---|
| **HIGH — observed live today, and the finding is the whole basis of a marker** | C29557 · C29601 · C29602 · C29606 · C29607 · C29618 · C29621–C29630 · C38897 · C38899 | The three closed-but-reproducing faults (SV-8843 bar beside the tabs; SV-8847 message and clear-query; SV-8845 phone ignores every filter link), the single-filter sheet applying on tap (SV-8875), and the missing phone Clear Filters (SV-8846). **If any is fixed, the marker must come off EXPECT FAIL.** |
| **HIGH — the exact button label** | C29622 · C29623 · C29624 | `"Apply Filters"` with a capital F. If Branko fixes the PRD casing or the build changes it, all three need the label re-read. |
| **MEDIUM — not built** | C38904–C38911 · C38882 | Whether any Parts or Reports filter bar has shipped. **These are `HOLD` only because the product is absent** — the moment it ships they become automatable. |
| **MEDIUM — passes that could regress** | C29560 · C29561 · C29562 · C29595 · C29597 · C29604 · C29605 · C29608 · C38883 · C38888 | Observed passing today. SV-8824 in particular was **fixed** since the 4 Aug pass, which proves this build does move. |
| **LOW — carried forward, not re-driven today** | the other 81, named individually in `FINDINGS.md` | Re-drive on the next full pass. Their verdicts came from 04:20–04:53Z **on this same build marker**, so they are the same build but not a fresh observation. |

## The one row that is not about the build

| Case | Blocker | Who |
|---|---|---|
| FLT-PERS-03 **C29615** | needs a **second test login** to prove one person's saved filters do not reach another. Not a tool limit — a genuinely absent second account. | the QA lead / whoever can provision a second QA user |

## Closing condition

This queue closes only when **the branch is declared final** and **all 110 rows are re-verified against
that final build**, with each row flipped to CONFIRMED or CHANGED on fresh evidence. **A row that flips
to CHANGED is a finding in its own right** and gets reported, not quietly corrected. No sampling
(Standing Rule 17).
