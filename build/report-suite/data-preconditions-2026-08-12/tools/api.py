"""Shared read-only API client for the Report Suite QA branch.

GET-only by construction: `get()` refuses any method other than GET, so a probe
cannot mutate the branch by accident.  Seeding, when it happens, goes through
`post()` which is explicit and logged.
"""
import json, urllib.request, urllib.error, urllib.parse, time, sys

CK = open('/tmp/qa-cookies/reports-cookie-header.txt').read().strip()
API = 'https://sv8582api.qa.shopview.com'
APP = 'https://sv8582.qa.shopview.com'

CALLS = {'GET': 0, 'POST': 0}


def _req(path, method='GET', body=None, timeout=90):
    url = API + path if path.startswith('/') else path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers={
        'Cookie': CK, 'Accept': 'application/json',
        'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0',
    }, method=method)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                raw = r.read().decode()
                return r.status, (json.loads(raw) if raw.strip() else None)
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode()[:400]
        except Exception as e:
            if attempt < 2:
                time.sleep(3)
                continue
            return -1, str(e)[:300]


def get(path, **kw):
    CALLS['GET'] += 1
    return _req(path, 'GET', None, **kw)


def post(path, body, **kw):
    """Explicit mutation. Every caller must be intentional about using this."""
    CALLS['POST'] += 1
    return _req(path, 'POST', body, **kw)


def q(**kw):
    """Build a query string with TestRail-style bracket params preserved."""
    parts = []
    for k, v in kw.items():
        if v is None:
            continue
        parts.append(urllib.parse.quote(k, safe='[]') + '=' + urllib.parse.quote(str(v), safe=''))
    return '&'.join(parts)


PAG = 'pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D={n}&pagination%5BsortBy%5D={s}&pagination%5Bdescending%5D={d}'


def report(name, start, end, rows=30, sort=None, desc='false', extra=''):
    """Fetch a report. WIP takes from/to ISO instants; the other five take range/start/end."""
    sorts = {'sbc': 'customer', 'sbr': 'rep_name', 'pv': 'demand',
             'tu': 'technician', 'iv': 'total_cost', 'wip': 'days_open'}
    s = sort or sorts[name]
    pg = PAG.format(n=rows, s=s, d=desc)
    if name == 'wip':
        frm = urllib.parse.quote(f'{start}T00:00:00.000Z', safe='')
        to = urllib.parse.quote(f'{end}T23:59:59.999Z', safe='')
        p = f'/api/reporting/reports/work-in-progress?from={frm}&to={to}&{extra}{pg}'
    else:
        paths = {'sbc': 'sales-by-customer', 'sbr': 'sales-by-representative',
                 'pv': 'parts-velocity', 'tu': 'technician-utilization',
                 'iv': 'inventory-value'}
        base = f'/api/reporting/reports/{paths[name]}?range=custom&start_date={start}&end_date={end}'
        p = f'{base}&{extra}{pg}'
    return get(p)


def rowsof(body):
    """Reports nest their collection differently; normalise, and NEVER silently
    return [] for a shape we did not recognise -- raise so a probe cannot report
    'no data' when it simply failed to find the list."""
    if not isinstance(body, dict):
        raise ValueError(f'not a dict: {type(body)}')
    d = body.get('data', body)
    if isinstance(d, list):
        return d
    for k in ('collection', 'items', 'rows', 'data', 'results'):
        if isinstance(d, dict) and isinstance(d.get(k), list):
            return d[k]
    raise ValueError(f'unrecognised shape, keys={list(d.keys()) if isinstance(d,dict) else type(d)}')
