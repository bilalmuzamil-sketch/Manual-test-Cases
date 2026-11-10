"""quote_check.py — 10 Nov 2026 (QA lead 3A: read PRD v11 once at the start, check every test against it; Rules 106/114/137).
For each of the 380 cases, takes every quoted sentence (text inside “…” or "…" of 25+ characters) in the Expected field that follows a
PRD rule id or sits in the "Exact quotes" part, and checks it is word-for-word in PRD v11 (sources/prd-947650561-v11-read-1110.md),
after normalising quotes, dashes, spaces and markdown. Writes quote-check.json; prints counts and every quote not found. Read only."""
import json, re, html, os
HERE = os.path.dirname(os.path.abspath(__file__))
prd = open(os.path.join(HERE, 'sources/prd-947650561-v11-read-1110.md')).read()
def norm(s):
    s = html.unescape(s); s = re.sub(r'[*_`\\]', '', s)
    for a, b in (('“', '"'), ('”', '"'), ('‘', "'"), ('’', "'"), ('–', '-'), ('—', '-'), (' ', ' '), ('→', '->')): s = s.replace(a, b)
    return re.sub(r'\s+', ' ', s).strip().lower()
P = norm(prd)
d = json.load(open(os.path.join(HERE, 'sources/cases.json')))
res = {}; nq = nf = 0
for c in d['cases']:
    e = html.unescape(re.sub(r'<[^>]+>', ' ', c.get('custom_expected') or ''))
    qs = re.findall(r'(S\d+-[A-Z]+\d+[a-z]?)[^“"]{0,40}[“"]([^”"]{25,})[”"]', e)
    miss = []
    for rid, q in qs:
        nq += 1
        qn = norm(q).rstrip('.').strip()
        if qn not in P:
            # allow an ellipsis-shortened quote: every part between … must be present
            parts = [p.strip(' .') for p in re.split(r'\.\.\.|…', qn) if len(p.strip(' .')) > 12]
            if not parts or not all(p in P for p in parts): miss.append({'rule': rid, 'quote': q[:220]}); nf += 1
    res[c['id']] = {'title': c['title'], 'quotes': len(qs), 'missing': miss}
json.dump(res, open(os.path.join(HERE, 'quote-check.json'), 'w'), indent=1, ensure_ascii=False)
bad = {k: v for k, v in res.items() if v['missing']}
print(f'{nq} quoted PRD sentences in {sum(1 for v in res.values() if v["quotes"])} tests; {nf} not found word-for-word in v11, in {len(bad)} tests; {sum(1 for v in res.values() if not v["quotes"])} tests quote no rule')
from collections import Counter
print('rules of the misses:', Counter(m['rule'] for v in bad.values() for m in v['missing']).most_common(20))
