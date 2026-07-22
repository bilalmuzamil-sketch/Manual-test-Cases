# Schedule — TestRail SYNC MANIFEST (spec_1 + Claude design + Branko Q&A, 2026-07-22)

> **STATUS: NOT EXECUTED — the user has NOT authorized TestRail writes.**
> The reconciliation was applied **LOCAL ONLY** (case JSON + import + id-map +
> coverage-matrix). This manifest is the exact, verbatim list for a follow-up worker
> to run **once the user grants explicit TestRail permission** (Standing Rule 6).
>
> Project **1** / suite **1 "Master"** / group **4254 "Schedule - 2026 (VIU Pending)"**
> (child sections 4255–4280). `add_case` requires `custom_atmstatus:3` +
> `custom_automation_type:0` (per the Custom Roles convention). Populate the case
> **References (`refs`) field** with the driving ticket/spec anchor per Standing Rule 20
> when the Epic/Jira key is known (OQ-2 — ask the user at VIU).
>
> **Totals: 7 update_case · 2 add_case · 1 delete_case.**
> After executing: re-GET each edited case to confirm MATCH, then re-merge the 2 new
> C-ids into `build/schedule/testrail-id-map.csv` (the `gen_import.py` rerun blanks the
> C-id column — always re-merge C29925–C30090 + the 2 new C-ids after any rerun).

---

## A. update_case — 7 cases (tester-facing wording/expected changed; statuses unchanged, all VIU-Pending)

| # | SCH- | Case ID | Field(s) changed | Before → After (summary) | Driver |
|---|---|---|---|---|---|
| 1 | SCH-MODAL-04 | **C30011** | Title, Expected | Lines shown "with labor/total figures" → lines show **number/title/hours/status pill ONLY; NO labor, NO total $ anywhere** | Branko Q3 + design §4c |
| 2 | SCH-MODAL-08 | **C30015** | Title, Preconditions/Perms, Steps, Expected | "offers Delete **and Reassign**" → **Delete (trash) + close only; NO Reassign action** (reassign is drag-only) | Branko removal + design §4c/§4d |
| 3 | SCH-CONF-02 | **C30024** | Title, Preconditions, Steps, Expected | "Saturday/Sunday flagged" → flagged when **outside the tech's configured working days**; Saturday hours ⇒ NOT a conflict | Branko Q2 |
| 4 | SCH-CONF-03 | **C30025** | Title, Expected | before "a fixed working-day start" → before the **tech's CONFIGURED start** (hierarchy Tech > Business > Default) | Branko Q2 |
| 5 | SCH-CONF-04 | **C30026** | Title, Expected | after "a fixed working-day end" → past the **tech's CONFIGURED end** (same hierarchy) | Branko Q2 |
| 6 | SCH-VIEW-04 | **C30045** | Title, Steps, Expected | toggle "VIN" gates block+tooltip → toggle **"VIN Number"** gates the **BLOCK line only**; **tooltip + modal ALWAYS show VIN** (resolves §4.13-vs-§9) | Design §6 + Branko Q3 |
| 7 | SCH-TIP-01 | **C30034** | Preconditions, Expected | tooltip VIN required toggle ON → **tooltip shows VIN unconditionally when present** (toggle-independent) | Design §6 |

## A.1 Notes-only — NO TestRail write required (local metadata only)

| SCH- | Case ID | Change | Why NO update_case |
|---|---|---|---|
| SCH-CONF-01 | **C30023** | `notes` QA-metadata caveat added: **events do NOT participate in double-booked/overlap conflict detection** (Branko Q1 2026-07-22, may change) | The change lives ONLY in the `notes` (QA-side metadata) field. The tester-facing Title/Preconditions/Steps/**Expected** are UNCHANGED (verified in `cases/cases-D-events-conflicts-capacity-tooltips.json`: Expected still lists only the standard Double-booked assertions, no events caveat). Per this manifest's no-op rule and the diff's §3B (status-notes) vs §3A (expected-edits) classification, notes-only changes are NOT emitted to TestRail. The primary events-not-counted assertion ships as a NEW case, SCH-EVT-08 (item B2). |

> **Notes-only / metadata (OPTIONAL — bundle if desired, not required):** the
> events-excluded may-change caveat + design-pinned label folds also touched the
> `notes` (QA-side metadata, NOT emitted to TestRail's tester-facing fields) of
> SCH-CAP-01/02/03/04 (C30030/31/32/33), SCH-CONF-05 (C30027) and ~44 design-pinned
> cases. **These carry NO tester-facing (Title/Preconditions/Steps/Expected) change**,
> so **no update_case is required** for them — the reader-facing text is unchanged.
> The 7 rows in section A above are the only cases whose emitted fields changed
> (SCH-CONF-01/C30023 is notes-only — see §A.1). (SCH-EVT-08 carries
> the primary events-not-counted assertion as a NEW case — item B2.)

## B. add_case — 2 NEW cases (currently blank C-id in the id-map)

| # | SCH- | Section (group 4254) | Title | Type/Priority | Driver |
|---|---|---|---|---|---|
| 1 | SCH-PERM-12 | Permissions (4279) | With Work Orders: View OFF, work-order-derived details on shifts (customer, lines, money fields) are hidden or masked | Negative / High | Branko Q3 |
| 2 | SCH-EVT-08 | Events (see 4254 child) | An event does not count toward a technician's capacity bar and does not raise a conflict | Functional / Medium | Branko Q1 (design-confirmed) |

> Full Preconditions/Steps/Expected are in `build/schedule/cases/cases-F-permissions-edge.json`
> (SCH-PERM-12) and `cases-D-events-conflicts-capacity-tooltips.json` (SCH-EVT-08), and
> in `testrail-import/schedule-v1-testrail-import.csv` (rows already emitted, VIU/flag-word-free).
> After add, capture the returned C-ids and write them into the id-map for these 2 rows.

## C. delete_case — 1 case (RETIRE, needs SEPARATE explicit user delete authorization)

| # | SCH- | Case ID | Reason |
|---|---|---|---|
| 1 | SCH-REAS-02 | **C30053** | "'Reassign' **in the shift detail modal**" — this modal action was REMOVED (Branko 2026-07-22) and is absent from the authoritative prototype (design §4c/§4d). Drag-reassignment (with the cross-tech confirmation modal) is fully covered by **SCH-REAS-01 (C30052)**. **Retire-proposed** — currently retained in TestRail + id-map; delete ONLY after the user authorizes the delete. On delete: remove the row from `testrail-id-map.csv`, mark the local body Retired, and regenerate deliverables. |

---

## D. Post-execution checklist
1. update_case ×7 → re-GET each → confirm live == local (MATCH). (SCH-CONF-01/C30023 is notes-only — NO write; see §A.1.)
2. add_case ×2 → record returned C-ids → write into `testrail-id-map.csv`
   (SCH-PERM-12, SCH-EVT-08 rows) → rerun `gen_import.py` → **re-merge ALL C-ids**
   (C29925–C30090 + the 2 new) because the rerun blanks the id-map C-id column.
3. delete_case ×1 (SCH-REAS-02 / C30053) — only with separate delete authorization.
4. Do NOT touch any execution run. No results are logged by this manifest.
5. Audit-log every write (case ID, before→after, driver + Done/Not-Done ticket status,
   spec §) per Standing Rules 8/20.
