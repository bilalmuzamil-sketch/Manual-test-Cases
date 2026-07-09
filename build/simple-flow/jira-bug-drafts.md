# Simple Flow — Jira Bug Drafts (ready to file)

> **STATUS: NOT YET FILED — Atlassian MCP unavailable in this environment (no
> Atlassian/Jira create-issue tool surfaced at run time; only GitHub tools were
> available).** File these via your chat app where Atlassian IS connected.
>
> **THIS IS THE CURRENT RECONCILED BUG SET (2026-07-09, post-Milos-Round-2)** — it
> supersedes the earlier 7-draft version. Two tickets were CLOSED after Milos's
> Round-2 answers (see "Recently closed" below); the set is now **5 tickets**.
>
> Source of truth: `build/simple-flow/bugs-log.md`, `milos-round2-mapping.md`,
> `finding-reclassification.md`, `contradiction-resolution.md`,
> `spec-change-diff.md`, `viu-findings.md`.

## Recently CLOSED — do NOT file (Milos Round-2, 2026-07-09)

- **BUG-3 (Mark-Reviewed review-note field)** — **CLOSED / NOT A BUG.** Milos
  descoped the optional review note; v1 is VIN-only *by design* ("it is a design
  issue which I removed from the design yesterday"). Under last-update-wins this
  supersedes the 2026-07-08 design bundle that had restored the note. SF-REV-10
  expected updated to VIN-only (matches live). Was TICKET 1.
- **BUG-9 / GAP-A (vendorless "New Part Request" Category-required / Sell optional)**
  — **CLOSED / INTENDED for v1.** Milos ruled the current build behaviour is
  expected: **Category IS required** and **Sell Price is NOT enforced**. Supersedes
  V2.4 S5-R1. SF-VPART-01/02 expected updated accordingly. Was TICKET 5.
  *(Follow-up, NOT a bug: whether a See-Financial-Data permission gate still applies
  to vendorless part-add is an open product item — its "sell is mandatory" premise
  was overturned by this ruling.)*

## Still deliberately NOT filed (from earlier reconciliation)

- **BUG-1** (No-PO path retained per V2.4 = build-lag note only).
- **BUG-2** (Save-always-enabled = nice-to-have).
- **BUG-4** and **BUG-10** (both EXPECTED under the Simple Flow shortcut rule — a
  skipped step that still reaches the same end state with no error/corruption).

## Common fields (apply to all 5 tickets)

- **Project:** ShopView — SV
- **Issue type:** Bug
- **Product Area (REQUIRED, `customfield_10153`):** Work Orders (id `10120`)
- **Parent (epic):** SV-7301 (Simple Flow)
- **Labels:** `simple-flow`, `qa`, `testrail`
- **cloudId:** `19fdd96d-a135-46c4-83e7-d2cc218a4e63`
- **QA env:** app `https://sv7301.qa.shopview.com` · API `https://sv7301api.qa.shopview.com`

---

## TICKET 1 (from BUG-5) — Priority: High

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

## TICKET 2 (from BUG-6 + BUG-7) — Priority: Medium

> **Milos Round-2 Q5 ruling (2026-07-09):** for v1 the permission cases **PASS on UI
> gating** (the FE hides the button for the unauthorized role); this backend
> non-enforcement is a **known API gap kept OPEN for a future fix**. Results are
> recorded as "UI pass / API fail". This ticket IS that fix ticket.

**Summary:** Simple Mode: work-order completion & review sign-off permissions enforced only in the UI, bypassable via API

**Description:**

*Summary of issue*
Role-gating of work-order completion and of review sign-off is only a front-end
display gate — the backend does not enforce it, so a role without the permission
(e.g. Technician) can complete a WO / sign off a review via the API. Per the Milos
Round-2 Q5 ruling, UI gating is accepted as the v1 pass criterion; this ticket
tracks the backend enforcement gap to eventually fix.

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

## TICKET 3 (from BUG-8) — Priority: Medium

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

## TICKET 4 (from BUG-11) — Priority: Low (downgraded from High)

> **Downgraded 2026-07-09 (RE-VIU BATCH 7):** the 500 is confined to the LEGACY
> single-PO Accept-Delivery path. The new Bulk Receive pipeline receives the same
> WO PO successfully (`POST /api/orders/receive-requested-parts` → 200), so a working
> path exists and the WO-PO receive round-trip is achievable. Still a valid bug for
> the legacy Accept-Delivery surface, but lower urgency.

**Summary:** Simple Mode: WO-PO receive returns HTTP 500 on the LEGACY Accept-Delivery path (the new Bulk Receive pipeline works — receive-requested-parts returns 200)

**Description:**

*Summary of issue*
A work-order-originated purchase order cannot be received via the LEGACY single-PO
Accept Delivery surface — that receive call fails server-side with HTTP 500. A non-WO
(inventory) PO receives fine on the same surface, so this is WO-PO-specific. **The new
Bulk Receive pipeline is unaffected** — the same WO PO receives successfully via Bulk
Receive (`POST /api/orders/receive-requested-parts` → 200, creating a Delivery /
Vendor Bill), so a working path exists.

*Simplified Steps to Reproduce*
1. Create a work order, add a part via New Part Request → Source = Vendor, pick a
   real vendor (e.g. Aabridge Beverages), type a free-text Part Number (optionally
   a cost).
2. Set the tech story + mileage, then complete the WO — this places a deliverable
   "ordered" WO PO (`vendorMissing:false`).
3. Open the shared **legacy** Accept Delivery page `/accept-delivery/{orderId}`.
4. Enter an invoice number and a delivered quantity, then click Receive.

*Expected*
The WO PO receives successfully (HTTP 201) and the delivery is recorded, the same
way a non-WO inventory PO receives on this surface (and the same way the Bulk Receive
page already receives this WO PO). Story 10 behaviour — receiving a free-text /
non-catalog part number should create/link the catalog + inventory part.

*Actual*
On the legacy Accept-Delivery path, Receive returns HTTP 500 ("An error occurred…
please try again", with a `requestId`). Reproduced via the UI Receive button and via
`POST /api/inventory/orders/accept` with the exact browser payload; on both a
$0-cost and a real-cost ($25) WO part, and on both full and partial delivery
quantities. The same tool receives a non-WO inventory PO fine (201), and the **Bulk
Receive path receives the same WO PO fine (200)**. Likely cause: the WO part uses a
free-text / non-catalog part number (`manufacturer_id:null`, no linked catalog/
inventory item); receiving it must create/link a catalog + inventory part and that
creation fails on the legacy `accept` endpoint only.
Evidence: `viu-evidence/R7-01-wo-po-accept-delivery.png`, `R7-04-ready.png`,
`R7-06-received-full.png`.

*Affected cases*
SF-COMP-13, SF-COMP-19, SF-VAL-05, SF-VAL-06, SF-PNFIX-02, SF-PNFIX-03,
SF-PNFIX-04, SF-PNFIX-05, SF-PNFIX-06, SF-RCV-08, SF-VPART-07, SF-REV-04,
SF-REV-14, SF-CORE-03, SF-CORE-04, SF-CORE-05, SF-CORE-07
(NB: these are now largely testable via the Bulk Receive path; this ticket only
blocks the legacy single-PO Accept-Delivery surface.)

*Related*
- relates to SV-7301 (Simple Flow) / Story 10 (receive creates/links part) / Story 8
  (Bulk Receive — the working path)

---

## TICKET 5 (from GAP-B) — Priority: Medium

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
</content>
</invoke>
