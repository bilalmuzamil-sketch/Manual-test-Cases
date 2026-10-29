# Filter-recheck worker F2: shared helpers (copied from phase2/tools/p2b/common.py; only the session path differs).
# SECRET-FREE: the cookie is read from /tmp/cln/f2/sess.txt (mode 600) and never printed.
import sys, json, os, datetime as dt, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/f2/sess.txt').read().strip()   # private F2 session
from collect_dashboard import curl, WORKPLACES
from collect_reports import instants
from urllib.parse import urlencode
TZ = {w: tz for w, _, tz in WORKPLACES}
NAME = {w: n for w, n, _ in WORKPLACES}
ALL = [w for w, _, _ in WORKPLACES]
DVI = '39522bc6-abca-4f67-bd12-2840043c2d68'; HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'
REQS = []   # every request this run sent (path only, no secrets)

def change_loc(wid):
    return curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]})

def get(path, wid):
    REQS.append(path)
    return curl('GET', path, extra_headers={'X-Location-ID': wid})

def pv_params(locs, f, t, zone, typ='both', search=None, sort='demand', desc=True, page=1, per=1000):
    s, e = instants(f, t, zone)
    p = [('type', typ), ('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', ','.join(locs))]
    if search: p.append(('search', search))
    return p + [('pagination[page]', page), ('pagination[rowsPerPage]', per), ('pagination[sortBy]', sort), ('pagination[descending]', 'true' if desc else 'false')]

def pv_all(active, locs, f, t, zone, **kw):
    rows, page = [], 1
    while True:
        st, j = get('/api/reporting/reports/parts-velocity?' + urlencode(pv_params(locs, f, t, zone, page=page, **kw)), active)
        if st != 200: return st, j, rows
        d = j['data']; rows += d['collection']
        if len(rows) >= d['pagination']['rowsNumber'] or not d['collection']: return 200, d['pagination'], rows
        page += 1

def iv_params(locs, day, zone, search=None, sort='total_cost', desc=True, page=1, per=1000):
    s, e = instants(day, day, zone)
    p = [('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', ','.join(locs))]
    if search: p.append(('search', search))
    return p + [('pagination[page]', page), ('pagination[rowsPerPage]', per), ('pagination[sortBy]', sort), ('pagination[descending]', 'true' if desc else 'false')]

def iv_all(active, locs, day, zone, **kw):
    rows, page = [], 1
    while True:
        st, j = get('/api/reporting/reports/inventory-value?' + urlencode(iv_params(locs, day, zone, page=page, **kw)), active)
        if st != 200: return st, j, rows, None
        d = j['data']; rows += d['collection']
        if len(rows) >= d['pagination']['rowsNumber'] or not d['collection']: return 200, d['pagination'], rows, d.get('totals')
        page += 1
