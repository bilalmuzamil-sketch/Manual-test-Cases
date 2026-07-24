# SV-8183 Corrective TestRail Push — Execution Log (2026-07-24)

**STATUS: EXECUTED 2026-07-24 — user-authorized.**
Executor: `build/simple-flow/sv8183/exec_corrective_2026-07-24.py`
TestRail project 1 / suite 1 "Master". Creds from `/tmp/tr-creds.env` (never committed).
Pre-flight: read-only `GET get_case/29407` → HTTP 200 (creds verified).
Section resolved via `GET get_section/4084` → name "Permissions" (existing; reused — 0 add_section).

**Scope executed = 3 writes: 2 add_case + 1 update_case. ZERO run writes (run 325 untouched),
ZERO delete_case, ZERO add_section.** All re-GET diffs MATCH.

---

## 1. add_case — SF-PERM-11 (driver SV-8515) → **C30646**

- `add_case/4084` (Permissions), HTTP **200**.
- Fields: `custom_atmstatus:3`, `custom_automation_type:0`, `template_id:1`, `type_id:6`
  (Permissions), `priority_id:3` (High).
- Title: *Verify a Vendor & Order Management View-only user cannot receive purchase orders by
  any path on the Bulk Receive screen*
- refs: `SV-8515 (§9.1 Bulk Receive gate / §9.2 Office footnote-4)`
- Preconditions / Steps / Expected: built 1:1 from
  `cases/group-C-review-permissions-validation-edge.json` (SF-PERM-11), wrapped as `<ol><li>`.
- **Re-GET C30646 → HTTP 200, MATCH=True** (title, refs, custom_preconds, custom_steps,
  custom_expected, custom_atmstatus=3, custom_automation_type=0, section_id=4084 all match sent).
- viu_status (local metadata): **VIU-Deviation** (FE-exposure defect; SV-8515 dev Ready-to-Fix;
  BE blocks the actual receive `accept`→403, no data bypass — the INVERSE of Rule 24, stays a
  Deviation).

## 2. add_case — SF-PERM-12 (driver SV-8516) → **C30647**

- `add_case/4084` (Permissions), HTTP **200**.
- Fields: `custom_atmstatus:3`, `custom_automation_type:0`, `template_id:1`, `type_id:6`,
  `priority_id:3` (High).
- Title: *Verify a no-access role (Time Clock) cannot edit, cancel or change the vendor of a
  work order part from the part menu*
- refs: `SV-8516 (§9.2 Time Clock part-actions)`
- Preconditions / Steps / Expected: built 1:1 from the JSON (SF-PERM-12), wrapped as `<ol><li>`.
- **Re-GET C30647 → HTTP 200, MATCH=True.**
- viu_status (local metadata): **VIU-Verified — PASS per Rule 24** (FE gating is the pass
  criterion; the same edit succeeds via API `part/change-request`→200 and is ACCEPTED per the
  strengthened Standing Rule 24 / user ruling 2026-07-24; not a defect).

## 3. update_case — SF-PERM-03 = **C29407**

- `update_case/29407`, HTTP **200**. Fields changed: **`custom_steps` + `custom_expected` only**
  (Title / Preconditions / refs / status unchanged — refs stays `SV-8183 (§8 Permissions)`,
  status VIU-Verified).
- Both entry points now driven: per-PO Receive button + multi-select "Receive Selected"
  (closes the SV-8515 coverage gap).
- **Re-GET C29407 → HTTP 200, MATCH=True** (custom_steps + custom_expected == sent).

---

## Post-write reconciliation

- `testrail-id-map.csv`: SF-PERM-11 blank→**30646**, SF-PERM-12 blank→**30647** (0 blank id
  rows remaining).
- Deliverables regenerated: `gen_import.py` (186 rows, header byte-identical vs
  fees-discounts/simple-flow imports, 0 VIU words, 0 "feature flag", 0 duplicate titles, no
  C-id column), `gen_blockers.py` (Blockers Tracker .md/.xlsx), `build_workbook.py`
  (SimpleFlow_V1_TestCases .xlsx/.csv). id-map C-ids preserved through the regen (verified
  unchanged).
- **Tally: 186 ACTIVE = 152 VIU-Verified / 4 VIU-Pending / 21 Blocked-Env /
  5 VIU-observed-awaiting-Milos / 3 Deviation / 1 VIU-Deviation.**
- Manifest `testrail-sync-manifest-corrective-2026-07-24.md` header flipped to EXECUTED.
- No secrets committed (creds in `/tmp` only).
