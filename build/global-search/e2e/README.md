# Global Search V2 — Playwright specs

One spec per passing check from **TestRail run 415**, named **C-id first** so a red result points
straight at a case without cross-referencing anything (Rule 115).

Everything here was **run by hand first and passed**, then automated — never the other way round.
A check that has not been run by hand does not get a spec.

---

## Running them

```bash
export GS_APP=https://app.shopview.com      # NOT "APP" — a wrong name silently falls back to a dead QA branch
export GS_API=api.shopview.com              # auth.ts PREPENDS this to each path; it also defaults to the QA branch
export PROD_ENVF=/tmp/shopview/prod-gs.env  # read at MODULE LOAD, so it must be exported BEFORE node starts
npx playwright test --workers=1
```

Against staging instead, export `GS_APP=https://app.staging.shopview.com` and the staging cookie
file; nothing else changes. **There is no per-environment configuration to edit** — see below.

`--workers=1` is not a preference. Signing in **expires the same user's previous session**, so two
workers log each other out and both report a broken environment.

---

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

---

## What is deliberately NOT automated, and why

A test that goes red for its own reasons is worse than no test. These are **manual-only**, each with
the reason it cannot be measured fairly:

| Check | Why it stays manual |
|---|---|
| **C55715** — a misspelled part description still finds the record | The record is reachable only as a work-order **line** row, and the lists cap at 20 with ranking deciding what is visible. Measured twice on production: the **correctly spelled** query returned it on one run and not the next, with no change to the data. Run it by hand against a record you have just created. |
| **C44850, C55729** — the pinned top result | The feature was withdrawn. A spec asserting it would go red against correct behaviour. |
| **C44878, C44882, C55720, C55731, C55733, C55734** — permission flipping | Each needs a role edited mid-test and the same record re-measured before and after. Editing roles for a test is permitted, but a spec that mutates a shared environment's roles will collide with anyone else working in it, and a half-applied role leaves the environment wrong for the next person. Run these by hand with **Reset To Template** pressed first (Rule 118). |
| Ranking checks with no fair pair | Ranking can only be judged where two records differ in exactly the property under test. Where the environment holds no such pair, the check skips with that reason rather than asserting on whichever record happened to sort first. |

---

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
