# Live-build check — findings (2026-07-23, admin, app.staging.shopview.com, WO S9-25393)

Access: cookies in /tmp only; api.staging auth 200; boot2 UI harness.

## Genuinely observed LIVE this run (evidence captured)
- **FD-INLINE-003 (C28456) — RESOLVED.** A labor line with 2 adjustments shows an inline
  "Fee 10% +$46.49" row plus a **"Show 1 more"** toggle (DOM x=443,y=344); clicking it expands
  and the toggle becomes **"Show less"**. The collapse/expand control the spec asks for now EXISTS
  (the 2026-07-08 "no Show more/less toggle" deviation is resolved).
  Evidence: fd-lines-collapsed.png, fd-lines-expanded.png.
- **FD-WO-017 (C30618) — DEVIATION STILL PRESENT.** On the labor line, "Unassigned" is at x=428 and
  the "Add labor fee or discount" three-dot menu is at x=502 → the menu renders to the RIGHT of
  "Unassigned"; per SV-8479 item-1 it must be on the LEFT. Evidence: fd-labor-feemenu.png + DOM coords.
- Context: WO S9-25393 Finance summary shows "Fees & Discounts (6)"; line-level adjustments render
  inline with a ↳ indent (whole-WO fee, line Fee 10%, line Discount −4%).

## NOT re-verified this run (live observation still pending)
FD: STATS-002, STATS-004 (Statistics tab did not open via headless tab-click),
    TMPL-010 (labor fee dialog template picker), CUST-005, CUST-006 (customer F&D tab),
    PROC-008 (processing-fee ⋮ Edit|Remove + 409), PROC-009, CALC-013 (processing-fee calc base —
    needs a seeded processing fee), WO-013, PERM-002 (permission enforcement — needs role-negative).
SF: RCV-05, RCV-07 (Accept Delivery group order), REV-11 (review sign-off), UX-04 (Close/Cancel modal).
Reason: in-page tab clicks + dialog seeding + role-switch drives need more per-screen automation;
not completed this run. Not filled from memory (Rule 12).

## Update — batch 2 (same session, more cases observed live)
- **FD-STATS-002 (C28460) — CHANGED.** Statistics tab (/statistics) now shows 'Fees & Discounts (6)'
  with PER-ADJUSTMENT rows (% + Amount columns) + a Total — old 'aggregate only, no per-row' no longer
  holds. Scope-hyperlink-per-row still to confirm. Evidence: stats-b2.png.
- **SV-8521 (new) — appears FIXED on WO invoice.** WO S9-25393 Finance/Estimate view renders part-line
  adjustments as child rows under the part ('↳ Name $11.00', '↳ Fee (% of parts) ($2.39)') like the
  labour-line ones ('↳ Fee (% of labor)', '↳ Discount'). Matches SV-8521 'Ready for QA'. Parts-Sale
  invoice still to confirm. Evidence: finance-b2.png.
- **FD-CUST-005 (C28489) — partial.** Customer 'Default Fees & Discounts' tab table shows full columns
  (Name/Type/Calculation Type/Amount/Max Amount/Taxable); Processing Fee typed as 'Fee, % of Grand Total'.
  Add-picker dropdown display + CUST-006 empty state ('No results') still to confirm. Evidence: cust-fd-tab.png.

## Still pending live observation (unattended run hit click/seed friction)
STATS-004 (creation-order needs timestamps), CUST-005 dropdown + CUST-006 empty state, TMPL-010 (labor
fee dialog), PROC-008/009 + CALC-013 (need a processing fee seeded on a WO), WO-013/PERM-002 (role-negative),
SV-8520 (part fee after receive/pick), SF RCV-05/07/REV-11/UX-04 (separate screens/seeding).

## Update — batch 3 (self-seeded; API WO creation unblocked)
- **Customer-default processing-fee AUTO-APPLY — CONFIRMED.** Created a WO via API
  (POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}
  → 201) for a customer carrying default fees. The WO auto-applied: Discount (flat $2), Flat Fee
  ($11, whole-WO, appliedBy=customer_default), WO Processing fee (5% pct_grand_total, customer_default),
  Processing Fee (6% pct_grand_total, customer_default). Verified via GET /api/work-orders/view/{id}.
- **PROC-009 / CALC-013 (processing-fee base) — CHARACTERISED-BLOCKED.** To check whether the
  processing-fee base wrongly includes the whole-WO Flat Fee, the fees must resolve above $0, which
  needs a priced labour/part line. Adding a line returns **HTTP 500** (WO line-create env defect,
  requestId e1069cd9-3974-4785-a364-696d04f68443) — matches the known "WO line-create 500" env bug;
  parts hang off a line (POST /api/work-orders/part/make-request requires a line id); the UI line-add
  uses an async ShopCoach builder that didn't complete. Blocked on the env 500 — retest when fixed.
- Cleanup: the ZZAUTOTEST WO was deleted (POST /api/work-orders/delete → 201; re-GET 400 = gone).
  No test data left; Tech role untouched (no role-negative run performed this session).

## Live-verified tally this session: 5 confirmed + 2 characterised-blocked (of 14 FD rows)
Confirmed: FD-INLINE-003 (resolved), FD-WO-017 (deviation stands), FD-STATS-002 (per-row now shown),
SV-8521 (fixed on WO Finance), FD-CUST-005 (table columns + Processing Fee typed 'Fee').
Blocked-env: FD-PROC-009, FD-CALC-013 (WO line-create 500).
Still pending: FD-WO-013, FD-STATS-004, FD-CUST-005 dropdown/FD-CUST-006 empty state, FD-TMPL-010,
FD-PROC-008, FD-PERM-002, SV-8520; SF RCV-05/07, REV-11, UX-04.
