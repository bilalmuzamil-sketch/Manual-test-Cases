# SKILL 20 · SEEDING (AND RESEEDING) TEST DATA FOR ANY FEATURE AREA

**Status:** canonical · created 2026-09-17 · all projects, permanent · a complete cold-start
specification. **Use it the moment a feature's cases need data that is not already on the
environment** — which is almost always.

**Authority it serves:** Rule 14 (never mark anything NOT-VERIFIED for a missing data state — seed it),
the rule that a case is not finished until its data is seeded or explicitly accounted for, Rule 12
(verified means observed), Rule 74 (no present feature left un-build-verified), Rule 82 (secrets),
Rule 95 (the Token-Discipline Charter), and the identifier-correction rule.

**Reference implementation, exercising every part of this skill:** `build/global-search/seeding/`.
**Schema:** `build/testing-tools/seeding/MANIFEST-SCHEMA.md`.
**Scaffold:** `python3 build/testing-tools/seeding/scaffold_seeding.py <slug> "<Feature Name>"`.

---

## §0 · THE ONE THING TO UNDERSTAND BEFORE ANYTHING ELSE

**The engine is generic. Only the manifest is per-feature.**

`seed.py` knows nothing about any feature. It reads a declarative manifest and does four things per
record — **find · create if absent · verify every declared field · repair what is wrong** — and it is
*find-or-create*, so it is safe to run repeatedly. Adding data for a new case is **one manifest
entry**, never a code change.

That is why the second feature area costs a fraction of the first: **the first one wrote down the
endpoints, the payload shapes and the find strategy.** If you are editing engine logic for a feature,
stop — either the manifest can express it, or you have found a genuinely new API shape and the engine
gains one *general* capability, never a feature-specific branch.

---

## §1 · THE SEQUENCE — nine steps, in this order, because each depends on the last

### 1. Read the CASES, not a summary of them
Open the case bodies and extract **what the tester will literally type, click or open**. A handoff, a
task card and a previous session's report are all summaries. On Global Search the summary said the
Quick Actions section needed no new records; reading the bodies found **three named example records
that existed nowhere on the branch** and one example term that returned nothing at all — which turned
out to be a product defect. **A term named only as "for example" still gets typed by somebody.**
Script the extraction (Charter clause 2); never pull hundreds of case bodies into context.

### 2. Measure the environment BEFORE creating anything
Some of what the cases need is already there. **Seeding a duplicate is worse than seeding nothing** —
it corrupts count-based expectations and it is tedious to unpick. Record what exists, then seed only
the difference.

### 3. Write the DESIGN RULE — one sentence, before a single record
The sentence that makes one family of records serve dozens of cases. In the reference implementation
it was: *name the CUSTOMER and the VENDOR after the search term, and every dependent record inherits
the match.* That one decision collapsed dozens of separate seeds into one coherent family, and it is
why the whole universe is reachable by typing three letters. **Find your equivalent before you start
typing records** — it is the difference between a seed set and a pile of records.

### 4. Choose keywords that cannot collide
Tag everything `ZZAUTOTEST`. Then check the **short** form of your search term against the live
estate: the reference implementation's `Fibridge` fuzzy-matched the word "Bridge" inside hundreds of
unrelated addresses. **Measure on the term the tester will actually type**, and record which term is
the safe one.

### 5. Write the manifest, with `serves` and `_why` on every record
`serves` is the audit trail that satisfies the seeded-or-accounted-for rule; `_why` is what stops a
future session deleting something load-bearing. Generate the JSON from a Python file — **never
hand-edit generated JSON.**

### 6. Seed, then VERIFY — they are different steps
🔴 **A reseed is finished when the VERIFIER passes, never when the seeder prints its count.**
*"The record exists"* is not *"the feature returns it"*. Write one check per thing a tester will
actually do, and check the **IDENTITY** of what comes back, never the row count — a count of 1 has
already produced a false PASS on a real regression here.

### 7. Make it idempotent, and PROVE it by running it three times
Every step measures first and creates only the difference. **A third consecutive run must change
nothing.** That is not true until you have watched it happen.

### 8. Reconcile the cases against what the environment actually assigned
Server-assigned identifiers — work-order numbers, sale numbers, PO numbers, invoice numbers — are
**unchoosable**. Where a case names one that differs from reality, correct **the identifier and
nothing else**, and prove the replacement three ways: the feature returns it, the record **opens** as
the tester, and the near miss is genuinely absent. Prefer an identifier that **survives a reseed**.

### 9. Write down every trap while it is still fresh
One page, in the kit, with **the symptom each trap presents as** — not just the fact. That page is the
entire reason the next reseed is quick.

---

## §2 · THE RESEED CONTRACT — what "super quick, no rediscovery" actually requires

A feature's data is only genuinely reseedable when all five hold:

| # | Requirement | Why |
|---|---|---|
| 1 | **A keyword per environment**, registered in `build/global-search/seeding/RESEED.md` — `RESEED <FEATURE> QA` / `RESEED <FEATURE> LIVE` | The QA lead says two words; nobody reconstructs a procedure |
| 2 | **One script, not a list of steps in a document** | The steps depend on each other, and **the verification step can be a different program per environment**. Running the wrong one reports a dead environment that is perfectly healthy |
| 3 | **State keyed by universe AND environment** | One estate's ids written into another's state file made four records read as MISSING while sitting there |
| 4 | **The verifier is the last step and it gates the result** | See §1.6 |
| 5 | **The state files are committed** | Git is the only durable store; the container and `/tmp` are not. Records that cannot be found by searching cannot be de-duplicated by searching — **lose their captured ids and the next run creates twins** |

**Measure the reseed in API CALLS, not seconds** (seconds vary with the network; calls are the real
cost). The reference implementation went 193 → 165 calls by replacing per-record walks with one
query — e.g. proving a status spread with a single search instead of 22 individual reads.

---

## §3 · THE TRAPS THAT ARE NOT FEATURE-SPECIFIC — every one of these cost real hours

| Trap | Symptom it presents as | The rule |
|---|---|---|
| **The branch was redeployed** | Data "disappeared"; behaviour changed overnight | **CHECK THE BUILD MARKER BEFORE EXPLAINING ANY CHANGE IN BEHAVIOUR.** Blaming a slow index for a redeploy once withdrew four TRUE findings |
| **A 2xx is not proof a write landed** | Everything says 201, nothing changed | Always read the record back. One endpoint answers 201 to a name it silently ignores |
| **A sparse patch is ignored** | The field keeps reverting | Some endpoints want the WHOLE record with the field replaced |
| **Written name ≠ read-back name** | A permanent, unfixable "gap" | Declare the translation (`read_as`) |
| **`?search=` silently matches nothing** on some endpoints | Records read as missing and get recreated — duplicates | Verify those by captured id, not by search |
| **A record with no list endpoint of its own** | You check the parent and call it present | The parent exists whether or not the child does. Read the child out of the parent |
| **A single empty read believed** | A CREATE, and therefore a duplicate | Retry before believing a miss; keep a `control` |
| **A control that belongs to one estate** | A healthy environment looks broken | Calibrate against the environment actually in front of you |
| **Sequential numbers collide across prefixes** | A "must return nothing" precondition quietly starts returning something | Re-check negative preconditions after **any** reseed of **any** suite |
| **A wrong-shaped field 500s two calls later** | An error that names none of the real cause | Record the exact accepted shape (e.g. a term wanted as `"Net 30"`, not `30`) |
| **Fulfilled/terminal records drop off their list endpoint** | A finished step reads as unfinished; a duplicate every run | Decide "done" by the thing the step PRODUCES, not by the row still being listed |
| **Permission removal that silently does not happen** | 201 returned, permission still held | Read it back; dependent permissions may have to be dropped together |
| **A transient network failure inside a long run** | A false red that sends you debugging real data | Retry **transport** errors only — never retry away a real negative |

---

## §4 · WHAT IS NEVER SEEDABLE — say so, don't fake it

Some preconditions are **infrastructure or tester technique**, not missing data. Cases resting on them
are **Blocked with the reason**, never Failed, and never quietly marked ready:

- **A second tenant/organisation** (two *locations* is not two organisations).
- **Backdated activity** — "yesterday", "last week" — where the API takes no timestamp.
- **A first-time / empty state**, which needs a fresh user or a private window rather than a record.
- **Offline, screen-reader, mobile-viewport, rollout** conditions.
- **An exact tie on a sortable field** where the API will not let you set the tiebreaker.

Record each one with **what would unblock it and who owns that** — an unseedable precondition is an
outstanding item, not a silent gap.

---

## §5 · SAFETY — the standing constraints this work runs under

- **Secrets live in `/tmp` at `chmod 600` and are NEVER committed — the repo is public.** The engine
  takes the host from the profile file, so the profile file is the secret. Run the real scanner
  before every commit; exit 1 means refuse. **Never claim a scan that did not run.**
- **Staging, QA and the production TEST account are disposable** — act freely, tag `ZZAUTOTEST`,
  restore what you change. **TestRail is the one real production system**: no case write without the
  QA lead's go-ahead.
- **A fresh login expires that user's previous session** — one login per production run, and
  coordinate before using a shared quick-login.
- **Commit and push after every step, path-scoped.** `git add -- <paths>`, never `-A`.

---

## OUTSTANDING — what I need from you

Nothing outstanding for this skill. The reference implementation is `build/global-search/seeding/`;
the next feature area starts with the scaffold command at the top of this file.
