# A/R & A/P Aging Reports rebuild (SV-11315) — test execution — PROJECT STATE

**Lane: test execution.** QA lead, 10 Nov 2026: "OK now I am going to give you a new testing suite to run. DO not start until I ask
you to start - But be completely ready." Status: **READY, NOT STARTED** (waiting for his "start" and his answers below).

## Sources (read 10 Nov 2026)
- Developer handoff (Nemanja Djuric), Slack https://shopview.slack.com/archives/C0C454MLP0T/p1794309579559929 + reply
  p1794321158612049 ("no QuickBooks setup is needed … they only read ShopView data").
- Shared notes: SV-11315 comment 80616 (roles, test data, shared behaviour, **KNOWN MISMATCHES — do not file**, how to force load
  errors). Copy in `sources/tickets/SV-11315.md`; every story/bug/task handoff in `sources/tickets/` (`pull_sources.py`).
- Tickets: epic SV-11315 (Ready for Development); stories SV-11531–SV-11539 (TESTING QA, unassigned); bugs SV-11441 (QA Complete),
  SV-12135–SV-12141 (TESTING QA); verification tasks SV-11595–SV-11599 (Done). Rule 112: TESTING QA / QA Complete ⇒ a defect may be
  filed (per ticket, with his yes, Rule 113).
- PRD: Confluence 947650561 "A/R and A/P Report Sorting, Export and Location Filter", **v11** (5 Nov 2026, Chris Ward, "QA answers") —
  version read live 10 Nov; body not yet read this pass (Rule 81: offered to him).
- Reports: Reports → left list "Accounts Receivable" (A/R Aging Summary / Detail / Collection) and "Accounts Payable" (A/P Aging
  Summary / Detail / Unpaid Invoices); addresses /reports/ar-aging-summary, …-detail, …-collection, /reports/ap-aging-summary,
  …-detail, /reports/ap-unpaid-invoices. NOT Accounting → Reports (/accounting/reports/…).

## TestRail
- Suite 1, group **90418** "A/R and A/P Report Sorting, Export and Location Filter": 15 folders, **380 cases**, all ours (created_by 3),
  none Automated. Markers (10 Nov): 357 READY · 9 READY - EXPECT FAIL (SV-12138 ×2, SV-12139 ×5, SV-12140, SV-12141) · 13 HOLD "needs
  records and screenshots captured before the release" · 1 HOLD "needs more rows than any test site holds". All stamped
  "Last checked against build v26.45.2-6a8b89c". "Run on Production After Release" folder (133628): 13 cases — after the release only.
- **Run 557** https://shopview.testrail.io/index.php?/runs/view/557 "… - Execution": 380 tests, all Untested, all assigned to Mudassir
  Qamar (user 6).
- Build verification was done by another session today (branch claude/build-verification-setup-aieu36, `build/ar-ap-aging-bv/`; facts
  only, Rule 119): observed labels, role-form labels, address-bar filter keys (pastDue, locationIds, customerIds, vendorIds).
- `needs-map.json` (`needs_map.py`): what each test needs — 72 CSV, 62 PDF, 28 keyboard, 26 dark mode, 10 future-due bills, 9 role
  without AP/AR data, 8 with 100+ documents, 7 same-day credits, 7 role without document permissions, 6 second location, 5 vendor-return
  credits, 5 large data, 4 name-sort set, 4 role without Customers view, 3 same-date/evening invoices.

## Environment
- QA site https://sv11315.qa.shopview.com (API https://sv11315api.qa.shopview.com), build **v26.45.2-6a8b89c**, awake (app 200, api 401
  unauthenticated) on 10 Nov ~18:10 UTC.
- Sign-in values the QA lead gave 10 Nov: `/tmp/shopview/sv11315.env` (chmod 600; SV_SSO_SESSION, a "v1." token, CF_CLEARANCE) —
  never committed. **Not used yet**: an admin quick-login evicts anyone else signed in as admin on the branch (playbook §A), and the
  build-verification session was working there today.
- No QuickBooks needed (developer, Slack reply).

## His answers (10 Nov 2026): "1A 2A 3A 4A" — still NOT told to start
1. **GENERAL scope** (Rule 110): tested against PRD v11 + the developer's handoff notes; no old-vs-new comparison beyond the suite's own
   "Release day and what must not change" folder.
2. **Results go into run 557** (Mudassir's); he can pick up anything Blocked.
3. **PRD v11 read once at the start** and every test checked against it: done 10 Nov — `sources/prd-947650561-v11-read-1110.md` (v:11,
   58,618 chars, 113 rule ids); `quote_check.py` → 931 quoted sentences in 363 tests, **all word-for-word in v11** (the 9 hits the
   script printed are not PRD quotes: design notes / a Chris ruling / two Technical Implementation Plan quotes for S3-R10 and S5-R3 —
   checked by eye); 17 tests quote no PRD rule.
4. **Sign in when he says start**; anyone signed out signs in again.


## Execution progress — run 557 (11 Nov 2026, QA site sv11315, build v26.45.2-6a8b89c)
- Live run tally after S2 batch a: 25 passed · 2 failed · 2 blocked · 351 untested.
- Failed (ticket HELD for the QA lead, draft `tickets-held/01-open-group-loads-all-documents-at-once.md`): C1062570, C1062571 — an open group on A/R Collection / A/P Unpaid sends all its documents at once (PRD S1-R8 says 100 at a time).
- Blocked (QA lead to decide retire/keep): C715277, C715279 — the product refuses customer names that differ only in capitals/accents.
- Expect-fail tests that PASS (fix is on the branch): C715282, C715283 (SV-12138, TESTING QA).
- Waiting for the location's midnight (07:00 UTC 11 Nov): C1062566 (credit memo CM11315-4194 + deposit DEP11315-4712 dated 10 Nov, customer ZZAUTOTEST CREDIT DAY B); reminder set.
- Seeded data (ZZAUTOTEST, all on sv11315): customers S1R5 Alpha/Bravo, CREDIT DAY A/B, OVER100 C (105 invoices); vendors S1R5 V Alpha/Bravo (bills 9917/10023/10024/ZZBR-1), NEG PASTDUE V2 (Net 30), VCREDIT V (credit C-13668 dated 5 Nov), OVER100 V (105 bills). Tech ShopView role restored to Technician.
- Tooling: exec/sortlib.mjs + s2_run.mjs (scenario JSON) for S2; exec/filt.mjs (filters/as-of); exec/ann.py + s2_pics.py (pictures from recorded boxes).

- 06:00 UTC 11 Nov: 68 of 380 finished (64 passed, 2 failed - ticket held, 2 blocked). Queue running: S4 (s4_run) → export re-shots (s3r) → p35 seed + S5 filters (s5_run) → C715305 re-run → C715317/C715320 re-run (s2c) → S2 batch d (20 sorts) → S6-S9 + release (s78_run). Then: p36 (RUN_P36=1, exact-amount invoice probe) before the Totals seeds; C1062566 after local midnight; C797943 needs an organisation with ≤ 8 vendors (second org); C715383 needs 9 locations with A/R data (do LAST, it changes the Location lists); C715384/385 need an Admin enrolled at one location (Tech + Admin role).
- Asked the QA lead (11 Nov ~06:05 UTC): file the held ticket? retire/keep the two blocked name tests? (+ C682419 step 8 eye-check from before).

- QA lead answers (11 Nov): (1) tickets: file AFTER all tests are complete, one by one with his approval; (2) C715277/C715279 retired (section 134653, removed from run 557 -> 378 tests); (3) noted.

### 11 Nov 2026 ~06:30 UTC — progress and open points
- Run 557 now: 68 Passed · 2 Failed (C1062570/71, ticket held until every test is done) · 308 untested. S4 first four recorded: C715355, C715358, C715359, C715360.
- Strict serial queues (one sign-in at a time): queue.sh (s4 → p35 → s5 → s2b4 → s2c2 → s2d → s78) → queue2 (p38 exact-amount capture) → queue3 (s3x: C715342/C797942 A/P Detail exports at ≤800 rows, PDF wait 240 s) → queue4 (s3t: C715350-353 pop-up re-shoot) → queue5 (s4b: C715357 re-run). Each waits for the previous queue AND for no `node *.mjs` running.
- Pop-up pictures: one shot at first sight caught the message before it slid in (twice). explib now takes three shots 0.4 s apart (`<tag>-toast-1..3.png`).
- OPEN: A/P Detail PDF at 1,783 rows (as of 04/01/2025) gave NO file and NO message within 60 s, on two tests. Under the PRD's 2,000-row limit a PDF should come. s3x re-runs with fewer rows and a 240 s wait and records the server replies. If small sets work but ~1,800 rows silently does nothing, that is a candidate finding (prove it before calling it, Rule 104).
- C715342: the seeded S1R5 vendors have no bills before 2026. On an earlier as-of date, vendor A is now the first vendor with open bills that day (read from A/P Unpaid).
- **OPEN (11 Nov ~07:20 UTC) — browser Back, C715393 / C715397.** After a filter change (location, or Past due), Back left the report and returned to the page opened before it. It did not undo the filter change, so filter changes appear to *replace* the address rather than add a history step. PRD S5-R10 reads "kept in the page address … so browser Back, a reload and a shared link restore them". That sentence can mean either (a) Back undoes a filter change, which is what our two tests expect, or (b) after leaving the report, Back returns to it with the filters. Under Rule 58 this is an ambiguous source, so neither test is failed yet. p39_back.mjs (queue11) measures both readings and Sales By Customer as the control; then the question goes to the QA lead. Results not yet recorded for these two.
- **OPEN (11 Nov ~07:45 UTC) — date A = 01/01/2025 for C715392 / C715607.** On that date only one location has A/R data, so the Location chip hides, and A/R Collection shows "No record matches" (no overdue documents that day). The screen therefore cannot show which location is the one left. p41_dateA.mjs (queue15) reads each report's location list and rows for that date. Both results are held until it confirms the location is Staging Heavy Duty - 9919. If it does not, pick another date A.
- **CORRECTION PENDING (11 Nov ~07:55 UTC) — C715360 / C715361** (Passed, recorded ~06:35/07:10). Their comments say "no line repeated" over 153 / ~7,600 lines, but the reader compared only the first 100 (L0626). The paging itself was observed through the server replies. Re-test queued (queue18, s4x_paging.mjs, fixed reader; A/R all lines, A/P first 500). New results will state exactly how many lines were compared. C715317/C715320 re-run in the same queue (yesterday = 10 Nov; customer/vendor with documents at both locations).
- 11 Nov ~08:15 UTC: run 557 = 106 Passed · 2 Failed · 270 untested (378 tests). Cross-checked live against every RESULTS-*.json: all match, apart from the two retired cases. C715350-353 recorded only now (with the pop-up pictures); C715342/C797942 Passed at as-of 02/01/2025.
- **Back-button question measured (11 Nov 08:57 UTC, p39_back.mjs, p39/out.json + pictures).** On A/R Collection (location filter), A/R Summary (Past due) AND Sales By Customer (the native control the PRD points to), a filter change REPLACES the address: history.length is unchanged, and Back leaves the report for the page opened before it. Leaving to another report and pressing Back returns with the filters restored. PRD S5-R10: "kept in the page address … so browser Back, a reload and a shared link restore them". C715393/C715397 step 5 expect Back to UNDO a filter change. Put to the QA lead with a recommendation; both held (no result) until he answers.
- 11 Nov 09:05 UTC, p41: on 2025-01-01, A/R Summary and A/R Detail list only Heavy Duty, but A/R Collection lists NO location (nothing overdue). On 2024-12-01 every A/P report lists only Lethbridge (location B). So the first date-A picks for C715392 / C715607 (Collection) and C715609 (Unpaid) were invalid. findDateA now reads the report's own location list (1st and 15th of each month) and requires Heavy Duty alone; re-run in queue28. C1062579 (A/R Summary, 2025-01-01 = Heavy Duty only) stands.
- 11 Nov 09:27 UTC: stopped the s2d sort batch by hand. 14 of its 20 tests need test-made documents with exact amounts or exact due dates (C715289, 290, 292, 293, 295, 296, 300, 303, 304, 308, 310, 311, 588, 591), and several scripts had fewer clicks than the test (the third click). Those wait for the exact-amount route (p42, now next in the queue). The 6 tests that fit (C715299, 307, 312, 314, 323, 593) are re-queued with s78 as queue30. No recorded Passed result depended on exact-amount data (checked).
- 11 Nov ~10:00 UTC: run 557 = 128 Passed, 2 Failed (C1062570/71, ticket held), 248 untested. Passed today since last note: C715362, C715364, C715365, C715367 (pinned rows / scroll-loading). Seeds: p46/out-R3.json (R2-R6, R10-R14), p46r4/out.json (R1, R8, R9 exact incl. today), p46r5 queued (R12, R15 overpaid). Queued: s2x (exact sorts), p48 (PDF 2,000 lines, C715467/469), s9 (A/R totals), then queues 24-30. Meeting dashboard: https://claude.ai/artifact/E6MSrJDofWwCjyYii6tKTg (file snapshot of run 557; re-upload aging-run-results.csv to refresh).
