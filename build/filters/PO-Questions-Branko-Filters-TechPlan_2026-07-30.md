# Filters — Questions for Branko — 2026-07-30 (revised 2026-07-31)

**Revised 2026-07-31 — this version replaces the 2026-07-30 draft, which was never sent.**
Two of the earlier questions (and a naming question that sat inside one of them) have been
removed, because your latest written requirements for the filters (version 1.6, updated
28 July) already answer them. Two new items have been added: sorting, and which details the
new in-page search box looks at.

Plain-language product questions only (no bugs, no test jargon). These came up because the engineering build plan and the design pictures for the filter redesign describe a few things the written requirements do not settle.
Please pick an option (or write your own answer) for each.

## Question 1 — Mobile: single filter windows - instant or with an Apply button

**What happens now:** On a phone, tapping one filter button opens a small window from the bottom. The design pictures show an "Apply filter" button in that window; the engineering plan makes single-filter windows apply INSTANTLY as you tick (no button) - only the combined "All Filters" window keeps an "Apply filters" button.

**The question:** In the single-filter window on a phone, should choices apply instantly as you tick, or only after tapping an "Apply filter" button?

**Options:**

- A) Instantly as you tick, no Apply button (the engineering plan's way).
- B) Only after tapping an "Apply filter" button (as the design pictures show).

**Your answer:** ____________________

## Question 2 — Which tab opens first

**What happens now:** Engineering decided that the very FIRST time someone opens the redesigned Work Orders page, the ESTIMATES tab is selected (even though "All" is the first tab in the row). After that, the page always reopens on the tab you used last. This was decided for speed reasons and is not written down anywhere.

**The question:** Is Estimates the right tab to open first for a brand-new visit?

**Options:**

- A) Yes - Estimates first is fine.
- B) No - it should open on All (please note: engineering chose Estimates to keep the heaviest list off the landing page; picking B needs a talk with them).

**Your answer:** ____________________

## Question 3 — The Parts "Vendors" page filters

**What happens now:** The written description lists a Vendors view among the Parts pages that get filters, but engineering could not find a design picture for it and will not build its filters until a design exists. They have requested the design.

**The question:** Please confirm the Vendors page IS meant to get filters, and have the design added - or tell us it is out of scope.

**Options:**

- A) Vendors gets filters - design coming.
- B) Vendors is out of scope for now.

**Your answer:** ____________________

## Question 4 — Sorting the Work Orders list

**What happens now:** The design pictures include a sorting panel for the Work Orders list: you pick a column (for example Status, or WO Number), you pick Ascending or Descending, there is an "Add Sort" option that lets you sort by a second column at the same time, and a "Delete sort" option to remove one. The written description does not describe any sorting control at all, so we have no tests for sorting - not one. The sorting pictures are also marked "Work In Progress", which is why we are asking rather than assuming. A sort button also shows on the phone version of the Work Orders page, and on two report pages (Notes and Reminders).

**The question:** Is sorting part of this project? If yes, should it allow more than one sort level at a time, and are the sort buttons on the phone version and on those two report pages included too?

**Options:**

- A) Yes - sorting is in scope for this project, including more than one sort level at a time (please add it to the written description so we can write the tests).
- B) Yes, but single-level only - one column at a time, no "Add Sort".
- C) No - sorting is not part of this project (the design pictures are exploration only).

**Your answer:** ____________________

## Question 5 — Which details the new in-page search box looks at

**What happens now:** Each list page is getting its own small search box that narrows the list as you type. The written description says each page keeps looking at the same details it already searches today, and it also says the list of those details is still to come from engineering - so right now nobody has written down what each page's search box actually looks at (on Work Orders, for example: the order number? the customer name? the unit number?). Until that list exists we cannot write or run a test that proves the search box looks at the right details - we can only check that typing narrows the list.

**The question:** Please have that list written down per page and shared with us - or tell us to accept "whatever each page's search finds today" as correct.

**Options:**

- A) The list of searchable details will be written down and shared (please say roughly when).
- B) Accept whatever each page's search finds today - we will only test that typing narrows the list, not which details it matches.

**Your answer:** ____________________

## Question 6 — Your latest written description (a request, not a choice)

**What happens now:** We now have your latest written description of the filters (version 1.6, updated 28 July) and we are bringing all the tests in line with it. Our earlier copy was the very first version, so for a while we were testing against out-of-date wording without knowing it.

**The question:** Please confirm version 1.6 is the current one, and let us know each time you change it, so we can re-check the tests straight away.

**Options:**

- A) Yes - version 1.6 is current, and I will let you know whenever I update it.
- B) There is something newer than version 1.6 (please share it).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

**STATUS 2026-07-31 (QA-internal).** This sheet is a **REVISION** of the 2026-07-30 version,
re-checked against the **current Filters spec v1.6** (Confluence page 572030978, Confluence
version 12, body version 1.6, updated 2026-07-28 by Branko Cicovic — pulled live
2026-07-31, verbatim body in `spec-current-2026-07-31/Filters-spec-current.md`). **It
supersedes the 2026-07-30 version, which was NOT sent.** Changes: **3 questions withdrawn**
(already answered by spec v1.4/v1.5, see the withdrawal table below), **2 questions added**
(sorting scope; the `S13-R23` searchable-field list), reader-facing questions **renumbered
1–6**, and old Q6 (the spec-export request) reframed into a confirm-current + notify-us ask
because we obtained v1.6 ourselves via Confluence on 2026-07-31. Sources:
`ahtesham-review-2026-07-31/VERIFICATION.md`, `spec-current-2026-07-31/SPEC-DIFF.md`,
`design-2026-07-31/DESIGN-NOTES.md` §5.1.

TestRail C-ids are from the project's `testrail-id-map.csv` (Standing Rule 8). Links: https://shopview.testrail.io/index.php?/cases/view/<id>

| Q# | Affected internal case IDs (TestRail C-id) | Source refs | What each answer resolves to |
|---|---|---|---|
| 1 | FLT-MOB-04 (C29624); FLT-MOB-02 (C29622); FLT-MOB-03 (C29623) | Source: tech-plan-2026-07-29/Questions-for-Branko-dev.md Q4 = TECH-PLAN-DELTAS conflict C4 (tech plan D15: single-filter bottom sheets apply in real time, no Apply button; the design pictures 11884:21065/21271 show 'Apply filter' in the single-filter sheet). Spec S12-R2 (unchanged since V1.0) says mobile behaves identically to desktop, and desktop S2-R6 is real-time. Independently re-raised by Ahtesham 2026-07-31 (VERIFICATION.md CONFLICT 2). | A -> reword FLT-MOB-04 to instant-apply, no button. B -> case stands as designed (Apply button). Either way FLT-MOB-02/03 keep the combined-sheet Apply button (design 11884:13689 + D15 = IN) and all three get the same 'confirm live which pattern ships' note (FIX-PLAN F2). Verify LIVE at VIU. |
| 2 | FLT-TAB-06 (C38876) | Source: Questions-for-Branko-dev.md Q5 = conflict C5 (tech plan D10: first-visit default tab = Estimates for load reasons; not in the spec — still absent in v1.6). | A -> FLT-TAB-06 stands as pushed (Estimates-first + last-tab-remembered). B -> reword to All-first; engineering discussion needed first. |
| 3 | no case exists (FLT-PARTS-08 was proposed 2026-07-30 and is NOT in the current id-map — the Parts area was consolidated on 2026-07-31 to FLT-PARTS-01/09/11/12, all still blank C-ids) | Source: Questions-for-Branko-dev.md Q6 = conflict C7 (spec lists a Parts Vendors view for filters; no design exists; engineering will not build until a design lands - they requested it). | A -> author the Vendors filter case(s) once the design arrives. B -> mark Vendors filters out of scope; no case. |
| 4 | **NEW AREA — no cases exist at all** (no FLT-SORT area; zero sorting cases in the 110-case active suite) | Source: design-2026-07-31/DESIGN-NOTES.md §5.1 — Figma section "Sorting (Work In Progress)", boards 11985:9686 / 11985:10428 / 11985:11259 / 11985:13334 (Sort dropdown = field box [Status, WO Number] + direction box [Ascending] + "Add Sort" + "Delete sort"; step 4 shows TWO stacked sort rows = multi-level). Sort button also on final mobile boards 11884:20807 / 11884:15901 / 12867:12201 and on the Reports Notes + Reminders boards. Spec v1.6 mentions sorting ONCE, in passing, at S13-R14 ("The search query … survives sorting, pagination…") — there is NO sorting requirement anywhere in the spec. **4 of the 4 sorting boards are still un-rendered** (Figma image endpoint rate-limited; Rule 35 queue `design-2026-07-31/PENDING-FIGMA-FETCH.md` still OPEN) — the panel is described from its own text/layer names, not from a picture. | A -> author a new FLT-SORT area (single-level + multi-level add/remove + direction + mobile sort button + the 2 Reports surfaces) AFTER Branko adds sorting to the spec; needs add_case authorization. B -> author single-level only; no "Add Sort" case. C -> no cases; record sorting as out of scope in PROJECT-STATE + coverage-matrix so the design boards are never mistaken for scope. Do NOT author before the answer (Rule 1: designs marked Work In Progress are not a spec). |
| 5 | FLT-PSRCH-01 (C38883); FLT-PSRCH-06 (C38891); plus the ~20 un-authored Story-13 cases | Source: spec v1.6 `S13-R23`, verbatim: *"Each table searches the fields its existing search endpoint already covers today… **Pending: the per-table list of fields currently covered, from engineering. Until it exists the searchable set is undocumented and QA has no baseline to test against**… Five of the surfaces listed under S14-R6 (Customer Contacts, Customer Assets, Customer Fees & Discounts, Administration Locations, Administration Fees & Discounts) narrow rows already loaded in the browser rather than querying an endpoint…"* Confirmed STILL OPEN in v1.6 (spec-current file line 563; SPEC-DIFF §4b Group C; VERIFICATION "Blocked by the spec itself"). | A -> on receipt of the field list, author per-page search-field cases (currently un-authorable). B -> keep coverage at "typing narrows the list" only (FLT-PSRCH-01/06) and record in the coverage-matrix that per-field matching is deliberately untested by PO ruling. Either way the ~20 remaining Story-13 gaps (component states, 300ms/350ms debounce, tab scoping, retention, mobile mechanics, negatives) are NOT blocked by this and still need authoring authorization. |
| 6 | whole suite (110 active authored; 94 live in TestRail, 16 blank C-ids) | Source: Questions-for-Branko-dev.md Q7 = conflict C9 (spec drift). **Now largely self-resolved:** we pulled v1.6 live from Confluence 2026-07-31 (page 572030978, Confluence v12) instead of waiting for an export — 8 Confluence versions / 5 spec minor versions behind, 49 requirements added, 0 removed, 4 changed (SPEC-DIFF §1/§2). Remaining ask = confirm-current + notify-on-change (Standing Rule 23 re-pull is now the standing habit). | A -> proceed with the v1.6 reconciliation already in flight (re-ingest requirements.md, FIX-PLAN F1–F7, then the ~28 new-case authoring pass, then run 352 refresh). B -> re-pull the newer version first and re-diff before any push. |

### WITHDRAWN — answered by spec v1.6 (NOT asked; kept here for the record)

Verbatim spec text pulled live 2026-07-31 from Confluence page 572030978 (Confluence
version 12 = body version **1.6**), file `spec-current-2026-07-31/Filters-spec-current.md`.
These three were in the **2026-07-30** version of this sheet (as Q1, Q2, and the naming
question inside Q1). **None was ever sent to Branko** — the sheet was not sent.

| Withdrawn item | Was | Answered by | Verbatim spec text that answers it | Effective answer | Downstream action |
|---|---|---|---|---|---|
| **W1 — Opening someone else's filtered link: temporary view, or does it replace my saved filters?** | **Q1** of the 2026-07-30 sheet (= Questions-for-Branko-dev.md Q2 / deltas C1) | **`S11-R6`**, added in spec **v1.4** (Confluence v9, 2026-07-27) | *"Filter state arriving from a URL applies at runtime only. It never overwrites the user's saved filter state (S10-R2). Changes the user makes to filters while viewing a shared link are also not written back to their saved state: the entire visit is treated as a temporary view"* | **Option A** — runtime-only, saved filters untouched, and changes made during the visit are not written back either | FLT-URL-05 (C38879) already tests this clause-by-clause; only its `refs`/`spec_ref` are stale (they still say *"spec v1.3 export awaited"*). Re-point to `S11-R6` — FIX-PLAN **F4**. |
| **W2 — Should picking "Imported" work alone and grey out the other filters?** | **Q2** of the 2026-07-30 sheet (= Questions-for-Branko-dev.md Q3 / deltas C2) | **`S2-R7`** + **`S2-N4`**, added in spec **v1.4** (Confluence v9, 2026-07-27) | `S2-R7`: *"Imported is an exception to S2-R2 and cannot be combined with anything else. Imported work orders come from a different data source rather than being a status of the existing records, so selecting Imported switches the list to the imported records and disables the other filter chips while it is active. Deselecting Imported returns the list and re-enables the other chips. This is current production behaviour and is unchanged by this work"* · `S2-N4`: *"Selecting Imported alongside another status, customer, technician, advisor or asset filter is not a supported combination and is prevented by S2-R7 rather than returning an empty result"* | **Option A** — Imported works alone; the other chips are disabled while it is active; deselecting re-enables them | FLT-STAT-07 (C38877) already covers `S2-R7` + `S2-N4` fully; only its `refs`/`spec_ref` + its "PENDING BRANKO" note are stale. FIX-PLAN **F3**. |
| **W3 — What is the "back to my saved filters" control actually called?** | the naming question **inside Q1** of the 2026-07-30 sheet (Q1 text: *"a small 'back to my saved filters' option"*) | **`S11-R7`**, CTA renamed in spec **v1.5** (Confluence v10, 2026-07-27) | *"While viewing filter state that arrived from a URL, a \"Back to my view\" action is available. It discards the shared view and restores the user's own saved filters. It also clears any active search query, because the query is not part of saved state and there is nothing to restore it to. The label is deliberately \"my view\" rather than \"my filters\", since the action affects both filters and search"* | **Ratified label = "Back to my view"** (not "back to my saved filters") | Use the ratified label in FLT-URL-05 (C38879) per Rule 9, and add the untested *"it also clears any active search query"* clause — FIX-PLAN **F5**; the negative `S11-N3` ("not shown when viewing your own state") still needs a NEW case — FIX-PLAN **F6**. |

### Already resolved — NOT asked here (for QA reference)

- **Status chip on Estimates/Completed tabs (source Q1 of Questions-for-Branko-dev.md / delta C3)** — RESOLVED by user ruling 2026-07-30: the tech plan's "hidden" and Branko's earlier "greyed-out/disabled" describe the SAME behavior. FLT-TAB-02 (C29609) and FLT-TAB-03 (C29610) stand as pushed — no case change, no TestRail write. **Note (2026-07-31):** spec v1.6 still says "hidden"/"not shown" in `S9-R2`, `S9-R3`, `S2-N1`, `S2-N2`, `S1-N1` and §4 Key Decisions — text unchanged since V1.0. That is a PRD-alignment ask for Branko (FIX-PLAN **B1**), deliberately NOT added to this sheet, and it does not reopen the ruling.
- **The 9 page-search "spotlight/palette" cases FLT-SRCH-01..09** (no C-ids; none in TestRail) — ownership question already put to Branko as **Question 6 of `PO-Questions-Branko-PartsReports-2026-07-27.md`** ("The pop-up search box"); not duplicated here. Per user ruling 2026-07-31 they are **not to be deleted** unless Branko confirms they belong to Global Search only. SPEC-DIFF §4 Group D is strong new evidence they are Global Search v2, not Filters Story 13.

Verify the C-ids in the table above against `build/filters/testrail-id-map.csv` before quoting them onward.
