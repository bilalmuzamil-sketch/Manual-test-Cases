# Global Search — deep gap hunt on PERMISSIONS (same care as the algorithm) 2026-09-18

Applying the two lessons from the algorithm work (SV-10211): (1) a test must not be able to PASS FOR THE
WRONG REASON — control everything except the one thing under test; (2) the engine deserves finer
regression cases, especially before Custom Roles stresses it. Cases read live from folder 6734 (16
cases). Spec: PRD 576978945 v1.5 §9 + engineering decision log 2026-08-12.

## The weakness (mirrors the ranking bug)
Our permission cases test "WITH access → see it" and "WITHOUT access → don't" as SEPARATE cases with
DIFFERENT setups. A negative permission case can therefore pass for the wrong reason: the group could be
absent because the record did not exist, did not match the query, or had not finished indexing
(OpenSearch lag) — NOT because permission hid it. Likewise a positive case can pass merely because
"everything shows for everyone."

**The fix — the permission analog of "hold all other signals equal": the SAME-RECORD TOGGLE.** Use ONE
specific seeded record and ONE query; confirm it IS returned for a user WITH the permission; then flip
ONLY that permission (same user or an otherwise-identical role) and confirm the SAME record is now
hidden. This rules out "absent / didn't match / index lag" because the record was returned moments
earlier for the permitted role.

## Control audit of existing cases
| Case | Direction | Has a real control? |
|---|---|---|
| C44877 WITH Parts sees Parts | positive | pairs with C44878 but no built-in negative control |
| C44878 WITHOUT Parts | negative | YES — "verified visible to a Parts-enabled user" |
| C44879 WITHOUT Work Orders | negative | WEAK — says WOs exist, not that they are visible to a WO-enabled user |
| C44880 tenant isolation | negative | WEAK — no proof the other-tenant record matches the query |
| C44882 bundle sweep | negative | WEAK — no positive control that each hidden group WOULD show for a permitted role; counts asserted only for the hidden side |
| C55702–05 WITH each bundle | positive | say "not wrongly hidden" but no built-in negative control |
| C55706 prices shown WITH finance | positive | no negative control (pairs with C44882 masking) |
| C55717 recent-list access | negative | OK — record was in recent when permitted, then access removed (built-in control) |
| C55718–19, C55721 (edges) | negative | YES — each names the permitted-user comparison |
| C55720 multi-bundle | negative | PARTIAL — visible groups checked, hidden-would-show not |

## Proposed NEW strict cases (same-record toggle + count precision) — 7
All new (do not edit existing), folder 6734, atm=1 type=2, added to run 415, not-yet-build-verified.
| # | Case | The one thing toggled |
|---|---|---|
| PC-1 | Same part, flip ONLY Catalog & Inventory access → visible then hidden | Parts view |
| PC-2 | Same work order, flip ONLY Work Orders access → visible then hidden | Work Orders view |
| PC-3 | Same customer AND its vehicle, flip ONLY Customers access → both visible then both hidden | Customers view (Customers+Assets) |
| PC-4 | Same part sale, flip ONLY Part Sales access → visible then hidden | Part Sales view |
| PC-5 | Same vendor + its purchase order + its vendor invoice, flip ONLY Vendor & Order Management access → all three visible then all three hidden | Vendor & Order Mgmt view (3 types) |
| PC-6 | Same priced row, flip ONLY See Financial Data → real price shown then masked | See Financial Data |
| PC-7 | Count precision: a restricted record does not inflate or leak into any VISIBLE group's count; visible counts equal exactly what the user may see | count integrity |

Each PC-1..PC-6 asserts BOTH directions on the SAME record with only the one permission changed, so it
can pass only if permission itself is doing the work. PC-7 guards the count path (a hidden record must
not still be counted).

## Recommendation
Create PC-1..PC-7 (7 cases) alongside the existing 16, add to run 415, hand off with seeding. This gives
permissions the same "cannot pass for the wrong reason" strength the algorithm cases now have — important
before Custom Roles ships.
