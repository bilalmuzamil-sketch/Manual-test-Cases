#!/usr/bin/env python3
"""EXECUTOR — Filters re-check 2026-08-05. update_case ONLY, byte-verified per Standing Rule 50.

Per operation:
  1. re-GET the case; prove it still byte-matches the pre-write snapshot (every field)
  2. update_case with ONLY the intended fields
  3. re-GET; compare EVERY field: intended byte-equal to intent, all others byte-identical
     to the pre-write snapshot (only updated_on / updated_by exempt)
  4. a MISMATCH means THE WRITE FAILED -> stop the batch and dump both byte sequences

Declared normalisation (the only one): TestRail's `refs` splits on commas, trims each
entry and rejoins with a bare comma.
Rule 38: refuses any case not created by us (created_by != 3).
"""
import json, sys, time, os
sys.path.insert(0, '/tmp/frc')
import tr

PLAN = json.load(open('/tmp/frc/push/plan.json'))
SNAP = json.load(open('/tmp/frc/snap/live-cases-START.json'))
LOG  = '/tmp/frc/push/exec-log.jsonl'
DONE = '/tmp/frc/push/done.json'
done = json.load(open(DONE)) if os.path.exists(DONE) else {}

def log(rec):
    open(LOG, 'a').write(json.dumps(rec) + '\n')

order = sorted(PLAN, key=lambda c: int(c))
only = sys.argv[1:]
if only:
    order = [c for c in order if c in only]

ok = fail = 0
for cid in order:
    if cid in done:
        continue
    p = PLAN[cid]
    snap = SNAP[cid]
    intended = p['intended']
    if not intended:
        continue

    # Rule 38 guard
    if snap.get('created_by') != 3:
        print(f'C{cid}: REFUSED - not authored by us (created_by={snap.get("created_by")})'); fail += 1; break

    # 1. pre-write re-GET: is the live case still what we snapshotted?
    st, pre = tr.api(f'get_case/{cid}')
    if st != 200:
        print(f'C{cid}: pre-GET HTTP {st} {json.dumps(pre)[:200]}'); fail += 1; break
    drift = []
    for k in sorted(set(pre) | set(snap)):
        if k in tr.VOLATILE:
            continue
        if not tr.eq(k, pre.get(k), snap.get(k)):
            drift.append({'field': k, 'snapshot': repr(snap.get(k))[:600], 'live': repr(pre.get(k))[:600]})
    if drift:
        print(f'C{cid}: STOPPED - the live case has drifted from the pre-write snapshot:')
        print(json.dumps(drift, indent=1)[:2000])
        log({'cid': cid, 'phase': 'pre-check', 'result': 'DRIFT', 'drift': drift}); fail += 1; break

    # 2. write
    st2, resp = tr.api(f'update_case/{cid}', intended)
    if st2 != 200:
        print(f'C{cid}: update_case HTTP {st2} {json.dumps(resp)[:400]}')
        log({'cid': cid, 'phase': 'write', 'http': st2, 'result': 'FAILED', 'body': json.dumps(resp)[:600]}); fail += 1; break

    # 3. post-write re-GET and full field comparison
    st3, post = tr.api(f'get_case/{cid}')
    if st3 != 200:
        print(f'C{cid}: post-GET HTTP {st3}'); fail += 1; break
    good, probs, nfields = tr.verify(post, pre, intended)
    rec = {'cid': cid, 'iid': p['iid'], 'op': 'update_case', 'http': st2,
           'fields_compared': nfields, 'intended_fields': sorted(intended),
           'verification': 'MATCH' if good else 'MISMATCH',
           'actions': p['actions'],
           'reverified_whole_against': 'Filters spec Confluence v18 (body version 1.6), read live 2026-08-05'}
    log(rec)
    if not good:
        print(f'C{cid}: *** VERIFICATION MISMATCH - THE WRITE FAILED. Stopping. ***')
        print(json.dumps(probs, indent=1)[:3000]); fail += 1; break
    # keep the post state as the new baseline for any later op on the same case
    SNAP[cid] = post
    done[cid] = {'http': st2, 'verification': 'MATCH', 'fields_compared': nfields}
    json.dump(done, open(DONE, 'w'))
    ok += 1
    print(f'C{cid} {p["iid"]:<14} 200  MATCH  ({nfields} fields compared)  {", ".join(sorted(intended))}')

print(f'\n--- ops OK: {ok} | failed/stopped: {fail} | total done: {len(done)} / {len(PLAN)} ---')
sys.exit(1 if fail else 0)
