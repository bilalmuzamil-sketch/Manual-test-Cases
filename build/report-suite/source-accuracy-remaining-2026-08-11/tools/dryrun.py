import json,re,sys
sys.path.insert(0,'/tmp/rs5')
from restamp import LIVE, NAME, SPECIAL, plan, sanity, mask_ok
sc={}
for r,cs in json.load(open('scope-cases.json')).items():
    for c in cs: sc[c['id']]=(r,c)
HOLD=set(json.load(open('locdep.json'))) | {30588}
ids=[cid for cid in sorted(sc) if cid not in HOLD]
print('scope 251 | HOLD',len(HOLD),'| write-candidates',len(ids))
changed=0; noop=[]; errs=[]
plan_out={}
for cid in ids:
    rep,c=sc[cid]
    exp0=c.get('custom_expected') or ''; refs0=c.get('refs') or ''
    exp,refs=plan(c,rep)
    for field,old,new in [(f,o,n) for f,o,n in SPECIAL.get(cid,[])]:
        tgt = exp if field=='exp' else refs
        if old not in tgt: errs.append((cid,field,'ANCHOR NOT FOUND',old[:60])); continue
        if field=='exp': exp=exp.replace(old,new)
        else: refs=refs.replace(old,new)
    if exp==exp0 and refs==refs0: noop.append((rep,cid)); continue
    # masked proof for the pure-version part (skip cases with a special edit; verified by hand)
    if cid not in SPECIAL:
        try:
            mask_ok(exp0,exp,r'(?<=report specification version )\d+',cid,'expected',4)
            mask_ok(refs0,refs,r'(?<=%s spec v)\d+ \d{4}-\d{2}-\d{2}'%rep,cid,'refs',2)
        except RuntimeError as e: errs.append((cid,'mask',str(e),'')); continue
    try: sanity(exp,refs,cid)
    except AssertionError as e: errs.append((cid,'sanity',str(e),'')); continue
    plan_out[cid]={'rep':rep,'exp':exp,'refs':refs,'exp0':exp0,'refs0':refs0,
                   'exp_changed':exp!=exp0,'refs_changed':refs!=refs0,'special':cid in SPECIAL}
    changed+=1
print('planned writes:',changed,'| no-ops:',len(noop),'| errors:',len(errs))
for e in errs: print('   ERR',e)
for r,cid in noop: print('   NOOP',r,'C%d'%cid)
json.dump(plan_out,open('plan.json','w'),indent=1)
json.dump(sorted(HOLD),open('hold.json','w'),indent=1)
