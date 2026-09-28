// Look at the product as the second person, whatever role they are in: what the purchase orders
// page offers them, and what finish action a work order header offers them.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const TAG=process.env.TAG||'run';  // run_probe.sh takes the credentials file as its own second argument
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={tag:TAG};
const pr=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await pr.text()); R.perms=j.data?.fe_permissions||j.data||j;}catch{}
console.log('this person holds',(R.perms||[]).length,'permissions');
for(const k of ['reviewWorkOrders','invoicingAndPaymentsCreateAndEdit','invoicingAndPaymentsView','vendorAndOrderManagementCreateAndEdit','vendorAndOrderManagementView','seeFinancialData','orderParts','pickParts','workOrderLinesCreateAndEdit'])
  console.log('  ',(R.perms||[]).includes(k)?'yes':'no ',k);
// --- the purchase orders page ---
await page.goto('https://app.shopview.com/parts/orders',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(11000);
R.poPage={url:page.url().replace('https://app.shopview.com',''),
  reachable:/parts\/orders/.test(page.url()),
  text:(await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,260)))};
R.poButtons=await page.evaluate(()=>[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<34))]);
console.log('\nthe purchase orders page:',R.poPage.url,'| reached it:',R.poPage.reachable);
console.log('what it offers them:',JSON.stringify(R.poButtons));
R.canReceiveFromPO=R.poButtons.some(b=>/receive/i.test(b));
console.log('>>> is any Receive offered there:',R.canReceiveFromPO);
await page.screenshot({path:`${EV}/r108-${TAG}-po.png`}).catch(()=>{});
// --- a work order header ---
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await q.text(); try{return JSON.parse(t);}catch{return null;}};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=40&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
R.headers=[];
for(const w of wos.slice(0,5)){
  await openWo(page,w.id); await page.waitForTimeout(7000);
  const st=await page.evaluate(()=>{
    const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return null;
    const top=[...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.y<200;})
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
    return {header:[...new Set(top)], status:(document.body.innerText.match(/\b(In Progress|Invoiced|Paid|Completed|Awaiting Review)\b/)||[])[0]||null};});
  if(!st) continue;
  R.headers.push({wo:w.work_order_number,...st});
  console.log(`\n${w.work_order_number} (${st.status}) header offers:`,JSON.stringify(st.header));
  if(R.headers.length>=3) break;
}
R.anyReview=R.headers.some(h=>h.header.some(b=>/review/i.test(b)));
R.anyInvoice=R.headers.some(h=>h.header.some(b=>/invoice/i.test(b)));
console.log('\n>>> Mark as reviewed offered anywhere:',R.anyReview,'| Create invoice offered anywhere:',R.anyInvoice);
await page.screenshot({path:`${EV}/r108-${TAG}-wo.png`}).catch(()=>{});
fs.writeFileSync(`${EV}/r108-${TAG}.json`,JSON.stringify(R,null,1));
await browser.close();
