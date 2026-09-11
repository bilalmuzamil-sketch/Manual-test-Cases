// The render matrix. Same documents, rendered under BOTH designs, on BOTH surfaces
// (in-app HTML preview and the app's PDF), plus a history snapshot.
// Covers C53540, C53543(part), C53545, C53564, C53571, C53590, C53591, C53592, C53550.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={docs:[],renders:{}}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P10.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const call=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j};},{api:API,p});
const raw=(p)=>page.evaluate(async({api,p})=>{const r=await fetch(`https://${api}${p}`,{credentials:'include'});
  const b=await r.arrayBuffer(); const bytes=new Uint8Array(b);
  let str=''; for(let i=0;i<bytes.length;i++) str+=String.fromCharCode(bytes[i]);
  return {status:r.status, len:bytes.length, ctype:r.headers.get('content-type'), body:str};},{api:API,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};

// ---------- setting control ----------
const openInvoiceTab=async()=>{ await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5500);
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
  await page.waitForTimeout(4500); };
const currentDesign=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
  const i=f&&f.querySelector('input'); return i?i.value:null;},VIS);
const setDesign=async(want)=>{ await openInvoiceTab();
  if((await currentDesign())===want) return 'already '+want;
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
  await page.waitForTimeout(6000); await openInvoiceTab(); return await currentDesign(); };

// ---------- the reader: labelled figures, not a blind money sweep ----------
const LABELS=['Subtotal','Sub Total','Discount','Shop Supplies','Tax','Total','Balance Due','Balance','Amount Paid','Paid'];
const readDoc=(html)=>{
  const text=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#\d+;/g,' ');
  const lines=text.split('\n').map(x=>x.trim()).filter(Boolean);
  const figures={};
  for(let i=0;i<lines.length;i++){
    for(const L of LABELS){
      if(new RegExp('^'+L.replace(/ /g,'\\s*')+'\\s*:?\\s*\\$?[\\d,().-]*$','i').test(lines[i])){
        const inline=(lines[i].match(/-?\$?[\d,]+\.\d{2}\)?/)||[])[0];
        const next=(lines.slice(i+1,i+4).find(x=>/^-?\(?\$?[\d,]+\.\d{2}\)?$/.test(x))||null);
        const v=inline||next; if(v&&figures[L]===undefined) figures[L]=v.replace(/[$,()]/g,'');
      }
    }
  }
  return {
    figures,
    docNumber:(text.match(/\b[SP]-?\d{3,6}\b/)||[])[0]||null,
    lineCount:(html.match(/<tr\b/gi)||[]).length,
    allMoney:(text.match(/\$[\d,]+\.\d{2}/g)||[]).length,
    hasRemitTo:/remit\s*(payment\s*)?to/i.test(text),
    hasAuthorizer:/\bauthorizer\b/i.test(text),
    legacyMarkers:(html.match(/legacy/gi)||[]).length,
    len:html.length,
    bodyText:text.replace(/\s+/g,' ').slice(0,240),
  };
};

// ---------- pick the documents ----------
const invRows=rowsOf((await call('/api/invoices/list?limit=300')).json);
log('invoices in the list:',invRows.length);
const wos=rowsOf((await call('/api/work-orders?limit=200')).json);
const picks=[];
// a paid invoice (C53540), plus a spread of others (C53571, C53591)
for (const w of wos.slice(0,60)){
  const d=(await call(`/api/work-orders/view/${w.id}`)).json; let x=(d&&(d.data||d))||{}; if(x.work_order)x=x.work_order;
  if(!x.invoice_id) continue;
  picks.push({num:x.number, woId:w.id, invId:x.invoice_id, status:x.status,
    balance:x.balance_due??x.balance??null, authorizer:x.authorizer_full_name||x.ibs_approval_code||null});
  if(picks.length>=8) break;
}
R.docs=picks; log('documents chosen:', picks.map(p=>`${p.num}/${p.status}/bal=${p.balance}`));
// a history snapshot (C53590)
const hist=(await call(`/api/work-orders/${picks[0].woId}/history`)).json;
const events=((hist&&hist.data&&hist.data.history)||[]).filter(e=>e.snapshotAvailable);
R.snapshotEvent=events[0]?{id:events[0].id,eventName:events[0].eventName,date:events[0].historyDate}:null;
log('snapshot event:', R.snapshotEvent);
save();

R.found=await currentDesign(); log('design as found:',R.found);

for (const want of ['Legacy','Modern']){
  const got=await setDesign(want); log('=== setting now:',got);
  R.renders[want]={};
  for (const p of picks){
    for (const [kind,qs] of [
      ['invoice-html',`invoice_id=${p.invId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`],
      ['estimate-html',`invoice_id=${p.invId}&type=html&isEstimate=1&includeDeclined=0&historyEvent=`],
    ]){
      const r=await raw(`/api/invoices/preview?${qs}`);
      R.renders[want][`${p.num}|${kind}`]= r.status===200 ? readDoc(r.body) : {status:r.status};
      if (p===picks[0]) fs.writeFileSync(`${DIR}/evidence/P10-${want}-${p.num}-${kind}.html`, r.body);
    }
  }
  // PDF of the first document (C53564, C53545, C53550)
  const pdf=await raw(`/api/invoices/preview?invoice_id=${picks[0].invId}&type=pdf&isEstimate=0&includeDeclined=0&historyEvent=`);
  R.renders[want]['PDF']={status:pdf.status, len:pdf.len, ctype:pdf.ctype};
  if(pdf.status===200) fs.writeFileSync(`${DIR}/evidence/P10-${want}-${picks[0].num}.pdf`, Buffer.from(pdf.body,'binary'));
  log('  PDF under',want,pdf.status,pdf.len,'bytes');
  // the history snapshot (C53590)
  if (R.snapshotEvent){
    const sn=await raw(`/api/invoices/preview?invoice_id=${picks[0].invId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=${R.snapshotEvent.id}`);
    R.renders[want]['SNAPSHOT']= sn.status===200 ? readDoc(sn.body) : {status:sn.status};
    if(sn.status===200) fs.writeFileSync(`${DIR}/evidence/P10-${want}-snapshot.html`, sn.body);
    log('  snapshot under',want,sn.status,sn.len,'bytes');
  }
  log('  rendered',Object.keys(R.renders[want]).length,'items');
  save();
}

// ---------- compare ----------
R.compare=[];
for (const key of Object.keys(R.renders.Legacy)){
  const L=R.renders.Legacy[key],M=R.renders.Modern[key];
  if(key==='PDF'){ R.compare.push({key,legacyBytes:L.len,modernBytes:M.len,differs:L.len!==M.len,bothPdf:L.ctype===M.ctype&&/pdf/.test(L.ctype||'')}); continue; }
  if(!L||!M||L.status||M.status){R.compare.push({key,note:'not rendered',L:L&&L.status,M:M&&M.status});continue;}
  const fk=[...new Set([...Object.keys(L.figures),...Object.keys(M.figures)])];
  const figMismatch=fk.filter(k=>L.figures[k]!==M.figures[k]);
  R.compare.push({key, lenL:L.len, lenM:M.len, designDiffers:L.len!==M.len,
    figuresRead:fk.length, figuresMatch:figMismatch.length===0, figMismatch,
    figuresL:L.figures, figuresM:M.figures,
    docNumSame:L.docNumber===M.docNumber, docNum:L.docNumber,
    remitL:L.hasRemitTo, remitM:M.hasRemitTo, authL:L.hasAuthorizer, authM:M.hasAuthorizer});
}
for(const c of R.compare) log(JSON.stringify(c).slice(0,300));
save();
R.restoredTo=await setDesign(R.found); log('restored to:',R.restoredTo); save();
log('done'); await s.browser.close(); process.exit(0);
