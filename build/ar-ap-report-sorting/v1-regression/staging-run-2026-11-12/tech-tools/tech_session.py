#!/usr/bin/env python3
"""Tech user for V1R-32 / V1R-53 / V1R-87 on staging - approved by the QA lead 12 Nov 2026 (relayed by the coordinator).
    python3 tech_session.py role <role_id> <label>   # change tech's role with the QA lead's session, read back
    python3 tech_session.py signin                   # tech's OWN session: quick-login {key:'tech'} sent with ONLY
                                                     # sv_sso_session + cf_clearance (never the QA lead's PHPSESSID)
    python3 tech_session.py restore                  # back to tech-before-staging.json, compared field by field
After every sign-in the QA lead's session is re-checked (GET /api/iam/view-profile/ -> must be 200).
Endpoints from the front end (Rule 115): POST quick-login + GET auth/me/fe-permissions (app/src/api/auth/index.ts:106-112),
GET staff/{id}/view + enrolled-workplaces, POST staff/{id}/change (the QA recipe ../../live-run-2026-11-11/unblock-2026-11-11/tools/ops.py).
Secrets go to /tmp/staging-tech only (chmod 600) and are never printed. Per-op log: ../tech-oplog.jsonl"""
import datetime, json, os, ssl, sys, urllib.request, urllib.error
HERE = os.path.dirname(os.path.abspath(__file__)); RUNDIR = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RUNDIR, '..', 'live-run-2026-11-11', 'tools'))
from api import call
TECH = 'd2cb20a6-90a8-4884-ac50-022ff2fb9313'; API = 'https://api.staging.shopview.com/api/'; ORIGIN = 'https://app.staging.shopview.com'
BEFORE = json.load(open(os.path.join(RUNDIR, '..', 'live-run-2026-11-11', 'staging-seed-2026-11-12', 'tech-before-staging.json')))
LOG = os.path.join(RUNDIR, 'tech-oplog.jsonl'); JAR = '/tmp/staging-tech'
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
def now(): return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
def log(op, status, verification, **kw):
    rec = {'utc': now(), 'op': op, 'target': 'tech@shopview.com', 'http': status, 'verification': verification, **kw}
    open(LOG, 'a').write(json.dumps(rec) + '\n'); print(json.dumps(rec)[:400])
def lead_ok():
    s = call('staging', '/api/iam/view-profile/')['status']; log("re-check QA lead's session", s, 'OK' if s == 200 else 'PROBLEM'); return s == 200
def view():
    v = call('staging', f'/api/staff/{TECH}/view')['json']['data']['collection']
    e = call('staging', f'/api/staff/{TECH}/enrolled-workplaces')['json']; e = e.get('data', e); e = e.get('collection', e) if isinstance(e, dict) else e
    return v, sorted((w.get('id') or w.get('workplace_id')) for w in e)
def role(role_id, label):
    v0, _ = view(); lr = BEFORE.get('list_row', {})
    body = {'first_name': BEFORE['first_name'], 'last_name': BEFORE['last_name'], 'email': 'tech@shopview.com', 'role_id': role_id,
            'workplace_id': lr.get('default_workplace') or lr.get('defaultWorkplace') or BEFORE.get('default_workplace'), 'job_title': lr.get('job_title'),
            'salary_type': lr.get('salary_type'), 'salary': lr.get('salary'), 'billable': lr.get('billable'),
            'clockable': lr.get('clockable'), 'is_sales_rep': lr.get('is_sales_rep')}
    r = call('staging', f'/api/staff/{TECH}/change', 'POST', body)
    v1, enr = view(); before_enr = sorted(w[1] for w in BEFORE['enrolled_workplaces'])
    ok = v1['role_id'] == role_id and enr == before_enr and len(v1['departments']) == len(BEFORE['departments'])
    log('set_tech_role', r['status'], f"{v0['role_name']} -> {v1['role_name']} ({label}); role_id {'OK' if v1['role_id'] == role_id else 'MISMATCH'}; "
        f"enrolments unchanged={enr == before_enr}; departments {len(v1['departments'])}/{len(BEFORE['departments'])} {'OK' if ok else 'CHECK'}",
        from_role=v0['role_id'], to_role=role_id, response=r['raw'][:200] if r['status'] not in (200, 201) else None)
    return ok
def signin():
    c = json.load(open('/tmp/staging/cookies.json'))
    jar = {k: c[k] for k in ('sv_sso_session', 'cf_clearance') if k in c}
    req = urllib.request.Request(API + 'quick-login', data=json.dumps({'key': 'tech'}).encode(), method='POST', headers={
        'Cookie': '; '.join(f'{k}={v}' for k, v in jar.items()), 'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': ORIGIN})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=60) as r: st = r.status; raw = r.read().decode(); sc = r.headers.get_all('Set-Cookie') or []
    except urllib.error.HTTPError as e: st = e.code; raw = e.read().decode(errors='replace'); sc = []
    sess = next((h.split(';')[0].split('=', 1)[1] for h in sc if h.startswith('PHPSESSID=')), None)
    if st != 200 or not sess:
        log('quick-login tech', st, 'FAILED (no tech session)'); lead_ok(); return False
    os.makedirs(JAR, mode=0o700, exist_ok=True)
    jar['PHPSESSID'] = sess
    def w(n, s): p = os.path.join(JAR, n); open(p, 'w').write(s); os.chmod(p, 0o600)
    w('cookies.json', json.dumps(jar)); w('cookie-header.txt', '; '.join(f'{k}={v}' for k, v in jar.items())); w('login-resp.json', raw)
    req = urllib.request.Request(API + 'auth/me/fe-permissions', headers={'Cookie': '; '.join(f'{k}={v}' for k, v in jar.items()), 'Accept': 'application/json', 'Origin': ORIGIN})
    with urllib.request.urlopen(req, context=CTX, timeout=60) as r: perms = json.loads(r.read().decode())
    w('fe-perms.json', json.dumps(perms))
    who = (json.loads(raw).get('data') or {}).get('details', {}).get('email')
    codes = sorted({p.get('code') if isinstance(p, dict) else str(p) for p in ((perms.get('data') or {}).get('permissions') or perms.get('data') or [])} - {None}) if isinstance(perms, dict) else []
    log('quick-login tech (own jar)', st, f'signed in as {who}; fe-permissions read ({len(codes)} codes)', codes=codes[:40])
    return lead_ok()
def restore():
    ok = role(BEFORE['role_id'], 'RESTORE to tech-before-staging.json')
    v1, enr = view()
    same = {'role_id': v1['role_id'] == BEFORE['role_id'], 'enrolments': enr == sorted(w[1] for w in BEFORE['enrolled_workplaces']),
            'departments': sorted(json.dumps(d, sort_keys=True) for d in v1['departments']) == sorted(json.dumps(d, sort_keys=True) for d in BEFORE['departments']),
            'name': (v1['first_name'], v1['last_name']) == (BEFORE['first_name'], BEFORE['last_name'])}
    log('read_back_restore', 200, f"role {v1['role_name']}; {same}; {'IDENTICAL' if all(same.values()) else 'DIFFERS'}")
    return all(same.values())
if __name__ == '__main__':
    cmd = sys.argv[1]
    r = {'role': lambda: role(sys.argv[2], sys.argv[3]), 'signin': signin, 'restore': restore}[cmd]()
    sys.exit(0 if r else 1)
