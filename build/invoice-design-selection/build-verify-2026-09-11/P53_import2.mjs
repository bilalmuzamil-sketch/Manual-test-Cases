import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P53.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/invoices-import','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
// capture the POST response body
page.on('response',async r=>{ if(/imports\/work-order-historical/.test(r.url())){
  try{ R.postStatus=r.status(); R.postBody=(await r.text()).slice(0,1500); }catch(e){} }});
await page.waitForTimeout(13000);
// which location are we on, and which customers/locations exist?
const api=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  return {s:r.status,t:await r.text()};},{a:API,p});
const wp=JSON.parse((await api('/api/staff/my-workplaces')).t);
R.workplaces=((wp.data&&(wp.data.collection||wp.data))||[]).map(w=>w.name);
const cu=JSON.parse((await api('/api/customers?limit=5')).t);
R.customers=((cu.data&&(cu.data.collection||cu.data))||[]).map(c=>c.name).slice(0,5);
R.bar=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/ - \d+/.test(x))||null;},VIS);
log('on location: %s | workplaces: %s', R.bar, JSON.stringify(R.workplaces));
log('customers here: %s', JSON.stringify(R.customers));
// build the CSV for THIS location and a real customer here, header without asterisks
const LOC=(R.workplaces||[]).find(w=>R.bar&&R.bar.includes(w.split(' - ')[1])) || R.workplaces[0];
const CUSTOMER=R.customers[0];
const hdr='Shop Location,Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,Invoice Number,Invoice Date,PO,Service Advisor,Item,Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,Qty,Rate,Total,Tax Amount';
const row=(item,title,part,qty,rate,total,tax)=>
 `${LOC},${CUSTOMER},,2015,Freightliner,Cascadia,ZZAUTOTEST-1,Truck,120000,,ZZAUTOTEST-IMP-002,09/11/2026,ZZAUTOTEST,,${item},${title},Imported invoice design check,,${part},${part?'ZZAUTOTEST Part':''},${qty},${rate},${total},${tax}`;
const csv=[hdr,row('Labor','ZZAUTOTEST labor line','',2,'100.00','200.00','10.00'),
               row('Part','ZZAUTOTEST part line','ZZP-1',1,'50.00','50.00','2.50')].join('\n')+'\n';
const p=`${DIR}/evidence/zzautotest-import2.csv`; fs.writeFileSync(p,csv);
R.csv=csv; log('CSV built for location "%s", customer "%s"', LOC, CUSTOMER);
await page.setInputFiles('input[type=file]', p);
await page.waitForTimeout(6000);
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/^Import Invoices$/i.test(t(e))); if(b)b.click();},VIS);
await page.waitForTimeout(16000);
R.toasts=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,200));},VIS);
log('POST %s body: %s', R.postStatus, (R.postBody||'').slice(0,800));
log('toasts:', JSON.stringify(R.toasts).slice(0,400));
await page.screenshot({path:`${DIR}/evidence/P53-after-import.png`, fullPage:true});
const chk=await api('/api/work-orders-imported?pagination[page]=1&pagination[rowsPerPage]=50');
R.importedAfter=chk.t.slice(0,700);
log('work-orders-imported now:', chk.s, R.importedAfter.slice(0,450));
save(); log('done'); await s.browser.close(); process.exit(0);
