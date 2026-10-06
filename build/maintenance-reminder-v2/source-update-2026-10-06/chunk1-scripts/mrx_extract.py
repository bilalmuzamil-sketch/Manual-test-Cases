import sys, html
from html.parser import HTMLParser
BLOCK={'div','p','h1','h2','h3','h4','h5','h6','li','tr','table','section','br','button','label','option','td','th','header','footer','ul','ol','a','summary','details','input','select','textarea'}
SKIP={'script','style','svg','helmet','head','title'}
class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.out=[]; s.skip=0; s.cur=[]
    def flush(s):
        t=' '.join(''.join(s.cur).split())
        if t: s.out.append(t)
        s.cur=[]
    def handle_starttag(s,tag,attrs):
        if tag in SKIP: s.skip+=1; return
        if s.skip: return
        if tag in BLOCK: s.flush()
        a=dict(attrs)
        for k in ('placeholder','title','aria-label','value','alt','data-label'):
            v=a.get(k)
            if v and v.strip() and tag!='svg': s.out.append('['+k+': '+' '.join(v.split())+']')
        if a.get('id') and tag in ('div','section'): s.out.append('{#'+a['id']+'}')
    def handle_startendtag(s,tag,attrs): s.handle_starttag(tag,attrs); 
    def handle_endtag(s,tag):
        if tag in SKIP: s.skip=max(0,s.skip-1); return
        if s.skip: return
        if tag in BLOCK: s.flush()
    def handle_data(s,d):
        if s.skip: return
        s.cur.append(d)
p=P(); p.feed(open(sys.argv[1],encoding='utf-8').read()); p.flush()
# collapse consecutive duplicates? keep all
open(sys.argv[2],'w').write('\n'.join(p.out)+'\n')
