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
secs="6617,6761,6762,6763,6764,6765,6766,6597,6755,6756,6757,6758,6759,6760,6771".split(',')
want=["More options","Sell price","Split across bins","Pulled from","Edit Part Request","New Part Request","Add tech story"]
hits={w:[] for w in want}
for s in secs:
    for case in paged(f'get_cases/1&section_id={s}','cases'):
        pre=txt(case.get('custom_preconds') or '')
        for w in want:
            if w in pre: hits[w].append(case['id'])
for w in want:
    print(f"{w!r}: {['C%d'%i for i in hits[w]]}")
