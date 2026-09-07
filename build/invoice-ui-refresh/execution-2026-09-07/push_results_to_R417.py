"""Write the 7 September 2026 execution results into TestRail run R417.

The QA lead gave explicit permission on 2026-09-07 to write ALL 120 results,
including Failed and Blocked, lifting the usual Passed-only limit on shared runs.

FORMATTING (measured 2026-09-07, playbook section J):
TestRail wraps a submitted result comment in ONE outer <p>, so plain newlines
COLLAPSE and the tester reads a wall of text. Block <p> tags DO render in a result
comment and do NOT show literally (unlike in a case field written via the API), so
every paragraph here is its own <p>. Never emit <br> - that is origin-dependent.
"""
import sys, json
sys.path.insert(0, 'build/testing-tools')
import tr_client as t

STATUS = {'Passed': 1, 'Blocked': 2, 'Failed': 5}
HDR = 'Tested on staging, build v26.35.9-9812433, on 7 September 2026.'

# Plain "what needs to be done" for every case that is not a pass (Rule 7).
TODO = {
 'C44917': 'What needs to be done: nothing for the tester. This is already tracked and the fix is '
           'in Code Review. Run this case again once that fix reaches the build.',
 'C44926': 'What needs to be done: nothing for the tester. This is already tracked and the fix is '
           'in Code Review. Run this case again once that fix reaches the build.',
 'C44935': 'What needs to be done: nothing for the tester. This is already reported and open with '
           'the development team. Run this case again once the fix reaches the build.',
 'C44952': 'What needs to be done: report it to the QA lead. The "Remaining Balance" row the '
           'specification asks for never appears. There is no open ticket for it at the moment, so '
           'do not raise one yourself.',
 'C44970': 'What needs to be done: nothing for the tester. This is already reported and open with '
           'the development team. Run this case again once the fix reaches the build.',
 'C44974': 'What needs to be done: nothing for the tester. The wrong typeface is already reported '
           'and open, both for this environment and for the live one. Run this case again once the '
           'fix reaches the build.',
 'C44902': 'What needs to be done: nothing for the tester. The state this case asks for cannot be '
           'produced in the product - a shop logo can be added or replaced but never removed - so '
           'the case cannot be run as written. It is with the QA lead.',
 'C44907': 'What needs to be done: nothing for the tester. The state this case asks for cannot be '
           'produced in the product - every one of the five shop identity fields is mandatory - so '
           'the case cannot be run as written. It is with the QA lead.',
 'C44916': 'What needs to be done: nothing for the tester. An approval cannot be requested on this '
           'environment, which is already reported and open. Run this case again once that is '
           'resolved.',
 'C45275': 'What needs to be done: nothing for the tester. This case has no steps and no expected '
           'result recorded, so there is nothing to check. It belongs to another author and is '
           'with the QA lead.',
}


def esc(s):
    """Escape only what would break the markup. Keep the tester's text otherwise."""
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


res = json.load(open('build/invoice-ui-refresh/execution-2026-09-07/RESULTS.json'))['results']

payload = []
for cid, r in sorted(res.items()):
    blocks = ['<p>%s</p>' % esc(HDR), '<p>%s</p>' % esc(r['observed'].strip())]
    if r.get('not_observed') and r['not_observed'].strip().lower() != 'none':
        blocks.append('<p>Not observed this run: %s</p>' % esc(r['not_observed'].strip()))
    if cid in TODO:
        blocks.append('<hr />')
        blocks.append('<p>%s</p>' % esc(TODO[cid]))
    payload.append({'case_id': int(cid[1:]),
                    'status_id': STATUS[r['verdict']],
                    'comment': ''.join(blocks)})

assert len(payload) == 120, len(payload)
assert not any('<br' in p['comment'] for p in payload), 'never emit <br> in an API write'
print('pushing %d results (%d passed, %d failed, %d blocked)' % (
    len(payload),
    sum(1 for p in payload if p['status_id'] == 1),
    sum(1 for p in payload if p['status_id'] == 5),
    sum(1 for p in payload if p['status_id'] == 2)))

s, r = t.post('add_results_for_cases/417', {'results': payload})
print('add_results_for_cases ->', s, '| results written:', len(r) if isinstance(r, list) else r)

s, run = t.get('get_run/417')
print('R417 now: untested %s | passed %s | failed %s | blocked %s' % (
    run['untested_count'], run['passed_count'], run['failed_count'], run['blocked_count']))
