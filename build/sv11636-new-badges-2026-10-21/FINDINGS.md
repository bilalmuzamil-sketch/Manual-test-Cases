# SV-11636 — "New" pills on the Dashboard link and the view switcher — PASSED (22 Oct 2026)

Staging `app.staging.shopview.com`, **v26.43.0-e48011d** (last-modified 22 Oct 10:25:23 GMT; before it v26.40.20-7405769). Admin +
Tech quick-login user at Staging Heavy Duty - 9919. Production was **v26.43.0-ffea43c** and already shows the same two pills.
Earlier on 22 Oct staging still had the old build, so FAILED comment **79263** (03:14 CDT) was posted at the QA lead's request; it stays
as it is (Rule 112). The result on the new build is comment **79273** (PASSED, 5 annotated pictures, 12-row table, read back OK).

## Sources
Ticket "How to check" · Chris Ward comment 79239 · Chris in Slack 22 Oct (DM: no Dashboard pill without Reports access; no switcher
pill on phone) · epic **SV-490** description "Access is the existing reports permission, all or nothing, scoped by location" (the
Dashboard PRD page itself was not found by search; the SV-490 page 934576147 is a stub) · release notes page 927367183 v9 ("I can't see
the Dashboard." It needs access to Reports.). QA lead's Tech View pointer (Slack F0CAY7HAKQV).

## Measured (data/*.json, scripts/)
- Widths 1920 / 1440 / 1280 / 1024 light + dark (`data/m636-*.json`): Dashboard pill 36.03×16.5 at link x, y 3.5 (link y 11.75) — overlaps no
  link/search/button rect, no clipping ancestor, inside viewport; label ink under the pill rect: 0 grey-ink pixels. Switcher pill centred
  on the switcher (centre diff 0.0 px), 2 px above it, overlaps nothing. **Max shift of any header/toolbar element with the pills hidden
  by CSS = 0 px at every width and theme.** Same style both places: 10px/800, radius 999, padding 1px 6px, light bg rgb(233,245,255) /
  text rgb(23,92,211), dark bg rgb(22,35,60) / text rgb(155,194,255).
- 1023 / 768 / 390: no switcher, no pill on the page; phone menu has `Dashboard New` (40×16.5 pill at x195, y451.3), all 13 rows 56.8 px
  tall at the same y as the baseline (Dashboard row y431.2 vs 431 before).
- Views (`data/v636.json`): exactly 1 switcher pill in List, Tech View and Board View at 1440 and 1024; each of the 3 buttons clicked → right
  view (table / tech groups / board columns). elementFromPoint at each button centre returns that button.
- Tooltip (Tech View hover): label `Tech View` at x1144–1224, y47–78.4 sits on top of the pill (x1166–1202, y64.5–81) while hovered.
- Expiry (`data/x636*.json`, browser clock set with Playwright `clock` — COMPARISON ONLY): open tab loaded 06:58:00 UTC → 2 pills at 06:58:26 and
  06:59:28 → **0 pills at 07:00:36, no reload**; loads at 06:50 UTC 31 Oct and 12:00 UTC 30 Oct → 2 pills + 1 phone-menu pill; loads at/after
  07:00:25 UTC 31 Oct and 2 Nov → 0 pills, 0 in phone menu. (The "06:59:59 / 07:00:00 / 07:00:01" loads were taken ~26 s after install, so
  they only prove "gone after 07:00"; the open-tab run brackets the moment to within 68 s.)
- Roles (`data/r636-roles-*.json`), each role RESET TO TEMPLATE FIRST (Rule 105), Tech user (staff d2cb20a6…, tech@shopview.com) switched with
  `POST /api/staff/{id}/change` echoing every field, then fresh `quick-login tech` session:
  Technician (no `reportsPageAccess`; reset: Save disabled = already template, 6 perms) → nav Work Orders/Schedule/Customers, no Dashboard, no
  pill, switcher pill yes, phone menu no Dashboard, 0 pills · Service Advisor (no reports; reset: already template, 25 perms) → nav up to
  Parts, no Dashboard, no pill, phone 0 pills · Parts Manager (has reports; reset REMOVED `woMoveLabor` — shared-org drift, 32→31 perms)
  → `Dashboard New` + switcher pill + phone `Dashboard New`. Office User has no Reset button on this org, so not used.
  **Restored:** Technician reset again (already template) and Tech user back on Technician; staff record diff vs original = none.

## Observations NOT part of this ticket (kept out of the Jira comment; asked the QA lead — Rule 97(d))
1. **Phone/tablet page sideways scroll on staging**: at 768 and 390 px `scrollWidth` is 810 (client 768/390); production 768/390 = no overflow.
   Culprit by bisection: `.mobile-work-orders-container` (mobile filter chip row `mobile-filter-chip-row__track`, right edge 467 at 390).
   Identical with the pills hidden → not caused by SV-11636 (Filters work, SV-8785). Jira search for an existing ticket returned nothing
   usable (REST search gave no total) — UNVERIFIED whether one exists.
2. **1024 px header on staging**: profile avatar button at x1021, w40 (3 px visible, rest past the window); same numbers with the pills
   hidden and in the pre-change baseline (v26.40.20: AS 1021.4+40); production at 1024 puts it at x1162. Pre-existing, long location name.
3. Before-picture note: the BEFORE capture (v26.40.20-7405769) shows an extra Density icon in the Board toolbar that the new build lacks
   (Density removed from Board = SV-11580, passed earlier); the exhibit crops avoid it.

## Changes made on the shared staging org (Rule: restore)
Parts Manager role reset to template (removed `woMoveLabor`); Technician/Service Advisor already at template; Tech user back on Technician
(verified field by field); theme back to light; Admin Work Orders view left on Board View (as it was at the start of the tests).

## Gate (Rule 72)
Build marker re-read live before posting (v26.43.0-e48011d, unchanged); ticket re-read: status **Done** (moved by the shared account at
06:18 CDT with comment 79272 "QA Status: Passed … Will share a detailed report shortly" — not touched); newest comment read; images are real
attachments (62840–62844), read back in order; no technical section, no recording (not asked/approved); priority n/a (no ticket created).
