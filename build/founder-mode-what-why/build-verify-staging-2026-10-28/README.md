# What/Why (Title and Description) — build verification on staging, 28 Oct 2026

**Ordered by the QA lead, 28 Oct 2026:** build-verify TestRail group 20437 *What/Why* (Founder Mode, September
2026) — first named as the QA site qb1.qa.shopview.com, then corrected the same turn: *"This needs to be build
verified on staging https://app.staging.shopview.com/workorders/cfbd624e-03aa-4553-b40f-6e3923ae8fc0/lines"*.

## Setup (recorded before any check)

| Item | Value |
|---|---|
| Build under test | staging, `v26.43.1-f2d183d` (read from the sign-in page, 28 Oct) |
| Product code (Rule 117) | ShopView/shopview `develop` at `f2d183d5544c77ddf6870d9916f78eb82f14c833` (merge of PR #3553, SV-10130 Title and Description) — `/home/user/shopview`, read-only, finding aid only, never the Expected |
| Why not qb1 | qb1 runs branch `qb1` at `27bb6a2` (= its marker v26.43.2-27bb6a2), which is SV-11275 QuickBooks work, not SV-10130; QA lead redirected to staging |
| Sign-in | new `sv_sso_session` (in /tmp only) works on staging: admin, 59 front-end permissions |
| Example record | work order S2-16710, Staging Heavy Duty - 9919, Lines tab shows "SHOPCOACH LINE BUILDER" with "Build Lines" |

## Suite, read live from TestRail 28 Oct

68 cases (S1 12 · S2 4 · S3 26 · S4 9 · Design 17), all created by our account (user 3), none Automated
(`custom_atmstatus` 1). Markers: 63 `HOLD - not yet build-verified`, 5 `READY - EXPECT FAIL`. No case names a
build yet (never build-verified). Last edited 28 Oct 04:41 UTC by the test-writing session.

## Source currency (facts from the test-writing session's records, branch `claude/slack-session-setup-7v5itm`)

PRD Confluence 845348896 **v16** saved 28 Oct (15 cases rewritten to it, 46 keep v15 quotes that are word-for-word
in v16); epic SV-11257 and Jira read 27 Oct (incl. open bug SV-11850, ShopCoach Build Lines shows nothing on
staging); design copy 27 Oct; tech plan 13 Oct. Rule 81 ask put to the QA lead 28 Oct — answer **"Without re-checking"**; handover: **"It has finished"**.

## QA lead's rulings during the pass (28 Oct 2026)

- Scope split: *"QB testing: qb1.qa.shopview.com (sv10130 backend) — This is for Quickbooks"*. Checked on screen: qb1
  (v26.43.2-27bb6a2, branch `qb1`) still shows the old labels "What are you doing?" / "Why are you doing it?" and calls
  the sv11275 backend; its code still builds the old QuickBooks/report text. Blocker gate 7/7:
  `BLOCKER-qb1-no-what-why.json`. Staging: invoices from Staging Heavy Duty - 9919 land in QB Unexported ("The Class mapped
  in your Bookkeeping settings no longer exists in QuickBooks"), seen for our own throwaway invoices S2-38102 and S2-38103.
  → Asked; answer **"Hold them for now"**: the six QuickBooks cases (C154715 C154721 C549084 C549085 C549087 C847723) get
  their ShopView-side setup checked on staging and a plain HOLD reason.
- Capitalisation: the line window capitalises the first letter of Title and Description on leaving the box (LineDialog
  `capitalizeLineName`/`capitalizeDescription`, in the product since at least June 2026; observed: typed "excessive play",
  stored "Excessive play", probe 07). → Asked; answer **"Capitalise the examples"**: example text starts with a capital in
  the setup and in the matching example lines of the expected results; quotes from the documents are not touched.

## Result (written 28 Oct 2026, apply.py → write-log.txt, 68/68 verify=OK)

Every case: setup made concrete (Admin role and location Staging Heavy Duty - 9919 with how to check/change it; how to make
the work order, the line, the tech story, complete and invoice; Settings routes with tab, heading, switch and Save button),
steps worded to the build (Export not Download, Today in Date Range, Select CSV File / Import Invoices, IMPORTS not Data
Import, Download Template, List button, Search, Estimate/Invoice), stamp "Last checked against build v26.43.1-f2d183d
(staging) on 10/28/2026." Example text capitalised in 24 cases per the ruling (document quotes untouched).

- READY (52): every case not listed below.
- READY - EXPECT FAIL (SV-11850, open 28 Oct) kept (5): C154711 C154712 C549079 C839526 C839527.
- HOLD (11), plain reason in the marker: QuickBooks side C154715 C154721 C549084 C549085 C549087 C847723 · ShopCoach line
  needed (SV-11850) C549080 · second user with a custom role not confirmed C154719 C549088 · receiving a part not confirmed
  C154722 · clear (x) button in Title after a canned line not seen C154708.

Gates: check_tester_runnable PASS 68/68 · check_runnable_cases 63/68 (the 5 are held QuickBooks cases: "Open invoice A." inside
QuickBooks, which cannot be seen) · check_precond_labels: one value not observed (the stored "tech story missing" text, C549082
C839523 C839524) · on-screen display 68/68 fr-view (served-68.json).

Seen in passing (no verdict, lane limit): the New Line window also shows "Line Approved" and, once a title is typed,
"SHOPCOACH LABOR GUIDE" — C154710 and C839513 list the window's contents without them.

Left on staging (ZZAUTOTEST, throwaway): work orders S2-38102 and S2-38103 (4 Star Truck Repair), invoiced; both sit in QB
Unexported. The shared Admin's location was switched to 9919 once by API and put back to DVI Test (HTTP 200).

## Follow-up, 28 Oct 2026 (QA lead: "Yes please" to the four screens; "Do what is scientifically correct and does not bite me" on QuickBooks; "Yes" to the ask rule)

- Fresh sign-in supplied after the morning one expired (failed twice on staging and once on qb1 as control).
- Walked on staging 9919 (probes 17-22, throwaway work orders S1-38104 at DVI Test and S2-38105 at 9919):
  - Receiving a part: + Add Part (Part number, Description *, Qty *, Category, Cost, Sell price *) → Save → status
    "Auth To Order" → Order → "Awaiting Receive" → Receive → "Receive parts" window (Assign vendor, Vendor Invoice Number,
    Invoice Date, Delivery Note, Cost, tick, Receive Parts (1)); the button stays disabled until vendor, vendor invoice
    number, part number and cost are filled; after reload the part no longer shows Awaiting Receive. → C154722 READY (apply2.py).
  - Title clear (x) after a canned line: present in the page as a hidden "Clear" button, never shown (pointer over it; box
    selected). → C154708 HOLD with that reason. Seen in passing: after a canned line is picked the New Line window shows only
    Title, Line Approved, Save & Add Line, Save & Close.
  - Second user: staging's quick sign-in offers only "Admin" and "Tech" (GET quick-login users). → C154719 C549088 HOLD with
    that reason. New Staff Member window read, nothing saved.
- Gates on the four: tester-runnable 4/4, runnable 4/4, display 4/4 (served-4.json).
- PO questions added to Chris Ward's Doc (1QcT7FRZ…, read back, revision after write AHj4eMTXFYI1…): heading "Design vs Build
  discrepancy, 28 October 2026" with Q15 (Line Approved: build shows it, page S1-R7 "same fields", design silent) and heading
  "New questions, 28 October 2026" with Q16 (no way to clear a picked canned line: page S1-R4 implies empty again, design silent).
- QuickBooks: left on HOLD and staging's QuickBooks setting NOT changed. Reason: qb1 is running SV-11275 ("QuickBooks default class
  fallback"), the very behaviour behind staging's missing-class errors, so staging's broken class may be someone's test condition;
  and a result measured on a link we repaired by hand would not show what the released change does. The correct test is on a site
  carrying both this change and its own working QuickBooks link.
- Rule 99 amended (context, real example, recommendation in every ask); CLAUDE.md §1 19,756 B after the edit.
- Final: READY 53 · READY - EXPECT FAIL 5 · HOLD 10 (QuickBooks 6, ShopCoach 1, second user 2, clear button 1).

## Second follow-up, 28 Oct 2026 (QA lead: "Always give complete context" · "Always use such work arounds" · "Please tag him" · "nothing should halt you … Make it a rule")

- Chris Ward tagged (person chip chris.w@shopview.com) on its own line under both new section headings, as on 27 Oct.
- Shared Tech workaround (probes 23-29, 28f): role "ZZAUTOTEST User B - no invoices" (Page Access → Reports only) created;
  Tech ShopView (tech@shopview.com, role Technician) given it via Settings → Staff → Search → edit → Role → Save & Close; Tech
  quick sign-in then showed Dashboard + Reports and Export Reports listed Customer Invoice; Tech restored to Technician (6
  permissions read back). Earlier attempts opened "Nebojsa Custom Tech" by mistake (unfiltered search) — Save never fired,
  that row still reads Custom Tech. → C549088 READY with the recipe and a restore step (apply3.py).
- Role editor: ticking Invoicing & payments View raises "Enable See Financial Data? Invoicing & Payments requires See Financial
  Data." → the C154719 user cannot be built → HOLD with that reason; Q17 added to Chris's Doc (build vs page S3-R10 + Story 3).
- Checks on C549088, C154719: tester-runnable 2/2, runnable 2/2, display 2/2 (served-2.json).
- Rules: 99 second amendment (suite + C-ids in every ask), 107 amendment (shared-account workarounds), Rule 118 added.
- Final: READY 54 · READY - EXPECT FAIL 5 · HOLD 9 (QuickBooks 6, ShopCoach 1, financial-data user 1, clear button 1).
