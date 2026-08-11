# Schedule — staged label / navigation change list, 2026-08-11

## STATUS: **EMPTY, AND EMPTY FOR A REASON — NOT "NO CHANGES NEEDED"**

**0 rows.** This is **not** a finding that the 174 cases' labels are correct. It is the direct
consequence of the blocker in `BUILD-VERIFICATION.md`: **the application could not be signed into**,
so **not one on-screen label was read**, and therefore **not one label could be diffed**.

**Read this file as "the diff has not been run", never as "the diff came back clean".** The two look
identical in a summary table and mean opposite things.

## Why there is nothing that could have been staged from documents instead

**Because the specification pins no label wording.** That was established by the previous pass's
classification (`build/schedule/build-verify-2026-08-11/CLASSIFICATION.md` §2) and it is the reason
no partial subset can be done off-build: **all of the asserted strings are decided by the build
alone.** Taking any of them from the specification, from our own case text, or from an earlier pass
would be inventing an observation (Rule 12) — and it would be doubly wrong here, because the build
has moved to `v3.5-65d6500` since every one of those verdicts was recorded.

## What is ready to run the moment there is a session

| Asset | Path | State |
|---|---|---|
| The asserted-string check-list | `build/schedule/build-verify-2026-08-11/evidence/labels.json` | **195 distinct strings** across the 174 cases, with the field, the C-ids and the spec anchors on each |
| Partition (exact / case / variant) | `build/schedule/build-verify-2026-08-11/evidence/partition.json` | built |
| The diff tool | `build/schedule/build-verify-2026-08-11/tools/diff_labels.py` | written — classifies each string EXACT / CASE / VARIANT / ABSENT |
| Page-reaching harness | `build/schedule/build-viu-2026-08-11/tools/step0_land.cjs` | **proven this pass** — it now reaches and renders the SPA (the previous harness could not; see below) |

**One thing this pass genuinely added:** the previous attempt's harness could not get Chromium
through the egress proxy, and a naive `launch({proxy})` lands on `about:blank`. **The working pattern
is the route handler that re-issues every request through node `fetch`** (which honours the proxy),
fulfilling back into the page — `tools/step0_land.cjs`. It rendered the SPA correctly and produced the
screenshot in `evidence/`. **That harness is the part that was still unproven, and it is now proven.**

## The intended output format, so the next pass emits it without re-deriving it

Per case, one row, decision-ready and pushable by an authorised pass without further investigation:

| Internal ID | C-id | Link | Field | Exact CURRENT wording | Exact BUILD wording | Change class | Note |
|---|---|---|---|---|---|---|---|

- **Field** is the precise one to edit — `title` · `custom_preconds` · `custom_steps` ·
  `custom_expected` — never "the case".
- **Change class** is one of **CASE** (capitalisation only) · **VARIANT** (different words for the
  same control) · **ABSENT** (the control is not in the build under any wording) · **NAVIGATION** (the
  route or the click order has moved).
- **Both wordings are quoted verbatim and in full** (Rule 45(e)) — a row that names only a case id is
  not decision-ready.

## The two internal clashes that a run settles in one screenshot

Both are our suite contradicting **itself**, so **whichever way the build falls, one side is a defect
in our cases** and it is worth doing first:

1. **`Filter & Display` (C30042) vs `Filter and Display` (5 cases)** — ampersand versus the word.
2. **`VIN` vs `VIN Number`.**

Opening that toolbar dropdown once settles both.

## The other things queued behind a session, in priority order

1. **Click-to-arm** — `button_sidebar_arm_<woId>` / `aria-pressed` / an `aria-label` containing
   *"by click"*. **7 cases** turn on it (SV-8957).
   **⚠️ The previous pass's `html_has_arm: false` is INVALID and must not be reused** — it was
   measured on `/administration/locations`, not the Schedule page. An absence measured on the wrong
   page is not an absence.
2. **Panel collapse (C43582–C43587)** — their stamp names the superseded `v3.5-af3a6e1`. **Do not turn
   their plain `AUTOMATION: READY` marker back into a prediction** (Rule 61 as amended 2026-08-11: no
   backing, no expect-fail marker).
3. **The hours-dependent cases** — conflict detection (before-hours, after-hours, weekend), capacity
   bars, Tech Hours. **Read the configured hours live FIRST** (`BUILD-VERIFICATION.md` §1.1) and check
   each case's own stated precondition against them before observing. This is the SV-8923 trap.

## Zero TestRail writes

No `update_case`, no `add_case`, no `delete_case`, no run write, no result logged — and in fact **no
TestRail call at all**, because there was no observation to diff. A sibling worker owns the Schedule
write pass; its byte-verification baseline is untouched by us.
