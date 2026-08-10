import json,re,sys
sys.path.insert(0,'/tmp/rs5')
from reqx import text_of, defs
LIVE={'SBR':'/tmp/conf_585629698.json','PV':'/tmp/conf_620888066.json','IV':'/tmp/conf_720142338.json'}
body={g:text_of(p) for g,p in LIVE.items()}
D={g:defs(body[g]) for g in LIVE}
ANCH=re.compile(r'\bS\d+-(?:R|N|E)\d+[a-z]?\b')
sc=json.load(open('scope-cases.json'))
rows=[]
missing={}
for rep,cs in sc.items():
    for c in cs:
        ex=c.get('custom_expected') or ''; refs=c.get('refs') or ''
        prov=[l for l in ex.splitlines() if l.strip().startswith('This is the expected behaviour')]
        p=prov[0] if prov else ''
        a_prov=sorted(set(ANCH.findall(p)))
        a_refs=sorted(set(ANCH.findall(refs)))
        allA=sorted(set(a_prov)|set(a_refs))
        miss=[a for a in allA if a not in D[rep]]
        # fallback: is the anchor ANYWHERE in the body text?
        miss2=[a for a in miss if not re.search(r'\b'+re.escape(a)+r'\b', body[rep])]
        rows.append(dict(rep=rep,cid=c['id'],title=c['title'],prov=p,refs=refs,a_prov=a_prov,a_refs=a_refs,
                         missing_from_defs=miss, missing_from_body=miss2))
        if miss: missing.setdefault(rep,[]).append((c['id'],miss,miss2))
json.dump(rows,open('anchors.json','w'),indent=1)
print('cases',len(rows))
tot=sum(1 for r in rows if r['missing_from_defs'])
print('cases citing an anchor NOT in extracted definitions:',tot)
tot2=sum(1 for r in rows if r['missing_from_body'])
print('cases citing an anchor NOT ANYWHERE in the live body:',tot2)
for rep,v in missing.items():
    print(' ',rep)
    for cid,m,m2 in v: print('   C%d'%cid,'defs-miss',m,'body-miss',m2)
