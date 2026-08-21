# Outside-In Gap Hunt — Invoice UI Refresh (Rule 45)

Five stages, each with a stated result. "Not applicable" is allowed; silence is not.

## (a) Foreign-coverage diff, both directions
**NOT RUN — BLOCKED.** The overlap and reverse-coverage tools read live TestRail (`foreign_overlap_check.py`,
`reverse_coverage_diff.py`), and this session has **no TestRail credentials** (`/tmp/testrail/creds.json`
absent). Additionally, this is a **greenfield** project (no prior Invoice-UI-Refresh cases, confirmed by
repo grep) with **no TestRail target section assigned yet**, so there is no group to diff against and no
foreign author is expected. **To be run at push time**, once creds and a target section exist, to catch any
foreign cases and overlaps the same day (skill 01 step 10). Logged as an outstanding dependency.

## (b) Automation-engineer lens — "what would I assert from the running build?"
Reaches only as far as the documents (no build — Rule 85). Working the lens against the spec surfaced and
CONFIRMED coverage of the non-obvious assertions an automator would want: the **portal-vs-shop PDF banner
split** (INV-PAID-06/09), the **two intentional "Labor"/"Parts" summary rows** (INV-FSUM-04), the **line-
footer divider suppression** (INV-WORK-07), the **paid-date render-time recompute on reversal** (INV-EIS-04),
and the **credit open-balance-by-status** table (INV-CRED-06). No new gap found that the spec supports.

## (c) Hostile-reviewer lens — "what would a reviewer claim is missing?"
Output is the DELIBERATE-DECISIONS register. The reviewer challenges anticipated and answered: "you tested
appearance without a build" (D1/D5, source-verified-only, honest marker), "your credit Balance contradicts
the glossary" (D2 — we followed the specific rule and raised the stale line), "you built against an old
spec" (D4 — no, v38, with the un-logged edit flagged).

## (d) External signals as coverage inputs
The **tech plan §1 FR list (FR-001…)** was diffed against the suite as an independent extraction of the
same requirements. Every FR maps to at least one authored case (FR-001→INV-MAST, FR-002→INV-ADDR,
FR-003→INV-OREF, FR-004→INV-AUTH, FR-005→INV-ASST, FR-006→INV-WORK, FR-007→INV-DECL, and onward). The tech
plan added **no requirement absent from the spec** (it restates spec rule IDs); it is corroboration, not a
new source (Rule 30). The one thing it flags that the suite carries as a boundary case: batch/imported
deferral (SV-9193) → INV-PART-08.

## (e) The evidence test
Every rule in `coverage-matrix.md` carries its **verbatim requirement text** beside its covering internal
ID(s); requirements asserting several things (e.g. S8-R8, S11-R6) are covered by multi-assertion cases whose
expected results enumerate each assertion on its own numbered line. Reverse direction: every case's cited
rule anchor resolves to a real spec rule (0 orphans). 110 rules / 110 covered / 0 uncovered.

## Result
No spec-supported coverage gap found. The one genuine open item is **stage (a)**, deferred to push time for
mechanical reasons (no creds / no target / greenfield), not skipped silently.
