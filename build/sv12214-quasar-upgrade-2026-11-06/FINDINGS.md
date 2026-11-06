# SV-12214 — FE Quasar 2.23.3 → 2.35.x, browser walk (6 Nov 2026, API mode: no recording, no technical section)
Branch sv12214 build v26.45.2-aa4c767 vs production v26.45.1-753355c (Trucks Hill 2), Chrome headless 1600x900 @2x. No Powertools plan, no comments on the ticket.
Accounting forms NOT walked — standing instruction: Accounting is not tested for now (ticket names them; say so in the comment).

| # | Check | Production | Branch |
|---|---|---|---|
| L1 | WO list: Columns menu opens on screen with items | PASS (role=menu) | PASS (role attribute MISSING) |
| L2 | Status filter menu opens | PASS (role=menu) | PASS (role MISSING) |
| L3 | Picking Estimate shows on the chip | PASS | PASS |
| L4 | Copy-VIN tooltip text, on screen | PASS | PASS |
| T1/T2 | Tech View density menu; Compact 36 / Regular 48 / Comfortable 64 px rows | PASS | PASS |
| T3 | Tech View columns menu | PASS | PASS |
| T4 | Technician avatar tooltip | PASS | PASS |
| B1/B2 | Board card-size menu; Compact 93 / Detailed 162 px cards | PASS | PASS |
| B3 | Board fields menu | PASS | PASS |
| B5 | Board columns scroll sideways (board_view_scroller, shift+wheel 0→1200, +600) and down inside a column (+500); cards render | PASS | PASS |
| S1/S2 | Schedule View options / Filter & display menus | PASS (role=menu) | PASS (role MISSING) |
| S3 | Schedule Month / Week / Day | PASS | PASS |
| S4 | Hover a booking → details box, on screen | PASS (top/left px) | PASS (Quasar 2.35 now uses CSS anchor positioning: position-anchor/anchor()) — seeded booking ZZAUTOTEST SV12214 35888 (Brandi Smith, today 07:00) |
| S5 | Mini calendar day click moves the schedule | PASS | PASS |
| R1 | Timesheet report Date Range menu + Custom → From calendar → pick day fills From | PASS (role=menu) | PASS (role MISSING) |
| R2 | A/R Aging Summary as-of date calendar, 30 selectable days | PASS | PASS |
| Q1 | New Customer State/Province pick shows in field | PASS | PASS |
| Q2 | Country list (long, virtual) scrolls to later countries | PASS | PASS |
| Q3 | New Work Order customer list scrolls; picked customer shows | PASS | PASS |
| RC | Issue Credit dialog date picker (QDate) picks a day; credit issued; credit applied in New Payment → Reverse greyed out, tooltip_reverse_blocked_by_credits "Credit CM-xxxx ($10.00) has been applied. Remove the payment…" on screen | PASS (S2-1942, CM-4409) | PASS (S12214-17583, CM-4189) |

Console errors: 0 on WO pages both; branch /customers 1 "Google Maps InvalidKeyMapError" (QA env key, not this change).
**Difference (bucket: open question for QA lead, Rule 97d):** five plain menus (Columns, Status filter, Schedule View options, Schedule Filter & display, Report Date Range) carry role="menu" on production and NO role on the branch; Density and Card size menus keep role="menu" on both (explicit). Ticket: "QMenu not found by role (Density, Card size and plain role="menu", 22)" and "Fix the components, not just the tests, where the behavior really changed." Visual behaviour identical; affects screen readers / automation by role.
Limit: only Chromium available in the container (no Firefox/Safari) — the new anchor-positioned tooltips/menus were checked in Chrome only.

# SV-12152 — read-your-writes: NOT TESTABLE NOW
QA branch sv12152 does not resolve (no DNS) and the wake service returns "Internal Server Error". Ticket's own release plan: back-merge to develop, soak on staging ≥1 day, deploy after 2026-11-12.

# Posted 6 Nov 2026 ~09:15 CDT (QA lead: "Yes, and then tag steffan letting him know that the QA branch is no more accessible. Keep two separate comments.")
- Branch re-checked first: sv12214 + sv12214api no DNS; wake service "Not Found" (404). Results posted from the morning walk on v26.45.2-aa4c767, stated as such.
- Comment 80337 = WHAT PASSED (16 rows, pictures 1 reverse tooltip prod vs branch, 2 schedule hover prod vs branch).
- Comment 80338 = OVERALL QA STATUS: PARTIALLY PASSED, tags Stefan: (1) branch gone, (2) role="menu" missing on 5 plain menus + question (picture 3, labelled Comparison only / developer tools), (3) not tested: accounting forms (MVP rule), board hover card (B4: no hover box on prod OR branch — script found none; could not identify the hover card the ticket names), Safari/Firefox; numbered list of what is needed.
- Status → Blocked (Rule 122: asked the assignee for what testing needs); QA Assignee set to Bilal (was empty). Read back: 2 comments in order, 3 images, Blocked, QA Assignee Bilal.
- Pre-post gate: ticket re-read live (TESTING QA, 0 comments) before posting; build marker could not be re-read (branch gone) — said so in the comment; no AI fingerprint; no technical section.
- Learning: QA Assignee (customfield_10385) must be written as an ARRAY [{accountId}] — a single object returns 400 "data was not an array". Added to playbook.

# Staging re-test (6 Nov 2026 ~16:00 UTC) — QA lead: "This needs to be tested on Staging" (Stefan 80339: merged to staging)
Staging v26.45.2-9e313a5 (last-modified 14:38:33 GMT, etag 30d62707…), re-read before posting unchanged. Same walk scripts with ENV=staging (cookies /tmp/staging, never committed).
All 16 checks PASS as on the branch (walk1/walk2/b5/s4 + invcredit/pay: S2-38362, CM-4536, Reverse tooltip on screen). Seeded booking ZZAUTOTEST SV12214 61980 on Ayesha Tech Role (shift 4bd4ed8f) — staging test data, left.
role="menu" STILL missing on 5 plain menus (L1, L2, S1, S2, R1: role null); Density + Card size keep role="menu". B4 board hover card: none on staging or production.
Posted NEW comments (Rule 112): **80346** WHAT PASSED ON STAGING (16 rows, picture prod vs staging tooltip) + **80347** PARTIALLY PASSED on staging, tags Stefan: role="menu" question again (picture prod vs staging Columns menu, Comparison only), hover card / accounting forms / other browsers still open.
Status TESTING STAGE -> **REJECTED FROM TESTING** (transition 6); QA Assignee already Bilal. Learning check: nothing new (staging session via qa-session env:'staging' + quick-login worked first time).

## Retest 6 Nov 2026 ~22:00 UTC - staging v26.45.2-df7aeed (Stefan 80362, PR #4214)
Production v26.45.2-198e632 used as the before.
- Five panels now role="dialog" + aria-label, opener aria-haspopup="dialog" (scripts/roles.mjs, ev/staging-r3-roles.json vs ev/prod-r3-roles.json):
  Columns = "Column Selection" · Status filter = "Status filter" · Schedule Filter & display = "Filter and display options" · Schedule View options = "View options" · Timesheet Date Range = "Date Range filter". Asset on Site chip = "Asset on Site filter". Production: all role="menu", no name, no aria-haspopup.
- Real command menus: Density and Card size still role="menu" + named. Work order "⋮" menu and line "Add labor fee or discount" menu: inner element role="menu" with menuitem children (production: role="menu" on the outer box with list/listitem inside) - fine.
- Re-walk (walk1/walk2 on df7aeed): columns, status filter (chip shows "Status: Estimate"), Density row heights 36/48/64, Card size 93/232, board sideways scroll, schedule menus + Month/Week/Day switch, mini calendar, Timesheet date range + custom From calendar (picks 11/03/2026), A/R aging as-of calendar (30 days): all PASS, 0 console errors.
  (First run showed Density/Card size "FAIL" only because my own probe had left "Status: Estimate" + "Assigned to me" on; cleared with Clear all filters -> 257 cards, all pass.)
- Schedule booking hover card (check 9): seeded ZZAUTOTEST SV12214 22446/22849 bookings on Sat 7 Nov; hovering 3 of 3 bookings shows the tooltip fully on screen (scripts/s4b.mjs, ev/staging-r3-hover-*.png).
- NEW, asked the QA lead (Rule 97d) before including: two more popups lost their marking with nothing in its place - module switcher (top-left "ShopHub", button still aria-haspopup="menu", popup no role) and profile menu (top-right name, no role, no name). Production: both role="menu". (scripts/womenus2.mjs, ev/*-r3-wo-menus2.json). My earlier pass missed these two.
- Safari / Firefox: not available in this environment (only Chromium installed) - asked the QA lead.
- Clean-up: production "Assigned to me" chip was toggled by the probe and switched back (filters {"assigned_to_me":[]}); staging filters cleared.
Exhibit: ev/jira/sv12214-r3-panels-before-after.png
