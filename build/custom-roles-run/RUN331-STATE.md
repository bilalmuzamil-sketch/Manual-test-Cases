# Custom Roles — RUN 331 STATE (canonical resume snapshot)

> **2026-07-13 UPDATE:** A separate **build-accurate wording + VIU pass** was run over
> ALL 252 core Custom Roles cases (sections 3528–3553): all reworded to build-accurate
> layman wording and pushed to TestRail via `update_case` (252/252, 200/200). Section
> 3658 stub tree deduped (3 deleted, 7 flagged). See
> **`WORDING-VIU-STATE-2026-07-13.md`** (canonical for that effort) +
> `testrail-wording-viu-log.md`, `wording-glossary-2026-07-13.md`,
> `cases-2026-07-13/` (new local editable source), `section-3658-dedupe-2026-07-13.md`,
> `CustomRoles_WordingVIU_2026-07-13.xlsx`. Several build findings surfaced (AP/AR label
> = "View and Manage AP/AR Data"; QuickBooks stays under Integrations; Administrator
> editable; Integrations sub-toggle built; SFD-disable prompt now built).


> **THIS IS THE CANONICAL STATE DOC for the Custom Roles "run 331" re-test effort.**
> A single authoritative snapshot so the effort can be picked up later with **zero
> re-discovery**. **Last updated:** 2026-07-09.
> **Source of truth for per-case status:** `build/custom-roles-run/run331-results-log.md`
> (two session checkpoints) → workbook `CustomRoles_Run331_Results.xlsx`/`.csv`.
> All counts below are cited from that log — do not invent numbers; re-read the log
> if in doubt.
> Companion docs kept current: `updated-spec-diff.md` (Phase-1 case-edit diff),
> `testrail-caseupdate-2-log.md` (the 3 master-case edits), `custom-roles-current-state.md`
> (live/upcoming/caveats consolidation).

---

## 1. Summary

**What this is:** the Custom Roles & Permissions **re-test of TestRail RUN 331**
("Nightly Test Run - Jul 9, 2026", project **1** / suite **1 "Master"**) — **160
cases** — adjudicated against the **09-Jul-2026 updated Confluence spec**
"Custom Roles and Permissions" (SV-7388; verbatim copy
`build/custom-roles-spec-update/updated-spec-source.md`, latest Change Log row
09 Jul 2026, Sasha Grosman).

The effort ran in two phases:
- **Phase 1 (case edits):** diffed the 09-Jul spec against all 160 run-331 cases →
  **3 MASTER cases updated in TestRail** (C2528, C26424, C26475) + **16 flagged**
  for a user decision (spec-ambiguous / adversarial / subject-changing). See §4.
- **Phase 2 (VIU + posting results):** verified all 160 cases in the UI/API and
  posted results live to run 331. Two same-day sub-passes: Phase 2 (102 cases:
  permission/per-role + generic) then Phase 2b (the remaining 58 deep functional
  flows).

**Current status:** **COMPLETE this pass** — all 160 run-331 cases resulted
(0 Untested). Env: `app.staging.shopview.com` / `api.staging.shopview.com`.

---

## 2. Final tally

**Final run 331 tally (of 160):**

| Status | Count |
|---|---:|
| **1 Passed** | **96** |
| **5 Failed** | **4** |
| **2 Blocked** | **10** |
| **4 Retest** | **50** |
| **3 Untested** | **0** |
| **TOTAL** | **160** |

**Recompute-cite** (from the log's two checkpoints):
- Phase 2 checkpoint (102 resulted): 64 Passed · 4 Failed · 34 Retest · 0 Blocked.
- Phase 2b checkpoint (58 resulted): 32 Passed · 0 Failed · 16 Retest · 10 Blocked.
- Totals: 64+32 = **96 Passed** · 4+0 = **4 Failed** · 34+16 = **50 Retest** ·
  0+10 = **10 Blocked** · **0 Untested** = 160.

**How results were posted:** **live to TestRail RUN 331** via
`add_result_for_case`, each with a plain-language **Expected / Actual** comment
(layman English, no jargon). Status legend used: 1 Passed · 2 Blocked · 3 Untested ·
4 Retest · 5 Failed.

**Local log (full per-case record):** `build/custom-roles-run/run331-results-log.md`
(every case_id + status + plain expected + plain actual + both session checkpoints).
Human-readable per-status workbook: `CustomRoles_Run331_Results.xlsx` / `.csv`
(regenerate with `build_run331_workbook.py`).

---

## 3. The 12 key spec changes VIU checked against

From the 09-Jul updated spec (full delta: `updated-spec-diff.md` "KEY SPEC
CHANGES"). These are the deltas the re-test verified live:

1. **"View History Logs" → renamed "View Part History"** — now controls only the
   inventory **Part History** page (lives under Part Sales). It **no longer** gates
   Work Order history: WO audit log (WO- **and** line-level) now needs **Work Orders →
   Create & Edit**; story history (WOL level) needs **Work Order Lines → View**.
2. **AP/AR aging reports follow the Reports permission** (all-or-nothing), **no
   longer** Manage AP/AR.
3. **Reverse Invoice moved to Work Orders → Delete** (was Invoicing → Delete), for
   both Work Orders and Part Sales. Deleting a return still needs Invoicing → Delete.
4. **Order Parts** now (a) controls the **WO Parts tab** and (b) **requires See
   Financial Data** (enabling it with SFD OFF prompts to enable SFD).
5. **See Financial Data OFF → a PROMPT** to disable dependents (Invoicing CRUD,
   Part Sales CRUD, Order Parts, Manage AP/AR) — **not** a silent auto-clear.
6. **Manage AP/AR requires See Financial Data ON**; AP/AR now also gates sensitive
   **Vendor** fields (Edit Vendor + Vendor overview card), not just customer fields.
   Setting label settled as **"Manage Accounts Payable and Receivable"**.
7. **Customer Portal** default ON for **Service Advisor, Senior SA, Service Manager,
   Parts Manager** (+ Administrator).
8. **Notes model:** WO **View** = create + edit ANY note + delete own; WO **Delete**
   = delete ANY note. **Customer** notes governed by **Customer Management** (View =
   create/edit anyone's note + delete own; Delete = delete others') — NOT by WO perms.
9. **Send to Portal** requires **Full View** (Tech View cannot); **Send to Terminal**
   requires Invoicing → Create & Edit **AND** Customer Portal ON; **Deposits** sit
   behind Invoicing → Create & Edit.
10. **Office users cannot create invoices** — hard-coded rule that disables Create
    Invoice on WOs and Part Sales, overriding Invoicing CRUD.
11. **Marking cores OK/Not-OK** gated by **WO → View** (Key Decision) — though §1a/§1b
    also list it under WOL Create & Edit (spec-internal conflict).
12. **Digital Inspections** derive from existing atoms — no separate permission (WOL
    CRUD for add/fill/remove/reopen; Settings › Service for template authoring), per
    SV-8095.

(Plus supporting facts: Settings → Integrations hosts QuickBooks/IBS/Open API;
Timesheets have NO Delete; **11** system roles shipped.)

---

## 4. Phase 1 — case edits (TestRail)

**These were MASTER-CASE edits (not run-only result overrides).** Audit:
`build/custom-roles-spec-update/testrail-caseupdate-2-log.md`. All three returned
HTTP 200 and were re-fetched/verified. Only text fields touched — no section/type/
refs moved, nothing deleted.

**The 3 MASTER cases updated (old → new):**

| Case | Section | Fields | Change (old → new) |
|---|---|---|---|
| **C2528** | 303 Roles & Permissions | preconds, expected | Customer Portal now ON for SM/SA/PM — removed those from the "hidden" precond role list (kept Foreman, Technician, Parts Technician, Office, Time Clock User); expected rewritten to name the roles that DO get it (Admin, SM, SSA, SA, PM). |
| **C26424** | 3539 Invoicing & Payments Permissions | expected | AP/AR label renamed — "View and Manage AP/AR Data" → **"Manage Accounts Payable and Receivable"** (behaviour unchanged: Invoicing Delete with AP/AR OFF prompts to enable AP/AR). |
| **C26475** | 3544 See Financial Data | title, steps, expected | Mechanic changed from a **silent auto-clear** of dependent CRUDs to a **prompt** listing dependents (Invoicing CRUD, Part Sales CRUD, Order Parts, Manage AP/AR); confirm disables, cancel keeps SFD ON. |

**The 16 FLAGGED-for-decision cases (still need the user's call — NOT changed):**

| Case | Reason flagged |
|---|---|
| **C2480** | App Settings now covers Roles & Permissions and Office has App Settings ON → Office may now SEE Roles & Permissions (case expects it hidden). Could be further-gated (Admin pages). |
| **C2497** | Reverse Invoice now needs **WO Delete**; SA has WO View+Edit (no Delete) → SA should NOT see Reverse. Bundled-roles case; per-role carve-out ambiguous. |
| **C2500** | Timesheets have **no Delete** atom (§1j); expected says "delete/modify actions available" (Admin/Office) — "delete" may mean per-entry removal vs the Delete atom. Ambiguous. |
| **C2561** | Lists **Technician** among roles that can edit Lead Technician, but Technician is WO **View only**. Possible extra tech-specific rule. |
| **C2565** | Lists **Office** as able to Change Customer/Contact, but Office is WO **View only**. |
| **C2567** | Lists **Office** as able to Change Asset, but Office is WO **View only**. |
| **C26340** | Modal short labels vs list long labels (Admin↔Administrator, Parts Tech↔Parts Technician, Time Clock↔Time Clock User) — a product-decision case. |
| **C26419** | Title/body mismatch — title says Catalog & Inventory, body tests **Vendor & Order Management** for return-to-inventory. Needs cleanup. |
| **C26488** | History Logs → **Part History** repurpose; case still asserts the toggle shows WO-level + line-level history. Correct rewrite changes the case's whole subject (repurpose vs split vs retire). |
| **C26496** | Service Manager reverse-invoice internal contradiction: step says "confirm cannot reverse" but expected says "CAN reverse Both". Spec self-contradicts. |
| **C26553** | Backend-API case gates AR Aging on `ROLE_ACCOUNT_RECEIVABLE_REPORT::VIEW`; new spec routes aging through all-or-nothing **Reports**. Permission-name/model may be stale (403-for-tech still holds). |
| **C27873** | Ties modify/delete of another user's **customer** note to **WO Delete**; spec now governs customer notes via **Customer Management** (View/Delete). Outdated linkage. |
| **C27418** | Combo case grants "view WO history logs" from the History Logs permission, which no longer grants WO history (repurpose). |
| **C27468** | Same as C27418 (combo/adversarial). |
| **C27487** | Same as C27418 (combo/adversarial). |
| **C27494** | Same as C27418 (combo/adversarial). |

Up-to-date / unaffected: the remaining ≈141 cases (functional suites + Custom-Roles
cases already written to the current spec).

---

## 5. Findings

**The 4 Failed deviations = spec-not-yet-live on staging** (the updated-spec
behaviour is NOT implemented yet; route to dev, not the PO):

| Case | Deviation |
|---|---|
| **C26387** | "Add Customer" button still appears/functions in the New WO flow when Customer Management Create & Edit is OFF — front-end gating gap (expected hidden). |
| **C26388** | "Add Asset" button still appears in the New WO flow when Customer Management Create & Edit is OFF — same FE gating gap. |
| **C26475** | Turning See Financial Data OFF neither prompts nor clears dependents (spec #5 NOT live). No prompt, no auto-clear. (This is the same case whose MASTER text was updated in Phase 1 — content is now spec-correct, but live behaviour fails.) |
| **C26482** | Aging reports still gated by Manage AP/AR (spec #2 "aging follows Reports" NOT live) — with AP/AR OFF + Reports ON only Sales + Sales Tax Collected show; all 6 aging reports hidden. |

**FE-only enforcement notes (observed during Phase 2b — informational, kept as
Retest for a UI confirm):**
- **PO item Cost (C1004):** the backend **accepts a negative cost** on a PO item
  (no server-side rejection) — cost validation is **front-end only**; needs a UI
  check to confirm the field blocks invalid entry.
- **DI template name immutability (C26663):** at the API a rename via a new draft
  version **was accepted** (name changed after re-publish) — the backend does **not**
  enforce name immutability; the UI name-lock could not be reached in the harness.

(Broader enforcement model — backend enforces only resource-level View/Create&Edit;
granular Delete / WO sub-toggles / cross-toggles / view-mode are FE display gates —
is documented in `custom-roles-current-state.md` §C.)

---

## 6. Retest / Blocked resume detail

### 50 Retest (grouped, with resume conditions)

| Group | Cases | Resume condition (what must be healthy/available) |
|---|---|---|
| **create-customer-payment 500 flakiness** | C22324, C22420, C988, C993, C26601, C26603, C26604 | Payment/credit modals reachable; submission hits an intermittent **500 on create-customer-payment** this session. **Retry in a fresh window when that endpoint is healthy.** |
| **part-sale surface (unreachable/flaky in harness)** | C26411, C26471, C2594, C2639 | Part-sales UI route unreliable + part-sale move/detail endpoints not identified. **Manual UI part-sale pass** (create/return/move; part-sale Finance tax-Parts toggle). |
| **role-editor prompt cases (SPA editor route unreachable)** | C26424, C26496 | Role-editor could not be driven headless. **Manual UI pass in the role editor** (AP/AR-enable prompt; SM reverse-invoice — also flagged, needs the C26496 contradiction settled). |
| **headless-unobservable UI (visual / hover / grid / column)** | C19336, C22272, C25703, C59, C1851, C2175, C26491, C26340 | Visual "no-flash", hover tooltips, schedule grid-cell create, column selector, in-progress-when-clocked-in, invoiced-date column, role-selector eye, modal-vs-list labels. **Needs a manual UI pass** (some also flagged product-decisions). |
| **Foreman/Office/Tech nav — flagged spec conflicts** | C2480, C2497, C2516, C2555, C2558, C2560, C2561, C2565, C2567, C27580, C27873, C19283, C19284 | Live per-role perms contradict the case premise (Foreman has Parts/Vendor View; Office has Timesheets C&E / WO View only). **Needs UI confirmation + the §4 flag decisions ruled by the user.** |
| **functional flows not driven this session** | C26391, C26414, C26415, C26419, C26432, C26528 | Line-removal totals, catalog create/adjust, catalog delete, return-to-inventory (title/body mismatch), universal clock in/out. **Drive each flow in the UI** (C26419 also needs case cleanup). |
| **reports absent/relocated on staging** | C27265, C27267, C27268 | Inventory / Work-In-Progress / Sales-Follow-Up reports not present in the staging Reports menu (routes error or 403). **Retest once the report's location/existence is confirmed.** |
| **AR-aging 200 path** | C26553 | 403-for-tech confirmed; the **200 (full-access) path** could not be confirmed (dev quick-login admin also 403 for this endpoint). **Retest the 200 path with a true full-access account carrying the AR report role.** (Also flagged for permission-model.) |
| **tech-no-pricing full sweep** | C26578 | Confirmed tech See Financial OFF + no pricing in the WO-list payload; finance/detail payload endpoints not discoverable this session. **Retest against the finance endpoints for a full no-leak confirmation.** |
| **invoice-frozen-after-send** | C1999 | Not exercised. **Generate an invoice, send it to the customer, confirm it is locked/read-only.** |
| **PO cost FE validation** | C1004 | BE accepts negative cost. **Manual UI check** that the PO edit dialog blocks invalid cost. |
| **DI builder-only behaviours** | C26663, C26654 | Name-field lock + field-type hot-swap config-reset are builder-only (API rename accepted; API type-swap 400). **Retest in the inspection-template builder UI.** |

### 10 Blocked (with resume conditions)

| Group | Cases | Resume condition |
|---|---|---|
| **Customer-portal Card/ACH payments** | C18624, C18628, C18653, C18681, C18682, C18685, C18710 | Require the **customer-facing billing portal login + a real Card/ACH payment through the payment processor** — cannot be driven from the staff/testing harness. Needs a customer portal session + the external payment gateway. (In-app partial-payment behaviour is covered separately.) |
| **IBS Multi-Tenancy flag OFF** | C24547, C25189, C25190 | Require the **"IBS – Enable Multi-Tenancy" feature enabled on the org** (currently OFF — no IBS Location ID field / no Remit-To card). Cannot be exercised until that feature is turned on. |

---

## 7. Deliverables index (paths relative to repo root `/home/user/Manual-test-Cases/`)

**Results & workbook:**
- `build/custom-roles-run/run331-results-log.md` — full per-case results log (both session checkpoints, plain expected/actual). **Source of truth.**
- `build/custom-roles-run/CustomRoles_Run331_Results.xlsx` / `.csv` — per-status workbook (tab per status + Summary).
- `build/custom-roles-run/build_run331_workbook.py` — workbook generator.
- `build/custom-roles-run/run331-tests.json` — the run-331 test↔case-id map (authoritative 160-case set).

**Phase-1 spec update:**
- `build/custom-roles-spec-update/updated-spec-source.md` — verbatim 09-Jul Confluence spec (SV-7388).
- `build/custom-roles-spec-update/updated-spec-diff.md` — the 12 key spec changes + the delta table (3 UPD / 16 FLAG / ≈141 OK).
- `build/custom-roles-spec-update/testrail-caseupdate-2-log.md` — audit of the 3 master-case edits (C2528, C26424, C26475).

**Consolidated context:**
- `build/custom-roles-run/custom-roles-current-state.md` — LIVE vs UPCOMING vs KNOWN-ISSUES consolidation (enforcement model, permission catalog, view-mode matrix).

**This doc:**
- `build/custom-roles-run/RUN331-STATE.md` — **this file** (canonical run-331 resume snapshot).

---

## 8. Env & access facts (facts only — NO secret values; secrets live in `/tmp`)

- **Staging topology:** `app.staging.shopview.com` = SPA frontend;
  `api.staging.shopview.com` = Symfony JSON backend.
- **Auth:** DEV `POST /api/quick-login {key:'admin'|'tech'}` (gated by valid session
  cookies). Prefer quick-login SSO over raw-cookie API.
- **Session cookies:** staging cookies last **~24 HOURS** — they expire only after
  ~24h OR on a new deployment (they do NOT expire after ~1h). A 401 `sso_required` /
  409 before 24h ⇒ suspect a deployment and re-request cookies. **Secrets live in
  `/tmp` only — never committed.**
- **TestRail:** **run 331 is a LIVE TestRail run** (project 1 / suite 1 "Master").
  Results posted via `add_result_for_case`; the 3 master-case edits via
  `POST index.php?/api/v2/update_case/{id}`. **NEVER write to TestRail without
  explicit user permission.**
- **Enforcement model:** backend enforces only **resource-level View / Create & Edit**;
  granular **Delete**, WO sub-permissions, cross-toggles, and view mode are
  **front-end display gates** the raw API does not enforce. Denial cases → verify in
  UI; enforcement cases → hit the endpoint (403 vs 200/201).
- **NODE_USE_ENV_PROXY gotcha:** node `fetch` is blocked for the TestRail host in
  this env — use **curl + Basic auth** for TestRail writes. For UI automation,
  Chromium can't TLS through the egress proxy directly — build a **FRESH MITM bridge
  per run** (port rotates; read `$HTTPS_PROXY` live) and use the boot2 hydration
  pattern.
- **WO-detail in-SPA navigation gotcha:** the existing-WO detail page **bounces to
  `/workorders`** on a direct mount. Reach it via in-list pushState: land on
  `/workorders`, then
  `history.pushState({},'','/workorders/{id}/lines'); dispatchEvent(new PopStateEvent('popstate'))`.
- **Per-role adjudication:** FE display-gate cases were adjudicated from live per-role
  `fe_permissions` via **`GET /api/roles/{id}`** (405 on `/api/roles`; org roles list
  `GET /api/organizations/{org}/roles`). `GET /api/auth/me/fe-permissions` →
  `{data:{fe_permissions:[codes],view_mode,cross_toggles}}`.
- **Useful endpoints discovered/proven (run 331):**
  - Taxes: `GET /api/taxes`; `POST /api/taxes`, `POST /api/taxes/{id}` (update),
    `DELETE /api/taxes/{id}`. WO tax override: `POST /api/work-orders/{id}/tax {id:taxId}`
    (empty body = reset to default).
  - Vendors: `GET /api/parts-catalogue/vendors`; `add-vendor`
    (needs tax_id+credit_term+credit_limit) / `remove-vendor`.
  - Inventory: `GET /api/inventory/parts?…&search=`; PO item edit
    `inventory/orders/change-item {order_id,item_id,quantity_ordered,price,…}`.
  - Pricing: `GET /api/pricing-rules/list`.
  - Reporting: `GET /api/reporting/{report}/{range}` (e.g. service-advisor-analysis,
    shop-billing-efficiency); AR aging
    `GET /api/reporting/account-receivable/aging-summary-report`.
  - WO history: `GET /api/work-orders/{id}/history` (one feed carrying WO-level +
    line-level events, keyed by `lineId`).
  - Settings: `GET /api/organizations/settings` + `POST /api/organizations/settings/change`.
  - WO ops: split `POST /api/work-orders/split {work_order_id,ids:[lineIds]}`;
    change customer `work-orders/change-customer {work_order_id,company_id,customer_id}`;
    part request add `part/make-request` (needs part_category_id; source enum
    inventory|vendor), edit `part/change-request {id,…}`; tech story via
    `work-orders/lines/change` (needs lineName).
  - Dept clock: `technician-tasks/department-clock-in {department_id}` →
    `.../department-clock-out {task_id,description}`.
  - IBS: `POST /api/ibs/settings/credentials` / `.../disconnect`.
  - DI builder: `POST /api/inspection-templates` (create on SAVE, deferred),
    `PUT .../{id}/draft`, `POST .../{id}/publish`, `POST .../{id}/archive`.
  - Estimate doc: `POST /api/work-orders/invoices/estimate {work_order_id,type:'html',
    issue_date,due_date}` (reflects tax config, not the WO tax override).
  - **create-customer-payment 500s intermittently** (known quirk — see §6).

---

## 9. How to resume

**Confirm the project first** (this workspace holds 3 projects) — the instruction
must target **Custom Roles**. Then:

1. **Apply the 16 flagged decisions when the user rules** (§4). For each, edit the
   MASTER case in TestRail per the ruling (repurpose/split/retire C26488; per-role
   carve-outs for C2497/C26496; customer-note model for C27873; Office/Tech premise
   fixes for C2480/C2561/C2565/C2567; combo cleanups C27418/C27468/C27487/C27494;
   etc.). **Ask before any TestRail write.** Audit each edit like
   `testrail-caseupdate-2-log.md`.
2. **Retry the 50 Retest in a fresh window** once **create-customer-payment is
   healthy** (clears the 7 payment/credit cases) **plus a manual UI pass** for the
   headless-unobservable / part-sale / role-editor / functional-flow groups (§6).
   Confirm report locations for C27265/C27267/C27268 and the AR-aging 200 path
   (C26553) with a true full-access account.
3. **Route the 4 spec-not-yet-live deviations to dev** (C26387, C26388, C26475,
   C26482 — §5). These are build-lag defects, not PO decisions — do not put them in
   front of the PO.
4. **Blocked (§6):** clear the customer-portal payment set only via a customer
   billing-portal session + the external payment processor; clear the IBS set only
   after "IBS – Enable Multi-Tenancy" is enabled on the org.
5. Regenerate the workbook after any status change with `build_run331_workbook.py`;
   keep `run331-results-log.md` the source of truth. **Log only Passed to TestRail;**
   keep Failed/Retest/Blocked in the local per-status workbook.

**Never write to TestRail without explicit user permission. Never commit secrets
(/tmp only).**
