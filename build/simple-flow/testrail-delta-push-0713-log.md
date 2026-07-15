# Simple Flow — V2.4 Δ1–Δ4 Delta Push to TestRail (Audit Log)

- Date: 2026-07-13
- Host: https://shopview.testrail.io · Project 1 · Suite 1 (Master)
- Project: Simple Flow ONLY (Epic SV-7301, PO = Milos). No other project touched.
- Authorization: QA lead authorized the F&D-style flow for Simple Flow, which
  includes TestRail sync (update_case + add_case). Scope: update_case + add_case
  ONLY. **No runs, no results, no deletions.**
- Method: curl + Basic auth (Node fetch blocked for shopview.testrail.io). For each
  case: GET → diff → update only when a TestRail-visible field changed → re-GET
  verify. Credentials kept in /tmp (chmod 600), never in repo/commit/report.
- Content rendered exactly per `build/simple-flow/gen_update.py` helpers
  (title, refs = Jira story id(s) + spec-rule ref, custom_preconds, custom_steps,
  custom_expected). Adds also set `custom_atmstatus:3` + `custom_automation_type:0`.
- Note on refs: TestRail normalizes list whitespace ("SV-a, SV-b" → "SV-a,SV-b");
  verification treats that normalization as a match (content identical).

## STEP 1 — Updates (POST update_case/{case_id}) — 9 cases, all verified 200/200

| Δ | sf_id | case_id | fields changed | update HTTP | verify HTTP | verified |
|---|-------|---------|----------------|-------------|-------------|----------|
| Δ1 | SF-COMP-16 | 29305 | title, custom_preconds, custom_steps, custom_expected | 200 | 200 | yes |
| Δ1 | SF-VAL-02  | 29416 | title, refs, custom_preconds, custom_expected | 200 | 200 | yes |
| Δ2 | SF-COMP-21 | 29310 | title, refs, custom_preconds, custom_steps, custom_expected | 200 | 200 | yes |
| Δ2 | SF-COMP-22 | 29311 | title, refs, custom_preconds, custom_steps, custom_expected | 200 | 200 | yes |
| Δ2 | SF-VAL-11  | 29425 | title, refs, custom_steps, custom_expected | 200 | 200 | yes |
| Δ3 | SF-VEND-04 | 29381 | title, refs, custom_preconds, custom_steps, custom_expected | 200 | 200 | yes |
| Δ3 | SF-VAL-06  | 29420 | title, refs, custom_steps, custom_expected | 200 | 200 | yes |
| Δ3 | SF-RCV-06  | 29374 | title, refs, custom_steps, custom_expected | 200 | 200 | yes |
| Δ3 | SF-PNFIX-05 | 29367 | title, refs, custom_steps, custom_expected | 200 | 200 | yes |

Each re-fetch confirmed the case's title / refs / preconds / steps / expected match
the local case JSON (refs modulo TestRail whitespace normalization).

## STEP 2 — Adds (POST add_case/{section_id}) — 1 case, verified 200/200

| Δ | sf_id | new case_id | section | section_id | add HTTP | verify HTTP | atmstatus | automation_type | verified |
|---|-------|-------------|---------|-----------|----------|-------------|-----------|-----------------|----------|
| Δ3 | SF-VEND-06 | **29442** | Assign Vendor + Merge (Story 13) | 4080 | 200 | 200 | 3 | 0 | yes |

SF-VEND-06 = dedicated S13-R7 receive-time cost/sell gate (UI-affordance gate, no
HTTP-status assertion → functional Story-13 section per CLAUDE.md rule 4, NOT an
API section). Target section 4080 already existed (no add_section needed).

## STEP 3 — Δ4 no-ops (not pushed — no TestRail-visible change)

| Δ | sf_id | case_id | reason |
|---|-------|---------|--------|
| Δ4 | SF-REV-06 | 29391 | already VIN-only / note-free (Milos Round-2, 2026-07-09); only internal `notes` annotation added → no TestRail-visible field changed → skipped |
| Δ4 | SF-REV-10 | 29395 | already VIN-only "no review note field" in title/expected; only internal `notes` annotation added → skipped |

Δ4 required no case-content change: the Mark-Reviewed note was already removed in the
Milos Round-2 pass; V2.4 2026-07-13 confirms it. The R10 `input_review_note`
test-id leftover is recorded as an internal spec-inconsistency flag on both cases
(and in requirements.md R7), not asserted.

## STEP 4 — id-map + case JSON write-back

- Added 1 row to `build/simple-flow/testrail-id-map.csv`:
  `29442,SF-VEND-06,Verify a part cannot be received until a missing cost / sell price is entered,Assign Vendor + Merge (Story 13)`
- Added `"testrail_case_id": "29442"` to the SF-VEND-06 case JSON.

## Confirmation

- Exactly **10 cases touched** (9 update_case + 1 add_case). No other cases
  modified. No deletes issued. No runs/results written.
- Pre-existing note (out of scope, NOT changed): SF-QB-09 has no row in
  testrail-id-map.csv (unmapped before this task) — flagged as a follow-up.
