# SV-8456 Fees & Discounts UI-Correction — STAGING LIVE VIU — 2026-07-21

Ticket: SV-8456 (frontend-only UI corrections; no backend/calc change). Env:
`app.staging.shopview.com` / `api.staging.shopview.com`, org d55bc308 (Foothills
Group Inc 123), flags FeesAndDiscounts + PartSales + QuickBooks ON. Method: live UI
observed via boot2 Chromium (admin + seeded roles), evidence captured this run.

## TASK 1 — FUNCTIONALITY INTACT? **YES**
- Template CREATE→EDIT→DELETE via UI (admin): created "ZZAUTOTEST SV8456 Fee" ($25,
  Taxable Yes, Auto-Apply Yes) → edited to $30 + Taxable **No** (Yes/No dropdown
  persisted) → deleted (confirm "Delete Template / Are you sure you want to delete
  this template?"), row gone. Evidence 02–09.
- Modal saves **Taxable (Yes/No dropdown)** + **Auto-apply (checkbox)** correctly
  (row reflected $30 / No / Yes after edit).
- Apply to WORK ORDER (S3-25095): whole-WO $50 fee → preview "Fee +$50.00 / New
  work-order subtotal $3,095.31 / Tax is recalculated on save"; after save subtotal
  $3,045.31→$3,095.31, GST $152.28→$154.78 (+$2.50 = 5% GST on $50), Total
  $3,197.59→$3,250.09 (+$52.50). Calc CORRECT (backend unchanged). Evidence 11–13b.
- Apply to PART SALE (P3-1081): whole-sale $20 fee → card "Parts Sale Fees &
  Discounts" shows entry, persists. Evidence 14–16b.
- All ZZAUTOTEST data removed; WO + part sale restored to baseline.

## TASK 2 — PERMISSION PIVOT (settingsFinance → settingsService) **CONFIRMED**
Seeded 2 throwaway custom roles differing ONLY by the settings gate (else = full
Admin atom set): ServiceFull (settingsService, no settingsFinance) and FinanceFull
(settingsFinance, no settingsService). Assigned to Tech (quick-login) sequentially;
Tech restored to Technician (50bf6a0d) after; all 4 ZZAUTOTEST roles deleted (204).
- **Service user:** "Fees & Discounts" visible under **SERVICE** (below Canned
  Lines); other Service items present (Labor Rates, Canned Lines, Asset Types,
  Inspection Templates); FINANCE nav section absent (no settingsFinance). Opened the
  page, **CREATED and DELETED** a template live, convenience-fee banner/toggle
  present. Evidence 18, 18b.
- **Finance-only user:** NO "Fees & Discounts" nav item anywhere; FINANCE section
  shows only "Payment Methods" (F&D moved out of Finance); no SERVICE section
  (settingsService absent). Direct-nav /administration/adjustment-templates BOUNCES
  to /workorders (route blocked). Evidence 20, 21.
- "Other Service items unaffected": confirmed — the other Service items keep their
  existing settingsService gating (Service user sees all 5; Finance-only user, having
  no settingsService, never saw them — unchanged by SV-8456).
- **C29922** (settingsService gating) + **C29923** (Service-admin delete flow) exist
  in TestRail section 3963 "Permissions (Story 13)" (dev/Stefan-authored automated
  stubs, empty steps/expected). NOT previously in our id-map. Reconciled: added to
  testrail-id-map.csv (FD-PERM-012=C29922, FD-PERM-013=C29923) + mirrored locally as
  dev_authored bodies (excluded from import/tracker; not re-pushed). No duplicates.

## TASK 3 — UI CORRECTIONS (each observed live; ALL MATCH the ticket)
1. NAV: F&D under SERVICE, below Canned Lines; FINANCE now only Payment Methods. ✔ (01)
2. PERMISSION PIVOT: gated by settingsService. ✔ (Task 2)
3. MODAL "New Fee / Discount": Taxable = **Yes/No dropdown**; Auto-apply = **checkbox**
   "Auto-apply to all new work orders at this location" + caption "When on, this fee /
   discount is added automatically to every new work order created at this location…";
   field order Type→Calculation Type→Name→$ Default Amount→Taxable→jurisdiction note→
   Auto-apply→Description→Cancel/Create; jurisdiction note present. ✔ (02,03)
4. SETTINGS TABLE: Type + Auto-Apply plain text (no badges); all cells `text-left`
   (left-aligned, evenly distributed). ✔ (02)
5. WO sidebar card titled **"Work Order Fees & Discounts"**, renders ABOVE Financial
   Info (y 996 < 1182). ✔ (13,13b)
6. PART SALE card **"Parts Sale Fees & Discounts"** renders ABOVE Financial Info
   (y 581 < 815); caption "Applies to the whole parts sale, after all part-line fees &
   discounts." ✔ (16,16b)
7. CUSTOMER Fees & Discounts tab: plain-text left-aligned table (matches Settings);
   "Add Fee/Discount" (link-existing) + per-row Remove; NO convenience-fee toggle. ✔ (17)
8. PRESERVED: jurisdiction note in admin + WO + Part-sale dialogs; "Pass convenience
   fee to customer" banner/toggle on Settings page. ✔ (02,03,11,15)

**No deviations found — build matches SV-8456 exactly. Frontend-only; functionality
and calculations INTACT.**

## Evidence index (PNG in this folder)
01 settings nav (Service section) · 02 template table (plain/left) · 03 New dialog
(dropdown+checkbox) · 04–09 create/edit/delete CRUD · 11 WO fee dialog · 12 WO fee
filled · 13/13b WO card above Financial Info · 14–16b part-sale card · 17 customer tab
· 18/18b Service-user F&D (nav + create) · 20 Finance-user nav (no F&D) · 21
Finance-user route blocked. TestRail before/after snapshots in tr-snapshots/.
