// Guarded against the shared branch: the stored value is read from the API immediately BEFORE and
// AFTER every render, and a render whose setting moved underneath it is DISCARDED, not reported.
// Covers C53535, C53543, C53545, C53551, C53565, C53591, C53521, C53570.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P15.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push(r.method()+' '+u.replace(/^https?:\/\/[^/]+/,''));});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,500)};},{api:API,m,p,b:b||null});
const raw=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include'});
  const b=await r.arrayBuffer(); const u=new Uint8Array(b); let str=''; for(let i=0;i<u.length;i++) str+=String.fromCharCode(u[i]);
  return {status:r.status, len:u.length, ctype:r.headers.get('content-type'), body:str};},{api:API,p});
const rawPost=(p,body)=>page.evaluate(async({api,p,body})=>{const r=await fetch(`https://${api}${p}`,{method:'POST',
  headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(body)});
  const t=await r.text(); return {status:r.status, len:t.length, ctype:r.headers.get('content-type'), body:t};},{api:API,p,body});

// ---- THE GUARD: the stored value, straight from the system, in one cheap call
const stored = async()=>{ const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null; };
// render something only if the setting held still across it
const guarded = async(label, fn)=>{
  const a=await stored(); const out=await fn(); const b=await stored();
  if(a!==b){ R.guardDiscards.push({label, before:a, after:b}); log('  !! DISCARDED', label, a, '->', b); return null; }
  return {design:a, ...out};
};
const openInvoiceTab=async()=>{ await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5500);
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
  await page.waitForTimeout(4500); };
const setDesign=async(want)=>{ // want: 'Legacy' | 'Modern'
  if((await stored())===want.toLowerCase()) return want.toLowerCase();
  await openInvoiceTab();
  await page.evaluate(vis=>{const isVis=eval(vis);
    const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
    if(f)(f.querySelector('input')||f).click();},VIS);
  await page.waitForTimeout(2000);
  await page.evaluate(({vis,want})=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).find(e=>new RegExp(want,'i').test(e.innerText||''));
    if(o)o.click();},{vis:VIS,want});
  await page.waitForTimeout(2500);
  await page.evaluate(({vis,want})=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
    const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>new RegExp('switch to '+want,'i').test(t(e))); if(b)b.click();},{vis:VIS,want});
  await page.waitForTimeout(7000);
  let now=await stored();
  if(now!==want.toLowerCase()){ log('  setDesign(%s) did NOT take (stored=%s) - retrying once', want, now);
    await openInvoiceTab();
    await page.evaluate(vis=>{const isVis=eval(vis);
      const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
      if(f)(f.querySelector('input')||f).click();},VIS);
    await page.waitForTimeout(2500);
    const opts=await page.evaluate(vis=>{const isVis=eval(vis);
      return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).map(e=>(e.innerText||'').trim());},VIS);
    log('  options offered:', JSON.stringify(opts));
    await page.evaluate(({vis,want})=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).find(e=>new RegExp(want,'i').test(e.innerText||''));
      if(o)o.click();},{vis:VIS,want});
    await page.waitForTimeout(2500);
    const dlg=await page.evaluate(({vis,want})=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
      const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return null;
      const bs=[...d.querySelectorAll('button')].filter(isVis);
      const b=bs.find(e=>new RegExp('switch to '+want,'i').test(t(e)))||bs.find(e=>/^(Switch|Confirm|Yes)/i.test(t(e)));
      if(b){b.click(); return t(b);} return bs.map(t);},{vis:VIS,want});
    log('  confirm button:', JSON.stringify(dlg));
    await page.waitForTimeout(8000); now=await stored(); }
  return now; };
const look=(t)=>({ len:t.length,
  allCaps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO|SUMMARY/.test(t),
  sentence:/Bill To|Remit payment to|Line Total/.test(t),
  ibs:/IBS#/.test(t), money:(t.match(/\$[\d,]+\.\d{2}/g)||[]).slice(0,12),
  docNo:(t.match(/\b(?:INV|EST)-[A-Z0-9-]+/)||[])[0]||null });

R.startedAt=await stored(); log('stored value at start:', R.startedAt);

// ================= C53535 / C53543 : the PART SALE documents =================
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const psList=rowsOf((await api('GET','/api/part-sales?limit=200')).json);
R.partSales={total:psList.length,
  estimate:psList.find(p=>p.status==='estimate'), paid:psList.find(p=>p.status==='paid')};
log('part sales: %d | estimate=%s | paid=%s', psList.length,
  R.partSales.estimate&&R.partSales.estimate.number, R.partSales.paid&&R.partSales.paid.number);
// what does the Finance tab POST? capture it live
const psTarget=R.partSales.paid||R.partSales.estimate;
if (psTarget){
  seen();
  await page.goto(`${APP}/parts/part-sale/${psTarget.id}/finance`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(13000);
  R.partSaleFinanceCalls=seen().filter(c=>/invoice|preview|estimate/i.test(c));
  log('part sale finance calls:', R.partSaleFinanceCalls);
  R.partSaleOnScreen=await page.evaluate(()=>{const f=document.querySelector('iframe');
    const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {hasIframe:!!f, text:t.slice(0,500)};});
  await page.screenshot({path:`${DIR}/evidence/P15-partsale-finance.png`, fullPage:false});
  log('part sale finance on screen:', R.partSaleOnScreen.text.slice(0,220));
}
save();

// ================= C53591 : the round trip, Legacy -> Modern -> Legacy =================
const invId='aac99a06-20af-424a-afdb-56e865b1553b', woNum='S-4219';
const renderInvoice=()=>raw(`/api/invoices/preview?invoice_id=${invId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`)
  .then(r=>({status:r.status, ...look(r.body.replace(/<[^>]+>/g,' '))}));
R.roundTrip=[];
for (const want of ['Legacy','Modern','Legacy']){
  const now=await setDesign(want);
  log('=== set to %s, stored now %s', want, now);
  const g=await guarded(`roundtrip-${want}-${R.roundTrip.length}`, async()=>({doc:await renderInvoice()}));
  if(g) R.roundTrip.push({asked:want, stored:g.design, ...g.doc});
  save();
}
for(const r of R.roundTrip) log('  round trip: asked=%s stored=%s len=%s allCaps=%s sentence=%s ibs=%s money0=%s',
  r.asked, r.stored, r.len, r.allCaps, r.sentence, r.ibs, (r.money||[])[0]);
save();

// ================= C53570 : the Authorizer / IBS approval code =================
R.authorizer={};
const woFull=(await api('GET','/api/work-orders/view/04ab678b-a2c2-4fd7-bcd9-76b6a23a419f')).json;
let wx=(woFull&&(woFull.data||woFull))||{}; if(wx.work_order)wx=wx.work_order;
R.authorizer.woFields={authorizer_contact_id:wx.authorizer_contact_id, authorizer_full_name:wx.authorizer_full_name,
  company_ibs:wx.company_ibs, ibs_approval_code:wx.ibs_approval_code, status:wx.status};
log('authorizer fields on the work order:', R.authorizer.woFields);
for (const want of ['Legacy','Modern']){
  await setDesign(want);
  const g=await guarded(`authorizer-${want}`, async()=>{
    const r=await raw(`/api/invoices/preview?invoice_id=${invId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`);
    const t=r.body.replace(/<[^>]+>/g,'\n');
    const line=(t.split('\n').map(x=>x.trim()).find(x=>/IBS#/.test(x)))||null;
    return {hasAuthorizerWord:/\bauthorizer\b/i.test(t), ibsLine:line,
      approvalCodeShown:/IBS#:\s*\d+/.test(t)};});
  if(g){ R.authorizer[want]=g; log('  under %s: authorizer word=%s ibs line=%s', want, g.hasAuthorizerWord, g.ibsLine); }
}
save();

// ================= C53545 / C53551 / C53565 : the email route =================
seen();
await page.goto(`${APP}/workorders/04ab678b-a2c2-4fd7-bcd9-76b6a23a419f/finance`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
seen();
const emailed=await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis)
    .find(e=>(e.getAttribute('aria-label')||'')==='Send email');
  if(b){b.click();return true;}return false;},VIS);
await page.waitForTimeout(6000);
R.emailDialog={opened:emailed, calls:seen().slice(-8),
  content:await page.evaluate(vis=>{const isVis=eval(vis);
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    return d?{text:(d.innerText||'').replace(/\s+/g,' ').slice(0,700),
      buttons:[...d.querySelectorAll('button')].map(e=>(e.innerText||'').trim()).filter(Boolean)}:null;},VIS)};
log('email dialog:', emailed, JSON.stringify(R.emailDialog.content).slice(0,500));
await page.screenshot({path:`${DIR}/evidence/P15-email-dialog.png`});
save();

R.endedAt=await stored(); log('stored value at end:', R.endedAt);
log('guard discards:', R.guardDiscards.length, JSON.stringify(R.guardDiscards));
save(); log('done'); await s.browser.close(); process.exit(0);
