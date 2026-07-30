# Filters — Questions for Branko (and one for the developers) — 2026-07-29

Plain-language product questions raised by the engineering plan for the filter
redesign. Please pick A or B (or write your own answer). No technical knowledge
needed. (QA mapping to test cases is at the bottom, in the QA-only section —
readers can ignore it.)

**Status 2026-07-30: Q1 RESOLVED by user ruling (see below) — 6 questions remain
open for Branko (Q2–Q6 A/B + the Q7 spec v1.3 export request).**

**⚠️ STATUS UPDATE 2026-07-31 — re-checked against the CURRENT spec v1.6** (Confluence
page 572030978, Confluence version 12 = body version **1.6**, updated **2026-07-28 by
Branko Cicovic**; pulled live 2026-07-31, verbatim body in
`../spec-current-2026-07-31/Filters-spec-current.md`, diff in
`../spec-current-2026-07-31/SPEC-DIFF.md`, verification in
`../ahtesham-review-2026-07-31/VERIFICATION.md`). Net effect on THIS sheet:

- **Q2 (shared link) — ✅ ANSWERED BY THE SPEC, WITHDRAWN.** `S11-R6` (added v1.4).
- **Q3 (Imported works alone) — ✅ ANSWERED BY THE SPEC, WITHDRAWN.** `S2-R7` + `S2-N4` (added v1.4).
- **The "back to my saved filters" control NAME (asked inside Q2) — ✅ ANSWERED, WITHDRAWN.**
  Ratified as **"Back to my view"** in `S11-R7` (v1.5).
- **Q7 (spec v1.3 export) — SELF-RESOLVED:** we pulled **v1.6** live from Confluence on
  2026-07-31 instead of waiting for an export. The remaining ask to Branko is only
  *confirm v1.6 is current + tell us when you change it* (Standing Rule 23 re-pull is now
  the standing habit).
- **Still open, unchanged: Q4** (mobile single-filter sheet: Apply button vs real-time —
  independently re-raised by Ahtesham 2026-07-31), **Q5** (first-visit default tab; still
  absent from v1.6), **Q6** (Parts Vendors filters / missing design).
- **TWO NEW items added — Q8 (sorting scope) and Q9 (`S13-R23` searchable-field list)**, see
  the end of this file.

The reader-facing sheet was revised the same day:
**`../PO-Questions-Branko-Filters-TechPlan_2026-07-30.md`/`.xlsx` (revised 2026-07-31)** —
6 reader-facing questions, renumbered; the 3 withdrawals are recorded (with the verbatim
spec text that answers each) in its QA-only section. **Neither version was ever sent to
Branko.** NO TestRail writes were made in this pass.

---

**Question 1 — The Status filter on the Estimates and Completed tabs**

**✅ RESOLVED by user ruling 2026-07-30 — no answer needed from Branko.**
User ruling (verbatim): *"Status chip is hidden on certain tabs = greyed-out/disabled"*
— i.e. the tech plan's "hidden" wording and Branko's earlier answer
"greyed-out/disabled" describe the SAME behavior: on the tabs where the Status
filter doesn't apply (Estimates/Completed), the pre-filled Status chip shows
greyed-out/disabled. The engineering plan's phrasing is NOT a different behavior.
**Consequence:** cases FLT-TAB-02 (C29609
https://shopview.testrail.io/index.php?/cases/view/29609) and FLT-TAB-03 (C29610
https://shopview.testrail.io/index.php?/cases/view/29610) remain CORRECT as
pushed — greyed-out/disabled pre-filled chip; no case change, no TestRail write
needed.

<details><summary>Original question (kept for the record — do not answer)</summary>

What happens now (two different answers exist): You told us earlier (July 17)
that on the Estimates and Completed tabs the Status filter button should be
SHOWN, greyed out and pre-filled (for example "Status: Estimate"), just not
clickable. The engineering plan, following the spec text, is building it
HIDDEN on those tabs instead — no Status button at all.

The question: On the Estimates and Completed tabs, should the Status button be:

- **A)** Shown greyed-out and pre-filled, but not clickable (your July 17 answer)
- **B)** Hidden completely (what engineering is building)

Answer: ______________________________________________

</details>

---

**Question 2 — Opening someone else's filtered link**

**✅ ANSWERED BY SPEC v1.6 — WITHDRAWN 2026-07-31; do NOT ask Branko.**
Answered by **`S11-R6`**, added in spec **v1.4** (Confluence v9, 2026-07-27) — verbatim:
> *"Filter state arriving from a URL applies at runtime only. It never overwrites the
> user's saved filter state (S10-R2). Changes the user makes to filters while viewing a
> shared link are also not written back to their saved state: the entire visit is treated
> as a temporary view"*

**Effective answer = option A** (runtime-only; my saved filters untouched; and changes made
during the shared-link visit are not written back either). **Consequence:** FLT-URL-05
(C38879 https://shopview.testrail.io/index.php?/cases/view/38879) already tests this
clause-by-clause; only its `refs`/`spec_ref` are stale (they still say *"spec v1.3 export
awaited"*) → re-point to `S11-R6` (FIX-PLAN **F4**). No behaviour change to any case.

**Also withdrawn with it — the control NAME.** This question referred to *"a small 'back to
my saved filters' option"*. The label was **ratified as "Back to my view"** in **`S11-R7`**
(v1.5, Confluence v10, 2026-07-27) — verbatim:
> *"While viewing filter state that arrived from a URL, a "Back to my view" action is
> available. It discards the shared view and restores the user's own saved filters. It also
> clears any active search query, because the query is not part of saved state and there is
> nothing to restore it to. The label is deliberately "my view" rather than "my filters",
> since the action affects both filters and search"*

Use the ratified label in FLT-URL-05 per Rule 9 and add the **untested** "it also clears any
active search query" clause (FIX-PLAN **F5**); the negative `S11-N3` ("not shown when
viewing your own state") still needs a **NEW** case, FLT-URL-06 (new, no C-ID yet) — FIX-PLAN
**F6**.

<details><summary>Original question (kept for the record — do not answer)</summary>

What happens now: A teammate can send a link that opens the Work Orders page
with certain filters. Engineering is building it so the link is a TEMPORARY
view: it never replaces the filters you saved for yourself, and a small
"back to my saved filters" option brings your own filters back. One sentence
in the spec says the opposite (the link's filters would become your saved ones).

The question: When I open someone's filtered link, should it:

- **A)** Show their view temporarily and leave MY saved filters untouched
  (what engineering is building — and what you reportedly agreed in the page
  comments)
- **B)** Replace my saved filters with the link's filters

Answer: ______________________________________________

</details>

---

**Question 3 — The "Imported" status**

**✅ ANSWERED BY SPEC v1.6 — WITHDRAWN 2026-07-31; do NOT ask Branko.**
Answered by **`S2-R7`** + **`S2-N4`**, both added in spec **v1.4** (Confluence v9,
2026-07-27) — verbatim:
> **`S2-R7`:** *"Imported is an exception to S2-R2 and cannot be combined with anything
> else. Imported work orders come from a different data source rather than being a status of
> the existing records, so selecting Imported switches the list to the imported records and
> disables the other filter chips while it is active. Deselecting Imported returns the list
> and re-enables the other chips. This is current production behaviour and is unchanged by
> this work"*
>
> **`S2-N4`:** *"Selecting Imported alongside another status, customer, technician, advisor
> or asset filter is not a supported combination and is prevented by S2-R7 rather than
> returning an empty result"*

**Effective answer = option A** (Imported works alone; the other chips are disabled while it
is active; deselecting re-enables them). **Consequence:** FLT-STAT-07 (C38877
https://shopview.testrail.io/index.php?/cases/view/38877) already covers `S2-R7` + `S2-N4`
fully, clause by clause; only its `refs`/`spec_ref` and its "PENDING BRANKO" note are stale
→ re-point + delete the note (FIX-PLAN **F3**). No behaviour change to any case.

<details><summary>Original question (kept for the record — do not answer)</summary>

What happens now: Imported work orders live in a separate list behind the
scenes. Engineering is building the Imported choice so it works ALONE: when you
pick Imported, the other filter buttons (Customer, Lead Technician, Service
Advisor, Asset on site) grey out and cannot be combined with it. The spec lists
Imported as a normal status like any other.

The question: Should picking "Imported" work alone and grey out the other
filters?

- **A)** Yes — Imported works alone (what engineering is building; combining it
  is not technically possible today)
- **B)** No — I expected it to combine like the other statuses (this would need
  extra engineering work)

Answer: ______________________________________________

</details>

---

**Question 4 — Mobile: single filter windows**

What happens now: On a phone, tapping one filter button opens a small window
from the bottom. The designs show an "Apply filter" button in that window; the
engineering plan makes single-filter windows apply INSTANTLY as you tick
(no button) — only the combined "All Filters" window keeps an "Apply filters"
button.

The question: In the single-filter window on a phone, should choices apply:

- **A)** Instantly as you tick, no Apply button (engineering plan)
- **B)** Only after tapping an "Apply filter" button (as the designs show)

Answer: ______________________________________________

---

**Question 5 — Which tab opens first**

What happens now: Engineering decided that the very FIRST time someone opens
the redesigned Work Orders page, the ESTIMATES tab is selected (even though
"All" is the first tab in the row). After that, the page always reopens on the
tab you used last. This was decided for speed/load reasons and is not written
in the product spec.

The question: Is Estimates the right tab to open first for a brand-new visit?

- **A)** Yes — Estimates first is fine
- **B)** No — it should open on All (please note: engineering chose Estimates
  to keep the heaviest list off the landing page; picking B needs a talk with
  them)

Answer: ______________________________________________

---

**Question 6 — The Parts "Vendors" page filters**

What happens now: The spec lists a Vendors view among the Parts pages that get
filters, but engineering could not find a design for it and will not build its
filters until a design exists. They have requested the design.

The question: Please confirm the Vendors page IS meant to get filters, and have
the design added — or tell us it is out of scope.

- **A)** Vendors gets filters — design coming
- **B)** Vendors is out of scope for now

Answer: ______________________________________________

---

**Question 7 — The updated spec document (request, not a choice)**

**⚠️ SELF-RESOLVED 2026-07-31 — do not send as written.** We pulled the current spec
**v1.6** live from Confluence (page 572030978, Confluence v12, 2026-07-28) rather than
waiting for an export; we were **8 Confluence versions / 5 spec minor versions** behind
(49 requirements added, 0 removed, 4 changed — `../spec-current-2026-07-31/SPEC-DIFF.md`).
The only remaining ask to Branko is **confirm v1.6 is current + tell us each time you
change it**, which is how it is worded in the revised reader-facing sheet (its Question 6).
Standing Rule 23 (re-pull the Confluence page at the start of every project touch) is now
the standing habit for Filters.

<details><summary>Original request (kept for the record)</summary>

The engineering plan tells us the Filters spec on Confluence is now at
version 1.3 and covers much more than the copy we have: the Parts page
filters, the Reports page filters, a new date-range filter, the new in-page
Search box (23 requirements), and the change where the top navigation search
stops filtering page lists. Our copy is version 1.0.

**Please share the current spec** (an export of the Confluence page
"Filters" — the same way as before), so we can bring all the test cases in
line with it. This also covers the PRD update we asked for on July 17 —
it looks like it already exists as spec v1.3.

</details>

---

**Question 8 — Sorting the Work Orders list (NEW 2026-07-31)**

What happens now: The design file has a whole section named **"Sorting (Work In
Progress)"** (boards `11985:9686`, `11985:10428`, `11985:11259`, `11985:13334`). It
designs a **Sort dropdown** panel with a **field box** (values seen: *Status*, *WO
Number*), a **direction box** (*Ascending*), an **"Add Sort"** action and a **"Delete
sort"** action — and step 4 shows **two stacked sort rows at once**, i.e. sorting by
more than one column. A **sort button** also appears on the **final** mobile boards
(`11884:20807`, `11884:15901`, `12867:12201`) and on two **Reports** boards (**Notes**,
**Reminders**), so it is not confined to the Work-In-Progress section.
**Spec v1.6 has no sorting requirement at all** — the only mention of sorting anywhere
in the page is in passing at `S13-R14` (*"The search query … survives sorting,
pagination, and navigating away…"*). **Our suite has ZERO sorting cases** (no FLT-SORT
area exists in the 110-case active suite).

The question: Is sorting part of this project? If yes, does it support more than one
sort level at a time? And are the sort buttons on mobile and on the two Reports pages
in scope too?

- **A)** Yes — sorting is in scope, including multi-level sort (please add it to the spec)
- **B)** Yes but single-level only — one column at a time, no "Add Sort"
- **C)** No — sorting is not part of this project (the design boards are exploration only)

Answer: ______________________________________________

**QA consequence:** A → author a new **FLT-SORT** area (single-level, multi-level
add/remove, direction, mobile sort button, the 2 Reports surfaces) **after** Branko adds
sorting to the spec; needs `add_case` authorization. B → single-level cases only. C →
no cases; record sorting as out-of-scope in `PROJECT-STATE.md` + `coverage-matrix.md` so
the design boards are never mistaken for scope. **Do not author before the answer**
(Rule 1 — a board marked *Work In Progress* is not a spec). **Honest limit:** all 4
sorting boards are still **un-rendered** (Figma image endpoint rate-limited; Rule 35
queue `../design-2026-07-31/PENDING-FIGMA-FETCH.md` still OPEN) — the panel is described
from its own text/layer names, not from a picture. Source:
`../design-2026-07-31/DESIGN-NOTES.md` §5.1.

---

**Question 9 — The per-page list of searchable fields (NEW 2026-07-31)**

What happens now: Story 13 gives every table its own search box. `S13-R23` says each
table searches whatever fields its existing search endpoint already covers — and then
concedes, **verbatim**:
> *"**Pending:** the per-table list of fields currently covered, from engineering. Until
> it exists the searchable set is undocumented and **QA has no baseline to test
> against**. … Five of the surfaces listed under S14-R6 (Customer Contacts, Customer
> Assets, Customer Fees & Discounts, Administration Locations, Administration Fees &
> Discounts) narrow rows already loaded in the browser rather than querying an endpoint.
> For those, no list of covered fields exists to document: the searchable set is whatever
> the client-side filter happens to match today. Closing this item for them means either
> scoping the fields as new backend work or stating that the existing client-side
> narrowing is accepted as-is"*

**Confirmed STILL OPEN in v1.6** (`Filters-spec-current.md` line 563; SPEC-DIFF §4b
Group C; VERIFICATION *"Blocked by the spec itself"*). It is the spec's own unresolved
item, and it gates a chunk of Story 13.

The question: Please have the per-page list of searchable fields written down and shared
— or tell us to accept "whatever each page's search finds today" as correct.

- **A)** The list will be produced and shared (please say roughly when)
- **B)** Accept today's behaviour as-is — QA tests only that typing narrows the list, not which fields match

Answer: ______________________________________________

**QA consequence:** A → author per-page search-field cases on receipt (currently
un-authorable). B → coverage stays at "typing narrows the list" (FLT-PSRCH-01 = C38883
https://shopview.testrail.io/index.php?/cases/view/38883 · FLT-PSRCH-06 = C38891
https://shopview.testrail.io/index.php?/cases/view/38891) and the coverage-matrix records
per-field matching as deliberately untested by PO ruling. Either way the ~20 other
Story-13 gaps (component states, 300ms/350ms debounce, tab scoping, retention, mobile
mechanics, negatives) are **not** blocked by this and still need authoring authorization.

---

## QA-ONLY section (internal mapping — not for the PO)

| Q | Status (2026-07-31) | Deltas / spec ref | Cases affected (TestRail C-id) |
|---|---|---|---|
| Q1 | **RESOLVED** by user ruling 2026-07-30 (hidden == greyed-out/disabled) | C3 (G9 vs Branko Q4=B) | FLT-TAB-02 = C29609 https://shopview.testrail.io/index.php?/cases/view/29609 · FLT-TAB-03 = C29610 https://shopview.testrail.io/index.php?/cases/view/29610 — stand as pushed; no case change, no TestRail write. Spec-alignment ask for Branko = FIX-PLAN B1 (NOT in the reader sheet) |
| Q2 | **WITHDRAWN — answered by spec `S11-R6` (v1.4)**; the control-name half answered by **`S11-R7` (v1.5) = "Back to my view"** | C1 (G7 runtime-only) | FLT-URL-05 = C38879 https://shopview.testrail.io/index.php?/cases/view/38879 (stale refs → F4; label + query-clear → F5) · FLT-URL-02 = C29618 https://shopview.testrail.io/index.php?/cases/view/29618 · FLT-URL-06 (new, no C-ID yet — `S11-N3` negative, F6) · FLT-PSRCH-04 = C38888 https://shopview.testrail.io/index.php?/cases/view/38888 |
| Q3 | **WITHDRAWN — answered by spec `S2-R7` + `S2-N4` (v1.4)** | C2 (G1 Imported exclusivity) | FLT-STAT-07 = C38877 https://shopview.testrail.io/index.php?/cases/view/38877 (covers both clauses; stale refs + PENDING note → F3) · FLT-STAT-03 = C29562 https://shopview.testrail.io/index.php?/cases/view/29562 |
| Q4 | **STILL OPEN** (independently re-raised by Ahtesham 2026-07-31) | C4 (D15 vs design 11884:21065/21271); spec `S12-R2` + `S2-R6` | FLT-MOB-04 = C29624 https://shopview.testrail.io/index.php?/cases/view/29624 · FLT-MOB-02 = C29622 https://shopview.testrail.io/index.php?/cases/view/29622 · FLT-MOB-03 = C29623 https://shopview.testrail.io/index.php?/cases/view/29623 (all three get the same pending-flag note → F2) |
| Q5 | **STILL OPEN** (still absent from spec v1.6) | C5 (D10 default tab) | FLT-TAB-06 = C38876 https://shopview.testrail.io/index.php?/cases/view/38876 |
| Q6 | **STILL OPEN** | C7 (Vendors design missing) | no case exists — FLT-PARTS-08 was proposed 2026-07-30 and is **not** in the current id-map (Parts consolidated 2026-07-31 → FLT-PARTS-01/09/11/12, all blank C-ids) |
| Q7 | **SELF-RESOLVED** — v1.6 pulled live 2026-07-31; remaining ask = confirm-current + notify-on-change | C9 (spec drift; 8 Confluence versions behind) | whole suite (110 active; 94 live, 16 blank C-ids) — triggers the SPEC-RELEVANCE-RECONCILIATION already in flight (Rule 11 ask first); C6/C8 page-search ownership rides on Branko's PartsReports Q6 |
| **Q8** | **NEW 2026-07-31 — OPEN** (sorting scope) | design `11985:9686` / `10428` / `11259` / `13334` + mobile `11884:20807`/`15901`/`12867:12201` + Reports Notes/Reminders; **no sorting requirement in spec v1.6** (only `S13-R14` in passing) | **none — zero sorting cases in the suite**; A → new FLT-SORT area (needs `add_case` auth, after Branko adds it to the spec); C → record out-of-scope |
| **Q9** | **NEW 2026-07-31 — OPEN** (spec's own pending item) | spec **`S13-R23`** — *"Pending: the per-table list of fields currently covered, from engineering. Until it exists the searchable set is undocumented and QA has no baseline to test against"* | FLT-PSRCH-01 = C38883 https://shopview.testrail.io/index.php?/cases/view/38883 · FLT-PSRCH-06 = C38891 https://shopview.testrail.io/index.php?/cases/view/38891 · plus the ~20 un-authored Story-13 cases |


> **QA-INTERNAL NOTE — USER RULING 2026-07-31 (page-search ownership).** Verbatim: *"OK do not delete those cases unless Branko confirms that they are related to Global search only."* The nine page-search cases **FLT-SRCH-01..09** (new, no C-IDs yet — none is in TestRail) **STAY in the Filters suite** unless Branko confirms Global-Search-only ownership; **his answer decides move-vs-keep.** Do NOT delete or transfer them before that. Note on numbering: in THIS sheet Q6 is the *Vendors design* question and the page-search-ownership item rides on the Q7 / C6-C8 row above; the reader-facing search/ownership question the ruling refers to is **Question 6 of `../PO-Questions-Branko-PartsReports-2026-07-27.md`** ("The pop-up search box"). The 2026-07-31 Ruthless Usefulness Audit's CUT recommendation for all nine (and its NONSENSE verdict on FLT-SRCH-09) is a RECOMMENDATION ONLY, re-tabled on his answer.

Verify the C-ids for the Q2/Q3/Q4/Q9 rows against `build/filters/testrail-id-map.csv`
before sending anything that quotes them.
