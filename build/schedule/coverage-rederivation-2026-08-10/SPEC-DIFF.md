# Schedule — SPEC DIFF v25 → v27, with a coverage verdict per requirement — 2026-08-10

**Baseline:** our ingested mirror, Confluence **v25** (2026-08-06T09:13:51Z) — byte-identical to
`build/schedule/spec-v25-2026-08-06/evidence/raw-v25.xml`, sha256
`7f903b30364352f451d52415dcd9f0b87e542653f075a98768d39f10ffed4414`, confirmed by re-fetching v25
today and hashing both.
**Live:** Confluence **v27** (2026-08-07T15:01:20.801Z), version comment *"Add §5.3 Panel collapse;
toolbar row and cross-references"*.

**Method:** every non-blank content line of both bodies extracted and sequence-diffed
(`evidence/diff-v25-v27.json`), then each changed string **dated against all 27 historical bodies**
(Rule 31 trap (c) — a page version dates the page, not the rule inside it).

**Diff shape:** **5 change blocks · 2 lines removed · 13 lines added.** Content lines rise 334 → 345,
requirement lines 224 → 234, sections bearing requirements 32 → 33.

> **The 15,477-character drop in the raw body is NOT content loss.** It is the removal of 216
> `ac:local-id` attributes when Confluence re-serialized the page. Stated here because the byte
> counts alone would suggest a quarter of the specification had been deleted.

---

## Every changed, added and removed requirement, with its own verdict row (Rule 43)

**A narrative summary is not acceptable and an un-verdicted row is a visible hole.** There are 4
delta groups covering 20 assertions; every one carries a verdict.

---

### D1 · §5.3 Panel collapse — **NEW SECTION** (v27)

**Dated:** every string in it appears for the first time in **v27**. `Panel collapse`,
`panel-left icon`, `Hide panel`, `Show panel`, `State preservation`,
`Session-scoped per user for build` — all first-version 27. This is genuinely new, not a rediscovery.

> **Spec v27 §5.3, verbatim:**
> *"An icon button collapses and expands the left panel. It is the first item in the grid toolbar,
> left of Today, sitting in the same left gutter as the grid's row labels and avatars so it reads as
> belonging to the panel it controls, and grouping with the date controls.*
> *• **Control.** A borderless panel-left icon in secondary text color. The icon does not change
> between states; the tooltip carries the meaning — "Hide panel" when open, "Show panel" when
> collapsed.*
> *• **Behavior.** The panel animates closed over a short width transition, its divider disappears so
> no seam remains, and the grid reflows into the reclaimed space.*
> *• **State preservation.** Contents are hidden rather than discarded. Calendar date, work-order
> scroll position, panel search text, drill-down state, and the selected work order all survive a
> collapse/expand cycle, and reopening returns to whichever panel mode was active.*
> *• **Narrow viewports.** Below the 960px minimum supported width (§11) the panel auto-collapses.
> The toggle still works, so the user can expand it manually at any width; that manual choice holds
> until the next resize across the breakpoint.*
> *• **Popovers and modals.** Anything that positions itself clear of the panel falls back to a
> normal viewport margin while the panel is collapsed.*
> *• **Persistence.** Not persisted in the prototype. Session-scoped per user for build — this is a
> working-mode preference, not a saved view."*

**VERDICT: 17 assertions UNCOVERED · 1 COVERED.**

**Proven, not assumed.** Five cases in the suite contain the word *collapse* and **none of them is
this control**:

| Case | What it actually covers |
|---|---|
| **SCH-NAV-05 = [C29929](https://shopview.testrail.io/index.php?/cases/view/29929)** | collapsing a **department group header** in the grid |
| **SCH-MCAL-03 = [C29934](https://shopview.testrail.io/index.php?/cases/view/29934)** | the **mini calendar's** chevron |
| **SCH-SPREAD-08 = [C29984](https://shopview.testrail.io/index.php?/cases/view/29984)** | the **spread preview** being collapsed by default |
| **SCH-LANE-03 = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)** | overlapping shifts **collapsing into "+N more"** |
| **SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086)** | the sidebar **auto-collapsing below 960px** — the one genuine near-miss, and it covers only the automatic behaviour, not the toggle |

**One assertion inside §5.3 is already covered, and it is verdicted COVERED rather than swept into
the gap.** §5.3's *"Below the 960px minimum supported width (§11) the panel auto-collapses"* restates
§11, which **C30086** asserts verbatim: *"On narrow viewports the sidebar collapses."* Counting it as
a gap would have inflated the figure by one and, worse, implied nobody tests the 960px behaviour.
**Its two sibling assertions stay UNCOVERED**, because they add promises §11 does not make — *"The
toggle still works, so the user can expand it manually at any width"* and *"that manual choice holds
until the next resize across the breakpoint."*

**Proposed coverage:** 2 cases, in `GAPS.md` G1. **Not authored.**

---

### D2 · §6 grid toolbar — **NEW ROW** (v27)

> **Spec v27 §6, verbatim, the new table row:** *"**Panel toggle** | Collapses and expands the left
> work order panel (§5.3)."*

**Dated:** `Panel toggle` first appears in **v27**.

**VERDICT: 1 assertion UNCOVERED · 1 NOT-INDEPENDENTLY-TESTABLE (the label cell).**

Every other control in that table has its own case — Today **[C30039](https://shopview.testrail.io/index.php?/cases/view/30039)**,
arrows and date label **[C30040](https://shopview.testrail.io/index.php?/cases/view/30040)**, conflict pill
**[C30027](https://shopview.testrail.io/index.php?/cases/view/30027)**, search **[C30041](https://shopview.testrail.io/index.php?/cases/view/30041)**,
Filter and Display **[C30042](https://shopview.testrail.io/index.php?/cases/view/30042)**, View Options
**[C30046](https://shopview.testrail.io/index.php?/cases/view/30046)**, Day/Week/Month **[C29927](https://shopview.testrail.io/index.php?/cases/view/29927)**.
**The new one has none.** Folded into the same proposed case as D1.

---

### D3 · §3.1 and §11 — **TWO NEW CROSS-REFERENCES** (v27)

> **§3.1, new sentence, verbatim:** *"The panel can be collapsed and expanded from the grid toolbar
> (§5.3), handing its width to the grid without losing panel state."*
>
> **§11 Responsiveness, changed:** *"…and the sidebar collapses on narrow viewports"* → *"…and the
> sidebar collapses on narrow viewports **(§5.3)**."*

**Dated:** `handing its width to the grid` first appears in **v27**. The §11 sentence itself is
**unchanged since v1** except for the added anchor — `960px` first appears in **v1**.

**VERDICT: §3.1's sentence UNCOVERED** (same gap as D1, reached from the sidebar section).
**§11's change is a pure anchor addition and changes no assertion** — its two assertions stay COVERED
by **SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086)**:

| §11 v27, verbatim | C30086's own text, verbatim |
|---|---|
| *"Minimum supported width is 960px (the grid scrolls horizontally below that)"* | *"Below the 960px minimum supported width, the grid scrolls horizontally rather than breaking."* |
| *"the sidebar collapses on narrow viewports (§5.3)."* | *"On narrow viewports the sidebar collapses."* |

---

### D4 · §4.12 — **ONE WORD CHANGED, and it is the one that bites** (v26)

> **v25 and every version back to v1, verbatim:** *"Hover tooltip: **a per-technician breakdown**
> (assigned vs that tech's capacity), with overtime technicians highlighted in amber."*
>
> **v26 and v27, verbatim:** *"Hover tooltip: **a per-assigned technician breakdown** (assigned vs
> that tech's capacity), with overtime technicians highlighted in amber."*

**Dated with care, because this is exactly where Rule 31 trap (c) does its work.** `per-assigned
technician` first appears in **v26** (2026-08-07T11:02:57Z). The wording it replaced,
`a per-technician breakdown`, is present in **v1** and every version through v25 — **it stood for 26
versions**. And **v26 carries no version comment at all**, so nothing announced the change.

**VERDICT: PARTIAL.**

| The requirement, v27 | Our case's own text, verbatim |
|---|---|
| *"a **per-assigned** technician breakdown (assigned vs that tech's capacity), with overtime technicians highlighted in amber"* | **SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)**, title: *"Hovering a capacity bar shows a **per-technician** breakdown"*; expected 1: *"A tooltip shows a **per-technician** breakdown: assigned hours vs that technician's capacity."* |

**Why this is a real difference and not pedantry.** On a shop with 15 technicians of whom 3 are
booked that day, *per-technician* implies a 15-row tooltip and *per-assigned technician* implies a
3-row one. A tester running C30033 today would pass a build that showed either. **The amber-highlight
half of the requirement is fully covered** by C30033's expected 2.

**UNCOVERED PART:** that only technicians who have an assignment that day appear in the breakdown.

**Proposed:** one edit to C30033, staged in `PROPOSED-CHANGES.md` P1, **not executed** — plus one
question to Branko, because a one-word unannounced change is worth confirming rather than assuming
(`QUESTIONS-FOR-BRANKO.md` S-1).

---

## Reconciliation

| | |
|---|---|
| Change blocks found by the diff | **5** |
| Delta groups verdicted | **4** (the §6 label cell and its description cell are one block) |
| Assertions affected | **20** |
| — UNCOVERED | **19** (17 in §5.3 · 1 in §6 · 1 in §3.1) |
| — COVERED | **1** (§5.3's 960px sentence, which restates §11) |
| — PARTIAL | **1** (§4.12) — counted in the 397 total, not in the 20 above |
| Items named in v27's version comment | **3** |
| Items found by the diff | **3** + the unannounced v26 change |
| **Unmatched either way** | **0** |

## What this diff CONFIRMS about the work done earlier today

`build/handover-ingest-2026-08-10/SCHEDULE-RECONCILIATION.md` states plainly that *"The v25 →
current Schedule spec diff was NOT done"* and flags the risk that *"a requirement added or removed on
7 August elsewhere in the document would not have been seen."*

**That diff is now done, and the risk did not materialise.** The only changes between v25 and v27
are the four above. **Every one of the twelve sentences that reconciliation's verdicts rest on is
byte-identical in v27**, including §4.8's *"The full 24-hour timeline remains intact and scrollable"*
(the E11 conflict), §4.5's *"Each drop spreads the full estimate for that technician,
independently"* (the E5 conflict) and §4.2's start-time hierarchy (the SV-8917 conflict). **Its
verdicts stand.**
