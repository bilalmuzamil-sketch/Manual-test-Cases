# C29600 and C29632 — what their references are, and what they do and do not establish

**Filters project. 2026-08-11. READ-ONLY: 0 `update_case`, 0 `add_case`, 0 `delete_case`, 0 run writes,
0 results logged, 0 Jira writes of any kind. No build was opened; `quick-login` and `switch-user` were
not called.**

---

## THE ANSWER IN ONE MINUTE

**The QA lead is right that "nothing to back it" was wrong, and he is right twice over.**

**1. The references are real, and they are not empty.** C29600's `refs` names a real story
(**SV-8793**), a real spec section (**§2 Feature Overview**) and a real requirement (**S8-R3**), all of
which exist in the live spec at Confluence **version 19**. **They genuinely support two of the case's
three assertions** — that both chips go active, and that a "Clear filters" button appears. That much is
sourced, verbatim, by §2.

**2. And the third assertion — the important one — turns out to be sourced too, but by a document
neither case cites.** The claim that a Status filter and a Customer filter **narrow together** (an
intersection) is **NOT** stated by §2, and **NOT** stated by S8-R3. It is **not stated anywhere in the
PRD, in any version from v4 to v19**. **But it IS stated, explicitly, in the engineering tech plan:**

> *"…`tech_assigned_id` + `service_advisor_id` repeated-eq (UUID→bytes conversion) return the right WOs
> **and AND across fields**…"* — Tech Plan §1.8

**So the verdict is PARTLY SOURCED, not unsourced.** Nothing was invented. Nothing needs deleting. What
is wrong is the **recording**: both cases point at the wrong documents for their headline claim, and the
document that actually supports it is not named on either of them.

**3. One reference is factually mis-attributed.** C29600's `refs` credits *"§2 Feature Overview
(multi-criteria)"*. **The phrase "multi-criteria" is not in §2 and never has been** — it is in §1
Business Case and §3 Goals, and that is true in **every** spec version checked (v4, v12, v17, v18, v19).

**4. Two housekeeping defects on C29600, worth the QA lead's eye because it is flagged Automated
(`custom_atmstatus = 3`):** it carries **no provenance line and no automation marker at all** — its
entire Expected Results is one sentence.

**5. A correction to our own earlier survey.** `build/unsourced-cases-2026-08-11/CANDIDATES.md` says
C29600 "is" on Branko's question sheet. **It is not.** Searched the sheet's markdown and every XML part
of the workbook: **0 hits for 29600, 0 for 29632, 0 for "multi-criteria", 0 for "matching both"**.
**Neither case is on the sheet, so a new row would not duplicate anything.**

---

## SOURCE CURRENCY (Standing Rule 31)

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| 1 | Filters specification | Confluence page **572030978** "Filters" | **`version.number` = 19**, `version.when` = **2026-08-06T11:48:47.371Z** — read from the API, not the body | 2026-08-11, HTTP 200 | **CURRENT** |
| 2 | Historical spec versions | same page, `?version=4,12,17,18` | fetched individually | 2026-08-11, HTTP 200 x4 | **CURRENT** |
| 3 | Filters epic + all 14 stories | **SV-8785**, **SV-8786 … SV-8799** | read live, descriptions + comments | 2026-08-11, HTTP 200 x15 | **CURRENT** |
| 4 | Engineering tech plan | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` — verbatim copy of the 2026-07-29 upload | **no version field; uploaded 2026-07-29** | 2026-08-11 | **PARTIAL** — undated internally; its own baseline line reads *"Spec baseline: v1.3"*, so it predates spec v17–v19 |
| 5 | Filters engineering handover | `ed9bc33e-FIlters_HANDOVERAppWideFilterRedesign.md` | — | 2026-08-11 | **NOT READABLE — see the honesty note below** |
| 6 | TestRail cases C29600, C29632, C29606 | live `get_case` | — | 2026-08-11 | **CURRENT** |
| 7 | Branko question sheet | `build/filters/questions-2026-08-06/…_2026-08-06.md` + `.xlsx` | 2026-08-06 | 2026-08-11 | **CURRENT** |
| 8 | Figma design nodes | Filters Figma nodes cited in the spec | no version, no date | — | **NOT FETCHED** — declared, see limits |

**⚠️ Rule 31 trap (a) confirmed again:** the spec's **in-body** field reads **`Version: 1.6`** while the
real Confluence version is **19**. Every version claim here comes from `version.number`.

**🔴 HONESTY NOTE — the handover named in the brief is NOT on disk and I could not read it.** The path
`/root/.claude/uploads/dd1d42ba-…/ed9bc33e-FIlters_HANDOVERAppWideFilterRedesign.md` does not exist; that
uploads directory holds one unrelated July file. **What I read instead is our own full ingest of it,**
`build/handover-ingest-2026-08-10/`, which extracted **27 testable statements** from it and verdicted
every one. **None of the 27 concerns how two different filters combine**, and a keyword sweep of that
whole folder for `FilterDecorator`, `repeated-eq`, `AND across`, `filters[` returns nothing on this
point. **So: a second-hand check, and I say so rather than implying I read the document.** If the
handover does state the rule, this finding would only get stronger, not weaker.

---

## 1. THE SPEC TEXT, VERBATIM (live Confluence v19)

### 1a. §2 Feature Overview — the part that bears on this case

The section runs from the heading *"2. Feature Overview"* to *"3. Jobs to be Done / Goals"* and covers
four blocks: **Core Work Orders Filters**, **Parts Filters**, **Reports Filters**, **Page Search**. The
bullets that bear on C29600, verbatim:

> **"A filter bar appears below the tab navigation on the Work Orders page, providing quick access to
> five filters: Status, Customer, Lead Technician, Service Advisor, and Asset on Site"**
>
> **"Status, Customer, Lead Technician, and Service Advisor are multi-select filters; Asset on Site is a
> two-option (Yes / No) dropdown"**
>
> **"When one or more values are selected in a filter, the chip updates to display the selected values
> and a 'Clear filters' button appears in the filter bar"**
>
> **"Filters apply to all tabs except where noted (see Tab Behavior, Story 9)"**

And, from the **Page Search** block of the same section:

> **"Search applies as the user types, with no apply button, and works additively with the filter bar: a
> query narrows within the active filters, and vice versa"**

**Read those five together and the point is stark: §2 tells you the filters exist, that they are
multi-select, what an active chip looks like, and precisely how SEARCH combines with FILTERS — and it
never says how one FILTER combines with another.**

### 1b. "multi-criteria" — where it actually appears

**Not in §2.** Two occurrences in the document, both outside it:

> **§1 Business Case:** *"Adding a persistent, **multi-criteria** filter bar directly addresses this pain
> point and aligns ShopView with the workflow expectations of shop managers and service advisors."*
>
> **§3 Jobs to be Done / Goals:** *"Allow **multi-criteria** filtering in a single interaction"*

**Checked across five spec versions — v4, v12, v17, v18, v19 — the count is 2 in the whole document and
0 in §2, every time.** The phrase has never been in §2, so the parenthetical in C29600's `refs` is a
mis-attribution rather than a drift.

**And on the substance: "multi-criteria" and "in a single interaction" say that several filters may be
applied at once. Neither says what applying them at once does to the result set.**

### 1c. S8-R3, verbatim and in full

> **"S8-R3: When the combination of active filters and any active search query produces no matching
> records, the table shows an empty state with a message indicating no results were found for the
> current filters and search"**

Its neighbours, so the intent of the story is visible:

> **S8-R1:** *"Clicking 'Clear filters' removes all active filter selections across all filters; all chips return to their default (inactive) state"*
> **S8-R2:** *"Each filter dropdown includes a 'Clear selection' action that removes only the selections for that specific filter without affecting others"*
> **S8-R4:** *"The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query"*
> **S8-R5:** *"Where both a query and filters are active, each is cleared independently from the empty state…"*

**Story 8 is titled "Clearing Filters & Empty State", and S8-R3 is the empty-state requirement.** The
phrase *"combination of active filters"* is the **subject** of the sentence — the thing that produces no
matches — not a definition of how the combination is computed. **It presupposes that filters combine; it
does not say how.**

**S8-R3 has said this in every version checked.** In v4 it read *"When the combination of active filters
produces no matching work orders…"*; from v12 onward the search clause was added. **The empty-state
meaning is unchanged throughout.**

**The corroborating fact:** **[C29606](https://shopview.testrail.io/index.php?/cases/view/29606)** cites
the same `S8-R3` and is the **correct** user of it — *"A filter combination with no matches shows a
no-results empty state"*, expecting *"the table body is replaced by an empty state"*. **One anchor, two
cases, and only one of them is what the anchor is about.**

---

## 2. THE CASES, VERBATIM

### C29600 — [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) · section 4117 · `custom_atmstatus = 3` **Automated**

**Title:** *"Status and Customer filters together show only work orders matching both"*
**`refs`:** `SV-8793 (§2 Feature Overview (multi-criteria); S8-R3 ('combination of active filters')) [spec v19 2026-08-06]`
**Preconditions:** *"Logged in as Admin on the Work Orders page, All tab; customer A has an Estimate and an Approved WO, customer B has an Estimate WO (all API-seeded)"*
**Steps:** *"1. Open the Status filter and tick Estimate. 2. Open the Customer filter and select customer A. 3. Look at the table."*
**Expected Results, in full — this is the entire field:**

> **"Two active chips, a visible Clear Filters button, and exactly the intersection of both filters in the table"**

### C29632 — [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) · section 4124 (API) · `custom_atmstatus = 1` · `AUTOMATION: READY`

**Title:** *"A combined multi-filter request returns only work orders matching all filters"*
**`refs`:** `SV-8785 [epic] (S2-R2; S3-R6; S8-R3 (backend view)) [spec v19 2026-08-06]`
**Expected Results, verbatim:**

> **"1. One request carries both filters together (both statuses and the customer).**
> **2. The response returns customer A's Estimate and Approved work orders only.**
> **3. Customer B's work orders are absent - the customer filter and status filter both restrict the result, while the two statuses combine as either-or."**

Followed by its provenance line and marker:

> *"This is the expected behaviour as per epic SV-8785 and the Filters specification at Confluence version 19 (published 6 August 2026) (S2-R2, S3-R6, S8-R3). Last checked against build v3.4.2-d00239b on 8/5/2026."*
> *"AUTOMATION: READY"*

---

## 3. PER-ASSERTION VERDICT — both texts side by side (Rule 45(e))

**One row per assertion**, because they land differently and a single verdict would hide that.

### C29600

| # | The case asserts, verbatim | Cited text, verbatim | Verdict |
|---|---|---|---|
| **A1** | *"Two active chips"* | §2: *"When one or more values are selected in a filter, the chip updates to display the selected values…"* — and **S7-R1** (not cited): *"When a filter has one or more values selected, the chip changes to an active/highlighted visual state (blue pill) and displays the selected value(s)"* | ✅ **STATED by the cited §2.** Two filters selected ⇒ two active chips follows directly. |
| **A2** | *"a visible Clear Filters button"* | §2: *"…and a 'Clear filters' button appears in the filter bar"* — and **S7-R3** (not cited): *"When at least one filter is active, a 'Clear filters' button appears in the filter bar to the right of all chips"* | ✅ **STATED by the cited §2.** |
| **A3** | *"exactly **the intersection of both filters** in the table"* | §2 — searched in full: **no statement of how two filters combine.** `S8-R3` — *"When the combination of active filters and any active search query produces **no matching records**, the table shows an **empty state**…"* | ❌ **NOT STATED BY EITHER CITED TEXT.** §2 says filters exist and are multi-select; S8-R3 is about the empty state. **It is IMPLIED by the spec (see §4) and STATED by the tech plan (see §6) — but by neither anchor this case names.** |

### C29632

| # | The case asserts, verbatim | Cited text, verbatim | Verdict |
|---|---|---|---|
| **B1** | *"One request carries both filters together (both statuses and the customer)"* | None of `S2-R2` / `S3-R6` / `S8-R3` describes a request shape. The spec's only transport requirement is **S11-R1** (URL state), not cited. | ⚠️ **NOT STATED by the cited text.** It **is** stated by the tech plan §0.3 (the repeated-eq `filters[N][…]` convention) — again, not cited. |
| **B2** | *"The response returns customer A's Estimate and Approved work orders only"* | — | Composite of B3a + B3b; inherits their verdicts. |
| **B3a** | *"the customer filter and status filter **both restrict** the result"* | `S8-R3` (empty state) — cited as *"(backend view)"* | ❌ **NOT STATED.** Identical gap to A3. |
| **B3b** | *"the two statuses **combine as either-or**"* | **S2-R2:** *"The user can select one or more statuses; the table updates to show only work orders matching **any** of the selected statuses"* | ✅ **STATED, verbatim.** *"any of"* is OR. `S3-R6` gives the same for customers: *"…belonging to **any** of the selected customers"*. |

---

## 4. THE WHOLE-SPEC SWEEP — independently re-run, and it changes the picture in one place

Searched the **entire live v19 body**, not just the two cited anchors, for: `combination`, `combine`,
`combined`, `multi-criteria`, `multi criteria`, `intersect`, `narrow`, `restrict`, `cumulative`,
`match all`, `together`, `additive`, `any of the`, and the standalone token `AND`.

**The single most decisive result: the word `AND` (as a boolean, uppercase) appears EXACTLY ONCE in the
whole specification —**

> **`S13-R10`: "Search and filters are additive (AND). A query narrows within the active filters;
> applying a filter narrows within the active query"**

**— and it is about search versus filters, never filter versus filter.**

The sweep confirms the earlier finding and adds four items it did not record:

| Where | Verbatim | What it establishes |
|---|---|---|
| `S2-R2` | *"…show only work orders matching **any** of the selected statuses"* | **OR within one filter.** |
| `S3-R6` | *"…belonging to **any** of the selected customers"* | **OR within one filter.** |
| `S2-R7` | *"Imported is **an exception to S2-R2 and cannot be combined with anything else**…"* | One **exclusion**. Its existence implies the others *may* combine — but says nothing about the result. |
| `S13-R10` | *"Search and filters are **additive (AND)**"* | **AND — but between search and filters.** |
| **NEW** `S2-N4` | *"Selecting Imported alongside another status, customer, technician, advisor or asset filter is not a supported combination and is prevented by S2-R7 **rather than returning an empty result**"* | **Strong implication:** an ordinary combination *would* narrow, possibly to nothing. Still not a statement of the rule. |
| **NEW** `S7-R5` | *"When the filter bar is collapsed with active filters, the table continues to apply **all active filters**"* | All active filters apply **at once**. Which filters are in effect — not how they compose. |
| **NEW** `S9-R2`/`R3`/`R4` | *"…the remaining four filters are shown and **apply on top of** the Estimates pre-filter"* · *"…the filters **apply on top of** that scope"* | **AND — but between the filters and a TAB scope.** |
| **NEW** §3 Jobs to be Done | *"I want to filter work orders **by technician and status**, so I can see exactly what's in progress for my team"* · *"filter Inventory **by Bin Location and Category**, so I can verify quantities for one shelf"* · *"set the **Date range and filter by Customer**, so I can produce the exact statement a customer is disputing"* | **The closest the PRD comes.** Narrative user goals that only make sense as intersections — but they are jobs-to-be-done prose, not a requirement, and they state an intent rather than a rule. |

**The asymmetry the earlier survey spotted is real and I confirm it independently: the spec states AND
semantics for search-vs-filters (explicitly, with the word AND) and for filters-vs-tab-scope ("apply on
top of"), and states OR semantics within a single filter twice — and never states the rule for two
different filters.** Against that background the silence reads as an oversight, not a deliberate refusal.

**So the honest verdict on the PRD is "IMPLIED BUT NEVER STATED", not "about something else entirely".**
S8-R3 specifically *is* about something else entirely; §2 *is* on topic but silent on the point; and the
document as a whole implies the intersection in at least four places without ever writing it down.

### The control that proves this is a real distinction, not pedantry

**[C38884](https://shopview.testrail.io/index.php?/cases/view/38884)** — *"Page search combines with
filters and is cleared separately"* — asserts:

> *"1. With both active, the results match the filter AND the search together (both narrow the list at once)."*

**That is the same shape of claim as A3, and it is properly sourced**, citing
`S13-R10 (search and filters are additive)`. **One case makes this claim and can quote a requirement
back; the other two cannot.** That contrast is the whole finding.

**Family check:** all 114 Filters cases were scanned for the assertion family (`both`, `intersect`,
`combin`, `together`, `all filters`, `multi-filter`) — **27 hits, and only C29600 and C29632 assert
cross-filter narrowing.** C29606 and C29635 are correctly empty-state; C38884 is correctly search-vs-
filters. **The exposure is exactly two cases.**

---

## 5. THE EPIC AND ITS STORIES — checked live, and they do not close the gap

All **14** child stories of **SV-8785** read live (SV-8786 … SV-8799), descriptions **and** comments.

**SV-8793** — the ticket C29600 actually cites — is **"Clearing Filters & Empty State"**, i.e. Story 8.
Its requirements restate S8-R1…S8-R5. **Its acceptance criteria do use two filters together, and this is
the strongest thing in Jira:**

> *"Given I have Status and Customer filters active, when I click 'Clear filters', then both chips return to default and the table shows all records"*
> *"Given I have Status and Customer filters active, when I use 'Clear selection' inside the Status dropdown, then only Status is cleared; Customer remains"*

**Both establish that Status and Customer can be active simultaneously — which supports A1 — and neither
says a word about what the table contains while they are.** The story is about clearing.

**Every acceptance criterion across all 14 stories that mentions the result set was extracted.** Each one
describes a **single** filter's effect:

> SV-8787: *"…select 'In Progress' and 'Review', then the table shows only work orders with those statuses"*
> SV-8789: *"Given I select two technicians… then the table shows only their assigned work orders"*
> SV-8790: *"Given I select an advisor… then the table shows only their assigned work orders"*
> SV-8791: *"Given I select 'Yes', then the table shows only work orders where the asset is on site"*

**Not one acceptance criterion in the epic states the result of combining two different filters.**
SV-8798 (Page Search) repeats the search case explicitly — *"Search and filters are additive (AND)"* —
which again is the wrong pair. **0 comments on SV-8793; the four story comments that exist are Ahtasham
Amjad's QA sign-offs and say nothing on this.**

---

## 6. 🔴 THE FIND — the tech plan DOES state it, and neither case cites it

`build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`, a verbatim copy of the
engineering tech plan uploaded 2026-07-29. **Two passages, quoted exactly:**

**§0.3 — FilterDecorator multi-value convention (the OR half):**

> **"Verified current behavior (`api/src/Shared/Infrastructure/Persistence/Listing/FilterDecorator.php`):**
> **- Same-field filters are grouped and OR'd (`decorateQuery()` lines 37–55) — repeated `eq` on one field is a de-facto IN."**

and the decision that produces C29632's request shape:

> **"send ALL multi-select filters as repeated same-field `eq` entries — statuses as `filters[N][field]=status&filters[N][value]=estimate`, UUIDs as repeated `eq` too"**

**§1.8 — Tests + phase gate (the AND half):**

> **"Functional — WO listing filters: repeated-eq `status` values OR'd; `tech_assigned_id` + `service_advisor_id` repeated-eq (UUID→bytes conversion) return the right WOs and AND across fields; `vehicleHere=0` per 1.6; non-whitelisted field still rejected (`FilterException`)."**

**"AND across fields" is exactly assertion A3 and assertion B3a.** And §3's Phase-3 gate corroborates it
behaviourally:

> **"select statuses/customer/tech/advisor/asset combinations → verify grid narrows in real time and network shows repeated-eq `filters[]`"**

**Under Standing Rule 57 as amended 2026-08-06 the technical design is on the authoritative source list
at (d3), so these cases ARE sourced.** Three qualifications, all of which the QA lead should see:

1. **Neither case cites it.** Both point at the PRD. A reader checking the references finds requirements
   that do not carry the claim — which is exactly what happened here.
2. **A tech plan is not a PRD.** Rule 30's clause — *engineering intent informs but never overrules
   product truth* — is **preserved**, and whether a technical design can carry a product expectation
   **on its own** is the **OPEN question Rule 57 records for the QA lead and expressly does not answer**.
   That question already governs **nine other cases** (class C-3 of
   `build/unsourced-cases-2026-08-11/CANDIDATES.md`); on this finding **C29600 and C29632 join them**.
   **The mitigating fact here is that the PRD is SILENT, not contradictory — there is nothing for the
   tech plan to overrule.**
3. **The tech plan is PARTIAL as a currency source.** It is undated internally, its own baseline line
   reads *"Spec baseline: v1.3"*, and it therefore predates spec versions 17–19.

---

## 7. RECOMMENDATION — **PARTLY SOURCED**

**Nothing is deleted. Nothing is invented. Both cases keep their coverage.** The narrowest correct fix
touches the **recording**, not the assertions — and it is **NOT executed here** (read-only; both cases
are automation-relevant and, per today's ruling, changing an automated case obliges us to tell Vlad).

### 7a. Proposed `refs` and provenance corrections — staged, not applied

| Case | Change | Why |
|---|---|---|
| **C29600** | Drop *"§2 Feature Overview **(multi-criteria)**"* → **"§2 Feature Overview (active chips; Clear filters button)"** | The phrase is not in §2 in any version. §2 *does* source A1 and A2 — cite it for what it actually says. |
| **C29600** | Replace *"S8-R3 ('combination of active filters')"* with **the tech plan: "Tech Plan §1.8 'AND across fields'; §0.3 same-field OR"**, and state plainly that **the specification has no requirement for cross-filter combination** | Rule 54: sentence 1 must name the source that actually supports the expectation. As written it manufactures authority §2/S8-R3 do not give. |
| **C29600** | **Add the missing Rule-54 provenance line and an `AUTOMATION:` marker** | It has neither. It is the only Filters case with neither, and it is flagged Automated. |
| **C29632** | Keep `S2-R2` and `S3-R6` (they correctly source B3b). Replace *"S8-R3 (backend view)"* with the **Tech Plan §0.3 (request shape) and §1.8 (AND across fields)** | S8-R3 is the empty-state requirement and does not describe a backend view. §0.3 is literally where C29632's `filters[N][…]` request shape comes from. |
| **Both** | Add the **Rule-42 scope-conditional / honesty sentence**: the cross-filter rule rests on the engineering tech plan because the product description does not state it | Makes the basis visible to a tester and to Vlad, instead of leaving it to be rediscovered. |

**No wording of any assertion changes. No case is split. No case is retired.** A3 and B3a are not
unsupported claims — they are correctly-supported claims pointing at the wrong document.

### 7b. **A question for Branko IS still warranted — and it does not duplicate anything**

Not because the behaviour is undecided, but because **the product description ought to say it and does
not.** A rule that lives only in an engineering document is one PRD edit away from being silently
contradicted, and nobody would notice. **This is a documentation gap, and it should be described to him
as one — not as a decision he has failed to make.**

**Duplicate check (Rule 55, and the brief's instruction not to create a third sheet):** searched
`build/filters/questions-2026-08-06/` — both the markdown and **every XML part** of the workbook.
**0 hits for `29600`, `29632`, `multi-criteria`, `matching both`.** The seven Filters items on that sheet
cover the Status chip on Estimates/Completed, the Parts and Reports write-up, the Reports date filter and
URL, the mobile Imported choice, where the bar sits, the phone button wording, and a broken pointer in
his own description. **None of them is this.** **⚠️ This corrects `CANDIDATES.md`, which states C29600 is
already on his sheet — it is not.**

**Proposed as ONE NEW ROW appended to the existing sheet. Not authored, not sent.**

> ### Item 8.0 — Filters (the filter buttons on the Work Orders list) - what happens when two different filter buttons are used at the same time (the Status filter story SV-8787 and the Customer filter story SV-8788, under epic SV-8785)
>
> **What happens now**
> Your description says a person can use several filter buttons at once, and it says what each button does on its own. For the Status button it says the list shows work orders matching **any** of the statuses you tick. For the Customer button it says the list shows work orders belonging to **any** of the customers you pick.
>
> **What it does not say**
> It does not say what the list should show when someone uses **two different buttons together** — for example ticking the status "Estimate" and also picking the customer "Smith". The engineers' own working notes say the list should show only the work orders that match **both**, and that is what the product does today. We would just like your written description to say it too, so it is decided in your document rather than only in theirs.
>
> **The question**
> When someone ticks a status and also picks a customer, what should the list show?
>
> **A)** Only the work orders that match **both** — status "Estimate" **and** customer "Smith". (This is what the product does today and what the engineers' notes describe.)
> **B)** Something else — please tell us what.
>
> **Your answer:** ______
>
> **Why we are asking:** two of our tests say the answer is A. They are correct against the engineers' notes, but your description does not confirm it, so if the answer is ever meant to be different we would have no way of knowing. One sentence added to your description settles it for good.

**QA-only mapping, for the sheet's internal tab — do not forward:** C29600
([link](https://shopview.testrail.io/index.php?/cases/view/29600), `atmstatus = 3` Automated) and C29632
([link](https://shopview.testrail.io/index.php?/cases/view/29632), `AUTOMATION: READY`). Answer **A**
confirms both as written and the only change is a provenance re-stamp naming his answer. Answer **B**
means both are wrong on their headline assertion and Vlad must be told.

### 7c. What is owed to Vlad, stated plainly

**C29600 is `custom_atmstatus = 3` (Automated)** — the TestRail field, which is the flag that matters,
not the text marker (which it does not have). **C29632 is `AUTOMATION: READY`**, so it is queued for
automation rather than automated. **Neither is being changed by this pass.** If the QA lead authorises
the §7a recording fixes, **only the references and provenance move — no assertion, step or expected
result changes — so no automated check can break.** That is worth telling Vlad precisely, because "we
edited two of your cases" and "we corrected which document they cite" are very different messages.

---

## 8. HONEST LIMITS

1. **The handover was not read directly** — the file is not on disk. I used our own 2026-08-10 ingest of
   it, which extracted and verdicted 27 statements, none on this point. **Second-hand, and labelled.**
2. **Figma was not fetched.** Rule 57 makes the design authoritative. A design can show a filtered table
   but is a poor vehicle for a boolean rule, so I judge the risk low — **but I did not look, and if a
   node states the rule I would not have seen it.**
3. **The build was not opened**, deliberately. Per Rule 57 the build could not answer this question
   anyway: what the product does is not what it should do.
4. **"No document anywhere states it" is a universal negative.** What I can stand behind is: the full
   live spec v19 body, four earlier versions, all 14 stories with their comments, the tech plan, and our
   ingest of the handover — **searched, with the search terms named above and the results listed.**
5. **The tech plan's own currency is PARTIAL** (undated, baseline v1.3). It states the rule; it does not
   prove the rule is still current as of spec v19.

---

## OUTSTANDING — what I need from you

1. **A decision on the §7a recording fixes** — 2 x `update_case`, references and provenance only, **no
   assertion touched**. Not executed; this pass is read-only.
2. **Your go-ahead to append Item 8.0 to Branko's existing sheet** (one new row, no new sheet, no
   duplicate — verified).
3. **The Rule 30 / Rule 57 question you already hold** — does a technical design carry PRD-level
   authority on product behaviour, or does *"informs but never overrules"* still hold? **It now governs
   eleven cases, not nine**: the nine in class C-3 plus these two.
4. **A call on telling Vlad.** C29600 is flagged Automated. Nothing is proposed that changes what it
   asserts, but you asked to be the one who decides when he is told.
