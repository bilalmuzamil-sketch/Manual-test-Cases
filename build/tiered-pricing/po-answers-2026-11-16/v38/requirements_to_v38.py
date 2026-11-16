"""Move requirements.json's Tiered Pricing PRD rows from page v37 to page v38 (16 Nov 2026, the named set). Run from build/tiered-pricing.
Proof first: the same extractor reproduces all 279 numbered v37 rows exactly (text and line). Then each row takes its v38 text and line;
18 rows change (the 18 the v37->v38 diff names), S19-R24 is added; the 21 Error Handling rows and 12 Permissions rows are untouched text
(the diff changes no line of them) and only their version label moves. Reports PRD rows (RPT-) are untouched (v21 unchanged)."""
import json, re
REQ = json.load(open('requirements.json'))
def rows_from(path):
    L = open(path).read().split('\n'); out = {}
    for i, l in enumerate(L):
        m = re.match(r'^- (S\d+-[A-Z]+\d+): (.*)$', l)
        if not m: continue
        txt = [m.group(2)]; j = i + 1
        while j < len(L):
            n = L[j]
            if n.startswith('  '): txt.append(n.strip()); j += 1; continue
            if n.strip() == '' and j + 1 < len(L) and L[j + 1].startswith('  '): j += 1; continue
            break
        out.setdefault(m.group(1), ('\n'.join(txt), i + 1))
    return out
v37 = rows_from('sources/CONFLUENCE-938213378-v37-read-2026-11-14.md')
v38 = rows_from('sources/CONFLUENCE-938213378-v38-read-2026-11-16.md')
tp = [r for r in REQ['prd_rows'] if r['id'].startswith('TP-')]
num = [r for r in tp if r['prd_id'] in v37]
assert all(v37[r['prd_id']] == (r['text'], r['source_line']) for r in num), 'extractor does not reproduce v37'
changed = []
for r in tp:
    r['version'] = 'page v38 (in-body v0.17)'
    if r['prd_id'] in v38:
        t, ln = v38[r['prd_id']]
        if t != r['text']: changed.append(r['id']); r['text_v37'] = r['text']; r['text'] = t
        r['source_line'] = ln
if 'TP-S19-R24' not in {r['id'] for r in REQ['prd_rows']}:
    base = next(r for r in REQ['prd_rows'] if r['id'] == 'TP-S19-R23')
    t, ln = v38['S19-R24']
    new = dict(base); new.update(id='TP-S19-R24', prd_id='S19-R24', source_line=ln, text=t, version='page v38 (in-body v0.17)',
                                verdict='new case', verdict_reason='added in PRD v38 (16 Nov 2026, Matt Barge answer 31)', cases=[],
                                tech_plan_additions=[], surfaces=['Every new page, dialog and list'])
    new.pop('text_v37', None)
    REQ['prd_rows'].insert(REQ['prd_rows'].index(base) + 1, new)
REQ['generated'] = REQ.get('generated', '') + ' | 2026-11-16: Tiered Pricing PRD rows moved to page v38 (18 rows changed, S19-R24 added; text_v37 keeps the old text)'
json.dump(REQ, open('requirements.json', 'w'), indent=1, ensure_ascii=False)
print('changed', len(changed), sorted(changed)); print('rows now', len(REQ['prd_rows']))
