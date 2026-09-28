// The three roles the remaining permission checks need. Each is read back after saving - a role
// whose name does not match what it carries has already cost this pass two deletions (L0215).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { buildRole, verifyRole } from './lib-role2.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(45000);
const R={};
const WANT=[
  // C44591: may look at vendors and purchase orders but not act on them
  {name:'ZZAUTOTEST Vendor View Only',
   matrix:{'Vendor and order management':[true,false,false]}, toggles:{}},
  // C44601: may mark a work order reviewed, may not invoice
  {name:'ZZAUTOTEST Review Only',
   matrix:{'Invoicing & payments':[false,false,false]}, toggles:{'Review work orders':true}},
  // C44601: may finish work but may neither review nor invoice
  {name:'ZZAUTOTEST Complete Only',
   matrix:{'Invoicing & payments':[false,false,false]}, toggles:{'Review work orders':false}},
];
for(const w of WANT){
  console.log('\n=== '+w.name+' ===');
  const made=await buildRole(page,w.name,{matrix:w.matrix,toggles:w.toggles});
  made.log.forEach(l=>console.log('  ',l));
  console.log('  ',made.created, made.anyway||'');
  const back=await verifyRole(page,w.name,w.matrix);
  console.log('  read back:',JSON.stringify(back));
  R[w.name]={made,back};
  const ok=back.got&&Object.entries(w.matrix).every(([k,v])=>back.got[k]&&v.every((x,i)=>x===null||back.got[k][i]===x));
  console.log('  >>> the role carries what its name says:',!!ok);
}
fs.writeFileSync(`${EV}/s40-three-roles.json`,JSON.stringify(R,null,1));
await browser.close();
