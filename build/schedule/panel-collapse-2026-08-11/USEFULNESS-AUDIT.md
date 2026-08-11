# Ruthless Usefulness Audit — the six SCH-PANEL cases — 2026-08-11

**Population: 6 of 6 cases, scored on all three dimensions. No sampling.** Each was cold-read in
full from its **live TestRail text**, not from the authoring script — because the thing a tester
reads is what is in TestRail.

**Scope, stated so it cannot be over-read: this audit covers the SIX cases authored today. It is
NOT a re-audit of the 174-case suite.** The last full-suite audit was 2026-07-31.

---

## The headline

| Dimension | Result |
|---|---|
| **1 · USEFUL** | **KEEP 5 · WEAK-KEEP 1 · MERGE 0 · CUT 0** |
| **2 · MAKES SENSE** | **SENSIBLE 6 · FIX-WORDING 0 · NONSENSE 0** — after two defects were found and fixed pre-push (below) |
| **3 · GENUINE + LAYMAN-RUNNABLE** | **6 of 6.** Every case carries a Jira story **and** a spec anchor in `refs`; every case is executable by a non-technical tester with no tool beyond a browser |
| **Contradictions found in the cross-case sweep** | **0** |
| **Waste** | **0 of 6 (0%)** |
| **Makes no sense** | **0 of 6 (0%)** |

---

## Dimension 1 — USEFUL

| Case | Verdict | Distinct observable behaviour | Would a failure be a real reportable bug? |
|---|---|---|---|
| **[C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** SCH-PANEL-01 | **KEEP** | the control exists, where it sits, how it looks, what its tooltip says in each state | yes — a missing or mislabelled control, or a tooltip that never changes, is the whole feature failing to announce itself |
| **[C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** SCH-PANEL-02 | **KEEP** | the collapse itself: animation, no leftover seam, grid reflow | yes — this is the feature's entire point; a leftover empty strip is a visible layout defect |
| **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** SCH-PANEL-03 | **KEEP** | state survives a collapse/expand cycle | yes — and it is the **highest-value** of the six: losing a filtered list and a drill-down mid-task is the failure a manager would actually hit |
| **[C43585](https://shopview.testrail.io/index.php?/cases/view/43585)** SCH-PANEL-04 | **KEEP** | the toggle works below the breakpoint, and a manual choice is not stomped | yes — a control that silently stops working at narrow widths is a real defect |
| **[C43586](https://shopview.testrail.io/index.php?/cases/view/43586)** SCH-PANEL-05 | **WEAK-KEEP** | pop-up positioning while collapsed | yes, but narrower — a dialog rendering half off screen. **Flagged: closest of the six to a design-fidelity check** |
| **[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** SCH-PANEL-06 | **KEEP** | the choice survives navigation, does not survive sign-out, and is per-user | yes — and it is the one case guarding an **open product question** |

### The slop patterns, hunted explicitly

| Pattern | Present? |
|---|---|
| Near-duplicates across areas | **No.** The only nearby case is C30086 (auto-collapse), and C43585 **deliberately does not re-assert it** — the exclusion is written on the case |
| Per-property explosion (one case per attribute) | **No.** Position, border, colour, icon-stability and tooltip are **one** case, C43582, not five |
| Empty-state / tooltip present-vs-text splits | **No** |
| Testing the framework rather than the feature | **No.** No case asserts that a browser can resize or that a tooltip can render |
| Spec-parroting | **No.** Every expectation is written as something a tester DOES and SEES, not as the sentence restated |

### The one merge a reviewer would reasonably propose, answered

**"Fold C43586 (pop-ups) into C43583 (collapse)."** Its precondition genuinely is C43583's end state.
**Kept separate** because the failure is different in kind — a dialog off screen is not the panel
failing to close — and merging would bury it as a fifth expectation in a case about layout reflow.
**Honest risk: if the QA lead prefers five cases, C43586 is the one to merge**, and nothing else in
this set is a candidate.

---

## Dimension 2 — MAKES SENSE (cold read, all 6, against the six fail conditions)

| Fail condition | Hits |
|---|---|
| Steps not executable in order, or precondition unreachable | **0** |
| Expected result does not follow from the steps | **0** — *after the fix below* |
| Internal contradiction | **0** |
| References a control in neither the spec nor a design source | **0** |
| Domain nonsense | **0** |
| Not actionable — tester cannot tell what to DO or what PASS looks like | **0** |

### Two real defects found by this audit and fixed BEFORE the push

**Recorded rather than quietly corrected, because an audit that never finds anything is not an audit.**

**(1) C43582 — an expectation the steps did not drive.** Expected item 8 asserted *"clicking it again
shows it"*, but the steps stopped at six and never clicked a second time. A tester would have had to
either invent a step or mark a true statement unverified. **Fixed: step 7 added, and the expectation
now names the steps it depends on** — *"Clicking the button at step 4 hides the left panel, and
clicking it again at step 7 shows it."*

**(2) C43587 — an un-runnable clause smuggled into a runnable expectation.** Item 1 ended
*"it does not change what anyone else sees"*, which cannot be checked with one account, so a
single-account tester would have had to guess. **Fixed: the per-user claim was split out into its own
expectation with its own step and its own precondition**, which states plainly that a second sign-in
is needed and to mark that point **Blocked** rather than guess if you do not have one.

### Cross-case consistency sweep (Rule 28's mandatory stage)

All six assert on the same control, so they were diffed against each other and against the five
existing cases containing the word *collapse*.

| Check | Result |
|---|---|
| Opposite assertions among the six (hidden vs shown, real-time vs deferred, editable vs locked) | **0** |
| Title vs expected result, every case | **6/6 consistent** |
| Same-`refs`-anchor diff (all six cite §5.3) | **0 conflicts** — they partition the section's bullets, they do not overlap |
| Against C30086 (`§11` / narrow viewport) | **No contradiction.** C43585 asserts the *toggle*; C30086 asserts the *auto-collapse*. The exclusion is written into C43585's own notes |
| Against C29934 (mini-calendar chevron, *"Hide the calendar"*) | **No contradiction, and the trap is named on C43582** — a different control in the same strip |

---

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE

| Case | Jira ticket | Spec anchor | Both in `refs`? | Runnable by a non-technical tester? |
|---|---|---|---|---|
| C43582 | SV-8686 | §5.3 · §6 | **yes** | yes — look, hover, click |
| C43583 | SV-8686 | §5.3 · §3.1 | **yes** | yes — click and watch |
| C43584 | SV-8686 | §5.3 · §3.1 | **yes** | yes — set four things up, cycle, re-check |
| C43585 | SV-8686 | §5.3 · §11 | **yes** | yes — resize the window and click |
| C43586 | SV-8686 | §5.3 | **yes** | yes — open a dialog and look at where it sits |
| C43587 | SV-8686 | §5.3 | **yes** | yes — needs a second sign-in, **and the case says so and says to mark it Blocked rather than guess** |

**No tool is needed by any of the six** — no developer tools, no screen reader, no file inspection.
Per the QA lead's ruling a tool flag would not justify `HOLD` anyway; **the HOLD here is the genuine
kind: the feature is absent from the build.**

**Jargon check, on the live text:** no case IDs, no §-anchors, no HTTP terms, no endpoint names, no
enum names, no the word "VIU" in any tester-facing field. The only §-reference is inside the Rule-54
provenance line, which is the authorised exception.

---

## Is the critic right?

The standing claim is that AI produces *"more than 70% useless test cases"* and that *"some tests
just do not make sense"*.

**On this set: waste 0 of 6 (0%), makes-no-sense 0 of 6 (0%).**

**And the honest half, because a 0% with no working shown is worth nothing.** This audit **did** find
two defects — an expectation the steps never drove, and an un-runnable clause — in six cases written
carefully that same hour. **Both were exactly the second kind of failure the critic names**, and both
would have shipped without the cold read. They were caught and fixed before the push, which is the
process working rather than the process being unnecessary.

**The genuine weakness a hostile reviewer would find, named before they do:** **C43582 expected item
4** renders *"a borderless panel-left icon in **secondary text color**"* as *"the same muted grey as
the other icon buttons in that row"*. That is an interpretation of a design token made **without a
dated design to check it against** (`SOURCE-CURRENCY.md` source D is PARTIAL). It is defensible —
there are three sibling icon buttons in that row to compare against — but it is the softest assertion
in the set, and it is flagged on the case, in `NEW-CASES.md` and here rather than buried.

**One more thing a reviewer should know: all six are `AUTOMATION: HOLD` because the control is not
built, so none of them has ever been executed against working software.** Their usefulness is
assessed on the requirement they encode, not on a passing run — and that limit is stated rather
than glossed.
