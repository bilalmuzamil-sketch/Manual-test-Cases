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
