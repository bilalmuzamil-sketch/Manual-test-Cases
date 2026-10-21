# SV-11575 — Technician filter: inactive technicians + 50-value message (QA, 21 Oct 2026, in progress)

Staging `app.staging.shopview.com`, build **v26.40.20-c627fc7**, Admin, Staging Heavy Duty - 9919. PRD v72 S1-R15 / S1-R15c.

## Point 1 — PASS (Board + Tech View)
- 331 options = every Board column (332) except the "Deleted technician" column (S3-R20e) — both directions checked by id.
- Unassigned first; 327 active technicians sorted by first then last name (0 violations, names from the board data);
  then the 3 deactivated leads (Darrell Martinez, ZZAUTOTEST F3 Dan Delta x2) with the grey Inactive label.
- Ticking Darrell Martinez shows only his column ("D.." Inactive, 113) in Board View and only his group in Tech View.

## Point 2 — reported problem fixed; limit behaviour differs from S1-R15c (asked the QA lead)
- No limit text at 0, 1 and 49 ticks (Board + Tech View).
- At 50 a red line "50 selected (max 50 across all filters)" (`filter_selection_over_max_lead_technician`) appears and every
  other name is greyed out (aria-disabled); clicking the 51st does nothing. The spec's message "This change would exceed the
  50-value limit across all filters" never appears.
- Counted across filters: 3 Status values + 47 technicians = 50 then stop (Status put back afterwards).

## Open question for the QA lead
- Whether the greyed-out list + "50 selected (max 50…)" at 50 passes S1-R15c.
- "Deleted technician" column has no option in the list (S1-R15 "everyone who gets a group or column").

## Posted (21 Oct 2026)
- QA lead's call: ask Chris on both open points.
- Comment **79203** "Questions for Chris" (tags Chris Ward): Q1 the 50-limit behaviour vs S1-R15c, Q2 "Deleted technician" not in
  the list vs S1-R15; pictures A (limit states) and B (deleted column + "No results").
- Comment **79204** OVERALL QA STATUS: PARTIALLY PASSED (non-green), 11 checks: 1–10 PASSED, 11 WAITING FOR CHRIS.
- Gate: build re-read v26.40.20-c627fc7 both posts; ticket TESTING STAGE, 0 comments before; PRD 72; media read back
  (1200x507, 400x733 / 640x923, 1200x507), table 12 rows. No recording, no technical section.
- Status filter put back to none after the combined-limit check; Technician filter cleared after each run.
- Learning check: a crashed run left 50 ticks saved in the Technician filter (it is remembered) — clear the filter at the start
  of every filter script.
