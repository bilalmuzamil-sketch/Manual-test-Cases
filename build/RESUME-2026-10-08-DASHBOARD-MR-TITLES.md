# Resume point — 8 October 2026 (branch `claude/slack-session-setup-7v5itm`)

State saved at the QA lead's request ("Save the state"). Nothing is in flight. No background job is running and the
tree is pushed. The next task has not been given yet.

## Done in this session (6–7 Oct 2026)
| Work | Result | Where |
|---|---|---|
| Maintenance Reminders (Chunk 1 group 19397 · Chunk 2 group 26635) | Source update, runnability fixes (42), plain-language titles (204), C204150 tester-created orgs | `build/maintenance-reminder-v2/` (source-update-2026-10-06, runnability-fix-2026-10-06, title-fix-2026-10-07) |
| Three-week title sweep (Rule 117 amendment, PERMANENT) | 765 titles made tester-readable | `build/title-sweep-2026-10-07/` |
| **Dashboard v1 full update** (group 12166) | 61 of ours rewritten in full + 36 new (C351704–C351739); 97/97 read back; 97/97 display OK; 146/146 PRD v42 anchors quoted; design canvas driven 437/437 elements, 50/50 boards | `build/dashboards/full-update-2026-10-07/FULL-UPDATE-2026-10-07.md`, `design-drive/DESIGN-COVERAGE-2026-10-07.md` |
| Dashboard run 525 | 65 → 101 tests (36 new added, all kept) | `build/dashboards/full-update-2026-10-07/applied/run525-sync.json` |
| New rules | **122** never work in DELTA mode · **123** keep runs in step with the cases; ask before editing anyone else's cases | `build/rules/RULES-61-96.md` (end), CLAUDE.md critical core |
| Lessons | L12 never delete cookies · L13 testers create organizations · L14 opening claude.ai design links | `build/LESSONS-2026-10-01-VERIFY-AND-TRAVERSE.md` |

## QA lead decisions on record (7 Oct 2026)
- Vladimir note for the 5 Automated Dashboard cases: **not needed this time**.
- Vladimir's 4 Dashboard cases (C137997, C137998, C137999, C327128): **leave them**.
- Dashboard PO questions D-1..D-10 for Chris Ward: **send after build verification** (register, "2026-10-07 — Dashboard v1 full update").
- Maintenance Reminders questions MR-1..MR-5: held for the build verification session.
- Build verification of both projects belongs to the **build verification session** (L7).

## Where to resume each project
- Dashboards: `build/dashboards/PROJECT-STATE.md` (🟢 CURRENT STATE block at the top).
- Maintenance Reminders: `build/maintenance-reminder-v2/` + `BUILD-VERIFICATION-HANDOVER-2026-10-06.md`.
- Everything waiting on someone: `build/OUTSTANDING-ITEMS-REGISTER.md` (last two sections).

## Facts worth keeping
- A GitHub push can fail for a few minutes with "Internal Server Error" while fetch still works; it cleared after
  ~2.5 minutes of retries (7 Oct 2026). Retry with a backoff loop; the GitHub write API is not open to this session.
- `pgrep -f <name>` also matches a shell loop whose own text contains `<name>`; check for the real process with the
  interpreter in the pattern (e.g. `pgrep -af "python3 build/testing-tools/drive_design_full"`).

## Update — 8 Oct 2026, WO Board & Tech View full update DONE
- 170 of ours (130 rewritten in full + 40 new), run 498 = 170, all 221 PRD requirements quoted, design driven in full
  (`build/wo-board-tech-view/source-update-2026-10-08/DESIGN-COVERAGE-2026-10-08.md`). Handed to the build verification
  session by the QA lead; that session also re-checks questions W-1..W-16 before any go to the PO.
- New tool: `build/testing-tools/crawl_design_states.py` (stateful design crawl). New lesson: L15 (Claude Design links).
- Nothing in flight. Waiting for the next task.
