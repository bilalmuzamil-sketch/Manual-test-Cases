# Filters — APPLY PLAN from Branko's Parts/Reports/page-search answers — 2026-07-31

> # ⛔ NOTHING IN THIS PLAN HAS BEEN APPLIED.
> **Zero case bodies were edited. `../testrail-id-map.csv` and
> `testrail-import/filters-v1-testrail-import.csv` were NOT touched. ZERO TestRail
> writes were made.** This document is a staged, ready-to-execute change list for a
> **follow-up worker**, and it may not be executed until BOTH of these are true:
> 1. the **sibling worker** currently editing `build/filters/cases/**`, the id-map and
>    the import has **finished** (that worker has already added `FLT-PSRCH-08…13`, which
>    are not yet in the id-map); and
> 2. the **user has explicitly authorized the TestRail operations** (Standing Rule 6 —
>    TestRail is the only production system).
>
> The local case-body edits (§2) may be applied *before* authorization, since local edits
> are reversible and are not TestRail writes — but even those must wait for the sibling
> worker to avoid a merge collision in the same JSON files.

| | |
|---|---|
| Source of the rulings | `answers-ingested.md` (verbatim) |
| Analysis behind each item | `DELTAS.md` |
| Spec authority | live **v1.6** — `../spec-current-2026-07-31/Filters-spec-current.md` (Confluence 572030978 v12, 2026-07-28) |
| **Total: local edits** | **11** (10 on blank-C-id cases + 1 note-only) |
| **Total: TestRail ops** | **1 `update_case` (required) + 8 `add_case` + 2 `add_section` + 1 `move_cases_to_section` + 1 `update_case` (optional)** |
| **Total: retire-proposals** | **9** (local only — no `delete_case`, all have blank C-ids) |
| **Total: new cases to author** | **1** (NEW-1) |
| **Run-sync implication** | **YES — Rule 34, run 352. See §6.** |
| Live-build check | **NOT RUN** (Rules 12/22) — every case stays `viu_status: VIU-Pending` |

**Files the follow-up worker will touch (all outside this folder — hence not touched here):**
`../cases/cases-E-parts-filters.json`, `../cases/cases-F-reports-filters.json`,
`../cases/cases-G-page-search.json`, `../testrail-id-map.csv`,
`testrail-import/filters-v1-testrail-import.csv`/`.xlsx` (via `../gen_import.py`).

---

## 0. Do these FIRST (in this order)

1. **`git pull --rebase`** and confirm the sibling worker's commits are in. **Re-derive
   the live blank-C-id list** from `../cases/*.json` + `../testrail-id-map.csv` — do
   **not** trust the counts in this doc; they were read mid-window.
2. **Re-read each target case body before editing it.** The sibling worker may already
   have changed wording this plan quotes. Where this plan's "BEFORE" text no longer
   matches, **apply the intent, not the literal string**, and note the divergence.
3. **Back up every case body you touch** into
   `branko-answers-2026-07-31/backup/` (same convention as
   `../consolidation-backup-2026-07-31/` and `../tech-plan-2026-07-29/backup/`), with a
   `MANIFEST.md`.
4. **Write the TestRail sync manifest BEFORE the first write** (house convention: the
   manifest is written before, the execution log during) —
   `branko-answers-2026-07-31/testrail-sync-manifest-2026-07-31.md`.

---

## 1. The standard text blocks (used by several items — write them once)

**BLOCK-P (permissions, replaces the Q7 hedge everywhere).** Driving answer, verbatim:
*"A - Same for everyone - role does not change chips or their options"*

> BEFORE: `"Any signed-in user with access to the Parts pages. Whether the filter option lists differ by role is to confirm — pending Branko's PRD."`
> AFTER: `"Any signed-in user with access to the Parts pages. The filter buttons and their choices are the same for every user - a person's role does not change them."`
> *(Reports variant: substitute "Reports pages".)*

**BLOCK-R (refs / `spec_ref`, replaces Figma-only and "spec v1.3 export awaited").**
Rule 20 wants `<TICKET(S)> (<spec-anchor>)`. **There is still no Epic/Jira key (OQ-3) —
do NOT invent one.** There is also **no `S#-R#` anchor for Parts or Reports** in v1.6
(§7 Requirements holds Stories 1–14, none of them Parts or Reports), so the anchor is a
prose citation:

> Parts: `"Filters (Epic key TBD) (spec v1.6 §2 Feature Overview -> Parts Filters; §4 Key Decisions -> \"Context-specific filter sets on Parts and Reports\", \"Multi-select where it makes sense\"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11884-16885"`
> Reports: `"Filters (Epic key TBD) (spec v1.6 §2 Feature Overview -> Reports Filters; §4 Key Decisions -> \"Context-specific filter sets on Parts and Reports\", \"New date-range filter type\", \"Multi-select where it makes sense\"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11903-10573"`

**BLOCK-N (note tail, replaces the stale pending-PRD tail).**

> BEFORE (in `notes`): `"Pending Branko's PRD ratification (spec v1.3 export awaited)."`
> AFTER: `"RESOLVED 2026-07-31 - Branko's answers (Parts/Reports sheet) + live spec v1.6 (Confluence v12, 2026-07-28): the PRD update landed; Parts/Reports filters are confirmed in scope with full Work-Orders parity. Still NOT live-verified (no QA branch) - viu_status stays VIU-Pending."`

**BLOCK-T (the tester-facing "no fixed list" line, replaces the option-list hedge).**
Driving answer, verbatim: *"We should support all the filters we have right now in the app
as well as all choices per filter. There is no specific list of choices."*

> `"The choices inside each filter come from your own shop's data (for example your real vendors or categories), so there is no fixed list to compare against - check that the choices you see match the data in your shop."`

---

## 2. APPLY-NOW — per-case instructions

### A1 · FLT-PARTS-01 — "Every Parts list page shows its designed filter buttons"
**C-id: blank (never pushed) · TestRail op: `add_case`**

**Driving answers, verbatim:** *"A - Yes, every chip shown filters that page."* (Q2) ·
*"There is no specific list of choices."* (Q3) · *"A - Same for everyone - role does not
change chips or their options"* (Q7)

1. `permissions_required` → **BLOCK-P** (Parts variant).
2. **Expected 11 — REPLACE, do not delete.** BEFORE: *"Behaviour to confirm — pending
   Branko's product write-up; to be checked live once the feature is available. (which
   filters actually apply on each Parts page, their full option lists, and what the funnel
   and column icons do)."*
   AFTER — three separate points, because the three sub-questions have three different
   fates:
   - `"11. Every filter button shown above is a working filter on that page - none of them is display-only."` *(Q2=A settles it.)*
   - `"12. "` + **BLOCK-T** *(Q3 settles it — it is now an instruction, not an open question.)*
   - `"13. Still to check on the live build: what the funnel icon and the column/layout icon do (the written description does not cover the toolbar icons)."` *(genuinely still unknown — keep, but stop attributing it to a missing PRD.)*
3. **Expected 8 — KEEP THE VENDORS HEDGE EXACTLY AS IT IS.** *"Note: the developers have
   not been given a design for the Vendors page filters yet…"* — Q2=A speaks about chips
   **shown in the design**, and there is **no Vendors design**. That question is Q3 of
   `../PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` and is **unanswered**. Do not
   close it.
4. `spec_ref` → **BLOCK-R** (Parts). Keep `design_ref` unchanged.
5. `notes` → append **BLOCK-N**; keep the whole MERGE-SURVIVOR paragraph intact.

**Rule-28 pre-check.** *Useful:* **KEEP** — one presence walk over 8 Parts views; the
load-bearing "nothing is display-only" assertion is added, not padded. *Makes sense:*
**SENSIBLE** — steps 1–9 stay executable in order; expected renumbering 11→11/12/13 keeps
the 1:1 step↔expected readability. *Genuine + layman:* refs now cite a real spec section
(Rule 20, capped by the missing Epic key); every added line is plain English with no
jargon (Rules 7/9).

---

### A2 · FLT-PARTS-09 — "Part Type filter opens a Core / Non Core list with Clear selection"
**C-id: blank · TestRail op: `add_case`**

**Driving answers, verbatim:** *"A - Yes - multi-select, clearing, collapse, persistence,
shareable URL and mobile all match Work Orders."* (Q5) · spec v1.6 §4: *"Multi-select
where it makes sense : all Parts and Reports filters are multi-select except the
date-range filter, which is a single range."*

1. `permissions_required` → **BLOCK-P**.
2. **Expected 3 — REPLACE.** BEFORE: *"Behaviour to confirm — pending Branko's product
   write-up; to be checked live once the feature is available. (whether the options are
   single- or multi-select, and how the list is filtered after choosing)."*
   AFTER, two points:
   - `"3. You can tick both Core and Non Core at the same time - this filter allows more than one choice."`
   - `"4. As soon as you tick a choice the list below narrows to matching parts straight away, with no Apply button to press; Clear selection puts the list back."`
3. Add a step so expected 3/4 are actually driven (they currently are not — the case only
   opens the menu): `"3. Tick Core, then also tick Non Core, and watch the list below."` and
   `"4. Use Clear selection."`
4. `spec_ref` → **BLOCK-R** (Parts) + `"; §4 Key Decisions -> \"Multi-select where it makes sense\""`.
5. `notes` → replace *"Selection/apply behaviour pending Branko's PRD."* with **BLOCK-N**.

**Rule-28 pre-check.** *Useful:* **KEEP** — the only case covering the Core/Non-Core
dropdown, and it now tests behaviour rather than only presence. *Makes sense:* was
**FIX-WORDING** (expected asserted selection behaviour the steps never performed — audit
fail condition "expected result doesn't follow from the steps"); items 2+3 fix it
together. *Genuine + layman:* plain wording, real spec anchor.

---

### A3 · FLT-PARTS-11 — "Choosing a Parts filter narrows the list on that page"
**C-id: blank · TestRail op: `add_case`**

**Driving answers, verbatim:** Q2=A *"every chip shown filters that page"* · Q5=A parity.

1. `permissions_required` → **BLOCK-P**.
2. **Expected 3 — REPLACE.** BEFORE: *"Behaviour to confirm — pending Branko's product
   write-up… (exactly which filters apply on which Parts page, the full option lists, and
   whether results update immediately)."*
   AFTER: `"3. The list narrows as soon as you pick the value - there is no Apply or Search button to press. Every filter button on every Parts page works this way."`
3. `spec_ref` → **BLOCK-R** (Parts). 4. `notes` → **BLOCK-N** replacing the *"spec v1.3
   export awaited"* tail; keep the tech-plan rollout paragraph (still useful engineering
   context) but drop *"Pending Branko's PRD ratification"*.

**Rule-28 pre-check.** *Useful:* **KEEP** — the core apply-behaviour case for Parts;
failure here is a real reportable bug. *Makes sense:* **SENSIBLE** — the hedge that made
the expected result unfalsifiable is gone, so a tester can now tell what PASS looks like.
*Genuine + layman:* yes.

---

### A4 · FLT-PARTS-12 — "Parts filters support multiple choices and can be cleared"
**C-id: blank · TestRail op: `add_case`**

**Driving answer, verbatim:** *"A - Yes - multi-select, clearing, collapse, persistence,
shareable URL and mobile all match Work Orders. One difference: filters don't carry across
Parts views or Report tabs; each view keeps its own set."*

1. `permissions_required` → **BLOCK-P**.
2. **Expected 1 — REPLACE.** BEFORE: *"More than one value can be chosen inside a filter
   (to be checked live once available)."* AFTER: `"1. More than one value can be chosen inside the filter, and the button shows what you picked."`
3. **Expected 3 — REPLACE.** BEFORE the *"Behaviour to confirm — pending Branko's…
   (whether multi-select, per-filter Clear selection, and an overall Clear filters action
   all work the same as on the Work Orders page)"* hedge.
   AFTER: `"3. A Clear filters button appears in the filter bar while any filter is set, and using it clears them all at once - exactly as it works on the Work Orders page."`
4. **Do NOT add a per-view-scoping expectation here.** Q5's exception 1 ("filters don't
   carry across Parts views") is **already covered** by **FLT-PERS-05 = C38880**
   ([view](https://shopview.testrail.io/index.php?/cases/view/38880)). Duplicating it here
   is exactly the over-coverage Rule 28 cuts. Add a cross-reference in `notes` only:
   `"Per-view scoping (filters do not carry between Parts views) is covered by FLT-PERS-05 = C38880 - do not duplicate it here."`
5. `spec_ref` → **BLOCK-R** (Parts). 6. `notes` tail → **BLOCK-N**.

**Rule-28 pre-check.** *Useful:* **KEEP** (multi-select + both clear actions = distinct
observable behaviour), with an explicit anti-duplication guard against FLT-PERS-05.
*Makes sense:* **SENSIBLE** — the "(to be checked live once available)" parenthesis that
made expected 1 untestable is removed. *Genuine + layman:* yes.

---

### A5 · FLT-RPTS-01 — "Every report page shows its designed filter buttons"
**C-id: blank · TestRail op: `add_case`**

**Driving answers:** Q2=A, Q3, Q7=A (verbatim as above).

1. `permissions_required` → **BLOCK-P** (Reports variant).
2. **Expected 22 — SPLIT IT.** It currently bundles two hedges with different fates.
   BEFORE: *"Behaviour to confirm — pending Branko's product write-up; to be checked live
   once the feature is available. (the option lists behind each filter button; and because
   several report bodies in the design are sample placeholders, the real report columns
   come from the same product write-up)."*
   AFTER:
   - `"22. Every filter button shown above is a working filter on that report - none of them is display-only."` *(Q2=A)*
   - `"23. "` + **BLOCK-T** *(Q3 — resolved, now an instruction)*
   - `"24. Still to check on the live build: the real columns of the Sales Tax report and of the six A/R and A/P aging reports. The design uses sample placeholder tables for those, and the written description does not list their columns."` *(**genuinely still open** — and Q1 being blank is precisely why. Keep it, but stop calling it "pending Branko's product write-up" when the write-up exists: say what is missing from it.)*
3. `spec_ref` → **BLOCK-R** (Reports). 4. `notes` → append **BLOCK-N**; keep the entire
   MG15 MERGE-SURVIVOR paragraph (it holds the demoted column lists — nothing may be lost).

**Rule-28 pre-check.** *Useful:* **KEEP** — the MG15 survivor covering 23 report screens
in one walk. *Makes sense:* **SENSIBLE** — 1–24 numbering stays clean and each expected
still maps to a step. *Genuine + layman:* refs upgraded from Figma-only to a real spec
section; the residual unknown is now named specifically instead of hand-waved.

---

### A6 · FLT-RPTS-21 — "Choosing a Reports filter narrows the report results"
**C-id: blank · TestRail op: `add_case`**

**Driving answers:** Q2=A · Q5=A.

1. `permissions_required` → **BLOCK-P**.
2. **Expected 2 — REPLACE** the *"Behaviour to confirm — pending Branko's… (exactly which
   filters apply on each report, the full option lists, and whether results update
   immediately)"* hedge with:
   `"2. The report narrows as soon as you pick the value - there is no Apply or Run button to press. Every filter button on every report works this way."`
3. `spec_ref` → **BLOCK-R** (Reports). 4. `notes` → **BLOCK-N** replacing *"Pending
   Branko's PRD ratification (spec v1.3 export awaited)"*; **keep** the *"WORDING REPAIR
   2026-07-31"* provenance sentence.

**Rule-28 pre-check.** *Useful:* **KEEP** — Reports apply-behaviour twin of A3. *Makes
sense:* **SENSIBLE** — the choose-a-value step was already repaired on 2026-07-31, so
steps and expected now agree. *Genuine + layman:* yes.

---

### A7 · FLT-RPTS-22 — "New Reports filter types behave correctly (Location, Transaction Type, etc.)"
**C-id: blank · TestRail op: `add_case`**

**Driving answers, verbatim:** *"Filter behavior and types are fully displayed in the
design. The links are in the PRD."* (Q4) · *"There is no specific list of choices."* (Q3)
· *"A - Yes - multi-select, clearing … all match Work Orders."* (Q5) · spec v1.6 §4
*"Multi-select where it makes sense…"*

> **Read `DELTAS.md` flag F1 before editing this one.** Q4 is a **pointer, not a
> description**, and it does **not** match our own live design read (`DESIGN-NOTES.md`
> §5.7: the boards pin *button names only*). The six new types are **enumerated nowhere in
> v1.6**. So Q4 alone settles nothing — but **Q3 + Q5 + §4 together DO settle the
> mechanics**, which is what this case tests. Edit accordingly, and do not pretend the
> per-type option lists were supplied.

1. `permissions_required` → **BLOCK-P**.
2. **Expected — REPLACE both lines.** AFTER:
   - `"1. Each of these filter buttons - Location, Transaction Type, Invoice Status, Type, User and Mention - opens a list of choices, lets you tick more than one, and narrows the report straight away with no Apply button."`
   - `"2. "` + **BLOCK-T**
   - `"3. Write down the choices you actually see behind each of these six buttons. They have not been written down anywhere yet, so your list becomes the record."`
3. Fix the step-1 grammar while you are in there: BEFORE *"go to the reports that use them
   (for example A/R Aging Detail, Notes) report"* → AFTER `"go to a report that uses them - for example A/R Aging Detail (Location, Transaction Type) or Notes (Mention)."`
4. Add a step that actually exercises the buttons (today it only *looks* at them):
   `"3. Open each of those filter buttons in turn, tick two choices where possible, and watch the report."`
5. `spec_ref` → **BLOCK-R** (Reports) + `"; Branko answers 2026-07-31 Q4 (pointer to design/PRD - the six new filter types are NOT enumerated in v1.6; see DELTAS.md flag F1)"`.
6. `notes` → **BLOCK-N** + `"OPEN: the option list for each of the six new filter types is not in spec v1.6 and not visible on any rendered design board (12 boards still un-rendered, Rule-35 queue). Branko's Q4 answer points at the design; question NEW-Q2 asks him for the specific board. Capture the real lists live at VIU."`

**Rule-28 pre-check.** *Useful:* **KEEP** — the only coverage of six filter types that
exist on no other page. *Makes sense:* was **FIX-WORDING** (broken grammar; expected
asserted filtering the steps never triggered) — items 3+4 repair both. *Genuine + layman:*
yes; and the one genuinely unknown thing is stated as a tester instruction ("write down
what you see") rather than an unfalsifiable hedge.

---

### A8 · FLT-RPTS-23 — "Date range filter: results update when both start and end dates are picked"
**C-id: `C38882`** ([view](https://shopview.testrail.io/index.php?/cases/view/38882))
**· TestRail op: `update_case` — THE ONE REQUIRED TESTRAIL WRITE**

**Driving answer, verbatim:** *"Date-range is a single range, not multi-select."* (Q5,
exception 2) · spec v1.6 §4: *"New date-range filter type : Date chips open a custom
start/end picker with no presets and no default range, and apply immediately on selection
of the second date. Used across Reports and the date columns on Parts views."*

**No tester-facing behaviour changes — the case is already correct.** Expected 4 already
reads *"Only one date range can be active at a time on that chip"*, which is exactly what
he confirmed. This is a **metadata / Rule-20 correction only**:

1. `spec_ref` → BEFORE: *"Filters (Epic key TBD); tech plan 2026-07-29 D19 (date-range chip: no presets, no default, applies on second date); **spec v1.3 Parts + Reports sections (export awaited)**"*
   AFTER: `"Filters (Epic key TBD) (spec v1.6 §4 Key Decisions -> \"New date-range filter type\"; §2 Feature Overview -> Reports Filters (start/end picker, no presets, no default, applies on second date, range=custom&from=&to= in the URL)); Branko answers 2026-07-31 Q5 (date-range is a single range, not multi-select); tech plan 2026-07-29 D19"`
2. `notes` → append: `"CONFIRMED 2026-07-31 from two sources that agree: Branko's answer (\"Date-range is a single range, not multi-select\") and spec v1.6 §4 Key Decisions. The spec export is no longer awaited. Exact panel labels still to capture live."`
3. `permissions_required` → **BLOCK-P** (Reports) — it currently has no role statement at all.
4. **Section move (separate op, see §3):** C38882 sits in section **4117** as a temporary
   home because "Reports Page Filters" did not exist yet. Once §3 creates it, move it.

**Rule-28 pre-check.** *Useful:* **KEEP**, unchanged. *Makes sense:* **SENSIBLE**,
unchanged — no tester-facing text is altered, so no re-read risk. *Genuine + layman:*
this item exists **only** to satisfy Rule 20 (a live case citing a spec version that has
been superseded four times is a traceability defect).

---

### A9 · FLT-PERS-05 — per-view / per-tab filter scoping *(OPTIONAL)*
**C-id: `C38880`** ([view](https://shopview.testrail.io/index.php?/cases/view/38880))
**· TestRail op: `update_case` — refs/notes only, bundle it, do not push alone**

**Driving answer, verbatim:** *"One difference: filters don't carry across Parts views or
Report tabs; each view keeps its own set."*

This case already tests the behaviour (authored from tech-plan D20). The edit only
upgrades its traceability from an engineering-decision ID to ratified product sources:
add `S10-R4` + §4 *"Parts and Reports selections are scoped to their view/tab and persist
there"* + Branko's Q5 exception to `spec_ref`, and a note that PO and spec now agree
(Rule 32(i) — duplication raises confidence). **No behaviour change. No new case** — this
is the anti-duplication decision recorded in A4 item 4.

---

## 3. TestRail section work (before the `add_case` batch)

The 7 new Parts/Reports cases need their sections to exist under group **4110**
(`../testrail-id-map.csv` already names them):

| Op | Section | Members |
|---|---|---|
| `add_section` | **"Parts Page Filters"** (parent 4110) | FLT-PARTS-01, -09, -11, -12 |
| `add_section` | **"Reports Page Filters"** (parent 4110) | FLT-RPTS-01, -21, -22 + **C38882 moved in** |

**⚠️ API gotcha — `update_case` does NOT move a case between sections.** Use
`POST index.php?/api/v2/move_cases_to_section/{section_id}` with
`{"suite_id": 1, "case_ids": [38882]}`. Verify with a re-GET of C38882 and check
`section_id`. This closes the follow-up logged in `../PROJECT-STATE.md` 2026-07-30
("FLT-RPTS-23 section move").

**Do NOT create a section for the 9 `FLT-SRCH` cases** — "Page Search (Command-K)" exists
only in the id-map, never in TestRail, and per §5 those cases are being retired.

---

## 4. NEEDS-NEW-CASE — 1 case to author

### NEW-1 · "Every filter a page had before is still available in the new filter bar"
**Proposed id: `FLT-PARTS-13`** (next free in the Parts area; it covers Reports too —
see the Rule-28 note) · **C-id: none — new** · **TestRail op: `add_case`**

**Driving answer, verbatim:** *"**We should support all the filters we have right now in
the app as well as all choices per filter.** There is no specific list of choices."*

**Why it must exist.** This is a **scope/parity ruling that nothing in the 110-case suite
asserts.** Every existing Parts/Reports case checks that the *designed* chips are present
and work. **None** checks the inverse — that no filter a shop relies on **today** was
dropped in the redesign. That is the single most likely real-world regression of an
app-wide filter-bar replacement, and it is exactly what his sentence demands. It is also
corroborated by the tech plan's own rollout rule (*"NO change to what is filterable"*), so
two sources agree (Rule 32(i)).

**Draft (layman, Rules 7/9 — build-accurate labels to be confirmed at VIU):**
- *Preconditions:* 1. You are signed in on a desktop browser. 2. You have a written list of the filters each Parts page and each report offers **today, before the new filter bar** (take screenshots of the old screens first, or ask the developers for the list). 3. Sample data is present.
- *Steps:* 1. Take your before-list for one page. 2. Open the same page with the new filter bar. 3. Compare the filter buttons you now see against your before-list. 4. Open each button and compare the choices inside it against the choices the old filter offered. 5. Repeat for the other Parts pages and reports.
- *Expected:* 1. Every filter the page offered before is still offered — nothing has been taken away. 2. Every choice each of those filters offered before is still available inside the new button. 3. If any filter or choice is missing, write down exactly which page, which filter and which choice — that is a bug worth reporting.
- *`spec_ref`:* `"Filters (Epic key TBD) (spec v1.6 §2 Feature Overview -> Parts Filters / Reports Filters); Branko answers 2026-07-31 Q3 verbatim (\"We should support all the filters we have right now in the app as well as all choices per filter\"); tech plan 2026-07-29 rollout rule (NO change to what is filterable)"`
- *`viu_status`:* `VIU-Pending`. *`api_related`:* `false`.

**Rule-28 pre-check.** *Useful:* **KEEP** — load-bearing regression guard, no overlap with
any existing case (verified against all 110 active this pass); failure = a real,
customer-visible loss of function. *Makes sense:* **SENSIBLE** — the one risk is
precondition 2 (the "before" list), so it is written as an explicit, achievable tester
action (screenshot first / ask the developers) rather than an unreachable state.
*Genuine + layman:* plain English, no jargon, traceable to a verbatim PO ruling.
**ONE case, not one per page** — deliberately, because per-page explosion is the exact
pattern the 2026-07-31 audit cut 27 cases for.

---

## 5. RETIRE-PROPOSALS — the 9 `FLT-SRCH` cases

**Driving answer, verbatim:** *"**A - Test it under Global Search, not here.** This
release only removes global search's page-filtering behaviour (Story 14). \"Ask a
question\" is not in this PRD's scope."*

**The user's hold condition is met** (ruling 2026-07-31: *"do not delete those cases
unless Branko confirms that they are related to Global search only"*). Full reasoning +
the three corroborating sources: `DELTAS.md` §2.

| Internal ID | C-id | Op | Action |
|---|---|---|---|
| FLT-SRCH-01 … FLT-SRCH-09 (all nine) | **blank — none is in TestRail** | **NONE (no `delete_case`)** | Set `viu_status` = `"Retired — page-search palette confirmed Global-Search-owned by Branko 2026-07-31 (Q6=A); coverage lives in the Global Search project's 86-case suite"`; keep the bodies in `../cases/cases-G-page-search.json`; drop the 9 rows from `../testrail-id-map.csv`; `gen_import.py` already excludes `Retired — …`. |

**Guard rails for whoever executes this:**
1. **Requires explicit user authorization** — it is a suite change against a standing hold.
2. **`FLT-SRCH-09` retires on its own merits too** — it is a *scope decision* dressed as a
   test case, and the decision has now been made.
3. **⛔ DO NOT TOUCH ANY `FLT-PSRCH-*` CASE.** Different component (Filters' own Story 13,
   29 ratified requirements). Seven are **live in TestRail**: **C38883, C38884, C38886,
   C38888, C38889, C38891, C38893** — plus `FLT-PSRCH-08…13` authored by the sibling
   worker. **Read `DELTAS.md` flag F2 first**: one clause of his answer, read literally,
   would descope Story 13, and the correct response is question **NEW-Q1**, not an edit.
4. **Cross-project flag, do NOT write blind:** the Global Search project should record his
   ownership ruling and his *"'Ask a question' is not in this PRD's scope"* line (its
   **OQ-3**). That is a write to `build/global-search/**` and needs its own authorization.

---

## 6. Run-352 sync implication (Standing Rule 34) — MANDATORY LAST STEP

**Run **352** — "Filters - Ahtasham (Awaiting QA- ENV)"** — currently holds the complete
active suite (**94 tests**, **395 result records**) after the 2026-07-31 sync
(`build/testrail-run-sync-2026-07-31/`).

**Every `add_case` in this plan MUST be followed by a run-352 union sync**, or the new
cases will be invisible to the tester and a reviewer will again report "no case exists"
for coverage that does exist — the exact failure that created Rule 34.

- **Cases to add to the run: 8** — the 7 Parts/Reports (`FLT-PARTS-01/09/11/12`,
  `FLT-RPTS-01/21/22`) + **NEW-1**. Plus **whatever the sibling worker pushes**
  (`FLT-PSRCH-08…13` = 6 more if they are pushed in the same window) — **do ONE union sync
  covering everything**, do not sync twice.
- **Expected test count: 94 → 102** (or 108 if the sibling's 6 are included in the same
  push). **Record before→after in the audit log.**
- **Method, exactly:** `get_run/352` → if `include_all` is **true**, nothing to do, just
  verify the count. It is **false** for every VIU run in this workspace, so:
  `get_tests/352` → derive the current case_id list → `sorted(set(current) | set(new))` →
  `update_run` with the **FULL UNION**.
- **⚠️ NEVER send a partial `case_ids` list. `update_run` REPLACES the selection — a
  partial list DELETES the omitted tests AND THEIR 395 RECORDED RESULTS.** Snapshot
  `get_tests/352` **and** `get_results_for_run/352` **before** writing; re-verify after
  (count == expected, every prior result still present).
- **Run 352 belongs to another tester (Ahtesham) → the run write needs the user's
  EXPLICIT authorization, separately from the case-push authorization** (Rule 6).
- `update_case` items (A8, A9) and the local-only `FLT-SRCH` retirements need **no** run
  action — an updated case is already in the run, and the retired 9 were never in TestRail.
- Reusable tooling: `build/testrail-run-sync-2026-07-31/run_sync_audit.py` (read-only
  checker) and `sync_runs_EXECUTOR.py` (union executor).

---

## 7. Mandatory quality gate before delivery (Standing Rule 28)

The follow-up worker **must** finish with the three-dimension audit, not just the per-item
pre-checks in §2:

1. **Per-case cold read (Stage 2a)** over every case touched — USEFUL (KEEP/MERGE/
   WEAK-KEEP/CUT) × MAKES-SENSE (SENSIBLE/FIX-WORDING/NONSENSE) × GENUINE+LAYMAN-RUNNABLE.
2. **⚠️ THE CROSS-CASE CONSISTENCY SWEEP (Stage 2b) — MANDATORY, suite-wide, never
   skipped** (`build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` §Stage 2b). This pass makes it
   *especially* necessary, because it changes the **same sentence in seven cases at once**
   and because a sibling worker is editing the same files in the same window. Specifically
   check that after the edits:
   - **no two cases disagree** about whether Parts/Reports option lists are fixed or
     data-driven (BLOCK-T must read the same in every case that carries it);
   - **no two cases disagree** about role-dependence (BLOCK-P everywhere, no surviving
     *"to confirm — pending Branko's PRD"*);
   - **no case still says "pending Branko's PRD" / "spec v1.3 export awaited"** — grep the
     whole suite for both strings, plus `"Behaviour to confirm"`;
   - **FLT-PARTS-12 and FLT-PERS-05 (C38880) do not both** assert per-view scoping;
   - **the Vendors hedge survives in FLT-PARTS-01** and is contradicted nowhere else;
   - the known **Status-chip** inconsistency (`VERIFICATION.md` §CONFLICT-1) is not made
     worse — it is a separate, already-logged fix.
3. **Report the tally** with the suite (usefulness counts + sense counts + genuine/layman
   confirmation + the honest "is the critic right?" answer), per Rule 28.
4. **Traceability:** confirm **100%** of the touched cases carry ticket + spec anchor
   (Rule 20) — and state plainly, again, that the "ticket" half is still `Epic key TBD`
   (**OQ-3**) and the Parts/Reports spec anchors are **prose sections, not `S#-R#`**,
   because **Q1 was left blank**. Do not invent either.

---

## 8. Execution checklist (tick in order)

- [ ] `git pull --rebase`; sibling worker's edits present; **blank-C-id list re-derived live**
- [ ] Backups written to `branko-answers-2026-07-31/backup/` + `MANIFEST.md`
- [ ] Local edits A1–A7 applied (7 blank-C-id cases) + A8/A9 bodies mirrored locally
- [ ] `FLT-SRCH-01..09` retired locally **(only if user-authorized)**
- [ ] NEW-1 authored **(only if user-authorized)**
- [ ] `gen_import.py` re-run → import + id-map regenerated; **⚠️ re-merge the id-map C-id column** (it is blanked on every run); header byte-identical; 0 VIU/flag words; no duplicate titles
- [ ] **Rule-28 gate run: Stage 2a + the Stage 2b cross-case consistency sweep** (§7)
- [ ] TestRail sync manifest written **BEFORE** the first write
- [ ] **User authorization obtained for the TestRail ops** (Rule 6) — and **separately** for the run-352 write
- [ ] 2 `add_section` → 8 `add_case` → 1–2 `update_case` → 1 `move_cases_to_section`; **every op re-GET verified MATCH**; per-op audit log
- [ ] **Run-352 union sync** (§6): snapshot first, **full union only**, verify 94 → expected, all 395 results intact
- [ ] `../PROJECT-STATE.md` updated (new tally, this folder indexed, the closed threads marked closed: Round-1 Q1 gate, page-search ownership, AI scope, Parts/Reports OQ-4 half)
- [ ] The QA-internal notes in `../PO-Questions-Branko-PartsReports-2026-07-27.md` and `../tech-plan-2026-07-29/Questions-for-Branko-dev.md` marked **ANSWERED** for page-search ownership, so it is never re-asked
- [ ] New questions **NEW-Q1 / NEW-Q2 / NEW-Q3** + the three PRD-alignment additions folded into the next Branko sheet (`DELTAS.md` §4d) — **and confirm none of the 6 questions already in `../PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` was removed**, because his answers settled **none** of them
- [ ] Commit path-scoped after **each** step (Standing Rule 29 — no-work-loss)
