import json, sys
sys.path.insert(0, '..')
from api import call
import seedlib
from ops import log
C=json.load(open('../loc-c.json')); A=('b3c8c820-f815-4cf1-8938-10956c5ee71a','America/Edmonton')
def switch(wid, tz, label):
    r=call('qa','/api/iam/change-location','POST',{'workplace_id':wid,'workplace_timezone':tz},allow_change_location=True)
    log('change_location (QA lead session)',label,r['status'],'ok' if r['status'] in (200,201) else r['raw'][:200]); 
    if r['status'] not in (200,201): raise SystemExit('switch failed')
L=seedlib.Ledger('qa')
switch(C['id'],'America/Edmonton',C['name'])
try:
    seedlib.CUR_LT.clear(); seedlib.CUR_LT['fixed_total']=True
    cu=seedlib.customer('qa',L,'V1R87C','ZZAUTOTEST AR V1R-87 Location C')
    log('create_customer','ZZAUTOTEST AR V1R-87 Location C',201,f"company_id={cu['id']} account={cu['account']}")
    inv=seedlib.invoice('qa',L,'V1R87C',cu,87,'2026-11-01T18:00:00.000Z')
    r=call('qa',f"/api/work-orders/view/{inv['wo']}"); w=(r['json'] or {}).get('data',{}).get('work_order',{})
    log('create_invoice','ZZAUTOTEST V1R-87 Location C invoice',r['status'],f"read back: WO {w.get('number')} workplace={w.get('workplace_name') or w.get('workplace_id')} status={w.get('status')} invoice_id={inv.get('invoice_id')} total={w.get('total_cost')} resp={inv.get('resp')}",{'wo_id':inv['wo']})
    json.dump({'customer':cu,'invoice':inv,'wo_view_keys':sorted(w.keys())[:80],'workplace':{k:w.get(k) for k in w if 'workplace' in k or 'location' in k}},open('../c-invoice.json','w'),indent=1)
finally:
    switch(A[0],A[1],'Staging Heavy Duty - 9919 (back)')
