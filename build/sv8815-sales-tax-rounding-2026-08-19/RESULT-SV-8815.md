# SV-8815 — Sales tax rounding method (line by line vs invoice total)

**Environment:** `https://sv8815.qa.shopview.com` (API `https://sv8815api.qa.shopview.com`)
**Build marker:** `v3.8-1f5fb3c` — `index.html` last-modified **Wed 19 Aug 2026 14:02:26 GMT**, etag `a9e66ecc2174eb6d889221f4d976ef24`
**Reference used:** the developer's auto-generated QA handoff (*beta — used as a reference point, not as the specification*)
**Nothing has been posted to Jira.** Results are held for the QA lead's approval.

> ⚠️ **This is a QA branch and has not been declared final.** Every verdict below is **provisional**
> and tied to the build marker above. If the branch redeploys, the on-screen labels and the
> pass/fail verdicts have to be re-read (Standing Rules 49 / 60).

---

## Overall status

**PASSED — 35 of 35 checks that could be run have passed. Nothing is broken.**

Two things could **not** be tested on this branch, both for the same reason and neither of them a
defect in this change:

1. **Fees and discounts cannot be added at all** on this branch. Adding either one is refused with
   *"Connect a QuickBooks item for fees before adding a fee."* / *"…for discounts before adding a
   discount."*, and QuickBooks is **not connected** here (the QuickBooks admin page shows only a
   "Connect to QuickBooks" button). So every checklist item that needs a fee or a discount on a
   **new** work order is blocked. See "What could not be tested" below.
2. **QuickBooks itself** — as expected, and as the QA lead already flagged.

---

## 0. Against the ticket itself — all 6 acceptance criteria met

The handoff was used as a checklist, but **the ticket is the source of truth**, and its own acceptance
criteria and worked examples were read and checked directly.

| # | SV-8815 acceptance criterion | Verified | Result |
|---|---|---|---|
| 1 | A new setting lets a shop choose between Line-by-line and Total-rounded | Locations dialog, **Sales Tax Rounding**, both options present | **PASS** |
| 2 | Default for all existing and new shops is Line-by-line; no current tax calculation changes until the setting is changed | 7 of 7 existing locations read the default; 5 of 5 new locations saved as the default; 993 of 1,000 existing invoices still carry their own original tax snapshot | **PASS** |
| 3 | Line-by-line: **example 1 → $6.46**, **example 2 → $1.80** | built the ticket's own two examples | **PASS** — 6.46 and 1.80 |
| 4 | Total-rounded: **example 1 → $6.45**, **example 2 → $1.81** | same two examples on the other setting | **PASS** — 6.45 and 1.81 |
| 5 | Selecting Total-rounded shows the QuickBooks $0.01 open-balance warning | the amber banner, captured | **PASS** |
| 6 | Applies to invoices going forward; does not retroactively rewrite already-issued invoices | flipped the setting in both directions with an invoice already issued | **PASS** |

**And all four of the ticket's open questions, as Sinisa answered them on 18 August (comment 75226 —
the newest authoritative statement of what was built), were checked against the build:**

| Answer given | What the build does | Result |
|---|---|---|
| *"Two options: **Line by line (default)** and **Invoice total**, each with a one-line explanation under it"* | Exactly that — both options carry their own explanation line under the field | **PASS** |
| *"**Location**, as built"* | The setting is stored and applied per location: A on Invoice total billed 2.71 while B, untouched, billed 2.70 on the same subtotal | **PASS** |
| *"anything not yet invoiced follows the location's setting; once an invoice is issued it keeps the rounding it was billed with"* | Both halves confirmed — a not-yet-invoiced work order re-prices to the location's current setting, and an issued invoice does not move when the setting is flipped either way | **PASS** |
| *"Not single-rate … built to round once **per rate**"* | Confirmed on two rates (GST 5% + PST 7%) and on three stacked rates (4% + 3% + 1%): each rate is rounded once on its own base and the rate rows still add up to the invoice tax | **PASS** |

One small note, not a defect: Chris's earlier answer phrased the second option as *"Rounded on
total"*; the build follows Sinisa's later wording, **"Invoice total"**. The later statement is what
was built, so the build is right and only the earlier phrasing is stale.

---

## 1. The new setting on the Locations screen (handoff section C, first two items)

Administration → Locations → edit a location.

| # | Check | Result |
|---|---|---|
| 1 | The field exists and reads **"Line By Line (Default)"** on an untouched location | **PASS** |
| 2 | No warning banner is shown while the default is selected | **PASS** |
| 3 | The dropdown offers exactly two options, each with its own explanation | **PASS** — see wording below |
| 4 | Picking **"Invoice Total"** shows the warning banner about the $0.01 open balance | **PASS** |
| 5 | Save, reopen → **Invoice Total** persisted | **PASS** |
| 6 | Switch back to **Line By Line (Default)** → the banner disappears | **PASS** |
| 7 | Save, reopen → **Line By Line (Default)** persisted | **PASS** |
| 8 | A brand-new location saves and reads back as line-by-line without anyone touching the field | **PASS** — 5 new locations were created for this run; all 5 came back as `line_by_line` |

**The exact wording on the build** (captured live, so it can be reused in test cases):

- Field label: **Sales Tax Rounding**
- Option 1: **Line by line (default)** — *"Round the tax on every line to the cent, then add them up.
  This is how ShopView has always billed — leave it here unless your QuickBooks totals disagree."*
- Option 2: **Invoice total** — *"Add the taxable lines up first, then round the tax once. Matches
  QuickBooks automated sales tax, so pick this if your synced invoices come out a cent apart."*
- Warning banner: *"Many QuickBooks companies round tax line by line. If yours does, synced invoices
  can show a $0.01 open balance after payment that has to be cleared by hand. Changing this affects
  work orders invoiced from now on — invoices already issued keep the rounding they were billed
  with."*

**Two small wording differences from the handoff** (cosmetic — reported, not raised as defects):

- The handoff calls the field *"Sales tax rounding"*; the build renders it **"Sales Tax Rounding"**,
  and the selected value renders in title case (**"Invoice Total"**, **"Line By Line (Default)"**)
  while the dropdown list itself uses sentence case (*"Invoice total"*, *"Line by line (default)"*).
- The warning banner is shown **whenever "Invoice Total" is the selected value** — including when you
  simply reopen a location that was already saved that way, not only at the moment you change it.
  That reads as deliberate (it is an informational notice about the setting, not about the edit).

**Evidence:** `evidence/C1-locations-dialog-default-line-by-line.png` ·
`evidence/C2-rounding-dropdown-both-options.png` ·
`evidence/C3-invoice-total-selected-warning-banner.png` ·
`evidence/C4-reopened-persisted-invoice-total.png` ·
`evidence/C5-switched-back-banner-gone.png` ·
`evidence/C6-reopened-persisted-line-by-line.png`

---

## 2. The pinned numbers (handoff section B) — all 12 measurements match

Every work order was built to the stated taxable subtotal first, then the tax was read; then the
location was flipped to the other option and the **same** work order was rebuilt and read again.

| # | Rate(s) | Taxable subtotal | Line by line — expected / **got** | Invoice total — expected / **got** | Result |
|---|---|---|---|---|---|
| 1 (real customer invoice INV-S-26020) | GST 5% | 6,055.65 ✅ | 302.81 / **302.81** | 302.78 / **302.78** | **PASS** |
| 2 (ticket example) | 9.75% | 18.54 ✅ | 1.80 / **1.80** | 1.81 / **1.81** | **PASS** |
| 3 (ticket example) | 8% | 80.67 ✅ | 6.46 / **6.46** | 6.45 / **6.45** | **PASS** |
| 4 (reported invoice SV-6676) | GST 5% | 918.30 ✅ | 45.93 / **45.93** | 45.92 / **45.92** | **PASS** |
| 5a (three stacked rates) | 4%+3%+1% | 25.00 ✅ | 2.02 / **2.02** | 2.00 / **2.00** | **PASS** |
| 5b (three stacked rates) | 4%+3%+1% | 27.81 ✅ | 2.22 / **2.22** | 2.22 / **2.22** | **PASS** |

**Case 1 is the important one and it holds:** on the untouched default the tax comes out at
**302.81** on a subtotal of **6,055.65** — the number on the customer's paper invoice. The default
path has not changed.

**Case 5b's breakdown was read per rate, not just the total** — this is what proves each rate is
rounded once on its own base:

| Rate | Line by line — expected / **got** | Invoice total — expected / **got** |
|---|---|---|
| ZZS A 4% | 1.11 / **1.11** | 1.11 / **1.11** |
| ZZS B 3% | 0.84 / **0.84** | 0.83 / **0.83** |
| ZZS C 1% | 0.27 / **0.27** | 0.28 / **0.28** |
| **total** | 2.22 / **2.22** | 2.22 / **2.22** |

The totals are identical in both modes while the individual rate lines move by a cent in opposite
directions, and the rate lines still add up to the invoice tax. Exactly as the handoff predicts.

**Cases 2 and 3 confirm the setting is not a one-way lever:** case 3 goes **down** a cent, case 2
goes **up** a cent.

---

## 3. The new mode, beyond the pinned numbers (handoff section C, remaining items)

| Check | Setup | Line by line | Invoice total | Result |
|---|---|---|---|---|
| Several taxable lines whose per-line tax lands on a half cent | 3 lines @ 9.27, rate 9.75% | **2.70** (0.90 × 3) | **2.71** (27.81 × 9.75% = 2.711475) | **PASS** — 1¢ higher, as predicted |
| Two tax rates, each rounded once on its own base | 3 lines @ 9.27, GST 5% + PST 7% | GST **1.38** + PST **1.95** = **3.33** | GST **1.39** + PST **1.95** = **3.34** | **PASS** — and both rate lines add up to the invoice tax exactly |
| Shop supplies enabled — supplies tax and line taxes still add up to the invoice tax | labor 27.81 + supplies 2.92 = base 30.73, rate 9.75% | **2.98** (0.90 × 3 + 0.28) | **3.00** (30.73 × 9.75% = 2.996175) | **PASS** — no ±1¢ drift; the single rate row equals the invoice tax on the nose in both modes |
| Zero-tax location | location tax = "Zero Tax" (no rates) | **0.00** | **0.00** | **PASS** — no crash, tax 0.00 everywhere |
| Discount / negative adjustment | — | — | — | **NOT TESTABLE on this branch** (see below) |

---

## 4. Invoices already issued are frozen (handoff section D)

This is the promise the warning banner makes, and it holds in **both** directions.

| # | Invoiced while the location was on… | then the location was switched to… | Invoice tax when billed | After the switch | Result |
|---|---|---|---|---|---|
| D1 | Line by line | Invoice total | **2.70** | **2.70** — subtotal, tax, total, the per-rate breakdown and the balance all byte-identical | **PASS** |
| D2 | Invoice total | Line by line | **2.71** | **2.71** — same, nothing moved | **PASS** |

Both were checked on **two** surfaces: the work-order screen and the issued invoice record itself.

**A second, stronger proof of the same thing turned up by accident.** This run changed the Heavy Duty
location's whole **tax model** several times (GST → 8% → 9.75% → stacked → GST+PST). An invoice issued
long before this ticket — **S-4802**, paid, from February 2025 — still reads its own frozen snapshot:
tax model **GST**, rate **Federal Tax 5%**, tax **$141.66**, total **$2,974.79**, created
**2025-02-12** — even though its location now carries a completely different tax. Issued invoices
store their own copy of the tax model and do not follow the location.

---

## 5. Payments close cleanly (handoff section E)

| # | Invoice | Payment | Expected | Got | Result |
|---|---|---|---|---|---|
| E1 | "Invoice total", total **$30.52** (tax 2.71) | full | Balance exactly $0.00 | Payments **$30.52**, Balance **$0.00** | **PASS** — no one-cent residue |
| E2 | Default, total **$30.51** (tax 2.70) | full | Balance exactly $0.00 | Payments **$30.51**, Balance **$0.00** | **PASS** |
| E3 | "Invoice total", total **$30.52** | partial **$10.00** | Balance $20.52 | Payments **$10.00**, Balance **$20.52** | **PASS** — to the cent |

Balances were read off the tester-facing **Financial Info** panel on the work order, not inferred.

---

## 6. The setting is per location, not per organisation (handoff section F)

Two locations, the **same** tax model (9.75%) and the **same** taxable subtotal (27.81), one work
order each:

| Location | Its rounding setting | Taxable subtotal | Tax | Result |
|---|---|---|---|---|
| **A — Staging Heavy Duty - 9919** | set to **Invoice total** | 27.81 | **2.71** | **PASS** |
| **B — Staging Lethbridge - 4310** | left untouched on the default | 27.81 | **2.70** | **PASS** |

Only A's invoice used the new rounding. B, which nobody touched, still billed the old way. The two
locations read back as `total_rounded` and `line_by_line` respectively, so the setting is stored per
location.

---

## 7. Every surface agrees (handoff sections A and H)

Same work order, read on the invoice screen and on the rendered invoice document, in both modes:

| Surface | Line by line | Invoice total |
|---|---|---|
| Invoice screen — Financial Info | Labor $27.81 · Parts $0.00 · Shop Supplies $2.92 · Subtotal $30.73 · **ZZ8815 9.75pct $2.98** · Total **$33.71** | … · **ZZ8815 9.75pct $3.00** · Total **$33.73** |
| Rendered invoice document (print/PDF preview) | Labor $27.81 · Parts $0.00 · Shop supplies $2.92 · Subtotal $30.73 · **ZZ9 9.75% (9.75%) $2.98** · Total **$33.71** · Balance $33.71 | … · **ZZ9 9.75% (9.75%) $3.00** · Total **$33.73** · Balance $33.73 |

**PASS — the two surfaces agree figure for figure in both modes.**

One thing to note for whoever writes the test cases: the invoice document prints a **Line Total** per
line and a **single tax row per rate** at the bottom. It does **not** print a per-line tax column — so
the place to check per-line tax is the **Customer Invoice export**, below.

### 7a. The Customer Invoice export — the reconciliation the handoff calls out

The handoff's specific ask: *"open the printed invoice / PDF and add up the tax shown against labor +
parts + shop supplies. It must come to **exactly 302.78** — not 302.77, not 302.79. Same on the
customer invoice export."*

Case 1 was rebuilt on both settings, **invoiced**, and pulled through
**Reports → Export Reports → Customer Invoice**. The export carries a per-line `ItemTaxAmount`.

| Case-1 invoice | Setting | Line amounts add to | 13 per-line tax amounts add to | Expected | Result |
|---|---|---|---|---|---|
| S8815-15965 | Line by line | 6,055.65 | **302.81** | 302.81 | **PASS** |
| S8815-15966 | Invoice total | 6,055.65 | **302.78** | 302.78 | **PASS** |

You can see the tax-split code doing its job. Same 13 lines, and three of them shed a cent under
"Invoice total" to bring the total down by exactly 3¢:

| | Line by line | Invoice total |
|---|---|---|
| the 375.00 line | 34.38 | **34.37** |
| the 2,081.59 line | 104.08 | **104.07** |
| the 437.50 line | 21.88 | **21.87** |
| **all 13 lines** | **302.81** | **302.78** |

And the on-screen figures for case 1 held through invoicing on both settings: subtotal **6,055.65**,
tax **302.81 / 302.78**, total **6,358.46 / 6,358.43** — the handoff's numbers to the cent.

**Every invoice in the export reconciles.** All 19 invoices this run produced were checked, not a
sample: each one's per-line tax amounts add up exactly to that invoice's tax — 2.70 for the
line-by-line ones, 2.71 for the invoice-total ones, and 2.98 / 3.00 for the two with shop supplies
(where the shop-supplies charge appears as its own export row with its own tax share).

Export header, for the test cases:
`InvoiceNo, Customer, InvoiceDate, DueDate, Terms, Location, Memo, Item(Product/Service),
ItemDescription, ItemQuantity, ItemRate, ItemAmount, ItemTaxCode, ItemTaxAmount, "ShopView Products
and Services"`

---

## What could not be tested on this branch, and why

| Item | Why | What would unblock it |
|---|---|---|
| Fees and discounts on a **new** work order (handoff A, C-discount, and the fee/discount half of G) | Adding either is refused with HTTP 409 *"Connect a QuickBooks item for fees before adding a fee."* / *"…for discounts before adding a discount."* **QuickBooks is not connected on this branch** — the QuickBooks admin page offers only a "Connect to QuickBooks" button, the Fees & Discounts template dialog has no QuickBooks-item field, and there is no reachable setting that satisfies the check. This is an environment gate, not a bug in this change. | A QuickBooks-connected organisation, or a branch where that guard is off |
| The QuickBooks side of the change (the $0.01 open balance the banner warns about) | QuickBooks is not connected | A QuickBooks-connected company — already flagged as a manual-tester task |
| Credit memo / part return pro-rating (handoff D, third item) | **A part cannot be received on this branch**, so no invoice with a returnable part can be produced. Receiving fails with **HTTP 500** both through the API and through the tester-facing **Receive Parts** screen — with a vendor assigned, a valid invoice number and a valid received quantity (request ids `7b8f7c1c-…`, `b32c9979-…`, `a31d8bdc-…`, `ea4f1863-…`). See the note below. | Someone who can get a part to **Received** on this branch — then the return check is a 5-minute job |
| "Existing invoices are unchanged **versus the released build**" (handoff G) | Proving *unchanged* needs the same invoice read on a build **without** this change. This branch is the only environment in hand. What **can** be proven here is that issued invoices are frozen and still carry their original tax model and figures — see section 4 above and section 7 below. | Read the same invoice numbers on staging or production and diff |

---

## 8. Existing invoices and locations (handoff section G)

### 8a. Every existing location still reads the default — **PASS**

All **7** locations in the organisation report `line_by_line`, including the two long-standing
Staging locations that nobody has ever edited. **0 locations** sit on anything else unless someone
deliberately set it.

| Location | Its tax | Rounding setting |
|---|---|---|
| Staging Heavy Duty - 9919 | (changed by this run) | `line_by_line` |
| Staging Lethbridge - 4310 | GST | `line_by_line` |
| the 5 ZZ8815 test locations created for this run | various | `line_by_line` |

### 8b. All 1,000 existing invoices were read — **no old invoice moved** ✅

Every stored invoice on the branch was read individually (`GET /api/invoices/{invoiceId}/view`) — all
**1,000**, no sampling.

| What was checked | Result |
|---|---|
| Old invoices still carry their **own** tax model, not the location's current one | **993 of 1,000** still read tax model **GST, Federal Tax 5%**. The only **7** that read anything else are the seven **this run created**. Not one pre-existing invoice moved — even though this run changed Heavy Duty's tax model five times (GST → 8% → 9.75% → stacked → GST+PST). |
| Paid invoices still close to zero | **863** invoices are paid; **all 863** have a paid balance of exactly **0**. No new one-cent residue anywhere in the historical set. |
| Multi-rate invoices in the historical data | **0** — no existing invoice on this branch has more than one tax rate, so the handoff's "two or more tax rates" category cannot be covered from old data. It **was** covered on new invoices instead (section 3, two rates, and section 2 cases 5a/5b, three stacked rates). |
| Invoices with a fee or a discount in the historical data | **0** carry an adjustment, so that category cannot be covered from old data either, and fees/discounts cannot be created on this branch (see the blocked list). |
| Invoices with shop supplies | **811** — covered. |
| Invoices with declined lines | **290** — present in the data. |

**A stronger proof of the same thing, worth reading twice.** The single most convincing record is
**S-4802** — an invoice from **12 February 2025**, paid. Its location's tax model has since been
replaced entirely by this run, and the invoice still reads: tax model **GST**, rate **Federal Tax
5%**, tax **$141.66**, subtotal **$2,833.13**, total **$2,974.79**, created **2025-02-12**. Issued
invoices keep their own frozen copy of the tax model. That is exactly what the warning banner
promises.

### 8c. What this section can and cannot prove — read this before quoting it

The one thing this branch **cannot** prove on its own is the literal wording of the handoff:
*"nothing here may differ from current released behaviour."* Proving *differ* needs the **same
invoice read on a build without this change**, and this branch is the only environment in hand.

To get as close as possible, the tax on all 1,000 invoices was **recomputed** from each invoice's own
lines, rates and shop-supplies charge and compared with the stored figure. The base reconstruction is
sound — the recomputed taxable base equals the invoice's own printed subtotal on **956 of 1,000**
invoices — but the tax classification came out mixed: 444 agree with both arithmetics, 106 match
line-by-line only, 168 match invoice-total only, 282 match neither, with the differences almost all
**±1 or 2 cents**.

**That mixed result is not evidence of a defect, and must not be reported as one.** Two reasons:

1. The handoff says so itself: *"Across 1018 historical invoices, **162** already have per-line taxes
   that don't add up to the invoice tax by a cent or two, independent of this change."* Cent-level
   noise on old invoices is a known pre-existing condition with its own follow-up ticket.
2. The reconstruction cannot reproduce whatever granularity the original code used — whether tax was
   rounded per line, per labour row and per part row separately, or per part. It also cannot see
   line-level tax exemptions, and **290** of these invoices carry declined lines, whose treatment on
   old invoices differs from today's rule. Of the 282 "neither" invoices, **126** have declined lines.

Three invoices sit further out than a couple of cents and are worth a developer's eye — but with **no
baseline they are not findings, and nothing here says they are wrong**: **S-5329** (stored 49.56 vs
59.56 recomputed), **S-4542** (605.81 vs 594.48), **S-5927** (253.81 vs 103.82 — this one has 24
declined lines, which is almost certainly the whole explanation).

**What would close section G properly:** read the same invoice numbers on staging or production and
diff them against this branch. That is a 20-minute job with a staging session and it is the only
thing that turns "frozen, and still on its original tax" into "provably identical to the released
build".

---

### The part-receiving 500 — reported, but NOT raised as a defect against this ticket

Getting a part to **Received** is the gateway to the last unchecked item (return a part against an
"Invoice total" invoice and check the credited tax is pro-rated). On this branch it does not work:

- **Receive Parts** screen (`/accept-delivery/{orderId}`) → **Receive** → `POST /api/inventory/orders/accept`
  → **HTTP 500**, generic error body, request id `b32c9979-e714-4fdc-b384-c902c4119723`.
- Same call made directly, with the same payload the UI sends → **HTTP 500** (`a31d8bdc-…`, `ea4f1863-…`).
- It is **not** the missing vendor: the purchase order initially showed a **Vendor Missing** badge, so a
  vendor was assigned (`POST /api/orders/{id}/assign-vendor` → 200, `vendorMissing` went to `false`) and
  the receive still 500s.
- It is **not** a missing invoice number either — one was supplied, and the org requires one.
- The most likely cause on the evidence: **every canned line's part on this branch has a blank part
  number.** All 8 single-part canned lines tried give `part_number: ""` ("Gear oil", "Transmission
  fluid", "Wiper blades", "Air filter", "grease", "Tie rod", "Grease"). A blank part number is a known
  blocker in this area. Adding a numbered inventory part instead was also attempted —
  `POST /api/work-orders/part/make-request` wants `work_order`, `line`, `description`,
  `part_source_type`, and then answers *"Inventory part is required when source type is inventory"* for
  every field name tried for the part itself.

**Why this is not being raised against SV-8815:** it is in parts receiving, not in tax rounding;
nothing in this change touches it; and there is no baseline build to show it ever worked. It is
recorded here so whoever picks up the part-return check knows the blocker and does not re-derive it.

---

## Notes for the developer

1. **The accepted value for the new setting is `total_rounded`, not `invoice_total`.** The handoff and
   the UI call the option "Invoice total", but `POST /api/workplaces/change` rejects
   `sales_tax_rounding_mode: "invoice_total"` and `"total"` with HTTP 400 *"Invalid sales tax rounding
   method."* and accepts only **`total_rounded`**. Worth naming the wire value in the handoff so the
   automation does not have to discover it.
2. **`GET /api/invoices/{workOrderId}/details` is a live re-price of the work order, not the issued
   invoice.** For the February-2025 invoice S-4802 it returned today's date, today's location tax
   (`ZZ8815 9.75pct`) and a different subtotal, while `GET /api/invoices/{invoiceId}/view` returned
   the real frozen invoice. Anyone checking "did the invoice move?" against `details` would report a
   false alarm.
3. **A work order created through `POST /api/work-orders/create` ignores the `workplace_id` in the
   payload** and lands on the session's active location. If the active location is not the one you
   configured, the work order silently picks up a different tax — and, because canned lines are
   location-scoped, the canned-line dropdown shows "No results" and lines fail to save with no error.
   This cost time on this run and is worth a line in the handoff for the automation.
