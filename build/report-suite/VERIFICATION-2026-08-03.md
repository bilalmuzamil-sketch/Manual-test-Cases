# Report Suite — INDEPENDENT VERIFICATION working paper, 2026-08-03

**Who wrote this.** Not the pass that did the work. This is the adversarial re-derivation of
`NON-VIU-CLOSEOUT-2026-08-03.md`, written to try to **disprove** it. Every number below is
**mine**, produced by my own script against the primary source, never copied from the closeout.
Where I could not verify something I wrote **NOT VERIFIED** and said why (Standing Rule 12).

**Why this document exists.** Today we learned that a coverage verdict which certifies itself is
worthless: a pass wrote *"checked, provably fine"* over a requirement it had verified only half of,
and an outside automation engineer found the defect instead. So the report is written by a second
pair of eyes and the working is published so the figures are auditable.

**Access used — READ ONLY.** TestRail `get_cases` / `get_sections` / `get_case` / `get_user` /
`get_run` / `get_tests` / `get_results_for_run`. Atlassian MCP `searchConfluenceUsingCql` /
`searchJiraIssuesUsingJql`. **Zero writes of any kind** — no `add_*`, no `update_*`, no
`delete_*`, no Jira comment, no case edit. Verified by the write-audit in §14.

**Stability gate (Step 0).** `NON-VIU-CLOSEOUT-2026-08-03.md` md5
`94295057e0fc4783984ac6a26001773c` at **17:45:37Z** and **unchanged at 17:58:30Z** (a 13-minute
gap, well over the required 60 s). `PO-Questions-Chris-ReportSuite-2026-08-03.md` md5
`a52a541fef99ccfac44fce7989b34b31`, `chris-answers-2026-08-01/testrail-execution-log-CD-2026-08-03.md`
md5 `dc9c3eb1606a0d7417ef98c18a8d57ec`, both stable; `git status --porcelain build/report-suite`
clean. Only then did I write anything.

**Scripts** (all read-only, copies in `verification-scripts-2026-08-03/`):
`pull.mjs` · `tree.mjs` · `refs.py` · `refs2.py` · `cov.py` · `covfull.py` · `sbs.py` ·
`sbs25.py` · `expcheck.py` · `perm.py` · `r42.py` · `r42b.py` · `contra.py` · `run2.mjs`.

---

## 1 · THE FOUR RECONCILING COUNTS — **PASS**

Not just counts: **exact set equality, checked in both directions.**

| Population | My figure | Method |
|---|---|---|
| **Live in TestRail under group 4281, ours only** | **475** | `get_sections/1&suite_id=1` (625 sections) → 96 sections under 4281 → `get_cases` → filter `created_by == 3` |
| **Local case source (`cases/*.json`)** | **475** active (532 objects − 57 Retired) | 26 files walked |
| **`testrail-id-map.csv`** | **475** rows, **0** blank C-ids | columns `internal_id, testrail_case_id, title, section` |
| **Import data rows** | **475** | `testrail-import/report-suite-v1-testrail-import.csv` |

```
live ours: 475   id-map: 475
in id-map NOT live: []        live NOT in id-map: []
local active internal ids: 475   id-map internal: 475
local NOT in map: []          map NOT in local: []
import titles not live: 0     dup import titles: 0
```

**Per report:** SBC 84 · SBR 111 · PV 71 · TU 60 · WIP 79 · IV 70 = **475**. The six split
import files carry exactly those counts.

**Foreign cases — resolved live, not assumed.** Live total under 4281 = **480**;
`created_by` counts `{1: 5, 3: 475}`. `get_user/1` → **Vladimir Tomovic
(vladimir.tomovic@shopview.com)**; `get_user/3` → **Bilal Muzamil**. His five are **C38919,
C38920, C38921, C38922, C38923**, every one `created_on` **and** `updated_on` = **2026-07-30
17:41 by user 1** — so **untouched by us at any point today** (Rule 38 satisfied, verified rather
than asserted). Honest reporting figure: **ours 475 / live total 480**.

---

## 2 · TRACEABILITY, RULE 20 — **PASS (475/475), counted by me**

Pulled `refs` live for all 475 and validated each anchor against the spec body of **its own
report** (the weaker union-of-all-specs check would have hidden a cross-report mis-citation).

| Check | My figure |
|---|---|
| Active cases checked | **475** |
| `refs` empty | **0** |
| No Jira ticket key | **0** |
| No spec anchor token | **0** |
| **Anchor that does NOT resolve in its OWN report's spec text** | **0** |
| Distinct anchors cited | **880** (131 cited by more than one case) |
| Distinct tickets cited | **84** |
| `refs` citing an OBSOLETE story (SV-8583…SV-8588) | **0** |

**FINDING V-1 (stale figure in the closeout).** The closeout states *"SV-8589 is cited by 6
cases"*. Live it is cited by **2** cases — **C38924 (PV-PREC-01)** and **C38925 (PV-PREC-02)** —
in **3** textual occurrences. Harmless to authenticity; recorded because we caught three stale
figures in our own papers today and must not add a fourth.

Only ticket cited outside the SV-8583…SV-8679 epic range is **SV-8780**, verified live (§12).

---

## 3 · COVERAGE — **PASS, re-derived; 2 rows the closeout's extractor missed**

Re-derived from the **current spec bodies** and the **live case source**, both directions. My
anchor extractor is deliberately more tolerant than the closeout's: it accepts the parenthetical
form `**S8-R7 (asset label — primary):**` that the closeout says defeated its own regex.

| Measure | My figure | Closeout figure |
|---|---|---|
| Distinct anchors appearing anywhere in the six specs | **894** | ~895 |
| Definition bullets extracted | **889** | 856 |
| **requirement → case: uncovered** | **9** | 7 |
| **case → requirement: anchors with no definition bullet** | **0** | 31 (all self-diagnosed artefacts) |
| **Changed requirements** (from the six `*-raw-unified.diff` files) uncovered | **0 of 59** | — |
| Changed **and** multi-surface uncovered | **0 of 19** | — |

**The 9 uncovered.** Seven are the closeout's explained set and I agree with each verdict:
**SBC S10-N1** · **SBC S20-N1** · **SBR S11-N1** · **SBR S14-R14** · **PV S3-R1** · **PV S4-N1**
· **PV S7-R7** (no-op assertions, un-measurable px tiers, an un-seedable stored-schema state, a
pointer, and a statement about the document).

**FINDING V-2 — two rows the closeout did not list.**
**SBC `S14-R4` (Summary contents)** and **SBC `S15-R4` (Summary contents)** — exactly the
parenthetical-heading form its extractor admits it missed.

*Are they real gaps?* **No.** Side by side:

> **S14-R4 (verbatim):** *"The Summary CSV has one row per customer and no asset or invoice
> rows. Its columns, in this exact order, are: Customer, Inv. Hrs, Labor Invoiced, …"*
>
> **C38856 (SBC-EXP-16) expected 2:** *"Each Summary file gives ONE row per customer, without the
> asset or invoice detail rows."*
> **C38856 expected 5:** *"With a single location in scope the Summary files have these ten
> columns in this exact order: Customer, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced,
> Parts Margin, Shop Supplies, Margin, Margin %, Subtotal — no Asset, Invoice # or Date columns."*

> **S15-R4 (verbatim):** *"The Summary PDF body table has one row per customer and no asset or
> invoice rows."* → same C38856 expected 2, which covers **both** Summary files.

**So the substance is covered — but the traceability is not machine-resolvable.** C38856's
`refs` write the anchors in slash shorthand — `S14-R1/R2/R4` and `S15-R1/R2/R4/R5` — which hides
**5 anchors** (`S14-R2`, `S14-R4`, `S15-R2`, `S15-R4`, `S15-R5`) from any anchor-based tool. It is
the **only** case in the suite that does this. **Consequence:** if `S14-R4` or `S15-R4` changes,
the same-anchor re-check that Rule 42(a) exists to enable would not surface C38856.

**Side-by-side substantiation (Rule 45(e)).** `sbs25.py` produced quoted requirement text beside
quoted expected-result text for **30 requirements across all six specs**, weighted to changed,
multi-surface and multi-cited anchors: SBC `S4-R13 S4-R12 S8-R7 S14-R15 S15-R14` · SBR `S14-R20
S21-R7 S18-R13 S17-R3 S14-N3` · PV `S6-R11 S2-R12 S3-R10 S3-R5 S5-R4a S1-R4` · TU `S7-R13 S9-R9
S9-R10 S8-R15 S10-R4` · WIP `S7-R13 S7-R14 S4-R3 S10-R5a` · IV `S10-R15 S7-R6 S7-R7 S12-R10
S3-R1`. **Unsubstantiated rows: 0.** Full output: `SIDE-BY-SIDE-2026-08-03.md`.

---

## 4 · THE LOCATION-COLUMN CLASS OF DEFECT — **PASS on coverage; FINDING on traceability**

This is the one that bit us, so I did not read their table. I swept **all 71 cases in an
Export/Download section** for a column enumeration with no Location/Branch mention.

**Result: 1 hit, and it is correct.** `C30293 (SBR-ASGN-02)` enumerates *"headers, in order, are
exactly: Customer Name, Sales Representative, Rep is active?"* — and that is right: **SBR
`S15-R4`** specifies exactly those three for the **Sales Rep Assignments** CSV, while `S14-R20`
governs the **report's** four exports, not this one.

**Per report, the export-surface assertion, quoted:**

| Report | Anchor | Where the export assertion lives, verbatim |
|---|---|---|
| **SBR** | `S14-R20` | **C30285 (SBR-EXP-10) exp 7:** *"When more than one location is in scope the file also carries a Location column…"* · **C30286 (SBR-EXP-11) exp 5:** *"…carries a Location column immediately after Status — the position it holds on screen…"* · **C30278 exp 3** · **C30279 exp 2** · **C38913 exp 9** |
| **SBC** | `S4-R13` | **C38912 exp 8:** *"Every one of the four downloads also contains the Location column, in the same position it holds on screen…"* · **C30161 exp 1** (Expanded CSV, *"making fourteen"*) · **C30169 exp 1** · **C38856 exp 5** |
| **PV** | `S6-R11` | **C38914 exp 7:** *"Both downloads include the Location column in the same position it holds on screen (leftmost, before Type)…"* |
| **TU** | `S7-R13` | **C38915 exp 9:** *"Every download — both PDF views and the CSV — includes the Location column in its on-screen leftmost position…"* |
| **IV** | `S10-R15` | **C38917 exp 7:** *"Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty on Hand)…"* |
| **WIP** | `S7-R13` | **C38916 exp 6:** *"In both downloads the column is headed "Branch" (a known naming difference from the screen — do not raise it as a bug)."* + **C30516 (WIP-EXP-07)** |

**The defect class is closed. No report is screen-only.** And SBR's two CSV cases are now
**scope-conditional** — *"With a single location in scope the headers, in order, are exactly: …"*
— which is the Rule 42(b) form, not a closed list.

**FINDING V-3 — the same mechanism that caused the original defect is still live.**
`S14-R20`-class requirements make **two** assertions: the per-row **column** *and* a
`"Locations:"` metadata **line**. All six reports do assert the line — but **6 of the 7 cases
carrying that assertion do not cite the governing export anchor**:

| Case | Needs | Cited? | What its `refs` says instead |
|---|---|---|---|
| **C30167** (SBC-EXP-09) | `S4-R13` | **NO** | `S15-R7…R11` |
| **C30277** (SBR-EXP-02) | `S14-R20` | **NO** | *"+ Locations: line in every export per Chris…"* |
| **C30376** (PV-EXP-02) | `S6-R11` | **NO** | *"+ Locations: line in every CSV/PDF export per Chris Ward group…"* |
| **C30437** (TU-EXP-04) | `S7-R13` | **NO** | `S7-R8…S9-R8` |
| **C30511** (WIP-EXP-02) | `S7-R13` | **NO** | `S9-R2…S9-R10a` |
| **C30588** (IV-EXP-02) | `S10-R15` | **NO** | `S10-R3…S10-R6` |
| C30161 (SBC-EXP-03) | `S4-R13` | **YES** | — |

The assertions are present; the **anchor link is not**. A future edit to `S14-R20`, `S6-R11`,
`S7-R13`, `S10-R15` or `S4-R13` would re-check only the Location-filter case and **miss these
six** — precisely how `S14-R20` slipped past us on 2026-07-29. This is a staged fix, not a
coverage gap.

---

## 5 · RULE 42, ABSOLUTE ENUMERATIONS — **FAIL. The closeout has no Rule 42 check at all.**

Grepped every active case's title/preconditions/steps/expected for `exactly`, `only these`,
`no other`, `the complete list`, `in order are`. My first pass matched 73 cases; most were
adverbial (*"appears exactly once"*), so I narrowed to genuine **closed lists**.

| Measure | My figure |
|---|---|
| Genuine closed-list / verbatim-bounded-string cases | **34** |
| **Of those, `refs` carries NO version-pinned anchor** | **27** |
| Neither pinned nor scope-conditional | **26** |
| Of the 27, true bounded-set or verbatim-UI-string enumerations | **~17** |

Rule 42(a) requires `<TICKET(S)> (<spec-anchor>, spec v<N> <date>)`. The Location work does this
well (*"SBR spec v15 2026-07-29"*, *"Confluence 577634305 v-2026-07-31"*). These do not:

| Case | Internal | The closed list | `refs` version |
|---|---|---|---|
| **C30330** | PV-FILT-03 | *"The options are exactly: Today, Yesterday, … "* (**eleven**) | none — `specs/parts-velocity.md S2-R2` |
| **C30328** | PV-FILT-01 | *"offers exactly three choices: Both, Inventory, Special Order"* | none |
| **C30375** | PV-EXP-01 | *"the menu holds exactly two items, in this order…"* | none — `S6-R1` |
| **C30346** | PV-ROW-06 | *"Units Sold shows exactly: "Units taken out of inventory stock…""* | none — `S3-R6` |
| **C30338** | PV-FILT-11 | *"the empty-state label reads exactly: "Empty bays…""* | none |
| **C30384** | PV-EXP-10 | *"the failure toast reads exactly: "Failed to export velocity report (csv)""* | none |
| **C30107** | SBC-TYPE-02 | *"offers exactly three options, in this order…"* | none |
| **C30159** | SBC-EXP-01 | *"the menu holds exactly the four download items"* | none |
| **C30293** | SBR-ASGN-02 | *"headers, in order, are exactly: Customer Name, …"* | none |
| **C30276** | SBR-EXP-01 | *"the menu lists exactly four actions…"* | none |
| **C30208** | SBR-STAT-01 | *"offers exactly four options…"* | none |
| **C30206** | SBR-TYPE-02 | *"offers exactly three options…"* | none |
| **C30290** | SBR-EXP-15 | *"an error toast reads exactly: "This report is too large…""* | none |
| **C30239** | SBR-TOT-03 | *"…the grand Subtotal on the right (no other metrics)"* | none |
| **C30441** | TU-EXP-08 | *"a success notification reads exactly: "Download started""* | none |
| **C30399** | TU-NAV-08 | *"the data area shows exactly: "Empty bays, endless possibilities…""* | none |
| **C30451** | WIP-TAB-01 | *"the browser page title is exactly "Work In Progress - Report | ShopView""* | none |

**Why this matters, plainly:** `SBR-EXP-10`/`11` broke because a closed header list had no
version-pinned link to the requirement that later changed. **That exact condition still holds on
~17 cases.** Each is either correct-and-should-be-pinned, or should be reworded
scope-conditionally. This is a **staged remediation for the QA lead's authorisation**, not
something I fixed.

---

## 6 · CROSS-CASE CONTRADICTIONS — **PASS: exactly 1, and it is disclosed**

My own sweep (`contra.py`): grouped all 475 by `(report, refs anchor)` → **131 same-anchor
clusters with more than one case**; ran sentence-level polarity conflict detection on shared
control nouns; filtered to high-value controls (Location, Column, Totals, Status, Permission,
Multiple, Summary, Expanded, Subtotal, Branch, Selector, Reports, Menu, Filter).

**8 candidates raised, all 8 false positives on inspection** — every pair is simultaneously
true, e.g. *"a Location column is shown"* **and** *"Location is NOT offered in the column
selector"*. Also checked title-vs-expected on all 475 and field completeness: **0 unnumbered
steps, 0 unnumbered expected, 0 empty preconditions/steps/expected**.

**The one real contradiction — confirmed independently, all three cite `PV S1-R4`:**

> **C30325 (PV-PERM-01) exp 3:** *"for now ONE ordinary reports access opens all six of these new
> reports; **none of them has a permission of its own**."*
>
> **C30327 (PV-PERM-03) pre 2:** *"That user's role does NOT have the **Inventory Reports → View**
> permission."* exp 3: *"The export is likewise denied."*
>
> **C30391 (PV-API-04) exp 3:** *"Both loading and exporting are gated by the same **Inventory
> Reports → View** permission."*

They cannot both be true, and C30327's premise state cannot be produced under one permission.
The closeout discloses this openly as deliberately held (group E). **I confirm: exactly 1
unresolved contradiction, correctly declared.**

**Honest limit of my method:** the polarity heuristic did **not** flag this pair — it turns on a
*permission name*, not a shown/hidden polarity word. I found it via the §7 permission sweep. Any
future contradiction sweep needs a named-entity pass as well as a polarity pass.

---

## 7 · THE ONE-PERMISSION RULING — **PASS: exactly 2 remain, both named and held**

Swept all 475 myself for per-area permission phrasings.

| Measure | My figure |
|---|---|
| Cases still asserting a per-area report permission | **2** — **C30327 (PV-PERM-03)**, **C30391 (PV-API-04)** |
| Cases using the new *"ordinary reports access"* wording | **11** |
| Cases mentioning permission at all | **11** + C30100 (invoice-level, unrelated) |

The 11: C30096 · C30098 · C30099 · C39447 (SBC) · C30322 · C30325 (PV) · C30392 (TU) · C30451 ·
C30526 (WIP) · C30534 · C30603 (IV).

**FINDING V-4 (stale figure).** The closeout says *"all **12** permission cases say 'the ordinary
reports access'"*. Live count is **11**.

**FINDING V-5 (overstated).** The closeout's blocked-on-Chris item 3 says *"The **5** non-SBC
descriptions still name a per-area report permission"*. Reading the five current spec bodies:

| Spec | What it actually says | Names a per-area permission? |
|---|---|---|
| **SBR** | `S1-N1`: *"If the user lacks permission to access **Reports**…"*; `S14-N3`/`S15-N1`: *"Reports-section access"* | **NO — generic reports access only** |
| **PV** | `S1-R4`: *"…require the **Inventory Reports → View** permission."* | **YES, concretely** |
| **IV** | Story 1: *"…the existing **inventory-reports** permission — it adds no new permission."* | **YES, concretely** |
| **TU** | Story 1: *"the same permission that controls the existing Timesheet Activities report — **this report adds no new permission**."* | vaguely, and explicitly adds none |
| **WIP** | Story 1 + note: *"reuses **one existing** reporting permission; it does not add a new one."* | vaguely, and explicitly adds none |

So it is **at most 4, concretely 2 (PV and IV)** — and **SBR is already consistent** with the
ruling, which is why SBR needed no rewording. The Chris sheet should ask about PV and IV, not
about five reports. *(Corroborated: the group C/D execution log itself quotes only four
prerequisites — PV, IV, TU, WIP — never SBR.)*

---

## 8 · TITLES — **PASS, measured live**

`max(len(title))` over the 475 live titles = **80**. **Over 80: 0.** The eight at exactly 80 are
C38914, C30414, C30406, C30320, C30316, C30281, C30198, C30181.

---

## 9 · RUN 359 — **PASS, and one nuance the closeout omits**

| Check | My figure |
|---|---|
| `get_run/359` | *Reports Suite - Nebojsa/Viktoria (VIU Pending)* · `is_completed: false` · **`include_all: false`** |
| Tests in run | **475** (475 distinct `case_id`) |
| Our active cases **not** in the run | **0** |
| Run tests **not** in our active set | **0** |
| Set equality `ours == run` | **True** |
| Foreign cases sitting in the run | **0** |
| Result records | **539** |
| Result ids in the pre-write snapshot but missing now | **0** (539 before → 539 now) |

**Nuance V-6.** `get_run` reports **untested 475 / passed 0 / failed 0 / blocked 0 / retest 0**,
and the 539 records break down `status_id 3 (Untested) × 458` + `None × 81`. So the run holds
**zero graded verdicts**. Both statements in circulation are half-right: the staged plan's *"0
results"* was wrong about *records*, the closeout's *"539 results"* is right about records but
should say plainly that **nothing gradeable was ever at risk**. `include_all: false` means the
union procedure stays mandatory on every future `add_case` (Rules 34/47).

---

## 10 · SENSE + LAYMAN-RUNNABILITY — **PARTIAL PASS, 1 sample finding promoted to a population figure**

Deterministic cold-read sample (seed `20260803`), **4 cases per report = 24**, scored against the
7 fail conditions: C30555 C30569 C30608 C30584 · C30331 C30361 C30370 C30365 · C30139 C30124
C30107 C30117 · C30226 C30321 C30285 C30282 · C30416 C30431 C30433 C30448 · C30453 C30526 C30532
C30468.

**NONSENSE: 0.** **FIX-WORDING: 1** — **C30448 (TU-VIS-02)**:

> step 3: *"**Measure the information icon's contrast** against its background in dark mode, then
> in light mode."* · expected 2: *"The information icon meets at least a **3:1 contrast ratio**
> against its background in BOTH light and dark mode."*

A non-technical manual tester cannot execute that: **no tool and no method is named.** Fail
condition *"not actionable — a tester can't tell what to DO"*, and Rule 28 dimension 3.

**FINDING V-7 — promoted from sample to population.** Swept all 475 for contrast-ratio / WCAG
assertions: **3 cases**, and **none** names a measuring method:

| Case | Internal | Report |
|---|---|---|
| **C30387** | PV-VIS-03 | Parts Velocity |
| **C30309** | SBR-VIS-05 | Sales By Representative |
| **C30448** | TU-VIS-02 | Technician Utilization |

That is 3 of 475 = **0.63%** — small, but it contradicts the closeout's unqualified *"Dimension 3
DONE … plain numbered wording throughout"*.

**FINDING V-8 — Rule 4 placement, both directions.** The closeout checks that the 30 cases *in*
API sections belong there (true). It does not check the **inverse**. Sweeping for API content in
UI sections, after discarding false positives (dollar `$400`, font-weight `400`, the 366-day
span), **2 genuine hits**, both requiring the tester to read network traffic:

- **C30419 (TU-DAY-02)**, section *TU — Per-Day Breakdown* — pre 2: *"**Browser devtools (network
  tab)** are open for the on-demand check"*; exp 2: *"The day rows are fetched ON EXPAND … not
  shipped with the initial report payload."*
- **C30424 (TU-TECH-02)**, section *TU — Technician Filter* — pre 2: *"**Browser devtools (network
  tab)** are open"*; exp 3: *"NO reload happens … does not re-query the server."*

Both are explicit back-end request checks in UI-titled sections, and both are also a
layman-runnability concern.

---

## 11 · RULE 46 DELIBERATE-DECISIONS REGISTER — **FAIL (stale)**

`coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md` **exists** and is genuinely good:
7 categories (A–G), 35 entries, per-entry ruling / verbatim date / overridden spec text / cases
with C-ids and links / risk, and an honest *"HIGH does not mean we are wrong"* preamble. Rule 46's
six fields are present.

**But it is a day out of date, and the closeout confirms it was not updated** (*"Today adds four
entries, all already written into today's papers rather than left implicit"*):

| Staleness | Evidence |
|---|---|
| Headline says **"474 active cases"** | live is **475**; `'475' in text` → **False**, `'474'` → **True** |
| **C39447** (SBC-PERM-05, created today) absent | `'39447' in text` → **False** |
| Entry **B4** lists only C30098, C30099, C30096 | C39447 is now a fourth case on the same ruling |
| Entry **D5** says *"PV/IV permission cases still name the inventory-reports permission"* | **C30603 (IV-PERM-01) was reworded today** — only PV's two still do |
| No entry for the **held contradiction** C30327 / C30391 | it is the suite's only unresolved contradiction |
| The QA lead's 2026-08-03 *"ONE permission FOR NOW"* ruling is not recorded | it is the ruling four cases now follow |

**FINDING V-9 — the register's own HIGH-risk statement is now wrong, in our favour.** Entry B4
reads: *"**The mitigation (the dev ticket) is not yet filed** — that is a real gap, not an
explanation."* Verified live: **SV-8780** *"SBC report gated by its own permission"* **exists**,
parent **SV-8598**, status **Ready to Fix**, updated **2026-08-02**. The ticket **is** filed. The
QA lead must not be told a gap exists that has been closed.

---

## 12 · SOURCE CURRENCY, RULE 31 — **5 CURRENT · SBC STALE · full SBC delta NOT VERIFIED**

Live CQL on all six page ids (`searchConfluenceUsingCql`, `id in (...)`):

| Spec | pageId | **Live lastModified** | We hold | Verdict |
|---|---|---|---|---|
| SBR | 585629698 | **Jul 29, 2026** | v15 (2026-07-29) | **CURRENT** |
| PV | 620888066 | **Jul 29, 2026** | v4 (2026-07-29) | **CURRENT** |
| TU | 641400833 | **Jul 29, 2026** | v5 (2026-07-29) | **CURRENT** |
| WIP | 703660034 | **Jul 29, 2026** | v6 (2026-07-29) | **CURRENT** |
| IV | 720142338 | **Jul 29, 2026** | v3 (2026-07-29) | **CURRENT** |
| **SBC** | **577634305** | **Jul 31, 2026** | **v12 (2026-07-29)** | **STALE — what we hold is 2 days behind** |

**What I positively established about the SBC drift** (CQL phrase probes, page-early region):

- **GONE live:** *"gated by a dedicated Sales By Customer report View"* → `totalCount: 0`
- **GONE live:** *"User has the Sales By Customer report View permission"* (the Story-1
  **Prerequisite** line, L118) → `totalCount: 0`
- **PRESENT live:** *"not by a report-specific permission"* → `totalCount: 1`
- **PRESENT live:** *"ordinary reports access"* → `totalCount: 1`

So the Jul-31 edit changed **at least two places** (the Prerequisite line and `S1-R2`), and the
new live wording is **the wording our reworded cases use** — C30098 / C30099 / C39447 are
grounded in the live text, not invented. Our two local mirrors
(`specs/sbc-sales-by-customer.md`, `spec-current-2026-07-31/Sales-By-Customer-Report-current.md`)
both still carry the abolished text at L125.

**NOT VERIFIED — and I will not pretend otherwise.** I could **not enumerate the full Jul-31 SBC
delta**, because: (a) the capture pipeline needs `/tmp/fd-tickets/all-cookie-header.txt`, which is
gone (ephemeral `/tmp`), and `html2text` is not installed; and (b) **CQL phrase search does not
index deep into these long pages.** I proved (b) with a control rather than guessing: a phrase at
**L155** of the *unchanged* SBR page was **found**, one at **L559** of SBC was **found**, but
phrases at **L705 (SBR)** and **L777 (SBC)** were **not** — on a page we know did not change. **I
nearly reported a phantom `S20-R19` change on that artefact.** Consequence for the QA lead: **any
SBC requirement below roughly line 560 may have moved on Jul 31 and we would not know** — which
also means the SBC-related SPEC-WATCH verdicts (items 1a, 2, 3, 10), all derived from the Jul-29
capture, are **unconfirmed**.

**Epic SV-8582 — Rule 37 Tier 1, counted two independent ways:**

| Check | My figure |
|---|---|
| `parent = SV-8582` | **97** |
| `"Epic Link" = SV-8582` | **97** |
| Key span | **SV-8583 → SV-8679**, contiguous, **0 gaps** |
| Statuses | **90 Open · 6 OBSOLETE · 1 In Progress** |
| Subtasks across all 97 stories | **1** — SV-8780 only |

**Beyond the closeout — what the 6 OBSOLETE stories actually are.** The closeout verifies that no
`refs` cites them. I went further and read them: they are the **six original per-report
placeholder stories** — *Technician Utilization Report* (SV-8583), *Sales By Customer Report*
(8584), *Sales By Representative Report* (8585), *Inventory Velocity Report* (8586, the old Parts
Velocity name), *Inventory Value Report* (8587), *WIP Report* (8588) — each `resolution: Done`,
each pointing at the same spec page, **superseded by the granular `[Reports Suite][Bn]` stories
our cases do cite.** So **OBSOLETE here means "replaced by a finer breakdown", not "scope
dropped"** — no functional coverage rides on them. That is the answer to the obvious challenge,
and it is stronger than a refs count.

**Other sources:** tech plan `tech-plan-2026-07-29/` — reconciled, **CURRENT**. Videos (2026-07-30
Loom + PRD companion) — ingested, ruled authoritative, **CURRENT**. Designs — **none exist**;
`ls build/report-suite/*/PENDING-FIGMA-FETCH.md` → no file, so **no Rule-35 queue is open, N/A**.
The build — **ABSENT** (§13).

---

## 13 · DELIVERABLE INTEGRITY — **PASS, including a check the closeout did not run**

| Check | My figure |
|---|---|
| Import header vs peers | md5 `cccad4693ccc2fae0d2c20fd7fe3c9ab` — **identical** for Report Suite, Filters **and** Simple Flow (3/3) |
| VIU / feature-flag words in the import | **0** |
| Duplicate live titles | **0** |
| Split files | 84+111+71+60+79+70 = **475** |
| **Internal-ID leaks in tester-facing columns**, all 7 import files | **0** |
| Internal IDs in the References column | **0** |
| Cases in API-titled sections | **30** |
| `viu_status` distribution (local) | **VIU-Pending × 475** |

**The check the closeout did not run — local-vs-live BODY equality.** Counts reconciling four ways
says nothing about *text*. I compared all 475 local bodies against live, field by field:

```
title 0 · steps 0 · refs 0 · preconds 3 · expected 7   (9 distinct cases)
```

**Verdict: benign, and I verified the mechanism rather than assuming it.** Every one of the 9
differences is an **internal case-ID cross-reference that exists locally and is correctly stripped
before TestRail** — e.g. C30323 local *"(see PV-PERM-01)"* → live *""*; C30194 *"(see
SBC-EXP-14)"*; C30226 *"(as seeded for SBR-STAT-02)"*; C30374 *"(, see PV-CALC-07)"*; C30391,
C30272, C30320, C30345, C30347 likewise. Similarity 0.91–0.98 in every case. **Live is clean, and
so are all 7 import files (0 leaks).** The generator strips them by design — Rule 20's rule that
tester-facing text carries no internal IDs.

---

## 14 · WRITE AUDIT — the execution log is honest, verified live

| Claim | My live verification |
|---|---|
| 10 group C/D `update_case`, all 200 | All 10 show `updated_on = 2026-08-03 17:40`, `updated_by = 3`: C30325 C30603 C30604 C30398 C30526 C30527 C30322 C30534 C30392 C30451 |
| 4 earlier writes | C30096 C30098 C30099 C39447 — `2026-08-03 17:25`, `updated_by = 3` |
| **Group E NOT executed** | **C30327 `updated_on = 2026-07-30 16:19` · C30391 `2026-07-30 16:18`** — untouched |
| Foreign cases untouched | all 5 `updated_on = 2026-07-30 17:41`, `updated_by = 1` |
| **Any unclaimed write today?** | **0** — no case under 4281 was updated on 2026-08-03 outside the declared op lists |

**My own writes: none.** I performed only `get_*` calls throughout.

---

## 15 · WHAT I COULD NOT VERIFY

1. **The full extent of the SBC Jul-31 spec delta** — §12. Needs fresh Confluence session cookies
   (or `html2text` + the REST capture) to re-run the capture pipeline. Two changes positively
   established; anything below ~line 560 unknown.
2. **Anything about the running build** — there is no Report Suite QA branch and there never has
   been. **Not one of the 475 cases has been observed against real software** (§16).
3. **The 2026-07-28 usefulness audit's 100% scoring** — that pass predates me; I re-derived
   sense on a 24-case sample and traceability/coverage on the full population, not usefulness
   verdicts on all 475.
4. **Whether the Chris sheet was actually sent** — it is READY on disk; sending is outside my
   read-only remit.

---

## 16 · THE LINE THAT MUST NOT BE BLURRED

This working paper substantiates **AUTHENTICITY**: every case traces to a live ticket and a live
spec anchor, the anchors resolve, the coverage is complete in both directions, the suite does not
contradict itself except in one declared place, and the deliverables reconcile exactly.

It substantiates **NOTHING about BUILD-CONFORMANCE**. `viu_status` is `VIU-Pending` on **475/475**;
run 359 holds **zero graded verdicts**; every label, position and calculation rests on *"the
description says so"*, never *"the build shows it"* (Standing Rules 12/22). A reviewer who says
*"none of this has been tested"* is **correct**, and that is the honest headline, not a footnote.
