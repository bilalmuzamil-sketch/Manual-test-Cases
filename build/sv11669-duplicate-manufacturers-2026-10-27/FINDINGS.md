# SV-11669 — Manufacturer list shows duplicates (27 Oct 2026)

Mode: **API (faster)** (QA lead). No recording, no technical section. Labels: no `accounting`; QA Assignee empty.
Branch `sv11669`: front end `v26.43.2-64183b8` (index last-modified Tue 27 Oct 2026 09:13:09 GMT, etag `ec2f1849…`).
Production before: `app.shopview.com` `v26.43.2-537378f` (test org 72b2cc90…).
Sources: ticket description (customer: "Manufacturer list is showing duplicates, possibly pulling from other environments");
Dipesh 79518 (root cause + repro), 79520/79523 (Chris: delete blank-name manufacturers, option 1), 79556 (Ready for QA),
79559 (branch); QA handoff pasted by the QA lead (checklist mirrored below).

## Branch results (sv11669) — handoff checklist + extras
Unused names: Accuride; Haldex replaces Dorman, Dayco replaces Gates (both already existed on the branch).
Start: 143 manufacturers, 0 blank, 0 duplicates.

| # | Check | Result |
|---|---|---|
| S1 | New part QA-11669-01, "Accuride" (new) + Tab | 201; field "Accuride"; 143 -> 144; part = Accuride 808763a4. **Note:** the handoff says to *pick* "Accuride" shown as a new entry — the list shows "No results" for a new name and Enter does not add it; production identical (PS1). Tab works. |
| N1 | QA-11669-02, "accuride" + Tab (no click) | field "Accuride"; sent manufacturer_id 808763a4; 144 -> 144 — PASS |
| N2 | QA-11669-03, "  ACCURIDE  " + click Description | field "Accuride"; same id; no new — PASS |
| N3 | Filter: Accuride once; filter by it lists all 14 Accuride parts (01, 02, 03, 08B, F0/F100/F250/F500, P20–P300) | PASS |
| N4 | QA-11669-04, "accuride" + Tab right after the last letter (human speed, 60 ms/key; Tab 0/100/250/500 ms) | all "Accuride" — PASS. Pasting and pressing Tab in the same instant (0 ms) leaves the field as raw text and saves no manufacturer; 20/40/60/80/100/300 ms all fine — not reachable by a person, not reported. A first zero-delay *typing* run showed the same — machine-only. |
| B1 | QA-11669-05, "Haldex" (new) + Tab | created once (144 -> 145) — PASS |
| B2 | QA-11669-06, "haldex " + Tab | reused Haldex — PASS |
| B3 | QA-11669-07, spaces only + Tab | field empty; saved with no manufacturer; no blank entry — PASS |
| B4/B5 | Pick from list (Accutek via "Accu"; Accuride via full name) | saved with the picked one — PASS |
| E1 | Edit QA-11669-05: Haldex -> typed "ACCURIDE" + Tab | field Accuride; detail page Accuride; list stays 145 — PASS |
| E2 | Edit same part, Description only | Manufacturer stays Accuride — PASS |
| E4 | Edit QA-11669-07 (none) -> "Bendix" (new) | created once (145 -> 146) — PASS |
| E3 | **Edit QA-11669-06 (Haldex) -> spaces only + Tab** | field looks EMPTY, Save sends no manufacturer, **part keeps Haldex**. Production (PE3, QA-11669-PB-02): same steps REMOVE the manufacturer. Deleting the text with Backspace restores the old value on BOTH (E5 / PE5) — so on the branch a manufacturer can no longer be removed from a part, and the screen shows "empty" while the old one is saved. **Open question to the QA lead (Rule 97(d)) — not decided by me.** Exhibit `ev/q1-edit-spaces-keeps-old.png`. |
| I1 | Import (9 rows: Accuride / ACCURIDE / "  Accuride  ", Dayco / "dayco " / "  dAyCo", "   ", "Heavy  Duty   Brand" / "heavy duty brand"); file sent with padding intact (captured in-page) | 201, 0 warnings; 146 -> 148; all three Accuride rows -> existing Accuride; three Dayco rows -> one Dayco; IMP-6 empty manufacturer, no blank; stored "Heavy Duty Brand" (single spaces), both rows linked — PASS |
| I2 | Same file again | 148 -> 148, nothing new — PASS |
| I3 | Import regression: IMP-1 inventory = vendor 5 Star Truck Repair, bin A1A, qty 5, cost 10, min 1 / max 10; re-import did not double the quantity | PASS |
| O | Second organization: registered "ZZAUTOTEST SV-11669 Second Org" (/register, invite via Gmail to bilal.muzamil+sv11669@…, set credentials, location by API). Its list starts EMPTY (none of org 1's 148); typing "Accuride" shows "No results" and creates ITS OWN Accuride 86b8403e; "accuride" reuses it; it sees only its 2 parts; org 1 keeps one Accuride 808763a4 | PASS |
| API | Public API (POST /v1/parts) | Not run: the handoff says "Public API — verified by the developer"; the branch org has the `openapi` feature off and no screen to switch it on. Any API-only fault would be reported to the QA lead, not filed (Rule 94). |

Final branch list (`data/list-branch-final.json`): **148 names, 148 distinct, 0 blank.**

## Production before (app.shopview.com, same steps) — bug reproduced
Start: 8 manufacturers — 4 blank, "ZZMAKERTON" x3.
- PS1 "Accuride" (new) -> created (8 -> 9).
- PN1 "accuride" + Tab — the list SHOWED the existing Accuride — **created a second one** (9 -> 10).
- PN2 "  ACCURIDE  " + click away -> **third** ("ACCURIDE") (10 -> 11).
- PB3 spaces only -> saved with no manufacturer, no blank created (production blanks come from imports).
- PI1 same 9-row import -> 11 -> 18: another Accuride ("  Accuride  "), **Dayco x3**, **Heavy Duty Brand x2**, a new **blank** ("   ").
Final production list (`data/list-prod-final.json`): **18 entries, 6 distinct, 5 blank.**

## Exhibits
- `ev/01-before-after-manufacturer-list.png` — production filter (Accuride x4, Dayco x3, Heavy Duty Brand x2, 5 blank) vs branch (each once).
- `ev/02-dialog-checks.png` — branch dialog: typed lower case + Tab, spaces/capitals + click away, spaces only, Edit.
- `ev/q1-edit-spaces-keeps-old.png` — the open Edit question.

## Test data (left in place, no clean-up per ruling)
Branch org 1: parts QA-11669-01..08B, F0/F100/F250/F500, P0..P300, IMP-1..9; manufacturers Accuride, Haldex, Bendix, Dayco,
Heavy Duty Brand. Branch org 2 "ZZAUTOTEST SV-11669 Second Org" (admin bilal.muzamil+sv11669@shopview.com, password in /tmp
only), location ZZAUTOTEST Org2 Shop, parts QA-11669-ORG2-01/02. Production: parts QA-11669-PB-01/02/03/07, PRODIMP-1..9 and the
manufacturers they created.

## Speed fixes made during this pass (QA lead asked what was slowing things down)
Self-healing bridge in `qa-session.mjs`; one-session runners; bundle route list read once; whole-list snapshots + diff.
Lessons index row + playbook §AU.

## Status — QA lead's ruling and what was posted (27 Oct)
QA lead on E3, verbatim: "Mark this ticket as passed for the other issue found create a follow-up ticket".
- Follow-up **SV-11834** "Catalog part edit: typing only spaces in Manufacturer keeps the old one" — Bug, Medium, Product Area
  Administration, label bug-report, no parent (SV-11669 has none), Relates SV-11669. Pre-ticket check: Jira searched (no
  duplicate; nearest SV-5002 / SV-10826 are different topics); SV-11669 re-read live (no new comments after 79559);
  reproduced on fresh parts QA-11669-FU-01 (Dayco) and FU-02 (Bendix) + QA-11669-06 (Haldex) = 3/3 on the branch, production
  removes it (PB-02); step 5 walked exactly as written (select name, type spaces, Tab) before filing. Read back: 7 numbered
  steps, image 1 inside step 5 (635x607), image 2 (530x908), 5-row table, link, Medium, Administration.
  Labels: copied only "bug-report" — the source's "source-intercom", "ai-unverified-repro" and "powertools-unassigned"
  describe the customer's original report and would mislabel a QA-found ticket.
- SV-11669 comment **79582**: OVERALL QA STATUS: PASSED, before/after picture, 16 checks, dialog picture, "Separate issue raised"
  SV-11834, Public API not checked (dev-verified; Open API off). Gate: branch build re-read v26.43.2-64183b8, ticket re-read
  (TESTING QA, 79559 last), read back: PASSED first, 2 attachments 1416x1383 / 1935x1325, 17 table rows.
  Ticket status left as is for the QA lead.
- Not raised (told to the QA lead instead): the handoff's setup step says a new name shows as a list entry to pick; the list
  shows "No results" and Tab is the way — same on production, so it is handoff wording, not a defect.

## Learning check
- Playbook: `/rest/api/2/search` is retired here (returns nothing) — use `/rest/api/3/search/jql`.
- Ticket standard §2: copy the source ticket's labels **except provenance labels** (source-*, ai-*, powertools-*).
