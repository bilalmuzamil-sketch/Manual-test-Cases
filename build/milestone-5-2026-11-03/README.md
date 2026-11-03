# Milestone 5 changes — 3 Nov 2026 (QA lead's order)

"Remove the test runs which are check marked from this milestone and add the following to this milestore after creating its test run and that test run and milestone for it should be assigned to mudassir."

- Taken out of milestone 5 (runs kept, results untouched, milestone set to none): 549 A/R and A/P Report Sorting, Export and Location Filter - Execution; 551 Credit terms - Execution; 547 Splitting Sales Representatives - Execution; 553 What/Why - Execution. Before state: `runs-before.json`.
- New run 556 "Part Lifecycle - Execution" in milestone 5, assigned to Mudassir (TestRail user 6): all 576 cases of section 20439 and its 16 subsections (363 ours, 213 Mudassir's). Read back: 576 tests = 576 cases.
- Milestone 5 now holds 556, 555 Technician Toggle, 552 Maintenance reminder.
- TestRail milestones have no assignee field, so the milestone itself could not be assigned to Mudassir.
- Log: `log.jsonl`.
- 3 Nov 2026, QA lead: "ALl test cases in these run should be assigned to Mudassir." Run 555 assignee set to Mudassir (user 6); every test in 556 (576) and 555 (198) reads back assigned to Mudassir. No results were written: the tests took the run's assignee. Run 556 already holds results Mudassir entered himself (363 passed, 7 failed, 4 blocked at read-back).
