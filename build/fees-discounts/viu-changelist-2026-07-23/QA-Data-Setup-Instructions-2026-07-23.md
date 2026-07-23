# Data setup for QA — unblock the remaining Fees & Discounts + Simple Flow live checks (2026-07-23)

**Why:** a few test cases need a specific data situation on the build before I can observe them.
The one thing I can't do myself right now is **add a line/part to a work order** — the system's
"create line" call is currently erroring (HTTP 500), but **you can still add lines/parts normally
in the app**. So please build the small data situations below in the app and send me back the
**work order numbers** (and customer names where asked). Everything else I'll observe myself.

**Environment:** `https://app.staging.shopview.com` (log in as an Admin).
**Please tag any throwaway data with `ZZAUTOTEST`** in the name/notes so it's easy to clean up.
When done, just reply with the **work order numbers** you created for A, B, C (and the customer
names for D).

---

## A — Work order for the fee-calculation checks (unblocks the processing-fee math)
1. Go to **Work Orders → Create Work Order**.
2. For **Customer**, pick a customer that already has **Processing Fees** on its *Fees & Discounts*
   tab (e.g. **"11 A new Company"** — it has a 6% and a 5% Processing Fee default). Pick any asset.
   Save.
3. Open the work order → **Lines** tab → **New Line**. Add **one labour line** with a price
   (e.g. labour rate **$100**, **1** hour). Save the line.
4. On the same work order, add **one whole-work-order fee**: click the **⋮ (three-dot) menu at the
   top of the lines area → Add Fee** → choose **percentage**, e.g. **10%**. Save.
5. Confirm the work order now shows: the **labour line**, a **whole-work-order fee (10%)**, and a
   **Processing Fee** (it should auto-apply from the customer default).
6. **Send me this work order number.**
   *(This lets me read whether the Processing Fee is calculated on the correct base.)*

## B — Part fee that must stay visible after receive/pick (SV-8520)
1. Create a work order (any customer/asset).
2. Add a **part** to a line — either a **special-order** part or an **inventory** part.
3. **Before** receiving/picking it, add a **part fee** to that part (the part's ⋮ menu → Add Fee,
   e.g. 50%). Confirm the fee shows on the part line.
4. Now **receive** the part (special order) **or pick** it (inventory).
5. **Send me this work order number.**
   *(I'll check whether the part fee still shows on the line after receive/pick.)*

## C — Work order with a "Vendor Missing" group (Simple Flow receive order, SF-RCV-05/07)
1. Create a work order (any customer/asset).
2. Add **2–3 parts**. For at least **one** part, **do not assign a vendor** (leave it "Vendor
   Missing"); for the others, **assign a vendor** and **order** them.
3. **Send me this work order number.**
   *(I'll open the Receive / Accept-Delivery screen and check where the "Vendor Missing" group
   appears — top vs bottom.)*

## D — Customer fee-template picker states (CUST-005 / CUST-006)
On any customer's **Fees & Discounts** tab (Customers → open a customer → **Fees & Discounts**):
1. **Partly-linked:** point me to a customer that has **some** default fee/discounts added but
   **not all** available templates linked. *(I'll open "Add Fee/Discount" and check what the
   dropdown lists.)*
2. **All-linked:** point me to a customer that has **every** available template already linked
   (or link them all on one customer). *(I'll open "Add Fee/Discount" and read the empty-state
   message.)*
3. **Send me the customer name(s)** for both states (they can be the same customer before/after
   linking).

---

## What I do NOT need your help with (I'll do these myself)
- **Permission checks** (who can add a fee) — I'll assign a test role myself and restore it after.
- **"Require review before completion"** behaviour and the **Close/Cancel** completion pop-up — I'll
  drive these myself once the above data exists.
- **Reading** any of the screens above — just create the data and send the numbers; I observe.

## For dev (separate from the above)
There is a real build bug blocking the automated path: **creating a work-order line via the API
returns HTTP 500** (requestId `e1069cd9-3974-4785-a364-696d04f68443`). Adding a line **in the app
UI** is the workaround, which is why I'm asking you to build the data above by hand.
