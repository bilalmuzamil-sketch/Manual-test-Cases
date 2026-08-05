#!/usr/bin/env python3
"""EXHAUSTIVE post-write audit (Rule 50). No sampling."""
import json,os,sys
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import tr
PRE={c['id']:c for c in json.load(open(f'{D}/PRE/cases-4281.json'))}
POST={c['id']:c for c in json.load(open(f'{D}/POST/cases-4281.json'))}
plan=json.load(open(f'{D}/writeplan.json'))
added={a['case_id'] for a in json.load(open(f'{D}/added-cases.json'))}
touched={u['case_id'] for u in plan['updates']}
out={}
# 1. every case we did NOT touch must be byte-identical INCLUDING updated_on/updated_by
bad=[]
for cid,pre in PRE.items():
    if cid in touched: continue
    post=POST.get(cid)
    if post is None: bad.append({"case_id":cid,"issue":"MISSING after the pass"}); continue
    for k in set(pre)|set(post):
        if pre.get(k)!=post.get(k):
            bad.append({"case_id":cid,"field":k,"was":repr(pre.get(k))[:200],"now":repr(post.get(k))[:200]})
out["untouched_cases_checked"]=len(PRE)-len(touched)
out["untouched_cases_differing"]=bad
# 2. the 5 foreign cases byte-identical incl. updated_on/updated_by
foreign=[cid for cid,c in PRE.items() if c['created_by']!=3]
fb=[]
for cid in foreign:
    for k in set(PRE[cid])|set(POST[cid]):
        if PRE[cid].get(k)!=POST[cid].get(k): fb.append({"case_id":cid,"field":k})
out["foreign_cases"]=sorted(foreign); out["foreign_differing"]=fb
# 3. touched cases: only the intended fields moved
tb=[]
for u in plan['updates']:
    cid=u['case_id']; intended=set(u['fields'])|{'custom_preconds','custom_steps','custom_expected'}
    for k in set(PRE[cid])|set(POST[cid]):
        if k in ('updated_on','updated_by'): continue
        if PRE[cid].get(k)!=POST[cid].get(k) and k not in intended:
            tb.append({"case_id":cid,"field":k,"was":repr(PRE[cid].get(k))[:160],"now":repr(POST[cid].get(k))[:160]})
out["touched_unintended_changes"]=tb
# 4. new cases exist and carry the required add_case fields
nb=[]
for a in json.load(open(f'{D}/added-cases.json')):
    c=POST.get(a['case_id'])
    if not c: nb.append({**a,"issue":"not present"}); continue
    for k,v in (('custom_atmstatus',3),('custom_automation_type',0),('template_id',1),('created_by',3)):
        if c.get(k)!=v: nb.append({"case_id":a['case_id'],"field":k,"got":c.get(k),"want":v})
    if c['section_id']!=a['section_id']: nb.append({"case_id":a['case_id'],"field":"section_id"})
out["new_case_problems"]=nb
# 5. markers: exactly one per case, and the tally
import re
mk={}; multi=[]
for cid,c in POST.items():
    if c['created_by']!=3: continue
    e=c['custom_expected'] or ''
    n=e.count("AUTOMATION: ")
    if n!=1: multi.append({"case_id":cid,"markers":n})
    m=re.search(r'AUTOMATION: (.+)',e)
    if m:
        v=m.group(1).strip()
        key='READY - EXPECT FAIL' if v.startswith('READY - EXPECT FAIL') else ('HOLD' if v.startswith('HOLD') else ('READY' if v=='READY' else 'OTHER:'+v[:40]))
        mk[key]=mk.get(key,0)+1
out["marker_tally"]=mk; out["cases_without_exactly_one_marker"]=multi
# 6. provenance: exactly one per case
pv=[(cid,(c['custom_expected'] or '').count("This is the expected behaviour as per")) for cid,c in POST.items() if c['created_by']==3]
out["provenance_not_exactly_one"]=[{"case_id":c,"n":n} for c,n in pv if n!=1]
# 7. run 359
preT=json.load(open(f'{D}/PRE/run359-tests.json')); postT=json.load(open(f'{D}/POST/run359-tests.json'))
preR=json.load(open(f'{D}/PRE/run359-results.json')); postR=json.load(open(f'{D}/POST/run359-results.json'))
preRun=json.load(open(f'{D}/PRE/run359-run.json')); postRun=json.load(open(f'{D}/POST/run359-run.json'))
out["run359"]={"include_all_before":preRun['include_all'],"include_all_after":postRun['include_all'],
 "tests_before":len(preT),"tests_after":len(postT),"results_before":len(preR),"results_after":len(postR)}
pc={t['case_id'] for t in preT}; qc={t['case_id'] for t in postT}
out["run359"]["case_ids_equal_both_ways"]=(pc==qc)
out["run359"]["only_before"]=sorted(pc-qc); out["run359"]["only_after"]=sorted(qc-pc)
prid={r['id']:r for r in preR}; poid={r['id']:r for r in postR}
missing=sorted(set(prid)-set(poid)); newr=sorted(set(poid)-set(prid))
out["run359"]["prior_results_missing_by_id"]=missing
out["run359"]["new_result_ids"]=newr
ECHO={'case_title','case_refs'}
moved=[]
for rid in prid:
    if rid not in poid: continue
    for k in set(prid[rid])|set(poid[rid]):
        if prid[rid].get(k)!=poid[rid].get(k):
            moved.append({"result_id":rid,"field":k,"declared_echo":k in ECHO})
out["run359"]["result_fields_moved"]=moved
out["run359"]["non_echo_fields_moved"]=[m for m in moved if not m['declared_echo']]
json.dump(out,open(f'{D}/audit.json','w'),indent=1)
for k in ("untouched_cases_checked","marker_tally","run359"):
    print(k,":",json.dumps(out[k]) if k!="run359" else "")
if k=="run359": print(json.dumps(out["run359"],indent=1)[:900])
print("\nPROBLEM COUNTS:")
for k in ("untouched_cases_differing","foreign_differing","touched_unintended_changes","new_case_problems","cases_without_exactly_one_marker","provenance_not_exactly_one"):
    print(f"  {k}: {len(out[k])}", json.dumps(out[k])[:300] if out[k] else "")
