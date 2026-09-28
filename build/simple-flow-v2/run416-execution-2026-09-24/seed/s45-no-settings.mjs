// App Settings is a switch beneath Settings, not one of the View/Create&Edit/Delete rows.
// Take it off in the role that already has catalogue editing off, then put the second person in it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { editRole } from './lib-role2.mjs';
import { setRoleFor } from './lib-role.mjs';
const NAME='ZZAUTOTEST No Settings No Catalog';
const WHO='bilal.muzamil+serviceadvisorlimitedview@shopview.com';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(45000);
const r=await editRole(page,NAME,{toggles:{'App Settings':false}});
(r.log||[]).forEach(l=>console.log('  ',l));
console.log('  ',r.saved||r.opened, r.anyway||'');
for(const from of ['ZZAUTOTEST Review Only','ZZAUTOTEST Complete Only','ZZAUTOTEST Vendor View Only','ZZAUTOTEST Lines Read Only','Admin','Technician']){
  const out=await setRoleFor(page,WHO,from,NAME);
  console.log('looking under "'+from+'":',out);
  if(!/not listed/.test(out)) break;
}
await browser.close();
