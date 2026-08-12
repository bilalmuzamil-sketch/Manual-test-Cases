# COMPLETION REPORT — Report Suite

**Build `v3.7-4626299` · every figure below derived LIVE from TestRail at `2026-08-12T13:27:48Z`, not copied from a findings file.**

**Ours 480 / live 492** — the other 12 under group 4281 are Vladimir Tomovic's (C38919–C38923, C43567–C43573) and are never edited or counted as ours.

## The table

| Report | Cases | Source-verified | Build line = running build | Build line = older | No build line | Route walked | **Steps+preconds walked** | READY | EXPECT FAIL | HOLD |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Work In Progress **(final)** | 81 | 81 | 0 | 78 | 3 | 81 | **48** | 59 | 12 | 10 |
| Technician Utilization **(final)** | 60 | 60 | 0 | 60 | 0 | 52 | **41** | 38 | 16 | 6 |
| Sales By Customer Report **(final)** | 88 | 88 | 2 | 83 | 3 | 88 | **45** | 60 | 18 | 10 |
| Sales By Representative Report | 112 | 112 | 1 | 109 | 2 | 112 | **58** | 84 | 23 | 5 |
| Parts Velocity Report | 71 | 71 | 0 | 71 | 0 | 71 | **22** | 61 | 9 | 1 |
| Inventory Value | 68 | 68 | 0 | 68 | 0 | 68 | **39** | 39 | 19 | 10 |
| **TOTAL** | **480** | **480** | **3** | **469** | **8** | **472** | **253** | **341** | **97** | **42** |

### The two walk numbers, and why only ONE of them is safe to quote

- **Route walked = 472 — MEASURED, and this is the figure to use.** Every screen, tab and control those cases name was reached and OPERATED on this build in this session: navigated to through the reports menu, tab clicked, every toolbar control opened and its contents read, sorted, expanded. It says a tester will not be stopped by a missing or dead control.

- **Steps AND preconditions walked = at most 253, and I do NOT recommend quoting it.** The preconditions on this suite are prose data-states — *"a rep whose invoices span two locations"*, *"the Deactivate dialog is open"*, *"a technician whose hours land on a rounding tie"* — and I classified them by pattern, then **hand-audited two random samples of 8**. In the first, **4 of 8** had a precondition this session never established; after tightening the patterns, **about 3 of 8** still did. **So the classifier over-counts and the true figure is materially lower than 253.**

**The honest statement is therefore:** the ROUTE of 472 of 480 cases is verified against the running build; **per-case DATA PRECONDITIONS were not individually established for the suite**, and that is the single largest piece of outstanding verification work.

### Marker arithmetic, closing both ways

- `READY` 341 + `READY - EXPECT FAIL` 97 = **438**
- total 480 − `HOLD` 42 = **438**
- **The gate passes.** Cases with no marker at all: 0.

## Created / updated / deleted this session

| | |
|---|---:|
| created (`add_case`) | **0** |
| updated (`update_case`) | **3** |
| build lines re-stamped | **3** — deliberately, see below |
| deleted (`delete_case`) | **0** |
| sections added/changed | **0** |
| run writes / results logged | **0** |
| Jira issues created | **0** |

The three updated are C30107, C43591 and C38913 — all HTTP 200, 30 fields compared each, 0 mismatches, verified by re-GET and byte comparison, never by `updated_on`.

### Why only 3 build lines were re-stamped, and not 472

A Rule-54 sentence-2 stamp records that a case was checked against a build. For the three above I drove the exact control each one turns on, end to end. For the other 469 I verified the **route** but not each case's **precondition** — and the hand-audits above show I cannot reliably tell which ones those are. Stamping them would assert a check nobody made, on the eve of release. **An honest stale stamp is worth more than an overstated fresh one**, so they keep their older build lines, which are true statements about when they were last checked.
