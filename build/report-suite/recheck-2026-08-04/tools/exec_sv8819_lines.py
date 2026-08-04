#!/usr/bin/env python3
"""Remove the now-false SV-8819 "Known issue" line from C30367 and C30374.

Authorised by the QA lead's brief for this pass, verbatim: "If any is now FIXED, that is
important: the case should pass, and its 'known issue / filed for a fix' line must come off."

Both cases were PROVEN to pass on v3.4.1-3d03023 first (evidence/sv8819-case-verification.json):
  C30374 - the window is the inclusive whole-day span (216=216, 365=365)
  C30367 - the formula matches exactly on every positive-stock row, 0.00 at zero stock,
           and a negative Turns/Yr appears where units_sold is negative

Rule 50: takes a FRESH pre-write snapshot (the re-stamp pass already wrote these), writes only
custom_expected, then re-GETs and compares every field.
"""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tr
LINE='Known issue: the product does not currently do this. It has been filed for a fix here: https://shopview.atlassian.net/browse/SV-8819'
VOLATILE={'updated_on','updated_by'}
log=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','exec-log-sv8819.jsonl')
ok=fail=0
for cid in (30367,30374):
    if cid in tr.FOREIGN: print('REFUSE foreign',cid); continue
    s,pre=tr.api(f'get_case/{cid}')
    if s!=200: print('FAIL get',cid,s); fail+=1; break
    if pre.get('created_by')!=3: print('REFUSE not ours',cid); fail+=1; break
    e=pre['custom_expected']
    if LINE not in e:
        print(f'C{cid}: line already absent — nothing to do'); continue
    new=e.replace('\n'+LINE,'').replace(LINE+'\n','').replace(LINE,'')
    assert LINE not in new
    s,_=tr.api(f'update_case/{cid}', {'custom_expected':new})
    if s!=200: print('FAIL write',cid,s); fail+=1; break
    s,post=tr.api(f'get_case/{cid}')
    if s!=200: print('FAIL re-GET',cid,s); fail+=1; break
    mism=[]; compared=0
    for k in sorted(set(pre)|set(post)):
        if k in VOLATILE: continue
        compared+=1
        want = new if k=='custom_expected' else pre.get(k)
        if want!=post.get(k): mism.append({'field':k,'want':repr(want)[:300],'got':repr(post.get(k))[:300]})
    rec={'case_id':cid,'http':200,'fieldsCompared':compared,'verified':not mism,
         'removed':'SV-8819 known-issue line','at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    open(log,'a').write(json.dumps(rec)+'\n')
    if mism:
        print('FAIL MISMATCH',cid)
        for m in mism: print('  ',m)
        fail+=1; break
    print(f'C{cid} OK — line removed, {compared} fields compared, 0 mismatch')
    ok+=1
print(f'DONE ok={ok} fail={fail}')
sys.exit(0 if fail==0 else 1)
