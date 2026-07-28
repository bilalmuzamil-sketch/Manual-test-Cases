# SV-8699 — Working Hours Settings

- **Key:** SV-8699
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8699

## Description

## Summary

Lets shops define business hours (per location) and technician-specific working hours (per staff member), both using a toggle-based per-day editor with overlap validation — providing the foundation for start-time defaults, conflict detection, and capacity math.

## Context

Working hours feed into the shift start-time hierarchy, spread scheduling, conflict detection, and capacity visualization. Settings are edited in existing Edit Location and Edit Staff Member screens.

## Requirements

- Business hours in Edit Location: behind a toggle ("Set business hours for this shop"), off by default. Per-day editor (Mon–Sun) with From → To ranges. — ( PRD: §4.2 )

- Technician hours in Edit Staff Member: behind a toggle ("Set custom hours for this technician"), off by default. Same per-day editor pattern. Tech with no custom hours inherits shop business hours. — ( PRD: §4.2 )

- Each day starts with a single range. "Add hours" appends more to support split shifts, each removable. Added ranges start empty. — ( PRD: §4.2 )

- Overlap validation: if a day's ranges overlap, the offending range is flagged in red with inline message ("These hours overlap. Adjust the times so they don't conflict.") and Save is disabled. Incomplete rows (empty From/To) ignored by check. — ( PRD: §4.2 )

## Acceptance Criteria

- Given Edit Location, when the toggle "Set business hours for this shop" is off, then the per-day editor is not visible.

- Given the toggle is turned on, when the editor appears, then each day shows one From → To range row.

- Given the user clicks "Add hours" on Monday, when a second range is added, then it starts empty and is removable.

- Given Monday has 7am–12pm and 11am–5pm ranges, when validation runs, then the second range is flagged in red with overlap message and Save is disabled.

- Given Monday has 7am–12pm and an empty second range, when validation runs, then no error is shown and Save is enabled.

- Given a technician with no custom hours and the shop has business hours 8am–5pm, when a shift is created, then the start time defaults to 8:00 AM.

## UI/UX

Business and Tech Hours Settings

## Comments (0)

(none)

## Attachments (0)

(none)
