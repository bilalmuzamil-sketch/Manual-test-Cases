import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APIH='sv9872api.qa.shopview.com', APP='https://sv9872.qa.shopview.com';
const TARGETS=[['P2-57','b7c55aea-a608-48fb-9704-88c4feae519d'],['P2-54','1f162051-e98a-4f07-b30a-d33355e56d21']];
const ACC='9e7326cf-c26d-486a-ba28-93dca0c2bea7';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P101.json`, JSON.stringify(R,null,1));
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
// the payments on the account carry the credit ids
const p=await api(`/api/customer-payment/list?account_id=${ACC}&pagination[page]=1&pagination[rowsPerPage]=100`);
const rows=JSON.parse(p.text).data.collection||[];
log('payments on the account: %d', rows.length);
const creds=[];
for(const r of rows){
  for(const m of (r.applied_credit_memos||[])) creds.push({num:m.credit_number,id:m.credit_memo_id,amt:m.amount,reason:String(m.reason||'').slice(0,40)});
  for(const k of ['linked_credit_memo_id','linked_credit_memo_number']) if(r[k]) log('  linked:', k, r[k]);
}
const uniq={}; for(const c of creds) uniq[c.num]=c;
R.credits=Object.values(uniq);
log('credits found: %s', JSON.stringify(R.credits));
save();
// also the part sale detail for the credit reference
for(const [num,id] of TARGETS){
  const d=await api(`/api/invoices/${id}/details?includeDeclined=0`);
  if(d.status===200){
    const hits=[...new Set((d.text.match(/"[a-zA-Z_]*credit[a-zA-Z_]*"\s*:\s*("[^"]{0,40}"|\[[^\]]{0,200}\]|[a-z0-9.]{1,12})/gi)||[]))];
    log('%s details credit fields: %s', num, JSON.stringify(hits).slice(0,500));
  } else log('%s details -> %s', num, d.status);
}
save(); log('done'); await browser.close(); process.exit(0);
