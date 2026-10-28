#!/usr/bin/env python3
"""W4 — vendor account ledgers (unpaid bills + credits) for EVERY location. The vendor ledger list is
scoped to the session's location, so the session is switched to each location in turn and the same
location id is sent as X-Location-ID. Raw → /tmp/cln/w4/ap/ledgers_by_loc2/<wid>/<vendorId>.json"""
import json, os, sys, glob
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
from collect_dashboard import curl, WORKPLACES
vend = {}
for f in glob.glob('/tmp/cln/w4/ap/ledgers/*.json'):
    g = json.load(open(f))
    vend[g['vendorId']] = (g.get('account'), g['name'])
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz}); H = {'X-Location-ID': wid}
    d = f'/tmp/cln/w4/ap/ledgers_by_loc2/{wid}'; os.makedirs(d, exist_ok=True)
    for vid, (acc0, vname) in vend.items():
        fn = f'{d}/{vid}.json'
        if os.path.exists(fn):
            continue
        sv, vv = curl('GET', f'/api/parts-catalogue/vendor/{vid}', extra_headers=H)
        acc = ((vv.get('data') or {}).get('vendor') or {}).get('vendor_account_id') if sv == 200 else None
        if not acc:
            json.dump({'vendorId': vid, 'name': vname, 'status': sv, 'account': None, 'rows': []}, open(fn, 'w'))
            continue
        rows, page = [], 1
        while True:
            s, j = curl('GET', '/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?' + urlencode(
                [('accountId', acc), ('pagination[page]', page), ('pagination[rowsPerPage]', 500)]), extra_headers=H)
            r = (j.get('data') or {}).get('response', {}) if s == 200 else {}
            c = r.get('collection', [])
            rows += c
            if len(c) < 500:
                break
            page += 1
        json.dump({'vendorId': vid, 'name': vname, 'account': acc, 'status': s, 'count': r.get('unpaid_transactions_count'), 'rows': rows}, open(fn, 'w'))
    print(name, 'done', flush=True)
curl('POST', '/api/iam/change-location', {'workplace_id': WORKPLACES[0][0], 'workplace_timezone': WORKPLACES[0][2]})
