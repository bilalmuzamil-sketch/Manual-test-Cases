# View Mode (Tech vs Full) — Custom Roles & Permissions Test Cases

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies the View Mode setting (`viewMode` = `tech` | `full`, SV-7508), which controls UI complexity as a UX simplification and **not** a security boundary. Confirms each Tech View restriction versus Full View, and that View Mode is independent from the "See Financial Data" toggle. Area code **VIEWMODE** (IDs CR-VIEWMODE-001 …).

## Prerequisites
- Access to a ShopView tenant where you can create and edit **Custom Roles** and set their **View Mode** (Tech or Full).
- Test user account(s) you can assign custom roles to and log in as. Remember: **any role change forces the user to log out**; the test user must log back in for changes to apply.
- Two custom roles to compare: one set to **Tech View** and one set to **Full View**, otherwise similar CRUD permissions (WO View + Edit so lines and workflow controls are reachable).
- A Work Order with lines, including a line whose **authorization is still pending** and a line/WO that has been **approved**, so create-only and read-only-after-approval behaviors can be checked.
- Ability to toggle **See Financial Data** independently on a role (for the independence test).
- Note: The **Technician** system role uses Tech View by default; other system roles use Full View; the **Time Clock** role has an empty view mode. Custom roles let you pick either.

## Test Cases

### CR-VIEWMODE-001 — Full View: all fields, forms, and workflow actions present

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with **View Mode = Full**, WO View + Edit ON, Review Work Orders ON, See Financial Data ON. Assigned to test user. |
| **Test Data** | Custom role "Full View Advisor"; a WO with lines and a parts request. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role "Full View Advisor" with View Mode = Full. | Role saves with Full View. |
| 2 | Assign to test user; log out/in; open a WO. | WO opens in Full View. |
| 3 | Inspect WO line fields. | All fields are visible/editable (subject to CRUD). |
| 4 | Open the parts request form. | The **full** parts request form is shown. |
| 5 | Check workflow actions (approve, review, split) and the Estimate column. | Approve, split available; Review available (Review permission ON). Estimate column shows the **actual estimate**. The **Send to Portal** button is present. |

**Expected Final Result:** A Full View user has full fields, the full parts request form, all workflow actions, the actual-estimate column, and the Send to Portal button.

---

### CR-VIEWMODE-002 — Tech View: Estimate column shows Tech Time, not actual estimate

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with **View Mode = Tech**, WO View + Edit ON. Assigned to test user. |
| **Test Data** | Custom role "Tech View Role"; a WO with lines that have estimates and tech time. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role "Tech View Role" with View Mode = Tech. | Role saves with Tech View. |
| 2 | Assign to test user; log out/in; open a WO. | WO opens in Tech View. |
| 3 | Look at the Estimate column on the lines. | The Estimate column shows **Tech Time** (not the actual estimate). |
| 4 | (Compare) As a Full View user on the same WO, view the Estimate column. | Full View shows the **actual estimate** — confirming the difference. |

**Expected Final Result:** In Tech View the Estimate column shows Tech Time; in Full View it shows the actual estimate.

---

### CR-VIEWMODE-003 — Tech View: no tech time field

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Custom role "Tech View Role" (View Mode = Tech) assigned to test user. |
| **Test Data** | A WO with lines. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Tech View user; open a WO line. | Line opens in Tech View. |
| 2 | Look for a **tech time field** to enter/edit tech time. | No tech time field is present in Tech View. |

**Expected Final Result:** Tech View hides the tech time field.

---

### CR-VIEWMODE-004 — Tech View: no approve action / cannot approve lines

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role "Tech View Role" (View Mode = Tech) assigned to test user. Compare against a Full View role. |
| **Test Data** | A WO with a line awaiting approval. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Tech View user; open a WO with a line awaiting approval. | WO opens in Tech View. |
| 2 | Look for the **approve** action and try to approve a line. | No approve action is available; the user **cannot approve lines**. |
| 3 | (Compare) As a Full View user on the same WO, look for approve. | The approve action is available in Full View. |

**Expected Final Result:** Tech View hides workflow-approve actions; Full View shows them.

---

### CR-VIEWMODE-005 — Tech View: cannot Send to Portal (button hidden)

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role "Tech View Role" (View Mode = Tech) assigned to test user. Compare against Full View role. |
| **Test Data** | A WO eligible for Send to Portal. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Tech View user; open a WO. | WO opens in Tech View. |
| 2 | Look for the **Send to Portal** button. | The Send to Portal button is **not present** in Tech View. |
| 3 | (Compare) As a Full View user on the same WO, look for the button. | Send to Portal button is present in Full View. |

**Expected Final Result:** The Send to Portal button appears only in Full View.

---

### CR-VIEWMODE-006 — Tech View: cannot view labor rates

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Custom role "Tech View Role" (View Mode = Tech) assigned to test user. |
| **Test Data** | A WO whose lines carry labor rates. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Tech View user; open a WO. | WO opens in Tech View. |
| 2 | Look for labor rate values on the lines. | Labor rates are **not viewable** in Tech View. |

**Expected Final Result:** Tech View hides labor rates.

---

### CR-VIEWMODE-007 — Tech View: limited parts request form

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Custom role "Tech View Role" (View Mode = Tech) assigned to test user. Compare against Full View role. |
| **Test Data** | A WO where a parts request can be made. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Tech View user; open the parts request form on a WO. | A **limited** parts request form is shown (fewer fields/options than Full View). |
| 2 | (Compare) As a Full View user, open the parts request form. | The **full** parts request form is shown. |

**Expected Final Result:** Tech View presents a limited parts request form; Full View presents the full form.

---

### CR-VIEWMODE-008 — Tech View: create-only line editing (cannot edit existing lines)

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role "Tech View Role" (View Mode = Tech, WO View + Edit + WO Lines Edit ON) assigned to test user. |
| **Test Data** | A WO with an **existing** line (authorization pending) and the ability to create a new line. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Tech View user; open a WO. | WO opens in Tech View. |
| 2 | Create a **new** WO line. | Creating a new line is allowed (create-only). |
| 3 | Attempt to **edit an existing** WO line whose authorization is still pending. | Editing existing lines is restricted in Tech View (create-only); confirm the behavior per spec — Tech View is create-only for lines. |
| 4 | (Compare) As a Full View user, edit an existing line. | Full View allows editing existing lines (subject to CRUD). |

**Expected Final Result:** In Tech View, line editing is effectively create-only; existing-line editing is limited compared to Full View.

---

### CR-VIEWMODE-009 — Tech View: WO lines read-only after approval, editable while pending

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role "Tech View Role" (View Mode = Tech, WO Lines Edit ON) assigned to test user. |
| **Test Data** | A WO with one line whose **authorization is pending** and one line that has been **approved**. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Tech View user; open the WO. | WO opens in Tech View. |
| 2 | Open the line whose **authorization is pending**. | The line is **editable** while authorization is pending. |
| 3 | Open the **approved** line. | The line is **read-only** (editable only while authorization was pending). |

**Expected Final Result:** In Tech View, WO lines are editable only while authorization is pending and become read-only after approval.

---

### CR-VIEWMODE-010 — View Mode is independent from See Financial Data

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Custom role with **View Mode = Tech** and **See Financial Data = ON**. Assigned to test user. Also prepare a variant with See Financial Data OFF. |
| **Test Data** | Custom role "Tech+Financial"; a WO whose lines have financial columns. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure "Tech+Financial": View Mode = Tech, See Financial Data ON. | Role saves; the two settings are independent controls. |
| 2 | Assign to test user; log out/in; open a WO. | WO opens in Tech View. |
| 3 | Check financial column visibility. | Financial columns are governed by **See Financial Data** (ON) — not by View Mode — so they are visible even in Tech View. |
| 4 | Change the role's See Financial Data to OFF (keep Tech View); log out/in; reopen the WO. | Financial columns are now hidden, driven solely by the See Financial Data toggle while View Mode stays Tech. |

**Expected Final Result:** View Mode controls UI complexity only; financial column visibility is controlled independently by See Financial Data (not a security boundary in View Mode).

---

### CR-VIEWMODE-011 — Review permission wins over Tech View for review capability

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Medium |
| **Type** | Dependency |
| **Preconditions** | Custom role with **View Mode = Tech** and **Review Work Orders** sub-setting ON. Assigned to test user. |
| **Test Data** | Custom role "Tech Reviewer"; a WO eligible for review. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure "Tech Reviewer": View Mode = Tech, Review Work Orders ON, WO View ON. | Role saves. |
| 2 | Assign to test user; log out/in; open a WO. | WO opens in Tech View. |
| 3 | Look for the Review capability on the WO. | Per clarification "Review Work Order always wins over Tech View" — with the Review permission ON, the **review capability applies** even in Tech View. |
| 4 | Check general workflow-approve actions (approve/split). | General workflow-approve actions remain **hidden** in Tech View (only Review is granted via the Review permission). |

**Expected Final Result:** With Review Work Orders ON, the review capability applies even in Tech View, while other workflow-approve actions stay hidden.

---

### CR-VIEWMODE-012 — Tech View review hidden when Review permission is OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Custom role with **View Mode = Tech** and **Review Work Orders** sub-setting OFF. Assigned to test user. |
| **Test Data** | Custom role "Tech No Review"; a WO. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure "Tech No Review": View Mode = Tech, Review Work Orders OFF. | Role saves. |
| 2 | Assign to test user; log out/in; open a WO. | WO opens in Tech View. |
| 3 | Look for the Review capability. | Review is **not available** (Review permission OFF and Tech View also hides review). |

**Expected Final Result:** In Tech View with Review permission OFF, the user cannot review WOs.

---

### CR-VIEWMODE-013 — Full View role can Send to Portal (positive counterpart)

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Custom role "Full View Advisor" (View Mode = Full) assigned to test user. |
| **Test Data** | A WO eligible for Send to Portal. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Full View user; open a WO. | WO opens in Full View. |
| 2 | Click **Send to Portal**. | The button is present and the send action works. |

**Expected Final Result:** Full View exposes and allows the Send to Portal action.

---

### CR-VIEWMODE-014 — Technician system role defaults to Tech View; custom roles default to Full

| Field | Value |
|---|---|
| **Related Jira** | SV-7508 |
| **Priority** | Low |
| **Type** | Regression |
| **Preconditions** | Ability to inspect system roles (Technician, Time Clock) and create a new custom role. |
| **Test Data** | System roles Technician and Time Clock; a new custom role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the **Technician** system role and inspect its View Mode. | View Mode is **Tech** by default. |
| 2 | Open a non-technician system role and inspect its View Mode. | View Mode is **Full**. |
| 3 | Open the **Time Clock** role and inspect its View Mode. | View Mode is **empty**. |
| 4 | Create a new custom role and inspect the default View Mode. | Custom/other roles default to **Full** View (selectable to Tech). |

**Expected Final Result:** Technician defaults to Tech View, other roles default to Full, and Time Clock has an empty view mode.

---
