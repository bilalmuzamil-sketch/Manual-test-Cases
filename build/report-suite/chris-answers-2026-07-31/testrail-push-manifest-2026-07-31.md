# Report Suite — TestRail push MANIFEST 2026-07-31 (STATUS: **EXECUTED 2026-07-31 — 70 update_case + 7 add_case + run-359 sync, ALL 200 + re-GET MATCH, 0 failures; audit log: testrail-execution-log-2026-07-31.md**)

> Authorization: the user's 2026-07-31 instruction to ingest Chris Ward's answers, run the
> SPEC-WATCH re-diff and **apply the consequences**, pushing with pre-write snapshots and
> per-op re-GET verification. **No deletes** — nothing in his answers or the changelog retires
> a case. Only group 4281 is touched. Run **359** is then case-synced per Standing Rule 34
> (add-only union, results never touched).

## Planned operations: 70 update_case + 7 add_case + 0 delete + 1 update_run (case sync)

Suite before: **465 active** · after: **472 active**.

### A. update_case × 70

| # | Internal ID | TestRail | Title (after) |
|---|---|---|---|
| 1 | IV-LOC-04 | C30577 | The Location filter is hidden for a user with access to only one location |
| 2 | PV-CALC-02 | C30360 | Special Order Units Sold = in-window request quantity, net of reversals |
| 3 | PV-CALC-05 | C30363 | Sold (WO) counts Service work orders, Sold (Parts Sale) counts Parts |
| 4 | PV-CALC-06 | C30364 | Demand counts each transaction once; a reversal neither adds nor subtracts |
| 5 | PV-CALC-07 | C30365 | Last Sale is whole days since the most recent sale over all-time history |
| 6 | PV-CALC-09 | C30367 | Turns / Yr annualizes the sales rate, is 0.00 at zero stock, can be negative |
| 7 | PV-CALC-10 | C30368 | Revenue, Margin, Unit Cost, Sell Price and Margin % use the billed formulas |
| 8 | PV-CALC-11 | C30369 | A reversed or voided sale is excluded from every billed-line column |
| 9 | PV-CALC-13 | C30371 | Number formats match the spec per column; rounding is half away from zero |
| 10 | PV-CALC-14 | C30372 | Core parts are excluded from both the inventory and special-order result sets |
| 11 | PV-CALC-15 | C30373 | Movement and billed bases may differ; Sold (WO) + Sold (Parts Sale) = billed |
| 12 | PV-CALC-16 | C30374 | Window anchors: movement uses the event date, billed uses the WO date |
| 13 | PV-COL-01 | C30351 | Column picker lists all 20 columns and never offers the internal cost |
| 14 | PV-COL-02 | C30352 | First visit shows exactly the 14 default columns in the specified order |
| 15 | PV-COL-03 | C30353 | A re-enabled column returns to its canonical slot, with no reload |
| 16 | PV-COL-06 | C30356 | A different user signing in on the same browser inherits the saved view |
| 17 | PV-EXP-04 | C30378 | Exports reflect the active sort, including Min/Max and null placement |
| 18 | PV-EXP-07 | C30381 | Em-dash in both exports; Last Sale reads "N days" in the PDF |
| 19 | PV-FILT-13 | C30340 | The Location filter is hidden for a user with access to only one location |
| 20 | PV-ROW-02 | C30342 | A Special Order part is one merged row summed across selected locations |
| 21 | PV-ROW-03 | C30343 | Rows load ranked by Demand descending, indicator on the Demand header |
| 22 | PV-ROW-04 | C30344 | A header click sorts ascending first, toggles, and places nulls by direction |
| 23 | PV-ROW-08 | C30348 | Em-dash only in nullable fields; counts and Revenue/Margin are never null |
| 24 | PV-ROW-09 | C30349 | An inventory part drops out only with no movement, no stock and no revenue |
| 25 | SBC-EXP-02 | C30160 | Download file names carry the version and the active date range |
| 26 | SBC-EXP-03 | C30161 | Expanded View CSV: column order, blank-cell rules, and the Locations line |
| 27 | SBC-EXP-06 | C30164 | Each download item shows a loading state and its own export-failed toast |
| 28 | SBC-EXP-11 | C30169 | Expanded View PDF body matches the CSV's columns and on-screen rules |
| 29 | SBC-EXP-14 | C30172 | An export over 10,000 data rows is refused with the too-large toast |
| 30 | SBC-EXP-16 | C38856 | Summary and Expanded View downloads exist for both PDF and CSV |
| 31 | SBC-LOC-01 | C30109 | Location filter: rightmost, lists accessible locations, All locations on top |
| 32 | SBC-NAV-01 | C30096 | Sales By Customer listed under Performance, below existing links; titles correct |
| 33 | SBC-PERM-01 | C30098 | Ordinary reports access opens Sales By Customer — no separate permission |
| 34 | SBC-PERM-02 | C30099 | Without reports access, Sales By Customer is not listed and cannot open |
| 35 | SBR-API-06 | C30321 | Deactivating a rep first runs a server pre-check returning the count |
| 36 | SBR-ASGN-01 | C30292 | Report Name dropdown lists Sales Representative Assignments at the bottom |
| 37 | SBR-ASGN-02 | C30293 | Sales Representative Assignments CSV: file name, headers, success toast |
| 38 | SBR-ASGN-03 | C30294 | Assignments CSV: one row per assigned customer, sorted customer then rep |
| 39 | SBR-ASGN-04 | C30295 | "Rep is active?" tracks the staff-active status, not the toggle |
| 40 | SBR-ASGN-05 | C30296 | A deleted rep record still exports one row from the stored name, marked No |
| 41 | SBR-ASGN-06 | C30297 | Assignments export failure and nothing-to-export use the dialog's messages |
| 42 | SBR-DEACT-02 | C30253 | Deactivate dialog: counted pluralized headline, reassurance, focus trap |
| 43 | SBR-DEACT-05 | C30256 | Valid submit locks the dialog, then deactivates keeping assignments |
| 44 | SBR-DEACT-06 | C30257 | After deactivation: toggle unchanged, CSV shows No, report credit intact |
| 45 | SBR-DEACT-07 | C30258 | No dialog: toggle off, no assignments, already inactive, or reactivation |
| 46 | SBR-EXP-10 | C30285 | Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep |
| 47 | SBR-EXP-11 | C30286 | Expanded CSV: file name, verbatim headers, one row per invoice |
| 48 | SBR-EXP-12 | C30287 | CSV cells: plain numbers, signed Inv. Hrs, empty Margin %, (Inactive) |
| 49 | SBR-EXP-13 | C30288 | The Unassigned row appears in all four downloads only when the toggle is on |
| 50 | SBR-EXP-15 | C30290 | Over-cap Expanded View PDF is refused with the too-large message |
| 51 | SBR-LOC-04 | C30216 | The Location filter is hidden for a user with access to only one location |
| 52 | SBR-PERM-02 | C30199 | Without Reports access: no navigation, no export menu, no Export dialog |
| 53 | SBR-TYPE-02 | C30206 | Product Type: three options, Parts & Service default, each option filters right |
| 54 | SBR-UNAS-01 | C30261 | Show Unassigned sits between the column selector and the date picker, off |
| 55 | SBR-WO-01 | C30310 | Sales Representative selector shows on WO and Part Sale, not on imported |
| 56 | SBR-WO-02 | C30311 | Selector offers only reps whose sales-representative toggle is on |
| 57 | SBR-WO-03 | C30312 | A new WO opens with Sales Representative unassigned; a change saves at once |
| 58 | SBR-WO-04 | C30313 | The Sales Representative selector is read-only when Invoiced or Paid |
| 59 | SBR-WO-05 | C30314 | Invoice credit snapshot: WO rep, else customer rep, else unassigned |
| 60 | SBR-WO-06 | C30315 | Customer record shows a "Sales Representative" row; "Unassigned" when none |
| 61 | TU-COL-01 | C38859 | Column Selection: Technician always on, the other five toggleable, remembered |
| 62 | TU-ELL-02 | C30405 | Est. Lost Labor, when shown, is pinned right and bold with the info icon |
| 63 | TU-EXP-01 | C30434 | Three-dot menu is leftmost, then Column Selection; three download options |
| 64 | TU-EXP-04 | C30437 | Downloads cover only selected technicians, locations, and date range |
| 65 | TU-EXP-06 | C30439 | PDF logo: the uploaded logo, else the bundled ShopView logo; CSV never |
| 66 | TU-LOC-05 | C30446 | The Location filter is hidden for a user with access to only one location |
| 67 | TU-VIS-01 | C30447 | All-white table with no row shading; toolbar controls in the fixed order |
| 68 | WIP-COL-01 | C30466 | With all toggleable columns on, the fixed column order and alignment hold |
| 69 | WIP-COL-02 | C30467 | First visit shows the default columns; the rest are in the column selector |
| 70 | WIP-FLT-06 | C30503 | Location filter: rightmost multi-select with All locations, reloads on change |

### B. add_case × 7  (custom_atmstatus:3 + custom_automation_type:0, non-API)

| # | Internal ID | Section (area) | Title |
|---|---|---|---|
| 1 | SBC-LOC-04 | SBC — Location Filter | The Location column shows only with more than one location; Multiple on totals |
| 2 | SBR-LOC-05 | SBR — Location Filter | The Location column shows only with more than one location; rep rows Multiple |
| 3 | PV-FILT-14 | PV — Filters | The Location column shows only with more than one location, leftmost before Type |
| 4 | TU-LOC-06 | TU — Location Filter | The Location column shows only with more than one location; Summary row blank |
| 5 | WIP-FLT-09 | WIP — Filters | The Location column is automatic and never reads Multiple on a work-order row |
| 6 | IV-LOC-06 | IV — Location Filter | The Location column is automatic, sits after Vendor, and never reads Multiple |
| 7 | WIP-EXP-10 | WIP — Exports | An over-cap Work In Progress download is refused with the too-large message |

### C. delete_case × 0

None. Nothing in Chris's answers or in the 2026-07-29 spec changelog retires a case.
If a later ruling does, it will be listed and HELD for explicit user authorization — never deleted in this pass.

### D. run 359 case-sync (Standing Rule 34)

R359 "Reports Suite - Nebojsa/Viktoria (VIU Pending)" is owned by another tester and was built
from a FIXED case selection, so new cases do NOT appear automatically. Method: `get_run` →
`get_tests` + `get_results_for_run` snapshot → **UNION** of the current case_ids with the 7 new
ids (assert the current set is a subset of the union and the length is exactly current+new) →
`update_run` with the FULL union → verify the test count, that every prior case is still
present, and that the **results count is UNCHANGED**. Add-only; no other run is touched.

### Guardrails asserted before any write

- every title ≤ 80 characters; every `refs` present, ≤ 250 characters, and carrying BOTH a Jira
  ticket and a spec anchor (Rule 20)
- pre-write `get_case` snapshot of all 70 update targets, saved to `pre-push-snapshot/`
- per-op re-GET verification of title / preconditions / steps / expected / refs
- transient 429/5xx/000 retried with exponential backoff; a failed snapshot aborts the run
- post-push live case count under group 4281 must equal **472**
- no secrets written to the repo
