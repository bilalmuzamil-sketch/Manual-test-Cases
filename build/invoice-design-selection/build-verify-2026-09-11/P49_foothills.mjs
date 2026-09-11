// Foothills shop: imported/batch invoices (C53568), Parts Sale Estimate and Part Sale Credit (C53543).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P49.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:API,m,p,b:b||null});
const bin=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  const ab=await r.arrayBuffer(); const u=new Uint8Array(ab); let s=''; for(let i=0;i<u.length;i++) s+=String.fromCharCode(u[i]);
  return {status:r.status,len:u.length,ctype:r.headers.get('content-type'),body:s};},{a:API,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results','workOrders','partSales']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w}); return await stored(); };

R.found=await stored(); log('Foothills design as found:', R.found);
// imported + batches here
const imp=await api('GET','/api/work-orders-imported?pagination[page]=1&pagination[rowsPerPage]=50');
R.imported={status:imp.status, rows:imp.status===200?rowsOf(imp.json).length:0};
log('work-orders-imported -> %s rows=%d', imp.status, R.imported.rows);
if(R.imported.rows){ R.importedSample=rowsOf(imp.json).slice(0,3); log('  sample:',JSON.stringify(R.importedSample).slice(0,400)); }
const bt=await api('GET','/api/customers/ibs/list-batches?pagination[page]=1&pagination[rowsPerPage]=50');
R.batches={status:bt.status, rows:bt.status===200?rowsOf(bt.json).length:0, text:bt.text.slice(0,200)};
log('ibs batches -> %s rows=%d', bt.status, R.batches.rows);
save();

// Parts Sale Estimate + any part sale credit
const ps=rowsOf((await api('GET','/api/part-sales?limit=200')).json);
R.partSaleStatuses=ps.reduce((a,p)=>{a[p.status]=(a[p.status]||0)+1;return a;},{});
log('part sales here: %d %s', ps.length, JSON.stringify(R.partSaleStatuses));
const psEst=ps.find(p=>p.status==='estimate');
R.psEstimate=psEst?{num:psEst.number,id:psEst.id}:null;
log('part sale estimate pick:', JSON.stringify(R.psEstimate));
// its document id, by loading its Finance tab and catching the preview call
const net=[]; page.on('request',r=>{const u=r.url(); if(/invoices\/preview/.test(u)) net.push(u);});
if(psEst){
  await page.goto(`${APP}/parts/part-sale/${psEst.id}/finance`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(14000);
  const m=net.length?net[net.length-1].match(/invoice_id=([0-9a-f-]+).*?isEstimate=(\d)/):null;
  R.psEstimateDoc=m?{invoiceId:m[1], isEstimate:m[2]}:null;
  log('part sale estimate document:', JSON.stringify(R.psEstimateDoc));
  await page.screenshot({path:`${DIR}/evidence/P49-partsale-estimate.png`});
}
save();
// render it under both designs
if(R.psEstimateDoc){
  R.psRenders={};
  for(const want of ['legacy','modern']){
    const now=await setDesign(want); if(now!==want){log('could not set',want);continue;}
    const a=await stored();
    const r=await bin(`/api/invoices/preview?invoice_id=${R.psEstimateDoc.invoiceId}&type=html&isEstimate=${R.psEstimateDoc.isEstimate}&includeDeclined=0&historyEvent=`);
    const b=await stored();
    if(a!==b){R.guardDiscards.push({want,before:a,after:b}); continue;}
    const t=r.body.replace(/<[^>]+>/g,'\n');
    R.psRenders[want]={design:a,status:r.status,len:r.len,
      caps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO|SUMMARY/.test(t),
      money:(t.match(/\$[\d,]+\.\d{2}/g)||[]).sort(),
      docNo:(t.match(/\b(?:INV|EST)-[A-Z0-9-]+/)||[])[0]||null};
    fs.writeFileSync(`${DIR}/evidence/P49-${want}-partsale-estimate.html`, r.body);
    log('  parts sale estimate under %s: %s len=%d docNo=%s', want, r.status, r.len, R.psRenders[want].docNo);
  }
  const L=R.psRenders.legacy,M=R.psRenders.modern;
  if(L&&M) { R.psVerdict={legacyLen:L.len,modernLen:M.len,differs:L.len!==M.len,
    docNoSame:L.docNo===M.docNo, moneyOnlyL:L.money.filter(x=>!M.money.includes(x)), moneyOnlyM:M.money.filter(x=>!L.money.includes(x))};
    log('PARTS SALE ESTIMATE VERDICT %s', JSON.stringify(R.psVerdict)); }
}
save();
R.restored=await setDesign(R.found); log('restored Foothills to:', R.restored);
save(); log('done'); await s.browser.close(); process.exit(0);
