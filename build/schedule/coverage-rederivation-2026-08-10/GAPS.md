# Schedule — GAPS: uncovered and partial, split three ways — 2026-08-10

**Nothing here is authored. Everything is proposed.** The authorisation for this pass was to build
the map, not to rewrite the suite (Rule 6).

**The three-way split matters more than the total**, because it is the difference between an
apology and a status report:

| Class | Meaning | Count |
|---|---|---|
| **OURS** | a requirement in the live specification with no case, or a case that covers only part of it — **our miss** | **5 items covering 23 assertions** |
| **NOT BUILT / DELIBERATE** | engineering or product chose otherwise; a case would fail a correct build | **0** |
| **NOT V1** | fast-follow or scope-TBC; **a story or requirement covering one of these is not a coverage gap of ours** | **7 items, 0 assertions** |
| **BLOCKED** | the specification contradicts itself and nobody has ruled | **1 assertion** |

---

# CLASS A — OURS (5 items, 23 assertions)

## G1 · §5.3 Panel collapse — the whole section · **17 assertions UNCOVERED**

**Story:** [SV-8686](https://shopview.atlassian.net/browse/SV-8686) Schedule Grid Layout & Navigation
**Full verbatim requirement, both texts and the proof no case covers it:** `SPEC-DIFF.md` D1.

**Mitigating, and stated plainly rather than buried: §5.3 did not exist until Confluence v27,
published 2026-08-07 — three days ago.** This is a fresh gap created by a spec change, not a
long-standing hole. It is still ours, because the map's job is to find it before a reviewer does.

**Proposed — 2 cases, not authored:**

| Proposed id | Title | What it would assert |
|---|---|---|
| `SCH-PANEL-01` | Panel toggle collapses and expands the sidebar, and the grid reclaims the width | first item in the toolbar, left of Today · tooltip reads "Hide panel" when open and "Show panel" when collapsed · the icon itself does not change · the divider disappears · the grid reflows into the reclaimed space |
| `SCH-PANEL-02` | Collapsing the panel hides its contents rather than discarding them | calendar date, work-order scroll position, panel search text, drill-down state and the selected work order all survive a collapse/expand cycle · reopening returns to whichever panel mode was active · the toggle still works below 960px and that manual choice holds until the next resize |

**Two cases rather than one, deliberately:** the first is a control and its immediate visual effect,
the second is state preservation across a cycle — different preconditions, different failure modes.

**Not in the proposal, and the reason is worth recording:** §5.3's *"Persistence. Not persisted in
the prototype. Session-scoped per user for build"* is authorable as written, but it overlaps a design
question already asked (**B-5** of `build/handover-ingest-2026-08-10/QUESTIONS.md`, E12 *"persist
view options per user … so it survives across sessions"*). *Session-scoped* and *survives across
sessions* are not the same promise. **Raised, not resolved** — `QUESTIONS-FOR-BRANKO.md` S-2.

---

## G2 · §6 toolbar — the Panel toggle row · **1 assertion UNCOVERED**

> **Spec v27 §6, verbatim:** *"**Panel toggle** | Collapses and expands the left work order panel
> (§5.3)."*

**Every other control in that toolbar table has its own case; this one has none** (the seven are
listed in `SPEC-DIFF.md` D2). **Folded into `SCH-PANEL-01`** rather than proposed separately — the
toolbar position is one of the things that case asserts.

---

## G3 · §3.1 — the sidebar's pointer at the panel toggle · **1 assertion UNCOVERED**

> **Spec v27 §3.1, verbatim:** *"The panel can be collapsed and expanded from the grid toolbar
> (§5.3), handing its width to the grid without losing panel state."*

Same gap as G1, reached from the sidebar section instead of the toolbar section. **Folded into
`SCH-PANEL-01` and `SCH-PANEL-02`.**

---

## G4 · §4.12 — the capacity tooltip lists **assigned** technicians · **1 assertion PARTIAL**

**Story:** [SV-8698](https://shopview.atlassian.net/browse/SV-8698) Capacity Visualization

| The requirement, v27 verbatim | Our case's own text, verbatim |
|---|---|
| *"Hover tooltip: a **per-assigned technician** breakdown (assigned vs that tech's capacity), with overtime technicians highlighted in amber."* | **SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)** — title *"Hovering a capacity bar shows a **per-technician** breakdown"*; expected 1 *"A tooltip shows a **per-technician** breakdown: assigned hours vs that technician's capacity."* |

**UNCOVERED PART:** that only technicians who have an assignment that day appear in the breakdown.
On a shop with 15 technicians of whom 3 are booked, the two readings give a 15-row tooltip and a
3-row one, and a tester running C30033 today would pass either.

**This is the find the assertion-level split exists for.** At line level the row reads *covered by
C30033* and closes. **Changed in v26 with no version comment, against wording that had stood since
v1** (`SPEC-DIFF.md` D4).

**Proposed:** one edit, `PROPOSED-CHANGES.md` **P1**. **Also one question** — a silent one-word change
is worth confirming rather than assuming (`QUESTIONS-FOR-BRANKO.md` **S-1**).

---

## G5 · §11 — three accessibility and theming assertions · **3 assertions PARTIAL**

All low value. **Named rather than absorbed**, because an undocumented deliberate omission is
indistinguishable from a miss (Rule 46).

| Assertion | Spec v27, verbatim | Covered by | UNCOVERED PART |
|---|---|---|---|
| `§11-L303.A1` | *"The Schedule supports a user-selectable Light / Dark theme, **chosen from the user menu and persisted per user**."* | **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** — *"In dark mode every part of the Schedule stays readable…"* | that the theme is chosen **from the user menu**, and that it is **persisted per user**. **The case's own `refs` claim the persistence** — `§11 (Dark theme - user-selectable Light / Dark,persisted per user)` — **but its steps never sign out and back in.** The case asserts less than its own reference says it does. |
| `§11-L303.A4` | *"elevation/shadow tokens also swap so depth reads correctly on dark surfaces."* | C38866 | that depth still reads correctly. C38866 asserts readability, not depth. |
| `§11-L301.A6` | *"Overtime and conflict signals are not color-only (OT uses a text tag; **the overflow uses shape**)."* | **SCH-LANE-03 = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)** + C38866 | that the **"+N more" overflow** is conveyed by shape rather than colour alone. C29998 asserts the affordance exists and opens a popover; C38866 asserts conflict and overtime cues are not colour-only. Neither asserts it of the overflow. |

**Recommendation: fix the first, skip the other two.** The persistence half of the dark-theme
requirement is a real user-visible promise and the case already claims it in `refs`; the depth and
shape assertions are close to design-fidelity checks and would be better handled by the Figma pass
that has not happened. **Said openly here rather than left silently undone.**

---

# CLASS B — NOT BUILT / DELIBERATE: **none**

**There is no Schedule requirement in this map that engineering or product chose not to build.**
Stated explicitly because "none" is a finding and omission would look like an unswept category.

---

# CLASS C — NOT V1 (7 items) — **not coverage gaps of ours**

All from the Fabian / Sasha design review of 5 August. Reproduced from
`build/coverage-sweep-2026-08-10/GAPS.md` Class C, re-checked against v27 today, and unchanged.

| # | Item | The review's own scope words | Why it is not ours |
|---|---|---|---|
| C1 | **E1** hover pill on work order cards | *"Out of Scope / Done in foundermode FS"* | fast-follow. Our tooltip cases are grid-block tooltips per §4.13; **no case asserts a hover pill on a sidebar card** |
| C2 | **E13** visual indicator for explicitly assigned lines | *"Will be done in Foundermode FS"* | no case asserts light-blue text or any explicit/implicit distinction |
| C3 | **E14** single tech selector + "Add Tech" | *"Will be done in Foundermode FS"* | §4.3's *"There is no technician cap and no swap flow"* is what our cases follow |
| C4 | **E16** vertical Day View | *"Fast-follow, not part of this v1 release"* | *vertical* appears in three cases and every instance is vertical **scrolling** or the now line, never an orientation |
| C5 | **E15 / E7 / E8** carryover button, its rename, one-day extend | in scope but *"scope TBC"*, *"final wording to be confirmed"* | **`carryover` appears 0 times in all 27 spec versions and 0 times in our 195 case bodies.** E7 says the name is TBC, so authoring would pin a label that does not exist — precisely what Rule 9 forbids |
| C6 | **E12** persist view options per user | *"Stated; scope TBC"* | no spec sentence supports it; the only persistence sentence in the document is §5.3's, about a different control |
| C7 | **E3 / E4 / E5 / E6** scheduling-modal redesign and remaining-hours | *"scope TBC"* ×3, *"Open question — decide before V1"* | decisions still open |

**Watch list, not an authoring list.** The moment Branko writes C5, C6 or C7 into the specification
they become Class A. **E11 (constrain the timeline to business hours) is deliberately NOT in this
table** — it is in scope for V1 and it **contradicts** §4.8's *"The full 24-hour timeline remains
intact and scrollable"*, which is still there in v27. That is a live risk to
**SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** and is already
asked as **Tab 2 Item 8.0** of the 6 August Branko sheet.

---

# CLASS D — BLOCKED (1 assertion)

## §12 vs §4.5 — shop closures. **The specification contradicts itself and the question has never been sent.**

> **§12, verbatim:** *"Shop closures (holidays, inventory days) are defined at the shop level and
> **block the spread step from placing shifts on those days**."*
>
> **§4.5, verbatim:** *"Uses the technician's own working hours. Automatically skips weekends when
> business hours are not set for them. **Shop closures and public holidays are not skipped in V1**.."*

**Both sentences are present in v27.** Our two cases follow §4.5 and say so on themselves:

| Case | Its own text |
|---|---|
| **SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089)** | *"A shift CAN be placed on the shop closure day (only weekend days with no business hours are skipped)."* · marker: `AUTOMATION: HOLD - waiting on the product owner's answer, and the shop-closure setting does not exist in the build` |
| **SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)** | *"Shop closures and public holidays are NOT skipped in V1 - shifts can be placed on those days."* · marker: `AUTOMATION: HOLD - waiting on the product owner's answer, **and the question has not been sent yet**` |

**Both carry a Rule-56 divergence sentence pointing at Branko's answers file.** The handling is
correct. **What is not correct is that the question is still sitting in our own folder.** It is
**Tab 2 Item 1.0** of `build/filters/questions-2026-08-06/`, written on 6 August, and the sheet has
never been sent. **The blocker is us, not Branko** — and one of the two cases says exactly that in
its own automation marker, which is the most honest possible record and also the most embarrassing.

**No new question is proposed for this.** It does not need one; it needs the existing sheet sent.

---

## Two open questions somebody else has already raised, recorded so they are not re-asked

Neither is a coverage gap. In both, the specification is silent and our cases assert only what it
does say — which is why the tickets exist.

| Ticket | What it asks | Our position |
|---|---|---|
| **[SV-8992](https://shopview.atlassian.net/browse/SV-8992)** (Ayesha Khan, Board Backlog) | should the toolbar grid search **scroll to** the first match, as the conflict pill does? | §6 says only *"Filters grid blocks by matching against…"*. **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** asserts the highlighting and the five matched fields and nothing about scrolling. **Correct as written.** |
| **[SV-9020](https://shopview.atlassian.net/browse/SV-9020)** (Ayesha Khan, Board Backlog) | should changing the mini-calendar month/year navigate the grid without a date click? | §3.1 and §5.2 say only *"Clicking a date navigates the main grid"*. **SCH-MCAL-01 = [C29932](https://shopview.testrail.io/index.php?/cases/view/29932)** and **SCH-MCAL-02 = [C29933](https://shopview.testrail.io/index.php?/cases/view/29933)** assert exactly that. **Correct as written.** |

**Neither ticket was touched** (Rules 38 / 62).

---

## OUTSTANDING — what I need from you

1. **A go-ahead to author `SCH-PANEL-01` and `SCH-PANEL-02`** — the one real gap, 19 assertions.
2. **A ruling on G5**: fix the dark-theme persistence half only, and record the other two as
   deliberate skips? That is the recommendation.
3. **Send the 6 August Branko sheet.** It unblocks the shop-closure contradiction and seven other
   Schedule items. Nothing else in this pass is waiting on Branko; this is waiting on us.
