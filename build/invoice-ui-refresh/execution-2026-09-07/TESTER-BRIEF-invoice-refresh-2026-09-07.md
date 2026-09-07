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
| **Passed** | **106** | Already verified against real documents produced by this build |
| **Known problems** | **4** | Listed below. Expect them, mark the case Failed, raise nothing new |
| **Could not be set up** | **10** | Listed below with what each one needs |

## The four known problems — do not raise these again

1. **A line's own fee is left out of that line's totals.** If a work line has a fee or discount, the
   grey totals at the foot of that line ignore it, while the Summary charges it. Reported as
   **SV-9773**.
2. **Mileage and Eng Hrs print `0`** on an asset that has no reading, instead of disappearing.
   Reported as **SV-9680**.
3. **The printed text is not in Inter.** Every PDF comes out in a fallback typeface, so bold weights
   all look the same. Reported as **SV-9761**.
4. **A credit note that did not come from an invoice prints no disclaimer.** The case itself predicts
   this — mark it Failed and raise nothing.

## The ten that need something we could not set up

| What it needs | Cases |
|---|---|
| The **customer portal** — the "paid" banner exists only on a portal-produced PDF | C44951, C44952, C45175 |
| The **authorizer entry screens** | C45275 |
| An **imported work order** | C45190 |
| A work order that has been through **Interstate Billing** approval | C44916 |
| A shop with **no logo**, or with a **blank address field** | C44902, C44907 |
| A customer with **no payment terms**, and an invoice totalling **$0.00** | C44963, C45178 |

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
