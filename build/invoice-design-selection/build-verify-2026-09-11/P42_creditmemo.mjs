// C53536/53537/53538 - the credit memo documents (CM-103, CM-104), rendered under both designs.
// Routes recovered from the app's own code: customer-payment/list and credit-memos/{id}/pdf.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APIH='sv9872api.qa.shopview.com', APP='https://sv9872.qa.shopview.com';
const CUST='f6ed9314-2c93-41d5-bd89-f09d5327e5e9';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P42.json`, JSON.stringify(R,null,1));
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
  return {status:r.status, len:u.length, ctype:r.headers.get('content-type'), body:s};},{a:APIH,p});
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w});
  return await stored(); };

R.found=await stored(); log('design as found:', R.found);
// --- list the customer payments / credit memos
for(const qs of [`customer_id=${CUST}`, `pagination[page]=1&pagination[rowsPerPage]=100`, '']){
  const r=await api('GET',`/api/customer-payment/list?${qs}`);
  if(r.status!==200){ log('list %s -> %s', qs.slice(0,30), r.status); continue; }
  const j=r.json; const rows=(j&&j.data&&(j.data.collection||j.data))||[];
  const arr=Array.isArray(rows)?rows:[];
  log('customer-payment/list?%s -> %d rows', qs.slice(0,40), arr.length);
  const cms=arr.filter(x=>/^CM-/.test(String(x.credit_memo_number||x.number||x.label||'')) || x.is_credit || x.credit_memo_id);
  if(arr.length){ R.paymentSample=arr.slice(0,3); log('   sample:', JSON.stringify(arr.slice(0,2)).slice(0,600)); }
  if(cms.length){ R.creditMemos=cms; log('   CREDIT MEMOS: %s', JSON.stringify(cms).slice(0,700)); break; }
}
save();
// --- resolve the credit memo ids
let ids=[];
if(R.creditMemos) ids=R.creditMemos.map(c=>({id:c.credit_memo_id||c.id, num:c.credit_memo_number||c.number||c.label}));
if(!ids.length && R.paymentSample) ids=R.paymentSample.map(c=>({id:c.credit_memo_id||c.id, num:c.credit_memo_number||c.number||c.label}));
log('credit memo ids to render:', JSON.stringify(ids));
R.ids=ids; save();

R.renders={};
for(const want of ['legacy','modern']){
  const now=await setDesign(want); log('=== design now %s', now);
  if(now!==want) { log('   could not set'); continue; }
  R.renders[want]={};
  for(const d of ids){
    if(!d.id) continue;
    const a=await stored();
    const r=await bin(`/api/credit-memos/${d.id}/pdf`);
    const b=await stored();
    if(a!==b){ R.guardDiscards.push({id:d.id,before:a,after:b}); log('   discarded %s', d.num); continue; }
    R.renders[want][d.num]={design:a,status:r.status,len:r.len,ctype:r.ctype};
    if(r.status===200) fs.writeFileSync(`${DIR}/evidence/P42-${want}-${String(d.num).replace(/\W+/g,'_')}.pdf`, Buffer.from(r.body,'binary'));
    log('   %s under %s: %s %d bytes %s', d.num, want, r.status, r.len, r.ctype);
  }
  save();
}
R.restored=await setDesign(R.found); log('restored to:', R.restored);
save(); log('done'); await browser.close(); process.exit(0);
