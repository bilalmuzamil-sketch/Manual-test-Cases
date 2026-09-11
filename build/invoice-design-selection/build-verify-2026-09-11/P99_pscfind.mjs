import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APIH='sv9872api.qa.shopview.com', APP='https://sv9872.qa.shopview.com';
const CUST='15b3d06c-8ffc-4b92-8459-2ebc7f53c41a';  // Derrick's Mobile Truck Repair, 3 part sale credits
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P99.json`, JSON.stringify(R,null,1));
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
const co=JSON.parse((await api(`/api/customers/view/${CUST}`)).text).data.company;
R.customer={name:co.name, acct:co.customer_account_id, psc:co.part_sale_credit_count, ps:co.part_sale_count};
log('customer: %s | part sales %s | part sale credits %s | account %s', co.name, co.part_sale_count, co.part_sale_credit_count, co.customer_account_id);
const ACC=co.customer_account_id;
// where do they show up?
const u=await api(`/api/customer-account/list-unpaid-transaction?account_id=${ACC}&pagination[page]=1&pagination[rowsPerPage]=100`);
if(u.status===200){
  const c=(JSON.parse(u.text).data.response.collection)||[];
  R.unpaid=c.map(t=>({type:t.type,label:t.type_label,num:t.invoice_number,st:t.status,amt:t.amount,id:t.id,
                      origins:(t.origin_invoices||[]).map(o=>o.invoice_number)}));
  log('unpaid transactions: %d', c.length);
  for(const t of R.unpaid) log('   %s | %s | %s | %s | %s | origins %s', t.type, t.label, t.num, t.st, t.amt, JSON.stringify(t.origins));
}
save();
// the part sales of this customer (a part sale credit may be a part sale with a credit flag)
const ps=await api(`/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=200`);
let rows=[]; try{ rows=JSON.parse(ps.text).data.partSales||[]; }catch(e){}
R.theirPartSales=rows.filter(x=>/derrick/i.test(String(x.companyName||''))).map(x=>({n:x.number,st:x.status,t:x.totalPrice,id:x.id}));
log('their part sales: %s', JSON.stringify(R.theirPartSales));
save(); log('done'); await browser.close(); process.exit(0);
