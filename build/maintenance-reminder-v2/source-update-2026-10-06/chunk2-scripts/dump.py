import json,re,html,sys
d=json.load(open('/home/user/Manual-test-Cases/build/maintenance-reminder-v2/snapshots-2026-10-06/chunk2-cases-before.json'))
def li(h): return [html.unescape(re.sub(r'<[^>]+>','',x)).strip() for x in re.findall(r'<li>(.*?)</li>',h or '',re.S)]
out=[]
for c in d:
    e=c['custom_expected'] or ''
    parts=e.split('<strong>Source')
    res=li(parts[0]); 
    src=html.unescape(re.sub(r'<[^>]+>',' ',re.search(r'</strong><br>(.*?)</p>',e,re.S).group(1))) if '<br>' in e else ''
    q=[html.unescape(re.sub(r'<[^>]+>','',x)) for x in re.findall(r'<li>(.*?)</li>',e.split('Exact quotes')[1],re.S)] if 'Exact quotes' in e else []
    out.append(f"##C{c['id']} [{c['section_name']}|sec {c['section_id']}] {c['title']}\nPRE: "+" || ".join(li(c['custom_preconds']))+"\nSTEPS: "+" || ".join(li(c['custom_steps']))+"\nRES: "+" || ".join(res)+"\nSRC: "+src+"\nQ: "+" || ".join(q)+"\n")
open(sys.argv[1],'w').write("\n".join(out))
