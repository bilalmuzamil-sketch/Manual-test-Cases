# Run 498 (WO Board / Tech View) — how to re-run any check fast

**Recipe, routes and traps:** `build/APP-ACTIONS-PLAYBOOK.md` › "WO Board — FAST RE-RUN RECIPE". Read it first.

**Run one batch (or some checks of it):** `ONLY=C97007,C97013 <scratchpad>/wob.sh <this folder>/<batch>.mts`
(`wob.sh` = `env -i` + `npx tsx`, masks hex in output). One batch at a time — never two in parallel. For a long
sequence chain them in one script and write `EXIT=` after each, so a restart shows where to resume.

**Every batch:** signs in once (`session.mts`), switches to the test admin "ZZ WOB Runner" (`runner.mts`), makes its
own data (`data.mts` customers / work orders with a contact; `mkSet()` = one customer per work order), writes
`evidence/<batch>.json` + pictures, and puts the runner's saved choices back. Results go to TestRail with
`build/testing-tools/push_results_to_run.py --run 498 --results RESULTS-*.json` (Passed/Blocked free; Failed needs
`ticket_held` — no Jira without the QA lead's per-ticket approval).

| Batch | Checks |
|---|---|
| s1-batch2 / 3 / 4a / 4b | C154884 C96910–C96923 (display switcher) |
| s2-batchA / B / C | C96924–C96939, C368125–C368130, C368161, C368162 (Tech View) |
| s3-batchA / B / C | C96940–C96955, C154886, C368131, C368132 (Board View) |
| s4-batchA / C / D / E / G / H | C96956–C96974, C154887–C154890, C368133–C368140 (reassign) |
| s5-batchA / A3 / A5 / B / C | C96975–C96986, C368160, C368164 (fields and columns; A5 = second location as Ayesha Khan) |
| s6-batch / s6b-batch | C96987–C96992 (density) |
| s7-batch / s8-batch | C96993–C96999, C97000, C368141–C368143 (line technicians, tech story) |
| s9-batchA / s9-batchB | C97001–C97013, C368144–C368149 (drag to reorder; B = more than one person) |
| s11-batch | C97020–C97022, C97028, C97030–C97032, C154648, C154649, C368150–C368159 |
| high2-batch | C368193–C368214 (List regression) |
| medium-batch | C368220–C368237, C368245–C368247 (filters, reports, Customers, dashboard, imported) |
| ui-fallback | screen routes where the API route did not do it (second-location enrolment, New Asset) |
| s9-fix2 (WOB_LIVE=1 for C368149) | C97003 (dispatcher does the same column drag first, as the positive control), C97010, C97012, C368146 (dispatcher's own order set first), C368149 |
| probe-kbd | not a case: every focus stop with Tab on Board View and Tech View, what the arrow keys do, which cards/rows carry a tabindex (feeds C97021, C368150–C368152) |
| ps-photo-batch | C368215–C368217 (part sales), C368241–C368244 (new photo after a reload; red/blue squares in `evidence/zz-photo-*.png`, colour read off element pictures afterwards) |
| rest-batch | C368169–C368171 (Edit Work Order), C368197 (paging), C368218/C368219/C368223 (filters kept), C368156 (pins per location), C368238/C368239 (impersonation), C368240 (ended session — runs LAST, signs the session out) |
| analytics-batch | C97023, C97024, C97025, C97027, C97029, C97035, C368153, C368155, measurable steps of C97026. Events read from the page's own analytics requests (`en`, `ep.*`, `uid`); `WOB_GA=1` lets view-as pages keep analytics |
| prod-check.mjs | not a case: Production behaviour behind held reports D2, D8, D10. Run with `PROD_ENVF=/tmp/shopview/prod-login-second.env` (the default file is the QA lead's own account — a second login signs him out) |
| recapture (master13) | every held report re-run with `WOB_SCALE=2 WOB_EV=evidence/recapture-2026-10-09` — re-verifies on the day's build and gives 2x pictures for the tickets |
| high1-batch | C368165–C368168, C368172–C368174, C368176, C368177, C368178, C368179, C368190, C368192, C368180–C368189, C368202, C368213 (high-risk first half) |
| orgb-batch | C368175, C154650 — organisation B registered through the branch /register page (playbook §X); its only staff member is "ZZAUTOTEST OrgB Tech" |
| c-fix | C96984 (c) — an asset with no unit and no year/make/model, made behind the screen (New Asset will not save without a Make) |
| s9-fix4 | C97003 (2560px window, Tech View groups read from the virtual table), C97012 (seeded Approved — a Complete card is not on the board), C368146 (Tech View read with the big groups collapsed) |
| imp-batch | C368238, C368239 — account access started (page `/impersonate-user/<user id>`) and exited (orange bar Exit) while Reports > Work In Progress is loading; run as Admin ShopView itself, not the runner |
| parts-batch | C368213 — two vendor part requests, the first ordered and received through its Purchase Order page, one return raised on the received part; List Parts/Returns read |
| kbd-fix | C368150, C368151, C368152, C97020, C97022 — focus placed at the roving Tab stop (a card OR a column header), then the arrows; Tech View rows reached with ArrowDown; Status filter helper defined |
| ps-photo-fix | C368242–C368244 (photo technician enrolled in Service so the Schedule draws her row; Staff row read cell by cell), C368215–C368217 (part sales — never reached on 9 Oct because the batch crashed after the blue upload) |
| signout-fix | C368240 — LAST in any queue (signing out ends the shared session); Logout found by exact text (icon-name trap), Inventory Value by exact text |
| d3-pics | D3 pictures: the technicians own screen (Assigned to me) shows only her three work orders — List, Tech View and Board View at 2x into defect-drafts/raw |
| s11-fix2 | C97030 (Estimates seeded WITHOUT a line — an authorized line approves an Estimate), C97032 (same seed fix; column scroll guarded), C368157 (Tech View read with groups collapsed) |
| editwo-batch | C368169, C368170, C368171 — the Edit Work Order checks run on the work order page's left-hand card (QA lead 9 Oct) |
| parts-filter | C368218, C368219, C368223 — the page's own Search used as the filter (no Vendor/State filter exists, QA lead 9 Oct) |
| high1-fix2 | C368172–C368174, C368177–C368179, C368188–C368192, C368202 — see the FIX 2 header in the script for the seven causes |
| sort-fix2 | C368196 — VIN sent with the asset change; saved list filters cleared at sign-in |
| s9-batchA5 | C368144 — Lead Technician list scrolled to the TOP first (it opens at the current lead; Unassigned is first) |
| medium4 + orgb3 | re-run of the reports/cards batch and organisation B after the sign-in filter-clear crashed them at 08:44 |
| s9-fix5 | C97003 (scroll to the test columns first — Unassigned stays pinned on the left), C97012 (page wait raised to 90 s) |
| kbd-fix2 | C368151 (focus read after each Enter on the group), C368152 (dialog walked by keyboard to the confirm button), C97020 (view-only user's card menu read by keyboard), C97022 (WOB_LIVE=1: the board updates by itself, no reload) |
| ps-photo-fix2 | C368242–C368244 (wait for each photo to load before capturing; Staff page at /administration/staff), C368215, C368217 (close leftover windows before Add Part) |
| d3-pics (2) | technician found by one word of her name |
| s11-fix3 | C97032 step 6 (dialog opened from any visible card, as the case says), C368157 (the whole board read — ~190 technicians now — and Cal's neighbours compared) |
| editwo-batch (2) | C368170 (lead locked on an Invoiced work order recorded, then mileage / engine hours / PO), C368171 (Audit Log window closed properly) |
| parts-filter2 | C368218, C368219, C368223 — the search-only reload repeated twice with the address recorded before the reload; pages given up to 30 s to load |
| high1-fix3 | C368172–C368174, C368177–C368179, C368188–C368192 — confirm "Remove technician?", untick in the same list, forced clock clicks, whole-lane shift read, the left card's own Assets tab |
| deleted-search | C368191 — read-only hunt for an existing line whose labor technician no longer exists ("Deleted user"); the app refuses to delete staff with labor |
| sort-fix3 | C368196 — On Site seeded on one work order, Clocked In read from its avatars (only those two headers were still unjudged) |
| medium-fix | C368220–C368237, C368247 — filter labels start with their icon name; lists that load on typing; the app's own import headings (*required); Imported filter cleared afterwards |
| dash-seed | C368246 — two technicians clock time on their own work orders this month, invoiced, then every dashboard table read and sorted |
| orgb-fix | REGISTER (now a signed-in page), C368175 (line_number_ menu for Edit labor), C154650 (2560 window; control brought into view; every column header read for organisation-B people) |
| imp-fix | C368238, C368239 (sign in as another user while a page loads). Number matched by its digits; a Technician cannot open Reports, so the exit check uses Schedule as the loading page |
| kbd-fix3 (WOB_LIVE=1) | C368151, C368152, C97020, C97022 — body focus, leftmost-first arrow walk, visible-row collapse count, view-only item pressed and role read back |
| ps-counts | C368217 — the case's own Add Part (typed description, vendor, cost, sell), Authorize, Order, Receive (vendor chosen if missing), Return part; list filtered by the page Search |
