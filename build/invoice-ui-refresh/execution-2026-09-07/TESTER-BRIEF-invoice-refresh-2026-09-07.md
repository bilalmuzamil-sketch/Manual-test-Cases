# Invoice Refresh — brief for the manual test team

**Date:** 7 September 2026 · **Where to test:** staging, `https://app.staging.shopview.com`
**Build this brief was prepared on:** `v26.35.9-9812433`
**Your cases:** the "Invoice Refresh (Aug 2026)" folder · **Companion file:**
`Invoice-UI-Refresh_Execution-Results_2026-09-07.xlsx` — every case, with what was seen

---

## Read this first

**🔴 Before you judge ANY field as missing from a document, open the gear icon on that document's
own Finance tab and check every switch is ON.** There are nine on an invoice — Labor rate, Labor
hours, Labor price, Part number, Part quantity, Part price, Part description, Summarize parts total,
Summarize labor total — and four on a parts sale. **Each document has its own copy of these
switches**, and several are OFF by default across the shop. A field that is switched off is not a
bug. This already caused one wrongly-raised ticket.

**Second: after changing any setting, check it on a document you have not opened before.** An
already-rendered document keeps serving the old version for a while.

---

## What was already run for you

All 120 cases were executed against the build above. **106 passed.** You do not need to repeat those
unless something looks different on your machine.

| | Cases | What it means for you |
|---|---|---|
| **Passed** | **110** | Already verified against real documents produced by this build |
| **Known problems** | **6** | Listed below. Expect them, mark the case Failed, raise nothing new |
| **Could not be set up** | **4** | Listed below with what each one needs |

## The six known problems — do not raise these again

1. **A line's own fee is left out of that line's totals.** If a work line has a fee or discount, the
   grey totals at the foot of that line ignore it, while the Summary charges it. Reported as
   **SV-9773**.
2. **Mileage and Eng Hrs print `0`** on an asset that has no reading, instead of disappearing.
   Reported as **SV-9680**.
3. **The printed text is not in Inter.** Every PDF comes out in a fallback typeface, so bold weights
   all look the same. Reported as **SV-9761**.
4. **A credit note that did not come from an invoice prints no disclaimer.** The case itself predicts
   this — mark it Failed and raise nothing.
5. **The Work Order line is missing from the top of the document.** The rule changed on 7 September
   and the build has not caught up. Reported as **SV-9642**.
6. **The paid banner leaves out the "Remaining Balance" line.** On a customer-portal document, a
   payment that did not settle the invoice should say how much was still owing; it does not. Reported
   as **SV-9803**, where it is being treated as a wording correction to the specification rather than
   a fault in the build.

## The four that need something we could not set up

| What it needs | Cases | Where it is tracked |
|---|---|---|
| A shop with **no logo** — one can be added or replaced but never removed | C44902 | **Not tracked in a ticket** — mark the case Failed and tell the QA lead |
| A shop location with a **blank address, city, state, postal code or phone** — all five are compulsory | C44907 | **Not tracked in a ticket** — mark the case Failed and tell the QA lead |
| A work order that has been through **Interstate Billing** approval | C44916 | **SV-9710** |
| The case itself — it has **no steps and no expected results** and belongs to another author | C45275 | — |

## How to reach the customer portal

Three of these were blocked until we found the way in, and it is worth knowing:

1. Click the **round avatar at the top right** of ShopView.
2. Click **Customer Portal** in the menu. It opens in a new browser tab, already signed in — there is
   **no separate password**.
3. Click **Invoices** in the portal's left menu. Use **Filter by Customer** to find one quickly.
4. To pay: open the invoice, **Pay Now**, confirm the payer, type the amount, **Continue to checkout**,
   then the test card `4242 4242 4242 4242`, any future expiry, any 3-digit code, ZIP `94107`.
5. To pay two invoices in one go: filter by one customer, tick two unpaid rows, click **Pay Online**.
6. To see the paid banner: on the invoice, click the **printer icon** at the top right and choose
   **"Print with Payment Receipt"**. The other choice, "Print Invoice", gives the same document
   without the banner.

**The portal only exists on staging.** These cases cannot be run on a QA branch.

## If you find something

Mark the case Failed and tell the QA lead. Include the work order or document number you used, say
what you saw against what the case expected, **and say what the nine switches were set to**. Do not
raise a ticket yourself.

## OUTSTANDING — what we are waiting on

| What | Who | What it blocks |
|---|---|---|
| A ruling on the **work order number** (SV-9770) | Chris Ward | Nothing. C44917 passes as the rule is written; the question is whether the rule is right |
| Whether the **PDF filename rule (G-R2)** covers emailed attachments | Chris Ward | Nothing yet — no case covers G-R2 at all |
| Whether **"Terms"** can ever be empty | Chris Ward | C44914 clause 2 describes a state the product cannot reach |
