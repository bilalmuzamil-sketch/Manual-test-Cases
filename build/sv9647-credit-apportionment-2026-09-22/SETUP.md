# SV-9647 — credits spread across invoices must print only the slice applied to each. Setup notes.

**Ticket:** SV-9647, *Credits Applied Across Multiple Part Sale Invoices Exceed Individual Invoice
Totals* — TESTING QA, priority Medium, reporter Ryan Fyfe, assignee Slavcho Mitrov, labels
`QA_Validation_Required` / `ai-unverified-repro` / `bug-report` / `source-intercom`.
Customer **Brian Orban, Midwest Diesel Service of Alpena**, 9 users, via Intercom.

**Environments, both read live 2026-09-22:**

| | host | build |
|---|---|---|
| **Fix branch** | `sv9647.qa.shopview.com` | **`v26.36.8-fc4dd05`**, last-modified Mon 21 Sep 08:48:45 GMT, etag `02d7ad481359311c5c530eeadf09b72d` |
| **Pre-fix (for the before-capture)** | `app.staging.shopview.com` | **`v26.36.8-e2c29c5`** — note this **redeployed during the session**; it read `v26.36.8-339df81` earlier today |

Organization `d55bc308-e61a-438d-b5f1-c7a73c89d49f`, workplaces **Staging Heavy Duty - 9919**
(`b3c8c820…`) and **Staging Lethbridge - 4310** (`f8a8b802…`) — the second one is what check 2's
cross-workplace case needs.

## The fixture on the branch, as far as it is built

| | |
|---|---|
| Customer | **ZZAUTOTEST SV-9647 Credit Split** `468d37dd-627e-44c6-85be-2db3fd4c97c9` — made **tax exempt** (local + federal) and **net 30**, so an invoice total equals its line total exactly and the $4.44 / $83.56 figures are reachable without tax arithmetic |
| Contact | **ZZ Tester** `84447709-f6ef-4fc4-b88d-74a2beefa63e`, `bilal.muzamil+sv9647@shopview.com` — needed because the New Part Sale customer picker searches **contacts**, not companies, and returns "No results" for a company with none |
| Part sale 1 | `0a33e93d-4015-4444-9e1d-448b78d1ab07` = **P-248**, line `a25de972…`, part `50477839…` — **$4.44**, approved |
| Part sale 2 | `00950c4c-033b-49a9-9808-fde692f359ff` = **P-249**, line `6f4c4f5e…`, part `91ed6896…` — **$83.56** |

## Recipes proven on this branch (worth keeping)

* **Create a part sale:** `POST /api/part-sales {"company_id":"<customer>"}` → 200. Everything else in
  the payload (`customer_id`, `contact_id`, `vehicle_id`, `mileage`, `vin`, …) may be null. Each new
  part sale comes with one implicit line named **Default**, whose id comes from
  `GET /api/work-orders/lines/{partSaleId}`.
* **Add a part:** `POST /api/work-orders/part/make-request` with `work_order`, `line`, `description`,
  `quantity`, `part_source_type:"vendor"`, **`category`** *and* `part_category_id` (both, same id),
  `margin`, `cost`, `sell_price`. **Do not send `core_charge: 0`** — it answers
  *"This value should be greater than 0."*
* **⚠️ THE SELL PRICE YOU SEND IS IGNORED; the margin wins.** Sending `sell_price: 4.44` with
  `cost: 1` and `margin: 75` stores **$4.00**. At the default 75% margin **sell = 4 × cost**, so pick
  the cost: **cost 1.11 → $4.44** and **cost 20.89 → $83.56**, both confirmed by re-reading the line.
  (Pleasingly, those two costs are the same numbers as two of the expected credit slices — coincidence,
  but worth not confusing in the evidence.)
* **`POST /api/work-orders/change-status`** takes **`id`**, not `work_order_id`, and moves
  estimate → approved fine — but **refuses `invoiced`**: *"Work order status cannot be changed manually
  to invoiced."* Invoicing goes through the Finance tab's **Create Invoice** action.

## Still to do

Create the invoices, then the two credit memos ($22.00 and $65.98) via `POST /api/credit-memos`, then
the single payment settling both invoices from both credits via
`POST /api/customer-account/create-customer-payment`. Then the same fixture on staging for the before.
