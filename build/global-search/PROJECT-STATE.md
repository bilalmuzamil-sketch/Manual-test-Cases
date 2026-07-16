# Global Search — PROJECT STATE (canonical cold-resume doc)

> **Read this first to resume the Global Search project.** Single authoritative
> snapshot. Keep this project's memory SEPARATE from other projects; reuse shared
> infrastructure (staging/QA access method, harness scripts, TestRail API patterns,
> the two process docs) across all projects.

## 0. Status (as of 2026-07-16)

**STATUS: ONBOARDING — scaffold + spec ingest + design notes DONE. Case authoring
NOT started.**

- Spec: **INGESTED** (complete) → `requirements.md`. Source doc was a Confluence
  "Export to Word" MHTML/quoted-printable file; decoded with Python
  `quopri.decodestring` + BeautifulSoup (HTML→text preserving tables). Full spec
  captured verbatim-structured (background, goals, entities, ranking, fuzzy match,
  functional/non-functional reqs, dev plan/phasing, open questions).
- Design: **CAPTURE COMPLETE — 10 of 10 Figma screenshots** → `design-notes.md`.
  Two states are **OUT OF SCOPE** (do NOT author cases for them):
  (1) **AI search-all** ("AI search (out of scope)"),
  (2) **Header search component proposal** ("New search component proposal (Out of
  scope)").
- Cases: **NOT authored** (0). `cases/` holds `.gitkeep` + `README.md` only.
- TestRail: **NOT started** — no section, no cases, no map. `testrail-id-map.csv` is
  header-only. **No TestRail writes without explicit user permission** (Standing Rule 6).
- Env/VIU: **NOT available yet** — feature is feature-flagged and not confirmed on
  any QA env. VIU deferred until it ships to a testable environment.

## 0.5 What is blocking / awaiting

Awaiting from the user before case authoring:
- **PO / Product Owner name** (OQ-1) — not in the spec doc. Do NOT invent.
- **Canonical spec URL** (OQ-2) — the live Confluence page URL (the ingested file is
  an export; URL not embedded). Do NOT invent.
- **AI / "ask a question" scope decision** (OQ-3) — placeholder "Search or ask a
  question" + §8 "gracefully degrade when the AI flag is off" imply an AI capability;
  Figma screenshot 7 labels AI search **OUT OF SCOPE**. Confirm: is any AI/NL query
  behavior in V1? (If yes, needs its own spec section before authoring.)
- **Epic / Jira key** (OQ-4).
- **QA environment + feature-flag status** (OQ-5) — where will it be testable.
- Per **Standing Rule 11**, ASK which process(es) to run (BUILD-ACCURATE-WORDING-VIU
  and/or SPEC-RELEVANCE-RECONCILIATION) before authoring/VIU.

## 1. Project identity

- **Project:** Global Search (v2) — ShopView App feature.
- **Spec doc title:** "Global Search - Product Requirements & Development Plan".
- **Figma:** https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=12053-65992
- **Canonical spec URL:** TO CONFIRM WITH USER (see OQ-2).
- **PO:** TO CONFIRM WITH USER (see OQ-1). *(Never mix PO attributions across
  projects — Custom Roles has no single PO recorded; Fees & Discounts = Chris Ward;
  Simple Flow = Milos.)*
- **Epic / Jira key:** TO CONFIRM WITH USER (see OQ-4).

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

- `requirements.md` — COMPLETE structured spec (§1–§11) + onboarding open questions.
- `design-notes.md` — Figma capture, 10/10 screenshots, exact labels; out-of-scope
  states flagged.
- `cases/` — `.gitkeep` + `README.md` (authoring pending).
- `testrail-id-map.csv` — header only (`internal_id,testrail_case_id,title,section`).
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

1. Read this file, then `requirements.md` (full spec) and `design-notes.md` (labels).
2. Get the user to answer §0.5 open questions (PO, spec URL, AI scope, epic, env).
   Update `requirements.md` §1/§11 + this doc's §1 with the confirmed values.
3. Per Standing Rule 11, ASK which process(es) to run.
4. When authoring: create per-case JSON in `cases/` (`GS-<AREA>-NN` IDs), respecting
   Standing Rule 4 (API sections) + Rule 9 (build-accurate wording from
   design-notes, VIU-confirm once live). Skip out-of-scope states.
5. Build deliverables (Blockers Tracker + Results workbook + import) with TestRail
   Case ID + Link columns (Standing Rule 8) — generators to be created.
6. VIU + TestRail push only after the feature is on a QA env AND the user grants
   explicit TestRail permission.

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

- OQ-1..OQ-6 in `requirements.md` §11 (PO, spec URL, AI scope, epic, env, design
  completeness — design now 10/10 so OQ-6 largely resolved; the error/"Search
  unavailable" state + "Refresh" link + fuzzy "≈" treatment were not in the
  screenshots and still need VIU confirmation).
- Footer legend wording differs slightly between Figma captures and spec prose —
  VIU-confirm exact on-screen text.
- Confirm whether the "Refresh" link (screenshot 3) is in V1 scope (spec §2 lists a
  data-freshness/refresh indicator as a NON-GOAL).
