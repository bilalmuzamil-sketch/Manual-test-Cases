#!/usr/bin/env python3
"""
Standing Rule 54 provenance retrofit — the EXECUTOR.

STANDING RULE 50 — EXHAUSTIVE then EXACT.  Per operation:
  1. pre-write snapshot of EVERY field (from plan.json, taken read-only before the run)
  2. re-GET the case IMMEDIATELY BEFORE writing and prove it still matches that
     snapshot byte-for-byte (nobody moved it under us)
  3. update_case with ONLY the intended fields
  4. re-GET and compare FIELD BY FIELD:
       - every INTENDED field byte-equal to the intended value
       - every OTHER field byte-identical to the pre-write snapshot
       - every field outside the snapshot byte-identical to the pre-write live read
  5. a MISMATCH means THE WRITE FAILED -> stop the batch, dump BOTH byte sequences,
     do not retry blindly.

DECLARED NORMALISATION (the only one, recorded in APP-ACTIONS-PLAYBOOK §J):
  TestRail's `refs` splits on commas, trims each entry, rejoins with a bare comma,
  and rejects any single entry over 248 chars with HTTP 400
  "Field :refs does not match the required pattern."
  So `refs` is compared under  ','.join(p.strip() for p in s.split(','))  and that is
  declared explicitly here and in the audit log.

Rule 38: refuses to touch any case not created by us (created_by != 3).
`update_case` ONLY — no add_case, no delete_case, no section move, no run write.

usage: python3 exec_push.py <project> [--batch 25] [--limit N] [--dry-run]
"""
import json, os, sys, time, argparse, base64, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
CREDS = json.load(open('/tmp/testrail/creds.json'))
SECRET = CREDS.get('password') or CREDS.get('key')
HOST = CREDS['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(f"{CREDS['email']}:{SECRET}".encode()).decode()

GROUP = {'schedule': 4254, 'filters': 4110}
EXPECTED = {'schedule': 165, 'filters': 110}
# fields that legitimately move on any write, excluded from the untouched comparison
VOLATILE = {'updated_on', 'updated_by'}


def api(path, body=None, method=None):
    url = f'{HOST}/index.php?/api/v2/{path}'
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method or ('POST' if body else 'GET'),
                                headers={'Authorization': AUTH,
                                         'Content-Type': 'application/json'})
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
    """The DECLARED TestRail refs normalisation (see the module docstring)."""
    return ','.join(p.strip() for p in (s or '').split(','))


def cmp_field(field, got, want):
    if field == 'refs':
        return None if norm_refs(got) == norm_refs(want) else \
            'refs differ under the declared normalisation'
    return None if got == want else 'byte mismatch'


def dump(a, b, la, lb):
    sa = a if isinstance(a, str) else repr(a)
    sb = b if isinstance(b, str) else repr(b)
    out = [f'      {la} ({len(sa)} chars): {sa!r}',
           f'      {lb} ({len(sb)} chars): {sb!r}']
    for i, (x, y) in enumerate(zip(sa, sb)):
        if x != y:
            out.append(f'      first difference at offset {i}: {x!r} vs {y!r}')
            break
    else:
        if len(sa) != len(sb):
            out.append(f'      identical to {min(len(sa), len(sb))}; lengths differ')
    return '\n'.join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project', choices=('schedule', 'filters'))
    ap.add_argument('--batch', type=int, default=25)
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    plan = json.load(open(os.path.join(HERE, '..', 'plan.json')))
    assert len(plan) == EXPECTED[args.project], \
        f'plan has {len(plan)} entries, expected {EXPECTED[args.project]}'
    logp = os.path.join(HERE, '..', 'exec-log.jsonl')
    done = set()
    if os.path.exists(logp):
        for line in open(logp):
            r = json.loads(line)
            if r.get('verify') == 'MATCH':
                done.add(r['case_id'])
    todo = [p for p in plan if p['case_id'] not in done]
    if args.limit:
        todo = todo[:args.limit]
    print(f'{args.project}: plan {len(plan)} · already verified {len(done)} · '
          f'this run {len(todo)}')

    log = open(logp, 'a')
    ok = 0
    for n, p in enumerate(todo, 1):
        cid = p['case_id']
        snap, intended = p['snapshot'], p['intended']

        # ---- step 2: prove the live case still matches the pre-write snapshot ----
        st, live = api(f'get_case/{cid}')
        if st != 200:
            log.write(json.dumps({'case_id': cid, 'op': 'pre_get', 'http': st,
                                  'verify': 'FAIL', 'detail': live}) + '\n'); log.flush()
            raise SystemExit(f'STOPPED: pre-write re-GET of C{cid} returned HTTP {st}')
        if live.get('created_by') != 3:
            raise SystemExit(f'FATAL Rule 38: C{cid} created_by='
                             f'{live.get("created_by")} is not ours')
        drift = [(f, r, live.get(f), v) for f, v in snap.items()
                 if (r := cmp_field(f, live.get(f), v))]
        if drift:
            print(f'  [{n}/{len(todo)}] C{cid} DRIFTED since the snapshot — STOPPING')
            for f, r, g, w in drift:
                print(f'    {f}: {r}'); print(dump(g, w, 'live now', 'snapshot'))
            log.write(json.dumps({'case_id': cid, 'op': 'pre_get', 'http': 200,
                                  'verify': 'FAIL-DRIFT',
                                  'fields': [d[0] for d in drift]}) + '\n'); log.flush()
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
                                  'fields': sorted(intended)}) + '\n'); log.flush()
            raise SystemExit(f'STOPPED: update_case C{cid} returned HTTP {st}')

        # ---- step 4: re-GET and verify field by field ----
        st2, after = api(f'get_case/{cid}')
        if st2 != 200:
            raise SystemExit(f'STOPPED: post-write re-GET of C{cid} HTTP {st2}')
        bad = []
        for f, want in intended.items():                    # intended must match
            if r := cmp_field(f, after.get(f), want):
                bad.append(('INTENDED', f, r, after.get(f), want))
        for f, was in snap.items():                         # untouched byte-identical
            if f in intended:
                continue
            if r := cmp_field(f, after.get(f), was):
                bad.append(('UNTOUCHED', f, r, after.get(f), was))
        for f, was in live.items():                         # nothing else moved either
            if f in intended or f in VOLATILE or f in snap:
                continue
            if r := cmp_field(f, after.get(f), was):
                bad.append(('COLLATERAL', f, r, after.get(f), was))
        if bad:
            print(f'  [{n}/{len(todo)}] C{cid} VERIFY FAILED — THE WRITE FAILED. STOPPING.')
            for kind, f, r, g, w in bad:
                print(f'    {kind} {f}: {r}')
                print(dump(g, w, 'live after write', 'intended/snapshot'))
            log.write(json.dumps({'case_id': cid, 'op': 'update_case', 'http': 200,
                                  'verify': 'FAIL',
                                  'bad': [[k, f, r] for k, f, r, _, _ in bad],
                                  'fields': sorted(intended)}) + '\n'); log.flush()
            raise SystemExit(f'STOPPED: byte verification failed on C{cid}')

        nfields = len(set(snap) | set(live) | set(intended)) - len(VOLATILE & set(live))
        log.write(json.dumps({
            'case_id': cid, 'op': 'update_case', 'http': 200, 'verify': 'MATCH',
            'kind': p['kind'], 'fields_written': sorted(intended),
            'fields_compared': nfields,
            'refs_normalisation_applied': 'refs' in intended,
        }) + '\n'); log.flush()
        ok += 1
        print(f'  [{n}/{len(todo)}] C{cid} 200 · MATCH · wrote {sorted(intended)} · '
              f'{nfields} fields compared')
        if ok % args.batch == 0:
            print(f'  --- batch checkpoint: {ok} verified this run ---')
    print(f'\ndone: {ok} written and byte-verified this run')


if __name__ == '__main__':
    main()
