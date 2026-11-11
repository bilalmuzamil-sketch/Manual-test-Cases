"""s92_result.py — 11 Nov 2026: C1062573 (A/P Detail Date/Due Date as month-day-year, never "Today") from s92/C1062573.json; seeded vendor ZZY Dates P92 with
bills dated today (08:00 UTC), yesterday and 2 days ago, Net 30. C1062575 added by hand once its data lands."""
import json, re
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's92/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's92/C1062573.json')); rows = o['rows']
assert [r.split(' Staging')[0] for r in rows] == ['Nov 11, 2026', 'Nov 10, 2026', 'Nov 9, 2026'] and all(re.search(r'Dec \d+, 2026', r) for r in rows)
assert not any(re.search(r'Today|Yesterday|days ago', r) for r in rows)
C = 'C1062573'; DATE = (278, 450, 110, 140); DUE = (998, 450, 100, 140)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/P Aging Detail, as of today (11/11/2026), Vendor filter ticked to a new vendor ZZY Dates P92 (Net 30) with three open bills dated today, yesterday and 2 days ago.',
    'Step 1: the "Current (3)" bucket opens and lists all three bills.',
    'Their Date cells read "Nov 11, 2026", "Nov 10, 2026" and "Nov 9, 2026"; their Due Date cells read "Dec 11, 2026", "Dec 10, 2026" and "Dec 9, 2026".',
    'No Date or Due Date cell reads "Today", "Yesterday" or "2 days ago".'],
    'pictures': [P(C, 'C1062573-1-current.png', 'Step 1: dates read as month, day and year - never "Today" or "Yesterday"', [DATE + ('good', 'Nov 11 / Nov 10 / Nov 9'), DUE + ('good', 'Dec 11 / Dec 10 / Dec 9')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s92 C1062573'}, 'results': R}, open(PP + 'RESULTS-s92-573.json', 'w'), indent=1); print(list(R))
