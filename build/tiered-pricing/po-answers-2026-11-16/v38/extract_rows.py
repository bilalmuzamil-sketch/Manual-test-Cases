"""Extract every PRD requirement row's text from a saved PRD copy, the same way requirements.json holds it (proved on v37 first).
Run from build/tiered-pricing: python3 po-answers-2026-11-16/v38/extract_rows.py"""
import json, re, sys
sys.path.insert(0, 'authoring')
from tp_lib import ws
REQ = json.load(open('requirements.json'))
def rows_from(path):
    L = open(path).read().split('\n'); out = {}
    for i, l in enumerate(L):
        m = re.match(r'^- (S\d+-[A-Z]+\d+): (.*)$', l)
        if not m: continue
        txt = [m.group(2)]; j = i + 1
        while j < len(L):
            n = L[j]
            if n.startswith('  ') : txt.append(n.strip()); j += 1; continue
            if n.strip() == '' and j + 1 < len(L) and L[j+1].startswith('  '): j += 1; continue
            break
        out.setdefault(m.group(1), ' '.join(txt))
    return out
v37 = rows_from('sources/CONFLUENCE-938213378-v37-read-2026-11-14.md')
v38 = rows_from('sources/CONFLUENCE-938213378-v38-read-2026-11-16.md')
tp = [r for r in REQ['prd_rows'] if r['id'].startswith('TP-S')]
bad = [r['id'] for r in tp if ws(v37.get(r['prd_id'], '').replace('\n',' ')) != r['_ws'] if True] if False else None
mism = []
for r in tp:
    if ws(v37.get(r['prd_id'], '')) != ws(r['text'].replace('\n', ' ')): mism.append(r['id'])
print('TP rows', len(tp), '| extractor reproduces v37 rows:', len(tp) - len(mism), '| mismatched', mism[:10])
changed = {r['prd_id']: v38[r['prd_id']] for r in tp if r['prd_id'] in v38 and ws(v38[r['prd_id']]) != ws(r['text'].replace('\n', ' '))}
gone = [r['prd_id'] for r in tp if r['prd_id'] not in v38]
new = {k: v for k, v in v38.items() if 'TP-' + k not in {r['id'] for r in tp}}
print('changed in v38:', sorted(changed)); print('missing in v38:', gone); print('new in v38:', new)
json.dump({'changed': changed, 'new': new, 'missing': gone, 'v37_mismatch': mism}, open('po-answers-2026-11-16/v38/rows-v38.json', 'w'), indent=1, ensure_ascii=False)
