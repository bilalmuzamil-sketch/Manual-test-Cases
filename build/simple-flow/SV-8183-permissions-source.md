# SV-8183 — Permission: Simple Flow — enforcement mapping to existing WO / Parts / Settings atoms

> **Verbatim readable extract** of the Jira export
> `6592ea00-SV8183.doc` (a Jira "Save as .doc" = single-part HTML, NOT MHTML).
> Parsed with Python `html.parser` (stdlib); tables preserved.
> Extracted 2026-07-07. This is the SOURCE OF TRUTH copy — do not edit.

---

## Header / metadata

- **Key:** SV-8183
- **Summary:** Permission: Simple Flow — enforcement mapping to existing WO / Parts / Settings atoms
- **Parent:** SV-7301 — Express Mode — Streamlined Work Order Completion & Bulk Receiving (In Progress)
- **Type:** Story · **Priority:** Medium
- **Status:** Open · **Resolution:** Unresolved
- **Reporter:** Milos Vasic · **Assignee:** Unassigned
- **Created:** 07/Jul/26 · **Updated:** 07/Jul/26
- **Project:** ShopView · Components: None · Affects/Fix versions: None · Labels: None
- Generated Tue Jul 07 17:15:37 UTC 2026 by Bilal Muzamil (Jira 1001.0.0-SNAPSHOT).

---

## Description

### Context

Simple Flow (epic **SV-7301**, In Progress) was specced against today's behavior
and uses loose role wording ("owner/admin only", "office/readonly users",
"accountant", "manager/foreman"). Simple Flow does not need its own permission
atom — every action is expressible through existing atoms in the Custom Roles
model (**SV-7388**, In Progress), all of which are already merged to develop.
This story documents that derivation, makes BE + FE enforcement consistent,
resolves the permission open-questions in Simple Flow spec §8, and reconciles the
drift found between the spec and the code. Mirrors **SV-8095** (TESTING QA — the
same treatment for Digital Inspections).

### Core rule (global)

**Simple Flow reuses existing atoms — nothing new.**

#### Table — Simple-Flow action → Story → Gated by (existing atom)

| Simple-Flow action | Story | Gated by (existing atom) |
|---|---|---|
| See/edit the WO Settings page (auto-approve, create POs, vendor invoice, require review) | 1 | **Settings › App Settings (`settingsApp`)** — the settings route already carries this guard; the new toggles inherit it. **No new gating.** |
| Run completion — change WO status (Active→Complete; Send to Review; Reviewed→Complete) | 2/3/4/16 | **Work Orders: Create & Edit** |
| Approve all lines (hard gate to complete) | all | **WO Lines: Create & Edit + Full View** (Tech View hides Approve) — collapses to `ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT` at BE |
| Enter mileage / VIN / engine hours in the completion modal | 2/3/4 | **WO Lines: Create & Edit** |
| Tech story per line | 17 | **WO Lines: Create & Edit** |
| Resolve inventory / special-order cores (Ok / Not OK) | 3/4/16 | **WO Lines: Create & Edit** (already spec'd in Custom Roles, Jul-3 change log) |
| Add a vendorless / no-part-number part (manual sell) | 5 | **WO Lines: Create & Edit + See Financial Data (`seeFinancialData`)** — sell is mandatory and has no catalog source, so financial visibility is required to enter it |
| Pick inventory parts in the completion modal (auto-pick off) | 2/3/4 | **Pick Parts (`woPickParts`)** |
| Background order + create POs on completion (incl. vendor-missing PO) | 3/4/6 | **Order Parts (`woOrderParts`) → requires See Financial Data** |
| Receive on the WO — line-level Receive button, completion "Receive parts" → Accept Delivery | 3/4/11/12 | **FE: Order Parts (`woOrderParts`).** **BE (`ReceiveRequestedParts`): OR of `ROLE_DELIVERY_CREATE_AND_EDIT`, `ROLE_WORK_ORDER_PART_CREATE`, `ROLE_WORK_ORDER_CREATE_AND_EDIT`** |
| Bulk Receive page (accountant, PO-list driven) | 7/8/9 | **Vendor & Order Mgmt: Create & Edit** (Parts-dept route gate `hasPartsPermissions`) **+ See Financial Data** for cost/sell edit |
| Assign vendor to a vendor-missing PO / merge / keep-separate | 6/13 | **Vendor & Order Mgmt: Create & Edit** |
| Inline part-number fix → first-class inventory/catalog part | 10 | **Catalog & Inventory: Create & Edit** |
| Cost/sell fields on receive screens (field locking) | 8/10 | visibility+edit → **See Financial Data**; sell auto-locks once WO invoiced/paid (**state gate, not a permission**) |
| Mark Reviewed / sign-off; VIN captured by reviewer | 16 | **Review Work Orders (`woReviewWorkOrders`) + reviewer ≠ completer (NET-NEW hard rule, see below)**; VIN entry → **WO Lines: Create & Edit** |
| Waiting-on-Parts column (visibility) | 14 | **Work Orders: View**; the click-through to Accept Delivery is suppressed if the user lacks the receive gate |
| Go to Invoice / Create Invoice at the end | 2/3/4 | **Invoicing & Payments: Create & Edit + See Financial Data** (existing; Simple Flow only routes to it) |

### Key consequences

Completion follows WO edit + line approval (Full View); receiving-on-a-WO follows
Order Parts; the accountant Bulk Receive page follows Vendor & Order Mgmt.

**BE atom collapse:** `woOrderParts`, `workOrderLinesCreateAndEdit`,
`woFullViewMode`, `woTechViewMode`, and `workOrdersCreateAndEdit` all resolve to
the same BE atom pair (`ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT`) and are
indistinguishable server-side. So **"any role with WO Create & Edit can receive
onto a WO"** — a deliberate, spec-sanctioned low-privilege trade-off (**SV-7864**,
TESTING STAGE). **FE distinctions are conveniences, not BE-enforceable
boundaries.**

### Resulting per-role behavior (derived from the system-role matrix)

| Role | Edit WO settings | Complete WO | Pick | Order/PO | Receive on WO | Bulk Receive | Assign vendor | Fix part # | Add vendorless part | Mark Reviewed |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Manager | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Senior SA | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Advisor | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Foreman | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Technician | No | No (1) | Yes | No | No | No | No | No | No (2) | No |
| Parts Manager | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Parts Tech | No | No (1) | Yes | Yes | Yes | Yes | Yes | Yes | No | No |
| Office | Yes | No (3) | No | No | No | No (4) | No | No | No | No |
| Sales Rep | No | No | No | No | No | No | No | No | No | No |
| Time Clock | No | No | No | No | No | No | No | No | No | No |

**Notes on the matrix:**
1. **No completion** = Tech View can't approve lines and/or no WO: Create & Edit.
   Technician can still pick; Parts Tech is a receiver, not a completer.
2. Technician has WOL Create & Edit but **no See Financial Data**, so cannot enter
   the mandatory sell price → cannot add a vendorless part (**Decision 4**).
3. Office has **WO: View only** → configures Simple Flow but cannot operate it.
4. Office has **Vendor & Order Mgmt: View only** → can open Bulk Receive but
   cannot receive (no edit).

Custom roles combine these atoms freely — e.g. grant a Technician **Order Parts +
Vendor & Order Mgmt: C&E** for a "tech who also receives"; or leave **Review Work
Orders** ON for only manager/foreman to build a stricter reviewer.

### Acceptance criteria (verbatim)

- The Simple-Flow WO settings inherit the existing `settingsApp` guard on the
  settings route; **no new permission.** Editable by any role with App Settings ON
  (system defaults: **Admin, Service Manager, Office**).
- **Completion** (all three variants + review) requires **Work Orders: Create &
  Edit**; the all-lines-approved gate requires **WO Lines: Create & Edit + Full
  View** (Tech View → can't approve → surfaces the existing "approve the line…"
  error).
- **Pick-in-modal** requires **Pick Parts**; **background PO creation** requires
  **Order Parts (→ See Financial Data).** (Resolves §8 "which roles do
  completion.")
- **Receive-on-WO** (line Receive button, completion "Receive parts", WO Parts
  tab) is **FE-gated by Order Parts**; **BE accepts the documented OR of
  `ROLE_DELIVERY_CREATE_AND_EDIT` / `ROLE_WORK_ORDER_PART_CREATE` /
  `ROLE_WORK_ORDER_CREATE_AND_EDIT`.**
- **Bulk Receive** (Stories 7–9) requires **Vendor & Order Mgmt: Create & Edit +
  See Financial Data**; Office (Vendor & Order View-only) can view but not
  receive. (Resolves §8 "which roles do bulk receive.")
- **Assign-vendor / merge** on a vendor-missing PO requires **Vendor & Order Mgmt:
  Create & Edit**; **inline part-number fix** requires **Catalog & Inventory:
  Create & Edit.**
- **Adding a vendorless part (Story 5)** requires **WO Lines: Create & Edit + See
  Financial Data** — enforced at creation (single gate). Normal catalogued
  part-adds do NOT require financial visibility (sell derives from the pricing
  matrix). (Resolves §8 "cost at completion"; **Decision 4**.)
- **Cost/sell on receive screens** follow **See Financial Data**; sell auto-locks
  once the WO is invoiced/paid regardless of permission.
- **Mark Reviewed / sign-off** requires **Review Work Orders**; reviewer VIN entry
  requires **WO Lines: Create & Edit**. **NET-NEW: enforce reviewer ≠ completer as
  a hard rule** (stamp `sentToReviewBy`/`completedBy`; block Mark Reviewed for
  that user). **This is not an atom and must be built.** (Resolves §8 "role-gating
  review"; **Decision 3**.)
- **BE enforces** the Simple-Flow settings and the permission atoms (**not
  FE-only**), accounting for the atom collapse in the Core rule note. (Resolves §8
  "BE enforcement.")
- Simple Flow Confluence spec (§4/§7/§8) updated so each role reference names the
  exact atom instead of "owner/admin", "accountant", "manager/foreman",
  "office/readonly".

### Drift / gaps found in code (fix or track)

- **Dropped `operatingMode`:** the POC branch (`SV-7301-simple-flow-redo`) still
  renders the Full/Simple `operatingMode` selector in `WorkOrderSettings.vue`;
  spec V2.3 says drop it. Ensure the build removes it.
- **Missing `settingsIntegrations`:** the permission catalog's seeded settings
  list is `[app, service, parts, finance, dataImport, wages]` — no
  `settingsIntegrations`, though the Custom Roles spec lists Integrations
  (QuickBooks/IBS/Open API) as a sub-section. Reconcile.
- **Unguarded feature-flags:** the feature-flags admin route has no permission
  guard.

### Related issues

- **SV-7301** (In Progress) — Simple Flow / Express Mode (epic this maps)
- **SV-7388** (In Progress) — Custom Roles and Permissions (parent)
- **SV-8095** (TESTING QA) — same treatment for Digital Inspections (precedent)
- **SV-7820** (Ready to Fix) / **SV-7838** (Done) / **SV-7864** (TESTING STAGE) —
  receive-atom decisions (BE OR + atom collapse)
- **SV-7870** (In Progress) — Simple Completion Review ON (Story 16)
- **SV-8046** (Done) — hide review button while loading
- **SV-7696…SV-7710, SV-7876** (Ready for QA) — Simple Flow stories

### Comments

None present in the export.
