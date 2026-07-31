# Filters — Branko's returned TECH-PLAN sheet — INGESTED 2026-07-31 — **0 OF 8 ANSWERED**

**This file is the SOURCE OF RECORD for what Branko actually said.** Verbatim only.

> ## HEADLINE — the sheet came back with the answer column completely EMPTY
>
> **0 of 8 questions carry an answer. 8 of 8 are blank.**
> Not one letter, not one word of free text, in any cell, on any tab, in any comment.
>
> **This is the SECOND delivery of the SAME blank file.** Its `Questions for PO` tab is
> **cell-for-cell identical (0 diffs across all 66 cells)** to the copy already downloaded
> from Google Drive and checked earlier today
> (`build/filters/branko-sheet-check-2026-07-31/Filters-sheet-as-returned-BLANK-2026-07-31.xlsx`).
> Nothing new arrived.
>
> **NOTHING HAS BEEN INFERRED FROM OUR OWN QUESTION TEXT (Standing Rule 12).** A blank cell is
> recorded as blank. No option letter has been assumed because it looked likely. No test case
> was edited. **No TestRail write of any kind was made.**

| | |
|---|---|
| Sheet he was sent | `build/filters/PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` / `.xlsx` (8 questions, issued 2026-07-30, revised 2026-07-31) |
| Raw file received | uploaded as `POQuestionsBrankoFiltersTechPlan_20260730_3.xlsx`, preserved here as **`PO-Questions-Branko-Filters-TechPlan_2026-07-30_ANSWERED.xlsx`** *(filename retained for traceability to the sheet it answers — the word ANSWERED describes the slot, not the contents)* |
| Ingested | **2026-07-31** |
| PO | **Branko** (Filters / Schedule / Global Search — never mix: Chris Ward = Report Suite + Fees & Discounts; Milos = Simple Flow) |
| **Answered** | **0 of 8** |
| **Left blank** | **ALL 8 — Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8** |
| Case edits made this pass | **ZERO** |
| id-map / import / case sources touched | **NO** |
| TestRail writes | **ZERO** (read-only `get_run/352` only) |
| Follow-up sheet produced | **NO** — and §6 explains why that is the correct answer, not an omission |

---

## 1. SOURCE-CURRENCY BLOCK (Standing Rule 31)

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| 1 | **Branko's returned sheet** | uploaded xlsx, `dcterms:created` **2026-07-30T14:41:28Z**, `dc:creator` **openpyxl**, **no `dcterms:modified`**, **no `lastModifiedBy`** | identical content to the 2026-07-31 Drive download | 2026-07-31 | **RETRIEVED but EMPTY — contains no answers** (§2) |
| 2 | **Filters spec (PRD)** | Confluence page **572030978** | body **v1.6**, `lastModified` **Jul 28, 2026**, author **Branko Cicovic** — re-fetched LIVE this pass via `getConfluencePage` | 2026-07-31 | **CURRENT** — matches our `spec-current-2026-07-31/Filters-spec-current.md` baseline; no new version |
| 3 | **Filters epic** | — | **NONE EXISTS** — proven absence, all 170 SV epics enumerated 2026-07-31 | 2026-07-31 | **ABSENT** (still an open ask — §7) |
| 4 | **Filters designs** | Figma `DR4gEODShYgJqkozs3mF5q` | **73 of 85** boards rendered | 2026-07-31 | **PARTIAL** — 12 boards still have no PNG; Rule-35 queue `design-2026-07-31/PENDING-FIGMA-FETCH.md` is **OPEN**. All 12 are described from their node trees, so nothing is guessed. |
| 5 | **Engineering tech plan** | `build/filters/tech-plan-2026-07-29/` | reconciled 2026-07-29 / 07-30 | 2026-07-31 | **CURRENT** — it is the *source of* Q1/Q2/Q5, not a thing this pass changes |
| 6 | **Prior PO answers** | `branko-answers-2026-07-17`, `-round2-2026-07-20`, `-2026-07-31` | latest = **2026-07-31** (the Parts/Reports sheet, 6 of 7 answered) | 2026-07-31 | **CURRENT** — still the newest product input we hold for Filters |
| 7 | **TestRail run 352** | run **352** "Filters - Ahtasham (Awaiting QA- ENV)" | `include_all:false`, **110 tests**, `untested_count:110`, 0 passed / 0 failed / 0 blocked | 2026-07-31 (live, read-only) | **CURRENT** — equals our 110 active cases |

**No source is STALE.** Item 4 is **PARTIAL** with the exact shortfall named. Nothing in this
document claims completeness on the strength of a stale source.

---

## 2. WHAT WAS RECEIVED, AND THE PROOF THAT IT IS EMPTY

The file is a valid Excel workbook (15-part zip, opens cleanly in `openpyxl`). This was **not**
a read failure, a corrupted file, or a sign-in page.

### 2a. It is OUR OWN sheet

Compared cell-by-cell against `build/filters/PO-Questions-Branko-Filters-TechPlan_2026-07-30.xlsx`:

* Same A1 title: *"Filters - Questions for Branko - 2026-07-30 (revised again 2026-07-31) - 8 questions"*.
* Same header row: `# | Topic | What happens now | The question | Options | Your answer`.
* **All 8 question rows, all 5 of our own columns, byte-identical.** He changed no question text,
  no option text, and **added no rows** (`max_row` = 11 = title + blank + header + 8 questions).
* Two differences, both **round-trip artifacts, not edits by him**: cell **A2** (a QA sub-note) is
  dropped, and the second tab **`QA Internal Mapping`** is absent. Neither carried a question.

### 2b. The answer column is EMPTY — at the XML level

`Your answer` is column **F**. In the raw worksheet XML every one of the eight answer cells is:

```xml
<c r="F4"  s="4"/>   <c r="F5"  s="4"/>   <c r="F6"  s="4"/>   <c r="F7"  s="4"/>
<c r="F8"  s="4"/>   <c r="F9"  s="4"/>   <c r="F10" s="4"/>   <c r="F11" s="4"/>
```

A style attribute and **no `<v>` value element at all** — these are not cells holding whitespace
or an empty string; they hold nothing. Corroborated four further ways:

| Check | Result |
|---|---|
| `sharedStrings.xml` string count | **39** (indices 0–38) — every one traced to our own title / header / question / option text. **No unaccounted string exists anywhere in the file**, so there is no answer text hiding in a cell we did not read. |
| Cell comments / notes | **`xl/comments*.xml` does not exist** — the workbook contains no comments |
| Drawings / text boxes | `xl/drawings/drawing1.xml` is present but is an **empty `<xdr:wsDr/>` container** (775 bytes, no shapes) — no floating note |
| Extra columns / rows beyond ours | **none** — `max_column` = 6, `max_row` = 11 |

### 2c. It shows no sign of ever having been opened and saved

`docProps/core.xml` still reads `dc:creator` **openpyxl** (our generator), carries
`dcterms:created` **2026-07-30T14:41:28Z**, and has **no `dcterms:modified` element and no
`lastModifiedBy`**. Every spreadsheet application writes both on save. **Stated with the
appropriate limit: this is consistent with the file never having been opened and saved in Excel
or Sheets. It is not proof of what Branko did or did not do** — he may have answered elsewhere,
or edited a converted copy whose edits never land in the uploaded original.

### 2d. Secret scan before commit

The xlsx was decompressed and **all 15 parts** grepped for `password|passwd|api[_-]?key|secret|
token|bearer|bilal|cf_clearance|PHPSESSID` and for the literal TestRail password: **no hits**.
Safe to commit.

---

## 3. QUESTION BY QUESTION — his answer, and the consequence

Format mirrors `build/filters/branko-answers-2026-07-31/answers-ingested.md` (Standing Rule 16).
**Consequence classes:** NO CHANGE · CASE EDIT NEEDED · NEW CASE NEEDED · CASE CAN BE
UN-FLAGGED/RETIRED · STILL AMBIGUOUS.

Every case named carries its internal ID + C-id + link (Standing Rule 8).

---

### Q1 — "Mobile: single filter windows - instant or with an Apply button"

* **What we asked (verbatim from the sheet):** *"In the single-filter window on a phone, should choices apply instantly as you tick, or only after tapping an 'Apply filter' button?"*
* **Options offered:** *A) Instantly as you tick, no Apply button (the engineering plan's way).* · *B) Only after tapping an "Apply filter" button (as the design pictures show).*
* **HIS ANSWER — verbatim:** ***(cell F4 is EMPTY — no letter, no free text)***

**CONSEQUENCE: STILL AMBIGUOUS — no change made.** The case stays exactly as written.

The case at stake is **FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)**
— *"Mobile: tapping one chip opens its own sheet with an 'Apply filter' button"*. **Our current
wording (Expected step 3), verbatim:**

> *"3. The bottom button reads 'Apply filter' (singular); tapping it applies the selection and filters the list."*

**Rule 25 — where that expectation comes from, and what contradicts it.** It is **design-derived,
not spec-derived.** The live PRD v1.6 does not contain the words "Apply filter" anywhere, and two
of its requirements point the other way:

> **S2-R6:** *"The table filters in real time as the user makes selections (no confirm/apply button needed)"*
> **S12-R3:** *"Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport"* — a bottom sheet is specified; **no Apply button is mentioned**
> **S12-R2:** *"The filter chips behave identically to desktop"*

The engineering tech plan makes single-filter sheets apply instantly, **agreeing with the spec**;
only the Figma mobile boards show the button. So there is a real three-way tension and **the case
currently follows the weakest of the three sources.** It is left untouched because reversing it on
our own reading would be exactly the inference Rule 12 forbids — but the QA lead should know this
case is the most likely of the eight to need reversing once Branko answers. **Q1 stays OPEN.**

---

### Q2 — "Which tab opens first"

* **What we asked:** *"Is Estimates the right tab to open first for a brand-new visit?"*
* **Options offered:** *A) Yes - Estimates first is fine.* · *B) No - it should open on All (…picking B needs a talk with them).*
* **HIS ANSWER — verbatim:** ***(cell F5 is EMPTY — no letter, no free text)***

**CONSEQUENCE: STILL AMBIGUOUS — no change made.**

The case at stake is **FLT-TAB-06 = [C38876](https://shopview.testrail.io/index.php?/cases/view/38876)**
— *"First visit opens the Estimates tab; your last-used tab is remembered"*. **Our current wording
(Expected step 1), verbatim:**

> *"1. On the very first visit the Estimates tab is the selected one, even though All is the FIRST tab in the row (order and default are different on purpose)."*

**Rule 25 — the source.** This is **tech-plan-derived only.** The live PRD v1.6 has **no
requirement about which tab is selected on a first visit** — the closest text is **S1-R1**, which
names the tab row (*"All, Estimates, Completed, My Work Orders"*) but says nothing about the
default. Per Rule 32(ii) an engineering document **informs but never overrules product truth**, so
this case currently rests on the one source class that cannot settle it. **Q2 stays OPEN**, and the
PRD needs the answer written into it either way (§5).

---

### Q3 — "The Parts 'Vendors' page filters"

* **What we asked:** *"Please confirm the Vendors page IS meant to get filters, and have the design added - or tell us it is out of scope."*
* **Options offered:** *A) Vendors gets filters - design coming.* · *B) Vendors is out of scope for now.*
* **HIS ANSWER — verbatim:** ***(cell F6 is EMPTY — no letter, no free text)***

**CONSEQUENCE: NO CHANGE — the case's hedge deliberately survives.**

The case is **FLT-PARTS-01 = [C38904](https://shopview.testrail.io/index.php?/cases/view/38904)**
— *"Every Parts list page shows its designed filter buttons"*. **Our current wording (Expected
step 8), verbatim:**

> *"8. The Vendors list page shows two filter buttons: Vendor and State/Province. Note: the developers have not been given a design for the Vendors page filters yet, so this page may not have them — write down what you actually see instead of failing the whole test."*

**Rule 25 — the scope half is already answered by his own PRD, so only the design half is open.**
Live v1.6, Feature Overview → Parts Filters, verbatim:

> *"A filter bar appears below the page header on each view of the Parts area (Inventory, Part Sales, Catalog, Returns, Credits, Purchase Orders, Vendor Invoices, **Vendors**), following the same chip-and-dropdown pattern as Work Orders"*

Vendors **is** in scope per the PRD. What is missing is the **design** — which is why the tester
instruction stays in the case rather than being hardened into a pass/fail assertion. **The hedge
is correct and stays.** Q3's *design* half stays OPEN.

---

### Q4 — "Sorting the Work Orders list" ⭐ **the one that decides whether a block of cases gets written**

* **What we asked:** *"Is sorting part of this project? If yes: is two sorts at a time the intended maximum; how does someone reverse a sort so it runs the other way, and should the sorted column show a mark; and are the sort buttons on the phone version and on those two report pages included too?"*
* **Options offered:** *A) Yes - sorting is in scope … including more than one sort level at a time (please add it to the written description …).* · *B) Yes, but single-level only - one column at a time, no "Add Sort".* · *C) No - sorting is not part of this project (the design pictures are exploration only).*
* **HIS ANSWER — verbatim:** ***(cell F7 is EMPTY — no letter, no free text)***

**CONSEQUENCE: STILL AMBIGUOUS — NO CASES AUTHORED, NO CASES DROPPED. The block stays unwritten.**

**Stated plainly: sorting scope is NOT resolved.** We hold **ZERO sorting test cases** — verified
this pass against `build/filters/testrail-id-map.csv`: **no case with "sort" in its internal ID,
title or section exists** among the 110.

**Rule 25 — the state of the sources.** The live PRD v1.6 contains the word "sort" **exactly once**,
and it is incidental, in a page-search requirement:

> **S13-R14:** *"The search query is retained for the browser tab session. It survives **sorting**, pagination, and navigating away from the page and returning."*

That single clause tells us sorting **exists as a page behaviour**; it defines **no sorting
control, no sort levels, no direction toggle, no maximum, and no column indicator.** There is no
Story for sorting in §7 (Stories 1–14, none about sorting). The sorting panel exists **only in the
Figma boards, and those boards are marked "Work In Progress"** — which is precisely why we asked
rather than authored.

**Why authoring anyway would be wrong, not diligent:** Rule 42 forbids absolute enumerations with
no version-pinned anchor, and any case we write now would have to assert a maximum sort count and
a direction mechanism that **no source states** — the two details the question itself says cannot
be worked out from the pictures. **Q4 stays OPEN and is the highest-value of the eight**: it is the
only one whose answer creates or cancels a whole block of work.

---

### Q5 — "Which details the new in-page search box looks at"

* **What we asked:** *"Please have that list written down per page and shared with us - or tell us to accept 'whatever each page's search finds today' as correct."*
* **Options offered:** *A) The list of searchable details will be written down and shared (please say roughly when).* · *B) Accept whatever each page's search finds today …*
* **HIS ANSWER — verbatim:** ***(cell F8 is EMPTY — no letter, no free text)***

**CONSEQUENCE: NO CHANGE — and note that his own PRD agrees the item is open.**

**Rule 25 — v1.6 states the gap itself, verbatim (S13-R23):**

> *"Each table searches the fields its existing search endpoint already covers today. This is deliberate reuse rather than a newly defined set … **Pending: the per-table list of fields currently covered, from engineering. Until it exists the searchable set is undocumented and QA has no baseline to test against**."*

So this is not a question he has overlooked — it is a **"Pending" item flagged in his own
document**, and the PRD's own wording ratifies our position: we can test **that typing narrows the
list**, not **which fields it matches**. Our 13 page-search cases are already written that way, so
**nothing needs editing**. **Q5 stays OPEN** as a source request, not a case defect.

---

### Q6 — "Your latest written description (a request, not a choice)"

* **What we asked:** *"Please confirm version 1.6 is the current one, and let us know each time you change it, so we can re-check the tests straight away."*
* **Options offered:** *A) Yes - version 1.6 is current, and I will let you know whenever I update it.* · *B) There is something newer than version 1.6 (please share it).*
* **HIS ANSWER — verbatim:** ***(cell F9 is EMPTY — no letter, no free text)***

**CONSEQUENCE: NO CHANGE — and the factual half is now settled by our own live observation, not by him.**

We re-fetched page **572030978** LIVE this pass: body **Version 1.6**, `lastModified`
**Jul 28, 2026**, author **Branko Cicovic** — **identical to our baseline.** So "is 1.6 current?"
is answered **YES, by observation (Rule 12-clean)**, and our suite is aligned to the right version.

What remains unanswered is the **process half** — his commitment to *tell us when he changes it*.
That cannot be self-served, and its absence is a live risk: the Filters spec was **8 versions
behind** once already (we held V1.0 while live was v1.6) and a reviewer found real uncovered
requirements as a direct result. **Q6's process half stays OPEN**; until then Rule 31's pre-flight
re-check is our only defence and must keep running every pass.

---

### Q7 — "The search box on the page itself, versus the pop-up search" ⭐ **the 13-case question**

* **What we asked:** *"Is that search box on the page toolbar still part of this project?"*
* **Options offered:** *A) Yes - the search box on the page toolbar stays in this project; only the pop-up search moves to the global search work.* · *B) No - everything to do with searching moves to the global search work, including the search box on the page toolbar.* · plus our note: *"if the answer is B, a sizeable set of tests we have already written moves out of this project, so we want to be sure before we move them."*
* **HIS ANSWER — verbatim:** ***(cell F10 is EMPTY — no letter, no free text)***

**CONSEQUENCE: NO CHANGE — stated plainly: the 13 page-toolbar-search cases STAY IN FILTERS. Nothing moves, nothing retires.**

**The 13 cases, in full (Rule 8 / Rule 17 — the complete list, not a sample):**

| # | Internal ID | C-id | Title | Link |
|---|---|---|---|---|
| 1 | FLT-PSRCH-01 | C38883 | Page toolbar Search expands in place and narrows the list as you type | https://shopview.testrail.io/index.php?/cases/view/38883 |
| 2 | FLT-PSRCH-02 | C38884 | Page search combines with filters and is cleared separately | https://shopview.testrail.io/index.php?/cases/view/38884 |
| 3 | FLT-PSRCH-03 | C38886 | Your typed search stays in this browser tab only and is never saved | https://shopview.testrail.io/index.php?/cases/view/38886 |
| 4 | FLT-PSRCH-04 | C38888 | The search term is part of the shareable page link | https://shopview.testrail.io/index.php?/cases/view/38888 |
| 5 | FLT-PSRCH-05 | C38889 | On mobile the search expands in the toolbar and buttons make room | https://shopview.testrail.io/index.php?/cases/view/38889 |
| 6 | FLT-PSRCH-06 | C38891 | Every list page keeps its own search box (Parts, Reports, detail tabs) | https://shopview.testrail.io/index.php?/cases/view/38891 |
| 7 | FLT-PSRCH-07 | C38893 | The top navigation search no longer filters page lists | https://shopview.testrail.io/index.php?/cases/view/38893 |
| 8 | FLT-PSRCH-08 | C38898 | The Search box changes look as you hover over it, open it and type | https://shopview.testrail.io/index.php?/cases/view/38898 |
| 9 | FLT-PSRCH-09 | C38899 | The list narrows shortly after you stop typing, with no button to press | https://shopview.testrail.io/index.php?/cases/view/38899 |
| 10 | FLT-PSRCH-10 | C38900 | One search box serves all Work Orders tabs and searches the tab you are on | https://shopview.testrail.io/index.php?/cases/view/38900 |
| 11 | FLT-PSRCH-11 | C38901 | Each Report tab and each Parts view keeps its own separate search | https://shopview.testrail.io/index.php?/cases/view/38901 |
| 12 | FLT-PSRCH-12 | C38902 | An old link carrying a top-search word no longer narrows the page list | https://shopview.testrail.io/index.php?/cases/view/38902 |
| 13 | FLT-PSRCH-13 | C38903 | Collapsing the filter bar keeps an active search working | https://shopview.testrail.io/index.php?/cases/view/38903 |

**Why they stay — the two halves are different things, and only one was ever ruled on.**

The **pop-up palette** half **is** settled. His answer of 2026-07-31 to the earlier sheet, verbatim:

> **"A - Test it under Global Search, not here. This release only removes global search's page-filtering behaviour (Story 14). 'Ask a question' is not in this PRD's scope."**

That ruling was executed: the 9 **FLT-SRCH** palette cases were retired (none had ever been in
TestRail, so nothing was deleted) — confirmed this pass, **no FLT-SRCH id appears in the id-map**.

The **page-toolbar** half is a different control and **his own PRD v1.6 puts it squarely inside
this project.** Rule 25, verbatim:

> **Story 13: Page Search** — *"As a user, I want to search within the page I'm on so that I can find a specific record without setting up a filter."* — **25 requirements, S13-R1 to S13-R25**
> **S13-R1:** *"A Search control is displayed in the page toolbar, in the right-hand action group…"*
> **Key Decisions:** *"**Page search is separate from the filter bar, not a filter chip.** It lives in the toolbar row with the collapse toggle and primary action…"*
> **S14-R1:** the global header search *"returns navigational results only"* — the two are deliberately split

**The honest residual ambiguity, recorded not resolved.** One sentence of his ruling — *"This
release only removes global search's page-filtering behaviour (Story 14)"* — read **literally and
in isolation** would also descope Story 13. His answer is **newer** than v1.6 (answered
2026-07-31; spec dated 2026-07-28), and Rule 32 makes the newest source win, so we do **not**
dismiss the reading. But he was answering a question **about the pop-up box**, and taking that
sentence to delete a 25-requirement story he wrote three days earlier would be an inference far
beyond what he said. **So: default position held — the 13 cases stay where they are, in Filters,
untouched — and Q7 remains a one-line confirmation ask.** This is the same flag recorded as F2 in
the earlier pass; it has **not** been resolved by this delivery.

---

### Q8 — "Six of the newer filter buttons are never shown opened"

* **What we asked:** *"For those six buttons, can we get a one or two line written description of each - what choices it offers, and what happens to the list when you pick one?"* (Location, Transaction Type, Invoice Status, Type, User, Mention)
* **Options offered:** *A) Yes - a short written description will be added for those six.* · *B) No - treat the design pictures as the source, and ask me about each one as you come to it.*
* **HIS ANSWER — verbatim:** ***(cell F11 is EMPTY — no letter, no free text)***

**CONSEQUENCE: NO CHANGE — the existing hedged wording is the correct interim state.**

**Rule 25.** v1.6 describes Parts/Reports filters only as a **pattern**, never per-chip. Verbatim:

> *"Filters are context-specific per view: each view shows only the chips relevant to its data"*
> *"Entity filters (Customer, Vendor, Created by, Ordered by, Received by, Processed by) use the searchable multi-select dropdown; long lists such as Category and Manufacturer also include a search field; short attribute filters (Supply, Part Type, Bin Location, State/Province, Status) use the checkbox list"*

Neither list names **Location, Transaction Type, Invoice Status, Type, User or Mention**, and §7
Stories 1–14 contain **no Parts story and no Reports story** — so there is no `S#-R#` anchor to
cite for any of the six. Their contents are unknown from both sources, which is why the cases test
the pattern rather than asserting option lists we cannot see. **Correct as written. Q8 stays OPEN.**

---

## 4. TALLY

| | Count | Questions |
|---|---|---|
| **Answered** | **0** | — |
| **Blank** | **8** | Q1 · Q2 · Q3 · Q4 · Q5 · Q6 · Q7 · Q8 |
| Consequence: NO CHANGE | 4 | Q3 (hedge stands) · Q5 (PRD agrees it is pending) · Q7 (**13 cases stay in Filters**) · Q8 (hedge stands) |
| Consequence: STILL AMBIGUOUS | 4 | Q1 (**FLT-MOB-04 / C29624** most likely to reverse) · Q2 (**FLT-TAB-06 / C38876** rests on the tech plan alone) · Q4 (**sorting block stays unwritten**) · Q6 (process half) |
| Consequence: CASE EDIT NEEDED | **0** | — |
| Consequence: NEW CASE NEEDED | **0** | — |
| Consequence: CASE CAN BE UN-FLAGGED / RETIRED | **0** | — |

**Total case operations required by this delivery: ZERO.** See `staged-case-plan.md`.

---

## 5. ASKS ON BRANKO ABOUT HIS OWN SPEC (unchanged by this delivery, re-confirmed against live v1.6)

None of these is created by this pass; all are re-proved still true against the live v1.6 text.

1. **The PRD has no first-visit default-tab requirement**, yet **FLT-TAB-06 = [C38876](https://shopview.testrail.io/index.php?/cases/view/38876)** asserts Estimates opens first, on the tech plan's word alone (Q2).
2. **The PRD says "no confirm/apply button needed" (S2-R6)** while the mobile Figma boards show **"Apply filter"**, which is what **FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)** currently asserts (Q1). One of the two must give.
3. **Sorting appears in the designs but nowhere in the PRD** (one incidental word in S13-R14) — if it is in scope, the PRD needs a Story (Q4).
4. **S13-R23 is marked "Pending" by him** — the per-table searchable-field list (Q5).
5. **Vendors is listed as getting filters but has no design** (Q3).
6. **No Parts story and no Reports story exist in §7**, so 12 Parts/Reports cases can cite no `S#-R#` anchor — this is the unresolved **Q1 of the earlier sheet**, still blank since 2026-07-27.
7. Pre-existing PRD-alignment asks stand: the "hidden" Status-chip prose (6 places) still contradicts his own earlier Q4=B answer, and Story 12 versus the mobile "All Filters" / "Apply filters" sheet.

---

## 6. WHY NO FOLLOW-UP SHEET WAS PRODUCED

**No new sheet. This is a deliberate decision, not an omission.**

All 8 questions on the sheet he already holds are **still unanswered and still correctly worded** —
re-proved this pass against live v1.6 (§3), against every prior answer set, and against the tech
plan. Nothing has become answerable, and **no new product question arose**, because a blank sheet
introduces no new information.

Issuing `…Round-2` now would hand Branko **two sheets containing the same 8 questions**, so he
could answer the wrong one and we would not know which was authoritative. The earlier pass reached
the same conclusion for the same reason. **The live ask remains the single sheet already sent:**
`build/filters/PO-Questions-Branko-Filters-TechPlan_2026-07-30.xlsx`. It needs **chasing, not
reissuing.**

Two questions have also been **partially self-served since it was written**, which is worth telling
him when chasing: **Q6's factual half** (1.6 confirmed current by live observation) and **Q3's scope
half** (his own PRD lists Vendors). Neither can be closed without him.

---

## 7. OUTSTANDING — what I need from you

**Filters** — PO **Branko** · **110 active cases**, all live in TestRail under group 4110, all VIU-Pending · run **352** holds all 110.

| # | What is missing | Who owes it | What it BLOCKS | Since |
|---|---|---|---|---|
| 1 | **All 8 answers on the Filters tech-plan sheet — the returned file is blank for the second time.** If he replied on another channel, or edited a *converted copy*, please forward it as **File → Download → Microsoft Excel**; edits in a converted copy never land in the uploaded original. | **Branko** — you to chase | **Q4 blocks a whole block of sorting cases** that cannot be written without it. **Q1** leaves FLT-MOB-04 (C29624) asserting a button his own spec says is not needed. **Q2** leaves FLT-TAB-06 (C38876) resting on an engineering doc, which Rule 32(ii) says can never settle product truth. Q3/Q5/Q7/Q8 keep four behaviours hedged. | Sheet sent **2026-07-30**; blank on **2026-07-31** (twice) |
| 2 | **Whether a Jira epic exists for Filters at all** — proven absent: all **170** SV epics enumerated 2026-07-31, none is Filters. | **You / Branko** | **The worst authenticity gap we have.** Rule 20 needs ticket **and** spec anchor; with no ticket anywhere, **all 110 cases can only ever cite the spec** — half of traceability is unsatisfiable. | 2026-07-17; proven absent 2026-07-31 |
| 3 | **The numbered per-page write-up for Parts and Reports filters** (Q1 of the 2026-07-27 sheet, also blank). §7 of v1.6 has **no Parts story and no Reports story** — not one `S#-R#` anchor. | **Branko** | **12 Parts/Reports cases** rest on designs alone — genuinely weaker traceability than the rest of the suite. | **2026-07-27 — 4 days** |
| 4 | **A Figma token on this container** — `/tmp` was wiped by the reset. | **You** | **12 of 85** design boards still have no PNG; the Rule-35 queue is **OPEN**, so the Filters design pass **may not be reported complete**. All 12 are described from node trees, so nothing is guessed. | 2026-07-30 |
| 5 | **Nothing is authorized or executed by this pass, and nothing is requested.** No case edit, add or retire is required (§4), so **there is no push to approve.** Should Q1/Q2/Q4 later arrive, the edits are pre-staged in `staged-case-plan.md` and **will need your explicit go-ahead** (Rule 6) — including a **UNION-only** `update_run` on run 352 if sorting cases are ever added (Rule 34/47). | — | Nothing right now. | — |

**In one line:** *Chase Branko for the 8 answers — Q4 (sorting in scope or not) is the single answer that creates or cancels a whole block of test cases, and Q1 may reverse a case we already hold.*
