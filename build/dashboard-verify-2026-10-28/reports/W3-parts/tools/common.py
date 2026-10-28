import sys, json, os, datetime as dt, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/w3/sess-admin.txt').read().strip()   # private W3 session (no race with other workers)
from collect_dashboard import curl, WORKPLACES
from collect_reports import instants
from urllib.parse import urlencode
from zoneinfo import ZoneInfo
RAW = '/tmp/cln/dv/w3'
os.makedirs(RAW, exist_ok=True)
TZ = {w: tz for w, _, tz in WORKPLACES}
NAME = {w: n for w, n, _ in WORKPLACES}

def change_loc(wid):
    return curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]})

def ranges(today):
    """Expected calendar boundaries from the PV spec S2-R2 (shared suite presets, week starts Sunday)
    plus SV-11514 'Last 90 Days'."""
    first = today.replace(day=1)
    q0 = dt.date(today.year, 3 * ((today.month - 1) // 3) + 1, 1)
    lq_end = q0 - dt.timedelta(days=1)
    lq0 = dt.date(lq_end.year, 3 * ((lq_end.month - 1) // 3) + 1, 1)
    lm_end = first - dt.timedelta(days=1)
    wk0 = today - dt.timedelta(days=(today.weekday() + 1) % 7)
    return {
        'today': (today, today),
        'yesterday': (today - dt.timedelta(days=1),) * 2,
        'this_week': (wk0, today),
        'last_week': (wk0 - dt.timedelta(days=7), wk0 - dt.timedelta(days=1)),
        'this_month': (first, today),
        'last_month': (lm_end.replace(day=1), lm_end),
        'this_quarter': (q0, today),
        'last_quarter': (lq0, lq_end),
        'this_year': (dt.date(today.year, 1, 1), today),
        'last_year': (dt.date(today.year - 1, 1, 1), dt.date(today.year - 1, 12, 31)),
        'last_90_days': (today - dt.timedelta(days=90), today),
        'custom_366': (today - dt.timedelta(days=365), today),
    }

def pv_all(wid, f, t, typ='both', extra=(), sort='demand', desc=True, per=1000):
    s, e = instants(f, t, TZ[wid if isinstance(wid, str) else wid[-1]])
    rows, page = [], 1
    while True:
        p = [('type', typ), ('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', wid if isinstance(wid, str) else ','.join(wid))] + list(extra) + [
            ('pagination[page]', page), ('pagination[rowsPerPage]', per), ('pagination[sortBy]', sort), ('pagination[descending]', 'true' if desc else 'false')]
        st, j = curl('GET', '/api/reporting/reports/parts-velocity?' + urlencode(p), extra_headers={'X-Location-ID': wid if isinstance(wid, str) else wid[0]})
        if st != 200:
            return st, j, rows
        d = j['data']; rows += d['collection']
        if len(rows) >= d['pagination']['rowsNumber'] or not d['collection']:
            return 200, d['pagination'], rows
        page += 1

def iv_all(wid, day, extra=(), sort='total_cost', desc=True, per=1000):
    s, e = instants(day, day, TZ[wid if isinstance(wid, str) else wid[-1]])
    rows, page = [], 1
    while True:
        p = [('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', wid if isinstance(wid, str) else ','.join(wid))] + list(extra) + [
            ('pagination[page]', page), ('pagination[rowsPerPage]', per), ('pagination[sortBy]', sort), ('pagination[descending]', 'true' if desc else 'false')]
        st, j = curl('GET', '/api/reporting/reports/inventory-value?' + urlencode(p), extra_headers={'X-Location-ID': wid if isinstance(wid, str) else wid[0]})
        if st != 200:
            return st, j, rows, None
        d = j['data']; rows += d['collection']
        if len(rows) >= d['pagination']['rowsNumber'] or not d['collection']:
            return 200, d, rows, d.get('totals')
        page += 1
