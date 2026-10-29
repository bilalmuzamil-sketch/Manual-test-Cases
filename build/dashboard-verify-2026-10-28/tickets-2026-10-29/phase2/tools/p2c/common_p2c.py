"""Worker p2c shared helpers. SECRET-FREE: the cookie is read from /tmp/cln/p2c/sess.txt (own session, never printed).
Every call is made after change-location to the location's own zone (Rule 99); run python with TZ=<zone>."""
import json, os, sys, datetime as dt
from urllib.parse import urlencode
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/p2c/sess.txt').read().strip()
from collect_dashboard import curl, WORKPLACES, ranges
from collect_reports import instants
OUT = '/tmp/cln/p2c'
WID = {n: w for w, n, t in WORKPLACES}; TZ = {w: t for w, n, t in WORKPLACES}; NAME = {w: n for w, n, t in WORKPLACES}
def loc(wid): return curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]})
def get(path, params, wid):
    q = urlencode(params, doseq=True) if params else ''
    return curl('GET', path + ('?' + q if q else ''), extra_headers={'X-Location-ID': wid})
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
