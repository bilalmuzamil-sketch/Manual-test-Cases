# PV SWEEP — AUTOMATED CASES HELD (ask-first, Rule 71) — 2026-08-19, build v3.8-d0e135e

Per Standing Rule 71, any PV case TestRail flags **Automated (`custom_atmstatus = 3`)** was **verified
LIVE but NOT written to** this sweep. **Live `custom_atmstatus` re-read is authoritative — the 8/18
PV-EXECUTION/HELD atm column recorded 8; the live count is 13** (5 NEW-since-8/18). All 13 are
`created_by = 3` (ours) but Automated-flagged. **NOT edited, markers untouched, not re-stamped**
(re-GET confirms 0 touched this pass; all still atm=3).

| C-id | title (short) | current marker | new since 8/18? | intended change (NOT applied) — for ratification |
|---|---|---|---|---|
| [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | PV appears under the new Parts nav section | `AUTOMATION: READY` | **NEW** | metadata build-check only; marker stays READY (nav verified live) |
| [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | Without Manager/Office role the report entry is hidden | `AUTOMATION: READY` | | negative branch needs a 2nd non-admin sign-in; positive nav verified; marker stays READY |
| [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Type filter: single-select, first in row, three options | `AUTOMATION: READY` | | **DO NOT auto-lift** — build shows **"All types"** (case says "Both") and a **multi-select** after search/date (case says single-select, first). Possible `READY - EXPECT FAIL` candidate; investigate |
| [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | Toolbar search matches part number/description | `AUTOMATION: READY` | | metadata build-check only; verified runnable; marker stays READY |
| [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | Empty state shows the standard no-data message | `AUTOMATION: READY` | | metadata build-check only; feature present; marker stays READY |
| [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Info icons on Units Sold, Demand, Turns/Yr | `AUTOMATION: Not available on Build to test Yet` | | **Lift → `AUTOMATION: READY`** — info icons ARE present live (confirmed 8/18 + this pass) |
| [C30351](https://shopview.testrail.io/index.php?/cases/view/30351) | Column picker lists all 20 columns; Location never offered | `AUTOMATION: READY` | **NEW** | metadata build-check only; 20 columns verified live; marker stays READY |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | First visit shows the 14 default columns | `AUTOMATION: READY - EXPECT FAIL (SV-8938)` | | **Strip expect-fail → plain READY** (SV-8938 OBSOLETE) — but the Location-column position is a contested open PO question (see FINDINGS §F4 / FLAGGED); confirm with Chris Ward first |
| [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | A re-enabled column returns to its canonical slot | `AUTOMATION: Not available on Build to test Yet` | | **Lift → `AUTOMATION: READY`** — immediate column toggle verified present |
| [C30354](https://shopview.testrail.io/index.php?/cases/view/30354) | Filters/columns/sort remembered per browser | `AUTOMATION: READY` | **NEW** | metadata build-check only; localStorage `report_view:parts-velocity` confirmed; marker stays READY |
| [C30375](https://shopview.testrail.io/index.php?/cases/view/30375) | Overflow opens Download (PDF) then (CSV) | `AUTOMATION: READY` | **NEW** | metadata build-check only; export dropdown present; marker stays READY (PDF path fails per SV-8818 but the menu is built) |
| [C30377](https://shopview.testrail.io/index.php?/cases/view/30377) | Exports include only enabled columns, canonical order | `AUTOMATION: READY` | **NEW** | metadata build-check only; CSV verified; marker stays READY |
| [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | Header-click sorting re-queries server; nulls by direction | `AUTOMATION: READY` | | metadata build-check only; sort re-query verified live; marker stays READY |

**Recommendation for the QA lead (ask-first ratification, Rule 71):**
- **Lift C30346 and C30353 → `AUTOMATION: READY`** (features verified present live).
- **C30352:** strip the stale SV-8938 expect-fail → plain READY — but confirm the intended
  Location-column position with Chris Ward first (contested open PO question).
- **C30328:** DO NOT auto-lift — investigate the "All types" vs "Both" label and single- vs
  multi-select discrepancy; likely a `READY - EXPECT FAIL` candidate, not plain READY.
- The other 10 are already `READY` and correct; only a metadata build-check stamp was withheld.

If ratified, apply each edit **coupled with the live verification recorded here** (skill-03 §6.4) and
hand the case numbers to Vladimir Tomovic (id 1) via
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.
