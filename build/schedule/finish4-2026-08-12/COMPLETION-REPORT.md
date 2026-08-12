# Schedule — completion report, 2026-08-12

**Every figure below was derived LIVE from TestRail and from the running build at
`2026-08-12T10:2x UTC`, not carried forward from a document.** Counts have moved mid-pass on this
project before, so they are re-read at the moment they are relied on.

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag
`3250d285ffcf50626363a578fe273071` · **unmoved across the whole pass**.
**Location `Staging Heavy Duty - 9919`** on every observation.

## The table

| | Figure | Note |
|---|---|---|
| **Total cases** | **ours 176 / live 176** | every case under group 4254 is ours (`created_by = 3`); **no foreign cases** |
| **Source-verified** | **176 of 176** | every case carries a per-source read date and a version pin; **0 cases lack a read date** |
| **Build-verified — naming the build now running** | **147 of 176** | `v3.5-65d6500`, the build actually serving |
| **Build-verified — naming an earlier build** | **29 of 176** | their own text says which; under Rule 60 that is the record, not a defect |
| **Preconditions and steps ACTUALLY WALKED** | **142 of 176** | **the smaller, honest number — see below** |
| — walked this pass | **18** | |
| — walked by earlier passes | **124** | union by case id, so nothing is double-counted |
| **Never walked** | **34** | of which **25 already carry `AUTOMATION: HOLD`** |
| **Genuinely remaining** | **9** | itemised below, each with what it waits on |
| **Runnable vs held** | READY **137** · READY-EXPECT-FAIL **4** · HOLD **35** | |
| **The gate, closing both ways** | **137 + 4 = 141** and **176 − 35 = 141** | **it closes** |
| **Created / updated / deleted** | **0 / 15 / 0** | `update_case` only |
| Raw markup · doubled markers · missing build line | **0 · 0 · 0** | read back live from all 176 |
| Run 357 | **untouched, proven by content** | 176 tests, 529 results, 0 missing by id, 0 fields moved, `include_all` still false |

## "Build-verified" and "steps walked" are DIFFERENT numbers, and both are printed

**147 build-verified · 142 steps-and-preconditions walked.** The gap is deliberate and it is the
point of reporting both:

- **Build-verified** says a case's provenance names this build — its labels were checked against it.
- **Steps walked** says **a tester could actually execute it**: the precondition was reachable, the
  navigation path existed, each named control was where the step says it is, the order worked, and
  the labels were the ones on screen.

**The second is always the smaller number and it is the one that answers "can a tester pick this up
tomorrow and run it?"** Quoting 147 alone would overstate the position.

**This suite is therefore described as: source-verified, and build-accurate in its preconditions,
steps, navigation and labels for 142 of its 176 cases — with the behaviour verdict belonging to the
tester.** It is **not** "VIU complete", and it must not be reported that way.

## What is left — 9 cases, itemised, each with what it waits on

| Case | Waiting on | Who can clear it |
|---|---|---|
| [C29971](https://shopview.testrail.io/index.php?/cases/view/29971) — a 7:00 AM default with no hours set anywhere | the shop's **business hours cleared**. A settings write; **excluded from this pass by instruction** (settings edits have killed sessions on this estate) | QA lead — one go-ahead, ~15 min |
| [C30080](https://shopview.testrail.io/index.php?/cases/view/30080) — permission tiers nest | a **custom role created and edited**. Barred by the same instruction | QA lead |
| [C30083](https://shopview.testrail.io/index.php?/cases/view/30083) — grid rows are department-based | a **staff member's department changed**. Barred by the same instruction | QA lead |
| [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) — a shift from another location returns 404 | **a shift existing at another location.** Checked live: Staging Lethbridge - 4310's board holds **0 shifts**, so there is nothing foreign to request. Needs a work order seeded at that location first | seedable — ~30 min |
| [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) — a multi-location technician's shift | a **technician enrolled at two locations** — a staff record change. Barred | QA lead |
| [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) — a series across the clock change | a spread reaching **1 November** from 11 August; the finish-by control moves by arrows and the route to a date 12 weeks out was not established | seedable — ~30 min |
| [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) — spread past 8 weeks, and the 120-shift cap | the same long-window spread, driven **from the interface**. The server limits themselves are already proven (409 past 56 days, 422 past 120 shifts) | as above |
| [C29986](https://shopview.testrail.io/index.php?/cases/view/29986) — the same work order spread on a second technician | a second full **UI** spread. The API equivalent was seeded this pass for C30060, so the state exists; the drag was not repeated | ~30 min |
| [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) — an event's hours count toward capacity | an **event seeded on the same technician and day as a shift**, then a before/after read of the capacity bar | ~30 min |

**Five of the nine are ordinary remaining work (~2 hours). Four are blocked on one instruction from
the QA lead** — permission to make a role, staff or settings change on this branch.

## Honest limits inside the 142

Four walked cases are runnable but only **partly driven**, and each says so in `RUNNABILITY.md`:
**C38850 / C38851** (the working-hours editor is behind a toggle this pass would not turn on) ·
**C38866 / C43589** (dark mode was applied by the harness, not by clicking the product's own
toggle — which was located, at `button_night_mode_dark`) · and **C30018 / C30031 / C30065 / C38864 /
C30068** each have a named step that was not driven.

## Outstanding — what I need from you

1. **Permission for a role / staff / settings change on `sv8685`** — unblocks C29971, C30080,
   C30083 and C38870, four of the nine.
2. **The three Story Defects from earlier passes are still unfiled**, held by the creation hold
   (*"Do not create anything until my next order."*). The biggest is the **missing Unassigned row**
   (spec §3.2 and §4.2 both require it; nothing in the build answers to it), which holds
   C29973/C29974/C29975 on `AUTOMATION: HOLD`.
3. **SV-9005 can be closed** — the finish3 pass proved the finish-by control now responds fully.
