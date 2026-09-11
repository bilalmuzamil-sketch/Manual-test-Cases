// Stories 2, 3, 5 — does one switch really change every document, old ones included, with the
// figures untouched? Render the SAME documents under Legacy and under Modern and compare.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com';
const API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={docs:[], renders:{}}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P05.json`, JSON.stringify(R,null,1));
const s = await boot('sv9872','/administration/settings','admin');
const page = s.page;
await page.setViewportSize({width:1600,height:1100});
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API,m,p,b:b||null});
const html=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include'});
  const t=await r.text(); return {status:r.status, len:t.length, body:t};},{api:API,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};

// what the HTML tells us about which design it is, plus the figures that must NOT change
const fingerprint = (body)=>({
  len: body.length,
  money: (body.match(/\$[\d,]+\.\d{2}/g)||[]),
  numbers: (body.match(/\b(?:INV|EST)-[A-Z0-9-]+/g)||[]).slice(0,4),
  hasRemitTo: /remit\s*to/i.test(body),
  hasAuthorizer: /authorizer/i.test(body),
  classes: (body.match(/class="[^"]{0,60}"/g)||[]).slice(0,8),
  title: (body.match(/<title[^>]*>([^<]*)</i)||[])[1]||null,
});

const openInvoiceTab = async ()=>{
  await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5500);
  await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice');
    if(el) el.click();}, VIS);
  await page.waitForTimeout(4500);
};
const currentDesign = ()=>page.evaluate(vis=>{const isVis=eval(vis);
  const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis)
    .find(x=>/invoice design/i.test(x.innerText||''));
  const i=f&&f.querySelector('input'); return i?i.value:null;}, VIS);
const setDesign = async (want)=>{
  await openInvoiceTab();
  if ((await currentDesign())===want) return 'already '+want;
  await page.evaluate(vis=>{const isVis=eval(vis);
    const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis)
      .find(x=>/invoice design/i.test(x.innerText||''));
    if(f)(f.querySelector('input')||f).click();}, VIS);
  await page.waitForTimeout(2000);
  await page.evaluate(({vis,want})=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
      .find(e=>new RegExp(want,'i').test(e.innerText||'')); if(o) o.click();},{vis:VIS,want});
  await page.waitForTimeout(2500);
  await page.evaluate(({vis,want})=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return;
    const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>new RegExp('switch to '+want,'i').test(t(e)));
    if(b) b.click();},{vis:VIS,want});
  await page.waitForTimeout(6000);
  await openInvoiceTab();
  return await currentDesign();
};

R.found = await currentDesign();
log('design as found: %s', R.found);

// ---- gather documents: an invoice and an estimate, oldest and newest we can get
const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
log('work orders visible: %d', wos.length);
for (const w of wos.slice(0,40)){
  const d=(await call('GET',`/api/work-orders/view/${w.id}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order) x=x.work_order;
  if (x.invoice_id){
    R.docs.push({wo:w.number||x.number, woId:w.id, invoiceId:x.invoice_id,
      status:x.status, created:x.created_on||x.created_at||null});
    if (R.docs.length>=4) break;
  }
}
log('documents to compare: %s', JSON.stringify(R.docs.map(d=>d.wo)));
save();

// ---- render each under BOTH designs
for (const want of ['Legacy','Modern']){
  const got = await setDesign(want);
  log('setting now: %s', got);
  R.renders[want]={};
  for (const d of R.docs){
    for (const [kind,isEst] of [['invoice','0'],['estimate','1']]){
      const p=`/api/invoices/preview?invoice_id=${d.invoiceId}&type=html&isEstimate=${isEst}&includeDeclined=0&historyEvent=`;
      const r=await html(p);
      R.renders[want][`${d.wo}-${kind}`]= r.status===200 ? fingerprint(r.body) : {status:r.status};
      if (r.status===200 && d===R.docs[0])
        fs.writeFileSync(`${DIR}/evidence/P05-${want}-${d.wo}-${kind}.html`, r.body);
    }
  }
  log('  rendered %d documents under %s', Object.keys(R.renders[want]).length, want);
  save();
}

// ---- compare
R.compare=[];
for (const key of Object.keys(R.renders.Legacy||{})){
  const L=R.renders.Legacy[key], M=(R.renders.Modern||{})[key];
  if(!L||!M||L.status||M.status){ R.compare.push({key, note:'not rendered', L:L&&L.status, M:M&&M.status}); continue; }
  R.compare.push({key,
    lenLegacy:L.len, lenModern:M.len, designDiffers: L.len!==M.len,
    moneySame: JSON.stringify(L.money)===JSON.stringify(M.money),
    moneyCount: L.money.length,
    numbersSame: JSON.stringify(L.numbers)===JSON.stringify(M.numbers),
    remitToLegacy:L.hasRemitTo, remitToModern:M.hasRemitTo,
    authorizerLegacy:L.hasAuthorizer, authorizerModern:M.hasAuthorizer});
}
for (const c of R.compare)
  log('%-28s legacy %-7s modern %-7s | looks different: %-5s | figures identical: %s',
    c.key, c.lenLegacy, c.lenModern, c.designDiffers, c.moneySame);
save();

// ---- put the setting back where we found it
const back = await setDesign(R.found);
R.restoredTo = back;
log('restored the setting to: %s', back);
save();
log('done');
await s.browser.close();
process.exit(0);
