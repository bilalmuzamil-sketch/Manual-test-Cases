# Filters — STAGED CASE PLAN from Branko's returned tech-plan sheet — 2026-07-31

> ## THE PLAN IS EMPTY — **0 operations**, because **0 of 8 questions were answered**
>
> | Operation | Count |
> |---|---|
> | `update_case` (edits) | **0** |
> | `add_case` (adds) | **0** |
> | `delete_case` (retires) | **0** |
> | `update_run` (run sync) | **0** |
> | **TOTAL** | **0** |
>
> **NOTHING WAS EXECUTED. NOTHING IS REQUESTED.** No TestRail write of any kind was made
> (read-only `get_run/352` only). No file under `build/filters/cases/**`, no
> `testrail-id-map.csv` row and no import file was touched.
>
> **There is no push for the QA lead to authorise from this pass.** Standing Rule 6 is not
> being invoked because there is nothing to invoke it on.

**Why the plan is empty and not merely small:** the returned sheet's answer column is blank on
all 8 questions (evidence in `answers-ingested.md` §2), and its `Questions for PO` tab is
cell-for-cell identical to the blank copy already checked earlier today. A blank answer produces
no case operation, because the only alternative would be to infer his answer from our own option
text — which Standing Rule 12 forbids absolutely.

**Case count is unchanged: 110 active, all live in TestRail under group 4110, all VIU-Pending.**

---

## 1. PER-QUESTION OPERATION LEDGER (all 8 — Rule 17, complete, no sampling)

| Q | Topic | His answer | Operation | Case(s) that would be touched |
|---|---|---|---|---|
| 1 | Mobile single-filter sheet: instant or Apply button | **BLANK** | **NONE** — held, see §2.1 | FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) |
| 2 | Which tab opens first | **BLANK** | **NONE** — held, see §2.2 | FLT-TAB-06 = [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) |
| 3 | Parts "Vendors" page filters | **BLANK** | **NONE** — hedge deliberately stands | FLT-PARTS-01 = [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) |
| 4 | **Sorting the Work Orders list** | **BLANK** | **NONE** — block stays unwritten, see §2.3 | *none exist* |
| 5 | Which details the in-page search box looks at | **BLANK** | **NONE** — his own PRD marks it Pending | the 13 FLT-PSRCH cases (already worded correctly) |
| 6 | Confirm the latest written description | **BLANK** | **NONE** — factual half self-served by live re-fetch | *none* |
| 7 | **Page-toolbar search vs the pop-up search** | **BLANK** | **NONE** — the 13 cases STAY in Filters, see §2.4 | FLT-PSRCH-01…13 (C38883–C38903) |
| 8 | Six filter buttons never shown opened | **BLANK** | **NONE** — hedge stands | Parts/Reports pattern cases |

**8 of 8 = NO OPERATION.**

---

## 2. THE FOUR DECISIONS THAT WOULD HAVE PRODUCED OPERATIONS

Recorded so that when an answer does arrive the work is already scoped and does not need
re-deriving. **None of this is staged for execution — these are contingencies, clearly labelled.**

### 2.1 IF Q1 = A (instant, no Apply button) → 1 × `update_case`

* **Case:** FLT-MOB-04 = **[C29624](https://shopview.testrail.io/index.php?/cases/view/29624)** — *"Mobile: tapping one chip opens its own sheet with an 'Apply filter' button"*
* **Field:** Title **and** Expected (step 3) **and** Steps (step 3)
* **CURRENT wording — Expected step 3, verbatim:**
  > *"3. The bottom button reads 'Apply filter' (singular); tapping it applies the selection and filters the list."*
* **CURRENT wording — Steps step 3, verbatim:**
  > *"3. Tick a status and tap the bottom button."*
* **PROPOSED wording if A:** Expected step 3 → *"3. Ticking a status filters the list straight away; there is no button to press to apply it."* · Steps step 3 → *"3. Tick a status and watch the list behind the sheet."* · Title → *"Mobile: tapping one chip opens its own sheet and choices apply as you tick"*
* **Driving source that would authorise it (Rule 25):** currently **only the engineering tech plan**, which per Rule 32(ii) *informs but never overrules product truth* — so **Branko's answer is required**; the spec corroborates but does not name the mobile sheet: **S2-R6** *"The table filters in real time as the user makes selections (no confirm/apply button needed)"*
* **Operation:** `update_case` C29624 · **run 352 impact: NONE** (case already in the run)
* **IF Q1 = B:** **zero operations** — the case is already correct as written.

### 2.2 IF Q2 = B (open on All) → 1 × `update_case`

* **Case:** FLT-TAB-06 = **[C38876](https://shopview.testrail.io/index.php?/cases/view/38876)** — *"First visit opens the Estimates tab; your last-used tab is remembered"*
* **Field:** Title **and** Expected (step 1)
* **CURRENT wording — Expected step 1, verbatim:**
  > *"1. On the very first visit the Estimates tab is the selected one, even though All is the FIRST tab in the row (order and default are different on purpose)."*
* **PROPOSED wording if B:** *"1. On the very first visit the All tab is the selected one — the first tab in the row is also the default."* · Title → *"First visit opens the All tab; your last-used tab is remembered"*
* **Driving source (Rule 25):** the current assertion is **tech-plan-derived only**; live v1.6 has **no first-visit default-tab requirement** — the nearest text, **S1-R1**, names the tab row (*"All, Estimates, Completed, My Work Orders"*) but is silent on the default. **His answer is the only thing that can settle it**, and picking B also needs the engineering conversation his own option text flags.
* **Operation:** `update_case` C38876 · **run 352 impact: NONE**
* **IF Q2 = A:** **zero case operations** — but it becomes an **ask on him to write the default into the PRD**, so the case stops resting on an engineering document alone.

### 2.3 IF Q4 = A or B (sorting IS in scope) → **N × `add_case` + 1 × UNION `update_run` on 352**

**This is the only contingency that changes the run, and the only one that can create cases.**

* **Cases today: ZERO.** Verified against `build/filters/testrail-id-map.csv` this pass — **no case with "sort" in its internal ID, title or section** exists among the 110.
* **Driving source (Rule 25) — why nothing can be written yet:** live v1.6 contains the word "sort" **exactly once**, incidentally: **S13-R14** *"The search query is retained for the browser tab session. It survives sorting, pagination, and navigating away from the page and returning."* There is **no sorting Story** in §7 (Stories 1–14), **no maximum sort count, no direction mechanism, no column indicator** in any source. The sorting panel exists **only in the Figma boards, and those boards are marked "Work In Progress"**.
* **What his answer must supply before a single case can be authored** — the two details the question itself states cannot be read from the pictures: **(a) the maximum number of simultaneous sorts** (the boards stop offering "Add Sort" after two, which may be the design limit or merely as far as it was drawn) and **(b) how a sort is reversed**, plus whether the sorted column shows any mark (every drawn row reads "Ascending"). Also **(c)** whether the phone sort button and the two report pages (Notes, Reminders) are included.
* **Why we will not pre-author against the designs:** Standing Rule 42 forbids absolute enumerations with no version-pinned anchor. Asserting a two-sort maximum from a WIP board would bake a guess into the suite.
* **Estimated shape if A (multi-level):** a new section *"Sorting"* plus roughly **8–12 cases** (panel opens from the toolbar · pick a column · direction control · add a second sort · the stated maximum · delete sort · sort persists or resets across tabs/pages · sort combines with filters and with page search · sorted-column indicator · mobile sort button · the two report pages). If **B (single-level)**, roughly **5–7** — no "Add Sort", no maximum.
* **Operations:** `add_case` × N into a new section (an `add_section` too), **then the run sync below.**

### 2.4 IF Q7 = B (everything moves to Global Search) → 13 × `delete_case` + local retire

* **Cases:** the **complete set of 13**, FLT-PSRCH-01…13 = **C38883 · C38884 · C38886 · C38888 · C38889 · C38891 · C38893 · C38898 · C38899 · C38900 · C38901 · C38902 · C38903** (full table with titles and links in `answers-ingested.md` §3 Q7)
* **Operation if B:** `delete_case` × 13, bodies kept locally marked Retired, id-map −13 (**110 → 97**), all deliverables regenerated. **Run 352 would fall 110 → 97 automatically** — deleted cases drop out of runs without a write (Rule 34).
* **Driving source (Rule 25) — why B is NOT the default:** his settled ruling covered the **pop-up palette**, verbatim *"A - Test it under Global Search, not here. This release only removes global search's page-filtering behaviour (Story 14)."* That was executed — the 9 **FLT-SRCH** palette cases are retired and **no FLT-SRCH id appears in the id-map**. The **page-toolbar control is a different thing**, and **his own PRD v1.6 gives it 25 requirements** as **Story 13: Page Search** (**S13-R1** *"A Search control is displayed in the page toolbar, in the right-hand action group…"*; Key Decisions *"Page search is separate from the filter bar, not a filter chip."*).
* **Therefore: default position held, 0 operations, the 13 cases stay in Filters.** The residual literal reading of his one sentence is recorded as an ambiguity (flag F2), **not resolved by inference in either direction.**
* **⚠️ If B ever arrives, this is a 13-case retirement and needs its own explicit authorisation** — it is the largest single consequence hanging off any of the 8 questions. Also note the destination is **paused**: Global Search is POSTPONED with its 86 cases never pushed, so cases moved there would be **parked, not running**.

---

## 3. RUN-352 CONSEQUENCE (Standing Rules 34 and 47)

**Live, read-only, this pass:**

| Property | Observed value |
|---|---|
| Run | **352** — *"Filters - Ahtasham (Awaiting QA- ENV)"* |
| `include_all` | **`false`** ⚠️ **FROZEN fixed selection** |
| Tests in run | **110** |
| Results | `untested_count` **110** · passed **0** · failed **0** · blocked **0** · retest **0** |
| Matches our suite? | **YES** — 110 tests == 110 active cases (`testrail-id-map.csv`, 110 rows + header) |

### The consequence for THIS pass

**NONE. Count before 110 → count after 110.** No `add_case` is required, therefore **no
`update_run` is required, and none was made.**

### The consequence for ANY future add (the §2.3 sorting block is the live risk)

Because **`include_all` is `false`**, run 352 **will NOT pick up new cases by itself.** A frozen
run is exactly what made a reviewer see coverage gaps on Filters that did not exist.

**So any authorised `add_case` on Filters MUST be followed by a UNION `update_run` on 352:**

1. **SNAPSHOT FIRST** — `get_tests/352` **and** `get_results_for_run/352`, saved to disk.
2. Derive the run's **current** case_id list from `get_tests` (**110 ids today**).
3. **UNION** it with the new ids: `sorted(set(current) | set(new))`.
4. `update_run` with the **FULL UNION**.
5. **VERIFY AFTER** — test count equals the expected figure and **every prior result is still present**.
6. Record **before → after** in the audit log.

**Illustration if the sorting block lands (§2.3):** 10 new cases → run 352 goes **110 → 120**, and
the `case_ids` payload must contain **all 120 ids**, never just the 10.

> ### ⚠️ THE WARNING, IN FULL
> **`update_run` REPLACES the run's selection — it does not append.** Sending a **partial**
> `case_ids` list **DELETES every omitted test AND ITS RECORDED RESULTS.** A 10-id payload would
> reduce run 352 from 110 tests to 10 and destroy the other 100. This is the single most dangerous
> operation in the sync. **Always union. Always snapshot before. Always verify after.**
>
> Today's saving grace is that run 352 holds **no graded results at all** (110/110 Untested), so a
> mistake now would cost the selection but not recorded work. **That will not be true once
> Ahtasham starts executing** — after which a partial payload becomes irreversible data loss.

**Run writes need the QA lead's explicit authorisation (Rule 6).** Run 352 belongs to **Ahtasham**,
not to us. In scope for completeness under Rule 47 (Filters 352 · Schedule 357 · Reports Suite 359),
but **not ours to write to unprompted.**

---

## 4. WHAT WAS DELIBERATELY *NOT* DONE

Listed so each omission is visibly a decision rather than an oversight.

| Not done | Why |
|---|---|
| No option letter recorded for any question | Every answer cell is empty. Inferring from our own option text is precisely what **Rule 12** forbids. |
| **No sorting cases authored** | Q4 unanswered; the two facts needed (maximum sorts, direction mechanism) exist in **no** source, and the boards are marked WIP (**Rule 42**). |
| **The 13 FLT-PSRCH cases not moved or retired** | Q7 unanswered; his own PRD Story 13 keeps them in Filters. Retiring 13 cases on a literal reading of one sentence about a different control would be inference. |
| **FLT-MOB-04 (C29624) not reversed** | Q1 unanswered. The spec (**S2-R6**) and tech plan both point the other way, but only Branko can overrule a design. Flagged as **most likely to reverse**. |
| **FLT-TAB-06 (C38876) not reversed** | Q2 unanswered. It rests on the tech plan alone, which per **Rule 32(ii)** cannot settle product truth — but "cannot settle" does not mean "is wrong". |
| Vendors hedge in FLT-PARTS-01 (C38904) not hardened | Q3's design half is still missing, so the tester instruction must stay. |
| No TestRail write of any kind | Nothing to write, and **Rule 6** — the QA lead authorises pushes separately. |
| No case source / id-map / import file touched | Zero operations follow from a blank sheet. |
| No follow-up question sheet | All 8 remain open, correctly worded, on the sheet he already holds — a second copy risks him answering the wrong one. `answers-ingested.md` §6. |

---

## 5. OUTSTANDING — what I need from you

| # | What is missing | Who owes it | What it BLOCKS | Since |
|---|---|---|---|---|
| 1 | **All 8 answers** — the returned sheet is blank for the second time. Chase Branko, or forward a reply that arrived another way (**File → Download → Microsoft Excel** — edits in a converted copy never land in the uploaded original). | **Branko** — you to chase | **Q4 alone gates 8–12 sorting cases** that cannot be written. Q1 may reverse **C29624**; Q2 may reverse **C38876**; Q7 could retire **13 cases**. | Sent **2026-07-30**; blank **2026-07-31** (twice) |
| 2 | **Nothing to authorise from this pass** — 0 edits, 0 adds, 0 retires, 0 run writes. | — | Nothing. Recorded so the absence of an ask is visibly deliberate. | — |
| 3 | **Pre-agreement worth having now:** if Q4 comes back A or B, the sorting adds need **both** a case-push go-ahead **and** a **UNION `update_run`** go-ahead on run 352 (Rule 34/47). Deciding that in advance saves a round-trip. | **You** | The run would otherwise stay frozen at 110 and a reviewer would report false gaps — the exact failure that produced Rule 47. | 2026-07-31 |
| 4 | **A Figma token on this container** (`/tmp` wiped by the reset). | **You** | **12 of 85** design boards have no PNG; the Rule-35 queue is **OPEN**, so the Filters design pass cannot be reported complete. If Q4 = A, those boards are also where the sorting panel lives — making this token a **direct dependency of authoring the sorting block**. | 2026-07-30 |

**In one line:** *Zero operations are staged because zero questions were answered — the plan exists so that Q4 (sorting) and Q7 (the 13 page-search cases) can be executed the moment he replies, without re-deriving any of it.*
