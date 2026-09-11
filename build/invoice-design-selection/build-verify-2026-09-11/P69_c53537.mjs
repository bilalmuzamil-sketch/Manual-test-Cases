// C53537, following the test's own steps of replication.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P69.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/customers','admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:API,m,p,b:b||null});
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w}); return await stored(); };
await page.waitForTimeout(13000);
R.startDesign=await setDesign('modern'); log('design set to:', R.startDesign);   // precondition
// Step 1: go to the customer, via search
await page.evaluate(()=>{const i=document.querySelector('input[type=search],input[placeholder*="Search" i]'); if(i){i.focus();}});
await page.keyboard.type('Tucson Truck Center', {delay:40});
await page.waitForTimeout(7000);
const rows=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,90)));
log('customer search rows:', JSON.stringify(rows.slice(0,4)));
const opened=await page.evaluate(()=>{const r=[...document.querySelectorAll('tbody tr')].find(x=>/Tucson Truck Center/i.test(x.innerText||''));
  if(r){r.click(); return (r.innerText||'').replace(/\s+/g,' ').slice(0,80);} return null;});
await page.waitForTimeout(12000);
log('opened customer:', opened, '->', page.url());
// Step 2: click Invoices
const inv=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e=[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item,div')].filter(isVis)
    .filter(x=>/^Invoices?(\s*\(\d+\))?$/i.test(t(x))).sort((a,b)=>t(a).length-t(b).length)[0];
  if(e){e.click(); return t(e);} return null;},VIS);
await page.waitForTimeout(14000);
R.invoicesTab={clicked:inv, url:page.url(),
  headers:await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>(t.innerText||'').trim())),
  rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map((r,i)=>`${i}: ${(r.innerText||'').replace(/\s+/g,' ').slice(0,170)}`)),
  buttons:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-14);},VIS)};
log('Invoices tab: clicked=%s url=%s', inv, page.url());
log('  headers:', JSON.stringify(R.invoicesTab.headers));
log('  rows: %d', R.invoicesTab.rows.length); for(const r of R.invoicesTab.rows) log('    ', r);
log('  buttons:', JSON.stringify(R.invoicesTab.buttons));
await page.screenshot({path:`${DIR}/evidence/P69-invoices-tab.png`, fullPage:true});
save();
log('done'); await s.browser.close(); process.exit(0);
