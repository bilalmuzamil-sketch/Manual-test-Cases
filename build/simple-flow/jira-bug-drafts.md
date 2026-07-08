# Simple Flow — Jira Bug Drafts (ready to file)

> **STATUS: NOT YET FILED — Atlassian MCP unavailable (connector not surfaced at run time).**
> These 3 drafts are ready to paste into Jira the moment the Atlassian connector
> is reconnected. Source of truth: `build/simple-flow/bugs-log.md` (BUG-5..BUG-8)
> and `build/simple-flow/viu-findings.md`.

## Common fields (apply to all 3)

- **Project:** ShopView — SV (id `10001`)
- **Issue type:** Bug (id `10008`)
- **Product Area (REQUIRED, `customfield_10153`):** Work Orders (id `10120`)
- **Parent (epic):** SV-7301 (Simple Flow)
- **Labels:** `simple-flow`, `testrail`, `qa`
- **cloudId:** `19fdd96d-a135-46c4-83e7-d2cc218a4e63`
- **QA env:** app `https://sv7301.qa.shopview.com` · API `https://sv7301api.qa.shopview.com`

---

## TICKET 1 (from BUG-5) — Priority: High

**Summary:** Simple Mode: reviewer can sign off their own work order (reviewer ≠ completer not enforced)

**Description:**

*Summary of issue*
The one net-new Simple-Flow permission rule — reviewer must not be the same person
who completed / sent the work order to review — is not implemented. A user can
sign off (Mark Reviewed) their own completed work order.

*Simplified Steps to Reproduce*
1. Enable 'Require Review Before Completion'.
2. As one user, complete a work order and send it to review.
3. As the SAME user, open it and click Mark Reviewed.

*Expected*
The user who completed / sent the WO to review must NOT be able to Mark Reviewed
it — a different reviewer is required (reviewer ≠ completer).

*Actual*
The same user can Mark Reviewed their own WO; the rule is not implemented. Observed
live: admin sent WO S2-15752 to review (`status: ready_for_review`) then the same
admin confirmed the review with no block — WO went Review → Complete.
Evidence: `viu-evidence/REV-admin-completer-markreviewed.png`.

*Related*
- Parent story: SV-7870 (Require Review)
- relates to SV-8183 (backend-enforcement claim)

---

## TICKET 2 (from BUG-6 + BUG-7) — Priority: Medium

**Summary:** Simple Mode: work-order completion & review sign-off permissions enforced only in the UI, bypassable via API

**Description:**

*Summary of issue*
Role-gating of work-order completion and of review sign-off is only a front-end
display gate — the backend does not enforce it, so it is bypassable via the API.

*Simplified Steps to Reproduce*
1. Sign in as a role WITHOUT the completion permission (e.g. Technician).
2. The Complete button is hidden in the UI.
3. Call the completion / change-status endpoint directly for a valid WO.

*Expected*
The backend rejects the action (permission enforced server-side), per SV-8183's
statement that the backend enforces these atoms.

*Actual*
The backend allows it. A Technician (no `workOrdersCreateAndEdit`, Tech View mode)
completed a WO via `POST /api/work-orders/{id}/simple-complete` (→ 201,
`status:"complete"`) and signed off a review via
`POST /api/work-orders/change-status {status:"complete"}` (→ 201). The permission
is only a front-end display gate. Likely cause: the WO Create & Edit atom-collapse
(SV-7864) — `workOrderLinesCreateAndEdit` collapses to
`ROLE_WORK_ORDER::VIEW+CREATE_AND_EDIT` server-side, so any WO C&E role can act on
the WO. (By contrast the settings atom IS backend-enforced: tech
`POST /api/organizations/settings/change` → 403.) Please confirm whether this is
intended (atom-collapse per SV-7864) or a gap vs SV-8183.

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
1. With 'Require Mileage' (and/or VIN, engine hours) ON.
2. The completion wizard blocks completion until they're filled.
3. Call the completion endpoint directly without those fields.

*Expected*
The backend also rejects completion when required fields are missing (consistent
with the tech-story and line-approval gates, which ARE enforced server-side).

*Actual*
The backend completes the WO without them. With `requireMileage=true` /
`requireVehicleIdentifier=true`, `POST /api/work-orders/{id}/simple-complete {}`
returned 201 and drove the WO to Complete with mileage still empty (only the
backend-checked blockers — tech story, line approval — were enforced). The wizard
UI blocks Continue with "Mileage is a required field"
(`viu-evidence/VIU2-02-mileage-gate.png`). So these gates are UI-only.

*Related*
- relates to SV-8183 (backend-enforcement claim)
