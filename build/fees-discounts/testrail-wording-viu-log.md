# F&D — Combined wording-correction + VIU pass — per-case log (2026-07-13)

> QA-lead-authorized combined pass: rewrite Title/Preconditions/Steps/Expected to
> EXACT build labels in plain layman language (Standing Rule 9), VIU-verify behavior,
> then push corrected wording to TestRail (update_case only; GET→diff→update-changed→
> re-verify 200/200; skip no-ops). Build labels captured live — glossary in
> `wording-glossary-2026-07-13.md`; screenshots in `screenshots/wording-2026-07-13/`.
> FD→C-ID from `testrail-id-map.csv`. Fees & Discounts project only; no runs/results.

## Area: FD-WO (Work Order — Whole-WO Fee/Discount) — 16 cases — TESTER-READY

**Build terms corrected (notable):** ⋯ menu item is **'Add Fee/Discount'** (was
"Add Work Order Fee / Discount"); dialog title **'Add new fee/discount'** (was "New Fee
/ Discount"); dropdown **'Apply From Template'** (was "Apply from template (optional)");
**'Calculation Type'** options are exactly **Flat Amount / % of Labor Total / % of Parts
Total / % of Subtotal** (no generic "Percentage", no "% of Grand Total"); amount field is
**'$ Amount'** (flat) or **'Percent %'** (percentage); **'$ Max Amount (Optional)'** shows
only for percentage methods; **'Taxable'** is a Yes/No **toggle** (not a dropdown);
confirm button **'Add Fee' / 'Add Discount'**; sidebar card **'WO Fees & Discounts'** (was
"Work Order Fee / Discount"); preview empty prompt is exactly **'Enter an amount to see the
impact.'**. Also removed spec-ref/design-mockup jargon (S2-Rxx, §5-Rx, "design updateCalcUI()")
from tester-facing fields.

**VIU (fresh_run 2026-07-13):**
- Confirmed live today via UI (WO S3-15960): dialog opens from ⋯ 'Add Fee/Discount'
  (FD-WO-001); Calculation Type options (FD-WO-011); preview prompt text (FD-WO-014);
  Max Amount only on % methods (FD-WO-006); Add button ENABLED on empty form = DEVIATION
  BUG-FD-4 (FD-WO-005); **§5-R15 jurisdiction note ABSENT below the Taxable toggle =
  DEVIATION** (FD-WO-016). Arithmetic/save behaviors (002/003/006/009/010/011) carried
  from the 2026-07-10 fresh API pass (same build; labels unchanged).
- FD-WO-013 permission-hide: DEVIATION (BUG-FD-3, front-end-only); NOT re-tested this run
  (Technician role drifted on shared qb env — re-derive roles matrix first).

| FD-ID | TestRail | viu_status | TestRail push |
|---|---|---|---|
| FD-WO-001 | [C28424](https://shopview.testrail.io/index.php?/cases/view/28424) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-002 | [C28425](https://shopview.testrail.io/index.php?/cases/view/28425) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-003 | [C28426](https://shopview.testrail.io/index.php?/cases/view/28426) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-004 | [C28427](https://shopview.testrail.io/index.php?/cases/view/28427) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-005 | [C28428](https://shopview.testrail.io/index.php?/cases/view/28428) | VIU-Deviation | updated title+preconds+steps+expected 200/200 |
| FD-WO-006 | [C28429](https://shopview.testrail.io/index.php?/cases/view/28429) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-007 | [C28430](https://shopview.testrail.io/index.php?/cases/view/28430) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-008 | [C28431](https://shopview.testrail.io/index.php?/cases/view/28431) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-009 | [C28432](https://shopview.testrail.io/index.php?/cases/view/28432) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-010 | [C28433](https://shopview.testrail.io/index.php?/cases/view/28433) | VIU-Verified | updated preconds+steps+expected 200/200 |
| FD-WO-011 | [C28434](https://shopview.testrail.io/index.php?/cases/view/28434) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-012 | [C28435](https://shopview.testrail.io/index.php?/cases/view/28435) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-013 | [C28436](https://shopview.testrail.io/index.php?/cases/view/28436) | VIU-Deviation | updated title+preconds+steps+expected 200/200 |
| FD-WO-014 | [C28437](https://shopview.testrail.io/index.php?/cases/view/28437) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-015 | [C28438](https://shopview.testrail.io/index.php?/cases/view/28438) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-016 | [C29441](https://shopview.testrail.io/index.php?/cases/view/29441) | VIU-Deviation | updated title+preconds+steps+expected 200/200 |

**FD-WO push totals:** 16 updated · 0 no-op · 0 error.

## Area: FD-FIN / FD-INLINE / FD-STATS / FD-REMOVE (WO Lines surface) — 18 cases — TESTER-READY

**Build terms corrected (notable):** sidebar card title **'WO Fees & Discounts'** (was
"Work Order Fee / Discount"); per-row and inline ⋮ menu options are **'Edit' / 'Remove'**
(was "Edit/Delete"); the Remove confirm dialog is exactly **title 'Remove Fee / Discount',
message 'Are you sure you want to remove this fee?', buttons 'Remove'/'Cancel'**; inline
fee/discount row is labelled **'Fees/Discounts'** with a ↳ arrow; Financial Info shows a
**'Fees & Discounts (N)'** row (net in grey); Stats shows a **'Fees & Discounts (N)'**
section below Hours/Labor/Parts/Total. Removed spec-ref jargon (S3-Rxx, S4-Rxx, U+2212).

**VIU (fresh_run 2026-07-13) — confirmed live (WO S3-15960):** Financial Info net row
(shot fin-03); sidebar 'WO Fees & Discounts' card + Edit/Remove menu (fin-03); inline
'Fees/Discounts' rows (wo-01/fin-03); inline ⋮ Edit/Remove (inline-01); Remove confirm
dialog exact text (inline-02, cancelled — no shared data deleted); Stats 'Fees & Discounts
(N)' section layout (fin-01).

**Kept as DEVIATIONS (unchanged, PO/dev-owned):** FD-INLINE-003 (no 'Show N more'
collapse, BUG-FD-5); FD-STATS-001 (no Value/Amount column headers, BUG-FD-2),
FD-STATS-002 (no scope hyperlink), FD-STATS-004 (creation-order ruling pending).
**Flipped to Verified after wording match:** FD-FIN-004 (card title now 'WO Fees &
Discounts'), FD-REMOVE-001 (confirm dialog matched exactly).

| FD-ID | TestRail | viu_status | push |
|---|---|---|---|
| FD-FIN-001 | [C28464](https://shopview.testrail.io/index.php?/cases/view/28464) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-FIN-002 | [C28465](https://shopview.testrail.io/index.php?/cases/view/28465) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-FIN-003 | [C28466](https://shopview.testrail.io/index.php?/cases/view/28466) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-FIN-004 | [C28467](https://shopview.testrail.io/index.php?/cases/view/28467) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-FIN-005 | [C28468](https://shopview.testrail.io/index.php?/cases/view/28468) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-INLINE-001 | [C28454](https://shopview.testrail.io/index.php?/cases/view/28454) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-INLINE-002 | [C28455](https://shopview.testrail.io/index.php?/cases/view/28455) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-INLINE-003 | [C28456](https://shopview.testrail.io/index.php?/cases/view/28456) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-INLINE-004 | [C28457](https://shopview.testrail.io/index.php?/cases/view/28457) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-INLINE-005 | [C28458](https://shopview.testrail.io/index.php?/cases/view/28458) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-STATS-001 | [C28459](https://shopview.testrail.io/index.php?/cases/view/28459) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-STATS-002 | [C28460](https://shopview.testrail.io/index.php?/cases/view/28460) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-STATS-003 | [C28461](https://shopview.testrail.io/index.php?/cases/view/28461) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-STATS-004 | [C28462](https://shopview.testrail.io/index.php?/cases/view/28462) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-STATS-005 | [C28463](https://shopview.testrail.io/index.php?/cases/view/28463) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-REMOVE-001 | [C28479](https://shopview.testrail.io/index.php?/cases/view/28479) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-REMOVE-002 | [C28480](https://shopview.testrail.io/index.php?/cases/view/28480) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-REMOVE-003 | [C28481](https://shopview.testrail.io/index.php?/cases/view/28481) | VIU-Verified | title+preconds+steps+expected 200/200 |

**Push totals:** 18 updated · 0 no-op · 0 error.

## Area: FD-EDIT / FD-VAL (Edit dialog + Add-dialog validation) — 10 cases — TESTER-READY

**Build terms confirmed live (shot edit-01):** Edit dialog title **'Edit Fee / Discount'**;
**Type and Calculation Type are greyed/locked**, Name / amount / Max Amount / Taxable
editable; **no 'Apply From Template' dropdown** in Edit; confirm button **'Save'**; preview
rows **'Work-order subtotal' / 'Discount' (or Fee) / 'New work-order subtotal' / 'Tax is
recalculated on save.'**. FD-VAL reuses the confirmed Add-dialog labels ('Add Fee'/'Add
Discount', 'Calculation Type', '$ Max Amount (Optional)' only on % methods). Removed
design-ref jargon (S2-Rxx, "validateForm").

**Deviations kept:** FD-VAL-001 (Add button enabled on empty form, BUG-FD-4 — re-confirmed
live); FD-VAL-006 (Max Amount 0 = no cap vs cap-at-$0 is PO Q2 — pending).

| FD-ID | TestRail | viu_status | push |
|---|---|---|---|
| FD-EDIT-001 | [C28476](https://shopview.testrail.io/index.php?/cases/view/28476) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-EDIT-002 | [C28477](https://shopview.testrail.io/index.php?/cases/view/28477) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-EDIT-003 | [C28478](https://shopview.testrail.io/index.php?/cases/view/28478) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-001 | [C28599](https://shopview.testrail.io/index.php?/cases/view/28599) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-VAL-002 | [C28600](https://shopview.testrail.io/index.php?/cases/view/28600) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-003 | [C28601](https://shopview.testrail.io/index.php?/cases/view/28601) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-004 | [C28602](https://shopview.testrail.io/index.php?/cases/view/28602) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-005 | [C28603](https://shopview.testrail.io/index.php?/cases/view/28603) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-006 | [C28604](https://shopview.testrail.io/index.php?/cases/view/28604) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-VAL-007 | [C28605](https://shopview.testrail.io/index.php?/cases/view/28605) | VIU-Verified | title+preconds+steps+expected 200/200 |

**Push totals:** 10 updated · 0 no-op · 0 error.
