"""Section-3 recheck (4 Nov 2026) shared helpers. SECRET-FREE: the cookie is read by collect_dashboard from
/tmp/cln/sess-admin.txt at run time and never printed. Rule 99: use(key) reads the zone LIVE from
GET /api/staff/my-workplaces, change-locations the session to it and asserts process TZ == that zone."""
import json, os, sys, datetime as dt
from urllib.parse import urlencode, parse_qsl
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from collect_dashboard import curl  # noqa: E402
from collect_reports import instants  # noqa: E402,F401
WID = {'HD': 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'LETH': 'f8a8b802-7780-4b16-bf10-343caeb616b2',
       'QB': '25a0d576-b371-4b82-bef4-41ba977f31c2', 'DVI': '39522bc6-abca-4f67-bd12-2840043c2d68'}
EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-2026-11-04/results/sec3'
REQLOG = []


def live_zones():
    c, b = curl('GET', '/api/staff/my-workplaces')
    d = b.get('data', b); L = d if isinstance(d, list) else (d.get('collection') or d.get('workplaces') or [])
    return {w['id']: (w['name'], w['timezone']) for w in L}


def use(key, check_tz=True):
    wid = WID[key]; name, tz = live_zones()[wid]
    if check_tz: assert os.environ.get('TZ') == tz, f'run with TZ={tz}'
    c, _ = curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
    return {'key': key, 'wid': wid, 'tz': tz, 'name': name, 'change_location': c, 'zone_source': 'GET /api/staff/my-workplaces (live)',
            'process_TZ': os.environ.get('TZ'), 'local_now': dt.datetime.now(ZoneInfo(tz)).isoformat(timespec='seconds'),
            'utc_now': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')}


def get(path, params, wid):
    q = urlencode(parse_qsl(params, keep_blank_values=True)) if isinstance(params, str) else urlencode(params or [], doseq=True)
    p = path + ('?' + q if q else '')
    c, b = curl('GET', p, extra_headers={'X-Location-ID': wid}); REQLOG.append({'GET': p, 'status': c}); return c, b


def call(m, p, body, wid):
    c, b = curl(m, p, body, extra_headers={'X-Location-ID': wid}); REQLOG.append({m: p, 'status': c})
    print(m, p, c, json.dumps(b)[:300] if c >= 300 else ''); return c, b


def did(b):
    d = (b or {}).get('data', b) or {}
    if isinstance(d, list) and d: d = d[0]
    for k in ('id', 'company_id', 'contact_id', 'vehicle_id', 'work_order_id', 'catalogue_part_id', 'part_id', 'line_id', 'task_id'):
        if isinstance(d, dict) and d.get(k): return d[k]
    if isinstance(d, dict):
        for v in d.values():
            if isinstance(v, dict) and v.get('id'): return v['id']
    return None


def dump(name, obj):
    os.makedirs(EV, exist_ok=True); obj = dict(obj); obj['server_requests'] = list(REQLOG)
    json.dump(obj, open(f'{EV}/{name}.json', 'w'), indent=1, default=str); return f'{EV}/{name}.json'
