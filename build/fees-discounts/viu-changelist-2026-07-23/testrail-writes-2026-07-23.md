# TestRail writes — 2026-07-23 (user-authorized)

## add_case (2 new cases)
| C-ID | Internal | Section | refs | Verify |
|---|---|---|---|---|
| C30639 | FD-PSALE-INV-01 | 3939 Customer document — per-line adjustments | SV-8521,SV-8281 (§5-R12) | re-GET title/refs/section MATCH |
| C30640 | FD-PART-DISP-01 | 3897 Work Order / Parts — Part-line Fee/Discount | SV-8520,SV-8287 (§5-R12) | re-GET title/refs/section MATCH |
Both created with custom_atmstatus:3, custom_automation_type:0, template_id:1, type_id:6, priority_id:1.
SV-8521 build appears FIXED (renders on WO Finance); SV-8520 build has the defect (hidden after pick) —
cases state the correct spec expectation either way.

## update_case
NONE. After reading all candidate existing FD cases (get_case → diff), their tester-facing wording was
already build-accurate (from the prior VIU pass); pushing edits would be no-ops (Rule 6 — skip no-ops).

## Reclassified per Standing Rule 24 (FE-restricted but API-possible = FLAG, not bug)
- FD-WO-013 (C28436) + FD-PERM-002 (C28586): UI hides whole-WO fee add without WO Create&Edit, but a
  Sales-Rep-role user added it via API (201). FLAGGED "can be done through the API" — NOT a bug; no case
  wording edit. Enforcement (whether BE should block) is a PO decision if raised.

## Frozen (user 2026-07-23)
C29373 / C29375 (SF-RCV-05/07) — keep as-is, no change.
