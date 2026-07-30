> **Date:** 2026-07-31 · **Author:** QA / Claude · **Status:** DRAFT for Bilal to send

# Refinement call — agenda

**When:** tomorrow, 30 minutes · **Who:** Bilal, Ahtesham, Mudassir
**Purpose:** close out the two review reports, agree how drift is handled, and be honest
upward about what is and is not verified.

---

### 1. Why both reviews found real problems — 5 min

Our specs were out of date on both projects: Filters was eight versions behind, Schedule was
five. On Schedule the printed version number inside the document never changes, so the
document header lies — only the Confluence version number is reliable. Checking the live
version of every source is now the first step of any project work, not a step we take when
someone hands us a new document.

### 2. The contradiction check — 5 min

Both reviewers found that our suites contradicted themselves. Our old audit checked cases one
at a time, which is how a suite can be individually sensible and still self-contradictory. We
now group cases by the behaviour they assert and diff their expected results. It has already
found five further contradictions on Filters and one on Schedule that nobody had reported.
Ahtesham's review is the reason this check exists.

### 3. Test runs were frozen — 5 min

Neither run picked up new cases, because a run built from a fixed selection never does. That
caused false "no coverage" findings in both reports. Filters run has gone from 79 to 110
cases; Schedule run from 143 to 164. Recorded results were preserved in both. Agreement to
reach: a run refresh is part of every push from now on, and reviewers check coverage against
the suite, not only against the run they hold.

### 4. Open questions with the product owners — 5 min

- **Filters:** Branko's PRD still says the status filter is hidden on two tabs in six places,
  contradicting his own ruling that it is shown greyed out. He owes that correction. The
  mobile Apply-button question is genuinely open. Whether the palette-style search belongs to
  Filters or Global Search is his call.
- **Schedule:** six answers received, including the reversal that meeting hours now count
  against capacity. An eight-question sheet is written and waiting to be sent. Two places
  where the spec contradicts itself need his ruling.
- **Report Suite:** eight spec corrections and four questions still with Chris.

### 5. The QA environment blocker — 5 min

748 cases across Filters, Schedule and the Report Suite are written, traced and reviewed, and
**none** has been checked against a running build. There is no environment for any of the
three. Decision needed on how we report status upward so "cases complete" is never read as
"feature tested".

### 6. How drift and Blocked cases are handled from here — 5 min

- Drift found by a reviewer comes to us as an item-by-item list; we mark each one already
  fixed, genuinely wrong, or blocked on a PO answer. No silent re-work.
- Anything that looks off during execution is marked **Blocked**, never skipped or guessed.
  Every Blocked case gets a manual revisit against the current spec and the live build, and a
  logged correction.
- Where a reviewer's reading conflicts with a PO or QA-lead ruling, the ruling stands and the
  reviewer's observation is recorded as what surfaced the problem — but a correct review claim
  gets adopted and credited.
- Findings from creative break-it testing are raised as tickets, not folded into a run, and are
  later converted into test cases.

**Outcome wanted:** the two review reports closed, one owner per open PO question, and an
agreed line on the environment blocker.
