# Filter recheck · worker F3 · 29 Oct 2026

Tickets: SV-11949 (C2), SV-11950 (C3), SV-11951 (C4), SV-11952 (C6), SV-11935 (D1, A/R), SV-11922 (A/P). Plus side finding 1 (late deposit date), approved by the QA lead.

Nothing was written to Jira, TestRail or Google. Nothing was committed or staged. No test data was created; only existing records were read.

## How the checks were run

- **Builds.** Staging changed twice while I worked: `v26.43.2-f8698cb` (start), then `v26.43.2-9272076` (from about 09:45 UTC), then `v26.43.3-8ad4001` (from about 10:10 UTC).
  - The verdict screen runs and pictures are on `9272076`.
  - The server cross-checks were re-run on `8ad4001` at 10:15–10:17 UTC. Every figure was unchanged.
  - A full screen re-run on `8ad4001` is at the end of this file.
- **Rule 99.** Every run had the same zone in all four places: session `change-location`, browser `timezoneId`, process `TZ`, and the app's own `localStorage['timezone']`. They are recorded per run in `evidence/f3/<ticket>/meta.json` and in the `screen-meta*.json` files.
- **F4's location trap.** Every screen run also set the app's own `localStorage['location']`. Each run checked the header location at its start and at its end, and every run passed.
  - My first runs did not set the key. Their meta files are renamed `INVALID-no-location-key-screen-meta.json`, and no verdict uses them.
  - Everything was re-run with the key: SV-11949, SV-11950, SV-11951, SV-11952 and SV-11922. SV-11935 and the side finding were only ever run with the key.
- **Own session.** The session file is `/tmp/cln/f3/sess.txt` (mode 600) and was never printed.
- **Tools.** In `tools/f3/`:
  - `f3boot.mjs`: boot plus the location and timezone keys plus the header check.
  - `inv.mjs`: fresh-context defaults.
  - `screen_tax.mjs`, `screen_sbr.mjs`, `screen_ap.mjs`, `side1_screen.mjs`: the screen runs.
  - `server_tax.py`, `server_sbr_ap_ar.py`, `tax_cm_days.py`, `side1_server.py`: the server data, sent with the same parameters the screens send.
  - `run_all_screens.sh`, `run_recheck_b8ad4001.sh`: the runners.
- **Fresh defaults.** Recorded in `evidence/f3/inv/*.json`. Each screen was opened in a new browser with an empty store, apart from the user and the location and timezone keys.

## Summary

| Ticket | Verdict | Why |
|---|---|---|
| SV-11949 (C2) | **KEEP, EDIT** | Credit memos are missing in every date range and every status. The steps used a Custom one-day range that the test does not need. |
| SV-11950 (C3) | **KEEP, EDIT** | The $0.00 invoice is listed as Paid in This month, This year and Paid. The steps picked "Today", which is not needed. |
| SV-11951 (C4) | **KEEP, EDIT** | The invoice reads Paid and is missing under Partially Paid in every range. "Partially Paid" stays, because it is part of the test. "Today" goes. |
| SV-11952 (C6) | **KEEP, EDIT** | The order within a day is wrong for every rep, at All locations, with Show Unassigned off. The steps used Show Unassigned, the Unassigned row and the default Location (the current location only). |
| SV-11935 (D1) | **KEEP AS IS** | The only control is the as-of Date, left on today. A/R shows $543.43 from any location and any as-of date. |
| SV-11922 (A/P) | **KEEP, EDIT** | Bills not yet due are one day short, at today's date and with no vendor. Step 4 and picture 2 used a past date, and picture 2 also used a Vendor pick. Neither is needed. |
| Side finding 1 | **REAL** | A deposit taken after 8 PM Toronto shows the next day on the Finance tab. The figures are the same with the app's timezone key set and removed. |

---

## SV-11949 (C2): Sales Tax Collected leaves out credit memos

**Controls.** Ticket values are shown after each control.

| Control | Ticket used | Is it the subject? |
|---|---|---|
| Date Range | Custom Oct 20 – Oct 20 | **No.** Credit memos are missing in every range. The single day only made a small example. |
| Invoice Status | none picked | No. |
| Search | not used | No. |
| Location (top-right switch) | Staging Heavy Duty - 9919 | Needed, but it is not a report filter. The report covers the current location, and the only taxed credit memos are at Heavy Duty (DVI Test has only a 0 % rate). |
| Columns / sort | none | No columns button is shown, and the request sends no sort (`sortBy=`). |

**Fresh defaults.**
- Date Range is This month. No Invoice Status is picked. Search is empty.
- The page saves no report key in local storage.
- Date Range and Invoice Status are kept in the URL (for example `?range=custom&range=2026-10-20&range=2026-10-20`, `?statuses=paid`). The ticket's picture used Custom Oct 20, which the steps name.
- Hidden filters: **none**.

**Three runs.** All at Heavy Duty, on the screen and the server.

| Run | Screen | Server |
|---|---|---|
| (i) Custom Oct 20 | Search CM2-4520 gives "No record matches the search". GST 5 % is $57.44. | 4 rows, none negative. GST $57.44. The server's own hidden `totalTax` is $51.19. |
| (ii) This month (default) | CM2-4520 not found. GST 5 % $987.05, HST $162.50, GST 5 % $25.88. | 65 rows, none negative, no CM rows. The rows' tax adds up to $1,175.43, but `totalTax` is $1,167.93: $7.50 less. |
| (iii) This year, also with Paid and Partially Paid | Not found under any of them. | 1,365 rows, none negative, no CM rows. |

**Expected-value check.**
- The ticket's $57.44 − $6.25 = $51.19 was worked out for the same Karachi day. The request covered `2026-10-19T19:00Z` to `2026-10-20T18:59:59.999Z`, and CM2-4520 is dated Oct 20, 2026.
- The server's own `totalTax` for that day is exactly $51.19. So the server already takes the credit-memo tax off a total, but the screen never shows that total.
- For October, the days where the two figures differ are:
  - Oct 20: $6.25 (CM2-4520).
  - Oct 21: $1.25. Judging by the amount, this is CM2-4523 (−$25.00 × 5 %), the only $25.00 credit memo that day. NOT VERIFIED on screen.
- Both days carry only the first GST rate.

**Verdict: KEEP, EDIT.** Exact sentences:
- Step 6:
  - Old: "Click **Date Range**, pick **Custom**, and set both **From** and **To** to **Oct 20, 2026**."
  - New: "Leave **Date Range** on **This month** (from 1 November pick **Last month**, so the range is October 2026). Do not pick an **Invoice Status**."
- Step 7:
  - Old: "Look at the list: only four invoices are shown, and CM2-4520 is not there."
  - New: "Click **Search** and type **CM2-4520**. The table says "No record matches the search "CM2-4520".""
- Step 8:
  - Old: "Click **See All Tax Rates**. The date range stays Oct 20, 2026."
  - New: "Clear the search and click **See All Tax Rates**. The date range stays This month."
- Actual, second bullet:
  - Old: "**See All Tax Rates** shows **GST 5 % $57.44**, the tax on the four invoices only."
  - New: "**See All Tax Rates** shows **GST 5 % $987.05** on its first row. No credit-memo tax is taken off."
- Expected, second bullet:
  - Old: "Its tax is taken off the totals: GST = $57.44 − $6.25 = **$51.19**."
  - New: "Its tax, and the tax on the other October credit memo, is taken off the totals: GST = $987.05 − $6.25 − $1.25 = **$979.55**."
- Paragraph after Expected:
  - Old: "The same happens for every credit memo with tax in any date range. For example, at the same location in **This month** (October) the GST totals leave out $7.50 of credit-memo tax."
  - New: "The same happens for every credit memo with tax in any date range. For example, for Oct 20, 2026 alone (Custom date range) GST shows $57.44 and should be $57.44 − $6.25 = $51.19."
- Pictures:
  - Pictures 1 and 2 (Custom Oct 20) are replaced by **`evidence/f3/SV-11949/F3-SV11949-1-all-tax-rates-this-month.png`**: All Tax Rates, This month, GST $987.05. It was annotated and looked at.
  - Picture 3 (the customer's Invoices tab) is unchanged.
- Note: $987.05 grows as more October invoices are made. Re-read it on the day you edit.

---

## SV-11950 (C3): $0.00 invoices listed as Paid

| Control | Ticket used | Is it the subject? |
|---|---|---|
| Date Range | Today | **No.** $0.00 invoices are listed in every range. |
| Invoice Status | none | No. |
| Location | DVI Test | This is only where the test invoice is made. It is not a report filter. |

**Fresh defaults.** Date Range is This month and no Invoice Status is picked. Hidden filters: **none**.

**Three runs.** All at DVI Test.

| Run | Screen | Server |
|---|---|---|
| (i) Ticket's "Today" | On 29 Oct, "Today" no longer holds S1-38218, which was made on 28 Oct. So I used Custom Oct 28, the same day: S1-38218 reads **Paid**, with paid date "Yesterday", $0.00. Under Partially Paid: no record. | `status: paid`, `paidDate 2026-10-29 00:20:00` UTC (8:20 PM Oct 28 Toronto), total $0. |
| (ii) This month (default) | Listed as Paid. | Same. 1 zero row. |
| (iii) This year, This year plus Paid | Listed as Paid. | Same. At Heavy Duty, This year has 134 $0.00 rows. |

**Expected-value check.** Chris's 31(a): "leave $0.00 invoices off this report". This does not depend on any filter.

**Verdict: KEEP, EDIT.**
- Step 8:
  - Old: "Click **Date Range** and pick **Today**."
  - New: "Leave **Date Range** on **This month** and do not pick an **Invoice Status**."
- Actual:
  - Old: "the $0.00 invoice is listed with Invoice Status **Paid**, Invoice Paid Date **Today**, and $0.00 in every money column."
  - New: "the $0.00 invoice is listed with Invoice Status **Paid**, an Invoice Paid Date on the day it was made, and $0.00 in every money column."
- Example paragraph:
  - Old: "It is the first row on Sales Tax Collected for Today at DVI Test on 28 Oct 2026."
  - New: "It is listed, as Paid with a paid date, on Sales Tax Collected for This month at DVI Test."
- Picture 1 is replaced by **`evidence/f3/SV-11950_51/F3-SV11950-1-zero-invoice-this-month.png`** (annotated and looked at). Picture 2 (Finance tab) is unchanged.

---

## SV-11951 (C4): deposit-part-paid invoice shows Paid and the wrong paid date

| Control | Ticket used | Is it the subject? |
|---|---|---|
| Date Range | Today | **No.** |
| Invoice Status | Partially Paid (step 10) | **Yes, part of the subject.** The invoice is missing from this filter. |
| Location | DVI Test | This is where the test record is. It is not a report filter. |

**Fresh defaults.** Date Range is This month and no Invoice Status is picked. Hidden filters: **none**.

**Three runs.** Invoice S1-38221 at DVI Test.

| Run | All statuses | Partially Paid |
|---|---|---|
| (i) Ticket's "Today": Custom Oct 28, the same day, because "Today" is now 29 Oct | Paid, paid date "Yesterday" (Oct 28) | "No record matches these filters" |
| (ii) This month (default) | Paid, Yesterday | "No record matches these filters" |
| (iii) This year | Paid | none |

Server, all ranges:
- The report gives `status: paid` and `paidDate 2026-10-29 00:46:41` UTC, which is 8:46 PM Oct 28 Toronto, the invoice time.
- Partially Paid has 0 rows in every range.
- Deposit DEP-4818: `depositDate 2026-10-27T00:46:11Z`, which is **Oct 26, 8:46 PM Toronto**. Open balance $105.00.

**Expected-value check.**
- "Partially Paid" is right: $135.00 − $30.00 = $105.00 owed.
- Paid date **Oct 26, 2026** is right in the location's zone (the deposit's Toronto date).
- Note: the Finance tab prints this same deposit as **Oct 27** (side finding 1). A reader who checks the date on the Finance tab will see a different day from the one the ticket expects. The coordinator may want one line saying so.

**Verdict: KEEP, EDIT.** Keep the Partially Paid filter.
- Step 9:
  - Old: "Click **Date Range** and pick **Today**. Find your invoice."
  - New: "Leave **Date Range** on **This month** and do not pick an Invoice Status yet. Find your invoice."
- Actual, first bullet:
  - Old: "At step 9 the invoice reads **Paid**, and Invoice Paid Date reads **Today** (28 Oct, the day the invoice was made)."
  - New: "At step 9 the invoice reads **Paid**, and Invoice Paid Date is the day the invoice was made (Oct 28, 2026 in our example)."
- Pictures 2 and 3 used "Today". They are replaced by:
  - **`evidence/f3/SV-11950_51/F3-SV11951-1-deposit-invoice-this-month.png`**
  - **`evidence/f3/SV-11950_51/F3-SV11951-2-partially-paid-this-month.png`**
  - Both were annotated and looked at. If only one picture may change, use -2, because it shows the subject filter.
- Picture 1 (Add Deposit) is unchanged.

---

## SV-11952 (C6): Sales By Representative same-day order

| Control | Ticket used | Is it the subject? |
|---|---|---|
| Date | This month (default) | No. |
| Show Unassigned | clicked | **No.** The order is wrong inside every opened rep. |
| Rep opened | the Unassigned row | **No.** Any rep shows it. |
| Product Type / Invoice Status | All / All (defaults) | No. |
| Location chip | the default, which is **the current location (DVI Test)**. Not named in the steps. | **No.** |
| Column sort | default (`rep_name`) | No. The invoice-detail request carries no sort or pagination, so a column sort cannot change the order inside a rep. |

**Fresh defaults.**
- Date This month. Show Unassigned off. All products, All statuses.
- **Location = the current location.** Without the app's `location` key the chip reads "All locations", which is F4's trap.
- On first visit the page writes `report_table:sales-by-representative`, holding the rep-level sort `rep_name` and the column list.
- Hidden filter: the Location chip quietly narrows the report to the current location. It does **not** explain the defect (see run iii).

**Three runs.**
- (i) As in the ticket (This month, Show Unassigned, Location DVI Test, Unassigned opened):
  - Oct 28: 16 invoices newest first. S1-38221 is now on top, then S1-38218, S1-38219 … S1-38195.
  - Oct 13: S1-35010 above S1-35003.
  - The same list appears with All locations: the server shows every Oct 28 Unassigned invoice is at DVI Test.
- (ii) Defaults (no Show Unassigned, Location DVI Test):
  - Viktoria Videnovic, Oct 28: S1-38217 above S1-38210.
  - With **All locations**, Viktoria, **Oct 07 2026**, six Heavy Duty invoices: S2-34681, S2-34864, S2-33689, S2-33735, S2-34873, S2-34874 (newest first).
- (iii) Widest (All locations, This year, Show Unassigned): 206 of 207 days with more than one invoice are out of number order on screen.
  - Server: every day with more than one invoice, in every rep, is in time-made order, newest first (217 of 217 this year). 214 of 217 are out of invoice-number order. The other 3 happen to have been made in number order.

**Expected-value check.** The ticket's expected list was worked out for DVI Test and the Unassigned row. All of those invoices are at DVI Test, so it is also right for All locations. The rule (S6-R9) does not depend on any filter.

**Verdict: KEEP, EDIT.** Use a named rep with all filters wide.
- Step 4:
  - Old: "Leave **Date: This month** (from 1 November pick **Last month**, so the range is October 2026)."
  - New: "Leave **Date: This month** (from 1 November pick **Last month**, so the range is October 2026). Click **Location** and pick **Select all**, so it reads **Location: All locations**."
- Step 5:
  - Old: "Click **Show Unassigned**."
  - New: "Do not click **Show Unassigned**."
- Step 6:
  - Old: "Click the arrow at the left of the **Unassigned** row to open it."
  - New: "Click the arrow at the left of **Viktoria Videnovic** to open her invoices."
- Step 7:
  - Old: "Read the invoice numbers on the rows dated **Oct 28 2026**."
  - New: "Read the invoice numbers on the six rows dated **Oct 07 2026**."
- Step 8:
  - Old: "Read the two rows dated **Oct 13 2026**."
  - New: delete it.
- Actual:
  - New: "Oct 07 2026: S2-34681, S2-34864, S2-33689, S2-33735, S2-34873, S2-34874 (newest invoice first)."
- Expected:
  - New: "Oct 07 2026: S2-33689, S2-33735, S2-34681, S2-34864, S2-34873, S2-34874 (lowest number first). Days stay newest first."
- Keep the Unassigned Oct 28 list as a second example ("The same shows on the Unassigned row: …").
- The paragraph "The invoices above are test data at DVI Test…" should read: "These are existing invoices at Staging Heavy Duty - 9919."
- Picture: **`evidence/f3/SV-11952/F3-SV11952-1-viktoria-oct07-all-locations.png`** (annotated and looked at).

---

## SV-11935 (D1): A/R Aging leaves a part-sale deposit on

| Control | Ticket used | Is it the subject? |
|---|---|---|
| Date (as-of) | left on today (2026-10-29) | The report cannot run without it, and it stays on its default. |
| Location | Staging Heavy Duty - 9919 | **Needed, for the Invoices tab only.** A/R covers every location. |

**Fresh defaults.** Date is today. There are no other controls, no report key in local storage and no URL value. Hidden filters: **none**.

**Runs.**

| Run | P2-2352 | P2-2439 |
|---|---|---|
| (i)/(ii) Date today, Heavy Duty, screen and server | $543.43 / $543.43 | $21.00 |
| (iii) From DVI Test, screen and server | $543.43 | $21.00 |
| (iii) As of Oct 15 and as of 2027-12-31, server | $543.43 (moves to the 91+ bucket) | $21.00 |

**Invoices tab, server.**
- At Heavy Duty: P2-2352 balance **$443.43**, Partially paid, with DEP-4763 −$100 Held listed. P2-2439 balance $16.00, with DEP-4801 listed.
- **From DVI Test:** P2-2352 $543.43 Unpaid and P2-2439 $21.00, with **no deposit rows**. The deposit list is empty there.

**Expected-value check.**
- $543.43 − $100.00 = $443.43 is right for the deposit taken at Heavy Duty, and matches Chris's rule.
- The ticket's step 2 (switch to Heavy Duty) is **needed**. From any other location the Invoices tab hides the deposit and shows $543.43, which would wrongly look like a match.

**Verdict: KEEP AS IS.**
- Optional, plain-reader aid: add to step 2 "(the deposit belongs to this location; from another location the Invoices tab does not show it)."
- Side observation, NOT drafted: the Invoices tab hides a deposit held at another location.

---

## SV-11922 (A/P): "Past Due" one day off for bills not yet due

| Control | Ticket used | Is it the subject? |
|---|---|---|
| Date (as-of) | Step 4: picked 28 Oct, which was today on the filing day and is now a past date. Picture 2: 20 Oct. | **No.** A past date is not the point. Leave it on today. |
| Vendor (Unpaid Invoices) | Picture 2: 123 Cannabis Forestlawn, kept in the URL (`?asOfDate=2026-10-20&vendorId=…`) | **No.** |
| Location | Staging Lethbridge - 4310 | Not a report filter. A/P covers every location. |

**Fresh defaults.**
- Aging Detail: Date is today.
- Unpaid Invoices: no Vendor, Date is today.
- Both keep `asOfDate`, and Unpaid also keeps `vendorId`, in the URL. Picture 2's URL carried both, so it is a remembered filter. Hidden filters: the **Vendor and past date in picture 2**. Neither explains the defect.

**Three runs.** Lethbridge, screen and server agree.

| Run | Result |
|---|---|
| (i) Ticket, Detail 28 Oct | SV10190-ST1 (due Oct 30) **−1**, expected −2. 976974 (due Oct 31) **−2**, expected −3. |
| (i) Picture 2, Unpaid 20 Oct with vendor | 5363 **−2**, expected −3. SV10190-ST1 **−9**, expected −10. |
| (ii) Defaults, Detail today (29 Oct) | SV10190-ST1 **0**, expected −1. 976974 **−1**, expected −2. |
| (ii) Defaults, Unpaid today, no vendor | 976974 −1, expected −2. 5363, 6 days overdue, **6**, which is correct. |
| (iii) Unpaid 20 Oct, no vendor | Same figures as with the vendor. |

Server checks:
- Heavy Duty (Karachi): all **482 of 482** not-yet-due bills are one day short, and all 14,046 due or overdue bills are right.
- Lethbridge (Edmonton): 440 not-yet-due bills are one day short. A further 42 bills and 784 overdue bills have a due date stored at midnight UTC, which is the evening before in Edmonton. I did not judge those; they are outside this ticket.
- With the vendor filter: 23 of 23 not-yet-due bills are one day short.

**Expected-value check.** The ticket's sums use the as-of date the screen shows, minus the Due Date the screen shows. That is right.

**Verdict: KEEP, EDIT.**
- Step 4:
  - Old: "Click the **Date** button at the top right and pick **28 October 2026**."
  - New: "Leave the **Date** button on today's date."
- Step 6:
  - Old: "Find bill **SV10190-ST1** (vendor 123 Cannabis Forestlawn). Its Due Date is **Oct 30, 2026**, two days after the date you picked."
  - New: "Find a bill that is due two days after today. On 29 Oct 2026 that is bill **976974** (vendor 4Refuel, Due Date **Oct 31, 2026**)."
- Expected:
  - Old: "Past Due shows **-2** (28 Oct minus 30 Oct = -2 days)."
  - New: "Past Due shows **-2** (29 Oct minus 31 Oct = -2 days)."
  - Actual stays "**-1**".
- Picture 1 caption:
  - New: "A/P Aging Detail, Current section, Date left on today (29 Oct 2026): a bill due 30 Oct shows 0 (should be -1); a bill due 31 Oct shows -1 (should be -2)."
  - Picture: **`evidence/f3/SV-11922/F3-SV11922-1-ap-aging-detail-today.png`**
- Picture 2 caption:
  - New: "A/P Unpaid Invoices, Date left on today, no vendor picked: bill 976974, due in 2 days, shows -1 (should be -2)."
  - Picture: **`evidence/f3/SV-11922/F3-SV11922-2-ap-unpaid-today-no-vendor.png`** (taken on build `v26.43.3-8ad4001`).
- Both pictures were annotated and looked at.

---

## Side finding 1: a deposit taken after 8 PM Toronto shows the next day on the Finance tab

**Setup.** DVI Test, all four zone places on America/Toronto, recorded in `evidence/f3/SIDE1/meta.json`.

**Steps (2) and (3).** At check time it was about 5:40 AM Toronto (09:40 UTC), not after 8 PM. So, as instructed, I used an existing ZZAUTOTEST deposit taken after 8 PM Toronto. Nothing new was created.

**The deposit.** **DEP-4818** on work order **S1-38221** (customer ZZAUTOTEST P2C DEP, DVI Test).
- Entered through the screen at 00:45:53 UTC on 29 Oct, which is **8:45 PM, 28 Oct, Toronto**, with the app's timezone key set.
- Deposit Date picked: **10/26/2026** (p2c meta `date_set`).

**Figures.**

| | Value |
|---|---|
| Server record `depositDate` | `2026-10-27T00:46:11Z` = **Oct 26, 2026, 8:46 PM Toronto**. The right day. |
| Finance tab, key set | "(Deposit) **Oct 27, 2026** - Cash $30.00" |
| Finance tab, key REMOVED | "(Deposit) **Oct 27, 2026** - Cash $30.00". The same. |
| Control: DEP-4817 on S1-38219, entered without the key | Stored `2026-10-26T00:14:36Z` (Oct 25, 8:14 PM Toronto). The Finance tab shows Oct 26 with and without the key. |

The Finance tab shows the UTC calendar day of the deposit, not the location's day. The key changes nothing on display. It only changed how DEP-4817 was stored when it was entered.

**Verdict: REAL.** The wrong day shows with all four zones matched.

Plain steps:
1. At **DVI Test** (Toronto time), after **8 PM**, open a work order's **Finance** tab and click **Add Deposit**.
2. Pick any **Deposit Date**, for example 10/26/2026. Enter Cash, 30.00, and click **Record Deposit**.
3. Look at the deposit line under **Payments**. It reads the next day (Oct 27, 2026).

Expected: the date picked (Oct 26, 2026).

Picture: **`evidence/f3/SIDE1/SIDE1-1-deposit-date-one-day-late.png`** (annotated and looked at). No ticket was drafted, and no duplicate check was run (still owed if this is to be filed).

---

## Screen re-run on build v26.43.3-8ad4001

See the block appended below.

- **When and what.** 10:18–10:45 UTC, `run_recheck_b8ad4001.sh`. These were the same runs as the verdict runs, plus the All-locations SBR runs and the side-finding passes.
- **Where the evidence is.** `evidence/f3/RECHECK-b8ad4001/<ticket>/` and `evidence/f3/run-logs/*.b8ad4001.out`.
- **Checks passed.** All 29 runs passed the location check at start and end. In every run, browser zone = process zone = location zone, and the app's timezone key was set.
- **Result: every figure is the same as on `9272076`.** The logs were compared line by line, with the build string and request lists left out; there was no difference.
- The side finding still shows Oct 27 for DEP-4818, with the key set and with it removed.
- The server cross-checks on `8ad4001` (10:15–10:17 UTC) were also unchanged.
- **The verdicts above therefore hold on the current build, `v26.43.3-8ad4001`.**

## Searches run (Rule 97)

These searches were run before treating anything as blocked:
- `git fetch origin`. A full fetch failed with "cannot lock ref" on another session's branch. A targeted fetch of my own branch worked, and local HEAD matches the remote.
- `phase2/tools/p2c`, `p2d` and `../tools/ap_tz_repro.mjs` gave the recipes I reused: endpoints, the deposit and ledger calls, and the date pickers.
- `reports/WORKER-BRIEF.md` line 27 gave the `localStorage['location']` key format.
- The vendor filter's real request parameter is `filters[0][field]=vendor_id`, taken from the screen's own request. `vendorId` is ignored by the API.

Nothing was blocked.
