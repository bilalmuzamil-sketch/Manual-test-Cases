// PRODUCTION -- C53570 end to end. Set an Authorizer on a work order, invoice it under Legacy,
// check the value prints in the Legacy document's Authorizer column, check the Authorizer is
// still on the work order and now locked, then reverse/recreate under Modern and check whether
// the Modern document prints an Authorizer at all.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53570', steps:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR42.json`, JSON.stringify(R,null,1));
const WO={n:'S2-861', id:'47abc3c7-93a1-401c-9344-547e1066a4a2'};
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {s:r.status, body:await r.text()};},{a:APIH,p});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const woView=async()=>{const d=await call(`/api/work-orders/view/${WO.id}`); let x=(d.j&&(d.j.data||d.j))||{};
  if(x.work_order) x=x.work_order;
  return {status:x.status, invoiceId:x.invoice_id||null, editable:x.editable,
    authorizer:x.authorizer_full_name, authorizerId:x.authorizer_contact_id, ibs:x.ibs_approval_code};};
const marks=(h)=>{let z=h.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'');
  const t=z.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
  const legacy=/Remit payment to/i.test(t);
  return {design:legacy?'legacy':(/Work Performed|Work Summary|Addresses/i.test(t)?'modern':'indeterminate'),
    hasAuthorizerLabel:/Authorizer/i.test(t), text:t}; };
const openTab=async(tab)=>{ await page.goto(`${APP}/workorders/${WO.id}/${tab}`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(12000);
  return page.evaluate(n=>({onRecord:(document.body.innerText||'').includes(n)}), WO.n); };
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.steps.before=await woView(); L('build %s | %s before: %s', R.build, WO.n, JSON.stringify(R.steps.before));

// --- 1. set the Authorizer through the screen
let id=await openTab('finance'); L('finance onRecord=%s', id.onRecord);
if(!id.onRecord){ L('not on the record -- stop'); save(); await browser.close(); process.exit(0); }
await page.evaluate(()=>{const s=document.querySelector('[data-test-id="select_authorizer"]'); s&&s.click();});
await page.waitForTimeout(3000);
await page.screenshot({path:`${EV}/PR42-authorizer-open.png`, fullPage:true});
R.steps.authorizerOptions=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(ok)
    .map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,15);});
L('authorizer options: %s', JSON.stringify(R.steps.authorizerOptions));
R.steps.picked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const it=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(ok)
    .filter(e=>!/^None$/i.test((e.textContent||'').trim()))[0];
  if(!it) return null; it.click(); return (it.textContent||'').replace(/\s+/g,' ').trim().slice(0,50);});
L('picked authorizer: %s', R.steps.picked);
await page.waitForTimeout(8000);
await page.screenshot({path:`${EV}/PR42-authorizer-set.png`, fullPage:true});
R.steps.afterPick=await woView(); L('after pick: %s', JSON.stringify(R.steps.afterPick));
save();
if(!R.steps.afterPick.authorizer){ L('the Authorizer did not stick -- reporting that, not inventing a pass'); save(); await browser.close(); process.exit(0); }

// --- 2. make the job Complete so Create Invoice is enabled (known prerequisite), then invoice under Legacy
R.steps.designSet=await setDesign('legacy'); L('design -> %s', R.steps.designSet);
const setStatusComplete=async()=>{
  await openTab('lines');
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]'); b&&b.click();});
  await page.waitForTimeout(2500);
  const items=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')].filter(ok).map(e=>(e.textContent||'').trim());});
  L('  wo menu: %s', JSON.stringify(items));
  const hit=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const it=[...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')].filter(ok).find(e=>/set status/i.test(e.textContent||''));
    if(!it) return false; it.click(); return true;});
  await page.waitForTimeout(3000);
  const opts=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return [...document.querySelectorAll('.q-menu .q-item,[role=option],.q-dialog .q-item')].filter(ok).map(e=>(e.textContent||'').trim()).slice(0,20);});
  L('  status options: %s (set-status hit=%s)', JSON.stringify(opts), hit);
  const done=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const it=[...document.querySelectorAll('.q-menu .q-item,[role=option],.q-dialog .q-item')].filter(ok)
      .find(e=>/^\s*Complete\s*$/i.test((e.textContent||'').trim()));
    if(!it) return null; it.click(); return (it.textContent||'').trim();});
  L('  picked status: %s', done);
  await page.waitForTimeout(9000);
  await page.screenshot({path:`${EV}/PR42-status.png`, fullPage:true});
  return {menu:items, options:opts, picked:done}; };
if(!/complete/i.test(R.steps.afterPick.status||'')) R.steps.status=await setStatusComplete();
R.steps.afterStatus=await woView(); L('after status: %s', JSON.stringify(R.steps.afterStatus));
save();
const createInvoice=async(tag)=>{
  await openTab('finance');
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
  await page.screenshot({path:`${EV}/PR42-${tag}-created.png`, fullPage:true});
  return {dialog:dlg, after:await woView()}; };
R.steps.createLegacy=await createInvoice('legacy');
L('after create: %s', JSON.stringify(R.steps.createLegacy.after||R.steps.createLegacy));
save();
const render=async(invId,tag)=>{const b4=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${invId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  const af=await stored();
  if(b4!==af){ R.drift.push({tag,b4,af}); return {discarded:true}; }
  if(r.s!==200) return {status:r.s};
  fs.writeFileSync(`${EV}/PR42-${tag}.html`, r.body);
  const m=marks(r.body); const t=m.text; delete m.text;
  const i=t.indexOf('Authorizer');
  m.context = i>=0 ? t.slice(Math.max(0,i-130), i+230) : null;
  m.authorizerValuePrinted = !!(R.steps.afterPick.authorizer && t.includes(R.steps.afterPick.authorizer));
  m.settingWhileRead=b4; return m; };
const inv1=(R.steps.createLegacy.after||{}).invoiceId;
if(inv1){ R.steps.legacyDoc=await render(inv1,'legacy-doc');
  L('LEGACY doc: design=%s AuthorizerLabel=%s valuePrinted=%s', R.steps.legacyDoc.design,
    R.steps.legacyDoc.hasAuthorizerLabel, R.steps.legacyDoc.authorizerValuePrinted);
  L('  context: %s', JSON.stringify(R.steps.legacyDoc.context)); }
save();
// --- 3. is the Authorizer still on the work order, and locked?
await openTab('finance');
R.steps.lockCheck=await page.evaluate(()=>{const s=document.querySelector('[data-test-id="select_authorizer"]');
  if(!s) return {present:false};
  const cls=s.className||''; const inp=s.querySelector('input');
  return {present:true, shown:(s.textContent||'').replace(/\s+/g,' ').trim().slice(0,60),
    disabledClass:/disabled/i.test(cls), readonlyAttr:s.getAttribute('readonly')!==null,
    ariaDisabled:s.getAttribute('aria-disabled'), inputDisabled:inp?inp.disabled:null, inputReadonly:inp?inp.readOnly:null};});
await page.screenshot({path:`${EV}/PR42-lock.png`, fullPage:true});
R.steps.woAfterInvoice=await woView();
L('lock check: %s', JSON.stringify(R.steps.lockCheck));
L('work order after invoicing: %s', JSON.stringify(R.steps.woAfterInvoice));
save();
// --- 4. Modern document for the same authorizer-carrying work order
const reverse=async()=>{ await openTab('finance');
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_wo_invoice_menu"]'); b&&b.click();});
  await page.waitForTimeout(2500);
  const hit=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const it=[...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')].filter(ok).find(e=>/^Reverse$/i.test((e.textContent||'').trim()));
    if(!it) return false; it.click(); return true;});
  await page.waitForTimeout(4000);
  const go=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>/^Reverse$/i.test((x.innerText||'').trim()));
    if(b){b.click(); return true;} return false;});
  L('  reverse clicked=%s confirmed=%s', hit, go);
  await page.waitForTimeout(12000); return await woView(); };
R.steps.reversed=await reverse(); L('after reverse: %s', JSON.stringify(R.steps.reversed));
R.steps.designModern=await setDesign('modern'); L('design -> %s', R.steps.designModern);
R.steps.createModern=await createInvoice('modern');
L('after modern create: %s', JSON.stringify(R.steps.createModern.after||R.steps.createModern));
save();
const inv2=(R.steps.createModern.after||{}).invoiceId;
if(inv2){ R.steps.modernDoc=await render(inv2,'modern-doc');
  L('MODERN doc: design=%s AuthorizerLabel=%s valuePrinted=%s', R.steps.modernDoc.design,
    R.steps.modernDoc.hasAuthorizerLabel, R.steps.modernDoc.authorizerValuePrinted); }
R.verdict={authorizerSet:R.steps.afterPick.authorizer,
  legacyDesign:(R.steps.legacyDoc||{}).design, legacyPrintsAuthorizerLabel:(R.steps.legacyDoc||{}).hasAuthorizerLabel,
  legacyPrintsAuthorizerValue:(R.steps.legacyDoc||{}).authorizerValuePrinted,
  stillOnWorkOrder:(R.steps.woAfterInvoice||{}).authorizer, lockSignals:R.steps.lockCheck,
  modernDesign:(R.steps.modernDoc||{}).design, modernPrintsAuthorizerLabel:(R.steps.modernDoc||{}).hasAuthorizerLabel,
  drift:R.drift.length};
L('VERDICT %s', JSON.stringify(R.verdict));
save(); await browser.close();
