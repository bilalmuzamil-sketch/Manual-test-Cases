# Report Suite — OUTSIDE-IN GAP HUNT, 2026-08-04 (Standing Rule 45)

Rule 45 exists because on 2026-07-31 we did not find our own worst defect — **Vladimir Tomovic's
automated case did**, and it carried no `refs` at all. Rules 40–44 make us follow through on what
**we** detect; this rule makes us look at the suite from a position **other than our own**.

**All five checks ran. Each result is stated. "Not applicable" is a permitted answer; silence is not.**

---

## Check (a) — FOREIGN-COVERAGE DIFF, IN BOTH DIRECTIONS

**Population.** Live read-only snapshot of TestRail group **4281**, 2026-08-04: **483 cases = 478
ours (`created_by` 3) + 5 foreign (`created_by` 1 — Vladimir Tomovic)**. Reported as **ours 478 /
live total 483** per Rule 38, so our count is honest without claiming or hiding his work.

**The foreign cases were read and NOT TOUCHED.** They are `template_id` 2, `type_id` 7, carry
**preconditions and steps but no expected results** (the assertions live in automation code), and
**none has a `refs` value** — which is exactly the signal Rule 44 forbids us to dismiss them on.

### Direction 1 — do any of THEIR cases duplicate OURS?

### Direction 2 — do any of their assertions have NO counterpart in ours? *(the coverage signal)*

| Foreign case | Its assertions, read from title + steps | Verdict | Our counterpart |
|---|---|---|---|
| **C38923** — *"SBR Summary and Expanded CSV exports carry the Location column at its designated slot"* | (i) Summary CSV carries Location at its slot · (ii) Expanded CSV likewise · (iii) hidden at single-location scope · **(iv) step 4: *"Inspect the Expanded footer totals row"*** | **(i)–(iii) COVERED-BY · (iv) CANDIDATE GAP** | (i)(ii)(iii) SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) item 7 + SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) item 7 + SBR-LOC-05 = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913). **(iv) nothing.** See §3 |
| **C38920** — *"PV Location column is scope-governed — hidden at one location, Multiple on a merged special-order row"* | (i) hidden at one location · (ii) `Multiple` on the merged special-order row · (iii) not in the Column Selection menu | **COVERED-BY** (all three) | PV-FILT-14 = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) — *"With a single location in scope the Location column is hidden"*, *"'Multiple' on the merged Special Order row"*, *"not in the picker"*; plus PV-COL-02 = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) |
| **C38919** — *"TU column selector hides Est. Lost Labor, persists across reload, and the export mirrors it"* | (i) the selector hides Est. Lost Labor · (ii) the choice survives a reload · (iii) the export mirrors it | **COVERED-BY** (all three) | (i)(ii) TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) — *"Est. Lost Labor can now be hidden like any other column"*, *"Your column choice is remembered in this browser and is still applied when you come back"*; (iii) TU-EXP-04 = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) item 5 — *"Every download also mirrors the columns currently shown on screen"* |
| **C38922** — *"WIP CSV export gains the Locations line while its column semantics stay exactly as shipped"* | (i) the CSV gains a `Locations:` line · (ii) column semantics unchanged **as shipped** · (iii) step 3 turns Location **ON in the Column Selection menu** | **COVERED-BY — and it CORROBORATES us against the spec** | (i) WIP-EXP-02 = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) — *"Each download (PDF and CSV) carries a 'Locations:' line"*; (ii)(iii) WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) — *"it follows the column-selection toggle only"*. **His step 3 is independent evidence for the toggle model that WIP `S7-R13` denies** |
| **C38921** — *"IV CSV export carries the As of and Locations metadata lines above the header, plus a **scope-conditional** Location column"* | (i) `As of:` metadata line · (ii) `Locations:` metadata line · (iii) **a SCOPE-CONDITIONAL Location column** | **(i)(ii) COVERED-BY · (iii) CONTRADICTS-OURS** | (i)(ii) IV-EXP-04 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) — *"the CSV's first line reads "As of: 2026-08-04" (with a colon)"* — and IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588). **(iii) IV-LOC-06 = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) says the opposite:** *"Location IS one of the columns offered in the column-selection control — its visibility follows that toggle, **not the location selection**."* See §6 |

**Direction 1 result: no foreign case DUPLICATES one of ours** in the sense of asserting the same
thing at the same granularity — each bundles 3–4 assertions that our suite splits across 2–3 cases.
That is an automation-vs-manual granularity difference, not redundancy. **No retirement is
recommended in either direction.**

**Direction 2 result: 1 CANDIDATE GAP (§3) and 1 CONTRADICTS-OURS (§6).** Both are carried into the
outstanding register with their evidence. **Neither foreign case was edited, deleted, moved, or added
to a run** (Rule 38), and neither was dismissed for lacking `refs` (Rule 44).

**Reproducibility.** The read-only reverse diff is in `tools/` and reproduces the 2026-07-31 catch
from cold: run against C38923, our 478 cases narrow to a handful of candidates with **C30285 and
C30286 among the top five** — the two cases that were wrong that day.

---

## Check (b) — THE AUTOMATION-ENGINEER LENS

*"If I were automating this from the RUNNING BUILD, what would I assert?"*

**This lens is genuinely available for the first time.** On 2026-07-31 it had to be limited to the
document, and that limit was stated. Now a build exists (**QA branch `sv8582`, `v3.4.1-0ed4433`**)
and the 2026-08-03 batches captured **real payloads and real exported files** — 13 PV CSVs, 6 PV PDF
text extracts, SBC/SBR CSV + PDF text extracts via **pypdf**, TU CSVs + a PDF text extract, a WIP PDF
text read, an IV CSV head.

**What the lens produced:**

1. **The one thing an automation engineer asserts that we do not: a file's *footer*.** An engineer
   parsing a CSV reads it to EOF and therefore sees whether a trailing totals row exists. A manual
   case author writes about the headers and the rows. That asymmetry is exactly what C38923's step 4
   exposes — **§3**.
2. **Metadata lines above the header.** Both C38921 and C38922 assert the *position* of the metadata
   line ("above the header", "line 1"). Our cases assert the line *exists* and several explicitly
   defer position — *"exact position in the file is confirmed in the build"* (TU-EXP-04 = C30437 item
   4, WIP-EXP-02 = C30511). **That deferral is now closeable**: `viu-2026-08-03/SURFACE-MATRIX.md`
   §1b records the observed SBC value as **line 1**, `"Locations: Staging Heavy Duty - 9919"`.
   **Recommendation: replace the deferrals with the observed position** — a staged change, not made.
3. **Column-order-in-file assertions.** The PV live pass found the Location column renders **sixth**,
   after Vendor, not leftmost as PV `S7-R8` requires — *on screen AND in both exports*. Already
   recorded as a build defect in `batch-pv-tu/VERDICTS.md`; the lens confirms an automation engineer
   would assert the position and fail it too. No new gap.
4. **Nothing else.** Walking the six specs' export requirements against what the captured files
   actually contain produced no further assertion we lack.

**Honest limit (Rule 12).** I did **not** drive the build myself this run. This lens was applied to
the **captured artefacts** of the 2026-08-03 pass, on a build **declared NOT FINAL** — so its
findings are **PROVISIONAL** under Rule 49 and `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN**.

---

## Check (c) — THE HOSTILE-REVIEWER LENS

*"What would a reviewer claim is missing, before the challenge arrives?"*

| A reviewer could claim… | Our answer, with evidence |
|---|---|
| *"Your 895 is an estimate — you don't actually know how many requirements there are."* | It is exact. `tools/parse_specs.py` classifies **every** non-blank line of all six specs and fails loudly unless `lines_present == lines_accounted`. **2160 / 2160, zero remainder, zero strays.** Per-line evidence in `data/spec-lines.csv`. |
| *"You said 'covered' 1240 times and read almost none of them."* | **Partly fair, and labelled.** 352 of 1278 rows rest on my own reading; 926 rest on an anchor citation **plus** a quoted expected-result sentence at ≥ 0.34 overlap, **and every one of the 926 was additionally swept for polarity inversion**. The CSV records which basis each row has. I do not claim a cold read of 1278 rows. |
| *"An overlap score can't tell 'is shown' from 'is NOT shown'."* | Correct, which is why `tools/polarity_sweep.py` exists and ran over **all 1278 rows**. It found 3 of the 12 real contradictions independently, one of them (**IV `S3-R1`**) not previously recorded anywhere. |
| *"You have uncovered requirements and you're hiding them in a percentage."* | There are **no** uncovered requirements. The 4 deliberate cuts and 19 not-independently-testable assertions are listed **individually, with verbatim text and reason**, in `COVERAGE-EXHAUSTIVE.md`. |
| *"Your suite contradicts its own specs in 12 places."* | **True, and deliberate in all 12.** Each follows a newer authoritative source (Rules 32/33) and is listed with both texts quoted. What is owed is a **PO spec edit**, not a case edit — and it is item 1 of the outstanding register. |
| *"You never looked at four of the six reports for Rule 42."* | **True of the earlier pass, and that is one of this pass's findings.** Document A's list was SBC/SBR-only; **15 of the 30 genuine closed enumerations are in PV, TU and WIP** and had never been swept. `RULE-42-CONTRADICTIONS.md` §2a. |
| *"The 2026-07-31 pass already said 888/895 covered — what did you add?"* | Five things it did not have: **(1)** per-**assertion** rows, which split SBR `S14-R14` into 2 covered + 1 cut where that pass cut the whole requirement; **(2)** a line-level completeness **proof**; **(3)** the polarity sweep; **(4)** the Rule-42 sweep across all six reports; **(5)** 5 contradictions and 1 candidate gap it did not record. |
| *"Vlad found your defect last time. What stops that recurring?"* | Nothing stops it entirely, and I am not claiming otherwise. What is different: his 5 cases were diffed **in both directions** this run, his C38921 is escalated as CONTRADICTS-OURS instead of being explained away, and his C38923's footer step became a **CANDIDATE GAP** instead of a nuisance. |
| *"Your specs could be stale again."* | All six were confirmed at their true Confluence version numbers (SBC v13 · SBR v15 · PV v4 · TU v5 · WIP v6 · IV v3) and the requirement id set diffed against the prior pass: **0 added, 0 removed, 2 substantive text changes**, both already reflected in cases. |

---

## Check (d) — EVERY EXTERNAL SIGNAL TREATED AS A COVERAGE INPUT

Each was **diffed against the suite**, not merely answered.

| Signal | Diffed? | What it produced |
|---|---|---|
| **Vladimir Tomovic's 5 automated cases** | yes, both directions | 1 CANDIDATE GAP (§3), 1 CONTRADICTS-OURS (§6), 1 CORROBORATION of our WIP toggle model against the spec |
| **Chris Ward's Q1–Q5 answers** (2026-07-29 / 07-31) | yes | 3 of the 4 contradiction groups trace to them; **12/12 rows follow the newer source correctly** |
| **The QA lead's 2026-08-03 "ONE permission FOR NOW"** | yes | contradiction group **B** — PV `S1-R4` / `S1-N2`; the spec correction reached SBC in v13 but **not PV** |
| **The 2026-08-03 live build observations** | yes | contradiction group **C**; and the deferred "position confirmed in the build" phrases are now closeable (§b item 2) |
| **The internal disagreement between two documents of one VIU pass** | yes | the whole of `RULE-42-CONTRADICTIONS.md` — and the finding that **both** were unsubstantiated |
| **The 2026-07-31 root-cause paper** (`gap-rootcause-2026-07-31/`) | yes | its reverse-diff method is reused here rather than reinvented |

---

## Check (e) — NO "COVERED" VERDICT WITHOUT BOTH TEXTS QUOTED, AND ONE ROW PER ASSERTION

**This is the mechanical clause and the one that catches false all-clears.** On 2026-07-31 the deltas
document filed the export surface under *"NO-CHANGE (checked, provably fine — not skipped)"*, naming
seven case ids and quoting nothing — and it was wrong.

| Requirement | This pass |
|---|---|
| One row per **assertion**, not per requirement | **895 requirements → 1278 assertion rows.** Split rule documented in `tools/map_coverage.py`, including a **force-split whenever one sentence names more than one surface** so Rule 40 gets a per-surface verdict |
| **Both texts quoted, verbatim** | every one of the 1278 rows in `requirement-coverage.csv` carries `requirement_text_verbatim`, `assertion_text_verbatim` **and** `covering_expected_quote_verbatim`; rendered side by side in `side-by-side/` (6 files, 1278 rows) |
| **No id-only shorthand** | there is no *"covered by C30277"* anywhere in this pass's output. A row with an empty quote cannot be written as covered — the 4 cuts and 19 not-testable rows are the rows without quotes, and they are not called covered |
| Compliance test | *a NO-CHANGE entry naming only case ids, with no quoted text, is non-compliant.* **This pass contains no such entry.** |

---

## §3 — THE CANDIDATE GAP: the SBR **Expanded** CSV footer totals row

**What his case implies.** C38923's step 4 reads *"Inspect the Expanded footer totals row"* — so on
the running build the **Expanded** CSV has a footer totals row worth asserting.

**What ours say.** SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)
item 5, on the **Summary** CSV:

> *"The CSV has NO totals row."*

SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286), the **Expanded** CSV
case, says **nothing either way**.

**What the spec says.** **Nothing.** SBR v15 `S14-R16` (Expanded CSV) has no totals-row line; the
only export totals-row text in the spec is `S14-E3`, and it is about the **Summary PDF** — *"The
Summary PDF renders the header strip, no data rows, and a grand-totals row showing zeros…"*.

**Why this matters.** The suite asserts *no totals row* for one CSV and is silent for its twin. A
tester finding a totals row in the Expanded CSV has nothing to check it against, and a tester who
reads the Summary rule by analogy would **fail a correct build**.

**Verdict: CANDIDATE GAP.** Product question for **Chris Ward** first (does the Expanded CSV carry a
footer totals row, and if so with what contents?), then **your authorization** for the case change.
**Nothing authored.** Per Rule 6 a candidate gap is never authored on our own initiative.

---

## §6 — THE CONTRADICTS-OURS: IV Location column, scope-conditional vs toggle-driven

**Both bases on the table, per Rule 39.**

**HIS basis.** C38921, created by Vladimir Tomovic (user id 1), title asserts *"a **scope-conditional**
Location column"*, and step 3 is *"Turn on All Locations, wait for the refetch, and download again"*
followed by step 4 *"Inspect the data row's Location cell"* — i.e. the column's presence follows the
**location scope**. **His case carries NO `refs`**, so his source cannot be read off the case. Under
Rule 39 *"unknown" is only acceptable AFTER asking* — **he has not been asked**, and that ask is
item 4 of the outstanding register. What can be established without asking: his cases were last
updated **2026-08-03** (`updated_on` 1785433304), so the spec live to him was **IV v3, 2026-07-29**,
whose `S7-R6` says exactly what he asserts — *"a per-row **Location** column that is shown only when
the current scope spans more than one location; when a single location is in scope the column is
hidden."* **His assertion matches the spec.**

**OUR basis.** IV-LOC-06 = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) items 4
and 5:

> *"Location IS one of the columns offered in the column-selection control — its visibility follows
> that toggle, **not the location selection**."*
> *"With the Location toggle off the column is not shown and the surrounding columns close up."*

Our source is **the live build**, observed 2026-08-03 and recorded in
`viu-2026-08-03/batch-wip-iv/VERDICTS.md`:

> *"Items 1, 4 and 5 are REFUTED: Location IS a manual toggle in the Column Selection panel … and it
> does NOT appear automatically at multi-location scope nor hide automatically at single-location
> scope … **IV behaves differently again (there it is ON by default and stays on when narrowed), so
> the two reports are not consistent with each other or with the spec.**"*

**So the disagreement is real and it is not about competence.** He wrote to the **spec**; we wrote to
the **observed build**; the spec and the build disagree. Rule 32 says the most recent authoritative
**product** source wins — and a build is not a product source, a spec is. That is precisely why this
needs **Chris Ward**, not a QA decision.

**Three honest possibilities, and I am not picking one:**

1. The build is wrong and the spec is right → **his case is correct and ours needs changing.**
2. The build is intended and the spec is stale → **ours is correct and Chris owes a spec edit** (this
   is what the 2026-08-03 pass assumed, and it is an assumption).
3. IV and WIP were built inconsistently by accident → **a dev ticket**, and both cases stand until it
   is fixed.

**Also checked first, per Rule 39:** is this our own older case contradicting a newer ruling we
already hold? **No.** IV-LOC-06 = C38917 was authored **2026-07-31** and revised on **2026-08-04**;
it is the newer of the two documents and it deliberately departs from the spec. This is a genuine
two-party disagreement, not our own staleness.

**We did not touch C38921** and we will not. Escalated with both bases (Rule 39), for you and
Vladimir Tomovic to settle.

---

## What this check did NOT cover

- **A live re-drive by me.** Every build-derived statement here cites the 2026-08-03 pass and is
  **PROVISIONAL** (Rule 49). The build was declared NOT FINAL; the re-check queue is **OPEN**.
- **Foreign cases outside group 4281.** Only the Report Suite group was read. Per Rule 47, other
  projects' and other authors' runs are out of scope and were not audited.
- **The cold read of all 478 cases.** That is the sibling worker's job
  (`audit-exhaustive-2026-08-04/`), not this pass's. This document is the **coverage** outside-in,
  not the **quality** outside-in.
