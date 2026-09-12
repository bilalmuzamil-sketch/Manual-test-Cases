// PRODUCTION -- READ ONLY. Find one existing record of every kind the suite needs, so that when the
// run starts nothing has to be hunted for. Nothing is created, changed or deleted here.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com', APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true, at:new Date().toISOString(), found:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR4.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const vis=()=>{};
const rowsOn=async(url,re)=>{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(12000);
  return await page.evaluate((rs)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const rx=new RegExp(rs);
    return [...document.querySelectorAll('tr,[role=row]')].filter(ok)
      .map(r=>(r.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>rx.test(t)).slice(0,6);}, re);
};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
const api=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  return {s:r.status,t:(await r.text()).slice(0,3000)};},{a:APIH,p});
R.designNow=await (async()=>{const r=await api('/api/organizations/invoice-settings/view');
  try{return JSON.parse(r.t).data.documentDesign;}catch(e){return null;}})();
L('build %s | design right now: %s', R.build, R.designNow);

for (const [k,url,re] of [
  ['estimates', `${APP}/workorders?status=estimate`, 'S\\d?-\\d+'],
  ['invoiced',  `${APP}/workorders?status=invoiced`, 'S\\d?-\\d+'],
  ['paid',      `${APP}/workorders?status=paid`,     'S\\d?-\\d+'],
]){
  const rows=await rowsOn(url,re);
  R.found[k]={n:rows.length, samples:rows.map(t=>t.slice(0,90))};
  L('%s: %d | %s', k, rows.length, JSON.stringify(rows[0]||'').slice(0,100));
  await page.screenshot({path:`${DIR}/PR4-${k}.png`, fullPage:true});
  save();
}
// part sales and customers with credits
const ps=await rowsOn(`${APP}/parts/part-sales`, '.');
R.found.partSales={n:ps.length, samples:ps.slice(0,4).map(t=>t.slice(0,90))};
L('part sales rows: %d | %s', ps.length, JSON.stringify(ps[0]||'').slice(0,100));
await page.screenshot({path:`${DIR}/PR4-partsales.png`, fullPage:true});
const cu=await rowsOn(`${APP}/customers`, '.');
R.found.customers={n:cu.length, samples:cu.slice(0,4).map(t=>t.slice(0,90))};
L('customer rows: %d | %s', cu.length, JSON.stringify(cu[0]||'').slice(0,100));
await page.screenshot({path:`${DIR}/PR4-customers.png`, fullPage:true});
save();
L('done'); await browser.close(); process.exit(0);
