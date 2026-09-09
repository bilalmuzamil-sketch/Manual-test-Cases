# Rule 65 notice for Vlad — 7 Automated Simple Flow V2 cases build-verified (2026-09-09)

**What changed:** as part of the Simple Flow V2 (group 6665) build-verification pass on sv8683
(`v26.35.9-5700a76`), the QA lead extended the Automated go-ahead to Simple Flow V2 (2026-09-09), so these
7 TestRail-flagged **Automated** cases were build-verified like the rest: their preconditions were rewritten
to real sv8683 UI-click routes, the "Not available on Build" marker was lifted to **AUTOMATION: READY**, and
a build-check line `Last checked against build v26.35.9-5700a76 on 9/9/2026` was added. Expected Results were
preserved from the spec (Rule 57). `custom_atmstatus` stays **3 (Automated)** on all 7 — unchanged.

**Why you're told:** Rule 71/65 — these are Automated cases, so you get a heads-up whenever anything on them
changes. The QA lead gave the explicit go-ahead (2026-09-09) to include Simple Flow V2's Automated cases.

**Vladimir Tomovic's 6 Simple Flow V2 cases (C45202, C45203, C53490, C53491, C53492, C53493) were NOT
touched** (Rule 38).

| Case | Area | Change |
|---|---|---|
| C44557 | Work Order Settings | precond→build route, marker→READY, build stamp added |
| C44561 | Completing a Line | precond→build route, marker→READY, build stamp added |
| C44575 | Bulk Action Bar | precond→build route, marker→READY, build stamp added |
| C44583 | Receiving | precond→build route, marker→READY, build stamp added |
| C44587 | Receiving | precond→build route, marker→READY, build stamp added |
| C44604 | Reordering Parts | precond→build route, build stamp added; marker set to **HOLD** — reorder Undo is an open PO question (case says the Undo was removed 2026-09-04; every spec version says a drop can be undone), so it is held pending Milos, not handed to testers as ready |
| C44605 | Reordering Parts | precond→build route, marker→READY, build stamp added |

Case links: `https://shopview.testrail.io/index.php?/cases/view/<id>`
Per-case audit: `build/simple-flow-v2/build-verify-2026-09-09/REPAIRED-*.jsonl`.
