# Credit Invoice — verified against the REAL printed document, 2026-09-02

**The document that was never seen has now been rendered.** The 2026-08-31 pass concluded *"the credit
memo document is **not rendered on the sv8218 branch**"* after guessing 13 API routes. **That was
wrong.** One hover-and-click in the UI produced it.

| | |
|---|---|
| Branch / build | **sv8218**, `v26.35.6-8454936` |
| Route | `Customers` → the customer → the **`Invoices`** tab → the row whose `Type` chip reads **`Credit`** → the printer icon in the **`Action`** column (tooltip **`Print credit memo`**) |
| What it fires | **`GET /api/credit-memos/{creditMemoId}/pdf`** |
| What comes back | `application/pdf`, **185,780 bytes**, downloaded as `Credit memo - 9_2_2026.pdf` |
| The credit tested | `CM8218-4189` · **Unapplied** · money-only line · −$500.00 · customer *Adrian's Truck & Trailer Repair LLC* |
| Files | `credit-memo-CM8218-4189.pdf` · `credit-memo-text.txt` · `render-meta.json` |

## The document, verbatim (its full extracted text — 546 characters, one page)

```
Subtotal -$500.00
Tax $0.00
Total Credit -$500.00
Payments
Balance $500.00
Staging Heavy Duty - 9919
9919 Shepard Road SE
Calgary, Alberta
T2C 4M5
(403) 523 - 0488
Credit: CM-4189
Issue date: Sep 2, 2026
ADDRESSES
CREDIT TO
Adrian's Truck & Trailer Repair LLC
6241 Joshua Parkway
East Chloe, Prince Edward Island L6C4P7
CREDIT NUMBER STATUS
CM-4189 Unapplied
DESCRIPTION QUANTITY RATE RESTOCKING FEE TOTAL
5 — Admin ShopView -- -- $0.00 -$500.00
CUSTOMER SIGNATURE PRINTED NAME DATE
GST# 812694966 RT0001 Powered by ShopView CM-4189 - Page 1 / 1
```

## Per-case verdicts

| Case | Verdict | What the document shows |
|---|---|---|
| [C44964](https://shopview.testrail.io/index.php?/cases/view/44964) masthead | **PASS** (3/3) | `Credit: CM-4189` with the `CM-` prefix · `Issue date: Sep 2, 2026` · no money figure and no boxed headline in the masthead |
| [C44965](https://shopview.testrail.io/index.php?/cases/view/44965) `Credit To` label | **PASS** (2 of 3 observable) | the address block is headed **`CREDIT TO`**, not `Bill To`; the customer name and address render; **no `Remit Payment To` block anywhere**. Line 2's "address fields hide when empty" is not exercised by this customer's data |
| [C44966](https://shopview.testrail.io/index.php?/cases/view/44966) status table | **PASS** (lines 1, 2, 4) | `CREDIT NUMBER STATUS` / `CM-4189 Unapplied`. **The `Invoice Number` column is absent — which is what line 4 REQUIRES**: *"For an account-level credit with no origin invoice, the whole Invoice Number column is hidden."* This is an account-level credit. Line 3 (an origin invoice's number) needs a credit issued against an invoice |
| [C44967](https://shopview.testrail.io/index.php?/cases/view/44967) credited items table | **PASS** (5 of 6) | columns exactly `DESCRIPTION QUANTITY RATE RESTOCKING FEE TOTAL` · money-only line shows **`--`** for Quantity and Rate · Restocking Fee reads **`$0.00`** with no fee · Total is **`-$500.00`**, leading minus, not parentheses · Description is the memo text `5 — Admin ShopView`. **Line 2 (a returned part's negative quantity and rate) needs a returned-part credit** |
| [C44968](https://shopview.testrail.io/index.php?/cases/view/44968) restocking arithmetic | **PARTIAL** | line 2 PASSES — a money-only line's Total is the credited amount, `-$500.00`. **Line 1 (−2 × $50.00 with a $10.00 fee → −$90.00) needs a returned-part credit with a fee** |
| [C44969](https://shopview.testrail.io/index.php?/cases/view/44969) totals block | **PASS** (lines 1, 2, 7 for this state) | `Subtotal -$500.00` negative · `Tax $0.00`, one row, reading `$0.00` when none · `Total Credit -$500.00` negative · **`Payments` shows the label with no rows** · **`Balance $500.00` — POSITIVE**, exactly as line 2 requires for an Unapplied credit. Lines 3–6 and 8 need the other four statuses |
| [C44970](https://shopview.testrail.io/index.php?/cases/view/44970) disclaimer + signature | **line 2 PASS · line 1 NOT VERIFIED** | the signature area is present with all three lines: `CUSTOMER SIGNATURE PRINTED NAME DATE`. **No disclaimer text appears anywhere in the document.** Two readings remain open — the shop may have none configured, or the credit note may omit it. **Not asserted either way:** the control (rendering the same shop's ordinary invoice) failed because that row has **no print icon at all** and the preview route needs an `invoice_id` that is not the account transaction id |
| [C45168](https://shopview.testrail.io/index.php?/cases/view/45168) no `Remit Payment To` | **line 1 PASS · line 2 NOT VERIFIED** | no `Remit Payment To` block, confirmed against the full text. Line 2 ("the `Credit To` block spans the full width") is a **layout** assertion that text extraction cannot answer — it needs the rendered page measured |
| [C45179](https://shopview.testrail.io/index.php?/cases/view/45179) unapplied balance | **PASS** | `Payments` label with no rows; **`Balance $500.00`, positive** — the credit's full open balance. The case names `$200.00` because its own precondition seeds a $200 credit; the assertion is "the full open balance, positive", and it holds. **The defect the case warns about — "a flat $0.00 rendering here is a defect" — does NOT occur** |
| [C45180](https://shopview.testrail.io/index.php?/cases/view/45180) partly applied | **NOT VERIFIED** | needs a partially-applied credit; this one is Unapplied |
| [C45181](https://shopview.testrail.io/index.php?/cases/view/45181) applied / voided | **NOT VERIFIED** | needs a fully-applied credit and a voided one. **This is the case behind the open developer question** |
| [C45182](https://shopview.testrail.io/index.php?/cases/view/45182) refund rows | **NOT VERIFIED** | needs a refunded credit |
| [C45183](https://shopview.testrail.io/index.php?/cases/view/45183) partly refunded + applied | **NOT VERIFIED** | needs that combined state |

**Summary: 6 PASS · 1 PARTIAL · 6 NOT VERIFIED for want of a credit in another state — and 0 FAIL.**
Nothing in the document contradicts a documented expectation. **No defect is raised** (QA lead's
standing instruction: this lane makes tests runnable and does not create defects).

## What this changes

1. **The route is proven and recorded**, so it goes into the cases' preconditions and a tester can run
   them: `build/testing-tools/route_registry.mjs find "credit"`.
2. **The 2026-08-31 "not rendered on this branch" conclusion is withdrawn.** It is rendered; the pass
   guessed 13 API shapes and never tried the `/pdf` suffix, and looked for a preview when it is a
   download.
3. **Six cases move from never-checked to PASS on real output**, and one from never-checked to PARTIAL.
4. **The remaining six need only DATA, not a route** — a credit in each of partially-applied, applied,
   voided, refunded, and partly-refunded-and-partly-applied states. That is a seeding job on a
   disposable branch, no longer a blocked one.

## Two things deliberately not asserted

- **The disclaimer** (C44970 line 1). Absent from this document; whether the shop configures one is
  unestablished. Reported, not concluded.
- **The `Credit To` full-width layout** (C45168 line 2). Text extraction cannot measure width.
