#!/usr/bin/env python3
"""Filters cleanup 2026-08-05 — execute the plan, ONE case at a time.
Rule 50: after every write, re-GET and compare EVERY field. The intended fields must be
byte-equal to the intended payload; every other field must be byte-identical to the
pre-write snapshot. Any mismatch = the write FAILED -> stop the batch immediately."""
import json, sys, time
sys.path.insert(0, '/tmp/clean')
from tr import api, verify

PRE = json.load(open('/tmp/clean/snap/PRE2-cases.json'))
PLAN = json.load(open('/tmp/clean/plan2.json'))
LOG = '/tmp/clean/exec-log-pass2.jsonl'
DONE = '/tmp/clean/done2.json'

try:
    done = json.load(open(DONE))
except Exception:
    done = {}

order = sorted(PLAN, key=int)
log = open(LOG, 'a')
for i, cid in enumerate(order, 1):
    if cid in done:
        print(f'[{i}/{len(order)}] C{cid} already done, skipping')
        continue
    intended = PLAN[cid]
    snap = PRE[cid]
    s, resp = api(f'update_case/{cid}', intended)
    rec = {'op': i, 'case': f'C{cid}', 'fields': sorted(intended), 'http': s}
    if s != 200:
        rec['result'] = 'HTTP FAILURE'
        rec['body'] = resp
        log.write(json.dumps(rec) + '\n'); log.flush()
        print(f'[{i}] C{cid} -> HTTP {s} FAILED: {str(resp)[:400]}')
        sys.exit(2)
    time.sleep(0.3)
    s2, live = api(f'get_case/{cid}')
    if s2 != 200:
        rec['result'] = 'RE-GET FAILED'
        log.write(json.dumps(rec) + '\n'); log.flush()
        print(f'[{i}] C{cid} re-GET -> {s2}')
        sys.exit(2)
    ok, probs, nfields = verify(live, snap, intended)
    rec['fields_compared'] = nfields
    rec['result'] = 'MATCH - byte-verified' if ok else 'MISMATCH'
    if not ok:
        rec['problems'] = probs
        log.write(json.dumps(rec) + '\n'); log.flush()
        print(f'[{i}] C{cid} MISMATCH -> the write FAILED. Stopping the batch.')
        print(json.dumps(probs, indent=1)[:4000])
        sys.exit(3)
    log.write(json.dumps(rec) + '\n'); log.flush()
    done[cid] = {'http': s, 'fields': sorted(intended), 'compared': nfields}
    json.dump(done, open(DONE, 'w'), indent=1)
    print(f'[{i}/{len(order)}] C{cid} -> 200, MATCH, {nfields} fields compared')

print('\nALL DONE:', len(done), 'cases')
