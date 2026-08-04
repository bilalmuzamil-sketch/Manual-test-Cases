#!/usr/bin/env python3
"""EXECUTOR for the 2026-08-04 Filters VIU pass — update_case ONLY.

STANDING RULE 50 — EXHAUSTIVE then EXACT.  Per operation:
  1. re-GET the case and prove it still byte-matches the pre-write snapshot
  2. update_case with ONLY the intended fields
  3. re-GET and compare EVERY field:
       - each intended field byte-equal to the intended value
       - every OTHER field byte-identical to the pre-write snapshot (volatile ones excepted)
  4. a MISMATCH means THE WRITE FAILED -> stop the batch, dump both byte sequences.

DECLARED NORMALISATION (the only one, recorded in APP-ACTIONS-PLAYBOOK §J): TestRail's
`refs` splits on commas, trims each entry and rejoins with a bare comma.  This pass does
not write refs, but the comparison honours the normalisation anyway.

Rule 38: refuses any case not created by us (created_by != 3).
"""
import json, os, sys, time, base64, urllib.request, urllib.error, argparse

CREDS = json.load(open('/tmp/testrail/creds.json'))
SECRET = CREDS.get('password') or CREDS.get('key')
HOST = CREDS['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(f"{CREDS['email']}:{SECRET}".encode()).decode()
VOLATILE = {'updated_on', 'updated_by'}
LOG = '/tmp/fviu/exec-log.jsonl'


def api(path, body=None, method=None):
    url = f'{HOST}/index.php?/api/v2/{path}'
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method or ('POST' if body else 'GET'),
                                headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
    for a in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
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


def verify(live, snap, intended, phase):
    """Return (ok, problems, fields_compared)."""
    probs = []
    keys = set(live) | set(snap)
    for k in sorted(keys):
        if k in VOLATILE:
            continue
        got = live.get(k)
        if k in intended:
            want = intended[k]
            if not eq(k, got, want):
                probs.append({'field': k, 'kind': 'intended value not written',
                              'want': repr(want)[:400], 'got': repr(got)[:400]})
        else:
            was = snap.get(k)
            if not eq(k, got, was):
                probs.append({'field': k, 'kind': 'UNINTENDED CHANGE',
                              'was': repr(was)[:400], 'got': repr(got)[:400]})
    return (not probs), probs, len(keys - VOLATILE)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--limit', type=int, default=0)
    a = ap.parse_args()
    plan = [p for p in json.load(open(os.environ.get('PLAN','/tmp/fviu/plan.json'))) if not p['skip']]
    if a.limit:
        plan = plan[:a.limit]
    print('operations planned:', len(plan), '| dry-run' if a.dry_run else '| LIVE')
    done = 0
    log = open(LOG, 'a')
    for i, p in enumerate(plan, 1):
        cid, iid, snap, intended = p['cid'], p['iid'], p['snapshot'], p['intended']
        st, live = api(f'get_case/{cid}')
        if st != 200:
            print(f'{i:3d} {iid} C{cid} PRE-GET FAILED {st} {live}'); sys.exit(2)
        if live.get('created_by') != 3:
            print(f'{i:3d} {iid} C{cid} REFUSED - created_by={live.get("created_by")} (Rule 38)')
            sys.exit(3)
        ok, probs, n = verify(live, snap, {}, 'pre')
        if not ok:
            print(f'{i:3d} {iid} C{cid} PRE-CHECK MISMATCH - the case moved under us:')
            for x in probs:
                print('      ', x)
            sys.exit(4)
        if a.dry_run:
            print(f'{i:3d} {iid} C{cid} would write {sorted(intended)} ({n} fields snapshotted)')
            continue
        st2, resp = api(f'update_case/{cid}', intended)
        if st2 != 200:
            print(f'{i:3d} {iid} C{cid} update_case HTTP {st2} {resp}'); sys.exit(5)
        st3, after = api(f'get_case/{cid}')
        if st3 != 200:
            print(f'{i:3d} {iid} C{cid} POST-GET FAILED {st3}'); sys.exit(6)
        ok, probs, n = verify(after, snap, intended, 'post')
        rec = {'op': i, 'iid': iid, 'cid': cid, 'fields': sorted(intended),
               'http': st2, 'fields_compared': n,
               'verification': 'MATCH' if ok else 'MISMATCH', 'problems': probs}
        log.write(json.dumps(rec) + '\n'); log.flush()
        if not ok:
            print(f'{i:3d} {iid} C{cid} BYTE VERIFICATION FAILED - THE WRITE FAILED. Stopping.')
            for x in probs:
                print('      ', json.dumps(x)[:900])
            sys.exit(7)
        done += 1
        print(f'{i:3d} {iid} C{cid} 200 MATCH ({n} fields compared) {sorted(intended)}')
    print('\nwritten + byte-verified:', done, 'of', len(plan))


if __name__ == '__main__':
    main()
