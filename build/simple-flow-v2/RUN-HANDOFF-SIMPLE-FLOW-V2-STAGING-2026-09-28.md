# HANDOFF → RUN SESSION — Simple Flow V2 (55 cases) · STAGING
### Execute on **staging** (`app.staging.shopview.com`, build `v26.39.1-02c6b6c`) and record results. 2026-09-28.

**You are the run session.** All 55 are build-verified on staging (evidence:
`build/simple-flow-v2/build-verify-staging-2026-09-28/`, observed labels:
`build/simple-flow-v2/OBSERVED-UI-LABELS-staging.md`). Every case is runnable from the UI, renders
`fr-view`, and is stamped *"Last checked against build v26.39.1-02c6b6c on 9/28/2026."*
Execute each, mark **Passed / Failed / Blocked**. **C44549 is HELD — do not pass or fail it (§HOLD).**

- **Scope:** **55 cases**, `created_by=3`, TestRail project **1 (suite "Master")**, sections **6666–6677**
  (Simple Flow V2, group 6665). The suite was consolidated 64→55 on 2026-09-28 (9 redundant cases deleted
  by the rewrite pass). **15 other cases in these sections are Vladimir's (`created_by=1`) — hands-off (Rule 38).**
- **Environment:** **staging** (the QA branch sv8683 is retired). Org seen during verification:
  "Staging Heavy Duty - 9919". Staging is a disposable test environment — full CRUD, tag throwaway data
  `ZZAUTOTEST`, restore what you change (Rule 6/107).
- **Build marker:** `v26.39.1-02c6b6c` (read live 2026-09-28). Re-read before you start; if it moved, the
  routes/labels still hold but say so.

## Access (staging — cookie-gated, behind Cloudflare)
- Staging needs **three cookies** captured from a signed-in browser: `sv_sso_session`, `PHPSESSID`,
  `cf_clearance`. Ask the QA lead to drop a fresh set (they expire ~24h / on deploy). Put them in
  `/tmp/cln/cookies.json` (`{sv_sso_session,PHPSESSID,cf_clearance}`, chmod 600, /tmp only, NEVER committed).
- Browser sign-in: `SV_KEY=admin node build/testing-tools/staging-boot2.mjs <route>` (quick-login + hydrates
  the SPA). Node fetch needs `NODE_USE_ENV_PROXY=1`; refresh the MITM bridge with
  `source build/testing-tools/ensure_bridge.sh`. Use the Chrome-131 User-Agent (cf_clearance is UA-bound).
- **TestRail API is rate-limited** — page reads in small batches with pacing (rapid bursts return HTTP 400).

## The run + result writes — needs the QA lead's go-ahead (Rule 6)
**No manual run exists for these** (project 1's open runs are automated "Nightly" runs — do NOT write into
those). Ask the QA lead to authorise **creating a run** "Simple Flow V2 — manual execution (staging)" over
these 55 C-ids, then record with `build/testing-tools/push_results_to_run.py` (playbook §W), union-only (Rule 34).

## Glossary is now build-accurate; judge by MEANING (Expected substance is the spec's, frozen — Rule 114)
The on-screen names in the cases were aligned to the staging build on 2026-09-28: role permissions read
as the "Work orders" / "Work order lines" / "Vendor and order management" groups' "Create & Edit"; the
settings toggles read in the build's Title Case; and the part/receive terms read "Receive later",
"Order parts", "Pick parts", "Tech view", "In stock". The **Expected outcome wording remains the spec's.**

## 🔎 Five state-dependent screens I could NOT raise via automation on staging — confirm them live when you run
These labels are confirmed present on the prod build v26.39.0 (one patch below) but were not re-raisable
through scripted clicks on staging this pass. They are ordinary screens a human reaches normally:
- **Bulk action bar** ("N selected" / "Complete line(s)" / "Receive selected" / "Deselect all" / "More" /
  "Decline") — tick line/part checkboxes on the Lines tab (C44563, C44575, C44597, and the 6669 bulk cases).
- **Receive modal** ("Receive vendor parts", its fields) and **part-availability badges** ("In stock",
  "Awaiting") — need a line with an ordered/unreceived vendor part (C44568, C44583, 6670/6672 cases).
- **Completion wizard** step pills ("Tech stories" / "Pick parts" / "Missing details") — header "Create
  invoice" on a WO with something outstanding (6673 cases).
- **"Move up"** reorder (C44604/C44605) and **"Mark as reviewed"** (C44594), **"Order (n)"**, **"Authorization required"**.
If any label differs from the case wording, it is a build-glossary nit (not a Fail) — note it for correction.

## §HOLD — C44549, do not run as pass/fail
C44549 ("Require settings appear named and grouped on the Work Orders settings page") is **HELD**. Its
Expected was substantively corrected on 2026-09-28 (the earlier "the page shows four toggles" was not in
the spec; the live page shows all its settings in three groups — Workflow / Line requirements / Parts). The
staging build matches the corrected wording, but the correction awaits the QA lead's confirmation. Mark
**held / not run**.

## 🔴 Seven cases are flagged AUTOMATED (`custom_atmstatus=3`) — Rule 71/65
Build-verified (made manually runnable) with the QA lead's go-ahead. Never edit an Automated case without
his go-ahead; when a pass changes one, tell Vlad (Rule 65). The QA lead is alerting Vlad. Run them as-is.
- C44557 — Only ordering and picking ask to confirm; turning picking OF — https://shopview.testrail.io/index.php?/cases/view/44557
- C44561 — An Approved line completes whatever the state of its parts — https://shopview.testrail.io/index.php?/cases/view/44561
- C44575 — Bulk approve/decline judges each line on its own and never s — https://shopview.testrail.io/index.php?/cases/view/44575
- C44583 — Receive opens a modal (no navigation); its contents depend o — https://shopview.testrail.io/index.php?/cases/view/44583
- C44587 — A user without See Financial Data can still receive; money f — https://shopview.testrail.io/index.php?/cases/view/44587
- C44604 — Dragging a part reorders it within its line; the line order  — https://shopview.testrail.io/index.php?/cases/view/44604
- C44605 — Reordering negatives: no cross-line moves, refused on an inv — https://shopview.testrail.io/index.php?/cases/view/44605

## The 55 cases (54 READY · 1 HOLD)
| C-id | Title | Marker |
|---|---|---|
| C44549 | Work Orders settings page — the four SFV2 settings appear, | HOLD |
| C44550 | Auto-pick renamed to "Require picking inventory parts" — v | READY |
| C44552 | Require picking and Require receiving — what each controls | READY |
| C44553 | Turning Require ordering / picking ON later does not retro | READY |
| C44554 | A settings change applies to every open work order — excep | READY |
| C44555 | A settings change is written to the audit log, attributed  | READY |
| C44556 | Settings-change sweeps skip invoiced/paid work orders and  | READY |
| C44557 | Only ordering and picking ask to confirm; turning picking  | READY (automated) |
| C44558 | Cancelling a settings-change confirmation changes nothing; | READY |
| C44559 | Applying a large settings change blocks only the acting ad | READY |
| C44561 | An Approved line completes whatever the state of its parts | READY (automated) |
| C44562 | The other line requirements still apply on completion when | READY |
| C44563 | A line reaches Complete only through the defined paths | READY |
| C44565 | Complete is never disabled for a parts reason; reopening r | READY |
| C44566 | Line actions offered match the line's status | READY |
| C44567 | Decline is disabled while a line holds received or picked  | READY |
| C44568 | Part row action matches the part's state — all seven state | READY |
| C44569 | Ordering precedes receiving; Receive placement follows the | READY |
| C44570 | Declining or sending back a line returns only the not-yet- | READY |
| C44571 | Bulk bar replaces the column headers and shows each action | READY |
| C44572 | Bulk bar groups: line and parts actions never compete for  | READY |
| C44573 | Each bulk action confirms or offers undo per its kind, wit | READY |
| C44575 | Bulk approve/decline judges each line on its own and never | READY (automated) |
| C44576 | Bulk approve/decline skips ineligible lines and hides an a | READY |
| C44577 | Bulk complete: label and count follow the selected Approve | READY |
| C44578 | Bulk delete lines is not in the bar this release; Mark as  | READY |
| C44580 | Bulk order raises a PO per vendor and skips already-ordere | READY |
| C44581 | Bulk pick runs the existing pick atomically for in-stock u | READY |
| C44582 | Bulk pick action is hidden without the Pick Parts permissi | READY |
| C44583 | Receive opens a modal (no navigation); its contents depend | READY (automated) |
| C44584 | Receiving requires vendor, invoice number and date; cost a | READY |
| C44585 | Vendor-missing card requires Assign vendor first; it appli | READY |
| C44587 | A user without See Financial Data can still receive; money | READY (automated) |
| C44589 | Purchase-order page groups by vendor, missing vendors firs | READY |
| C44590 | A panel expands per purchase order with per-PO vendor-side | READY |
| C44591 | Receive page validity matches the modal; money hidden with | READY |
| C44592 | Receive becomes a split button offering Received later, ch | READY |
| C44593 | Without the permission or the setting, no Received later o | READY |
| C44594 | The completion wizard opens only from the defined actions, | READY |
| C44595 | The wizard shows only the outstanding steps, in a fixed or | READY |
| C44596 | Each wizard step's own action saves and advances; there is | READY |
| C44597 | Where a wizard run ends depends on what opened it | READY |
| C44599 | The header shows only the one finish action that is genuin | READY |
| C44600 | Create invoice runs the wizard if needed, then invoices, c | READY |
| C44601 | Finish-action negatives: needs-approval block, declined-on | READY |
| C44602 | The part and line ... menus hold exactly the actions that  | READY |
| C44603 | Menu negatives: Request part, Uncomplete and Receive part  | READY |
| C44604 | Dragging a part reorders it within its line; the line orde | READY (automated) |
| C44605 | Reordering negatives: no cross-line moves, refused on an i | READY (automated) |
| C44606 | 'Received later' is the one new permission — a per-role to | READY |
| C44607 | Every Simple Flow action is gated by its mapped existing a | READY |
| C44608 | Money follows See Financial Data; work follows View mode;  | READY |
| C44609 | A user without an atom never sees the action; hidden value | READY |
| C53486 | Deselect all keeps the bar; close dismisses it; an empty g | READY |
| C53488 | PO list-page selection raises the shared bulk bar; Select  | READY |

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | QA lead's go-ahead to create the manual run over these 55, then record Passed/Failed/Blocked. |
| 2 | **C44549** — held; do not pass/fail (corrected Expected awaits QA-lead sign-off). |
| 3 | Confirm the five state-dependent screens' labels live (bulk bar, receive modal + badges, wizard, reorder/review) — build-glossary nits, not Fails. |
| 4 | 7 automated cases — run as-is, do not edit; Vlad is being alerted separately. |

**Standing holds:** no Jira/external artefact without the QA lead; no TestRail *case* writes without his
go-ahead; run creation + result writes need his go-ahead too (Rule 6); Vladimir's cases never; Automated
cases never edited without him; secrets never committed; stay inside a disposable staging test org.

---
_(Rule 95 — Token-Discipline Charter, canonical copy `build/skills/TOKEN-DISCIPLINE-CHARTER.md`.)_
