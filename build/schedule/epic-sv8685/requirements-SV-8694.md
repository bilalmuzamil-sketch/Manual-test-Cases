# SV-8694 — Day View Timeline Interactions

- **Key:** SV-8694
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8694

## Description

## Summary

In day view, shifts are positioned on a 24-hour timeline with precise time interactions — horizontal drag to move, edge-resize to adjust duration, auto-scroll to business hours, sticky headers, and a now-line indicator.

## Context

Day view renders from the Schedule Grid story. This story adds the timeline-specific interactions that don't apply to week/month views.

## Requirements

- Auto-scroll on load and day navigation so the working-day start sits at the left edge (30–60 min buffer). Uses earliest technician start, else business hours, else 7:00 AM. Does not override manual scrolling. — ( PRD: §4.8 )

- Sticky header bar: date and time headers stick to top during vertical scroll. Applies in day and week views. — ( PRD: §4.8 )

- Horizontal drag to move a shift's start time, snapping to 15-minute intervals. — ( PRD: §4.8 )

- Edge resize: drag left or right edge to adjust duration. — ( PRD: §4.8 )

- Now line: vertical indicator showing current time with a label on hover over the grid. — ( PRD: §4.8 )

- Business-hours shading: optional grey overlay outside working hours (controlled by View Options toggle). — ( PRD: §4.8 )

- When VIN toggle is on, lane heights in day view grow to accommodate the additional VIN line. — ( PRD: §4.8 )

## Acceptance Criteria

- Given day view loads with a tech starting at 7:00 AM, when the timeline renders, then it auto-scrolls so 6:30–7:00 AM is at the left edge.

- Given the user scrolls down past 10 technician rows, when scrolling, then time headers remain sticky at the top.

- Given a shift at 8:00 AM, when the user drags it horizontally, then it snaps to 15-minute intervals (8:15, 8:30, etc.).

- Given a 4h shift, when the user drags the right edge, then the duration extends/shrinks and the block resizes accordingly.

- Given the current time is 2:30 PM, when viewing today's day view, then a vertical now-line appears at 2:30 PM with a label on hover over the grid.

- Given Business Hours toggle is on, when viewing day view, then non-working hours have a grey overlay.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
