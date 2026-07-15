#!/usr/bin/env python3
"""
Custom Roles (SV-7388) — PRODUCTION vs STAGING role/permission gap generator.

STATUS OF DATA (2026-07-15): *** BOTH SIDES NOW LIVE-VERIFIED ***
  * STAGING (new custom-roles model) = LIVE. GET /api/organizations/{org}/roles +
    per-role GET /api/roles/{id}. 11 system roles.
    Source: compare-evidence-2026-07-14/staging-capability-matrix.json
  * PRODUCTION (old legacy model) = LIVE. Prod authenticated with a fresh PHPSESSID
    (app.shopview.com / api.shopview.com; NO SSO). Prod org UUID
    72b2cc90-6964-4429-a207-76e55f946936. Role inventory from GET /api/iam/list-roles
    (14 legacy roles, NO "Owner" present). Per-role effective permissions captured
    empirically by impersonation (POST /api/switch-user -> data.permissions
    [{resource_name,action_name,limits,exclusions}] -> POST /api/exit-switch-user).
    Roles without an existing active user were captured by temporarily assigning a
    throwaway ZZ invite-test user (bilal.muzamil+bugstesting) that role via
    POST /api/staff/change, impersonating, then restoring to Technician
    (departments/workplace verified preserved). Source:
    compare-evidence-2026-07-14/prod-capability-matrix.json

Old model = 50 resources x actions {'*','view','create','change','remove', + task/return
verbs}. '*' = ALL actions on that resource. New model = 41 fe_permission atoms +
view_mode + 3 cross toggles.

Deliverable: bi-directional 11-column main tab (STAGING-LESS + STAGING-MORE), a dedicated
"Work Orders - granular" tab, per-role 2x2 summaries, both live matrices, open questions.
"""
import json, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "compare-evidence-2026-07-14")
STG = json.load(open(os.path.join(EV, "staging-capability-matrix.json")))
PRODJ = json.load(open(os.path.join(EV, "prod-capability-matrix.json")))

# ---- prod effective-capability helpers (expand '*') ----
PROD = {}
for rc, perms in PRODJ.items():
    m = {}
    for p in perms:
        m.setdefault(p["resource_name"], set()).add(p["action_name"])
    PROD[rc] = m

def p_has(rc, res, *acts):
    a = PROD.get(rc, {}).get(res, set())
    if "*" in a:
        return True
    return any(x in a for x in acts)

def p_all(rc, res):
    return "*" in PROD.get(rc, {}).get(res, set())

# ---- staging helpers ----
def s_has(role, code):
    return code in STG[role]["codes"]

def s_ct(role, key):
    return bool(STG[role]["ct"].get(key))

def s_vm(role):
    return STG[role]["view_mode"]

# ---- PROD -> STAGING merge mapping (spec migration table; NO Owner in this prod org) ----
MAP = {
    "Admin": ["ROLE_ADMINISTRATOR"],   # Owner would also map here but is ABSENT in this prod org
    "Service Manager": ["ROLE_SERVICE_MANAGER"],
    "Senior Service Advisor": ["ROLE_SERVICE_ADVISOR", "ROLE_SERVICE_ADVISOR_TECHNICIAN", "ROLE_SERVICE_ADVISOR_NO_REPORTS"],
    "Service Advisor": ["ROLE_SERVICE_ADVISOR_LIMITED_VIEW"],
    "Foreman": ["ROLE_FOREMAN"],
    "Technician": ["ROLE_TECHNICIAN"],
    "Parts Manager": ["ROLE_PARTS_MANAGER"],
    "Parts Technician": ["ROLE_PARTS_TECHNICIAN"],
    "Office User": ["ROLE_OFFICE_USER"],
    "Sales Representative": ["ROLE_SALES_REPRESENTATIVE", "ROLE_REPORTING"],
    "Time Clock User": ["ROLE_TIME_CLOCK_USER"],
}
PLABEL = {
    "ROLE_ADMINISTRATOR": "Administrator", "ROLE_SERVICE_MANAGER": "Service Manager",
    "ROLE_SERVICE_ADVISOR": "Service Advisor", "ROLE_SERVICE_ADVISOR_TECHNICIAN": "Service Advisor Technician",
    "ROLE_SERVICE_ADVISOR_NO_REPORTS": "Service Advisor - No Reports",
    "ROLE_SERVICE_ADVISOR_LIMITED_VIEW": "Service Advisor - Limited View",
    "ROLE_FOREMAN": "Foreman", "ROLE_TECHNICIAN": "Technician",
    "ROLE_PARTS_MANAGER": "Parts Manager", "ROLE_PARTS_TECHNICIAN": "Parts Technician",
    "ROLE_OFFICE_USER": "Office User", "ROLE_SALES_REPRESENTATIVE": "Sales Representative",
    "ROLE_REPORTING": "Reporting", "ROLE_TIME_CLOCK_USER": "Time Clock User",
}
ORDER = ["Admin", "Service Manager", "Senior Service Advisor", "Service Advisor",
         "Foreman", "Technician", "Parts Manager", "Parts Technician",
         "Office User", "Sales Representative", "Time Clock User"]
UNCONFIRMED = {"Service Advisor", "Senior Service Advisor"}

# ---- SPEC-DOCUMENTED intended changes (updated-spec-source.md 'Behavior Changes', l.474-485) ----
SPEC_INTENDED = {
    # intended REDUCTIONS (STAGING-LESS)
    ("Service Manager", "Invoicing & Payments Delete (reverse/delete invoice)", "STAGING-LESS"):
        "Spec Behavior-Changes l.478: Service Manager 'Loses Invoicing Delete (cannot reverse)'",
    ("Service Manager", "Settings: Service", "STAGING-LESS"):
        "Spec Behavior-Changes l.478: Service Manager 'Loses Settings: Service'",
    ("Service Manager", "Settings: Parts", "STAGING-LESS"):
        "Spec Behavior-Changes l.478: Service Manager 'Loses Settings: Parts'",
    ("Service Manager", "Settings: Finance", "STAGING-LESS"):
        "Spec Behavior-Changes l.478: Service Manager 'Loses Settings: Finance'",
    ("Service Manager", "Settings: Data Import", "STAGING-LESS"):
        "Spec Behavior-Changes l.478: Service Manager 'Loses Settings: Data Import'",
    ("Foreman", "Timesheets Create & Edit", "STAGING-LESS"):
        "Spec Behavior-Changes l.479: Foreman 'Loses Timesheets Edit'",
    ("Technician", "Send to Portal", "STAGING-LESS"):
        "Spec Behavior-Changes l.480 + change-log l.565: Technician 'Lose Send to Portal'",
    ("Parts Manager", "Work Orders Delete", "STAGING-LESS"):
        "Spec Behavior-Changes l.481: Parts Manager 'Loses WO/WOL Delete'",
    ("Parts Manager", "Work Order Lines Delete", "STAGING-LESS"):
        "Spec Behavior-Changes l.481: Parts Manager 'Loses WO/WOL Delete'",
    ("Office User", "Catalog & Inventory Create & Edit", "STAGING-LESS"):
        "Spec Behavior-Changes l.483: Office 'Catalog reduced to V only'",
    # intended EXPANSIONS (STAGING-MORE)
    ("Senior Service Advisor", "Work Orders Delete", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains WO Delete'",
    ("Senior Service Advisor", "Work Order Lines Delete", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains WOL Delete'",
    ("Senior Service Advisor", "Schedule Delete", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains Schedule Delete'",
    ("Senior Service Advisor", "Part Sales Delete", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains PartSales Delete'",
    ("Senior Service Advisor", "Invoicing & Payments Delete (reverse/delete invoice)", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains Invoicing FULL'",
    ("Senior Service Advisor", "Timesheets Create & Edit", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains Timesheets CE'",
    ("Senior Service Advisor", "Customer Portal Page Access", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains Customer Portal'",
    ("Senior Service Advisor", "See AP/AR Data", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains AP/AR'",
    ("Senior Service Advisor", "Reports Page Access", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains Reports'",
    ("Foreman", "Work Order Lines Delete", "STAGING-MORE"): "Spec l.479: Foreman 'Gains WOL Delete'",
    ("Foreman", "Schedule Delete", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Schedule Delete'",
    ("Foreman", "Order Parts (on WO)", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Order Parts'",
    ("Foreman", "WO History / Audit Log (view)", "STAGING-MORE"): "Spec l.479: Foreman 'Gains History Logs'",
    ("Foreman", "View History Logs (cross-toggle)", "STAGING-MORE"): "Spec l.479: Foreman 'Gains History Logs'",
    ("Foreman", "Part Sales View", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Parts Dept (Part Sales V)'",
    ("Foreman", "Catalog & Inventory View", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Parts Dept (Catalog V/CE)'",
    ("Foreman", "Catalog & Inventory Create & Edit", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Parts Dept (Catalog V/CE)'",
    ("Foreman", "Vendor & Order Mgmt View", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Parts Dept (Vendor V/CE)'",
    ("Foreman", "Vendor & Order Mgmt Create & Edit", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Parts Dept (Vendor V/CE)'",
    ("Foreman", "Receive / accept a delivery (Bulk Receive)", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Vendor V/CE' (delivery)",
    ("Foreman", "Assign vendor to a WO part order", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Vendor V/CE + Order Parts'",
    ("Foreman", "Invoicing & Payments View", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Invoicing V/CE'",
    ("Foreman", "Invoicing & Payments Create & Edit", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Invoicing V/CE'",
    ("Foreman", "Create an invoice from a WO (estimate->invoice)", "STAGING-MORE"): "Spec l.479: Foreman 'Gains Invoicing V/CE'",
    ("Foreman", "See Financial Data on WO (rates/margins/totals)", "STAGING-MORE"): "Spec l.479 Invoicing V/CE + l.572 (SFD required for invoicing)",
    ("Foreman", "See Financial Data (cross-toggle)", "STAGING-MORE"): "Spec l.479 Invoicing V/CE + l.572 (SFD required for invoicing)",
    ("Technician", "Pick Parts", "STAGING-MORE"): "Spec l.480: Technician 'Gains Pick Parts'",
    ("Parts Manager", "Schedule View", "STAGING-MORE"): "Spec l.481: Parts Manager 'Gains Schedule View'",
    ("Parts Manager", "Customer Portal Page Access", "STAGING-MORE"): "Spec l.481: Parts Manager 'Gains Customer Portal'",
    ("Parts Technician", "Pick Parts", "STAGING-MORE"): "Spec l.482: Parts Tech 'Gains Pick Parts'",
    ("Parts Technician", "Order Parts (on WO)", "STAGING-MORE"): "Spec l.482: Parts Tech 'Gains Order Parts'",
    ("Parts Technician", "Invoicing & Payments Create & Edit", "STAGING-MORE"): "Spec l.482: Parts Tech 'Gains Invoicing V/CE'",
    ("Parts Technician", "Invoicing & Payments View", "STAGING-MORE"): "Spec l.482: Parts Tech 'Gains Invoicing V/CE'",
    ("Parts Technician", "WO History / Audit Log (view)", "STAGING-MORE"): "Spec l.482: Parts Tech 'Gains History Logs'",
    ("Parts Technician", "View History Logs (cross-toggle)", "STAGING-MORE"): "Spec l.482: Parts Tech 'Gains History Logs'",
    ("Parts Technician", "Create an invoice from a WO (estimate->invoice)", "STAGING-MORE"): "Spec l.482: Parts Tech 'Gains Invoicing V/CE'",
    ("Parts Technician", "See Financial Data on WO (rates/margins/totals)", "STAGING-MORE"): "Spec l.482 Invoicing V/CE + l.572 (SFD required for invoicing)",
    ("Parts Technician", "See Financial Data (cross-toggle)", "STAGING-MORE"): "Spec l.482 Invoicing V/CE + l.572 (SFD required for invoicing)",
    ("Office User", "Customers Delete", "STAGING-MORE"): "Spec l.483: Office 'Customer Mgmt gains Delete'",
    ("Service Manager", "Customer Portal Page Access", "STAGING-MORE"): "Spec l.478: SM 'Gains Customer Portal'",
    ("Service Manager", "Billing Portal Page Access", "STAGING-MORE"): "Spec l.478: SM 'Gains Billing Portal'",
    ("Service Advisor", "Customer Portal Page Access", "STAGING-MORE"): "Spec l.485: SA Limited View 'Gains Customer Portal'",
    ("Senior Service Advisor", "Customers Delete", "STAGING-MORE"): "Spec l.477 (Senior SA expansion set)",
    ("Senior Service Advisor", "Part Sales Create & Edit", "STAGING-MORE"): "Spec l.477: Senior SA 'Gains ... Vendor FULL/Invoicing FULL' expansion set",
}

# ============================================================================
# CAPABILITY SPEC TABLE
# name, cat ('WO'|'GEN'), stg(role)->bool, prod(prodcode)->bool, severity, confidence
# ============================================================================
CAPS = [
    # ---------- WORK ORDERS (granular) ----------
    ("Work Orders View", "WO", lambda r: s_has(r, "workOrdersView"),
     lambda c: p_has(c, "work_order", "view"), "Medium", "live"),
    ("Work Orders Create & Edit", "WO", lambda r: s_has(r, "workOrdersCreateAndEdit"),
     lambda c: p_has(c, "work_order", "create", "change"), "High", "live"),
    ("Work Orders Delete", "WO", lambda r: s_has(r, "workOrdersDelete"),
     lambda c: p_all(c, "work_order"), "High", "live"),
    ("Work Order Lines Create & Edit", "WO", lambda r: s_has(r, "workOrderLinesCreateAndEdit"),
     lambda c: p_has(c, "work_order_line", "create", "change"), "High", "live"),
    ("Work Order Lines Delete", "WO", lambda r: s_has(r, "workOrderLinesDelete"),
     lambda c: p_has(c, "work_order_line", "remove"), "High", "live"),
    ("Order Parts (on WO)", "WO", lambda r: s_has(r, "woOrderParts"),
     lambda c: p_has(c, "work_order_part_request", "create"), "High", "live"),
    ("Pick Parts", "WO", lambda r: s_has(r, "woPickParts"),
     lambda c: p_has(c, "work_order_part", "change"), "Medium", "live"),
    ("Manage picked WO parts (view/change)", "WO", lambda r: s_has(r, "woPickParts") or s_has(r, "workOrderLinesCreateAndEdit"),
     lambda c: p_has(c, "work_order_part", "view", "change"), "Medium", "NEEDS-REVIEW"),
    ("Remove a WO part", "WO", lambda r: s_has(r, "workOrderLinesDelete") or s_has(r, "workOrdersDelete"),
     lambda c: p_has(c, "work_order_part", "remove"), "High", "NEEDS-REVIEW"),
    ("Add / request a part on WO (part request)", "WO", lambda r: s_has(r, "woOrderParts") or s_has(r, "workOrderLinesCreateAndEdit"),
     lambda c: p_has(c, "work_order_part_request", "create", "change"), "Medium", "NEEDS-REVIEW"),
    ("Process a WO part return (create)", "WO", lambda r: s_has(r, "vendorOrderManagementCreateAndEdit") or s_has(r, "workOrderLinesCreateAndEdit"),
     lambda c: p_has(c, "work_order_part_return", "create", "change"), "Medium", "NEEDS-REVIEW"),
    ("Approve / complete a WO part return", "WO", lambda r: s_has(r, "invoicingPaymentsDelete") or s_has(r, "workOrdersDelete"),
     lambda c: p_has(c, "work_order_part_return", "complete"), "High", "NEEDS-REVIEW"),
    ("Decline a WO part return", "WO", lambda r: s_has(r, "workOrderLinesCreateAndEdit"),
     lambda c: p_has(c, "work_order_part_return", "decline"), "Medium", "NEEDS-REVIEW"),
    ("Canned lines on WO (add/edit)", "WO", lambda r: s_has(r, "workOrderLinesCreateAndEdit") or s_has(r, "workOrdersCreateAndEdit"),
     lambda c: p_has(c, "work_order_canned_line", "create", "change"), "Low", "NEEDS-REVIEW"),
    ("WO History / Audit Log (view)", "WO", lambda r: s_ct(r, "viewHistoryLogs"),
     lambda c: p_has(c, "work_order_history", "view"), "Medium", "live"),
    ("Clock in / log time on a WO line task", "WO", lambda r: (s_vm(r) == "tech" or s_has(r, "workOrderLinesCreateAndEdit")),
     lambda c: p_has(c, "work_order_line_task", "clock_in"), "Low", "NEEDS-REVIEW"),
    ("Edit / move WO line tasks", "WO", lambda r: s_has(r, "workOrderLinesCreateAndEdit"),
     lambda c: p_has(c, "work_order_line_task", "change", "move", "create"), "Low", "NEEDS-REVIEW"),
    ("Mark Reviewed / review sign-off", "WO", lambda r: s_has(r, "woReviewWorkOrders"),
     lambda c: p_has(c, "work_order", "change"), "Medium", "NEEDS-REVIEW"),
    ("Complete a Work Order", "WO", lambda r: s_has(r, "workOrdersCreateAndEdit"),
     lambda c: p_has(c, "work_order", "create", "change"), "Medium", "live"),
    ("Approve / decline a WO line", "WO", lambda r: s_has(r, "workOrderLinesCreateAndEdit"),
     lambda c: p_has(c, "work_order_line", "change"), "Medium", "live"),
    ("Set line status (bulk)", "WO", lambda r: s_has(r, "workOrderLinesCreateAndEdit"),
     lambda c: p_has(c, "work_order_line", "change"), "Low", "live"),
    ("Full WO view mode (vs Tech view)", "WO", lambda r: s_vm(r) == "full",
     lambda c: c not in ("ROLE_TECHNICIAN", "ROLE_TIME_CLOCK_USER", "ROLE_REPORTING"), "Medium", "NEEDS-REVIEW"),
    ("See Financial Data on WO (rates/margins/totals)", "WO", lambda r: s_ct(r, "seeFinancialData"),
     lambda c: p_has(c, "invoice", "view"), "High", "NEEDS-REVIEW"),
    ("Send to Portal", "WO", lambda r: (s_vm(r) == "full" and s_has(r, "customerPortalPageAccess") and s_has(r, "woReviewWorkOrders")),
     lambda c: p_has(c, "work_order", "view"), "High", "NEEDS-REVIEW"),
    ("Send to Terminal (take payment on WO)", "WO", lambda r: (s_has(r, "invoicingPaymentsCreateAndEdit") and s_has(r, "customerPortalPageAccess")),
     lambda c: p_has(c, "invoice", "create", "change"), "High", "NEEDS-REVIEW"),
    ("Assign vendor to a WO part order", "WO", lambda r: s_has(r, "vendorOrderManagementCreateAndEdit"),
     lambda c: p_has(c, "work_order_part_request", "create") or p_has(c, "vendor", "change"), "Medium", "NEEDS-REVIEW"),
    ("Add a vendorless / manual part on WO", "WO", lambda r: s_has(r, "workOrderLinesCreateAndEdit") or s_has(r, "catalogInventoryCreateAndEdit"),
     lambda c: p_has(c, "work_order_part_request", "create"), "Low", "NEEDS-REVIEW"),
    ("Create / edit customer from New WO screen", "WO", lambda r: s_has(r, "customersCreateAndEdit"),
     lambda c: p_has(c, "customer", "create", "change"), "Medium", "live"),
    ("Create / edit asset (vehicle) from New WO screen", "WO", lambda r: s_has(r, "workOrdersCreateAndEdit"),
     lambda c: p_has(c, "vehicle", "create", "change"), "Medium", "NEEDS-REVIEW"),
    ("Create an invoice from a WO (estimate->invoice)", "WO", lambda r: s_has(r, "invoicingPaymentsCreateAndEdit"),
     lambda c: p_has(c, "invoice", "create"), "High", "live"),
    ("WO notes - create / edit", "WO", lambda r: s_has(r, "workOrdersView"),
     lambda c: p_has(c, "work_order", "view", "change", "create"), "Low", "NEEDS-REVIEW"),
    ("WO notes - delete", "WO", lambda r: s_has(r, "workOrdersDelete"),
     lambda c: p_all(c, "work_order"), "Low", "NEEDS-REVIEW"),

    # ---------- GENERAL / whole-app atoms ----------
    ("Schedule View", "GEN", lambda r: s_has(r, "scheduleView"),
     lambda c: p_has(c, "schedule", "view"), "Low", "live"),
    ("Schedule Create & Edit", "GEN", lambda r: s_has(r, "scheduleCreateAndEdit"),
     lambda c: p_all(c, "schedule"), "Low", "live"),
    ("Schedule Delete", "GEN", lambda r: s_has(r, "scheduleDelete"),
     lambda c: p_all(c, "schedule"), "Low", "live"),
    ("Customers View", "GEN", lambda r: s_has(r, "customersView"),
     lambda c: p_has(c, "customer", "view"), "Low", "live"),
    ("Customers Create & Edit", "GEN", lambda r: s_has(r, "customersCreateAndEdit"),
     lambda c: p_has(c, "customer", "create", "change"), "Medium", "live"),
    ("Customers Delete", "GEN", lambda r: s_has(r, "customersDelete"),
     lambda c: p_all(c, "customer"), "Medium", "live"),
    ("Catalog & Inventory View", "GEN", lambda r: s_has(r, "catalogInventoryView"),
     lambda c: p_has(c, "inventory", "view") or p_has(c, "catalogue", "view"), "Low", "live"),
    ("Catalog & Inventory Create & Edit", "GEN", lambda r: s_has(r, "catalogInventoryCreateAndEdit"),
     lambda c: p_has(c, "inventory", "create", "change") or p_has(c, "catalogue", "create", "change"), "Medium", "live"),
    ("Catalog & Inventory Delete", "GEN", lambda r: s_has(r, "catalogInventoryDelete"),
     lambda c: p_all(c, "inventory") or p_all(c, "catalogue"), "Medium", "live"),
    ("Vendor & Order Mgmt View", "GEN", lambda r: s_has(r, "vendorOrderManagementView"),
     lambda c: p_has(c, "vendor", "view") or p_has(c, "delivery", "view") or p_has(c, "work_order_part_request", "view"), "Low", "live"),
    ("Vendor & Order Mgmt Create & Edit", "GEN", lambda r: s_has(r, "vendorOrderManagementCreateAndEdit"),
     lambda c: p_has(c, "vendor", "create", "change") or p_has(c, "delivery", "create", "change"), "Medium", "live"),
    ("Vendor & Order Mgmt Delete", "GEN", lambda r: s_has(r, "vendorOrderManagementDelete"),
     lambda c: p_all(c, "vendor") or p_all(c, "delivery"), "Medium", "live"),
    ("Receive / accept a delivery (Bulk Receive)", "GEN", lambda r: s_has(r, "vendorOrderManagementCreateAndEdit"),
     lambda c: p_has(c, "delivery", "create", "change"), "Medium", "live"),
    ("Part Sales View", "GEN", lambda r: s_has(r, "partSalesView"),
     lambda c: p_has(c, "manual_part_return", "view"), "Low", "NEEDS-REVIEW"),
    ("Part Sales Create & Edit", "GEN", lambda r: s_has(r, "partSalesCreateAndEdit"),
     lambda c: p_has(c, "manual_part_return", "create", "change"), "Medium", "NEEDS-REVIEW"),
    ("Part Sales Delete", "GEN", lambda r: s_has(r, "partSalesDelete"),
     lambda c: p_all(c, "manual_part_return"), "Medium", "NEEDS-REVIEW"),
    ("Invoicing & Payments View", "GEN", lambda r: s_has(r, "invoicingPaymentsView"),
     lambda c: p_has(c, "invoice", "view"), "Medium", "live"),
    ("Invoicing & Payments Create & Edit", "GEN", lambda r: s_has(r, "invoicingPaymentsCreateAndEdit"),
     lambda c: p_has(c, "invoice", "create", "change"), "High", "live"),
    ("Invoicing & Payments Delete (reverse/delete invoice)", "GEN", lambda r: s_has(r, "invoicingPaymentsDelete"),
     lambda c: p_all(c, "invoice"), "High", "live"),
    ("Timesheets View", "GEN", lambda r: s_has(r, "timesheetsView"),
     lambda c: p_has(c, "timesheet_activities", "change") or p_has(c, "attendance", "view") or p_has(c, "payroll_timesheet_reports", "view"), "Low", "NEEDS-REVIEW"),
    ("Timesheets Create & Edit", "GEN", lambda r: s_has(r, "timesheetsCreateAndEdit"),
     lambda c: p_has(c, "timesheet_activities", "change"), "Medium", "NEEDS-REVIEW"),
    ("Reports Page Access", "GEN", lambda r: s_has(r, "reportsPageAccess"),
     lambda c: any(res.endswith("_reports") for res in PROD.get(c, {})), "Medium", "live"),
    ("Customer Portal Page Access", "GEN", lambda r: s_has(r, "customerPortalPageAccess"),
     lambda c: False, "Medium", "NEEDS-REVIEW"),
    ("Billing Portal Page Access", "GEN", lambda r: s_has(r, "billingPortalPageAccess"),
     lambda c: p_all(c, "organization"), "Low", "NEEDS-REVIEW"),
    ("Settings: App", "GEN", lambda r: s_has(r, "settingsApp"),
     lambda c: p_all(c, "organization"), "Medium", "NEEDS-REVIEW"),
    ("Settings: Service", "GEN", lambda r: s_has(r, "settingsService"),
     lambda c: p_all(c, "labour_type") or p_all(c, "inspection_template") or p_all(c, "bay"), "Medium", "NEEDS-REVIEW"),
    ("Settings: Parts", "GEN", lambda r: s_has(r, "settingsParts"),
     lambda c: p_all(c, "pricing_matrix"), "Medium", "NEEDS-REVIEW"),
    ("Settings: Integrations", "GEN", lambda r: s_has(r, "settingsIntegrations"),
     lambda c: p_all(c, "organization"), "Medium", "NEEDS-REVIEW"),
    ("Settings: Finance", "GEN", lambda r: s_has(r, "settingsFinance"),
     lambda c: p_all(c, "tax") or p_all(c, "payment_method"), "Medium", "NEEDS-REVIEW"),
    ("Settings: Data Import", "GEN", lambda r: s_has(r, "settingsDataImport"),
     lambda c: p_all(c, "data_import"), "Medium", "live"),
    ("Settings: Wages", "GEN", lambda r: s_has(r, "settingsWages"),
     lambda c: p_all(c, "staff"), "Medium", "NEEDS-REVIEW"),
    ("See Financial Data (cross-toggle)", "GEN", lambda r: s_ct(r, "seeFinancialData"),
     lambda c: p_has(c, "invoice", "view") or any(res.endswith("_reports") for res in PROD.get(c, {})), "High", "NEEDS-REVIEW"),
    ("See AP/AR Data", "GEN", lambda r: s_ct(r, "seeApArData"),
     lambda c: p_all(c, "invoice") or p_has(c, "customer_transaction") or p_has(c, "vendor_transaction"), "High", "NEEDS-REVIEW"),
    ("View History Logs (cross-toggle)", "GEN", lambda r: s_ct(r, "viewHistoryLogs"),
     lambda c: p_has(c, "work_order_history", "view"), "Medium", "live"),
    ("Manage Staff", "GEN", lambda r: s_has(r, "settingsWages") or s_has(r, "settingsApp"),
     lambda c: p_all(c, "staff"), "Medium", "NEEDS-REVIEW"),
]

def intended_for(role, cap, direction):
    cit = SPEC_INTENDED.get((role, cap, direction))
    if cit:
        return "Yes", cit
    return "No", "not in spec (unaccounted change - review before release)"

def prod_grant(role, cap_prod):
    holders = [PLABEL[c] for c in MAP[role] if cap_prod(c)]
    return (len(holders) > 0), holders

rows = []
delta_rows = []
for role in ORDER:
    for name, cat, sfn, pfn, sev, conf in CAPS:
        sg = bool(sfn(role))
        pg, holders = prod_grant(role, pfn)
        prod_names = "; ".join(holders) if holders else "(none of mapped)"
        mapped_all = " + ".join(PLABEL[c] for c in MAP[role])
        if sg == pg:
            direction = "match"
        elif pg and not sg:
            direction = "STAGING-LESS"
        else:
            direction = "STAGING-MORE"
        rowconf = conf
        if role in UNCONFIRMED:
            rowconf = conf + " + NEEDS-REVIEW (mapping unconfirmed)"
        rec = dict(role=role, cat=cat, cap=name, mapped=mapped_all, holders=prod_names,
                   pg="Yes" if pg else "No", sg="Yes" if sg else "No", direction=direction,
                   sev=sev, conf=rowconf)
        rows.append(rec)
        if direction in ("STAGING-LESS", "STAGING-MORE"):
            intended, cit = intended_for(role, name, direction)
            ev = f"prod holder: {prod_names} | staging live | old->new map conf={conf}"
            if role in UNCONFIRMED:
                ev += " | SA<->SSA mapping NOT user-confirmed"
            rec2 = dict(rec)
            rec2.update(intended=intended, cit=cit, ev=ev)
            delta_rows.append(rec2)

# ============================================================================
# WORKBOOK
# ============================================================================
def style_header(ws, ncols, color="1F4E78"):
    fill = PatternFill("solid", fgColor=color)
    for c in range(1, ncols + 1):
        cell = ws.cell(row=1, column=c)
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = fill
        cell.alignment = Alignment(vertical="top", wrap_text=True)

RED = Font(color="C00000", bold=True)
HDR = ["Staging Role", "Production role(s) mapped", "Capability", "Prod grants?",
       "Staging grants?", "Direction (STAGING-LESS / STAGING-MORE)",
       "Per spec - intended? (Yes/No)", "Spec citation", "Severity",
       "Evidence / source", "Confidence"]

def write_delta_tab(ws, subset):
    ws.append(HDR)
    style_header(ws, len(HDR))
    for r in subset:
        ws.append([r["role"], r["mapped"], r["cap"], r["pg"], r["sg"], r["direction"],
                   r["intended"], r["cit"], r["sev"], r["ev"], r["conf"]])
        if r["intended"] == "No":
            ws.cell(row=ws.max_row, column=7).font = RED
    for col, w in zip("ABCDEFGHIJK", [22, 34, 42, 11, 12, 22, 16, 52, 9, 50, 32]):
        ws.column_dimensions[col].width = w
    for rr in ws.iter_rows(min_row=2):
        for cc in rr:
            cc.alignment = Alignment(wrap_text=True, vertical="top")

def summary_tab(ws, subset, title):
    ws.append([title])
    ws["A1"].font = Font(bold=True, size=12)
    ws.append(["Staging Role", "Merged?", "Prod role(s) mapped",
               "STAGING-LESS intended (Yes)", "STAGING-LESS NOT-in-spec (No) = RISK",
               "STAGING-MORE intended (Yes)", "STAGING-MORE NOT-in-spec (No) = RISK",
               "Highest severity", "Mapping confirmed?"])
    for c in range(1, 10):
        cell = ws.cell(row=2, column=c)
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="1F4E78")
        cell.alignment = Alignment(vertical="top", wrap_text=True)
    sevrank = {"High": 3, "Medium": 2, "Low": 1}
    for role in ORDER:
        items = [x for x in subset if x["role"] == role]
        less = [x for x in items if x["direction"] == "STAGING-LESS"]
        more = [x for x in items if x["direction"] == "STAGING-MORE"]
        lyes = sum(1 for x in less if x["intended"] == "Yes")
        lno = sum(1 for x in less if x["intended"] == "No")
        myes = sum(1 for x in more if x["intended"] == "Yes")
        mno = sum(1 for x in more if x["intended"] == "No")
        hs = max([x["sev"] for x in items], key=lambda s: sevrank[s], default="-")
        merged = "YES" if len(MAP[role]) > 1 else "no"
        conf = "NEEDS-REVIEW" if role in UNCONFIRMED else "yes"
        ws.append([role, merged, " + ".join(PLABEL[c] for c in MAP[role]),
                   lyes, lno, myes, mno, hs, conf])
        if lno:
            ws.cell(row=ws.max_row, column=5).font = RED
        if mno:
            ws.cell(row=ws.max_row, column=7).font = RED
    for col, w in zip("ABCDEFGHI", [22, 8, 40, 24, 32, 24, 32, 14, 16]):
        ws.column_dimensions[col].width = w

wb = Workbook()

# ---- Tab 0: READ ME ----
ws0 = wb.active
ws0.title = "READ ME - DATA STATUS"
banner = [
    ["CUSTOM ROLES (SV-7388) - PROD vs STAGING permission compare - LIVE 2026-07-15"],
    [""],
    ["*** BOTH SIDES LIVE-VERIFIED (this is NOT the spec-predicted interim) ***"],
    [""],
    ["STAGING (new custom-roles model): 11 system roles, GET /api/organizations/{org}/roles"],
    ["  + per-role GET /api/roles/{id}. Org d55bc308-...  All HTTP 200."],
    ["PRODUCTION (old legacy model): authenticated live on api.shopview.com with a fresh"],
    ["  PHPSESSID (no SSO). Prod org UUID 72b2cc90-6964-4429-a207-76e55f946936."],
    ["  14 legacy roles from GET /api/iam/list-roles (NO 'Owner' role exists in this org)."],
    ["  Per-role effective permissions captured by impersonation (POST /api/switch-user ->"],
    ["  data.permissions -> exit-switch-user). Userless roles captured by temporarily"],
    ["  assigning a throwaway ZZ invite-test user that role, then restoring to Technician."],
    [""],
    ["OLD model = {resource_name, action_name} pairs; action '*' = ALL actions (incl delete)."],
    ["NEW model = 41 fe_permission atoms + view_mode + 3 cross-toggles. Capabilities are"],
    ["translated old<->new (see 'Confidence' col: 'live' = clean resource/action map;"],
    ["'NEEDS-REVIEW' = old model has no clean equivalent / FE-gated, judged best-effort)."],
    [""],
    ["BI-DIRECTIONAL: STAGING-LESS = prod grants, staging does not (regression / over-in-prod)."],
    ["  STAGING-MORE = staging grants, prod did not (new model grants more)."],
    ["Per spec - intended? Yes = the spec Behavior-Changes/migration text documents it (cited)."],
    ["  No (RED) = the change is NOT accounted for in the spec = HEADLINE RELEASE RISK."],
    [""],
    ["Service Advisor & Senior Service Advisor rows are flagged NEEDS-REVIEW (mapping"],
    ["  unconfirmed) per the naming trap: legacy 'Service Advisor' -> staging 'Senior SA';"],
    ["  staging 'Service Advisor' <- legacy 'SA Limited View'. Computed under the spec map."],
    [""],
    ["TABS: 'Deltas - ALL (bi-dir)' whole-app | 'Work Orders - granular' WO-only |"],
    ["  Summary tabs (per-role Yes/No 2x2) | Full capability matrix | Open questions."],
]
for row in banner:
    ws0.append(row)
ws0["A1"].font = Font(bold=True, size=13)
ws0["A3"].font = Font(bold=True, color="1F6F1F", size=12)
ws0.column_dimensions["A"].width = 100

write_delta_tab(wb.create_sheet("Deltas - ALL (bi-dir)"), delta_rows)
wo_deltas = [r for r in delta_rows if r["cat"] == "WO"]
write_delta_tab(wb.create_sheet("Work Orders - granular"), wo_deltas)
summary_tab(wb.create_sheet("Summary per role (ALL)"), delta_rows,
            "Per-role 2x2 summary - WHOLE APP (No = release risk)")
summary_tab(wb.create_sheet("Summary per role (WO)"), wo_deltas,
            "Per-role 2x2 summary - WORK ORDERS only (No = release risk)")

# ---- Full capability matrix (staging then prod, side by side) ----
ws5 = wb.create_sheet("Full capability matrix")
ws5.append(["STAGING grants (live)", ""] + ORDER)
style_header(ws5, 2 + len(ORDER))
for name, cat, sfn, pfn, sev, conf in CAPS:
    ws5.append([name, cat] + ["Y" if sfn(r) else "" for r in ORDER])
ws5.append([])
hdr2 = ws5.max_row + 1
ws5.append(["PRODUCTION grants (mapped union, live)", ""] + ORDER)
for c in range(1, 3 + len(ORDER)):
    cell = ws5.cell(row=hdr2, column=c)
    cell.font = Font(bold=True, color="FFFFFF")
    cell.fill = PatternFill("solid", fgColor="7F3F00")
for name, cat, sfn, pfn, sev, conf in CAPS:
    ws5.append([name, cat] + ["Y" if prod_grant(r, pfn)[0] else "" for r in ORDER])
ws5.column_dimensions["A"].width = 44
ws5.column_dimensions["B"].width = 6
for col in "CDEFGHIJKLM":
    ws5.column_dimensions[col].width = 12

# ---- Open questions ----
ws6 = wb.create_sheet("Open questions - NEEDS REVIEW")
ws6.append(["Item", "Detail"])
style_header(ws6, 2)
OPEN_Q = [
    ("Service Advisor / Senior SA mapping UNCONFIRMED",
     "Naming trap: legacy 'Service Advisor' -> staging 'Senior Service Advisor' (renamed+expanded); "
     "staging 'Service Advisor' comes from legacy 'SA Limited View'. Section-3549 migration cases "
     "C26514/C26515 were authored as 1:1 same-name mappings, contradicting the spec migration table. "
     "All Service-Advisor / Senior-Service-Advisor rows are flagged NEEDS-REVIEW; computed under the "
     "spec migration table. CONFIRM which authority governs before treating those deltas as final."),
    ("'Owner' legacy role ABSENT in this prod org",
     "Spec migration maps Owner+Administrator -> Admin. The compared prod org (72b2cc90-...) has NO "
     "Owner role in GET /api/iam/list-roles (14 legacy roles, not 15). Admin is diffed against "
     "Administrator only. If any prod org still has an Owner role, re-run the compare there."),
    ("Old->new capability translation - NEEDS-REVIEW rows",
     "Some new-model atoms have no clean old-model resource/action equivalent and/or are FE-gated "
     "(Send to Portal, Send to Terminal, Customer/Billing Portal page access, See Financial Data, "
     "See AP/AR, Settings Service/Parts/Integrations/Wages, Part Sales, part-return verbs, line tasks). "
     "These rows are Confidence=NEEDS-REVIEW and mapped best-effort; verify in UI per role."),
    ("Customer Portal page access - no prod resource",
     "The old model exposes no 'customer portal' resource in the permission array; prod grant computed "
     "as No for all roles. Spec documents several roles GAIN Customer Portal (intended STAGING-MORE=Yes)."),
    ("Reporting legacy role has 0 resource permissions",
     "ROLE_REPORTING returns an EMPTY permissions array (report-page-only via role membership, not the "
     "permission model). It merges into Sales Representative; its report access is represented via the "
     "Reports Page Access capability."),
    ("Send to Portal / Send to Terminal are FE-gated",
     "Both are front-end button gates not enforced by a raw permission atom. Staging: Send to Portal "
     "needs Full view + Customer Portal + review; Send to Terminal needs Invoicing C&E + Customer Portal. "
     "Prod grant inferred from work_order/invoice access; verify live in UI per role before release."),
    ("Prod capture method (disposable TEST org)",
     "Prod is a disposable TEST org (per task). Per-role perms captured via impersonation "
     "(switch-user/exit-switch-user, fully reversible) and, for userless roles, a temporary role swap "
     "on throwaway user bilal.muzamil+bugstesting (restored to Technician; departments/workplace "
     "verified intact). No production data left modified."),
]
for item, detail in OPEN_Q:
    ws6.append([item, detail])
ws6.column_dimensions["A"].width = 42
ws6.column_dimensions["B"].width = 110
for row in ws6.iter_rows(min_row=2):
    row[1].alignment = Alignment(wrap_text=True, vertical="top")

out_xlsx = os.path.join(HERE, "Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx")
wb.save(out_xlsx)

def counts(subset):
    return (
        [r for r in subset if r["direction"] == "STAGING-LESS" and r["intended"] == "No"],
        [r for r in subset if r["direction"] == "STAGING-LESS" and r["intended"] == "Yes"],
        [r for r in subset if r["direction"] == "STAGING-MORE" and r["intended"] == "No"],
        [r for r in subset if r["direction"] == "STAGING-MORE" and r["intended"] == "Yes"],
    )

print("wrote", out_xlsx)
ln, ly, mn, my = counts(delta_rows)
print(f"ALL: STAGING-LESS No={len(ln)} Yes={len(ly)} | STAGING-MORE No={len(mn)} Yes={len(my)}")
wln, wly, wmn, wmy = counts(wo_deltas)
print(f"WO : STAGING-LESS No={len(wln)} Yes={len(wly)} | STAGING-MORE No={len(wmn)} Yes={len(wmy)}")
