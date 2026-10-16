# Third write, 16 Oct evening: last two gate items. (1) C368151, C590120: the moved paragraph gets the provenance heading the
# suite uses ("Source — where this behaviour comes from"), wording unchanged; (2) C590114: say how to make {Work-order-2}
# Invoiced, with the staging labels observed 14-16 Oct (Finance tab > Mark Reviewed > Mark as reviewed: Mileage / Engine Hours >
# Confirm review; Finance tab > Create Invoice).
import json,sys,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
H=('<p><strong>Source:</strong> ','<p><strong>Source — where this behaviour comes from</strong></p><p>')
INV=('and an Invoiced work order {Work-order-2}, led by {Technician-A}.<br>',
     'and an Invoiced work order {Work-order-2}, led by {Technician-A}. To make it Invoiced: create it like {Work-order-1} with one approved line, complete the line, then on its Finance tab click Mark Reviewed (fill Mileage or Engine Hours if the Mark as reviewed window asks, then click Confirm review) and click Create Invoice.<br>')
PLAN={368151:('custom_expected',H),590120:('custom_expected',H),590114:('custom_preconds',INV)}
write='--write' in sys.argv; log=open(f'{D}/write-log.txt','a') if write else None
for i,(f,(a,b)) in PLAN.items():
    cur=L.call(f'get_case/{i}'); time.sleep(0.4)
    assert cur['created_by']==3 and cur['updated_by']==3,(i,'guard')
    t=cur[f]; assert t.count(a)==1,(i,a,t.count(a)); d={f:t.replace(a,b)}
    if not write: print(i,'PREVIEW',f); continue
    r=L.call(f'update_case/{i}',d); time.sleep(1)
    ok=r[f]==d[f] and all(r[x]==cur[x] for x in ('title','custom_atmstatus','custom_steps')+tuple(x for x in ('custom_preconds','custom_expected') if x!=f))
    line=f"{time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())} update_case C{i} atmstatus={cur['custom_atmstatus']} fields=['{f}'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line+'\n'); log.flush()
