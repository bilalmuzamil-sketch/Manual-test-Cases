#!/usr/bin/env python3
"""Re-stamp Rule-54 sentence 2 on ONLY the cases this pass actually walked end to end.

Ten cases. Each was driven step by step on build v3.6-3e9dd6d today; each still
names v3.4.2-d00239b, a build from 5 August. Sentence 1 (the SOURCE sentence) is
NOT touched -- it names documents only, and nothing about it changed.

Discipline:
  * all three text fields on every payload (this project renders raw markup to the
    tester, and update_case re-renders any text field omitted from the payload)
  * the replacement must match EXACTLY ONCE or the case is skipped
  * re-GET and byte-compare every field; any mismatch STOPS the batch
  * fields we did not intend to change are proven byte-identical to the pre-write snapshot
  * the per-operation log is written AS EACH WRITE HAPPENS, not at the end
"""
import sys, json, datetime, os
sys.path.insert(0, '/tmp')
from trlib import tr

OLD = "Last checked against build v3.4.2-d00239b on 8/5/2026."
NEW = "Last checked against build v3.6-3e9dd6d on 12 August 2026."
CASES = [29601, 29603, 29628, 38877, 38879, 38893, 38896, 38898, 38900, 38902]
OUT = '/home/user/Manual-test-Cases/build/filters/finish2-2026-08-12/evidence'
LOG = os.path.join(OUT, 'restamp-oplog.json')
TEXT = ('custom_preconds', 'custom_steps', 'custom_expected')

ops = []
def flush():
    with open(LOG, 'w') as f:
        json.dump({'written_at_utc': datetime.datetime.utcnow().isoformat() + 'Z', 'ops': ops}, f, indent=1)

pre = {}
for cid in CASES:
    pre[cid] = tr(f'get_case/{cid}')
json.dump({'read_at_utc': datetime.datetime.utcnow().isoformat() + 'Z', 'pre': pre},
          open(os.path.join(OUT, 'restamp-PRE.json'), 'w'), indent=1)

for cid in CASES:
    c = pre[cid]
    exp = c.get('custom_expected') or ''
    n = exp.count(OLD)
    if n != 1:
        ops.append({'case': cid, 'action': 'SKIPPED', 'reason': f'old build line occurs {n} times, expected exactly 1'})
        flush(); print(f'C{cid} SKIP ({n} matches)'); continue
    payload = {'custom_preconds': c.get('custom_preconds') or '',
               'custom_steps': c.get('custom_steps') or '',
               'custom_expected': exp.replace(OLD, NEW)}
    ops.append({'case': cid, 'action': 'ABOUT_TO_WRITE', 'at': datetime.datetime.utcnow().isoformat() + 'Z',
                'atm_status_at_write_time': c.get('custom_atmstatus'), 'fields': list(payload)})
    flush()
    r = tr(f'update_case/{cid}', payload)
    post = tr(f'get_case/{cid}')

    # byte-compare EVERY field
    mism, coll = [], []
    for k in sorted(set(list(c.keys()) + list(post.keys()))):
        if k in ('updated_on', 'updated_by'):
            continue
        want = payload[k] if k in payload else c.get(k)
        got = post.get(k)
        if want != got:
            (mism if k in payload else coll).append(
                {'field': k, 'intended': repr(want)[:160], 'stored': repr(got)[:160]})
    nfields = len(set(list(c.keys()) + list(post.keys())))
    ok = not mism and not coll
    ops[-1] = {'case': cid, 'action': 'update_case', 'at': datetime.datetime.utcnow().isoformat() + 'Z',
               'http': 'ok' if isinstance(r, dict) and r.get('id') == cid else 'UNEXPECTED',
               'fields_compared': nfields, 'mismatches': mism, 'collateral_changes': coll,
               'verdict': 'MATCH' if ok else 'MISMATCH',
               'atm_status_at_write_time': c.get('custom_atmstatus'),
               'build_line_now': NEW if NEW in (post.get('custom_expected') or '') else 'NOT FOUND'}
    flush()
    print(f"C{cid} {'MATCH' if ok else 'MISMATCH'} ({nfields} fields) atm={c.get('custom_atmstatus')}")
    if not ok:
        print('STOPPING BATCH -- Rule 50: a mismatch means the write failed.')
        print(json.dumps({'mismatches': mism, 'collateral': coll}, indent=1)[:1500])
        sys.exit(1)

print('\nDONE:', sum(1 for o in ops if o.get('verdict') == 'MATCH'), 'written and byte-verified')
