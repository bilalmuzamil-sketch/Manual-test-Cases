#!/usr/bin/env python3
"""finish4 writer — Rule-54 sentence-2 re-stamps on the cases THIS pass walked end to end,
plus ONE step correction on C38886.

BUILD: v3.7-20e801b, marker read from index.html by this worker at 15:30:10Z
(last-modified Wed 12 Aug 2026 12:09:14 GMT, etag 82eedf656263a3228c8865356eed8379,
index.html sha256 157756e3...). Confirmed identical to the marker finish3 recorded.

SENTENCE 1 IS NEVER TOUCHED. It names documents only; putting a build into it is exactly what
Rule 54's 2026-08-05 amendment forbids.

TWO sentence-2 forms exist among these cases and BOTH are handled by REPLACEMENT, never by
appending:
  * 7 cases carry 'Last checked against build <x> on <date>.'
  * C43560 carries 'This test has not yet been checked against any build.' -- appending would
    leave the case saying both that it has never been checked AND that it was checked today.

THE ONE STEP CORRECTION (C38886 step 2). The step says 'move to the next page of results'.
There is NO pagination in this build: the table is a Quasar virtual scroll and advancing through
results is done by scrolling (proven in probeP8 -- 17+ new work orders revealed, search
retained, every visible row still matching). Spec S13-R14 says the query 'survives sorting,
pagination', but NOTHING in the spec requires the table to be paginated, so the absent pager is
not a Filters defect -- only the step is unrunnable as written. Corrected to the MINIMUM that
makes it executable. The EXPECTATION IS NOT TOUCHED (it is spec-sourced) and the wording
divergence is reported instead.

Discipline (Rules 50/29/65):
  * all three text fields on every payload -- update_case re-renders any text field it is not
    given, and this project shows markup literally to the tester
  * every payload is PRINTED and reviewed before anything is sent (dry-run first)
  * each replacement must match EXACTLY ONCE or the case is skipped and reported
  * re-GET and byte-compare EVERY field; ANY mismatch STOPS the batch
  * fields we did not intend to change are proven byte-identical to the pre-write snapshot
  * the per-operation log is written AS EACH WRITE HAPPENS, not at the end
  * custom_atmstatus is captured AT WRITE TIME (the flag moves both ways)
  * an HTTP error is never blind-retried -- the case is READ BACK, because a 500 can come back
    from a write that landed
"""
import sys, json, os, re, datetime, argparse

sys.path.insert(0, '/tmp')
from trlib import tr

BUILD = 'v3.7-20e801b'
NEW2 = f'Last checked against build {BUILD} on 12 August 2026.'
PAT_LAST = re.compile(r'Last checked against build [^\n]*?\.(?=\s|$)')
PAT_NOTYET = re.compile(r'This test has not yet been checked against any build\.')

OUT = '/home/user/Manual-test-Cases/build/filters/finish4-2026-08-12'
LOG = os.path.join(OUT, 'evidence', 'write-oplog.json')
PRE = json.load(open('/tmp/testrail/f4/filters-cases-PRE.json'))
BY = {c['id']: c for c in PRE}

# Cases this pass walked END TO END. Nothing else is touched.
#
# DELIBERATELY EXCLUDED, and the reason matters: C29614 and C43560 are NOT stamped, because they
# were NOT completed. Both depend on a saved filter being RESTORED when the page loads, and that
# behaviour is exactly what probeP9 could not settle -- the app fetches the stored preference
# (HTTP 200 on its own request) and the chips never show it, which CONTRADICTS finish3's
# observation on this same build. Stamping "last checked against v3.7-20e801b" on a case we could
# not finish would assert a check we did not complete (Rule 12).
WALKED = [29568, 29569, 29594, 29626, 38886, 43561]

# The single step correction, as an EXACT string swap so it cannot match loosely.
STEP_FIX = {
    38886: ('2. Sort the table by a column, then move to the next page of results.',
            '2. Sort the table by a column, then scroll down through the results to see more.')
}


def restamp(exp):
    """Replace sentence 2. Returns (new_text, how) or (None, why)."""
    n_last, n_not = len(PAT_LAST.findall(exp)), len(PAT_NOTYET.findall(exp))
    if n_last + n_not == 0:
        return None, 'no sentence-2 found at all -- insertion point not determinable, skipped'
    if n_last + n_not > 1:
        return None, f'{n_last + n_not} sentence-2 candidates -- ambiguous, skipped'
    if n_last == 1:
        return PAT_LAST.sub(lambda m: NEW2, exp, count=1), 'replaced (Last checked...)'
    return PAT_NOTYET.sub(lambda m: NEW2, exp, count=1), 'replaced (has not yet been checked...)'


def build_payload(cid):
    c = BY[cid]
    exp, steps = c.get('custom_expected') or '', c.get('custom_steps') or ''
    new_exp, how = restamp(exp)
    if new_exp is None:
        return None, how, None
    new_steps, step_note = steps, None
    if cid in STEP_FIX:
        old, new = STEP_FIX[cid]
        if steps.count(old) != 1:
            return None, f'step-fix anchor matched {steps.count(old)} times, expected exactly 1', None
        new_steps = steps.replace(old, new)
        step_note = 'step 2 corrected: next page -> scroll down'
    payload = {'custom_preconds': c.get('custom_preconds') or '',
               'custom_steps': new_steps,
               'custom_expected': new_exp}
    return payload, how, step_note


ap = argparse.ArgumentParser()
ap.add_argument('--execute', action='store_true')
args = ap.parse_args()

plans = []
for cid in WALKED:
    payload, how, step_note = build_payload(cid)
    plans.append({'cid': cid, 'payload': payload, 'how': how, 'step_note': step_note,
                  'atm': BY[cid].get('custom_atmstatus'), 'title': BY[cid].get('title')})

# ---------------------------------------------------------------- DRY RUN: print and read them
print('=' * 100)
print(f'PLANNED WRITES: {sum(1 for p in plans if p["payload"])} of {len(plans)}   build={BUILD}')
print('=' * 100)
for p in plans:
    print(f'\n--- C{p["cid"]}  atm={p["atm"]}  how={p["how"]}')
    print(f'    {p["title"]}')
    if not p['payload']:
        print('    *** SKIPPED ***')
        continue
    if p['step_note']:
        print(f'    STEP CHANGE: {p["step_note"]}')
        for ln in p['payload']['custom_steps'].split('\n'):
            print(f'      | {ln}')
    tail = p['payload']['custom_expected'][-260:].replace('\n', ' | ')
    print(f'    EXPECTED TAIL: ...{tail}')
    # prove sentence 2 appears exactly once and names this build
    print(f'    sentence-2 count = {p["payload"]["custom_expected"].count(NEW2)}'
          f'   old-build mentions = {len(PAT_LAST.findall(p["payload"]["custom_expected"])) - 1}'
          f'   notyet remaining = {len(PAT_NOTYET.findall(p["payload"]["custom_expected"]))}')

if not args.execute:
    print('\nDRY RUN ONLY -- nothing sent. Re-run with --execute to write.')
    sys.exit(0)

# ---------------------------------------------------------------- EXECUTE
ops = []


def flush():
    json.dump({'build': BUILD, 'written_at_utc': datetime.datetime.utcnow().isoformat() + 'Z',
               'planned': len(plans), 'ops': ops}, open(LOG, 'w'), indent=1)


stopped = None
for i, p in enumerate(plans, 1):
    cid, payload = p['cid'], p['payload']
    if not payload:
        ops.append({'n': i, 'case': cid, 'action': 'SKIPPED', 'reason': p['how'],
                    'custom_atmstatus_at_write_time': p['atm']})
        flush()
        continue
    before = tr(f'get_case/{cid}')
    op = {'n': i, 'case': cid, 'action': 'update_case', 'how': p['how'],
          'step_correction': p['step_note'],
          'custom_atmstatus_at_write_time': before.get('custom_atmstatus'),
          'title': before.get('title'),
          'started_utc': datetime.datetime.utcnow().isoformat() + 'Z'}
    ops.append(op)
    flush()                                     # written BEFORE the write (R1)

    try:
        tr(f'update_case/{cid}', payload)
        op['http'] = 200
    except Exception as e:
        op['http'] = 'error'
        op['error'] = str(e)[:300]
        flush()
        after = tr(f'get_case/{cid}')            # a 500 can come from a write that LANDED
        op['read_back_after_error_matches'] = (after.get('custom_expected') == payload['custom_expected'])
        flush()
        stopped = f'C{cid}: {op["error"]}'
        break

    after = tr(f'get_case/{cid}')
    keys = set(list(before.keys()) + list(after.keys()))
    intended, collateral = [], []
    for k in keys:
        if k in ('updated_on', 'updated_by'):
            continue
        want = payload[k] if k in payload else before.get(k)
        got = after.get(k)
        if got != want:
            (intended if k in payload else collateral).append(
                {'field': k, 'want': repr(want)[:200], 'got': repr(got)[:200]})
    op['fields_compared'] = len(keys) - 2
    op['intended_mismatches'] = intended
    op['collateral_changes'] = collateral
    op['verified'] = not intended and not collateral
    op['finished_utc'] = datetime.datetime.utcnow().isoformat() + 'Z'
    flush()
    if not op['verified']:
        stopped = f'C{cid}: BYTE-CHECK FAILED {json.dumps(intended + collateral)[:400]}'
        break
    print(f'[{i}/{len(plans)}] C{cid} {p["how"]} verified ({op["fields_compared"]} fields)', flush=True)

summary = {'planned': len(plans),
           'written_verified': sum(1 for o in ops if o.get('action') == 'update_case' and o.get('verified')),
           'skipped': sum(1 for o in ops if o.get('action') == 'SKIPPED'),
           'stopped_early': stopped}
ops.append({'SUMMARY': summary})
flush()
print(json.dumps(summary, indent=1))
if stopped:
    sys.exit(1)
