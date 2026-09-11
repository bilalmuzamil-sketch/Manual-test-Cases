// Seed an imported invoice via the Invoices Import screen (ZZAUTOTEST data).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P52.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/invoices-import','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
await page.waitForTimeout(13000);
await page.setInputFiles('input[type=file]', `${DIR}/evidence/zzautotest-import.csv`);
await page.waitForTimeout(7000);
R.afterFile={text:await page.evaluate(()=>{const m=document.querySelector('main')||document.body; return (m.innerText||'').replace(/\s+/g,' ').slice(-900);}),
  rows:await page.evaluate(()=>document.querySelectorAll('tbody tr').length),
  buttons:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-12);},VIS)};
log('after selecting the file:'); log('  preview rows:', R.afterFile.rows);
log('  text:', R.afterFile.text.slice(0,500));
log('  buttons:', JSON.stringify(R.afterFile.buttons));
await page.screenshot({path:`${DIR}/evidence/P52-after-file.png`, fullPage:true});
save();
seen();
const clicked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/^Import Invoices$|^Import$/i.test(t(e)));
  if(b && !b.disabled){b.click(); return t(b);} return b?('DISABLED: '+t(b)):null;},VIS);
await page.waitForTimeout(15000);
R.import={clicked, writes:seen().filter(c=>c.m!=='GET').map(c=>c.m+' '+c.u).slice(0,6),
  toasts:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS),
  text:await page.evaluate(()=>{const m=document.querySelector('main')||document.body; return (m.innerText||'').replace(/\s+/g,' ').slice(-700);})};
log('Import clicked: %s', JSON.stringify(clicked));
log('  writes:', JSON.stringify(R.import.writes));
log('  toasts:', JSON.stringify(R.import.toasts));
log('  text:', R.import.text.slice(0,400));
await page.screenshot({path:`${DIR}/evidence/P52-after-import.png`, fullPage:true});
save();
// did it land?
const chk=await page.evaluate(async(a)=>{const r=await fetch(`https://${a}/api/work-orders-imported?pagination[page]=1&pagination[rowsPerPage]=50`,
  {credentials:'include',headers:{Accept:'application/json'}}); return {s:r.status,t:(await r.text()).slice(0,700)};},API);
R.importedAfter=chk; log('work-orders-imported now:', chk.s, chk.t.slice(0,500));
save(); log('done'); await s.browser.close(); process.exit(0);
