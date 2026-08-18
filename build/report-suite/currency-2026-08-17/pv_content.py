import json,csv,content_lib as C,sys
sys.path.insert(0,'/tmp'); import tr
idmap={}
for r in csv.DictReader(open('../testrail-id-map.csv')): idmap[int(r['testrail_case_id'][1:])]=r['internal_id']
inv={v:k for k,v in idmap.items()}
live={c['id']:c for c in json.load(open('/tmp/rs_live_cases.json'))}
oplog=open('oplog-content.txt','a'); oplog.write(f"\n=== PV CONTENT (Unit Cost->Avg Cost, Sell Price->Avg Sell; PV null CSV/PDF) ===\n")
def swap(s):
    if s is None: return s
    return s.replace('Unit Cost','Avg Cost').replace('Sell Price','Avg Sell')
label_cases=['PV-COL-01','PV-COL-02','PV-COL-03','PV-ROW-06','PV-PREC-01','PV-PREC-02',
             'PV-CALC-10','PV-CALC-11','PV-CALC-12','PV-CALC-13','PV-CALC-15','PV-CALC-16']
for iid in label_cases:
    cid=inv[iid]; lc=live[cid]
    # refetch live fresh (pin pass didn't touch content cases, but be safe)
    st,fresh=tr.req(f'get_case/{cid}'); assert st==200
    pay=C.restamp(cid, fresh,
        new_title=swap(fresh.get('title')),
        new_preconds=swap(fresh.get('custom_preconds') or ''),
        new_steps=swap(fresh.get('custom_steps') or ''),
        body_transform=lambda b: swap(b))
    C.write_verify(cid,pay,fresh,oplog)
# PV-EXP-07 special: label swap + CSV null empty / PDF em-dash
cid=inv['PV-EXP-07']; st,fresh=tr.req(f'get_case/{cid}'); assert st==200
def exp07_body(b):
    b=swap(b)
    b=b.replace(
      "1. A null value renders as — (em-dash) in BOTH the CSV and the PDF, in every nullable field: Avg Cost, Avg Sell, Margin %, On Hand, Turns / Yr, Last Sale, Min, Max.",
      "1. A null value renders as — (em-dash) in the PDF, and as an empty cell in the CSV (no em-dash), in every nullable field: Avg Cost, Avg Sell, Margin %, On Hand, Turns / Yr, Last Sale, Min, Max. The CSV leaves the cell empty so a spreadsheet can still total the column.")
    return b
div=("Note for the tester: an earlier version of this report showed the em-dash for empty cells in the CSV as well. "
     "The current Parts Velocity report specification (version 10) changes the CSV to leave those cells empty; the PDF still shows the em-dash. Follow the current specification.")
pay=C.restamp(cid,fresh,new_title=swap(fresh.get('title')),new_preconds=swap(fresh.get('custom_preconds') or ''),
              new_steps=swap(fresh.get('custom_steps') or ''),body_transform=exp07_body,divergence=div)
C.write_verify(cid,pay,fresh,oplog)
oplog.write("=== PV CONTENT DONE ===\n"); print('PV content done')
