# Rule-28 three-dimension audit — the coverage-re-derivation changes

**Date 2026-07-31.** Population = the **33 cases changed by this pass** plus **every
neighbour they could contradict** (each report's Location-column case, export cases,
column-selector cases, column-order cases, empty-state cases — 60+ cases read).
No sampling within the changed set (Rule 17).

**Live-build status:** no QA branch exists. Nothing is live-verified; every case remains
`VIU-Pending` and every unpinned label stays "confirmed in the build".

---

## Headline

| | |
|---|---|
| Cases changed | **33** (6 content extensions · 15 Stage-2b consistency repairs · 13 refs-only backfills; SBC-EXP-03 is in two groups) |
| Dimension 1 — USEFUL | **33 KEEP** · 0 MERGE · 0 WEAK-KEEP · 0 CUT |
| Dimension 2 — MAKES SENSE | **33 SENSIBLE** · 0 FIX-WORDING outstanding · 0 NONSENSE |
| Dimension 2b — CONTRADICTIONS | **15 found · 15 resolved · 0 outstanding** |
| Dimension 3 — GENUINE + LAYMAN-RUNNABLE | **33 pass** (all traceable to a real ticket + a current spec anchor; all plain-English) |
| New cases authored | **0** — so no case can be new-and-useless |
| Titles over 80 characters | **0** |

---

## Dimension 1 — USEFUL

Nothing was added that duplicates existing coverage; the whole point of the pass was the
opposite — it **avoided** 5 new near-duplicate export cases by extending instead.

* **6 extensions = KEEP.** Each adds a *distinct observable*: the Location column inside
  the downloaded file (5 reports) and the accessible name of an icon-only button (TU).
  Failure of any is a real reportable bug — a multi-location export that silently drops
  the column, or a button a screen-reader user cannot identify.
* **15 Stage-2b repairs = KEEP.** These *raise* usefulness: before the repair each of
  those cases would have produced a **false failure** in any two-location organisation.
  A test that fails on a correct build is worse than no test.
* **13 refs backfills = KEEP.** No tester-facing change at all; they restore Rule-20
  traceability so the requirement stops looking uncovered.
* **0 MERGE / 0 CUT.** No new granularity was introduced. The one merge-shaped
  observation is recorded below, not executed.

**Merge-shaped observation (recommendation only, NOT executed — needs authorization):**
each report has a *vague ancestor* of its Location case, written on 2026-07-28 from the
kickoff video before the 2026-07-29 spec pinned the mechanism — SBC-LOC-03 = [C30111](https://shopview.testrail.io/index.php?/cases/view/30111)
expected 4, SBR-LOC-03 = [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) expected 4, PV-FILT-10 = [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) expected 6,
TU-LOC-01 = [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) expected 4, IV-LOC-01 = [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) expected 3, WIP-FLT-06 = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503)
expected 4 — all saying some version of *"you can tell which location each row belongs
to — a location label or marking is shown (exactly how is confirmed in the build)"*. That
is now precisely specified by C38912–C38917. **Not a contradiction** (both can be true,
and all six carry a two-or-more-locations precondition, verified case by case), but the
vague expected lines are redundant and could be dropped into the precise cases. Left
alone this pass.

---

## Dimension 2 — MAKES SENSE (cold read, 6 fail conditions)

Every changed case was re-read cold against: (1) steps executable in order / precondition
reachable; (2) expected follows from the steps; (3) no internal contradiction; (4) no
control or screen absent from the sources; (5) no domain nonsense; (6) actionable — the
tester can tell what to DO and what PASS looks like.

* **Steps executable in order.** The five export extensions append their download step
  *last*, so the tester reads the on-screen column first and then opens the file — the
  natural order. **One placement was corrected during the pass:** TU-COL-01's
  accessible-name step was initially appended *after* the "close the browser and reopen"
  step; it was moved to **step 2 / expected 2**, beside the existing tooltip check, so the
  two "what is this button called" checks sit together.
* **Expected follows from the steps.** Each new expected names the file just downloaded.
* **No control invented.** Every label used — Location, Multiple, Summary, Expanded View,
  Branch, Column Selection, Qty on Hand, Type, Technician, Status — is taken verbatim from
  the current spec or an existing case. Two things the spec does **not** pin are marked
  "confirm in the build" rather than guessed: **where** the Location column sits inside
  the SBC/SBR **Summary** files (those files have no Date/Status column for it to follow)
  and the **exact text** of the TU accessible name.
* **Actionable.** Each addition is one download and one column check.

**0 NONSENSE. 0 outstanding FIX-WORDING.** The embarrassment check (KEEP-but-NONSENSE) was
run explicitly over all 33: none.

---

## Dimension 2b — MANDATORY CROSS-CASE CONSISTENCY SWEEP

Four checks, run mechanically (`sweep_2b.py`, `sweep_surface.py`) and read by hand.

### (a) Control grouping + expected-result diff

All seven Location-column cases were grouped and their expected results diffed. Per-report
positions differ **because the specs differ** — SBC after Date · SBR after Status · PV and
TU leftmost · IV between Vendor and Qty on Hand · WIP between VIN and Advisor — each
matching its own spec, so this is not an inconsistency. The **"Multiple"** rule is
consistent per report and follows each report's row model: SBC/SBR/PV/TU can show
"Multiple" on an aggregating row, IV and WIP **never** can (one row = one location) — and
both say so explicitly.

### (b) Opposite-assertion keyword sweep — **15 CONTRADICTIONS FOUND, 15 RESOLVED**

The sweep surfaced 27 candidate pairs; hand review reduced them to **one real
contradiction class, with 15 members**:

> The per-row **Location** column is automatic and was added suite-wide on **2026-07-29**.
> **Fifteen older cases enumerate a column or header list in absolute terms** — *"Exactly
> these 14 columns show"*, *"these thirteen columns in this exact order"*, *"the headers,
> in order, are exactly …"* — **and none of them mention Location.** In any organisation
> with two or more locations those cases and the Location cases **cannot both be true**:
> a tester on a correct build would fail one of them.

Neither side is wrong — both statements are in the current specs; the older cases were
simply **silent about the scope they assume**. Resolution (Rule 33 precedence: no PO or
QA-lead ruling exists on this, and both requirements are current, so nothing is reversed —
the scope is made explicit): **every list is now scope-conditional** — exact for a
single-location scope, and stating where Location joins it when more than one location is
in scope. **WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) already did exactly this**, and is the model the other 15
now follow.

| # | Case | TestRail | The absolute claim that broke | Now |
|---|---|---|---|---|
| 1 | SBC-EXP-03 | [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | Expanded View CSV "these thirteen columns in this exact order" | thirteen with one location; **fourteen** with Location after Date |
| 2 | SBC-EXP-11 | [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) | Expanded View PDF "the same thirteen columns" | mirrors the CSV under both scopes |
| 3 | SBC-EXP-16 | [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | Summary files "these ten columns in this exact order" | ten with one location; + Location with the identifying columns (position VIU-confirm — no Date column in this file) |
| 4 | SBR-EXP-03 | [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) | Summary PDF "The columns are: Rep / Inv. Hrs / …" | + Location ahead of Inv. Hrs, "Multiple" for a spanning rep |
| 5 | SBR-EXP-04 | [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) | Expanded PDF per-invoice table column run | + Location after Status, that invoice's own location |
| 6 | SBR-EXP-10 | [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | Summary CSV "the headers, in order, are exactly: …" | scope-conditional + a new expected for the Location column |
| 7 | SBR-EXP-11 | [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | Expanded CSV "the headers, in order, are exactly: …" | scope-conditional + Location **after Status**, never "Multiple" |
| 8 | PV-COL-02 | [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | "Exactly these 14 columns show" | 14 with one location; **15** with Location leftmost, and it is not in the picker |
| 9 | PV-COL-03 | [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | "Columns always render in the fixed canonical order: Type, …" | canonical order **with Location leftmost when shown** |
| 10 | IV-COL-01 | [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | "The columns appear in this order: Part #, …" | + Location between Vendor and Qty on Hand |
| 11 | IV-COL-04 | [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | "On first visit, the visible columns are: …" | + Location when more than one location is in scope |
| 12 | IV-PERS-02 | [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) | "the fixed left-to-right order (Part #, … Total Cost)" | order stated **with** Location's slot |
| 13 | SBR-ROW-02 | [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | "…Subtotal (12 columns)" | 12 with one location; **13** with Location after Status |
| 14 | TU-HRS-02 | [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | "The headers appear in exactly this order: Technician, …" | + Location leftmost before Technician when shown |
| 15 | SBC-EXP-08 | [C30166](https://shopview.testrail.io/index.php?/cases/view/30166) | *(no contradiction — refs only)* | `S15-R7`/`S15-R8` anchors added; it already asserted A4 landscape + footer while the anchors sat on the sibling header case |

**Three exact-list cases examined and cleared as NOT contradictions:** PV-FILT-03 =
[C30335](https://shopview.testrail.io/index.php?/cases/view/30335) (a list of date-range options, not columns) · SBC-CALC-01 = [C30149](https://shopview.testrail.io/index.php?/cases/view/30149) (constrains
only the *financial* column run, which starts after Location's slot) · SBR-ASGN-02 =
[C30293](https://shopview.testrail.io/index.php?/cases/view/30293) (the separate Story-15 Assignments CSV — three columns, outside `S14-R20`'s
"all four exports").

**Post-repair re-run: 0 exact-list expected lines left without a location-scope
qualifier** other than those three cleared ones.

### (c) TITLE-vs-EXPECTED on every changed case

All 33 checked; every title still describes what the case now proves; **no title needed
changing** and **none exceeds 80 characters** (longest = PV-FILT-14 at exactly 80). The
extensions deliberately stayed within each case's existing subject so no retitling was
required. *(The separate suite-wide title-trim backlog is untouched by this pass.)*

### (d) Same-anchor clustering

Every requirement cited by more than one case in the changed neighbourhood was diffed:
TU `S10-R4` (TU-COL-01 + TU-LOC-06 — both say Location is never in the Column Selection
control ✔) · WIP `S9-R10a` (WIP-EXP-02 asserts the "Locations:" line, WIP-FLT-09 the
exported "Branch" header — complementary halves ✔) · WIP `S4-R3`, `S9-E1`, IV `S3-R1`,
SBC `S14-R13`, `S14-R14`, `S15-R5` — all complementary, none contradictory.

---

## NEW CHECK ADDED — same-requirement-different-surface

This pass added a permanent check for the defect class that caused the whole problem:
**a requirement that governs two surfaces (screen AND the exported file) where our cases
only ever assert it on one.** A coverage matrix cannot see this — the anchor is satisfied,
so the row is green.

`sweep_surface.py` classifies each requirement's own text by surface (SCREEN / EXPORT /
MOBILE / API) and compares it against the surfaces its covering cases actually put the
tester on.

**Result over all 895 current requirements:**

| | Count |
|---|---|
| Requirements examined | 895 |
| Requirements that speak about a **non-screen** surface | **165** |
| Of those, covering cases assert **nothing** on that surface | **2 — both false positives** |

The two hits are false positives, both verified by hand: SBR `S18-R7.2` (matched on the
word "exports" because the ⋯ button's *name* is in a toolbar-order list) and WIP `S4-E2`
(matched on a context note about the WO # link, not an export rule).

**Answer to the question that matters: the Location column was the ONLY instance of this
defect class in the six specs.** Three further candidates were hand-checked and are
genuinely covered: SBC `S15-R7` (A4 landscape / 25px margins) → SBC-EXP-08 = [C30166](https://shopview.testrail.io/index.php?/cases/view/30166)
expected 1 · TU `S8-R7` (tooltip on hover, keyboard focus **and tap**) → TU-ELL-02 =
[C30405](https://shopview.testrail.io/index.php?/cases/view/30405) expected 2 · IV `S12-R9` (accessible names on the icon-only download and Column
Selection buttons) → IV-VIS-07 = [C30602](https://shopview.testrail.io/index.php?/cases/view/30602) expected 1.

**That last one is a useful cross-check:** IV already had a dedicated accessible-name case
for exactly the control TU was missing one for — independent confirmation that the TU
`S8-R16` gap call was correct rather than pedantic.

**Honest limitation of the new check:** it only inspects requirements our cases already
cover. A requirement covered on **no** surface is caught by the coverage re-derivation
itself (that is how the 6 gaps were found), not by this sweep. The two checks are
complementary and both belong in the pipeline.

---

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE

* **Traceable (Rule 20).** All 33 carry a real Jira story key **plus** the current spec
  anchor **plus** the spec version. **Every ticket used was verified against the SV-8582
  epic ingest before writing** — this caught three wrong attributions in a first draft
  (SV-8637 is SBR *Story 20 Column selector*, not the CSV export story; SV-8676 is IV
  *Story 9 Sorting*; and one TU guess), which were replaced by preserving each case's own
  original ticket and adding only the governing requirement's verified owner. **No ticket
  was invented.** The single deliberate epic-level reference (TU-COL-01, because TU Story
  10 genuinely has no Jira story) says so in the refs text.
* **Layman-runnable (Rules 7/9).** Additions are plain instructions — "download the CSV
  and the PDF and read their columns". No endpoint, HTTP verb, status code or internal
  term appears anywhere; no API-section case was needed (Rule 4).
* **Refs field discipline.** All 33 refs are **≤ 245 characters** (cap is exclusive at
  250; longest = SBC-EXP-03 at 236) and **contain no commas**.

---

## What was NOT done (and why)

* **No case created, deleted or merged.** 474 active cases before and after.
* **The 6 vague Location ancestors were left in place** — a merge recommendation, needing
  authorization.
* **No spec was edited**; the two spec inconsistencies found are carried to Chris Ward as
  questions, not resolved by us (Rule 15).
* **Nothing was live-verified** — there is no QA branch (Rules 12/22).

---

## Is the critic right?

Stefan Mitrovic's claim has two halves. On this pass:

**"More than 70% useless test cases."** This pass authored **zero** new cases while
closing **6 genuine coverage gaps** — the opposite of padding. It also *removed a source
of waste*: 15 cases that would have produced **false failures** in any multi-location
organisation, each costing a tester a re-test and a bogus bug report.

**"Some tests just do not make sense."** Fair on this evidence — and the audit found it:
15 of our own cases were mutually contradictory with cases written three days earlier,
and one new step was in an order that read oddly. All 16 fixed before pushing. The lesson
is structural, not cosmetic: **a suite can be 100% individually sensible and still
self-contradictory**, and a coverage matrix cannot see it. Two mechanical checks now cover
that blind spot — the cross-case consistency sweep and the new
same-requirement-different-surface sweep — and both are repeatable per spec version.
