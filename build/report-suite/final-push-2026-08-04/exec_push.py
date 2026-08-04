#!/usr/bin/env python3
"""
Report Suite FINAL PUSH 2026-08-04 — the executor.

STANDING RULE 50 — EXHAUSTIVE then EXACT.  Per operation:
  1. pre-write snapshot of EVERY field (from plan.json, taken read-only before the run)
  2. re-GET the case IMMEDIATELY BEFORE writing and prove it still matches the snapshot
     byte-for-byte (nobody else moved it under us)
  3. update_case with ONLY the intended fields
  4. re-GET and compare FIELD BY FIELD:
       - every INTENDED field byte-equal to the intended value
       - every OTHER field byte-identical to the pre-write snapshot
  5. a MISMATCH means THE WRITE FAILED -> stop the batch, dump BOTH byte sequences,
     do not retry blindly.

DECLARED NORMALISATION (the only one, proven and recorded in APP-ACTIONS-PLAYBOOK §J):
  TestRail's `refs` splits on commas, trims each entry, rejoins with a bare comma.
  So `refs` is compared under  ','.join(p.strip() for p in s.split(','))  and that is
  declared explicitly in the log.  Our house style is one comma-free entry <= 248 chars,
  so in practice this is the identity; the guard is kept because a silent write failure
  and an undeclared normalisation are indistinguishable without it.

Rule 38: the executor REFUSES to touch any case not created by us (created_by != 3),
and hard-refuses the five known foreign case ids outright.

Usage:  python3 exec_push.py --batch 25 [--limit N] [--dry-run]
"""
import json, os, sys, time, argparse, base64, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
CREDS = json.load(open('/tmp/testrail/creds.json'))
SECRET = CREDS.get('password') or CREDS.get('key')
HOST = CREDS['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(f"{CREDS['email']}:{SECRET}".encode()).decode()

# Rule 38 — Vladimir Tomovic's cases. NEVER written, in any circumstance.
FOREIGN = {38919, 38920, 38921, 38922, 38923}

# fields that legitimately move on any write and are therefore excluded from the
# "untouched must be byte-identical" comparison
VOLATILE = {'updated_on', 'updated_by'}


def api(path, body=None, method=None):
    url = f'{HOST}/index.php?/api/v2/{path}'
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method or ('POST' if body else 'GET'),
                                headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                return r.status, json.loads(r.read().decode() or '{}')
        except urllib.error.HTTPError as e:
            txt = e.read().decode()
            if e.code in (429, 502, 503, 504) and attempt < 3:
                time.sleep(2 ** attempt * 2)
                continue
            try:
                return e.code, json.loads(txt)
            except Exception:
                return e.code, {'error': txt}
        except Exception as e:
            if attempt < 3:
                time.sleep(2 ** attempt * 2)
                continue
            return 0, {'error': str(e)}
    return 0, {'error': 'exhausted'}


def norm_refs(s):
    """The DECLARED TestRail refs normalisation (see module docstring)."""
    return ','.join(p.strip() for p in (s or '').split(','))


def cmp_field(field, got, want):
    """Return None if equal (under the declared normalisation), else a reason."""
    if field == 'refs':
        if norm_refs(got) == norm_refs(want):
            return None
        return 'refs differ under the declared normalisation'
    if got == want:
        return None
    return 'byte mismatch'


def dump(a, b, label_a, label_b):
    out = []
    sa = a if isinstance(a, str) else repr(a)
    sb = b if isinstance(b, str) else repr(b)
    out.append(f'      {label_a} ({len(sa)} chars): {sa!r}')
    out.append(f'      {label_b} ({len(sb)} chars): {sb!r}')
    # first differing byte offset
    for i, (x, y) in enumerate(zip(sa, sb)):
        if x != y:
            out.append(f'      first difference at offset {i}: {x!r} vs {y!r}')
            break
    else:
        if len(sa) != len(sb):
            out.append(f'      identical up to {min(len(sa),len(sb))}; lengths differ')
    return '\n'.join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--batch', type=int, default=25)
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    plan = json.load(open(os.path.join(HERE, os.environ.get('PLAN','plan.json'))))
    logp = os.path.join(HERE, os.environ.get('LOG','exec-log.jsonl'))
    done = set()
    if os.path.exists(logp):
        for line in open(logp):
            r = json.loads(line)
            if r.get('verify') == 'MATCH':
                done.add(r['case_id'])
    todo = [p for p in plan if p['case_id'] not in done]
    if args.limit:
        todo = todo[:args.limit]
    print(f'plan {len(plan)} · already verified {len(done)} · this run {len(todo)}')

    log = open(logp, 'a')
    ok = 0
    for n, p in enumerate(todo, 1):
        cid = p['case_id']
        if cid in FOREIGN:
            raise SystemExit(f'FATAL Rule 38: plan contains foreign case C{cid}')
        snap, intended = p['snapshot'], p['intended']

        # ---- step 2: prove the live case still matches the pre-write snapshot ----
        st, live = api(f'get_case/{cid}')
        if st != 200:
            print(f'  [{n}/{len(todo)}] C{cid} PRE-GET HTTP {st} — STOPPING')
            log.write(json.dumps({'case_id': cid, 'op': 'pre_get', 'http': st,
                                  'verify': 'FAIL', 'detail': live}) + '\n')
            log.flush()
            raise SystemExit(f'STOPPED: pre-write re-GET of C{cid} returned HTTP {st}')
        if live.get('created_by') != 3:
            raise SystemExit(f'FATAL Rule 38: C{cid} created_by={live.get("created_by")} is not ours')
        drift = []
        for f, v in snap.items():
            r = cmp_field(f, live.get(f), v)
            if r:
                drift.append((f, r, live.get(f), v))
        if drift:
            print(f'  [{n}/{len(todo)}] C{cid} DRIFTED since the snapshot — STOPPING')
            for f, r, g, w in drift:
                print(f'    {f}: {r}')
                print(dump(g, w, 'live now', 'snapshot'))
            log.write(json.dumps({'case_id': cid, 'op': 'pre_get', 'http': 200,
                                  'verify': 'FAIL-DRIFT',
                                  'fields': [d[0] for d in drift]}) + '\n')
            log.flush()
            raise SystemExit(f'STOPPED: C{cid} changed between snapshot and write')

        if args.dry_run:
            print(f'  [{n}/{len(todo)}] C{cid} DRY-RUN ok, would write {sorted(intended)}')
            continue

        # ---- step 3: the write ----
        st, res = api(f'update_case/{cid}', intended)
        if st != 200:
            print(f'  [{n}/{len(todo)}] C{cid} update_case HTTP {st} — STOPPING')
            print('    ', json.dumps(res)[:600])
            log.write(json.dumps({'case_id': cid, 'op': 'update_case', 'http': st,
                                  'verify': 'FAIL', 'detail': res,
                                  'fields': sorted(intended)}) + '\n')
            log.flush()
            raise SystemExit(f'STOPPED: update_case C{cid} returned HTTP {st}')

        # ---- step 4: re-GET and verify field by field ----
        st2, after = api(f'get_case/{cid}')
        if st2 != 200:
            raise SystemExit(f'STOPPED: post-write re-GET of C{cid} returned HTTP {st2}')
        bad = []
        for f, want in intended.items():                       # intended must match
            r = cmp_field(f, after.get(f), want)
            if r:
                bad.append(('INTENDED', f, r, after.get(f), want))
        for f, was in snap.items():                            # untouched must be identical
            if f in intended:
                continue
            r = cmp_field(f, after.get(f), was)
            if r:
                bad.append(('UNTOUCHED', f, r, after.get(f), was))
        for f, was in live.items():                            # nothing else moved either
            if f in intended or f in VOLATILE or f in snap:
                continue
            r = cmp_field(f, after.get(f), was)
            if r:
                bad.append(('COLLATERAL', f, r, after.get(f), was))
        if bad:
            print(f'  [{n}/{len(todo)}] C{cid} VERIFY FAILED — THE WRITE FAILED. STOPPING.')
            for kind, f, r, g, w in bad:
                print(f'    {kind} {f}: {r}')
                print(dump(g, w, 'live after write', 'intended/snapshot'))
            log.write(json.dumps({'case_id': cid, 'op': 'update_case', 'http': 200,
                                  'verify': 'FAIL', 'bad': [[k, f, r] for k, f, r, _, _ in bad],
                                  'fields': sorted(intended)}) + '\n')
            log.flush()
            raise SystemExit(f'STOPPED: byte-level verification failed on C{cid}')

        ok += 1
        log.write(json.dumps({
            'case_id': cid, 'op': 'update_case', 'http': 200, 'verify': 'MATCH',
            'fields': sorted(intended), 'layers': p['layers'], 'held': p['held'],
            'report': p['internal_report'],
            'intended_checked': len(intended),
            'untouched_checked': len([f for f in snap if f not in intended]),
            'refs_normalisation': 'declared: comma-split/trim/rejoin' if 'refs' in intended else None,
            'ts': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        }) + '\n')
        log.flush()
        if n % 25 == 0 or n == len(todo):
            print(f'  [{n}/{len(todo)}] verified MATCH — {ok} written this run')
        if args.batch and n % args.batch == 0:
            print(f'  --- batch boundary at {n} ---')
    log.close()
    print(f'DONE: {ok} writes, all verified MATCH')


if __name__ == '__main__':
    main()
