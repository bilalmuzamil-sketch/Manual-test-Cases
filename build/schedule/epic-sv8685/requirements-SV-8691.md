# SV-8691 — Multi-Day Spread Scheduling

- **Key:** SV-8691
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8691

## Description

## Summary

For large jobs that exceed a technician's daily capacity (engine rebuilds, frame work spanning 40–160+ hours), the spread step distributes hours across consecutive working days automatically, skipping weekends when business hours are not set for them.

## Context

Triggered from the scope picker when the chosen scope exceeds the technician's daily working hours. Creates a linked series of shifts (the Linked Series & Banners story handles series behavior and banners).

## Requirements

- Spread step appears as step 2 of the modal, with a header showing the chosen scope and a "Change scope" back-link. — ( PRD: §4.5 )

- "How much to schedule" selector defaults to Full estimate. Options: Full estimate, 1 week, 2 weeks (apply immediately), Until a date… (reveals finish-by date field), Specific hours… (reveals hours stepper). Progressive disclosure. — ( PRD: §4.5 )

- Start date defaults to the earliest working day. Adjustable to make a second tech's series sequential. — ( PRD: §4.5 )

- Uses the technician's own working hours. Automatically skips weekends when business hours are not set for them. Shop closures and public holidays are not skipped in V1. End date is emergent. — ( PRD: §4.5 )

- Preview collapsed by default: one-line summary ("20 shifts · Jun 15 to Jul 13 · skips weekends"), expandable to a week-by-week breakdown with skipped days struck through and their reasons. — ( PRD: §4.5 )

- Each drop spreads the full estimate independently per technician. No shared "remaining" counter. Scheduled hours, estimate, and actual hours are three separate quantities. — ( PRD: §4.5 )

- Confirming creates a linked series of daily shifts. — ( PRD: §4.5 )

## Acceptance Criteria

- Given a 40h scope on a tech with 8h days, when "Full estimate" is selected, then the preview shows "5 shifts" across 5 working days.

- Given the tech works Mon–Fri 8h/day, when spreading 80h starting Monday, then 10 shifts are created across 2 weeks with weekends skipped.

- Given "Until a date…" is selected, when the user picks a finish-by date, then the hours per day adjust to fit within the date range.

- Given the same WO is dropped on a second technician, when spread, then the full estimate is spread again independently (no shared counter).

- Given the user clicks "Change scope", when returning to the scope picker, then the previous scope selection is preserved.

- Given business hours are set for Saturday, when spreading, then Saturday is included as a working day.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
