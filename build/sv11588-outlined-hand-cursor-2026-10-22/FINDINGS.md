# SV-11588 — outlined hand pointer in Board View and Tech View — PASSED + one remaining point (22 Oct 2026)

**Mode: API (Standing Rule 113, QA lead's choice), no recording, no technical section.**
QA branch `sv11588.qa.shopview.com` **v26.43.0-003b8fb** (last-modified 22 Oct 13:40:22 GMT, etag 267f91e9…, unchanged at posting) vs
production **v26.43.0-ffea43c**. Admin, Staging Heavy Duty - 9919. Ticket had no comments; parent SV-11593; dev Slavcho Mitrov.

## Readings (all by script, every element; drags done with real mouse moves) — ev/*.json, scripts/
- Board View column headers: production every element of every technician header `grab` (12 headers) → branch the same elements
  `url(<hand svg>) 16 16, grab` (13 headers); pin buttons `pointer` both; Unassigned header `auto` both (q588).
- Tech View row grips: 67/67 `grab` → 67/67 custom open hand. Technician group headers: `grab` → custom open hand (h588/k588, dark run).
- Cards: `pointer` on both (190 / 149 visible); Tech View rows `pointer` both — unchanged.
- Drags (8 steps each): Board card, Board column header, Tech row, Tech technician header — production `grabbing`, branch custom
  closed hand `url(<hand-back-fist svg>) 16 16, grabbing` at every step past the drag threshold; same 'pointer' at the same step on the card drag
  in both. Dropped where they started: no move requests sent (only view-preference PATCHes).
- Images (decoded from the CSS): both 32×32, viewBox 0 0 32 32, path fill #fff, stroke #000, stroke-width 2 (non-scaling), round joins,
  hotspot 16 16; fallback keyword grab / grabbing. Rendered: drawn box inside 1..30 px, 0 pixels touching the edge.
- List + Schedule, Customers, Parts, Reports, Dashboard, Notifications: every element whose pointer is set, compared both ways —
  only content differences (notifications present on one site only, Schedule card statuses). Schedule sidebar cards keep the browser
  `grab` on both (not in scope).
- Dark theme: same readings for cards, headers, rows, grips, technician headers (g588 dark, both sites).

## Remaining point (QA lead: "Raise it"; verdict stays PASSED + separate issue)
Open hand at real size: pixel map shows at most one white column inside each finger, the two middle fingers none (grey only) →
fingers read black. Posted as comment 79307 tagging Slavcho, with ev/SV-11588_3-open-hand-fingers-hd.png.

## Limit (QA lead: mark passed, tell him how to test it)
How Chrome on Windows draws the pointer can't be seen here (Linux browser; screenshots never include the pointer). Steps for a
Windows check given to the QA lead in chat.

## Posted
Comment 79306 (green PASSED, 10-row table, 2 pictures) and 79307 (separate point, @Slavcho, 1 picture). Read back: media in order,
table 11 rows (header + 10), lists 5 and 3, mention present. Gate: branch + production markers re-read, ticket TESTING QA with 0 comments.

## Production restore
The drag script collapsed Unassigned and switched the view on production: put back to Board View, collapsedGroups [] (read back);
theme back to light. Nothing else changed on production.

## Learning check (Rule 95 B)
- Pointer CSS check recipe → playbook §AL.5. A cursor test can't be screenshotted — draw the page's own cursor image at the mouse
  spot and label it comparison only.
