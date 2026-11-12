"""v12_impact.py - 12 Nov 2026: which run-557 tests touch the five rules Milos changed in PRD v12 (answers to Mudassir's 7 questions):
S1-R8 (open group may arrive in one request), S3-R7b ("Total for <name>", never "Subtotal"), S4-R1 (header chevron blue), S5-E3 (one location
left -> chip hidden), S8-R3 (long vendor name on A/P Unpaid may scroll sideways). Reads run 557 + every case LIVE; prints status, author,
automation flag and the matching sentences. Output v12-impact.json."""
import sys, json, re, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools'); import tr_client as t, time
def G(u):
    for i in range(6):
        s, b = t.get(u)
        if s == 200: return b
        time.sleep(5 * (i + 1))
    raise SystemExit(u)
tests, off = [], 0
while True:
    b = G('get_tests/557&limit=250&offset=%d' % off); tests += b['tests']
    if not b['_links']['next']: break
    off += 250
ST = {1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed'}
PAT = {'S1-R8': r'S1-R8|next 100|first 100 documents|100 at a time|100 documents', 'S3-R7b': r'Subtotal|S3-R7b',
       'S4-R1': r'S4-R1|chevron.{0,60}(grey|gray|blue|colou?r)|(grey|gray) chevron', 'S5-E3': r'S5-E3|S5-N1',
       'S8-R3': r'S8-R3|sideways|scroll horizontally|170.character|long vendor name'}
txt = lambda s: re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', s or '')))
out = []
for x in tests:
    c = G('get_case/%d' % x['case_id']); T = {k: txt(c.get(k)) for k in ('custom_preconds', 'custom_steps', 'custom_expected')}; all_ = c['title'] + ' ' + ' '.join(T.values())
    hits = {r: [m.group(0) for m in re.finditer(p, all_, flags=re.I)][:3] for r, p in PAT.items() if re.search(p, all_, flags=re.I)}
    if hits:
        exp = T['custom_expected']
        out.append({'case': 'C%d' % c['id'], 'test': x['id'], 'status': ST.get(x['status_id']), 'title': c['title'], 'by': c['created_by'], 'atm': c.get('custom_atmstatus'),
                    'rules': list(hits), 'hits': hits, 'expected': exp[:1500], 'refs': c.get('refs')})
json.dump(out, open('v12-impact.json', 'w'), indent=1)
for o in out: print(o['case'], o['status'], 'by', o['by'], 'atm', o['atm'], o['rules'], '|', o['title'][:80])
