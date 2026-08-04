# Filters — PO-RULING DEFENCE REGISTER

**Why this file exists.** QA lead's ruling, verbatim 2026-08-04:
*"For now keep what Branko said, but if we are questioned we should have a reference to
present in our defense."*

So: Branko's rulings **stand** as the cases' position (Rule 32 latest authoritative
product source wins; Rule 33 the PO outranks spec prose), and every one of them is
**provable here without a scramble**.

**Scope:** the 110 active Filters cases, all live in TestRail group 4110.
**Sources current as of 2026-08-04** — see `SOURCE-CURRENCY.md`. Spec = Confluence page
**572030978**, body version **1.6**, Confluence version **14**, updated 2026-07-28.
Epic = **SV-8785** (discovered 2026-07-31, verified live 2026-08-04).

> # ⬆️ UPDATED 2026-08-04 (later the same day) — **BOTH HIGH-RISK ENTRIES ARE RETIRED**
>
> **Branko answered the tech-plan sheet — 9 of 9 questions.** Two of his answers settle the two
> groups that carried the only HIGH risks in this register.
>
> | Was | Now |
> |---|---|
> | **Group C — 7 cases, NO ruling of any kind, 2 of them HIGH risk**, with the register conceding *"if Branko says mobile behaves exactly like desktop, these two cases are wrong and we concede them"* | **GROUP C IS CLOSED. There is nothing to concede.** His **Q1 = "A - no apply button"** adopts the engineering plan's model, which **keeps** the "Apply filters" button on the combined All Filters sheet. All 7 move to the new **Group A2**. |
> | **Group D — FLT-TAB-06 rated HIGH**, because an engineering plan is not a product decision (Rule 30) and *"if Branko says the default tab is All, the case is wrong"* | **HIGH RETIRED.** His **Q2 = "A - it's fine"** confirms Estimates as the first-visit tab. It moves to **Group A2**; Group D keeps 1 case at MEDIUM. |
>
> **Revised headline: HIGH ×0.** Source of record for both rulings, with the verbatim words and the
> full proof of receipt: **`../branko-answers-2026-08-04/answers-ingested.md`**. Staged case
> operations: **`../branko-answers-2026-08-04/staged-case-plan.md`** — **nothing executed.**
>
> **The provenance lines in TestRail have NOT yet caught up.** Nine cases still end with *"a product
> owner decision is still awaited"*, which became **false on 2026-08-04**. Those are the 10 staged
> `update_case` operations, and they await the QA lead's go-ahead (Rule 6). **Until they are pushed,
> this register is the only place the correct position is written down.**

## Headline counts

| Category | Cases | Risk if challenged |
|---|---|---|
| **A — PO ruling overrides live spec text** (2026-07-17 ruling) | **4** | LOW ×4 |
| **A2 — PO ruling of 2026-08-04 settles what had no ruling** | **8** | LOW ×8 |
| **B — spec covers the area in prose only; PO answers supply the detail** | **9** | LOW ×7 · MEDIUM ×2 |
| **C — agreed design, spec silent/contrary, NO ruling yet** | **0** | **CLOSED 2026-08-04** |
| **D — no numbered requirement at all** | **1** | MEDIUM ×1 |
| **Total carrying a non-plain provenance line** | **22 of 110** | **HIGH ×0** |

**Movements on 2026-08-04:** Group C 7 → **0** (all 7 to A2) · Group D 2 → **1** (FLT-TAB-06 to A2)
· Group A2 **created with 8** · Group B unchanged in size, **B1 and B5 down-rated** on new
corroboration (§B). **One case leaves the non-plain population and one joins it**, so the total
holds at 22: **FLT-MOB-04 becomes `plain`** (his ruling makes it agree with the spec outright) and
**FLT-TAB-06 stays non-plain** under a new honest variant.

**Ruling wording NOT established: 0.** Every ruling below is quoted verbatim from an
ingested record with a repo path and a question number.

---

## A2 — THE RULING OF 2026-08-04 SETTLES WHAT PREVIOUSLY HAD NO RULING (8 cases)

**This group did not exist before 2026-08-04.** It holds the cases that were the register's real
exposure — the 7 mobile cases of old Group C (2 rated HIGH) and FLT-TAB-06 of old Group D (rated
HIGH) — now backed by a PO decision.

### A2-i · The mobile cluster — 7 cases

**Branko's ruling, VERBATIM (2026-08-04, tech-plan sheet Q1):**

> **"A - no apply button"**

**…where option A as sent read:** *"Instantly as you tick, no Apply button (**the engineering plan's
way**)."* — and the question's own *What happens now* column, which he read, defined that model:
*"the engineering plan makes single-filter windows apply INSTANTLY as you tick (no button) - **only
the combined "All Filters" window keeps an "Apply filters" button**."*

**The engineering plan he thereby adopted, VERBATIM** —
`build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`, decision **D15**:

> *"Mobile "All Filters" combined bottom sheet — **IN**, with an "Apply filters" button (batch-apply;
> deliberate difference from desktop real-time). Individual chips/sheets stay real-time."*

**Source of record:** `../branko-answers-2026-08-04/answers-ingested.md` §2 (verbatim answers) and
§3.1 (consequences). Raw file
`../branko-answers-2026-08-04/PO-Questions-Branko-Filters-TechPlan_ANSWERED-2026-08-04.xlsx`.

**⚠️ THE ONE HONEST QUALIFICATION — state it before anyone else does.** His ruling has two halves and
they are not equally direct. The **single-filter sheet has no Apply button** is his own typed
sentence. The **combined sheet keeps its button** is an **endorsement by option-selection** — he chose
an option that named the engineering plan's model, and the text he read spelled out the exception, but
he did not write that sentence himself. **Three sources agree** (his selected option · tech plan D15 ·
the agreed design `11884:13689`), which is why the risk is **LOW** rather than nil. A one-line
confirmation is drafted and marked **optional** in
`../branko-answers-2026-08-04/FOLLOW-UPS-2026-08-04.md` §1.

**What the spec still says, and why the ruling wins anyway:**

- **S2-R6 (VERBATIM):** *"The table filters in real time as the user makes selections (no
  confirm/apply button needed)"*
- **S12-R2 (VERBATIM):** *"The filter chips behave identically to desktop: tapping a chip opens its
  dropdown, selections update the chip appearance, "Clear filters" appears when active"*

A full-text scan of the live v1.6 body finds **`"Apply filters"` 0 times**, and the only *"All
Filters"* hit is `S8-R1`'s phrase *"across all filters"* — **the combined screen is nowhere in the
document.** The ruling is the newer authoritative product source (Rule 32) and the PO outranks spec
prose (Rule 33).

**Who can close it:** **Branko**, by describing the mobile All-Filters sheet in Story 12 of the PRD.
**That ask is open** — see the OUTSTANDING table at the end.

| # | Case | What our case asserts (quoted) | Risk |
|---|---|---|---|
| A2-1 | **FLT-MOB-01** · [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | chip row *"starting with an 'All Filters' chip (with a filter icon)"* | LOW |
| A2-2 | **FLT-MOB-02** · [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | *"A sticky blue 'Apply filters' button sits at the bottom of the sheet."* — **was the register's joint-highest risk; now PO-endorsed** | LOW |
| A2-3 | **FLT-MOB-03** · [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | *"After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses."* — **was the other joint-highest; now PO-endorsed** | LOW |
| A2-4 | **FLT-MOB-05** · [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | customer filter inside the sheet, then *"tap 'Apply filters'"* | LOW |
| A2-5 | **FLT-MOB-06** · [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | tech/advisor accordions, then Apply | LOW |
| A2-6 | **FLT-MOB-07** · [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | asset-on-site accordion, then Apply | LOW |
| A2-7 | **FLT-MOB-08** · [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | active chips + Clear filters, reached *"via the sheet"* | LOW |

**PASTE-READY ANSWER (all seven):**
> On a phone our tests describe a combined "All Filters" window with an "Apply filters" button at the
> bottom, and single filter windows that apply straight away with no button. Branko confirmed that on
> 4 August 2026: he chose the engineering team's approach, where a single filter window applies
> instantly and only the combined window keeps its button. The written description does not describe
> the combined window at all and says elsewhere that filters apply straight away, so the document and
> the tests still look like they disagree — Branko needs to add that window to the description. The
> tests follow his decision, because the newest product decision wins. We have not yet been able to
> check any of this on a real build, because the Filters test environment has only just arrived and
> we have not been given the go-ahead to test on it.

**⚠️ FLT-MOB-04 · [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) LEAVES THIS
REGISTER ALTOGETHER — and two corrections belong on the record.**

1. **It becomes `plain`.** It asserts the **single-filter** sheet, and live it reads: *"There is **no
   'Apply filter' button**. Ticking/unticking a status filters the work-order list **immediately**,
   the same as desktop."* With his ruling, that **agrees with the spec outright** — `S12-R3` gives the
   bottom sheet, `S12-R2` says mobile behaves identically to desktop, `S2-R6` says desktop is
   real-time with no apply button. **Nothing to defend.** It needs no entry here.
2. **THIS REGISTER PREVIOUSLY MIS-DESCRIBED IT, and the miss was ours (Rule 44 — judge our own side
   first).** Old row C4 read *"single chip applies live, 'no Apply filter' button — this half agrees
   with S2-R6"*. That described **live TestRail** correctly but **not the local case source**, which
   asserted the **opposite**: *"The bottom button reads 'Apply filter' (singular); tapping it applies
   the selection and filters the list."* **The local source is stale and contradicts Branko's
   ruling; live is correct.** Escalated for reconciliation — `cases/` was out of that pass's scope.
   Detail: `../branko-answers-2026-08-04/staged-case-plan.md` §1.2.

### A2-ii · The first-visit tab — 1 case

**Branko's ruling, VERBATIM (2026-08-04, tech-plan sheet Q2):**

> **"A - it's fine"**

**…where option A as sent read:** *"Yes - Estimates first is fine."*, answering *"Is Estimates the
right tab to open first for a brand-new visit?"* — and the question told him plainly that **All** is
the first tab in the row. **He still said Estimates.**

**Source of record:** `../branko-answers-2026-08-04/answers-ingested.md` §3.2.

**Why this matters more than its single case suggests:** it converts an **engineering** decision into
a **product** decision. Rule 30 is explicit that engineering intent never overrules product truth, so
before this answer the case rested on a source that could not settle it. **That is exactly why it was
rated HIGH, and exactly why the HIGH is now gone.**

**Spec position (re-verified live 2026-08-04): SILENT.** v1.6 contains **no requirement** for a
default tab or a last-used tab. So there is nothing for the ruling to override — it fills a silence.

**Who can close it:** **Branko**, by writing the default tab into the PRD. **That ask is open.**

| # | Case | What our case asserts (quoted) | Risk |
|---|---|---|---|
| A2-8 | **FLT-TAB-06** · [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | *"On the very first visit the Estimates tab is the selected one, even though All is the FIRST tab in the row (order and default are different on purpose)."* | LOW |

**Note on its provenance line:** it must **not** be re-stamped with the ordinary PO-ruling wording,
because that would name the spec as a source for a point the spec does not cover — Rule 54's honesty
clause. The staged line reads: *"This is the expected behaviour as per epic SV-8785 and a product
owner decision dated 2026-08-04. No numbered requirement in the Filters specification version 1.6
covers this point."* Both halves are true.

**PASTE-READY ANSWER:**
> When someone opens the redesigned Work Orders page for the very first time, our test says the
> Estimates tab is the one selected, even though All sits first in the row. That was originally an
> engineering choice, made to keep the heaviest list off the landing page, and the written
> description does not mention it at all. We asked Branko whether Estimates is the right tab to open
> first and on 4 August 2026 he answered "it's fine". So the test follows his decision. He still
> needs to add it to the written description.

---

## A — PO RULING OVERRIDES THE LIVE SPEC TEXT (4 cases)

### The one ruling behind all four

**Branko's ruling, VERBATIM (2026-07-17, Round-1 Q4, answer B):**

> **"B"** — where option B as sent read: *"Shown but greyed out, pre-filled with the
> tab's status, and not clickable (as the design picture shows)."*

**Source of record:** `build/filters/branko-answers-2026-07-17/answers-ingested.md`
§1 (verbatim answers table) + §2 "Q4 = B". Raw file
`branko-answers-2026-07-17/branko-answers-raw-export.xlsx`.

**Confirmed again by Branko 2026-07-20 (Round-2 Q1, answer "a")** — he agreed to *fix*
the two stale spec sentences: source
`build/filters/branko-answers-round2-2026-07-20/answers-ingested.md` §1 Q1.
**He has not done so: v1.6 (2026-07-28) still says "hidden".**

**QA lead's own ruling on top (2026-07-30):** the tech plan's *"hidden"* and Branko's
*"greyed-out/disabled"* **describe the same behaviour**, so the cases stand as pushed.
Source: `build/filters/PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` line 193.
**This is why the risk is LOW rather than MEDIUM** — the QA lead has already adjudicated
that there is no real behavioural disagreement, only wording.

**What the spec says — VERBATIM, all five places, spec v1.6:**

- **S1-N1:** *"If no filters are available for the current tab (e.g., Estimates tab where
  Status is hidden), the filter bar still displays the remaining filter chips"*
- **S2-N1:** *"On the Estimates tab, the Status filter chip is not shown: that tab already
  pre-filters by the Estimate status"*
- **S2-N2:** *"On the Completed tab, the Status filter chip is not shown: that tab already
  pre-filters by the Complete status"*
- **S9-R2:** *"On the Estimates tab, the Status filter chip is hidden; the remaining four
  filters are shown and apply on top of the Estimates pre-filter"*
- **S9-R3:** *"On the Completed tab, the Status filter chip is hidden; the remaining four
  filters are shown and apply on top of the Completed pre-filter"*

**Why the ruling wins:** it is the newer authoritative product source (Rule 32) and the
PO outranks spec prose (Rule 33) — and the QA lead has ruled the two readings describe
the same behaviour.

**Who can close it:** **Branko**, by editing the five spec passages. **The ask is already
on his plate** (he committed to it on 2026-07-20 and it is FIX-PLAN item **B1**), but it
is **not on a currently-outstanding sheet** — see the OUTSTANDING note at the end.

| # | Case | What our case asserts (quoted) | Risk |
|---|---|---|---|
| A1 | **FLT-BAR-03** · [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) — *The filter bar still shows the other four chips on the Estimates tab* | *"The Status chip is not usable on this tab: it is shown greyed out and already filled in with the tab's own status, and cannot be clicked."* | LOW |
| A2 | **FLT-TAB-02** · [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) — *Estimates tab: Status chip greyed out and pre-filled; other four still work* | *"The Status chip is shown but greyed out, already filled in as 'Status: Estimate', and cannot be clicked or changed."* | LOW |
| A3 | **FLT-TAB-03** · [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) — *Completed tab: Status chip greyed out and pre-filled; other four still work* | *"The Status chip is shown but greyed out, already filled in with this tab's status, and cannot be clicked or changed."* | LOW |
| A4 | **FLT-TAB-05** · [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) — *A Status choice is kept while you switch tabs and comes back on the All tab* | *"On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is greyed out and pre-filled with the tab's own status."* | LOW |

**PASTE-READY ANSWER (all four):**
> The written spec still says the Status filter is hidden on the Estimates and Completed
> tabs, but Branko decided on 17 July 2026 that it should be **shown greyed out and
> pre-filled with the tab's status, and not clickable** — that is his answer B to our
> question about those two tabs, and he confirmed on 20 July that he would correct the
> written text. He has not made that edit yet, so the document and the test still look
> like they disagree. Our QA lead also confirmed on 30 July that "hidden" and
> "greyed-out/disabled" are describing the same thing. The tests follow Branko's decision
> because the newest product decision wins.

---

## B — SPEC COVERS THE AREA IN PROSE ONLY; PO ANSWERS SUPPLY THE DETAIL (9 cases)

**The structural fact:** spec v1.6 §7 Requirements contains **Stories 1–14 and NO Parts
story and NO Reports story**, so **there is not a single `S#-R#` anchor for any Parts view
or any report**. Parts/Reports appear only in **§2 Feature Overview** and **§4 Key
Decisions**. This is **spec-silent at requirement level, not spec-contradictory.**

**Branko's rulings, VERBATIM (2026-07-31), source
`build/filters/branko-answers-2026-07-31/answers-ingested.md` §1:**

- **Q2:** *"A - Yes, every chip shown filters that page."*
- **Q3:** *"We should support all the filters we have right now in the app as well as all
  choices per filter. There is no specific list of choices."*
- **Q4:** *"Filter behavior and types are fully displayed in the design. The links are in
  the PRD."*
- **Q5:** *"A - Yes - multi-select, clearing, collapse, persistence, shareable URL and
  mobile all match Work Orders. One difference: filters don't carry across Parts views or
  Report tabs; each view keeps its own set. Date-range is a single range, not multi-select."*
- **Q7:** *"A - Same for everyone - role does not change chips or their options"*
- **Q1 (the written description) — LEFT BLANK.** Recorded as **UNANSWERED**, not inferred.

**ADDED 2026-08-04 — three further rulings, VERBATIM, source
`../branko-answers-2026-08-04/answers-ingested.md` §2:**

- **Q3 (the Vendors page):** *"Disign for vendors exists in figma. Check it"* — **Vendors IS in
  scope and its design existed all along.** We checked, as he asked: Figma node **`11903:10461`**
  (`Parts-Explorations-20.4.2026 / Vendors`) shows **exactly two chips, `Vendor` and
  `State/Province`** — read as **pixels**, not from a text layer. **His own PRD §2 already listed
  Vendors** among the eight Parts views. **Three sources agree.**
- **Q8 (the six never-drawn-open filter buttons):** *"We do not have list of all filter items. we
  should have all filters we support now per each page plus we should add new ones. For example let's
  use parts sales page. Currently support only status but we can also have customer, created by and
  date. We already have those values in the table, we just need to include those as filters."*
  **This does NOT answer the question it was asked** (nothing about Location / Transaction Type /
  Invoice Status / Type / User / Mention). What it **does** give is (i) a second, direct statement
  that **no written list exists**, and (ii) a **second statement of the parity-plus-extend rule**.
- **Q9 (the page-by-page list):** *"Same as before, we do not have concrete list. If this is really
  necessary i suggest Engineering + PO together make a list for remaining 6 Parts pages i Reports,
  using same format as Work Orders do."* — **the list still does not exist**, but the ask now has
  named owners and a format. **His "remaining 6 Parts pages" matches our own count exactly.**

**Why the ruling wins:** the spec is silent at requirement level, so there is nothing to
override; the PO's answers are the only product statement of the detail (Rules 32/33).

**Who can close it — CHANGED 2026-08-04.** It is **no longer Branko alone**. His Q9 proposes
**Engineering + PO jointly** produce the page-by-page list, so the next move belongs to the **QA
lead**, to get that session arranged. **The ask is still OPEN** — the substance has not been
delivered.

| # | Case | Basis | Risk |
|---|---|---|---|
| B1 | **FLT-PARTS-01** · [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Per-page chip sets from Figma `11884-16885` + Q2/Q3. **Updated 2026-08-04:** the **Part Sales** row is now **PO-sourced verbatim** (Q8 names *"customer, created by and date"* on top of status — item for item what our expected 2 asserts), and **Vendors** is **PO-scoped + design-confirmed** (Q3, node `11903:10461`). **The false hedge on Vendors is staged for removal.** | **MEDIUM → LOW-MEDIUM.** Design-only exposure narrows from **6 of 8 views to 5** (Catalog · Returns · Credits · Vendor Invoices · the Returns/Credits tab split). Still a closed enumeration with no numbered requirement, which is why it is not LOW. |
| B2 | **FLT-PARTS-09** · [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Core / Non Core list, design + Q3 | LOW |
| B3 | **FLT-PARTS-11** · [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | "narrows that page", Q2 + Q5 parity | LOW |
| B4 | **FLT-PARTS-12** · [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | multi-select + clear, Q5 parity | LOW |
| B5 | **FLT-PARTS-13** · [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | "nothing lost in the redesign". **Updated 2026-08-04:** no longer rests on a single sentence — **THREE agreeing sources**: Q3 (2026-07-31), **Q8 (2026-08-04)** and the tech plan's rollout rule *"NO change to what is filterable"*. | **MEDIUM → LOW.** The rule is now twice-stated by the PO. The tester still has to build the before-list by hand, which is a **workload** point, not a **sourcing** one. |
| B6 | **FLT-RPTS-01** · [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Per-report chip sets from Figma `11903-10573` + Q2/Q3 | **MEDIUM — unchanged, and this is now the single most exposed case in the project.** 24 closed enumerations, entirely design-sourced; v1.6 names **no individual report**, and Q9 confirms no list exists. |
| B7 | **FLT-RPTS-21** · [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | "narrows the report", Q2 | LOW |
| B8 | **FLT-RPTS-22** · [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | the six new filter types; case states plainly that they *"have not been written down anywhere yet"*. **Updated 2026-08-04:** Q8's *"We do not have list of all filter items"* **PO-confirms that sentence is accurate.** | LOW — the case is honest about it, and the PO now corroborates the honesty |
| B9 | **FLT-RPTS-23** · [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | date-range single range, **Q5 exception 2 verbatim** | LOW |

**Revised group risk: LOW ×7 · MEDIUM ×2** (was LOW ×6 · MEDIUM ×3). B5 down-rated to LOW; B1
down-rated within MEDIUM.

**PASTE-READY ANSWER (all nine):**
> The written spec describes the Parts and Reports filters only in its overview and
> key-decisions sections — it has no numbered requirements for them at all. Branko
> answered our questions about them on 31 July: every filter button shown does filter its
> page, the choices come from the shop's own data so there is no fixed list, they behave
> like the Work Orders filters except that each view keeps its own set and the date range
> is a single range. On 4 August he added that the Vendors page is included and its design already
> exists — we checked and it does — and he confirmed there is no written list of the filter choices,
> which is exactly what our tests already say. He also suggested that engineering and he together
> write the page-by-page list we have been asking for. Until that list exists, the filter buttons we
> expect on each page come from the design pictures, and our tests say so rather than pretending
> otherwise.

---

## C — AGREED DESIGN, SPEC SILENT OR CONTRARY, NO RULING YET — **CLOSED 2026-08-04 · 0 cases**

> **This group is CLOSED. It held 7 cases, 2 of them HIGH risk, and it was this register's only
> real exposure. Branko's Q1 answer of 2026-08-04 settled it, and all 7 cases moved to Group A2
> above.**
>
> **The concession it warned about was NOT called in.** Its honest position read: *"if Branko says
> the mobile filters behave exactly like desktop, **these two cases are wrong and we concede
> them**."* **He did not say that.** He chose the engineering plan's model, which **keeps** the
> "Apply filters" button on the combined All Filters sheet, so **FLT-MOB-02
> ([C29622](https://shopview.testrail.io/index.php?/cases/view/29622)) and FLT-MOB-03
> ([C29623](https://shopview.testrail.io/index.php?/cases/view/29623)) stand as written.**
>
> **The ask this group was waiting on has been ANSWERED — and one thing it said was wrong.** The
> register recorded it as *"NEW ASK — never sent"* and *"Question B3 is OPEN and has never been
> sent"*. It **had** been sent, as **Q1 of the 2026-07-30 tech-plan sheet**; it came back **blank
> three times** before this fourth return carried the answer. The trail is kept visible rather than
> deleted, so a closed HIGH risk stays traceable:
> `build/filters/fixes-2026-07-31/RULE28-AUDIT-2026-07-31.md` §5 (the original B3 record) →
> `../branko-answers-techplan-2026-07-31/answers-ingested.md` (0 of 8 answered) →
> **`../branko-answers-2026-08-04/answers-ingested.md` §3.1 (answered)**.
>
> **One case left the register entirely instead of moving to A2:** **FLT-MOB-04
> ([C29624](https://shopview.testrail.io/index.php?/cases/view/29624))** now **agrees with the spec
> outright** and becomes `plain`. The note at the end of §A2-i records that, and also records that
> **this register previously mis-described that case** — the miss was ours.
>
> **What closing this group does NOT do.** It removes a **sourcing** risk, not a **verification**
> risk. **No mobile behaviour has been observed on any build.** The Filters QA branch
> (`sv8785.qa.shopview.com`) was not touched, because the QA lead has reserved the Filters VIU until
> Report Suite is complete. All 7 cases remain `VIU-Pending`.
>
> **And the PRD still does not describe the screen.** A full-text scan of live v1.6 on 2026-08-04
> finds **`"Apply filters"` 0 times**; `S2-R6` still says *"(no confirm/apply button needed)"* and
> `S12-R2` still says mobile behaves *"identically to desktop"*. Our cases follow Branko's newer
> ruling (Rules 32/33); **the document is what needs to catch up**, and that ask is in the
> OUTSTANDING table below.

---

## D — NO NUMBERED REQUIREMENT AT ALL (1 case — was 2)

**Change 2026-08-04: FLT-TAB-06 ([C38876](https://shopview.testrail.io/index.php?/cases/view/38876))
has MOVED to Group A2-ii, and this group's HIGH rating is RETIRED with it.** Branko's **Q2 = "A -
it's fine"** confirms the Estimates first-visit tab. The spec is **still silent** on the point; what
changed is that a **product** decision now stands behind the case instead of only an engineering one
— precisely the gap Rule 30 exists to police, and the reason it was rated HIGH.

| # | Case | Basis | Spec position | Risk |
|---|---|---|---|---|
| D2 | **FLT-PERS-06** · [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) — *Filters saved before the redesign carry over after the update* | Tech plan 2026-07-29 **s4-3.3** (browser-storage → account-preference migration); context S10-R2 | **SPEC SILENT** on the one-off migration | MEDIUM — a migration is engineering's to define; low product controversy |

**Who can close it:** **engineering**, by confirming the migration mapping. **Branko was not asked
about this and does not need to be** — it is not a product decision.

**One honest note, and it is not a defect.** This case's expected result includes *"columns and
sorting stay"* as part of the carried-over state, and Branko's **Q4 = "C"** has just put **sorting out
of scope for this project**. Those do not clash: his ruling removes the **new sorting panel** from
this project's scope, **not the app's existing sorting**, and this case is about not **losing**
pre-existing saved state during a migration. **No change needed** — recorded because a reader could
reasonably ask.

**PASTE-READY ANSWER:**
> One test covers something the written description does not mention at all: whether the filters a
> person had saved before the redesign still work afterwards. It comes from the engineering plan
> rather than a product decision, and the test says so plainly. It matters because existing users
> must not lose their saved filters when the update lands. Engineering owns confirming exactly how
> the old saved choices map onto the new ones. We have not been able to check it on a real build
> yet.

---

## What is NOT a real conflict (checked, and reported honestly)

The QA lead's list named three Filters items. **One of them is no longer a conflict, and
one has no case at all** — reported rather than padded into the register:

1. **PERMANENT PERSISTENCE — NOT a conflict any more.** Branko's Round-1 **Q2=B**
   (2026-07-17) ruled filters are remembered permanently, and at the time that
   contradicted the old S10-R2 "browser session" sentence. **Branko has since FIXED the
   spec.** v1.6 **S10-R2 now reads, VERBATIM:** *"Filter selections are stored server-side
   against the user account. They survive logout and sync across the user's devices. Where
   two devices write different state, last write wins. This is not browser-local storage
   and does not expire with a browser session"*. So **FLT-PERS-02
   ([C29614](https://shopview.testrail.io/index.php?/cases/view/29614)) and its siblings
   now agree with the spec outright** and carry the **plain** provenance line. Its refs
   already record *"now matched by the PRD"*.
2. **THE POP-UP / ⌘K SEARCH OWNERSHIP RULING — no case in the 110 is affected.** Branko's
   **Q6** answer (2026-07-31, verbatim: *"A - Test it under Global Search, not here…"*) is
   real, but the nine `FLT-SRCH` cases it governs **have never been pushed to TestRail**
   (all nine "new, no C-ID yet", held by the QA lead's own 2026-07-31 ruling *"OK do not
   delete those cases unless Branko confirms that they are related to Global search
   only."*). The 13 **FLT-PSRCH** cases in TestRail are the **page toolbar search**
   (spec Story 13, 29 numbered requirements) — a different feature, fully spec-backed.
   **CONFIRMED A SECOND TIME 2026-08-04 — and the QA lead's condition is now met twice over.**
   His **Q7** answer, verbatim: *"A — Toolbar search box is part of this project. These are two
   completely different functionalities: - Toolbar search = filters the current list/table on the
   page (inline, no popup) - Global search = searches the entire application (popup, "Search or ask
   a question") **This is not part of this scope, therefore not in the PRD.** … It is logical that
   inline filtering of the list goes with filters. The thing that is part of this prd is we have to
   remove this page search filtering functionality from the global search as right now it is part of
   it."* So: **the 13 FLT-PSRCH cases stay in Filters** (the sheet warned him that answer B would
   move a sizeable set of tests out — he chose A), **the 9 FLT-SRCH cases stay retired** and their
   coverage lands in Global Search, and his closing sentence **directly confirms two of our
   cases** — FLT-PSRCH-07 ([C38893](https://shopview.testrail.io/index.php?/cases/view/38893)) and
   FLT-PSRCH-12 ([C38902](https://shopview.testrail.io/index.php?/cases/view/38902)), which test
   exactly that removal. **Still no TestRail operation is possible for the nine** — they have no
   C-ids.
4. **ADDED 2026-08-04 — THE SEARCHABLE-FIELD LIST IS NO LONGER A BLOCKER, and this one is worth
   knowing because the PRD itself flags it.** Spec `S13-R23` reads, VERBATIM: *"…**Pending: the
   per-table list of fields currently covered, from engineering. Until it exists the searchable set
   is undocumented and QA has no baseline to test against**…"* Branko's **Q5 = "B"**, verbatim:
   *"B - \*Note - Have Engineering write up that list as technical documentation (**not as a blocker
   for tests**, but as a reference document). Tests can work with "typing narrows the list" until the
   list is complete."* **He has ruled the undocumented state acceptable for testing.** And our suite
   was **already written that way** — checked across all **13** FLT-PSRCH cases: **not one asserts
   which fields the search matches**; every field name appears as *"for example"* guidance for the
   tester, never as a closed list (Rule 42 clean). **Nothing to defend and nothing to change** — his
   answer validates existing wording. The write-up is now owed by **engineering**, non-blocking.
5. **ADDED 2026-08-04 — SORTING: there is nothing to defend, because there is nothing there.**
   Branko's **Q4 = "C"** = *"No - sorting is not part of this project (the design pictures are
   exploration only)."* The design-backed proposal of ~6–8 cases was **never authored** — no internal
   IDs, no C-ids, nothing pushed — so his ruling **cancels** it rather than invalidating anything.
   Corroborated by the live spec: the token *sort* appears **once** in the whole v1.6 body,
   incidentally, in `S13-R14`. If challenged with *"why is there no sorting coverage?"* the answer is
   one sentence: **the PO ruled it out of scope on 4 August 2026, and the design boards are still
   labelled "Work In Progress".**
3. **ROLE-INDEPENDENT FILTER LISTS — not a conflict.** Round-2 **Q3** (*"I'd say A, we
   didn't had role dependent filters."*) and 2026-07-31 **Q7** (*"A - Same for everyone"*)
   fill a spec **silence** (OQ-4). No case asserts role-dependent behaviour, so there is
   nothing to defend — the ruling's effect was that **no** role cases were needed.

## One item found that the QA lead did not name

**Group C above** — the mobile All-Filters/Apply cluster. He listed the persistence
ruling (now resolved) and the pop-up search (no cases); he did **not** name the mobile
Apply-button cluster, which is the **highest-risk group in this suite** and the only one
with **no ruling of any kind** behind it.

## OUTSTANDING — what is needed to close this register

| Item | Who | Blocks | Since |
|---|---|---|---|
| Edit the five spec passages that still say the Status chip is "hidden" | Branko | Nothing testable; the document keeps contradicting his own decision | committed 2026-07-20, **15 days** |
| Answer **Q1** of the 2026-07-31 sheet — a written description for Parts and Reports filters | Branko | 9 cases rest on answers + design instead of requirements (Group B) | asked 2026-07-27, left blank 2026-07-31 |
| **NEW ASK — never sent:** confirm the mobile "All Filters" sheet + "Apply filters" button for V1 | Branko | 7 cases (Group C), 2 of them HIGH risk | needs to go on his next sheet |
| Confirm which tab opens on a first visit | Branko | FLT-TAB-06 (C38876) | asked in-case, unanswered |
