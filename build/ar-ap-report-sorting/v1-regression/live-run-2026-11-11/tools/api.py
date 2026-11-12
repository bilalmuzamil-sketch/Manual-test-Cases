"""Tiny API client for the live run. Secrets are read from /tmp only and never printed.
QA: the QA lead's cookies (/tmp/qa/cookie-header.txt). STAGING: /tmp/staging/cookie-header.txt.
PROD: PHPSESSID (/tmp/prod/session.json). Never calls any login / quick-login / logout endpoint.
WRITE LOCK: while /tmp/<env>/NO-WRITES exists every non-GET call to that env is refused (used to keep
staging read-only while its "before the feature" snapshot is being taken; delete the file to seed)."""
import json, os, ssl, urllib.request, urllib.error, sys
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
BASE = {'qa': 'https://sv11315api.qa.shopview.com', 'staging': 'https://api.staging.shopview.com',
        'prod': 'https://api.shopview.com'}
ORIGIN = {'qa': 'https://sv11315.qa.shopview.com', 'staging': 'https://app.staging.shopview.com',
          'prod': 'https://app.shopview.com'}
APP = ORIGIN
def _cookie(env):
    if env in ('qa', 'staging'):
        return open(f'/tmp/{env}/cookie-header.txt').read().strip()
    return 'PHPSESSID=' + json.load(open('/tmp/prod/session.json'))['PHPSESSID']
FORBIDDEN = ('/login', 'quick-login', 'logout', 'change-location')
def call(env, path, method='GET', body=None, allow_change_location=False):
    if any(f in path for f in FORBIDDEN) and not (allow_change_location and 'change-location' in path):
        raise SystemExit(f'refused forbidden path {path}')
    if method != 'GET' and os.path.exists(f'/tmp/{env}/NO-WRITES'):
        raise SystemExit(f'refused {method} {path}: /tmp/{env}/NO-WRITES is present (read-only hold)')
    url = BASE[env] + path
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method=method, headers={
        'Cookie': _cookie(env), 'Accept': 'application/json', 'Content-Type': 'application/json',
        'Origin': ORIGIN[env]})
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
def workplaces(env):
    """{workplace_id: {name, timezone, shop_id, country_code}} as the app itself reads them
    (GET staff/my-workplaces - app/src/api/auth/index.ts:64, used by services/location.ts:68-79)."""
    r = call(env, '/api/staff/my-workplaces')
    if r['status'] != 200: raise SystemExit(f'my-workplaces on {env}: HTTP {r["status"]}')
    d = r['json'].get('data', r['json']) if isinstance(r['json'], dict) else r['json']
    coll = d.get('collection', d) if isinstance(d, dict) else d
    return {w['id']: {'name': w.get('name'), 'timezone': w.get('timezone'), 'shop_id': w.get('shop_id'),
                      'country_code': w.get('country_code')} for w in coll}
if __name__ == '__main__':
    env, path = sys.argv[1], sys.argv[2]
    r = call(env, path)
    print(r['status']); print(json.dumps(r['json'], indent=1)[:int(sys.argv[3]) if len(sys.argv) > 3 else 1500])
