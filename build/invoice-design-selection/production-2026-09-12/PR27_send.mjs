// PRODUCTION -- send the invoice by email, to the account owner's OWN address only.
// SAFETY: the dialog arrives with a customer contact already ticked (dsfsdf@gmail.com). Every
// contact box is unticked and the count of ticked boxes is asserted to be ZERO before Send is
// pressed. If any contact is still ticked the script stops without sending.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const WO='f58e3fda-af5d-45fc-afc6-b0c79bd77046';          // S1-852
const TO='bilal.muzamil@shopview.com';                    // the account owner's own address
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), to:TO, sends:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR27.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
for(const want of ['modern','legacy']){
  const now=await setDesign(want); L('=== design %s', now); if(now!==want) continue;
  await page.goto(`${APP}/workorders/${WO}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(16000);
  if(!await page.evaluate(()=>((document.body.innerText||'').includes('S1-852')))){ L('  not on S1-852'); continue; }
  await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const b=[...document.querySelectorAll('button,a')].filter(ok).find(e=>{const i=e.querySelector('i');
      return i && /^(email|mail)$/i.test((i.innerText||'').trim());}); if(b) b.click();});
  await page.waitForTimeout(6000);
  // 1. UNTICK every contact, then COUNT what is still ticked
  const state=await page.evaluate((to)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return {err:'no dialog'};
    const boxes=[...d.querySelectorAll('input[type=checkbox],[role=checkbox],[role=switch]')].filter(ok);
    const labelOf=b=>{let n=b; for(let i=0;i<6&&n;i++){ n=n.parentElement; if(!n) break;
      const t=(n.innerText||'').replace(/\s+/g,' ').trim(); if(t&&t.length<90) return t; } return '';};
    const before=boxes.map(b=>({checked:b.getAttribute('aria-checked') ?? String(b.checked), label:labelOf(b).slice(0,50)}));
    // untick anything that looks like a contact (has an @ in its label) and is ticked
    for(const b of boxes){ const lab=labelOf(b);
      const isOn=(b.getAttribute('aria-checked')==='true')||b.checked===true;
      if(isOn && /@/.test(lab)){ (b.closest('label')||b.parentElement||b).click(); } }
    return {before};});
  await page.waitForTimeout(2500);
  const after=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const boxes=[...d.querySelectorAll('input[type=checkbox],[role=checkbox],[role=switch]')].filter(ok);
    const labelOf=b=>{let n=b; for(let i=0;i<6&&n;i++){ n=n.parentElement; if(!n) break;
      const t=(n.innerText||'').replace(/\s+/g,' ').trim(); if(t&&t.length<90) return t; } return '';};
    const rows=boxes.map(b=>({on:(b.getAttribute('aria-checked')==='true')||b.checked===true, label:labelOf(b).slice(0,50)}));
    return {rows, contactsStillTicked:rows.filter(r=>r.on && /@/.test(r.label)).map(r=>r.label)};});
  L('  contacts before: %s', JSON.stringify((state.before||[]).filter(b=>/@/.test(b.label))));
  L('  contacts still ticked after unticking: %s', JSON.stringify(after.contactsStillTicked));
  await page.screenshot({path:`${EV}/PR27-${want}-before-send.png`, fullPage:true});
  if(after.contactsStillTicked.length){ L('  *** a customer contact is still selected - NOT SENDING ***');
    R.sends.push({design:want, sent:false, reason:'a customer contact was still selected'}); save(); continue; }
  // 2. address it to the account owner only
  const filled=await page.evaluate((to)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const ta=[...d.querySelectorAll('textarea,input')].filter(ok)
      .find(e=>/optional emails/i.test(e.getAttribute('aria-label')||''));
    if(!ta) return false;
    const setter=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(ta),'value').set;
    setter.call(ta,to); ta.dispatchEvent(new Event('input',{bubbles:true})); ta.dispatchEvent(new Event('change',{bubbles:true}));
    return ta.value===to;}, TO);
  L('  addressed to %s: %s', TO, filled);
  if(!filled){ L('  could not fill the address - NOT SENDING'); R.sends.push({design:want,sent:false,reason:'address field not filled'}); save(); continue; }
  const sent=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>/^Send Email$/i.test((x.innerText||'').trim()));
    if(b && !b.disabled){ b.click(); return true;} return false;});
  await page.waitForTimeout(9000);
  const toastText=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return [...document.querySelectorAll('.q-notification,[role=alert],[role=status]')].filter(ok)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,3);});
  R.sends.push({design:want, sent, toast:toastText, at:new Date().toISOString()});
  L('  Send pressed: %s | response: %s', sent, JSON.stringify(toastText));
  await page.screenshot({path:`${EV}/PR27-${want}-after-send.png`, fullPage:true});
  save();
}
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
