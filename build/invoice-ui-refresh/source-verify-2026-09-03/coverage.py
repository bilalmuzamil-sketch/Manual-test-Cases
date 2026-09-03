#!/usr/bin/env python3
"""Rule 43 per-requirement coverage verdict for the v39 -> live delta.
Reads the 119 cases LIVE from TestRail (Rule: count from the system of record) and reports, per
changed or added anchor, which cases claim it in `refs` - and flags anchors with NO case at all."""
import base64, json, re, sys, urllib.request
sys.path.insert(0, 'build/testing-tools')
from load_creds import testrail_creds
U, K = testrail_creds()
def api(p):
    r = urllib.request.Request(f'https://shopview.testrail.io/index.php?/api/v2/{p}')
    r.add_header('Authorization', 'Basic ' + base64.b64encode(f'{U}:{K}'.encode()).decode())
    return json.load(urllib.request.urlopen(r))

CHANGED = ['S11-R3','S12-R2','S12-R3','S12-R4','S12-R7','S12-R9','S13-N1','S13-R6',
           'S2-N2','S2-R3','S3-R8','S5-N1','S5-R6','S5-R7','S8-R2','S8-R5']
ADDED   = ['S12-R10','S12-R11']

secs = []
def walk(sid):
    got = api(f'get_cases/1&section_id={sid}')
    return got['cases'] if isinstance(got, dict) else got
all_sec = []
offset = 0
while True:
    r = api(f'get_sections/1&limit=250&offset={offset}')
    batch = r['sections'] if isinstance(r, dict) else r
    all_sec += batch
    if len(batch) < 250: break
    offset += 250
kids, byid = {}, {s['id']: s for s in all_sec}
for s in all_sec: kids.setdefault(s.get('parent_id'), []).append(s['id'])
stack, tree = [6559], []
while stack:
    n = stack.pop(); tree.append(n); stack += kids.get(n, [])
cases = []
for sid in tree: cases += walk(sid)
print(f'cases read live under section 6559: {len(cases)}')

def holders(anchor):
    out = []
    for c in cases:
        blob = f"{c.get('refs') or ''} {c.get('custom_expected') or ''}"
        if re.search(rf'(?<![A-Za-z0-9]){re.escape(anchor)}(?![0-9a-z])', blob):
            out.append(f"C{c['id']}")
    return out

print('\n--- CHANGED anchors: cases that cite them must be re-read against the new wording ---')
gaps = []
for a in CHANGED:
    h = holders(a)
    print(f'  {a:<9} {len(h):>3} case(s)  {", ".join(h[:8])}{" …" if len(h)>8 else ""}')
    if not h: gaps.append(a)
print('\n--- ADDED anchors: brand-new requirements, need coverage (Rule 43) ---')
for a in ADDED:
    h = holders(a)
    print(f'  {a:<9} {len(h):>3} case(s)  {", ".join(h[:8]) or "** NO CASE COVERS THIS **"}')
    if not h: gaps.append(a)
print(f'\nANCHORS WITH NO CASE AT ALL ({len(gaps)}): {gaps}')
