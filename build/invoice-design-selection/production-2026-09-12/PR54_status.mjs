// PRODUCTION -- why did Set status -> Complete not take? Dump exactly what the menu offers and what
// happens after each click, instead of assuming my selector matched.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const WO={n:'S2-849', id:'d7ba2cfd-896c-46b3-b451-ea11815b294f'};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), steps:{}, net:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR54.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)&&r.method()!=='GET') R.net.push(`${r.method()} ${u.replace('https://api.shopview.com','')}`);});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const woStatus=async()=>{const d=await call(`/api/work-orders/view/${WO.id}`); let x=(d.j&&(d.j.data||d.j))||{};
  if(x.work_order) x=x.work_order; return {status:x.status, editable:x.editable};};
R.steps.before=await woStatus(); L('before: %s', JSON.stringify(R.steps.before));
await page.goto(`${APP}/workorders/${WO.id}/lines`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
L('onRecord=%s', await page.evaluate(n=>(document.body.innerText||'').includes(n), WO.n));
// the status badge itself may be the control
R.steps.badge=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="badge_wo_status"]');
  return b?{text:(b.textContent||'').trim(), clickable:true}:null;});
L('status badge: %s', JSON.stringify(R.steps.badge));
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="badge_wo_status"]'); b&&b.click();});
await page.waitForTimeout(3000);
R.steps.badgeMenu=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-menu .q-item,[role=option],[role=menuitem]')].filter(ok)
    .map(e=>({txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,40), tid:e.getAttribute('data-test-id')||null})).slice(0,20);});
L('menu from the status badge: %s', JSON.stringify(R.steps.badgeMenu));
await page.screenshot({path:`${EV}/PR54-badge-menu.png`, fullPage:true});
save();
const pick=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const it=[...document.querySelectorAll('.q-menu .q-item,[role=option],[role=menuitem]')].filter(ok)
    .find(e=>/complete/i.test((e.textContent||'').trim()));
  if(!it) return null; it.click(); return (it.textContent||'').replace(/\s+/g,' ').trim().slice(0,40);});
L('picked from badge menu: %s', pick); R.steps.picked=pick;
await page.waitForTimeout(6000);
R.steps.dialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,260),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').trim()).filter(Boolean)};});
L('dialog: %s', JSON.stringify(R.steps.dialog));
if(R.steps.dialog&&R.steps.dialog.buttons.length){
  const go=R.steps.dialog.buttons.find(b=>/^(confirm|yes|ok|complete|save|continue)$/i.test(b));
  if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').trim()===lab); if(b) b.click();}, go);
    L('confirmed "%s"', go); await page.waitForTimeout(10000); } }
await page.waitForTimeout(4000);
await page.screenshot({path:`${EV}/PR54-after.png`, fullPage:true});
R.steps.after=await woStatus();
R.steps.writes=R.net;
L('after: %s | writes: %s', JSON.stringify(R.steps.after), JSON.stringify(R.net));
// and can we invoice now?
await page.goto(`${APP}/workorders/${WO.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
R.steps.createInvoice=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/^Create Invoice$/i.test((e.innerText||'').trim()));
  return {present:!!b, disabled:b?b.disabled:null};});
L('Create Invoice now: %s', JSON.stringify(R.steps.createInvoice));
save(); await browser.close();
