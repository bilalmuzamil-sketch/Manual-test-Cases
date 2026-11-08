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

## Branch AFTER
Waiting for fresh `.qa.shopview.com` cookies.
Planned: cases A, B, resubmit (count must not change; no bin usage change) · valid single-bin create (201) · multi-bin create · bin by name · auto-pick on/off ·
part sale make-request · line reopening not leaked.
