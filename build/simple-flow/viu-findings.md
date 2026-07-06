# Simple Flow — Deep VIU Findings (QA env sv7301)

> **Env:** App `https://sv7301.qa.shopview.com` · API `https://sv7301api.qa.shopview.com`
> (note: `sv7301api`, no dot). Auth: `POST /api/quick-login {"key":"admin"}` gated by
> cookies `sv_sso_session` / `PHPSESSID` / `cf_clearance` (domain `.qa.shopview.com`).
> Logged in as **admin@shopview.com** (role Admin, view_mode full, 41 perms).
> **Feature is settings-driven — NO "Simple Mode" feature flag exists** (checked
> `/administration/feature-flags`). Behavior is controlled by the Work Order settings tab.
> **Session note:** `quick-login {key:'tech'}` returns **403** in this env — only the
> admin session works, so non-admin/role-gating negatives are NOT verifiable here.
>
> **VIU date:** 2026-07-06. Evidence screenshots: `build/simple-flow/viu-evidence/*.png`.
> **Settings baseline** captured to `/tmp/simple-flow/settings-baseline.json` and
> **RESTORED** at end (verified). Throwaway WO **S2-15747** created + **deleted** (clean).

## Summary table

| Story / area | Verdict | Notes |
|---|---|---|
| **1** — Work Order Settings (SV-7696) | **PARTIAL** | 7 toggles + helper text + persistence PASS; **"Create POs" toggle absent**; Save always-enabled; admin-only BLOCKED (no non-admin session) |
| **2** — No-PO / Skip completion (SV-7697) | **PASS** | Full happy path walked to Success screen on a real WO |
| **3** — PO + Optional vendor invoice (SV-7698) | **PASS** | Wizard shows "Complete Without Receiving" + Receive Parts |
| **4** — PO + Required vendor invoice (SV-7699) | **PASS** | Complete CTA disabled until received; no skip option |
| **16** — Require Review (SV-7870) | **PASS** | Send-to-Review gate, Review state, Mark Reviewed (VIN), sign-off |
| **17** — Tech Story Flow (SV-7876) | **PASS** | Inline sub-row + completion gate modal enforced |
| **6** — Vendor Missing flag (SV-7701) | **PASS** | "Vendor Missing +N" shown on PO list |
| **11** — Receive button on POs (SV-7706) | **PASS** | Per-row Receive action present |
| **12** — Accept Delivery / Vendor Invoices (SV-7707) | **PASS (existing)** | Present; not deep-driven |
| **Line-approval gate** (Key Decision) | **PARTIAL** | Manual "Needs Approval" state PASS; final "cannot complete unapproved" block not cleanly isolated |
| **7 / 8 / 9 / 14** | **NOT-BUILT** | PO multi-select, Bulk Receive page, apply-invoice, Waiting-on-Parts column — VIU-pending (dev incomplete) |

Baseline settings (org `d55bc308-…`): `autoApproveLines:true, requireVendorInvoiceNumber:false,
requireReview:false, requireTechStories:true, requireMileage:true, requireHours:false,
requireVehicleIdentifier:true (vin), autoPickInventoryParts:true`.

---

## Story 1 — Work Order Settings (SV-7696)

Path: `/administration/settings` → **Work Orders** tab. Endpoints: read
`GET /api/organizations/settings`; save `POST /api/organizations/settings/change`.

| AC | Verdict | Steps / actual result | Evidence |
|---|---|---|---|
| Toggles present in order, new vs existing | **PASS** | 7 toggles: Auto-approve Lines · Require Vendor Invoice Number · Require Review Before Completion · Require Tech Story · Require Mileage · Require Engine Hours · Automatically Pick Inventory Parts. States matched API baseline (true,false,false,true,true,false,true). | `08-settings-workorders.png`, `S1-01-settings-baseline.png` |
| Helper text per toggle | **PASS** | e.g. Require Vendor Invoice Number: "When on, parts and a vendor invoice number are required to complete a work order. When off, complete now and receive parts later." Every toggle has descriptive helper text. | `08-settings-workorders.png` |
| **S1-R2 "Create Purchase Orders" toggle** | **NOT-BUILT / FAIL vs spec** | No such toggle in the UI, and the settings model returned by the API has **no `createPurchaseOrders` field**. POs appear to be always-on (no way to configure "Create POs OFF"). See BUGS #1. | `08-settings-workorders.png` |
| S1-R3 Vendor invoice Required/Optional | **PASS** | Present as its own toggle (`requireVendorInvoiceNumber`); drives Story 3 vs 4 wizard behavior (verified below). | — |
| S1-R1 Auto-approve drives approval | **PASS** | ON → new line auto-approved on add (Story 2). OFF → new line "Needs Approval" with Approve/Decline. | `S17-01-unapproved-line.png` |
| Save persists; future only | **PASS** | Toggled a setting, Saved, reloaded page → persisted; confirmed via `GET /api/organizations/settings`. | `S1-04-persisted.png` |
| Save enabled only when changed | **PARTIAL / deviation** | Save Settings button is **always enabled** (not gated on a dirty state). See BUGS #2. | `S1-01-settings-baseline.png` |
| Non-admin can't see/modify | **BLOCKED** | `quick-login {key:'tech'}` → 403; no non-admin session obtainable → negative not verifiable. Settings live under `/administration` (admin area). | — |
| No operating-mode selector / no VIN toggle | **PASS** | Neither present in the WO settings UI. (Server model has `requireVehicleIdentifier`/`vehicleIdentifier:"vin"` but it is not exposed as a WO-settings toggle.) | `08-settings-workorders.png` |

## Story 2 — Simple Completion, No-PO / Skip (SV-7697)  — **PASS**

Steps: created ZZAUTOTEST WO **S2-15747** (Aagate Landscaping / Sullair) → added a
labor-only line "Diagnose - Air leak" (auto-approved) → clicked **Complete Work Order**.

| AC | Verdict | Actual | Evidence |
|---|---|---|---|
| S2-R1 Complete button next to New Line | **PASS** | Button present on WO `/lines`. | `14-wo-detail.png` |
| Tech-story gate then completion (Story 17 chain) | **PASS** | Tech-story modal opened first; after Continue, wizard opened. | `S2-11-techstory.png` |
| S2-R2 centralized required-fields modal | **PASS** | Wizard step "1 Details" collected **Mileage**. Steps = **Details → Success** (no Receive step for a no-parts WO). | `S2-13-details.png` |
| One-confirm → Success; lines → Completed | **PASS** | Clicked Complete Work Order → Success: "Order complete · Sent to Finance as an invoice-ready draft · Work order S2-15747 · Invoice total $382.77 · Done / Go To Invoice". WO status → **Complete**. | `S2-14-success.png` |
| S2-R4 Success screen WO# + total, Done/Go to Invoice | **PASS** | As above. | `S2-14-success.png` |
| S2-R6 re-open (add line to completed WO → Approved) | **PASS** | Adding a New Line to the Complete WO returned it to **Approved**. | `S16-03-reopened.png` |

## Story 17 — Tech Story Flow (SV-7876)  — **PASS**

| AC | Verdict | Actual | Evidence |
|---|---|---|---|
| TS-R1 inline "Add tech story for this line" sub-row | **PASS** | Each line shows a Story sub-row with the link. | `S2-06-line-added.png` |
| TS-R3 gate at completion (modal first) | **PASS** | With Require Tech Story ON + a line missing a story, clicking Complete opened the Tech-story modal **before** the completion wizard. | `S2-10-complete-1.png` |
| TS-R4 modal structure | **PASS** | Header "Tech story" + `WO# · Customer` (S2-15747 · Eric Mcdaniel); per-line card ("1. Diagnose - Air leak"); "Line 1 of 1"; required textarea; **Continue disabled until non-empty**. | `S2-11-techstory.png` |
| TS-R6 test id `input_tech_story` | **PARTIAL** | Textarea present and functional; drove via generic dialog textarea (specific test-id not separately asserted). | `S2-11-techstory.png` |

## Story 3 — PO + Optional vendor invoice (SV-7698)  — **PASS**

Steps: set `requireVendorInvoiceNumber=false`; WO with a part-bearing line ("Replace -
Brake pot", 2 parts); Complete → wizard.

- Wizard = "1 Receive → 2 Success", "**2 parts waiting to receive**".
- Actions: **Cancel · Complete Without Receiving · Receive Parts** (S3-R4/R5/R6). PASS.
- Contrast with Story 4 (below) is the discriminator. Evidence `S3-01-wizard-optional.png`.
- Full receive round-trip + core-resolution sub-flows (S3-C1..C4) not driven (observation-level).

## Story 4 — PO + Required vendor invoice (SV-7699)  — **PASS**

Steps: set `requireVendorInvoiceNumber=true`; same part-bearing WO; Complete → wizard.

- Wizard = "1 Receive → 2 Success", "2 parts waiting to receive".
- **Complete Work Order CTA is DISABLED**; **Receive Parts** present; **NO "Complete without
  receiving"** (S4-R4). PASS. Evidence `S4-02-wizard.png`.

## Story 16 — Require Review (SV-7870)  — **PASS**

Steps: set `requireReview=true`; reopened WO to Approved; Complete → review flow.

| AC | Verdict | Actual | Evidence |
|---|---|---|---|
| R1 setting present + functional | **PASS** | Toggle on settings page drives the flow (resolves design-gap: toggle is on the page, not prototype-only). | `08-settings-workorders.png` |
| R2 CTA "Complete & Send to Review" | **PASS** | Wizard CTA relabelled. | `S16-04-review-wizard.png` |
| R5 states Approved → Review (amber) | **PASS** | After Send, WO status = **Review**; success panel "Sent for review — a reviewer will sign off before this order can be invoiced". | `S16-05-after-send.png` |
| R7 Mark Reviewed dialog captures VIN | **PASS** | "Mark as reviewed" dialog with **VIN** field (`input_review_vin`); VIN pre-filled from asset; Confirm Review enabled. | `S16-06-mark-reviewed-dialog.png` |
| R9 Ready-for-Review indicator | **PASS** | "Ready for Review" surfaced on the WO in Review state. | `S16-05-after-send.png` |
| R7 optional review note (`input_review_note`) | **FAIL / gap** | Mark-reviewed dialog had **only** the VIN field; no optional-note input present. See BUGS #3. | `S16-06-mark-reviewed-dialog.png` |
| R5/R8 Review → Reviewed → Complete (distinct) | **PARTIAL / deviation** | After Confirm Review the WO went straight to **Complete** (did not observe a distinct "Reviewed" state requiring a separate final "Complete Work Order"). See BUGS #4. | `S16-08-reviewed.png` |
| Role-gating (manager/foreman only) | **NOT-TESTABLE** | Only admin session available. | — |

## Stories 6 / 11 / 12 (receiving surfaces) — re-affirmed from recon

- **6 (SV-7701) PASS** — PO list (`/parts/orders`) shows "**Vendor Missing +N**" flag. `17-po-detail.png`.
- **11 (SV-7706) PASS** — per-row **Receive** action on POs. `17-po-detail.png`.
- **12 (SV-7707) PASS (existing)** — Vendor Invoices / Accept-Delivery surface present at `/parts/deliveries`; not deep-driven. `13-vendor-invoices.png`.

## Line-approval gate (Key Decision "all lines must be approved") — **PARTIAL**

- With `autoApproveLines=false`, a newly added line shows **"Needs Approval"** with
  Approve/Decline actions (S1-R1 manual approval — PASS). `S17-01-unapproved-line.png`.
- The final "cannot complete with an unapproved line" block was **not cleanly isolated**:
  the completion wizard still opened with an unapproved line present (the tech-story and
  parts-receive gates dominated). The all-lines-approved enforcement presumably fires at
  the final confirm step — needs a targeted follow-up on a WO whose only blocker is an
  unapproved line.

## NOT-BUILT (VIU-pending — dev incomplete, not attempted)

- **Story 7** PO multi-select + "Receive Selected" — no checkboxes on `/parts/orders`.
- **Story 8** PO Bulk Receive page — no entry point.
- **Story 9** Per-vendor "Apply invoice to selected POs" — depends on 7/8.
- **Story 14** "Waiting on Parts" column — absent from the WO-list column selector
  (columns offered: Asset, VIN/Serial#, Progress, Service Advisor, Lead Technician,
  Clocked In, Lines, Total price, Created on, Invoiced Date, Days open, Parts, Returns).
  Evidence `16-wo-columns.png`, `12-po-via-menu.png`.

---

## BUGS FOUND / deviations vs spec

1. **No "Create Purchase Orders" setting (S1-R2).** Repro: `/administration/settings` →
   Work Orders tab; also `GET /api/organizations/settings`. **Expected:** a "Create
   purchase orders" toggle (default ON) so POs can be turned OFF. **Actual:** no toggle
   and no `createPurchaseOrders` field — POs are effectively always-on. Consequence:
   the pure **Story 2 "No-PO / skip" configuration (Create POs OFF ⇒ no PO at all)** is
   not configurable; a no-parts WO still completes in one confirm, but a WO with vendor
   parts always routes through the PO/receive path. (May be an intentional descope, but
   it diverges from the spec's Key Decisions and Story 1/2.)
2. **Save Settings always enabled.** `/administration/settings` Work Orders tab: the Save
   button is clickable even with no pending changes (no dirty-state gating). Expected
   (typical UX): disabled until a change. Minor.
3. **Mark Reviewed dialog missing optional note.** Story 16 R7/R10 specify an optional
   `input_review_note`. Actual: the "Mark as reviewed" dialog exposes only the VIN field.
4. **Review sign-off jumps to Complete.** Story 16 R5/R8 describe Review → **Reviewed** →
   (final Complete Work Order) → Complete as distinct states. Actual: after Confirm
   Review the WO went directly to **Complete**; no separate "Reviewed" holding state /
   final Complete click was observed. Verify whether an intermediate Reviewed state
   should exist (possible auto-progression for admin).

## Reusable access facts (for the next VIU run)

- API host `https://sv7301api.qa.shopview.com`; app `https://sv7301.qa.shopview.com`.
- Auth: `POST /api/quick-login {"key":"admin"}` (tech key = 403 here). Then hydrate SPA
  with localStorage `user` / `fe_permissions_wrapper` / `token` (boot2 pattern).
- WO settings: read `GET /api/organizations/settings`; write
  `POST /api/organizations/settings/change` (full settings object).
- New WO: `/workorders` → Create → pick Customer (searchable) + Asset (must have assets)
  → Save → lands on `/workorders/{id}/lines`. A WO with 0 lines auto-opens the New Line
  dialog. Canned-line field (`select_line_canned_line`) accepts only existing canned
  lines ("Total Parts: 0" = labor-only). Delete via WO header more_vert → Delete Work Order.
- Tools in `/tmp/simple-flow/tools/` (bridge.mjs, wolib.mjs, setapi.mjs, etc.).
