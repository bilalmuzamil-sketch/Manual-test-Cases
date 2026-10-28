"""Shared helpers for the W2 report checks. SECRET-FREE: the session cookie is read from /tmp by
collect_dashboard.curl; nothing secret is printed or written under the repo."""
import json, os, sys, datetime as dt
from urllib.parse import urlencode
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/w2/sess-w2.txt').read().strip()   # this worker's own session (never printed)
from collect_dashboard import curl, WORKPLACES, ranges
from collect_reports import instants
RAW = '/tmp/cln/w2'
os.makedirs(RAW, exist_ok=True)
WID = {n: w for w, n, t in WORKPLACES}
TZ = {w: t for w, n, t in WORKPLACES}
NAME = {w: n for w, n, t in WORKPLACES}

def loc(wid):
    return curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]})

def get(path, params, wid):
    q = urlencode(params, doseq=True) if params else ''
    return curl('GET', path + ('?' + q if q else ''), extra_headers={'X-Location-ID': wid})

def win(wid, label):
    today = dt.datetime.now(ZoneInfo(TZ[wid])).date()
    f, t = ranges(today)[label]
    s, e = instants(f, t, TZ[wid])
    return f, t, s, e
