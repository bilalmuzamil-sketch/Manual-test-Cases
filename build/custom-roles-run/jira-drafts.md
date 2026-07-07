# Custom Roles — Jira Bug Ticket DRAFTS (for user confirmation)

> **STATUS: DRAFT ONLY. Nothing filed in Jira. Nothing written to TestRail.**
> Drafted from two Failed TestRail tests in run **323** (§3646 DVI Per-Role
> Access Checks). Do not create until the user confirms.

## Resolved Jira targets (verified via Atlassian MCP)

- **Cloud / site:** shopview.atlassian.net (`cloudId 19fdd96d-a135-46c4-83e7-d2cc218a4e63`)
- **Project:** ShopView — key **SV** (id 10001)
- **Issue type:** **Bug** (id 10008)
- **Required create fields (SV Bug):** `project`, `summary`, **`customfield_10153` "Product Area" (REQUIRED)** → suggest **Work Orders** (id 10120; no "Inspections"/"DVI" area exists). Everything else optional.
- **Epic to link:** **SV-7388 "Custom Roles and Permissions"** (id 53083, In Progress) — set as `parent` (this is a next-gen/simplified project, so Epic link = parent).
- **Spec story (source of the expected behavior):** **SV-8095** "Permission: Digital Inspections — enforcement mapping to WO Lines CRUD + Settings › Service" (Story, status TESTING QA, child of SV-7388). Also relevant: **SV-7509** "Permission: Work Order Lines CRUD"; **SV-7985** (delete/reopen must require WOL Delete — "Ready to Fix").
- **Assignee for confirmation — "Ayesha":** exactly **one** match, unambiguous →
  **Ayesha Khan**, `accountId 712020:67f76d27-9119-4cb6-93c6-dbf94204abba`.
  Jira mention markup to use in the real ticket: `[~accountid:712020:67f76d27-9119-4cb6-93c6-dbf94204abba]`.
- **Priority (suggested):** Medium (id 3) — matches SV-8095 and both test cases' priority.
- **Labels (suggested):** `custom-roles`, `testrail`, `digital-inspections`.

## Spec reference (the expected behavior both tickets rely on)

SV-8095 **Acceptance Criterion 3B**: *"Deleting a completed inspection, and
reopening a completed inspection are each allowed **if the user has WO Lines:
Delete**."* SV-8095's per-role matrix lists both **Technician** and **Parts
Manager** as **WO Lines = View/Edit (no Delete)** → **Del/Reopen = No**.
Therefore the remove (bin) control on a **completed** inspection must be
**hidden** for both roles. (WO Lines CRUD atom defined in SV-7509: Delete = remove
lines; Delete requires Edit.)

## Bug-vs-expected pre-assessment (important — for Ayesha)

Both failures are the **same defect for two different roles**: the front end
renders the inspection remove/bin control based on **WO Lines: Create & Edit
alone**, with no "completed-inspection ⇒ require WO Lines: Delete" distinction
(TestRail result cites `InspectionLineRow.vue:54` and `canRemoveInspection` in
`WorkOrderLineRow.vue:561`).

- **Likely a GENUINE BUG** against SV-8095 AC3B: this is a front-end **display
  gate**, and per our enforcement model (CLAUDE.md "Key findings") granular
  Delete permissions are exactly the FE-gated behaviors these UI tests are meant
  to verify. Technician and Parts Manager both lack WOL Delete, so the bin should
  not appear on a completed inspection.
- **BUT could be EXPECTED / not-yet-in-scope:** the run-323 note says it "fails
  by design — AC3B not implemented in FE," and the pending fix (SV-7985) is still
  "Ready to Fix." So the current bin-on-Create&Edit may be intended behavior
  until AC3B ships. This is why each ticket asks **Ayesha to confirm** and mark
  **obsolete** if it's expected per current scope.

---

# TICKET 1 — Technician (from TestRail test 1561707 / case C27659)

- **Project:** SV (ShopView) · **Issue type:** Bug · **Priority:** Medium
- **Product Area (required):** Work Orders
- **Epic link (parent):** SV-7388 · **Relates to:** SV-8095, SV-7985 · **Also refs:** SV-7509
- **Labels:** custom-roles, testrail, digital-inspections
- **Source TestRail test:** https://shopview.testrail.io/index.php?/tests/view/1561707 (run 323, case C27659, result: Failed)

**Summary:**
Technician can remove a COMPLETED inspection without WO Lines: Delete — bin control shown on Create & Edit alone (SV-8095 AC3B)

**Description:**

**Simplified Steps to Reproduce**
1. Log in as a **Technician** (WO Lines = View/Edit, no Delete).
2. Open a work order line that has a **completed** inspection (PDF report generated).
3. Look at the inspection row for the remove/bin (delete) icon.

**Expected Result**
The remove (bin) control is **NOT** available. Deleting a completed inspection
requires **Work Order Lines: Delete**, which a Technician does not have — per
**SV-8095 AC3B** and its per-role matrix (Technician: WO Lines V/E → Del/Reopen = No).

**Actual Result**
The remove (bin) control **is shown** and the Technician can remove the completed
inspection. The front end gates the control on **WO Lines: Create & Edit** only,
with no completed-status / WO Lines: Delete distinction
(`app/src/components/ts/inspections/InspectionLineRow.vue:54`; `canRemoveInspection`
in `WorkOrderLineRow.vue:561`).

**Spec Reference**
SV-8095 AC3B — "Deleting a completed inspection … allowed if the user has WO Lines:
Delete." Per-role matrix: Technician = WO Lines V/E (no Delete) ⇒ Del/Reopen = No.
Supporting: SV-7509 (WO Lines CRUD atom); SV-7985 (delete/reopen must require WOL Delete).

@Ayesha (accountId 712020:67f76d27-9119-4cb6-93c6-dbf94204abba) — please confirm
whether this is expected behavior per the spec; if it is expected, we'll mark this obsolete.

---

# TICKET 2 — Parts Manager (from TestRail test 1561719 / case C27672)

- **Project:** SV (ShopView) · **Issue type:** Bug · **Priority:** Medium
- **Product Area (required):** Work Orders
- **Epic link (parent):** SV-7388 · **Relates to:** SV-8095, SV-7985 · **Also refs:** SV-7509
- **Labels:** custom-roles, testrail, digital-inspections
- **Source TestRail test:** https://shopview.testrail.io/index.php?/tests/view/1561719 (run 323, case C27672, section 3653 "Parts Manager", result: Failed)

**Summary:**
Parts Manager can remove a COMPLETED inspection without WO Lines: Delete — bin control shown on Create & Edit alone (SV-8095 AC3B)

**Description:**

**Simplified Steps to Reproduce**
1. Log in as a **Parts Manager** (WO Lines = View/Edit, no Delete).
2. Open a work order line that has a **completed** inspection (PDF report generated).
3. Look at the inspection row for the remove/bin (delete) icon.

**Expected Result**
The remove (bin) control is **NOT** available. Deleting a completed inspection
requires **Work Order Lines: Delete**, which a Parts Manager does not have — per
**SV-8095 AC3B** and its per-role matrix (Parts Manager: WO Lines V/E → Del/Reopen = No).

**Actual Result**
The remove (bin) control **is shown** and the Parts Manager can remove the
completed inspection. The front end gates the control on **WO Lines: Create &
Edit** only, with no completed-status / WO Lines: Delete distinction
(`app/src/components/ts/inspections/InspectionLineRow.vue:54`; `canRemoveInspection`
in `WorkOrderLineRow.vue:561`).

**Spec Reference**
SV-8095 AC3B — "Deleting a completed inspection … allowed if the user has WO Lines:
Delete." Per-role matrix: Parts Manager = WO Lines V/E (no Delete) ⇒ Del/Reopen = No.
Supporting: SV-7509 (WO Lines CRUD atom); SV-7985 (delete/reopen must require WOL Delete).

@Ayesha (accountId 712020:67f76d27-9119-4cb6-93c6-dbf94204abba) — please confirm
whether this is expected behavior per the spec; if it is expected, we'll mark this obsolete.

---

## Note for the user

Both bugs share one root cause and could reasonably be filed as **one ticket**
covering "any role without WO Lines: Delete" (Technician, Parts Manager, Parts
Tech, Office, etc.). They are drafted as two here because there are two distinct
failed tests. Say the word if you'd prefer a single consolidated ticket.

---

## CREATED

User approved a single consolidated ticket. Filed **2026-07-07**:

- **Issue key:** SV-8193
- **Browse URL:** https://shopview.atlassian.net/browse/SV-8193
- **Type/Project:** Bug · SV (ShopView) · **Parent epic:** SV-7388
- **Product Area (required):** Work Orders (customfield_10153 = id 10120)
- **Priority:** Medium · **Labels:** custom-roles, testrail, digital-inspections
- **Links:** relates to SV-8095, relates to SV-7985
- **Ayesha Khan** (accountId 712020:67f76d27-9119-4cb6-93c6-dbf94204abba)
  @mentioned in both the description and a comment (comment mention resolved to
  her accountId → notified) with the confirmation/obsolete request.
- Covers both failed TestRail tests: 1561707 (C27659, Technician) and 1561719
  (C27672, Parts Manager).
