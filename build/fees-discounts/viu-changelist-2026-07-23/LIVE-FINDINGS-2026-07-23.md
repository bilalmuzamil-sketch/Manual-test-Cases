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
