# Filters — Ruthless Usefulness Audit of All 137 Test Cases — 2026-07-31

**The mandatory three-dimension quality gate (Standing Rule 28), run on the FULL Filters suite.**
Companions in this folder: `per-case-verdicts.csv` (one row per case, both verdict sets +
Dimension-3 columns, regenerate via `gen_verdicts.py`) and `MERGE-PLAN.md` (approvable
per-group, via `gen_merge_plan.py`).

**Status: RECOMMENDATION ONLY.** No TestRail writes, no case-JSON edits, no run touched
(Standing Rule 6). Nothing changes until the user approves — wholesale or per-group.

## Method

Per `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md`: 100% of the suite scored, no sampling
(Rule 17), on all three dimensions together —
1. **USEFUL** — KEEP / MERGE (named group + survivor) / WEAK-KEEP / CUT; the 7 named slop
   patterns hunted across the whole suite; load-bearing coverage credited.
2. **MAKES SENSE** — every case's full body read COLD, as the critic would; the 6 fail
   conditions applied; every NONSENSE quotes the offending text; the KEEP-but-NONSENSE
   embarrassment cross-check run (automated in `gen_verdicts.py`).
3. **GENUINE + LAYMAN-RUNNABLE** — Rule-20 traceability (spec/design/tech-plan anchor +
   ticket-or-TBD) and Rules 7/9 plain executable wording; title-length bar (≤80) checked.

**Scope / counts (Rule 17):** total 137 authored cases / scored 137 / excluded 0.
94 live in TestRail (C29557–C29635 + C38876–C38895, group 4110) + 43 design-level with
blank C-ids (Parts 12, Reports 22, Command-K 9 — pending Branko's PRD / Q6).
**Snapshot SHA:** case bodies read from `build/filters/cases/*.json` at git
`7eeb74548eae665f5ac5110512fddc0c8550db41` (tree clean for `build/filters`).

**Honesty notes (Rules 12/22/23):** this is a DESK audit of case text vs the ingested
spec v1.0 + Branko's rulings (2026-07-17 / round-2 2026-07-20) + the 2026-07-29 tech plan.
The Confluence spec has moved to v1.3 and its export is still awaited — CUT/spec verdicts
were therefore based only on rulings we hold verbatim; nothing was cut as "PO-descoped".
No live-build check was run this pass — build-dependent judgements (e.g. "the five
dropdowns are one shared component") derive from the design set + tech plan and are
labelled recommendations, **not live-verified this run**. Audit verdicts are judgements
about case text — they are not evidence any behaviour works (that is VIU's job).

## Headline numbers

| | |
|---|---|
| **Dimension 1 (USEFUL)** | **KEEP 71** (incl. the 14 merge survivors) / **MERGE 52** (members, into 14 groups) / **WEAK-KEEP 3** / **CUT 11** |
| **Headline** | **137 today → 74 recommended** (71 KEEP + 3 WEAK-KEEP) — identical behavioural coverage |
| **Dimension 2 (SENSE)** | **SENSIBLE 124 / FIX-WORDING 12 / NONSENSE 1** |
| **KEEP-but-NONSENSE** | **EMPTY** — the one NONSENSE case (FLT-SRCH-09) is already a CUT |
| **Dimension 3** | **Missing-traceability: 0 of 137** (every case carries a spec/design/tech-plan anchor). Suite-wide gap: Jira ticket refs are all "Epic key TBD" (the epic key is a known open question — stated, never invented; backfill obligation when it arrives, per the Schedule SV-8685 precedent). **39 titles exceed the ≤80 bar** (pre-date the 2026-07-27 rule; fix on next authorized touch — list below). Layman wording: pass suite-wide; API content only in the 'API'-titled section (Rule 4). |

## Per-area verdict + sense tables

| Area | Cases | KEEP | MERGE | WEAK-KEEP | CUT | SENSIBLE | FIX-WORDING | NONSENSE |
|---|---|---|---|---|---|---|---|---|
| Filter Bar Layout and Visibility | 3 | 2 | 0 | 0 | 1 | 2 | 1 | 0 |
| Status Filter | 7 | 5 | 2 | 0 | 0 | 7 | 0 | 0 |
| Collapse and Expand | 5 | 3 | 1 | 0 | 1 | 5 | 0 | 0 |
| Customer Filter | 9 | 6 | 3 | 0 | 0 | 9 | 0 | 0 |
| Lead Technician Filter | 7 | 2 | 5 | 0 | 0 | 7 | 0 | 0 |
| Service Advisor Filter | 7 | 1 | 6 | 0 | 0 | 7 | 0 | 0 |
| Asset on Site Filter | 7 | 4 | 3 | 0 | 0 | 6 | 1 | 0 |
| Active Filter Chips and Clear Filters | 6 | 6 | 0 | 0 | 0 | 6 | 0 | 0 |
| Empty State | 2 | 2 | 0 | 0 | 0 | 2 | 0 | 0 |
| Tab Behaviour | 6 | 4 | 2 | 0 | 0 | 6 | 0 | 0 |
| Persistence | 6 | 6 | 0 | 0 | 0 | 6 | 0 | 0 |
| URL State and Shareable Links | 5 | 4 | 1 | 0 | 0 | 5 | 0 | 0 |
| Mobile Filters | 10 | 6 | 2 | 2 | 0 | 10 | 0 | 0 |
| API — Work Orders List Filtering | 6 | 5 | 0 | 1 | 0 | 6 | 0 | 0 |
| Parts Page Filters | 12 | 4 | 8 | 0 | 0 | 12 | 0 | 0 |
| Reports Page Filters | 23 | 4 | 19 | 0 | 0 | 13 | 10 | 0 |
| Page Search (Command-K) | 9 | 0 | 0 | 0 | 9 | 8 | 0 | 1 |
| Page Search Toolbar | 7 | 7 | 0 | 0 | 0 | 7 | 0 | 0 |
| **TOTAL** | **137** | **71** | **52** | **3** | **11** | **124** | **12** | **1** |

## The full NONSENSE list (Dimension 2 — quoted)

1. **FLT-SRCH-09** (new, no C-ID yet — design-level pending queue) — *"Page search scope
   belongs to Filters or Global Search (to decide)"*. Fails **F6 (not actionable) / F1 (not
   executable)**: step 1 reads *"Review where the page search / Command-K component is owned
   for testing"* and expected 1 reads *"The page-search component is agreed to belong to
   either the Filters test suite or the Global Search test suite, not both"*. A manual
   tester cannot execute an ownership agreement — this is a QA/PO scope decision (it already
   lives in the Branko question sheet, Q6), deliberately authored as a forcing-function
   placeholder, but on a cold read it is not a test. **Recommendation: CUT** (keep the
   decision in the PO sheet, where it already is).

**KEEP-but-NONSENSE embarrassment check: EMPTY.** The one NONSENSE case is already a CUT
(asserted automatically by `gen_verdicts.py`).

## The FIX-WORDING list (Dimension 2 — exact repairs)

| Case | C-id | Exact fix |
|---|---|---|
| FLT-BAR-02 | C29558 (https://shopview.testrail.io/index.php?/cases/view/29558) | Pin the tab: the default landing tab is Estimates (FLT-TAB-06) where the Status chip renders greyed/pre-filled, so "five chips each with icon, name and arrow" only reads cleanly on the All tab — add "You are on the All tab" to the preconditions. |
| FLT-ASSET-02 | C29590 (https://shopview.testrail.io/index.php?/cases/view/29590) | Expected 3 (the "No" direction) is broader than the steps drive (steps only choose Yes) and is FLT-ASSET-07's (C38878) subject — drop expected 3. |
| FLT-RPTS-21 | new, no C-ID yet | Expected 1 says "the report updates to show only the rows matching the chosen filter value" but the steps never choose a value — insert a select-a-value step (mirror FLT-PARTS-11 step 2) and fix the grammar "go to the any (for example Sales) report". |
| FLT-RPTS-04 | new, no C-ID yet | Expected claims the chips appear "on both the Invoiced and Completed tabs" but no step switches tabs — add a step to open each tab. |
| FLT-RPTS-20 | new, no C-ID yet | Same class: add "switch between the Customers, Vendors and Journal Entries tabs". |
| FLT-RPTS-09 / 11 / 12 / 13 / 14 / 15 / 16 | new, no C-ID yet (×7) | The expected list numbering repeats "2." (the trailing design-placeholder note reuses the number) — renumber. |

Ten of the 12 are in the design-level pending set (no C-id) and 9 of those sit inside
merge group MG15 — approving that merge repairs them for free (the survivor's checklist
is renumbered and gains the switch-tab steps). FLT-BAR-02 and FLT-ASSET-02 are live
cases; their fixes wait for the next authorized touch.

## Named slop patterns found (the prosecution)

1. **Near-duplicates across areas (pattern #1) — the biggest, 19 cases (14 absorbed into 5 survivors).** The five filter
   dropdowns share one component, yet its micro-behaviours were re-authored per chip:
   dropdown-open ×3 (MG5), type-ahead ×3 (MG6), per-dropdown Clear selection ×6 (MG1),
   click-outside ×5 (MG2), deactivated-staff ×2 (MG8). One survivor each with a
   per-dropdown repeat table carries identical coverage.
2. **Per-page presence matrix (pattern #3, display filler variant) — 29 cases (27 absorbed into 2 survivors).** Parts
   authored 9 near-identical "page X shows filter buttons A, B, C (+ the table's columns +
   the New button)" cases and Reports authored 20 more. The chip lists are real design
   content; the packaging is one checklist walk per area (MG14, MG15) — and the column/New-
   button assertions are filler outside the Filters scope, demoted to reference notes.
3. **Empty-state multiplication (pattern #5) — 4 cases.** The same filtered empty state on
   the same table was authored once per chip (Status/Technician/Advisor/Asset) on top of the
   canonical FLT-EMPTY-01 (MG3). (FLT-CUST-09 stays — its real subject is the S3-E1
   list-inclusion rule; FLT-MOB-10 stays WEAK-KEEP — different surface.)
4. **Cross-project duplicate block — 9 cases.** FLT-SRCH-01..09 re-author the spotlight/
   Command-K component that the Global Search project already covers with 86 authored cases
   — and engineering (tech plan headline 5) says that component isn't even part of the
   Filters programme (the Filters programme ships the toolbar search, which FLT-PSRCH-01..07
   covers properly). CUT recommended; **the ownership ruling is Branko's (Q6) — this audit
   flags, the PO decides.**
5. **Two-halves-of-one-interaction splits — 5 cases.** Collapse/expand as two cases (MG4),
   URL write/read as two (MG12), tag-select/tag-remove as two (MG7), the Estimates/Completed
   pre-filtered-tab mirror pair (MG11), All-tab composition re-asserted twice (MG10) — plus
   2 outright in-suite duplicates cut (FLT-BAR-03 ⊂ FLT-TAB-02; FLT-COLL-03 ⊂ FLT-PERS-01).

## Load-bearing coverage credited (the defence)

- **Filter data-semantics contracts** (wrong-results bugs a customer sees): OR-within
  (FLT-STAT-03 C29562), AND-across (FLT-CHIP-06 C29600), customer-ACCOUNT field
  (FLT-CUST-05 C29570), lead-only matching (FLT-TECH-03 C29577), the new "No" backend path
  (FLT-ASSET-07 C38878), Imported exclusivity (FLT-STAT-07 C38877), and their backend halves
  (FLT-API-01/02 C29631/C29632).
- **Persistence family** — per-account permanent persistence (FLT-PERS-02 C29614), per-user
  isolation (FLT-PERS-03 C29615), per-view/per-tab scoping (FLT-PERS-05 C38880), and the
  release-critical one-time migration (FLT-PERS-06 C38881) plus the saved-prefs service
  contract incl. cross-user isolation (FLT-API-06 C38895).
- **URL/share contracts** — link applies filters (FLT-URL-02 C29618), view-only never
  overwrites saved state (FLT-URL-05 C38879), malformed/deleted-value hardening
  (FLT-URL-03/04, FLT-API-03/04).
- **The Page Search Toolbar set** (FLT-PSRCH-01..07, C38883–C38893) — the genuinely in-scope
  search component incl. the Story-14 "no list silently loses its search" sweep and the
  nav-search decoupling.
- **Genuine + layman confirmation (Dimension 3):** 0 of 137 cases lack a source anchor;
  wording is plain, numbered, build-label-based with unconfirmable labels explicitly
  flagged, and every unpinned behaviour carries the honest "pending Branko's product
  write-up / check live" hedge rather than an invented assertion.

## Is the critic right?

Straight numbers, both halves of the claim:

- **Waste:** genuinely useless coverage — the CUT bucket — is **11 of 137 = 8%** (2 in-suite
  duplicates + the 9-case Command-K block that belongs to another project's suite). A further
  **52 cases (38%) are real coverage in over-granular packaging** (MERGE — no behaviour is
  lost, the checks move into 14 survivors), and 3 (2%) are legitimate-but-low-value
  WEAK-KEEPs. So the honest recommended count is **137 → 74**. The "70%+ useless" number
  does NOT hold — behavioural coverage that would be deleted outright is 8%, not 70% —
  but the packaging criticism has real teeth here: the per-chip micro-behaviour mirrors and
  the 27-case Parts/Reports presence matrix are exactly the pattern a critic would screenshot,
  and this audit consolidates 46% of the suite's rows because of it.
- **Makes-no-sense:** **1 of 137 = 0.7%** is NONSENSE on a cold read (FLT-SRCH-09, a scope
  decision dressed as a case — already a CUT), and 12 (9%) need small named wording repairs
  (10 of them vanish inside one merge). **124 of 137 (91%) pass a cold read outright**, and
  no case a tester would actually keep fails one.
- Where the criticism does not hold at all: the semantics/persistence/URL/API/toolbar-search
  families above are load-bearing — failures there are customer-visible wrong-results, lost
  saved state, or a cross-user leak.

## Plain-words exec paragraph (Rule 7 — forwardable as-is)

We put every one of the 137 filter test cases through our three-part quality gate: is it
useful, does it read sensibly to a fresh tester, and can it be traced back to the product
requirements. The result: none of the real behaviour coverage is wasted — only 11 cases
(8%) should be removed outright, and 9 of those simply belong to a different project's
test suite that already covers the same screen. What we did find is over-splitting: the
same small behaviour was often written once per filter or once per page, so we recommend
folding 52 of those rows into 14 combined cases — the checks all stay, testers just run
them in one sitting instead of twenty. After that consolidation the suite is 74 strong,
focused cases. On readability, 136 of 137 read cleanly to a cold reader; one placeholder
was a decision note rather than a test and will be removed, and a dozen small wording
fixes are listed with exact corrections. Every case is traceable to the requirement or
design it tests. Nothing has been changed yet — this is a recommendation awaiting
approval, group by group.

## Deliverables in this folder

- `USEFULNESS-AUDIT-2026-07-31.md` — this report (sense-check inline).
- `per-case-verdicts.csv` — all 137 rows, both verdict sets + Dimension-3 columns
  (`refs_ok`, `title_len`); regenerate deterministically via `gen_verdicts.py` (which also
  asserts tally reconciliation + the empty KEEP-but-NONSENSE list).
- `MERGE-PLAN.md` — the 14 groups + 11 cuts + 3 weak-keeps, approvable per-group, every
  case with its C-id/link or "new, no C-ID yet" (via `gen_merge_plan.py`).

## Appendix — the 39 title-length violators (Dimension 3; fix on next authorized touch)

Titles over the ≤80-char concise-title bar (all pre-date the 2026-07-27 rule; FLT-PERS-02
was already flagged in the 2026-07-30 push log): FLT-BAR-02 (87), FLT-BAR-03 (89),
FLT-STAT-01 (95), FLT-STAT-04 (82), FLT-COLL-01 (83), FLT-COLL-02 (90), FLT-COLL-03 (91),
FLT-COLL-04 (128), FLT-CUST-01 (92), FLT-CUST-03 (93), FLT-CUST-09 (94), FLT-TECH-01 (92),
FLT-ADV-01 (87), FLT-ASSET-01 (94), FLT-CHIP-01 (81), FLT-CHIP-02 (88), FLT-CHIP-03 (89),
FLT-CHIP-04 (83), FLT-CHIP-05 (90), FLT-CHIP-06 (87), FLT-EMPTY-01 (105), FLT-EMPTY-02 (93),
FLT-TAB-02 (179), FLT-TAB-03 (177), FLT-TAB-04 (92), FLT-TAB-05 (115), FLT-PERS-01 (91),
FLT-PERS-02 (151), FLT-PERS-04 (83), FLT-URL-02 (96), FLT-MOB-01 (105), FLT-MOB-02 (111),
FLT-MOB-03 (111), FLT-MOB-04 (103), FLT-MOB-05 (88), FLT-MOB-06 (92), FLT-API-02 (107),
FLT-API-03 (87), FLT-API-05 (83). (C-ids per case are in `per-case-verdicts.csv`.)
Titles will be shortened at the next authorized tester-facing touch — many of the worst
(FLT-TAB-02/03 at ~178) are merge survivors/members whose approved merge rewrites the
title anyway.
