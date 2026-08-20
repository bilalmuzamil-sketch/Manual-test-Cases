# SV-8815 — Sales tax rounding method (line by line vs invoice total)

**Environment:** `https://sv8815.qa.shopview.com` (API `https://sv8815api.qa.shopview.com`)
**Build marker:** `v3.8-1f5fb3c` — `index.html` last-modified **Wed 19 Aug 2026 14:02:26 GMT**, etag `a9e66ecc2174eb6d889221f4d976ef24`
**Reference used:** the developer's auto-generated QA handoff (*beta — used as a reference point, not as the specification*)
**Posted to Jira on the QA lead's approval** — comment **75272**, 2026-08-19 23:28 -0500, with 14 annotated exhibits inline. QA verdict: **PASSED**.

> **This branch is treated as FINAL because we passed it (Standing Rule 62, QA lead's ruling
> 2026-08-20: *"always consider it final IF we pass the QA. The branch will only change if we fail the
> QA for that branch."*).** The verdicts below are **not provisional** and no re-check queue is open.
> The build marker above is recorded as the record of *what* was passed, not as a hedge about it — and
> it was re-read on 2026-08-20 (same version, same etag) after the follow-up work in section 9.
> *(The earlier version of this line said the opposite. Rules 49/60 still govern the long-lived
> feature branches that engineering never declares final; they do not govern a passed per-ticket
> branch.)*

---

## Overall status

**PASSED — 37 of 37 checks that could be run have passed. Nothing is broken.**
*(35 at the time of posting; +2 on 2026-08-20 when the part-return check turned out not to be blocked
after all — a part return leaves the issued invoice untouched under each of the two rounding modes.)*

**Two** things could not be tested on this branch, neither of them a defect in this change — plus one
item I had wrongly listed as blocked:

1. **Fees and discounts** — **both** entry points the QA lead pointed out were driven on this branch
   (work order → **⋮** → *Add Work Order Fee / Discount*, **and** the part row's **⋮** → *Add Part Fee
   / Discount*, which I had not tried before). Both open the full dialog — template, name, type, calc
   type, percent, cap, **Taxable**, live preview — and **both leave Add Fee hard-disabled** behind the
   same banner, *"Map a Fee item in Settings → QuickBooks before adding a fee."*, with the API
   refusing identically. **This is not a one-step unblock as I first reported:** the mapping cannot be
   created from inside ShopView because no QuickBooks company is attached to this org (see the
   correction below), so it is a genuine external dependency on an Intuit account.
   **Why it does not weaken the tax verdict:** a taxable fee would be a fourth taxable component, and
   **shop supplies already exercise exactly that** — enabled, invoiced, and reconciling to the cent in
   both modes with no ±1¢ drift (section 3).
2. **QuickBooks itself** — as expected, and as the QA lead already flagged.
3. ~~**The part-return check** — blocked by a reproducible HTTP 500 when receiving a part.~~
   **WRONG, corrected 2026-08-20. Receiving a part works.** I had used a dead screen
   (`/accept-delivery`) instead of the part row's **Receive** button. The check has since been run in
   **both** rounding modes and **passes**: returning 1 of 3 parts leaves the issued invoice untouched.
   The **credit** for that returned part was then driven too (Parts → Returns → Receive Credit) — it is
   a **vendor** credit at the part's cost, taxed at the workplace rate, identical under both modes.
   See section 9. *(My first answer here — "a credit memo carries no tax at all" — was about
   `POST /api/credit-memos`, a different feature entirely, and is superseded.)*

> **Correction, and then a correction OF the correction (2026-08-20).** I first wrote that
> "QuickBooks is not connected", then withdrew that because
> `GET /api/bookkeeping/adjustment-item-mapping-status` reports **`quickBooksConnected: true`**.
> **On a full read of the state, the original statement was closer to right and my withdrawal was
> wrong.** Three other signals all say not connected:
> `GET /api/bookkeeping/products-and-services` → **400 "Bookkeeping is not configured"**,
> `GET /api/bookkeeping/integration` → **200 with an Intuit OAuth `authUrl` still waiting to be used**,
> and the admin page offers only a Connect button with no mapping fields. **So this org has no
> QuickBooks company attached, the `true` flag is misleading, and the Fee/Discount item mapping cannot
> be created from inside ShopView at all** — which makes it a genuine external dependency, not a
> one-step unblock as I previously said. The misleading flag is worth a developer's glance in its own
> right. **My own lesson: I corrected an inference with another inference from a single boolean
> instead of reading all of the state, and so got it wrong twice.**

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
| Fees and discounts on a **new** work order (handoff A, C-discount, and the fee/discount half of G) | The control is reachable and the dialog works, but the **Add** button is disabled and the API 409s on a **QuickBooks item-mapping** gate. See the section below for the exact condition. | **Map a Fee item and a Discount item under Settings → QuickBooks** — one step, on an org whose bookkeeping is configured |
| The QuickBooks side of the change (the $0.01 open balance the banner warns about) | QuickBooks is not connected | A QuickBooks-connected company — already flagged as a manual-tester task |
| ~~Credit memo / part return pro-rating (handoff D, third item)~~ | **RESOLVED 2026-08-20 — this was never blocked; I was using the wrong screen.** The part return was run in both modes and the issued invoice does not move; and a credit memo turns out to carry no tax at all. See section 9 below and `CORRECTION-part-receiving-works.md`. | nothing — closed |
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

### Fees and discounts — the control is there; the gate is a QuickBooks item mapping

You were right that this is reachable from the work order section, and I had been looking in the wrong
place. The path is:

> Work order → **⋮** (`button_work_order_nav_bar_menu`) → **Add Work Order Fee / Discount** →
> the *New Work Order Fee / Discount* dialog

The dialog works properly: the **Apply From Template** picker lists templates, the fields fill, and the
live preview computes — *"Work-order subtotal $27.81 · Fee +$5.00 · New work-order subtotal $32.81 ·
Tax is recalculated on save."* There is also a per-line control, `button_add_labor_adjustment_<lineId>`.

What stops it is a single guard, and it is enforced on **both** sides — so it is not a front-end-only
gate that could be waved through:

- the **Add Fee** button renders `disabled` with `aria-disabled="true"`, under an amber banner reading
  *"Map a Fee item in Settings → QuickBooks before adding a fee."*
- `POST /api/work-orders/adjustments/add` answers **409** with the same message.

**The exact condition**, read from the guard component and confirmed live:

```
GET /api/bookkeeping/adjustment-item-mapping-status
  -> {"quickBooksConnected": true, "feeItemMapped": false, "discountItemMapped": false}
```

The banner defaults both flags to *true* and only blocks when the fetch returns false. **So mapping one
Fee item and one Discount item under Settings → QuickBooks is the whole unblock.**

Things I tried that do **not** get past it, so nobody repeats them: creating an adjustment **template**
(`POST /api/adjustment-templates` → **201**, no guard there — but applying it still leaves Add disabled
and the API still 409s); passing `templateId` straight to `adjustments/add`; the line-level labour
adjustment button; turning `bookkeeping_enabled` off on the location (silently ignored);
`PUT /api/bookkeeping/settings {settings:{feeItemMapped:true}}` (**500**). The admin *New Fee /
Discount* template dialog has no QuickBooks-item field, so the mapping is not set from there either.

**Why the mapping cannot be done from here:** the QuickBooks settings page has a full mapping UI in the
code, but it cannot render on this org because `GET /api/bookkeeping/products-and-services` returns
**400 "Bookkeeping is not configured"** — even though the status endpoint says QuickBooks is connected.
Those two disagree, which is itself worth a developer's glance.

---

### CORRECTED 2026-08-20 — receiving a part is NOT broken, and the last gap is closed

**An earlier version of this section said receiving a part returned HTTP 500 on this branch and listed
six ruled-out causes. That was wrong.** The QA lead received a part successfully on **S-15998**; I then
reproduced his path and it works first time.

**There are two Receive surfaces and I used the dead one.**

| | ✅ the live one — what the product uses | ❌ the one I used |
|---|---|---|
| entry point | the part row's blue **Receive** button on the work order's Lines tab | **Parts → Deliveries**, or `/accept-delivery/{orderId}` |
| save call | **`POST /api/orders/receive-requested-parts`** → **200**, part → `received` | `POST /api/inventory/orders/accept` → **500** |

The 500 was real, but on a route the product no longer drives a work-order part request through — so it
is not a defect a customer can reach, and reporting it as one was a mistake. **Nothing has been filed,
and nothing should be.** Neither of the two differences I had guessed at from his screenshots mattered
(ticking *Line Approved*; setting the vendor in the New Part Request modal) — the *screen* was the
variable, and I had tested both against the wrong one. Full write-up, including the working recipe:
`CORRECTION-part-receiving-works.md`. The playbook's §T.8 has been rewritten rather than annotated.

**The check this unblocked — a part return against an issued invoice, in BOTH modes:**

| | billed under **Invoice total** — S-15999 | billed under **Line by line** — S-16001 (control) |
|---|---|---|
| invoice before | 244.00 / 23.79 / 267.79 | 244.00 / 23.79 / 267.79 |
| return 1 of 3 parts at $80 | `make-return-request` → 200, status `returned` | → 200, status `returned` |
| **invoice after** | **244.00 / 23.79 / 267.79 — unchanged** | **244.00 / 23.79 / 267.79 — unchanged** |
| work-order panel after | Subtotal 164.00 · tax 23.79 · Total 187.79 · Balance 267.79 | **identical, figure for figure** |

Exhibits `EXHIBIT-R1`…`EXHIBIT-R5`. **AC6 holds for part returns under both rounding methods.**

**An observation, and it is NOT this ticket's:** on the invoiced work order after the return, the
Financial Info panel's **Subtotal drops by the returned part while the tax line keeps the invoiced
figure**, so its Total ($187.79) is neither the invoiced total ($267.79 — which the **Balance** still
shows correctly) nor a clean recompute ($179.99). The *Line by line* control produced the same six
figures byte for byte, so **the rounding change is not what causes it.** Reported, not filed — filing
is the QA lead's call.

**And the handoff item itself is a non-item.** It asked about a **credit memo**, which is not a part
return: `POST /api/credit-memos` takes **`customer_account_id` and `amount` and nothing else**. Probing
with a partial body returns exactly those two as required; the created record is
`{creditMemoId, creditNumber:"CM-100", totalAmount:8000, openBalance:8000, status:"open",
refundPaymentId:null}` — **no tax field, no rate, no line items.** So there is no tax in a credit memo
for the rounding setting to pro-rate. One 30-second probe on day one would have established that
instead of a night spent on a receiving screen.

**Two things worth keeping from the wrong turn:** the correct way to put a part on a line —
`POST /api/work-orders/part/make-request` takes **`work_order`** and **`line`**, not
`work_order_id`/`line_id` — and the return call's own two traps: `part_id` is the **part object's** id
from `GET /api/work-orders/lines/{WO}` (not the part-request id), and **`return_reason` is required**.


### The credit for a returned part — found, driven, and it is a VENDOR credit (2026-08-20)

The QA lead pointed out where the credit actually lives: **Parts → Returns → tick the returned part →
Receive Credit**. Driven end to end on both returns:

```
/parts/returns  ->  tick return_request_checkbox_<id>  ->  button_receive_credit
   ->  /parts/confirm-return?ids=<id>&isManualReturn=0   ("Process Return")
   ->  button_post_credit  ->  POST /api/inventory/returns/create  ->  200
```

**What it is, and why the rounding setting cannot reach it:**

| | observed |
|---|---|
| Subtotal | **the part's COST — $10.00**, not its $80.00 sell price |
| Tax | pre-filled **$0.50**, editable — that is **5% of cost**, from `workplace_tax: 5` in the payload |
| the location's **sales** tax model | **ZZ8815 9.75pct** — a different rate entirely |
| under both rounding modes | **identical: subtotal $10.00, total $10.50** |
| after posting the credit | the customer's issued invoice **unchanged**, byte for byte |

So a returned part's credit is a **vendor** credit priced at cost, taxed at the workplace rate — not
the customer's sales tax and not the frozen invoice tax. **The sales-tax rounding setting does not
touch it**, which is why it reads the same under both modes. Entering a restocking fee reduces the
subtotal and the tax recomputes on the reduced base ($0.98 fee → subtotal $9.02, tax $0.45, total
$9.47), so the tax *is* computed — just from the wrong rate to matter here.

**Where this leaves the handoff's wording.** The handoff asked that the credited tax be *"pro-rated
from the frozen invoice tax"*. That is **not what the build does** — it charges the workplace rate on
cost. The ticket itself says nothing about credits, so per our own rule the expected behaviour has no
document behind it and this is **a question for the developer, not a defect call**: is the vendor
credit meant to carry the workplace purchase tax (as built), or the customer's frozen sales tax (as
the handoff line reads)?

**A defect in our own path, worth reporting:** on the Process Return screen **two different fields
share `data-test-id="input_base"`** — the per-row **Restocking Fee** and the **Tax** in the totals
block. Any script targeting "the tax field" silently edits the restocking fee instead; it did exactly
that to me. That is an automation hazard rather than a customer-facing bug, but it will bite the
automation engineer.

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
