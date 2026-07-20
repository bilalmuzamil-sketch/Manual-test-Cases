# LIVE role-matrix verification — 2026-07-20 (staging)

> VIU per Standing Rules 12/13/14: the 11 system roles' permission sets OBSERVED live from the
> build via `GET /api/roles/{id}` (authenticated as Admin), cross-checked against the role
> editor / Permission Summary UI. Full matrix: `live-roles-matrix-2026-07-20.csv`. Raw per-role
> JSON captured. Build-vs-spec diff: `live-vs-spec-role-diffs-2026-07-20.json`.

## Confirmed corrections (upgrade to LIVE-VERIFIED)
- **C26496 Service Manager — HAS Work Orders Delete.** Live SM = WO **V/E/D**, Invoicing V/E
  (no Delete), Customers full. Confirms the correction (SV-8297 reverses SV-8093). ✅
- **C26504 Sales Representative — NOT Reports-only.** Live = WO View, WOL View (inherited),
  Customers View+Create&Edit, Part Sales View, Reports ON, SFD ON, AP/AR ON, Full View. Confirms
  the correction (SV-8061). ✅
- **C26505 Time Clock User.** Live = WO View, Schedule View, Timesheets View only; view_mode
  none; all cross-toggles off; non-editable. Matches the case. ✅

## Correction REVISED by the live build
- **C26503 Office User — my spec-derived correction was WRONG; the build keeps WO/Part Sales.**
  Office is **non-editable** (editable=false) so this IS the true shipped default, not drift.
  Live Office = WO **View**, WOL View, Part Sales **View**, Catalog View, Vendor View, Customers
  V/E/D, **Invoicing V/E/D**, Timesheets V/E, Schedule View, Reports ON, Billing Portal ON,
  SFD ON, AP/AR ON, viewHistoryLogs ON, Full View, non-editable.
  → The 7/14 spec's removal of Office Work Orders + Part Sales is **NOT deployed**. The ONLY real
  change from the original case is **Invoicing: View → View/Create & Edit/Delete** (Office gained
  invoicing C&E + Delete; the hard-coded "Office cannot create invoices" button rule is still
  an open PO item, SV-7993). C26503 corrected to match the build; WO/PS-removal flagged as a
  build-vs-spec gap (spec ahead of build).

## Build-vs-spec gaps on EDITABLE roles — FLAG, do not assert (possible shared-org drift)
The staging org is SHARED and system roles are editable; CLAUDE.md warns the Technician role is
drifted. These live readings differ from spec but may be tester drift, so they are flagged for
re-derivation on clean defaults, not asserted as build defects:
- **Technician** (editable): build shows WO **V/E** (spec V), Customers **V/E** (spec V), **SFD ON**
  (spec off). WO C&E + SFD-ON on Technician is a classic drift signature → re-seed/re-derive.
- **Service Advisor** (editable): build Invoicing **V/E** (spec V/E/D — missing Delete).
- **Senior Service Advisor** (editable): build **Reports OFF** (spec Reports ON).
These affect the per-role cases C26497 (SrSA), C26498 (Svc Advisor), C26500 (Technician) — each
annotated with a live_check note to confirm against clean defaults before any push.

## Non-issues (extraction nuance)
- "Time Clock WO Lines = View" in the raw diff is the WOL-View-inherited-from-WO-View rule, not a
  separate grant; spec lists it as "—" only because WOL View isn't independently configurable.

## Net effect on the deliverable
- C26496 / C26504 / C26505: corrections LIVE-CONFIRMED (confidence high).
- C26503 Office: rewritten to the observed build set (Invoicing V/E/D is the real delta; WO/PS
  kept per build); 7/14 spec-vs-build gap flagged.
- C26497 / C26498 / C26500: live_check notes added (possible drift — confirm on clean defaults).
