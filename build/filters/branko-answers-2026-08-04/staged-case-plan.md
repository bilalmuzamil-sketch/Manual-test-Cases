# Filters — STAGED case plan from Branko's answers of 2026-08-04

> ## STATUS: **STAGED — NOTHING EXECUTED.** 0 TestRail writes. 0 edits to `cases/`.
> Every operation below awaits the QA lead's explicit go-ahead (Standing Rule 6).
> Source of the rulings: `answers-ingested.md` in this folder — his words, verbatim.

## Totals at a glance

| | |
|---|---|
| **`update_case` — REQUIRED** | **10** |
| **`update_case` — OPTIONAL** (metadata only, no tester-facing change) | **2** |
| **`add_case`** | **0** |
| **`delete_case` / retire** | **0** |
| **`add_section`** | **0** |
| **Run writes (`update_run`, `add_result`)** | **0 — and none is NEEDED. See §6.** |
| Cases whose **tester-facing wording** changes | **2** — C29624 (reflow, same assertions) · C38904 (one false note removed) |
| Cases where **only the provenance line / refs** change | **8** required + 2 optional |
| Active case count **before → after** | **110 → 110** (no adds, no retires) |

**Why no case is added and none retired:** the only pending authoring block was **sorting**, and
Branko's **Q4 = "C"** cancels it (§5). The nine `FLT-SRCH` palette cases his **Q7** confirms belong to
Global Search **were never pushed to TestRail** and have no C-ids, so their confirmed retirement needs
no operation (§5).

---

## 1. GROUP A — the mobile cluster · driven by **Q1** · 8 × `update_case`

**THE DRIVING ANSWER, VERBATIM (Branko, 2026-08-04, sheet question 1):**

> **"A - no apply button"**

…where **option A as sent** read: *"Instantly as you tick, no Apply button (**the engineering plan's
way**)."* and the question's own `What happens now` column defined that model as: *"the engineering
plan makes single-filter windows apply INSTANTLY as you tick (no button) - **only the combined "All
Filters" window keeps an "Apply filters" button**."*

**The engineering plan he thereby adopted, VERBATIM** —
`build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`, decision **D15**:

> *"Mobile "All Filters" combined bottom sheet — **IN**, with an "Apply filters" button (batch-apply;
> deliberate difference from desktop real-time). Individual chips/sheets stay real-time."*

**Honesty note carried into every row below:** the *single-filter, no-button* half is his own typed
sentence. The *combined-sheet-keeps-its-button* half is an **endorsement by option-selection** — the
option he chose named the engineering model, and the text he read spelled out the exception. Recorded
as such, and it is why `FOLLOW-UPS-2026-08-04.md` offers one optional confirmation line.

### 1.1 The 7 provenance-only edits

**Field changed: `custom_expected` — the final provenance block ONLY.** Every other field, and every
word of every numbered expected result, is **unchanged**. The stamper is idempotent, so the re-stamp
**replaces** the existing line and never appends a second one.

| # | Case | C-id + link | **CURRENT provenance sentence** | **PROPOSED provenance sentence** |
|---|---|---|---|---|
| A1 | FLT-MOB-01 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | …version 1.6 (S12-R1). **The screen described above comes from the agreed design rather than that specification, and a product owner decision is still awaited.** | …version 1.6 (S12-R1). **The current behaviour follows a later product owner decision dated 2026-08-04.** |
| A2 | FLT-MOB-02 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | …version 1.6 (S12-R3). **…a product owner decision is still awaited.** | …version 1.6 (S12-R3). **The current behaviour follows a later product owner decision dated 2026-08-04.** |
| A3 | FLT-MOB-03 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | …version 1.6 (S12-R2, S12-R3, S2-R1). **…is still awaited.** | …version 1.6 (S12-R2, S12-R3, S2-R1). **The current behaviour follows a later product owner decision dated 2026-08-04.** |
| A4 | FLT-MOB-05 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | …version 1.6 (S12-R2, S3-R2/R3/R5). **…is still awaited.** | …version 1.6 (S12-R2, S3-R2/R3/R5). **The current behaviour follows a later product owner decision dated 2026-08-04.** |
| A5 | FLT-MOB-06 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | …version 1.6 (S12-R2, S4-R1, S5-R1). **…is still awaited.** | …version 1.6 (S12-R2, S4-R1, S5-R1). **The current behaviour follows a later product owner decision dated 2026-08-04.** |
| A6 | FLT-MOB-07 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | …version 1.6 (S12-R2, S6-R1/R2/R3). **…is still awaited.** | …version 1.6 (S12-R2, S6-R1/R2/R3). **The current behaviour follows a later product owner decision dated 2026-08-04.** |
| A7 | FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | …version 1.6 (S12-R2, S7-R1/R3, S8-R1). **…is still awaited.** | …version 1.6 (S12-R2, S7-R1/R3, S8-R1). **The current behaviour follows a later product owner decision dated 2026-08-04.** |

**Why the change is required, not cosmetic (Rule 54):** *"a product owner decision is still awaited"*
became **false on 2026-08-04**. A provenance line asserting a source position that no longer holds is
worse than none — it manufactures the wrong impression in the opposite direction, telling a reader
that six PO-endorsed assertions are unsettled.

**Executable form:** in `../provenance-2026-08-04/tools/classify.py`, change these seven entries in
`CLASSIFY['filters']` from `('design_awaiting', None)` to `('po_ruling', '2026-08-04')`, rebuild the
plan, run the existing verified executor. The exact OLD and NEW strings above were **rendered with
that tool against live TestRail**, so they are byte-accurate, not hand-written.

**Alternative worth one sentence of your attention on A7 (C29628):** its *content* (active chips +
Clear filters on mobile) is fully spec-backed by S12-R2 / S7-R1/R3 / S8-R1, and only its **route**
(*"at least one filter applied via the sheet"*) depends on the PO-endorsed screen. `po_ruling` is the
conservative choice; **`plain`** would also be defensible. Your call — I have staged `po_ruling`.

### 1.2 FLT-MOB-04 — the one case that needs a body edit

| | |
|---|---|
| **Case** | FLT-MOB-04 · **[C29624](https://shopview.testrail.io/index.php?/cases/view/29624)** |
| **Live title** | *"Mobile: tapping one chip opens its own sheet and applies in real time"* |
| **Operation** | 1 × `update_case` — `custom_preconds`, `custom_steps`, `custom_expected` |
| **Assertions changed** | **NONE.** Same four expectations, same order, same words — made readable. |

**⚠️ READ THIS FIRST — the assertion is already correct and Branko has now confirmed it.**
Live expected item 3 reads: *"There is **no 'Apply filter' button**. Ticking/unticking a status
filters the work-order list **immediately**, the same as desktop — no submit step."* **That is
exactly his ruling.** The case is right; only its **formatting** is broken.

**What is wrong — a paste accident, recorded in `../provenance-2026-08-04/STAGED-REPAIRS.md`:**

**CURRENT `custom_preconds`** — two preconditions collapsed onto one line:
```
- You are signed in to the ShopView App on a mobile device.- You are on the Work Orders page.
```
**CURRENT `custom_steps`** — four steps on one line, the last two with no separator or terminator:
```
- Tap the Status chip (not All Filters).- Read the sheet.- Tick a status- Untick it/ tick another
```
**CURRENT `custom_expected`** — a bare `<li>` carrying a browser paste attribute, never wrapped in
`<ol>`, all four results inside that one `<li>`:
```
<li data-pasted="true">A bottom sheet opens for that single filter: … no accordion list of the
other filters.- The sheet shows only that filter's options … - There is <strong>no 'Apply filter'
button</strong>. … - The chip's active state and value update live …
```

**PROPOSED `custom_preconds`:**
```
1. You are signed in to the ShopView App on a mobile device.
2. You are on the Work Orders page.
```
**PROPOSED `custom_steps`:**
```
1. Tap the Status chip (not the 'All Filters' chip).
2. Read the sheet that opens.
3. Tick one status and watch the work order list.
4. Untick it, then tick a different status, and watch the list again.
```
**PROPOSED `custom_expected`:**
```
1. A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters.
2. The sheet shows only that filter's options (the nine status checkboxes plus 'Clear selection').
3. There is no 'Apply filter' button. Ticking or unticking a status filters the work order list immediately, the same as on desktop, with no submit step.
4. The chip's active state and value update live as the selection changes; closing the sheet with the x just dismisses it and keeps the applied filter.

---
This is the expected behaviour as per epic SV-8785 and the Filters specification version 1.6 (S12-R2, S12-R3).
```

**Two things changed against the previously staged version of this repair:**

1. **The block on it is gone.** `STAGED-REPAIRS.md` gave the binding reason for withholding,
   verbatim: *"Reflowing the text means re-committing its contested assertion … whether the mobile
   filters batch behind an Apply button at all is exactly the open Branko question (B3)."*
   **Branko answered it.** The assertion is no longer contested.
2. **Its "provenance line: unchanged" instruction is now WRONG and must be overridden.** That plan
   said *"the case already carries the `design_awaiting` variant, which is correct either way."*
   After 2026-08-04 that variant's closing sentence is false. **And this case does not become
   `po_ruling` either — it becomes `plain`,** because with no Apply button on the single-filter sheet
   the behaviour now **agrees with the spec outright**: `S12-R3` gives the bottom sheet, `S12-R2` says
   mobile chips *"behave identically to desktop"*, and `S2-R6` says desktop filters *"in real time …
   (no confirm/apply button needed)"*. **This is the one case in the cluster whose provenance gets
   SIMPLER, and that is the honest outcome, not a downgrade.**

**Executable form:** add the three `(field, old, new)` tuples to `REPAIRS['filters'][29624]` in
`tools/build_plan.py`, set `CLASSIFY['filters'][29624] = ('plain', None)`, refresh that case's
snapshot from live (as was done for C29628), rebuild, and run
`python3 exec_push.py filters --only 29624`. The staged-OLD-text guard will refuse if anything has
drifted, and Rule-50 byte verification applies as normal.

**⚠️ SEPARATE ITEM, NOT AN OPERATION IN THIS PLAN — the local case source contradicts live.**
`build/filters/cases/cases-D-mobile-api.json` still holds the pre-ruling design version:

| | |
|---|---|
| **LOCAL title** | *"Mobile: tapping one chip opens its own sheet with an 'Apply filter' button"* |
| **LOCAL expected 3** | *"The bottom button reads 'Apply filter' (singular); tapping it applies the selection and filters the list."* |

**Live is correct; local is stale and asserts the opposite of Branko's ruling.** `cases/` was
deliberately not touched by this pass. **This needs routing to whoever owns `cases/`, because the
local source feeds the import and any future generated push could overwrite the correct live text.**

---

## 2. GROUP B — the default tab · driven by **Q2** · 1 × `update_case`

**THE DRIVING ANSWER, VERBATIM (Branko, 2026-08-04, sheet question 2):**

> **"A - it's fine"**

…where **option A as sent** read: *"Yes - Estimates first is fine."*, answering *"Is Estimates the
right tab to open first for a brand-new visit?"*

| | |
|---|---|
| **Case** | FLT-TAB-06 · **[C38876](https://shopview.testrail.io/index.php?/cases/view/38876)** — *"First visit opens the Estimates tab; your last-used tab is remembered"* |
| **Operation** | 1 × `update_case` — `refs` + `custom_expected` (provenance block only) |
| **Tester-facing assertions** | **UNCHANGED.** |

**Its assertion is confirmed, not changed.** Live expected 1: *"On the very first visit the Estimates
tab is the selected one, even though All is the FIRST tab in the row (order and default are different
on purpose)."* — that is precisely what he said is fine.

**`refs` — the false clause must go:**

| | |
|---|---|
| **CURRENT** | `SV-8785 [epic] (no requirement in the ratified spec v1.6 - default/last-used tab is engineering-plan-only - **confirmation requested**); tech plan 2026-07-29 D10 (default tab = Estimates; last-used tab persists) [spec v1.6 2026-07-28]` |
| **PROPOSED** | `SV-8785 [epic] (no requirement in the ratified spec v1.6 - default/last-used tab is not in the spec; **confirmed by Branko 2026-08-04, sheet Q2 "A - it's fine"**); tech plan 2026-07-29 D10 (default tab = Estimates; last-used tab persists) [spec v1.6 2026-07-28]` |

**Provenance line — currently under-claims our basis:**

| | |
|---|---|
| **CURRENT** | *"This is the expected behaviour as per epic SV-8785 and **the engineering technical plan**. No numbered requirement in the Filters specification version 1.6 covers this point **yet**."* |
| **PROPOSED** | *"This is the expected behaviour as per epic SV-8785 and **a product owner decision dated 2026-08-04**. No numbered requirement in the Filters specification version 1.6 covers this point."* |

**Why a NEW stamper variant is needed here, and why the obvious shortcut would be dishonest.**
Reusing `po_ruling` would render *"…as per epic SV-8785 and the Filters specification version 1.6.
The current behaviour follows a later product owner decision dated 2026-08-04."* — which **implies the
spec covers the default tab. It does not** (re-verified live this pass: v1.6 has no requirement for a
default or last-used tab). Rule 54's honesty clause forbids naming a source that does not support the
expectation. **Proposed addition to `classify.py`: a variant `po_ruling_no_anchor`** rendering exactly
the PROPOSED line above. Both halves are then true: the ruling is real, and the spec silence is
admitted.

**Also resolved (case `notes`, no functional effect):** *"PENDING BRANKO (Questions Q5 / deltas C5) …
If Branko rules the default should be All, flip expected 1."* — he did not, so nothing flips.

**Still owed by Branko, separately:** writing the default tab into the PRD. That is an
outstanding-register item, not an operation here.

---

## 3. GROUP C — the Vendors page · driven by **Q3** · 1 × `update_case`

**THE DRIVING ANSWER, VERBATIM (Branko, 2026-08-04, sheet question 3; his spelling):**

> **"Disign for vendors exists in figma. Check it"**

**We checked it, and he is right** — `Parts-Explorations-20.4.2026 / Vendors`, Figma node
**`11903:10461`**, PNG
`build/filters/design-2026-07-31/frames/Parts-Explorations-20.4.2026__Vendors__11903-10461.png`,
read as **pixels this pass**: the page shows **exactly two filter chips, `Vendor` and
`State/Province`**, plus a toolbar Search, a filter icon, a column/layout icon and a **New Vendor**
button. **His own PRD agrees** — v1.6 §2, verbatim: *"A filter bar appears below the page header on
each view of the Parts area (Inventory, Part Sales, Catalog, Returns, Credits, Purchase Orders,
Vendor Invoices, **Vendors**)"*.

| | |
|---|---|
| **Case** | FLT-PARTS-01 · **[C38904](https://shopview.testrail.io/index.php?/cases/view/38904)** — *"Every Parts list page shows its designed filter buttons"* |
| **Operation** | 1 × `update_case` — `custom_expected` (item 8 + provenance) and `refs` |

**`custom_expected` item 8 — the chip list is already right; the note attached to it is false:**

| | |
|---|---|
| **CURRENT** | *"The Vendors list page shows two filter buttons: Vendor and State/Province. **Note: the developers have not been given a design for the Vendors page filters yet, so this page may not have them — write down what you actually see instead of failing the whole test.**"* |
| **PROPOSED** | *"The Vendors list page shows two filter buttons: Vendor and State/Province."* |

**Why the note must go, and it is a coverage argument, not a tidiness one.** Its premise —
*"the developers have not been given a design"* — is **denied by the PO and disproved by the board**.
Left in place it is a **Rule-45 false all-clear**: a tester who finds **no filter bar at all** on
Vendors would follow the note, write down what they see, and **not fail the build**. The whole point
of the case is to catch exactly that.

**`refs` — add the sources that now back it:**

| | |
|---|---|
| **CURRENT** | `SV-8785 [epic] (spec v1.6 §2 Feature Overview -> Parts Filters; §4 Key Decisions -> "Context-specific filter sets on Parts and Reports" + "Multi-select where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11884-16885` |
| **PROPOSED** | same, with `Branko answers 2026-07-31 Q2/Q3/Q5/Q7` → `Branko answers 2026-07-31 Q2/Q3/Q5/Q7 + 2026-08-04 Q3 (Vendors in scope, design exists: Figma 11903-10461) + Q8 (Part Sales chips)` |

**⚠️ Rule-50 length guard before pushing:** TestRail rejects any single comma-entry in `refs` over
**248** characters with HTTP 400 `Field :refs does not match the required pattern.` The current value
already runs close to that limit — **measure the proposed string and, if it exceeds 248, shorten
the parenthetical rather than dropping a source.**

**Provenance line — date bumped to the newest ruling (Rule 32):**

| | |
|---|---|
| **CURRENT** | *"…version 1.6 (§2, §4), which covers this area in its overview and key decisions only. The detailed behaviour above follows a later product owner decision dated **2026-07-31**."* |
| **PROPOSED** | *"…version 1.6 (§2, §4), which covers this area in its overview and key decisions only. The detailed behaviour above follows a later product owner decision dated **2026-08-04**."* |
| Executable | `CLASSIFY['filters'][38904] = ('po_prose_only', '2026-08-04')` |

**Honest caveat, and it belongs to you not to the case:** removing the hedge means the case will
**FAIL if the build has not shipped the Vendors filter bar yet**. That is the correct behaviour — a
missing filter bar on a page the PRD and the PO both include **is** a finding — but it means the
first VIU run may legitimately produce a failure here. **Needs the live check once the Filters VIU is
authorised.**

---

## 4. GROUP D — OPTIONAL metadata strengthening · driven by **Q8** · 2 × `update_case`

**Neither changes one word a tester reads.** Both simply record that a case's basis got stronger.
Skip them if you would rather not spend the writes.

**THE DRIVING ANSWER, VERBATIM (Branko, 2026-08-04, sheet question 8):**

> **"We do not have list of all filter items. we should have all filters we support now per each page
> plus we should add new ones. For example let's use parts sales page. Currently support only status
> but we can also have customer, created by and date. We already have those values in the table, we
> just need to include those as filters."**

| # | Case | C-id + link | Field | Change |
|---|---|---|---|---|
| D1 | FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) — *"Every filter a page had before is still available in the new filter bar"* | `refs` | Add `+ 2026-08-04 Q8 ("we should have all filters we support now per each page plus we should add new ones")`. This case exists **solely** to test the parity rule; it now rests on **two** PO statements (2026-07-31 Q3 and 2026-08-04 Q8) plus the tech plan's rollout rule — **three** agreeing sources. |
| D2 | FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) — *"New Reports filter types behave correctly (Location, Transaction Type, etc.)"* | `refs` | Add `+ 2026-08-04 Q8 ("We do not have list of all filter items") — PO-confirms that no written option list exists for the six new filter types`. Its expected item 3 already says *"They have not been written down anywhere yet, so your list becomes the record"*; his answer **confirms that sentence is accurate** rather than changing it. |

**A note on the third thing Q8 did, which needs no operation at all.** His example names the Part
Sales chips: *"Currently support only status but we can also have customer, created by and date."*
**C38904 expected item 2 already reads:** *"Part Sales shows four filter buttons: Status, Customer,
Created by and Date."* — **item for item, in his own words.** A design-derived enumeration has become
PO-sourced with no edit required. That is captured in C38904's `refs` change in §3.

---

## 5. WHAT IS **NOT** BEING DONE, AND WHY — so no reader mistakes an omission for a miss

| Item | Operation | Why not |
|---|---|---|
| **Sorting the Work Orders list — the ~6–8 case proposal** | **0 adds. CANCELLED, not deferred.** | Branko's **Q4 = "C"** = *"No - sorting is not part of this project (the design pictures are exploration only)."* The proposal in `design-2026-07-31/RECONCILIATION-12-2026-07-31.md` §D-1 was **never authored** — no internal IDs, no C-ids, nothing pushed — so nothing is deleted and nothing is lost. Corroborated by the live spec: the token *sort* appears **once** in the whole v1.6 body, incidentally, in `S13-R14`. **The answer to "how many sorting cases do we have?" is now permanently "zero, by product decision".** |
| The **two sorting sub-questions** (is two sorts the maximum; how is direction reversed / does the sorted column show a mark) | **Nothing to author, so nothing to pin.** | He answered scope and not the details. Because scope is **C** the details are **moot** — Rule 42 is satisfied by there being no enumeration. Had he answered A or B these would have been **blocking** and reported as such. |
| **Five incidental "sort" mentions in existing cases** — FLT-MOB-09 [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) · FLT-PSRCH-03 [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) · FLT-RPTS-01 [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) item 16 · FLT-PERS-06 [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | **0 edits** | All five are legitimate. They observe that a **sort icon exists** in a toolbar, or use the app's **existing** sorting as a stability probe (FLT-PSRCH-03 tests `S13-R14`, a real requirement). **None asserts the new sorting panel's behaviour.** His ruling removes sorting from **this project's scope**, not from the **app**. A full sweep of all 110 cases found no other mention. |
| **The 13 `FLT-PSRCH` page-toolbar-search cases** | **0 edits** | **Q7 = "A"** keeps them in Filters. They rest on spec Story 13's **29 numbered requirements** — the best-sourced area in the suite. **Q5 = "B"** validates their wording as already correct: not one of the 13 asserts *which fields* the search matches; every field name appears as *"for example"* guidance for the tester. Rule 42 clean. |
| **The 9 `FLT-SRCH` ⌘K palette cases** | **0 operations — none is possible** | **They were never pushed to TestRail and have no C-ids.** Retired locally. The QA lead's condition was *"do not delete those cases unless Branko confirms that they are related to Global search only"*; Branko has now confirmed **twice** (2026-07-31 Q6 and 2026-08-04 Q7: *"Global search … This is not part of this scope, therefore not in the PRD"*). Their coverage lands in the **Global Search** project on its resume. |
| **FLT-MOB-09 [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) and FLT-MOB-10 [C29630](https://shopview.testrail.io/index.php?/cases/view/29630)** | **0 edits** | Both already carry **plain** provenance lines — they were never in the awaiting-decision cluster, so there is nothing to un-flag. (The cluster is **FLT-MOB-01…08**, 8 cases, not the 7-case range `C29622–C29628` named in the brief.) |
| **`build/filters/cases/**`, `testrail-id-map.csv`, `testrail-import/`** | **0 writes** | Out of this pass's scope. **One divergence found and escalated rather than fixed:** the local FLT-MOB-04 body contradicts live — §1.2. |

---

## 6. RUN 352 — the Rule 34 / Rule 47 consequence

### 6.1 Live state, read read-only this pass

| | |
|---|---|
| Run | **352** "Filters - Ahtasham (Awaiting QA- ENV)", project 1 / suite 1, `assignedto_id: 7` |
| `include_all` | **FALSE** — a **fixed selection**. It will **never** auto-pick up a new case. |
| Tests | **110** |
| **Result records** | **396** — `1` Passed · `79` Untested · `316` status-less (comment / assignment) |
| Status counts | 1 Passed · 0 Failed · 0 Blocked · 0 Retest · **109 Untested** |
| Set equality (Rule 50, both directions) | the run's 110 `case_id`s **equal** our 110 active cases exactly — 0 either way |

**⚠️ The brief says 395 result records and 110 Untested. Live it is 396 records with 1 PASSED.** A
graded result now exists in this run. **We did not write it** — this pass made zero TestRail writes.
Reported, not smoothed over.

### 6.2 The consequence of THIS plan: **no run write is needed**

**Because the plan contains ZERO `add_case`, run 352 needs NO `update_run`.**

| Scenario | Tests before → after | Result records before → after | `update_run` needed? |
|---|---|---|---|
| **THIS PLAN as staged** (10–12 `update_case`, 0 add, 0 delete) | **110 → 110** | **396 → 396** | **NO.** `update_case` never touches a run's selection. Editing a case's text changes what the tester reads inside the existing test; it neither adds nor removes a test, and it destroys no result. |
| *If sorting had been in scope (it is not)* — 6–8 `add_case` | 110 → 116–118 | 396 → 396 | **YES — and this is the dangerous one.** It would require the **UNION**: `get_tests/352` → current 110 ids → `sorted(set(current) | set(new))` → `update_run` with the **FULL** list. |
| *If any case were retired (none is)* — `delete_case` | 110 → 109 | 396 → 395 | **NO.** Deleted cases drop out of runs automatically. Record the before→after count in the audit log regardless. |

**THE LAW THAT APPLIES THE MOMENT AN `add_case` EVER ENTERS A FILTERS PLAN (Rule 34, verbatim
danger):** `update_run` **REPLACES** the selection. **A partial `case_ids` list DELETES the omitted
tests AND THEIR RECORDED RESULTS.** With **396 records including a tester's PASSED result** now in
this run, a careless partial write would destroy someone else's work, not just a count. Therefore,
whenever that day comes: **snapshot `get_tests/352` + `get_results_for_run/352` BEFORE the write**,
send the **full union**, and **verify after** — test count equals the expected figure and **every
prior result is present BY ID, not by count** (Rule 50). Baseline snapshots for exactly this purpose
are already on disk at `/tmp/run352-caseids.json` and `/tmp/run352-resultids.json` (ephemeral —
retake them at execution time).

**Rule 47 scope note:** run 352 is one of the **three in-scope active runs** (Filters 352 · Schedule
357 · Reports Suite 359), so keeping it complete is a standing duty. It is complete today: 110 tests
== 110 active cases. **Any run write still needs your explicit authorisation** — the run belongs to
another tester.

---

## 7. Rule 54 — every case touched gets its provenance line RE-STAMPED

This is not optional tidying; it is part of each operation above.

* **All 10 required operations re-stamp the provenance line.** Eight of them (Group A's seven +
  C38876) are provenance-driven in the first place.
* **The honesty clause is applied, not waved at.** Where a case follows **his ruling rather than the
  spec text**, its line **says so** and names the date — Group A's seven read *"The current behaviour
  follows a later product owner decision dated 2026-08-04."* **It does not claim plain spec
  agreement**, because for the combined All-Filters sheet the spec (`S2-R6`, `S12-R2`) points the
  other way. Manufacturing false spec authority would be worse than no line at all.
* **Where the ruling makes a case agree with the spec, the line gets SIMPLER and that is recorded as
  the outcome, not hidden:** **C29624** moves from `design_awaiting` to **`plain`**, because with no
  Apply button on the single-filter sheet the behaviour matches `S12-R3` + `S12-R2` + `S2-R6`
  outright.
* **Where there is no requirement at all, the line admits it:** **C38876** names the ruling **and**
  states plainly that no numbered requirement in v1.6 covers the point.
* **No build date is stamped anywhere.** All 110 cases remain in Rule-54 **state 1** (epic + spec, no
  build) because the Filters QA branch has **not** been observed. A build marker gets added only when
  the VIU is authorised and actually run.
* **The stamper is idempotent** (proven over three runs on 2026-08-04): a re-stamp **replaces** the
  existing line and never appends a second one.

---

## 8. Execution checklist, for whenever the go-ahead comes

1. **Re-read this plan against live first.** These OLD strings were rendered from live TestRail on
   2026-08-04; if anything has drifted, the executor's staged-OLD-text guard will refuse — that is
   correct behaviour, not a fault. Refresh the snapshot and rebuild rather than forcing it.
2. **Snapshot before writing:** `get_case/<id>` for all 10 (or 12), plus `get_tests/352` and
   `get_results_for_run/352`.
3. **Add the `po_ruling_no_anchor` variant** to `classify.py` (needed only by C38876, §2).
4. **Update `CLASSIFY['filters']`:** seven entries → `('po_ruling', '2026-08-04')`; `29624` →
   `('plain', None)`; `38876` → `('po_ruling_no_anchor', '2026-08-04')`; `38904` →
   `('po_prose_only', '2026-08-04')`.
5. **Add `REPAIRS['filters'][29624]`** — the three body tuples from §1.2.
6. **Measure the proposed `refs` for C38904** against the 248-character comma-entry limit before
   pushing (§3).
7. **Push with the existing verified executor.** **Rule 50 applies in full:** every write re-GET and
   **byte-compared field by field** against the intended payload, and **every field not intended to
   change proven byte-identical** to its pre-write snapshot. **On any mismatch: STOP the batch** —
   do not proceed to the next operation, do not retry blindly, and report both byte sequences.
   Declared normalisation: `refs` is compared under `','.join(p.strip() for p in s.split(','))`.
8. **Rule 41 — re-verify each touched case WHOLE**, not only the edited field, against live spec
   v1.6, and log per case *"re-verified whole against Filters spec v1.6 (Confluence version 14)"*
   plus every field checked. A log recording only the edited field is non-compliant.
9. **Verify run 352 UNTOUCHED afterwards:** 110 tests set-equal both ways, and **all 396 result
   records present BY ID**.
10. **Per-operation audit log** — operation · target C-id · HTTP status · verification result. *"200
    OK"* alone is non-compliant.
11. **Then reconcile the local case source** for FLT-MOB-04 (§1.2) via whoever owns `cases/`, and
    regenerate the id-map `refs` column for the cases whose `refs` changed.
