"""Label-layer corrections: directions-to-a-control take the build's wording.
Rule 50 - exhaustive then exact. All three text fields sent explicitly on every write.
STOPS the batch on any mismatch."""
import sys,json,time,copy; sys.path.insert(0,'/tmp')
from trlib import tr

# (case, field, old, new)  -- literal substitutions, applied to EVERY occurrence
WIP_OLD_NEW=[('"Approved - partially completed"','"Approved - Partially Completed"'),
             ('"Approved - not started"','"Approved - Not Started"')]
EDITS=[
 (30172,'custom_steps',[
   ('choose "Download (CSV)".','choose a CSV download - "Download Summary (CSV)" or "Download Expanded View (CSV)".'),
   ('Choose "Download (PDF)".','Choose a PDF download - "Download Summary (PDF)" or "Download Expanded View (PDF)".')]),
 (30173,'custom_steps',[
   ('Choose "Download (CSV)" and open the file.','Choose a CSV download - "Download Summary (CSV)" or "Download Expanded View (CSV)" - and open the file.'),
   ('Choose "Download (PDF)" and open the file.','Choose a PDF download - "Download Summary (PDF)" or "Download Expanded View (PDF)" - and open the file.')]),
 (30194,'custom_steps',[
   ('Trigger "Download (CSV)" and "Download (PDF)" and observe where the file content comes from.',
    'Trigger a CSV download ("Download Summary (CSV)" or "Download Expanded View (CSV)") and a PDF download ("Download Summary (PDF)" or "Download Expanded View (PDF)"), and observe where the file content comes from.')]),
 (30436,'custom_steps',[
   ('Choose "Download (CSV)" and check the filename.','Choose "Download Summary (CSV)" and check the filename.')]),
 (30462,'custom_expected',WIP_OLD_NEW),
 (30464,'custom_expected',WIP_OLD_NEW),
 (30488,'custom_preconds',WIP_OLD_NEW),
 (30489,'custom_preconds',WIP_OLD_NEW),
 (30490,'custom_steps',WIP_OLD_NEW),
 (30490,'custom_expected',WIP_OLD_NEW),
]
TEXT=('custom_preconds','custom_steps','custom_expected')
MARKUP=('<ol','<li','<ul','<p>','<br','<div','<span','<table')

plan={}
for cid,field,subs in EDITS: plan.setdefault(cid,[]).append((field,subs))

DRY = '--go' not in sys.argv
log=[]; pre_snaps={}
for cid,items in plan.items():
    before=tr('get_case/%d'%cid); pre_snaps[cid]=before
    payload={}
    for field,subs in items:
        old=before.get(field) or ''
        new=old; applied=[]
        for o,n in subs:
            if o in new:
                applied.append((o,n,new.count(o))); new=new.replace(o,n)
        if new==old:
            print('!! NO-OP on C%d %s -- STOP'%(cid,field)); sys.exit(1)
        # mask check: undoing every substitution must reproduce the original byte for byte
        undo=new
        for o,n,_ in reversed(applied): undo=undo.replace(n,o)
        if undo!=old:
            print('!! MASK CHECK FAILED on C%d %s -- STOP'%(cid,field)); sys.exit(1)
        if any(m in new.lower() for m in MARKUP):
            print('!! MARKUP would be introduced on C%d %s -- STOP'%(cid,field)); sys.exit(1)
        payload[field]=new
        for o,n,k in applied: log.append({'case':cid,'field':field,'old':o,'new':n,'occurrences':k})
    # ALWAYS send all three text fields (TestRail re-renders any omitted field)
    for f in TEXT: payload.setdefault(f, before.get(f) or '')
    plan[cid]=(before,payload)

print('planned cases:',len(plan),' substitutions:',len(log))
for e in log: print('  C%d %s x%d  %r -> %r'%(e['case'],e['field'],e['occurrences'],e['old'][:60],e['new'][:70]))
if DRY:
    json.dump(log,open('/tmp/lb_plan.json','w'),indent=1); print('\nDRY RUN - nothing written. add --go to execute'); sys.exit(0)

results=[]
for cid,(before,payload) in plan.items():
    r=tr('update_case/%d'%cid, payload)
    after=tr('get_case/%d'%cid)
    # EXACT: intended fields match payload byte for byte
    bad=[]
    for f in TEXT:
        if (after.get(f) or '')!=payload[f]: bad.append(('intended',f))
    # EXACT: every other field byte-identical to the pre-write snapshot
    skip=set(TEXT)|{'updated_on','updated_by'}
    for k in set(list(before.keys())+list(after.keys())):
        if k in skip: continue
        if before.get(k)!=after.get(k): bad.append(('collateral',k,before.get(k),after.get(k)))
    if bad:
        print('!! VERIFY FAILED on C%d: %r -- BATCH STOPPED'%(cid,bad)); json.dump(results,open('/tmp/lb_exec.json','w'),indent=1); sys.exit(1)
    fields_compared=len(set(list(before.keys())+list(after.keys())))
    results.append({'case':cid,'http':200,'fields_compared':fields_compared,'verify':'MATCH',
                    'updated_on_before':before['updated_on'],'updated_on_after':after['updated_on']})
    print('C%d  HTTP 200  %d fields compared  MATCH'%(cid,fields_compared))
json.dump({'log':log,'results':results,'ts':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())},
          open('/tmp/lb_exec.json','w'),indent=1)
print('\nDONE  %d cases written, %d verified MATCH, 0 mismatches'%(len(results),len(results)))
