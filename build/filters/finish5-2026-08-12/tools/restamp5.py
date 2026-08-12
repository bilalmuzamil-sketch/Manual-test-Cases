#!/usr/bin/env python3
"""Re-stamp Rule-54 SENTENCE 2 on the ONLY two cases this pass completed end to end.

C29614 and C43560 were the two cases finish4 could not close.  Both were driven through
every one of their six steps on build v3.7-20e801b today (evidence/probeR2.json), after
probeR1 settled why finish4's run had read a false negative.  Nothing else is touched:

  * SENTENCE 1 IS NOT TOUCHED — it names documents only, and putting a build into it is
    what Rule 54's 2026-08-05 amendment forbids.
  * NO expectation, step or precondition is changed.
  * NO AUTOMATION marker is changed.  Both already read AUTOMATION: READY.
  * The 14 cases held on Branko are NOT written to at all — their runnability verdict is
    recorded in RUNNABILITY.md, off the case, exactly as the brief requires.

Discipline (Rules 50 / 29 / 65):
  * all three text fields on every payload — update_case re-renders any text field it is
    not given, and this project shows markup literally to the tester
  * the replacement must match EXACTLY ONCE or the case is skipped and reported
  * re-GET and byte-compare EVERY field; any mismatch STOPS the batch
  * fields we did not intend to change are proven byte-identical to the pre-write snapshot
  * the per-operation log is written BEFORE each write, not at the end
  * custom_atmstatus is captured AT WRITE TIME (it moves both ways)
"""
import sys, json, os, re, datetime
sys.path.insert(0, '/tmp')
from trlib import tr

BUILD = 'v3.7-20e801b'
NEW = f'Last checked against build {BUILD} on 12 August 2026.'
# the two shapes sentence 2 can currently take on these two cases
OLD_RE = re.compile(r'(?:Last checked against build [^\n]*?\.'
                    r'|This test has not yet been checked against any build\.)(?=\s|$)')

OUT = '/home/user/Manual-test-Cases/build/filters/finish5-2026-08-12'
LOG = os.path.join(OUT, 'evidence', 'restamp5-oplog.json')
CASES = [29614, 43560]

ops = []
def flush():
    json.dump({'build': BUILD, 'written_at_utc': datetime.datetime.utcnow().isoformat() + 'Z',
               'planned': CASES, 'ops': ops}, open(LOG, 'w'), indent=1)

stopped = None
for i, cid in enumerate(CASES, 1):
    pre = tr(f'get_case/{cid}')                       # the pre-write snapshot
    exp = pre.get('custom_expected') or ''
    hits = OLD_RE.findall(exp)
    if len(hits) != 1:
        ops.append({'n': i, 'case': cid, 'action': 'SKIPPED',
                    'reason': f'{len(hits)} sentence-2 candidates — must be exactly 1',
                    'custom_atmstatus': pre.get('custom_atmstatus')}); flush(); continue
    new_exp = OLD_RE.sub(NEW, exp, count=1)
    if new_exp == exp:
        ops.append({'n': i, 'case': cid, 'action': 'no-op', 'reason': 'already names this build',
                    'custom_atmstatus': pre.get('custom_atmstatus')}); flush(); continue

    payload = {'custom_preconds': pre.get('custom_preconds') or '',
               'custom_steps': pre.get('custom_steps') or '',
               'custom_expected': new_exp}
    op = {'n': i, 'case': cid, 'action': 'update_case', 'title': pre.get('title'),
          'replaced': hits[0], 'with': NEW,
          'custom_atmstatus_at_write_time': pre.get('custom_atmstatus'),
          'started_utc': datetime.datetime.utcnow().isoformat() + 'Z'}
    ops.append(op); flush()                            # WRITTEN BEFORE THE WRITE

    print(f'--- C{cid} payload check ---')
    print('  preconds len', len(payload['custom_preconds']),
          '| steps len', len(payload['custom_steps']),
          '| expected len', len(payload['custom_expected']))
    print('  sentence 2 now:', NEW)

    try:
        tr(f'update_case/{cid}', payload); op['http'] = 200
    except Exception as e:
        op['http'] = 'error'; op['error'] = str(e)[:200]; flush()
        after = tr(f'get_case/{cid}')                  # a 500 can come back from a write that LANDED
        op['read_back_after_error'] = (after.get('custom_expected') == new_exp)
        flush(); stopped = f'C{cid}: {op["error"]}'; break

    after = tr(f'get_case/{cid}')
    diffs, collateral = [], []
    keys = set(list(pre.keys()) + list(after.keys()))
    for k in keys:
        if k in ('updated_on', 'updated_by'):
            continue
        want = new_exp if k == 'custom_expected' else pre.get(k)
        got = after.get(k)
        if got != want:
            (diffs if k == 'custom_expected' else collateral).append(
                {'field': k, 'expected': repr(want)[:200], 'got': repr(got)[:200]})
    op['fields_compared'] = len(keys) - 2
    op['expected_field_matches'] = not diffs
    op['collateral_changes'] = collateral
    op['verified'] = (not diffs) and (not collateral)
    op['finished_utc'] = datetime.datetime.utcnow().isoformat() + 'Z'
    flush()
    if not op['verified']:
        stopped = f'C{cid}: byte-check FAILED — {json.dumps(diffs + collateral)[:500]}'
        break
    print(f'[{i}/{len(CASES)}] C{cid} verified — {op["fields_compared"]} fields, 0 collateral')

summary = {'planned': len(CASES),
           'written': sum(1 for o in ops if o.get('action') == 'update_case' and o.get('verified')),
           'skipped': sum(1 for o in ops if o.get('action') == 'SKIPPED'),
           'no_op': sum(1 for o in ops if o.get('action') == 'no-op'),
           'stopped_early': stopped}
ops.append({'SUMMARY': summary}); flush()
print(json.dumps(summary, indent=1))
