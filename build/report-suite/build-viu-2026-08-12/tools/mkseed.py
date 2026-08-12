import json,urllib.request
CK=open('/tmp/qa-cookies/reports-cookie-header.txt').read().strip()
API='https://sv8582api.qa.shopview.com'
def get(p, method='GET', body=None):
    req=urllib.request.Request(API+p, data=json.dumps(body).encode() if body is not None else None,
      headers={'Cookie':CK,'Accept':'application/json','Content-Type':'application/json','User-Agent':'Mozilla/5.0'}, method=method)
    return json.loads(urllib.request.urlopen(req,timeout=60).read().decode())
tok=get('/api/token','POST',{})['data']['accessToken']
fp=get('/api/auth/me/fe-permissions')['data']
staff=[s for s in get('/api/staff?limit=250')['data']['collection'] if s['email']=='admin@shopview.com'][0]
wps=get('/api/staff/my-workplaces')['data']['collection']
wp=next((w for w in wps if w.get('is_default')),wps[0])
user={"data":{"token":tok,"accessToken":tok,
 "details":{"user_id":staff['id'],"staff_id":staff['staff_id'],"email":staff['email'],
   "first_name":staff['first_name'],"last_name":staff['last_name'],"avatar_url":None,
   "clockable":staff['clockable'],
   "default_workplace":{"id":wp['id'],"name":wp['name'],"timezone":wp['timezone'],"country_code":wp['country_code'],"shop_id":wp['shop_id']},
   "organization_id":"d55bc308-e61a-438d-b5f1-c7a73c89d49f"},
 "role":{"id":staff['role_id'],"name":staff['role_label'],
   "fePermissions":[{"name":n} for n in fp['fe_permissions']]}}}
seed={"user":user,"fp":fp,"wp":{"id":wp['id'],"tz":wp['timezone'],"cc":wp['country_code'],"shop":wp['shop_id'],"name":wp['name']}}
json.dump(seed,open('/tmp/seed.json','w'))
print('ok perms',len(fp['fe_permissions']),'role',staff['role_label'],'wp',wp['name'],wp['id'])
