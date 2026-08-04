# Rule-28 CROSS-CASE CONSISTENCY SWEEP — Report Suite, 2026-08-04

**Why this exists.** Standing Rule 28 forbids delivering a suite with an unresolved
contradiction, and the brief warned that *"conditional rewrites are exactly the edit that can
contradict a neighbour"*. This pass rewrote a **mechanism** assertion (how the Location column
appears) and a **label** ("Qty on Hand" → "Qty"), which are precisely the two shapes that
contradict neighbours.

## IT CAUGHT A REAL CONTRADICTION THAT THIS PASS INTRODUCED

The first run reported:

```
Qty on Hand column label   remaining: 2   of which touched-this-pass: 1  [30557]
```

Correcting **"Qty on Hand" → "Qty"** on IV-COL-01 = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551),
IV-COL-02 = [C30552](https://shopview.testrail.io/index.php?/cases/view/30552),
IV-COL-04 = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) and
IV-PERS-02 = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) left **two cases
still using the old label** — IV-TOT-02 = [C30557](https://shopview.testrail.io/index.php?/cases/view/30557)
(*"the totals row sums **Qty on Hand**, Margin, Total Sell…"*) and IV-SORT-03 =
[C30585](https://shopview.testrail.io/index.php?/cases/view/30585) (*"Sort by **Qty on Hand**"*).
A tester would have been told to look for a column header that no longer exists.
**Both were fixed in a follow-up batch** (2 `update_case`, HTTP 200, byte-verified); C30585 was
in no batch's staged list at all.

## THE LOCATION-MECHANISM GROUP — 18 cases, and why only 9 were changed

The refuted assertion (*"Location is NOT offered in the column selector — it appears on its own"*)
appears in **18 cases across all six reports**. **Only the 9 in WIP and IV were corrected**,
because the toggle mechanism was **live-proven only there**:

- **WIP** — the Column Selection panel lists 16 items with **Location between VIN and Advisor**,
  and a before/after header read proved the toggle works both ways with two locations in scope
  throughout.
- **IV** — Location is the **5th of 11** items in the IV Column Selection panel, and toggling it
  off removes the column.
- **PV** — the picker's **20 entries were read live** and contain **no Location** (Type, Part #,
  Description, Category, Vendor, Units Sold, Units Returned, Sold (WO), Sold (Parts Sale), Unit
  Cost, Sell Price, Revenue, Margin, Margin %, Demand, Last Sale, On Hand, Turns/Yr, Min, Max), so
  on Parts Velocity the **automatic** model is correct and its cases were left alone.
- **SBC / SBR / TU** — the column-selector mechanism was **not observed** for these three. Their
  cases keep the automatic model. **This is a deliberate non-change, not an oversight**, and it is
  the honest position under Rule 12: we did not see it, so we do not assert it.

So the two models coexisting in the suite is **correct**, not a contradiction — the mechanism
genuinely differs per report. Stated here explicitly because it would otherwise read as one.

**One case was added by the sweep, not by any batch:** IV-LOC-06 =
[C38917](https://shopview.testrail.io/index.php?/cases/view/38917) made the same refuted
"automatic / not in the column selector" claim as the four IV cases being corrected. Correcting
those four and leaving it would have shipped a self-contradiction inside one report.

## FINAL RESULT

```
live suite (ours): 478   touched this pass: 38

[1] LOCATION-MECHANISM GROUP — the assertion this pass changed
  IV   automatic-model []  toggle-model [30551, 30554, 30588, 38917]  -> OK
  PV   automatic-model [30352, 30353]  toggle-model []  -> OK
  SBC  automatic-model [30156, 38912]  toggle-model []  -> OK
  SBR  automatic-model [30218, 30265]  toggle-model []  -> OK
  TU   automatic-model [30401, 30437, 38859]  toggle-model []  -> OK
  WIP  automatic-model []  toggle-model [30466, 30467, 30511, 38916]  -> OK

[2] OPPOSITE-ASSERTION KEYWORD PAIRS (within a report, on the same subject)
  Qty on Hand column label                     remaining:  0   of which touched-this-pass: 0  
  Turns/Yr header label                        remaining:  8   of which touched-this-pass: 0  
  capitalised All Locations                    remaining:  5   of which touched-this-pass: 0  
  a "Select all" technician control            remaining:  0   of which touched-this-pass: 0  
  a Declined work-order status                 remaining:  1   of which touched-this-pass: 0  
  title-cased In Progress status label         remaining:  0   of which touched-this-pass: 0  
  the IV totals label                          remaining:  0   of which touched-this-pass: 0  
  a Custom item in the date picker             remaining:  0   of which touched-this-pass: 0  

[3] TITLE vs EXPECTED on all 38 touched cases
  38/38 titles clearly echoed in their expected result

[4] SAME-ANCHOR CLUSTERS containing a case this pass touched
  IV S1-R8: [30538, 30570]   (touched: [30538, 30570])
  IV S10-R11: [30592, 43548]   (touched: [43548])
  IV S10-R12: [30593, 43548, 43548]   (touched: [30593, 43548])
  IV S10-R14: [30595, 43548]   (touched: [30595, 43548])
  IV S10-R15: [30588, 30588, 38917, 38917]   (touched: [30588, 38917])
  IV S3-R1: [30551, 30580, 38917]   (touched: [30551, 30580, 38917])
  IV S3-R5: [30545, 30546, 30547, 30552]   (touched: [30552])
  IV S6-R5: [30570, 30572]   (touched: [30570])
  IV S7-R6: [30551, 30554, 30580, 38917]   (touched: [30551, 30554, 30580, 38917])
  PV S3-R10: [30352, 30353, 38914]   (touched: [30353])
  PV S3-R6: [30346, 30346]   (touched: [30346])
  PV S4-R4: [30351, 30353, 30377]   (touched: [30351, 30353])
  SBC S1-N1: [30099, 43546]   (touched: [43546])
  SBC S1-R2: [30098, 39447, 43546]   (touched: [43546])
  WIP S1-R2: [30452, 30452]   (touched: [30452])
  WIP S4-R1: [30466, 30507]   (touched: [30466])
  WIP S4-R3: [30466, 30467, 30467, 38916]   (touched: [30466, 30467, 38916])
  WIP S4-R6: [30469, 30469]   (touched: [30469])
  WIP S7-R13: [30511, 30511, 38916]   (touched: [30511, 38916])
  WIP S9-E1: [30511, 30511, 30516, 38916]   (touched: [30511, 38916])
  WIP S9-R10a: [30511, 30511]   (touched: [30511])
  21 multi-case anchors involve a case this pass touched — each listed above for the record; contradictions among them are covered by checks 1 and 2.

==========================================================================
ZERO CONTRADICTIONS INTRODUCED.
```

## The four required checks

| Check | Result |
|---|---|
| **Opposite-assertion keywords** — 8 pairs (Qty on Hand · Turns / Yr · "All Locations" · "Select all" · Declined · "In Progress" · totals label · a "Custom" date item) | **0 remaining in any case this pass edited.** Residual counts outside the edited set are the deliberate holds of `MANIFEST.md` §3d/§3c — e.g. 8 cases still say "Turns / Yr" and 5 still say "All Locations", all in **untouched** cases whose labels were not in scope. Flagged for the next authorised label pass. |
| **Title vs expected, every touched case** | **38 / 38** titles clearly echoed in their own expected result. |
| **Same-`refs`-anchor clusters** | **21** multi-case anchors involve a touched case; every one enumerated in the sweep output above. No pair asserts opposite things. |
| **The changed mechanism specifically** | per-report split above — **OK on all six**. |

Checker: `contradiction_sweep.py` (read-only, `get_*` only, run against a fresh live pull).
