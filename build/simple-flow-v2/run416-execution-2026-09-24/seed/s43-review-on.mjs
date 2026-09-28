// C44601 and C44597 both need a work order that is waiting to be reviewed. Turn the review
// requirement on, then find a work order whose header offers Mark as reviewed to an admin.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setSetting } from './lib-seed.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/administration/settings',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(45000);
const R={};
try{ console.log(await setSetting(page,'Require Review Before Completion',true)); }
catch(e){ console.log('could not turn it on:',e.message.slice(0,200)); }
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  try{return JSON.parse(await q.text());}catch{return null;}};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=40&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
console.log('\nlooking through',wos.length,'work orders for one waiting to be reviewed');
R.found=[];
for(const w of wos.slice(0,14)){
  await openWo(page,w.id); await page.waitForTimeout(6000);
  const st=await page.evaluate(()=>{
    const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return null;
    const top=[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.y<200;})
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean))];
    const lines=[...document.querySelectorAll('tr')].filter(t=>/^\d+\s+more_vert/.test((t.innerText||'').replace(/\s+/g,' ').trim()))
      .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,56));
    return {top,lines,review:top.some(b=>/review/i.test(b)),invoice:top.some(b=>/invoice/i.test(b))};});
  if(!st) continue;
  if(st.review||st.invoice){ R.found.push({wo:w.work_order_number,id:w.id,...st});
    console.log(` ${w.work_order_number}: ${JSON.stringify(st.top.filter(b=>/review|invoice|complete/i.test(b)))} | lines: ${st.lines.length}`); }
  if(R.found.filter(f=>f.review).length>=2) break;
}
console.log('\nwork orders offering Mark as reviewed:',JSON.stringify(R.found.filter(f=>f.review).map(f=>f.wo)));
console.log('work orders offering Create invoice:',JSON.stringify(R.found.filter(f=>f.invoice).map(f=>f.wo)));
fs.writeFileSync(`${EV}/s43-review-on.json`,JSON.stringify(R,null,1));
await browser.close();
