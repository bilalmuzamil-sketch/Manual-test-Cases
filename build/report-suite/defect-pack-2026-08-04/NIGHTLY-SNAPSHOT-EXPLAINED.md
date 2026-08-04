# The 12 nightly-snapshot test cases, in plain terms — and what is needed to unblock them

> Written to the QA lead's standing instruction: *"Always explain in simple terms with a solution or
> required action."*

---

## In one sentence

Twelve of our test cases check numbers that a program writes into the database overnight, and **there is
currently no way for anyone — tester or developer — to open those saved numbers and look at them**, so
the twelve cases cannot be passed or failed; they can only be left unanswered.

---

## What these tests are trying to check

Two of the six new reports keep a daily record of history.

**Work In Progress** is a snapshot of every job that is currently open — what has been earned on it so
far and what is still to come. That is a picture of a moment, and the moment passes. So every night a
program writes down the state of every open job, so that later on somebody can ask "what did our
work-in-progress look like at the end of last month?" and get a true answer rather than today's answer.

**Inventory Value** does the same for stock. Every night it writes down what every part on the shelf was
worth. That is what makes the report's "as of" date feature possible — when you ask what your stock was
worth on 31 July, the report is not recalculating anything, it is reading back what was written down that
night.

The twelve tests check that this nightly writing-down is being done **correctly**, because everything
built on top of it depends on it. Specifically they check things like:

- one record per open job (or per part in stock) per day — no duplicates, none missing;
- each record captures the right details — the job, its status, the money, the location;
- the money written down matches what the report showed on screen that day;
- the amounts are stored to the exact penny, not rounded;
- a job with nothing approved yet is written down as zero rather than left out;
- re-running the nightly job for a day **replaces** that day's record rather than adding a second one;
- and re-running it cannot invent history for a day that was missed — it only records today's truth;
- older records are kept for the right length of time and thinned out correctly after that.

Every one of those is about **the data that was saved**, not about what appears on the screen.

## Why nobody can check it today

To confirm what was written down, you have to be able to **read what was written down**. There is
currently no way to do that.

The reporting interface only offers the finished report — the resolved answer for a date. It does not
offer the underlying saved records. We looked for a way in and found none: every address we tried for a
snapshot or history feed returned "not found".

So a tester is left in this position: the report gives an answer, but there is no way to tell whether it
came from a correctly-written record, a record with a rounding error in it, two duplicate records, or a
record for the wrong day. **The answer looks the same either way.** The one thing we could establish
indirectly is that history genuinely exists and is being served — asking for 31 July returned a total of
**$485,549.66** while today's live figure is **$485,542.18**, two different real numbers, which proves
stored history is being read rather than recalculated. But that tells us the mechanism runs. It tells us
nothing about whether what it wrote is right.

**This is why the twelve cases are marked as blocked rather than passed.** Marking them passed would mean
claiming we had checked something we had no way to look at, which we will not do.

There is a second, sharper reason this matters right now. A separate defect has been found in the
Inventory Value report: **it reports the stock value for one day later than the date you ask for.** The
obvious next question is whether the Work In Progress nightly record has the same one-day shift in it —
and **we cannot answer that either**, for exactly the same reason. So this missing access is not a
theoretical tidiness problem; it is blocking a live investigation.

---

## Required action — what is needed, and from whom

**From: a developer on the Report Suite team** — specifically whoever owns the two nightly-capture
stories, **SV-8667** (*WIP - Story 11 - Nightly WIP Snapshot Capture*) and **SV-8678** (*Inv Value -
Story 11 - Nightly Snapshot Capture*).

**Either** of the following would unblock all twelve. Whichever is cheaper for the team is fine — we do
not need both.

**Option A — a way to read the saved records.** A read-only route, available on the QA environment, that
returns the stored snapshot rows for a given date and location, showing the raw stored values. It does
not need to be pretty, permanent, or a product feature — a QA-only or developer-only route is entirely
sufficient. With it, all twelve cases become straightforwardly testable: ask for a date, read the rows,
compare them against what the report showed.

**Option B — a way to run the nightly job on demand, plus a way to see what it produced.** A documented
command or endpoint that triggers the capture for a chosen date, together with confirmation of where the
result lands so it can be read back. This has the advantage of also letting us test the "re-running
replaces rather than duplicates" and "re-running cannot rebuild missed history" behaviours, which are two
of the twelve and which are otherwise untestable even with Option A alone.

**What we do NOT need:** production access, a UI, or a new product feature. Read access on the QA
environment is the whole ask.

**If the answer is that this is intentionally not readable**, that is a legitimate answer — but then the
twelve cases should be formally retired or rewritten to test only what is observable through the report,
and that is the QA lead's decision to make, not ours. We would rather be told that than leave twelve
cases sitting unanswered indefinitely.

---

## The twelve cases

**Work In Progress — nightly snapshot** (all in the `WIP — API` section):

| Internal ID | TestRail | Link | What it checks |
|---|---|---|---|
| WIP-API-01 | C30528 | [open](https://shopview.testrail.io/index.php?/cases/view/30528) | One record per then-open job per calendar day |
| WIP-API-02 | C30529 | [open](https://shopview.testrail.io/index.php?/cases/view/30529) | Each record captures the job, its status, the money and the location |
| WIP-API-03 | C30530 | [open](https://shopview.testrail.io/index.php?/cases/view/30530) | The saved Earned and Remaining match the on-screen sums |
| WIP-API-04 | C30531 | [open](https://shopview.testrail.io/index.php?/cases/view/30531) | The record covers every location, with no per-user filtering |
| WIP-API-05 | C30532 | [open](https://shopview.testrail.io/index.php?/cases/view/30532) | Money is stored to the exact penny |
| WIP-API-06 | C30533 | [open](https://shopview.testrail.io/index.php?/cases/view/30533) | A job with nothing approved is recorded as zero, not omitted |

**Inventory Value — nightly snapshot** (all in the `IV — API` section):

| Internal ID | TestRail | Link | What it checks |
|---|---|---|---|
| IV-API-01 | C30605 | [open](https://shopview.testrail.io/index.php?/cases/view/30605) | One record per in-stock, non-core part per location |
| IV-API-02 | C30606 | [open](https://shopview.testrail.io/index.php?/cases/view/30606) | A recorded day equals what the report showed live that day |
| IV-API-03 | C30607 | [open](https://shopview.testrail.io/index.php?/cases/view/30607) | Re-running the capture replaces that day rather than duplicating it |
| IV-API-04 | C30608 | [open](https://shopview.testrail.io/index.php?/cases/view/30608) | A re-run records today's truth; it cannot rebuild a missed day |
| IV-API-05 | C30609 | [open](https://shopview.testrail.io/index.php?/cases/view/30609) | Daily records are kept for the agreed period |
| IV-API-06 | C30610 | [open](https://shopview.testrail.io/index.php?/cases/view/30610) | Thinned-out older history is still served by the closest-day rule |

**None of these twelve cases was edited by this pass.**

---

## The technical detail, for the developer who picks this up

- `GET /api/reporting/reports/work-in-progress?from=<ISO>&to=<ISO>&locations=…` returns
  `{data:{collection:[…]}}` — **the live report only**. A flat list of current work orders, each tagged
  with its tab. There is **no `totals`, no `summary`, and no snapshot or history parameter**.
- `GET /api/reporting/reports/inventory-value?range=custom&start_date=&end_date=&locations=…` returns
  `{data:{collection, pagination, totals, as_of_date}}` — the **resolved** report for the date. The
  `as_of_date` field proves a history lookup is happening, but the stored rows behind it are not exposed.
- Probes for a snapshot/history feed on both reports returned **404**.
- **Proof that stored history exists and is being served, captured live:** a range ending `2026-07-31`
  returned `totals.total_cost` **48554966** ($485,549.66) where the live figure today is **48554218**
  ($485,542.18). Two different real numbers, so the read is coming from storage, not a recalculation.
- Retained history on the QA organisation currently reaches back only to about **2026-08-01**, one to two
  days — which separately limits the retention and thinning cases (IV-API-05, IV-API-06) even if a read
  route appeared tomorrow. Worth knowing before anyone estimates.
- Build observed: **`v3.4.1-0ed4433`** on `sv8582.qa.shopview.com`, 2026-08-04. **This branch was
  declared not final**, so if a read route is already planned or half-built, saying so closes this out.

**Evidence:** `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/api-wip-iv.json`,
`iv-pdf-boundary.json`, and the per-case reasons in
`build/report-suite/viu-2026-08-03/batch-wip-iv/verdicts.csv`.
