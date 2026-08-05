# Schedule — RULE 49 RE-CHECK QUEUE · STATUS: **OPEN**

**This is the LIVE queue for Schedule as of 2026-08-05 17:xx UTC.** It supersedes
`../final-viu-2026-08-05/RECHECK-QUEUE.md`, which becomes the record of that pass.

> **Check this file at every session start** (`ls build/*/viu-*/RECHECK-QUEUE.md` plus this folder),
> **before and after any Schedule work**, and **immediately** when the app-version marker changes.

## Why it is open, and why that is now normal rather than embarrassing

Engineering has confirmed the branch **will not be declared final before release** (Standing Rule 60).
An OPEN queue is therefore the **steady state of an active project** — a living work list, not a
failure. What the rule buys us is that a redeploy costs a **cheap re-check of three layers**, not a
re-derivation of the suite.

## The build has moved three times in two days

| Marker | Last-modified | What was measured on it |
|---|---|---|
| `v3.5-4873abe` | Tue 04 Aug 14:47:39 GMT | **157 of the 165 verdicts** |
| `v3.5-be42149` | Wed 05 Aug 08:09:19 GMT | **8 verdicts** (SCH-WOL-04, FILT-03, FILT-04, FILT-06, LINE-03, DND-08, SCOPE-05, and the scope-picker contents C29963) |
| **`v3.5-d122eef`** | **Wed 05 Aug 15:35:43 GMT** · etag `dd1c57e2fb4beba9758b62a29afdeaab` | **the 3 new cases only** — C43554, C43555, C43556 |

**So on the build deployed right now, 165 of the 168 cases have NOT been re-observed.** Every one of
those 165 says so on itself, in its own provenance line, naming the build and date it *was* checked
against. That is the honest N-of-M this queue exists to keep derivable (Rule 60(d) and (f)).

## What a redeploy actually invalidates — re-check ONLY these three layers

| Layer | Re-check? |
|---|---|
| **1. On-screen labels and the navigation path** | **Yes** |
| **2. The pass / fail / deviation verdict** | **Yes** |
| **3. Markers that assert a build fact** — `READY - EXPECT FAIL (SV-xxxx)` and `HOLD - not built` | **Yes** |
| The expectation, the requirement anchor, the specification version, the epic/story reference, the traceability, the Rule-54 **source** sentence | **No — build-independent** |
| Plain `AUTOMATION: READY` | **No** — it asserts *automatable*, not *currently passing* |

**Do not re-read the specification per case and do not re-audit expectations on a redeploy.** A
redeploy is not a spec change, and treating it as one is how a cheap re-check becomes an unaffordable
one that then never happens.

## THE QUEUE

### A. Highest value — the 3 recorded "not built", which a deploy can silently fix

This already happened once: **SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)**
was recorded *not built* and click-to-arm turned out to have **shipped**. Check these three first.

| Case | C-id | Assert | Now |
|---|---|---|---|
| SCH-EVT-02 | [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) | the feature exists at all | `HOLD - not built` |
| SCH-SPREAD-11 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | the feature exists at all | `HOLD - not built` |
| SCH-API-02 | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | the feature exists at all | `HOLD - not built` |

### B. The 23 EXPECT-FAIL cases — each asserts a build fact that a deploy can change

All 10 of our own tickets **SV-8848…SV-8857 were read live earlier today and are still Open**, so they
very probably still reproduce — but *probably* is not *observed*. The full list with tickets is the
"Product is wrong" table of `../READINESS-2026-08-05.md`, plus the three added today:

| Case | C-id | Ticket | Reproduced on |
|---|---|---|---|
| SCH-NAV-08 | [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | [SV-8863](https://shopview.atlassian.net/browse/SV-8863) | **`v3.5-d122eef`** ✔ |
| SCH-REAS-07 | [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | [SV-8867](https://shopview.atlassian.net/browse/SV-8867) | **`v3.5-d122eef`** ✔ |
| SCH-WOL-04 | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | [SV-8873](https://shopview.atlassian.net/browse/SV-8873) | `v3.5-be42149` |
| SCH-SCOPE-05 | [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | [SV-8886](https://shopview.atlassian.net/browse/SV-8886) | `v3.5-be42149` |
| the other 19 | — | see the readiness table | `v3.5-4873abe` |

### C. The 2 cases that could not be set up on this estate

| Case | C-id | Blocker | Worth retrying? |
|---|---|---|---|
| SCH-EDGE-07 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | needs a real daylight-saving clock change | **Yes, and it was never tried**: a series scheduled **across 1 November 2026** would exercise it without moving any clock |
| SCH-START-02 | [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) | needs shop business hours switched on — a shared setting on this estate | only in a quiet window |

### D. The 3 cases waiting on the product owner — a build change cannot settle these

| Case | C-id | The question | Who is blocking |
|---|---|---|---|
| SCH-SPREAD-07 | [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | do shop closures block the multi-day spread? Specification version 23 says both (§4.5 and §12) | **US — drafted 22 July, never sent** |
| SCH-EDGE-05 | [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | same question | **US — same** |
| SCH-DND-09 | [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | does Month view accept a drag-to-create? The specification does not name a view; story SV-8688 names only Week | **Branko** — asked on SV-8870 by the ticket's author |

### E. The 137 plain-READY cases

Their **verdicts** were measured on `v3.5-4873abe` (or `v3.5-be42149` for the handful above) and are
carried forward. Their **markers are build-independent** and need no change. Re-observe them when a
label-and-verdict checker exists — see below.

## What this project still owes itself: the re-runnable checker (Rule 60(e))

There is **no** automated label-and-verdict checker for Schedule yet, which is why 165 rows carry
forward instead of being re-checked in minutes. Building one is the single highest-leverage thing
available here: the DOM already exposes stable hooks — `button_schedule_today`,
`button_schedule_prev`, `button_schedule_next`, `button_schedule_search_toggle`,
`schedule_filter_display_menu`, `schedule_view_options_menu`, `sidebar_work_order_card`
(`data-schedule-drag`, `data-work-order-id`), `schedule_series_block` (`data-series-id`),
`button_sidebar_arm_<workOrderId>`, and the line-picker set. **Not built this pass; recorded as the ask.**

## How to close a row

Re-run it against the new marker, flip it to **CONFIRMED** or **CHANGED** with fresh evidence, and
**re-stamp the case's Rule-54 sentence 2** to the build and date it was checked against — a row
re-checked without its provenance re-stamped is not re-checked. **A row that flips to CHANGED is a
finding in its own right** and is reported, not quietly corrected. The queue closes only when **100%**
of rows are re-verified (Rule 17 — no sampling).
