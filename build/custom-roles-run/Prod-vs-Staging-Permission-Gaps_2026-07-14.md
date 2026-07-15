# Custom Roles (SV-7388) — PRODUCTION vs STAGING Permission Gaps (LIVE, VERIFIED)

**Date:** 2026-07-15 · **Epic:** SV-7388 Custom Roles & Permissions · **PO:** Sasha Grosman
**Status:** ✅ BOTH SIDES LIVE-VERIFIED · **MAPPING CONFIRMED by QA lead 2026-07-14** (spec
migration table authoritative — Service Advisor / Senior Service Advisor rows are FINAL) ·
**INDEPENDENT VERIFICATION APPLIED** (`compare-VERIFICATION-2026-07-14.md`).
**Workbook:** `Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx` (13-col bi-directional main tab
with **Migration Type** + **Verification confidence** columns + dedicated **Work Orders —
granular** tab + per-role 2×2 summaries + **Out-of-model (staff-record)** tab + full matrix +
open questions).

## Data provenance (live)
- **Staging (new custom-roles model):** 11 system roles, `GET /api/organizations/{org}/roles`
  + per-role `GET /api/roles/{id}`, org `d55bc308-…`.
- **Production (old legacy model):** authenticated live on `api.shopview.com` (fresh PHPSESSID,
  no SSO). Prod org UUID `72b2cc90-6964-4429-a207-76e55f946936`. **14 legacy roles** from
  `GET /api/iam/list-roles`. **No "Owner" role exists in either environment**, so Administrator
  is compared **1:1** (spec "Owner merged in" not applicable; confirmed QA lead 2026-07-14).
  Per-role effective permissions captured by **impersonation** (`switch-user` → `data.permissions`
  → `exit-switch-user`); userless roles via a temporary throwaway-user role swap, restored to
  Technician. No prod data left modified.
- **Models:** old = `{resource_name, action_name}` pairs (action `*` = ALL incl. delete);
  new = 41 fe_permission atoms + view_mode + 3 cross-toggles. Capabilities translated old↔new.

## Independent verification applied (compare-VERIFICATION-2026-07-14.md)
- **Migration Type** column added per staging role (QA-lead spec Migration-Type = spec intent).
- **Verification confidence** column: **HIGH** = resource/action-mapped (independent recompute
  matched 23/23 + prod live-confirmed); **MEDIUM / NEEDS-UI-VERIFY** = FE-gated / no clean
  old-model atom (Send to Portal/Terminal, part-return verbs, AP/AR proxies, portal pages) —
  role-definition-inferred, **not UI-click-verified** (drive per role with a fresh staging cookie).
- **Correction 3.1:** *Service Advisor · See AP/AR Data · STAGING-LESS* → **intended = Yes**
  (spec "AP/AR OFF preserves core restriction") — removed a false **High** release risk.
- **Correction 3.2:** 7 STAGING-MORE expansion rows on expansion-typed roles
  (Foreman, Parts Technician) flipped **No → Yes**, citing Migration-Type "Direct (with
  expansions)" (generic clause; not individually itemized in Behavior-Changes).
- **Correction 3.3:** Clock-in + Timesheets rows are **staff-record-controlled** (spec "Staff
  Record Settings"), NOT permission deltas — moved to the **Out-of-model** section and **excluded
  from the risk "No" counts** (10 rows).
- **Kept as real "No" risks:** Parts Manager gains WO Create&Edit + WO Lines Create&Edit;
  SM/PM delete + settings over-grants; Sales Rep SFD/AP-AR; all STAGING-LESS regressions
  (Technician Order-Parts / WOL-Delete, Parts-Tech invoice-reverse, etc.).

## Staging UI / FE-source verification of the FE-gated High rows (2026-07-15)
Live staging role definitions (`GET /api/roles/{id}` + cross_toggles + view_mode, plus role
**slugs** from `GET /api/role-templates`) were evaluated against the ACTUAL front-end gate
predicate read from the shipped staging JS bundle. (Live pixel-screenshots were blocked: the
`sv_sso_session` expired mid-run — quick-login returned 200 but the next API call 409'd "Session
has expired"; the verification is FE-source + live role-definition data, authoritative for a
front-end DISPLAY gate.) Raw evidence: `staging-ui-verify-2026-07-14/`.

- **Send to Portal → HIGH (verified).** FE gate = Customer Portal access (store helper
  `userHasCustomerPortalAccess = has("customerPortalPageAccess")`; button in `WorkOrderNavBar`).
  Live staging: the atom is **ABSENT for all 6 STAGING-LESS roles** (Technician, Foreman, Parts
  Technician, Office User, Sales Representative, Time Clock User) → **HIDDEN**, and **PRESENT for
  the 5 roles that keep it** (Admin, Parts Manager, Senior Service Advisor, Service Advisor,
  Service Manager) → **SHOWN**. Internally consistent → the STAGING-LESS "Send to Portal" rows are
  CONFIRMED (staging genuinely hides it for those 6). Prod grants it (evidence-derived proxy =
  `work_order/view`).
- **See AP/AR Data → HIGH (verified).** FE gate = `seeApArData()` cross-toggle (source:
  `check:()=>seeApArData()` on the Accounts Payable/Receivable + transactions + payments tabs).
  Live staging cross_toggles match: Parts Tech OFF (HIDDEN, STAGING-LESS), Sales Rep ON (VISIBLE,
  STAGING-MORE), Service Advisor OFF (HIDDEN, spec-intended).
- **Send to Terminal → control ABSENT from the staging build.** No payment-terminal / card-reader
  / "Send to Terminal" / "take payment" control exists anywhere in the staging FE bundle
  ("terminal" matches only the Quasar framework). There is **no per-role Send-to-Terminal gate**
  in staging — the Parts-Tech STAGING-LESS row reflects a build-wide absence, not a role
  regression. Confirm prod's actual control name before treating it as a role-level loss.
- **Part-return approve/complete + decline → still MEDIUM / NEEDS-UI-VERIFY.** The controls DO
  exist in the staging build ("Process Return" / "Confirm Return"), but the exact permission gate
  could not be isolated from the minified source and the pixel-screenshot was blocked by SSO
  expiry.

## Headline totals (corrected, out-of-model excluded)
| Direction | Intended (Yes, spec/Migration-Type cited) | **NOT in spec (No) = RELEASE RISK** |
|---|---|---|
| **STAGING-LESS** (prod grants, staging doesn't) | 5 | **51** |
| **STAGING-MORE** (staging grants, prod didn't) | 24 | **37** |

- **Work Orders — granular:** STAGING-LESS No = **22** · STAGING-MORE No = **18**
- **Out-of-model (staff-record, excluded from No counts):** 10 rows (WO 3)

> The **No** rows in BOTH directions are the release-eve items needing a keep/change decision.
> Mapping is CONFIRMED (QA lead 2026-07-14); Administrator compared 1:1 (Owner N/A).

## STAGING-LESS · NOT-in-spec (No) — prod can do MORE than staging (regressions / over-in-prod)
| Staging role | Slug | Capability | Prod role(s) mapped | Severity | Confidence | Verification |
|---|---|---|---|---|---|---|
| Foreman | foreman | Send to Portal | Foreman | High | NEEDS-REVIEW | HIGH |
| Office User | office | Send to Portal | Office User | High | NEEDS-REVIEW | HIGH |
| Parts Manager | parts_manager | Remove a WO part | Parts Manager | High | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Technician | parts_technician | Approve / complete a WO part return | Parts Technician | High | NEEDS-REVIEW | MEDIUM |
| Parts Technician | parts_technician | Invoicing & Payments Delete (reverse/delete invoice) | Parts Technician | High | live | HIGH |
| Parts Technician | parts_technician | Remove a WO part | Parts Technician | High | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Technician | parts_technician | See AP/AR Data | Parts Technician | High | NEEDS-REVIEW | HIGH |
| Parts Technician | parts_technician | Send to Portal | Parts Technician | High | NEEDS-REVIEW | HIGH |
| Parts Technician | parts_technician | Send to Terminal (take payment on WO) | Parts Technician | High | NEEDS-REVIEW | HIGH |
| Sales Representative | sales_representative | Send to Portal | Sales Representative | High | NEEDS-REVIEW | HIGH |
| Service Advisor | service_advisor | Work Orders Delete | Service Advisor - Limited View | High | live | HIGH |
| Technician | technician | Order Parts (on WO) | Technician | High | live | HIGH |
| Technician | technician | Remove a WO part | Technician | High | NEEDS-REVIEW | MEDIUM / UI-verify |
| Technician | technician | Work Order Lines Delete | Technician | High | live | HIGH |
| Time Clock User | time_clock_user | Send to Portal | Time Clock User | High | NEEDS-REVIEW | HIGH |
| Foreman | foreman | Part Sales Create & Edit | Foreman | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Office User | office | Assign vendor to a WO part order | Office User | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Office User | office | Catalog & Inventory Delete | Office User | Medium | live | HIGH |
| Office User | office | Create / edit asset (vehicle) from New WO screen | Office User | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Office User | office | Manage picked WO parts (view/change) | Office User | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Office User | office | Pick Parts | Office User | Medium | live | HIGH |
| Office User | office | Receive / accept a delivery (Bulk Receive) | Office User | Medium | live | HIGH |
| Office User | office | Settings: Parts | Office User | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Office User | office | Vendor & Order Mgmt Create & Edit | Office User | Medium | live | HIGH |
| Office User | office | Vendor & Order Mgmt Delete | Office User | Medium | live | HIGH |
| Parts Manager | parts_manager | Manage Staff | Parts Manager | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | Settings: Wages | Parts Manager | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Technician | parts_technician | Decline a WO part return | Parts Technician | Medium | NEEDS-REVIEW | MEDIUM |
| Senior Service Advisor | senior_service_advisor | Catalog & Inventory Delete | Service Advisor - No Reports | Medium | live | HIGH |
| Senior Service Advisor | senior_service_advisor | Customers Delete | Service Advisor - No Reports | Medium | live | HIGH |
| Senior Service Advisor | senior_service_advisor | Settings: App | Service Advisor - No Reports | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Senior Service Advisor | senior_service_advisor | Settings: Finance | Service Advisor - No Reports | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Senior Service Advisor | senior_service_advisor | Settings: Integrations | Service Advisor - No Reports | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Senior Service Advisor | senior_service_advisor | Settings: Service | Service Advisor - No Reports | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Advisor | service_advisor | Catalog & Inventory Delete | Service Advisor - Limited View | Medium | live | HIGH |
| Service Advisor | service_advisor | Customers Delete | Service Advisor - Limited View | Medium | live | HIGH |
| Service Advisor | service_advisor | Part Sales Delete | Service Advisor - Limited View | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Advisor | service_advisor | Settings: App | Service Advisor - Limited View | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Advisor | service_advisor | Settings: Finance | Service Advisor - Limited View | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Advisor | service_advisor | Settings: Integrations | Service Advisor - Limited View | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Advisor | service_advisor | Settings: Service | Service Advisor - Limited View | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Advisor | service_advisor | Vendor & Order Mgmt Delete | Service Advisor - Limited View | Medium | live | HIGH |
| Technician | technician | Assign vendor to a WO part order | Technician | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Technician | technician | Create / edit asset (vehicle) from New WO screen | Technician | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Technician | technician | Part Sales Create & Edit | Technician | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Office User | office | Canned lines on WO (add/edit) | Office User | Low | NEEDS-REVIEW | MEDIUM / UI-verify |
| Senior Service Advisor | senior_service_advisor | Billing Portal Page Access | Service Advisor - No Reports | Low | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Advisor | service_advisor | Billing Portal Page Access | Service Advisor - Limited View | Low | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Advisor | service_advisor | WO notes - delete | Service Advisor - Limited View | Low | NEEDS-REVIEW | MEDIUM / UI-verify |
| Technician | technician | Part Sales View | Technician | Low | NEEDS-REVIEW | MEDIUM / UI-verify |
| Technician | technician | Vendor & Order Mgmt View | Technician | Low | live | HIGH |

## STAGING-MORE · NOT-in-spec (No) — staging grants MORE than prod (unaccounted expansions)
| Staging role | Slug | Capability | Prod role(s) mapped | Severity | Confidence | Verification |
|---|---|---|---|---|---|---|
| Parts Manager | parts_manager | Work Order Lines Create & Edit | (none of mapped) | High | live | HIGH |
| Parts Manager | parts_manager | Work Orders Create & Edit | (none of mapped) | High | live | HIGH |
| Sales Representative | sales_representative | See AP/AR Data | (none of mapped) | High | NEEDS-REVIEW | HIGH |
| Sales Representative | sales_representative | See Financial Data on WO (rates/margins/totals) | (none of mapped) | High | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Manager | service_manager | Approve / complete a WO part return | (none of mapped) | High | NEEDS-REVIEW | MEDIUM |
| Admin | administrator | Customer Portal Page Access | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | Approve / decline a WO line | (none of mapped) | Medium | live | HIGH |
| Parts Manager | parts_manager | Complete a Work Order | (none of mapped) | Medium | live | HIGH |
| Parts Manager | parts_manager | Create / edit asset (vehicle) from New WO screen | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | Create / edit customer from New WO screen | (none of mapped) | Medium | live | HIGH |
| Parts Manager | parts_manager | Customers Create & Edit | (none of mapped) | Medium | live | HIGH |
| Parts Manager | parts_manager | Customers Delete | (none of mapped) | Medium | live | HIGH |
| Parts Manager | parts_manager | Mark Reviewed / review sign-off | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | Part Sales Create & Edit | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | Part Sales Delete | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | Process a WO part return (create) | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM |
| Parts Manager | parts_manager | Settings: Data Import | (none of mapped) | Medium | live | HIGH |
| Parts Manager | parts_manager | Settings: Finance | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | View History Logs (cross-toggle) | (none of mapped) | Medium | live | HIGH |
| Parts Manager | parts_manager | WO History / Audit Log (view) | (none of mapped) | Medium | live | HIGH |
| Service Manager | service_manager | Catalog & Inventory Create & Edit | (none of mapped) | Medium | live | HIGH |
| Service Manager | service_manager | Catalog & Inventory Delete | (none of mapped) | Medium | live | HIGH |
| Service Manager | service_manager | Customers Delete | (none of mapped) | Medium | live | HIGH |
| Service Manager | service_manager | Decline a WO part return | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM |
| Service Manager | service_manager | Manage Staff | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Manager | service_manager | Part Sales Delete | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Manager | service_manager | Settings: App | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Manager | service_manager | Settings: Wages | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Manager | service_manager | View History Logs (cross-toggle) | (none of mapped) | Medium | live | HIGH |
| Service Manager | service_manager | WO History / Audit Log (view) | (none of mapped) | Medium | live | HIGH |
| Technician | technician | Decline a WO part return | (none of mapped) | Medium | NEEDS-REVIEW | MEDIUM |
| Parts Manager | parts_manager | Canned lines on WO (add/edit) | (none of mapped) | Low | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | Customers View | (none of mapped) | Low | live | HIGH |
| Parts Manager | parts_manager | Edit / move WO line tasks | (none of mapped) | Low | NEEDS-REVIEW | MEDIUM / UI-verify |
| Parts Manager | parts_manager | Set line status (bulk) | (none of mapped) | Low | live | HIGH |
| Sales Representative | sales_representative | Part Sales View | (none of mapped) | Low | NEEDS-REVIEW | MEDIUM / UI-verify |
| Service Manager | service_manager | Canned lines on WO (add/edit) | (none of mapped) | Low | NEEDS-REVIEW | MEDIUM / UI-verify |

## STAGING-LESS · intended (Yes, spec-documented reductions)
| Staging role | Capability | Prod role(s) mapped | Severity | Spec / Migration-Type citation |
|---|---|---|---|---|
| Service Advisor | See AP/AR Data | Service Advisor - Limited View | High | Spec Behavior-Changes: 'SA Limited View to Svc Advisor - AP/AR OFF preserves core restriction' (intended reduction; verification 3.1) |
| Service Manager | Invoicing & Payments Delete (reverse/delete invoice) | Service Manager | High | Spec Behavior-Changes l.478: Service Manager 'Loses Invoicing Delete (cannot reverse)' |
| Technician | Send to Portal | Technician | High | Spec Behavior-Changes l.480 + change-log l.565: Technician 'Lose Send to Portal' |
| Office User | Catalog & Inventory Create & Edit | Office User | Medium | Spec Behavior-Changes l.483: Office 'Catalog reduced to V only' |
| Service Manager | Settings: Finance | Service Manager | Medium | Spec Behavior-Changes l.478: Service Manager 'Loses Settings: Finance' |

## STAGING-MORE · intended (Yes, spec / Migration-Type documented expansions)
| Staging role | Capability | Prod role(s) mapped | Severity | Spec / Migration-Type citation |
|---|---|---|---|---|
| Foreman | Create an invoice from a WO (estimate->invoice) | (none of mapped) | High | Spec l.479: Foreman 'Gains Invoicing V/CE' |
| Foreman | Invoicing & Payments Create & Edit | (none of mapped) | High | Spec l.479: Foreman 'Gains Invoicing V/CE' |
| Foreman | See Financial Data (cross-toggle) | (none of mapped) | High | Spec l.479 Invoicing V/CE + l.572 (SFD required for invoicing) |
| Foreman | See Financial Data on WO (rates/margins/totals) | (none of mapped) | High | Spec l.479 Invoicing V/CE + l.572 (SFD required for invoicing) |
| Foreman | Catalog & Inventory Create & Edit | (none of mapped) | Medium | Spec l.479: Foreman 'Gains Parts Dept (Catalog V/CE)' |
| Foreman | Decline a WO part return | (none of mapped) | Medium | Migration-Type: Foreman = 'Direct (with expansions)' - generic expansion clause (not individually itemized; verification 3.2) |
| Foreman | Invoicing & Payments View | (none of mapped) | Medium | Spec l.479: Foreman 'Gains Invoicing V/CE' |
| Foreman | Receive / accept a delivery (Bulk Receive) | (none of mapped) | Medium | Spec l.479: Foreman 'Gains Vendor V/CE' (delivery) |
| Foreman | Vendor & Order Mgmt Create & Edit | (none of mapped) | Medium | Spec l.479: Foreman 'Gains Parts Dept (Vendor V/CE)' |
| Parts Manager | Customer Portal Page Access | (none of mapped) | Medium | Spec l.481: Parts Manager 'Gains Customer Portal' |
| Parts Technician | Create / edit customer from New WO screen | (none of mapped) | Medium | Migration-Type: Parts Technician = 'Direct (with expansions)' - generic expansion clause (not individually itemized; verification 3.2) |
| Parts Technician | Customers Create & Edit | (none of mapped) | Medium | Migration-Type: Parts Technician = 'Direct (with expansions)' - generic expansion clause (not individually itemized; verification 3.2) |
| Parts Technician | Part Sales Create & Edit | (none of mapped) | Medium | Migration-Type: Parts Technician = 'Direct (with expansions)' - generic expansion clause (not individually itemized; verification 3.2) |
| Parts Technician | Process a WO part return (create) | (none of mapped) | Medium | Migration-Type: Parts Technician = 'Direct (with expansions)' - generic expansion clause (not individually itemized; verification 3.2) |
| Parts Technician | View History Logs (cross-toggle) | (none of mapped) | Medium | Spec l.482: Parts Tech 'Gains History Logs' |
| Parts Technician | WO History / Audit Log (view) | (none of mapped) | Medium | Spec l.482: Parts Tech 'Gains History Logs' |
| Senior Service Advisor | Customer Portal Page Access | (none of mapped) | Medium | Spec l.477: Senior SA 'Gains Customer Portal' |
| Senior Service Advisor | Reports Page Access | (none of mapped) | Medium | Spec l.477: Senior SA 'Gains Reports' |
| Service Advisor | Customer Portal Page Access | (none of mapped) | Medium | Spec l.485: SA Limited View 'Gains Customer Portal' |
| Service Manager | Customer Portal Page Access | (none of mapped) | Medium | Spec l.478: SM 'Gains Customer Portal' |
| Parts Manager | Schedule View | (none of mapped) | Low | Spec l.481: Parts Manager 'Gains Schedule View' |
| Parts Technician | Customers View | (none of mapped) | Low | Migration-Type: Parts Technician = 'Direct (with expansions)' - generic expansion clause (not individually itemized; verification 3.2) |
| Parts Technician | Schedule View | (none of mapped) | Low | Migration-Type: Parts Technician = 'Direct (with expansions)' - generic expansion clause (not individually itemized; verification 3.2) |
| Service Manager | Billing Portal Page Access | (none of mapped) | Low | Spec l.478: SM 'Gains Billing Portal' |

## Out-of-model (staff-record-controlled — NOT permission deltas; excluded from risk counts)
Per spec "Staff Record Settings", clock-in and timesheet appearance are staff-record controlled,
not the role/permission model. These are informational, not release risks:

| Staging role | Capability | Direction | Prod / Staging | Severity |
|---|---|---|---|---|
| Admin | Clock in / log time on a WO line task | STAGING-MORE | No/Yes | Low |
| Foreman | Timesheets View | STAGING-MORE | No/Yes | Low |
| Office User | Timesheets Create & Edit | STAGING-MORE | No/Yes | Medium |
| Parts Manager | Clock in / log time on a WO line task | STAGING-MORE | No/Yes | Low |
| Parts Technician | Timesheets View | STAGING-MORE | No/Yes | Low |
| Senior Service Advisor | Timesheets Create & Edit | STAGING-MORE | No/Yes | Medium |
| Senior Service Advisor | Timesheets View | STAGING-MORE | No/Yes | Low |
| Service Advisor | Timesheets View | STAGING-MORE | No/Yes | Low |
| Service Manager | Clock in / log time on a WO line task | STAGING-MORE | No/Yes | Low |
| Time Clock User | Timesheets View | STAGING-MORE | No/Yes | Low |

## Per-role 2×2 summary (whole app, out-of-model excluded)
| Staging role | Slug | Merged? | Migration Type | STG-LESS Yes | **STG-LESS No** | STG-MORE Yes | **STG-MORE No** | Out-of-model (excl.) | Mapping |
|---|---|---|---|---|---|---|---|---|---|
| Admin | administrator | no | Direct - Administrator (Owner merge N/A: no Owner in either env) | 0 | 0 | 0 | 1 | 1 | confirmed |
| Service Manager | service_manager | no | Direct (with adjustments) | 2 | 0 | 2 | 12 | 1 | confirmed |
| Senior Service Advisor | senior_service_advisor | YES | Renamed + expanded (merge: Service Advisor + SA Technician + SA No Reports; gains Reports) | 0 | 7 | 2 | 0 | 2 | confirmed |
| Service Advisor | service_advisor | no | Mapped from SA Limited View (AP/AR OFF preserves core restriction) | 1 | 11 | 1 | 0 | 1 | confirmed |
| Foreman | foreman | no | Direct (with expansions) | 0 | 2 | 9 | 0 | 1 | confirmed |
| Technician | technician | no | Direct mapping | 1 | 8 | 0 | 1 | 0 | confirmed |
| Parts Manager | parts_manager | no | Direct (with adjustments) | 0 | 3 | 2 | 20 | 1 | confirmed |
| Parts Technician | parts_technician | no | Direct (with expansions) | 0 | 7 | 8 | 0 | 1 | confirmed |
| Office User | office | no | Direct (with adjustments) | 1 | 11 | 0 | 0 | 1 | confirmed |
| Sales Representative | sales_representative | YES | Direct (merge: Sales Representative + Reporting) | 0 | 1 | 0 | 3 | 0 | confirmed |
| Time Clock User | time_clock_user | no | Direct mapping | 0 | 1 | 0 | 0 | 1 | confirmed |

## Completeness (independent verification)
**No release-critical omissions.** All 43 staging atoms + 3 cross-toggles + view_mode are
represented; all 14 prod roles (no Owner) + 11 staging roles + 4 merges present; independent
recompute matched the workbook 23/23 on critical rows (5 prod roles re-captured LIVE). Only **5
LOW-severity** prod resources have no explicit row — `workplace`, `department`, `vehicle_type`,
`vehicle_history`, `shop_billing_efficiency` — all settings / reference / report-view only
(subsumed under Settings / Reports / vehicle view). Note: `workplace*` is held by SA-Limited-View,
so staging Service Advisor carries a low-severity uncaptured "workplace management" reduction.

## Open questions / NEEDS-REVIEW
1. **Mapping CONFIRMED (QA lead 2026-07-14)** — spec migration table authoritative; SA / Senior-SA
   rows FINAL; section-3549 1:1 same-name cases C26514/C26515 superseded.
2. **Administrator compared 1:1 (Owner not applicable)** — no Owner role in either environment.
3. **FE-gated / no-clean-map rows** (Send to Portal, Send to Terminal, portal page access, See
   AP/AR, part-return verbs) are Verification confidence = MEDIUM / NEEDS-UI-VERIFY — drive per
   role with a fresh staging cookie before go/no-go.
4. **Reporting** legacy role returns 0 resource permissions (report-page-only); merges into
   Sales Representative.

*Full detail incl. every match/staging-more row, Migration Type, Verification confidence, and the
side-by-side capability matrix is in the workbook.*
