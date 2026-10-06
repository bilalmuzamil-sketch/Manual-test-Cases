import re,html,sys
src,txt,out=sys.argv[1],sys.argv[2],sys.argv[3]
t=open(src,encoding='utf-8').read()
t2=re.sub(r'<(script|style)[^>]*>.*?</\1>','',t,flags=re.S)
vals=re.findall(r'\b(?:title|placeholder|aria-label|alt|value|data-tip|data-tooltip|data-hint)="([^"]*)"',t2)
vals+=re.findall(r"\b(?:title|placeholder|aria-label|alt|value|data-tip|data-tooltip|data-hint)='([^']*)'",t2)
vals=[re.sub(r'\s+',' ',html.unescape(v)).strip() for v in vals]
known=set(l.strip() for l in open(txt,encoding='utf-8'))
u=[]; seen=set()
for v in vals:
    if v and v not in seen: seen.add(v); u.append(v)
new=[v for v in u if v not in known]
open(out,'w').write('\n'.join(u))
print(len(vals),'attr values;',len(u),'distinct;',len(new),'not in text extraction')
for v in new: print('  ',v[:400])
