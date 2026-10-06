# Review Decisions and Open Questions — Chunk three — verbatim source copy

- Confluence page 891944985, lastModified Sep 25, 2026, read 2026-10-06 via Atlassian MCP (markdown).
- Older review history: where this page and the Chunk 1 MR page (886931488) differ, the chunk page is right.

---

# Review Decisions and Open Questions: Chunk three — Customers: the Maintenance Reminders worklist

Every item raised and every decision taken about this feature in review — live design reviews and AI pre-reviews alike — collected here and updated after each one, most recently  from R1. Read it to see what is still open before the next review; nothing is ever deleted, and it approves nothing.

🧑 marks an item the design authority raised himself; other rows say who raised it and whether he took it up. A tier marked *proposed* was assigned by the review tool and stands until he confirms or changes it. Each item links the review that raised it and any later review that returned to it; meeting notes are visible to the PM team.

## Reviews

| # | Date | Covered | Meeting note |
| --- | --- | --- | --- |
| **R1** |  | the chunk three worklist: filters, header, money figures, status and work order columns, row actions, confidence and the invoice shortcut | no shared note link on record |

## Must fix before release (4)

| # | Item | Raised | Referenced in | Status | Log |
| --- | --- | --- | --- | --- | --- |
| **MF-1** | **The worklist header drops the assets-across-customers indicator, the schedules link and the new-customer action.**The new-customer call to action belongs to the customers step, not here. The design authority removed the enrolled-assets indicator and the link back to schedules, which would need a permission rule; schedules stay reachable from admin. | [R1 · 2026-09-25](#Reviews) (t0719, t0721, t0724, t0730)the owning PM, taken up by the design authority | — | MUST FIX · PROPOSEDCONFIRMED BY THE DESIGN AUTHORITYSettled by **DR-2** | Added 2026-09-25 |
| **MF-2** | **The worklist drops its Status column; the work order status shows as a badge beside the work order.**The design authority could not tell what the status column meant when most rows have no work order. Decided with the user proxy: widen the work order column, show the status badge next to the number, and drop status as its own column. | [R1 · 2026-09-25](#Reviews) (t0767, t0774, t0775, t0776)🧑 the design authority | — | MUST FIX · PROPOSEDCONFIRMED BY THE DESIGN AUTHORITYSettled by **DR-4** | Added 2026-09-25 |
| **MF-3** | **Worklist rows need a more-actions menu beside contact and create estimate.**Rows are not clickable, and actions such as skip or already done had disappeared. The design authority asked for a three-dot menu in the action column. | [R1 · 2026-09-25](#Reviews) (t0784, t0790, t0791, t0793, t0794, t0797)🧑 the design authority | — | MUST FIX · PROPOSEDCONFIRMED BY THE DESIGN AUTHORITYSettled by **DR-5** | Added 2026-09-25 |
| **MF-4** | **Each worklist row needs its confidence level.**The rows open nothing, so confidence is otherwise invisible from this list. Placement was floated between the work order and due columns. | [R1 · 2026-09-25](#Reviews) (t0806, t0807, t0808, t0809, t0811, t0813)🧑 the design authority | — | MUST FIX · PROPOSEDCONFIRMED BY THE DESIGN AUTHORITYSettled by **DR-6** | Added 2026-09-25 |

## Fast follow (0)

*Nothing here.* 

## Deferred (2)

| # | Item | Raised | Referenced in | Status | Log |
| --- | --- | --- | --- | --- | --- |
| **DF-1** | **No customer or status filters on the worklist in this version; the table sorts.**The owning PM proposed customer and status filters. They would force the tile figures to recompute, and nothing unreviewed goes into Monday's handoff; the summary cards and column sort stay. | [R1 · 2026-09-25](#Reviews) (t0704, t0705, t0706, t0707, t0708, t0710, t0711, t0712, t0713)the owning PM, taken up by the design authority | — | DEFERRED · PROPOSEDCONFIRMED BY THE DESIGN AUTHORITYSettled by **DR-1***Reason:* filters would force the tile figures to recompute, and they were not reviewed before handoff *Returns when:* when users ask for them | Added 2026-09-25 |
| **DF-2** | **No money figures on the worklist in this version.**The user proxy liked the money if accurate. The design authority said an accurate figure must account for customer and default labour rates, tax, fees and discounts, and that a per-row figure has the same problem; he removed the numbers until existing money calculations are more reliable. | [R1 · 2026-09-25](#Reviews) (t0732, t0734, t0735, t0736, t0737, t0739, t0745, t0748, t0752, t0755)the owning PM, taken up by the design authority | — | DEFERRED · PROPOSEDCONFIRMED BY THE DESIGN AUTHORITYSettled by **DR-3***Reason:* the figure would ignore labour rates, tax, fees and discounts and could mislead *Returns when:* when the product's existing money calculations are reliable | Added 2026-09-25 |

## Open questions (1)

| # | Item | Raised | Referenced in | Status | Log |
| --- | --- | --- | --- | --- | --- |
| **OQ-1** | **Should a completed but uninvoiced row offer an Invoice button that opens invoice creation?**The owning PM showed an Invoice action on rows whose work order is complete, so the counter resets without waiting on paperwork. The user proxy welcomed it after the design authority had left. | [R1 · 2026-09-25](#Reviews) (t0816, t0817, t0846, t0850, t0855, t0857)proposed by the owning PM — the design authority's assent is not on record | — | Decider: the design authority | Added 2026-09-25 |

## Decided in review (6)

Decisions taken by the design authority in live review, paraphrased. Standing until superseded here; a superseded decision stays on the list, marked.

| # | Decision | Decided | Resolves | Status |
| --- | --- | --- | --- | --- |
| **DR-1** | **The worklist keeps its summary cards and column sort; no customer or status filters.***Why:* filters force the tile figures to recompute and were not reviewed*Rejected:* customer and status filters | [R1 · 2026-09-25](#Reviews) (t0708, t0711, t0713) · decided | **DF-1** | STANDING |
| **DR-2** | **The worklist header drops the assets-across-customers indicator, the schedules link and the new-customer action.***Why:* the link would need its own permission rule; schedules stay in admin*Rejected:* none recorded | [R1 · 2026-09-25](#Reviews) (t0719, t0730) · decided | **MF-1** | STANDING |
| **DR-3** | **No money on the worklist tiles or rows in this version.***Why:* an accurate figure needs labour rates, tax, fees and discounts*Rejected:* a per-row figure instead of a sum | [R1 · 2026-09-25](#Reviews) (t0737, t0745, t0755) · decided | **DF-2** | STANDING |
| **DR-4** | **Status is dropped as a column; the work order status shows as a badge beside the work order number.***Why:* a status column is unclear when most rows have no work order*Rejected:* a separate status column | [R1 · 2026-09-25](#Reviews) (t0774, t0775, t0776) · decided | **MF-2** | STANDING |
| **DR-5** | **Worklist rows carry contact, create estimate and a three-dot menu for the other actions.***Why:* rows open nothing, so the menu is the only way to other actions*Rejected:* none recorded | [R1 · 2026-09-25](#Reviews) (t0791, t0793, t0797) · decided | **MF-3** | STANDING |
| **DR-6** | **Each worklist row shows its confidence.***Why:* the rows open nothing, so confidence would otherwise be invisible*Rejected:* none recorded | [R1 · 2026-09-25](#Reviews) (t0807, t0808) · decided | **MF-4** | STANDING |

## Resolved (0)

*Nothing resolved yet.* Resolved items stay here as the record that a raise was worth making.

## Change log

Append-only, one row per run of either skill, oldest first. Together with the run log below it reconstructs the page at any point.

| Run | By | Kind | Review | Scope of the pass | Added | Updated | Resolved | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | the owning PM | live review | [R1](#Reviews) | the chunk three worklist: filters, header, money figures, status and work order columns, row actions, confidence and the invoice shortcut | 7 | 0 | 0 | page created; no model pre-review exists on this spec. Review of 2026-09-25; 7 items; 6 decisions |

## Run log

The machine-readable run log for this page lives on its child page **Run log** — do not edit it. Both review skills read and extend it there.
