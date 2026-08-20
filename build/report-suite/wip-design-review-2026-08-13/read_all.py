import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as tr
CIDS = [30487,30488,30489,30490,30491,30493,43818,30520,30524,43838]
summary=[]
for cid in CIDS:
    st,d = tr.get_case(cid)
    if st!=200:
        print(f"C{cid}: ERROR {st}"); continue
    json.dump(d, open(f'snapshots/C{cid}-PRE.json','w'), indent=2)
    summary.append((cid, d['title'], d.get('custom_atmstatus'), d.get('section_id')))
print(f"{'C-id':<8}{'atm':<5}{'sec':<7}title")
for cid,t,atm,sec in summary:
    flag = " <<AUTOMATED>>" if atm==3 else ""
    print(f"C{cid:<7}{str(atm):<5}{str(sec):<7}{t}{flag}")
