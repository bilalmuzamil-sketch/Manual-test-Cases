# Questions for Chris Ward — Report Suite spec-delta, 2026-08-11

**Sheet:** `build/report-suite/questions-2026-08-11/Questions-for-Chris-Ward_Report-Suite_2026-08-11.xlsx`
(+ `.md` twin). Mirrors the 2026-08-06 friendly sheet 1:1 — same columns, project and report named
on every row, QA-only mapping on the final tab (Standing Rules 7, 16, 55).

**Three questions. One matters; two are small.**

| # | Report | Question | Blocks |
|---|---|---|---|
| **1** | Work In Progress | Does a job with lines in different states appear in **several tabs**, or in **one tab chosen by its status**? | **3 cases on HOLD** + 2 surfaces that cannot be authored |
| 2 | Parts Velocity | Should its Location column behave like the other five reports? | nothing held — cases assert only the uncontested half |
| 3 | All six | Is the download limit really **10,000 rows**, on all six? | nothing held — his own spec note asks for this |

## Why question 1 is the one that matters

The Work In Progress specification now says two incompatible things **in the same live document**:

> **§3 Key Decisions, added 2026-08-10 (SV-9027):** *"Buckets are keyed on line state, not
> work-order status … **A work order carrying lines in more than one state appears in each matching
> tab**, showing only that tab's slice of its money."*

> **`S2-R4`, unchanged:** *"Each qualifying work order appears **exactly once, in exactly one tab**
> (Story 3)…"*
> **`S3-R1`, unchanged:** *"A work order **whose status is** Estimate is placed in the Estimates
> tab."*

**We did not pick a side.** [C30458](https://shopview.testrail.io/index.php?/cases/view/30458),
[C30462](https://shopview.testrail.io/index.php?/cases/view/30462) (Automated) and
[C30464](https://shopview.testrail.io/index.php?/cases/view/30464) keep the requirement they cite,
word for word, and now carry a plain note telling the tester that a work order appearing in more
than one tab is not to be raised as a bug until Chris rules. Their markers are `AUTOMATION: HOLD`.

**It also blocks authoring**, which is the part that is easy to miss: the surface matrix found two
things with no coverage that cannot be written until the ruling lands — **the per-tab money slice**
(a work order showing different money in different tabs) and **ageing** (the decision says an
unapproved line *"ages from the line's creation date"*, while
[C30472](https://shopview.testrail.io/index.php?/cases/view/30472) counts days since *the work
order's* creation). And [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) asserts
the nightly snapshot records *"one row per then-open job per calendar day"* — a shape the new
reading may change, invisibly, because the snapshot feeds trend history rather than the screen.

## Question 2 — Parts Velocity is the one report left unclear

Chris settled this for five of six on 7 August. Parts Velocity v6 rewrote `S3-R10` to the new rule
but left two older statements standing: `S2-R12` still says the column *"is hidden"* when a single
location is in scope, and `S4-R1`/`S4-R2`/`S4-R3` still enumerate **twenty** picker columns —
14 defaults plus *"Units Returned, Sold (WO), Sold (Parts Sale), Turns / Yr, Min, Max"* — with
Location in neither list, while `S3-R10` says it is *"offered in the column picker (S4-R1), shown by
default"*.

## Question 3 — his own note asks for it

Inventory Value v5 carries, beside the cap: *"[Cap value 10,000 is a proposed default — confirm the
exact suite-standard value with the owner before dev.]"* All six reports already have a case
asserting 10,000 and the verbatim message, so nothing is blocked — but if the number changes, six
cases need one edit each.

## Already answered — recorded so nobody re-asks

**The 2026-08-06 sheet's question 1 is ANSWERED.** It asked whether the Location column is
access-gated and toggleable. Chris answered it **by editing the specifications on 7 August** — his
own version message reads *"reworded the Location-column visibility to the access-gated,
column-selector-toggleable rule, matching the decision note already in this spec."*

**Four cases were on hold waiting for that answer and are now `READY`:**
[C38917](https://shopview.testrail.io/index.php?/cases/view/38917),
[C30551](https://shopview.testrail.io/index.php?/cases/view/30551),
[C30554](https://shopview.testrail.io/index.php?/cases/view/30554),
[C30588](https://shopview.testrail.io/index.php?/cases/view/30588). Seven cases were still telling
testers the question was open; they no longer do.

**This is on the QA-only tab as its own row**, because re-asking a question a source has already
answered is an embarrassment this workspace has had once already.
