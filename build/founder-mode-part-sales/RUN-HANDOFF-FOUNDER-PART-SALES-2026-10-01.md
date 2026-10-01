# HANDOFF → RUN SESSION — Founder Mode → Part Sales (57 cases)
### Execute on QA branch **sv9667.qa.shopview.com** (build `v26.39.2-210868d`) and record results. 2026-10-01.

**You are the run session.** All 57 are build-verified on sv9667 (evidence `build/founder-mode-part-sales/build-verify-2026-10-01/`,
labels `OBSERVED-UI-LABELS-sv9667.md`, routes `NAVIGATION-MAP.md`). Each is runnable, renders `fr-view`, stamped
*"Last checked against build v26.39.2-210868d on 10/1/2026."*, marked **AUTOMATION: READY**. Mark **Passed/Failed/Blocked**.

- **Scope:** **57 cases**, created_by=3, TestRail group **20435 "Part Sales"** (under 20434 Founder Mode), suite 1.
  8 sections (S1 core return, S3 tax rate, S4 audit log/menu, S5 sales rep, S6 actions column, S7 labels/tab bar,
  S8 deposit, DATA accuracy). 0 foreign, 0 automated.
- **Environment:** QA branch sv9667.qa.shopview.com / sv9667api.qa.shopview.com. Disposable — full CRUD, tag
  ZZAUTOTEST, restore (Rule 6/107). Build marker v26.39.2-210868d (re-read before starting).

## Access (QA branch behind Cloudflare — THREE cookies)
sv_sso_session + PHPSESSID + cf_clearance → /tmp/cln/sv9667-cookies.json (chmod 600, NEVER committed; ask QA lead
for fresh set, expire ~24h). Boot `node build/testing-tools/qa-branch-boot.mjs sv9667 <route> admin`; Chrome-131 UA;
NODE_USE_ENV_PROXY=1; bridge `source build/testing-tools/ensure_bridge.sh`. TestRail API rate-limits bursts (HTTP 400).

## Run + result writes — needs the QA lead's go-ahead (Rule 6)
No manual run exists. Ask the QA lead to authorise a run "Founder Part Sales — manual (sv9667)" over these 57,
then record with push_results_to_run.py, union-only (Rule 34).

## Glossary is build-aligned; Expected substance is the spec's (Rule 114)
Role perms aligned to the build's role groups "Part sales" / "Invoicing & payments" (+ Create & Edit / View).
Part sale document, Finance tab, Financial Info/tax line, Sales Representative, Parts tab, list and statuses match.

## Key routes (full map in NAVIGATION-MAP.md)
- Part Sales list: `/parts/part-sales` (Parts → sidebar "Part Sales"). New via "New Part Sale".
- Part sale document: `/parts/part-sale/<uuid>` — tabs Parts / Stats / Finance; Finance has Add Deposit,
  Create Invoice, Estimate/Invoice toggle, Financial Info (Parts/Subtotal/<tax>/Total/Balance).

## 🔎 Confirm LIVE when you run (entry points confirmed; the sub-dialog/log render was not raisable via automation)
- **Add Deposit dialog** fields + pre-filled Memo (S8). - **Tax-rate change** control (S3). - **Audit log** entries
  & menu order (S4). - full **Actions-column layout** + **core return row** (S6/S1). If a label differs, it's a
  glossary nit to note (not a Fail).

## The 57 cases (by section)
| C-id | Section | Title |
|---|---|---|
| C154586 | S1 | Core charge shows on the estimate and counts toward the totals |
| C154587 | S1 | Return Core credits the core and badges the row Returned |
| C154588 | S1 | A returned core's credit equals the charge, and both are logge |
| C154589 | S1 | Cancel Return restores the charge after a confirmation |
| C154590 | S1 | Return Core appears only after receipt and before invoicing |
| C154591 | S1 | Core actions are hidden without the shared core permission |
| C154592 | S1 | Returning a core moves no stock and isn't a vendor credit |
| C154593 | S1 | A core return covers the whole quantity |
| C154594 | S1 | Only post-release sales charge the core from the quote |
| C154595 | S1 | Moving a charged core to a work order makes it unanswered |
| C154596 | S1 | The Core credit syncs to QuickBooks as a negative line |
| C154597 | S1 | Reversing the invoice keeps the core charge and credit rows |
| C154598 | S1 | The core parent/child prints on every document, never on the g |
| C154599 | S1 | A part sale's reported figures include the charged core |
| C154600 | S1 | A fee or discount on a returned core nets to $0 |
| C154601 | S1 | Receiving a part-sale core tags it Charged |
| C154602 | S1 | Returns count ignores Core credit; the label is document-only |
| C154603 | S1 | A zero core is refused; a picked inventory core bills its pric |
| C154604 | S1 | Simultaneous returns are refused; a vendorless core still retu |
| C154605 | S1 | A core return below a deposit becomes a credit at invoicing |
| C154606 | S3 | Edit tax rate opens the tax picker and recalculates the total |
| C154607 | S3 | A tax change is logged and never restates an existing invoice |
| C154608 | S3 | Edit tax rate is hidden once invoiced or without permission |
| C154609 | S4 | Audit Log opens a searchable Part Sale Log |
| C154610 | S4 | The menu is reordered with Delete last and not red |
| C154611 | S4 | A Complete part sale deletes, but received parts still block i |
| C154612 | S4 | Created is the first entry; a split writes a linked pair |
| C154613 | S4 | The log is refused without permission and shows only this sale |
| C154614 | S4 | Nothing is backfilled and the work order log is unchanged |
| C154615 | S5 | The header card carries a clearable Sales Representative field |
| C154616 | S5 | The rep is captured at invoicing and logged prev to new |
| C154617 | S5 | An unset rep falls back to the customer's rep, else Unassigned |
| C154618 | S5 | The rep is read-only once invoiced; non-reps can't be picked |
| C154619 | S6 | The Actions column shows the primary action under its heading |
| C154620 | S6 | The work order grid is unchanged; empty actions leave the cell |
| C154621 | S7 | The bulk and row menus are renamed and title-cased |
| C154622 | S7 | The tab bar reads Parts, Notes, Stats, Finance |
| C154623 | S7 | The work order is untouched; Notes ships with another project |
| C154624 | S7 | A split leaves the deposit and carries the line's core |
| C154625 | S8 | Add Deposit opens the work order dialog on the Finance tab |
| C154626 | S8 | A deposit shows in payment history and auto-applies at invoici |
| C154627 | S8 | A deposit isn't gated on a core; Record Deposit uses own metho |
| C154628 | S8 | Collect in Portal is offered only when the portal says yes |
| C154629 | S8 | A part sale deposit syncs to QuickBooks like a work order's |
| C154630 | S8 | A held deposit blocks changing the customer and deleting |
| C154631 | S8 | A deposit charges the owning location's account |
| C154632 | S8 | Add Deposit is refused once the sale is invoiced or paid |
| C154633 | S8 | Add Deposit needs both permissions; the server also enforces |
| C154634 | S8 | An unreachable portal is declined; hidden where a WO hides it |
| C154635 | S8 | Until the portal accepts part sales the rest of Story 8 is liv |
| C154636 | S8 | Deposits above the total settle to zero and leave a credit |
| C154637 | DATA | Charged core: document totals to the exact cent |
| C154638 | DATA | Returned core: credit is exact and totals fall back |
| C154639 | DATA | Tax change recalculates to the exact cent; card matches docume |
| C154640 | DATA | Core credit reaches QuickBooks as the exact negative amount |
| C154641 | DATA | Deposit above total leaves the exact customer credit |
| C154642 | DATA | A zero-dollar core is impossible |

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | QA lead go-ahead to create the manual run over these 57, then record Passed/Failed/Blocked. |
| 2 | Confirm the four live-only screens above (Add Deposit dialog, tax-rate change, audit log, actions column/core). |

**Standing holds:** no Jira/external artefact without the QA lead; no TestRail writes to foreign cases; run creation
+ result writes need his go-ahead (Rule 6); secrets never committed; QA branch disposable.
