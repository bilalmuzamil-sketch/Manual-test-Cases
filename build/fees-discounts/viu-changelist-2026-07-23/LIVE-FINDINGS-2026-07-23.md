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
