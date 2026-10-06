import json,re,html,sys
cases=json.load(open('snapshots-2026-10-06/chunk1-cases-before.json'))
def li(h):
    return [re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',x))).strip() for x in re.findall(r'<li>(.*?)</li>',h or '',re.S)]
out=[]
for c in cases:
    e=c['custom_expected'] or ''
    m=re.search(r'<p><strong>Expected results</strong></p><ul>(.*?)</ul>',e,re.S)
    res=li(m.group(1)) if m else []
    s=re.search(r'<p><strong>Source[^<]*</strong><br>(.*?)</p>',e,re.S)
    src=html.unescape(re.sub(r'<[^>]+>','',s.group(1))).strip() if s else ''
    q=re.findall(r'<li><strong>([^<]+?):</strong>\s*&ldquo;(.*?)&rdquo;</li>',e,re.S)
    quotes=[[html.unescape(a),re.sub(r'\s+',' ',html.unescape(b)).strip()] for a,b in q]
    tail=re.sub(r'.*</ul>','',e,flags=re.S) if q else ''
    out.append(dict(id=c['id'],sec=c['section_name'],title=c['title'],pre=li(c['custom_preconds']),steps=li(c['custom_steps']),results=res,source=src,quotes=quotes,tail=html.unescape(re.sub(r'<[^>]+>',' ',tail)).strip()))
json.dump(out,open(sys.argv[1],'w'),indent=1,ensure_ascii=False)
with open(sys.argv[2],'w') as f:
    for c in out:
        f.write(f"\n##C{c['id']} [{c['sec']}] {c['title']}\nPRE: "+' || '.join(c['pre'])+"\nSTEPS: "+' || '.join(c['steps'])+"\nRES: "+' || '.join(c['results'])+"\nSRC: "+c['source']+"\nQ: "+' || '.join(a+': '+q for a,q in c['quotes'])+"\n")
