# SV-12341 — Roll back part-request creation when bin validation fails (8 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12341 (Bug, TESTING QA, no assignee, labels BE/claude-fix-jira, no QA assignee, no Powertools plan). QA branch https://sv12341.qa.shopview.com. PR 4227.
Mode: Board-2 defaults. API-surface ticket (Rule 63a): the subject is the save endpoint's behaviour on a rejected bin allocation.

## The request the screen sends (captured on production, inline part row, S2-1920)
`POST /api/work-orders/part/make-request {work_order, line, description, quantity, part_source_type:"inventory", part_number, inventory_part_id,
 bins:[{id, name, quantity}], part_category_id, sell_price}` -> 201.

## Production BEFORE — v26.45.2-132dcb4 — S2-1920 (ZZAUTOTEST Aabridge Freight, In Progress), part SV-4162B (TESTB, General Storage, 4 on hand)
| Case | Reply | Part requests on the work order |
|---|---|---|
| A: bin id that does not exist | 400 "Bin location not found." | 1 -> 2 (new request left behind) |
| B: bin quantity 1, part quantity 2 | 400 "Bin quantities must match the requested quantity." | 2 -> 3 (left behind) |
| A again (resubmit) | 400 "Bin location not found." | 3 -> 4 (another one) |
Stock of SV-4162B unchanged (4) in every case. Log: ev/prod-bincases.txt.

## Can a user reach it from the screen? (Rule 94 check)
- New Part Request dialog, part qty 2 / bin qty 1: the screen sends quantity 1 (it derives the part quantity from the bins) -> 201. Not reachable.
- Bin qty 10 with 4 on hand: allowed (201). Not a rejection.
- A made-up bin id cannot be chosen on screen.
So far not reachable from the screen; the ticket itself is the API behaviour, so it is tested at the endpoint.

## Branch AFTER — sv12341 v26.45.2-8a3ce52 (last-modified Sat 07 Nov 2026 19:15:02 GMT), 9 Nov 2026
S2-15658 (Desert Edge, In Progress). Part 84-2005 CONNECTOR, bin A2CD (14). Logs: ev/branch-bincases.txt, ev/branch-bincases2.txt, ev/branch-core-ps-bincases2.txt, ev/branch-tenant.txt.
- A missing bin / B 1 vs 2 / C 0 vs 1 / A again: 400 each, requests 30->30, stock 14 unchanged. D 999 from a 14-bin: 201 (allowed, same as production). V valid: 201.
- E line set Complete: E1/E2 refused -> line stays complete, nothing added; E3 valid -> 201 and line reopened (as production).
- F two bins W4715QP BARN 2 + B1FLOOR 1 = 3: 201; 2+2 vs 3: 400 nothing; good+missing bin: 400 nothing.
- G cored part FLT1443E23 (core cc06f6cc, stock 0, Unassigned bin): refused -> nothing; valid -> 201.
- H part sale P2-246 (line 418ef3fa): refused -> nothing; valid -> 201. (A part sale also needs `line`.)
- K auto-pick ON: refused x2 -> nothing, stock 14; valid -> picked (status received), stock 14->13; auto-pick restored off.
- T bin from Staging Lethbridge (VID2A): 400 "Bin location not found.", nothing added; part+bin from Lethbridge: 400 "Inventory part is required...".
Production (9 Nov, S2-1920): A/B/C/A-again each ADDED a request (7->11); D, V 201; complete line: E1 refused -> line REOPENED + request added; E2 added.
Total refused: production 8 (8 added) / branch 16 (0 added). Exhibit ev/jira/01-rejected-request-prod-vs-branch.png (uisnap.mjs). Console check console-check.js run live on both.

## Posted 9 Nov 2026 ~04:22 CST
Gate: build marker re-read v26.45.2-8a3ce52; ticket re-read (TESTING QA, 0 comments); image uploaded as attachment (3d138853); voice scan clean; no technical section.
Comment **80465** OVERALL QA STATUS: PASSED (12 rows, picture 1, console check labelled Comparison only). Read back: media present, 12 rows.
Label QAcomplete added; QA Assignee Bilal (was empty); status -> QA Complete (transition 10). Learning check: nothing new (part sale make-request also needs `line`, noted here).
Planned: cases A, B, resubmit (count must not change; no bin usage change) · valid single-bin create (201) · multi-bin create · bin by name · auto-pick on/off ·
part sale make-request · line reopening not leaked.
