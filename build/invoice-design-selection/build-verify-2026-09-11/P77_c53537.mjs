// C53537 - the test's own steps. No location calls; a clean boot lands on Heavy Duty.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const CUST='2a4b998e-a24e-42f2-b443-1ff4367ebde4';   // Tucson Truck Center
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P77.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872',`/customers/${CUST}/work-orders`,'admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:API,m,p,b:b||null});
const bar=()=>page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/ - \d+/.test(x))||null;},VIS);
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
await page.waitForTimeout(15000);
R.location=await bar(); R.design=await stored();
log('location: %s | design: %s', R.location, R.design);
if(!/Heavy Duty/.test(R.location||'')){ log('not on Heavy Duty; stopping'); save(); await s.browser.close(); process.exit(1); }
// Step 2: click Invoices
const clicked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item,div')].filter(isVis)
    .filter(x=>/^Invoices?(\s*\(\d+\))?$/i.test(t(x))).sort((a,b)=>t(a).length-t(b).length)[0];
  if(e2){e2.click(); return t(e2);} return null;},VIS);
await page.waitForTimeout(16000);
R.tab={clicked, url:page.url(),
  headers:await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>(t.innerText||'').trim())),
  rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map((r,i)=>`${i}: ${(r.innerText||'').replace(/\s+/g,' ').slice(0,180)}`)),
  checkboxes:await page.evaluate(()=>document.querySelectorAll('tbody .q-checkbox, tbody input[type=checkbox]').length),
  buttons:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-14);},VIS)};
log('Invoices tab "%s": %d rows, %d checkboxes', clicked, R.tab.rows.length, R.tab.checkboxes);
log('  headers: %s', JSON.stringify(R.tab.headers));
for(const r of R.tab.rows.slice(0,14)) log('   ', r);
log('  buttons: %s', JSON.stringify(R.tab.buttons));
await page.screenshot({path:`${DIR}/evidence/P77-invoices-tab.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
