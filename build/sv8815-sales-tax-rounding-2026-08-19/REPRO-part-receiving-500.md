# How to replicate the part-receiving HTTP 500 — steps for staging

**Read this first, it matters.** I saw this **only on the SV-8815 QA branch** (`sv8815.qa.shopview.com`,
build `v3.8-1f5fb3c`). **I have not run it on staging** — I had no staging session open during this
run. So these are steps to *test* staging, not a claim about staging.

That distinction is the whole point of checking before we file:

- **If it reproduces on staging** → it is a real product defect, not branch-specific, and worth its own
  ticket.
- **If it does NOT reproduce on staging** → it is specific to the `sv8815` branch or its data, and the
  right move is a note to the developer rather than a ticket.

---

## The short version

Order a part on a work order, then try to receive it. The Receive button is enabled, you click it,
and nothing happens — the part stays at "Awaiting". Behind the scenes the save is returning a server
error.

---

## Steps (about 5 minutes)

**Setup**

1. Sign in to staging and make sure your **active location** (top right) is a location that has canned
   lines — on the QA branch that was **Staging Heavy Duty - 9919**.
2. **Work Orders → New Work Order.** Pick any customer and asset. On the QA branch I used customer
   **Aaborough Works** with asset **2020 Ford Transit** (VIN `86J8FAC1VALJ43SJY`).
3. Make sure the work order has a **contact** set (Aaborough Works → contact **Jeffrey Burns**).
   Without a contact you cannot invoice later, though it is not needed for the receive itself.

**Get a part onto it and order it**

4. Add a line. Any canned line will do; a simple labour one is fine.
5. Add a part to that line — **give it a real part number** (I used `ZZ8815PN`), description
   **ZZ8815 Return Test Part**, **quantity 4**, **cost $5.00**, **sell price $10.00**.
   *(A blank part number was my first suspect and it turned out not to be the cause, but use a real
   one so that variable is out of the way.)*
6. On the part row, click the blue **Order** button. The part status becomes **Awaiting** and a
   purchase order is created for it.

**Try to receive it — this is the step that fails**

7. Open the purchase order's receive screen. Two ways in: **Parts → Deliveries**, or go straight to
   `/accept-delivery/<the order id>`. The page is titled **Purchase Order Details** with a
   **Receive Parts** section.
8. If the page shows a **Vendor Missing** badge, assign a vendor first (any vendor from
   **Parts → Vendors**). *I tested both with and without a vendor — it failed either way — but assign
   one so nobody can say that was it.*
9. Fill in **Invoice Number** (e.g. `ZZ8815RECV`), leave **Invoice Date** as today, and set
   **Quantity Received** to **4**.
10. Click **Receive**.

**What I saw on the QA branch**

- The button was enabled, there was no validation message, and the part **stayed at "Awaiting"**.
- The save call `POST /api/inventory/orders/accept` returned **HTTP 500**.

**What should happen:** the part becomes **Received** and the line can then be completed.

---

## How to confirm it is really a 500 (30 seconds)

Before clicking **Receive**, open the browser dev tools (**F12**) → **Network** tab. Then click
Receive and look for the request named **`accept`**.

- **Status 500** → same failure I saw. Click it → **Response** tab and copy the `requestId` — that
  value is what lets a developer find it in the logs immediately.
- **Status 200/201** → it worked on staging, so this does **not** reproduce there.

---

## What I already ruled out on the QA branch

Please don't spend time re-testing these — all six were checked and none is the cause:

| Suspected cause | How it was ruled out |
|---|---|
| the part has a blank part number | built one carrying `ZZ8815PN` — still 500 |
| the purchase order has no vendor | assigned one, "Vendor Missing" badge cleared — still 500 |
| no vendor invoice number (the org requires one) | supplied one — still 500 |
| my request was malformed | captured the screen's **exact** request and replayed it verbatim — same 500 |
| nowhere to receive the stock into | **376** bin locations exist, including a default "General Storage" |
| the Tax field was empty | 500 with tax `0` and with tax `1` |

Request ids from the QA branch, if the developer wants to compare logs: `7b8f7c1c`, `b32c9979`,
`a31d8bdc`, `ea4f1863`, `5ead1dce`, `52a43345`.

---

## Why this matters for SV-8815

Nothing here is caused by the sales-tax change — it is in parts receiving. Its only connection to
SV-8815 is that it **blocked one check**: the handoff asks that a **part return / credit memo**
against an "Invoice total" invoice pro-rates the credited tax from the frozen invoice tax. I could not
produce an invoice with a returnable part, so that one item is untested. The handoff describes that
pro-rating as **new** behaviour, so it is the gap I would most want closed before release.

**If you'd rather I just test it:** give me a staging session (`PHPSESSID`, `sv_sso_session`,
`cf_clearance`) and I will run the steps above and report back in about ten minutes — then we file, or
don't, on evidence.
