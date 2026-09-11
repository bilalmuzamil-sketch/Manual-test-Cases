// Same documents, both designs, but comparing the LABELLED TOTALS rather than every dollar string
// on the page — the blunt version reported differences that were only layout. Ends with the setting
// put back to Legacy, where it was found.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const FOUND_AS='Legacy';   // read live by P04/P05 before anything was changed
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={docs:[],renders:{}}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P06.json`, JSON.stringify(R,null,1));
const s = await boot('sv9872','/administration/settings','admin');
const page=s.page; await page.setViewportSize({width:1600,height:1100});
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,credentials:'include',
  headers:{Accept:'application/json'}});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:API,m,p});
const html=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include'});
  return {status:r.status, body:await r.text()};},{api:API,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const LABELS=['Subtotal','Sub Total','Tax','Total','Balance','Amount Due','Paid','Deposit','Discount','Shop Supplies'];
const totals=(body)=>{
  let t=body.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
  t=t.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ');
  const out={};
  for(const l of LABELS){ const m=[...t.matchAll(new RegExp(l+"[^$]{0,40}(\\$[\\d,]+\\.\\d{2})","gi"))].map(x=>x[1]);
    if(m.length) out[l]=m.slice(0,3); }
  const doc=(t.match(/\b(?:INV|EST)-[A-Z0-9-]+/g)||[]).slice(0,3);
  return {out, doc, len:body.length};
};
const openTab=async()=>{ await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5500);
  await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el) el.click();},VIS);
  await page.waitForTimeout(4500); };
const cur=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
  const i=f&&f.querySelector('input'); return i?i.value:null;},VIS);
const setDesign=async(want)=>{ await openTab(); if((await cur())===want) return want;
  await page.evaluate(vis=>{const isVis=eval(vis);
    const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
    if(f)(f.querySelector('input')||f).click();},VIS);
  await page.waitForTimeout(2000);
  await page.evaluate(({vis,want})=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
      .find(e=>new RegExp(want,'i').test(e.innerText||'')); if(o)o.click();},{vis:VIS,want});
  await page.waitForTimeout(2200);
  await page.evaluate(({vis,want})=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
    const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>new RegExp('switch to '+want,'i').test(t(e)));
    if(b)b.click();},{vis:VIS,want});
  await page.waitForTimeout(6000); await openTab(); return await cur(); };

const wos=rowsOf((await call('GET','/api/work-orders?limit=200')).json);
for(const w of wos.slice(0,50)){
  const d=(await call('GET',`/api/work-orders/view/${w.id}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order)x=x.work_order;
  if(x.invoice_id){ R.docs.push({wo:w.number||x.number, invoiceId:x.invoice_id, created:x.created_on||null});
    if(R.docs.length>=5) break; }
}
log('documents: %s', JSON.stringify(R.docs.map(d=>d.wo)));

for(const want of ['Legacy','Modern']){
  log('setting -> %s', await setDesign(want));
  R.renders[want]={};
  for(const d of R.docs) for(const [kind,isEst] of [['invoice','0'],['estimate','1']]){
    const r=await html(`/api/invoices/preview?invoice_id=${d.invoiceId}&type=html&isEstimate=${isEst}&includeDeclined=0&historyEvent=`);
    if(r.status!==200){ R.renders[want][`${d.wo}-${kind}`]={status:r.status}; continue; }
    R.renders[want][`${d.wo}-${kind}`]=totals(r.body);
    fs.writeFileSync(`${DIR}/evidence/P06-${want}-${d.wo}-${kind}.html`, r.body);
  }
  save();
}
R.compare=[];
for(const k of Object.keys(R.renders.Legacy)){
  const L=R.renders.Legacy[k], M=R.renders.Modern[k];
  if(!L||!M||L.status||M.status){R.compare.push({k,note:'not rendered'});continue;}
  const labels=[...new Set([...Object.keys(L.out),...Object.keys(M.out)])];
  const figureDiffs=labels.filter(x=>L.out[x]&&M.out[x]&&JSON.stringify(L.out[x])!==JSON.stringify(M.out[x]));
  const onlyLegacy=labels.filter(x=>L.out[x]&&!M.out[x]);
  const onlyModern=labels.filter(x=>M.out[x]&&!L.out[x]);
  R.compare.push({k, designDiffers:L.len!==M.len, lenL:L.len, lenM:M.len,
    figuresThatDisagree:figureDiffs, rowOnlyInLegacy:onlyLegacy, rowOnlyInModern:onlyModern,
    docNumberSame: JSON.stringify(L.doc)===JSON.stringify(M.doc)});
}
for(const c of R.compare) log('%-26s differs:%-5s | FIGURES THAT DISAGREE: %-12s | row only Legacy:%-22s only Modern:%s',
  c.k, c.designDiffers, JSON.stringify(c.figuresThatDisagree||[]), JSON.stringify(c.rowOnlyInLegacy||[]), JSON.stringify(c.rowOnlyInModern||[]));
save();
R.restoredTo = await setDesign(FOUND_AS);
log('setting restored to: %s (found as %s)', R.restoredTo, FOUND_AS);
save(); log('done');
await s.browser.close(); process.exit(0);
