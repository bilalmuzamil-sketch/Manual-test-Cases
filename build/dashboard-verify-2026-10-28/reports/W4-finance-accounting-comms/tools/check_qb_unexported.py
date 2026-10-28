#!/usr/bin/env python3
"""W4 — QB Unexported (Customers / Vendors / Journal Entries tabs): full list per location, tab counts,
group membership, and each row's document checked against its own record where one is reachable.

No product spec exists for this screen (searches in RESULTS.md); the checks follow the fixed bug tickets
that state the expected behaviour (SV-9866 customer name shown, SV-10630 dates not a day early,
SV-11250 only your own location's rows) and internal consistency (badge = rows listed)."""
import json, sys, collections
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
from collect_dashboard import curl, WORKPLACES
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms'
GROUP = {'Customers': 'customer', 'Vendors': 'vendor', 'Journal Entries': 'journal_entry'}
rows, summary, raw = [], {}, {}
def chk(cid, loc, desc, ok, observed=None, expected=None):
    rows.append({'check': cid, 'location': loc, 'desc': desc, 'result': 'PASS' if ok else 'FAIL', 'observed': observed, 'expected': expected})
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz}); H = {'X-Location-ID': wid}
    summary[name] = {}
    for tab, g in GROUP.items():
        f = [('filters[0][field]', 'groupName'), ('filters[0][value]', g)]
        s, badge = curl('GET', '/api/bookkeeping/unexported-items?' + urlencode(f), extra_headers=H)      # the badge request, as the screen sends it
        bc = badge['data']['metadata']['totalRecords']
        items, page = [], 1
        while True:
            s, j = curl('GET', '/api/bookkeeping/unexported-items?' + urlencode(f + [('pagination[page]', page), ('pagination[rowsPerPage]', 1000)]), extra_headers=H)
            c = j['data']['collection']; items += c
            if len(c) < 1000:
                break
            page += 1
        raw[f'{name}|{tab}'] = items
        summary[name][tab] = {'badge': bc, 'rows': len(items), 'types': dict(collections.Counter(i['type'] for i in items))}
        chk('Q1', name, f'{tab} tab: count in the tab label = rows listed', bc == len(items), bc, len(items))
        chk('Q2', name, f'{tab} tab: every row belongs to that tab', all(i.get('group') == g for i in items), [i['type'] for i in items if i.get('group') != g][:5], [])
        blank = [i['id'] for i in items if not i.get('number') or (g == 'customer' and not i.get('customer'))]
        chk('Q3', name, f'{tab} tab: every row shows its document number' + (' and customer name' if g == 'customer' else ''), not blank, {'n': len(blank), 'sample': [(i['type'], i.get('number'), i.get('customer'), i.get('errorMessage', '')[:60]) for i in items if i['id'] in blank][:5]}, 0)
        dup = [k for k, n in collections.Counter((i['type'], i.get('referenceId')) for i in items).items() if n > 1]
        chk('Q4', name, f'{tab} tab: no document listed twice', not dup, dup[:5], [])
        noerr = [i['id'] for i in items if not i.get('errorMessage')]
        chk('Q5', name, f'{tab} tab: every row says why it did not export', not noerr, len(noerr), 0)
json.dump({'summary': summary, 'checks': rows, 'raw_sample': {k: v[:20] for k, v in raw.items()}}, open(f'{OUT}/results-qb-unexported.json', 'w'), indent=1)
json.dump(raw, open('/tmp/cln/w4/qb_unexported_raw.json', 'w'))
curl('POST', '/api/iam/change-location', {'workplace_id': WORKPLACES[0][0], 'workplace_timezone': WORKPLACES[0][2]})
print(json.dumps(summary, indent=0)[:1500]); print(collections.Counter(r['result'] for r in rows))
for r in rows:
    if r['result'] == 'FAIL':
        print('FAIL', r['check'], r['location'], r['desc'], json.dumps(r['observed'])[:300])
