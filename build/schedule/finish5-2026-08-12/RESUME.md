# Schedule finish5 — resume point, 2026-08-12

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag
`3250d285ffcf50626363a578fe273071` · **read at the start and end of this pass and unmoved.**
Location **`Staging Heavy Duty - 9919`** unless a case names another. **Re-read the marker before
trusting anything below.**

## WHERE THIS STANDS

| | |
|---|---|
| Cases (group 4254) | **176**, all ours, **0 foreign** |
| Markers | READY **137** · EXPECT-FAIL **4** · HOLD **35** · **gate closes both ways at 141** |
| Source-verified | **176 of 176** — read-dates present, and all pin **spec v27, which is live** |
| Naming the running build | **151 of 176** |
| **Preconditions and steps walked** | **147 of 176** — 5 this pass |
| **Walked *and* on the running build** | **137** — the conservative figure |
| Never walked | **29**, of which **25 already HOLD** → **4 genuinely remaining** |
| TestRail writes | **4 `update_case`**, all HTTP 200 + byte-verified, 0 mismatches |
| add / delete / section / run / result / Jira-create | **0 on every one** |
| Run 357 | **untouched, proven by content** — 176 tests, 529 results, 0 missing by id, 0 fields moved |

## THE FIVE THIS PASS WAS GIVEN — ALL DONE

| Case | Outcome |
|---|---|
| **C38875** | RUNNABLE · foreign shift seeded at Lethbridge · 404 confirmed · **one cosmetic step fix** |
| **C38863** | RUNNABLE · 409 warn → acknowledge → 201, and 422 refuses outright · driven **in the UI** |
| **C38865** | RUNNABLE · 59-shift series across 1 Nov · local **07:00 on both sides** |
| **C29986** | RUNNABLE · technician B got the **full 1801 min again** · no-op, already stamped |
| **C30615** | RUNNABLE · capacity **+90 min exactly** · conflict count **5 → 5** |

## THE ONLY THING LEFT: FOUR CASES, ONE ANSWER

**C29971, C30080, C30083, C38870** each need a **role / staff / settings** change on `sv8685`.
**Do not make one without the QA lead's go-ahead** — a permission change invalidates every
holder's session **one way**, and that is how the Technician session was lost on 12 August and
never came back.

## SESSION

Administrator, alive at the end of this pass. Cookie header `/tmp/qa-cookies/sched-hdr.txt`,
mode 600, **never written into the repository — it is public**. `/tmp` is empty after a container
restart, so rewrite it from the task. **`quick-login` and `switch-user` were never called.**

## RE-RUN RECIPE

```
cd build/schedule/finish5-2026-08-12/tools
python3 c38875.py            # seeds a Lethbridge shift, then drives the cross-location case
python3 c38863_65.py         # the >120 and 8-week guards, and the DST series
python3 c29986_30615.py      # two-technician spread; capacity before/after an event
python3 c30615_conflict.py   # the conflict half, against isConflict / conflictReasons
node    ui_spread.cjs        # the spread step, and the long-series warning in the UI
node    ui_final.cjs         # presses "Create N shifts anyway"; reads the conflict pill
python3 write.py             # DRY RUN by default; --go executes
python3 final_state.py       # live census, the walked union, run 357 by content
```

## THINGS THAT COST TIME, WRITTEN DOWN SO THEY DO NOT AGAIN

- **Deleting a shift from the detail modal asks NOTHING** for a non-series shift. Two passes have
  destroyed a shift that way. **This pass pressed no destructive control at all.** Before pressing
  anything that commits, **establish whether a confirmation exists** — for the spread that meant
  proving at API level that a >56-day request is refused with a 409 first.
- **`shift.conflicts` IS NOT A FIELD.** The real ones are **`isConflict`** and
  **`conflictReasons`**. Reading the wrong name gives `null` on every shift — a check that cannot
  fail. **Read the payload's own key list.**
- **A `PATCH` body that changes nothing returns `400 The request changes nothing.` BEFORE the
  location is checked** — so a 400 there says nothing about whether the id exists. Send a real
  field (`color`, `starts_at`).
- **The board endpoint refuses a range over 62 days** — page it.
- The scheduling API needs **`total_minutes`**, and **`start_date` must be a LOCAL date**.
  **`end_date` is not a parameter**; the day count derives from the minutes.
- **`acknowledgeLongSeries` is camelCase** where every other field on that payload is snake_case.
- **The 409 message names the exact span**, so a spread can be sized precisely **without creating
  anything**.
- **The grid is taller than the viewport**; scroll a block into view and re-read its rect.
- **Hover before declaring a control absent.**
