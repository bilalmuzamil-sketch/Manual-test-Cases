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

## Walk, probes 03–06
- "Switch location?" prompt (a document at the other location): "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?" · Cancel · Switch location (Cancel used; nothing switched).
- Location → Clear selection gives "Location: No locations"; empty state "No record matches these filters" / "Try changing filters to widen your results." / "Clear all filters" (which brings back "Location: All locations").
- Role form (Settings → Roles & Permissions → Create Custom Role → Choose a template → Skip; never saved): cards "Work orders", "Customers",
  "Invoicing & payments" (View · Create & Edit · Delete / Reverse), "Timesheets", "Parts Department" (a switch that reveals "Part sales",
  "Catalog and Inventory", "Vendor and order management", each View · Create & Edit · Delete), the "Page Access" card (rows "Reports",
  "Customer portal", "Settings", "Billing Portal"), and the switches "See Financial Data" and "View and Manage AP/AR Data".
  **Wording to align in the tests (labels only):** "Reports → Page Access" → the Page Access card's "Reports"; "Invoicing & Payments →
  View" → "Invoicing & payments → View"; "Work Orders → View" → "Work orders → View"; "Part Sales → View" → Parts Department → "Part sales →
  View"; "Vendor Order Management → View / Create & Edit" → Parts Department → "Vendor and order management → View / Create & Edit".
- Address bar after filtering: `pastDue=31-60`, `locationIds=<id>`, `customerIds=<id>`, `vendorIds=<id>`.

## Still to see during the write pass (per test, after the v11 update)
PDF and CSV contents, dark theme, Ctrl-click into a new tab, a role without Reports page access, the error messages (network blocking),
the PDF row limit on the large A/P data, the location column wrap at 1440 px.

## Pass 1 — written 10 Nov 2026 (`apply1/`)
- All 380 tests (after the writing session's v11 update): the build line now reads "Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026."; 357 "Not available on Build" markers became `AUTOMATION: READY` (HOLD and EXPECT FAIL kept); 30 tests' role labels aligned to the screen; 51 first-step anchors added (where to click to start); one note's code "S8-R3" replaced with plain words. Guarded writes (ours, not Automated, text unchanged), 380/380 read back OK (`apply1/write-log.txt`).
- Checker fix (dated comments): a camelCase word directly followed by "=" is an address-bar key the tester reads (`pastDue=`), not an internal code — `check_tester_runnable.py`, `check_runnable_cases.py`.

## Setup recipes walked — probes 09–58 (10 Nov 2026)
Every click path the Setup lists use was done on the QA site, with throwaway records named ZZAUTOTEST: `apply2/RECIPES-SEEN.md`
(what was clicked, the result, the evidence folder, what was NOT seen, and the data left on sv11315). Findings worth knowing:
- Any exact invoice amount: New Line → Labor Rate "Fixed Line Total" → type the amount.
- Closing the "New Customer Payment" window with × right after Create Invoice took the new invoice away again (S11315-17583 disappeared and its work order went back to Complete); reloading the page kept it. The Setup lists say "reload, do not close with ×". This is outside this suite's tests; reported to the QA lead as an observation only (no ticket — hold H1).
- A deposit held on a work order is not on the A/R reports; only the part left over after that work order is invoiced is, dated the day of the invoice.
- "Due on Receipt" makes an invoice due on its own date; vendor terms other than Net 30 were not tried.
- The second location ("Staging Lethbridge - 4310") has its own, longer Labor Rate list: type "Fixed" to find "Fixed Line Total".

## Pass 2 — Setup lists, written 10 Nov 2026 evening (`apply2/`)
- 142 tests were classed as needing records (`hard-classes.json`). 9 need nothing made (their states were seen on the QA site), so **133 tests** got a separate, plain **Setup** list after their Preconditions (Rule 119), built only from their own preconditions by `apply2/setup.py` + `apply2/manual.py`, and were moved into the new folder **S133629 "Setup needed before testing"** under 90418 (origin folders in `apply2/move-origin.json`). 133/133 written and read back; 133/133 read back in S133629.
- 44 of them carry "Partly checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026; not yet seen on that build: …" naming what was not walked (signing in as Tech with another role ×14, a third location ×8, paying part of a bill ×6, a bill due on its own date ×6, and smaller ones — full list from `apply2/plan.py`).
- Correction write: 90 tests' Setup lost the quote marks around names the tester types and cross-references (not screen labels). 90/90 read back.
- `check_precond_labels.py` (dated comment): a design-picture caption followed by its attachment file name, and a name the tester types ("named "…"", ""…" (customer A)"), are not read as screen labels; nor is the text between two quoted single characters.
- Gates: offline `check_runnable_cases` 0 fails and `check_tester_runnable` 0 fails on all 380 with the new text; live `verify_suite.py --root 90418 --observed build/OBSERVED-UI-LABELS-sv11315.md --run 557 --build v26.45.2-6a8b89c` **ALL CHECKS PASSED** (380 sourced, READY 357 + EXPECT FAIL 9 = 366, HOLD 14, 0 not runnable, precondition labels clear, run 557 = 380 tests, none missing).
