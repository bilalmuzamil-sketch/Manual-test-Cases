// The three roles were created but the Create & Edit box would not come off while Delete was still
// on, so they carry more than their names claim. Repair them in place and read them back.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { editRole, verifyRole } from './lib-role2.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(45000);
const R={};
const WANT=[
  {name:'ZZAUTOTEST Vendor View Only', matrix:{'Vendor and order management':[true,false,false]}, toggles:{}},
  {name:'ZZAUTOTEST Review Only',      matrix:{'Invoicing & payments':[false,false,false]}, toggles:{'Review work orders':true}},
  {name:'ZZAUTOTEST Complete Only',    matrix:{'Invoicing & payments':[false,false,false]}, toggles:{'Review work orders':false}},
];
for(const w of WANT){
  console.log('\n=== '+w.name+' ===');
  const r=await editRole(page,w.name,{matrix:w.matrix,toggles:w.toggles});
  (r.log||[]).forEach(l=>console.log('  ',l));
  console.log('  ',r.saved||r.opened, r.anyway||'');
  const back=await verifyRole(page,w.name,w.matrix);
  console.log('  read back:',JSON.stringify(back.got));
  const ok=back.got&&Object.entries(w.matrix).every(([k,v])=>back.got[k]&&v.every((x,i)=>x===null||back.got[k][i]===x));
  console.log('  >>> it now carries what its name says:',!!ok);
  R[w.name]={r,back,ok};
}
fs.writeFileSync(`${EV}/s41-fix-roles.json`,JSON.stringify(R,null,1));
await browser.close();
