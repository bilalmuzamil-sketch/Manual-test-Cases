import sys, json; sys.path.insert(0,'/tmp/testrail')
import tr
# page all sections, build group subtrees
secs=[]; off=0
while True:
    st,b = tr.api(f'get_sections/1&suite_id=1&limit=250&offset={off}')
    ch = b['sections'] if isinstance(b,dict) and 'sections' in b else b
    secs += ch
    if len(ch)<250: break
    off += 250
byparent={}
for s in secs: byparent.setdefault(s.get('parent_id'), []).append(s['id'])
def subtree(root):
    out=set([root]); stack=[root]
    while stack:
        n=stack.pop()
        for c in byparent.get(n,[]):
            if c not in out: out.add(c); stack.append(c)
    return out
cases=[]; off=0
while True:
    st,b = tr.api(f'get_cases/1&suite_id=1&limit=250&offset={off}')
    ch = b['cases'] if isinstance(b,dict) and 'cases' in b else b
    cases += ch
    if len(ch)<250: break
    off += 250
groups={'schedule':4254,'filters':4110,'report_suite':4281}
res={}
for g,root in groups.items():
    ids=subtree(root)
    sel=[c for c in cases if c.get('section_id') in ids]
    ours=[c for c in sel if c.get('created_by')==3]
    res[g]={'root':root,'live':len(sel),'ours':len(ours),
            'foreign':sorted({c['created_by'] for c in sel if c.get('created_by')!=3}),
            'case_ids':sorted(c['id'] for c in sel)}
    print(f"{g:14s} root={root} live={len(sel):4d} ours={len(ours):4d} foreign={len(sel)-len(ours)}")
json.dump({'sections':len(secs),'cases':len(cases),'groups':res,'all':cases}, open('suites-live.json','w'))
print('TOTAL sections', len(secs), '| TOTAL cases', len(cases))
