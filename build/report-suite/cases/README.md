# Report Suite — cases/

Test-case authoring source for the Report Suite project (per-project
`<PREFIX>-<AREA>-NN` IDs, Standing Rule 8 id-map in ../testrail-id-map.csv).

**STATUS: EMPTY — authoring is UNBLOCKED (all 6/6 specs ingested 2026-07-22 and
the user pre-authorized authoring once all 6 were in) but NOT YET STARTED.**
Author per report (proposed per-report ID prefixes, finalize at authoring):
SBC- / SBR- / PV- / TU- / WIP- / IV-.

TestRail placement (user-prescribed): ONE main section "Report Suite" → one
SUBSECTION per report (named after the report) → that report's cases inside.
Cases with API/backend content (e.g. the nightly-snapshot Stories) go in a
"<Report> — API" section per Standing Rule 4. Import format = pure 1:1 with
testrail-import/<project>-testrail-import.csv (Standing Rule 16; VIU-word-free +
feature-flag-free).
