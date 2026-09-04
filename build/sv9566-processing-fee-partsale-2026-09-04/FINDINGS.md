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

## FINAL (all live checks complete, fresh cookies) — build v26.35.8-5248ce9 (unchanged throughout)
| # | Check | Verdict |
|---|-------|---------|
| 1 | PF template appears on Part Sale "Apply From Template" dropdown (reported bug) | **PASS** (UI) |
| 2 | PF accepted at whole-part-sale scope; Type=Processing Fee, %-Of-Grand-Total, parts-sale grand-total note | **PASS** (UI + API: BE accepts scope `whole_parts_sale`) |
| 3 | Regular Fee + Discount templates still shown on part sales | **PASS** (UI) |
| 4 | Line scope still rejects PF | **PASS** (API: `400 Invalid adjustment scope`) |
| 5 | Grand-total note worded per document type | **PASS** (UI) |
| 6 | Work Orders still offer the PF template (parity) | **PASS** (UI) |
| — | Numeric apply + $27.76 compute | **NOT OBSERVABLE HERE** — `409 Connect a QuickBooks item for fees` (BE+FE gate for ALL part-sale fees; external QB dependency this fresh QA org lacks; customer has it; covered by dev E2E C45255). NOT a defect in the fix. |
| 7 | Two PFs stacking allowed (Chris's recorded decision) | Recorded product decision; not code-testable here (QB gate). |

**OVERALL: PASS.** Reported bug fixed; every testable boundary behaviour correct. Per Rule 62 (per-ticket branch, PASS ⇒ final) findings are not provisional. QB apply-gate flagged honestly.
Annotated exhibits: evidence/05,06,07.

## PRODUCTION reproduction (2026-09-04) — the bug IS reproducible on prod
**Prod:** app.shopview.com / api.shopview.com, build **v26.35.9-20b5728** (higher than the QA branch — the fix PR #2900 targets the bugfix line and is NOT yet on prod). **Prod TEST org 72b2cc90 "Bilal-Trucks" / workplace "Trucks Hill 2"** (confirmed; never a real customer org). Login `POST /api/login`; **observation only — created/changed NOTHING on prod.**
- Org has exactly one adjustment template: **`ZZAUTOTEST PF 100pct`** (kind processing_fee), confirmed via `GET /api/adjustment-templates`.
- **Part Sale P2-64 → toolbar → Add Parts Sale Fee → "Apply From Template" → "No results"** (the PF is filtered out). → `evidence/08-PROD-partsale-dropdown-no-results.png`. This is Kelly's exact experience ("as though the Processing fee I saved does not exist").
- **Work Order S2-861 → Add Work Order Fee → "Apply From Template" → `ZZAUTOTEST PF 100pct` present.** → `evidence/09-PROD-workorder-dropdown-pf-present.png`. Matches "It works on Work Orders just fine, but not Parts sales."
- **CONCLUSION: bug confirmed reproducible on production.** This gives a real before/after: PROD (broken, No results) vs QA branch sv9566 with PR #2900 (fixed, PF appears on part sales too).
- Note: on prod the part-sale fee dialog showed **no** QuickBooks "map a fee item" banner (unlike the sv9566 QA branch). Not relevant to the template-appearance reproduction, but noted.

## POSTED
QA comment posted to SV-9566 — comment id **76010** (2026-09-04). Verdict PASSED; production reproduction + fix-branch before/after with 5 annotated exhibits; QB apply/sync residual flagged. Link: https://shopview.atlassian.net/browse/SV-9566?focusedCommentId=76010

## PRODUCTION corroboration (2026-09-04, user-authorized prod writes; cleanup waived by user)
Goal: de-risk "will the customer's issue be resolved" by proving, on the QuickBooks-configured prod test org, that the machinery the fix feeds into works. (The exact PF-on-part-sale + QB line-item sync needs fix+QB in one env, which no environment has; covered by dev C45255.)
- **P1 — Processing Fee applies + computes on a Work Order (prod, QB configured):** WO S2-861 Total $110.17 → added the existing PF template (100% of grand total) via the UI. **Add Fee was ENABLED with NO QuickBooks block** (contrast: the QA-branch org, lacking QB, blocked it with "Connect a QuickBooks item"). Total became **$220.34** (= +100% of grand total). Then REMOVED the fee → Total restored to $110.17 (verified; done before the user waived cleanup). Exhibit: `evidence/12-PROD-corroboration-pf-applies-no-qb-block.png`.
- **P2 — a fee applies to a Part Sale and the total updates (prod, QB configured):** Part Sale P2-64 Total $720.00 → added a manual $50 fee via the UI, **no QB block** → Total **$770.00**.
- **Conclusion:** on a QuickBooks-connected org (like the customer's), (a) a Processing Fee applies and computes as % of grand total [P1], and (b) the part-sale add-fee path applies and updates the total [P2]. Combined with the QA-branch proof that the fix now OFFERS the PF on part sales and the BE accepts it at whole_parts_sale scope, this strongly supports that the customer will be able to apply the Processing Fee on Part Sales once the fix ships. Still not directly observed anywhere: the PF specifically on a part sale end-to-end + the actual QuickBooks line-item sync (needs fix+QB together / QB UI access) — covered by dev E2E C45255.

## POSTED (updated)
QA comment 76010 UPDATED IN PLACE (2026-09-04 05:57) with the production-corroboration section (exhibit 12) + revised technical details + 8-row table. Verdict PASSED; honest residual (row 8 / "still not directly observed": PF-on-part-sale end-to-end + QuickBooks line-item sync, covered by dev C45255). Link: https://shopview.atlassian.net/browse/SV-9566?focusedCommentId=76010
Prod cleanup done anyway (user waived it): removed the ZZAUTOTEST fees from S2-861 (restored $110.17) and P2-64 (restored $720.00). The pre-existing "ZZAUTOTEST PF 100pct" template predates this session (not created by me) — left as-is.
