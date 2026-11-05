#!/usr/bin/env python3
"""Session preflight for the Dashboard bug hunt (5 Nov 2026). SECRET-FREE: reads the cookie files in /tmp/cln
(chmod 600), prints ONLY host, HTTP status and app version. Run this first; every live area needs both 200s.
  sv11839 (QA branch): /tmp/cln/qa11839/cookies.json  -> https://sv11839api.qa.shopview.com/api/auth/me/fe-permissions
  staging:             /tmp/cln/cookies.json          -> https://api.staging.shopview.com/api/auth/me/fe-permissions
A 302 to sleep.qa.shopview.com = branch asleep (wake: playbook "More sv11839 recipes, 5 Nov").
A 401 sso_required = the Google-SSO session has expired; only the QA lead can mint new cookies (playbook §A, line ~211)."""
import json, subprocess, re, datetime as dt
def hdr(path):
    j = json.load(open(path)); items = j if isinstance(j, list) else j.get('cookies', j)
    if isinstance(items, dict): items = [{'name': k, 'value': v} for k, v in items.items()]
    return '; '.join(f"{c['name']}={c['value']}" for c in items)
def code(url, cookie=None):
    cmd = ['curl', '-sS', '-4', '-o', '/dev/null', '-w', '%{http_code} %{redirect_url}', '-H', 'Accept: application/json', url]
    if cookie: cmd[1:1] = ['-H', 'Cookie: ' + cookie]
    return subprocess.run(cmd, capture_output=True, text=True, timeout=60).stdout.strip()
def version(app):
    html = subprocess.run(['curl', '-sS', '-4', app], capture_output=True, text=True, timeout=60).stdout
    m = re.search(r'app-version" content="([^"]+)"', html); return m.group(1) if m else None
print('at_utc', dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'))
for name, f, api, app in [('sv11839', '/tmp/cln/qa11839/cookies.json', 'https://sv11839api.qa.shopview.com', 'https://sv11839.qa.shopview.com/'),
                          ('staging', '/tmp/cln/cookies.json', 'https://api.staging.shopview.com', 'https://app.staging.shopview.com/')]:
    try: c = hdr(f)
    except Exception as e: print(name, 'cookie file unreadable:', type(e).__name__); continue
    print(name, 'version', version(app), '| fe-permissions', code(api + '/api/auth/me/fe-permissions', c))
