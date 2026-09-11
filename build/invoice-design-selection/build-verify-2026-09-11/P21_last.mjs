// The last ten: credit invoices, reverse-and-recreate, the no-access user, the second location,
// the starting value, and batch/imported invoices.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P21.json`, JSON.stringify(R,null,1));
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
const guardRender=async(invId,isEst=0)=>{const a=await stored();
  const r=await raw(`/api/invoices/preview?invoice_id=${invId}&type=html&isEstimate=${isEst}&includeDeclined=0&historyEvent=`);
  const b=await stored(); if(a!==b) return {discarded:true};
  const t=r.body.replace(/<[^>]+>/g,'\n');
  return {stored:a,len:r.len,ibs:/IBS#/.test(t),docNo:(t.match(/\b(?:INV|EST|CR)-[A-Z0-9-]+/)||[])[0]||null,
          money:(t.match(/\$[\d,]+\.\d{2}/g)||[]).sort()};};

// ===== A. CREDIT INVOICE: raise one and see what document it makes =====
R.credit={};
const NEWINV='c3334c2a-5388-4160-9885-698def43bb7c'; // the invoice created in the previous pass
const NEWWO='e98e678b-731e-4140-a24c-e2e7a6db8dad';
const custId='9c1d996a-e8aa-4d95-9253-83499ba8d759';
await setDesign('Modern');
seen();
await page.goto(`${APP}/customers/${custId}/invoices`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(11000);
R.credit.listBefore=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,90)));
log('customer invoice rows before:', JSON.stringify(R.credit.listBefore).slice(0,400));
const icOpen=await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/issue credit/i.test(e.innerText||''));
  if(b){b.click();return true;}return false;},VIS);
await page.waitForTimeout(5000);
R.credit.dialogFields=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,600),
    inputs:[...d.querySelectorAll('input')].map(i=>({ph:i.getAttribute('placeholder'),label:(i.closest('.q-field')||{}).innerText?.replace(/\s+/g,' ').trim().slice(0,40),val:i.value})),
    buttons:[...d.querySelectorAll('button')].map(b=>(b.innerText||'').trim()).filter(Boolean)};},VIS);
log('Issue Credit dialog:', JSON.stringify(R.credit.dialogFields).slice(0,700));
await page.screenshot({path:`${DIR}/evidence/P21-issue-credit.png`});
await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
save();

// ===== B. REVERSE the invoice, then recreate it on the other design (C53541) =====
R.reverse={};
seen();
await page.goto(`${APP}/workorders/${NEWWO}/finance`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
R.reverse.controls=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('button,.q-btn,.q-item')].filter(isVis)
    .map(e=>((e.getAttribute('aria-label')||'')+'|'+(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,45)).filter(x=>x!=='|').slice(0,35);},VIS);
log('finance controls on the invoiced job:', JSON.stringify(R.reverse.controls));
// the reverse action usually sits behind the kebab
await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).filter(e=>/more_vert/.test(e.innerText||'')); if(b.length)b[b.length-1].click();},VIS);
await page.waitForTimeout(3000);
R.reverse.menu=await page.evaluate(vis=>{const isVis=eval(vis);
  const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
  return m?[...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()):null;},VIS);
log('kebab menu on the invoiced job:', JSON.stringify(R.reverse.menu));
await page.screenshot({path:`${DIR}/evidence/P21-invoice-kebab.png`});
const rev=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e=[...document.querySelectorAll('.q-menu .q-item')].filter(isVis).find(x=>/revers|un-?invoice|delete invoice/i.test(t(x)));
  if(e){e.click();return t(e);}return null;},VIS);
await page.waitForTimeout(4000);
if(rev){
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
    const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^(Reverse|Confirm|Yes|Delete)/i.test(t(e))); if(b)b.click();},VIS);
  await page.waitForTimeout(12000);
}
const wv=(await api('GET',`/api/work-orders/view/${NEWWO}`)).json;
let wx=(wv&&(wv.data||wv))||{}; if(wx.work_order)wx=wx.work_order;
R.reverse.clicked=rev; R.reverse.afterStatus=wx.status; R.reverse.afterInvoiceId=wx.invoice_id;
log('after reversing: clicked=%s status=%s invoiceId=%s', rev, wx.status, wx.invoice_id);
save();
// recreate on LEGACY if it really reversed
if(rev && !wx.invoice_id){
  await setDesign('Legacy');
  await page.goto(`${APP}/workorders/${NEWWO}/finance`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(12000);
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/create invoice/i.test(t(e))); if(b)b.click();},VIS);
  await page.waitForTimeout(13000);
  const w2=(await api('GET',`/api/work-orders/view/${NEWWO}`)).json;
  let x2=(w2&&(w2.data||w2))||{}; if(x2.work_order)x2=x2.work_order;
  R.reverse.recreatedInvoiceId=x2.invoice_id;
  if(x2.invoice_id){
    R.reverse.onLegacy=await guardRender(x2.invoice_id,0);
    await setDesign('Modern');
    R.reverse.onModern=await guardRender(x2.invoice_id,0);
    log('recreated invoice: legacy len=%s modern len=%s',
      R.reverse.onLegacy&&R.reverse.onLegacy.len, R.reverse.onModern&&R.reverse.onModern.len);
  }
}
save();

// ===== C. a user WITHOUT settings access (C53529) =====
R.noAccess={};
const users=rowsOf((await api('GET','/api/quick-login/users')).json);
R.noAccess.users=users.slice(0,25).map(u=>({id:u.id,name:(u.first_name||'')+' '+(u.last_name||''),
  role:(u.role&&u.role.name)||u.role_name||u.template_slug||null}));
log('quick-login users:', JSON.stringify(R.noAccess.users).slice(0,700));
save();
log('ended at', await stored()); log('done'); await s.browser.close(); process.exit(0);
