// PRODUCTION -- C53541: a reversed invoice keeps the design it captured; an invoice recreated for the
// same work order captures the setting in force AT RECREATION. Driven through the screen's own
// Reverse and Create Invoice actions. Guarded setting read before and after every observation.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53541', phases:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR36.json`, JSON.stringify(R,null,1));
const WO={n:'S1-852', id:'f58e3fda-af5d-45fc-afc6-b0c79bd77046'};
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
// design read from the STRIPPED text -- style blocks lied to an earlier probe
const marks=(h)=>{let x=h.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'');
  const t=x.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
  const legacy=/Remit payment to/i.test(t), modern=/Work Performed|Work Summary|Addresses/i.test(t)&&!legacy;
  return {design: legacy?'legacy':(modern?'modern':'indeterminate'), legacy, modern,
    docNo:[...new Set(t.match(/\b(?:INV|EST)-[A-Z0-9-]+/g)||[])].sort(),
    money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(), len:t.length};};
const openFinance=async()=>{ await page.goto(`${APP}/workorders/${WO.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(13000);
  return await page.evaluate(n=>({onRecord:(document.body.innerText||'').includes(n),
    status:((document.querySelector('[data-test-id="badge_wo_status"]')||{}).textContent||'').trim(),
    hasCreate:[...document.querySelectorAll('button')].some(b=>/^Create Invoice$/i.test((b.innerText||'').trim())),
    createDisabled:(()=>{const b=[...document.querySelectorAll('button')].find(b=>/^Create Invoice$/i.test((b.innerText||'').trim())); return b?b.disabled:null;})()
  }), WO.n); };
const invoiceIdOf=async()=>{const d=await call(`/api/work-orders/view/${WO.id}`); let x=(d.j&&(d.j.data||d.j))||{};
  if(x.work_order) x=x.work_order; return {id:x.invoice_id||null, status:x.status||null};};
const render=async(invId,tag)=>{ const b4=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${invId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
  const af=await stored();
  if(b4!==af){ R.drift.push({tag,b4,af}); L('  !! drift on %s -- discarded', tag); return {discarded:true}; }
  if(r.s!==200) return {status:r.s};
  fs.writeFileSync(`${EV}/PR36-${tag}.html`, r.body);
  const m=marks(r.body); m.settingWhileRead=b4; return m; };
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
L('build %s', R.build);

// PHASE 0 -- what does S1-852's existing invoice render as, and what is the setting?
R.phases.p0={setting:await stored()};
const inv0=await invoiceIdOf(); R.phases.p0.invoice=inv0;
L('phase0 setting=%s invoice=%s status=%s', R.phases.p0.setting, inv0.id, inv0.status);
if(!inv0.id){ L('no invoice on the subject -- stop'); save(); await browser.close(); process.exit(0); }
R.phases.p0.doc=await render(inv0.id,'p0-existing');
L('phase0 existing invoice renders: %s', R.phases.p0.doc.design);
save();

// PHASE 1 -- make the precondition true: an invoice CAPTURED under Modern.
// If the existing one is not Modern, reverse it, set Modern, recreate.
const needCycle = R.phases.p0.doc.design!=='modern';
L('needs a Modern-capture cycle first: %s', needCycle);
const reverse=async(tag)=>{
  const st=await openFinance(); L('  [%s] finance onRecord=%s status=%s', tag, st.onRecord, st.status);
  if(!st.onRecord) return {failed:'not on the record'};
  const opened=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_wo_invoice_menu"]');
    if(!b) return false; b.click(); return true;});
  await page.waitForTimeout(2500);
  const items=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')].filter(ok)
      .map(e=>(e.textContent||'').replace(/\s+/g,' ').trim());});
  L('  [%s] menu opened=%s items=%s', tag, opened, JSON.stringify(items));
  const hit=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const it=[...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')].filter(ok)
      .find(e=>/^Reverse$/i.test((e.textContent||'').trim()));
    if(!it) return false; it.click(); return true;});
  await page.waitForTimeout(4000);
  const dlg=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
    return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,260),
      buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
  L('  [%s] Reverse clicked=%s dialog=%s', tag, hit, JSON.stringify(dlg));
  await page.screenshot({path:`${EV}/PR36-${tag}-reverse-dialog.png`, fullPage:true});
  if(dlg&&dlg.buttons.length){
    const go=dlg.buttons.find(b=>/reverse|confirm|yes|ok/i.test(b)&&!/cancel/i.test(b));
    if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
      const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').replace(/\s+/g,' ').trim()===lab);
      if(b) b.click();}, go); L('  [%s] confirmed with "%s"', tag, go); await page.waitForTimeout(12000); } }
  await page.screenshot({path:`${EV}/PR36-${tag}-after-reverse.png`, fullPage:true});
  return {menu:items, dialog:dlg, after:await invoiceIdOf()}; };
const createInvoice=async(tag)=>{
  const st=await openFinance(); L('  [%s] finance onRecord=%s status=%s create=%s disabled=%s', tag, st.onRecord, st.status, st.hasCreate, st.createDisabled);
  if(!st.hasCreate || st.createDisabled) return {failed:'Create Invoice not available', screen:st};
  await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const b=[...document.querySelectorAll('button')].filter(ok).find(e=>/^Create Invoice$/i.test((e.innerText||'').trim())); b&&b.click();});
  await page.waitForTimeout(6000);
  const dlg=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
    return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,260),
      buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
  L('  [%s] create dialog %s', tag, JSON.stringify(dlg));
  if(dlg&&dlg.buttons.length){
    const go=dlg.buttons.find(b=>/charge account|create|confirm|yes|invoice/i.test(b)&&!/cancel/i.test(b));
    if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
      const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').replace(/\s+/g,' ').trim()===lab);
      if(b) b.click();}, go); L('  [%s] confirmed with "%s"', tag, go); await page.waitForTimeout(14000); } }
  await page.screenshot({path:`${EV}/PR36-${tag}-after-create.png`, fullPage:true});
  return {dialog:dlg, after:await invoiceIdOf()}; };

if(needCycle){
  R.phases.p1={setTo:await setDesign('modern')};
  L('phase1: setting -> %s', R.phases.p1.setTo);
  R.phases.p1.reverse=await reverse('p1');
  L('phase1 after reverse: %s', JSON.stringify(R.phases.p1.reverse.after||R.phases.p1.reverse));
  save();
  R.phases.p1.create=await createInvoice('p1');
  L('phase1 after create: %s', JSON.stringify(R.phases.p1.create.after||R.phases.p1.create));
  save();
  if(R.phases.p1.create.after&&R.phases.p1.create.after.id){
    R.phases.p1.doc=await render(R.phases.p1.create.after.id,'p1-modern-capture');
    L('phase1 new invoice renders: %s (setting was %s)', R.phases.p1.doc.design, R.phases.p1.doc.settingWhileRead); }
  save();
}
// PHASE 2 -- the real test: reverse the Modern invoice, switch to Legacy, recreate.
const base=(R.phases.p1&&R.phases.p1.doc)||R.phases.p0.doc;
const baseInv=(R.phases.p1&&R.phases.p1.create&&R.phases.p1.create.after&&R.phases.p1.create.after.id)||inv0.id;
R.phases.p2={modernInvoiceId:baseInv, modernInvoiceDesign:base.design};
L('=== phase2: the Modern-captured invoice is %s rendering %s', baseInv, base.design);
R.phases.p2.reverse=await reverse('p2');
save();
R.phases.p2.setTo=await setDesign('legacy'); L('phase2 setting -> %s', R.phases.p2.setTo);
R.phases.p2.create=await createInvoice('p2');
L('phase2 after create: %s', JSON.stringify(R.phases.p2.create.after||R.phases.p2.create));
save();
if(R.phases.p2.create.after&&R.phases.p2.create.after.id){
  R.phases.p2.newDoc=await render(R.phases.p2.create.after.id,'p2-recreated-legacy');
  L('phase2 RECREATED invoice renders: %s (setting was %s)', R.phases.p2.newDoc.design, R.phases.p2.newDoc.settingWhileRead);
  // and re-read the reversed one, if it is still reachable
  if(baseInv && baseInv!==R.phases.p2.create.after.id){
    R.phases.p2.reversedDoc=await render(baseInv,'p2-reversed-still');
    L('phase2 reversed invoice still renders: %s', (R.phases.p2.reversedDoc||{}).design); }
}
R.verdict={modernCapturedDesign:R.phases.p2.modernInvoiceDesign,
  recreatedUnderLegacyDesign:(R.phases.p2.newDoc||{}).design,
  reversedStillRenders:(R.phases.p2.reversedDoc||{}).design||null,
  recreatedFollowsCurrentSetting:(R.phases.p2.newDoc||{}).design==='legacy',
  newInvoiceIdDiffers:(R.phases.p2.create.after||{}).id!==R.phases.p2.modernInvoiceId,
  drift:R.drift.length};
L('VERDICT %s', JSON.stringify(R.verdict));
save(); await browser.close();
