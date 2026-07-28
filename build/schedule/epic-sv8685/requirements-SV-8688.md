# SV-8688 — Drag-and-Drop Scheduling & Shift Creation

- **Key:** SV-8688
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8688

## Description

## Summary

Enables the primary scheduling interaction — dragging work order cards or individual lines from the sidebar and dropping them onto a technician × day/time cell to create shifts, including the shift start-time hierarchy and unassigned shift behavior.

## Context

The grid and sidebar must be in place. Dropping creates a shift entity. The scope picker handles multi-line WOs. The spread step handles large jobs that exceed daily capacity.

## Requirements

- Users drag a WO card or individual line from the sidebar and drop it onto a technician × day/time cell. — ( PRD: §4.1 )

- Single-line WO: creates a shift immediately, skipping the scope picker. — ( PRD: §4.1 )

- Multi-line WO: opens the scope picker. — ( PRD: §4.1 )

- Specific line drag from drill-down: creates a single-line shift directly. — ( PRD: §4.1 )

- Every shift has a start time from the hierarchy: (1) technician's working hours, (2) shop business hours, (3) default 7:00 AM–7:00 PM. In day view, start time comes from the drop position. — ( PRD: §4.2 )

- Unassigned shifts created by dropping onto the Unassigned placeholder row. They follow the same start-time rules minus technician hours. When later dragged onto a technician row, that tech's hours apply. — ( PRD: §4.2 )

- Scheduling a technician onto a line adds them to that line's labor roster (no cap, no swap flow). — ( PRD: §4.3 )

- Drag feedback: drop-target cells highlight and a ghost block shows line name and hours. — ( PRD: §7 )

- Every create action produces a toast with an Undo option (4–7 seconds, persists while hovered). — ( PRD: §7 )

- Requires Schedule: Edit permission. Without it, drag handles and drop targets are hidden/disabled. — ( PRD: §14.1 )

## Acceptance Criteria

- Given a single-line WO is dragged onto a technician row in week view, when dropped, then a shift is created immediately with the technician's working-hours start time.

- Given a multi-line WO is dragged and dropped, when it lands on a cell, then the scope picker opens (not a direct shift).

- Given a specific line is dragged from the drill-down, when dropped on a technician, then a single-line shift is created and that technician is added to the line's labor roster.

- Given a WO is dropped on the Unassigned row, when no technician hours apply, then the shift start time falls back to business hours or 7:00 AM default.

- Given a shift is created, when the toast appears, then clicking Undo removes the shift.

- Given a user with Schedule: View only (no Edit), when they view the sidebar, then drag handles are not visible and drop targets are disabled.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
