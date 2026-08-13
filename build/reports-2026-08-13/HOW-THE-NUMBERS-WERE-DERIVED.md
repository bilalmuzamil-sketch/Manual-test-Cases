# How the numbers in the two 2026-08-13 completion reports were derived

Read time for every figure: **2026-08-13 07:44:58 UTC** (stamped by the script itself). Script:
`build/reports-2026-08-13/derive_live.py` · raw output: `live-derivation.json` (same folder).
Read-only throughout — TestRail `get_*` only, zero Jira calls, zero application requests, zero writes.

| Figure | How it was derived |
|---|---|
| Total (ours / live) | full paged `get_sections/1&suite_id=1` (626 sections — an unpaged call returns 250 and silently finds nothing, core §3.3) → subtree of group 4110 (Filters) / 4254 (Schedule) → full paged `get_cases/1&suite_id=1` (4099) filtered to those sections. "Ours" = `created_by == 3`; every other author counted and listed as foreign |
| Source-verified | regex over each of our cases' `custom_expected`: BOTH a "read on <date>" read-date AND a spec version pin ("… specification (at Confluence) version N") present. Counted per distinct pin and per distinct read-date |
| Build-verified split | provenance sentence 2, `last checked against (the) build <marker> on <date>` — counted per distinct (marker, date); "most recent build named in the suite" = the marker with the newest check date. The running build itself was NOT read (no session) and the reports say so |
| Steps-walked | NOT independently derivable from TestRail (cold-start defect D5, see the verdict file). Reported as the §14.2-based upper bound: stamps dated on/after 2026-08-12, when sentence 2 began recording the full runnability walk |
| Runnable / held | last `AUTOMATION:` marker in `custom_expected` per case; gate printed both ways (READY + EXPECT-FAIL vs total − HOLD) |
| Created / updated / deleted | this pass performed zero writes — 0/0/0 by construction |
| Run sync | `get_run/{352,357}` + fully paged `get_tests` — run `case_id` set vs live suite-subtree set, set difference in BOTH directions (both empty ⇒ in sync); `include_all` read from the run record |
| Grading | per-test `status_id` mapped through a live `get_statuses` read (nothing transcribed from memory); tallies gated against the run record's own `*_count` fields and against the test total |
| Set equality | live-ours vs `build/<project>/testrail-id-map.csv` C-ids (both directions, 0 blanks) vs `testrail-import/<project>-v1-testrail-import.csv` row count vs local case bodies (active = `viu_status`/`status` not marked "Retired") |

Cross-check: a predecessor run of the same derivation at 2026-08-13 05:58:41 UTC (killed by a usage
limit before writing the reports; its oplog is in `build/skills/verification-2026-08-13/`) produced
identical figures on every measure — nothing moved between the two reads.

URL note: every API path was built with `&` separators only (`get_cases/1&suite_id=1&limit=250&offset=N`)
per core §3.3 — a second `?` inside the `index.php?` path returns HTTP 400.
