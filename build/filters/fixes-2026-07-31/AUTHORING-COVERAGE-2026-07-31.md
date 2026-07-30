# Filters — v1.6 gap authoring: what was authored, and why that number

**Date 2026-07-31.** Spec baseline: **v1.6** — Confluence page **572030978**, version
**12**, updated **2026-07-28** by Branko Cicovic
(`build/filters/spec-current-2026-07-31/Filters-spec-current.md`), diff in
`SPEC-DIFF.md` (49 added / 0 removed / 4 changed).

**Live-build status (Standing Rules 12/22):** no Filters QA branch/environment exists
yet (OQ-3). **Nothing here is live-verified** — every new and edited case is
`VIU-Pending`, and every on-screen label taken from the spec is marked
**(VIU-confirm)** in the case body or note. Wording came from the **spec text only**;
per **Standing Rule 35** twelve Figma boards (including the page-search component
`11829:8908` and the mobile `Search Filled` `12867:12201`) still have no PNG, so
**nothing was authored from a design image**.

---

## 1. The honest number: **8 new cases, not ~25**

The brief allowed for roughly 25 new cases. **8 were authored** (7 in this phase + the
1 named in FIX-PLAN F6), because the ~25 *uncovered requirements* collapse into far
fewer **distinct observable behaviours** once Rule 28 dimension 1 is applied — and 6
existing cases were **extended** instead of being duplicated (the brief's
"extend/merge rather than duplicate").

| | Count |
|---|---|
| Uncovered v1.6 requirements addressed | **26** |
| **New cases authored** | **8** |
| Existing cases **extended/corrected** instead of duplicated | **6** |
| Requirements deliberately **NOT** given a case (with reason) | **4** |
| Requirements **blocked on the spec itself** | **1** (`S13-R23`) |
| Padding added to reach a target number | **0** |

Deliberately **not** padded: no per-state split of the component look (one walk-through
instead of four presence cases), no per-page repetition of the same search behaviour,
no separate hover case, no sort-direction or per-column variants, and no case for an
umbrella "behaves the same everywhere" clause.

---

## 2. New cases (8)

| Internal ID | TestRail | Section | Requirements covered | Why it is a distinct behaviour |
|---|---|---|---|---|
| **FLT-URL-06** | *new, no C-ID yet* | URL State and Shareable Links | `S11-N3`, `S11-R7` | Presence/absence contract with a round trip: the "Back to my view" control must NOT exist on a normal visit. Leaking it lets a user wipe their own saved filters by accident. |
| **FLT-PSRCH-08** | *new, no C-ID yet* | Page Search Toolbar | `S13-R2`, `S13-R3`, `S13-R4`, `S13-R5`, `S13-R6`, `S13-R8` | One continuous interaction (default → hover → expand in place → typed → long text). Failure = a toolbar that reflows or a field that truncates. Kept as ONE case on purpose: four separate "state is present" cases would be the audit's named slop pattern. |
| **FLT-PSRCH-09** | *new, no C-ID yet* | Page Search Toolbar | `S13-R7`, `S13-R12` | The apply contract: narrows shortly after you stop typing, **no Apply/Submit button, Enter not required**, results replace the table in place, Inventory waits slightly longer. Real failure modes: Enter required, or a request per keystroke. |
| **FLT-PSRCH-10** | *new, no C-ID yet* | Page Search Toolbar | `S13-R11`, `S13-R24` (Work Orders half) | Work Orders tabs **share one** query and it applies to the active tab only. |
| **FLT-PSRCH-11** | *new, no C-ID yet* | Page Search Toolbar | `S13-R24` (Reports/Parts half), `S13-R11`, `S10-R4` | Reports tabs and Parts views each keep their **own** query — the deliberately **opposite** expectation to FLT-PSRCH-10. A shared query here would apply text to a table with different columns. |
| **FLT-PSRCH-12** | *new, no C-ID yet* | Page Search Toolbar | `S14-R3`, `S14-R2`, `S14-R1` | Leftover global-search state arriving from an old link/bookmark must no longer narrow a list. Distinct from live typing in the global search (already covered). |
| **FLT-PSRCH-13** | *new, no C-ID yet* | Page Search Toolbar | `S13-E1`, §4 Key Decisions | Collapsing the filter bar must not cancel the query or hide the search control (they live in different rows). The search twin of FLT-COLL-05 = C29605. |
| **FLT-EMPTY-03** | *new, no C-ID yet* | Empty State | `S8-R3`, `S8-R4`, `S8-R5`, `S13-N1`, `S13-N2` | The **reworded** v1.6 empty state: the message names filters **and** search, and each is cleared independently from the empty state. FLT-EMPTY-01 = C29606 / FLT-EMPTY-02 = C29607 stay valid for filters-only. |

**S13-E1 note:** this ratified **Edge Case** is not listed in `SPEC-DIFF.md` §3 (the diff
counted `R`- and `N`-numbered items only). It is a genuine uncovered requirement and is
now covered by FLT-PSRCH-13.

**No new API-section case was needed** (Standing Rule 4): nothing authored this pass
carries an endpoint, HTTP verb or status code. `S14-R2`'s "removed, not left dormant" is
a code-level assertion — recorded as a note, not dressed up as a testable step.

---

## 3. Existing cases extended or corrected (6) — instead of new near-duplicates

| Internal ID | TestRail | What changed | Requirements now covered |
|---|---|---|---|
| **FLT-PSRCH-03** | **C38886** | **Content correction.** The case said the search text is saved per user account "just like the filters" (a 2026-07-29 tech-plan reading). `S13-R25` ratifies the **opposite**. Retitled and rewritten as the query-lifetime case: survives sorting/paging/navigating away, **each browser tab independent**, never saved, gone after the tab session. | `S13-R14`, `S13-R25`, `S13-N4`, `S10-R5` |
| **FLT-PSRCH-05** | **C38889** | Extended with expected 4 (`S13-R17` — the field **fills** the remaining row width, 162px on Work Orders vs the fixed 180px desktop; nothing hidden while searching) and expected 5 (`S13-R20` — no mobile-only active-query indicator), plus one step. | `S13-R16`–`R20`, `S12-R5` |
| **FLT-PSRCH-06** | **C38891** | Extended from "a few examples" to the ratified **`S14-R6` audit sweep** — the 42 surfaces / 39 components grouped by module with their web addresses, the naming trap (locate by URL), the Work Order Parts exclusion, and dialog tables. | `S14-R6`, `S14-R5`, `S13-R22`, `S14-N1` |
| **FLT-PSRCH-01** | **C38883** | Refs re-pointed to ratified anchors; the placeholder wording made build-accurate; the **superseded 750ms Inventory figure removed** (v1.6 = 300ms / Inventory 350ms). | `S13-R1`, `S13-R9`, `S13-R12`, `S13-R15` |
| **FLT-PSRCH-02** | **C38884** | Refs re-pointed; the "S8-R5 text awaited" note replaced with the resolution — expected 3 as written is ratified. | `S13-R10`, `S13-R13`, `S8-R5` |
| **FLT-PSRCH-04** | **C38888** | Refs re-pointed; the "engineering intent, pending" note replaced by `S11-R8`'s ratified rationale. | `S11-R4`, `S11-R5`, `S11-N2`, `S11-R8` |
| **FLT-PSRCH-07** | **C38893** | Refs re-pointed to Story 14 anchors; the code-level half of `S14-R2` recorded as a note rather than a step. | `S14-R1`, `S14-R2`, `S14-R4`, `S14-R5` |

*(Seven rows — FLT-PSRCH-01/02/04/07 are the FIX-PLAN **F7** refs sweep, pre-specified
there; FLT-PSRCH-03/05/06 are content changes. All were pre-backed-up.)*

---

## 4. Requirements deliberately given NO case (Rule 28 dimension 1 — CUT, with reason)

| Req | Why no case |
|---|---|
| `S11-R8` | Rationale/derivation clause ("the query has no saved value to overwrite"), not independently observable. Cited as rationale in FLT-PSRCH-04 = C38888 refs. |
| `S13-R21` | Umbrella "all query behaviour is identical across breakpoints". Satisfied by running the mobile case (FLT-PSRCH-05 = C38889) plus the desktop cases. A case of its own would be spec-parroting. |
| `S13-N3` | An explicit **out-of-scope statement** (hover-on-expanded, disabled and loading states are not defined for this release). Recorded as a guard note in FLT-PSRCH-08 so nobody tests or bug-reports them. |
| `S14-N1` | A rollout/sequencing rule (page search must ship before global-search filtering is removed). Recorded as a run-ordering note on FLT-PSRCH-06 and FLT-PSRCH-07, not a testable behaviour. |

---

## 5. Blocked on the spec itself — flag, do not invent

**`S13-R23`** verbatim: *"Each table searches the fields its existing search endpoint
already covers today… **Pending:** the per-table list of fields currently covered, from
engineering. **Until it exists the searchable set is undocumented and QA has no baseline
to test against**."* Five surfaces (Customer Contacts, Customer Assets, Customer Fees &
Discounts, Administration Locations, Administration Fees & Discounts) narrow rows
already loaded in the browser, with **no documented field set at all**.

**Consequence:** per-page *"searching X finds Y"* cases **cannot be authored** and were
NOT invented. FLT-PSRCH-06 = C38891 deliberately asserts only that each table **has** a
working search box, never **which fields** it matches.

**Items to carry to Branko / the spec watch list** (the question sheet is owned by
another worker — reported, not written here):

1. **`S13-R23`** — chase engineering for the per-table searchable-field list, or rule
   that "whatever it matches today is accepted as-is" (incl. the 5 client-side surfaces).
2. **`S9-R2`/`S9-R3`/`S2-N1`/`S2-N2`/`S1-N1`/§4** — the PRD still says the Status chip is
   "hidden" on Estimates/Completed, eight versions after Branko's own Q4 = B answer. Our
   suite is now uniformly on the ruling; the PRD needs to catch up (FIX-PLAN item B1).
3. **Story 12 vs the mobile "All Filters" sheet + "Apply filters" button** — design and
   tech plan include it, `S12-R2` says mobile is identical to desktop (FIX-PLAN B2/B3).
4. **`FLT-TAB-06` = C38876** — the Estimates-first-visit default tab appears **nowhere**
   in v1.6; still engineering-only (tech plan D10). Its pending flag was left in place.
5. **The 9 `FLT-SRCH-*` cases** — v1.6 Story 13 describes an in-toolbar field, not a
   spotlight palette; strong evidence they belong to Global Search v2. **Held** per the
   user ruling of 2026-07-31 until Branko confirms ownership. Untouched this pass.
6. **Sorting** — held pending Branko per the user ruling; no sorting case authored
   (the four Figma "Sorting (Work In Progress)" boards also still lack PNGs).
