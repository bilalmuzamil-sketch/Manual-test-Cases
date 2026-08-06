import json,sys,os
sys.path.insert(0,'.')
import jiralib as J
from adf import to_text
c = json.load(open('../census.json'))
parents = sorted({v.get('parent') for v in c.values() if v.get('parent')})
parents = sorted(set(parents) | {'SV-8591','SV-8592'})
os.makedirs('../stories', exist_ok=True)
idx={}
for k in parents:
    code, d = J.issue(k, out=f'/tmp/_st_{k}.json')
    if code!='200':
        print(k, code); continue
    f=d['fields']
    t = to_text(f.get('description') or {})
    idx[k]={'summary':f['summary'],'type':f['issuetype']['name'],'status':f['status']['name'],
            'parent':(f.get('parent') or {}).get('key'),'desc_chars':len(t)}
    open(f'../stories/{k}.txt','w').write(f"# {k} [{f['issuetype']['name']}] {f['summary']}\n# parent: {(f.get('parent') or {}).get('key')}\n\n{t}")
    print(k, f['issuetype']['name'], '|', f['summary'][:80], '|', len(t),'chars')
json.dump(idx, open('../stories/INDEX.json','w'), indent=1)
