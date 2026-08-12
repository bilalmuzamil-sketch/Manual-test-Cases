# Schedule finish4 — resume point, 2026-08-12

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag
`3250d285ffcf50626363a578fe273071` · unmoved across this pass. **Re-read it before trusting
anything below.** Location **`Staging Heavy Duty - 9919`**.

## WHERE THIS STANDS

| | |
|---|---|
| Cases (group 4254) | **176**, all ours, no foreign cases |
| Markers | READY **137** · EXPECT-FAIL **4** · HOLD **35** · **gate closes both ways at 141** |
| Naming the running build | **147 of 176** |
| **Preconditions and steps walked** | **142 of 176** — 18 this pass |
| Never walked | **34** (25 already HOLD) → **9 genuinely remaining** |
| TestRail writes | **15 `update_case`**, all HTTP 200 + byte-verified, 0 mismatches |
| add / delete / section / run / result / Jira-create | **0** on every one |
| Run 357 | **untouched, proven by content** — 176 tests, 529 results, 0 missing by id, 0 fields moved |

## READ THESE, IN THIS ORDER

`RECOVERY.md` (what the killed pass had completed, proven by content) → `COMPLETION-REPORT.md`
(the table, and what is left itemised) → `FINDINGS.md` → `DIVERGENCES.md` → `RUNNABILITY.md`
(case by case) → `testrail-execution-log.md` → `CHANGES-MADE.md` → `AUTOMATED-CASES-CHANGED.md`.

## THE NEXT THING TO DO, IN ORDER

1. **Ask the QA lead for one go-ahead** to make a role / staff / settings change on `sv8685`. That
   single answer unblocks **four of the nine**: C29971, C30080, C30083, C38870.
2. **Seed a work order at Staging Lethbridge - 4310**, then schedule a shift on it — that makes
   **C38875** runnable (its board holds 0 shifts today, so there is nothing foreign to request).
3. **Drive one long spread** reaching 1 November — settles **C38863** and **C38865** together.
4. **Repeat the UI spread on a second technician** for **C29986**, and **seed an event beside a
   shift** for **C30615**.
5. **Ask about the three unfiled Story Defects**, chiefly the missing **Unassigned row**.

## SESSIONS

- **Administrator — ALIVE** at the end of this pass. Cookie header at `/tmp/qa-cookies/sched-hdr.txt`,
  mode 600, **never written into the repository**. ~24 h or one deploy from expiry.
- **Technician — DEAD** and unrecoverable. Lost to a role-definition edit on 12 August; a permission
  change invalidates every holder's session **one way**. **Do not edit a role, a staff record or a
  setting** while a session matters.

## RE-RUN RECIPE

```
cd build/schedule/finish4-2026-08-12/tools
node harness.cjs smoke /schedule      # bridge + bundle-accurate hydration, admin
python3 api_seed.py                   # board snapshot; the C38875 foreign-shift check
python3 seed_series.py                # a series on a SECOND technician (C30060's precondition)
node w_series3.cjs                    # C30057 - the three delete scopes
node w_del.cjs ; node w_undo.cjs      # C30060 C30065 C38864 - delete, reload, Undo
node w_reassign.cjs                   # C43556 - the reassign drag
node w_day.cjs ; node w_day2.cjs      # day view, colour, capacity, keyboard
node w_misc.cjs ; node w_hours.cjs    # click-to-arm, dark mode, working-hours route
python3 write.py                      # DRY RUN by default; --go executes
python3 final_state.py                # live marker census + the walked union
python3 tools/recover.py              # proves a previous pass's writes landed, by content
```

## THINGS THAT COST TIME, WRITTEN DOWN SO THEY DO NOT AGAIN

- **The grid is taller than the viewport.** A shift block can sit at **y = 1371** in a 1080-tall
  window. **Scroll it into view and re-read the rect** before any click or drag; a coordinate click
  on a stale rect silently lands on nothing.
- **The lane caps at three blocks with a "+N more".** A shift that exists in the board fetch may not
  be rendered. **Choose targets from the `data-shift-id` values actually on screen**, intersected
  with the board.
- **Hover before declaring a control absent.** `fc-event-resizer` only exists at the block's edge.
- **Select a shift BY ID, never by customer name.** That is how a cleanup step became a destructive
  one on 12 August.
- **`data-shift-id`** is the attribute; **`schedule_shift_block`** is the test id.
- The scheduling API needs **`total_minutes`** (not `minutes`, `duration_minutes`, …) and
  **every line** of the work order.
