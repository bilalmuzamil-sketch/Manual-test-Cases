// Switch location through the UI control, then run C53537's steps of replication.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const CUST='2a4b998e-a24e-42f2-b443-1ff4367ebde4';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P74.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/','admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const bar=()=>page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/ - \d+/.test(x))||null;},VIS);
await page.waitForTimeout(10000);
R.before=await bar(); log('location at boot: %s', R.before);

if(!/Heavy Duty/.test(R.before||'')){
  // open the profile menu and click the Change Location row, then read EVERYTHING that appears
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/ - \d+/.test(t(e))); if(b)b.click();},VIS);
  await page.waitForTimeout(3000);
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const e2=[...document.querySelectorAll('.q-item')].filter(isVis).filter(x=>/^Change Location/.test(t(x)))
      .sort((a,b)=>t(a).length-t(b).length)[0];
    if(e2){ for(const ev of ['pointerover','mouseover','mouseenter','pointerdown','mousedown','mouseup','click'])
      e2.dispatchEvent(new MouseEvent(ev,{bubbles:true})); }},VIS);
  await page.waitForTimeout(4500);
  R.menuAfter=await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).map(m=>
      [...m.querySelectorAll('.q-item,[role=option],li,label')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20));},VIS);
  log('menus after opening Change Location: %s', JSON.stringify(R.menuAfter));
  await page.screenshot({path:`${DIR}/evidence/P74-location-menu.png`});
  const picked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const o=[...document.querySelectorAll('.q-menu .q-item,.q-dialog .q-item,[role=option],li')].filter(isVis)
      .find(e=>/Heavy Duty/i.test(t(e))&&t(e).length<60);
    if(o){o.click(); return t(o);} return null;},VIS);
  await page.waitForTimeout(12000);
  R.picked=picked; R.after=await bar();
  log('picked "%s" -> location now: %s', picked, R.after);
}
R.finalLocation=await bar(); save();
if(!/Heavy Duty/.test(R.finalLocation||'')){
  log('STILL NOT on Heavy Duty (%s) - stopping before any write', R.finalLocation);
  save(); await s.browser.close(); process.exit(1);
}
// open the customer and the Invoices tab
await page.goto(`${APP}/customers/${CUST}/work-orders`,{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(13000);
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item,div')].filter(isVis)
    .filter(x=>/^Invoices?(\s*\(\d+\))?$/i.test(t(x))).sort((a,b)=>t(a).length-t(b).length)[0];
  if(e2)e2.click();},VIS);
await page.waitForTimeout(15000);
R.tab={url:page.url(),
  headers:await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>(t.innerText||'').trim())),
  rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map((r,i)=>`${i}: ${(r.innerText||'').replace(/\s+/g,' ').slice(0,170)}`)),
  checkboxes:await page.evaluate(()=>document.querySelectorAll('tbody .q-checkbox, tbody input[type=checkbox]').length),
  buttons:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-14);},VIS)};
log('Invoices tab: %d rows, %d checkboxes', R.tab.rows.length, R.tab.checkboxes);
log('  headers: %s', JSON.stringify(R.tab.headers));
for(const r of R.tab.rows.slice(0,12)) log('   ', r);
log('  buttons: %s', JSON.stringify(R.tab.buttons));
await page.screenshot({path:`${DIR}/evidence/P74-invoices-tab.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
