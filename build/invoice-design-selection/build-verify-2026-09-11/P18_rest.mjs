// The remaining 13: credit invoices, the approving contact, reverse/re-invoice, batch/imported,
// the second location, and the starting value. Every render guarded against the shared branch.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P18.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,400)};},{api:API,m,p,b:b||null});
const raw=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include'});
  const t=await r.text(); return {status:r.status,len:t.length,body:t};},{api:API,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const openInvoiceTab=async()=>{await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5500);
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
  await page.waitForTimeout(4500);};
const setDesign=async(want)=>{ if((await stored())===want.toLowerCase()) return want.toLowerCase();
  for(let i=0;i<3;i++){ await openInvoiceTab();
    await page.evaluate(vis=>{const isVis=eval(vis);
      const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
      if(f)(f.querySelector('input')||f).click();},VIS);
    await page.waitForTimeout(2200);
    await page.evaluate(({vis,want})=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).find(e=>new RegExp(want,'i').test(e.innerText||'')); if(o)o.click();},{vis:VIS,want});
    await page.waitForTimeout(2400);
    await page.evaluate(({vis,want})=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
      const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
      const bs=[...d.querySelectorAll('button')].filter(isVis);
      const b=bs.find(e=>new RegExp('switch to '+want,'i').test(t(e)))||bs.find(e=>/^(Switch|Confirm|Yes)/i.test(t(e))); if(b)b.click();},{vis:VIS,want});
    await page.waitForTimeout(7000);
    const now=await stored(); if(now===want.toLowerCase()) return now; }
  return await stored();};
const render=async(invId,isEst=0,ev='')=>{const a=await stored();
  const r=await raw(`/api/invoices/preview?invoice_id=${invId}&type=html&isEstimate=${isEst}&includeDeclined=0&historyEvent=${ev}`);
  const b=await stored(); if(a!==b) return {discarded:true, before:a, after:b};
  const t=r.body.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<[^>]+>/g,'\n');
  return {stored:a, status:r.status, len:r.len,
    ibs:/IBS#/.test(t), authorizerWord:/\bauthorizer\b/i.test(t),
    names:(t.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g)||[]).slice(0,40),
    docNo:(t.match(/\b(?:INV|EST|CR)-[A-Z0-9-]+/)||[])[0]||null,
    money:(t.match(/\$[\d,]+\.\d{2}/g)||[]).sort(), body:r.body};};

// ============ A. the SECOND LOCATION (C53521) ============
R.locations={};
const places=rowsOf((await api('GET','/api/staff/my-workplaces')).json);
R.locations.list=places.map(p=>({id:p.id,name:p.name}));
log('locations:', R.locations.list.map(l=>l.name));
const bar=()=>page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/Staging .* - \d+/.test(x))||null;},VIS);
await openInvoiceTab();
R.locations.before={bar:await bar(), stored:await stored()};
// open the profile menu, then the "Change Location" submenu, then pick the other one
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/Staging .* - \d+/.test(t(e))); if(b)b.click();},VIS);
await page.waitForTimeout(3000);
const subOpen=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e=[...document.querySelectorAll('.q-item,.q-menu *')].filter(isVis).filter(x=>/^Change Location/.test(t(x)))
    .sort((a,b)=>t(a).length-t(b).length)[0];
  if(e){e.click(); return t(e);} return null;},VIS);
await page.waitForTimeout(3500);
R.locations.submenu=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item,[role=option],.q-dialog .q-item')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20);},VIS);
log('change-location submenu:', subOpen, JSON.stringify(R.locations.submenu));
await page.screenshot({path:`${DIR}/evidence/P18-location-menu.png`});
const picked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option],.q-dialog .q-item,li')].filter(isVis)
    .find(e=>/Lethbridge/i.test(t(e))&&t(e).length<45); if(o){o.click(); return t(o);} return null;},VIS);
await page.waitForTimeout(10000);
await openInvoiceTab();
R.locations.after={picked, bar:await bar(), stored:await stored(),
  onScreen:await page.evaluate(vis=>{const isVis=eval(vis);
    const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
    const i=f&&f.querySelector('input'); return i?i.value:null;},VIS),
  designControlCount:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-field,.q-select,.q-toggle')].filter(isVis)
      .filter(x=>/invoice design|legacy invoice layout/i.test(x.innerText||'')).length;},VIS)};
log('LOCATION: before=%s after=%s | setting reads %s | design controls on the page: %d',
  R.locations.before.bar, R.locations.after.bar, R.locations.after.onScreen, R.locations.after.designControlCount);
await page.screenshot({path:`${DIR}/evidence/P18-setting-second-location.png`});
save();

// ============ B. the APPROVING CONTACT (C53570) ============
// a work order that carries one, not yet invoiced
const wos=rowsOf((await api('GET','/api/work-orders?limit=200')).json);
R.auth={candidates:[]};
for(const w of wos.slice(0,90)){ const d=(await api('GET',`/api/work-orders/view/${w.id}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order)x=x.work_order;
  if((x.authorizer_contact_id||x.authorizer_full_name)&&x.invoice_id)
    R.auth.candidates.push({id:w.id,num:x.number,contact:x.authorizer_full_name,code:x.ibs_approval_code,invId:x.invoice_id,status:x.status});
  if(R.auth.candidates.length>=2) break; }
log('invoiced work orders carrying an approving contact:', JSON.stringify(R.auth.candidates));
if(R.auth.candidates.length){
  const c=R.auth.candidates[0]; R.auth.used=c;
  for(const want of ['Legacy','Modern']){
    const now=await setDesign(want); if(now!==want.toLowerCase()) continue;
    const r=await render(c.invId,0);
    R.auth[want]={stored:r.stored, ibs:r.ibs, authorizerWord:r.authorizerWord,
      contactPrinted: r.body ? new RegExp(String(c.contact).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(r.body) : null, len:r.len};
    log('  %s on %s: authorizer word=%s ibs=%s contact "%s" printed=%s',
      c.num, want, R.auth[want].authorizerWord, R.auth[want].ibs, c.contact, R.auth[want].contactPrinted);
  }
} else log('  none found on the first 90 work orders');
save();

// ============ C. CREDIT INVOICES (C53536, C53537, C53538, C53543) ============
R.credit={};
// does any credit document exist at all?
const invList=rowsOf((await api('GET','/api/invoices/list?limit=300')).json);
R.credit.numbers = invList.map(i=>i.invoice_number).filter(n=>/^C|CR|credit/i.test(String(n))).slice(0,10);
R.credit.statuses = [...new Set(invList.map(i=>i.status))];
log('invoice statuses seen:', R.credit.statuses, '| credit-looking numbers:', R.credit.numbers);
// walk a customer's Invoices tab and read what Issue Credit offers
await page.goto(`${APP}/customers/6a7b6afc-084d-4584-aacb-773bcd71cbcd/invoices`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
R.credit.tabText=await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,900));
R.credit.rowCount=await page.evaluate(()=>document.querySelectorAll('tbody tr').length);
log('customer invoices rows:', R.credit.rowCount);
await page.screenshot({path:`${DIR}/evidence/P18-customer-invoices.png`});
save();

// ============ D. BATCH / IMPORTED invoices (C53568) ============
R.batch={};
for(const p of ['/api/invoices/batch','/api/batch-invoicing','/api/invoices/imported','/api/imports/invoices']){
  const r=await api('GET',p); R.batch[p]=r.status; }
for(const u of ['/invoices/batch','/batch-invoicing','/invoicing/batch']){
  await page.goto(APP+u,{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(6000);
  R.batch[u]={rows:await page.evaluate(()=>document.querySelectorAll('tbody tr').length),
    text:await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,180))};
  log('batch route',u,JSON.stringify(R.batch[u]).slice(0,160)); }
save();
log('ended at', await stored());
log('done'); await s.browser.close(); process.exit(0);
