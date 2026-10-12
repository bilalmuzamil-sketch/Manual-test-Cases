import json,requests,datetime
c=json.load(open('/tmp/testrail/creds.json')); h=('https://'+c['host'] if not c['host'].startswith('http') else c['host']).rstrip('/')
A=(c['email'],c['password']); S=requests.Session(); S.auth=A
import time
def get(p):
    for i in range(8):
        try:
            r=S.get(h+'/index.php?/api/v2/'+p,timeout=60); j=r.json()
            if r.status_code==200 and not (isinstance(j,dict) and 'error' in j): return j
        except Exception: pass
        time.sleep(5*(i+1))
    raise SystemExit('failed '+p)
tests=[]; off=0
while True:
    r=get(f'get_tests/498&limit=250&offset={off}'); t=r['tests'] if isinstance(r,dict) else r; tests+=t
    if len(t)<250: break
    off+=250
print('tests',len(tests))
TEXT={'custom_preconds','custom_steps','custom_expected','title','custom_steps_separated'}
hits=[]
for t in tests:
    cid=t['case_id']; case=get(f'get_case/{cid}')
    hh=[]; off=0
    while True:
        r=get(f'get_history_for_case/{cid}&limit=250&offset={off}'); x=r.get('history',r) if isinstance(r,dict) else r; hh+=x
        if len(x)<250: break
        off+=250
    hh.sort(key=lambda e:e['created_on'])
    # reconstruct status before each entry: start from earliest old_value if any
    st=None
    for e in hh:
        for ch in e.get('changes',[]):
            if ch.get('field')=='custom_atmstatus' and st is None: st=ch.get('old_value')
    if st is None: st=case.get('custom_atmstatus')
    for e in hh:
        fields={ch.get('field') for ch in e.get('changes',[])}
        if e.get('user_id')==3 and fields & TEXT and st==3:
            hits.append((cid,datetime.datetime.utcfromtimestamp(e['created_on']).strftime('%Y-%m-%d %H:%M'),sorted(fields&TEXT)))
        for ch in e.get('changes',[]):
            if ch.get('field')=='custom_atmstatus': st=ch.get('new_value')
    ever=any(ch.get('field')=='custom_atmstatus' and ch.get('new_value')==3 for e in hh for ch in e.get('changes',[])) or case.get('custom_atmstatus')==3
    if ever: print('EVER-AUTOMATED',cid,'now',case.get('custom_atmstatus'),case['title'][:60])
print('--- our text edits made while the case was Automated ---')
for x in hits: print(x)
