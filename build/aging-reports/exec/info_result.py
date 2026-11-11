"""info_result.py — 11 Nov 2026: judge the info-icon tests (C715433-C715438) from s78/<id>.json against the case's own word-for-word quote."""
import json, re, html, sys
from s78_result import pics
PP = '/home/user/Manual-test-Cases/build/aging-reports/'
d = json.load(open(PP + 'sources/cases.json')); c = d if isinstance(d, list) else d.get('cases', d); M = {str(x['id']): x for x in (c if isinstance(c, list) else c.values())}
NAME = {'C715433': 'A/R Aging Summary', 'C715434': 'A/R Aging Detail', 'C715435': 'A/R Aging Collection', 'C715436': 'A/P Aging Summary', 'C715437': 'A/P Aging Detail', 'C715438': 'A/P Unpaid Invoices'}
R = {}
for cid in sys.argv[1:]:
    e = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', M[cid[1:]]['custom_expected'])))
    want = re.search(r'word for word: [“"](.+?)[”"] Step 2', e).group(1).strip()
    o = json.load(open(PP + 'exec/s78/%s.json' % cid)); ok = o.get('tip1', '').strip() == want and o.get('tip3', '').strip() == want and not o.get('tip2') and not o.get('tip4')
    obs = ['%s as of 11/11/2026, signed in at Staging Heavy Duty - 9919.' % NAME[cid],
           'Step 1: hovering the info icon right of the title shows the tooltip: "%s"%s' % (o.get('tip1'), ' - word for word as the test quotes.' if o.get('tip1', '').strip() == want else ''),
           'Step 2: pointer moved away - the tooltip closes%s.' % ('' if not o.get('tip2') else ' (NOT: still "%s")' % o['tip2']),
           'Step 3: Tab until the info icon has keyboard focus (focused element: %s) - the same tooltip shows%s.' % (o.get('focused'), '' if o.get('tip3', '').strip() == want else ' (NOT: "%s")' % o.get('tip3')),
           'Step 4: Escape - the tooltip closes%s.' % ('' if not o.get('tip4') else ' (NOT: still "%s")' % o['tip4'])]
    R[cid] = {'verdict': 'Passed' if ok else 'CHECK', 'observed': obs, 'want': want,
              'pictures': pics(cid, {'1-hover': ('Step 1: hover on the info icon - the description tooltip', [r'^info_outline$'], 'good'), '3-keyboard': ('Step 3: keyboard focus on the info icon - the same tooltip', [r'^info_outline$'], 'good')})}
    print(cid, R[cid]['verdict'])
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s78b info icon'}, 'results': R}, open(PP + 'exec/RESULTS-s78b-info.json', 'w'), indent=1)
