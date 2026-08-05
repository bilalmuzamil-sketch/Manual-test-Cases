#!/usr/bin/env python3
"""Re-sync the LOCAL case source FROM LIVE, then add this pass's 3 new cases.
Mirrors build/report-suite/viu-push-2026-08-04/sync_local.py (Rule 27)."""
import json,os,glob,sys,csv,re
HERE=os.path.dirname(os.path.abspath(__file__)); D=os.path.dirname(HERE)
RS=os.path.dirname(D); CASES=os.path.join(RS,'cases')
sys.path.insert(0,HERE); import tr
POST={c['id']:c for c in json.load(open(f'{D}/POST/cases-4281.json')) if c['created_by']==3}
idmap={r['internal_id']:r for r in csv.DictReader(open(os.path.join(RS,'testrail-id-map.csv')))}
cid2iid={v['testrail_case_id']:k for k,v in idmap.items()}
def lines(v):
    if isinstance(v,list): return v
    return (v or '').split('\n')
changed=0; files=0
for fp in sorted(glob.glob(os.path.join(CASES,'*.json'))):
    arr=json.load(open(fp)); dirty=False
    for c in arr:
        iid=c['id']; row=idmap.get(iid)
        if not row: continue
        cid=int(row['testrail_case_id'].lstrip('C'))
        live=POST.get(cid)
        if not live: continue
        for lk,jk in (('title','title'),('custom_preconds','preconditions'),
                      ('custom_steps','steps'),('custom_expected','expected'),('refs','spec_ref')):
            want=live.get(lk)
            if jk in ('preconditions','steps','expected'):
                want=lines(want)
                if c.get(jk)!=want: c[jk]=want; dirty=True; changed+=1
            else:
                if c.get(jk)!=want: c[jk]=want; dirty=True; changed+=1
    if dirty: json.dump(arr,open(fp,'w'),ensure_ascii=False,indent=1); files+=1
print(f"resynced from live: {changed} fields across {files} files")
# ---- append the three new cases to their report's file ----
plan=json.load(open(f'{D}/writeplan.json')); added={a['internal_id']:a for a in json.load(open(f'{D}/added-cases.json'))}
TARGET={'WIP-COL-09':'cases-wip-B-columns-calcs.json','SBC-LINK-05':'cases-sbc-C-links-navigation.json',
        'SBR-LINK-06':'cases-sbr-C-links-navigation.json'}
secname={s['id']:s['name'] for s in json.load(open(f'{D}/POST/sections-all.json'))}
for a in plan['adds']:
    iid=a['internal_id']
    cand=[p for p in glob.glob(os.path.join(CASES,'*.json'))]
    # place it in the file that already holds the sibling with the same prefix+area
    pref=iid.rsplit('-',2)[0]
    host=None
    for p in cand:
        arr=json.load(open(p))
        if any(x['id'].startswith(pref+'-') and x.get('area')==secname[a['section_id']] for x in arr): host=p; break
    if host is None:
        for p in cand:
            arr=json.load(open(p))
            if any(x['id'].startswith(pref+'-') for x in arr): host=p; break
    arr=json.load(open(host))
    if any(x['id']==iid for x in arr): print(f"  {iid} already local"); continue
    rec={"id":iid,"area":secname[a['section_id']],"title":a['title'],
         "priority":"High","type":"Functional",
         "permissions_required":"Two sign-ins: one that can open the target record and one that can see reports but cannot.",
         "preconditions":a['preconds'].split('\n'),"steps":a['steps'].split('\n'),
         "expected":a['expected'].split('\n'),
         "design_ref":"none — design not yet available (spec-only authoring)",
         "spec_ref":a['refs'],
         "viu_status":"VIU-Pending",
         "notes":"Authored 2026-08-05 for the suite-wide link-permission rule Chris Ward published that day. The negative half could not be observed live: the front end would not accept this run's browser session and the one route that produces a signed-in browser was barred because it would have reset a sign-in shared with two other testers."}
    arr.append(rec)
    json.dump(arr,open(host,'w'),ensure_ascii=False,indent=1)
    print(f"  added {iid} -> {os.path.basename(host)} (C{added[iid]['case_id']})")
