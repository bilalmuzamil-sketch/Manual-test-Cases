# WO Board & Tech View, run 498 — build verification on STAGING, 16 Oct 2026 (second pass, evening).
# QA lead: "build verify ALL the test cases which are not yet build verified" -> "Only the 50 never checked", "Without re-reading",
# "Yes for automated tests". Lane: labels / routes / setup only. Evidence: probe/*.json (builds v26.40.19-edc8195 and -1493c63)
# plus ../build-verify-staging-2026-10-16/probe/ (v26.40.19-72f4f3b, same day). Guards: ours, unchanged since before/ snapshot.
# Plan per case is in PLAN below; README.md explains each decision. Expected wording is never changed except the build sentence
# and the AUTOMATION marker line.
import json,sys,os,re,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
BUILD='v26.40.19-1493c63'
NEW=f'Last checked against build {BUILD} (staging) on 10/16/2026.'
NA='<p>AUTOMATION: Not available on Build to test Yet - Last checked 10/16/2026</p>'
STAMP=[r'Last checked against build [^<]*?(?:a build|\d{4})\.', r'Not yet checked against a build\.',
       r'This version of the case has not yet been checked against a build \(the previous version was last checked against build [^)]*\)\.',
       r'The previous version of this case was run on staging \(build [^)]*\) on [\d/]+, before the expected results changed on 15 Oct 2026; the changed results have not yet been checked against a build\.']
CONF="click the dialog's confirm button if it shows one"
PLAN=json.load(open(f'{D}/plan.json'))
def stamp(e,i):
    hits=[(p,len(re.findall(p,e))) for p in STAMP]; n=sum(h for _,h in hits)
    if n==1:
        for p,h in hits:
            if h: return re.sub(p,NEW,e)
    assert n==0,(i,'stamp count',hits)
    if '; not yet build-verified.' in e and e.count('; not yet build-verified.')==1: return e.replace('; not yet build-verified.','. '+NEW)
    m=re.search(r'(Source-verified [^<]*?)(</p>)',e); assert m,(i,'no provenance sentence')
    return e[:m.end(1)]+' '+NEW+e[m.end(1):]
write='--write' in sys.argv; only={int(x) for x in sys.argv[1:] if x.isdigit()}
log=open(f'{D}/write-log.txt','a') if write else None
for k,p in PLAN.items():
    i=int(k)
    if only and i not in only: continue
    snap=json.load(open(f'{D}/before/C{i}-before.json'))
    cur=L.call(f'get_case/{i}'); time.sleep(0.4)
    if cur['created_by']!=3: print(i,'SKIP author'); continue
    if cur['custom_atmstatus']==3 and not p.get('automated_ok'): print(i,'SKIP automated'); continue
    if cur['updated_on']!=snap['updated_on']: print(i,'SKIP changed since snapshot by user',cur['updated_by']); continue
    new={}
    for f,pairs in p.get('edits',{}).items():
        t=cur[f]
        for a,b in pairs: assert t.count(a)==1,(i,f,a,t.count(a)); t=t.replace(a,b)
        new[f]=t
    e=cur['custom_expected']
    if p.get('stamp'): e=stamp(e,i)
    mk=re.findall(r'<p>AUTOMATION:[^<]*</p>',e); assert len(mk)<=1,(i,'markers',mk)
    act=p['marker']   # 'READY' | 'KEEP' | 'NA' | 'HOLD:<reason>'
    if act=='READY': newmk='<p>AUTOMATION: READY</p>'
    elif act=='NA':
        assert not mk or mk[0] in ('<p>AUTOMATION: READY</p>',),(i,'Rule 69 marker may replace READY only',mk); newmk=NA
    elif act.startswith('HOLD:'): assert not mk,(i,'has marker',mk); newmk='<p>AUTOMATION: HOLD - '+act[5:]+'</p>'
    else: newmk=mk[0] if mk else None
    if newmk:
        if mk: e=e.replace(mk[0],newmk)
        else: assert e.endswith('</p>') or e.endswith('</ul>'),(i,'end'); e=e+newmk
    new['custom_expected']=e
    d={f:v for f,v in new.items() if v!=cur[f]}
    if not write: print(i,'PREVIEW',sorted(d),'| marker:',(mk[0][13:60] if mk else None),'->',(newmk or '')[13:60]); continue
    if not d: print(i,'no change'); continue
    r=L.call(f'update_case/{i}',d); time.sleep(1)
    ok=all(r[f]==v for f,v in d.items()) and all(r[f]==cur[f] for f in ('title','custom_atmstatus','custom_automation_type','section_id','refs')+tuple(x for x in ('custom_preconds','custom_steps') if x not in d))
    line=f"{time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())} update_case C{i} atmstatus={cur['custom_atmstatus']} fields={sorted(d)} marker={(newmk or '')[3:-4]} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line+'\n'); log.flush()
