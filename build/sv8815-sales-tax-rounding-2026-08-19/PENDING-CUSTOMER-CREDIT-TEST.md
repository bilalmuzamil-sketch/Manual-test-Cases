# READY TO RUN: the customer-credit check — the one in-scope path SV-8815 never exercised

> ## ✅ CLOSED 2026-08-20 — THE TEST WAS RUN AND IT PASSES
> The `sv8815` branch merged into staging and self-destructed, so it was run on
> **`app.staging.shopview.com`, build `v3.8-0cb5771`**, where `salesTaxRoundingMode` is present.
> **Result: the credit is pro-rated from the frozen invoice tax, in both modes.** Two $5.10 parts at
> GST 5% — Invoice total froze at **0.51** and the credit split **0.26 + 0.25 = 0.51**; the
> line-by-line control froze at **0.52** and split **0.26 + 0.26 = 0.52**; two separately posted
> credit memos summed to **$10.71**, the invoice exactly. **Nothing to raise.**
> Full write-up, annotated evidence and the reusable route:
> **`build/sv8815-customer-credit-2026-08-20/FINDINGS.md`**.
>
> Two corrections to the plan below, for the record: the rate is **5% (GST)** on staging, not 9.75%,
> so the distinguishing amounts became **2 × $5.10** rather than 2 × $10.00; and the screen is
> **Customer → Invoices → Issue Credit**, which this document had not located.

**Status when written: BLOCKED ON ENVIRONMENT, not on design.** The test below is worked out and needs
one run.

## Why this test exists

Sinisa's answer of 2026-08-20 (`SINISA-RULING-2026-08-20.md`) separates two credits. The **vendor**
credit we walked is correct as built and outside this ticket. The **customer** credit — *"crediting the
customer for a part on their invoice, pro-rated from the frozen invoice tax"* — **only engages under
Invoice total**, which makes it a tax calculation gated on the mode this ticket adds. It has never been
tested, and comment 75278 does not list it as untested.

## Why the part-return check already run has NO POWER to detect a problem here

On the amounts used (subtotal $244.00, frozen tax $23.79 at 9.75%, returning an $80.00 part) the two
candidate methods agree to the cent:

| method | figure |
|---|---|
| pro-rata share of the frozen tax | 23.79 x (80/244) = 7.7996 -> **7.80** |
| recompute the remainder, credit the difference | 23.79 - round(164 x 9.75%) = 23.79 - 15.99 = **7.80** |

Identical — so the check could not have failed either way, and that is also why the "Line by line"
control read the same and we wrongly concluded the setting does not reach a credit.
**A valid test needs amounts where the two methods disagree.**

## The case to use — and it proves two things at once

**Two taxable lines of exactly $10.00, tax rate 9.75%, nothing else on the work order.**

| | Line by line | Invoice total |
|---|---|---|
| per-line tax | round(10.00 x 9.75%) = round(0.975) = 0.98, twice | — |
| **frozen invoice tax** | **1.96** | 20.00 x 9.75% = **1.95** exactly |

So the shape **first confirms the mode is actually in effect** (1.95 vs 1.96 — a one-cent difference on
the invoice itself), and then distinguishes the credit methods:

**Credit one of the two $10.00 lines on the Invoice-total invoice (frozen tax $1.95):**

| method | credited tax | tax left on the invoice |
|---|---|---|
| **pro-rata from the frozen tax** (what Sinisa says is intended) | round(1.95 x 1/2) = round(0.975) = **0.98** | **0.97** |
| recompute the remainder and credit the difference | 1.95 - round(10.00 x 9.75%) = 1.95 - 0.98 = **0.97** | **0.98** |

**PASS = credited tax $0.98, leaving $0.97.** Anything else is a finding.

**Control, to show the pro-rata only engages under Invoice total:** the same credit on a **Line by
line** invoice (frozen tax 1.96) should credit **0.98** and leave **0.98** — both methods agree there,
which is exactly why Sinisa says the pro-rata does not engage on that path.

## Steps

1. Location on **Invoice total** (set it in the Locations dialog by clicking — see §W.6).
2. Work order, two taxable lines of **$10.00** each, nothing else. Invoice it.
   Confirm the issued invoice reads subtotal **20.00**, tax **1.95**, total **21.95**.
   *(If it reads 1.96 the mode is not in effect and the run is invalid — stop and fix that first.)*
3. Credit the customer for **one** line — the customer-side credit path, **not** Parts > Returns >
   Receive Credit, which is the vendor credit. **The exact screen still has to be found**: it was not
   located before access was lost, and `POST /api/credit-memos` is not it (that takes only
   `customer_account_id` + `amount`, no tax). Look for a credit action on the invoice itself, and grep
   the deployed bundle for the endpoint (playbook §U rung 4) rather than guessing.
4. Read the credited tax and the tax remaining on the invoice. Compare against the table above.
5. Repeat the whole thing on **Line by line** as the control.

## Why it could not be run on 2026-08-20

**`sv8815api.qa.shopview.com` no longer resolves — it has no DNS A record**, while
`sv8815.qa.shopview.com` still resolves to four IPs and serves the same static build
(`v3.8-1f5fb3c`, etag `a9e66ecc2174eb6d889221f4d976ef24`). The agent proxy therefore refuses CONNECT to
the API host with a 502 (`connect_rejected`, "policy denial or upstream failure"), reproduced on three
consecutive attempts, while `api.staging.shopview.com` and another branch's `sv8785.qa.shopview.com`
both answer 200 — so it is that one host, not a network policy change.

**The branch's API has been decommissioned.** That is consistent with the ticket having passed QA
(Standing Rule 62 — a passed per-ticket branch is finished with).

## What is needed to run it

Either of:

- **a restored or rebuilt `sv8815` API host**, with fresh `.qa.shopview.com` cookies; or
- **`app.staging.shopview.com` / `api.staging.shopview.com`** *if* the change has been merged there —
  both hosts are reachable now — plus staging cookies. First check on staging:
  `GET /api/workplaces` should report **`salesTaxRoundingMode`** on a location. If that field is absent
  the change is not on staging and this test cannot run there either.

**No Jira comment on SV-8815 without the QA lead's permission** (his instruction, 2026-08-20).
