# Technician Toggle, sv11788, 4 Nov 2026 — pass 2: a separate, plain Setup list (Rule 119) for each test whose starting state is hard to
# make, built ONLY from that test's own preconditions. Every click named here was seen on v26.43.5-9596ea9 (probes 01-18).
# Anything a sentence needs that was NOT seen is returned as `unseen` and goes on the test's "Partly checked" line, never guessed.
import re, html
ME = 'click the location name and your initials at the top right of the top bar'
SET = f'{ME}, then Settings'
def staff_item(x, role=None, tc=None, tech=None, locs='the test location', sr=False, bill=None, dept=None):
    t = [f'On the Staff tab of Settings ({SET}, then the Staff tab), click New Staff Member.',
         f'Type a First Name and Last Name for staff member {x}, and an Email no other staff member uses.']
    if role: t.append(f'In Role pick {role}.')
    t.append(f'In Location tick {locs} only.' if ' and ' not in locs else f'In Location tick {locs}.')
    t.append(f'In All Departments tick {dept}.' if dept else 'In All Departments tick any one.')
    if bill: t.append(f'In Billable pick {bill}.')
    if tc is True: t.append('Switch Time Clock on.')
    if tc is False: t.append('Leave Time Clock off.')
    if sr: t.append('Switch Sales Representative on.')
    if tech is True: t.append('Make sure Technician is on (switch it on if it is off).')
    if tech is False: t.append('Make sure Technician is off (switch it off if it is on).')
    t.append('Click Save & Close.')
    return (f'Make staff member {x}', ' '.join(t))
LOC = {'the test location': 'the test location', 'location B': 'location B', 'location C': 'location C'}
def parse_staff(l):
    m = re.match(r'Have (?:a new staff member for this test, )?staff members? ([A-D])\b', l)
    if not m or 'work order' in l.split(',')[0]: return None
    x = m.group(1)
    role = None
    r = re.search(r'on the built-in ([A-Za-z ]+?) role', l) or re.search(r'on a role such as ([A-Za-z ]+?)[,.]', l) or re.search(r'\(([A-Za-z ]+?) role,', l)
    if r: role = r.group(1)
    if re.search(r'on role A\b', l): role = 'role A'
    tc = True if re.search(r'Time Clock on', l) else (False if re.search(r'Time Clock off', l) else None)
    tech = True if re.search(r'Technician on', l) else (False if re.search(r'Technician off', l) else None)
    locs = 'the test location'
    if 'at the test location and at location B' in l: locs = 'the test location and location B'
    elif 'location B only' in l: locs = 'location B'
    elif 'location C only' in l: locs = 'location C'
    items = [staff_item(x, role, tc, tech, locs, sr='Sales Representative on' in l, bill=(re.search(r'Billable set to (Yes|No)', l) or [None, None])[1], dept='department 1' if 'in department 1' in l else None)]
    unseen = []
    if 'then deactivated with Deactivate Account' in l or l.startswith('Have a deactivated staff member'):
        items.append((f'Deactivate staff member {x}', f"Open staff member {x}'s Edit Staff Member window (Search, then the edit icon on the row) and click Deactivate Account."))
    if 'who can sign in' in l: unseen.append('signing in as the staff member made for the test')
    if 'time recorded' in l: unseen.append("recording time as the staff member made for the test")
    if 'has Time Clock switched off' in l: items.append((f'Switch Time Clock off for staff member {x}', f"After the work order below is made, open staff member {x}'s Edit Staff Member window, switch Time Clock off and click Save & Close (click Save if Turn Off Technician opens)."))
    return items, unseen
def wo_item(n, loc, status, lead, lines):
    t = []
    if loc != 'the test location': t.append(f'Switch to {loc} first ({ME}, Change Location, then {loc}).')
    t.append('Click Work Orders in the top bar, then Create Work Order. Pick any Customer and any Asset, then click Save (click Ok if a Customer Notes window opens).')
    first = True
    for ln in lines:
        tech = f' Under Technicians click Add Technician and pick {ln["tech"]}.' if ln.get('tech') else ''
        appr = ' tick Line Approved,' if ln.get('approved', True) else ''
        if first: t.append(f'In the New Line window type a Title,{tech} pick any Labor Rate,{appr} then click Save & Close.'); first = False
        else: t.append(f'Click New Line, type a Title,{tech} pick any Labor Rate,{appr} then click Save & Close.')
    if not lines: t.append('In the New Line window type a Title, pick any Labor Rate, tick Line Approved, then click Save & Close.')
    if lead: t.append(f"Click Lead Technician in the work order's card at the left and pick {lead}.")
    return (f'Make work order {n}', ' '.join(t))
INPROG = lambda n: (f'Put work order {n} In Progress', f"On work order {n}'s Lines tab click Start on line 1; you are now clocked in on that line and, after a reload, the work order shows In Progress. Stay clocked in until the test is done, then click Stop on that line and Clock Out.")
def parse_wo(l):
    m = re.match(r'Have a new (?:open )?service work order for this test,? (?:work order (\d), )?at (the test location|location B|location C)', l)
    if not m: return None
    n = m.group(1) or '1'; loc = m.group(2); unseen = []
    st = re.search(r', in (Estimate|Approved|In Progress|Ready for Review|Declined|Complete|Invoiced|Paid)\b', l); status = st.group(1) if st else 'Approved'
    lead = None
    lm = re.search(r'led by (staff member [A-D])|with (staff member [A-D]) as its lead', l)
    if lm: lead = lm.group(1) or lm.group(2)
    lines = []
    if re.search(r'labor entry for (staff member [A-D])|staff member A is added|added to it with Add Technician|labor entry for staff member C', l):
        who = re.search(r'(staff member [A-D])', l.split('led by')[-1] if 'led by' in l else l); lines.append({'tech': who.group(1) if who else None})
    if status == 'Estimate': lines = [dict(x, approved=False) for x in (lines or [{}])]
    items = [wo_item(n, loc, status, lead, lines)]
    if status == 'In Progress': items.append(INPROG(n))
    if status in ('Ready for Review', 'Declined', 'Complete', 'Invoiced', 'Paid'): unseen.append(f'putting a work order in {status}')
    if 'declined line' in l: items.append((f'Decline line 1 of work order {n}', f"On work order {n}'s Lines tab right-click line 1 and click Decline."))
    if re.search(r'own technician|through a shift|shift on the Schedule|five lines', l): unseen.append('the line set-up this test names (a line\'s own technician, a shift on the Schedule, or several lines)')
    if re.search(r"Technician then switched off \(and the warning saved\)", l): items.append(OFF('staff member A'))
    return items, unseen
OFF = lambda x: (f'Turn {x} into a former technician', f"Then open {x}'s Edit Staff Member window, switch Technician off, click Save & Close, and click Save in the Turn Off Technician window.")
LOCC = ('Make location C', f'On the Locations tab of Settings ({SET}, then the Locations tab) click New Location, type a Name (and anything else the window marks as needed), then click Save & Close. Enrol no one with Technician on at location C.')
ROLE = lambda tpl, extra='': ('Make role A', f'On the Roles & Permissions tab of Settings ({SET}, then the Roles & Permissions tab) click Create Custom Role. In Choose a template click {tpl}, then Apply. Type a Role name.{extra} Click Create.')
MANUAL = {
 'Have a new location for this test, location C, in the same organization, where no enrolled staff member is a technician (every staff member enrolled there has Technician off), so the board there has no technician.': ([LOCC], []),
 'Have a department for this test, department 1, at the test location.': ([('Make department 1', f'On the Departments tab of Settings ({SET}, then the Departments tab) click New Department, type a Name, then click Save & Close.')], []),
 'Have a custom role made for this test, role A, with "View mode: Tech view" set in Roles & Permissions, so staff member A gets the simplified interface.': ([ROLE('Technician', ' Under Work orders, in View mode, click Tech view.')], []),
 'Have a custom role made for this test, role A, with no access to Work Orders, so staff member A has no Work Orders access before or after.': ([ROLE('Time Clock User')], ['switching off Work Orders access in a custom role']),
 'Have a custom role made for this test from the Technician template, role A (Settings, Roles & Permissions, Create custom role).': ([ROLE('Technician')], []),
 'Have a custom role made for this test from the Foreman template, role A (Settings, Roles & Permissions, Create custom role).': ([ROLE('Foreman')], []),
 'Have a custom role made for this test from the Office User template, role A (Settings, Roles & Permissions, Create custom role).': ([ROLE('Office User')], []),
 'Have a custom role made for this test from the Time Clock User template, role A (Settings, Roles & Permissions, Create custom role).': ([ROLE('Time Clock User')], []),
 'Have a custom role made for this test from the Office User template, role A, so staff member A is on a role copied from Office User.': ([ROLE('Office User')], []),
 "Have a custom role made for this test, role A, with 'Settings → App Settings' off, so a person on it has no Staff access.": ([ROLE('Technician')], ["switching off 'Settings → App Settings' in a custom role"]),
 'Then switch Technician off for staff member C in Edit Staff Member, click Save & Close and click Save in the Turn Off Technician warning.': ([OFF('staff member C')], []),
 'Have staff member A signed in in a second browser, on any page.': ([], ['signing in as the staff member made for the test']),
 'Have a new part sale for this test, part sale 1, at the test location.': ([('Make part sale 1', 'Click Parts in the top bar, then Part Sales in the left menu, then New Part Sale. Pick any Customer and click Save.')], []),
 'Have a new part sale for this test at the test location on which staff member A has recorded time, so the person holds only a part sale.': ([('Make the part sale', 'Click Parts in the top bar, then Part Sales in the left menu, then New Part Sale. Pick any Customer and click Save.')], ['recording time on a part sale']),
 'Use an organization with a second location, location B, so open work can sit at another location.': ([('Location B', f'Use the other location in the Change Location list ({ME}, then Change Location) as location B.')], []),
 'Use an organization with a second location, location B.': ([('Location B', f'Use the other location in the Change Location list ({ME}, then Change Location) as location B.')], []),
 'Have staff member A, a technician for this test (Parts Manager role, Time Clock on, Technician on, enrolled at the test location only), on line 1 of work order 1 added with Add Technician, with no time logged on the line, and then switch staff member A\'s Technician off (and save the warning), so they are on the line but no longer a technician.':
   ([staff_item('A', 'Parts Manager', True, True), wo_item('1', 'the test location', 'Approved', None, [{'tech': 'staff member A'}]), OFF('staff member A')], []),
}
def setup_for(case):
    lines = [html.unescape(x) for x in re.findall(r'<li>(.*?)</li>', case['custom_preconds'])]
    items, unseen, unhandled = [], [], []
    for l in lines:
        if l.startswith(('Sign in as an Admin', 'Start on', 'Use a desktop', 'Set the browser', 'Open the attached', 'Make sure', 'Have Settings, Staff open', 'Choose a new', 'Use the build before', 'Know the', 'Be able to', 'Note the address', 'Switch to location C')): continue
        if l in MANUAL: it, un = MANUAL[l]
        else:
            r = parse_wo(l) or parse_staff(l)
            if r is None: unhandled.append(l); continue
            it, un = r
        items += it; unseen += un
    order = lambda t: 0 if t[0].startswith(('Make location', 'Location B', 'Make role', 'Make department')) else (1 if t[0].startswith('Make staff') else 2)
    seen = set(); out = []
    for t in sorted(items, key=order):
        if t[0] in seen and t[0].startswith('Make staff'): continue
        seen.add(t[0]); out.append(t)
    return out, sorted(set(unseen)), unhandled
def to_html(items):
    E = lambda s: html.escape(s, quote=False)
    return '<p><strong>Setup</strong></p><ol>' + ''.join(f'<li>{E(a)}: {E(b)}</li>' for a, b in items) + '</ol>'
# ---- the few precondition sets that need hand-built Setup items (still only clicks seen on the build) ----
ANYROLE = 'any role other than Office User or Time Clock User'
PIN = lambda x, where='the test location': (f"Pin staff member {x[-1]}'s column", f"On Work Orders, Board View at {where} (Work Orders in the top bar, the All tab, then the Board View icon), click the pin icon in {x}'s column header (its tooltip reads Pin and the person's name).")
EDITLABOR = lambda n, x: (f'Put {x} on line 1 with Edit labor', f"On work order {n}'s Lines tab right-click line 1, click Edit labor, pick {x} in Technician, then click Save & Close.")
def _wo(n, lead, lines, status='Approved', loc='the test location'): return wo_item(n, loc, status, lead, lines)
MANUAL.update({
 'Have three new service work orders for this test at the test location, work order 1 in Estimate, work order 2 in Approved and work order 3 in Ready for Review, each led by staff member A, with no line that staff member A is on, so there are three led work orders to count.':
   ([_wo('1', 'staff member A', [{'approved': False}], 'Estimate'), _wo('2', 'staff member A', [{}]), _wo('3', 'staff member A', [{}])], ['putting a work order in Ready for Review']),
 "Have two new technicians for this test, staff member B and staff member C, enrolled at the test location, one with a name that sorts before staff member A's and one after, so the list has names to order around staff member A.":
   ([staff_item('B', 'Technician', True, True), staff_item('C', 'Technician', True, True)], []),
 "Have staff member A, a technician for this test (Parts Manager role, Time Clock on, Technician on, enrolled at the test location only), on line 1 of work order 1 with a labor entry, added with Add Labor, and then switch staff member A's Technician off (and save the warning), so they are on the line but no longer a technician.":
   ([staff_item('A', 'Parts Manager', True, True), EDITLABOR('1', 'staff member A'), OFF('staff member A')], []),
 'Have a new service work order for this test, work order 1, at the test location, in Approved, led by staff member B, with two approved lines, line 1 and line 2, so the work order has a second line for a labor entry.':
   ([_wo('1', 'staff member B', [{}, {}])], []),
 "Have a new staff member for this test, staff member C, who has a labor entry on line 2 of work order 1, is also on line 1 with no time logged on line 1, and then has Time Clock switched off, so they are outside the location's Time Clock list.":
   ([staff_item('C', ANYROLE, True, True)], ['putting one person on two lines and then switching their Time Clock off']),
 'Have a new staff member for this test, staff member D, who is on line 1 only through Add Technician, with no labor entry on work order 1, and then has Time Clock switched off.':
   ([staff_item('D', ANYROLE, True, True)], ['adding someone with Add Technician without a labor entry (on this build Add Technician also adds a labor row)']),
 "On Board View at the test location, pin staff member A's column, then switch staff member A's Technician off (staff member A leads no work), so the column is a pinned non-technician column.":
   ([PIN('staff member A'), OFF('staff member A')], []),
 "On Board View at location C, pin staff member A's column, then switch staff member A's Technician off (staff member A leads no work).":
   ([PIN('staff member A', 'location C'), OFF('staff member A')], []),
 'Have a new location for this test, location C, in the same organization, with no work order on the open tab, where no enrolled staff member is a technician (every staff member enrolled there has Technician off), so the board there has no technician and no work.': ([LOCC], []),
 'Have three new staff members for this test, enrolled at the test location: staff member A with Time Clock on and Technician on, staff member B with Time Clock on and Technician off, and staff member C with Time Clock off, each with Billable set to Yes.':
   ([staff_item('A', ANYROLE, True, True, bill='Yes'), staff_item('B', None, True, False, bill='Yes'), staff_item('C', None, False, None, bill='Yes')], []),
 'Have three new staff members for this test, enrolled at the test location: staff member A with Time Clock on and Technician on, staff member B with Time Clock on and Technician off, and staff member C with Time Clock off, so the list has Yes and No values to sort.':
   ([staff_item('A', ANYROLE, True, True), staff_item('B', None, True, False), staff_item('C', None, False, None)], []),
 'Use an organization with a second location, location B, so you can switch away and back.': ([('Location B', f'Use the other location in the Change Location list ({ME}, then Change Location) as location B.')], []),
})
_pw = parse_wo
def parse_wo(l):
    r = _pw(l)
    if r and 'added with Add Labor' in l:
        items, un = r; items = [items[0], EDITLABOR(re.search(r'work order (\d)', l).group(1), 'staff member A')] + items[1:]
        un = [u for u in un if not u.startswith("the line set-up")]; return items, un
    if r and 'three lines that are not declined, each holding a labor entry for staff member A' in l:
        n = re.search(r'work order (\d)', l).group(1); return [wo_item(n, 'the test location', 'Approved', 'staff member B', [{'tech': 'staff member A'}] * 3)], []
    return r
