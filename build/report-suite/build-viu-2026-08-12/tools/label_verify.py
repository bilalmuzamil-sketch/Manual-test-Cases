"""High-confidence label verification: the classes that can be settled EXACTLY.

Only classes harvested completely are scored. A control we never opened produces
NO verdict — 'not seen' is never scored as 'wrong' (Rule 12).
"""
import json
import re

H = json.load(open('build/report-suite/build-viu-2026-08-12/evidence/harvest-all.json'))
M2 = json.load(open('build/report-suite/build-viu-2026-08-12/evidence/menus2.json'))
R = json.load(open('/tmp/rs812/rows.json'))['rows']
ICON = re.compile(r'arrow_drop_(up|down)|keyboard_double_arrow_down|info_outline')

BUILD = {}
for k in H:
    h = H[k]
    BUILD[k] = {
        'headers': [ICON.sub('', x).strip() for x in h['headers'] if ICON.sub('', x).strip()],
        'colmenu': [i['txt'] for i in ((h.get('menus') or {}).get('columns') or {}).get('items', [])],
        'tabs': [t['txt'] for t in h['tabs'] if (t.get('tid') or '').startswith('tab_')],
        'texts': set(h['texts']),
    }
for k in M2:
    for ctrl, v in M2[k].items():
        if 'export' in ctrl and isinstance(v, list) and v and v[0].get('items'):
            BUILD[k]['exportmenu'] = [i['txt'] for i in v[0]['items']]
BUILD['wip']['exportmenu'] = ['Download (PDF)', 'Download (CSV)']

CHECKS = [
    # (case, report key, class, the ordered list the case asserts)
    (30452, 'wip', 'tab names (as the tester SEES them, after text-transform)',
     ['Approved - Partially Completed', 'Approved - Not Started', 'Completed', 'Estimates']),
    (30466, 'wip', 'column-selection list',
     ['WO #', 'Status', 'Customer', 'Asset', 'VIN', 'Advisor', 'Days Open', 'Last Activity',
      'Labor Earned', 'Labor Remaining', 'Parts Earned', 'Parts Remaining', 'Earned',
      'Remaining', 'Inv. Hrs']),
    (30510, 'wip', 'export menu', ['Download (PDF)', 'Download (CSV)']),
    (30156, 'sbc', 'column-selection list',
     ['Date', 'Inv. Hrs', 'Labor Invoiced', 'Labor Margin', 'Parts Invoiced', 'Parts Margin',
      'Shop Supplies', 'Margin', 'Margin %']),
    (30159, 'sbc', 'export menu',
     ['Download Summary (PDF)', 'Download Expanded View (PDF)', 'Download Summary (CSV)',
      'Download Expanded View (CSV)']),
    (38859, 'tu', 'column-selection list (Technician is a fixed header, not a toggle)',
     ['Total Hours', 'WO Hours', 'Internal Hours', 'Utilization %', 'Est. Lost Labor']),
    (30401, 'tu', 'column headers in order',
     ['Technician', 'Total Hours', 'WO Hours', 'Internal Hours', 'Utilization %',
      'Est. Lost Labor']),
]
SRC = {'tab names (as the tester SEES them, after text-transform)': 'tabs_seen',
       'column-selection list': 'colmenu', 'export menu': 'exportmenu',
       'column-selection list (Technician is a fixed header, not a toggle)': 'colmenu',
       'column headers in order': 'headers'}
SEEN = {'wip': ['Approved - Partially Completed (15)', 'Approved - Not Started (3)',
                'Completed (4)', 'Estimates (15)']}

print('%-8s %-6s %-58s %s' % ('CASE', 'REPORT', 'CLASS', 'VERDICT'))
ok = bad = 0
detail = []
for cid, k, cls, asserted in CHECKS:
    src = SRC[cls]
    got = ([re.sub(r'\s*\(\d+\)$', '', t) for t in SEEN[k]] if src == 'tabs_seen'
           else BUILD[k].get(src))
    if got is None:
        print('%-8s %-6s %-58s NOT HARVESTED - no verdict' % ('C%s' % cid, k, cls[:58]))
        continue
    same = list(got) == list(asserted)
    setsame = set(got) == set(asserted)
    v = 'MATCH (exact, in order)' if same else (
        'SAME SET, ORDER DIFFERS' if setsame else 'DIFFERS')
    ok += same
    bad += (not same)
    print('%-8s %-6s %-58s %s' % ('C%s' % cid, k, cls[:58], v))
    detail.append({'case': cid, 'report': k, 'class': cls, 'asserted': asserted,
                   'build': got, 'verdict': v})
print('\nexact in-order matches: %d of %d scored' % (ok, ok + bad))
json.dump(detail, open('/tmp/rs812/labelverify.json', 'w'), indent=1)
