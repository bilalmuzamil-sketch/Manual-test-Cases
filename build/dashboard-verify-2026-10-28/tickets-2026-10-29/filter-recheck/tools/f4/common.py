"""Worker F4 (filter recheck) helpers. SECRET-FREE: the cookie is read from /tmp/cln/f4/sess.txt (this worker's own session), never printed."""
import json, os, sys, datetime as dt
from urllib.parse import urlencode
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/f4/sess.txt').read().strip()
from collect_dashboard import curl, WORKPLACES
RAW = '/tmp/cln/f4'; os.makedirs(RAW, exist_ok=True)
WID = {'hd': 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'leth': 'f8a8b802-7780-4b16-bf10-343caeb616b2',
       'qb': '25a0d576-b371-4b82-bef4-41ba977f31c2', 'dvi': '39522bc6-abca-4f67-bd12-2840043c2d68'}
TZ = {w: t for w, n, t in WORKPLACES}
NAME = {w: n for w, n, t in WORKPLACES}
def loc(wid):
    s, j = curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]})
    return s
def get(path, params, wid):
    return curl('GET', path + ('?' + urlencode(params) if params else ''), extra_headers={'X-Location-ID': wid})
def asof(day, tz):
    e = dt.datetime.combine(day, dt.time(23, 59, 59, 999000), ZoneInfo(tz)).astimezone(dt.timezone.utc)
    return e.strftime('%Y-%m-%dT%H:%M:%S.') + f'{e.microsecond // 1000:03d}Z'
def zones(wid):
    return {'location_tz': TZ[wid], 'process_TZ': os.environ.get('TZ'), 'process_zone': str(dt.datetime.now().astimezone().tzinfo),
            'process_now': dt.datetime.now().isoformat(), 'utc_now': dt.datetime.now(dt.timezone.utc).isoformat()}
