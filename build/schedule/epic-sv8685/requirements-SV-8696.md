# SV-8696 — Events

- **Key:** SV-8696
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8696

## Description

## Summary

Non-work-order time blocks — meetings, training, stand-ups — that occupy technician time and affect capacity calculations, giving managers a complete picture of each technician's day.

## Context

Events are distinct from shifts: different visual styling (white/neutral card vs colored shift block), not conflict-checked against shifts for now, but their time counts toward capacity.

## Requirements

- Create events via left-click on empty grid space, which opens a menu with "Create event" and "New work order". — ( PRD: §4.10 )

- Event modal: name, date, start/end time, all-day toggle, color category. — ( PRD: §4.10 )

- Day view shows a live preview block while creating, with drag-to-resize. — ( PRD: §4.10 )

- Drag-and-drop to reassign events between technicians or move between days. — ( PRD: §4.10 )

- Event card anatomy: white/neutral card with thin even border on all four sides, no colored left rail; small grey-filled rounded chip with calendar icon on left; two lines of text (event name, time range in secondary text). — ( PRD: §4.10 )

- Default event color is neutral/grey. Events use the same custom color palette as shifts. — ( PRD: §4.10 )

- Events are not conflict-checked: overlapping an event with a shift or another event does not raise a conflict. — ( PRD: §4.11 )

- Event hover tooltip: event name (+ grey category dot), date and time range, technician. — ( PRD: §4.13 )

- Events visible/hidden via the "Events" toggle in View Options. — ( PRD: §9 )

## Acceptance Criteria

- Given the user left-clicks on empty grid space, when "Create event" is selected from the menu, then the event modal opens with that cell's date and technician pre-filled.

- Given the user is in day view and clicks empty grid space, when dragging, then a live preview block appears and resizes to match the drag.

- Given an event is created, when rendered on the grid, then it appears as a white bordered card with calendar icon chip, distinct from shift blocks.

- Given an event overlaps a shift on the same technician, when conflict detection runs, then no conflict is raised.

- Given the "Events" toggle is off in View Options, when viewing the grid, then event blocks are hidden.

- Given the user drags an event from Tech A to Tech B, when dropped, then the event is reassigned.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
