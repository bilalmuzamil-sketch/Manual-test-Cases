import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P95.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/parts/part-sales?status=invoiced&status=paid','admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
await page.waitForTimeout(16000);
log('url: %s | rows: %d', page.url(), await page.evaluate(()=>document.querySelectorAll('tbody tr').length));
const found=await page.evaluate(()=>{
  const c=[...document.querySelectorAll('td,a,span,div')].filter(e=>/^P1-162$/.test((e.innerText||'').trim()));
  if(c[0]){c[0].click(); return true;} return false;});
await page.waitForTimeout(13000);
log('opened P1-162: %s -> %s', found, page.url());
if(!found){
  const nums=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,70)).slice(0,10));
  log('rows visible: %s', JSON.stringify(nums));
}
// Finance tab
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-tab,[role=tab],a,div')].filter(isVis).find(x=>/^Finance$/i.test(t(x)));
  if(e2)e2.click();},VIS);
await page.waitForTimeout(14000);
R.url=page.url(); log('finance url: %s', R.url);
R.controls=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-12);},VIS);
log('controls: %s', JSON.stringify(R.controls));
await page.screenshot({path:`${DIR}/evidence/P95-finance.png`, fullPage:false});
const np=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/^New Payment$/i.test(t(e)));
  if(b){b.click(); return true;} return false;},VIS);
await page.waitForTimeout(9000);
R.dialog=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,700),
    buttons:[...d.querySelectorAll('button')].filter(isVis).map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(),disabled:b.disabled}))};},VIS);
log('New Payment: %s | buttons: %s', np, JSON.stringify(R.dialog&&R.dialog.buttons));
await page.screenshot({path:`${DIR}/evidence/P95-dialog.png`, fullPage:true});
save();
seen();
const ca=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return 'no dialog';
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^Charge Account$/i.test(t(e)));
  if(b&&!b.disabled){b.click(); return 'clicked';} return b?'DISABLED':'no Charge Account button';},VIS);
await page.waitForTimeout(15000);
R.charge={clicked:ca, writes:seen().filter(c=>c.m!=='GET').map(c=>c.m+' '+c.u).slice(0,6),
  toasts:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS)};
log('Charge Account: %s | writes %s | toasts %s', ca, JSON.stringify(R.charge.writes), JSON.stringify(R.charge.toasts));
await page.screenshot({path:`${DIR}/evidence/P95-after.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
