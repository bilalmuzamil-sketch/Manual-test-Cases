// C53536/37/38/53543 - the credit documents, rendered under both designs, guarded.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APIH='sv9872api.qa.shopview.com', APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P36.json`, JSON.stringify(R,null,1));
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
 {name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const page=await ctx.newPage();
await page.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(5000);
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,400)};},{a:APIH,m,p,b:b||null});
const raw=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  const t=await r.text(); return {status:r.status,len:t.length,body:t};},{a:APIH,p});
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};

R.found=await stored(); log('design as found in this org:', R.found);

// --- what exactly are these credits?
const DOCS=[{wo:'17968bca-4c44-469b-8e7f-b95402cb96cb', woNum:'S1-3', inv:'4278f8ee-dd00-444d-8544-9c1ff693c381', invNum:'S-3'},
            {wo:'98710e3b-25a7-470c-a853-0595aa1642c5', woNum:'S1-4', inv:'a6ab5c03-6551-46f9-bc5d-3b5ecae2f447', invNum:'S-4'}];
R.creditDetail={};
for(const d of DOCS){
  const v=(await api('GET',`/api/work-orders/view/${d.wo}`)).json;
  let x=(v&&(v.data||v))||{}; if(x.work_order)x=x.work_order;
  R.creditDetail[d.woNum]={is_credit:x.is_credit, number:x.number, status:x.status,
    credited:x.credited_invoice_id||x.credit_invoice_id||x.original_invoice_id||null,
    has_part_sale_credits:x.has_part_sale_credits, total:x.total, invoice_id:x.invoice_id,
    creditKeys:Object.keys(x).filter(k=>/credit/i.test(k))};
  log('%s -> is_credit=%s status=%s credited=%s keys=%s', d.woNum, x.is_credit, x.status,
      R.creditDetail[d.woNum].credited, JSON.stringify(R.creditDetail[d.woNum].creditKeys));
}
save();

const look=(html)=>{const t=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,'\n');
  const lines=t.split('\n').map(x=>x.trim()).filter(Boolean);
  return {len:html.length, ibs:/IBS#/.test(t),
    caps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO|SUMMARY/.test(t),
    sentence:/Bill To|Remit payment to|Line Total/.test(t),
    docNo:(t.match(/\b(?:INV|EST|CR|CM)-[A-Z0-9-]+/)||[])[0]||null,
    money:(t.match(/\$-?[\d,]+\.\d{2}/g)||[]).sort(),
    isCreditWord:/credit/i.test(t), head:lines.slice(0,10).join(' | ')};};
const guardRender=async(invId,isEst=0)=>{const a=await stored();
  const r=await raw(`/api/invoices/preview?invoice_id=${invId}&type=html&isEstimate=${isEst}&includeDeclined=0&historyEvent=`);
  const b=await stored();
  if(a!==b){R.guardDiscards.push({invId,before:a,after:b}); return null;}
  return r.status===200?{design:a,...look(r.body),body:r.body}:{design:a,status:r.status};};

// --- find the change-design payload shape (try, verify, never assume)
const setDesign=async(want)=>{
  if((await stored())===want) return want;
  for(const body of [{design:want},{documentDesign:want},{invoice_design:want},{value:want}]){
    const r=await api('POST','/api/organizations/invoice-settings/change-design', body);
    const now=await stored();
    if(now===want){ R.changeDesignPayload=body; log('  change-design accepted %s -> %s', JSON.stringify(body), now); return now; }
    log('  tried %s -> %s (%s)', JSON.stringify(body), r.status, now);
  }
  return await stored();
};

R.renders={};
for(const want of ['legacy','modern']){
  const now=await setDesign(want);
  log('=== design now: %s (asked %s)', now, want);
  if(now!==want){ log('   could NOT set it - skipping this half'); continue; }
  R.renders[want]={};
  for(const d of DOCS){
    const g=await guardRender(d.inv,0);
    if(!g){ log('   discarded %s', d.invNum); continue; }
    R.renders[want][d.invNum]={design:g.design,len:g.len,ibs:g.ibs,caps:g.caps,sentence:g.sentence,
      docNo:g.docNo,money:g.money,head:g.head};
    fs.writeFileSync(`${DIR}/evidence/P36-${want}-${d.invNum}.html`, g.body||'');
    log('   %s under %s: len=%s ibs=%s caps=%s docNo=%s', d.invNum, want, g.len, g.ibs, g.caps, g.docNo);
    log('      head: %s', (g.head||'').slice(0,200));
  }
  save();
}
// compare
R.verdict=[];
for(const d of DOCS){
  const L=(R.renders.legacy||{})[d.invNum], M=(R.renders.modern||{})[d.invNum];
  if(!L||!M){R.verdict.push({doc:d.invNum,note:'not rendered under both'});continue;}
  R.verdict.push({doc:d.invNum, legacyLen:L.len, modernLen:M.len, looksDifferent:L.len!==M.len,
    docNoSame:L.docNo===M.docNo, docNo:L.docNo,
    moneyOnlyLegacy:L.money.filter(x=>!M.money.includes(x)),
    moneyOnlyModern:M.money.filter(x=>!L.money.includes(x)),
    ibsL:L.ibs, ibsM:M.ibs});
}
for(const v of R.verdict) log('VERDICT %s', JSON.stringify(v));
save();
R.restored=await setDesign(R.found); log('restored this org to:', R.restored);
log('guard discards:', R.guardDiscards.length);
save(); log('done'); await browser.close(); process.exit(0);
