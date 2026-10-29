# SV-11922 — rewritten 28 Oct 2026 for a first-time, non-technical reader (Rule 100)

EDITED 29 Oct 2026 after the filter recheck: as-of date left on today (29 Oct) instead of a past date; example bill 976974 (due Oct 31): -1 should be -2; both pictures replaced (no vendor, no past date).
Pictures after the edit: f3/SV-11922/F3-SV11922-1-ap-aging-detail-today.png · f3/SV-11922/F3-SV11922-2-ap-unpaid-today-no-vendor.png (filter-recheck/evidence); 63185 and 63184 leave the description.

Summary: A/P reports – "Past Due" is one day off for bills that are not due yet
Status: OBSOLETE (set by the QA lead pending review; not changed by us)
Pictures in the description: SV11922-1-lethbridge-current-section.png (att 63185), SV11922-2-lethbridge-unpaid-invoices.png (att 63184).
Comment 79708 (time-zone re-test, att 63183 / 63182) kept.
Jira dropped the first two pictures (AP1-1 att 63181, AP1-2 att 63180) when the description stopped referencing them — the
2026-08-12 hazard in Rule 52(2). They were the pictures whose browser time zone was unrecorded; copies remain in
reports/W4-finance-accounting-comms/defects/pictures/.
Before: ~5,600 characters, 10 steps, endpoint and scale detail in the body. After: plain "what is wrong", 7 steps on one bill,
Actual/Expected with the sum, source quote, 2 pictures, short developer note.


## Description after the filter recheck (29 Oct 2026)

## What is wrong

On **A/P Aging Detail** and **A/P Unpaid Invoices**, the **Past Due** column shows how many days a bill is overdue (a positive number) or how many days are left until it is due (a negative number).

For bills that are **not due yet**, the number is one day too small. A bill due in 2 days shows **-1** instead of **-2**, and a bill due tomorrow shows **0**, the same as a bill due today.

These bills are in the **Current** section (not yet due), not in "1-30 days past due". Bills that are already overdue show the right number.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Lethbridge - 4310**.
3. Click **Reports**. In the left menu, under **Accounts Payable**, click **A/P Aging Detail**.
4. Leave the **Date** button on today's date.
5. Open the **Current** section.
6. Find a bill that is due two days after today. On 29 Oct 2026 that is bill **976974** (vendor 4Refuel, Due Date **Oct 31, 2026**).
7. Look at its **Past Due** number.

**Actual:** Past Due shows **-1**.

**Expected:** Past Due shows **-2** (29 Oct minus 31 Oct = -2 days).

The same happens on **A/P Unpaid Invoices** (picture 2) and at the other locations.

---

**Source:** Confluence [AP reports](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/265093124/AP+reports), version 13 (18 Mar 2026):

> Vendor Invoices — Days past due = Selected Date – Invoice Due Date

> Past Due — days past (positive number) or before due date (positive or negative number)

## Screenshots

**1.** A/P Aging Detail, Current section, Date left on today (29 Oct 2026): a bill due 30 Oct shows 0 (should be -1); a bill due 31 Oct shows -1 (should be -2).

**2.** A/P Unpaid Invoices, Date left on today, no vendor picked: bill 976974, due in 2 days, shows -1 (should be -2).

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026, Admin.
- Browser and test computer set to the location's time zone (America/Edmonton). Also seen at Staging Heavy Duty - 9919 with everything on its time zone (Asia/Karachi).
- Not checked on Production or on a QA branch.
