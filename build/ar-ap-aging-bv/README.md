# A/R and A/P Aging Reports (SV-11315) — build verification on sv11315 (started 10 Nov 2026)

**Order (QA lead, 10 Nov 2026):** "We need to start build verification for this now" — TestRail group 90418 "A/R and A/P Report Sorting,
Export and Location Filter" (suite 1, under Founder Mode 20434); QA site https://sv11315.qa.shopview.com/. Lane: build verification.
Developer handoff: Slack https://shopview.slack.com/archives/C0C454MLP0T/p1794309579559929 (Nemanja Djuric, 10 Nov) and the shared notes
on the epic, https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616 (read 10 Nov; facts only).

## His answers (10 Nov 2026)
| Question | Answer |
|---|---|
| PRD is v11 (5 Nov, "QA answers"); tests quote v9 (26 Oct) + Chris's 4 Nov answers | Writing session first: the test-writing session updates the tests to v11; meanwhile this session walks the six reports without writing any test |
| Setup clicks | Same as before (Parts Lifecycle, Technician Toggle): preconditions state what must be true; hard-to-make states go to a "Setup needed before testing" folder with a separate, plain Setup list per test |
| Mudassir's run (557, 356 tests, all untested) | He waits until this session reports the suite build-verified |

## Facts
- Live census 10 Nov: 356 tests in 12 folders, all ours (created_by 3), none Automated; markers: 333 "HOLD - not yet build-verified (no build yet)", 13 HOLD "needs records and screenshots captured", 1 HOLD "needs more rows…", 9 READY - EXPECT FAIL (SV-12138..SV-12141). `census-2026-11-10.json`.
- PRD Confluence 947650561: live version 11 (5 Nov 2026, Chris Ward, "QA answers"); tests cite v9 (489 quotes) and v5 (77).
- QA site build label `v26.45.2-6a8b89c` (index.html 10 Nov 10:27 GMT). The label's commit is not on the feature branch (same pattern as sv11788: develop's merge commit). Code reference (finding aid only): branch `SV-11315-ar-ap-aging-reports` head `8e35ee0d` (the handoff's head), clone at `/home/user/shopview`.
- Container note: `build/testing-tools/ensure_bridge.sh` must be run from the repo root (it starts `build/atlassian-login/bridge.mjs` by relative path).
- TestRail API accepts the committed account login (`build/ENVIRONMENT-CREDENTIALS.md` §4) — written to `/tmp/testrail/creds.json` only.

## Walk so far (probes 01–02, `probe/`)
- Reports left menu sections (shown upper-case): PERFORMANCE (… Sales By Customer …), ACCOUNTS RECEIVABLE (A/R Aging Summary, A/R Aging Detail, A/R Aging Collection), ACCOUNTS PAYABLE (A/P Aging Summary, A/P Aging Detail, A/P Unpaid Invoices).
- Titles: "A/R Aging Summary", "A/R Aging Detail", "A/R Aging Collection", "A/P Aging Summary", "A/P Aging Detail", "A/P Unpaid Invoices Report"; each with an info icon and the ⋯ "Export report" menu: "Download (PDF)", "Download (CSV)".
- Filters: "As of: <date>" (calendar), "Customer: All customers" / "Vendor: All vendors" (search, list), "Past due: Any" (1-30 days, 31-60 days, 61-90 days, 91+ days), "Location: All locations" (Select all, <n> selected, the locations, Clear selection).
- Headings: Summary — Customer/Vendor · Location · Current · 1-30 Days · 31-60 Days · 61-90 Days · 91 And Over · Total; A/R Detail — Date · Location · Transaction Type · ID · Customer Full Name · Due Date · Amount · Open Balance; A/R Collection — Date · Location · Transaction Type · ID · Due Date · Past Due · Amount · Open Balance; A/P Detail and A/P Unpaid — Date · Location · Transaction Type · No. · Vendor Name · Due Date · Past Due · Amount · Open Balance.
- Group rows "91 or more days past due (55) … Total"; after Expand all, "Total for 91 or more days past due"; header button "Expand all buckets" / "Collapse all buckets" (A/R Collection "Expand all customers", A/P Unpaid "Expand all vendors"). A/R Collection group row shows "Phone:" and "Credit term:".
- Profile menu: Light / Dark.
