# Global Search — per-tab coverage of the match-quality ranking rule (SV-10279) 2026-09-20

SV-10279 (Story Defect under SV-9164, status Open, 2026-09-20): the "a name that BEGINS with the typed
text ranks above one that merely contains it" rule (§6.1: prefix +0.70 > whole-word +0.50) works on the
**Customers, Vendors and Assets** tabs but is BROKEN on the **Parts** tab. Same algorithm, implemented
per entity, broken on one entity while fine on the others.

## Why our current tests would NOT catch this
The prefix-beats-contains rule is concretely tested for ONE tab only:
- **C55724** — strict prefix > whole-word, all other signals equal — seeded on **CUSTOMERS**, run on the
  Customers tab.
- **C55707** — same rule but "three records of the SAME entity type", not pinned to any tab — a tester
  can (and did) satisfy it on Customers and never touch Parts.
So a Parts-only regression like SV-10279 passes our suite: nothing forces the prefix rule to be proven
on the Parts, Vendors or Assets tab.

## Per-tab status of the search algorithm
| Tab | Ranked by name (prefix rule applies)? | Do we have a per-tab prefix test? |
|---|---|---|
| Customers | yes | YES — C55724 |
| Vendors | yes | **NO** |
| Assets | yes | **NO** |
| Parts | yes (§4: description is the name) | **NO** — this is the SV-10279 blind spot |
| All | ordering = group order + within-group + pinned top | C44827/C44830/C44851/C44850/C55729 |
| Work orders | exact number | C44843 (number), C44844 (VIN) |
| Part sales | exact number | C44849 (P-number) |
| Purchase orders | exact number | C55714 (PO number) |
| Vendor invoices | exact number | C55714 (invoice number) |

The identifier tabs are covered (exact-number match). The gap is the three NAME tabs with no dedicated
prefix-ranking test: **Parts, Vendors, Assets.**

## Recommendation
Add a per-tab prefix-ranking case for **Parts, Vendors and Assets**, each in the strict all-signals-equal
shape of C55724 (three records identical except match type; open that entity's tab; begins-with ranks
first, contains second, typo last). The Parts one is the direct regression test for SV-10279. 3 new
cases → Ranking and Prioritization (6726), run 415. Customers already covered by C55724.
