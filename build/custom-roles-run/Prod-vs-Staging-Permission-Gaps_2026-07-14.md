# Custom Roles (SV-7388) — PRODUCTION vs STAGING Permission Gaps (LIVE)

**Date:** 2026-07-15 · **Epic:** SV-7388 Custom Roles & Permissions · **PO:** Sasha Grosman
**Status:** ✅ BOTH SIDES LIVE-VERIFIED. Replaces the earlier spec-predicted interim.
**Workbook:** `Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx` (11-col bi-directional main tab +
dedicated **Work Orders — granular** tab + per-role 2×2 summaries + full matrix + open questions).

## Data provenance (live)
- **Staging (new custom-roles model):** 11 system roles, `GET /api/organizations/{org}/roles`
  + per-role `GET /api/roles/{id}`, org `d55bc308-…`.
- **Production (old legacy model):** authenticated live on `api.shopview.com` with a fresh
  PHPSESSID (NO SSO). **Prod org UUID `72b2cc90-6964-4429-a207-76e55f946936`.**
  **14 legacy roles** from `GET /api/iam/list-roles` — **NO "Owner" role exists in this org**
  (spec assumed 15). Per-role effective permissions captured by **impersonation**
  (`POST /api/switch-user` → `data.permissions` → `POST /api/exit-switch-user`); roles without
  an existing active user were captured by temporarily assigning a throwaway ZZ invite-test user
  that role, then restoring to Technician (departments/workplace verified intact). No prod data
  left modified.
- **Models:** old = `{resource_name, action_name}` pairs (action `*` = ALL incl. delete);
  new = 41 fe_permission atoms + view_mode + 3 cross-toggles. Capabilities translated old↔new;
  `Confidence=live` = clean resource/action map, `NEEDS-REVIEW` = no clean equivalent / FE-gated.

## Headline totals
| Direction | Intended (Yes, spec-cited) | **NOT in spec (No) = RELEASE RISK** |
|---|---|---|
| **STAGING-LESS** (prod grants, staging doesn't) | 4 | **52** |
| **STAGING-MORE** (staging grants, prod didn't) | 18 | **53** |

> The **No** rows in BOTH directions are the release-eve items needing a keep/change decision.
> Service-Advisor & Senior-Service-Advisor rows are flagged **NEEDS-REVIEW (mapping unconfirmed)**
> (naming trap: legacy "Service Advisor" → staging "Senior SA"; staging "Service Advisor" ← legacy
> "SA Limited View"; the section-3549 migration cases contradict the spec table).

## STAGING-LESS · NOT-in-spec (No) — prod can do MORE than staging (regressions / over-in-prod)
| Staging role | Capability | Prod role(s) mapped | Severity | Confidence |
|---|---|---|---|---|
| Foreman | Send to Portal | Foreman | High | NEEDS-REVIEW |
| Office User | Send to Portal | Office User | High | NEEDS-REVIEW |
| Parts Manager | Remove a WO part | Parts Manager | High | NEEDS-REVIEW |
| Parts Technician | Remove a WO part | Parts Technician | High | NEEDS-REVIEW |
| Parts Technician | Approve / complete a WO part return | Parts Technician | High | NEEDS-REVIEW |
| Parts Technician | Send to Portal | Parts Technician | High | NEEDS-REVIEW |
| Parts Technician | Send to Terminal (take payment on WO) | Parts Technician | High | NEEDS-REVIEW |
| Parts Technician | Invoicing & Payments Delete (reverse/delete invoice) | Parts Technician | High | live |
| Parts Technician | See AP/AR Data | Parts Technician | High | NEEDS-REVIEW |
| Sales Representative | Send to Portal | Sales Representative + Reporting | High | NEEDS-REVIEW |
| Service Advisor | Work Orders Delete | Service Advisor - Limited View | High | live + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | See AP/AR Data | Service Advisor - Limited View | High | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Technician | Work Order Lines Delete | Technician | High | live |
| Technician | Order Parts (on WO) | Technician | High | live |
| Technician | Remove a WO part | Technician | High | NEEDS-REVIEW |
| Time Clock User | Send to Portal | Time Clock User | High | NEEDS-REVIEW |
| Foreman | Part Sales Create & Edit | Foreman | Medium | NEEDS-REVIEW |
| Office User | Pick Parts | Office User | Medium | live |
| Office User | Manage picked WO parts (view/change) | Office User | Medium | NEEDS-REVIEW |
| Office User | Assign vendor to a WO part order | Office User | Medium | NEEDS-REVIEW |
| Office User | Create / edit asset (vehicle) from New WO screen | Office User | Medium | NEEDS-REVIEW |
| Office User | Catalog & Inventory Delete | Office User | Medium | live |
| Office User | Vendor & Order Mgmt Create & Edit | Office User | Medium | live |
| Office User | Vendor & Order Mgmt Delete | Office User | Medium | live |
| Office User | Receive / accept a delivery (Bulk Receive) | Office User | Medium | live |
| Office User | Settings: Parts | Office User | Medium | NEEDS-REVIEW |
| Parts Manager | Settings: Wages | Parts Manager | Medium | NEEDS-REVIEW |
| Parts Manager | Manage Staff | Parts Manager | Medium | NEEDS-REVIEW |
| Parts Technician | Decline a WO part return | Parts Technician | Medium | NEEDS-REVIEW |
| Senior Service Advisor | Customers Delete | Service Advisor + Service Advisor Technician + Service Advisor - No Reports | Medium | live + NEEDS-REVIEW (mapping unconfirmed) |
| Senior Service Advisor | Catalog & Inventory Delete | Service Advisor + Service Advisor Technician + Service Advisor - No Reports | Medium | live + NEEDS-REVIEW (mapping unconfirmed) |
| Senior Service Advisor | Settings: App | Service Advisor + Service Advisor Technician + Service Advisor - No Reports | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Senior Service Advisor | Settings: Service | Service Advisor + Service Advisor Technician + Service Advisor - No Reports | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Senior Service Advisor | Settings: Integrations | Service Advisor + Service Advisor Technician + Service Advisor - No Reports | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Senior Service Advisor | Settings: Finance | Service Advisor + Service Advisor Technician + Service Advisor - No Reports | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Customers Delete | Service Advisor - Limited View | Medium | live + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Catalog & Inventory Delete | Service Advisor - Limited View | Medium | live + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Vendor & Order Mgmt Delete | Service Advisor - Limited View | Medium | live + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Part Sales Delete | Service Advisor - Limited View | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Settings: App | Service Advisor - Limited View | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Settings: Service | Service Advisor - Limited View | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Settings: Integrations | Service Advisor - Limited View | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Settings: Finance | Service Advisor - Limited View | Medium | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Technician | Assign vendor to a WO part order | Technician | Medium | NEEDS-REVIEW |
| Technician | Create / edit asset (vehicle) from New WO screen | Technician | Medium | NEEDS-REVIEW |
| Technician | Part Sales Create & Edit | Technician | Medium | NEEDS-REVIEW |
| Office User | Canned lines on WO (add/edit) | Office User | Low | NEEDS-REVIEW |
| Senior Service Advisor | Billing Portal Page Access | Service Advisor + Service Advisor Technician + Service Advisor - No Reports | Low | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | WO notes - delete | Service Advisor - Limited View | Low | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Billing Portal Page Access | Service Advisor - Limited View | Low | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Technician | Vendor & Order Mgmt View | Technician | Low | live |
| Technician | Part Sales View | Technician | Low | NEEDS-REVIEW |

## STAGING-MORE · NOT-in-spec (No) — staging grants MORE than prod (unaccounted expansions)
| Staging role | Capability | Prod role(s) mapped | Severity | Confidence |
|---|---|---|---|---|
| Parts Manager | Work Orders Create & Edit | Parts Manager | High | live |
| Parts Manager | Work Order Lines Create & Edit | Parts Manager | High | live |
| Sales Representative | See Financial Data on WO (rates/margins/totals) | Sales Representative + Reporting | High | NEEDS-REVIEW |
| Sales Representative | See AP/AR Data | Sales Representative + Reporting | High | NEEDS-REVIEW |
| Service Manager | Approve / complete a WO part return | Service Manager | High | NEEDS-REVIEW |
| Admin | Customer Portal Page Access | Administrator | Medium | NEEDS-REVIEW |
| Foreman | Decline a WO part return | Foreman | Medium | NEEDS-REVIEW |
| Office User | Timesheets Create & Edit | Office User | Medium | NEEDS-REVIEW |
| Parts Manager | Process a WO part return (create) | Parts Manager | Medium | NEEDS-REVIEW |
| Parts Manager | WO History / Audit Log (view) | Parts Manager | Medium | live |
| Parts Manager | Mark Reviewed / review sign-off | Parts Manager | Medium | NEEDS-REVIEW |
| Parts Manager | Complete a Work Order | Parts Manager | Medium | live |
| Parts Manager | Approve / decline a WO line | Parts Manager | Medium | live |
| Parts Manager | Create / edit customer from New WO screen | Parts Manager | Medium | live |
| Parts Manager | Create / edit asset (vehicle) from New WO screen | Parts Manager | Medium | NEEDS-REVIEW |
| Parts Manager | Customers Create & Edit | Parts Manager | Medium | live |
| Parts Manager | Customers Delete | Parts Manager | Medium | live |
| Parts Manager | Part Sales Create & Edit | Parts Manager | Medium | NEEDS-REVIEW |
| Parts Manager | Part Sales Delete | Parts Manager | Medium | NEEDS-REVIEW |
| Parts Manager | Settings: Finance | Parts Manager | Medium | NEEDS-REVIEW |
| Parts Manager | Settings: Data Import | Parts Manager | Medium | live |
| Parts Manager | View History Logs (cross-toggle) | Parts Manager | Medium | live |
| Parts Technician | Process a WO part return (create) | Parts Technician | Medium | NEEDS-REVIEW |
| Parts Technician | Create / edit customer from New WO screen | Parts Technician | Medium | live |
| Parts Technician | Customers Create & Edit | Parts Technician | Medium | live |
| Parts Technician | Part Sales Create & Edit | Parts Technician | Medium | NEEDS-REVIEW |
| Service Manager | Decline a WO part return | Service Manager | Medium | NEEDS-REVIEW |
| Service Manager | WO History / Audit Log (view) | Service Manager | Medium | live |
| Service Manager | Customers Delete | Service Manager | Medium | live |
| Service Manager | Catalog & Inventory Create & Edit | Service Manager | Medium | live |
| Service Manager | Catalog & Inventory Delete | Service Manager | Medium | live |
| Service Manager | Part Sales Delete | Service Manager | Medium | NEEDS-REVIEW |
| Service Manager | Settings: App | Service Manager | Medium | NEEDS-REVIEW |
| Service Manager | Settings: Wages | Service Manager | Medium | NEEDS-REVIEW |
| Service Manager | View History Logs (cross-toggle) | Service Manager | Medium | live |
| Service Manager | Manage Staff | Service Manager | Medium | NEEDS-REVIEW |
| Technician | Decline a WO part return | Technician | Medium | NEEDS-REVIEW |
| Admin | Clock in / log time on a WO line task | Administrator | Low | NEEDS-REVIEW |
| Foreman | Timesheets View | Foreman | Low | NEEDS-REVIEW |
| Parts Manager | Canned lines on WO (add/edit) | Parts Manager | Low | NEEDS-REVIEW |
| Parts Manager | Clock in / log time on a WO line task | Parts Manager | Low | NEEDS-REVIEW |
| Parts Manager | Edit / move WO line tasks | Parts Manager | Low | NEEDS-REVIEW |
| Parts Manager | Set line status (bulk) | Parts Manager | Low | live |
| Parts Manager | Customers View | Parts Manager | Low | live |
| Parts Technician | Schedule View | Parts Technician | Low | live |
| Parts Technician | Customers View | Parts Technician | Low | live |
| Parts Technician | Timesheets View | Parts Technician | Low | NEEDS-REVIEW |
| Sales Representative | Part Sales View | Sales Representative + Reporting | Low | NEEDS-REVIEW |
| Senior Service Advisor | Timesheets View | Service Advisor + Service Advisor Technician + Service Advisor - No Reports | Low | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Advisor | Timesheets View | Service Advisor - Limited View | Low | NEEDS-REVIEW + NEEDS-REVIEW (mapping unconfirmed) |
| Service Manager | Canned lines on WO (add/edit) | Service Manager | Low | NEEDS-REVIEW |
| Service Manager | Clock in / log time on a WO line task | Service Manager | Low | NEEDS-REVIEW |
| Time Clock User | Timesheets View | Time Clock User | Low | NEEDS-REVIEW |

## STAGING-LESS · intended (Yes, spec-documented reductions)
| Staging role | Capability | Prod role(s) mapped | Severity | Confidence |
|---|---|---|---|---|
| Service Manager | Invoicing & Payments Delete (reverse/delete invoice) | Service Manager | High | live |
| Technician | Send to Portal | Technician | High | NEEDS-REVIEW |
| Office User | Catalog & Inventory Create & Edit | Office User | Medium | live |
| Service Manager | Settings: Finance | Service Manager | Medium | NEEDS-REVIEW |

## Work Orders — granular tab (release-critical) headlines
- **WO STAGING-LESS No:** 22 · **WO STAGING-MORE No:** 24
- Highest-signal WO STAGING-LESS (prod-more) rows:
  - **Foreman** — Send to Portal (prod: Foreman; NEEDS-REVIEW)
  - **Office User** — Send to Portal (prod: Office User; NEEDS-REVIEW)
  - **Parts Manager** — Remove a WO part (prod: Parts Manager; NEEDS-REVIEW)
  - **Parts Technician** — Remove a WO part (prod: Parts Technician; NEEDS-REVIEW)
  - **Parts Technician** — Approve / complete a WO part return (prod: Parts Technician; NEEDS-REVIEW)
  - **Parts Technician** — Send to Portal (prod: Parts Technician; NEEDS-REVIEW)
  - **Parts Technician** — Send to Terminal (take payment on WO) (prod: Parts Technician; NEEDS-REVIEW)
  - **Sales Representative** — Send to Portal (prod: Sales Representative + Reporting; NEEDS-REVIEW)
  - **Service Advisor** — Work Orders Delete (prod: Service Advisor - Limited View; live + NEEDS-REVIEW (mapping unconfirmed))
  - **Technician** — Work Order Lines Delete (prod: Technician; live)
  - **Technician** — Order Parts (on WO) (prod: Technician; live)
  - **Technician** — Remove a WO part (prod: Technician; NEEDS-REVIEW)
  - **Time Clock User** — Send to Portal (prod: Time Clock User; NEEDS-REVIEW)

## Per-role 2×2 summary (whole app)
| Staging role | Merged? | STG-LESS Yes | **STG-LESS No** | STG-MORE Yes | **STG-MORE No** | Mapping |
|---|---|---|---|---|---|---|
| Admin | no | 0 | 0 | 0 | 2 | confirmed |
| Service Manager | no | 2 | 0 | 2 | 13 | confirmed |
| Senior Service Advisor | YES | 0 | 7 | 3 | 1 | NEEDS-REVIEW |
| Service Advisor | no | 0 | 12 | 1 | 1 | NEEDS-REVIEW |
| Foreman | no | 0 | 2 | 8 | 2 | confirmed |
| Technician | no | 1 | 8 | 0 | 1 | confirmed |
| Parts Manager | no | 0 | 3 | 2 | 21 | confirmed |
| Parts Technician | no | 0 | 7 | 2 | 7 | confirmed |
| Office User | no | 1 | 11 | 0 | 1 | confirmed |
| Sales Representative | YES | 0 | 1 | 0 | 3 | confirmed |
| Time Clock User | no | 0 | 1 | 0 | 1 | confirmed |

## Open questions / NEEDS-REVIEW
1. **Service Advisor / Senior SA mapping UNCONFIRMED** — confirm spec migration table vs the
   section-3549 1:1 same-name migration cases before treating those rows as final.
2. **"Owner" legacy role ABSENT** in the compared prod org (14 roles, not 15). Admin diffed
   against Administrator only. Re-run in any org that still has Owner.
3. **FE-gated / no-clean-map rows** (Send to Portal, Send to Terminal, Portal page access,
   See Financial Data, See AP/AR, Settings Service/Parts/Integrations/Wages, Part Sales,
   part-return verbs, line tasks) are `Confidence=NEEDS-REVIEW` — verify in UI per role.
4. **Reporting** legacy role returns 0 resource permissions (report-page-only); merges into
   Sales Representative.

*Full detail incl. every match/staging-more row and the side-by-side capability matrix is in
the workbook.*
