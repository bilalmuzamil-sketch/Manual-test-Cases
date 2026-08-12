# Schedule — every change this pass made, 2026-08-12 (finish2)

**Build `v3.5-65d6500`.** `update_case` **only**.
**0 add · 0 delete · 0 section · 0 run · 0 result** writes. **0 Jira calls of any kind.**
`custom_atmstatus` never sent. **No role, staff record, permission or setting was changed.**

## In TestRail — 40 operations over 38 distinct cases

| What | Cases | Detail |
|---|---|---|
| **Rule-54 sentence 2 re-stamped** | **37** | moved from `v3.5-d122eef` / `v3.5-7ec992f` onto **`v3.5-65d6500`, 12 August 2026**, in neutral language (*"Last checked against build … on …"*). **Only on cases this pass actually walked** — nothing was stamped from a label harvest |
| **Sentence 2 ADDED where there was none** | **1** | [C43588](https://shopview.testrail.io/index.php?/cases/view/43588) had no build line at all and now has one |
| **Tester note + marker → `AUTOMATION: HOLD`** | **2** | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) · [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) — the two substantive divergences |
| **Repair of my own defect** | **1** | C29929's note was applied twice by the resume; the duplicate was removed |

**Sentence 1 — the SOURCE of the expectation — was not altered on any case.**
**No expected behaviour was changed anywhere** (Rule 57). No title, no `refs`, no section, no type.

## What was deliberately NOT changed

| | Why |
|---|---|
| The **expected results** of C29929 and C30050 | an expectation comes from the documents, not the build. A case rewritten to match what shipped can no longer fail, and rewriting it would delete the finding |
| **C30022**'s grey-default assertion | the events in view render violet, but none is **known** to have had no colour chosen — that is an observation, not a verdict |
| **C29952**, **C38849** | their preconditions do not currently exist on this estate. Absence of a badge you cannot make appear is not evidence |
| **The 89 cases nobody has walked** | untouched. A case that has not been checked keeps the build line it had |
| **Anything outside Schedule** | no case, run or folder in Filters, Report Suite or any other project was read or written |

## In the environment — nothing to restore

**Nothing was created, and nothing was deleted.** No `ZZAUTOTEST` data exists from this pass because
none was ever needed: every state the walked cases require already existed and was used read-only.

Toggles were touched and **put back** in the same run — `Service`, `VIN Number`, `Tech Hours`,
`Show Saturday`, `Set working hours for this technician`, `Set business hours for this shop`, and the
light/dark choice. **None of them persisted**, and that is not an assertion: **every probe printed its
non-GET call list at exit and every one read `[]`.** In particular the working-hours switch in the
Edit Staff dialog was toggled and **Save was never pressed**, so no staff record was written.

**Roles, permissions and staff records were not touched at all** — a role edit invalidates every
holder's session one way, which is how the Technician sign-in was lost yesterday.

---

## Addendum — the API cases, and the data they created

**[C38873](https://shopview.testrail.io/index.php?/cases/view/38873) was driven against the API host
and it created real shifts**, which is what the case is for. Recorded plainly rather than glossed:

| Call | Result |
|---|---|
| a series past 8 weeks, **without** `acknowledgeLongSeries` | **HTTP 409**, nothing created |
| the same **with** the acknowledgement | **HTTP 201** — **75 shifts** under one series id |
| boundary probes at 50,000 / 60,000 / 64,800 minutes | **HTTP 201** — 93, 112 and **120** shifts |
| 65,000 / 70,000 / 100,000 minutes | **HTTP 422**, nothing created |

**So roughly 400 shifts were created, all dated November 2026 to mid-2027** — well outside the August
window a tester will be looking at. **They were deliberately left in place**, on the QA lead's
instruction that *"any data added in these branches is just the test data"* and that time should not be
spent restoring it. **They are also genuinely useful**: several series cases need a series to look at.

**The refused calls left nothing behind, and that is a measurement**: the board was walked in 60-day
windows before and after, and the shift count moved by **exactly** the number the one accepted call
created.

**Nothing was created at location B** — the attempt is recorded under C38875 in `evidence/walk_api.json`.
The session was switched to location B and **switched back to location A**, verified HTTP 200 both ways.
