// The person without the review permission is still shown Mark Reviewed. Is the button merely
// shown, or does it actually work? Press it and read the work order back.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='b172fe19-a99c-41dc-aa1d-b52a1955fa9e';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const pr=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await pr.text()); R.perms=j.data?.fe_permissions||j.data||j;}catch{}
R.hasReview=(R.perms||[]).includes('woReviewWorkOrders');
console.log('this person holds the review permission:',R.hasReview);
const calls=[];
page.on('response',async r=>{const m=r.request().method(); if(m==='GET'||m==='OPTIONS')return; if(!/\/api\//.test(r.url()))return;
  calls.push({m,u:r.url().replace('https://api.shopview.com',''),s:r.status(),body:(await r.text().catch(()=>'')).slice(0,160)});});
await openWo(page,WO); await page.waitForTimeout(9000);
R.before=await page.evaluate(()=>(document.body.innerText.match(/\b(In Progress|Invoiced|Paid|Completed|Awaiting Review|Reviewed)\b/g)||[]).slice(0,4));
console.log('the work order reads:',JSON.stringify(R.before));
await page.screenshot({path:`${EV}/r115-before.png`}).catch(()=>{});
const pressed=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.y<200;})
  .find(e=>/Mark Reviewed/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b)return 'Mark Reviewed is not offered'; if(/disabled/.test(b.className||''))return 'Mark Reviewed is shown but greyed out';
  b.click(); return 'pressed Mark Reviewed';});
console.log(pressed); await page.waitForTimeout(6000);
// it may ask to confirm
for(let i=0;i<2;i++){
  const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    return q?(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,200):null;});
  if(!d) break;
  console.log('  it asks:',JSON.stringify(d));
  const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>x.t&&!/^(cancel|close|×)$/i.test(x.t));
    if(!c.length)return 'nothing pressable'; const b=c[c.length-1];
    if(b.dis)return '"'+b.t+'" will not press'; b.e.click(); return 'pressed "'+b.t+'"';});
  console.log('  ',go); await page.waitForTimeout(6000);
}
R.msg=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('it said:',JSON.stringify(R.msg));
R.writes=calls.filter(c=>!/sentry/i.test(c.u));
console.log('what the shop system was asked and answered:');
R.writes.forEach(c=>console.log('  ',c.m,c.s,c.u.split('?')[0].slice(-58),'|',c.body.replace(/\s+/g,' ').slice(0,90)));
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
R.after=await page.evaluate(()=>(document.body.innerText.match(/\b(In Progress|Invoiced|Paid|Completed|Awaiting Review|Reviewed)\b/g)||[]).slice(0,4));
R.headerAfter=await page.evaluate(()=>[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.y<200;})
  .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()))].filter(b=>/Review|Invoice|Complete/i.test(b)));
console.log('\nthe work order now reads:',JSON.stringify(R.after),'| header now:',JSON.stringify(R.headerAfter));
R.itWorked = JSON.stringify(R.before)!==JSON.stringify(R.after) || R.writes.some(c=>c.s>=200&&c.s<300&&/review/i.test(c.u));
console.log('>>> the review actually went through for someone without the permission:',R.itWorked);
await page.screenshot({path:`${EV}/r115-after.png`}).catch(()=>{});
fs.writeFileSync(`${EV}/r115-press-review.json`,JSON.stringify(R,null,1));
await browser.close();
