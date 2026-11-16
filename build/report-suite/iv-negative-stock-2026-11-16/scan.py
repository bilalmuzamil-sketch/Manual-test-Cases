#!/usr/bin/env python3
"""Read-only: find Inventory Value cases (live TestRail) whose text assumes only stock above zero is shown/valued,
superseded by SV-10380 (22 Sep 2026). Prints a summary; writes hits.json. No TestRail writes."""
import sys, json, re
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools'); import tr_client as T
secs = T.get_sections(1, 1)
byid = {s['id']: s for s in secs}
def path(s):
    p = []
    while s: p.append(s['name']); s = byid.get(s.get('parent_id'))
    return ' > '.join(reversed(p))
iv = [s for s in secs if re.search(r'inventory value|^IV\b', s['name'], re.I)]
ids = set()
for s in iv:  # include descendants
    st = [s['id']]
    while st:
        x = st.pop(); ids.add(x); st += [c['id'] for c in secs if c.get('parent_id') == x]
print('IV sections:', len(ids)); [print('  ', s['id'], path(s)) for s in iv]
cases = []
for sid in sorted(ids): cases += T.get_cases(1, 1, sid)
print('IV cases live:', len(cases), ' ours(created_by=3):', sum(c['created_by'] == 3 for c in cases))
PAT = re.compile(r'(above zero|greater than zero|more than zero|> ?0\b|positive (stock|quantit|on.hand|bin)|negative|below zero|less than zero|zero (stock|quantit|on.hand)|on.hand (of )?0\b|quantity (of )?0\b|S2-R1\b|bin)', re.I)
hits = []
for c in cases:
    txt = ' '.join(str(c.get(k) or '') for k in ('title', 'custom_preconds', 'custom_steps', 'custom_expected', 'refs'))
    txt = re.sub(r'<[^>]+>', ' ', txt)
    m = sorted({x.group(0).lower() for x in PAT.finditer(txt)})
    if m:
        snips = [txt[max(0, x.start()-90): x.end()+90].replace('\n', ' ') for x in PAT.finditer(txt)][:4]
        hits.append({'id': c['id'], 'title': c['title'], 'section': path(byid[c['section_id']]), 'created_by': c['created_by'],
                     'automated': c.get('custom_automation_type') or c.get('custom_automated'), 'terms': m, 'snips': snips})
json.dump(hits, open('hits.json', 'w'), indent=1)
print('cases mentioning stock-sign terms:', len(hits))
for h in hits: print(f"C{h['id']} by{h['created_by']} | {h['title'][:80]} | {','.join(h['terms'])}")
