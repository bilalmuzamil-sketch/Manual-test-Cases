# Simple Flow — PROJECT STATE (canonical resume snapshot)

> **THIS IS THE CANONICAL STATE DOC for the Simple Flow project.** Single
> authoritative snapshot so the project can be resumed cold with zero
> re-discovery. **Confirm the project first** — this workspace holds 3 projects;
> the instruction must target **Simple Flow** (Epic SV-7301, PO = @Milos Vasic,
> app `sv7301.qa.shopview.com`). **Source of truth for per-case status:**
> `SimpleFlow_Blockers_Tracker.md`/`.xlsx` (regenerate with
> `python3 build/simple-flow/gen_blockers.py`). All counts below are cited from
> that tracker — re-read it if in doubt, never invent numbers.
>
> **Last updated:** 2026-07-13.

---

## 0. CURRENT STATE AT A GLANCE (read this first)

**Tally (2026-07-10 fresh VIU run — authoritative):**

| VIU status field (`cases/*.json`) | Count |    | Blocker category (tracker) | Count | Owner |
|---|---:|---|---|---:|---|
| VIU-Verified | **121** |    | READY (VIU-Verified, uploadable now) | **118** | — |
| VIU-Pending | **36** |    | BLOCKED — VIU PENDING (QA) | **31** | QA |
| Open-Question | **5** |    | BLOCKED — MILOS ANSWER | **13** | Milos (PO) |
|  |  |    | BLOCKED — BUG/RULING | **0** | — |
|  |  |    | BLOCKED — DEV NOT BUILT | **0** | Dev (Stories 7/8/9/14 built) |
| **TOTAL** | **162** |    | **TOTAL** | **162** | |

(The field count VIU-Pending 36 vs blocker VIU-PENDING(QA) 31 differ because a few
VIU-Pending cases are owned by the MILOS-ANSWER blocker; the 5 Open-Question cases
sit under MILOS/VIU-PENDING blockers.)

**TOP PENDING WORK ITEM — 4 unapplied V2.4 spec deltas (2026-07-10 silent
revision; `spec-diff-2026-07-10.md`).** A new spec upload
(`b91efa39-…BulkReceiving.doc`, dated 10 Jul 2026) is a **silent revision of V2.4**
— same version string / no change-log row, but the body genuinely changed. Four
deltas are **PROPOSAL-ONLY — NOT yet applied** to `requirements.md`, `cases/*.json`,
or TestRail:
- **Δ1 — VIN dropped from the Story-4 completion modal** (S4-R3: mileage + engine
  hours "when missing"; VIN moves to the reviewer/Story 16). Affects **SF-COMP-16,
  SF-VAL-02** (sanity: SF-REV-03, SF-UX-02).
- **Δ2 — Story-4 unapproved-line = Complete button DISABLED + tooltip** (S4-R8),
  **Story 4 only**; Stories 2/3/16 keep the error-toast/active-CTA model. Affects
  **SF-COMP-21, SF-COMP-22, SF-VAL-11** (must disambiguate flow; SF-REV-13 unchanged).
- **Δ3 — NEW receive-time gates S13-R6 (part# required) + S13-R7 (cost/sell
  required)** at Assign-Vendor/Accept-Delivery; receiving blocked until filled.
  Affects **SF-VEND-04, SF-VAL-06, SF-RCV-06, SF-PNFIX-05** (+ possibly a new case
  for S13-R7).
- **Δ4 — Mark-Reviewed "optional note" removed** (R7: VIN-only). Affects
  **SF-REV-06, SF-REV-10**.
- The new doc also folds the SV-8183 permissions section into the spec body — this
  is content we **already** hold in `requirements.md` §9 (no new action). It resolves
  **none** of the Round-3 PO questions and does not moot the $0-sell (Q5) or
  See-Financial-Data-gate (Q6) tensions. Full proposal: `spec-diff-2026-07-10.md`.

**New design bundle (2026-07-10, `890a4d0a-Simple_Flow_Design_2.zip`):**
byte-identical re-delivery of the 2026-07-09 bundle — **NO impact** (0 new / 0
changed design docs; 0 case impacts). Preserved at `design2-2026-07-10/`. Full
diff: `design-diff-2026-07-10.md`.

**What today's (2026-07-10) fresh VIU run accomplished:**
- **9 cases flipped VIU-Pending → VIU-Verified:** inventory-decrement live-proven
  (SF-COMP-07 + SF-QB-01 decrement-half), completion Pick step (SF-COMP-08), the
  bulk-receive cluster (SF-VAL-05, SF-VAL-06, SF-VPART-07, SF-PNFIX-01, SF-COMP-19,
  SF-COMP-13, SF-REV-04). **BUG-11 NOT reproduced** on the Bulk Receive path.
- **reviewer ≠ completer DESCOPED** (Milos ruling, relayed by QA lead): the identity
  block is NOT a v1 requirement — **self-review IS allowed when the role holds the
  Mark Reviewed permission (permission-gated only)**. SF-PERM-04/07 + SF-REV-09
  expecteds corrected (identity assertion removed, permission-gating retained);
  **SF-PERM-08 RE-PURPOSED** into the positive self-review case (NOT obsolete).
  **BUG-5 / TICKET 1 DROPPED** as expected behavior → BUG-RULING 4 → 0, READY 114 → 118.
- **4 cases pushed to TestRail** (QA-lead authorized): SF-PERM-04 (C29408),
  SF-PERM-07 (C29411), SF-PERM-08 (C29412), SF-REV-09 (C29394) — update + verify 200;
  audit `testrail-push-v2.4-log.md`. (Earlier same-week: SF-WOP-02 expected
  refinement pushed, case 29384.)
- **Per-role behavior matrix re-added to `requirements.md` §9** under its canonical
  SV-8183 title (matches §9.2 cell-for-cell — no conflict).
- **NEW env/build defect OBS-6 logged for dev:** the Part-History surface returns
  HTTP 500 (`GET /api/inventory/parts/history` → 500) and the part-detail page
  (`/parts/inventory/{id}`) crashes — blocks the Part-History log half of SF-QB-01
  and the vendor-PN inventory checks (SF-PNFIX-02/03/06).

**Env residual from the run (shared env — do NOT assume baseline):** P550848
inventory net 6→4 (2 units consumed by pick/decrement tests; WOs already gone so
units couldn't be returned); irreversible received ZZAUTOTEST deliveries
S-15797/S-15798 (received deliveries are not reversible in-app). All throwaway WOs
deleted; settings toggled during the run then RESTORED to the run baseline (verified);
Tech never swapped (still Technician).

**Waiting on / blocked (see §5 for detail):**
1. The 4 spec deltas above to apply → then VIU the new receive-time gates +
   Story-4 disabled-button + VIN-drop (needs fresh sv7301 cookies).
2. **~31 VIU-PENDING (QA)** — genuinely blocked on QuickBooks access, non-seedable
   data (VIN-less asset [POST /api/vehicles 405], genuine special-order cores,
   same-vendor/same-WO merge collision), invoiced/paid-WO state (not drivable
   in-harness), and OBS-6 Part-History surface.
3. **13 MILOS cases** gated on Round-3 answers.
4. **3 Milos deliverables READY TO SEND:** `PO-Questions-Round3.xlsx`,
   `SimpleFlow_Bugs-for-Milos-Confirm.xlsx`, `SimpleFlow_Bug-Drafts.xlsx`.
5. **4 active Jira bug drafts (TICKET 2–5) UNFILED** — no Atlassian MCP in this env;
   file from the chat app. Plus OBS-6 to raise with dev.
6. TestRail import files remain **INTERIM** (two-phase finalization); **no
   execution run exists** so VIU pass/fail is not logged in TestRail.

---

## 1. Summary

**What Simple Flow is:** ShopView **"Simple Mode — Streamlined Work Order
Completion & Bulk Receiving"** (Epic **SV-7301**, Owner @Milos Vasic). It shortens
/ skips legacy multi-step work-order completion and parts-receiving flows so users
reach the **same end state faster** — one-confirm WO completion, an in-modal
completion wizard, bulk PO receiving, vendorless / no-PN parts, inline part-number
fix, and an optional review sign-off gate. Behavior is **settings-driven** (the
Work Orders settings tab), **not** feature-flag-gated.

**Spec version:** **V2.4** — "Draft for build". 17 stories: S1–S15 =
SV-7696..SV-7710, S16 = SV-7870, S17 = SV-7876. Authoritative inputs = the **V2.4
spec doc** + the **2026-07-08 design bundle** (last-update-wins over the earlier
round-1 Milos answer sheet). **The 2026-07-10 spec upload is a silent V2.4 revision
carrying 4 unapplied deltas (see §0 / §5.E)** — future uploads under the same label
may also carry uncatalogued edits, so always diff, never trust the version string.

**Overall status:** Cases **authored (162)**, permissions applied (SV-8183),
deliverables regenerated (workbook, interim TestRail import, blockers tracker). VIU
is **PARTIAL but well advanced** — **121 VIU-Verified**. Stories 7/8/9/14 confirmed
BUILT & live-verified (DEV-NOT-BUILT = 0). The SV-8183 batch, the V2.4 reconciliation
batch (18 updates + 2 adds), the Milos Round-2 batch (5 updates), the SF-WOP-02
refinement, and the 4 reviewer-descope cases are all pushed & verified in TestRail.
Remaining work is the 4 spec deltas + the 31 VIU-PENDING (QA) (mostly genuinely
blocked) + 13 MILOS-ANSWER cases + filing the 4 bug drafts. **Do NOT write to
TestRail without explicit user permission.**

---

## 2. Case inventory

**Total authored cases: 162** (source: Blockers Tracker header).

**By authoring group (`cases/*.json`):**

| Group file | Count | Scope |
|---|---:|---|
| `group-A-settings-completion.json` | 56 | Settings, Completion (Stories 1–4), Cores, Tech story |
| `group-B-receiving-vendor.json` | 57 | Vendorless parts, Vendor-missing PO, PO multi-select, Bulk receive, apply-invoice, PN-fix, Receive/Accept-Delivery |
| `group-C-review-permissions-validation-edge.json` | 49 | Review (Story 16), UX, Permissions, Validation/Edge, QuickBooks/Inventory integrity |
| **TOTAL** | **162** | |

**By blocker category (Blockers Tracker "Summary — counts per category"):**

| Blocker category | Count | Owner |
|---|---:|---|
| READY (VIU-Verified, uploadable now) | 118 | — |
| BLOCKED — DEV NOT BUILT | 0 | Dev team (Stories 7/8/9/14 built) |
| BLOCKED — VIU PENDING (QA) | 31 | QA |
| BLOCKED — MILOS ANSWER | 13 | Milos (PO) |
| BLOCKED — BUG/RULING | 0 | — |
| **TOTAL** | **162** | |

**VIU status field tally across the case JSONs:** VIU-Verified **121** ·
VIU-Pending **36** · Open-Question **5** (= 162). READY (118) is slightly below
VIU-Verified (121) because a few VIU-Verified cases still sit under a MILOS-ANSWER
blocker. **BUG/RULING is now 0** (the 4 reviewer≠completer cases left after the
2026-07-10 descope; SF-PERM-02 + SF-PERM-06 flipped to READY earlier under the
UI-vs-API ruling). **DEV-NOT-BUILT is 0.**

**Stories 7/8/9/14 — CONFIRMED BUILT on sv7301 (RE-VIU BATCH 7, 2026-07-09):**

| Story (Jira) | Cases | Status now |
|---|---|---|
| Story 7 — PO multi-select (SV-7702) | SF-POSEL-01..06 | BUILT — all VIU-Verified |
| Story 8 — PO Bulk Receive page (SV-7703) | SF-BULK-01..10, SF-PERM-03, SF-VAL-09 | BUILT — SF-BULK-01..09 + SF-PERM-03 Verified; SF-BULK-10 (needs-data core) + SF-VAL-09 (needs invoiced/paid WO) VIU-Pending |
| Story 9 — Apply invoice to selected POs (SV-7704) | SF-INV-01..03, SF-VAL-10 | BUILT — all VIU-Verified |
| Story 14 — Waiting-on-Parts column (SV-7709) | SF-WOP-01..03 | BUILT — all VIU-Verified |

**VIU-PENDING (QA) (31) by sub-bucket (tracker):** reachable-now **1** (SF-QB-09
open question, needs dev confirm) · needs-data **30** (state not seedable via the
app) · needs-account **0** (role-switching is self-service). Needs-data headliners:
QuickBooks-connected access (SF-VMIS-03/06, SF-RCV-08, SF-QB-03..08), an
invoiced/paid WO (SF-VAL-09, SF-VEND-05 — invoicing not drivable in-harness),
special-order `is_core` part (SF-BULK-10, core cases SF-CORE-02..09, SF-REV-14),
same-vendor/same-WO merge collision (SF-VEND-02/03), VIN-less asset (SF-VAL-02;
POST /api/vehicles 405), Part-History surface (OBS-6: SF-QB-01 log-half,
SF-PNFIX-02/03/06), Milos Q11 group-ordering (SF-RCV-05/07).

---

## 3. TestRail state

- **Project 1 · Suite 1 "Master"** on `https://shopview.testrail.io`.
- Cases imported under **parent section 4058** (leaf sections per functional area).
- **API sections** (STANDING RULE 4): **`API — Work Order Settings` (section 4089)**
  and **`API — Permissions` (section 4090)** — 7 cases: SF-SET-04/07/09/11/12,
  SF-PERM-01/06.
- **Case-ID map:** `build/simple-flow/testrail-id-map.csv` — 161 data rows
  (`ID,sf_id,title,section`). Case IDs run ~C29282..C29440. `gen_update.py` uses it
  to produce ID-matched update files.
- **What's synced (all pushed & re-fetch-verified):** the **SV-8183 permissions
  batch**; the **V2.4 reconciliation batch** (18 in-place updates + 2 adds —
  SF-VMIS-07 → C29439 [sect 4073], SF-RCV-10 → C29440 [sect 4079]); the **Milos
  Round-2 batch** (5 updates); the **SF-WOP-02 expected refinement** (case 29384);
  and the **reviewer-descope batch (2026-07-10)** — SF-PERM-04 (C29408), SF-PERM-07
  (C29411), SF-PERM-08 (C29412), SF-REV-09 (C29394), all update 200 / verify 200
  (GET→diff→update-changed-only→re-fetch-verify). Audit: `testrail-push-v2.4-log.md`.
- **All 162 authored cases exist in TestRail.** The 4 spec deltas (§0/§5.E) are
  **NOT yet pushed** (proposal-only).
- **No execution run** exists → VIU pass/fail is **NOT** logged as a TestRail run;
  per-case VIU status lives only in `cases/*.json` + `SimpleFlow_Blockers_Tracker.*`
  + `SimpleFlow_Results.*`.
- Import files (`testrail-import/simple-flow-v1-testrail-import.csv`/`.xlsx`) are the
  full-suite upload; `simple-flow-v2.4-update.xml` / `simple-flow-UPDATE.xml` are
  update-only artifacts. **Import files remain INTERIM** pending post-VIU +
  dev-answer finalization (two-phase plan in `RESUME-STRATEGY.md`).

---

## 4. Deliverables index (paths relative to repo root `/home/user/Manual-test-Cases/`)

**Test cases (authored source):**
- `build/simple-flow/cases/group-A-settings-completion.json` — 56 cases.
- `build/simple-flow/cases/group-B-receiving-vendor.json` — 57 cases.
- `build/simple-flow/cases/group-C-review-permissions-validation-edge.json` — 49 cases.

**Human-readable workbooks / CSVs:**
- `build/simple-flow/SimpleFlow_V1_TestCases.xlsx` / `.csv` — full test-case workbook (tab-per-area + Open Questions).
- `build/simple-flow/SimpleFlow_QA_Execution_Guide.md` — QA execution guide (VIU / env / seeding).
- `build/simple-flow/SimpleFlow_Settings_QuickReference.xlsx` — settings quick-ref.

**TestRail import / update artifacts:**
- `testrail-import/simple-flow-v1-testrail-import.csv` / `.xlsx` — full-suite import (all 162; VIU-word-free, feature-flag-free; leaf + API-titled sections).
- `testrail-import/simple-flow-v2.4-update.xml` and `testrail-import/simple-flow-UPDATE.xml` — update-only ID-matched files.
- `build/simple-flow/testrail-id-map.csv` — sf_id ↔ TestRail Case-ID map (161 rows).

**Tracking / status:**
- `build/simple-flow/SimpleFlow_Blockers_Tracker.md` / `.xlsx` — **source of truth** for per-case state + blocker + owner + what's-needed.
- `build/simple-flow/SimpleFlow_Results.xlsx` / `.csv` — per-status results workbook (tab per status + Summary), built by `build_results_workbook.py`.
- `build/simple-flow/PROJECT-STATE.md` — **this file** (canonical resume snapshot).
- `build/simple-flow/PROJECT-STATUS.md` — narrative status log.
- `build/simple-flow/RESUME-STRATEGY.md` — two-phase finalization + unblock→update loop.
- `build/simple-flow/UPDATE-LOOP-README.md` — the unblock→update loop process.

**Analysis / mapping / diff docs:**
- `build/simple-flow/requirements.md` — COMPLETE spec (V2.4 + §9/§10 SV-8183 permissions incl. re-added per-role behavior matrix + V2.4 interpretation notes).
- `build/simple-flow/spec-current-source.md` — readable V2.4 spec source; `spec-change-diff.md` — V2.4-vs-V2.3 diff.
- `build/simple-flow/spec-diff-2026-07-10.md` — **the 4 unapplied V2.4-silent-revision deltas** (Δ1–Δ4) + Round-3 impact analysis (proposal-only).
- `build/simple-flow/spec-epic-diff-latest.md` — 2026-07-09 spec/design/epic ingest + RE-VIU BATCH 7 proposal; companions `spec-latest-source.md`, `epic-content.md`, `design-latest-catalog.md`.
- `build/simple-flow/design-notes.md` — design catalog; `design-change-diff.md` (07-08 refresh); `design-latest-catalog.md` (07-09); `design-diff-2026-07-10.md` — **07-10 bundle = byte-identical re-delivery, no impact**; preserved copy `design2-2026-07-10/`.
- `build/simple-flow/contradiction-resolution.md` — last-update-wins conflict log (C1–C3 + the 2026-07-10 reviewer≠completer descope ruling).
- `build/simple-flow/finding-reclassification.md` — shortcut-principle reclassification.
- `build/simple-flow/bugs-log.md` — all VIU bugs/deviations (BUG-1..BUG-11, GAP-A/B, OBS-1..6).
- `build/simple-flow/viu-findings.md` — full VIU evidence + endpoints; `viu-evidence/` — screenshots.
- `build/simple-flow/jira-bug-drafts.md` — **4 active** ready-to-file Jira tickets (TICKET 2–5); BUG-5/TICKET 1 dropped.

**Milos (PO) questions & bug-confirm deliverables:**
- Round 1 (answered): `OpenQuestions-for-Milos.md`/`.xlsx` (11 Q); answers `milos-answers-source.*`; mapping `milos-answers-mapping.md`.
- Round 2 (answered + applied): `OpenQuestions-for-Milos-Round2.md`/`.xlsx` (5 Q); answers `milos-round2-answers-source.*`; mapping `milos-round2-mapping.md`.
- **Round 3 (READY TO SEND, awaiting answers):** `PO-Questions-Round3.md`/`.xlsx` (plain-language scenario stories).
- **`SimpleFlow_Bugs-for-Milos-Confirm.md`/`.xlsx`** — expected-vs-bug PO-confirm view (READY TO SEND).
- **`SimpleFlow_Bug-Drafts.md`/`.xlsx`** — the bug-draft workbook (READY TO SEND / file).
- Permissions source: `SV-8183-permissions-source.md`.

**Generators (Python):** `gen_import.py`, `gen_blockers.py`, `build_results_workbook.py`,
`gen_update.py`, `gen_cases.py`, `build_workbook.py`, `build_settings_quickref.py`,
`gen_milos_questions.py`, `gen_milos_questions_r2.py`, `gen_po_questions_round3.py`,
`gen_bugs_for_milos.py`, `gen_bug_drafts_workbook.py`.

**Audit logs:** `testrail-push-v2.4-log.md`, `testrail-sync-log.md`.

---

## 5. Open threads / what unblocks what

**A. Milos Round-2 (ANSWERED + APPLIED — `milos-round2-mapping.md`):** 5 cases
pushed live (update 200 / verify 200). Q1 review-note DESCOPED (BUG-3 closed); Q2
tech-story Story 17 authoritative; Q3 inventory decrements + writes Part History on
completion; Q4 vendorless part-request Category required / Sell NOT enforced (BUG-9 /
GAP-A closed); Q5 BE-enforcement RULED — UI gating = v1 PASS, API gap stays OPEN
(TICKET 2 / BUG-6/7).

**B. reviewer ≠ completer — RESOLVED (Milos ruling 2026-07-10, `contradiction-
resolution.md`):** the same-user IDENTITY block is **NOT a v1 requirement**;
self-review IS allowed when the role holds the Mark Reviewed permission
(permission-gated only). SF-PERM-04/07 + SF-REV-09 corrected & VIU-Verified;
SF-PERM-08 RE-PURPOSED into the positive self-review case (VIU-Verified). **BUG-5 /
TICKET 1 DROPPED** as expected. 4 cases pushed to TestRail (QA-lead authorized).

**C. 4 active Jira bug drafts (`jira-bug-drafts.md`) — NOT filed** (no Atlassian MCP
in this env; file from the chat app). All under epic SV-7301, Product Area = Work
Orders (`customfield_10153` id 10120):
1. **TICKET 2** (BUG-6 + BUG-7, Medium) — WO completion & review sign-off enforced
   UI-only, bypassable via API. (Milos R2 Q5: UI = v1 pass; this tracks the API-gap fix.)
2. **TICKET 3** (BUG-8, Medium) — required completion fields (mileage/VIN/engine
   hours) UI-only, not BE-enforced.
3. **TICKET 4** (BUG-11, **Low** — downgraded) — WO-PO receive HTTP 500 on the
   LEGACY Accept-Delivery path only; Bulk Receive works (`receive-requested-parts`
   → 200). **Not reproduced on the 2026-07-10 run.**
4. **TICKET 5** (GAP-B, Medium) — wrong first-use settings defaults
   (Auto-approve / Vendor-invoice).
   - CLOSED (Milos R2, not filed): BUG-3, BUG-9/GAP-A. Deliberately not filed:
     BUG-1, BUG-2, BUG-4, BUG-10. Dropped: BUG-5/TICKET 1.
   - **OBS-6 (NEW, for dev)** — Part-History surface HTTP 500
     (`GET /api/inventory/parts/history`) + part-detail page crash
     (`/parts/inventory/{id}`). Blocks SF-QB-01 log-half + SF-PNFIX-02/03/06. Raise
     with dev (possible env/build defect).

**D. BUG-11 status:** confined to the **legacy single-PO Accept-Delivery path**
(`POST /api/inventory/orders/accept`). The **Bulk Receive pipeline works** — WO POs
receive via `POST /api/orders/receive-requested-parts` → 200. LOW urgency (a working
path exists); not reproduced on the 2026-07-10 run.

**E. THE 4 UNAPPLIED SPEC DELTAS (2026-07-10 silent V2.4 revision) — TOP PENDING
WORK (`spec-diff-2026-07-10.md`, proposal-only):** Δ1 VIN dropped from Story-4
completion modal (SF-COMP-16, SF-VAL-02); Δ2 Story-4 unapproved-line = disabled
Complete button + tooltip, Story-4 ONLY (SF-COMP-21/22, SF-VAL-11); Δ3 new
receive-time gates S13-R6 (part#) + S13-R7 (cost/sell) (SF-VEND-04, SF-VAL-06,
SF-RCV-06, SF-PNFIX-05, + possible new case); Δ4 Mark-Reviewed note removed
(SF-REV-06, SF-REV-10). SV-8183 fold-in = already held (no action). Resolves NO
Round-3 question. **Design bundle 2026-07-10 = byte-identical re-delivery, no
impact (`design-diff-2026-07-10.md`).**

**F. Open items queued for NEXT Milos/dev round (Round-3, product decisions — not
bugs; `PO-Questions-Round3.*`):** vendor-missing group ordering on Bulk Receive
(OBS-2, wording; SF-RCV-05/07); **$0 sell price at completion** vs spec S5-R1 (Q5 —
unchanged by the 07-10 doc; note S13-R7 adds a *receive-time* cost/sell gate, a
different surface); See-Financial-Data gate on vendorless part-add (spec §9 asserts
option A but conflicts with Milos R2 Q4 — flag as spec-vs-answer contradiction);
Require-Review default per cohort; close/cancel confirmation modal.

**G. The 31 VIU-PENDING (QA) — genuinely blocked:** QuickBooks-connected access
(SF-VMIS-03/06, SF-RCV-08, SF-QB-03..08); invoiced/paid WO not drivable in-harness
(SF-VAL-09, SF-VEND-05); special-order core not seedable (SF-BULK-10 + core cases);
merge-collision seeding (SF-VEND-02/03); VIN-less asset (SF-VAL-02; POST
/api/vehicles 405); Part-History surface (OBS-6); Milos Q11 group-ordering
(SF-RCV-05/07); SF-QB-09 open question (dev confirm).

**H. Residual disposable-env state (harmless):** irreversible received ZZAUTOTEST
POs/deliveries (RE-VIU BATCH 7/8 + the 2026-07-10 run S-15797/S-15798) remain on the
shared sv7301 env — received deliveries are not reversible in-app. P550848 inventory
net 6→4. All reversible throwaway data deleted. **Shared env — re-read
`GET /api/organizations/settings` before every run; never assume baseline.**

---

## 6. Standing rules learned (Simple Flow) — all recorded in CLAUDE.md

- **Shortcut-interpretation principle (Simple Flow ONLY):** any behavior that
  reaches the same end state by SKIPPING a legacy flow/step is **EXPECTED** — a
  defect only if the skip (a) throws an ERROR or (b) corrupts data/inventory/
  Part-History integrity. (BUG-4 & BUG-10 → EXPECTED; BUG-11 → real defect on the
  legacy path; BUG-5/6/7/8/9 → OTHER.)
- **Last-update-wins contradiction rule:** when spec doc vs answer sheet vs design
  conflict, the MOST RECENT input is authoritative. Always DIFF new spec/design
  uploads — the version string is unreliable (the 2026-07-10 upload was a silent
  V2.4 revision).
- **Self-service test data & role-switching:** on the disposable QA env,
  create/delete whatever data a case needs; to test role behavior assign Tech the
  needed role then RESTORE Tech (exact email match `tech@shopview.com`; mark
  throwaway data ZZAUTOTEST).
- **API-folder rule (STANDING RULE 4):** any case with API endpoints/verbs/status
  codes/backend checks goes in a TestRail section whose title contains "API"
  (sections 4089/4090).
- Global: never write to TestRail without explicit user permission; confirm the
  target project on every instruction; never commit secrets (/tmp only); PO/dev
  questions in plain layman language, TestRail Case IDs in every deliverable.

---

## 7. Env & access facts (facts only — NO secret values; secrets live in `/tmp`)

- **QA env:** app `https://sv7301.qa.shopview.com`; API host
  `https://sv7301api.qa.shopview.com` (note `sv7301api`, no dot).
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` — **both return 200** (the
  earlier tech-403 is FIXED). Gated by cookies `sv_sso_session` / `PHPSESSID` /
  `cf_clearance` (domain `.qa.shopview.com`). quick-login is **stateful on the shared
  PHPSESSID** — probe roles STRICTLY SEQUENTIALLY. FE permissions at
  `GET /api/auth/me/fe-permissions` → `{data:{fe_permissions:[<codes>],view_mode,
  cross_toggles}}`.
- **Settings-driven, NO feature flag** — Work Orders settings tab. Read
  `GET /api/organizations/settings`; save `POST /api/organizations/settings/change`
  (full settings object). Settings atom IS backend-enforced (tech settings-change → 403).
- **Key routes:** WO settings `/administration/settings` → Work Orders tab; PO list
  `/parts/orders`; deliveries `/parts/deliveries`; shared Accept Delivery
  `/accept-delivery/{orderId}`; **Bulk Receive `/bulk-receive?ids=…`**; WOs
  `/workorders` → `/workorders/{id}/lines`.
- **Key endpoints:** PO list `GET /api/inventory/orders`; order detail
  `GET /api/inventory/orders/{id}`; deliveries `GET /api/inventory/deliveries`;
  inventory parts `GET /api/inventory/parts?…&search=`; **legacy single-PO Receive =
  `POST /api/inventory/orders/accept`** (500 for WO POs = BUG-11, low urgency);
  **Bulk Receive (WORKS for WO POs) = `POST /api/orders/receive-requested-parts`**
  (+ `GET /api/inventory/orders/receive-view`), from `/bulk-receive`; simple
  completion `POST /api/work-orders/{id}/simple-complete`; change status
  `POST /api/work-orders/change-status`; remove WO part
  `POST /api/work-orders/parts/delete {part_id,work_order_id}`; new part request
  `POST /api/work-orders/part/make-request`; assign vendor
  `POST /api/orders/{id}/assign-vendor`; part request status action
  `POST /api/work-orders/part/perform-request-status-action`. **OBS-6:** Part-History
  `GET /api/inventory/parts/history` → 500; part-detail `/parts/inventory/{id}` crashes.
- **Tech self-service role-switch (sv7301):** `POST /api/staff/{staff_id}/change`
  with `{first_name,last_name,email,role_id,workplace_id}` (+ job_title/salary/
  billable/clockable to avoid clobber). Tech: user `a7fd0a88-…`, **staff
  `6fb22c1b-…`**, restore role **Technician `131b5274-…`**, workplace `b3c8c820-…`,
  org `d55bc308-…`. EXACT-MATCH `email==='tech@shopview.com'` before changing;
  safety-net `restore-tech.mjs`. All 11 system roles are real & assignable. Roles
  list `GET /api/organizations/{org}/roles` (405 on `/api/roles`). Role ids: Admin
  `16fec34c…`, Service Manager `ef6e24c2…`, Senior Service Advisor `e03f176f…`,
  Service Advisor `3874cc56…`, Foreman `897018a5…`, Technician `131b5274…`, Parts
  Manager `5d703b9b…`, Parts Tech `486622b9…`, Office `163abe0d…`, Sales Rep
  `8eb4a1c1…`, Time Clock `0a198766…` (full map `/tmp/simple-flow/roles-map-6.json`).
- **Stories 7/8/9/14 BUILT** — PO multi-select (`checkbox_select_all_orders` /
  `checkbox_select_order_{id}`; Receive Selected → `/bulk-receive?ids=…`), Bulk
  Receive page ("Receive Vendor Parts", grouped by vendor, Vendor-Missing group with
  `select_assign_vendor_{poId}` + `input_part_number_{partId}`), Apply-invoice
  (`input_apply_invoice_{vendorId}`), Waiting-On-Parts column
  (`toggle_column_unreceivedPartRequestsCount`, off by default). Nothing is DEV-NOT-BUILT.
- **Cores:** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id); add via New Part Request → select_part catalog PN (forces
  Source=Inventory; qty via `input_bin_quantity_{binId}`). A genuine special-order
  (vendor-source) core is NOT seedable in-app.
- **Deliverable WO PO recipe (receive testing):** New Part Request → Source = Vendor
  + real vendor (e.g. Aabridge Beverages) + free-text Part Number → complete WO → PO
  becomes `status:ordered, vendorMissing:false`; receive via **Bulk Receive** (BUG-11
  blocks only the legacy Accept-Delivery path).
- **Harness gotchas:** node `fetch` is blocked for the TestRail host — push via
  **curl + Basic auth**. Chromium can't TLS through the egress proxy directly — build
  a **FRESH MITM bridge per run** (port rotates; read `$HTTPS_PROXY` live) and use the
  **boot2 hydration pattern** (seed cookies + localStorage, THEN navigate; the DEV
  login buttons don't reliably work). VIU tools in `/tmp/simple-flow/tools/`. Wake /
  poisoned-session recovery notes in `build/APP-ACTIONS-PLAYBOOK.md`. Secrets are
  ephemeral (`/tmp` only, re-supply per environment).

---

## 8. How to resume (ordered checklist)

**Confirm the project first** (this workspace holds 3 projects) — the instruction
must target **Simple Flow**.

**>>> DONE (through 2026-07-10):** Stories 7/8/9/14 built & live (DEV-NOT-BUILT = 0);
both spec-vs-Epic conflicts resolved in favour of the spec (no case changes); BUG-11
downgraded & not reproduced; fresh VIU run flipped 9 cases → 121 VIU-Verified;
reviewer≠completer descoped (BUG-5 dropped, 4 cases corrected + pushed to TestRail);
per-role matrix re-added to requirements §9; OBS-6 logged; the 2026-07-10 spec
(silent V2.4 revision, 4 deltas) and design (byte-identical) uploads diffed.

**>>> NEXT ACTIONS (priority order):**
1. **Apply the 4 spec deltas** (§0/§5.E, `spec-diff-2026-07-10.md`) to
   `requirements.md` + `cases/*.json`: Δ1 VIN-drop (SF-COMP-16, SF-VAL-02); Δ2
   Story-4 disabled-button+tooltip (SF-COMP-21/22, SF-VAL-11 — disambiguate flow);
   Δ3 new S13-R6/R7 receive gates (SF-VEND-04, SF-VAL-06, SF-RCV-06, SF-PNFIX-05,
   + possible new case); Δ4 Mark-Reviewed note removed (SF-REV-06, SF-REV-10). Then
   re-run `gen_blockers.py` + `gen_import.py` + `build_results_workbook.py`; emit an
   ID-matched `gen_update.py` file; **get user approval before any TestRail write.**
2. **Get fresh sv7301 cookies (admin + tech) into `/tmp` + rebuild the MITM bridge**,
   then VIU the new receive-time gates (Δ3), the Story-4 disabled Complete button
   (Δ2), and the VIN-drop (Δ1).
3. **Send Milos Round-3 + the bug-confirm sheet** — `PO-Questions-Round3.xlsx`,
   `SimpleFlow_Bugs-for-Milos-Confirm.xlsx`, `SimpleFlow_Bug-Drafts.xlsx` (all READY).
4. **Apply Round-3 answers when returned** — record verbatim + map (mirror
   `milos-round2-mapping.md`), flip `viu_status`/`expected` for the 13 MILOS cases,
   re-run generators, emit an ID-matched update file, ask before pushing.
5. **File the 4 active Jira bug drafts** (TICKET 2–5, `jira-bug-drafts.md`) from the
   chat app where Atlassian is connected; raise **OBS-6** with dev.
6. **Finalize the TestRail import (Phase 2)** once VIU + dev/Milos answers are in
   (`RESUME-STRATEGY.md` two-phase plan). **Never write to TestRail without explicit
   user permission.**

**Also needs-data (seed first, then re-VIU via `/bulk-receive`, not legacy
Accept-Delivery):** special-order core (SF-BULK-10 + SF-CORE-02..09, SF-REV-14);
merge collision (SF-VEND-02/03); VIN-less asset (SF-VAL-02); QuickBooks-connected
access (SF-QB-03..08, SF-VMIS-03/06, SF-RCV-08); drivable invoicing (SF-VAL-09,
SF-VEND-05). needs-account = 0 (role-switching is self-service; a 2nd/3rd role
account without See Financial Data would close the last SF-PERM-09/10 negatives).
