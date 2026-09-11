import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const CUST='928a4583-13a3-4d73-af64-9397ffc425dc';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P93.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872',`/customers/${CUST}/work-orders`,'admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
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
await page.waitForTimeout(9000);
// pick a payment method first, then look again at the buttons
await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
  const f=[...d.querySelectorAll('.q-field,.q-select')].find(x=>/payment method/i.test(x.innerText||''));
  if(f)(f.querySelector('input')||f).click();},VIS);
await page.waitForTimeout(2500);
const m=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).find(e=>/^Check$/i.test(t(e)));
  if(o){o.click(); return t(o);} return null;},VIS);
await page.waitForTimeout(3000);
log('picked method: %s', m);
R.dialog=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return null;
  return {
    buttons:[...d.querySelectorAll('button')].filter(isVis).map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(), disabled:b.disabled})),
    inputs:[...d.querySelectorAll('input')].map((i,ix)=>({ix, type:i.type, val:i.value, readOnly:i.readOnly,
      label:((i.closest('.q-field')||{}).innerText||'').replace(/\s+/g,' ').trim().slice(0,40),
      inRow:!!i.closest('tbody tr')})),
    text:(d.innerText||'').replace(/\s+/g,' ').slice(0,800)};},VIS);
log('buttons: %s', JSON.stringify(R.dialog.buttons));
log('inputs: %s', JSON.stringify(R.dialog.inputs));
await page.screenshot({path:`${DIR}/evidence/P93-dialog.png`, fullPage:true});
// fill the in-row amount input
const filled=await page.evaluate(()=>{
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const inp=[...d.querySelectorAll('tbody tr input')].find(i=>i.type==='text'||i.type==='number');
  if(!inp) return 'no row input';
  const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  inp.focus(); set.call(inp,'938.14');
  inp.dispatchEvent(new Event('input',{bubbles:true}));
  inp.dispatchEvent(new Event('change',{bubbles:true}));
  inp.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true}));
  return 'set to '+inp.value;});
await page.waitForTimeout(3500);
log('amount fill: %s', filled);
R.after=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  return {buttons:[...d.querySelectorAll('button')].filter(isVis).map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(),disabled:b.disabled})),
          text:(d.innerText||'').replace(/\s+/g,' ').slice(0,500)};},VIS);
log('buttons after filling: %s', JSON.stringify(R.after.buttons));
log('text: %s', R.after.text.slice(0,300));
await page.screenshot({path:`${DIR}/evidence/P93-filled.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
