# WO Board & Tech View (epic SV-10043, PR #3548) — regression scope, 8 Oct 2026

Draft regression cases for the areas **outside** the new Board View / Tech View that the release touches. They go
into a **new TestRail folder** that the QA lead creates. Nothing has been written to TestRail, nothing is committed,
and no QA build was opened.

- Cases: `proposals-R-regression.json` (83 new, keys NEW-R-01…NEW-R-83). Generator and validator: `gen_r.py`.
- Section placeholders: **HIGH** 50 · **MEDIUM** 30 · **LOW** 3. The rebuilt-List cases are in HIGH (hotspot 3).
- Every case: `AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build`.
- Quotes are checked by script against the developer's reply, the QA handoff or the PRD (whitespace and `**` ignored).
- Link format for covered cases: `https://shopview.testrail.io/index.php?/cases/view/<id>`.

Verdicts: **NEW** (case key) · **COVERED** (an existing feature case already checks it) · **NOT MANUAL** (API,
DevTools, database or code only; the human-visible part is in a NEW case where one exists) · **SAFE TO SKIP**
(the developer says so) · **FEATURE AREA** (inside the new views, owned by the feature suite).

## 1 · The developer's ranked list (received 8 Oct 2026)

| Item | Check | Verdict |
|---|---|---|
| High 1 | Status card Lead Technician select disabled on **Paid** | NEW-R-01 |
| High 1 | Status card Lead Technician select disabled on **Invoiced** | COVERED C96963 (step 10: lead can't be changed on the work order page) |
| High 1 | A successful change on the status card shows the new lead (handoff §7) | NEW-R-02 |
| High 1 | A refused change shows an error and puts the old value back | NEW-R-03 |
| High 1 | Lines follow the lead on the status-card path (S4-R8, handoff §7) | NEW-R-04 (board and dialog paths: COVERED C96960, C96961, C368140) |
| High 1 | Edit Work Order uses the new shared lead path | NEW-R-05 |
| High 1 | Refused lead change in Edit Work Order also drops mileage, engine hours, PO | NEW-R-06 |
| High 1 | Every lead change adds a "Lead tech changed" history entry: Edit Work Order | NEW-R-07 |
| High 1 | Same, from drag, dialog and the work order page | COVERED C96962 |
| High 1 | Lines tab: adding a line with a technician | NEW-R-08 |
| High 1 | Lines tab: editing a line's technician | NEW-R-09 |
| High 1 | Lines tab: assigning a technician | NEW-R-10 |
| High 1 | Lines tab: staff from another organization rejected | NEW-R-11 (what a person sees) + NOT MANUAL (server refusal of a foreign id) |
| High 1 | Green check before the tech story is gone (intentional) | COVERED C96997 (and C96998, C96999, C97000) |
| High 2 | Clock in on an unassigned line gives it that technician | NEW-R-12 |
| High 2 | Move a labor task to another line, the target line takes the technician | NEW-R-13 |
| High 3 | "Clear shifts" deletes or shortens the old lead's whole-work-order shifts, seen on the Schedule | COVERED C96965, C154888 |
| High 3 | Line shifts and other technicians' shifts stay untouched | COVERED C96965 (Dana Ortiz shift, Line 1 shifts), C154888 |
| High 3 | Creating shifts by dragging onto the Schedule still works | NEW-R-14 (Entire work order), NEW-R-15 (Choose lines) |
| High 3 (PRD S4-R19) | Moving, resizing, reassigning a shift does not change the lead | COVERED C96966 |
| High 4 | Asset → Work Orders tab: rows · counts · progress · sorting | NEW-R-16 · NEW-R-17 · NEW-R-18 · NEW-R-19 |
| High 4 | Customer → Work Orders tab: rows · counts · progress · sorting | NEW-R-20 · NEW-R-21 · NEW-R-22 · NEW-R-23 |
| High 4 | Organization scoping of the list query | NOT MANUAL (the rows cases show nothing foreign appears) |
| High 4 | Asset-on-site toggle no longer sends the lead, lead unchanged | NEW-R-24 (simple), NEW-R-25 (old page vs. a new lead) |
| Medium 5 | Part sale status card renders | NEW-R-51 |
| Medium 5 | Changing the technician on the part sale status card | NEW-R-52 |
| Medium 5 | Part Sales list part request and return counts | NEW-R-53 |
| Medium 6 | Remembered filter: Orders (Purchase Orders) · Vendors · Return Requests · Return Credits · Part Sales · Deliveries · Parts Catalogue (Catalog) · Inventory | NEW-R-54 · R-55 · R-56 · R-57 · R-58 · R-59 · R-60 · R-61 |
| Medium 6 | Remembered filter on the reports: Work In Progress · Sales By Customer · Parts Velocity · Inventory Value · Technician Utilization · Sales By Representative | NEW-R-62 · R-63 · R-64 · R-65 · R-66 · R-67 |
| Medium 7 | Report filter option lists tick, Select all, Clear selection (same six reports) | NEW-R-68 · R-69 · R-70 · R-71 · R-72 · R-73 |
| Medium 8 | Start impersonation while a page loads | NEW-R-74 |
| Medium 8 | Exit impersonation while a page loads | NEW-R-75 |
| Medium 8 | Session expiry on any page | NEW-R-76 |
| Medium 8 | Cancelled requests in the network log | NOT MANUAL |
| Medium 9 | New photo after reload: header · Staff · Schedule · cards (Board View) | NEW-R-77 · R-78 · R-79 · R-80 |
| Medium 9 | Avatar cache headers (ETag / 304) | NOT MANUAL |
| Low | Customers table | NEW-R-81 |
| Low | Dashboard cards with a table | NEW-R-82 |
| Low | Imported work orders open in List | COVERED C154648 |
| Low | Imported work orders keep the lead locked | NEW-R-83 (work order page) · COVERED C154887 (Reassign disabled) |
| Safe to skip | Invoicing, payments, accounting, QuickBooks | SAFE TO SKIP (used only as setup to reach Invoiced or Paid) |

## 2 · QA handoff checks that matter for regression (generated 2026-10-08)

| Handoff | Check | Verdict |
|---|---|---|
| §0 | Setup | Not a check (its setup steps are used in the preconditions) |
| §1, §3, §4, §5, §6 | Switcher, Board View, Tech View, Reassign dialog, Clear-shifts prompt | FEATURE AREA (feature suite, e.g. C96909–C96923, C96940–C96974, C368133–C368139) |
| §2 | Tabs reload the list | COVERED C96913 |
| §2 | Tab parameter added to the address | NOT MANUAL (an address detail; tab content is covered) |
| §2 | Changing tab clears the search box | NEW-R-29 |
| §2 | Column Selection "Days open" kept after reload | NEW-R-30 |
| §2 | Five columns hidden by default | NEW-R-31 |
| §2 | Every sortable header orders the rows | NEW-R-32 |
| §2 | Paging with 12 same-date work orders: no repeats, no gaps | NEW-R-33 |
| §2 | All + only Invoiced sorts by Invoiced Date, newest first | NEW-R-34 |
| §2 | Fast tab switching: only the last tab's rows, no error message | NEW-R-35 (cancelled request in Network: NOT MANUAL) |
| §2 | Asset on Site toggle flips and does not open the work order | NEW-R-36 |
| §2 | Toggle: no lead in the request, lead unchanged, kept after reload | COVERED C368158, C368159 (request body: NOT MANUAL) |
| §2 | Back after a status change shows the new status | NEW-R-37 |
| §2 | A new work order appears without a manual reload | NEW-R-38 |
| §2 | Link with Estimates and Assigned to me is applied | NEW-R-39 |
| §2 | Plain Work Orders afterwards shows the saved view | NEW-R-40 |
| §2 | Unknown Asset on Site value in a link is ignored | NEW-R-41 |
| §2 | No financial data: no Total price column, no total | NEW-R-42 |
| §2 | View-only: no Create Work Order button · toggle disabled | NEW-R-43 · NEW-R-44 |
| §2 | Phone: cards show | COVERED C154649, C154885 |
| §2 | Phone: sort choice kept · page 2 on scroll · empty state | NEW-R-45 · NEW-R-46 · NEW-R-47 |
| §7 | Invoiced/Paid refused from dialog and board drag, Complete and Declined allowed | COVERED C96963, C96964, C97009 |
| §7 | "Sending the same lead again succeeds" | COVERED C96969 (UI) · request-level NOT MANUAL |
| §7 | Status card disabled · successful change · refused change | NEW-R-01 · NEW-R-02 · NEW-R-03 |
| §7 | Lines follow the lead, clocked/explicit lines stay | NEW-R-04 (status card) · COVERED C96960, C96961, C368140 |
| §7 | Exactly one "Lead tech changed" entry, also from Edit Work Order | NEW-R-07 · COVERED C96962 |
| §7 | Edit Work Order refused, mileage not saved | NEW-R-06 |
| §7 | Adding, editing, assigning line technicians · clock-in on unassigned line | NEW-R-08 · R-09 · R-10 · R-12 |
| §8 | Scheduled technician shows on the line, no "Needs techs" | COVERED C368142, C351740 (Vladimir Tomovic's) |
| §8 | Two technicians show once each | COVERED C368142 |
| §8 | Removing the shifts restores the empty Labor row | NEW-R-26 (follows PRD "Unassigned", see notes) |
| §8 | Real labor kept, "Deleted user" stays | NEW-R-27 · labor technician part COVERED C368143 |
| §8 | Lead alone is not shown as scheduled | COVERED C368143 |
| §8 | Phone width "Assigned Technicians" | NEW-R-28 |
| §8 | One request per work order, offline, history mode | NOT MANUAL |
| §8 | Green check removed, story still editable | COVERED C96997, C96998 |
| §9 | All API checks (status codes, fields, avatar headers, denied roles) | NOT MANUAL · human-visible parts in NEW-R-11, R-16…R-23, R-77…R-80 and feature C96967, C368147 |
| §9 | List, customer and vehicle Work Orders tabs still render | NEW-R-16, NEW-R-20 (and every List case) |
| §10 | Location A shows nothing from B: List · part counts | NEW-R-48 · NEW-R-49, NEW-R-53 |
| §10 | Location A shows nothing from B: Board View, Tech View, candidates | COVERED C154650 |
| §10 | Part Sales request and return counts | NEW-R-53 |
| §10 | Database schema checks | NOT MANUAL |
| Hotspot 1 | Lead change side effects from every entry point | NEW-R-01…R-07 + COVERED C96960–C96965, C154888–C154890 |
| Hotspot 2 | Drag and drop with an optimistic cache | FEATURE AREA (C97001–C97013, C368137–C368139) |
| Hotspot 3 | Rebuilt List: links, Back and Forward, location switch, stale rows, sorting and paging | NEW-R-29…R-50 · location switch COVERED C96923 |
| Hotspot 4 | Consumers of the work-order list refactor | NEW-R-16…R-23, R-48, R-49, R-53 |
| Hotspot 5 | Shared plumbing: request cancelling, filter option list, remembered settings, avatars | NEW-R-54…R-80 |
| Not impacted | "The Schedule page itself" | Overridden by the developer's High 3 (his list is the scope): NEW-R-14, R-15 |
| Not impacted | Other FilterBar / table / preference pages beyond one smoke check | One smoke case per page: NEW-R-54…R-67, R-81, R-82 |

## 3 · PRD lines kept from production (edited 7 Oct 2026)

| PRD | What must keep working | Verdict |
|---|---|---|
| §1 Business Case | "List remains the default and stays exactly as it is in production today" | Quoted in NEW-R-29…R-50 |
| §4 Key Decisions (lead lock) | Lock on every path, including the work order detail page | NEW-R-01, R-03, R-06 · COVERED C96963 |
| S4-R8 | Line movement on every lead-change path | NEW-R-04 · COVERED C96960, C96961, C368140 |
| S4-R9 / S4-R17 / S4-R18 | One audit entry, none for moved lines, line auditing as before | NEW-R-07 · COVERED C96962 |
| S4-R19 | Schedule changes never change the lead | COVERED C96966 |
| S4-R31 | No clear-shifts question on the work order page or List | COVERED C368136 (also in NEW-R-04 results) |
| S4-N2 | Imported lead locked | NEW-R-83 · COVERED C154887 |
| S7-R8…R10 | Lines tab scheduled technicians | NEW-R-26, R-27, R-28 · COVERED C368142, C368143, C351740 |
| S8 | Tech story check mark removed, stories still work | COVERED C96997–C97000 |
| S1-N1 | "No work orders match your filters" | NEW-R-47 (phone) · COVERED C96918 (desktop) |

## 4 · Navigation to confirm on the build

Not found in our repo, so written in plain words: the Edit Work Order window and its Mileage / Engine Hours / PO
fields · the Lines tab's assign-technician action · Technicians on New Line · Labor row More actions > Move labor
(a design label) · the count on an asset's Work Orders tab · the impersonation start and exit controls · where a
profile photo is uploaded · the part sale status card's person field (technician or Sales Representative) · how the
Part Sales list shows request and return counts · the filter buttons on Deliveries · whether Vendors has a filter
bar · the report select-all and clear labels · the List rows-per-page control · which Dashboard cards hold a table.

## 5 · Reading coverage

| Source | Size | Lines read | Coverage |
|---|---|---|---|
| Dev-regression-areas-reply-2026-10-08.md | 3,863 B | 1–50 | 100% |
| QA-Handoff-SV-10043-dev-test-plan-2026-10-08.md | 47,452 B | 1–463 | 100% |
| CONFLUENCE-845185030-…-PRD-v33-edited-2026-10-07.md | 59,254 B | 1–640 | 100% |
| WORKER-BRIEF.md | 15,374 B | all | 100% |
| skills/18-LAYMAN-UI-STEPS.md | 17,114 B | all | 100% |
| snapshots-final C*.json (188 cases) | — | titles of all 188 by script, full bodies of the 25 that overlap | as stated |
| Label sources (APP-ACTIONS-PLAYBOOK, OBSERVED-UI-LABELS-*, earlier suites' snapshots) | — | targeted grep for each label | as needed |
