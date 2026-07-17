# Filters (Work Order List Filtering) — PROJECT STATE
**Canonical cold-resume doc. Read this first to resume the Filters project.**
Last updated: 2026-07-17 (Q2/Q4 case edits APPLIED + PUSHED TO TESTRAIL —
FLT-PERS-02/C29614, FLT-TAB-02/C29609, FLT-TAB-03/C29610, 3/3 update_case
200 + re-GET confirmed, user-authorized pass, audit log at
`branko-answers-2026-07-17/testrail-update-log.md`; import + id-map
regenerated, id-map re-merged 79/79. Earlier same day: superseded-reshare
question RESOLVED — user ruling A, ZIP=final baseline confirmed unchanged;
Branko's 4 answers ingested + new design inputs [design-system zip + 9 PDFs]
reconciled; JE-tab frame captured → final set 50/50; IMPORTED TO TESTRAIL by
the user, id-map 79/79).

## §0 STATUS / WHAT'S LEFT TO DO — read first

**STATUS: IMPORTED TO TESTRAIL 2026-07-17 (BY THE USER)** — the 79 cases are
live in TestRail **suite 1, section group_id 4110 "Filters - (VIU Pending)"**,
with the 14 sections nested under it (4111–4124; API cases in section 4124
"API — Work Orders List Filtering"). Canonical TestRail URL:
https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=4110
**id-map POPULATED 79/79** (`build/filters/testrail-id-map.csv`, C29557–C29635;
matched by exact title, 0 unmatched; read-only API fetch — no TestRail writes).
Authoring recap: 79 cases / 14 sections, 81/81 spec lines + 18/18 final WO
design frames covered, 24 VIU-confirm notes, adversarial audit CLEAN 7/7,
Rule-16 import delivered at `testrail-import/filters-v1-testrail-import.csv`/`.xlsx`.

**WHAT'S LEFT TO DO (definitive post-import + post-Branko-answers list — recite
on resume):**
1. ✅ **DONE:** spec ingested (V1.0 confirmed current) · design final set
   **50/50 captured** (49 ZIP + the QB Journal-Entries tab 11982:8998
   captured-from-PDF-export 2026-07-17 — the one known gap, closed) ·
   79 cases authored + adversarial-reviewed CLEAN · Rule-16 import delivered ·
   **imported to TestRail by the user 2026-07-17 (suite 1, group 4110)** ·
   **id-map populated 79/79 by title-match (read-only)** ·
   **Branko's 4 PO answers INGESTED 2026-07-17**
   (`branko-answers-2026-07-17/answers-ingested.md` = source of record) ·
   new design inputs (design-system zip + 9 PDFs) inventoried + reconciled
   (`new-inputs-inventory-2026-07-17.md`; design-notes §E) ·
   **ROUND-2 PO QUESTIONS READY FOR BRANKO 2026-07-17**
   (`PO-Questions-Filters-Round2_2026-07-17.xlsx` + `.md`, generator
   `gen_po_questions_round2.py`; same two-sheet layman format as round 1):
   Q1 = spec-cleanup reminder for his PRD update (stale S2-N1/N2, S9-R2/R3,
   S10-R2 sentences vs his Q4=B/Q2=B rulings), Q2 = the zip-prototype
   "Reported"-vs-"Imported" status anomaly (item 4), Q3 = role-based filter
   lists (OQ-4). Awaiting his answers.
2. **Apply Branko's answers (consequences, per the ingestion doc):**
   **Q1=A — Parts/Reports filter screens ARE IN SCOPE** (9 Parts + 22 Reports
   screens) but authoring is **GATED ON Branko's PRD update** (no spec text
   yet — Standing Rule 1; est. +30–50 cases; then add_case push = fresh user
   authorization). **Q2=B — ✅ DONE 2026-07-17: FLT-PERS-02 (C29614) tightened
   to permanent per-user persistence** (browser-close + sign-back-in leg added;
   resolves OQ-5) **and PUSHED to TestRail (update_case 200, re-GET confirmed,
   user-authorized)** — at VIU only the exact on-screen labels remain to
   confirm. **Q3=A — "Lead Technician" everywhere; NO case changes** (cases
   already answer-proof; bug only if the build shows "Tehnician" at VIU).
   **Q4=B — ✅ DONE 2026-07-17: FLT-TAB-02/03 (C29609/C29610) rewritten**
   (Status chip shown greyed out, pre-filled, not clickable; "chip hidden"
   spec phrasing removed) **and PUSHED to TestRail (2/2 update_case 200,
   re-GET confirmed, user-authorized)** — at VIU still capture the exact
   disabled-chip labels live, esp. the Completed tab's pre-filled string (no
   design frame; the case note flags it). **Audit log:**
   `branko-answers-2026-07-17/testrail-update-log.md` (per-case before/after +
   HTTP statuses). Import + id-map regenerated same day (id-map re-merged
   79/79). **⚠️ Spec-stale flags for Branko's PRD update: S2-N1/S2-N2,
   S9-R2/S9-R3 (chip hidden → superseded by Q4=B) and S10-R2 ("browser
   session" → superseded by Q2=B).**
3. ✅ **RESOLVED (2026-07-17, user ruling A — design-notes §E c):** the
   superseded-reshare question is CLOSED. The 9 PDFs were a **completeness
   export only** — the **"ZIP = final" design baseline is CONFIRMED
   UNCHANGED**; Sorting stays OUT of scope (separate WIP feature); the older
   mobile variants and the Customer-v1 leading-checkbox dropdown variant
   remain SUPERSEDED (final right-side-✓ pattern wins). No scope revision.
4. **Design-system zip anomaly — NOW CARRIED BY THE ROUND-2 SHEET (Q2):** the
   zip is a Claude-Code skill package + coded Filters prototype = REFERENCE
   AID only, not authoritative frames; its prototype's status list ends
   **"Reported"** vs the design's/spec's **"Imported"** — asked of Branko as
   Round-2 PO Question 2 (`PO-Questions-Filters-Round2_2026-07-17.xlsx`/`.md`);
   awaiting his answer.
5. **VIU when the feature reaches a QA env (OQ-7):** ⚠️ ASK the user for the
   Epic/Jira key (OQ-3) AND which process(es) to run per Standing Rule 11
   (BUILD-ACCURATE-WORDING-VIU and/or SPEC-RELEVANCE-RECONCILIATION); resolve
   the 24 VIU-confirm placeholders live with evidence + confirm the exact
   on-screen strings for the already-pushed Q2/Q4 edits (item 2 — esp. the
   Completed tab's pre-filled Status-chip text); live-observe everything per
   Rules 10/12/13/14 (seed data yourself, never NOT-VERIFIED).
6. **Post-VIU deliverables per house conventions:** Blockers Tracker + results
   workbook (tab per status + Summary) with TestRail C-ID + link columns
   (Rule 8 — now possible via the populated id-map); bug drafts in layman form
   for any deviations (Rule 7); update the import to final (VIU-word-free stays).
7. **Housekeeping:** canonical Confluence spec URL still TO CONFIRM (OQ-2);
   permissions/role behavior unspecified in spec (OQ-4) — **now carried by
   the Round-2 sheet as PO Question 3** (awaiting Branko); env/access facts to record at VIU
   (OQ-7); WAIT on Branko's updated PRD (Parts/Reports sections + the Q2/Q4
   text corrections).

⚠️ **id-map protection:** `gen_import.py` REGENERATES `testrail-id-map.csv`
with BLANK C-ids — the map is now populated, so do NOT rerun gen_import.py
without preserving/re-merging the C-id column.

Last updated 2026-07-17 (post-import). Detail bullets below.

- **Cases AUTHORED 2026-07-17: 79 cases / 14 sections (13 functional + 1 API)** →
  `build/filters/cases/cases-A..D-*.json` (schema mirrors global-search; all
  `viu_status: VIU-Pending`; 24 cases carry explicit VIU-confirm notes for
  labels/behaviors unconfirmable from the design). Section breakdown: Filter Bar
  Layout and Visibility 3, Status 6, Customer 9, Lead Technician 7, Service
  Advisor 7, Asset on Site 6, Active Chips & Clear Filters 6, Collapse and
  Expand 5, Empty State 2, Tab Behaviour 5, Persistence 4, URL State 4, Mobile
  10, API — Work Orders List Filtering 5 (Standing Rule 4).
- **SCOPE RULING (recorded 2026-07-17):** cases cover the WORK ORDERS PAGE
  feature only — all 12 spec stories × the 18 final WO design frames (desktop +
  mobile). The **9 Parts + 22 Reports screens in the final ZIP design set are
  NOT covered by any spec story → NO cases authored for them** (no invention,
  Standing Rules 1/9); they are excluded-with-reason in `coverage-matrix.md` §C
  and raised as **PO Question 1 to Branko**. (This supersedes the onboarding
  note that the zip screens "ARE in scope because they are in the zip" — in the
  final design set yes, but case-authoring scope = spec coverage.)
- **Coverage: 100%** — every spec requirement line (81 S#-R#/N#/E# across
  Stories 1–12) and every final WO design frame (18) maps to ≥1 FLT- case:
  `build/filters/coverage-matrix.md` (§A spec, §B frames, §C exclusions).
- **Typo rule applied:** design's recurring "Lead Tehnician" is NOT codified —
  all cases say "Lead Technician" and carry typo-flag notes; PO Question 3
  confirms the ship spelling (design-notes §C.1).
- **Import READY (Rule 16, canonical):**
  `testrail-import/filters-v1-testrail-import.csv` + `.xlsx` via
  `build/filters/gen_import.py` — 79 rows, header BYTE-IDENTICAL to the
  fees-discounts / simple-flow / global-search imports (verified), 8 named
  columns + 2 trailing blanks, CRLF rows/LF cells, VIU-word-free +
  feature-flag-free (0 occurrences), API cases only in the em-dash
  "API — Work Orders List Filtering" section, deterministic ordering.
- **ID map (Rule 8):** `build/filters/testrail-id-map.csv` — **POPULATED
  79/79 (2026-07-17)** with the real TestRail C-ids (C29557–C29635) after the
  user's import; matched by exact title against `cases/*.json`, 0 unmatched;
  the 5 FLT-API cases confirmed in section 4124 "API — Work Orders List
  Filtering". ⚠️ gen_import.py regenerates this file with BLANK C-ids — don't
  rerun it without re-merging the C-id column.
- **PO questions ANSWERED BY BRANKO 2026-07-17** (were:
  `build/filters/PO-Questions-Filters_2026-07-17.xlsx` + `.md`, generator
  `gen_po_questions.py`). Verbatim answers + full consequence map =
  `build/filters/branko-answers-2026-07-17/answers-ingested.md` (raw export
  alongside): **Q1=A** Parts/Reports IN SCOPE (gated on his PRD update),
  **Q2=B** permanent per-user persistence (resolves OQ-5), **Q3=A** "Lead
  Technician" spelling confirmed, **Q4=B** disabled pre-filled Status chip on
  Estimates/Completed (supersedes spec S2-N1/N2, S9-R2/R3; S10-R2 superseded
  by Q2). Case-edit consequences in WHAT'S-LEFT item 2.
- **TestRail: cases IMPORTED BY THE USER 2026-07-17** (suite 1, group 4110,
  sections 4111–4124). **Q2/Q4 case updates PUSHED 2026-07-17 (user-authorized
  pass, exactly 3 update_case: C29614/C29609/C29610, 3/3 HTTP 200 + re-GET
  confirmed; audit log `branko-answers-2026-07-17/testrail-update-log.md`).**
  No other writes ever made (id-map fetch was read-only GETs).
  **NO TestRail writes without explicit user permission** — any future edit
  (Parts/Reports add_case, wording pass) needs fresh authorization + audit log.
- **VIU: PENDING** — needs the QA env/flag/API facts (OQ-7) + the Epic/Jira key
  (OQ-3, ASK THE USER at VIU) + canonical Confluence URL (OQ-2). Per Standing
  Rule 11 ASK which process(es) to run before starting.

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
  Atlassian-SSO login-walled). Spec V1.0 confirmed CURRENT (designer via user,
  2026-07-17).
- **Epic / Jira key: ⚠️ NOT AVAILABLE — ASK THE USER when VIU begins** (all story
  Jira fields "TBD"; do NOT invent).
- **Figma source:** file `DR4gEODShYgJqkozs3mF5q` node **11854-23562** "Work Order
  Explorations 20.4.2026"; the user's export zip `50219798-Filters.zip` (49 PNGs)
  = the FINAL design set (designer ruling 2026-07-17; design-notes §D/§Z).

## §2 Deliverables index

| Artifact | Path | State |
|---|---|---|
| Complete spec | `build/filters/requirements.md` | DONE 2026-07-17 (V1.0 confirmed current) |
| Design notes | `build/filters/design-notes.md` | DONE 2026-07-17 — ZIP-authoritative; §Z map (50/50) + §D completeness + §E new-inputs section |
| Design screenshots | `build/filters/design-screens/` | DONE — 59 PNGs (49 ZIP final set + 1 PDF-sourced JE tab + 9 retained superseded API renders) |
| New-inputs inventory | `build/filters/new-inputs-inventory-2026-07-17.md` | DONE 2026-07-17 — design-system zip + 9-PDF reconciliation verdicts + open questions |
| Branko answers ingestion | `build/filters/branko-answers-2026-07-17/answers-ingested.md` (+ raw xlsx) | DONE 2026-07-17 — source of record for Q1–Q4 rulings |
| TestRail update audit log | `build/filters/branko-answers-2026-07-17/testrail-update-log.md` | DONE 2026-07-17 — Q2/Q4 push, per-case before/after, 3/3 200 |
| Case source (79) | `build/filters/cases/cases-A..D-*.json` + `README.md` | DONE 2026-07-17 — all VIU-Pending; Q2/Q4 rulings applied to FLT-PERS-02 / FLT-TAB-02/03 |
| Coverage matrix | `build/filters/coverage-matrix.md` | DONE — 81/81 spec lines + 18/18 WO frames mapped; exclusions in §C |
| ID map | `build/filters/testrail-id-map.csv` | POPULATED 79/79 (2026-07-17, C29557–C29635) |
| TestRail import | `testrail-import/filters-v1-testrail-import.csv`/`.xlsx` | DELIVERED — IMPORTED BY THE USER 2026-07-17 (suite 1, group 4110); regenerated same day after the Q2/Q4 edits (matches TestRail) |
| Import generator | `build/filters/gen_import.py` | DONE (also regenerates the ID map) |
| PO questions | `build/filters/PO-Questions-Filters_2026-07-17.xlsx`/`.md` (+ `gen_po_questions.py`) | ANSWERED 2026-07-17 — see branko-answers-2026-07-17/ |
| This state doc | `build/filters/PROJECT-STATE.md` | current |

## §3 Open questions

Reader-facing product questions → the PO sheet (Q1 Parts/Reports scope, Q2
persistence duration, Q3 spelling, Q4 Estimates/Completed Status chip). QA-side
OQs live in `requirements.md` §"Open Questions": OQ-1 RESOLVED (numbering
artifact), **OQ-2** canonical Confluence URL TBC, **OQ-3** Epic/Jira key TBD (ask
at VIU), **OQ-4** permissions/role behaviour unspecified (no permission cases
authored — flagged, not invented), **OQ-5 RESOLVED 2026-07-17 (Branko Q2=B:
permanent per-user persistence)**, **OQ-6**
"Asset on Site" data source in the build (FLT-ASSET-02 note), **OQ-7** QA env /
feature-flag / API surface unknown (FLT-API-01..05 worded generically,
VIU-confirm), **OQ-8** spec↔Figma reconciliation — DONE via authoring: deltas
found = the Estimates-tab Status chip conflict (PO Q4), the chip truncation
composition (list+ellipsis vs count, FLT-CHIP-02 note), and the Parts/Reports
screens with no spec (PO Q1).

## §4 Env / access

- **TBD** — no QA environment, feature-flag status, or API endpoint known yet
  (OQ-7). Reuse the shared infra when VIU begins: `build/TESTING-RUNBOOK.md`,
  `build/APP-ACTIONS-PLAYBOOK.md`, quick-login/cookie method, harness scripts,
  TestRail API patterns. Secrets in `/tmp` only — never in the repo.

## §5 HOW TO RESUME (ordered)

1. Read this doc, then `build/filters/coverage-matrix.md` (scope + exclusions),
   then `requirements.md` / `design-notes.md` as needed.
2. **PO questions ANSWERED + Q2/Q4 APPLIED (2026-07-17):** Branko's answers
   are ingested (`branko-answers-2026-07-17/answers-ingested.md`); the Q2/Q4
   rewrites of FLT-PERS-02 / FLT-TAB-02/03 are DONE and PUSHED to TestRail
   (audit log `branko-answers-2026-07-17/testrail-update-log.md`). Still open
   from the answers: Q1 scope extension (Parts/Reports cases — WAIT for
   Branko's PRD update) and the VIU confirmation of the exact on-screen
   strings (esp. the Completed tab's pre-filled Status chip).
3. **TestRail: import DONE (user, 2026-07-17) + id-map populated** — cases live
   under suite 1 / group 4110; use `testrail-id-map.csv` for C-ids/links in all
   deliverables (Rule 8). Any TestRail EDIT still needs explicit user
   permission + a per-case audit log.
4. Before any VIU: ASK the user which process(es) to run (Standing Rule 11 —
   BUILD-ACCURATE-WORDING-VIU-PROCESS and/or SPEC-RELEVANCE-RECONCILIATION), and
   ASK for the Epic/Jira key (OQ-3) + canonical Confluence URL (OQ-2) + QA
   env/flag facts (OQ-7). VIU = live-observed with evidence only (Rules
   10/12/13/14); 24 cases carry explicit VIU-confirm notes to resolve first.
5. Regeneration: `python3 build/filters/gen_import.py` (import + ID map —
   ⚠️ blanks the C-id column; re-merge the populated C-ids afterwards),
   `python3 build/filters/gen_po_questions.py` (PO sheet).
