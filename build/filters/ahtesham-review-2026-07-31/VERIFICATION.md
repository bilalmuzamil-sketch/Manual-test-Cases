# Verification of Ahtesham's Filters review report — 2026-07-31

**Scope.** Ahtesham (QA) reviewed **TestRail run #352 "Filters - Ahtasham (Awaiting
QA- ENV)"** (79 cases, all Untested) against **"PRD v1.6"** and raised 2 conflicts,
3 coverage gaps and 1 process question. This document verifies **every claim
independently**, on evidence.

**His version citation is accurate.** The canonical Filters spec (Confluence page
**572030978**, space SHOPVIEW) is at Confluence **version 12 = body version 1.6**,
last updated **2026-07-28 by Branko Cicovic**. Pulled live this run via Confluence
REST, HTTP 200. Full verbatim body: `../spec-current-2026-07-31/Filters-spec-current.md`.
Requirement-level diff versus our V1.0 baseline: `../spec-current-2026-07-31/SPEC-DIFF.md`.

---

## Authority and precedence

Ahtesham is the **most junior QA on the team**. His report is an **input to be
evaluated on evidence — not an authority that overrules the QA lead's rulings, the
PO's rulings, or our own live-verified findings.** Every claim below is judged on
evidence rather than on who raised it; where he is right we say so plainly and adopt
it, and where he is wrong we say so without hedging.

**Precedence order used throughout this document** (newest authoritative product
source wins *within* the order):

| # | Source | Weight |
|---|---|---|
| **(a)** | **PO product rulings** — Branko, for Filters (answer sheets, direct rulings) | Highest. Overrides PRD prose he has not yet updated. |
| **(b)** | **QA-lead rulings** | Overrides our own reading and any reviewer's reading. |
| **(c)** | **Our own live-observed / verified findings** (Rules 12/13) | Overrides documents, but **we have none for Filters** — no QA branch exists yet. |
| **(d)** | **A reviewer's spec-reading claims** (Ahtesham's report) | Lowest. Useful as a detector; never self-executing. |

Two consequences applied below:

1. **CONFLICT 1 does not reverse a ruling.** The **QA-lead ruling of 2026-07-30** —
   verbatim *"Status chip is hidden on certain tabs = greyed-out/disabled"* — plus
   **Branko's Q4 = B answer of 2026-07-17** are tiers (b) and (a). They **stand.**
   Ahtesham's PRD-prose reading is tier (d) and does not displace them. His
   observation is still valuable because it exposed a **real internal inconsistency
   in our own run** — which we fix by aligning our cases **to the ruling**, not by
   adopting his interpretation.
2. **Where the gap is genuinely ours, we own it without softening.** The stale-spec
   baseline (V1.0 while the PRD reached v1.6) did cause real, listed coverage gaps.
   That one is on us — see §"What WE got wrong".

**Live-build status (Standing Rule 22).** **No claim in this document is
live-verified, and none can be:** the Filters QA branch/environment does not exist
yet (open item OQ-3 in `../PROJECT-STATE.md`); all 110 active cases are still
`VIU-Pending`. This verification is therefore **document-and-case-text evidence
only** — the current Confluence spec, Branko's ratified answer sheets, the tech plan,
the design capture, and the live TestRail case bodies. Every verdict below is
labelled as such. **Nothing here substitutes for the live VIU that must follow when
the branch lands.**

---

## (a) Mapping his T-numbers to our cases

Read from TestRail read-only (`get_run/352`, `get_tests/352` — `get_*` only, zero
writes), cross-referenced against `../testrail-id-map.csv`. **All seven map cleanly.**

| His T-number | TestRail case | Internal ID | Title | Section |
|---|---|---|---|---|
| T1762342 | **C29609** ([view](https://shopview.testrail.io/index.php?/cases/view/29609)) | **FLT-TAB-02** | On the Estimates tab the Status chip is shown greyed out, pre-filled with 'Status: Estimate', and cannot be changed… | Tab Behaviour |
| T1762343 | **C29610** ([view](https://shopview.testrail.io/index.php?/cases/view/29610)) | **FLT-TAB-03** | On the Completed tab the Status chip is shown greyed out, pre-filled with the tab's status, and cannot be changed… | Tab Behaviour |
| T1762292 | **C29559** ([view](https://shopview.testrail.io/index.php?/cases/view/29559)) | **FLT-BAR-03** | The filter bar still shows the remaining chips on a tab where the Status filter is hidden | Filter Bar Layout and Visibility |
| T1762345 | **C29612** ([view](https://shopview.testrail.io/index.php?/cases/view/29612)) | **FLT-TAB-05** | Filter selections survive tab switching; a Status selection hidden on Estimates/Completed comes back on the All tab | Tab Behaviour |
| T1762355 | **C29622** ([view](https://shopview.testrail.io/index.php?/cases/view/29622)) | **FLT-MOB-02** | Tapping All Filters opens a bottom sheet listing every filter as an expandable row with an Apply filters button | Mobile Filters |
| T1762356 | **C29623** ([view](https://shopview.testrail.io/index.php?/cases/view/29623)) | **FLT-MOB-03** | Selecting statuses in the mobile sheet and tapping Apply filters filters the list and counts on the sheet title | Mobile Filters |
| T1762357 | **C29624** ([view](https://shopview.testrail.io/index.php?/cases/view/29624)) | **FLT-MOB-04** | Tapping an individual filter chip on mobile opens that filter's own sheet with an 'Apply filter' button | Mobile Filters |

**Run facts.** Run 352 was **created 2026-07-17** and **last updated 2026-07-22**.
It contains exactly the **79 cases** we pushed on 2026-07-17 — verified: all 79 run
case-ids are in our id-map, and **zero** run cases are missing from the map. It is
the **only** Filters run in TestRail (checked all 250 runs in project 1). **It has
never been refreshed**, which is the single root cause of gap-claim §GAPS below.

---

## Verdict summary

| # | Claim | Verdict |
|---|---|---|
| 1 | **CONFLICT 1** — C29609/C29610 expect shown-disabled but PRD v1.6 says hidden; C29559/C29612 still assume hidden ⇒ run internally inconsistent | **PARTLY CORRECT** — the internal inconsistency is **REAL and must be fixed**; his conclusion that our cases are *wrong* is **INCORRECT** (a PO ruling and a QA-lead ruling both outrank the PRD prose) |
| 2 | **CONFLICT 2** — C29622/23/24 test a batch "Apply filters" sheet but S12-R2 says mobile is identical to desktop, no combined sheet | **PARTLY CORRECT** — he independently rediscovered a **known open Branko question** (C4 / Q4), but on the wrong case: C29624 is the genuine conflict; C29622/C29623 are design- and tech-plan-backed |
| 3 | **GAP** — no case for Imported exclusivity (S2-R7 / S2-N4) | **INCORRECT as to the case, CORRECT as to the run** — **FLT-STAT-07 = C38877** exists and covers it fully; it is simply not in run 352 |
| 4 | **GAP** — no case for Shared-URL runtime-only / no write-back (S11-R6) | **INCORRECT as to the case, CORRECT as to the run** — **FLT-URL-05 = C38879** exists and covers it fully |
| 5 | **GAP** — no case for "Back to my view" (S11-R7 / S11-N3) | **CORRECT (a genuine residual gap remains)** — partially covered by C38879, but the **query-clearing clause and the ratified label are untested and `S11-N3` has no case at all** |
| 6 | **QUESTION** — do Page Search (Story 13), Story-14 removal, and Parts/Reports get their own runs? | **CORRECT and well-aimed** — 31 of our 110 active cases sit outside run 352; a run refresh is required |

**Score: 1 fully correct, 4 partly correct, 1 incorrect-with-a-correct-corollary.**
He raised **zero** false alarms that cost nothing — every one of the six pointed at
something real, even where his diagnosis was wrong. That is a useful review.

---

## CONFLICT 1 — Status chip on Estimates / Completed

### What the CURRENT v1.6 spec says, verbatim (Rule 15/25 — no paraphrase)

> **S9-R2:** "On the Estimates tab, the Status filter chip is **hidden**; the remaining four filters are shown and apply on top of the Estimates pre-filter"
>
> **S9-R3:** "On the Completed tab, the Status filter chip is **hidden**; the remaining four filters are shown and apply on top of the Completed pre-filter"
>
> **S2-N1:** "On the Estimates tab, the Status filter chip is **not shown**: that tab already pre-filters by the Estimate status"
>
> **S2-N2:** "On the Completed tab, the Status filter chip is **not shown**: that tab already pre-filters by the Complete status"
>
> **§4 Key Decisions:** "Status filter is **hidden** on the Estimates and Completed tabs , because those tabs are shortcuts that already pre-filter by a single status, so showing a Status filter would be redundant and potentially confusing."
>
> **S1-N1:** "If no filters are available for the current tab (e.g., Estimates tab where Status is **hidden**), the filter bar still displays the remaining filter chips"

**He read the PRD correctly.** Five separate passages say hidden / not shown.

### The critical context he does not have

**Two higher-precedence rulings postdate and override that prose:**

1. **Branko (PO, tier (a)) — Round-1 Q4 answer, 2026-07-17.** He was asked this exact
   question and chose option **B**, recorded verbatim in
   `../branko-answers-2026-07-17/answers-ingested.md`: *"Shown but greyed out,
   pre-filled with the tab's status, and not clickable"*, and the ingest note reads
   *"supersedes the spec — the chip is **shown, disabled, pre-filled with the tab's
   status**"*. This matches final design frame `11972:32318`, which shows a pale
   chip reading "Status: Estimate".
2. **QA lead (tier (b)) — ruling of 2026-07-30**, verbatim: ***"Status chip is hidden
   on certain tabs = greyed-out/disabled."*** Recorded in
   `../tech-plan-2026-07-29/TECH-PLAN-DELTAS.md` (conflict C3, marked RESOLVED) and
   `../tech-plan-2026-07-29/Questions-for-Branko-dev.md` (Q1, marked RESOLVED).

**Both rulings stand. They are not reopened by this review.** Under the precedence
order above, a reviewer's PRD-prose reading (tier (d)) does not displace a PO ruling
(tier (a)) or a QA-lead ruling (tier (b)). Read together, the two readings describe
**the same intent**: on those tabs the Status filter is not *operable* — the app
renders it greyed-out and pre-filled rather than removing it from the DOM. So
**C29609 and C29610 are CORRECT as written** and must not be flipped to "hidden".

**One more fact that settles who is behind on what.** The "hidden" wording is
**byte-identical in V1.0 (Confluence v4, 2026-05-14) and v1.6 (Confluence v12,
2026-07-28)** — verified by diffing both bodies pulled live this run. **v1.6 did not
introduce this conflict, and our stale baseline did not cause it.** Branko has now
shipped **eight versions** without aligning his own Q4 = B answer into the PRD text.
That is a **PRD defect**, and it is why this will keep being re-raised by every
reviewer who reads only the PRD.

### His substantive point IS real — and this half we adopt

He is right that **our own run asserts both readings**. Full audit of all 110 active
cases for Status-chip-on-tab wording (not just the four he named):

| Case | C-id | In run 352 | Which side | Where exactly |
|---|---|---|---|---|
| **FLT-TAB-02** | **C29609** | YES | **shown-disabled** | Title **and** Expected 1: *"The Status chip is shown but greyed out, already filled in as 'Status: Estimate', and cannot be clicked or changed"* |
| **FLT-TAB-03** | **C29610** | YES | **shown-disabled** | Title **and** Expected 1: *"…shown but greyed out, already filled in with this tab's status, and cannot be clicked or changed"* |
| **FLT-BAR-02** | **C29558** | YES | **shown-disabled** | Precondition 3: *"on the Estimates and Completed tabs the Status chip is shown greyed out and already filled in, so the chips do not all look the same"* — **he missed this one** |
| **FLT-BAR-03** | **C29559** | YES | **"hidden" — title only** | Title: *"…on a tab where the Status filter is **hidden**"*. **Its Expected results are neutral** (they only assert the filter bar still shows and the remaining four chips are usable) and its own note says: *"This case only asserts the remaining four chips stay visible - true under either reading."* |
| **FLT-TAB-05** | **C29612** | YES | **"hidden" — title + one soft phrase** | Title: *"a Status selection **hidden** on Estimates/Completed comes back on the All tab"*; Expected 1: *"the Status selection is not applied and **not shown as an editable filter**"* — that phrase is compatible with greyed-out, but the title is not |
| FLT-CHIP-06 | C29600 | YES | *n/a* | False positive: "hidden" there refers to **work-order rows** being filtered out, not the chip |

**So: 3 cases say shown-disabled, 2 say hidden, and the 2 "hidden" ones carry it in
the TITLE (the field a tester reads first) while their testable Expected results are
neutral-to-ambiguous.** He named 2 of the 3 shown-disabled cases and 2 of the 2
hidden ones, and **missed FLT-BAR-02 = C29558** — a third case on the shown-disabled
side, in a precondition. His inconsistency finding is **real but incomplete**; the
corrected picture is above.

**Why this matters even though the behaviour is settled:** a manual tester opening
run 352 reads C29559's title ("…where the Status filter is hidden"), then C29609's
title ("…the Status chip is shown greyed out"), and cannot tell which to trust. Under
Rule 28 dimension 2 (**MAKES SENSE / coherence**) that is a genuine defect in our
suite regardless of which reading is right.

### Verdict: **PARTLY CORRECT**

- **On the internal inconsistency: CORRECT, and adopted.** Two case titles must be
  reworded to the ruling. Fix queued as **F1** in `FIX-PLAN.md`.
- **On "our cases are wrong / the PRD wins": INCORRECT.** A PO ruling (tier a) and a
  QA-lead ruling (tier b) both outrank PRD prose Branko has not updated. C29609 and
  C29610 stay as they are.
- **New action he correctly surfaces: the PRD needs Branko to align** `S9-R2`,
  `S9-R3`, `S2-N1`, `S2-N2`, `S1-N1` and §4 Key Decisions to his own Q4 = B answer.
  Queued as **B1** in `FIX-PLAN.md`. Until he does, every future reviewer re-raises
  this.

### Recommended single consistent wording

Standardise on the **ruling's** wording — *shown, greyed out, pre-filled, not
clickable* — and **never** use the bare word "hidden" in a tester-facing field. Do
**not** change C29609/C29610. Change only the two titles, and add one neutral
clarifier so both readings pass:

- **FLT-BAR-03 = C29559** — retitle from
  *"The filter bar still shows the remaining chips on a tab where the Status filter is hidden"*
  → **"The filter bar still shows the other four chips on the Estimates tab"** (68 chars, Rule-19/title-length compliant).
- **FLT-TAB-05 = C29612** — retitle from
  *"Filter selections survive tab switching; a Status selection hidden on Estimates/Completed comes back on the All tab"*
  → **"A Status choice is kept while you switch tabs and comes back on the All tab"** (74 chars). Also reword Expected 1's *"not shown as an editable filter"* → **"not applied and cannot be changed on this tab"**.

Exact before/after text for both is in `FIX-PLAN.md` §F1.

---

## CONFLICT 2 — mobile batch "Apply filters"

### What the CURRENT v1.6 spec says, verbatim

> **S12-R2:** "The filter chips behave identically to desktop: tapping a chip opens its dropdown, selections update the chip appearance, \"Clear filters\" appears when active"
>
> **S12-R1:** "The filter chips are displayed in a horizontally scrollable row below the tab navigation"
>
> **S12-R3:** "Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport"
>
> **S2-R6** (the desktop rule S12-R2 inherits): "The table filters in real time as the user makes selections (no confirm/apply button needed)"

**He read this correctly too.** Story 12 in v1.6 contains **no mention of a combined
"All Filters" sheet and no mention of an Apply button**, and `S12-R2` does inherit
desktop's real-time rule. Note also: **`S12-R2` is unchanged since V1.0** — again, our
stale baseline did not cause this.

### But this is already a known, logged, open question — and it is only open on ONE of his three cases

The gap is between the **spec** and the **final design + engineering plan**, both of
which we hold:

- **Design:** Figma node `11884:13689` is a combined accordion bottom sheet titled
  **"All Filters"** with a sticky **"Apply filters"** button. It exists in the
  ratified design set.
- **Tech plan, decision D15** (`../tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`), verbatim:
  > *"Mobile \"All Filters\" combined bottom sheet — **IN**, with an \"Apply filters\" button (batch-apply; **deliberate difference from desktop real-time**). **Individual chips/sheets stay real-time.**"*
- The plan builds `MobileAllFiltersSheet.vue` with test-id `apply_filters`, and
  `MobileFilterSheet.vue` where *"individual sheets stay **real-time** (S12-R2) — only
  the combined sheet batches."*

Splitting his three cases against that:

| Case | C-id | What it tests | Status |
|---|---|---|---|
| **FLT-MOB-02** | **C29622** | Combined "All Filters" sheet: accordion rows + sticky "Apply filters" button | **NOT a conflict with the build.** Design-backed (`11884:13689`) and explicitly **IN** per D15. The **spec is incomplete**, not the case wrong. |
| **FLT-MOB-03** | **C29623** | Ticking statuses in that sheet + tapping "Apply filters" filters the list; title shows a count | **NOT a conflict with the build.** Same basis. Its note already hedges correctly: *"VIU-confirm whether the list also live-updates before Apply."* |
| **FLT-MOB-04** | **C29624** | Tapping an **individual** chip opens that filter's own sheet **with an "Apply filter" button** | **THE GENUINE CONFLICT.** Contradicts **both** `S12-R2` **and** tech-plan D15 (individual sheets are real-time, no button). |

And **we already logged exactly this**, before his review:

- `../tech-plan-2026-07-29/TECH-PLAN-DELTAS.md` conflict **C4**, verbatim: *"**Mobile per-filter sheet: Apply button vs real-time** — Final design frames (11884:21065/21271) + our FLT-MOB-04 show an 'Apply filter' button vs D15: individual sheets are REAL-TIME, only the combined All-Filters sheet batches"*.
- `../tech-plan-2026-07-29/Questions-for-Branko-dev.md` **Q4** asks Branko to choose: *"**A)** Instantly as you tick, no Apply button (engineering plan)"* vs the design's button.
- **FLT-MOB-04 = C29624 already carries the flag in its own notes**, live in TestRail: *"CONFLICT - PENDING BRANKO/DEV (Questions Q4 / deltas C4): the design frames show an 'Apply filter' button, but the tech plan (D15) builds INDIVIDUAL filter sheets as real-time (no button) - only the combined All Filters sheet batch-applies. Verify live which one ships before failing this case."*

### Verdict: **PARTLY CORRECT — independent confirmation of a known open item**

**Ahtesham independently rediscovered our open Branko question Q4 / delta C4.** That
is a genuinely useful corroboration from a second reader who had neither the tech plan
nor the question sheet — it raises the priority of getting Branko's answer.

Where he is **wrong**: he attributes the conflict to all three cases. C29622 and
C29623 are design- and tech-plan-backed and should not be touched; the combined sheet
with batch Apply is a **deliberate, ratified difference from desktop**. The real
consequence is that **the spec's Story 12 is silent about a component the design and
the tech plan both build** — so `S12-R2`'s "identically to desktop" is
under-specified, and Branko should add the combined-sheet exception to Story 12.
Queued as **B2** in `FIX-PLAN.md`.

**One correction to our own side, which his review earns:** FLT-MOB-02/03 assert the
Apply button as settled fact with no pending-flag, while FLT-MOB-04 flags it. They
should all carry the same "confirm live which pattern ships" note so a tester is never
told to fail a case that is still an open product question. Queued as **F2**.

---

## THE GAPS — Imported exclusivity, URL runtime-only, "Back to my view"

### Framing: why he saw gaps that partly are not gaps

**Run 352 was created 2026-07-17 and last updated 2026-07-22.** On **2026-07-30** we
authored and pushed **15 new cases** (C38876–C38895) covering precisely the
tech-plan-derived areas he flags. **Those 15 cases are NOT in run 352** — verified:
79 run cases vs 94 mapped live cases, and the 15 newest are all absent from the run.
So **he is right that the RUN lacks coverage, and wrong that no CASE exists** — for
two of his three gaps. The third is a real residual gap.

### Gap 3 — Imported exclusivity (`S2-R7` / `S2-N4`): **INCORRECT as to the case, CORRECT as to the run**

**Verbatim v1.6:**

> **S2-R7:** "Imported is an exception to S2-R2 and cannot be combined with anything else. Imported work orders come from a different data source rather than being a status of the existing records, so selecting Imported **switches the list to the imported records and disables the other filter chips** while it is active. **Deselecting Imported returns the list and re-enables the other chips.** This is current production behaviour and is unchanged by this work"
>
> **S2-N4:** "Selecting Imported alongside another status, customer, technician, advisor or asset filter is **not a supported combination and is prevented by S2-R7 rather than returning an empty result**"

**The case exists: FLT-STAT-07 = C38877** ([view](https://shopview.testrail.io/index.php?/cases/view/38877)) — *"Imported works alone: picking it greys out the other filters"*, in the Status Filter section. Its Expected results, live in TestRail:

> 1. The table switches to showing imported work orders only.
> 2. While Imported is ticked, the other filter chips are greyed out and cannot be used.
> 3. Imported cannot be combined with other statuses - selecting it works alone.
> 4. Unticking Imported re-enables the other chips and the normal list returns.

**Clause-by-clause coverage check — `S2-R7` is fully covered:** "switches the list to
the imported records" → Expected 1. "disables the other filter chips while it is
active" → Expected 2. "Deselecting Imported returns the list and re-enables the other
chips" → Expected 4. **`S2-N4` is covered** by Expected 3 combined with Expected 2
(prevention, not an empty result). **Genuine coverage: yes, complete.**

**Two real defects in the case that his review exposes anyway:**
- Its `spec_ref` reads *"tech plan 2026-07-29 G1 (Imported exclusivity); spec S2-R1 (conflict raised with the author - **export of spec v1.3 awaited**)"* — **the export is no longer awaited and the conflict is resolved**: v1.4 added `S2-R7`, which says exactly what we test. **Rule-20 traceability is stale.**
- Its note says *"PENDING BRANKO (Questions Q3 / deltas C2): spec S2-R1 lists Imported as a plain status; engineering G1 builds it mutually exclusive"* — **that question is answered by the PRD.** Branko Q3 can be **withdrawn**.

Queued as **F3** (metadata + note) and **B3-withdraw**.

### Gap 4 — Shared-URL runtime-only / no write-back (`S11-R6`): **INCORRECT as to the case, CORRECT as to the run**

**Verbatim v1.6:**

> **S11-R6:** "Filter state arriving from a URL **applies at runtime only**. It **never overwrites the user's saved filter state** (S10-R2). **Changes the user makes to filters while viewing a shared link are also not written back** to their saved state: the entire visit is treated as a temporary view"

**The case exists: FLT-URL-05 = C38879** ([view](https://shopview.testrail.io/index.php?/cases/view/38879)) — *"Opening a filtered link never overwrites your saved filters"*, in the URL State and Shareable Links section. Expected results:

> 1. The link's filters apply for viewing only - the page shows the shared view.
> 2. Changes made during the link visit are also NOT saved to your account.
> 3. The go-back option restores your own saved filters and removes the filter part from the address bar.
> 4. Returning normally later still shows your own saved filters, untouched by the link visit.

**Clause-by-clause — `S11-R6` is fully covered:** "applies at runtime only" → Expected
1. "never overwrites the user's saved filter state" → Expected 4. "Changes … are also
not written back" → Expected 2. **Genuine coverage: yes, complete.** Same stale-`refs`
defect as above (its note says *"spec v1.3 export awaited"* and *"engineering reports
the spec author agreed in page comments"* — **v1.4 ratified it; stop hedging**).
Queued as **F4**. Branko Q2 can be **withdrawn** (**B4-withdraw**).

### Gap 5 — "Back to my view" (`S11-R7` / `S11-N3`): **CORRECT — a genuine gap remains**

**Verbatim v1.6:**

> **S11-R7:** "While viewing filter state that arrived from a URL, a **\"Back to my view\"** action is available. It discards the shared view and restores the user's own saved filters. **It also clears any active search query**, because the query is not part of saved state and there is nothing to restore it to. The label is deliberately \"my view\" rather than \"my filters\", since the action affects both filters and search"
>
> **S11-N3:** "**\"Back to my view\" is not shown** when the user is viewing their own state rather than state that arrived from a URL"

**This one he gets right, and it is on us.** Checking FLT-URL-05 = C38879 clause by clause:

| `S11-R7` / `S11-N3` clause | Covered? | Evidence |
|---|---|---|
| The action **exists** while viewing URL state | **YES** | Step 4: *"Use the on-screen option to go back to your own saved filters"* |
| It **restores the user's own saved filters** | **YES** | Expected 3 |
| **The label is "Back to my view"** | **NO** | The case deliberately avoids naming it; its note says *"The 'back to my saved filters' control name is engineering intent - capture the real on-screen text live."* **The name was ratified in v1.5 (2026-07-27) — it is no longer engineering intent, it is spec.** Rule 9 requires the build-accurate label. |
| **It also clears any active search query** | **NO — untested anywhere** | No case in the suite asserts that the go-back action clears the query. Cross-checked all 110 active cases. |
| **`S11-N3`: not shown when viewing your own state** | **NO — no case at all** | Nothing in the suite asserts the control is **absent** on a normal visit. The negative direction is entirely uncovered. |

**So "Back to my view" needs work beyond FLT-URL-05:** the label must be corrected
into C38879 (Rule 9), the query-clearing clause needs a step+expected added to
C38879, and **`S11-N3` needs its own new case** — a negative is a distinct
observable behaviour and does not belong bolted onto a positive case (Rule 28
dimension 1: distinct observable behaviour, failure = a real reportable bug).

Queued as **F5** (edit C38879: label + query-clear) and **F6** (new case
FLT-URL-06 for `S11-N3`).

**Related, same root cause, which he did not reach but we own:** `S11-R8` (rationale
clause — recommend **no case**, cite as rationale on FLT-PSRCH-04 = C38888) and
`S11-R5` (URL carrying a **search query** — covered by FLT-PSRCH-04 but with stale
`refs`).

---

## His runs question — do Page Search, Story 14, and Parts/Reports get their own runs?

**Verdict: CORRECT and well-aimed. A run refresh is required, and it is overdue.**

Facts, read live from TestRail and our id-map:

- **Run 352 is the ONLY Filters run in TestRail** (checked all 250 runs in project 1).
- It holds **79** cases — exactly our 2026-07-17 push, never refreshed.
- We now have **110 ACTIVE** authored cases, of which **94 are live in TestRail** and **16 have never been pushed** (blank C-ids).
- **31 of the 110 active cases are outside run 352.**

Breakdown of the 31:

| Group | Cases | C-ids | In TestRail? |
|---|---|---|---|
| **Page Search — toolbar (Story 13)** | FLT-PSRCH-01…07 (7) | C38883, C38884, C38886, C38888, C38889, C38891, C38893 | YES — pushed 2026-07-30, not in any run |
| **Story 14 (global search de-filtering)** | covered by **FLT-PSRCH-07 = C38893** | C38893 | YES — same |
| **Page Search — spotlight/palette set** | FLT-SRCH-01…09 (9) | **all blank** | **NO — never pushed.** HELD by user ruling 2026-07-31 pending Branko's Q6 (Global-Search ownership). §4 Group D of `../spec-current-2026-07-31/SPEC-DIFF.md` now gives strong spec evidence these belong to Global Search v2, not Filters Story 13 — but the hold stands until Branko confirms. |
| **Parts filters** | FLT-PARTS-01, 09, 11, 12 (4) | **all blank** | **NO — never pushed** (post-audit consolidation survivors) |
| **Reports filters** | FLT-RPTS-01, 21, 22 (3 blank) + FLT-RPTS-23 (C38882) | C38882 + 3 blank | 1 in TestRail, 3 never pushed |
| **Tech-plan / gap cases (2026-07-30 push)** | FLT-TAB-06, FLT-STAT-07, FLT-ASSET-07, FLT-URL-05, FLT-PERS-05, FLT-PERS-06, FLT-API-06 (7) | C38876, C38877, C38878, C38879, C38880, C38881, C38895 | YES — pushed 2026-07-30, not in any run |

### Recommended answer to give him

1. **No new separate runs.** Filters is one suite under TestRail group **4110**; a
   second run would fragment the picture and duplicate the Story-13 cases that
   overlap Global Search. **Refresh run 352 in place** (or supersede it with a single
   "Filters — v1.6" run) once the fix queue below is pushed.
2. **Do not refresh yet.** Refreshing now would pull in cases we are about to edit
   (F1–F6) and would import the 9 held `FLT-SRCH-*` cases whose ownership Branko has
   not settled. Sequence: **push the fix queue → get Branko's answers → then rebuild
   the run.**
3. **Page Search / Story 14 belong in the Filters run** — they are Filters spec
   Stories 13 and 14 (`S13-*`, `S14-*`), ratified in the Filters PRD v1.2. Their
   coverage is `FLT-PSRCH-01…07`.
4. **Parts and Reports belong in the same run too**, but **7 of their 11 cases have
   never been pushed to TestRail** — that must happen first (needs authorization).
5. **The `FLT-SRCH-*` nine are the genuine open question**, and it is a *product
   ownership* question for Branko, not a run-structure question. He should not plan
   around them until Branko answers.

---

## What WE got wrong — honest assessment

Blunt, no softening.

### 1. We were 8 Confluence versions behind, and it caused real gaps. **This is on us.**

`requirements.md` still carries the header *"✅ SPEC CONFIRMED CURRENT (designer, via
the user, 2026-07-17): this ingested Filters spec V1.0 is confirmed the LATEST
version."* **That statement has been false since 2026-07-26**, when Branko published
v1.2. We never re-checked. **Standing Rule 23 exists precisely to prevent this** —
*"ALWAYS check the CURRENT Confluence spec … do NOT assume the local copy is up to
date"* — and we did not run it on Filters, even while running a tech-plan
reconciliation on 2026-07-29 and a full quality audit on 2026-07-31, either of which
was the natural moment to re-pull the page.

### 2. The concrete cost: we spent effort asking Branko questions the PRD already answered.

Three of the open questions in `../tech-plan-2026-07-29/Questions-for-Branko-dev.md`
were **already answered in spec v1.4, published 2026-07-27** — before we wrote the
question sheet dated 2026-07-30:

| Our question | Already ratified in | Verdict |
|---|---|---|
| **Q3** — Should Imported work alone and grey out the other chips? | **`S2-R7`** (v1.4) — says exactly that | **Withdraw the question** |
| **Q2** — Does a shared URL overwrite saved filters, or apply runtime-only? | **`S11-R6`** (v1.4) — runtime-only, no write-back | **Withdraw the question** |
| The "back to my saved filters" control name | **`S11-R7`** (v1.5) — ratified as **"Back to my view"** | **Withdraw; use the ratified label** |

We also left **six cases** (FLT-STAT-07/C38877, FLT-URL-05/C38879, and
FLT-PSRCH-01…07's `spec_ref` fields) carrying the phrase *"spec v1.3 export awaited"*
or *"not in the ratified product spec"*. **The spec was not awaiting export — it was
live on Confluence and readable the whole time.** That is a **Rule 20 traceability
failure** across those cases: they cite tech-plan decision IDs where a ratified spec
anchor existed.

### 3. Genuinely uncovered requirements caused by the stale baseline

| Area | Uncovered | Why |
|---|---|---|
| **Story 13 — Page Search** | ~20 of 29 requirements | Ratified 2026-07-26 (v1.2), refined v1.4/v1.5/v1.6. We authored this area from **Figma + the tech plan** instead. Missing: the four component states and their exact labels/colours (`S13-R2`–`R6`, incl. the placeholder **"Type to search"**), the **300ms debounce** and v1.6's **350ms Inventory exception** (`S13-R7`), long-query behaviour (`S13-R8`), active-tab-only scoping (`S13-R11`/`R24`), in-place results (`S13-R12`), browser-tab session retention (`S13-R14`/`R25`/`S13-N4`), the three mobile layout mechanics (`S13-R17`–`R20`), and negatives `S13-N1`/`N2`/`N3`. |
| **Story 14 — Global search de-filtering** | 5 of 7 requirements | Only `S14-R2`/`R5` are touched (FLT-PSRCH-06/07). Missing: `S14-R1` (navigational results only), `S14-R3` (**removed, not flagged or dormant**), `S14-R4` (list untouched), `S14-R6` (**42 surfaces / 39 components** audit — WO Parts explicitly excluded), `S14-N1` (page search is a hard prerequisite). |
| **Story 11 residue** | `S11-N3`; the query-clearing half of `S11-R7` | The precise gap Ahtesham identified. |
| **Story 8 empty state** | `S8-R5`; broadened `S8-R3`/`S8-R4` | Empty state must now mention **and clear the query** independently. Our empty-state cases speak of filters only. |

### 4. Our own suite is internally inconsistent on the Status chip — and a reviewer found it before we did.

The 2026-07-31 quality audit ran all three Rule-28 dimensions over these same 110
cases and **did not flag the "hidden" vs "shown-greyed-out" title clash**, even though
dimension 2 (**MAKES SENSE / coherence**) exists to catch exactly this: fail condition
*"internal contradiction"*, applied across the suite and not just within one case. A
junior reviewer reading the run cold caught it. **That is a gap in how we ran the
audit — contradiction-hunting must be done ACROSS cases in a run, not case by case.**
Folding that lesson into `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` is queued as
**P1** in `FIX-PLAN.md`.

### 5. What we did NOT get wrong — stated equally plainly

- **The Status-chip behaviour itself.** C29609/C29610 follow Branko's Q4 = B answer
  and the QA-lead ruling. The **PRD prose is the stale artifact**, and its text is
  unchanged since V1.0 — our being behind is irrelevant to it. **The rulings stand.**
- **The mobile combined "All Filters" sheet.** C29622/C29623 are design- and
  tech-plan-backed (`11884:13689`, D15 = **IN**). Not a defect.
- **Imported exclusivity and URL runtime-only.** Both **were** authored and pushed
  (C38877, C38879) and both **genuinely cover** their requirements clause by clause.
  Only the traceability metadata is stale.
- **Persistence.** `S10-R2`'s big flip to server-side per-account was already absorbed
  via Branko's Q2 answer and is tested by **FLT-PERS-02 = C29614**. The PRD caught up
  to us, not the reverse.

### 6. The process lesson

**Run Standing Rule 23 (re-pull the Confluence page) at the START of every Filters
touch — the tech-plan pass, the quality audit, and any authoring pass — not just when
a spec is handed to us.** A PO who edits his PRD eight times in six weeks without
telling QA is the normal case, not the exception. A one-command version check
(`GET /wiki/rest/api/content/{id}?expand=version`) would have caught this on
2026-07-27, before we wrote a question sheet against a superseded document.

---

## Prioritized fix list

Full detail, exact proposed wording, and the Rule-28 three-dimension pre-check are in
**`FIX-PLAN.md`**. Summary:

### Case edits — 6 items (P1 = blocking a run refresh)

| # | Priority | Cases | Action |
|---|---|---|---|
| **F1** | **P1** | FLT-BAR-03 **C29559**, FLT-TAB-05 **C29612** | Retitle away from "hidden" to the ruling's wording; reword C29612 Expected 1. **Resolves the internal inconsistency.** |
| **F2** | P2 | FLT-MOB-02 **C29622**, FLT-MOB-03 **C29623** | Add the same "confirm live which pattern ships" note FLT-MOB-04 already carries. |
| **F3** | P2 | FLT-STAT-07 **C38877** | Re-point `refs`/`spec_ref` to `S2-R7` + `S2-N4`; delete the resolved PENDING-BRANKO note. |
| **F4** | P2 | FLT-URL-05 **C38879** | Re-point `refs` to `S11-R6`/`S11-R7`; delete the resolved PENDING note. |
| **F5** | **P1** | FLT-URL-05 **C38879** | Use the ratified label **"Back to my view"**; add a step + expected for **"it also clears any active search query"**. |
| **F6** | **P1** | **NEW** FLT-URL-06 (no C-ID yet) | New negative case for **`S11-N3`** — "Back to my view" is **not shown** on a normal visit. |
| **F7** | P3 | 7 × FLT-PSRCH + FLT-TAB-06 **C38876** | Replace *"spec v1.3 (export awaited)"* / *"not in the ratified product spec"* with live v1.6 anchors (Rule 20). |

### New cases for the v1.6 delta — ~28 (P2, needs authoring authorization)

- **Story 13 Page Search:** ~20 cases — component states + exact labels, 300ms debounce (+350ms Inventory), long queries, active-tab scoping, in-place results, browser-tab session retention, 3 mobile layout mechanics, negatives.
- **Story 14:** ~5 cases — navigational-results-only, removed-not-dormant, list-untouched, the 42-surface audit, the hard-prerequisite negative.
- **Story 8:** ~2 cases — query in the empty state; independent clearing (`S8-R5`).
- **Story 11:** F6 above.

**Blocked by the spec itself:** `S13-R23` states verbatim *"**Pending:** the per-table
list of fields currently covered, from engineering. Until it exists the searchable set
is undocumented and **QA has no baseline to test against**."* Per-page search-field
cases cannot be authored until engineering supplies that list.

### Branko questions — 4 new, 3 withdrawals

| # | Item |
|---|---|
| **B1** | **Align the PRD to your own Q4 = B answer.** `S9-R2`, `S9-R3`, `S2-N1`, `S2-N2`, `S1-N1`, §4 Key Decisions all still say the Status chip is "hidden"/"not shown" on Estimates and Completed, but you ruled 2026-07-17 that it is **shown greyed-out and pre-filled**. Unchanged across 8 versions; every reviewer re-raises it. |
| **B2** | **Story 12 is missing the combined mobile sheet.** `S12-R2` says mobile is identical to desktop, but design `11884:13689` and tech-plan D15 both build an **"All Filters"** sheet with a batch **"Apply filters"** button. Please add the exception. |
| **B3** | **Still open (unchanged): do INDIVIDUAL mobile filter sheets have an Apply button, or are they real-time?** Design frames show a button; D15 says real-time. **Ahtesham independently confirmed this gap — please prioritise.** |
| **B4** | **Do the 9 spotlight-style page-search cases belong to Filters or Global Search v2?** v1.6 Story 13 describes an in-toolbar input that narrows the current table only (`S13-R12`, `S13-R22`, §4 Key Decisions), **not** a cross-entity palette with entity tabs / grouped counts / recents. Strong evidence they are Global Search v2. Still held pending your confirmation per the user ruling of 2026-07-31. |
| **B3-withdraw** | Withdraw old **Q3** (Imported exclusivity) — answered by `S2-R7` (v1.4). |
| **B4-withdraw** | Withdraw old **Q2** (URL overwrite vs runtime-only) — answered by `S11-R6` (v1.4). |
| **B5-withdraw** | Withdraw the "back to my saved filters" naming question — ratified as **"Back to my view"** in `S11-R7` (v1.5). |

### Run refresh — 1 item

| # | Item |
|---|---|
| **R1** | Refresh run 352 (or supersede with "Filters — v1.6") to the full active suite. **Sequenced AFTER** F1–F7 are pushed, the ~28 new cases are authored, the 16 blank-C-id cases are pushed, and Branko has answered **B4**. Currently **31 of 110 active cases sit outside the run.** |

### Process — 1 item

| # | Item |
|---|---|
| **P1** | Fold two lessons in: (i) **Standing Rule 23** — re-pull the Confluence page version at the start of every project touch, not only when handed a spec; (ii) **Rule 28 dimension 2** — hunt contradictions **ACROSS cases within a run**, not case by case. A junior reviewer beat our own audit to this one. |

---

## Honesty statement (Standing Rules 12 / 22)

- **Nothing in this document is live-build verified.** No Filters QA branch/environment exists (OQ-3); all 110 active cases are `VIU-Pending`. Every verdict rests on document evidence: the live Confluence spec v1.6, Branko's ratified answer sheets, the tech plan, the design capture, and case bodies read live from TestRail.
- **TestRail access this run was strictly READ-ONLY** — `get_run/352`, `get_tests/352`, `get_runs/1` only. **Zero writes**: no `add_case`, no `update_case`, no `delete_case`, no run or result writes. All fixes above await user authorization.
- **The Confluence read was authenticated and successful** (HTTP 200 on `/rest/api/3/myself` and on the content endpoint). No spec content is inferred or reconstructed — the body in `../spec-current-2026-07-31/Filters-spec-current.md` is verbatim from `body.storage`.
- **The 350ms Inventory debounce (v1.6) and the 42-surface `S14-R6` audit list are read from the spec, not verified against the build.** They become VIU items when the branch lands.
- **What we cannot yet judge:** whether the build actually renders the Status chip greyed-out or removes it; whether individual mobile sheets ship with an Apply button; whether the page-search control matches `S13-R2`–`R6`. All three need the live VIU that Rule 22 requires and that no amount of document analysis replaces.

