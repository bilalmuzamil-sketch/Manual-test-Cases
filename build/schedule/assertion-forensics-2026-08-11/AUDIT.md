# Schedule — ASSERTION FORENSICS (Rule 41 / Rule 57) — 2026-08-11

## Was any expected result WEAKENED, or rewritten to describe the build, while keeping its keywords?

**Date:** 2026-08-11 · **Project:** Schedule ONLY · **Population: all 174 cases** under TestRail group
4254 · **No sampling** (Rule 50) · **READ-ONLY: 0 TestRail writes, 0 Jira calls, 0 Confluence writes.**

**COMMITTED BEFORE ANY REPAIR IS PROPOSED**, deliberately, so the scale of any drift is on the record
and cannot be quietly absorbed into a fix pass — the discipline the Report Suite used on 2026-08-05.
The repair proposals live in a separate file, `STAGED-REPAIRS.md`, and nothing in this file depends on
them.

---

# 1 · WHY THIS PASS EXISTS

Today's coverage re-derivation (`build/schedule/coverage-gaps-2026-08-11/`) proved mechanically that
the requirement-matching **text** survived a 174-case rewrite — 20 match scores improved, 376 held, 1
degraded and hand-cleared. It also said, in its own words, what that **cannot** detect:

> *"The score check proves the matching text is still there; it cannot prove a rewrite did not weaken
> an assertion while keeping its words — the failure mode Rule 57 warns about, where steps are VIU'd
> correctly and the expectation quietly bends."*

Recorded there as `DELIBERATE-DECISIONS.md` **D6**, risk **MEDIUM**, *"the single largest thing this
pass did not do."* **This pass does it.**

**The precedent is real, not theoretical.** The Report Suite hit exactly this on 2026-08-05: one
boilerplate paragraph pasted into 14 cases across six reports, which on
[C30352](https://shopview.testrail.io/index.php?/cases/view/30352) **overwrote wording that was
near-verbatim from that report's own specification**. And the mechanism was **not** the VIU pass — it
was an answer-ingest pass where an ambiguous source met an observed build and the observation won
(Rule 58).

---

# 2 · HEADLINE RESULT

| Class | What it means | Cases |
|---|---|---:|
| **UNCHANGED** | the assertion body is byte-identical across every snapshot in which the case appears | **167** |
| **LEGITIMATE LABEL WORK** | a screen/button/field name corrected to the build's wording; assertion unchanged in substance | **0** at assertion level |
| **LEGITIMATE SOURCE-DRIVEN** | the requirement itself moved, **proven by dating that requirement's own text across all 27 spec versions** | **6** |
| **WEAKENED / DISARMED** | the assertion now asserts less, or the case can no longer fail on it | **0 live** · **1 historical, repaired 2026-08-05** |
| **BUILD-DERIVED** | the wording describes what the build does, and **cannot be quoted back to any source in Rule 57's list** | **1 live** · **1 historical, repaired 2026-08-05** |
| | **TOTAL** | **174** |

**THE ANSWER IN ONE PARAGRAPH.** The suite is in far better shape than the Report Suite was. **Only 7
of the 174 cases have ever had an expected-result assertion change at all**, across **9 transitions**
in six weeks, and **six of those transitions are provably driven by a document**. **The 2026-08-10
rewrite that touched all 174 bodies — the window this pass was pointed at as the primary risk — changed
exactly ONE assertion, and that one is correct** (C30033, tracking spec v26). Everything else it did
was provenance, read-on dates, automation markers and the removal of expect-fail apparatus. **Two real
failures did occur, both on 2026-08-04, and both were already found and repaired by the 2026-08-05
expected-behaviour pass** — this pass reproduces them independently from cold, which is the check that
the repair was real. **One live defect remains, and it is the uncomfortable one: it was INTRODUCED by
that same repair pass**, on
**[C29944](https://shopview.testrail.io/index.php?/cases/view/29944) expected 3**.

**A NEGATIVE RESULT WORTH STATING PLAINLY: the Filters/Report-Suite waiver signature does not exist
anywhere in this suite.** Language of the form *"Known and accepted … the product behaves this way on
purpose for now. Do not raise this as a new problem"* — the wording that started the whole Rule-57
correction — was **added at zero transitions** and appears in **one** live body, where it is a
legitimate Rule-24-style tester note sourced to the technical plan
([C38864](https://shopview.testrail.io/index.php?/cases/view/38864)). Measured, not assumed.

---

# 3 · METHOD, AND THE PROOF THAT IT WORKS

## 3.1 · What was diffed

The **expected-result ASSERTION BODY** of every case, across **nine committed live snapshots**,
**excluding** the Rule-54 provenance line, the Rule-61 automation marker and pure formatting — because
those move legitimately on every pass and would otherwise drown the signal. Tool:
`tools/forensics.py`; per-case history at `evidence/assertion-history.json`.

| Tag | State it represents | Snapshot |
|---|---|---|
| **T0** | 2026-07-30 — before the first live VIU and before Rule 54 | `provenance-2026-08-04/snapshots/pre-write-live-cases-4254.json` |
| **T1** | 2026-08-04 — after the first live VIU + the recovery pass | `recovery-2026-08-04/live-pull-after-recovery.json` |
| **T2** | 2026-08-05 14:10Z — after the final-VIU / expected-behaviour repair | `provenance-reword-2026-08-05/snapshots/PRE-cases.json` |
| **T3** | 2026-08-05 17:42Z — after the provenance re-word + 3 new cases | `full-viu-2026-08-05/snapshots/PRE-cases-168.json` |
| **T4** | 2026-08-06 07:21Z — after the full-VIU write of all 168 | `full-viu-2026-08-05/snapshots/POST-WRITE-168-2026-08-06.json` |
| **T5** | 2026-08-11 09:39Z — after the 2026-08-10 source-accuracy rewrite + 6 panel cases | `c30041-latest-wins-2026-08-11/evidence/schedule-all-cases.json` |
| **T6** | 2026-08-11 10:19Z — after the C30041 latest-wins trim | `build-verify-2026-08-11/evidence/cases-174-START.json` |
| **T7** | 2026-08-11 12:00Z — before the read-on-date sweep | `read-dates-2026-08-11/snapshots/cases-PRE.json` |
| **T8** | **2026-08-11 13:39Z — LIVE, read by this pass** | `get_cases`, read-only |

Every commit that ever touched the Schedule case source was enumerated from git (32 commits,
2026-07-21 → 2026-08-11) and mapped onto these windows; the list is in `FINDINGS.md` §6.

## 3.2 · The extraction was validated three ways before a single verdict was written

**(a) IT RECONCILES WITH THE RECORD, EXACTLY.** The 2026-08-04 VIU pass recorded that it *"changed 37
expected results and ZERO steps or preconditions."* This pass, measuring independently, finds at T0→T1
**3 assertion changes + 34 note-block changes = 37**. A number derived two ways that agrees is worth
more than either derivation.

**(b) IT REPRODUCES THE TWO KNOWN FAILURES FROM COLD.** The 2026-08-05 expected-behaviour audit found
exactly two genuinely rewritten assertions —
[C29967](https://shopview.testrail.io/index.php?/cases/view/29967) and
[C29950](https://shopview.testrail.io/index.php?/cases/view/29950). This pass, told nothing about
which cases to look at, surfaces **those two and no others** in that window.

**(c) NOTHING REAL WAS SWALLOWED BY THE EXCLUSION FILTER — measured, not asserted.** Across all nine
snapshots the provenance/marker filter dropped **3,424 lines**, and **every single one is a provenance
sentence, an `AUTOMATION:` marker, or a `---` separator: 0 exceptions.** Had the filter been eating
real content, this is where it would show.

## 3.3 · One correction to this pass's own method, recorded rather than quietly fixed

**The first run reported 23 changed cases. That was WRONG, and the error was mine.** 16–20 Schedule
cases stored their expected results as raw `<ol>/<li>` HTML that TestRail showed literally to the
tester. Those `<li>` items carry no leading `1.` digits, so the first reader filed them as prose — and
the 2026-08-05 conversion to plain numbered text then read as *"assertions appeared out of nothing"* on
17 cases. **Pure formatting; exactly the noise this pass was told to exclude.** `<li>` items are now
numbered before anything else, making a raw-markup body directly comparable with its plain-text
successor. **The corrected figure is 7.** The wrong figure is recorded here because a silently-fixed
measurement is one nobody can check.

---

# 4 · THE NINE TRANSITIONS, WITH BOTH TEXTS QUOTED (Rule 45(e))

**A verdict naming only case ids is unfalsifiable and is not accepted here.** Every row quotes the
case's own text before and after, and the governing requirement verbatim from the live v27 body, with
**that requirement's own first-appearance date** — because a page's version number says nothing about
the age of a rule inside it (Rule 31 trap (c)).

---

## 4.1 · C29927 — **LEGITIMATE SOURCE-DRIVEN**

**SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927)** · *"Day / Week /
Month segmented control switches the grid between the three views"* · `refs: SV-8686 (§3.2,§6)`

| | |
|---|---|
| **BEFORE (T0, 2026-07-30)** | *"The same shifts remain visible (appropriately rendered) in all three views."* |
| **AFTER (T1, 2026-08-04, live today)** | *"The same shifts appear in all three views - each one drawn to suit that view: positioned on the hour line in Day, as a chip in the day column in Week, and as a compact chip in Month."* |

**The requirement, live v27 §3.2, verbatim:** *"**Day view.** A 24-hour timeline per technician row
with **time-positioned blocks**. **Week view.** A 7-column grid Mon to Sun (Saturday and Sunday each
toggleable) with **stacked shift chips per cell**. **Month view.** A **compact calendar** with per-day
capacity bars and **shift chips**."*
**Dated: all three sentences present since v1, 2026-07-15.**

**VERDICT: LEGITIMATE, and it went the RIGHT way.** *"Appropriately rendered"* was itself
near-unfalsifiable — a tester could not fail it. It was replaced by three specifics that map
term-for-term onto §3.2. **This is the inverse of the failure mode being hunted: a vague assertion made
checkable from the document.** Recorded because a forensic pass that only reports bad news is not
measuring, it is prosecuting.

---

## 4.2 · C29939 — **LEGITIMATE SOURCE-DRIVEN**

**SCH-WOL-04 = [C29939](https://shopview.testrail.io/index.php?/cases/view/29939)** · `refs: SV-8687
(§3.1 (Sidebar search,Work order card anatomy))`

| | |
|---|---|
| **BEFORE (T1)** | *"Customer-name search shows only cards for that customer."* · *"Technician-name search shows only cards where that technician appears on the card."* · *"All four searchable fields (WO number, customer, unit, technician) are fields visible on the card itself."* |
| **AFTER (T2, live today)** | *"Customer-name search shows only cards for that customer, **and it works with the full multi-word name** (for example 'Vuchester Retail')."* · *"Technician-name search shows only cards where that technician is on the work order - **and it must work when you type the technician's name the way the card shows it, first name and last name together** (for example 'Andrew Wade')."* |

**The requirement, live v27 §3.1, verbatim:** *"Sidebar search (\"Search work orders\") matches
against: WO number, **customer name**, unit number, and **technician name**."*
**Dated: v7, 2026-07-17.**

**VERDICT: LEGITIMATE — a strengthening, and there is a decisive test that settles it.** *"Matches
against customer name"* means the name, not a fragment of it. **And the build FAILS this assertion** —
it is the substance of [SV-8873](https://shopview.atlassian.net/browse/SV-8873), where `Andrew` finds
14 and `Andrew Wade` finds 0. **An assertion the build fails cannot have been derived from the build.**

**RIDER, recorded not waved through: one sourced sub-assertion was dropped** — *"All four searchable
fields … are fields visible on the card itself"*, which rests on §3.1's card-anatomy sentence. **It is
covered elsewhere**, by **SCH-WOL-01 = [C29937](https://shopview.testrail.io/index.php?/cases/view/29937)**
*"Work order card anatomy, incl. the status-colored left border"*, so **no coverage was lost**. Checked
rather than assumed.

---

## 4.3 · 🔴 C29944 — **BUILD-DERIVED. THE ONE LIVE FINDING OF THIS PASS.**

**SCH-FILT-03 = [C29944](https://shopview.testrail.io/index.php?/cases/view/29944)** · *"Status filter
narrows the list to work orders in the chosen status(es)"* · `refs: SV-8687 (§5.1)`

| | |
|---|---|
| **BEFORE (T1, 2026-08-04)** | 1. *"The Status group lists the work order statuses the app supports."* 2. *"Only work orders in the chosen status remain in the card list."* 3. *"The card left-border colors of the remaining cards are consistent with that status."* |
| **AFTER (T2, 2026-08-05, LIVE TODAY)** | 1. unchanged. 2. *"Only work orders in the chosen status remain in the card list **- no work order of any other status is shown**."* **3. *"Choosing more than one status shows the work orders of all the chosen statuses together."*** 4. *"The card left-border colours …"* |

**The governing requirement, live v27 §5.1, QUOTED IN FULL so nothing is hidden by an ellipsis:**

> *"Filters live behind a \"Filter\" button (with an active-count badge); there are no assignment tabs.
> Applying a filter narrows the flat card list, and \"Clear all\" resets in one click.* … *Status | All
> work order statuses currently supported in the app* … *Search and filter work together: the search
> field (see §3.1) narrows by text match, and the filter button narrows by structured attributes. Both
> can be active at the same time."*

**§5.1 SAYS NOTHING ABOUT SELECTING MORE THAN ONE STATUS. Dated across ALL 27 VERSIONS: the words
`multi`, `multi-select`, `multiple`, `more than one` and `several` appear in §5.1 in NONE of them** —
not v1, not v27 (`evidence/requirement-dating.json`). It is not in the epic story, not in the technical
plan, not in the design, and not in any of Branko's answers; all four were searched and are listed in
`FINDINGS.md` §3.

**AND THE CASE'S OWN METADATA STILL SAYS SO, verbatim, unchanged since it was authored on 2026-07-21:**

> *"Status option list = from the app (spec defers) - enumerate live. **Single vs multi-select within a
> group is not pinned - confirm live.**"*

**So the authoring pass KNEW the point was unpinned and flagged it. The 2026-08-05 pass confirmed it
live — its own `final-viu-2026-08-05/FINDINGS.md` records C29944 as *"PASS re-proven over ALL 8
statuses the filter accepts, 0 leaks"* — and wrote the observation into the tester-facing expected
results as a requirement.** That is Rule 58 exactly: **an ambiguous source met an observed build and
the observation won.** The hedge survives only in the metadata layer, which no tester and no reviewer
reads.

**A SECOND, INDEPENDENT DEFECT ON THE SAME LINE — it is not runnable as written.** The steps are:
*"1. Open the 'Filter' panel. 2. **Choose one status** under Status. 3. Read the list."* **The tester
never selects a second status, so expected 3 cannot be reached by following the steps** (Rule 28,
dimension 2: *"expected result doesn't follow from the steps"*). This corroborates the finding from a
different direction: the assertion did not come from the case's own procedure.

**⚠️ THE UNCOMFORTABLE PART, AND IT IS THE SHARPEST LESSON HERE. This was introduced BY the
expected-behaviour repair pass, and that pass's own audit had cleared the case minutes earlier.**
`build/schedule/expected-behaviour-audit-2026-08-05.md` row 59 classifies C29944 as **class C
(LEGITIMATE)** and quotes its expected results **as they stood BEFORE the repair — three items, no
multi-status assertion.** The audit was committed before the repair, exactly as good practice requires.
**So the discipline worked and still left this gap: an audit committed before the repair does not audit
the repair.** That is a process finding, not a slip, and it is written up in `FINDINGS.md` §5.

**REPAIR (staged, not applied): REMOVE the assertion, or make it scope-conditional, and carry the open
question to Branko (Rules 25/42/58). NEVER substitute what the build does.** `STAGED-REPAIRS.md` R1.

---

## 4.4 · C29950 — **WEAKENED at T0→T1, REPAIRED at T1→T2**

**SCH-LINE-03 = [C29950](https://shopview.testrail.io/index.php?/cases/view/29950)** · `refs: SV-8687
(§3.1 (Line drill-down - approved-only))`

| | |
|---|---|
| **T0 (2026-07-30)** | *"The header's line count matches **the approved lines only**."* |
| **T1 (2026-08-04) — WEAKENED** | *"The line count in the drill-down header matches **the number of lines actually listed**."* |
| **T2 (2026-08-05) — RESTORED, live today** | *"The line count in the drill-down header matches the number of **APPROVED** lines on the work order - **a line that was never approved is neither listed nor counted**."* |

**The requirement, live v27 §3.1, verbatim:** *"**Only approved work order lines are visible in the
schedule sidebar; unapproved lines do not appear.**"* **Dated: v15, 2026-07-17.**

**Why T1 was a real weakening, in one sentence: a header count that matches "the number of lines
actually listed" is a near-tautology the build passes automatically** — if the drill-down wrongly
listed an unapproved line, the count would match it, and the case would still pass. **The test could no
longer fail on the thing it exists to check.** The T2 restoration ties the count back to the approved
lines on the work order, which is falsifiable again. **Live state: CORRECT.**

---

## 4.5 · C29967 — **BUILD-DERIVED at T0→T1, REPAIRED at T1→T2**

**SCH-SCOPE-05 = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967)** · `refs: SV-8689
(§4.3 (Select multiple,Select all shortcut,Cancel))`

| | |
|---|---|
| **T0 (2026-07-30)** | *"'Select all' ticks every line - the tally equals the whole order …"* · *"Cancel leaves checkbox mode and returns to the normal single-tap line list without creating anything."* |
| **T1 (2026-08-04) — DISARMED** | ***"There is no 'Select all' button and no 'Cancel' button.** To leave without creating anything, close the picker with its X or press Escape."* |
| **T2 (2026-08-05) — RESTORED, live today** | *"A **'Select all'** shortcut ticks every line, giving the same line count and hours as choosing the whole work order."* · *"A **'Cancel'** control leaves tick-box mode and returns you to the ordinary single-tap line list, without creating anything and without closing the picker."* |

**The requirement, live v27 §4.3, verbatim:** *"\"Select multiple\" is an opt-in control that switches
the line rows into checkboxes and shows a confirm bar with a running tally (\"Create shift · 2 lines ·
6h\"), a **\"Select all\" shortcut** (equivalent to whole order), and **Cancel** (returns to the fast
single-tap list)."* **Dated: present since v1, 2026-07-15 — the whole life of the document.**

**This is the textbook case.** At T1 the case was rewritten to assert the **ABSENCE** of two controls
the specification has required since day one — so a build that grew a `Select all` button would have
**FAILED** the test, and the build as it stood would have **PASSED**. The assertion had been inverted
against its own source. **Live state: CORRECT.**

---

## 4.6 · C30033 — **LEGITIMATE SOURCE-DRIVEN** (reference point 1 of 2)

**SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)** · `refs: SV-8698
(§4.12 (Hover tooltip))`

| | |
|---|---|
| **BEFORE (T4, 2026-08-06)** | *"A tooltip shows a **per-technician** breakdown: assigned hours vs that technician's capacity."* |
| **AFTER (T5, live today)** | *"A tooltip shows a breakdown **for each assigned technician**: assigned hours vs that technician's capacity. (Version 26 of the specification, published 7 August 2026, narrowed this from 'per-technician' to 'per-assigned technician'.)"* |

**The requirement, live v27 §4.12, verbatim:** *"Hover tooltip: a **per-assigned technician**
breakdown (assigned vs that tech's capacity), with overtime technicians highlighted in amber."*

**Dating, re-derived by this pass from the 27 cached bodies rather than taken on trust:**
`per-assigned technician` **first appears at v26, 2026-08-07T11:02:57Z**; the wording it replaced,
`a per-technician breakdown`, stood from **v1 (2026-07-15) to v25**.

**VERDICT: LEGITIMATE, and FAITHFUL to v27.** The change tracks the newer source, and Rule 32 points
forwards. **THE RIDER STANDS AND IS RESTATED, NOT QUIETLY DROPPED:** v26 carries **no version comment**,
so nothing announced the one-word change, and the 2026-08-10 pass recommended **holding this edit until
Branko confirmed it was not a typo** — it was applied without that confirmation. It is defensible under
Rule 57 (the spec is the source and this is its current text), the residual risk is **LOW**, and the
one-line question to Branko still stands. Carried as `STAGED-REPAIRS.md` **Q1** — a question, not a
repair.

---

## 4.7 · C30041 — **LEGITIMATE SOURCE-DRIVEN**, and the removal was the correct repair shape

**SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** · `refs: SV-8686
(§6 (Search) - spec v27 2026-08-07)`

| | |
|---|---|
| **BEFORE (T5)** | 1. *"Blocks that match the search are highlighted; blocks that do not match fade."* 2. the five matched fields 3. *"Matching blocks stay in place on the grid (search visually filters; it does not remove or rearrange)."* 4. *"Clearing the search restores all blocks to normal."* |
| **AFTER (T6, live today)** | 1. *"The toolbar search filters the blocks on the grid against what you typed."* 2. the five matched fields, kept and named explicitly 3. a tester note: *"the specification does not say what happens to the blocks that do NOT match … **Do not pass or fail this test on that** … an open question with the product owner."* |

**The requirement, live v27 §6, verbatim:** *"**Search** | Filters grid blocks by matching against
customer name, WO number, unit number, technician name, and line name."* — **and nothing more.**

**Dating, re-derived by this pass:** the sentence *"Non-matching blocks fade; matching blocks
highlight."* was in the §6 Search row from **v7 (2026-07-17) through v23**, and was **DELETED at v24,
2026-08-06T08:34:03Z**. It is absent from v25, v26 and v27. The five-field list is present in **every**
version from v7 to v27.

**VERDICT: LEGITIMATE.** The removed assertion rested on a **deleted** requirement; the two corollaries
(*"does not remove or rearrange"*, *"clearing restores"*) were never in any version. **And the repair
took the shape Rules 25/42 require — the unsupported assertions were REMOVED and the silence
DISCLOSED, not replaced with what the build does.** The surviving five-field assertion is current live
PRD text and is the sole coverage of it in the suite.

**⚠️ THE RIDER THAT MATTERS, AND IT IS A RULE-57 ITEM: story SV-8686 STILL ASKS FOR THE FADE
BEHAVIOUR.** Under Rule 57 as amended on 2026-08-06, **the epic's stories are an authoritative source
of expected behaviour**, so the PRD and the story now disagree — and a PRD-vs-story mismatch is a
**defect in the documents that must be RAISED, never silently resolved.** The case follows the more
recent source (Rule 32) on the QA lead's own ruling, verbatim *"The latest or newer wins here"*, and
**discloses the divergence in its own tester-facing text (Rule 56)** — which is compliant. **What is
owed is the raising of it with Branko**, tracked as `STAGED-REPAIRS.md` **Q2**.

---

## 4.8 · The six §5.3 panel cases — no history to diff, so checked against v27 directly

**C43582–C43587**, authored 2026-08-11. They appear only from T5, so a diff has nothing to compare;
instead each was read against **v27 §5.3**, which is **new at v27 and exists in no earlier version**
(dated across all 27).

| Case | Its live assertion, verbatim (extract) | The requirement, v27 §5.3, verbatim | Verdict |
|---|---|---|---|
| **[C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** | *"There is a button at the far-left end of that row, to the left of the Today button."* · *"While the left panel is showing, the tooltip reads: Hide panel"* | *"An icon button collapses and expands the left panel. It is the first item in the grid toolbar, left of Today …"* · *"the tooltip carries the meaning — \"Hide panel\" when open, \"Show panel\" when collapsed."* | **LEGITIMATE** |
| **[C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** | *"The left panel closes with a short, smooth sliding movement as its width shrinks"* · *"The dividing line … goes away with it, leaving no leftover line, seam or empty strip"* | *"The panel animates closed over a short width transition, its divider disappears so no seam remains, and the grid reflows into the reclaimed space."* | **LEGITIMATE** |
| **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** | *"The panel comes back showing the same things you left in it. Nothing has been reset, cleared or reloaded from scratch"* | *"Contents are hidden rather than discarded. Calendar date, work-order scroll position, panel search text, drill-down state, and the selected work order all survive a collapse/expand cycle"* | **LEGITIMATE** |
| **[C43585](https://shopview.testrail.io/index.php?/cases/view/43585)** | *"The panel button still works on a narrow window … clicking it shows the left panel by hand even at that width."* | *"The toggle still works, so the user can expand it manually at any width; that manual choice holds until the next resize across the breakpoint."* | **LEGITIMATE** |
| **[C43586](https://shopview.testrail.io/index.php?/cases/view/43586)** | *"With the panel hidden, the pop-up no longer keeps clear of the space the panel used to take up. It sits against the edge of the browser window with a normal margin instead."* | *"Anything that positions itself clear of the panel falls back to a normal viewport margin while the panel is collapsed."* | **LEGITIMATE** |
| **[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** | *"At step 6, after signing out and back in, the left panel is showing again … a working-mode preference for the session you are in, not a saved view setting."* | *"Session-scoped per user for build — this is a working-mode preference, not a saved view."* | **LEGITIMATE**, and it **discloses its open question** in its own text (the 5 August design review asks for view settings to survive sessions) — Rule 58 satisfied |

**All six name the build only as what the case was *last checked against*, never as the source** — and
all six carry `AUTOMATION: READY` with a run-as-written instruction, which is correct under the Rule-61
amendment of 2026-08-11 (*"When there is nothing to back 'Expect fail' then not set that marker"*).
**Two defects in their own text are confirmed independently and are NOT assertion problems**; they are
in `FINDINGS.md` §4 and `STAGED-REPAIRS.md` R2.

---

# 5 · THE NOTE-BLOCK LAYER — where the Filters disarming actually lived, checked separately

A numbered assertion is not the only place an expectation can bend. On Filters,
[C29557](https://shopview.testrail.io/index.php?/cases/view/29557) was disarmed by a **note
paragraph**, not by an assertion. So the non-numbered prose was diffed too: **46 cases, 105 note-block
transitions**, every added and removed line classified. **Nothing is unaccounted for.**

| Class of note change | Added | Removed |
|---|---:|---:|
| Rule-61 symptom block (*"What you should see today: …"*) | 21 | 21 |
| Rule-61 three-outcome bullets | 63 | 63 |
| Deviation note (*"Known issue on the build tested: … Spec X says … see SV-88xx"*) | 27 | 27 |
| Spec-quote / divergence disclosure | 9 | 8 |
| Tester-guidance note | 6 | 1 |
| Honest *"cannot be set up — mark BLOCKED"* note | 2 | 0 |
| **Waiver signature (*"known and accepted / on purpose for now"*)** | **0** | **0** |

**The dominant pattern is the CORRECT one** — state the documented expectation, then note plainly that
the build differs and name the ticket. **27 cases do exactly that**, and the 2 BLOCKED notes name what
could not be set up instead of inventing a verdict (Rules 12/14).

**THE ONE BIG MOVEMENT, AND IT IS LEGITIMATE: the 2026-08-10/11 window removed 21 known-issue symptom
blocks and their 63 outcome bullets, and changed NOT ONE assertion while doing it.** That is the
Rule-61 amendment of 2026-08-11 being applied — *"When there is nothing to back 'Expect fail' then not
set that marker. And let the manual QA tester simply discover whether this test fails or passes."*
**Removing the expect-fail apparatus does not weaken an assertion: the documented expectation stayed
put, so the case can still fail.** Recorded with a rider in `FINDINGS.md` §2.

---

# 6 · PER-CASE TABLE — all 174

The full table, one row per case with its class, its transition counts and the basis for the verdict, is
**`evidence/per-case-table.md`** (174 rows, generated from `evidence/assertion-history.json`; a C-id and
a TestRail link on every row, per Rule 8). Summary:

| Class | Cases |
|---|---:|
| UNCHANGED | 167 |
| LEGITIMATE SOURCE-DRIVEN | 4 |
| LEGITIMATE SOURCE-DRIVEN (was WEAKENED, repaired) | 1 |
| LEGITIMATE SOURCE-DRIVEN (was BUILD-DERIVED, repaired) | 1 |
| **BUILD-DERIVED — live** | **1** |
| **TOTAL** | **174** |

**Of the 167 UNCHANGED, nine have a deliberately short history and say so:** the **6** §5.3 panel cases
were authored today, and **3** (C43554, C43555, C43556) on 2026-08-05.

---

# 7 · HONEST LIMITS — read these before quoting any number above

**(a) THIS IS A CHANGE FORENSIC. A CASE THAT WAS BUILD-DERIVED AT AUTHORING AND NEVER TOUCHED SINCE
WOULD NOT APPEAR IN SECTION 4 AT ALL.** That population is covered by a different instrument — the
2026-08-05 expected-behaviour audit, which classified all 165 then-existing cases (A 2 · A\* 0 · B 0 ·
C 155 · T 8 · D 0). **And C29944 proves that instrument is not airtight either**, since the one live
finding here was introduced by that very pass and scored **C** by its own audit. Two independent
cross-checks were therefore run over all 174 live bodies: **build-referential language inside a
numbered assertion — 0 hits**; and a near-tautology sweep — 23 short assertions, **every one a
legitimate short sub-assertion in a multi-assertion case** (e.g. *"A toast with Undo appears."*, sourced
to §7), **0 tautologies**.

**(b) NO BUILD WAS OBSERVED AND NO BUILD FACT IS CLAIMED (Rule 12).** `quick-login` and `switch-user`
were **never called** — a sibling worker shares this session. Every statement about the build in this
file is a **quotation of what a case or a prior pass records**, never an observation of ours.

**(c) THE SNAPSHOT SERIES IS NOT CONTINUOUS.** Nine states over six weeks, not every intermediate
write. A change made and reverted **between** two adjacent snapshots would be invisible. The windows are
tight where it matters most — four snapshots inside the last 24 hours, covering the whole 174-case
rewrite this pass was pointed at.

**(d) `refs` AND PROVENANCE LINES WERE NOT AUDITED HERE**, beyond quoting them. Whether each case's
provenance names a source that supports it was the 2026-08-10 source-accuracy pass's job; its residual
findings (2 mild under-citations, plus C38866 citing the epic where SV-8700 owns the requirement) are
open and unchanged by this pass.

**(e) THE BRANCH IS FINAL BUT NOT BUILD-VERIFIED.** All three branches were declared final on
2026-08-11, and **0 of 174 Schedule cases are verified against the build now running**
(`build/schedule/build-verify-2026-08-11/BUILD-VERIFICATION.md`). **This pass says the cases are
faithful to their sources; it says nothing about whether the product meets them.**

---

# 8 · AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65)

**None.**

**This pass changed no test case** — 0 `add_case`, 0 `update_case`, 0 `delete_case` — and on this pass's
own live reading at 13:39Z **all 174 Schedule cases carry `custom_atmstatus = 1` (Not Automated)**, so
not one is flagged Automated in TestRail and there is nothing for Vlad to adjust either way.

**The section is written even though the answer is "none", because omitting it is how a reader loses the
ability to tell "clear" from "we forgot to look."**

**⚠️ For whoever pushes `STAGED-REPAIRS.md`: capture `custom_atmstatus` AT WRITE TIME, not from this
file.** The flag moves both ways — C29600 went `1 → 3 → 1 → 3` on another project — so a value read
today is not evidence about a value tomorrow.
