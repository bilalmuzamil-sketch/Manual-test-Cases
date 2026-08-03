# TestRail execution log — Report Suite, groups C + D, 2026-08-03

**Status: EXECUTED.** Authorised by the QA lead 2026-08-03, verbatim: *"I want the report suite now at the stage where the only remaining part left is the VIU and things related to VIU. So make sure nothing is left"* — read with his ruling *"Yes all the reports will be gated by ONE permission FOR NOW."*

**Executor:** `exec_push_CD_2026-08-03.mjs`. **Machine log:** `cd-snapshot-2026-08-03/ops-log.json`. **Per-case before/after bodies:** `cd-snapshot-2026-08-03/C<id>-BEFORE.json` / `-AFTER.json`. **Plan:** `staged-case-plan-CDE-2026-08-03.md`.

**GROUP E WAS NOT EXECUTED** — C30327 and C30391 are named in the executor's `FORBIDDEN` list and it would have aborted had they been passed. **SV-8780 was NOT touched** (QA lead: *"Ignore this ticket."*). **No run write** — `update_case` changes no run selection.

## Source currency (Rule 31) — established live BEFORE the writes

All five non-SBC specs re-checked live by CQL on 2026-08-03: **SBR 585629698 · PV 620888066 · TU 641400833 · WIP 703660034 · IV 720142338 — every one still `lastModified Jul 29 2026`**, i.e. identical to our 2026-07-31 captures, so those captures are CURRENT. **Verified verbatim that the per-area permission text still stands** and Chris still owes the edit:

- **PV S1-R4:** *"Both loading the report and exporting it require the **Inventory Reports → View** permission."* (and S1-N2 describes the has-section-but-not-the-permission state)
- **IV Story 1 prerequisite:** *"The user must have the permission that grants access to the inventory reports (the report reuses the existing inventory-reports permission — it adds no new permission)."*
- **TU Story 1 prerequisite:** *"The user must have the permission that grants access to the timesheet reports (the same permission that controls the existing Timesheet Activities report…)."*
- **WIP Story 1 prerequisite:** *"The user must have the permission that grants access to Work In Progress reports."*

**We follow the RULING, not the stale text** (Rules 32/33), and every `refs` below records that the spec edit is owed — so the next reader sees a tracked debt, not a contradiction.

## Operations — 10 writes, 10 verified

| # | Group | Internal ID | C-id | HTTP | Re-GET | Verified | Fields written | Title len | refs len |
|---|---|---|---|---|---|---|---|---|---|
| 1 | C | PV-PERM-01 | [C30325](https://shopview.testrail.io/index.php?/cases/view/30325) | **200** | 200 | **yes-MATCH** | see per-case detail | 69 | 199 |
| 2 | C | IV-PERM-01 | [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | **200** | 200 | **yes-MATCH** | see per-case detail | 60 | 234 |
| 3 | C | IV-PERM-02 | [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | **200** | 200 | **yes-MATCH** | see per-case detail | 68 | 143 |
| 4 | C | TU-NAV-07 | [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | **200** | 200 | **yes-MATCH** | see per-case detail | 55 | 222 |
| 5 | C | WIP-PERM-01 | [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) | **200** | 200 | **yes-MATCH** | see per-case detail | 71 | 241 |
| 6 | C | WIP-PERM-02 | [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | **200** | 200 | **yes-MATCH** | see per-case detail | 69 | 144 |
| 7 | D | PV-NAV-01 | [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | **200** | 200 | **yes-MATCH** | see per-case detail | 74 | 222 |
| 8 | D | IV-NAV-01 | [C30534](https://shopview.testrail.io/index.php?/cases/view/30534) | **200** | 200 | **yes-MATCH** | see per-case detail | 71 | 144 |
| 9 | D | TU-NAV-01 | [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) | **200** | 200 | **yes-MATCH** | see per-case detail | 74 | 218 |
| 10 | D | WIP-TAB-01 | [C30451](https://shopview.testrail.io/index.php?/cases/view/30451) | **200** | 200 | **yes-MATCH** | see per-case detail | 78 | 215 |

**Every row: `steps_unchanged = true`, `section_unchanged = true`.** Group C wrote title + preconditions + expected + refs; group D wrote preconditions + refs only (titles, steps and every expected result untouched).

## Rule 41 — whole case re-verified, per case

| Internal ID | C-id | Re-verified whole against | Second finding |
|---|---|---|---|
| PV-PERM-01 | C30325 | PV spec v4 (Confluence 620888066; lastModified 2026-07-29; re-checked live 2026-08-03) | None. PV S1-N2 still describes the abolished has-section-but-not-the-permission state — that is exactly what makes C30327 unrunnable (group E). |
| IV-PERM-01 | C30603 | IV spec v3 (Confluence 720142338; lastModified 2026-07-29; re-checked live 2026-08-03) | None. |
| IV-PERM-02 | C30604 | IV spec v3 (Confluence 720142338; lastModified 2026-07-29; re-checked live 2026-08-03) | None. |
| TU-NAV-07 | C30398 | TU spec v5 (Confluence 641400833; lastModified 2026-07-29; re-checked live 2026-08-03) | The old precondition pointed at the permission for **Timesheet Activities**, a different pre-existing report outside this suite. That cross-report coupling is removed by the ruling. |
| WIP-PERM-01 | C30526 | WIP spec v6 (Confluence 703660034; lastModified 2026-07-29; re-checked live 2026-08-03) | None. Its own spec context note already said the report *"reuses one existing reporting permission; it does not add a new one"* — consistent with the ruling. |
| WIP-PERM-02 | C30527 | WIP spec v6 (Confluence 703660034; lastModified 2026-07-29; re-checked live 2026-08-03) | None. |
| PV-NAV-01 | C30322 | PV spec v4 (Confluence 620888066; lastModified 2026-07-29; re-checked live 2026-08-03) | None. Its pre-existing `refs` note about the PV "only report" clash is still valid and was preserved. |
| IV-NAV-01 | C30534 | IV spec v3 (Confluence 720142338; lastModified 2026-07-29; re-checked live 2026-08-03) | None. |
| TU-NAV-01 | C30392 | TU spec v5 (Confluence 641400833; lastModified 2026-07-29; re-checked live 2026-08-03) | None. The nav-anchor assertions are video-sourced, not spec-sourced; preserved verbatim in refs. |
| WIP-TAB-01 | C30451 | WIP spec v6 (Confluence 703660034; lastModified 2026-07-29; re-checked live 2026-08-03) | None. Its S1-R5 browser-page-title assertion was re-read and is unchanged. |

## Run 359 (Rules 34/47)

| Check | Before | After |
|---|---|---|
| Tests | 475 | **475** |
| Result records | 539 | **539** |

No `update_run` was needed or issued. Verified live after the last write.

## Local source + deliverables

| Item | Result |
|---|---|
| Case source | 10 cases patched (title / preconditions / expected / spec_ref / notes) across the PV, IV, TU and WIP files; the "FOR NOW" qualifier and the ruling's source + date recorded in every one |
| `testrail-id-map.csv` | **475 rows · 0 blanks** (475/475 C-ids re-merged) |
| Import | regenerated; **475 data rows**; header byte-identical to the Filters peer; 0 VIU words, 0 flag words, 0 duplicate titles |
| Reconciliation | **local active 475 == live-ours 475 == id-map 475 == import rows 475** (live total 480 = ours 475 + 5 foreign) |

**Foreign cases (Rule 38):** the executor's guard refuses any case whose `created_by != 3`. C38919–C38923 (Vladimir Tomovic) were not read for writing and not touched.

**Secrets:** none. Credentials read at runtime from `/tmp/testrail/creds.json`; staged diff grepped for the password and the account email — 0 hits.

