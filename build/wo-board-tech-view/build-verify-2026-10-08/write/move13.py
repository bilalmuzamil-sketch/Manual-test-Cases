import json,base64,urllib.request,time
cr=json.load(open('/tmp/testrail/creds.json')); sec=cr.get('api_key') or cr.get('password')
auth=base64.b64encode(f"{cr['user']}:{sec}".encode()).decode()
H={'Authorization':'Basic '+auth,'Content-Type':'application/json'}
def call(p,data=None):
    r=urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/'+p,headers=H,data=(json.dumps(data).encode() if data is not None else None))
    try:
        b=urllib.request.urlopen(r,timeout=120).read(); return 200,(json.loads(b) if b.strip() else None)
    except urllib.error.HTTPError as e: return e.code,e.read().decode()[:300]
ids=[97023,97024,97025,97026,97027,97029,97033,97034,97035,368153,368155,154650,368240]
log=[]; before={}
for c in ids:
    s,x=call(f'get_case/{c}'); assert x['created_by']==3,c; before[c]=x['section_id']; time.sleep(0.5)
s,r=call('move_cases_to_section/55300',{'suite_id':1,'case_ids':ids}); log.append(('move_cases_to_section/55300',s)); print(log[-1])
desc=('<p>QA lead 2026-10-08: WO Board and Tech View cases a manual tester cannot run for now on the current build (sv10043 v26.40.8-7a95011): '
      'cases waiting for a decision (Edit Work Order window cannot be opened, the List has no pages, a staff member with logged time cannot be deleted, '
      'three pages have no filter, impersonation has no on-screen control, no second organisation on the QA build); the analytics and data-scope checks '
      'only a developer can make; and the sign-out case left for another session. Kept, not deleted; still in run 498 and marked AUTOMATION: HOLD with the reason.</p>')
s,r=call('update_section/55300',{'description':desc}); log.append(('update_section/55300',s)); print(log[-1])
for c in ids:
    s,x=call(f'get_case/{c}'); log.append(('verify','C%d'%c,before[c],'->',x['section_id'],'OK' if x['section_id']==55300 else 'NOT MOVED')); time.sleep(0.5)
print([l[1]+':'+l[-1] for l in log[2:]])
tests=[];off=0
while True:
    s,j=call(f'get_tests/498&limit=250&offset={off}'); tests+=j['tests']
    if len(j['tests'])<250: break
    off+=250
cids={t['case_id'] for t in tests}; print('run 498 tests',len(tests),'all 13 still in run:',set(ids)<=cids)
off=0; n=0
while True:
    s,j=call(f'get_cases/1&section_id=55300&limit=250&offset={off}'); n+=len(j['cases'])
    if len(j['cases'])<250: break
    off+=250
print('folder now holds',n)
json.dump(log,open('/tmp/cln/move13-log.json','w'),indent=0)
