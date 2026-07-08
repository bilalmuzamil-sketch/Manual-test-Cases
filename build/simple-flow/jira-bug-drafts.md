# Simple Flow — Jira Bug Drafts (ready to file)

> **STATUS: NOT YET FILED — Atlassian MCP unavailable in this environment (no
> Atlassian/Jira create-issue tool surfaced at run time; only GitHub tools were
> available).** File these via your chat app where Atlassian IS connected.
>
> **THIS IS THE CURRENT RECONCILED BUG SET (2026-07-08)** — it supersedes the
> earlier 3-draft version. The set changed after the V2.4 spec, Milos answers, and
> the shortcut-principle reclassification work.
>
> Source of truth: `build/simple-flow/bugs-log.md`,
> `finding-reclassification.md`, `contradiction-resolution.md`,
> `spec-change-diff.md`, `viu-findings.md`.
>
> **Deliberately NOT filed** (per reconciliation): **BUG-1** (No-PO path retained
> per V2.4 = build-lag note only), **BUG-2** (Save-always-enabled = nice-to-have),
> **BUG-4** and **BUG-10** (both EXPECTED under the Simple Flow shortcut rule — a
> skipped step that still reaches the same end state with no error/corruption).

## Common fields (apply to all 7 tickets)

- **Project:** ShopView — SV
- **Issue type:** Bug
- **Product Area (REQUIRED, `customfield_10153`):** Work Orders (id `10120`)
- **Parent (epic):** SV-7301 (Simple Flow)
- **Labels:** `simple-flow`, `qa`, `testrail`
- **cloudId:** `19fdd96d-a135-46c4-83e7-d2cc218a4e63`
- **QA env:** app `https://sv7301.qa.shopview.com` · API `https://sv7301api.qa.shopview.com`

---

## TICKET 1 (from BUG-3) — Priority: Medium

**Summary:** Simple Mode: Mark-Reviewed dialog is missing the optional review-note field

**Description:**

*Summary of issue*
The "Mark work order reviewed" confirmation dialog does not include the optional
review-note field. The 2026-07-08 design bundle shows the dialog is meant to carry
a VIN / Serial # (required) plus an optional review note; the live build exposes
only the VIN field, so this is a build gap.

*Simplified Steps to Reproduce*
1. Enable 'Require Review Before Completion' in Work Order settings.
2. Complete a work order so it moves to the "ready for review" state.
3. Open the work order and click Mark Reviewed to open the confirm dialog.
4. Look for a field to add an optional review note.

*Expected*
The Mark-Reviewed dialog shows VIN / Serial # (required) and an optional
review-note field (`input_review_note`); a note can be typed and saved with the
sign-off. (Per the 2026-07-08 design bundle "Mark work order reviewed" dialog and
Story 16 R7/R10; last-update-wins makes the 07-08 design authoritative.)

*Actual*
The dialog exposes only the VIN field — there is no optional review-note field, so
no note can be captured at sign-off.

*Affected cases*
SF-REV-10

*Related*
- Parent epic: SV-7301 (Simple Flow)

---

## TICKET 2 (from BUG-5) — Priority: High

**Summary:** Simple Mode: reviewer can sign off their own work order (reviewer ≠ completer not enforced)

**Description:**

*Summary of issue*
The one net-new Simple-Flow permission rule — the reviewer must not be the same
person who completed / sent the work order to review — is not implemented. A user
can sign off (Mark Reviewed) their own completed work order.

*Simplified Steps to Reproduce*
1. Enable 'Require Review Before Completion' in Work Order settings.
2. As one user, complete a work order and send it to review.
3. As the SAME user, open that work order and click Mark Reviewed, then confirm.

*Expected*
The user who completed / sent the WO to review is barred from signing it off — a
different reviewer is required (reviewer ≠ completer, per SV-8183's
reviewer≠completer rule). The `sentToReviewBy` / `completedBy` stamp should block
the same user.

*Actual*
No block occurs. Observed live: admin sent WO S2-15752 to review
(`status: ready_for_review`) then the same admin confirmed the review — the WO went
Review → Complete with no restriction.
Evidence: `viu-evidence/REV-admin-completer-markreviewed.png`.

*Affected cases*
SF-PERM-08 (also touches SF-PERM-04, SF-PERM-07, SF-REV-09)

*Related*
- relates to SV-8183 (reviewer≠completer / backend-enforcement claim)

---

## TICKET 3 (from BUG-6 + BUG-7) — Priority: Medium

**Summary:** Simple Mode: work-order completion & review sign-off permissions enforced only in the UI, bypassable via API

**Description:**

*Summary of issue*
Role-gating of work-order completion and of review sign-off is only a front-end
display gate — the backend does not enforce it, so a role without the permission
(e.g. Technician) can complete a WO / sign off a review via the API.

*Simplified Steps to Reproduce*
1. Sign in as a role WITHOUT the completion permission (e.g. Technician; no
   `workOrdersCreateAndEdit`, Tech View mode).
2. Confirm the Complete / Mark-Reviewed buttons are hidden in the UI.
3. Call the completion / change-status endpoint directly for a valid work order.

*Expected*
The backend rejects the action with 403 (permission enforced server-side), per
SV-8183's statement that the backend enforces these atoms.

*Actual*
The backend allows it (201). A Technician completed a WO via
`POST /api/work-orders/{id}/simple-complete` (→ 201, `status:"complete"`) and
signed off a review via `POST /api/work-orders/change-status {status:"complete"}`
(→ 201). The permission is only a front-end display gate. Likely cause: the WO
Create & Edit atom-collapse (SV-7864) — `workOrderLinesCreateAndEdit` collapses to
`ROLE_WORK_ORDER::VIEW+CREATE_AND_EDIT` server-side, so any WO C&E role can act on
the WO. (By contrast the settings atom IS backend-enforced: tech
`POST /api/organizations/settings/change` → 403.) Please confirm whether this is
intended (atom-collapse per SV-7864) or a gap vs SV-8183.

*Affected cases*
SF-PERM-06 (also touches SF-PERM-02, SF-PERM-07, SF-REV-09)

*Related*
- relates to SV-8183 (backend-enforcement claim)
- relates to SV-7864 (atom-collapse)

---

## TICKET 4 (from BUG-8) — Priority: Medium

**Summary:** Simple Mode: required completion fields (mileage / VIN / engine hours) enforced only in the UI wizard, not the backend

**Description:**

*Summary of issue*
The required-vehicle-field gates at completion (mileage / VIN / engine hours) are
enforced only by the completion wizard (front-end), not by the backend completion
endpoint.

*Simplified Steps to Reproduce*
1. Turn ON 'Require Mileage' (and/or VIN, engine hours) in Work Order settings.
2. Confirm the completion wizard blocks completion until those fields are filled.
3. Call the completion endpoint directly without those fields.

*Expected*
The backend also rejects completion when a required vehicle field is missing —
consistent with the tech-story and line-approval gates, which ARE enforced
server-side (per §4 / SV-8183 "backend enforces").

*Actual*
The backend completes the WO without them. With `requireMileage=true` /
`requireVehicleIdentifier=true`, `POST /api/work-orders/{id}/simple-complete {}`
returned 201 and drove the WO to Complete with mileage still empty (only the
backend-checked blockers — tech story, line approval — were enforced). The wizard
UI blocks Continue with "Mileage is a required field"
(`viu-evidence/VIU2-02-mileage-gate.png`). So these gates are UI-only.

*Affected cases*
SF-VAL-01, SF-VAL-02, SF-VAL-03, SF-COMP-05 (also SF-COMP-16, SF-REV-03)

*Related*
- relates to SV-8183 (backend-enforcement claim)
- relates to SV-7864 (atom-collapse)

---

## TICKET 5 (from BUG-9 / GAP-A) — Priority: Medium

**Summary:** Simple Mode: vendorless "New Part Request" requires a Category (not in spec) and does not enforce Sell Price

**Description:**

*Summary of issue*
The vendorless "New Part Request" sub-form requires a Category, which is not in the
spec, and does NOT enforce Sell Price. V2.4 S5-R1 makes Sell Price the only
mandatory financial field (validated inline at save), so the build is wrong vs V2.4.

*Simplified Steps to Reproduce*
1. Open a work order → /lines → New Line → give it a custom title.
2. Click Save & Add Part → the "New Part Request" sub-form opens.
3. Click Save with fields empty and read the inline errors.
4. Fill only Description + Quantity + Sell Price (no Category) and click Save.

*Expected*
Per V2.4 S5-R1: Sell Price is the only mandatory financial field, validated inline
at save; a part is requestable with description + quantity + sell price and no
Category gate. A sell-only part is orderable from the line.

*Actual*
Empty-save flags "Description is a required field", "Quantity is a required field",
and "Category is a required field" — Category blocks the save even though it is not
in the spec. Sell Price is NOT flagged required (contrary to S5-R1). Adding a
Category → 201 `POST /api/work-orders/part/make-request`.
Evidence: `viu-evidence/VP-11-validation-empty.png`, `VP-13`, `VP-14`.

*Affected cases*
SF-VPART-01, SF-VPART-02 (see also SF-PERM-09 — for non-SFD roles the form
correctly hides all financial fields, an FE gate, recorded for context)

*Related*
- relates to SV-7301 (Simple Flow) / V2.4 S5-R1

---

## TICKET 6 (from BUG-11) — Priority: High

**Summary:** Simple Mode: receiving a work-order-originated PO returns HTTP 500 (blocks the receive round-trip)

**Description:**

*Summary of issue*
A work-order-originated purchase order cannot be received via Accept Delivery — the
receive call fails server-side with HTTP 500. A non-WO (inventory) PO receives fine,
so this is WO-PO-specific and blocks the entire WO receive round-trip.

*Simplified Steps to Reproduce*
1. Create a work order, add a part via New Part Request → Source = Vendor, pick a
   real vendor (e.g. Aabridge Beverages), type a free-text Part Number (optionally
   a cost).
2. Set the tech story + mileage, then complete the WO — this places a deliverable
   "ordered" WO PO (`vendorMissing:false`).
3. Open the shared Accept Delivery page `/accept-delivery/{orderId}`.
4. Enter an invoice number and a delivered quantity, then click Receive.

*Expected*
The WO PO receives successfully (HTTP 201) and the delivery is recorded, the same
way a non-WO inventory PO receives (Story 10 behaviour — receiving a free-text /
non-catalog part number should create/link the catalog + inventory part).

*Actual*
Receive returns HTTP 500 ("An error occurred… please try again", with a
`requestId`). Reproduced via the UI Receive button and via
`POST /api/inventory/orders/accept` with the exact browser payload; on both a
$0-cost and a real-cost ($25) WO part, and on both full and partial delivery
quantities. The same tool receives a non-WO inventory PO fine (201). Likely cause:
the WO part uses a free-text / non-catalog part number (`manufacturer_id:null`, no
linked catalog/inventory item); receiving it must create/link a catalog + inventory
part and that creation fails.
Evidence: `viu-evidence/R7-01-wo-po-accept-delivery.png`, `R7-04-ready.png`,
`R7-06-received-full.png`.

*Affected cases*
SF-COMP-13, SF-COMP-19, SF-VAL-05, SF-VAL-06, SF-PNFIX-02, SF-PNFIX-03,
SF-PNFIX-04, SF-PNFIX-05, SF-PNFIX-06, SF-RCV-08, SF-VPART-07, SF-REV-04,
SF-REV-14, SF-CORE-03, SF-CORE-04, SF-CORE-05, SF-CORE-07

*Related*
- relates to SV-7301 (Simple Flow) / Story 10 (receive creates/links part)

---

## TICKET 7 (from GAP-B) — Priority: Medium

**Summary:** Simple Mode: wrong first-use organization settings defaults (Auto-approve / Vendor-invoice)

**Description:**

*Summary of issue*
The first-use organization defaults for Simple Mode are wrong. The build ships
Auto-approve Lines ON and Vendor Invoice Optional, but the confirmed spec defaults
are Auto-approve Lines OFF and Vendor Invoice REQUIRED.

*Simplified Steps to Reproduce*
1. On a fresh org (or first use of Simple Mode), open Work Order settings.
2. Check the default state of 'Auto-approve Lines' and 'Vendor Invoice'.
3. Compare against `GET /api/organizations/settings`.

*Expected*
Per §4 / S1 defaults (confirmed Milos Q3): first-use defaults are Auto-approve
Lines OFF, Create Purchase Orders ON, Vendor Invoice REQUIRED.

*Actual*
First-use shows Auto-approve Lines ON and Vendor Invoice Optional
(`autoApproveLines:true`, `requireVendorInvoiceNumber:false`).

*Affected cases*
SF-SET-08

*Related*
- relates to SV-7301 (Simple Flow) / §4 first-use defaults (Milos Q3)
