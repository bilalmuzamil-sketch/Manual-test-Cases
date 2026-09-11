// Stage A: pay part sale invoice P1-162 by Charge Account, so parts become available for credit.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const CUST='928a4583-13a3-4d73-af64-9397ffc425dc';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P91.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872',`/customers/${CUST}/work-orders`,'admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,''),b:(r.postData()||'').slice(0,400)});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
await page.waitForTimeout(15000);
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item,div')].filter(isVis)
    .filter(x=>/^Invoices?(\s*\(\d+\))?$/i.test(t(x))).sort((a,b)=>t(a).length-t(b).length)[0];
  if(e2)e2.click();},VIS);
await page.waitForTimeout(15000);
// tick the P1-162 row
R.ticked=await page.evaluate(()=>{
  const row=[...document.querySelectorAll('tbody tr')].find(r=>/P1-162/.test(r.innerText||''));
  if(!row) return 'row not found';
  const cb=row.querySelector('.q-checkbox, input[type=checkbox]');
  if(cb){ cb.click(); return 'ticked'; }
  row.click(); return 'no checkbox - clicked the row';
});
await page.waitForTimeout(3500);
log('tick P1-162: %s', R.ticked);
R.buttons=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-12);},VIS);
log('buttons now: %s', JSON.stringify(R.buttons));
await page.screenshot({path:`${DIR}/evidence/P91-ticked.png`, fullPage:true});
seen();
const np=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/^New Payment$/i.test(t(e)));
  if(b){b.click(); return t(b);} return null;},VIS);
await page.waitForTimeout(8000);
R.payDialog=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,1000),
    fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)),
    buttons:[...d.querySelectorAll('button')].map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    rows:[...d.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,140))};},VIS);
log('New Payment clicked: %s', np);
log('dialog: %s', JSON.stringify(R.payDialog).slice(0,1100));
await page.screenshot({path:`${DIR}/evidence/P91-new-payment.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
