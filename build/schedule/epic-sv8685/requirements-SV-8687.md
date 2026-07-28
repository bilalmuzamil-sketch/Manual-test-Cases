# SV-8687 — Work Order Sidebar & Mini Calendar

- **Key:** SV-8687
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8687

## Description

## Summary

Provides the left panel where managers browse, search, and filter work orders, drill into individual lines, and drag items onto the schedule grid — the primary entry point for scheduling work.

## Context

The sidebar sits to the left of the schedule grid. Work orders are displayed as a flat, scrollable card list. Only approved work order lines appear in the line drill-down. The sidebar collapses on narrow viewports.

## Requirements

- Mini calendar with month/year picker, collapsible grid, week-highlight on hover, today indicator, and selected-date highlight. Clicking a date navigates the main grid. — ( PRD: §3.1, §5.2 )

- Work order card list: flat, scrollable, searchable, filterable. Each card shows WO number (accent color, top left), line count + hours (top right), customer name (bold), unit number, lead tech row (avatar + name), and colored left border for status. — ( PRD: §3.1 )

- Sidebar search ("Search work orders") matches against WO number, customer name, unit number, and technician name. Real-time filtering as the user types. — ( PRD: §3.1 )

- Clicking a WO card replaces the list in-place with that order's lines. Includes back control, WO id + line count, line search box, "All / Unscheduled" filter chips with counts. — ( PRD: §3.1 )

- Only approved work order lines are visible in the sidebar; unapproved lines do not appear. — ( PRD: §3.1 )

- Each line row is independently draggable (drag handle) and shows title, estimated hours, and technician roster (avatar stack + count, no cap). Lines with no technician show a "Needs techs" badge. — ( PRD: §3.1 )

- Line search matches against line title/name only. — ( PRD: §3.1 )

- Filters live behind a "Filter" button with active-count badge. Filter groups: Assignment (Assigned/Unassigned), Status (all WO statuses), Priority (High/Medium/Low). "Clear all" resets. Search and filter work together. — ( PRD: §5.1 )

- WO list virtualizes at 50+ items; line drill-down virtualizes for orders with many lines. — ( PRD: §11 )

- Sidebar requires Work Orders: View permission to populate. If WO: View is OFF, the WO list and line drill-down are hidden (mini calendar remains). — ( PRD: §14.2 )

## Acceptance Criteria

- Given the sidebar loads, when there are work orders in the system, then WO cards display with all specified fields (WO number, customer, unit, line count, hours, lead tech, status border).

- Given the user types "TRK" in sidebar search, when a WO has unit number "TRK-101", then that card is shown and non-matching cards are hidden.

- Given the user clicks a WO card, when the WO has 3 approved and 1 unapproved line, then the drill-down shows only 3 lines.

- Given a line with no technician assigned, when viewed in the drill-down, then a "Needs techs" badge is visible.

- Given the user clicks "Unscheduled" filter chip in drill-down, when 2 of 5 lines have no shifts, then only those 2 lines are shown with the count badge showing "2".

- Given 100+ work orders, when the list renders, then virtualization keeps scroll performance smooth.

- Given a user with Schedule: View but no Work Orders: View, when they open the schedule, then the sidebar shows the mini calendar but no WO list.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
