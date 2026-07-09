# Fees & Discounts V1 — PROJECT STATE (canonical resume snapshot)

> **THIS IS THE CANONICAL STATE DOC for the Fees & Discounts (F&D V1) project.** It
> is a single authoritative snapshot so the project can be resumed with zero
> re-discovery.
> **Last updated:** 2026-07-08 (after VIU **batch 2**, commit `93279ed`).
> **Source of truth for per-case status:** the case JSONs `build/fees-discounts/cases/*.json`
> (`viu_status`), tallied by `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md`/`.xlsx`
> (regenerate with `python3 build/fees-discounts/gen_blockers.py`). All counts below
> are cited from those files — do not invent numbers; re-read them if in doubt.
> Companion docs kept current: `PROJECT-STATUS.md` (narrative log), `viu-qb-findings.md`
> + `viu-findings.md` (VIU evidence + FDBUG register), `bugs-log.md`, `viu-recon.md`
> (env map), `RESUME-STRATEGY.md` (two-phase finalization).

---

## 1. Summary

**What F&D V1 is:** ShopView **"Fees & Discounts V1"** — the ability to add
fees/discounts (and a Processing Fee) at the whole-work-order, labor-line, part-line
and part-sale levels, from reusable admin **templates**, with **customer defaults**
(auto-applied to new WOs), a defined **calculation contract** (§5), rendering on
customer estimates/invoices, a WO **history log**, **QuickBooks** sync, and a
**Story-13 permissions model** (See Financial Data + WO/Lines Create&Edit + Manage
AP/AR gates). Controlled per-org by the **`FeesAndDiscounts` feature flag**.

**Spec status:** `requirements.md` is the working spec extract **incl. Story 13
permissions** and the §5 calculation contract. (Historical note: an earlier source
PDF was truncated at Story 2; the current `requirements.md` covers the stories
exercised by the 182 cases — S1–S14 + §5 + §7/§9/§10/§13.)

**Env:** app `https://qb.qa.shopview.com` · API `https://sv7387api.qa.shopview.com`
(SV-7387) · **`FeesAndDiscounts` flag = ON**. `QuickBooks` flag exists but is **not
connected** on this env. Full env/access map: `viu-recon.md`.

**Overall status:** **FEATURE LIVE on qb; cases authored (182) and adjudicated;
Deep-VIU batch 1 + batch 2 DONE.** After batch 2 the case JSONs stand at **88
VIU-Verified** and **94 not-yet-verified** (of 182). Interim TestRail import exists
and the two API-flagged cases were moved into API-titled sections. Remaining work is
gated on: **dev** (Stories 6/8/11 + the code-bug deviations), **PO** (deviation
confirmations + double-add + NOTE-FD-4), **QA** (fresh cookies → the VIU-pending
surfaces), and **restricted-role accounts** (4 Story-13 per-role negatives). **Do NOT
write to TestRail without explicit user permission.**

---

## 2. Case inventory

**Total authored cases: 182** (source: the three `cases/*.json` files; tallied by the
Blockers Tracker).

**By authoring group (`cases/*.json`):**

| Group file | Count | Scope |
|---|---:|---|
| `group-A-wo-parts.json` | 61 | WO whole-WO / labor-line / part-line adjustments, inline display, Stats, Financial Info card, Parts-page column + breakdown modal, edit/remove/stacking |
| `group-B-customer-admin-finance.json` | 83 | Customer Fees&Discounts tab + defaults lifecycle, Template admin (create/edit/delete/scoping/validation), Processing Fee, customer documents (estimate/invoice, Shop Supplies), QuickBooks, History log |
| `group-C-calc-permissions-validation.json` | 38 | §5 calculation contract, Story-13 permissions, feature-flag gating, validation / edge |
| **TOTAL** | **182** | |

**By delivery state (Task-1 classification of every case, from the Blockers Tracker):**

| State / bucket | Count | Meaning |
|---|---:|---|
| **VIU-Verified (READY)** | **88** | Exercised on the build and matches spec — uploadable now |
| **VIU-Deviation** | **27** | Built but deviates from spec (see §5 sub-split) |
| **Blocked — DEV NOT BUILT** | **11** | Surface absent: Story 8 Processing-Fee builder UI (4) + Story 11 Part Sales (7) |
| **Blocked — ENV** | **18** | Story 6 QuickBooks (13) + flag-off / shared-env (5) |
| **Blocked — NEEDS-ACCOUNT** | **4** | Story-13 per-role negatives needing a non-Tech role login (FD-PERM-004/008/010, FD-CUST-015) |
| **VIU-Pending** | **34** | Built surface, not yet driven (parts UI flows, invoice-time walk, retests); 6 of these are PO-flagged deviations |
| **TOTAL** | **182** | 88 verified + 94 not-yet-verified |

**VIU-Deviation (27) sub-split** (bug-vs-PO-question):

| Sub-bucket | Count | Cases |
|---|---:|---|
| **code-bug** (needs a dev fix) | 7 | FD-DOC-011 (FDBUG-1), FD-PROC-009 + FD-CALC-013 (FDBUG-2), FD-HIST-001 (FDBUG-3), FD-CALC-006 (FDBUG-10), FD-CALC-008 + FD-VAL-006 (FDBUG-9) |
| **PO-question** (needs a product ruling) | 3 | FD-STATS-001 (Stats layout, BUG-FD-2), FD-PERM-002 + FD-WO-013 (whole-WO FE-vs-BE enforcement, BUG-FD-3) |
| **case-update** (label/copy/UX drift — update case text once build confirmed intended) | 17 | FD-WO-001, FD-LABOR-001, FD-FIN-004, FD-REMOVE-001, FD-CUST-003/004/006/007, FD-TMPL-001/003/004/006/008/010/011, FD-PROC-008, FD-HIST-002 |

**Not-Built (11) by story:** Story 8 (Processing-Fee builder UI) = FD-PROC-001..004;
Story 11 (Part Sales fees/discounts) = FD-PCOL-001..007.

**ENV (18) by sub-bucket:** QuickBooks (Story 6, no QB connected on qb) = FD-QB-001..011,
013, 016 (13); flag-off / shared-env = FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012 (5).

**VIU-Pending (34):** 28 generic QA-pending (parts UI flows, invoice-time walk, misc
retests) + **6 PO-flagged deviations** batch-2 recorded but did not rewrite:
FD-WO-005 + FD-VAL-001 (BUG-FD-4), FD-INLINE-003 (BUG-FD-5), FD-STATS-002 + FD-STATS-004
(BUG-FD-2), FD-CUST-005 (NOTE-FD-5).

---

## 3. TestRail state

- **Project 1 · Suite 1 "Master"** on `https://shopview.testrail.io`.
- **F&D cases imported** under parent section **3894** = "Fees & Discounts
  (VIU-PENDING)" (the brief's older id 3822/3822-prefix was renamed/superseded; 3894
  is the live parent — see `section-rename-log.md`). Leaf sections per functional
  area; the "Fees and Discounts V1 > " prefix was stripped from all 70 sections.
- **API sections (STANDING RULE 4):** the two API-flagged cases were moved into
  API-titled sections under parent 3894 —
  **`API — Customer Fees & Discounts tab — negative` (section 4087)** = FD-CUST-017
  (case 28501) and **`API — Processing Fee — negative` (section 4088)** = FD-PROC-010
  (case 28528). Audit: `testrail-fd-api-section-move-log.md`.
- **F&D Case-ID map:** **BUILT 2026-07-09** → `build/fees-discounts/testrail-id-map.csv`
  (columns `ID,fd_id,title,section`; all **182** cases mapped read-only against the live
  suite under parent 3894). **178** matched on exact (normalized) title; the remaining
  **4** matched via the documented feature-flag-free rename ("feature flag" /
  "FeesAndDiscounts flag" → "Fees & Discounts feature"), each an unambiguous 1:1 pairing:
  FD-HIST-004→28563, FD-PERM-010→28594, FD-FLAG-001→28596, FD-FLAG-002→28597. The 2 API
  cases confirm the earlier log (FD-CUST-017→28501, FD-PROC-010→28528). Use this before
  any ID-matched TestRail update loop. **Never write to TestRail without explicit user
  permission.**
- **Import files remain INTERIM** (`testrail-import/fees-discounts-v1-testrail-import.csv`
  / `.xlsx`, all 182; VIU-word-free + feature-flag-free per user rule) pending
  post-VIU + dev/PO-answer finalization (two-phase plan in `RESUME-STRATEGY.md`).
- **Never write to TestRail without explicit user permission.**

---

## 4. Deliverables index (paths relative to repo root `/home/user/Manual-test-Cases/`)

**Test cases (authored source):**
- `build/fees-discounts/cases/group-A-wo-parts.json` — 61 cases.
- `build/fees-discounts/cases/group-B-customer-admin-finance.json` — 83 cases.
- `build/fees-discounts/cases/group-C-calc-permissions-validation.json` — 38 cases.

**Human-readable workbook / CSV:**
- `build/fees-discounts/FeesDiscounts_V1_TestCases.xlsx` / `.csv` — the full test-case
  workbook (tab-per-area + summary), built by `build_workbook.py`.

**TestRail import artifacts:**
- `testrail-import/fees-discounts-v1-testrail-import.csv` / `.xlsx` — full-suite
  import (all 182; VIU-word-free, feature-flag-free; leaf sections; API-titled
  sections for the 2 API cases), built by `build/fees-discounts/gen_import.py`.

**Tracking / status:**
- `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md` / `.xlsx` — **source of
  truth** for per-case state + blocker category + owner + what's-needed (+ Summary).
- `build/fees-discounts/PROJECT-STATE.md` — **this file** (canonical resume snapshot).
- `build/fees-discounts/PROJECT-STATUS.md` — narrative status log.
- `build/fees-discounts/RESUME-STRATEGY.md` — two-phase finalization + unblock→update loop.

**Analysis / VIU / provenance:**
- `build/fees-discounts/requirements.md` — spec extract (incl. Story 13 permissions + §5 calc contract).
- `build/fees-discounts/design-notes.md` — design catalog.
- `build/fees-discounts/viu-recon.md` — qb env map + per-surface BUILT/NOT-YET table + access.
- `build/fees-discounts/viu-qb-findings.md` — batch-1 deep-VIU scoreboard + **FDBUG register** + API map.
- `build/fees-discounts/viu-findings.md` — pass-A / batch-2 per-priority VIU evidence + endpoints.
- `build/fees-discounts/bugs-log.md` — BUG-FD-1..5 + NOTE-FD-4..7 register (batch-2 current).
- `build/fees-discounts/viu-evidence/` and `build/fees-discounts/screenshots/` — VIU screenshots.
- `build/fees-discounts/section-rename-log.md` — TestRail section rename audit.
- `build/fees-discounts/testrail-fd-api-section-move-log.md` — API-section move audit (sections 4087/4088).
- `build/PERMISSIONS-ASSESSMENT.md` — cross-project permissions assessment (F&D permissions = DEFINED / reuse-only).

**Generators (Python):**
- `build/fees-discounts/gen_import.py` — rebuilds the TestRail import CSV/XLSX.
- `build/fees-discounts/build_workbook.py` — rebuilds the human-readable workbook.
- `build/fees-discounts/gen_blockers.py` — rebuilds the Blockers Tracker (`.md` + `.xlsx`).

---

## 5. Bugs / deviations — the FDBUG register + PO-confirmation set

**FDBUG register** (full detail in `viu-qb-findings.md`; narrative in `bugs-log.md`):

- **FDBUG-1 — MAJOR (totals bug).** WO `total_cost`, Financial-Info Total/Balance
  AND the customer estimate Subtotal/Total all EXCLUDE the net adjustment amount,
  while GST *includes* the adjustments' tax effect → customer-facing money is wrong.
  Case: FD-DOC-011.
- **FDBUG-2 — processing-fee Grand-Total base wrong.** The pfee base includes
  whole-WO fees/discounts + their tax; §5-R4 requires it to EXCLUDE every whole-WO
  adjustment. Cases: FD-PROC-009, FD-CALC-013 (+ Stats FD-STATS-001/002/004).
- **FDBUG-3 — auto-applied adjustments write NO history-log entry** (manual
  add/edit/remove ARE logged). Case: FD-HIST-001. Also the enforcement finding: the
  whole-WO adjustment write + the history endpoint are **FE-only** (see §6/BUG-FD-3).
- Smaller: **FDBUG-9** maxCap 0 accepted as "no cap" (FD-CALC-008, FD-VAL-006);
  **FDBUG-10** percent below minimum silently rounded up not rejected (FD-CALC-006);
  **FDBUG-4/5/6/7** display/UX (Line-Total gross-only, Stats aggregate, no "Show N
  more", customer-default single-select picker); **FDBUG-8** Processing Fee absent
  from the builder UI though the BE supports it; **FDBUG-11** history omits the
  "Type:" line; **FDBUG-12** API-created customers don't seed auto-apply defaults;
  **FDBUG-13** line-scope Add dialog has no template picker.

**New batch-2 bugs/notes (in `bugs-log.md`):** **BUG-FD-4** (Add button not disabled
on an empty form — validates on submit instead; FD-WO-005/FD-VAL-001), **BUG-FD-5**
(no "Show N more" collapse on ≥2 line adjustments; FD-INLINE-003), **NOTE-FD-7**
(Add-dialog Taxable is a toggle not a dropdown; template delete-confirm wording
differs). **NOTE-FD-4** = BE accepts `kind:processing_fee` though the builder UI is
absent (PO to confirm intent).

**Deviation / findings awaiting a PO ruling (the "5" + the pending-flagged set):**

| Case | Status | PO question |
|---|---|---|
| FD-STATS-001 | VIU-Deviation | Stats aggregate layout — intended V1, or is the per-row layout still to build? (BUG-FD-2) |
| FD-PERM-002 | VIU-Deviation | Whole-WO adjustment writes FE-only at BE — enforce or leave FE-gated? (BUG-FD-3) |
| FD-WO-013 | VIU-Deviation | Whole-WO starting-places hidden without WO Create&Edit is FE-only — same ruling |
| FD-CUST-016 | VIU-Verified | Double-add (BUG-FD-1) did NOT reproduce on batch-2 — PO to confirm the S9 fix shipped |
| FD-VAL-007 | VIU-Verified | Double-add validation — PO to confirm fixed / re-scope to single adjustment |

(Plus the 6 VIU-Pending deviations batch-2 flagged for PO: FD-WO-005, FD-VAL-001,
FD-INLINE-003, FD-STATS-002, FD-STATS-004, FD-CUST-005 — see §2.)

---

## 6. Open threads / what unblocks what

- **Fresh qb cookies → resume VIU.** Unblocks the **34 VIU-Pending** (parts UI flows,
  invoice-time walk incl. FDBUG-1 on a real invoice + over-discount floor/credit,
  misc retests) AND — via the self-service staff role-switch — is a prerequisite for
  driving the remaining role work. (Tech quick-login is **FLAKY** on qb — 200 in
  batch-1/2, 403 in recon — retest each run.)
- **Restricted-role accounts → the 4 NEEDS-ACCOUNT Story-13 negatives**
  (FD-PERM-004/008/010, FD-CUST-015). The tech quick-login user is **not in the org
  staff table** on qb and quick-login only supports admin/tech, so the other 9 roles
  cannot be logged in / role-switched here — a real non-Tech account (or a fixed
  login path) is required. Restore Tech afterward. (Batch-2 verified the REST of the
  Story-13 matrix by DERIVING per-role capability from `roles-matrix.json`, which is
  why 9 Story-13 cases flipped to Verified.)
- **Dev → Stories 6 / 8 / 11 + the code-bug deviations.** Story 8 (Processing-Fee
  builder UI) unblocks FD-PROC-001..004; Story 11 (Part Sales) unblocks
  FD-PCOL-001..007; a QuickBooks-connected env (or dev/QB-side inspection) unblocks
  the 13 QB ENV cases. The 7 code-bug deviations (FDBUG-1/2/3/9/10) need dev fixes.
- **PO → deviation confirmations + double-add + NOTE-FD-4.** Rule on the 3
  PO-question deviations (Stats layout; whole-WO FE-vs-BE enforcement), confirm the
  double-add fix (FD-CUST-016/FD-VAL-007), and confirm NOTE-FD-4 (should the BE keep
  accepting `processing_fee` before the UI ships?). Then the 6 pending PO-flagged
  deviations and the 17 case-update deviations can be finalized.
- **Flag-off window (non-shared env) → the 5 flag-off/shared-env ENV cases**
  (FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012).

---

## 7. Env & access facts (facts only — NO secret values; secrets live in `/tmp`)

- **QA env:** app `https://qb.qa.shopview.com` · API host
  `https://sv7387api.qa.shopview.com` (note `sv7387api`, **no dot**; found by
  grepping the SPA bundle — `qbapi.qa.shopview.com` does NOT exist). Env = SV-7387.
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` gated by cookies
  `sv_sso_session` + `PHPSESSID` + `cf_clearance` (domain `.qa.shopview.com`).
  `{key:'admin'}` → 200. **`{key:'tech'}` is FLAKY** (200 in batch-1/2, 403 in
  recon) — retest each run. Only admin/tech are supported; the other 9 roles need a
  real account. Read FE permissions at `GET /api/auth/me/fe-permissions`.
- **Feature flag:** `GET /api/feature-flags` → `{data:{featureFlags:[…]}}`;
  `FeesAndDiscounts` toggle is ON at `/administration/feature-flags`. `QuickBooks`
  flag exists but is not connected.
- **Enforcement model (Story 13, batch-2 confirmed):** templates admin (Settings→
  Finance) is **BE-enforced** (Tech → 403 list/create); **customer-defaults GET+POST
  are BE-enforced** (403); **See Financial Data** masks financials in the payload
  (`view_mode:tech` → `sub_total:"0.00"`); adds on an Invoiced/Paid WO are
  **BE-enforced** (409). BUT **whole-WO adjustment add/edit/remove is FE-only** (Tech
  without `workOrdersCreateAndEdit` got 201 = BUG-FD-3), and the **WO history
  endpoint is FE-only** (Tech without `viewHistoryLogs` got 200 with entries; F&D
  history persists regardless of SFD because entries carry the SET rate, not a
  resolved total). Per-role FE capability derived in `/tmp/fdcln/roles-matrix.json`.
- **Adjustment API (reverse-engineered, `viu-qb-findings.md` API map):**
  - Templates: `GET/POST /api/adjustment-templates`, `POST …/{id}/change`,
    `DELETE …/{id}`, `GET …/{id}/delete-precondition` → `{affectedCustomerCount}`.
    Fields: `{name, kind:fee|discount|processing_fee, calculationType:flat|pct_labor|
    pct_parts|pct_subtotal|pct_grand_total, defaultAmount, defaultMaxCap, autoApply,
    taxable, description}`.
  - WO adjustments: `POST /api/work-orders/adjustments/add|change|remove`
    (`add`: `{workOrderId, kind, name, calculationType, amount, maxCap,
    scope:whole_wo|labor_line|part_line, targetId, taxable, templateId, description}`;
    `change`: `{adjustmentId, name, amount, maxCap, taxable}`; `remove` → 204).
  - Reads: whole-WO adjustments in `GET /api/work-orders/view/{id}`
    (`work_order.adjustments`, `adjustmentsSummary{…}`); line-level under each line
    in `GET /api/work-orders/lines/{woId}`.
  - Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments`
    (POST `{templateIds:[…]}` — array OK), `DELETE …/{defaultId}` → 204.
  - QB mapping guard: `GET /api/bookkeeping/adjustment-item-mapping-status`.
  - History: `GET /api/work-orders/{id}/history` (adjustment.added/updated/removed).
- **Key routes:** admin templates `/administration/adjustment-templates` (in-SPA click
  only — under FINANCE); WO detail `/workorders/{id}/lines`; Stats
  `/workorders/{id}/statistics`; customer defaults `/customers/{id}/default-adjustments`;
  part sale `/parts/part-sale/{id}/part-requests`; feature flags
  `/administration/feature-flags`.
- **Gotchas:** (1) **`NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`
  must both be set** for node, else a spurious proxy 403. (2) SPA **deep-links to
  most sub-routes render a blank "Error" page** — navigate in-SPA (`/workorders/{id}/lines`
  deep-links fine). (3) **Concurrent users are active on qb** — never assume env
  state; mark throwaway data ZZAUTOTEST and clean up.
- **Harness / boot2:** `/tmp/fdcln/fd-admin.mjs` (API client), `/tmp/fdcln/fd-boot2.mjs`
  (Chromium boot2 hydration, cookie domain `.qa.shopview.com`; Playwright straight at
  `$HTTPS_PROXY`). Secrets ephemeral (`/tmp` only, re-supply per environment).

---

## 8. How to resume

**Confirm the project first** (this workspace holds 3 projects) — instruction must
target **Fees & Discounts**. Then, depending on what lands:

**When fresh qb cookies are supplied:**
1. Get admin (+ retest tech) cookies into `/tmp`; rebuild the boot2 harness.
2. Work the **34 VIU-Pending** (parts UI flows → FD-PART-*/FD-PCOL deps once built,
   invoice-time walk → FDBUG-1 on a real invoice + over-discount floor/credit, misc
   retests — see the batch-2 backlog at the end of `viu-qb-findings.md`).
3. Flip verified cases to VIU-Verified in `cases/*.json`; re-run
   `gen_blockers.py`, then `gen_import.py` + `build_workbook.py`.

**When a non-Tech role account is supplied:** run the 4 NEEDS-ACCOUNT Story-13
negatives (FD-PERM-004/008/010, FD-CUST-015); restore Tech afterward.

**When dev fixes land (Stories 6/8/11 + FDBUG code fixes):** re-run VIU for the
now-reachable cases (Story 8 → FD-PROC-001..004; Story 11 → FD-PCOL-001..007; a
QB-connected env → the 13 QB cases; the 7 code-bug deviations retest after fix).

**When the PO answers:** apply rulings to the 3 PO-question deviations + the 6
pending PO-flagged deviations + the double-add pair + NOTE-FD-4; finalize the 17
case-update deviations; regenerate deliverables.

**Before any TestRail update loop:** BUILD the missing **F&D Case-ID map** first
(read-only, match by title against the live suite under parent 3894), then generate
an ID-matched update file. **Ask the user before any TestRail write.**

**Two-phase finalization** (`RESUME-STRATEGY.md`): the current import files are
INTERIM; FINAL = the regenerated post-VIU + dev/PO-answered files.
