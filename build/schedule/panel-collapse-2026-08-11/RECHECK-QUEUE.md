# RECHECK QUEUE — Schedule §5.3 Panel collapse — **STATUS: OPEN** — 2026-08-11

**Check this queue at every session start and before/after any Schedule work**
(`ls build/*/*/RECHECK-QUEUE.md`). There is **no background scheduler** — this dated, committed file
plus that check IS the mechanism.

**Build these rows were recorded on:** **`v3.5-af3a6e1`** · `index.html` last-modified
**Mon 10 Aug 2026 21:59:27 GMT** · etag `0708dbc8bc1fe805e835a2f86d05abfb` · sha256
`3cb182afbddefdaa4497c83daf5858d9d244fa3d26a746b86e250463c357cc09`, **read at 02:36Z and 03:27Z and
byte-identical**.

**The branch has NOT been declared final, so all six verdicts are PROVISIONAL** (Rule 49).

---

## What this queue covers, and what it deliberately does not

Under **Standing Rule 61** the automated suite is the monitor for anything it can see, so a queue
carries only what it **cannot**: `AUTOMATION: HOLD` cases, never-observed cases, and verdicts that
were never automated.

**All six rows here are `HOLD`, so all six belong in the queue** — and **their trigger is the thing
they are actually waiting on, which is the feature shipping. It is NOT a redeploy.** A deploy that
does not add the control changes nothing about these rows, and re-running them on every deploy would
be work with no possible finding.

---

## The rows — 6 of 6 OPEN

| # | Case | What was observed on `v3.5-af3a6e1` | What must be re-verified | Trigger | Status |
|---|---|---|---|---|---|
| 1 | **SCH-PANEL-01 = [C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** | No panel button anywhere left of Today, at six viewport widths; the strings `Hide panel` / `Show panel` / `panel-left` / `Panel toggle` appear **0 times** in the shipped Schedule chunk | the control's position, its borderless grey icon, the icon staying the same between states, and the tooltip wording in both states | the panel-collapse control ships | **OPEN** |
| 2 | **SCH-PANEL-02 = [C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** | same — no control to drive | the close animation, that no seam or empty strip is left, and that the grid reflows into the width | the control ships | **OPEN** |
| 3 | **SCH-PANEL-03 = [C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** | same | that calendar date, search text, scroll position, drill-down state and the selected work order all survive a cycle | the control ships | **OPEN** |
| 4 | **SCH-PANEL-04 = [C43585](https://shopview.testrail.io/index.php?/cases/view/43585)** | same. **Separately observed and already known:** the panel does not auto-collapse below 960px — measured at 959/900/760/600 on fresh loads, panel stayed 275px wide | that the toggle works below 960px and that a manual choice holds until the next resize across the breakpoint | the control ships. **The auto-collapse half is NOT this row's** — it is C30086's, already ticketed [SV-8942](https://shopview.atlassian.net/browse/SV-8942) and monitored by C30086's own EXPECT-FAIL marker | **OPEN** |
| 5 | **SCH-PANEL-05 = [C43586](https://shopview.testrail.io/index.php?/cases/view/43586)** | same | that pop-ups fall back to a normal viewport margin while the panel is collapsed, with nothing off screen | the control ships | **OPEN** |
| 6 | **SCH-PANEL-06 = [C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** | same | that the choice survives navigation, does **not** survive sign-out, and is per-user | **TWO triggers, both needed:** the control ships **AND** Branko answers the session-scoped question (`QUESTIONS-FOR-BRANKO.md` Q1). Driving it also needs a second sign-in, which this estate does not currently allow | **OPEN** |

---

## How a row closes

A row closes **only** when it has been **re-verified live with fresh evidence** and its Rule-54
provenance line re-stamped to the build it was re-checked against. **The queue closes only when
100% of its rows are closed** (Rule 17 — no sampling).

**An OPEN queue is the normal steady state of an active project** (Rule 60), not an embarrassment.
Engineering has confirmed the Schedule branch will not be declared final before release, so this
queue is a living work list.

**What would let all six close at once:** the control shipping, plus a second sign-in for row 6.
Until then nothing here is re-runnable, and re-running it would be theatre.

---

## Also carried, not owned by this queue

| Item | Where it belongs |
|---|---|
| 78 cases stamped `v3.5-d122eef` and 90 stamped `v3.5-7ec992f`, **neither of which exists any more** | `build/schedule/full-viu-2026-08-05/RECHECK-QUEUE.md`, the project's live queue. Not re-stamped here: re-stamping without re-observing would claim a check that did not happen |
| 12 Schedule cases never observed at all, needing a second non-administrator sign-in | same queue |
