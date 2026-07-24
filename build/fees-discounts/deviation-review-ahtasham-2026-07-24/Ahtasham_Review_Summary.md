# Fees & Discounts — QA Deviation Review (by Ahtasham)

_Converted from `43601fd9-FeesDiscounts_Deviation_Review_Summary.docx` (ingested 2026-07-24). Original .docx + .xlsx kept in this folder._

## Overview
Eleven Fees & Discounts test cases flagged as blocked/deviation were reviewed against the running app on staging and, where relevant, the SV-8479 UI-corrections ticket, the SV-8421 Processing-Fee-base bug, and the Fees & Discounts V1 spec. Each case was sorted into one of two outcomes: the case passes as written (no change, flip to READY), or the test case needs updating to match confirmed-intended build behavior.

**Result: 7 pass with no change, 4 need a test-case update, and no new bug tickets** — the two suspected calculation bugs (FDBUG-2 twins) were already fixed under SV-8421.

## Counts
- Total reviewed: **11**
- PASS — no change (flip to READY): **7** → 28450, 28456, 28462, 28490, 28511, 28527, 28580
- UPDATE test case: **4** → 28460, 30618, 28489, 28526
- New bug tickets created: **0**

## Case-by-case verdicts

| C-id | Verdict | Summary |
|------|---------|---------|
| 28450 | PASS | Part-line fee/discount stays attached (requested → received). Was env-blocked only; now verified per S5-R13. |
| 28456 | PASS | 'Show N more' toggle — all 4 expected results match; stale 'dev must build' note. |
| 28460 | UPDATE | Dropped untestable zero-value line ($0 now blocked everywhere). Edited in TestRail. |
| 28462 | PASS | Stats oldest-first (A,B,C) matches; dependency on 28460 layout now cleared. |
| 30618 | UPDATE | Menu placement LEFT→RIGHT; PO-accepted in SV-8479 (Done). |
| 28489 | UPDATE | Single-select→multi-select per spec S9-R20. Already edited in TestRail. |
| 28490 | PASS | 'No results' already expected; matches app (team accepted vs spec S9-R22). |
| 28511 | PASS | Template scoping in pickers verified; 'picker missing' blocker cleared. |
| 28526 | UPDATE | Edit+Remove → Remove-only; dev removed dead Edit (Processing Fee only), S8-R17. |
| 28527 | PASS | % Grand Total Processing Fee — FDBUG-2 / SV-8421 fix confirmed with live data ($16.70). |
| 28580 | PASS | Calc-contract twin of 28527; canonical $324 base → +$9.72, spec §5-R5. |

## Test-case edits he says he applied in TestRail
- 28489 — single-select → multi-select picker (S9-R20).
- 28460 — removed the zero-value precondition + expected-result line; renumbered.
- 30618 — flipped menu placement LEFT → RIGHT in steps, expected result, and References.
- 28526 — expected-result #1: 'shows Edit and Remove (Edit does nothing)' → 'shows Remove only, no Edit'.

## Open follow-ups (his)
- SV-8421 downstream: the corrected (smaller) Processing Fee gives less padding against the $0 subtotal floor on heavy-discount work orders — spot-check floor/credit cases **28582 / 28584 / 28555–28558**.
- SV-8421 QA note: a taxable whole-WO discount and a non-taxable whole-WO fee should also leave the Processing Fee base unchanged — spot-check.

## Ticket references
- SV-8479 (Done) — F&D UI corrections #2; PO accepted right-side kebab placement → basis for 30618 update.
- SV-8421 (Done, PR #2220) — % of Grand Total Processing Fee base bug (tracker 'FDBUG-2'); fix confirms 28527 and 28580 pass.
- Spec: Fees & Discounts V1 (Confluence) — S9-R20, S8-R17, S4/S5, §5-R4/R5 cited throughout.
