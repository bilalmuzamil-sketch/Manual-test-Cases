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

**PASSED so far — 24 of 24 checks that could be run have passed. Nothing is broken.**

Two things could **not** be tested on this branch, both for the same reason and neither of them a
defect in this change:

1. **Fees and discounts cannot be added at all** on this branch. Adding either one is refused with
   *"Connect a QuickBooks item for fees before adding a fee."* / *"…for discounts before adding a
   discount."*, and QuickBooks is **not connected** here (the QuickBooks admin page shows only a
   "Connect to QuickBooks" button). So every checklist item that needs a fee or a discount on a
   **new** work order is blocked. See "What could not be tested" below.
2. **QuickBooks itself** — as expected, and as the QA lead already flagged.

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

## 6. Every surface agrees (handoff sections A and H)

Same work order, read on the invoice screen and on the rendered invoice document, in both modes:

| Surface | Line by line | Invoice total |
|---|---|---|
| Invoice screen — Financial Info | Labor $27.81 · Parts $0.00 · Shop Supplies $2.92 · Subtotal $30.73 · **ZZ8815 9.75pct $2.98** · Total **$33.71** | … · **ZZ8815 9.75pct $3.00** · Total **$33.73** |
| Rendered invoice document (print/PDF preview) | Labor $27.81 · Parts $0.00 · Shop supplies $2.92 · Subtotal $30.73 · **ZZ9 9.75% (9.75%) $2.98** · Total **$33.71** · Balance $33.71 | … · **ZZ9 9.75% (9.75%) $3.00** · Total **$33.73** · Balance $33.73 |

**PASS — the two surfaces agree figure for figure in both modes.**

One thing to note for whoever writes the test cases: the invoice document prints a **Line Total** per
line and a **single tax row per rate** at the bottom. It does **not** print a per-line tax column, so
the handoff's "per-line tax shown on each invoice line" is not a surface that exists on this build's
invoice document.

---

## What could not be tested on this branch, and why

| Item | Why | What would unblock it |
|---|---|---|
| Fees and discounts on a **new** work order (handoff A, C-discount, and the fee/discount half of G) | Adding either is refused with HTTP 409 *"Connect a QuickBooks item for fees before adding a fee."* / *"…for discounts before adding a discount."* **QuickBooks is not connected on this branch** — the QuickBooks admin page offers only a "Connect to QuickBooks" button, the Fees & Discounts template dialog has no QuickBooks-item field, and there is no reachable setting that satisfies the check. This is an environment gate, not a bug in this change. | A QuickBooks-connected organisation, or a branch where that guard is off |
| The QuickBooks side of the change (the $0.01 open balance the banner warns about) | QuickBooks is not connected | A QuickBooks-connected company — already flagged as a manual-tester task |
| Credit memo / part return pro-rating (handoff D, third item) | Not yet run — see "Still to do" | — |
| "Existing invoices are unchanged **versus the released build**" (handoff G) | Proving *unchanged* needs the same invoice read on a build **without** this change. This branch is the only environment in hand. What **can** be proven here is that issued invoices are frozen and still carry their original tax model and figures — see section 4 above and section 7 below. | Read the same invoice numbers on staging or production and diff |

---

## 7. Existing invoices — what was checked at scale

_(in progress — 1,000 stored invoices are being read and their tax arithmetic classified; results
and the honest limits of that check will be added here when the scan finishes)_

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
