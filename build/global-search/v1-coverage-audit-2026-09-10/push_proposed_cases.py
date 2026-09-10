#!/usr/bin/env python3
"""Push the proposed V1-regression cases into TestRail section 6769.

STANDING RULE 6: TestRail is the only real production system. This script REFUSES
to run without --confirm, which stands for the QA lead's explicit per-ask permission.
Reads credentials from /tmp/testrail/creds.json (never hard-coded, never committed).
Writes a per-case audit log (Rule 50): operation, C-id, HTTP status, read-back check.
"""
import json, sys, base64, urllib.request, urllib.error, time, datetime, os

HERE = os.path.dirname(os.path.abspath(__file__))
if '--confirm' not in sys.argv:
    print(__doc__)
    print("REFUSING TO RUN: no --confirm flag. Nothing was sent to TestRail.")
    sys.exit(2)

C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['login_password']}".encode()).decode()
HOST = C['host']

def call(path, payload=None):
    url = f"{HOST}/index.php?/api/v2/{path}"           # '&' separators only, never a second '?'
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers={
        'Authorization': f'Basic {AUTH}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as f:
        return f.status, json.loads(f.read().decode())

cases = json.load(open(f'{HERE}/proposed-cases.json'))
log = []
print(f"Pushing {len(cases)} cases into section 6769 ...")
for c in cases:
    payload = {k: v for k, v in c.items() if k not in ('gap', 'section_id')}
    payload['template_id'] = 1
    payload['type_id'] = 1
    try:
        status, body = call(f"add_case/{c['section_id']}", payload)
        cid = body.get('id')
        # Rule 50: verify by reading the case back, not by trusting "200 OK"
        vstatus, vbody = call(f"get_case/{cid}")
        ok = vbody.get('title') == c['title']
        log.append({'gap': c['gap'], 'case_id': cid, 'http': status,
                    'readback_http': vstatus, 'verified_title_match': ok})
        print(f"  [{c['gap']:>4}] C{cid} HTTP {status} readback {vstatus} verified={ok}")
    except urllib.error.HTTPError as e:
        log.append({'gap': c['gap'], 'error': e.code, 'body': e.read().decode()[:200]})
        print(f"  [{c['gap']:>4}] FAILED HTTP {e.code}")
    time.sleep(0.3)

stamp = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H%M%SZ')
out = f'{HERE}/push-audit-{stamp}.json'
json.dump(log, open(out, 'w'), indent=1)
print(f"\nAudit log: {out}")
print("REMINDER: new cases must be added to the V2 test run (Rule 34, union-only).")
