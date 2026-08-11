# Report Suite — spec-delta reconciliation, 2026-08-11 · FINDINGS

**Five of six specifications moved. 14 requirement-level deltas, every one verdicted. 24 cases
repaired or held, 4 created, 4 holds lifted, 3 holds added, 3 questions raised.**

Read in this order: `SOURCE-CURRENCY.md` → `COVERAGE-REDERIVATION.md` → `SURFACE-MATRIX.md` →
`CHANGES-MADE.md` → `NEW-CASES.md` → `QUESTIONS-FOR-CHRIS.md` → `DELIBERATE-DECISIONS.md` →
`testrail-execution-log.md` → `AUTOMATED-CASES-CHANGED.md`.

---

## The five things that matter

### 1 · One case would have failed a build that conforms to the specification

[C30107](https://shopview.testrail.io/index.php?/cases/view/30107) asserted *"exactly three options,
in this order: 'Parts & Service,' 'Parts only,' 'Service only'"* for a Product Type control that
SBC v17 **redesigned into a multi-select** with *"All products"* / *"Clear all"* action rows above
*"Parts"* / *"Services"* toggles (SV-9074, 10 August). Rewritten to v17. **It carries TestRail's
Automated flag, so an automated check is asserting the superseded shape and needs rewriting, not
re-running.**

### 2 · The Work In Progress specification now contradicts itself, and we did not pick a side

WIP v11 added a Key Decision — *"Buckets are keyed on line state, not work-order status … a work
order carrying lines in more than one state **appears in each matching tab**"* — while `S2-R4` still
says *"exactly once, in exactly one tab"* and `S3-R1`–`S3-R4` still place a work order by **its
status**, all unchanged in the same document.

[C30458](https://shopview.testrail.io/index.php?/cases/view/30458),
[C30462](https://shopview.testrail.io/index.php?/cases/view/30462) (Automated) and
[C30464](https://shopview.testrail.io/index.php?/cases/view/30464) **keep their assertions word for
word**, gained a plain note, and moved to `AUTOMATION: HOLD`. **Question 1 for Chris**, and the
highest-risk item here.

### 3 · Chris already answered a question seven cases were still holding for

Seven cases told testers the specification was inconsistent about the Location column and that *"the
product owner has been asked which is right and has not answered yet."* **He answered — by making
the edits.** His own version message on three specs reads *"reworded the Location-column visibility
to the access-gated, column-selector-toggleable rule."*

**Four `AUTOMATION: HOLD` markers lifted** ([C38917](https://shopview.testrail.io/index.php?/cases/view/38917),
[C30551](https://shopview.testrail.io/index.php?/cases/view/30551),
[C30554](https://shopview.testrail.io/index.php?/cases/view/30554),
[C30588](https://shopview.testrail.io/index.php?/cases/view/30588)), and **19 cases** repaired across
all six reports. The reversal is a genuine trap: narrowing the location **selection** used to hide
the column and now does not — visibility follows location **access**.

### 4 · A rule about how the report values money had no test at all

WIP v11 also added *"Fixed-price lines are valued at their fixed amounts, and earn on completion."*
**Not one of the 78 Work In Progress cases mentioned fixed-price work** — searched for *fixed-price*,
*fixed labor*, *fixed line*, *fixed amount*, *flat rate*: zero matches. Two cases authored
([C43592](https://shopview.testrail.io/index.php?/cases/view/43592),
[C43593](https://shopview.testrail.io/index.php?/cases/view/43593)), plus
[C43594](https://shopview.testrail.io/index.php?/cases/view/43594) for the untested half of the core
decision — *"Marking a returned core OK or Not OK never changes WIP figures"* — which is the half a
developer could break without anything looking wrong.

### 5 · The expected new coverage was not needed, and something else was

The brief expected a new case for Parts Velocity's `S6-R12` export cap. **It is already covered** —
[C38885](https://shopview.testrail.io/index.php?/cases/view/38885) asserts the verbatim message
*"This report is too large to export. Narrow the date range or filters, then try again."*
The requirement was **uncited, not uncovered**, and those are different things. What was actually
wrong is that its `refs` said *"spec silent on a cap"* — true at v4/v5, false since v6. Repaired.

**Two corrections to the workspace record follow from that:** *"none of the six specifications
mentions"* the cap is **false — all six now state it**, and **all six reports already have a case**.
And **Inventory Value v5 flags the number itself** as unconfirmed: *"[Cap value 10,000 is a proposed
default — confirm the exact suite-standard value with the owner before dev.]"* — question 3.

---

## Found and not fixed

| Finding | Why not | Where |
|---|---|---|
| **The marker census is stale.** Live reads **474 of 476** marked, not 476/476 — [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) and [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) carried none. C30169 was being touched anyway and was repaired; **C30288 is outside this pass's charter.** The arithmetic gate is out by exactly 1, and that 1 is C30288 | Rule 41 — record, don't silently widen scope | `COVERAGE-REDERIVATION.md` §6 |
| **[C30288](https://shopview.testrail.io/index.php?/cases/view/30288)** also has a Rule-54 line naming no spec version, as does **[C38925](https://shopview.testrail.io/index.php?/cases/view/38925)** | as above | `COVERAGE-REDERIVATION.md` §6 |
| **[C30528](https://shopview.testrail.io/index.php?/cases/view/30528)**, the nightly snapshot, asserts *"one row per then-open job per calendar day"* — a shape the bucketing decision may change, invisibly, because it feeds trend history rather than the screen | Cites its own unchanged requirement; flagged, not edited. **Recorded as HIGH risk and a line-call** | `SURFACE-MATRIX.md` surface 11, `DELIBERATE-DECISIONS.md` §6 |
| **Ageing has no case at the line level.** The decision says an unapproved line *"ages from the line's creation date"*; [C30472](https://shopview.testrail.io/index.php?/cases/view/30472) counts days since the **work order's** creation | Cannot be authored until Chris rules | `SURFACE-MATRIX.md` surface 7 |
| **The per-tab money slice has no case** | as above | `SURFACE-MATRIX.md` surface 3 |
| **Run 359 is frozen at 476** and does not contain the 4 new cases | `update_run` replaces the selection and 535 results are at stake; union staged and left | `STAGED-RUN-359-SYNC.md` |
| **Two attributions in the previous pass's `STALE-ANCHORS.md` are wrong** — the PV change is in `S3-R10` not `S4-R1`, and the WIP change is in the un-anchored Key Decisions block, not `S9-E1` | Corrected here rather than in that file, which is another pass's record | `COVERAGE-REDERIVATION.md`, totals section |

## One defect of our own

The write on [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) **replaced the whole
provenance block and dropped Rule 54 sentence 2.** The writer's own guard caught it immediately
after the write; the build line was restored **byte-exact from the PRE snapshot**, and the writer
now takes `prov_s1`, which carries everything from *"Last checked against build"* onward through
untouched — so it cannot recur by construction. That is why C38913 took two operations.

**Two other failures stopped the batch correctly rather than retrying blindly**: a `refs` value at
265 characters (HTTP 400, nothing written, guard added, which then caught 249 and 264 pre-write),
and a substitution whose target string was in the provenance rather than the body.

## Proofs

| | |
|---|---|
| Writes | 24 `update_case` (26 ops) + 4 `add_case`; **0 delete, 0 section, 0 run, 0 results, 0 Jira creates** |
| Verification | 30 fields per op, **0 mismatches, 0 collateral** |
| Cases actually changed | **exactly the 24 intended** — 0 unintended, 0 missed, derived from PRE/POST snapshots |
| Rule 54 sentence 2 | **preserved byte-exact on all 24**; 0 added, 0 removed, 0 re-dated |
| Run 359 | `include_all` still false · 476 tests · **all 535 results present BY ID** · 0 graded-field changes · 0 new results · the 14 moved fields are the declared `case_refs`/`case_title` echo, tracing to **9 cases, all of which we edited** |
| Foreign cases | 12 by Vladimir Tomovic **byte-identical incl. `updated_on`/`updated_by`**. Ours **480** / live **492** |
| Local source | re-synced **from live before** regenerating; 24 bodies differed, exactly the 24 edited |
| Four counts | live **480** = local **480** = id-map **480** = import **480**, set-equal in **both** directions |
| id-map | regenerated, then C-ids and `refs` **re-merged from live** — the generator blanks both every run; 0 blanks, refs 480/480 |
| Shredding guard | **0 rows** |
| Import header | sha256 `a82ca60c36074512`, **identical to all five peers** |
| Build facts claimed | **none.** No session existed and none was sought |
