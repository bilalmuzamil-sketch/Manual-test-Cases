import json,base64,urllib.request,re,html as H
c=json.load(open('/tmp/testrail/creds.json'))
auth=base64.b64encode(f"{c['email']}:{c['password']}".encode()).decode()
BASE=c.get('base','https://shopview.testrail.io')+'/index.php?/api/v2/'
def api(p):
    r=urllib.request.Request(BASE+p,headers={'Authorization':'Basic '+auth})
    return json.load(urllib.request.urlopen(r,timeout=60))
def paged(p,k):
    out=[];off=0
    while True:
        d=api(f'{p}&limit=250&offset={off}');items=d[k] if isinstance(d,dict) else d;out+=items
        if isinstance(d,dict) and d.get('_links',{}).get('next'):off+=250
        else:break
    return out
def txt(h):
    h=re.sub(r'<[^>]+>',' ',h or '');return H.unescape(re.sub(r'\s+',' ',h)).strip()
trees={'6617':"6617,6761,6762,6763,6764,6765,6766".split(','),
       '6597':"6597,6755,6756,6757,6758,6759,6760,6771".split(',')}
BUILDRE=re.compile(r'Last checked against build ([^\s]+) on ([\d/]+)')
for suite,secs in trees.items():
    rows=[]
    for s in secs:
        for case in paged(f'get_cases/1&section_id={s}','cases'):
            exp=txt(case.get('custom_expected') or '')
            m=BUILDRE.search(exp)
            rows.append((case['id'],case.get('created_by'),case.get('custom_atmstatus'), (m.group(1) if m else None),(m.group(2) if m else None)))
    print(f"=== SUITE {suite}: {len(rows)} cases ===")
    by_build={}
    for cid,cb,atm,bld,dt in rows:
        by_build.setdefault(bld,[]).append((cid,cb,atm))
    for bld,items in by_build.items():
        print(f"  build={bld!r}: {len(items)} cases")
    # list non-mine and automated
    vlad=[f"C{cid}" for cid,cb,atm,_,_ in rows if cb==1]
    autom=[(f"C{cid}",cb) for cid,cb,atm,_,_ in rows if atm==3]
    print(f"  created_by==1 (Vladimir, NEVER touch): {vlad}")
    print(f"  Automated (atm==3): {[a for a,_ in autom]}  creators={sorted(set(cb for _,cb in autom))}")
    print(f"  created_by set: {sorted(set(cb for _,cb,_,_,_ in rows))}")
    nostamp=[f"C{cid}" for cid,cb,atm,bld,dt in rows if bld is None]
    print(f"  NO build sentence: {nostamp}")
