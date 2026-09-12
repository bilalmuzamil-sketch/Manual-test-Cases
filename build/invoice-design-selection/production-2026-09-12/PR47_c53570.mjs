// PRODUCTION -- C53570, full run. Customer "aqeel transport 56" (01de15df) has FOUR contacts, so
// its work orders can carry an Authorizer. (The earlier "only No authorizer" reading was a work
// order belonging to the OTHER customer, which has none -- the record not qualifying, again.)
// Set the Authorizer, invoice under Legacy, check the printed column, check the work order keeps
// it and locks it, then reverse/recreate under Modern and check the Modern document.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53570', steps:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR47.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {s:r.status, body:await r.text()};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
let WO=null;
const woView=async()=>{const d=await call(`/api/work-orders/view/${WO.id}`); let x=(d.j&&(d.j.data||d.j))||{};
  if(x.work_order) x=x.work_order;
  return {status:x.status, invoiceId:x.invoice_id||null, editable:x.editable,
    authorizer:x.authorizer_full_name, authorizerId:x.authorizer_contact_id};};
const openTab=async(tab)=>{ await page.goto(`${APP}/workorders/${WO.id}/${tab}`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(12000);
  return page.evaluate(n=>({onRecord:(document.body.innerText||'').includes(n)}), WO.n); };
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// pick an un-invoiced work order for THIS customer
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
for(const w of wos.filter(w=>/estimate|approved|in_progress|complete|ready/i.test(String(w.status||'')))){
  const d=await call(`/api/work-orders/view/${w.id}`); let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  if((x.company_id||x.customer_id)===CUST){ WO={n:w.number,id:w.id}; R.subject={...WO, status:x.status}; break; }
}
L('build %s subject %s', R.build, JSON.stringify(R.subject));
if(!WO){ L('no un-invoiced work order for that customer'); save(); await browser.close(); process.exit(0); }
// 1. set the Authorizer
let id=await openTab('finance'); L('finance onRecord=%s', id.onRecord);
if(!id.onRecord){ L('not on the record -- stop'); save(); await browser.close(); process.exit(0); }
await page.evaluate(()=>{const s=document.querySelector('[data-test-id="select_authorizer"]'); s&&s.click();});
await page.waitForTimeout(3500);
R.steps.options=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(ok).map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).slice(0,12);});
L('authorizer options: %s', JSON.stringify(R.steps.options));
await page.screenshot({path:`${EV}/PR47-authorizer-open.png`, fullPage:true});
R.steps.picked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const it=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(ok)
    .filter(e=>!/no authorizer|^none$/i.test((e.textContent||'').replace(/check/,'').trim()))[0];
  if(!it) return null; it.click(); return (it.textContent||'').replace(/\s+/g,' ').replace(/^check/,'').trim().slice(0,50);});
L('picked: %s', R.steps.picked);
await page.waitForTimeout(9000);
await page.screenshot({path:`${EV}/PR47-authorizer-set.png`, fullPage:true});
R.steps.afterPick=await woView(); L('after pick: %s', JSON.stringify(R.steps.afterPick));
save();
if(!R.steps.afterPick.authorizer){ L('Authorizer did not stick -- reporting that, not a pass'); save(); await browser.close(); process.exit(0); }
// 2. Legacy + Complete + invoice
R.steps.design1=await setDesign('legacy'); L('design -> %s', R.steps.design1);
if(!/complete/i.test(R.steps.afterPick.status||'')){
  await openTab('lines');
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]'); b&&b.click();});
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const it=[...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')].filter(ok).find(e=>/set status/i.test(e.textContent||'')); it&&it.click();});
  await page.waitForTimeout(3000);
  R.steps.statusOptions=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return [...document.querySelectorAll('.q-menu .q-item,[role=option],.q-dialog .q-item')].filter(ok).map(e=>(e.textContent||'').trim()).slice(0,20);});
  R.steps.statusPicked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const it=[...document.querySelectorAll('.q-menu .q-item,[role=option],.q-dialog .q-item')].filter(ok)
      .find(e=>/^\s*(check\s*)?Complete\s*$/i.test((e.textContent||'').trim())); if(!it) return null; it.click(); return (it.textContent||'').trim();});
  L('status options %s -> picked %s', JSON.stringify(R.steps.statusOptions), R.steps.statusPicked);
  await page.waitForTimeout(10000);
}
R.steps.beforeInvoice=await woView(); L('before invoice: %s', JSON.stringify(R.steps.beforeInvoice));
save();
const createInvoice=async(tag)=>{ await openTab('finance');
  const st=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/^Create Invoice$/i.test((e.innerText||'').trim()));
    return {present:!!b, disabled:b?b.disabled:null};});
  L('  [%s] Create Invoice present=%s disabled=%s', tag, st.present, st.disabled);
  if(!st.present||st.disabled) return {failed:'Create Invoice unavailable', screen:st};
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/^Create Invoice$/i.test((e.innerText||'').trim())); b&&b.click();});
  await page.waitForTimeout(6000);
  const dlg=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
    return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,200),
      buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').trim()).filter(Boolean)};});
  L('  [%s] dialog %s', tag, JSON.stringify(dlg));
  if(dlg&&dlg.buttons.length){ const go=dlg.buttons.find(b=>/charge account|create|confirm|yes|invoice/i.test(b)&&!/cancel|close/i.test(b));
    if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
      const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').trim()===lab); if(b) b.click();}, go);
      L('  [%s] confirmed "%s"', tag, go); await page.waitForTimeout(14000); } }
  await page.screenshot({path:`${EV}/PR47-${tag}-created.png`, fullPage:true});
  return {dialog:dlg, after:await woView()}; };
R.steps.createLegacy=await createInvoice('legacy');
L('after legacy create: %s', JSON.stringify(R.steps.createLegacy.after||R.steps.createLegacy));
save();
const render=async(invId,tag)=>{const b4=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${invId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  const af=await stored();
  if(b4!==af){ R.drift.push({tag,b4,af}); return {discarded:true}; }
  if(r.s!==200) return {status:r.s};
  fs.writeFileSync(`${EV}/PR47-${tag}.html`, r.body);
  let z=r.body.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'');
  const t=z.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
  const legacy=/Remit payment to/i.test(t); const i=t.indexOf('Authorizer');
  const who=(R.steps.afterPick.authorizer||'').trim();
  return {design: legacy?'legacy':(/Work Performed|Work Summary|Addresses/i.test(t)?'modern':'indeterminate'),
    authorizerLabel:i>=0, authorizerValue: who? t.includes(who):null, who,
    context: i>=0? t.slice(Math.max(0,i-140), i+240):null, settingWhileRead:b4}; };
const inv1=(R.steps.createLegacy.after||{}).invoiceId;
if(inv1){ R.steps.legacyDoc=await render(inv1,'legacy-doc');
  L('LEGACY doc: %s', JSON.stringify(R.steps.legacyDoc)); }
save();
// 3. still on the work order, and locked?
await openTab('finance');
R.steps.lock=await page.evaluate(()=>{const s=document.querySelector('[data-test-id="select_authorizer"]');
  if(!s) return {present:false};
  const inp=s.querySelector('input');
  return {present:true, shown:(s.textContent||'').replace(/\s+/g,' ').trim().slice(0,60),
    disabledClass:/disabled/i.test(s.className||''), ariaDisabled:s.getAttribute('aria-disabled'),
    inputDisabled:inp?inp.disabled:null, inputReadonly:inp?inp.readOnly:null};});
await page.screenshot({path:`${EV}/PR47-lock.png`, fullPage:true});
R.steps.woAfter=await woView();
L('lock: %s', JSON.stringify(R.steps.lock)); L('wo after: %s', JSON.stringify(R.steps.woAfter));
save();
// 4. Modern document for the same authorizer-carrying work order
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_wo_invoice_menu"]'); b&&b.click();});
await page.waitForTimeout(2500);
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const it=[...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')].filter(ok).find(e=>/^Reverse$/i.test((e.textContent||'').trim())); it&&it.click();});
await page.waitForTimeout(4000);
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return;
  const b=[...d.querySelectorAll('button')].filter(ok).find(x=>/^Reverse$/i.test((x.innerText||'').trim())); b&&b.click();});
await page.waitForTimeout(12000);
R.steps.reversed=await woView(); L('after reverse: %s', JSON.stringify(R.steps.reversed));
R.steps.design2=await setDesign('modern'); L('design -> %s', R.steps.design2);
R.steps.createModern=await createInvoice('modern');
L('after modern create: %s', JSON.stringify(R.steps.createModern.after||R.steps.createModern));
const inv2=(R.steps.createModern.after||{}).invoiceId;
if(inv2){ R.steps.modernDoc=await render(inv2,'modern-doc'); L('MODERN doc: %s', JSON.stringify(R.steps.modernDoc)); }
R.verdict={authorizer:R.steps.afterPick.authorizer,
  legacy:{design:(R.steps.legacyDoc||{}).design, label:(R.steps.legacyDoc||{}).authorizerLabel, value:(R.steps.legacyDoc||{}).authorizerValue},
  modern:{design:(R.steps.modernDoc||{}).design, label:(R.steps.modernDoc||{}).authorizerLabel, value:(R.steps.modernDoc||{}).authorizerValue},
  stillOnWorkOrder:(R.steps.woAfter||{}).authorizer, lock:R.steps.lock, drift:R.drift.length};
L('VERDICT %s', JSON.stringify(R.verdict));
save(); await browser.close();
