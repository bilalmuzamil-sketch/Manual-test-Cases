# Custom-Role Permissions Assessment — Fees & Discounts V1 and Simple Flow

> Question answered: for each feature, are its Custom-Role permissions properly
> **DEFINED** (and reusing existing permissions), or does the feature **REQUIRE new
> custom permission definitions** to be created?
>
> Verdict in one line each:
> - **Fees & Discounts V1 — DEFINED.** Reuses existing Custom-Roles permissions;
>   introduces **no** new permission. Two existing gates need tightening at build.
> - **Simple Flow — DEFINED (source SV-8183).** Was "REQUIRES DEFINITION"; now
>   resolved by Jira **SV-8183**. Reuses existing Custom Roles atoms only —
>   introduces **no new permission atom**; adds **one NET-NEW behavioural rule
>   (reviewer ≠ completer)**. Full matrix below.

---

## 1. Fees & Discounts V1 — permissions are DEFINED (reuse only)

**Source:** `build/fees-discounts/requirements.md` §10 (Story 13 / Jira SV-7388),
the action→permission mapping table.

Story 13 states explicitly (S13-R1): **"Fees & Discounts adds no permission of its
own."** Every action maps to an **existing** Custom Roles permission. There are two
independent gates — the **per-org feature toggle** (feature exists) **and** the
**permission** (what a user may do); a user needs both.

Permissions the spec names, and their status:

| Action | Permission required | Status |
|---|---|---|
| See fee/discount **dollar amounts** (sidebar card, WO line table, Statistics tab, Financial Info card, Part Sales column & viewer, customer documents) | **See Financial Data** (S13-R2) | EXISTING — reused |
| Add/edit/remove a **Whole Work Order** adjustment | **Work Orders: Create and Edit** (S13-R3) | EXISTING — reused |
| Add/edit/remove a **Labor Line or Part Line** adjustment | **Work Order Lines: Create and Edit** (S13-R4) | EXISTING — reused |
| Add/edit/remove a **Part Sale** part adjustment | **Part Sales: Create and Edit** (S13-R5) | EXISTING — reused |
| Any add/edit/remove (money-visibility prerequisite) | **also requires See Financial Data** (S13-R6) | EXISTING — reused |
| **Remove** an adjustment | part of **Create and Edit**, NOT the separate "Delete" (S13-R7) | EXISTING — reused (semantics clarified) |
| Create/edit/delete an adjustment **template** (admin Fees & Discounts page) | **Settings → Finance** (S13-R8) | EXISTING — reused |
| View/change a **customer's default** fees & discounts | **Customer Management: Create and Edit** AND **Manage Accounts Payable and Receivable** (S13-R9) | EXISTING — reused (both required) |
| See fee/discount entries in the **WO history log** | **View History Logs** (S13-R10) | EXISTING — reused |

**New permissions introduced by this feature: NONE.**

**Two existing gates to tighten when the model ships (S13.4 "current-build
differences"):**
1. The admin Fees & Discounts page is shown today to any user with a location
   (S7-R7b); S13-R8 tightens it to **Settings → Finance**.
2. The current build may use one WO-edit check where S13-R3/R4 **split** whole-WO
   actions (Work Orders: Create and Edit) from line-level actions (Work Order Lines:
   Create and Edit).

Story 13 is the **target** model (SV-7388, not yet released). Until it ships the
feature uses the matching existing checks; behavior is the same, only setting names
change. **Bottom line: DEFINED — reuse existing permissions, add none, tighten two.**

---

## 2. Simple Flow — permissions are DEFINED (source SV-8183; reuse only)

**Source:** Jira **SV-8183** "Permission: Simple Flow — enforcement mapping to
existing WO / Parts / Settings atoms" (Reporter Milos Vasic; Open; 07/Jul/26).
Verbatim copy: `build/simple-flow/SV-8183-permissions-source.md`. Recorded into
`build/simple-flow/requirements.md` §9 (matrix) + §10 (spec deltas). Mirrors
SV-8095 (Digital Inspections).

SV-8183 resolves the previously-open §8 items ("which roles do completion vs bulk
receive vs settings vs review"). **Simple Flow adds no permission atom of its own**
— every action maps to an existing Custom Roles atom (SV-7388).

Action → existing atom:

| Action | Permission required | Status |
|---|---|---|
| See/edit WO Settings page | **Settings › App Settings** (`settingsApp`) — inherits settings-route guard | EXISTING — reused |
| Run completion (Complete / Send to Review / Reviewed→Complete) | **Work Orders: Create & Edit** | EXISTING — reused |
| Approve all lines (hard gate) | **WO Lines: Create & Edit + Full View** (Tech View hides Approve) | EXISTING — reused |
| Enter mileage/VIN/engine hours; tech story; resolve cores | **WO Lines: Create & Edit** | EXISTING — reused |
| Add vendorless / no-PN part | **WO Lines: Create & Edit + See Financial Data** (mandatory sell) | EXISTING — reused (both) |
| Pick inventory parts (auto-pick off) | **Pick Parts** (`woPickParts`) | EXISTING — reused |
| Background order + create POs | **Order Parts** (`woOrderParts`) → requires See Financial Data | EXISTING — reused |
| Receive on the WO | **FE: Order Parts.** BE: OR of `ROLE_DELIVERY_CREATE_AND_EDIT` / `ROLE_WORK_ORDER_PART_CREATE` / `ROLE_WORK_ORDER_CREATE_AND_EDIT` | EXISTING — reused |
| Bulk Receive page | **Vendor & Order Mgmt: Create & Edit + See Financial Data** | EXISTING — reused |
| Assign vendor / merge on vendor-missing PO | **Vendor & Order Mgmt: Create & Edit** | EXISTING — reused |
| Inline part-number fix | **Catalog & Inventory: Create & Edit** | EXISTING — reused |
| Cost/sell on receive screens | **See Financial Data** (sell state-locks once invoiced/paid) | EXISTING — reused |
| Mark Reviewed / sign-off | **Review Work Orders** (`woReviewWorkOrders`) **+ reviewer ≠ completer** | EXISTING atom + **NET-NEW rule** |
| Waiting-on-Parts column | **Work Orders: View** | EXISTING — reused |
| Go to Invoice | **Invoicing & Payments: Create & Edit + See Financial Data** | EXISTING — reused |

**New permission atoms introduced: NONE.**

**One NET-NEW behavioural rule (not an atom, must be built):** **reviewer ≠
completer** — the user who completed / sent-to-review a WO cannot Mark Reviewed it
(stamp `sentToReviewBy`/`completedBy`; block Mark Reviewed for that user).

**Per-role matrix:** see `build/simple-flow/requirements.md` §9.2. Highlights:
Admin / Service Manager / Senior SA / Service Advisor / Foreman / Parts Manager =
Complete; Technician = pick only (no complete, no vendorless — no See Financial
Data); Parts Tech = receiver not completer; Office = can edit settings (App
Settings) but cannot operate the flow (WO View-only); Sales Rep / Time Clock =
nothing. Settings-editor system defaults = **Admin, Service Manager, Office**.

**Backend enforcement:** SV-8183 says **BE enforces** the settings + atoms (not
FE-only). Caveat — the **atom collapse**: `woOrderParts`,
`workOrderLinesCreateAndEdit`, `woFullView`/`woTechView`, `workOrdersCreateAndEdit`
all resolve to `ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT` at BE, so any role with WO
Create & Edit can receive onto a WO (deliberate low-privilege trade-off, SV-7864);
FE Order-Parts vs Full/Tech-View distinctions are conveniences, not BE-enforceable.

**Bottom line: DEFINED — reuse existing atoms, add none; build one NET-NEW
reviewer≠completer rule. Case updates proposed (not yet applied) — see the
SV-8183 task report and requirements.md §10.**
