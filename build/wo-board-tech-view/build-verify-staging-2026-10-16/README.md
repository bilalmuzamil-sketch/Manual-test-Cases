# WO Board & Tech View, run 498 — build verification on STAGING v26.40.19-72f4f3b, 16 Oct 2026
QA lead (16 Oct): "Option a" — build-verify the 34 HOLD + 9 changed-READY cases after Chris Ward's answers 12–31 (PRD v54),
plus C368191 (no marker). Lane: labels / routes / setup only; no test run, no data built. 44 cases snapshotted in before/.

## Written (apply.py --write, write-log.txt): 17 cases — stamp "Last checked against build v26.40.19-72f4f3b (staging) on 10/16/2026." + READY
C368127 C368141 C368163 C581895 C590110 C590111 C590115 C590116 C590125 C598326 C96909 C96916 C96935 C96983 C96990 C96963 C97009.
Gates: check_tester_runnable PASS 17/17 · check_runnable_cases 17/17 · served display fr-view 17/17 (served-17.json, served_scan_any.mjs).
Setup Docs fixed for C590110 C590111 C590115 C590116 C590125 (setup-doc-edits.json; density step names Tech View; C590115 + Add Part row;
C590116 Skip/View/Create; C590125 Light bullet + step, title/goal no longer "on hold").

## Prepared, NOT written — setup-Doc edit refused by this session's permission check (2 of 7 Doc calls denied; stopped, not retried)
C590112 C590117 C590120 C590122 C590128 C590129 C590131 C96927 C96956 C96979 C368158 C368130. Case side verified; apply.py already
carries the case wording (C96956 location example + "click Reassign"; C96927 On Site/Unit not in the menu; C96979 example Asset).
Doc edits ready in setup-doc-edits.json. Once Docs are fixed: `python3 apply.py --write <ids>` then the three gates.

## Not ready on this build (stay HOLD) — proofs claim-*.json, all PROVED by blocker_gate.py
- Keyboard (claim-tab-one-card.json): Tab stops at one card/row; arrows move between them; pins not on Tab. C368150 C368151 C368152 C97020 C97021 C97022.
- No Unassign menu item (claim-no-unassign-item.json): C368152.  No Technician filter (15 Oct proof): C590127, C97022.
## Automated — checked, waiting for the QA lead's yes (Rule 71; tell Vlad, Rule 65)
C96929 C97007 C97011 C368144 C368214 followable; C96978 needs its List-columns setup reworded (On Site is not in Column Selection);
C368145 not followable: New Work Order window has no Lead Technician field and no split-line item (claim-new-wo-no-lead-field.json).
## C368191: no AUTOMATION marker; needs a deleted staff member's labour line, which staging does not have. Not touched.
