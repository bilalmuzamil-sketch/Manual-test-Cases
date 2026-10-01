# THE FEATURE QA PROCESSES — call one by name, and it must not fail

> **What this is.** Everything we did for Global Search, cut into **nine named processes** you can
> call for any other feature. Each one says what it produces, **what to give me before it starts**,
> the steps, the traps that cost us time, and how it proves it is done.
>
> **Why it exists.** Global Search took weeks and most of the cost was not the testing — it was
> rediscovering the same twelve traps. None of them are specific to search. They will all happen
> again on Scheduling, Invoicing, Inventory or anything else.

---

## How to call one

Say the keyword and the feature. That is the whole interface.

```
PARITY Invoicing                     ← the most important one, start here on any V2
ONBOARD Invoicing
INGEST Invoicing
BUILD CASES Invoicing
SEED Invoicing STAGING               ← or QA / LIVE
PROVE TERMS Invoicing LIVE
PUBLISH Invoicing
REPOINT Invoicing TO LIVE
FEATURE QA Invoicing                 ← runs the whole pipeline in order
```

**"You MUST not fail" is a design requirement, not a hope.** Every process therefore:

1. **Gates before it starts.** It names exactly what it needs from you and stops there if something
   is missing — it never begins and dies halfway. The gate is the first section of every file.
2. **Is resumable.** Long work writes its state to a file and can restart at a step number, because
   a branch redeploys and a session expires mid-run. It happened five times on Global Search.
3. **Proves its own output.** "Created" is never "done". A record is done when the **feature's own
   interface** returns it; a case is done when the term in it is proven on the target environment.
4. **Separates a PRODUCT finding from a MY-WORK failure.** If the data is right and the build is
   wrong, that is a result, not a reason to stop and redo the work.

---

## The nine processes

| Call | What it does | Full file |
|---|---|---|
| **PARITY** `<feature>` | 🔴 **The most important one.** Read how the feature works TODAY in the product repository, then prove the new version still does all of it. Catches V1 − V2. | [P1-PARITY.md](P1-PARITY.md) |
| **ONBOARD** `<feature>` | Collect the sources and access, and MEASURE which environment runs which version. | [P2-ONBOARD.md](P2-ONBOARD.md) |
| **INGEST** `<feature>` | Prove we hold the current spec, and pull the exact sentences the cases will quote. | [P3-INGEST.md](P3-INGEST.md) |
| **BUILD CASES** `<feature>` | Author the suite from those quoted sentences. | [P4-BUILD-CASES.md](P4-BUILD-CASES.md) |
| **SEED** `<feature> <env>` | Build the data the cases need, with a one-command rebuild and a status board. | [P5-SEED.md](P5-SEED.md) |
| **PROVE TERMS** `<feature> <env>` | Give every case a search term/value PROVEN to work on that environment. | [P6-PROVE-TERMS.md](P6-PROVE-TERMS.md) |
| **PUBLISH** `<feature>` | Push to TestRail, sync the run, hand over the workbook and the retest list. | [P7-PUBLISH.md](P7-PUBLISH.md) |
| **REPOINT** `<feature> TO <env>` | Move an existing suite to a different environment without breaking it. | [P8-REPOINT.md](P8-REPOINT.md) |
| **FEATURE QA** `<feature>` | The umbrella: runs P2 → P1 → P3 → P4 → P5 → P6 → P7 in order. | [P9-FEATURE-QA.md](P9-FEATURE-QA.md) |

**P0 is not callable — it is always on.** [P0-EVIDENCE-GATE.md](P0-EVIDENCE-GATE.md) is the standard
every one of the nine reports against: a result is not evidence until it is **attributed, identified
and dated**. It is the difference between "the search returned something" and "the search returned
OUR record, matched on the field we are testing, on a build we have named".

---

## What I will ask you for, at a glance

Each process asks only for what it actually needs. Nothing here is optional politeness — if it is
missing, the process stops at the gate rather than guessing.

| I need | Which processes | Why |
|---|---|---|
| The **feature name** and whether it is NEW / V2-UPGRADE / REVIVAL | all | A V2 triggers PARITY; a new feature does not have one |
| **Repository access** + the V1 commit or branch, and the V2 branch | PARITY | There is no other way to know what V1 actually did |
| **Spec / PRD link**, the epic key, designs, tech plan | INGEST, BUILD CASES | The expected result is quoted from these, verbatim |
| **Environment URLs** and which one to work on | ONBOARD, SEED, PROVE, REPOINT | |
| **Login for each environment** — ideally a DEDICATED account | SEED, PROVE, REPOINT | A login expires the previous session; using yours kills your browser mid-run |
| **Write permission for TestRail**, per batch | PUBLISH | Standing Rule 6 — I never write to TestRail without it |
| **Permission to create Jira tickets**, per ticket | any, on a finding | Standing Rule 62 — per ask, never a blanket approval |

Credentials live in `/tmp`, `chmod 600`, and are **never committed** — this repository is public
(Standing Rule 82). They vanish with the container, so you re-supply them per session.

---

## Where the detail lives

These files are the **callable layer**. They do not re-state procedure that already has a home —
duplicated procedure drifts, and this workspace has been bitten by that before. Each process points
at its canonical skill and rules:

- Deep procedure: `build/skills/` (00-COMMON-CORE first, then the numbered skill)
- The rules themselves: `build/rules/RULES-*.md` — **read the rule in its file before applying it**
- Proven API recipes and environment facts: `build/APP-ACTIONS-PLAYBOOK.md`
- The worked example for every one of these: `build/global-search/` and
  `build/search-results-integrity/`

**Global Search is the reference implementation.** When a step here is unclear, go and look at what
that project actually did — the scripts are real, they run, and the traps are written down beside
the code that hit them.
