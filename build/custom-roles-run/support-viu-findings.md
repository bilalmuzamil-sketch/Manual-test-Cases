# Custom Roles — Support Catalog Gap-Closure VIU (Staging)

> **Purpose.** Live Verify-in-UI on `app.staging.shopview.com` /
> `api.staging.shopview.com` to close 5 gaps flagged in
> `custom-roles-current-state.md` §E so the support permission catalog is airtight.
> **Date:** 2026-07-07. **Method:** proven staging harness (quick-login SSO +
> boot2 hydration + fresh MITM bridge) — see `build/TESTING-RUNBOOK.md`.
> **Tech account** was restored to Time Clock at the end (verified).
> Screenshots: `build/custom-roles-run/support-viu/*.png`.

Test roles used (all `ZZAUTOTEST`, created then deleted at end):
- **ZZAUTOTEST Full OrderParts** — Full view, `woOrderParts` ON, SFD ON, `viewHistoryLogs` ON.
- **ZZAUTOTEST Full NoOrderParts** — identical but `woOrderParts` OFF (`woPickParts` still ON).
- **ZZAUTOTEST Tech OrderParts** — Tech view (`woTechViewMode`), `woOrderParts` ON, SFD ON.

Test WO: `S9-25052` (id `310fe4fa-9dfe-46cd-92ba-1dbe0ac75c67`), one line
"ZZAUTOTEST story line" in **Needs Approval**.

---

## Gap 1 — Authoritative permission catalog — **CLOSED**

**Verdict:** Captured the full source-of-truth list. **41 permissions** in the
catalog (Admin role = all ON).

**Evidence.** `GET /api/roles/{Admin id 9d56698b-…}` → 200 returns
`fe_permissions` (array of `{id,name,code}`), `view_mode`, and `cross_toggles`.
Raw list saved to **`build/custom-roles-run/permission-catalog-source.json`**.

Key structural facts discovered:
- The catalog holds **41** permission atoms for the Admin role.
- **View mode is itself a permission code**, mutually exclusive:
  `woFullViewMode` (Full view) vs **`woTechViewMode`** (Tech view). Admin's list
  carries `woFullViewMode`; the Technician system role carries `woTechViewMode`
  instead. So across the two view modes there are **42 distinct codes**, but any
  one role has exactly one of the two → "~41" per role.
- **There is no `woAddParts` permission** among the atoms. The WO sub-permissions
  that exist are: `woOrderParts`, `woPickParts`, `woReviewWorkOrders`, and the
  view-mode code. ("Add Parts" is not a separate catalog atom.)
- `cross_toggles` object = exactly `seeFinancialData`, `seeApArData`,
  `viewHistoryLogs` (the three cross-cutting toggles).
- `GET /api/auth/me/fe-permissions` returns `data.fe_permissions` as an array of
  **code strings** (not objects), plus `data.view_mode` and `data.cross_toggles`.

Full 41-code list (Admin): `settingsApp, seeApArData, settingsWages,
reportsPageAccess, settingsParts, catalogInventoryView, timesheetsCreateAndEdit,
customerPortalPageAccess, invoicingPaymentsCreateAndEdit, workOrdersDelete,
catalogInventoryDelete, billingPortalPageAccess, woReviewWorkOrders, woPickParts,
vendorOrderManagementCreateAndEdit, settingsService, settingsFinance,
invoicingPaymentsDelete, settingsDataImport, partSalesView, invoicingPaymentsView,
partSalesCreateAndEdit, workOrdersCreateAndEdit, customersDelete, scheduleView,
woOrderParts, timesheetsView, workOrderLinesCreateAndEdit,
catalogInventoryCreateAndEdit, scheduleDelete, customersCreateAndEdit,
seeFinancialData, vendorOrderManagementView, workOrdersView, workOrderLinesDelete,
woFullViewMode, viewHistoryLogs, customersView, vendorOrderManagementDelete,
scheduleCreateAndEdit, partSalesDelete`.

---

## Gap 2 — WO Parts tab gated by Order Parts — **CLOSED (confirmed YES)**

**Verdict:** The **Order Parts** permission **controls the Work Order Parts tab.**
ON → tab present and usable; OFF → tab absent. This resolves the previously
"unconfirmed / looked identical ON/OFF" item.

**Evidence (same WO, only `woOrderParts` differs; `woPickParts` ON in both):**
- **WITH Order Parts** (Full view): WO tabs = `Lines (1), Parts, Notes (2),
  History (2), Stats, Finance`. Clicking **Parts** navigates to
  `/workorders/{id}/part-requests` and shows the parts grid (columns
  Description, Part Number, Quantity, Cost, **Core**, Sell Price, Margin,
  Category, Vendor, Requested At, Status, Actions).
  Screenshots: `g2_full_orderparts_wo.png`, `g2_full_WITH_orderparts_partstab.png`.
- **WITHOUT Order Parts** (`woPickParts` still ON): WO tabs = `Lines (1),
  Notes (2), History (2), Stats, Finance` — **no Parts tab.**
  Screenshot: `g2_full_WITHOUT_orderparts.png`.

Note: the tab is gated specifically by **Order Parts**, not Pick Parts (Pick was
ON in the OFF case and the tab was still hidden).

---

## Gap 3 — History split: line-level vs WO-level — **CLOSED (confirmed)**

**Verdict:** `View History Logs` shows a **single work-order history feed that
contains BOTH WO-level and line-level events**, and it is **work-orders only**
(no Part Sales / PO history).

**Evidence.** `GET /api/work-orders/{wo}/history` → 200, `data.history[]`. On the
test WO the feed contained:
- `work_order.created` — **WO-level** entry (`lineId: null`).
- `work_order.line.created` — **line-level** entry (populated `lineId` +
  `lineName: "ZZAUTOTEST story line"`).

Each entry carries both WO context (`workOrderId`, `workOrderTotal`, service-advisor
/ vehicle / customer change fields) and line context (`lineId`, `lineName`,
labor/tech-time, part fields), so WO-level and line-level history are the same feed
keyed by presence/absence of `lineId`. In the UI this surfaces as the WO
**History (2)** tab (gated by `viewHistoryLogs`; present in every role that had it
ON). Screenshot: `g3_history_tab.png`.

**Work-orders-only confirmed:** probes for part-sales / inventory-order /
purchase-order history endpoints all returned **404** (no such history), matching
the product-owner note. Do not assert any Part Sales or PO history behaviour.

---

## Gap 4 — Full vs Tech view-mode matrix — **CLOSED**

**Verdict:** Tech view is a simplified WO screen. With **See Financial Data held
equal** (ON in both roles, so financials showed in both), the confirmed
differences on the WO **Lines** screen are:

| Element | Full view (`woFullViewMode`) | Tech view (`woTechViewMode`) |
|---|---|---|
| Per-line **Approve / Decline** action | **Shown** | **Hidden** |
| Lines-toolbar **bulk-approve** icon (`how_to_reg`) | **Shown** | **Hidden** |
| Hours label in WO header | "**Total Hours**" | "**Total Tech Hours**" |
| Rate / Margin / Line total | Shown (governed by SFD, not view mode) | Shown (same) |
| Line status text ("Needs Approval") | Shown | Shown |

**Evidence.** Same WO + line, only view mode changed:
- Full view line row: `… Needs Approval **Approve Decline** $232.43 100% $232.43`
  (Approve count 1, Decline count 1); toolbar shows `how_to_reg`; header
  "Total Hours". Screenshot: `g4_fullview_lines.png`.
- Tech view line row: `… Needs Approval  $232.43 100% $232.43` — **no
  Approve/Decline**; toolbar has **no** `how_to_reg`; header "Total **Tech**
  Hours". Screenshot: `g4_techview_lines.png`.

Takeaway for support: the **Approve action (and bulk approve) is the headline
thing Tech view removes**; money visibility is a separate lever (See Financial
Data), not the view mode.

---

## Gap 5 — Core OK / Not-OK line story — **PARTIAL (mechanism confirmed; control not driven)**

**Verdict:** The core mechanism and its live footprint are confirmed, but the
core **OK / Not-OK inspection control could not be driven end-to-end** in the
harness (the required seed — add a core part, order it, receive it — is the
long-standing undrivable step; add-part-to-line has no accessible create endpoint
and the UI add-part flow is harness-flaky).

**What IS confirmed live:**
- Core-bearing parts are real data: inventory parts carry `is_core`,
  `core_charge`, `core_charge_value`, `core_part_id`. Example found live:
  part **"CONNECTOR"** with `core_charge = 20` and a `core_part_id` set.
- The WO **Parts** grid has a dedicated **"Core"** column (visible in
  `g2_full_WITH_orderparts_partstab.png`), i.e. the core UI surface exists.
- Per spec + playbook, **WO Lines: Create & Edit** governs core OK/Not-OK marking
  and the line story/history; the line-level history entries proven in Gap 3
  (`work_order.line.*`) are what the "line story" renders under `viewHistoryLogs`.

**What is still open:** the actual OK vs Not-OK behaviour (what each does to the
core charge / return, and independent proof of the permission gate) needs a WO
with a **received** core part awaiting inspection — recommend a manual seed
(add "CONNECTOR" to a WO line, order, receive) then observe the core control.

---

## Safety / cleanup

- Tech's role captured at start = **Time Clock User** (`9834b7ec-…`) — no change
  needed, but restored explicitly anyway.
- **Tech RESTORED to Time Clock at end and verified** (`staging-restore-tech.mjs`):
  3 perms `scheduleView, timesheetsView, workOrdersView`.
- All 3 `ZZAUTOTEST` roles deleted (`DELETE /api/roles/{id}` → 204); 0 remaining.
- Confirmed live IDs: Time Clock User role = `9834b7ec-4625-4fb7-9a82-b69de3703e48`;
  Tech `/change` staff_id `6fb22c1b-…`; org `d55bc308-…`.
</content>
</invoke>
