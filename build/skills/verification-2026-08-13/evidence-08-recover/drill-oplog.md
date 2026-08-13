# Cold-run drill of skill 08 (RECOVER) — oplog

Forensic drill against the REAL kill of 2026-08-12 (`build/filters/finish5-2026-08-12/`), run
2026-08-13 as if no recovery existed. **Read-only pass: TestRail `get_*` only · 0 Jira calls ·
0 app access · 0 TestRail writes · 0 run writes.** Inputs restricted to
`build/skills/00-COMMON-CORE.md` + `08-RECOVER.md`; every reach outside them is logged as a
cold-start defect in `../08-RECOVER-VERDICT.md`.

| UTC | Op | Result |
|---|---|---|
| 07:41 | `git fetch origin claude/slack-session-0sxnd9` + `merge --ff-only` (skill step 1) | Already up to date — **landed on `bfb72066`**, recorded per step 1 |
| 07:41 | Read `00-COMMON-CORE.md` + `08-RECOVER.md` in full | the only permitted inputs |
| 07:42 | Step 2 — pass folder + oplog as hypothesis: read `finish5-2026-08-12/RESUME.md`, `testrail-execution-log.md`; `git log` on the folder | Kill timeline: killed worker's last commit `649224f4` 17:09:34Z; real recovery began `c82afbe8` 17:50:40Z. **At kill time the folder held only `evidence/` + `tools/` — no oplog file existed** (skill's no-oplog path: rebuild from git history + live suite) |
| 07:43 | Step 3 — `/tmp` sweep | **The killed pass's `/tmp` artefacts are GONE** (`/tmp/testrail/f5/`, `/tmp/r2.log`, `/tmp/q*.log` all absent). Current `/tmp/testrail/` holds a different worker's 2026-08-13 Report Suite snapshots. Loss recorded in the verdict |
| 07:43 | Located TestRail credentials | **NOT named in either skill file — cold-start defect D1 (RECURRING: the 05-drill logged the same defect this morning and no fix landed).** Found `/tmp/testrail/creds.json` via the prior drill's oplog |
| 07:44:47 | Step 4 — live derivation, all paged `&`-only per core §3.3: `get_sections` (626), `get_cases`, `get_case` ×9, `get_run/352`, `get_tests/352`, `get_results_for_run/352` | all HTTP 200; results in `live-derivation.json` (trimmed, secret-free) and the verdict |
| 07:45 | Later-pass interference check | `git log` since finish5: only Report Suite TestRail writes (`bfb72066`) and read-only passes — **no Filters TestRail write after finish5**, so live Filters content is attributable to the recovery |
| 07:46 | §2.4 invariant census on the 4 touched cases | exactly one `Last checked against`, one provenance sentence, one `AUTOMATION:` marker each; 0 raw markup |
| — | TestRail writes / Jira calls / app requests | **ZERO** |

Key live figures (read 2026-08-13 07:44:47Z): Filters ours **115** / live **120** (foreign five
C43576–C43580, `created_by` 7, expected results empty, `updated_on` 2026-08-10 — predates the pass);
markers **90 READY · 7 EXPECT-FAIL · 18 HOLD · 0 unmarked**; build stamps **74 `v3.7-20e801b` ·
23 `v3.4.2-d00239b` · 12 `v3.6-3e9dd6d` · 6 none**; run 352 `include_all=false`, **120 tests**,
case-id sets equal both ways vs the suite, **648 results**, 81P/8F/4B/27U/0R.
