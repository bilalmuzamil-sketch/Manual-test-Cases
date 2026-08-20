# WIP design-review Aug-20b pass — proofs

## Session
- Staging build marker: **v3.8-d0e135e** (last-modified Wed 19 Aug 2026 13:27:07 GMT, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`) — unchanged, no redeploy.
- Authenticated staging session: **DEAD (401)** on `GET /api/auth/me` with all available cookie sets (rs-viu Aug-5, qa-cookies Aug-10). Nothing driven live.

## TestRail writes (Rule 50 byte-verified, wrap-aware for hazard #6)
- **C43838** — update_case, HTTP 200, all fields byte-verified (title/preconds/steps/expected/refs), one marker, one provenance, no `<ol>/<li>`. Re-scoped tab-element glow -> composing-widget glow (covers NEW-1). created_by=3, updated_by=3.
- **C43984** — add_case (section 4361), HTTP 200, byte-verified. NEW-2 (label two-row wrap). template_id=1, type_id=1, custom_atmstatus=1, custom_automation_type=0. created_by=3.
- C30470 — NO WRITE (already design-correct: asserts VIN alone / no placeholder). Left byte-untouched.

## Run 359 UNCHANGED (add_case does not auto-add to a fixed-selection run; no run-sync this pass)
- tests: 508 before / 508 after — test_ids set-equal.
- results: 535 before / 535 after — result_ids set-equal, all present by ID.
- case_ids set-equal both directions.
- C43984 NOT in run 359 (correct — awaits next-step run-sync). C43838 still present.

## NEW C-ids for the next run-sync step (union into run 359)
- **C43984** (NEW-2). (C43838 already in run 359.)

## Other
- 0 Jira writes. 0 foreign-case edits (only created_by=3 cases touched).
