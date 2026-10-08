import json,base64,urllib.request,time
cr=json.load(open('/tmp/testrail/creds.json')); sec=cr.get('api_key') or cr.get('password')
auth=base64.b64encode(f"{cr['user']}:{sec}".encode()).decode()
H={'Authorization':'Basic '+auth,'Content-Type':'application/json'}
def call(p,data=None):
    r=urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/'+p,headers=H,data=(json.dumps(data).encode() if data is not None else None))
    try: return 200,json.load(urllib.request.urlopen(r,timeout=120))
    except urllib.error.HTTPError as e: return e.code,e.read().decode()[:300]
log=[]
ids=[368169,368170,368171,368197,368191,368218,368219,368223,368238,368239,368175]
st,suite=call('get_suite/1'); proj=suite['project_id']
st,secs=call(f'get_sections/{proj}&suite_id=1&limit=250&offset=0')
existing=[s for s in [] ]
desc=('<p>QA lead 2026-10-08: WO Board and Tech View cases a manual tester cannot run on the current build (sv10043 v26.40.8-7a95011) until a decision '
      'or a build change: the Edit Work Order window cannot be opened, the List has no pages, a staff member with logged time cannot be deleted, three '
      'pages have no filter, impersonation has no on-screen control, and a second organisation does not exist on the QA build. Kept, not deleted; still in '
      'run 498 and marked AUTOMATION: HOLD with the reason.</p>')
st,newsec=call(f'add_section/{proj}',{'suite_id':1,'parent_id':13204,'name':'Not runnable for now','description':desc})
log.append(('add_section',st,newsec.get('id') if isinstance(newsec,dict) else newsec)); print(log[-1])
sid=newsec['id']
before={}
for c in ids:
    s,x=call(f'get_case/{c}'); assert x['created_by']==3,c; before[c]=x['section_id']; time.sleep(0.6)
s,r=call(f'move_cases_to_section/{sid}',{'suite_id':1,'case_ids':ids}); log.append(('move_cases_to_section',s,str(r)[:200])); print(log[-1])
for c in ids:
    s,x=call(f'get_case/{c}'); log.append(('verify',c,s,before[c],'->',x['section_id'],'OK' if x['section_id']==sid else 'MISMATCH')); print(log[-1]); time.sleep(0.6)
json.dump(log,open('/tmp/cln/move11-log.json','w'),indent=0)
