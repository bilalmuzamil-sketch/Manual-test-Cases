# Run 498 (WO Board / Tech View) — how to re-run any check fast

**Recipe, routes and traps:** `build/APP-ACTIONS-PLAYBOOK.md` › "WO Board — FAST RE-RUN RECIPE". Read it first.

**Run one batch (or some checks of it):** `ONLY=C97007,C97013 <scratchpad>/wob.sh <this folder>/<batch>.mts`
(`wob.sh` = `env -i` + `npx tsx`, masks hex in output). One batch at a time — never two in parallel. For a long
sequence chain them in one script and write `EXIT=` after each, so a restart shows where to resume.

**Every batch:** signs in once (`session.mts`), switches to the test admin "ZZ WOB Runner" (`runner.mts`), makes its
own data (`data.mts` customers / work orders with a contact; `mkSet()` = one customer per work order), writes
`evidence/<batch>.json` + pictures, and puts the runner's saved choices back. Results go to TestRail with
`build/testing-tools/push_results_to_run.py --run 498 --results RESULTS-*.json` (Passed/Blocked free; Failed needs
`ticket_held` — no Jira without the QA lead's per-ticket approval).

| Batch | Checks |
|---|---|
| s1-batch2 / 3 / 4a / 4b | C154884 C96910–C96923 (display switcher) |
| s2-batchA / B / C | C96924–C96939, C368125–C368130, C368161, C368162 (Tech View) |
| s3-batchA / B / C | C96940–C96955, C154886, C368131, C368132 (Board View) |
| s4-batchA / C / D / E / G / H | C96956–C96974, C154887–C154890, C368133–C368140 (reassign) |
| s5-batchA / A3 / A5 / B / C | C96975–C96986, C368160, C368164 (fields and columns; A5 = second location as Ayesha Khan) |
| s6-batch / s6b-batch | C96987–C96992 (density) |
| s7-batch / s8-batch | C96993–C96999, C97000, C368141–C368143 (line technicians, tech story) |
| s9-batchA / s9-batchB | C97001–C97013, C368144–C368149 (drag to reorder; B = more than one person) |
| s11-batch | C97020–C97022, C97028, C97030–C97032, C154648, C154649, C368150–C368159 |
| high2-batch | C368193–C368214 (List regression) |
| medium-batch | C368220–C368237, C368245–C368247 (filters, reports, Customers, dashboard, imported) |
| ui-fallback | screen routes where the API route did not do it (second-location enrolment, New Asset) |
