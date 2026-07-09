# Fees & Discounts V1 — Epic Content (verbatim, recorded 2026-07-09)

> Epic **SV-7387 — Fees & Discounts**. Recorded verbatim from the v1 closeout
> hand-off for reconciliation. See `spec-v1-reconciliation.md` for how this
> changes our findings.

**Fees & Discounts v1.**

**Goal:** ad-hoc fees/discounts at invoice level / labor-parts collective / per-line,
reusable templates, per-customer defaults, QB sync.

**WHAT SHIPPED v1:**
- invoice / labor-parts-collective / per-line scopes;
- 5 calc types (flat $, % labor, % parts, % labor+parts, % subtotal);
- templates in Settings → Fees & Discounts;
- per-customer defaults auto-applied on new WOs;
- taxable/non-taxable toggle with correct tax-base shifting in ShopView AND QuickBooks;
- post-invoice lock (no edit/delete after invoiced);
- cross-tenant isolation;
- cascade cleanup (delete template/customer removes default rows);
- QB sync = each fee/discount its own line item with correct tax code;
- standardized delete confirmation (same dialog as pricing matrices).

**OUT OF v1 (follow-ups):**
- per-template QB Product/Service mapping (v1 routes every fee → generic "Fee"
  account, every discount → generic "Discount" account);
- auto-apply rules engine (vehicle/service/job-type);
- NON-US tax models (Canada GST/PST, EU VAT, AU GST — **v1 is US SALES-TAX ONLY**);
- E2E Playwright coverage;
- broader customer-default test coverage;
- persisted-totals-as-bill-of-record (pre-existing invoicing pattern — totals
  re-render live from current state).

**KNOWN GAPS:**
- no E2E;
- 2 BE tests skipped (tax_rate fixture);
- 1 FE test skipped (JSDOM/Quasar).

**Follow-up tickets:**
- F&D-Phase2-1 per-template QB mapping;
- F&D-Phase2-2 auto-apply rules engine;
- F&D-Phase2-3 non-US tax;
- F&D-Tests-1 Playwright;
- F&D-Tests-2 customer-default coverage;
- INV-1 persist invoice totals as bill-of-record.

---

## Note: Epic vs Spec discrepancies worth flagging (detail in reconciliation)
1. **Calc types count.** Epic says **5 calc types incl. "% labor+parts"**. The
   spec §5-R4 context note says **"% of Labor + Parts" was REMOVED** — it only
   still resolves for pre-existing saved adjustments and is in **no dropdown**.
   So a NEW adjustment has **4 selectable methods** (Flat $, % Labor, % Parts,
   % Subtotal). The epic's "5" counts the legacy method. Do not author new-adjustment
   cases that pick "% Labor + Parts" from a dropdown.
2. **Processing Fee.** Epic's "WHAT SHIPPED" list does not mention a Processing-Fee
   builder UI; the spec Story 8 fully specs it and PO Q3=B wants it in v1. Live
   build has BE support but no builder UI → in-scope build gap (see reconciliation).
3. **Cross-tenant isolation** shipped per the epic but we have **no dedicated test
   case** — coverage gap to propose.
