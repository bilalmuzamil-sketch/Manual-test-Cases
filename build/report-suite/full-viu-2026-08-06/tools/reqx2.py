import json,re,html
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
    """Only DEFINITION occurrences: 'Sn-Rn:' at a line/cell start-ish, text until next anchor-def or newline-block."""
    out={}
    for m in re.finditer(r'(?:^|\n|\| |\. )\s*('+ANCH+r')\s*(?:\([^)]{0,90}\))?\s*:\s*', t):
        a=m.group(1); st=m.end()
        nxt=re.search(r'(?:\n|\| |\. )\s*'+ANCH+r'\s*(?:\([^)]{0,90}\))?\s*:\s*', t[st:])
        end = st+nxt.start() if nxt else st+900
        body=re.sub(r'\s+',' ',t[st:end]).strip()
        # trim at an obvious section break
        body=re.split(r'(?:Context note:|Change Log|Story \d+:|\d\. (?:Key Decisions|User Feedback|Change Log))', body)[0].strip()
        out.setdefault(a, []).append(body[:700])
    return out
PAGES={'SBC':'/tmp/conf_577634305.json','TU':'/tmp/conf_641400833.json','WIP':'/tmp/conf_703660034.json'}
OLD={'SBC':'/tmp/conf_SBC15.json','TU':'/tmp/conf_TU6.json','WIP':'/tmp/conf_WIP9.json'}
res={}
for g,p in PAGES.items():
    n=defs(text_of(p)); o=defs(text_of(OLD[g]))
    dup={a:v for a,v in n.items() if len(v)>1}
    print(f"{g}: {len(n)} anchor definitions (live) | {len(o)} (previous) | DUPLICATE-NUMBERED: {sorted(dup)}")
    res[g]={'new':{a:v[0] for a,v in n.items()},'new_all':n,'old':{a:v[0] for a,v in o.items()},'old_all':o}
json.dump(res, open('/tmp/rs4/defs.json','w'))
# recompute changed/added/removed on definitions only
for g,d in res.items():
    n,o=d['new'],d['old']
    added=sorted(set(n)-set(o)); removed=sorted(set(o)-set(n))
    changed=[a for a in sorted(set(n)&set(o)) if n[a]!=o[a]]
    print(f"\n### {g}: ADDED {added} | REMOVED {removed} | CHANGED {changed}")
    for a in changed:
        print(f"  {a}\n   OLD: {o[a][:300]}\n   NEW: {n[a][:300]}")
