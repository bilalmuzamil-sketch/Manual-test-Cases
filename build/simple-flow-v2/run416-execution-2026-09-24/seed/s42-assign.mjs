// Put the second person into a named role. Rule 118's "reset to template first" is about proving a
// role is in its DEFAULT shape; these roles were built deliberately for these checks and were read
// back after saving, so resetting them would destroy exactly what is being tested.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setRoleFor } from './lib-role.mjs';
const WHO='bilal.muzamil+serviceadvisorlimitedview@shopview.com';
const TO=process.argv[2];
if(!TO){ console.log('name the role to put them in'); process.exit(1); }
const {browser,page}=await bootProdLogin('/administration/staff',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(45000);
for(const from of ['ZZAUTOTEST Lines Read Only','ZZAUTOTEST Vendor View Only','ZZAUTOTEST Review Only','ZZAUTOTEST Complete Only','Technician','Admin','ZZAUTOTEST Receive Later']){
  if(from===TO) continue;
  const r=await setRoleFor(page,WHO,from,TO);
  console.log('looking under "'+from+'":',r);
  if(!/not listed/.test(r)) break;
}
await browser.close();
