# RECONCILIATION (FINAL) — all 85 design boards vs our 110 active Filters cases
**2026-07-31 · 85/85 boards RENDERED and read · the Rule-35 fetch queue is CLOSED**

This supersedes `RECONCILIATION-12-2026-07-31.md`, which could only reconcile 79 boards
because 6 had no render. It carries every verdict from that pass forward unchanged and adds
the 6 newly-rendered boards. **Nothing was reopened or quietly reversed** — where a verdict
changed, it says so and why.

## SOURCE-CURRENCY (Standing Rule 31 — per source, with the honest verdict)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| **Designs (Figma)** | file `DR4gEODShYgJqkozs3mF5q`; the 4 Filters links; **85 boards** | sections self-dated **20–21.4.2026** | **2026-07-31** | **CURRENT and COMPLETE — 85/85 rendered.** The Rule-35 queue `PENDING-FIGMA-FETCH.md` is **CLOSED**. This is the first Filters pass that can say this. |
| **Spec** | Confluence Filters PRD → `build/filters/spec-current-2026-07-31/Filters-spec-current.md` | **v1.6, 2026-07-28** | **2026-07-31** | **CURRENT.** Honest note: pulled live earlier **today** by this session's spec-currency pass; not re-fetched in this run, so the verdict rests on a same-day live fetch, not a fresh one this hour. |
| **PO rulings (Branko)** | `branko-answers-2026-07-17/`, `branko-answers-round2-2026-07-20/`, `branko-answers-2026-07-31/answers-ingested.md` | latest **2026-07-31** | **2026-07-31** | **CURRENT but PARTIAL** — the exact shortfall: **sorting scope**, the **mobile Apply-button** question and the **default-tab** question are asked and **unanswered**. |
| **Epic / Jira** | **none exists for Filters** | n/a | 2026-07-31 (170 SV epics enumerated; Filters has none) | **CURRENT** — `refs` therefore read `Filters (no Jira epic) (<spec anchor>)`, the documented convention. |
| **Tech plan** | `tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | 2026-07-29 | 2026-07-31 | **CURRENT.** |
| **Live build** | Filters QA branch | — | — | **DOES NOT EXIST.** So **no verdict here is live-verified** (Rules 12/22). Everything below is a *document/design* reconciliation. |
| **Cases** | `build/filters/cases/*.json` — **110 active**; C-ids from `build/filters/testrail-id-map.csv` | 2026-07-31 | 2026-07-31 | **CURRENT.** |

**Precedence applied (Standing Rules 32/33):** latest authoritative product source wins ·
**a Branko ruling outranks a board** · **spec v1.6 (2026-07-28) is NEWER than every board
(20–21.4.2026)**, so a true conflict goes to the spec · where Branko has been *asked and has
not answered*, the winner is **not** unambiguous and the item is **staged, not applied**.

**The QA lead's ruling that governs this pass (2026-07-31):** *"Let's wait for Branko's
answers"* for everything already staged. So the mobile Apply-filter cases
(**C29622–C29628**), **FLT-TAB-06 (C38876)** and **all sorting** were deliberately left
**exactly as they are** — not softened, not reworded, not retired.

## Counts — the complete 85-board picture

| Category | Findings | Cases touched | TestRail ops |
|---|---|---|---|
| **A — SAFE FIX** | **1** carried (the "funnel" wording) **+ 2 new, metadata-only** | **9** already pushed on 2026-07-31 · **2** changed locally this pass | **0 new** (the 9 were done in the earlier pass: 9 `update_case`, all HTTP 200 + re-GET MATCH). The 2 new touch only `design_ref`/`notes`, which are **not** TestRail fields. |
| **B — CONTRADICTION (staged, ambiguous)** | **2** carried, **0 new** | 8 implicated, **0 changed** | **0** |
| **C — NEW BEHAVIOUR with spec backing (author)** | **0** | 0 | **0 `add_case`** |
| **D — DESIGN-ONLY / Work-In-Progress → NOT AUTHORED** | **4** carried **+ 1 new** = **5** | 0 | **0** |
| **CONFIRMS (no change needed)** | **5** carried **+ 6 new** = **11** | 0 | **0** |

### TOTAL TESTRAIL OPERATIONS THIS PASS: **ZERO**
Read-only verification only. **No `add_case`, no `update_case`, no `delete_case`, no section
write, no result write, and no touch of run 352.** Because **nothing was added, run 352
needed no union `update_run`** — Standing Rules 34/47 are satisfied by there being no
new case to sync. Run 352 was verified live as **110 tests, all Untested**, unchanged.

**Why zero is the right answer and not a shortfall:** everything the 6 new boards reveal
falls into exactly three buckets — (a) they **CONFIRM** cases we already had, (b) they are
**Work-In-Progress sorting** boards the spec is silent on, or (c) they are **superseded "v1"
explorations**. None of those licenses a case edit. The two things that *did* change are
evidence-quality notes in our own metadata layer, which is where Rule 20 says traceability
belongs.

**Foreign-case gate (Standing Rule 38) — re-confirmed LIVE, read-only, this pass.** Walked
group **4110**'s section subtree (**18 sections**) and read every case under it:
**110 live cases, and `created_by` = 3 and `updated_by` = 3 for all 110** — user id **3 is us
(Bilal Muzamil)**. **ZERO foreign cases in the group**, so nothing foreign could be touched,
and the live count (**110**) reconciles exactly with our 110 active local cases and the
110-row id-map. Calls used: `get_sections`, `get_cases` — **`get_*` only, no writes.**

**Run 352 — read live, read-only, before and after (Standing Rules 34/47).** `get_run/352`
returns **`include_all: false`** (so it is a **frozen selection** that would NOT pick up new
cases on its own), and `get_tests/352` returns **110 tests**, with the run counters showing
**110 Untested / 0 Passed / 0 Failed / 0 Blocked / 0 Retest**. **Identical before and after
this pass, because nothing was written.** No `update_run` was issued — and none was needed,
since category C produced no new case.

---

# A — SAFE FIX

## A-1 · (CARRIED, already applied) The collapse/filter control is not a funnel — 9 cases said it was

Applied in the earlier pass of the same day: **9 `update_case`, all HTTP 200 + re-GET
MATCH**, audit `push/testrail-execution-log-2026-07-31.md`. The word "funnel" was **removed**
rather than replaced with a new shape claim (FLT-COLL-01 **C29601**, FLT-COLL-02 **C29602**,
FLT-COLL-03 **C29603**, FLT-COLL-04 **C29604**, FLT-COLL-05 **C29605**, FLT-MOB-01
**C29621**, FLT-MOB-09 **C29629**, FLT-PARTS-01 **C38904**, FLT-PSRCH-13 **C38903**).
**Re-checked against the 6 new renders: still correct — none of them shows a funnel either.**
No further action.

## A-2 · (NEW, metadata only) FLT-PSRCH-08's design reference said its board was still un-rendered — it is not

**The case:** FLT-PSRCH-08 = **C38898** ·
https://shopview.testrail.io/index.php?/cases/view/38898

**What was wrong.** Its `design_ref` stated, honestly at the time:

> "…the Figma component frame 11829:8908 ('Button' — the toolbar search box, 4 looks) **PNG
> is still pending a Figma retry (Standing Rule 35), so nothing here was authored from a
> design image**."

That sentence is now **false** — the PNG exists (`Components__Button__11829-8908.png`,
558 × 520, rendered 2026-07-31).

**What the board pins, verbatim, and how it compares to the case.** Both texts side by side,
because a "covered" verdict without them is unfalsifiable (Standing Rule 45e):

| The board (pixels) | The case's expected result |
|---|---|
| Row 1 — magnifier + **`Search`**, no border/fill | 1. "A 'Search' button … plain text on a see-through background, with no border and no fill." |
| Row 2 — **`Search`** on a light grey rounded fill | 2. "Hovering over it gives it a light grey background…" |
| Row 3 — caret + grey **`Type to search`** | 4. "While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'." |
| Row 4 — typed **`In progress`** + caret + circled **`⊗`** | 5. "As soon as you type, your text shows in a dark grey and a small round x appears at the right-hand end of the box." |
| The **`⊗` is on row 4 only** | (consistent — no case claims a clear control on an empty box) |

**Verdict: the render CONFIRMS the case in full. Not one tester-facing word needed
changing.** Only the stale provenance sentence was corrected, plus a note recording the
upgrade. **Because `design_ref` and `notes` are not TestRail fields, this required no
`update_case`.**

**Rule 41 — re-verified whole against spec v1.6 (2026-07-28) S13-R2..R6 + S13-R8 and the
rendered board `11829:8908`:** title (66 chars, within the ≤80 display limit),
preconditions, steps, expected results, `refs` and notes all re-read end-to-end and all
still correct. Second finding from the re-read: none.

## A-3 · (NEW, metadata only) FLT-MOB-01's scroll-arrow evidence is weaker than we thought — and the case already handles it

**The case:** FLT-MOB-01 = **C29621** ·
https://shopview.testrail.io/index.php?/cases/view/29621

**What the newly-rendered board changes.** Expected result 3 says *"An arrow at the
right-hand edge shows that the row can be scrolled."* We now have pixel evidence from **all
three** final mobile boards, and they disagree with each other:

| Board | Rendered | Scroll arrow? |
|---|---|---|
| `11884:20807` | earlier capture, re-read at 2× this pass | **YES** — a round **`>`** button at the right edge |
| `11884:15901` | **new, 2026-07-31** | **NO** |
| `12867:12201` | 2026-07-31 (MCP) | **NO** |

**What the spec says (verbatim) — and note it does not mention an arrow at all:**
> `S12-R1: The filter chips are displayed in a horizontally scrollable row below the tab navigation`
> — spec v1.6, 2026-07-28, line 515

**Decision: the tester-facing wording was deliberately LEFT UNCHANGED.** It already carries
its own hedge — *"(This is what the design shows — if your screen looks different, write down
what you actually see and carry on.)"* — which is exactly the scope-conditional phrasing
Standing Rule 42 asks for, and it is what a layman tester needs. Weakening a hedged
assertion on design evidence alone would be a change with no source behind it. The evidence
split (1 of 3 boards) was recorded in the case `notes` instead, flagged **VIU-confirm**.

**Rule 41 — re-verified whole against spec v1.6 (2026-07-28) S12-R1 and the three rendered
final mobile boards:** title (71 chars), preconditions, steps, expected results and `refs`
all re-read end-to-end and all still correct; only the note changed. Second finding from the
re-read: expected result 1's chip order (`All Filters` first, then `Status`, `Customer`,
`Lead …`) is **confirmed** by the new board.

---

# B — CONTRADICTION (STAGED — winner NOT unambiguous, nothing applied)

Both items below are **carried forward unchanged**, and both are now explicitly frozen by
the QA lead's *"Let's wait for Branko's answers"* ruling.

## B-1 · (CARRIED) Mobile `Apply filters` / `Apply filter` button vs the spec's "no apply button"

**Cases implicated, none changed:** FLT-MOB-02 **C29622**, FLT-MOB-03 **C29623**, FLT-MOB-04
**C29624**, FLT-MOB-05 **C29625**, FLT-MOB-06 **C29626**, FLT-MOB-07 **C29627**, FLT-MOB-08
**C29628** — https://shopview.testrail.io/index.php?/cases/view/29622 (and 29623–29628).

**Did the 6 new boards resolve it? NO — but one of them adds evidence.** The newly-rendered
`11884:15901` shows the mobile chip row **with `Status` and `Customer` already in their
selected blue state and NO `Apply filter` button anywhere on the board**. That leans towards
the spec's "no apply button", but it is a *chip-row* board, not a *bottom-sheet* board — and
the Apply button lives in the sheet. **So it does not settle the question**, and per the
ruling nothing was touched. Recorded as evidence for Branko, not acted on.

## B-2 · (CARRIED) FLT-TAB-06 "first visit opens Estimates" — the boards point the other way

**Case implicated, not changed:** FLT-TAB-06 = **C38876** ·
https://shopview.testrail.io/index.php?/cases/view/38876. Every rendered board — including
the two new mobile ones, where **`All` is the selected tab** — shows **All** selected. That
is now **13** boards pointing one way against the case's assertion, but the assertion has a
written source and the boards do not override it without a ruling. **Frozen per the QA
lead's instruction. Not softened, not retired.**

---

# C — NEW BEHAVIOUR the boards show AND the spec supports → author a case

## **NOTHING QUALIFIES. 0 cases authored, 0 `add_case`.**

Every candidate the 6 new boards raise fails the "and the spec supports it" half:

| Candidate from a new board | Why it is not category C |
|---|---|
| Multi-level sort (two stacked rows) | Spec v1.6 has **no sorting requirement at all**; the board is in a section named **Work In Progress** → **D-1**. |
| A two-sort cap (`Add Sort` vanishes at two rows) | Same, and the design itself does not say whether it is a cap or an unfinished board → **D-1**. |
| The mobile scroll-arrow affordance | Spec S12-R1 is silent on it, and the three final boards disagree → **D-5**, and already hedged in C29621. |
| The Customer `v1` checkbox pattern | A **superseded** exploration; the final boards show the shipped pattern → **CONFIRM-6**. |
| `Lead Tehnician` column heading | A **typo in the design**, not a requirement → **CONFIRM-5**. |

Because C is empty, **no `add_case` was made, so run 352 needed no union `update_run`**
(Standing Rules 34/47). Run 352 was **read** (read-only) before and after and stands at
**110 tests, all Untested**, unchanged and unwritten.

---

# D — DESIGN-ONLY / WORK-IN-PROGRESS → **NOT AUTHORED** (staged as proposals)

**Standing Rule 42 governs this section absolutely.** Authoring any of it would mean
asserting requirements no version-pinned source supports.

## D-1 · (CARRIED, now STRENGTHENED) Sorting — 4 boards fully specify it, we have 0 cases, the spec says nothing

**All four Sorting boards are now RENDERED** (steps 1–3 on 2026-07-31 via the MCP, **step 4
this pass via REST**), so the proposal below is pixel-evidenced end to end rather than partly
tree-inferred.

**ARE THE SORTING BOARDS FINAL? NO — THEY ARE WORK IN PROGRESS.** This was checked
specifically, because it decides whether anything may be authored:
- The Figma **section containing all four is literally named `Sorting (Work In Progress)`** —
  the designer's own label, and it is the section name on every one of the four boards.
- **Spec v1.6 contains no sorting requirement.** The only mention anywhere is incidental:
  `S13-R14` says a search query *"survives sorting, pagination, and navigating away"* — which
  presumes sorting exists but specifies **nothing** about it.
- **Branko has never answered the sorting-scope question**; `answers-ingested.md` lists
  *"sorting (no mention anywhere in his sheet)"* as the first item that "remains live".

**Three independent reasons, all still true. Nothing authored.**

**What the boards now pin (all rendered, verbatim labels):**

| # | What the design shows | Board | Evidence |
|---|---|---|---|
| 1 | Toolbar sort entry point: an **`↑↓` double-arrow icon** between the filter icon and the column/layout icon | `11985:9686` | rendered |
| 2 | A **`↓` sorted-column indicator after `Status`** in the column-heading row | `11985:9686` | rendered |
| 3 | Clicking it puts the icon in a selected look and opens a field menu of **exactly two items: `Status`, `WO Number`** | `11985:10428` | rendered |
| 4 | A **sort chip `↑↓ Status ⌄`** is inserted as the **FIRST** chip in the filter row, left of `Status`, in the active blue look | `11985:11259`, `11985:13334` | rendered |
| 5 | Sort panel = field dropdown + direction dropdown + per-row **`✕`** + **`+ Add Sort`** + panel-level **`🗑 Delete sort`** | `11985:11259` | rendered |
| 6 | **Multi-level sort**: two stacked rows — **`Status`/`Ascending`** then **`WO Number`/`Ascending`** | `11985:13334` | **rendered this pass (was tree-only)** |
| 7 | **`Add Sort` is ABSENT once there are two rows**, while `Delete sort` remains — a two-sort cap, or an unfinished board; the design does not say | `11985:13334` | **rendered this pass — the tree claim was CORRECT** |
| 8 | **`Descending` appears nowhere** on any of the four boards — the design never pins how a sort is reversed | all 4 | rendered ×4 |
| 9 | A sort icon also sits in the toolbar of **`11884:20807`**, **`12867:12201`** and two Reports boards (`Notes`, `Reminders`) — the icon has escaped the WIP section even though the panel has not. **Corrected this pass: `11884:15901` does NOT have it** (we previously said it did) | those boards | rendered |

**Question that unblocks it (layman, Rule 7):** *"Is being able to sort the Work Orders list —
pick a column, pick A→Z or Z→A, and stack a second sort under the first — part of this
release? And if yes, is two sorts the most you can stack at once?"*

## D-2 · (CARRIED) The column/layout icon has no case
Present in the toolbar of every final desktop board, including the new step-4 render. No
written source. Likely outside Filters scope — a Branko confirm, not an assumption.

## D-3 · (CARRIED) The early-exploration mobile board is superseded — record and ignore
`12141:19858` (`By Status`, `My work orders`, `Asset here?`, tabs in a different order). Do
not author from it.

## D-4 · (CARRIED) Filter-button `Hover` state has no case
The component set ships Default / Hover / Selected / Disabled; we cover three. Low value.

## D-5 · (NEW) The three final mobile boards disagree about the scroll-arrow affordance
`11884:20807` shows a round **`>`** scroll button; **`11884:15901`** (new) and `12867:12201`
show none. Spec S12-R1 is silent. **Not authored, and no case changed** — FLT-MOB-01
(**C29621**) already hedges it and now carries the evidence split in its notes (A-3). This
is a **live-build question**, not a design one.

---

# CONFIRMS — the design agrees with the case, no change needed

**5 carried forward** (FLT-TAB-02 **C29609** / FLT-TAB-03 **C29610** disabled pre-filled
`Status: Estimate`; FLT-CHIP-01 **C29595** `<Filter>: <Value>`; FLT-CHIP-02 **C29596**
truncated multi-value label; FLT-BAR-02 **C29558** five chips fixed order; FLT-ASSET-01
**C29589** Yes/No + Clear selection; FLT-STAT-01 **C29560** nine statuses + Clear selection)
**plus 6 new from this pass:**

| # | New board | What it confirms | Case |
|---|---|---|---|
| 1 | `11829:8908` | All four search-box looks + placeholder `Type to search` + the clear `⊗` in the Filled look only | FLT-PSRCH-08 **C38898** (and FLT-PSRCH-01 **C38883** for the clear-x step) |
| 2 | `11829:8920` | The component is the **text caret** inside the search box, not a section divider | no case — note only |
| 3 | `11884:15901` | Mobile chip row starts **`All Filters`** then `Status`, `Customer`, `Lead …`, horizontally scrollable | FLT-MOB-01 **C29621** |
| 4 | `11842:14069` + the final `11842:14236` | Placeholder **`Search customer`** and **`Clear selection`** at the panel bottom | FLT-CUST-01 **C29566** |
| 5 | `11842:16879` | Selected customers as **removable tags with `×`**, long names truncated (`Texas Truck And Aut…`), plus a circled clear-all | FLT-CUST-03 **C29568** (its `notes` already flag the clear-all as VIU-confirm) |
| 6 | `11842:16879` **vs** the final `11854:19595` | **A near-miss worth recording** — see below | FLT-CUST-03 **C29568** |

## CONFIRM-6 · The Customer `v1` boards would have made us "fix" a CORRECT case into a wrong one

FLT-CUST-03 (**C29568**) expected result 2 says: *"Each selected customer's row in the list
shows **a checkmark on the right**."*

- The **new v1 boards** (`11842:14069`, `11842:16879`) show **empty / ticked blue CHECKBOXES
  on the LEFT** of every row. Reconciled naively, that reads as a case error.
- The **FINAL** board `11854:19595` (re-read at full size this pass) shows **no checkboxes at
  all** and marks the selected row with a **`✓` on the RIGHT**.
- **The spec does not take a side:**
  > `S3-R4: Selected customers are indicated with a checkmark in the list`
  > — spec v1.6, 2026-07-28, line 260

**Standing Rule 32 decides it:** the boards named **"v1"** are the older, superseded
exploration; the final boards win. **The case is CORRECT and was left alone.** Recorded
because it is a concrete example of why a board is not automatically the winner — and why
"reconcile against every board" must include *"which board is the later one?"*.

## CONFIRM-5 · `Lead Tehnician` is a typo in the design, not a label to copy
The step-4 render shows the column heading **`Lead Tehnician`** (missing the `c`), while the
filter **chip** on the same board correctly reads **`Lead Technician`**. Our cases use
`Lead Technician`, matching the chip and the spec. **No case change** — a design typo is not
a requirement, and a table column heading is not a filter label. Cosmetic note for Branko.

---

# Honest limits of this reconciliation (Standing Rules 12 / 17 / 22)

1. **Nothing here is live-verified.** The Filters QA branch does not exist, so every verdict
   is document-vs-document (design + spec + rulings vs case text). No case may be called
   VIU-Verified on this basis, and none was — all 110 remain **VIU-Pending**.
2. **One board cannot answer one question:** on Sorting **step 4** the open sort panel covers
   the column-heading row, so that board can neither confirm nor deny the `Status ↓`
   indicator. Stated rather than assumed. Steps 1–3 do show it.
3. **The spec was fetched live earlier today, not re-fetched in this run.** Same-day, so
   CURRENT — but stated plainly rather than implied.
4. **Coverage of the other 79 boards is carried forward, not re-derived from scratch.** Their
   verdicts live in `RECONCILIATION-12-2026-07-31.md` and `DESIGN-NOTES.md` §5, both written
   the same day against the same spec version. Where a new render contradicted one of those
   notes, the note was corrected (see `BOARD-NOTES-12-2026-07-31.md` §6, 11 absence claims
   re-checked, 4 of them wrong).

---

# OUTSTANDING — what I need from you

1. **Branko's answers on the three staged questions.** These are the only things blocking
   real coverage decisions, and they have been open since **2026-07-27** (sorting/scope) and
   **2026-07-31** (the rest):
   - **Sorting** — *"Is sorting the Work Orders list part of this release, and if so, is two
     sorts the most you can stack?"* **ZERO sorting cases are drafted** — what exists is a
     **design-backed proposal for roughly 6–8 cases: none authored, no internal IDs, no
     C-ids, never pushed**. The design is fully drawn but labelled *Work In Progress*.
   - **Mobile Apply button** — the designs show `Apply filters` / `Apply filter` in the mobile
     sheets; spec v1.6 says filters apply with **no apply button**. Blocks **7 cases,
     C29622–C29628**, from being called correct either way.
   - **Default tab on first visit** — our **C38876** says *Estimates*; **13 boards** show
     *All* selected. Blocks that one case.
   *(All three are frozen by your own ruling of **2026-07-31**, verbatim **"Lets wait for
   Brankos answers"**, given when we asked what it would take to apply each staged group. **It
   was the right call** — applying any of them means asserting behaviour **no written source
   supports** (Rule 42), and nothing has changed since to warrant revisiting it. So this is a
   reminder of what is waiting, not a request to change it. Rule 48.)*
2. **A QA branch / test environment for Filters, plus the feature-flag state.** Until it
   exists **nothing in this suite can be live-verified**: all **110 cases stay VIU-Pending**,
   every "VIU-confirm" note stays open, and we cannot tell a design detail from shipped
   behaviour (the scroll arrow in **D-5** is exactly that kind of item).
3. **Your go-ahead is NOT needed for anything here** — this pass made **zero** TestRail
   changes by design. The next push will need one.

**Nothing else is outstanding on the design source: it is COMPLETE at 85/85.**
