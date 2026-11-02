# Technician Toggle — cases kept in the library only (not in TestRail)

QA lead, 2 Nov 2026, asked whether the 5 cases a manual tester cannot force go into TestRail: "Leave them out".
They stay in `authoring/` (and in REPORT.md's coverage table) and are skipped by `authoring/create.py` (NO_MANUAL).

| Key | Title | Why a manual tester cannot run it | PRD code |
|---|---|---|---|
| S2-34 | Save & Close shows its loading state while the counts load | the counts usually load faster than a person can see or click the loading Save button | S2-R4 |
| S2-35 | Closing the staff window while the counts load cancels the save | the same: the loading moment is too short to act in | S2-R4 |
| S2-36 | When the counts fail, the save goes ahead without the warning | a tester cannot make only the open-work count request fail while the save still works | Story 2 Error Handling |
| S3-47 | If only the technician list fails, the work order still loads | a tester cannot make only the list of technicians fail while the rest of the work order loads | Story 3 Error Handling |
| S4-07 | When the staff list fails to load, the notice still shows below the error | a tester cannot make the staff list fail while the page itself still loads | S4-R4 |
