# SV-9566 — Processing Fee templates on Part Sale invoices — QA (in progress)

**Ticket:** https://shopview.atlassian.net/browse/SV-9566 (Bug, status TESTING QA, priority Medium, assignee Slavcho Mitrov)
**QA branch:** https://sv9566.qa.shopview.com
**Build marker (live, read start + mid-run, unchanged):** `v26.35.8-5248ce9`, index.html last-modified Thu 03 Sep 2026 11:54:55 GMT, etag `3f4749cf435ec40039973ff1d2275cb8`. **No redeploy during the run.**

## The reported bug (from the ticket description + customer's words)
Processing Fee templates created under **Administration → Service → Fees & Discounts** did **not** appear as selectable options when adding fees on a **Part Sale invoice**, even though they work on Work Orders. Dale's Diesel had exactly one template (a Processing Fee), so their "Apply From Template" dropdown looked empty — *"as though the Processing fee I saved does not exist."*

## Dev handoff (Slavcho, PR #2900 — read per Rule 66)
Deliberate restriction from SV-8723: PF templates were `whole_wo` scope only, so the part-sale picker filtered them out. Fix:
- **BE** — new `AdjustmentScope::isWholeLevel()` = `whole_wo` ∪ `whole_parts_sale` gates the processing-fee invariant, so the kind is accepted at either whole-level scope. **Line scopes still reject it.**
- **FE** — the picker offers PF templates at part-sale scope; the grand-total note is worded per document type ("parts-sale grand total").
- PF grand total on a part sale = **parts + tax** (no labour). Chris confirmed.
- Chris also ruled (comment): **two PFs stacking on one sale is acceptable** (no one-PF invariant); recorded decision, no code change.
- Dev verification: automated E2E **C45255** ("Owner applies a Processing Fee template to a parts sale from the toolbar dialog").

## Setup (seeded on the branch, disposable — no cleanup)
Created three templates via the real Admin → Fees & Discounts UI (customer's step 2 / *"I can see the fee under settings"*):
- **ZZAUTOTEST Card Surcharge** — Processing Fee — % of Grand Total — 3% — Taxable No
- ZZAUTOTEST Shop Supplies — Fee — Flat Amount — $5.00 — Taxable Yes
- ZZAUTOTEST Loyalty Discount — Discount — Flat Amount — $10.00 — Taxable No

Test part sale: **P9566-240** (Estimate, Northport Truck Repair) — Parts $881.15, GST $44.06, **Total $925.21**. A 3% PF on grand total = **$27.76**.

## Per-check status
| # | Check | Status | Evidence |
|---|-------|--------|----------|
| 1 | **PF template appears** in Part Sale "Apply From Template" dropdown (the reported bug) | **PASS (UI, live)** | `evidence/02-...dropdown.png` — all 3 templates incl. the Processing Fee |
| 3 | Regular Fee + Discount templates still appear on part sales (regression) | **PASS (UI, live)** | same dropdown |
| 5 | Grand-total note worded per document type on a part sale | **PASS (UI, live)** | `evidence/03-...autofill.png` — *"This fee is calculated on the parts-sale grand total and updates as the parts sale changes."* + Type auto-fills **Processing Fee**, Calc **% Of Grand Total**, Percent 3 |
| 2a | BE accepts `processing_fee` at `whole_parts_sale` scope (the `isWholeLevel()` fix) | **PASS (API, live)** | `POST /api/work-orders/adjustments/add` with scope `whole_parts_sale` returned only "A processing fee can only be added from a template" (templateId required) — i.e. the scope+kind were accepted; NOT a scope rejection |
| 2b | Apply PF from template → computed = $27.76 (3% of $925.21) | **PENDING** — needs fresh cookies | UI "Add Fee" is disabled by a **pre-existing QuickBooks fee-item mapping guard** (org setup the customer has; this fresh QA org's IBS/QB is not connected → `ibs_no_credentials`). Will apply via authed API and show the applied fee in the UI. |
| 4 | Line scope still **excludes** PF | **PENDING** — needs fresh cookies | BE `scope:'line'` PF add should be rejected |
| 6 | Work Orders still offer the PF template (parity) | **PENDING** — needs fresh cookies | |
| 7 | Two PFs may stack on one part sale (Chris's recorded decision — allowed, not blocked) | **PENDING (low)** | product decision, verify BE doesn't block a 2nd PF |

## Blocker (Rule 68/22 hard stop)
Session cookies (`sv_sso_session` / `PHPSESSID` / `cf_clearance` for `.qa.shopview.com`) **expired mid-run** (ordinary ~24h estate expiry; the build did NOT move). Need a **fresh set** to finish checks 2b/4/6/7 and then draft the QA comment for approval.

## Honest split (Rule: say which parts were UI vs API)
- **Thing under test (template appears + auto-fills correctly)** = UI-observed, live. This IS the reported bug and it is fixed.
- **Setup** (template creation) = real Admin UI. Part-sale add of the fee = will be API (the UI Add-Fee button is QB-gated on this fresh org, unrelated to SV-9566).

## Notes to fold into the eventual Jira comment
- The UI "Add Fee" QuickBooks mapping guard is **not** part of this fix and gates all part-sale fees; the reporting customer already satisfied it. State this plainly so nobody reads it as a regression.
- Screenshots to annotate before/after for the final comment: dropdown (PF present) + PF-selected auto-fill (grand-total note); WO parity; applied-fee result.
