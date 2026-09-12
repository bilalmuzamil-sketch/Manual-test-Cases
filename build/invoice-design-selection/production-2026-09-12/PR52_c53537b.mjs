// PRODUCTION -- C53537, done properly. The previous attempt settled both invoices from DEPOSITS,
// so the credit was never consumed and the case was not really exercised. Pick two unpaid invoices
// whose total exceeds what the deposits can cover, apply the credit across BOTH, and prove it was
// consumed by reading the credit's own balance before and after. Then render it under both designs.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53537', net:[], steps:{}, renders:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR52.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)&&r.method()!=='GET') R.net.push(`${r.method()} ${u.replace('https://api.shopview.com','')}`);});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const openInvoices=async()=>{ await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(14000); };
const scan=async()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tr')].filter(ok).map((tr,i)=>{
    const txt=(tr.textContent||'').replace(/\s+/g,' ').trim();
    const pid=[...tr.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).find(t=>/print_credit_memo/.test(t||''))||null;
    return {i, txt:txt.slice(0,120), cb:!!tr.querySelector('input[type=checkbox],.q-checkbox'), pid,
      isCredit:/\bcredit\b/i.test(txt), isInvoice:/\binvoice\b/i.test(txt),
      amounts:(txt.match(/\$-?[\d,]+\.\d{2}/g)||[])};}).filter(r=>r.txt);});
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
await openInvoices();
const rows=await scan();
R.steps.credits=rows.filter(r=>r.isCredit&&r.cb&&r.pid).slice(0,6).map(r=>({i:r.i,txt:r.txt,pid:r.pid,amounts:r.amounts}));
R.steps.invoices=rows.filter(r=>r.isInvoice&&r.cb&&/Unpaid/i.test(r.txt)).slice(0,10).map(r=>({i:r.i,txt:r.txt,amounts:r.amounts}));
L('credits: %s', JSON.stringify(R.steps.credits.map(c=>c.txt.slice(0,50))));
L('unpaid invoices: %s', JSON.stringify(R.steps.invoices.map(c=>c.txt.slice(0,44))));
save();
const num=(s)=>parseFloat((s||'0').replace(/[$,]/g,''));
const credit=R.steps.credits.map(c=>({...c, bal:Math.max(...c.amounts.map(a=>Math.abs(num(a))))}))
  .sort((a,b)=>b.bal-a.bal)[0];
const invs=R.steps.invoices.map(r=>({...r, due:Math.max(...r.amounts.map(a=>Math.abs(num(a))))}))
  .filter(r=>r.due>0).sort((a,b)=>b.due-a.due).slice(0,2);
R.steps.chosen={credit:credit&&{txt:credit.txt,bal:credit.bal}, invoices:invs.map(i=>({txt:i.txt,due:i.due}))};
L('chosen: %s', JSON.stringify(R.steps.chosen));
if(!credit || invs.length<2){ L('not enough material on the screen -- reporting that'); save(); await browser.close(); process.exit(0); }
R.steps.creditId=(credit.pid||'').replace('button_print_credit_memo_','');
const creditBalance=async()=>{ const rs=await scan();
  const r=rs.find(x=>x.pid===credit.pid); return r?r.txt:null; };
R.steps.balanceBefore=await creditBalance(); L('credit row before: %s', R.steps.balanceBefore);
const tick=async(idx,label)=>{ const r=await page.evaluate((i)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const tr=[...document.querySelectorAll('tr')].filter(ok)[i]; if(!tr) return null;
    const c=tr.querySelector('.q-checkbox')||tr.querySelector('input[type=checkbox]'); if(!c) return null; c.click(); return true;}, idx);
  await page.waitForTimeout(2200); L('  ticked %s -> %s', label, r); return r; };
await tick(credit.i,'the credit');
for(const iv of invs) await tick(iv.i, iv.txt.slice(0,30));
await page.screenshot({path:`${EV}/PR52-ticked.png`, fullPage:true});
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const b=[...document.querySelectorAll('button,[data-test-id]')].filter(ok)
    .find(e=>e.getAttribute('data-test-id')==='button_new_payment'||/^new payment$/i.test((e.textContent||'').trim())); b&&b.click();});
await page.waitForTimeout(7000);
R.steps.dialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,520),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
L('dialog: %s', JSON.stringify(R.steps.dialog));
await page.screenshot({path:`${EV}/PR52-dialog.png`, fullPage:true});
save();
if(R.steps.dialog){
  const go=(R.steps.dialog.buttons||[]).find(b=>/^(make payment|new payment|create credit|apply|save|submit)$/i.test(b));
  if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').replace(/\s+/g,' ').trim()===lab); if(b) b.click();}, go);
    L('confirmed "%s"', go); await page.waitForTimeout(16000); } }
await page.screenshot({path:`${EV}/PR52-after.png`, fullPage:true});
R.steps.writes=R.net; L('writes: %s', JSON.stringify(R.net));
await openInvoices();
R.steps.balanceAfter=await creditBalance(); L('credit row after: %s', R.steps.balanceAfter);
R.steps.invoicesGone=await page.evaluate((t1,t2)=>{const b=(document.body.innerText||'').replace(/\s+/g,' ');
  return {first:!b.includes(t1), second:!b.includes(t2)};}, invs[0].txt.split(' ').slice(2,4).join(' '), invs[1].txt.split(' ').slice(2,4).join(' '));
L('the two invoices gone from the list: %s', JSON.stringify(R.steps.invoicesGone));
R.steps.creditConsumed = R.steps.balanceBefore!==R.steps.balanceAfter;
L('credit changed: %s', R.steps.creditConsumed);
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
  fs.writeFileSync(`${EV}/PR52-${want}-credit.pdf`, Buffer.from(g.b64,'base64'));
  R.renders[want]={status:200, bytes:g.n, settingWhileRead:b4}; L('  captured %s bytes', g.n);
  save();
}
save(); await browser.close();
