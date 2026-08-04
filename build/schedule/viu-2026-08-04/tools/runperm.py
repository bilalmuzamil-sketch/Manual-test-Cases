import sys,json,time; sys.path.insert(0,'/tmp/sviu')
import perm, importlib
H=json.load(open('/tmp/sviu/henry.json')); ZZ=json.load(open('/tmp/sviu/zz-roles.json'))
WP='b3c8c820-f815-4cf1-8938-10956c5ee71a'
ORIG=H['role_id']
def call(*a,**k):
    import h; importlib.reload(h); return h.call(*a,**k)
def setrole(rid,label):
    perm.admin_login()
    body={'first_name':H['first_name'],'last_name':H['last_name'],'email':H['email'],'role_id':rid,'workplace_id':WP}
    s,r=call(f"/api/staff/{H['staff_id']}/change",body)
    print(f'set role {label} -> {s}')
    return s
def impersonate():
    call('/api/switch-user',{'user_id':H['id']})
    s,fe=call('/api/auth/me/fe-permissions')
    if s!=200: print('  fe read failed',s); return None
    d=fe['data']; codes=d['fe_permissions']
    print('  atoms',len(codes),'view_mode',d.get('view_mode'),'sched',[c for c in codes if 'chedule' in c],'woView','workOrdersView' in codes)
    return codes
def probes(tag):
    P=[('GET','/api/schedule/board?from=2026-08-09T00%3A00%3A00.000Z&to=2026-08-16T00%3A00%3A00.000Z',None),
       ('GET','/api/schedule/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=3',None),
       ('POST','/api/schedule/shifts',{'workOrderId':'d4c9382b-7960-4bac-ac3b-feba8bc49fb1','lineIds':['bb215192-6425-4725-af09-5dcad36e8d8a'],'staffId':None,'departmentId':None,'startDate':'2026-08-14','startTime':'09:00','spreadMode':'single','totalMinutes':60,'perDayMinutes':None,'color':None,'note':None,'isAllDay':False,'acknowledgeLongSeries':False}),
       ('PATCH','/api/schedule/shifts/8a2de78a-9944-495b-abcc-c3a900b3cad7',{'startsAt':'2026-08-11T15:00:00.000Z','isAllDay':False,'reassign':False,'changeNote':False,'scope':'shift'}),
       ('DELETE','/api/schedule/shifts/8a2de78a-9944-495b-abcc-c3a900b3cad7?scope=shift',None),
       ('POST','/api/schedule/events',{'title':'ZZAUTOTEST perm','staffId':'0aac76eb-0de3-4ef9-8163-89424c7a20b9','departmentId':None,'startsAt':'2026-08-14T08:00:00.000Z','endsAt':'2026-08-14T09:00:00.000Z','color':'#f0f0f1','note':None})]
    out={}
    created=[]
    for m,p,b in P:
        s,body=call(p,b,method=m)
        out[f'{m} {p.split("?")[0].replace("8a2de78a-9944-495b-abcc-c3a900b3cad7","{id}")}']=s
        if m=='POST' and p.endswith('shifts') and s==201:
            created+= [x['id'] for x in body['data']['shifts']]
        if m=='POST' and p.endswith('events') and s==201:
            created.append('EV:'+body['data']['event']['id'])
        print(f'  {m:7s} {p.split("?")[0][-32:]:34s} -> {s}')
    return out, created
RES={}
for label,rid in [('No Schedule permission',ZZ['ZZAUTOTEST No Sched']),
                  ('Schedule View, no Work Orders View',ZZ['ZZAUTOTEST Sched View no WO']),
                  ('Schedule View + Edit, no Delete',ZZ['ZZAUTOTEST Sched Edit no Del'])]:
    print('='*70); print(label)
    setrole(rid,label); time.sleep(1)
    codes=impersonate()
    r,created=probes(label)
    RES[label]={'atoms':codes,'probes':r,'created':created}
    # cleanup anything created
    perm.admin_login()
    for cid in created:
        if cid.startswith('EV:'):
            print('   cleanup event',call('/api/schedule/events/'+cid[3:],None,method='DELETE')[0])
        else:
            print('   cleanup shift',call(f'/api/schedule/shifts/{cid}?scope=shift',None,method='DELETE')[0])
print('='*70)
setrole(ORIG,'RESTORE Technician')
json.dump(RES,open('/tmp/sviu/perm-matrix.json','w'),indent=1)
