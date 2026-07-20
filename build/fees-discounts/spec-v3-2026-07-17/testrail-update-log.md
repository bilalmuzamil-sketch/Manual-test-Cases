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

---

## Section renames — "History log*" → "Audit log*" (2026-07-20)

- **Run:** 2026-07-20 08:16:16Z (LIVE)
- **Authorization:** explicit user authorization 2026-07-17 ("Rename") for the 4 optional "History log*" section renames flagged in the V1_3 apply pass (spec-diff §E note / PROJECT-STATE open thread).
- **Scope:** `update_section` (name field only) on EXACTLY the 4 F&D sections named in the V1_3 report, project 1 / suite 1, parent 3894 "Fees & Discounts (VIU-PENDING)". GET before-snapshot → update_section → re-GET diff-confirm. No cases, runs, results, or other sections touched.
- **Note:** a 5th live section "History log — edit entry" (3961) exists under the same parent but was NOT in the authorized set — left untouched (follow-up candidate).

**Summary:** 4 sections — 4 renamed, 0 failed.

| Section ID | Before | After | Update HTTP | Verify | Timestamp (UTC) |
|---|---|---|---|---|---|
| 3957 | History log | Audit log | 200 | re-GET 200 MATCH | 2026-07-20 08:16:16Z |
| 3958 | History log — visibility | Audit log — visibility | 200 | re-GET 200 MATCH | 2026-07-20 08:16:17Z |
| 3959 | History log — permission | Audit log — permission | 200 | re-GET 200 MATCH | 2026-07-20 08:16:19Z |
| 3960 | History log — Processing Fee | Audit log — Processing Fee | 200 | re-GET 200 MATCH | 2026-07-20 08:16:20Z |

**Local mirrors updated same run:** `testrail-id-map.csv` section names (7 rows: FD-HIST-001..007); `cases/group-B-customer-admin-finance.json` `area` fields (7 cases, 1:1 with live sections); deliverables regenerated (`gen_import.py` → testrail-import CSV/XLSX; `gen_blockers.py` → Blockers Tracker). FD-HIST-008's section/area ("History log — edit entry") intentionally unchanged.
