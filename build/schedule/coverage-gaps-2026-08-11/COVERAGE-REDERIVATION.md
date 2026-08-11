# Schedule — requirement ↔ case RE-DERIVATION, both directions — 2026-08-11

**Re-derived, not patched (Standing Rule 43).** The requirement set was re-extracted from a **live-fetched
spec body**, and the matcher was re-run over the **current 174-case suite**. Nothing was carried forward
on trust — §2 below is the mechanical proof of what could and could not be carried.

**READ-ONLY: zero TestRail writes, zero Jira writes, nothing created anywhere** (Rules 6 / 62).

---

## THE ANSWER IN ONE TABLE

| | 2026-08-10 | **2026-08-11** | |
|---|---|---|---|
| Live specification | Confluence v27 | **Confluence v27** | unmoved 4 days, body sha256 identical |
| Requirement lines · **assertions** | 234 · **397** | 234 · **397** | reproduced exactly from an independent re-fetch |
| Cases examined, both directions | 168 | **174** | +6, all ours, 0 foreign |
| **COVERED** | 282 | **301** | **+19** |
| **PARTIAL** | 4 | **3** | −1 |
| **UNCOVERED** | **19** | **0** | **−19** |
| **BLOCKED** (spec self-contradiction) | 1 | **1** | unchanged; risk lowered, see §5 |
| Not independently testable | 91 | **92** | +1, one row re-classified |
| Cases with a **stale § anchor** | 0 | **0** | |
| Cases with a **stale spec version stamp** | **168** | **0** | **cleared** |

301 + 3 + 0 + 1 + 92 = **397** ✔

### **Of the 19 + 4 = 23 rows this pass was sent to re-verify, THREE are genuinely still open.**

| | Count | Where they went |
|---|---|---|
| **Genuinely still PARTIAL — real gaps, staged in `NEW-CASES.md`** | **3** | all three in **§11**: dark-theme selection + per-user persistence · dark-mode depth · the "+N more" overflow conveyed by shape |
| Now genuinely COVERED by the six new §5.3 cases | **18** | §5.3 ×16 · §6-L200.A1 · §3.1-L44.A1 |
| Now genuinely COVERED because the case was fixed | **1** | §4.12-L165.A1 — C30033 |
| **Re-classified: never a requirement on the build** | **1** | §5.3-L195.A1 — it describes the *prototype* |

18 + 1 + 1 + 3 = **23** ✔

**And the honest part: the three that remain are NOT fresh spec churn.** Dated against all 27 versions
(`SOURCE-CURRENCY.md` trap (c)), the dark-theme sentence entered at **v19, 2026-07-23** and *"the overflow
uses shape"* has been in the document **since version 1, 2026-07-15**. **They are 19 and 27 days old.**
That is less comfortable than "the spec moved under us", and it is what the evidence says.

---

## 1 · Why this is a re-derivation and not a re-read of last pass's file

Three inputs were re-established from source before a single verdict was touched:

| Step | What was re-run | Result |
|---|---|---|
| Spec body | re-fetched live from `/wiki/rest/api/content/713031682?expand=version,body.storage` | **HTTP 200**, version **27**, 43,064 chars, **sha256 `4c51fb72…` identical to the 2026-08-10 mirror** |
| Requirement extraction | `extract_requirements.py` re-run on the re-fetched body | **345 content lines · 234 REQ · 33 requirement-bearing sections · 0 unaccounted** |
| Assertion split | `assertions.py` re-run | **397 assertions · 79 lines carrying more than one** |

**The figures reproduce the 2026-08-10 pass exactly, from an independently re-fetched body.** That is the
point of re-running rather than reusing: had the extractor or the body drifted, the totals would not match,
and a patched map would have hidden it.

---

## 2 · The load-bearing check: **all 174 case bodies changed since the map was built**

**Every one of the 174 cases has an `updated_on` later than 2026-08-10 12:00Z.** A later pass re-stamped
the specification version on all of them, corrected `custom_atmstatus` to `1`, removed every
`READY - EXPECT FAIL` marker and rewrote text. **So the 282 COVERED verdicts of 2026-08-10 could not be
carried forward on trust** — coverage lives in the case's *words*, and the words moved.

**What was done instead: the matcher was re-run over the current bodies and every one of the 397
assertions had its best-match score compared against the 2026-08-10 baseline.** An assertion whose score
held or improved still contains the text that earned its verdict; one that dropped is a candidate for
lost coverage and gets a hand read. **This is a mechanical check of 397 of 397 — not a sample (Rule 50).**

| | |
|---|---|
| Assertions mechanically re-checked | **397 of 397** |
| Score **improved** by more than 0.05 | **20** |
| Score **held** within ±0.05 | **376** |
| Score **degraded** by more than 0.05 | **1** |
| Assertions with **zero candidate case** | **0** (was 19 — the whole §5.3 family) |

### The one degradation, hand-read in full (Rule 45(e))

**`§4.13-L169.A1` — 0.818 → 0.727, same case C30036.**

| The requirement, Confluence v27 §4.13, verbatim | The case's own text, live 2026-08-11, verbatim |
|---|---|
| *"Event tooltip: event name (plus its grey category dot); date and time range; technician."* | **SCH-TIP-03 = [C30036](https://shopview.testrail.io/index.php?/cases/view/30036)** — title *"Event hover tooltip shows name, grey category dot, time range and tech"*; expected 1 *"The tooltip shows the event name with its category dot (grey for a default event)."*; expected 2 *"The date and time range are shown."*; expected 3 *"The technician is shown."* |

**HAND VERDICT: still COVERED, in full — all four promises (name · grey category dot · date and time
range · technician) are asserted.** The score drop is a vocabulary artefact of the rewording, not lost
coverage. **Recorded rather than waved through, because a score drop is exactly the signal that would
matter if it were real.**

**⚠️ Honest limit on this method, stated plainly.** The score check proves the *matching text is still
there*; it cannot prove a rewrite did not **weaken an assertion while keeping its words** — the failure
mode Rule 57 warns about, where steps are VIU'd correctly and the expectation quietly bends. Detecting
that needs a per-case diff of the expectation body against its cited source across the intervening
commits, which is a Rule-41 forensic pass over 174 cases and is **not what this pass was asked for**. It
is recorded as an outstanding risk in `DELIBERATE-DECISIONS.md` **D6** (risk MEDIUM) rather than left unsaid.

---

## 3 · DIRECTION 1 — the 19 previously UNCOVERED assertions, re-verified with both texts quoted

**All nineteen were closed by the six §5.3 cases pushed earlier today
([C43582](https://shopview.testrail.io/index.php?/cases/view/43582)–[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)).**
Every row quotes the requirement and the covering case's own text side by side; a verdict naming only case
ids is unfalsifiable and is not accepted (Rule 45(e)).

### §5.3 Panel collapse — the control (3 assertions)

| Assertion | The requirement, v27 verbatim | The covering case's own text, live verbatim | Verdict |
|---|---|---|---|
| `§5.3-L189.A1` | *"An icon button collapses and expands the left panel."* | **C43582** expected 8: *"Clicking the button at step 4 hides the left panel, and clicking it again at step 7 shows it."* | **COVERED** |
| `§5.3-L189.A2` | *"It is the first item in the grid toolbar, left of Today, sitting in the same left gutter as the grid's row labels and avatars so it reads as belonging to the panel it controls"* | **C43582** expected 1: *"There is a button at the far-left end of that row, to the left of the Today button."* · expected 2: *"It sits above the grid's left-hand column - the one headed Department that carries the technician names and their small round profile pictures - so it reads as belonging to the panel it controls."* | **COVERED** |
| `§5.3-L189.A3` | *"grouping with the date controls."* | **C43582** expected 3: *"It sits together with the date controls: the Today button and the left and right arrows."* | **COVERED** |

### §5.3 — Control appearance and tooltip (3 assertions)

| Assertion | The requirement, v27 verbatim | The covering case's own text, live verbatim | Verdict |
|---|---|---|---|
| `§5.3-L190.A1` | *"Control. A borderless panel-left icon in secondary text color."* | **C43582** expected 4: *"The button shows a small picture only, with no border or box drawn around it, in the same muted grey as the other icon buttons in that row."* | **COVERED — with a disclosed translation.** *"Secondary text color"* is a design-system token a non-technical tester cannot read off a screen, and **we hold no dated design for this control** (source D is PARTIAL). The case asserts its **observable form** with three sibling icon buttons in the same row to compare against. Disclosed on the case, not silently substituted. |
| `§5.3-L190.A2` | *"The icon does not change between states"* | **C43582** expected 7: *"The picture on the button is exactly the same in both states - only the tooltip changes."* | **COVERED** |
| `§5.3-L190.A3` | *"the tooltip carries the meaning — \"Hide panel\" when open, \"Show panel\" when collapsed."* | **C43582** expected 5: *"While the left panel is showing, the tooltip reads: Hide panel"* · expected 6: *"After you click it and the panel is hidden, the tooltip reads: Show panel"* | **COVERED** |

### §5.3 — Behaviour (2 assertions)

| Assertion | The requirement, v27 verbatim | The covering case's own text, live verbatim | Verdict |
|---|---|---|---|
| `§5.3-L191.A1` | *"Behavior. The panel animates closed over a short width transition, its divider disappears so no seam remains"* | **C43583** expected 1: *"The left panel closes with a short, smooth sliding movement as its width shrinks - it does not disappear in one jump."* · expected 2: *"The dividing line between the panel and the grid goes away with it, leaving no leftover line, seam or empty strip where the panel used to be."* | **COVERED** |
| `§5.3-L191.A2` | *"the grid reflows into the reclaimed space."* | **C43583** expected 3: *"The grid grows into the space the panel gave up and lays itself out again in the wider area, so you can see more of the grid than you could before."* | **COVERED** |

### §5.3 — State preservation (4 assertions)

| Assertion | The requirement, v27 verbatim | The covering case's own text, live verbatim | Verdict |
|---|---|---|---|
| `§5.3-L192.A1` | *"State preservation. Contents are hidden rather than discarded."* | **C43584** expected 1: *"The panel comes back showing the same things you left in it. Nothing has been reset, cleared or reloaded from scratch - while it was hidden its contents were only out of sight, not thrown away."* | **COVERED** |
| `§5.3-L192.A2` | *"Calendar date, work-order scroll position, panel search text, drill-down state"* | **C43584** steps 1–4 set up all four; expected 2 *"The date you picked in the small month calendar is still the selected date."* · expected 3 *"The text you typed is still in the Search work orders box, and the list is still narrowed by it."* · expected 4 *"The list is still scrolled to roughly the position you left it at."* · expected 5 covers the drill-down | **COVERED — all four named states asserted individually** |
| `§5.3-L192.A3` | *"the selected work order all survive a collapse/expand cycle"* | **C43584** expected 6: *"The work order you had opened is still the selected one."* | **COVERED** |
| `§5.3-L192.A4` | *"reopening returns to whichever panel mode was active."* | **C43584** expected 5: *"The panel comes back showing that work order's lines, not the full list of work orders - it returns to whichever of the two views was open when you hid it."* | **COVERED** |

### §5.3 — Narrow viewports (3 assertions), and the one that is covered elsewhere

| Assertion | The requirement, v27 verbatim | The covering case's own text, live verbatim | Verdict |
|---|---|---|---|
| `§5.3-L193.A1` | *"Narrow viewports. Below the 960px minimum supported width (§11) the panel auto-collapses."* | **SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086)** expected 3: *"On narrow viewports the sidebar collapses."* | **COVERED — re-confirmed.** It restates §11's own sentence, and **C43585 step 1 declares the split in its own text**: *"(The panel folding itself away on its own at that width is checked by a separate test - this test is about the button.)"* Re-asserting it would be duplicate coverage. |
| `§5.3-L193.A2` | *"The toggle still works, so the user can expand it manually at any width"* | **C43585** expected 1: *"The panel button still works on a narrow window: it is not hidden, greyed out or unresponsive below 960 pixels, and clicking it shows the left panel by hand even at that width."* | **COVERED** |
| `§5.3-L193.A3` | *"that manual choice holds until the next resize across the breakpoint."* | **C43585** expected 2: *"The panel stays as you set it while you keep working at that width…"* · expected 3: *"Your choice only stops applying when the window is resized back across the 960 pixel mark…"* | **COVERED** |

### §5.3 — Popovers and modals · Persistence (3 assertions)

| Assertion | The requirement, v27 verbatim | The covering case's own text, live verbatim | Verdict |
|---|---|---|---|
| `§5.3-L194.A1` | *"Popovers and modals. Anything that positions itself clear of the panel falls back to a normal viewport margin while the panel is collapsed."* | **C43586** expected 1: *"With the panel hidden, the pop-up no longer keeps clear of the space the panel used to take up. It sits against the edge of the browser window with a normal margin instead."* · expected 2: *"The whole pop-up is on screen: nothing is cut off at an edge…"* | **COVERED** |
| `§5.3-L195.A1` | *"Persistence. Not persisted in the prototype."* | — no case, deliberately | **NOT INDEPENDENTLY TESTABLE — RE-CLASSIFIED from UNCOVERED.** It describes the **prototype's** behaviour, not a requirement on the shipped product, and **the very next clause states the build requirement**. A case written against it would test a prototype nobody ships. **Re-classified rather than counted as closed coverage — the distinction is the whole point of recording it.** |
| `§5.3-L195.A2` | *"Session-scoped per user for build — this is a working-mode preference, not a saved view."* | **C43587** expected 1: *"At step 3, still in the same sign-in, the left panel is still hidden."* · expected 2: *"At step 6, after signing out and back in, the left panel is showing again… it is a working-mode preference for the session you are in, not a saved view setting."* | **COVERED — and it carries an OPEN QUESTION in its own tester-facing text** (Rule 58): §5.3 says *session-scoped*, the 5 August design review's item E12 asks for view settings to survive sessions. **The ambiguity was NOT resolved from the build**; the case follows the written spec and says so. |

### §6 and §3.1 — the two cross-section assertions

| Assertion | The requirement, v27 verbatim | The covering case's own text, live verbatim | Verdict |
|---|---|---|---|
| `§6-L200.A1` | *"**Panel toggle** \| Collapses and expands the left work order panel (§5.3)."* | **C43582** asserts the toolbar row's whole content — the control exists at that toolbar position (expected 1–3) **and** collapses and expands the panel (expected 8) | **COVERED.** Every other control in that §6 toolbar table has its own case; this one now does too. |
| `§3.1-L44.A1` | *"The panel can be collapsed and expanded from the grid toolbar (§5.3), handing its width to the grid without losing panel state."* | **two promises, split across two cases, both citing §3.1 in `refs`:** **C43583** expected 3 covers *handing its width to the grid*; **C43584** expected 1–6 cover *without losing panel state* | **COVERED — one row, both halves shown.** Rule 45(e) would give this two rows if the split were not declared; it is declared on both cases. |

---

## 4 · DIRECTION 1 — the 4 PARTIAL assertions, re-verified. **One closed, three genuinely still open.**

### 4a · `§4.12-L165.A1` — **CLOSED. The case was fixed since 2026-08-10.**

| The requirement, v27 §4.12, verbatim | The case's own text, **live 2026-08-11**, verbatim |
|---|---|
| *"Hover tooltip: a **per-assigned technician** breakdown (assigned vs that tech's capacity), with overtime technicians highlighted in amber."* | **SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)** expected 1: *"A tooltip shows a breakdown **for each assigned technician**: assigned hours vs that technician's capacity. (Version 26 of the specification, published 7 August 2026, narrowed this from 'per-technician' to 'per-assigned technician'.)"* · expected 2: *"The overtime technician's entry is highlighted in amber."* |

**HAND VERDICT: COVERED.** The uncovered half — that only technicians with an assignment that day appear —
is now asserted, and the case even names the version that narrowed it.

**The dating confirms the direction of the change is right (Rule 31 trap (c)):** `per-assigned technician`
first appears at **v26, 2026-08-07T11:02:57Z**; the wording it replaced, `a per-technician breakdown`, was
present in **v1 and every version to v25**. **So the new wording is genuinely the newer source and Rule 32
points forwards.** Two honest riders, recorded in `DELIBERATE-DECISIONS.md` **D8**: **v26 carries no version comment**, so nothing
announced it; and the 2026-08-10 pass recommended **holding this edit until Branko confirmed it was not a
typo** — it was applied without that confirmation. The edit is **defensible under Rule 57** (the spec is
the source and this is its current text), the residual risk is **LOW**, and the one-row question stands.

### 4b · `§11-L303.A1` — **GENUINELY STILL PARTIAL. Real gap.**

| The requirement, v27 §11, verbatim | The case's own text, live verbatim |
|---|---|
| *"Dark theme. The Schedule supports a user-selectable Light / Dark theme, **chosen from the user menu and persisted per user**."* | **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** — title *"Schedule and all its dialogs display correctly in dark mode"*; precondition 1 *"the app's dark mode / theme toggle is available"*; step 1 *"Switch the app to dark mode."*; expected 1 *"In dark mode every part of the Schedule stays readable…"* |

**UNCOVERED PART:** that the theme is **chosen from the user menu**, and that it is **persisted per user**.
**The case's own `refs` CLAIM the persistence** — `SV-8685 (§11 (Dark theme - user-selectable Light /
Dark,persisted per user))` — **but its four steps never sign out and back in, and never name where the
theme is chosen.** The case asserts less than its own reference says it does, which is the Rule-54 failure
mode of a provenance that over-claims.

**Dated: the requirement entered the spec at v19, 2026-07-23 — 19 days ago, not new.**
**Owning story is [SV-8700](https://shopview.atlassian.net/browse/SV-8700)** (requirement 5, almost
verbatim), **not the epic C38866 cites.**
**⇒ Staged as `SCH-EDGE-09` in `NEW-CASES.md`.**

### 4c · `§11-L303.A4` — **GENUINELY STILL PARTIAL. Real gap.**

| The requirement, v27 §11, verbatim | The case's own text, live verbatim |
|---|---|
| *"…elevation/shadow tokens also swap so **depth reads correctly on dark surfaces**."* | **C38866** expected 1: *"In dark mode every part of the Schedule stays **readable** - no white-on-white or black-on-black text, no unreadable labels or invisible icons."* |

**UNCOVERED PART:** that **depth** still reads correctly. **Readability and depth are different properties
with different failures:** a dialog can be perfectly readable and still look *flat*, merged into the page,
because a dark shadow on a dark surface disappears. Nothing in the suite asserts a pop-up still looks
raised in dark mode.

**Dated: v19, 2026-07-23.** **⇒ Staged as `SCH-EDGE-10` in `NEW-CASES.md`.**

**Honest note on a reversal of last pass's recommendation.** The 2026-08-10 pass recommended **skipping**
this as a design-fidelity check better handled by a Figma pass. **This pass disagrees, and says why:** the
Figma pass has not happened and is not scheduled, the release is Thursday, and the assertion *is*
layman-checkable — a tester can see whether a dialog stands off the page or merges into it, without any
design token. **A skip whose owning pass never runs is an uncovered requirement with a nicer name.**

### 4d · `§11-L301.A6` — **GENUINELY STILL PARTIAL. Real gap, and the oldest one here.**

| The requirement, v27 §11, verbatim | The two cases' own text, live verbatim |
|---|---|
| *"Overtime and conflict signals are not color-only (OT uses a text tag; **the overflow uses shape**)."* | **SCH-LANE-03 = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)** expected 2 *"The remaining overlapping shifts collapse into a '+N more' affordance (here '+2 more')."* · expected 3 *"Clicking it opens a popover listing the hidden shifts."* · and **C38866** expected 3 *"Conflict and overtime cues remain distinguishable (they never rely on colour alone - text/icon still present)."* |

**UNCOVERED PART:** that the **"+N more" overflow** is conveyed by **shape**, not colour alone. C29998
asserts the affordance exists and opens a popover; C38866 asserts the *conflict and overtime* cues are not
colour-only. **Neither asserts it of the overflow.** The sibling assertion `§11-L301.A5` (*"OT uses a text
tag"*) **is** covered — **SCH-CAP-03 = [C30032](https://shopview.testrail.io/index.php?/cases/view/30032)**
expected *"The tag is text, not a color-only signal."* — which is exactly why the split into two assertions
matters: at line level this row reads *covered* and closes.

**Dated: present since v1, 2026-07-15 — 27 days, the whole life of the document.**
**⇒ Staged as a one-item extension of C29998** (`NEW-CASES.md` **S3**), **not a new case** — the expensive
part is C29998's five-mutually-overlapping-shifts seed, which it already sets up, so a standalone case
would duplicate the setup to assert one line (Rule 28: that is a MERGE, not a KEEP).

---

## 5 · DIRECTION 1 — the 1 BLOCKED assertion. Still blocked; **the risk is lower than recorded.**

`§12-L307.A1` — **the specification contradicts itself and Branko has not ruled.**

> **§12, v27 verbatim:** *"Shop closures (holidays, inventory days) are defined at the shop level and
> **block the spread step from placing shifts on those days**."*
>
> **§4.5, v27 verbatim:** *"Uses the technician's own working hours. Automatically skips weekends when
> business hours are not set for them. **Shop closures and public holidays are not skipped in V1**.."*

**Both sentences are present in v27.** Our two cases follow §4.5 and say so on themselves:

| Case | Its own text, live |
|---|---|
| **SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089)** | *"A shift CAN be placed on the shop closure day (only weekend days with no business hours are skipped)."* |
| **SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)** | *"Shop closures and public holidays are NOT skipped in V1 - shifts can be placed on those days."* |

**NEW THIS PASS, and nobody had established it: THE TWO SENTENCES ARE NOT THE SAME AGE.**

| Sentence | First appears | Date |
|---|---|---|
| §12 *"block the spread step from placing shifts on those days"* | **v1** | **2026-07-15** |
| §4.5 *"Shop closures and public holidays are not skipped in V1"* | **v22** | **2026-07-27** |

**§4.5's sentence is TWELVE DAYS NEWER, it is the more specific of the two (it names V1 scope explicitly),
and Branko has edited the page FIVE TIMES SINCE without removing either.** So the cases follow the newer
and more specific statement, which is the defensible position.

**But it does NOT settle the contradiction, and this pass will not pretend it does.** Two sentences in
**one document at one version** are a **defect in the document**, not a Rule 32 conflict between separate
sources — Rule 32 breaks ties *between sources*. **So recency informs the RISK and does not answer the
QUESTION.** Verdict stays **BLOCKED**; risk drops from what the 2026-08-10 register recorded; the question
is already **Tab 2 Item 1.0** of the 6 August sheet and **needs no new question — it needs the sheet sent.**

---

## 6 · DIRECTION 2 — case → requirement, all 174

| | Count |
|---|---|
| Cases examined | **174 of 174** |
| **Cases citing a § that no longer exists in v27** | **0** |
| Cases with no § anchor at all | **2** — both deliberate, both declared on the case |
| **Cases stamped with a stale specification version** | **0** — was 168 on 2026-08-10 |
| Cases whose provenance names a source that does not support the assertion | **3** — was 5; **the three that mattered have been FIXED** since 2026-08-10, 2 mild ones remain, and **1 new one was found this pass** — see §8 below |
| Requirement-bearing spec sections with **no** case anchored | **7** — §1, §1.1, §2, §5, §8, §13, §15 |

**All 33 requirement-bearing sections of v27 now have at least one case anchored to them.** §5.3 has
dropped off the no-case list — it was the whole of the 2026-08-10 gap. The 7 that remain are:

| § | Why no case is owed |
|---|---|
| §1, §1.1, §2 | Overview, Problem statement, User personas — narrative |
| §5, §8 | **parent headings with no content of their own** — their content lives in §5.1/§5.2/§5.3 and §8.1/§8.2 |
| §13 | Success metrics — business metrics, not product behaviour |
| §15 | Future considerations — explicitly out of V1 |

**The 6 new cases introduced no orphan:** all six anchor to **§5.3** plus **§6** or **§3.1**, all three of
which exist in v27, and all six cite story **SV-8686**, a live child of the epic.

**Foreign-coverage diff, both directions (Rule 45(a)):** **0 foreign cases** in group 4254 — all 174 are
`created_by = 3`. The reverse direction therefore **has nothing to diff against and yields no candidate
gap from that lens**, unlike Report Suite where it found real coverage. Stated rather than left as an
unexplained absence.

---

## 7 · Verdict tally, machine-derived (Rule 17)

Produced by `tools/reverdict.py`; per-assertion rows at `evidence/verdicts-2026-08-11.json`.

```
assertions re-derived from the live spec : 397
  mechanically re-checked against 174    : 397
  hand re-verdicted this pass            : 25
  carried on the mechanical re-check     : 372
  score DEGRADED > 0.05                  : 1   (§4.13-L169.A1, C30036 — hand-read, still COVERED)

COVERED                          301
NOT-INDEPENDENTLY-TESTABLE        92
PARTIAL                            3
BLOCKED                            1
TOTAL                            397
```

**The 92 not-independently-testable, by class:** LABEL-CELL **41** (a table cell that is a control's name,
covered by the case for the control) · DATA-MODEL **21** · FRAMING **15** · CROSS-REFERENCE **10** ·
GOAL **4** · **PROTOTYPE-STATEMENT 1** (new — §5.3-L195.A1).

**⚠️ 301 + 3 = 304 is NOT a coverage claim about the build and must never be quoted as one.** It is a
**document-side** map: 304 assertions have a case that asserts them. **No build was observed in this pass**
(Rule 12), and separately **the Rule-49 queue at `build/schedule/full-viu-2026-08-05/RECHECK-QUEUE.md` is
OPEN** with **0 of 174 cases build-verified against the build now running** — the branch is final since
2026-08-11, so those are real outstanding verifications, not hedges.

---

## 8 · DIRECTION 2 detail — provenance lines that name a source not supporting the assertion

The 2026-08-10 pass found five cases whose tester-facing provenance named a source that did not support
the assertion. That is worse than no provenance, because it manufactures false authority (Rule 54's
honesty clause). **All five were re-read live today.**

| Case | Status now, 2026-08-11 |
|---|---|
| **SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865)** | **FIXED.** Now says outright *"That specification says nothing about clock changes or daylight saving - those words do not appear in it at all - so the point above comes from the engineering technical plan"*, with the file link. |
| **SCH-DEL-10 = [C38864](https://shopview.testrail.io/index.php?/cases/view/38864)** | **FIXED.** Names §7 for the toast and Undo, and the technical plan for the save-immediately half. |
| **SCH-API-01 = [C38872](https://shopview.testrail.io/index.php?/cases/view/38872)** | **FIXED.** Names §14 for the permission tiers and the technical plan for the refusal responses. |
| **SCH-WOL-06 = [C29941](https://shopview.testrail.io/index.php?/cases/view/29941)** | **still under-cites.** Its `refs` admit *"(derived - search behavior with no matches)"*; its provenance names §3.1 flatly. **Mild** — the derivation is sound. |
| **SCH-DEL-06 = [C30062](https://shopview.testrail.io/index.php?/cases/view/30062)** | **still under-cites.** Same shape: the `refs` say *"derived"*, the provenance does not. **Mild.** |

**So the three that mattered are fixed and two mild ones remain.** Recorded as cleared rather than quietly
dropped.

### NEW this pass, and it is the sharper kind

**SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) cites the EPIC when a
story states its requirement almost verbatim.** Its provenance names *"epic SV-8685 and the Schedule
specification version 27 (§11)"*, but **[SV-8700](https://shopview.atlassian.net/browse/SV-8700)
requirement 5** reads: *"Dark theme: built on design-system color tokens. Surfaces, borders, text,
accents, and elevation/shadow tokens remap automatically. **User-selectable from user menu, persisted per
user.**"* **Rule 20 requires per-story precision**; the epic is reserved for a genuinely cross-cutting case
with no single-story owner, and **this one has an owner**. The two staged cases cite **SV-8700**.

**And a second, worse problem on the same case: its `refs` CLAIM an assertion its steps do not make.**
`SV-8685 (§11 (Dark theme - user-selectable Light / Dark,persisted per user))` — while **its four steps
never sign out and back in.** The case asserts **less than its own reference says it does**, which is
precisely why `§11-L303.A1` is still a gap. `SCH-EDGE-09` closes the coverage; **correcting C38866's own
`refs` and provenance is a separate write nobody has authorised and is deliberately NOT in the staged
pack** (`NEW-CASES.md` §"what is NOT in the pack").

---

## 9 · Two defects in our own text, reported and NOT fixed — this pass makes no writes

**(a) All six new panel cases tell the tester that "steps 1 to 8 cannot be carried out" — and five of them
do not have eight steps.** Measured live: real step counts are **7 · 6 · 7 · 4 · 5 · 7** for
C43582–C43587. The sentence was copied from C43582 (which has eight *expected results*, not steps) onto all
six. **It is our own text confusing a tester, and it is the kind of thing a reviewer notices first.**
Fix: 6 `update_case`, one sentence each. `DELIBERATE-DECISIONS.md` **D10**.

**(b) ~~148 of 174 cases carry no Rule-54 read-on date.~~ ⚠️ FIXED WHILE THIS PASS WAS BEING WRITTEN —
CORRECTED, NOT DELETED (Rule 59).** When the suite was read at **13:10Z, 26 of 174** carried a read-on
date. **Re-read live at the end of the pass: 174 of 174 carry one.** A sibling worker's read-date sweep
completed under us — the same class of event as a spec moving mid-pass, and the reason Rule 59 exists.
**Nothing is owed on this any more**, and the three staged cases carry their read-on dates too, so the suite
is now uniform rather than in two states. `DELIBERATE-DECISIONS.md` **D11**.

**(c) `build/schedule/panel-collapse-2026-08-11/NEW-CASES.md` is stale against the cases it describes.**
It states all six carry `AUTOMATION: HOLD - the panel collapse control is not in the build`; **live, all six
carry `AUTOMATION: READY`** plus a run-as-written instruction, following the Rule-61 amendment made later
the same day. **The cases are right and the document describing them is behind** — worth a one-line banner
so the next reader is not misled.

---

## 10 · AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65)

**None.**

**This pass changed no test case at all** — zero `add_case`, zero `update_case`, zero `delete_case` — and on
today's live reading **all 174 Schedule cases carry `custom_atmstatus = 1`**, so **not one Schedule case is
flagged Automated in TestRail** and there is nothing for Vlad to adjust from this pass either way.

**The section is written even though the answer is "none", because omitting it is how a reader loses the
ability to tell "clear" from "we forgot to look".**

**⚠️ For whoever pushes the staged pack: capture `custom_atmstatus` AT WRITE TIME, not from this file.**
The flag moves both ways — C29600 went `1 → 3 → 1 → 3` on another project — so a value read today is not
evidence about a value tomorrow.
