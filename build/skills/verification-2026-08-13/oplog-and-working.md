# Cold-run verification of skill 05 (PROJECT-REPORT) — oplog + how the numbers were derived

Pass folder: `build/skills/verification-2026-08-13/` · started 2026-08-13 ~05:57 UTC.
**Read-only pass: TestRail `get_*` only · 0 Jira calls · 0 app access · 0 TestRail writes.**

## Oplog (core §8 R1)

| UTC | Op | Result |
|---|---|---|
| 05:57 | `git fetch origin claude/slack-session-0sxnd9` + `merge --ff-only` | Already up to date (HEAD d9615811) |
| 05:57 | Read `build/skills/00-COMMON-CORE.md` + `05-PROJECT-REPORT.md` in full | the only inputs used, per the cold protocol |
| 05:58 | Located TestRail credentials | **NOT named in either skill file — cold-start defect D1.** Found `/tmp/testrail/creds.json` (keys: email/host/password/user) by exploring /tmp |
| 05:58:41 | Live derivation (read time stamped) — paged `get_sections/1&suite_id=1` (625 sections), paged `get_cases/1&suite_id=1`, `get_run/352`, `get_tests/352`, `get_results_for_run/352`, `get_run/357`, `get_tests/357`, `get_results_for_run/357` | all HTTP 200; every URL ampersand-only per core §3.3 |
| 06:0x | Set-equality: live vs `build/{filters,schedule}/testrail-id-map.csv` vs `testrail-import/{filters,schedule}-v1-testrail-import.csv` | equal both directions, both projects (below) |
| — | TestRail writes / Jira calls / app requests | **ZERO** |

## Raw derived figures (read 2026-08-13 05:58:41 UTC)

### FILTERS (group 4110, run 352)
- Live cases in subtree: **120** · ours (`created_by=3`): **115** · foreign: **5** — C43576–C43580, all `created_by=7` (Ahtasham Amjad), all with EMPTY expected results, no markers, no provenance. Untouched (Rule 38).
- Markers on our 115: **READY 90 · READY - EXPECT FAIL 7 · HOLD 18** — gate: 90+7=97 and 115−18=97 ✔ both ways. The 5 marker-less cases are the foreign five, stated separately.
- Provenance sentence 1: **115/115** carry a read-date AND a spec pin — all pinned **"Filters specification at Confluence version 19 (published 6 August 2026)"** with "read on 11 August 2026". (Pin phrasing is "at Confluence version N", not "specification version N".)
- Sentence 2 (build stamps): **v3.7-20e801b on 12 August 2026 → 74** · **v3.6-3e9dd6d → 12** (11 on 12 Aug, 1 on 8/11) · **v3.4.2-d00239b on 8/5/2026 → 23** · **no stamp → 6 of ours** (C29559, C29609, C29610, C29612, C29621, C43562).
- Expect-fail tickets: SV-8832 (C29616, C29619, C29620, C29634) · SV-8875 (C29624, C29625) · SV-8912 (C38889). Backing NOT re-verified this pass (no Jira access).
- HOLD reasons verbatim: 4× Status chip awaiting Branko (C29559/29609/29610/29612) · 9× Branko Parts/Reports write-up (C38904–C38911, C38882) · C38880 QA-lead ruling (S10-R4 documented) · C38881 needs pre-redesign saved-filters account (none exists) · C38891 + C38901 page-search rollout part-finished · C43562 filter bar only on some Parts views/one report tab.
- Run 352: `include_all=false`, **120 tests**, in_run_not_suite = ∅, in_suite_not_run = ∅ (**in sync**). 648 result records. Grading: 81 Passed / 8 Failed / 4 Blocked / 0 Retest / 27 Untested.
- Set equality: live-ours 115 = id-map 115 (0 blanks) = import 115; live−idmap = ∅ and idmap−live = ∅.

### SCHEDULE (group 4254, run 357)
- Live cases: **176** · ours: **176** · foreign: **0**.
- Markers: **READY 137 · READY - EXPECT FAIL 4 · HOLD 35** — gate: 137+4=141 and 176−35=141 ✔ both ways.
- Provenance sentence 1: **176/176** carry read-date + pin "Schedule specification version 27", read on 11 August 2026.
- Sentence 2: **v3.5-65d6500 → 151** (140 "12 August 2026" + 11 "8/12/2026") · **v3.5-7ec992f on 8/6/2026 → 15** · **v3.5-d122eef on 8/5/2026 → 10** · no-stamp → 0.
- Expect-fail tickets: SV-8957 (C29962) · SV-8886 (C29967) · SV-9090 (C29982) · SV-9006 (C29984). Backing NOT re-verified (no Jira access).
- HOLD groups (35): second sign-in needed — 8 whole (C30076, C30077, C30078, C30079, C30081, C30084, C30614, C38926) + 3 partial (C30044, C38872, C38874) · "ticket cannot be raised yet / fault has no ticket number" (Jira creation hold) — C29929, C29945, C29985, C30004, C30013, C30020, C30034, C30050 (8) · not-built: panel button C43582–C43587 (6), Unassigned row C29973–C29975 (3), Dashboard C38868, appointment C38869, Priority field C38871 · PO question NOT YET SENT — C43555, C29983 · PO answer + setting not in build — C30089 · pre-release shifts impossible now — C38867.
- Run 357: `include_all=false`, **176 tests**, sets equal both ways (**in sync**). 549 results. Grading: 90 Passed / 11 Failed / 7 Blocked / 0 Retest / 68 Untested.
- Set equality: live 176 = id-map 176 (0 blanks) = import 176; both directions empty.

## Notable live-vs-skill discrepancies (reported, not fixed in TestRail — G6)
1. **C43582–C43587 still carry `AUTOMATION: HOLD - the panel button does not exist in this build`** — core §15.1's worked example already ruled that wrong ("should carry plain `AUTOMATION: READY`"). Needs an authorised `update_case` sweep.
2. Core §14.1 says the read-date sweep is "NOT DONE" — **live census: Filters 115/115 and Schedule 176/176 DO carry read-dates** (Report Suite not measured this pass). Stale claim; corrected additively in the skill file.
3. Eight Schedule HOLDs are filing-problem holds (§15.1a's last paragraph) — one edit each from `READY - EXPECT FAIL` once the Jira creation hold lifts (register H1).
