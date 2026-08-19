# Batch B — Automated cases HELD (Rule 71, ask-first)

`custom_atmstatus = 3` ("Automated") cases are the automation engineer's (Vladimir Tomovic, id 1)
contract. Per Standing Rule 71 / skill `03` §6.4 they are **ask-first for ANY change, even our own**,
and a CONTENT edit is made **only coupled with live build-verification** in the same pass — never on a
documents-only basis. The flag is read LIVE (it moves).

## Batch B Automated inventory (read live from TestRail 2026-08-19, `v3.8-bd246fd`)
| C-id | Section | atm (read live) | Owner | Status this session |
|---|---|---|---|---|
| **[C43811](https://shopview.testrail.io/index.php?/cases/view/43811)** | 4275 Reassignment and Context Menu | **3 (Automated)** | Vlad (id 1) | **HELD — verified live, NOT written.** |

**Re-check of the whole batch for `atm=3`:** a live scan of all 66 batch-B cases found **only C43811**
carries `atm=3`; the other 65 are `atm=1`. No hidden Automated case.

## What was verified live for C43811 (observation only — 0 writes)
C43811 = *"The empty-cell menu's first item Assign work order schedules an existing order"*
(refs `SV-9242 (§7;§4.10;§14.1)`).
- **The feature is BUILT.** Left-clicking an empty grid cell opens a menu whose **first item is
  "Assign Work Order"** (`menu_schedule_assign_work_order`), ahead of "Create Event" and "New Work
  Order". Selecting it opens a **non-drag scheduling modal** (`dialog_title` = "Assign Work Order",
  a work-order select `select_assign_work_order`, and Assign/Cancel buttons `button_assign_confirm` /
  `button_assign_cancel`) — matching the v29 spec addition *"Cell menu gains 'Assign work order'
  FIRST (opens a non-drag scheduling modal)"*.
- **Its stored body is truncated / incomplete** — the entire `custom_expected` reads
  *"The new block is still on the technician's lane after the reload, and"* with **no numbered steps,
  no provenance line, and no automation marker.** As stored it is **not runnable** by a manual tester.

## Intended change (recorded, NOT applied)
The case needs its steps of reproduction, expected behaviour and a Rule-54 provenance line
**completed** so it matches the live build (Assign Work Order → non-drag modal → schedules the chosen
order; block persists after reload). Because C43811 is Automated, this CONTENT edit is **batched into
a coupled build-verify pass only after the QA lead authorises it** (Rule 71 refinement), then the case
number is handed to Vlad. **Nothing was written this pass.**

## What happens on authorisation (Rule 71 / §6.4)
1. Verify C43811 live against the current spec (Confluence v30, §7 / §4.10 / §14.1) + the running build.
2. Complete the truncated steps/expected + add the Rule-54 provenance line + set the correct marker
   (`READY` on success), **coupled with the live build-verification in the same pass.**
3. **Ask the QA lead first** (per case or per batch) before editing.
4. **Share the case number with Vladimir Tomovic (id 1)** via
   `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md` so he adjusts his
   automation.
