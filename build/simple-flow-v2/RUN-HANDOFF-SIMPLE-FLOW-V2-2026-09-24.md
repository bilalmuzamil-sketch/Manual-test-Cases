# HANDOFF → RUN SESSION — Simple Flow V2 (64 cases)
### Execute on **Production** (`app.shopview.com`, build `v26.39.0-07c719b`) and record results. 2026-09-24.

**You are the run session.** All 64 are build-verified on the live production build (report/evidence:
`build/simple-flow-v2/build-verify-2026-09-24/`). Every case is runnable from the UI, renders `fr-view`,
and carries the stamp *"Last checked against build v26.39.0-07c719b on 9/24/2026."* Execute each, mark
**Passed / Failed / Blocked**. **C44549 is HELD — do not pass or fail it (§HOLD).**

- **Scope:** 64 cases, `created_by=3`, TestRail project **1 (suite "Master")**, sections **6666–6677**
  (Simple Flow V2). Full list in the table below. **15 other cases in these sections are Vladimir's
  (`created_by=1`) — OUT of scope, hands-off (Rule 38).**
- **Environment:** **Production** — the feature shipped; the `sv8683` QA branch is retired and gone.
  Test org **"Trucks Hill 2"** (disposable dummy prod org; full CRUD authorised, Rule 6/107 — tag throwaway
  data `ZZAUTOTEST`, restore what you change). **Production is otherwise NOT a test environment — stay in
  Trucks Hill 2.**
- **Build marker:** `v26.39.0-07c719b` (read live 2026-09-24). Re-read it before you start; if it moved,
  the routes/labels still hold but say so in your report.

## Access (production, the recorded way — playbook §K)
- `source build/testing-tools/ensure_bridge.sh` (refresh the MITM bridge port each run).
- Login is **POST /api/login {username,password} → PHPSESSID** (no SSO on prod; quick-login 500s — do not try).
  **LOG IN ONCE PER RUN:** a fresh login for the same user EXPIRES that user's prior PHPSESSID (old → 409/401).
  Browser: `node build/testing-tools/prod-login-boot.mjs` (`bootProdLogin(route)`), creds in
  `/tmp/shopview/prod-login.env` (SV_USER/SV_PASS — chmod 600, /tmp only, **NEVER committed**, Rule 82).
- Node fetch through the bridge needs `NODE_USE_ENV_PROXY=1`.
- **TestRail API:** the API *key* is `/tmp`-only and may be wiped in a fresh container; the **web login
  password** (`ENVIRONMENT-CREDENTIALS.md` §4) authenticates `/index.php?/api/v2/` via Basic auth.

## The run + result writes — needs the QA lead's go-ahead (Rule 6)
**No manual run exists for these yet** (the only open runs in project 1 are automated "Nightly" runs — do
NOT write into those). Ask the QA lead to authorise **creating a run** "Simple Flow V2 — manual execution"
over these 64 C-ids, then record with `build/testing-tools/push_results_to_run.py` (playbook §W), union-only
sync (Rule 34). Result writes and run creation are TestRail writes — get his explicit go-ahead first.

## Data — already seeded / self-seeding
The states these cases need are seeded in Trucks Hill 2 (seed map: `build/simple-flow-v2/build-verify-2026-09-24/PASS-FOUNDATION.md`).
**A prod redeploy can wipe seeded data — check the build marker first if a record "disappears"** (Rule 111 /
skill 20). Re-seed or build the state by UI clicks (Rule 107) rather than declaring blocked.

## 🔴 Judge by MEANING, not button spelling (the Expected wording is the spec's, frozen — Rule 114)
The QA lead ruled 2026-09-24: leave the "what should happen" text exactly as the spec wrote it. So a few
cases spell a control slightly differently from the screen. **These are the SAME control — do not fail a
case over the spelling:**
| Case text (in Expected) | On the screen (build glossary) |
|---|---|
| "Received later" | **"Receive later"** (role permission + per-part option) |
| "Order Parts" | **"Order parts"** |
| "Pick Parts" | **"Pick parts"** |
| "Tech View" | **"Tech view"** (Work Orders → View mode) |
| "In Stock" | **"In stock"** (part-availability badge — casing not re-confirmed live; treat as same) |

## Two screens to OPEN when you execute (entry points confirmed present on the build; the pop-up itself not opened at build-verify)
- **Completion wizard** (C44594–C44598): open it from the work-order header three-dot (`more_vert`) menu →
  **"Create Invoice"**, on a work order with something outstanding (unpicked part, missing tech story, an
  unreceived ordered part). It shows step pills (Tech stories / Pick parts / Missing details) each with its
  own action button and no Continue button.
- **Receive-later split button** (C44592/C44593/C53489): needs **Settings → Work Orders**:
  "Require Ordering Parts" ON and **"Require Receiving Parts Before Completion" ON**, a vendor part added to a
  line and "Order"ed so it awaits receipt, and the **"Receive later"** role permission. The Receive control
  then shows a caret offering **"Receive later"** per part. Without the permission or with the setting OFF, no
  such option appears (C44593).

## §HOLD — C44549, do not run as pass/fail
C44549 ("Require settings appear named and grouped on the Work Orders settings page") is **HELD**
(`AUTOMATION: HOLD`). Its Expected was corrected on 2026-09-24 (the earlier "the page shows four toggles"
was our inference, not the spec; the live page shows eight settings in three groups — Workflow / Line
requirements / Parts). The QA lead needs to confirm the corrected Expected before it runs. Mark it
**held / not run**, not Passed or Failed.

## 🔴 Seven cases are flagged AUTOMATED (`custom_atmstatus=3`) — Rule 71/65
These were build-verified (made manually runnable) with the QA lead's explicit go-ahead. **Never change a
case TestRail flags Automated without his go-ahead; when a pass changes one, tell Vlad (Rule 65).** The QA
lead is alerting Vlad. Run them like the rest; do not edit them.
- C44557 — Only ordering and picking ask to confirm; picking-off warns of stock d — https://shopview.testrail.io/index.php?/cases/view/44557
- C44561 — An approved line completes whatever the state of its parts — https://shopview.testrail.io/index.php?/cases/view/44561
- C44575 — Bulk approve/decline judges each line and never sweeps a declined line — https://shopview.testrail.io/index.php?/cases/view/44575
- C44583 — Receive opens a modal (no navigation) with contents depending on entry — https://shopview.testrail.io/index.php?/cases/view/44583
- C44587 — A user without See Financial Data can still receive; money fields remo — https://shopview.testrail.io/index.php?/cases/view/44587
- C44604 — Move up reorders a part within its line and persists — https://shopview.testrail.io/index.php?/cases/view/44604
- C44605 — Reordering negatives: cross-line moves, invoiced WO, concurrent edits — https://shopview.testrail.io/index.php?/cases/view/44605

## The 64 cases
| C-id | Title | Marker | Tag |
|---|---|---|---|
| C44549 | SFV2 Require settings appear named and grouped on the Work O | HOLD - Expected correcte | HOLD |
| C44550 | Auto-pick setting renamed to 'Require picking inventory part | READY |  |
| C44551 | 'Require ordering parts' is a new setting; on by default rep | READY |  |
| C44552 | Require picking and Require receiving control their actions  | READY |  |
| C44553 | Turning a Require setting on later does not retro-act on exi | READY |  |
| C44554 | A settings change applies to every open work order, not just | READY |  |
| C44555 | Each settings-change record is written to the audit log with | READY |  |
| C44556 | Invoiced/paid work orders and declined lines are excluded fr | READY |  |
| C44557 | Only ordering and picking ask to confirm; picking-off warns  | READY | AUTO |
| C44558 | Cancelling a settings change leaves the setting and records  | READY |  |
| C44559 | Applying a settings change blocks only the acting admin, nev | READY |  |
| C44561 | An approved line completes whatever the state of its parts | READY | AUTO |
| C44562 | Other line requirements still apply when their setting is on | READY |  |
| C44563 | A line reaches Complete only through the defined paths | READY |  |
| C44564 | Clock-out modal: two complete buttons; line-completed tick b | READY |  |
| C44565 | Complete is never disabled for a parts reason; reopen return | READY |  |
| C44566 | Line actions offered match the line's status | READY |  |
| C44567 | Decline is disabled while a line holds received or picked pa | READY |  |
| C44568 | Part actions offered match the part's state (seven states) | READY |  |
| C44569 | Ordering precedes receiving; Receive placement follows the s | READY |  |
| C44570 | Declining or sending back a line returns only not-yet-arrive | READY |  |
| C44571 | Bulk bar replaces the column headers and lists actions by on | READY |  |
| C44572 | Primary slots fill in a fixed order; More holds the rest | READY |  |
| C44573 | Bulk actions confirm/undo per their kind and give one toast  | READY |  |
| C44574 | Bulk bar hidden without permission; empty/zero states handle | READY |  |
| C44575 | Bulk approve/decline judges each line and never sweeps a dec | READY | AUTO |
| C44576 | Bulk approve/decline skips ineligible lines and hides at zer | READY |  |
| C44577 | Bulk complete labels and counts follow the selection of Appr | READY |  |
| C44578 | Bulk delete lines is out of scope this release (no delete ac | READY |  |
| C44579 | Bulk order raises a purchase order per vendor and confirms f | READY |  |
| C44580 | Bulk order skips already-ordered and non-vendor-sourced part | READY |  |
| C44581 | Bulk pick runs the existing pick atomically for in-stock unp | READY |  |
| C44582 | Bulk pick action hidden without Pick Parts permission | READY |  |
| C53486 | Deselect all keeps the bar, close dismisses it; an empty gro | READY |  |
| C44583 | Receive opens a modal (no navigation) with contents dependin | READY | AUTO |
| C44584 | Receive requires vendor, invoice number and invoice date; co | READY |  |
| C44585 | Vendor-missing card requires Assign vendor first, applied to | READY |  |
| C44586 | One invoice number belongs to one PO; two POs make two bills | READY |  |
| C44587 | A user without See Financial Data can still receive; money f | READY | AUTO |
| C44588 | Receive modal rejects invalid parts, unordered/unapproved, a | READY |  |
| C53487 | A vendor can be corrected until a part is received, then it  | READY |  |
| C44589 | Purchase orders group by vendor, missing vendors first, coll | READY |  |
| C44590 | A panel expands per purchase order with per-PO vendor-side f | READY |  |
| C44591 | Receive validity on the PO page matches the modal; money hid | READY |  |
| C53488 | PO list-page selection raises the shared bulk bar; Select al | READY |  |
| C44592 | Receive becomes a split button offering Received later, chos | READY |  |
| C44593 | Without the permission or the setting, no Received later opt | READY |  |
| C53489 | Deferring a part with a core: the core follows the parent, n | READY |  |
| C44594 | The wizard opens only from defined entry points when somethi | READY |  |
| C44595 | The wizard shows only outstanding steps in a fixed order | READY |  |
| C44596 | Each wizard step's own action saves and advances; no Continu | READY |  |
| C44597 | Where a wizard run ends depends on what opened it | READY |  |
| C44598 | Wizard handles not-required steps, mid-run completion and se | READY |  |
| C44599 | The header offers only the one finish action that is genuine | READY |  |
| C44600 | Create invoice runs the wizard if needed, then invoices and  | READY |  |
| C44601 | Finish-action negatives: reviewer, invoice lock, declined-on | READY |  |
| C44602 | Part and line ... menus contain the actions that belong to t | READY |  |
| C44603 | Menu negatives: Request part, Uncomplete, Receive part visib | READY |  |
| C44604 | Move up reorders a part within its line and persists | READY | AUTO |
| C44605 | Reordering negatives: cross-line moves, invoiced WO, concurr | READY | AUTO |
| C44606 | 'Received later' is the one new permission, off by default,  | READY |  |
| C44607 | Every Simple Flow action is gated by its mapped existing ato | READY |  |
| C44608 | Money follows See Financial Data; work follows View mode | READY |  |
| C44609 | A user without an atom never sees the action; hidden values  | READY |  |

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | Get the QA lead's go-ahead to create the manual run over these 64, then record Passed/Failed/Blocked. |
| 2 | **C44549** — held; mark not-run, do not pass/fail (corrected Expected awaits QA-lead sign-off). |
| 3 | Judge by meaning, not button spelling (see the glossary table). |
| 4 | Open the completion wizard and the receive-later split button when you execute (entry points confirmed). |
| 5 | 7 automated cases — run as-is, do not edit; Vlad is being alerted separately. |

**Standing holds:** no Jira/external artefact without the QA lead; no TestRail *case* writes without his
go-ahead; **run creation + result writes need his go-ahead too (Rule 6)**; Vladimir's cases never; Automated
cases never edited without him; secrets never committed; stay inside the Trucks Hill 2 test org on production.

---
_(Rule 95 — Token-Discipline Charter, canonical copy `build/skills/TOKEN-DISCIPLINE-CHARTER.md`: strategy
first · never bulk-read · spawn discipline · never poll · batch writes · piggyback · never re-do · answer in
text · the budget · week-start guard · quality is never the thing cut.)_
