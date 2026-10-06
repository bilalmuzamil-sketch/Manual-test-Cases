import json, urllib.request, urllib.parse, base64, sys

creds=json.load(open('/tmp/testrail/creds.json'))
host=creds['host'].rstrip('/')
auth=base64.b64encode(f"{creds['user']}:{creds['password']}".encode()).decode()

def api(path):
    url=f"{host}/index.php?/api/v2/{path}"
    req=urllib.request.Request(url, headers={'Authorization':f'Basic {auth}','Content-Type':'application/json'})
    with urllib.request.urlopen(req) as r:
        return json.load(r)

# get sections under suite
secs=[]
offset=0
while True:
    d=api(f"get_sections/1&suite_id=1&limit=250&offset={offset}")
    arr=d['sections'] if isinstance(d,dict) and 'sections' in d else d
    secs.extend(arr)
    nxt=None
    if isinstance(d,dict):
        nxt=d.get('_links',{}).get('next')
    if not nxt: break
    offset+=250

# Founder mode tree: root 20434 and descendants
byid={s['id']:s for s in secs}
def is_desc(sid, root=20434):
    seen=set()
    cur=sid
    while cur is not None and cur not in seen:
        seen.add(cur)
        if cur==root: return True
        s=byid.get(cur)
        if not s: return False
        cur=s.get('parent_id')
    return False

fm=[s for s in secs if is_desc(s['id'])]
print("FOUNDER MODE SECTIONS:")
for s in sorted(fm,key=lambda x:(x.get('parent_id') or 0, x['id'])):
    print(f"  {s['id']}\tparent={s.get('parent_id')}\t{s['name']}")

json.dump([s['id'] for s in fm], open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/fm_sids.json','w'))
