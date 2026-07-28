# SV-8697 — Conflict Detection

- **Key:** SV-8697
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8697

## Description

## Summary

The system continuously scans for scheduling issues — double-bookings, weekend assignments, before/after-hours shifts — and surfaces them in a toolbar pill with a detail dropdown, so managers can spot and resolve problems immediately.

## Context

Conflict detection runs on all shifts in the grid. Events are excluded. Conflicted shifts show a warning icon on the block and a conflict banner in the detail modal.

## Requirements

- Conflict types: Double-booked (two WOs overlap on same tech at same time), Weekend shift, Before hours, After hours. — ( PRD: §4.11 )

- Conflicts appear as a warning icon on the affected block. — ( PRD: §4.11 )

- Toolbar conflict pill shows the issue count. Clicking opens a dropdown listing all conflicts. — ( PRD: §4.11 )

- Clicking a conflict in the dropdown navigates to the relevant technician and day. — ( PRD: §4.11 )

- Red and alarming styling reserved for conflicts and genuine errors, never for overtime. — ( PRD: §4.11 )

- Events are not conflict-checked. — ( PRD: §4.11 )

## Acceptance Criteria

- Given Tech A has two shifts at overlapping times (8am–12pm WO-1 and 10am–2pm WO-2), when rendered, then both blocks show a conflict warning icon and the toolbar pill shows "2".

- Given a shift is scheduled on Saturday, when conflict detection runs, then a "Weekend shift" conflict is flagged.

- Given a shift starts at 5:00 AM and the tech's hours start at 7:00 AM, when detected, then a "Before hours" conflict appears.

- Given the user clicks the conflict pill, when the dropdown opens, then conflicts are listed with type, technician, and date.

- Given the user clicks a conflict entry, when navigating, then the grid scrolls to that technician's row on the relevant day.

- Given an event overlaps a shift, when conflict detection runs, then no conflict is raised for the event.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
