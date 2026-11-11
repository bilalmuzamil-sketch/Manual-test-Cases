#!/usr/bin/env python3
"""Admin ops on the QA branch with the QA lead's session (read from /tmp/qa only). Per-op log -> oplog.jsonl"""
import json, subprocess, sys, datetime
API='https://sv11315api.qa.shopview.com/api/'
ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f'
TECH_STAFF='d2cb20a6-90a8-4884-ac50-022ff2fb9313'
DEFAULT_WP='b3c8c820-f815-4cf1-8938-10956c5ee71a'
LOG='/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/unblock-2026-11-11/oplog.jsonl'
def call(method, path, body=None, jar='/tmp/qa/cookie-header.txt'):
    a=['curl','-s','-X',method,'-H','Cookie: '+open(jar).read().strip(),'-H','Accept: application/json',
       '-H','Origin: https://sv11315.qa.shopview.com','-H','Referer: https://sv11315.qa.shopview.com/','-w','\n__HTTP__%{http_code}']
    if body is not None: a+=['-H','Content-Type: application/json','--data',json.dumps(body)]
    out=subprocess.run(a+[API+path],capture_output=True,text=True).stdout
    b,c=out.rsplit('\n__HTTP__',1)
    try: j=json.loads(b)
    except Exception: j=b[:500]
    return int(c), j
def log(op, target, status, verification, extra=None):
    rec={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),'op':op,'target':target,'http':status,'verification':verification}
    if extra: rec.update(extra)
    open(LOG,'a').write(json.dumps(rec)+'\n'); print(json.dumps(rec)[:400])
def roles():
    c,j=call('GET',f'organizations/{ORG}/roles?page=1&pageSize=100'); return {r['name']:r for r in j['data']}
def ensure_role(name, desc, perm_ids):
    r=roles()
    if name in r: rid=r[name]['id']; log('create_role(skip, exists)',name,200,'exists',{'role_id':rid})
    else:
        c,j=call('POST','roles',{'name':name,'description':desc,'fePermissions':perm_ids,'organization':ORG,'viewMode':None,
              'crossToggles':{'seeFinancialData':False,'seeApArData':False,'viewHistoryLogs':False},'templateId':None})
        rid=(j.get('data') or {}).get('id') if isinstance(j,dict) else None
        if not rid: rid=roles().get(name,{}).get('id')
        log('create_role',name,c,'created' if rid else f'FAILED {str(j)[:300]}',{'role_id':rid})
    c,j=call('GET',f'roles/{rid}'); d=j['data']
    got=sorted(p['code'] for p in d['fe_permissions'])
    log('read_back_role',name,c,f"perms={got} cross={d['cross_toggles']} view_mode={d['view_mode']}",{'role_id':rid})
    return rid, got, d['cross_toggles']
def set_tech_role(role_id, label):
    c,v=call('GET',f'staff/{TECH_STAFF}/view'); cur=v['data']['collection']
    before=json.load(open(LOG.rsplit('/',1)[0]+'/tech-before.json'))
    body={'first_name':before['first_name'],'last_name':before['last_name'],'email':'tech@shopview.com','role_id':role_id,
          'workplace_id':before['default_workplace'],'job_title':before['job_title'],'salary_type':before['salary_type'],
          'salary':before['salary'],'billable':before['billable'],'clockable':before['clockable'],'is_sales_rep':before['is_sales_rep']}
    c,j=call('POST',f'staff/{TECH_STAFF}/change',body)
    c2,v=call('GET',f'staff/{TECH_STAFF}/view'); now=v['data']['collection']
    ok=now['role_id']==role_id
    log('set_tech_role',f'tech@shopview.com -> {label}',c,f"read back role_id={now['role_id']} role_name={now['role_name']} departments={[d['workplace'] for d in now['departments']]} {'OK' if ok else 'MISMATCH'}",{'from_role':cur['role_id'],'response':str(j)[:200]})
    return ok
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='roles':
        RP='7724fb7f-dba8-4672-a168-314c0460c0ab'
        r32=ensure_role('ZZAUTOTEST V1R-32 Reports on Customers View off','ZZAUTOTEST C1079005: Reports page access ON, Customers View OFF (nothing else)',[RP])
        r53=ensure_role('ZZAUTOTEST V1R-53 Reports page access only','ZZAUTOTEST C1079026: only Reports page access',[RP])
        json.dump({'V1R-32':r32[0],'V1R-53':r53[0]},open('role-ids.json','w'))
    elif cmd=='settech':
        print(set_tech_role(sys.argv[2], sys.argv[3]))
