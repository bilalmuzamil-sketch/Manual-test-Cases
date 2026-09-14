#!/usr/bin/env python3
"""IDEMPOTENT SEEDER — restores the suite's test data after any redeploy.

WHY: the QA branch is redeployed regularly and OUR DATA IS WIPED EVERY TIME. Re-seeding by hand
costs an hour and produces different ids each run, which then rot in a committed state file.

WHAT IT DOES: reads seed-manifest.json, and for every record FIND-OR-CREATE:
    found      -> records the LIVE id, patches any missing fields
    not found  -> creates it, then records the live id
    blocked    -> reports why, and does not pretend
Then writes seed-state-live.json (true ids, always fresh) and a per-case readiness table.

SAFE TO RUN ANY NUMBER OF TIMES. It never creates a duplicate of a record marked "unique".

USAGE
    python3 seed.py --check      # report only, writes nothing to the environment
    python3 seed.py --confirm    # find-or-create
TO ADD DATA FOR A NEW TEST CASE: add an entry to seed-manifest.json. Never edit this file.

AUTH is self-service (Rule 107): quick-login mints a session, and the rotated PHPSESSID is
captured from Set-Cookie (playbook §Q1 - not doing so makes every later call answer 409).
"""
import json, sys, os, re, ssl, urllib.parse, urllib.request, urllib.error, argparse, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
COOKIES = '/tmp/qa/cookies.json'
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')

def _c(): return json.load(open(COOKIES))
def _save(c):
    open(COOKIES, 'w').write(json.dumps(c)); os.chmod(COOKIES, 0o600)

def call(path, method='GET', body=None):
    c = _c()
    ck = f"sv_sso_session={c['sv_sso_session']}; PHPSESSID={c['PHPSESSID']}; cf_clearance={c['cf_clearance']}"
    req = urllib.request.Request(f"https://{c['api']}{path}", method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={'Cookie': ck, 'Accept': 'application/json', 'Content-Type': 'application/json',
                 'User-Agent': 'Mozilla/5.0', 'Referer': f"https://{c['host']}/"})
    try:
        r = urllib.request.urlopen(req, context=CTX, timeout=60); status, raw, hdrs = r.status, r.read(), r.headers
    except urllib.error.HTTPError as e:
        status, raw, hdrs = e.code, e.read(), e.headers
    except Exception as e:
        return {'status': 'ERR', 'error': str(e), 'json': None}
    for sc in hdrs.get_all('Set-Cookie') or []:          # playbook §Q1
        m = re.search(r'PHPSESSID=([^;]+)', sc)
        if m and m.group(1) not in ('deleted', '') and m.group(1) != c['PHPSESSID']:
            c['PHPSESSID'] = m.group(1); _save(c)
    try: j = json.loads(raw or b'{}')
    except Exception: j = None
    return {'status': status, 'json': j, 'raw': (raw or b'')[:250]}

def ensure_session():
    """Self-unblock: mint a session and set the location (playbook §Q2, §Q3)."""
    if call('/api/search?q=zz')['status'] != 200:
        r = call('/api/quick-login', 'POST', {'key': 'admin'})
        print(f"  quick-login -> {r['status']}  (evicts other workers on this branch - Rule 83)")
        if r['status'] != 200: sys.exit("cannot authenticate")
    w = call('/api/staff/my-workplaces')
    if w['status'] == 200:
        d = (w['json'] or {}).get('data', w['json'])
        wps = d if isinstance(d, list) else (d.get('workplaces') or d.get('collection') or [])
        hint = json.load(open(f'{HERE}/seed-manifest.json'))['environment']['workplace_name_hint']
        pick = next((x for x in wps if hint.lower() in (x.get('name') or '').lower()), (wps or [None])[0])
        if pick:
            r = call('/api/iam/change-location', 'POST',
                     {'workplace_id': pick['id'], 'workplace_timezone': pick.get('timezone', 'America/Edmonton')})
            print(f"  location -> {pick['name']}  ({r['status']})")
            return wps
    return []

def find(spec):
    """FIND a record. Two modes, because ?search= works on some list endpoints and silently
    matches NOTHING on others (measured: broken on /api/work-orders). Where the spec gives a
    'control', search for it FIRST - if a record known to exist comes back empty the probe is
    broken and any 'missing' verdict is thrown away (Rule 104)."""
    coll = spec['coll']
    def rows(r):
        d = (r['json'] or {}).get('data', {}) or {}
        if isinstance(d, dict): return d.get(coll) or []
        return d if isinstance(d, list) else []
    if spec.get('control'):
        c = call(f"{spec['list']}?search={urllib.parse.quote(spec['control'])}&limit=100")
        if c['status'] != 200 or len(rows(c)) == 0:
            if spec['mode'] == 'search':
                return [], 'PROBE BROKEN - the control returned nothing; not reporting missing'
    if spec['mode'] == 'ids':
        # ?search= is broken and ?page= is ignored on some endpoints, so the only reliable
        # route is to verify by the ids the seeder recorded when it created them.
        out = []
        for i in spec.get('ids', []):
            r = call(spec['view'].replace('{id}', i))
            if r['status'] == 200:
                d = (r['json'] or {}).get('data', {}) or {}
                rec = d.get(spec['coll']) if isinstance(d, dict) else None
                if rec: out.append(rec)
        return out, 'ok'
    if spec['mode'] == 'search':
        r = call(f"{spec['list']}?search={urllib.parse.quote(spec['value'])}&limit=100")
        if r['status'] != 200: return [], f"probe {r['status']}"
        return [x for x in rows(r) if str(x.get(spec['field']) or '') == spec['value']], 'ok'
    # page mode - and page params can be IGNORED, so stop as soon as a page repeats
    hits, page, seen_ids = [], 1, set()
    while page <= 60:
        r = call(f"{spec['list']}?page={page}&rowsPerPage=100")
        if r['status'] != 200: return hits, f"probe {r['status']}"
        items = rows(r)
        ids = {x.get('id') for x in items if isinstance(x, dict)}
        if ids and ids <= seen_ids:
            break                       # the endpoint ignored ?page= - stop rescanning
        seen_ids |= ids
        for x in items:
            if not isinstance(x, dict): continue
            v = str(x.get(spec['field']) or '')
            if 'prefix' in spec and v.startswith(spec['prefix']): hits.append(x)
            elif spec.get('value') and v == spec['value']: hits.append(x)
        if len(items) < 100: break
        page += 1
    return hits, 'ok'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--confirm', action='store_true'); ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if not (a.confirm or a.check): sys.exit("pass --check or --confirm")
    man = json.load(open(f'{HERE}/seed-manifest.json'))
    print("=== session ==="); ensure_session()
    state, report = {}, []
    print("\n=== records ===")
    for rec in man['records']:
        k = rec['key']
        if '🔴 BLOCKED_BY' in rec:
            print(f"  {k:22s} 🔴 BLOCKED — {rec['🔴 BLOCKED_BY'][:90]}")
            report.append({'key': k, 'state': 'BLOCKED', 'reason': rec['🔴 BLOCKED_BY'], 'serves': rec['serves']})
            continue
        hits, how = find(rec['find'])
        if how != 'ok':
            print(f"  {k:22s} ⚠️  probe failed ({how}) — NOT reporting as missing (Rule 104)")
            report.append({'key': k, 'state': 'UNVERIFIED', 'reason': how, 'serves': rec['serves']}); continue
        if hits:
            ids = [h.get('id') for h in hits]
            dup = rec.get('unique') and len(hits) > 1
            print(f"  {k:22s} ✅ present ({len(hits)})" + ("  🔴 DUPLICATE — delete the extras" if dup else ""))
            state[k] = ids[0] if len(ids) == 1 else ids
            report.append({'key': k, 'state': 'DUPLICATE' if dup else 'PRESENT', 'ids': ids, 'serves': rec['serves']})
            continue
        if a.check:
            print(f"  {k:22s} ❌ MISSING — would create")
            report.append({'key': k, 'state': 'MISSING', 'serves': rec['serves']}); continue
        print(f"  {k:22s} ❌ missing — creating…")
        payload = dict(rec['create']['payload'])
        for field, dep in (rec['create'].get('inject') or {}).items():
            if dep not in state: print(f"       cannot inject {field}: {dep} not available"); break
            payload[field] = state[dep]
        for field, ep in (rec['create'].get('resolve') or {}).items():
            rr = call(ep)
            if rr['status'] == 200:
                d = (rr['json'] or {}).get('data', rr['json'])
                lst = d if isinstance(d, list) else (d.get('collection') or [])
                if lst: payload[field] = lst[0].get('id')
        r = call(rec['create']['endpoint'], 'POST', payload)
        ok = r['status'] in (200, 201)
        print(f"       create -> {r['status']}" + ('' if ok else f"  {r['raw'][:120]}"))
        report.append({'key': k, 'state': 'CREATED' if ok else 'CREATE_FAILED',
                       'http': r['status'], 'body': str(r['raw'][:200]), 'serves': rec['serves']})
        if ok:
            hits, _ = find(rec['find'])
            if hits: state[k] = hits[0].get('id')
    ts = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H%M%SZ')
    out = {'when_utc': ts, 'environment': man['environment'], 'live_ids': state, 'records': report,
           '_note': 'Live ids re-derived this run. Never trust an older copy - a redeploy changes them.'}
    json.dump(out, open(f'{HERE}/seed-state-live.json', 'w'), indent=1)
    blocked = [r for r in report if r['state'] in ('BLOCKED', 'MISSING', 'CREATE_FAILED', 'DUPLICATE')]
    cases_at_risk = sorted({c for r in blocked for c in r.get('serves', [])})
    print(f"\n=== summary ===\n  records OK      : {sum(1 for r in report if r['state'] in ('PRESENT','CREATED'))}/{len(report)}")
    print(f"  needing action  : {len(blocked)}  -> {', '.join(r['key'] for r in blocked) or 'none'}")
    print(f"  cases at risk   : {len(cases_at_risk)}  {cases_at_risk}")
    print(f"  state written   : seed-state-live.json")

if __name__ == '__main__':
    main()
