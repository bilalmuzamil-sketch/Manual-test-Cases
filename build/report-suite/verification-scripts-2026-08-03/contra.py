import json,re,csv,collections
ours=json.load(open('rs-ours.json'))
sects={s['id']:s for s in json.load(open('rs-sections.json'))}
def rep(sid):
    ch=[];s=sects.get(sid)
    while s: ch.append(s['name']); s=sects.get(s['parent_id'])
    ch=list(reversed(ch)); return ch[1] if len(ch)>1 else '?'
idmap={}
for r in csv.DictReader(open('/home/user/Manual-test-Cases/build/report-suite/testrail-id-map.csv')):
    idmap[int(r['testrail_case_id'].lstrip('Cc'))]=r['internal_id']
ar=re.compile(r'\bS\d+-(?:R|N|E)\d+[a-z]?\b')
def txt(c): return ' \n '.join([c.get('custom_preconds') or '',c.get('custom_steps') or '',c.get('custom_expected') or ''])

# ---- A) opposite-assertion keyword pairs within the same report ----
PAIRS=[('hidden','shown'),('is hidden','is shown'),('disabled','enabled'),('editable','locked'),
       ('not offered','offered'),('is not listed','is listed'),('never','always')]
# ---- B) same-anchor clusters, flag those where one says X and another says not-X on the same control
clusters=collections.defaultdict(list)
for c in ours:
    r=rep(c['section_id'])
    for a in set(ar.findall(c.get('refs') or '')): clusters[(r,a)].append(c)
multi={k:v for k,v in clusters.items() if len(v)>1}
print('same-report same-anchor clusters with >1 case:',len(multi))

# For each cluster, extract sentences mentioning a shared capitalized control and check polarity
NEG=re.compile(r'\b(?:not|no|never|hidden|absent|excluded|denied|cannot|does not|is not|un-?available|refus)',re.I)
POS=re.compile(r'\b(?:is shown|appears|is listed|is offered|is visible|is included|is present|opens|allows|can )',re.I)
def controls(s):
    return set(re.findall(r'\b(?:[A-Z][a-z]+(?: [A-Z][a-z]+){0,3})\b', s))
susp=[]
for (r,a),cs in sorted(multi.items()):
    # sentence-level polarity on the same control noun
    sm=collections.defaultdict(list)
    for c in cs:
        for sent in re.split(r'(?<=[.;])\s+', txt(c)):
            if len(sent)<15: continue
            for ctl in controls(sent):
                if len(ctl)<5: continue
                pol = 'NEG' if NEG.search(sent) else ('POS' if POS.search(sent) else None)
                if pol: sm[ctl].append((pol,c['id'],sent[:150]))
    for ctl,v in sm.items():
        pols={p for p,_,_ in v}; ids={i for _,i,_ in v}
        if len(pols)>1 and len(ids)>1:
            susp.append((r,a,ctl,v))
print('raw polarity-conflict candidates:',len(susp))
# Focus on high-value controls
KEY=re.compile(r'Location|Column|Totals|Status|Permission|Multiple|Summary|Expanded|Subtotal|Branch|Unassigned|Selector|Selection|Reports|Menu|Filter')
foc=[s for s in susp if KEY.search(s[2])]
print('candidates on high-value controls:',len(foc))
for r,a,ctl,v in foc[:40]:
    ids=sorted({i for _,i,_ in v})
    if len(ids)<2: continue
    print('\n### [%s %s] control=%r  cases=%s'%(r[:8],a,ctl,['C%d(%s)'%(i,idmap.get(i,'?')) for i in ids]))
    seen=set()
    for p,i,s in v:
        k=(p,i)
        if k in seen: continue
        seen.add(k); print('   %s C%d: %s'%(p,i,s))
