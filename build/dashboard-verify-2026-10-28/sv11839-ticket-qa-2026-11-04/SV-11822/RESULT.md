# SV-11822 — Change Location dropdown opens empty after page reload when "DVI Test" location is selected

**Ticket:** https://shopview.atlassian.net/browse/SV-11822 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: BLOCKED for the exact step (no "DVI Test" location on sv11839) — closest faithful equivalent PASSED

## What the ticket expects (verbatim)
> **Expected**
> * Location list opens (QB Location, Staging Heavy Duty - 9919, Staging Lethbridge - 4310, DVI Test) and user can switch.

Source: SV-11822 description. Mudassir Qamar's comment (28 Oct 2026, comment 79640): the empty list was the location menu drawn off-screen (x=0, y=936, `visibility: collapse`) and "Only DVI Test reproduces"; the same steps with Lethbridge worked.

## What I did
**Why the exact step cannot be done:** sv11839's organisation has exactly three locations — `GET /api/workplaces` and `GET /api/staff/my-workplaces` both list only Staging Heavy Duty - 9919, Staging Lethbridge - 4310 and Test Location (the staging DVI Test id `39522bc6-…` is absent). Searches run: those two endpoints, plus `/api/organization/workplaces`, `/api/settings/workplaces`, `/api/iam/workplaces` (all 404), and this repo for the DVI Test id.

**Closest faithful equivalent (labelled as such):**
- Run A (Edmonton): Admin at Heavy Duty → Profile → Change Location → **Staging Lethbridge - 4310** → reload on Dashboard, Reports > Sales, Customers and Work Orders → Profile → click the location chip each time → switch back to Heavy Duty. Also pressed Backspace on the chip (the developer's hardening note).
- Run B (Karachi): Test Location selected → reload → Profile → click the chip.

## What I saw
- After every reload (4 pages in run A, 1 in run B) the list **opened on screen** (menu top 203 px, left ≈1338 px, visible) with all three locations: Staging Heavy Duty - 9919 · Staging Lethbridge - 4310 · Test Location. Switching back to Heavy Duty worked and survived a reload.
- Backspace on the chip left it showing "Staging Lethbridge - 4310"; the stored location was unchanged.

This does **not** prove the DVI-Test-specific cause is fixed: in the original report the same steps with Lethbridge already worked before the fix. Only a location set up like staging's DVI Test can show that.

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 20:49–20:51 UTC
- Location **Staging Heavy Duty - 9919 / Staging Lethbridge - 4310 (run A, America/Edmonton) and Test Location (run B, Asia/Karachi)**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 / Staging Lethbridge - 4310 (run A, America/Edmonton) and Test Location (run B, Asia/Karachi) at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11822/A-2-after-reload-dashboard.png`
- `SV-11822/A-5-after-reload-work-orders.png`
- `SV-11822/B-1-test-location-after-reload.png`

## Evidence
SV-11822/evidence-A.json, SV-11822/evidence-B.json

No Jira or TestRail write was made.

## Draft comment (NOT POSTED)
Not a pass and not a failure: the ticket's own step needs a location called "DVI Test", which does not exist on the QA branch sv11839 (it has only Staging Heavy Duty - 9919, Staging Lethbridge - 4310 and Test Location). On sv11839 (build v26.45.0-aacb66c, 4 Nov 2026), switching to Lethbridge, reloading Dashboard, Reports > Sales, Customers and Work Orders, and opening the location list each time worked every time: the list opened on screen with all three locations and switching back worked. Because Lethbridge also worked before the fix in the original report, this still needs checking on a location set up like staging's DVI Test (for example on staging after this branch is merged).
