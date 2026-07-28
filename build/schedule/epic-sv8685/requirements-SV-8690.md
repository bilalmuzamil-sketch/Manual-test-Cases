# SV-8690 — Shift Block Anatomy & Scope Labeling

- **Key:** SV-8690
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8690

## Description

## Summary

Defines how shift blocks render on the grid — a consistent three-line (optionally four-line) card format with default blue color, so managers can visually scan the schedule and understand assignments at a glance.

## Context

Shift blocks are the visual output of scheduling. They appear in all three views (day, week, month). Color customization is managed in the View Options & Color System story.

## Requirements

- Every shift block shows three lines: Line 1 = customer name (plus conflict icon if conflicted), Line 2 = unit number, Last line = line name for single-line shift or "N Lines" for multi-line/whole-order shifts. — ( PRD: §4.4 )

- Optional Line 3: VIN number, visible only when VIN toggle is on. Day and week views only; month view omits due to space. — ( PRD: §4.4 )

- All shift blocks use the default blue color. Users can optionally assign a custom color per shift via the color picker in the detail modal. — ( PRD: §10 )

- No work order number and no scope icons on the block. The conflict icon is the only icon. — ( PRD: §4.4 )

- Whole-order and multi-line-subset shifts both read as "N Lines" on the block. Detail modal spells out exact scope. — ( PRD: §4.4 )

## Acceptance Criteria

- Given a single-line shift on the grid, when rendered, then it shows customer name, unit number, and the line name on three lines.

- Given a whole-order shift covering 5 lines, when rendered, then the last line reads "5 Lines".

- Given VIN toggle is off, when viewing a shift block in week view, then no VIN line appears.

- Given VIN toggle is on, when viewing a shift block in month view, then VIN is still omitted.

- Given a conflicted shift, when rendered, then a conflict icon appears on Line 1 next to the customer name.

- Given a shift with no custom color set, when rendered, then it uses the default blue color.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
