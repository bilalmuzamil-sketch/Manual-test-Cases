// The Status field does change to Declined on screen, but the Edit Line window will not close
// and the line stays Authorized. This uses a REAL mouse click on the button (a scripted .click()
// can miss the framework's own handler) and photographs the window at each step.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG28.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
await page.setViewportSize({width:1600, height:1000});
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
await settle(page,{label:'start'});
const victim=(await lines())[0];

// open the line
await page.evaluate(vis=>{const isVis=eval(vis);
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  const row=[...tbl.querySelectorAll('tr')].filter(isVis).find(r=>/Replace - Brake pot/i.test(r.innerText||''));
  const cell=[...row.querySelectorAll('td')].find(c=>/Replace - Brake pot/i.test(c.innerText||''))||row;
  cell.click();}, VIS);
await page.waitForTimeout(5000);
R.buttons = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return null;
  return [...d.querySelectorAll('button')].filter(isVis)
    .map(b=>({txt:t(b), tid:b.getAttribute('data-test-id')||'', disabled:b.disabled}));}, VIS);
log('buttons in the window: %s', JSON.stringify(R.buttons));

// pick Declined with a real click
const field = page.locator('.q-dialog .q-field').filter({hasText:'Status'}).first();
await field.click({timeout:8000}).catch(e=>log('field click: '+e.message.slice(0,60)));
await page.waitForTimeout(2500);
const opt = page.locator('.q-menu .q-item').filter({hasText:'Declined'}).first();
await opt.click({timeout:8000}).catch(e=>log('option click: '+e.message.slice(0,60)));
await page.waitForTimeout(2500);
R.fieldNow = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const f=[...d.querySelectorAll('.q-field')].filter(isVis).find(e=>/status/i.test(t(e)));
  return f?{shows:t(f).slice(0,50), value:(f.querySelector('input')||{}).value}:null;}, VIS);
log('Status field: %s', JSON.stringify(R.fieldNow));
await page.screenshot({path:`${DIR}/evidence/BIG28-1-picked.png`}).catch(()=>{});

// real mouse click on the save button
const names = (R.buttons||[]).map(b=>b.txt).filter(x=>/save/i.test(x));
R.saveNames = names;
for (const n of names){
  const btn = page.locator('.q-dialog button', {hasText:n}).first();
  await btn.scrollIntoViewIfNeeded().catch(()=>{});
  await btn.click({timeout:8000}).catch(e=>log('save click "'+n+'": '+e.message.slice(0,70)));
  await page.waitForTimeout(6000);
  const open = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-dialog')].filter(isVis).length>0;}, VIS);
  R['after_'+n] = {dialogStillOpen:open, lines:(await lines()).map(l=>l.status)};
  log('clicked "%s" -> window still open %s | line statuses %s', n, open, JSON.stringify(R['after_'+n].lines));
  if (!open) break;
}
await page.screenshot({path:`${DIR}/evidence/BIG28-2-aftersave.png`}).catch(()=>{});
R.final = (await lines()).map(l=>({s:l.status,d:l.status_display}));
log('final line statuses: %s', JSON.stringify(R.final));
save();
log('done');
await s.browser.close();
process.exit(0);
