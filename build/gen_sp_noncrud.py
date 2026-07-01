#!/usr/bin/env python3
"""Generate sp-noncrud.json: manual QA test-case data for ShopView
Custom Roles and Permissions (Epic SV-7388) non-CRUD toggles.

Each test case is a dict with EXACTLY the required keys. We build a list
of dicts and json.dump() it to build/sp-noncrud.json.
"""
import json
import os

OUT_DIR = "/home/user/Manual-test-Cases/build"
OUT_FILE = os.path.join(OUT_DIR, "sp-noncrud.json")

# ---------------------------------------------------------------------------
# Shared building blocks
# ---------------------------------------------------------------------------

ADMIN_FLOW = ("Administration > Roles and Permissions > Create Custom Role > "
              "start from minimal/blank baseline")

VIU = "UNVERIFIED — VIU pending."


def spec(ref):
    return f"Spec: {ref}. {VIU}"


def role_steps(role_setup_desc, assign_note="Assign the custom role to the test user"):
    """Standard admin flow steps shared by most cases (create role + assign)."""
    return [
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}.",
         "expected": "Create Custom Role editor opens with all toggles OFF (blank baseline)."},
        {"n": 2,
         "action": f"Set exactly these toggles: {role_setup_desc}. Click Save.",
         "expected": "Role saves successfully and appears in the Roles and Permissions list."},
        {"n": 3,
         "action": "Go to Administration > Staff. " + assign_note + ".",
         "expected": "Role is assigned; a role change forces logout of the test user."},
        {"n": 4,
         "action": "In a separate browser, log in as the test user.",
         "expected": "Test user session starts with the newly assigned role in effect."},
    ]


cases = []


def add(code, seq, **kw):
    """Assemble one test case dict with all required keys in order."""
    tc = {
        "test_id": f"SP-{code}-{seq:03d}",
        "title": kw["title"],
        "jira": kw["jira"],
        "permission": kw["permission"],
        "dependency_mode": kw["dependency_mode"],
        "priority": kw["priority"],
        "type": kw["type"],
        "preconditions": kw["preconditions"],
        "role_setup": kw["role_setup"],
        "test_data": kw["test_data"],
        "steps": kw["steps"],
        "expected_final": kw["expected_final"],
        "source_viu": kw["source_viu"],
    }
    cases.append(tc)


# ===========================================================================
# WO SUB-SETTINGS (WOSUB) — woReviewWorkOrders / woPickParts / woOrderParts
# Require WO View only (NOT Edit); greyed when WO View OFF.
# Returning a part needs NO permission (note case).
# ===========================================================================

# --- Review Work Orders -----------------------------------------------------
add("WOSUB", 1,
    title="Review Work Orders GRANT — Review option available with WO View + Review",
    jira="SV-7388",
    permission="Review Work Orders (woReviewWorkOrders)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="A work order exists that is in a reviewable state.",
    role_setup="Work Orders: View = ON; Review Work Orders (woReviewWorkOrders) = ON. All other toggles OFF (incl WO Edit OFF).",
    test_data="Work Order WO-REV-001 in a reviewable state.",
    steps=role_steps("Work Orders View ON, Review Work Orders ON, WO Edit OFF") + [
        {"n": 5,
         "action": "Open Work Order WO-REV-001 and locate the Review action.",
         "expected": "The Review option is visible and usable on the work order."},
        {"n": 6,
         "action": "Use the Review option per spec workflow.",
         "expected": "User can perform the Review action; review/approve actions gated by Review permission are permitted."},
    ],
    expected_final="With WO View + Review Work Orders ON (Edit OFF), the user can see and use the Review option on work orders.",
    source_viu=spec("SV-7388 WO sub-settings — woReviewWorkOrders"))

add("WOSUB", 2,
    title="Review Work Orders WITHHOLD — Review option absent when toggle OFF",
    jira="SV-7388",
    permission="Review Work Orders (woReviewWorkOrders)",
    dependency_mode="None",
    priority="High",
    type="Negative",
    preconditions="A work order exists in a reviewable state.",
    role_setup="Work Orders: View = ON; Review Work Orders (woReviewWorkOrders) = OFF. All other toggles OFF.",
    test_data="Work Order WO-REV-002 in a reviewable state.",
    steps=role_steps("Work Orders View ON, Review Work Orders OFF") + [
        {"n": 5,
         "action": "Open Work Order WO-REV-002 and look for the Review action.",
         "expected": "No Review option is available on the work order."},
    ],
    expected_final="With Review Work Orders OFF, the Review option is not available even though WO View is ON.",
    source_viu=spec("SV-7388 WO sub-settings — woReviewWorkOrders"))

add("WOSUB", 3,
    title="Review Work Orders DEPENDENCY — greyed in editor when WO View OFF",
    jira="SV-7388",
    permission="Review Work Orders (woReviewWorkOrders)",
    dependency_mode="Cascade: auto-enable lower",
    priority="High",
    type="Dependency",
    preconditions="Admin can access the Create Custom Role editor.",
    role_setup="In the role editor: Work Orders View = OFF. Observe Review Work Orders (woReviewWorkOrders) toggle state.",
    test_data="N/A — editor-only verification.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}.",
         "expected": "Create Custom Role editor opens with all toggles OFF."},
        {"n": 2,
         "action": "Ensure Work Orders View is OFF. Inspect the Review Work Orders (woReviewWorkOrders) toggle.",
         "expected": "Review Work Orders toggle is greyed out / disabled while WO View is OFF (cannot be enabled)."},
        {"n": 3,
         "action": "Turn Work Orders View ON. Re-inspect the Review Work Orders toggle.",
         "expected": "Review Work Orders toggle becomes enabled and can be toggled once WO View is ON."},
    ],
    expected_final="Review Work Orders is greyed/disabled in the editor while WO View is OFF, and becomes available when WO View is turned ON.",
    source_viu=spec("SV-7388 WO sub-settings require WO View; greyed when View OFF"))

# --- Pick Parts -------------------------------------------------------------
add("WOSUB", 4,
    title="Pick Parts GRANT — can pick parts from inventory onto WO line",
    jira="SV-7388",
    permission="Pick Parts (woPickParts)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="A WO with a parts line exists; matching inventory is on hand.",
    role_setup="Work Orders: View = ON; Pick Parts (woPickParts) = ON. All other toggles OFF (incl WO Edit OFF).",
    test_data="Work Order WO-PICK-001 with a part line; inventory in stock for that part.",
    steps=role_steps("Work Orders View ON, Pick Parts ON, WO Edit OFF") + [
        {"n": 5,
         "action": "Open Work Order WO-PICK-001 and use the pick-parts action to pick the part from inventory onto the WO line.",
         "expected": "User can pick parts from inventory onto the WO line successfully."},
    ],
    expected_final="With WO View + Pick Parts ON (Edit OFF), the user can pick parts from inventory onto a WO line.",
    source_viu=spec("SV-7388 WO sub-settings — woPickParts"))

add("WOSUB", 5,
    title="Pick Parts WITHHOLD — pick action blocked/absent when toggle OFF",
    jira="SV-7388",
    permission="Pick Parts (woPickParts)",
    dependency_mode="None",
    priority="High",
    type="Negative",
    preconditions="A WO with a parts line exists; inventory on hand.",
    role_setup="Work Orders: View = ON; Pick Parts (woPickParts) = OFF. All other toggles OFF.",
    test_data="Work Order WO-PICK-002 with a part line; inventory in stock.",
    steps=role_steps("Work Orders View ON, Pick Parts OFF") + [
        {"n": 5,
         "action": "Open Work Order WO-PICK-002 and attempt to pick parts from inventory onto the WO line.",
         "expected": "The pick-parts action is absent or blocked; user cannot pick parts onto the WO line."},
    ],
    expected_final="With Pick Parts OFF, the user cannot pick parts from inventory onto a WO line.",
    source_viu=spec("SV-7388 WO sub-settings — woPickParts"))

add("WOSUB", 6,
    title="Pick Parts DEPENDENCY — greyed in editor when WO View OFF",
    jira="SV-7388",
    permission="Pick Parts (woPickParts)",
    dependency_mode="Cascade: auto-enable lower",
    priority="Medium",
    type="Dependency",
    preconditions="Admin can access the Create Custom Role editor.",
    role_setup="In the role editor: Work Orders View = OFF. Observe Pick Parts (woPickParts) toggle state.",
    test_data="N/A — editor-only verification.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}.",
         "expected": "Create Custom Role editor opens with all toggles OFF."},
        {"n": 2,
         "action": "Ensure Work Orders View is OFF. Inspect the Pick Parts (woPickParts) toggle.",
         "expected": "Pick Parts toggle is greyed out / disabled while WO View is OFF."},
        {"n": 3,
         "action": "Turn Work Orders View ON. Re-inspect the Pick Parts toggle.",
         "expected": "Pick Parts toggle becomes enabled once WO View is ON."},
    ],
    expected_final="Pick Parts is greyed/disabled while WO View is OFF and becomes available when WO View is ON.",
    source_viu=spec("SV-7388 WO sub-settings require WO View; greyed when View OFF"))

# --- Order Parts ------------------------------------------------------------
add("WOSUB", 7,
    title="Order Parts GRANT — place PO for parts on WO and receive deliveries",
    jira="SV-7388",
    permission="Order Parts (woOrderParts)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="A WO with a parts line exists; a vendor is available for ordering.",
    role_setup="Work Orders: View = ON; Order Parts (woOrderParts) = ON. All other toggles OFF (incl WO Edit OFF).",
    test_data="Work Order WO-ORD-001 with a part line requiring order; vendor available.",
    steps=role_steps("Work Orders View ON, Order Parts ON, WO Edit OFF") + [
        {"n": 5,
         "action": "Open Work Order WO-ORD-001 and place a PO for the part on the WO line.",
         "expected": "A PO is created and linked to the WO."},
        {"n": 6,
         "action": "Receive the parts delivery onto the WO.",
         "expected": "User can receive the parts delivery onto the WO successfully."},
    ],
    expected_final="With WO View + Order Parts ON (Edit OFF), the user can place a PO linked to the WO and receive parts deliveries onto the WO.",
    source_viu=spec("SV-7388 WO sub-settings — woOrderParts"))

add("WOSUB", 8,
    title="Order Parts WITHHOLD — cannot place PO or receive parts when OFF",
    jira="SV-7388",
    permission="Order Parts (woOrderParts)",
    dependency_mode="None",
    priority="High",
    type="Negative",
    preconditions="A WO with a parts line exists; vendor available.",
    role_setup="Work Orders: View = ON; Order Parts (woOrderParts) = OFF. All other toggles OFF.",
    test_data="Work Order WO-ORD-002 with a part line requiring order.",
    steps=role_steps("Work Orders View ON, Order Parts OFF") + [
        {"n": 5,
         "action": "Open Work Order WO-ORD-002 and attempt to place a PO for the part on the WO line.",
         "expected": "The order-parts / create-PO action is absent or blocked."},
        {"n": 6,
         "action": "Attempt to receive a parts delivery onto the WO.",
         "expected": "The receive-parts action onto the WO is absent or blocked."},
    ],
    expected_final="With Order Parts OFF, the user cannot place a PO for parts on the WO nor receive parts deliveries onto the WO.",
    source_viu=spec("SV-7388 WO sub-settings — woOrderParts"))

add("WOSUB", 9,
    title="Order Parts DEPENDENCY — greyed in editor when WO View OFF",
    jira="SV-7388",
    permission="Order Parts (woOrderParts)",
    dependency_mode="Cascade: auto-enable lower",
    priority="Medium",
    type="Dependency",
    preconditions="Admin can access the Create Custom Role editor.",
    role_setup="In the role editor: Work Orders View = OFF. Observe Order Parts (woOrderParts) toggle state.",
    test_data="N/A — editor-only verification.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}.",
         "expected": "Create Custom Role editor opens with all toggles OFF."},
        {"n": 2,
         "action": "Ensure Work Orders View is OFF. Inspect the Order Parts (woOrderParts) toggle.",
         "expected": "Order Parts toggle is greyed out / disabled while WO View is OFF."},
        {"n": 3,
         "action": "Turn Work Orders View ON. Re-inspect the Order Parts toggle.",
         "expected": "Order Parts toggle becomes enabled once WO View is ON."},
    ],
    expected_final="Order Parts is greyed/disabled while WO View is OFF and becomes available when WO View is ON.",
    source_viu=spec("SV-7388 WO sub-settings require WO View; greyed when View OFF"))

add("WOSUB", 10,
    title="WO sub-settings are INDEPENDENT — enabling one does not enable others",
    jira="SV-7388",
    permission="Review Work Orders / Pick Parts / Order Parts (woReviewWorkOrders, woPickParts, woOrderParts)",
    dependency_mode="None",
    priority="Medium",
    type="Dependency",
    preconditions="A WO exists with parts lines.",
    role_setup="Work Orders: View = ON; Pick Parts (woPickParts) = ON; Review Work Orders = OFF; Order Parts = OFF.",
    test_data="Work Order WO-IND-001 with parts line; inventory on hand; vendor available.",
    steps=role_steps("Work Orders View ON, Pick Parts ON, Review OFF, Order Parts OFF") + [
        {"n": 5,
         "action": "Open WO-IND-001. Verify pick-parts is available.",
         "expected": "Pick Parts action is available (its toggle is ON)."},
        {"n": 6,
         "action": "Look for the Review option and the order-parts/create-PO action.",
         "expected": "Neither the Review option nor the order-parts action is available (those toggles are OFF)."},
    ],
    expected_final="The three WO sub-settings are independent: enabling Pick Parts grants only pick-parts, not Review or Order Parts.",
    source_viu=spec("SV-7388 WO sub-settings are three independent toggles"))

add("WOSUB", 11,
    title="Return part from WO line requires NO permission (note case)",
    jira="SV-7388",
    permission="(none) — returning a part from a WO line is not permission-gated",
    dependency_mode="None",
    priority="Medium",
    type="Positive",
    preconditions="A WO exists with a part that has been picked/added to a line and can be returned.",
    role_setup="Work Orders: View = ON; Pick Parts = OFF; Order Parts = OFF; Review = OFF. All WO sub-settings OFF.",
    test_data="Work Order WO-RET-001 with a returnable part on a line.",
    steps=role_steps("Work Orders View ON, all WO sub-settings OFF") + [
        {"n": 5,
         "action": "Open WO-RET-001 and return the part from the WO line.",
         "expected": "The return-part action is available and succeeds even though Pick Parts, Order Parts, and Review are all OFF."},
    ],
    expected_final="Returning a part from a WO line requires no specific WO sub-setting permission; it works with only WO View.",
    source_viu=spec("SV-7388 — returning a part from a WO line needs no permission"))

# ===========================================================================
# PAGE TOGGLES: Reports (RPT), Customer Portal (CPORT), Billing Portal (BPORT),
# Parts Department (PDEPT parent gate)
# ===========================================================================

# --- Reports ----------------------------------------------------------------
add("RPT", 1,
    title="Reports GRANT — Reports nav visible and all reports accessible",
    jira="SV-7388",
    permission="Reports (reports)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="Reporting data exists to render at least one report.",
    role_setup="Reports (reports) = ON. All other toggles OFF.",
    test_data="Existing operational data for reports.",
    steps=role_steps("Reports ON") + [
        {"n": 5,
         "action": "Locate the Reports navigation entry and open it.",
         "expected": "Reports nav is visible; the Reports area opens."},
        {"n": 6,
         "action": "Open several available reports.",
         "expected": "All reports are accessible (all-or-nothing; no per-report granularity)."},
    ],
    expected_final="With Reports ON, the Reports nav is shown and every report is accessible.",
    source_viu=spec("SV-7388 Reports — all-or-nothing, no per-report granularity"))

add("RPT", 2,
    title="Reports WITHHOLD — nav hidden and direct URL blocked when OFF",
    jira="SV-7388",
    permission="Reports (reports)",
    dependency_mode="None",
    priority="High",
    type="Negative",
    preconditions="Reporting data exists.",
    role_setup="Reports (reports) = OFF. All other toggles OFF.",
    test_data="Direct URL to the Reports area.",
    steps=role_steps("Reports OFF") + [
        {"n": 5,
         "action": "Look for the Reports navigation entry.",
         "expected": "Reports nav is hidden / absent."},
        {"n": 6,
         "action": "Navigate directly to the Reports URL.",
         "expected": "Access is blocked; the Reports area does not load for this user."},
    ],
    expected_final="With Reports OFF, the Reports nav is hidden and direct URL access is blocked.",
    source_viu=spec("SV-7388 Reports OFF hides Reports nav"))

add("RPT", 3,
    title="Reports ON with Timesheets View OFF still shows timesheet activities report",
    jira="SV-7388",
    permission="Reports (reports)",
    dependency_mode="None",
    priority="Medium",
    type="Dependency",
    preconditions="Timesheet activity data exists.",
    role_setup="Reports (reports) = ON; Timesheets View = OFF. All other toggles OFF.",
    test_data="Existing timesheet activity data.",
    steps=role_steps("Reports ON, Timesheets View OFF") + [
        {"n": 5,
         "action": "Open Reports and locate the timesheet activities report.",
         "expected": "The timesheet activities report is available and viewable despite Timesheets View being OFF."},
    ],
    expected_final="Reports ON exposes the timesheet activities report even when Timesheets View is OFF.",
    source_viu=spec("SV-7388 note — Timesheets View OFF + Reports ON still shows timesheet activities report"))

# --- Customer Portal --------------------------------------------------------
add("CPORT", 1,
    title="Customer Portal GRANT — access and manage customer portal config",
    jira="SV-7388",
    permission="Customer Portal (customerPortal)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="Customer portal feature is provisioned for the org.",
    role_setup="Customer Portal (customerPortal) = ON. All other toggles OFF.",
    test_data="Existing customer portal configuration.",
    steps=role_steps("Customer Portal ON") + [
        {"n": 5,
         "action": "Locate the Customer Portal navigation entry and open it.",
         "expected": "Customer Portal nav is visible and the config area opens."},
        {"n": 6,
         "action": "Access and manage the customer portal configuration.",
         "expected": "User can access and manage customer portal config."},
    ],
    expected_final="With Customer Portal ON, the user can access and manage the customer portal configuration.",
    source_viu=spec("SV-7388 Customer Portal — customerPortal"))

add("CPORT", 2,
    title="Customer Portal WITHHOLD — nav hidden and direct URL blocked when OFF",
    jira="SV-7388",
    permission="Customer Portal (customerPortal)",
    dependency_mode="None",
    priority="High",
    type="Negative",
    preconditions="Customer portal feature is provisioned.",
    role_setup="Customer Portal (customerPortal) = OFF. All other toggles OFF.",
    test_data="Direct URL to the Customer Portal config area.",
    steps=role_steps("Customer Portal OFF") + [
        {"n": 5,
         "action": "Look for the Customer Portal navigation entry.",
         "expected": "Customer Portal nav is hidden / absent."},
        {"n": 6,
         "action": "Navigate directly to the Customer Portal config URL.",
         "expected": "Access is blocked; the customer portal config does not load."},
    ],
    expected_final="With Customer Portal OFF, the nav is hidden and direct URL access is blocked.",
    source_viu=spec("SV-7388 Customer Portal OFF hides nav"))

# --- Billing Portal ---------------------------------------------------------
add("BPORT", 1,
    title="Billing Portal GRANT — access and manage billing portal",
    jira="SV-7388",
    permission="Billing Portal (billingPortal)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="Billing portal feature is provisioned for the org.",
    role_setup="Billing Portal (billingPortal) = ON. All other toggles OFF.",
    test_data="Existing billing portal configuration.",
    steps=role_steps("Billing Portal ON") + [
        {"n": 5,
         "action": "Locate the Billing Portal navigation entry and open it.",
         "expected": "Billing Portal nav is visible and the area opens."},
        {"n": 6,
         "action": "Access and manage the billing portal.",
         "expected": "User can access and manage the billing portal."},
    ],
    expected_final="With Billing Portal ON, the user can access and manage the billing portal.",
    source_viu=spec("SV-7388 Billing Portal — billingPortal"))

add("BPORT", 2,
    title="Billing Portal WITHHOLD — nav hidden and direct URL blocked when OFF",
    jira="SV-7388",
    permission="Billing Portal (billingPortal)",
    dependency_mode="None",
    priority="High",
    type="Negative",
    preconditions="Billing portal feature is provisioned.",
    role_setup="Billing Portal (billingPortal) = OFF. All other toggles OFF.",
    test_data="Direct URL to the Billing Portal area.",
    steps=role_steps("Billing Portal OFF") + [
        {"n": 5,
         "action": "Look for the Billing Portal navigation entry.",
         "expected": "Billing Portal nav is hidden / absent."},
        {"n": 6,
         "action": "Navigate directly to the Billing Portal URL.",
         "expected": "Access is blocked; the billing portal does not load."},
    ],
    expected_final="With Billing Portal OFF, the nav is hidden and direct URL access is blocked.",
    source_viu=spec("SV-7388 Billing Portal OFF hides nav"))

# --- Parts Department (PARENT GATE) ----------------------------------------
add("PDEPT", 1,
    title="Parts Department GRANT — parent ON reveals children per their CRUD",
    jira="SV-7388",
    permission="Parts Department (partsDepartment)",
    dependency_mode="Parent gate: hide children",
    priority="High",
    type="Positive",
    preconditions="Parts data exists for Part Sales, Catalog & Inventory, and Vendor & Order Management.",
    role_setup="Parts Department (partsDepartment) = ON; Part Sales View = ON; Catalog & Inventory View = ON; Vendor & Order Management View = ON. All other toggles OFF.",
    test_data="Existing parts, catalog, inventory, and vendor/order records.",
    steps=role_steps("Parts Department ON; Part Sales/Catalog & Inventory/Vendor & Order Management View ON") + [
        {"n": 5,
         "action": "Verify Part Sales, Catalog & Inventory, and Vendor & Order Management are accessible.",
         "expected": "All three children are accessible, each subject to its own CRUD."},
    ],
    expected_final="With Parts Department ON and children's CRUD granted, all three child areas are accessible.",
    source_viu=spec("SV-7388 Parts Department parent gate — partsDepartment"))

add("PDEPT", 2,
    title="Parts Department PARENT-GATE — OFF makes all children inaccessible regardless of their CRUD",
    jira="SV-7388",
    permission="Parts Department (partsDepartment)",
    dependency_mode="Parent gate: hide children",
    priority="Critical",
    type="Dependency",
    preconditions="Parts data exists.",
    role_setup="Parts Department (partsDepartment) = OFF; Part Sales View = ON; Catalog & Inventory View = ON; Vendor & Order Management View = ON (children CRUD granted but parent OFF).",
    test_data="Existing parts, catalog, inventory, and vendor/order records; direct URLs to each child area.",
    steps=role_steps("Parts Department OFF; all three children View ON") + [
        {"n": 5,
         "action": "Look for Part Sales, Catalog & Inventory, and Vendor & Order Management in navigation.",
         "expected": "None of the three child areas are accessible even though their CRUD is granted."},
        {"n": 6,
         "action": "Attempt direct URL access to each of the three child areas.",
         "expected": "Direct URL access is blocked for all three children."},
    ],
    expected_final="With Parts Department OFF, all three children are inaccessible regardless of their own CRUD, and direct URLs are blocked.",
    source_viu=spec("SV-7388 Parts Department OFF gates all three children"))

add("PDEPT", 3,
    title="Parts Department DEPENDENCY — children HIDDEN via slide in editor when parent OFF",
    jira="SV-7388",
    permission="Parts Department (partsDepartment)",
    dependency_mode="Parent gate: hide children",
    priority="High",
    type="Dependency",
    preconditions="Admin can access the Create Custom Role editor.",
    role_setup="In the role editor: toggle Parts Department (partsDepartment) OFF then ON and observe the three child rows.",
    test_data="N/A — editor-only verification.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}.",
         "expected": "Create Custom Role editor opens with all toggles OFF."},
        {"n": 2,
         "action": "With Parts Department OFF, look for Part Sales, Catalog & Inventory, and Vendor & Order Management rows.",
         "expected": "The three child rows are hidden via slide while Parts Department is OFF."},
        {"n": 3,
         "action": "Turn Parts Department ON.",
         "expected": "The three child rows slide into view and become editable."},
    ],
    expected_final="In the editor the three child rows are hidden via slide when Parts Department is OFF and re-revealed when it is ON.",
    source_viu=spec("SV-7388 Parts Department editor slide-hides children when OFF"))

add("PDEPT", 4,
    title="Parts Department PRESERVES child settings — OFF then back ON restores prior CRUD",
    jira="SV-7388",
    permission="Parts Department (partsDepartment)",
    dependency_mode="Parent gate: hide children",
    priority="High",
    type="Dependency",
    preconditions="A role with Parts Department ON and specific child CRUD configured exists.",
    role_setup="Start with Parts Department ON and specific child CRUD (e.g. Part Sales View+Edit, Catalog & Inventory View, Vendor & Order Management View). Then turn Parts Department OFF, Save; then turn it back ON.",
    test_data="Role RN-PDEPT-PRES with configured child CRUD.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}. Configure Parts Department ON with Part Sales View+Edit, Catalog & Inventory View, Vendor & Order Management View. Save.",
         "expected": "Role saved with the specified child CRUD."},
        {"n": 2,
         "action": "Edit the role, turn Parts Department OFF, and Save.",
         "expected": "Role saves; child rows are hidden while parent is OFF."},
        {"n": 3,
         "action": "Edit the role again and turn Parts Department back ON.",
         "expected": "The previously configured child CRUD is preserved and restored (Part Sales View+Edit, Catalog & Inventory View, Vendor & Order Management View)."},
    ],
    expected_final="Turning Parts Department OFF preserves child settings, which are restored intact when it is turned back ON.",
    source_viu=spec("SV-7388 Parts Department preserves child settings across OFF/ON"))

# ===========================================================================
# SETTINGS (SET) — parent 'settings' + sub-toggles
# ===========================================================================

SETTINGS_SUBS = [
    ("SETAPP", "App Settings", "settingsApp",
     "org info/branding, Roles & Permissions management, and Staff/Workplaces management",
     "Administration area shows org info/branding editing, Roles & Permissions management, and Staff/Workplaces management"),
    ("SETSVC", "Service", "settingsService",
     "labor types, canned lines, asset types, departments, and Digital Inspections",
     "Service settings (labor types, canned lines, asset types, departments, Digital Inspections) are manageable"),
    ("SETPRT", "Parts", "settingsParts",
     "pricing matrices, categories, and parts config",
     "Parts settings (pricing matrices, categories, parts config) are manageable"),
    ("SETINT", "Integrations", "settingsIntegrations",
     "QuickBooks, IBS, and Open API",
     "Integrations settings (QuickBooks, IBS, Open API) are manageable"),
    ("SETFIN", "Finance", "settingsFinance",
     "tax config and payment settings/methods",
     "Finance settings (tax config, payment settings/methods) are manageable"),
    ("SETIMP", "Data Import", "settingsDataImport",
     "bulk import",
     "Data Import (bulk import) is available"),
    ("SETWAGE", "View/Manage Wages", "settingsWages",
     "view/manage employee wage rates (sensitive)",
     "Employee wage rates can be viewed/managed (sensitive)"),
]

# Parent settings ON/OFF cases
add("SET", 1,
    title="Settings parent GRANT — Administration area accessible with a sub ON",
    jira="SV-7388",
    permission="Settings (settings) [parent]",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="Org has settings data to manage.",
    role_setup="Settings (settings) = ON; App Settings (settingsApp) = ON. All other toggles OFF.",
    test_data="Existing org/settings data.",
    steps=role_steps("Settings parent ON; App Settings ON") + [
        {"n": 5,
         "action": "Locate the Administration area in navigation and open it.",
         "expected": "The Administration area is visible and opens; App Settings sub-area is available."},
    ],
    expected_final="With Settings parent ON and App Settings ON, the Administration area is accessible.",
    source_viu=spec("SV-7388 Settings parent — settings"))

add("SET", 2,
    title="Settings parent WITHHOLD — parent OFF hides entire Administration area and all subs",
    jira="SV-7388",
    permission="Settings (settings) [parent]",
    dependency_mode="Parent gate: hide children",
    priority="Critical",
    type="Dependency",
    preconditions="Org has settings data.",
    role_setup="Settings (settings) = OFF; App Settings = ON; Service = ON; Parts = ON; Integrations = ON; Finance = ON; Data Import = ON; View/Manage Wages = ON (all subs ON but parent OFF).",
    test_data="Direct URL to the Administration area.",
    steps=role_steps("Settings parent OFF; all sub-settings ON") + [
        {"n": 5,
         "action": "Look for the Administration area in navigation.",
         "expected": "The entire Administration area is hidden despite all sub-settings being ON."},
        {"n": 6,
         "action": "Attempt direct URL access to the Administration area and its sub-settings.",
         "expected": "Access is blocked; no sub-setting is reachable while the parent is OFF."},
    ],
    expected_final="With Settings parent OFF, the whole Administration area and all sub-settings are hidden/blocked regardless of sub state.",
    source_viu=spec("SV-7388 Settings parent OFF hides Administration and all subs"))

add("SET", 3,
    title="Settings parent DEPENDENCY — subs hidden via slide in editor when parent OFF",
    jira="SV-7388",
    permission="Settings (settings) [parent]",
    dependency_mode="Parent gate: hide children",
    priority="High",
    type="Dependency",
    preconditions="Admin can access the Create Custom Role editor.",
    role_setup="In the role editor: toggle Settings (settings) OFF then ON and observe the sub-setting rows.",
    test_data="N/A — editor-only verification.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}.",
         "expected": "Create Custom Role editor opens with all toggles OFF."},
        {"n": 2,
         "action": "With Settings parent OFF, look for the sub-setting rows (App Settings, Service, Parts, Integrations, Finance, Data Import, View/Manage Wages).",
         "expected": "All sub-setting rows are hidden via slide while the parent is OFF."},
        {"n": 3,
         "action": "Turn Settings parent ON.",
         "expected": "The sub-setting rows slide into view and become editable."},
    ],
    expected_final="Sub-settings are slide-hidden in the editor when the Settings parent is OFF and revealed when it is ON.",
    source_viu=spec("SV-7388 Settings editor slide-hides subs when parent OFF"))

# Per-sub GRANT + WITHHOLD cases
seq = 4
for code, name, key, scope, grant_expect in SETTINGS_SUBS:
    add("SET", seq,
        title=f"{name} sub GRANT — manage {scope}",
        jira="SV-7388",
        permission=f"{name} ({key})",
        dependency_mode="None",
        priority="High" if key in ("settingsApp", "settingsFinance", "settingsWages") else "Medium",
        type="Positive",
        preconditions=f"Data exists for {name} settings.",
        role_setup=f"Settings (settings) = ON; {name} ({key}) = ON. All other sub-settings OFF.",
        test_data=f"Existing {name} settings data.",
        steps=role_steps(f"Settings parent ON; {name} ON, all other subs OFF") + [
            {"n": 5,
             "action": f"Open Administration and navigate to {name}.",
             "expected": f"{grant_expect}."},
            {"n": 6,
             "action": "Confirm other sub-setting areas are not accessible.",
             "expected": "Only the enabled sub-setting is available; other subs remain hidden/blocked."},
        ],
        expected_final=f"With {name} ON (parent ON), the user can manage {scope}; other subs remain inaccessible.",
        source_viu=spec(f"SV-7388 Settings sub — {key}"))
    seq += 1

    add("SET", seq,
        title=f"{name} sub WITHHOLD — area hidden/blocked when {key} OFF (parent ON)",
        jira="SV-7388",
        permission=f"{name} ({key})",
        dependency_mode="None",
        priority="Medium",
        type="Negative",
        preconditions=f"Data exists for {name} settings.",
        role_setup=f"Settings (settings) = ON; {name} ({key}) = OFF. All other sub-settings OFF.",
        test_data=f"Direct URL to the {name} settings area.",
        steps=role_steps(f"Settings parent ON; {name} OFF") + [
            {"n": 5,
             "action": f"Look for {name} under Administration.",
             "expected": f"{name} settings are hidden / not available."},
            {"n": 6,
             "action": f"Attempt direct URL access to the {name} settings area.",
             "expected": "Access is blocked."},
        ],
        expected_final=f"With {name} OFF (parent ON), the {name} settings area is hidden and direct URL access is blocked.",
        source_viu=spec(f"SV-7388 Settings sub — {key}"))
    seq += 1

# App-Settings-gates-Roles/Staff dependency case
add("SET", seq,
    title="App Settings gates Roles & Permissions and Staff/Workplaces management",
    jira="SV-7388",
    permission="App Settings (settingsApp)",
    dependency_mode="None",
    priority="Critical",
    type="Dependency",
    preconditions="Org has roles and staff records.",
    role_setup="Settings (settings) = ON; App Settings (settingsApp) = OFF. All other sub-settings OFF.",
    test_data="Existing roles and staff/workplace records; direct URLs to Roles and Permissions and Staff.",
    steps=role_steps("Settings parent ON; App Settings OFF") + [
        {"n": 5,
         "action": "Attempt to reach Roles and Permissions management and Staff/Workplaces management.",
         "expected": "Both are unavailable because managing roles/staff requires App Settings, which is OFF."},
        {"n": 6,
         "action": "Attempt direct URL access to Roles and Permissions and Staff.",
         "expected": "Access is blocked for both."},
    ],
    expected_final="Managing Roles & Permissions and Staff/Workplaces requires App Settings ON; with it OFF, both are blocked.",
    source_viu=spec("SV-7388 App Settings gates Roles & Permissions and Staff management"))
seq += 1

add("SET", seq,
    title="View/Manage Wages is sensitive and independent from other Service/Parts subs",
    jira="SV-7388",
    permission="View/Manage Wages (settingsWages)",
    dependency_mode="None",
    priority="High",
    type="Security",
    preconditions="Employee wage rates exist.",
    role_setup="Settings (settings) = ON; App Settings (settingsApp) = ON; View/Manage Wages (settingsWages) = OFF. All other subs OFF.",
    test_data="Employee records with wage rates.",
    steps=role_steps("Settings parent ON; App Settings ON; View/Manage Wages OFF") + [
        {"n": 5,
         "action": "Navigate to areas where employee wage rates would appear (e.g. Staff management under App Settings).",
         "expected": "Employee wage rates are not viewable/manageable because View/Manage Wages is OFF, even though App Settings (staff management) is ON."},
    ],
    expected_final="View/Manage Wages independently gates sensitive wage data; App Settings ON does not expose wage rates.",
    source_viu=spec("SV-7388 View/Manage Wages — settingsWages sensitive and independent"))
seq += 1

# ===========================================================================
# VIEW MODE (VM) — viewMode = tech | full
# ===========================================================================

add("VM", 1,
    title="Full View GRANT — all fields, approve/review/split, Send to Portal, actual Estimate",
    jira="SV-7388",
    permission="View Mode (viewMode) = full",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="A WO with lines exists that supports approve/review/split and portal send.",
    role_setup="View Mode (viewMode) = full; Work Orders View = ON; Work Orders Edit = ON; Review Work Orders (woReviewWorkOrders) = ON. All other toggles OFF.",
    test_data="Work Order WO-VM-FULL-001 with lines.",
    steps=role_steps("View Mode = full; WO View+Edit ON; Review Work Orders ON") + [
        {"n": 5,
         "action": "Open WO-VM-FULL-001 and inspect the line fields and the Estimate column.",
         "expected": "All fields are visible (subject to CRUD); the Estimate column shows the actual estimate; the full parts request form is available."},
        {"n": 6,
         "action": "Check for approve, review, and split actions and the Send to Portal button.",
         "expected": "Approve/review/split actions are available (Review governed by Review Work Order permission); the Send to Portal button is present."},
    ],
    expected_final="Full View exposes all fields, approve/review/split actions, Send to Portal, and the actual Estimate column.",
    source_viu=spec("SV-7388 View Mode Full — viewMode=full"))

# Tech View restriction cases
TECH_RESTRICTIONS = [
    ("Estimate column shows Tech Time (not actual estimate)",
     "Open WO-VM-TECH-001 and inspect the Estimate column.",
     "In Tech View the Estimate column shows Tech Time rather than the actual estimate."),
    ("No tech time field is shown",
     "Inspect the WO line for a tech time input field.",
     "There is no tech time field in Tech View."),
    ("No approve action / cannot approve lines",
     "Look for the approve action on WO lines and attempt to approve a line.",
     "There is no approve action; the user cannot approve lines in Tech View."),
    ("Cannot Send to Portal",
     "Look for the Send to Portal button on the WO.",
     "The Send to Portal button is not available in Tech View."),
    ("Cannot view labor rates",
     "Look for labor rate values on the WO.",
     "Labor rates are not viewable in Tech View."),
    ("Limited parts request form",
     "Open the parts request form from the WO.",
     "Tech View presents the limited parts request form (not the full form)."),
    ("Cannot edit existing WO lines (create-only)",
     "Attempt to edit an existing WO line, then attempt to create a new line.",
     "Editing existing WO lines is blocked; only creating new lines is allowed (create-only) in Tech View."),
    ("WO lines read-only after approval",
     "Open a WO whose lines have been approved and attempt to modify an approved line.",
     "Approved WO lines are read-only in Tech View."),
]

vm_seq = 2
for restriction, action, expected in TECH_RESTRICTIONS:
    add("VM", vm_seq,
        title=f"Tech View restriction — {restriction}",
        jira="SV-7388",
        permission="View Mode (viewMode) = tech",
        dependency_mode="None",
        priority="High" if "approve" in restriction.lower() or "labor rates" in restriction.lower() or "Send to Portal" in restriction else "Medium",
        type="Positive",
        preconditions="A WO with lines exists (some approved where relevant).",
        role_setup="View Mode (viewMode) = tech; Work Orders View = ON; Work Orders Edit = ON. All other toggles OFF.",
        test_data="Work Order WO-VM-TECH-001 with lines (including approved lines where relevant).",
        steps=role_steps("View Mode = tech; WO View+Edit ON") + [
            {"n": 5, "action": action, "expected": expected},
        ],
        expected_final=f"Tech View enforces the restriction: {restriction.lower()}.",
        source_viu=spec("SV-7388 View Mode Tech restrictions vs Full — viewMode=tech"))
    vm_seq += 1

add("VM", vm_seq,
    title="Send to Portal appears only in Full View (not Tech) — comparison",
    jira="SV-7388",
    permission="View Mode (viewMode)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="A WO exists that can be sent to the portal.",
    role_setup="Create two roles: (A) View Mode = full, WO View+Edit ON; (B) View Mode = tech, WO View+Edit ON. Assign each to a separate test user.",
    test_data="Work Order WO-VM-CMP-001.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}. Create role A: View Mode = full, WO View+Edit ON. Save.",
         "expected": "Role A saved."},
        {"n": 2,
         "action": "Create role B: View Mode = tech, WO View+Edit ON. Save.",
         "expected": "Role B saved."},
        {"n": 3,
         "action": "Assign role A to user A and role B to user B via Administration > Staff.",
         "expected": "Both users have their roles; role changes force logout."},
        {"n": 4,
         "action": "Log in as user A (Full) and open WO-VM-CMP-001; check for Send to Portal.",
         "expected": "Send to Portal button is present in Full View."},
        {"n": 5,
         "action": "Log in as user B (Tech) and open WO-VM-CMP-001; check for Send to Portal.",
         "expected": "Send to Portal button is absent in Tech View."},
    ],
    expected_final="Send to Portal is available only in Full View; it is not shown in Tech View.",
    source_viu=spec("SV-7388 View Mode — Send to Portal only in Full View"))
vm_seq += 1

add("VM", vm_seq,
    title="View Mode is NOT a security boundary — financial columns governed by See Financial Data",
    jira="SV-7388",
    permission="View Mode (viewMode) vs See Financial Data (seeFinancialData)",
    dependency_mode="None",
    priority="High",
    type="Security",
    preconditions="A WO with financial columns exists.",
    role_setup="View Mode (viewMode) = full; See Financial Data (seeFinancialData) = OFF; Work Orders View = ON. All other toggles OFF.",
    test_data="Work Order WO-VM-SEC-001 with financial columns.",
    steps=role_steps("View Mode = full; See Financial Data OFF; WO View ON") + [
        {"n": 5,
         "action": "Open WO-VM-SEC-001 and inspect for financial columns/pricing.",
         "expected": "Financial columns are hidden because See Financial Data is OFF, even though View Mode is Full — View Mode controls UI complexity, not financial data visibility."},
    ],
    expected_final="Full View does not expose financial data; financial column visibility is governed by See Financial Data, confirming View Mode is not a security boundary.",
    source_viu=spec("SV-7388 View Mode controls UI complexity not data access; financial via See Financial Data"))
vm_seq += 1

# ===========================================================================
# CROSS-CUTTING: See Financial Data (FIN)
# ===========================================================================

add("FIN", 1,
    title="See Financial Data GRANT — pricing/costs/margins/financial columns shown app-wide",
    jira="SV-7388",
    permission="See Financial Data (seeFinancialData)",
    dependency_mode="None",
    priority="Critical",
    type="Positive",
    preconditions="Records with financial data exist across WOs, parts, and reports.",
    role_setup="See Financial Data (seeFinancialData) = ON; Work Orders View = ON. All other toggles OFF.",
    test_data="Work Orders, parts, and customer records with pricing/cost/margin data.",
    steps=role_steps("See Financial Data ON; WO View ON") + [
        {"n": 5,
         "action": "Open a WO and other areas (parts, customer) and inspect financial columns.",
         "expected": "Pricing, costs, margins, and financial columns are visible app-wide."},
    ],
    expected_final="With See Financial Data ON, financial data (pricing/costs/margins/columns) is visible app-wide.",
    source_viu=spec("SV-7388 See Financial Data — seeFinancialData"))

add("FIN", 2,
    title="See Financial Data WITHHOLD — ALL financial data hidden everywhere when OFF",
    jira="SV-7388",
    permission="See Financial Data (seeFinancialData)",
    dependency_mode="None",
    priority="Critical",
    type="Negative",
    preconditions="Records with financial data exist across the app.",
    role_setup="See Financial Data (seeFinancialData) = OFF; Work Orders View = ON. All other toggles OFF.",
    test_data="Work Orders, parts, and customer records with financial data.",
    steps=role_steps("See Financial Data OFF; WO View ON") + [
        {"n": 5,
         "action": "Open a WO and other areas and inspect for any pricing/cost/margin/financial columns.",
         "expected": "All financial data is hidden everywhere (no pricing, costs, margins, or financial columns)."},
    ],
    expected_final="With See Financial Data OFF, all financial data is hidden app-wide.",
    source_viu=spec("SV-7388 See Financial Data OFF hides all financial data everywhere"))

add("FIN", 3,
    title="See Financial Data OFF still allows CRUD (data operations unaffected)",
    jira="SV-7388",
    permission="See Financial Data (seeFinancialData)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="A WO exists that the user can edit.",
    role_setup="See Financial Data (seeFinancialData) = OFF; Work Orders View = ON; Work Orders Edit = ON. All other toggles OFF.",
    test_data="Work Order WO-FIN-CRUD-001.",
    steps=role_steps("See Financial Data OFF; WO View+Edit ON") + [
        {"n": 5,
         "action": "Open WO-FIN-CRUD-001 and perform edit operations (non-financial fields).",
         "expected": "CRUD operations succeed even though financial data is hidden; See Financial Data does not gate CRUD."},
    ],
    expected_final="See Financial Data OFF hides financial data but still allows CRUD operations to proceed.",
    source_viu=spec("SV-7388 See Financial Data OFF still allows CRUD"))

add("FIN", 4,
    title="Financial gate — enabling Part Sales CRUD while Financial OFF triggers confirm modal",
    jira="SV-7388",
    permission="See Financial Data (seeFinancialData) — gates Part Sales",
    dependency_mode="Financial gate: confirm modal",
    priority="Critical",
    type="Dependency",
    preconditions="Admin is in the Create Custom Role editor.",
    role_setup="In the editor with See Financial Data = OFF, enable Part Sales CRUD; observe the financial confirm modal.",
    test_data="N/A — editor-only verification.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}. Confirm See Financial Data is OFF.",
         "expected": "Editor open; See Financial Data OFF."},
        {"n": 2,
         "action": "Enable Part Sales CRUD (e.g. Part Sales create/edit).",
         "expected": "A financial confirm modal appears prompting to enable See Financial Data (spec: modal states the area requires See Financial Data to be enabled and asks to enable it — verify exact modal text against build; do not assume wording)."},
        {"n": 3,
         "action": "Confirm the modal to enable See Financial Data.",
         "expected": "See Financial Data is enabled along with the Part Sales CRUD selection."},
    ],
    expected_final="Enabling Part Sales CRUD while See Financial Data is OFF triggers the financial confirm modal; confirming enables See Financial Data.",
    source_viu=spec("SV-7388 Part Sales requires See Financial Data — financial confirm modal"))

add("FIN", 5,
    title="Financial gate — enabling Invoicing CRUD while Financial OFF triggers confirm modal",
    jira="SV-7388",
    permission="See Financial Data (seeFinancialData) — gates Invoicing",
    dependency_mode="Financial gate: confirm modal",
    priority="Critical",
    type="Dependency",
    preconditions="Admin is in the Create Custom Role editor.",
    role_setup="In the editor with See Financial Data = OFF, enable Invoicing CRUD; observe the financial confirm modal.",
    test_data="N/A — editor-only verification.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}. Confirm See Financial Data is OFF.",
         "expected": "Editor open; See Financial Data OFF."},
        {"n": 2,
         "action": "Enable Invoicing CRUD.",
         "expected": "A financial confirm modal appears prompting to enable See Financial Data (verify exact modal text against build; do not assume wording)."},
        {"n": 3,
         "action": "Dismiss/cancel the modal.",
         "expected": "Cancelling leaves See Financial Data OFF and Invoicing CRUD not enabled (per spec gate behavior)."},
    ],
    expected_final="Invoicing requires See Financial Data; enabling its CRUD while Financial OFF triggers the financial confirm modal.",
    source_viu=spec("SV-7388 Invoicing requires See Financial Data — financial confirm modal"))

add("FIN", 6,
    title="Security — no financial leak in Receive Part modal when Financial OFF (SV-7973)",
    jira="SV-7973",
    permission="See Financial Data (seeFinancialData)",
    dependency_mode="None",
    priority="Critical",
    type="Security",
    preconditions="A part order can be received via the Receive Part modal.",
    role_setup="See Financial Data (seeFinancialData) = OFF; Work Orders View = ON; Order Parts (woOrderParts) = ON. All other toggles OFF.",
    test_data="Work Order WO-7973-001 with an orderable/receivable part.",
    steps=role_steps("See Financial Data OFF; WO View ON; Order Parts ON") + [
        {"n": 5,
         "action": "Open the Receive Part modal for the WO part delivery.",
         "expected": "The Receive Part modal shows no financial data (no cost/price/margin fields) because See Financial Data is OFF — no financial leak."},
    ],
    expected_final="With See Financial Data OFF, the Receive Part modal exposes no financial data (regression guard for SV-7973).",
    source_viu=spec("SV-7973 Receive Part modal — no financial leak when See Financial Data OFF"))

# ===========================================================================
# CROSS-CUTTING: Manage Accounts Payable and Receivable (APAR)
# ===========================================================================

add("APAR", 1,
    title="Manage AP/AR GRANT — Unpaid/Payments/Credits tabs, aging reports, bulk payments",
    jira="SV-7388",
    permission="Manage Accounts Payable and Receivable (seeApArData)",
    dependency_mode="None",
    priority="High",
    type="Positive",
    preconditions="Customers/vendors with unpaid invoices, payments, and credits exist; aging data exists.",
    role_setup="Manage Accounts Payable and Receivable (seeApArData) = ON; Reports = ON; Customer/Vendor View as needed. All other toggles OFF.",
    test_data="Customer CUST-APAR-001 and Vendor VEND-APAR-001 with unpaid invoices/payments/credits.",
    steps=role_steps("Manage AP/AR ON; Reports ON; Customer/Vendor View ON") + [
        {"n": 5,
         "action": "Open the Customer and Vendor detail pages.",
         "expected": "Unpaid Invoices, Payments, and Credits tabs are visible on both detail pages."},
        {"n": 6,
         "action": "Open Reports and locate AR Aging (Summary/Detail/Collection) and AP Aging (Summary/Detail, AP Unpaid Invoices).",
         "expected": "AR and AP aging reports are available."},
        {"n": 7,
         "action": "From the Unpaid Invoices tab, initiate a bulk payment.",
         "expected": "Bulk payments from the Unpaid Invoices tab are available."},
    ],
    expected_final="With Manage AP/AR ON, the Unpaid/Payments/Credits tabs, AP/AR aging reports, and bulk payments are all available.",
    source_viu=spec("SV-7388 Manage AP/AR — seeApArData"))

add("APAR", 2,
    title="Manage AP/AR WITHHOLD — tabs, aging reports, and bulk payments hidden when OFF",
    jira="SV-7388",
    permission="Manage Accounts Payable and Receivable (seeApArData)",
    dependency_mode="None",
    priority="High",
    type="Negative",
    preconditions="Customers/vendors with unpaid invoices/payments/credits exist.",
    role_setup="Manage Accounts Payable and Receivable (seeApArData) = OFF; Reports = ON; Customer/Vendor View ON. All other toggles OFF.",
    test_data="Customer CUST-APAR-002 and Vendor VEND-APAR-002.",
    steps=role_steps("Manage AP/AR OFF; Reports ON; Customer/Vendor View ON") + [
        {"n": 5,
         "action": "Open the Customer and Vendor detail pages.",
         "expected": "Unpaid Invoices, Payments, and Credits tabs are hidden."},
        {"n": 6,
         "action": "Open Reports and look for AR/AP aging reports.",
         "expected": "AR and AP aging reports are not available."},
    ],
    expected_final="With Manage AP/AR OFF, the AP/AR tabs, aging reports, and bulk payments are all hidden.",
    source_viu=spec("SV-7388 Manage AP/AR OFF hides all AP/AR features"))

add("APAR", 3,
    title="Manage AP/AR sensitive customer fields — Edit Customer modal + Customer Overview panel",
    jira="SV-7388",
    permission="Manage Accounts Payable and Receivable (seeApArData)",
    dependency_mode="None",
    priority="High",
    type="Security",
    preconditions="A customer with credit terms/limit and rate defaults exists.",
    role_setup="Compare two roles: (A) Manage AP/AR ON, Customer View+Edit ON; (B) Manage AP/AR OFF, Customer View+Edit ON.",
    test_data="Customer CUST-APAR-SENS with Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min/Max, Taxes, PO is Required set.",
    steps=[
        {"n": 1,
         "action": f"Go to {ADMIN_FLOW}. Create role A: Manage AP/AR ON, Customer View+Edit ON. Save.",
         "expected": "Role A saved."},
        {"n": 2,
         "action": "Create role B: Manage AP/AR OFF, Customer View+Edit ON. Save. Assign roles to users A and B.",
         "expected": "Roles assigned; role changes force logout."},
        {"n": 3,
         "action": "As user A, open the Edit Customer modal and Customer Overview panel for CUST-APAR-SENS.",
         "expected": "Sensitive fields are shown: Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min/Max, Taxes, PO is Required."},
        {"n": 4,
         "action": "As user B, open the Edit Customer modal and Customer Overview panel for CUST-APAR-SENS.",
         "expected": "The sensitive fields (Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min/Max, Taxes, PO is Required) are hidden."},
    ],
    expected_final="Manage AP/AR gates the sensitive customer fields on the Edit Customer modal and Customer Overview panel; hidden when OFF, shown when ON.",
    source_viu=spec("SV-7388 Manage AP/AR gates sensitive customer fields"))

add("APAR", 4,
    title="Manage AP/AR is INDEPENDENT from See Financial Data (Financial ON + AP/AR OFF)",
    jira="SV-7388",
    permission="Manage Accounts Payable and Receivable (seeApArData) vs See Financial Data (seeFinancialData)",
    dependency_mode="None",
    priority="High",
    type="Dependency",
    preconditions="Customer/vendor records with financial and AP/AR data exist.",
    role_setup="See Financial Data (seeFinancialData) = ON; Manage Accounts Payable and Receivable (seeApArData) = OFF; Customer/Vendor View ON. All other toggles OFF.",
    test_data="Customer CUST-IND-001 with financial data and unpaid invoices.",
    steps=role_steps("See Financial Data ON; Manage AP/AR OFF; Customer/Vendor View ON") + [
        {"n": 5,
         "action": "Open the customer detail page and inspect financial data vs AP/AR tabs.",
         "expected": "Financial data (pricing/costs/margins) is visible (Financial ON) but the Unpaid Invoices/Payments/Credits tabs are hidden (AP/AR OFF) — the two toggles are independent."},
    ],
    expected_final="Financial ON with AP/AR OFF shows financial data but hides AP/AR features, confirming the two are independent.",
    source_viu=spec("SV-7388 Manage AP/AR independent from See Financial Data"))

add("APAR", 5,
    title="Manage AP/AR does NOT gate CRUD, but Invoicing Delete additionally requires it",
    jira="SV-7388",
    permission="Manage Accounts Payable and Receivable (seeApArData) — gates Invoicing Delete",
    dependency_mode="AP/AR gate: confirm modal",
    priority="High",
    type="Dependency",
    preconditions="An invoice exists that could be deleted; Invoicing CRUD (incl Delete) is granted.",
    role_setup="See Financial Data = ON (required for Invoicing); Invoicing View+Edit+Delete = ON; Manage Accounts Payable and Receivable (seeApArData) = OFF. All other toggles OFF.",
    test_data="Invoice INV-APAR-DEL-001.",
    steps=role_steps("See Financial Data ON; Invoicing View+Edit+Delete ON; Manage AP/AR OFF") + [
        {"n": 5,
         "action": "Open Invoice INV-APAR-DEL-001 and confirm non-delete invoicing operations work (AP/AR does not gate general CRUD).",
         "expected": "General invoicing CRUD operations work despite AP/AR being OFF."},
        {"n": 6,
         "action": "Attempt to delete the invoice.",
         "expected": "Invoicing Delete is blocked/gated because it additionally requires Manage AP/AR, which is OFF (verify any gate/confirm modal wording against the build; do not assume text)."},
    ],
    expected_final="Manage AP/AR does not gate general CRUD, but Invoicing Delete additionally requires it and is blocked when AP/AR is OFF.",
    source_viu=spec("SV-7388 Invoicing Delete additionally requires Manage AP/AR"))

# ===========================================================================
# CROSS-CUTTING: View History Logs (HIST)
# ===========================================================================

add("HIST", 1,
    title="View History Logs GRANT — history/audit logs shown app-wide",
    jira="SV-7388",
    permission="View History Logs (viewHistoryLogs)",
    dependency_mode="None",
    priority="Medium",
    type="Positive",
    preconditions="History/audit data exists (WO history, part sales history, parts order history).",
    role_setup="View History Logs (viewHistoryLogs) = ON; Work Orders View = ON; Parts Department = ON with relevant children View ON. All other toggles OFF.",
    test_data="Work Order WO-HIST-001 with history; part sales and parts order records with history.",
    steps=role_steps("View History Logs ON; WO View ON; Parts Department + children View ON") + [
        {"n": 5,
         "action": "Open a WO and locate the WO history/audit log; open part sales and parts order records and locate their history logs.",
         "expected": "History/audit logs (WO history, part sales history, parts order history) are visible."},
    ],
    expected_final="With View History Logs ON, history/audit logs are visible across the app.",
    source_viu=spec("SV-7388 View History Logs — viewHistoryLogs"))

add("HIST", 2,
    title="View History Logs WITHHOLD — history/audit logs hidden app-wide when OFF",
    jira="SV-7388",
    permission="View History Logs (viewHistoryLogs)",
    dependency_mode="None",
    priority="Medium",
    type="Negative",
    preconditions="History/audit data exists.",
    role_setup="View History Logs (viewHistoryLogs) = OFF; Work Orders View = ON; Parts Department = ON with relevant children View ON. All other toggles OFF.",
    test_data="Work Order WO-HIST-002 with history; part sales and parts order records with history.",
    steps=role_steps("View History Logs OFF; WO View ON; Parts Department + children View ON") + [
        {"n": 5,
         "action": "Open a WO and look for the WO history/audit log; open part sales and parts order records and look for their history logs.",
         "expected": "History/audit logs are hidden everywhere (WO history, part sales history, parts order history absent)."},
    ],
    expected_final="With View History Logs OFF, history/audit logs are hidden app-wide.",
    source_viu=spec("SV-7388 View History Logs OFF hides logs app-wide"))

# ===========================================================================
# Write output
# ===========================================================================

os.makedirs(OUT_DIR, exist_ok=True)
with open(OUT_FILE, "w") as f:
    json.dump(cases, f, indent=2)

print(f"Wrote {len(cases)} cases to {OUT_FILE}")
