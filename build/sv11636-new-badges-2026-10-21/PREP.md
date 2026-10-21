# SV-11636 — temporary "New" badges (Dashboard nav + view switcher) — PREP, not yet testable

Ticket: Story under SV-490, assignee Milomir Kotlajic, status **Open** (21 Oct). Watch: every 2 h; test on the linked QA branch if
it exists and responds, else staging.

## Sources read (21 Oct)
- Description: Dashboard nav pill top-left over the link, nothing moves/resizes, label not covered, clear of Reports + search;
  ONE identical pill centred over the List/Tech View/Board View group, just above it, covers no button, no layout shift, not
  clipped; both expire **Sat 31 Oct 2026 07:00 UTC**, same mechanism as Schedule's (`badge` + `badgeUntil`), an open tab drops
  them too; mobile menu Dashboard entry carries the same badge + expiry; no switcher badge below 1024 px.
- Reference pictures `ref/` (local build 1440x2): page top, nav Dashboard, view switcher.
- Chris comment 79239: phone width menu not broken; ~1024 px tablet: nav + view switcher fit with badges, nothing overlapping or
  clipped.
- Chris in Slack #C0C41RV3T3L (ts 1792611571.182369): same pill as Schedule relaunch; "quick check on mobile and tablet widths
  too when it's done"; request from Sasha.

## Baselines (no badges)
- Production v26.40.20-6ac42c0: **no Dashboard link at all** (nav: Work Orders, Schedule, Customers, Parts, Reports) —
  `prep/e636-prod.json`. So "same place as production" = same as the nav without the badge on the build under test.
- Staging v26.40.20-7405769 (21 Oct ~20:00 UTC): `prep/e636-base-*.json` + screenshots — 1440: Reports 665+85.1,
  Dashboard 760.1+105.6, search 870.7+153.3, switcher 1116+136; 1024: Reports 569+61.1, Dashboard 640.1+81.6, search 726.7+140,
  switcher 133.5+136 (toolbar wraps); 390: menu items 57 px tall, Dashboard 8th row at y 431.

## Test plan (variant matrix)
- Widths 1920 / 1440 / 1280 / 1024 / 1023 (switcher gone) / tablet 768 / phone 390, light + dark.
- Dashboard pill: position over top-left corner, label not covered, every nav item x/y/w/h identical to the no-badge baseline
  (byte-compare geometry), no overlap with Reports / search.
- Switcher pill: exactly one, centred over the group (|centre diff| ≤ 1 px), above it, covers none of the 3 buttons (all
  clickable), no layout shift, not clipped (bounding box inside visible toolbar/viewport, overflow ancestors).
- Same pill style both places (size, colours, weight) and same as Schedule's old pill if retrievable.
- Mobile menu: Dashboard row carries the badge, rows keep their size, menu not broken.
- Expiry: clock set past 2026-10-31T07:00Z (browser clock override, labelled "comparison only") → both gone, including a tab left
  open across the moment; just before → still shown. Disclosed as done in the browser, not a product feature.
- Tech View + Board View pages too (the switcher badge shows in all three views).

## QA lead's pointer (21 Oct, Slack file F0CAY7HAKQV → `ref/slack-F0CAY7HAKQV-badges-preview.png`)
"Also see the Tech View — the buddy sign with small New on that." In the preview, the switcher pill centred over the group lands
directly above the middle button, Tech View (the person icon). Extra checks for that cell:
- The pill must not touch or cover the Tech View icon or its button (measure the gap between the pill's bottom and the button's
  top, and check the person icon is fully visible and the button clickable at the pill's position).
- Hovering Tech View: its tooltip still shows and isn't hidden under the pill.
- Report plainly that a centred pill sits over Tech View only, so it can read as "Tech View is new" while Board View (also new)
  carries no mark; the ticket asks for exactly this placement, so it is noted, not failed, unless the QA lead says otherwise.
