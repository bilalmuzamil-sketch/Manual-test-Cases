# SV-10323 retest 2 — after Nemanja's fix (7 Oct 2026) — IN PROGRESS

**Trigger:** Nemanja 78059 *"Ready for retest: check 11 (rows 3–8 in 78010)"*, build **v26.40.8-129d22f** (read live: last-modified Wed 07 Oct 2026 09:46:12 GMT).
**Rows 7–8 root cause (Nemanja 78014) verified against the spec:** *Part Sales Update v1* (Confluence **v36**, 2026-10-06) S1-N5: *"See Financial Data gates the whole part sale screen, so a user without it never reaches the parts grid and never sees a core row. This project does not open part sales to those users."* → our ZZ10323 roles lacked See Financial Data; the earlier "part sale does not open" failure was our test set-up, not the build.
**Set-up:** `PUT /api/roles/{id}` (full body echoed, `crossToggles.seeFinancialData:true`) on both ZZ10323 roles → 200; diff before/after = only `seeFinancialData` added, view mode `tech` unchanged (`scripts/sfd-roles.json`).
**Spec:** Notifications Update V1 still **v28** (2026-10-06) — same as retest 1.
Run: `scripts/matrix4.sh` → TechView edit (toggle) · TechView view-only (observe) · Technician (observe) · Sales Representative (toggle) · Admin (toggle); Tech restored to Technician at the end.
