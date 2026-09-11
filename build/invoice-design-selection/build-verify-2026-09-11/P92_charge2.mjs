import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const CUST='928a4583-13a3-4d73-af64-9397ffc425dc';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P92.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872',`/customers/${CUST}/work-orders`,'admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,''),b:(r.postData()||'').slice(0,500)});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
await page.waitForTimeout(15000);
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item,div')].filter(isVis)
    .filter(x=>/^Invoices?(\s*\(\d+\))?$/i.test(t(x))).sort((a,b)=>t(a).length-t(b).length)[0];
  if(e2)e2.click();},VIS);
await page.waitForTimeout(15000);
await page.evaluate(()=>{const row=[...document.querySelectorAll('tbody tr')].find(r=>/P1-162/.test(r.innerText||''));
  const cb=row&&row.querySelector('.q-checkbox, input[type=checkbox]'); if(cb) cb.click();});
await page.waitForTimeout(3000);
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/^New Payment$/i.test(t(e))); if(b)b.click();},VIS);
await page.waitForTimeout(8000);
// open the Payment Method dropdown
await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
  const f=[...d.querySelectorAll('.q-field,.q-select')].find(x=>/payment method/i.test(x.innerText||''));
  if(f)(f.querySelector('input')||f).click();},VIS);
await page.waitForTimeout(3000);
R.methods=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS);
log('payment methods offered: %s', JSON.stringify(R.methods));
await page.screenshot({path:`${DIR}/evidence/P92-methods.png`});
const picked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).find(e=>/charge account/i.test(t(e)));
  if(o){o.click(); return t(o);} return null;},VIS);
await page.waitForTimeout(3500);
R.picked=picked; log('picked method: %s', picked);
// fill the payment amount for the row
await page.evaluate(()=>{
  const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d)return;
  const row=[...d.querySelectorAll('tbody tr')].find(r=>/P1-162/.test(r.innerText||''));
  const inp=row&&row.querySelector('input');
  if(inp){ const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    set.call(inp,'938.14'); inp.dispatchEvent(new Event('input',{bubbles:true})); inp.dispatchEvent(new Event('change',{bubbles:true})); }
});
await page.waitForTimeout(3000);
R.beforeSubmit=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  return d?(d.innerText||'').replace(/\s+/g,' ').slice(0,700):null;},VIS);
log('dialog before submit: %s', (R.beforeSubmit||'').slice(0,400));
await page.screenshot({path:`${DIR}/evidence/P92-filled.png`, fullPage:true});
seen();
const submitted=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return 'no dialog';
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^Make Payment$/i.test(t(e)));
  if(b && !b.disabled){b.click(); return t(b);} return b?'DISABLED':'no button';},VIS);
await page.waitForTimeout(14000);
R.submit={clicked:submitted, writes:seen().filter(c=>c.m!=='GET').map(c=>c.m+' '+c.u).slice(0,6),
  toasts:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS)};
log('Make Payment: %s | writes %s | toasts %s', submitted, JSON.stringify(R.submit.writes), JSON.stringify(R.submit.toasts));
await page.screenshot({path:`${DIR}/evidence/P92-after-payment.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
