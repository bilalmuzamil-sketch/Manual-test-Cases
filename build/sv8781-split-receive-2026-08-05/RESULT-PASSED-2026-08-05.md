# SV-8781 — VERDICT: **PASSED**

**Ticket:** [SV-8781](https://shopview.atlassian.net/browse/SV-8781) — "Vendor invoice receiving splits
parts from same vendor into separate orders/receipts for parts" · Bug · QA Severity **High** ·
assignee **Dipesh Changawala**
**Environment:** `sv8781.qa.shopview.com` · build **`v3.5-fb6371c`**
**Tested:** 2026-08-05, 18:41Z → 19:36Z · driven live in the browser as **Admin** (42 permissions)

**Build marker read at both ends of the pass and byte-identical**, so nothing redeployed underneath:
`index.html` last-modified Wed, 05 Aug 2026 13:18:47 GMT · etag `b1f24719a960bcc98f97804e81280dcf` ·
sha256 `083040fad9541fedd9d95c576c0b5095538c5b7d339ceb036df5836844a085e0`.

---

## Result per check

Dipesh asked QA to focus on three things. **All three pass, plus the underlying cause.**

| # | Check (his words) | Verdict | Evidence |
|---|---|---|---|
| 1 | Splitting a line **moves its already-ordered, unreceived parts onto the new work order's own purchase order** | **PASS** | The original PO **S-15886** no longer resolves (`400 orderId Not found`); a new PO **S-15887** exists whose `workOrderId` is the **new** work order, holding **both** parts |
| 2 | **One PO block per vendor**, receivable on **a single vendor invoice**, for a work-order-scoped receive | **PASS** | `receive-view` returns **exactly 1 vendor block** ("Aabridge Beverages", `vendorMissing: false`) with a `purchaseOrders` array; the screen shows **one** Invoice Number field for both parts |
| 3 | **Correct per-item posting** | **PASS** | ZZ-P1 posted at Cost **$25.50**, Sell **$40.00**, Margin **36.25%**, status **Received**; work-order Parts total **$80.00** (2 × $40.00) |
| 4 | **Partially-received parts stay behind** | **PASS** | After receiving only ZZ-P1, `receive-view` lists **only** ZZ-P2 (`ordered 1.00, remaining 1, received 0.00`) and it remains **Awaiting** and still receivable |
| 5 | Regression: **moving** a part between lines | **NOT RE-TESTED** — Dipesh states this path was always correct and the fix did not touch it |

---

## Exact test data (so this is reproducible — Standing Rule 50)

Nothing here is left to the reader's choice:

| Thing | Value |
|---|---|
| Customer | **Aaborough Works** |
| Asset | **2020 Ford Transit**, VIN **86J8FAC1VALJ43SJY**, plate **XLT-2813** |
| Canned line used | **"Service - 5th wheel adjustment"**, description **"Out of adjustment"**, HD Fleet Rate **$112.46** |
| Original work order | **S2-15886** (`df3292a9-b877-4593-b6a4-daa85d64cede`) |
| Work order created by the split | **S2-15887** (`a6c4f265-5ca7-48da-8c73-f7ba8b1088b6`) |
| Original purchase order | **S-15886** (`af143b4c-fbdd-4f4d-99ca-b4785828e72b`) — **gone after the split** |
| Purchase order after the split | **S-15887** (`8b6dd6f9-6cf5-48d7-a3b3-11e1909e62f0`) |
| Part A | **ZZ-P1** / "ZZAUTOTEST part 1", qty **2** → received |
| Part B | **ZZ-P2** / "ZZAUTOTEST part 2", qty **1** → deliberately left behind |
| Vendor | **Aabridge Beverages** (`1e7bd0bf-e882-45fa-8c21-835e32ffa374`) |
| Vendor invoice number entered | **ZZAUTOTEST-INV-1** |

**Data was seeded by me** because the pre-condition did not exist: **0 of 600** work orders on this
environment had unreceived part requests. Per the QA lead's ruling, QA-branch data was **left in
place** (no cleanup).

---

## What was actually done, step by step

1. Created work order **S2-15886** for **Aaborough Works** on the **2020 Ford Transit**.
2. Added the canned line **"Service - 5th wheel adjustment"** (Approved, $112.46).
3. Added **two vendor-sourced parts** to that line and **ordered** both → they went to status
   **"Awaiting"** and created purchase order **S-15886** on **S2-15886**. *This is the pre-condition
   the bug is about: ordered, unreceived parts sitting on the original work order's PO.*
4. **Split the line** (`POST work-orders/split {ids:[lineId]}` — the exact call the UI's
   "Split work order" bulk action makes) → new work order **S2-15887**.
5. **Verified the fix:** PO **S-15886** was gone and PO **S-15887** now belonged to **S2-15887**,
   carrying **both** parts. The old work order was left with **0 lines**.
6. Opened the receive screen from the new work order (**Receive** on the part row) → routed to the
   **new** work order's own PO with one vendor block.
7. Entered invoice **ZZAUTOTEST-INV-1**, set ZZ-P1 to Cost $25.50 / Sell $40.00, **unchecked ZZ-P2**,
   and received → `POST /api/orders/receive-requested-parts` **200**.
8. Confirmed ZZ-P1 **Received** with correct figures and ZZ-P2 still **Awaiting** and receivable.

---

## Two things I ruled out as NOT defects — stated so nobody re-raises them

**1. "Something went wrong loading this section" on the receive screen — that was MY test rig, not the
product.** The only failing call was
`GET /api/organization/feature-flags?organization_id=` with an **empty** parameter. The app reads that
id from `getUser().data.details.intercom_data.company.id` in localStorage, and my synthetic sign-in
payload had not populated it. Once set, **zero API calls failed** and the screen rendered correctly.
**Not a product defect — do not file it.**

**2. The Receive button being disabled was correct behaviour, and the app explains itself well.**
Hovering it gave: *"This PO still needs: a vendor invoice number, a non-zero cost on every selected
part, a non-zero sell price on every selected part."* My seeded parts had zero cost and sell. Setting
them enabled the button immediately. **That is a good, self-explaining guard — worth keeping.**

---

## Honest limits of this pass

- **The "items from both the new and original work order in one block" wording could not be exercised
  as literally stated.** In my scenario the line carried *all* the parts, so the original work order
  ended with none — there was nothing left on it to merge. What **is** proven is the single-vendor
  block and the single-invoice receive on the split work order. Testing the merge of *two* POs for one
  vendor would need a work order with ordered parts on **two** lines, splitting only one. Worth a
  follow-up if Dipesh intends that exact case.
- **Regression check 5 (moving a part between lines) was not re-tested** — Dipesh states it was always
  correct and untouched by this fix.
- **The split was driven via its API call, not the on-screen bulk action.** The UI's row checkbox only
  appears on hover and would not take a click headlessly. The endpoint and payload are exactly what
  the UI's "Split work order" action sends (`{ids:[lineId]}`, read from the deployed bundle), and the
  UI route change it triggers was reproduced — but a human should confirm the button itself once.
- **This branch has not been declared final**, so per Standing Rule 49 this verdict is **PROVISIONAL**
  and pinned to build **`v3.5-fb6371c`**.

---

## Evidence

| File | Shows |
|---|---|
| `evidence/PASS-parts-moved-to-new-wo.png` | Both parts on split work order **S2-15887**, status **Awaiting**, each with **Receive** |
| `evidence/PASS-receive-one-vendor-single-invoice.png` | Receive screen: Work Order **S2-15887**, Vendor(s) **Aabridge Beverages**, **one** Invoice Number field, **2 parts** |
| `evidence/PASS-partial-receive-form.png` | Partial receive set up — invoice filled, ZZ-P2 unchecked |
| `evidence/PASS-per-item-posting-and-partial-receive.png` | ZZ-P1 **Received** at $25.50/$40.00/36.25%, ZZ-P2 still **Awaiting**, Parts total **$80.00** |

---

## OUTSTANDING — what I need from you

1. **Does Dipesh mean the two-PO merge case?** His wording says "one PO block per vendor with items
   from **both** the new and original work order". If he wants that exact case, it needs a work order
   with ordered parts on two lines and only one split — say the word and I will run it.
2. **A human should press the on-screen "Split work order" button once** — I drove the split through
   its API call because the row checkbox needs a real hover. Everything downstream of it is verified.
3. **Should I post this result to the ticket?** I have written nothing to Jira. Happy to post the
   verdict and the screenshots if you want it on the record.
