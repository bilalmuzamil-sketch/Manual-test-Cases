# Simple Flow — v2.4 Batch Push to TestRail (Audit Log)

- Date: 2026-07-08
- Host: https://shopview.testrail.io  · Project 1 · Suite 1 (Master)
- Scope: 18 in-place UPDATES + 2 ADDS = 20 cases touched. Nothing else updated; nothing deleted.
- Method: curl + Basic auth (node fetch blocked for this host). Every write verified by re-fetch (get_case).
- Fields rendered exactly per build/simple-flow/gen_import.py (title, preconds, steps, expected, refs; priority/type/atmstatus/automation_type on adds).
- NOTE on refs: TestRail stores the `refs` list without the space after commas ("SV-a, SV-b" -> "SV-a,SV-b"). This is TestRail-side list normalization; the reference content is identical. Affects the 3 multi-ref updates (SF-CORE-01, SF-PNFIX-04, SF-BULK-06) — title/preconds/steps/expected matched byte-for-byte.

## STEP 1 — Updates (POST update_case/{case_id})

| sf_id | case_id | action | update HTTP | verify HTTP | verified |
|-------|---------|--------|-------------|-------------|----------|
| SF-SET-08 | 29282 | updated | 200 | 200 | yes |
| SF-RCV-05 | 29373 | updated | 200 | 200 | yes |
| SF-UX-04 | 29404 | updated | 200 | 200 | yes |
| SF-SET-13 | 29287 | updated | 200 | 200 | yes |
| SF-CORE-01 | 29313 | updated | 200 | 200 | yes (refs whitespace-normalized by TestRail; content identical) |
| SF-CORE-02 | 29314 | updated | 200 | 200 | yes |
| SF-CORE-10 | 29322 | updated | 200 | 200 | yes |
| SF-REV-08 | 29393 | updated | 200 | 200 | yes |
| SF-REV-11 | 29396 | updated | 200 | 200 | yes |
| SF-REV-10 | 29395 | updated | 200 | 200 | yes |
| SF-VPART-01 | 29331 | updated | 200 | 200 | yes |
| SF-VPART-02 | 29332 | updated | 200 | 200 | yes |
| SF-COMP-12 | 29301 | updated | 200 | 200 | yes |
| SF-COMP-18 | 29307 | updated | 200 | 200 | yes |
| SF-COMP-19 | 29308 | updated | 200 | 200 | yes |
| SF-PNFIX-04 | 29366 | updated | 200 | 200 | yes (refs whitespace-normalized by TestRail; content identical) |
| SF-BULK-06 | 29355 | updated | 200 | 200 | yes (refs whitespace-normalized by TestRail; content identical) |
| SF-RCV-06 | 29374 | updated | 200 | 200 | yes |

## STEP 2 — Adds (POST add_case/{section_id})

| sf_id | new case_id | section | section_id | add HTTP | verify HTTP | verified |
|-------|-------------|---------|-----------|----------|-------------|----------|
| SF-VMIS-07 | 29439 | Vendor Missing on WO PO (Story 6) | 4073 | 200 | 200 | yes |
| SF-RCV-10 | 29440 | Accept Delivery (Story 12) | 4079 | 200 | 200 | yes |

Both adds include custom_atmstatus:3 and custom_automation_type:0 (verified). Target sections already existed under parent 4058 (no add_section needed).

## STEP 3 — id-map
Added 2 rows to build/simple-flow/testrail-id-map.csv:
- 29439,SF-VMIS-07,Vendor Missing on WO PO (Story 6)
- 29440,SF-RCV-10,Accept Delivery (Story 12)

## Confirmation
- Exactly 20 cases touched (18 update_case + 2 add_case). No other cases modified. No deletes issued.

---

## Milos Round-2 push (2026-07-09) — update_case, verified

| sf_id | case_id | outcome | update HTTP | verify HTTP | verified |
|-------|---------|---------|-------------|-------------|----------|
| SF-REV-10 | 29395 | spec-change: review note descoped (VIN-only) | 200 | 200 | yes |
| SF-TECH-08 | 29330 | confirmed: Story 17 authoritative (open-q closed) | 200 | 200 | yes |
| SF-VPART-01 | 29331 | spec-change: category required, sell optional | 200 | 200 | yes |
| SF-VPART-02 | 29332 | spec-change: category required, sell optional | 200 | 200 | yes |
| SF-PERM-06 | 29410 | spec-change: UI gating = v1 pass; API gap noted | 200 | 200 | yes |

5 cases touched (all update_case). No adds, no deletes. See `milos-round2-mapping.md`.

---

## SF-WOP-02 expected refinement push (2026-07-10) — update_case, verified

- Date: 2026-07-10
- Host: https://shopview.testrail.io · Project 1 · Suite 1 (Master)
- Authorization: user said "Go ahead" — scope limited to this ONE master-case update; no runs/results, no other cases.
- Method: curl + Basic auth (node fetch blocked for this host). GET → diff → update only the changed field → re-fetch verify.

| sf_id | case_id | outcome | update HTTP | verify HTTP | verified |
|-------|---------|---------|-------------|-------------|----------|
| SF-WOP-02 | 29384 | expected refined: count-click opens the consolidated Bulk Receive page (/bulk-receive) that supersedes legacy Accept Delivery for WO POs (BATCH-8 OBS-5) | 200 | 200 | yes |

**Diff (single field changed):**
- `custom_expected` BEFORE: "1. Accept Delivery opens for the work order's first unreceived PO.\n2. Receiving behaves as it does today from there."
- `custom_expected` AFTER: "1. EXPECTED (built): clicking the count opens the receiving surface for the work order's first unreceived PO. In the current build this is the consolidated Bulk Receive page (/bulk-receive), which supersedes the legacy Accept Delivery screen for work-order POs.\n2. Receiving behaves as it does from the Bulk Receive page from there."
- Unchanged (re-fetch confirmed identical): `title`, `refs`, `custom_preconds`, `custom_steps`.

1 case touched (update_case). No adds, no deletes. Re-fetch confirmed the new expected matches the local case JSON byte-for-byte and no other field moved.
