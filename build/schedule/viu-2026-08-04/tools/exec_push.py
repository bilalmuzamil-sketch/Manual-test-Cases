#!/usr/bin/env python3
"""EXECUTOR for the 2026-08-04 Schedule live VIU - update_case ONLY.

STANDING RULE 50 - EXHAUSTIVE then EXACT.  Per operation:
  1. re-GET the case and prove it still byte-matches the pre-write snapshot
  2. update_case with ONLY the intended field(s)
  3. re-GET and compare EVERY field: each intended field byte-equal to the intended
     value, and every OTHER field byte-identical to the pre-write snapshot
  4. a MISMATCH means THE WRITE FAILED -> stop the batch and dump both byte sequences

DECLARED NORMALISATION (the only one, recorded in APP-ACTIONS-PLAYBOOK §J): TestRail's
`refs` splits on commas, trims each entry and rejoins with a bare comma.  This pass does
not write refs; the comparison honours the normalisation anyway.

Rule 38: refuses any case not created by us (created_by != 3).
"""
import json, os, sys, time, base64, urllib.request, urllib.error, argparse

CREDS = json.load(open('/tmp/testrail/creds.json'))
SECRET = CREDS.get('password') or CREDS.get('key')
HOST = CREDS['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(f"{CREDS['email']}:{SECRET}".encode()).decode()
VOLATILE = {'updated_on', 'updated_by'}
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
LOG = os.path.join(ROOT, 'exec-log.jsonl')
SNAP = os.path.join(ROOT, 'snapshots', 'pre-write-cases.json')


def api(path, body=None, method=None):
    url = f'{HOST}/index.php?/api/v2/{path}'
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method or ('POST' if body else 'GET'),
                                headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
    for a in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.status, json.loads(r.read().decode() or '{}')
        except urllib.error.HTTPError as e:
            t = e.read().decode()
            if e.code in (429, 502, 503, 504) and a < 3:
                time.sleep(2 ** a * 2); continue
            try:
                return e.code, json.loads(t)
            except Exception:
                return e.code, {'error': t}
        except Exception as ex:
            if a < 3:
                time.sleep(2 ** a * 2); continue
            return 0, {'error': str(ex)}


def norm_refs(s):
    return ','.join(p.strip() for p in (s or '').split(','))


def eq(field, a, b):
    if field == 'refs':
        return norm_refs(a) == norm_refs(b)
    return a == b


def verify(live, snap, intended):
    probs = []
    keys = set(live) | set(snap)
    for k in sorted(keys):
        if k in VOLATILE:
            continue
        got = live.get(k)
        if k in intended:
            if not eq(k, got, intended[k]):
                probs.append({'field': k, 'kind': 'intended value not written',
                              'want': repr(intended[k]), 'got': repr(got)})
        else:
            if not eq(k, got, snap.get(k)):
                probs.append({'field': k, 'kind': 'UNINTENDED CHANGE',
                              'was': repr(snap.get(k)), 'got': repr(got)})
    return (not probs), probs, len(keys - VOLATILE)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--start', type=int, default=0)
    ap.add_argument('--count', type=int, default=20)
    ap.add_argument('--snapshot-only', action='store_true')
    a = ap.parse_args()
    plan = json.load(open(os.path.join(ROOT, 'plan.json')))

    if a.snapshot_only or not os.path.exists(SNAP):
        snaps = {}
        for p in plan:
            s, c = api(f"get_case/{p['case_id']}")
            if s != 200:
                print('SNAPSHOT FAILED', p['case_id'], s, c); sys.exit(1)
            if c.get('created_by') != 3:
                print('REFUSING - foreign case', p['case_id'], c.get('created_by')); sys.exit(1)
            snaps[str(p['case_id'])] = c
        json.dump(snaps, open(SNAP, 'w'), indent=1)
        print('pre-write snapshot written:', len(snaps), 'cases, all created_by 3')
        if a.snapshot_only:
            return
    snaps = json.load(open(SNAP))

    batch = [p for p in plan if p['changed']][a.start:a.start + a.count]
    ok = 0
    with open(LOG, 'a') as lf:
        for p in batch:
            cid = p['case_id']; snap = snaps[str(cid)]; intended = p['intended']
            s0, pre = api(f'get_case/{cid}')
            if s0 != 200:
                print('PRE-GET FAILED', cid, s0); sys.exit(1)
            drift = [k for k in set(pre) | set(snap)
                     if k not in VOLATILE and not eq(k, pre.get(k), snap.get(k))]
            if drift:
                print('PRE-WRITE DRIFT on', cid, drift); sys.exit(1)
            s1, res = api(f'update_case/{cid}', intended)
            if s1 != 200:
                print('WRITE FAILED', cid, s1, json.dumps(res)[:400]); sys.exit(1)
            s2, live = api(f'get_case/{cid}')
            good, probs, n = verify(live, snap, intended)
            rec = {'op': 'update_case', 'case_id': cid, 'internal_id': p['internal_id'],
                   'verdict': p['verdict'], 'http': s1, 'fields_compared': n,
                   'verified': 'MATCH' if good else 'MISMATCH', 'problems': probs}
            lf.write(json.dumps(rec) + '\n'); lf.flush()
            if not good:
                print('BYTE MISMATCH - THE WRITE FAILED for', cid)
                print(json.dumps(probs, indent=1)[:3000]); sys.exit(1)
            ok += 1
            print(f"  {p['internal_id']:16s} C{cid} {p['verdict']:8s} 200 MATCH ({n} fields compared)")
    print(f'batch done: {ok}/{len(batch)} verified MATCH')


if __name__ == '__main__':
    main()
