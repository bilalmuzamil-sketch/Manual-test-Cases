# Report Suite — EXHAUSTIVE coverage verification, 2026-08-04

**What this is.** The 2026-07-31 coverage re-derivation extracted its requirement anchors and
reported the result as *"partial"*. Under **Standing Rule 50** a partial extraction is an
**unfinished job**, not a partial pass. This document finishes it: **every** requirement in
**all six current specs**, **every** assertion inside those requirements, in **both directions**,
with **both texts quoted** — and it proves its own completeness rather than asserting it.

**Nothing was written to TestRail.** The live read was `get_sections` + `get_cases` only. Every
proposed change is staged as text in this folder; no case was authored, edited, moved or deleted.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Date checked | Verdict |
|---|---|---|---|---|
| Spec — Sales By Customer | Confluence pageId **577634305** | **v13**, live `lastModified` Jul 31 2026 | 2026-08-03 capture, re-read 2026-08-04 | **CURRENT** |
| Spec — Sales By Representative | Confluence pageId **585629698** | **v15**, Jul 29 2026 | 2026-08-03 capture, re-read 2026-08-04 | **CURRENT** |
| Spec — Parts Velocity | Confluence pageId **620888066** | **v4**, Jul 29 2026 | 2026-08-03 capture, re-read 2026-08-04 | **CURRENT** |
| Spec — Technician Utilization | Confluence pageId **641400833** | **v5**, Jul 29 2026 | read live in full 2026-08-03; mirror proven same-version | **CURRENT** |
| Spec — Work In Progress | Confluence pageId **703660034** | **v6**, Jul 29 2026 | read live in full 2026-08-03; mirror proven same-version | **CURRENT** |
| Spec — Inventory Value | Confluence pageId **720142338** | **v3**, Jul 29 2026 | read live in full 2026-08-03; mirror proven same-version | **CURRENT** |
| Test cases | TestRail group **4281**, project 1 / suite 1 | live read-only snapshot | **2026-08-04** | **CURRENT** |
| Epic + child stories | **SV-8582**, 97 children | **not re-read this run** — a Tier-2 full re-read is user-gated (Rule 37) | 2026-08-04 (`epic-reread-2026-08-04/` from the sibling pass) | **PARTIAL** — the epic's *content* is not an input to this pass; requirement text comes from the specs |
| Designs | — | none exist; spec-only project | 2026-08-04 | **N/A** |
| Engineering tech plan | `tech-plan-2026-07-29` | 2026-07-29, not re-fetched this run | 2026-08-04 | **PARTIAL** — used only where a case's `refs` cites it (3 cases) |
| PO answers | Chris Ward Q1–Q5 (2026-07-29 / 07-31), QA lead 2026-08-03 | newest authoritative product source | 2026-08-04 | **CURRENT** |
| Live build | QA branch `sv8582`, **`v3.4.1-0ed4433`** | observed 2026-08-03, **DECLARED NOT FINAL** | 2026-08-04 | **PARTIAL** — Rule 49: every build-derived finding cited here is **PROVISIONAL** and sits in an **OPEN** `viu-2026-08-03/RECHECK-QUEUE.md` |

**Two sources are PARTIAL and this document does not claim completeness against them.** The
requirement population is derived **wholly from the six spec bodies**, which are all CURRENT, so
the coverage totals below are complete. Where a *verdict* rests on the **live build**, it is
labelled and inherits the Rule-49 provisional status.

**Spec-vs-prior-pass delta.** Diffed my 895 requirement ids against the 2026-07-31 pass's 895:
**0 added, 0 removed.** After normalising the two capture pipelines, **only two requirements
changed substantively** — **SBC `S1-R2`** and **SBC `S1-N1`**, the v12→v13 permission reversal
(dedicated Sales-By-Customer permission → ordinary reports access). Both are correctly reflected in
SBC-PERM-01 = [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) and
SBC-PERM-02 = [C30099](https://shopview.testrail.io/index.php?/cases/view/30099). The other 52
textual differences are pipeline artefacts (escape handling, swallowed block labels), enumerated by
`tools/` and not requirement changes.

---

## STEP 1 — EVERY REQUIREMENT, AND THE COMPLETENESS PROOF

`tools/parse_specs.py` assigns **every non-blank line of all six specs exactly one class**. The
completeness test is `lines_present == lines_accounted`, with **zero remainder and zero strays**.
It is re-runnable and it fails loudly (exit 1) if any line is unaccounted for.

| Spec | pageId | ver | non-blank lines | lines accounted | remainder | **requirements** | R | N | E |
|---|---|---|---|---|---|---|---|---|---|
| **SBC** Sales By Customer | 577634305 | v13 | 488 | 488 | **0** | **234** | 204 | 21 | 9 |
| **SBR** Sales By Representative | 585629698 | v15 | 529 | 529 | **0** | **234** | 190 | 35 | 9 |
| **PV** Parts Velocity | 620888066 | v4 | 261 | 261 | **0** | **73** | 61 | 6 | 6 |
| **TU** Technician Utilization | 641400833 | v5 | 279 | 279 | **0** | **120** | 101 | 12 | 7 |
| **WIP** Work In Progress | 703660034 | v6 | 298 | 298 | **0** | **122** | 111 | 5 | 6 |
| **IV** Inventory Value | 720142338 | v3 | 305 | 305 | **0** | **112** | 99 | 8 | 5 |
| **TOTAL** | | | **2160** | **2160** | **0** | **895** | 766 | 87 | 42 |

### THE TRUE REQUIREMENT TOTAL IS **895**

The earlier estimate of *"~895"* is **exact**. It is not an estimate any more: it is the count of
lines classified `REQ-DEF`, and every other line in every spec carries a named non-requirement
class. Per-line output: `data/spec-lines.csv` (2160 rows).

| Class | Lines | What it is |
|---|---|---|
| `REQ-DEF` | **895** | **a requirement definition — one requirement row each** |
| `LABEL` | 331 | `**Requirements:**`, `**Negative cases:**`, `**Edge cases:**`, `**Prerequisites:**`, `**Design:** … **Jira:**`, `**Error Handling:**` |
| `NARRATIVE` | 303 | Business Case, Feature Overview, Key Decisions, Terminology, Assumptions, User Feedback prose — goal/persona narrative and rationale |
| `HEADING` | 145 | ATX headings |
| `STORY-INTRO` | 83 | the one-line summary under each `### Story N:` heading |
| `REQ-CONT` | 69 | continuation lines of the requirement above (wrapped text, nested bullets, inline tables) |
| `CAPTURE-HDR` | 57 | our own capture front-matter, not spec content |
| `PREREQ` | 53 | bullets under `**Prerequisites:**` |
| `CONTEXT-NOTE` | 47 | italic "\* Context note: …" asides |
| `TABLE-ROW` | 47 | feedback / toast table data rows |
| `CHANGELOG-ROW` | 41 | Change Log data rows |
| `RULE` | 41 | horizontal rules |
| `META-TABLE` | 24 | the Epic/Owner/Status/Branch page-properties table |
| `TABLE-HDR` | 24 | table header rows and their separators |
| **TOTAL** | **2160** | **= lines present. Zero unaccounted.** |

### CROSS-CHECK: ids mentioned but never defined

Five ids appear in the spec text without a definition — **SBC `S16-R6`, `S8-R14a`, `S8-R14b`;
WIP `S7-R7a`, `S9-E2`**. All five occur **only inside Change Log rows** (SBC line 698–699,
WIP line 504–505), i.e. references to requirements that were deleted or renumbered — Print was
retired from SBC and the S8-R14 expand gate was dropped in the 2026-07-16 server-side rework.
They are correctly **not** requirements, and **no case cites any of them** (Direction B below).

---

## STEP 2 — COVERAGE VERDICTS, BOTH DIRECTIONS

### The population

Live read-only snapshot of TestRail group **4281** on 2026-08-04:
**483 cases live = 478 OURS (`created_by` 3) + 5 FOREIGN (`created_by` 1, Vladimir Tomovic:
C38919–C38923).** Set equality against `testrail-id-map.csv` verified **in both directions:
0 in the map that are not live, 0 live that are not in the map.** The population for this pass is
therefore **478**, exactly as briefed. Foreign cases were **read but never touched** (Rule 38).

### DIRECTION A — requirement → case, one row per ASSERTION (Rule 45(e))

**895 requirements → 1278 assertion rows.** The split rule is mechanical and documented in
`tools/map_coverage.py`: sentence boundaries (abbreviation-safe, so "Inv. Hrs" is never torn),
dropping pure cross-references and pure rationale, and **force-splitting any sentence that names
more than one surface** so Rule 40 gets a per-surface verdict.

| Spec | reqs | assertions | COVERED-MACHINE | COVERED-HUMAN-READ | CASE-CONTRADICTS-SPEC | via-SECTION-ANCHOR | CONDITIONAL | NOT-INDEPENDENTLY-TESTABLE | DELIBERATE-CUT |
|---|---|---|---|---|---|---|---|---|---|
| **SBC** | 234 | 278 | 208 | 66 | 0 | 0 | 0 | 3 | 1 |
| **SBR** | 234 | 364 | 270 | 84 | 1 | 0 | 1 | 6 | 2 |
| **PV** | 73 | 172 | 102 | 55 | 4 | 0 | 0 | 10 | 1 |
| **TU** | 120 | 173 | 117 | 53 | 1 | 2 | 0 | 0 | 0 |
| **WIP** | 122 | 146 | 109 | 34 | 3 | 0 | 0 | 0 | 0 |
| **IV** | 112 | 145 | 120 | 22 | 3 | 0 | 0 | 0 | 0 |
| **TOTAL** | **895** | **1278** | **926** | **314** | **12** | **2** | **1** | **19** | **4** |

**Row count reconciled:** 1278 assertion rows over 895 requirements; every requirement produces at
least one row; `sum(assertions per requirement) == 1278`. Rolled up to requirement level
(worst verdict wins): **606 COVERED-MACHINE · 258 COVERED-HUMAN-READ · 11 CASE-CONTRADICTS-SPEC ·
1 via-SECTION-ANCHOR · 1 CONDITIONAL · 14 NOT-INDEPENDENTLY-TESTABLE · 4 DELIBERATE-CUT = 895.**

**THERE ARE NO UNCOVERED REQUIREMENTS AND NO NEW CASES ARE NEEDED.** Every one of the 895 either
has a covering case or is one of the 4 deliberate cuts / 14 not-independently-testable
requirements named in full below.

### The evidence basis, stated honestly (Rules 12 / 50)

Rule 45(e) forbids a "covered" verdict without **both texts quoted side by side**, so every one of
the 1278 rows in `requirement-coverage.csv` carries `requirement_text_verbatim`,
`assertion_text_verbatim` **and** `covering_expected_quote_verbatim`. The full side-by-side tables
are in **`side-by-side/`**, one file per spec, in requirement order.

But the *strength* of the evidence differs per row, and pretending otherwise would be the exact
failure this pass exists to correct:

| Basis | Rows | What it means |
|---|---|---|
| **hand-read this run** | **314** | I read the covering case end to end and confirmed it. 201 came from the weak/unsubstantiated set, 113 from the polarity sweep. |
| **hand-adjudicated this run** | **38** | I wrote an explicit verdict + reason, encoded in `tools/finalize.py` so it is auditable, not buried in prose. |
| **machine-substantiated** | **926** | the case cites the anchor **and** a quoted expected-result sentence overlaps the assertion at ≥ 0.34 content-word similarity. **Not individually read.** |

**So: 352 of 1278 rows (27.5%) rest on my own reading; 926 rest on a quoted textual match.** That
is not a sample — every row was *processed*, and every row that the machine could not substantiate
on its own was *read*. But a machine-substantiated row is weaker evidence than a read one, and it
is labelled as such in the CSV rather than presented as equivalent.

### The safety net under the overlap score — the POLARITY SWEEP

A high overlap score can mask the **exact opposite** assertion ("the filter **is** shown" vs "the
filter is **NOT** shown") — the two texts share almost all their vocabulary. So
`tools/polarity_sweep.py` ran over **all 1278 rows, not a sample**, checking negation balance and
opposed-pair keywords. **204 flags** → the **5 opposed-pair** and the **113 high-overlap negation**
flags were read by hand. It found **3 of the 12 real contradictions independently**, including one
(**IV `S3-R1`**) that no earlier pass had recorded.

### DIRECTION B — case → requirement

Every one of the **478** cases checked against the current spec text:

| Check | Result |
|---|---|
| Cases whose `refs` cite an `Sn-Rn` anchor that **no longer exists** in the current spec | **0** — no orphan, no stale anchor |
| Cases citing an anchor that resolves only in a **different report's** spec | **0** |
| Cases citing an anchor in a **removed** story (SBC Stories 5 / 16 / 19 placeholders) | **0** |
| Cases with **no Jira ticket** in `refs` (Rule 20, first half) | **0** — 478 / 478 carry a `SV-` key |
| Cases with **no `Sn-Rn` anchor**, citing a spec **section** instead | **12** — legitimate, each states its reason in `refs` (below) |
| `refs` entries over TestRail's **248-character** limit | **0** — longest single entry is **245** |

**No orphaned or stale anchors exist. There is nothing to name under that heading.**

**The 12 section-anchored cases** cite a spec section (`§3`, `§7`, `Story N Prerequisites`,
`Error Handling`) or the tech plan, because the content genuinely has no `Sn-Rn` id. Each says so
in its own `refs`, so none is unsourced:
SBC-EMPTY-04 = [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) ·
SBR-CALC-07 = [C30235](https://shopview.testrail.io/index.php?/cases/view/30235) ·
SBR-CALC-08 = [C30236](https://shopview.testrail.io/index.php?/cases/view/30236) ·
PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) ·
PV-EXP-12 = [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) ·
PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925) ·
TU-EXP-08 = [C30441](https://shopview.testrail.io/index.php?/cases/view/30441) ·
TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) ·
WIP-EXP-10 = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) ·
WIP-PERM-01 = [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) ·
IV-SCOPE-05 = [C30544](https://shopview.testrail.io/index.php?/cases/view/30544) ·
IV-PERM-01 = [C30603](https://shopview.testrail.io/index.php?/cases/view/30603).

**One Direction-B finding the anchor check does NOT excuse.** **358 of 478 cases (75%)** cite the
spec as a **local file path** — `specs/sbr-sales-by-representative.md` — with **no version and no
date**. Only 120 use the version-pinned form (`SBR spec v15 2026-07-29`). The anchors all resolve
today, so this is not a stale-anchor defect; it is a **Rule-42 traceability weakness**: when a spec
version bumps, a path-only `refs` gives nothing to re-check against. Per report: SBC 60 · SBR 86 ·
PV 50 · TU 43 · WIP 60 · IV 59. **Staged as a recommendation only — no edit made.**

---

## THE 4 DELIBERATE CUTS AND THE 19 NOT-INDEPENDENTLY-TESTABLE ASSERTIONS, IN FULL

Nothing here is hidden behind a count. **Rule 46**: an undocumented deliberate omission is
indistinguishable from a miss.

### Deliberate cuts — the covering case was retired by the user-authorized 2026-07-28 audit

| Requirement | Verbatim assertion | Retired case | Why |
|---|---|---|---|
| SBC `S10-N1` | *"When the table has no customer rows, the sort controls on the headers are still present but produce no visible change."* | `SBC-SORT-07` | CUT as a **no-op assertion** |
| SBR `S11-N1` | *"With only one rep row visible, the sort affordances are present but produce no observable change."* | `SBR-SORT-06` | CUT as a **no-op assertion** |
| SBR `S14-R14` a2/3 | *"If a negative value's parenthesized rendering is longer than the largest positive, the export shifts the base tier **one step smaller** … **clamped at the 8px floor**"* | `SBR-EXP-09` | CUT as **"px font-tier edge minutiae, not manually testable"** |
| PV `S4-N1` | *"If a saved view predates the current version of the report's saved format … the system ignores the stale view and loads the current defaults"* | `PV-COL-07` | CUT as **"stale-schema seeding not executable manually"** — a tester cannot write a mismatched stored schema version |

**A REFINEMENT ON THE 2026-07-31 PASS.** That pass marked **the whole of SBR `S14-R14`**
CUT-BY-AUDIT. That is too broad: assertions **1** (*"Tier selection uses the longest formatted
**positive** value"*) and **3** (*"the fixed column widths (S14-R13) prevent overflow in all cases
regardless of the chosen tier"*) **are** covered, by
SBR-EXP-08 = [C30283](https://shopview.testrail.io/index.php?/cases/view/30283) — *"As the longest
positive dollar value in the document grows past each length bracket, the PDF body text visibly
steps DOWN in size"* and *"Column widths are fixed for the worst case regardless of tier — the
layout never breaks and no value overflows or wraps its column."* **Only assertion 2 is cut.**
This is precisely what per-assertion rows buy you over per-requirement rows.

### Not independently testable — 19 assertions, each with its reason

| Requirement | Verbatim assertion | Reason |
|---|---|---|
| SBC `S11-N1` a1 | *"No applicable user-visible negative cases."* | the spec's own words — nothing to test |
| SBC `S20-N1` a1 | *"No applicable user-visible negative cases."* | same |
| SBC `S20-N1` a2 | *"The visual conformance rules apply whenever the report is rendered."* | scope statement; the rules themselves are covered by SBC-VIS-01/02/03 = C30185 / C30186 / C30187 |
| SBR `S6-R2` a3 | *"(Context note: the per-rep detail page size, and the bound on how many reps the header expand-all control opens at once, are build tuning values defined in the tech plan, **not fixed by this spec**.)"* | the spec explicitly declines to fix a value |
| SBR `S10-R2` a2 | *"PDFs do not scroll."* | a static PDF has no scroll to test; a scope clarification of the on-screen pinning rule (covered by SBR-TOT-01 = C30237) |
| SBR `S10-R6` a2 | *"PDFs have no scroll."* | same |
| SBR `S14-R16` a4 | *"(Build note: the current build populates a single mislabeled hours column here; align it …)"* | instruction to engineering; the header list itself is assertion 1 |
| SBR `S18-R7` a1 | *"Normative visual rules (self-contained; no external lookup):"* | section preamble, not an assertion |
| SBR `S18-R7.6` a2 | *"If app-wide report styling evolves later, this report's treatment is updated in a new spec round; this spec is the source of truth."* | statement about the **spec's** authority, not the product |
| PV `S7-R7` a1, a2 | *"These rules are the normative visual spec for this report as built."* / *"…this spec is the source of truth for this report."* | same shape as SBR S18-R7.6 |
| PV `S3-R1` a1, a2 | *"The table displays one row per part, showing the columns currently enabled in the column picker (see Story 4)."* / *"Calculation of each column's value is defined in Story 5."* | pointer prose; the substance is tested under `S3-R1a`, Story 4 and Story 5 |
| PV `S3-R1a` a3 | *"(Money columns being additive, the special-order merge reconciles cleanly.)"* | rationale |
| PV `S3-R9` a4 | *"Full per-column formatting is in S5-R5."* | pointer |
| PV `S1-N2` a2 | *"(Build-note: confirm the FE uses this shown-then-denied model …)"* | instruction to engineering; the behaviour is assertion 1 |
| PV `S5-R4b` a4 | *"(Build-delta: the current billed-side queries do not net reversals …)"* | build-delta note; the netting behaviour is covered by PV-CALC-11 = C30369 |
| PV `S5-R7` a6 | *"(Build note: a separate "Units Billed" column was considered … it was deferred …)"* | design history |
| PV `S5-R7` a7 | *"Revisit only if users still trip on the cross-column math.)"* | future-work note |

---

## THE 12 CASE-CONTRADICTS-SPEC ROWS — 4 GROUPS, ALL FOLLOWING A NEWER SOURCE

These requirements **are** covered — by a case that asserts the **opposite of the spec text**,
deliberately, because a **newer authoritative source** says so (Rules 32 / 33). In every one of the
12 the case follows the newer source and **the spec text is what is stale**. Each therefore needs a
**PO spec edit**, not a case edit. Full quotes in `RULE-42-CONTRADICTIONS.md` §3.

| Group | Requirements | Cases | Spec says | Case says (newer source) |
|---|---|---|---|---|
| **A** single-location Location **FILTER** | SBR `S21-N1` · PV `S2-E4` · TU `S9-N1` · IV `S7-N1` | SBR-LOC-04 [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) · PV-FILT-13 [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) · TU-LOC-05 [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) · IV-LOC-04 [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | *"still sees the filter with a single selectable location"* | *"the Location filter is NOT shown at all"* — **Chris Ward 2026-07-31 Q1 = A (hidden)** |
| **B** permission model | PV `S1-R4` (2 assertions) · PV `S1-N2` a1 | PV-PERM-01 [C30325](https://shopview.testrail.io/index.php?/cases/view/30325) · PV-PERM-03 [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) · PV-API-04 [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) | *"require the **Inventory Reports → View** permission"* | ordinary reports access — **Chris Ward Q2 = A + QA lead 2026-08-03 "ONE permission FOR NOW"** |
| **C** Location **COLUMN** visibility model | WIP `S7-R13` · IV `S7-R6` a1 · IV `S3-R1` a2 | WIP-FLT-09 [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) · IV-LOC-06 [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) · IV-COL-01 [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | *"shown **automatically** … the user does not toggle it in the column selector"* | *"it follows the column-selection **toggle** only"* — **live-observed on `v3.4.1-0ed4433`, 2026-08-03 (PROVISIONAL, Rule 49)** |
| **D** Asset identifier | WIP `S4-R7` · WIP `S4-R8` | WIP-COL-05 [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | *"the unit number on the first line in bold, and the vehicle identification number on the second line"* | VIN first, then Unit #, then plate — **Chris Ward 2026-07-29 identifier-chain ruling** |

**Group A is the highest-risk item in the suite** and was already recorded: 4 cases will fail a
build a developer built correctly from the spec. **This pass adds two cases to that group that the
existing register does not list** — see `OUTSIDE-IN.md` §6.

---

## STEP 3 — THE SURFACE DIMENSION

See **`SURFACE-MATRIX.md`**. Summary: **310 of 1278 assertion rows name or imply a non-screen
surface; every surface that appears has a verdict on every row; no surface is left without one.**

---

## STEP 4 — RULE 42, AND THE 30-CASE CLAIM

See **`RULE-42-CONTRADICTIONS.md`**. Headline: the *"30 Rule-42 cases have two source documents
contradicting each other"* claim conflated a **keyword list** with an **internal QA-document
disagreement**, and neither half survives an exhaustive check. **29** cases contain a genuine closed
enumeration; **29/29 are version-pinned** and **28/29 carry a closing anchor**. The genuine
source-vs-source conflicts on those cases number **5**, all named, all following the newer source.

---

## STEP 5 — OUTSIDE-IN

See **`OUTSIDE-IN.md`**. All five Rule-45 checks ran with results stated, including the
foreign-coverage diff in both directions against C38919–C38923 (**4 COVERED-BY, 1 CONTRADICTS-OURS,
1 CANDIDATE GAP**) and the automation-engineer lens, now genuinely available because a build exists.

---

## WHAT I DID NOT DO — the honest limits of this pass

1. **926 of 1278 assertion rows were not individually read by me.** They are machine-substantiated
   on an anchor citation **plus** a quoted expected-result sentence at ≥ 0.34 overlap, and every
   one of them was additionally swept for polarity inversion. That is stronger than the 2026-07-31
   pass, which substantiated on the anchor alone — but it is **not** a cold read of 1278 rows, and
   I am not calling it one. A sibling worker is cold-reading all 478 cases concurrently
   (`audit-exhaustive-2026-08-04/`); its Dimension-2 output is the complement to this document.
2. **Nothing here was verified against the running build by me this run.** Where a verdict depends
   on the build I cite the 2026-08-03 VIU batches, which observed a build **declared NOT FINAL** —
   so those verdicts are **PROVISIONAL** under Rule 49 and sit in an **OPEN** re-check queue.
3. **Epic SV-8582 was not re-read.** A Tier-2 full re-read is user-gated (Rule 37) and the epic's
   content is not the source of the requirement population.
4. **The enumeration diff is partly mechanical.** 6 of the 29 closed enumerations paired cleanly
   with a spec list and matched; 3 mismatched (all the same one item); the remaining 20 could not be
   machine-paired and were read by hand instead — stated per case in `RULE-42-CONTRADICTIONS.md` §2.

---

## OUTSTANDING — what I need from you (Standing Rule 36)

| # | What is missing | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **Chris Ward's spec edits for the 4 contradiction groups** (Location filter visibility · PV permission model · WIP/IV Location column toggle-vs-automatic · WIP asset identifier) | **Chris Ward** (PO) | 12 requirements are covered by cases that contradict their own spec text. Until the specs are corrected, a developer reading the spec builds the opposite of what 11 named cases assert. **Group A is the highest-risk item in the suite.** | 2026-07-31 (A, B, D) · 2026-08-03 (C) |
| 2 | **Your go-ahead for the version-pin backfill** — 358 of 478 cases cite the spec as a bare file path with no version or date | **you (QA lead)** | Rule 42's re-check mechanism. When a spec version bumps, a path-only `refs` gives nothing to re-check against — this is the mechanism that let the SBR export defect survive on 2026-07-31 | raised **2026-08-04** (this pass) |
| 3 | **A decision on the 1 CANDIDATE GAP** — whether the SBR **Expanded** CSV carries a footer totals row (`OUTSIDE-IN.md` §3) | **Chris Ward** (spec is silent) · then **you** to authorize a case | SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) asserts nothing about it while SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) asserts the **Summary** CSV has **no** totals row. The asymmetry is untested | raised **2026-08-04** (this pass) |
| 4 | **A decision on the 1 CONTRADICTS-OURS foreign case** — Vladimir Tomovic's **C38921** (IV) asserts a *scope-conditional* Location column where IV-LOC-06 = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) asserts a *toggle-driven* one | **you + Vladimir Tomovic** (Rule 39: both bases on the table) | which of the two models IV actually implements. We never touch his case (Rule 38); this needs the two of you | raised **2026-08-04** (this pass) |
| 5 | **Notice when the QA branch `sv8582` is declared FINAL** | **engineering** | every build-derived verdict in this pass is PROVISIONAL (Rule 49) and `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN**. No suite claim can be called VIU-complete while it is open | 2026-08-03 |
| 6 | **Your authorization for a Tier-2 epic re-read**, if you want epic content folded in | **you** | nothing in this pass — the requirement population comes from the specs. Recorded so the PARTIAL marker in the currency block is not silent | 2026-08-04 |

**Nothing in items 1–6 was acted on. No case was authored, edited or deleted; no TestRail write of
any kind was made.**
