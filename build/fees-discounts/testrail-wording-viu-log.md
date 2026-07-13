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
