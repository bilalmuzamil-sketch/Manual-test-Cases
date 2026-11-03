# Per-test setup clicks for the 70 tests in "Setup needed before testing" (S114049) plus C154833 and C847731.
# QA lead, 3 Nov 2026: "add the clicks/steps for those tests but make sure each click/step should be related to that particular test
# case only." Every label below was seen on QA site sv10647 (v26.43.4-999c51d) this pass: probes 01-27 in ../probe/.
# Each entry: setup-line prefix (as written in the test) -> the clicks for THAT test. PARTLY: steps not seen on the build.

def pn(c, l): return f'ZZAUTOTEST-PL-C{c}-{l}'
def ds(c, l, end=''): return f'ZZAUTOTEST PL C{c} PART {l}{(" " + end) if end else ""}'
def part(c, l, qty=None, cost='10.00', sell='20.00', untracked=False, minmax=None, vendor=None, end='', bin2=None, number=None, desc=None, cat=None):
    s = (f'Click Parts in the top bar, Inventory in the left menu, then New Inventory Part. Type {desc or ds(c, l, end)} in Description and '
         f'{number or pn(c, l)} in Part Number, pick {cat or "any category"} under Category, type {cost} in Cost and {sell} in Sell Price')
    if vendor: s += f', pick {vendor} under Vendor'
    if minmax: s += f', type {minmax[0]} in Min and {minmax[1]} in Max'
    if untracked: s += ', click Track quantities and cost of goods off'
    if qty is not None: s += f', type {qty} in the Quantity of the bin row'
    if bin2 is not None: s += f', click Add Bin Location, pick a second bin location in the new row and type {bin2} in its Quantity'
    return s + ', then click Save.'
def inactive(c, l): return (f'On the Inventory page click Search, type {pn(c, l)}, click its row, click Inactive under Part Status, click Save, then click '
                            'Deactivate in the Deactivate part? window.')
def vendor(c, l): return (f'Click Parts in the top bar, Vendors in the left menu, then New Vendor; type ZZAUTOTEST PL C{c} VENDOR {l} in Name *, then click '
                          'Save & Close.')
def wo(c, n='1', lines=True, approved=False):
    s = ('Click Work Orders in the top bar, then Create Work Order; pick any Customer and any Asset, then click Save.')
    if not lines: return s + ' The New Line window opens by itself: close it with the X at its top right, so the work order has no lines.'
    return s + (f' The New Line window opens by itself: type ZZAUTOTEST PL C{c} LINE {n} in Title and press Tab, pick any Labor Rate'
                + (', tick Line Approved' if approved else '') + ', then click Save & Close.')
def stock(c, l, q): return (f'On the work order\'s Lines tab, in the line\'s Parts row click + Add Part, type {pn(c, l)} in Part number, pick the result that '
                            f'shows Inventory Qty, type {q} in Qty *, then click Save.')
def request(c, l, q='1'): return (f'In the line\'s Parts row click + Add Part, then More options; in the New Part Request window type {pn(c, l)} in Part Number '
                                  f'and pick the result marked Part Library, type {q} in Quantity, then click Save Part. Do not receive it.')
def po(c, l, q, typed=False):
    pick = (f'type {pn(c, l)} in Part Number and pick part {l} from the list' if not typed else
            f'type {pn(c, l)} in Part Number and keep it as typed without picking a result')
    return (f'Click Parts in the top bar, Purchase Orders in the left menu, then New PO; pick any Vendor, {pick}, type {q} in Quantity, click Add, '
            'then click Save & Close. Do not click Receive.')
def receive(q='1'): return ('On the Purchase Orders list click Receive on that purchase order\'s row; type any number in Vendor Invoice #, pick an Invoice '
                            f'Date, type {q} in Qty received, then click the Receive Parts button.')
def ret(c, l, v='any vendor'): return (f'Click Parts in the top bar, Returns in the left menu, then Create Return; pick {v} under Vendor, type {pn(c, l)} in Part '
                                       'Number and pick it, type 1 in Quantity, then click Save Return.')
COMPLETE = ('Then, on the Returns list, tick that return\'s row, click Receive Credit, type any Credit Memo Number, pick a Credit Date and click '
            'Post Credit.')
def canned(c, parts):
    return (f'{wo(c, "C", approved=True)} Add {", ".join(parts)} to that line, one of each: in the line\'s Parts row click + Add Part, type the part '
            'number in Part number, pick the result that shows Inventory Qty, type 1 in Qty *, then click Save. Then click the three-dot icon on the '
            f'line, click Save as canned line, type ZZAUTOTEST PL C{c} CANNED JOB A in Line Title and click Save As Canned Line.')
SETTINGS = 'click the box at the top right, then Settings'
def location(c, l='C'): return (f'{SETTINGS[0].upper() + SETTINGS[1:]}, then Locations in the left menu, then New Location; type ZZAUTOTEST PL C{c} LOCATION {l} '
                                'in Name * and click Save & Close. To switch to it: click the box at the top right, click the name beside Change Location: and '
                                'pick it.')
LOCB = ('Location B is Staging Lethbridge - 4310: click the box at the top right, click the name beside Change Location: and pick it; switch back to '
        'Staging Heavy Duty - 9919 the same way.')
def importfile(rows): return (f'{SETTINGS[0].upper() + SETTINGS[1:]}, then Inventory under IMPORTS in the left menu; click Download Template, open the '
                              f'file in a spreadsheet program, {rows}, and save it as a CSV file.')
def many(c, n, inact=False):
    s = importfile(f'add {n} rows, one per part, with part_number ZZAUTOTEST-PL-C{c}-001 to ZZAUTOTEST-PL-C{c}-{n:03d}, name ZZAUTOTEST PL C{c} PART '
                   'and the same number, quantity 1 and purchase_price 10') + ' Click Select CSV File, pick the file, then click Submit File.'
    if inact: s += (f' Then, on the Inventory page, click the three-dot actions button, Deactivate parts, search ZZAUTOTEST-PL-C{c}-, tick the parts '
                    '(200 at most per change, so do it in two goes), click Deactivate on the dark bar, then Deactivate in the confirmation.')
    return s
ROLE = ('{S}, then Roles & Permissions in the left menu, then Create Custom Role; in Choose a template click Skip; type ZZAUTOTEST PL C{c} ROLE B in '
        'Role Name*; switch on Parts Department and tick only {ticks}; then click Create.')
USERB = ('User B is the shared Tech sign-in given role B: {S}, Staff in the left menu, click Search, type tech@shopview.com, click the edit icon at the end '
         'of Tech ShopView\'s row, pick ZZAUTOTEST PL C{c} ROLE B under Role and click Save & Close. In the private window choose Tech on the sign-in '
         'screen. When the test is finished set Tech ShopView\'s Role back to Technician the same way.')
OLD = ('On this QA site the parts that came with its data and were never changed have no clock icon at the left of their row on the Inventory list; '
       'for example 3030 Long Stroke Brake Chamber (W3030LS), which has stock and Min 10 and Max 50, and 3030 Standard Brake Chamber, 13.25" Rod (W3030T).')
LATER = 'Do this one day before you run the test, then run the test the next day, so the report has saved a figure for that earlier date.'

C = {}
c = 154753; C[c] = {'Use three parts, part A, part B and part C': OLD + ' Use those two and a third part with no clock icon, for example W4515Q.',
    'Use a part B that has stock': 'Use W3030LS as part B.', 'Have an inactive part, part D': part(c, 'D') + ' ' + inactive(c, 'D')}
c = 154775; C[c] = {'Have five parts': 'Create the five parts as below, one at a time.',
    'Set parts A, B and C as tracked': ' '.join(part(c, l, q, end=e) for l, q, e in (('A', 5, 'ALPHA'), ('B', 5, 'BRAVO'), ('C', 2, 'CHARLIE'))),
    'Set parts D and E as untracked': ' '.join(part(c, l, q, untracked=True, end=e) for l, q, e in (('D', 1, 'XRAY'), ('E', 9, 'YANKEE'))),
    'Give parts A, B, C, D and E descriptions': f'The descriptions above all start ZZAUTOTEST PL C{c} PART.',
    'Give parts A, B, C, D and E part numbers': f'The part numbers above all start {pn(c, "")}.'}
c = 154778; C[c] = {'Use two Part Library entries from before this release': 'Click Parts in the top bar, then Part Library in the left menu, click Search and type a part number; a pair shows as two rows with the same Part Number and different Description.'}
c = 154791; C[c] = {'Create an active part, part A': part(c, 'A')}
c = 154831; C[c] = {'Have a Part Library entry from before this release, entry A': 'Click Parts in the top bar, then Part Library in the left menu, and click an entry\'s row: its Part details panel shows Total parts; use one that shows 0.',
    'Have a second Part Library entry': 'Use an entry whose Part details panel shows Total parts 1 or more, for example 3030 Long Stroke Brake Chamber (W3030LS).'}
for c in (154833, 847731):
    C[c] = {'Create a Part Library entry with no part behind it': part(c, 'A') + f' Then search {pn(c, "A")} on the Inventory page, click its row and click Delete Part: the part goes at once, and its Part Library entry stays with Total parts 0.'}
c = 154835; C[c] = {'Have a bookmark': 'In your browser, bookmark the address https://sv10647.qa.shopview.com/parts/parts-catalogue.'}
for c in (154839, 425690):
    C[c] = {'Sign in as an Admin who can switch between three locations': 'Location B is Staging Lethbridge - 4310. ' + location(c),
            'Have a part, part A, at the test location, at location B': part(c, 'A') + ' Then switch to location B and create part A again with the same Part Number, then switch to location C and do the same and set it inactive there: ' + inactive(c, 'A')}
c = 425591; C[c] = {'Sign in as an Admin at a location that has no inactive parts': location(c, 'NEW'), 'Create an active part, part A, at that location': part(c, 'A')}
c = 425596; C[c] = {'Create 201 active parts': many(c, 201)}
c = 425597; C[c] = {'Have three active parts': part(c, 'A', end='ALPHA', cat='category A') + ' ' + part(c, 'B', end='BRAVO', cat='category B') + ' ' + part(c, 'C', end='CHARLIE', cat='category A') + ' (Pick the same category for A and C and another one for B.)',
    'Make sure the test location has more than 30 active parts': 'The Active tab of Staging Heavy Duty - 9919 already lists more than 30 parts; scroll down to check that more rows load.'}
for c in (425613, 425614):
    C[c] = {'Create a part, part A, for this test': part(c, 'A', 1),
            'Create a work order for this test, work order 1, with a line holding a part request': wo(c, approved=True) + ' ' + request(c, 'A')}
c = 425616; C[c] = {'Have a vendor, vendor A': vendor(c, 'A'), 'Create a work order for this test, work order 1, with an approved line': wo(c, approved=True)}
for c in (425624, 573672, 573673, 573674):
    C[c] = {k: v for k, v in {'Have a vendor, vendor A': vendor(c, 'A'), 'Have two vendors': vendor(c, 'A') + ' ' + vendor(c, 'B'),
        'Have a special-order number': wo(c, 'S', approved=True) + f' In the line\'s Parts row click + Add Part, then More options; type ZZAUTOTEST-PL-C{c}-SO in Part Number and pick Add new special order part, type a Description, 1 in Quantity, pick vendor A under Vendor and type a Cost, then click Save Part; order it and receive it from vendor A on the Receive screen (Purchase Orders in the left menu, Receive on its row, Vendor Invoice #, Invoice Date, Qty received, then the Receive Parts button).',
        'Create a special order for this test': f'The same way, with the number ZZAUTOTEST-PL-C{c}-ORD, but do not receive it.',
        'Create a special-order part number': f'The same way, with the number ZZAUTOTEST-PL-C{c}-SO: order it from vendor A, then from vendor B; receive vendor B\'s at Cost 12.00 first, then vendor A\'s at Cost 15.00.',
        'Create a work order for this test, work order 1, with a line': wo(c),
        'Create a work order for this test at the test location, work order 1': wo(c),
        'Create a work order for this test at location B': LOCB + ' At location B: ' + wo(c, '2')}.items()}
c = 425625; C[c] = {'Have a custom role from before this release': ROLE.split(';')[0].format(S=SETTINGS[0].upper() + SETTINGS[1:], c=c, ticks='') + ': the roles listed with Role Type Custom came with this site\'s data; open one with the edit icon to read its Parts Department boxes.'}
c = 425626; C[c] = {'Have a custom role from before this release, role A, whose name contains': 'Click the box at the top right, then Settings, then Roles & Permissions in the left menu, and look in the Role Name column for a name with the word Catalog.',
    'Have a part from before this release, part A, whose description': 'On the Inventory page click Search and type Catalog.'}
c = 425642; C[c] = {'Sign in as an Admin at a location that has no untracked part': location(c, 'NEW'), 'Have a tracked part, part A': part(c, 'A', 1, desc=f'ZZAUTOTEST PL C{c} PART A')}
c = 425657; C[c] = {'Create an active tracked part, part A, for this test on an earlier day': part(c, 'A', 4) + ' ' + LATER}
c = 425658; C[c] = {'Use an active tracked part, part A, that was at the test location before': OLD + ' Use W3030T as part A.',
    'Use a date before the release': 'Click Reports in the top bar, then Inventory Value under PARTS; click the As of: date and pick a date before this release.',
    'Write down part A': 'On that report click Search, type W3030T and note its Qty and Total Cost.'}
for c, l1, l2 in ((425660, 'Create a tracked part, part A', 'Add 2 of part A'), (425664, 'Create a tracked part, part A', 'Add 2 of part A'),
                  (425665, 'Create a tracked part, part A', 'Add 2 of part A'), (425666, 'Create a tracked part, part A', 'Add 1.25 of part A')):
    C[c] = {l1: part(c, 'A', 2.5 if c == 425666 else 5, minmax=('4', '10') if c == 425665 else None, bin2=0).replace(' in its Quantity, then click Save.', ' in its Quantity, click Default on that second row, then click Save.'),
            l2: wo(c, approved=True) + ' ' + stock(c, 'A', '1.25' if c == 425666 else '2') + ''}
c = 425661; C[c] = {'Create two tracked parts': part(c, 'A', 0) + ' ' + part(c, 'B', 4), 'Add 2 of part A': wo(c, approved=True) + ' ' + stock(c, 'A', '2'),
    'Give parts A and B part numbers': f'The part numbers above both start {pn(c, "")}.'}
for c in (425679, 425680):
    C[c] = {'Have at the test location': 'Click Parts in the top bar, then Part Library in the left menu, click Search and type part of a number; such a pair shows as two rows whose Part Number differs only in hyphens or periods.'}
c = 425683; C[c] = {'Use a part, part A, that was stocked at the test location before': OLD + ' Use W3030LS as part A.'}
c = 425694; C[c] = {'Create a part, part A, for this test.': part(c, 'A', 1), 'Create an open purchase order': po(c, 'A', 2)}
c = 425696; C[c] = {'Create a part, part A, for this test at the test location, with 4 on hand': part(c, 'A', 4) + ' ' + LOCB + ' At location B create part A again with the same Part Number.',
    'Create an open purchase order for this test at the test location': po(c, 'A', 2), 'Create an open purchase order for this test at location B': 'At location B: ' + po(c, 'A', 4)}
c = 425697; C[c] = {'Create a part, part A, for this test with 5 on hand': part(c, 'A', 5),
    'Create a work order for this test, work order 1, with a line holding two part requests': wo(c, approved=True) + ' ' + request(c, 'A') + ' Then ' + stock(c, 'A', '1')}
c = 425698; C[c] = {'Create a part, part A, for this test with 5 on hand': part(c, 'A', 5),
    'Create a work order for this test, work order 1, with a line holding part A': wo(c, approved=True) + ' ' + stock(c, 'A', '1'),
    'Create a canned job for this test': 'On work order 1\'s Lines tab click the three-dot icon on the line, click Save as canned line, type ZZAUTOTEST PL C425698 CANNED JOB A in Line Title and click Save As Canned Line.'}
c = 425699; C[c] = {'Create a part, part A, for this test with 5 on hand': part(c, 'A', 5), 'Create a vendor return for this test, return A': ret(c, 'A'),
    'Create a vendor return for this test, return B': ret(c, 'A') + ' ' + COMPLETE}
c = 425700; C[c] = {'Create a part, part A, for this test with 3 on hand': part(c, 'A', 3), 'Create an open purchase order': po(c, 'A', 2)}
c = 425715; C[c] = {'Create a part, part A, for this test with 3 on hand': part(c, 'A', 3, vendor='vendor A'), 'Have a vendor, vendor A': vendor(c, 'A') + ' (Create the vendor first.)',
    'Create a vendor return for this test, return A': ret(c, 'A', 'vendor A')}
c = 425717; C[c] = {'Create a part, part A, for this test with 3 on hand': part(c, 'A', 3), 'Have a vendor, vendor A': vendor(c, 'A')}
c = 425718; C[c] = {'Create a part, part A, for this test.': part(c, 'A', 1),
    'Create a work order for this test, work order 1, with a line holding an open part request': wo(c, approved=True) + ' ' + request(c, 'A'),
    'Create a part, part B, for this test': part(c, 'B', 1)}
for c in (425727, 425728):
    C[c] = {'Have an inactive part, part A': part(c, 'A', 4) + ' ' + inactive(c, 'A'), 'Have an active part, part B': part(c, 'B', 4),
            'Give parts A and B part numbers': f'The part numbers above both start {pn(c, "")} and the descriptions start ZZAUTOTEST PL C{c} PART.'}
C[425727]['Create an open purchase order for this test, purchase order A'] = ('Click Parts in the top bar, Purchase Orders in the left menu, then New PO; pick any Vendor, '
    'type any existing part number in Part Number and pick it, type 1 in Quantity, click Add, then Save & Close. A purchase order made this way has no work '
    'order, so its page shows the Add Order Item button.')
C[425728]['Have a received vendor bill'] = (po(425728, 'X', 1, typed=True).replace('ZZAUTOTEST-PL-C425728-X', 'ZZAUTOTEST-PL-C425728-VENDORPART') + ' ' + receive('1')
    + ' The received bill is listed under Vendor Invoices in the left menu.')
for c, parts, inact in ((425730, 'parts A, B and C', 'AB'), (573684, 'parts C, B, A and D (in that order)', 'ABC')):
    C[c] = {'Create three active parts' if c == 425730 else 'Create four active parts':
            ' '.join(part(c, l, 5) for l in ('ABC' if c == 425730 else 'ABCD')),
            'Create a canned job for this test': canned(c, parts),
            ('Set parts A and B inactive' if c == 425730 else 'Set parts A, B and C inactive'): ' '.join(inactive(c, l) for l in inact),
            'Create an open work order, work order 1, for this test, with no lines': wo(c, lines=False)}
c = 425731; C[c] = {'Create an active part, part A': part(c, 'A', 5) + ' ' + part(c, 'C', 5),
    'Create a canned job for this test': canned(c, 'part C').replace('Then click the three-dot', f'Then, in the line\'s Parts row, click + Add Part, type zzautotest.pl.c{c}.a in Part number, pick the Create … as a new part entry, type a Description and 1 in Qty *, and click Save. Then click the three-dot'),
    'Set part A inactive': inactive(c, 'A'), 'Create an open work order, work order 1, for this test, with no lines': wo(c, lines=False)}
c = 425732; C[c] = {'Create two active parts': part(c, 'A', 5) + ' ' + part(c, 'C', 5),
    'Create a canned job for this test': canned(c, 'parts A and C') .replace('Then click the three-dot', 'Give each part its own fee from the part row\'s menu before saving the canned line. Then click the three-dot'),
    'Set part A inactive': inactive(c, 'A'), 'Create an open work order, work order 1, for this test, with no lines': wo(c, lines=False)}
c = 425733; C[c] = {'Have a vendor, vendor A': vendor(c, 'A'), 'Create a part, part A, for this test, with vendor A': part(c, 'A', 4, vendor='vendor A') + ' ' + inactive(c, 'A'),
    'Create an active part, part B': part(c, 'B', 4, vendor='vendor A'), 'Give parts A and B part numbers': f'The part numbers above both start {pn(c, "")}.'}
c = 425741; C[c] = {'Create an active part, part A': part(c, 'A', 4), 'Create an open purchase order for this test, purchase order A': C[425727]['Create an open purchase order for this test, purchase order A']}
for c, ticks in ((425746, 'View and Create & Edit on the Vendor and order management row'), (573686, 'View on the Vendor and order management row')):
    C[c] = {'Create a custom role for this test, role B': ROLE.format(S=SETTINGS[0].upper() + SETTINGS[1:], c=c, ticks=ticks) + ' Leave See Financial Data (under Cross-Cutting Toggles) off.',
            'Create a staff member for this test, user B': USERB.format(S=SETTINGS[0].upper() + SETTINGS[1:], c=c),
            'Have a vendor, vendor A, and': vendor(c, 'A') + ' ' + part(c, 'A', 1, vendor='vendor A') + (' ' + inactive(c, 'A') if c == 425746 else '')}
c = 425751; C[c] = {'Have a vendor, vendor A': vendor(c, 'A'), 'Create an active part, part A, for this test, with vendor A and 0 on hand': part(c, 'A', 0, vendor='vendor A'),
    'Create an open work order, work order 1': wo(c, approved=True) + ' ' + request(c, 'A') + ' Order this first request; then ' + request(c, 'A') + ' Leave the second one not ordered.',
    'Set part A inactive after that': inactive(c, 'A')}
c = 425768; C[c] = {'Create forty active parts': many(c, 40)}
c = 540877; C[c] = {'Have a vendor, vendor A': vendor(c, 'A')}
c = 540878; C[c] = {'Create a tracked part, part A, for this test on an earlier day': part(c, 'A', 0) + ' ' + LATER, 'Add 2 of part A to a work order line on date A': 'On that same day: ' + wo(c, approved=True) + ' ' + stock(c, 'A', '2')}
c = 540879; C[c] = {'Use a tracked part from before this release': 'Click Reports in the top bar, then Inventory Value under PARTS; pick a date before this release in As of: and look for a part listed with a negative Qty in one bin.'}
c = 573682; C[c] = {'Sign in as an Admin at a location that has no bin location named Unassigned': location(c, 'NEW') + ' Then Settings, Bin Locations in the left menu: the list must not show Unassigned.',
    'Have a parts import file with two rows': importfile(f'add two rows with part_number {pn(c, "A")} and {pn(c, "B")}, a name, quantity 0 and the grid_location cell left empty')}
c = 573683; C[c] = {'Use a Part Library entry from data saved before this release that still points': 'Click Parts in the top bar, then Part Library in the left menu, and open entries until one\'s Part details panel shows an empty Manufacturer.'}
c = 839418; C[c] = {'Create 201 parts for this test': many(c, 201, inact=True)}
c = 839424; C[c] = {'Have a vendor, vendor A': vendor(c, 'A'), 'Have an untracked part, part A': part(c, 'A', 1, untracked=True, vendor='vendor A', desc=f'ZZAUTOTEST PL C{c} PART A'),
    'Have a tracked part, part B': part(c, 'B', 1, vendor='vendor A', desc=f'ZZAUTOTEST PL C{c} NOTCHED PART B'), 'Have a tracked part, part C': part(c, 'C', 1, vendor='vendor A')}
c = 839426; C[c] = {'Use a Part Library entry that has no category': 'Click Parts in the top bar, then Part Library in the left menu, and open entries until one\'s Part details panel shows no Category (or Uncategorized) and Total parts 0.'}
c = 839433; C[c] = {'Have an untracked part, part A': part(c, 'A', 3, untracked=True), 'Have a tracked part, part B': part(c, 'B', 4),
    'Give parts A and B part numbers': f'The part numbers above both start {pn(c, "")}.', 'Create an open purchase order for this test, purchase order A': C[425727]['Create an open purchase order for this test, purchase order A']}
c = 839445; C[c] = {'Create a part, part A, for this test.': part(c, 'A', 1), 'Create a purchase order for this test': po(c, 'A', 1) + ' ' + receive('1')}
c = 839446; C[c] = {'Create a part, part A, for this test.': part(c, 'A', 1), 'Create an open purchase order': po(c, 'A', 1) + ' Before Save & Close add a second line: type ' + pn(c, 'A') + ' in Part Number again, keep it as typed without picking a result, type 1 in Quantity and click Add.'}
c = 839447; C[c] = {'Create a part, part A, for this test.': part(c, 'A', 1), 'Create an open purchase order': po(c, 'A', 1, typed=True)}
c = 839450; C[c] = {'Create a tracked part, part A, for this test on an earlier day': part(c, 'A', 4) + ' ' + LATER}
for c, a, b in ((839452, ('10.00', '100.00', 1), ('50.00', '60.00', 0)), (839453, ('10.00', '20.00', 3), ('5.00', '40.00', 0))):
    C[c] = {'Create two tracked parts': part(c, 'A', a[2], cost=a[0], sell=a[1]) + ' ' + part(c, 'B', b[2], cost=b[0], sell=b[1]),
            'Add 1 of part B': wo(c, approved=True) + ' ' + stock(c, 'B', '1'), 'Give parts A and B part numbers': f'The part numbers above both start {pn(c, "")}.'}
c = 839463; C[c] = {'Have 201 active parts': many(c, 201)}
c = 839491; C[c] = {'Create an inactive part for this test, part A': part(c, 'A', 5) + ' ' + part(c, 'B', 5), 'Have a canned job, canned job 1': canned(c, 'parts A and B') + ' Then set part A inactive: ' + inactive(c, 'A'),
    'Create an open work order for this test, work order 1, with one line': wo(c)}
c = 839492; C[c] = {'Have an inactive part, part A, and an active part, part B': part(c, 'A', 4) + ' ' + inactive(c, 'A') + ' ' + part(c, 'B', 4), 'Give parts A and B part numbers': f'The part numbers above both start {pn(c, "")}.'}

# Steps not seen on sv10647 this pass -> the build line says "Partly checked ... not yet seen on that build: ...".
PARTLY = {
 **{c: 'ordering and receiving a special-order part (the New Part Request window offered "Add new special order part" once, then "No results")' for c in (425624, 573672, 573673, 573674)},
 425751: 'ordering a part request from the work order',
 425732: 'adding a fee to a part row',
 **{c: 'which bin a work order line takes the part from (the part row on a work order has no bin choice)' for c in (425660, 425664, 425665, 425666)},
 **{c: 'a record from before this release of the kind the test needs' for c in (154778, 425625, 425626, 425679, 425680, 540879, 573683, 839426)},
}

# C573674 has no "Have a special-order number" line, so its clicks must stand alone.
C[573674]['Create a special-order part number'] = (wo(573674, 'S', approved=True) + ' In the line\'s Parts row click + Add Part, then More options; type '
    'ZZAUTOTEST-PL-C573674-SO in Part Number and pick Add new special order part, type a Description, 1 in Quantity, pick vendor A under Vendor and type '
    'a Cost, then click Save Part, and order it. Do the same again with vendor B. Receive vendor B\'s first at Cost 12.00, then vendor A\'s at Cost 15.00, '
    'each on the Receive screen (Purchase Orders in the left menu, Receive on its row, Vendor Invoice #, Invoice Date, Qty received, then the Receive '
    'Parts button).')
