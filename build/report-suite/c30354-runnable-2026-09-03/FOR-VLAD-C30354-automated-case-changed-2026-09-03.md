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
- **`custom_automation_type`** — still `0` (untouched; see note below).

**Verification:** runnable gate `check_runnable_cases.py --cases 30354` → RUNNABLE (1/1);
served-page container scan → both edited fields `markdown fr-view`; API re-GET confirms Expected /
title / atmstatus unchanged.

**Open note (not acted on):** `custom_automation_type` is `0 (None)`, which the 2026-09-02 standing
rule says should never be left None. It was **left as-is** because the go-ahead was scoped to
"make it runnable" (preconds/steps only) — changing the automation-type field is a separate edit and
needs its own go-ahead. Flag for the QA lead.
