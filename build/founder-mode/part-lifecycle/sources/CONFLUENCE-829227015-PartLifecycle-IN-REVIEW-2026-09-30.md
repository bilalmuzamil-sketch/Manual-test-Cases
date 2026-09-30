# Parts Lifecycle Update — source capture

**Confluence page:** 829227015 (space ~Chris Ward) · **Title:** "Parts Lifecycle Update" ·
**PO:** Chris Ward · **Epic:** SV-10647 (FounderMode Part Lifecycle) ·
**🔴 Status: "In review — 2026-09-09" (NOT locked for build)** · **Last modified:** ~2026-09-29/30
(≈12h before capture) · **Design:** artifact Vz6rprcWyP16tYxzM1kdeE · **Read/captured:** 2026-09-30.

> 🔴 **This PRD is IN REVIEW, not locked.** Every case is PROVISIONAL (Rule 49) and carries
> `AUTOMATION: HOLD` naming the in-review status. Re-check the source version before build-verifying
> (Rule 31/32/59); a change to the spec re-opens the affected quotes (Rule 113). Story-level Jira and
> most story designs are marked **TBD** in the PRD.
>
> Verbatim requirement quotes for all 207 anchors (S1-R1 … S13-N3) are in `../anchor-quotes.json`,
> quoted unchanged in each case's "Exact quotes" block (Rule 113).

## Stories (all epic SV-10647) & anchor counts
| Story | Title | Jira | Anchors |
|---|---|---|---|
| S1 | Active / Inactive tabs on the Inventory list | TBD | 8 |
| S2 | Deactivate parts (bulk mode + single) | TBD | 25 |
| S3 | Activate parts | TBD | 6 |
| S4 | Create an untracked part | TBD | 9 |
| S5 | Edit tracking state on an existing part | TBD | 20 |
| S6 | Searching & sorting by tracking state | TBD | 9 |
| S7 | Create a part without selecting a library item | TBD | 14 |
| S8 | Permissions | TBD | 19 |
| S9 | Inactive parts cannot be selected for new work | TBD | 23 |
| S10 | Confirming & recording a status change | TBD | 33 |
| S11 | The Part Library is browse & edit only | TBD | 11 |
| S12 | Rename Catalog to Part Library | TBD | 13 |
| S13 | Edit the part number of an existing part | TBD | 17 |
| **Total** | | | **207** |

## What the feature does (three structural gaps)
1. **Active/Inactive state** — retire a part without deleting it (history preserved); Inactive parts
   drop out of every part lookup (Story 9 — the point of the feature).
2. **Tracked/Untracked state** — untracked parts are line-item references with no bin/quantity/min-max/
   cycle-count; can still carry an optional bin.
3. **Create without the library step** — type Part Number + Name; the library link is find-or-create,
   silent. Standalone library "create" is removed (Story 11); "Catalog" → "Part Library" (Story 12).
   Part number is editable in place, renaming the shared library entry (Story 13).

Bulk status is a **mode** (like Cycle count): actions-menu entry → checkbox column + bulk bar.
Every confirmation is the **standard destructive dialog** (no typed confirmation). Status changes are
recorded in Part History. Status/tracking changes need **Part Library & Inventory — Delete**.

## Out of scope (no cases claiming these; several are deferred PRD-462 items)
Removing untracked parts from WO lines/invoices; untracked-specific reporting; reorder/stockout alerts;
part-library management UI; hard-delete guardrails (PRD 462 FR-032..035); CSV status-column mapping
(FR-043..049); an "All" tab (FR-012); global search bar (returns library entries, no active/inactive);
inventory filters by vendor/category/qty/zero-qty (FR-040/041).

## Open questions in the PRD (flagged, not resolved)
- **Should Part Number stay mandatory?** (Story 7 makes it required; insight 168632 wants creation
  before the number exists) — "Decide before build."
- Part-number uniqueness assumption (S7-R9 chooser exists only because production numbers aren't
  unique); shared part-lookup assumption (Story 9 lists 8+ pick surfaces).

## Manual-runnability (Rule 114)
Most cases are UI-driven. The server-enforcement "by any route including a direct call" assertions
(S8-N1/N2/N3) are marked as such in the case: a manual tester verifies the UI-observable refusal; the
pure non-UI route is an automation concern. All HOLD (in review, no QA build).

## Design (Rule 115)
Artifact Vz6rprcWyP16tYxzM1kdeE, 11 boards, driven end-to-end = **CONFIRM** (Inventory Active/Inactive
tabs, bulk bar "N selected / Deactivate", Edit Inventory Part with status pill + "Inventory tracking" /
"Track quantities and cost of goods" toggle + "Not Tracked", New Part Request source line
Inventory/Part Library, Part History "Deactivated | Reason:" events, Catalog→Part Library rename
table). No DIVERGE. Note the PRD labels most story designs "TBD" while the canvas in fact covers them.
