"""23 Oct 2026 — find the Dashboard (TestRail section 12166 and below) cases related to SV-11691, SV-11690, SV-11711, SV-11688.
Reads TestRail live, paged. Matches each case's title/preconds/steps/expected/refs against each ticket's own keywords. Writes matches.json."""
import sys, os, re, json, html
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools')); import tr_client as t
def paged(path, key):
    out, off = [], 0
    while True:
        s, r = t.get(f'{path}&limit=250&offset={off}'); b = r[key] if isinstance(r, dict) else r; out += b
        if len(b) < 250: return out
        off += 250
secs = paged('get_sections/1&suite_id=1', 'sections'); by = {s['id']: s for s in secs}
root = 12166; tree = {root}
changed = True
while changed:
    changed = False
    for s in secs:
        if s.get('parent_id') in tree and s['id'] not in tree: tree.add(s['id']); changed = True
path = lambda sid: ' > '.join(reversed([by[x]['name'] for x in iter(lambda c=[sid]: (c.append(by[c[-1]].get('parent_id')) or c[-2]) if c[-1] else None, None)][:0])) 
def spath(sid):
    n = []; 
    while sid: n.append(by[sid]['name']); sid = by[sid].get('parent_id')
    return ' > '.join(reversed(n))
cases = []
for sid in sorted(tree):
    cases += paged(f'get_cases/1&suite_id=1&section_id={sid}', 'cases')
TK = {
 'SV-11688': [r'utili[sz]ation', r'clock(ed)?[- ]?out', r'timesheet', r'active (time|entr)', r'33\.33'],
 'SV-11690': [r'a/?r aging', r'aging', r'deposit', r'receivable'],
 'SV-11691': [r'a/?r aging', r'receivable', r'paid', r'payment', r'balance', r'unpaid'],
 'SV-11711': [r'over ?limit', r'credit limit', r'customer balance', r'over[- ]credit'],
}
def txt(c): return html.unescape(re.sub(r'<[^>]+>', ' ', ' '.join(str(c.get(k) or '') for k in ('title', 'custom_preconds', 'custom_steps', 'custom_expected', 'refs')))).lower()
res = {k: [] for k in TK}
for c in cases:
    x = txt(c)
    for k, pats in TK.items():
        hits = [p for p in pats if re.search(p, x)]
        if k.lower() in x or hits:
            res[k].append({'id': c['id'], 'title': c['title'], 'section': spath(c['section_id']), 'hits': hits, 'refs': c.get('refs'), 'by': c['created_by'], 'atm': c.get('custom_atmstatus'), 'ref_names_ticket': k.lower() in x})
json.dump({'sections': {s: spath(s) for s in sorted(tree)}, 'cases': len(cases), 'matches': res}, open(os.path.join(os.path.dirname(__file__), 'matches.json'), 'w'), indent=1)
print('sections', len(tree), 'cases', len(cases))
for s in sorted(tree): print('  ', s, spath(s), sum(1 for c in cases if c['section_id'] == s))
for k, v in res.items(): print(k, len(v))
