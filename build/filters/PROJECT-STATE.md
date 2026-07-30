# Filters (Work Order List Filtering) — PROJECT STATE
**Canonical cold-resume doc. Read this first to resume the Filters project.**

Last updated: 2026-07-29 (**LATEST — TECH-PLAN RECONCILIATION APPLIED, LOCAL ONLY,
NO TestRail writes**). The user provided the engineering tech plan for the
app-wide filter redesign (`tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`,
verbatim ingest). Full analysis = `tech-plan-2026-07-29/TECH-PLAN-DELTAS.md`;
change list + push queue = `tech-plan-2026-07-29/ChangeList.md`; quality gate =
`tech-plan-2026-07-29/RULE28-AUDIT-2026-07-29.md` (15 KEEP / 0 CUT, 15 SENSIBLE,
15 genuine+layman). Headlines:
- **Confluence spec is now v1.3 — we hold V1.0.** Spec v1.3 (2026-07-20) adds
  Parts filters (8 views), Reports filters (~21), **Story 13 Page Search (23
  reqs)**, **Story 14 nav search stops filtering lists**, a date-range chip type
  and per-view/per-tab state scoping — this IS the awaited "Branko PRD update".
  Request the export (Questions Q7) → then Rule-11 ask →
  SPEC-RELEVANCE-RECONCILIATION over the whole suite.
- **OQ-2 RESOLVED:** canonical spec URL =
  https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/572030978/Filters.
- **⚠️ Conflict with pushed cases:** engineering builds the Status chip HIDDEN on
  Estimates/Completed (G9) vs Branko Q4=B greyed-out-disabled — FLT-TAB-02/03
  (C29609/C29610) were pushed per Q4=B; Branko must re-rule (Questions Q1). NO
  edit made.
- **15 NEW cases authored** (blank C-ids, VIU-Pending): FLT-TAB-06 (default tab
  Estimates D10), FLT-STAT-07 (Imported exclusivity G1), FLT-ASSET-07 (Asset on
  Site "No" G4), FLT-URL-05 (link view runtime-only + back-to-saved G7),
  FLT-PERS-05 (per-view/per-tab scoping D20), FLT-PERS-06 (localStorage→account
  migration §4-3.3), FLT-RPTS-23 (date-range chip D19), FLT-PSRCH-01..07 (page
  toolbar search Story 13 + Story 14 decoupling; NEW section "Page Search
  Toolbar"), FLT-API-06 (prefs endpoint contract §4-1.3). **12 edit groups**
  (FLT-PERS-02/C29614 gains the cross-device leg — the only tester-facing content
  edit; the rest are QA-notes/metadata: FLT-STAT-03, FLT-CUST-05, FLT-TECH-07,
  FLT-ADV-07, FLT-EMPTY-01, FLT-MOB-04 conflict note, FLT-API-01..04 contract
  notes, FLT-PARTS-08/11/12 + FLT-RPTS-21/22 rollout notes, FLT-SRCH-01..09
  ownership notes). Pre-edit backups + apply script in
  `tech-plan-2026-07-29/backup/` (+ MANIFEST).
- **FLT-SRCH-01..08 flagged for transfer/retire:** per engineering (G8/D22) the
  spotlight/⌘K palette = Global Search v2 project; Filters ships the page-toolbar
  search instead — pending Branko Q6.
- **NEW TOTAL: 137 cases** (79 in TestRail C29557–C29635 + 58 blank C-ids).
  Import + id-map regenerated over 137, hygiene verified (header byte-identical,
  0 VIU/flag words, 79 C-ids re-merged). **PUSH QUEUE (awaiting authorization):
  15 add_case + 1 update_case (C29614).**
- **Questions doc READY:** `tech-plan-2026-07-29/Questions-for-Branko-dev.md`
  (Q1–Q6 A/B layman + Q7 spec-export request; QA mapping on the QA-only section).
- VIU-prep facts (no flag — D13 straight replace; prefs endpoint + pageKeys;
  test-ids; debounces; date-range URL form) recorded in TECH-PLAN-DELTAS.md §5.
- Report Suite crossover confirmed end-to-end (prefs endpoint is the shared
  cross-device layer; Phase 8 re-skins ~24 legacy report pages) — flagged in
  TECH-PLAN-DELTAS.md §7, NOT written into build/report-suite/.

Prior update: 2026-07-27 (**OPTION A: DESIGN-LEVEL Parts + Reports +
page-search cases AUTHORED, VIU-Pending, NO TestRail writes**). The user chose
Option A (author now from the captured designs rather than wait for the PRD).
**43 new cases authored** (all `viu_status` = VIU-Pending, design-only, not
live-verified — Rules 12/22), assigned next-free FLT- ids, added to
`testrail-id-map.csv` with **BLANK C-ids (need `add_case` later)**:
- **Parts filters — 12** (`cases/cases-E-parts-filters.json`, FLT-PARTS-01..12):
  one chip+column case per Parts page (Inventory / Part Sales / Catalog / Returns /
  Credits / Purchase Orders / Vendor Invoices / Vendors), the Part Type dropdown
  (Core / Non Core / Clear selection), the shared toolbar icons, + 2 behaviour
  cases flagged pending-PRD.
- **Reports filters — 22** (`cases/cases-F-reports-filters.json`, FLT-RPTS-01..22):
  one title+tabs+chips case per report screen (23 screens, tabbed ones folded:
  Technician Efficiency Invoiced+Completed = 1; QB Unexported 3 tabs = 1), + 2
  behaviour cases pending-PRD. New filter types noted: Location, Transaction Type,
  Invoice Status, Type, User, Mention.
- **Page search (⌘K) — 9** (`cases/cases-G-page-search.json`, FLT-SRCH-01..09):
  spotlight palette states (placeholder "Search or ask a question", entity tabs,
  grouped results + highlighting, recent searches, persisting search, hover
  quick-actions, keyboard footer, Refresh) + FLT-SRCH-09 scope-decision case.
  **Every page-search case carries an OVERLAP note: this component is also the
  Global Search project (86 cases already authored there, postponed) — reconcile /
  de-duplicate before any push.**

Behaviours the designs don't pin (which chips actually apply, option lists, new
filter-type logic, results behaviour, WO-parity) are written to the visible design
and carry a plain flag in the case ("Behaviour to confirm — pending Branko's
product write-up; to be checked live once the feature is available"). Titles all
≤ 80 chars. Refs = "Filters (Epic key TBD); Figma <node>; design-notes anchor"
(Epic key still unavailable — not invented, Rule 20).

**NEW TOTAL: 122 Filters cases** (79 existing WO cases C29557–C29635 + 43 new
design-level). Import + id-map regenerated over 122 (`gen_import.py`; SECTION_ORDER
extended with the 3 new sections). **Import hygiene RE-VERIFIED: header
byte-identical to the other project imports, 0 VIU/flag words in tester content,
no dup titles, no C-id column; id-map re-merged 79 existing C-ids preserved + 43
new blank.** ⚠️ `gen_import.py` blanks id-map C-ids on rerun — re-merge after any
regenerate.

**Branko PO-questions doc READY** (Option A deliverable) —
`PO-Questions-Branko-PartsReports-2026-07-27.md`/`.xlsx` (generator
`gen_po_questions_partsreports.py`; mirrors the prior PO sheets 1:1, layman/Rule 7,
QA-only mapping on a separate tab). 7 product questions: (1) the PRD/behaviour
write-up for Parts + Reports; (2) which shown filter buttons actually filter each
page; (3) full option lists per filter; (4) how the new filter types work;
(5) do Parts/Reports filters behave like Work Orders (multi-pick/clear/collapse/
remember/shareable/mobile); (6) page-search scope = Filters vs Global Search
(+ AI "ask a question"); (7) do filter choices differ by role on Parts/Reports.
**NOTHING pushed to TestRail; no secrets.**

**NEXT:** Branko's PRD/answers → then run SPEC-RELEVANCE-RECONCILIATION +
build-accurate wording + live VIU on the new cases (they are DESIGN-ONLY today);
resolve page-search scope with the Global Search project; then an authorized
`add_case` push for the 43 new cases (assign C-ids, re-merge id-map).

---

## 2026-07-28 — Cross-squad note from Report Suite kickoff (persistence)

**Documentation only — NO case edits, NO TestRail writes.** Mirrored here so the
Filters and Report Suite projects stay aligned (the CLAUDE.md + PROJECT-STATE docs
are the shared brain across parallel sessions — Standing Rule 20).

**The clash (flagged in Chris Ward's Report Suite kickoff video, 2026-07-28):**
engineer **Stefan Mitrovic** flagged a cross-squad overlap between the two persistence
models:
- **Report Suite** saves each user's filters / columns / sort **PER-USER-PER-COMPUTER
  (local only)** — it does NOT follow the user across devices.
- **The Filters squad (Branko + Miloš)** is building **account-level saved views +
  shareable links** that persist **ACROSS devices** (cloud-backed, tied to the user
  account, not the browser/machine).

**Decision from the call:** leave the **Report Suite persistence LOCAL for now**;
**sync and delegate the cross-device saved-view work to the Filters squad once the
Filters feature is on staging**, then Report Suite reuses / merges into it rather than
building its own cross-device layer. **Chris Ward will sync with Branko and report back
in Slack.**

**Who's involved:** Filters squad = **Branko (PO) + Miloš** (account-level +
shareable-link cross-device persistence, i.e. the owning squad). Report Suite = **Chris
Ward (PO) + Parth**. **Stefan Mitrovic** flagged the clash in the kickoff.

**ACTION for the Filters project:** when Filters' **account-level saved-views +
shareable-link** feature is built, it is **expected to be reused by the Report Suite**
(cross-device persistence for reports delegates to it). **Coordinate with the Report
Suite squad so the work is not duplicated** — Filters owns the shared cross-device
persistence layer; Report Suite consumes it. Track this when the feature reaches
staging / VIU.

**Impact on existing Filters persistence cases (FLAG ONLY — do NOT edit any case now):**
this relates to the existing **FLT-PERS-\*** cases. Those may need a **scope note** once
the cross-device / shareable-link behaviour is finalized WITH the Report Suite (e.g. to
clarify whether "remembered permanently" is per-account/cross-device vs per-device, and
how shareable links interact). **Flag only — no case changes this pass.** The cases:
- **FLT-PERS-01 = C29613** — page round-trip restore of filters + bar state.
- **FLT-PERS-02 = C29614** — filter selections remembered permanently (across app
  navigation + browser close + sign-back-in). ← most directly touched by the
  cross-device/account-level question.
- **FLT-PERS-03 = C29615** — saved filters are per-user (one user's filters don't
  appear for another).
- **FLT-PERS-04 = C29616** — a remembered value that no longer exists is silently
  dropped on return.

**Source docs (Report Suite project — cross-reference):**
- `build/report-suite/chris-answers-2026-07-28/video-deltas-2026-07-28.md` (item **P19**).
- `build/report-suite/chris-answers-2026-07-28/loom-kickoff-transcript.md` (~22:00–25:30).

---

Prior update: 2026-07-20 (**Branko's ROUND-2 ANSWERS INGESTED 2026-07-20
— Q1=A / Q2=A / Q3=A, all three CONFIRM the suite as-is; ZERO case edits and
ZERO TestRail writes required.** Source of record:
`branko-answers-round2-2026-07-20/answers-ingested.md` (+ raw xlsx). Q1=A he'll
fix both stale write-up sentences in the PRD update (PRD itself STILL AWAITED —
not attached); Q2=A "Imported" correct, demo "Reported" = typo → design-system
prototype anomaly CLOSED (FLT-STAT-01/06 + FLT-MOB-03 already correct); Q3=A
filter lists role-independent → **OQ-4 RESOLVED**, no role-based cases needed
(optional notes-only annotation on FLT-CUST-01/TECH-01/ADV-01 C29566/C29575/
C29582 — bundle with the next authorized push, not standalone). Earlier
2026-07-17: Round-2 question sheet + the PRD-update
request SENT to Branko by the user. Earlier
same day: Q2/Q4 case edits APPLIED + PUSHED TO TESTRAIL —
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

**NEW 2026-07-17: the user has SENT Branko (a) the Round-2 question sheet
(3 questions: stale-spec cleanup confirm, "Reported vs Imported" status,
role-based filter visibility) and (b) the explicit request to deliver the
promised PRD update covering the Parts + Reports pages (which filter chips per
page + option lists incl. new filter types Location / Transaction Type /
Invoice Status / Type / User / Date / Mention; whether all WO-page behaviors
[persistence/URL/clear/collapse/real-time] apply identically; page-specific
specials). **UPDATE 2026-07-20: (a) ANSWERED + INGESTED (Q1=A/Q2=A/Q3=A, see
LATEST above); (b) the PRD update is STILL AWAITED.**

**WHAT'S LEFT TO DO — the definitive waiting list (recite on resume):**
1. ✅ **DONE 2026-07-20: Branko's Round-2 answers INGESTED** (Q1=A/Q2=A/Q3=A —
   all confirmatory, zero case edits / zero TestRail writes required; OQ-4
   resolved [lists role-independent], prototype "Reported" anomaly closed
   [Imported correct]; source of record
   `branko-answers-round2-2026-07-20/answers-ingested.md`; optional Q3
   notes-only annotation on C29566/C29575/C29582 to bundle with the next
   authorized push).
2. **Branko's updated PRD** (request SENT 2026-07-17; NOT attached to his
   Round-2 answers — still awaited, incl. the two Q1 text fixes) → unlocks
   authoring the
   Parts/Reports case set (~30–50 cases from the 31 captured screens; run the
   standard pipeline: ask which process per Rule 11 → author → adversarial
   review → canonical Rule-16 import → user imports or authorized push).
3. **Feature on QA env → VIU** (ask the user for the Epic/Jira key + which
   process(es) per Rule 11; resolve the 24 VIU-confirm placeholders + confirm
   the exact on-screen strings for the 3 Branko-updated cases
   C29609/C29610/C29614).
4. **Housekeeping:** OQ-2 — canonical Confluence spec URL still to confirm.

Everything else is DONE as recorded below (79 cases in TestRail C29557–C29635;
3 cases updated per the Q2/Q4 rulings, audit-logged; import + id-map
regenerated intact; design baseline ZIP=final 50/50; Round-1 + Round-2 sheets
delivered).

**Detail (prior definitive list — all still accurate, kept for context):**
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
   lists (OQ-4). **SENT to Branko by the user 2026-07-17 (together with the
   PRD-update request) — awaiting his answers.**
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
4. ✅ **RESOLVED (2026-07-20, Round-2 Q2=A): design-system zip anomaly CLOSED** —
   "Imported" is correct; the prototype's "Reported" is a demo typo. The zip
   stays a REFERENCE AID only (Claude-Code skill package + coded prototype, not
   authoritative frames), now with a known-wrong status list on this point.
   FLT-STAT-01/06 (C29560/C29565) + FLT-MOB-03 (C29623) already use the correct
   9-status list incl. Imported — no changes.
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
| Branko answers ingestion (Round 1) | `build/filters/branko-answers-2026-07-17/answers-ingested.md` (+ raw xlsx) | DONE 2026-07-17 — source of record for Q1–Q4 rulings |
| Branko answers ingestion (Round 2) | `build/filters/branko-answers-round2-2026-07-20/answers-ingested.md` (+ raw xlsx) | DONE 2026-07-20 — Q1=A/Q2=A/Q3=A, all confirmatory; zero case edits/TestRail writes required |
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
at VIU), **OQ-4 RESOLVED 2026-07-20 (Branko Round-2 Q3=A: filter lists are
role-independent — same options for every role; no role-based cases needed;
glance-check across roles at VIU)**, **OQ-5 RESOLVED 2026-07-17 (Branko Q2=B:
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
