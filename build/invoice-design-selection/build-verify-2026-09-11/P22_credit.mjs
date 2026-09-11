// Raise a Credit Invoice from the job's Finance menu and render it under both designs.
// Then a user without settings access.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P22.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,500)};},{api:API,m,p,b:b||null});
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

const WO='e98e678b-731e-4140-a24c-e2e7a6db8dad';
// the invoice must exist; it was recreated on Legacy in the previous pass
let wv=(await api('GET',`/api/work-orders/view/${WO}`)).json; let wx=(wv&&(wv.data||wv))||{}; if(wx.work_order)wx=wx.work_order;
R.wo={status:wx.status, invoiceId:wx.invoice_id, customer:wx.customer_id};
log('work order:', JSON.stringify(R.wo));

// ===== raise the credit from the Finance kebab =====
R.design=await setDesign('Modern'); log('design set to', R.design);
await page.goto(`${APP}/workorders/${WO}/finance`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).filter(e=>/more_vert/.test(e.innerText||''));
  if(b.length)b[b.length-1].click();},VIS);
await page.waitForTimeout(3000);
seen();
const ic=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e=[...document.querySelectorAll('.q-menu .q-item')].filter(isVis).find(x=>/issue credit/i.test(t(x)));
  if(e){e.click();return t(e);}return null;},VIS);
await page.waitForTimeout(6000);
R.creditDialog=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,700),
    fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,45)),
    buttons:[...d.querySelectorAll('button')].map(b=>(b.innerText||'').trim()).filter(Boolean)};},VIS);
log('Issue Credit clicked=%s | dialog: %s', ic, JSON.stringify(R.creditDialog).slice(0,700));
await page.screenshot({path:`${DIR}/evidence/P22-credit-dialog.png`});
// fill: amount, store credit, reason
await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
  const amt=[...d.querySelectorAll('input')].find(i=>/amount/i.test(((i.closest('.q-field')||{}).innerText)||''));
  if(amt){const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    set.call(amt,'10.00'); amt.dispatchEvent(new Event('input',{bubbles:true})); amt.dispatchEvent(new Event('change',{bubbles:true}));}
  const sc=[...d.querySelectorAll('*')].filter(isVis).find(e=>/^Issue Store Credit$/i.test((e.innerText||'').trim()));
  if(sc) sc.click();
  const reason=[...d.querySelectorAll('input,textarea')].find(i=>/reason/i.test(((i.closest('.q-field')||{}).innerText)||''));
  if(reason){const set=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value')||Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');
    set.set.call(reason,'ZZAUTOTEST credit invoice design check'); reason.dispatchEvent(new Event('input',{bubbles:true}));}
},VIS);
await page.waitForTimeout(2500);
await page.screenshot({path:`${DIR}/evidence/P22-credit-filled.png`});
seen();
const submitted=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return 'no dialog';
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^(Issue Store Credit|Issue Credit|Issue Refund|Save|Submit)$/i.test(t(e)));
  if(b){b.click();return t(b);} return [...d.querySelectorAll('button')].map(t);},VIS);
await page.waitForTimeout(12000);
R.creditSubmit={clicked:submitted, writes:seen().filter(c=>c.m!=='GET').map(c=>c.m+' '+c.u),
  toasts:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS)};
log('credit submit:', JSON.stringify(submitted), JSON.stringify(R.creditSubmit.writes), JSON.stringify(R.creditSubmit.toasts));
await page.screenshot({path:`${DIR}/evidence/P22-credit-submitted.png`});
save();

// did a credit DOCUMENT appear?
const inv=rowsOf((await api('GET','/api/invoices/list?limit=300')).json);
R.creditDocs=inv.filter(i=>/credit|^CR|^C-/i.test(String(i.invoice_number)+' '+String(i.status))).slice(0,5);
log('credit-looking documents now:', JSON.stringify(R.creditDocs).slice(0,400));
await page.goto(`${APP}/customers/${R.wo.customer}/invoices`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
R.custRows=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,110)));
log('customer invoices tab rows:', JSON.stringify(R.custRows).slice(0,500));
await page.screenshot({path:`${DIR}/evidence/P22-customer-after-credit.png`});
save();
log('ended at', await stored()); log('done'); await s.browser.close(); process.exit(0);
