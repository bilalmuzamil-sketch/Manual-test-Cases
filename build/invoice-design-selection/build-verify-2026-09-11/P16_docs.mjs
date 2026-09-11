// Part-sale documents, the emailed copy, credit invoices, and the remaining Story-5 surfaces.
// Every render is guarded: the stored value is read before and after, and a render whose setting
// moved underneath it is discarded (the branch is shared).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P16.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,''),b:(r.postData()||'').slice(0,200)});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,500)};},{api:API,m,p,b:b||null});
const raw=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include'});
  const b=await r.arrayBuffer(); const u=new Uint8Array(b); let str=''; for(let i=0;i<u.length;i++) str+=String.fromCharCode(u[i]);
  return {status:r.status,len:u.length,ctype:r.headers.get('content-type'),body:str};},{api:API,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const guarded=async(label,fn)=>{const a=await stored(); const out=await fn(); const b=await stored();
  if(a!==b){R.guardDiscards.push({label,before:a,after:b}); log('  !! DISCARDED',label,a,'->',b); return null;}
  return {design:a,...out};};
const openInvoiceTab=async()=>{await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5500);
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
  await page.waitForTimeout(4500);};
const setDesign=async(want)=>{ if((await stored())===want.toLowerCase()) return want.toLowerCase();
  for(let attempt=0;attempt<3;attempt++){
    await openInvoiceTab();
    await page.evaluate(vis=>{const isVis=eval(vis);
      const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
      if(f)(f.querySelector('input')||f).click();},VIS);
    await page.waitForTimeout(2200);
    await page.evaluate(({vis,want})=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).find(e=>new RegExp(want,'i').test(e.innerText||''));
      if(o)o.click();},{vis:VIS,want});
    await page.waitForTimeout(2400);
    await page.evaluate(({vis,want})=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
      const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
      const bs=[...d.querySelectorAll('button')].filter(isVis);
      const b=bs.find(e=>new RegExp('switch to '+want,'i').test(t(e)))||bs.find(e=>/^(Switch|Confirm|Yes)/i.test(t(e))); if(b)b.click();},{vis:VIS,want});
    await page.waitForTimeout(7000);
    const now=await stored(); if(now===want.toLowerCase()) return now;
    log('  setDesign(%s) attempt %d left it at %s', want, attempt+1, now);
  }
  return await stored();};
const look=(t)=>({len:t.length, allCaps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO/.test(t),
  ibs:/IBS#/.test(t), money:(t.match(/\$[\d,]+\.\d{2}/g)||[]).slice(0,10),
  docNo:(t.match(/\b(?:INV|EST|CR)-[A-Z0-9-]+/)||[])[0]||null});
const strip=(h)=>h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ');

R.start=await stored(); log('stored at start:',R.start);

// ---------- the document set: a work-order invoice, an estimate-only WO, a part sale ----------
const ps=rowsOf((await api('GET','/api/part-sales?limit=200')).json);
const psPaid=ps.find(p=>p.status==='paid'), psEst=ps.find(p=>p.status==='estimate');
const psInvId=async(id)=>{const d=(await api('GET',`/api/invoices/${id}/details?includeDeclined=0`)).json;
  let x=(d&&(d.data||d))||{}; return x.invoice_id||x.invoiceId||(x.invoice&&x.invoice.id)||null;};
R.partSaleTargets={};
for (const [tag,p] of [['paid',psPaid],['estimate',psEst]]){
  if(!p) continue;
  seen(); await page.goto(`${APP}/parts/part-sale/${p.id}/finance`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(13000);
  const prev=seen().map(c=>c.u).filter(u=>/invoices\/preview/.test(u));
  const m=prev.length?prev[prev.length-1].match(/invoice_id=([0-9a-f-]+).*?isEstimate=(\d)/):null;
  R.partSaleTargets[tag]={number:p.number,status:p.status,id:p.id,
    invoiceId:m?m[1]:null, isEstimate:m?m[2]:null, previewSeen:prev.length};
  log('part sale %s (%s): invoice_id=%s isEstimate=%s', p.number, p.status, m&&m[1], m&&m[2]);
}
// an estimate-only work order (never invoiced) -- C53543's Estimate
const wos=rowsOf((await api('GET','/api/work-orders?limit=200')).json);
let estWo=null;
for (const w of wos.slice(0,40)){ const d=(await api('GET',`/api/work-orders/view/${w.id}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order)x=x.work_order;
  if(!x.invoice_id && x.number){ estWo={id:w.id,num:x.number,status:x.status}; break; } }
R.estimateWo=estWo; log('estimate-only work order:', estWo);
save();

// ---------- render the whole set under both designs ----------
const targets=[
  {name:'Work Order Invoice (S-4219)', invId:'aac99a06-20af-424a-afdb-56e865b1553b', isEst:0},
  {name:'Estimate view of S-4219',     invId:'aac99a06-20af-424a-afdb-56e865b1553b', isEst:1},
];
if(R.partSaleTargets.paid&&R.partSaleTargets.paid.invoiceId)
  targets.push({name:`Parts Sale Invoice (${R.partSaleTargets.paid.number})`, invId:R.partSaleTargets.paid.invoiceId, isEst:0});
if(R.partSaleTargets.estimate&&R.partSaleTargets.estimate.invoiceId)
  targets.push({name:`Parts Sale Estimate (${R.partSaleTargets.estimate.number})`, invId:R.partSaleTargets.estimate.invoiceId, isEst:1});
R.docMatrix={};
for (const want of ['Legacy','Modern']){
  const now=await setDesign(want); log('=== stored now %s (asked %s)', now, want);
  if(now!==want.toLowerCase()){ log('   could not set it; skipping this half'); continue; }
  R.docMatrix[want]={};
  for (const t of targets){
    const g=await guarded(`${want}-${t.name}`, async()=>{
      const r=await raw(`/api/invoices/preview?invoice_id=${t.invId}&type=html&isEstimate=${t.isEst}&includeDeclined=0&historyEvent=`);
      return r.status===200?{ok:true, ...look(strip(r.body))}:{ok:false,status:r.status};});
    if(g){R.docMatrix[want][t.name]=g; log('  %-34s %s len=%s caps=%s ibs=%s', t.name, g.design, g.len, g.allCaps, g.ibs);}
  }
  save();
}
// compare
R.docCompare=[];
for (const t of targets){
  const L=(R.docMatrix.Legacy||{})[t.name], M=(R.docMatrix.Modern||{})[t.name];
  if(!L||!M||!L.ok||!M.ok){R.docCompare.push({doc:t.name,note:'not rendered under both'}); continue;}
  R.docCompare.push({doc:t.name, legacyLen:L.len, modernLen:M.len, looksDifferent:L.len!==M.len,
    moneySame:JSON.stringify(L.money)===JSON.stringify(M.money), money:L.money.slice(0,4),
    ibsLegacy:L.ibs, ibsModern:M.ibs, capsLegacy:L.allCaps, capsModern:M.allCaps});
}
for(const c of R.docCompare) log('COMPARE %s', JSON.stringify(c));
save();

// ---------- what the EMAIL send actually calls ----------
await page.goto(`${APP}/workorders/04ab678b-a2c2-4fd7-bcd9-76b6a23a419f/finance`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>(e.getAttribute('aria-label')||'')==='Send email'); if(b)b.click();},VIS);
await page.waitForTimeout(5000);
seen();
const sent=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return 'no dialog';
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^(Send|Send Email)$/i.test(t(e)));
  if(b){b.click(); return t(b);} return [...d.querySelectorAll('button')].map(t);},VIS);
await page.waitForTimeout(9000);
R.emailSend={clicked:sent, calls:seen().filter(c=>c.m!=='GET'||/preview|pdf|email|send/i.test(c.u)).slice(0,12),
  toasts:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS)};
log('email send clicked:',JSON.stringify(sent));
log('  calls:',JSON.stringify(R.emailSend.calls));
log('  toasts:',JSON.stringify(R.emailSend.toasts));
await page.screenshot({path:`${DIR}/evidence/P16-email-sent.png`});
save();
R.end=await stored(); log('stored at end:',R.end,'| discards:',R.guardDiscards.length);
save(); log('done'); await s.browser.close(); process.exit(0);
