#!/usr/bin/env python3
"""Mint a fresh session for the profile named by SEED_PROFILE, from a credential kept in /tmp.

🔴 THE CREDENTIAL NEVER ENTERS THIS REPOSITORY (Rule 82 — it is PUBLIC). It is read from
SEED_LOGIN (default /tmp/prod/login.json), chmod 600, supplied per environment and gone when the
container is. Nothing here is committed but the code.

WHY IT IS A SEPARATE SCRIPT: seed.py recovers from an expired session inside its own call(), which
covers every tool that goes through it. Two do not — verify_ranking.py and status.py carry their
own request code — so the reseed script calls this between a failed step and its one retry. That
way the recovery is uniform across tools rather than implemented three times, slightly differently.

🔴 USE A DEDICATED ACCOUNT. A login expires that user's previous session, so logging in as the QA
lead kills the browser he is working in — which is exactly how three production runs died.

    SEED_PROFILE=/tmp/prod/creds.json python3 relogin.py
"""
import json, os, re, sys, urllib.request, urllib.error

PROFILE = os.environ.get('SEED_PROFILE', '/tmp/prod/creds.json')
LOGIN = os.environ.get('SEED_LOGIN', '/tmp/prod/login.json')

if not os.path.exists(LOGIN):
    sys.exit(f"no credential file at {LOGIN} — nothing to log in with (this is not an error if the "
             f"environment self-heals another way)")
cred = json.load(open(LOGIN))
c = json.load(open(PROFILE)) if os.path.exists(PROFILE) else {}
c.setdefault('host', 'app.shopview.com')
c.setdefault('api', 'api.shopview.com')

req = urllib.request.Request(
    f"https://{c['api']}/api/login",
    data=json.dumps({'username': cred['username'], 'password': cred['password']}).encode(),
    headers={'Content-Type': 'application/json', 'Accept': 'application/json',
             'User-Agent': 'Mozilla/5.0', 'Origin': f"https://{c['host']}",
             'Referer': f"https://{c['host']}/"})
try:
    r = urllib.request.urlopen(req, timeout=45)
    status, hdrs = r.status, r.headers
    r.read()
except urllib.error.HTTPError as e:
    sys.exit(f"login answered {e.code} — the credential in {LOGIN} may be stale")
except Exception as e:
    sys.exit(f"login transport error: {e}")

sid = None
for sc in hdrs.get_all('Set-Cookie') or []:
    m = re.search(r'PHPSESSID=([^;]+)', sc)
    if m and m.group(1) not in ('deleted', ''):
        sid = m.group(1)
if status != 200 or not sid:
    sys.exit(f"login returned {status} with no session cookie")

c.update({'PHPSESSID': sid, 'sv_sso_session': c.get('sv_sso_session') or '',
          'cf_clearance': c.get('cf_clearance') or ''})
json.dump(c, open(PROFILE, 'w'))
os.chmod(PROFILE, 0o600)
print(f"  ↻ session re-minted as {cred['username']}")
