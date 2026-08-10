import json,re,html,sys
from html.parser import HTMLParser
class S(HTMLParser):
    def __init__(s): super().__init__(); s.o=[]
    def handle_data(s,d): s.o.append(d)
    def handle_endtag(s,t):
        if t in ('p','li','td','tr','h1','h2','h3','h4','div','table'): s.o.append('\n')
def text_of(path):
    d=json.load(open(path)); b=d['body']['storage']['value']
    p=S(); p.feed(b); t=html.unescape(''.join(p.o))
    t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
    return t
def reqs_from(t):
    out={}
    for m in re.finditer(r'\b(S\d+-(?:R|N|E)\d+[a-z]?)\b\s*[:—–-]?\s*', t):
        a=m.group(1); st=m.end()
        nxt=re.search(r'\b(S\d+-(?:R|N|E)\d+[a-z]?)\b\s*[:—–-]?\s*', t[st:])
        body=t[st: st+(nxt.start() if nxt else 1200)].strip()
        body=re.sub(r'\s+',' ',body)[:900]
        if a not in out or len(body)>len(out[a]): out[a]=body
    return out
PAIRS=[('SBC','/tmp/conf_SBC15.json','/tmp/conf_577634305.json',15,16),
       ('TU','/tmp/conf_TU6.json','/tmp/conf_641400833.json',6,7),
       ('WIP','/tmp/conf_WIP9.json','/tmp/conf_703660034.json',9,10)]
res={}
for g,old,new,vo,vn in PAIRS:
    ro=reqs_from(text_of(old)); rn=reqs_from(text_of(new))
    added=sorted(set(rn)-set(ro)); removed=sorted(set(ro)-set(rn))
    changed=[a for a in sorted(set(ro)&set(rn)) if ro[a]!=rn[a]]
    res[g]=dict(vo=vo,vn=vn,added=added,removed=removed,changed=changed,old=ro,new=rn)
    print(f"== {g} v{vo} -> v{vn} : {len(ro)}->{len(rn)} anchors | ADDED {added} | REMOVED {removed} | CHANGED {len(changed)}")
    for a in changed:
        print(f"   -- {a}")
        print(f"      OLD: {ro[a][:260]}")
        print(f"      NEW: {rn[a][:260]}")
json.dump({g:{k:v for k,v in d.items() if k!='old' and k!='new'} for g,d in res.items()}, open('/tmp/rs4/specdiff.json','w'), indent=1)
json.dump({g:{'old':d['old'],'new':d['new']} for g,d in res.items()}, open('/tmp/rs4/specbodies.json','w'))
