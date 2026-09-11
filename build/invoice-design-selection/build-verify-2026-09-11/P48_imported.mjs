// C53568 (imported + batch invoices unaffected) and the last two documents for C53543.
// Routes from the app's own code: work-orders-imported, imported-work-orders/{id}/pdf,
// customers/ibs/list-batches, customers/{id}/statement-pdf.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APIH='sv9872api.qa.shopview.com', APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P48.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9872-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true});
await ctx.addCookies([
 {name:'sv_sso_session',value:C.sv_sso_session,domain:'sv9872.qa.shopview.com',path:'/',secure:true},
 {name:'sv_sso_session',value:C.sv_sso_session,domain:APIH,path:'/',secure:true},
 {name:'PHPSESSID',value:C.PHPSESSID,domain:'sv9872.qa.shopview.com',path:'/',secure:true},
 {name:'PHPSESSID',value:C.PHPSESSID,domain:APIH,path:'/',secure:true},
 {name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const page=await ctx.newPage();
await page.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(5000);
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:APIH,m,p,b:b||null});
const bin=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  const ab=await r.arrayBuffer(); const u=new Uint8Array(ab); let s=''; for(let i=0;i<u.length;i++) s+=String.fromCharCode(u[i]);
  return {status:r.status,len:u.length,ctype:r.headers.get('content-type'),body:s};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results','workOrders','partSales']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w}); return await stored(); };

R.found=await stored(); log('design as found:', R.found);
// --- imported work orders
for(const qs of ['', 'pagination[page]=1&pagination[rowsPerPage]=50']){
  const r=await api('GET',`/api/work-orders-imported?${qs}`);
  const rows=r.status===200?rowsOf(r.json):[];
  log('work-orders-imported?%s -> %s rows=%d', qs.slice(0,20), r.status, rows.length);
  if(r.status===200 && rows.length){ R.imported=rows.slice(0,3); log('  sample:', JSON.stringify(rows.slice(0,2)).slice(0,400)); break; }
  if(r.status!==200) log('  body:', r.text.slice(0,200));
}
// --- IBS batches
const b=await api('GET','/api/customers/ibs/list-batches?pagination[page]=1&pagination[rowsPerPage]=50');
R.batches={status:b.status, rows:b.status===200?rowsOf(b.json).length:0, text:b.text.slice(0,300)};
log('ibs batches -> %s rows=%d %s', b.status, R.batches.rows, R.batches.text.slice(0,160));
save();
// --- render each imported invoice under both designs
if(R.imported && R.imported.length){
  R.importedRenders={};
  for(const want of ['legacy','modern']){
    const now=await setDesign(want); if(now!==want){log('could not set',want);continue;}
    R.importedRenders[want]={};
    for(const im of R.imported){
      const id=im.id||im.work_order_id;
      const a=await stored(); const r=await bin(`/api/imported-work-orders/${id}/pdf`); const bb=await stored();
      if(a!==bb){R.guardDiscards.push({id,before:a,after:bb}); continue;}
      R.importedRenders[want][im.number||id]={status:r.status,len:r.len,ctype:r.ctype};
      if(r.status===200) fs.writeFileSync(`${DIR}/evidence/P48-${want}-imported-${String(im.number||id).replace(/\W+/g,'_')}.pdf`, Buffer.from(r.body,'binary'));
      log('  imported %s under %s: %s %d bytes', im.number||id, want, r.status, r.len);
    }
    save();
  }
  R.importedVerdict=Object.keys(R.importedRenders.legacy||{}).map(k=>{
    const L=R.importedRenders.legacy[k], M=(R.importedRenders.modern||{})[k];
    return {doc:k, legacyBytes:L&&L.len, modernBytes:M&&M.len, UNCHANGED: !!(L&&M&&L.len===M.len)};});
  for(const v of R.importedVerdict) log('IMPORTED VERDICT %s', JSON.stringify(v));
}
save();
R.restored=await setDesign(R.found); log('restored to:', R.restored);
save(); log('done'); await browser.close(); process.exit(0);
