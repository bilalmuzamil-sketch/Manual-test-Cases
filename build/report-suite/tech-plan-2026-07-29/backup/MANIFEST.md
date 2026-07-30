# Tech-plan reconciliation — pre-edit backups MANIFEST (2026-07-30)

Verbatim pre-edit bodies for the 7 cases edited by
`tech-plan-2026-07-29/apply_tech_plan_2026-07-30.py` (per TECH-PLAN-DELTAS.md §2).
To recover a case: replace its object in the owning `cases/*.json` file with the backup body,
regenerate the import + splits (`gen_import.py`, re-merge id-map C-ids), and — if the edit was
already pushed to TestRail — queue an authorized `update_case` restoring the backup fields.

| Backup file | Case | C-id | TestRail link | Edit applied |
|---|---|---|---|---|
| WIP-API-01_C30528_pre-edit.json | WIP-API-01 | C30528 | https://shopview.testrail.io/index.php?/cases/view/30528 | + step 4, + expected 3 (re-run replaces the date's rows), spec_ref/notes tech-plan anchors |
| SBR-STAT-02_C30209_pre-edit.json | SBR-STAT-02 | C30209 | https://shopview.testrail.io/index.php?/cases/view/30209 | + precondition 2 (deposit-covered prepaid seeding), notes deposit warning |
| SBR-BADGE-01_C30226_pre-edit.json | SBR-BADGE-01 | C30226 | https://shopview.testrail.io/index.php?/cases/view/30226 | notes-only (deposit-covered prepaid badge failure to watch) |
| PV-CALC-07_C30365_pre-edit.json | PV-CALC-07 | C30365 | https://shopview.testrail.io/index.php?/cases/view/30365 | + precondition 4, + step 3, + expected 5 (Last Sale re-anchors on reversal), spec_ref/notes anchors |
| SBC-API-02_C30191_pre-edit.json | SBC-API-02 | C30191 | https://shopview.testrail.io/index.php?/cases/view/30191 | + step 3, + expected 4 (unknown sort column safely refused/ignored), spec_ref anchor |
| WIP-FLT-05_C30502_pre-edit.json | WIP-FLT-05 | C30502 | https://shopview.testrail.io/index.php?/cases/view/30502 | notes-only (created date = start date seeding aid) — NO tester-facing change |
| IV-EXP-07_C30593_pre-edit.json | IV-EXP-07 | C30593 | https://shopview.testrail.io/index.php?/cases/view/30593 | title trimmed (pending-confirmation clause dropped), notes rewritten (cap 10,000 locked by Chris per plan) |

New cases (no backups needed — additions, blank C-ids until an authorized add_case):
PV-EXP-11, TU-EXP-09, WIP-CALC-10, IV-DATE-09, SBR-CALC-09.
