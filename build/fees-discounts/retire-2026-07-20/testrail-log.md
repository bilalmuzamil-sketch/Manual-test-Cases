# Fees & Discounts — TestRail retirement audit log (FD-CUST-016 / C28500)

**Date executed:** 2026-07-20 (run recorded 2026-07-21)
**TestRail:** project **1** / suite **1 "Master"**, API v2, Basic auth (creds `/tmp/tr-creds.env`).
**Scope of writes:** ONE `delete_case` only (C28500). **NO other deletions. NO run
writes.** Run 325 (Ayesha's Simple-Flow run) is a different project artifact and was
not touched here.

## User authorization
The user's explicit 2026-07-20 ruling on the FD-CUST-016 / FD-VAL-007 duplicate pair:
**keep FD-VAL-007 (C28605), retire/delete FD-CUST-016 (C28500).** FD-CUST-016 and
FD-VAL-007 are the same test (a template that is BOTH location auto-apply AND a
customer default must be added only once to a new work order); the pair was flagged
as a duplicate and the QA-lead/user ruled to keep the Validation/Edge copy (C28605)
and retire the Customer-defaults copy (C28500). Executed per the house retirement
precedent used for Simple Flow SF-CORE-05/06/09
(`build/simple-flow/spec-v4-2026-07-17/testrail-update-log.md`).

## Method (mirrors the SF retire precedent)
Final before-snapshot (GET `get_case`, HTTP 200, raw JSON retained) → `POST
delete_case/<id>` → HTTP 200 → verification re-GET → **HTTP 400 "Field :case_id is
not a valid test case."** = confirmed gone. Kept-twin spot-check re-GET → HTTP 200.

| FD ID | TestRail | Before-snapshot GET | delete_case | Verify re-GET | Snapshot file |
|---|---|---|---|---|---|
| FD-CUST-016 | C28500 | HTTP 200 | HTTP 200 | HTTP 400 (gone) | retire-2026-07-20/before-C28500.json |

**Kept twin spot-check:** FD-VAL-007 / **C28605** — re-GET **HTTP 200** both before
AND after the delete (still live, title "Verify a template that is both auto-apply at
the location and a customer default is added only ONCE to a new work order").

### Deletion confirmation (raw)
- `POST delete_case/28500` → **HTTP 200** (empty body, per TestRail delete_case).
- `GET get_case/28500` (verify) → **HTTP 400** body:
  `{"error":"Field :case_id is not a valid test case."}` → snapshot
  `retire-2026-07-20/verify-gone-C28500.json`.
- `GET get_case/28605` (kept twin, post-delete) → **HTTP 200** (id 28605 present).

### Before-snapshot reference
`build/fees-discounts/retire-2026-07-20/before-C28500.json` — the full C28500 case
body as retrieved immediately before deletion (section_id 3912, updated_on
1783929103, title "Verify a template that is both location auto-apply AND a customer
default is added only once to a new work order").

## Local bookkeeping (executed same pass)
- Case body KEPT in `cases/group-B-customer-admin-finance.json` with `viu_status` =
  **"Retired — user ruling 2026-07-20 (duplicate of FD-VAL-007/C28605); C28500 deleted
  from TestRail"** + a RETIRED note recording the ex-C-id (C28500) and the delete
  confirmation.
- `testrail-id-map.csv`: the C28500 / FD-CUST-016 row was removed (the case no longer
  exists in TestRail; mapping preserved here + in the case note + PROJECT-STATE).
- Generators updated to EXCLUDE Retired cases (mirrors the SF retire): `gen_import.py`,
  `gen_blockers.py` (assertion 185→184), `build_workbook.py`.
- Deliverables regenerated over **184 active** (was 185): import CSV/XLSX (184 rows,
  0 VIU/flag words, canonical header), FeesDiscounts_Blockers_Tracker.md/.xlsx.
  NOTE: the dated historical workbooks `FeesDiscounts_V1_TestCases.xlsx` (last
  regenerated 2026-07-09, 182 cases — pre V1_2/V1_3/staging) and
  `FeesDiscounts_FreshVIU_2026-07-10.*` are point-in-time snapshots that already
  predate this change and are not part of the maintained current set; the Retired
  filter is now in `build_workbook.py` for any future regeneration.

## New tally (184 active = 185 authored − 1 retired)
**VIU-Verified 151 / VIU-Deviation 12 / Blocked-Env 20 / VIU-Pending 1 (FD-PART-005).**
(FD-CUST-016 was VIU-Verified, so Verified 152→151.) Reconciles across the case
JSONs, id-map (184/184, 0 blank C-ids), import CSV (184 rows), and the Blockers
Tracker (151/12/1/20 = 184).

## Duplicate-pair thread — CLOSED
The FD-CUST-016 / FD-VAL-007 duplicate-pair open thread is RESOLVED:
keep FD-VAL-007 (C28605) / retire FD-CUST-016 (C28500, deleted).
