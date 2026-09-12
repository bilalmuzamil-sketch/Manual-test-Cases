// PRODUCTION -- find the CONTACTS route by opening a customer's Contacts tab with a listener
// attached, instead of guessing (three guesses already missed). Then find a customer that has
// contacts and an un-invoiced work order, for the C53570 Authorizer test.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), net:[], steps:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR44.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)) R.net.push(u.replace('https://api.shopview.com',''));});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,200)};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
// list customers
const cs=await call('/api/companies?limit=200');
let custs=rowsOf(cs.j);
if(!custs.length){ const c2=await call('/api/customers?limit=200'); custs=rowsOf(c2.j); R.steps.custRoute='/api/customers'; }
else R.steps.custRoute='/api/companies';
R.steps.customerCount=custs.length;
L('customers: %d via %s', custs.length, R.steps.custRoute);
R.steps.sample=custs.slice(0,6).map(c=>({id:c.id, n:c.name||c.company_name}));
save();
// open the first customer's Contacts tab and watch the network
const c0=custs[0];
const before=R.net.length;
await page.goto(`${APP}/customers/${c0.id}/contacts`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(13000);
await page.screenshot({path:`${EV}/PR44-contacts.png`, fullPage:true});
R.steps.contactsCalls=R.net.slice(before).filter(u=>/contact|compan|customer/i.test(u)).slice(0,15);
L('calls on the contacts tab: %s', JSON.stringify(R.steps.contactsCalls));
R.steps.screen=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {url:location.href, len:t.length, head:t.slice(0,260)};});
L('screen: %s', JSON.stringify(R.steps.screen).slice(0,300));
save();
const route=R.steps.contactsCalls.find(u=>/contact/i.test(u));
R.steps.contactRoute=route||null; L('contacts route: %s', route);
if(route){
  const tmpl=route.replace(c0.id,'{id}');
  R.steps.perCustomer=[];
  for(const c of custs.slice(0,40)){
    const r=await call(tmpl.replace('{id}',c.id));
    const n=r.s===200?rowsOf(r.j).length:-1;
    if(n>0) R.steps.perCustomer.push({id:c.id, name:c.name||c.company_name, contacts:n});
  }
  L('customers WITH contacts: %s', JSON.stringify(R.steps.perCustomer.slice(0,12)));
  save();
  // for each, find an un-invoiced work order
  const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
  R.steps.usable=[];
  for(const w of wos.filter(w=>/estimate|approved|in_progress|complete|ready/i.test(String(w.status||''))).slice(0,80)){
    const d=await call(`/api/work-orders/view/${w.id}`); let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
    const hit=R.steps.perCustomer.find(p=>p.id===(x.company_id||x.customer_id));
    if(hit) R.steps.usable.push({wo:w.number, id:w.id, st:x.status, customer:hit.name, contacts:hit.contacts});
    if(R.steps.usable.length>=6) break;
  }
  L('USABLE for the Authorizer test: %s', JSON.stringify(R.steps.usable));
}
save(); await browser.close();
