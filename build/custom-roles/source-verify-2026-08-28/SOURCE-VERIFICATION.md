# Custom Roles & Permissions — Source Verification, 2026-08-28

Run date **2026-08-28**. API-only (TestRail API + Atlassian REST via `build/atlassian-login/jira.sh`).
No TestRail writes. No Jira writes. No UI, no Playwright.

Previous recorded source check for this project: **2026-07-27** (CLAUDE.md §3, badge 🔴).

---

## 1 · Confluence — Custom Roles and Permissions PRD

| Source | Page ID | Live version | Last modified | Checked | Rule-91 badge |
|---|---|---|---|---|---|
| **Custom Roles and Permissions** (the PRD / spec) | **565116952** | **v54** | **2026-07-16T23:08:22Z** | 2026-08-28 | ✅ (checked today) |
| ARCHIVE - Custom Roles and Permissions — Spec Rewrite | 573636610 | v2 | 2026-06-03T05:22:24Z | 2026-08-28 | ✅ |
| Legacy Role → New Settings Mapping Analysis | 565116931 | v7 | 2026-05-12T05:57:09Z | 2026-08-28 | ✅ |
| ShopView Legacy Hard Coded User Role Definitions | 563838977 | v4 | 2026-05-29T23:37:38Z | 2026-08-28 | ✅ |
| Script - Customer Facing Video | 707035137 | v1 | 2026-07-13T21:21:27Z | 2026-08-28 | ✅ |
| C R & P — Legacy→New Migration: Gains & Losses | 709001218 | v1 | 2026-07-14T16:01:26Z | 2026-08-28 | ✅ |
| C R & P — Customer Migration Email (DRAFT) | 709951490 | v5 | 2026-07-15T05:02:26Z | 2026-08-28 | ✅ |

**CHANGE SINCE 2026-07-27: NONE.** Every page in the Custom Roles tree was last modified on or
before **2026-07-16**, i.e. before our last check. The PRD has not moved. This is the one project in
the estate whose spec has *not* drifted (contrast CLAUDE.md §3, where every other project's page had
moved).

> **A green badge means the CHECK is fresh, not that the source is current.** Here the two coincide:
> the check is fresh (today) *and* the source is genuinely unchanged since our last ingest.

Raw evidence: `raw/p565116952.json`, `raw/c*.json`, `raw/prd-storage.xml` (146,887 bytes of storage
format, fetched to file — never read whole into a session context, per Rule 88).

## 2 · Jira epic SV-7388 (Custom Roles and Permissions)

- Fetched with `parent = SV-7388`, **fully paged** (3 pages, 100 + 100 + 69).
- **269 children** — exactly the figure recorded on 2026-08-21. No drift.
- Status split: **Done 199 · OBSOLETE 55 · Ready to Fix 8 · Blocked 4 · Open 2 · Board Backlog 1**.
- **Children CREATED since 2026-07-27: 0.**
- **Children RESOLVED since 2026-07-27: 1** — **SV-8078** (Done 2026-08-03), *"Vendor & Order
  Management: View + Create & Edit role can see Total Cost in Purchase…"*. Vendor area, unrelated to
  Work Order delete.
- **Children UPDATED since 2026-07-27: 1** — the same SV-8078.

Badge: ✅ **2026-08-28**, 269 children. Raw: `raw/epic-children.jsonl`.

## 3 · SV-7480 — read in full

**https://shopview.atlassian.net/browse/SV-7480** — *"[CRP-BE-05] Rewrite role→bundle defaults to
the 12-role PRD matrix"*
Type **Task** · Status **Done** · Resolution **Done** · Parent **SV-7388** ·
Created 2026-06-01 · **Updated 2026-07-27** · Fix version **v0.68 (released 2026-07-27)** ·
Labels `crp-be`, `custom-roles-permissions` · **0 comments**.

Verbatim, the parts that bear on Work Order delete:

> **Summary**
> Rewrite `RoleFePermissionMappings.php` so each of the 12 system roles gets exactly the bundles in
> the PRD permission matrix.

> **Scope**
> Encode the matrix (tech plan §3c) for: owner, admin, sm, ssa (renamed ServiceAdvisor), jsa (new),
> foreman, tech, pm, pt, office, salesrep (new), timeclock — across CRUD areas, WO sub-settings, page
> toggles, settings + 6 subs, viewMode, and the 3 cross-cutting toggles. Note role-specific
> exceptions (SM Invoicing no-Delete; **SSA no Customer/Catalog Delete**; jsa/foreman/pt/tech AP/AR
> OFF; tech viewMode=tech + Fin/AP-AR/Hist OFF; salesrep all-areas-off + Reports/Fin/AP-AR ON, Hist
> OFF).

> **Acceptance criteria**
> * [ ] `RoleFePermissionMappings::getMappings()` matches the matrix for all 12 roles
> * [ ] Golden-master test: each role's resolved bundle set == matrix
> * [ ] Office + Time Clock added to `getUneditableRoles()`

> **Reference**
> Tech plan §3c. PRD matrix (565116952 / 573636610 S22).

**Reading:** SV-7480 **does not itself state anything about Work Order DELETE for Service Advisor or
Foreman.** Its role-specific exception list names Customer/Catalog delete (for Senior SA) and AP/AR
(for jsa/foreman/pt/tech) — not Work Orders delete. What SV-7480 does is **point at the PRD matrix as
the authority** ("matches the matrix for all 12 roles", "PRD matrix (565116952 …)"). So the answer to
"should Service Advisor and Foreman have Work Order delete?" is **delegated by SV-7480 to Confluence
565116952**, which is unambiguous — see §4.

## 4 · The PRD permission matrix — the operative source

Confluence **565116952 v54 (2026-07-16)**, section *System Role Templates → Permission Matrix*.
Legend given verbatim on the page:

> **Permission Matrix** — CRUD Areas (**V = View, E = Create and Edit, D = Delete, — = OFF**)

| Area | Admin | Svc Mgr | Sr. SA | **Svc Advisor** | **Foreman** | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Work Orders** | V/E/D | V/E/D | V/E/D | **V/E** | **V/E** | V | V/E | V | V | V | V |
| WO Lines | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | — | V | — |

Full table: `PERMISSION-MATRIX-v54.md` (31 rows, extracted by script from the storage format).

**Role-name mapping** (PRD *Migration Plan → Legacy Role to New System Role Mapping*, same page):

| Legacy Role | New System Role | Migration Type |
|---|---|---|
| Service Advisor | `system-ssa` — **Senior SA** | Renamed + expanded |
| SA Limited View | `system-jsa` — **Service Advisor** | Mapped to new role — AP/AR OFF preserves restriction |
| Foreman | `system-foreman` — Foreman | Direct (with expansions) |

So the staging user **`qa_junior_service_advisor`** is the **`jsa`** role, which the PRD matrix calls
**"Svc Advisor"** — the column reading **V/E**. (The role our cases call "Senior Service Advisor" is
the separate `ssa` column, V/E/D.)

**Corroborating PRD text** (*Migration Plan → Behavior Changes for Migrating Users*):

> **Foreman** | Gains **WOL Delete**, Schedule Delete, Parts Dept (Part Sales V, Catalog V/CE, Vendor
> V/CE), Invoicing V/CE, Order Parts, History Logs. Loses Timesheets Edit. | Expansion

Note this grants Foreman **WOL** (Work Order *Line*) delete — never Work Order delete. Consistent
with the matrix.

## 5 · Related Jira — the reconciliation command, as a DOCUMENT

**SV-7485** — *"[CRP-BE-10] Legacy→v2 role migration rework (SSA/JSA split, no SalesRep escalation,
dry-run diff)"* · Status **Done** · Updated 2026-07-14. Verbatim:

> **Summary**
> Rewrite `AssignV2RolesToExistingUsers` to migrate all existing users 15→12 correctly.

> **Scope (corrected 15→12 map)** … Idempotent (`WHERE role_v2_id IS NULL`); **org-scoped**; never
> reassign users already on a custom role; `--dry-run` prints per-user `email | old→new | atom-count
> before→after`.

This is a written source confirming that the reconciliation is **org-scoped** and must be run per
organization — which is exactly the mechanism by which one org (E2E staging) can be left un-migrated
while the code is correct. It is corroboration for the environment-gap reading in
`SAFE-OR-NOT-REPORT.md`, not a source of permission expectation.

## 6 · Local PO / decision documents reviewed

- `build/custom-roles-spec-update/current-spec-2026-07-15.md` — our export of pageId 565116952 taken
  2026-07-15 (i.e. one version before v54). Superseded by this run's fetch.
- `build/custom-roles-spec-update/spec-diff-2026-07-15.md`, `amend-scope.md` — the 2026-07 amendment
  pass (46 flagged → 21 in scope). Closed; no WO-delete rows.
- `build/custom-roles-run/release-regression-2026-07-27/` — the last release regression state.
- `build/custom-roles-run/sv7388-done-tickets/SV-7480.md` — our stored copy of SV-7480. **Verified
  byte-for-byte consistent with the live ticket today** (same summary, scope, acceptance criteria).
- **No PO answer file exists for this project.** CLAUDE.md §3 records **PO UNKNOWN — must be asked**
  (the spec *owner* is Sasha Grosman, which is not the same thing as the PO). This remains open.

> **✅ CORRECTED LATER THE SAME DAY (2026-08-28) — the line above is out of date, kept visible per
> Rules 32/33.** The PO **is** recorded now: **Sasha Grosman — surname unconfirmed; TestRail user 9
> spells it *Grossman***. Recorded in `build/custom-roles/PROJECT-STATE.md` §2, the CLAUDE.md §3
> project-index row and `build/OUTSTANDING-ITEMS-REGISTER.md` row **PO-1**. **What is still owed is
> only the SPELLING of the surname — confirm it before his name goes on anything he reads.** A PO
> answer file still does not exist.

## 7 · Rule-91 badge summary

| Source | Badge | Version / marker | Date |
|---|---|---|---|
| Confluence PRD 565116952 | ✅ | **v54** | checked 2026-08-28; page unchanged since 2026-07-16 |
| Confluence child pages (6) | ✅ | v1–v7 | checked 2026-08-28; all unchanged since 2026-07-15 |
| Jira epic SV-7388 | ✅ | **269 children** | checked 2026-08-28 |
| Jira SV-7480 | ✅ | Done, v0.68 | checked 2026-08-28 |
| Jira SV-7485 | ✅ | Done | checked 2026-08-28 |
| ShopView build | ❌ / 🔴 | last build-verified **2026-07-27** | **not re-verified this run** — API-only task, no live build check was in scope |

---

## OUTSTANDING — what I need from you

1. **Who is the PO for Custom Roles?** Still unrecorded (CLAUDE.md §3 says "PO UNKNOWN — must be
   asked"). Needed before any PO question sheet can be addressed.
2. **Do you want a build re-verification?** The last one was **2026-07-27** — 32 days ago, 🔴. This
   run was source-only by instruction.
