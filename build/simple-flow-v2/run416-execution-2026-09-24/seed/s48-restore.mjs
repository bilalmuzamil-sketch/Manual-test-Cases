// Put back everything this pass changed about people and shop-wide settings.
//  - the second person back to Technician
//  - my own account back to Admin (it was moved into a role carrying the receive-later permission)
//  - the review requirement back off (it was off before this pass turned it on)
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setRoleFor } from './lib-role.mjs';
import { setSetting } from './lib-seed.mjs';
const ME='bilal.muzamil@shopview.com';
const THEM='bilal.muzamil+serviceadvisorlimitedview@shopview.com';
const FROM=['ZZAUTOTEST No Settings No Catalog','ZZAUTOTEST Review Only','ZZAUTOTEST Complete Only',
            'ZZAUTOTEST Vendor View Only','ZZAUTOTEST Lines Read Only','ZZAUTOTEST Receive Later','Admin','Technician'];
const {browser,page}=await bootProdLogin('/administration/staff',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(45000);
for(const [who,to] of [[THEM,'Technician'],[ME,'Admin']]){
  console.log('\n--- putting '+who.split('@')[0]+' back to '+to+' ---');
  let done=false;
  for(const from of FROM){ if(from===to) continue;
    const r=await setRoleFor(page,who,from,to);
    console.log('  looking under "'+from+'":',r);
    if(!/not listed/.test(r)){ done=true; break; } }
  if(!done) console.log('  COULD NOT FIND THEM under any role - say so in the report rather than assuming');
}
try{ console.log('\n',await setSetting(page,'Require Review Before Completion',false)); }
catch(e){ console.log('\ncould not put the review setting back:',e.message.slice(0,160)); }
await browser.close();
