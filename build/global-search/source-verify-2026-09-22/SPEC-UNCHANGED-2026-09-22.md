# The specification has NOT been updated — read live, 22 September 2026

**He asked me to "read the updated specs" before deciding whether the recency tie-break needs a
ticket. There is no update.**

| | |
|---|---|
| Page | *Global Search - Product Requirements*, id **576978945** |
| Version | **17** — the same version I read on 21 September |
| Last edited | **2026-09-08T10:55:27Z** — two weeks ago |
| The sentence in question, §6.1, **verbatim today** | *"The score is clamped to a sane range; **ties are broken by recency (most recently updated wins)**. Because search returns at most 20 records per entity type (§5.2), ranking quality is what decides whether the record the user wanted is reachable at all."* |

**Nothing about the rule has changed, so nothing has moved the basis for the check.**

## What else I checked before saying that

- **Every Confluence page touched since 18 September** — five, none of them Global Search:
  Work Orders Board/Tech View draft · Run log · Review Decisions and Open Questions ·
  Maintenance Reminders V1 · Product Updates & Upcoming Features.
- **The ranking story SV-9165's own history** — one change since the 18th, a link added to
  SV-10277 on 20 September. No description edit, no new requirement.

**Note on the text length:** today's extract is 26,752 characters against 27,139 on 21 September.
That is the *extractor*, not the page — the 21 September pass used a flattener that duplicated some
link and status nodes, which is recorded in that day's reconciliation. Same version, same content.

## So the question becomes: can it be proved this time?

Yesterday it could not, and the reason was mine to state plainly: the fixtures were **customers**,
and **no customer record on this branch carries a last-updated date anywhere readable** — so
*"the rule is ignored"* and *"there is no date for the rule to read"* looked identical.

**A better fixture exists now.** Two **jobs** for the same customer and vehicle at the same shop,
created seconds apart, are equal on every scored signal — the recency term decays with a fortnight
half-life, so seconds apart is a **genuine tie**. And jobs demonstrably carry an update time,
because their own recency is a scored signal. That is exactly what was missing.

The measurement: create the pair, read the order, then change the older one and read again. If the
rule is applied the older one climbs above the newer. If it does not move, the finding has no hole
left in it.
