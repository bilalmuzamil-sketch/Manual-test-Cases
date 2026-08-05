#!/usr/bin/env python3
"""Execute writeplan.json against TestRail with Rule-50 verification.
EVERY payload carries all three text fields (TestRail re-renders any text field you omit).
Every write is re-GET and compared field by field: intended fields byte-equal, every other
field byte-identical to the pre-write snapshot. On ANY mismatch the batch STOPS."""
import json,os,sys,time
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import tr
plan=json.load(open(f'{D}/writeplan.json'))
PRE={c['id']:c for c in json.load(open(f'{D}/PRE/cases-4281.json'))}
oplog=[]; dry = '--go' not in sys.argv
def log(**kw):
    oplog.append(kw); print(json.dumps(kw)[:260])
# ---------- updates ----------
for u in plan['updates']:
    cid=u['case_id']; f=u['fields']
    body=dict(f)
    # ALWAYS send all three text fields (playbook J normalisation #3)
    for k in ('custom_preconds','custom_steps','custom_expected'):
        body.setdefault(k, PRE[cid].get(k))
    if dry:
        log(op='update_case',case_id=cid,dry=True,fields=sorted(body)); continue
    s,d=tr.api(f'update_case/{cid}',body)
    if s!=200:
        log(op='update_case',case_id=cid,http=s,error=str(d)[:400],verified=False)
        json.dump(oplog,open(f'{D}/oplog.json','w'),indent=1); raise SystemExit(f'STOP: update_case/{cid} -> {s}')
    s2,live=tr.api(f'get_case/{cid}')
    ok,probs,nf=tr.verify(live,PRE[cid],body)
    log(op='update_case',case_id=cid,http=s,fields_compared=nf,verified=ok,problems=probs)
    if not ok:
        json.dump(oplog,open(f'{D}/oplog.json','w'),indent=1)
        raise SystemExit(f'STOP: byte-verification FAILED on C{cid}: {json.dumps(probs)[:2000]}')
# ---------- adds ----------
added=[]
for a in plan['adds']:
    body={"title":a['title'],"refs":a['refs'],"custom_preconds":a['preconds'],
          "custom_steps":a['steps'],"custom_expected":a['expected'],
          "type_id":6,"priority_id":2,"template_id":1,
          "custom_atmstatus":3,"custom_automation_type":0}
    if dry:
        log(op='add_case',internal_id=a['internal_id'],section=a['section_id'],dry=True); continue
    s,d=tr.api(f"add_case/{a['section_id']}",body)
    if s!=200:
        log(op='add_case',internal_id=a['internal_id'],http=s,error=str(d)[:400],verified=False)
        json.dump(oplog,open(f'{D}/oplog.json','w'),indent=1); raise SystemExit(f"STOP: add_case -> {s} {d}")
    cid=d['id']; s2,live=tr.api(f'get_case/{cid}')
    ok,probs,nf=tr.verify(live,live,body)   # nothing pre-existing; every intended field must match
    log(op='add_case',internal_id=a['internal_id'],case_id=cid,http=s,fields_compared=nf,verified=ok,problems=probs)
    if not ok:
        json.dump(oplog,open(f'{D}/oplog.json','w'),indent=1)
        raise SystemExit(f"STOP: byte-verification FAILED on new C{cid}: {json.dumps(probs)[:2000]}")
    added.append({"internal_id":a['internal_id'],"case_id":cid,"section_id":a['section_id']})
json.dump(oplog,open(f'{D}/oplog.json','w'),indent=1)
json.dump(added,open(f'{D}/added-cases.json','w'),indent=1)
print("\nDRY RUN" if dry else "\nEXECUTED", "| ops",len(oplog),"| added",added)
