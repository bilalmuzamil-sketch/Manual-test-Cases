#!/usr/bin/env python3
"""Generator for the 'Template Edit' tab test-case DATA (delta tests).

Epic SV-7388 Custom Roles and Permissions.
Baseline = an existing SYSTEM ROLE TEMPLATE; admin flips one or more toggles,
saves, assigns to a staff user, then verifies via login that ONLY the changed
capability changed (delta) and the rest of the template's access is intact.
"""
import json
import os

OUT_DIR = "/home/user/Manual-test-Cases/build"
OUT_FILE = os.path.join(OUT_DIR, "te.json")

# Jira references
J_EDIT = "SV-7501"      # Edit Custom Role
J_TMPL = "SV-7526"      # templates
J_STAFF = "SV-7505"     # staff assignment
J_OWNER = "SV-7527"     # Owner merged into Administrator

# ---------------------------------------------------------------------------
# Shared step/precondition builders
# ---------------------------------------------------------------------------

def admin_login_pre():
    return ("Logged in as an Administrator. Administration > Roles and Permissions "
            "is reachable. A test staff user exists with no custom role assigned.")

def create_from_template_steps(template, toggle_desc):
    """Common opening steps: create custom role from a system template."""
    return [
        {"n": 1,
         "action": "Go to Administration > Roles and Permissions > Create Custom Role.",
         "expected": "Create Custom Role screen opens with a template selector."},
        {"n": 2,
         "action": f"Select the '{template}' system template.",
         "expected": (f"All permission settings pre-fill from the '{template}' template; "
                      "the source template is recorded on the role.")},
        {"n": 3,
         "action": f"Change: {toggle_desc}",
         "expected": "The changed toggle(s) reflect the new state; all other settings remain at template default."},
    ]

def save_assign_verify_steps(start_n, template, delta_capability, delta_expected,
                             intact_desc, dependency_step=None):
    """Common closing steps: save, assign, force logout, verify delta + intact rest."""
    n = start_n
    steps = []
    if dependency_step is not None:
        steps.append({"n": n, "action": dependency_step["action"],
                      "expected": dependency_step["expected"]})
        n += 1
    steps += [
        {"n": n,
         "action": "Click Save to create the custom role.",
         "expected": "Role saves successfully; only the intended delta differs from the template."},
        {"n": n + 1,
         "action": "Go to Administration > Staff and assign the new custom role to the test user.",
         "expected": "Role is assigned; the user is forced to log out (role change forces logout)."},
        {"n": n + 2,
         "action": "In a separate browser, log in as the test user.",
         "expected": "Login succeeds with the new custom role applied."},
        {"n": n + 3,
         "action": f"Verify the delta: {delta_capability}",
         "expected": delta_expected},
        {"n": n + 4,
         "action": f"Verify the rest of the template is intact: {intact_desc}",
         "expected": ("All other capabilities match the source template exactly; "
                      "no unintended access was gained or lost.")},
    ]
    return steps

def role_setup(template, toggle, frm, to):
    return (f"Start from {template} template (records template). "
            f"Change: {toggle} from {frm} to {to}. Leave all else as template default.")

def viu(ref):
    return f"Spec: {ref}. UNVERIFIED — VIU pending."


# ---------------------------------------------------------------------------
# Case collection
# ---------------------------------------------------------------------------
cases = []
counters = {}

def add(rolecode, title, jira, permission, dependency_mode, priority, ctype,
        preconditions, rsetup, test_data, steps, expected_final, source):
    counters.setdefault(rolecode, 0)
    counters[rolecode] += 1
    tid = f"TE-{rolecode}-{counters[rolecode]:03d}"
    cases.append({
        "test_id": tid,
        "title": title,
        "jira": jira,
        "permission": permission,
        "dependency_mode": dependency_mode,
        "priority": priority,
        "type": ctype,
        "preconditions": preconditions,
        "role_setup": rsetup,
        "test_data": test_data,
        "steps": steps,
        "expected_final": expected_final,
        "source_viu": source,
    })


# ===========================================================================
# ADMINISTRATOR (ADMIN)
# ===========================================================================
# Negative: cannot remove Admin-pages access
steps = create_from_template_steps(
    "Administrator",
    "attempt to disable 'Access Administration pages' (Roles & Permissions / Staff / Settings).")
steps.append({"n": 4,
              "action": "Attempt to turn OFF the Administration-pages access toggle and Save.",
              "expected": ("The Admin-pages access toggle is locked/cannot be disabled for a role sourced "
                           "from Administrator; Save is blocked or the toggle reverts with a validation message.")})
add("ADMIN",
    "Administrator: cannot be edited to lose Administration-pages access",
    J_EDIT, "Access Administration pages", "None", "Critical", "Negative",
    admin_login_pre(),
    role_setup("Administrator", "Access Administration pages", "ON", "OFF (attempted)"),
    "Template: Administrator. Target toggle: Access Administration pages.",
    steps,
    "The custom role cannot be saved with Admin-pages access removed; Administrator always retains admin access.",
    viu(f"{J_EDIT} Edit Custom Role - Administrator admin-access guard"))

# Positive: remove a non-admin capability (Delete on Work Orders)
steps = create_from_template_steps("Administrator", "disable Work Orders > Delete.")
steps += save_assign_verify_steps(
    4, "Administrator",
    "attempt to delete a Work Order as the user.",
    "The Delete action on Work Orders is unavailable/blocked for the user.",
    "user still has full access everywhere else (create/edit WOs, all other modules, Admin pages).")
add("ADMIN",
    "Administrator: remove Work Orders Delete only (delta), rest of full access intact",
    J_EDIT, "Work Orders > Delete", "None", "High", "Positive",
    admin_login_pre(),
    role_setup("Administrator", "Work Orders > Delete", "ON", "OFF"),
    "Template: Administrator. Toggle: Work Orders Delete OFF.",
    steps,
    "Only Work Orders Delete is removed; every other Administrator capability remains available to the user.",
    viu(f"{J_EDIT} Edit Custom Role delta - Administrator"))

# Positive: add/keep a non-admin capability - toggle History off (a non-admin capability)
steps = create_from_template_steps("Administrator", "disable History access.")
steps += save_assign_verify_steps(
    4, "Administrator",
    "open a record and look for the History tab/panel.",
    "History is not shown/available for the user.",
    "all other Administrator access (all CRUD, Admin pages, Financial, AP/AR) is unchanged.")
add("ADMIN",
    "Administrator: remove History only (delta), all other access intact",
    J_EDIT, "History", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Administrator", "History", "ON", "OFF"),
    "Template: Administrator. Toggle: History OFF.",
    steps,
    "Only History is removed; the rest of the Administrator template is preserved.",
    viu(f"{J_EDIT} Edit Custom Role delta - Administrator History"))

# Staff-assignment focused: reassign forces logout and applies edited role
steps = create_from_template_steps("Administrator", "disable Vendor > Delete.")
steps += save_assign_verify_steps(
    4, "Administrator",
    "attempt to delete a Vendor as the user.",
    "The Delete action on Vendors is unavailable/blocked for the user.",
    "user still has full access everywhere else including Admin pages.")
add("ADMIN",
    "Administrator-based role: assignment forces logout, edited role applies on next login",
    J_STAFF, "Vendor > Delete", "None", "High", "Positive",
    admin_login_pre(),
    role_setup("Administrator", "Vendor > Delete", "ON", "OFF"),
    "Template: Administrator. Toggle: Vendor Delete OFF. Focus: staff assignment + forced logout.",
    steps,
    "On assignment the user is logged out and the edited role (minus Vendor Delete) applies on next login.",
    viu(f"{J_STAFF} Staff assignment forces logout"))

# Owner does not appear as a template
add("ADMIN",
    "Owner is not offered as a system template (merged into Administrator)",
    J_OWNER, "N/A (template list)", "None", "High", "Negative",
    admin_login_pre(),
    "Start from template selector (no change). Change: none. Leave all else as template default.",
    "Template selector list. Expected: 11 selectable templates + 2 read-only, no 'Owner'.",
    [
        {"n": 1, "action": "Go to Administration > Roles and Permissions > Create Custom Role.",
         "expected": "Template selector opens."},
        {"n": 2, "action": "Review the full list of available system templates.",
         "expected": "No 'Owner' template is present; legacy Owner has been merged into Administrator."},
        {"n": 3, "action": "Confirm Administrator is present and represents full access.",
         "expected": "Administrator template exists and covers the former Owner capabilities."},
    ],
    "Owner does not appear in the template list; Administrator is the only full-access template.",
    viu(f"{J_TMPL}/{J_OWNER} Owner merged into Administrator"))


# ===========================================================================
# SERVICE MANAGER (SM)
# ===========================================================================
# ADD: enable Invoicing Delete (template has V/E, no Delete)
steps = create_from_template_steps("Service Manager", "enable Invoicing > Delete.")
steps += save_assign_verify_steps(
    4, "Service Manager",
    "attempt to delete an Invoice as the user.",
    "The user can delete an Invoice (Delete action available and works).",
    "all other Service Manager access (WO/WOL/Schedule/Customers/Parts CRUD, Reports, portals, Financial, AP/AR) unchanged.")
add("SM",
    "Service Manager: ADD Invoicing Delete (template lacked it), rest intact",
    J_EDIT, "Invoicing > Delete", "Cascade: auto-enable lower", "High", "Dependency",
    admin_login_pre(),
    role_setup("Service Manager", "Invoicing > Delete", "OFF", "ON"),
    "Template: Service Manager. Toggle: Invoicing Delete ON (View/Edit already ON).",
    steps,
    "User gains Invoicing Delete only; all other Service Manager capabilities remain.",
    viu(f"{J_EDIT} Edit Custom Role - SM add Invoicing Delete"))

# REMOVE with dependency: disable Financial -> financial gate confirm modal
dep = {"action": "Turn OFF the Financial access toggle.",
       "expected": "A Financial gate confirmation modal appears warning that financial data access will be removed; confirm to proceed."}
steps = create_from_template_steps("Service Manager", "disable Financial access (expect financial confirm modal).")
steps += save_assign_verify_steps(
    5, "Service Manager",
    "open a Work Order / Invoice and look for financial figures (costs, margins, totals).",
    "Financial data is hidden/blocked for the user.",
    "non-financial Service Manager access (CRUD, schedule, portals, history) is unchanged.",
    dependency_step=dep)
add("SM",
    "Service Manager: REMOVE Financial access (financial confirm modal), rest intact",
    J_EDIT, "Financial", "Financial gate: confirm modal", "Critical", "Dependency",
    admin_login_pre(),
    role_setup("Service Manager", "Financial", "ON", "OFF"),
    "Template: Service Manager. Toggle: Financial OFF (confirm modal expected).",
    steps,
    "Financial access removed after confirming the modal; all non-financial access preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SM Financial gate"))

# REMOVE with AP/AR gate: disable AP/AR
dep = {"action": "Turn OFF the AP/AR access toggle.",
       "expected": "An AP/AR gate confirmation modal appears warning payables/receivables access will be removed; confirm to proceed."}
steps = create_from_template_steps("Service Manager", "disable AP/AR access (expect AP/AR confirm modal).")
steps += save_assign_verify_steps(
    5, "Service Manager",
    "attempt to reach AP/AR (payables/receivables) screens.",
    "AP/AR screens are unavailable to the user.",
    "all other Service Manager access, including Financial, is unchanged.",
    dependency_step=dep)
add("SM",
    "Service Manager: REMOVE AP/AR access (AP/AR confirm modal), rest intact",
    J_EDIT, "AP/AR", "AP/AR gate: confirm modal", "High", "Dependency",
    admin_login_pre(),
    role_setup("Service Manager", "AP/AR", "ON", "OFF"),
    "Template: Service Manager. Toggle: AP/AR OFF (confirm modal expected).",
    steps,
    "AP/AR access removed after confirming the modal; the rest of the template is intact.",
    viu(f"{J_EDIT} Edit Custom Role - SM AP/AR gate"))

# MULTI-TOGGLE: disable Reports + disable Settings at once
steps = create_from_template_steps(
    "Service Manager",
    "disable Reports AND disable Settings (App Settings + Wages) together.")
steps += save_assign_verify_steps(
    4, "Service Manager",
    "attempt to open Reports and open Settings (App Settings / Wages) as the user.",
    "Both Reports and Settings are unavailable to the user.",
    "all other Service Manager CRUD/portals/Financial/AP/AR access is unchanged.")
add("SM",
    "Service Manager: MULTI-toggle remove Reports + Settings, rest intact",
    J_EDIT, "Reports; Settings (App Settings + Wages)", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Service Manager", "Reports and Settings", "ON/ON", "OFF/OFF"),
    "Template: Service Manager. Toggles: Reports OFF, Settings OFF.",
    steps,
    "Exactly two capabilities (Reports, Settings) removed; everything else preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SM multi-toggle"))


# ===========================================================================
# SENIOR SERVICE ADVISOR (SSA)
# ===========================================================================
# ADD: Customers Delete (template has V/E)
steps = create_from_template_steps("Senior Service Advisor", "enable Customers > Delete.")
steps += save_assign_verify_steps(
    4, "Senior Service Advisor",
    "attempt to delete a Customer record as the user.",
    "The user can delete a Customer.",
    "all other SSA access unchanged (WO/WOL/Schedule/Parts CRUD, Invoicing, Reports, portals, Financial, AP/AR, History).")
add("SSA",
    "Senior Service Advisor: ADD Customers Delete, rest intact",
    J_EDIT, "Customers > Delete", "Cascade: auto-enable lower", "High", "Dependency",
    admin_login_pre(),
    role_setup("Senior Service Advisor", "Customers > Delete", "OFF", "ON"),
    "Template: Senior Service Advisor. Toggle: Customers Delete ON.",
    steps,
    "User gains Customers Delete only; rest of SSA template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SSA add Customers Delete"))

# REMOVE reverse cascade: disable Work Orders Edit -> auto-disable Delete (higher)
dep = {"action": "Turn OFF Work Orders > Edit.",
       "expected": "Reverse cascade: Work Orders > Delete auto-disables (cannot delete without edit); View remains ON."}
steps = create_from_template_steps("Senior Service Advisor", "disable Work Orders > Edit (expect reverse cascade disabling Delete).")
steps += save_assign_verify_steps(
    5, "Senior Service Advisor",
    "open a Work Order and attempt to edit and to delete it.",
    "User can View WOs but cannot Edit or Delete them.",
    "all other SSA access (WOL, Schedule, Customers, Parts, Invoicing, portals, Financial, AP/AR) is unchanged.",
    dependency_step=dep)
add("SSA",
    "Senior Service Advisor: REMOVE Work Orders Edit (reverse cascade removes Delete), rest intact",
    J_EDIT, "Work Orders > Edit", "Cascade: auto-disable higher (reverse)", "Critical", "Dependency",
    admin_login_pre(),
    role_setup("Senior Service Advisor", "Work Orders > Edit", "ON", "OFF"),
    "Template: Senior Service Advisor. Toggle: WO Edit OFF; expect WO Delete auto-off.",
    steps,
    "WO Edit and (cascaded) Delete removed; View retained; rest of template intact.",
    viu(f"{J_EDIT} Edit Custom Role - SSA reverse cascade"))

# REMOVE: disable Customer Portal
steps = create_from_template_steps("Senior Service Advisor", "disable Customer Portal access.")
steps += save_assign_verify_steps(
    4, "Senior Service Advisor",
    "attempt to reach Customer Portal features as the user.",
    "Customer Portal is unavailable to the user.",
    "all other SSA access is unchanged.")
add("SSA",
    "Senior Service Advisor: REMOVE Customer Portal, rest intact",
    J_EDIT, "Customer Portal", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Senior Service Advisor", "Customer Portal", "ON", "OFF"),
    "Template: Senior Service Advisor. Toggle: Customer Portal OFF.",
    steps,
    "Only Customer Portal removed; rest of SSA template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SSA remove Customer Portal"))

# MULTI: enable Parts Dept? already ON. Instead multi: disable Catalog Edit + disable Reports
steps = create_from_template_steps(
    "Senior Service Advisor",
    "disable Catalog > Edit AND disable Reports together.")
steps += save_assign_verify_steps(
    4, "Senior Service Advisor",
    "attempt to edit a Catalog item and to open Reports as the user.",
    "User can view Catalog but not edit it; Reports is unavailable.",
    "all other SSA access is unchanged.")
add("SSA",
    "Senior Service Advisor: MULTI-toggle remove Catalog Edit + Reports, rest intact",
    J_EDIT, "Catalog > Edit; Reports", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Senior Service Advisor", "Catalog Edit and Reports", "ON/ON", "OFF/OFF"),
    "Template: Senior Service Advisor. Toggles: Catalog Edit OFF, Reports OFF.",
    steps,
    "Exactly Catalog Edit and Reports removed; everything else preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SSA multi-toggle"))


# ===========================================================================
# SERVICE ADVISOR (SADV)
# ===========================================================================
# ADD with cascade: enable Work Orders Delete (template has V/E) -> requires/auto-enables lower
dep = {"action": "Turn ON Work Orders > Delete.",
       "expected": "Cascade auto-enable lower: View and Edit remain ON (already set); Delete enabled with its prerequisites satisfied."}
steps = create_from_template_steps("Service Advisor", "enable Work Orders > Delete (template had V/E only).")
steps += save_assign_verify_steps(
    5, "Service Advisor",
    "attempt to delete a Work Order as the user.",
    "The user can delete a Work Order.",
    "all other Service Advisor access unchanged.",
    dependency_step=dep)
add("SADV",
    "Service Advisor: ADD Work Orders Delete (cascade), rest intact",
    J_EDIT, "Work Orders > Delete", "Cascade: auto-enable lower", "High", "Dependency",
    admin_login_pre(),
    role_setup("Service Advisor", "Work Orders > Delete", "OFF", "ON"),
    "Template: Service Advisor. Toggle: WO Delete ON.",
    steps,
    "User gains WO Delete only; rest of Service Advisor template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SADV add WO Delete"))

# ADD: enable AP/AR (template has AP/AR OFF) - AP/AR gate on enable? treat as add positive
steps = create_from_template_steps("Service Advisor", "enable AP/AR access (template had it OFF).")
steps += save_assign_verify_steps(
    4, "Service Advisor",
    "navigate to AP/AR (payables/receivables) screens as the user.",
    "AP/AR screens are now available to the user.",
    "all other Service Advisor access unchanged (Financial already ON, CRUD, portals, History).")
add("SADV",
    "Service Advisor: ADD AP/AR access, rest intact",
    J_EDIT, "AP/AR", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Service Advisor", "AP/AR", "OFF", "ON"),
    "Template: Service Advisor. Toggle: AP/AR ON.",
    steps,
    "User gains AP/AR access only; rest of the template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SADV add AP/AR"))

# REMOVE: disable Part Sales Edit -> user view-only Part Sales
steps = create_from_template_steps("Service Advisor", "disable Part Sales > Edit.")
steps += save_assign_verify_steps(
    4, "Service Advisor",
    "open Part Sales and attempt to create/edit a part sale as the user.",
    "User can view Part Sales but cannot create/edit.",
    "all other Service Advisor access is unchanged.")
add("SADV",
    "Service Advisor: REMOVE Part Sales Edit (view-only), rest intact",
    J_EDIT, "Part Sales > Edit", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Service Advisor", "Part Sales > Edit", "ON", "OFF"),
    "Template: Service Advisor. Toggle: Part Sales Edit OFF (View stays ON).",
    steps,
    "Only Part Sales Edit removed; the rest of the template is intact.",
    viu(f"{J_EDIT} Edit Custom Role - SADV remove Part Sales Edit"))

# MULTI: enable Reports + enable Parts Dept setting? SADV has no Reports listed -> add Reports; and add Timesheets Edit
steps = create_from_template_steps(
    "Service Advisor",
    "enable Timesheets > Edit AND enable AP/AR together.")
steps += save_assign_verify_steps(
    4, "Service Advisor",
    "attempt to edit a timesheet and open AP/AR screens as the user.",
    "User can edit timesheets and access AP/AR.",
    "all other Service Advisor access is unchanged.")
add("SADV",
    "Service Advisor: MULTI-toggle add Timesheets Edit + AP/AR, rest intact",
    J_EDIT, "Timesheets > Edit; AP/AR", "Cascade: auto-enable lower", "Medium", "Dependency",
    admin_login_pre(),
    role_setup("Service Advisor", "Timesheets Edit and AP/AR", "OFF/OFF", "ON/ON"),
    "Template: Service Advisor. Toggles: Timesheets Edit ON, AP/AR ON.",
    steps,
    "Exactly Timesheets Edit and AP/AR added; everything else preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SADV multi-toggle"))


# ===========================================================================
# FOREMAN (FORE)
# ===========================================================================
# ADD: enable Part Sales Edit (template has Part Sales V only)
steps = create_from_template_steps("Foreman", "enable Part Sales > Edit (template had View only).")
steps += save_assign_verify_steps(
    4, "Foreman",
    "attempt to create/edit a part sale as the user.",
    "User can create/edit Part Sales.",
    "all other Foreman access unchanged (WO/WOL/Schedule/Customers/Catalog/Vendor, Invoicing, Financial, History).")
add("FORE",
    "Foreman: ADD Part Sales Edit (template had View only), rest intact",
    J_EDIT, "Part Sales > Edit", "Cascade: auto-enable lower", "High", "Dependency",
    admin_login_pre(),
    role_setup("Foreman", "Part Sales > Edit", "OFF", "ON"),
    "Template: Foreman. Toggle: Part Sales Edit ON.",
    steps,
    "User gains Part Sales Edit only; rest of Foreman template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - FORE add Part Sales Edit"))

# REMOVE: disable Financial -> financial gate
dep = {"action": "Turn OFF the Financial access toggle.",
       "expected": "Financial gate confirmation modal appears; confirm to proceed."}
steps = create_from_template_steps("Foreman", "disable Financial access (expect financial confirm modal).")
steps += save_assign_verify_steps(
    5, "Foreman",
    "open a Work Order and look for financial figures.",
    "Financial data is hidden for the user.",
    "non-financial Foreman access is unchanged.",
    dependency_step=dep)
add("FORE",
    "Foreman: REMOVE Financial access (financial confirm modal), rest intact",
    J_EDIT, "Financial", "Financial gate: confirm modal", "High", "Dependency",
    admin_login_pre(),
    role_setup("Foreman", "Financial", "ON", "OFF"),
    "Template: Foreman. Toggle: Financial OFF (confirm modal expected).",
    steps,
    "Financial removed after confirming; rest of template intact.",
    viu(f"{J_EDIT} Edit Custom Role - FORE Financial gate"))

# MULTI: enable WO Delete + enable Invoicing Delete
steps = create_from_template_steps(
    "Foreman",
    "enable Work Orders > Delete AND enable Invoicing > Delete together.")
steps += save_assign_verify_steps(
    4, "Foreman",
    "attempt to delete a Work Order and to delete an Invoice as the user.",
    "User can delete both Work Orders and Invoices.",
    "all other Foreman access is unchanged.")
add("FORE",
    "Foreman: MULTI-toggle add WO Delete + Invoicing Delete, rest intact",
    J_EDIT, "Work Orders > Delete; Invoicing > Delete", "Cascade: auto-enable lower", "Medium", "Dependency",
    admin_login_pre(),
    role_setup("Foreman", "WO Delete and Invoicing Delete", "OFF/OFF", "ON/ON"),
    "Template: Foreman. Toggles: WO Delete ON, Invoicing Delete ON.",
    steps,
    "Exactly WO Delete and Invoicing Delete added; everything else preserved.",
    viu(f"{J_EDIT} Edit Custom Role - FORE multi-toggle"))


# FORE extra ADD: enable Catalog Delete (template Catalog V/E)
steps = create_from_template_steps("Foreman", "enable Catalog > Delete (template had V/E).")
steps += save_assign_verify_steps(
    4, "Foreman",
    "attempt to delete a Catalog item as the user.",
    "User can delete Catalog items.",
    "all other Foreman access is unchanged.")
add("FORE",
    "Foreman: ADD Catalog Delete, rest intact",
    J_EDIT, "Catalog > Delete", "Cascade: auto-enable lower", "Low", "Dependency",
    admin_login_pre(),
    role_setup("Foreman", "Catalog > Delete", "OFF", "ON"),
    "Template: Foreman. Toggle: Catalog Delete ON.",
    steps,
    "User gains Catalog Delete only; rest of Foreman template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - FORE add Catalog Delete"))


# ===========================================================================
# TECHNICIAN (TECH)
# ===========================================================================
# Switching Tech view -> Full view
steps = create_from_template_steps("Technician", "switch the view mode from TECH VIEW to FULL VIEW.")
steps += save_assign_verify_steps(
    4, "Technician",
    "open a Work Order and confirm the Full-view layout/fields are shown.",
    "User sees the Full view instead of the restricted Tech view.",
    "all other Technician access (WO View, WOL V/E, Schedule View, Customers View, Pick Parts) is unchanged.")
add("TECH",
    "Technician: switch TECH VIEW to FULL VIEW (delta), rest intact",
    J_EDIT, "View mode (Tech vs Full)", "None", "High", "Positive",
    admin_login_pre(),
    role_setup("Technician", "View mode", "Tech view", "Full view"),
    "Template: Technician. Toggle: view mode Tech -> Full.",
    steps,
    "Only the view mode changed to Full; other Technician access unchanged.",
    viu(f"{J_EDIT} Edit Custom Role - TECH view switch"))

# Enabling a CRUD: enable Work Orders Edit (template WO View only)
dep = {"action": "Turn ON Work Orders > Edit.",
       "expected": "Cascade auto-enable lower: View stays ON; Edit enabled with prerequisite View satisfied."}
steps = create_from_template_steps("Technician", "enable Work Orders > Edit (template had View only).")
steps += save_assign_verify_steps(
    5, "Technician",
    "open a Work Order and attempt to edit it as the user.",
    "User can now edit Work Orders.",
    "all other Technician access is unchanged (still no Delete, no Timesheets, Tech view).",
    dependency_step=dep)
add("TECH",
    "Technician: ADD Work Orders Edit (cascade from View), rest intact",
    J_EDIT, "Work Orders > Edit", "Cascade: auto-enable lower", "High", "Dependency",
    admin_login_pre(),
    role_setup("Technician", "Work Orders > Edit", "OFF", "ON"),
    "Template: Technician. Toggle: WO Edit ON (View already ON).",
    steps,
    "User gains WO Edit only; rest of restrictive Technician template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - TECH add WO Edit"))

# Parent gate: enable Pick Parts hidden by Parts Dept parent? Template Parts Dept OFF, Pick ON.
# Model parent-gate: enable Order Parts child requires Parts Dept parent -> parent gate hides children.
dep = {"action": "Attempt to turn ON Order Parts while Parts Dept parent is OFF.",
       "expected": "Parent gate: child Order Parts is hidden/disabled until the Parts Dept parent is enabled."}
steps = create_from_template_steps("Technician", "attempt to enable Order Parts with Parts Dept parent OFF (parent gate).")
steps.append({"n": 4, "action": "Enable the Parts Dept parent toggle, then enable Order Parts.",
              "expected": "With the parent enabled, the Order Parts child becomes available and can be turned ON."})
steps += save_assign_verify_steps(
    5, "Technician",
    "attempt to order parts as the user.",
    "User can order parts (parent Parts Dept + child Order Parts both active).",
    "all other Technician access is unchanged.")
add("TECH",
    "Technician: parent-gate - Order Parts hidden until Parts Dept enabled",
    J_EDIT, "Order Parts (child of Parts Dept)", "Parent gate: hide children", "Medium", "Dependency",
    admin_login_pre(),
    role_setup("Technician", "Parts Dept + Order Parts", "OFF/OFF", "ON/ON"),
    "Template: Technician. Parent Parts Dept then child Order Parts.",
    steps,
    "Order Parts only becomes settable after the Parts Dept parent is enabled; rest of template intact.",
    viu(f"{J_EDIT} Edit Custom Role - TECH parent gate"))

# MULTI: enable Financial + enable History (both OFF in template)
steps = create_from_template_steps(
    "Technician",
    "enable Financial AND enable History together.")
steps += save_assign_verify_steps(
    4, "Technician",
    "open a Work Order and check for financial figures and the History panel as the user.",
    "User can now see financial data and History.",
    "all other Technician access is unchanged (WO View, WOL V/E, etc.).")
add("TECH",
    "Technician: MULTI-toggle add Financial + History, rest intact",
    J_EDIT, "Financial; History", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Technician", "Financial and History", "OFF/OFF", "ON/ON"),
    "Template: Technician. Toggles: Financial ON, History ON.",
    steps,
    "Exactly Financial and History added; everything else preserved.",
    viu(f"{J_EDIT} Edit Custom Role - TECH multi-toggle"))


# ===========================================================================
# PARTS MANAGER (PM)
# ===========================================================================
# REMOVE with reverse cascade: disable Part Sales Edit -> auto-disable Delete
dep = {"action": "Turn OFF Part Sales > Edit.",
       "expected": "Reverse cascade: Part Sales > Delete auto-disables; View remains ON."}
steps = create_from_template_steps("Parts Manager", "disable Part Sales > Edit (expect reverse cascade removing Delete).")
steps += save_assign_verify_steps(
    5, "Parts Manager",
    "open Part Sales and attempt to edit and delete a part sale as the user.",
    "User can view Part Sales but cannot edit or delete.",
    "all other Parts Manager access unchanged (WO/WOL, Customers, Catalog, Vendor, Invoicing, Reports, Settings, Financial, AP/AR).",
    dependency_step=dep)
add("PM",
    "Parts Manager: REMOVE Part Sales Edit (reverse cascade removes Delete), rest intact",
    J_EDIT, "Part Sales > Edit", "Cascade: auto-disable higher (reverse)", "Critical", "Dependency",
    admin_login_pre(),
    role_setup("Parts Manager", "Part Sales > Edit", "ON", "OFF"),
    "Template: Parts Manager. Toggle: Part Sales Edit OFF; expect Delete auto-off.",
    steps,
    "Part Sales Edit and cascaded Delete removed; View retained; rest of template intact.",
    viu(f"{J_EDIT} Edit Custom Role - PM reverse cascade"))

# REMOVE: disable Settings (Parts, Finance, Data Import)
steps = create_from_template_steps("Parts Manager", "disable Settings (Parts, Finance, Data Import).")
steps += save_assign_verify_steps(
    4, "Parts Manager",
    "attempt to open Settings (Parts / Finance / Data Import) as the user.",
    "Settings sections are unavailable to the user.",
    "all other Parts Manager access is unchanged.")
add("PM",
    "Parts Manager: REMOVE Settings, rest intact",
    J_EDIT, "Settings (Parts, Finance, Data Import)", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Parts Manager", "Settings", "ON", "OFF"),
    "Template: Parts Manager. Toggle: Settings OFF.",
    steps,
    "Only Settings removed; rest of Parts Manager template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - PM remove Settings"))

# ADD: enable Timesheets View (template Timesheets none)
steps = create_from_template_steps("Parts Manager", "enable Timesheets > View (template had none).")
steps += save_assign_verify_steps(
    4, "Parts Manager",
    "open Timesheets as the user.",
    "User can view Timesheets.",
    "all other Parts Manager access is unchanged.")
add("PM",
    "Parts Manager: ADD Timesheets View, rest intact",
    J_EDIT, "Timesheets > View", "None", "Low", "Positive",
    admin_login_pre(),
    role_setup("Parts Manager", "Timesheets > View", "OFF", "ON"),
    "Template: Parts Manager. Toggle: Timesheets View ON.",
    steps,
    "User gains Timesheets View only; rest of template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - PM add Timesheets View"))

# MULTI + financial gate: disable Financial + disable AP/AR (two gates)
dep = {"action": "Turn OFF Financial and turn OFF AP/AR.",
       "expected": "A Financial gate confirm modal and an AP/AR gate confirm modal appear for the respective toggles; confirm both."}
steps = create_from_template_steps("Parts Manager", "disable Financial AND disable AP/AR (expect both confirm modals).")
steps += save_assign_verify_steps(
    5, "Parts Manager",
    "check for financial figures and attempt to reach AP/AR screens as the user.",
    "Both financial data and AP/AR are unavailable to the user.",
    "all non-financial Parts Manager access is unchanged.",
    dependency_step=dep)
add("PM",
    "Parts Manager: MULTI-toggle remove Financial + AP/AR (both gates), rest intact",
    J_EDIT, "Financial; AP/AR", "Financial gate: confirm modal", "High", "Dependency",
    admin_login_pre(),
    role_setup("Parts Manager", "Financial and AP/AR", "ON/ON", "OFF/OFF"),
    "Template: Parts Manager. Toggles: Financial OFF, AP/AR OFF (two gates).",
    steps,
    "Financial and AP/AR removed after confirming both modals; rest intact.",
    viu(f"{J_EDIT} Edit Custom Role - PM multi-toggle gates"))


# ===========================================================================
# PARTS TECHNICIAN (PT)
# ===========================================================================
# ADD: enable Part Sales Delete (template Part Sales V/E)
steps = create_from_template_steps("Parts Technician", "enable Part Sales > Delete.")
steps += save_assign_verify_steps(
    4, "Parts Technician",
    "attempt to delete a part sale as the user.",
    "User can delete Part Sales.",
    "all other Parts Technician access unchanged (WO View, Schedule View, Customers V/E, Catalog V/E, Vendor V/E/D, Invoicing V/E, Timesheets V, Financial, History).")
add("PT",
    "Parts Technician: ADD Part Sales Delete, rest intact",
    J_EDIT, "Part Sales > Delete", "Cascade: auto-enable lower", "Medium", "Dependency",
    admin_login_pre(),
    role_setup("Parts Technician", "Part Sales > Delete", "OFF", "ON"),
    "Template: Parts Technician. Toggle: Part Sales Delete ON.",
    steps,
    "User gains Part Sales Delete only; rest of template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - PT add Part Sales Delete"))

# REMOVE: disable Financial -> financial gate
dep = {"action": "Turn OFF the Financial access toggle.",
       "expected": "Financial gate confirmation modal appears; confirm to proceed."}
steps = create_from_template_steps("Parts Technician", "disable Financial access (expect financial confirm modal).")
steps += save_assign_verify_steps(
    5, "Parts Technician",
    "look for financial figures on parts/invoices as the user.",
    "Financial data is hidden for the user.",
    "non-financial Parts Technician access is unchanged.",
    dependency_step=dep)
add("PT",
    "Parts Technician: REMOVE Financial access (financial confirm modal), rest intact",
    J_EDIT, "Financial", "Financial gate: confirm modal", "High", "Dependency",
    admin_login_pre(),
    role_setup("Parts Technician", "Financial", "ON", "OFF"),
    "Template: Parts Technician. Toggle: Financial OFF (confirm modal expected).",
    steps,
    "Financial removed after confirming; rest of template intact.",
    viu(f"{J_EDIT} Edit Custom Role - PT Financial gate"))

# MULTI: enable Review Parts (template Review OFF, Pick/Order ON) + enable Customers Delete
steps = create_from_template_steps(
    "Parts Technician",
    "enable Review Parts AND enable Customers > Delete together.")
steps += save_assign_verify_steps(
    4, "Parts Technician",
    "attempt to review parts and to delete a customer as the user.",
    "User can review parts and delete customers.",
    "all other Parts Technician access is unchanged (Pick/Order still ON).")
add("PT",
    "Parts Technician: MULTI-toggle add Review Parts + Customers Delete, rest intact",
    J_EDIT, "Review Parts; Customers > Delete", "Cascade: auto-enable lower", "Medium", "Dependency",
    admin_login_pre(),
    role_setup("Parts Technician", "Review Parts and Customers Delete", "OFF/OFF", "ON/ON"),
    "Template: Parts Technician. Toggles: Review Parts ON, Customers Delete ON.",
    steps,
    "Exactly Review Parts and Customers Delete added; everything else preserved.",
    viu(f"{J_EDIT} Edit Custom Role - PT multi-toggle"))


# PT extra REMOVE reverse cascade: disable Vendor Edit -> auto-disable Delete (template Vendor V/E/D)
dep = {"action": "Turn OFF Vendor > Edit.",
       "expected": "Reverse cascade: Vendor > Delete auto-disables; View remains ON."}
steps = create_from_template_steps("Parts Technician", "disable Vendor > Edit (expect reverse cascade removing Delete).")
steps += save_assign_verify_steps(
    5, "Parts Technician",
    "open a Vendor and attempt to edit and delete it as the user.",
    "User can view Vendors but cannot edit or delete.",
    "all other Parts Technician access is unchanged.",
    dependency_step=dep)
add("PT",
    "Parts Technician: REMOVE Vendor Edit (reverse cascade removes Delete), rest intact",
    J_EDIT, "Vendor > Edit", "Cascade: auto-disable higher (reverse)", "Medium", "Dependency",
    admin_login_pre(),
    role_setup("Parts Technician", "Vendor > Edit", "ON", "OFF"),
    "Template: Parts Technician. Toggle: Vendor Edit OFF; expect Delete auto-off.",
    steps,
    "Vendor Edit and cascaded Delete removed; View retained; rest of template intact.",
    viu(f"{J_EDIT} Edit Custom Role - PT reverse cascade"))


# ===========================================================================
# OFFICE (OFFICE) — NOT EDITABLE
# ===========================================================================
add("OFFICE",
    "Office template is not editable - opens read-only summary",
    J_TMPL, "N/A (read-only template)", "None", "High", "Negative",
    admin_login_pre(),
    "Start from Office template (records template). Change: none (edit blocked). Leave all else as template default.",
    "Template: Office (read-only).",
    [
        {"n": 1, "action": "Go to Administration > Roles and Permissions > Create Custom Role.",
         "expected": "Template selector opens with Office listed."},
        {"n": 2, "action": "Select the Office system template and attempt to edit its toggles.",
         "expected": "Office opens as a read-only summary; toggles are disabled and cannot be changed."},
        {"n": 3, "action": "Attempt to Save an edited Office-based role.",
         "expected": "Editing/Save is not permitted for Office; no editable custom role can be derived by toggling."},
    ],
    "Office is a non-editable system template and opens read-only.",
    viu(f"{J_TMPL} Office read-only template"))


# ===========================================================================
# SALES REPRESENTATIVE (SALES)
# ===========================================================================
# Enabling a CRUD area: enable Customers V/E
dep = {"action": "Turn ON Customers > View then Customers > Edit.",
       "expected": "Cascade auto-enable lower: enabling Edit auto-enables View; the Customers CRUD area becomes active."}
steps = create_from_template_steps("Sales Representative", "enable Customers > View and Edit (template had CRUD OFF).")
steps += save_assign_verify_steps(
    5, "Sales Representative",
    "open Customers and attempt to view and edit a customer as the user.",
    "User can view and edit Customers.",
    "all other Sales Representative access unchanged (Reports, Full view, Financial, AP/AR, History; other CRUD still OFF).",
    dependency_step=dep)
add("SALES",
    "Sales Representative: ADD Customers View/Edit (cascade), rest intact",
    J_EDIT, "Customers > View/Edit", "Cascade: auto-enable lower", "High", "Dependency",
    admin_login_pre(),
    role_setup("Sales Representative", "Customers > View/Edit", "OFF", "ON"),
    "Template: Sales Representative. Toggle: Customers View+Edit ON.",
    steps,
    "User gains Customers View/Edit only; rest of Sales template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SALES add Customers CRUD"))

# REMOVE: disable Reports (one of the few ON)
steps = create_from_template_steps("Sales Representative", "disable Reports.")
steps += save_assign_verify_steps(
    4, "Sales Representative",
    "attempt to open Reports as the user.",
    "Reports is unavailable to the user.",
    "all other Sales Representative access is unchanged.")
add("SALES",
    "Sales Representative: REMOVE Reports, rest intact",
    J_EDIT, "Reports", "None", "Medium", "Positive",
    admin_login_pre(),
    role_setup("Sales Representative", "Reports", "ON", "OFF"),
    "Template: Sales Representative. Toggle: Reports OFF.",
    steps,
    "Only Reports removed; rest of Sales template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SALES remove Reports"))

# REMOVE with financial gate: disable Financial
dep = {"action": "Turn OFF the Financial access toggle.",
       "expected": "Financial gate confirm modal appears; confirm to proceed."}
steps = create_from_template_steps("Sales Representative", "disable Financial access (expect financial confirm modal).")
steps += save_assign_verify_steps(
    5, "Sales Representative",
    "look for financial figures as the user.",
    "Financial data is hidden for the user.",
    "non-financial Sales Representative access is unchanged.",
    dependency_step=dep)
add("SALES",
    "Sales Representative: REMOVE Financial (financial confirm modal), rest intact",
    J_EDIT, "Financial", "Financial gate: confirm modal", "High", "Dependency",
    admin_login_pre(),
    role_setup("Sales Representative", "Financial", "ON", "OFF"),
    "Template: Sales Representative. Toggle: Financial OFF (confirm modal expected).",
    steps,
    "Financial removed after confirming; rest of template intact.",
    viu(f"{J_EDIT} Edit Custom Role - SALES Financial gate"))

# MULTI: enable Part Sales V/E + enable Catalog V
steps = create_from_template_steps(
    "Sales Representative",
    "enable Part Sales > View/Edit AND enable Catalog > View together.")
steps += save_assign_verify_steps(
    4, "Sales Representative",
    "attempt to view/create a part sale and to view the Catalog as the user.",
    "User can view/edit Part Sales and view the Catalog.",
    "all other Sales Representative access is unchanged.")
add("SALES",
    "Sales Representative: MULTI-toggle add Part Sales V/E + Catalog View, rest intact",
    J_EDIT, "Part Sales > View/Edit; Catalog > View", "Cascade: auto-enable lower", "Medium", "Dependency",
    admin_login_pre(),
    role_setup("Sales Representative", "Part Sales V/E and Catalog View", "OFF/OFF", "ON/ON"),
    "Template: Sales Representative. Toggles: Part Sales V/E ON, Catalog View ON.",
    steps,
    "Exactly Part Sales V/E and Catalog View added; everything else preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SALES multi-toggle"))


# SM extra ADD: enable Timesheets Delete (template Timesheets V/E)
steps = create_from_template_steps("Service Manager", "enable Timesheets > Delete (template had V/E).")
steps += save_assign_verify_steps(
    4, "Service Manager",
    "attempt to delete a timesheet as the user.",
    "User can delete Timesheets.",
    "all other Service Manager access is unchanged.")
add("SM",
    "Service Manager: ADD Timesheets Delete, rest intact",
    J_EDIT, "Timesheets > Delete", "Cascade: auto-enable lower", "Low", "Dependency",
    admin_login_pre(),
    role_setup("Service Manager", "Timesheets > Delete", "OFF", "ON"),
    "Template: Service Manager. Toggle: Timesheets Delete ON.",
    steps,
    "User gains Timesheets Delete only; rest of template preserved.",
    viu(f"{J_EDIT} Edit Custom Role - SM add Timesheets Delete"))

# SADV extra REMOVE reverse cascade: disable WOL Edit -> auto-disable Delete
dep = {"action": "Turn OFF Work Order Lines (WOL) > Edit.",
       "expected": "Reverse cascade: WOL > Delete auto-disables; View remains ON."}
steps = create_from_template_steps("Service Advisor", "disable WOL > Edit (expect reverse cascade removing Delete).")
steps += save_assign_verify_steps(
    5, "Service Advisor",
    "open a Work Order line and attempt to edit and delete it as the user.",
    "User can view WO lines but cannot edit or delete.",
    "all other Service Advisor access is unchanged.",
    dependency_step=dep)
add("SADV",
    "Service Advisor: REMOVE WOL Edit (reverse cascade removes Delete), rest intact",
    J_EDIT, "Work Order Lines > Edit", "Cascade: auto-disable higher (reverse)", "High", "Dependency",
    admin_login_pre(),
    role_setup("Service Advisor", "WOL > Edit", "ON", "OFF"),
    "Template: Service Advisor. Toggle: WOL Edit OFF; expect Delete auto-off.",
    steps,
    "WOL Edit and cascaded Delete removed; View retained; rest of template intact.",
    viu(f"{J_EDIT} Edit Custom Role - SADV reverse cascade"))


# ===========================================================================
# TIME CLOCK (TIMECLK) — NOT EDITABLE
# ===========================================================================
add("TIMECLK",
    "Time Clock template is not editable - opens read-only summary",
    J_TMPL, "N/A (read-only template)", "None", "High", "Negative",
    admin_login_pre(),
    "Start from Time Clock template (records template). Change: none (edit blocked). Leave all else as template default.",
    "Template: Time Clock (read-only).",
    [
        {"n": 1, "action": "Go to Administration > Roles and Permissions > Create Custom Role.",
         "expected": "Template selector opens with Time Clock listed."},
        {"n": 2, "action": "Select the Time Clock system template and attempt to edit its toggles.",
         "expected": "Time Clock opens as a read-only summary; toggles are disabled and cannot be changed."},
        {"n": 3, "action": "Attempt to Save an edited Time Clock-based role.",
         "expected": "Editing/Save is not permitted for Time Clock."},
    ],
    "Time Clock is a non-editable system template and opens read-only.",
    viu(f"{J_TMPL} Time Clock read-only template"))


# ---------------------------------------------------------------------------
# Write + verify
# ---------------------------------------------------------------------------
os.makedirs(OUT_DIR, exist_ok=True)
with open(OUT_FILE, "w") as f:
    json.dump(cases, f, indent=2)

# Reload to verify
with open(OUT_FILE) as f:
    loaded = json.load(f)

assert isinstance(loaded, list)
required_keys = {"test_id", "title", "jira", "permission", "dependency_mode",
                 "priority", "type", "preconditions", "role_setup", "test_data",
                 "steps", "expected_final", "source_viu"}
for c in loaded:
    assert set(c.keys()) == required_keys, f"key mismatch in {c.get('test_id')}: {set(c.keys()) ^ required_keys}"
    assert isinstance(c["steps"], list) and c["steps"], f"bad steps in {c['test_id']}"
    for s in c["steps"]:
        assert set(s.keys()) == {"n", "action", "expected"}, f"bad step keys in {c['test_id']}"

# Per-template counts
per = {}
for c in loaded:
    code = c["test_id"].split("-")[1]
    per[code] = per.get(code, 0) + 1

print(f"OK parsed. total={len(loaded)}")
print("per-template:", json.dumps(per, indent=2))
print("sample IDs:", [c["test_id"] for c in loaded[:8]])
print("all IDs:", [c["test_id"] for c in loaded])
