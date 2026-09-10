// Put the spare role back to the exact 33 permissions it started with.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const ROLE='e0e9b247-5432-43e8-9e35-f0c9bf3ade16';
const TIDS={workOrdersView:'area_workorders_view', workOrdersCreateAndEdit:'area_workorders_createandedit',
  workOrdersDelete:'area_workorders_delete', woReviewWorkOrders:'wosetting_reviewworkorders',
  woPickParts:'wosetting_pickparts', workOrderLinesCreateAndEdit:'area_workorderlines_createandedit',
  workOrderLinesDelete:'area_workorderlines_delete'};
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const WANT=JSON.parse(fs.readFileSync(`${DIR}/evidence/BIG16-role-before.json`)).fe_permissions.map(p=>p.code);
const s=await boot2('admin',{route:'/workorders'});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
const codes=async()=>{const d=((await call('GET',`/api/roles/${ROLE}`)).json||{}).data||{};
  return (d.fe_permissions||[]).map(p=>p.code);};
for (let pass=1; pass<=6; pass++){
  const now=await codes(); const missing=WANT.filter(c=>!now.includes(c));
  log('pass %d: %d of %d, missing %s', pass, now.length, WANT.length, JSON.stringify(missing));
  if(!missing.length) break;
  await page.goto(`${APP}/administration/roles-permissions/${ROLE}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'role'}); await page.waitForTimeout(2500);
  const acted=await page.evaluate(pairs=>{const out=[];
    for(const [c,tid] of pairs){ const el=document.querySelector(`[data-test-id=${tid}]`);
      if(!el){out.push([c,'absent']);continue;}
      const cur=el.getAttribute('aria-checked')==='true'||el.classList.contains('q-toggle--truthy')
             ||(el.querySelector('input')||{}).checked===true;
      if(cur){out.push([c,'already']);continue;}
      (el.closest('label,.q-toggle,.q-checkbox')||el).click(); out.push([c,'clicked']); }
    return out;}, missing.map(c=>[c,TIDS[c]]).filter(x=>x[1]));
  await page.waitForTimeout(2500);
  const saved=await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^save$/i.test(t(e)));
    if(!b) return 'no Save'; if(b.disabled) return 'greyed'; b.click(); return 'saved';}, VIS);
  await page.waitForTimeout(3500);
  await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return;
    const go=[...d.querySelectorAll('button')].filter(isVis).find(e=>/confirm|save|yes|update|ok/i.test(t(e)));
    if(go) go.click();}, VIS);
  await page.waitForTimeout(6000);
  log('  acted %s | %s', JSON.stringify(acted), saved);
}
const end=await codes();
log('LEFT AT %d of %d; missing %s', end.length, WANT.length, JSON.stringify(WANT.filter(c=>!end.includes(c))));
fs.writeFileSync(`${DIR}/evidence/BIG21.json`, JSON.stringify({end, missing:WANT.filter(c=>!end.includes(c))},null,1));
await s.browser.close(); process.exit(0);
