# Expect-fail markers that look stale — evidence, and why I did not flip them

**Build:** `v3.5-4795eee`, observed 2026-08-10. **No case was changed on the strength of this file.**

## Why this matters

`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` is an **instruction to the automation engineer**: expect
this to fail, do not raise it, it is already ticketed. If the defect has since been fixed, that
instruction is actively harmful — a genuine pass gets written off as the known failure, and nobody
notices the case has stopped testing anything.

**On the three handed-off reports, 52 cases carry an expect-fail marker across 33 tickets. Read live
in Jira today, 31 of those 33 tickets are `OBSOLETE` with resolution `Done`.** That is a strong signal
that a large share of these markers are stale — but a closed ticket proves nothing on its own
(Rule 57), so it has to be checked on the build.

## What I checked, and what I saw

Four tickets, chosen because they are cheap to observe and cover the biggest Technician Utilization
cluster.

| Ticket | What it claimed | Observed today | Reading |
|---|---|---|---|
| **SV-8945** | Sorting a column reloads the report from the server | Clicking a column header fired **0** report requests | **Appears FIXED** — S2-R13 requires on-screen sorting, and that is what it does |
| **SV-8946** | The technician filter reloads the report | Deselecting a technician fired **0** report requests | **Appears FIXED** — matches Story 5 |
| **SV-8953** | The expand/collapse controls do not carry proper names | Names read `Expand all technicians`, `Expand Alicia Campbell's daily breakdown` | **Appears FIXED** — matches S4-R1 and S4-R4 verbatim |
| **SV-8947** | The technician filter's select-all control is wrong | The control reads **"All technicians"**, not "Select all" | **STILL DEVIATES** from S5-R6, which requires a control *"labeled \"Select all\""* |

**Affected cases** — TU-SORT-01 [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) ·
TU-EXP-01 [C30418](https://shopview.testrail.io/index.php?/cases/view/30418) ·
TU-EXP-04 [C30421](https://shopview.testrail.io/index.php?/cases/view/30421) ·
TU-FILT-01 [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) ·
TU-FILT-02 [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) ·
TU-FILT-03 [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) ·
TU-LOAD-02 [C30450](https://shopview.testrail.io/index.php?/cases/view/30450).

## Why I did not flip these markers

Three reasons, and I think they are the right call:

1. **Rule 41 — touching a case means re-reading the whole case against the current specification**,
   not just the one line the marker sits on. Each of these cases asserts several things; I observed
   the one behaviour the ticket named, not the whole case. Flipping a marker on a partial observation
   would repeat exactly the mistake this pass exists to correct.
2. **"Fired no server request" is good evidence for SV-8945/8946 but it is not the whole
   requirement** — S2-R13 also pins first-click-ascending, the toggle behaviour, the absence of a
   third state and the tiebreak order. Those were not driven.
3. **SV-8947 shows the cluster is genuinely mixed.** Three look fixed and one plainly is not, so
   "the tickets are closed, flip them all" would have been wrong.

## What this means for the other 28 tickets

**They have not been checked.** 45 further cases point at them. On today's sample of four, **three
had been fixed** — so if that rate carries, a large share of the remaining expect-fail markers are
telling the automation engineer to ignore passing tests.

**This is the largest single piece of unfinished work on the three handed-off reports**, and it needs
authorisation for a per-case sweep rather than a marker-only edit.
