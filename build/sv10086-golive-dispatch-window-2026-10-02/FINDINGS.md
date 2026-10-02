# SV-10086 — Go-live can activate the workspace upstream, then die before queueing the emission

**Verdict: PASS on `v26.40.3-36ebbb0`.** The window the ticket describes is closed. Across 230
state observations there was never a moment where the workspace was activated with no job queued.

- **Ticket:** [SV-10086](https://shopview.atlassian.net/browse/SV-10086) — Bug, High,
  label `release-blocker`, parent SV-10360. Reporter Milan Zivanovic, assignee Nikola Mitrovic.
  Status *Merged to Staging*. **No QA handoff exists** (the ticket has zero comments; confirmed
  with the QA lead), so the description's own **Verification** paragraph is the checklist:
  > *"Backdate a go-live on a workspace with history, kill the request mid-flight, and assert
  > either that nothing was activated or that a job is queued. There should be no state where
  > accounting_activation is set and no AccountingOnboardingJob exists."*
- **Environment:** `https://app.staging.shopview.com`, org `d55bc308…` / workspace
  *Foothills Group Inc* (`01a09126-ee05-724a-942e-ee943aa20afc`), 11 fiscal years of history.
- **Date:** 2 October 2026. Viewport 1900 × 1050.

---

## ⚠️ Staging redeployed in the middle of the pass — read this first

| | build | last-modified |
|---|---|---|
| at pass start | `v26.40.2-d1bd078` | Thu, 01 Oct 2026 13:34:57 GMT |
| from 08:14 onward | **`v26.40.3-36ebbb0`** | Fri, 02 Oct 2026 08:14:25 GMT |

The first go-live of the pass (07:47) ran on the **older** build. Everything from 08:22 onward ran
on `v26.40.3-36ebbb0`. The confirming measurement had the marker **read immediately before and
after and proven byte-identical**, so the verdict is stated against `v26.40.3-36ebbb0`.

---

## What was measured

The ticket's concern is the order of work inside `GoLiveController`: activate → recordActivation →
**estimatedWindowEvents (the slow count)** → dispatch. The fix moves the estimate off the request
thread and dispatches straight after recordActivation.

Three things make that observable from outside without reading the code:

1. **How long the count takes on its own.** `POST /api/accounting-onboarding/preview` runs the same
   `countsByStep()` path. Measured five times: **3.3 s, 1.7 s, 2.8 s, 3.9 s** for go-live dates
   25/09, 15/09, 01/09, 01/08 (01/06 is refused by a separate inventory diagnostic).
2. **How long the go-live request takes.** If the count still ran inside it, the request cannot be
   shorter than the count.
3. **Whether `estimated_total` exists when the job starts.** If the request computed it, it is
   present from the first moment the run record exists; if the worker computes it, it starts `null`.

### Results

| # | time | build | go-live date | request | activation → job | `estimated_total` at job start |
|---|---|---|---|---|---|---|
| 1 | 07:47 | `v26.40.2-d1bd078` | 01/08/2026 | **11,510 ms** | **12 s** | already set when first seen |
| 2 | 08:22 | `v26.40.3-36ebbb0` | 01/08/2026 | **563 ms** | 1 s | **null**, set 7.35 s later |
| 3 | 08:51 | `v26.40.3-36ebbb0` | 22/09/2026 | **531 ms** | 1 s | **null**, set ~0.8 s later |
| 4 | 09:06 | `v26.40.3-36ebbb0` (marker verified either side) | 01/08/2026 | **457 ms** | 1 s | **null**, set ~8 s later |

On `v26.40.3-36ebbb0` the whole go-live request is **457–563 ms** — roughly **one seventh** of the
3.9 s the count alone takes for the same window. The count cannot be inside it. And the run record
appears with `estimated_total: null`, the number arriving seconds later, which is the worker
computing it.

Run 4 in full: request `202` in 457 ms, `activated_at 09:06:26`, run `87487ab6`
`started_at 09:06:27`, first seen 296 ms after the request returned with `estimated_total: null`,
and `8,486` present 8 s after that.

---

## The kill test (the ticket's own wording)

Both runs on `v26.40.3-36ebbb0`. The workspace was proven un-activated first; the go-live request
was then fired and the **client connection cut** after a set number of milliseconds; the state was
then watched continuously for the forbidden combination.

| abort after | what happened | observations | "activated with no job" |
|---|---|---|---|
| **50 ms** | nothing was activated at all — workspace stayed `null`, no job created | 150 over 108 s | **0** |
| **100 ms** | activated `08:35:37` **and** job `22e7d94d` already running by the next poll | 80 over 40 s | **0** |

Those are exactly the two outcomes the ticket says are acceptable — *"either that nothing was
activated or that a job is queued"*. **230 observations, zero instances of the forbidden state.**

---

## How the test was set up

The ticket cannot be tested on a workspace that is already live, and this org went live on
22 September. The product ships its own staging-only tooling for precisely this, at
**Accounting → Settings → Admin sync**, which states on screen: *"Testing tools for QA and
staging. None of these exist in production — every action here is refused server-side there."*

1. **Seed test fixtures** → 3 credit memos + 3 deposits against *Zapata Fleet Maintenance Inc*.
2. **Reset accounting books** → *"Wipes this organization's accounting back to the state before
   going live, so onboarding can be tested again from scratch."* Confirmed
   `accounting_activated_at: null`.
3. Go-live from the **Go live** button on Accounting → Settings → Onboarding sync.

A full-year backdate (01/01/2026) is refused by an unrelated inventory diagnostic
(*"More than 500 inventory_change sources … report inventory_manual_origin_unresolved"*), so
**01/08/2026** — two months, the widest this org accepts — was used.

---

## Other things seen, not part of this ticket

Reported, not filed, pending the QA lead's call:

1. **The onboarding job does not finish on this org.** Every run writes ~19,000 rows, reaches
   phase 14/14 "Vendor credits", stalls for several minutes with no `finished_at`, then a fresh run
   starts, skips everything already applied and fails. Observed failures:
   *"Previously imported inventory no longer has matching source evidence."*,
   *"A replay candidate changed after selection."* — and the run already on the org before this
   pass began (22 Sep) had failed with *"A sealed replay manifest cannot gain new source
   membership."* **This predates the pass** and is about the worker, not the request ordering.
2. **The progress estimate is a long way out** — 8,497 expected against 18,983 written; 2,545
   expected against 11,560+ written. The ticket itself calls this number *"only ever a hint"*, so
   this is an observation rather than a defect.
3. **`GET /api/accounting/settings/onboarding` intermittently returns an empty object** instead of
   the workspace payload, recovering on a later call. Seen repeatedly throughout.

---

## Environment left behind

Staging keeps the restore-after discipline (it is shared). Fixtures were **removed** (3 credit
memos, 3 deposits, confirmed by the tool). The books were reset and taken live again. The original
state was `go_live_date 2026-09-22`, activated `2026-09-22T16:19:28Z`; the exact original
timestamps cannot be reinstated, and the final restore is recorded in the execution notes.

---

## Honest limits

- **No deliberate before/after across builds was possible.** Production refuses the admin tooling,
  so a pre-fix environment could not be produced on purpose. The one slow observation (run 1,
  11.5 s request, 12 s gap) happened to land on the build staging ran until 08:14, which looks like
  the pre-fix behaviour — but **n = 1, and the marker was not re-read between run 1 and run 2**, so
  the deploy is a plausible explanation and not a proven one. It is reported as an observation, not
  a cause.
- The kill is a **client-side** connection cut. It reproduces the ticket's "the client kills the
  request" case; it does not prove what happens when nginx or php-fpm is the one that dies.
- Polling resolution was ~100–500 ms, so a forbidden window shorter than that would not have been
  caught. The measured activation → job gap is 1 s and the request is ~0.5 s, so any such window
  is bounded well below the 12 s seen on the older build.
