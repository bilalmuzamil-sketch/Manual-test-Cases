# Ticket drafts for review, 29 Oct 2026 (epic SV-11839). Nothing is filed yet.

**Every draft waits for the QA lead's go-ahead, one ticket at a time (Rules 62 and 73).** When a draft is
approved it is filed as:

- type **Bug**, parent **SV-11839**, priority **Medium**, Product Area **Reports & Dashboards**;
- "relates to" the stories named in its header;
- the pictures listed in its header, uploaded and embedded in the description.

The basis is Chris Ward's answers of 28 Oct 2026. The verbatim copy is
`../chris-answers-2026-10-29/CHRIS-WARD-ANSWERS-verbatim.md`, and the impact map is
`../chris-answers-2026-10-29/ANSWERS-AND-DASHBOARD-IMPACT.md`.

Every finding was re-checked on staging build **v26.43.2-f8698cb** with three things set to the location's
own time zone, and all three recorded (Rule 99):

- the session;
- the browser;
- the test computer.

## Phase 1: Dashboard, and reports that change Dashboard figures (review these first)

| # | Draft | Title | Where it shows on the Dashboard |
|---|---|---|---|
| P1-1 | `phase1/P1-1-dashboard-tech-efficiency-declined-line.md` | Dashboard - Technician Efficiency counts a line the customer declined | Technician Efficiency tile headline, supporting line and table |
| P1-2 | `phase1/P1-2-reports-tech-efficiency-clock-under-36-seconds.md` | Reports - Technician Efficiency drops a line's tech time when the clock is under 36 seconds (Dashboard tile too) | Technician Efficiency tile headline and table |
| P1-3 | `phase1/P1-3-reports-tech-utilization-seconds-only-technician.md` | Reports - Technician Utilization lists a technician who clocked only a few seconds (Dashboard table too) | Technician Utilization tile table: an extra row; the figures do not change |
| P1-4 | `phase1/P1-4-reports-sales-by-customer-labor-delta-after-timesheet-edit.md` | Reports - Sales By Customer keeps the old Labor Delta after a timesheet is corrected (Dashboard table too) | Sales by Customer tile table, Labor Delta column |
| P1-5 | `phase1/P1-5-COMMENT-SV-11823-revenue-split.md` | **Comment, not a new ticket.** It records Chris's ruling on SV-11823, which is already open. | Revenue tile supporting line |

**Not tickets** (Chris answered "keep as today"): Revenue after a discount (draft F4 is withdrawn), and the
Technician Utilization decimals. Answers 11, 12 and 39 were checked and do not change any Dashboard figure.

Pictures are in `pictures/` (P1-*). Each one was looked at after it was annotated.

## Phase 2: reports that do NOT affect the Dashboard

Drafted by four workers following `phase2/PHASE2-WORKER-BRIEF.md`. Their drafts are `phase2/P2-*.md`, and
each worker's summary is in `phase2/SUMMARY-p2*.md`.
