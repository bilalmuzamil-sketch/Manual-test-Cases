# casetext.py — 11 Nov 2026: print a case's title, preconditions, steps and expected (before the quotes block) as plain text. Usage: casetext.py 715358 715359
import json, re, sys, html
d = json.load(open(__file__.rsplit('/', 1)[0] + '/sources/cases.json')); c = d if isinstance(d, list) else d.get('cases', d)
m = {str(x['id']): x for x in (c if isinstance(c, list) else c.values())}
def s(h): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
for i in sys.argv[1:]:
    x = m[i.lstrip('C')]; e = s(x.get('custom_expected')); print('=====', i, x['title']); print('PRE', s(x.get('custom_preconds'))[:800]); print('STEPS', s(str(x.get('custom_steps')))[:900]); print('EXP', e[:e.find('Exact quotes')][:1400])
