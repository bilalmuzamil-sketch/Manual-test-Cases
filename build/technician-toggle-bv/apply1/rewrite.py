# Technician Toggle build verification on sv11788 (4 Nov 2026) — pass 1: make routes followable in the build's own labels.
# Every replacement below names only labels seen on v26.43.5-9596ea9 in probes 01-15 (build/technician-toggle-bv/probe/).
# Expected results are not touched, except: the build line goes in before the marker, and the marker becomes READY (HOLD kept).
import json, re, html, sys, os
D = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(D)
BEFORE = json.load(open(f'{ROOT}/before/all-235.json'))
ME = 'click the location name and your initials at the top right of the top bar'
SETTINGS = f'{ME}, then click Settings'
WO = 'click Work Orders in the top bar, then the All tab'
BOARD = f'{WO}, then the Board View icon (the third of the three view icons left of Create Work Order)'
TECHV = f'{WO}, then the Tech View icon (the second of the three view icons left of Create Work Order)'
OPENWO = lambda n: f"Open work order {n}: {WO}, click Search, type work order {n}'s number, then click work order {n}."
FINDSTAFF = lambda x: f"On the Staff tab of Settings, click Search, type staff member {x}'s name, then click the edit icon at the end of staff member {x}'s row (the Edit Staff Member window opens)."
SWITCH = lambda x: f'Switch to {x}: {ME}, click Change Location, then click {x}.'
LINE = {  # exact <li> text (as stored, HTML-escaped) -> replacement
 'Start on Settings, Staff.': f'Start on the Staff tab of Settings: {SETTINGS}, then click the Staff tab.',
 'Start on the Settings page.': f'Start on the Settings page: {SETTINGS}.',
 'Start on Settings, Roles &amp; Permissions.': f'Start on the Roles &amp; Permissions tab of Settings: {SETTINGS}, then click the Roles &amp; Permissions tab.',
 'Start on Work Orders, Board View, at the test location.': f'Start on Work Orders, Board View, at the test location: {BOARD}. (The location in use shows at the top right of the top bar.)',
 'Start on Work Orders at the test location.': f'Start on Work Orders at the test location: {WO}. (The location in use shows at the top right of the top bar.)',
 'Start on work order 1.': f"Start on work order 1: {WO}, click Search, type work order 1's number, then click work order 1.",
 'Start on Work Orders, Board View, at location C, showing "No technicians yet".': f'Start on Work Orders, Board View, at location C, showing "No technicians yet": {BOARD}.',
 'Open Settings, Staff.': f'Open the Staff tab of Settings: {SETTINGS}, then click the Staff tab.',
 'In the Settings menu, click Staff.': 'In the row of tabs at the top of Settings, click Staff.',
 "Open staff member A's Edit Staff Member window.": FINDSTAFF('A'),
 "Open staff member A's Edit Staff Member window in a second browser tab.": 'In a second browser tab, ' + FINDSTAFF('A')[0].lower() + FINDSTAFF('A')[1:],
 'Open the New Staff Member window.': 'Click New Staff Member (above the staff list); the New Staff Member window opens.',
 'Open work order 1.': OPENWO(1), 'Open work order 2.': OPENWO(2), 'Open the work order.': OPENWO(1).replace('Open work order 1:', 'Open work order 1:'),
 'Open Add Technician.': 'Click the Add Technician box under Technicians.',
 'Open Edit Line for line 1.': "On the Lines tab, click line 1's title (the Edit Line window opens).",
 'Open Edit Labor for line 1.': 'On the Lines tab, right-click line 1, then click Edit labor (the Edit Labor window opens).',
 'Open the Lead Technician dropdown.': "Click Lead technician in the work order's card at the left to open its list.",
 'Click the Lead Technician field in the card at the left.': "Click Lead technician in the work order's card at the left.",
 'Open the Time Sheets tab.': "Click ⋮ at the right end of the work order's tabs, then click Timesheets.",
 'Open the technician filter on the Time Sheets tab.': 'On the Timesheets tab, click Filter By Technician.',
 'Open Reports, Technician Utilization.': 'Click Reports in the top bar, then Technician Utilization in the left menu.',
 'Open Reports, Punch Clock Activities.': 'Click Reports in the top bar, then Timesheet Activities in the left menu.',
 'Open Reports, Technician Efficiency.': 'Click Reports in the top bar, then Technician Efficiency in the left menu.',
 'Open the Schedule.': 'Click Schedule in the top bar.',
 'Open Work Orders, Board View.': f'Open Work Orders, Board View: {BOARD}.',
 'Open Work Orders, Board View, at the test location.': f'Open Work Orders, Board View, at the test location: {BOARD}.',
 'Open Work Orders, Board View, at Trucks Hill 2.': f'Open Work Orders, Board View, at Trucks Hill 2: {BOARD}.',
 'Open Work Orders, Tech View.': f'Open Work Orders, Tech View: {TECHV}.',
 'Open Work Orders.': f'Open Work Orders: {WO}.',
 'Click Work Orders in the menu.': 'Click Work Orders in the top bar.',
 'In the second browser, click Work Orders in the menu.': 'In the second browser, click Work Orders in the top bar.',
 'Switch to location C.': SWITCH('location C'), 'Switch to location B.': SWITCH('location B'),
 "Open work order 1's card more-actions menu.": "Click the ··· (More actions) button on work order 1's card.",
 "Open the more-actions menu on the work order's card.": "Click the ··· (More actions) button on the work order's card.",
 'Open part sale 1.': 'Click Parts in the top bar, then Part Sales in the left menu, then click part sale 1.',
 'Sign out.': f'Sign out: {ME}, then click Logout.',
 'Sign in to a Public API sandbox organization on production as its Admin.': 'Sign in on production as the Admin of a sandbox organization (an organization made for the developers of outside tools to try ShopView).',
 'Click Deactivate Account for staff member A.': "In staff member A's Edit Staff Member window, click Deactivate Account.",
}
# Things a test may use that were NOT seen on this build this pass (named on its build line, in the tester's words).
UNSEEN = [
 (r'No technicians yet|Set Up Technicians|Nothing here yet', 'the board with no technicians ("No technicians yet")'),
 (r'Deleted technician', 'the "Deleted technician" choice in the Technician filter'),
 (r'Reassign lead technician', 'the "Reassign lead technician" choice on a card whose work order has a lead'),
 (r'Sales Representative removal warning', 'the warning shown when Sales Representative is switched off'),
 (r'part sale 1|on a part sale', 'the page of a part sale'),
 (r'lanes', 'the department lanes on the Schedule'),
 (r"dialog that adds a time entry|dialog's technician list", 'the window that adds a time entry'),
 (r'Technician Efficiency', 'a technician filter on the Technician Efficiency report'),
 (r'Sign in as staff member|signed in in a second browser|who can sign in|Press Start|Press Stop', 'signing in as the staff member made for the test'),
 (r'phone number', 'a phone number field in Edit Staff Member (the window shows none)'),
 (r'Board View column|pinned column|pin it|Pin ', None),
]
STAMP = '<p>Last checked against build v26.43.5-9596ea9 (QA site sv11788) on 11/4/2026.</p>'
PARTLY = lambda w: f'<p>Partly checked against build v26.43.5-9596ea9 (QA site sv11788) on 11/4/2026; not yet seen on that build: {w}.</p>'
def rewrite(c):
    p, s, e = c['custom_preconds'], c['custom_steps'], c['custom_expected']
    used = []
    def sub(h):
        def f(m):
            t = m.group(1)
            if t in LINE: used.append(t); return f'<li>{LINE[t]}</li>'
            return m.group(0)
        return re.sub(r'<li>(.*?)</li>', f, h)
    p2, s2 = sub(p), sub(s)
    body = p + s
    miss = [w for rx, w in UNSEEN if w and re.search(rx, body)]
    m = re.findall(r'<p>AUTOMATION: [^<]*</p>', e); assert len(m) == 1, c['id']
    hold = 'AUTOMATION: HOLD' in m[0]
    line = PARTLY('; '.join(miss)) if miss else STAMP
    e2 = e.replace(m[0], line + (m[0] if hold else '<p>AUTOMATION: READY</p>'))
    assert 'Last checked against build' not in e and 'Partly checked against build' not in e, c['id']
    return p2, s2, e2, used, miss, hold
if __name__ == '__main__':
    import collections
    tot = collections.Counter(); misses = collections.Counter(); n = 0
    for k, c in BEFORE.items():
        if c['section_id'] == 113022: continue
        p2, s2, e2, used, miss, hold = rewrite(c); n += 1
        for u in used: tot[u] += 1
        for w in miss: misses[w] += 1
    print('tests', n); print('replacements used:', sum(tot.values()), 'distinct', len(tot)); [print(' ', v, k[:70]) for k, v in tot.most_common()]
    print('unseen:'); [print(' ', v, k) for k, v in misses.most_common()]
    print('unused mappings:', [k for k in LINE if k not in tot])
