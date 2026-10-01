# PUBLISH TO TESTRAIL `<feature>` — push to TestRail, sync the run, hand over

> **Call it:** `PUBLISH Invoicing TO TESTRAIL`

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| 🔴 **Explicit permission to write to TestRail** | Standing Rule 6. TestRail is the only real production system here. No `add_case` / `update_case` / run write without your go-ahead |
| **Which section** the cases belong in, and whether to create it | |
| **Which run** they must join | |
| **Whether the Jira creation hold is lifted**, if there are findings | Standing Rule 62 — permission is **per ticket**, never a batch blanket, and a hold has been active since 2026-08-10 |

---

## THE STEPS

1. **Push the cases idempotently.** `add_case` ALWAYS creates — so skip by title. A connection reset
   89 cases into the first Global Search push would otherwise have made 89 duplicates in production.
2. **Fill the required custom fields.** On this instance `custom_atmstatus` and
   `custom_automation_type` are both mandatory and a bare `add_case` answers 400 with no explanation.
3. 🔴 **Sync the run UNION-ONLY.** A partial `case_ids` list **DELETES** tests and their results
   (Rule 34). Read the run's current case ids, add yours, send the union.
4. **Produce the retest list.** Compare field by field against what TestRail currently holds and
   update only what differs — so the "changed" list is the truth rather than "everything I touched".
5. **Hand over:** the workbook, the retest list, and a plain statement of what changed and why.

---

## THE PROTOCOL YOU ASKED FOR
> *"Let me know if you are going to edit the test cases and then let me know the test cases you have
> edited, and based on that I will let the other session who is running those test cases know to
> retest them."*

So: **say before, name after.** Every pass that writes to cases produces a retest list with the
local id, the C-id, a link, and what changed. If a pass changes a case TestRail flags as
**Automated**, tell Vlad (Rule 65) — and never change or delete one without your go-ahead (Rule 71).

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| `get_tests/<run>&limit=500` | Returns **zero tests with status 200** — reads exactly like an emptied run | TestRail caps `limit` at 250. Page it |
| An unpaged `get_cases` | Returns 250 sections and silently finds nothing | Page everything |
| Reading columns by index | Adding one column shifts every later one; the reader silently writes garbage into live cases | Read by header NAME |
| Deleting a case | Takes its test and results out of the run with it | Never delete; report instead |
| A sheet with no ID column | Crashes the reader mid-push | Keep an explicit SKIP list |

---

## DONE WHEN
Every case exists in TestRail, every case is in the run, the counts reconcile against the local
id-map, and the retest list has been handed to whoever is executing.

**Canonical:** `build/skills/04-TESTER-READY.md`, `build/APP-ACTIONS-PLAYBOOK.md` §J.
**Rules:** 6, 34, 38, 50, 62, 65, 71, 8, 19.
