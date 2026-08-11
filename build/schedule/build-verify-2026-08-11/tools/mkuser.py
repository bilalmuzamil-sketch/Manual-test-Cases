import json,subprocess,urllib.request
CK=open('/tmp/qa-cookies/schedule-cookie-header.txt').read().strip()
def get(p, method='GET', body=None):
    req=urllib.request.Request('https://sv8685api.qa.shopview.com'+p, data=json.dumps(body).encode() if body is not None else None,
      headers={'Cookie':CK,'Accept':'application/json','Content-Type':'application/json','User-Agent':'Mozilla/5.0'}, method=method)
    return json.loads(urllib.request.urlopen(req,timeout=60).read().decode())
tok=get('/api/token','POST',{})['data']['accessToken']
fp=get('/api/auth/me/fe-permissions')['data']
staff=[s for s in get('/api/staff?limit=250')['data']['collection'] if s['email']=='admin@shopview.com'][0]
role=get('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')
roles=role['data']['collection'] if isinstance(role.get('data'),dict) else role['data']
r=[x for x in roles if x.get('id')==staff['role_id']]
user={"data":{"token":tok,"accessToken":tok,
 "details":{"user_id":staff['id'],"staff_id":staff['staff_id'],"email":staff['email'],
   "first_name":staff['first_name'],"last_name":staff['last_name'],"avatar_url":None,
   "clockable":staff['clockable'],"default_workplace":None,"organization_id":"d55bc308-e61a-438d-b5f1-c7a73c89d49f"},
 "role":{"id":staff['role_id'],"name":staff['role_label'],
   "fePermissions":[{"name":n} for n in fp['fe_permissions']]}}}
json.dump({"user":user,"fp":fp},open('/tmp/seed.json','w'))
print('ok token len',len(tok),'perms',len(fp['fe_permissions']),'role',staff['role_label'])

# workplace keys for localStorage (separate from user.details.default_workplace,
# which is left EXACTLY as the real account has it - see report-suite RESUME trap)
wps=get('/api/staff/my-workplaces')['data']['collection']
wp=[w for w in wps if w['id']=='b3c8c820-f815-4cf1-8938-10956c5ee71a'][0]
seed=json.load(open('/tmp/seed.json'))
seed['wp']={"id":wp['id'],"tz":wp['timezone'],"cc":wp.get('country_code') or 'CA',"shop":wp['id']}
json.dump(seed,open('/tmp/seed.json','w'))
print('wp',wp['name'],wp['timezone'])
