# Global Search — PROJECT STATE (canonical cold-resume doc)

> **Read this first to resume the Global Search project.** Single authoritative
> snapshot. Keep this project's memory SEPARATE from other projects; reuse shared
> infrastructure (staging/QA access method, harness scripts, TestRail API patterns,
> the two process docs) across all projects.

## 0. Status (as of 2026-07-16)

**STATUS: CASES AUTHORED (86). TestRail push PENDING explicit user permission. VIU
PENDING (feature not yet on any QA env).**

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
- TestRail: **NOT pushed** — `testrail-id-map.csv` now lists all 86 internal IDs with
  BLANK TestRail Case IDs; import shows "pending push". **No TestRail writes without
  explicit user permission** (Standing Rule 6).
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
- `gen_import.py` — builds the import (VIU-word-free + feature-flag-free; API cases
  routed to an API-titled section; adds Internal ID + TestRail Case ID + Link cols).
- `GlobalSearch_TestRail-Import.csv` / `.xlsx` — 86 rows, "pending push" C-ids.
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
  `add_case` requires `custom_atmstatus:3` + `custom_automation_type:0`; result
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
