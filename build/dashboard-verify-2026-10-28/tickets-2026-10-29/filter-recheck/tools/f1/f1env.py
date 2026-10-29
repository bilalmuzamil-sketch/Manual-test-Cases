"""Worker F1 (filter recheck, 29 Oct 2026) shared helpers. SECRET-FREE: the cookie is read at run time from
/tmp/cln/f1/sess.txt (own session, minted by mint.mjs in this folder, mode 600) and never printed.
Rule 99: use(key) change-locations THIS session to the location's own zone; every script asserts TZ == that zone."""
import json, os, sys, datetime as dt
from urllib.parse import urlencode, parse_qsl
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/f1/sess.txt').read().strip()
from collect_dashboard import curl  # noqa: E402
from collect_reports import instants  # noqa: E402,F401
LOC = {'HD': ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'),
       'LETH': ('f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton', 'Staging Lethbridge - 4310'),
       'QB': ('25a0d576-b371-4b82-bef4-41ba977f31c2', 'America/Vancouver', 'QB Location'),
       'DVI': ('39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test')}
EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f1'
REQLOG = []


def use(key):
    wid, tz, name = LOC[key]
    assert os.environ.get('TZ') == tz, f'run with TZ={tz}'
    c, _ = curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
    return {'key': key, 'wid': wid, 'tz': tz, 'name': name, 'change_location': c,
            'process_zone': os.environ.get('TZ'), 'location_tz': tz,
            'local_now': dt.datetime.now(ZoneInfo(tz)).isoformat(timespec='seconds')}


def get(path, params, wid):
    """GET with X-Location-ID; params may be a list of pairs or a raw query string (replayed from the screen)."""
    # raw query strings replayed from the screen are re-encoded (curl would read [ ] as glob patterns -> status 0)
    q = urlencode(parse_qsl(params, keep_blank_values=True)) if isinstance(params, str) else urlencode(params or [], doseq=True)
    p = path + ('?' + q if q else '')
    c, b = curl('GET', p, extra_headers={'X-Location-ID': wid})
    REQLOG.append({'GET': p, 'status': c})
    return c, b


def dump(name, obj):
    os.makedirs(EV, exist_ok=True)
    obj = dict(obj); obj['server_requests'] = list(REQLOG)
    json.dump(obj, open(f'{EV}/{name}.json', 'w'), indent=1, default=str)
