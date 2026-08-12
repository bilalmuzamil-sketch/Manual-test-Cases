# Schedule finish4 — everything this pass changed

## TestRail — 15 `update_case`, all byte-verified

**One edit, repeated: the Rule-54 sentence-2 build stamp**, moved to
`Last checked against build v3.5-65d6500 on 12 August 2026.` on the 15 walked cases that were not
already carrying it.

**C29962 · C30005 · C30031 · C30060 · C30065 · C30068 · C30072 · C30073 · C38849 · C38850 · C38851 ·
C38864 · C38866 · C43556 · C43589.**

**Not changed on any case:** sentence 1 (the documents), the expected behaviour, the steps, the
preconditions, the title, `refs`, the section, the type, or `custom_atmstatus`. Per-operation
detail: `testrail-execution-log.md`.

**No case's wording needed correcting.** Every step and every label the 18 walked cases name was
found where the case says it is — the one exception being a cosmetic icon difference recorded in
`DIVERGENCES.md` §1, which was **not** written to the case because a reader would recognise the
control anyway.

## The environment

**Test data added — and left in place, per the QA lead's instruction that data on these branches is
just test data and is not worth restoring:**

| What | Where | Why |
|---|---|---|
| A **4-shift series** `81a6b48c…` on **MQ Test Tech Qamar**, work order **S-14209** | `POST /api/schedule/shifts`, `spread_mode: series`, `total_minutes: 1200` | C30060's precondition needs *two* series on the same work order on *different* technicians, and only one technician had any |

**Test data destroyed, stated plainly:**

| What | How | Note |
|---|---|---|
| Series `7fca50c0…` — **4 shifts**, work order S-14209 | `DELETE /api/schedule/shifts/207e4f90…?scope=series`, from the product's own dialog | **This is C30060's test.** It was a duplicate of series `6635dbdb…` — same work order, same technician, same times — so the least valuable of the two |
| Shift `e35d37ef…` | deleted, then **restored by clicking Undo** | C30065 / C38864. `POST /api/schedule/shifts/restore` brought back **the same id**, so this is a net zero |

**Board total: 174 → 170**, which is exactly the 4-shift series and nothing else.

**No accidental deletion this pass.** Every shift was selected **by id** from the board fetch, never
by matching a customer name on the grid — which is how a cleanup step became a destructive one on
12 August (`../drag-retry-2026-08-12/INCIDENT-accidental-delete-2026-08-12.md`).

**Nothing else was changed at all:** no role definition, no staff record, no organisation or shop
setting, no working-hours toggle, no colour label, no user theme preference. Three cases are
unwalked precisely because they would have required one of those.

**Two dialogs were opened and cancelled without committing:** the series delete-scope dialog for
C30057, and the reassign confirmation for C43556 (*"Move this shift to Lisa Stewart on Wed, Aug
12?"*). Both probes recorded **zero non-GET API calls**, which is the proof nothing was committed.

## Jira

**Zero calls that create anything.** Three Story Defects remain written up and unfiled, awaiting the
QA lead — `../finish3-2026-08-12/DIVERGENCES.md` and the earlier passes' findings. This pass added
none.
