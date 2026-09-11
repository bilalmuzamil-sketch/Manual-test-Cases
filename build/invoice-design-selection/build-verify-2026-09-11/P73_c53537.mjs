// C53537, clean: no location POSTs, paginate properly, click through to the Invoices tab.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P73.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/','admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:API,m,p,b:b||null});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w}); return await stored(); };
await page.waitForTimeout(9000);

// page through ALL invoices and find every customer with 2+ unpaid
let all=[];
for(let pg=1; pg<=8; pg++){
  const r=rowsOf((await api('GET',`/api/invoices/list?pagination[page]=${pg}&pagination[rowsPerPage]=100`)).json);
  all=all.concat(r); if(r.length<100) break;
}
R.invoiceCount=all.length;
const unpaid=all.filter(i=>i.status!=='paid');
const byCust={}; for(const i of unpaid) (byCust[i.customer_id]=byCust[i.customer_id]||[]).push(i);
const cands=Object.entries(byCust).filter(([,v])=>v.length>=2)
  .map(([cid,v])=>({cid, name:v[0].customer_company_name, invs:v.map(x=>({n:x.invoice_number,bal:x.total_balance,st:x.status}))}));
log('invoices seen: %d | unpaid: %d | customers with 2+ unpaid: %d', all.length, unpaid.length, cands.length);
for(const c of cands.slice(0,8)) log('   %s %s %s', c.cid.slice(0,8), c.name, JSON.stringify(c.invs.map(i=>`${i.n}:${i.bal}`)));
R.candidates=cands; save();
if(!cands.length){ log('no candidate customer; stopping'); await s.browser.close(); process.exit(1); }

R.design=await setDesign('modern'); log('design set to: %s', R.design);
// try each candidate until one renders its Invoices tab with checkboxes
for(const c of cands.slice(0,4)){
  await page.goto(`${APP}/customers/${c.cid}/work-orders`,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(13000);
  const clicked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const e2=[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item,div')].filter(isVis)
      .filter(x=>/^Invoices?(\s*\(\d+\))?$/i.test(t(x))).sort((a,b)=>t(a).length-t(b).length)[0];
    if(e2){e2.click(); return t(e2);} return null;},VIS);
  await page.waitForTimeout(15000);
  const info={cid:c.cid, name:c.name, clicked, url:page.url(),
    headers:await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>(t.innerText||'').trim())),
    rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,160))),
    checkboxes:await page.evaluate(()=>document.querySelectorAll('tbody .q-checkbox, tbody input[type=checkbox]').length),
    buttons:await page.evaluate(vis=>{const isVis=eval(vis);
      return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-12);},VIS)};
  log('%s (%s): tab=%s rows=%d checkboxes=%d', c.name, c.cid.slice(0,8), clicked, info.rows.length, info.checkboxes);
  log('   headers: %s', JSON.stringify(info.headers));
  for(const r of info.rows) log('     ', r);
  log('   buttons: %s', JSON.stringify(info.buttons));
  R.tried=(R.tried||[]).concat(info); save();
  if(info.rows.length){ R.chosen=info; await page.screenshot({path:`${DIR}/evidence/P73-invoices-tab.png`, fullPage:true}); break; }
}
save(); log('done'); await s.browser.close(); process.exit(0);
