# Is any Global Search check missing from run 415? — checked 2026-09-21

QA lead: *"find any other test cases which have not been run. Make sure that nothing bites me."*

A check that is **not in the run** is the one gap nobody can see: it cannot show up as unrun, because
it is not there at all. So the question is not *"what in the run is unrun"* but *"what exists in
TestRail and never reached the run"*.

## Method
1. Every case **we** authored across the estate (`created_by = 3`), paged: **2,912**.
2. Every test in run 415, paged: **203**.
3. **Every section under the Global Search group (6720)**, enumerated by walking section ids and
   keeping those whose parent is 6720 — not inferred from what the run already covers, which would
   have hidden an entirely uncovered section.
4. For each of those sections, our cases diffed against the run.

## Answer: nothing is missing — **0**

| Section | Our cases | Not in run 415 |
|---|---|---|
| 6721 Palette Open, Close and Keyboard | 10 | **0** |
| 6722 Scope Tabs | 12 | **0** |
| 6723 Grouped Results and Counts | 9 | **0** |
| 6724 Per-Entity Result Shape | 9 | **0** |
| 6725 Fuzzy Matching | 18 | **0** |
| 6726 Ranking and Prioritization | 23 | **0** |
| 6727 Empty and First-Time State | 2 | **0** |
| 6728 Recent Activity Default State | 5 | **0** |
| 6729 Persisting Query | 3 | **0** |
| 6730 No-Results State | 2 | **0** |
| 6732 In-Page Work Orders List Search | 2 | **0** |
| 6733 Error State | 1 | **0** |
| 6734 Permissions and Role-Based Scoping | 23 | **0** |
| 6737 Page-Search Cutover (v2) | 2 | **0** |
| 6738 Mobile Global Search (v2) | 6 | **0** |
| 6739 Purchase Orders Entity (v2) | 1 | **0** |
| 6740 Vendor Invoices Entity (v2) | 1 | **0** |
| 6767 Out of V1 Scope | 1 | **0** |
| 6769 V1 Regression Suite | 64 | **0** |
| 6774 Quick Actions on Hover (v1) | 8 | **0** |
| 8056 V1 Regression (derived) | 1 | **0** |
| 6720 · 6731 Hover Quick-Actions · 6736 Contacts Entity (v2) · 6768 Search Telemetry | 0 | **0** — the sections are empty |

**25 sections under the group. Every one is either fully in the run or holds no cases.**

Also checked: **0 tests in run 415 were authored by anyone else**, so nothing foreign is sitting in
our run either (Rule 38).

## What is NOT covered by this answer, stated plainly
The same sweep found **our** cases in other projects' sections that are not in run 415 — and that is
correct, because run 415 is the Global Search run and those belong to other projects with their own
runs (Rule 47):

| Section | Project | Our cases not in run 415 |
|---|---|---|
| 6771 Inline Add and Edit Parts — Bin Allocation | Inline Add and Edit Parts (6597) | 22 |
| 6760 Inline Add and Edit Parts — Unsaved Data | Inline Add and Edit Parts (6597) | 15 |
| 6741–6745, 6750, 6770 | Invoice UI Refresh (6559) | 36 |
| 6765, 6766 | Printer Friendly Work Orders (6617) | 11 |

**Whether those projects' own runs are complete has not been checked and was not asked for.** Raised
so the QA lead knows the boundary of this answer rather than assuming it covers everything.

## Run 415 as it stands
**177 passed · 14 failed · 8 blocked · 3 awaiting retest · 1 not run**, and every one of the 203 is
accounted for by a named story, ticket or decision.
