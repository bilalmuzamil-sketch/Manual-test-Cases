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
