# Filters — Branko's ANSWERS to the tech-plan sheet — INGESTED 2026-08-04 — **9 OF 9 ANSWERED**

**This file is the SOURCE OF RECORD for what Branko actually said.** Verbatim only.
The executable change list lives in `staged-case-plan.md`; the defence positions it settles
are moved to `../provenance-2026-08-04/PO-RULING-DEFENCE.md`.

> ## HEADLINE — the sheet came back FULL. Every one of the nine questions carries an answer.
>
> **9 of 9 answered. 0 blank.** This is the **FOURTH** delivery of this link and the **FIRST**
> that contains anything: the three previous pulls (two on 2026-07-31, one earlier the same
> day) came back with every answer cell empty, proved at XML level each time.
>
> **The two rulings that matter most:**
> - **Q1 — the mobile single-filter window: `"A - no apply button"`.** Choices apply
>   **instantly as you tick**. This is the engineering plan's model. **It retires the
>   highest-risk entry in our whole defence register** and **unfreezes the 8 mobile cases**.
> - **Q4 — sorting: `"C"` = NOT part of this project.** The ~6–8 proposed sorting cases are
>   **cancelled, not deferred**. Nothing to author. The two sub-questions (is two sorts the
>   maximum; how is direction reversed) became **moot** — he did not answer them and does not
>   need to.
>
> **NOTHING HAS BEEN INFERRED FROM OUR OWN OPTION TEXT WHERE HE TYPED NOTHING (Rule 12).**
> Three answers (Q3, Q8, Q9) are free text with **no letter picked** and are recorded as free
> text. **Q8 does not answer the question it was asked** — that is stated plainly in §3, not
> smoothed over. **No test case was edited and no TestRail write of any kind was made.**

| | |
|---|---|
| Sheet he answered | `build/filters/PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` / `.xlsx` (issued 2026-07-30, revised 2026-07-31, a 9th row added 2026-07-31) |
| Raw file received | Google Drive `1fkjdt9hoYSGv2MToXUFJ_4tTMzP7a7X2`, preserved here as **`PO-Questions-Branko-Filters-TechPlan_ANSWERED-2026-08-04.xlsx`** (13 290 bytes, md5 `99bf011cc462ca81bc55a7d6532e91e3`) |
| Ingested | **2026-08-04** |
| PO | **Branko** (Filters / Schedule / Global Search — never mix: Chris Ward = Report Suite + Fees & Discounts; Milos = Simple Flow) |
| **Answered** | **9 of 9** — Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9 |
| **Left blank** | **NONE** |
| Answers that picked a clean option letter | **6** — Q1=A · Q2=A · Q4=C · Q5=B · Q6=A · Q7=A |
| Answers that are free text with no letter | **3** — Q3, Q8, Q9 |
| Answers that do **not** answer the question asked | **1 — Q8** (§3.8) |
| Case edits made this pass | **ZERO** |
| `cases/` · `testrail-id-map.csv` · `testrail-import/` touched | **NO** |
| TestRail writes | **ZERO** — read-only `get_run/352`, `get_tests/352`, `get_results_for_run/352`, `get_case/*` |
| Filters QA branch touched | **NO** — not one request (see §0.3) |

---

## 0. PRE-FLIGHT (Standing Rule 31) — every source's currency, established BEFORE the work

### 0.1 SOURCE-CURRENCY BLOCK

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| 1 | **Branko's returned sheet** | Drive `1fkjdt9hoYSGv2MToXUFJ_4tTMzP7a7X2`, `dcterms:created` **2026-07-30T14:41:28Z**, `dc:creator` **openpyxl**, no `dcterms:modified`, no `lastModifiedBy` | 13 290 bytes (was 11 968 / 12 299 when blank) | 2026-08-04 | **CURRENT and, for the first time, POPULATED** — 9 of 9 answers present (§1) |
| 2 | **Filters spec (PRD)** | Confluence page **572030978** | **Confluence version 14**, `createdAt` **2026-07-31T13:10:34Z**; page-body version **1.6** — **re-fetched LIVE this pass** (`GET /wiki/api/v2/pages/572030978?body-format=storage` → HTTP 200, 73 403 bytes) | 2026-08-04 | **CURRENT** — identical version to our 2026-08-04 baseline; **no new version since 2026-07-31**. Confirms Branko's own **Q6 = "A"**. |
| 3 | **Filters epic** | **SV-8785** | **14 children SV-8786…SV-8799**, re-read LIVE this pass; story set **unchanged**; **SV-8795** Filter Persistence + **SV-8796** URL State remain **Ready for QA** (updated 2026-08-03); the other 12 remain **Open** | 2026-08-04 | **CURRENT** — Rule-37 **Tier-1** check only; no movement, so **no Tier-2 full re-read was needed or requested** |
| 4 | **Filters designs** | Figma `DR4gEODShYgJqkozs3mF5q` | **85 of 85** boards rendered; Rule-35 queue **CLOSED** 2026-07-31T08:58:40Z | 2026-08-04 | **CURRENT** — and this pass **used** it: the Vendors board was opened and read (§3.3) |
| 5 | **Engineering tech plan** | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | reconciled 2026-07-29 / 07-30 | 2026-08-04 | **CURRENT** — it is the **subject** of Q1/Q2/Q5, and **decision D15 is what Branko's Q1 answer adopts** (§3.1) |
| 6 | **Prior PO answers** | `branko-answers-2026-07-17`, `-round2-2026-07-20`, `-2026-07-31` | previous newest = **2026-07-31** | 2026-08-04 | **SUPERSEDED IN PART** — this file is now the newest authoritative product input for Filters (Rule 32) |
| 7 | **TestRail run 352** | run **352** "Filters - Ahtasham (Awaiting QA- ENV)" | `include_all:false`, **110 tests**, **396 result records**, 1 Passed / 0 Failed / 0 Blocked / 109 Untested | 2026-08-04 (live, read-only) | **CURRENT** — see §0.2, one figure has moved |
| 8 | **Filters QA branch** | `sv8785.qa.shopview.com` | exists since 2026-08-04 | — | **DELIBERATELY NOT CONSULTED** (§0.3) |

**No source is STALE. No source is PARTIAL.** This is the first Filters pass where that is true of
all five source types at once.

### 0.2 One live figure has moved since this task was written — reported, not smoothed over

The task brief states run 352 holds **395** result records. **Live, read-only, 2026-08-04 it holds
396**, and the run's status counts are **1 Passed / 109 Untested** rather than 110 Untested.

* Set-equality check both ways (Rule 50): the run's **110** `case_id`s equal our **110** active
  cases exactly — 0 in the run and not in the suite, 0 in the suite and not in the run.
* Record breakdown: **1** status `1` (Passed), **79** status `3` (Untested), **316** with no status
  (comment / assignment records).
* The run is assigned to `assignedto_id: 7`. **We did not write it** — this pass made no TestRail
  write at all, and the previous Filters pass logged none either.

**Why it matters:** run 352 now holds a **graded result**. Under Rule 34/47 that raises the cost of
any careless `update_run` from "loses tests" to "loses a tester's recorded work". §Run consequence
in `staged-case-plan.md` carries the numbers.

### 0.3 The Filters QA branch was NOT touched — deliberately, and it limits two answers

A Filters QA branch now exists at `https://sv8785.qa.shopview.com` with credentials on disk, but
the QA lead has **reserved permission for the Filters VIU until Report Suite is complete**. So
**not one request was made to it** — no login, no page load, no API call.

**Consequence, stated rather than hidden (Rules 12/22):** two of his answers can be *recorded* and
*reasoned about* but not *confirmed against the build* — **Q1** (does the shipped mobile sheet
actually behave the way he ruled) and **Q3** (does the Vendors page actually have its two filter
buttons in the build). Both are marked **"needs the live check once VIU is authorised"** and neither
is presented as verified.

---

## 1. PROOF THE ANSWERS ARE REAL, AND THAT THE FILE IS OURS

### 1.1 Retrieval — three endpoints, all agreeing

| Endpoint | HTTP | Bytes | Answers visible |
|---|---|---|---|
| `export?format=xlsx` | 200 | 13 290 | 9 of 9 |
| `export?format=csv` | 200 | 10 464 | 9 of 9 |
| `/gviz/tq?tqx=out:csv` | 200 | 10 646 | 9 of 9 |

`file` reports **"Microsoft Excel 2007+"**, `openpyxl` opens it cleanly, and it is a 12-part zip —
**not** an HTML sign-in page.

### 1.2 The answers exist at XML level — they are not whitespace and not our own text

Column **F** is `Your answer`. In `xl/worksheets/sheet1.xml` every one of the nine answer cells is a
**shared-string cell carrying a value**:

```xml
<c r="F4"  s="5" t="s"><v>11</v></c>   <c r="F5"  s="5" t="s"><v>16</v></c>
<c r="F6"  s="5" t="s"><v>21</v></c>   <c r="F7"  s="5" t="s"><v>26</v></c>
<c r="F8"  s="5" t="s"><v>31</v></c>   <c r="F9"  s="5" t="s"><v>36</v></c>
<c r="F10" s="5" t="s"><v>41</v></c>   <c r="F11" s="5" t="s"><v>46</v></c>
<c r="F12" s="9" t="s"><v>51</v></c>
```

Contrast the same cells in the blank capture of 2026-07-31
(`../branko-sheet-check-2026-07-31/Filters-sheet-as-returned-BLANK-2026-07-31.xlsx`), where each was
`<c r="Fn" s="4"/>` — **a style attribute and no `<v>` element at all**. That is the difference
between blank and answered, at the byte level.

* `F13` is `<c r="F13" s="10"/>` — an empty styled trailing row, no question attached.
* **No comments part exists** in the workbook, so no answer is hiding in a cell comment.
* `xl/drawings/drawing1.xml` is an **empty container** (775 bytes, self-closing root) — nothing there.
* Columns **G…K** exist in the dimension (`A1:K13`) but hold **no values** — nothing typed off to the side.
* Credential scan of every unzipped XML part: **nothing credential-like** (checked before committing,
  because `grep` skips the binary).

### 1.3 What he changed in our own text: NOTHING

Compared against `build/filters/PO-Questions-Branko-Filters-TechPlan_2026-07-30.xlsx` and the blank
returns: **every one of our five columns (`#`, `Topic`, `What happens now`, `The question`,
`Options`) is unchanged on all nine rows.** He added no row and deleted none.

Two differences from the file we issued, both **round-trip artefacts, not edits by him**: cell **A2**
(a QA sub-note) is dropped, and the second tab **`QA Internal Mapping`** is absent. Neither carried a
question.

### 1.4 Row 9 — the history, because it matters for how to read Q9

The task brief notes a row 9 was added on 2026-07-31 and that a **replacement wording** had been
prepared for it. **The replacement was the version sent.** Proof, by comparing the live row against
`../branko-parts-reports-request-2026-07-31/ASSESSMENT.md` §4:

* The sent `Topic` is *"The Parts and Reports filters — the page-by-page list (a request, not a
  choice)"* — the replacement's title, not the original's.
* The sent `What happens now` **opens by crediting his write-up** (*"Thank you — your written
  description now covers the Parts and Reports filters, and you confirmed on 17 July that they are
  part of this release, so we are not asking that again"*) and says *"names the **eight** Parts
  pages"*. The original row falsely claimed his description omitted Parts/Reports and said
  *"nine"*. The assessment flagged both; both are fixed in what he received.

**So he answered the corrected question, not the wrong one.** The only leftover is cosmetic: the
title row still reads *"8 questions"* for 9 rows.

---

## 2. HIS ANSWERS — VERBATIM, ALL NINE

Column order in his file: `# | Topic | What happens now | The question | Options | Your answer`.
Only the **"Your answer"** cell is his. Every quotation below is transcribed **character for
character**, including his own spelling.

### Q1 — Mobile: single filter windows — instant or with an Apply button

- **What we asked:** *"In the single-filter window on a phone, should choices apply instantly as you tick, or only after tapping an "Apply filter" button?"*
- **Options offered:** A) Instantly as you tick, no Apply button (the engineering plan's way). · B) Only after tapping an "Apply filter" button (as the design pictures show).
- **HIS ANSWER — verbatim:**

> **A - no apply button**

### Q2 — Which tab opens first

- **What we asked:** *"Is Estimates the right tab to open first for a brand-new visit?"*
- **Options offered:** A) Yes - Estimates first is fine. · B) No - it should open on All (…picking B needs a talk with them).
- **HIS ANSWER — verbatim:**

> **A - it's fine**

### Q3 — The Parts "Vendors" page filters

- **What we asked:** *"Please confirm the Vendors page IS meant to get filters, and have the design added - or tell us it is out of scope."*
- **Options offered:** A) Vendors gets filters - design coming. · B) Vendors is out of scope for now.
- **HIS ANSWER — verbatim (free text, no letter picked; his spelling preserved):**

> **Disign for vendors exists in figma. Check it**

### Q4 — Sorting the Work Orders list

- **What we asked:** *"Is sorting part of this project? If yes: is two sorts at a time the intended maximum; how does someone reverse a sort so it runs the other way, and should the sorted column show a mark; and are the sort buttons on the phone version and on those two report pages included too?"*
- **Options offered:** A) Yes - sorting is in scope … including more than one sort level at a time … · B) Yes, but single-level only … · C) No - sorting is not part of this project (the design pictures are exploration only).
- **HIS ANSWER — verbatim:**

> **C**

### Q5 — Which details the new in-page search box looks at

- **What we asked:** *"Please have that list written down per page and shared with us - or tell us to accept "whatever each page's search finds today" as correct."*
- **Options offered:** A) The list of searchable details will be written down and shared … · B) Accept whatever each page's search finds today - we will only test that typing narrows the list, not which details it matches.
- **HIS ANSWER — verbatim (his line break and leading spaces preserved):**

> **B - \*Note - Have Engineering write up that list as technical documentation (not as a blocker for tests, but as a reference document). Tests can work**
> **  with "typing narrows the list" until the list is complete.**

### Q6 — Your latest written description (a request, not a choice)

- **What we asked:** *"Please confirm version 1.6 is the current one, and let us know each time you change it, so we can re-check the tests straight away."*
- **Options offered:** A) Yes - version 1.6 is current, and I will let you know whenever I update it. · B) There is something newer than version 1.6 (please share it).
- **HIS ANSWER — verbatim:**

> **A**

### Q7 — The search box on the page itself, versus the pop-up search

- **What we asked:** *"Is that search box on the page toolbar still part of this project?"*
- **Options offered:** A) Yes - the search box on the page toolbar stays in this project; only the pop-up search moves to the global search work. · B) No - everything to do with searching moves to the global search work …
- **HIS ANSWER — verbatim (his line breaks and run-on spacing preserved):**

> **A — Toolbar search box is part of this project. These are two completely different functionalities:**
> **  - Toolbar search = filters the current list/table on the page (inline, no popup)**
> **  - Global search = searches the entire application (popup, "Search or ask a question") This is not part of this scope, therefore not in the PRD.**
>
> **  It is logical that inline filtering of the list goes with filters. The thing that is part of this prd is we have to remove this page search filtering functionality from the global search as right now it is part of it.**

### Q8 — Six of the newer filter buttons are never shown opened

- **What we asked:** *"For those six buttons, can we get a one or two line written description of each - what choices it offers, and what happens to the list when you pick one?"* (the six being **Location, Transaction Type, Invoice Status, Type, User and Mention**)
- **Options offered:** A) Yes - a short written description will be added for those six. · B) No - treat the design pictures as the source, and ask me about each one as you come to it.
- **HIS ANSWER — verbatim (free text, no letter picked):**

> **We do not have list of all filter items. we should have all filters we support now per each page plus we should add new ones. For example let's use parts sales page. Currently support only status but we can also have customer, created by and date. We already have those values in the table, we just need to include those as filters.**

### Q9 — The Parts and Reports filters — the page-by-page list (a request, not a choice)

- **What we asked:** *"Please write down, page by page, which filter buttons each Parts page and each report should show — set out the same numbered way the Work Orders filters are."*
- **Options offered:** A) Yes — a page-by-page list will be added to the written description (please say roughly when). · B) No — read the buttons off the design pictures, and we will check each page with you as we test it.
- **HIS ANSWER — verbatim (free text, no letter picked; his spelling preserved, including "i" where "and" was meant):**

> **Same as before, we do not have concrete list. If this is really necessary i suggest Engineering + PO together make a list for remaining 6  Parts pages i Reports, using same format as Work Orders do.**

---

## 3. WHAT EACH ANSWER SETTLES, AND THE CONSEQUENCE

Precedence applied throughout: **Rule 32** — his answer of **2026-08-04** is the newest
authoritative product source and wins over spec prose and over the engineering plan; **Rule 33** —
it outranks our own findings and any reviewer's reading. Where his answer **contradicts what a case
currently asserts, our current wording is quoted** so the difference is visible.

### 3.1 Q1 — **"A - no apply button"** · the answer with the biggest consequence

**What it settles, in two distinct halves — and the halves are not equally direct.**

**HALF 1 — DIRECT, in his own typed words.** The **single-filter** bottom sheet on mobile has **no
Apply button**; ticking a choice filters the list **immediately**. Unambiguous.

**HALF 2 — BY HIS SELECTION OF OPTION A, not by a sentence he typed.** Option A's text reads
*"(the engineering plan's way)"*, and the `What happens now` column he read defines that model
explicitly: *"the engineering plan makes single-filter windows apply INSTANTLY as you tick (no
button) - **only the combined "All Filters" window keeps an "Apply filters" button**."* The
engineering plan itself says the same thing, verbatim, in **decision D15**:

> *"Mobile "All Filters" combined bottom sheet — **IN**, with an "Apply filters" button
> (batch-apply; deliberate difference from desktop real-time). Individual chips/sheets stay
> real-time."*
> — `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`, decision table D15

So by choosing A **without amending it**, he adopted a model in which the **combined All Filters
sheet keeps its "Apply filters" button**. **We record the mechanism honestly: this half is an
endorsement-by-option-selection, not a sentence in his own hand** — and it is why §5 drafts one
optional confirmation line rather than treating it as closed beyond challenge.

**Two sources now agree on Half 2** (tech plan D15 + the option he selected), and the agreed design
shows the sheet. Under **Rule 32(i)** duplication raises confidence.

**Consequence — and the first item is a surprise the live read produced.**

**⚠️ FLT-MOB-04 · [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) — LIVE
TESTRAIL ALREADY SAYS WHAT HE RULED. Our LOCAL case source does not.**

| | |
|---|---|
| **LIVE `custom_expected` item 3** | *"There is **no 'Apply filter' button**. Ticking/unticking a status filters the work-order list **immediately**, the same as desktop — no submit step."* |
| **LIVE title** | *"Mobile: tapping one chip opens its own sheet and applies in real time"* |
| **LOCAL `cases/cases-D-mobile-api.json` expected item 3** | *"The bottom button reads 'Apply filter' (singular); tapping it applies the selection and filters the list."* |
| **LOCAL title** | *"Mobile: tapping one chip opens its own sheet with an 'Apply filter' button"* |

**Verdict: the LIVE case is CORRECT under his ruling. The LOCAL SOURCE IS STALE and contradicts it.**
Live was changed by a manual TestRail edit (it carries the `<li data-pasted="true">` paste artefact
recorded in `../provenance-2026-08-04/STAGED-REPAIRS.md`) and the local source was never synced back.
**This is a case-source/live divergence on a tester-facing assertion and it must be reconciled** —
flagged for the coordinator, **not fixed here** (`cases/` is out of this pass's scope).

* **→ CASE CAN BE UN-FLAGGED (assertion)** — its contested assertion is now PO-confirmed.
* **→ CASE EDIT NEEDED (formatting + provenance)** — and the reason it was withheld is now gone.
  `STAGED-REPAIRS.md` gave two reasons for not executing the body reflow; **reason 2 was the
  binding one**, verbatim: *"Reflowing the text means re-committing its contested assertion …
  whether the mobile filters batch behind an Apply button at all is exactly the open Branko
  question (B3)."* **That question is now answered.** The staged reflow is unblocked.
  **One correction to that staged plan:** it says *"Provenance line: unchanged — the case already
  carries the `design_awaiting` variant, which is correct either way."* **That is no longer true** —
  `design_awaiting` ends *"a product owner decision is still awaited"*, which after 2026-08-04 is
  **false**. The line must be re-stamped (Rule 54).

**The other seven mobile cases — provenance re-stamp, no tester-facing change.**
All eight of FLT-MOB-01…08 currently end their Expected Results with:

> *"The screen described above comes from the agreed design rather than that specification, and a
> product owner decision is still awaited."*

That sentence is now **factually wrong on all eight**. → **CASE EDIT NEEDED (provenance line only)**
for **[C29621](https://shopview.testrail.io/index.php?/cases/view/29621) ·
[C29622](https://shopview.testrail.io/index.php?/cases/view/29622) ·
[C29623](https://shopview.testrail.io/index.php?/cases/view/29623) ·
[C29625](https://shopview.testrail.io/index.php?/cases/view/29625) ·
[C29626](https://shopview.testrail.io/index.php?/cases/view/29626) ·
[C29627](https://shopview.testrail.io/index.php?/cases/view/29627) ·
[C29628](https://shopview.testrail.io/index.php?/cases/view/29628)**, plus C29624 above.

**Their assertions all stand.** C29622's *"A sticky blue 'Apply filters' button sits at the bottom of
the sheet"* and C29623's *"After 'Apply filters' the sheet closes…"* — the two entries the defence
register rated **HIGH risk, and warned we would have to concede** — are the **combined** sheet, which
the model he chose preserves. **We do not concede them. The HIGH risk is retired.**

**Correction to our own record (Rule 44 — judge our side first).** The defence register described
C29624 as *"single chip applies live, 'no Apply filter' button — this half agrees with S2-R6"*. That
described **live TestRail** accurately but **mis-described the local case source**, which asserted the
opposite. Corrected in the register this pass.

**Needs the live check once VIU is authorised:** whether the shipped build actually behaves this way
(single sheet real-time, combined sheet batched). Nothing above is live-verified.

**Set-size correction.** The task brief names *"8 cases: FLT-MOB-02…08 = C29622–C29628"*. That range
is **7** cases. The cluster carrying the awaiting-decision provenance line is **FLT-MOB-01…08 =
C29621–C29628 = 8 cases** — FLT-MOB-01 was in it from the start and FLT-MOB-08 was moved into it by
the Rule-28 sweep of 2026-08-04. **FLT-MOB-09 ([C29629](https://shopview.testrail.io/index.php?/cases/view/29629))
and FLT-MOB-10 ([C29630](https://shopview.testrail.io/index.php?/cases/view/29630)) are NOT in it** —
both already carry plain provenance lines and need no change.

---

### 3.2 Q2 — **"A - it's fine"** · Estimates is the right first-visit tab

**What it settles.** The engineering default — first-ever visit selects **Estimates**, thereafter the
last-used tab is restored — is now a **product decision**, not just an engineering one. That closes
the exact gap Rule 30 exists to police.

**Consequence — → CASE CAN BE UN-FLAGGED.**

**FLT-TAB-06 · [C38876](https://shopview.testrail.io/index.php?/cases/view/38876)** — *"First visit
opens the Estimates tab; your last-used tab is remembered"*.

* **Its assertion needs no change.** Live expected 1: *"On the very first visit the Estimates tab is
  the selected one, even though All is the FIRST tab in the row (order and default are different on
  purpose)."* **He confirmed exactly this.**
* **→ CASE EDIT NEEDED (metadata + provenance).** Two now-false statements must go:
  * `refs`, current: *"…default/last-used tab is engineering-plan-only - **confirmation
    requested**"* → the confirmation has arrived.
  * provenance line, current: *"…as per epic SV-8785 and the engineering technical plan. **No
    numbered requirement in the Filters specification version 1.6 covers this point yet.**"* The
    second sentence stays true (the spec still has no such requirement — verified live this pass),
    but the line must now also name his ruling, or it under-claims our basis.
  * the case `notes` open flag *"PENDING BRANKO (Questions Q5 / deltas C5) … If Branko rules the
    default should be All, flip expected 1"* is resolved — he did not.
* **The register's "13 boards show All selected" worry is answered.** His ruling outranks a design
  board (Rule 33), and the sheet told him plainly that All is first in the row. He still said
  Estimates.
* **Still owed by him:** the PRD does not describe the default tab. That stays an **OTHER-TEAM** item.

---

### 3.3 Q3 — **"Disign for vendors exists in figma. Check it"** · Vendors is in, and he is right

**What it settles.** Two things: **(1)** the Parts **Vendors** page **is** meant to get filters — the
substance of option A; **(2)** the design **already exists** and the premise of our question (that it
was missing and had to be requested) was **wrong**.

**We did check it, as he asked. He is right.** Read from the rendered board — **pixel evidence, not a
text-layer guess** — `Parts-Explorations-20.4.2026 / Vendors`, Figma node **`11903:10461`**,
`build/filters/design-2026-07-31/frames/Parts-Explorations-20.4.2026__Vendors__11903-10461.png`:

> Page title **Vendors**; a **New Vendor** button; toolbar **Search**, a filter icon and a
> column/layout icon; and **exactly two filter chips: `Vendor` and `State/Province`**, each with a
> leading icon and a down arrow.

**And his own PRD already said so** — spec v1.6 §2, verbatim: *"A filter bar appears below the page
header on each view of the Parts area (Inventory, Part Sales, Catalog, Returns, Credits, Purchase
Orders, Vendor Invoices, **Vendors**)"*. So **three sources agree**: PRD, design board, PO answer.

**Consequence — → CASE EDIT NEEDED.**

**FLT-PARTS-01 · [C38904](https://shopview.testrail.io/index.php?/cases/view/38904)** — *"Every Parts
list page shows its designed filter buttons"*.

Its chip list for Vendors is **already right** (*"two filter buttons: Vendor and State/Province"* —
matching the board exactly). The problem is the **hedge attached to it**, quoted live:

> **CURRENT (live expected item 8):** *"The Vendors list page shows two filter buttons: Vendor and
> State/Province. **Note: the developers have not been given a design for the Vendors page filters
> yet, so this page may not have them — write down what you actually see instead of failing the
> whole test.**"*

**The premise of that note is false and Branko has said so.** Worse, under Rule 45 a hedge like this
is exactly what lets a real gap pass: a tester finding **no filters at all** on Vendors would follow
the note and **not fail the build**.

> **PROPOSED (expected item 8):** *"The Vendors list page shows two filter buttons: Vendor and
> State/Province."*

Full proposed text, and the honest caveat about build timing, in `staged-case-plan.md` §2.

**Needs the live check once VIU is authorised:** whether the build has actually shipped the Vendors
filter bar. That is a build question, not a scope question, and the case should no longer pre-excuse
its absence.

---

### 3.4 Q4 — **"C"** · sorting is NOT part of this project

**What it settles.** Option C, verbatim as sent: *"No - sorting is not part of this project (the
design pictures are exploration only)."* The four Sorting Figma boards are **exploration**. The
Figma section's own label — *"Sorting (Work In Progress)"* — was the correct signal and we were right
not to author against it.

**Corroborated by the spec, checked LIVE this pass:** the whole v1.6 body contains the token *sort*
**exactly once**, incidentally, inside `S13-R14` (*"It survives sorting, pagination…"*). There is no
sorting Story, no sort maximum, no direction mechanism and no column indicator anywhere in it.

**Consequence — → NO CHANGE, and the proposal is CANCELLED rather than deferred.**

* **0 new cases.** The design-backed proposal of roughly **6–8** cases
  (`design-2026-07-31/RECONCILIATION-12-2026-07-31.md` §D-1) is **withdrawn**. It was never
  authored — no internal IDs, no C-ids, nothing ever pushed — so **nothing is deleted and nothing is
  lost**. The answer to *"how many sorting cases do we have?"* remains, permanently now,
  **zero — by product decision**.
* **The two sub-questions are MOOT, and that is the honest word for it.** He answered the scope
  question and not the details (*is two sorts the maximum*; *how is direction reversed / does the
  sorted column show a mark*). Because scope is **C**, the details are **not needed** — there is
  nothing to author, so Rule 42 is satisfied by there being no enumeration to pin. **This is not a
  shortfall in his answer.** Had he said A or B, the details would have been blocking and we would be
  reporting them as such.
* **Nothing in the existing 110 cases has to change.** A full sweep of all 110 for sorting
  assertions found **no case that tests sorting behaviour**. Five incidental mentions exist and all
  five are legitimate:
  * **FLT-MOB-09 · [C29629](https://shopview.testrail.io/index.php?/cases/view/29629)** — step names
    the toolbar contents *"(Search, sort icon, New Work Order button)"*: an **observation** of what is
    in the toolbar, testing the absence of the filter-bar collapse toggle. Fine.
  * **FLT-PSRCH-03 · [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)** — *"Sort the
    table by a column, then move to the next page"* / *"Sorting and paging keep your search
    applied"*: uses the app's **existing** sorting as a stability probe for `S13-R14`, which is a
    real spec requirement. Fine — and note his ruling removes sorting from this **project's** scope,
    not from the **app**.
  * **FLT-RPTS-01 · [C38909](https://shopview.testrail.io/index.php?/cases/view/38909)** item 16 and
    **FLT-PERS-06 · [C38881](https://shopview.testrail.io/index.php?/cases/view/38881)** — icon
    presence and migration-carry-over of existing sort state. Fine.
* **The QA lead's freeze on this block can be closed as CANCELLED.** Its unblocking condition was
  *"Branko's answer to Q4"*; the answer arrived and it is **C**.

---

### 3.5 Q5 — **"B"** + a note · test that typing narrows the list, nothing more

**What it settles.** We do **not** need the per-page list of searchable details in order to test.
The list becomes **engineering reference documentation**, explicitly *"not as a blocker for tests"*.
Tests assert **narrowing**, not **which fields match**.

**This resolves a gap the PRD itself flags.** Spec v1.6 `S13-R23`, verbatim (confirmed present in
the live body this pass): *"…**Pending: the per-table list of fields currently covered, from
engineering. Until it exists the searchable set is undocumented and QA has no baseline to test
against**…"* — plus five client-side surfaces for which *"no list of covered fields exists to
document"*. **Branko has now ruled that undocumented state ACCEPTABLE for testing purposes.** The
PRD's *"QA has no baseline"* is no longer a blocker; it is a documented product position.

**Consequence — → NO CHANGE. Zero case operations.**

Verified across all **13** FLT-PSRCH cases: **not one asserts which fields the search matches.**
Every one already tests narrowing only, and where a field is named it is named as an *example for the
tester to type*, never as an assertion. Examples:

* **FLT-PSRCH-01 · [C38883](https://shopview.testrail.io/index.php?/cases/view/38883)** — step 3:
  *"Type part of a work order's text (**for example** part of a customer or asset name)"*; expected 2:
  *"The list narrows as you type…"*. Illustrative, not a closed list. **Rule 42 clean.**
* **FLT-PSRCH-10 · [C38900](https://shopview.testrail.io/index.php?/cases/view/38900)** —
  precondition: *"You have a word (**for example** part of a customer name) that matches work orders
  on more than one of those tabs."* Same pattern.

**So our suite was already written the way he has now ruled.** That is the ideal outcome of a PO
question and it is worth stating: **his answer validates existing wording rather than changing it.**

**One thing he has added, and it is now owed by engineering, not by him:** the write-up as a
reference document. That is a **new OTHER-TEAM item** (engineering), explicitly **not blocking**.

---

### 3.6 Q6 — **"A"** · version 1.6 is current

**What it settles.** v1.6 is the current PRD, and he will tell us when he changes it.

**Independently verified LIVE this pass, not taken on trust (Rule 31's staleness trap):** the
Confluence **page version is 14** with `createdAt` **2026-07-31T13:10:34Z**, and the **body** version
string reads **1.6**. Both agree, and both match our baseline. The trap Rule 31 warns about — a body
"Version" field frozen at an old number while the real page advances — **is not firing here**.

**Consequence — → NO CHANGE.** Our baseline was already current. Every one of the 110 provenance
lines names *"the Filters specification version 1.6"*, and that remains accurate — **no re-stamp is
needed on version grounds**.

**The value of this answer is forward-looking:** his commitment to notify on change is what makes
Rule 31's pre-flight cheap next time. It does not remove the pre-flight — we re-fetched anyway, which
is why we can state the version rather than assume it.

---

### 3.7 Q7 — **"A"** + a substantial explanation · the page-toolbar search STAYS in Filters

**What it settles — three separate statements, recorded separately.**

1. **The page-toolbar search belongs to THIS project.** *"Toolbar search box is part of this project."*
2. **They are two different features, and he draws the line himself.** *"Toolbar search = filters the
   current list/table on the page (inline, no popup)"* versus *"Global search = searches the entire
   application (popup, "Search or ask a question") This is not part of this scope, therefore not in
   the PRD."*
3. **NEW information — he restates the Story-14 work as the thing this PRD owns:** *"The thing that
   is part of this prd is we have to remove this page search filtering functionality from the global
   search as right now it is part of it."*

**Consequence — → NO CHANGE, and a large answer to the biggest "what if" in the project.**

* **All 13 FLT-PSRCH cases STAY in Filters.** The sheet warned him that answer B would move *"a
  sizeable set of tests"* out; he chose A. Those 13 —
  [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) ·
  [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) ·
  [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) ·
  [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) ·
  [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) ·
  [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) ·
  [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) ·
  [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) ·
  [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) ·
  [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) ·
  [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) ·
  [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) ·
  [C38903](https://shopview.testrail.io/index.php?/cases/view/38903)
  — **need no edit**: they are grounded in spec Story 13's **29 numbered requirements**, the
  best-sourced area in the suite.
* **His statement 3 confirms our two Story-14 cases outright.** **FLT-PSRCH-07 ·
  [C38893](https://shopview.testrail.io/index.php?/cases/view/38893)** (*"The top navigation search no
  longer filters page lists"*) and **FLT-PSRCH-12 ·
  [C38902](https://shopview.testrail.io/index.php?/cases/view/38902)** (*"An old link carrying a
  top-search word no longer narrows the page list"*) test exactly the removal he describes. **PO
  confirmation now sits behind them.**
* **The 9 retired FLT-SRCH palette cases stay retired — now on a DOUBLE confirmation.** FLT-SRCH-01…09
  (the ⌘K *"Search or ask a question"* pop-up) were retired locally and **never pushed to TestRail —
  they have no C-ids**. The QA lead's ruling was *"OK do not delete those cases unless Branko confirms
  that they are related to Global search only."* Branko confirmed on **2026-07-31** (*"A - Test it
  under Global Search, not here"*) and again now (*"Global search … This is not part of this scope,
  therefore not in the PRD"*). **The condition is met twice over.** Their coverage lands in the Global
  Search project on its resume — no TestRail operation is required here, because nothing of theirs is
  in TestRail.
* **"Ask a question" (AI) stays out of the Filters PRD** — consistent with his 2026-07-31 answer.
  Global Search's own **OQ-3** (does the AI placeholder ship in V1?) is a **Global Search** question
  and is untouched by this.

---

### 3.8 Q8 — free text · **it does NOT answer the question it was asked**, and that is stated plainly

**The question was:** for the **six** filter buttons never drawn opened — **Location, Transaction
Type, Invoice Status, Type, User, Mention** — what choices does each offer, and what happens to the
list when you pick one?

**His answer does not address any of the six.** It restates a scope principle and gives an example
about a **different** page. Recorded as it is, not smoothed into a verdict it does not support
(Rule 12). **No letter was picked.**

**What it DOES settle — two things, both genuinely useful:**

1. **"We do not have list of all filter items"** — a **direct statement that no written list
   exists**. That is the substance of the *situation* option B describes, though he did not pick B.
   Combined with his **2026-07-31 Q3** (*"There is no specific list of choices"*), the product
   position is now consistent and twice-stated: **the option lists are data-driven and there is no
   fixed list to assert.**
2. **A parity-plus-extend rule, stated for the second time:** *"we should have all filters we support
   now per each page plus we should add new ones."* His 2026-07-31 Q3 said *"We should support all
   the filters we have right now in the app as well as all choices per filter."* **Two independent
   statements of the same rule** → Rule 32(i), CONFIRMED.

**Consequence — mixed, and the useful half is a genuine corroboration.**

* **→ NO CHANGE · FLT-RPTS-22 · [C38911](https://shopview.testrail.io/index.php?/cases/view/38911)**
  — *"New Reports filter types behave correctly (Location, Transaction Type, etc.)"*. This is the case
  that carries the six buttons, and **it already says the honest thing**, live expected item 3:
  *"Write down the choices you actually see behind each of these six buttons. **They have not been
  written down anywhere yet, so your list becomes the record.**"* His *"We do not have list of all
  filter items"* **confirms that sentence is accurate.** A `refs` strengthening is available
  (optional, §4 of the staged plan); the tester-facing text is right as it stands.
* **→ CASE STRENGTHENED (no wording change) · FLT-PARTS-13 ·
  [C38908](https://shopview.testrail.io/index.php?/cases/view/38908)** — *"Every filter a page had
  before is still available in the new filter bar"*. This case exists **solely** to test the
  parity rule, and that rule now has **two** PO statements plus the tech plan's rollout rule behind
  it. Optional `refs` update only.
* **→ A DIRECT CORROBORATION OF A DESIGN-DERIVED ENUMERATION — worth flagging, because these are
  our weakest assertions.** His example names the Part Sales chips explicitly: *"parts sales page.
  Currently support only status but we can also have customer, created by and date."* Our
  **FLT-PARTS-01 · [C38904](https://shopview.testrail.io/index.php?/cases/view/38904)** expected item
  2 reads: *"Part Sales shows four filter buttons: **Status, Customer, Created by and Date**."*
  **Item for item, in his own words.** That enumeration was read off a Figma board; **it is now
  PO-sourced.** One of eight Parts views moves from design-derived to PO-confirmed.
* **→ STILL AMBIGUOUS — but re-asking would be WRONG.** The six buttons' option lists remain
  undescribed. **We are not raising a new question about them**, and §5 sets out the proof of why:
  between Q3 (2026-07-31) and Q8 (2026-08-04) he has twice said no list exists and the choices come
  from shop data, and our case already tests it that way. Asking a third time would be the fifth
  withdrawn question of this project.

---

### 3.9 Q9 — free text · no page-by-page list exists; he proposes Engineering + PO produce one

**What it settles.** **(1)** The page-by-page list **does not exist** — *"Same as before, we do not
have concrete list."* **(2)** He does **not** decline it: he proposes **who should produce it and in
what shape** — *"i suggest Engineering + PO together make a list for remaining 6 Parts pages i
Reports, using same format as Work Orders do."* His *"remaining 6 Parts pages"* **matches our own
count exactly**: v1.6 §2 names buttons for 2 of the 8 Parts views (Inventory, Purchase Orders), so
**6** remain. **He has read our question precisely.**

**This is an answer, not a blank** — and it is a materially better one than a bare "B", because it
names an owner and a format. But **it does not close the gap**.

**Consequence — → STILL AMBIGUOUS / OPEN, and the affected risks stay where they are.**

* **0 case operations.** Nothing he said changes any assertion.
* **The two most exposed cases stay design-derived, and keep their honest provenance lines:**
  * **FLT-PARTS-01 · [C38904](https://shopview.testrail.io/index.php?/cases/view/38904)** — an
    **8-view** chip presence walk. **6 of the 8 views' chip sets have no written source.** (Part
    Sales is now PO-confirmed by Q8 — §3.8 — and Vendors is now design-confirmed and PO-scoped —
    §3.3. So the exposure narrows from 6 views to **5**: Catalog, Returns, Credits, Vendor Invoices
    and the Returns/Credits tab split.)
  * **FLT-RPTS-01 · [C38909](https://shopview.testrail.io/index.php?/cases/view/38909)** — a
    **23-report** chip presence walk, **entirely design-derived**. v1.6 names **no individual
    report**. This remains **the single most exposed case in the project** and Q9 does not change it.
* **The structural fact is unchanged and was re-verified live this pass:** spec v1.6 §7 holds
  **Stories 1–14 with no Parts story and no Reports story**, so there is **not one `S#-R#` anchor**
  for any Parts view or any report. Their `refs` cite prose sections, which is the honest position and
  is weaker than the rest of the suite.
* **The ask CHANGES OWNER, and that is the actionable part.** It is no longer *"Branko, please write
  the list"* — he has proposed **Engineering + PO jointly**. So the next move is the **QA lead's**:
  get that joint session scheduled. Registered as such, not left pointing at Branko alone.

---

## 4. THE TALLY — what his nine answers do to our suite

| Consequence class | Count | Which |
|---|---|---|
| **NO CHANGE** | **4 answers** | Q4 (sorting — proposal cancelled, 0 cases affected) · Q5 (13 PSRCH cases already correct) · Q6 (baseline already current) · Q7 (13 PSRCH cases stay; 9 retired cases stay retired) |
| **CASE EDIT NEEDED** | **3 answers → 10 cases** | Q1 → 8 mobile cases (7 provenance-only + C29624 provenance **and** body reflow) · Q2 → C38876 (refs + provenance) · Q3 → C38904 (expected 8 hedge + provenance) |
| **NEW CASE NEEDED** | **0** | — and Q4 **cancels** the only block that was pending |
| **CASE CAN BE UN-FLAGGED** | **9 cases** | the 8 mobile (Q1) + C38876 (Q2) |
| **CASE STRENGTHENED, no wording change** | **3 cases** | C38908 · C38911 (Q8) · C38904 item 2 (Q8 corroborates a design-derived enumeration) |
| **STILL AMBIGUOUS** | **2 answers** | Q8 (the six buttons' option lists — but **do not re-ask**, §5) · Q9 (the page-by-page list — owner changes to Engineering + PO) |

**TestRail operations required: 10 `update_case`, up to 2 more optional. 0 `add_case`.
0 `delete_case`. 0 run writes.** Because there is **no `add_case`**, **run 352 needs no
`update_run` at all** — full reasoning and before/after figures in `staged-case-plan.md`.

---

## 5. FOLLOW-UP QUESTIONS — one drafted, one deliberately NOT asked

Per the standing instruction, nothing is asked until it is **proved unanswered** against his 2026-08-04
answers, **all** his prior answers, and the **live** v1.6 spec. Four questions have already been
withdrawn on this project for being already-answered; that record is not being extended.

Draft and proofs: **`FOLLOW-UPS-2026-08-04.md`** in this folder. In short:

* **ONE optional confirmation line — the mobile combined "All Filters" sheet keeps its "Apply
  filters" button.** **Proved unanswered:** the live v1.6 body contains **"Apply filters" 0 times**,
  and its only *"All Filters"* hit is `S8-R1`'s phrase *"across all filters"* — the **screen does not
  exist in the document**; `S2-R6` says the opposite for desktop (*"no confirm/apply button
  needed"*); **none** of his 2026-07-17, 2026-07-20 or 2026-07-31 answers mentions it; and of his nine
  answers today only **Q1** touches it — via the **option text he selected**, not a sentence he typed.
  **Marked OPTIONAL, and honestly:** six cases assert this button and they already have a defensible
  basis without it (his selected option A names the engineering plan's model; tech plan **D15** states
  it verbatim; the agreed design shows it). This is belt-and-braces for a public challenge, **not a
  blocker**. **No new sheet** — one line, to append to an existing thread.
* **DELIBERATELY NOT ASKED — the six never-opened filter buttons' option lists.** He has now stated
  **twice** that no such list exists (2026-07-31 Q3, 2026-08-04 Q8) and that the choices come from
  shop data. Our case already records this honestly. **Asking again would be the fifth withdrawal.**

---

## 6. OUTSTANDING — what I need from you

| # | Item | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **GO-AHEAD for the 10 `update_case` operations** in `staged-case-plan.md`. Nothing has been executed (Rule 6). | **You** | 9 cases keep a provenance line that is now **factually false** (*"a product owner decision is still awaited"* — it has arrived); **C38904** keeps a hedge whose premise Branko has denied and which could let a real Vendors-filters gap pass; **C29624** stays unreadable. | **2026-08-04** |
| 2 | **RECONCILE the FLT-MOB-04 case-source divergence.** Live TestRail **C29624** asserts *"no 'Apply filter' button"*; `build/filters/cases/cases-D-mobile-api.json` still asserts the opposite. Live is correct under Branko's ruling. **Out of this pass's scope** — `cases/` was not touched. | **You** to route it (a `cases/` owner) | The local source is the input to the import and to every future generated push, so a regeneration could **overwrite the correct live text with the stale design version**. | **2026-08-04** (found this pass) |
| 3 | **GO-AHEAD to start the Filters VIU** on `sv8785.qa.shopview.com`. Reserved by you until Report Suite is complete. **(1) THE RULING:** Filters VIU is reserved until Report Suite is done. **(2) WHEN/WHY:** given 2026-08-04, to keep one live estate and one worker's attention on the automation deadline. **(3) WHAT IT BLOCKS:** all **110** cases stay `VIU-Pending`; specifically Branko's Q1 mobile behaviour and Q3's Vendors filter bar cannot be confirmed against the build. **(4) WHY IT WAS REASONABLE:** Report Suite has a live automation dependency today and Filters does not. **(5) WHAT WOULD UNBLOCK IT:** your word, once Report Suite is closed. | **You** | Nothing in the suite is live-verified. | 2026-08-04 |
| 4 | **The page-by-page Parts/Reports filter list — OWNER HAS CHANGED.** Branko's Q9: *"i suggest Engineering + PO together make a list for remaining 6 Parts pages i Reports, using same format as Work Orders do."* This is no longer an ask *of Branko alone*; it needs that joint session arranged. | **You** to arrange · **Engineering + Branko** to produce | **FLT-RPTS-01 = [C38909](https://shopview.testrail.io/index.php?/cases/view/38909)** (23 reports) stays wholly design-derived — the most exposed case in the project; **FLT-PARTS-01 = [C38904](https://shopview.testrail.io/index.php?/cases/view/38904)** stays design-derived for **5** of 8 views. Neither can get a numbered spec anchor. | **2026-07-27 — 8 days** |
| 5 | **The searchable-field write-up, as engineering reference documentation.** Branko's Q5: *"Have Engineering write up that list as technical documentation (not as a blocker for tests, but as a reference document)."* | **Engineering** | **Nothing.** He explicitly de-blocked it. Recorded so it is not lost, and so `S13-R23`'s *"Pending"* has an owner. | **2026-08-04** (new) |
| 6 | **Branko still owes three PRD corrections** — the *"hidden"* Status-chip prose in 5 places (he committed to fix it on 2026-07-20, **15 days**); Story 12 versus the mobile All-Filters sheet; and the Estimates default tab, which **he has now ruled on but has not written down**. | **Branko** | Nothing testable — our cases follow his rulings. It is the **document** that keeps contradicting him, which is what makes a challenge look worse than it is. | 2026-07-20 / 2026-08-04 |
| 7 | **Cosmetic, no action needed unless it bothers you:** the sheet's title row still reads *"8 questions"* for 9 rows. | — | Nothing. | 2026-07-31 |

**Cleared by this ingest — moved to the register's "Recently cleared":** the blank-sheet item (**9 of
9 now answered**) · the never-sent mobile Apply-button ask (**Q1 answers it**) · the sorting freeze
(**Q4 = C cancels the block**) · the default-tab confirmation (**Q2 = A**) · the Vendors-design ask
(**Q3 — it existed all along**) · the searchable-field blocker (**Q5 = B de-blocks testing**) · the
page-toolbar-search scope risk (**Q7 = A, the 13 cases stay**).
