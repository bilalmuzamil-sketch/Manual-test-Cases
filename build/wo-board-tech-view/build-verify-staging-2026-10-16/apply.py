# WO Board & Tech View, run 498: build verification on STAGING v26.40.19-72f4f3b, 16 Oct 2026 (QA lead: "Option a" —
# the 34 HOLD + 9 changed-READY cases after Chris Ward's answers 12-31 / PRD v54). Lane: labels/routes/setup only.
# Evidence: probe/01-labels.json, 02-labels-b.json, 03-labels-c.json, 04-keyboard.json, 05-labels-e.json, 08-role-permissions.json.
# Writes ONLY to the cases in GO below (ours, not Automated, unchanged since the 16 Oct snapshot in before/):
#  (1) provenance build sentence -> "Last checked against build v26.40.19-72f4f3b (staging) on 10/16/2026."
#  (2) marker HOLD (not yet build-verified) -> READY (already-READY cases keep READY)
#  (3) step/precondition wording to the build: C96956 second location example (Staging Light Duty - 9920 does not exist ->
#      Staging Lethbridge - 4310) and the dialog's confirm button named (Reassign); C96927 On Site and Unit are not in Tech View's
#      Column Selection on this build, so the two steps say what to do if they are absent; C96979 example column Unit -> Asset.
# Expected results' wording is never changed apart from the build sentence. Not written: see README (keyboard set, Technician
# filter, New Work Order window, Automated cases, C368191).
import json,sys,os,re,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
NEW='Last checked against build v26.40.19-72f4f3b (staging) on 10/16/2026.'
STAMP=[r'Last checked against build [^<]*?(?:a build|\d{4})\.', r'Not yet checked against a build\.',
       r'This version of the case has not yet been checked against a build \(the previous version was last checked against build [^)]*\)\.',
       r'The previous version of this case was run on staging \(build [^)]*\) on [\d/]+, before the expected results changed on 15 Oct 2026; the changed results have not yet been checked against a build\.']
GO=[368127,368141,368163,581895,590110,590111,590112,590115,590116,590117,590120,590122,590125,590128,590129,590131,598326,
    96909,96916,96927,96935,96956,96979,96983,96990,368130,368158,96963,97009]
CONF="click the dialog's confirm button if it shows one"
EDITS={96956:{'custom_preconds':[('(for example Staging Light Duty - 9920)','(for example Staging Lethbridge - 4310)')],
              'custom_steps':[("Click {Technician-B}'s row, and "+CONF+".","Click {Technician-B}'s row, then click Reassign."),
                              ("Click Unassigned, and "+CONF+".","Click Unassigned, then click Reassign."),
                              ("Click {Technician-A}'s row, and "+CONF+".","Click {Technician-A}'s row, then click Reassign.")]},
       96927:{'custom_preconds':[("Assigned Techs is on, and On Site, VIN/Serial # and Lead Technician are off, as they start for a new user.",
                                  "Assigned Techs is on, and VIN/Serial # and Lead Technician are off, as they start for a new user (On Site too, if the menu lists it).")],
              'custom_steps':[('<li>Turn On Site on.</li>','<li>Turn On Site on. If On Site is not in the menu, write "On Site not in the menu" in the result comment and go on.</li>'),
                              ('<li>Turn Unit off.</li>','<li>Turn Unit off. If Unit is not in the menu, write "Unit not in the menu" in the result comment and go on.</li>'),
                              ('<li>Click the Column Selection button, turn Unit on and close the menu.</li>','<li>Click the Column Selection button, turn Unit on if you turned it off, and close the menu.</li>')]},
       96979:{'custom_steps':[('turn one column off (for example Unit) and close the menu','turn one column off (for example Asset) and close the menu')]}}
write='--write' in sys.argv; only={int(x) for x in sys.argv[1:] if x.isdigit()}
log=open(f'{D}/write-log.txt','a') if write else None
for i in GO:
    if only and i not in only: continue
    snap=json.load(open(f'{D}/before/C{i}-before.json'))
    cur=L.call(f'get_case/{i}'); time.sleep(0.4)
    if cur['created_by']!=3 or cur['custom_atmstatus']==3: print(i,'SKIP author/automated'); continue
    if cur['updated_on']!=snap['updated_on']: print(i,'SKIP changed since snapshot by user',cur['updated_by']); continue
    new={}
    for f,pairs in EDITS.get(i,{}).items():
        t=cur[f]
        for a,b in pairs: assert t.count(a)==1,(i,f,a); t=t.replace(a,b)
        new[f]=t
    e=cur['custom_expected']; hits=[(p,len(re.findall(p,e))) for p in STAMP]; n=sum(h for _,h in hits)
    assert n==1,(i,'stamp count',hits)
    for p,h in hits:
        if h: e=re.sub(p,NEW,e)
    k=e.rfind('<p>AUTOMATION:'); tail=e[k:]
    assert k>0 and e.endswith('</p>') and e.count('<p>AUTOMATION:')==1,(i,'marker')
    assert tail in ('<p>AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build</p>','<p>AUTOMATION: READY</p>'),(i,tail)
    e=e[:k]+'<p>AUTOMATION: READY</p>'; new['custom_expected']=e
    d={f:v for f,v in new.items() if v!=cur[f]}
    if not write: print(i,'PREVIEW',sorted(d),'| was:',tail[13:60]); continue
    r=L.call(f'update_case/{i}',d); time.sleep(1)
    ok=all(r[f]==v for f,v in d.items()) and all(r[f]==cur[f] for f in ('title','custom_atmstatus','custom_automation_type','section_id','refs')+tuple(x for x in ('custom_preconds','custom_steps') if x not in d))
    line=f"{time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())} update_case C{i} fields={sorted(d)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line+'\n'); log.flush()
