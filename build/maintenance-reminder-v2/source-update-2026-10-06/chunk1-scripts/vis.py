import sys,re,html
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.skip=0; s.out=[]; s.scripts=[]; s.cur=None
    def handle_starttag(s,t,a):
        if t in("script","style"): s.skip+=1; s.cur=[] if t=="script" else None
        if t in ("div","p","br","li","tr","h1","h2","h3","h4","td","th","button","section"): s.out.append("\n")
        for k,v in a:
            if k in("title","aria-label","placeholder","data-tip","alt") and v: s.out.append(f" [{k}:{v}] ")
    def handle_endtag(s,t):
        if t in("script","style"):
            s.skip-=1
            if s.cur is not None: s.scripts.append("".join(s.cur)); s.cur=None
    def handle_data(s,d):
        if s.skip:
            if s.cur is not None: s.cur.append(d)
        else: s.out.append(d)
p=P(); p.feed(open(sys.argv[1],encoding="utf-8").read())
txt="".join(p.out)
lines=[re.sub(r"\s+"," ",l).strip() for l in txt.split("\n")]
lines=[l for l in lines if l]
open(sys.argv[2],"w").write("\n".join(lines)+"\n")
open(sys.argv[3],"w").write("\n\n=====SCRIPT=====\n".join(p.scripts))
print(len(lines),"lines;",sum(len(x) for x in p.scripts),"script chars")
