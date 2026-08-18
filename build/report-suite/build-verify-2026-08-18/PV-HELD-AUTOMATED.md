# PV — AUTOMATED CASES HELD (ask-first, Rule 71) — 2026-08-18, build v3.8-bd246fd

Per this pass's instruction and Standing Rule 71, any PV case TestRail flags **Automated
(`custom_atmstatus = 3`)** was **verified LIVE but NOT written to**. Below are the 8 Automated PV cases
with their C-id, current marker, the change this pass WOULD have made, and the live verdict — for the QA
lead's ask-first ratification. **`custom_atmstatus = 3` confirmed LIVE per case this pass.** All 8 are
`created_by = 3` (ours) but Automated-flagged. **NOT edited, markers untouched, not re-stamped**
(byte-unchanged; updated_on identical to pre-pass).

| C-id | internal | current marker | live verdict on v3.8-bd246fd | intended change (NOT applied) | affects automation? |
|---|---|---|---|---|---|
| [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | PV-PERM-02 | `AUTOMATION: READY` | Positive verified: the Reports section and the Parts Velocity nav entry ARE shown to an admin. The **negative** branch (entry hidden without Manager/Office User role) needs a 2nd non-admin sign-in — NOT driven (shared-session safety; quick-login/switch-user not called). | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | PV-FILT-01 | `AUTOMATION: READY` | Type filter is PRESENT with options **All types / Clear all / Inventory / Special Order**. ⚠️ **Two possible discrepancies vs the case:** (a) case says the label is **"Both"**; build shows **"All types"**. (b) case says **single-select** and that Type is **the first control in the filter row**; build renders a **multi-select** (`select_multiple_pv_type` + "Clear all" + checkboxes) and Type sits AFTER the toolbar search and the date-range control. | **NEEDS REVIEW — do NOT auto-lift.** If (a)/(b) are real deviations, this is a `READY - EXPECT FAIL` candidate, not plain READY. Recorded for QA lead + Vlad. | **Yes** — if the case is a deviation, an automated check should expect fail; a wrong label/select-mode changes the assertion. |
| [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | PV-FILT-06 | `AUTOMATION: READY` | **VERIFIED** — the toolbar search (`input_report_search`) is part of the report toolbar, separate from the global search bar. Part-number search narrows the report (BRAKECLEAN → 4 rows). Runnable. | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | PV-FILT-11 | `AUTOMATION: READY` | Feature PRESENT — the report renders an empty-state when the server returns zero rows. Exact empty-state wording ("Empty bays, endless possibilities…") not driven to a zero-row state this pass (seedable). Runnable. | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | PV-ROW-06 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | **Feature PRESENT** — grey info icons ARE shown on the **Units Sold** and **Demand** headers (`icon_pv_units_sold_info`, `icon_pv_demand_info`), each carrying the full tooltip text as an aria-label, shown always (not hover-to-reveal). The Turns/Yr icon appears only when the Turns/Yr column is enabled (it is picker-only, not a default column) — consistent with the case. Runnable. | **Lift marker → `AUTOMATION: READY`** + sentence-2 build-check. | **Yes** — the marker would change from "not available" to READY (the feature is now on the build). |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | PV-COL-02 | `AUTOMATION: READY - EXPECT FAIL (SV-8938)` | Single-location scope: the CSV export carries exactly the 14 columns in the case's order, Location excluded — matches the "14 columns" assertion. Multi-location on screen: Location IS shown but **6th (after Vendor), not leftmost** = the SV-8938 symptom **STILL REPRODUCES**. Ticket SV-8938 is now **OBSOLETE/Done** (no live backing) AND the position is a contested open PO question (see PV-FINDINGS §F4). | **Strip expect-fail → plain READY** (ticket closed, Rule 61) — but see §F4: the target position is unsettled, so recommend confirming with Chris Ward first. HELD, not applied. | **Yes** — removing the expect-fail changes what an automated run concludes. |
| [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | PV-COL-03 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | **Feature PRESENT** — the column picker toggles take effect immediately (the table re-renders without a page reload); columns render in the fixed canonical left-to-right order. Runnable (picker verified: 20 columns). | **Lift marker → `AUTOMATION: READY`** + sentence-2 build-check. | **Yes** — marker would change from "not available" to READY. |
| [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | PV-API-03 | `AUTOMATION: READY` | **VERIFIED** — each column header carries a sort control (`arrow_drop_up`); a header click re-fetches from the server with the chosen `sortBy`/`descending`, returning the first page of the re-sorted results (observed `sortBy=demand&descending=true` on load). Runnable. | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |

**Recommendation for the QA lead:**
- **Ratify lifting C30346 and C30353 → `AUTOMATION: READY`** (features now built and verified runnable).
- **C30352:** strip the stale SV-8938 expect-fail → plain READY — but the Location-position target is an
  open PO question (PV-FINDINGS §F4), so confirm the intended position with Chris Ward before treating 6th
  as a defect.
- **C30328:** DO NOT auto-lift — investigate the "All types" vs "Both" label and single- vs multi-select
  discrepancy; it may be a genuine deviation (a `READY - EXPECT FAIL` candidate), not plain READY.
- The other four (C30326, C30333, C30338, C30390) are already `READY` and correct; only a metadata
  build-check stamp was withheld.

If ratified, apply each edit **coupled with the live verification recorded here** (skill-03 §6.4) and hand
the case numbers to Vladimir Tomovic (id 1) via
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.
