"""Shorter preconditions for the 19 ruling-rewritten run-498 tests (QA lead, 12 Oct 2026: not exaggerated, but nothing a
tester needs may be lost). Writes C<id>.json = {"custom_preconds": ...} for safe_case_edit.py. Steps/expected untouched."""
import json, os
OUT = os.path.dirname(os.path.abspath(__file__))
def P(needs, have, setup):
    return ('<p><strong>Preconditions</strong></p><ul>' + ''.join(f'<li>{x}</li>' for x in [needs] + have) + '</ul>'
            + ('<p><strong>Setup</strong></p><ol>' + ''.join(f'<li>{x}</li>' for x in setup) + '</ol>' if setup else ''))
SIGNIN = ('Sign in as an Admin (on a QA branch: the Admin quick-login button on the sign-in page; you appear as "Admin ShopView"). '
          'Desktop browser window at least 1024 px wide; narrower windows show only the List.')
LOC = ('Work in one location throughout, shown next to the bell in the top bar (e.g. "Staging Heavy Duty - 9919"); '
       'to change it click your initials (top right) &gt; Change Location. Create everything in that location.')
EX = 'Names and numbers are examples, except names the expected results quote, which must be used exactly.'
def TECHS(need):
    return ('Technicians: your initials (top right) &gt; Settings &gt; Staff. A person counts as a technician only if Active, '
            'Time Clock on, Role not Office User or Time Clock User, and this location in Location. To add one: New Staff Member '
            '&gt; First Name, Last Name, Email, Role "Technician", one Department (required), Location = this location, Time Clock on '
            f'&gt; Save &amp; Close. You need: {need}.')
def CUST(name, unit='TRK-118'):
    return (f'Customer: Customers &gt; New Customer &gt; Name "{name}" &gt; Save. On its Contacts tab &gt; New Contact &gt; First '
            f'and Last Name &gt; Save. On its Assets tab &gt; New Asset &gt; pick the contact, Year, Make (required), Model, Unit '
            f'"{unit}" &gt; Save.')
def WOS(name, lst, line='e.g. "Service - Full grease service"'):
    return (f'Work orders for "{name}": Work Orders &gt; Create Work Order &gt; pick the Customer and its Asset &gt; Save (if a '
            'credit-limit Confirmation appears, click Create). In the New Line form that opens, type in "What Are You Doing?" and '
            f'pick a ready-made line ({line}), turn Line Approved on &gt; Save &amp; Close: the status reads Approved. Write down '
            'the work order number (top left). Then pick the lead in Lead Technician on the card at the left of the work order '
            'page; it saves at once.<ul>' + ''.join(f'<li>{x}</li>' for x in lst) + '</ul>')
COMPLETE = ('Bring [WO] to Complete: Lines tab &gt; Complete on the line &gt; type any Tech Story (if "Missing Details" shows, fill '
            'it, e.g. a Mileage) &gt; Complete Line; the status reads Review. Click Mark Reviewed (if asked for a VIN, type any 17 '
            'characters, e.g. 1FVACWDT1BDAZ0001) &gt; Confirm Review; the status reads Complete.')
GA = ('No Google Analytics access is needed: you read what the page sends in the browser\'s developer tools (Chrome or Edge). '
      'Press F12 &gt; Network tab &gt; tick Preserve log &gt; type <strong>collect</strong> in the filter box. Click a collect '
      'request &gt; Payload tab. Each event lists <strong>en</strong> (event name), <strong>ep.element_location</strong> (list, '
      'tech_view or board_view), <strong>ep.element_label</strong> (the field or density), <strong>ep.setting_value</strong> (on '
      'or off), <strong>ep.setting_source</strong> (default = never changed, saved = chosen earlier) and <strong>uid</strong> '
      '(the user). One request can hold several events, one per line.')
GA2 = 'Turn off any ad blocker for this site, and use a new private window for each user so their messages are not stopped or mixed up.'
GASIGN = 'Desktop browser window at least 1024 px wide; Admin sign-in for the setup (on a QA branch: the Admin quick-login button).'
c = {}
c[154884] = ('Dev-layer test — be-functional. Existing coverage: ViewWorkOrderBoardTest.php:215 (List vs board parity); merged into E2E C96911\n\n'
  + P('Needs: 1 user · 1 browser · about 15 minutes.', [SIGNIN, LOC,
    'Customer "ZZAUTOTEST F1 Assigned To Me" (this case only) with four Approved work orders: two led by you, one led by another technician, one with no lead. Only your two have you as Service Advisor.', EX],
   ['Make yourself a lead technician: Settings &gt; Staff &gt; your own row\'s edit icon &gt; Active, Time Clock on, this location in Location &gt; Save.',
    TECHS('one other technician, [Tech-A] (the expected results call it "Ralph Edwards")'),
    CUST('ZZAUTOTEST F1 Assigned To Me'),
    WOS('ZZAUTOTEST F1 Assigned To Me', ['[WO-1] ("S1-702" in the expected results): lead = you.', '[WO-2] ("S1-644"): lead = you.',
        '[WO-3] ("S1-691"): lead = [Tech-A].', '[WO-4] ("S1-352"): no lead.'], 'e.g. "Replace - Brake pot"'),
    'Whoever creates a work order becomes its Service Advisor, and Assigned to me also shows those. So on [WO-3] and [WO-4], in the card at the left, set Service Advisor to someone other than you (e.g. [Tech-A]).',
    'Check: Work Orders &gt; All tab &gt; Search "ZZAUTOTEST F1 Assigned To Me" shows [WO-1] and [WO-2] (lead: you), [WO-3] (lead [Tech-A]) and [WO-4] (no lead). If your name is missing from the Lead Technician list, redo the first setup step. Clear the search.']))
c[368135] = P('Needs: 1 user · 1 browser · Schedule access · about 15 minutes.', [SIGNIN, LOC,
    'Two technicians named exactly "Esther Howard" ([Tech-A]) and "Ralph Edwards" ([Tech-B]); the expected results quote these names.',
    'Customer "ZZAUTOTEST F1 Prompt Cancel" (this case only) with one Approved work order [WO-1] led by Esther Howard, and a shift for her on it tomorrow 8:00–12:00.'],
   [TECHS('"Esther Howard" and "Ralph Edwards"'), CUST('ZZAUTOTEST F1 Prompt Cancel'),
    WOS('ZZAUTOTEST F1 Prompt Cancel', ['[WO-1]: lead = Esther Howard.'], 'e.g. "Replace - Brake pot"'),
    'Schedule &gt; go to tomorrow &gt; drag [WO-1] from the work order list onto Esther Howard\'s row at 8:00 &gt; choose Entire work order &gt; set the end time to 12:00 &gt; save.',
    'Check: tomorrow\'s Schedule shows Esther Howard\'s 8:00–12:00 shift on [WO-1], and [WO-1] shows Lead Technician Esther Howard.'])
c[368138] = P('Needs: 2 users · 2 browsers · about 20 minutes.', [SIGNIN + ' This is [User-A], in browser 1.',
    '[User-B]: a second Admin user, signed in in browser 2.', LOC,
    'Technicians [Tech-A] (e.g. "Esther Howard") and [Tech-B] named exactly "Ralph Edwards" (the expected results quote this name).',
    'Customer "ZZAUTOTEST F1 Moved Neighbour" (this case only) with three Approved work orders, all led by [Tech-A].', EX],
   [TECHS('[Tech-A] and "Ralph Edwards" as [Tech-B]'),
    '[User-B]: Settings &gt; Staff &gt; New Staff Member with an email you can open, Role Admin, one Department, this location in Location &gt; Save &amp; Close. Accept the invitation, set a password, and sign in as [User-B] in browser 2.',
    CUST('ZZAUTOTEST F1 Moved Neighbour'),
    WOS('ZZAUTOTEST F1 Moved Neighbour', ['[WO-1] (e.g. S1-701): lead = [Tech-A].', '[WO-2] ("S1-702" in the expected results): lead = [Tech-A].',
        '[WO-3] ("S1-703"): lead = [Tech-A].'], 'e.g. "Replace - Brake pot"'),
    'Check, in both browsers: Work Orders &gt; All tab &gt; Search "ZZAUTOTEST F1 Moved Neighbour" shows the three work orders, each led by [Tech-A]. Clear the search.'])
c[96977] = P('Needs: 1 user · 1 browser · about 10 minutes.', [SIGNIN, LOC,
    'Customer "ZZAUTOTEST F2 Card Always On" (this case only) with an asset whose Unit is "TRK-118", and one Approved work order [WO-1] on it led by a technician.', EX],
   [TECHS('one, [Tech-A] (e.g. "Esther Howard")'), CUST('ZZAUTOTEST F2 Card Always On'),
    WOS('ZZAUTOTEST F2 Card Always On', ['[WO-1] (e.g. "S1-702"): lead = [Tech-A].'], 'e.g. "Replace - Brake pot"'),
    'Check: Work Orders &gt; All tab &gt; Search "ZZAUTOTEST F2 Card Always On" shows [WO-1] with unit TRK-118, status Approved and lead [Tech-A].'])
c[97022] = P('Needs: 2 browsers (you, the dispatcher, and a second Admin) · about 20 minutes.', [SIGNIN + ' You are the dispatcher.',
    'A second browser signed in as an Admin at the same location (used to change a status and deactivate a technician during the test).', LOC,
    'Technicians "ZZAUTOTEST Ana Alpha" and, for this case only, "ZZAUTOTEST F3 Ben Bravo" (called Ben in the steps; step 6 deactivates him).',
    'Four customers for this case only, each with a contact and an asset: "ZZAUTOTEST F3 Keyboard Focus Kept Alpha Co", "… Bravo Co", "… Charlie Co", "… Golf Co" (the steps use the end of the name).',
    'One Approved work order per customer: Alpha Co and Bravo Co led by Ana, Charlie Co led by Ben, Golf Co with no lead.',
    'The Status filter starts with nothing ticked.',
    'From step 4 on, use only the keyboard. Where focus should go is not designed yet: try Tab, Shift+Tab, the arrow keys, Enter, Space and Escape, and write down what each does.'],
   [TECHS('"ZZAUTOTEST Ana Alpha" and "ZZAUTOTEST F3 Ben Bravo"'),
    'Customers: for each of the four names, Customers &gt; New Customer &gt; Name &gt; Save; on its Contacts tab &gt; New Contact &gt; First and Last Name &gt; Save; on its Assets tab &gt; New Asset &gt; pick the contact, Year, Make (required), Model &gt; Save.',
    WOS('each customer', ['Alpha Co: lead = ZZAUTOTEST Ana Alpha.', 'Bravo Co: lead = ZZAUTOTEST Ana Alpha.', 'Charlie Co: lead = ZZAUTOTEST F3 Ben Bravo.', 'Golf Co: no lead.']),
    'Check: Work Orders &gt; All tab &gt; List &gt; Search "ZZAUTOTEST F3 Keyboard Focus Kept" shows exactly these 4, all Approved, with the leads above.'])
c[368181] = P('Needs: 1 user · 1 browser · a production sign-in for the comparison · about 20 minutes.', [SIGNIN, LOC + ' (Asset tabs list only this location\'s work orders.)',
    'Customer "ZZAUTOTEST Asset Tab Count" (this case only) with two assets, units TRK-201 and TRK-202.',
    'On TRK-201: [WO-A] Estimate with one line; [WO-B] Approved with two lines, only line 1 completed; [WO-C] Complete. On TRK-202: [WO-D] Approved.',
    'For steps 4 to 6: a sign-in to production (app.shopview.com) that can open Customers. You only look there; nothing is changed.', EX],
   ['Customer: Customers &gt; New Customer &gt; Name "ZZAUTOTEST Asset Tab Count" &gt; Save. Contacts tab &gt; New Contact &gt; First and Last Name &gt; Save. Assets tab &gt; New Asset &gt; pick the contact, Year, Make (required), Model, Unit "TRK-201" &gt; Save. Add a second asset the same way with Unit "TRK-202".',
    'For each work order: Work Orders &gt; Create Work Order &gt; Customer "ZZAUTOTEST Asset Tab Count" &gt; the asset named below &gt; Save (if a credit-limit Confirmation appears, click Create). In New Line &gt; "What Are You Doing?" type "grease" and pick "Service - Full grease service" (no parts). Write down the number (top left).<ul>'
    '<li>[WO-A] ("S1-750"), TRK-201: leave Line Approved off &gt; Save &amp; Close. Status: Estimate.</li>'
    '<li>[WO-B] ("S1-751"), TRK-201: Line Approved on &gt; Save &amp; Add Line; then type "clutch", pick "Service - Adjust clutch", Line Approved on &gt; Save &amp; Close. On line 1 click Complete &gt; any Tech Story &gt; Complete Line ("1 line completed."). Leave line 2 open. Status: Approved.</li>'
    '<li>[WO-C] ("S1-752"), TRK-201: Line Approved on &gt; Save &amp; Close. ' + COMPLETE.replace('[WO] ','') + '</li>'
    '<li>[WO-D] ("S1-753"), TRK-202: Line Approved on &gt; Save &amp; Close.</li></ul>',
    'Check: Work Orders &gt; All tab &gt; Search "ZZAUTOTEST Asset Tab Count" lists exactly [WO-A] Estimate, [WO-B] Approved, [WO-C] Complete, [WO-D] Approved.'])
def editwo(name, num, extra_have, extra_setup, needs='Needs: 1 user · 1 browser · about 10 minutes.', two_lines=False):
    line = ('Save &amp; Add Line; then type "clutch", pick "Service - Adjust clutch", Line Approved on &gt; Save &amp; Close'
            if two_lines else 'Save &amp; Close')
    return P(needs, [SIGNIN, LOC, 'Technicians [Tech-A] and [Tech-B] (the expected results call them "Esther Howard" and "Ralph Edwards").',
        f'Customer "{name}" (this case only) with a contact and an asset.'] + extra_have + [EX],
       [TECHS('two, [Tech-A] and [Tech-B]'), CUST(name),
        f'Work order: Work Orders &gt; Create Work Order &gt; Customer "{name}" &gt; its asset &gt; Save (if a credit-limit Confirmation appears, click Create). In New Line &gt; "What Are You Doing?" type "grease" and pick "Service - Full grease service" (no parts) &gt; Line Approved on &gt; {line}. Write down the number (top left) as [WO-1] ("{num}" in the expected results).',
        'On [WO-1], in the card at the left, pick [Tech-A] in Lead Technician (it saves at once; it can only be changed once the work order is Approved).'] + extra_setup)
c[368169] = editwo('ZZAUTOTEST Edit WO Lead Mileage', 'S1-712', ['One Approved work order [WO-1] led by [Tech-A], with Mileage 120,000.'],
    ['In the same card click Mileage, type 120000 and click outside the field (it saves when you leave it).',
     'Check: reload [WO-1]. Lead Technician reads [Tech-A] and Mileage reads 120,000.'])
c[368170] = editwo('ZZAUTOTEST Edit WO Refused', 'S1-714', ['One work order [WO-1] with status Complete (reviewed, not invoiced), led by [Tech-A], Mileage 120,000, Engine Hours 3,420, Customer PO "PO-100".'],
    ['In the same card type Mileage 120000 and Engine Hours 3420 (each saves when you leave the field). On the Finance tab type "PO-100" in Customer PO.',
     COMPLETE.replace('[WO]', '[WO-1]'),
     'Check: reload [WO-1]. Status Complete, Lead Technician [Tech-A], Mileage 120,000, Engine Hours 3,420, Customer PO "PO-100".'],
    needs='Needs: 1 user · 1 browser · about 15 minutes.')
c[368171] = editwo('ZZAUTOTEST Edit WO Audit', 'S1-716', ['One Approved work order [WO-1] with two approved lines that follow the lead (no technician of their own), led by [Tech-A].'],
    ['Check: reload [WO-1]. Both lines\' Labor rows show [Tech-A]. The history is at the three-dots button at the top right of the tabs &gt; Audit Log (window "Work Order Log").'],
    two_lines=True)
def parts(page, old):
    return P('Needs: 1 user · 1 browser · about 5 minutes. No test data of its own: it uses the rows the page already lists.', [SIGNIN, LOC,
        'Parts in the top menu opens the parts area; its left menu lists Part Sales, Inventory, Catalog, Returns, Purchase Orders, Vendor Invoices, Vendors.',
        f'This page has no {old} filter button; its filter is the Search box at the right of the page header (not the search in the top bar, which searches the whole app).'], [])
c[368218] = parts('Purchase Orders', 'Vendor'); c[368219] = parts('Vendors', 'State/Province'); c[368223] = parts('Vendor Invoices', 'Vendor')
def report(rep, flt):
    return P('Needs: 1 user · 1 browser · a production sign-in for the comparison · about 10 minutes. No test data of its own.', [SIGNIN + ' Your role must see Reports.', LOC,
        f'Before you start: Reports &gt; {rep}; if the {flt} filter was changed, set it back to its default.',
        'For step 9: a sign-in to production (app.shopview.com) that can see Reports. You only look there; nothing is changed.'], [])
c[368233] = report('Sales By Customer', 'Customer'); c[368234] = report('Parts Velocity', 'Vendor'); c[368235] = report('Inventory Value', 'Category')
c[97026] = P('Needs: about 20 minutes, on one day.', [GASIGN, LOC, GA, GA2],
   ['Settings &gt; Staff &gt; New Staff Member: a brand-new user "ZZAUTOTEST Newbie" at this location with a role that has Work Orders View; finish the invite so they can sign in. Do not open Work Orders as this user before the steps. If the name was used before, use a new name and read the expected results with it.',
    'As Admin (the dispatcher): Work Orders &gt; Board View &gt; Density &gt; pick Comfortable. Then sign out.'])
c[97034] = P('Needs: about 30 minutes, in one sitting (all four users in the same week, Monday to Sunday).', [GASIGN, LOC, GA, GA2,
    'Events to look for: work_orders_display_view (each time a display is shown) and the density events work_orders_density_load and work_orders_density_change.'],
   ['Settings &gt; Staff &gt; New Staff Member: four new users at this location with a role that has Work Orders View (e.g. "ZZAUTOTEST F3 Weekly U1" to "U4"); finish each invite so they can sign in. None may have opened Tech View or Board View before the steps.'])
c[97033] = P('Needs: about 30 minutes, over two different days of the same week (Monday to Sunday).', [GASIGN, LOC, GA, GA2,
    'Board View starts every new user with VIN/Serial off and Total price on.'],
   ['Settings &gt; Roles &amp; Permissions: create a role with Work Orders View but without See financial data (e.g. "ZZAUTOTEST No Money").',
    'Settings &gt; Staff &gt; New Staff Member: four new users at this location (e.g. "ZZAUTOTEST F3 Rate U1" to "U4"); finish each invite so they can sign in. U1, U2 and U3 get a role with Work Orders View and See financial data; U4 gets the role from step 1.',
    'Check: as U4, Board View &gt; Fields to display does not offer Total price.'])
for k, v in c.items():
    assert '<br' not in v, k
    json.dump({'custom_preconds': v}, open(os.path.join(OUT, f'C{k}.json'), 'w'), indent=1)
print(len(c), 'written')
