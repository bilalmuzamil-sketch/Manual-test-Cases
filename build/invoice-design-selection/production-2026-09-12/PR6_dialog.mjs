// PRODUCTION -- the confirmation-dialog requirements, proven step by step.
// S1-R7: "a confirmation dialog is shown before the change is applied. The switch does not move
//         until the dialog is confirmed."
// S1-R8: "On confirming, the change is saved immediately, on its own ... The page's 'Save Details'
//         button plays no part: this row does not wait for it and is not undone by it."
// Each step records the toggle's own aria-checked AND the stored value, so nothing is inferred.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), steps:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR6.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:b?JSON.stringify(b):undefined});
  return {s:r.status,t:(await r.text()).slice(0,3000)};},{a:APIH,m,p,b:b||null});
const stored=async()=>{for(let i=0;i<3;i++){const r=await api('GET','/api/organizations/invoice-settings/view');
  try{const v=JSON.parse(r.t).data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const openTab=async()=>{ await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(11000);
  await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(ok).find(e=>t(e)==='Invoice'); if(el)el.click();});
  await page.waitForTimeout(7000); };
const toggle=()=>page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  for(const el of [...document.querySelectorAll('input[type=checkbox],[role=switch],.q-toggle')].filter(ok)){
    let n=el; for(let i=0;i<8&&n;i++){ n=n.parentElement; if(!n) break;
      if(/^Legacy invoice layout/.test((n.innerText||'').trim())){ const r=el.getBoundingClientRect();
        return {aria:el.getAttribute('aria-checked'), checked:el.checked===undefined?null:el.checked,
                x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2)};} } }
  return null;});
const dialog=()=>page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
    return r.width>2&&r.height>2&&c.display!=='none'&&c.visibility!=='hidden';};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok)
    .find(x=>/Switch to the (Legacy|Modern) design\?/.test(x.innerText||''));
  if(!d) return null;
  // A LABEL IS READ FROM THE SMALLEST ELEMENT THAT OWNS IT, AND RECONCILED WITH CSS text-transform:
  // innerText applies the transform, textContent does not. Both are recorded.
  const btn=(id)=>d.querySelector(`[data-test-id="${id}"]`);
  const lab=(el)=>{ if(!el) return null; const span=el.querySelector('.block')||el;
    return {displayed:(el.innerText||'').replace(/\s+/g,' ').trim(),
            underlying:(span.textContent||'').replace(/\s+/g,' ').trim(),
            transform:getComputedStyle(span).textTransform}; };
  const confirm=btn('button_confirm_invoice_design_change'), cancel=btn('button_cancel_invoice_design_change');
  const actionBtns=[...d.querySelectorAll('.q-card__actions button')].filter(ok);
  const closeIcon=[...d.querySelectorAll('button')].filter(ok).filter(b=>/^close$/i.test((b.innerText||'').trim()));
  const txt=(d.innerText||'').replace(/\s+/g,' ').trim();
  const title=(txt.match(/Switch to the (?:Legacy|Modern) design\?/)||[])[0]||null;
  const bodyM=txt.match(/(Every estimate, invoice and credit invoice will use[^]*?You can switch back at any time\.)/);
  return {title, body:bodyM?bodyM[1]:null,
    confirm:lab(confirm), cancel:lab(cancel),
    actionButtonCount:actionBtns.length, closeIconCount:closeIcon.length, raw:txt.slice(0,600)};});
const clickBtn=(which)=>page.evaluate((w)=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok)
    .find(x=>/Switch to the (Legacy|Modern) design\?/.test(x.innerText||''));
  if(!d) return false;
  const b=d.querySelector(`[data-test-id="button_${w}_invoice_design_change"]`);
  if(b){b.click(); return true;} return false;}, which);
const saveBtn=()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const b=[...document.querySelectorAll('button')].filter(ok).find(x=>/^Save Details$/i.test((x.innerText||'').trim()));
  if(b){b.click(); return true;} return false;});
const toast=()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-notification,[role=alert],[role=status]')].filter(ok)
    .map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,200),
              hasClose:!!e.querySelector('button,[class*=close],i')})).filter(t=>t.text);});

R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
for (const target of ['legacy','modern']){
  const from = target==='legacy' ? 'modern' : 'legacy';
  L('==== switching %s -> %s', from, target);
  // put it in the "from" state without the UI, so the UI part starts clean
  if((await stored())!==from){ await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:from}); await page.waitForTimeout(1600); }
  await openTab();
  const s={target, from};
  s.storedBefore=await stored(); s.toggleBefore=(await toggle())||{};
  L('  before: stored=%s toggle aria=%s', s.storedBefore, s.toggleBefore.aria);
  // 1) CLICK THE SWITCH -- does it move, and does a dialog appear?
  const t0=await toggle(); await page.mouse.click(t0.x,t0.y); await page.waitForTimeout(2600);
  s.toggleAfterClick=(await toggle())||{}; s.dialogAfterClick=await dialog(); s.storedAfterClick=await stored();
  s.switchMovedBeforeAnyDialog = s.toggleAfterClick.aria!==s.toggleBefore.aria && !s.dialogAfterClick;
  L('  after clicking the switch: aria %s -> %s | dialog? %s | stored %s',
    s.toggleBefore.aria, s.toggleAfterClick.aria, s.dialogAfterClick?'YES':'no', s.storedAfterClick);
  await page.screenshot({path:`${EV}/PR6-${target}-1-after-click.png`, fullPage:true});
  // 2) PRESS SAVE DETAILS -- is THIS what raises the dialog?
  s.savePressed = s.dialogAfterClick ? false : await saveBtn();
  if(s.savePressed) await page.waitForTimeout(3000);
  s.dialogAfterSave=await dialog(); s.storedAfterSave=await stored();
  s.dialogRaisedBy = s.dialogAfterClick ? 'the switch itself' : (s.savePressed ? 'Save Details' : 'nothing');
  L('  after Save Details: dialog? %s | stored %s', s.dialogAfterSave?'YES':'no', s.storedAfterSave);
  if(s.dialogAfterSave){ L('    title : %s', s.dialogAfterSave.title);
    L('    body  : %s', String(s.dialogAfterSave.body).slice(0,230));
    L('    confirm button: %s', JSON.stringify(s.dialogAfterSave.confirm));
    L('    cancel  button: %s', JSON.stringify(s.dialogAfterSave.cancel));
    L('    action buttons %d | close icons %d', s.dialogAfterSave.actionButtonCount, s.dialogAfterSave.closeIconCount); }
  await page.screenshot({path:`${EV}/PR6-${target}-2-after-save.png`, fullPage:true});
  // 3) CONFIRM -> toast, and the value actually changes
  s.confirmLabel=(s.dialogAfterSave&&s.dialogAfterSave.confirm)||null;
  s.confirmClicked=await clickBtn('confirm');
  await page.waitForTimeout(1500);
  s.toastImmediate=await toast();
  L('  confirm clicked: %s | toast: %s', s.confirmClicked, JSON.stringify(s.toastImmediate).slice(0,220));
  await page.screenshot({path:`${EV}/PR6-${target}-3-toast.png`, fullPage:true});
  await page.waitForTimeout(9000);
  s.toastAfter9s=await toast(); s.toastFaded=(s.toastAfter9s||[]).length===0;
  s.storedAfterConfirm=await stored();
  await openTab(); s.toggleAfterReload=(await toggle())||{}; s.storedAfterReload=await stored();
  L('  toast faded on its own: %s | stored %s | after reload: aria %s stored %s',
    s.toastFaded, s.storedAfterConfirm, s.toggleAfterReload.aria, s.storedAfterReload);
  R.steps.push(s); save();
}
L('design left at: %s', await stored());
save(); L('done'); await browser.close(); process.exit(0);
