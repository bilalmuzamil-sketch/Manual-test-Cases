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

npm run login                            # staging only: sign in once, by hand
npm run seed                             # create what the seeder can (see "Seeding")
npm run preflight                        # is the environment actually ready? (~20s)
npm test                                 # run everything -- preflight runs again, and gates it
```

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
| **Staging** | Google sign-in, so cookies from a signed-in browser | `GS_SSO`, `GS_PHPSESSID`, and `GS_CF` if Cloudflare is in front |

Staging has no password to script — it signs in through Google.

#### The easy way on staging: sign in once, by hand

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

## Is the environment ready? The run answers before it starts

`npm test` will not begin until it has checked that the records the checks look for are actually
there. It prints a line per record and, if any are missing, **stops before the first test** and
names them.

```bash
npm run preflight        # ask the question on its own, ~20 seconds, read-only
```

```
what the checks look for                   kind            found
✓ "ZZSPEC"                                 customer        18
✓ "ZZLONGROW"                              asset           2
✗ "ZZKRYPTON"                              part            0
```

🔴 **This exists because nothing used to check.** `npm run seed` creates customers and nothing
else, while the checks also look for named assets, parts, vendors, part sales, purchase orders and
vendor invoices. On 2 October 2026 a full production run spent **1.6 hours** to report 116 checks
standing down, most of them for records that were simply not on the environment — and whoever ran
it found that out at the end. Now they find out at the start.

It reads the same `entity-config.json` the specs read, so it cannot drift out of step with them. It
creates nothing, so it is safe to run against anything. A record it could not read is reported as
**could not read**, never as missing — those are different answers, and confusing them would send
you off seeding records that already exist.

| | |
|---|---|
| `GS_PREFLIGHT=warn npm test` | report, run anyway, let those checks stand down |
| `GS_PREFLIGHT=off npm test` | skip the check entirely |

## Seeding

⚠️ **`npm run seed` does not create everything the suite needs, and cannot yet.** It creates the
**customer** records (`ZZSPEC…`). The named **assets, parts, vendors, part sales, purchase orders
and vendor invoices** the entity checks look for are not created by it — they have to be on the
environment already. Creating them through the API is a multi-step job that has not been built:
a part, for instance, needs an existing `catalog_part_id` and `category_id` before it can exist,
and the asset route silently ignores make, model and unit number (recorded in
`build/APP-ACTIONS-PLAYBOOK.md`), so an asset made that way is not usable as a fixture.

Until that is built, the preflight tells you which of them are missing and the checks that need
them stand down with their reason rather than reporting anything about the product.

```bash
npm run seed
```

**The specs do not need seeded data to be correct** — each looks for a record with the property it
is about and stands down, with a reason, when the environment holds none. What a bare environment
costs you is *coverage*: a great many checks skip, and a suite that mostly skips tells you little.

`seed.ts` creates the handful of records those checks look for — a very long name, two that look
alike, a prefix/contains pair for ranking, one with a telephone, one with a dash. It is:

* **idempotent** — a name already present is left alone. Safe to re-run; the second run reports
  `already there` for every row.
* **additive** — it creates. It never edits or deletes anything that was already there.
* **visible** — everything is named `ZZSPEC…`, so what the suite put there is obvious.
* **guarded** — it refuses to touch production unless `GS_SEED_ALLOW_PROD=1`, because running the
  seeder against the wrong URL should take more than one mistake.

If seeding fails it is almost always a permission: the account must be able to create customers.
The suite still runs — the affected checks stand down and name what was missing.

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
