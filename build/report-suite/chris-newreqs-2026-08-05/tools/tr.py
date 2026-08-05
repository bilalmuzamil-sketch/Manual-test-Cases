#!/usr/bin/env python3
"""TestRail client for the 2026-08-05 Filters re-check. Read + byte-verified write."""
import json, base64, time, urllib.request, urllib.error

_C = json.load(open('/tmp/testrail/creds.json'))
_SECRET = _C.get('password') or _C.get('key')
HOST = _C['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(f"{_C['email']}:{_SECRET}".encode()).decode()
VOLATILE = {'updated_on', 'updated_by'}


def api(path, body=None, method=None):
    url = f'{HOST}/index.php?/api/v2/{path}'
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method or ('POST' if body else 'GET'),
                                headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
    for a in range(5):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.status, json.loads(r.read().decode() or '{}')
        except urllib.error.HTTPError as e:
            t = e.read().decode()
            if e.code in (429, 502, 503, 504) and a < 4:
                time.sleep(2 ** a * 2); continue
            try:
                return e.code, json.loads(t)
            except Exception:
                return e.code, {'error': t[:2000]}
        except Exception as ex:
            if a < 4:
                time.sleep(2 ** a * 2); continue
            return 0, {'error': str(ex)}


def paged(path, key):
    out, off = [], 0
    while True:
        sep = '&' if '?' in path else '&'
        s, d = api(f'{path}{sep}limit=250&offset={off}')
        if s != 200:
            raise SystemExit(f'{path} -> {s} {d}')
        chunk = d.get(key, d) if isinstance(d, dict) else d
        out += chunk
        if len(chunk) < 250:
            return out
        off += 250


def norm_refs(s):
    return ','.join(p.strip() for p in (s or '').split(','))


def eq(field, a, b):
    if field == 'refs':
        return norm_refs(a) == norm_refs(b)
    return a == b


def verify(live, snap, intended):
    """Compare EVERY field. intended must be byte-equal; all others byte-identical to snap."""
    probs, keys = [], set(live) | set(snap)
    for k in sorted(keys):
        if k in VOLATILE:
            continue
        got = live.get(k)
        if k in intended:
            if not eq(k, got, intended[k]):
                probs.append({'field': k, 'kind': 'INTENDED VALUE NOT WRITTEN',
                              'want_bytes': repr(intended[k])[:1200], 'got_bytes': repr(got)[:1200]})
        else:
            if not eq(k, got, snap.get(k)):
                probs.append({'field': k, 'kind': 'UNINTENDED CHANGE',
                              'was_bytes': repr(snap.get(k))[:1200], 'got_bytes': repr(got)[:1200]})
    return (not probs), probs, len(keys - VOLATILE)
