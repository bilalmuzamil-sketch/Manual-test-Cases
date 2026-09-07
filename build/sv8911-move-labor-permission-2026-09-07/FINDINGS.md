# SV-8911 — Technician "Move labor" permission oversight — QA (re-test)

**Ticket:** https://shopview.atlassian.net/browse/SV-8911 (Bug, was REJECTED FROM TESTING, priority Medium, assignee Nemanja Djuric, reporter Ryan Fyfe / customer Katie Carrick)
**QA branch:** https://sv8911.qa.shopview.com/ (API sv8911api)
**Build marker (read live, unchanged across the pass):** `v26.35.9-197fce0`, index.html last-modified Fri 04 Sep 2026 10:47:21 GMT, etag `49ffa0fdffe1976ecacf5c9ce8cd3142`.
**Org:** d55bc308 (template snapshot, seeded per dev). Test WO **S8911-17.. (b94d839f)**.

## Reported bug (ticket description — Rule 66)
A Technician with "edit labor and parts" permission can also **move labor** on a work order, which they should not. Expected: technicians cannot move labor. (Dev handoff comment 76015 = the full inline checklist, mirrored below.)

## Per-check results (dev checklist §0–§5) — ALL LIVE
| § | Check | Result |
|---|-------|--------|
| §0 | Administrator role → Work Orders → **Move labor toggle ON** | **PASS** (toggle ON) |
| §0 | Admin right-click a line with an assigned technician → **Move labor appears** | **PASS** |
| §1 | **Technician** right-click line → **Edit labor present, Move labor absent** | **PASS** — the reported bug, fixed (exhibit-1) |
| §1 | **Admin** right-click same line → both present + **completes a move** | **PASS** — moved labor line 1 → line 5 (API confirmed) (exhibit-2) |
| §1 | `POST /api/work-orders/tasks/move`: Technician **403**, Admin passes | **PASS** (tech 403 "Access denied"; admin 400 = validation, gate passed) |
| §2 | Toggle round-trip: enable Move labor on Technician → appears in menu; disable → gone | **PASS** (Technician restored to OFF) |
| §2 | Cascade: enabling Move labor auto-enables Work Order Lines: C&E + Work Orders: View | **PASS** (Sales Rep: C&E OFF→ON on enable) |
| §2 | Cascade: turning Work Order Lines: C&E OFF clears Move labor | **PASS** (Foreman) |
| §2 | Cascade: turning Work Orders: View OFF clears Move labor | **PASS** (Foreman) |
| §3 | Keep it: Service Manager, Sr Service Advisor, Service Advisor, Foreman, Parts Manager | **PASS** (all ON — UI toggle + role def) |
| §3 | Absent: Office User, Sales Representative, Time Clock User | **PASS** (all OFF) |
| §3 | Absent: **Parts Technician** | **DEVIATION — Parts Technician has Move labor ON** (dev §3 expects OFF) |
| §4 | `POST /api/technician-tasks/move`: Technician & Foreman → **403** | **PASS** (both 403; was unauthenticated before the fix) |
| §4 | Admin timesheet move passes the gate | **PASS** (admin 400 = validation, gate passed) |
| §5 | Create role → clone Service Manager → prefill shows **Move labor ON** | **PASS** |

## Verdict
**The reported customer bug is FIXED** — technicians can no longer move labor (menu item gone + backend 403), and Edit labor is retained. The out-of-scope timesheet-endpoint hole is also closed (Technician/Foreman 403).

**One deviation from the dev's own §3 checklist:** **Parts Technician still carries Move labor** (confirmed at both the role-permission toggle and the role definition). This is consistent with the fix's "preserve existing behaviour" backfill (Parts Technician has "Work Order Lines: Create & Edit", which Move labor used to ride on), so it is most likely a **checklist wording error rather than a build defect** — but it contradicts the dev's stated expectation and the ticket description does not define the per-role matrix, so it needs the dev's confirmation. Not silently passed or failed.

## Live enforcement matrix (backend gate = `IsGranted(woMoveLabor)`, proven)
- Technician → `tasks/move` 403 · `technician-tasks/move` 403
- Admin → both 400 (gate passed, empty-body validation)
- Foreman → `tasks/move` 400 (has it) · `technician-tasks/move` 403 (no timesheets C&E)
- Move-labor toggle live: Admin/SM/SrSA/SA/Foreman/PM = ON; Technician/Office/SalesRep/TimeClock = OFF; **Parts Technician = ON**.

## Separate finding (NOT caused by this ticket) → filed as its own ticket
On the WO Lines tab a line row shows **Labor = Unassigned** while that line's **Edit Line dialog shows assigned technicians** (line 2 "Service - Wheels off": row Unassigned, dialog shows David Haynes + Emily Madden; API `line_tech_assigned_id = null` but schedule roster has two). Per Nemanja (comment 76073) the row shows the labour-task technician while the dialog shows the SV-8685 schedule roster; `WorkOrderLineRow.vue`/`LinesDetailProvider.php` are byte-identical on prod/develop/sv8911, and SV-9486 (25 Aug) removed the roster avatars from the row, making the divergence more visible. Reporter observed it reproduces on this branch but not staging/prod (data-shape dependent). Exhibits 3 & 4. Filed separately (see the SV-8911 comment for the key).

## Honest split (UI vs API)
- Thing under test = **UI-observed live**: the right-click menus per role (the customer's exact surface), the toggle matrix + cascade, the wizard prefill, the Admin move completion, and the divergence dialog.
- Setup/corroboration = API: the role-definition read, the enforcement-gate probes (403/400), and the labour-task move confirmation.
- Impersonation via `switch-user` was flaky on this branch, so the §3 non-Technician roles were read at the UI toggle + role-definition layers (both live) plus the proven backend gate, rather than each individually driven as its own login.
