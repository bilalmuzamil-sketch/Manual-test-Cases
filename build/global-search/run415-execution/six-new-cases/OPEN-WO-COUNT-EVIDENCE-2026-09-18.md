# Measured: which work-order statuses count towards a customer's "open" badge and ranking lift

**For the build-verification lane's `OPEN-QUESTION-location-scope-2026-09-18.md`, Instance 3**
(*what counts as "open" for the badge — the PRD never lists the statuses*). This does not answer the
product-owner question, but it removes guesswork about what the build actually does today.

Branch `sv9160`, build `v26.36.7-29ca209`, 18 September 2026. Measured on the C55722 pair, which is
two customers identical apart from their work orders.

| Status the work orders were in | Badge / `openWorkOrderCount` | Ranking effect |
|---|---|---|
| **Estimate** (the state a newly created work order is born in) | not counted | seeding lane measured it: five estimates ranked BELOW one in-progress, so no lift |
| **In progress** | **counted** | with 5 vs 1, the busier customer ranks first |
| **Complete** | **not counted** — the badge fell from 5 to **0** | score fell by **exactly 0.20**, and the order flipped |

So on this build the badge and the ranking signal agree with each other, and both agree with §6.1's
*"Open/active status (Approved, In Progress, Review)"* at the two ends we have measured: an
**Estimate is not open** and a **Complete is not open**. **Approved and Review are not yet measured**,
and neither is Invoiced or Paid.

**The 0.20 fall is itself a useful confirmation:** §6.1 gives a customer **+0.20** for having at least
one open work order, and that is exactly what disappeared when the last open one closed.

**⚠️ `Complete` is terminal** — `POST /api/work-orders/change-status` refuses to move a completed work
order (`400 "Complete work order cannot change its status again."`). Anyone repeating this measurement
must plan the rebuild first; the five work orders used here had to be recreated and
`seeding/seed-ids-ranking-qa.json` updated (learning L0166).
