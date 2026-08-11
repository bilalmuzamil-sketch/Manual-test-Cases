"""Rebuild /tmp/fv/user.json for the SPA localStorage hydration. Secret-free."""
import json, subprocess
CH = open('/tmp/qa-cookies/filters-cookie-header.txt').read().strip()
API = 'https://sv8785api.qa.shopview.com'
def get(p):
    out = subprocess.run(['curl','-s','-H','Cookie: '+CH,'-H','Accept: application/json',API+p],
                         capture_output=True, text=True).stdout
    return json.loads(out)
staff = [s for s in get('/api/staff?limit=200')['data']['collection'] if s['email']=='admin@shopview.com'][0]
role = get('/api/roles/%s' % staff['role_id'])['data']
fe = [{'id':p['id'],'name':p['name'],'code':p.get('code',p['name'])} for p in role['fe_permissions']]
user = {'data': {
  'id': staff['id'], 'email': staff['email'],
  'details': {'id': staff['id'], 'staff_id': staff['staff_id'], 'email': staff['email'],
              'first_name': staff['first_name'], 'last_name': staff['last_name'],
              'avatar_url': None, 'clockable': staff['clockable'], 'billable': staff['billable'],
              'job_title': staff['job_title'],
              'default_workplace': 'b3c8c820-f815-4cf1-8938-10956c5ee71a',
              'default_workplace_name': 'Staging Heavy Duty - 9919',
              'intercom_data': {'company': {'id': 'd55bc308-e61a-438d-b5f1-c7a73c89d49f'}}},
  'role': {'id': role['id'], 'name': role['name'], 'fePermissions': fe, 'fe_permissions': fe,
           'default': role.get('default')}}}
json.dump(user, open('/tmp/fv/user.json','w'))
print('user.json rebuilt, fe perms', len(fe))
