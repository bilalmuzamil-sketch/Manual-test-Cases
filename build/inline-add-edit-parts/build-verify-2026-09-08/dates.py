import json,base64,urllib.request,re,html as H,collections
c=json.load(open('/tmp/testrail/creds.json'))
auth=base64.b64encode(f"{c['email']}:{c['password']}".encode()).decode()
BASE=c.get('base','https://shopview.testrail.io')+'/index.php?/api/v2/'
def api(p):
    r=urllib.request.Request(BASE+p,headers={'Authorization':'Basic '+auth});return json.load(urllib.request.urlopen(r,timeout=60))
def paged(p,k):
    out=[];off=0
    while True:
        d=api(f'{p}&limit=250&offset={off}');items=d[k] if isinstance(d,dict) else d;out+=items
        if isinstance(d,dict) and d.get('_links',{}).get('next'):off+=250
        else:break
    return out
def txt(h):
    h=re.sub(r'<[^>]+>',' ',h or '');return H.unescape(re.sub(r'\s+',' ',h)).strip()
secs="6617,6761,6762,6763,6764,6765,6766,6597,6755,6756,6757,6758,6759,6760,6771".split(',')
UNCONF=set("C45046 C45047 C45060 C45065 C45067 C45111 C45226 C45227 C45232 C45233 C45234 C45235 C45238 C45243".split())
VLAD=set("C45220 C45268 C53474 C53475".split())
BUILDRE=re.compile(r'Last checked against build v26\.35\.6-598cc8a on ([\d/]+)')
bydate=collections.defaultdict(list)
for s in secs:
    for case in paged(f'get_cases/1&section_id={s}','cases'):
        cid=f"C{case['id']}"
        exp=txt(case.get('custom_expected') or '')
        m=BUILDRE.search(exp)
        if not m: continue
        if case.get('created_by')==1: continue  # Vladimir
        if cid in UNCONF or cid in VLAD: continue
        bydate[m.group(1)].append((case['id'],case.get('custom_atmstatus')))
for d,items in sorted(bydate.items()):
    autom=[f"C{i}" for i,a in items if a==3]
    print(f"date {d!r}: {len(items)} cases; automated={autom}")
    print("   ids:", ",".join(str(i) for i,_ in items))
