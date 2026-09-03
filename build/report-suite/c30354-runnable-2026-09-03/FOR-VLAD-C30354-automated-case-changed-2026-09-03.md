# FOR VLAD — an AUTOMATED case was edited (Rule 65) — 2026-09-03

**Case:** [C30354](https://shopview.testrail.io/index.php?/cases/view/30354) —
"Filters; columns and sort are remembered per browser before the first fetch"
(Report Suite → Parts Velocity). **`custom_atmstatus = 3` (AUTOMATED).**

**Why it was touched:** the QA lead (Bilal) gave explicit go-ahead 2026-09-03 to make this case
**runnable by a manual tester** — its preconditions and steps were spec-level
("You are on the Parts Velocity report with data loaded" / "Set a non-default view: …") and a
tester could not follow them from the UI.

**What changed — preconditions and steps ONLY.** Both rewritten as the concrete UI route
(top nav → Reports → left menu PARTS → Parts Velocity → set Type/Date/Category/Turns-Yr/Revenue
sort → leave & return → reload). Written through the TestRail UI editor so they serve in the
`markdown fr-view` container.

**What was NOT changed (verified live before and after the write):**
- **Expected Results** — byte-for-byte identical, including the provenance line and the
  `AUTOMATION: READY` marker (still last).
- **Title** — unchanged.
- **`custom_atmstatus`** — still `3` (AUTOMATED).
- **`custom_automation_type`** — set `0 (None)` → **`2 (Functional)`** in a separate API-only write
  (QA lead go-ahead 2026-09-03). Functional = single-feature UI behaviour (remembered-view
  persistence within the Parts Velocity report); not Unit (no isolated calculation) and not E2E (no
  cross-feature journey). The write touched ONLY that field — preconds/steps/Expected are byte-identical
  and still serve `markdown fr-view` (served-page scan re-run after the type write).

**Verification:** runnable gate `check_runnable_cases.py --cases 30354` → RUNNABLE (1/1);
served-page container scan → all three fields `markdown fr-view`; API re-GET confirms Expected /
title / atmstatus (=3) unchanged across both writes; automation_type now `2`.
