# Simple Flow — PROJECT STATE (canonical resume snapshot)

> **THIS IS THE CANONICAL STATE DOC for the Simple Flow project.** It is a single
> authoritative snapshot so the project can be resumed with zero re-discovery.
> **Last updated:** 2026-07-08.
> **Source of truth for per-case status:** `SimpleFlow_Blockers_Tracker.md`/`.xlsx`
> (regenerate with `python3 build/simple-flow/gen_blockers.py`). All counts below
> are cited from that tracker — do not invent numbers; re-read the tracker if in doubt.
> Companion docs kept current: `PROJECT-STATUS.md` (narrative log),
> `RESUME-STRATEGY.md` (two-phase finalization), `bugs-log.md`, `viu-findings.md`.

---

## 1. Summary

**What Simple Flow is:** ShopView **"Simple Mode — Streamlined Work Order
Completion & Bulk Receiving"** (Epic **SV-7301**, Owner @Milos Vasic). It shortens
/ skips legacy multi-step work-order completion and parts-receiving flows so users
reach the **same end state faster** — one-confirm WO completion, an in-modal
completion wizard, bulk PO receiving, vendorless/no-PN parts, inline part-number
fix, and an optional review sign-off gate. Behavior is **settings-driven** (the
Work Orders settings tab), **not** feature-flag-gated.

**Spec version:** **V2.4** — "Draft for build" (title gained "Bulk"; V2.3 → V2.4
adds the 2026-07-08 change-log batch: sell-price-at-save, receive-screen parity,
etc.). 17 stories: S1–S15 = SV-7696..SV-7710, S16 = SV-7870, S17 = SV-7876. The
reconciled authoritative inputs are the **V2.4 spec doc** + the **2026-07-08 design
bundle** (last-update-wins over the earlier round-1 Milos answer sheet).

**Overall status:** Cases **authored (162)** and **permissions applied (SV-8183)**.
Deliverables regenerated (workbook, interim TestRail import, blockers tracker). VIU
is **PARTIAL** (feature under active development). The **v2.4 reconciliation batch
was pushed to TestRail** (18 updates + 2 adds). Remaining work is gated on: Milos
Round-2 answers, dev fixes (BUG-11 + Stories 7/8/9/14), fresh QA cookies + role
accounts, and 7 Jira bug drafts awaiting filing. **Do NOT write to TestRail without
explicit user permission.**

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
| READY (VIU-Verified, uploadable now) | 69 | — |
| BLOCKED — DEV NOT BUILT | 25 | Dev team |
| BLOCKED — VIU PENDING (QA) | 47 | QA |
| BLOCKED — MILOS ANSWER | 15 | Milos (PO) |
| BLOCKED — BUG/RULING | 6 | Dev / PO ruling |
| **TOTAL** | **162** | |

**VIU status field tally across the case JSONs:** VIU-Verified **76** · VIU-Pending
**80** · Open-Question **6** (= 162). Note the difference from "READY = 69": **7
VIU-Verified cases are held** under a ruling/answer — 6 under BUG/RULING
(SF-PERM-02/04/06/07/08, SF-REV-09) + 1 under Milos-answer (SF-REV-08) — so they
are VIU-verified but not yet uploadable-clean.

**DEV-NOT-BUILT (25) by story:**

| Story (Jira) | Count | Cases |
|---|---:|---|
| Story 8 — PO Bulk Receive page (SV-7703) | 12 | SF-BULK-01..10, SF-PERM-03, SF-VAL-09 |
| Story 7 — PO multi-select (SV-7702) | 6 | SF-POSEL-01..06 |
| Story 9 — Apply invoice to selected POs (SV-7704) | 4 | SF-INV-01..03, SF-VAL-10 |
| Story 14 — Waiting-on-Parts column (SV-7709) | 3 | SF-WOP-01..03 |

**VIU-PENDING (QA) (47) by sub-bucket:**

| Sub-bucket | Count | Meaning |
|---|---:|---|
| reachable-now | 7 | admin+tech + normal data; just needs another VIU pass, no new inputs |
| needs-data | 40 | needs a data state not seedable via the app (cores, receiving, QB inspection, vendor-missing UI, invoiced/paid WO, VIN-less asset) |
| needs-account | 0 | (none currently) |
| **TOTAL** | **47** | |

**Blocker owners (who unblocks what):** Milos (PO) → the 15 MILOS-ANSWER cases;
Dev team → the 25 DEV-NOT-BUILT (+ BUG-11 unblocks a large slice of the VIU-pending
receive cases); QA (fresh sv7301 cookies admin+tech + seeded data) → the bulk of
the 47 VIU-PENDING; a 2nd/3rd role account (Office/Service Manager/Foreman, some
without See Financial Data) → SF-PERM-09/10; Dev/PO ruling → the 6 BUG/RULING.

---

## 3. TestRail state

- **Project 1 · Suite 1 "Master"** on `https://shopview.testrail.io`.
- Cases imported under **parent section 4058** (leaf sections per functional area).
- **API sections:** per STANDING RULE 4, API-related cases live in sections whose
  title contains "API": **`API — Work Order Settings` (section 4089)** and
  **`API — Permissions` (section 4090)** — 7 cases: SF-SET-04/07/09/11/12,
  SF-PERM-01/06.
- **Case-ID map:** `build/simple-flow/testrail-id-map.csv` — 161 data rows
  (`ID,sf_id,title,section`). Case IDs run ~C29282..C29440. This is how
  `gen_update.py` produces ID-matched update files.
- **v2.4 batch pushed (2026-07-08):** **18 in-place UPDATEs + 2 ADDs = 20 cases
  touched**, all verified by re-fetch (audit: `testrail-push-v2.4-log.md`):
  - Updates: SF-SET-08, SF-RCV-05, SF-UX-04, SF-SET-13, SF-CORE-01, SF-CORE-02,
    SF-CORE-10, SF-REV-08, SF-REV-11, SF-REV-10, SF-VPART-01, SF-VPART-02,
    SF-COMP-12, SF-COMP-18, SF-COMP-19, SF-PNFIX-04, SF-BULK-06, SF-RCV-06.
  - Adds: **SF-VMIS-07 → C29439** (section 4073, Vendor Missing on WO PO) and
    **SF-RCV-10 → C29440** (section 4079, Accept Delivery). Both carry
    `custom_atmstatus:3` + `custom_automation_type:0`. Both added to the id-map.
  - Refs note: TestRail strips the space after commas in multi-ref lists
    (SF-CORE-01, SF-PNFIX-04, SF-BULK-06) — content identical, not a diff.
- **What's synced:** all 162 authored cases exist in TestRail; the v2.4
  reconciliation deltas are pushed. The interim import files on disk
  (`testrail-import/simple-flow-v1-testrail-import.csv`/`.xlsx`) are the full-suite
  upload; `simple-flow-v2.4-update.xml` / `simple-flow-UPDATE.xml` are the
  update-only artifacts. **Import files remain INTERIM** pending post-VIU +
  dev-answer finalization (two-phase plan in `RESUME-STRATEGY.md`).

---

## 4. Deliverables index (all paths relative to repo root `/home/user/Manual-test-Cases/`)

**Test cases (authored source):**
- `build/simple-flow/cases/group-A-settings-completion.json` — 56 cases (settings/completion/cores/tech story).
- `build/simple-flow/cases/group-B-receiving-vendor.json` — 57 cases (receiving/vendor/bulk/PN-fix).
- `build/simple-flow/cases/group-C-review-permissions-validation-edge.json` — 49 cases (review/perms/validation/QB).

**Human-readable workbooks / CSVs:**
- `build/simple-flow/SimpleFlow_V1_TestCases.xlsx` / `.csv` — the full test-case workbook (tab-per-area + Open Questions).
- `build/simple-flow/SimpleFlow_QA_Execution_Guide.md` — QA execution guide (how to run VIU, env, seeding).
- `build/simple-flow/SimpleFlow_Settings_QuickReference.xlsx` — settings quick-ref (toggles + defaults).

**TestRail import / update artifacts:**
- `testrail-import/simple-flow-v1-testrail-import.csv` / `.xlsx` — full-suite import (all 162; VIU-word-free, feature-flag-free; leaf sections; API-titled sections for API cases).
- `testrail-import/simple-flow-v2.4-update.xml` and `testrail-import/simple-flow-UPDATE.xml` — update-only (ID-matched) files for the cleared/changed cases.
- `build/simple-flow/testrail-id-map.csv` — sf_id ↔ TestRail Case-ID map (161 rows).

**Tracking / status:**
- `build/simple-flow/SimpleFlow_Blockers_Tracker.md` / `.xlsx` — **source of truth** for per-case state + blocker + owner + what's-needed.
- `build/simple-flow/PROJECT-STATE.md` — **this file** (canonical resume snapshot).
- `build/simple-flow/PROJECT-STATUS.md` — narrative status log.
- `build/simple-flow/RESUME-STRATEGY.md` — two-phase finalization + unblock→update loop.
- `build/simple-flow/UPDATE-LOOP-README.md` — the unblock→update loop process.

**Analysis / mapping / diff docs:**
- `build/simple-flow/requirements.md` — spec extract (V2.3 baseline + §9/§10 SV-8183 permissions + V2.4 interpretation notes).
- `build/simple-flow/spec-current-source.md` — readable V2.4 spec source; `build/simple-flow/spec-change-diff.md` — V2.4-vs-V2.3 diff (8 substantive deltas D2–D9).
- `build/simple-flow/design-notes.md` — design catalog; `build/simple-flow/design-change-diff.md` — refreshed-bundle diff (1 new screenshot: Mark-Reviewed dialog).
- `build/simple-flow/design-notes.md` / `sources-log.md` / `spec-fetch-BLOCKED.md` — provenance.
- `build/simple-flow/contradiction-resolution.md` — last-update-wins conflict log (C1 review default, C2 No-PO path, C3 completion lifecycle).
- `build/simple-flow/finding-reclassification.md` — shortcut-principle reclassification of BUG-3/4/9/10/11 + BE-enforcement findings.
- `build/simple-flow/bugs-log.md` — all VIU bugs/deviations (BUG-1..BUG-11 + GAP-A/B).
- `build/simple-flow/viu-findings.md` — full VIU evidence + endpoints; `build/simple-flow/viu-evidence/` — screenshots.
- `build/simple-flow/jira-bug-drafts.md` — 7 ready-to-file Jira bug tickets (see §5).

**Milos (PO) question rounds:**
- Round 1 (answered): `build/simple-flow/OpenQuestions-for-Milos.md` / `.xlsx` (11 Q); answers `milos-answers-source.md` / `.csv` / `.xlsx`; mapping `milos-answers-mapping.md`.
- Round 2 (open): `build/simple-flow/OpenQuestions-for-Milos-Round2.md` / `.xlsx` (5 Q).
- Permissions source: `build/simple-flow/SV-8183-permissions-source.md`.

**Generators (Python):**
- `gen_import.py` (rebuilds TestRail import CSV **and** the Excel workbook), `gen_blockers.py` (tracker), `gen_update.py` (ID-matched update file), `gen_cases.py`, `build_workbook.py`, `build_settings_quickref.py`, `gen_milos_questions.py`, `gen_milos_questions_r2.py`.

**Audit logs:**
- `build/simple-flow/testrail-push-v2.4-log.md` (the 20-case v2.4 push), `build/simple-flow/testrail-sync-log.md`.

---

## 5. Open threads / what unblocks what

**A. Milos Round-2 (PENDING — 5 questions, `OpenQuestions-for-Milos-Round2.md`):**
- **Q1 (was R1 Q7)** — Mark-Reviewed optional review-note field: confirm intended vs bug (BUG-3; note: the 07-08 design shows it as intended → currently treated as build-gap). Affects SF-REV-10.
- **Q2 (was R1 Q9)** — Tech-story entry points: confirm Story 17 (inline + gate-modal) supersedes S15-R2 (line-only). Affects all SF-TECH-*.
- **Q3 (was R1 Q2)** — Inventory lifecycle on completion: do in-stock parts still decrement on-hand + write Part History at completion (data-integrity invariant)? Affects SF-COMP-07, SF-QB-01 (on HOLD until answered).
- **Q4 (BUG-9)** — "New Part Request" required fields: is Category intended-required, and should Sell Price be enforced? Affects SF-VPART-01/02.
- **Q5 (SF-PERM-06 / BUG-6 / BUG-7)** — Backend enforcement of completion / review-sign-off atoms: FE-only (SV-7864 atom-collapse) acceptable, or a BE gap vs SV-8183? Resolves the 6 BUG/RULING cases.

**B. 7 Jira bug drafts pending Atlassian (`jira-bug-drafts.md`, NOT yet filed — no
Atlassian MCP in this env; file from the chat app). All under epic SV-7301,
Product Area = Work Orders (`customfield_10153` id 10120):**
1. TICKET 1 (BUG-3, Medium) — Mark-Reviewed dialog missing optional review-note field.
2. TICKET 2 (BUG-5, High) — reviewer can sign off own WO (reviewer≠completer not enforced).
3. TICKET 3 (BUG-6 + BUG-7, Medium) — WO completion & review sign-off enforced UI-only, bypassable via API.
4. TICKET 4 (BUG-8, Medium) — required completion fields (mileage/VIN/engine hours) UI-only, not BE-enforced.
5. TICKET 5 (BUG-9 / GAP-A, Medium) — vendorless "New Part Request" requires Category (not in spec) + doesn't enforce Sell Price.
6. TICKET 6 (BUG-11, High) — receiving a WO-originated PO returns HTTP 500.
7. TICKET 7 (GAP-B, Medium) — wrong first-use settings defaults (Auto-approve/Vendor-invoice).
   - **Deliberately NOT filed:** BUG-1 (No-PO retained per V2.4 = build-lag note), BUG-2 (nice-to-have), BUG-4 & BUG-10 (EXPECTED under the shortcut rule).

**C. Dev dependencies that gate the remaining VIU:**
- **BUG-11 (HTTP 500 on WO-PO receive)** — blocks the entire WO receive round-trip; gates SF-COMP-13/19, SF-VAL-05/06, SF-PNFIX-02..06, SF-RCV-08, SF-VPART-07, SF-REV-04/14, SF-CORE-03..07. Highest-leverage single fix for the VIU-pending backlog.
- **Stories 7 / 8 / 9 / 14 NOT built** — 25 DEV-NOT-BUILT cases wait on these deploys (see §2). Story 8 in particular gates the vendor-missing assign-vendor / inline-PN-fix UI that several VIU-pending cases also need.

**D. QuickBooks parked:** all QB/inventory-integrity checks (SF-QB-03..08,
SF-VMIS-03, SF-RCV-08) need QuickBooks/inventory back-end inspection — likely
requires dev/QB access; parked until an inspection path is provided.

---

## 6. Standing rules learned (Simple Flow) — all recorded in CLAUDE.md

- **Shortcut-interpretation principle (Simple Flow ONLY):** any behavior that
  reaches the same end state by SKIPPING a legacy flow/step is **EXPECTED** — a
  defect only if the skip (a) throws an ERROR or (b) corrupts data/inventory/
  Part-History integrity. Applied: BUG-4 & BUG-10 → EXPECTED; BUG-11 → REAL DEFECT
  (500); BUG-5/6/7/8/9 → OTHER (enforcement/added-requirement, not skips).
- **Last-update-wins contradiction rule:** when spec doc vs answer sheet vs design
  conflict, the MOST RECENT input is authoritative. The **V2.4 spec + 2026-07-08
  design bundle** override the earlier round-1 Milos answers where they disagree
  (e.g. No-PO path RETAINED; review-default = per-cohort not ON-for-all; review
  note is design-intended).
- **Self-service test data & role-switching:** on the disposable QA env, create/
  delete whatever data a case needs; to test role behavior, assign Tech the needed
  role then RESTORE Tech afterward (exact email match `tech@shopview.com`; mark
  throwaway data ZZAUTOTEST).
- **API-folder rule (STANDING RULE 4):** any case with API endpoints/verbs/status
  codes/backend checks goes in a TestRail section whose title contains "API"
  (applied via each case's `api_related` flag → sections 4089/4090).
- Plus the global standing rules: never write to TestRail without explicit user
  permission; confirm the target project on every instruction; never commit
  secrets (/tmp only).

---

## 7. Env & access facts (facts only — NO secret values; secrets live in `/tmp`)

- **QA env:** app `https://sv7301.qa.shopview.com`; API host
  `https://sv7301api.qa.shopview.com` (note `sv7301api`, no dot). This is the POC
  env referenced by the design handoffs.
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` — **both now return 200**
  (the earlier tech-403 is FIXED). Gated by cookies `sv_sso_session` / `PHPSESSID`
  / `cf_clearance` (domain `.qa.shopview.com`). quick-login is **stateful on the
  shared PHPSESSID** — probe roles STRICTLY SEQUENTIALLY. Read FE permissions at
  `GET /api/auth/me/fe-permissions` → `{data:{fe_permissions:[<codes>],view_mode,
  cross_toggles}}`.
- **Settings-driven, NO feature flag** — controlled by the Work Orders settings
  tab. Read `GET /api/organizations/settings`; save
  `POST /api/organizations/settings/change` (full settings object).
- **Key routes:** WO settings `/administration/settings` → Work Orders tab; PO list
  `/parts/orders`; deliveries/Accept-Delivery `/parts/deliveries`; shared Accept
  Delivery surface `/accept-delivery/{orderId}`; WOs `/workorders` →
  `/workorders/{id}/lines`.
- **Key endpoints:** PO list `GET /api/inventory/orders`; order detail
  `GET /api/inventory/orders/{id}`; deliveries `GET /api/inventory/deliveries`;
  inventory parts `GET /api/inventory/parts?…&search=`; **Receive =
  `POST /api/inventory/orders/accept`** (works for inventory POs; **500 for WO POs
  = BUG-11**); simple completion `POST /api/work-orders/{id}/simple-complete`;
  change status `POST /api/work-orders/change-status`; remove WO part
  `POST /api/work-orders/parts/delete {part_id,work_order_id}`; new part request
  `POST /api/work-orders/part/make-request`.
- **Tech self-service role-switch (sv7301):** `POST /api/staff/{staff_id}/change`
  with `{first_name,last_name,email,role_id,workplace_id}` (+ job_title/salary/
  billable/clockable to avoid clobber). Tech: user `a7fd0a88-…`, **staff
  `6fb22c1b-…`**, restore role **Technician `131b5274-…`**, workplace
  `b3c8c820-…`, org `d55bc308-…`. EXACT-MATCH `email==='tech@shopview.com'` before
  changing; safety-net `restore-tech.mjs`. **All 11 system roles are real &
  assignable.** Roles list `GET /api/organizations/{org}/roles` (405 on
  `/api/roles`). Role ids: Admin `16fec34c…`, Service Manager `ef6e24c2…`, Senior
  Service Advisor `e03f176f…`, Service Advisor `3874cc56…`, Foreman `897018a5…`,
  Technician `131b5274…`, Parts Manager `5d703b9b…`, Parts Tech `486622b9…`,
  Office `163abe0d…`, Sales Rep `8eb4a1c1…`, Time Clock `0a198766…` (full map
  `/tmp/simple-flow/roles-map-6.json`).
- **NOT built yet:** Stories 7 (PO multi-select), 8 (Bulk Receive page), 9
  (apply-invoice), 14 (Waiting-on-Parts column).
- **Cores:** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id); add via New Part Request → select_part catalog PN (forces
  Source=Inventory; qty via `input_bin_quantity_{binId}`). A genuine special-order
  (vendor-source) core is NOT seedable in-app.
- **Deliverable WO PO recipe (for receive testing):** New Part Request → Source =
  Vendor + real vendor (e.g. Aabridge Beverages) + free-text Part Number → complete
  WO → PO becomes `status:ordered, vendorMissing:false` on `/accept-delivery/{id}`
  (but Receive → 500, BUG-11).
- **NODE_USE_ENV_PROXY gotcha:** node `fetch` is blocked for the TestRail host in
  this env — the v2.4 push used **curl + Basic auth** instead. For UI automation,
  Chromium can't TLS through the egress proxy directly — build a FRESH MITM bridge
  per run (port rotates; read `$HTTPS_PROXY` live) and use the boot2 hydration
  pattern (VIU tools in `/tmp/simple-flow/tools/`).
- VIU tools live in `/tmp/simple-flow/tools/`; secrets are ephemeral (`/tmp` only,
  re-supply per environment).

---

## 8. How to resume

**Confirm the project first** (this workspace holds 3 projects) — instruction must
target **Simple Flow**. Then, depending on what lands:

**When Milos answers Round-2 (`OpenQuestions-for-Milos-Round2.md`):**
1. Record answers verbatim (new `milos-answers-round2-source.*`) and map them in a
   new mapping doc (mirror `milos-answers-mapping.md`).
2. Apply the confirmed outcomes to the case JSONs (`cases/*.json`): flip
   `viu_status`/`expected` for the 15 MILOS-ANSWER cases (+ the 6 BUG/RULING if Q5
   rules on FE-vs-BE enforcement).
3. Re-run `gen_blockers.py`, then `gen_import.py` (rebuilds import CSV + workbook),
   then `gen_update.py <cleared SF ids>` for an ID-matched TestRail update file.
4. **Ask the user before any TestRail write.**

**When dev fixes land (BUG-11 / Stories 7/8/9/14):**
1. Get fresh sv7301 cookies (admin + tech) into `/tmp` and rebuild the MITM bridge.
2. Re-run VIU for the now-reachable cases (BUG-11 unblocks the WO-receive round-trip
   set; each story deploy unblocks its DEV-NOT-BUILT cases — see §2).
3. Flip verified cases to VIU-Verified in `cases/*.json`, regenerate deliverables,
   emit an ID-matched update file, get user approval, then push.

**When fresh QA cookies / role accounts are supplied:**
1. Cookies → work the 47 VIU-PENDING (reachable-now 7 first, then needs-data 40
   as data becomes seedable).
2. A 2nd/3rd role account (some WITHOUT See Financial Data) → verify SF-PERM-09/10
   role-gating negatives; restore Tech to Technician afterward.

**File the 7 Jira bug drafts** (`jira-bug-drafts.md`) from the chat app where
Atlassian is connected (not available in this CLI env).

**Two-phase finalization** (`RESUME-STRATEGY.md`): current TestRail import files
are INTERIM. FINAL = the regenerated post-VIU + dev-answered files. Never write to
TestRail without explicit user permission.
