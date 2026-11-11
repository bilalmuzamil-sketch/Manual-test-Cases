"""Tiny API client for the live run. Secrets are read from /tmp only and never printed.
QA: the QA lead's cookies (/tmp/qa/cookie-header.txt). PROD: PHPSESSID (/tmp/prod/session.json).
Never calls any login endpoint."""
import json, ssl, urllib.request, urllib.error, sys
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
BASE = {'qa': 'https://sv11315api.qa.shopview.com', 'prod': 'https://api.shopview.com'}
def _cookie(env):
    if env == 'qa':
        return open('/tmp/qa/cookie-header.txt').read().strip()
    return 'PHPSESSID=' + json.load(open('/tmp/prod/session.json'))['PHPSESSID']
FORBIDDEN = ('/login', 'quick-login', 'change-location')
def call(env, path, method='GET', body=None, allow_change_location=False):
    if any(f in path for f in FORBIDDEN) and not (allow_change_location and 'change-location' in path):
        raise SystemExit(f'refused forbidden path {path}')
    url = BASE[env] + path
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method=method, headers={
        'Cookie': _cookie(env), 'Accept': 'application/json', 'Content-Type': 'application/json',
        'Origin': 'https://sv11315.qa.shopview.com' if env == 'qa' else 'https://app.shopview.com'})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=90) as r:
            raw = r.read().decode(); st = r.status
    except urllib.error.HTTPError as e:
        raw = e.read().decode(errors='replace'); st = e.code
    try: js = json.loads(raw)
    except Exception: js = None
    if st in (401, 409) and 'sso' in raw.lower():
        raise SystemExit(f'SESSION LOST ({st}) on {env} {path} - stop')
    return {'status': st, 'json': js, 'raw': raw[:2000]}
if __name__ == '__main__':
    env, path = sys.argv[1], sys.argv[2]
    r = call(env, path)
    print(r['status']); print(json.dumps(r['json'], indent=1)[:int(sys.argv[3]) if len(sys.argv) > 3 else 1500])
