# TestRail execution log — Filters 12-board design reconciliation, 2026-07-31

**Header: EXECUTED.**

**Authorization.** QA lead, 2026-07-31, verbatim: *"You should get them now and create/update
the test cases accordingly."* Scope limited to what the boards actually justify.

**Executor:** `build/filters/design-2026-07-31/push/exec_push_design12.py`
**Helper:** `build/filters/fixes-2026-07-31/tr.py` (credentials from env only, sourced from
`/tmp/testrail/creds.json` — never committed).
**Scope:** TestRail project **1** / suite **1** / group **4110** (Filters) only.

## Operation totals

| Op | Count | Result |
|---|---|---|
| `update_case` | **9** | all HTTP **200**, all re-GET **MATCH** |
| `add_case` | **0** | category C was empty — nothing to author |
| `add_section` | **0** | — |
| `delete_case` | **0** | — |
| `update_run` / result writes | **0** | no `add_case`, so run 352 needed no union sync |

## Per-case audit

Change in all 9: the unsourced icon-shape word **"funnel"** replaced with **"filter"**.
Driving source: Figma boards `11985:9686` + `12867:12201` (rendered 2026-07-31) pin the
icon layer as `Filter-lines` (three short horizontal lines), and spec v1.6 (2026-07-28)
**S1-R4** names only *"a toggle button"* — it never names an icon shape, so board and spec
do not conflict. Standing Rule 9 (build-accurate wording, never invented).

| Internal ID | Case | Fields written | HTTP | re-GET | Section |
|---|---|---|---|---|---|
| FLT-COLL-01 | C29601 | title, steps, expected | 200 | MATCH | 4118 |
| FLT-COLL-02 | C29602 | preconds, steps | 200 | MATCH | 4118 |
| FLT-COLL-03 | C29603 | preconds, steps | 200 | MATCH | 4118 |
| FLT-COLL-04 | C29604 | title, steps, expected | 200 | MATCH | 4118 |
| FLT-COLL-05 | C29605 | steps | 200 | MATCH | 4118 |
| FLT-MOB-01 | C29621 | expected | 200 | MATCH | 4123 |
| FLT-MOB-09 | C29629 | expected | 200 | MATCH | 4123 |
| FLT-PARTS-01 | C38904 | expected | 200 | MATCH | 5411 |
| FLT-PSRCH-13 | C38903 | steps | 200 | MATCH | 5410 |

Every `update_case` sent the **full** body (title / type_id / priority_id / refs /
custom_preconds / custom_steps / custom_expected / custom_atmstatus:3 /
custom_automation_type:0), then re-GET compared **field by field** against the local
body. `refs` (ticket + spec anchor, Standing Rule 20) was resent unchanged — no case lost
its spec anchor.

## Gates passed before writing

- **Standing Rule 38 — foreign cases.** All 9 `get_case`'d first; every live title matched
  our local internal ID and every `section_id` (4118 / 4123 / 5410 / 5411) sits inside
  Filters group 4110. **0 foreign cases touched.** Snapshots: `pre-push-snapshot/C*.json`.
- **Standing Rule 41 — whole-case re-verification.** Each of the 9 was re-read end to end
  against **spec v1.6 (2026-07-28)** and the rendered boards, not only the changed line.
  Per-case outcomes are tabulated in `../RECONCILIATION-12-2026-07-31.md` §A-1. One check
  **prevented an error**: FLT-MOB-01's scroll-arrow claim looked wrong against the new
  board but was upheld on the board the case actually cites (`11884:20807`).
- **Standing Rules 34/47 — run 352.** Snapshotted before and after: **110 tests, all
  Untested (status_id 3)** both times. Because `add_case` = 0, **no `update_run` was made** —
  the run's case selection was never sent, so no test or result could be dropped.
- **Rule 6 — TestRail is the only production system.** Writes limited to the 9 authorized
  `update_case` calls. No runs, results, sections, or deletions.
- **No secrets committed.** Credentials read from env at runtime; staged diffs grepped with
  `grep -F` for the password and the literal account email before each commit.

## Deliverables regenerated

Case count did **not** change (110 active, no adds/deletes), but two **titles** did
(FLT-COLL-01, FLT-COLL-04), so the import was regenerated:
- `testrail-import/filters-v1-testrail-import.csv` / `.xlsx` — header verified
  **byte-identical** to the pre-run header; 110 rows; VIU-word-free and
  feature-flag-free (`'flag on'`/`'flag off'` occurrences: 0); API cases in
  `API — Work Orders List Filtering` (6).
- `build/filters/testrail-id-map.csv` — `gen_import.py` blanked all 110 C-ids on rerun (the
  known behaviour); **re-merged, 110 rows, 0 blanks**. Diff vs the pre-run map is exactly
  the two intended title strings and nothing else.

## OUTSTANDING

1. **0 cases authored** — category C was empty because spec v1.6 backs none of the new
   board behaviour (notably sorting). If Branko rules sorting in scope, ~6–8 `add_case`
   follow, and **that push WILL need a run-352 union `update_run`** (snapshot `get_tests` +
   `get_results_for_run`, send the FULL union, verify count and every prior result after).
2. **7 mobile cases (C29622–C29628) and FLT-TAB-06 (C38876) are STAGED, unwritten** —
   pending one Branko answer each. See `../RECONCILIATION-12-2026-07-31.md` §B.
3. **FLT-PSRCH-08 (C38898)** keeps its honest "design PNG still pending" note — board
   `11829:8908` did not render this run.
