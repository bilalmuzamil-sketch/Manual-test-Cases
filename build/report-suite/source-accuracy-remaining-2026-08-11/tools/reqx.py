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
ANCH=r'S\d+-(?:R|N|E)\d+[a-z]?'
def defs(t):
    out={}
    for m in re.finditer(r'(?:^|\n|\| |\. )\s*('+ANCH+r')\s*(?:\([^)]{0,90}\))?\s*:\s*', t):
        a=m.group(1); st=m.end()
        nxt=re.search(r'(?:\n|\| |\. )\s*'+ANCH+r'\s*(?:\([^)]{0,90}\))?\s*:\s*', t[st:])
        end = st+nxt.start() if nxt else st+900
        body=re.sub(r'\s+',' ',t[st:end]).strip()
        body=re.split(r'(?:Context note:|Change Log|Story \d+:|\d\. (?:Key Decisions|User Feedback|Change Log))', body)[0].strip()
        out.setdefault(a, []).append(body[:700])
    return out
if __name__=='__main__':
    CHAINS={'SBR':[('15','/tmp/rs5/conf_SBR15.json'),('16','/tmp/rs5/conf_SBR16.json'),('17','/tmp/rs5/conf_SBR17.json'),('18','/tmp/conf_585629698.json')],
            'PV':[('4','/tmp/rs5/conf_PV4.json'),('5','/tmp/rs5/conf_PV5.json'),('6','/tmp/conf_620888066.json')],
            'IV':[('3','/tmp/rs5/conf_IV3.json'),('4','/tmp/rs5/conf_IV4.json'),('5','/tmp/conf_720142338.json')]}
    allres={}
    for g,chain in CHAINS.items():
        prev=None; prevv=None
        allres[g]={}
        for v,p in chain:
            d=defs(text_of(p))
            allres[g][v]={a:vv[0] for a,vv in d.items()}
            allres[g].setdefault('_dups',{})[v]=sorted([a for a,vv in d.items() if len(vv)>1])
            if prev is not None:
                n={a:vv[0] for a,vv in d.items()}
                added=sorted(set(n)-set(prev)); removed=sorted(set(prev)-set(n))
                changed=[a for a in sorted(set(n)&set(prev)) if n[a]!=prev[a]]
                print(f"### {g} v{prevv} -> v{v}: {len(prev)} -> {len(n)} defs | ADDED {added} | REMOVED {removed} | CHANGED {changed}")
                for a in changed:
                    print(f"   ~ {a}\n     OLD: {prev[a][:280]}\n     NEW: {n[a][:280]}")
                for a in added:
                    print(f"   + {a}: {n[a][:250]}")
                for a in removed:
                    print(f"   - {a}: {prev[a][:250]}")
            prev={a:vv[0] for a,vv in d.items()}; prevv=v
        print(f"  {g} duplicate-numbered anchors per version: {allres[g]['_dups']}")
        print()
    json.dump(allres, open('/tmp/rs5/defs.json','w'))
