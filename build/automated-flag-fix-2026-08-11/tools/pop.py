import tr, json, collections
secs = tr.getall('get_sections/1&suite_id=1','sections')
print('sections total', len(secs))
byid = {s['id']: s for s in secs}
def subtree(root):
    out={root}
    changed=True
    while changed:
        changed=False
        for s in secs:
            if s['parent_id'] in out and s['id'] not in out:
                out.add(s['id']); changed=True
    return out
GROUPS = {'Filters':4110, 'Schedule':4254, 'ReportSuite':4281}
trees = {k: subtree(v) for k,v in GROUPS.items()}
for k,v in trees.items(): print(k, 'sections', len(v))
cases = tr.getall('get_cases/1&suite_id=1','cases')
print('cases total', len(cases))
json.dump(cases, open('/tmp/testrail/ALLCASES-flagfix.json','w'))
sec2proj={}
for k,v in trees.items():
    for s in v: sec2proj[s]=k
rows=[]
for c in cases:
    p = sec2proj.get(c['section_id'])
    if not p: continue
    rows.append(dict(id=c['id'], proj=p, atm=c.get('custom_atmstatus'), created_by=c.get('created_by'), updated_by=c.get('updated_by'), title=c.get('title')))
json.dump(rows, open('rows.json','w'), indent=1)
cnt=collections.Counter((r['proj'], r['atm'], r['created_by']) for r in rows)
for k in sorted(cnt, key=str): print(k, cnt[k])
