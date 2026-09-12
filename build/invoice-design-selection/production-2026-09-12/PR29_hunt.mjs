// PRODUCTION -- locate a Part Sale Credit (the sixth document type) and any batch / imported invoice.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PR29.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,200)};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
// 1. a paid part sale's Finance tab -- does it offer or list a credit?
const ps=rowsOf((await call('/api/part-sales?limit=100')).j);
const paid=ps.find(p=>/paid|invoiced/i.test(String(p.status||'')));
L('paid part sale: %s %s', paid&&paid.number, paid&&paid.id);
if(paid){
  await page.goto(`${APP}/parts/part-sale/${paid.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(15000);
  R.partSaleFinance=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const body=(document.body.innerText||'').replace(/\s+/g,' ');
    return {buttons:[...document.querySelectorAll('button')].filter(ok).map(t).filter(x=>x&&x.length<28).slice(0,18),
      mentionsCredit:/credit/i.test(body), cmNumbers:[...new Set(body.match(/CM\d?-\d+/g)||[])]};});
  L('part sale finance buttons: %s', JSON.stringify(R.partSaleFinance.buttons));
  L('mentions credit: %s | credit numbers on the page: %s', R.partSaleFinance.mentionsCredit, JSON.stringify(R.partSaleFinance.cmNumbers));
  await page.screenshot({path:`${EV}/PR29-partsale-finance.png`, fullPage:true});
}
save();
// 2. sweep every customer's invoice list for credit rows, via the app's own customer list
const cs=rowsOf((await call('/api/customers?limit=200')).j);
L('customers: %d -- sweeping the first 12 for credit documents', cs.length);
R.creditsFound=[];
for(const c of cs.slice(0,12)){
  await page.goto(`${APP}/customers/${c.id}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(9000);
  const hits=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    return [...document.querySelectorAll('tr,[role=row]')].filter(ok)
      .map(r=>(r.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>/\bCredit\b/.test(t)&&/CM\d?-\d+/.test(t)).slice(0,4);});
  if(hits.length){ R.creditsFound.push({customer:c.name||c.id, rows:hits});
    L('  %s -> %s', (c.name||c.id).slice(0,26), JSON.stringify(hits).slice(0,140)); }
}
L('customers carrying credit documents: %d', R.creditsFound.length);
save();
// 3. batch / imported invoices
for(const p of ['/api/invoices?limit=50&is_imported=1','/api/batch-invoices?limit=20','/api/invoices/imported?limit=20']){
  const r=await call(p); L('try %s -> %s %s', p, r.s, r.s===200?`rows ${rowsOf(r.j).length}`:r.t.slice(0,60));
}
L('done'); save(); await browser.close(); process.exit(0);
