"""Classification rules for the Internal Work Orders design text inventory (12 Nov 2026).
Classes: DATA · PRD-MATCH (codes) · OUT-OF-SCOPE (reason) · SPEC-CONFLICT (register id) · LOOK-ONLY (design-only words, no PRD conflict).
Every rendered text, attribute text, board title, canvas note and source-only string goes through classify_text / NOTES / TITLES."""
import re
import prd as P

# ---------------------------------------------------------------------------------------------------------------- DATA
DATA_RE = re.compile(r"""^(
  \$[\d,]+\.\d\d(/h|\scost)? | [\d,.]+%? | \d+(\.\d+)?\s?(h|hrs)? | \d{1,2}:\d\d | \(?\d{3}\)?[\s-]+\d{3}\s?-\s?\d{4} | \d{3}-\d{3}-\d{4} |
  (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{4}(\s\d{1,2}:\d\d\s[AP]M)? | Thursday,\sOct\s22,\s2026 | Oct\s1\sto\sOct\s2[26],\s2026 |
  S2-\d{5}(\s·\s.*)? | EST-S2-\d{5} | JE-\d{4} | INV-\d{4} | \d{2} | [A-Z]{2} | [0-9A-Z]{17} | 8FGU25(-71244)? | ZZT-4471 | 4,120 | 89135 | 2021 |
  \d{4}\s[A-Z][A-Za-z &()]+ | 1\.00\s/\s1\.00 | 2\.00\s/\s2\.00 | 0\s·\s0\.0\sh | \d+\.\d\shrs | 1\.0\sh | 2\.0\sh | 3\.0\sh
)$""", re.X)
NAMES = {  # people, customers, places, assets, parts, line titles: demo data on the boards
    'A & J Truck & Trailer Repair', 'A. Keating', 'Aberdeen Diesel Services LLC', 'Abode Trucking & Repair', 'Admin ShopView', 'Affordable Fleet Services',
    'Apex Freight Lines', 'Apex Freight Lines · Unit 22', 'Ave Maria Truck Repair', 'Calgary', 'Red Deer', 'Hilltop Logistics', 'Hilltop Logistics · Unit 7',
    'Hilltop Logistics · Truck 4, 2019 Kenworth T680', 'J. Alvarez', 'J. Okonkwo', 'M. Rhodes', 'Mario Jenkins', 'Staging Heavy Duty Fleet',
    'Staging Heavy Duty Fleet · Forklift 2', 'Staging Heavy Duty Fleet · Unit 12', 'Staging Heavy Duty Fleet · Unit 14', 'Staging Heavy Duty - 9919',
    'Staging Main', 'Staging North', 'ZZAUTOTEST Bridgeport Hauling', 'ZZAUTOTEST Bridgeport Hauling · ZZT-4471', '4 Star Truck Repair', '7 Star Truck Repair',
    '2017 Ford Transit', '2017 Ford Transit, Unit 14', '2019 Freightliner Cascadia', '2019 Freightliner Cascadia · Unit 7', '2019 Freightliner Cascadia, Unit 12',
    'Ford E-250', 'Ford Transit', 'Freightliner Cascadia', 'Hyundai Santa Fe', 'Toyota 8FGU25 forklift', 'Toyota 8FGU25 forklift, Forklift 2', 'Forklift 2',
    'Forklift 2 · Staging Heavy Duty Fleet · Serial 8FGU25-71244', 'Unit 14 · Staging Heavy Duty Fleet · VIN 2ZTM0GN6FHYZT4KXE', 'Unit 12', 'Unit 14', 'Unit 7',
    'Unit 14 · 2017 Ford Transit', 'Unit 22 · 2020 Kenworth T680', 'Unit 7 · 2019 Freightliner Cascadia', 'Brake caliper (special order)', 'Brake pads',
    'Caliper (special order)', 'Core · Brake caliper', 'Gasket kit', 'Rotor', 'Turbo actuator', 'Replace - Brake caliper', 'Replace - Brake caliper · 1.0 h',
    'Replace - Brake pads and rotors', 'Replace turbo actuator', 'Replace turbo actuator · 2.0 h', 'PM Service · 1.5 h', '02 Replace - Brake caliper', 'Worn', 'Seized',
    '10842 West Charleston Boulevard', '10842 West Charleston Boulevard, Suite 450-B', '10842 West Charleston Boulevard, Suite 450-B, Las Vegas, Nevada 89135',
    'Las Vegas', 'Las Vegas, Nevada 89135', 'Nevada', 'Suite 450-B', 'Suite 079', '17483 Shane Drive', '305 Harris Cape', '348 Ramos Field', '7522 Sampson Gardens',
    '88 Harbour Rd', '94154 Dominguez Gateway', 'Millertown', 'New Brunswick', 'North Jenniferland', 'Nova Scotia', 'Nunavut', 'Ontario', 'Patriciashire',
    'Priscillabury', 'Toronto', 'Vincenttown', 'Heavy Duty', 'Customer asked to be called before any extra work.', 'Shop Equipment', 'Toyota', 'Forklift',
    'United States', 'Net 30', 'Standard, $149.95/h', 'Standard · $149.95/h', 'Default Tax Settings', 'Accounts Receivable', 'Undeposited Funds', '1300 Inventory',
    '5000 Cost of parts', '02 · Replace alternator · M. Rhodes', 'S2-34918 · Unit 14 · In Progress', 'S2-34951 · Unit 22 · Approved', 'S2-35004 · Unit 14 · Estimate',
    '1.00 h · Caliper (special order) × 1 · M. Rhodes · $559.95', '1 · Warranty · parts cost $410.00', 'Customers (1735)', 'Vendors (670)', 'Journal Entries (74)',
    'Today', 'Yesterday', 'S2-30455 · 02', '· 02', '-', '—', '.', ':', 'qb', '⌘', 'K', 'Lines (1)', 'Lines (2)', 'Parts (1)', 'Parts (4)', 'Staging Heavy Duty Internal',
    'Company Vehicle Maintenance', 'Shop Equipment Maintenance', 'General Internal', 'Warranty', 'Goodwill', 'Comeback',
    '1 work order · 3.0 h', '1 work order, 1 line · 3.0 h', '2 work orders, 1 line', '1 more at locations you don\'t have access to.',
}

# ------------------------------------------------------------------------------------------------- OUT-OF-SCOPE (today's screens)
PRODUCTION = {  # labels of screens and components that exist today and that the feature does not change (data-sv-change "unchanged")
    'Work Orders', 'Schedule', 'Customers', 'Parts', 'Reports', 'Search', 'Settings', 'Staff', 'Roles & Permissions', 'Locations', 'Departments', 'Taxes',
    'Labor Rates', 'Canned Lines', 'Fees & Discounts', 'Asset Types', 'Inspection Templates', 'Pricing', 'Bin Locations', 'Categories', 'QuickBooks', 'IBS',
    'Open API', 'Payment Methods', 'Contacts', 'Assets', 'Vendors', 'Inventory', 'Invoices', 'SETTINGS', 'SERVICE', 'PARTS', 'INTEGRATIONS', 'FINANCE', 'IMPORTS',
    'Service', 'Integrations', 'Imports', 'Organization', 'Invoice', 'Workflow', 'Line Requirements', 'Require Approval for New Lines',
    'When on, new work order lines require approval. When off, they are auto-approved.', 'Require Review Before Completion',
    'Work orders must be reviewed and signed off before they can be completed', 'Require Tech Story',
    'Tech story will be a required field before a line can be completed on a work order', 'Require Mileage',
    'Mileage will be a required field before a line can be completed on a work order', 'Require Engine Hours',
    'Engine hours will be a required field before a line can be completed on a work order', 'Require Ordering Parts',
    "When on, you click Order on each part to record that you've ordered it. When off, parts are marked as ordered automatically.",
    'Require Receiving Parts Before Completion',
    'When on, each part must be recorded as received before the work order can be completed, reviewed or invoiced. When off, you can finish the work order and receive later.',
    'Require Picking Inventory Parts',
    "When on, you click Pick on each inventory and found part to record that it's been pulled. When off, these parts are ready as soon as the line is approved.",
    'Save Settings', 'Customer Name', 'Telephone', 'Address 1', 'Address 2', 'City', 'State/Province', 'New Customer', 'Edit Customer', 'Name', 'Phone',
    'ZIP/Postal Code', 'Country', 'Credit Terms', 'Credit Limit', 'Sales Representative', 'Default Labor Rate', 'Default Shop Supplies', 'Min', 'Max', 'Notes',
    'Website', 'Taxes', 'PO is required', 'Delete', 'Save', 'Edit', 'Address', 'Edit Asset', 'Unit #', 'Asset type', 'Year', 'Make', 'Model', 'VIN / Serial #',
    'Engine hours', 'License plate', 'Details', 'Updated from QuickBooks 2 minutes ago', 'Refresh From QuickBooks', 'Advanced mapping', 'ShopView Accounts',
    'QuickBooks Accounts', 'Account Receivable', 'Inventory Asset', 'Received Payments', 'Refunds Paid From', 'Pick the bank account refunds are paid from.',
    'Cost of Parts', 'Cost of Goods (tax)', 'Customer Deposits Liability', 'Select Account', 'Account', 'All', 'Estimates', 'Completed', 'Assigned to me',
    'Asset on site', 'Create Work Order', 'On Site', 'Status', 'Number', 'Customer', 'Asset', 'Lead Technician', 'Lines', 'Total price', 'In progress', 'Approved',
    'Review', 'Estimate', 'Complete', 'Search customers, work orders, parts...', 'New work order', 'Add', 'Asset Here?', 'Started', 'Total Hours', 'Service Advisor',
    'Contact', 'Unit', 'VIN/Serial #', 'Mileage', 'Financial Info', 'Item', 'Cost', 'Parts', 'Labor', 'Total', 'Notes', 'Stats', 'Finance', 'New Line',
    'Name/Description', 'Actual/Estimate', 'Rate', 'In Progress', 'Ready for Review', 'Mark Reviewed', 'Create invoice', 'Customer PO', 'Estimate/Invoice',
    'Invoice Date', 'Estimate:', 'Estimate date:', 'Bill to', 'Work summary', 'Work performed', 'Line total', 'Qty / Hours', 'Amount', 'Tax', 'Total due',
    'Shop logo', 'Date:', 'Work Order', 'Audit Log', 'Timesheets', 'Print Work Order', 'Add Work Order Fee / Discount', 'Edit line', 'Duplicate line', 'Delete line',
    'Add a note', 'System', 'Missing Details', 'VIN', 'Mileage *', 'Engine Hours *', 'Cancel', 'Edit Line', 'Title *', 'Description', 'Estimated hours',
    'Labor rate', 'Technician', 'Send to Portal', 'Invoice #', 'Date', 'Discount', 'Tax rate', 'Total balance', 'Actions', 'Timesheet Activities', 'Sales',
    'Technician Efficiency', 'Advisor Analysis', 'Shop Efficiency', 'Work In Progress', 'Technician Utilization', 'Sales By Customer', 'Sales By Representative',
    'Parts Velocity', 'Inventory Value', 'Sales Tax Collected', 'A/R Aging Summary', 'A/R Aging Detail', 'A/R Aging Collection', 'A/P Aging Summary',
    'A/P Aging Detail', 'A/P Unpaid Invoices', 'IBS Batches', 'QB Unexported', 'Export Reports', 'Reminders', 'Date range', 'Clocked hours', 'Billed hours',
    'Efficiency', 'Quickbooks Unexported Items', 'Type', 'No.', 'Error', 'Export Manually', 'Mark As Exported', 'Mark as Exported', 'Export', 'Journal Entry',
    'The account period has closed and the account books cannot be updated.', 'The Class mapped in your Bookkeeping settings no longer exists in QuickBooks',
    'AccountingHub', 'Draft', 'Posted', 'Partially paid', 'Paid', 'Void', 'Synced', 'Invoiced', 'Accounting Events', 'Event', 'Reference', 'Reason', 'Retry',
    'Open in ShopView', 'Preview', 'Download PDF', 'Summary', 'Journal entry', 'Entry', 'Description', 'Debit', 'Credit', 'Revenue', 'Invoice date',
    'Revenue, labor and parts', 'Accounts receivable', 'Cost of parts, billable lines', 'Approve', 'Decline', 'Customer portal', 'Line', 'Qty', 'Hours',
    'Tech View', 'My assigned lines', 'Clock In', 'Work Orders · Board', 'No work orders match these filters', 'Try removing a filter to widen your results.',
    'Location', 'Search customers', 'Customers', 'Continue',
}
ATTR_PRODUCTION = {'Back', 'Close', 'Columns', 'Download', 'Email', 'Print', 'Settings', 'Shop logo', 'ShopView', 'Shopview', 'User menu', 'Primary', 'More actions',
                   'Line actions', 'Invoice actions', 'Change Customer', 'Category actions', 'QuickBooks', 'About Internal customer', 'About No Charge',
                   'About internal work orders'}

# ---------------------------------------------------------------------------------------------------------- SPEC-CONFLICT (register)
CONFLICT = {
    "Lets you flag your own company as an internal customer and mark a customer's work order as No Charge (warranty, goodwill, comeback). Both close without an invoice; their parts cost posts to the expense account of their category instead of Cost of Parts.": 'IWO-D01',
    '(Administration > Service). Their expense accounts are set there or in Integrations >': 'IWO-D02',
    'No-Charge Work Orders': 'IWO-D04',
    'Lets you flag internal customers and mark work orders as no charge. Both close without an invoice; parts cost posts to your expense accounts.': 'IWO-D04',
    'Work orders for these customers are internal: no prices and no invoice; parts cost posts to your Internal Work Orders Expense account when you use QuickBooks or AccountingHub. Nothing is picked for you: your location is not always a customer, and the names can differ. Pick one or more, or do it later from the customer page.': 'IWO-D05',
    'Preselected on every new work order for this customer; a work order can change it. New internal customers get General Internal.': 'IWO-D09',
    'Internal Work Orders is off. Turn it on in Settings > Work Orders to use these categories; nothing here is deleted while it is off.': 'IWO-D07',
    'Turn on Internal Work Orders in Settings > Work Orders.': 'IWO-D07',
    'Internal customers': 'IWO-D08',
    "Shown in the Category select when a work order is marked No Charge. It shows on the work order, the NO CHARGE document and the Internal Work Orders report.": 'IWO-D09',
    'Where the cost of work on your own equipment goes. Each internal customer has a default category; a work order can change it.': 'IWO-D09',
    'Not set at any location. Parts cost of this category posts to the ShopView Review account until you pick one.': 'IWO-D10',
    'Internal work orders · one row per category': 'IWO-D11', 'No Charge work orders · one row per category': 'IWO-D11',
    'Not set. Parts cost of this category posts to the ShopView Review account until you pick one.': 'IWO-D11',
    'Value': 'IWO-D17',
    'This posts the parts cost and shop supplies to your books and marks the work order Closed · No Charge. You can reopen it later.': 'IWO-D20',
    'This marks the work order Closed · No Charge. Parts cost and hours are in the Internal Work Orders report.': 'IWO-D21',
    'No account set for internal work orders. The entry posts to the ShopView Review account until you set one.': 'IWO-D22',
    "A customer's free job: warranty, goodwill, policy, comeback or a category of your own. Closes without an invoice; parts cost posts to the category's expense account.": 'IWO-D23',
    'No charge. This work order closes without an invoice. Parts cost posts to Customer No-Charge Expense.': 'IWO-D23',
    'Convert work order S2-35102 to no charge?': 'IWO-D25',
    "Every line is priced at the customer's current pricing. You can convert it to no charge again until it is invoiced.": 'IWO-D26',
    "Converted to Billable by Admin ShopView. Every line priced at the customer's current pricing. Category Warranty removed.": 'IWO-D26',
    'Reopen': 'IWO-D27',
    'Closed on Oct 22, 2026 by Admin ShopView': 'IWO-D29', 'This work order is locked. Reopen it to change lines, hours or parts.': 'IWO-D29',
    'Reopening returns it from Closed · Internal to Complete.': 'IWO-D29',
    'The work order leaves Closed · No Charge and goes back to Complete.': 'IWO-D30',
    'Work order S2-34918 reopened': 'IWO-D31',
    'The vendor bill for the caliper ($410.00) was posted to Internal Work Orders Expense. If you continue, that cost moves to Cost of Parts when this work order is invoiced.': 'IWO-D34',
    'The vendor bill for the caliper ($410.00) was posted to Cost of Parts. If you continue, that cost moves to Internal Work Orders Expense when this work order is closed.': 'IWO-D34',
    'Line "Replace - Brake caliper" marked No Charge by Admin ShopView. Category Warranty, original work order S2-30455. Line price $559.95 removed; cost $410.00 and 1.00 h kept. The work order stays billable.': 'IWO-D33',
    'Internal work order': 'IWO-D37', 'Adds an Internal option when creating work orders. Creates the system customer Staging Heavy Duty Internal for your own trucks and equipment.': 'IWO-D37',
    'Internal work orders': 'IWO-D37', 'System customer for your own trucks and equipment.': 'IWO-D37',
    'No-charge work orders': 'IWO-D41', 'Only no-charge': 'IWO-D41',
    'Not in ShopView / no technician': 'IWO-D42',
    'Comeback rate = comeback lines attributed to the technician / lines the technician completed in the date range. Redo hours and parts cost are what the comeback and warranty work cost the shop; the dollar cost of labor comes with labor posting (V2).': 'IWO-D42',
    '$700.00': 'IWO-D43',
    'General Internal: expense account is not mapped': 'IWO-D47',
    'Move this tooltip text. It\'s fine to be just this tag here, which is fine, but let\'s bring back the explanation a little, just one sentence.': 'IWO-D50',
    "Badge here, we agree, is not no-charge warranty. It's no charge, just that the badge itself": 'IWO-D50',
    'Category: General Internal': 'IWO-D19',
    'INTERNAL': 'IWO-D19',
    'No Charge.': 'IWO-D19',
    'Category: Warranty · Original work order S2-31207': 'IWO-D32',
}

# ------------------------------------------------------------------------------------------------------------- LOOK-ONLY (design words)
LOOK = {  # words the design adds where the PRD is silent and nothing conflicts (Rule 126.5: the design is the source of the look)
    'Categories for work that is not billed: your own equipment (Internal) and a customer\'s free job (No Charge). Each category names the expense account its parts cost posts to.': 'page intro (PRD S1-R13 gives no intro)',
    "Why a customer's work order is free. Picked when a work order is marked No Charge. Categories that require the original work order ask which earlier work order the job comes from.": 'list help (PRD silent)',
    'The QuickBooks column shows Staging Main, the location you are in; the dialog sets every location. Archived categories stay on the work orders that used them and in reports.': 'note under the list; agrees with S1-R13 (column per current location, archived kept)',
    'Default': 'Default badge (S1-R13 "the default carries a Default badge"; on the QuickBooks row it is design-only)',
    'Shown for categories that require it. Changing to Goodwill clears it.': 'helper in Change category (agrees with S2-R6)',
    'Then the line on it, if you know it: it sets the original technician.': 'helper under Original line at Close (agrees with S2-R17)',
    'Defaults to the customer\'s Min shop supplies charge. Posted as an expense at Close.': 'helper under Shop supplies (agrees with S10-R1/R4)',
    'Skipped, nothing posted': 'note on the Parts with no cost row (agrees with S3-E2)',
    'Hours only': 'Financial Info labor note (agrees with "Labor ... Hours only, nothing posted")',
    '2 open internal work orders for Staging Heavy Duty Fleet stay internal and close without an invoice. New work orders for Staging Heavy Duty Fleet will be billable.': 'S1-R12 body with data',
    'Work order': 'Make internal list header / report column',
    'Customer portal': 'portal page heading (existing portal)',
    'Status': 'existing',
    'Reason': 'Accounting Events column (hub, existing)',
}

# ----------------------------------------------------------------------------------------------------------------- classify
TOKEN = re.compile(r"\$[\d,]+\.\d\d|S2-\d{5}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}|Staging Heavy Duty Fleet|Admin ShopView|"
                   r"Replace - Brake caliper|\b\d+(?:\.\d+)? ?h\b|\b\d{4} [A-Z][A-Za-z &]+(?:Expense|Expenses|Income|COGS|Asset)\b|Company Vehicle Maintenance|Shop Equipment Maintenance|"
                   r"General Internal|Warranty|Goodwill|Comeback|\b\d+\b")


def prd_codes(t):
    """PRD-MATCH by exact letter case; for a sentence holding demo data, every fixed piece of 4+ characters must sit in one PRD piece."""
    codes = P.find(t)
    if codes: return codes, 'exact'
    pieces = [p.strip(' .,;:?·') for p in TOKEN.split(t) if p and p.strip(' .,;:?·') and len(p.strip(' .,;:?·')) >= 4]
    pieces = [p for p in pieces if not re.fullmatch(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d+|h)', p)]
    if not pieces or pieces == [t]: return [], None
    common = None
    for p in pieces:
        c = set(P.find(p))
        common = c if common is None else (common & c)
        if not common: return [], None
    return sorted(common), 'template'


def classify_text(t, kind='text'):
    """Returns (class, codes, note)."""
    s = t.strip()
    if kind.startswith('@'):
        if kind in ('@title', '@value') or s in NAMES or DATA_RE.match(s): return ('DATA', [], 'attribute holding demo data')
        if s in ATTR_PRODUCTION: return ('OUT-OF-SCOPE', [], 'accessible name of an existing control (not on screen)')
    if s in CONFLICT: return ('SPEC-CONFLICT', [CONFLICT[s]], 'see the divergence register')
    if s in NAMES or DATA_RE.match(s): return ('DATA', [], 'demo data')
    codes, how = prd_codes(s)
    if codes and s not in PRODUCTION: return ('PRD-MATCH', codes[:6], 'PRD words, exact letter case' + (' (template with demo data)' if how == 'template' else ''))
    if s in PRODUCTION: return ('OUT-OF-SCOPE', [], "label of today's screen, unchanged by the feature")
    if s in LOOK: return ('LOOK-ONLY', [], LOOK[s])
    return None
