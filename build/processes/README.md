# THE TESTING PROCESSES — say the name, and it runs

> **Who this is for:** anyone. A PO, a manual QA, the QA lead. You do not need to know how any of it
> works — you say the name of the thing you want and the feature it is for.
>
> **What it is:** everything we did for Global Search, cut into nine named jobs that work for any
> other feature — Scheduling, Invoicing, Inventory, anything.

---

## Just say one of these

```
V1 vs V2 CAPABILITY CHECK on Invoicing
SET UP Invoicing
READ THE SPECS for Invoicing
WRITE THE TESTS for Invoicing
CREATE TEST DATA for Invoicing on staging
MAKE THE TESTS RUNNABLE for Invoicing on production
PUT THE TESTS IN TESTRAIL for Invoicing
MOVE THE TESTS for Invoicing to production
TEST THIS FEATURE: Invoicing          ← does all of it, in the right order
```

You do not have to get the wording exactly right. "Does Scheduling V2 still do everything V1 did?"
will do.

---

## What each one is for, in plain words

### 🔴 V1 vs V2 CAPABILITY CHECK — *the most important one*
**The worry it answers:** *"We built version 2. Did it quietly stop doing something version 1 did?"*

This is the one that cannot be done by reading documents. A spec for a new version only describes
what **changes** — it says nothing about everything the feature already did. So a feature can lose a
capability and **every test still passes**, because nobody ever wrote a test for the thing nobody
mentioned.

So this job goes and **reads the actual code of the old version**, writes down everything it could
do, and then checks the new version against that list, one behaviour at a time. Each one comes back
as **kept**, **changed on purpose**, or 🔴 **lost**.

**In short: it proves the new version is old + new, never old minus new.**

### SET UP
Collects the links, logins and access, and checks which version is actually running on each
environment — because the name of an environment tells you nothing. Production was running the old
search one week and the new one the next.

### READ THE SPECS
Confirms we have the **latest** version of every document, and pulls out the exact sentences the
tests will quote. We quote the spec word for word and never reword it — the moment we paraphrase, the
test starts drifting towards describing whatever the app currently does, and then it can never fail.

### WRITE THE TESTS
Turns those sentences into tests a manual tester can follow. Plain English, numbered steps, and
every test says where its expectation came from.

### CREATE TEST DATA
Builds the records the tests need — customers, work orders, parts, whatever — and keeps a
**one-command rebuild**, because redeployments wipe them. It also keeps a **status board** so you can
check what survived before deciding to rebuild anything.

*You never have to ask me to seed data. If a test needs data that isn't there, I create it and tell
you afterwards.*

### MAKE THE TESTS RUNNABLE
Every test is given the **exact text to type**, proven to work on the environment you'll run on. This
is what stops a tester typing something that doesn't exist, seeing nothing, and raising a bug against
a feature that works perfectly.

### PUT THE TESTS IN TESTRAIL
Publishes the tests, adds them to the test run, and gives you a list of anything that changed so
whoever is running them knows what to re-run.

### MOVE THE TESTS
Takes tests written for one environment and makes them work on another. Phone numbers, VINs, work
order numbers and the like are all different between environments — this finds every one and fixes
it.

### TEST THIS FEATURE
All of the above, in order, for a feature we haven't touched before.

---

## What I will ask you for

I ask **before** starting, not halfway through — so a job never dies in the middle. If something is
missing I'll say exactly what and what it costs.

| I'll ask for | For which job | Why |
|---|---|---|
| The feature name, and whether it's new or a version 2 | all | A version 2 needs the V1 vs V2 Capability Check |
| **Access to the code**, and which version to compare against | V1 vs V2 Capability Check | There's no other way to know what the old version did |
| The **spec / PRD link** and the **epic** | Read the specs, Write the tests | The tests quote these word for word |
| Designs, and the technical plan | Read the specs | They're meant to agree with the spec; where they don't, that's a finding |
| Who the **PO** is | questions | Questions go to a named person |
| **Which environment**, and a **login for it** | Create data, Make runnable, Move | |
| **Permission to write to TestRail** | Put in TestRail | I never write there without you saying so |
| **Permission for each Jira ticket** | any finding | Asked per ticket, never once for a batch |

> 🔴 **Please give me a dedicated login, not your own.** Logging in anywhere kicks that account out
> everywhere else — so when I used your account, your browser was signed out mid-run three times and
> the job died each time.
>
> Logins are kept in a temporary folder, never saved into the repository, and they disappear when the
> machine restarts — so I'll need them again next time.

---

## A job must not fail — here's how that's built in

| | |
|---|---|
| **It checks before it starts** | It asks for everything up front and stops there if something's missing, rather than failing halfway through |
| **It can resume** | If it's interrupted at step 12 of 23, it restarts at 12. Branches redeploy and sessions expire — both happened repeatedly |
| **It proves its own work** | "I created it" is never good enough. A record counts as done when **the feature itself can find it** |
| **It tells a product bug from a mistake of mine** | If the data is right and the app is wrong, that's a **finding** — not a reason to redo correct work |

**One rule sits under all of them:** a result isn't proof until we know **it came from the thing we
were testing**, **it's our record and not somebody else's**, and **which build it was on**. That's
[how we prove things](0-HOW-WE-PROVE-THINGS.md) — the thing that stops us reporting a bug that isn't
there, or missing one that is.

---

## The files

| Job | File | Old name |
|---|---|---|
| V1 vs V2 Capability Check | [1-V1-VS-V2-CAPABILITY-CHECK.md](1-V1-VS-V2-CAPABILITY-CHECK.md) | `PARITY` |
| Set up | [2-SET-UP.md](2-SET-UP.md) | `ONBOARD` |
| Read the specs | [3-READ-THE-SPECS.md](3-READ-THE-SPECS.md) | `INGEST` |
| Write the tests | [4-WRITE-THE-TESTS.md](4-WRITE-THE-TESTS.md) | `BUILD CASES` |
| Create test data | [5-CREATE-TEST-DATA.md](5-CREATE-TEST-DATA.md) | `SEED` / `RESEED` |
| Make the tests runnable | [6-MAKE-THE-TESTS-RUNNABLE.md](6-MAKE-THE-TESTS-RUNNABLE.md) | `PROVE TERMS` |
| Put the tests in TestRail | [7-PUT-THE-TESTS-IN-TESTRAIL.md](7-PUT-THE-TESTS-IN-TESTRAIL.md) | `PUBLISH` |
| Move the tests | [8-MOVE-THE-TESTS.md](8-MOVE-THE-TESTS.md) | `REPOINT` |
| Test this feature (all of it) | [9-TEST-THIS-FEATURE.md](9-TEST-THIS-FEATURE.md) | `FEATURE QA` |
| How we prove things (always on) | [0-HOW-WE-PROVE-THINGS.md](0-HOW-WE-PROVE-THINGS.md) | `EVIDENCE GATE` |

The old names still work if anyone uses them. **`RESEED GLOBAL SEARCH STAGING`** and the other
existing keywords are unchanged.

**Global Search is the worked example.** When something here is unclear, look at what that project
actually did — in `build/global-search/` and `build/search-results-integrity/`. The scripts are real
and they run.
