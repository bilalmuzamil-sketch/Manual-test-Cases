// C53537 end to end, following the test's steps of replication.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const CUST='2a4b998e-a24e-42f2-b443-1ff4367ebde4';
const WPS=[['Heavy Duty','b3c8c820-f815-4cf1-8938-10956c5ee71a'],['Lethbridge','f8a8b802-7780-4b16-bf10-343caeb616b2']];
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P71.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/','admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:API,m,p,b:b||null});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const bar=()=>page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/ - \d+/.test(x))||null;},VIS);
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w}); return await stored(); };
await page.waitForTimeout(9000);

// --- find the workplace that can see this customer's unpaid invoices
let ok=null;
for(const [name,id] of WPS){
  await api('POST','/api/iam/change-location',{workplace_id:id});
  await page.waitForTimeout(2000);
  const inv=rowsOf((await api('GET','/api/invoices/list?limit=300')).json);
  const mine=inv.filter(i=>i.customer_id===CUST);
  log('workplace %s: %d invoices total, %d for this customer %s', name, inv.length, mine.length,
      JSON.stringify(mine.map(i=>`${i.invoice_number}:${i.status}:${i.total_balance}`)));
  if(mine.filter(i=>i.status!=='paid').length>=2){ ok={name,id,invoices:mine}; break; }
}
if(!ok){ log('NO workplace shows two unpaid invoices for this customer - stopping before any write'); save(); await s.browser.close(); process.exit(1); }
R.workplace=ok.name; R.invoices=ok.invoices.map(i=>({n:i.invoice_number,st:i.status,bal:i.total_balance}));
log('using workplace: %s', ok.name);
R.design=await setDesign('modern'); log('design set to %s (the test precondition)', R.design);
save();

// --- open the customer and its Invoices tab by clicking through
await page.goto(`${APP}/customers/${CUST}/work-orders`,{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(14000);
log('on customer page, location bar: %s', await bar());
const clicked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item,div')].filter(isVis)
    .filter(x=>/^Invoices?(\s*\(\d+\))?$/i.test(t(x))).sort((a,b)=>t(a).length-t(b).length)[0];
  if(e2){e2.click(); return t(e2);} return null;},VIS);
await page.waitForTimeout(15000);
R.tab={clicked, url:page.url(),
  headers:await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>(t.innerText||'').trim())),
  rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map((r,i)=>`${i}: ${(r.innerText||'').replace(/\s+/g,' ').slice(0,170)}`)),
  checkboxes:await page.evaluate(()=>document.querySelectorAll('tbody .q-checkbox, tbody input[type=checkbox]').length),
  buttons:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-14);},VIS)};
log('Invoices tab (%s): %d rows, %d checkboxes', clicked, R.tab.rows.length, R.tab.checkboxes);
log('  headers:', JSON.stringify(R.tab.headers));
for(const r of R.tab.rows) log('   ', r);
log('  buttons:', JSON.stringify(R.tab.buttons));
await page.screenshot({path:`${DIR}/evidence/P71-invoices-tab.png`, fullPage:true});
save();
log('done'); await s.browser.close(); process.exit(0);
