#!/usr/bin/env python3
"""Area 3 — attached core charge (SV-10379, Blocked): seed a ZZAUTOTEST stocked part with a $25 core charge at DVI Test
and read Inventory Value (today) + the inventory parts list. Logged to ../seed-log.jsonl. Left in place (tagged ZZAUTOTEST).
Run: TZ=Pacific/Fiji python3 core_part.py"""
import sys, os, json, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl
from collect_reports import instants
W, TZ = '39522bc6-abca-4f67-bd12-2840043c2d68', 'Pacific/Fiji'; H = {'X-Location-ID': W}; LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'seed-log.jsonl')
d = lambda r: (r or {}).get('data') or {} if isinstance(r, dict) else {}
def call(m, p, b=None, why=''):
    s, r = curl(m, p, b, extra_headers=H)
    open(LOG, 'a').write(json.dumps({'at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'area': 3, 'op': f'{m} {p}', 'request': b, 'http': s, 'response': json.dumps(r)[:400], 'why': why}) + '\n'); return s, r
curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': TZ})
tag = dt.datetime.now(dt.timezone.utc).strftime('%m%d%H%M'); pn = f'ZZAUTOTEST-CORE-{tag}'
st, cats = curl('GET', '/api/inventory/categories?limit=500', extra_headers=H); CATS = [x['value'] for x in cats['data']['collection']]
st, bins = curl('GET', '/api/inventory/bin-locations', extra_headers=H); b = [x for x in bins['data']['binLocations'] if x['isDefault']][0]
cp = None
for cat in CATS[:12]:
    c, r = call('POST', '/api/parts-catalogue/add-catalogue-part', {'name': 'ZZAUTOTEST core-charge part', 'partNumber': pn, 'category_id': cat, 'manufacturerId': None, 'tags': []}, 'core part: catalogue entry')
    cp = d(r).get('catalogue_part_id') or d(r).get('id')
    if c in (200, 201) and cp: break
c, r = call('POST', '/api/inventory/parts/create', {'catalogPartId': cp, 'categoryId': cat, 'vendorId': None, 'quantity': 2, 'cost': 20, 'sellPrice': 30, 'min': 0, 'max': 10, 'manufacturerId': None,
            'coreCharge': 25, 'environmentalCharge': None, 'tags': [], 'isFixedPrice': False, 'gridLocation': '', 'bins': [{'id': b['id'], 'quantity': 2, 'isDefault': True}]}, 'core part: stocked part qty 2 cost 20 with core charge 25')
pid = d(r).get('part_id') or d(r).get('id'); res = {'part_number': pn, 'create_http': c, 'part_id': pid}
today = dt.datetime.now(ZoneInfo(TZ)).date(); s0, e0 = instants(today, today, TZ)
st, iv = curl('GET', '/api/reporting/reports/inventory-value?' + urlencode([('range', 'custom'), ('start_date', s0), ('end_date', e0), ('locations', W), ('search', pn), ('pagination[page]', 1), ('pagination[rowsPerPage]', 50)]), extra_headers=H)
rows = d(iv).get('collection', []); res['iv'] = {'http': st, 'rows': [{k: v for k, v in x.items() if not isinstance(v, (dict, list)) and 'name' not in k.lower()} for x in rows]}
st, pl = curl('GET', '/api/inventory/parts?' + urlencode([('search', pn), ('limit', 20)]), extra_headers=H)
col = d(pl).get('collection') or d(pl).get('parts') or []
res['parts_list'] = {'http': st, 'rows': [{k: x.get(k) for k in ('id', 'part_number', 'partNumber', 'quantity', 'cost', 'core', 'is_core', 'core_charge', 'coreCharge', 'core_part_id')} for x in col]}
s, v = curl('GET', f'/api/inventory/parts/view/{pid}', extra_headers=H); vv = d(v); vv = vv.get('part', vv)
res['part_view'] = {'http': s, 'core_fields': {k: vv.get(k) for k in vv if 'core' in k.lower()}}
json.dump(res, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'core-part.json'), 'w'), indent=1); print(json.dumps(res)[:1500])
