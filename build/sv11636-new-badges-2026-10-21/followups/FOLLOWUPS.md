# SV-11636 follow-ups (QA lead 22 Oct: "Yes and Yes but in a followup tickets for both", no screen recording)

## 1. Header at 1024 px — FILED [SV-11661](https://shopview.atlassian.net/browse/SV-11661)
Bug · Medium · parent SV-490 (SV-11636's epic) · Product Area Reports & Dashboards (copied) · label board-tech-view (copied; the source's
`QAcomplete` status label deliberately not copied) · Relates SV-11636. Reproduced twice on staging v26.43.0-e48011d (r1 + r2 scripts),
profile_menu_button x1021.4–1061.4 at 1024 (scrollWidth 1024), fits at 1100/1180/1280. Clicking the 3 px sliver at (1022,28) still opens the
profile menu. Production 26.43.0-ffea43c at 1024: profile x1162 (fully off). Duplicate search (7 JQL queries) found nothing matching.
Expected sources: Chris comment 79239 (verbatim) + Board/Tech View PRD v73 S1-R14. Read back: Bug/Medium/labels/parent/area/link OK; headings in
order; 1 image (attachment 62845, 360×685) inside step 3; table 5 rows; no jargon. Pre-ticket check: standard + lessons read.

## 2. Phone Work Orders page scrolls sideways — NOT FILED, cause corrected, asked the QA lead
What I reported earlier was wrong: I said the mobile filter chip row made the page 810 px wide. Live check (`cause636.mjs`): hiding the chip row
leaves 810; hiding the 6 ZZBREAK customer names ("ZZBREAK <b>bold</b> "q" & 'x' Superlongunbrokencustomername…", no spaces) brings the page
back to 390 / 768. So it is test data: a customer name with no spaces does not wrap on the phone card. Production had no such customer, so its
"no overflow" was not a fair comparison. No document found that says how a long unbroken name must show on the phone card (Filters v23 S12
covers the chip row; Board/Tech View PRD S1-R14 says the phone list stays "exactly as it does today"). Rule 58/61: asked the QA lead.

## Learning check (Rule 95 B)
- LESSONS-INDEX: 2 rows (wrong overflow cause; badge at the screen edge).
- Playbook §AL.4 (page-width cause recipe + header numbers).
- Ticket standard §5: striped "past the edge" strip.

**QA lead's ruling (22 Oct 2026), on the options (a) file / (b) ask Chris / (c) drop: "c"** — dropped as test data only. Nothing filed, nothing to Chris.
