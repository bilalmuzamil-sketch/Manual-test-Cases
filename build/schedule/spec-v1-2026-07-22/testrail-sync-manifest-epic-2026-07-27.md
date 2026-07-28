# Schedule — TestRail SYNC MANIFEST (epic SV-8685 backfill + design/Jira deltas + new-scope, 2026-07-27)

> **STATUS: EXECUTED 2026-07-27 (user-authorized, Standing Rule 6).** All items below were
> pushed to TestRail: 2 add_section (5405 Working Hours Settings / 5406 Week Export and Printing)
> + 10 add_case (SCH-HRS-01..07 = C38846–C38852, SCH-EXP-01/02 = C38853/C38854, SCH-REAS-06 =
> C38855) + 167 update_case (10 tester-facing + 157 refs-only). ALL HTTP 200, ALL re-GET MATCH,
> 0 delete. Run 325 / all execution runs untouched. Audit:
> `testrail-execution-log-epic-2026-07-27.md`. D1 + D4 remain HELD (not written). New tally =
> 177 active, all C-id'd.
>
> Project **1** / suite **1 "Master"** / group **4254 "Schedule - 2026 (VIU Pending)"**
> (child sections 4255–4280). `add_case` requires `custom_atmstatus:3` +
> `custom_automation_type:0` + `custom_automation_type:0`. Run **325 etc. MUST stay untouched.**
> After executing: re-GET each edited/added case to confirm MATCH, capture new C-ids, and
> re-merge them into `build/schedule/testrail-id-map.csv` (`gen_import.py` blanks the C-id
> column on rerun — always re-merge).
>
> Sources: `build/schedule/epic-sv8685/RECONCILIATION.md` (§3 backfill map + deltas D1–D5,
> gap G1) + `build/schedule/design-2026-07-27/DESIGN-RECONCILIATION-2026-07-27.md`
> (label/menu/timing deltas).
>
> **Totals: 167 update_case · 10 add_case · 0 delete_case.**
> (Of the 167 update_case, **10 also change tester-facing Title/Steps/Expected**; the other
> 157 are metadata-only — the `refs` field.)

---

## A. update_case — 167 cases: epic SV-8685 refs backfill (Standing Rule 20)

Every ACTIVE case gets its `refs` (References field) set to `<TICKET> (<spec-anchor>)`,
keeping the existing spec anchor. **Metadata-layer only** — for 157 of the 167 the
tester-facing fields are UNCHANGED (References field is the only write). Section → owning
story key (per RECONCILIATION.md §3; per-case overrides applied):

| Section (case IDs) | Ticket | Example refs |
|---|---|---|
| Navigation and Layout (SCH-NAV-01..07) | SV-8686 | `SV-8686 (§3)` |
| Grid Toolbar (SCH-TOOL-01..03) | SV-8686 | `SV-8686 (§6 (Today button))` |
| Sidebar - Mini Calendar (SCH-MCAL-01..04) | SV-8687 | `SV-8687 (§3.1, §5.2)` |
| Sidebar - WO List & Search (SCH-WOL-01..06) | SV-8687 | `SV-8687 (§3.1, §5.1)` |
| Sidebar - WO Filters (SCH-FILT-01..06) | SV-8687 | `SV-8687 (§5.1)` |
| Sidebar - Line Drill-Down (SCH-LINE-01..07) | SV-8687 | `SV-8687 (§3.1 (Line drill-down))` |
| Drag-and-Drop Scheduling (SCH-DND-01..08) | SV-8688 | `SV-8688 (§4.1 ...)` |
| Shift Start Times & Unassigned (SCH-START-01..08) | SV-8688 | `SV-8688 (§4.2)` |
| Scope Picker (SCH-SCOPE-01..06) | SV-8689 | `SV-8689 (§4.3)` |
| Shift Block Anatomy (SCH-BLOCK-01..05) | SV-8690 | `SV-8690 (§4.4)` |
| Multi-Day Spread (SCH-SPREAD-01..10) | SV-8691 | `SV-8691 (§4.5)` |
| Linked Series and Banners (SCH-SER-01..04) | SV-8692 | `SV-8692 (§4.6 ...)` |
| Deletion, Series Scopes & Undo (SCH-DEL-01..06) | SV-8692 | `SV-8692 (§7 (Series-aware deletion))` |
| Deletion — generic toast/undo (SCH-DEL-07/08/09) | SV-8688 | `SV-8688 (§7 (Toast notifications), §11 (Undo))` |
| Overlap and Lane Stacking (SCH-LANE-01..05) | SV-8693 | `SV-8693 (§4.7)` |
| Day View Timeline (SCH-DAY-01..07) | SV-8694 | `SV-8694 (§4.8 ...)` |
| Shift Detail Modal (SCH-MODAL-01..08) | SV-8695 | `SV-8695 (§4.9 ...)` |
| Hover Tooltips (SCH-TIP-01..05) | SV-8695 | `SV-8695 (§4.13 ...)` |
| Reassignment — drag (SCH-REAS-01) | SV-8695 | `SV-8695 (§7 (Shift reassignment), §12)` |
| Reassignment/Context Menu (SCH-REAS-03/04/05/06) | SV-8700 | `SV-8700 (§7 ...)` |
| Events (SCH-EVT-01..08) | SV-8696 | `SV-8696 (§4.10 ...)` |
| Conflict Detection (SCH-CONF-01..07) | SV-8697 | `SV-8697 (§4.11 ...)` |
| Capacity Bars (SCH-CAP-01..04) | SV-8698 | `SV-8698 (§4.12 ...)` |
| Filter & Display & View Options (SCH-VIEW-01..10) | SV-8700 | `SV-8700 (§9 ...)` |
| Color System (SCH-COLOR-01..03) | SV-8700 | `SV-8700 (§10)` |
| Keyboard Interactions (SCH-KEY-01..05) | SV-8700 | `SV-8700 (§7 / §11)` |
| Permissions — core tiers (SCH-PERM-01..07, 09) | **SV-8685 (epic)** | `SV-8685 (§14.1 ...)` (cross-cutting) |
| Permissions — WO:View dep (SCH-PERM-08, 12) | SV-8687 | `SV-8687 (§14.2)` |
| Permissions — dept rows / Time Clock (SCH-PERM-10, 11) | SV-8686 | `SV-8686 (§14.4)` |
| Edge — perf/responsiveness (SCH-EDGE-02/03/04) | SV-8686 | `SV-8686 (§11 ...)` |
| Edge — spread/quantities (SCH-EDGE-01/05/06) | SV-8691 | `SV-8691 (§12, §4.5)` |

> Exact per-case refs = the value in `build/schedule/testrail-id-map.csv` (new `refs` column)
> and the References column of `testrail-import/schedule-v1-testrail-import.csv`. Retired
> SCH-REAS-02 (deleted C30053) is excluded.

## B. update_case — 10 cases ALSO changing tester-facing fields (design + Jira agree / Jira deltas)

These 10 carry the refs backfill AND a Title/Steps/Expected change (so they are the same
`update_case` call, listed here for the reviewer):

| # | SCH- | Case ID | Change | Driver |
|---|---|---|---|---|
| 1 | SCH-FILT-01 | **C29942** | Sidebar caption "Filter" → **"Filters"** (plural) | Design #1 + SV-8687 |
| 2 | SCH-VIEW-01 | **C30042** | Control label "Filter and Display" → **"Filter & Display"** (title also trimmed ≤80) | Design #12 + SV-8700 |
| 3 | SCH-EVT-01 | **C30016** | Menu item "New Event" → **"Create Event"** | Design #7 + SV-8696 |
| 4 | SCH-REAS-03 | **C30054** | Cell menu contents → **"Create Event" + "New Work Order"** (removed New Shift/New Event/View Day) | Design #8 + SV-8696/SV-8700 |
| 5 | SCH-REAS-04 | **C30055** | Reworked: **"View Day" no longer in the menu** (was: View Day opens day view) | Design #9 + SV-8700 |
| 6 | SCH-REAS-05 | **C30056** | Reworked: **"New Shift" no longer in the menu** (was: New Shift starts creation) | Design #10 + SV-8700 |
| 7 | SCH-DEL-08 | **C30064** | Toast lifetime pinned: **~7s with Undo / ~4s without** | Design #7 + SV-8688 |
| 8 | SCH-SPREAD-07 | **C29983** | D2: **shop closures NOT skipped in V1**; weekends skipped only when no business hours set | SV-8691 §4.5 |
| 9 | SCH-EDGE-05 | **C30089** | D2 reversed: **shop closures do NOT block spread in V1** (was: closures block spread) | SV-8691 §4.5, §12 |
| 10 | SCH-BLOCK-04 | **C29994** | D3: **blocks default blue; custom colour optional per shift** (NOT tied to the work order) | SV-8690 §4.4, §10 |

## C. add_case — 10 NEW-SCOPE cases (currently blank C-id in the id-map)

All `custom_atmstatus:3` + `custom_automation_type:0`, non-API, VIU-Pending.

| # | SCH- | New Section (group 4254) | Title | Type / Priority | Driver |
|---|---|---|---|---|---|
| 1 | SCH-HRS-01 | Working Hours Settings (new) | Edit Location has a 'Set business hours for this shop' toggle, off by default | Functional / High | SV-8699 §4.2 |
| 2 | SCH-HRS-02 | Working Hours Settings (new) | Edit Location shows a per-day (Mon-Sun) From-To business-hours editor | Functional / High | SV-8699 §4.2 |
| 3 | SCH-HRS-03 | Working Hours Settings (new) | Edit Staff has a 'Set custom hours for this technician' toggle, off by default | Functional / High | SV-8699 §4.2 |
| 4 | SCH-HRS-04 | Working Hours Settings (new) | A technician with no custom hours inherits the shop business hours | Functional / Medium | SV-8699 §4.2 |
| 5 | SCH-HRS-05 | Working Hours Settings (new) | 'Add hours' appends a removable second range for split shifts, starting empty | Functional / Medium | SV-8699 §4.2 |
| 6 | SCH-HRS-06 | Working Hours Settings (new) | Overlapping hour ranges flag red with a message and disable Save | Negative / High | SV-8699 §4.2 |
| 7 | SCH-HRS-07 | Working Hours Settings (new) | Incomplete hour rows (empty From or To) are ignored by the overlap check | Functional / Medium | SV-8699 §4.2 |
| 8 | SCH-EXP-01 | Week Export and Printing (new) | Week Export opens a printable Department-by-Technician week grid | Functional / Medium | Design Week Export (scope pending Branko) |
| 9 | SCH-EXP-02 | Week Export and Printing (new) | Exported week view lists each department with its technicians and shifts | Functional / Medium | Design Week Export (scope pending Branko) |
| 10 | SCH-REAS-06 | Reassignment and Context Menu | 'New Work Order' in the cell menu points the user to the Work Orders tab | Functional / Medium | SV-8700 §7 / SV-8696 §4.10 |

> Full Preconditions/Steps/Expected for the 7 Working Hours + 2 Week Export cases are in
> `build/schedule/cases/cases-G-new-scope.json`; SCH-REAS-06 is in the same file. All 10 rows
> are already emitted (VIU/flag-word-free) in `testrail-import/schedule-v1-testrail-import.csv`.
> The 2 new sections ("Working Hours Settings", "Week Export and Printing") need to exist under
> group 4254 before add_case (or the import creates them). After add, capture returned C-ids
> and write them into the id-map for these 10 rows.

## D. HELD — pending Branko's answer (NOT changed; NO write staged)

| Delta | Cases (C-ids) | Why held |
|---|---|---|
| **D1 — events count toward capacity** | SCH-EVT-08 (**C30615**) + SCH-CAP-01..04 (**C30030/31/32/33**) | The new design code counts tech-assigned event hours toward the capacity bar, which **reverses Branko's earlier Q1 ruling** (events excluded). Design-vs-earlier-answer conflict — confirm Q1 is superseded before editing. |
| **D4 — modal "Reassign" action** | SCH-MODAL-08 (**C30015**); retired SCH-REAS-02 (deleted C30053) | Jira SV-8695 still lists a modal "Reassign" action, but our design-reconciled cases removed it (drag-reassign only, SCH-REAS-01/C30052). **Design-vs-Jira conflict** — Branko/VIU decides which wins before re-adding or leaving removed. |

## E. NOT in this manifest
- No `delete_case` (SCH-REAS-04/05 were **reworked**, not retired — their C-ids C30055/C30056 stay).
- No execution-run writes (run 325 etc. untouched).
- No VIU / live-build check (QA branch pending, OQ-3) — all new/edited items are design-pinned,
  NOT VIU-Verified (Rule 12); confirm live at the VIU pass.
