import json,csv,content_lib as C,engine,sys
sys.path.insert(0,'/tmp'); import tr
def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))
idmap={}
for r in csv.DictReader(open('../testrail-id-map.csv')): idmap[int(r['testrail_case_id'][1:])]=r['internal_id']
inv={v:k for k,v in idmap.items()}
oplog=open('oplog-content.txt','a'); oplog.write("\n=== WIP: Total=Earned+Remaining+Adjustments (S4-R21); false-positives pin-routed ===\n")
def log(m): oplog.write(m+'\n'); oplog.flush(); print(m)
# pin-route the false positives
for iid in ['WIP-CALC-12','WIP-SUM-04','WIP-API-03','WIP-API-06']:
    cid=inv[iid]; st,f=tr.req(f'get_case/{cid}'); assert st==200
    pay,meta=engine.process(cid,f)
    for k in ('custom_preconds','custom_steps','custom_expected'): pay.setdefault(k,f.get(k) or '')
    st,b=tr.req(f'update_case/{cid}',pay); assert st==200,(cid,st,b)
    st2,l2=tr.req(f'get_case/{cid}')
    for k,v in pay.items():
        a=norm_refs(v) if k=='refs' else v; bb=norm_refs(l2.get(k)) if k=='refs' else l2.get(k); assert a==bb,f'{iid} {k}'
    assert f.get('title')==l2.get('title')
    log(f"  OK(pin) C{cid} {iid} marker='{meta['newmarker'][:38]}'")
# WIP-CALC-06 content rewrite (S4-R21)
cid=inv['WIP-CALC-06']; st,f=tr.req(f'get_case/{cid}'); assert st==200
def t(b):
    old3="3. Total equals Earned plus Remaining."
    new3="3. Total equals Earned plus Remaining plus Adjustments, so a row's Total matches what invoicing will produce for that work order."
    old4=("4. The Total is NOT the work order's stored grand total — it excludes tax, fees, discounts, and non-approved lines, "
          "so a difference from the work order's own grand total is EXPECTED, not a data error.")
    new4=("4. The Total is NOT the work order's stored grand total — it still excludes tax and non-approved lines "
          "(the approved fees and discounts are now carried in the Adjustments part), so a difference from the work order's own grand total is EXPECTED, not a data error.")
    assert old3 in b and old4 in b, 'WIP-CALC-06 body mismatch'
    return b.replace(old3,new3).replace(old4,new4)
div=("Note for the tester: an earlier version of this report set Total = Earned + Remaining only. "
     "The current Work In Progress report specification (version 21, S4-R21) adds the work order's approved Adjustments, "
     "so Total = Earned + Remaining + Adjustments. Follow the current specification.")
C.write_verify(cid,C.restamp(cid,f,body_transform=t,divergence=div),f,oplog)
oplog.write("=== WIP DONE ===\n"); print('WIP done')
