# SV-11452 — invalid status in the Work Orders link (production, 19 Oct 2026 CDT)

Production build v26.40.19-d2441a9 (read at the start and end of each run, and again before the description was written). Admin user bilal.muzamil@shopview.com, Chrome (Playwright), 1440 x 900, dpr 2. Ticket: Ready to Fix, Medium, 0 comments before the rewrite (live read).

## Matrix (list / Status button / ticked in menu)
| Link | List | Button | Ticked |
|---|---|---|---|
| /workorders (control) | mixed statuses | "Status", not highlighted | — |
| ticked Approved + Estimate in the menu | filtered | "Status: Approved, +1"; the link becomes ?status=approved&status=estimate | both |
| ?status=approved | 30 Approved | "Status: Approved" | Approved |
| ?status=Approved | 30 Approved (filtered) | highlighted, X on hover, no value | nothing |
| ?status=bogus | empty, "No work orders match these filters" | highlighted, X on hover, no value | nothing |
| ?status=approved,estimate | empty, same | highlighted, X on hover, no value | nothing |
| ?status=approved&status=bogus | Approved | "Status: Approved" | Approved |
- Hover (e.json): the arrow fades (opacity 0) and the cancel X shows (opacity 1) on bogus, capital and valid.
- "Clear all filters" restores the list; plain /workorders afterwards is unfiltered. Ticking in the menu saves `filters.status` in the user's work-orders-list preference; it was cleared afterwards, and the preference ended byte-equal to the start (d.json; c.json restored it with PUT 200, verified equal).
- Dashboard: 0 links to a filtered Work Orders list, so the only way in is a pasted or bookmarked link.

## Sources
Filters spec, Confluence 572030978, **version 23** (2026-08-24), read live 20 Oct: S11-N1, S11-R3, S7-N1, S7-R5 (quoted in the ticket). Our local requirements.md mirror predates v23 (its S7 numbering differs).

## What was done
- Jira duplicate search: none besides SV-11452.
- Description rewritten to the ticket standard (description.txt), attachments 62674 / 62675 / 62676; PUT 204; read back: headings in order, 6 continuous steps with 2 images inside, comparison image, 7-row table, original report kept with Ahtasham's video. Previous description saved: ev/SV-11452-before-rewrite.json.
- Learning check: (1) the clear X only shows on hover (S7-R6). My first caption claimed it from a still picture; fixed by capturing the hover state. (2) The capital-letter link filters but hides the filter, a third form of the bug that the original report didn't have.
