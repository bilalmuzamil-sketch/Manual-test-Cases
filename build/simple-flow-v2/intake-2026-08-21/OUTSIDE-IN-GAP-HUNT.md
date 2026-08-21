# Outside-In Gap Hunt — Simple Flow V2 (Rule 45)

## (a) Foreign-coverage diff, both directions
**NOT RUN — BLOCKED.** Needs live TestRail (no creds this session) and a target section (none assigned;
greenfield — no prior Simple Flow V2 footprint, and the completed SV-7301 suite is a different epic).
Deferred to push time (skill 01 step 10). Logged.

## (b) Automation-engineer lens — "what would I assert from the running build?"
Reaches only to the documents (no build — Rule 85). Working it against the AC confirmed coverage of the
non-obvious assertions: the settings **sweep across open work orders** with audit entries (SFV2-SET-06/07),
the **line-completes-with-any-part-state** matrix (SFV2-COMP-01), the **declined-line-never-swept** bulk
rule (SFV2-BULK-05), the **See-Financial-Data vs receive deadlock avoidance** (SFV2-RCV-05, SFV2-PERM-03),
the **one-invoice-number-two-POs-two-bills** rule (SFV2-RCV-04), and the **finish-action state table**
(SFV2-FIN-01). No spec-supported gap found.

## (c) Hostile-reviewer lens
Output is DELIBERATE-DECISIONS. Anticipated challenges answered: "no build so you tested nothing" (D1,
source-verified-only honest marker); "you skipped 150 screenshots" (D2, AC is self-sufficient, build-verify
reads screens); "SV-8726 rename isn't in your story list" (D5, PO-SF-1); "SV-8183 is Blocked" (D6, PO-SF-2).

## (d) External signals as coverage inputs
The **Work Order PRD, the line-status/line-part matrices, matrix-a-settings.csv, the line-actions design
spec and the bulk-bar priority doc** were read as independent elaborations of the spec AC; each maps onto
authored cases (settings→SET, line/part states→ACT-03, bulk priority→BULK-02, receiving cascade→RCV/RL).
They added detail, not requirements absent from the spec. The **4 epic bugs** were checked: their correct
behaviour is covered by the stories (esp. Story 5 for SV-8495).

## (e) The evidence test
`coverage-matrix.md` lists one verdict row per story (21) with covering internal IDs; every case anchor
resolves to a real story/ticket (0 orphans). Multi-assertion stories are covered by cases whose expected
results enumerate each assertion on its own numbered line.

## Result
No spec-supported gap found. Open item: stage (a), deferred to push time (no creds / no target / greenfield).
