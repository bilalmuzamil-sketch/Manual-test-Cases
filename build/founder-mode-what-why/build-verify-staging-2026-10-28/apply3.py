# What/Why — second-user cases, after the QA lead's ruling (28 Oct 2026): "I temporarily change the shared 'Tech' user's
# role -> Always use such work arounds for such blockers."
# Evidence: probe 28f (role "ZZAUTOTEST User B - no invoices" = Page Access Reports only; given to Tech ShopView
# tech@shopview.com via Settings > Staff > Search > edit > Role > Save & Close; Tech quick sign-in then shows Dashboard +
# Reports, Export Reports lists Customer Invoice; Tech restored to Technician, 6 permissions read back) and probe 25-z
# (role editor: ticking Invoicing & payments View raises "Enable See Financial Data? Invoicing & Payments requires See
# Financial Data." — the C154719 role cannot be built). Same guards as apply.py.
import sys, os, re, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
USERB = (' To set up user B on staging, signed in as an Admin: click the location box at the top right, then Settings, then Roles '
         '&amp; Permissions, then Create Custom Role; type the Role name ZZAUTOTEST User B - no invoices, switch on Reports under '
         'Page Access and leave everything else off, then click Create (skip this if the role is already in the list). Then '
         'Settings, Staff: click Search, type tech@shopview.com, click the edit icon at the end of Tech ShopView&#39;s row, pick '
         'ZZAUTOTEST User B - No Invoices under Role and click Save &amp; Close. User B is then the Tech quick sign-in: sign out '
         'and choose Tech on the sign-in screen. When the test is finished, set Tech ShopView&#39;s Role back to Technician the '
         'same way, because other testers use that sign-in.')
PLAN = {
 549088: {'pre': [('Invoicing &amp; payments - View off, at Staging Heavy Duty - 9919.',
                   'Invoicing &amp; payments - View off, at Staging Heavy Duty - 9919.' + USERB)],
          'marker': '<p>AUTOMATION: READY</p>'},
 154719: {'marker': '<p>AUTOMATION: HOLD - cannot be set up on staging: Settings will not give a role Invoicing &amp; payments without also switching on See Financial Data</p>'},
}
write = '--write' in sys.argv
log = open(f'{D}/write-log.txt', 'a') if write else None
for i, p in PLAN.items():
    cur = L.call(f'get_case/{i}'); time.sleep(0.3)
    assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, (i, 'guard')
    d = {}
    if 'pre' in p:
        t = cur['custom_preconds']
        for a, b in p['pre']: assert t.count(a) == 1, (i, a, t.count(a)); t = t.replace(a, b)
        d['custom_preconds'] = t
    e = cur['custom_expected']; mk = re.findall(r'<p>AUTOMATION:[^<]*</p>', e); assert len(mk) == 1, (i, mk)
    d['custom_expected'] = e.replace(mk[0], p['marker'])
    d = {f: v for f, v in d.items() if v != cur[f]}
    if not write: print(i, 'PREVIEW', sorted(d), '->', p['marker'][13:90]); continue
    r = L.call(f'update_case/{i}', d); time.sleep(1)
    ok = all(r[f] == v for f, v in d.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} fields={sorted(d)} marker={p['marker'][3:-4]} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
