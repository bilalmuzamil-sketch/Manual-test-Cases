# Filter recheck, worker F4 (29 Oct 2026): IBS, Notes, QB Unexported, Export

Nothing was written outside the repo: no Jira, TestRail or Google writes, and no git add or commit.

- **Build:** `v26.43.2-f8698cb` on every screen run, read from `<meta name="app-version">`. It has not changed.
- **Session:** my own session, `/tmp/cln/f4/sess.txt` (mode 600), used for every server read.
- **Rule 99:** every check ran in the location's own zone, recorded in four places: the session's change-location (HTTP 200), the process TZ, the browser timezoneId, and the app's `localStorage['timezone']`. Each `meta.json` records `browser_zone` (read inside the page), `process_zone` and `location_tz`.
- **Fresh context:** every screen run is a new boot2 browser context. Its storage holds only what boot2 writes (login data and `timezone`), plus the app's own `localStorage['location']` key on the QB, IBS-Lethbridge and D7 runs. That key is the same as picking the location in the header, which is each ticket's step 2. The page then adds `organization_features` and `mode`, and `sentryReplaySession` in session storage. None of these keys holds a filter.
- **Tools:** `tools/f4/`: `f4_server.py` (server reads), `f4_screen.mjs` (screens), `summarise.py`, `mint.mjs` and `common.py`.
- **Evidence:** `evidence/f4/`: `server_<hd|leth|dvi>.json`, plus one folder per screen mode holding its `meta.json`, the requests the page made, and the replies it got.
- **⚠ Trap found (Rule 93):** two boot2 browsers launched AT THE SAME TIME for the same admin end up on each other's location. Both runs showed the wrong location in the header.
  - Those two runs are kept as `evidence/f4/INVALID-parallel-*` and are not used for any verdict.
  - Every run used below was done alone, and its header shows the right location.
  - The likely cause is that the location is held per user rather than per browser session. That means other workers' runs could also flip it, so the header location is checked in every `meta.json`.

The verdicts use AMENDMENT 1's wording (KEEP AS IS / KEEP, EDIT / OBSOLETE / NOT REPRODUCED NOW).

---

## SV-11953 (D2): IBS Batches, a sent batch's Total is $290.06 more than its invoices

**Verdict: KEEP AS IS.** No filter can be deselected that would change this batch.

**Controls on the screen** (Reports → Accounting → IBS Batches):
- tabs Ready To Send / Sent / Payments;
- the page Search (kept per browser tab and mirrored to `?search=`);
- column sort arrows on Date, Type, No., Customer, Total, Balance and Status;
- the location picker in the header.

There is no date control and no customer picker.

**Fresh defaults** (`evidence/f4/ibs-leth/meta.json`, America/Edmonton; this run was done alone and its header shows "Staging Lethbridge - 4310". An earlier run made alongside others gave the same figures and is kept as `SUPERSEDED-parallel-ibs-leth`):
- The page opens on the Ready To Send tab with an empty search. The URL has no query values, and no filter is held in storage.
- The page's own requests are `list-batches?pagination[sortBy]=date&pagination[descending]=true&pagination[page]=1&pagination[rowsPerPage]=1000&search=`, and the same shape for `list-transactions`. That means every row, with no search.
- **Hidden filters:** none.

**Is each filter the thing being tested?**

| Filter | Subject? | Reason |
|---|---|---|
| Sent tab | **YES** | The defect is about a sent batch's Total. The tab is where sent batches are, not a narrowing. |
| Location (Staging Lethbridge - 4310) | **NO, but it cannot be removed** | IBS Batches shows one location at a time. The profile menu's "Change Location: <one location>" picker lists the user's locations, one at a time, with no "all locations" choice (`qb-hd/meta.json` `location_switcher`; the picker's options come from the user's own locations list). The batch exists only at Lethbridge. |
| Search | **NO** | It is empty in the ticket and on a fresh open. |
| Sort | **NO** | Sort only reorders rows; it does not change the sum. |

**Runs:**
- **(i) As the ticket says, (ii) fresh defaults, and (iii) widest** are the same request here, because no filter is applied anywhere.
  - Screen (Sent tab): row "Oct 2, 2026 $9,473.35 $9,473.35 Unpaid". When opened, it lists 9 invoices: 45.94 + 123.11 + 659.76 + 356.48 + 503.39 + 733.51 + 1,231.39 + 1,298.23 + 4,231.48 = **9,183.29**.
  - Server (`server_leth.json`, session at Lethbridge): batch `7af04085`, amount 9,473.35, balance 9,473.35, 9 invoices summing to 9,183.29, no credits, **difference 290.06**.
  - The other Lethbridge batch (Sep 16, $7,859.73, 3 invoices and 1 credit) adds up on both the screen and the server.

**Expected-value check:** the Expected figure ($9,183.29) is the sum of the same batch's own rows, with no filter involved. **Server and screen agree.**

**Ticket text:** the steps use no unneeded filter. They switch the location, which is unavoidable, and open the Sent tab, which is the subject. No edit needed.

---

## SV-11954 (D3): IBS Batches, a $0.00 invoice is listed in Ready To Send

**Verdict: KEEP AS IS.**

**Controls:** the same as SV-11953.

**Fresh defaults** (`evidence/f4/ibs-hd/meta.json`, Asia/Karachi; header "Staging Heavy Duty - 9919"):
- The page opens on Ready To Send with an empty search.
- The request is `list-transactions?…rowsPerPage=1000&search=`, and the reply holds 8 rows.
- **Hidden filters:** none.

**Is each filter the thing being tested?**

| Filter | Subject? | Reason |
|---|---|---|
| Ready To Send tab | **YES** | It is the list that must leave out $0.00 invoices. |
| Location (Staging Heavy Duty - 9919) | **NO, but it cannot be removed** | The list is per location, and the invoice belongs to Heavy Duty. Lethbridge's Ready To Send is empty (`server_leth.json`: 0 rows). |
| Search | **NO** | It is empty. |

**Runs:**
- **(i), (ii) and (iii) are identical**, because no filter is applied.
  - Screen: 8 rows, including "Jul 31, 2026 Invoice INV-S2-16924 Fort Mohave Diesel Repair $0.00 $0.00 Unpaid".
  - Server: 8 rows. The only $0.00 row is S2-16924 (amount 0, balance 0, unpaid).
  - The server returns the same 8 rows when an empty `search=` is sent.

**Expected-value check:** none needed. The Expected result (not listed) comes from Chris Ward's answer and does not depend on a filter.

**Ticket text:** no edit needed.

---

## SV-11955 (D4): Notes shows only the first 100 notes

**Stopped.** The QA lead moved this ticket to Obsolete and out of the epic during the recheck, and the coordinator told me to stop. What was already recorded is kept below, and nothing more was done.
- The Jira and Confluence search for a Notes report spec was not run.
- No picture was annotated.

**Recorded before the stop** (`evidence/f4/notes-hd/meta.json`, `server_hd.json`; Asia/Karachi; header "Staging Heavy Duty - 9919"):
- **Fresh default Date Range: "This Week"** (25–31 Oct in Karachi; the request window is 2026-10-24T19:00Z → 2026-10-31T19:00Z). Sort By: Newest First. Filter by Author and Filter by Mention are empty, and the URL has no query values.
  - The screen shows **9 notes**, and the server has 9 (`hasMore:false`).
  - So with the page's own default there is no 100-note stop to see.
- **All** (the URL becomes `?range=all`; the request has no date filter, author or mention): the screen shows **100 cards** and makes no further request; there is no pager or "load more".
  - The server reply is `rowsPerPage:100, hasMore:true`. Page 2 exists (100 more rows), and the full total is **2,545**.
  - So 2,445 notes cannot be reached from the screen.
  - The last card on screen is "Admin ShopView, Work Order S2-35105, 08:21 PM, Oct 20, 2026".
  - Picture, unannotated: `evidence/f4/notes-hd/1-all-bottom.png`.
- **Last Week**: the app sends 2026-10-17T19:00Z → 2026-10-24T19:00Z. That is Sun 18 Oct 00:00 → Sun 25 Oct 00:00 in Karachi, so **18–24 Oct**, which matches the ticket.
  - The screen shows 100 cards; the server total is 255.
- **This Month**: 100 of 326. **Last Month**: 33 of 33. **Today**: 0.
- **What records the notes come from** (all 2,545 notes):
  - work_order 2,165 · work_order_line 317 · vehicle (Asset) 43 · customer 12 · part_sale 8;
  - by who made them: user 2,362 · system 183.
  - None of the notes is about a report. In the menu, Notes sits under **Reports → COMMUNICATIONS → Notes** (next to Reminders), after the ACCOUNTING group.
- **Possible error in the filed text**, not followed up because of the stop: the ticket says "Notes are shown for the whole organisation".
  - A server read with the Lethbridge location header returned 592 notes, against 2,545 for Heavy Duty, so the list may be per location.
  - The screen check at Lethbridge was among the invalid parallel runs, so this is **NOT VERIFIED**.

---

## SV-11956 (D5): QB Unexported, credit memo rows have a blank No.

**Verdict: KEEP AS IS.**

**Controls on the screen** (Reports → Accounting → QB Unexported):
- tabs Customers (2,421) / Vendors (819) / Journal Entries (84);
- the location picker.

There is **no** date control, search box, column chooser or customer picker. The table pages itself 30 rows at a time as you scroll.

**Fresh defaults** (`evidence/f4/qb-hd/meta.json`, Asia/Karachi, header "Staging Heavy Duty - 9919" at start and end):
- The page opens on the Customers tab, with no URL query and no filter in storage.
- The page's requests are `unexported-items?pagination[page]=N&pagination[rowsPerPage]=30&pagination[sortBy]=&filters[0][field]=groupName&filters[0][value]=customer`. That is only the tab's group, no other filter.
- **Hidden filters:** none.

**Is each filter the thing being tested?**

| Filter | Subject? | Reason |
|---|---|---|
| Customers tab | **YES** | Credit memos are customer documents. The tab is a grouping, not a narrowing. |
| Location (Heavy Duty) | **NO, but it cannot be removed** | The report is per location. The blank No. shows at **both** locations checked, so the location cannot explain it. |

**Runs:**
- **(i), (ii) and (iii) are the same**, because no filter is applied. The page was scrolled to the end, all 81 pages × 30 rows.
  - **Heavy Duty, screen data** (the page's own replies): 2,421 rows. Credit Memo Create has a blank No. on **255 of 255** rows. Credit Memo Apply 87 of 87, Credit Memo Refund 40 of 40, Deposit Application 23 of 31.
  - A sample row on screen: "Sep 4, 2026 · Credit Memo Create · (No. blank) · E2E Credits Customer".
  - **Lethbridge, screen data** (`qb-leth/meta.json`, header "Staging Lethbridge - 4310"): 444 rows. Credit Memo Create has a blank No. on **28 of 28** rows.
- **Server** (`server_hd.json`, `server_leth.json`): the same counts. Heavy Duty 255/255; Lethbridge 28/28. Apply showed 88/88 when the server was read, so one row changed between the two reads.
  - The server was also read with no group filter at all (the widest choice): 1,000 rows on the first page, with the Customers, Vendors and Journal Entries groups mixed together.
  - The Vendors and Journal Entries tabs have no credit memo rows.

**Expected-value check:** none needed. The Expected result (show the credit memo's number) does not depend on a filter.

**Ticket text:** no edit needed. The steps use the location (unavoidable) and the Customers tab (the subject). Step 7 already repeats the check at a second location.

---

## SV-11957 (D6): QB Unexported, one credit memo is listed twice

**Verdict: KEEP AS IS.**

**Controls:**
- On QB Unexported, the same as SV-11956.
- Step 7 opens the customer's **Invoices tab with "Open only" switched off**. That is the ticket clearing a filter, so that closed and applied credits are shown too.

**Fresh defaults:** the same as SV-11956. **Hidden filters:** none.

**Is each filter the thing being tested?**

| Filter | Subject? | Reason |
|---|---|---|
| Customers tab | **YES** | It is where the credit memo row sits. |
| Location (Heavy Duty) | **NO, but it cannot be removed** | TestVT1's credit memo belongs to Heavy Duty. |
| "Open only" on the customer's Invoices tab | **NO** | The ticket already tells the reader to switch it **off**, so it is deselected. |

**Runs:**
- **(i), (ii) and (iii) are the same**, because no filter is applied on QB Unexported.
- **Screen data** (the page's own replies, fresh open, Heavy Duty): two Credit Memo Create rows for TestVT1 on 22 Oct with the **same record id** (`87891177-b95f-46a6-98e6-d3a9ad3d8e44`). Both have a blank No.
  - One says "The Class mapped in your Bookkeeping settings no longer exists…", at 12:29:46 UTC (5:29:46 PM Karachi).
  - The other says "Originating Invoice … has not yet synced…", at 12:29:45 UTC (5:29:45 PM Karachi).
- **Server:** the same two rows, the same id and the same errors. In total, 60 credit memos appear twice at Heavy Duty; none at Lethbridge.
- One record shown on two rows cannot come from a filter.

**Expected-value check:** "1 credit memo, 2 rows" is counted on the same record id, with no filter.

**Ticket text:** no edit needed.

---

## Held draft D7: Export Reports, Customer Invoice shows the customer's current Terms

**Verdict: KEEP, EDIT.** The defect shows with every date range. However, the draft's steps use a date range that is not the subject (**Today**, then a one-day **Custom**), and Today no longer contains the invoice.

**Controls on the screen** (Reports → Accounting → Export Reports):
- **Report Name**;
- **Date Range**, with the choices Custom, Today, Yesterday, This Week, Last Week, This Month and Last Month. There is no "All".

There is **no** location control. The requests carry no location value, and the server returns the same file with the DVI Test or the Heavy Duty location header.

**Fresh defaults** (`evidence/f4/d7/meta.json`, America/Toronto, header "DVI Test"):
- Report Name: **Customer Contact**.
- Date Range: **blank**. The page then sends `range=today`.

**Is each filter the thing being tested?**

| Filter | Subject? | Reason |
|---|---|---|
| Report Name: Customer Invoice | **YES** | It is the file being tested. |
| Date Range | **NO** | It only chooses which invoices are in the file. It cannot be cleared, so the widest choice that holds the invoice is used: **This Month**. |
| Location (DVI Test) | **NO** | It does not change the file (checked with two location headers). It is used only to make the test data. |

**Runs** (S1-38216, made 28 Oct 2026 at DVI Test):
- **(i) As in the draft:**
  - **Today**: 0 rows (on 29 Oct Today is empty).
  - **Custom Oct 28 – Oct 28** (server; the window is 2026-10-28T04:00Z → 2026-10-29T03:59:59.999Z): 42 rows (server). S1-38216 shows **Terms Net 30**, InvoiceDate 10-28-2026, DueDate 10-28-2026.
- **(ii) Default:** Today, which gives 0 rows.
- **(iii) Widest, on screen:**
  - **Yesterday**, **This Week** and **This Month** were each exported. The files have 42, 44 and 975 lines.
  - S1-38216 is **Net 30 in every file**.
  - The page's own requests were `range=yesterday` / `range=this_week` / `range=this_month`.
- **The invoice itself** (work order S1-38216 → Finance, on screen): **Terms COD**, due date Oct 28, 2026.
  - The server's invoice record also says `credit_terms: COD`.
  - The customer card now says **Net 30**.

**Expected-value check:** Expected = the invoice's own term (COD), read from the invoice and not from any filter.
- **Arithmetic:** InvoiceDate Oct 28 and DueDate Oct 28 is 0 days, which is COD.
- With Net 30 the due date would be Oct 28 + 30 days = **Nov 27, 2026**.

**Exact edits to the draft (`phase2/P2-D7-*.md`):**

| Old sentence | New sentence |
|---|---|
| "8. Pick **Report Name: Customer Invoice** and **Date range: Today**, then click **Export**." | "8. Pick **Report Name: Customer Invoice** and **Date Range: This Month**, then click **Export**. (From 1 November 2026, pick **Last Month**.)" |
| "(Ready-made data: work order **S1-38216**, customer **ZZAUTOTEST P2D Terms**, made this way on 28 Oct 2026. From 29 Oct pick **Custom** Oct 28, 2026 – Oct 28, 2026 in step 8.)" | "(Ready-made data: work order **S1-38216**, customer **ZZAUTOTEST P2D Terms**, made this way on 28 Oct 2026.)" |
| "**Actual:** the file shows **Terms: Net 30** for the invoice (DueDate = InvoiceDate = 10-28-2026)." | "**Actual:** the file shows **Terms: Net 30** for S1-38216, with InvoiceDate 10-28-2026 and DueDate 10-28-2026. A Net 30 invoice from Oct 28 would be due Nov 27, 2026; a due date on the same day only fits COD." |
| "**2.** The downloaded Customer Invoice file (Today) for the same invoice: Terms Net 30." | "**2.** The downloaded Customer Invoice file (Date Range: This Month) for the same invoice: Terms Net 30." |

**Replacement picture** for P2-D7-2, annotated and looked at:
- `evidence/f4/d7/P2-D7-2-v2-customer-invoice-export-this-month-terms-net-30.png`.
- It is drawn from the This Month file downloaded through the screen at 29 Oct, Toronto time (`d7/This_Month-customer_invoice.csv`).
- Picture P2-D7-1 (Finance, Terms COD) has no filter and stays.

**Not re-run in this pass:** the draft's "existing data" line (Heavy Duty, Last Month, 7 COD invoices). Last Month is needed there only because those invoices are from September, so it is not an unneeded filter.

---

## Proposed playbook line (Rule 93 / 97). NOT written, because the brief limits writes to filter-recheck

Proposed for `build/APP-ACTIONS-PLAYBOOK.md`, "Report UI recipes":

> **A fresh boot2 context MUST set `localStorage['location']`.** Without that key the app falls back to the USER's last-used location. That location is shared by every session of the same admin, so any other worker's change-location moves it, and a report can open on the wrong location (seen 29 Oct 2026: QB Unexported opened on "DVI Test" for a Heavy Duty run; two boot2 runs started together swapped locations).
>
> Set the key right after boot2: `await page.evaluate(w=>localStorage.setItem('location',JSON.stringify(w)),workplaceId)`. Then check that the header shows the location at the start and at the end of the run. The profile menu's "Change Location:" line shows the user-level value, which can differ from the page's.
>
> (`reports/WORKER-BRIEF.md` line 27 already says "without the `location` key pages fetch nothing".)

## Searches run (Rule 97)

`grep -n "localStorage\['location'\]|setItem('location'|wrong location|per-user location" build/APP-ACTIONS-PLAYBOOK.md build/skills/14-ACCESS-RESILIENCE.md` found nothing. `grep -rln "setItem('location'" --include=*.md build/` found `reports/WORKER-BRIEF.md` (line 27).

`git fetch origin` failed on an unrelated ref lock: "cannot lock ref 'refs/remotes/origin/claude/test-execution-defects-cdrjsq'". The checkout was clean and up to date with its own branch.
