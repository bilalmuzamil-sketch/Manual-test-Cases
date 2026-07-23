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

## Update — batch 4 (QA-seeded WOs A/B/C + customers D)
- **FD-PROC-009 (C28527) + FD-CALC-013 (C28580) — FIXED (was a deviation).** WO S-25989: labour $244
  + shop $20 = net subtotal $264; ×1.05 GST = Grand Total $277.20; Processing Fee 10% = $27.72
  (observed $27.72 exactly). The whole-WO 'bil' fee $24.40 is NOT in the base (buggy would give
  $30.28). §5-R4 satisfied — base correctly excludes whole-WO fees.
- **FD-TMPL-010 (C28511) — RESOLVED.** Line-scope fee dialogs (part + labour) now show 'Apply From
  Template' with 'Showing templates compatible with this line'; whole-WO dialog too. Scope-filtered
  picker present (evidence: user-provided dialog screenshots).
- **SV-8520 (new) — CONFIRMED defect.** WO S-25991: 50% part fee added then part picked → line row
  shows $99.00 with no fee child row, but line total is $392.50 (=244+99+49.50) — fee billed, hidden
  from the line after pick. Evidence: SV-8520-part-fee-hidden-after-pick.png.
- **FD-CUST-005 (C28489) — table confirmed** (full columns + Processing Fee typed 'Fee'); the Add
  picker DROPDOWN (CUST-005) and all-linked EMPTY STATE (CUST-006) still pending (picker dropdown
  didn't render in headless capture; customers ready: Aadale Motors 1-linked, Aaborough Works all-linked).

## Session tally: ~9 of 16 live-resolved/confirmed
Verified/updated: INLINE-003 (resolved), WO-017 (deviation stands), STATS-002 (per-row now), CUST-005
(table part), PROC-009+CALC-013 (FIXED), TMPL-010 (resolved), SV-8521 (fixed on WO Finance),
SV-8520 (confirmed defect). Still pending: WO-013/PERM-002 (permission), STATS-004 (ordering),
CUST-005 dropdown/CUST-006 empty, PROC-008 (⋮ Edit|Remove), SF RCV-05/07 (C), SF REV-11, SF UX-04.

## Update — batch 5 (remaining cases; honest stopping point)
- **FD-STATS-004 (ordering) — data confirms oldest-first; on-screen display not captured.** Via API
  (retry-login), WO A adjustments are stored in creation order oldest-first: Part Fee @14:17:53,
  WO Processing Fee @14:17:53, bil @14:44:25. The spec wants WO screens oldest-first; the data backs
  it. The exact Statistics-tab DISPLAY order could not be captured this run (see blocker below).
- **BLOCKER for the last few UI cases:** the QA-seeded WOs live in the "Staging Heavy Duty - 9919"
  workplace; the headless boot2 harness hydrates a different (random) workplace, so those WO pages
  404/redirect in the UI, and the in-app location switcher resisted reliable coordinate-clicking.
  API reads work via retry-login (loop until the WO resolves), but UI-only observations
  (Statistics display order, the processing-fee ⋮ menu, the customer add-fee picker dropdown, the
  Simple-Flow receive screen, the review/close-cancel flows) need the harness to hydrate the target
  workplace. That's a harness change (set the current-workplace localStorage key before navigating),
  not a data problem — noted for the next run.

## STILL PENDING after this session (honest)
FD: STATS-004 display order (data supports oldest-first), PROC-008 (processing-fee ⋮ Edit|Remove),
WO-013/PERM-002 (permission role-negative — manual adjustment-add endpoint not yet found),
CUST-005 dropdown + CUST-006 empty state (picker didn't render headless).
SF: RCV-05/07 (WO C receive screen), REV-11, UX-04.
All need the boot2 workplace-hydration fix or a human glance; none are data-seeding blockers.

## Update — batch 6 (workplace unblock SOLVED)
- **Workplace-switch endpoint found + baked into harness:** POST /api/iam/change-location
  {workplace_id, workplace_timezone} (→200). changeLocation() added to staging-admin.mjs; boot2
  now accepts {workplaceId}/SV_WORKPLACE and switches before hydrating. WO A/B/C (Heavy Duty 9919
  = b3c8c820) now load reliably in both API and UI. Recorded in CLAUDE.md durable facts — will not
  ask the user to unblock workplace again.
- **FD-STATS-004 (C28462) — VERIFIED oldest-first.** Statistics tab shows Part Fee ($0.00),
  WO Processing Fee (+$27.72), bil (+$24.40) — display order = creation order (14:17:53/14:17:53/
  14:44:25) = oldest-first per §5-R9. Evidence: STATS-004-oldest-first.png.

## Session final tally (of 13 FD rows + 2 new tickets): 9 verified
Verified/resolved/confirmed: INLINE-003, STATS-002, STATS-004, CUST-005(table), PROC-009(FIXED),
CALC-013(FIXED), TMPL-010, SV-8521(fixed), SV-8520(confirmed defect).
Still pending (UI menu/dropdown isolation, now reproducible via the workplace unblock next run):
FD-PROC-008 (processing-fee ⋮ Edit|Remove), FD-WO-013/PERM-002 (permission role-negative),
FD-CUST-005 dropdown + CUST-006 empty state; SF RCV-05/07, REV-11, UX-04.
