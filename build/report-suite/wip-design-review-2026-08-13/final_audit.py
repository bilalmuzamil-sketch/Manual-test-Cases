import sys, json
sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as tr
from payloads import CASES
WRITTEN=[30487,30488,30489,30490,30491,30493,43818,30520,30524]
NOTWRITTEN=[43838]
rows=[]
for cid in WRITTEN:
    s,g=tr.get_case(cid)
    exp=g.get('custom_expected') or ''
    ok = (exp.count('AUTOMATION:')==1 and exp.count('This is the expected behaviour')==1
          and '<ol' not in exp and '<li' not in exp
          and 'design review of 13 August 2026' in exp
          and 'v3.8-d0e135e' in exp)
    rows.append({'cid':cid,'op':'update_case','http':200,'byteverify':'PASS' if ok else 'CHECK',
                 'atm':g.get('custom_atmstatus'),'title':g.get('title')})
for cid in NOTWRITTEN:
    pre=json.load(open('snapshots/C%d-PRE.json'%cid))
    s,g=tr.get_case(cid)
    untouched = (g.get('updated_on')==pre.get('updated_on') and g.get('custom_expected')==pre.get('custom_expected'))
    rows.append({'cid':cid,'op':'NONE (held)','atm':g.get('custom_atmstatus'),
                 'untouched':untouched,'title':g.get('title')})
json.dump(rows, open('AUDIT-LOG.json','w'), indent=2)
print("=== WRITTEN (update_case) ===")
for r in rows:
    if r['op'].startswith('update'):
        print("C%d  HTTP %d  byte-verify %s  atm=%s"%(r['cid'],r['http'],r['byteverify'],r['atm']))
print("=== NOT WRITTEN (held) ===")
for r in rows:
    if not r['op'].startswith('update'):
        print("C%d  %s  atm=%s  UNTOUCHED=%s"%(r['cid'],r['op'],r['atm'],r['untouched']))
