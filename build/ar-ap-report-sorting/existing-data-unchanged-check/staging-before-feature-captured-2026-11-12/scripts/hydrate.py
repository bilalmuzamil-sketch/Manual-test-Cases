import json, os
from api import req
c1,p=req('GET','/api/iam/view-profile/'); c2,w=req('GET','/api/staff/my-workplaces'); c3,f=req('GET','/api/auth/me/fe-permissions')
print('codes',c1,c2,c3)
u=p['data']['user']; wl=w['data']['collection']; fd=f['data']
print('workplaces:',[(x.get('name'),x.get('id'),x.get('timezone'),x.get('is_default') if 'is_default' in x else None) for x in wl])
print('wp keys', list(wl[0].keys())[:30])
print('fe template', fd.get('template_slug'), fd.get('view_mode'), fd.get('cross_toggles'), len(fd['fe_permissions']))
dw=next((x for x in wl if x.get('is_default')),wl[0]); print('default workplace:',dw['name'])
login={'data':{'role':{'id':u['role_id'],'fePermissions':fd['fe_permissions'],'name':'Admin','description':'','isDefault':True,'isDeletable':False,'isEditable':True},
 'details':{'user_id':None,'intercom_data':{},'name':u['first_name']+' '+u['last_name'],'email':u['email'],'avatar_url':None,'default_workplace':dw['id'],'workplace_timezone':dw.get('timezone'),'staff_id':None,'clockable':False,'created_on':None,'bookkeeping_enabled':True,'last_page_visited':None}}}
for n,o in [('login-resp.json',login),('fe-perms.json',f),('profile.json',p),('workplaces.json',w)]:
    fn='/tmp/staging/'+n; open(fn,'w').write(json.dumps(o)); os.chmod(fn,0o600)
print('signed-in role id present', bool(u['role_id']), 'name chars', len(login['data']['details']['name']))
