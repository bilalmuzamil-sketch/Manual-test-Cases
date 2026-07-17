# Filters (Work Order List Filtering) — PROJECT STATE
**Canonical cold-resume doc. Read this first to resume the Filters project.**
Last updated: 2026-07-17 (onboarding).

## §0 STATUS — ONBOARDING

- **Spec INGESTED 2026-07-17** → `build/filters/requirements.md` (COMPLETE spec,
  verbatim-structured: Business Case, Feature Overview, JTBD/Goals, Key Decisions,
  Stories 1–12 with every S#-R#/N#/E# requirement). Source = user-provided
  Confluence "Export to Word" .doc (`18e07e91-Filters_1.doc`), MHTML decoded via
  python email/quopri + BeautifulSoup. Spec Version 1.0, Status "Complete".
  **Doc gap flagged:** section numbering jumps 4 → 7 (no sections 5–6 in the
  export; OQ-1). No dev plan / permissions / open-questions sections in the spec.
- **Design capture IN PROGRESS by a parallel worker** →
  `build/filters/design-notes.md` + `build/filters/design-screens/` (do not assume
  complete until present and user-confirmed).
- **Case authoring NOT STARTED** — deliberately waiting for the user to CONFIRM the
  complete Figma design set before authoring. `cases/` is empty
  (`.gitkeep` + README).
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
| Design notes | `build/filters/design-notes.md` | parallel worker — in progress |
| Design screenshots | `build/filters/design-screens/` | parallel worker — in progress |
| Case source | `build/filters/cases/` | EMPTY (authoring pending design confirmation) |
| ID map | `build/filters/testrail-id-map.csv` | header only |
| TestRail import | `testrail-import/filters-testrail-import.csv`/`.xlsx` | NOT CREATED (after authoring; Rule 16 format) |
| This state doc | `build/filters/PROJECT-STATE.md` | current |

## §3 Open questions

Full list in `requirements.md` §"Open Questions" (QA-derived; the spec itself has
no OQ section): **OQ-1** missing spec sections 5–6 (numbering gap), **OQ-2**
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
2. Check `build/filters/design-notes.md` + `design-screens/` exist (parallel
   worker) and that the **user has CONFIRMED the full design set** — do not author
   cases before that confirmation.
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
