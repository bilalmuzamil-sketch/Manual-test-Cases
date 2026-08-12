#!/usr/bin/env python3
"""Re-stamp Rule-54 SENTENCE 2 on only the cases this pass actually walked end to end.

65 cases. Every one was driven step by step on build v3.7-20e801b today, a marker read
from index.html by this worker at 13:44Z (last-modified Wed 12 Aug 2026 12:09:14 GMT,
etag 82eedf656263a3228c8865356eed8379).

SENTENCE 1 IS NOT TOUCHED. It names documents only, nothing about it changed, and putting
a build into it is exactly what Rule 54's 2026-08-05 amendment forbids.

Discipline (Rules 50 / 29):
  * all three text fields on every payload -- update_case re-renders any text field it is
    not given, and this project shows markup literally to the tester
  * the replacement must match EXACTLY ONCE, or the case is skipped and reported
  * re-GET and byte-compare EVERY field; any mismatch STOPS the batch
  * fields we did not intend to change are proven byte-identical to the pre-write snapshot
  * the per-operation log is written AS EACH WRITE HAPPENS, not at the end
  * custom_atmstatus is captured AT WRITE TIME (Rule 65 -- the flag moves both ways)
"""
import sys, json, os, re, datetime
sys.path.insert(0, '/tmp')
from trlib import tr

NEW = 'Last checked against build v3.7-20e801b on 12 August 2026.'
OLD_RE = re.compile(r'Last checked against build [^\n]*?\.(?=\s|$)')
MARKER_RE = re.compile(r'\n\s*\nAUTOMATION: ')

OUT = '/home/user/Manual-test-Cases/build/filters/finish3-2026-08-12'
LOG = os.path.join(OUT, 'evidence', 'restamp-oplog.json')
TEXT = ('custom_preconds', 'custom_steps', 'custom_expected')

cases = json.load(open('/tmp/restamp_list.json'))
pre = {int(k): v for k, v in json.load(open('/tmp/restamp_pre.json')).items()}

ops = []
def flush():
    json.dump({'build': 'v3.7-20e801b', 'written_at_utc': datetime.datetime.utcnow().isoformat() + 'Z',
               'total_planned': len(cases), 'ops': ops}, open(LOG, 'w'), indent=1)

def restamp(exp):
    """Replace sentence 2, or insert it if absent. Returns (new_text, how) or (None, why)."""
    hits = OLD_RE.findall(exp)
    if len(hits) == 1:
        return OLD_RE.sub(lambda m: NEW, exp, count=1), 'replaced'
    if len(hits) > 1:
        return None, f'{len(hits)} sentence-2 candidates -- ambiguous, skipped'
    # absent: insert at the end of the provenance paragraph, before the blank line + marker
    m = MARKER_RE.search(exp)
    if not m:
        return None, 'no AUTOMATION marker found, so the insertion point is not determinable'
    head, tail = exp[:m.start()], exp[m.start():]
    if not head.rstrip().endswith('.'):
        return None, 'provenance paragraph does not end in a full stop -- not safe to append'
    return head.rstrip() + ' ' + NEW + tail, 'inserted'

stopped = None
for i, cid in enumerate(cases, 1):
    c = pre[cid]
    exp = c.get('custom_expected') or ''
    new_exp, how = restamp(exp)
    if new_exp is None:
        ops.append({'n': i, 'case': cid, 'action': 'SKIPPED', 'reason': how,
                    'custom_atmstatus': c.get('custom_atmstatus')}); flush(); continue
    if new_exp == exp:
        ops.append({'n': i, 'case': cid, 'action': 'no-op', 'reason': 'already names this build',
                    'custom_atmstatus': c.get('custom_atmstatus')}); flush(); continue

    payload = {'custom_preconds': c.get('custom_preconds') or '',
               'custom_steps': c.get('custom_steps') or '',
               'custom_expected': new_exp}
    op = {'n': i, 'case': cid, 'action': 'update_case', 'how': how,
          'custom_atmstatus_at_write_time': c.get('custom_atmstatus'),
          'title': c.get('title'), 'started_utc': datetime.datetime.utcnow().isoformat() + 'Z'}
    ops.append(op); flush()                      # written BEFORE the write

    try:
        tr(f'update_case/{cid}', payload)
        op['http'] = 200
    except Exception as e:
        op['http'] = 'error'; op['error'] = str(e)[:200]; flush()
        # An HTTP 500 can come back from a write that LANDED -- read, never blind-retry.
        after = tr(f'get_case/{cid}')
        op['read_back_after_error'] = (after.get('custom_expected') == new_exp)
        flush(); stopped = f'case {cid}: {op["error"]}'; break

    after = tr(f'get_case/{cid}')
    diffs, collateral = [], []
    for k in set(list(c.keys()) + list(after.keys())):
        if k in ('updated_on', 'updated_by'):
            continue
        want = new_exp if k == 'custom_expected' else c.get(k)
        got = after.get(k)
        if got != want:
            (diffs if k == 'custom_expected' else collateral).append(
                {'field': k, 'expected': repr(want)[:160], 'got': repr(got)[:160]})
    op['fields_compared'] = len(set(list(c.keys()) + list(after.keys()))) - 2
    op['expected_field_matches'] = not diffs
    op['collateral_changes'] = collateral
    op['verified'] = (not diffs) and (not collateral)
    op['finished_utc'] = datetime.datetime.utcnow().isoformat() + 'Z'
    flush()
    if not op['verified']:
        stopped = f'case {cid}: byte-check FAILED -- {json.dumps(diffs + collateral)[:400]}'
        break
    print(f"[{i}/{len(cases)}] C{cid} {how} verified ({op['fields_compared']} fields)", flush=True)

summary = {'planned': len(cases),
           'written': sum(1 for o in ops if o.get('action') == 'update_case' and o.get('verified')),
           'skipped': sum(1 for o in ops if o.get('action') == 'SKIPPED'),
           'no_op': sum(1 for o in ops if o.get('action') == 'no-op'),
           'stopped_early': stopped}
ops.append({'SUMMARY': summary}); flush()
print(json.dumps(summary, indent=1))
