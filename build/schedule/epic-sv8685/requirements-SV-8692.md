# SV-8692 — Linked Series & Banners

- **Key:** SV-8692
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8692

## Description

## Summary

Shifts created by the spread step form a visual "linked series" — rendering as connected banners across days and weeks so managers can see at a glance that a multi-day job spans a range, with series-aware deletion for flexible editing.

## Context

Series are created by the Multi-Day Spread Scheduling story. A series is a render-time grouping over ordinary daily shifts (each keeping its own day and hours). Capacity, overtime, and conflict logic operate on individual shifts unchanged.

## Requirements

- Shifts sharing a technician + seriesId render as one connected banner. — ( PRD: §4.6 )

- Month view: continuous bar wrapping across week rows, labeled once at start (with technician), faded "continues" on later weeks, empty weekend columns (when business hours not set for weekends). — ( PRD: §4.6 )

- Week view: one banner spanning working days, chevrons at edges indicating continuation, "week N of M" cue. Weekends excluded only when no business hours set for them. — ( PRD: §4.6 )

- Day view: single time-positioned block with "part of an M-week job" cue. — ( PRD: §4.6 )

- Series-aware deletion with scoped options: "This shift only" (removes that day, series keeps the gap), "This and everything after" (removes from clicked onward), "The whole series" (removes all). — ( PRD: §7 )

- Options adapt to position: first shift shows 2 options, last shift shows 2 options, middle shifts show all 3. Each states hours returned. — ( PRD: §7 )

- Series deletion is routine editing — undo toast, not alarming destructive styling. Requires Schedule: Delete permission. — ( PRD: §7 )

## Acceptance Criteria

- Given a 10-shift series in week view, when viewing week 1, then a connected banner spans Mon–Fri with chevrons on the right indicating continuation.

- Given a 3-week series in month view, when rendered, then a continuous bar wraps across week rows with "continues" labels.

- Given the user deletes the middle shift of a 5-day series, when "This shift only" is chosen, then that day is removed and the banner shows a gap.

- Given the user deletes the first shift, when the options appear, then "This and everything after" is equivalent to "The whole series" (2 options shown).

- Given deletion of 3 shifts returning 24h, when the option is shown, then it states "returns 24h".

- Given a user with Edit but no Delete permission, when viewing a series shift, then the delete action is hidden.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
