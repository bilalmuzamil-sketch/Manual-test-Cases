import json,re,sys
sys.path.insert(0,'/tmp/cln/refine'); from lib import *
H=json.load(open('/tmp/cln/held7-live.json'))
CHG='(profile icon &gt; Change Location)'
NEWROLE=lambda name,on: f'profile icon {G} Settings {G} Roles &amp; Permissions {G} Create Custom Role {G} Choose a template: Service Advisor {G} Apply {G} Role Name {name} {G} under Page Access switch Reports {"on" if on else "off"} {G} Create'
NEWSTAFF=lambda name,role: f'profile icon {G} Settings {G} Staff {G} New Staff Member: First Name and Last Name ({name}), an Email you can open, Role {role}, a Department, Location = your location {G} Save &amp; Close; accept the invitation email and set a password, so you can sign in as them'
COPYURL='while signed in as Admin, click Dashboard in the top menu and copy the address from the browser bar'
def st(k,pairs=()):
    s=H[k]['custom_steps']
    for a,b in pairs: assert s.count(a)==1,(k,a[:60]); s=s.replace(a,b)
    return s
LOUT='Sign out (profile icon &gt; Logout)'
spec={}
spec['88595']=([P_ADMIN,'You are in one location (workplace).',
  'Two custom roles made from the same template (e.g. Service Advisor): ZZAUTOTEST With Reports (Reports switched on) and ZZAUTOTEST No Reports (Reports switched off).',
  'Two staff members at that location whose sign-ins you have: ZZAUTOTEST Reports User with role ZZAUTOTEST With Reports, and ZZAUTOTEST No Reports User with role ZZAUTOTEST No Reports.',
  'You have copied the dashboard\'s web address.'],
 [S_ADMIN,f'For 2: to change location, {LOC_ROUTE}.',f'For 3: {NEWROLE("ZZAUTOTEST With Reports",True)}. Then the second role the same way: {NEWROLE("ZZAUTOTEST No Reports",False)}.',
  f'For 4: {NEWSTAFF("ZZAUTOTEST Reports User","ZZAUTOTEST With Reports")}; then the same for ZZAUTOTEST No Reports User with role ZZAUTOTEST No Reports.',f'For 5: {COPYURL}.'],
 st('88595',[('Sign out, then sign in as ZZAUTOTEST No Reports User.',LOUT+', then sign in as ZZAUTOTEST No Reports User.')]))
spec['88596']=(['For the setup you are signed in as an Admin (the Admin role has every permission).','A staff member whose role has the Reports permission switched off, with access to one location, whose sign-in you have (e.g. ZZAUTOTEST No Reports User with role ZZAUTOTEST No Reports).','You have copied the dashboard\'s web address.'],
 [S_ADMIN,f'For 2: {NEWROLE("ZZAUTOTEST No Reports",False)}; then {NEWSTAFF("ZZAUTOTEST No Reports User","ZZAUTOTEST No Reports")}.',f'For 3: {COPYURL}.'],st('88596'))
spec['88597']=([P_REPORTS,'You are in any location (workplace).','You have a small screen ready: a phone, or a tablet held upright, or a desktop window made narrower than 1024 pixels (the dashboard tiles stack into one column when it is narrow enough).'],
 [S_REPORTS,f'For 2: to change location, {LOC_ROUTE}.'],st('88597',[('On a desktop-width window, open the dashboard.','On a desktop-width window, click Dashboard in the top menu.')]))
spec['88598']=([P_REPORTS,'You open the site in a fresh private (incognito) browser window, so nothing remembered from an earlier visit is in play.',
  'Two locations (workplaces) whose figures differ: your normal location (e.g. Staging Heavy Duty - 9919) and one with nothing in it (e.g. ZZAUTOTEST Empty Shop).'],
 [S_REPORTS,f'For 3: both are in the Change Location list ({LOC_ROUTE}). If no empty location exists, create one: profile icon {G} Settings {G} Locations {G} New Location: Name (e.g. ZZAUTOTEST Empty Shop), Address 1, City, State/Province, ZIP/Postal Code, Timezone, Telephone {G} Save &amp; Close; it appears in the Change Location list at once. Create nothing in it.'],
 st('88598',[('Pick your normal workplace (e.g. "ShopHub") in the workplace selector and open the dashboard.',f'Change location to your normal location {CHG} and click Dashboard in the top menu.'),
   ('In the workplace selector, pick "ZZAUTOTEST Empty Shop" without leaving the dashboard.',f'Without leaving the dashboard, change location to ZZAUTOTEST Empty Shop {CHG}.'),
   ('Pick your normal workplace again.','Change location back to your normal location.'),
   ('Look for any way to have no workplace selected (for example clearing the workplace selector).','Look for any way to have no location selected (for example in the Change Location list).')]))
spec['88599']=([P_REPORTS,P_WIN,'A second staff member whose role is different but also has the Reports permission (e.g. a Service Manager), whose sign-in you have.','You are in any location (workplace).'],
 [S_REPORTS,f'For 3: check the role has Reports: profile icon {G} Settings {G} Roles &amp; Permissions {G} edit icon on Service Manager {G} Reports is switched on. If you have no such staff member: {NEWSTAFF("ZZAUTOTEST Second Viewer","Service Manager")}.',f'For 4: to change location, {LOC_ROUTE}.'],st('88599'))
spec['88600']=([P_REPORTS,P_WIN,'You are in any location (workplace).'],[S_REPORTS,f'For 3: to change location, {LOC_ROUTE}.'],
 st('88600',[('<li>Open the dashboard.</li>','<li>Click Dashboard in the top menu.</li>'),('Sign out, sign in again and open the dashboard.',LOUT+', sign in again and click Dashboard in the top menu.')]))
spec['88618']=([P_ADMIN,'You are in one location (workplace).',P_ZOOM],[S_ADMIN,f'For 2: to change location, {LOC_ROUTE}.'],st('88618'))
out={}
for k,(pre,setup,steps) in spec.items():
    n={'custom_preconds':build(pre,setup)}
    if steps!=H[k]['custom_steps']: n['custom_steps']=steps
    out[k]=n
json.dump(out,open('/tmp/cln/refine/batch7h.json','w')); print(len(out),[k for k in out if 'custom_steps' in out[k]])
