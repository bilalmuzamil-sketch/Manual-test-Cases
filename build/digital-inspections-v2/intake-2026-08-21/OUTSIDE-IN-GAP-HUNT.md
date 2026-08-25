# Outside-In Gap Hunt — Digital Inspections V2 (Rule 45)

## (a) Foreign-coverage diff, both directions
**NOT RUN — BLOCKED.** No TestRail credentials this session and no target section; greenfield (no prior
Digital Inspections V2 footprint). Deferred to push time (skill 01 step 10). Logged.

## (b) Automation-engineer lens
Reaches only to the documents (no build — Rule 85, branch withheld). Working it against the spec confirmed
the non-obvious assertions are covered: derived worst-first verdicts + per-position counting (DINV-CAP-09/11),
closed-WO-never-modified + new-WO creation (DINV-BLD-02), navigation-before-drafting and state-only-on-Add-Lines
(DINV-BLD-03/15), ShopCoach absent-not-disabled across all entry points (DINV-BLD-04/07/09/11), and identical
counts across viewers (DINV-HIST-03). No spec-supported gap found.

## (c) Hostile-reviewer lens
Output is DELIBERATE-DECISIONS: name mismatch (D2), withheld branch (D1), the S12-R4 contradiction (D3),
the release cut-off (D4), no tech plan (D5).

## (d) External signals as coverage inputs
The DVI-V2 build-spec, user-stories and design-brief were read as independent elaborations of the spec; they
map onto the authored cases and add no requirement absent from the spec. The epic's bugs (e.g. SV-8128 techs
completing inspection lines while incomplete, SV-7681 no-space instruction horizontal scroll) describe correct
behaviour covered by S1/S14; not authored as separate cases.

## (e) The evidence test
coverage-matrix.md gives one verdict row per in-scope story (14), each with covering internal IDs; every case
anchor resolves to an in-scope story (0 orphans). Multi-assertion stories are covered by clustered cases whose
expected results enumerate each assertion on its own numbered line.

## Result
No spec-supported gap found. Open items: stage (a) deferred to push time; two PO decisions (S12-R4, cut-off).
