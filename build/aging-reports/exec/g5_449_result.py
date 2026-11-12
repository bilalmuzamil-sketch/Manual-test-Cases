"""g5_449_result.py — 12 Nov 2026 07:45 UTC: C715449 PASSED on the QA lead's decision of 12 Nov ("I will follow your recommendation": pass because
Work In Progress — whose native info icon S8-R1 says the aging reports reuse — behaves the same on a tap). g5: touch-screen browser, 1440 px,
tap on the icon: no tooltip at 0.3/1/2/4 s on A/R Aging Collection AND on Work In Progress."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'g5/out.json')); C = 'C715449'
assert all(not r[1] for r in o['arc']['reads']) and all(not r[1] for r in o['wip']['reads'])
a, w = o['arc']['box'], o['wip']['box']
R = {C: {'verdict': 'Passed', 'observed': [
    'A touch-screen browser, 1440 px wide, on the new build v26.45.3-34788b2.',
    'Step 1: tapping the info icon right of "A/R Aging Collection" shows the same as tapping the info icon on Work In Progress - the native icon the requirement says these reports reuse (PRD S8-R1): on both, no tooltip stays on screen after the tap.',
    'Step 2: tapping an empty part of the page leaves both pages unchanged.',
    'Passed on the QA lead\'s decision of 12 Nov 2026: the icon behaves exactly like the native one on Work In Progress, which works this way before the release too.'],
    'pictures': [P(C, 'g5/arc-tap-1000ms.png', 'Step 1: A/R Aging Collection, 1 second after a tap on the info icon', [(a['x'] - 200, a['y'] - 12, 230, 42, 'good', 'Same as Work In Progress')]),
                 P(C, 'g5/wip-tap-1000ms.png', 'For comparison: Work In Progress, 1 second after a tap on its info icon', [(w['x'] - 160, w['y'] - 12, 190, 40, 'good', 'Native icon, same behaviour')])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g5'}, 'results': R}, open(PP + 'RESULTS-g5-449.json', 'w'), indent=1); print(list(R))
