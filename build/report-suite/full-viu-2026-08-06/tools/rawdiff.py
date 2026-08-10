import json,re,html,difflib
from html.parser import HTMLParser
class S(HTMLParser):
    def __init__(s): super().__init__(); s.o=[]
    def handle_data(s,d): s.o.append(d)
    def handle_endtag(s,t):
        if t in ('p','li','td','tr','h1','h2','h3','h4','div','table'): s.o.append('\n')
def lines(path):
    d=json.load(open(path)); b=d['body']['storage']['value']
    p=S(); p.feed(b); t=html.unescape(''.join(p.o))
    t=re.sub(r'[ \t]+',' ',t)
    return [l.strip() for l in t.split('\n') if l.strip()]
for g,old,new in [('SBC','/tmp/conf_SBC15.json','/tmp/conf_577634305.json'),
                  ('TU','/tmp/conf_TU6.json','/tmp/conf_641400833.json'),
                  ('WIP','/tmp/conf_WIP9.json','/tmp/conf_703660034.json')]:
    a,b=lines(old),lines(new)
    print(f"\n########## {g}: {len(a)} -> {len(b)} lines ##########")
    n=0
    for l in difflib.unified_diff(a,b,lineterm='',n=0):
        if l.startswith(('---','+++','@@')): continue
        n+=1
        print(l[:400])
    print(f"[{g}: {n} changed lines]")
