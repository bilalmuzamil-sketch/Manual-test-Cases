# A/R and A/P Report Sorting — PRD version 13 currency pass, 14 Nov 2026 (DRAFT: nothing written to TestRail, Jira, Slack or Google; nothing committed)

QA lead, 14 Nov 2026: **"Named set (Recommended)"**: rewrite top to bottom (Rule 134) every case that quotes or depends on a requirement changed between PRD v11 and v13; add cases for S3-R7b and S5-R10b; re-stamp every other case to v13 only after a script proves its quotes are word for word in v13. Release 19 Nov 2026.

## 1. Counts

| What | Count |
|---|---|
| Cases of ours in the library (excluding the 14 Demo Day cases D-82 to D-95, untouched) | 380 |
| Rewritten top to bottom (quote or depend on S1-R8, S4-R1, S5-E3, S8-R3; S5-37 contradicted by S5-R10b) | 73 |
| ... of which the tester text changed (title, preconditions, steps or results) | 14 |
| Re-stamped to v13 (From line only; quotes proved word for word in v13 first) | 307 |
| New cases (S3-33 to S3-36 for S3-R7b; S5-43 for S5-R10b; S5-41b for the changed S5-E3; S2-51, S2-52 for SV-12723, QA lead 14 Nov 2026) | 8 |
| Edited outside our library since our last write (10 Nov 2026) | 380 of 380 |
| Held out of every write (readiness check fails on live text we did not write) | 0 () |
| Quotes checked word for word against their sources (final bodies) | 1209 in 388 cases, 0 failing |

## 2. What changed in the PRD (v11 -> v13; diff read in full)

- **S1-R8**: Adds: the documents of an open customer or vendor may all arrive from the server in one request; the rule sets only how many are shown at a time. (23 cases quote it.)
- **S4-R1**: Adds: the header chevron is blue, the same as each group's own chevron (S4-R5). (13 cases quote it.)
- **S5-E3**: Adds: if none of the ticked locations is in the new list and the new list holds only one location, the chip is hidden (S5-N1) instead of reading "Location: All locations". (4 cases quote it.)
- **S8-R3**: Adds one exception, as today: on A/P Unpaid Invoices a vendor's group row does not wrap, so a very long vendor name (78 characters still fit) can make the table scroll sideways at 1440 pixels. (35 cases quote it.)
- **S3-R7b (new)**: In the A/R Detail, A/R Collection, A/P Detail and A/P Unpaid Invoices PDFs, each bucket, customer or vendor ends with a row that reads "Total for \<name\>", the same words as the screen, for example "Total for 31-60 days past due" or "Total for Acme Towing", with its Amount and Open Balance. A long name wraps inside that row. The PDF never prints "Subtotal".
- **S5-R10b (new)**: The as-of date can be any day, including a day after today, as today. For a day after today the report counts everything entered so far and counts days past due to the picked day; the chip, the PDF and the CSV all show the picked day. A link with an as-of date opens on that date.
- Change Log rows 2026-11-12 (Milos Vasic, v12) and 2026-11-13 (Chris Ward, v13). The v12 row also records Q1 (the 2,000-row PDF limit stays pending SV-12539's timing check) and Q7 (S1-R4 unchanged; names differing only in capitals or accents cannot be created, so that case comes only from existing data); no requirement line changed for either.

## 3. The write plan and the edit lock — every case was edited outside our library

The ordered lock (update only a case whose live fields equal our last written body, the 10 Nov 2026 read-back) leaves **0 cases to update**: all 380 were changed in TestRail on 11-12 Nov 2026 after run 557 was executed (by our TestRail account, user 3, outside this library). `write/update_cases.py` (default mode) lists them and writes nothing to them.

What the outside edits are (by script, `live-before/outside-edits-2026-11-14.json`):

| Field: kind of edit | Cases |
|---|---|
| custom_expected: build line | 380 |
| custom_expected: marker | 366 |
| custom_preconds: setup block | 132 |
| custom_expected: other | 78 |
| custom_steps: other | 61 |
| custom_preconds: other | 38 |
| title: other | 7 |

Mostly: the build line became "Last checked against build …" or "Partly checked …" (366 markers now AUTOMATION: READY); a "Setup" block of concrete staging steps was added to the preconditions of 130 cases; some steps reworded ("below the last row of the report page", the network-blocking steps); 16 cases re-quoted to PRD v12 (REL cases, REL-07, DATA-13; D-52 already shows the blue header chevron, "on the QA lead's instruction"); REL titles now say "staging deploy".

**Prepared, not run: `write/update_cases.py --on-live`.** It sends the v13 body built ON the live text (`proposals-v13-on-live-writable.json`, `scripts/merge_on_live.py`): a three-way merge (our 10 Nov read-back, the v13 library body, the live text) keeps every outside edit. Proof (`scripts/check_merge.py`, `merge-invariant.json`): 0 lines added that are not ours, and every outside line is still there except where a named rule replaced it: R5 tester: 1, R2 build: 10, R1 from: 36, R4 quote: 6, R6 case id dropped: 1, R3 marker: 1. R1 = the From line now names version 13 (rest of their line kept); R2 = a rewritten case's own build line where the rewrite added a result no build has shown; R3 = S5-37's marker (its expected behaviour reversed); R4 = the v13 quote text (theirs only re-encoded the same quote); R5 = D-16's tech-plan note (their wording kept, the v13 point added). D-52 keeps its live tester line and note. Lock in that mode: the 14 Nov 2026 read (fields, folder and updated_on), re-read in full at the start and per case before each write; a second full read (live-2026-11-14b.json) and the dry run's per-case reads found 0 changes. R6 (QA lead's choice): DATA-13's live preconditions named "ZZAUTOTEST OVERPAID C715462 Cust A"; only the id is dropped ("ZZAUTOTEST OVERPAID Cust A"). The staging record keeps its full name, so the tester finds it by "ZZAUTOTEST OVERPAID".

No case is moved: no script sends section_id; update reads back section_id; new cases go to "Setup needed before testing" (133629), where the cases that need records made and the Demo Day cases are. S1-05 and S1-07 stay in "Retired - cannot be set up" (re-stamp only, not in run 557).

## 4. Gates

- `authoring/build.py`: 400 cases, **0 PROBLEM lines** (every quote word for word in PRD v13; From lines name version 13; per-case build line).
- `tester_readiness_check.py build/ar-ap-report-sorting --also currency-2026-11-14/proposals-v13-on-live-writable.json`: 400 cases, **0 hard problems** (DATA-13 included, after R6).
- `scripts/quote_check.py` (re-stamp proof): 1209 quotes in 388 final bodies, **0 failing**; every PRD From line names version 13.
- `ticket_sweep.py`: 37 tickets, **0 unhandled**, PRD v13 handled (TICKET-LEDGER.json: 11 new tickets and 18 updated rows written).
- Demo Day cases D-82 to D-95: byte-identical in proposals.json before and after (`scripts/lib_diff.py`).
- Read in full: 20 random rewritten or new cases (seed 20261114, `sample-20-keys.json`) and every "does not / never" result in a rewritten or new case (52 lines): each has a visible control (a positive row, a count or the chip before the change). No fault found.

## 5. Design

- DD-08 (new, closed by the later PRD ruling, as DD-07): every "this build" picture with the table header draws the header chevron dark grey beside blue group chevrons; PRD v12/v13 S4-R1 says blue. Printed in the 13 S4-R1 cases; register row added (DESIGN-DIVERGENCE-REGISTER.json). No question: a later written PO ruling settles it.
- S8-R3: the design's A/P Unpaid Invoices picture draws vendor group rows on one line and wraps only the bill rows' Vendor Name: no difference.
- Checklist line 9 (stress data) where a rewritten case touches typed text: D-16 adds a vendor name with & " ' < > (on screen; the 78-character no-space name is D-89); S3-34 and S3-36 print a long name with spaces and & " ' < > in the PDF Total row (the no-space name is D-95). Line 10 (layout stays put across states): the rewritten S4/D cases open and close groups; the before-and-after check is D-90 to D-94 (Demo Day), not duplicated.

## 6. Per case, every part (CHANGED / CONFIRMED against TestRail as read 14 Nov 2026; sources PRD v13, design of 5 Nov 2026 read 10 Nov, tech plan 21 Oct, Jira read 14 Nov)

Rewritten (73), part by part: title {'CONFIRMED': 70, 'CHANGED': 3}; preconditions {'CONFIRMED': 68, 'CHANGED': 5}; steps {'CONFIRMED': 69, 'CHANGED': 4}; results {'CONFIRMED': 60, 'CHANGED': 13}; notes {'CONFIRMED': 71, 'CHANGED': 2}; quotes_and_From_lines {'CHANGED': 73}; build_line {'CONFIRMED': 63, 'CHANGED': 10}; design_references {'CHANGED': 50, 'CONFIRMED': 23}; marker {'CONFIRMED': 72, 'CHANGED': 1}; refs {'CONFIRMED': 72, 'CHANGED': 1}; setup_recipe {'CONFIRMED': 68, 'CHANGED': 5}.

Re-stamped (307): title {'CONFIRMED': 307}; preconditions {'CONFIRMED': 306, 'CHANGED': 1}; steps {'CONFIRMED': 307}; results {'CONFIRMED': 307}; notes {'CONFIRMED': 307}; quotes_and_From_lines {'CHANGED': 307}; build_line {'CONFIRMED': 307}; design_references {'CONFIRMED': 307}; marker {'CONFIRMED': 307}; refs {'CONFIRMED': 307}; setup_recipe {'CONFIRMED': 306, 'CHANGED': 1}.

| Key | C-id | Set | Title | Pre | Steps | Results | Notes | Quotes+From | Build line | Design | Marker | Refs | Setup recipe | Run 557 | Folder |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D-01 | C715481 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-01b | C715621 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-01c | C715622 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-02 | C715482 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-03 | C715483 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-04 | C715484 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-04b | C715623 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-04c | C715624 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-05 | C715485 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-06 | C715486 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-07 | C715487 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-07b | C715625 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-07c | C715626 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-08 | C715488 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-09 | C715489 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-10 | C715490 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-10b | C715627 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-10c | C715628 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-11 | C715491 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-12 | C715492 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-13 | C715493 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-13b | C715629 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-13c | C715630 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-14 | C715494 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-15 | C715495 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-16 | C715496 | REWRITE | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-16b | C715631 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-16c | C715632 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-17 | C715497 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-18 | C715498 | REWRITE | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-19 | C715499 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-19b | C715633 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-20 | C715500 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-20b | C715634 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-21 | C715501 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-21b | C715635 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-22 | C715502 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-22b | C715636 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-23 | C715503 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-23b | C715637 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-24 | C715504 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-24b | C715638 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-25 | C715505 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-26 | C715506 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-27 | C715507 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-28 | C715508 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-29 | C715509 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-30 | C715510 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-31 | C715511 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-32 | C715512 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-33 | C715513 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-34 | C715514 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-35 | C715515 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-36 | C715516 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-37 | C715517 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-38 | C715518 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-39 | C715519 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-40 | C715520 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-41 | C715521 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-42 | C715522 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-43 | C715523 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-44 | C715524 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-45 | C715525 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-46 | C715526 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-47 | C715527 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-48 | C715528 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-49 | C715529 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-50 | C715532 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-51 | C715533 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-52 | C715534 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-53 | C715535 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-54 | C715536 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-55 | C715537 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-56 | C715538 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-57 | C715539 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-58 | C715540 | REWRITE | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-59 | C715541 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-60 | C715542 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-61 | C715543 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-62 | C715544 | REWRITE | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-63 | C715545 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-64 | C715546 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-65 | C715547 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-66 | C715548 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-67 | C715549 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-68 | C715550 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-69 | C715551 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-70 | C715552 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-71 | C715553 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-72 | C715554 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-73 | C715555 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-74 | C715556 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| D-75 | C715557 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| D-81 | C715563 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Design — how it looks (90430) |
| DATA-01 | C715450 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-01b | C715612 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-02 | C715451 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-02b | C715613 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-03 | C715452 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-03b | C715614 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-04 | C715453 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-04b | C715615 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-05 | C715454 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-06 | C715455 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-07 | C715456 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-08 | C715457 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-09 | C715458 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-10 | C715459 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-11 | C715460 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-12 | C715461 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-13 | C715462 | RE-STAMP | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| DATA-14 | C715463 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-15 | C715464 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-16 | C715465 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-17 | C715466 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-18 | C715467 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-19 | C715468 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-20 | C715469 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Totals and counts — exact amounts (90428) |
| DATA-22 | C715581 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-23 | C797945 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-24 | C797946 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-25 | C1062587 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-26 | C1062588 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| DATA-27 | C1062589 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| REL-01 | C715471 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (failed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-02 | C715472 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (failed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-03 | C715473 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| REL-04 | C715474 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| REL-04b | C715616 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| REL-05 | C715475 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-05b | C715617 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-05c | C715618 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-06 | C715476 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-07 | C715477 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-09 | C715479 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-10 | C715480 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-11 | C715582 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-12 | C715583 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-12b | C715619 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-12c | C715620 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-13 | C715584 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| REL-14 | C1062590 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Run on Staging After the Feature Is Deployed (133628) |
| S1-01 | C715273 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-02 | C715274 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-03 | C715275 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-04 | C715276 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-05 | C715277 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | not in run | kept: Retired - cannot be set up (QA lead 11 and 12 Nov 2026) (134653) |
| S1-06 | C715278 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-07 | C715279 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | not in run | kept: Retired - cannot be set up (QA lead 11 and 12 Nov 2026) (134653) |
| S1-08 | C715280 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S1-09 | C715281 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S1-10 | C715282 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S1-11 | C715283 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S1-12 | C715284 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S1-13 | C715285 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S1-14 | C715286 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-15 | C715287 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S1-16 | C715573 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-17 | C1062566 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-18 | C1062567 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-19 | C1062568 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-20 | C1062569 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S1-21 | C1062570 | REWRITE | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S1-22 | C1062571 | REWRITE | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S1 — Reports open in QuickBooks name order (90419) |
| S2-01 | C715288 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-01b | C715585 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-02 | C715289 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-03 | C715290 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-04 | C715291 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-04b | C715586 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-05 | C715292 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-06 | C715293 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-07 | C715294 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-07b | C715587 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-08 | C715295 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-09 | C715296 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-10 | C715297 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-11 | C715298 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-12 | C715299 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-12b | C715588 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-13 | C715300 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-14 | C715301 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-15 | C715302 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-15b | C715589 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-16 | C715303 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-17 | C715304 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-18 | C715305 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-19 | C715306 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-19b | C715590 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-20 | C715307 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-20b | C715591 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-21 | C715308 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-22 | C715309 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-23 | C715310 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-24 | C715311 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-25 | C715312 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-26 | C715313 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-27 | C715314 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-28 | C715315 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-29 | C715316 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-30 | C715317 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-31 | C715318 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-32 | C715319 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-33 | C715320 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-34 | C715321 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-35 | C715322 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-36 | C715323 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-36b | C715592 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-37 | C715324 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-37b | C715593 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-38 | C715325 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-38b | C715594 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-39 | C715326 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-40 | C797940 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-41 | C797941 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-42 | C797942 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-43 | C1062572 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-44 | C1062573 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-45 | C1062574 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-46 | C1062575 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-47 | C1062576 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-48 | C1062577 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-49 | C1062578 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S2-50 | C1062579 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S2 — Sort by clicking any column header (90420) |
| S2-51 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | added by sync_run_557.py | Setup needed before testing (133629), new |
| S2-52 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | added by sync_run_557.py | Setup needed before testing (133629), new |
| S3-01 | C715327 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-01b | C715595 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-01c | C715596 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-02 | C715328 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-02b | C715597 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-02c | C715598 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-03 | C715329 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-04 | C715330 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-05 | C715331 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-06 | C715332 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-07 | C715333 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-08 | C715334 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-09 | C715335 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-10 | C715336 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-11 | C715337 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-12 | C715338 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-13 | C715339 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-14 | C715340 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-15 | C715341 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-16 | C715342 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-17 | C715343 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-18 | C715344 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-19 | C715345 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-20 | C715346 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-21 | C715347 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-22 | C715348 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-23 | C715349 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-24 | C715350 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-25 | C715351 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-26 | C715352 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-27 | C715353 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-28 | C715574 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-29 | C715575 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-30 | C715576 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S3 — Export to PDF and CSV (90421) |
| S3-31 | C1062580 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-32 | C1062581 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S3-33 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | added by sync_run_557.py | Setup needed before testing (133629), new |
| S3-34 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | added by sync_run_557.py | Setup needed before testing (133629), new |
| S3-35 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | added by sync_run_557.py | Setup needed before testing (133629), new |
| S3-36 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | added by sync_run_557.py | Setup needed before testing (133629), new |
| S4-01 | C715354 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S4-02 | C715355 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-03 | C715356 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S4-04 | C715357 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-05 | C715358 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-06 | C715359 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-07 | C715360 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-08 | C715361 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-09 | C715362 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-09b | C715599 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-10 | C715363 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S4-10b | C715600 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S4-11 | C715364 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-11b | C715601 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-12 | C715365 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-12b | C715602 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-13 | C715366 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-14 | C715367 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-15 | C715368 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-15b | C715603 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-16 | C715369 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-16b | C715604 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-17 | C715370 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-18 | C715371 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-19 | C715372 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-20 | C715373 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-21 | C715374 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-21b | C715605 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-22 | C1062582 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S4-23 | C1062583 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S4 — Collapse all, Expand all and pinned group rows (90422) |
| S5-01 | C715375 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-02 | C715376 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-03 | C715377 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-04 | C715378 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-05 | C715379 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-06 | C715380 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-07 | C715381 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-08 | C715382 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-09 | C715383 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-10 | C715384 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-10b | C715606 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-10c | C715607 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-11 | C715385 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-11b | C715608 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-11c | C715609 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-12 | C715386 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-13 | C715387 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S5-14 | C715388 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-15 | C715389 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S5-16 | C715390 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-17 | C715391 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S5-18 | C715392 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-19 | C715393 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-20 | C715394 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S5-21 | C715395 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-22 | C715396 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-23 | C715397 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-24 | C715398 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-25 | C715399 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-26 | C715400 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-27 | C715401 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-28 | C715402 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-29 | C715403 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-30 | C715404 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-31 | C715405 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-32 | C715406 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-33 | C715407 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-34 | C715408 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-35 | C715577 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-36 | C715578 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-37 | C715579 | REWRITE | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-38 | C715580 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S5-39 | C797943 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-40 | C1062584 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S5-41 | C1062585 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S5-41b | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | added by sync_run_557.py | Setup needed before testing (133629), new |
| S5-42 | C1062586 | REWRITE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S5 — Filters: customer or vendor, past due and location (90423) |
| S5-43 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | added by sync_run_557.py | Setup needed before testing (133629), new |
| S6-01 | C715409 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S6 — Location column (90424) |
| S6-02 | C715410 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S6 — Location column (90424) |
| S6-03 | C715411 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S6-04 | C715412 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S6-05 | C715413 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-01 | C715414 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S7 — Document links open where they can (90425) |
| S7-02 | C715415 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-03 | C715416 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S7 — Document links open where they can (90425) |
| S7-04 | C715417 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-05 | C715418 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S7 — Document links open where they can (90425) |
| S7-06 | C715419 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S7 — Document links open where they can (90425) |
| S7-07 | C715420 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-08 | C715421 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-09 | C715422 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S7 — Document links open where they can (90425) |
| S7-10 | C715423 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-11 | C715424 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-12 | C715425 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-13 | C715426 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-14 | C715427 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-15 | C715428 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-16 | C715429 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-17 | C715430 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-18 | C715431 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-18b | C715610 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-19 | C715432 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S7-20 | C797944 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S7 — Document links open where they can (90425) |
| S8-01 | C715433 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-02 | C715434 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-03 | C715435 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-04 | C715436 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-05 | C715437 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-06 | C715438 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-07 | C715439 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-07b | C715611 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-08 | C715440 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-09 | C715441 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-10 | C715442 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-11 | C715443 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-12 | C715444 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S8-13 | C715449 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S8 — Report descriptions and layout (90426) |
| S9-01 | C715445 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S9 — A/R Collection call list (90427) |
| S9-02 | C715446 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |
| S9-03 | C715447 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: S9 — A/R Collection call list (90427) |
| S9-04 | C715448 | RE-STAMP | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | in run (passed 11-12 Nov) | kept: Setup needed before testing (133629) |

Tester-text changes in the rewrite set (from AFFECTED.json):

- DATA-27 C1062589: step 3: the 101st bill shows (same reason)
- S1-21 C1062570: title and steps 3-4 say the next invoices SHOW as you scroll (v13: the rule sets only how many are shown at a time)
- S1-22 C1062571: title and steps 3-4 say the next bills SHOW as you scroll (same reason)
- D-25 C715505: steps 1-2: the header chevron is blue, the same blue as the group chevrons
- D-26 C715506: same as D-25
- D-27 C715507: same as D-25
- D-28 C715508: same as D-25
- D-52 C715534: step 2: the header chevron is blue (the live case already says so, changed 12 Nov on the QA lead's instruction; kept)
- D-56 C715538: step 1: the header chevron is blue
- D-59 C715541: step 2: the header chevron is blue
- D-16 C715496: vendor A's name bounded to 41-78 characters (step 4 expects no sideways scroll); step 5 adds: the group row does not wrap; new vendor B with & " ' < > and step 7 (design checklist line 9)
- D-18 C715498: vendor name bounded to 41-78 characters (step 3 expects no sideways scroll at 1536 px)
- D-56 C715538: step 1: the header chevron is blue
- D-58 C715540: name bounded to 41-78 characters; step 2: bill rows wrap, the pinned group row stays on one line
- D-62 C715544: names bounded to 41-78 characters; step 5 adds: each group row shows the whole name on one line
- S5-37 C715579: rewritten top to bottom: it checked that a day after today cannot be picked (tech plan D20); v13 S5-R10b allows it. Now: A/P Detail, a bill due today moves to 1-30 days past due with Past Due 10 when the day 10 days after today is picked

Run 557 note: these rewritten cases keep their 11-12 Nov results, which were given against the earlier expectation: S5-37 (passed: the date could not be moved past today; now expected to move), D-16, D-25 to D-28, D-56, D-58, D-59, D-62 (a result was added). The QA lead may want them retested.

## 7. Edited outside our library (C-id, link, what changed) — for the QA lead

| Key | C-id | Link | Fields edited (kinds) | Live folder |
|---|---|---|---|---|
| D-01 | C715481 | https://shopview.testrail.io/index.php?/cases/view/715481 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-01b | C715621 | https://shopview.testrail.io/index.php?/cases/view/715621 | custom_expected: build line+marker | Design — how it looks |
| D-01c | C715622 | https://shopview.testrail.io/index.php?/cases/view/715622 | custom_expected: build line+marker | Design — how it looks |
| D-02 | C715482 | https://shopview.testrail.io/index.php?/cases/view/715482 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-03 | C715483 | https://shopview.testrail.io/index.php?/cases/view/715483 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-04 | C715484 | https://shopview.testrail.io/index.php?/cases/view/715484 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-04b | C715623 | https://shopview.testrail.io/index.php?/cases/view/715623 | custom_expected: build line+marker | Design — how it looks |
| D-04c | C715624 | https://shopview.testrail.io/index.php?/cases/view/715624 | custom_steps: other; custom_expected: build line+marker | Design — how it looks |
| D-05 | C715485 | https://shopview.testrail.io/index.php?/cases/view/715485 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-06 | C715486 | https://shopview.testrail.io/index.php?/cases/view/715486 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-07 | C715487 | https://shopview.testrail.io/index.php?/cases/view/715487 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-07b | C715625 | https://shopview.testrail.io/index.php?/cases/view/715625 | custom_expected: build line+marker | Design — how it looks |
| D-07c | C715626 | https://shopview.testrail.io/index.php?/cases/view/715626 | custom_steps: other; custom_expected: build line+marker | Design — how it looks |
| D-08 | C715488 | https://shopview.testrail.io/index.php?/cases/view/715488 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-09 | C715489 | https://shopview.testrail.io/index.php?/cases/view/715489 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-10 | C715490 | https://shopview.testrail.io/index.php?/cases/view/715490 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-10b | C715627 | https://shopview.testrail.io/index.php?/cases/view/715627 | custom_expected: build line+marker | Design — how it looks |
| D-10c | C715628 | https://shopview.testrail.io/index.php?/cases/view/715628 | custom_steps: other; custom_expected: build line+marker | Design — how it looks |
| D-11 | C715491 | https://shopview.testrail.io/index.php?/cases/view/715491 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-12 | C715492 | https://shopview.testrail.io/index.php?/cases/view/715492 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-13 | C715493 | https://shopview.testrail.io/index.php?/cases/view/715493 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-13b | C715629 | https://shopview.testrail.io/index.php?/cases/view/715629 | custom_expected: build line+marker | Design — how it looks |
| D-13c | C715630 | https://shopview.testrail.io/index.php?/cases/view/715630 | custom_steps: other; custom_expected: build line+marker | Design — how it looks |
| D-14 | C715494 | https://shopview.testrail.io/index.php?/cases/view/715494 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-15 | C715495 | https://shopview.testrail.io/index.php?/cases/view/715495 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-16 | C715496 | https://shopview.testrail.io/index.php?/cases/view/715496 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| D-16b | C715631 | https://shopview.testrail.io/index.php?/cases/view/715631 | custom_expected: build line+marker | Design — how it looks |
| D-16c | C715632 | https://shopview.testrail.io/index.php?/cases/view/715632 | custom_steps: other; custom_expected: build line+marker | Design — how it looks |
| D-17 | C715497 | https://shopview.testrail.io/index.php?/cases/view/715497 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-18 | C715498 | https://shopview.testrail.io/index.php?/cases/view/715498 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-19 | C715499 | https://shopview.testrail.io/index.php?/cases/view/715499 | custom_expected: build line+marker | Design — how it looks |
| D-19b | C715633 | https://shopview.testrail.io/index.php?/cases/view/715633 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | Design — how it looks |
| D-20 | C715500 | https://shopview.testrail.io/index.php?/cases/view/715500 | custom_expected: build line+marker | Design — how it looks |
| D-20b | C715634 | https://shopview.testrail.io/index.php?/cases/view/715634 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | Design — how it looks |
| D-21 | C715501 | https://shopview.testrail.io/index.php?/cases/view/715501 | custom_expected: build line+marker | Design — how it looks |
| D-21b | C715635 | https://shopview.testrail.io/index.php?/cases/view/715635 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | Design — how it looks |
| D-22 | C715502 | https://shopview.testrail.io/index.php?/cases/view/715502 | custom_expected: build line+marker | Design — how it looks |
| D-22b | C715636 | https://shopview.testrail.io/index.php?/cases/view/715636 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | Design — how it looks |
| D-23 | C715503 | https://shopview.testrail.io/index.php?/cases/view/715503 | custom_expected: build line+marker | Design — how it looks |
| D-23b | C715637 | https://shopview.testrail.io/index.php?/cases/view/715637 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | Design — how it looks |
| D-24 | C715504 | https://shopview.testrail.io/index.php?/cases/view/715504 | custom_expected: build line+marker | Design — how it looks |
| D-24b | C715638 | https://shopview.testrail.io/index.php?/cases/view/715638 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | Design — how it looks |
| D-25 | C715505 | https://shopview.testrail.io/index.php?/cases/view/715505 | custom_expected: build line+marker | Design — how it looks |
| D-26 | C715506 | https://shopview.testrail.io/index.php?/cases/view/715506 | custom_expected: build line+marker | Design — how it looks |
| D-27 | C715507 | https://shopview.testrail.io/index.php?/cases/view/715507 | custom_expected: build line+marker | Design — how it looks |
| D-28 | C715508 | https://shopview.testrail.io/index.php?/cases/view/715508 | custom_expected: build line+marker | Design — how it looks |
| D-29 | C715509 | https://shopview.testrail.io/index.php?/cases/view/715509 | custom_expected: build line+marker | Design — how it looks |
| D-30 | C715510 | https://shopview.testrail.io/index.php?/cases/view/715510 | custom_expected: build line+marker | Design — how it looks |
| D-31 | C715511 | https://shopview.testrail.io/index.php?/cases/view/715511 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-32 | C715512 | https://shopview.testrail.io/index.php?/cases/view/715512 | custom_expected: build line+marker | Design — how it looks |
| D-33 | C715513 | https://shopview.testrail.io/index.php?/cases/view/715513 | custom_expected: build line+marker | Design — how it looks |
| D-34 | C715514 | https://shopview.testrail.io/index.php?/cases/view/715514 | custom_expected: build line+marker | Design — how it looks |
| D-35 | C715515 | https://shopview.testrail.io/index.php?/cases/view/715515 | custom_expected: build line+marker | Design — how it looks |
| D-36 | C715516 | https://shopview.testrail.io/index.php?/cases/view/715516 | custom_expected: build line+marker | Design — how it looks |
| D-37 | C715517 | https://shopview.testrail.io/index.php?/cases/view/715517 | custom_expected: build line+marker | Design — how it looks |
| D-38 | C715518 | https://shopview.testrail.io/index.php?/cases/view/715518 | custom_expected: build line+marker | Design — how it looks |
| D-39 | C715519 | https://shopview.testrail.io/index.php?/cases/view/715519 | custom_expected: build line+marker+other | Design — how it looks |
| D-40 | C715520 | https://shopview.testrail.io/index.php?/cases/view/715520 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| D-41 | C715521 | https://shopview.testrail.io/index.php?/cases/view/715521 | custom_expected: build line+marker | Design — how it looks |
| D-42 | C715522 | https://shopview.testrail.io/index.php?/cases/view/715522 | custom_expected: build line+marker | Design — how it looks |
| D-43 | C715523 | https://shopview.testrail.io/index.php?/cases/view/715523 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-44 | C715524 | https://shopview.testrail.io/index.php?/cases/view/715524 | custom_expected: build line+marker | Design — how it looks |
| D-45 | C715525 | https://shopview.testrail.io/index.php?/cases/view/715525 | custom_expected: build line+marker | Design — how it looks |
| D-46 | C715526 | https://shopview.testrail.io/index.php?/cases/view/715526 | custom_expected: build line+marker | Design — how it looks |
| D-47 | C715527 | https://shopview.testrail.io/index.php?/cases/view/715527 | custom_expected: build line+marker | Design — how it looks |
| D-48 | C715528 | https://shopview.testrail.io/index.php?/cases/view/715528 | custom_expected: build line+marker | Design — how it looks |
| D-49 | C715529 | https://shopview.testrail.io/index.php?/cases/view/715529 | custom_steps: other; custom_expected: build line+marker | Design — how it looks |
| D-50 | C715532 | https://shopview.testrail.io/index.php?/cases/view/715532 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-51 | C715533 | https://shopview.testrail.io/index.php?/cases/view/715533 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-52 | C715534 | https://shopview.testrail.io/index.php?/cases/view/715534 | custom_expected: build line+marker+other | Design — how it looks |
| D-53 | C715535 | https://shopview.testrail.io/index.php?/cases/view/715535 | custom_expected: build line+marker | Design — how it looks |
| D-54 | C715536 | https://shopview.testrail.io/index.php?/cases/view/715536 | custom_expected: build line+marker | Design — how it looks |
| D-55 | C715537 | https://shopview.testrail.io/index.php?/cases/view/715537 | custom_expected: build line+marker | Design — how it looks |
| D-56 | C715538 | https://shopview.testrail.io/index.php?/cases/view/715538 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-57 | C715539 | https://shopview.testrail.io/index.php?/cases/view/715539 | custom_expected: build line+marker | Design — how it looks |
| D-58 | C715540 | https://shopview.testrail.io/index.php?/cases/view/715540 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-59 | C715541 | https://shopview.testrail.io/index.php?/cases/view/715541 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-60 | C715542 | https://shopview.testrail.io/index.php?/cases/view/715542 | custom_expected: build line+marker | Design — how it looks |
| D-61 | C715543 | https://shopview.testrail.io/index.php?/cases/view/715543 | custom_expected: build line+marker | Design — how it looks |
| D-62 | C715544 | https://shopview.testrail.io/index.php?/cases/view/715544 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| D-63 | C715545 | https://shopview.testrail.io/index.php?/cases/view/715545 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-64 | C715546 | https://shopview.testrail.io/index.php?/cases/view/715546 | custom_expected: build line+marker+other | Design — how it looks |
| D-65 | C715547 | https://shopview.testrail.io/index.php?/cases/view/715547 | custom_steps: other; custom_expected: build line+marker | Design — how it looks |
| D-66 | C715548 | https://shopview.testrail.io/index.php?/cases/view/715548 | custom_expected: build line+marker | Design — how it looks |
| D-67 | C715549 | https://shopview.testrail.io/index.php?/cases/view/715549 | custom_expected: build line+marker | Design — how it looks |
| D-68 | C715550 | https://shopview.testrail.io/index.php?/cases/view/715550 | custom_expected: build line+marker | Design — how it looks |
| D-69 | C715551 | https://shopview.testrail.io/index.php?/cases/view/715551 | custom_expected: build line+marker | Design — how it looks |
| D-70 | C715552 | https://shopview.testrail.io/index.php?/cases/view/715552 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-71 | C715553 | https://shopview.testrail.io/index.php?/cases/view/715553 | custom_expected: build line+marker | Design — how it looks |
| D-72 | C715554 | https://shopview.testrail.io/index.php?/cases/view/715554 | custom_expected: build line+marker | Design — how it looks |
| D-73 | C715555 | https://shopview.testrail.io/index.php?/cases/view/715555 | custom_expected: build line+marker | Design — how it looks |
| D-74 | C715556 | https://shopview.testrail.io/index.php?/cases/view/715556 | custom_expected: build line+marker | Design — how it looks |
| D-75 | C715557 | https://shopview.testrail.io/index.php?/cases/view/715557 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| D-81 | C715563 | https://shopview.testrail.io/index.php?/cases/view/715563 | custom_expected: build line+marker | Design — how it looks |
| DATA-01 | C715450 | https://shopview.testrail.io/index.php?/cases/view/715450 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-01b | C715612 | https://shopview.testrail.io/index.php?/cases/view/715612 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-02 | C715451 | https://shopview.testrail.io/index.php?/cases/view/715451 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-02b | C715613 | https://shopview.testrail.io/index.php?/cases/view/715613 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-03 | C715452 | https://shopview.testrail.io/index.php?/cases/view/715452 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-03b | C715614 | https://shopview.testrail.io/index.php?/cases/view/715614 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-04 | C715453 | https://shopview.testrail.io/index.php?/cases/view/715453 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-04b | C715615 | https://shopview.testrail.io/index.php?/cases/view/715615 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-05 | C715454 | https://shopview.testrail.io/index.php?/cases/view/715454 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-06 | C715455 | https://shopview.testrail.io/index.php?/cases/view/715455 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-07 | C715456 | https://shopview.testrail.io/index.php?/cases/view/715456 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-08 | C715457 | https://shopview.testrail.io/index.php?/cases/view/715457 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-09 | C715458 | https://shopview.testrail.io/index.php?/cases/view/715458 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-10 | C715459 | https://shopview.testrail.io/index.php?/cases/view/715459 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-11 | C715460 | https://shopview.testrail.io/index.php?/cases/view/715460 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-12 | C715461 | https://shopview.testrail.io/index.php?/cases/view/715461 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-13 | C715462 | https://shopview.testrail.io/index.php?/cases/view/715462 | custom_preconds: other; custom_expected: build line+marker+other | Run on Staging After the Feature Is Deployed |
| DATA-14 | C715463 | https://shopview.testrail.io/index.php?/cases/view/715463 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-15 | C715464 | https://shopview.testrail.io/index.php?/cases/view/715464 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| DATA-16 | C715465 | https://shopview.testrail.io/index.php?/cases/view/715465 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-17 | C715466 | https://shopview.testrail.io/index.php?/cases/view/715466 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-18 | C715467 | https://shopview.testrail.io/index.php?/cases/view/715467 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-19 | C715468 | https://shopview.testrail.io/index.php?/cases/view/715468 | custom_expected: build line | Totals and counts — exact amounts |
| DATA-20 | C715469 | https://shopview.testrail.io/index.php?/cases/view/715469 | custom_expected: build line+marker | Totals and counts — exact amounts |
| DATA-22 | C715581 | https://shopview.testrail.io/index.php?/cases/view/715581 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-23 | C797945 | https://shopview.testrail.io/index.php?/cases/view/797945 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-24 | C797946 | https://shopview.testrail.io/index.php?/cases/view/797946 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-25 | C1062587 | https://shopview.testrail.io/index.php?/cases/view/1062587 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-26 | C1062588 | https://shopview.testrail.io/index.php?/cases/view/1062588 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| DATA-27 | C1062589 | https://shopview.testrail.io/index.php?/cases/view/1062589 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker | Setup needed before testing |
| REL-01 | C715471 | https://shopview.testrail.io/index.php?/cases/view/715471 | title: other; custom_preconds: other; custom_steps: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-02 | C715472 | https://shopview.testrail.io/index.php?/cases/view/715472 | title: other; custom_preconds: other; custom_steps: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-03 | C715473 | https://shopview.testrail.io/index.php?/cases/view/715473 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| REL-04 | C715474 | https://shopview.testrail.io/index.php?/cases/view/715474 | custom_preconds: other+setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| REL-04b | C715616 | https://shopview.testrail.io/index.php?/cases/view/715616 | custom_preconds: other+setup block; custom_expected: build line+marker+other | Setup needed before testing |
| REL-05 | C715475 | https://shopview.testrail.io/index.php?/cases/view/715475 | title: other; custom_preconds: other; custom_steps: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-05b | C715617 | https://shopview.testrail.io/index.php?/cases/view/715617 | title: other; custom_preconds: other; custom_steps: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-05c | C715618 | https://shopview.testrail.io/index.php?/cases/view/715618 | title: other; custom_preconds: other; custom_steps: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-06 | C715476 | https://shopview.testrail.io/index.php?/cases/view/715476 | custom_preconds: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-07 | C715477 | https://shopview.testrail.io/index.php?/cases/view/715477 | custom_preconds: other; custom_expected: build line+marker+other | Run on Staging After the Feature Is Deployed |
| REL-09 | C715479 | https://shopview.testrail.io/index.php?/cases/view/715479 | custom_steps: other; custom_expected: build line+marker+other | Run on Staging After the Feature Is Deployed |
| REL-10 | C715480 | https://shopview.testrail.io/index.php?/cases/view/715480 | custom_preconds: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-11 | C715582 | https://shopview.testrail.io/index.php?/cases/view/715582 | title: other; custom_preconds: other; custom_steps: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-12 | C715583 | https://shopview.testrail.io/index.php?/cases/view/715583 | custom_preconds: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-12b | C715619 | https://shopview.testrail.io/index.php?/cases/view/715619 | custom_preconds: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-12c | C715620 | https://shopview.testrail.io/index.php?/cases/view/715620 | custom_preconds: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-13 | C715584 | https://shopview.testrail.io/index.php?/cases/view/715584 | title: other; custom_preconds: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| REL-14 | C1062590 | https://shopview.testrail.io/index.php?/cases/view/1062590 | custom_preconds: other; custom_expected: build line+other | Run on Staging After the Feature Is Deployed |
| S1-01 | C715273 | https://shopview.testrail.io/index.php?/cases/view/715273 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S1-02 | C715274 | https://shopview.testrail.io/index.php?/cases/view/715274 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S1-03 | C715275 | https://shopview.testrail.io/index.php?/cases/view/715275 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S1-04 | C715276 | https://shopview.testrail.io/index.php?/cases/view/715276 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S1-05 | C715277 | https://shopview.testrail.io/index.php?/cases/view/715277 | custom_preconds: setup block; custom_expected: build line+marker | Retired - cannot be set up (QA lead 11 and 12 Nov 2026) |
| S1-06 | C715278 | https://shopview.testrail.io/index.php?/cases/view/715278 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S1-07 | C715279 | https://shopview.testrail.io/index.php?/cases/view/715279 | custom_preconds: setup block; custom_expected: build line+marker | Retired - cannot be set up (QA lead 11 and 12 Nov 2026) |
| S1-08 | C715280 | https://shopview.testrail.io/index.php?/cases/view/715280 | custom_steps: other; custom_expected: build line+marker | S1 — Reports open in QuickBooks name order |
| S1-09 | C715281 | https://shopview.testrail.io/index.php?/cases/view/715281 | custom_steps: other; custom_expected: build line+marker | S1 — Reports open in QuickBooks name order |
| S1-10 | C715282 | https://shopview.testrail.io/index.php?/cases/view/715282 | custom_expected: build line+marker+other | S1 — Reports open in QuickBooks name order |
| S1-11 | C715283 | https://shopview.testrail.io/index.php?/cases/view/715283 | custom_steps: other; custom_expected: build line+marker+other | S1 — Reports open in QuickBooks name order |
| S1-12 | C715284 | https://shopview.testrail.io/index.php?/cases/view/715284 | custom_expected: build line+marker | S1 — Reports open in QuickBooks name order |
| S1-13 | C715285 | https://shopview.testrail.io/index.php?/cases/view/715285 | custom_expected: build line+marker | S1 — Reports open in QuickBooks name order |
| S1-14 | C715286 | https://shopview.testrail.io/index.php?/cases/view/715286 | custom_preconds: other+setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S1-15 | C715287 | https://shopview.testrail.io/index.php?/cases/view/715287 | custom_expected: build line+marker | S1 — Reports open in QuickBooks name order |
| S1-16 | C715573 | https://shopview.testrail.io/index.php?/cases/view/715573 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S1-17 | C1062566 | https://shopview.testrail.io/index.php?/cases/view/1062566 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S1-18 | C1062567 | https://shopview.testrail.io/index.php?/cases/view/1062567 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S1-19 | C1062568 | https://shopview.testrail.io/index.php?/cases/view/1062568 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S1-20 | C1062569 | https://shopview.testrail.io/index.php?/cases/view/1062569 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S1-21 | C1062570 | https://shopview.testrail.io/index.php?/cases/view/1062570 | custom_expected: build line+marker | S1 — Reports open in QuickBooks name order |
| S1-22 | C1062571 | https://shopview.testrail.io/index.php?/cases/view/1062571 | custom_steps: other; custom_expected: build line+marker | S1 — Reports open in QuickBooks name order |
| S2-01 | C715288 | https://shopview.testrail.io/index.php?/cases/view/715288 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-01b | C715585 | https://shopview.testrail.io/index.php?/cases/view/715585 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-02 | C715289 | https://shopview.testrail.io/index.php?/cases/view/715289 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-03 | C715290 | https://shopview.testrail.io/index.php?/cases/view/715290 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-04 | C715291 | https://shopview.testrail.io/index.php?/cases/view/715291 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-04b | C715586 | https://shopview.testrail.io/index.php?/cases/view/715586 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-05 | C715292 | https://shopview.testrail.io/index.php?/cases/view/715292 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-06 | C715293 | https://shopview.testrail.io/index.php?/cases/view/715293 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-07 | C715294 | https://shopview.testrail.io/index.php?/cases/view/715294 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-07b | C715587 | https://shopview.testrail.io/index.php?/cases/view/715587 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-08 | C715295 | https://shopview.testrail.io/index.php?/cases/view/715295 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-09 | C715296 | https://shopview.testrail.io/index.php?/cases/view/715296 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-10 | C715297 | https://shopview.testrail.io/index.php?/cases/view/715297 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-11 | C715298 | https://shopview.testrail.io/index.php?/cases/view/715298 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-12 | C715299 | https://shopview.testrail.io/index.php?/cases/view/715299 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-12b | C715588 | https://shopview.testrail.io/index.php?/cases/view/715588 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-13 | C715300 | https://shopview.testrail.io/index.php?/cases/view/715300 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-14 | C715301 | https://shopview.testrail.io/index.php?/cases/view/715301 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-15 | C715302 | https://shopview.testrail.io/index.php?/cases/view/715302 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-15b | C715589 | https://shopview.testrail.io/index.php?/cases/view/715589 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-16 | C715303 | https://shopview.testrail.io/index.php?/cases/view/715303 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-17 | C715304 | https://shopview.testrail.io/index.php?/cases/view/715304 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-18 | C715305 | https://shopview.testrail.io/index.php?/cases/view/715305 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-19 | C715306 | https://shopview.testrail.io/index.php?/cases/view/715306 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-19b | C715590 | https://shopview.testrail.io/index.php?/cases/view/715590 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-20 | C715307 | https://shopview.testrail.io/index.php?/cases/view/715307 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-20b | C715591 | https://shopview.testrail.io/index.php?/cases/view/715591 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-21 | C715308 | https://shopview.testrail.io/index.php?/cases/view/715308 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-22 | C715309 | https://shopview.testrail.io/index.php?/cases/view/715309 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-23 | C715310 | https://shopview.testrail.io/index.php?/cases/view/715310 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-24 | C715311 | https://shopview.testrail.io/index.php?/cases/view/715311 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-25 | C715312 | https://shopview.testrail.io/index.php?/cases/view/715312 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-26 | C715313 | https://shopview.testrail.io/index.php?/cases/view/715313 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-27 | C715314 | https://shopview.testrail.io/index.php?/cases/view/715314 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-28 | C715315 | https://shopview.testrail.io/index.php?/cases/view/715315 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-29 | C715316 | https://shopview.testrail.io/index.php?/cases/view/715316 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-30 | C715317 | https://shopview.testrail.io/index.php?/cases/view/715317 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-31 | C715318 | https://shopview.testrail.io/index.php?/cases/view/715318 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-32 | C715319 | https://shopview.testrail.io/index.php?/cases/view/715319 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-33 | C715320 | https://shopview.testrail.io/index.php?/cases/view/715320 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-34 | C715321 | https://shopview.testrail.io/index.php?/cases/view/715321 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-35 | C715322 | https://shopview.testrail.io/index.php?/cases/view/715322 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-36 | C715323 | https://shopview.testrail.io/index.php?/cases/view/715323 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-36b | C715592 | https://shopview.testrail.io/index.php?/cases/view/715592 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-37 | C715324 | https://shopview.testrail.io/index.php?/cases/view/715324 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-37b | C715593 | https://shopview.testrail.io/index.php?/cases/view/715593 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-38 | C715325 | https://shopview.testrail.io/index.php?/cases/view/715325 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-38b | C715594 | https://shopview.testrail.io/index.php?/cases/view/715594 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-39 | C715326 | https://shopview.testrail.io/index.php?/cases/view/715326 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-40 | C797940 | https://shopview.testrail.io/index.php?/cases/view/797940 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-41 | C797941 | https://shopview.testrail.io/index.php?/cases/view/797941 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-42 | C797942 | https://shopview.testrail.io/index.php?/cases/view/797942 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-43 | C1062572 | https://shopview.testrail.io/index.php?/cases/view/1062572 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-44 | C1062573 | https://shopview.testrail.io/index.php?/cases/view/1062573 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-45 | C1062574 | https://shopview.testrail.io/index.php?/cases/view/1062574 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-46 | C1062575 | https://shopview.testrail.io/index.php?/cases/view/1062575 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S2-47 | C1062576 | https://shopview.testrail.io/index.php?/cases/view/1062576 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-48 | C1062577 | https://shopview.testrail.io/index.php?/cases/view/1062577 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S2-49 | C1062578 | https://shopview.testrail.io/index.php?/cases/view/1062578 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S2-50 | C1062579 | https://shopview.testrail.io/index.php?/cases/view/1062579 | custom_expected: build line+marker | S2 — Sort by clicking any column header |
| S3-01 | C715327 | https://shopview.testrail.io/index.php?/cases/view/715327 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-01b | C715595 | https://shopview.testrail.io/index.php?/cases/view/715595 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-01c | C715596 | https://shopview.testrail.io/index.php?/cases/view/715596 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-02 | C715328 | https://shopview.testrail.io/index.php?/cases/view/715328 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-02b | C715597 | https://shopview.testrail.io/index.php?/cases/view/715597 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-02c | C715598 | https://shopview.testrail.io/index.php?/cases/view/715598 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-03 | C715329 | https://shopview.testrail.io/index.php?/cases/view/715329 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-04 | C715330 | https://shopview.testrail.io/index.php?/cases/view/715330 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-05 | C715331 | https://shopview.testrail.io/index.php?/cases/view/715331 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-06 | C715332 | https://shopview.testrail.io/index.php?/cases/view/715332 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-07 | C715333 | https://shopview.testrail.io/index.php?/cases/view/715333 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-08 | C715334 | https://shopview.testrail.io/index.php?/cases/view/715334 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-09 | C715335 | https://shopview.testrail.io/index.php?/cases/view/715335 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-10 | C715336 | https://shopview.testrail.io/index.php?/cases/view/715336 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-11 | C715337 | https://shopview.testrail.io/index.php?/cases/view/715337 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-12 | C715338 | https://shopview.testrail.io/index.php?/cases/view/715338 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-13 | C715339 | https://shopview.testrail.io/index.php?/cases/view/715339 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-14 | C715340 | https://shopview.testrail.io/index.php?/cases/view/715340 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-15 | C715341 | https://shopview.testrail.io/index.php?/cases/view/715341 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-16 | C715342 | https://shopview.testrail.io/index.php?/cases/view/715342 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-17 | C715343 | https://shopview.testrail.io/index.php?/cases/view/715343 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S3-18 | C715344 | https://shopview.testrail.io/index.php?/cases/view/715344 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S3-19 | C715345 | https://shopview.testrail.io/index.php?/cases/view/715345 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S3-20 | C715346 | https://shopview.testrail.io/index.php?/cases/view/715346 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S3-21 | C715347 | https://shopview.testrail.io/index.php?/cases/view/715347 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S3-22 | C715348 | https://shopview.testrail.io/index.php?/cases/view/715348 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S3-23 | C715349 | https://shopview.testrail.io/index.php?/cases/view/715349 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S3-24 | C715350 | https://shopview.testrail.io/index.php?/cases/view/715350 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-25 | C715351 | https://shopview.testrail.io/index.php?/cases/view/715351 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-26 | C715352 | https://shopview.testrail.io/index.php?/cases/view/715352 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-27 | C715353 | https://shopview.testrail.io/index.php?/cases/view/715353 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-28 | C715574 | https://shopview.testrail.io/index.php?/cases/view/715574 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-29 | C715575 | https://shopview.testrail.io/index.php?/cases/view/715575 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-30 | C715576 | https://shopview.testrail.io/index.php?/cases/view/715576 | custom_expected: build line+marker | S3 — Export to PDF and CSV |
| S3-31 | C1062580 | https://shopview.testrail.io/index.php?/cases/view/1062580 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S3-32 | C1062581 | https://shopview.testrail.io/index.php?/cases/view/1062581 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S4-01 | C715354 | https://shopview.testrail.io/index.php?/cases/view/715354 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S4-02 | C715355 | https://shopview.testrail.io/index.php?/cases/view/715355 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-03 | C715356 | https://shopview.testrail.io/index.php?/cases/view/715356 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S4-04 | C715357 | https://shopview.testrail.io/index.php?/cases/view/715357 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-05 | C715358 | https://shopview.testrail.io/index.php?/cases/view/715358 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-06 | C715359 | https://shopview.testrail.io/index.php?/cases/view/715359 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-07 | C715360 | https://shopview.testrail.io/index.php?/cases/view/715360 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-08 | C715361 | https://shopview.testrail.io/index.php?/cases/view/715361 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-09 | C715362 | https://shopview.testrail.io/index.php?/cases/view/715362 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-09b | C715599 | https://shopview.testrail.io/index.php?/cases/view/715599 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-10 | C715363 | https://shopview.testrail.io/index.php?/cases/view/715363 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S4-10b | C715600 | https://shopview.testrail.io/index.php?/cases/view/715600 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S4-11 | C715364 | https://shopview.testrail.io/index.php?/cases/view/715364 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-11b | C715601 | https://shopview.testrail.io/index.php?/cases/view/715601 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-12 | C715365 | https://shopview.testrail.io/index.php?/cases/view/715365 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-12b | C715602 | https://shopview.testrail.io/index.php?/cases/view/715602 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-13 | C715366 | https://shopview.testrail.io/index.php?/cases/view/715366 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-14 | C715367 | https://shopview.testrail.io/index.php?/cases/view/715367 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-15 | C715368 | https://shopview.testrail.io/index.php?/cases/view/715368 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-15b | C715603 | https://shopview.testrail.io/index.php?/cases/view/715603 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-16 | C715369 | https://shopview.testrail.io/index.php?/cases/view/715369 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-16b | C715604 | https://shopview.testrail.io/index.php?/cases/view/715604 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-17 | C715370 | https://shopview.testrail.io/index.php?/cases/view/715370 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-18 | C715371 | https://shopview.testrail.io/index.php?/cases/view/715371 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-19 | C715372 | https://shopview.testrail.io/index.php?/cases/view/715372 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-20 | C715373 | https://shopview.testrail.io/index.php?/cases/view/715373 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-21 | C715374 | https://shopview.testrail.io/index.php?/cases/view/715374 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-21b | C715605 | https://shopview.testrail.io/index.php?/cases/view/715605 | custom_expected: build line+marker | S4 — Collapse all, Expand all and pinned group rows |
| S4-22 | C1062582 | https://shopview.testrail.io/index.php?/cases/view/1062582 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | S4 — Collapse all, Expand all and pinned group rows |
| S4-23 | C1062583 | https://shopview.testrail.io/index.php?/cases/view/1062583 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | S4 — Collapse all, Expand all and pinned group rows |
| S5-01 | C715375 | https://shopview.testrail.io/index.php?/cases/view/715375 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-02 | C715376 | https://shopview.testrail.io/index.php?/cases/view/715376 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-03 | C715377 | https://shopview.testrail.io/index.php?/cases/view/715377 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-04 | C715378 | https://shopview.testrail.io/index.php?/cases/view/715378 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-05 | C715379 | https://shopview.testrail.io/index.php?/cases/view/715379 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-06 | C715380 | https://shopview.testrail.io/index.php?/cases/view/715380 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-07 | C715381 | https://shopview.testrail.io/index.php?/cases/view/715381 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-08 | C715382 | https://shopview.testrail.io/index.php?/cases/view/715382 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-09 | C715383 | https://shopview.testrail.io/index.php?/cases/view/715383 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-10 | C715384 | https://shopview.testrail.io/index.php?/cases/view/715384 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-10b | C715606 | https://shopview.testrail.io/index.php?/cases/view/715606 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-10c | C715607 | https://shopview.testrail.io/index.php?/cases/view/715607 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-11 | C715385 | https://shopview.testrail.io/index.php?/cases/view/715385 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-11b | C715608 | https://shopview.testrail.io/index.php?/cases/view/715608 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-11c | C715609 | https://shopview.testrail.io/index.php?/cases/view/715609 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-12 | C715386 | https://shopview.testrail.io/index.php?/cases/view/715386 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-13 | C715387 | https://shopview.testrail.io/index.php?/cases/view/715387 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S5-14 | C715388 | https://shopview.testrail.io/index.php?/cases/view/715388 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-15 | C715389 | https://shopview.testrail.io/index.php?/cases/view/715389 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S5-16 | C715390 | https://shopview.testrail.io/index.php?/cases/view/715390 | custom_steps: other; custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-17 | C715391 | https://shopview.testrail.io/index.php?/cases/view/715391 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S5-18 | C715392 | https://shopview.testrail.io/index.php?/cases/view/715392 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-19 | C715393 | https://shopview.testrail.io/index.php?/cases/view/715393 | custom_steps: other; custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-20 | C715394 | https://shopview.testrail.io/index.php?/cases/view/715394 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S5-21 | C715395 | https://shopview.testrail.io/index.php?/cases/view/715395 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-22 | C715396 | https://shopview.testrail.io/index.php?/cases/view/715396 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-23 | C715397 | https://shopview.testrail.io/index.php?/cases/view/715397 | custom_steps: other; custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-24 | C715398 | https://shopview.testrail.io/index.php?/cases/view/715398 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-25 | C715399 | https://shopview.testrail.io/index.php?/cases/view/715399 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-26 | C715400 | https://shopview.testrail.io/index.php?/cases/view/715400 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-27 | C715401 | https://shopview.testrail.io/index.php?/cases/view/715401 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-28 | C715402 | https://shopview.testrail.io/index.php?/cases/view/715402 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-29 | C715403 | https://shopview.testrail.io/index.php?/cases/view/715403 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-30 | C715404 | https://shopview.testrail.io/index.php?/cases/view/715404 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-31 | C715405 | https://shopview.testrail.io/index.php?/cases/view/715405 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-32 | C715406 | https://shopview.testrail.io/index.php?/cases/view/715406 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-33 | C715407 | https://shopview.testrail.io/index.php?/cases/view/715407 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-34 | C715408 | https://shopview.testrail.io/index.php?/cases/view/715408 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-35 | C715577 | https://shopview.testrail.io/index.php?/cases/view/715577 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-36 | C715578 | https://shopview.testrail.io/index.php?/cases/view/715578 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-37 | C715579 | https://shopview.testrail.io/index.php?/cases/view/715579 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-38 | C715580 | https://shopview.testrail.io/index.php?/cases/view/715580 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S5-39 | C797943 | https://shopview.testrail.io/index.php?/cases/view/797943 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S5-40 | C1062584 | https://shopview.testrail.io/index.php?/cases/view/1062584 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S5-41 | C1062585 | https://shopview.testrail.io/index.php?/cases/view/1062585 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S5-42 | C1062586 | https://shopview.testrail.io/index.php?/cases/view/1062586 | custom_expected: build line+marker | S5 — Filters: customer or vendor, past due and location |
| S6-01 | C715409 | https://shopview.testrail.io/index.php?/cases/view/715409 | custom_expected: build line+marker | S6 — Location column |
| S6-02 | C715410 | https://shopview.testrail.io/index.php?/cases/view/715410 | custom_expected: build line+marker | S6 — Location column |
| S6-03 | C715411 | https://shopview.testrail.io/index.php?/cases/view/715411 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S6-04 | C715412 | https://shopview.testrail.io/index.php?/cases/view/715412 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S6-05 | C715413 | https://shopview.testrail.io/index.php?/cases/view/715413 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-01 | C715414 | https://shopview.testrail.io/index.php?/cases/view/715414 | custom_expected: build line+marker | S7 — Document links open where they can |
| S7-02 | C715415 | https://shopview.testrail.io/index.php?/cases/view/715415 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S7-03 | C715416 | https://shopview.testrail.io/index.php?/cases/view/715416 | custom_expected: build line+marker+other | S7 — Document links open where they can |
| S7-04 | C715417 | https://shopview.testrail.io/index.php?/cases/view/715417 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S7-05 | C715418 | https://shopview.testrail.io/index.php?/cases/view/715418 | custom_expected: build line+marker | S7 — Document links open where they can |
| S7-06 | C715419 | https://shopview.testrail.io/index.php?/cases/view/715419 | custom_expected: build line+marker | S7 — Document links open where they can |
| S7-07 | C715420 | https://shopview.testrail.io/index.php?/cases/view/715420 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-08 | C715421 | https://shopview.testrail.io/index.php?/cases/view/715421 | custom_preconds: setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-09 | C715422 | https://shopview.testrail.io/index.php?/cases/view/715422 | custom_expected: build line+marker | S7 — Document links open where they can |
| S7-10 | C715423 | https://shopview.testrail.io/index.php?/cases/view/715423 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S7-11 | C715424 | https://shopview.testrail.io/index.php?/cases/view/715424 | custom_preconds: setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S7-12 | C715425 | https://shopview.testrail.io/index.php?/cases/view/715425 | custom_preconds: other+setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-13 | C715426 | https://shopview.testrail.io/index.php?/cases/view/715426 | custom_preconds: other+setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-14 | C715427 | https://shopview.testrail.io/index.php?/cases/view/715427 | custom_preconds: other+setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-15 | C715428 | https://shopview.testrail.io/index.php?/cases/view/715428 | custom_preconds: other+setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-16 | C715429 | https://shopview.testrail.io/index.php?/cases/view/715429 | custom_preconds: other+setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-17 | C715430 | https://shopview.testrail.io/index.php?/cases/view/715430 | custom_preconds: other+setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-18 | C715431 | https://shopview.testrail.io/index.php?/cases/view/715431 | custom_preconds: other+setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S7-18b | C715610 | https://shopview.testrail.io/index.php?/cases/view/715610 | custom_preconds: other+setup block; custom_expected: build line+marker+other | Setup needed before testing |
| S7-19 | C715432 | https://shopview.testrail.io/index.php?/cases/view/715432 | custom_preconds: other+setup block; custom_steps: other; custom_expected: build line+marker+other | Setup needed before testing |
| S7-20 | C797944 | https://shopview.testrail.io/index.php?/cases/view/797944 | custom_expected: build line+marker | S7 — Document links open where they can |
| S8-01 | C715433 | https://shopview.testrail.io/index.php?/cases/view/715433 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-02 | C715434 | https://shopview.testrail.io/index.php?/cases/view/715434 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-03 | C715435 | https://shopview.testrail.io/index.php?/cases/view/715435 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-04 | C715436 | https://shopview.testrail.io/index.php?/cases/view/715436 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-05 | C715437 | https://shopview.testrail.io/index.php?/cases/view/715437 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-06 | C715438 | https://shopview.testrail.io/index.php?/cases/view/715438 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-07 | C715439 | https://shopview.testrail.io/index.php?/cases/view/715439 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-07b | C715611 | https://shopview.testrail.io/index.php?/cases/view/715611 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-08 | C715440 | https://shopview.testrail.io/index.php?/cases/view/715440 | custom_steps: other; custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-09 | C715441 | https://shopview.testrail.io/index.php?/cases/view/715441 | custom_steps: other; custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-10 | C715442 | https://shopview.testrail.io/index.php?/cases/view/715442 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | S8 — Report descriptions and layout |
| S8-11 | C715443 | https://shopview.testrail.io/index.php?/cases/view/715443 | custom_preconds: other; custom_steps: other; custom_expected: build line+marker+other | S8 — Report descriptions and layout |
| S8-12 | C715444 | https://shopview.testrail.io/index.php?/cases/view/715444 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S8-13 | C715449 | https://shopview.testrail.io/index.php?/cases/view/715449 | custom_expected: build line+marker | S8 — Report descriptions and layout |
| S9-01 | C715445 | https://shopview.testrail.io/index.php?/cases/view/715445 | custom_expected: build line+marker | S9 — A/R Collection call list |
| S9-02 | C715446 | https://shopview.testrail.io/index.php?/cases/view/715446 | custom_preconds: setup block; custom_expected: build line+marker | Setup needed before testing |
| S9-03 | C715447 | https://shopview.testrail.io/index.php?/cases/view/715447 | custom_steps: other; custom_expected: build line+marker | S9 — A/R Collection call list |
| S9-04 | C715448 | https://shopview.testrail.io/index.php?/cases/view/715448 | custom_preconds: other+setup block; custom_expected: build line+marker+other | Setup needed before testing |

## 8. Reading coverage

| Source | Size | Read |
|---|---|---|
| PRD v11 → v13 line diff (`PRD-DIFF-v11-to-v13.txt`) | 25 lines, 6,518 bytes | 100%, in full |
| PRD v13 (`sources/CONFLUENCE-947650561-v13-read-2026-11-13.md`) | 485 lines, 61,453 bytes | the 10 changed or added lines in full (diff); the other 475 lines proven identical by script to v11, which was read in full on 10 Nov 2026; every one of the 115 requirement lines quoted by a case checked word for word by script |
| Confluence page 947650561 | live metadata | version 13, created 2026-11-13T14:36:51Z by Chris Ward ("S5-R10b future as-of date (SV-12545)"), re-checked 14 Nov 2026 |
| Jira: SV-11315 and its stories, every child | 37 tickets (one page, isLast) | 100% list; 29 descriptions fetched; story/epic/bug descriptions diffed against 10 Nov by script (only SV-11535 changed: S5-R10b + acceptance check, read in full); the 11 new tickets read in full (401 lines, 34,498 bytes) |
| Chris Ward's question sheet, rows 24-40 | 22 questions | read in full: answers column empty for 18-22 |
| Live TestRail | 9,030 cases paged, 486 kept (394 ours + 89 in run 557 + 3 retired-folder), run 557 (481 tests), folder 90418 | by script; foreign C1078980 and C1078981 read in full |
| Design (5 Nov version) | 2 pictures viewed ("Expand all from the header", "A/P Unpaid Invoices at 1440"), chevron text in Grouped.dc.html | for DD-08 and S8-R3 |
| Rules and skills | Rule 117 14th/15th amendments, 113, 134-137, 140, 61, 69; skill 21 §6d; skill 07 §6.0; LESSONS-REGISTER.md | in full |

## 9. Unsettled / for the QA lead

1. **Every case was edited outside our library** (section 3). Recommended: run `update_cases.py --on-live` (keeps every outside edit, proven), then `create_new.py`, `sync_run_557.py`, `folder_note.py`. Otherwise the ordered lock writes nothing and the suite stays on v11/v12 for the 19 Nov release.
2. **DATA-13 (C715462)**: the case id dropped from its live record name (R6), as the QA lead chose; nothing held.
3. **SV-12723**: S2-51 (A/R Summary) and S2-52 (A/P Summary) added on the QA lead's choice (S2-R6, checklist lines 9 and 10).
4. **SV-12540 closed as obsolete**, but PRD v13 S1-R8 still sets that only the first 100 documents are shown, then 100 more as you scroll; S1-21/S1-22 keep that (they passed 11-12 Nov). No PO question: the PRD's own words settle it (skill 07 §6.0 check b).
5. **PO questions**: no new question passes checks a-h (DD-08 is settled by the later PRD ruling, check a/c; S8-R3's 'can make the table scroll sideways' is permissive, not a must, check e; everything else is quoted from the PRD, check b). Waiting on Chris Ward (sheet https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA): 18 (no case held; S3-32 C1062581 and S5-43 avoid days before the 10th), 20, 22 (added 11 Nov by another session; no case of ours held). 19 and 21 are settled by PRD v13/v12.
