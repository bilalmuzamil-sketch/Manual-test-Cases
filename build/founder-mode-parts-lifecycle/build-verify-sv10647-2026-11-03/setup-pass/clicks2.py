# Rule 119 layout (QA lead, 3 Nov 2026): Preconditions say WHAT; a separate Setup section says HOW, as a numbered list in the order the
# tester works, one item per thing to make, each item "<what it makes>: <clicks and values>". Same facts as clicks.py (every label seen
# on sv10647 this pass, probes 01-27), re-cut into labelled items. Items are joined with \x01label\x02text markers.
import re
def S(label, text): return f'\x01{label}\x02{text}'
def pn(c, l): return f'ZZAUTOTEST-PL-C{c}-{l}'
def ds(c, l, end=''): return f'ZZAUTOTEST PL C{c} PART {l}{(" " + end) if end else ""}'
def part(c, l, qty=None, cost='10.00', sell='20.00', untracked=False, minmax=None, vendor=None, end='', bin2=None, number=None, desc=None, cat=None):
    f = [f'Description: {desc or ds(c, l, end)}', f'Part Number: {number or pn(c, l)}', f'Category: {cat or "any one"}', f'Cost: {cost}', f'Sell Price: {sell}']
    if vendor: f.append(f'Vendor: {vendor}')
    if minmax: f.append(f'Min: {minmax[0]}, Max: {minmax[1]}')
    if qty is not None: f.append(f'Quantity (in the bin row): {qty}')
    t = 'Click Parts in the top bar, Inventory in the left menu, then New Inventory Part. Fill in: ' + '; '.join(f) + '.'
    if untracked: t += ' Click Track quantities and cost of goods off.'
    if bin2 is not None: t += f' Click Add Bin Location, pick a second bin location in the new row and type {bin2} as its Quantity.'
    return S(f'Make part {l}', t + ' Click Save.')
def inactive(c, l): return S(f'Set part {l} inactive', f'On the Inventory page click Search and type {pn(c, l)}. Click its row, click Inactive under Part Status, click Save, then click Deactivate.')
def vendor(c, l): return S(f'Make vendor {l}', f'Click Parts in the top bar, Vendors in the left menu, then New Vendor. Type ZZAUTOTEST PL C{c} VENDOR {l} in Name *. Click Save & Close.')
def wo(c, n='1', lines=True, approved=False):
    lab = {'C': 'Make a work order to build the canned job on', 'S': 'Make a work order for the special order'}.get(n, f'Make work order {n}')
    t = 'Click Work Orders in the top bar, then Create Work Order. Pick any Customer and any Asset. Click Save.'
    if not lines: return S(lab, t + ' The New Line window opens: close it with the X at its top right, so the work order has no lines.')
    return S(lab, t + f' In the New Line window that opens, type ZZAUTOTEST PL C{c} LINE {n} in Title and press Tab, pick any Labor Rate'
             + (', tick Line Approved' if approved else '') + ', then click Save & Close.')
def stock(c, l, q): return S(f'Put part {l} on the line', f'In the line\'s Parts row click + Add Part. Type {pn(c, l)} in Part number and pick the result that shows Inventory Qty. Type {q} in Qty *. Click Save.')
def request(c, l, q='1'): return S(f'Request part {l} on the line', f'In the line\'s Parts row click + Add Part, then More options. In the New Part Request window type {pn(c, l)} in Part Number and pick the result marked Part Library. Type {q} in Quantity. Click Save Part. Do not receive it.')
def po(c, l, q, typed=False):
    pick = f'pick part {l} from the list' if not typed else 'keep it as typed (do not pick a result)'
    return S('Make the purchase order', f'Click Parts in the top bar, Purchase Orders in the left menu, then New PO. Pick any Vendor. Type {pn(c, l)} in Part Number and {pick}. Type {q} in Quantity, click Add, then click Save & Close. Do not click Receive.')
def receive(q='1'): return S('Receive it', f'On the Purchase Orders list click Receive on that purchase order\'s row. Type any number in Vendor Invoice #, pick an Invoice Date, type {q} in Qty received, then click the Receive Parts button.')
def ret(c, l, v='any vendor'): return S(f'Make a return for part {l}', f'Click Parts in the top bar, Returns in the left menu, then Create Return. Pick {v} under Vendor. Type {pn(c, l)} in Part Number and pick it. Type 1 in Quantity. Click Save Return.')
COMPLETE = S('Complete that return', 'On the Returns list tick that return\'s row and click Receive Credit. Type any Credit Memo Number, pick a Credit Date, then click Post Credit.')
def canned(c, parts, extra=''):
    return (wo(c, 'C', approved=True) + S('Put the parts on that line', f'Add {parts}, one of each: in the line\'s Parts row click + Add Part, type the part number in Part number, pick the result that shows Inventory Qty, type 1 in Qty * and click Save.')
            + extra + S('Save the line as canned job A', f'Click the three-dot icon on the line, then Save as canned line. Type ZZAUTOTEST PL C{c} CANNED JOB A in Line Title. Click Save As Canned Line.'))
def location(c, l='C'): return S(f'Make location {l}' if l != 'NEW' else 'Make a new location', f'Click the box at the top right, then Settings, then Locations in the left menu, then New Location. Type ZZAUTOTEST PL C{c} LOCATION {l} in Name *. Click Save & Close. To switch to it: click the box at the top right, click the name beside Change Location: and pick it.')
LOCB = S('Switch to location B', 'Location B is Staging Lethbridge - 4310. Click the box at the top right, click the name beside Change Location: and pick it. Switch back to Staging Heavy Duty - 9919 the same way.')
def importfile(rows): return S('Make the import file', f'Click the box at the top right, then Settings, then Inventory under IMPORTS in the left menu. Click Download Template and open the file in a spreadsheet program. {rows[0].upper() + rows[1:]}. Save it as a CSV file.')
def many(c, n, inact=False):
    s = importfile(f'add {n} rows, one per part: part_number ZZAUTOTEST-PL-C{c}-001 to ZZAUTOTEST-PL-C{c}-{n:03d}, name ZZAUTOTEST PL C{c} PART with the same number, quantity 1, purchase_price 10') \
        + S('Import it', 'On the same page click Select CSV File, pick the file, then click Submit File.')
    if inact: s += S('Set them all inactive', f'On the Inventory page click the three-dot actions button, then Deactivate parts. Search ZZAUTOTEST-PL-C{c}-, tick the parts (200 at most per change, so do it in two goes), click Deactivate on the dark bar, then Deactivate in the confirmation.')
    return s
ROLE = ('Click the box at the top right, then Settings, then Roles & Permissions in the left menu, then Create Custom Role. In Choose a template click Skip. '
        'Type ZZAUTOTEST PL C{c} ROLE B in Role Name*. Switch on Parts Department and tick only {ticks}. Click Create.')
USERB = ('The QA site\'s sign-in offers only Admin and Tech, so user B is the shared Tech sign-in given role B. Click the box at the top right, then Settings, '
         'then Staff in the left menu. Click Search, type tech@shopview.com, click the edit icon at the end of Tech ShopView\'s row, pick ZZAUTOTEST PL C{c} ROLE B '
         'under Role and click Save & Close. In the private window choose Tech on the sign-in screen. When the test is finished, set Tech ShopView\'s Role back to Technician the same way.')
OLD = S('Find parts from before this release', 'On the Inventory list, parts that came with this site\'s data and were never changed have no clock icon at the left of their row; for example 3030 Long Stroke Brake Chamber (W3030LS), which has stock and Min 10 and Max 50, and 3030 Standard Brake Chamber, 13.25" Rod (W3030T).')
LATER = S('When', 'Do the item above one day before you run the test, then run the test the next day, so the report has saved a figure for that earlier date.')

exec(open(__file__.replace('clicks2.py', 'clicks2_body.py')).read())

def items(text):
    """Split a joined setup text into (label, text) items; unlabelled text becomes its own item."""
    out = []
    for seg in re.split(r'(?=\x01)', text):
        if not seg.strip(): continue
        if seg.startswith('\x01'):
            lab, t = seg[1:].split('\x02', 1); out.append((lab, t.strip()))
        else: out.append((None, seg.strip()))
    return out
