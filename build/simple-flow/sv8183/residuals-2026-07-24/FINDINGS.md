# Simple Flow SV-8183 — Coverage Residuals Re-Run — FINDINGS

- **Date:** 2026-07-24
- **Env:** `app.staging.shopview.com` / `api.staging.shopview.com`, shared org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`, workplace **Staging Heavy Duty - 9919** `b3c8c820…`.
- **Access:** quick-login admin = **200** (verified live at start; cookies OK the whole run).
- **Purpose:** close the **2 honest residuals** rerun2 left open so SV-8183 permission coverage is genuinely complete:
  - **RESIDUAL A** — drive **Service Manager / Senior Service Advisor / Foreman** INDIVIDUALLY THROUGH THE UI (previously only BE-confirmed via the matrix).
  - **RESIDUAL B** — drive the **resolve-cores wizard** + the **received-part return flow** END-TO-END (previously only per-role BE captured).
- **Method (Rules 10/12/13/14/15/24/25/26):** the disposable `qa_reassign` user (uid `01221b93…`, staff `0ca87d16…`) reassigned per role via `POST /api/staff/{staff}/change`, then impersonated via `POST /api/switch-user`, then boot2 Chromium hydration to drive the real SPA. FE observed by **rendered page body + true CSS visibility + enabled/disabled state** of each control (not URL alone). BE measured by hitting the real endpoint (403 = ENFORCED/blocked; 400/422 = PASSED = reached, would succeed = NOT BE-enforced; 201/200 = happy-path success). Impersonated identity verified by fe-permissions **count** before every record. All verdicts LIVE-OBSERVED this run.
- **Classification (user 2026-07-24, strengthened Rule 24):** FE-blocked + BE/API-allowed = **PASS**. A real ISSUE is only **FE-EXPOSURE** (FE lets a role reach something it shouldn't) OR **FE-allows + BE-allows for a role §9.2 says is blocked**.
- **Spec truth source:** §9.2 role×capability matrix in `requirements-SV8183_1.md` (Rule 15 verbatim).

---

## 0. Role reset / drift (Rule 26) — before → after

All roles read live via `GET /api/roles/{id}` at start and end. Evidence `evidence/drift-before.json`, `evidence/drift-after.json`.

| Role | fe_perm count | §9.2 signature | before→after | Drift |
|---|---|---|---|---|
| Service Manager (`ca2b0818`) | 36 | settingsApp + all WO/parts/review atoms | 36 → 36 SAME | at template — no drift |
| Senior Service Advisor (`b7e0b1eb`) | 31 | no settingsApp; all other atoms | 31 → 31 SAME | at template — no drift |
| Foreman (`a9328e5c`) | 23 | no settingsApp; all other atoms | 23 → 23 SAME | at template — no drift |
| Time Clock User (`e35b0211`) | 3 | all No | 3 → 3 SAME | at template — no drift |
| Technician (`50bf6a0d`) | **12** | has `workOrdersCreateAndEdit`+`seeFinancialData`+`settingsApp`+`woFullViewMode` — NOT the canonical 6-atom Technician template | 12 → 12 SAME | **DRIFTED — OUT OF MY SCOPE** |

- The 4 in-scope roles (SM/SrSA/Foreman/TimeClock) are **at template** (counts == documented template fePermissionsCount; capability signature == §9.2). No reset write needed (Save stays disabled when already at template). Corroborates rerun2's 0-drift hours earlier.
- **Technician is DRIFTED** (over-granted to 12 atoms incl. `workOrdersCreateAndEdit`/`seeFinancialData`/`settingsApp`) by a concurrent session — exactly the CLAUDE.md standing caution. **Technician is NOT in my residual scope**, so I did NOT reset it (avoid interfering with the concurrent actor); recorded as an observation. I used **Time Clock** (clean) as my negative control instead of Technician.
- My `qa_reassign` role-cycling touches only that ONE disposable user's assignment, never a role definition. Restored to Admin (42) and verified at the end. **No role definition was drifted by me** (before==after on all).

---

## RESIDUAL A — SM / Senior SA / Foreman driven individually through the UI

Each role: reassign qa_reassign → impersonate → hydrate SPA → observe controls on an **approved** WO (S-25036 `bd159aeb`), a **ready-for-review** WO (S-24011 `0ea47d7d`), an **approved WO with unreceived parts** (S-25247 `04473e90`), the **Parts → Orders / Bulk Receive** page, and the **WO Settings** page. Impersonated perm count verified each time. Screenshots `evidence/{Role}_{page}.png`; scans `evidence/{Role}_scan.json`. BE tie-out this run `evidence/be-sample-3roles.json`.

### §9.2 expected
- SM: Edit settings **Yes**; Complete / Pick / Order / Receive / Bulk Receive / Assign vendor / Fix part# / Add vendorless / Mark Reviewed all **Yes**.
- SrSA & Foreman: Edit settings **No**; everything else **Yes**.

### Live UI observations (FE) + BE tie-out

| Capability (control) | Service Manager (36) | Senior SA (31) | Foreman (23) | §9.2 | Verdict |
|---|---|---|---|---|---|
| Complete WO (`Complete Work Order` master button) | PRESENT | PRESENT | PRESENT | Yes | **PASS** — renders; on S-25036 the master button is **disabled by a data-state gate** ("Valid VIN Required" / "Over Limit"), NOT a permission gate — reproduced identically for the settings-privileged SM too |
| Line-level Complete / Approve / New Line | ENABLED | ENABLED | ENABLED | Yes | **PASS** |
| Mark Reviewed (on review WO S-24011) | **ENABLED** | **ENABLED** | **ENABLED** | Yes | **PASS** — all 3 can sign off review |
| Order Parts (`Order`) | ENABLED | ENABLED | ENABLED | Yes | **PASS** |
| Receive on WO (`Receive` line buttons, S-25247) | ENABLED | ENABLED | ENABLED | Yes | **PASS** |
| Bulk Receive (`/parts/orders`: `New PO` + `Receive`) | ENABLED | ENABLED | ENABLED | Yes | **PASS** |
| Edit WO Settings (`/administration/settings` + `Save`) | **REACHED, Save ENABLED** | **REDIRECT → /workorders (BLOCKED)** | **REDIRECT → /workorders (BLOCKED)** | SM=Yes / SrSA=No / Foreman=No | **PASS** — the `settingsApp` gate is the sole SM-vs-(SrSA/Foreman) differentiator and behaves exactly per §9.2 |

**BE tie-out (same impersonated identity, this run — `be-sample-3roles.json`):** for SM/SrSA/Foreman every probed endpoint returned **400 (passed = allowed)** — `orders/accept` (receive), `pre-resolve-cores`, `inventory/returns/create`, `part/make-request`, `parts/delete`. Negative control **Time Clock** returned **403 ENFORCED** on `accept` + `returns/create` (matches §9.2 No), 400 on the atom-collapsed part endpoints (known SV-7864/SV-8541).

**VERDICT RESIDUAL A: PASS for all three roles.** FE renders (and enables) every positive capability §9.2 grants them; the one negative (WO Settings edit for SrSA/Foreman) is correctly redirect-blocked; FE exactly matches the BE matrix. **No FE-exposure, no gap, no deviation.** The `Complete` master-button disabled state on S-25036 is a VIN/Over-Limit **data-state** gate (reproduced for SM too), not a permission difference.

---

## RESIDUAL B — Resolve-cores wizard + Return flow, END-TO-END

### B.1 Resolve-cores wizard (FE) — should-role vs should-NOT-role

Seed source: real cored WO **S-25777** (`958b7936`, `cores_pending=true`, cored inventory part **N68SL-356** "SPRING LOADED T-BOLT CLAMP"). Six live WOs carry `cores_pending=true` (`evidence` from the WO list scan).

- **Foreman (should — holds `workOrderLinesCreateAndEdit` + `woPickParts` + `workOrdersCreateAndEdit`):** opened `Complete Work Order` → the completion wizard renders the step path **Missing Details → Pick parts → Resolve cores**. Drove it through `Pick All` (`POST /api/work-orders/{id}/pick-inventory-parts` → **201**) to the **Resolve cores** step, where the core-resolution controls render **ENABLED**: **`OK · Returned`** and **`Not OK · Keep + Charge`** (matches the documented wording exactly). Then **Cancelled** (WO not finalized). Evidence `evidence/Foreman_25777_w1.png`, `Foreman_25777_wizard_full.json`, `Foreman_25777_completeModal.png`.
- **Time Clock (should-NOT — 3 atoms, no `workOrdersCreateAndEdit`):** on the same WO the **`Complete Work Order` master button is ABSENT** (`found:false`) → the completion flow, and therefore the resolve-cores wizard, is **unreachable / FE-gated**. Evidence `evidence/TimeClock_25777_wizard.json`, `TimeClock_25777_woLines.png`.

### B.2 Resolve-cores (BE) end-to-end

- **Happy path proven:** `POST /api/work-orders/{id}/pre-resolve-cores {cores:[{partRequestId,isCoreOk:true}]}` on a **"requested"-state** core (S-24706 `1b6f0ae6`, core pr `22c77317`) as admin → **201 `{resolvedCount:1}`** — the endpoint genuinely resolves a core end-to-end.
- **Per-role permission gate:** with a valid body against an already-received core, BOTH **Foreman (23) and Time Clock (3)** returned the SAME **400 "This core has already been received"** (a business-state error, **not a 403**); empty-body probe (`be-sample-3roles.json`) is **400 for both** too. → `pre-resolve-cores` is **NOT BE-permission-enforced** for any role (atom-collapse, SV-7864 / the known **SV-8541** behaviour). Evidence `evidence/resolve-cores-endtoend.json`.

**Classification (Rule 24):** FE gates the resolve-cores wizard to completion-capable roles (Foreman reaches + operates it; Time Clock has no Complete button → unreachable). BE does not independently enforce it (same 400 for both). **FE-block + BE-allow = PASS** — the known **SV-8541**, already held per user "ignore for now"; **NOT re-filed, NOT a new issue.**

### B.3 Return flow (received-part / vendor credit) end-to-end

- **FE per role:** **Foreman** — `/parts/returns` REACHED, **`Create Return` button PRESENT + visible** (`evidence/returns_Foreman.json`/`.png`). **Time Clock** — `/parts/returns` **REDIRECTS to /workorders (route-BLOCKED)**, no Create Return (`evidence/returns_TimeClock.json`/`.png`).
- **BE per role (permission gate):** `POST /api/inventory/returns/create` — **Time Clock = 403 ENFORCED** (blocked); **Foreman = 400** (reached = permission passed; field-validation only). This is the definitive §9.2-relevant per-role result (matches rerun2: 403 for SalesRep/Tech/TimeClock, reached-400 for Yes roles + Office). Evidence `evidence/be-sample-3roles.json`.
- **Happy-path 201 NOT fully driven (honest gap, does NOT affect the permission verdict):** hand-built `returns/create` payloads returned 400/500 on the **vendor-return item contract shape** (`items` field naming / "Cannot return zero or less parts" / server 500), i.e. payload-shape friction, **not a permission block**. A full 201 needs reverse-engineering the exact multi-field FE vendor-return payload (delivery+items+tax+restocking). The **permission gate is already definitively observed** (403 blocked vs reached-400 allowed) and the FE per role is observed, so the permission verification is complete without the 201.

**Classification (Rule 24):** Foreman — FE Create Return present + BE reached (allowed) = capability works = **PASS**. Time Clock — FE route-blocked + BE **403 ENFORCED** = doubly gated = **PASS** (matches §9.2 Time Clock=No). No FE-exposure, no gap.

---

## NEW-ISSUE STATEMENT

**None — residuals now closed. No new permission issue.** No FE-EXPOSURE defect and no FE-allows+BE-allows gap surfaced in either residual.
- SM/SrSA/Foreman FE exactly matches §9.2 and the BE matrix; the sole negative (SrSA/Foreman settings) is correctly redirect-blocked.
- The resolve-cores wizard is FE-gated to completion-capable roles and operable for a WOL-C&E holder; Time Clock cannot reach it. BE not-permission-enforced = the known SV-8541 (held, not re-filed).
- The return flow is FE route-gated + BE-enforced (403) for the negatives; reachable/allowed for the Yes roles.

## COVERAGE STATEMENT

- **RESIDUAL A — COMPLETE.** All three roles (Service Manager, Senior Service Advisor, Foreman) individually UI-driven this run; FE render + enabled-state observed and tied to BE. Nothing remains.
- **RESIDUAL B — COMPLETE for the permission verification, with 2 honest non-permission residuals:**
  - The resolve-cores wizard is proven FE-operable for the should-role (OK/Not-OK enabled, pick 201) and gated for the should-NOT-role; the BE happy path is proven (201 resolvedCount) and the per-role gate observed (not BE-enforced = SV-8541 known). **CLOSED.**
  - The return flow per-role permission gate is proven (403 vs reached-400) and the FE observed per role. **CLOSED for permissions.** Two things NOT driven, neither affecting a verdict: (1) a genuine `returns/create` **201** (blocked by vendor-return payload-shape friction, not permission); (2) the resolve-cores wizard was Cancelled at the core step rather than finalized to a completed WO (to avoid completing a shared test WO).

**Net: SV-8183 permission coverage is now genuinely complete for these residuals. No true permission residual persists.**

## SEEDED MUTATIONS / CLEANUP

- **qa_reassign** (`0ca87d16…`) reassigned through Foreman/SM/SrSA/TimeClock and **restored to Admin (42) — verified** (`drift-after`). Only that one disposable user's assignment was cycled; no role definition changed (before==after on all in-scope roles).
- **S-25777** (`958b7936`, disposable test WO, S9- prefix): the cored inventory part was **picked** (`pick-inventory-parts` 201) during the Foreman wizard drive; the WO was **Cancelled out, NOT completed** — a pending pick remains. Disposable env (Rule 6), reversible in-app, no invoicing.
- **S-24706** (`1b6f0ae6`, disposable test WO): one **requested core resolved** (`pre-resolve-cores` 201, isCoreOk:true) to prove the happy path. Disposable env, no invoicing.
- No new persistent records created; no returns committed (all attempts 400/500). **No TestRail writes; run 325 untouched. Secrets in /tmp only. MITM bridge not left running.**
