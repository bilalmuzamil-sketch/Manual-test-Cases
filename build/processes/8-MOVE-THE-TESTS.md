# MOVE THE TESTS `<feature> TO <env>` — move an existing suite to a different environment

> **Call it:** `MOVE THE TESTS Invoicing TO LIVE`
>
> The suite was written against one environment and now has to be run on another. Everything
> environment-specific inside it is now a **false failure waiting for a tester** — they type a value
> that cannot be found, see nothing, and file a bug against a product that is working fine.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| **Which environment the suite is moving to** | |
| **A login for it** | Every check is a live query |
| **Permission to write to TestRail** | The corrections are case edits (Rule 6) |
| Confirmation the data is already seeded there | Otherwise run `Seed the Test Data` first — repointing to an empty environment proves nothing |

---

## THE STEPS

### 1 — Audit, changing nothing
Pull every case in the run and extract every value a tester would literally type. Check each against
the new environment. Write a CSV. **This step writes nothing.**

### 2 — Triage, because most flags are not corrections
On Global Search, 26 flags became **3 real corrections**:

| What it looked like | What it actually was |
|---|---|
| 16 × `INV-72` "missing" | References to the **V1 invariant register**, not identifiers at all |
| 7 × `S2-15276` "missing" | Inside a sentence **QUOTED FROM THE PRD**. 🔴 Rule 113 — the quote changes only when the SOURCE changes. Editing these would rewrite a spec quote to match the build |
| 2 × a number returning nothing | **Negative cases**, where returning nothing IS the pass |

> A blanket "fix everything the audit flagged" would have rewritten a specification quote and broken
> three working cases.

### 3 — Correct the identifier, and NOTHING else
Not the wording, not the provenance line, not a helpful note (Rule 111). Each replacement must be
**measured on the new environment** — the record the search actually returns, or a near miss
**probed** to return nothing — never derived by arithmetic from the old value.

### 4 — Re-prove the whole suite
Run `MAKE THE TESTS RUNNABLE` against the new environment. Report: how many work, how many are declared
negatives, how many need the tester to find data.

### 5 — Produce the retest list and hand it over
Everyone who ran an affected case before today got a meaningless result.

---

## THE TRAP THAT MATTERS MOST
🔴 **An identifier inside a quoted source sentence is NOT yours to correct.** Rule 111 says fix the
identifier the tester types. Rule 113 says the quote is untouchable. When they meet, 113 wins — the
identifier there is the spec's own illustration, and the steps tell the tester what to actually type.

---

## DONE WHEN
Every typed value in the suite is proven on the new environment or declared a negative; every
correction is identifier-only; the retest list is with the person executing the run.

**Rules:** 111, 113, 112, 110, 6. **Worked example:**
`build/search-results-integrity/audit_terms_vs_env.py` + `correct_identifiers_for_prod.py`.
