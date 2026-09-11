import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', APIH='sv9872api.qa.shopview.com';
const CUST='f6ed9314-2c93-41d5-bd89-f09d5327e5e9';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P34.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9872-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1600,height:1100}});
await ctx.addCookies([
 {name:'sv_sso_session',value:C.sv_sso_session,domain:'sv9872.qa.shopview.com',path:'/',secure:true},
 {name:'sv_sso_session',value:C.sv_sso_session,domain:APIH,path:'/',secure:true},
 {name:'PHPSESSID',value:C.PHPSESSID,domain:'sv9872.qa.shopview.com',path:'/',secure:true},
 {name:'PHPSESSID',value:C.PHPSESSID,domain:APIH,path:'/',secure:true},
 {name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true},
]);
const page=await ctx.newPage();
await page.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(6000);
const api=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,900)};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};

R.setting=(await api('/api/organizations/invoice-settings/view')).json;
R.design=((R.setting&&(R.setting.data||R.setting))||{}).documentDesign;
log('this org design setting:', R.design);
const me=await api('/api/auth/me'); R.me=me.text.slice(0,300); log('me:', R.me.slice(0,200));
const cust=await api(`/api/customers/view/${CUST}`);
R.customerName=((cust.json&&cust.json.data&&cust.json.data.company)||{}).name;
log('customer:', R.customerName);
// hunt for the credit documents, every endpoint that could list them
R.hunt={};
for(const p of [
  `/api/invoices/list?limit=300`,
  `/api/customers/${CUST}/invoices`,
  `/api/invoices/list?customer_id=${CUST}&limit=300`,
  `/api/invoices/list?filters[0][field]=customer&filters[0][value]=${CUST}&limit=300`,
  `/api/credit-memos/list`,
  `/api/credit-memos/view`,
  `/api/customers/${CUST}/credit-memos`,
  `/api/customers/view/${CUST}/invoices`,
]){
  const r=await api(p); const rows=r.status===200?rowsOf(r.json):[];
  R.hunt[p]={status:r.status, rows:rows.length,
    numbers:rows.map(x=>x.invoice_number||x.number||x.id).slice(0,12),
    keys:rows[0]?Object.keys(rows[0]).slice(0,25):null};
  log('%-70s %s rows=%d %s', p, r.status, rows.length, JSON.stringify(R.hunt[p].numbers).slice(0,220));
}
save();
// and walk the UI page, capturing the exact call it makes
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push(r.method()+' '+u.replace(/^https?:\/\/[^/]+/,''));});
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(16000);
R.uiCalls=net.filter(c=>/invoice|credit|memo|customer/i.test(c)).slice(-15);
R.uiRows=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,180)));
R.uiText=await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,900));
log('UI calls:', JSON.stringify(R.uiCalls));
log('UI rows: %d', R.uiRows.length); for(const r of R.uiRows) log('   |', r);
log('UI text:', R.uiText.slice(0,400));
await page.screenshot({path:`${DIR}/evidence/P34-customer.png`, fullPage:true});
save();
log('done'); await browser.close(); process.exit(0);
