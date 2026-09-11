// Seed what the last cases need: invoice a work order that carries an approving contact,
// raise a credit, and switch workplace. Rule 107 - this is a QA branch, seed freely.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P20.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,''),b:(r.postData()||'').slice(0,200)});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,400)};},{api:API,m,p,b:b||null});
const raw=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include'});
  const t=await r.text(); return {status:r.status,len:t.length,body:t};},{api:API,p});
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

// ===== 1. invoice S-17580 (approving contact: Savannah Tran) while on LEGACY =====
const WO='e98e678b-731e-4140-a24c-e2e7a6db8dad', CONTACT='Savannah Tran';
R.seedTarget={wo:WO, num:'S-17580', contact:CONTACT};
log('setting to Legacy before invoicing...');
R.designAtInvoice=await setDesign('Legacy'); log('  stored:',R.designAtInvoice);
seen();
await page.goto(`${APP}/workorders/${WO}/finance`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(13000);
R.beforeInvoice={controls:await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis)
    .map(e=>((e.getAttribute('aria-label')||'')+'|'+(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,45)).filter(x=>x!=='|').slice(0,30);},VIS),
  text:await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,400))};
log('finance controls before invoicing:', JSON.stringify(R.beforeInvoice.controls));
await page.screenshot({path:`${DIR}/evidence/P20-before-invoice.png`});
seen();
const ci=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/create invoice/i.test(t(e)));
  if(b){b.click(); return t(b);} return null;},VIS);
await page.waitForTimeout(5000);
const conf=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return null;
  const bs=[...d.querySelectorAll('button')].filter(isVis);
  const b=bs.find(e=>/^(Create Invoice|Create|Confirm|Yes|Invoice)$/i.test(t(e)));
  if(b){b.click(); return t(b);} return bs.map(t);},VIS);
await page.waitForTimeout(13000);
R.invoiced={clicked:ci, confirm:conf, calls:seen().filter(c=>c.m!=='GET').map(c=>c.m+' '+c.u).slice(0,8),
  toasts:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS)};
log('Create Invoice: clicked=%s confirm=%s', ci, JSON.stringify(conf));
log('  writes:', JSON.stringify(R.invoiced.calls), '| toasts:', JSON.stringify(R.invoiced.toasts));
await page.screenshot({path:`${DIR}/evidence/P20-after-invoice.png`});
// read the work order back
const wv=(await api('GET',`/api/work-orders/view/${WO}`)).json;
let wx=(wv&&(wv.data||wv))||{}; if(wx.work_order)wx=wx.work_order;
R.afterInvoice={invoiceId:wx.invoice_id, status:wx.status, contact:wx.authorizer_full_name,
  code:wx.ibs_approval_code, contactId:wx.authorizer_contact_id};
log('work order after invoicing:', JSON.stringify(R.afterInvoice));
save();

// ===== 2. read the Authorizer under BOTH designs =====
if (R.afterInvoice.invoiceId){
  R.authorizerRead={};
  for(const want of ['Legacy','Modern']){
    const now=await setDesign(want); if(now!==want.toLowerCase()){log('could not set',want);continue;}
    const a=await stored();
    const r=await raw(`/api/invoices/preview?invoice_id=${R.afterInvoice.invoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
    const b=await stored(); if(a!==b){log('discarded',want,a,'->',b);continue;}
    const t=r.body.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<[^>]+>/g,'\n');
    const lines=t.split('\n').map(x=>x.trim()).filter(Boolean);
    const idx=lines.findIndex(x=>/authoriz/i.test(x));
    R.authorizerRead[want]={stored:a, len:r.len,
      authorizerWord:/authoriz/i.test(t), ibs:/IBS#/.test(t),
      contactPrinted:new RegExp(CONTACT,'i').test(t),
      around: idx>=0?lines.slice(Math.max(0,idx-2),idx+5):null};
    fs.writeFileSync(`${DIR}/evidence/P20-authorizer-${want}.html`, r.body);
    log('  under %s: authorizer=%s ibs=%s "%s" printed=%s | around: %s', want,
      R.authorizerRead[want].authorizerWord, R.authorizerRead[want].ibs,
      CONTACT, R.authorizerRead[want].contactPrinted, JSON.stringify(R.authorizerRead[want].around));
  }
  // is the approving contact locked now the work order is invoiced?
  await page.goto(`${APP}/workorders/${WO}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(12000);
  R.contactLocked=await page.evaluate(({vis,c})=>{const isVis=eval(vis);
    const f=[...document.querySelectorAll('.q-field,.q-select,input')].filter(isVis)
      .filter(x=>new RegExp(c,'i').test(x.innerText||x.value||''));
    return f.map(x=>({tag:x.tagName, disabled:x.disabled||x.getAttribute('aria-disabled')==='true'||/disabled/.test(x.className),
      readOnly:x.readOnly||false, text:(x.innerText||x.value||'').replace(/\s+/g,' ').slice(0,80)})).slice(0,5);},{vis:VIS,c:CONTACT});
  log('approving contact on the work order after invoicing:', JSON.stringify(R.contactLocked));
  await page.screenshot({path:`${DIR}/evidence/P20-contact-locked.png`});
}
save();
log('ended at', await stored()); log('done'); await s.browser.close(); process.exit(0);
