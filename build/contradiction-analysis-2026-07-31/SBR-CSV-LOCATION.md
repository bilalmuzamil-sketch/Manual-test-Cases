# Contradiction analysis — the Location column in exports (SBR CSVs, and the WIP column selector)

**Date:** 2026-07-31 · **Project:** Report Suite (PO **Chris Ward**) · **Standing Rule:** 39 (new
this date) with Rules 32/33/38.

**What this is.** Two of Vladimir Tomovic's automated cases disagree with cases of ours about the
build. This document does the Rule-39 job: it puts **BOTH sides' sources** on the table — ours with
document + version + anchor + date, and his with whatever can be honestly established about what he
worked from — and then says plainly which of the three outcomes applies. **Nothing was changed.**

**SCOPE / HONESTY NOTES**
- **READ-ONLY pass.** No test case was edited, no TestRail call was made, nothing under
  `build/report-suite/**` was written (that tree is owned by another worker this session).
- **NOT live-verified (Rule 12).** The Report Suite QA branch is still not available to us, so
  every statement below is **source reconciliation**, never an observation of the build. Where the
  answer genuinely depends on what the build does today, that is said explicitly.
- **His cases are HANDS-OFF (Rule 38).** We do not edit, retitle, re-ref or move them.

### SOURCE-CURRENCY BLOCK (Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| SBR spec | Confluence pageId **585629698** | **v15**, last updated **2026-07-29T06:38:33Z** by Chris Ward | 2026-07-31 (capture in `build/report-suite/spec-current-2026-07-31/`) | **CURRENT** |
| WIP spec | Confluence pageId **703660034** | **v6**, last updated **2026-07-29T06:33:58Z** by Chris Ward | 2026-07-31 (same capture) | **CURRENT** |
| PO answers | Chris Ward, 5 of 5 answered | **2026-07-31** (newer than all six spec pages) | 2026-07-31 | **CURRENT** |
| Foreign-case evidence | `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md` | 2026-07-31 | 2026-07-31 | **CURRENT** |
| Designs | none exist for Report Suite | — | — | **N/A (spec-only project)** |
| Live build | Report Suite QA branch | **not available to us** | — | **MISSING — nothing here is live-verified** |

---

## PART 1 — Disagreement 1: does the Location column reach the SBR CSV files?

### 1. What OUR two cases assert

Read read-only from `build/report-suite/cases/cases-sbr-D-exports-assignments-states-mobile-visual-worep-api.json`.

**SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** — *"Summary CSV:
file name, UTF-8 BOM, verbatim headers, one row per rep"* · expected 2, **verbatim**:

> "The headers, in order, are **exactly**: Sales Representative, # Invoices, # Customers, Hrs Worked,
> Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin,
> Margin %, Subtotal."

**SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** — *"Expanded CSV:
file name, verbatim headers, one row per invoice"* · expected 2, **verbatim**:

> "The headers, in order, are **exactly**: Sales Representative, Date, Invoice #, Customer, Status,
> Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin,
> Margin, Margin %, Subtotal."

**No Location entry in either list**, and both say **"exactly"** — so a tester following ours, with
more than one location in scope, would mark the test **Failed** if a Location column appeared.

**Their refs (our stated source, verbatim from the case bodies):**

| Case | `refs` / spec_ref | Source document | Anchor | Date of that anchor |
|---|---|---|---|---|
| SBR-EXP-10 = C30285 | `SV-8631 (specs/sbr-sales-by-representative.md Story 14 **S14-R15**; **S14-R18**)` | SBR spec | S14-R15 (Summary CSV), S14-R18 (`# Invoices`/`# Customers`) | S14-R15's header list dates from the **2026-07-11** "Exports hardened" change |
| SBR-EXP-11 = C30286 | `SV-8631 (specs/sbr-sales-by-representative.md Story 14 **S14-R16**)` | SBR spec | S14-R16 (Expanded CSV) | same **2026-07-11** change |

**Neither case cites S14-R20** — the export requirement added on **2026-07-29**. That omission is
the whole story.

Both cases *were* touched on **2026-07-31** — ops 46 and 47 of that day's authorized push
(`build/report-suite/chris-answers-2026-07-31/testrail-execution-log-2026-07-31.md`) — but **only**
to apply Chris's Q5 rename (`Sales Rep` → `Sales Representative` on the first header). The header
**list** was not revisited.

### 2. What OUR OWN newer sources say

**(a) Chris's 2026-07-31 answers — they do NOT rule on this.** Read in full
(`build/report-suite/chris-answers-2026-07-31/answers-ingested.md`, 5 of 5 answers, all "A"): Q1 =
the Location **filter dropdown** is hidden for a one-location user · Q2 = one "too large to export"
message · Q3 = the 10,000-row cap applies to all six reports · Q4 = the unified reports permission ·
Q5 = the full word "Representative" everywhere. **None of the five touches the CSV column list.**
The word "Location" appears in that file only in Q1 (the filter control). **So the answers file is
NOT the source that settles this** — the briefing's expectation that it carries the export ruling is
not borne out; the export ruling lives in the **spec**, one day earlier.

**(b) The CURRENT SBR spec v15 DOES settle it — and it contradicts our two cases.** Two requirements
sit in the same live version:

**S14-R15** (the Summary CSV, our cited anchor) — **verbatim**:

> "**Summary CSV** — file `sales-by-representative-summary.csv`, UTF-8 BOM, one header row + one row
> per rep in the current filtered view, in the currently-active order (S14-R2a). Headers, in order:
> `Sales Rep`, `# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced`, `Inv. Hrs`,
> `Labor Invoiced`, `Labor Margin`, `Parts Invoiced`, `Parts Margin`, `Margin`, `Margin %`,
> `Subtotal`."

**S14-R20** (added **2026-07-29**, in v15) — **verbatim**:

> "**S14-R20: Location in exports.** Whenever the Location column is shown on screen (S21-R7), it is
> **included in all four exports in the same position it occupies on screen** — Summary and Expanded,
> PDF and CSV: a Summary (rolled-up) row carries the rep's location, reading **Multiple** when that
> rep spans more than one location; an Expanded (per-invoice) row carries that invoice's own exact
> location. In addition, every export … includes a "Locations:" line naming the location or locations
> the report is scoped to, or "All locations" when every location the user has access to is selected …
> in a CSV it appears as a leading metadata line above the column-header row."

And the **v15 change-log row, verbatim**:

> "2026-07-29 | @chris / @claude | Added a per-row **Location** column, shown only when the current
> view spans more than one location … **the column is carried into all four exports** and every
> export gains a "Locations:" line naming the scope (**S14-R20**) …"

The on-screen position is pinned by **S18-R13 / S21-R7** — *"a Location column is shown, positioned
immediately after the Status column and before Inv. Hrs"* (quoted in our own **SBR-LOC-05 =
[C38913](https://shopview.testrail.io/index.php?/cases/view/38913)** expected 1).

**Verdict on question 2: YES — our own newer source already requires those two cases to change,
entirely independently of Vladimir's case.** S14-R15/R16's header enumerations date from 2026-07-11;
S14-R20 was added 2026-07-29 and explicitly says the column is included **in all four exports at its
on-screen position**. Under **Rule 32 (latest wins)** the newer requirement governs, so the word
**"exactly"** in our two expected results is **stale** whenever more than one location is in scope.

**Corroboration from an independent pass:** the same gap was found, independently, by the coverage
re-derivation running in parallel this session —
`build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md` row 2 flags **SBR
S14-R20** as a **"Genuine gap"**, noting *"SBR-EXP-02 = C30277 expected 5 covers only the
`\"Locations:\"` line."* (That file belongs to the sibling worker and was read read-only; it may
still be in flux.) It flags the **same gap on three more reports** — PV **S6-R11**, TU **S7-R13**,
IV **S10-R15** — so this is a **suite-wide** shortfall, not an SBR one-off.

**Why we missed it:** the 2026-07-29 Location change was worked through
`build/report-suite/chris-answers-2026-07-31/DELTAS.md` **D11**, which authored **six new on-screen**
Location cases (SBC-LOC-04 = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912),
SBR-LOC-05 = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913), PV-FILT-14 =
[C38914](https://shopview.testrail.io/index.php?/cases/view/38914), TU-LOC-06 =
[C38915](https://shopview.testrail.io/index.php?/cases/view/38915), WIP-FLT-09 =
[C38916](https://shopview.testrail.io/index.php?/cases/view/38916), IV-LOC-06 =
[C38917](https://shopview.testrail.io/index.php?/cases/view/38917)) — and **never revisited the
EXPORT cases**. `S14-R20` appears nowhere in DELTAS.md.

### 3. What VLADIMIR's case asserts, and on what basis

From `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md`:

| Field | Value |
|---|---|
| Case | **[C38923](https://shopview.testrail.io/index.php?/cases/view/38923)** |
| Subject / title | *"SBR Summary and Expanded CSV exports carry the Location column at its designated slot"* (85 chars) |
| Section | Reports Suite › Sales By Representative Report › SBR — Exports |
| `refs` | **None** (all five of his cases carry no references) |
| Created | **Vladimir Tomovic, 2026-07-30 15:54 UTC** |
| Updated | **Vladimir Tomovic, 2026-07-30 17:41 UTC** |
| Template / type | 2 (Steps) / 7 (Other), Automation status **Automated** |
| Expected results | **none recorded** (steps only) |

**Which spec version was live when he authored?** SBR v15 has been live since
**2026-07-29T06:38:33Z** and was still v15 when we captured it on **2026-07-31**. He authored on
**2026-07-30 15:54** — **squarely inside the v15 window**. So **the spec he could have read is the
same v15 we are reading**, and v15 contains **S14-R20**, which says exactly what his title says.

**What can be established:** his assertion is **consistent with the current spec (S14-R20)**, it was
written **one day after** that requirement went live, and it sits in the **SBR — Exports** section it
belongs in. He is asserting the **spec's target behaviour**.

**What CANNOT be established without asking him:** his case carries **no `refs`**, so we cannot prove
*which* source he used. S14-R20, the v15 change-log row, a group message, the tech plan, a
conversation with Chris, or the shipped build could each explain it. **Per Rule 39 the honest label is
"basis consistent with SBR v15 S14-R20, not proven — ask Vladimir"**, and "unknown" would only be
acceptable after asking.

**One detail his case cannot settle for a manual tester:** S14-R20 pins the column's **position**
("the same position it occupies on screen" = after Status), but our two cases enumerate a **flat
header list**. Whoever updates ours must place Location **after Status** in the Expanded CSV, and at
the equivalent slot in the Summary CSV.

### 4. RECOMMENDATION

**Outcome (ii): our two cases need updating because of OUR OWN newer source** — SBR spec **v15
S14-R20** (2026-07-29), not because Vladimir said so. Per the user's ruling we **retain our sourced
position**; here, correctly applied, our *latest* source is the one that moves us.

**The precise edit — RECOMMENDED, NOT MADE** (`build/report-suite/**` is sibling-owned; any case
change needs the user's go-ahead, Rule 6):

1. **SBR-EXP-10 = C30285**, expected 2 — replace the closed *"are exactly: …"* list with a
   **scope-conditional** one: with a single location in scope the 13 headers exactly as today; **with
   more than one location in scope, a `Location` header additionally appears at the position the
   column occupies on screen** (after the rep identifier group, per S14-R20 + S18-R13). Add a
   precondition making the location scope explicit, and a plain tester line: *"If you are looking at
   only one location, there is no Location column — that is correct."*
2. **SBR-EXP-11 = C30286**, expected 2 — same change, with `Location` **immediately after `Status`**
   (S18-R13's on-screen slot).
3. Add to **both** the CSV metadata line already required by S14-R20 (*a leading `"Locations:"` line
   above the column-header row*) if it is not already covered for the CSVs by **SBR-EXP-02 =
   [C30277](https://shopview.testrail.io/index.php?/cases/view/30277)**.
4. **`refs` on both** must gain **S14-R20** alongside S14-R15/S14-R16 (Rule 20 — ticket + spec
   anchor).
5. **Do the same for the three sibling reports** the parallel coverage pass flagged — PV **S6-R11**,
   TU **S7-R13**, IV **S10-R15** — so the suite is consistent, not patched only where a foreign case
   happened to point.

**One item genuinely needs Chris (a spec-text defect, not a case decision):** v15 is **internally
inconsistent** — S14-R15/R16 enumerate header lists *"in order"* that S14-R20 then adds a column to,
without amending them. Ask him to amend S14-R15/R16 to mention the conditional Location column. This
does **not** block the case edit (S14-R20 is the newer text and wins under Rule 32), but it should be
on his spec-correction list with the other seven already tracked in `SPEC-WATCH-2026-07-28.md`.

**Live check still owed (Rule 22):** whether the build *today* emits the column is **unverified** —
the QA branch is not available to us. The cases should be written to the spec target (as always) and
VIU-confirmed when the branch exists.

**Nothing to raise with Vladimir as an error.** His C38923 is **new coverage that is consistent with
the current spec**, and it usefully exposed our stale enumeration. Worth telling him which anchor
(S14-R20) supports it so his case can carry a `refs` value — his choice, not our edit.

---

## PART 2 — Disagreement 2: is Location toggleable in the WIP Column Selection menu?

### What OUR case asserts, and its source

**WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)** — *"The Location
column is automatic and never reads Multiple on a work-order row"* · expected 4, **verbatim**:

> "Location is **NOT offered** in the column-selection control — its visibility follows the location
> scope automatically."

`refs`: `SV-8663 (WIP spec **v6 2026-07-29** S7-R13; S7-R14; S4-R3; S9-E1; §4 Location (column) —
automatic visibility; never "Multiple"; export header "Branch")`.

**The WIP spec v6 (live since 2026-07-29T06:33:58Z) says this in three separate places — verbatim:**

- **S4-R3:** *"Every other column (VIN, Last Activity, Labor Earned, Labor Remaining, Parts Earned,
  Parts Remaining, Inv. Hrs) is available in the column selector and off by default (Story 8). **The
  Location column is not offered in the column selector**; its visibility is automatic — shown only
  when more than one location is in scope (Story 7)."*
- **S7-R13:** *"The per-row **Location** column is shown automatically whenever the current scope
  spans more than one location, and is hidden whenever a single location is in scope; **the user does
  not toggle it in the column selector**."*
- **§3 Key Decision:** *"**The per-row Location column is automatic, not a manual toggle.** … Because
  a work order belongs to exactly one location, each WIP row names its own location — a WIP row never
  shows "Multiple"."*

**So our case is exactly, triply grounded in the CURRENT spec.** Note also **our own DELTAS.md D10**,
which reworked two further cases for this same change — **WIP-COL-01 =
[C30466](https://shopview.testrail.io/index.php?/cases/view/30466)** and **WIP-COL-02 =
[C30467](https://shopview.testrail.io/index.php?/cases/view/30467)** — so **three of our cases** now
say Location is not in the selector. Our side is internally consistent.

### What HIS case asserts, and on what basis

**[C38922](https://shopview.testrail.io/index.php?/cases/view/38922)** — *"**WIP CSV export gains the
Locations line while its column semantics stay exactly as shipped**"* · no `refs` · created **2026-07-30
15:54 UTC**, updated **17:41 UTC** · steps-only, **no expected results**. Its **step 3** reads
*"Toggle Location ON in the Column Selection menu and download again."*

**Which spec version was live when he authored?** **WIP v6**, live since **2026-07-29 06:33Z** and
still v6 on 2026-07-31 — so, as with SBR, **he authored inside the current-version window**. Unlike
SBR, though, **v6 contradicts his step**: v6 removed the toggle in three places.

**The most probable basis, from his own title:** *"…its column semantics stay **exactly as shipped**."*
That phrase points at the **SHIPPED BUILD**, not the spec target. And the shipped build plausibly
*does* have a toggle: our own WIP-FLT-09 note records it — *"WIP already HAD a Location column, but
spec v6 2026-07-29 changed it from a user-toggled column to an automatic, scope-driven one"*. His
automation would be describing **today's build**; our case describes **the v6 target**.

**What CANNOT be established without asking:** whether he read v6 at all, or deliberately pinned
current behaviour for a regression net. No `refs`, no expected results, so the intent is not
recoverable from the case. **Ask Vladimir.**

### What settles it

**Nothing on paper — this one needs the build**, and the resolution order still applies:

- **The spec (v6, 2026-07-29) is the newest authoritative PRODUCT source** and says **no toggle**.
  Under **Rules 32/33 our case stands as written**, and we **do not change it**.
- **If the build still ships a toggle**, both are "right" about different things: he documents
  as-shipped, we document the ratified target → the honest output is a **dev/spec-conformance
  finding** ("v6's auto-visibility change has not shipped yet"), for the QA lead and Vladimir to
  place, **not** an edit to either case.
- **A live check on the WIP Column Selection menu decides which world we are in** — one observation:
  is `Location` listed in the picker with more than one location in scope? We **cannot** run it (no
  QA branch, Rule 22 — access needed).

**Recommendation: outcome (i) — no change to our case**, plus **two asks**: (a) the WIP live check
when the branch exists, and (b) a question to Vladimir about his step-3 basis (as-shipped vs spec).
**We do not touch C38922** (Rule 38).

---

## SUMMARY TABLE

| # | Their case | Our case(s) | Our source (verbatim anchor) | Does OUR OWN newer source settle it? | Their establishable basis | Outcome |
|---|---|---|---|---|---|---|
| 1 | **C38923** — Location column in SBR Summary + Expanded CSVs | **SBR-EXP-10 = C30285**, **SBR-EXP-11 = C30286** ("headers … are **exactly**", no Location) | SBR v15 **S14-R15 / S14-R16** — but those lists date from **2026-07-11** | **YES.** SBR v15 **S14-R20** (2026-07-29): *"included in all four exports in the same position it occupies on screen"* → our "exactly" lists are stale | Authored **2026-07-30 15:54**, inside the **v15** window; assertion **matches S14-R20**; no `refs` → **basis consistent with v15, not proven — ask him** | **(ii) OUR cases need updating — because of OUR OWN newer source.** Recommended edit specified; **not made** (needs go-ahead). Also fix PV/TU/IV equivalents. Ask Chris to amend S14-R15/R16's lists |
| 2 | **C38922** step 3 — toggle Location in the WIP Column Selection menu | **WIP-FLT-09 = C38916** (+ **C30466**, **C30467**) | WIP v6 (2026-07-29) **S4-R3**, **S7-R13**, §3 Key Decision — *"not offered in the column selector"*, *"the user does not toggle it"* | **NO** — v6 is our newest source and it **backs our case** | Authored **2026-07-30 15:54**, inside the **v6** window; title says *"exactly as shipped"* → likely automating **today's build**, not the v6 target; no `refs` → **ask him** | **(i) No change to ours.** Needs a **live check** of the WIP picker; if the build still toggles, it is a **spec-conformance finding**, not a case edit |

## OUTSTANDING — what I need from you

1. **Go-ahead to edit SBR-EXP-10 = C30285 and SBR-EXP-11 = C30286** (and the PV/TU/IV export
   equivalents) for the S14-R20 Location column. *Blocks:* until then two cases would make a tester
   fail a correct build, and four reports' export coverage stays short of the current spec. *Since:*
   2026-07-31.
2. **A live check on the Report Suite QA branch** — (a) do the SBR CSVs carry a Location column, and
   (b) is Location listed in the WIP Column Selection menu? *Owed by:* you / the dev team (env +
   fresh cookies + flag state). *Blocks:* nothing in this document is live-verified (Rule 12), and
   disagreement 2 cannot be closed without it. *Since:* 2026-07-31.
3. **One question to Vladimir Tomovic** — what source did he base **C38922 step 3** on: the shipped
   build, or a spec version? *Blocks:* Rule 39 requires the other author's basis to be established,
   and "unknown" is only acceptable after asking. *Since:* 2026-07-31.
4. **One spec correction from Chris Ward** — SBR v15 **S14-R15/R16** still enumerate CSV headers
   *"in order"* without the conditional Location column that **S14-R20** adds. *Blocks:* nothing (the
   newer text wins), but it will keep re-generating this same confusion. Add to the seven corrections
   already tracked in `SPEC-WATCH-2026-07-28.md`. *Since:* 2026-07-31.
