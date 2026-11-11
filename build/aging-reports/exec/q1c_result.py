"""q1c_result.py — 11 Nov 2026: C715583 / C715619 / C715620 (Sales By Customer / Inventory Value / Work In Progress keep or forget the Location
filter between visits exactly as before the release). Before = production v26.45.3-f5ba431 (prod/pr1b.json): untick a location, open A/R Aging
Summary, come back - "forgotten" (chip back to its default, All locations). After = QA sv11315 (q1c/out.json): change the Location filter (these
reports open on the current location only on QA, L0657, so a second location was TICKED), open A/R Aging Summary, come back - "forgotten" (chip back
to its default, the current location). Same behaviour = pass."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
pr = json.load(open(PP + 'prod/pr1b.json')); qa = json.load(open(PP + 'q1c/out.json'))
NAME = {'C715583': ('Sales By Customer', 21), 'C715619': ('Inventory Value', 24), 'C715620': ('Work In Progress', 27)}
CHIPS = (278, 118, 1132, 32); R = {}
for c, (rep, k) in NAME.items():
    b, a = pr[c], qa[c]; assert b['changed'] and b['verdict'] == 'forgotten' and a['changed'] and a['verdict'] == 'forgotten'
    loc = lambda ch: [x for x in ch if 'Location:' in x][0].replace('place ', '').replace(' keyboard_arrow_down cancel', '')
    qp = sorted(x for x in __import__('os').listdir(PP + 'q1c') if c in x)
    R[c] = {'verdict': 'Passed', 'observed': [
        'Before the release (production, v26.45.3-f5ba431): on %s, unticking one location changed the chip to "%s"; after opening A/R Aging Summary and coming back from the Reports menu the chip read "%s" again - the filter was FORGOTTEN.' % (rep, loc(b['chips1']), loc(b['chips3'])),
        'Step 1 (QA site, after the release): %s opens on the current location only here, so a second location was ticked instead of one unticked - the chip changed to "%s".' % (rep, loc(a['chips1'])),
        'Step 2: A/R Aging Summary opens.',
        'Step 3: %s opens again from the Reports menu with the chip back to "%s" - the filter is forgotten, exactly as before the release.' % (rep, loc(a['chips3']))],
        'pictures': [P(c, 'prod/%02d-%s-1-unticked.png' % (k, c), 'Before the release (production): filter changed', [CHIPS + ('good', 'Changed')]),
                     P(c, 'prod/%02d-%s-3-back.png' % (k + 2, c), 'Before the release (production): back again - filter forgotten', [CHIPS + ('good', 'Forgotten')]),
                     P(c, 'q1c/' + qp[0], 'Step 1 (QA): filter changed', [CHIPS + ('good', 'Changed')]),
                     P(c, 'q1c/' + qp[-1], 'Step 3 (QA): back again - filter forgotten, as before', [CHIPS + ('good', 'Forgotten, as before')])]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q1c + pr1b'}, 'results': R}, open(PP + 'RESULTS-q1c.json', 'w'), indent=1); print(list(R))
