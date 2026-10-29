# Worker F3 follow-up · 29 Oct 2026

All checks were read-only, apart from the SF1 control data listed in the SF1 draft. Nothing was written to Jira or committed.

## 1. SV-11949: the $1.25 credit memo is now confirmed on screen

**Where and when.** Staging Heavy Duty - 9919, build `v26.43.3-8ad4001`, 29 Oct 2026, 11:42–11:47 UTC (4:42–4:47 PM Karachi).
- Session, browser, test computer and the app's own time-zone setting were all on Asia/Karachi.
- The app's location key was set, and the header location was checked at start and end.
- Evidence: `evidence/f3/SV-11949-followup/meta.json`.

**CM2-4523.**

| What | Customer → Invoices tab (Open only switched off, Search "CM2-4523") | The credit memo itself (its **print** button: the credit PDF) |
|---|---|---|
| Number | CM2-4523, Type Credit | "Credit: CM-4523" |
| Customer | TestVT1 | Credit To: TestVT1 |
| Date | **Oct 21, 2026** | "Issue date: Oct 20, 2026" (see note) |
| Lines / tax | Total **-$26.25**, Balance $0.00, Refunded | One part line -$25.00. Subtotal -$25.00. **Tax -$1.25**. Total Credit -$26.25 (refunded by EFT, Oct 21, 2026). |

Pictures: `CM2-4523-invoices-tab.png` and `CM2-4523.pdf` in the same folder.

- The $1.25 is 5 % of $25.00.
- The server data puts that $1.25 on Oct 21, in the first GST 5 % rate. That is the only GST rate on that day.
- So CM2-4523 is **confirmed**. The example can keep both credit memos.

CM2-4520 was also re-confirmed on the same screen: Oct 20, 2026, Testing Company Milos, Total -$131.25, Unapplied.

**Note, not drafted.** The credit PDF prints Issue date **Oct 20** while the Invoices tab says **Oct 21**. This looks like the same kind of fault as SF1: a printed document showing the UTC day. p2c had flagged the same for the CM2-4520 PDF. It should be checked against SF1's fix before anyone files it.

**Re-read GST total.** All Tax Rates, This month, no Invoice Status picked, at **4:46 PM Karachi time, 29 Oct 2026** (11:46 UTC):
- GST 5 % **$1,015.30**, HST 13 % $162.50, GST 5 % $25.88.
- It was $987.05 at 09:36 UTC. New invoices came in during the day.
- Expected: $1,015.30 − $6.25 − $1.25 = **$1,007.80**.
- Replacement picture with these figures: **`evidence/f3/SV-11949-followup/F3-SV11949-1b-all-tax-rates-this-month.png`** (annotated and looked at). Use it instead of F3-SV11949-1.

**Wording for SV-11949.** These replace the sentences given in RESULT-f3.md where they differ.

- Step 6:
  - New: "Leave **Date Range** on **This month** (from 1 November pick **Last month**, so the range is October 2026). Do not pick an **Invoice Status**."
- Actual, second bullet:
  - New: "**See All Tax Rates** shows **GST 5 % $1,015.30** on its first row. No credit-memo tax is taken off."
- Expected, second bullet:
  - New: "Their tax is taken off the totals. In October two credit memos carry GST: **CM2-4520** (Oct 20, -$6.25) and **CM2-4523** (TestVT1, Oct 21, -$1.25). So GST = $1,015.30 − $6.25 − $1.25 = **$1,007.80**."
- New sentence for testers, straight after Expected:
  - "The GST total will be different on the day you look, because new invoices keep coming in. What matters is that the total is never lowered by the credit memos' tax ($6.25 + $1.25 = $7.50 for October), and that the credit memo rows are missing from the list."
- Where it was seen:
  - New: "Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 at 4:46 PM Karachi time, Admin, Staging Heavy Duty - 9919. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi)."

## 2. "Where it was seen" for each edited ticket

Each line names the run the new figures and the replacement pictures come from.

**SV-11949.** As above.
> Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 at 4:46 PM Karachi time, Admin, Staging Heavy Duty - 9919. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).

**SV-11950.**
- Replacement picture: `F3-SV11950-1` (09:42 UTC on v26.43.2-9272076).
- The same figures were seen again on v26.43.3-8ad4001 at 10:20 UTC.
> Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001 (the picture is from v26.43.2-9272076, same result), 29 Oct 2026 (5:42–6:20 AM Toronto time), Admin, DVI Test. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).

Step 8, with the month-end wording:
> "Leave **Date Range** on **This month** (from 1 November pick **Last month**, so the range is October 2026) and do not pick an **Invoice Status**."

**SV-11951.**
- Replacement pictures: `F3-SV11951-1` and `F3-SV11951-2`. These are from the same runs and builds as SV-11950.
> Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001 (the pictures are from v26.43.2-9272076, same result), 29 Oct 2026 (5:42–6:34 AM Toronto time), Admin, DVI Test. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).

Step 9, with the month-end wording:
> "Leave **Date Range** on **This month** (from 1 November pick **Last month**, so the range is October 2026) and do not pick an Invoice Status yet. Find your invoice."

**SV-11952.**
- Replacement picture: `F3-SV11952-1` (10:04 UTC on v26.43.2-9272076).
- The same figures were seen again on v26.43.3-8ad4001 at 10:40 UTC.
> Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001 (the picture is from v26.43.2-9272076, same result), 29 Oct 2026 (6:04–6:40 AM Toronto time), Admin, DVI Test, Location: All locations. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).

**SV-11922.**
- Picture 1, `F3-SV11922-1`: 09:57 UTC on v26.43.2-9272076. The same figures were seen again on v26.43.3-8ad4001 at 10:36 UTC.
- Picture 2, `F3-SV11922-2`: 10:13 UTC on v26.43.3-8ad4001.
> Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (3:57–4:36 AM Edmonton time), Admin, Staging Lethbridge - 4310, Date left on today (2026-10-29). Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Edmonton). Also seen at Staging Heavy Duty - 9919 with everything on Asia/Karachi (server data, same build).
