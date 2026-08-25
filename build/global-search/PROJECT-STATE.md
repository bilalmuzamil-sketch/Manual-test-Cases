# Global Search — PROJECT STATE (canonical cold-resume doc)

> **Read this first to resume the Global Search project.** Single authoritative
> snapshot. Keep this project's memory SEPARATE from other projects; reuse shared
> infrastructure (staging/QA access method, harness scripts, TestRail API patterns,
> the two process docs) across all projects.

## 0.0 — 2026-07-31 — Ownership ruling from Branko (Filters cross-project)

> **Read this alongside §0.** It does NOT change this project's status (still
> **POSTPONED**, user ruling 2026-07-27 — 86 cases authored, NEVER pushed to TestRail,
> all C-ids blank). It records an ownership decision made on the **Filters** project
> that lands coverage HERE, plus one nuance for **OQ-3**. **No TestRail writes. No case
> edits in this project.**

### 1. Branko's ruling (verbatim)

Branko answered the **Filters** Parts/Reports PO question sheet
(`build/filters/PO-Questions-Branko-PartsReports-2026-07-27.md`/`.xlsx`, issued
**2026-07-27**; his answers **ingested 2026-07-31** →
`build/filters/branko-answers-2026-07-31/answers-ingested.md` §Q6). Q6 asked whether the
pop-up / command-palette search box (**"Search or ask a question"**, opened from the top
bar or by keyboard shortcut, searching across work orders, customers, assets, parts,
vendors and part sales) belongs to the Filters release or to the separate Global Search
work. **His answer, verbatim:**

> **"A - Test it under Global Search, not here. This release only removes global search's
> page-filtering behaviour (Story 14). \"Ask a question\" is not in this PRD's scope."**

Three separate statements: (1) the pop-up / command-palette search box is **Global
Search's**, not Filters'; (2) the only pop-up-search work in the Filters release is the
**Story 14** removal of its page-filtering behaviour; (3) **"Ask a question" (the AI
element) is NOT in the Filters PRD's scope.**

### 2. Consequence for THIS project — 9 palette cases' coverage belongs here

Nine command-palette cases had been authored under the **Filters** project
(`FLT-SRCH-01..09`, **every one new with a BLANK C-id — not one was ever pushed to
TestRail**). On the user's ruling of **2026-07-31** (*"OK do not delete those cases
unless Branko confirms that they are related to Global search only"*), the hold condition
is now met, and they are **retired from the Filters suite — LOCAL-ONLY** (`viu_status`
marked Retired; **no `delete_case`, no TestRail operation of any kind**, because there are
no C-ids). **Their subject matter is Global Search's, so their coverage BELONGS HERE.**

**When Global Search resumes, re-author / adopt this coverage in this project so it is
not lost.** Cross-check each against our existing 86 cases first — the Filters quality
audit (`build/filters/quality-audit-2026-07-31/MERGE-PLAN.md`, Cuts section) records that
our authored suite already covers each of these topics, so most should reconcile to an
existing `GS-*` case rather than become a new one.

The nine (Filters internal IDs — **all new, no C-ID yet**):

| Filters ID | Subject (one line) | Topic our suite already covers |
|---|---|---|
| `FLT-SRCH-01` | Page search opens with the "Search or ask a question" box | palette entry point / placeholder |
| `FLT-SRCH-02` | Page search shows entity tabs All, Work Orders, Customers, Assets, Parts… | entity scope tabs |
| `FLT-SRCH-03` | Typing a term shows grouped results with counts and highlighting | grouped results + highlighting |
| `FLT-SRCH-04` | Recent searches are shown grouped by Today, Yesterday, Past week… | recent searches |
| `FLT-SRCH-05` | Re-opening page search keeps the last typed text and its results | persisting search |
| `FLT-SRCH-06` | Hovering a search result shows quick-action buttons | hover quick-actions |
| `FLT-SRCH-07` | Page search shows keyboard hints and supports keyboard navigation | keyboard navigation |
| `FLT-SRCH-08` | Page search results include a Refresh action | results panel incl. Refresh (also our own open thread — is Refresh in V1?) |
| `FLT-SRCH-09` | "Page search scope belongs to Filters or Global Search (to decide)" | **NOT a test case** — it was the scope decision itself, now MADE by this ruling; nothing to adopt |

**Where the bodies live (read-only, do not edit the Filters project):**
- `build/filters/cases/cases-G-page-search.json` — the live bodies, marked Retired by the
  Filters worker.
- `build/filters/consolidation-backup-2026-07-31/cases-G-page-search.json.pre-edit` —
  pre-edit backup of the same file (all 9 bodies as authored).
- `build/filters/quality-audit-2026-07-31/MERGE-PLAN.md` — per-case cut rationale +
  the Global-Search-coverage mapping.
- `build/filters/branko-answers-2026-07-31/DELTAS.md` §2 (VERDICT 2) — the full
  ownership verdict and its three independent sources.

### 3. The AI / "ask a question" note — **OQ-3 STAYS OPEN**

Branko said the AI element is out of the **FILTERS** PRD's scope. **That does NOT by
itself answer whether it is in GLOBAL SEARCH's V1 scope.** Two different questions:

- **Answered:** "Ask a question" is not part of the Filters release.
- **STILL OPEN (our OQ-3):** does the **"Search or ask a question" placeholder** — and any
  AI / natural-language query behaviour — ship in **Global Search V1**? Our Figma capture
  labels AI search **OUT OF SCOPE** (not authored), while the spec placeholder and §8
  "gracefully degrade when the AI flag is off" imply an AI capability.

**Do NOT over-read his answer into a V1 ruling for this project** (Rules 32/33 — do not
resolve ambiguity by inference). **OQ-3 remains OPEN and must still be asked of Branko
before/at VIU**, ideally in the same breath as the Epic key (OQ-4).

### 4. Supporting evidence (so this is not re-litigated)

- **Filters spec v1.6 (2026-07-28) has NO command-palette requirement.** Its **Story 13**
  is the **in-toolbar page search** — an input that expands in place and narrows the
  current table (`S13-R12`: *"Results replace the table contents in place. There is no
  separate results view or results page"*). Its **§4 Key Decisions** assigns cross-page
  lookup away from Filters: *"Cross-page and cross-module lookup is the job of the global
  header search, which is the whole basis for the split in Story 14."* v1.6 describes none
  of the entity tabs / grouped results / recent searches / hover quick-actions the 9 cases
  test.
- **The Filters Figma file contains no command-palette board at all.** Live design read
  2026-07-31 (`build/filters/design-2026-07-31/DESIGN-NOTES.md` §2 + §5.7): *"The Filters
  page contains no ⌘K palette board at all. The palette lives on a different page of the
  same file ('Global search')."* Node `11829-8908`, previously mislabelled as the palette,
  is actually a 4-state component set for the **page toolbar search field**.
- **Do NOT confuse the two components.** Filters' `FLT-PSRCH-01..13` (in-page toolbar
  search, Filters' own Story 13, 7 already live in TestRail) are a **different** component
  and are **NOT** ours — they stay with Filters.

### 5. What changed here / what did NOT

- **Changed:** this block added; one pointer line added to the CLAUDE.md Global Search
  entry.
- **NOT changed:** status (still POSTPONED), case count (**86**), any case body, the
  id-map (C-ids still blank), the import, TestRail (**zero writes**). OQ-3/OQ-4/OQ-5 all
  still open.

---

## 0. STATUS / WHAT'S LEFT TO DO — read first (Last updated 2026-07-16)

**STATUS: CASES AUTHORED & REVIEWED — 86 cases / 15 sections (12 API cases in an
API-titled section, Standing Rule 4); import deliverable ready in the CANONICAL
location + format (`testrail-import/global-search-v2-testrail-import.csv` + `.xlsx`,
86 rows, VIU-word-free & feature-flag-free; PURE 1:1 format match to the
fees-discounts / simple-flow imports — the 8 named columns + 2 trailing blank
columns, header byte-identical; NO extra ID columns, traceability via
build/global-search/testrail-id-map.csv per Rule 8); the old
bespoke `GlobalSearch_TestRail-Import.csv`/`.xlsx` were SUPERSEDED and removed
(2026-07-16); coverage-matrix COMPLETE (zero in-scope gaps);
adversarial-review CLEAN.** The adversarial pass fixed **2 Rule-9 build-accurate
wording defects** ("Aabridge" typo → "Abridge"; the fuzzy-indicator glyph "≈") and
**added 2 completeness cases** — **GS-FUZ-11** (Part Sale P-number exact-only, no
fuzzy typo tolerance) + **GS-PERM-05** (sparse / empty entity type shows no group and
its scope tab shows the empty state). Case count went 84 → 86.

**NOT DONE / NEXT (all for the VIU stage):**
1. **TestRail push PENDING explicit user permission** — NOT pushed;
   `testrail-id-map.csv` C-ids are BLANK. No TestRail writes without explicit user
   permission (Standing Rule 6).
2. **VIU PENDING — feature not yet on any QA env.** When VIU begins, run the
   `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` LIVE with evidence (Standing Rules
   10–14). Per **Standing Rule 11, ASK the user which process(es) to run** (wording+VIU
   and/or SPEC-RELEVANCE-RECONCILIATION) before proceeding.
3. **⚠️ ASK THE USER for the Epic / Jira key when VIU starts** — NOT available as of
   2026-07-16 (OQ-4). Do NOT invent.
4. **OQ-3 OPEN** — does the "Search or ask a question" placeholder still ship in V1
   even though AI search is OUT OF SCOPE? Confirm with the PO before/at VIU.
5. **~20 VIU-confirm placeholders to verify LIVE** — footer legend wording,
   "Show all N" target, highlight color, full status-badge set, pinned ID-match top
   row, error banner, API response/error shapes, "Refresh"-link scope, etc. (full list
   in `coverage-matrix.md` §D).
6. **QA env + feature-flag status TBD** (OQ-5) — VIU + TestRail push both wait on this.

- **PO = Branko** (confirmed 2026-07-16; full name TBC). **Canonical spec URL
  recorded** (reference pointer only, Atlassian-SSO login-walled — do NOT fetch;
  content already ingested from the exported .doc) — see §1.
- **Out of scope (NOT authored):** AI search-all; header-component proposal (both
  Figma-labeled out of scope).
- **Deliverables index** (see §3): `requirements.md`, `design-notes.md` (10/10 Figma),
  `cases/` (86), `coverage-matrix.md`,
  `testrail-import/global-search-v2-testrail-import.csv`/`.xlsx` (canonical location),
  `gen_import.py`, `testrail-id-map.csv`.

## 0.1 Status detail

- Spec: **INGESTED** (complete) → `requirements.md`. Source doc was a Confluence
  "Export to Word" MHTML/quoted-printable file; decoded with Python
  `quopri.decodestring` + BeautifulSoup (HTML→text preserving tables). Full spec
  captured verbatim-structured (background, goals, entities, ranking, fuzzy match,
  functional/non-functional reqs, dev plan/phasing, open questions).
- Design: **CAPTURE COMPLETE — 10 of 10 Figma screenshots** → `design-notes.md`.
  Two states are **OUT OF SCOPE** (NOT authored):
  (1) **AI search-all** ("AI search (out of scope)"),
  (2) **Header search component proposal** ("New search component proposal (Out of
  scope)").
- Cases: **AUTHORED — 86 cases** across **15 sections** (14 functional + 1 API) →
  `cases/cases-A..D-*.json`. Internal IDs `GS-<AREA>-NN`. All 12 API cases live under
  the API-titled section (Standing Rule 4). All carry `viu_status: "VIU-Pending"`
  (feature not yet VIU-able) + build-accurate wording from `design-notes.md` with
  ~20 explicit VIU-confirm placeholders (see `coverage-matrix.md` §D).
- Deliverables: **import (CSV+XLSX) + coverage matrix + id-map** built (see §3).
- TestRail: **NOT pushed** — `testrail-id-map.csv` lists all 86 internal IDs with
  BLANK TestRail Case IDs (the sole traceability source, Rule 8; the import file
  carries no ID columns). **No TestRail writes without explicit user permission**
  (Standing Rule 6).
- Env/VIU: **NOT available yet** — feature is feature-flagged and not confirmed on
  any QA env. VIU deferred until it ships to a testable environment.
- PO: **Branko** (confirmed 2026-07-16; full name TBC). Spec URL: confirmed (§1).

## 0.5 What is blocking / awaiting

Cases are authored; remaining items are for the VIU stage:
- **AI / "ask a question" scope decision (OQ-3 — STILL OPEN)** — placeholder "Search
  or ask a question" + §8 "gracefully degrade when the AI flag is off" imply an AI
  capability; Figma screenshot 7 labels AI search **OUT OF SCOPE**. Confirm: is any
  AI/NL query behavior in V1? (If yes, needs its own spec section before authoring
  those cases. NOT authored — see coverage-matrix §C.)
- **⚠️ Epic / Jira key (OQ-4 — STILL OPEN): ASK THE USER for the Epic/Jira key when
  VIU is started** (the user does NOT have it yet as of 2026-07-16). Needed for
  traceability. Do NOT invent.
- **QA environment + feature-flag status (OQ-5)** — where will it be testable; not yet
  known. VIU + TestRail push both wait on this + explicit TestRail permission.
- Per **Standing Rule 11**, ASK which process(es) to run (BUILD-ACCURATE-WORDING-VIU
  and/or SPEC-RELEVANCE-RECONCILIATION) before the VIU pass.
- **RESOLVED:** OQ-1 (PO = Branko), OQ-2 (canonical spec URL confirmed).

## 1. Project identity

- **Project:** Global Search (v2) — ShopView App feature.
- **Spec doc title:** "Global Search - Product Requirements & Development Plan".
- **Figma:** https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=12053-65992
- **Canonical spec URL (confirmed 2026-07-16):**
  https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements+Development+Plan
  (Atlassian-SSO login-walled — reference pointer only; do NOT fetch; content already
  ingested from the exported .doc).
- **PO: Branko** (confirmed 2026-07-16; known as Branko, full name TBC). *(Never mix
  PO attributions across projects — Global Search = Branko; Fees & Discounts = Chris
  Ward; Simple Flow = Milos; Custom Roles = Vlad-as-automation/PO-per-that-project.)*
- **Epic / Jira key:** ⚠️ NOT AVAILABLE YET — ASK the user when VIU begins (see OQ-4).

## 2. Feature summary (one paragraph)

A spotlight-style **global search command palette** (⌘K / K, opened from the header
search field) that searches six entity types — **Work Orders, Customers, Assets,
Parts, Vendors, Part Sales** — with fuzzy/typo tolerance, relevance ranking, inline
context, keyboard-first navigation, recent-activity + persisting-query state,
grouped results with per-group counts + "Show all N" overflow, contextual
hover quick-actions, and role-based result scoping. Backed by a single
`GET /api/search` endpoint. AI/natural-language "ask a question" is implied by the
placeholder but is OUT OF SCOPE for V1 per the Figma.

## 3. Deliverables index (this folder: `build/global-search/`)

- `requirements.md` — COMPLETE structured spec (§1–§11) + onboarding open questions
  (PO/URL resolved; OQ-3 AI + OQ-4 Epic still open).
- `design-notes.md` — Figma capture, 10/10 screenshots, exact labels; out-of-scope
  states flagged.
- `cases/cases-A-palette-keyboard-tabs.json` (18) — GS-KEY, GS-TAB.
- `cases/cases-B-results-entities-fuzzy-ranking.json` (31) — GS-GRP, GS-ENT, GS-FUZ,
  GS-RANK.
- `cases/cases-C-states-hover-list-error.json` (20) — GS-EMPTY, GS-REC, GS-PERS,
  GS-NORES, GS-HOVER, GS-LIST, GS-ERR.
- `cases/cases-D-permissions-api.json` (17) — GS-PERM (5) + GS-API (12, API section).
- `coverage-matrix.md` — every in-scope spec req + Figma state → GS- case(s);
  out-of-scope items + ~20 VIU-confirm placeholders listed.
- `gen_import.py` — builds the import as a PURE 1:1 format match to fees-discounts /
  simple-flow: the 8 named columns (Title, Section, Type, Priority, Preconditions,
  Steps, Expected Result, References) + 2 trailing UNNAMED (blank) columns, header
  byte-identical; NO ID columns (traceability lives in `testrail-id-map.csv`, Rule 8).
  VIU-word-free + feature-flag-free; API cases routed to an "API — <leaf>" section
  (em-dash, matching the other imports); CRLF row terminators + LF in cells;
  deterministic re-run. Writes to
  `testrail-import/global-search-v2-testrail-import.csv`/`.xlsx`.
- `testrail-import/global-search-v2-testrail-import.csv` / `.xlsx` — 86 rows, 10
  columns (8 named + 2 blank), header byte-identical to the FD/SF imports; no C-ids in
  the file (blank C-ids tracked only in `testrail-id-map.csv`). (The old bespoke
  `build/global-search/GlobalSearch_TestRail-Import.*` was SUPERSEDED and removed
  2026-07-16 in favor of this canonical file.)
- `testrail-id-map.csv` — all 86 internal IDs, BLANK TestRail Case IDs (not pushed).
- `PROJECT-STATE.md` — this file (canonical resume doc).

## 4. Shared infrastructure to reuse (do NOT re-invent)

- **Build-accurate wording + VIU method:** `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`
  (Standing Rules 9/10) — apply when the user asks and once the feature is VIU-able.
- **Spec-relevance / obsolescence reconciliation:**
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (Standing Rules 10/11).
- **Testing runbook / app-actions:** `build/TESTING-RUNBOOK.md`,
  `build/APP-ACTIONS-PLAYBOOK.md`.
- **Two-env permission compare method:** `build/PROD-VS-STAGING-COMPARE-METHOD.md`
  (relevant for the role-based-access scoping requirement, §9 — a technician without
  Parts access must not see Parts results).
- **Permissions assessment:** `build/PERMISSIONS-ASSESSMENT.md`.
- TestRail: project **1** / single suite **1 "Master"**; API v2 Basic auth;
  `add_case` sends `custom_atmstatus:1` (= "Not Automated") + `custom_automation_type:0`
  — **never `3`** (corrected 2026-08-21: 3 = Automated and would corrupt the automation
  signal; authored cases are created Not Automated = 1); result
  statuses 1 Passed / 2 Blocked / 3 Untested / 4 Retest / 5 Failed. **Standing Rule 4:
  any case touching API endpoints/methods/status codes → a TestRail section whose
  title includes 'API'** (relevant here — `GET /api/search`, recent-entities
  endpoints, telemetry).

## 5. Testing-relevant highlights for future case authoring

- **Entity coverage:** 6 searchable types (WO, Customer, Asset, Part, Vendor, Part
  Sale), each with distinct indexed + displayed fields (see requirements §4).
- **States to cover:** first-time/empty, recent (Today/Yesterday/Past week/Past 30
  days), typing/results (grouped + counts + Show all N), no-results, persisting
  search, error ("Search unavailable, retry"). (6 UI states; error state not in the
  screenshots — VIU-confirm.)
- **Keyboard:** ⌘K/K open + close, Esc, ↑/↓ row nav (skip headers), Enter (same tab),
  ⌘/Ctrl+Enter (new tab), Tab to tab-strip, ←/→ cycle tabs.
- **Fuzzy match:** trigram + Damerau-Levenshtein + Double Metaphone; identifier
  fields (VIN/WO#/P#/part#/phone) are EXACT-only after normalization. Test queries
  from spec: `Petersn`, `Abrige`, `frieghtliner`, `S215276`/`S2-15276`, phone digits.
- **Ranking:** ID match > 0.95 pinned as top single row; group order WO→Cust→Asset→
  Part→Vendor→PartSale; per-entity signals (open status, recency, ownership, stock).
- **Contextual bias:** Customer page boosts its assets/WOs; WO page demotes parts
  already on the WO.
- **Permissions/scoping (§9):** results respect role-based access — negative cases
  (low-permission user does NOT see disallowed entity results) will need role setup.
- **Quick actions on hover:** per entity (Add new line / New work order / New contact
  / Add contact / Add to work order / Add part), with conditional visibility tied to
  "currently editing a WO".
- **NFR:** debounce 150ms; p95 render 200ms / latency 250ms; index refresh ≤30s;
  WCAG 2.1 AA (focus rings, SR announcements on count change); sparse-data tenants.
- **DO NOT author** cases for: AI search-all, header component proposal (both
  Figma-labeled out of scope).

## 6. How to resume (ordered)

1. Read this file, then `requirements.md` (full spec), `design-notes.md` (labels),
   and `coverage-matrix.md` (completeness + VIU-confirm list).
2. Cases are AUTHORED (86 in `cases/`). Regenerate the import any time with
   `python3 build/global-search/gen_import.py` (keeps it VIU-word-free + flag-free).
3. **⚠️ ASK THE USER for the Epic/Jira key (OQ-4)** and confirm OQ-3 (AI placeholder)
   before/at VIU. Get OQ-5 (QA env + flag status) so the feature is VIU-able.
4. Per Standing Rule 11, ASK which process(es) to run (BUILD-ACCURATE-WORDING-VIU
   and/or SPEC-RELEVANCE-RECONCILIATION) before the VIU pass.
5. VIU pass once on a QA env: verify LIVE with evidence, resolve the ~20 VIU-confirm
   placeholders (coverage-matrix §D), correct wording to the real build, then
   regenerate the import + populate `testrail-id-map.csv`.
6. VIU + TestRail push only after the feature is on a QA env AND the user grants
   explicit TestRail permission (Standing Rule 6).

## 7. Env / access facts

- **TBD — feature not yet confirmed on any QA environment.** No QA host, no
  quick-login, no feature-flag confirmation recorded yet. Populate this section once
  the user provides the QA env + flag status (OQ-5). Secrets (cookies/tokens) go in
  `/tmp` only — never in this repo.
- Backend endpoints from the spec (for later API-section cases): `GET /api/search`
  (params `q`, `scope`, `context`, `limit`, `cursor`); `GET /user/recent-entities`;
  `POST /user/recent-entities/touch`; existing quick-action endpoints
  `POST /work-orders/{id}/lines`, `POST /work-orders`, `POST /customers`.

## 8. Open threads

- **OQ-1 PO = Branko (RESOLVED); OQ-2 spec URL (RESOLVED).**
- **⚠️ OQ-4 Epic/Jira key — STILL OPEN: ASK THE USER for it when VIU is started**
  (user doesn't have it yet as of 2026-07-16).
- **OQ-3 AI/"ask a question" scope — STILL OPEN** (AI is out of V1 scope per Figma;
  confirm whether the "Search or ask a question" placeholder still ships in V1).
  **2026-07-31:** Branko ruled the AI element out of the **Filters** PRD's scope — that
  does **not** answer it for **Global Search V1**, so OQ-3 stays open (see §0.0 item 3).
- OQ-5 (QA env + feature-flag status) — not yet known; VIU + TestRail push wait on it.
- ~20 VIU-confirm placeholders (see `coverage-matrix.md` §D): footer legend text,
  "Show all N" link text, Show-all target (OQ-SPEC-1), highlight color, full status
  badge set, part stock orange/red, Part Sale row cluster, "Contact/info match" label,
  fuzzy "≈"/italic indicator, pinned top ID-match row, hover conditional visibility,
  error banner, entry-point placement, API response/error shapes, "Refresh" link
  (screenshot 3) V1-scope.
- Footer legend wording differs slightly between Figma captures and spec prose —
  VIU-confirm exact on-screen text.
- Confirm whether the "Refresh" link (screenshot 3) is in V1 scope (spec §2 lists a
  data-freshness/refresh indicator as a NON-GOAL).

## 2026-08-21 — REVIVED as v2 (test-case creation lane)
- QA lead assigned Global Search with the v2 Unified Search Framework tech plan, epic SV-9160 (24 children), current PRD (Confluence v8 / in-body v1.1). PO Branko Cicovic.
- **11 v2 delta cases authored** (new entities Contacts/Purchase Orders/Vendor Invoices; tabs-only; D16 group order; D18 quick actions; 9-entity permissions + price masking; recent-entities API; page-search cutover; mobile). Total suite **97** (86 v1 + 11 v2). Import + id-map regenerated; all C-IDs blank (never pushed).
- **13 v1 cases flagged SUPERSEDED/UPDATE** (Show-all, ask-a-question, catalogue, 6-entity perm/group/tab) — retire/rewrite is the QA lead's call (PO-GS-4).
- Full detail: revival-2026-08-21/REVIVAL-RECONCILIATION.md. PO questions: questions-2026-08-21/ (PO-GS-1..4).
- Rule-85 SOURCE-VERIFIED ONLY (no QA branch). NO TestRail/Jira writes.
