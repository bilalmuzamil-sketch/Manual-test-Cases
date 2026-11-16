#!/usr/bin/env python3
"""Read-only TestRail scan: which sections hold work-order / invoice / part-sale / estimate / payment cases.
Fully paged (an unpaged call returns 250 and silently drops the rest). Writes a summary JSON + prints top lines. SECRET-FREE."""
import sys, json, re, collections
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as T
_g = T.get
def _get(path):
    st, body = _g(path)
    if st != 200: raise SystemExit(f'TestRail {st} on {path}: {str(body)[:200]}')
    return body
T.get = _get
def paged(path, key):
    out, off = [], 0
    while True:
        r = T.get(f"{path}&limit=250&offset={off}")
        items = r.get(key, r) if isinstance(r, dict) else r
        out += items
        if not isinstance(r, dict) or not r.get('_links', {}).get('next'): break
        off += 250
    return out
PAT = re.compile(r'work ?order|invoice|part sale|parts? sale|estimate|payment|deposit|credit memo|lifecycle|life cycle|line|labor|clock|refund|void|revers', re.I)
EXCL = re.compile(r'part lifecycle|parts lifecycle|part library|inventory', re.I)  # parts lifecycle is OUT of scope (QA lead 16 Nov)
res = {'projects': []}
for p in T.get('get_projects').get('projects', []):
    pid = p['id']; suites = T.get(f'get_suites/{pid}'); suites = suites.get('suites', suites) if isinstance(suites, dict) else suites
    for s in suites:
        secs = paged(f'get_sections/{pid}&suite_id={s["id"]}', 'sections'); byid = {x['id']: x for x in secs}
        def path(x):
            n = []; 
            while x: n.append(x['name']); x = byid.get(x.get('parent_id'))
            return ' / '.join(reversed(n))
        hits = [x for x in secs if PAT.search(path(x)) and not EXCL.search(path(x))]
        if not hits: continue
        cases = paged(f'get_cases/{pid}&suite_id={s["id"]}', 'cases'); cnt = collections.Counter(c['section_id'] for c in cases)
        sub = collections.defaultdict(int)
        hitids = {h['id'] for h in hits}
        rows = []
        for h in hits:
            # count the section's own cases plus all descendants once, at the top-most hit
            anc = byid.get(h.get('parent_id')); top = True
            while anc:
                if anc['id'] in hitids: top = False; break
                anc = byid.get(anc.get('parent_id'))
            if not top: continue
            desc = {h['id']}; changed = True
            while changed:
                changed = False
                for x in secs:
                    if x.get('parent_id') in desc and x['id'] not in desc: desc.add(x['id']); changed = True
            n = sum(cnt[i] for i in desc)
            creators = collections.Counter(c['created_by'] for c in cases if c['section_id'] in desc)
            auto = sum(1 for c in cases if c['section_id'] in desc and c.get('custom_automation_type') not in (None, 0))
            rows.append({'section_id': h['id'], 'path': path(h), 'cases': n, 'created_by': dict(creators), 'automation_flagged': auto})
        res['projects'].append({'project': p['name'], 'project_id': pid, 'suite': s['name'], 'suite_id': s['id'], 'sections': sorted(rows, key=lambda r: -r['cases'])})
json.dump(res, open(sys.argv[1], 'w'), indent=1)
for pr in res['projects']:
    print('==', pr['project'], '/', pr['suite'], pr['project_id'], pr['suite_id'])
    for r in pr['sections'][:40]: print(f"  {r['cases']:5d}  S{r['section_id']}  {r['path'][:120]}  auto={r['automation_flagged']} by={r['created_by']}")
