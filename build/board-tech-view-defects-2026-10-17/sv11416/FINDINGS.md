# SV-11416 — QA result (17 October 2026)

- Verdict: **PASSED** — Jira comment 78930. (Slavcho asked the QA lead to update TestRail case C614711 — not touched by us; TestRail writes need the QA lead.)
- Environment: staging v26.40.19-754919e; Production v26.40.19-d2441a9 (test org) for the List "as today" baseline.
- Spec v64 S3-R20e (Chris option 2, 16 Oct; PRD v59).

## Matrix
| Check | Evidence |
|---|---|
| Board column "Deleted technician", Inactive badge, no grip (normal columns have `board_column_drag_handle_<id>`) | s16g colInfo, x16 |
| Tech group `tech_view_group_deleted`, Inactive badge, no grip | s16k, x16, film |
| Two different deleted leads (ffa7f73c on S2-35709, fd8540bf on S2-36641) → one column, one group, "2 work orders" | x16b |
| Drop-in refused — Board (S2-35251 from Unassigned, no write, lead unchanged) | s16g |
| Drop-in refused — Tech (S2-35251 from Pia Pills group, no write, lead unchanged) | film VR16 |
| Drag-out Board → Unassigned: `board-move {technicianId:null}` 200, toast "Lead technician removed" | s16g, film |
| Drag-out Tech → Pia Pills: board-move 200, toast "Lead technician updated", group gone when empty | s16m |
| List cell "Unassigned" (staging S2-35709/S2-36641) = Production after deleting S2-968's lead ("ZZAUTOTEST Deleted Lead 11006" → "Unassigned") | s16l, p16k, p16l |

**Spec wording note for the QA lead:** S3-R20e says the List shows the lead "as blank … as today"; today (Production) the cell reads "Unassigned". Staging matches Production, so this was passed on "as today"; raised in the chat report in case Chris wants the word "blank" corrected.

## Test data left in place (no cleanup per ruling)
- Staging: deleted ZZAUTOTEST technicians 2d26e2a0 (staff), 531676c2, fd8540bf, ffa7f73c (all deleted); S2-35709 and S2-36641 led by deleted technicians (reproduction state); S2-35251 back to Unassigned; S2-35490 back on Esther Howard.
- Production (test org): ZZAUTOTEST "Deleted Lead 46045" (created, still active, workplace Truck Hill 1 — unused) and "Deleted Lead 11006" (deleted); S2-968 now led by the deleted 11006 (List shows "Unassigned").

## Evidence / gate
`ev/` (x16*, p16*, s16*.json, deleted-lead-staff*.json, exhibit, film), `voiceover/` (anchors pinned with `--fix` because two captions were placed at the top). Gate: build marker re-read, ticket TESTING STAGE (last comment Slavcho 16 Oct 11:13), PRD v64, voice scan clean, no technical section, read back 8 table rows + 2 media.

## 2026-10-19
- Row 7 (List cell "Unassigned" vs spec "blank … as today"): QA lead ruled, verbatim: "for this test case consider \"Unassigned\" as the expected behavior, but for this case only". Verdict stays PASSED; a dated note citing the ruling was added to row 7 of comment 78930 (read back OK). No question sent to Chris.
