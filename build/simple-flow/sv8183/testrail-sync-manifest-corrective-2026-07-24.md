# SV-8183 Corrective Cases — TestRail Sync Manifest (2026-07-24)

**STATUS: EXECUTED 2026-07-24 — user-authorized.** SF-PERM-11 = **C30646**, SF-PERM-12 =
**C30647** (both add_case into section 4084 "Permissions"), SF-PERM-03 = **C29407** update_case;
all HTTP 200 + re-GET MATCH; run 325 untouched. Per-case audit:
`testrail-execution-log-corrective-2026-07-24.md`.

Project: Simple Flow (Epic SV-7301) · PO Milos · TestRail project 1 / suite 1 "Master".
Purpose: push the 2 corrective permission cases (SV-8515 / SV-8516) and the tightened
SF-PERM-03, authored 2026-07-24 to close the QA-found coverage gaps in our SV-8183 report.
Source pass: `build/simple-flow/sv8183/ayesha-issues/reverify-2026-07-24/` (LIVE re-verify
on clean template roles, drift ruled out per Rule 26).

Standing Rule 6 — **no TestRail write happens until the user explicitly authorizes this
manifest.** User rulings applied: author SV-8515 + SV-8516 corrective cases; **SV-8541 HELD**
(not authored); SV-8516 = "front-end blocks, backend allows is OK for now" → Rule-24 flag, NOT
a bug.

---

## Scope of writes

**TOTAL writes required = 3** — 2 × `add_case` + 1 × `update_case`. **ZERO** add_section
(both new cases go into the existing "Permissions" section) and **ZERO** delete_case.

`add_case` REQUIRES `custom_atmstatus:3` + `custom_automation_type:0` (per project convention).
Both new cases are non-API (UI-observed) → **NO "API" section**, they belong in "Permissions".

### 1 × add_case — SF-PERM-11 (driver SV-8515)

- **Section:** Permissions (existing).
- **Type / status:** `custom_atmstatus:3`, `custom_automation_type:0`, Type Functional, Priority High.
- **Title:** Verify a Vendor & Order Management View-only user cannot receive purchase orders by any path on the Bulk Receive screen
- **Preconditions / Steps / Expected:** as authored in
  `build/simple-flow/cases/group-C-review-permissions-validation-edge.json` (SF-PERM-11) and
  reflected 1:1 in `testrail-import/simple-flow-v1-testrail-import.csv`.
- **refs:** `SV-8515 (§9.1 Bulk Receive gate / §9.2 Office footnote-4)`.
- **viu_status:** VIU-Deviation (FE-exposure defect; SV-8515 dev Ready-to-Fix; BE blocks the
  actual receive → 403, so no data bypass).
- **On success:** capture the new C-id, write it into `testrail-id-map.csv` (currently blank),
  re-GET and diff to MATCH.

### 1 × add_case — SF-PERM-12 (driver SV-8516)

- **Section:** Permissions (existing).
- **Type / status:** `custom_atmstatus:3`, `custom_automation_type:0`, Type Functional, Priority High.
- **Title:** Verify a no-access role (Time Clock) cannot edit, cancel or change the vendor of a work order part from the part menu
- **Preconditions / Steps / Expected:** as authored (SF-PERM-12) and in the import CSV.
- **refs:** `SV-8516 (§9.2 Time Clock part-actions)`.
- **viu_status:** VIU-Verified (FE gating holds — Time Clock ⋮ shows only "Return"). **Rule-24
  flag** in metadata: the same edit still succeeds via the API
  (`POST /api/work-orders/part/change-request` → 200, persisted); per the product ruling
  2026-07-24 this FE-only gating is ACCEPTED for now and is NOT a defect.
- **On success:** capture the new C-id, write it into `testrail-id-map.csv`, re-GET and MATCH.

### 1 × update_case — SF-PERM-03 (C29407)

- **Why:** tighten the existing Bulk Receive roles case so it explicitly drives BOTH entry
  points — the per-PO Receive button AND the multi-select "Receive Selected" path — so the
  SV-8515 gap cannot recur.
- **Fields to update:** Steps + Expected Result (Title / Preconditions / refs unchanged; status
  stays VIU-Verified).

  **Steps BEFORE:**
  1. For each role, attempt to reach and use Bulk Receive.
  2. Record the outcomes.

  **Steps AFTER:**
  1. For each role, attempt to reach and use Bulk Receive by BOTH entry points: (a) the per-purchase-order Receive button on the Purchase Orders list, and (b) multi-selecting purchase orders with the checkboxes and using 'Receive Selected'.
  2. Where a receive screen opens, attempt to actually complete the receive (enter invoice details and submit).
  3. Record the outcomes for each role and each entry point.

  **Expected #2 BEFORE:**
  2. Office (Vendor & Order Mgmt: View only) can open the Bulk Receive page but cannot receive.

  **Expected #2 AFTER:**
  2. Office (Vendor & Order Mgmt: View only) can open the Bulk Receive page but cannot complete a receive by any path — neither the per-purchase-order Receive button nor the multi-select 'Receive Selected' route may lead to a usable receive.

  (Expected #1 also gains "by both entry points"; Expected #3 unchanged.)
- **refs (unchanged):** `SV-8183 (§9.2 Bulk=vendorOrderManagementCreateAndEdit+seeFinancialData)`.

---

## Explicit guardrails

- **NO run writes.** Run 325 ("Simple Flow — Ayesha Khan → Specs 7/7/2026") is Ayesha's/QA's
  run — **never touch it** (no add_result, no result_for_case, no status change). This manifest
  contains ZERO run operations.
- **NO delete_case, NO add_section.** Exactly 2 `add_case` (into the existing Permissions
  section) + 1 in-place `update_case`.
- **SV-8541 is HELD** (user ruling 2026-07-24) — its corrective case is NOT authored and is NOT
  in this manifest.
- No secrets committed (TestRail creds in `/tmp` only).

---

## Execution note (for when authorized)

On authorization: `add_case(<Permissions section id>, {...SF-PERM-11...})` and
`add_case(<Permissions section id>, {...SF-PERM-12...})` (both with `custom_atmstatus:3` +
`custom_automation_type:0`), then `update_case(29407, {custom_steps_separated | custom_steps,
custom_expected})`. Re-GET each and diff to MATCH; write the 2 new C-ids into
`testrail-id-map.csv`; regenerate deliverables; log before/after in a dated
`sv8183/testrail-execution-log-corrective-2026-07-24.md` and flip this manifest header to
`STATUS: EXECUTED`. No other calls.
