# SKILL 19 — THE V1→V2 PARITY SUITE, END TO END

**Operator form of Standing Rule 109.** Added 2026-09-14. QA lead, on the Global Search pass that
produced it: *"this is what you are meant for and this is your job, always, whenever I ask you to do
that again."*

**WHEN IT RUNS.** The task is any form of *"make sure V2 can still do everything V1 could."* Words that
trigger it: regression suite for a V2, parity, *"nothing that worked before should stop working"*,
*"the customer must not come back and say this worked in V1."*

**WHAT IT PRODUCES — five artefacts, and the suite is not done without all five.**

| # | Artefact | Why it exists |
|---|---|---|
| 1 | **The V1 capability list, extracted MECHANICALLY from V1's source at a named commit** | Memory and prior summaries both miss things. The code is the only complete record |
| 2 | **A test case for every capability**, seed-then-search, expectation = V1's behaviour | The deliverable |
| 3 | **A coverage proof checked LIVE against the test-management tool, in BOTH directions** | Turns "I think it's complete" into something a reviewer can re-run |
| 4 | **A source audit proving every case cites V1**, not the V2 document | Rule 109(c). A case sourced to the V2 spec is testing the wrong thing |
| 5 | **A ticket candidate for every capability that is LOST** | A test that fails and goes nowhere protects nobody |

**HOW IT RELATES TO 17.** Skill 17 derives the invariant set and the impact matrix — *what changed*.
This skill is the pipeline that turns that into a **built, proved, seeded, handed-off suite**.
`V1-BASELINE-FROM-SOURCE.md` feeds both. Run 17 first if the project needs a delta analysis; run this
one always.

---

## 0 · THE ONE RULE THAT DECIDES EVERYTHING

> **The only question is: COULD A USER DO THIS IN V1?**
> If yes, there is a case. **The V2 specification is not consulted to decide that** — not when it is
> silent, not when it omits the field, and **not when it removes the capability on purpose.**

The V2 document decides whether a loss is **acceptable** — the PO rules on that, after the test runs.
It never decides whether the loss is **tested**.

🔴 **AND THE MIRROR: this rule is SCOPED.** It governs the parity cases only. A V2 feature V1 never had
is governed by the V2 documents (Rule 57), and *"V1 did not do it"* is **never** a reason to skip
testing a new feature. Run **Rule 109's five-row which-standard-applies table** per case, never per
project. A V2 project normally runs two suites side by side under two standards, in one run.

---

## 1 · PIN THE BASELINE

1. **Choose the V1 branch and justify it**, then record the **head commit SHA**. Everything downstream
   cites that SHA.
2. **Prove production parity** where you can — e.g. diff the feature's files between the release branch
   and the development branch and state whether they are byte-identical. If they differ, say which one
   you took and why.
3. Record it once, in the suite's own folder. Every case's SOURCE line will point at it.

**Never skip to step 2 with "I already know what V1 did."** You do not. That belief is what this skill
exists to defeat.

## 2 · EXTRACT THE CAPABILITY LIST — BY SCRIPT, NOT BY READING

**Write a script that walks the V1 source and enumerates the capabilities.** For a search feature that
means every column inside every query's search expression. For a permissions feature, every gate. For a
list, every filter and sort. **The script is the evidence; run it and keep it.**

```bash
# the shape that worked: pull every COALESCE(...) column out of each fetcher's search expression
python3 - <<'PY'
import re
src=open(FILE).read().split('\n')
# locate each "as search" expression, walk back to its opening CONCAT/REPLACE,
# then regex every column out of the block and print it under its method name
PY
```

Then add the **behaviours** (limits, ordering, debounce, casing, keyboard, scoping, permissions, empty
states) from the same source, as a numbered invariant register `INV-01…INV-nn`, each with its
`file:line`.

**Output of this step:** a table of *N capabilities*, each with a code citation. On Global Search it was
**65** — 37 searchable fields and 28 behaviours.

## 3 · MAP EVERY CAPABILITY TO A CASE — AND CHECK BOTH DIRECTIONS

Build a data table of `capability → V1 citation → [case ids]`, then verify it **live against the test
management tool**:

- **Forward:** every capability has at least one case, and that case **exists**.
- **Backward:** every case in the section **serves a capability**. A case serving none is either dead
  weight or a sign you stretched the rule into V2-only territory.
- **In-run:** every mapped case is actually **in the test run**. A case outside the run will not be executed.

**Tool:** `build/testing-tools/parity_coverage_proof.py` (see §8). It takes your capability table as
JSON and reports the three checks. **A number you cannot re-derive is not a result.**

## 4 · WRITE THE CASES

- **Seed-then-search.** The preconditions name the exact seeded record and the exact field value; the
  steps search a keyword that exists **only** in that field. A pass then proves the field is
  *searchable*, not merely *displayed*.
- **The expected result states V1's behaviour**, in plain words, with what the user could do.
- **The SOURCE line leads with V1** — repo, commit, file, line range — and names the V2 document
  afterwards **as information only**, never as the authority.
- **Every case says what to do if it fails**: record the exact query and result, and flag it; do not
  raise a defect against a deliberate decision before the PO has ruled.
- **Titles ≤ ~80 characters.** Plain layman words; no case ids, no spec anchors, no jargon.

## 5 · CLASSIFY EVERY DIFFERENCE — REROUTED OR LOST

Per Skill 17 §6.0, one question per changed behaviour: **can a user still reach the same outcome by any
route at all?**

- **REROUTED** → rewrite or retire the V1 case. A case asserting the old *mechanism* is a defect factory.
- **LOST** → the case **stays**, asserts the V1 capability, **and becomes a PO ticket candidate.**

**A row with no recorded verdict is an unfinished row.**

## 6 · SEED THE ENVIRONMENT, AND COMMIT WHAT YOU SEEDED

- Tag throwaway data `ZZAUTOTEST`.
- **Make every keyword unique across the whole dataset**, so a search for it can only match via the
  field it was planted in. This is what makes a negative result meaningful.
- **Write the real ids and system-assigned numbers to a committed state file.** The container and `/tmp`
  are ephemeral; the next session needs them.
- **Build a control into the data**: two records differing in exactly one attribute. That is what turns
  "it didn't find it" into "it didn't find it *because of this field*."

## 7 · BUILD-VERIFY THE SURFACE BEFORE HANDING OVER

Log in and look. Rewrite every precondition against what is actually on screen — the real trigger
control and its test id, the real layout, the real group headings and their casing, how to close it.
A precondition describing a UI that does not exist wastes the tester's whole run.

---

## 8 · THE TWO SCRIPTS — RUN THEM, DO NOT RE-INVENT THEM

| Script | What it proves |
|---|---|
| `build/testing-tools/parity_coverage_proof.py` | Every capability has a case · every case exists · every case is in the run · **no case serves no capability** |
| `build/testing-tools/parity_source_audit.py` | **Every case's SOURCE line leads with V1**, cites the commit and a V1 file, and does not name the V2 document as its authority |

Both take a project JSON and print a bounded summary. **Re-runnable = checkable by someone who does not
trust you.** That is the point.

---

## 8a · VERIFYING THE ENVIRONMENT — the half that is easy to get wrong

**Coverage can be perfect and the run still fail on day one.** Seeded data is not a fact you record
once; it is a fact you re-prove before every handover.

**The order that works:**
1. **Mint your own session** — `POST /api/quick-login {"key":"admin"}`. Never ask anyone for cookies
   (Rule 107). Capture the **rotated `PHPSESSID`** from `Set-Cookie` or everything after it 409s.
2. **Set the location** — `GET /api/staff/my-workplaces`, then `POST /api/iam/change-location`.
   Skip this and workplace-scoped data is invisible, which reads as *"the seed is gone."*
3. **Prove every probe on a record you KNOW exists, before believing any negative** (Rule 104).
   `?search=` on list endpoints can answer 200 and match nothing at all.
4. **Re-derive the ids from live lookups.** Do not trust a committed seed-state file — ids change when
   an environment is refreshed, and a stale id makes every downstream call fail in a way that looks
   like a product defect.
5. **Classify every case by what it NEEDS**, not by whether you seeded something: ready · self-seeding
   during the run · needs a setup step · blocked. Anything not "ready" gets the recipe beside it.
6. **Search the repo for setup recipes BEFORE declaring a gap.** Roles, locations, impersonation and
   org switching are solved problems with recipes in the playbook. Declaring them "not ready" wastes
   everyone's time and is a failure of the blocker-search rule.

## 9 · THE TRAPS — EVERY ONE OF THESE WAS HIT FOR REAL

| Trap | What it looks like | The guard |
|---|---|---|
| **Excluding on the V2 spec** | *"V2 deliberately changed this, so it is correctly excluded — not a gap."* Eleven behaviours were written off this way; **four were real losses with no test anywhere** | §0. The spec never subtracts a case |
| **Editing a case towards the V2 spec** | A regression case rewritten from *"opens the catalogue part"* to *"opens the inventory part"* because the spec changed — with a note on the case explaining the change | **A case rewritten to match the thing it tests cannot fail.** Rule 109(d) |
| **"A nearby case covers that"** | A customer-phone case read as covering vendor phone; a fuzzy make case as covering model; a work-order case as covering part sales. **Fourteen capabilities missing this way, including "find a customer by company name"** | Tick fields off **one at a time from the extracted list**. Never by eye |
| **Display ≠ searchable** | Cases proving a field is *shown* in a result row mistaken for proof it is *searchable* | Different behaviours. Check each one individually |
| **Fuzzy ⊅ substring** | Assuming a new fuzzy matcher is a superset of the old substring match. It is not — a short fragment can score below the threshold | Test the fragment explicitly |
| **Negative without a control** | Reporting *"X returns nothing"* for a record that **was never created**. Proves nothing | Rule 104. Prove the record exists, is indexed, and is reachable another way, **first** |
| **A wrong inference from a control** | A control failing the *same* way read as "my payload is wrong" when it actually means **the operation is broken for both cases** | State what the control would prove **before** running it |
| **Protecting a V1 bug** | A code-derived behaviour that is really a defect becomes an invariant you defend | Rule 96. Looks like a bug → **PO decision item**, never a silent invariant |

| **A broken probe read as missing data** | `?search=` on a list endpoint answers 200 and matches nothing — even for a record that exists. Three "the seed is gone" reports were nearly filed from it | Prove the probe on a known record first (Rule 104); page and filter client-side |
| **A rotated session read as an expired one** | Every call 409s after a login, and you conclude "this environment expires sessions in minutes" | The `PHPSESSID` **rotated** and you did not capture `Set-Cookie`. Read it on every response |
| **Scoped data read as absent** | Inventory and parts come back empty after a fresh login | You did not `POST /api/iam/change-location`. `default_workplace` is `"None"` |
| **Duplicate data read as a dedup defect** | The same record appears twice in results | Compare the **ids**. Different ids = two real records from a double-run seeder, not a product bug |

**Tooling traps:** TestRail `refs` is comma-separated and **strips the space after a comma** — avoid
internal commas. Its API takes **`&` separators only** — a second `?` returns HTTP 400. Text fields are
**wrapped in `<p>` on write**, so exact-equality read-back is a false negative; verify by content.
A run sync must be **union-only** — a partial `case_ids` list **DELETES tests and their results**.
Playwright's `Control+K` (capital) sends Ctrl+**Shift**+K; use `Control+k`.

---

## 10 · DEFINITION OF DONE

- [ ] Baseline commit pinned, production parity stated
- [ ] Capability list extracted **by script**, every row with a `file:line`
- [ ] Every capability mapped to a case; **coverage proof re-run and clean in all three checks**
- [ ] **Source audit clean** — every case leads with V1
- [ ] Every difference verdicted **REROUTED** or **LOST**; every LOST has a case **and** a ticket candidate
- [ ] Environment seeded, keywords unique, control records present, state file committed
- [ ] **Every case ends SEEDED, NEEDS-NO-DATA or SELF-SEEDING, written into the manifest (Rule 111)** — a case with unaccounted data is not done, because it fails misleadingly and produces false defects
- [ ] Preconditions build-verified against the real screen
- [ ] Run synced **union-only**, before/after counts recorded, **zero lost**
- [ ] Handoff carries both halves — **run the suite** and **file the tickets** — plus the charter (Rule 95)

## OUTSTANDING — what I need from you

State it, every time, even if the answer is *nothing outstanding* (Rule 36).

---

**Worked example, end to end:** `build/global-search/v1-parity-audit-2026-09-14/` on
`origin/claude/global-search-v1-baseline-6ax9ul` — coverage proof, source audit, ticket candidates,
handoff and every audit log. **That branch is superseded on SHARED files: read the folder, never merge
the branch.**
