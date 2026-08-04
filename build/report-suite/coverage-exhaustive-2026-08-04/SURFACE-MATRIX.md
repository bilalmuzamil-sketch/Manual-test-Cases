# Report Suite — SURFACE MATRIX, exhaustive pass 2026-08-04 (Standing Rule 40)

**Why this exists.** Rule 40 was earned on 2026-07-31, when a suite-wide requirement was applied to
the on-screen surface and never revisited on the export surface — and the delta document listed only
the cases it had touched, so nothing showed the hole. This matrix gives **every surface its own
verdict**, and it reports the surfaces with **no** verdict as a first-class result rather than a
silence.

**Relationship to `viu-2026-08-03/SURFACE-MATRIX.md`.** That document is the **live-evidence**
matrix: it read real downloaded files off the QA branch. This document is the **requirement-side**
matrix: it enumerates every assertion in all six specs that names or implies a surface and checks
each has a verdict. They are complements, and this one **cites** that one rather than re-deriving
its observations (as briefed).

---

## 1. SURFACE INVENTORY, AND THE VERDICT COUNT ON EACH

Derived mechanically from all **1278** assertion rows: a row is attributed to a surface when its
verbatim text names or implies it. **310 rows name at least one non-screen surface.**

| Surface | Assertion rows | Verdict spread | Rows with **no** verdict |
|---|---|---|---|
| **PDF export** | 90 | 70 machine · 18 hand-read · 2 not-independently-testable | **0** |
| **CSV export** | 76 | 57 machine · 18 hand-read · 1 not-independently-testable | **0** |
| **On screen** (named explicitly) | 62 | 43 machine · 18 hand-read · 1 not-independently-testable | **0** |
| **Export, format unspecified** | 44 | 22 machine · 18 hand-read · 3 case-contradicts-spec · 1 deliberate-cut | **0** |
| **Download** (the act, not the file) | 39 | 26 machine · 11 hand-read · 2 via-section-anchor | **0** |
| **Empty / zero state** | 23 | 14 machine · 9 hand-read | **0** |
| **Column selector** | 15 | 9 machine · 5 hand-read · 1 case-contradicts-spec | **0** |
| **Toast / notification** | 15 | 11 machine · 4 hand-read | **0** |
| **Tooltip** | 11 | 7 machine · 3 hand-read · 1 not-independently-testable | **0** |
| **Mobile** | 4 | 3 machine · 1 hand-read | **0** |
| **Print view** | 3 | 1 machine · 2 hand-read | **0** |
| **API** | 2 | 2 machine | **0** |

**ZERO SURFACES HAVE A ROW WITHOUT A VERDICT.** That is the check Rule 40 asks for and it passes.

### Surfaces declared N/A, with the reason (never silently omitted)

| Surface | Verdict | Why |
|---|---|---|
| **Print** | **N/A as a live feature** | Print was **retired from SBC** by ruling (SBC Story 16 is a `(removed — Print retired)` placeholder) and the 2026-08-03 live pass observed **no Print control anywhere on the build**. The 3 remaining rows are the *absence* assertions — SBC-EXP-01 = [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) asserts *"there is NO 'Print' item anywhere in the menu"* — which is the correct way to cover a retired surface. |
| **Email / scheduled delivery** | **N/A** | No such feature in any of the six specs. Confirmed by searching all 2160 spec lines: 0 hits. |
| **Mobile** | **PARTIAL** | 4 assertion rows exist and all 4 have a coverage verdict, but **mobile was NOT REACHED** by the 2026-08-03 live pass (stated there, not hidden). So mobile coverage is **document-verified, not build-verified**. |

---

## 2. THE LOCATION COLUMN, END TO END — citing the live evidence, not re-deriving it

This is the requirement that caused Rule 40, so it gets the full treatment. Governing anchors, one
per report: SBC **`S4-R12`** + **`S4-R13`** · SBR **`S21-R7`** + **`S14-R20`** · PV **`S6-R11`** ·
TU **`S9-R9`** + **`S7-R13`** · WIP **`S7-R13`** + **`S9-R10a`** · IV **`S7-R6`** + **`S10-R15`**.

**The requirement makes TWO assertions** and Rule 45(e) gives each its own row: **(i)** the per-row
**Location column**, and **(ii)** the **`"Locations:"` metadata line** in every export. Conflating
them is exactly what produced the false all-clear on 2026-07-31.

### 2a. Assertion (i) — the per-row Location COLUMN

| Report | On screen | CSV export | PDF export | Column selector | Covering case | Live evidence cited |
|---|---|---|---|---|---|---|
| **SBC** | COVERED | COVERED | COVERED | COVERED (asserts Location is **not** a toggle) | SBC-LOC-04 = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) · SBC-EXP-03 = [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) · SBC-COL-01 = [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | `viu-2026-08-03/batch-sbc-sbr/evidence/sales-by-customer/exports/` — CSV read, **PDF text extracted** (`*.pdf.txt`, pypdf) |
| **SBR** | COVERED | COVERED | COVERED | COVERED | SBR-LOC-05 = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) · SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) · SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | `batch-sbc-sbr/evidence/sales-by-representative/exports/` — CSV read, **PDF text extracted** |
| **PV** | COVERED | COVERED | COVERED | COVERED (asserts Location is **not** in the 20-entry picker) | PV-FILT-14 = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) · PV-COL-02 = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | `batch-pv-tu/evidence/pv/exports/` — 13 CSVs + 6 **PDF text extracts** |
| **TU** | COVERED | COVERED | COVERED | COVERED | TU-LOC-06 = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) · TU-EXP-04 = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | `batch-pv-tu/evidence/tu/exports/` — 3 CSVs + `tu-pdf-summary.txt` |
| **WIP** | **COVERED — case contradicts spec** | COVERED (header reads **"Branch"**, not "Location") | COVERED | COVERED (case asserts it **IS** a toggle) | WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) · WIP-EXP-02 = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | `batch-wip-iv/VERDICTS.md` — *"the export header is 'Branch' (**proven in the PDF text and the CSV header**)"* |
| **IV** | **COVERED — case contradicts spec** | COVERED | COVERED | COVERED (case asserts it **IS** a toggle) | IV-LOC-06 = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) · IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | `batch-wip-iv/evidence/exports/iv__MULTI__searchnarrow__csv.head.txt` |

**Correction to the briefing, stated plainly (Rule 12).** I was told the batches *"read the actual
PDF/CSV contents"*. That is **true for SBC, SBR, PV, TU and WIP** — `batch-sbc-sbr/tools/extract_pdf.py`
uses **pypdf** and persisted `*.pdf.txt` extracts, and the WIP verdict names the PDF text explicitly.
But `viu-2026-08-03/SURFACE-MATRIX.md` line 191 still carries an **earlier, now-superseded** note
saying *"PDF file CONTENTS — NOT REACHED … no PDF text-extraction tool is installed"*. **That note is
stale**: the extractor was added the next day (its docstring reads *"proven working on the sv8582
report PDFs 2026-08-04"*). **IV is the one report with no persisted PDF text extract** — only a CSV
head. So IV's PDF cell above rests on the CSV + the case text, **not** on a read PDF, and I am
labelling it rather than letting it inherit the others' evidence.

### 2b. Assertion (ii) — the `"Locations:"` metadata LINE in every export

| Report | Governing anchor | CSV | PDF | Covering case | Verdict |
|---|---|---|---|---|---|
| SBC | `S14-R13` / `S15-R14` / `S4-R13` | COVERED | COVERED | SBC-EXP-09 = [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) (*"The header also carries a 'Locations:' line naming the location(s)…"*) | live-CONFORMS per `viu-2026-08-03/SURFACE-MATRIX.md` §1b |
| SBR | `S14-R20` | COVERED | COVERED | SBR-EXP-10 / SBR-EXP-11 = C30285 / C30286 | **this is the pair that was wrong on 2026-07-31 and is now right** |
| PV | `S6-R11` | COVERED | COVERED | PV-FILT-14 = C38914 | |
| TU | `S7-R13` | COVERED | COVERED | TU-EXP-04 = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) (*"Every download (each PDF and the CSV) carries a 'Locations:' line…"*) | |
| WIP | `S9-R10a` | COVERED | COVERED | WIP-EXP-02 = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | corroborated by foreign case **C38922** (*"WIP CSV export gains the Locations line"*) |
| IV | `S10-R15` | COVERED | COVERED | IV-EXP-04 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) — and it also covers the **"As of:"** line, noting the PDF/CSV phrasing differs | corroborated by foreign case **C38921** |

**Both assertions have a verdict on both export surfaces for all six reports. 12 of 12 cells filled.**

---

## 3. THE OTHER MULTI-SURFACE REQUIREMENTS — per-surface verdicts

| Requirement family | Surfaces it names | Verdict per surface |
|---|---|---|
| **Export row cap (10,000 rows)** — SBC `S14-R16` / `S15-R25` · SBR `S14-E2` · IV `S10-R12` | CSV · PDF · toast | **all three COVERED.** SBC-EXP-14 = [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) covers CSV+PDF+toast in one case; SBR-EXP-15 = [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) + SBR-API-05 = [C30320](https://shopview.testrail.io/index.php?/cases/view/30320) split UI/API; IV-EXP-07 = [C30593](https://shopview.testrail.io/index.php?/cases/view/30593). PV and TU and WIP have **no cap line in their specs** — covered by the section-anchored PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885), TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887), WIP-EXP-10 = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918), each stating in `refs` that Chris ruled the cap suite-wide and **his spec edit is pending** |
| **Exports mirror the on-screen column selection** — PV `S6-R3` · TU `S9-R8` / `S10-R5` · WIP `S9-R10a` · IV `S10-R15` | on screen · column selector · CSV · PDF | **all COVERED.** PV-EXP-03 = [C30377](https://shopview.testrail.io/index.php?/cases/view/30377); TU-EXP-04 = C30437 item 5; WIP-EXP-02 = C30511; IV-EXP-02 = C30588. **SBR is the deliberate exception** — SBR `S20-R8` says the selector *"does not affect any export; all four downloads always include all metric columns"*, covered by SBR-COL-04 = [C30268](https://shopview.testrail.io/index.php?/cases/view/30268). The suite is **not** internally inconsistent here; the specs genuinely differ |
| **Export failure / empty-export notifications** — SBC `S14-N1` / `S15-N1` · SBR `S14-N2` / `S14-E3` · PV `S6` toasts · TU `S7-E1` · WIP `S9-R11..R13` · IV `S10` | toast · CSV · PDF | **all COVERED.** TU's two toast strings are covered **via a section anchor** (TU-EXP-08 = [C30441](https://shopview.testrail.io/index.php?/cases/view/30441)) because TU Story 7 gives them no `Sn-Rn` id — the anchor-based mapper could not see that link and it took a hand read to find |
| **Sign / colour conveyed without colour** — SBC `S14-R12` · SBR `S14-R9` / `S18-R12` · WIP `S9-R7` | on screen · PDF · CSV | **all COVERED.** The consistent rule across the suite is *colour on screen and in the PDF, monochrome in the CSV*: SBC-EXP-06 / SBR-EXP-09-family / WIP-EXP-04 = [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) |
| **Server-side generation of exports** — SBC `S14-R3` / `S15-R3` · SBR `S14-R2a` · PV `S6-R2` | API · CSV · PDF | **all COVERED** by the API cases, correctly placed in `<Report> — API` sections per Rule 4: SBC-API-05 = [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) · SBR-API-04 = [C30319](https://shopview.testrail.io/index.php?/cases/view/30319) |
| **Empty / zero state** — SBC Story 17 · SBR Story 16 · PV `S2-N1` · TU `S1-N2` / `S5-N1` / `S9-N2` · WIP `S2-N2` · IV `S5-N1` / `S7-N2` | on screen · CSV · PDF (empty export still generates) | **all COVERED.** The empty-**export** half is separately covered: SBC-EXP-15 = [C30173](https://shopview.testrail.io/index.php?/cases/view/30173), SBR-EXP-16 = [C30291](https://shopview.testrail.io/index.php?/cases/view/30291) — *"All four downloads produce a FILE, not an error"* |

---

## 4. THE ONE SURFACE FINDING THIS PASS ADDS

**SBR Expanded CSV — footer totals row: NO VERDICT ANYWHERE.**
SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) item 5 asserts
*"The CSV has NO totals row"* for the **Summary** CSV. SBR-EXP-11 =
[C30286](https://shopview.testrail.io/index.php?/cases/view/30286), the **Expanded** CSV case,
asserts **nothing** either way. The SBR spec is **silent**: `S14-R16` (Expanded CSV) has no
totals-row line, and only `S14-E3` mentions a grand-totals row, for the **Summary PDF**.

It surfaced because **Vladimir Tomovic's automated C38923 has a step reading *"Inspect the Expanded
footer totals row"*** — an automation engineer working from the running build wrote a step for a
surface detail our spec never wrote down. That is Rule 45(b) paying for itself.

**Carried as a CANDIDATE GAP, not authored** (item 3 of the outstanding register).

---

## 5. HONEST LIMITS

- **Mobile: 4 rows, document-verified only.** The 2026-08-03 live pass did not reach mobile.
- **IV PDF contents: not read.** Only a CSV head was persisted for IV. Its PDF cells rest on the
  case text and the CSV, and are labelled that way in §2a.
- **Every build-derived cell is PROVISIONAL (Rule 49)** — QA branch `sv8582`, build
  **`v3.4.1-0ed4433`**, declared **NOT FINAL**. `viu-2026-08-03/RECHECK-QUEUE.md` is **OPEN**.
- **The surface attribution is text-derived.** A requirement that implies a surface without naming
  it (or naming it in words my inventory does not carry) would not be attributed. The mitigation is
  that the 895-requirement sweep is exhaustive, so such a requirement still has a coverage verdict —
  it would simply not appear in the §1 table. I am stating this rather than implying the surface
  attribution is itself provably complete.
