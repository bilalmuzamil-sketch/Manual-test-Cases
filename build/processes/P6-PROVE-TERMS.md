# PROVE TERMS `<feature> <env>` — every case gets a value proven to work on THAT environment

> **Call it:** `PROVE TERMS Invoicing LIVE`
>
> A case that says *"type a fragment of the part number"* is not runnable: the tester has to go and
> find data first, and most will pick something that also appears in the name — which makes the case
> prove nothing. This process replaces every such instruction with a **real value, proven to match
> the intended field, on the environment the tests will actually run on**.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| **Which environment the tests will be run on** | A term proven on staging is not a term on production |
| **A login for that environment** | The proving is done by querying it |
| The suite (from `BUILD CASES`) and its data (from `SEED`) | |

---

## THE STEPS

1. **Pull real records off the list endpoints**, and search a distinctive value from the target field.
2. **Keep it only if the response says the match came from THAT field.** This is P0's attribution
   leg, applied per term.
3. **Write the terms to a file keyed by environment** — `discovered-terms-<env>.json`. A single
   shared file means whichever environment ran last silently decides what the suite tells testers to
   type. That is exactly what went wrong.
4. **Re-check every term against the target environment** and count: how many work, how many are
   deliberate negatives (where returning nothing IS the pass), how many have no value.
5. **Where no term can be proven, say so in the case** — *"find the data first"* is honest and
   runnable. **A confident wrong value is worse than an honest gap.**

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| **Branch-assigned identifiers** | Work-order, part-sale, PO and invoice numbers differ per environment and change on every reseed | Re-read them after every reseed (Rule 111) |
| **Environment data mistaken for ours** | A part named "Rear Shock" on the QA branch is called something else where our seed created it | Read the name off the environment in front of you |
| **A near miss that is not missing** | A "returns nothing" case where the environment actually holds that record | **Probe** the near miss; never derive it by arithmetic |
| **A term that returns our record but hidden** | The group caps at 20 rows; a common surname buries ours | Prefer the quietest value, and check IDENTITY not count |
| **Treating a deliberate zero as a failure** | The "no results" case flagged as broken | Mark negatives explicitly before auditing |

---

## DONE WHEN
Every case either carries a value proven on the target environment, is a declared negative, or says
plainly that the tester must find the data — and the count of each is reported.

**Rules:** 110, 111, 112. **Worked example:** `build/search-results-integrity/discover_terms*.py`
and `audit_terms_vs_env.py`.
