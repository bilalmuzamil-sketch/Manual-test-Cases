# Proven facts for "Part 2. Setup for Claude session" — WO Board / Tech View cases (sv10043, v26.40.8-7a95011, checked 8 Oct 2026)
Use ONLY these facts in Part 2. Anything a case needs that is not here is written as a browser step (Part 1 route) or marked UNVERIFIED.

## Environment
- QA branch app https://sv10043.qa.shopview.com · API https://sv10043api.qa.shopview.com (host shape: sv<branch>.qa.shopview.com / sv<branch>api.qa.shopview.com).
- Build marker to record before starting: the app version shown by the app (this pass: v26.40.8-7a95011).
- The QA branch can be asleep. Check: GET https://sv10043api.qa.shopview.com/api/definitely-not-real-zz → 401/404 awake, 302 asleep (redirects to
  sleep.qa.shopview.com), 503 booting. Wake: POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv with JSON
  {"action":"wake","env":"sv10043"}, then re-check every 30 s.
- Browser: Chromium /opt/pw-browsers/chromium-1194/chrome-linux/chrome through Playwright (never "playwright install"), through a local bridge:
  `source build/testing-tools/ensure_bridge.sh` (port in /tmp/atlassian/bridge-port.txt). Window 1600 x 1000; Board View columns render only when
  scrolled into view — use a 2600 px wide window to see more columns.

## Access
- Ask the QA lead for the branch's `sv_sso_session` value only (PHPSESSID and cf_clearance are not needed). Keep it in /tmp/qa-cookies/sv10043-sso.txt
  as `sv_sso_session=<value>`, mode 600. Never put a cookie, password, token or OTP in a doc, commit or log.
- Sign in: `node build/testing-tools/qa-branch-boot.mjs sv10043 /workorders admin` (Admin quick-login; you appear as "Admin ShopView"); `tech` gives
  "Tech ShopView" (Technician). Only these two quick-login users exist on a QA branch.
- Access check: the app opens /workorders showing the Work Orders page (not the sign-in page); the top bar shows the location next to the bell.
- WARNING: quick-login rotates the branch session — two sessions signing in to the same branch sign each other out. Confirm no other session is
  using the branch before signing in.
- Locations: Staging Heavy Duty - 9919 = b3c8c820-f815-4cf1-8938-10956c5ee71a (America/Edmonton); Staging Lethbridge - 4310 =
  f8a8b802-7780-4b16-bf10-343caeb616b2 (America/Edmonton). Switch in the browser: initials (top right) > Change Location.

## Reads proven on this build (inside the signed-in browser, fetch with credentials: 'include')
- GET /api/staff?limit=200&search=<text> — staff with id, first_name, last_name, role_label, is_active.
- GET /api/customers?search=<text> — customers (the plain list ignores page params; use search).
- GET /api/staff/my-workplaces — locations and ids.
- GET /api/schedule/board?from=<ISO>&to=<ISO> — shifts (staffId, startsAt, workOrder.displayNumber, lines).
- GET /api/schedule/work-orders?search=<number> — work order with its lines and line technicians.
No create/update API call was used in this pass: every setup was done through the screens. So "Setup calls" = drive the Part 1 steps in the
browser with Playwright; for each step say which Part 1 step it is. Any API create call is UNVERIFIED on this build.

## Screen facts (labels exactly as shown) — full list: build/wo-board-tech-view/OBSERVED-UI-LABELS-sv10043.md
- Work Orders toolbar: tabs All · Estimates · Work Orders · Completed; Status filter; Assigned to me; Asset on Site (Yes / No / Clear selection);
  Search button (aria-label "Search", the LAST one on the page; the first is the top-bar search); Create Work Order; display switcher buttons
  List · Tech View · Board View (aria-labels); Column Selection (List, Tech View); Fields to display (Board View); Density (Compact/Regular/Comfortable).
- Row/card menu: button aria-label "More actions for <number>" > Reassign lead technician (dialog: search, Unassigned, technicians with "N open",
  Cancel, Reassign). Messages "Lead technician updated" / "Lead technician removed".
- Work order page: status card with Lead Technician dropdown (only once Approved; read-only "Unassigned" while Estimate); Lines tab New Line form
  ("What Are You Doing?" ready-made lines only, Line Approved, Save & Close, close ×); line row Approve / Decline / Complete; Labor row Start / Stop
  (Stop window offers only Clock Out); Story row edit "Edit tech story" (window "Tech Story: <line>", Update); Parts row Add Part (entry row: Description *,
  Qty *, Cost, Sell price *, Save); Order → Receive ("Receive parts" window) → part menu Return.
- Settings: initials > Settings; Staff > New Staff Member (First Name, Last Name, Email, Role, Departments (required), Location (required, one),
  Time Clock, Save & Close); Roles & Permissions; Locations > New Location; IMPORTS > Invoices (Download Template, Select CSV File, Import Invoices).
- Customers > New Customer (Name *, Save) → customer page tabs; Contacts > New Contact; Assets > New Asset (Contact * and Make * required).
- Saved per user: display, filters, column choices, density, pins — reset them after a run (Clear selection; switch back to List).
- Imported work orders: listed only with Status > Imported; open on a separate imported page with no lead technician; never on Board/Tech View.

## Evidence and cleanup (for every case)
- Save the build marker, the real value of each brace name, screenshots and the page text read for each step under
  build/wo-board-tech-view/runs/<date>/C<id>/. Judge only against the case's Expected results; read results from the screen.
- Leave records named ZZAUTOTEST… (they mark test data). Put back anything shared you changed: Admin's saved view/filters/columns/pins, a lead you
  moved on a non-test work order, a clock you started (Stop > Clock Out), and the location (Change Location back).
