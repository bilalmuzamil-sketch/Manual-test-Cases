# Filters (Work Order List Filtering) — PROJECT STATE
**Canonical cold-resume doc. Read this first to resume the Filters project.**
Last updated: 2026-07-17 (onboarding).

## §0 STATUS — ONBOARDING

- **Spec INGESTED 2026-07-17 and ✅ CONFIRMED CURRENT (designer, via the user,
  2026-07-17)** → `build/filters/requirements.md` (COMPLETE spec,
  verbatim-structured: Business Case, Feature Overview, JTBD/Goals, Key Decisions,
  Stories 1–12 with every S#-R#/N#/E# requirement). Source = user-provided
  Confluence "Export to Word" .doc (`18e07e91-Filters_1.doc`), MHTML decoded via
  python email/quopri + BeautifulSoup. Spec Version 1.0, Status "Complete" —
  confirmed the LATEST version. The 4→7 section-numbering jump is a
  document-numbering ARTIFACT, not missing content (OQ-1 downgraded to a note).
  No dev plan / permissions / open-questions sections in the spec.
- **Design capture ✅ COMPLETE 2026-07-17 per the designer's FINAL-SET ruling** →
  `build/filters/design-notes.md` + `build/filters/design-screens/` (58 PNGs).
  **The user's Figma export zip `50219798-Filters.zip` (49 PNGs) IS the final
  design set**: 49/49 extracted, viewed, described (exact on-screen labels),
  committed (35 new + 14 already-committed API-2x equivalents, all pairs
  compared = MATCH); 0 unreadable. Canvas nodes NOT in the zip (WO-14.4
  exploration, Sorting, Components, page-level frames, desktop dropdown
  popovers, label strips, QB Journal-Entries tab) = SUPERSEDED, not missing —
  do not chase. Earlier user-pasted screenshots are IGNORED per the same
  ruling. Full zip→node→PNG map: design-notes.md §Z; completeness statement §D.
  Scope note: the final set INCLUDES the Parts (9) and Reports (22) filter-bar
  screens — they ARE in scope because they are in the zip. "Tehnician" design
  typo recurs in the final set (WO-list frames; Parts/Reports clean) —
  design-notes §C.
- **Case authoring NOT STARTED — now UNBLOCKED** (spec confirmed current +
  design set final/complete). `cases/` is empty (`.gitkeep` + README).
- **TestRail: NOTHING pushed; NO writes without explicit user permission**
  (Standing Rule 6 / standing user rule). `testrail-id-map.csv` = header only.
- **Deliverable format rule (Standing Rule 16):** the TestRail import MUST be pure
  1:1 with the established `testrail-import/*-testrail-import.csv` format (8 named
  columns + 2 trailing blank columns, header byte-identical to the
  fees-discounts / simple-flow / global-search imports, NO ID columns;
  traceability via `testrail-id-map.csv` per Rule 8; VIU-word-free +
  feature-flag-free; API cases in an "API — <leaf>" section per Rule 4).

## §1 Project identity

- **Feature:** Filters — a persistent multi-criteria filter bar on the Work Orders
  page (ShopView App): Status / Customer / Lead Technician / Service Advisor /
  Asset on Site chips, multi-select + search, Clear filters / Clear selection,
  collapse/expand toggle, per-user persistence, URL state, tab behaviour, mobile.
- **PO: Branko** (full name TBC — same PO as Global Search; NEVER mix PO
  attributions across projects: Filters=Branko, Global Search=Branko,
  Fees&Discounts=Chris Ward, Simple Flow=Milos).
- **Canonical spec URL (Confluence): TO CONFIRM — user provided the exported .doc
  2026-07-16** (when obtained: reference pointer only, do NOT fetch —
  Atlassian-SSO login-walled).
- **Epic / Jira key: ⚠️ NOT AVAILABLE — ASK THE USER when VIU begins** (all story
  Jira fields "TBD"; do NOT invent).
- **Figma source:** file `DR4gEODShYgJqkozs3mF5q` node **11854-23562** "Work Order
  Explorations 20.4.2026" (spec header also links node 11817-27678; per-story
  design node links recorded in requirements.md).

## §2 Deliverables index

| Artifact | Path | State |
|---|---|---|
| Complete spec | `build/filters/requirements.md` | DONE 2026-07-17 |
| Design notes | `build/filters/design-notes.md` | DONE 2026-07-17 — ZIP-authoritative; §Z map + §D completeness |
| Design screenshots | `build/filters/design-screens/` | DONE 2026-07-17 — 58 PNGs (49-file final ZIP set fully covered; 9 superseded API renders retained as reference) |
| Case source | `build/filters/cases/` | EMPTY (authoring pending design confirmation) |
| ID map | `build/filters/testrail-id-map.csv` | header only |
| TestRail import | `testrail-import/filters-testrail-import.csv`/`.xlsx` | NOT CREATED (after authoring; Rule 16 format) |
| This state doc | `build/filters/PROJECT-STATE.md` | current |

## §3 Open questions

Full list in `requirements.md` §"Open Questions" (QA-derived; the spec itself has
no OQ section): **OQ-1 RESOLVED 2026-07-17** (5–6 numbering gap = document
artifact, not missing content — designer confirmed spec current), **OQ-2**
canonical Confluence URL TBC, **OQ-3** Epic/Jira key TBD (ask at VIU), **OQ-4**
permissions/role behaviour unspecified, **OQ-5** persistence scope
(session-only vs durable per-user) — spec §2/§4 vs S10-R2 wording tension,
**OQ-6** "Asset on Site" data source in the build, **OQ-7** QA env / feature-flag
/ API surface unknown, **OQ-8** spec↔Figma reconciliation pending design-notes
completion.

## §4 Env / access

- **TBD** — no QA environment, feature-flag status, or API endpoint known yet
  (OQ-7). Reuse the shared infra when VIU begins: `build/TESTING-RUNBOOK.md`,
  `build/APP-ACTIONS-PLAYBOOK.md`, quick-login/cookie method, harness scripts,
  TestRail API patterns. Secrets in `/tmp` only — never in the repo.

## §5 HOW TO RESUME (ordered)

1. Read this doc, then `build/filters/requirements.md`.
2. Design set is FINAL & COMPLETE (designer ruling 2026-07-17; the export zip =
   the final set, fully captured — design-notes.md §D/§Z). Spec V1.0 confirmed
   current. **Authoring is unblocked.**
3. On go-ahead: author cases (`FLT-<AREA>-NN` JSONs in `cases/`, API cases in an
   "API — <leaf>" section per Rule 4), build `coverage-matrix.md`, adversarial
   self-review (Rule 15), then generate the import via a `gen_import.py`
   mirroring `build/global-search/gen_import.py` — output
   `testrail-import/filters-testrail-import.csv`/`.xlsx`, PURE 1:1 with the
   established format (Rule 16), VIU-word-free + flag-free, ID map per Rule 8.
4. **TestRail push only with explicit user permission.**
5. Before any VIU: ASK the user which process(es) to run (Standing Rule 11 —
   BUILD-ACCURATE-WORDING-VIU-PROCESS and/or SPEC-RELEVANCE-RECONCILIATION), and
   ASK for the Epic/Jira key (OQ-3) + canonical Confluence URL (OQ-2) + QA
   env/flag facts (OQ-7). VIU = live-observed with evidence only (Rules 10/12/13/14).
