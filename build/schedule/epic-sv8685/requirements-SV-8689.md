# SV-8689 — Scope Picker

- **Key:** SV-8689
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8689

## Description

## Summary

When a multi-line work order is dropped onto the grid, a popover lets the manager choose exactly what to schedule — the whole order, a single line (fast tap), or a custom selection of lines — keeping scheduling fast for common cases and flexible for complex ones.

## Context

Triggered when a multi-line WO is dropped. After scope is chosen, if the scope fits within one working day it creates a shift; if it exceeds daily capacity, it opens the spread step.

## Requirements

- Popover anchored to the drop cell. — ( PRD: §4.3 )

- "Schedule whole work order" pinned at top, visually distinct, labeled with line count and total hours. Assigns the technician to all lines and creates one whole-order shift. — ( PRD: §4.3 )

- Individual line rows: tapping a row immediately creates a single-line shift (fast path, no confirmation). Each row shows line title, estimated hours, and current technician roster (avatar stack + count). — ( PRD: §4.3 )

- "Select multiple" opt-in control switches rows into checkboxes with a confirm bar showing running tally ("Create shift · 2 lines · 6h"), "Select all" shortcut, and Cancel. — ( PRD: §4.3 )

- No technician cap and no swap flow. — ( PRD: §4.3 )

- The spread step is conditional: a scope that fits within one working day skips it and creates a single shift. — ( PRD: §4.1 )

## Acceptance Criteria

- Given a 5-line WO is dropped on a technician cell, when the scope picker opens, then "Schedule whole work order" appears at top showing "5 lines · 24h".

- Given the scope picker is open, when the user taps a single line row, then a shift is created immediately for that line only.

- Given the user clicks "Select multiple", when they check 2 lines, then the confirm bar shows "Create shift · 2 lines · 8h" and a "Select all" shortcut.

- Given the selected scope totals 4h and the tech has 8h daily capacity, when confirmed, then a single shift is created (spread step skipped).

- Given the selected scope totals 40h and the tech has 8h daily capacity, when confirmed, then the spread step opens.

- Given Cancel is clicked in multi-select mode, when returning, then the fast single-tap line list is restored.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
