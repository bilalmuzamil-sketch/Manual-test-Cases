// The Part Sale Credit document on the customer the QA lead pointed at.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const CUST='928a4583-13a3-4d73-af64-9397ffc425dc';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P90.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872',`/customers/${CUST}/work-orders`,'admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  return {status:r.status,text:await r.text()};},{a:API,p});
await page.waitForTimeout(15000);
R.location=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/ - \d+/.test(x))||null;},VIS);
log('location: %s | url: %s', R.location, page.url());
// the customer record + account
const cv=await api(`/api/customers/view/${CUST}`);
if(cv.status===200){
  const co=JSON.parse(cv.text).data.company;
  R.customer={name:co.name, account:co.customer_account_id, term:co.credit_term, psc:co.part_sale_credit_count};
  log('customer: %s | terms %s | account %s', co.name, co.credit_term, co.customer_account_id);
  log('  part/credit fields: %s', JSON.stringify(Object.entries(co).filter(([k])=>/part|credit/i.test(k)).map(([k,v])=>`${k}=${JSON.stringify(v).slice(0,30)}`)));
} else log('customers/view ->', cv.status, cv.text.slice(0,120));
save();
// click through to Invoices and capture what the tab loads
seen();
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-tab,[role=tab],a,.q-item,div')].filter(isVis)
    .filter(x=>/^Invoices?(\s*\(\d+\))?$/i.test(t(x))).sort((a,b)=>t(a).length-t(b).length)[0];
  if(e2)e2.click();},VIS);
await page.waitForTimeout(16000);
R.tab={url:page.url(),
  headers:await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>(t.innerText||'').trim())),
  rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map((r,i)=>`${i}: ${(r.innerText||'').replace(/\s+/g,' ').slice(0,180)}`)),
  calls:seen().filter(c=>/credit|invoice|part/i.test(c.u)).map(c=>c.m+' '+c.u).slice(-12)};
log('Invoices tab: %d rows', R.tab.rows.length);
for(const r of R.tab.rows.slice(0,14)) log('   ', r);
log('calls: %s', JSON.stringify(R.tab.calls));
await page.screenshot({path:`${DIR}/evidence/P90-customer-invoices.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
