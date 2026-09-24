import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000 });
const g = async p => { const r = await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true}); const x=await r.text(); let j=null; try{j=JSON.parse(x);}catch{} return {s:r.status(),j,x:x.slice(0,400)}; };
for (const p of ['/api/staff/my-workplaces','/api/workplaces','/api/iam/view-profile/']) {
  const r = await g(p); console.log('---',p,r.s); console.log(JSON.stringify(r.j?.data||r.j).slice(0,1200));
}
await browser.close();
