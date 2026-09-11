// Pay P1-162 by Charge Account from the PART SALE's Finance tab (where that button lives).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const PS='90a95f29-f405-4763-834d-6e3a237f8c33';   // P1-162
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P94.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872',`/parts/part-sale/${PS}/finance`,'admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
await page.waitForTimeout(16000);
log('url: %s', page.url());
const np=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/^New Payment$/i.test(t(e)));
  if(b){b.click(); return t(b);} return null;},VIS);
await page.waitForTimeout(9000);
R.dialog=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,800),
    buttons:[...d.querySelectorAll('button')].filter(isVis).map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(),disabled:b.disabled}))};},VIS);
log('New Payment: %s', np);
log('dialog buttons: %s', JSON.stringify(R.dialog&&R.dialog.buttons));
log('dialog text: %s', (R.dialog&&R.dialog.text||'').slice(0,350));
await page.screenshot({path:`${DIR}/evidence/P94-payment-dialog.png`, fullPage:true});
save();
seen();
const ca=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return 'no dialog';
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^Charge Account$/i.test(t(e)));
  if(b && !b.disabled){b.click(); return 'clicked';} return b?'DISABLED':'no Charge Account button';},VIS);
await page.waitForTimeout(14000);
R.charge={clicked:ca, writes:seen().filter(c=>c.m!=='GET').map(c=>c.m+' '+c.u).slice(0,6),
  toasts:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS),
  page:await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,400))};
log('Charge Account: %s | writes %s | toasts %s', ca, JSON.stringify(R.charge.writes), JSON.stringify(R.charge.toasts));
await page.screenshot({path:`${DIR}/evidence/P94-after-charge.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
