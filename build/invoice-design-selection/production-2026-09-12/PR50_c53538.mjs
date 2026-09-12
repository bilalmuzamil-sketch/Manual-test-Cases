// PRODUCTION -- C53538: a Credit Invoice with NO originating invoice must render in whatever the
// setting currently is (the switch is live; nothing is pinned). Find the create control by walking
// the customer's Invoices tab, raise a standalone credit, then render it under BOTH settings.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53538', net:[], steps:{}, renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR50.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)) R.net.push(`${r.method()} ${u.replace('https://api.shopview.com','')}`);});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const openInvoices=async()=>{ await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(13000); };
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.steps.designStart=await setDesign('modern'); L('build %s | design %s', R.build, R.steps.designStart);
await openInvoices();
await page.screenshot({path:`${EV}/PR50-invoices.png`, fullPage:true});
R.steps.controls=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('button,[data-test-id]')].filter(ok)
    .map(e=>({tid:e.getAttribute('data-test-id')||null, txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,34)}))
    .filter(x=>x.tid||x.txt).slice(0,60);});
L('credit-ish controls: %s', JSON.stringify(R.steps.controls.filter(c=>/credit|new|add|payment/i.test(`${c.tid} ${c.txt}`))));
save();
const before=R.net.length;
R.steps.clicked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const b=[...document.querySelectorAll('button,[data-test-id]')].filter(ok)
    .find(e=>e.getAttribute('data-test-id')==='button_issue_credit_customer');
  if(!b) return null; b.click(); return (b.getAttribute('data-test-id')||b.textContent||'').trim().slice(0,40);});
L('create-credit control clicked: %s', R.steps.clicked);
await page.waitForTimeout(5000);
await page.screenshot({path:`${EV}/PR50-dialog.png`, fullPage:true});
R.steps.dialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,320),
    inputs:[...d.querySelectorAll('input,textarea')].filter(ok).map(e=>({tid:e.getAttribute('data-test-id')||null,
      ph:e.getAttribute('placeholder')||null, aria:e.getAttribute('aria-label')||null, type:e.type})),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
L('dialog: %s', JSON.stringify(R.steps.dialog));
save();
if(!R.steps.dialog){ L('no standalone-credit dialog found from this screen -- reporting what the screen offers, not guessing a route');
  save(); await browser.close(); process.exit(0); }
// fill: amount + any reason/memo, tagged
R.steps.filled=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
  const set=(el,v)=>{const proto = el.tagName==='TEXTAREA'? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v);
    el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));};
  const out=[];
  const amount=d.querySelector('[data-test-id="input_credit_memo_amount"]');
  if(amount){ set(amount,'25'); out.push({f:'amount', v:'25'}); }
  const reason=d.querySelector('[data-test-id="input_credit_memo_reason"]');
  if(reason){ set(reason,'ZZAUTOTEST standalone credit'); out.push({f:'reason', v:'ZZAUTOTEST standalone credit'}); }
  // Outcome: choose "Issue Store Credit" so no refund is actually paid out
  const sc=[...d.querySelectorAll('*')].filter(ok).find(e=>/^Issue Store Credit$/i.test((e.textContent||'').trim()));
  if(sc){ sc.click(); out.push({f:'outcome', v:'Issue Store Credit'}); }
  return out;});
L('filled: %s', JSON.stringify(R.steps.filled));
await page.waitForTimeout(1500);
R.steps.saved=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
  const b=[...d.querySelectorAll('button')].filter(ok).find(x=>/^issue (credit|store credit)$/i.test((x.innerText||'').trim()))
        || [...d.querySelectorAll('button')].filter(ok).find(x=>/^issue/i.test((x.innerText||'').trim())&&!/refund/i.test((x.innerText||'').trim()));
  if(!b) return null; b.click(); return (b.innerText||'').trim();});
L('saved with: %s', R.steps.saved);
R.steps.dialogAfterFill=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,240),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').trim()).filter(Boolean)};});
L('dialog state after the save click: %s', JSON.stringify(R.steps.dialogAfterFill));
await page.waitForTimeout(12000);
await page.screenshot({path:`${EV}/PR50-after-save.png`, fullPage:true});
R.steps.writes=R.net.slice(before).filter(u=>!u.startsWith('GET'));
L('writes: %s', JSON.stringify(R.steps.writes));
// find the new credit row and its print control
await openInvoices();
R.steps.rows=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tr')].filter(ok).map((tr,i)=>({i,txt:(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,120),
    print:[...tr.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).find(t=>/print_credit/.test(t||''))||null}))
    .filter(r=>/credit/i.test(r.txt)).slice(0,8);});
L('credit rows: %s', JSON.stringify(R.steps.rows));
save();
// the newest standalone credit = a credit row with no "-S" or "-P" origin after its number
const standalone=R.steps.rows.find(r=>r.print && !/CM\d?-\d+-[SP]\d?-\d+/.test(r.txt));
R.steps.standalone=standalone||null;
L('standalone credit row: %s', JSON.stringify(standalone));
if(!standalone){ L('no credit row without an originating document -- reporting that'); save(); await browser.close(); process.exit(0); }
const cmId=(standalone.print||'').replace('button_print_credit_memo_','');
R.steps.creditId=cmId;
for(const want of ['modern','legacy']){
  const now=await setDesign(want); L('=== design %s', now);
  if(now!==want){ R.renders[want]={note:'could not reach this design'}; continue; }
  const b4=await stored();
  const g=await page.evaluate(async({a,id})=>{const r=await fetch(`https://${a}/api/credit-memos/${id}/pdf`,{credentials:'include'});
    const buf=await r.arrayBuffer(); const u=new Uint8Array(buf); let bin='';
    for(let i=0;i<u.length;i++) bin+=String.fromCharCode(u[i]);
    return {s:r.status, ct:r.headers.get('content-type')||'', n:u.length, b64:btoa(bin)};},{a:APIH,id:cmId});
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift -- discarded'); continue; }
  if(g.s!==200){ R.renders[want]={status:g.s}; L('  HTTP %s', g.s); continue; }
  fs.writeFileSync(`${EV}/PR50-${want}-credit.pdf`, Buffer.from(g.b64,'base64'));
  R.renders[want]={status:200, bytes:g.n, settingWhileRead:b4};
  L('  captured %s bytes', g.n);
  save();
}
save(); await browser.close();
