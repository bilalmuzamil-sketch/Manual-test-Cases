# TestRail Execution Log — Simple Flow sell-price corrective cases — 2026-07-29

**Authorization:** user-authorized push ("Push", 2026-07-29). Scope = 3 × `add_case`
(+ 1 `add_section` since no suitable section existed). NOTHING else — no `update_case`,
no `delete_case`, no run/result writes. **Run 325 (Ayesha's) untouched.**

**Executor:** `exec_push_2026-07-29.py` (this folder; state file `push-state-2026-07-29.json`
makes reruns idempotent). Creds from `/tmp/tr-creds.env` (never committed).

## Section

No "Regression & Edge Cases" section existed under the Simple Flow group (section 4058,
"Simple Flow (VIU-PENDING"). The nearest existing section, 4085 "Validation / Edge", is an
authored validation section from the original suite — NOT the 2026-07-29 meeting-convention
"edge-case/regression findings from tickets" section — so a new one was created as authorized:

| Action | Section ID | Name | Parent | HTTP | Verified |
|---|---|---|---|---|---|
| add_section | **5407** | Regression & Edge Cases — from tickets | 4058 (Simple Flow group) | 200 | response id/name/parent confirmed |

## Cases (add_case ×3, section 5407)

All with `custom_atmstatus:3` + `custom_automation_type:0`, type = Regression (9),
refs = `Fabian 2026-07-29 sell-price concern (ticket TBD) + QA lead repro 2026-07-29`
(placeholder — re-point to the real Jira key when Fabian's ticket is filed, per Rule 20).

| Internal ID | TestRail | Link | Title (≤80 chars, verified) | Priority | HTTP | Re-GET verdict |
|---|---|---|---|---|---|---|
| SF-RCV-14 | **C38860** | https://shopview.testrail.io/index.php?/cases/view/38860 | Sell price auto-calculates from Cost when receiving a special order part | High | 200 | **MATCH** (title/preconds/steps/expected/refs/section/type/priority/atm fields) |
| SF-RCV-15 | **C38861** | https://shopview.testrail.io/index.php?/cases/view/38861 | Sell price recalculates on every repeated Cost edit on the Receive screen | High | 200 | **MATCH** (all fields) |
| SF-VPART-08 | **C38862** | https://shopview.testrail.io/index.php?/cases/view/38862 | Editing Cost in the part edit dialog updates the Sell price and Margin | Medium | 200 | **MATCH** (all fields) |

## ID checks (pre-push)

- `testrail-id-map.csv` read first: SF-RCV series ended at SF-RCV-13 (C29903), SF-VPART
  series at SF-VPART-07 (C29337) — **no collisions**, no renumbering needed.
- All 3 titles ≤80 chars (73/74/71), no angle brackets.

## Post-push bookkeeping

- `build/simple-flow/testrail-id-map.csv`: +3 rows (187 → 190 lines incl. header;
  184 → 187 mapped active cases... see PROJECT-STATE for the tally), section column =
  "Regression & Edge Cases — from tickets", refs = the placeholder above, trace_note blank
  (file convention).
- `corrective-cases-draft.json`: meta.status = PUSHED, per-case `testrail_case_id` filled
  (38860/38861/38862); viu_status stays VIU-Pending (live VIU needs fresh staging cookies).
- `FINDINGS.md`: PUSHED header + C-ids added to the case mentions.
- `PROJECT-STATE.md` §0: new dated block (tally +3).

## Confirmation

Total TestRail writes this push: **1 add_section + 3 add_case = 4 writes, all HTTP 200,
all re-GET verified MATCH.** Zero updates, zero deletes, zero run/result writes. No secrets
in the repo (creds stayed in /tmp).
