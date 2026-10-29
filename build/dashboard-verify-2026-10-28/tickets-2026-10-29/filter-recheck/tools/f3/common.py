"""Worker F3 helpers. SECRET-FREE: cookie read from /tmp/cln/f3/sess.txt (own session), never printed. Run python with TZ=<zone>."""
import json, os, sys, datetime as dt
from urllib.parse import urlencode
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/f3/sess.txt').read().strip()
from collect_dashboard import curl, WORKPLACES
EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3'
WID = {'hd': 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'leth': 'f8a8b802-7780-4b16-bf10-343caeb616b2',
       'qb': '25a0d576-b371-4b82-bef4-41ba977f31c2', 'dvi': '39522bc6-abca-4f67-bd12-2840043c2d68'}
TZ = {w: t for w, n, t in WORKPLACES}; NAME = {w: n for w, n, t in WORKPLACES}
def loc(wid):
    s, j = curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]}); return s
def get(path, params, wid):
    q = urlencode(params, doseq=True) if params else ''
    return curl('GET', path + ('?' + q if q else ''), extra_headers={'X-Location-ID': wid})
def zones(wid):
    return {'location': NAME[wid], 'location_tz': TZ[wid], 'process_TZ': os.environ.get('TZ'), 'process_zone': str(dt.datetime.now().astimezone().tzinfo),
            'process_now': dt.datetime.now().isoformat(), 'utc_now': dt.datetime.now(dt.timezone.utc).isoformat()}
def paged(path, params, wid, per=500, key='collection'):
    out, pg = [], 1
    while True:
        c, b = get(path, params + [('pagination[page]', pg), ('pagination[rowsPerPage]', per)], wid)
        if c != 200: return c, {'error': str(b)[:300], key: out}
        d = b['data']
        if pg > 1 and d[key] and out and json.dumps(d[key][0]) == json.dumps(out[0]): break
        out += d[key]; total = (d.get('pagination') or {}).get('rowsNumber')
        if len(d[key]) < per or (total is not None and len(out) >= total): break
        pg += 1
    d = dict(d); d[key] = out; return 200, d
