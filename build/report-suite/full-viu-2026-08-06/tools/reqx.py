import json,re,html,sys
from html.parser import HTMLParser
PAGES={'SBC':'577634305','SBR':'585629698','PV':'620888066','TU':'641400833','WIP':'703660034','IV':'720142338'}
class S(HTMLParser):
    def __init__(s): super().__init__(); s.o=[]
    def handle_data(s,d): s.o.append(d)
    def handle_endtag(s,t):
        if t in ('p','li','td','tr','h1','h2','h3','h4','div','table'): s.o.append('\n')
def text(pid):
    d=json.load(open(f'/tmp/conf_{pid}.json'))
    b=d['body']['storage']['value']
    p=S(); p.feed(b)
    t=html.unescape(''.join(p.o))
    t=re.sub(r'[ \t]+',' ',t)
    t=re.sub(r'\n\s*\n+','\n',t)
    return t, d['version']['number']
def reqs(pid):
    t,v=text(pid)
    out={}
    # split on anchors like S4-R13: or S4-R13 —
    for m in re.finditer(r'\b(S\d+-(?:R|N|E)\d+[a-z]?)\b\s*[:—–-]?\s*', t):
        a=m.group(1); st=m.end()
        nxt=re.search(r'\b(S\d+-(?:R|N|E)\d+[a-z]?)\b\s*[:—–-]?\s*', t[st:])
        body=t[st: st+(nxt.start() if nxt else 1200)].strip()
        body=re.sub(r'\s+',' ',body)[:900]
        if a not in out or len(body)>len(out[a]): out[a]=body
    return out,v
if __name__=='__main__':
    rep=sys.argv[1]; pid=PAGES[rep]
    r,v=reqs(pid)
    json.dump({'version':v,'reqs':r},open(f'/tmp/rs4/reqs_{rep}.json','w'),indent=1)
    print(rep,'v',v,'anchors',len(r))
    if len(sys.argv)>2:
        for a in sys.argv[2:]:
            print('---',a,':',r.get(a,'*** NOT FOUND ***')[:700])
