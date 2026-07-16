# Custom Roles — Documented PERMISSION-DESIGN Standing Rules
Extracted from `CLAUDE.md`, `build/custom-roles-run/*`, and
`build/custom-roles-spec-update/*` (repo memory, not the spec doc). These are the
QA-team's durable interpretation of the permission MODEL, to annotate the
prod-vs-staging comparison against.

## 1. "Sasha's spec updates" (CLAUDE.md — the canonical permission-model deltas)
Verbatim from CLAUDE.md "Key findings to remember":
- **WO View = create/edit ANY note; WO Delete = delete ANY note** (in-note
  collaboration; delete other users' notes).
- **Order Parts requires See Financial Data** — and Order Parts **controls the WO
  Parts tab**.
- **WO Lines Create&Edit covers core OK/Not-OK + the line's story history.**
- **Manage AP/AR no longer gates aging reports** — aging reports **follow the
  Reports permission, all-or-nothing.**
- **History logs split WO-level vs line-level** (WO-level audit log = WO Create&Edit;
  WOL story history = WOL Create&Edit).
- **Inventory item + SFD gating** (no-SFD Create-Inventory hides Cost, stamps
  Cost/Sell/Core = 0).
- **CAUTION (CLAUDE.md):** several of these spec changes are **NOT yet implemented on
  staging** — cases written to the new spec may FAIL against the current app (see
  `CustomRoles_Run312_SUMMARY.md`).

## 2. Enforcement model (CLAUDE.md "Key findings")
- Backend enforces ONLY **resource-level View/Edit**.
- Granular perms — **Delete, WO sub-perms, cross-toggles, view_mode — are FRONT-END
  display gates** the raw API does NOT enforce.
- Testing rule: **Denial cases → verify in the UI** (FE gate); **enforcement cases →
  hit the endpoint, check 403 vs 200/201.**
- Implication for the comparison: any "capability" that is FE-gated (Send to Portal/
  Terminal, Delete, sub-settings, view_mode) MUST be LIVE UI-OBSERVED per role/env —
  never inferred from role JSON / fe_permissions / atoms (Standing Rules 10/12/13).

## 3. spec-recheck-PREP-2026-07-14 — the reconciled gate list (numbered)
From `build/custom-roles-run/spec-recheck-PREP-2026-07-14.md` (the pre-VIU reconciled
permission-model summary):
1. §5 Cross-Cutting: 5a See Financial Data · 5b **Manage Accounts Payable and
   Receivable** (renamed from "View and Manage AP/AR"; **requires SFD ON**).
2. **AR/AP aging reports → follow Reports** (all-or-nothing), NOT Manage AP/AR.
3. **Reverse Invoice → WO Delete** (was Invoicing Delete); Part-Sale reverse → Part
   Sales Delete.
4. See-Financial-Data OFF prompts to disable dependents (Invoicing CRUD, Part Sales
   CRUD, Order Parts, Manage AP/AR).
5. **Manage AP/AR requires SFD ON** + gates sensitive Customer AND Vendor fields.
6. **WO View = create/edit any note; WO Delete = delete any note; customer notes =
   Customer Management** perm.
7. **Send to Portal = Full View; Send to Terminal = Invoicing Create&Edit + Customer
   Portal ON.**

## 4. Key Decisions carried as standing rules (from spec, reinforced in memory)
- **View Mode is UX, not security** — Tech View simplifies the UI; CRUD is the
  security layer. (But Send-to-Portal + approve are FE-gated by Full View.)
- **Reports is all-or-nothing** (no per-report granularity; includes AP/AR aging).
- **Parts Department is a parent gate** for Part Sales, Catalog&Inv, Vendor&Order.
- **See Financial Data gates Part Sales + Invoicing + Order Parts + Manage AP/AR**
  (single app-wide toggle).
- **See AP/AR (`seeApArData`) is independent of See Financial Data** and does NOT
  gate any CRUD area; only tabs/fields.
- **Customer delete ≠ payment delete** (Customer Mgmt Delete vs Invoicing Delete).
- **Clock in/out + "My Timesheets" always available** regardless of Timesheets perm.
- **Marking cores OK/Not-Ok → gate is WO→View** ("everyone should have access" —
  Cody-agreed Key Decision) — note the spec §1b/Jul-3 WOL-Create&Edit wording is the
  documented internal inconsistency to flag.
- **Return a part from a WO = no permission gate** (everyone; 29 Jun 2026).
- **Office cannot create invoices** (hard-coded, overrides Invoicing CRUD; can pay).
- **Owner role dropped → merged into Admin**; Admin cannot be edited to lose Admin
  pages; Office + Time Clock not editable.
- **Digital Inspections use existing atoms** (add/fill = WOL Edit; remove/reopen =
  WOL Delete; templates = Settings › Service) — no separate permission.
- **Tech schedule + job clocking = staff-record settings, NOT permissions.**
- **Role change = forced logout.**

## 5. Live-verification / trust standing rules (CLAUDE.md Standing Rules 10/12/13)
- **Verified = OBSERVED, never inferred.** Any permission verdict (grants/blocks/
  present/absent) must be live UI-observed per role per environment with evidence;
  otherwise label **NOT VERIFIED / Blocked-with-reason**. Never derive from role
  definitions, fe_permissions, atoms, or source code.
- **Prod-vs-staging (two-env) comparisons: 100% LIVE-OBSERVED, ZERO "NOT VERIFIED"**
  — method in `build/PROD-VS-STAGING-COMPARE-METHOD.md`. Rationale: the 2026-07-14
  incident where FE-gated caps (Send to Portal/Terminal) were presented as results
  when inferred, with an expired session — must not recur.
- **Live, feature-by-feature testing is the DEFAULT** for any test/verify/check/
  confirm request (Rule 13).

## 6. Env / role-drift standing facts (STAGING — Custom Roles)
- Staging org UUID `d55bc308-…`; SPA `app.staging.shopview.com`, API
  `api.staging.shopview.com`.
- **Staging role IDs differ from qa/sv7301 IDs** — use the staging IDs in
  `roles-matrix-2026-07-13.md`.
- **Time Clock (User) restore-role id (STAGING) =
  `a0359055-3dfb-4e9c-9e11-2fbea21585c2`** (the old `77b069d1-…` does NOT exist on
  staging).
- **Tech is currently DRIFTED to the Technician role** — reset to Time Clock User
  before any negative permission retest; env is SHARED (never assume state).
- Enforcement caveat again: several spec deltas may NOT be implemented on staging →
  cases can FAIL against the live build (verify live, don't assume the spec).
