# SV-8183 Permission VIU — TestRail Sync Manifest

**STATUS: EXECUTED 2026-07-23** (user-authorized; 1 × update_case SF-PERM-01/C29405, HTTP 200 + re-GET MATCH; run 325 untouched). Audit: `testrail-execution-log-2026-07-23.md`.

Project: Simple Flow (Epic SV-7301) · Story SV-8183 (Permission mapping) · PO Milos.
Source pass: `build/simple-flow/viu-sv8183-2026-07-23/` (live staging VIU 2026-07-23).
TestRail: project 1 / suite 1 "Master". Standing Rule 6 — **no TestRail write happens
until the user explicitly authorizes this manifest.**

---

## Scope of writes

**TOTAL writes required = 1** (`update_case`). Everything else is a re-confirmation with
no wording change → **no `update_case`.**

### 1 × update_case — SF-PERM-01 (C29405)

**Why:** live BE finding on 2026-07-23 — `POST /api/organizations/settings/change` is gated
by the settings atom-FAMILY, not `settingsApp` specifically (a clean Parts Manager with
settingsParts/settingsFinance and NO settingsApp gets HTTP 200; no-settings roles get 403).
The FE settings *route* remains settingsApp-gated. The prior tester-facing expected #3
("backend rejects a save by a role lacking App Settings") was imprecise. Reworded to the
page-reachability truth (Rule 9, plain layman); the BE driver moved to the case's viu_note
metadata (not the tester-facing fields, per Rules 7/20). No status change; case stays
VIU-Verified. Only the `expected` field changes (title/preconditions/steps unchanged).

**Field to update:** Expected Result.

**BEFORE:**
1. Only a role with the App Settings permission (system defaults Admin, Service Manager and Office) can view and modify the Work Order settings page.
2. A role without App Settings cannot open or change the Work Order settings.
3. The backend rejects a Work Order settings save attempted by a role that lacks App Settings.

**AFTER:**
1. Only a role with the App Settings permission (system defaults Admin, Service Manager and Office) can open and change the Work Order settings page.
2. A role without App Settings cannot reach the Work Order settings page (it is redirected away) and so cannot change those settings from the screen.
3. A role that cannot open the Work Order settings page cannot save changes to it.

**refs (unchanged):** `SV-7696 (S1 AC / §8 Permissions)` (per id-map). Traceability driver =
SV-8183 §9 / §9.2 EditSet=settingsApp.

---

## NOT written (re-confirmed, wording already build-accurate → NO update_case)

- **SF-PERM-02 (C29406)** — completion matrix; element re-observed live 10/11 roles == §9.2
  (Technician cell drift-blocked, carried). Wording accurate → no write.
- **SF-PERM-03 (C29407)** — Bulk Receive roles; composition + FE route confirmed → no write.
- **SF-PERM-04 (C29408)** — Mark Reviewed gated by Review Work Orders; element re-observed
  live (ENABLED SrSA/SA/PM, DISABLED SalesRep/Tech) → no write.
- **SF-PERM-05 (C29409)** — PO Receive hidden for office/readonly; composition + FE route → no write.
- **SF-PERM-06 (C29410)** — BE-vs-FE gating; settings-family BE enforcement confirmed live
  (nuance recorded in SF-PERM-01 refinement + viu_note) → no write.
- **SF-PERM-07 (C29411)** — review sign-off = Review Work Orders; element re-observed → no write.
- **SF-PERM-08 (C29412)** — self-review allowed (reviewer≠completer not enforced); element
  re-observed → no write.
- **SF-PERM-09 (C29413)** — Technician cannot add vendorless part (lacks See Financial Data).
  Element NOT cleanly re-observed this run (Technician role concurrently drifted to hold
  seeFinancialData; no clean baseline holder available). Status VIU-Verified carried from
  2026-07-13 composition; honestly labeled partial in viu_note. **Wording unchanged → no write.**
- **SF-PERM-10 (C29414)** — per-role completion matrix; element re-observed live 10/11 (Technician
  cell drift-blocked, carried) → no write.
- **SF-REV-09 (C29394)** — Mark Reviewed gated by Review Work Orders; element re-observed live → no write.

---

## Explicit guardrails

- **NO run writes.** Run 325 ("Simple Flow — Ayesha Khan → Specs 7/7/2026") is Ayesha's/QA's
  run — **never touch it** (no add_result, no result_for_case, no status change). This manifest
  contains ZERO run operations.
- **NO add_case / delete_case / add_section.** All 11 SV-8183 cases already exist in TestRail
  (id-map C29405–C29414 + SF-REV-09 = C29394). Only 1 in-place `update_case`.
- **Drift-blocked cells are NOT a TestRail action.** SF-PERM-09 + the Technician cell of the
  completion matrix (SF-PERM-02 / SF-PERM-10) need a **clean Technician-baseline window** on
  staging (re-assert "Reset To Template" on Technician + no concurrent drift), then a live
  element re-observe — an environment/data-state task, not a TestRail write.

---

## Execution note (for when authorized)

On authorization: `update_case(29405, {custom_expected: <AFTER>})` via the TestRail v2 API
(Basic auth), then re-GET C29405 and diff to confirm MATCH; log the before/after in a dated
`sv8183/testrail-execution-log-2026-07-23.md` and flip this manifest header to
`STATUS: EXECUTED`. No other calls.
