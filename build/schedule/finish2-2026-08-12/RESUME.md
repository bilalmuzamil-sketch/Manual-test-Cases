# Schedule finish2 — resume point, 2026-08-12

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285ffcf50626363a578fe273071` ·
`index.html` sha256 `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` ·
read at **2026-08-12T07:11:17Z**. Re-read it before trusting anything below.

## WHERE THIS STANDS

IN FLIGHT — the runnability walk of the ~142 cases nobody has walked.

| | |
|---|---|
| Cases (live, group 4254) | **176** · markers READY **143** · EXPECT-FAIL **4** · HOLD **29** · gate closes both ways at **147** |
| Build line naming `v3.5-65d6500` | **76 of 176** (42 name `v3.5-d122eef`, 56 name `v3.5-7ec992f`, 2 name none) |
| Walked before this pass | **34** |
| Walked THIS pass | see `RUNNABILITY.md` — the running figure is kept there |
| TestRail writes this pass | see `testrail-execution-log.md` |
| Run 357 | not touched; no `update_run`, no result written |

## RE-RUN RECIPE

```
cd build/schedule/finish2-2026-08-12/tools
node harness_admin.cjs <tag> /schedule    # administrator, bundle-accurate hydration
node harvest_ids.cjs                      # every data-test-id on the page
node walk_b1.cjs                          # batch 1  -> evidence/walk_b1.json
node walk_b1fix.cjs                       # re-drives batch 1's four faulty CHECKS
```

Each probe writes its result file **after every case** and prints its **non-GET call list at exit**.

## TRAPS CARRIED FORWARD — READ BEFORE WRITING A PROBE

1. **`button_shift_detail_delete` destroys a non-series shift on the first click, no confirmation.**
   Two workers have lost a shift to it in two days.
2. **`.schedule-lane` elements are 199 px wide — the technician LABEL column, not the grid.**
   Click at 35–80 % of the calendar width to reach a cell.
3. **`PUT /api/roles/{id}` with snake_case names returns 200 and silently ignores removals.**
4. **Editing a role definition kills every holder's session, one way.** Do not touch roles or staff.
5. **There are THREE search inputs.** `select_global_search`, `input_sidebar_search` and
   `input_schedule_search`. A `/search/i` match lands on the wrong one — batch 1 made that mistake
   and had to re-drive C30041.
