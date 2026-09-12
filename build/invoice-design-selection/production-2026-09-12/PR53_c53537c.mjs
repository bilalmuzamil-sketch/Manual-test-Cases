// PRODUCTION -- C53537, full seed. Nothing unpaid is left on the customer, so: invoice two work
// orders (charge account), raise a store credit larger than their sum, then apply that credit
// across BOTH invoices in one New Customer Payment and prove it was consumed. Finally render the
// credit under both designs.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53537', net:[], steps:{}, renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR53.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)&&r.method()!=='GET') R.net.push(`${r.method()} ${u.replace('https://api.shopview.com','')}`);});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const openInvoices=async()=>{ await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(14000); };
const scan=async()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tr')].filter(ok).map((tr,i)=>{const txt=(tr.textContent||'').replace(/\s+/g,' ').trim();
    const pid=[...tr.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).find(t=>/print_credit_memo/.test(t||''))||null;
    return {i, txt:txt.slice(0,120), cb:!!tr.querySelector('input[type=checkbox],.q-checkbox'), pid,
      isCredit:/\bcredit\b/i.test(txt), isInvoice:/\binvoice\b/i.test(txt), amounts:(txt.match(/\$-?[\d,]+\.\d{2}/g)||[])};})
    .filter(r=>r.txt);});
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// --- seed two invoices for this customer
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
const mine=[];
for(const w of wos.filter(w=>!/invoiced|paid/i.test(String(w.status||'')))){
  const d=await call(`/api/work-orders/view/${w.id}`); let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  if((x.company_id||x.customer_id)===CUST) mine.push({n:w.number,id:w.id,st:x.status});
  if(mine.length>=6) break;
}
L('this customer\'s un-invoiced work orders: %s', JSON.stringify(mine));
R.steps.candidates=mine;
const setComplete=async(wo)=>{ await page.goto(`${APP}/workorders/${wo.id}/lines`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(11000);
  // complete every line first -- a work order will not complete with open lines
  const lines=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return [...document.querySelectorAll('[data-test-id^="button_action_complete_line_"]')].filter(ok)
      .map(e=>e.getAttribute('data-test-id'));});
  L('  %s: %d open lines to complete', wo.n, lines.length);
  for(const tid of lines){
    await page.evaluate((t)=>{const b=document.querySelector(`[data-test-id="${t}"]`); b&&b.click();}, tid);
    await page.waitForTimeout(3500);
    await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return;
      const b=[...d.querySelectorAll('button')].filter(ok).find(x=>/^(complete|confirm|yes|ok)$/i.test((x.innerText||'').trim())); b&&b.click();});
    await page.waitForTimeout(3000);
  }
  const hit=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_complete_work_order"]');
    if(!b||b.disabled) return {present:!!b, disabled:b?b.disabled:null}; b.click(); return {clicked:true};});
  L('  %s: Complete Work Order -> %s', wo.n, JSON.stringify(hit));
  await page.waitForTimeout(5000);
  const dlg=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
    return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,200),
      buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').trim()).filter(Boolean)};});
  L('  %s: complete dialog %s', wo.n, JSON.stringify(dlg));
  if(dlg&&dlg.buttons.length){ const go=dlg.buttons.find(b=>/^(complete|complete work order|confirm|yes|ok)$/i.test(b));
    if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
      const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').trim()===lab); if(b) b.click();}, go);
      await page.waitForTimeout(9000); } }
  return hit; };
const invoiceIt=async(wo)=>{
  await page.goto(`${APP}/workorders/${wo.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(12000);
  let st=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/^Create Invoice$/i.test((e.innerText||'').trim()));
    return {present:!!b, disabled:b?b.disabled:null};});
  if(!st.present||st.disabled){ L('  %s: Create Invoice unavailable, setting status Complete first', wo.n);
    await setComplete(wo);
    await page.goto(`${APP}/workorders/${wo.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
    await page.waitForTimeout(12000);
    st=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/^Create Invoice$/i.test((e.innerText||'').trim()));
      return {present:!!b, disabled:b?b.disabled:null};}); }
  if(!st.present||st.disabled) return {wo:wo.n, failed:'Create Invoice still unavailable', screen:st};
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/^Create Invoice$/i.test((e.innerText||'').trim())); b&&b.click();});
  await page.waitForTimeout(6000);
  const dlg=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
    return {buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').trim()).filter(Boolean)};});
  if(dlg&&dlg.buttons.length){ const go=dlg.buttons.find(b=>/charge account/i.test(b))||dlg.buttons.find(b=>/create|confirm/i.test(b));
    if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
      const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').trim()===lab); if(b) b.click();}, go);
      await page.waitForTimeout(14000); return {wo:wo.n, confirmed:go}; } }
  return {wo:wo.n, dialog:dlg}; };
R.steps.invoiced=[];
for(const wo of mine.slice(0,2)){ const r=await invoiceIt(wo); L('invoiced %s -> %s', wo.n, JSON.stringify(r)); R.steps.invoiced.push(r); save(); }
// --- raise a store credit larger than their sum
await openInvoices();
let rows=await scan();
R.steps.unpaidAfterSeed=rows.filter(r=>r.isInvoice&&/Unpaid/i.test(r.txt)).map(r=>({i:r.i,txt:r.txt,amounts:r.amounts}));
L('unpaid now: %s', JSON.stringify(R.steps.unpaidAfterSeed.map(r=>r.txt.slice(0,44))));
save();
if(R.steps.unpaidAfterSeed.length<2){ L('fewer than two unpaid invoices after seeding -- reporting that'); save(); await browser.close(); process.exit(0); }
const num=s=>parseFloat((s||'0').replace(/[$,]/g,''));
const dues=R.steps.unpaidAfterSeed.map(r=>({...r, due:Math.max(...r.amounts.map(a=>Math.abs(num(a))))})).filter(r=>r.due>0)
  .sort((a,b)=>b.due-a.due).slice(0,2);
const amount=Math.ceil(dues.reduce((s,x)=>s+x.due,0))+500;
L('two invoices: %s | credit to raise: $%s', JSON.stringify(dues.map(d=>`${d.txt.slice(10,24)} $${d.due}`)), amount);
R.steps.plan={invoices:dues.map(d=>({txt:d.txt,due:d.due})), creditAmount:amount};
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_issue_credit_customer"]'); b&&b.click();});
await page.waitForTimeout(5000);
R.steps.creditFill=await page.evaluate((amt)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  const set=(el,v)=>{const proto=el.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v);
    el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));};
  const out=[];
  const dt=d.querySelector('[data-test-id="date_input_credit_memo_date"]');
  if(dt && !dt.value){ const n=new Date(); const v=`${String(n.getMonth()+1).padStart(2,'0')}/${String(n.getDate()).padStart(2,'0')}/${n.getFullYear()}`;
    set(dt,v); out.push({f:'date',v}); } else if(dt) out.push({f:'date', v:dt.value});
  const am=d.querySelector('[data-test-id="input_credit_memo_amount"]'); if(am){ set(am,String(amt)); out.push({f:'amount',v:String(amt)}); }
  const rs=d.querySelector('[data-test-id="input_credit_memo_reason"]'); if(rs){ set(rs,'ZZAUTOTEST multi-invoice credit'); out.push({f:'reason'}); }
  const sc=[...d.querySelectorAll('*')].filter(ok).find(e=>/^Issue Store Credit$/i.test((e.textContent||'').trim()));
  if(sc){ sc.click(); out.push({f:'outcome',v:'Issue Store Credit'}); }
  return out;}, amount);
L('credit dialog filled: %s', JSON.stringify(R.steps.creditFill));
await page.waitForTimeout(2500);
await page.screenshot({path:`${EV}/PR53-credit-dialog.png`, fullPage:true});
R.steps.creditSaved=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  const b=[...d.querySelectorAll('button')].filter(ok).find(x=>/^issue credit$/i.test((x.innerText||'').trim()));
  if(!b) return {noButton:[...d.querySelectorAll('button')].filter(ok).map(x=>(x.innerText||'').trim())};
  b.click(); return {clicked:'Issue Credit'};});
L('credit saved: %s', JSON.stringify(R.steps.creditSaved));
await page.waitForTimeout(13000);
await page.screenshot({path:`${EV}/PR53-after-credit.png`, fullPage:true});
R.steps.writesSoFar=[...R.net]; L('writes so far: %s', JSON.stringify(R.net));
save();
// --- apply it across both invoices
await openInvoices();
rows=await scan();
const newCredit=rows.filter(r=>r.isCredit&&r.cb&&r.pid)
  .map(r=>({...r, bal:Math.max(...r.amounts.map(a=>Math.abs(num(a))))})).sort((a,b)=>b.bal-a.bal)[0];
const inv2=rows.filter(r=>r.isInvoice&&/Unpaid/i.test(r.txt)&&r.cb)
  .map(r=>({...r, due:Math.max(...r.amounts.map(a=>Math.abs(num(a))))})).filter(r=>r.due>0).sort((a,b)=>b.due-a.due).slice(0,2);
R.steps.applyPlan={credit:newCredit&&{txt:newCredit.txt,bal:newCredit.bal}, invoices:inv2.map(i=>({txt:i.txt,due:i.due}))};
L('apply plan: %s', JSON.stringify(R.steps.applyPlan));
if(!newCredit||inv2.length<2){ L('cannot line up a credit and two invoices -- reporting that'); save(); await browser.close(); process.exit(0); }
R.steps.creditId=(newCredit.pid||'').replace('button_print_credit_memo_','');
R.steps.before=newCredit.txt;
const tick=async(i,lab)=>{ const r=await page.evaluate((idx)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const tr=[...document.querySelectorAll('tr')].filter(ok)[idx]; if(!tr) return null;
  const c=tr.querySelector('.q-checkbox')||tr.querySelector('input[type=checkbox]'); if(!c) return null; c.click(); return true;}, i);
  await page.waitForTimeout(2200); L('  ticked %s -> %s', lab, r); };
await tick(newCredit.i,'the credit');
for(const iv of inv2) await tick(iv.i, iv.txt.slice(8,30));
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_new_payment"]'); b&&b.click();});
await page.waitForTimeout(7000);
R.steps.payDialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,520),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').trim()).filter(Boolean)};});
L('payment dialog: %s', JSON.stringify(R.steps.payDialog));
await page.screenshot({path:`${EV}/PR53-pay-dialog.png`, fullPage:true});
if(R.steps.payDialog){ const go=(R.steps.payDialog.buttons||[]).find(b=>/^(make payment|new payment|create credit|apply|save|submit)$/i.test(b));
  if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').trim()===lab); if(b) b.click();}, go);
    L('confirmed "%s"', go); await page.waitForTimeout(16000); } }
await page.screenshot({path:`${EV}/PR53-after-pay.png`, fullPage:true});
await openInvoices();
rows=await scan();
const after=rows.find(r=>r.pid===newCredit.pid);
R.steps.after=after?after.txt:null;
R.steps.creditChanged=R.steps.before!==R.steps.after;
R.steps.invoicesGone=inv2.map(iv=>{const still=rows.find(r=>r.i===iv.i&&r.txt===iv.txt); return {was:iv.txt.slice(8,28), gone:!rows.some(r=>r.txt===iv.txt)};});
L('credit before: %s', R.steps.before); L('credit after : %s', R.steps.after);
L('changed=%s | invoices gone: %s', R.steps.creditChanged, JSON.stringify(R.steps.invoicesGone));
R.steps.writes=R.net;
save();
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  const b4=await stored();
  const g=await page.evaluate(async({a,id})=>{const r=await fetch(`https://${a}/api/credit-memos/${id}/pdf`,{credentials:'include'});
    const buf=await r.arrayBuffer(); const u=new Uint8Array(buf); let bin='';
    for(let i=0;i<u.length;i++) bin+=String.fromCharCode(u[i]); return {s:r.status,n:u.length,b64:btoa(bin)};},{a:APIH,id:R.steps.creditId});
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); continue; }
  if(g.s!==200){ R.renders[want]={status:g.s}; L('  HTTP %s', g.s); continue; }
  fs.writeFileSync(`${EV}/PR53-${want}-credit.pdf`, Buffer.from(g.b64,'base64'));
  R.renders[want]={status:200,bytes:g.n,settingWhileRead:b4}; L('  captured %s bytes', g.n);
  save();
}
save(); await browser.close();
