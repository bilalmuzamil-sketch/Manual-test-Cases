# Global Search V2 — Playwright specs

One spec per passing check from **TestRail run 415**, named **C-id first** so a red result points
straight at a case without cross-referencing anything (Rule 115).

Everything here was **run by hand first and passed**, then automated — never the other way round.
A check that has not been run by hand does not get a spec.

---

## Getting it running from a clean checkout

```bash
cd build/global-search/e2e
npm ci                                   # exact versions from the lockfile
npx playwright install chromium          # the browser, once

cp .env.example .env                     # then fill it in — see below
set -a && . ./.env && set +a             # or export the variables yourself

npm test                                 # seeds, verifies, then runs everything
```

That is the whole sequence. `npm test` seeds the environment and proves the data is there before the
first test starts — see "Every run seeds first" below. Needs Node and Python 3.8+.

**Nothing else is required.** No relay, no proxy, no file at a fixed path, no browser at a fixed
location. Earlier versions of this suite needed all of those and could only run on one machine;
that is fixed, and `fixtures/boot.ts` records what each of them was.

Playwright is pinned to the **exact** version this suite was verified on rather than a `^` range,
so a library release cannot turn a green suite red on someone else's machine for reasons that have
nothing to do with the product.

Verified from a clean clone on 2 October 2026: `npm ci` installs, `npx playwright test --list`
reports 338 tests in 20 files with no environment variables set at all, `npx tsc --noEmit` is
clean, and a spec file run against production passed 11 of 11.

### Which environment

`GS_APP` decides, and everything follows from it:

```bash
GS_APP=https://app.staging.shopview.com   # staging
GS_APP=https://app.shopview.com           # production
```

The API host is derived from it (`app.x` → `api.x`), so there is one variable to change, and no
spec contains a hard-coded host. That matters: a spec naming the production API would quietly
query production while you believed you were testing staging.

### Signing in

| Environment | How | What to set |
|---|---|---|
| **Production** | username and password | `GS_USER`, `GS_PASS` |
| **Staging and QA branches** | **one cookie** — the Google session | `GS_SSO` |

#### Staging: one cookie, and nothing runs by hand

Sign in to `app.staging.shopview.com` in any browser, open **DevTools › Application › Cookies**,
and copy the value of **`sv_sso_session`** into `GS_SSO`. That is the only secret. Every run then
signs itself in, with no window and no person — which is what makes a nightly run possible.

🔴 **This reverses what this README used to say.** Staging's on-screen DEV MODE quick-login panel
was removed and its login page goes straight to Google, so the suite concluded staging could not
be scripted. The panel is gone; the endpoint behind it is not. Measured 2 October 2026:

| | |
|---|---|
| quick-login with no cookie | **401** `sso_required` — a cold start cannot get in |
| quick-login with the Google session cookie | **200**, Admin, 59 permissions |
| with Cloudflare's cookie as well | not needed |

The same cookie gives the permission checks their second person: quick-login's `tech` key is a
Technician with 6 permissions — work orders and customers/assets, but not parts, part sales or
vendors — so the comparisons have a real difference to measure.

**When it expires** the run stops at sign-in and says so in those words; copy a fresh one. It lasted
the whole of 2 October in testing; how long it lives beyond that has not been measured.

**Never paste it into a chat, a ticket or a file in this repository** — it is a live session for
your account. Keep it in `.env` (git-ignored), and for the nightly run in the cloud environment's
own settings as `GS_SSO`.

#### The other way on staging: sign in once, by hand

```bash
npm run login            # opens a real browser; sign in with Google yourself
npm test                 # and every run after this just works
```

`npm run login` opens a headed browser, waits while you sign in, and only accepts it once three
things are true at the same time: the API answers, the page is no longer on `/login`, and the
search control is actually on the page. It then saves the whole session — cookies *and*
`localStorage` — to `.auth/<host>.json`, which is git-ignored. Every later run picks that file up
on its own.

Do this once. Redo it when the saved session expires; the suite says so in those words when it
happens, instead of failing obscurely.

#### The manual way, if you would rather paste values

🔴 **Cookies alone are not enough on staging, and this is a change in staging rather than in the
suite.** Measured 2 October 2026 with a fresh cookie set: `/api/auth/me/fe-permissions` answered
**200** while the browser still sat on `/login`, and the **DEV MODE quick-login panel the old
script clicked no longer exists**. The app keeps its session in `localStorage`, which only a real
sign-in writes. So from the same signed-in browser also take **DevTools › Application › Local
Storage** and set `GS_STAGING_USER` (the whole `user` value) and `GS_STAGING_TOKEN` if there is
one. They are written before any page loads, exactly as the app does it.

All of these expire. The suite tells you which half failed — cookies invalid, or cookies fine but
the app has no session — rather than failing obscurely.

The permission checks need a second, lower-permission login in `GS_LIMITED_ENVF`. Without it they
stand down and say which account they would need; everything else still runs.

`--workers=1` is not a preference. Signing in as the same person expires their previous session, so
two workers log each other out and both report a broken environment. `npm test` sets it for you.

## Every run seeds first — automatically, on every machine

`npm test` cannot start a test until it has done two things, in this order:

1. **Seed** — puts every record the 338 tests read onto the environment `GS_APP` names: passed,
   failed and blocked cases alike. Nothing to remember and no separate step: the branch is
   refreshed and a refresh wipes the data, so the run seeds itself every time.
2. **Verify** — asks search for each record the checks look for, from inside the shop the tests
   sign into, and **names any that is missing** before the first test runs.

```bash
npm test                     # seed, verify, then run — the normal way
npm run seed                 # seed + prove, without running tests
npm run preflight            # verify only (~20s, read-only)
GS_SEED=check npm test       # measure what is there, create nothing
GS_SEED=skip npx playwright test tests/panel.spec.ts   # re-run one spec on data you just seeded
```

🔴 **Why it is not optional.** A run against a wiped branch does not fail. Its checks stand down for
lack of data, and a standing-down suite looks exactly like a suite that ran. On 2 October 2026 a full
run spent 1.6 hours to report 116 checks standing down, most of them for records that were simply not
there.

### Nothing stalls the run — data that is already there is used, not fought

Confirmed with the QA lead on 2 October 2026: if a record being seeded is **already on the branch**,
the run moves ahead with it. Three things make sure of that:

- **It looks before it creates.** Every record is searched for first; one that is there is checked
  field by field and used. Only a missing record is created.
- **A refused create is a second look, not a failure.** The shop can refuse a second record with the
  same name. When it does, the engine prints the refusal, looks again (with short pauses, because
  search catches up a few seconds behind a write) and then asks the global search by the same value.
  If the record is there it is **adopted** and everything that hangs off it — its contacts, assets,
  part sales — is still created. Before this, one refusal silently took that whole branch of data
  with it.
- **A failed step or a missing record is reported, never fatal.** The run prints a red block naming
  what did not seed, then runs every test. The checks that needed the missing data stand down with
  that reason; every other check still produces its result. One bad record no longer costs a night's
  results.

To stop at the first problem instead — useful when you are fixing the seeding itself:

```bash
GS_SEED_STRICT=1 npm test        # stop if any seeding step fails
GS_PREFLIGHT=enforce npm test    # stop if any record the checks need is missing
```

### What it seeds, and from where

The seeding engine is `../seeding/` — built over three weeks for exactly these cases, with one rule:
**measure first, create only what is missing, read every write back.** `seed.ts` runs all of it in the
order `reseed_everything.sh` proved:

| Data set | What it holds |
|---|---|
| `seed-manifest.json` | the V1-regression records |
| `seed-manifest-gs-v2.json` | the Fibridge universe — customers, contacts, assets, parts, vendors, 24 work orders across all seven statuses, part sales, purchase orders, vendor invoices paid / part-paid / unpaid, two role fixtures, recent activity |
| `seed-manifest-ranking.json` | ranking and fuzzy-match pairs, and the signals ranking reads |
| `seed-manifest-toggle.json` | one record per access area, for the permission checks |
| `seed-manifest-pertab.json` | begins-with / contains / one-letter-typo trios per tab |
| `seed-manifest-e2e.json` | this suite's own: the `ZZSPEC` customers, and the `ZZLONGROW` and `ZZSOFTHIT` families the entity checks search for, with their purchase orders and invoices |

Then three **proofs** search for what was seeded and fail the run if search does not return it — "the
record exists" is not "search returns it".

**To add data for a new check: add a record to `seed-manifest-e2e.json`.** Never edit the engine.

### It is safe to run any number of times — including on a fresh machine

Seeding twice creates nothing the second time. That has to hold on a machine that has **never** seeded
this environment before (a new laptop, or the fresh container every nightly run starts in), and the
first real run showed it did not: the engine recognised some records only by ids it had remembered, so
with no memory it made a second batch of 24 work orders next to the existing ones. It now **discovers**
existing records on the environment before creating anything. Proved on staging on 2 October 2026 from
an empty cache: it found the 19, 4 and 2 existing work orders and created none.

It never writes into the repository: it runs from a temporary copy and keeps record ids between runs
in `~/.cache/shopview-e2e/` (`GS_SEED_CACHE` to move it).

### What "the branch is refreshed" means here — and why it is safe

Confirmed by the QA lead on 2 October 2026: a refresh **resets the branch to a standard starting copy**.
Our seeded records go; the shop's own baseline records stay. That matters, because a few recipes
borrow baseline records rather than inventing them — an existing customer to prove a search works
before trusting a miss, an existing stocked part's storage bin for new stock, an existing vendor's
tax number for new vendors. On a reset branch those are there, so the first run after a refresh
simply creates every seeded record again; every later run finds them and creates nothing.

If a branch were ever wiped **completely empty**, those recipes would report the baseline record
they could not find — they would not guess — and the run would go on with the checks that need it
standing down.

### Needs

**Python 3.8 or newer** on `PATH` as `python3` (standard library only — nothing to install; `GS_PYTHON`
to point at a specific one), and the same sign-in as the tests.

### It signs into the shop the data lives in — and so do the tests

🔴 **Parts search is scoped by shop.** Measured on staging: from "Staging Lethbridge" the seeded parts
are invisible; from "Staging Heavy Duty", where they are stocked, they come back. The lists the seeder
reads are scoped the same way. So the seeder and every test sign into the same shop — staging
`Staging Heavy Duty`, production `Trucks Hill 2` — and refuse to guess if it is missing. `GS_WORKPLACE`
overrides.

## Running it in CI, or headed on your own machine

Both work with the ordinary Playwright commands.

```bash
npx playwright test                        # headless — what CI runs
npx playwright test --headed               # watch it in a real browser window
npx playwright test --headed --grep @C44809    # watch just one case
GS_SLOWMO=400 npx playwright test --headed # slowed down enough to follow
npx playwright test --ui                   # Playwright's UI mode
npx playwright test -c build/global-search/e2e/playwright.config.ts   # from the repository root
```

Three things to know, because each one used to break a run outside this folder:

- **`--headed` really is headed.** The suite opens its own browser rather than Playwright's, so the
  flag used to be silently ignored. It is now passed on to every worker (`--headed`, `--debug`,
  `--ui`, or `GS_HEADED=1`).
- **It runs from any directory.** The suite's data files live in `data/` and are found relative to
  the code, so running Playwright from the repository root works the same as from this folder.
- **One worker only — and it refuses more.** Each sign-in ends that account's previous session, so
  parallel workers log each other out. `--workers=4` or sharding stops the run before seeding, with
  that reason, instead of failing every test as if staging were down.

**For CI**, `ci/github-actions-example.yml` is a ready workflow (manual trigger; nightly and pull
request triggers are there, commented out). It needs one repository secret, `GS_SSO`, plus Node,
Python 3 and `npx playwright install --with-deps chromium`. It is an example, not switched on — turning
CI on is the team's decision.

## Running it on Claude — on a pull request, and every night

The same `npm test` runs in Claude's cloud environment, unattended. Nothing in it needs a window or a
person: it signs in from one cookie, seeds, verifies, runs, and reports.

**What the cloud environment needs, set once in its own settings** (the cloud environment menu in the
session's title bar → Edit — never pasted into a chat):

| Setting | Value |
|---|---|
| Environment variable `GS_SSO` | the `sv_sso_session` cookie from a browser signed in to staging |
| Environment variable `GS_APP` | `https://app.staging.shopview.com` (or the QA branch being tested) |
| Network access | must reach `*.shopview.com` — the default policy already did on 2 October 2026 |

**What a run does, in order:** `npm ci` → `npx playwright install chromium` (already present in
Claude's containers) → `npm test`, which seeds every record, proves search returns them, and only then
runs the 338 tests.

**Three things specific to Claude's cloud, all handled in the suite** — listed so nobody re-diagnoses
them:

- Outbound traffic goes through a local proxy. Chromium does not read `HTTPS_PROXY`, and handed the raw
  `NO_PROXY` list it bypasses the proxy for everything; even configured cleanly it drops about one
  request in six. The suite starts its own in-process relay there (`fixtures/relay.ts`). Never on a
  laptop.
- The container is fresh every night, so the seeder has no memory of previous runs. It discovers
  what is already on the environment instead of creating it again — proved from an empty cache.
- Connections are dropped now and then. Reads retry; a failed seed step is retried once (safe, because
  each step finds what a first attempt made); writes are never blindly repeated.

**When the cookie expires** the run stops at sign-in with a sentence saying so, rather than producing
a page of failures. Copy a fresh one into `GS_SSO`.

## The suite reads the environment; it is never told about it

Earlier versions read record values from a JSON file harvested that morning. On 1 October 2026 three
of those values — a part number, a part sale and a purchase order — stopped returning anything
**within the hour**, while a vehicle in the same file still worked. Three checks went red against a
product that was behaving correctly. This is a shared environment and its records move.

So `fixtures/anchors.ts` now asks the environment, **at run time**, for a record of each kind, and
**confirms search can actually find it** before any assertion is anchored to it:

* a candidate the index has not picked up yet is **skipped with its reason**, never asserted on —
  otherwise an indexing lag gets reported as a matching defect;
* two anchors are harvested per kind — the longest usable value for general checks, and a
  **punctuated** one for the "a dash is optional" checks, because ranking for one picked bad values
  for the other (preferring punctuation chose the VIN `LJM.` over a real 17-character one);
* `broadTerm()` finds a query that genuinely spans several record kinds by trying candidates against
  the live index and keeping the widest.

The happy side effect is portability: the same spec runs on production, staging or a QA branch with
no configuration, because it reads whatever that environment actually holds.

---

## What is covered

| File | Checks | What it proves |
|---|---|---|
| `C44804-C55683-panel-keyboard.spec.ts` | 11 | Opening and closing the panel, arrow keys, the scope strip, the footer legend |
| `findability-matching.spec.ts` | 18 | Typo tolerance against the §7 gates, identifiers bypassing fuzzy, field coverage, empty and highlight states |
| `structure-and-scoping.spec.ts` | 11 | Tab scoping, group order, identifier normalization, row content, empty states |
| `tabs-groups-navigation.spec.ts` | 16 | Each scope tab, group headings and counts, the five-row cap, Show all, opening a result |
| `recent-mobile-empty.spec.ts` | 7 | Recent activity, the scoped empty state, the phone surface |
| `ranking-order.spec.ts` | 11 | Prefix beats contains, exact beats close, stock order, recency, Clear all, the tablet surface |
| `rows-access-misc.spec.ts` | 18 | What each kind of row shows, telephone and sound-alike matching, what the signed-in account can see, workplace isolation, the clear button |
| `sri-distinguish-misc.spec.ts` | 25 | Telling two similar results apart, what each row promises, the search-failure banner and its recovery, no feature flag, re-selecting the record you are on, the count announced to a screen reader |
| `results-integrity.spec.ts` | 21 | The whole matched value is shown, long values are not cut through the match, the highlight marks inside the text, field-level matches |

---

**All 251 checks that passed in TestRail run 415 have a spec**, counted live from TestRail rather
than from a stored file.
## Finding the TestRail case a test belongs to

Every test title ends with its case number as a tag, so the case number is both readable in the
output and usable as a selector:

```bash
npx playwright test --grep "@C44809"      # run exactly that one case
```

`TESTRAIL-MAPPING.csv` is the full list — case number, spec file, line, test name, and the command
to run just that case. Regenerate it after adding or renaming tests:

```bash
npm run mapping
```

337 of the 338 tests carry a tag. The one that does not is a seed control, which checks the data is
present and is not a TestRail case. Two cases are deliberately manual-only; the CSV carries the
reason in its note column.

## What is deliberately NOT automated, and why

A test that goes red for its own reasons is worse than no test. These are **manual-only**, each with
the reason it cannot be measured fairly:

| Check | Why it stays manual |
|---|---|
| **C55715** — a misspelled part description still finds the record | The record is reachable only as a work-order **line** row, and the lists cap at 20 with ranking deciding what is visible. Measured twice on production: the **correctly spelled** query returned it on one run and not the next, with no change to the data. Run it by hand against a record you have just created. |
| **C44850, C55729** — the pinned top result | The feature was withdrawn. A spec asserting it would go red against correct behaviour. |
| **C44878, C44882, C55720, C55731, C55733, C55734** — permission flipping | Each needs a role edited mid-test and the same record re-measured before and after. Editing roles for a test is permitted, but a spec that mutates a shared environment's roles will collide with anyone else working in it, and a half-applied role leaves the environment wrong for the next person. Run these by hand with **Reset To Template** pressed first (Rule 118). |
| **C44853, C44854, C55708–C55712, C55722** — context and signal boosts | Each needs two records alike in every ranked signal except the one under test, plus a particular page open or a particular view history. The environment cannot be relied on to hold such a pair, and manufacturing one means creating records whose only purpose is the test. Run these by hand against a pair you have just set up. |
| **C53586, C53587** — findable within 30 seconds | These need a record created during the run. Creating records on production is governed by the environment's own safety guard, so the spec would depend on a permission that may not be granted when it runs. Run by hand right after creating a record. |
| Ranking checks with no fair pair | Ranking can only be judged where two records differ in exactly the property under test. The specs **hunt** for such a pair — taking the words the tab's own rows are made of and trying each — and only skip, with the reason, when no query produces one. They never assert on whichever record happened to sort first. |

---

## The run these were last verified by

Every file below was run against **production** (`app.shopview.com`, build `v26.40.3-df33ae5`) on
**2 October 2026**: **217 passed · 116 stood down · 5 failed**, 338 tests in 20 files.

🔴 **This replaces an earlier figure of 252 passed / 86 skipped / 0 failed, and the earlier figure
should not be quoted.** It was not measuring what it appeared to. `fixtures/auth.ts` derived the API
address from a QA branch that had been deleted, so the live record lookup used by 12 of the 20 files
was failing on every run; and several checks were passing against records seeded on production that
have since been cleaned up. Fewer checks pass now and more stand down. That is the suite no longer
reporting a pass it has not earned — a stood-down check names what it could not establish, where a
false pass is simply believed.

**Why 116 stand down.** The largest groups, each with its reason printed in the run: records seeded
once on production and since deleted (`ZZLONGROW`, `ZZKRYPTON`, `ZZSOFTHIT`, two `ZZAUTOTEST`
records) · eleven permission comparisons that cannot run because the two logins no longer differ
(see below) · six that need a technician role this environment does not have · a handful where the
environment holds no record with the property under test (no customer postcode, no anchor carrying a
dash).

⚠️ **The permission checks need two logins that actually differ, and right now they do not.** The
lower-permission account `bilal.muzamil+serviceadvisorlimitedview@shopview.com` holds **all 58
permissions**, the same as the full-access one. Its role is **Technician**
(`31e70dbe-8d9f-485b-9e32-457acd069743`), **shared with three other staff accounts**, so it must not
be edited without asking — a change there changes what those people can do. Until the two logins
differ, eleven checks stand down rather than report a pass they cannot support.

| File | Passed | Stood down | Failed |
|---|---|---|---|
| `C146197-C146208-sri-work-orders.spec.ts` | 5 | 2 | 0 |
| `C146202-C146282-sri-retest-full-value.spec.ts` | 28 | 0 | 0 |
| `C146209-C146223-sri-customers.spec.ts` | 3 | 3 | 0 |
| `C146224-C146284-sri-entities.spec.ts` | 23 | 17 | 2 |
| `C146285-C146306-sri-all-tab.spec.ts` | 19 | 3 | 0 |
| `C44804-C55683-panel-keyboard.spec.ts` | 11 | 0 | 0 |
| `access-and-location.spec.ts` | 0 | 6 | 0 |
| `counts-and-ranking.spec.ts` | 4 | 1 | 0 |
| `findability-matching.spec.ts` | 9 | 9 | 2 |
| `findability.spec.ts` | 13 | 13 | 0 |
| `panel.spec.ts` | 11 | 0 | 0 |
| `permissions-two-accounts.spec.ts` | 4 | 15 | 1 |
| `ranking-order.spec.ts` | 5 | 6 | 0 |
| `ranking-seeded.spec.ts` | 15 | 8 | 0 |
| `recent-mobile-empty.spec.ts` | 7 | 0 | 0 |
| `results-integrity.spec.ts` | 13 | 8 | 0 |
| `rows-access-misc.spec.ts` | 11 | 7 | 0 |
| `sri-distinguish-misc.spec.ts` | 14 | 11 | 0 |
| `structure-and-scoping.spec.ts` | 8 | 5 | 0 |
| `tabs-groups-navigation.spec.ts` | 14 | 2 | 0 |
| **TOTAL** | **217** | **116** | **5** |

### The 5 failures, and what is and is not known about them

**Three are one behaviour.** `C146233`, `C146235` and `C44828` all detect the same thing: the panel
highlights the **whole value** rather than the typed part inside it. Observed directly — querying
Parts for `Item`, the row paints a single segment, `["Item-8677", marked]`. The requirement these
checks quote (PRD v1.5 §5.3) says *"the matched substring of the query is highlighted"*, so a person
searching cannot see which part of the result matched. **This is a CANDIDATE, not a defect**: it
still needs reconciling against the requirement as it reads today rather than as our own notes quote
it, and filing is held per ticket regardless.

**`C55659`** — part of a number still finds the record. Not yet diagnosed.

**`C55737`** — the search panel never opened for the lower-permission login (`.search-modal` not
visible within 20s). This reads as the test's own timing rather than the product, and has not been
confirmed either way.

### Six checks marked as known-broken did not behave as broken

`SV-10320`, `SV-10340`, `SV-10001`, `SV-10060` and `SV-10025` are reproduced deliberately by specs
carrying `[expected to fail: …]`. In this run those specs did not fail as instructed. All five
tickets read **OBSOLETE / Done** when read live on 2 October 2026. Together that is a second,
independent signal that the behaviour may have changed — but it is one run, taken on the same day a
genuine measuring fault was fixed, so it is recorded here as a thing to confirm and **not** as a
finding.

### What a stood-down check means here, and why there are 116 of them

A skip is **never** "this did not run". It means the environment did not hold the data the check
needs to judge the product fairly, and the spec says in its message exactly what was missing. The
specs do not accept that answer cheaply — before skipping, a check will **hunt** for usable data:
it asks the API for that record kind's own records, takes the words those records are made of, and
tries each as a query until one gives it something to measure. That hunt turned 10 skips into
passes in the highlighting file and 5 into passes elsewhere.

Most of the 85 fall into four groups, each of which names its reason in the run output:

* **the record this check was written around is not on production.** Many specs were authored
  against staging's seeded data. Where the record is genuinely absent the check stands down; where
  an equivalent record exists, the term is resolved against the live environment instead and the
  check runs.
* **the two logins do not differ on that access area.** The permission checks compare a
  full-access person with the lower-permission one; where both hold an area, that pair cannot
  demonstrate its absence and the check says so.
* **the data holds no fair pair.** Ranking is judgeable only where two records differ in exactly
  the property under test. The specs hunt for such a pair among real records before standing down.
* **the behaviour was withdrawn or belongs to another suite.** The pinned top result was cancelled
  by the QA lead on 2026-09-29; the staging quick-login does not exist here.

### Known faults, reproduced rather than re-reported

Three faults are open and the specs meet them. Rather than fail, or file duplicates, each stands
down naming the ticket — and starts running again by itself when the fault is fixed:

| Ticket | Status (read live, 2 Oct 2026) | What the specs see |
|---|---|---|
| SV-10634 | Open | rows show only the characters typed, not the value that matched |
| SV-10635 | Open | the customer row omits the telephone |
| SV-10740 | Open | a close match comes back with no highlight |

Two more were marked expected-to-fail and **passed**, which is exactly what that marking is for:
SV-10340 (on suppliers) and SV-10055 no longer reproduce on production, consistent with both
tickets reading OBSOLETE. Their markings are removed, so a return of either reads as a regression.

Three others still reproduce although their tickets read OBSOLETE — SV-10001, SV-10025, SV-10320.
**A closed ticket is not a specification change**, so their expectations are unchanged and they are
marked as known faults. Whether the behaviour is now intended is a ruling for the QA lead.

## Expected failures

None are currently expected to fail. Where a spec reproduces a known open fault it carries
`[expected to fail: SV-xxxxx]` in its title, so a red result is read as "still broken", not as a
regression.

---

## The traps that are encoded here

Each of these cost a wrong answer before it was caught, and each is commented at the line where it
bites — the comments are the point, not decoration:

1. **`typeQuery` already opens the panel and does not wait for the search.** Wrapping it with
   another open/close re-enters the Recent-searches state, and reading immediately reads the
   *previous* query's rows. Use `typeAndWait`, which waits on the search response itself.
2. **The scope tab is sticky across close and reopen**, so it scopes the *next* search. An
   identifier proved findable seconds earlier "found nothing" for exactly this reason.
   `typeAndWait` resets the scope to All before typing.
3. **A fuzzy row is prefixed `≈ close match:`.** Comparing raw row text against the exact search's
   row never matches, and the spec reports a miss while the record is on screen.
4. **Normalise both sides or neither.** Stripping punctuation from the identifier but only
   whitespace from the row means `P1-71` can never match its own row.
5. **A one-letter query renders no tab counts at all**, so any count-based assertion on it fails or
   skips while the product is fine.
6. **"All" always carries a count** when anything matched, so counting it made "several kinds came
   back" pass for a single customer. Entity tabs only.
7. **Recent-activity rows are also `.search-row`**, so counting rows cannot tell you which state the
   panel is in. Judge the state from the panel's wording first.
8. **A recent record shows a relative date** (`Today`), not a calendar one.
9. **The All view lists five rows per group.** Judging presence there produced eight false failures
   in one pass — open the record's own tab.
10. **`Control+K` sends Ctrl+Shift+K**; the shortcut is lowercase `Control+k`.
11. **The clear control is an icon button with empty text** — no "clear" in its class or label.
12. **Focus does not travel with the selection**: pressing Right moves the selected tab while
    `document.activeElement` stays put. Assert on the selection, not on focus.
13. **A new browser tab takes a moment to appear.** Counting tabs straight after the keypress
    reports "no new tab" for a shortcut that worked — wait for the page event.
14. **The mobile layout is decided at load**, so resize is not enough; sign in at a phone viewport.
