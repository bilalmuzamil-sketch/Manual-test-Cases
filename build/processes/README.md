# THE TESTING PROCESSES — say the name, and it runs

> **Who this is for:** anyone. A PO, a manual QA, the QA lead. You do not need to know how any of it
> works — you say the name of the thing you want and the feature it is for.
>
> **What it is:** everything we did for Global Search, cut into nine named jobs that work for any
> other feature — Scheduling, Invoicing, Inventory, anything.

---

## Just say one of these

```
V1 vs V2 CAPABILITY CHECK on Invoicing     ← the most important one
FEATURE KICK-OFF for Invoicing
LOCK THE REQUIREMENTS for Invoicing
WRITE THE TESTS for Invoicing
SEED THE TEST DATA for Invoicing on staging
MAKE THE TESTS RUNNABLE for Invoicing on production
PUBLISH Invoicing TO TESTRAIL
SWITCH THE Invoicing TESTS to production
BUILD THE COMPARISON DEMONSTRATOR for Invoicing
FULL FEATURE QA on Invoicing               ← does all of it, in the right order

ASK THE PO about Invoicing
RUN THE TESTS for Invoicing on staging
HAND THE RUN OVER for Invoicing
FIND THE ROOT CAUSE of "results look wrong"
PREPARE THE DEFECT TICKETS for Invoicing
HUNT FOR COVERAGE GAPS in Invoicing
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

### FEATURE KICK-OFF
Collects the links, logins and access, and checks which version is actually running on each
environment — because the name of an environment tells you nothing. Production was running the old
search one week and the new one the next.

### LOCK THE REQUIREMENTS
Confirms we have the **latest** version of every document, and pulls out the exact sentences the
tests will quote. We quote the spec word for word and never reword it — the moment we paraphrase, the
test starts drifting towards describing whatever the app currently does, and then it can never fail.

### WRITE THE TESTS
Turns those sentences into tests a manual tester can follow. Plain English, numbered steps, and
every test says where its expectation came from.

### SEED THE TEST DATA
Builds the records the tests need — customers, work orders, parts, whatever — and keeps a
**one-command rebuild**, because redeployments wipe them. It also keeps a **status board** so you can
check what survived before deciding to rebuild anything.

*You never have to ask me to seed data. If a test needs data that isn't there, I create it and tell
you afterwards.*

### MAKE THE TESTS RUNNABLE
Every test is given the **exact text to type**, proven to work on the environment you'll run on. This
is what stops a tester typing something that doesn't exist, seeing nothing, and raising a bug against
a feature that works perfectly.

### PUBLISH TO TESTRAIL
Publishes the tests, adds them to the test run, and gives you a list of anything that changed so
whoever is running them knows what to re-run.

### SWITCH THE TESTS TO ANOTHER ENVIRONMENT
Takes tests written for one environment and makes them work on another. Phone numbers, VINs, work
order numbers and the like are all different between environments — this finds every one and fixes
it.

### BUILD THE COMPARISON DEMONSTRATOR
**The worry it answers:** *"How do I show people what we lost, without arguing about it?"*

A page that **behaves like the old version** — someone types into it and gets a truthful answer,
because the old rules are ported from the code line for line. Beside each answer it says what the new
version does today, measured and dated. A findings table gets read by two people; a page you can type
into survives the question *"well, what about…?"* in a meeting, because somebody types their own
example and the page answers honestly in front of the room.

### FULL FEATURE QA
All of the above, in order, for a feature we haven't touched before.

---

## What I will ask you for

I ask **before** starting, not halfway through — so a job never dies in the middle. If something is
missing I'll say exactly what and what it costs.

| I'll ask for | For which job | Why |
|---|---|---|
| The feature name, and whether it's new or a version 2 | all | A version 2 needs the V1 vs V2 Capability Check |
| **Access to the code**, and which version to compare against | V1 vs V2 Capability Check | There's no other way to know what the old version did |
| The **spec / PRD link** and the **epic** | Lock the Requirements, Write the tests | The tests quote these word for word |
| Designs, and the technical plan | Lock the Requirements | They're meant to agree with the spec; where they don't, that's a finding |
| Who the **PO** is | questions | Questions go to a named person |
| **Which environment**, and a **login for it** | Seed the data, Make runnable, Switch | |
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

## At the end of every feature, I audit myself

Ordered by the QA lead after the comparison demonstrator — the most persuasive thing the Global
Search project produced — turned out to have no process name. **It was found by listing the folder,
not by remembering.**

So when a feature's work finishes: list every deliverable it produced, check each against the named
processes, and report anything that has no home. A gap you name is manageable; a gap nobody notices
costs the next feature. This is Rule 93's learning loop with a concrete step attached.

---

## The files

| Job | File |
|---|---|
| V1 vs V2 Capability Check | [1-V1-VS-V2-CAPABILITY-CHECK.md](1-V1-VS-V2-CAPABILITY-CHECK.md) |
| Feature Kick-Off | [2-FEATURE-KICK-OFF.md](2-FEATURE-KICK-OFF.md) |
| Lock the Requirements | [3-LOCK-THE-REQUIREMENTS.md](3-LOCK-THE-REQUIREMENTS.md) |
| Write the Tests | [4-WRITE-THE-TESTS.md](4-WRITE-THE-TESTS.md) |
| Seed the Test Data | [5-SEED-THE-TEST-DATA.md](5-SEED-THE-TEST-DATA.md) |
| Make the Tests Runnable | [6-MAKE-THE-TESTS-RUNNABLE.md](6-MAKE-THE-TESTS-RUNNABLE.md) |
| Publish to TestRail | [7-PUBLISH-TO-TESTRAIL.md](7-PUBLISH-TO-TESTRAIL.md) |
| Switch the Tests to Another Environment | [8-SWITCH-TO-ANOTHER-ENVIRONMENT.md](8-SWITCH-TO-ANOTHER-ENVIRONMENT.md) |
| Build the Comparison Demonstrator | [10-BUILD-THE-COMPARISON-DEMONSTRATOR.md](10-BUILD-THE-COMPARISON-DEMONSTRATOR.md) |
| Full Feature QA (all of it) | [9-FULL-FEATURE-QA.md](9-FULL-FEATURE-QA.md) |
| Ask the PO | [11-ASK-THE-PO.md](11-ASK-THE-PO.md) |
| Run the Tests | [12-RUN-THE-TESTS.md](12-RUN-THE-TESTS.md) |
| Hand the Run Over | [13-HAND-THE-RUN-OVER.md](13-HAND-THE-RUN-OVER.md) |
| Find the Root Cause | [14-FIND-THE-ROOT-CAUSE.md](14-FIND-THE-ROOT-CAUSE.md) |
| Prepare the Defect Tickets | [15-PREPARE-THE-DEFECT-TICKETS.md](15-PREPARE-THE-DEFECT-TICKETS.md) |
| Hunt for Coverage Gaps | [16-HUNT-FOR-COVERAGE-GAPS.md](16-HUNT-FOR-COVERAGE-GAPS.md) |
| How We Prove Things (always on) | [0-HOW-WE-PROVE-THINGS.md](0-HOW-WE-PROVE-THINGS.md) |

**`RESEED GLOBAL SEARCH STAGING`** and the other existing keywords are unchanged — "Seed the
Test Data" is the name of the process, `RESEED` is still the keyword for a rebuild.

**Global Search is the worked example.** When something here is unclear, look at what that project
actually did — in `build/global-search/` and `build/search-results-integrity/`. The scripts are real
and they run.
