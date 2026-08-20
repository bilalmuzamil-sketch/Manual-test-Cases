# SV-8815 — Jira comment, DRAFT ONLY

**NOT POSTED.** Held for the QA lead's approval, per his instruction:
*"Do not post the results/comment in the ticket without my approval."*

When approved, this goes on <https://shopview.atlassian.net/browse/SV-8815> in the house format:
overall status on the first line, then the table of everything tested, then the inline annotated
images, then a rule, then the technical detail last.

**14 annotated exhibits, one per challenge a reviewer could make.** Every one carries the work-order
number and the build marker in its header band, boxes drawn from real element geometry, and a caption
explaining what it proves. **Every figure shown is on an INVOICED work order, so it is frozen** — a
developer clicking the link tomorrow sees the same number. All 14 URLs verified HTTP 200.

| Order | Exhibit | Closes the challenge |
|---|---|---|
| 1 | `EXHIBIT-S1-setting-DEFAULT-line-by-line.png` | "the setting isn't there" |
| 2 | `EXHIBIT-S2-setting-INVOICE-TOTAL-warning.png` | "there's no QuickBooks warning" (AC5) |
| 3 | `EXHIBIT-A1-case1-DEFAULT-302.81.png` | "you didn't test the real reported invoice" |
| 4 | `EXHIBIT-A2-case1-INVOICE-TOTAL-302.78.png` | the same invoice on the new setting |
| 5 | `EXHIBIT-B1-case3-DEFAULT-6.46.png` | AC3, the ticket's own example 1 |
| 6 | `EXHIBIT-B2-case3-INVOICE-TOTAL-6.45.png` | AC4, example 1 — one cent DOWN |
| 7 | `EXHIBIT-C1-case2-DEFAULT-1.80.png` | AC3, the ticket's own example 2 |
| 8 | `EXHIBIT-C2-case2-INVOICE-TOTAL-1.81.png` | AC4, example 2 — one cent **UP**: "the tax just goes down" is wrong |
| 9 | `EXHIBIT-D1-stacked-DEFAULT-breakdown.png` | three stacked rates, default breakdown |
| 10 | `EXHIBIT-D2-stacked-INVOICE-TOTAL-breakdown.png` | "you only looked at the total" — the rate rows move, the total does not |
| 11 | `EXHIBIT-F1-payment-closes-to-zero.png` | "it leaves a cent behind" |
| 12 | `EXHIBIT-G1-locationA-INVOICE-TOTAL-2.71.png` | per-location, side A |
| 13 | `EXHIBIT-G2-locationB-DEFAULT-2.70.png` | "it's an org-wide switch" — untouched location still bills 2.70 |
| 14 | `EXHIBIT-H1-invoice-from-Feb-2025-untouched.png` | "old invoices moved" |

Embed each with `contentFormat:"adf"` as external media:

```json
{"type":"mediaSingle","attrs":{"layout":"full-width"},
 "content":[{"type":"media","attrs":{"type":"external",
   "url":"https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv8815-sales-tax-rounding-2026-08-19/evidence/<FILENAME>"}}]}
```

---

## OVERALL QA STATUS: PASSED

Tested on `sv8815.qa.shopview.com`, build **v3.8-1f5fb3c** (last-modified Wed 19 Aug 2026 14:02:26
GMT). **35 of 35 checks that could be run on this branch passed.** Two areas could not be tested here
and neither is a defect in this change: fees and discounts need a **QuickBooks Fee/Discount item
mapped** before the Add button enables, and a part cannot be **received** on this branch (HTTP 500),
so the part-return check has no data to run on. Both are pinned down precisely in the technical
section.

### The ticket's own acceptance criteria — 6 of 6 met

| AC | What it asks | Result |
|---|---|---|
| 1 | A setting to choose between Line-by-line and Total-rounded | **PASSED** |
| 2 | Default is Line-by-line for all existing and new shops; nothing changes until it is switched | **PASSED** — 7/7 existing locations, 5/5 new ones, and 993/1000 existing invoices untouched |
| 3 | Line-by-line: example 1 → **$6.46**, example 2 → **$1.80** | **PASSED** — 6.46 and 1.80 |
| 4 | Total-rounded: example 1 → **$6.45**, example 2 → **$1.81** | **PASSED** — 6.45 and 1.81 |
| 5 | Total-rounded shows the QuickBooks $0.01 open-balance warning | **PASSED** |
| 6 | Applies going forward; does not rewrite already-issued invoices | **PASSED** — flipped in both directions with an invoice already issued |

### And the four open questions, as answered on 18 Aug

| Answer | Build | Result |
|---|---|---|
| Two options, "Line by line (default)" and "Invoice total", each with a one-line explanation | exactly that | **PASSED** |
| Scope = Location | per-location: A billed 2.71 while untouched B billed 2.70 on the same subtotal | **PASSED** |
| Not-yet-invoiced follows the location's setting; issued invoices keep their billed rounding | both halves confirmed | **PASSED** |
| Not single-rate — rounds once **per rate** | confirmed on 2 rates and on 3 stacked rates | **PASSED** |

### Everything tested, in detail

| # | Test | Status |
|---|---|---|
| 1 | Locations dialog shows **Sales Tax Rounding** = "Line By Line (Default)" on an untouched location, no warning banner | PASSED |
| 2 | The dropdown offers both options, each with its own explanation | PASSED |
| 3 | Picking "Invoice Total" shows the $0.01 QuickBooks warning banner | PASSED |
| 4 | Save → reopen → "Invoice Total" persisted | PASSED |
| 5 | Switch back to the default → banner gone → save → reopen → persisted | PASSED |
| 6 | A brand-new location saves as line-by-line without anyone touching the field (5 of 5) | PASSED |
| 7 | **Case 1 (real customer invoice INV-S-26020)** — subtotal 6,055.65, tax **302.81** on the default | PASSED |
| 8 | Case 1 on "Invoice total" — tax **302.78**, total **6,358.43** | PASSED |
| 9 | Case 2 — 9.75% on 18.54: **1.80** default / **1.81** invoice-total (goes UP a cent) | PASSED |
| 10 | Case 3 — 8% on 80.67: **6.46** default / **6.45** invoice-total (goes DOWN a cent) | PASSED |
| 11 | Case 4 (reported invoice SV-6676) — 918.30: **45.93** / **45.92** | PASSED |
| 12 | Case 5a — three stacked rates on 25.00: **2.02** / **2.00** | PASSED |
| 13 | Case 5b — three stacked rates on 27.81: **2.22** both ways | PASSED |
| 14 | Case 5b **per-rate breakdown**: 1.11 / 0.84 / 0.27 default vs 1.11 / **0.83** / **0.28** invoice-total, both summing to 2.22 | PASSED |
| 15 | Half-cent lines on one rate — 3 × 9.27 at 9.75%: **2.70** / **2.71** | PASSED |
| 16 | Two tax rates (GST 5% + PST 7%), each rounded once on its own base; the two rate lines add up to the invoice tax | PASSED |
| 17 | Shop supplies enabled — supplies tax and line taxes still add up exactly, no ±1¢ drift | PASSED |
| 18 | Zero-tax location on "Invoice total" — tax 0.00 everywhere, no crash | PASSED |
| 19 | Invoice issued on the default, then the location switched to "Invoice total" → invoice **unchanged** | PASSED |
| 20 | Invoice issued on "Invoice total", then switched back → invoice **unchanged** | PASSED |
| 21 | Full payment on an "Invoice total" invoice → balance **exactly $0.00** | PASSED |
| 22 | Full payment on a default invoice → balance **exactly $0.00** | PASSED |
| 23 | Partial payment ($10.00 of $30.52) → balance **$20.52**, to the cent | PASSED |
| 24 | The setting is **per location**: location A on "Invoice total" billed 2.71 while location B, untouched, billed 2.70 on the same subtotal | PASSED |
| 25 | Invoice screen and the rendered invoice document agree figure for figure, both modes | PASSED |
| 26 | **Customer Invoice export reconciliation** — case 1's 13 per-line tax amounts add up to **exactly 302.81** on the default and **exactly 302.78** on "Invoice total" | PASSED |
| 27 | All 19 invoices this run produced reconcile in the export, per-line tax to invoice tax | PASSED |
| 28 | All **7** existing locations read "Line by line (default)" without anyone setting them | PASSED |
| 29 | All **1,000** existing invoices read individually — **993** still carry their own GST 5% snapshot; the only 7 that do not are the ones this run created | PASSED |
| 30 | All **863** paid invoices still sit at a zero balance — no new one-cent residue | PASSED |
| — | Fee / discount on a new work order | NOT TESTABLE — the control is reachable (WO ⋮ → Add Work Order Fee / Discount) but Add is disabled and the API 409s until a **QuickBooks Fee/Discount item is mapped** |
| — | Part return / credit memo pro-rating | NOT TESTABLE — receiving a part returns HTTP 500 on this branch (6 causes ruled out) |
| — | The QuickBooks side (the $0.01 open balance the banner warns about) | NOT TESTABLE — for a manual tester on a QuickBooks-connected company |

### The most convincing single record

An invoice from **12 February 2025** — **S-4802**, paid — still reads tax model **GST**, rate
**Federal Tax 5%**, tax **$141.66**, total **$2,974.79**. This run changed its location's tax model
five times over. Issued invoices keep their own frozen copy. That is exactly what the warning banner
promises.

### Honest limits

- This is a QA branch and has not been declared final, so every verdict above is tied to build
  `v3.8-1f5fb3c` and would need re-reading after a redeploy.
- The handoff's section G asks that existing invoices "not differ from current released behaviour".
  Proving *differ* needs the same invoice read on a build **without** this change, which this branch
  cannot provide. What is proven here is that issued invoices are frozen and still carry their
  original tax model and figures. Reading the same invoice numbers on staging or production would
  close it properly.

---

## Technical details for developers

**Environment:** `sv8815.qa.shopview.com` / `sv8815api.qa.shopview.com`, build `v3.8-1f5fb3c`,
etag `a9e66ecc2174eb6d889221f4d976ef24`.

**Three things worth folding into the handoff:**

1. **The accepted wire value for the setting is `total_rounded`, not `invoice_total`.**
   `POST /api/workplaces/change` with `sales_tax_rounding_mode: "invoice_total"` or `"total"` returns
   **400 "Invalid sales tax rounding method."**; only `total_rounded` is accepted. The UI and the
   handoff both call the option "Invoice total", so the automation has to discover this.
2. **`GET /api/invoices/{workOrderId}/details` is a live re-price of the work order, not the issued
   invoice.** For the February-2025 invoice S-4802 it returned today's date, the location's *current*
   tax model and a different subtotal, while `GET /api/invoices/{invoiceId}/view` returned the real
   frozen invoice. Anyone checking "did the invoice move?" against `details` will report a false alarm.
3. **`POST /api/work-orders/create` ignores the `workplace_id` in the payload** and uses the session's
   active location. If they differ, the work order picks up the wrong location's tax and — because
   canned lines are location-scoped — the canned-line dropdown returns "No results" and lines fail to
   save with no error shown.

**Blockers hit, with request ids, in case they are useful:**

- **Fees / discounts.** The control is at WO **⋮** → *Add Work Order Fee / Discount*; the dialog and
  its live preview work. The blocker is one guard, enforced on both sides: `button_add_adjustment`
  renders `disabled`/`aria-disabled`, and `POST /api/work-orders/adjustments/add` answers **409
  "Connect a QuickBooks item for fees before adding a fee."** The condition is
  `GET /api/bookkeeping/adjustment-item-mapping-status` →
  `{"quickBooksConnected":true,"feeItemMapped":false,"discountItemMapped":false}` — so **mapping a Fee
  item and a Discount item under Settings → QuickBooks is the whole unblock.** Note QuickBooks **is**
  connected per that endpoint, while the QuickBooks settings page still shows a "Connect" button
  because `GET /api/bookkeeping/products-and-services` returns **400 "Bookkeeping is not
  configured"** — those two disagree and may be worth a look. Ruled out as bypasses: an adjustment
  template (created fine, 201; still blocked), `templateId` on the add call, the line-level labour
  adjustment button, and `PUT /api/bookkeeping/settings` (500).
- **Receiving a part:** `POST /api/inventory/orders/accept` → **HTTP 500**, from the tester-facing
  Receive Parts screen as well as directly, with the button enabled and no validation message. Request
  ids `7b8f7c1c`, `b32c9979`, `a31d8bdc`, `ea4f1863`, `5ead1dce`, `52a43345`. Six causes tested and
  ruled out: blank part number (built one carrying `ZZ8815PN` — still 500), missing vendor (assigned,
  badge cleared — still 500), missing vendor invoice number (supplied), wrong payload (the UI's exact
  body replayed verbatim), nowhere to receive into (376 bin locations exist incl. a default), and an
  empty tax field (500 at tax 0 and tax 1). Reported for information only — it is in parts receiving,
  not in this change, and there is no baseline build to compare against.

**Test data used:** customer *Aaborough Works* (contact *Jeffrey Burns*), asset *2020 Ford Transit*
VIN `86J8FAC1VALJ43SJY`, location *Staging Heavy Duty - 9919*, labour type *ZZ8815 Unit* at $1.00/hour
(so a line's amount can be dialled to the cent), tax models created for the run: *ZZ8815 8pct*,
*ZZ8815 9.75pct*, *ZZ8815 Stacked* (4% + 3% + 1%), *ZZ8815 GSTPST* (5% + 7%). Work orders
**S-15900 … S-15979**. Full measurement logs and the raw export are in the repo under
`build/sv8815-sales-tax-rounding-2026-08-19/`.
