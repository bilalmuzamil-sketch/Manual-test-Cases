import json, urllib.request, base64

creds=json.load(open('/tmp/testrail/creds.json'))
host=creds['host'].rstrip('/')
auth=base64.b64encode(f"{creds['user']}:{creds['password']}".encode()).decode()

def api(path):
    url=f"{host}/index.php?/api/v2/{path}"
    req=urllib.request.Request(url, headers={'Authorization':f'Basic {auth}','Content-Type':'application/json'})
    with urllib.request.urlopen(req) as r:
        return json.load(r)

sids=json.load(open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/fm_sids.json'))
secmap={}
# fetch section names
d=api("get_sections/1&suite_id=1&limit=250")
arr=d['sections'] if isinstance(d,dict) else d
# may need paging but earlier we got all; just build map from both pages
allsecs=[]
offset=0
while True:
    d=api(f"get_sections/1&suite_id=1&limit=250&offset={offset}")
    a=d['sections'] if isinstance(d,dict) and 'sections' in d else d
    allsecs.extend(a)
    nxt=d.get('_links',{}).get('next') if isinstance(d,dict) else None
    if not nxt: break
    offset+=250
for s in allsecs: secmap[s['id']]=s['name']

cases=[]
for sid in sids:
    offset=0
    while True:
        d=api(f"get_cases/1&suite_id=1&section_id={sid}&limit=250&offset={offset}")
        arr=d['cases'] if isinstance(d,dict) and 'cases' in d else d
        for c in arr:
            cases.append({
                'id':c['id'],'section_id':c['section_id'],'sec':secmap.get(c['section_id'],''),
                'title':c.get('title',''),
                'pre':c.get('custom_preconds') or '',
                'steps':c.get('custom_steps') or '',
                'exp':c.get('custom_expected') or ''
            })
        nxt=d.get('_links',{}).get('next') if isinstance(d,dict) else None
        if not nxt: break
        offset+=250

json.dump(cases, open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/cases.json','w'))
print("total founder-mode cases:", len(cases))
from collections import Counter
cnt=Counter(c['sec'] for c in cases)
for k,v in sorted(cnt.items()):
    print(f"  {v:4d}  {k}")
