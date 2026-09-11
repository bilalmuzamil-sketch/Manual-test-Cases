// The Part Sale Credit - the 6th document for C53543. Dteem shop, S1-3 carries one.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APIH='sv9872api.qa.shopview.com', APP='https://sv9872.qa.shopview.com';
const WO='17968bca-4c44-469b-8e7f-b95402cb96cb';   // S1-3
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P85.json`, JSON.stringify(R,null,1));
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
const api=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  return {status:r.status,text:await r.text()};},{a:APIH,p});
const st=await api('/api/organizations/invoice-settings/view');
R.session=st.status; log('session: %s %s', st.status, st.status===200?('design='+JSON.parse(st.text).data.documentDesign):st.text.slice(0,80));
if(st.status!==200){ log('session dead - stopping'); save(); await browser.close(); process.exit(1); }
const w=await api(`/api/work-orders/view/${WO}`);
const j=JSON.parse(w.text).data.work_order;
log('S1-3: status=%s has_part_sale_credits=%s invoice=%s', j.status, j.has_part_sale_credits, j.invoice_id);
// every path in the record mentioning a part sale credit
function walk(o,p,out){ if(o&&typeof o==='object'){ for(const k of Object.keys(o)){ const v=o[k], q=p+'.'+k;
  if(/part.?sale.?credit|partSaleCredit/i.test(k)) out.push(q+' = '+JSON.stringify(v).slice(0,500));
  walk(v,q,out);} } }
const hits=[]; walk(j,'',hits);
R.fields=hits; for(const h of hits) log('  ', h);
// part sales in this shop, and any credit-shaped ones
const ps=await api('/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=200');
let rows=[]; try{ rows=JSON.parse(ps.text).data.partSales||[]; }catch(e){}
R.partSales=rows.map(x=>({n:x.number,st:x.status,t:x.totalPrice}));
log('part sales in this shop: %d %s', rows.length, JSON.stringify(R.partSales).slice(0,400));
// candidate listing routes
for(const p of [`/api/work-orders/${WO}/part-sale-credits`,`/api/part-sales/credits?work_order_id=${WO}`,
                `/api/work-orders/${WO}/parts/credits`,`/api/part-sales-credits?work_order_id=${WO}`,
                `/api/part-sales/list-credits?work_order_id=${WO}`]){
  const r=await api(p); log('%s %s :: %s', r.status, p.slice(0,60), r.text.slice(0,150).replace(/\s+/g,' '));
}
save(); log('done'); await browser.close(); process.exit(0);
