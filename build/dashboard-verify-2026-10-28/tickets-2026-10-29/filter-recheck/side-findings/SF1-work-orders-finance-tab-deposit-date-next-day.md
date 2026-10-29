<!-- DRAFT — NOT FILED. The coordinator files it after the QA lead's go-ahead ("Just create it as a BUG if it is a real bug and I will manually move it to the relevant Squad/Epic", 29 Oct 2026).
SUMMARY: Work Orders - Finance tab and invoice show a deposit taken late in the evening on the next day
TYPE Bug · PARENT none (QA lead will move it manually) · PRIORITY Medium
LINKS: relates to SV-11573 (Deposit date saved one day early; Done, the saving fix) · relates to SV-5968 (Time Zone issue with rendering dates across the SV app; Open, covers Part History and Notes only) · relates to SV-11660 (AccountingHub posts customer deposits on the UTC date; Merged to Staging, covers the accounting ledger only)
PICTURES: pictures/SF1-1-finance-tab-deposit-next-day.png · pictures/SF1-2-customer-deposits-tab-right-day.png
EXPECTED BASIS:
 - "Deposits for Work Orders" PRD (Confluence page 263094273, last modified Apr 16, 2026):
   - SV-5672: Deposit Date "Default value: Today … The date can be in the past".
   - SV-5676: on the Invoice, "Deposit label: (Deposit) {date} + {payment method}".
   - SV-5677: Customer → Payments "Date: the date the deposit was made".
 - Supporting rule, from an open bug rather than a PRD: SV-5968, "All the dates across the SV app should be rendered the same way. The correct rendering is based on the Current Location."
 - SV-11573, Chris Ward (21 Oct 2026): ship the fix so a deposit keeps the date that was picked.
RE-CHECKED: 29 Oct 2026, 11:20–11:39 UTC, staging v26.43.3-8ad4001.
 - DVI Test: session, browser, test computer and the app's own time-zone setting all on America/Toronto; app location key set; header location checked at start and end of every run.
 - Staging Heavy Duty - 9919: the same, on Asia/Karachi.
 - The same result was also seen on 29 Oct 09:45 UTC (v26.43.2-9272076), with the app's time-zone setting set and with it removed.
FILTERS (Amendment 1): none. The Finance tab and the invoice have no filters. The customer's Deposits tab has an "Open only" switch, which hides used-up deposits; it was switched OFF to see DEP-4818. Nothing else was narrowed.
DUPLICATE CHECK (29 Oct 2026, read-only, project SV, last 365 days):
 - (1) summary ~ deposit AND (date|day|timezone|time zone|UTC): 4 results. SV-11951, SV-11660, SV-11573 (Done), SV-10990 (Done).
 - (2) text ~ deposit AND ("Finance tab"|invoice PDF|"one day"|"a day"|"next day"|timezone|"time zone"|UTC): 100+ results. No open ticket covers the deposit date on the Finance tab or the invoice.
 - (3) not Done AND (text ~ "deposit date" OR deposit AND Finance AND date/day): 11 results. None covers this.
 - (4) not Done AND summary ~ (payment date|invoice date|UTC|timezone|time zone|one day|a day|day early|day late): 23 results.
   - SV-5968 is the closest. It states the rule but lists only Part History and Notes.
   - If the QA lead prefers, this could instead be a comment on SV-5968 (text at the end of this file).
TEST DATA: all at DVI Test, customer ZZAUTOTEST P2C DEP.
 - Used: DEP-4818 on S1-38221 (made 28 Oct by Phase 2 worker C).
 - Made for the control case on 29 Oct: work order S1-38222, deposits DEP-4819 ($10.00, today) and DEP-4820 ($5.00, dated 10/27/2026), both taken about 7:20 AM Toronto. They are Held, not invoiced.
 - Read only, nothing changed: DEP-4718 on S2-32989 (Bravo Mechanical Services, Staging Heavy Duty - 9919).
-->

## What is wrong

When a deposit is taken late in the evening, the work order's **Finance** tab shows it on the **next day**. The deposit's own record and the customer's **Deposits** tab both show the day that was picked.

The same wrong date is printed on the invoice the customer gets. So the invoice says the customer paid on a day they did not pay.

At Toronto locations this happens for deposits taken after **8 PM** (after **7 PM** from 1 November). Locations in other time zones are hit at other hours. At Staging Heavy Duty - 9919 (Karachi time), a deposit taken just after midnight shows the **day before**.

**Example:** deposit **DEP-4818** on work order **S1-38221** was given Deposit Date **Oct 26, 2026** and taken at **8:45 PM** Toronto time.

- Customer → **Deposits** tab: **Oct 26, 2026**. Right.
- Work order → **Finance** tab, under **Payments**: "(Deposit) **Oct 27, 2026** - Cash $30.00". Wrong by one day.
- The downloaded invoice: "(Deposit) **Oct 27, 2026** - Cash $30.00". Wrong by one day.

Deposits taken earlier in the day show the right date. DEP-4819 (today) and DEP-4820 (dated Oct 27) were both taken at 7:20 AM Toronto time, and the Finance tab shows Oct 29 and Oct 27.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test** (Toronto time).
3. Wait until after **8 PM** Toronto time (after **7 PM** from 1 November).
4. Open any work order that is not invoiced yet, for example one for customer **ZZAUTOTEST P2C DEP**, and click the **Finance** tab.
5. Click **Add Deposit**. Leave **Deposit Date** on today, or pick an earlier day. Pick **Payment Method: Cash**, type **Deposit Amount: 5.00**, and click **Record Deposit**.
6. Look at the new line under **Payments** on the Finance tab.
7. Open **Customers**, open the same customer, and click the **Deposits** tab. Look at the same deposit's **Date**.

**Actual:** the Finance tab line reads "(Deposit) {the day after the Deposit Date} - Cash". The Deposits tab shows the Deposit Date. The downloaded invoice (download button on the Finance tab) shows the day after, like the Finance tab.

**Expected:** the Finance tab line and the invoice show the **Deposit Date that was picked**, the same day as the Deposits tab.

You do not need to wait for the evening to see it. Our example is already in place: work order **S1-38221** at DVI Test shows "(Deposit) Oct 27, 2026 - Cash", while its deposit DEP-4818 reads **Oct 26, 2026** on the customer's Deposits tab. Switch **Open only** off to see it there, because the deposit is used up.

A second example at **Staging Heavy Duty - 9919** (Karachi time): work order **S2-32989** (Bravo Mechanical Services) shows "(Deposit) **Sep 16, 2026** - Cash $200.00". Its deposit **DEP-4718** reads **Sep 17, 2026** on the customer's Deposits tab, because it was taken at 12:20 AM Karachi time on Sep 17. The invoice prints Sep 16 too.

---

**Source:** "Deposits for Work Orders" (Confluence, product space, last modified Apr 16, 2026):

> **Deposit Date** … Default value: Today (based on user's current datetime from device) … The date can be in the past

> Each deposit will display on the **Invoice** under the Payments section — Deposit label: (Deposit) {date} + {payment method}

> The Customer → Payments page will display all deposit payments … Date: the date the deposit was made

SV-5968 (open), the general rule for dates:

> All the dates across the SV app should be rendered the same way. The correct rendering is based on the Current Location.

## Screenshots

**1.** Work order S1-38221, Finance tab, DVI Test: "(Deposit) Oct 27, 2026 - Cash" for a deposit dated Oct 26, 2026.

**2.** Customer ZZAUTOTEST P2C DEP, Deposits tab, Open only switched off: DEP-4818 for S1-38221 reads Oct 26, 2026.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026, Admin.
- DVI Test: browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Staging Heavy Duty - 9919: everything on Asia/Karachi.
- Removing the app's time-zone setting does not change what the Finance tab shows.
- Not checked on Production or on a QA branch.

---

<!-- ALTERNATIVE (only if the QA lead prefers a comment on SV-5968 instead of a new ticket):
Another place that does not follow this ticket's rule: a deposit's date on the work order's Finance tab and on the invoice. At DVI Test (Toronto time), DEP-4818 was given Deposit Date Oct 26, 2026 and taken at 8:45 PM. The customer's Deposits tab shows Oct 26, 2026, but work order S1-38221's Finance tab and its invoice show "(Deposit) Oct 27, 2026 - Cash". At Staging Heavy Duty - 9919 (Karachi time), DEP-4718, taken at 12:20 AM on Sep 17, shows Sep 16, 2026 on work order S2-32989. Seen on staging v26.43.3-8ad4001, 29 Oct 2026, with the browser, computer and app time-zone setting on each location's zone.
-->
