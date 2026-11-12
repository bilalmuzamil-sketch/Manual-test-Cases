"""build_csv.py - 12 Nov 2026: rebuild the dashboard CSV (case,title,status,area,area_order) from run 557 LIVE (paged get_tests), area = the
case's CURRENT folder name (get_section), area_order kept from the previous CSV's order for known folders (new folders go last).
Usage: python3 build_csv.py <previous.csv> <out.csv>"""
import sys, csv
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as t, time
def G(u):
    for i in range(6):
        s, b = t.get(u)
        if s == 200 and isinstance(b, dict) and 'error' not in b: return b
        time.sleep(5 * (i + 1))   # 429 / transient: back off
    raise SystemExit('failed: %s %s %s' % (u, s, str(b)[:200]))
prev, out = sys.argv[1], sys.argv[2]
order = {}
for r in csv.DictReader(open(prev)): order[r['area']] = int(r['area_order'])
tests, off = [], 0
while True:
    b = G('get_tests/557&limit=250&offset=%d' % off); tests += b['tests']
    if not b['_links']['next']: break
    off += 250
ST = {1: 'Passed', 2: 'Blocked', 3: 'Not yet run', 4: 'Retest', 5: 'Failed'}; secs = {}; rows = []
for x in tests:
    c = G('get_case/%d' % x['case_id']); sid = c['section_id']
    if sid not in secs: secs[sid] = G('get_section/%d' % sid)['name']
    a = secs[sid]
    if a not in order: order[a] = max(order.values()) + 1
    rows.append(['C%d' % x['case_id'], c['title'], ST.get(x['status_id'], str(x['status_id'])), a, order[a]])
rows.sort(key=lambda r: (r[4], r[0]))
w = csv.writer(open(out, 'w', newline='')); w.writerow(['case', 'title', 'status', 'area', 'area_order']); w.writerows(rows)
import collections; print(len(rows), collections.Counter(r[2] for r in rows), [a for a in order if a not in {r['area'] for r in csv.DictReader(open(prev))}])
