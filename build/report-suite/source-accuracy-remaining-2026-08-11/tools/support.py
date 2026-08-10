import json,re,sys
sys.path.insert(0,'/tmp/rs5')
from reqx import text_of, defs
LIVE={'SBR':'/tmp/conf_585629698.json','PV':'/tmp/conf_620888066.json','IV':'/tmp/conf_720142338.json'}
D={g:defs(text_of(p)) for g,p in LIVE.items()}
sc={r:{c['id']:c for c in cs} for r,cs in json.load(open('scope-cases.json')).items()}
rows=json.load(open('anchors.json'))
STOP=set('the a an of to in on and or is are be for with by that this it its as at from when than then not no all any each one two shows show shown user users report reports case test if which their they only same both new see sees value values row rows column columns'.split())
def toks(s): return set(w for w in re.findall(r'[a-z][a-z0-9\-]{2,}', s.lower()) if w not in STOP)
out=[]
for r in rows:
    c=sc[r['rep']][r['cid']]
    casetext=' '.join([c['title'], c.get('custom_preconds') or '', c.get('custom_steps') or '', (c.get('custom_expected') or '')])
    ct=toks(casetext)
    anchors=r['a_prov'] or r['a_refs']
    if not anchors: out.append(dict(r, score=None, note='NO ANCHOR CITED')); continue
    best=0; bestA=None
    for a in anchors:
        rt=toks(D[r['rep']].get(a,[''])[0])
        if not rt: continue
        ov=len(ct&rt)/max(1,len(rt))
        if ov>best: best,bestA=ov,a
    out.append(dict(r, score=round(best,3), best_anchor=bestA))
json.dump(out,open('support.json','w'),indent=1)
low=[o for o in out if o['score'] is not None and o['score']<0.25]
none=[o for o in out if o['score'] is None]
print('scored',len([o for o in out if o['score'] is not None]))
print('NO ANCHOR CITED:',len(none),[(o['rep'],o['cid']) for o in none])
print('BELOW 0.25 threshold (need hand read):',len(low))
for o in sorted(low,key=lambda x:x['score']): print('  %-4s C%d %.2f %s | %s'%(o['rep'],o['cid'],o['score'],o['best_anchor'],o['title'][:70]))
