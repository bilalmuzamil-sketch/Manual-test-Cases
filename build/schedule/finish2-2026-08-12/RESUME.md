# Schedule finish2 — resume point, 2026-08-12

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285ffcf50626363a578fe273071` ·
`index.html` sha256 `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` ·
read at **2026-08-12T07:11:17Z**. **Re-read it before trusting anything below.**

## WHERE THIS STANDS

| | |
|---|---|
| Cases (group 4254) | **176**, all ours (`created_by = 3`), no foreign cases |
| Markers | READY **141** · EXPECT-FAIL **4** · HOLD **31** · **gate closes both ways at 145** |
| Build line naming the running build | **113 of 176** (was 76) |
| **Preconditions and steps actually walked** | **87 of 176** — 54 this pass, 53 of them new |
| Never walked by anybody | **89** (25 already on HOLD; **64 are the real remaining work**) |
| TestRail writes | **40 operations over 38 cases**, all HTTP 200 + byte-verified, 30 fields each, 0 mismatches |
| add / delete / section / run / result | **0** · Jira creates **0** · `custom_atmstatus` never sent |
| Run 357 | **untouched, proven by content** — 176 tests, 529 results all present by id, 0 changes |

## READ THESE, IN THIS ORDER

`COMPLETION-REPORT.md` (the numbers + what is left, itemised) → `DIVERGENCES.md` (two substantive, and
the three that collapsed) → `FINDINGS.md` → `RUNNABILITY.md` (case by case) →
`testrail-execution-log.md` → `CHANGES-MADE.md` → `AUTOMATED-CASES-CHANGED.md`.

## THE NEXT THING TO DO, IN ORDER

1. **Keep walking the 64.** `evidence/remaining.json` holds the exact list and the per-area breakdown.
   The cheapest wins are **Shift Start Times (7)**, **Events (4, one seeded event unblocks them)** and
   **API — Schedule (2, drivable straight against the API host)**.
2. **Ask for permission to raise the two Story Defects** — C29929 and C30050, written up ready to file.
3. **The three permission users**, configured before their cookies are minted — ten cases.
4. **C30086's sidebar half** — at 900 px the grid scrolls but the sidebar stays at its full 275 px.
   One look.
5. **Seed one event with no colour chosen** to settle C30022, and **one line with no technician** to
   settle C29952.

## SESSIONS

- **Administrator — ALIVE**, `/tmp/qa-cookies/sched-admin.txt`, mode 600. ~24 h or one deploy from expiry.
- **Technician — DEAD.** Lost to a role-definition edit on 12 August; a permission change invalidates
  every holder's session **one way** and it does not return when the permissions are put back.

## RE-RUN RECIPE

```
cd build/schedule/finish2-2026-08-12/tools
node harness_admin.cjs <tag> /schedule   # administrator, bundle-accurate hydration
node harvest_ids.cjs                     # every data-test-id on the page
node walk_b1.cjs ; node walk_b1fix.cjs   # default view, timeline, toolbar, conflicts, capacity
node walk_b2.cjs ; node walk_b2fix.cjs   # sidebar, drill-down, toolbar menus, block anatomy
node walk_b3.cjs                         # modal, tooltips, conflict styling, colour
node walk_b4.cjs ; node walk_b5.cjs      # working hours settings, shop business hours
node walk_b6.cjs                         # overlap, series, keyboard, events, responsive, dark mode
node walk_hard.cjs                       # the five results that needed a harder check
python3 restamp.py                       # DRY RUN by default; --go executes
python3 fix_29929.py                     # the duplicate-note repair (idempotent)
```

Every probe writes its result file **after every case** and prints its **non-GET call list at exit**.

## TRAPS — READ BEFORE WRITING A PROBE

1. **`button_shift_detail_delete` destroys a non-series shift on the first click, no confirmation.**
2. **`.schedule-lane` elements are 199 px wide — the technician LABEL column, not the grid.** Click at
   35–80 % of the calendar width to reach a cell.
3. **THREE search inputs exist** — `select_global_search`, `input_sidebar_search`,
   `input_schedule_search`. A `/search/i` match lands on the wrong one and looks like a broken filter.
4. **The toolbar menu items are plain `div`s, not `.q-item`.** A `.q-item` selector finds no toggles at
   all and every one reads as absent.
5. **Never touch a role, a staff record or a permission.** A role edit kills every holder's session,
   one way. A staff **Save** does the same to that user.
6. **Measure at a window width where the thing under test can actually happen** — C30001 read as a
   failure at 1680 px purely because the whole day nearly fits.
7. **`restamp.py`'s skip must be "the note is already present", not "the case is exempt from the
   skip"** — the exempt form re-applies the note on a resume. It did, and it had to be repaired.
