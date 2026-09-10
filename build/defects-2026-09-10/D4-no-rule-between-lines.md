# D4 — HELD, ready to file on his word

| Field | Value |
|---|---|
| `issuetype` | `Story Defect` |
| `parent` | **SV-9386** (Story 3, Print Layout — Line Items) |
| `priority` | `Medium` |
| link | `relates to` SV-9386 |
| Cases | C45105 |

**Summary:** The printed work order draws no rule between one job line's block and the next

**Description**

*What happens*

On the printed page each job line's block is followed by a blank band about three text rows deep — the
writing space the requirement asks for, and it is correct. But **no rule is drawn at that boundary**.
Measured across the whole printed page, on every row and every cell, top edge and bottom: the only
heavy rule on the page is the 2px one under the column headings, and the only other rules are the
1px hairlines **inside** a block, between a line and its labor, tech-story and parts rows. So the
divisions within a block are drawn and the division between blocks is not — the opposite of what the
requirement asks for.

*What should happen — from the specification, read live on 2026-09-10 (Confluence page 519176194,
"Printer Friendly Work Orders")*

- **S3-R7:** "Each work order line group (main line + its sub-rows for tech story, labor, parts, inspections) will be visually separated from the next line by a thick border and blank space below, giving technicians room to write notes per line"
- Change Log 2026-04-19: "Visual separation between WO lines | Thick border + blank note space between line groups; lighter borders on sub-rows"

The lighter sub-row rules shipped; the thick border between groups did not.

*Steps to reproduce*

1. Open a work order with three or more lines.
2. Three-dots menu on the work order's toolbar → Print Work Order.
3. Look at the join between one line's block and the next.

*Result:* blank space, no rule.
*Expected:* a heavy rule across the full width at the end of each block, above the blank writing band.

*Environment:* Staging, build v26.36.2-617d8d1, 2026-09-10.

*Instrument note:* the measurement was taken on the printed page itself, and the same reader found the
2px heading rule and 83 other ruled elements on the page — so it does see rules where there are any.
