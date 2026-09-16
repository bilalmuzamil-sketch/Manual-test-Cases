import re, html, json
from trlib import api
def strip(s):
    s = re.sub(r'<br\s*/?>', '\n', s or ''); s = re.sub(r'</p>', '\n', s)
    return html.unescape(re.sub(r'<[^>]+>', '', s))
cases = []
for sec in (6769, 8056):
    r = api(f'get_cases/1&suite_id=1&section_id={sec}&limit=250')
    cases += (r['cases'] if isinstance(r, dict) else r)
SKIP = re.compile(r'^(note|expected|result|precondition|tip|warning|then|and)\b', re.I)
NOISE = re.compile(r'^(the|a|an|it|this|that|is|are|be)\b', re.I)
out, novalue = {}, []
for c in cases:
    vals = []
    for line in strip(c.get('custom_steps')).splitlines():
        line = re.sub(r'^\s*\d+\.\s*', '', line.strip())
        if not line or SKIP.match(line): continue
        if not re.search(r'\b(type|search|enter|paste)\b', line, re.I): continue
        if ':' in line:
            tail = line.rsplit(':', 1)[1].strip().rstrip('.').strip()
            tail = re.sub(r'\s+', ' ', tail)
            if 1 < len(tail) <= 60 and not NOISE.match(tail): vals.append(tail)
        else:
            m = re.search(r'[\'"‘“]([^\'"’”]{2,60})[\'"’”]', line)
            if m: vals.append(m.group(1).strip())
    if vals: out[c['id']] = {'title': c['title'], 'typed': sorted(set(vals))}
    else: novalue.append((c['id'], c['title']))
json.dump({'with_values': out, 'no_explicit_value': novalue}, open('sweep-typed.json','w'), indent=1)
print(f"cases: {len(cases)}   with an explicit typed value: {len(out)}   without: {len(novalue)}")
allv = sorted({v for d in out.values() for v in d['typed']}, key=str.lower)
print(f"\nDISTINCT VALUES A TESTER IS TOLD TO TYPE ({len(allv)}):")
for v in allv: print("   ", v)
print(f"\nCASES WITH NO EXPLICIT VALUE IN THE STEPS ({len(novalue)}) — these need a manual read:")
for cid, t in novalue: print(f"   C{cid}  {t}")
