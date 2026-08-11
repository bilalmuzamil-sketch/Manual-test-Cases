# Report Suite — Rule-43 coverage re-derivation, 2026-08-11

**Re-derived from the live specification bodies and the live case suite. Not patched from a
previous matrix** — patching last version's matrix preserves last version's blind spots.

## Totals, reconciled

The diff found **32 changed regions** across the five specifications that moved. **5 are Change Log
entries** (a record of the edit, not a requirement), leaving **27 substantive regions**, which
group into **14 requirement-level deltas**:

| Report | Regions | Changelog | Requirement deltas |
|---|---|---|---|
| Sales By Customer | 11 | 1 | **7** (6 changed + 1 added) |
| Sales By Representative | 6 | 1 | **1** |
| Parts Velocity | 8 | 1 | **2** (1 changed + 1 added) |
| Technician Utilization | 0 | 0 | **0** |
| Work In Progress | 2 | 1 | **3** |
| Inventory Value | 5 | 1 | **1** |
| **Total** | **32** | **5** | **14** |

**Every one of the 14 has a verdict below. 0 requirements disappeared** in any of the five diffs.

### A correction to how the deltas were attributed

The anchor-span method slices the body from each anchor to the next, and that span often belongs to
a **different** requirement — a rule that cross-references an anchor sits inside that anchor's span.
Two attributions in the previous pass's `STALE-ANCHORS.md` are wrong as a result, and the
consequences are not cosmetic:

| Reported there | Actually changed | Why it matters |
|---|---|---|
| Parts Velocity `S2-R6`, `S3-R1a`, `S4-R1` | **`S3-R10`** | S4-R1's own text (*"A column picker is accessible via a toolbar button…"*) is byte-identical in v5 and v6. The rule that moved is the Location column's. |
| Work In Progress `S9-E1`, `S7-R7a` | **the un-anchored §3 Key Decisions block** | `S9-E1` is *"In a download, the asset column is headed 'Unit'…"* — nothing to do with bucketing. Chasing the three cases citing `S9-E1` would have missed the change entirely. |

Ground truth is `tools/textdiff.py`, which diffs the flattened body word by word and attributes each
region to the nearest **defining** anchor (`S<n>-<T><m>:` with a colon).

---

## 1 · Sales By Customer v16 → v17 — the Product Type control was redesigned

### 1.1 `S3-R1` — CHANGED — **case extended**

| | |
|---|---|
| **v16** | *"A 'Product Type' **dropdown** is visible in the report toolbar."* |
| **v17** | *"A 'Product Type' **filter** is visible in the report toolbar. **It is a multi-select, matching the behavior of the Customer and Location filters.**"* |
| **Our case** (before) | C30107: *"Find the 'Product Type' **dropdown** in the report toolbar; read its value before touching it, then open it and read the options in order."* |
| **Our case** (after) | *"The 'Product Type' filter in the toolbar is a multi-select, behaving like the Customer and Location filters."* |
| **Verdict** | **case extended** — [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) (`SBC-TYPE-02`), field: steps + expected item 1 |

### 1.2 `S3-R2` — CHANGED — **case extended** (the sharp one)

| | |
|---|---|
| **v16** | *"The dropdown offers **exactly three options, in this order: "Parts & Service," "Parts only," "Service only."**"* |
| **v17** | *"The dropdown **pins two action rows at the top - "All products" and "Clear all" - above two toggle options: "Parts" and "Services."**"* |
| **Our case** (before) | C30107 expected 1: *"The dropdown offers **exactly three options, in this order**: 'Parts & Service,' 'Parts only,' 'Service only' — with 'Parts & Service' selected by default on first load."* |
| **Our case** (after) | *"Opened, it pins two action rows at the top — 'All products' and 'Clear all' — above two toggle options: 'Parts' and 'Services.'"* |
| **Verdict** | **case extended** — [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) |

**This is the one that would have failed a conforming build.** The case asserted a closed
three-option single-select list for a control that is now a multi-select with two toggles and two
pinned action rows. Rule 42 predicted exactly this failure mode; the closed list survived because it
*was* the requirement at v16 — and v17 replaced the requirement, not merely reworded it. The closed
form is retained because **v17's S3-R2 still closes the list itself**, which is Rule 42's carve-out,
and `refs` now says so.

### 1.3 `S3-R3` — CHANGED — **case extended**

| | |
|---|---|
| **v16** | *"**"Parts & Service" is the default selection** on first load."* |
| **v17** | *"**Both toggles are selected (all products)** on first load."* |
| **Verdict** | **case extended** — [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) expected item 2 |

### 1.4 `S3-R4` · 1.5 `S3-R5` · 1.6 `S3-R6` — CHANGED — **covered, no change needed to the export half**

| | |
|---|---|
| **v17 `S3-R4`** | *"When both toggles are selected, no product-type filter is applied; **the exports' filter summary line reads "Parts & Service."**"* |
| **v17 `S3-R5`** | *"When only "Services" is selected … **the exports' filter summary line reads "Service only."**"* |
| **v17 `S3-R6`** | *"When only "Parts" is selected … **the exports' filter summary line reads "Parts only."**"* |
| **Our case** | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) expected 2: *"the filter summary line "Product Type: {value}" where value is "Parts & Service," "Parts only," or "Service only.""* |
| **Verdict** | **selection half: case extended** ([C30107](https://shopview.testrail.io/index.php?/cases/view/30107) items 3–5, reworded from *"Under 'Service only'"* to *"With only 'Services' selected"*). **Export-summary half: already covered by [C30167](https://shopview.testrail.io/index.php?/cases/view/30167), NO change needed** |

**The export summary values did not change**, and v17's own Change Log says so: *"export
filter-summary values unchanged via the selection mapping."* So C30167 is correct as written and was
deliberately not touched. The toggles now read *"Parts"* and *"Services"* while the export still
prints *"Parts only"* / *"Service only"*, which is genuinely confusing, so C30107 carries a plain
note telling the tester that difference is expected.

### 1.7 `S3-R6a` — **ADDED** — **new case authored**

| | |
|---|---|
| **v17 (new)** | *"When neither toggle is selected (after "Clear all"), the report shows the empty-state message (Story 17) until a toggle is selected."* |
| **Coverage before** | **none** — the requirement did not exist when the SBC cases were written |
| **Verdict** | **new case authored** — `SBC-TYPE-04` = [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) |

---

## 2 · Sales By Representative v17 → v18 — the Location column rule was rewritten

### 2.1 `S21-R7` — CHANGED — **7 cases repaired**

| | |
|---|---|
| **v17** | *"A per-row Location column is shown on the report **only when the current view spans more than one location** — i.e., when more than one location is in scope … When the view is scoped to a single location it **is hidden**."* |
| **v18** | *"A per-row Location column is shown **to any user with access to more than one location**: it appears by default and **can be toggled on or off from the column selector, whatever the current location selection**, and a user with access to only one location never sees it."* |
| **Verdict** | **7 cases repaired** — see §5, the Location-column family |

**The reversal is real and it is a trap for a tester**: narrowing the *selection* to one location used
to hide the column and now does not. Six of our cases asserted the old behaviour outright.

---

## 3 · Parts Velocity v5 → v6

### 3.1 `S3-R10` — CHANGED — **2 cases repaired, contradiction NOT resolved**

| | |
|---|---|
| **v5** | *"…**auto-managed by the location scope** (it is **not one of the 20 columns** in the picker, S4-R1, **and is not user-toggleable**) and is **hidden entirely when** a single location is in scope."* |
| **v6** | *"The column is **available to any user with access to more than one location**: it is **offered in the column picker (S4-R1), shown by default, and can be toggled on or off**; a user with access to only one location never sees it."* |
| **Verdict** | **blocked — Chris Ward owns it.** Cases assert only the uncontested half |

**Parts Velocity is the one report whose contradiction v6 did NOT resolve — it moved it.** Three
requirements in the same live document now disagree:

- **`S3-R10`** (rewritten): Location *"is offered in the column picker (S4-R1), shown by default"*
- **`S2-R12`** (untouched): *"when a single location is in scope the column **is hidden**"* — scope-driven
- **`S4-R1`/`S4-R2`/`S4-R3`** (untouched): the picker *"lists all **20** available columns"*, being 14 defaults + *"the 6 columns hidden by default … Units Returned, Sold (WO), Sold (Parts Sale), Turns / Yr, Min, Max"* — **Location is in neither list**

Cases: [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) and
[C30352](https://shopview.testrail.io/index.php?/cases/view/30352) (Automated) now assert only what
is uncontested and tell the tester not to fail on the contested points. **Question 1 for Chris.**

### 3.2 `S6-R12` — **ADDED** — **already covered; refs repaired, NO new case**

| | |
|---|---|
| **v6 (new)** | *"An export is capped at a maximum of 10,000 rows in the current filtered set. When the filtered set exceeds the cap, neither the PDF nor the CSV is produced and the user is shown the message: **"This report is too large to export. Narrow the date range or filters, then try again."**"* |
| **Our case** | [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) expected 1–2: *"Neither the CSV nor the PDF is produced — no download starts. A clear too-large message appears … the standard wording is **"This report is too large to export. Narrow the date range or filters, then try again."**"* |
| **Verdict** | **covered by [C38885](https://shopview.testrail.io/index.php?/cases/view/38885)** — assertion matches near-verbatim; its `refs` was repaired |

**The brief expected a new case here, and the honest answer is that one is not needed.** The
requirement was uncited, not uncovered — and those are different things, which is exactly why
Rule 45(e) requires both texts side by side. What *was* wrong is that C38885's `refs` read *"PV spec
v4 … — **spec silent on a cap**"*, which was true at v4/v5 and is now false. It now cites `S6-R12`.

**Deliberately NOT changed: [C43547](https://shopview.testrail.io/index.php?/cases/view/43547).** Its
`refs` says *"the spec is silent on a **renderer size limit**"* — a different claim, and **still
true**: `S6-R12` caps rows, and says nothing about a mid-size PDF failing to render.

**And the suite-wide record is now stale in our favour.** The workspace note that *"none of the six
specifications mentions"* the cap is false: **all six now state it**, and **all six reports already
have a case for it** — SBC [C30172](https://shopview.testrail.io/index.php?/cases/view/30172), SBR
[C30290](https://shopview.testrail.io/index.php?/cases/view/30290), PV
[C38885](https://shopview.testrail.io/index.php?/cases/view/38885), TU
[C38887](https://shopview.testrail.io/index.php?/cases/view/38887), WIP
[C38918](https://shopview.testrail.io/index.php?/cases/view/38918), IV
[C30593](https://shopview.testrail.io/index.php?/cases/view/30593). **Inventory Value v5 flags the
value itself as unsettled** — *"[Cap value 10,000 is a proposed default — confirm the exact
suite-standard value with the owner before dev.]"* — which is **question 3 for Chris**.

---

## 4 · Work In Progress v10 → v11 — three new Key Decisions, in an un-anchored block

### 4.1 Line-state bucketing — **blocked: the specification contradicts itself**

| | |
|---|---|
| **v11 §3 Key Decisions (new)** | *"**Buckets are keyed on line state, not work-order status.** Every line's value sits in exactly one bucket … **A work order carrying lines in more than one state appears in each matching tab**, showing only that tab's slice of its money; the status column still shows the work order's true status. … (Per SV-9027.)"* |
| **v11 `S2-R4`** (unchanged) | *"Each qualifying work order appears **exactly once, in exactly one tab** (Story 3)…"* |
| **v11 `S3-R1`** (unchanged) | *"A work order **whose status is** Estimate is placed in the Estimates tab."* |
| **v11 `S3-R3`** (unchanged) | *"A work order **whose status is** In Progress or Review is placed in the Approved - partially completed tab."* |
| **v11 `S3-R4`** (unchanged) | *"A work order **whose status is** Approved is placed in … when any labor time has been clocked…"* |
| **Verdict** | **blocked — Chris Ward owns it.** 3 cases HELD, assertions preserved |

**These cannot both be true.** One says a work order lands in exactly one tab chosen by its status;
the other says its lines are distributed across every tab whose state they match. **No side was
picked** (Rules 15, 57, 58): the three cases keep the requirement they cite, verbatim, and now carry
a plain note plus `AUTOMATION: HOLD`.

- [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) — *"Each qualifying work order appears exactly once in exactly one tab"* (cites `S2-R4`)
- [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) — *"Status-to-tab mapping"* (cites `S3-R1`/`R2`/`R3`) — **Automated**
- [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) — *"Approved started-boundary"* (cites `S3-R4`)

**Question 2 for Chris**, and the highest-risk item in this pass.

**Affected but NOT contradicted — recorded, not edited** (their assertions hold under either
reading, so editing them would be churn):
[C30480](https://shopview.testrail.io/index.php?/cases/view/30480) (unapproved lines add nothing to
the money columns — still true; the columns sum approved lines whichever tab the row sits in),
[C30491](https://shopview.testrail.io/index.php?/cases/view/30491) (the Estimates figure equals the
Estimates tab total — still true),
[C30488](https://shopview.testrail.io/index.php?/cases/view/30488),
[C30452](https://shopview.testrail.io/index.php?/cases/view/30452).

### 4.2 Fixed-price valuation — **new cases authored (a genuine hole)**

| | |
|---|---|
| **v11 §3 (new)** | *"**Fixed-price lines are valued at their fixed amounts, and earn on completion.** A line priced with a fixed labor total, or a fixed line total split into labor and part portions, is valued at those fixed amounts - the numbers the customer is billed - not at underlying picked parts or an hourly derivation. When progress cannot be derived (no invoiced hours), **earning is binary**: the full fixed amount stays in Remaining until the line is completed, then moves entirely to Earned. When invoiced hours exist, the derived-rate proration applies. **A completed work order never leaves value stuck in Remaining.** (Per SV-9028, SV-9035, SV-9040, SV-9044.)"* |
| **Coverage before** | **ZERO.** Searched all 78 Work In Progress cases for *fixed-price*, *fixed labor*, *fixed line*, *fixed amount*, *flat rate* — **not one match** |
| **Verdict** | **new cases authored** — `WIP-CALC-11` = [C43592](https://shopview.testrail.io/index.php?/cases/view/43592) (valued at the fixed amount) and `WIP-CALC-12` = [C43593](https://shopview.testrail.io/index.php?/cases/view/43593) (binary earning, no invoiced hours) |

**This is the real coverage gap of the pass** — a rule governing how the report values money, with
no test of any kind. Split into two cases because it makes two independently observable assertions
(Rule 45(e)).

### 4.3 Core charges — **partially covered; new case authored for the untested half**

| | |
|---|---|
| **v11 §3 (new)** | *"**A core charge counts in parts value at every stage.** The core charge is billed to the customer, so it is included in **Parts Remaining and Parts Earned** consistently across all tabs, including Estimates. **Marking a returned core OK or Not OK never changes WIP figures** - the core assessment is a credit event handled at invoicing, outside this report. (Per SV-9057, SV-9058.)"* |
| **Our case** | [C30478](https://shopview.testrail.io/index.php?/cases/view/30478) expected 2: *"For the core-charge part, **Parts Remaining** values the outstanding quantity at its sell price INCLUDING the core charge."* |
| **Verdict** | **Parts Remaining half: covered by [C30478](https://shopview.testrail.io/index.php?/cases/view/30478). Parts Earned + the OK/Not-OK invariance: new case authored** — `WIP-CALC-13` = [C43594](https://shopview.testrail.io/index.php?/cases/view/43594) |

C30478 covers one of the two assertions. The invariance — that deciding a core moves nothing —
had no case at all, and it is the more valuable half, because it is the one a developer could break
without noticing.

---

## 5 · Inventory Value v4 → v5, and the Location-column family across all six reports

### 5.1 `S7-R6` — CHANGED — **4 cases repaired**

| | |
|---|---|
| **v4** | *"…shown **only when the current scope spans** more than one location; when a single location is in scope the column is hidden. **Its visibility follows the location scope automatically** and it is **not one of the columns offered** in the column-selection control (Story 8)."* |
| **v5** | *"…shown **to any user with access to more than one location**: it appears by default and **can be toggled on or off from the column-selection control** (Story 8); a user with access to only one location never sees it."* |
| **Verdict** | **4 cases repaired** |

### 5.2 The family, and the finding that runs through it

**All six live specifications now state the access-gated, column-selector-toggleable rule**
(SBC `S4-R12`, SBR `S21-R7`, PV `S3-R10`, TU `S10-R4`/`S9-R9`, WIP `S4-R3`, IV `S7-R6`).
**19 of our cases asserted the superseded scope-driven rule.** Every one is repaired.

**Seven of them carried a note saying the specification was inconsistent and that "the product owner
has been asked which is right and has not answered yet". He HAS answered — by making the edits.**
Chris Ward's own version message on three of the five moved specs reads: *"reworded the
Location-column visibility to the access-gated, column-selector-toggleable rule, matching the
decision note already in this spec."* So the note was not merely stale, it was telling testers a
settled question was open. **Four `AUTOMATION: HOLD` markers raised for that question are lifted.**

| Report | Cases repaired | Note |
|---|---|---|
| Sales By Representative | C38913 · C30218 · C30226 · C30278 · C30279 · C30285 · C30286 | 7 |
| Inventory Value | C38917 · C30551 · C30554 · C30588 | 4 — **all four HOLDs lifted** |
| Sales By Customer | C30161 · C30169 · C38856 | 3 — SBC's spec moved at v16, so these were **already stale before this pass** |
| Parts Velocity | C38914 · C30352 | 2 — contradiction narrowed, **not** resolved |
| Technician Utilization | C38859 | 1 — **pre-existing defect**, see below |
| Work In Progress | C30466 | 1 — stale *"whichever way it is decided"* clause |

**[C38859](https://shopview.testrail.io/index.php?/cases/view/38859) is the worst of them and it is
not from today's delta.** It asserted *"The Location column is **never listed here** — it appears on
its own whenever more than one location is in scope"*, while TU `S10-R4` says *"The per-row Location
column **is one of the toggleable columns** … shown by default and can be toggled on or off from the
column selector"*. **TU's spec has been at v7 since 2026-08-07 and did not move in this diff**, so
this case has been contradicting its own current specification and would have failed a conforming
build. Its closed five-toggle list is now scope-conditional (Rule 42).

---

## 6 · Reverse direction — case → requirement

Every one of the 480 cases' cited anchors was checked against **its own report's live body**:

| Check | Result |
|---|---|
| Cases pinned to an anchor that no longer exists | **0** |
| Anchors that disappeared in any of the five diffs | **0** |
| Cases whose assertion no longer matches its requirement | **24, all repaired or held** (19 Location + C30107 + 3 WIP bucketing + C38885 refs) |
| Cases carrying no `AUTOMATION` marker | **2** — C30169 (repaired) and C30288 (**recorded, not touched**) |
| Cases whose Rule-54 line names no spec version | **3** — C30169 (repaired), C30288, C38925 |

**The live marker census contradicts the workspace record.** It reads **474 of 476**, not 476 of
476, so the arithmetic gate does **not** currently pass: 335 READY + 100 EXPECT-FAIL = 435, while
476 − 39 HOLD = 437. **The 2-case difference is exactly the 2 unmarked cases**, so the gate is not
broken — it is unmarked cases, and the figure has simply been quoted from a stale census.
