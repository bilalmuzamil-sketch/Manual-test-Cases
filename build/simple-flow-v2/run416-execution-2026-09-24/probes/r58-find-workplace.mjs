// Both of his work orders redirect me to the list, so my session is pointed at the wrong workplace -
// and an earlier probe of mine tried a switch, so I may not even be where I started. Stop guessing
// the reply shapes: print them, find which workplace holds the work order, and switch to it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WOS=['f86430ce-7e98-407a-baad-86df0e569aca','f238353d-b383-49f8-9937-e06da106ebab'];
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:12000});
const call=async(p,init)=>{const r=await ctx.request.fetch(`https://${APIH}${p}`,
  {headers:{Accept:'application/json','Content-Type':'application/json'},ignoreHTTPSErrors:true,...(init||{})});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{} return {s:r.status(),j,raw:t.slice(0,300)};};
const R={};
for (const p of ['/api/auth/me','/api/staff/my-workplaces','/api/iam/me']) {
  const r=await call(p);
  console.log('\n---',p,'->',r.s);
  if(r.j) console.log(JSON.stringify(r.j).slice(0,600)); else console.log(r.raw);
  R[p]=r.j||r.raw;
}
for (const id of WOS) {
  const r=await call(`/api/work-orders/${id}`);
  console.log('\n--- work order',id.slice(0,8),'->',r.s);
  if(r.j){ const d=r.j.data||r.j;
    console.log('   number:',d.work_order_number||d.number,'| status:',JSON.stringify(d.status),
      '| workplace:',JSON.stringify(d.workplace||d.workplace_id||d.location||null)); }
  else console.log('   ',r.raw);
  R['wo_'+id.slice(0,8)]=r.j||r.raw;
}
fs.writeFileSync(`${EV}/p7d-workplace.json`,JSON.stringify(R,null,1));
await browser.close();
