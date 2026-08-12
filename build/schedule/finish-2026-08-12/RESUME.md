# Schedule finish pass — resume point, 2026-08-12

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285…` ·
sha256 `9348ca09…`. **Re-read it before trusting anything below.**

## WHERE THIS STANDS

| | |
|---|---|
| Cases | **176** · markers **READY 143 · EXPECT-FAIL 4 · HOLD 29** · gate closes both ways at **147** |
| Build line names the running build | **76 of 176** |
| **Steps actually carried out** | **19 this pass**; **45–47 of 176** counting every pass on this build |
| TestRail writes | **3 `update_case`**, all HTTP 200 + byte-verified, 30 fields each, 0 mismatches |
| add / delete / section / run / result | **0** · Jira creates **0** · `custom_atmstatus` never sent |
| Run 357 | **untouched, proven by content** — 176 tests, 529 results all present by id, 0 changes |

## SESSIONS

- **Administrator — ALIVE** (`/tmp/qa-cookies/sched-admin.txt`, mode 600).
- **Technician — DEAD.** Lost to a role-definition edit; a permission change invalidates the holder's
  session one way and it does not return when the permissions are put back. `DIVERGENCES.md` §A.

## THE NEXT THING TO DO, IN ORDER

1. **Keep walking steps.** ~129 cases have had labels checked but steps not carried out. The method
   works and is cheap: add a block to `tools/probe_walk.cjs`, one per case, recording what each step
   did and what was seen. Its output is `evidence/walk.json`.
2. **Reach two surfaces that were not reached** — Settings → Locations → the pencil, for
   `Set business hours for this shop` (C38847); and a role's own edit screen for `Reset to template`
   (C38926). Neither was recorded as absent.
3. **Seed an unassigned shift and re-drive C29931**, and re-drive C29942's badge cleanly — both are
   inconclusive today and both are one probe away. Seeding is cheap now that data need not be restored.
4. **Answer C43554 from a session that has never touched the view control** — today's result is
   confounded by an earlier probe in the same session.
5. **Ask for the three permission users** — `COMPLETION-REPORT.md` item 2. Configure first, mint the
   cookies second, or they arrive dead.

## RE-RUN RECIPE

```
node tools/harness_admin.cjs   <tag> /schedule    # administrator, hydrated bundle-accurately
node tools/probe_harvest.cjs                      # 10 surfaces, visible strings + test ids
node tools/probe_surfaces2.cjs                    # toolbar menus, sidebar, conflicts
node tools/probe_gaps2.cjs                        # filters panel, staff hours dialog, roles
node tools/probe_cell.cjs                         # the empty-cell menu, with correct geometry
node tools/probe_walk.cjs                         # carry out case steps, one block per case
node tools/probe_walk2.cjs                        # batch 2 -- nav, grid, mini calendar, sidebar
python3 tools/runnability.py                      # label check across all 176
python3 tools/exec_labels.py                      # the TestRail label corrections
python3 tools/role_tool.py snapshot|set|restore|show
```

Every probe writes its per-operation log after every operation and prints its **non-GET call list at
exit** — that list is how "nothing was written" stops being an assertion.

## THREE TRAPS THAT COST TIME TODAY — DO NOT REPEAT THEM

1. **`button_shift_detail_delete` destroys a non-series shift on the first click, with no
   confirmation.** It was written down in `drag-retry-2026-08-12/INCIDENT-accidental-delete-2026-08-12.md`
   before I started and I had not read it. **Read this project's incident reports before writing a
   probe that clicks anything destructive.**
2. **The `.schedule-lane` elements are 199 px wide — that is the technician LABEL column, not the
   grid.** Clicking them opens nothing, which reads exactly like "the cell menu does not exist". It
   does; click at 35–80 % of the calendar's width.
3. **`PUT /api/roles/{id}` with snake_case field names returns HTTP 200 and silently ignores
   removals.** The screen sends `fePermissions` / `viewMode` / `crossToggles`. A restore that reports
   success and changes nothing is only caught by comparing the read-back field by field.

## ENVIRONMENT

**Roles restored** — Technician byte-identical, 10 fields, 0 mismatches; the `ZZAUTOTEST probe` role
deleted and proven gone. **Data not restored, per the QA lead's instruction**, except one shift a
probe deleted, recreated field-identical before that instruction arrived.
**`admin@shopview.com` never edited.** **`quick-login` and `switch-user` never called.**
