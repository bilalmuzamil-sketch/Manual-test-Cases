# Parts Lifecycle (group 20439) build verification on QA site sv10647 (v26.43.4-999c51d), 3 Nov 2026.
# Our cases only (created_by 3), not Automated, never C425662/C425725/C425726 (QA lead: "Leave those 3 alone").
# Each case: setup recipes appended to Preconditions (every label seen on sv10647 this pass: probes 01-09), two route fixes,
# two import-step fixes, stamp, marker. Expected results untouched except the stamp line and the marker.
# Guards: created_by==3, atmstatus!=3, updated_on == before/ snapshot, exact-count replacements; read back.
import sys, os, re, json, time, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
E = lambda s: html.escape(s, quote=False).replace("'", '&#39;')
BUILD = 'v26.43.4-999c51d'; DATE = '11/3/2026'
R = {
 'admin': "Admin at the test location: on the QA site's sign-in screen choose Admin. The test location is Staging Heavy Duty - 9919; its name shows in the box at the top right. If another name shows, click that box, click the name beside Change Location: and pick Staging Heavy Duty - 9919.",
 'locB': "Location B is Staging Lethbridge - 4310. To switch: click the box at the top right, click the name beside Change Location: and pick Staging Lethbridge - 4310. Switch back to Staging Heavy Duty - 9919 the same way.",
 'part': "To create a part: click Parts in the top bar, Inventory in the left menu, then New Inventory Part. Fill Description and Part Number (for example ZZAUTOTEST-PL-{K}-A for part A, -B for part B), pick a Category, type a Cost and a Sell Price, type the Quantity in the bin row (the location's bin, for example General Storage, is offered), then click Save. Leave Track quantities and cost of goods on for a tracked part; click it off for an untracked part. Add Bin Location adds a second bin; Vendor, Manufacturer, Core Charge, Min, Max and Tags are in the same window. Parts that must start with the same text all start ZZAUTOTEST-PL-{K}-, so searching for that finds them all.",
 'search': "The Search box above the Inventory list opens when you click Search (the magnifier).",
 'inactive': "To set a part inactive: on the Inventory page's Active tab click Search, type its part number, click its row; in Edit Inventory Part click Inactive under Part Status, click Save, then click Deactivate in the Deactivate part? window. The part then shows on the Inactive tab.",
 'theme': "Theme: click your avatar (the AS circle) at the top right; Light and Dark are at the bottom of its menu.",
 'cycle': "A cycle count is running when the Inventory list shows a Count column with Save and Cancel above it; click Cancel to stop it.",
 'settings': "Settings: click the box at the top right, then Settings in its menu. The left menu then lists Staff, Roles & Permissions, Bin Locations and Categories, and Inventory under IMPORTS.",
 'role': "To create a custom role: Settings, then Roles & Permissions in the left menu, then Create Custom Role; in Choose a template click Skip; type the Role Name; switch on Parts Department, then tick the boxes the setup names on its three rows, Part sales, Part Library and Inventory, and Vendor and order management (each has View, Create & Edit and Delete); See Financial Data is under Cross-Cutting Toggles; then click Create. (The setup above writes these boxes as, for example, Part Library & Inventory — View, which is the View box on the Part Library and Inventory row.)",
 'userB': "User B: the QA site's sign-in screen offers only Admin and Tech, so user B is the shared Tech sign-in given role B for this test. Signed in as Admin: Settings, then Staff in the left menu; click Search, type tech@shopview.com, click the edit icon at the end of Tech ShopView's row, pick role B under Role and click Save & Close. Then, in the second (private) window, choose Tech on the sign-in screen. When the test is finished, set Tech ShopView's Role back to Technician the same way, because other testers use that sign-in.",
 'import': "The inventory import page has Download Template (a file with the right columns), Select CSV File (to pick your file) and Submit File.",
 'ivr': "The Inventory Value report: Reports in the top bar, then Inventory Value under PARTS in the left menu (Parts Velocity is just above it). Its As of: date, Category:, Vendor: and Location: filters sit above the table; Download (PDF) and Download (CSV) are in its three-dot menu.",
 'export': "Export is in the Inventory list's three-dot actions menu (with Cycle count and Deactivate parts); it downloads a file.",
 'twotabs': "Second tab: open a new browser tab on the same QA site address (https://sv10647.qa.shopview.com); you stay signed in as the same user.",
}
ROUTE = [('(Settings, then Data Import, then Inventory)', '(click the box at the top right, then Settings, then Inventory under IMPORTS in the left menu; the page is titled Inventory Import Preview)'),
         ('(Settings, then Roles &amp; Permissions)', '(click the box at the top right, then Settings, then Roles &amp; Permissions in the left menu)')]
STEPS = [('<li>Upload the file.</li>', '<li>Click Select CSV File and pick the file.</li>'), ('<li>Run the import.</li>', '<li>Click Submit File.</li>')]
NOTYET = '<p>The build is not yet available to check this case against.</p>'
STAMP = f'<p>Last checked against build {BUILD} (QA site sv10647) on {DATE}.</p>'
OLDMK = '<p>AUTOMATION: HOLD - not yet build-verified (no build yet)</p>'
def recipes(c, trig):
    pre = html.unescape(re.sub(r'<[^>]+>', '\n', c['custom_preconds'])) + html.unescape(re.sub(r'<[^>]+>', '\n', c['custom_steps'] or ''))
    out = ['admin'] if 'Admin' in pre else []
    if 'locB' in trig: out.append('locB')
    if 'part' in trig: out.append('part')
    if 'Search box' in pre: out.append('search')
    if re.search(r'inactive', html.unescape(c['custom_preconds']), re.I): out.append('inactive')
    if 'theme' in trig: out.append('theme')
    if 'cycle' in trig: out.append('cycle')
    if {'role', 'userB', 'import'} & set(trig): out.append('settings')
    if 'role' in trig or 'userB' in trig: out.append('role')
    if 'userB' in trig: out.append('userB')
    if 'import' in trig: out.append('import')
    if 'ivr' in trig: out.append('ivr')
    if 'export' in trig: out.append('export')
    if 'twotabs' in trig and re.search(r'second (browser )?tab|tab 2', pre): out.append('twotabs')
    return out
def plan(c, trig):
    K = f"C{c['id']}"
    p = c['custom_preconds']
    for a, b in ROUTE: p = p.replace(a, b)
    items = ''.join(f'<li>{E(R[k].replace("{K}", K))}</li>' for k in recipes(c, trig))
    assert p.endswith('</ul>'), c['id']
    p = p + f'<p>How to set this up on the QA site (https://sv10647.qa.shopview.com):</p><ul>{items}</ul>'
    s = c['custom_steps']
    for a, b in STEPS: s = s.replace(a, b)
    e = c['custom_expected']; assert e.count(NOTYET) == 1 and e.count(OLDMK) == 1, c['id']
    e = e.replace(NOTYET, STAMP).replace(OLDMK, '<p>AUTOMATION: READY</p>')
    return {'custom_preconds': p, 'custom_steps': s, 'custom_expected': e}
if __name__ == '__main__':
    ids = [int(x) for x in open(sys.argv[1]).read().split()]
    write = '--write' in sys.argv
    cls = {r['id']: r for r in json.load(open(f'{D}/classify.json'))}
    log = open(f'{D}/write-log.txt', 'a') if write else None
    for i in ids:
        assert i not in (425662, 425725, 425726)
        snap = json.load(open(f'{D}/before/C{i}.json'))
        cur = L.call(f'get_case/{i}') if write else snap
        assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_on'] == snap['updated_on'], (i, 'guard')
        d = plan(cur, cls[i]['trig']); d = {f: v for f, v in d.items() if v != cur[f]}
        if not write: json.dump(d, open(f'{D}/preview/C{i}.json', 'w'), indent=1); continue
        r = L.call(f'update_case/{i}', d); time.sleep(0.6)
        ok = all(r[f] == v for f, v in d.items())
        line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} fields={sorted(d)} marker=READY verify={'OK' if ok else 'MISMATCH'}"
        print(line); log.write(line + '\n'); log.flush()
