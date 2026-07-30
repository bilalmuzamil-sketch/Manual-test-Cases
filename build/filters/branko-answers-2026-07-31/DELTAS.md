# Filters — CONSEQUENCES of Branko's Parts/Reports/page-search answers — 2026-07-31

**Companion to `answers-ingested.md` (his verbatim words) and `APPLY-PLAN.md` (the
executable change list). Nothing in here has been applied.**

| | |
|---|---|
| Answers ingested | 2026-07-31 (`answers-ingested.md`) |
| Checked against | **live spec v1.6** (`../spec-current-2026-07-31/Filters-spec-current.md`, Confluence page 572030978 version 12, updated 2026-07-28 by Branko Cicovic) + `SPEC-DIFF.md` + `../design-2026-07-31/DESIGN-NOTES.md` + `../ahtesham-review-2026-07-31/VERIFICATION.md` + `../tech-plan-2026-07-29/*` + `../quality-audit-2026-07-31/MERGE-PLAN.md` |
| Live-build check | **NOT RUN** — Filters is still not on a QA branch (Rules 12/22). Every verdict below is desk analysis; nothing may be marked VIU-Verified. |
| Case edits / id-map / import / TestRail | **ZERO, all four** |

**Classification key:** `APPLY-NOW` = his answer settles it, edit is ready to write ·
`NEEDS-NEW-CASE` = coverage that does not exist yet · `RETIRE-CANDIDATE` = case should
leave the suite (needs authorization) · `STILL-AMBIGUOUS` = stays a question (Rule
32(iii)) · `NO-CHANGE` = confirms what we already test.

---

## 0. Headline

| His answer | Classification | One-line consequence |
|---|---|---|
| **Q1** *(blank)* | **STILL-AMBIGUOUS** | No numbered Parts/Reports requirements exist; blocks clean Rule-20 spec anchors, blocks nothing else. |
| **Q2 = A** | **APPLY-NOW** (4 cases) | Drop the "which chips actually filter — pending Branko" hedge; every designed chip filters. |
| **Q3** free text | **APPLY-NOW** (3 cases) + **NEEDS-NEW-CASE** (1) | Option lists are data-driven → stop treating "no fixed list" as an open question; but his *parity* rule ("support all filters we have right now in the app") is a real, currently-untested regression guard. |
| **Q4** free text | **APPLY-NOW** (2 cases) + **STILL-AMBIGUOUS** | The mechanics (multi-select, data-driven choices, immediate apply) are settled by Q3+Q5+spec §4; the per-type option lists are still enumerated nowhere → flag **F1**. |
| **Q5 = A** + 2 exceptions | **APPLY-NOW** (3 cases) + **NO-CHANGE** (1) | Full WO parity confirmed; both exceptions already match spec v1.6 Key Decisions and are already covered by **FLT-PERS-05 = C38880** and **FLT-RPTS-23 = C38882**. |
| **Q6 = A** | **RETIRE-CANDIDATE** (9 cases) + **STILL-AMBIGUOUS** (1 clause) | **Global-Search ownership CONFIRMED** → the user's hold condition is met; but flag **F2** before anyone touches the 13 `FLT-PSRCH` cases. |
| **Q7 = A** | **APPLY-NOW** (7 cases, one line each) | Role-independence extends to Parts/Reports; delete the `permissions_required` "to confirm" hedge. |

**Size:** **11 case edits** (10 local-then-`add_case`, 1 `update_case` on a live case) +
**1 new case** + **9 retire-candidates** + **5 still-open questions**. Detail in
`APPLY-PLAN.md`.

---

## 1. VERDICT 1 — the 43 design-level Parts / Reports cases

**Question put to me:** *does he confirm Parts/Reports filters are in scope, and does his
answer let those cases be finalized and pushed? State exactly what changes.*

### 1a. First, the count is no longer 43 — say so plainly

The "43 design-level cases" phrase dates from 2026-07-27. The **user-authorized Ruthless
Usefulness Audit consolidation of 2026-07-31** has since retired 27 of them locally
(they had blank C-ids, so nothing was deleted in TestRail). Live inventory, read from
`../cases/*.json` this pass:

| Group | Authored | Retired (MG14/MG15) | **Active now** | In TestRail? |
|---|---|---|---|---|
| Parts (`FLT-PARTS-*`) | 12 | 8 (→ FLT-PARTS-01) | **4** — FLT-PARTS-01, -09, -11, -12 | none (blank C-ids) |
| Reports (`FLT-RPTS-*`) | 23 | 19 (→ FLT-RPTS-01) | **4** — FLT-RPTS-01, -21, -22, -23 | 1: **FLT-RPTS-23 = C38882** ([view](https://shopview.testrail.io/index.php?/cases/view/38882)) |
| Page search (`FLT-SRCH-*`) | 9 | 0 | **9** | none (blank C-ids) |

So the *Parts/Reports* half of the 43 is now **8 active cases, 7 of which have blank
C-ids and have never been pushed**. (The 9 `FLT-SRCH-*` are Verdict 2, below.)

> ⚠️ **The suite is moving under us.** A sibling worker is editing `../cases/**` in this
> same window and has already added `FLT-PSRCH-08 … FLT-PSRCH-13` (6 cases not in
> `../testrail-id-map.csv` yet). The follow-up worker **must re-derive the live
> blank-C-id list** from the case files rather than trust these counts.

### 1b. Is Parts/Reports in scope? — **YES. Unambiguously, and from two independent sources.**

1. **His answers.** **Q2 = A** *"every chip shown filters that page"* presupposes the
   feature; **Q5 = A** grants it full Work-Orders behavioural parity; **Q7 = A** rules on
   its role behaviour. You do not answer three behavioural questions about a thing you
   consider out of scope.
2. **The PRD itself, which we did not have on 2026-07-27.** Spec **v1.6** §2 Feature
   Overview now carries a full **"Parts Filters"** block and a full **"Reports Filters"**
   block, and §4 Key Decisions carries **six** Parts/Reports bullets. Verbatim, §2:
   > *"A filter bar appears below the page header on each view of the Parts area
   > (Inventory, Part Sales, Catalog, Returns, Credits, Purchase Orders, Vendor Invoices,
   > Vendors), following the same chip-and-dropdown pattern as Work Orders"*

   and

   > *"Active-chip appearance, \"Clear filters\", \"Clear selection\", collapse/expand,
   > per-view persistence, URL state, and mobile behavior all match the Work Orders
   > definitions"*

   Two sources, agreeing → **CONFIRMED** by Rule 32(i) (duplication raises confidence).
   This also formally closes his **Round-1 Q1 = A** of 2026-07-17 ("Parts/Reports IN
   SCOPE but gated on the PRD update"): **the gate is open.**

### 1c. Can the 7 blank-C-id cases be finalized and pushed? — **YES, with two named caveats**

**What his answers change, exactly** (per-case instructions in `APPLY-PLAN.md`):

| Change | Driven by | Cases affected |
|---|---|---|
| Delete the blanket hedge *"Behaviour to confirm — pending Branko's product write-up"* — the write-up now exists (spec v1.6 §2/§4) and the specific behaviours it hedged are answered | Q2=A, Q3, Q5=A + spec v1.6 §2/§4 | FLT-PARTS-01, -09, -11, -12, FLT-RPTS-01, -21, -22 (**7**) |
| Assert **every designed chip actually filters** instead of asking whether it does | **Q2 = A** | FLT-PARTS-01, FLT-PARTS-11, FLT-RPTS-01, FLT-RPTS-21 |
| Assert **multi-select** on every Parts/Reports filter except date-range, and **Clear selection** / **Clear filters** parity | **Q5 = A** + §4 *"Multi-select where it makes sense : all Parts and Reports filters are multi-select except the date-range filter, which is a single range"* | FLT-PARTS-09, FLT-PARTS-12, FLT-RPTS-22 |
| Stop asserting a fixed option list; state that choices come from the shop's own data and are verified against seeded data | **Q3** *"There is no specific list of choices"* | FLT-PARTS-09, FLT-RPTS-22, FLT-PARTS-01/RPTS-01 notes |
| Assert results narrow **immediately** (no Apply button) | **Q5 = A** parity + §2 Reports *"applies immediately when the second date is picked"* | FLT-PARTS-11, FLT-RPTS-21, FLT-RPTS-22 |
| Replace `permissions_required` *"Whether the filter option lists differ by role is to confirm — pending Branko's PRD"* with the settled ruling | **Q7 = A** | all 7 + FLT-RPTS-23 (**8**) |
| Re-point `spec_ref` from *"Figma …; design-notes §B.5/§B.6"* and *"spec v1.3 (export awaited)"* to **live v1.6 anchors** | spec v1.6 pulled live 2026-07-31 | all 8 |
| Remove *"Pending Branko's PRD ratification (spec v1.3 export awaited)"* from `notes` | the export is no longer awaited | FLT-PARTS-11, -12, FLT-RPTS-21, -22, -23 |

**Caveat 1 — the Parts "Vendors" page hedge STAYS.** FLT-PARTS-01 expected 8 currently
warns the tester that *"the developers have not been given a design for the Vendors page
filters yet, so this page may not have them"*. Q2 = A says every chip **shown in the
design** filters — and there **is no Vendors design**. So Q2 does **not** answer it.
That question is live as **Q3 of `../PO-Questions-Branko-Filters-TechPlan_2026-07-30.md`**
and unanswered. Keep the hedge. (Note the PRD §2 *does* list Vendors among the Parts
views, so the PRD and engineering disagree — which is exactly why the question was asked.)

**Caveat 2 — nothing here is live-verified.** All 8 cases stay `viu_status:
VIU-Pending` (Rules 12/22). That does **not** block the push: the 94 cases already in
TestRail were pushed VIU-Pending too.

**A third thing that does not block the push but must be recorded honestly — the Rule-20
traceability gap.** Rule 20 wants `refs` = `<TICKET(S)> (<spec-anchor>)`. After this
pass we can finally supply a real spec anchor, but:
- there is **no `S#-R#` anchor for Parts or Reports** anywhere in v1.6 (§7 Requirements
  holds Stories 1–14 with no Parts story and no Reports story), so the best available
  anchors are prose citations: *§2 Feature Overview → Parts Filters* / *→ Reports
  Filters*, and the named §4 Key Decisions bullets;
- there is still **no Epic/Jira key** for Filters (**OQ-3**, unanswered since 2026-07-16
  — do not invent one, Rule 20).

So the refs will read e.g. `Filters (Epic key TBD) (spec v1.6 §2 Feature Overview → Parts
Filters; §4 Key Decisions → "Context-specific filter sets on Parts and Reports")`. That is
an improvement on today's Figma-only refs and is the best that is honestly available — and
**Q1 staying blank is the reason it is not better.**

### 1d. Verdict, stated plainly

> **Parts and Reports filters ARE in scope — confirmed by Branko's answers and by spec
> v1.6 independently.** His answers **do** let the cases be finalized: **7 blank-C-id
> cases become push-ready** (`add_case`) after **11 named edits**, plus **1 `update_case`**
> on the one live case (FLT-RPTS-23 = C38882) for its now-stale `spec_ref`. **Two things
> stay hedged and must not be silently closed:** the **Vendors page** design (a different,
> still-open question) and the **absence of numbered Parts/Reports requirements** (Q1
> blank), which caps how precise the Rule-20 refs can be. **Push awaits (a) the sibling
> worker finishing and (b) explicit user authorization** (Rule 6), and the push must be
> followed by a **run-352 union sync** (Rule 34, §5 below).

---

## 2. VERDICT 2 — the 9 `FLT-SRCH` cases (Command-K / spotlight)

**The user's ruling of 2026-07-31, verbatim:** *"OK do not delete those cases unless
Branko confirms that they are related to Global search only."*

**His Q6 answer, verbatim:** *"A - Test it under Global Search, not here. This release
only removes global search's page-filtering behaviour (Story 14). \"Ask a question\" is
not in this PRD's scope."*

### 2a. Verdict: **CONFIRMED — GLOBAL SEARCH.** The hold condition is met.

He was shown our own description of the exact component the 9 cases describe — *"a
pop-up search box that opens from the top bar (or with a keyboard shortcut) and searches
across work orders, customers, assets, parts, vendors and part sales … shows the words
'Search or ask a question'"* — and answered **A: test it under Global Search, not here.**
That is an explicit ownership ruling on the component, not a deferral, and it is the
condition the user set.

### 2b. Three independent sources now agree — no single-source call

| Source | What it says |
|---|---|
| **Branko, 2026-07-31 (this answer, highest precedence — Rule 33 tier (a))** | *"Test it under Global Search, not here."* |
| **Spec v1.6, 2026-07-28** (`SPEC-DIFF.md` §4 Group D) | Story 13 describes an **in-toolbar text input that expands in place and narrows the current table** — `S13-R12`: *"Results replace the table contents in place. There is no separate results view or results page"*; §4 Key Decisions: *"Each search input queries only the records in its own table; it cannot reach content in any other table, on any other page, or in any other module. **Cross-page and cross-module lookup is the job of the global header search**"*. It describes **none** of the entity tabs / grouped results / recent-searches / hover-quick-actions the 9 cases test. |
| **Live design read, 2026-07-31** (`../design-2026-07-31/DESIGN-NOTES.md` §2 + §5.7) | *"**The Filters page contains no ⌘K palette board at all.** The palette lives on a different page of the same file ('Global search')."* Node `11829-8908` — which the 2026-07-27 record mislabelled as the palette — is in fact a 4-state component set for the **page toolbar search field**. |

Rule 32(i): duplication across independent sources raises confidence → **CONFIRMED**, and
it corrects a documented error of our own from 2026-07-27.

### 2c. Recommendation (a RECOMMENDATION — it awaits user authorization)

**Retire all nine from the Filters suite** — `FLT-SRCH-01, -02, -03, -04, -05, -06, -07,
-08, -09` (every one **new, no C-ID yet** — not one has ever been pushed to TestRail).

- **TestRail op: NONE.** Blank C-ids ⇒ this is a **local-only** retirement
  (`viu_status: "Retired — …"`), the same mechanism used for the 27 MG14/MG15 cases. **No
  `delete_case`. Nothing is deleted anywhere.** The bodies stay in the repo.
- **Nothing is lost.** The Global Search project holds **86 authored cases** covering
  exactly these topics (`MERGE-PLAN.md` names the covering coverage per case: entity
  tabs, grouped results + highlighting, recent searches, persisting search, hover
  quick-actions, keyboard navigation, the Refresh action). Global Search is **POSTPONED**
  (user ruling 2026-07-27), so the coverage is parked, not active — worth saying out loud
  so nobody assumes it is being executed today.
- **`FLT-SRCH-09` retires on its own merits regardless.** It is *"Page search scope
  belongs to Filters or Global Search (to decide)"* — a scope **decision** dressed up as
  a test case (the audit scored it NONSENSE). **The decision has now been made.** There
  is nothing left for a tester to do.
- **Recommended companion note (outside this folder — flag only, do NOT write blind):** add
  Branko's ownership ruling to `build/global-search/PROJECT-STATE.md` so the Global Search
  squad knows the 9 topics are confirmed theirs, plus his *"'Ask a question' is not in this
  PRD's scope"* line against that project's **OQ-3** (AI scope). Cross-project write —
  needs its own authorization.

### 2d. ⚠️ Flag F2 — do NOT let this touch the 13 `FLT-PSRCH` cases

`FLT-PSRCH-01…13` are a **different component**: the **in-page toolbar search box**,
which is **Filters' own Story 13** (29 ratified requirements in v1.6). Seven of them are
**live in TestRail** — FLT-PSRCH-01 = **C38883**, -02 = **C38884**, -03 = **C38886**,
-04 = **C38888**, -05 = **C38889**, -06 = **C38891**, -07 = **C38893** — and six more
(`-08 … -13`) were authored by the sibling worker this window.

The risk is his sentence *"This release only removes global search's page-filtering
behaviour (Story 14)"*. Read **literally and in isolation**, that says the only search
work in this release is Story 14 — which would descope Story 13 and all 13 of those cases.
Read **in context** (he is answering a question about the pop-up box), it means *"of the
global/pop-up search, the only thing this release does is stop it filtering pages"* — and
Story 13 stands.

**We take the second reading and CHANGE NOTHING** — but we do not pretend it is certain:
his answer is **newer than v1.6**, and under Rule 32 the newest source wins, so a literal
reading is not absurd. Per Rule 32(iii) this becomes a **one-line confirmation question**
(§4, item **NEW-Q1**). **Hold: no `FLT-PSRCH` case is to be edited, retired or moved on
the strength of this answer.**

---

## 3. VERDICT 3 — sorting

**His sheet does not mention sorting. Not once, in any of the 7 rows.** The 2026-07-27
sheet never asked about it (sorting only surfaced on 2026-07-31, from the live design
capture), so there was nothing for him to answer.

**Status: STILL OPEN, unchanged.** Recorded so nobody mistakes silence for a ruling:

- **Spec v1.6 has no sorting requirement at all.** The only occurrence of the word in the
  whole page body is incidental, inside `S13-R14`: *"The search query … survives sorting,
  pagination, and navigating away from the page and returning."*
- **The design has a whole section** *"Sorting (Work In Progress)"* — boards
  `11985:9686`, `11985:10428`, `11985:11259`, `11985:13334` — with a field box (*Status*,
  *WO Number*), a direction box (*Ascending*), **"Add Sort"**, **"Delete sort"**, and one
  board showing **two stacked sort rows** (multi-level). A sort button also appears on
  the **final** mobile boards and on **two Reports** boards (Notes, Reminders).
- **Our suite has ZERO sorting cases** — there is no `FLT-SORT` area.
- It is asked as **Q4 of `../PO-Questions-Branko-Filters-TechPlan_2026-07-30.md`** (and
  Q8 of `../tech-plan-2026-07-29/Questions-for-Branko-dev.md`), **unanswered**.
- **Do not author sorting cases** (Rule 1 — a board marked *Work In Progress* is not a
  spec). **Honest limit:** all four sorting boards are still **un-rendered** (Rule-35
  Figma queue open), so even the panel description comes from layer names, not a picture.

---

## 4. Which OTHER open questions do his answers settle? (so we never re-ask)

The user's instruction is pointed here: *"we already embarrassed ourselves once by asking
questions the spec had answered."* That happened (`VERIFICATION.md` §"What WE got wrong"
— we asked Branko three things v1.4 had already ratified). So this section is deliberately
strict: **only mark ANSWERED where his words actually answer it.**

### 4a. `PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` — the NEWER sheet (6 questions)

| Q | Topic | Settled by these answers? |
|---|---|---|
| **Q1** | Mobile single-filter windows: instant, or an "Apply" button? | ❌ **NO — still open.** Not mentioned. Q5=A grants generic "mobile matches Work Orders" parity, which does **not** resolve *which* mobile behaviour ships. The genuine conflict is **FLT-MOB-04 = C29624** ([view](https://shopview.testrail.io/index.php?/cases/view/29624)) — design frames show an "Apply filter" button, tech-plan D15 builds individual sheets real-time. **Keep asking.** |
| **Q2** | Which tab opens first (Estimates?) | ❌ **NO — still open.** Not mentioned. |
| **Q3** | The Parts **"Vendors"** page filters | ❌ **NO — still open**, and this is the one people will get wrong. Q2=A covers chips *shown in the design*; there **is no Vendors design**. The PRD §2 lists Vendors among the Parts views; engineering says it will not build without a design. **Unresolved — keep the FLT-PARTS-01 hedge.** |
| **Q4** | **Sorting** | ❌ **NO — still open.** See §3. |
| **Q5** | Per-page list of searchable fields (`S13-R23`) | ❌ **NO — still open.** Not mentioned. Note Q3's *"There is no specific list of choices"* is about **filter dropdown options**, not about **which fields a search box matches** — different things; do not conflate them. The spec itself concedes the gap: *"Until it exists the searchable set is undocumented and QA has no baseline to test against."* |
| **Q6** | Send/align his latest written description | ⚠️ **HALF.** The *"send us the current spec"* half is **satisfied** — we hold v1.6, pulled live from Confluence 2026-07-31 (obtained by us, not by him; his Q4 *"The links are in the PRD"* confirms he treats the PRD as the reference). The *alignment* half is **still open and grows** — see §4c. |

**Net: his answers settle NOT ONE of the 6 questions in the newer sheet.** That sheet
goes out unchanged. Trimming it would be wrong.

### 4b. `../tech-plan-2026-07-29/Questions-for-Branko-dev.md` — mark ANSWERED

| Item | Status change |
|---|---|
| **The page-search ownership item** (QA-only note + the C6–C8 mapping row; the reader-facing question is **Q6 of the 2026-07-27 Parts/Reports sheet**) | ✅ **ANSWERED 2026-07-31 — CLOSE IT.** Branko: *"Test it under Global Search, not here."* → the user's hold condition is met; verdict §2. **Never re-ask.** |
| **Q7** — the spec-export request | ✅ **Already closed** (we pulled v1.6 live on 2026-07-31; the doc records it). No change. |
| **Q6** — Parts "Vendors" page | ❌ Still open (= newer-sheet Q3). |
| **Q8** — sorting · **Q9** — searchable fields | ❌ Both still open. |
| **Q1** *(Status chip)* · **Q2** *(shared link)* · **Q3** *(Imported)* | Already **withdrawn/resolved** before this pass — unaffected. |

### 4c. What his answers DO close, project-wide

| Open item | Now closed by |
|---|---|
| **Round-1 Q1 = A gate** — *"Parts/Reports IN SCOPE but authoring GATED ON Branko's PRD update"* (open since 2026-07-17) | **CLOSED.** The PRD update landed as spec v1.2–v1.6; Q2/Q5/Q7 supply the behaviour rulings. Verdict §1. |
| **Page-search ownership** (open since 2026-07-27; user-ruling hold 2026-07-31) | **CLOSED — Global Search.** Verdict §2. |
| **AI "ask a question" in Filters** | **CLOSED for Filters** — *"not in this PRD's scope."* (Its Global-Search-side timing remains that project's OQ-3.) |
| **Role-dependence of Parts/Reports filter lists** (the Parts/Reports half of **OQ-4**) | **CLOSED — role-independent** (Q7=A), extending his 2026-07-20 Work-Orders ruling. |
| **Option lists per Parts/Reports filter** | **CLOSED as data-driven** — *"There is no specific list of choices"* → verify against seeded data at VIU; never assert a fixed list. |
| **Parts/Reports ↔ Work Orders behavioural parity** | **CLOSED — full parity, 2 named exceptions** (Q5), both already matching spec §4 and already covered by existing cases. |

### 4d. NEW questions this pass creates (add to the next Branko sheet — layman, Rule 7)

- **NEW-Q1 (flag F2, priority — a scope risk).** *"You told us the pop-up search box is
  tested under Global Search. We just want to be sure about the OTHER search box — the
  small one that sits in each page's own toolbar and narrows that page's list as you type
  (your written description covers it in detail). We are treating that one as part of THIS
  filters release. Is that right?"* → A) Yes, the in-page search box is part of this
  release. · B) No — it moves too (please say where).
- **NEW-Q2 (flag F1).** *"You said the behaviour of the new filter buttons is fully shown
  in the design. We have looked through every Parts and Reports board we can open and they
  show us the button names, but not what is inside each button. Could you point us at the
  exact board(s)?"* → A) Here is the board / B) It is not in the design; here is how they
  behave / C) Treat the general rules (pick more than one, choices come from the shop's
  data, list narrows immediately) as the whole answer.
- **NEW-Q3 (Q1 residue).** *"Would you add the Parts pages and the Reports pages to the
  numbered list of requirements, the way the Work Orders page is written up? Right now they
  are described in the overview and in the decisions list, but not as numbered points, so
  our tests cannot point at a specific line."*
- **Additions to the existing "please update your written description" ask (§4a Q6):**
  record **(i)** that filter buttons and their choices are the same for every role
  (Q7=A — the spec has **no permissions section at all**); **(ii)** the parity rule that
  every filter the app offers today, with all its choices, must survive the redesign
  (Q3); **(iii)** the long-standing `S9-R2`/`S9-R3`/`S2-N1`/`S2-N2`/§4 *"Status filter is
  hidden"* text, still unaligned with his own Round-1 **Q4 = B** answer after eight
  versions (`SPEC-DIFF.md` §5).

---

## 5. Cross-check of every answer against live spec v1.6 (Rule 15/25 — verbatim, no paraphrase)

**Result: no answer CONTRADICTS v1.6 on substance. Four agree with it outright; one has a
clause that needs care; one is a fact-claim we cannot corroborate; two need the spec TEXT
updated to record them.**

| # | His answer | v1.6 verbatim | Verdict |
|---|---|---|---|
| Q2=A | every chip shown filters that page | §2 Parts Filters: *"Filters are context-specific per view: each view shows only the chips relevant to its data (e.g., Inventory filters by Bin Location, Category, Supply, and Vendor; Purchase Orders by Vendor, Status, Date, and Ordered by)"* | ✅ **CONSISTENT.** "Only the chips relevant to its data" ⇒ chips are shown because they apply. |
| Q3 (option lists data-driven) | *"There is no specific list of choices"* | §2 Parts Filters: *"Entity filters (Customer, Vendor, Created by, Ordered by, Received by, Processed by) use the searchable multi-select dropdown; long lists such as Category and Manufacturer also include a search field; short attribute filters (Supply, Part Type, Bin Location, State/Province, Status) use the checkbox list"* | ✅ **CONSISTENT.** The spec pins the **control type**, never an option list. |
| Q3 (parity: support all filters the app has today) | §4: *"Context-specific filter sets on Parts and Reports : each Parts view and each Report defines its own filter chips…"* — and the **tech plan's** rollout rule: *"NO change to what is filterable"* | ✅ **CONSISTENT, and it strengthens the tech plan.** But **not stated as a requirement anywhere in v1.6** → needs recording (§4d). Also creates real new coverage (§6 NEW-1). |
| Q4 (*"fully displayed in the design"*) | — | ⚠️ **FLAG F1 — not a spec contradiction; a fact mismatch with our own live design read.** `DESIGN-NOTES.md` §5.7: *"Parts/Reports **behaviour** (option lists, multi-select, immediate apply, persistence per page) is still design-silent … the design pins only the button names."* And the 6 new filter types (**Location, Transaction Type, Invoice Status, Type, User, Mention**) are enumerated **nowhere** in v1.6 — §2 Reports says only *"the entity dimensions relevant to that report (Customer, Vendor, Technician, Advisor, Staff, Employee, and so on)"*. **Honest caveat:** **12 of 85 boards are still un-rendered** (Rule-35 queue open), so a behaviour board we have not seen is possible. → NEW-Q2. |
| Q5=A (parity) | §2 Parts Filters: *"Active-chip appearance, \"Clear filters\", \"Clear selection\", collapse/expand, per-view persistence, URL state, and mobile behavior all match the Work Orders definitions"* (and the identical sentence under Reports Filters) | ✅ **CONSISTENT — near-verbatim agreement.** Rule 32(i) → CONFIRMED. |
| Q5 exception 1 (no carry-over across Parts views / Report tabs) | §4: *"Parts and Reports selections are scoped to their view/tab and persist there : filters do not carry across Parts views, Report tabs, or sub-report tabs; each view/tab retains its own selections and restores them on return"* · `S10-R4`: *"…each Parts view and each Report tab keeps its own separate filter set (see Key Decisions), and each of those sets persists independently on the terms in S10-R2"* | ✅ **CONSISTENT — verbatim match.** Already covered by **FLT-PERS-05 = C38880** ([view](https://shopview.testrail.io/index.php?/cases/view/38880)). **NO new case** (Rule 28 — do not duplicate); refs-only edit at most. |
| Q5 exception 2 (date-range = single range) | §4: *"Multi-select where it makes sense : all Parts and Reports filters are multi-select except the date-range filter, which is a single range"* · §2 Reports: *"the chip opens a start/end date picker with no presets and no default range selected … the range applies immediately when the second date is picked"* | ✅ **CONSISTENT — verbatim match.** Already covered by **FLT-RPTS-23 = C38882**, whose expected 4 already reads *"Only one date range can be active at a time on that chip"*. Refs-only edit. |
| Q6=A (pop-up = Global Search) | §4: *"Cross-page and cross-module lookup is the job of the global header search, which is the whole basis for the split in Story 14"* · `S13-R9`: *"Search is scoped strictly to the records in the current table…"* | ✅ **CONSISTENT.** |
| Q6 clause 2 (*"this release only removes global search's page-filtering behaviour (Story 14)"*) | Story **13** exists in v1.6 with **29 requirements**, e.g. `S13-R22`: *"Every table in the application carries a search control, delivered through the shared table component"* | ⚠️ **FLAG F2 — potential literal contradiction.** His answer is **newer** than v1.6 (Rule 32) so we do not dismiss it; we take the in-context reading, change nothing, and **ask** (NEW-Q1). |
| Q6 clause 3 (AI out of scope) | v1.6 contains **no** mention of AI or *"ask a question"* anywhere | ✅ **CONSISTENT** (spec silent; his answer confirms the silence is deliberate). |
| Q7=A (role-independent) | **The page has NO permissions section at all** — recorded verbatim at the head of `Filters-spec-current.md`: *"There is **NO change-log section, NO open-questions section, NO permissions** …"* | ✅ **CONSISTENT — spec silent, not contradicted.** His answer **fills** the gap → needs recording in the PRD (§4d). |

**Pre-existing contradiction, unchanged by this pass and re-stated so it is not lost:**
`S9-R2` / `S9-R3` / `S2-N1` / `S2-N2` / §4 all still say the Status chip is **hidden** on
Estimates and Completed, while **FLT-TAB-02 = C29609** ([view](https://shopview.testrail.io/index.php?/cases/view/29609))
and **FLT-TAB-03 = C29610** ([view](https://shopview.testrail.io/index.php?/cases/view/29610))
correctly test **shown-but-greyed-out** on the authority of his own Round-1 **Q4 = B**
answer plus the QA-lead ruling of 2026-07-30. **The cases are right; his PRD text is
stale** (`SPEC-DIFF.md` §5, `VERIFICATION.md` §CONFLICT-1). Nothing in these answers
changes it; it stays on his to-fix list.

---

## 6. Complete classified delta list

### APPLY-NOW — 11 case edits (detail + exact wording in `APPLY-PLAN.md`)

| # | Case | C-id | Op | Driving answer |
|---|---|---|---|---|
| A1 | FLT-PARTS-01 | blank | local edit → `add_case` | Q2=A, Q3, Q7=A |
| A2 | FLT-PARTS-09 | blank | local edit → `add_case` | Q3, Q5=A, §4 multi-select |
| A3 | FLT-PARTS-11 | blank | local edit → `add_case` | Q2=A, Q5=A |
| A4 | FLT-PARTS-12 | blank | local edit → `add_case` | Q5=A |
| A5 | FLT-RPTS-01 | blank | local edit → `add_case` | Q2=A, Q7=A |
| A6 | FLT-RPTS-21 | blank | local edit → `add_case` | Q2=A, Q5=A |
| A7 | FLT-RPTS-22 | blank | local edit → `add_case` | Q3, Q4, Q5=A, §4 |
| A8 | FLT-RPTS-23 | **C38882** | **`update_case`** | Q5=A exception 2; refs → v1.6 |
| A9 | FLT-PERS-05 | **C38880** | `update_case` *(optional, refs only)* | Q5=A exception 1 |
| A10 | *(all 8 above)* | — | folded into A1–A8 | Q7=A `permissions_required` line |
| A11 | *(all 8 above)* | — | folded into A1–A8 | live v1.6 `spec_ref` re-point |

### NEEDS-NEW-CASE — 1

**NEW-1 — "Every filter the page had before is still available in the new filter bar."**
Driven by Q3 verbatim: *"We should support all the filters we have right now in the app as
well as all choices per filter."* **No case in the 110-case suite asserts this**, and it
is the single highest-value regression guard the redesign has: if the redesign silently
drops a filter a shop uses today, nothing we currently run would catch it. Rule-28
discipline: **exactly ONE case covering both Parts and Reports** (not one per page — that
is the per-page explosion the audit cut 27 cases for).

### RETIRE-CANDIDATE — 9

`FLT-SRCH-01 … FLT-SRCH-09` — all blank C-ids, **local retirement only, no
`delete_case`** (§2c). **Awaits user authorization.**

### STILL-AMBIGUOUS — 5

| # | Item | Why it stays a question |
|---|---|---|
| S1 | **Q1 blank** — numbered per-page Parts/Reports requirements | Caps Rule-20 refs to prose anchors → NEW-Q3 |
| S2 | **F1** — *"fully displayed in the design"* | Contradicts our design read; 12 boards un-rendered → NEW-Q2 |
| S3 | **F2** — does Story 13 page search stay in Filters? | Literal reading would descope 13 cases → NEW-Q1 |
| S4 | **OQ-3** — Epic/Jira key | Still TBD; refs cannot carry a ticket. Do not invent (Rule 20). |
| S5 | Vendors page · sorting · searchable fields · mobile Apply · default tab | All five untouched by his answers (§4a) |

### NO-CHANGE — 2

- **FLT-PERS-05 = C38880** already tests per-view/per-tab scoping (Q5 exception 1) — no
  new case, at most a refs edit (A9).
- **FLT-RPTS-23 = C38882** already tests single-range date behaviour (Q5 exception 2) —
  refs edit only (A8).

---

## 7. Honest limits of this analysis

1. **No live-build check** (Rules 12/22). Filters has no QA branch; nothing here is
   VIU-Verified and nothing may be recorded as such.
2. **The case files were read at one moment in a window when a sibling worker is editing
   them.** Counts in §1a were true at read time; `FLT-PSRCH-08…13` already exist in
   `../cases/` but not in `../testrail-id-map.csv`. The follow-up **must re-derive** the
   live blank-C-id list.
3. **Two of his answers are pointers, not descriptions** (Q3 *"no specific list"*, Q4
   *"in the design"*). We have taken them at face value and flagged where they do not
   match what we can see, rather than filling the gap by inference.
4. **12 of 85 design boards remain un-rendered** (Rule-35 queue `../design-2026-07-31/PENDING-FIGMA-FETCH.md`,
   DUE-AT `2026-07-30T23:27:02Z`). That queue is **still open** and it is materially
   relevant to flag F1 and to sorting. **This worker did not run the retry** — the fetch
   writes into `../design-2026-07-31/frames/`, outside this pass's write scope. **Flagged
   for the coordinator.**
5. **Zero writes** outside `build/filters/branko-answers-2026-07-31/`. No case body, no
   id-map, no import, no TestRail record was touched.
