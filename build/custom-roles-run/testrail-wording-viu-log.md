# Custom Roles — Build-Accurate Wording + VIU — TestRail push audit log — 2026-07-13

> Per-case audit of the build-accurate wording + VIU pass
> (`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`). TestRail writes authorized for
> this pass (`update_case` on the core Custom Roles cases, sections 3528–3553).
> Method per case: get_case → diff 4 fields (title/preconds/steps/expected) →
> update only changed → re-verify 200/200 → skip no-ops. Snapshots baseline (rollback)
> committed at `testrail-snapshots-2026-07-13/`. Glossary:
> `wording-glossary-2026-07-13.md`. Rewritten bodies: `cases-2026-07-13/`.

## Build-wording headline deltas applied (Rule 9 — build wins)
- AP/AR toggle wording corrected to the BUILD label **"View and Manage AP/AR Data"**
  (NOT the spec's "Manage Accounts Payable and Receivable").
- History toggle wording is the BUILD label **"View History Logs"** (gates the
  **Part History** page).
- Resource cards use build sentence-case: **Work orders, Work order lines, Part sales,
  Catalog and Inventory, Vendor and order management, Invoicing & payments**.
- View mode options **Full View / Tech view**; Invoicing delete column **Delete / Reverse**;
  WO toggles **Order parts / Pick parts / Review work orders**.
- Confirm dialogs use build labels: **Enable See Financial Data?** (Cancel/Enable),
  **Disable See Financial Data?** (Cancel/Disable), **Reset to template** (Cancel/Reset).
- Stripped from tester-facing text: spec IDs (SV-####, §refs, doc ids), "per spec",
  "verified in UI", "file a bug against …", enum/HTTP jargon.

---

## Section 3544 — See Financial Data (10 cases) — pushed 2026-07-13
**Result: 10 UPDATED · 0 no-op · 0 failed · all re-verified 200/200.**

| Case | Change | VIU status |
|---|---|---|
| C26467 | Reworded to build labels (Cross-Cutting Toggles / See Financial Data); flagged reused subtitle placeholder | Verified-Label (build) |
| C26468 | Reworded; app-wide "money shown" sweep | Blocked-UI (seeded role + manual sweep) |
| C26469 | Reworded; app-wide "money hidden" sweep | Blocked-UI (SFD-off role + manual sweep) |
| C26470 | Reworded; SFD gate beats CRUD | Blocked-UI (seeded role + UI check) |
| C26471 | Reworded; tick Part sales → Enable dialog | Blocked-UI behavior; modal title+buttons build-verified |
| C26472 | Reworded; Enable button (was "Confirm") | Blocked-UI behavior; Enable button build-verified |
| C26473 | Reworded; Cancel reverts | Blocked-UI behavior; Cancel button build-verified |
| C26474 | Reworded; same dialog for Invoicing & payments | Blocked-UI behavior; modal build-verified |
| C26475 | Reworded to build "Disable See Financial Data?" dialog | **Disable modal now present in build (was RUN331 FAIL) — recommend live re-test** |
| C27869 | Reworded; Order parts enable prompt | Blocked-UI behavior; modal family build-verified |

**Notable finding:** the **FinancialDataDisableConfirmModal** ("Disable See Financial
Data?", Cancel/Disable) is now wired into the shipped PermissionEditor — the
SFD-disable dependent-prompt (C26475), a FAILED deviation in RUN331 as "not
implemented", appears to have since been BUILT. Recommend a live re-test to confirm
the dependent-clear behavior and the exact dependent list.

---

## Section 3545 — View and Manage AP/AR Data (11 cases) — pushed 2026-07-13
**Result: 11 UPDATED · 0 no-op · 0 failed · all re-verified 200/200.**
Key change: every case's tester-facing text now uses the BUILD toggle label
**"View and Manage AP/AR Data"** (was the spec name "Manage Accounts Payable and
Receivable"); "Invoicing and Payments" → "Invoicing & payments"; "Customer
Management" concept mapped to the Customers card; jargon stripped.
All behavior VIU = Blocked-UI (needs a seeded role + customer/vendor/reports UI check;
some need live payments — create-customer-payment 500s intermittently).
**C26482 NOTE:** RUN331 recorded this as a FAILED deviation (aging reports still
hid when AP/AR was OFF, i.e. spec "aging follows Reports" was not live) — flagged for
a fresh live re-test.

---

## Section 3541 — Page Access Toggles (6 cases) — pushed 2026-07-13
**Result: 6 UPDATED · 0 no-op · 0 failed · 200/200.**
Build labels confirmed: Page Access section toggles **Reports**, **Customer portal**,
**Billing Portal** (PageAndSettingsToggles). Nav show/hide behavior = Blocked-UI
(needs seeded roles).

## Section 3532 — Permission Summary (5 cases) — pushed 2026-07-13
**Result: 5 UPDATED · 0 no-op · 0 failed · 200/200.**
Read-only Permission Summary group structure build-verified (add/edit/delete areas,
Page Access, Settings sub-toggles, Work orders sub-settings, Cross-Cutting Toggles).
Eye-icon open behavior = Blocked-UI (needs live Roles list / Staff page).

## Section 3543 — View Mode (15 cases) — pushed 2026-07-13
**Result: 15 UPDATED · 0 no-op · 0 failed · 200/200.**
Build labels confirmed: **View mode** with **Full View** / **Tech view**; the Tech
view description string is build-verified verbatim (WoSettingsRow). All Tech-view
behavior restrictions (estimate=tech-time, hidden labor rate, no approve, read-only
approved line, Send to Portal hidden) = Blocked-UI (need seeded Tech-view roles + live WO).

## Section 3542 — Settings Access (14 cases) — pushed 2026-07-13
**Result: 14 UPDATED (11 text-template + 3 Steps-Separated) · 0 no-op · 0 failed · 200/200.**
**KEY CORRECTION:** the build now shows **7** Settings sub-toggles including
**Integrations** (App Settings, Service, Parts, Finance, Integrations, Data Import,
View/Manage Wages) — C26441's prior "Integrations missing" build-vs-spec flag is now
RESOLVED/BUILT. Sub-page names corrected to build route labels (App Settings →
Departments/Settings/Staff/Roles & Permissions/Locations; Service → Canned
Lines/Inspection Templates/Labour Types/Vehicle Types; Parts → Bins/Categories/Pricing;
Finance → Payment Methods/Taxes; Integrations → IBS/Open API/QuickBooks; Data Import →
Contacts/Inventory/Invoices/Vehicles/Vendors Import).
C27395/C29273/C29274 are **template_id=2 (Steps-Separated)** — updated via
`custom_steps_separated`; jargon (element ids/URLs) stripped. Behavior = Blocked-UI.

---

## Section 3533 — CRUD Cascade Rules (14 cases) — pushed 2026-07-13
**Result: 14 UPDATED · 0 no-op · 0 failed · 200/200.**
Card names corrected to build sentence-case (Work orders, Schedule, **Customers**
[was "Customer Management"], Part sales, Catalog and Inventory, Vendor and order
management, **Invoicing & payments** with **Delete / Reverse** column). Structure
build-verified: Work order lines has no View column; Timesheets has no Delete.
Auto-tick/untick cascade behavior = Blocked-UI (needs live role editor).

## Section 3530 — Edit Role (8 cases) — pushed 2026-07-13
**Result: 8 UPDATED · 0 no-op · 0 failed · 200/200.**
Build strings verified: **'Role updated successfully.'** toast, **'Reset to template'**,
**'Role name*'** + **'… is a required field'**. Confirm-dialog / save-enable / pre-fill
behavior = Blocked-UI (needs live editor).

## Section 3531 — Delete Role (5 cases) — pushed 2026-07-13
**Result: 5 UPDATED · 0 no-op · 0 failed · 200/200.**
**C26351 build finding CONFIRMED:** there is no "Cannot Delete" modal — the block is
(1) the three-dot menu hiding Delete when users>0 and (2) a disabled **Delete role**
button with the verbatim tooltip **"This role is assigned to N user(s). Reassign them
to another role before deleting."** (both strings confirmed in the shipped build).
Delete flows = Blocked-UI (need live Roles list + seeded role/user).

---

## Section 3540 — Timesheets Permissions (7 cases) — pushed 2026-07-13
**Result: 7 UPDATED (6 tmpl1 + 1 Steps-Separated C27394) · 0 no-op · 0 failed · 200/200.**
C26429 corrected: Timesheets card short description is build **"Track and review
technician labor hours and time entries."** (was "View and manage timesheets from work
orders."); no Delete column (build-verified); removed the "file a UI bug/CRP-FE-03"
conditional. Behavior cases = Blocked-UI (need seeded roles).

## Section 3551 — QuickBooks Relocation (3 cases) — pushed 2026-07-13
**Result: 3 UPDATED · 0 no-op · 0 failed · 200/200.**
**MAJOR BUILD FINDING:** the live build keeps **QuickBooks under Integrations**
(Integrations sub-toggle gates IBS/Open API/QuickBooks); Finance gates only Payment
Methods/Taxes. So the old "QuickBooks moved to Finance / Integrations removed" premise
is STALE — **C26529** (QB under Finance), **C26530** (gated by Finance) and **C26531**
(Integrations removed) were rewritten to build reality (QB under Integrations, gated by
the Integrations sub-toggle; Integrations section present). Flagged as
Deviation-vs-old-case. This matches the 09-Jul spec fact "Integrations hosts
QuickBooks/IBS/Open API" and the 3658 stub C27738.

## Section 3549 — Migration (12 cases) — pushed 2026-07-13
**Result: 12 UPDATED · 0 no-op · 0 failed · 200/200.**
Role names corrected to the live roles list (**Office User**, **Parts Technician**,
Time Clock User, etc.). **C26510 corrected:** Administrator is **EDITABLE** (live API
editable=true) — only **Office User** and **Time Clock User** are non-editable (was
"Administrator non-editable"). Per-role permission sets are live-verified (roles matrix);
the migration-of-legacy-users step = Blocked-UI (needs seeded legacy accounts). Stripped
legacy-mapping-page ids and SV-refs.

---

## Section 3546 — View History Logs (2 cases) — pushed 2026-07-13
**Result: 2 UPDATED · 200/200.** Toggle label 'View History Logs' build-verified; it
also gates the 'Part History' page under Parts (route metadata). Behavior = Blocked-UI.

## Section 3552 — User Feedback Strings (8 cases) — pushed 2026-07-13
**Result: 8 UPDATED · 200/200.** Build-verified strings: 'Role created successfully.',
'Role updated successfully.', 'Role deleted successfully.', 'Enable See Financial Data?'
(Cancel/Enable), disabled-Delete tooltip, 'Role name*' + required-field message.
**C26538 corrected:** the build's warning is a **similar-role / identical-permissions**
soft warning ('Similar role already exists', 'with identical permissions already
exists.', **Create anyway**) — not a hard duplicate-NAME block; reworded accordingly.
C26539 billing note = Blocked-UI (EditStaffMember chunk not fetched).

## Section 3547 — Staff Page Role Assignment (5 cases) — pushed 2026-07-13
**Result: 5 UPDATED · 200/200.** C26490 corrected to **11 system roles** (was "12").
'View Permissions' label build-verified; forced-logout/failed-save = Blocked-UI (need
live Staff page / two sessions). Role name 'Parts Tech' → 'Parts Technician'.

## Section 3550 — Staff Record Settings (3 cases) — pushed 2026-07-13
**Result: 3 UPDATED · 200/200.** Department-gated scheduling, per-staff Time Clock,
universal clock — all Blocked-UI (need multiple seeded users). Jargon stripped.

---

## Sections 3536 / 3537 / 3535 — Schedule, Customer Management, WO Lines (22 cases) — pushed 2026-07-13
**Result: 22 UPDATED (18 tmpl1 + 4 Steps-Separated) · 0 no-op · 0 failed · 200/200.**
- **3536 Schedule (5):** card 'Schedule' build-verified; C27867 (tmpl2) reworded,
  API endpoint jargon (GET /api/…) stripped. Behavior = Blocked-UI (need seeded roles).
- **3537 Customer Management (8):** all wording moved to the build card name **'Customers'**
  (was 'Customer Management'); AP/AR → **'View and Manage AP/AR Data'**; Invoicing →
  'Invoicing & payments'. Behavior = Blocked-UI.
- **3535 WO Lines (9):** card 'Work order lines' (no View column — View comes from Work
  orders View); C27271/C27272/C27866 (tmpl2) reworded, ShopCoach element-ids / SV-refs /
  URLs / 403 jargon stripped. Behavior = Blocked-UI.
