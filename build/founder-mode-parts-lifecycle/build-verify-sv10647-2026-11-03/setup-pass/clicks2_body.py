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
    C[c] = {'Create a Part Library entry with no part behind it': part(c, 'A') + S('Delete part A, so only its Part Library entry stays', f'On the Inventory page click Search, type {pn(c, "A")}, click its row, then click Delete Part. The part goes at once; its Part Library entry stays with Total parts 0.')}
c = 154835; C[c] = {'Have a bookmark': 'In your browser, bookmark the address https://sv10647.qa.shopview.com/parts/parts-catalogue.'}
for c in (154839, 425690):
    C[c] = {'Sign in as an Admin who can switch between three locations': location(c),
            'Have a part, part A, at the test location, at location B': part(c, 'A') + LOCB + S('Make part A at location B', 'At location B, make part A again with the same Part Number, the same way.') + S('Make part A at location C and set it inactive there', 'Switch to location C the same way, make part A again with the same Part Number, then set it inactive there: on the Inventory page click Search, type ' + pn(c, 'A') + ', click its row, click Inactive under Part Status, click Save, then click Deactivate.')}
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
        'Create a work order for this test at location B': LOCB + wo(c, '2')}.items()}
c = 425625; C[c] = {'Have a custom role from before this release': S('Find a role from before this release', 'Click the box at the top right, then Settings, then Roles & Permissions in the left menu. The roles listed with Role Type Custom came with this site\'s data; open one with the edit icon to read its Parts Department boxes.')}
c = 425626; C[c] = {'Have a custom role from before this release, role A, whose name contains': 'Click the box at the top right, then Settings, then Roles & Permissions in the left menu, and look in the Role Name column for a name with the word Catalog.',
    'Have a part from before this release, part A, whose description': 'On the Inventory page click Search and type Catalog.'}
c = 425642; C[c] = {'Sign in as an Admin at a location that has no untracked part': location(c, 'NEW'), 'Have a tracked part, part A': part(c, 'A', 1, desc=f'ZZAUTOTEST PL C{c} PART A')}
c = 425657; C[c] = {'Create an active tracked part, part A, for this test on an earlier day': part(c, 'A', 4) + ' ' + LATER}
c = 425658; C[c] = {'Use an active tracked part, part A, that was at the test location before': OLD + ' Use W3030T as part A.',
    'Use a date before the release': 'Click Reports in the top bar, then Inventory Value under PARTS; click the As of: date and pick a date before this release.',
    'Write down part A': 'On that report click Search, type W3030T and note its Qty and Total Cost.'}
for c, l1, l2 in ((425660, 'Create a tracked part, part A', 'Add 2 of part A'), (425664, 'Create a tracked part, part A', 'Add 2 of part A'),
                  (425665, 'Create a tracked part, part A', 'Add 2 of part A'), (425666, 'Create a tracked part, part A', 'Add 1.25 of part A')):
    C[c] = {l1: part(c, 'A', 2.5 if c == 425666 else 5, minmax=('4', '10') if c == 425665 else None, bin2=0).replace(' as its Quantity. Click Save.', ' as its Quantity, and click Default on that row. Click Save.'),
            l2: wo(c, approved=True) + ' ' + stock(c, 'A', '1.25' if c == 425666 else '2') + ''}
c = 425661; C[c] = {'Create two tracked parts': part(c, 'A', 0) + ' ' + part(c, 'B', 4), 'Add 2 of part A': wo(c, approved=True) + ' ' + stock(c, 'A', '2'),
    'Give parts A and B part numbers': f'The part numbers above both start {pn(c, "")}.'}
for c in (425679, 425680):
    C[c] = {'Have at the test location': 'Click Parts in the top bar, then Part Library in the left menu, click Search and type part of a number; such a pair shows as two rows whose Part Number differs only in hyphens or periods.'}
c = 425683; C[c] = {'Use a part, part A, that was stocked at the test location before': OLD + ' Use W3030LS as part A.'}
c = 425694; C[c] = {'Create a part, part A, for this test.': part(c, 'A', 1), 'Create an open purchase order': po(c, 'A', 2)}
c = 425696; C[c] = {'Create a part, part A, for this test at the test location, with 4 on hand': part(c, 'A', 4) + LOCB + S('Make part A at location B', 'At location B, make part A again with the same Part Number, the same way.'),
    'Create an open purchase order for this test at the test location': po(c, 'A', 2), 'Create an open purchase order for this test at location B': S('Switch to location B', 'Switch to Staging Lethbridge - 4310 as above.') + po(c, 'A', 4)}
c = 425697; C[c] = {'Create a part, part A, for this test with 5 on hand': part(c, 'A', 5),
    'Create a work order for this test, work order 1, with a line holding two part requests': wo(c, approved=True) + ' ' + request(c, 'A') + ' Then ' + stock(c, 'A', '1')}
c = 425698; C[c] = {'Create a part, part A, for this test with 5 on hand': part(c, 'A', 5),
    'Create a work order for this test, work order 1, with a line holding part A': wo(c, approved=True) + ' ' + stock(c, 'A', '1'),
    'Create a canned job for this test': 'On work order 1\'s Lines tab click the three-dot icon on the line, click Save as canned line, type ZZAUTOTEST PL C425698 CANNED JOB A in Line Title and click Save As Canned Line.'}
c = 425699; C[c] = {'Create a part, part A, for this test with 5 on hand': part(c, 'A', 5), 'Create a vendor return for this test, return A': ret(c, 'A'),
    'Create a vendor return for this test, return B': ret(c, 'A') + ' ' + COMPLETE}
c = 425700; C[c] = {'Create a part, part A, for this test with 3 on hand': part(c, 'A', 3), 'Create an open purchase order': po(c, 'A', 2)}
c = 425715; C[c] = {'Create a part, part A, for this test with 3 on hand': part(c, 'A', 3, vendor='vendor A'), 'Have a vendor, vendor A': vendor(c, 'A'),
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
C[425728]['Have a received vendor bill'] = (po(425728, 'VENDORPART', 1, typed=True) + ' ' + receive('1')
    + ' The received bill is listed under Vendor Invoices in the left menu.')
for c, parts, inact in ((425730, 'parts A, B and C', 'AB'), (573684, 'parts C, B, A and D (in that order)', 'ABC')):
    C[c] = {'Create three active parts' if c == 425730 else 'Create four active parts':
            ' '.join(part(c, l, 5) for l in ('ABC' if c == 425730 else 'ABCD')),
            'Create a canned job for this test': canned(c, parts),
            ('Set parts A and B inactive' if c == 425730 else 'Set parts A, B and C inactive'): ' '.join(inactive(c, l) for l in inact),
            'Create an open work order, work order 1, for this test, with no lines': wo(c, lines=False)}
c = 425731; C[c] = {'Create an active part, part A': part(c, 'A', 5) + ' ' + part(c, 'C', 5),
    'Create a canned job for this test': canned(c, 'part C', S('Put the typed vendor part on that line', f'In the line\'s Parts row click + Add Part. Type zzautotest.pl.c{c}.a in Part number and pick the Create … as a new part entry. Type a Description and 1 in Qty *. Click Save.')),
    'Set part A inactive': inactive(c, 'A'), 'Create an open work order, work order 1, for this test, with no lines': wo(c, lines=False)}
c = 425732; C[c] = {'Create two active parts': part(c, 'A', 5) + ' ' + part(c, 'C', 5),
    'Create a canned job for this test': canned(c, 'parts A and C', S('Give each part a fee', 'Give part A fee 1 and part C fee 2 from each part row\'s menu.')),
    'Set part A inactive': inactive(c, 'A'), 'Create an open work order, work order 1, for this test, with no lines': wo(c, lines=False)}
c = 425733; C[c] = {'Have a vendor, vendor A': vendor(c, 'A'), 'Create a part, part A, for this test, with vendor A': part(c, 'A', 4, vendor='vendor A') + ' ' + inactive(c, 'A'),
    'Create an active part, part B': part(c, 'B', 4, vendor='vendor A'), 'Give parts A and B part numbers': f'The part numbers above both start {pn(c, "")}.'}
c = 425741; C[c] = {'Create an active part, part A': part(c, 'A', 4), 'Create an open purchase order for this test, purchase order A': C[425727]['Create an open purchase order for this test, purchase order A']}
for c, ticks in ((425746, 'View and Create & Edit on the Vendor and order management row'), (573686, 'View on the Vendor and order management row')):
    C[c] = {'Create a custom role for this test, role B': S('Make role B', ROLE.format(c=c, ticks=ticks) + ' Leave See Financial Data (under Cross-Cutting Toggles) off.'),
            'Create a staff member for this test, user B': S('Sign in as user B', USERB.format(c=c)),
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
