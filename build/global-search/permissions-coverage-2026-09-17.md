# Global Search — permissions coverage check (2026-09-17)

**Question (QA lead):** "Have we covered the permissions related tests? I do not want to get a
regression complaint that a user WITH a permission to do something is not able to see the same thing
in the search results."

So the concern is the **POSITIVE direction**: a user who HAS a permission must still SEE that entity
type / price in search results. A regression that wrongly hides something from a permitted user.

## Sources (read live 2026-09-17)
- PRD **576978945 v1.5** (unchanged since 2026-09-08), **§9**: *"All result fields must respect
  existing tenant-isolation and role-based-access checks — a technician without Parts access does not
  see Parts results, and the same applies to Purchase Orders and Vendor Invoices, which are
  finance-adjacent and more likely to be restricted."* The PRD spells out the NEGATIVE direction by
  example; the POSITIVE direction ("a permitted user does see it") is the base behaviour of the whole
  search, asserted implicitly.
- Permissions folder **6734** (6 cases, all read live 2026-09-17), + engineering comment
  (bundle→entity mapping, "See Financial Data" gates prices inside rows).

## The bundle → entity map (from C44882 / spec, the surface being gated)
| Permission bundle | Entity types it gates |
|---|---|
| Work Orders: View | Work Orders |
| Part Sales: View | Part Sales |
| Customers: View | Customers **and** Assets |
| Catalog & Inventory: View | Parts |
| Vendor & Order Management: View | Vendors, Purchase Orders **and** Vendor Invoices |
| See Financial Data | prices inside every row (part price, part-sale total, WO total, PO total, VI total) |

## What the 6 cases cover
| C-id | Title | Direction | Entity/bundle |
|---|---|---|---|
| C44877 | A user WITH Parts access sees Parts results | **POSITIVE** | Parts (Catalog & Inventory) |
| C44878 | A technician WITHOUT Parts access does NOT see Parts | negative | Parts |
| C44879 | A user WITHOUT Work Orders access does NOT see WO | negative | Work Orders |
| C44880 | Results limited to the signed-in user's own tenant | isolation | (tenant, not role) |
| C44881 | Entity type with no accessible records shows no group | empty-state | (any) |
| C44882 | Permission bundles hide whole groups/counts/tabs; prices masked without financial access | negative (all bundles) + price MASK | all 8 entities + See Financial Data |

## Verdict — the gap the QA lead is worried about IS partly open
- **NEGATIVE direction ("can't see what they shouldn't") — well covered.** C44878, C44879 and the
  bundle sweep C44882 exercise every one of the six gates in the hide direction.
- **POSITIVE direction ("a permitted user DOES see it") — explicitly covered for Parts only (C44877).**
  For **Work Orders, Customers, Assets, Part Sales, Vendors, Purchase Orders, Vendor Invoices** the
  positive direction is only *implicitly* covered by the general functional suite (Scope Tabs 6722,
  Grouped Results 6723, Per-Entity Shape 6724), which is run as a **fully-permissioned** user and does
  not vary the role. No dedicated "role that HAS bundle X still sees group X" case exists for those
  seven types. A regression where a bundle wrongly hides a group from permitted users would not be
  caught by a role-varying test for those types.
- **C44882 partial positive:** each role in C44882 is missing exactly ONE bundle, so the other groups
  SHOULD appear — but the case's steps assert only that the *hidden* group is hidden; they do not
  assert the remaining groups still show for that role. C44878/C44879 do say "results the user CAN
  access still appear normally," which is a general positive assertion but not per-bundle.
- **"See Financial Data" POSITIVE (prices SHOWN when you have it) — not covered by a dedicated case.**
  C44882 tests only the masked direction (prices hidden WITHOUT the permission). Price *display* WITH
  the permission is only implicit in the shape tests.

## Recommendation (needs go-ahead — no case written yet)
Add positive-direction permission cases so a "permitted user can't see it" regression is caught
directly:
1. One positive case per gated group for the six not yet covered positively — Work Orders, Customers
   (+Assets), Part Sales, Vendors (+Purchase Orders +Vendor Invoices) — mirroring C44877's shape
   ("a role WITH bundle X sees group X, its count and its scope tab"). Could be compacted into one
   multi-role case like C44882's negative sweep, run in the SEE direction.
2. One positive "See Financial Data" case: a role WITH financial access sees real prices in every
   priced row (the inverse of C44882 point 3).
All would be atm=1, type=2 (Functional), sourced to SV-9160 + PRD §9, added to the Global Search run.

No cases changed or created — recorded for the QA lead's decision.
