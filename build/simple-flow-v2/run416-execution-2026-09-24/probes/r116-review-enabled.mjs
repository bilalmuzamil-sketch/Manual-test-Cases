// Find a work order where Mark Reviewed is genuinely LIVE (not greyed out) for an admin, so the
// same button can be compared fairly for a person who lacks the review permission.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const TAG=process.env.TAG||'admin';
const ONLY=process.env.WO||'';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={tag:TAG,rows:[]};
const pr=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await pr.text()); R.perms=j.data?.fe_permissions||j.data||j;}catch{}
console.log('as',TAG,'| holds the review permission:',(R.perms||[]).includes('woReviewWorkOrders'),
            '| holds invoicing:',(R.perms||[]).includes('invoicingPaymentsCreateAndEdit'));
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  try{return JSON.parse(await q.text());}catch{return null;}};
const list=ONLY?[{id:ONLY}]:((await call('/api/work-orders?pagination%5BrowsPerPage%5D=40&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[]);
for(const w of list.slice(0,16)){
  await openWo(page,w.id); await page.waitForTimeout(6000);
  const st=await page.evaluate(()=>{
    const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return null;
    const btns=[...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.y<200;})
      .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')||e.disabled}))
      .filter(b=>/Mark Reviewed|Create Invoice|Complete Work Order/i.test(b.t));
    const state=(document.body.innerText.match(/\b(Awaiting Review|Reviewed|Invoiced|Paid|In Progress)\b/)||[])[0]||null;
    return {btns,state};});
  if(!st||!st.btns.length) continue;
  R.rows.push({id:w.id,...st});
  console.log(` ${w.id.slice(0,8)} (${st.state}) -> `+st.btns.map(b=>b.t+(b.dis?' [GREYED]':' [live]')).join(', '));
  if(st.btns.some(b=>/Mark Reviewed/i.test(b.t)&&!b.dis)) { console.log('   ^^ this one has a LIVE Mark Reviewed'); if(!ONLY) break; }
}
fs.writeFileSync(`${EV}/r116-${TAG}.json`,JSON.stringify(R,null,1));
await browser.close();
