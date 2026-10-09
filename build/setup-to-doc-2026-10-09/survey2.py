import sys, json, re, collections, html
sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
OUT = 'build/setup-to-doc-2026-10-09'
secs = json.load(open(f'{OUT}/sections.json'))
kids = collections.defaultdict(list)
for s in secs: kids[s['parent_id']].append(s['id'])
def sub(i, skip=()):
    out, st = set(), [i]
    while st:
        x = st.pop()
        if x in skip: continue
        out.add(x); st += kids[x]
    return out
SUITES = {'DVIv2': sub(6658), 'Dashboard': sub(12166), 'FM - Part Sale': sub(20435), 'FM - Notifications': sub(20436),
          'FM - What/Why': sub(20437), 'FM - Price/Category': sub(20438), 'FM - Part Lifecycle': sub(20439, skip={54275}),
          'MR chunk 1': sub(19397, skip={26635}), 'MR chunk 2': sub(26635)}
cases, off = [], 0
while True:
    r = api(f'get_cases/1&suite_id=1&offset={off}&limit=250'); cs = r['cases'] if isinstance(r, dict) else r
    cases += cs
    if len(cs) < 250: break
    off += 250
allsec = set().union(*SUITES.values())
mine = [c for c in cases if c['section_id'] in allsec]
json.dump(mine, open(f'{OUT}/snapshot-before.json', 'w'))
def txt(h): return html.unescape(re.sub(r'<[^>]+>', '\n', h or ''))
print(f"{'suite':22} total ours other-created edited-by-other automated setup-block doc-link needs-line avg-pre-chars avg-steps-chars")
for name, ss in SUITES.items():
    cs = [c for c in mine if c['section_id'] in ss]
    ours = [c for c in cs if c['created_by'] == 3]
    other_ed = [c for c in ours if c.get('updated_by') != 3]
    auto = [c for c in cs if c.get('custom_atmstatus') == 3]
    setup = [c for c in cs if re.search(r'<strong>\s*Setup\s*</strong>|^\s*Setup\s*$', c.get('custom_preconds') or '', re.M)]
    link = [c for c in cs if 'docs.google.com' in (c.get('custom_preconds') or '')]
    needs = [c for c in cs if 'Needs:' in (c.get('custom_preconds') or '')]
    ap = sum(len(txt(c.get('custom_preconds'))) for c in cs) // max(1, len(cs))
    ast = sum(len(txt(c.get('custom_steps'))) for c in cs) // max(1, len(cs))
    print(f"{name:22} {len(cs):5} {len(ours):4} {len(cs)-len(ours):5} {len(other_ed):5} {len(auto):5} {len(setup):5} {len(link):5} {len(needs):5} {ap:6} {ast:6}")
