# SV-11822 — Change Location dropdown opens empty after page reload when "DVI Test" location is selected

**Ticket:** https://shopview.atlassian.net/browse/SV-11822 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS (retest 5 Nov 2026, on a "DVI Test" location copied from staging)
This replaces the 4 Nov verdict ("BLOCKED for the exact step"), which was given because sv11839 had no "DVI Test" location. On the QA lead's instruction one was created on sv11839, matching staging's DVI Test field for field, and the ticket's exact steps were run on it.

## What the ticket expects (verbatim)
> **Expected**
> * Location list opens (QB Location, Staging Heavy Duty - 9919, Staging Lethbridge - 4310, DVI Test) and user can switch.

Source: SV-11822 description. sv11839 has no "QB Location", so the list there is DVI Test · Test Location · Staging Heavy Duty - 9919 · Staging Lethbridge - 4310.
Comments:
- Mudassir Qamar, 28 Oct 2026 (comment 79640): on staging the menu was drawn off-screen (x=0, y=936, `visibility: collapse`), and "Only DVI Test reproduces".
- The developer, 27 Oct (comment 79616), asked for the my-workplaces body with its X-Cache header, the menu's inline top/left and items, and the DVI Test row's organization_id, timezone, color and country_code.

## The location that was copied (read-only from staging, 5 Nov 2026)
`staging-dvi-test-record.json` holds staging's full DVI Test record (`GET /api/workplaces` and `GET /api/staff/my-workplaces`, nothing changed on staging). The fields the developer asked for:

| Field | Staging "DVI Test" | sv11839 "DVI Test" (created 5 Nov) |
|---|---|---|
| organization_id | d55bc308-e61a-438d-b5f1-c7a73c89d49f | d55bc308-e61a-438d-b5f1-c7a73c89d49f |
| timezone | **Pacific/Fiji** | Pacific/Fiji |
| color | #2276DA | #2276DA |
| country_code | US | US |

Every other field is also the same: name "DVI Test", 111 Granton Drive, Richmond Hill, Hawaii, L4B 1L5, (467) 484 - 4563, shop id 1, tax "Zero Rated", sales tax rounding line_by_line, shop supplies 0 / min 0 / max none, remit-to = itself, bookkeeping enabled.
**What differs:** only the location's own id (`93404b24-…` on sv11839, `39522bc6-…` on staging), and therefore the remit-to id that points at itself. The location was created on screen (Settings → Locations → Add); the screen sent `POST /api/workplaces/create` → 201. The Admin could switch to it straight away (it appeared in `GET /api/staff/my-workplaces`; no access change was needed). The location has been left in place on sv11839.

## What I did
The ticket's steps, in Chrome, signed in as Admin starting at Staging Heavy Duty - 9919:
1. Profile → Change Location → **DVI Test**.
2. Reload the page, three times: on Dashboard, on Reports (Sales) and on Work Orders.
3. After each reload: Profile → click the **DVI Test** chip.
4. With the list open: switch to Staging Heavy Duty - 9919, reload, and switch back to DVI Test.

This was done at **1536×936** (Mudassir's size) and at **1920×1080**. Control: the same steps with **Staging Lethbridge - 4310** at 1536×936.

## What I saw
| Run | After reload on | List on screen? | Menu position (inline top / left) | Visibility | Items in the list | Switch away and back |
|---|---|---|---|---|---|---|
| DVI Test, 1536×936 | Dashboard · Reports · Work Orders | **Yes**, all 3 | 202.906px / 1274.19px | visible | DVI Test · Test Location · Staging Heavy Duty - 9919 · Staging Lethbridge - 4310 | **worked** |
| DVI Test, 1920×1080 | Dashboard · Reports · Work Orders | **Yes**, all 3 | 202.906px / 1658.19px | visible | same 4 | **worked** |
| Lethbridge control, 1536×936 | Dashboard · Reports · Work Orders | **Yes**, all 3 | 202.906px / 1274.19px | visible | same 4 | **worked** |

`GET /api/staff/my-workplaces` answered 200 with all 4 locations every time (10 responses per run). The responses carried **no X-Cache header**. Full bodies are in the evidence files.

## Other retests (for context)
Ayesha Khan, comment 80169 (4 Nov 2026, 19:11 −05:00): *"Retested on Staging and QA (sv11839), Chrome, at 1920×1080, 1536×864 and 1536×936 … Not reproducible on my side."*
Note that sv11839 had **no** "DVI Test" location until this retest created it on 5 Nov (on 4 Nov `GET /api/workplaces` listed only three locations). So the "QA (sv11839)" part of her retest cannot have used DVI Test.

## Build, time, location, zones
- Build: v26.45.0-aacb66c.
- When: 5 Nov 2026, 04:50–04:56 UTC (the location was created just before).
- Zones (Rule 99): each run's browser time zone and process `TZ` were the **target location's** zone, because every check happens after switching to it — Pacific/Fiji for DVI Test, America/Edmonton for Lethbridge. Each run started at Heavy Duty with Heavy Duty's own zone (America/Edmonton) in the session and `localStorage`. The app's own Change Location then set the session (`change-location` with `workplace_timezone`) and `localStorage['timezone']` to the target zone.
- At **every** check, all four matched the target, and the header showed the target location. This is recorded per check in each evidence file (`rule99_at_checks_all_match: true`).

## Pictures (deviceScaleFactor 2)
- `SV-11822/DVI-1536x936-1-after-reload-dashboard.png`: DVI Test, after reload, list open with all locations.
- `SV-11822/DVI-1536x936-3-after-reload-work-orders.png`
- `SV-11822/DVI-1920x1080-2-after-reload-reports.png`
- `SV-11822/LB-1536x936-1-after-reload-dashboard.png`: control.
- `SV-11822/dvi-0-create-location-filled.png`: the new location as entered in Settings → Locations.

## Evidence
`staging-dvi-test-record.json`, `evidence-create-dvi-test-save.json` (what the screen sent and the stored record), `evidence-DVI-1536x936.json`, `evidence-DVI-1920x1080.json` and `evidence-LB-1536x936.json` (menu state, my-workplaces bodies and headers, change-location requests, zones per check). The 4 Nov runs without a DVI Test location: `evidence-A.json`, `evidence-B.json`.

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on the QA branch sv11839 (build v26.45.0-aacb66c), 5 Nov 2026, Chrome, as Admin.

sv11839 had no "DVI Test" location, so I created one, copying staging's DVI Test exactly: same name, time zone Pacific/Fiji, color, country, address and tax.

I then did the ticket's steps: Profile → Change Location → DVI Test → reload → Profile → click the "DVI Test" chip. I reloaded on Dashboard, on Reports and on Work Orders, at 1536×936 and at 1920×1080. Every time, the location list opened just below the chip with all four locations, and switching to Staging Heavy Duty - 9919 and back to DVI Test worked. The same steps with Staging Lethbridge - 4310 also worked.

This matches Ayesha's retest (comment of 4 Nov). Note that before today sv11839 had no DVI Test location, so her sv11839 check could not have used it.

Picture: SV-11822/DVI-1536x936-1-after-reload-dashboard.png
