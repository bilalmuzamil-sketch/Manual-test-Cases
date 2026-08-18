import json,glob
live={c['testrail_id'] if False else str(c['id']):c for c in json.load(open('/tmp/rs_live_after.json'))}
# key live by C-id
liveC={c['id']:c for c in json.load(open('/tmp/rs_live_after.json'))}  # c['id'] is numeric C-id
def L2list(s): return (s or '').split('\n')
files={f:json.load(open(f)) for f in sorted(glob.glob('cases/*.json'))}
upd=0;miss=[]
for f,arr in files.items():
    if not isinstance(arr,list): arr=[arr]; files[f]=arr
    for c in arr:
        tid=c.get('testrail_id','')
        if not (tid and tid.startswith('C')): continue
        cid=int(tid[1:])
        if cid not in liveC: miss.append(tid); continue
        lc=liveC[cid]
        c['title']=lc['title']
        c['preconditions']=L2list(lc.get('custom_preconds',''))
        c['steps']=L2list(lc.get('custom_steps',''))
        c['expected']=lc.get('custom_expected','')
        c['refs']=lc.get('refs','')
        c['spec_ref']=lc.get('refs','')
        upd+=1
for f,arr in files.items():
    json.dump(arr,open(f,'w'),indent=1,ensure_ascii=False)
print('resynced',upd,'local cases from live; missing(live not found):',len(miss),miss[:10])
