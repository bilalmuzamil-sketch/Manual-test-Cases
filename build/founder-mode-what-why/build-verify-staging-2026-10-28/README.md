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
staging); design copy 27 Oct; tech plan 13 Oct. Rule 81 ask put to the QA lead 28 Oct — answer pending.

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
