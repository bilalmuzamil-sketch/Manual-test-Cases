"""pr6_477_result.py — 11 Nov 2026 20:45 UTC: C715477 (a work order link from another location still asks to switch). Before = production v26.45.3
(prod/pr6e.json): work order at Trucks Hill 2, address copied from the address bar (/workorders/<id>/lines), pasted while at SANKAN -> NO prompt,
"WorkOrder not found. Please try to resolve this." + "Request failed with status code 400 / Error fetching work order", lands on Work Orders.
After = QA (p65b/out.json, 11 Nov): the same paste at Staging Heavy Duty - 9919 of a Lethbridge work order -> the same two messages, no prompt.
The prompt the case expects appears on the new build only for an address carrying ?locationId= (d3e, C715519). Rule 121: same on production =>
not a regression and no ticket; the case's step 2 describes a prompt production never showed for an address-bar link -> Blocked, question to him."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
pr = json.load(open(PP + 'prod/pr6e.json')); q = json.load(open(PP + 'p65b/out.json')); C = 'C715477'
assert pr['dialog'] == '' and any('WorkOrder not found' in n for n in pr['notes1']) and q['newLink']['dialog'] == '' and any('WorkOrder not found' in n for n in q['newLink']['notes1'])
R = {C: {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 2: the switch-location prompt this step expects does not appear for an address-bar link before the release either - the QA lead decides what this test should expect.', 'bold_steps': [2],
    'source': 'Test case step 2: "The existing switch-location prompt asks to switch to location B, as before the release."',
    'observed': [
    'Before the release (production v26.45.3-f5ba431): a work order opened at Trucks Hill 2, its address copied from the address bar (".../workorders/<id>/lines"), then pasted while at SANKAN: no prompt; two messages - "WorkOrder not found. Please try to resolve this." and "Request failed with status code 400 - Error fetching work order"; the page shows Work Orders.',
    'On the new build: a work order opened at Staging Lethbridge - 4310, its address copied from the address bar, pasted while at Staging Heavy Duty - 9919: the same - no prompt, the same two messages, Work Orders.',
    'So the new build behaves exactly as before the release; it is not a new fault (no ticket).',
    'The switch prompt the step expects shows on the new build only when the address carries the work order\'s location (".../workorders/<id>?locationId=<location>", the form the reports\' own links use) - recorded on the switch-dialog design test.'],
    'todo': 'What needs to be done: nothing for the tester now - the QA lead is asked whether this test should use the report link form (which shows the prompt) or expect the "WorkOrder not found" message that production shows today.',
    'pictures': [P(C, 'prod/155-C715477-prod-2-pasted.png', 'Before the release (production): address-bar link from another location - no prompt, "Error fetching work order"', [(940, 834, 400, 56, 'bad', 'No prompt - error message'), (1300, 8, 120, 40, 'good', 'At SANKAN')]),
                 P(C, 'p65b/04-A-copied-2-pasted.png', 'Step 2 on the new build: the same - no prompt, "WorkOrder not found" / 400', [(940, 768, 400, 124, 'bad', 'No prompt - the same messages'), (1180, 8, 240, 40, 'good', 'At Heavy Duty')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, pr6e + p65b'}, 'results': R}, open(PP + 'RESULTS-pr6-477.json', 'w'), indent=1); print(list(R))
