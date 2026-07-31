# Filters — assessment of the NEW question added to the Branko sheet (row 9)

**Date:** 2026-07-31 · **Project:** Filters · **PO:** Branko · **Scope:** read-only review of one
added question row. **No test case was edited, no TestRail write was made, no spec was changed.**

**Source file:** Google Drive `1fkjdt9hoYSGv2MToXUFJ_4tTMzP7a7X2` =
`PO-Questions-Branko-Filters-TechPlan_2026-07-30.xlsx`, owner = the QA lead's own Drive account.

---

## 0. HOW THE FILE WAS READ THIS TIME — and why the two earlier downloads looked blank

**The new row IS in the export. The blank-download loop is over, and it was never an export bug.**

| Fact (observed this pass) | Value |
|---|---|
| Drive `mimeType` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` — an **uploaded Excel file, NOT a Google Sheet** |
| Drive `modifiedTime` | **2026-07-31T07:59:53Z** |
| Our download taken at | 2026-07-31 08:01 |
| Drive `fileSize` | **12299 bytes** |
| Downloaded file size | **12299 bytes** — match |
| `file` verdict | `Microsoft Excel 2007+` (not an HTML sign-in page) |
| Rows found | **12** (title, blank, header, **9 question rows**) |

**Conclusion on the download question, stated as observation not theory:** because the Drive object
is an *uploaded .xlsx* and not a converted Google Sheet, `export?format=xlsx` returns the real
current bytes — there is no separate "live Google-Sheets layer" that the export could be hiding.
The two earlier passes came back with 8 rows and no answers because **at that time the file genuinely
had 8 rows and no answers**; the ninth row was written into it at **07:59:53 today**, two minutes
before this download. Rule 12: this is what the bytes and the timestamps show; it is not a claim
about what anyone did.

**Reliable read route for next time (in this order):**
1. `mcp__Google_Drive__get_file_metadata` with `fileId` — gives `modifiedTime` + `fileSize` +
   a `contentSnippet` of the actual cell text. This is the cheap way to prove freshness **before**
   downloading, and it independently corroborated the download this pass.
2. `curl -sSL ".../export?format=xlsx"` — worked first try, HTTP 200, valid workbook.
3. `mcp__Google_Drive__read_file_content` (with `includeComments:true`) — **not used: it returned
   `MCP error -32003: MCP tool call requires approval`.** It was not needed, because size +
   modifiedTime + the Drive-side contentSnippet + the raw XML all agree. If a future pass needs to
   read cell *comments*, that tool needs the coordinator to get approval for it.

### Are any of the original 8 now answered? **NO — 0 of 9 are answered.**

Proved at XML level, not by eye. Every answer cell in column F is a self-closing element with **no
value child**:

```
row 3  F-cell: ><v>6</v></c>      <- this is the "Your answer" HEADER, not an answer
row 4  F-cell: />                  <- Q1  blank
row 5  F-cell: />                  <- Q2  blank
row 6  F-cell: />                  <- Q3  blank
row 7  F-cell: />                  <- Q4  blank
row 8  F-cell: />                  <- Q5  blank
row 9  F-cell: />                  <- Q6  blank
row 10 F-cell: />                  <- Q7  blank
row 11 F-cell: />                  <- Q8  blank
row 12 F-cell: />                  <- Q9  blank (the NEW row)
```

There is also **no `comments` part in the workbook** (`find` over the unzipped package returns
nothing matching `*comment*`), so no answer is hiding in a cell note. **Nothing has been answered.
This is the third consecutive pass to confirm that.**

### One housekeeping defect in the sheet

The title row still reads **"… - 8 questions"** while the sheet now carries **9**. Fix before
sending, or the reader will assume a row is a duplicate.

---

## 1. THE NEW ROW — VERBATIM, CELL BY CELL

There is **only ONE tab** in this workbook — `Questions for PO`. (There is no second tab; the
QA-only mapping appendix lives in the `.md` companion, not in the workbook.) The new row is
spreadsheet **row 12**, numbered **question 9**.

> **A12 (`#`):** `9`
>
> **B12 (`Topic`):** `Filters on the Parts and Reports pages`
>
> **C12 (`What happens now`):** `The final design pictures show the same new filter buttons not
> only on the Work Orders page, but also on nine Parts pages and on all the Reports pages. However,
> the written description we received only talks about the Work Orders page - it says nothing about
> Parts or Reports.`
>
> **D12 (`The question`):** `Are the filters on the Parts pages and the Reports pages part of this
> release, and should we test them now? If yes, is there a written description for them like the
> one we have for Work Orders?`
>
> **E12 (`Options`):** `A) Yes - they are part of this release; a write-up exists or will be
> provided, and they should be tested now.` ⏎ `B) No - only the Work Orders page is in this
> release; Parts and Reports come later.`
>
> **F12 (`Your answer`):** *(empty)*

---

## 2. VERDICT: **WRONG ASK — do not send this row as written**

Not "needs tightening". **Wrong.** Three independent reasons, each evidenced below.

### 2.1 It is a VERBATIM re-send of a question Branko already answered on 2026-07-17

This is the decisive finding. Compare option A of the new row against the option A text we sent him
in Round 1, recorded in `branko-answers-2026-07-17/answers-ingested.md` lines 27-28:

| | Text |
|---|---|
| **New row 9, option A** | *"Yes - they are part of this release; a write-up exists or will be provided, and they should be tested now."* |
| **Round-1 Q1, option A (sent 2026-07-17)** | *"Yes - they are part of this release; a write-up exists or will be provided, and they should be tested now."* |

**Character-for-character identical.** The Topic cell is identical too (*"Filters on the Parts and
Reports pages"*). And he answered it — verbatim, from `answers-ingested.md` line 21:

> **"A. I will include all other pages in the prd as well. But the principle is basically the same."**

Sending row 9 asks Branko, for the second time, a question he answered fourteen days ago in the
affirmative. **That is the fourth withdrawal-for-being-already-answered on this project today.**

### 2.2 Its "What happens now" statement is FACTUALLY FALSE against his current write-up

Row 9 asserts: *"the written description we received only talks about the Work Orders page - it says
nothing about Parts or Reports."*

That was true on 2026-07-27. It is **not** true now. Branko kept the promise in his Round-1 answer.
The live description we pulled from Confluence on 2026-07-31
(`spec-current-2026-07-31/Filters-spec-current.md`) contains a dedicated **"Parts Filters"** block
and a dedicated **"Reports Filters"** block. Verbatim, lines 92-106:

> **Parts Filters**
> - *"A filter bar appears below the page header on each view of the Parts area (Inventory, Part
>   Sales, Catalog, Returns, Credits, Purchase Orders, Vendor Invoices, Vendors), following the same
>   chip-and-dropdown pattern as Work Orders"*
> - *"Filters are context-specific per view: each view shows only the chips relevant to its data
>   (e.g., Inventory filters by Bin Location, Category, Supply, and Vendor; Purchase Orders by
>   Vendor, Status, Date, and Ordered by)"*
> - *"Entity filters (Customer, Vendor, Created by, Ordered by, Received by, Processed by) use the
>   searchable multi-select dropdown; long lists such as Category and Manufacturer also include a
>   search field; short attribute filters (Supply, Part Type, Bin Location, State/Province, Status)
>   use the checkbox list"*
> - *"Date-based columns (Date, Invoice date, Date received) use the new date-range filter"*
> - *"Active-chip appearance, \"Clear filters\", \"Clear selection\", collapse/expand, per-view
>   persistence, URL state, and mobile behavior all match the Work Orders definitions"*
>
> **Reports Filters**
> - *"A filter bar appears below the report header on each report, following the same
>   chip-and-dropdown pattern as Work Orders"*
> - *"Filters are context-specific per report: nearly every report includes a Date filter as its
>   primary scoping control, alongside the entity dimensions relevant to that report (Customer,
>   Vendor, Technician, Advisor, Staff, Employee, and so on)"*
> - *"A new date-range filter type is introduced: the chip opens a start/end date picker with no
>   presets and no default range selected … the range applies immediately when the second date is
>   picked"*
> - *"Reports with sub-report tabs keep a separate filter set per tab"*
> - *"Active-chip appearance, \"Clear filters\", \"Clear selection\", collapse/expand, persistence,
>   URL state, and mobile behavior all match the Work Orders definitions"*

Its Change Log confirms when this landed — **v5, 2026-07-20, Branko Cicovic: *"Add Parts and Reports
filters to Feature Overview, Jobs to be Done, and Key Decisions"*** — plus **six** further
Parts/Reports rulings in §4 Key Decisions (lines 162-166), e.g. *"Multi-select where it makes sense:
all Parts and Reports filters are multi-select except the date-range filter, which is a single
range"* and *"Parts and Reports selections are scoped to their view/tab and persist there"*.

Sending a sheet that tells the PO his description says nothing about Parts or Reports, eleven days
after he added exactly that, damages our credibility on every other row in the sheet.

### 2.3 It contradicts two other rows of the SAME sheet

The sheet would arrive self-refuting:

- **Row 3** (`The Parts "Vendors" page filters`) opens: *"**The written description lists a Vendors
  view among the Parts pages that get filters**, but engineering could not find a design picture for
  it…"* — row 3 relies on the description covering Parts. Row 9 says it does not.
- **Row 6** states: *"We now have your latest written description of the filters (version 1.6,
  updated 28 July) and we are bringing all the tests in line with it."* — row 6 says we hold and are
  working from the current description. Row 9 describes it as Work-Orders-only.

Rows 3, 6 and 9 cannot all be true.

### 2.4 …but there IS a real gap underneath it, and row 9 misses it

This is why the row should be **replaced, not just deleted**. The genuine, still-open shortfall is
narrower and more specific than "is there a written description":

1. **No numbered requirements.** §7 Requirements holds **Stories 1-14, with no Parts story and no
   Reports story** — so there is **not one `S#-R#` anchor** for any Parts view or any report. The
   Work Orders filters have ~14 numbered stories; Parts and Reports have prose bullets in §2/§4.
   Our own ingest already recorded this, verbatim from
   `branko-answers-2026-07-31/answers-ingested.md`: *"the literal ask — a **numbered per-page
   description of the same kind as the Work Orders stories** — does **not** exist … Q1 stays OPEN."*
2. **The per-page button lists are an EXAMPLE, not a list.** §2 names the buttons for exactly
   **two of the eight Parts views** (Inventory, Purchase Orders) and prefixes them *"e.g."*. For
   **Reports it names no individual report at all** — only *"the entity dimensions relevant to that
   report … and so on"*.
3. **Consequence:** the button-by-button presence matrices in our two biggest Parts/Reports cases
   are read off Figma boards, not off his written description. That is genuinely weaker traceability
   than the rest of the suite, and it is what a reviewer will challenge.

**That** is the question worth asking. Row 9 does not ask it — it asks the settled scope question
instead, and its option A ("a write-up exists or will be provided") is precisely the answer he
already gave, which is how we ended up authoring from designs in the first place.

---

## 3. THE FOUR TESTS, scored

| Test | Verdict | Why |
|---|---|---|
| **1. Right ask at all?** | ❌ **NO** | The need is *numbered, per-page requirements for the Parts and Reports filter bars*. Row 9 asks whether they are in scope and whether a description exists. Both are settled: scope by his own **"A"** of 2026-07-17 and again by v1.6 §2/§4; the description **exists** since v1.6 v5 (2026-07-20). It aims at the wrong target. |
| **2. Already answered?** | ❌ **YES, twice over** | (a) *"A. I will include all other pages in the prd as well. But the principle is basically the same."* — 2026-07-17. (b) v1.6 §2 "Parts Filters" + "Reports Filters" + §4's six Parts/Reports bullets. (c) He additionally ruled on Parts/Reports **behaviour** three times on 2026-07-31 — *"A - Yes, every chip shown filters that page"*, *"A - Yes - multi-select, clearing, collapse, persistence, shareable URL and mobile all match Work Orders…"*, *"A - Same for everyone - role does not change chips or their options"* — you do not answer three behavioural questions about something you think is out of scope. |
| **3. Rule 7 wording** | ✅ **PASSES** | Plain layman English. **Zero** case IDs, C-numbers, spec anchors, version numbers or jargon in the row (no "requirement", "coverage", "traceability", "API"). It follows the sheet's shape — *What happens now* + the question + A/B options + a blank answer cell — and matches the 6-column layout of the other 8 rows (Rule 16). **The wording is not the problem; the content is.** One caveat: *"nine Parts pages"* is stale — his own description lists **eight** Parts views. |
| **4. Will the answer be actionable?** | ❌ **NO — and we can prove it empirically** | He already answered this exact option A once, and it did **not** unblock us: we still had to author from the designs. A repeat "A" gives us another promise, not a document. The row also mixes a yes/no scope question with a request for a document — a document request has no A/B answer, so it does not belong as an options row. It belongs as a clearly-marked **request** (the sheet already has that pattern: row 6 is labelled *"a request, not a choice"*). |

---

## 4. SUGGESTED REPLACEMENT — ready to paste into the sheet

Replace row 12 (question 9) with the following. Keep the same six columns. Also change the title row
from *"8 questions"* to *"9 questions"*.

| Column | Text to paste |
|---|---|
| **`#`** | `9` |
| **`Topic`** | `The Parts and Reports filters - the page-by-page list (a request, not a choice)` |
| **`What happens now`** | `Thank you - your written description now covers the Parts and Reports filters, and you confirmed on 17 July that they are part of this release, so we are not asking that again. What is still missing is the page-by-page detail. Your description names the eight Parts pages that get a filter bar, and gives an example of the buttons on two of them (Inventory, and Purchase Orders). It does not say which buttons belong on the other six Parts pages, and it does not name a single report. We have had to read those off the design pictures instead, so our tests are only as reliable as our reading of the pictures.` |
| **`The question`** | `Please write down, page by page, which filter buttons each Parts page and each report should show - set out the same numbered way the Work Orders filters are. Three points to cover for each: (1) which pages and reports get a filter bar at all; (2) which filter buttons appear on each one; (3) where anything works differently from the Work Orders page. The other rules you have already given us - choices are remembered per page, the same behaviour as Work Orders, and the same buttons for everyone - we have taken as settled and are not re-asking.` |
| **`Options`** | `A) Yes - a page-by-page list will be added to the written description (please say roughly when).`⏎`B) No - read the buttons off the design pictures, and we will check each page with you as we test it.` |
| **`Your answer`** | *(leave blank)* |

**Why this wording:**
- It opens by **crediting** what he already delivered, so it cannot read as us not having read his
  description. It removes the false claim entirely.
- It asks for **one thing** — the page-by-page list — with three short sub-points, not a
  specification interview.
- It **explicitly fences off** what is already settled (persistence, Work-Orders parity, the same
  buttons for everyone), so he does not re-answer answered rows and we cannot be accused of
  re-asking.
- It stays clear of **row 3** (that row is about the missing Vendors *design*, which this does not
  touch) and of **row 8** (that row is about six specific buttons never drawn opened). No overlap.
- It is framed as a **request** with a realistic A/B — will the list be written, or should we keep
  reading the pictures — which is a decision he can actually make.
- Rule 7 checked: no case IDs, no C-numbers, no spec anchors, no version numbers, no
  "requirement"/"coverage"/"traceability"/"API". *"eight Parts pages"* corrects row 9's stale "nine".

**What the ideal answer looks like:** option **A**, followed by a short table in the description —
one line per Parts page and per report, listing that page's filter buttons, plus a note wherever a
page differs from Work Orders. Roughly forty lines. With that, the two presence-matrix cases stop
being a reading of a picture and become checks against his written word.

---

## 5. WHAT WE CAN AND CANNOT DO UNTIL HE ANSWERS — honestly

**Nine active cases** sit in the two affected areas. All nine are live in TestRail and all nine are
`VIU-Pending`.

| Internal ID | TestRail | What it currently asserts | Where that assertion comes from | Blocked by the missing list? |
|---|---|---|---|---|
| FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Every Parts list page shows its designed filter buttons — an **8-view presence walk** | **Figma 11884-16885 read board-by-board**, plus v1.6 §2 for the page list | **YES — most exposed.** The per-view button sets have no written source. Also still carries the deliberate Vendors hedge (row 3). |
| FLT-PARTS-09 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type filter opens a Core / Non Core list with Clear selection | Figma — this is the **one** Parts chip drawn opened | **No.** Safe as-is. |
| FLT-PARTS-11 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Choosing a Parts filter narrows that page's list, immediately | His *"every chip shown filters that page"* + v1.6 §2 | Partly — the behaviour is sourced; **which** chips is not. |
| FLT-PARTS-12 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts filters take multiple choices and can be cleared | v1.6 §4 multi-select bullet + his parity answer | **No.** Well sourced. |
| FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Every filter a page had before is still available in the new bar | His *"We should support all the filters we have right now in the app"* | **No** — but it needs the tester to build a before-list by hand, which the written list would supply for free. |
| FLT-RPTS-01 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Every report page shows its designed filter buttons — a **23-report presence walk** | **Figma 11903-10573 read board-by-board.** v1.6 names **no** individual report | **YES — the single most exposed case in the project.** 23 reports' button sets, entirely design-derived. |
| FLT-RPTS-21 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Choosing a Reports filter narrows the report results, immediately | His parity answer + v1.6 §2 Reports | Partly — same split as FLT-PARTS-11. |
| FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | The newer Reports filter types behave correctly (Location, Transaction Type, …) | Figma button names only — **behaviour is design-silent** | **YES**, and it also depends on row 8 of the sheet. |
| FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Date-range filter: results update when both dates are picked | v1.6 §4 *"New date-range filter type"* + §2 Reports | **No.** Properly spec-sourced. |

**Correction to a count in the shared register.** The register's Filters section says *"**12**
Parts/Reports cases were written from the designs alone"*. That figure was written on 2026-07-27 and
is **now stale**: the user-authorised MG14/MG15 presence-matrix consolidation of 2026-07-31 merged
**27** per-page cases (FLT-PARTS-02…08, -10 and FLT-RPTS-02…20) into FLT-PARTS-01 and FLT-RPTS-01,
leaving **9 active**, not 12. The 27 merged bodies are retained locally marked
`Retired — merged into …`. The register row is corrected in the same pass as this file.

### CAN do without his answer
- Push nothing and change nothing — **this pass is read-only and stays that way.**
- Keep all nine cases as they are. They are internally consistent and every assertion has a stated
  source, design-derived where that is the truth.
- Verify the *behaviour* half live once a QA build exists: narrowing, multi-select, clearing,
  persistence, shareable link, mobile — all of that is properly sourced from v1.6 §4 and his
  2026-07-31 answers.
- Compare each page's new filter bar against whatever that page offers today (FLT-PARTS-13's
  method), which catches losses in the redesign without needing his list.

### CANNOT do without his answer
- **Assert with authority which buttons belong on which page.** For 6 of 8 Parts views and for all
  23 reports, our expected button set is our reading of a Figma board. If a board was exploratory or
  we misread it, FLT-PARTS-01 and FLT-RPTS-01 will produce false failures against a correct build.
- **Give those cases a Rule-20 spec anchor.** There is no `S#-R#` to cite for any Parts view or any
  report, so `refs` carries prose citations (*§2 Feature Overview → Parts Filters*) rather than a
  numbered requirement. That is the honest position and it is weaker than the rest of the suite.
- **Call the Parts/Reports coverage complete.** We cannot prove we have every page and every button
  when the authoritative list does not exist in writing.
- **Nothing here is live-verified.** All nine are `VIU-Pending`; no Filters QA build has been
  observed (Rules 12/22). His answer removes the *source* gap, not the *verification* gap.

---

## 6. OUTSTANDING

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | **Send the sheet with row 9 REPLACED** by §4 above, and fix the title row to *"9 questions"*. Do **not** send row 9 as written — it re-asks a question Branko answered "A" on 2026-07-17 and tells him his description omits Parts/Reports when it has covered them since 2026-07-20. | **You** | Ready — wording in §4 is paste-ready |
| 2 | **All 9 questions in the sheet remain unanswered** — proved at XML level for the third consecutive pass (every column-F cell has no value; no comments part in the workbook). If Branko replied by another channel, or edited a converted copy, forward **File → Download → Microsoft Excel** from the copy he actually edited. | **Branko** to answer · **you** to chase | Open since 2026-07-30 |
| 3 | **The real gap:** no numbered per-page requirements for Parts/Reports — §7 holds Stories 1-14 with no Parts story and no Reports story, so **zero `S#-R#` anchors** exist for any of the 8 Parts views or 23 reports. §2's button lists cover 2 of 8 Parts views, prefixed *"e.g."*, and name no report. | **Branko** (write-it-down) | Open since 2026-07-27 — **5 days** |
| 4 | **FLT-PARTS-01 = [C38904](https://shopview.testrail.io/index.php?/cases/view/38904)** and **FLT-RPTS-01 = [C38909](https://shopview.testrail.io/index.php?/cases/view/38909)** carry design-derived presence matrices (8 views / 23 reports). They are the two cases that change if his list differs from our reading of the boards. | Us, on his answer | Blocked on item 3 |
| 5 | **Register count corrected:** "12 design-derived Parts/Reports cases" → **9 active** (27 merged into 2 by MG14/MG15 on 2026-07-31). | Us | Done this pass |
| 6 | **`mcp__Google_Drive__read_file_content` needs approval** (`MCP error -32003`). Not needed this pass. Get approval before any pass that must read cell **comments**; `get_file_metadata` + the xlsx export were sufficient and are the documented route in §0. | Coordinator | Noted |
| 7 | **No Filters QA build has been observed.** All 9 Parts/Reports cases stay `VIU-Pending`; his answer fixes the written source, never the live verification (Rules 12/22). | **You** (env access) | Open |

---

*Read-only pass. No test case, spec, import, id-map or TestRail record was modified. TestRail was
not written to and was not read this pass — the C-ids above come from
`build/filters/testrail-id-map.csv`.*
