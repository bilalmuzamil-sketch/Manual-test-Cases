# Simple Flow — Deep VIU Findings (QA env sv7301)

> **Env:** App `https://sv7301.qa.shopview.com` · API `https://sv7301api.qa.shopview.com`
> (note: `sv7301api`, no dot). Auth: `POST /api/quick-login {"key":"admin"}` gated by
> cookies `sv_sso_session` / `PHPSESSID` / `cf_clearance` (domain `.qa.shopview.com`).
> Logged in as **admin@shopview.com** (role Admin, view_mode full, 41 perms).
> **Feature is settings-driven — NO "Simple Mode" feature flag exists** (checked
> `/administration/feature-flags`). Behavior is controlled by the Work Order settings tab.
> **Session note (UPDATED 2026-07-07):** `quick-login {key:'tech'}` now returns **200**
> (the prior 403 is FIXED). The tech user is a genuine **Technician** role (view_mode
> `tech`; 6 perms: `customersView, woTechViewMode, workOrdersView, scheduleView,
> woPickParts, workOrderLinesCreateAndEdit`) — matches the §9.2 Technician row exactly.
> Role-gating negatives are now testable via the tech session. **quick-login is stateful
> on the shared PHPSESSID** — it rebinds the one session, so probe strictly SEQUENTIALLY
> per role (login role -> run that role's calls -> login next role).
>
> **VIU dates:** 2026-07-06 (initial) + **2026-07-07 (Tech-unblock pass)**.
> Evidence screenshots: `build/simple-flow/viu-evidence/*.png`.
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

---

# TECH-UNBLOCK PASS — 2026-07-07 (role-gating negatives now testable)

Tech quick-login now works (200). Baseline captured to `/tmp/simple-flow/settings-baseline-2.json`
and **RESTORED + verified** at end; **tech role NOT changed** (used as-is, verified unchanged).
Six throwaway ZZAUTOTEST WOs created and **all deleted** (verified 0 active WOs remain;
completed WOs required reopen-by-adding-a-line before `POST /api/work-orders/delete`).

## Headline: does the BACKEND enforce the permission atoms, or FE-only?

**MIXED — and this is the key result.** BE enforces only the *distinct* atoms; the
collapsed WO-family atoms are effectively **FE-only** at the server.

| Action (endpoint) | Tech (non-admin) | Admin | Verdict |
|---|---|---|---|
| **Settings save** `POST /api/organizations/settings/change` | **403** Access denied | 200 | **BE ENFORCES** `settingsApp` (distinct atom) |
| Settings **read** `GET /api/organizations/settings` | 200 | 200 | read open; write gated |
| **Complete WO** `POST /api/work-orders/{id}/simple-complete` | **201** (WO→complete) | 201 | **BE does NOT enforce** — atom collapse |
| **Review sign-off** `POST /api/work-orders/change-status {status:"complete"}` | **201** | 201 | **BE does NOT enforce** `woReviewWorkOrders` |

- Tech has `workOrderLinesCreateAndEdit`, which collapses to
  `ROLE_WORK_ORDER::VIEW+CREATE_AND_EDIT` server-side (SV-7864). So the Technician —
  who per §9.2 cannot complete or sign off — **CAN do both via the API**. The FE hides the
  controls; the BE does not enforce the distinction.
- Proof of tech-complete: tech `simple-complete` with `{}` returned the **same** business
  validation 400 ("Line can not be completed without a tech story. id: …") as admin (i.e.
  the permission voter PASSED for tech — not a 403); after admin set the story + mileage,
  **tech `simple-complete` → 201, `status:"complete"`**.
- **Net for SF-PERM-06:** expected #2 (any role with WO C&E can act on the WO) = CONFIRMED;
  expected #1 ("BE enforces the atoms, not FE-only") = TRUE only for the settings atom,
  **FALSE for WO completion / receive / review sign-off** (FE-only in practice).

## FE gating (as Technician, browser)

- **SF-PERM-02** — WO page: **"Complete Work Order" button HIDDEN** for Technician
  (`TECH-wo-detail.png`). Tech cannot complete via UI (BE gap above notwithstanding).
- **SF-PERM-01 / SF-SET-11** — `/administration/settings` **redirects** tech to
  `/workorders` (FE route guard) (`TECH-settings.png`). Combined with the BE 403 →
  settings are FULLY enforced (FE + BE).
- **SF-PERM-05 / SF-RCV-03** — `/parts/orders` **redirects** tech to `/workorders`; no
  Receive action reachable (`TECH-po-list.png`). (Tech used as a no-Order-Parts proxy; not
  the exact Office role.)

## Reviewer ≠ completer (the one NET-NEW Simple-Flow rule) — **NOT IMPLEMENTED (BUG)**

- Enabled Require Review; admin **Sent to Review** (S2-15752 → status `ready_for_review`),
  then the **same admin Marked it Reviewed** with no block → WO went **Review → Complete**
  (`REV-admin-completer-markreviewed.png`). The reviewer≠completer restriction
  (`sentToReviewBy`/`completedBy` stamp block) is **absent**.
- Affects **SF-PERM-08, SF-PERM-04(3), SF-PERM-07(2), SF-REV-09(3)**.

## Story 16 re-confirmations & endpoints

- Send-to-Review reuses `POST /api/work-orders/{id}/simple-complete` (the `requireReview`
  setting routes it to `ready_for_review` instead of `complete`).
- Mark Reviewed dialog = **"Mark as reviewed", VIN-only** (`input_review_vin`), Cancel +
  Confirm Review; **no optional note** (re-confirms BUG #3). Sign-off endpoint =
  `POST /api/work-orders/change-status {id,status:"complete",work_order_part_cost:0}` and it
  jumps **Review → Complete** with no distinct "Reviewed" state (re-confirms BUG #4).
- Completion helper endpoints: `POST /api/work-orders/lines/change-story`
  `{line_id,tech_story,work_order_id}`; `POST /api/work-orders/change-required-data`
  `{work_order_id,data:{mileage,vin}}`.

## BUGS / DEVIATIONS (this pass)

5. **reviewer ≠ completer NOT enforced (NEW, high).** The one net-new Simple-Flow rule is
   missing — a user can sign off their own completed/sent-to-review WO. (SF-PERM-08.)
6. **WO-completion permission is FE-only at the BE (atom collapse consequence).** A
   Technician (no `workOrdersCreateAndEdit`, Tech View) can complete a WO via
   `simple-complete` (201). Whether this is "acceptable per SV-7864" or a gap is a
   product call, but it means role-gating of completion is not server-enforced. (SF-PERM-02/06.)
7. **Review sign-off permission (`woReviewWorkOrders`) is FE-only at the BE.** A Technician
   without the atom drove the review→complete sign-off via `change-status` (201). (SF-PERM-07/REV-09.)
   *(Settings enforcement, by contrast, IS real: tech settings-save → 403.)*

## Cases moved this pass

- **VIU-Verified (10):** SF-PERM-01, SF-PERM-02, SF-PERM-04, SF-PERM-05, SF-PERM-06,
  SF-PERM-07, SF-PERM-08, SF-RCV-03, SF-REV-09, SF-SET-11.
- **Still VIU-Pending (reasons):** SF-PERM-03 (Bulk Receive = Stories 7/8 not built),
  SF-PERM-09 & SF-VPART-02 (vendorless part-add sub-form not reached in budget; tech
  confirmed no `seeFinancialData`), SF-PERM-10 (only Technician-negative confirmed; other
  roles need more accounts). Stories 7/8/9/14 remain dev-not-built (unchanged).

---

# VIU BATCH — 2026-07-08 (built-surface pending cases)

Fresh QA cookies re-supplied (new 64-hex `sv_sso_session`); admin + tech
quick-login both **200**. Baseline captured to
`/tmp/simple-flow/settings-baseline-3.json` and **RESTORED/verified** at end
(settings never changed this pass — matched baseline throughout). **Tech role NOT
changed** (verified still Technician). Three throwaway WOs created (53d021fb /
S2-15755, a71ec2f0, 00609f73 / S2-15757) and **all deleted** (verified 0 of mine
remain; completed one reopened by adding a line before delete).

**API shapes shifted since 07-07** (record for next run): WO list
`GET /api/work-orders` → `{data:{pagination,work_orders}}`; WO detail
`GET /api/work-orders/view/{id}` → `{data:{work_order}}`; lines
`GET /api/work-orders/lines/{id}` → `{data:{collection:[…]}}` (each line has
`line_id`, `status` in {authorization_required, authorization_declined, authorized},
`tech_story`, `part_requests[]`). **Line create = `POST
/api/work-orders/{woId}/lines/create-from-canned-line {another,canned_line_id,
work_order_id,status}`** (status must be a valid line-status; canned-line ids from
`GET /api/work-orders/canned-lines?pagination[rowsPerPage]=1000`).

## Verified this pass (7 moved VIU-Pending → VIU-Verified)

| Case | Layer | Result | Evidence |
|---|---|---|---|
| **SF-COMP-21** | API | `simple-complete` on a WO with an `authorization_required` line → **400 "All lines must be approved before completing the work order."** BE-enforced. | WO a71ec2f0 |
| **SF-VAL-11** | API | Same 400 confirms the approve-line error text. | WO a71ec2f0 |
| **SF-COMP-22** | API | Block fires from the line's own `authorization_required` status while org `autoApproveLines=true` — holds regardless of Auto-approve. | WO a71ec2f0 |
| **SF-VMIS-01** | API | Completing a WO with 2 vendorless vendor-parts assigned both part_requests the **same `order_id`** with `vendor_id=null`, `part_number=null` — one shared WO PO, **no dummy PO**. | WO 53d021fb |
| **SF-COMP-14** | API+UI | Optional-invoice (`requireVendorInvoiceNumber=false`) completion → **201, WO=Complete** with both parts still `waiting_to_receive` (qty_remaining preserved); UI Receive step shows the **"Complete Without Receiving"** button. | `VIU2-03-receive-step.png` |
| **SF-VAL-01** | UI | Completion-wizard Details step blocks Continue with inline **"Mileage is a required field"** when mileage empty. | `VIU2-02-mileage-gate.png` |
| **SF-COMP-05** | UI | Same mileage gate = "required vehicle field missing blocks completion". | `VIU2-02-mileage-gate.png` |

Re-confirmed (already Verified): **SF-COMP-11** (Receive step: Cancel · Complete
Without Receiving · Receive Parts) and **SF-COMP-12** ("2 parts waiting to
receive" count) — `VIU2-01-wizard-details.png`, `VIU2-03-receive-step.png`.
Wizard = **1 Details → 2 Receive → 3 Success**.

## Key new finding — completion required-fields are FE-only at the BE (BUG-8)

`simple-complete` does **NOT** enforce mileage / VIN / engine-hours; only the
completion **wizard** does. The **tech-story** gate and the **all-lines-approved**
gate, by contrast, **are** BE-enforced (explicit 400s). So enforcement is
per-check, matching the FE-only pattern of BUG-6/BUG-7. See bugs-log BUG-8.
Impact: SF-VAL-01/02/03, SF-COMP-05/16, SF-REV-03 are verifiable only at the UI
layer (where the gate is real).

## Still VIU-Pending after this pass — exact blocker

- **SF-VPART-01/02, SF-PERM-09 (vendorless / no-PN part add):** the manual
  part-request add sub-form is reached via a line's Parts tab that requires the
  line's "parts authorized" path; not reliably drivable in this harness session
  (the labor-line edit dialog exposed no Parts tab). Canned-line parts DO produce
  the vendorless shape (`part_number=null, vendor_id=null, part_source_type=
  "vendor"`, editable `sell_price`), corroborating the model, but the
  description+qty+sell **manual sub-form** + its See-Financial-Data gate remain
  UI-unverified. Needs a driven add-part sub-form (+ a non-SFD role for PERM-09).
- **SF-COMP-13 / SF-RCV-02 (Receive Parts → Accept Delivery):** "Receive Parts"
  in the optional Receive step returned to the WO lines page rather than Accept
  Delivery because the seeded parts were **vendor-missing (not receivable)**.
  Needs a WO seeded with genuinely receivable parts (vendor + part number).
- **SF-VAL-02 (VIN missing), SF-VAL-03 (engine hours missing):** VIN was
  pre-populated from the asset (not asked in the wizard); engine hours needs
  `requireHours=ON`. Both need a targeted wizard drive with the field forced empty.
- **Cores (SF-CORE-*):** no core-charge / is_core part could be seeded via the
  canned lines used; needs a seeded inventory core part or a core-bearing canned
  line. Not attempted end-to-end.
- **SF-PERM-10 (per-role completion matrix):** only admin (+) and Technician (−,
  FE) available; other roles (Office/Service Manager/Foreman/etc.) need accounts.

## Reusable access facts (for the next VIU run)

- API host `https://sv7301api.qa.shopview.com`; app `https://sv7301.qa.shopview.com`.
- Auth: `POST /api/quick-login {"key":"admin"|"tech"}` (**tech now works = 200**). Then
  hydrate SPA with localStorage `user` / `fe_permissions_wrapper` / `token` (boot2 pattern).
  quick-login is stateful on the shared PHPSESSID — probe SEQUENTIALLY per role.
- WO settings: read `GET /api/organizations/settings`; write
  `POST /api/organizations/settings/change` (full settings object).
- New WO: `/workorders` → Create → pick Customer (searchable) + Asset (must have assets)
  → Save → lands on `/workorders/{id}/lines`. A WO with 0 lines auto-opens the New Line
  dialog. Canned-line field (`select_line_canned_line`) accepts only existing canned
  lines ("Total Parts: 0" = labor-only). A **Customer Notes popup** often opens on the WO
  detail page — dismiss (Ok/Escape) before acting.
- Key endpoints: complete/send-to-review = `POST /api/work-orders/{id}/simple-complete`;
  tech story = `POST /api/work-orders/lines/change-story`; required data =
  `POST /api/work-orders/change-required-data`; status/sign-off =
  `POST /api/work-orders/change-status`; delete = `POST /api/work-orders/delete`
  (**completed WOs cannot be deleted** — reopen by adding a line first). WO list =
  `GET /api/work-orders` (returns `{pagination, work_orders}`; excludes completed).
- Tools in `/tmp/simple-flow/tools/` (`bridge.mjs`, `wolib.mjs` — now `hydrate(key,capture)`,
  `setapi.mjs`, `perm-probe2.mjs`, `prove-tech.mjs`, `probe-review.mjs`, etc.).

---

# VIU BATCH 3 — 2026-07-08 (built-surface deep pass + sub-classify pending)

Fresh QA cookies re-supplied (task-provided PHPSESSID `21427ed6…`; admin + tech
quick-login both **200**). **Baseline captured to
`/tmp/simple-flow/settings-baseline-4.json`** and **RESTORED + verified** at end
(matched baseline exactly). `requireHours` was toggled ON to test the engine-hours
gate and **restored to OFF**. **Tech role NOT changed** (verified still
Technician). Five throwaway WOs created (d27f4c4b/S2-15758, 76deb20c, 7c1bd7ed,
ac2e78b1, 80325fb4) and **all deleted** (verified 0 of mine remain; completed one
reopened by adding a line before delete). Evidence in `viu-evidence/` (VIU3-*,
VP-*, RCV*-*, CORE-*, PERM09-* PNGs).

> **Proxy gotcha (record):** the API `.mjs` helper scripts MUST be run with
> `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` — without
> them `fetch` goes direct and quick-login returns a spurious **403** (not a real
> auth failure). The Playwright drives also need `BRIDGE=http://127.0.0.1:<port>`
> (rebuild bridge fresh; port rotates).

## Verified this pass (12 moved VIU-Pending → VIU-Verified)

| Case | Layer | Result | Evidence |
|---|---|---|---|
| **SF-VAL-03** | UI | Details step inline **"Engine Hours is a required field"** with `requireHours=ON` + empty field; Continue blocked. | VIU3-02 |
| **SF-COMP-16** | UI | Details step exposes `input_wizard_mileage` + `input_wizard_engine_hours` when both required; **VIN prefilled from asset** (only prompted when absent). | VIU3-01 |
| **SF-COMP-17** | UI | Optional flow reached Success: "Order complete · Work order **S2-15758** · **Invoice total $260.97** · Done / Go To Invoice". | VIU3-04 |
| **SF-COMP-04** | UI | **Go To Invoice** navigated to `/workorders/{id}/finance` (Finance step / invoice-ready draft). | VIU3-05 |
| **SF-TECH-05** | UI | Multi-line gate: **Line 1 of 2 = Next only**; **Line 2 of 2 = Back + Continue**. | VIU3-tech-line1/line2 |
| **SF-TECH-06** | UI | After save + reload, story renders **inline with an Edit link**. | VIU3-tech-inline-saved |
| **SF-TECH-07** | UI | Textarea exposes **`data-test-id="input_tech_story"`** (+ `section_tech_story_gate`, `button_tech_story_next`). | VIU3-tech-line1 |
| **SF-VPART-01** | UI+API | New Part Request sub-form (New Line → custom title → **Save & Add Part**); desc+qty+sell+category → **201 `POST /api/work-orders/part/make-request`**; created part `{part_number:null, vendor_id:null, part_source_type:'vendor', sell:49.99, inventory_part_id:null}`. **DEVIATION: Category is REQUIRED** (not in spec S5-R1). | VP-13/VP-14 |
| **SF-VPART-02** | UI | Empty save → inline **"Description / Quantity / Category is a required field"**. DEVIATION: Category required (Sell Price NOT flagged required). | VP-11 |
| **SF-VPART-03** | UI+API | Source dropdown = **Inventory \| Vendor \| Found** (default Vendor); created vendorless part `part_source_type='vendor'` (never inventory). | VP-* |
| **SF-VPART-05** | API | No-PN part created with **`inventory_part_id:null`** (no inventory item), source vendor. (Part-History side-effect not separately inspected.) | — |
| **SF-PERM-09** | UI | As **Technician (non-SFD)** the New Part Request form **HIDES all financial fields** (Sell Price, Cost, Core Charge, Margin, Vendor, Category) — tech sees only Part Number, Description, Quantity → cannot supply the mandatory sell price for a vendorless part. **FE-only gate** (consistent with BUG-6/7/8). | PERM09-tech-partform |

Re-confirmed (already Verified): **SF-COMP-11/12/14** — optional Receive step = "N
parts waiting to receive" + Cancel · Complete Without Receiving · Receive Parts
(VIU3-03). Wizard = **1 Details → 2 Receive → 3 Success** (Receive step skipped
for a no-parts WO).

## New findings / seeding facts (for classification + next run)

- **Vendorless part sub-form path (CONFIRMED):** WO `/lines` → **New Line** →
  type a **custom "What Are You Doing?" title** (do NOT pick a canned line — a
  canned selection collapses the dialog to Title-only and HIDES "Save & Add Part")
  → **Save & Add Part** opens the **"New Part Request"** dialog. Test-ids:
  `select_part` (Part Number, catalog-searchable), `input_workorder_part_description`,
  `input_workorder_part_quantity`, `select_workorder_part_source` (Inventory/Vendor/
  Found), `select_part_category`, `select_part_vendor`, `input_part_cost`,
  `input_workorder_part_core_charge`, `input_workorder_part_sell_price`,
  `input_workorder_part_margin`; save = `button_workorder_part_save`. Endpoint =
  `POST /api/work-orders/part/make-request`. **Harness tip:** the combobox menu
  overlays the Save button — commit the title with Enter, click `dialog_title`, then
  DOM-click `button_save_add_part` via `page.evaluate`.
- **Canned-line parts are ALL vendorless** (`part_number:null, vendor_id:null,
  is_core:false, core_charge:0, part_source_type:'vendor', status:'requested'`) —
  no canned line seeds a receivable or a core part.
- **Cores NOT seedable via the sub-form:** entering a **Core Charge** creates a part
  with `core_charge>0, total_core_charge>0` but **`is_core:false`**. Genuine cores
  need a catalog/inventory part flagged `is_core` (not creatable via canned lines or
  the manual sub-form). So all **SF-CORE-*** = needs-data.
- **Receivable parts — partial:** vendors (30+, e.g. "Aabridge Beverages") and a
  catalog exist; a **Source=Vendor** part with a free part number saves (201).
  BUT selecting a **catalog Part Number** forces **Source=Inventory** (in-stock →
  picked, not received). Completing the WO (optional flow) then clicking **Receive
  Parts** still **routed back to `/workorders/{id}/lines`, NOT Accept Delivery** —
  the wizard's background PO is not in a deliverable state. So **SF-COMP-13 /
  SF-RCV-02 / SF-RCV-06 / SF-VAL-05/06** = needs-data: a WO PO placed/ordered with a
  pending delivery (Accept Delivery leg not reachable from the optional wizard here).
- **VIN gate (SF-VAL-02) = needs-data:** VIN is **prefilled from the asset**, so the
  non-review wizard never prompts for it; testing the gate needs an **asset with no
  VIN**.

## VIU PENDING (QA) sub-classification (59 remaining after this pass)

Recorded per-case in the Blockers Tracker's new **"VIU sub-bucket"** column
(+ Summary tab count). Totals: **reachable-now 19 · needs-data 39 ·
needs-account 1**.
- **reachable-now (19):** SF-SET-10, SF-COMP-08/10/15/20/23, SF-VPART-04/06,
  SF-VMIS-04/05, SF-PNFIX-01, SF-RCV-01, SF-VEND-01, SF-REV-03/07/12/13,
  SF-VAL-07/08 — admin+tech + normal data; just need another VIU pass.
- **needs-data (39):** all SF-CORE-01..10 (genuine is_core part + receiving),
  SF-COMP-13/19, SF-VPART-07, SF-VMIS-03/06, SF-PNFIX-02..06, SF-RCV-02/06/08/09,
  SF-REV-04/14, SF-VEND-02..05, SF-VAL-02/05/06, SF-QB-03..08 — receiving /
  deliverable-PO / QuickBooks / invoiced-paid / no-VIN-asset states not seedable
  via the app here.
- **needs-account (1):** SF-PERM-10 — Office / Service Manager / Foreman (+ other)
  role accounts for the per-role completion matrix.

## Cases moved this pass

- **VIU-Verified (12):** SF-VAL-03, SF-COMP-16, SF-COMP-17, SF-COMP-04, SF-TECH-05,
  SF-TECH-06, SF-TECH-07, SF-VPART-01, SF-VPART-02, SF-VPART-03, SF-VPART-05,
  SF-PERM-09.
- **New totals:** READY (VIU-Verified) **54** · VIU PENDING (QA) **59** · DEV NOT
  BUILT **25** · MILOS ANSWER **15** · BUG/RULING **6** = 159.

---

# VIU BATCH 4 — 2026-07-08 (SELF-SERVICE pass: role-swap + seeded data)

Fresh cf_clearance re-supplied (sv_sso_session/PHPSESSID unchanged from batch 3);
admin + tech quick-login both **200**. **Baselines captured to
`/tmp/simple-flow/settings-baseline-5.json` (settings) and
`/tmp/simple-flow/tech-role-baseline-5.json` (Tech role)** and **RESTORED +
verified** at end (settings all-match; Tech back to Technician). One throwaway WO
created (`ab521bd4-…`) and **deleted** (reopen-by-line → delete → view 404 =
gone). `requireReview` toggled ON transiently and **restored OFF**.

## NET-NEW capability this pass: self-service TECH role-switching (proven)

- **Endpoint:** `POST /api/staff/{staff_id}/change` — required params
  `first_name, last_name, email, role_id, workplace_id` (also passed
  `job_title, salary_type, salary, billable, clockable` to avoid clobbering).
- **Tech IDs:** user `a7fd0a88-95e5-4b4c-a3b8-7268b57f864f`; **staff
  `6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa`**; current role **Technician**
  `131b5274-4f88-4436-8633-76fb8a05fe7b` (restore target); workplace
  `b3c8c820-f815-4cf1-8938-10956c5ee71a`. **EXACT-USER-MATCH** guard on
  `email==='tech@shopview.com'` before every change (see `restore-tech.mjs`).
- **Roundtrip proven:** tech → **Office** (`163abe0d-…`) → **restore Technician**
  = clean (201 both ways, role labels verified). Safety-net script
  `/tmp/simple-flow/tools/restore-tech.mjs` can restore anytime.
- **Roles instantiated in org:** only **Technician / Office / Admin** (from
  `/api/users`). The other 8 system roles exist only as **templates**
  (`GET /api/role-templates` → 11: administrator, foreman, office, parts_manager,
  parts_technician, sales_representative, senior_service_advisor, service_advisor,
  service_manager, technician, time_clock_user) — not assignable without creating
  a role first. **Role create** `POST /api/roles` needs
  `{organization, name, description, view_mode, fe_permissions:{<all 42 codes>:bool},
  cross_toggles}` — attempted map returned **500** (payload shape needs more work;
  not blocking this pass). Role detail: `GET /api/roles/{id}` → `fe_permissions`
  (array of {id,name,code}), `view_mode`, `cross_toggles`.

## Verified this pass (5 moved VIU-Pending → VIU-Verified)

| Case | Layer | Result | Evidence |
|---|---|---|---|
| **SF-COMP-23** | API | Re-running `simple-complete` on an already-completed WO returns 201 and the part_requests keep the **same `order_id` `4ffdc520…`** — **no duplicate PO**. Idempotent. | WO ab521bd4 |
| **SF-VAL-08** | API | Same: re-complete after a prior attempt → no new order_id (no duplicate POs). | WO ab521bd4 |
| **SF-SET-10** | API | Completed the WO under baseline settings, then flipped `requireReview=ON`; the completed WO **stayed status=Complete** (NOT retroactively moved to Review) → settings changes are **future-only**. `requireReview` restored OFF. | WO ab521bd4 |
| **SF-RCV-01** | UI | `/parts/orders` shows the WO-originated PO (Vendor Missing) with a per-row **Receive** action; PO detail card present (`badge_vendor_missing`, Remaining/Received Parts tabs, part rows). | `P5-01-po-list.png`, `P5-02-po-detail.png` |
| **SF-PERM-10** | API+UI | Per-role completion matrix — **role-swap now self-service** (mechanism proven). Verdicts confirmed for the **3 instantiated roles**: **Admin** (has `workOrdersCreateAndEdit` → Complete **Yes**), **Office** (no `workOrdersCreateAndEdit` → Complete **No**; live role-swap + role-detail), **Technician** (no `workOrdersCreateAndEdit` → **No**; prior). Remaining 8 system roles are not instantiated → verdicts **derived from the SV-8183 atom map** (Complete = has `workOrdersCreateAndEdit`; SF introduces **no new atom**, §9.3), matching §9.2. | `role-swap-test.mjs`, Office role detail |

Re-confirmed (already Verified): **SF-VMIS-01 / SF-VMIS-02** — completing a WO with
2 vendorless vendor parts creates **one shared WO PO** (`order_id 4ffdc520`,
`vendor_id=null`, `part_number=null`, both `waiting_to_receive`), surfaced as
**"Vendor Missing"** on `/parts/orders`.

## Scope note on SF-PERM-10

The `Complete WO` column of §9.2 maps solely to the existing atom
`workOrdersCreateAndEdit` (+ Full View for line-approve); Simple Flow adds no new
atom. The completion gate is **FE-only at the BE** (BUG-6, atom collapse), so the
matrix is realised as FE button visibility, which follows each role's
`fe_permissions` deterministically. A full 11-role **live** sweep would need the
other 8 system roles instantiated (or the `POST /api/roles` 500 resolved to make
purpose-made ZZAUTOTEST custom roles) — noted for a future pass; not required for
the FE-matrix verdict given the 3 live anchors + deterministic atom map.

## Still VIU-Pending after this pass — exact reason (unchanged buckets)

- **reachable-now (15):** SF-COMP-08/10/15/20, SF-VPART-04/06, SF-VMIS-04/05,
  SF-PNFIX-01, SF-VEND-01, SF-REV-03/07/12/13, SF-VAL-07 — admin+tech + normal
  data; not driven this pass (budget). A live vendor-missing PO (from WO ab521bd4)
  was available but the **Assign-Vendor dropdown / inline PN-edit controls**
  (SF-VMIS-04/05, SF-VEND-01) sit behind the PO-detail `more_vert` menu, not
  drilled in budget.
- **needs-data (39):** cores (SF-CORE-01..10 — `is_core` not seedable via canned
  lines or the manual sub-form; needs a catalog/inventory part flagged `is_core`,
  and the catalog/inventory **create** endpoint was not found this pass —
  `/api/catalog-inventory`, `/api/inventory`, `/api/catalog` all 404),
  deliverable/receivable-PO cases (SF-COMP-13/19, SF-RCV-02/06, SF-VAL-05/06,
  SF-REV-04, SF-VPART-07 — optional-flow completion yields a **vendor-missing**
  WO PO that is NOT in a deliverable state; Accept Delivery leg unreachable),
  no-VIN asset (SF-VAL-02), multi-PO merge / invoiced-paid (SF-VEND-02..05,
  SF-VMIS-03/06), and QuickBooks (SF-QB-03..08).
- **needs-account: 0** — resolved; role-switching is now self-service.

## Reusable facts (for next run)

- Role-swap endpoint + IDs (above); `restore-tech.mjs` safety-net.
- WO create: `POST /api/work-orders/create` needs `company_id` (+ more; 500 with
  company_id only) — the **UI create** (`mkwo.mjs`: Create → pick customer w/ assets
  e.g. "Aagate" → pick asset → Save) is the reliable path.
- Line with vendor parts: `POST /api/work-orders/{wo}/lines/create-from-canned-line
  {another:false,canned_line_id,work_order_id,status:'authorized'}` — canned
  **"Replace - Brake pot"** = 2 (vendorless) parts.
- Idempotency check = inspect part_requests `order_id`s before/after a 2nd
  `simple-complete` (`idem-set10.mjs`). Future-only check = flip a setting after a
  WO is Complete and re-read WO status.
- New tools this pass: `cap-baseline5.mjs`, `restore-tech.mjs`, `role-swap-test.mjs`,
  `probe-role-detail.mjs`, `probe-staffchange.mjs`, `idem-set10.mjs`, `po-ui.mjs`,
  `mkwo.mjs`, `del-reopen.mjs`, `cleanup5.mjs`, `final-verify.mjs`.

## Cases moved this pass

- **VIU-Verified (5):** SF-COMP-23, SF-VAL-08, SF-SET-10, SF-RCV-01, SF-PERM-10.
- **New totals:** READY (VIU-Verified) **59** · VIU PENDING (QA) **54**
  (reachable-now 15 · needs-data 39 · needs-account 0) · DEV NOT BUILT **25** ·
  MILOS ANSWER **15** · BUG/RULING **6** = 159.
- **No new bugs** (BUG-5..8 re-confirmed; no EXPECTED changes → TestRail import not
  regenerated).
