#!/usr/bin/env python3
"""Builds a PRD snapshot (the DOCUMENTED intent) from the PRD's own tables, pasted VERBATIM.

The tables below are copied character-for-character from Confluence page 565116952
"Custom Roles and Permissions". They are parsed, never paraphrased (Rule 113): every matrix cell
and every description in the snapshot can be traced back to the exact table row it came from,
and the `verbatim` field of each quote is the PRD's own sentence.

  python3 build_prd_snapshot.py v7      -> ../snapshots/prd-v7.json

WHY VERSION 7 IS THE ORIGINAL BASELINE (measured 2026-10-29 with the Confluence version API):
  * v6 (2026-05-13) reads "Status: Draft"; v7 (2026-06-01 13:15 UTC) is the FIRST version that
    reads "Status: Published" (diff v6->v7).
  * v7 -> v10 changes only the Change Log wording (diff v7->v10: 2 additions, 1 deletion, all in
    the Change Log), so the requirement text of v7 and v10 is identical. The tables below were
    read from v10's body for that reason.
  * Engineering's locked spec (repo: docs/tech-plans/SV-7388-permissions-locked.md) reads
    "Locked 2026-06-02 after iterative sign-off" - the day after v7 was published.
  * The page has Confluence approvals switched OFF (approvalsEnabled=false, empty history), so
    there is NO formal approval record; "Published" is the strongest evidence that exists.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = {'page_id': '565116952', 'title': 'Custom Roles and Permissions', 'space': 'PM',
        'url': 'https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions',
        'owner': 'Sasha Grosman'}

# ── PRD roles (System Role Templates -> Role Descriptions), verbatim ──────────────────────────────
ROLE_DESCRIPTIONS_V7 = """\
| Owner | `system-owner` | Full system access, cannot be demoted |
| Admin | `system-admin` | Full system access |
| Service Manager | `system-sm` | Full operational access, limited admin (App Settings + Wages only) |
| Senior Service Advisor | `system-ssa` | Work order and customer management with expanded access |
| Service Advisor | `system-jsa` | Work order and customer management with invoicing access |
| Foreman | `system-foreman` | Oversees technicians and work orders |
| Technician | `system-tech` | Assigned work orders and time tracking (Tech View) |
| Parts Manager | `system-pm` | Full parts and inventory control |
| Parts Tech | `system-pt` | Parts operations and vendor management |
| Office | `system-office` | Office administration, reporting, and back-office operations |
| Sales Representative | `system-salesrep` | Reports and financial data access only |
| Time Clock | `system-timeclock` | Clock in/out only |"""

# PRD role id -> the implementation's stable template slug (RoleTemplateEnum). A MAPPING, recorded
# with its evidence, never assumed silently. Owner has no implementation template: it was merged
# into Admin (code: RoleFePermissionMappings docblock "SV-5319 (2026-06-12) - Owner role retired
# and merged into Admin per the 2026-06-10 Custom Roles spec change").
PRD_ROLE_TO_IMPL = {
    'system-owner': None, 'system-admin': 'administrator', 'system-sm': 'service_manager',
    'system-ssa': 'senior_service_advisor', 'system-jsa': 'service_advisor', 'system-foreman': 'foreman',
    'system-tech': 'technician', 'system-pm': 'parts_manager', 'system-pt': 'parts_technician',
    'system-office': 'office', 'system-salesrep': 'sales_representative', 'system-timeclock': 'time_clock_user',
}
MATRIX_COLUMNS = ['system-owner', 'system-admin', 'system-sm', 'system-ssa', 'system-jsa', 'system-foreman',
                  'system-tech', 'system-pm', 'system-pt', 'system-office', 'system-salesrep', 'system-timeclock']

# ── Permission Matrix, verbatim (System Role Templates -> Permission Matrix) ──────────────────────
CRUD_MATRIX_V7 = """\
| Area | Owner | Admin | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Work Orders | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V/E | V | V | — | — |
| WO Lines | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V | — | — |
| Schedule | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V | V | V | V | — | — |
| Customers | V/E/D | V/E/D | V/E/D | V/E | V/E | V/E | V | V/E/D | V/E | V/E/D | — | — |
| Part Sales | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V | — | V/E/D | V/E | V | — | — |
| Catalog and Inv | V/E/D | V/E/D | V/E/D | V/E | V/E | V/E | — | V/E/D | V/E | V | — | — |
| Vendor and Order | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | — | V/E/D | V/E/D | V | — | — |
| Invoicing | V/E/D | V/E/D | V/E | V/E/D | V/E/D | V/E | — | V/E/D | V/E | V | — | — |
| Timesheets | V/E | V/E | V/E | V/E | V | V | — | — | V | V/E | — | — |"""

TOGGLE_MATRIX_V7 = """\
| Toggle | Owner | Admin | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Reports | ON | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| Customer Portal | ON | ON | — | ON | ON | — | — | ON | — | — | — | — |
| Parts Dept | ON | ON | ON | ON | ON | ON | — | ON | ON | ON | — | — |
| Billing Portal | ON | ON | ON | — | — | — | — | — | — | ON | — | — |
| Settings | ON | ON | ON | — | — | — | — | ON | — | ON | — | — |"""

SETTINGS_MATRIX_V7 = """\
| Sub-setting | Owner | Admin | Svc Mgr | Parts Mgr | Office |
| --- | --- | --- | --- | --- | --- |
| App Settings | ON | ON | ON | — | ON |
| Service | ON | ON | — | — | ON |
| Parts | ON | ON | — | ON | — |
| Finance | ON | ON | — | ON | ON |
| Data Import | ON | ON | — | ON | ON |
| Wages | ON | ON | ON | — | ON |"""
SETTINGS_COLUMNS = ['system-owner', 'system-admin', 'system-sm', 'system-pm', 'system-office']

OTHER_MATRIX_V7 = """\
| Setting | Owner | Admin | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Review WOs | ON | ON | ON | ON | ON | ON | — | ON | — | — | — | — |
| Pick Parts | ON | ON | ON | ON | ON | ON | ON | ON | ON | — | — | — |
| Order Parts | ON | ON | ON | ON | ON | ON | — | ON | ON | — | — | — |
| View Mode | Full | Full | Full | Full | Full | Full | Tech | Full | Full | Full | Full | Full |
| See Financial | ON | ON | ON | ON | ON | ON | — | ON | ON | ON | ON | — |
| See AP/AR | ON | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| History Logs | ON | ON | ON | ON | ON | ON | — | ON | ON | ON | — | — |"""

# Matrix row label -> how each cell maps onto implementation permission codes.
CRUD_ROWS = {
    'Work Orders': ('workOrders', 'View/CreateAndEdit/Delete'),
    'WO Lines': ('workOrderLines', 'inherit/CreateAndEdit/Delete'),
    'Schedule': ('schedule', 'View/CreateAndEdit/Delete'),
    'Customers': ('customers', 'View/CreateAndEdit/Delete'),
    'Part Sales': ('partSales', 'View/CreateAndEdit/Delete'),
    'Catalog and Inv': ('catalogInventory', 'View/CreateAndEdit/Delete'),
    'Vendor and Order': ('vendorOrderManagement', 'View/CreateAndEdit/Delete'),
    'Invoicing': ('invoicingPayments', 'View/CreateAndEdit/Delete'),
    'Timesheets': ('timesheets', 'View/CreateAndEdit/-'),
}
TOGGLE_ROWS = {'Reports': 'reportsPageAccess', 'Customer Portal': 'customerPortalPageAccess',
               'Parts Dept': 'partsDepartment', 'Billing Portal': 'billingPortalPageAccess', 'Settings': 'settings'}
SETTINGS_ROWS = {'App Settings': 'settingsApp', 'Service': 'settingsService', 'Parts': 'settingsParts',
                 'Finance': 'settingsFinance', 'Data Import': 'settingsDataImport', 'Wages': 'settingsWages'}
OTHER_ROWS = {'Review WOs': 'woReviewWorkOrders', 'Pick Parts': 'woPickParts', 'Order Parts': 'woOrderParts',
              'See Financial': 'seeFinancialData', 'See AP/AR': 'seeApArData', 'History Logs': 'viewHistoryLogs'}

# ── What each permission controls, verbatim (Permission Settings: Complete Reference) ────────────
# (key, label, PRD section, verbatim "Controls"/"Behavior" text)
DESCRIPTIONS_V7 = [
 ('workOrdersView', 'Work Orders — View', '1a. Work Orders', 'See work orders in the work order list and open work order detail pages. If OFF, the Work Orders top level nav item is hidden.'),
 ('workOrdersCreateAndEdit', 'Work Orders — Create and Edit', '1a. Work Orders', 'Create new work orders. Edit work order fields (customer, asset, service advisor, lead technician, status).'),
 ('workOrdersDelete', 'Work Orders — Delete', '1a. Work Orders', 'Delete work orders.'),
 ('woReviewWorkOrders', 'Review Work Orders', '4. Work Order Sub-Settings', 'Gives the user the ability to see and review the work order. Without this setting, users will not see the Review option on work orders.'),
 ('woPickParts', 'Pick Parts', '4. Work Order Sub-Settings', 'Pick parts from inventory onto a work order line. Move parts between work orders. These are physical floor actions — grabbing a part from the shelf or moving a part from one WO to another.'),
 ('woOrderParts', 'Order Parts', '4. Work Order Sub-Settings', 'Place a purchase order for parts needed on a work order. Creates a PO linked to the work order. Also controls receiving parts deliveries onto a work order.'),
 ('workOrderLinesCreateAndEdit', 'Work Order Lines — Create and Edit', '1b. Work Order Lines', 'Add new lines, edit line details, move parts between lines, authorize lines, manage part requests on lines.'),
 ('workOrderLinesDelete', 'Work Order Lines — Delete', '1b. Work Order Lines', 'Remove lines from work orders.'),
 ('scheduleView', 'Schedule — View', '1c. Schedule', 'See the schedule/calendar page. View appointments and technician assignments. If OFF, the Schedule top level nav item is hidden. The schedule shows all technicians\' appointments — there is no "own only" schedule filtering. The schedule is a shared resource that SAs/managers use to coordinate work across all techs.'),
 ('scheduleCreateAndEdit', 'Schedule — Create and Edit', '1c. Schedule', 'Create and modify appointments, assign technicians to time slots, drag-and-drop scheduling.'),
 ('scheduleDelete', 'Schedule — Delete', '1c. Schedule', 'Remove appointments from the schedule.'),
 ('customersView', 'Customer Management — View', '1d. Customer Management', 'See customer records, contacts, vehicles, and vehicle history. If OFF, the Customers top level nav item is hidden.'),
 ('customersCreateAndEdit', 'Customer Management — Create and Edit', '1d. Customer Management', 'Create new customers, edit customer information, manage contacts, manage vehicles. Note: sensitive fields on the Edit Customer modal are hidden unless "View and Manage AP/AR Data" is enabled (see below).'),
 ('customersDelete', 'Customer Management — Delete', '1d. Customer Management', 'Delete customer records. Does NOT control deleting customer payments — that requires Invoicing: Delete.'),
 ('partSalesView', 'Part Sales — View', '1e. Part Sales', 'View part sales records, part returns, and part-related transactions.'),
 ('partSalesCreateAndEdit', 'Part Sales — Create and Edit', '1e. Part Sales', 'Create part sales, create part returns, process part transactions.'),
 ('partSalesDelete', 'Part Sales — Delete', '1e. Part Sales', 'Delete part sales and reverse part sales invoices.'),
 ('catalogInventoryView', 'Catalog and Inventory — View', '1f. Catalog and Inventory', 'Browse the parts catalog, view inventory levels and stock information, view parts history.'),
 ('catalogInventoryCreateAndEdit', 'Catalog and Inventory — Create and Edit', '1f. Catalog and Inventory', 'Create and edit catalog entries, make inventory adjustments, manage stock levels.'),
 ('catalogInventoryDelete', 'Catalog and Inventory — Delete', '1f. Catalog and Inventory', 'Delete parts from the catalog.'),
 ('vendorOrderManagementView', 'Vendor and Order Management — View', '1g. Vendor and Order Management', 'View vendor records, purchase orders, deliveries, vendor transaction history, and part return requests.'),
 ('vendorOrderManagementCreateAndEdit', 'Vendor and Order Management — Create and Edit', '1g. Vendor and Order Management', 'Create and edit vendors, create and manage purchase orders, manage deliveries, create vendor invoices. Includes returning parts to vendors or inventory.'),
 ('vendorOrderManagementDelete', 'Vendor and Order Management — Delete', '1g. Vendor and Order Management', 'Delete vendors, delete purchase orders, reverse vendor transactions.'),
 ('invoicingPaymentsView', 'Invoicing — View', '1h. Invoicing', 'View invoices directly from work orders and part sales. Access the Finance tab on work orders. If OFF (but See Financial Data is ON), users can still see pricing data on work orders but cannot access invoices directly from work orders or part sales.'),
 ('invoicingPaymentsCreateAndEdit', 'Invoicing — Create and Edit', '1h. Invoicing', 'Create invoices, process payments directly from work orders and part sales, manage invoice fields.'),
 ('invoicingPaymentsDelete', 'Invoicing — Delete / Reverse', '1h. Invoicing', 'Reverse invoices, delete payments (including customer payments), void transactions.'),
 ('timesheetsView', 'Timesheets — View', '1i. Timesheets', 'View timesheets from work orders. If OFF, the Timesheets top level nav item is hidden. However, if the user has Reports ON they will still see the timesheet activities report. (Note: all users can always clock in/out regardless of this setting.)'),
 ('timesheetsCreateAndEdit', 'Timesheets — Create and Edit', '1i. Timesheets', 'Edit timesheet entries, adjust hours, manage attendance records for all staff. This includes editing from the work order and the timesheet activities report.'),
 ('reportsPageAccess', 'Reports', '2a. Reports', 'User can access the Reports page and view all available reports (tech efficiency, service advisor analysis, requested parts, vendor expenses, WO statuses, inventory, work-in-progress, etc.).'),
 ('customerPortalPageAccess', 'Customer Portal', '2b. Customer Portal', 'User can access and manage the customer-facing portal configuration.'),
 ('billingPortalPageAccess', 'Billing Portal', '2c. Billing Portal', 'User can access and manage the billing portal.'),
 ('partsDepartment', 'Parts Department', '2d. Parts Department (Parent Gate)', 'The three Parts child areas become available and are controlled by their individual CRUD permissions. Parts Department top level nav section is visible.'),
 ('settings', 'Settings', '3. Settings Access', 'User can access the Administration/Settings area. Which sub-sections they see depends on the sub-settings below.'),
 ('settingsApp', 'App Settings', '3. Settings Access', 'General application configuration — organization name, business info, locale, branding. Also covers Roles and Permissions management (creating/editing/deleting custom roles), Integrations management, and Staff/Workplaces management.'),
 ('settingsService', 'Service', '3. Settings Access', 'Service-related configuration — labor types, canned lines, asset types, departments, bays.'),
 ('settingsParts', 'Parts', '3. Settings Access', 'Parts settings — pricing matrices, categories, parts-specific configuration.'),
 ('settingsFinance', 'Finance', '3. Settings Access', 'Financial settings — tax configuration, payment settings, accounting integrations (including QuickBooks), payment methods.'),
 ('settingsDataImport', 'Data Import', '3. Settings Access', 'Data import tools — bulk import of customers, vehicles, parts, and other records.'),
 ('settingsWages', 'View/Manage Wages', '3. Settings Access', 'View and manage employee wage rates. This is sensitive data — typically limited to Owner, Admin, SM, or Office roles.'),
 ('woFullViewMode', 'View Mode — Full View', '5. View Mode', 'Complete work order interface with all fields visible and editable (subject to CRUD permissions). Full parts request form with all fields. All workflow actions available (approve, review, split, etc.). The Estimate column on work order lines shows the actual estimate value.'),
 ('woTechViewMode', 'View Mode — Tech View', '5. View Mode', 'Simplified work order interface designed for technicians. See restriction table below.'),
 ('seeFinancialData', 'See Financial Data', '6a. See Financial Data', 'User can see pricing, costs, margins, and financial columns throughout the app. This includes: labor rates on work order lines, parts pricing, total/labor/parts columns on work orders, cost and margin data on parts, and financial summaries.'),
 ('seeApArData', 'View and Manage AP/AR Data', '6b. View and Manage AP/AR Data', 'User can see accounts payable/receivable data: Unpaid Invoices tabs, Payments tabs, and Credits tabs on Customer and Vendor detail pages, AP/AR aging reports (AR Aging Summary, AR Aging Detail, AR Aging Collection, AP Aging Summary, AP Aging Detail, AP Unpaid Invoices), and can make bulk payments from the Unpaid Invoices tab. Also controls visibility of sensitive customer fields on the Edit Customer modal (Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min and Max, Taxes, PO is Required).'),
 ('viewHistoryLogs', 'View History Logs', '6c. View History Logs', 'User can view history/audit logs wherever they appear in the app — work order history, part sales history, parts order history, and similar change logs.'),
]

# ── Dependencies the PRD states, each with its verbatim sentence ─────────────────────────────────
DEPENDENCIES_V7 = [
 ('crud', '1. CRUD Areas', 'Enabling a higher level auto-enables the levels below it. For example, enabling Edit auto-enables View. Enabling Delete auto-enables both Edit and View.'),
 ('crud_down', '1. CRUD Areas', 'Disabling a lower level auto-disables the levels above it. For example, disabling View auto-disables Edit and Delete. Disabling Edit auto-disables Delete.'),
 ('wol', '1b. Work Order Lines', 'Work Order Lines is a child of Work Orders. There is no independent View toggle — Work Order Lines are visible whenever Work Orders View is ON.'),
 ('wo_subs', '4. Work Order Sub-Settings', 'These sub-settings only require Work Orders: **View** to be enabled. Users do NOT need Work Orders: Create and Edit to pick parts, order parts, or review work orders.'),
 ('parts_gate', '2d. Parts Department (Parent Gate)', 'All three Parts child areas are inaccessible regardless of their individual CRUD settings. Parts Department top level nav section is hidden.'),
 ('financial_gate', '6a. See Financial Data', 'Part Sales and Invoicing CRUD areas require this toggle to be ON. If See Financial Data is turned OFF, those areas become inaccessible regardless of their CRUD settings.'),
 ('settings_gate', '3. Settings Access', 'Administration top level nav item is hidden. All sub-settings are inaccessible.'),
]
CRUD_AREAS = ['workOrders', 'schedule', 'customers', 'partSales', 'catalogInventory', 'vendorOrderManagement',
              'invoicingPayments']

OTHER_RULES_V7 = [
 ('role_editability', 'Concepts — Roles', 'System roles can be edited, with exceptions: **Office** and **Time Clock** roles cannot be edited. System roles cannot be deleted.'),
 ('role_delete', 'Admin Pages — Delete Role', 'If **1+ users** are assigned: a **"Cannot Delete"** modal appears with the message: "This role is assigned to N user(s). Reassign them to another role before deleting." The delete/confirm button is **disabled** — the admin cannot proceed until all users are reassigned to a different role.'),
 ('financial_modal', 'Admin Pages — Financial Data Confirmation Modal', '**Trigger:** User enables any Invoicing or Part Sales CRUD checkbox (View, Edit, or Delete) while See Financial Data is OFF.'),
 ('forced_logout', 'Staff Page Updates', "Changing a user's role triggers a forced logout for the affected user. The new role takes effect when they log back in."),
 ('view_mode_not_security', '5. View Mode', 'View Mode is a **UX simplification, not a security boundary**. A user in Tech View with Edit permissions still has edit access — they just see a simpler interface.'),
 ('clock_always', 'Key Decisions', 'Every user can clock in and out regardless of Timesheets permissions.'),
 ('owner_admin', 'Concepts — Owner vs Administrator', 'Owner and Administrator are separate system roles.'),
]

SOURCES = {'v7': {'version': 7, 'published_at': '2026-06-01T13:15:42.706Z', 'status_in_page': 'Published',
                  'read_from_version': 10, 'read_from_version_created': '2026-06-01T13:50:01.225Z',
                  'why_read_from_v10': 'diff v7->v10 touches only the Change Log (2 additions, 1 deletion); '
                                       'the requirement text is identical',
                  'tables': (CRUD_MATRIX_V7, TOGGLE_MATRIX_V7, SETTINGS_MATRIX_V7, OTHER_MATRIX_V7,
                             ROLE_DESCRIPTIONS_V7, DESCRIPTIONS_V7, DEPENDENCIES_V7, OTHER_RULES_V7)}}


def verify_against_source(version):
    """Re-prove, on every build, that each pasted table row and each quote is in the saved PRD
    source for this version, character for character (inline markup removed, never reworded)."""
    import html as _html
    path = os.path.join(HERE, 'source', f'prd-{version}.html')
    if not os.path.exists(path):
        return {'ok': False, 'why': f'{path} missing - cannot prove the quotes are verbatim'}
    body = open(path).read()
    inline = r'</?(?:strong|em|span|a|code|u|s|sup|sub|ac:inline-comment-marker|ac:link|ri:[^ >]+)[^>]*>'
    text = re.sub(r'\s+', ' ', _html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(inline, '', body))))
    cells = set()
    for tr in re.findall(r'<tr>(.*?)</tr>', body, re.S):
        cs = [re.sub(r'\s+', ' ', _html.unescape(re.sub(r'<[^>]+>', '', c))).strip()
              for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, re.S)]
        cells.add(tuple(c.replace('`', '') for c in cs))
    flat = lambda t: re.sub(r'\s+', ' ', t.replace('**', '')).strip()
    crud, toggle, settings, other, roles_t, descs, deps, rules = SOURCES[version]['tables']
    bad_rows = [r for t in (crud, toggle, settings, other, roles_t) for r in rows(t)
                if tuple(c.replace('`', '').replace('**', '') for c in r) not in cells]
    quotes = [t for _, _, _, t in descs] + [t for _, _, t in deps + rules]
    bad_quotes = [q for q in quotes if flat(q) not in text]
    n_rows = sum(len(rows(t)) for t in (crud, toggle, settings, other, roles_t))
    return {'ok': not bad_rows and not bad_quotes, 'source_file': os.path.relpath(path, HERE),
            'table_rows_checked': n_rows, 'table_rows_not_found': bad_rows,
            'quotes_checked': len(quotes), 'quotes_not_found': bad_quotes}


def rows(table):
    out = []
    for line in table.splitlines():
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if not cells or set(cells[0]) <= {'-', ' '} or cells[0] in ('Area', 'Toggle', 'Setting', 'Sub-setting'):
            continue
        out.append(cells)
    return out


def build(version):
    src = SOURCES[version]
    crud, toggle, settings, other, roles_t, descs, deps, rules = src['tables']
    defaults = {r: set() for r in MATRIX_COLUMNS}
    cell_evidence = {}

    def grant(role, perm, row_label, cell, table_name):
        defaults[role].add(perm)
        cell_evidence.setdefault(role, {})[perm] = {'table': table_name, 'row': row_label, 'cell': cell}

    for cells in rows(crud):
        label, vals = cells[0], cells[1:]
        area, levels = CRUD_ROWS[label]
        lv = levels.split('/')
        for role, v in zip(MATRIX_COLUMNS, vals):
            if v in ('—', '-', ''):
                continue
            for letter, level in zip('VED', lv):
                if letter in v.split('/') and level not in ('inherit', '-'):
                    grant(role, f'{area}{level}', label, v, 'Permission Matrix — CRUD Areas')
    for cells in rows(toggle):
        for role, v in zip(MATRIX_COLUMNS, cells[1:]):
            if v == 'ON':
                grant(role, TOGGLE_ROWS[cells[0]], cells[0], v, 'Permission Matrix — Toggles')
    for cells in rows(settings):
        for role, v in zip(SETTINGS_COLUMNS, cells[1:]):
            if v == 'ON':
                grant(role, SETTINGS_ROWS[cells[0]], cells[0], v, 'Permission Matrix — Settings Sub-Toggles')
    for cells in rows(other):
        for role, v in zip(MATRIX_COLUMNS, cells[1:]):
            if cells[0] == 'View Mode':
                grant(role, 'woFullViewMode' if v == 'Full' else 'woTechViewMode', 'View Mode', v,
                      'Permission Matrix — WO Sub-Settings, View Mode, Cross-Cutting Toggles')
            elif v == 'ON':
                grant(role, OTHER_ROWS[cells[0]], cells[0], v,
                      'Permission Matrix — WO Sub-Settings, View Mode, Cross-Cutting Toggles')

    roles = []
    for cells in rows(roles_t):
        name, rid, desc = cells[0], cells[1].strip('`'), cells[2]
        roles.append({'key': rid, 'name': name, 'description_verbatim': desc,
                      'impl_role': PRD_ROLE_TO_IMPL.get(rid),
                      'editable_when_system': rid not in ('system-office', 'system-timeclock'),
                      'deletable_when_system': False})

    dependencies = []
    q = {k: (sec, txt) for k, sec, txt in deps}
    for a in CRUD_AREAS:
        for child, parent in ((f'{a}Delete', f'{a}CreateAndEdit'), (f'{a}CreateAndEdit', f'{a}View')):
            dependencies.append({'child': child, 'parent': parent, 'kind': 'implies',
                                 'quote': {'section': q['crud'][0], 'verbatim': q['crud'][1]}})
    dependencies += [
        {'child': 'timesheetsCreateAndEdit', 'parent': 'timesheetsView', 'kind': 'implies',
         'quote': {'section': q['crud'][0], 'verbatim': q['crud'][1]}},
        {'child': 'workOrderLinesDelete', 'parent': 'workOrderLinesCreateAndEdit', 'kind': 'implies',
         'quote': {'section': q['crud'][0], 'verbatim': q['crud'][1]}},
        {'child': 'workOrderLinesCreateAndEdit', 'parent': 'workOrdersView', 'kind': 'implies',
         'quote': {'section': q['wol'][0], 'verbatim': q['wol'][1]}},
    ]
    for c in ('woReviewWorkOrders', 'woPickParts', 'woOrderParts'):
        dependencies.append({'child': c, 'parent': 'workOrdersView', 'kind': 'implies',
                             'quote': {'section': q['wo_subs'][0], 'verbatim': q['wo_subs'][1]}})
    for a in ('partSales', 'catalogInventory', 'vendorOrderManagement'):
        for lvl in ('View', 'CreateAndEdit', 'Delete'):
            dependencies.append({'child': f'{a}{lvl}', 'parent': 'partsDepartment', 'kind': 'gated_by',
                                 'quote': {'section': q['parts_gate'][0], 'verbatim': q['parts_gate'][1]}})
    for a in ('partSales', 'invoicingPayments'):
        for lvl in ('View', 'CreateAndEdit', 'Delete'):
            dependencies.append({'child': f'{a}{lvl}', 'parent': 'seeFinancialData', 'kind': 'requires',
                                 'quote': {'section': q['financial_gate'][0], 'verbatim': q['financial_gate'][1]}})
    for k in SETTINGS_ROWS.values():
        dependencies.append({'child': k, 'parent': 'settings', 'kind': 'gated_by',
                             'quote': {'section': q['settings_gate'][0], 'verbatim': q['settings_gate'][1]}})

    coverage = {}
    for label, (area, levels) in CRUD_ROWS.items():
        for l in levels.split('/'):
            if l not in ('inherit', '-'):
                coverage[f'{area}{l}'] = list(MATRIX_COLUMNS)
    for k in list(TOGGLE_ROWS.values()) + list(SETTINGS_ROWS.values()) + list(OTHER_ROWS.values()) + \
            ['woFullViewMode', 'woTechViewMode']:
        coverage[k] = list(MATRIX_COLUMNS)

    perms = [{'key': k, 'label': lbl, 'prd_section': sec,
              'controls_verbatim': txt,
              'prd_only': k in ('partsDepartment', 'settings'),
              } for k, lbl, sec, txt in descs]
    return {
        'schema_version': 1,
        'kind': 'prd',
        'source': dict(PAGE, **{k: v for k, v in src.items() if k != 'tables'}),
        'evidence_level': 'Documented intent (PRD). Not implementation, not verified behaviour.',
        'roles': roles,
        'permissions': perms,
        'role_defaults': {r: sorted(v) for r, v in defaults.items()},
        'cell_evidence': cell_evidence,
        'dependencies': dependencies,
        'rules': [{'key': k, 'section': s, 'verbatim': t} for k, s, t in rules],
        'matrix_roles': list(MATRIX_COLUMNS),
        'matrix_coverage': coverage,
        'verbatim_check': verify_against_source(version),
        'change_log': [{'date': None, 'reporter': '@Sasha Grosman', 'change_verbatim':
            '- Removed “Data model” table. This was an AI hallucination. There was no intent to suggest technical '
            'implementation. - RE data access vs feature access. Clarified in feature over and key decisions that these '
            'permissions control feature access, not data access. Core requirements did not need updatingl. - Removed '
            'AP/AR metrics settings per discussions offline'}],
        'notes': [
            'PRD-only parent gates: "partsDepartment" and "settings" are role-editor parent toggles in the '
            'PRD. The implementation stores no permission for them; the comparison derives them from '
            'the child permissions a role holds.',
            'View Mode is listed as "Full" for Sales Representative and Time Clock, roles with no Work Orders '
            'access; recorded exactly as the PRD states it.',
        ],
    }


if __name__ == '__main__':
    v = sys.argv[1] if len(sys.argv) > 1 else 'v7'
    snap = build(v)
    out = os.path.join(HERE, 'out', f'prd-{v}.json')
    json.dump(snap, open(out, 'w'), indent=1, ensure_ascii=False)
    print(f"{os.path.normpath(out)}: {len(snap['roles'])} roles, {len(snap['permissions'])} permissions, "
          f"{sum(len(x) for x in snap['role_defaults'].values())} role grants, {len(snap['dependencies'])} dependencies")
