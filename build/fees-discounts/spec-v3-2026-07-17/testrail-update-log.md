# TestRail update log — F&D spec V1_3 apply (Δ1 + Δ2)

- **Run:** 2026-07-17 17:35:37Z (LIVE)
- **Authorization:** explicit user authorization 2026-07-17 ("check if any test cases need to be updated, if yes then please do that") — this V1_3 apply pass only.
- **Scope:** `update_case` ONLY on the 11 V1_3-affected cases (Δ1: FD-WO-016, FD-PROC-004; Δ2 sweep: FD-HIST-001..006, FD-PERM-009, FD-PERM-010, FD-FLAG-002). GET before-snapshot → update changed fields → re-GET diff-confirm. Before/after snapshots: `testrail-snapshots-2026-07-17/`. No runs/results, no deletions, no section renames (the 4 'History log*' section renames are NOT done — optional candidate only), no other cases.
- **Content rules:** gen_import.py builders (VIU-word-free, feature-flag-free); fields title / custom_preconds / custom_steps / custom_expected / refs.

**Summary:** 11 cases — 11 updated, 0 no-op, 0 failed.

| TestRail Case | FD ID | Delta | Fields changed | Update HTTP | Verify | Timestamp (UTC) |
|---|---|---|---|---|---|---|
| [C29441](https://shopview.testrail.io/index.php?/cases/view/29441) | FD-WO-016 | Δ1 §5-R15 SFD gate (+folded negative) | updated: custom_expected, custom_preconds, custom_steps | update 200 | verify 200 MATCH | 2026-07-17 17:35:11Z |
| [C28522](https://shopview.testrail.io/index.php?/cases/view/28522) | FD-PROC-004 | Δ1 §5-R15 SFD gate | updated: custom_expected, custom_preconds, custom_steps | update 200 | verify 200 MATCH | 2026-07-17 17:35:14Z |
| [C28560](https://shopview.testrail.io/index.php?/cases/view/28560) | FD-HIST-001 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps, title | update 200 | verify 200 MATCH | 2026-07-17 17:35:17Z |
| [C28561](https://shopview.testrail.io/index.php?/cases/view/28561) | FD-HIST-002 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps, title | update 200 | verify 200 MATCH | 2026-07-17 17:35:19Z |
| [C28562](https://shopview.testrail.io/index.php?/cases/view/28562) | FD-HIST-003 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps, title | update 200 | verify 200 MATCH | 2026-07-17 17:35:21Z |
| [C28563](https://shopview.testrail.io/index.php?/cases/view/28563) | FD-HIST-004 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps, title | update 200 | verify 200 MATCH | 2026-07-17 17:35:23Z |
| [C28564](https://shopview.testrail.io/index.php?/cases/view/28564) | FD-HIST-005 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps, title | update 200 | verify 200 MATCH | 2026-07-17 17:35:26Z |
| [C28565](https://shopview.testrail.io/index.php?/cases/view/28565) | FD-HIST-006 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps, title | update 200 | verify 200 MATCH | 2026-07-17 17:35:28Z |
| [C28593](https://shopview.testrail.io/index.php?/cases/view/28593) | FD-PERM-009 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps, title | update 200 | verify 200 MATCH | 2026-07-17 17:35:30Z |
| [C28594](https://shopview.testrail.io/index.php?/cases/view/28594) | FD-PERM-010 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps | update 200 | verify 200 MATCH | 2026-07-17 17:35:32Z |
| [C28597](https://shopview.testrail.io/index.php?/cases/view/28597) | FD-FLAG-002 | Δ2 history→audit-log sweep | updated: custom_expected, custom_preconds, custom_steps, title | update 200 | verify 200 MATCH | 2026-07-17 17:35:34Z |
