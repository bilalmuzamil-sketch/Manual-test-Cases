# Filters full live VIU — RESUME (updated every batch)

BUILD MARKER IN FORCE: `v3.4.2-d00239b` · last-modified Tue 04 Aug 2026 22:51:02 GMT ·
etag `b9ab1d41718b5e871432064ed914e2e7` · read at pass start 2026-08-05T19:53Z.

SPEC: Confluence page 572030978 **version 18** (last edited 2026-08-04T18:19:21Z). In-body
"Version" field reads **1.6** — the known Rule-31(a) trap. Go by 18.

EPIC SV-8785: **23 direct children** (was 20), verified two ways with equal key sets.

## Batches complete
- Batch 1 — Filter Bar Layout (3) + Status Filter (7): OBSERVED. Evidence `evidence/b1.json`,
  `b1c.json`.
- Batch 2 — Empty State (3) + Clear Filters (part of sec 4117): OBSERVED. Evidence
  `evidence/b2.json`, `b2b.json`.

## Next case to observe
Section 4113 Customer Filter, starting C29566.

## Remaining
Customer (9) · Lead Technician (7) · Service Advisor (7) · Asset on Site (7) ·
Chips/Clear remainder (C29595, C29596, C29599, C29600) · Collapse (5) · Tab Behaviour (4 left) ·
Persistence (6) · URL State (6) · Mobile (10) · API (6) · Page Search (13) · Parts (5) · Reports (4).

## Env state to restore at end
Saved work-orders-list preference was DIRTY when the pass began (`filters:{status:["declined"]}`,
set 2026-08-05T19:14:50Z by another actor on this shared account). Captured in
`evidence/PRE-pref.json`. It was reset to empty filters, and must be left CLEAN.
