# Schedule — PROJECT STATE (canonical cold-resume doc)

> **Read this first to resume the Schedule project.** Single authoritative snapshot.
> Keep this project's memory SEPARATE from other projects; reuse shared infrastructure
> (staging/QA access method, harness scripts, TestRail API patterns, the two process
> docs) across all projects.

## 0. STATUS / WHAT'S LEFT TO DO — read first (Last updated 2026-07-22)

**IMPORTED TO TESTRAIL BY THE USER 2026-07-21 — id-map populated 166/166
(2026-07-22, READ-ONLY GETs, zero TestRail writes).** The user imported
`testrail-import/schedule-v1-testrail-import.csv` themselves (the Filters
precedent). Live location: project 1 / suite 1 ("Master"), **group section 4254
"Schedule - 2026 (VIU Pending)"** (parent 35), containing our **26 child sections
= ids 4255–4280 in our exact order** (4255 Navigation and Layout … 4280 Edge
Cases and Responsiveness). **Section names match ours 1:1, byte-identical — NO
name variance** (no em-dash/hyphen mangling this time; TestRail kept our
"and"-form titles as authored). Canonical TestRail URL (user-shared 2026-07-22):
https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=4254
Mapping: fetched 166 cases from sections 4255–4280 (get_sections + get_cases,
paginated), matched **166/166 by EXACT title+section** against `cases/*.json` —
0 unmatched, 0 extras; **C-id range C29925–C30090, contiguous**.
`testrail-id-map.csv` now carries all 166 C-ids.
**⚠️ id-map-regen GOTCHA (same as Filters):** `gen_import.py` REWRITES
`testrail-id-map.csv` with BLANK C-ids on every run — after ANY rerun, RE-MERGE
the C-ids (re-match by exact title+section from TestRail or from a saved copy)
before committing.

**STATUS: CASES AUTHORED & ADVERSARIALLY REVIEWED CLEAN 2026-07-21 (SPEC-ONLY — no
designs exist) — 166 cases / 26 sections authored from the v1.0 spec
(`cases/cases-A..F-*.json`, IDs `SCH-<AREA>-NN`; authoring commits 2e524ad→51af802).
The adversarial review found + FIXED 4 defects (commit 64b1813): (1) SCH-CONF-05 —
internal cross-ref mangled by the import cleaner into "(set up via/02)", reworded
id-free; (2) SCH-PERM-07 — math ⊇-notation in a reader-facing expected replaced with
layman wording; (3) SCH-TIP-01 — VIN-toggle case contradiction vs SCH-VIEW-04 fixed
by adding a "VIN toggle ON" precondition (**underlying spec §4.13-vs-§9 VIN-tooltip
inconsistency FLAGGED FOR BRANKO** — §4.13 lists tooltip VIN unconditionally, §9 ties
it to the toggle, default OFF); (4) SCH-START-06 — unobservable conditional expected
(7:00 AM fallback) removed, moved to notes. Coverage: **147 spec §1–§14 requirement
lines → case IDs, 0 gaps** (bidirectional check: 0 unmapped requirements, 0
unreferenced cases) + a **62-entry VIU-confirm register** (`coverage-matrix.md` §D:
all deferred labels/thresholds/enumerations/visuals/open behaviors). Explicit
exclusions: §15 future items + **NO API cases authored — spec has NO API contract,
ask Branko/dev if API coverage is wanted**. Import READY:
`testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` via `gen_import.py` — pure
1:1 with the established format (8 named columns + 2 trailing blanks, header
byte-identical to the fees-discounts / simple-flow / global-search / filters imports —
equality check PASSED), 166 rows, VIU-word-free + feature-flag-free, deterministic.
`testrail-id-map.csv` populated 166/166 (~~blank C-ids~~ → C-ids filled 2026-07-22,
see the IMPORTED block above; the push-pending note is SUPERSEDED by the user's own
import 2026-07-21). VIU pending the QA branch/env (OQ-3) + Epic key
(OQ-2, ask at VIU). Design reconciliation pending IF Figma ever arrives (OQ-4 — none
exists today).**

**PO = Branko** (confirmed 2026-07-21; same PO as Global Search & Filters; full name
TBC). **Epic/Jira key = ⚠️ NOT AVAILABLE — ask the user at VIU.** **QA branch/env +
feature-flag/settings status = ⚠️ NOT AVAILABLE — ask the user at VIU.**
**Figma/design = NONE at the moment (user confirmed 2026-07-21) — SPEC-ONLY project.**

**NOT DONE / NEXT:**
1. ~~TestRail push/import~~ — **DONE 2026-07-21 via USER IMPORT** (group 4254,
   sections 4255–4280); id-map populated 166/166 READ-ONLY 2026-07-22
   (C29925–C30090). Remember the gen_import.py id-map-blanking gotcha above.
2. **VIU PENDING the QA branch** — ⚠️ when VIU begins, ASK THE USER for: the
   **Epic / Jira key** (OQ-2, do NOT invent), the **QA branch/env +
   feature-flag/settings status** (OQ-3 — VIU + TestRail push both wait on this),
   and **which process(es) to run per Standing Rule 11**
   (BUILD-ACCURATE-WORDING-VIU and/or SPEC-RELEVANCE-RECONCILIATION). Then resolve
   the 62-entry VIU-confirm register (`coverage-matrix.md` §D: all spec-quoted
   labels, ~9 numeric/timing thresholds, the app-deferred enumerations
   [Status-filter list, department names, palette], all prose-only visuals, and the
   §D.5 open behaviors).
3. **If Figma/designs arrive** (OQ-4 — user says possible) — capture into
   `design-notes.md` FIRST, then run a design-reconciliation pass over the suite to
   tighten the 62 VIU-confirm items + Rule-9 wording (add design_refs, reconcile
   conflicts, as done for Filters).
4. **Flag to Branko:** (a) the **spec §4.13-vs-§9 VIN-tooltip inconsistency** (§4.13
   lists tooltip VIN unconditionally; §9 ties it to the VIN toggle, default OFF —
   cases currently authored to the toggle-gated reading, SCH-TIP-01/SCH-VIEW-04);
   (b) the **no-API-contract question** — spec v1.0 has zero endpoints; ask
   Branko/dev for the backend contract if API coverage is wanted (`gen_import.py`
   already routes `api_related` cases to an "API — <leaf>" section per Standing
   Rule 4).
5. **Expect spec revisions from the PO** — on each spec update, run
   SPEC-RELEVANCE-RECONCILIATION per Standing Rule 11 (ask first, as always).

## 0.1 Status detail

- Authoring: **DONE 2026-07-21** (SPEC-ONLY per §0.6's assessment — user launched
  authoring; commits 2e524ad→51af802). Verified before commit: 166/166 cases carry
  all schema fields; 0 duplicate ids/titles; import rows == case count (166); header
  equality vs all four prior imports PASSED; 0 VIU/flag words in import cells; no
  invented labels (spec labels verbatim, unpinned items generic + VIU-confirm notes);
  coverage matrix bidirectional check clean (147 requirement lines, 0 gaps).
- Adversarial review: **DONE 2026-07-21, CLEAN after fixes** (commit 64b1813) — found
  + fixed 4 defects: SCH-CONF-05 import-cleaner cross-ref mangle; SCH-PERM-07 math
  notation in reader-facing expected; SCH-TIP-01 VIN-toggle contradiction vs
  SCH-VIEW-04 (spec §4.13-vs-§9 inconsistency flagged for Branko); SCH-START-06
  unobservable expected removed. Import CSV/XLSX + id-map regenerated post-fix (166
  rows, header byte-identical, 0 VIU/flag words, 0 internal-id leaks).
- Spec: **INGESTED (complete)** → `requirements.md`. Source doc
  (`/root/.claude/uploads/.../beb1e7e0-Schedule.doc`) was a Confluence "Export to
  Word" MHTML / quoted-printable file (`Subject: Exported From Confluence`,
  `Content-Transfer-Encoding: quoted-printable`). Decoded with Python `email` (MIME
  walk to the `text/html` part → `get_payload(decode=True)`, which handles the
  quoted-printable) + BeautifulSoup, preserving all headings, lists, and tables. Full
  spec captured verbatim-structured (overview, personas, IA, 13 core-feature
  sub-sections, sidebar, toolbar, interactions, data model, view options, color
  system, NFRs, edge cases, success metrics, roles & permissions, future
  considerations). `file` reported "news or mail, ASCII text" (the MHTML signature) —
  same family as every prior ShopView spec.
- Design: **NONE (user confirmed 2026-07-21).** SPEC-ONLY. No `design-notes.md` (no
  Figma to capture). The spec has no images/Figma links/screenshot refs.
- Cases: **AUTHORED 2026-07-21 — 166 cases / 26 sections**, SPEC-ONLY, in
  `cases/cases-A..F-*.json` (internal IDs `SCH-<AREA>-NN`; schema identical to the
  Filters/Global-Search case JSON; every case `viu_status: VIU-Pending`,
  `api_related: false`, `design_ref: none - SPEC-ONLY`). Per-file split:
  A navigation+sidebar 30 · B dnd/scope/start/spread/series 36 · C
  blocks/lanes/day-view/modal 25 · D events/conflicts/capacity/tooltips 23 · E
  toolbar/views/reassign/delete/keyboard/color 35 · F permissions/edge 17.
- Deliverables: `coverage-matrix.md` (every §1–§14 requirement → cases; §15 + API +
  metrics exclusions; VIU-confirm register §D), `gen_import.py`, canonical import
  `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` (166 rows; header
  byte-identical to the other four project imports — verified), `testrail-id-map.csv`
  (166 rows, blank C-ids).
- TestRail: **NOT pushed** — `testrail-id-map.csv` C-id column blank. **No TestRail
  writes without explicit user permission** (Standing Rule 6).
- Env/VIU: **NOT available yet** — QA branch/env + flag/settings status unknown. VIU
  deferred until it ships to a testable environment.
- PO: **Branko** (confirmed 2026-07-21; full name TBC). Spec URL recorded (§1).

## 0.5 What is blocking / awaiting

Onboarding + authoring are done; remaining items:
- **⚠️ Epic / Jira key (OQ-2)** — ASK THE USER when VIU begins.
- **⚠️ QA branch / env + feature-flag/settings status (OQ-3)** — ASK THE USER; VIU +
  TestRail push wait on this.
- **Figma/designs (OQ-4)** — NONE at the moment (user-confirmed). If tighter
  visual/label fidelity is wanted before authoring, the user can provide Figma exports;
  otherwise author SPEC-ONLY with VIU-confirm placeholders.
- Per **Standing Rule 11**, ASK which process(es) to run before any VIU pass.
- **RESOLVED:** OQ-1 (PO = Branko), canonical spec URL recorded.

## 0.6 AUTHORING-READINESS ASSESSMENT (critical — read before authoring)

**Bottom line: the spec is LARGELY SELF-SUFFICIENT to author PRD-accurate manual test
cases now, WITHOUT designs — it is unusually label-rich and behavior-complete. It is
NOT a half-spec. Full build-accurate wording (Standing Rule 9) and all visual-rendering
details still require a LIVE VIU pass on a QA build (no QA env yet), exactly like every
other project. No part of the spec is genuinely un-authorable for lack of designs; the
gaps are the normal "confirm the exact on-screen label/visual live" gaps, handled with
VIU-confirm placeholders.**

**Why self-sufficient (what the spec DOES give):**
- Rich, explicit **behavior** for every feature: drag-and-drop scenarios (§4.1), scope
  picker (§4.3), multi-day spread (§4.5), linked-series banners (§4.6), overlap/lane
  stacking with the 3-lane cap + "+N more" (§4.7), day-view timeline interactions
  (§4.8), shift detail modal contents (§4.9), events (§4.10), conflict detection with
  the 4 conflict types (§4.11), capacity visualization (§4.12), hover tooltips (§4.13),
  filters (§5.1), toolbar controls (§6), micro-interactions incl. series-aware
  deletion scopes (§7), view options (§9), color system (§10), edge cases (§12).
- Many **on-screen labels are named in the prose**, e.g.: "Search work orders",
  "Search lines", "Needs techs" badge, "All / Unscheduled" chips, "Schedule whole work
  order", "Select multiple", "Select all", "Create shift · 2 lines · 6h", "Change
  scope", spread options ("Full estimate", "1 week", "2 weeks", "Until a date…",
  "Specific hours…"), "+N more", "Today" button, "Filter" button, "Clear all",
  "Filter and Display", "View Options" toggles ("Business Hours", "Capacity Bars",
  "Events", "Tech Hours", "Saturday", "Sunday"), "My Shifts", "VIN", right-click menu
  ("New Shift", "New Event", "View Day"), conflict types ("Double-booked", "Weekend
  shift", "Before hours", "After hours"), delete scopes ("This shift only", "This and
  everything after", "The whole series"), "OT" tag, "Adjust", "Reassign".
- A concrete **data model** (§8) with entities/fields/relationships.
- A complete **roles & permissions** model (§14) — View/Edit/Delete tiers with the
  Delete⊇Edit⊇View dependency, the Work Orders: View sidebar dependency (§14.2), the
  no-"own-only" rule (§14.3), and the department-based grid-row rule (§14.4). This maps
  cleanly to the Custom Roles permission-testing pattern already in this workspace.

**What genuinely needs LIVE VIU (NOT blockers to authoring — normal VIU-confirm; would
be tighter WITH designs but none exist):**
- **Exact on-screen wording** of every label above must be verified against the real
  build per Standing Rule 9 (PRD labels can differ from the shipped build). Author with
  the spec's wording, tag as VIU-confirm, correct live at VIU.
- **Visual-only rendering** described in prose but not shown (no Figma): shift block
  three/four-line anatomy & color tinting (§4.4), event-vs-shift card styling (§4.10),
  connected-series banner rendering across month/week/day (§4.6), lane-stacking growth
  & "+N more" popover (§4.7), capacity-bar blue-fill / amber-spill / OT-tag (§4.12),
  business-hours shading, now-line, drag ghost block. These are testable behaviorally
  from the spec (what appears/when), but pixel/label exactness needs the live build (or
  Figma if later provided).
- **Enumerations the spec defers to the app:** the Status-filter list ("All work order
  statuses currently supported in the app", §5.1) and department names (examples only)
  — source from the app at VIU.
- **Numeric/timing thresholds** to confirm live: 15-min snap, 300–500ms hover delay,
  4–7s toast, 150px/960px responsive breakpoints, auto-scroll buffer 30–60min.

**What is NOT in the spec (flag to user; may need more input):**
- **No API contract** — zero endpoints, HTTP methods, or status codes anywhere (unlike
  Global Search / Simple Flow / Fees & Discounts). If API-level cases are in scope
  (Standing Rule 4), the backend contract must be supplied; otherwise author UI-only.
- **No dev plan / phasing / rollout** section (Global Search had a 5-phase plan).
  Confirm delivery phasing with the PO if it affects scoping.
- **No Figma/designs** — user-confirmed NONE at the moment. Author SPEC-ONLY.

**Recommendation:** authoring can proceed SPEC-ONLY on the user's go-ahead, producing
PRD-accurate cases with VIU-confirm tags for unpinned labels/visuals; then VIU live
once a QA branch exists. If the user prefers maximum visual/label fidelity up front,
they can provide Figma exports first (optional, not required to start).

## 1. Project identity

- **Project:** Schedule — ShopView App · Technician Scheduling Module.
- **Spec doc title:** "Schedule" (Confluence export; Status Complete, v1.0, Last
  Updated July 15, 2026; Author "Product Team"; Stakeholders: Engineering, Design,
  Shop Operations).
- **Canonical spec URL (Confluence):**
  https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule
  (Atlassian-SSO login-walled — **reference pointer only; do NOT fetch**; content
  already ingested from the exported `.doc`).
- **Figma / design:** NONE at the moment (user confirmed 2026-07-21) — SPEC-ONLY.
- **PO: Branko** (confirmed 2026-07-21; full name TBC). *(Never mix PO attributions —
  Schedule = Branko; Global Search = Branko; Filters = Branko; Fees & Discounts =
  Chris Ward; Simple Flow = Milos.)*
- **Epic / Jira key:** ⚠️ NOT AVAILABLE YET — ASK the user when VIU begins (OQ-2).

## 2. Feature summary (one paragraph)

A visual **technician scheduling calendar** for shop managers: a top-level nav area
with a left **work-order sidebar** (mini calendar + searchable/filterable WO cards +
per-line drill-down with draggable, approved-only lines) and a main **schedule grid**
(Day / Week / Month, department-grouped technician rows, plus an in-grid Unassigned
lane). The core interaction is **drag-and-drop** of a WO card or line onto a
technician × day/time cell, which creates **shifts** — with a **scope picker** for
multi-line orders and a **multi-day spread** step for large jobs that produces a linked
**series** rendered as a connected banner. It adds **events** (non-WO time blocks),
**conflict detection** (double-booked / weekend / before-hours / after-hours),
**capacity bars**, hover tooltips, overlap **lane-stacking** (3-lane cap + "+N more"),
series-aware deletion, undo toasts, and keyboard support. Scheduling a tech onto a line
keeps the WO **labor roster** in sync. Access is gated by a **Schedule
View/Edit/Delete** custom-role permission tier (Delete⊇Edit⊇View) plus a **Work
Orders: View** dependency for the sidebar; grid rows are **department-based**, not
role-based. No API endpoints appear in the spec.

## 3. Deliverables index (this folder: `build/schedule/`)

- `requirements.md` — COMPLETE structured spec (§1–§15) + onboarding metadata + open
  questions (PO resolved = Branko; Epic key + QA branch = ask at VIU; no designs).
- `cases/cases-A..F-*.json` — **166 authored cases / 26 sections** (SPEC-ONLY,
  2026-07-21), IDs `SCH-<AREA>-NN`, all `VIU-Pending`.
- `coverage-matrix.md` — every spec §1–§14 requirement → case IDs; §C explicit
  exclusions (§15 items, **API NOT AUTHORED — no contract in spec**, §13 metrics,
  no mobile spec); §D VIU-confirm register (labels/thresholds/enumerations/visuals/
  open behaviors).
- `gen_import.py` — canonical import generator (Standing Rules 4/16 baked in).
- `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` — 166 rows, pure 1:1
  format (header byte-identical to the other four project imports — verified),
  VIU-word-free + feature-flag-free.
- `testrail-id-map.csv` — 166 rows (`internal_id,testrail_case_id,title,section`);
  the sole traceability source per Standing Rule 8; C-ids blank (not pushed).
- `PROJECT-STATE.md` — this file (canonical resume doc).

## 4. Shared infrastructure to reuse (do NOT re-invent)

- **Build-accurate wording + VIU method:** `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`
  (Standing Rules 9/10) — apply when the user asks and once the feature is VIU-able.
- **Spec-relevance / obsolescence reconciliation:**
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (Standing Rules 10/11).
- **Testing runbook / app-actions:** `build/TESTING-RUNBOOK.md`,
  `build/APP-ACTIONS-PLAYBOOK.md`.
- **Two-env permission-compare method:** `build/PROD-VS-STAGING-COMPARE-METHOD.md`
  (relevant to the §14 role-based access model — live per-role UI observation).
- **Permissions assessment:** `build/PERMISSIONS-ASSESSMENT.md`.
- **Import format template:** any existing `testrail-import/<project>-testrail-import.csv`
  + that project's `gen_import.py` (Standing Rule 16 — mirror 1:1).
- TestRail: project **1** / single suite **1 "Master"**; API v2 Basic auth; `add_case`
  requires `custom_atmstatus:3` + `custom_automation_type:0`; result statuses 1 Passed
  / 2 Blocked / 3 Untested / 4 Retest / 5 Failed. **Standing Rule 4:** any case
  touching API endpoints/methods/status codes → a TestRail section whose title includes
  'API' (NOTE: the Schedule spec currently has NO API content).

## 5. Testing-relevant highlights for future case authoring

- **Areas to cover (candidate `SCH-` groups):** sidebar (mini calendar, WO cards,
  search, filters, line drill-down), grid views (Day / Week / Month, department
  grouping, Unassigned lane), drag-and-drop scheduling, scope picker, shift start-time
  hierarchy, multi-day spread + series banners, shift block anatomy, overlap/lane
  stacking, day-view timeline interactions, shift detail modal, events, conflict
  detection, capacity visualization, hover tooltips, grid toolbar, micro-interactions
  (toasts/undo, keyboard, series-aware delete, reassignment), view options &
  customization, color system, permissions (View/Edit/Delete + WO-View dependency +
  department-based rows), edge cases, NFRs.
- **Permissions (§14):** View / Edit / Delete tiers (Delete⊇Edit⊇View); nav item hidden
  when View is OFF; sidebar hidden when Work Orders: View is OFF; NO "own-only"
  restriction (My Shifts is a convenience filter, not a boundary); grid rows are
  department-based, not role-based; clock-in gated by the staff "Time Clock" setting.
  Will need live per-role UI observation at VIU (Custom Roles pattern).
- **States to cover:** empty/first-time, unassigned shifts, conflicted shifts (each of
  4 types), overtime (OT tag, distinct from capacity), series (first/middle/last shift
  delete adaptivity), overflow ("+N more"), VIN-on vs VIN-off, each toolbar toggle
  on/off, business-hours shading, now-line.
- **Author from spec wording; mark unpinned labels VIU-confirm** (see §0.6). Do NOT
  invent labels. No API cases unless a backend contract is later provided.

## 6. How to resume (ordered)

1. Read this file (§0 first), then `coverage-matrix.md` (coverage + exclusions +
   VIU-confirm register), then `requirements.md` for spec detail. No
   `design-notes.md` (no designs exist).
2. Cases live in `cases/cases-A..F-*.json`; regenerate the import + id-map any time
   with `python3 build/schedule/gen_import.py` (deterministic; runs its own sanity
   checks — dupes, VIU/flag words, empty fields).
3. **⚠️ ASK THE USER for the Epic/Jira key (OQ-2)** and the **QA branch/env +
   flag/settings status (OQ-3)** before/at VIU. If the user later provides Figma,
   capture it into `design-notes.md` first and run a design-reconciliation pass.
4. Per **Standing Rule 11**, ASK which process(es) to run (BUILD-ACCURATE-WORDING-VIU
   and/or SPEC-RELEVANCE-RECONCILIATION) before the VIU pass.
5. VIU pass once on a QA env: verify LIVE with evidence (Standing Rules 10–14),
   resolve the VIU-confirm register (`coverage-matrix.md` §D), correct wording to the
   real build, then regenerate the import.
6. **TestRail push only after** the feature is on a QA env AND the user grants
   explicit TestRail permission (Standing Rule 6). After the push, re-merge the
   assigned C-ids into `testrail-id-map.csv` (gen_import.py blanks the C-id column
   on rerun — same gotcha as Filters).
7. If API cases become in-scope (Branko/dev supplies the contract): author them with
   `api_related: true` — the generator already routes them to an "API — <leaf>"
   section (Standing Rule 4).

## 7. Env / access facts

- **TBD — feature not yet confirmed on any QA environment / branch.** No QA host, no
  quick-login, no feature-flag/settings confirmation recorded yet. Populate this
  section once the user provides the QA env + flag/settings status (OQ-3). Secrets
  (cookies/tokens) go in `/tmp` only — never in this repo.
- **No API endpoints** are given in the spec (populate here if/when a backend contract
  is supplied).
- Reuse the workspace's shared staging/QA access method + harness (undici ProxyAgent /
  MITM bridge / boot2 hydration patterns) once the env is known — see
  `build/TESTING-RUNBOOK.md`.

## 8. Open threads

- **OQ-1 PO = Branko (RESOLVED 2026-07-21); canonical spec URL recorded (RESOLVED).**
- **⚠️ OQ-2 Epic / Jira key — STILL OPEN: ASK THE USER when VIU begins** (not available
  as of 2026-07-21).
- **⚠️ OQ-3 QA branch / env + feature-flag/settings status — STILL OPEN: ASK THE USER**
  (VIU + TestRail push wait on it).
- **OQ-4 Designs / Figma — NONE at the moment (user-confirmed 2026-07-21).** SPEC-ONLY
  authoring; VIU-confirm unpinned labels/visuals. User may provide Figma later
  (optional).
- **OQ-5 Spec-internal ambiguities** (see `requirements.md` open-questions): exact
  on-screen label wording (VIU-confirm), Status-filter enumeration + department names
  (source from app), NO API contract, NO dev/phasing plan.
- **OQ-6 FLAG TO BRANKO (from the 2026-07-21 adversarial review):** (a) spec
  §4.13-vs-§9 VIN-tooltip inconsistency (§4.13 lists tooltip VIN unconditionally, §9
  ties it to the VIN toggle, default OFF — cases authored to the toggle-gated
  reading); (b) the no-API-contract question (does Branko/dev want API cases? supply
  the backend contract if so).
