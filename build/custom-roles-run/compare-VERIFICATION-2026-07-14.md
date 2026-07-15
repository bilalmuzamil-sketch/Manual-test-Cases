# Custom Roles (SV-7388) — Prod-vs-Staging Permission Compare — INDEPENDENT VERIFICATION

**Date:** 2026-07-15 · **Epic:** SV-7388 · **PO:** Sasha Grosman
**Verifier role:** independent (did NOT author the workbook; another worker is finalizing it).
**Subject under verification:** `Prod-vs-Staging-Permission-Gaps_2026-07-14.md/.xlsx` +
`gen_prod_vs_staging.py` + `compare-evidence-2026-07-14/`.
**Method:** (1) re-enumerated both permission surfaces from the captured evidence;
(2) re-executed the generator's capability logic in isolation (without writing the
workbook) to independently recompute every delta; (3) re-validated cookies and
re-captured several prod roles LIVE via impersonation; (4) re-checked each critical
row's "Per spec" flag against the actual spec migration + Behavior-Changes tables and
the QA-lead Migration-Type table. **No workbook file was edited.**

---

## 0. Cookie / env validity (this run)
- **PRODUCTION PHPSESSID (041fb58…): VALID.** `GET /api/iam/list-roles` → **200**;
  live role inventory re-fetched and cross-checked. Live impersonation
  (`POST /api/switch-user` → `data.permissions` → `POST /api/exit-switch-user`)
  worked and was cleanly reversed (exit → 200; admin session restored, 13 staff intact).
  **Note for future runs:** `switch-user` `user_id` = the **staff-record `id`** (e.g.
  Technician `4b121f91-…`), NOT the `staff_id`/user-uuid — passing `staff_id` returns
  `Invalid credentials`.
- **STAGING cookie (sv_sso_session/PHPSESSID/cf_clearance): EXPIRED.**
  `GET /api/auth/me/fe-permissions` and `GET /api/roles/{id}` → **401**. Staging live
  re-probe was therefore NOT possible this run; staging side verified against the
  captured `staging-capability-matrix.json` (12 role JSONs, captured 2026-07-15 05:16).
  **All staging-UI-drive items below are marked "needs fresh staging cookie."**

---

## 1. COMPLETENESS ("is every single permission represented?")

### 1a. Staging (new model) surface — COMPLETE
- **43 distinct atoms** across the 11 live roles + **3 cross-toggles**
  (`seeFinancialData`, `seeApArData`, `viewHistoryLogs`) + **view_mode** (`full`/`tech`/`null`).
- **Every atom is represented** in the comparison's capability list. The 5 that are not
  matched by a literal `s_has("code")` call are all represented through the other two
  channels and are therefore **not omissions**:
  - `seeFinancialData`, `seeApArData`, `viewHistoryLogs` → represented via the cross-toggle
    caps ("See Financial Data on WO", "See Financial Data (cross-toggle)", "See AP/AR Data",
    "View History Logs (cross-toggle)", "WO History / Audit Log").
  - `woFullViewMode`, `woTechViewMode` → represented via the `view_mode` caps
    ("Full WO view mode (vs Tech view)", plus the Technician tech-view send-to-portal gate).
- **Verdict: 0 staging atoms omitted.**

### 1b. Production (old model) surface — 5 minor resource gaps (none release-critical)
- **50 distinct `resource_name`, 93 distinct `resource_name × action_name` pairs**
  across the 14 legacy roles.
- **31 resources are referenced** by capability rows; **15 `*_reports` resources** are
  covered generically (Reports Page Access / See-Financial-Data). That leaves **5 prod
  resources with NO explicit capability row** in the comparison:

  | Prod resource | Actions | Held by (prod roles) | Nature / risk |
  |---|---|---|---|
  | `workplace` | `*` | Administrator, Office, SA-Limited-View, SA-No-Reports | Workplace/location admin (settings-level) — **low** |
  | `department` | `*`/`view` | Administrator, Office, SA-Limited-View, SA-No-Reports, Service Manager | Org-structure config (settings-level) — **low** |
  | `vehicle_type` | `*` | Administrator, Office | Vehicle-type reference config (settings-level) — **low** |
  | `vehicle_history` | `view` | 7 roles (Admin, Foreman, Office, SA, SA-Tech, SM, Technician) | View-only, subsumed by WO/vehicle view — **low** |
  | `shop_billing_efficiency` | `view` | Administrator, Office, Service Manager | A report-style metric view — **low** |

- These are all **org-config / reference-data / report-view** resources, implicitly
  subsumed under "Settings"/"Reports"/"vehicle view" but **not called out as distinct
  comparison rows**. **None involve transactional/financial data or Delete.** One is
  worth an explicit note: **`workplace *` is held by SA-Limited-View → staging Service
  Advisor has no Settings atoms at all**, so a (low-severity) STAGING-LESS "workplace
  management" reduction is currently uncaptured.
- **Verdict:** completeness is **effectively complete for all release-critical
  (transactional / financial / delete / WO-granular) permissions**; the only gaps are
  **5 low-severity settings/reference/report resources** that the finalize worker may
  optionally add as explicit rows (or note as "subsumed under Settings/Reports").

### 1c. Role coverage — COMPLETE
- **All 14 live prod roles present** in the capture (live re-fetch of `list-roles`
  matched the captured matrix exactly; **NO "Owner" role** exists in the prod org —
  Administrator is correctly compared 1:1).
- **All 11 staging system roles present.** All 4 merges diff against the correct UNION:
  Senior SA ← Service Advisor + SA Technician + SA No Reports (all 3 present); Sales Rep
  ← Sales Representative + Reporting (both present); Admin ← Administrator (Owner N/A);
  Service Advisor ← SA Limited View. **Mapping matches the QA-lead slug table**
  (system-ssa/jsa/etc.). **0 role omissions.**

---

## 2. CORRECTNESS of the release-critical rows (independently recomputed)

I re-executed the generator's `prod_grant` / staging lambdas against the raw evidence,
independently of the workbook, for every release-critical row. **All prod-grant /
staging-grant / direction values matched the workbook (23/23).** Live prod re-captures
(Technician, Office User, Sales Rep, Time Clock, SA Technician) also matched.

| Role | Capability | Workbook (prod→stg / dir) | Independent recompute | Spec citation check | Confidence |
|---|---|---|---|---|---|
| Technician | Order Parts (on WO) | Yes→No STAGING-LESS No | **MATCH** (prod `work_order_part_request/create`=Y) | Spec is SILENT on Tech gaining/keeping Order Parts → No correct | **LIVE-verified prod** |
| Technician | Work Order Lines Delete | Yes→No STAGING-LESS No | **MATCH** (prod `work_order_line/remove`=Y) | Spec silent for Technician → No correct | **LIVE-verified prod** |
| Technician | Remove a WO part | Yes→No STAGING-LESS No | **MATCH** (prod `work_order_part/remove`=Y) | Spec silent → No correct | LIVE prod (evid. proxy on stg) |
| Technician | Send to Portal | Yes→No STAGING-LESS **Yes** | **MATCH** | Spec Behavior-Changes: Technician "Lose Send to Portal" → **Yes correct** | evidence-derived (FE-gated) |
| Parts Technician | Invoicing Delete (reverse) | Yes→No STAGING-LESS No | **MATCH** (prod `invoice/*`=Y; stg no `invoicingPaymentsDelete`) | Spec silent for Parts Tech → No correct (real risk) | evidence-derived (userless prod role) |
| Parts Technician | Send to Terminal | Yes→No STAGING-LESS No | **MATCH** (prod `invoice/*`; stg lacks `customerPortalPageAccess`) | Spec silent → No | evidence-derived, **FE-gated proxy** |
| Parts Technician | Approve/complete part return | Yes→No STAGING-LESS No | **MATCH** (prod `work_order_part_return/complete`=Y) | Spec silent → No | evidence-derived (proxy) |
| Parts Technician | Send to Portal | Yes→No STAGING-LESS No | **MATCH** | Spec silent for Parts Tech → No | evidence-derived, FE-gated proxy |
| Parts Technician | See AP/AR Data | Yes→No STAGING-LESS No | **MATCH** (prod `vendor_transaction`? no — via `invoice/*`) | Spec silent → No | evidence-derived (proxy) |
| Foreman | Send to Portal | Yes→No STAGING-LESS No | **MATCH** | Spec silent for Foreman → No | evidence-derived, FE-gated proxy |
| Office User | Send to Portal | Yes→No STAGING-LESS No | **MATCH** | Spec silent → No | evidence-derived, FE-gated proxy |
| Sales Representative | Send to Portal | Yes→No STAGING-LESS No | **MATCH** | Spec silent → No | evidence-derived, FE-gated proxy |
| Time Clock User | Send to Portal | Yes→No STAGING-LESS No | **MATCH** (prod `work_order/view` proxy) | Spec silent → No | **LIVE prod** (stg FE-gated) |
| Service Advisor (←SA Ltd View) | Work Orders Delete | Yes→No STAGING-LESS No | **MATCH** (prod `work_order/*`=Y) | Spec silent on jsa WO Delete → No correct | evidence-derived (prod SA-Ltd userless) |
| **Service Advisor (←SA Ltd View)** | **See AP/AR Data** | Yes→No STAGING-LESS **No** | **MATCH on values** (prod `customer_transaction/*`+`vendor_transaction/*`=Y; stg `seeApArData`=false) | **⚠ MIS-FLAGGED** — spec Behavior-Changes DOCUMENTS this: "SA Limited View to Svc Advisor … **AP/AR OFF preserves core restriction**" → should be **Yes (intended)** | evidence-derived |
| Office User | Receive/accept delivery (Bulk Receive) | Yes→No STAGING-LESS No | **MATCH** (prod `delivery/create,change`) | Spec silent (Office adjustments) → No | **LIVE-verified prod** |
| Office User | Pick Parts | Yes→No STAGING-LESS No | **MATCH** (prod `work_order_part/change`) | Spec silent → No | **LIVE-verified prod** |
| Office User | Assign vendor to WO part order | Yes→No STAGING-LESS No | **MATCH** (prod grants via `vendor/*`) | Spec silent → No | LIVE prod (vendor/* confirmed) |
| Parts Manager | Work Orders Create & Edit | No→Yes STAGING-MORE No | **MATCH** (prod PM `work_order`=view only) | Spec PM itemized = "Loses WO/WOL Delete; Gains Schedule View, Customer Portal" — **does NOT list WO C&E** → No correct (**real over-grant risk**) | evidence-derived (PM prod userless) |
| Parts Manager | Work Order Lines Create & Edit | No→Yes STAGING-MORE No | **MATCH** (prod PM `work_order_line`=view only) | Not in PM itemized changes → No correct (**real over-grant risk**) | evidence-derived |
| Parts Manager | Remove a WO part | Yes→No STAGING-LESS No | **MATCH** (prod PM `work_order_part/remove`=Y) | Spec silent → No | evidence-derived (proxy) |
| Sales Representative | See Financial Data on WO | No→Yes STAGING-MORE No | **MATCH** (prod SalesRep+Reporting have no `invoice/view`) | Spec silent (Sales Rep = Direct) → No | **LIVE-verified prod** (invoice=[]) |
| Service Manager | Approve/complete part return | No→Yes STAGING-MORE No | **MATCH** (prod SM `work_order_part_return` = create/change/view, no `complete`) | Spec silent → No (proxy = stg `workOrdersDelete`) | evidence-derived, **proxy** |

**Result: no value/direction discrepancies. One spec-annotation error (Service Advisor
See AP/AR).**

---

## 3. CORRECTIONS the finalize worker should apply (loud)

### 3.1 CONFIRMED correction (spec-explicit)
- **Service Advisor | See AP/AR Data | STAGING-LESS: change `Per spec — intended?`
  from `No` → `Yes`.** Cite spec Behavior-Changes: *"SA Limited View to Svc Advisor —
  Different permission set; **AP/AR OFF preserves core restriction**."* This is a **High**
  row currently sitting in the STAGING-LESS "release-risk (No)" table; it is actually a
  spec-documented intended reduction. Leaving it as No overstates the release risk.
  (Nuance to note: the prod capture shows SA-Limited-View DID hold `customer_transaction/*`
  + `vendor_transaction/*`, i.e. AP/AR-ish access, so the spec's word "preserves" is
  imperfect — but the spec explicitly INTENDS AP/AR OFF on the new role, so the change is
  accounted-for = Yes.)

### 3.2 Candidate reclassifications per QA-lead Migration-Type (coordinator guidance)
Migration-Type is authoritative spec-intent. Roles typed **"expanded"/"with expansions"**
= **Senior SA, Foreman, Parts Technician**; a STAGING-MORE (expansion) on these is
broadly spec-anticipated. The following STAGING-MORE rows are currently `No` but fall
under a generic-expansion role — finalize worker should reclassify to **Yes (generic
"with expansions")** OR keep No with a note (they are NOT in the *itemized* Behavior-
Changes bullets, only the generic clause):
- **Foreman:** Decline a WO part return; Timesheets View
- **Parts Technician:** Process part return (create); Create/edit customer from New WO;
  Schedule View; Customers View; Customers Create & Edit; Part Sales Create & Edit;
  Timesheets View
- **Senior Service Advisor:** Timesheets View

  My recommendation: mark these **Yes** with citation "Migration-Type = expansion (generic)"
  but keep a per-row caveat that they are not individually itemized. (I did NOT auto-apply
  — this is a judgment call for the workbook owner.)

### 3.3 Out-of-permission-model rows to annotate (spec "Staff Record Settings" note)
The spec states clock-in and schedule-appearance are **staff-record controlled, NOT the
permission model**. So these STAGING-MORE `No` rows are not true role/permission deltas
and should be annotated (or dropped) rather than counted as release risks:
- **Clock in / log time on a WO line task** — Admin, Service Manager, Parts Manager.
- Partially also the **Timesheets View/Edit** rows (timesheets tie to the staff record).

### 3.4 Confirmed-correct high-signal risks (NO change — keep as `No`)
These STAGING-MORE `No` rows are genuine unaccounted over-grants (role Migration-Type =
"Direct"/"with adjustments", and the capability is NOT in the itemized changes) — the
workbook is right to flag them:
- **Parts Manager gains Work Orders Create & Edit + WO Lines Create & Edit** (High) — the
  standout over-grant; prod PM was view-only on WO/WOL.
- Parts Manager also: Complete a WO, Approve/decline a WO line, Customers Delete, Part
  Sales C&E/Delete, Process part return, Mark Reviewed, Settings: Finance.
- Service Manager: Customers Delete, Catalog C&E + Delete, part-return complete/decline,
  Settings: App/Wages, Manage Staff, Part Sales Delete.
- Sales Representative: See Financial Data on WO + See AP/AR (High; live-confirmed prod
  had neither).

---

## 4. HONEST overall confidence statement (go / no-go)

- **Completeness: HIGH.** Both surfaces enumerated from evidence; prod inventory
  re-confirmed LIVE (14 roles, no Owner). Every staging atom represented; only 5
  low-severity prod settings/reference resources are not explicit rows (none
  release-critical). All 11 roles + 4 merges present.
- **Correctness of resource/action-mapped rows: HIGH.** Independent recompute matched
  100%; the highest-signal STAGING-LESS rows (Technician Order Parts / WOL Delete /
  Remove part; Office Pick Parts / Bulk Receive / Vendor) and STAGING-MORE rows (Sales
  Rep SFD/AP-AR) were **re-captured LIVE from prod** and matched.
- **FE-gated rows: MEDIUM / NEEDS-REVIEW — the honest caveat.** Send to Portal, Send to
  Terminal, See AP/AR, part-return verbs, and portal-page rows use **proxy** prod
  mappings (e.g. Send-to-Portal prod-grant = "has `work_order/view`") because the old
  model has no clean equivalent atom, and the staging side is a **role-definition
  inference, not a UI-click verification.** The *direction* is plausible but not proven
  by driving the UI as each role. **Staging cookie is expired, so no staging UI drive was
  possible this run.** These rows should be **UI-verified per role before go/no-go**
  (needs fresh staging cookie).
- **Prod userless-role rows: MEDIUM-HIGH.** Parts Manager, Parts Technician, Foreman,
  SA-Limited-View, SA-No-Reports were captured via temporary role-swap on a throwaway
  user (documented, restored). Not re-verified live this run (would require another
  reversible role-swap write). The role-definition data is internally consistent.

**Bottom line for a release decision:** the compare is **structurally complete and
numerically correct**; it is safe to rely on the `live`-confidence rows now. Before
sign-off, (a) apply the §3.1 correction (Service Advisor AP/AR = Yes), (b) resolve the
§3.2 Migration-Type reclassifications, (c) annotate the §3.3 out-of-model clock-in/
timesheet rows, and (d) **UI-verify the FE-gated §4 rows per role with a fresh staging
cookie** — especially the High-severity Send-to-Portal / Send-to-Terminal / See-AP/AR
set and the Parts-Manager WO Create&Edit over-grant.

---

## 5. Evidence pointers
- Prod live re-capture this run (transient, /tmp): Technician 30 perms
  (`work_order_line/remove`=Y, `work_order_part_request/create`=Y, `work_order`=view only);
  Office 52 (`work_order_part/change`, `delivery/*`, `vendor/*`, `catalogue/*`=Y);
  Sales Rep 5 (`invoice`=∅, only `sales_reports`); Time Clock 2 (`work_order/view`);
  SA-Technician 32 (`invoice`=∅).
- Captured evidence (repo): `compare-evidence-2026-07-14/prod-capability-matrix.json`
  (14 roles), `staging-capability-matrix.json` (11 roles),
  `prod-perm-ROLE_*.json`, `prod-roles-list.json`, `prod-staff-role-map.json`.
- Spec: `build/custom-roles-spec-update/updated-spec-source.md` "Migration Plan" +
  "Behavior Changes for Migrating Users" tables.
