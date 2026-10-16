# SV-11398 — moved time entry adds a "Deleted user" to the receiving line (staging retest, 16 Oct 2026)

**Asked by:** QA lead ("Can you test this on staging"), after Chris Ward's comment 78879: retest on v26.40.18 with a fresh work order; if it passes close as a duplicate of SV-11087, else tell him. QA lead's answers: recording **yes**, technical section **no**, **comment only** (no status change). Also asked: post the result on TestRail test 3792498 (C368177, run 498).

**Environment:** staging `app.staging.shopview.com`, build **v26.40.19-edc8195** (`index.html` last-modified Fri 16 Oct 2026 14:51:30 GMT, etag `W/"a0f6184ca4084b224b063d638dd01fcb"`). **Staging redeployed during the pass:** the first marker read (before any test) was v26.40.19-fb345ed (last-modified 14:04:10 GMT); every check below ran 15:09–15:35 UTC, after the 14:51:30 deploy, so all results are on edc8195 — caught by the pre-post gate re-read and the comment corrected before posting, location Staging Heavy Duty - 9919. Admin quick-login; Tech quick-login = **Tech ShopView** (role Technician, 6 template permissions — not changed).

**Sources:** ticket description (steps: start on line 1, clock out, Timesheets → pencil → Line 2 → Save, reload, read line 2 Labor); Chris 78879; SV-11087 (Ready for Production) developer test list (comment 78675) and Ahtasham's pass (78690); test case C368177.

**What "Deleted user" was:** an empty labor row (`tech_assigned_id: null`, `tech_exists: false`) left on the receiving line next to the technician; the Lines tab draws it as "Deleted user". The old example S2-35973 still has it (seen today on v26.40.19) — row made 15 Oct before the fix; SV-11087 78675: "Rows that existed before the fix count as deliberate and are never removed."

## Variant matrix (every cell observed on screen after a reload; data cross-checked)

| # | Variant | Work order | Result |
|---|---|---|---|
| M1 | Admin starts on line 1 (claims its empty row), clocks out, entry moved to line 2 via Timesheets | S2-36623 | PASS — line 1 Unassigned, line 2 [Admin ShopView] only |
| M2 | Same entry moved back to line 1 | S2-36623 | PASS — exactly as before, no extra rows |
| M3 | Technician already has time on line 2 (claimed its row), line 1's entry moved there | S2-36623 | PASS — line 2 one Admin ShopView row, 0.05+0.02 = 0.07 h; line 1 Unassigned |
| M4 | Receiving line's only row is unassigned | (covered in M1/M5/M6) | PASS — the technician takes that row |
| M5 | Ticket's exact flow with a real technician (Tech ShopView signs in, Start/Stop/Clock Out on line 1), Admin moves entry to line 2 | S2-36625, S2-36626 (recorded) | PASS ×2 — line 2 [Tech ShopView] only, line 1 Unassigned |
| M6 | Move made from Reports → Timesheet Activities (line 2 → line 1) | S2-36625 | PASS — line 1 [Tech ShopView] only, line 2 Unassigned; report row shows the new line |
| M7 | Old example S2-35973 on the new build | S2-35973 | Still shows "Deleted user" (pre-fix row kept, by design per SV-11087) |
| Walk | Comment's "How to see it" steps walked live as written | S2-36628 | PASS — line 2 [Admin ShopView] only |

Reader's work order left ready (two approved lines, nobody on them): **S2-36629**. An extra empty work order was created by a failed script run (test data, left in place).

Every save: `POST /api/technician-tasks/change` → 201. Labor read from the screen rows (`tr.wo-table-row`, 4 cells admin / 3 cells tech view) and from `GET /api/work-orders/lines/{id}` tasks.

## Verdict
**PASSED** on staging v26.40.19-edc8195 — all cells pass on fresh work orders.

## Recording (Rule 104 yes; Rule 107)
Tech half 134.4 s → 24.1 s, Admin half 74.2 s → 23.2 s; joined 47.3 s, 0.91 MB, clean decode, frame grid checked (captions correct, every step present). While filming, the first cut kept a minute of waiting because the clock-in timer in the top bar ticks and webm speckle counted as movement — `finish_recording.py` now ignores the top bar and uses n=0.006, hold 1.5 s.

## Pre-post gate (16 Oct 2026, 15:39 UTC)
- Build marker re-read live: **moved** fb345ed → edc8195 (deploy 14:51:30 GMT). All checks ran 15:09–15:35 UTC, after the deploy → comment, exhibit title and recording caption corrected to edc8195 before posting.
- Ticket re-read live: Open, Medium, only Chris's 78879 since filing.
- Steps walked live as written (S2-36628) after the deploy; reader's work order S2-36629 left ready. Image sizes recomputed from files. Voice scan clean. No technical section (QA lead: no). Recording yes (QA lead: yes).
- Posted as comment **78897**; read back: 4 media `type:file` in order (3 images at their sizes + the MP4), 7 table rows (header + 6), first text "OVERALL QA STATUS: PASSED", Chris mentioned. Video stored 1280×183, same as the earlier SV-10142 recording embed.

## Learning check
- Staging can redeploy mid-pass with no notice: the gate's marker re-read caught it and the build name was corrected before posting (Rule 72(1) worked as designed).
- Recordings: the ticking clock-in timer and webm speckle defeated the idle cut — fixed in `finish_recording.py` (Rule 107 tuning, committed).
- Reading Labor rows: the Lines tab draws the empty row ("Deleted user") without a `line_labor_name_` id, and the technician view has 3 cells instead of 4 — recorded in playbook §AT.

## Follow-up (16 Oct 2026, ~16:25 UTC) — QA lead: close as duplicate if correct, log on TestRail, link the run
- **TestRail:** run 498 (ours, created_by Bilal), test 3792498 = C368177. Snapshot of all 1,144 run results before; `add_result` Passed → **result 525350**; 4 attachments (3 annotated PNGs + MP4) added to it. After: 1,145 results, **0 missing, 0 changed by id**, the only new one is 525350. Text: `testrail-result-3792498.md`.
- **Jira SV-11398:** Duplicate link added and read back as "SV-11398 duplicates SV-11087" (the existing Relates link kept); two web links to the TestRail test and run; comment 78897 gained a "TestRail" section with a dated note (11:23 CDT), read back (4 file media intact, first line unchanged); transitioned **Close → OBSOLETE, resolution Done** (the only closing transition offered; it has no fields). Chris's 78879 asked for exactly this if the retest passed.
- **SV-11394:** assignee → Slavcho Mitrov (read back).
- Learning check: nothing new beyond the voice-over ask order (Rule 104 amendment).
