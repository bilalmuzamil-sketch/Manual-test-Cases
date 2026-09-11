// C53568: an imported invoice must be UNAFFECTED by the Invoice Design setting.
// Positive control in the same pass: an ordinary invoice, which MUST change.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const API='sv9872api.qa.shopview.com';
const IMP='63c3a6db-4282-4e65-8531-7380b03a7368';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P55.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/','admin'); const page=s.page;
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:API,m,p,b:b||null});
const bin=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  const ab=await r.arrayBuffer(); const u=new Uint8Array(ab); let s=''; for(let i=0;i<u.length;i++) s+=String.fromCharCode(u[i]);
  return {status:r.status,len:u.length,ctype:r.headers.get('content-type'),body:s};},{a:API,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w}); return await stored(); };
await page.waitForTimeout(6000);
R.found=await stored(); log('design as found:', R.found);
// the positive control: an ordinary work-order invoice
const inv=rowsOf((await api('GET','/api/invoices/list?limit=50')).json);
const ctrl=inv[0]; R.control={num:ctrl.invoice_number, id:ctrl.id};
log('positive control (an ordinary invoice):', JSON.stringify(R.control));
R.runs={};
for(const want of ['legacy','modern']){
  const now=await setDesign(want); if(now!==want){log('could not set',want);continue;}
  const a=await stored();
  const impPdf=await bin(`/api/imported-work-orders/${IMP}/pdf`);
  const ctlPdf=await bin(`/api/invoices/preview?invoice_id=${ctrl.id}&type=pdf&isEstimate=0&includeDeclined=0&historyEvent=`);
  const b=await stored();
  if(a!==b){R.guardDiscards.push({want,before:a,after:b}); log('DISCARDED',want); continue;}
  R.runs[want]={design:a, imported:{s:impPdf.status,len:impPdf.len,ctype:impPdf.ctype},
                control:{s:ctlPdf.status,len:ctlPdf.len}};
  if(impPdf.status===200) fs.writeFileSync(`${DIR}/evidence/P55-${want}-imported.pdf`, Buffer.from(impPdf.body,'binary'));
  if(ctlPdf.status===200) fs.writeFileSync(`${DIR}/evidence/P55-${want}-control.pdf`, Buffer.from(ctlPdf.body,'binary'));
  log('  under %s: imported %s %d bytes | control invoice %s %d bytes', want,
      impPdf.status, impPdf.len, ctlPdf.status, ctlPdf.len);
  save();
}
const L=R.runs.legacy, M=R.runs.modern;
if(L&&M){
  R.verdict={
    importedUNCHANGED: L.imported.len===M.imported.len,
    importedLegacyBytes:L.imported.len, importedModernBytes:M.imported.len,
    controlCHANGED: L.control.len!==M.control.len,
    controlLegacyBytes:L.control.len, controlModernBytes:M.control.len};
  log('VERDICT %s', JSON.stringify(R.verdict));
}
save();
R.restored=await setDesign(R.found); log('restored to:', R.restored);
save(); log('done'); await s.browser.close(); process.exit(0);
